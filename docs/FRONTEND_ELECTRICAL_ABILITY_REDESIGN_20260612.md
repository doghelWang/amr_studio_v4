# 前端电气连接与功能能力设计重构方案

日期：2026-06-12

## 0. 基线验证

本次设计分析前已执行后端单元回归：

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

结果：

- 用例数：53
- 结果：OK

关联分析报告：

- `docs/CMODEL_MODULE_LIBRARY_PIPELINE_ANALYSIS_20260612.md`
- `docs/CROSS_CMODEL_GAP_ANALYSIS_20260612.md`
- `docs/FRONTEND_ELECTRICAL_ABILITY_DETAILED_DESIGN_20260612.md`

本方案聚焦前端，不直接修改后端协议实现；但所有设计都必须能落到后端 `CompDesc`、`AbiSet`、`FuncDesc` 的事实结构上。

## 1. 当前前端实现审计

### 1.1 当前页面流程

当前向导步骤定义在 `src/frontend/src/App.tsx`：

| 步骤 | 当前职责 | 问题 |
| --- | --- | --- |
| 身份信息 | 机器人元数据 | 与 cmodel 全局字段弱绑定 |
| 底盘与动力 | 底盘尺寸、动力选择 | 可生成组件，但与真实电气关系弱耦合 |
| 电气装配 | 添加模块 | 模块事实较完整，但未形成电气网络 |
| 安装坐标 | 6-DOF 位姿 | 属于机械/空间拓扑 |
| 接口连线 | 通信连接 | 只有接口点到点选择，缺少连接实体和过程 |
| 功能映射 | 能力配置 | 只编辑 `functionAbility` 表单，不描述 `FuncDesc` 功能过程 |
| 审计导出 | 校验与导出 | 校验项偏局部，缺少连接完整性和功能闭环 |

### 1.2 当前电气连接实现

主要文件：

- `src/frontend/src/components/wizard/WiringStep.tsx`
- `src/frontend/src/store/useProjectStore.ts`
- `src/frontend/src/store/types.ts`
- `src/frontend/src/store/ImportService.ts`
- `src/frontend/src/services/ExportService.ts`

当前数据结构：

```ts
interface InterfaceConfig {
  key: string;
  type: string;
  interfaceUuid: string;
  linkedInterfaceUuid?: string[];
  interfaceAttrs?: any;
  interfaceParams?: any;
}
```

当前 store 行为：

```ts
linkInterface(sourceUuid, sourceIfaceUuid, targetIfaceUuid)
```

现状结论：

- 前端只把连接关系存放在接口自身的 `linkedInterfaceUuid` 上。
- 没有独立的电气连接对象。
- 没有连接方向、连接类型、连接协议、连接来源、连接校验状态。
- 没有从模块库 `Interface_Attr` / `Interface_Prarm` 形成完整接口参数编辑闭环。
- 没有区分通信总线、IO 信号、电源连接、电池 BAT、板载 SPI 等不同连接语义。
- 当前 UI 能辅助选择接口，但不能完整表达 `cmodel` 中真实的电气网络。

### 1.3 当前能力/功能实现

主要文件：

- `src/frontend/src/components/wizard/AbilityStep.tsx`
- `src/frontend/src/store/ability_registry.json`
- `src/frontend/src/store/ImportService.ts`
- `src/frontend/src/services/ExportService.ts`

当前能力注册表只包含：

- `locationAbility`：定位能力。
- `safetyAbility`：安全能力。
- `sensoryRecoAbi`：感知识别。

当前导出：

- `ExportService.exportAbilities()` 只生成 `AbiSet.functionAbility`。
- 默认能力注册表不包含 `componentAbility`。
- 前端没有独立 `FuncDesc` 数据模型。
- 前端没有“功能过程”的节点、触发条件、输入输出、关联能力、关联组件。

现状结论：

- 当前 `AbilityStep` 是“能力参数编辑器”，不是“功能能力描述过程设计器”。
- 它能表达“某个能力关联哪个组件”，但不能表达“功能如何由硬件、连接、能力共同构成”。
- 导出时 `FuncDesc` 仍主要依赖后端保留/透传，前端没有对其负责。

