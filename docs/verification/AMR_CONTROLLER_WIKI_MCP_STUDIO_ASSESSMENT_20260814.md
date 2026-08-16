# 海康 AMRController Wiki、MCP 网关与 AMR Studio V4 综合梳理

> 分析日期：2026-08-14（Asia/Shanghai）
> 范围：海康机器人控制器 Wiki、`doghelWang/mcp-http-api-gateway`、当前 `amr_studio_v4` 代码与项目约束。
> 结论状态：已核对的事实、工程推断和待确认问题分开记录。

## 1. 执行范围与证据边界

- 海康 Wiki 首页及其内部链接递归遍历：发现 204 个页面，178 个页面成功提取，26 个链接因页面不存在、内部链接写法异常或抓取失败未能取得正文。二次开发 API 页面成功提取，正文约 49.6 KB。
- 首页主目录实际包含：基础知识、组件库、造车指南、AGV 调度、程序下载、程序二开、教学视频、日志分析、FAQ。首页标注 2026-06-11 更新；最新动态中包含 RoboDesigner 与 AMR_CONTROLLER V1.2.1 更新。
- Wiki 的 `7Development-Guide/Base/ApiDocument` 是 Python `SecDevInterface` 设备 SDK 文档，不是通用 HTTP REST API 文档；其目录覆盖 Motor、Action、Move、IO、Dist、Alarm、Status、Lamp、Cam、Energy、Sens、Button、Audio、Reg、Valve、Recognize、BB、CallBack、Secure 等能力。
- GitHub 网关仓库当前 HEAD 是一个 11 个文件、约 2485 行的轻量 Python 项目，包含 FastMCP 网关和 Flask Web Console。仓库 README 将控制器核心服务描述为 `carServer:9020`，但其具体 HTTP 路径和 SDK 调用未在海康 Wiki 中形成可直接互换的标准契约，必须以现场控制器版本与实际服务返回为准。
- 当前 `amr_studio_v4` 的后端是模型设计、导入、编译和项目保存服务；公开路由集中在 `/api/v1/...`，没有控制器 `SecDevInterface` 连接层，也没有 9020 代理层。
- 仓库已有 `docs/feishu_*` 与 `wiki_offline_package`，其内容包含仙工/Seer HTTP API，不是本次海康 Wiki 的同一资料源；不能把其中的 `/setOrder`、`/robotsStatus` 等路径直接套到海康控制器。

## 2. Wiki 内容形成的产品/技术模型

### 2.1 从造车到运行的完整闭环

Wiki 的内容不是单一 API 手册，而是一个“模型构建—设备适配—标定—调度—二开—日志诊断”的闭环：

1. 基础知识定义坐标系、运动中心、轮组、导航和脚本文件等概念。
2. 组件库描述主控、底盘、驱动、电机、激光、相机、编码器、碰撞条、电池、人机交互等硬件及适配型号。
3. 造车指南把组件组合、模型配置、标定、建图和车型 SOP 串成制造流程。
4. AGV 调度覆盖 RCS-Lite、RCS-2000、客制车和第三方接口配置；它是调度系统与控制器之间的业务边界，不等同于设备 SDK。
5. 程序二开以控制器内置 Python 业务脚本为主，通过 `SecDevInterface` 访问底盘、机构、IO、传感器、告警、黑板和回调。
6. 日志分析与 FAQ 负责把控制器、平台、IAS、驱动器、激光、编码器、轮组和 RCS 失联问题闭环到现场诊断。

### 2.2 二开能力的关键语义

- 控制调用大多返回整数错误码，读取接口返回字典、列表或状态码；“返回 0”只能说明接口调用层成功，不能替代动作完成确认。
- `Move API` 明确存在非阻塞调用，例如对接移动；脚本必须通过状态读取、动作状态或回调判断完成/异常，不能把下发成功当成任务成功。
- `Status API` 同时承担运行结果、动作状态、任务取消标志、货架信息和延时；`BB API`/黑板与注册表是脚本间共享或持久化状态的关键机制。
- `Alarm API`、急停信号、第三方告警和任务互锁属于安全边界，不能暴露成无确认、无权限的通用写入接口。
- 二开案例覆盖机构控制、线程/后台服务、变量共享与持久化、脚本告警、HTTP/Modbus TCP、显示屏、灯光、音频、识别对接、VDA5050、任务取消和任务互锁，说明真实集成不只是“发一个移动命令”。

