# AMR Studio V4 全链路协议开发约束规范 (GEMINI_RULES)

> **重要提示**：在执行任何代码修改（特别是涉及数据结构、API 响应、或编解码环节）之前，必须对照检查此规则。

## 1. 数据交换协议 (JSON Convention)
- **标准：官方 CamelCase (驼峰)**。
- **双重键名保护 (Dual-Key Strategy)**：
  - 后端合并逻辑必须同时支持 SnakeCase 和 CamelCase。
  - **能力集字段特化 (Ability Schema Exceptions)**：
    - **COMBOX 选项**: 在 `AbiSet` 协议语境下，下拉框项的子属性数组必须映射为 **`arrayAttr`**，而非组件语境下的 `arrayCmobEle`。
- **最后一百米归一化 (Last-Mile Normalization)**：
  - **Encoder (后端)**: 在调用 `ParseDict` 序列化之前，必须执行 `proto_final_sync`。该函数强制将所有下划线键名转为 Proto 定义的原始驼峰名，防止数据被 `ParseDict` 静默丢弃。

## 2. 无损闭环保护 (Data Fidelity)
- **约束**：
  - **元数据保留**：前端 Store 必须完整保存 `componentAbility`、`version` 等非 UI 编辑字段。导出时必须原样回填。
  - **默认值保护**：严禁在往返过程中过滤掉值为 `0`, `false` 或 `""` 的字段。

## 3. 状态同步策略 (Sync Strategy)
- **约束**：
  - **分支覆盖而非原子替换**：修改深层嵌套属性（如电机减速比）时，前端应发送完整的父分支（如整个 `private_attr`），后端执行 `deep_update`。
  - **智能合并 (Backend)**：后端 `deep_update` 在处理列表（Array）时，必须基于 `key` 或 `type` 字段进行匹配合并，严禁直接覆盖整个数组。

## 4. 后端性能与安全 (Backend Integrity)
- **约束**：
  - **并发安全**：所有涉及 `encoder.py` (CPU 密集型序列化) 的 API 必须定义为同步 `def`，利用 FastAPI 线程池处理，严禁使用 `async def` 阻塞事件循环。
  - **递归安全**：`resolve_refs` 逻辑必须包含 `visited` 集合检查，防止循环引用导致死循环。
  - **物理隔离**：每个项目必须在 `saved_projects/{projectId}` 下拥有独立的 `modules/` 文件夹及 `.bak` 备份。

## 5. 调试与审计 (Auditing)
- **约束**：
  - **字节级审计**：每次导出必须返回 `audit` 日志，并在控制台展示 `STEP2_COMPDESC_SERIALIZED` 等精确字节数。
  - **变动监测**：后端 `deep_update` 必须打印 `DISK_CHANGE` 日志；构建前必须执行 `deep_diff` 审计。

## 6. 环境约束 (Environment)
- **服务端口**：**8002** (GROUND TRUTH)。
- **前端地址**：**3001**。

## 7. 前端交互设计原则 (UI/UX Principles)
- **数据格式冻结 (Data Format Freeze)**：前端界面的任何优化、重构或交互增强，**严禁改变**前后端既有的数据交换格式（JSON Schema）。
- **解析无损性 (Parsing Integrity)**：UI 组件的逻辑调整不得影响 `ImportService` 和 `ExportService` 的运行，确保 100% 的数据解析兼容性。
- **Schema 驱动渲染 (Schema-Driven Rendering)**：严禁在 React 组件中“硬编码”物理组件的私有属性表（Private Attributes）。所有的具体配置项（包含参数边界、默认值、单位等）**必须**由 `SchemaEngine.ts` 从统一的 `ModuleLibrary` JSON 按需加载，以保证 Single Source of Truth，防范升级时的字段遗漏。
- **工程约束外接 (Constraint Injection)**：遇到特定型号产品不遵循基础 Schema 的互斥规则（如下拉菜单枚举值条件隐藏、特定关联字段禁止修改），仅充许以拦截器形式在 `SchemaEngine.ts` -> `ENGINEERING_CONSTRAINTS` 中挂载，严禁污染 `ComponentPropertyPanel` 的通用遍历逻辑。
- **参数闭环防呆 (Parameter Synchronization)**：同种组件内部的多路复用（如左侧伺服电机和右侧伺服电机型号一样），必须强制触发跨实体联动同步 (`syncAttributeToSiblings`) 避免出现双侧动力参数人为配置不一的安全隐患。

