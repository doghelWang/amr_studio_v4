# AMR Studio V4 模型解析引擎重构设计方案

## 一、 重构架构与核心目标
针对当前 `model_deserializer` 等解析技能存在混乱和错误的问题，本方案旨在将模型文件的提取、解析、打散、重组、序列化完整闭环严格规范并“固化”为三个独立的标准化技能（微服务/脚本）。

保证完全无损：所有序列化/反序列化规则必须**严格遵循 `controller_model_abi_set.proto` 及 `controller_model_comp_desc.proto` 等基准 Schema**，确保输出的 `.cmodel` 与原始 `modelset312.cmodel` 在结构与字节尺度上做到 100% 同构。

---

## 二、 核心技能分解与固化设计

### 技能 1: 二进制解包与反序列化 (Model Extractor & Deserializer)
**功能定位**：将原始 `.cmodel` 解压，并将其中的 `.model` 二进制数据反序列化为易于读写的 `.json` 结构。

*   **输入**：`modelset312.cmodel` (或标准 cmodel 文件)
*   **执行逻辑**：
    1.  **解压 (Unarchive)**：采用 ZIP/TAR 算法解压 `.cmodel` 归档包，释放其中的核心二进制文件，如 `CompDesc.model`, `AbiSet.model`, `FuncDesc.model`。
    2.  **Schema 绑定 (Schema Binding)**：利用 `schemas` 目录下编译出的 Python 绑定 (`*_pb2.py`) 初始化 Protobuf message 实例（如初始化 `Message_Module_Info` 对象来承接 `CompDesc.model`）。
    3.  **解析与转换 (Parse & Format)**：
        *   调用 `ParseFromString()` 将二进制流读入内存 Protobuf 对象中。
        *   调用标准库 `google.protobuf.json_format.MessageToJson`（带参数 `preserving_proto_field_name=False/True` 视比较库格式而定）将其转换为等同于 `compare/CompDesc.json` 的 JSON 格式。
*   **输出**：完整的总线级 JSON 文件，例如 `CompDesc_full.json`。

---

### 技能 2: 模块碎片化提取 (Module Splitting & Blueprint Generation)
**功能定位**：从庞大的总 JSON 中提取所有的模块实体，将其打散成独立文件，实现逻辑“解耦”。

*   **输入**：技能 1 产生的 `CompDesc_full.json`。
*   **执行逻辑**：
    1.  **JSON 树状遍历 (Tree Traversal)**：解析根级 `moreModuleInfo` 数组以及下属的 `moduleComponets` 数组。
    2.  **原子文件提取 (Entity Extraction)**：针对每一个 `moduleComponets` 对象实体：
        *   提取指纹标识：提取其实体 UUID (`generalAttr.moduleUuid.stringValue`) 和模块名 (`generalAttr.moduleName.stringValue`)。
        *   独立存储：将该实体的 JSON 内容抽离，保存为单个文件，例如 `modules/{moduleGroupName}_{uuid}.json` （可转换为 XML，但推荐保持 JSON 结构以保障类型原样不丢失）。
    3.  **骨架生成 (Blueprint Generation)**：在剥离原始实体的同时，在原始 JSON 树的位置留下“锚点”引用（例如 `{"$ref": "modules/...json"}`），最终生成一个包含整体模型结构的 `blueprint.json` 骨架文件。
*   **输出**：一个结构化目录，包含：
    *   `blueprint.json` （轻量骨架地图）
    *   `modules/` 目录下成百上千个独立的碎片化组件描述文件。

---

### 技能 3: 重组与封装防篡改 (Model Assembler & Serializer)
**功能定位**：将经过用户编辑或独立生成的原子模块，重新聚合并按逆过程标准序列化回 `.cmodel` 二进制档。

*   **输入**：`blueprint.json` 骨架地图以及对应的碎片化 `modules/*.json` 文件。
*   **执行逻辑**：
    1.  **深搜合并 (Recursive Merge)**：读取 `blueprint.json`，遇到 `$ref` 引用的位置，挂载读取相应的独立模型文件内容。在内存中拼装出与原版完全一致的 `CompDesc_full.json` 结构字典。
    2.  **JSON -> Protobuf 映射 (Dict to Protobuf)**：
        *   通过 `google.protobuf.json_format.ParseDict`（或 `Parse`）安全地将 Python Dict 灌入到对应的 Protobuf Schema 实例中。
        *   由于借助官方 Schema 转换，确保所有 `DATA_DOUBLE`, `DATA_INT32`, 枚举值均得到严谨边界拦截与格式化。
    3.  **模型固化 (Serialization)**：
        *   调用 Protobuf 的 `.SerializeToString()` 接口，生成原生的 `.model` 字节流文件。
    4.  **压缩封装 (CModel Archiving)**：将所有的 `*.model` 以及可能需要的签名文件，用 ZIP 重新归档，后缀名修正为 `.cmodel`。
*   **输出**：高度保真、防篡改的最终的 `.cmodel` 文件。必须保证与逆向提取的源文件格式与协议校验规范**绝对一致**。

---

## 三、 对开发后续落地的约束
1.所有的 Protobuf 生成代码 `.pb.cc/.pb.h` 必须被映射转换为等价的 Python Schema (可以通过 `protoc` 生成)，以此保证后端基于 Python 快速编写技能的开发效率与准确度。考虑到已经存在 `.cc` 和 `.h` 文件，协议是成熟固化的。
2.三个步骤应当分别被打包进独立的目录结构或技能包（如 `backend/skills/cmodel_decoder/`, `model_splitter/`, `cmodel_encoder/`），并且向平台暴露标准的入参和出参。
