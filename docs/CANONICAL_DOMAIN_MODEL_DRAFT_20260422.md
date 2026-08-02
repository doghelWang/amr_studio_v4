# AMR Studio V4 Canonical Domain Model 草案

日期：2026-04-22
状态：Sprint 1 草案
用途：定义系统内部唯一可信的领域模型边界，作为后续重构收敛目标

## 1. 为什么需要 Canonical Model

当前系统存在多套并行模型：

- 前端 UI 编辑模型：`RobotConfig / ComponentConfig / Ability*`
- 前端导入推理模型：`ImportService` 内部重建的拓扑、驱动类型、powerSlots
- 后端中间存储模型：`blueprint_CompDesc.json` 与 `modules/*.json`
- 后端协议映射模型：`resource_adapter.py` 与 `encoder.py` 处理的 proto 风格 JSON
- 最终二进制模型：`CompDesc.model / AbiSet.model / FuncDesc.model`

问题不在于模型多，而在于当前没有一个被正式命名为“唯一可信内部表示”的模型。结果是：

- 前后端都在各自推理领域语义
- blueprint 这种中间格式被误当作长期契约
- 兼容逻辑和补丁逻辑不断向上扩散

因此 Sprint 1 的目标不是立刻实现 Canonical Model，而是先把它的边界说清楚。

## 2. Canonical Model 的定义

Canonical Domain Model 指：

- 用来表达机器人配置领域语义的内部模型
- 不直接服务于某个 UI 组件
- 也不直接等同于 Proto JSON 或中间存储文件
- 必须能完整承载导入、编辑、校验、导出所需的语义

它应该位于转换链中间：

`Proto / Protocol JSON <-> Canonical Domain Model <-> UI View Model`

## 3. 边界原则

### 3.1 Canonical Model 不负责的事情

- 不负责前端界面局部状态，如弹窗、选中节点、当前 step
- 不负责某一层协议的字段命名兼容，如 camel/snake 双键
- 不负责中间存储格式，如 `blueprint_CompDesc.json` 的拆分方式
- 不负责临时兜底产生的审计文本或日志文本

### 3.2 Canonical Model 必须负责的事情

- 机器人身份与性能语义
- 组件实体及其物理挂载语义
- 拓扑关系与父子关系
- 能力定义与能力绑定关系
- 接口实例与连接关系
- 导出时需要保留的协议级元数据

## 4. 建议的 Canonical 聚合

### 4.1 RobotAggregate

表示一个完整机器人项目，应包含：

- `identity`
- `components`
- `abilities`
- `topology`
- `artifactsMeta`

### 4.2 Identity

建议承载：

- 名称、版本、物料、别名、厂商
- 导航方式、驱动类型
- 底盘几何信息
- Idle / Full Load 性能参数

说明：

- 这部分与前端 `RobotIdentity` 高度接近
- 但需要去掉纯 UI 便捷字段，保留真正领域语义

### 4.3 Component

建议承载：

- 稳定组件 ID
- 名称与别名
- 组件类别与子类型
- 父子关系
- 安装位姿
- 私有属性组
- 接口实例
- 形状信息
- 保真元数据容器

说明：

- 对应当前前端 `ComponentConfig`
- 但需要区分“领域字段”和“协议保真字段”

### 4.4 AbilitySet

建议承载：

- version
- componentAbility
- functionAbility
- 与硬件组件或接口的绑定关系

说明：

- 必须完整保留协议元数据
- 不允许在导入导出过程中因为 UI 不展示而丢字段

### 4.5 Topology

建议单独成模，不埋在组件或导入器内部：

- 父子挂载关系
- 电机/驱动/轮组映射
- 接口连线关系
- 推导出的角色标签

说明：

- 当前这部分主要埋在 `ImportService`
- 后续应从“导入细节”提升为正式领域服务

## 5. 建议的字段分层

每个领域对象建议拆成三层字段：

### 5.1 Core Fields

用于领域计算和业务逻辑：

- `driveType`
- `category`
- `parentNodeUuid`
- `mount pose`
- 关键 identity 性能字段

### 5.2 Fidelity Fields

用于保证协议往返保真：

- `generalAttr` 原始补充字段
- `rawStructParam`
- `interfaceAbility`
- 未在 UI 中直接编辑但必须保留的属性

### 5.3 Derived Fields

由规则推导，不作为事实源：

- `powerSlots`
- 某些角色标签
- 同步模式判断
- 展示用聚合文本

规则：

- Derived 字段不得反向覆盖事实源字段
- 若 Derived 需要持久化，必须明确原因

## 6. 与现有模型的关系

### 6.1 与前端 `RobotConfig` 的关系

判断：

- `RobotConfig` 是当前最接近 Canonical 的候选
- 但它仍混有 UI 便利性与部分导入推理结果

结论：

- Sprint 1 不直接宣布 `RobotConfig = Canonical`
- 但后续可考虑以它为基础收敛

### 6.2 与 blueprint/modules 的关系

判断：

- `blueprint_CompDesc.json` 和 `modules/*.json` 是后端当前存储实现
- 它们需要编译前再经过清洗、字段名同步和树扁平化

结论：

- 它们不是 Canonical Model
- 只应被视为当前实现阶段的内部持久化格式

### 6.3 与 Proto JSON 的关系

判断：

- Proto JSON 是协议表示层
- 不是内部领域模型

结论：

- 只能通过 adapter 与 Canonical 互转
- 不应直接进入前端 store 作为长期编辑态

## 7. 后续重构要求

### 7.1 前端

- 从 `App.tsx`、`useProjectStore.ts`、`ImportService.ts` 中抽离领域逻辑
- UI 组件只消费 View Model 或 usecase 结果

### 7.2 后端

- `resource_adapter.py`、`encoder.py` 不应继续混合领域决策与协议转换
- 中长期应变成：
  - domain service
  - protocol adapter
  - storage repository

### 7.3 测试

- 回归测试要覆盖：
  - Proto -> Canonical
  - Canonical -> Proto
  - Canonical -> UI View Model
  - UI Edit -> Canonical Patch

## 8. 本周输出要求

Sprint 1 不要求实现完整 Canonical Model，但至少要达成：

- 团队承认它是后续唯一收敛目标
- 不再把 blueprint 当长期领域契约
- 后续新逻辑优先放入 domain/usecase 层，而不是继续散落在 UI/store/adapter 中
