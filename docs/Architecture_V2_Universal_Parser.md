# 🚀 全息数字孪生框架：AMR 模型解析与重构架构设计报告

## 摘要 (Executive Summary)
本框架致力于解决海康 AMR `.cmodel` 文件的无损解析（Parse）与重新打包（Build）问题。核心设计理念是**“数据驱动（Schema-Driven）”与“读写对称（Symmetric Codec）”**。我们将彻底抛弃通过正则表达式猜测数据位置的野路子，转而依托官方提供的 `ModuleLibrary` JSON 字典，通过泛型的 TLV (Tag-Length-Value) 解析器，实现 100% 忠于源文件的全息数字孪生。

---

## 第一章：基础原理与信息字典体系 (Foundational Schema)

### 1.1 `.cmodel` 容器的物理真相
`.cmodel` 并非单一文件，而是一个通过 MD5 校验锁定的 ZIP 包，内部包含 AMR 的三大维度的独立模型：
*   **`CompDesc.model` (组件拓扑模型)**：AMR 的物理肉体。包含了主控、轮组、传感器的级联关系（通过 `parentNodeUuid`），以及 6D位姿、尺寸、接口数量等绝对物理参数。
*   **`FuncDesc.model` (功能逻辑模型)**：AMR 的神经系统。定义了“导航系统（`NAVI_SLAM`）具体由哪个传感器（`laser-front`）负责”。
*   **`AbiSet.model` (能力集模型)**：AMR 的基因库上限。定义了底层固件支持的枚举字典。
*   **`ModelFileDesc.json`**：安全锁。包含以上三份文件的 MD5 散列值。修改任何一个字节，如果不重算该文件，底盘将拒绝启动。

### 1.2 `ModuleLibrary` 模板库（破局的关键）
在 `docs/参考信息/ModuleLibrary` 中，暴露了协议中最核心的机密——**类型的自描述机制**。
例如：
```json
"moduleName": { "key": "module_name", "type": "DATA_STRING" }
```
这意味着：在二进制流中，遇到 `module_name` 这个 Key 后，接下来的数值必须按 `String` 去读；而遇到 `wheelRadius`，则必须按 `Float/Double` 去读。
解析器只需在启动时加载这些 JSON 模板库（Schema），然后按照 Schema 去解构二进制数据，实现“可扩展性”。

---

## 第二章：逆向经验与协议特征总结 (Protocol Specs)

根据他人经验与实际文件特征，`.cmodel` 采用的是一种高度定制化的、支持层级嵌套的 TLV (Tag-Length-Value) 二进制序列化协议。

### 2.1 协议的四大核心法则
1.  **闭合域法则 (Scope Rule)**：
    数据存在树状深度。遇到特定的起始符，意味着进入了一个子对象，遇到特定标记代表跳出该节点。这要求解析器必须是**递归的（Recursive）**。
2.  **严格内存对齐法则 (IEEE-754 Rule)**：
    工业级参数（如轮距 531.5、速度 1500、坐标 700.0）在遇到特定 Tag 标识时，必须强制向后读取 **4 字节或 8 字节**，并通过 `struct.unpack` 将其逆向为十进制浮点数。
3.  **强主键映射法则 (UUID Mapping)**：
    `module_name` 只是用来显示给人看的标签。在建立拓扑连接时，**唯一的标识符是 UUID**。内存树必须以 UUID 作为主键。
4.  **无损对称法则 (Symmetric Lossless)**：
    解析和构建必须是同一个函数的逆过程。怎么读出来的，保存时就必须怎么写回去，包含未知字段（Unknown Tags）也必须原样保留写入。

---

## 第三章：截图信息与业务展现映射 (Business Mapping)

基于截图参考，将二进制底层 Key，精确翻译为前端展现的业务字段：

1.  **主控/IO接口面板**：
    *   底层 Keys: `CAN_1`, `ETH_1`, `RS485_1`, `di_num`, `baudrate`。
    *   展现要求：接线图中生成端点（Ports），识别芯片平台（如 `chipPlatform: R318`）。
2.  **运动学面板（底盘/电机）**：
    *   底层 Keys: `maxSpeed(Idle)`, `rotateDiameter`, `wheelRadius`, `gearRatio`。
    *   展现要求：在“执行机构”卡片中呈现具体的数值与单位。
3.  **全息 6D 传感器面板**：
    *   底层 Keys: `locCoordX/Y/Z/YAW/PITCH/ROLL`。
    *   展现要求：包含全量坐标和 `ipAddress` 等弱电信息。

---

## 第四章：全息通用架构设计方案 (Universal Framework Architecture)

设计了 **四个独立解耦的子系统 (Layers)**：

### Layer 1: 物理容器层 (Container I/O)
*   处理 `.cmodel` ZIP 的解压与打包，计算校验和 (`MD5Signer`)。

### Layer 2: 动态模式注册表 (Schema Registry)
*   读取 `ModuleLibrary` 下的 JSON 文件，构建全局类型推断树。

### Layer 3: 泛型 TLV 编解码引擎 (Generic Codec Engine)
*   **Parser (解析器)**: `BinaryStream -> AST (抽象语法树)`。忠实记录每个节点的 Tag 类型、长度、原始值。
*   **Builder (构建器)**: `AST -> BinaryStream`。将内存树原封不动地转换回海康认识的二进制格式。

### Layer 4: 业务语义熔接层 (Semantic Fusion)
*   将 AST 翻译成前端易于渲染的 JSON，并在保存时将前端的修改逆向更新回 AST。
*   遍历 `CompDesc AST` 生成物理设备列表。
*   遍历 `FuncDesc AST`，将导航、急停等角色注入到设备对象中。