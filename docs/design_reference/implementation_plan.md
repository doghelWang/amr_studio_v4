# AMR Studio V4 — 待修复缺陷与需求优化方案

> **文档目的**: 对 `Requirements_And_Tracking.md` 中 ISS-004 ~ ISS-011 共 8 项待解决问题进行根因分析、方案设计和实施计划。

---

## 可直接本轮修复的问题（代码层面可落地）

### ISS-004 ⚠️ 轮组联动同步角色混淆
**现象**: 卧式/立式舵轮的行走电机和转向电机被错误地互相同步。  
**根因**: `syncAttributeToSiblings`（[PowerSystemStep.tsx:113-191](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/components/wizard/PowerSystemStep.tsx#L113-191)）中的 `getFunctionalRole()` 依赖 `alias` 中文子串 "行走"/"转向" 做角色判定，但存在以下盲区：
1. 若 alias 中不含中文关键字，回退路径通过 `relateWalkMotor`/`relateRotMotor` 查找父轮组，但 **查找链深度不够**（电机→驱动器→轮子需两级回溯，代码只做了一级）。
2. `DRIVER`（驱动器）本身也有行走/转向之分，但 `getFunctionalRole` 中只处理了 `MOTOR`，没有处理 `DRIVER` 类别。
3. 同一立式舵轮内的行走驱动器和转向驱动器类型都是 `subDriver`、电机类型都是 `PMSMMotor`，仅靠 `category + type` 无法区分。

**方案**: 重构角色判定为 **基于创建时注入的 `functionalRole` 字段**，而非运行时推断。
- 在 `doCreateWheel` 创建子节点时，在 `ComponentConfig` 上注入一个新字段 `functionalRole`（如 `'walk'` / `'steer'`）。
- `syncAttributeToSiblings` 中直接比较 `functionalRole` 来决定是否同步。
- 对旧数据兼容：保留 alias 中文推断作为 fallback。

#### 修改文件
- [MODIFY] [PowerSystemStep.tsx](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/components/wizard/PowerSystemStep.tsx)
  - `doCreateWheel`: 给每个子节点注入 `functionalRole` 字段
  - `syncAttributeToSiblings`: 优先用 `functionalRole` 判定角色
- [MODIFY] [types.ts](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/store/types.ts)
  - `ComponentConfig` 接口新增可选字段 `functionalRole?: string`

---

### ISS-005 ⚠️ 轮组位置中心对称联动  
**现象**: 左右对称轮组的安装位置未自动关于底盘中心对称。  
**根因**: 代码中的对称逻辑（[PowerSystemStep.tsx:155-183](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/components/wizard/PowerSystemStep.tsx#L155-183)）已有框架，但有两个问题：
1. 坐标属性名 `locCoordNX` / `locCoordNY` 需确认与实际 JSON Schema 中的 key 是否一致。
2. `frontendGroupKey` 只在 `DRIVEWHEEL` 根轮子上注入，其子节点（电机、驱动）不参与坐标对称——这是正确的，因为子节点坐标是相对父节点的。
3. 需确认 topology 的 `key` 值（如 `fl_steer`, `rr_steer`）正确包含方位信息。

**方案**: 
1. 验证并修正 `frontendGroupKey` 是否正确用于所有轮组拓扑场景。
2. 在对称逻辑中增加对角对称（前左↔后右）支持。
3. 确保 Z 轴（高度）不参与对称反转。

#### 修改文件
- [MODIFY] [PowerSystemStep.tsx](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/components/wizard/PowerSystemStep.tsx)
  - 补全对角对称场景

---

### ISS-006 ⚠️ 主控制器 ETH 接口丢失
**现象**: BoardDescriptions.xml 中已有 ETH 接口定义，但前端导入主控制器设备时接口丢失。  
**根因**: 经过代码审计：
1. `BoardDescriptions.xml` 已明确包含 `<Interface protocol="ETHERNET" name="ETH_1"/>` 等 4 个 ETH 口。
2. Store 中 `fetchSchemas` 的 XML 解析逻辑（[useProjectStore.ts:722-737](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/store/useProjectStore.ts#L722-737)）正确读取 `protocol` 和 `name` 属性。
3. **问题在于触发时机**: 接口注入依赖 `DATA_COMBOX` 属性变化触发的 cascade reset（[useProjectStore.ts:472-488](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/store/useProjectStore.ts#L472-488)），需要用户在 UI 上选择了具体板卡型号后，通过 `boardInterfaces[possibleBoardKey]` 来注入。如果组件创建时 `DATA_COMBOX` 的默认值已经指向了某个板卡 typeKey，创建时也会触发注入（[useProjectStore.ts:316-327](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/store/useProjectStore.ts#L316-327)）。
4. **但可能的漏洞是**: 如果 `boardInterfaces` 还没有加载完成（异步获取XML），或默认值与 `boardInterfaces` 的 key 不匹配，接口就不会被注入。

**方案**: 
1. 在 `addComponent` 中增加更健壮的默认接口注入：如果组件 category 是主控制器类型，且 `boardInterfaces` 已加载但未匹配到key，则遍历 privateAttrs 中所有 `DATA_COMBOX` 类型字段的 **所有候选值**（而非仅当前值），尝试匹配。
2. 增加一个 fallback：如果匹配全部失败，对 category 为主控类型的组件，直接注入 BoardDescriptions.xml 中对应型号的全量接口。

#### 修改文件
- [MODIFY] [useProjectStore.ts](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/store/useProjectStore.ts)
  - `addComponent`: 增强对主控制器组件首次创建时的接口注入逻辑

---

### ISS-010 ⚠️ 项目保存功能
**现象**: 配置一半的项目无法保存和恢复。  
**当前状态**: ✅ **后端和前端代码已实现**，包括：
- 后端 `POST /api/v1/projects/save`、`GET /api/v1/projects/saved-list`、`GET /api/v1/projects/load/{name}` 已在 [main.py:163-198](file:///Users/wangfeifei/code/amr_studio_v4/backend/main.py#L163-198) 中实现。
- 前端 Store 中 `saveProject`、`listSavedProjects`、`loadProjectByName` 已在 [useProjectStore.ts:623-652](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/store/useProjectStore.ts#L623-652) 中实现。
- Welcome Screen 已重构为 3 列布局。
- Header 已集成保存按钮。

**需验证**: 服务器重启后是否正常工作（上一轮因 backend 未重启而 404）。

> [!TIP]
> ISS-010 已在上一轮开发中完成实现，本轮只需验证即可。

---

## 需要更大范围设计的问题（建议单独立项）

> [!IMPORTANT]
> 以下 4 个问题涉及较深的架构变更或全新 UI 组件开发，建议在本轮先标记为"已分析、等待排期"，每个单独立项实施。

### ISS-007 ⚠️ IO 模块图形化展示与连线
**现象**: IO模块的 DI/DO/AI/AO 无法与灯带、按钮等设备图形化连接。  
**分析**: 当前 [WiringStep.tsx](file:///Users/wangfeifei/code/amr_studio_v4/frontend/src/components/wizard/WiringStep.tsx) 使用表格式 IO Signal Mapping，支持功能标签绑定。但缺少：
1. 可视化连线图（需要类似 React Flow 的节点图）。
2. 按钮/灯带等外部设备的建模（当前无此类组件类型）。

**工作量评估**: 大型功能，需要扩展组件注册表 + 新建 ReactFlow 可视化画布。**建议单独立项。**

### ISS-008 ⚠️ CAN 总线拓扑展示
**现象**: 所有带 CAN 接口的设备都被平等展示为"总线端点"，但实际上只有主控制器的 CAN 才是总线（Bus master）。  
**分析**: 需要引入"总线归属"概念——主控的 CAN_1/CAN_2/CAN_3 是三条独立总线，其他设备的 CAN 接口是"从设备"，需挂到某条总线上。当前 WiringStep 缺少这种主从层级。

**工作量评估**: 中型功能，需重构 WiringStep 的通信拓扑渲染。**建议单独立项。**

### ISS-009 ⚠️ 总线接口参数展示
**现象**: 波特率、网络地址、CAN ID 等参数未在接线界面展示。  
**分析**: 当前 `InterfaceConfig` 类型只有 `key`、`type`、`label`、`interfaceUuid`、`linkedInterfaceUuid`。需要扩展为包含 `params` 对象（baudRate、address、canId 等）。

**工作量评估**: 中型功能，需扩展类型定义 + UI 表单。**建议与 ISS-008 合并立项。**

### ISS-011 ⚠️ 导出文件规范校验
**现象**: 导出的 JSON 文件需要符合原平台规范，序列化成 cmodel 后可被无损导入。  
**分析**: 需要建立完整的 JSON Schema 校验管道，覆盖 abiset.json、modeldesc.json、funcdesc.json 等文件。This is an E2E validation problem。

**工作量评估**: 大型功能，需要对每种文件建立 schema 并测试编解码往返一致性。**建议单独立项。**

---

## 本轮执行计划

| 优先级 | Issue | 行动 | 工作量 |
|:---:|:---:|:---|:---:|
| P0 | ISS-004 | 重构 `functionalRole` 注入 + sync 角色判定 | 中 |
| P0 | ISS-005 | 修正对角对称逻辑 + 验证 topology keys | 小 |
| P1 | ISS-006 | 增强主控组件创建时的接口注入兜底 | 小 |
| P2 | ISS-010 | 验证已实现的保存/加载功能 | 小 |
| — | ISS-007/008/009/011 | 标记为"已分析，等待排期" | — |

## 验证计划

### 自动化测试
1. **ISS-004**: 创建双舵轮底盘 → 选择卧式舵轮 → 修改前轮的转向电机编码器线数 → 验证只有后轮的转向电机被同步，行走电机不受影响。
2. **ISS-005**: 创建前后轮 → 修改前轮的 Y 坐标 → 验证后轮 Y 坐标取反同步。
3. **ISS-006**: 在组件库添加主控制器 → 验证接口列表包含 ETH_1~ETH_4。
4. **ISS-010**: 填写机器人名称 → 保存 → 刷新 → 从已保存列表加载 → 验证名称恢复。

### 浏览器验证
- 使用 browser subagent 在 `http://localhost:8002/` 上执行完整交互测试。

## 用户确认事项

> [!IMPORTANT]
> 1. ISS-007、008、009、011 是否可以暂缓到下一轮单独立项处理？它们需要较大的架构变更。
> 2. ISS-004 的 `functionalRole` 字段注入方案，是否同意在 `ComponentConfig` 中新增此字段？这将影响已保存项目的数据结构（旧数据无此字段，会 fallback 到中文推断）。
