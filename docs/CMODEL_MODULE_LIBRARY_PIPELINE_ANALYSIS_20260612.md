# CModel、模块库与解析生成链路分析报告

日期：2026-06-12

## 0. 回归验证

本次分析前已执行后端单元回归：

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

结果：

- 用例数：53
- 结果：OK
- 结论：现有后端重构基线可作为继续分析和优化的稳定起点。

## 1. 分析范围与原则

本报告覆盖三部分：

- 参考 `cmodel` 的结构构成：以已反解析的 `artifacts/decoded_校验模型_20260503_1015/CompDesc.json`、`AbiSet.json`、`FuncDesc.json` 为核心事实来源。
- 模块库的结构构成：覆盖 `specifications/ModuleLibrary` 以及后端运行时使用的 `src/backend/resources/modules`。
- 现有解析与生成过程：覆盖上传导入、前端初始化、后端编译导出、protobuf 编码/解码、模块拆分/回填等链路。

必须持续遵守的约束：

- 不允许通过猜测、创造、假想的方式生成参数、描述信息、内容等信息。
- 所有字段来源必须可追溯到参考模型、模块库、用户输入、协议 schema 或明确的系统配置。
- 如果缺少事实来源，应输出诊断、阻断或降级为“未知”，不能静默补造业务含义。

## 2. 参考 CModel 构成分析

### 2.1 文件层级

参考 `cmodel` 解包后主要由以下文件构成：

- `ModelFileDesc.json`：模型包元信息。
- `CompDesc.model` / `CompDesc.json`：组件树、模块属性、连接关系、接口、私有参数等核心结构。
- `AbiSet.model` / `AbiSet.json`：能力集合。
- `FuncDesc.model` / `FuncDesc.json`：功能定义。

当前后端以 protobuf schema 将 `.model` 反解析为 JSON，再进行拆分、编辑和重新编码。

### 2.2 CompDesc 总体结构

参考模型统计结果：

- 分组数量：17
- 组件数量：22
- 最大分组深度：1
- 根分组直接子分组：16
- 组件分布：全部位于一级分组下
- 缺失 UUID 组件：0
- 未识别主类型组件：0

这说明参考模型虽然业务上包含较完整的 AMR 构成，但结构深度并不复杂，重点复杂度集中在组件字段、接口和参数语义，而不是树层级本身。

### 2.3 主类型分布

参考模型中的 `mainType` 分布：

| 主类型 | 数量 | 说明 |
| --- | ---: | --- |
| `chassis` | 1 | 底盘主体 |
| `driveWheel` | 2 | 左右差速轮 |
| `driver` | 4 | 电机与驱动器相关模块 |
| `mainCPU` | 1 | 主控板 |
| `sensor` | 6 | 激光、陀螺仪、视觉等传感器 |
| `extendedlnterface` | 1 | IO 扩展模块 |
| `battery` | 1 | 电池 |
| `button` | 4 | 急停、启动、复位等交互按钮 |
| `light` | 1 | 灯 |
| `audio` | 1 | 扬声器 |

观察结论：

- `sensor`、`driver`、`button` 是数量较多的模块类别，是后续模板和参数校验的重点。
- 参考模型包含主控、底盘、动力、传感、能源、交互等完整子系统，适合作为黄金样例之一。
- 当前模型未覆盖所有模块库类型，因此不能仅凭该模型推断完整类型规则。

### 2.4 子系统分布

参考模型中的 `subSystem` 分布：

| 子系统 | 数量 |
| --- | ---: |
| `ChassisSys` | 3 |
| `DriverSys` | 4 |
| `ControlSys` | 2 |
| `SensorSys` | 5 |
| `EnergySys` | 1 |
| `InteractiveSys` | 6 |
| `UnclassifiedSys` | 1 |

观察结论：

- 子系统与主类型之间存在稳定映射关系，但不是所有类型都能只靠名称推断。
- 现有代码中仍有基于名称的类别判断逻辑，这与“不得猜测生成信息”的约束存在冲突，应逐步替换为模块库注册表查询。

### 2.5 接口分布

参考模型接口类型统计：

| 接口类型 | 数量 |
| --- | ---: |
| `ENCR` | 4 |
| `LINE` | 4 |
| `PI` | 9 |
| `PO` | 10 |
| `CAN` | 8 |
| `UART` | 4 |
| `RS232` | 4 |
| `DI` | 23 |
| `AI` | 4 |
| `RS485` | 4 |
| `SPI` | 1 |
| `ETH` | 6 |
| `USB` | 2 |
| `SPK` | 2 |
| `SMA` | 2 |
| `LVDS` | 3 |
| `DO` | 15 |