## 8. 文档维护与语言规范 (Documentation & I18n)
- **UTF-8 编码强制约束 (Encoding Registry)**：**所有** `.md` 文档及配置文件必须以 **UTF-8 (无 BOM)** 格式保存。严禁使用 GBK, UTF-16 或 Latin-1 编码，以确保 GitHub Actions (Jekyll) 构建预览不发生 `invalid byte sequence` 错误。
- **同步更新硬性约束 (README Hard-Blocking Sync)**：
  - 触发条件：任何涉及 **代码框架变更**、**部署流程优化** 或 **接口协议更迭** 的修改。
  - 执行要求：必须在同一提交 (Commit) 或 任务闭环前，完成 `README.md` 的同步更新。严禁在部署方式变更后留下过时的操作指南。
- **个人信息脱敏 (Privacy Protection)**：**严禁**在 `README.md` 或任何公开文档中展示用户姓名、敏感联系方式或私有路径。所有贡献者标识应使用职能名或团队匿名。

## 9. 领域工程模型约束 (Domain Constraints)
从模块硬件设计属性推导出的强制性前端拦截规则。这些约束跨越了基础 JSON 描述，属于行业经验级固化逻辑，通过 `ENGINEERING_CONSTRAINTS` 进行注入：
- **电机组件 (PMSMMotor)**：伺服电机（PMSM）严禁无编码器作业，系统**必须屏蔽** `ENCODER_NULL` 枚举项，并强制默认选中增量式或绝对式。
- **差速舵轮组 (diffSteerWheel)**：对于差速舵轮的转向反馈（AngleSensor），工程上只采用“绝对值外置”结构，系统**必须屏蔽** `GROUP_CALI_INC_EXTERNAL` 选项以防配错。
- **驱动器 (subDriver)**：`softwareSpec`（软件版本）输入框**仅限**在驱动类型 `type` 被选中为自研驱动器 (`MOTOR_SERVO_TYPE_HIK`) 时可见，其它型号一律隐藏且置为默认值。
- **编码器节点独立性原则**：
  - 电机自身的 `ENCType`（如增量编码器的线数）属于自身内部描述。
  - 只有由于外部测量结构所需的（如轮组外置绝对值传感器），才应用 `DATA_FIXED_E` 作为 `relateEncode` 引用独立的 `SENSOR` 硬件节点，严禁将内部描述错认为是外部对象引用。

## 10. 拓扑级联推导规则 (Topology Auto-Derivation)
为了保障生成树具备完整的机械与电气一致性，用户新建任意级根节点组件时，必须依据以下法则触发**雪崩式的子组件衍生与引用绑定**：
- `diffWheel` (差速轮)：自动下挂生成 1 个 `PMSMMotor` 节点并绑定至 `relateMotor`。
- `horizontalSteerWheel` / `verticalSteerWheel` (常规舵轮)：自动下挂生成 2 个 `PMSMMotor` 节点，分别绑定至 `relateWalkMotor` 与 `relateRotMotor`。
- `diffSteerWheel` (差速舵轮)：自动下挂生成 2 个 `PMSMMotor` 节点（左/右独立驱动），并外置生成 1 个 `absoluteValueEncode` (编码器) 挂载至转向反馈 `relateEncode` 链路中。
- **UI 引用呈现规则**：凡 JSON Schema 类型为 `DATA_FIXED_E` 的字段，**强制渲染为关联节点 UUID 选择器**（基于 `fixedSource` 元数据反解 Category 过滤可关联集合）。

## 11. 电气接线与 IO 信号逻辑约束 (Electrical Wiring & IO Logic)
- **总线主从体系 (Bus Master-Slave)**：所有通信总线（CAN/ETH/RS485）必须以 `MAINCPU` 或其扩展 Host 为根节点。从站设备仅允许单向挂载至 Host 端口。
- **IO 信号反转匹配原则 (Inverted Signal Logic)**：为了符合物理接线常识，IO 端口的连接必须遵循“输出连输入”原则：
    - **主板 DI (Digital Input)**：仅允许连接至交互设备的 **DO (Digital Output)** 类型端口（如按钮的信号输出端）。
    - **主板 DO (Digital Output)**：仅允许连接至交互设备的 **DI (Digital Input)** 类型端口（如指示灯的使能输入端）。
- **级联拓扑感知**：在总线拓扑视图中，若从站设备（如 IO 扩展板）下挂了次级设备（如按钮），必须通过级联方式在总线节点下方展示其子连接状态，确保全链路透明。

