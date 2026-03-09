# AMR Studio Pro V4 — 全量代码走查与深度对齐方案 (Full Walkthrough)

**审核时间**: 2026-03-09
**审核对象**: `amr_studio_v4` 全量源码与 Templates 目标文件
**核心目标**: 达成成果物生成的 100% 一致性与双向导入解析能力。

---

## 一、 数据模型走查 (Schemas & Types Alignment)

### 1.1 `backend/schemas/api.py` 走查发现
*   **[缺陷] 传感器位姿定义不全**: 
    *   **代码**: `SensorConfig` 仅包含 `offsetX`, `offsetY`, `yaw`。
    *   **对比**: 成果物 `CompDesc.model` 明确要求 6D 位姿（含 `mountZ`, `mountPitch`, `mountRoll`）。
    *   **建议**: 同步 Pydantic 模型，增加 `offsetZ`, `pitch`, `roll` 字段，确保物理描述的完整性。

### 1.2 `frontend/src/store/types.ts` 走查发现
*   **[对齐]**: 前端已成功引入 `Full Load` 参数，符合 V4 规格。
*   **[风险]**: 缺少 `McuConfig` 中的电气属性细化（如 CAN Bitrate）。在执行“逆向导入”时，这些元数据若在二进制中存在但在 Store 中无定义，将导致数据丢失。

---

## 二、 核心引擎走查 (Protobuf Engine Deep Dive)

### 2.1 `core/protobuf_engine.py` - `build_comp_desc`
*   **[致命风险] 结构顺序破坏 (Line 46-51)**:
    *   **实现**: `for p in parts: if p.get("2") not in (...): new_parts.append(p)`。
    *   **分析**: 该逻辑会将非轮组块（如 `sub_sys_type`）强制置于文件头部，而将轮组块置于尾部。
    *   **对齐要求**: 工业级控制器通常按偏移量解析。顺序变化可能导致解析器定位失败。
    *   **代码优化建议**: 
        1.  **记录锚点**: `anchor_idx = next(i for i, p in enumerate(parts) if p.get("2") == TARGET_KEY)`。
        2.  **原位插入**: `new_parts[anchor_idx:anchor_idx] = cloned_blocks`。

*   **[功能缺失] 传感器注入空白 (Line 80)**:
    *   **发现**: 代码逻辑在此处中断，仅处理了 wheels。
    *   **实现建议**: 引入 `SensorPatcher` 逻辑，在 `CompDesc` 中查找 `UniqueKey` 为 `sensorAttr` 的块并进行动态克隆。

### 2.2 `core/protobuf_engine.py` - `build_func_desc`
*   **[逻辑偏离] 导航方式硬编码**:
    *   **分析**: 仅通过 `has_laser_navi` 判断 `NAVI_SLAM`。
    *   **建议**: 应从 `payload.driveType` 和 `identity.navigationMethod` 进行多维映射，对齐 `templates` 中定义的 `NAVI_REFLECTOR` 等多种专业模式。

---

## 三、 寻址器走查 (Navigator Architecture)

### 3.1 `core/protobuf_navigator.py` - `find_param`
*   **[架构风险] 模糊匹配歧义**:
    *   **分析**: 递归搜索第一个匹配 `tag 1` 的字典。
    *   **后果**: 在 `CompDesc` 这种多层嵌套（chassisAttr -> motionCenterAttr）结构中，容易误改非目标块的同名参数。
    *   **优化方案**: 
        1.  **路径感知寻址**: 实现支持 `find_by_path(["chassisAttr", "motionCenterAttr", "headOffset"])`。
        2.  **作用域限制**: 在更新子组件（如特定 Wheel）时，仅在对应的 `deepcopy` 块范围内进行搜索。

---

## 四、 核心目标：逆向导入与解析设计 (Import Logic)

要实现“项目可以导入 templates 中的文件并解析展示”，建议新增以下逻辑：

### 4.1 新增 `core/model_parser.py`
*   **职责**: 实现 `Binary (.model) -> JSON (AmrProject)` 的语义转换。
*   **关键步骤**:
    1.  **特征识别**: 读取 `CompDesc.model` 中的 `sub_module_type`，映射回前端的 `driveType`。
    2.  **参数提取**: 遍历 `parts` 列表，识别 `UniqueKey`。遇到 `motionCenterAttr` 时，自动实例化一个新的 `WheelConfig` 对象并填充从二进制读出的 `headOffset(Idle)` 等数据。
    3.  **坐标还原**: 将 `locCoordNX/NY` 还原为前端 Canvas 可用的 `mountX/Y`。

---

## 五、 总结与双向对齐路线图

| 优先级 | 任务模块 | 核心改进点 |
| :--- | :--- | :--- |
| **P0** | **稳定结构生成** | 采用“原位锚点插入”算法，确保生成的二进制流顺序与模板 100% 一致。 |
| **P0** | **物理组件补完** | 实现 `sensors` 和 `ioPorts` 在 `CompDesc` 中的物理描述注入。 |
| **P1** | **语义化寻址重构** | 弃用硬编码索引，全面转向基于路径和 UniqueKey 的语义化寻址。 |
| **P1** | **逆向解析引擎** | 开发 `ModelParser` 模块，支持 ModelSet.zip 的一键导入与还原。 |
| **P2** | **自动一致性测试** | 建立 `JSON <-> Model` 的无损转换测试闭环（Round-trip Testing）。 |

---
**审核人结论**: 🟢 **架构已具备雛形，但实现层存在严重的“一致性债务”。** 必须重构块插入逻辑和寻址范围限制，才能真正达成双向对齐的目标。
