# AMR Studio Pro V4 — 深度审核报告 (Artifact Compliance)

## 0. 审核基本信息
*   **审核时间**: 2026-03-09 21:50 (CST)
*   **审核版本**: V4.0.0-Alpha (Baseline)
*   **审核人**: Gemini CLI (Senior AI Architect)
*   **审核对象**: `/Users/wangfeifei/code/amr_studio_v4`
*   **审核目标**: 确保项目生成的 `.model` 成果物与 `templates` 预设规范保持**严格的二进制与数据格式一致性**。

---

## 1. 问题诊断：现状与目标的偏离 (Critical Gaps)

通过对生成成果物与模板的二进制逆向对比，识别出以下三大核心风险：

### 1.1 物理结构重排 (Structural Instability)
*   **现状**: `protobuf_engine.py` 采用“过滤+追加”模式重构消息列表。
*   **后果**: 关键运动学参数块 `motionCenterAttr` 在二进制文件中的物理位置发生了偏移。
*   **风险等级**: 🔴 **高 (High)**。部分工业级解析器依赖字段顺序或固定偏移量，结构偏移会导致解析错误。

### 1.2 组件描述残缺 (Physical Property Gap)
*   **现状**: 后端引擎仅处理了轮组，**完全忽略了传感器**的位姿描述注入。
*   **后果**: 生成的 `CompDesc.model` 无法在仿真环境或实际定位系统中还原机器人的传感器布局。
*   **风险等级**: 🔴 **高 (High)**。

### 1.3 协议寻址脆弱性 (Addressing Fragility)
*   **现状**: 仍大量依赖硬编码索引（如 `msg["5"][0]["4"]...`）。
*   **后果**: 任何对原始模板字段的增删（如增加一条注释字段）都会导致 Patch 逻辑失效。
*   **风险等级**: 🟡 **中 (Medium)**。

---

## 2. 核心建议：设计修改方案 (Design Recommendations)

### 2.1 “原位锚点”算法
*   **建议内容**: 放弃 `append` 逻辑，改为记录第一个目标块的 `index`。
*   **预期目标**: 保持 `sub_sys_type` 和 `chassisAttr` 等后续块的相对位置，确保二进制文件流的稳定性。

### 2.2 传感器位姿全量注入
*   **建议内容**: 引入 `SensorPatcher` 逻辑，遍历 `payload.sensors`。
*   **预期目标**: 补全 `mountX/Y/Z` 及 `Yaw/Pitch/Roll` 的 6D 位姿注入，使物理模型完整闭合。

### 2.3 语义化路由协议
*   **建议内容**: 在 `FuncDesc.model` 中全面推行基于 `UniqueKey` 的功能逻辑控制。
*   **预期目标**: 屏蔽 Protobuf 内部索引波动，通过语义化字段（如 `safetyEstopKey`）稳定操控功能开关。

---

## 3. 代码优化建议 (Code Optimization)

### 3.1 架构升级：从 Hacking 到 Navigator
*   **建议**: 将 `protobuf_navigator.py` 升级为具备“路径感知”能力的寻址器。
*   **具体**: 支持 `parts/motionCenterAttr/headOffset(Idle)` 形式的路径检索，彻底消除模糊匹配可能导致的字段覆盖风险。

### 3.2 实现“组件工厂”模式
*   **建议**: 将不同类型的组件（轮组、激光、相机、IO）封装为独立的 `PatchFactory`。
*   **具体**: 统一 `find_template -> deep_copy -> fill_data -> insert_at_origin` 的闭环流程，提高代码复用率与健壮性。

### 3.3 零丢失校验 (Round-trip Verification)
*   **建议**: 后端生成流程末尾增加“回读对比”逻辑。
*   **具体**: 检查生成的二进制文件中关键 Key 的总数是否与模板一致，防止因解析错误导致的大规模字段丢失。

---
**审核结论**: 🔴 **存在核心一致性风险**。现有实现足以跑通 Demo，但不足以作为工业级生产工具。建议优先解决物理结构重排问题，并补齐传感器描述注入。
