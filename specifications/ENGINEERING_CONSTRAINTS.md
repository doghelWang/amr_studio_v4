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