观察结论：

- `DI`、`DO`、`PI`、`PO`、`CAN` 是高频接口类型，应优先建立结构化校验。
- `SPI` 虽数量少，但在陀螺仪场景中承载主控板载连接，不能按低频字段忽略。
- 接口参数不仅是连接边，还包含协议、速度、标签等配置，应作为一等数据处理。

### 2.6 能力与功能文件

参考模型能力与功能统计：

- `AbiSet.componentAbility`：2
- `AbiSet.functionAbility`：5
- `FuncDesc.function`：5

观察结论：

- `CompDesc` 是当前重构的主战场，但 `AbiSet` 与 `FuncDesc` 不能作为附属空文件处理。
- 编译导出时如果功能文件为空或仅被透传，应输出明确诊断，避免用户误以为功能能力已经被完整重建。

## 3. 模块库构成分析

### 3.1 specifications/ModuleLibrary 文件构成

`specifications/ModuleLibrary` 当前统计：

- 总文件数：245
- JSON 文件：221
- XML 文件：4
- 图片资源：PNG 8、SVG 4、JPG 6
- Lua 文件：2

主要目录：

| 目录 | 数量 | 作用判断 |
| --- | ---: | --- |
| `Aggregated` | 4 | 聚合 XML，包含板卡、接口、模块配置、私有属性等事实源 |
| `ModuleAttrTem` | 146 | 模块属性模板 |
| `ModuleConfig` | 32 | 模块配置 |
| `OnboardModule` | 2 | 板载模块 |
| `board_desc` | 43 | 板卡描述 |
| `AmrModelTem` | 6 | AMR 模型模板 |
| `PictureRes` | 10 | 图片资源 |

### 3.2 聚合 XML 构成

聚合 XML 是非常重要的事实源：

| 文件 | 根节点 | 子节点数 | 主要内容 |
| --- | --- | ---: | --- |
| `BoardDescriptions.xml` | `BoardDescriptions` | 2 | 板卡、CAN、MCU、DI/DO、编码器等映射 |
| `InterfaceSpecs.xml` | `InterfaceSpecs` | 2 | 接口定义、参数数组、组合类型 |
| `ModuleConfigs.xml` | `ModuleConfigs` | 32 | 主类型、子类型、设备型号、颜色、可包含模块类型 |
| `PrivateAttributes.xml` | `PrivateAttributes` | 77 | 模块私有属性、属性组、枚举/组合类型 |

观察结论：

- 当前模块库事实源并不是单一 JSON 文件，而是“模块模板 + 配置 XML + 板卡 XML + 接口 XML + 私有属性 XML”的组合。
- 后端运行时目前主要依赖 `src/backend/resources/modules`，并没有完整索引 `specifications/ModuleLibrary/Aggregated`。
- 后续应建立统一模块库注册表，将 XML 和 JSON 统一解析为可查询结构，避免业务逻辑散落在 Python 映射表和硬编码 fallback 中。

### 3.3 后端运行时模块模板

`src/backend/resources/modules` 当前统计：

- 模块模板数：143

主类型分布：

| 主类型 | 数量 |
| --- | ---: |
| `sensor` | 40 |
| `driver` | 20 |
| `driveWheel` | 12 |
| `actor` | 8 |
| `communication` | 7 |
| `extendedlnterface` | 7 |
| `sensorProcessor` | 6 |
| `battery` | 5 |
| `intergratedController` | 5 |
| `chassis` | 5 |
| `screen` | 5 |
| `audio` | 4 |
| `button` | 4 |
| `light` | 4 |
| `mainCPU` | 4 |
| `energyController` | 3 |
| `autobody` | 2 |
| `handOperator` | 1 |
| 空值 | 1 |

子系统分布：

| 子系统 | 数量 |
| --- | ---: |
| `SensorSys` | 40 |
| `ControlSys` | 25 |
| `DriverSys` | 24 |
| `InteractiveSys` | 18 |
| `ChassisSys` | 13 |
| `ActorSys` | 8 |
| `CommunicateSys` | 7 |
| `EnergySys` | 5 |
| `AutobodySys` | 2 |
| 空值 | 1 |

观察结论：

- 运行时模板数量少于 `ModuleAttrTem`，需要明确二者差异：哪些模板被迁移到运行时，哪些仍只存在于规格库。
- 存在空主类型/空子系统模板，后续应进入诊断清单，不能在导出时静默归入某个默认类型。
- `sensor`、`driver`、`driveWheel` 等高频类型与参考模型高度重合，适合先建立 golden fixture 回归。

## 4. 现有解析与生成链路分析

