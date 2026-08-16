# AMR Studio 装备工坊实现计划与逐项验收清单

- 版本：V1
- 日期：2026-08-15
- 依据：`AMR_STUDIO_EQUIPMENT_WORKSHOP_FUNCTIONAL_AUDIT_20260815.md`、海康机器人控制器 Wiki、`specifications/protocols/*.proto`、模块模板和当前前后端实现
- 原则：Proto 优先；结构、电气、功能、二次开发关系分开建模；未知值保持 `unknown/unresolved`；每项实现必须有代码、测试和浏览器/round-trip 证据

## 新增 Wiki 证据边界

- 造车前工具准备 Wiki 明确列出 CAN 卡、USB-485/232 转换卡和 EthCanGui；该事实用于准备阶段门，不用于推断具体模块参数。
- 全向机器人《控制器上电及功能激活》以 SRC-2000 为例规定：24V 供电、纹波 ≤150mVpp、系统最小工作电流 2A（不含 Power DO），且不与电机或大功耗设备共用 DCDC。
- 同一 Wiki 以 SRC-2000 为例给出控制器默认 IP `192.168.192.5`，PC 配置到 `192.168.192.x` 网段；这是控制器连接 SOP，不是任意 ETH 模块的默认 IP，界面不得据此回填模块 `ip`。
- 具体 RS485 站号、设备波特率、CAN 终端和模块 IP 仍必须来自对应模块模板、设备手册或项目现场资料；没有字段/来源时保持 `unknown/unresolved`。

## 目标

把装备工坊从“可演示的选择、装配、连线和导出页面”提升为可审计的造车工作流：模块实例、结构位姿、电气总线/节点、功能绑定、二次开发声明和 CModel 导出之间保持唯一引用、来源可追踪、校验可阻断。

## 工作分解与验收门槛

| 阶段 | 工作项 | 主要文件/证据 | 验收标准 | 状态 |
|---|---|---|---|---|
| P0-1 | 装配实例 ID 与接口 UUID 唯一化 | `useProjectStore.ts`、装备工坊浏览器 | 同一模板安装两次，组件 ID、接口 UUID、父节点选择均独立；导出不重复 | 已实现，生产页面已复验 |
| P0-1 | 删除组件清理悬空连接 | `useProjectStore.ts`、电气审计 | 删除组件及子树后，存活接口不再引用被删接口 | 已实现，纯规则验证通过 |
| P0-2 | 接口参数统一写入 `interfaceParams` | `useProjectStore.ts`、矩阵/属性面板 | CAN、RS485、ETH 修改后立即读回，JSON/CModel 中仍位于官方接口参数结构 | 已实现，参数 round-trip 通过 |
| P0-2 | 接入电气接口矩阵 | `EquipmentWorkshopStep.tsx`、`ElectricalInterfaceMatrixStep.tsx` | 用户能从实际工作流进入矩阵，且阶段不会只改变提示语 | 已实现，生产页面已复验 |
| P0-3 | 完整性审计 | `domain/integrity.ts`、`AuditStep.tsx` | 阻断重复组件/接口 ID、悬空连接、失效父节点和父子循环 | 已实现，纯规则验证通过 |
| P1-1 | 模板参数规则 | `domain/electrical.ts`、接口模板 | CAN nodeId/baudrate、RS485 baudrate、ETH ip 按模板校验；未定义站号保持 unresolved | 已实现，纯规则验证通过 |
| P1-1 | CAN/RS485/ETH 参数规则 | `domain/electrical.ts`、模板/项目规范 | 只使用已确认 schema；校验节点 ID、站号、波特率、IP 等；未确认规则标记 unresolved | 已实现，空接口会显式报错 |
| P1-2 | 总线拓扑审计 | 电气矩阵、连接实体、审计页 | CAN/RS485 多点连接、点对点接口、参数一致性和连接来源可区分 | 已实现；新增总线/网络状态卡，终端/站号/协议仍 unresolved |
| P1-3 | 功能—硬件关系 | `functions.ts`、`AbilityStep.tsx`、`AuditStep.tsx`、FuncDesc Proto | 功能过程原始引用保留并能定位组件/接口/连接；未知引用进入报告 | 已完成协议边界审计：FuncDesc 无硬件关系字段，原始内容保留，关系明确标记 unresolved |
| P1-4 | Wiki 轮组/标定规则 | `AuditStep.tsx`、`EquipmentWorkshopStep.tsx`、轮组属性模板 | 依据明确模板字段检查电机、编码器、零位/限位、坐标和标定前置条件 | 已实现模型字段审计与调车/标定现场验收门；实测结果仍 unresolved |
| P1-5 | 二次开发声明 | 功能模型/审计报告 | 机构、第三方通信、交互、任务互锁分别标明脚本/API/反馈状态 | 已实现状态门；真实脚本/API/反馈仍按源模型保持 unresolved |
| P2-1 | 真实阶段视图 | `EquipmentWorkshopStep.tsx`/`EquipmentWebGLScene.tsx`/`App.tsx` | 准备、装配、电气、功能、校验各有独立内容和完成条件 | 已实现；装备区中心已升级为 Three.js WebGL，支持真实坐标轴、六轴位姿、四视角、四种工作模式和半透明底盘 |
| P2-2 | 兼容接口筛选和来源显示 | 工坊连线 UI | 下拉只给兼容目标；显示接口来源、单位、参数和验证状态 | 已实现兼容目标过滤；参数一致性由审计门检查 |
| P2-3 | 文档与 Obsidian 同步、审计成果物导出 | `docs/verification`、Obsidian、`AuditStep.tsx` | 审计报告独立于配置 JSON，包含来源、统计、逐条问题、组件/接口/连接引用和连接摘要；每次验收同步文档，凭据全部脱敏 | 已实现，本地与生产均已复验 |