## 12. 物理清除与数据安全规范 (Cleanup & Safety)
- **验证前保留原则**：在执行任何文件移动、重构或目录清理动作时，旧文件/原始文件必须物理保留，直至新成果物通过 `AMR-CModel-Deep-Auditor` 的完整验证。
- **人工确认机制 (Human-in-the-loop)**：所有涉及到 `rm` 指令的物理删除操作，必须在向用户呈报验证结果并获得明确的“人工确认”后方可执行。严禁任何形式的静默删除或自动化清理非临时目录。

## 13. 模块字段禁止硬编码 (No Hardcoded Module Fields)
- **核心原则**：在任何后端代码（Encoder、ResourceAdapter、Splitter）中，**严禁**硬编码模块的具体字段名称、类型标识、子系统名称或模板文件名。因为前端可能涉及多种不同类型的模块，其各自字段存在差异。
- **模板驱动 (Template-Driven)**：所有模块的 `generalAttr`（如 `moduleDesc`, `venderName`, `moduleShape` 等）、`interfaceAttrs`、`interfaceAbility` 必须从 `resources/modules/*.json` 的模块库模板动态加载，**不得**在代码中写死任何特定模块的属性结构。
- **类别映射外置 (Category Map Externalization)**：如 `CATEGORY_TO_TYPE_KEY`、`CATEGORY_TO_SUBSYS` 等映射表，应从模块库元数据自动生成或放入可配置的外部文件，不得内联于 `.py` 源代码中。
- **名称启发式禁令**：严禁基于模块名称子串（如 `"mcpu" in name`、`"bat" in name`）做类型推断。类型信息必须来自 `generalAttr.mainModuleType.comboType.typeKey` 或模板元数据。
- **特定模块名禁令**：严禁在编码逻辑中硬编码 `G_MainController`、`chassis_diff` 等特定模块标识。这些标识应由模板或前端数据驱动。

## 14. 模块嵌套语义规范 (Module Nesting Semantics)
- **Proto 定义**：`Message_Module_Info` 是自递归结构 (`repeated Message_Module_Info more_module_info = 5`)，即 `moreModuleInfo` 是每个模块组的根节点。
- **嵌套合法性**：协议层面同时支持**扁平结构**（所有模块并列放在根节点下）和**嵌套结构**（模块包含子模块，如：轮组→驱动→电机 组成由轮组作为根节点的嵌套式模块组合）。两种均为合法 Proto 序列化。
- **前端拓扑对应**：前端使用 `parentNodeUuid` 描述父子关系并构建树形视图时，后端序列化必须将该拓扑关系正确映射到 `moreModuleInfo` 的嵌套层级中。
- **模块组完整性**：每个 `moreModuleInfo` 节点必须包含：
  - `moduleGroupName` (Tag 1): 模块组名称
  - `moduleGroupUuid` (Tag 2): 实例唯一ID
  - `moduleComponets` (Tag 4): 该组的组件列表
  - `moreModuleInfo` (Tag 5): 子模块组（可递归嵌套）

## 15. 后端默认值填充规范 (Backend Default-Value Filling)
- **设计背景**：当前前端交互设计的输入信息和字段是不足的（仅提供 `moduleName`, `moduleUuid`, `privateAttrs`, `mountX/Y/Z` 等少量字段）。
- **核心规则**：后端在编码/序列化时，**必须**采用模块库模板 (`resources/modules/*.json`) 的默认值填充所有前端未提供的字段。
- **前端值优先 (Frontend-First)**：已由前端提供的字段值不会被模板覆盖。当前端后续新增某字段的输入能力后，只需传值即可自动生效，后端无需代码改动。
- **实现位置**：`encoder.py:enrich_from_templates()` — 在编码前遍历模块树，对每个组件加载匹配的模板并执行缺失字段补齐。
- **逐步放开策略**：后续前端要求补充输入字段时，需记录"从模板默认 → 前端提供"的切换日志，确保可追溯。

## 16. 私有属性存储位置规范 (Private Attributes Location)
- **核心规则**：**所有**模块类型（包括底盘 chassis）的私有属性 (`privateAttrs`) **必须**存储在 Proto Tag 2 (`privateAttr.privateAttrs`) 中，以 `Message_Base_Group_Element` 分组结构保存。
- **禁止事项**：**严禁**将 privateAttrs 扁平化后移入 `structParam.extendParams`（Tag 5）。`extendParams` 仅用于安装坐标 (`locCoordX/Y/Z/ROLL/PITCH/YAW`) 和 `parentNodeUuid`。
- **分组保留**：私有属性的分组结构 (`motionCenterAttr`, `chassisAttr`, `wheelsAttr` 等 groupKey) 是客户端渲染分区表单的依据，破坏分组等同于破坏 UI。
- **历史教训**：2026-03-31 发现 `resource_adapter.py` 的 `is_chassis` 分支将底盘 privateAttrs 错误地移入 extendParams，导致客户端无法显示底盘参数（3组/33属性全部丢失）。