### 4.1 上传导入链路

当前链路：

```text
.cmodel
  -> unzip
  -> CompDesc.model / AbiSet.model / FuncDesc.model
  -> protobuf Decode
  -> JSON
  -> model_splitter 拆分模块
  -> saved_projects/{projectId}
```

关键实现：

- `src/backend/skills_v2/cmodel_decoder/decoder.py`
- `src/backend/skills_v2/model_splitter/splitter.py`
- `src/backend/app/services/upload_service.py`

优点：

- 使用 protobuf schema 反解析 `.model`，不是文本猜测。
- `CompDesc`、`AbiSet`、`FuncDesc` 均可输出 JSON，便于审计。
- splitter 已兼容 `moduleComponets` 与 `module_componets`。

问题与优化点：

- 上传导入路径尚未像初始化/编译路径一样完整保留 debug artifacts。
- splitter 文件名依赖模块名与 UUID，遇到非法字符、重名、缺 UUID 时风险较高。
- 反解析只得到最终 JSON，缺少“字段来源、未知字段、丢弃字段、规范化差异”的结构化报告。
- 目前无法快速回答“导入前后是否语义等价”，需要增加 roundtrip diff。

### 4.2 前端初始化链路

当前链路：

```text
frontend config
  -> frontend_to_comp_desc
  -> sanitize/strip wrappers
  -> split modules
  -> saved_projects/{projectId}
  -> debug_artifacts/init_{timestamp}
```

关键实现：

- `src/backend/app/services/project_service.py`
- `src/backend/core/cmodel_export_adapter.py`
- `src/backend/core/cmodel_component_mapper.py`
- `src/backend/core/module_group_builder.py`
- `src/backend/core/component_general_attrs.py`
- `src/backend/core/component_payload_builders.py`

优点：

- 初始化路径已经保留前端输入、诊断、中间 `CompDesc`、拆分结果等产物。
- 组件树构建、字段映射、payload 构造已被模块化，后续可逐步替换内部策略。

问题与优化点：

- `normalize_component_category` 仍存在基于名称的启发式判断，例如 IO、BOARD、INTERFACE 等，这会产生“看起来合理但没有事实来源”的风险。
- `build_component_general_attr` 仍存在硬编码 fallback，例如版本、形状、未知类型映射等，应改为模板注册表查找失败后输出诊断。
- `component_payload_builders` 会根据简化前端结构构造通用参数和接口，适合 UI 原型，但不适合作为最终协议事实源。
- `module_group_builder` 会构建嵌套树，但编码阶段又会标准化/拉平系统树，两个阶段语义不完全一致。

### 4.3 编译导出链路

当前链路：

```text
saved project blueprint + modules
  -> resolve_with_fidelity
  -> diagnostics/audit/module_list
  -> sanitize_values
  -> proto_final_sync
  -> standardize_sys_tree
  -> ParseDict
  -> CompDesc.model / AbiSet.model / FuncDesc.model
  -> packed .cmodel
  -> debug_artifacts/compile_{timestamp}
```

关键实现：

- `src/backend/app/services/compile_service.py`
- `src/backend/skills_v2/cmodel_encoder/encoder.py`
- `src/backend/app/services/debug_artifacts.py`

优点：

- 编译路径已保留后端中间数据和最终成果物。
- `proto_final_sync` 已修复 camelCase/snake_case 碰撞覆盖问题，避免 `generalAttr` 被空 `general_attr` 覆盖。
- 编译结果包含诊断和 audit 数据，便于脱离前端排查。

问题与优化点：

- `ParseDict(ignore_unknown_fields=True)` 会忽略未知字段，容易掩盖字段丢失，需要在调用前增加 unknown-field 检测报告。
- `standardize_sys_tree` 会改变树结构，应明确这是协议要求还是当前兼容策略，并建立结构变化报告。
- `FuncDesc.model` 的空文件保留策略容易掩盖功能构建缺失，应输出“透传/空生成/完整生成”的状态。
- 编译前后缺少固定 golden fixture 的自动 diff，包括 JSON 结构、模块数量、接口数量、关键字段完整性等。

## 5. 核心风险清单

### P0 风险

- 上传导入路径缺少完整 debug artifacts，导致问题只能从最终项目目录反推。
- protobuf 编码前允许 unknown fields 被静默忽略。
- 模块拆分在缺 UUID、重名、非法文件名情况下缺少强校验。
- 部分字段仍由硬编码 fallback 或名称启发式生成，与“不允许猜测创造信息”的约束冲突。

### P1 风险

