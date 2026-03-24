# AMR Studio V4 优化日志 - 2026-03-24

## 1. 核心优化内容 (Core Optimizations)

### 1.1 PLC 风格电气总线拓扑 (Step 5 Refined)
- **拓扑架构**：放弃了扁平化的接口列表，转而采用以“端口即总线”为核心的 PLC 树状拓扑。
- **主从逻辑**：主控（MAINCPU）的每个通讯端口被视为一个独立的物理总线分支，从站设备挂载在对应的端口分支下。
- **UI 降噪**：大幅简化了设备卡片的信息密度，仅保留 `名称`、`端口号` 和 `协议类型`，突出显示电气连接关系。
- **接口过滤**：实现了智能过滤逻辑，仅展示通讯类接口（CAN, Ethernet, 485, 232, LIN），屏蔽了电源（PI/PO）和内部（LVDS）等非布线必需接口。

### 1.2 9步法骨架装配向导 (Step 3 Refined)
- **分步装配逻辑**：将复杂的硬件搭建拆解为 9 个逻辑步骤（底盘 -> 主控 -> 动力 -> 感知 -> ...），提供顺序引导。
- **双字段命名系统**：新增设备时支持同时设置 `设备别名 (Alias)` 和 `技术标识符 (Name / ID)`，满足业务逻辑与技术查找双重需求。
- **分栏 detail 视图**：右侧属性面板重构为四分页布局（安装标定、标识信息、私有属性、电气接口），支持 6-DOF 位姿直接编辑。
- **库过滤鲁棒性**：修复了因后端 JSON 拼写错误 (`moduleComponets`) 导致的资源库显示不全问题，实现了基于 `generalAttr` 的智能分类过滤。

### 1.2 系统稳定性与兼容性修复
- **CORS 跨域修复**：在 FastAPI 后端引入了 `CORSMiddleware`，并彻底解决了 `http://localhost:3000` 访问 `8002` 端口时的跨域导出/导入报错。
- **Ant Design v5 全面迁移**：针对 antd v5.x 的最新规范，修正了全量组件的弃用警告：
  - `Card`: `bordered={false}` $\rightarrow$ `variant="borderless"`
  - `Select`: `dropdownStyle` $\rightarrow$ `styles.popup.root`
  - `InputNumber`: `addonAfter` $\rightarrow$ `suffix`
- **稳健的导入逻辑**：重构了 `App.tsx` 的文件导入机制，使用 `useRef` 持久化隐藏 input 元素，规避了动态创建元素导致的事件丢失和浏览器兼容性问题。

### 1.3 CModel 解析与映射增强
- **端到端闭环**：通过 `MQ-Q3-600LE-D(T).cmodel` 完成了从导入、解析、UI 呈现到拓扑生成的全链路验证。
- **双键值兼容**：后端支持自动解析 CamelCase 和 Snake_Case 两种风格的 CModel 属性，确保对旧版模型的兼容性。

## 2. 遗留问题与改进方向 (Legacy & Technical Debt)
- [AbilityStep]：功能映射（Navi/Safety/Logic）的 UI 交互尚未与后端 proto 语义完全联动。
- [AuditStep]：需要增加更严格的布线规则校验（例如：CAN 节点数量上限、通讯频率匹配等）。

## 3. 下步计划 (TODOs)
- [x] 完成 `ComponentLibraryStep` 的 9 步法顺次装配逻辑。
- [x] 实现 Alias 与 Name 的双重命名机制。
- [ ] 完成 `AbilityStep` 的可视化映射编辑器。
- [ ] 增强 `AuditStep` 的实时校验逻辑。
- [ ] 实现模型版本比对功能（Diffing）。

---
**Antigravity AI Coding Assistant**
*Archive Date: 2026-03-24*