## 3. `mcp-http-api-gateway` 当前实现评估

### 已具备的价值

- FastMCP 网关支持 stdio 和 SSE 两种运行方式，目标地址可由 `target_ip.txt` 或 `TARGET_API_BASE` 动态切换。
- `call_custom_api` 提供通用 HTTP 代理，支持 GET/DELETE 查询参数和 POST/PUT 等 JSON body；网关也有超时、连接错误和非 2xx 文本化返回。
- Flask 控制台提供状态看板、9020 API Playground、脚本查看/保存/上传、SDK 举升/灯光/音频/避障示例、任务与 IO 操作入口。
- `app.py` 在控制器存在 `/devinfo/roboticspy/syspy` 时尝试加载 `dev_api`/`sec_dev`，否则进入 fallback/mock 分支，便于本地演示。

### 关键问题

1. **目标 API 契约不一致**：MCP 网关的固定工具仍是 `/api/v1/users`、`/api/v1/devices`、`/api/v1/orders` 等通用业务示例，与海康 `SecDevInterface` 方法名不对应；只有通用代理能够“可能”转发，无法让模型可靠理解参数、单位、状态机和安全前置条件。
2. **9020 能力主要来自 README/现场约定**：控制台硬编码调用 `/api/getGlobalPose`、`/api/postAddTask`、`/api/getBatteryInfo`、`/api/getRcsInfo`、`/api/getAlarmInfo` 等路径；仓库没有本地 schema、版本矩阵、请求/响应样例或真实控制器回归证据。
3. **模拟成功会制造数据失真**：SDK 不可用时，举升、灯光、音频、避障、状态、IO 和脚本接口仍可返回 `code:0` 或固定数据。README 所称“100% 真实硬件数据”因此不能作为当前实现的已验证结论。
4. **安全面过宽**：`call_custom_api`/9020 Playground 可调用任意路径；脚本上传和保存后可直接落到控制器目录；部署脚本使用 `sshpass`、关闭 SSH host key 检查并通过 `kill -9` 清理进程。当前没有认证、RBAC、CSRF、防重放、审计审批、危险动作二次确认或安全命令白名单。
5. **重启接口名义成功但没有重启**：`/api/script/restart` 只写日志并返回成功，没有实际进程管理、退出码、健康检查或回滚。
6. **输入校验不足**：脚本文件名虽使用 `basename`，但没有大小、语法、依赖、签名、备份和原子替换；配置 API 大量使用默认值和固定示例值，和项目的 NO_HARDCODE、未知值保留原则冲突。
7. **单位和角度存在直接风险**：控制台任务表单以 m/s、rad/s、坐标小数和“度”展示；Wiki SDK 的 `chs_move` 使用 mm、theta 千分之一度，举升使用 mm，转盘使用千分之一度。当前未见统一单位适配层、来源标记和范围验证。

## 4. 与 `amr_studio_v4` 的关系

### 当前已经对齐的部分

- `amr_studio_v4` 的 Proto-first、字段注册表、模块模板、组件/接口/私有属性分层、层级关系保留和 cmodel round-trip 约束，适合承载 Wiki 中“组件库 + 造车模型”这一侧。
- 当前 Proto 明确区分 `Message_Module_General_Attribute`、`Message_Module_Private_Attribute`、接口能力、接口参数、结构参数和嵌套 `more_module_info`；这与 Wiki 的组件/底盘/传感器分层在概念上相容。
- 前端已有底盘、能力、接口矩阵、布线、电源拓扑、组件属性、导入导出和审计界面；后端已有模型编译、cmodel 上传解码、项目保存和能力/功能配置读写。

### 尚未形成的连接

- Studio 生成的是 cmodel/AbiSet/FuncDesc 等模型工件，不是可直接下发给控制器运行的 Python 二开包、RCS 配置包或硬件参数包。
- Studio 的 `/api/v1/models/...` 是本地设计后端，不是控制器 `SecDevInterface` API；当前没有控制器目标注册、版本/车型/固件匹配、在线能力探测、部署包签名、远端备份和回滚。
- Studio 的模型字段与 Wiki 组件页面之间还没有“官方组件 ID/版本/厂家/型号/能力/接口/标定参数”的可追溯映射表。不能仅凭模块名推断 `moduleSys`、控制关系、默认值或适配关系。
- 当前没有把 Wiki 的二开脚本生命周期、任务状态、动作状态、黑板、告警和回调语义建模成 Studio 的校验对象，因此 UI 能配置的模型不等于现场脚本一定能执行。

