# CModel 成果物封包规范深度对比报告 (2026-03-28)

## 一、 评审背景
本报告旨在对系统当前生成的 `.cmodel` 二进制归档包与官方标准的 `.cmodel` 文件进行逐字节、逐字段的深度结构比对，以查明为何标准工具在解压和加载生成的模型时会发生崩溃或解析失败。

测试样本：
- **生成样本**：`backend/saved_projects/new_proj_cxe9emu/new_proj_cxe9emu_packed.cmodel`
- **标准基准**：`docs/cmodel_resources/ModelSet312.cmodel`

---

## 二、 ZIP 物理结构差异清单 (Physical Structure Differences)

| 文件路径/名称 | 官方标准状态 | 当前生成状态 | 差异分类 | 严重程度 |
| :--- | :--- | :--- | :--- | :--- |
| `CompDesc.model` | 存在 (113,782 Bytes) | 存在 (33,399 Bytes) | 内容容量差异 | 低 (基于实际配置) |
| `AbiSet.model` | 存在 (13,161 Bytes) | 存在 (149 Bytes) | 内容容量差异 | 低 (基于实际配置) |
| `FuncDesc.model` | 存在 (1,538 Bytes) | **完全缺失** | 结构遗漏 | 🟥 极高 (导致解压中断) |
| `ModelFileDesc.json`| 存在 (552 Bytes) | 存在 (329 Bytes) | 协议不符 | 🟥 极高 (防篡改校验失败) |

---

## 三、 ModelFileDesc.json 逐字比对报告 (JSON Field-by-Field Diff)

本节将完全展开两个清单文件的原始内容进行对照。

### 1. 官方标准 `ModelFileDesc.json` (Ground Truth)
```json
{
    "ModelFileDesc": [
        {
            "md5": "3065834785b80522e8540e712b640eb0",
            "name": "AbiSet.model",
            "type": "CAPABILITY",
            "version": ""
        },
        {
            "md5": "c6bdd6f6309a50f6dba13b4660e3953b",
            "name": "FuncDesc.model",
            "type": "MODEL_FUNC",
            "version": ""
        },
        {
            "md5": "54ce9373affddb940ee195ab3dc72d77",
            "name": "CompDesc.model",
            "type": "MODEL_COMP",
            "version": ""
        }
    ]
}
```

### 2. 当前系统生成的 `ModelFileDesc.json` (Actual Output)
```json
{
  "modelVersion": "1.0",
  "files": [
    {
      "name": "CompDesc.model",
      "type": "MODEL_COMP",
      "version": "1.0"
    },
    {
      "name": "AbiSet.model",
      "type": "MODEL_ABI",
      "version": "1.0"
    },
    {
      "name": "FuncDesc.model",
      "type": "MODEL_FUNC",
      "version": "1.0"
    }
  ]
}
```

### 3. 具体错误项与遗漏项详尽列举

#### 错误项 A: 根节点键名错误
- **标准期望**: `{"ModelFileDesc": [...]}`
- **当前输出**: `{"files": [...]}`
- **影响**: 解析器根本无法找到文件清单入口。

#### 错误项 B: 根节点冗余属性
- **标准期望**: 无此属性。
- **当前输出**: 多出了 `"modelVersion": "1.0"` 键值对。
- **影响**: 可能触发严格模式下的 Schema 校验异常。

#### 遗漏项 C: 缺失防篡改校验哈希 (MD5) - [共 3 处缺失]
- **标准期望**: 每个文件条目必须包含 `"md5": "32位哈希值"`。
- **当前输出**: `CompDesc.model` 缺失 md5 字段。
- **当前输出**: `AbiSet.model` 缺失 md5 字段。
- **当前输出**: `FuncDesc.model` 缺失 md5 字段。
- **影响**: 标准工具在解压时会试图校验文件完整性，读取不到 md5 键导致 `KeyError` 崩溃。

#### 错误项 D: 能力集 (AbiSet) 类型枚举错误
- **标准期望**: `"type": "CAPABILITY"`
- **当前输出**: `"type": "MODEL_ABI"`
- **影响**: 即使解析器跳过了前面的错误，也会因为无法识别 `MODEL_ABI` 而拒绝加载机器人能力模型。

#### 错误项 E: 版本号默认值偏差 - [共 3 处偏差]
- **标准期望**: 默认值为空字符串 `""`。
- **当前输出**: 全部硬编码为 `"1.0"`。
- **影响**: 属于轻微告警级别。

#### 结构性错误 F: FuncDesc 虚假声明
- **标准期望**: 声明在清单中的文件必须物理存在于 ZIP 包中。
- **当前输出**: 清单中声明了 `FuncDesc.model`，但上一节证明 ZIP 包中并未打包该文件。
- **影响**: 解压提取时抛出 `FileNotFoundError`。
