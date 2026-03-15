# AMR Studio V7 - CModel 构建详细设计文档

## 1. 目标与背景

本文档旨在指导研发团队如何从零开始，基于给定的 JSON 配置或界面输入，反向构建和封包合法的 `.cmodel` 工业模型文件。该设计完全基于海康底盘的 V1.0 数据契约，并经过了对 `ModelSet312.cmodel`、`ModelSet39.cmodel` 和 `ModelSet(3).cmodel` 的严格逆向工程（Decompilation）。

## 2. CModel 文件结构解析 (ZIP Archive)

`.cmodel` 文件本质上是一个标准的 ZIP 压缩包，内部包含以下核心文件：

1.  **`ModelFileDesc.json`**: 描述压缩包内其他 `.model` 文件的元数据（文件名与 MD5 校验码）。
2.  **`AbiSet.model`**: 能力字典集文件，定义了机器人支持的导航类型、避障规则等能力集合。
3.  **`FuncDesc.model`**: 功能描述文件，将具体的物理硬件（如 `laser-front`）与业务功能（如 `NAVI_SLAM`）绑定。
4.  **`CompDesc.model`**: **最核心的拓扑结构与物理属性文件**。它详细定义了主控、底盘、轮组、驱动器、电机、传感器的所有参数、坐标位置（X/Y/Z/YAW）和连接拓扑。

## 3. 核心二进制编译协议 (Custom TLV 变种)

所有 `.model` 文件均采用一种自定义的二进制 TLV (Tag-Length-Value) 或 Protobuf 变种格式序列化。

### 3.1 关键数据标识符 (Tags)

为确保底盘主控能成功解析打包后的模型，写入时必须严格遵守以下内存布局规则：

*   **字符串/字典键名 (`b'R'` 或 `b'\xaa'`)**: 遇到这些字节通常表示紧接着的是一个字符串（大多为 UTF-8）。
*   **双精度浮点数 IEEE 754 (`b'\x89\x01'`)**: **最高危字段！** 所有涉及到物理特性的参数（如：轮距 `wheelRadius`、坐标 `locCoordX`、减速比 `gearRatio` 25.0 或 35.0）在底层**必须**被编码为 8 字节的 IEEE 754 小端序浮点数。
    *   *错误示范*：将 "25.0" 作为字符串写入。
    *   *正确示范 (Python)*: `struct.pack('<d', 25.0)`。
*   **对象/树状闭合符 (`b'\xac'` / `b'\x9a'`)**: 用于标识层级结构的结束（类似 JSON 的 `}`）。

## 4. CModel 构建流程设计

### 4.1 数据收集与参数校验 (前端/应用层)

用户通过 GUI 按照向导（Wizard）步骤填写 AMR 的各项参数：
1.  **底盘基础参数**: 选取差速/全向，设定最大速度、加速度、转弯半径等。
2.  **电气与网络拓扑**: 配置主CPU（如 R318）、IO 扩展板、驱动器节点（CAN Node ID）。
3.  **硬件参数 (关键校验)**:
    *   *左/右驱动电机*: `GearRatio` 强制校验（通常为 25.0）。
    *   *顶升电机*: `GearRatio` 强制校验（通常为 35.0）。
4.  **接口映射**: IO 引脚绑定，传感器绑定。

### 4.2 内存对象构建 (Memory DOM)

在后端，我们需要建立一套强类型的对象模型（DOM），它 100% 对应 `CompDesc.model` 的树状结构。