## 5. 问题分级

### P0：不应直接上线

- 未确认 9020 真实接口契约、控制器版本和 SDK 版本前，禁止把 MCP 通用代理作为可控车生产入口。
- 禁止在真实车辆上使用默认值、mock 成功、随机任务 ID、固定 `STOP`/速度配置或无审批的任意路径调用。
- 脚本上传、覆盖、重启和急停/运动/IO/机构控制必须加入权限、审计、确认和故障回滚。

### P1：集成前必须补齐

- 建立海康版本化适配层：控制器型号/固件/设计软件版本/SDK 版本/能力清单/单位/错误码/返回结构。
- 从 Wiki API 文档和现场 SDK 生成结构化 manifest，明确每个方法的参数、单位、范围、同步/异步语义、完成条件、危险等级和所需模型组件。
- 将 MCP 工具从“任意 HTTP + 通用示例”改成类型化、白名单化工具；保留只读工具和受控写工具的不同权限。
- 将 cmodel 生成与控制器部署分成两个明确阶段：模型校验/编译 → 现场兼容性检查 → 备份 → 部署 → 健康检查 → 回滚。

### P2：工程质量改进

- 清理或隔离仓库中与海康无关的 Seer/Feishu HTTP 文档，避免误用。
- 为真实控制器建立录制回放测试和最小集成测试；所有 mock 结果必须显式标注 `simulated`，不能返回与真实成功等价的状态。
- 补齐日志关联 ID、控制调用前后状态、错误码原文、请求来源和操作人；避免敏感配置进入日志。

## 6. 推荐目标架构

```text
AMR Studio V4
  ├─ 官方组件/Proto/cmodel 模型设计与审计
  ├─ 海康适配 manifest（版本、能力、单位、错误码、风险等级）
  └─ 部署包生成（模型 + 脚本 + 配置 + 签名 + manifest）
           ↓ 兼容性检查 / 备份 / 审批
受控 Controller Connector
  ├─ 只读状态：SecDev SDK / 9020 / 日志
  ├─ 受控动作：Move / Action / IO / Alarm / Task
  ├─ 脚本生命周期：上传、语法检查、备份、原子替换、重启、健康检查
  └─ 审计与回滚
           ↓
海康 AMR Controller + RCS
```

MCP 应位于 Connector 之上，调用的是经过 schema、权限和安全策略包装的工具，不应直接把任意 HTTP body 暴露给模型。Web Console 可以作为人工运维面，但必须复用同一 Connector 和审计链路。

## 7. 下一步可执行清单

- [ ] 从现场控制器导出真实 `/api/getApiList`、固件版本、车型模型、SDK 包版本和接口返回样例。
- [ ] 确认 9020 API 与 Wiki `SecDevInterface` 的关系：是否同一进程、是否只是内部 HTTP 包装、是否存在版本差异。
- [ ] 以 `ApiDocument` 为源建立第一版 `hikrobot_secdev_manifest.json`，先覆盖只读状态、急停、底盘移动、举升、IO、告警和脚本状态。
- [ ] 在 Studio 中增加控制器目标与版本兼容性实体；未经兼容性确认的模型只能导出审计包，不能标记为可部署。
- [ ] 将单位转换、范围校验、动作完成判定和错误码保留纳入 Connector，不放在页面按钮的临时逻辑里。
- [ ] 先实现只读 MCP 工具和仿真回放，再逐步开放低风险写操作；运动、急停、IO、告警清除、脚本部署列为高风险操作。
- [ ] 修复网关 mock/重启/部署脚本问题，并完成真实设备回归记录后，才能宣称“真实硬件可用”。

## 9. 对 `amr_studio_v4` 的深度需求与方案审计

### 9.1 需求基线