## 当前批次：P0-1/P0-2

阶段视图进展：准备阶段已增加 Wiki 准备门，电气阶段显示接口矩阵，功能阶段显示 FuncDesc/能力关系状态和二次开发状态门，校验阶段显示结构完整性、接口参数和电气连接汇总；结构装配使用主装配视图，详细诊断进入“审计导出”。本地浏览器已逐阶段复验。

已完成代码修改：

- `addComponentFromConfig` 和 `addComponents` 在实例化边界生成唯一组件 ID；实例内接口 UUID 重新生成，内部连接同步重映射。
- `removeComponent` 级联删除后清理存活组件的悬空接口连接引用。
- `updateInterfaceParams` 改为写入 `interfaceParams` 对象，不再把 CAN/RS485/ETH 参数散落到接口根部。

验证状态：

- [x] 前端 TypeScript/Vite 构建
- [x] 组件重复安装浏览器验证（本地 Vite）
- [x] 接口参数矩阵读写验证（本地 Vite/纯函数）
- [x] 删除组件后连接引用清理规则验证
- [x] CModel export/import round-trip 验证

## 实施约束

## 本轮验证结果

- 前端 `npm run build`：通过（3189 modules）。
- Python 单元测试：65 passed，10 subtests passed。
- 本地浏览器：重复安装实例 ID 可区分；准备/电气/功能/校验四个 Wiki 验收门可切换；`robot01` 的功能空关联告警可见。
- 总线拓扑纯规则回归：已连接 CAN 的不同波特率产生 `BUS_BAUDRATE_MISMATCH`，重复节点产生 `BUS_CAN_NODE_ID_DUPLICATE`；本地 `robot01` 无已连通 CAN/RS485 拓扑，因此没有虚构拓扑错误。
- 轮组/装配审计：六轴安装位姿必须为有限数值；差速轮 `wheelRadius`、`relateMotor` 及差速舵轮外置编码器关联目标按模板/组件类别校验；本地 `robot01` 未出现位姿或轮组目标错误。
- 连线 UI 已接入领域层兼容目标筛选；源接口选择后目标模块/接口不再展示类型不兼容或 DI/DO 方向错误的候选项，并提示总线参数仍由审计检查。
- `robot01` 原始 JSON 核对确认：空 CAN/ETH 接口分别缺少 `nodeId/baudrate` 与 `ip`，已有参数的 CAN 接口可正确读出；审计报错保留为模型缺失诊断。
- 本地 CModel 编译曾暴露 ABI `ARRAY` 枚举错误；已按 `controller_model_abi_set.proto` 修复前后端 `ARRAY/COMBOX` 别名映射为 `ARRAY_E/COMBOX_E`，本地编译返回 200，并通过页面重新导入。
- 独立 CModel 测试包基础设施已修复：`npm test` 通过，基础 round-trip 46 PASS/0 FAIL/4 WARN，详细 round-trip 120 PASS/0 FAIL；前端构建和后端单元也通过。
- Cloudflare Worker ABI 导出路径同步修复并通过 TypeScript 类型检查；`wrangler deploy --dry-run` 成功打包 21 个静态资源（708.58 KiB，gzip 82.28 KiB），随后已完成真实部署。
- 最新本地浏览器复验：已加载 `robot01`，装备工坊五个阶段均可切换；准备阶段显示 CAN 卡、USB-485/232、EthCanGui 待确认，以及 SRC-2000 供电/IP 示例边界；功能阶段显示 FuncDesc/能力统计和四类二次开发 unresolved 门，校验阶段显示结构错误 0、接口参数错误 12、电气连接 4；这些错误与源模型缺失字段一致。
- 本轮总线状态复验：电气阶段新增“总线 / 网络状态”卡，`robot01` 显示 4 个来源于显式 `linkedInterfaceUuid` 的网络/接口记录；CAN/RS485 显示成员、接口键、拓扑连接数、baudrate、CAN nodeId、参数异常和终端电阻/协议 unresolved；ETH 按点对点连接显示。未形成显式拓扑时页面显示“未形成显式拓扑”，不按接口名称虚构总线。
- 本轮 2.5D 复验：结构装配阶段中心视图已从平面点位图升级为 2.5D 等距投影；模块位置使用 `mountX/mountY`，高度使用 `mountZ` 抬升，方向使用 `mountYaw` 旋转，卡片保留选中、定位状态和 XYZ 提示；未对模型写入视觉默认值。
- 生产部署复验：已在用户确认后执行 `npx wrangler deploy`，Cloudflare Worker 版本 ID 为 `38f7ad5a-979f-441c-aa40-3aeac263b590`；`https://cloud-ai.work/?project=robot01` 逐页确认装备工坊、2.5D 视图、总线 / 网络状态、调车/标定和审计导出均可见，生产浏览器错误数为 0。
- Wiki 标定门复验：整车校验阶段显示现场标零、标定结果、重复到点精度 ±5 mm 待确认，并显示卷尺/激光水平仪/记号笔等准备要求；不把运行态实测结果写入模型默认值。
- 游戏化验收清单复验：准备清单勾选 CAN 卡后进度由 `0/3` 变为 `1/3`；整车校验显示调车/标定 `0/5`，五项均可逐项勾选；状态只存在当前 UI 会话，不进入 Proto/CModel。
- 审计成果物导出：审计页已新增“导出审计报告”按钮，生成独立 `amr-studio.audit-report.v1` JSON，保留来源、统计、逐条诊断、组件/接口索引和电气连接摘要，不改写配置本体；本地浏览器点击后显示 `robot01_audit_2026-08-15.json` 已生成，且无前端错误。
- 审计追踪字段：逐条问题保留 `nodeId`、`interfaceUuid`、`connectionId` 和 `source`（无来源时为 `unknown`），使诊断可回指组件/接口/连接或协议来源。
- 最新 Worker dry-run：TypeScript 检查通过；dry-run 仍读取 21 个静态资源并正常退出，Wrangler 仅因本机日志目录权限产生 EPERM 日志提示，不影响 dry-run 打包结果。
- 协议/部署边界记录：`docs/verification/AMR_STUDIO_FUNC_DESC_AND_WORKER_DEPLOYMENT_BOUNDARY_20260815.md` 已确认 FuncDesc Proto 没有组件/接口/连接关系字段；用户已明确允许当前 Worker 混合改动发布，并完成生产复验。
- 生产复核：`https://cloud-ai.work/?project=robot01` 已确认装备工坊、2.5D 视图、总线 / 网络状态、调车/标定和审计导出均可见，浏览器错误数为 0；版本 ID 为 `38f7ad5a-979f-441c-aa40-3aeac263b590`。
- 最新回归：前端 `npm run build` 通过（3189 modules）；Python 单元测试 `66 passed, 14 subtests passed`；TypeScript 后端 `npm run build` 通过。
- 访问异常复核：应用内浏览器可正常打开 `https://cloud-ai.work/?project=robot01` 并加载 `robot01`；装备工坊、电气总线状态和 2.5D 视图均可见，生产页面错误数为 0。当前命令行 `curl/dig` 的 DNS 失败来自执行环境网络限制（`Could not resolve host`），不能作为生产 Worker 5xx 证据；浏览器直连 `/api/v1/*` 被客户端拦截器阻止，但前端页面调用链路正常。
- Chrome/Safari 访问修复：发现 Chrome 直链触发 `Cannot read properties of undefined (reading 'robotName')`，原因是持久化项目状态可能为无效 config 且直链项目尚未完成加载。已增加 Zustand 持久化状态兜底和 `?project=robot01` 自动加载；生产版本 `42c9d541-3bec-436e-bceb-4a55206bb418` 已通过 Chrome/Safari 验证，Chrome 错误数为 0，Safari 可加载装备工坊及总线状态。
- 3D 视图升级：装备区已由 2.5D 升级为原生 CSS 3D 场景，底盘和装备节点具有立体厚度；节点使用 `mountX/Y/Z/Roll/Pitch/Yaw`，提供等距、顶视、前视、侧视和自由拖拽旋转，支持滚轮/按钮缩放。生产版本 `5a4be8cf-7da1-43ef-b0b9-c34c1d33d56c` 已通过 Chrome/Safari 验证，视角按钮和场景无运行时错误。

## 最终待办边界

以下两项已完成“代码审计、界面提示和 unresolved 输出”，但不能由当前仓库自动完成，保留为现场/项目资料待办：

1. CAN/RS485/ETH 的真实节点 ID、波特率、站号、终端电阻、协议、网段、端口和电源规则；需要具体控制器型号、模块手册、项目接线表或现场测试结果。
2. FuncDesc 与真实组件/接口/连接/运行反馈的绑定；当前 Proto 没有足够字段表达该关系，需要项目 FuncDesc 扩展或运行时脚本/API 资料。

这两项不再阻塞前端发布和页面验证，但在真实造车放行前必须由项目负责人或现场工程师确认。

1. 不修改用户已有未提交的 Cloudflare、运行日志、生成模型和测试产物。
2. 不通过模块名称推断节点、波特率、IP、默认关系或功能能力。
3. 不在没有 Wiki/Proto/模板/项目规范依据时新增“看似合理”的默认值。
4. 任何新规则必须写清数据来源、原始字段、单位、验证状态和未决原因。
5. 真实造车放行条件是 P0/P1 完成并通过浏览器、单元/类型检查和 CModel round-trip；单纯 build 通过不算完成。