## 17. 子系统类型有效值约束 (SubSystem Type Validation)
- **有效值集合** (基于 2026-04-02 客户端调整版验证)：subSysType.comboType.typeKey 仅允许使用以下标准值：
  - `ChassisSys` (底盘系统/驱动轮), `UnclassifiedSys` (未分类 — 所有独立模块的默认值), `ControlSys` (控制系统 — 仅用于组合模块的 moduleSys), `DriverSys` (驱动系统), `SensorSys` (传感器系统), `InteractiveSys` (交互系统), `EnergySys` (能源系统), `Other`
- **⛔ 独立模块子系统规则 (2026-04-02 客户端确认)**：除 `chassis`（ChassisSys）和 `driveWheel`（ChassisSys）外，所有独立模块的 `subSysType` **必须统一设为 `UnclassifiedSys`**。后端**严禁**自行推断子系统分类（如将 battery 归为 PowerSys、sensor 归为 SensorSys）。
- **⚠️ moduleSys 填充规则 (2026-04-02 修订)**: `moduleSys` (Tag 3) **仅允许**在 `G_MainController` 等组合模块上保留。所有其他模块组的 `moduleSys` **必须为空字符串**。
- **⚠️ 已废弃值**: `PowerSys`、`SafetySys`、`MotionSys` 在客户端标准中均**无实例**，**严禁使用**。
- **校验位置**：`resource_adapter.py:CATEGORY_TO_SUBSYS` 映射表 + `encoder.py:standardize_sys_tree()` 扁平化后处理。

---

## 18. 模块库规格规范 (Module Library Specification - XML Aggregated)
自 2026-04-01 起，为了提升扫描性能与数据一致性，硬件模块与接口的“事实来源”从离散 JSON 迁移至聚合 XML 体系。

### 18.1 聚合 XML 体系结构 (Source of Truth)
所有的编解码逻辑（Encoder, ResourceAdapter）必须优先从以下路径读取规格数据：
- `specifications/ModuleLibrary/Aggregated/PrivateAttributes.xml` (77 个叶子模块)
- `specifications/ModuleLibrary/Aggregated/InterfaceSpecs.xml` (34 个接口类型)
- `specifications/ModuleLibrary/Aggregated/ModuleConfigs.xml` (全量约束规则)
- `specifications/ModuleLibrary/Aggregated/BoardDescriptions.xml` (主板规格)

### 18.2 标准硬件大类 (18 Hardware Groups)
系统定义的顶级分类，凡不属于以下分类的模块必须在 `ModuleConfigs.xml` 中明确定义父子关系：
- `chassis` (底盘), `driveWheel` (驱动轮), `autobody` (车身), `actor` (执行器), `driver` (驱动控制器), `mainCPU` (主控制器), `intergratedController` (集成控制器), `energyController` (能源控制器), `sensorProcessor` (传感器处理器), `extendedlnterface` (接口扩展模块), `sensor` (传感器), `communication` (通信模块), `battery` (电池模块), `light` (灯光), `button` (按钮), `audio` (声音), `screen` (显示屏), `handOperator` (手操器)。

### 18.3 标准接口分类 (34 Interface Types)
所有的 `interfaceParams` 构建必须遵循以下四类划分：
- **CommInterface (通信)**：CAN, ETH, HDMI, LIN, LVDS, PWM, RS232, RS422, RS485, SPI, UART, USB
- **FuncInterface (功能)**：BAR, BAT, ENCR, GRAV, LINE, PZTB, SMA, SPK
- **InOutputInterface (IO)**：AI, AO, DI, DO, PI, PO 以及 sub-variant (DI/DI0~3, DO/DO0~3)
- **PowerInterface (电源)**：PI, PO

### 18.4 XML 兼容性约束 (Tag Naming Rules)
- **数字起始 Key 处理**：由于 XML 标签名严禁以数字开头，对于原始 JSON 键名为数字（如 `3DLaser`）的情况，聚合 XML 必须使用 `<Entry key="3DLaser">` 结构。解析器必须能正确反解 `_original_key` 属性。
- **Lua 脚本集成**：Lua 约束脚本以 `<Script file="...">` 节点保存，解析器加载时应保留其原始文本格式，严禁修改脚本逻辑。