| 需求域 | 当前应满足的可验证要求 | 当前证据 | 审计结论 |
| --- | --- | --- | --- |
| 模型完整性 | Proto 字段、oneof、枚举、嵌套层级、引用和未知字段不能静默丢失 | Python encoder 有 descriptor 校验、严格 ParseDict、引用路径检查；65 个 unit tests 通过 | **部分满足**：Worker 有独立 TS 映射，尚无 Python/Worker 字段级自动比对 |
| 组件/接口建模 | 组件、私有属性、接口能力、接口参数、电气/功能/控制关系分层保留 | Proto 与前端已有对应结构 | **部分满足**：尚无海康官方组件 ID/型号/SDK 能力映射 |
| cmodel round-trip | 导入—编辑—编译—再导入必须保持源字段和 manifest 语义 | 已有 Python/Worker round-trip 测试文件与近期 Worker manifest 保留改动 | **需扩大验证**：当前 unit/build 不能证明真实样本全量一致 |
| 版本兼容 | 模型只能在匹配的 RoboDesigner/控制器/固件/SDK 能力上部署 | 当前 API 仅返回 Studio backend version；无 Controller Target/Capability Probe | **缺失，P0/P1** |
| 运行时二开 | 模型能力与脚本调用、动作完成、告警、黑板、回调可验证关联 | Wiki 定义了 SDK 能力；Studio 无对应实体/校验器 | **缺失，P1** |
| 部署运维 | 备份、签名/校验、审批、原子替换、健康检查、回滚、审计 | 当前 Studio 只有下载 cmodel；网关脚本部署为独立 Flask 写文件 | **缺失，P0/P1** |
| 安全 | API、下载、项目、危险动作具备认证、授权、审计和输入边界 | FastAPI CORS 全开放；路由未见认证依赖；下载目录直接挂载 | **不满足，P0** |
| 可观测性 | 每次导入/编译/部署记录来源、版本、原值、单位、验证状态和关联 ID | 有 audit/debug artifacts，但主要是字符串审计；无统一事件模型 | **部分满足** |

### 9.2 代码级审计发现

1. `src/backend/app/api/http.py` 的 CORS 为 `allow_origins=["*"]`，同时允许 credentials、所有方法和所有 headers；`/downloads` 直接挂载保存项目目录。当前没有看到认证/授权层，因此本地开发配置不应直接被视为可部署配置。
2. `initialize_project_sandbox(project_id, ...)`、`compile_project(project_id, ...)` 和保存项目 name 直接参与路径拼接；当前没有统一的 project ID/name 规范化和路径边界断言。应将“项目标识只允许受控字符”与“解析后路径必须位于根目录”设为 HTTP 边界校验，而不是依赖调用方自律。
3. 项目同时保存 `CompDesc.json`、`blueprint_CompDesc.json` 和 `modules/*.json`。编译以 blueprint/ref 展开结果为主，而组件更新写入 module 文件；这形成多个可变副本。必须定义 canonical source，并在每次更新/编译前做 hash、引用完整性和副本一致性审计。
4. Python encoder 在缺失 `AbiSet.json` 时写入空 `AbiSet.model`，在缺失 FuncDesc 和资源模板时写入空 `FuncDesc.model`。这与“禁止部分导出/未知字段必须进入验证报告”的工程约束冲突；应改为明确的 `not_deployable` 结果，除非 Proto/产品规格明确定义该文件可选。
5. `model_splitter.py` 用递增序号生成 `module_000000.json` 等文件名。该做法便于稳定引用，但没有将源模块身份、原始路径、UUID、版本和 hash 作为独立 manifest 保存；跨版本重切分时不应仅凭序号判断模块对应关系。
6. Python 后端、Cloudflare Worker 和前端各自维护 Proto JSON 映射；Worker 还包含独立的字段读取、编码、manifest 合并逻辑。当前 TypeScript 编译成功只证明语法/类型可编译，不能证明三条运行时链路在字段、oneof、默认值、枚举和错误语义上等价。
7. `update_component`/`update_abilities` 接收通用 JSON delta 并深度合并，严格校验主要在后续编译阶段发生。应在写入边界做 schema 校验、字段来源校验和危险字段变更审计，避免非法状态先落盘再在编译时才暴露。
8. 现有 65 个 unit tests、前端 build、backend-ts build 和 Worker tsc 均通过，但没有证明：真实海康控制器连接、真实 SDK 调用、9020 版本兼容、MCP 安全策略、部署回滚、跨运行时字节级等价和真实 cmodel 样本全集覆盖。因此“测试通过”只能证明基础回归，不足以证明整体需求完成。