- 模块库事实源未统一索引，`specifications/ModuleLibrary` 与 `src/backend/resources/modules` 之间缺少差异报告。
- 组件类型、子系统、接口、私有属性映射散落在多个 Python 模块中，后续维护容易漂移。
- 参考模型覆盖面有限，当前测试尚不能证明所有模块类型可正确 roundtrip。

### P2 风险

- `CompDesc`、`AbiSet`、`FuncDesc` 的关系尚未完全建模。
- 前端简化模型与 cmodel 协议模型之间缺少显式中间语义模型。
- 当前诊断更多面向开发者，尚未形成前端可消费的用户级错误分层。

## 6. 优化建议与执行计划

### 6.1 P0：先堵住数据丢失与不可追溯问题

建议优先执行：

- 为上传导入路径增加 debug artifacts，保留原始包、解码 JSON、拆分结果、诊断与导入摘要。
- 在 protobuf `ParseDict` 前增加 schema-aware unknown-field detector，输出会被丢弃的字段路径。
- 加固 splitter：文件名安全化、UUID 缺失阻断、同名冲突检测、模块引用表输出。
- 将名称启发式分类改为诊断：没有模块库事实源时不再自动推断业务类型。

预期收益：

- 导入、初始化、编译三条路径都有完整产物链。
- 字段丢失从“事后发现”变成“编码前可见”。
- 与用户新增约束保持一致，不再默默创造参数或描述。

### 6.2 P1：建立模块库注册表

建议执行：

- 新增 `ModuleLibraryRegistry`，统一读取 `Aggregated` XML 与运行时 JSON 模板。
- 生成模块库索引报告：主类型、子类型、私有属性组、接口规格、板卡描述、缺失/冲突项。
- 把 `module_mappings.py`、`component_general_attrs.py` 中的静态映射逐步迁移为注册表查询。
- 增加 `specifications/ModuleLibrary` 与 `src/backend/resources/modules` 的 parity test。

预期收益：

- 字段和类型来源可追溯。
- 新模块类型不需要继续扩大硬编码映射表。
- 可以明确区分“模块库没有定义”和“代码没有支持”。

### 6.3 P2：建立 golden roundtrip 验证

建议执行：

- 以 `校验模型.cmodel` 建立 golden fixture。
- 自动执行 `decode -> split -> encode -> decode -> diff`。
- diff 指标至少包括组件数量、UUID、主类型、子类型、子系统、接口数量、接口参数、私有属性、能力/功能数量。
- 对允许变化和禁止变化建立白名单。

预期收益：

- 后续重构不再依赖人工打开前端确认。
- 能精确发现“模型能打开但语义丢失”的问题。

### 6.4 P3：前后端诊断联动

建议执行：

- 后端诊断分级为 `error`、`warning`、`info`、`trace`。
- 前端展示 artifact 链接、字段来源、阻断原因。
- 对“缺少事实源”的字段提供用户补录入口，而不是后端猜测补齐。

预期收益：

- 用户可以直接定位模型为什么不能导出或为什么字段为空。
- 后端保持事实严谨，前端承接交互补全。

## 7. 下一步建议

建议下一轮直接进入 P0 实施：

1. 为上传导入路径补齐 debug artifacts。
2. 增加 protobuf 编码前 unknown-field 检测。
3. 加固 model splitter 的 UUID、文件名、冲突校验。
4. 输出一份新的验证报告，包含单元测试和一次参考模型 roundtrip 验证结果。

这四项完成后，后端的“可追溯性”和“禁止猜测生成”约束会明显增强，也能为模块库注册表重构打下更干净的基础。

## 8. 交叉模型补充

基于新增 `ModelSet.cmodel` 与 `20260612.cmodel` 的交叉分析，已补充独立报告：

- `docs/CROSS_CMODEL_GAP_ANALYSIS_20260612.md`
- `docs/FRONTEND_ELECTRICAL_ABILITY_REDESIGN_20260612.md`

新增查漏补缺结论：

- 单一 `校验模型.cmodel` 不能覆盖完整模块类型空间。
- 新增主类型覆盖：`screen`。
- 新增接口类型覆盖：`BAT`。
- 新增复杂场景：舵轮底盘、门架/升降、旋转机构、油泵/继电器、绝对值/拉绳编码器、智能相机。
- `moduleDscType.typeKey` 与 `venderName.typeKey` 存在原始空值，后端不得用字段描述、模块名或启发式规则猜测填充。
- `linkedInterfaceUuid` 连接完整性应进入 golden fixture 的固定回归断言。
- 前端当前缺少电气连接实体与 `FuncDesc` 功能过程语义层，应按前端重构方案拆出接口矩阵、连接拓扑、能力与功能过程设计。