### 18.5 变更保护
- **禁止静默修改**：严禁在未运行 `aggregate_specs.py` 的情况下手动修改 XML 聚合文件。
- **强制回归校验**：任何 XML 聚合逻辑的变动，必须通过 `verify_aggregation.py` 对比原始离散 JSON，确保 100% 数据保真。

---

## 19. 接口属性数据格式约束 (Interface Attribute Format — CR-01)
- **Proto 定义依据**: `Message_Interface_Attribute` 包含 `repeated Message_Base_Element interface_params_array = 1`。
- **正确格式 (必须遵循)**:
  ```json
  "interfaceAttrs": {
      "interfaceParamsArray": [
          { "key": "VIN", "type": "DATA_DOUBLE", "unit": "V", ... },
          { "key": "IMAX", "type": "DATA_DOUBLE", "unit": "A", ... }
      ]
  }
  ```
- **禁止格式**: 严禁以 key 为索引的扁平 dict（如 `{ "VIN": {...}, "IMAX": {...} }`），因为这不符合 `repeated` 数组语义，`ParseDict` 将**静默丢弃**非数组格式的数据。
- **校验标准**: 所有 `interfaceAttrs` 和 `interfaceParams` 的值必须为 `{ "interfaceParamsArray": [...] }` 结构。

## 20. 模块树结构约束 (Module Tree Structure — CR-03)
- **标准基线事实**: ModelSet312 标准文件使用**完全扁平结构**（19 个一级节点，无嵌套）。
- **⛔ 客户端确认 (2026-04-02)**：客户端仅支持**完全扁平模式**。所有模块（包括轮组的子驱动器和电机）必须**全部平铺**在根级 `moreModuleInfo` 下，**禁止嵌套**。
- **实现方式**：`encoder.py:standardize_sys_tree()` 执行递归扁平化 (`collect_all_groups`)，将所有嵌套的 `moreModuleInfo` 子节点提升到根级。
- **parentNodeUuid 编码 (2026-04-02)**：`parentNodeUuid` 使用 `DATA_COMBOX` 类型编码（`comboType.typeKey` 存储 UUID 值），而非 `DATA_STRING`。
- **安全规则**: 扁平化后，`parentNodeUuid` 必须在每个模块的 `structParam.extendParams` 中正确保留以支持反向解析。

## 21. moduleSys 填充规则 (Module System Tag — CR-09)
- **Proto 定义**: `Message_Module_Info.module_sys = 3` (string 字段)。
- **标准基线事实 (ModelSet312)**: 19 个一级节点中，**仅 `G_MainController` 的 `moduleSys="ControlSys"`**，其余 18 个节点 `moduleSys` 全部为空。
- **⛔ 2026-04-02 客户端确认**: 扁平化后，**仅 `G_MainController` 保留 `moduleSys`**，所有其他模块组的 `moduleSys` 必须为空字符串 `""`。
- **实现位置**: `encoder.py:standardize_sys_tree()` — 扁平化后遍历所有 group，仅当 `moduleGroupName == "G_MainController"` 时保留 `moduleSys`，其余一律清空。
- **已修正 (2026-04-02)**: 移除了 `enrich_from_templates()` 中的 `_SUBSYS_FIX` 逻辑和 `apply_module_sys_rule()` 的 `DriverSys` 默认填充。

## 22. 数据框架一致性约束 (Data Framework Integrity)
- **前端类型安全**: 前端 `types.ts` 中定义的 `MainModuleType` 枚举必须与 §18.2 的 18 个硬件大类保持 1:1 映射。当前存在 `IO_BOARD`, `MOTOR`, `VISUAL` 等非标准类型，需清理或注释为别名。
- **ExportService 默认值约束**: `ExportService.ts` 中的 `moduleGroupName` 默认值 `"LibraryGroup"` 无标准依据，应改为使用模块的 `name` 字段。
- **映射表外置要求 (§13 补充)**: `PROTO_TO_SPEC_MAP`、`INTF_TO_SPEC_MAP`、`CATEGORY_TO_TYPE_KEY`、`CATEGORY_TO_SUBSYS` 等映射表虽当前以内联常量形式存在于代码中，但中期目标是从 XML 元数据自动生成或迁移至外部配置文件，消除硬编码依赖。

