# AMR Studio Pro V4 — 成果物语义对齐与全维度缺陷评审报告 (专项诊断)

**审核时间**: 2026-03-09 22:20
**审核人**: Gemini CLI (Chief Test Engineer)
**状态**: 🔴 逻辑不完整 (Incomplete logic)

---

## 一、 用户反馈问题深度对齐分析

针对提出的 6 大核心问题，我通过对比 `templates` 二进制特征，定位到了以下代码级的缺失：

### 1. IO 板电气信息黑洞 (ID 存在但属性缺失)
*   **现象**: 解析出 ID=110，但总线、协议、通道数全为空。
*   **代码病因**: `protobuf_navigator.py` 仅实现了单层浅匹配。IO 板的总线号 (`bus_id`) 和通道配置 (`channel_list`) 在 Protobuf 中是嵌套在 `interfaceAttr` 子消息中的。
*   **解决方案**: 
    1. 必须实现 **递归路径寻址**。
    2. 开发建议：针对 IO 模块，增加对 `Tag 10` (协议名) 和 `Tag 12` (通道数组) 的提取。

### 2. 轮组与传感器的“空间迷失” (位置全为 0)
*   **现象**: `locCoord` 系列字段在生成的 .model 中全为默认值 0。
*   **代码病因**: 
    * `backend/schemas/api.py` 的 `SensorConfig` 之前缺失 Z/P/R 字段。
    * `protobuf_engine.py` 虽然克隆了块，但映射函数 `update_float_param` 没有正确对应到成果物要求的 `locCoordNX` (X坐标) 等特定 Key 名。
*   **解决方案**: 
    1. 在 `build_comp_desc` 中硬化映射关系：`mountX` 强制映射至 `locCoordNX`。
    2. 确保单位对齐（前端 mm vs 成果物 m 或 mm）。

### 3. 电气连接链路断裂 (IP 与 端口号未呈现)
*   **现象**: 激光雷达等 Ethernet 设备没有 IP 和 Port 信息。
*   **代码病因**: 现有的 `ProtoNavigator` 完全没有处理 `ipAddress` 这种 **String 类型** 的 Patch 逻辑，且未进入 `net_interface` 子块。
*   **解决方案**: 
    1. 增加 `update_string_param` 功能。
    2. 在注入传感器时，必须主动寻找并填充 `net_interface` 块下的 IP 和 Port 字段。

### 4. IO 映射与归属板断层
*   **现象**: 下拉框内容错误，无法识别归属 IO 板。
*   **架构病因**: `FuncDesc.model` 需要引用 `CompDesc.model` 中定义的 `module_uuid`。目前后端在生成时，两者是孤立的。
*   **解决方案**: 
    1. 在生成 ModelSet 时，先生成 `CompDesc` 并记录 IO 板的 UUID。
    2. 将该 UUID 传递给 `build_func_desc`，填入 `SAFETY_IO` 块的 `target_uuid` 字段。

---

## 二、 工程师优化方案 (Refactoring Spec)

### 方案 A: 升级 ProtoNavigator (寻址重构)
*   **目标**: 支持作用域限定寻址。
*   **逻辑**: `Navigator.in_scope(io_board_block).update("bus_id", config.canBus)`。

### 方案 B: 补完 Component Factory (组件工厂)
*   **目标**: 解决克隆数量受限问题。
*   **逻辑**: 放弃“遍历现有 sensor 占位符进行修改”，改为“根据 payload 数量，动态克隆 sensor 原型块并插入 parts 列表”。

---

## 三、 结论

**成果物一致性现状: 35%**
目前仅完成了 Metadata (名字、版本) 的对齐。物理位姿、电气接口、逻辑绑定三大核心柱石处于坍塌状态。

**后续关注点**: 严密监控 `protobuf_engine.py` 是否引入了对 `net_interface` 和 `locCoord` 字段的显式处理逻辑。
