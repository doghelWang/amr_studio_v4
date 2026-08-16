# AMR Studio V4 契约冻结基线

日期：2026-04-22
用途：作为 Sprint 1 的统一检查清单
状态：初版

## 1. 目标

本文件用于回答一个问题：

在开始结构性重构之前，哪些契约必须被冻结，哪些行为必须被回归保护，哪些语义不能在未决策前被“顺手优化”。

## 2. 四层模型定义

### 2.1 UI Config

定义：
前端页面编辑态使用的数据结构，服务于交互和表单组织。

当前代表：

- `RobotConfig`
- `RobotIdentity`
- `ComponentConfig`
- `ControllerAbility`

约束：

- 可以为交互体验包含 UX 层字段和辅助状态。
- 不应直接承担 Proto 兼容修补责任。

### 2.2 Canonical Domain Model

定义：
系统内部唯一可信的领域模型，用于承载组件、能力、拓扑、安装信息和导出语义。

当前状态：

- 尚未显式存在
- 当前被分散埋在前端 `ImportService/useProjectStore` 与后端 `resource_adapter/encoder` 中

冻结要求：

- Sprint 1 必须输出该模型的草案边界
- 后续转换链必须围绕它收敛

### 2.3 Protocol JSON

定义：
与 `CompDesc/AbiSet` 对应的协议 JSON 表示层。

当前代表：

- 前端导出映射结果
- 后端 sandbox 中的 `blueprint_CompDesc.json`
- 模块文件与 `AbiSet.json`

风险：

- 当前不是单一格式，而是多处变种并存
- 不应直接被视为长期领域模型

### 2.4 Proto Binary

定义：
最终 `.model` 二进制和 `.cmodel` 包内容。

冻结要求：

- 该层语义不可被 UI 或中间存储实现随意改变
- 必须拥有至少一条严格校验路径

## 3. 单一事实源表

当前结论：

- Proto 定义：二进制协议的最终事实源
- Schema / ModuleLibrary：模块属性、接口能力和模板缺省的事实源
- UI Config：不是协议事实源，只是编辑视图模型
- blueprint / modules JSON：当前实现中的中间存储，不是长期事实源
- boardInterfaces / masterRegistry：应被统一治理，不得长期并行多源

待决策项：

- `RobotConfig` 是否升级为 canonical model 的直接表达
- `/api/v1/schemas` 的正式契约形状
- `masterRegistry` 的保留或迁移策略

## 4. 默认值策略冻结

必须区分两类默认值：

- Schema 默认值：来自模块库 / schema / template
- UX 默认值：为了创建体验而给出的初始值

冻结规则：

- 未经决策，不得把 UX 默认值冒充为协议默认值
- 未经决策，不得为了“去硬编码”直接删除 UX 默认值
- 所有默认值必须标注来源：`schema`、`template`、`ux`

## 5. 兼容策略冻结

以下兼容逻辑暂时允许存在，但必须标记为兼容层，而不是长期架构：

- CamelCase / SnakeCase 双键兼容
- `arrayAttr / arrayCmobEle` 差异兼容
- 历史模块类别名兼容
- 中间格式清洗、重命名、扁平化

冻结规则：

- 兼容逻辑不得继续无边界扩散
- 新逻辑优先写入 canonical model 或明确 adapter
- 所有新增兼容都必须说明退出条件

## 6. 禁止猜测与创造

冻结规则：

- 不允许通过猜测、创造、假想的方式补齐参数、描述信息、能力内容、模块内容或协议字段。
- 若事实源中没有该值，则只能：
  - 保持缺失
  - 显式报错
  - 标记为待确认
  - 使用已在正式规范中登记的兜底值
- 所有描述性内容必须来自 Proto、Schema、模板库、外部配置或明确用户输入，不得为了“让链路跑通”临时编造。
- 若某处代码确实需要兜底，必须能说明它对应的正式来源。

## 7. 回归保护清单

Sprint 1 至少要保护以下行为：

- 上传 `.cmodel` 后可成功解包并建立项目
- PATCH 组件后可成功编译导出
- 编译生成的 CSV 读取的是实时模块/blueprint 数据
- roundtrip 不丢关键 identity / ability / topology 字段
- 至少一条严格 proto 校验链路通过

## 8. 暂停线

在以下事项未确认之前，不进入大规模目录迁移或服务化：

- canonical model 草案未形成
- 默认值策略未冻结
- `/api/v1/schemas` 契约未冻结
- 最小回归集未建立

## 9. Sprint 1 输出要求

本基线文件要求本周至少新增以下配套产物：

- `GOLDEN_FIXTURE_MATRIX`
- 默认值策略表
- 兼容策略表
- canonical model 草案
- 最小回归命令集