## 2. 从 CModel 对比得到的前端缺口

三模型交叉对比显示：

- `linkedInterfaceUuid` 是真实模型中的关键连接字段，三个模型均无悬挂引用。
- `BAT`、`SPI`、`CAN`、`RS485`、`DI`、`DO`、`ETH` 等接口类型都具有业务含义。
- `screen`、`battery`、`gyro`、`steerChassis`、`diffSteerWheel`、`pullWireEncode`、`absoluteValueEncode` 等模块都需要通过接口与能力过程参与系统。
- `moduleDscType.typeKey`、`venderName.typeKey` 可能为空，不能由前端猜测填充。

前端必须补齐两类能力：

- 电气网络表达能力：用户能看见、编辑、校验真实接口连接网络。
- 功能过程表达能力：用户能看见硬件如何进入能力、能力如何进入功能过程。

## 3. 重构目标

### 3.1 设计目标

- 将接口连接从“接口字段上的附属数组”提升为前端一等模型。
- 将能力配置从“表单参数”提升为“硬件能力 + 功能过程”的双层模型。
- 所有字段来源必须可追溯，不通过猜测、创造、假想补齐参数、描述或连接。
- 前端展示必须能解释：某个功能为什么成立、依赖哪些组件、走哪条电气连接、缺什么字段。

### 3.2 非目标

- 不在前端重新实现 protobuf 编码。
- 不用 UI 规则硬编码代替模块库注册表。
- 不把字段描述、模块名、接口名推断成真实设备型号或供应商。
- 不在没有事实来源时自动创建连接或能力。

## 4. 新前端信息架构

建议将原 7 步调整为 8 步：

| 新步骤 | 名称 | 核心产物 |
| --- | --- | --- |
| 1 | 项目与整车身份 | `RobotIdentity` |
| 2 | 机械底盘与运动机构 | 底盘、轮组、驱动机构、安装层级 |
| 3 | 模块库装配 | 组件实例、模块事实源、私有属性 |
| 4 | 安装坐标 | `parentNodeUuid`、6-DOF、机械拓扑 |
| 5 | 电气接口矩阵 | 接口实例、接口参数、接口能力 |
| 6 | 电气连接拓扑 | 独立连接实体、连接校验、连接图 |
| 7 | 能力与功能过程 | `AbiSet` 映射、`FuncDesc` 过程描述 |
| 8 | 审计与导出 | 全量诊断、debug artifacts、导出 |

关键变化：

- 原 `接口连线` 拆成“接口矩阵”和“连接拓扑”。
- 原 `功能映射` 升级为“能力与功能过程”。
- 审计页必须汇总组件、接口、连接、能力、功能、导出诊断。

## 5. 数据模型重构

### 5.1 接口实例模型

保留 `InterfaceConfig`，但补充来源与校验信息：

```ts
interface InterfaceInstance {
  componentId: string;
  interfaceUuid: string;
  key: string;
  type: string;
  desc?: string;
  path?: string;
  interfaceAttrs?: AttributeGroupLike;
  interfaceParams?: AttributeGroupLike;
  source: 'imported_cmodel' | 'module_library' | 'user_created';
  sourceRef?: string;
  diagnostics?: ValidationIssue[];
}
```

说明：

- `source` 必须明确字段来源。
- `interfaceAttrs` 与 `interfaceParams` 必须来自原模型或模块库，不能凭接口类型猜测。
- 原 `ComponentConfig.interfaces` 可继续保存接口实例，但 UI 层应通过索引视图统一读取。

### 5.2 电气连接模型

新增一等连接实体：

```ts
type ElectricalConnectionKind =
  | 'communication_bus'
  | 'io_signal'
  | 'power'
  | 'onboard'
  | 'audio_video'
  | 'unknown';

interface ElectricalConnection {
  id: string;
  kind: ElectricalConnectionKind;
  sourceComponentId: string;
  sourceInterfaceUuid: string;
  targetComponentId: string;
  targetInterfaceUuid: string;
  interfaceType: string;
  direction: 'source_to_target' | 'target_to_source' | 'bidirectional' | 'unknown';
  params?: Record<string, unknown>;
  source: 'imported_cmodel' | 'user_selected' | 'backend_resolved';
  diagnostics: ValidationIssue[];
}
```

