# AMR Studio Pro V4 — 成果物差异检查与设计修改建议报告

**检查日期**: 2026-03-09  
**检查对象**: `/backend/saved_projects` (生成成果物) vs. `/backend/templates` (预期规范)  
**检查结论**: **已实现核心参数对齐，但物理结构与组件完整性存在显著偏离。**

---

## 一、 成果物检查发现 (Artifact Audit)

通过对 `saved_projects` 中的 JSON 项目文件及其生成的 `.model` 二进制文件进行分析，发现以下差异：

### 1.1 结构顺序偏移 (Structural Displacement)
*   **现象**: 生成的 `CompDesc.model` 中，`motionCenterAttr` (运动中心参数) 和 `wheelAttr` (轮组属性) 被移动到了文件的末尾。
*   **原因**: `protobuf_engine.py` 在重构 `parts` 列表时，先过滤掉了原有块，然后将新生成的克隆块 `append` 到列表尾部。
*   **风险**: 某些工业控制器（PLC/MCU）可能依赖固定的 Protobuf 字段顺序或索引来读取关键运动学参数，顺序偏移可能导致解析失败。

### 1.2 组件实现缺失 (Component Gap)
*   **传感器 (Sensors)**: 虽然 JSON 中包含详细的传感器配置，但生成的 `CompDesc.model` 仅处理了轮组，**完全忽略了传感器**（激光雷达、相机等）在物理描述文件中的注入。
*   **IO 映射 (IO Mapping)**: 生成的 `FuncDesc.model` 中仅有导航方式切换，缺乏对 `ioPorts` 逻辑绑定的实际生成逻辑。
*   **版本信息简化**: 生成的文件将版本号简化为 `1.0`，而模板中包含精确的构建时间戳（如 `V1.0/2025-12-23 15:41:43.738`）。

### 1.3 坐标系对齐细节
*   **现象**: `CompDesc.model` 模板中存在 `angleSensor` 和 `GROUP_CALI_ABS_INTERNAL` 等校准参数，生成的文件中这些参数块在克隆过程中丢失或被忽略。

---

## 二、 具体设计修改建议 (Design Modification Proposals)

为了确保产生的成果物与 `templates` 保持“**严格一致的数据格式规范**”，建议进行以下技术调整：

### 2.1 引入“原位替换”算法 (In-place Replacement)
*   **修改点**: `protobuf_engine.py` 中的 `attr["2"]["1"] = new_parts` 逻辑。
*   **建议**: 记录第一个 `motionCenterAttr` 出现的索引位置，并在该位置插入所有轮组块，而不是追加到末尾。这样可以保持 `sub_sys_type` 和 `chassisAttr` 等后续块的相对顺序。

### 2.2 补全传感器物理注入 (Sensor Injection)
*   **修改点**: `build_comp_desc` 函数。
*   **建议**: 
    1.  从模板中识别 `sensorAttr` (传感器属性) 块的 `UniqueKey`。
    2.  遍历 `payload.sensors`，根据其 `type` (LASER_2D, CAMERA 等) 克隆对应的描述块。
    3.  注入 `mountX`, `mountY`, `mountZ`, `mountYaw` 等 6D 位姿参数。

### 2.3 强化 UniqueKey 语义绑定
*   **修改点**: `ProtoNavigator` 类。
*   **建议**: 
    1.  增加对 `UniqueKey` 的“精准占位”支持。
    2.  对于 IO 逻辑绑定，应在 `FuncDesc.model` 中预设一系列 `UniqueKey`（如 `safetyEstopKey`, `bumperFrontKey`），并在后端根据 `logicBind` 字段动态激活（Enable/Disable）这些功能块。

### 2.4 版本与元数据一致性
*   **修改点**: `main.py` 或 `protobuf_engine.py`。
*   **建议**: 在注入 `version_info` 时，遵循模板的格式规范：`V{version}/YYYY-MM-DD HH:MM:SS`，而不仅仅是单一的数字。

### 2.5 建立“格式回读”校验机制
*   **建议**: 在后端增加一个 `validation_p0.py` 脚本，负责在 `.model` 生成后，再次使用 `blackboxprotobuf` 反序列化，对比生成的 Key 集合与模板 Key 集合的 **差集 (Set Difference)**。如果关键 Key 丢失，则报错并拒绝返回 ModelSet。

---
**结论**: 现有代码已具备处理 V4 复杂参数的能力，但仍需在“物理结构完整性”上进行精细化对齐，以满足工业级控制器的解析要求。
