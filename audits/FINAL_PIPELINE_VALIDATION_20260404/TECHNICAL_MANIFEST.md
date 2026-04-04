# 全链路 CModel 产物生成技术清单 (2026-04-04)

## 1. 环节一：前端原始输出 (`01_frontend_raw.json`)
*   **产生方式**: 前端 `ExportService.ts` 将 React 状态树序列化为 JSON。
*   **特征**: 
    *   结构嵌套，反映了 UI 上的组件挂载关系。
    *   包含用户在“身份信息”步骤输入的原始数据（如底盘长宽、机器人名称）。
    *   `privateAttrs` 为原始配置值，未经过工程化富化（缺失 XML 要求的 desc 描述）。

## 2. 环节二：后端工程富化 (`02_backend_enriched_CompDesc.json`)
*   **产生方式**: 后端 `resource_adapter.py` 接收前端 JSON，遍历组件树。
*   **核心逻辑**:
    *   **动态尺寸同步**: 从 `identity` 对象提取底盘尺寸，注入到 `moduleShape` 节点。
    *   **XML 模板补全**: 根据 `category` 匹配本地 XML 库，为属性注入缺少的 `desc`、`unit`、`min/max` 约束。
    *   **协议对齐**: 为 `extendParams` 添加描述字段，并确保 `MOTOR` 正确指向电机模板（14属性）。

## 3. 环节三：蓝图扁平化切割 (`03_blueprint_CompDesc.json`)
*   **产生方式**: `model_splitter/splitter.py` 递归处理富化后的 JSON。
*   **特征**:
    *   **扁平化处理**: 将深层嵌套的 `moreModuleInfo` 提升为一级平铺列表，符合上位机解析器的线性加载逻辑。
    *   **分而治之**: 核心组件被提取到 `temp_work/modules/` 目录下，主蓝图通过 `$ref` 维持轻量级引用（减少单次反序列化压力）。

## 4. 环节四：二进制编码与打包 (`12345_audit.cmodel`)
*   **产生方式**: `cmodel_encoder/encoder.py` 执行最后的 Protobuf 序列化。
*   **内部文件解释**:
    1.  **`AbiSet.model`**: 将 `AbiSet.json` 映射到 `Controller_Ability` 消息。采用了蛇形命名（snake_case）强制转换以适配底层 `.proto`。
    2.  **`CompDesc.model`**: **核心修复点**。将蓝图及其引用的所有模块内容合并，封装进一个单条 `Message_Module_Info` 消息中（Tag 5 组集合），解决了解析器无法处理消息流的问题。
    3.  **`FuncDesc.model`**: 拷贝自系统基准资源，确保配置完整。
    4.  **`ModelFileDesc.json`**: 记录上述三个二进制文件的 MD5 校验码，防止传输损坏。

## 5. 打包前文件列表清单
| 文件名 | 产生逻辑 | 校验 MD5 (12345 示例) |
| :--- | :--- | :--- |
| **AbiSet.model** | Proto(Controller_Ability) | 21513eaeb0b883cb31e7370f597fb75a |
| **CompDesc.model** | Proto(Message_Module_Info) | 0314c2fc08111e80d9a499a01d3bacc0 |
| **FuncDesc.model** | Resource Baseline Copy | c6bdd6f6309a50f6dba13b4660e3953b |
| **ModelFileDesc.json** | Hash Generator | 11b051a246ec8ed6a4f24bdf40342a09 |

**总结**: 
通过将消息流模式改为“单消息封装模式”，并补全了 `ModelFileDesc.json` 的 MD5 校验机制，目前的 `.cmodel` 已完全兼容工业级标准解析器。
