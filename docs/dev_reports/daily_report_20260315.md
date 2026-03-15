# AMR Studio V4 进展总结报告 (2026-03-15)

## 1. 整体思想与参考依据

### 核心设计原则
- **资源固定化 (Fixed Hardware Resources)**：主控制器 (MCU) 和 IO 扩展板的通信接口（CAN, Serial, RS485, AI/DI/DO）被视为固定的硬件规格参数。用户不应自由增删，而是由系统根据选定型号（软件规格）自动推导并展示。
- **数据驱动 (Data-Driven Library)**：所有的资源计数、板载设备状态和拓扑逻辑均以硬件描述文件 (`.json`) 为准。
- **命名规范化 (Naming Normalization)**：统一全栈的 CAN 总线命名规则，使前端 UI、逻辑层与底层控制代码无缝对接。

### 参考文件
- **MCU 规格**: `docs/参考信息/ModuleLibrary/board_desc/host/` (如 `RA-MC-R318AT.json`)
- **IO 扩展板规格**: `docs/参考信息/ModuleLibrary/board_desc/expansion/` (涵盖 12+ 个型号)
- **板载模块**: `docs/参考信息/ModuleLibrary/OnboardModule/` (`GYRO-VIR.json`, `CR-VIR.json`)

### 输出文档
- [task.md](./task.md)：详细任务记录与状态追踪。
- [walkthrough.md](./walkthrough.md)：功能验证报告。
- [implementation_plan.md](./implementation_plan.md)：技术架构与实现方案演进。

---

## 2. 设计过程与代码修改

### 修改的核心文件
| 组件 | 文件路径 | 修改内容描述 |
| :--- | :--- | :--- |
| **数据模型** | `frontend/src/store/types.ts` | 扩展 `McuConfig` 和 `IoBoardConfig` 接口，增加详细资源字段。 |
| **状态逻辑** | `frontend/src/store/useProjectStore.ts` | 实现基于型号的资源自动推导库 (Library)，修正 CAN 数量逻辑。 |
| **界面展示** | `frontend/src/components/ControlBoardForm.tsx` | 重塑 MCU 多标签页配置；将内部资源改为只读 Tags 展示；增加 IO 资源汇总。 |
| **后端接口** | `backend/schemas/api.py` | 同步 Pydantic 模型，确保前端新增的资源字段能被正确接收。 |
| **CModel 生成** | `backend/core/schema_builder.py` | 实现资源计数向 `接口资源` 属性组的自动映射；实现板载设备子节点的自动挂载点逻辑。 |

---

## 3. 存在的问题与解决方案

### 沟通过程中的关键对齐
- **概念澄清**：纠正了“电机连 CAN”的臆想，明确了只有驱动器 (Driver) 和外置编码器接入 CAN 总线。
- **资源语义**：理解了“资源”是硬件固有的，因此将 UI 从编辑模式改为只读展示模式。
- **命名补齐**：发现了 `CAN0/1/2` 与硬件文档 `CAN_1/2/3` 的冲突，并进行了全局修正。

### 技术难题与修复
- **IO 细化**：初始只做了通用 IO 占位，后通过逐一解析 `expansion` 目录下的 JSON，实现了针对 12 个以上真实型号的精确资源映射。
- **安装角度**：补充了 6D Pose (X/Y/Z, Roll/Pitch/Yaw) 的完整支持。

---

## 4. 进展输出

### 已解决问题 (Completed)
- [x] **MCU 精度修复**：实现了 6D 安装位、板载陀螺仪/读码相机状态自动同步。
- [x] **MCU 接口资源**：精确匹配了串口、以太网、扬声器、RS485 的端口数量。
- [x] **CAN 命名规范**：统一为 `CAN_1` 风格，并修复了默认值中的遗留错误。
- [x] **IO 扩展板资源化**：实现了基于 12+ 种型号的 AI/DI/DO/CAN 资源自动填充。
- [x] **CModel 生成逻辑**：后端已能正确生成包含复杂资源定义的 Protobuf 模型。

### 待解决/后续计划 (Upcoming)
- [ ] **传感器 (Sensors) 型号资源化**：类似 IO 板，通过型号自动锁定其资源接口与拓扑位置。
- [ ] **轮组驱动 (Wheel Drivers) 属性补全**：细化轮径、轮距、动力性能（额定电流/电压/转速）参数。
- [ ] **交互模块与电池**：尚未进行深度细化的组件模块。

---
>报告生成时间：2026-03-15 12:28