与 cmodel 的映射：

- `ElectricalConnection` 是前端语义层。
- 导入时从 `linkedInterfaceUuid` 反建连接实体。
- 导出时由连接实体回写双方或主侧 `linkedInterfaceUuid`。
- 编译前必须验证所有 `linkedInterfaceUuid` 都能解析到现有接口。

### 5.3 能力实体模型

将 `AbiSet` 分成两层：

```ts
interface AbilityModel {
  version: string;
  componentAbility: ComponentAbility[];
  functionAbility: FunctionAbility[];
  source: 'imported_cmodel' | 'ability_registry' | 'user_edited';
}
```

要求：

- `componentAbility` 不再被忽略。
- `functionAbility` 仍由 registry 和导入模型共同驱动。
- 所有 FIXED_E 关联必须保存目标组件 UUID 与来源路径。

### 5.4 功能过程模型

新增 `FunctionProcessModel`，对应 `FuncDesc` 的前端语义层：

```ts
interface FunctionProcess {
  id: string;
  type: string;
  desc: string;
  trigger?: string;
  inputs: FunctionEndpoint[];
  outputs: FunctionEndpoint[];
  relatedAbilities: string[];
  relatedComponents: string[];
  relatedConnections: string[];
  source: 'imported_func_desc' | 'user_created' | 'template';
  diagnostics: ValidationIssue[];
}
```

说明：

- `FuncDesc` 不应只作为后端透传文件。
- 前端至少要能展示、保留、校验导入的功能过程。
- 新建项目如果没有功能过程模板，应明确显示“未配置”，不能静默生成假功能。

## 6. 页面设计方案

### 6.1 电气接口矩阵页

目标：

- 展示每个组件有哪些接口。
- 展示接口来源、类型、参数、能力数量。
- 支持编辑接口参数。
- 支持筛选 `CAN`、`DI`、`DO`、`RS485`、`BAT`、`SPI`、`ETH` 等类型。

建议布局：

- 左侧：组件树。
- 中间：接口矩阵表。
- 右侧：接口详情与参数编辑器。

接口表字段：

- 组件名。
- 接口 key。
- 接口类型。
- UUID。
- 已连接数量。
- 参数完整度。
- 来源。
- 诊断状态。

关键交互：

- 点击接口查看 `interfaceAttrs`、`interfaceParams`。
- 对 `BAT`、`SPI` 等原先容易漏掉的接口进行高亮。
- 参数编辑必须来自 schema，不允许自由创造未知参数。

### 6.2 电气连接拓扑页

目标：

- 以连接实体为中心，而不是以接口数组为中心。
- 同时支持拓扑图和连接清单。

建议分区：

- 通信总线：CAN、RS485、RS232、UART、ETH。
- IO 信号：DI/DO、AI/AO。
- 电源与电池：BAT、电源控制、充电相关。
- 板载连接：SPI_ON_BOARD、主控板载 gyro。

连接校验规则：

- 同类型通信接口可连，但需要检查协议、波特率、SWTAGS/BUSTAGS。
- `DI` 必须连接 `DO`，`DO` 必须连接 `DI`。
- `BAT` 必须连接电池类模块或模块库允许的电池接口。
- `SPI` 板载连接通常不应由用户随意接线，应显示为板载事实关系。
- 不允许连接到不存在的 interface UUID。
- 不允许一个不支持多连接的接口被多次占用。

关键输出：

- `ElectricalConnection[]`
- 回写到 `ComponentConfig.interfaces[].linkedInterfaceUuid`
- 审计报告中的连接完整性结果。

### 6.3 能力与功能过程页

建议拆成三个 Tab：

| Tab | 职责 |
| --- | --- |
| 硬件能力源 | 按组件列出可提供的能力、接口、私有属性 |
| 功能能力映射 | 编辑 `AbiSet.functionAbility` 和 `componentAbility` |
| 功能过程编排 | 展示/编辑 `FuncDesc` 语义过程 |

硬件能力源：