## 10. 本地/远端 API 与二开内容的契约审计

### 10.1 必须分开的三种接口

| 接口层 | 已确认内容 | 不应做的事情 |
| --- | --- | --- |
| Studio API | `/api/v1/models/...`、`/api/v1/projects/...`，负责设计项目、cmodel、schema 和编译 | 不应冒充控制器设备 API |
| 海康 SecDev SDK | `SecDevInterface` Python 方法；包含 `MoveApi`、`Action/机构`、`Io`、`Alarm`、`Status`、`BB`、`CallBack` 等 | 不应直接按普通 REST body 猜测参数 |
| 网关/控制器 HTTP | GitHub 项目约定 `carServer:9020` 和若干 `/api/...` 路径 | 未取得现场 `/api/getApiList` 与版本样例前，不应视为稳定公共契约 |

### 10.2 需要立即冻结的契约不确定项

- Wiki 文档中 `set_obs_safe_dist` 的签名展示为 `safe_dist_array`，网关实现传入单个 `dist`；必须以现场 SDK 类型签名和控制器行为测试裁定。
- Wiki 示例中机构方法的归属、命名和网关调用存在差异，例如文档展示 `ActionApi` 能力，网关调用 `LiftApi`；必须从实际 `sec_dev` 模块导出类/方法清单，不能依据名称推断。
- `chs_move` 的坐标单位为 mm、角度为千分之一度；网关 UI 使用浮点坐标、m/s、rad/s 和“度”展示。转换必须统一放入 Connector，并在请求和响应中保留原始值、规范值、单位和转换依据。
- `set_task_shield` 会屏蔽平台指令，`set_alarm` 可写告警，`set_io` 可写 IO，`chs_stop`/急停相关调用影响车辆安全；这些接口必须有动作风险等级、前置条件和人工确认，不得通过通用 MCP tool 无条件开放。
- SDK 采用返回码、字典、列表、回调和黑板混合语义；Connector 必须定义统一的 `accepted/running/succeeded/failed/cancelled/unknown` 状态机，禁止把 `return 0` 直接映射成 `succeeded`。

## 11. 优化后的目标方案

### 11.1 领域边界

```text
Studio Domain
  Project / ProtoModel / Component / Interface / Ability / Function
  SourceRef / Validation / Artifact / TargetCompatibility

Controller Connector
  TargetSession / CapabilityProbe / UnitAdapter / SecDevAdapter / Http9020Adapter
  CommandPolicy / ActionLifecycle / AuditEvent / BackupRollback

Access Layer
  Studio REST / Web Console / MCP Tools
```

关键原则：Studio 只负责“可追溯模型和部署候选物”；Connector 负责“现场能力探测、单位转换、动作生命周期和部署事务”；MCP/Web Console 只负责受控调用，不复制业务协议。

### 11.2 统一 manifest 最小字段

每个 API/SDK 能力至少需要记录：

```json
{
  "id": "hikrobot.secdev.move.chs_move",
  "source": "wiki|现场sdk|现场http|人工确认",
  "controller_model": "unknown",
  "firmware_range": "unknown",
  "sdk_version": "unknown",
  "transport": "python_sdk|http_9020",
  "request_schema": "待生成",
  "response_schema": "待生成",
  "units": {},
  "sync_mode": "blocking|non_blocking|callback|unknown",
  "completion_signal": "unknown",
  "risk_level": "read_only|low|medium|high|safety",
  "required_components": [],
  "verification_status": "documented|captured|simulated|hardware_verified|unresolved"
}
```

未确认项必须保持 `unknown/unresolved`，不能用方法名、组件名或默认值补齐。

## 12. 分阶段优化计划与验收门禁

### Phase 0：证据冻结与安全止损

- 建立海康 Wiki 抓取快照、页面 URL/更新时间/hash 清单。
- 建立现场控制器资料包：型号、固件、RoboDesigner 版本、SDK 包、9020 API 列表、典型响应、日志样本。
- 将网关和 Web Console 标记为 `development/demo`；关闭真实设备写操作默认权限，mock 响应增加 `simulated=true`。
- 验收：无现场证据的接口全部标记 `unresolved`；所有危险写操作可被统一禁用。