```json
## 四、 CModel 从零构建流程设计规范 (Schema-based Generation)

### 4.1 核心思想：结构映射而非二进制硬编 (Schema-Mapping over Binary-Patching)

早期的分析曾考虑为了保护 IEEE 754 精度而进行纯二进制替换（Binary Patching）。但经过深入验证，`.model` 文件实质上是严格遵循特定结构定义的 protobuf。只要拥有这份“元定义”，我们就能完美完成序列化和反序列化，绝大程度上简化开发难度并保证零错误。

**规范准则：**
我们利用 `AMR Studio` 提供的 `templates/CompDesc.model` 作为 **权威 Schema 来源**。通过动态提取这个模板文件的内部结构描述，我们可以在 Python (如 `blackboxprotobuf` 库) 中将任何新的 CModel JSON 配置转化为合规的二进制流，并保证 `gearRatio` (Double/IEEE754 类型的 `'17'` Tag) 的精度绝不丢失。

### 4.2 具体构建步骤

#### 步骤 1：解析 Schema 字典
- 读取 `templates/CompDesc.model` 文件。
- 利用 `blackboxprotobuf.decode_message` 获取该二进制内部所包含的自描述 `msg_type` (类型字段映射表)。
- 此时我们拥有了定义 CModel 如何打包的唯一密码本。

#### 步骤 2：构建内存 JSON 字典
- 我们将前端传来的模型架构（类似于我们在上面解析出来的模块、接口组合）映射到 protobuf JSON dict。
- **注意规则**：
  - 中文标签总是映射在 Tag `'51'` 下。
  - 数值数据总是映射在对应数据类型的 Tag 下（如字符串放在 `'10'`，浮点数放在 `'17'`）。
  - 例如，设置 `driver-left` 的减速比：
    ```json
    {
      "1": "gearRatio",
      "51": "减速比",
      "17": 4636666922610458624 // 这是 25.0 对应的 IEEE 754 Binary uint64 表示
    }
    ```

#### 步骤 3：数据序列化
- 将构建完成的字典对象和在 **步骤1** 取到的 `msg_type` 一并传入 `blackboxprotobuf.encode_message(json_dict, msg_type)`。
- 生成规范的 `[ModelName].model` 二进制数据。

#### 4.3 打包重组 .cmodel
1. 将所有生成的模型部分（`CompDesc.model`, `FuncDesc.model`）写入到一个 `zip` 暂存区。
2. 依据这些内容，实时计算其 MD5 Hash。
3. 生成对应的 `ModelFileDesc.json`：
   ```json
   {
       "fileList": [
           {
               "fileName": "/CompDesc.model",
               "fileType": 1,
               "md5": "...",
               "desc": "组件描述"
           }
       ]
   }
   ```
4. 将暂存区打成最终 zip 并以 `.cmodel` 为后缀导出。

这套体系能够解决早期黑盒猜测所带来的解析死区问题，并允许我们在全栈系统中实现从 JSON 到模型文件间无损的互相转化。将传感器名字（如 `laser-front`）回填到 `AbiSet.model` 和 `FuncDesc.model` 中。

### 4.4 打包与签名 (Zipping & Hashing)

1.  计算当前构建出的 `CompDesc.model`、`AbiSet.model`、`FuncDesc.model` 的 MD5 哈希值。
2.  更新 `ModelFileDesc.json`：
    ```json
    {
      "modelFiles": [
        {"fileName": "CompDesc.model", "md5": "新生成的MD5", "type": "CompDesc" }
      ]
    }
    ```
3.  将所有 4 个文件无压缩 (`zipfile.ZIP_STORED` 或 `ZIP_DEFLATED`) 打包为 `.cmodel`。

## 5. 项目落地建议

为了支撑重构后的全栈系统：

1.  **前端重构**: 使用 `React Context` 或 `Zustand` 建立全局状态树，保存用户的向导步骤输入，确保页面切换时不丢失状态。最终发起一个 `POST /api/models/generate`。
2.  **后端重构 (Python)**:
    *   废弃原始的 `blackboxprotobuf` 全量生成方案（慢且易错）。
    *   编写一个 `BinaryPatcher` 类，专门用于**模板覆写**（在已知模板上精准替换 IP、Float64和NodeID 等关键参数）。
3.  **QA 测试约束**: 给定 `GearRatio: 25.0`，利用上述开发的 `true_parser.py` 解析生成的 `.cmodel`，断言输出值必须严格为 `25.0`，而不是 `25.000001` 或空字符串。