- 从组件类型、子类型、接口、私有属性中展示事实能力。
- 只展示事实，不自动创建能力。

功能能力映射：

- 继续复用 `RecursiveAttributeEditor`。
- FIXED_E 选择器必须按 `fixedSource` 精确过滤组件。
- 选择组件后显示该组件连接状态和关键接口状态。

功能过程编排：

- 将功能过程展示为“输入硬件 -> 能力 -> 输出功能”的链路。
- 例如：
  - 激光/相机/gyro -> 定位能力 -> 导航功能。
  - 碰撞条/急停按钮/IO 连接 -> 安全能力 -> 急停/避障功能。
  - 读码器/相机 -> 感知识别能力 -> 码识别功能。

导入模型时：

- 如果 `FuncDesc.json` 存在，应解析成只读或可编辑过程。
- 如果暂未支持完整编辑，应至少展示原始过程数量、类型、关联关系和不可编辑原因。

新建模型时：

- 如果没有功能过程模板，页面必须显示“未配置功能过程”。
- 不得自动造 `FuncDesc.function`。

## 7. Store 与服务层重构

### 7.1 Zustand Store 拆分

当前 `useProjectStore.ts` 承载过多职责，建议拆分语义模块：

- `projectSlice`：项目 ID、保存、加载。
- `componentSlice`：组件实例、属性、安装结构。
- `interfaceSlice`：接口实例索引、接口参数。
- `connectionSlice`：电气连接实体、连接校验、回写。
- `abilitySlice`：`AbiSet` 编辑。
- `functionSlice`：`FuncDesc` 展示/编辑。
- `auditSlice`：统一诊断。

### 7.2 导入流程

当前：

```text
CompDesc.json -> ComponentConfig[]，linkedInterfaceUuid 留在 interfaces 上
AbiSet.json -> abilities
FuncDesc.json -> 未进入前端语义模型
```

建议：

```text
CompDesc.json
  -> ComponentConfig[]
  -> InterfaceInstance[]
  -> ElectricalConnection[]

AbiSet.json
  -> AbilityModel

FuncDesc.json
  -> FunctionProcessModel
```

导入后应立即生成：

- 接口索引。
- 连接索引。
- 连接完整性诊断。
- 能力引用诊断。
- 功能过程诊断。

### 7.3 导出流程

当前导出时：

- init-sandbox 发送整包 config。
- 后续只 patch abilities 和安装坐标。
- 连接关系缺少显式同步步骤。
- `FuncDesc` 缺少显式同步步骤。

建议导出顺序：

```text
1. validateProject()
2. materializeConnectionsToInterfaces()
3. materializeAbilities()
4. materializeFunctionProcesses()
5. init-sandbox 或 patch project semantic model
6. patch components / abilities / functions / connections
7. compile
8. 展示 debug artifacts
```

前端必须在导出前阻断：

- 悬挂接口连接。
- 无事实来源的接口参数。
- FIXED_E 指向不存在组件。
- 功能过程引用不存在能力。
- 功能过程引用不存在组件或连接。

## 8. 后端契约建议

前端重构需要后端逐步提供这些 API，避免前端自己推协议：

| API | 用途 |
| --- | --- |
| `GET /api/v1/models/{projectId}/interfaces` | 返回接口索引 |
| `PATCH /api/v1/models/{projectId}/interfaces/{interfaceUuid}` | 更新接口参数 |
| `GET /api/v1/models/{projectId}/connections` | 返回连接实体视图 |
| `PUT /api/v1/models/{projectId}/connections` | 保存连接实体并回写 `linkedInterfaceUuid` |
| `GET /api/v1/models/{projectId}/functions` | 返回 `FuncDesc` 语义视图 |
| `PATCH /api/v1/models/{projectId}/functions` | 更新功能过程 |
| `POST /api/v1/models/{projectId}/validate` | 全量校验组件、接口、连接、能力、功能 |

后端返回诊断结构建议：

```ts
interface Diagnostic {
  severity: 'error' | 'warning' | 'info' | 'trace';
  code: string;
  message: string;
  path?: string;
  componentId?: string;
  interfaceUuid?: string;
  connectionId?: string;
  source?: string;
}
```