### Phase 1：契约与模型治理

- 生成 `hikrobot_secdev_manifest.json` 和 9020 HTTP manifest；为每个字段登记类型、单位、范围、来源和验证状态。
- 抽取 Proto descriptor 生成字段注册表，供 Python、Worker、前端共享或自动比对。
- 取消空模型静默补齐；明确可选文件规则、部署阻断规则和诊断报告。
- 验收：同一输入在 Python/Worker 上生成字段级等价结果；未知字段、枚举、oneof、引用和 manifest 条目均有测试。

### Phase 2：Studio 数据完整性与兼容性

- 选择 canonical source；将 blueprint、module files、full JSON 变为可验证的派生物，保存 source hash、module UUID 索引和关系索引。
- 新增 `ControllerTarget`、`CapabilitySnapshot`、`CompatibilityReport`、`DeploymentArtifact` 概念。
- 编译前执行结构、组件、接口、关系、单位、能力和目标版本校验。
- 验收：任一派生副本被篡改或引用缺失时编译失败；兼容性未知时只能导出审计包，不能标记可部署。

### Phase 3：只读 Connector 与观测闭环

- 先实现版本探测、能力探测、位姿、底盘运行状态、IO 状态、电池、机构状态、告警和脚本状态读取。
- 统一记录原始响应、规范化响应、单位、时间戳、控制器版本、请求关联 ID 和错误码。
- 录制真实响应，建立离线 replay 测试。
- 验收：没有真实 SDK 时不得报告 hardware verified；只读数据可通过 replay 完整重现。

### Phase 4：受控写操作与动作生命周期

- 以灯光、音频等低风险能力为先，再到机构、IO、移动；急停、任务屏蔽、告警写入列为最高风险。
- 所有非阻塞动作实现 accepted → running → terminal 状态跟踪，支持取消、超时和未知态。
- MCP 工具改成类型化白名单，危险动作要求权限、目标能力、前置状态和二次确认。
- 验收：每条写操作均有策略、状态机、失败恢复和审计记录；不能仅凭返回 0 判定完成。

### Phase 5：部署事务与生产门禁

- 脚本和模型部署前备份，进行语法/依赖/manifest/签名检查，原子替换，健康检查失败自动回滚。
- 去除 `sshpass`/关闭 host key 检查/强制杀进程等不安全默认；部署凭据不得进入命令行或日志。
- Web Console 与 MCP 复用 Connector，不再直接访问任意 HTTP 路径。
- 验收：仿真、录制回放、真实设备三类测试均通过；P0 风险清零，P1 风险有明确豁免和负责人。

## 13. 当前验证结果

- Python unit tests：`65 passed, 10 subtests passed`。
- 前端生产构建：通过；存在约 1.48 MB 主 JS chunk 的性能警告。
- backend-ts TypeScript build：通过。
- Cloudflare Worker TypeScript 检查：通过。
- 以上均为代码/构建层证据；尚未证明海康真实硬件、9020 真实接口、SDK 版本兼容、安全部署和生产回滚，因此总体状态仍为：**审计完成，优化实施未完成，不具备生产上线结论**。

## 14. 参考来源

- [海康机器人控制器 Wiki 首页](https://wiki-control.rms.hikrobotics.com/zh/AMRController)
- [海康设备 API 接口文档](https://wiki-control.rms.hikrobotics.com/zh/AMRController/7Development-Guide/Base/ApiDocument)
- [海康二次开发框架介绍](https://wiki-control.rms.hikrobotics.com/zh/AMRController/7Development-Guide/Base/framework)
- [海康二次开发 SOP](https://wiki-control.rms.hikrobotics.com/zh/AMRController/7Development-Guide/Base/erkaiguide)
- [mcp-http-api-gateway](https://github.com/doghelWang/mcp-http-api-gateway)
- 项目 Proto：`specifications/protocols/*.proto`
- 项目控制约束：`CONSTRAINTS.md`、`DATA_INTEGRITY_CONSTRAINTS.md`、`specifications/ENGINEERING_CONSTRAINTS.md`
