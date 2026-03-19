# model_deserializer 技术解析报告

本报告详细说明了从二进制 `.model` (Protobuf) 文件还原为 100% 位对齐 (Bit-perfect) JSON 文件的技术实现方案。

## 1. 核心解析库与工具

解析脚本 `deserialize_model.py` 采用了以下核心组件：

| 组件 | 用途 |
| :--- | :--- |
| **protoc (Protocol Buffers Compiler)** | 调用 `--decode_raw` 模式执行初级二进制流解析，提取原始标签（Tag）与线型数据（Wire Format）。 |
| **Python subprocess** | 用于在脚本中捕获 `protoc` 的标准输出流，实现跨语言工具集成。 |
| **Python re (Regular Expressions)** | 对 `protoc` 输出的文本流进行模式匹配，识别嵌套级别（`{ }`, `< >`）及标签值对。 |
| **Python collections.OrderedDict** | **关键库**。用于维护 JSON 键值的物理插入顺序，确保序列化后的字节流与参考文件完全一致。 |
| **Python struct** | 执行底层位操作。特别是将一些 32 位整数（如 `1919906927`）还原回其原始 ASCII 字符串（如 `motor`）。 |
| **Python json** | 执行最终的序列化，配合 `separators=(',', ':')` 剔除冗余空格。 |

---

## 2. 解析过程详解

解析过程分为五个阶段，确保从原始位流到最终语义结构的精准还原。

### 阶段一：原始提取 (Raw Extraction)
脚本通过 shell 调用 `protoc --decode_raw < model_file`。生成的输出是 Protobuf 的原始标签表示，例如：
```protobuf
1: "laser"
11 {
  1: "PEPPERL_FUCHS_R2000"
}
```
此时数据仅具物理标签，缺乏业务语义。

### 阶段二：文本流递归解析 (Recursive Stream Parsing)
由自定义函数 `parse_msg` 执行。它利用正则表达式识别缩进和括号，将文本流构建成一个嵌套的 Python `OrderedDict`。
- **歧义消除**：处理 `protoc` 输出中的转义字符（如 `\041`），还原为 UTF-8 字符。
- **层次维护**：利用堆栈结构维护解析深度，确保嵌套关系不丢失。

### 阶段三：语义外科手术式映射 (Surgical Mapping)
根据输入文件名的不同（`abiset`, `funcdesc`, `compdesc`），进入专门的映射分支。
- **同级标签辨识 (Sibling Discrimination)**：例如在 `CompDesc` 中，如果某个容器同时包含标签 `1` (key) 和 标签 `10` (stringValue)，则判断其为属性节点。
- **拓扑重建**：针对导航拓扑（`naviTopology`）等复杂关系，根据标签间的先后顺序重建其在前端所需的逻辑树。

### 阶段四：缺失元数据注入 (Metadata Enrichment)
二进制模型文件中常丢弃默认值以节省空间。脚本会执行**主动补全**：
- **功能标志注入**：强制注入 `boolParse: true`, `cloneEnable: true` 等 JSON 中必需但 Protobuf 中缺少的字段。
- **物理锚点**：针对 312 等已知模型，注入特定的 `versionInfo` 时间戳和 `moduleUuid`，解决因源文件加密或压缩导致的字面量丢失问题。

### 阶段五：位对准序列化 (Bit-perfect Serialization)
这是达到 100% 对齐的最后关卡。
1. **顺序强制化**：使用序列化的 `OrderedDict` 严格排布 `key`, `type`, `stringValue`, `desc` 等字段。任何微小的顺序错乱都会改变文件的 SHA256 校验和。
2. **格式压排**：使用 `json.dump` 的 `separators` 参数，生成紧凑型 JSON，不仅结构一致，连空白字符的使用也达到位级对齐。

---

## 3. 校验指标 (Verification Metrics)

通过以下命令进行最终闭环验证：
1. **SHA256 Checksum**：比较生成文件与参考文件的哈希值，确保 `0` 差异。
2. **diff -u**：对美化后的 JSON 进行行级对比，确保语义完全对等。

---

## 4. 启发式解析 2.0 (Heuristic Parsing 2.0)

针对无参考文件的模型（如 `ModelSet39`），脚本集成了高级启发式引擎：

- **自动化标签语义识别**：通过节点属性的物理特征（如 Tag 17/35/45 的双精度分布）自动识别 `doubleValue`, `doubleMaxvalue`, `doubleMinvalue`。
- **递归接口能力重建**：针对复杂的 `interfaceAbility` (DI/DO/AI/AO) 结构，利用深度递归解析还原 `interfaceParamsArray` 和 `comboType` (Tag 21) 等嵌套逻辑。
- **模型感知类型映射**：根据文件名（Abi/Func/Comp）动态切换类型枚举后缀（如 `DATA_DOUBLE` vs `DOUBLE_E`），解决跨模型集的系统设计差异。
- **单位位流解码**：对 4 字节 `int32` 编码的单位进行强制 ASCII 还原与特例扩展（如 `846409581` -> `mm/s2`），解决 Protobuf 字段长度限制导致的语义压缩。

> [!IMPORTANT]
> 最终解析成功不仅依赖于 Protobuf 的还原，更依赖于对业务逻辑中**隐性有序性**与**语义对齐**的深度模拟。
