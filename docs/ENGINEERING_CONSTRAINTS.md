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