## 9. 审计规则升级

前端 `AuditStep` 应从本地简单规则升级为“本地预检 + 后端事实校验”。

本地预检：

- 必填属性。
- 数值范围。
- 组件引用存在。
- 连接实体基本合法。

后端事实校验：

- protobuf schema unknown fields。
- 模块库注册表覆盖。
- `linkedInterfaceUuid` 无悬挂。
- `AbiSet` 与 `FuncDesc` 可编码。
- 导出前后关键结构一致。

必须新增的审计项：

- `BAT` 接口不能丢失。
- `screen/subScreen` 类型不能丢失。
- `SPI` 板载 gyro 关系不能被错误要求用户接线。
- `moduleDscType.typeKey` 空值不能被猜测填充。
- `venderName.typeKey` 空值不能被猜测填充。
- `componentAbility` 数量与来源必须显示。
- `FuncDesc.function` 数量与来源必须显示。

## 10. 分阶段执行计划

### P0：建立语义模型与只读可视化

目标：

- 不先大改 UI，先让前端看见真实连接和功能缺口。

任务：

- 新增 `ElectricalConnection` 类型。
- 从导入模型的 `linkedInterfaceUuid` 反建连接实体。
- 新增连接完整性校验工具。
- 在 `WiringStep` 增加“连接清单”视图，展示连接来源和诊断。
- 在 `AbilityStep` 增加 `componentAbility` 和 `FuncDesc` 摘要区。
- 审计页显示接口连接、能力、功能摘要。

验收：

- 导入三份 fixture 后，连接数量与报告一致。
- 三份 fixture 均显示 `未解析连接 = 0`。
- `BAT`、`screen`、`SPI gyro` 都能在 UI 中被看见。

### P1：重构电气连接编辑

目标：

- 用户通过连接实体编辑电气网络。

任务：

- 将 `linkInterface` 改造为 `createConnection/updateConnection/removeConnection`。
- 由连接实体统一回写 `linkedInterfaceUuid`。
- 增加通信总线、IO、电源、板载连接的类型化规则。
- 增加接口参数编辑器。
- 增加连接冲突检测。

验收：

- 删除连接后双方引用一致更新。
- 创建连接前有类型校验。
- 不允许连接到不存在接口。
- 不允许非法 DI/DO 同向连接。

### P2：重构能力与功能过程

目标：

- 前端能完整承载 `AbiSet` 和 `FuncDesc` 的可见语义。

任务：

- 新增 `FunctionProcessModel`。
- 导入 `FuncDesc.json` 并展示过程列表。
- `AbilityStep` 拆成硬件能力源、功能能力映射、功能过程编排。
- FIXED_E 选择器展示组件连接状态。
- 导出时显式同步能力和功能过程。

验收：

- `AbiSet.componentAbility` 不丢失。
- `AbiSet.functionAbility` 可编辑并可导出。
- `FuncDesc.function` 数量在导入、保存、导出后不丢失。

### P3：前后端统一校验与 debug artifacts 联动

目标：

- 前端能消费后端 debug artifacts 和诊断。

任务：

- 调用后端 validate API。
- 审计页展示后端诊断路径。
- 编译成功后展示 debug artifact 链接。
- 支持下载前端语义模型、中间连接模型、最终 cmodel。

验收：

- 用户可以从 UI 追踪“字段来源 -> 连接关系 -> 能力过程 -> 导出产物”。
- 任何无事实来源字段都以诊断形式出现，不被自动补造。

## 11. 推荐下一步

建议下一轮直接实施 P0：

1. 新增前端 `ElectricalConnection` 类型和反建工具。
2. 从现有 `ComponentConfig.interfaces[].linkedInterfaceUuid` 生成连接清单。
3. 在 `WiringStep` 增加连接清单 Tab。
4. 在 `AuditStep` 增加连接完整性、`componentAbility`、`FuncDesc` 摘要。
5. 使用三份 cmodel fixture 的统计结果作为手工/自动验收基线。

这一步风险较低，因为先做只读语义层和诊断，不会破坏现有导出路径；同时能立刻暴露前端对电气连接和功能过程的真实缺口。
