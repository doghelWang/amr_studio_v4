# AMR Studio V4 装备工坊逐界面功能审计

- 审计日期：2026-08-15
- 审计对象：生产环境 `https://cloud-ai.work` 的装备工坊，以及 `src/frontend/src`、Proto、模块模板和已验证的 CModel 编译下载链路
- 审计基线：海康机器人控制器 Wiki 的模型文件、基础知识、轮组、组件库、构车指南、二次开发页面；项目 Proto 为数据结构事实来源
- 审计范围：准备、结构装配、电气连接、功能绑定、整车校验/导出，以及它们在当前页面中的状态传递
- 结论性质：本报告是证据型审计，不把界面存在、代码存在或编译成功等同于整车模型已经满足 Wiki 造车要求

## 1. 总结结论

当前装备工坊可以完成“选模块—安装位姿—建立接口引用—编辑能力属性—调用导出”的本地与生产闭环；前端构建、后端单元、独立 CModel round-trip、Worker dry-run、生产部署和生产浏览器逐页复验均已完成。

但按 Wiki 的造车过程审计，当前不能判定为可直接用于真实造车。主要原因是：

1. 组件/接口实例唯一化、内部 UUID 重映射和删除后的悬空连接清理已实现，生产页面已复验。
2. 装备工坊已接入电气接口矩阵，能显示并编辑模板确认的 CAN `nodeId/baudrate`、RS485 `baudrate` 和 ETH `ip`；RS485 `stationId` 因模板无字段保持 unresolved。
3. 审计已覆盖重复 ID、悬空引用、父节点循环、有限 6-DOF 位姿、轮组关联、CAN/RS485/ETH 参数以及显式连接拓扑的波特率/节点重复；终端、站号、网段、电源和现场分段规则仍未决。
4. 接口参数已统一写入官方 `interfaceParams.interfaceParamsArray`，并完成本地 round-trip 验证。
5. 功能页已保留 FuncDesc 原始只读状态、组件能力字段审计和空 `related*` 告警；Proto 未提供可解析的组件/连接关系时明确显示 unresolved，不能声称功能绑定已完成。
6. 审计页已显示结构错误、接口参数错误、电气连接、组件能力、功能能力和功能过程计数，并列出逐条诊断；Wiki 要求的现场标定、建图、脚本/API 实际运行效果仍需项目资料和现场验证。

综合评级：**界面可用性：本地与生产验证通过；模型数据完整性：已具备阻断式审计但当前 `robot01` 仍有源模型缺失参数；真实造车可交付性：仍需现场电气规则和功能/二次开发运行绑定确认。**

本轮实现进展：已在 Store 实例化边界生成唯一组件/接口实例标识，删除组件时清理悬空连接；接口参数改为按模块模板写入 `interfaceParams.interfaceParamsArray`；电气矩阵已接入装备工坊的“电气连接”阶段；审计新增重复 ID、悬空引用、失效父节点、父子循环、安装位姿、轮组关联以及 CAN/RS485/ETH 模板参数和显式总线拓扑检查。功能页增加二次开发 unresolved 验收门。另修复 ABI `ARRAY/COMBOX` 到 Proto `ARRAY_E/COMBOX_E` 的映射；本地 CModel 编译、重新导入、生产部署和生产浏览器复验均已通过。

## 2. Wiki 造车基线与审计映射

Wiki 的《模型文件》明确将模型拆为：

- 结构设计：模块组成、结构从属、坐标位姿；
- 电气连接：ETH、CAN 总线及节点/子节点电气信息；
- 功能配置：定位导航、人机交互、安全能力及其与器件的关联。

《构车指南》进一步要求：准备资料和器件选型 → 配置 CANID、波特率、电机参数以及激光/相机 IP → 完成整车接线、模块库、结构设计、电气连接、功能配置 → 模型校验 → 调试、标定、建图和二次开发。

《轮组》要求按车型核对轮组坐标、行走/转向电机、转向编码器、减速比、零位/限位和标定关系；差速舵轮必须使用外置转向编码器。二次开发页面明确，机构、第三方通信、按钮/灯光/扬声器和任务互锁等业务不应被误认为普通硬件属性，而应通过脚本/API和反馈闭环实现。

因此本审计把“结构、电气、功能”分开统计，并把二次开发相关能力标记为模型声明、脚本实现、运行时验证三类，不混成一个“配置完成”状态。

## 3. 逐界面审计

### 3.1 准备：资料与器件清单

状态：**部分通过**。

已验证：在线模块注册表可以加载；生产页面显示“当前使用在线模块注册表”；模块按行走与动力、定位与导航、避障与安全、能源与充电、主控与通信、声光与人机分组，能选取模块并进入装配。

缺口：准备页没有把 Wiki 要求的器件选型依据、控制器适配范围、真实料号/版本、CANID/波特率/IP 等准备资料转成强制输入或审计项；新建项目缺少器件清单与“来源/已确认/待确认”状态。模块名称不能替代真实型号和协议参数。

### 3.2 结构装配：位置、角度、父子关系

状态：**交互部分通过，工程约束不通过**。

生产页面已验证：选择模块后可用前/后/左/右/顶/中心意图按钮；可编辑 X、Y、Z、Roll、Pitch、Yaw 六个字段；输入 `600,0,0,10,20,30` 后重新选中仍能读回，说明 UI 状态和结构参数写入链路基本可用。

代码依据：`EquipmentWorkshopStep.tsx` 将前后左右顶部映射为基于底盘长宽高的预览值，并明确是“装配意图预览”；`ExportService.ts` 输出 `locCoordX/Y/Z/ROLL/PITCH/YAW` 和 `parentNodeUuid`。

问题：

- 已修复：`addComponentFromConfig` 在实例化边界生成独立组件 ID，并同步重映射实例内接口 UUID 和内部连接引用；本地浏览器连续安装同一模块后可显示两个短 ID，生产页面已完成发布后复验。
- P1：坐标单位、坐标系方向、角度单位和 Roll/Pitch/Yaw 旋转顺序未在实际编辑器中明确展示；Proto 只提供单位字段，不能由字段名猜测单位。
- P1：意图按钮仅按底盘尺寸计算位置，没有检测模块尺寸碰撞、越界、与运动中心的关系、轮组接地、传感器视场或安装禁区。
- P1：父节点可选择，但未在工坊保存动作中阻止自引用、循环、失效父节点或跨层级非法挂载；审计页目前主要是父节点存在性/类别规则。
- 已修复：删除组件级联后清理存活组件中指向被删接口的 `linkedInterfaceUuid`；完整性规则有纯函数回归。
- P2：当前装配清单显示名称和类别，缺少稳定实例 ID、来源模板、坐标来源、确认状态和变更记录。

### 3.3 电气连接：总线、节点、节点 ID

状态：**连接引用部分通过；按 Wiki 要求不通过**。

已实现并验证的内容：`createConnection` 会检查接口存在、接口归属、类型兼容、DI/DO方向和点对点接口占用；`buildElectricalConnections` 能把 `linkedInterfaceUuid` 转成连接实体并报告未知目标。

缺口和缺陷：

- 已修复：矩阵已接入装备工坊的电气阶段；参数按模板事实改为 CAN `nodeId/baudrate`、ETH `ip` 并写入 `interfaceParamsArray`，生产页面已验证。RS485 模板没有 `stationId`，界面明确显示 unresolved，不再伪造该字段。
- 已实现部分：接口参数审计检查 CAN 节点 ID/模板波特率，RS485 波特率，ETH `ip`；显式连通的 CAN/RS485 网络检查波特率一致性和 CAN 节点 ID 重复。终端电阻、站号和项目分组规则仍 unresolved。
- P1：RS485 站号、波特率、串口模式未校验；ETH 未校验 IP 格式、端口、网段冲突、主从/服务角色；电源接口未校验额定电压、电流、极性和容量。
- P1：连接实体的 `source` 在实现中固定为 `imported_cmodel`，用户新建连接也被标为导入来源，审计无法区分原始关系与用户新增关系。
- P1：连接写入只更新 source 接口的 `linkedInterfaceUuid`，依赖后续构建器合并反向引用；必须明确单向/双向关系和导出策略，否则用户看见“已连接”不代表源模型两端都有一致关系。
- P2：兼容目标计算函数存在，但工坊目标接口下拉仍展示全部接口，错误选择后才由状态层拒绝，缺少前置过滤和原因提示。

Proto 事实：`Message_Interface_Param_Group` 明确包含 `interface_uuid`、`linked_interface_uuid`、`interface_attrs`、`interface_params`；`Message_Interface_Param` 另含 `node_pos_x/node_pos_y`。Proto 本身没有可直接命名为 `canId`、`stationId` 或 `baudRate` 的固定字段，这些参数必须来自接口参数模板/项目规范并保留原始 key，不能由前端名称推断。

### 3.4 功能绑定：定位、导航、安全、交互、执行机构

状态：**展示和属性编辑部分通过，功能绑定闭环不通过**。

当前页面可以显示 `componentAbility`、`functionAbility`、FuncDesc 计数，并使用递归属性编辑器修改已有能力属性；没有能力模板时会提示不会自动生成，这符合数据不猜测原则。

问题：

- P1：页面没有直接的“功能选择 → 可用组件 → 接口/连接 → 反馈条件”绑定工作流；功能页实际仍保留装配工坊主体，点击“功能绑定”主要改变提示语。
- P1：`parseFunctionProcesses` 把 FuncDesc 过程的 `inputs`、`outputs`、`relatedAbilities`、`relatedComponents`、`relatedConnections` 全部初始化为空并设为只读摘要，无法审计功能过程实际关联了哪些硬件。
- 已增加明确告警：当 FuncDesc 过程未解析出组件/连接/能力关系时，AuditStep 和过程诊断均标记 `FUNC_RELATIONS_UNRESOLVED`；这只是防止误判通过，尚未替代真实关系解析。
- 已增加二次开发验收门：机构/执行脚本、第三方通信 API、人机交互反馈、任务互锁均明确显示 unresolved。定位、避障、安全 IO、灯光策略等具体运行时前置条件仍未形成完整检查。
- P1：执行模块在 Wiki 中明确通常通过脚本二开实现；当前模块分类可以选择 `ACTOR`，但没有脚本/API、动作状态、反馈传感器和任务互锁的关联模型，容易产生“模块已装配=机构业务已完成”的误判。
- P2：能力编辑器对 `related*` 属性有部分丢失组件检查，但未做接口、连接、功能过程和脚本入口的完整引用检查。

### 3.5 整车校验与导出

状态：**导出链路通过；校验覆盖不足**。

已验证：生产环境真实导出触发编译；`new_proj_bc420v4_packed.cmodel` 返回 HTTP 200，大小 6446 bytes，Content-Type 为 `application/octet-stream`，文件识别为 CModel ZIP 容器。前端 build 通过，后端 unit tests 为 65 passed、10 subtests passed。

当前 AuditStep 已检查：必填属性和数值范围、通信接口未连线、父节点引用、差速舵轮外置编码器/关联、驱动类型与轮组数量、电机是否挂在 DRIVER 下、CAN 是否存在连接、DI/DO方向、能力属性引用。

但它没有检查：

- 重复组件 ID、重复接口 UUID、重复 CAN 节点 ID/RS485 站号；
- 连接两端参数、总线波特率、IP/端口/网段、电源额定值；
- 坐标单位/坐标系、安装碰撞、越界、运动中心、轮组接地和角度约束；
- 立/卧式舵轮的转向电机、编码器组合、零位/限位参数与标定前置条件；
- 功能过程对组件/连接/反馈的真实关联；
- 由二次开发脚本、外设协议、任务互锁和运行时反馈组成的闭环。

因此当前“审计导出”最多证明 JSON/CModel 编译闭环可运行，不能证明模型满足 Wiki 的真实造车验收条件。

## 4. 风险分级与整改顺序

### P0：阻断真实使用

1. 装配实例 ID 唯一化：原始模板 ID、实例 ID、显示别名分离；导入原始 ID 必须保留，重复装配必须生成稳定实例 ID并维护来源关系。
2. 完成总线/节点参数矩阵的生产浏览器和 CModel round-trip 验证；在未完成时禁止以“已连接/完整”作为通过条件。
3. 审计增加重复 ID、悬空引用、循环父子关系、重复节点 ID和关键参数缺失的阻断规则。

### P1：影响模型正确性

1. 建立按 Wiki/项目规范驱动的 CAN、RS485、ETH、POWER 参数 schema；参数必须保留原始 key、单位、来源和验证状态。
2. 连接实体区分 `imported_cmodel`、`user_created`、`template_generated`，并明确是否双向写入。
3. 将功能绑定改成组件/接口/连接/反馈四元关系，FuncDesc 至少解析并展示原始引用，未知引用必须进入审计报告。
4. 增加坐标系、单位、旋转约定、安装包围盒、运动中心和轮组/编码器/零位规则。
5. 将二次开发能力建模为脚本入口、API、输入、输出、反馈、异常和任务互锁，不从模块名称推断完成状态。

### P2：可维护性和体验

1. 阶段按钮应切换真正的阶段内容，而不是仅改变说明 alert。
2. 目标接口下拉应预过滤兼容项，并显示不兼容原因。
3. 展示稳定 ID、来源、变更历史、单位和“已确认/unknown/unresolved”状态。
4. 将模型校验结果导出为可追踪清单，并链接到具体组件、接口、节点和字段。

## 5. 验证证据

- 在线页面：`https://wiki-control.rms.hikrobotics.com/zh/AMRController/3Basic-Knowledge/1Model-File`
- 造车流程：`https://wiki-control.rms.hikrobotics.com/zh/AMRController/5Manufacturing-Guide`
- 轮组规则：`https://wiki-control.rms.hikrobotics.com/zh/AMRController/3Basic-Knowledge/Wheel`
- 二次开发：`https://wiki-control.rms.hikrobotics.com/zh/AMRController/7Development-Guide`
- 离线 Wiki 造车工具依据：`wiki_offline_package/markdown/SRC 控制器造车应用版块/SRC 控制器造车文档目录/全向机器人/造车/造车前的工具准备.md`
- 离线 Wiki 供电/IP 依据：`wiki_offline_package/markdown/SRC 控制器造车应用版块/SRC 控制器造车文档目录/全向机器人/造车/电气设计单元/控制器上电及功能激活.md`
- 离线 Wiki 调车准备依据：`wiki_offline_package/markdown/SRC 控制器造车应用版块/SRC 控制器造车文档目录/全向机器人/调车/调试车辆前的准备工作.md`
- 离线 Wiki 标定依据：`wiki_offline_package/markdown/SRC 控制器造车应用版块/SRC 控制器造车文档目录/潜伏式顶升机器人/调车/标定.md`
- 结构 Proto：`specifications/protocols/controller_model_comp_desc.proto`
- 实际工坊：本地与生产页面逐阶段浏览；确认准备阶段的 CAN/USB-485/EthCanGui 工具门和 SRC-2000 供电/IP 边界、在线模块、6-DOF 编辑、重复模块装配、功能绑定页和审计页的实际状态。
- 标定门：本地整车校验阶段显示现场标零、标定结果、重复到点精度 ±5 mm 待确认，以及卷尺/激光水平仪/记号笔准备要求；运行态实测结果未写入模型默认值。
- 游戏化清单：准备阶段 CAN 卡勾选后显示工具准备 `1/3`；整车校验阶段显示调车/标定 `0/5`，各项可逐项操作，清单状态不进入模型导出。
- 构建：`src/frontend` 执行 `npm run build` 成功；仅有 bundle size warning
- 回归：`src/backend/venv/bin/python -m pytest tests/unit -q`：66 passed，14 subtests passed
- 独立 CModel：基础 round-trip 46 PASS/0 FAIL/4 WARN；详细 round-trip 120 PASS/0 FAIL
- Worker：TypeScript 检查通过；`wrangler deploy --dry-run` 读取 21 个静态资源并正常结束
- 规则回归：完整性规则覆盖重复组件/接口 ID、悬空连接、失效父节点；接口参数规则覆盖 CAN 节点重复/范围、模板波特率和 ETH ip 缺失
- 参数 round-trip：`interfaceParamsArray` 的 CAN `nodeId/baudrate`、ETH `ip` 读写测试通过
- 导出：本地 CModel 编译 HTTP 200 并完成重新导入；早期生产环境 CModel 编译下载 HTTP 200 作为历史证据保留，但不代表本轮 Worker 已部署。
- 审计成果物：审计页新增独立 `amr-studio.audit-report.v1` JSON 导出，包含来源、统计、逐条诊断、组件/接口索引和电气连接摘要；逐条问题保留 `nodeId`、`interfaceUuid`、`connectionId`、`source`。它与配置 JSON 分离，不改写模型数据。本地和生产浏览器均已验证按钮可见，生产页面无前端错误。
- FuncDesc/部署边界详见 `docs/verification/AMR_STUDIO_FUNC_DESC_AND_WORKER_DEPLOYMENT_BOUNDARY_20260815.md`：Proto 无硬件关系字段，Worker 当前存在未提交改动混合，生产部署必须先隔离。
- 生产部署证据：用户确认后发布 Cloudflare Worker 版本 `38f7ad5a-979f-441c-aa40-3aeac263b590`；生产 `robot01` 页面可见本轮审计报告、标定门、准备工具门、电气矩阵和 2.5D 视图，浏览器错误数为 0。

## 7. 本轮专项复核：总线状态与 2.5D 装备区

### 7.1 Wiki 对照结论

在线 Wiki 将模型电气连接定义为 ETH 网络、CAN 总线节点/子节点及模块间拓扑关系；造车 SOP 要求电气连接与实际接线一致，模型校验需能发现连线缺失并区分异常节点。VCU 页面进一步说明，VCU 侧 `CONN` 是逻辑连接例外，不能把“连接序号不重要”泛化到主控侧 CAN/ETH/IO 连接。CAN/RS485 的终端电阻要求也来自具体控制器/接线说明，当前 Proto/模块模板没有统一可确认字段，因此界面显示 unresolved。

### 7.2 前端整改

- `summarizeElectricalBusNetworks()` 以 `linkedInterfaceUuid` 的显式图为唯一拓扑依据，聚合 CAN/RS485 多点成员和 ETH 点对点连接。
- 电气接口矩阵新增“总线 / 网络状态”卡：显示成员数、拓扑连接数、接口键、baudrate、CAN nodeId、参数异常和连接不完整原因。
- 未形成显式连接时明确显示“未形成显式拓扑”，不因 `CAN_1`、`CAN_2` 等接口名自动拼接总线。
- “终端电阻 / 协议”保持 unresolved，要求根据实际接线、控制器型号和项目规范确认；没有把 Wiki 示例值写成通用默认值。
- 装备区中心图改为 2.5D：XY 位置、Z 高度抬升、YAW 朝向均来自现有结构字段；未知位姿仍显示待定位，不覆盖 Proto 原值。

### 7.3 浏览器证据

- 本地 `http://127.0.0.1:3101/?project=robot01`：装备工坊→电气连接可看到“总线 / 网络状态”、`linkedInterfaceUuid` 说明及 CAN/RS485/ETH 状态卡。
- 本地装备工坊→结构装配截图确认中心视图显示等距/抬升效果，并保留模块点击和 XYZ 提示。
- 前端 `npm run build`：通过，3189 modules；仅有 bundle size warning。
- 生产部署：用户确认后已发布 Cloudflare Worker，版本 ID `38f7ad5a-979f-441c-aa40-3aeac263b590`。生产 `https://cloud-ai.work/?project=robot01` 已逐页验证装备工坊、2.5D 视图、电气总线状态、调车/标定验收门、审计导出，浏览器错误数为 0。

### 7.4 3D 视图升级复核

- 原 2.5D 视图已替换为原生 CSS 3D 场景，不引入未经验证的模型几何默认值或新增 WebGL 依赖。
- 底盘通过前/顶/侧面立体层表达厚度；装备节点通过 `translateZ` 和 `rotateX/Y/Z` 使用实际 6-DOF 位姿显示。
- 支持等距、顶视、前视、侧视预设，自由拖拽旋转和滚轮/按钮缩放；模块仍可点击选中。
- 生产版本 `5a4be8cf-7da1-43ef-b0b9-c34c1d33d56c` 已在 Chrome/Safari 验证，生产页面无运行时错误。

### 7.5 实体外观参考依据

- 海康 Wiki 的[底盘模块说明](https://wiki-control.rms.hikrobotics.com/zh/AMRController/4Component-Library/2chassissystem)将底盘子系统拆为底盘模块和驱动轮组，并说明轮组包含车轮、驱动和电机等组成；[轮组说明](https://wiki-control.rms.hikrobotics.com/zh/AMRController/3Basic-Knowledge/Wheel)用于校对差速轮的轮胎/轮毂表达。
- [坐标系 Wiki](https://wiki-control.rms.hikrobotics.com/zh/AMRController/3Basic-Knowledge/draft)和[运动中心 Wiki](https://wiki-control.rms.hikrobotics.com/zh/AMRController/3Basic-Knowledge/new-page)要求传感器位置和姿态以机器人/运动中心为基准，因此 3D 只使用源模型的 XYZ 与 Roll/Pitch/Yaw。
- [按钮和 CE 开关 Wiki](https://wiki-control.rms.hikrobotics.com/zh/AMRController/4Component-Library/6HCinteraction/9FAQButtonAndCE)与公开 AMR 产品示意共同支持红色急停按钮、低矮车体、可见轮组和顶部/前部激光等视觉特征；这些仅用于界面示意，不回填实际模块尺寸或安全属性。
- 生产复验：版本 `c25cbae1-d2e2-409e-b5b8-ee03e2df52a1`；Chrome 检出 wheel=2、lidar=2、button=3、battery=1、controller=1，Safari 可见 3D、预设视角和拖拽提示，双方均无运行时错误。
- 对比修正：首次实体化版本的问题是待定位模块全部叠在中心，造成“漂浮图标”观感。最终版增加按类别的仅视图展开锚点：轮组两侧、激光前/顶部、按钮侧边、主控/IO/电池平台；增加“实体展开/真实叠放”切换，并在提示中声明展开偏移不写回模型坐标。车体主体填充、厚度和阴影同步增强。
- 最终生产复验：版本 `c7b02048-2575-4a18-bd92-c9f4c02b1b61`；Chrome 可见 3D 场景、实体展开提示、wheel=2、lidar=2，浏览器错误数为 0。

### 7.6 互联网实物对比后的二次优化

- 对比公开 AMR 底盘实物/设计图后，确认原版本的主要问题不是视角，而是模块呈现为发光卡片，缺少车体、上盖、防撞边、轮舱和安装层次。
- 参考低矮底盘、黑色橡胶轮/轮毂、顶部圆柱激光、红色急停按钮和可维护的模块化上平台等共同视觉特征，对 3D 场景增加底盘上盖、前防撞梁、指示灯、侧轨、四个轮舱和结构示意标识。
- 电池改为深色金属盒，控制器改为带状态灯和散热纹理的控制盒，IO 改为端子排，驱动器改为散热片盒体，电机改为金属圆柱壳体；这些是视图级外观表达，不代表项目实际尺寸、材质或安全等级。
- 参考来源： [REEMAN 开放 SDK 底盘](https://www.reemanrobotics.com/intelligent-open-sdk-smart-robot-chassis-autonomous-mobile-robot-agv-product/)、[Puxiang 四轮工业机器人设计](https://www.puxiang.com/galleries/82503ac6c62f180b0b5830a0bbe54762)、[OTTO 1200 组件布局](https://ottomotors.com/1200/)。
- 本轮构建通过；生产版本 `78148628-57aa-4b82-93ab-db170c5ac056`；Chrome 最终验证 `view3d=true`、底盘上盖/防撞梁存在、轮舱=4、装备节点=14、wheel=2、lidar=2、battery=1、controller=1、driver=2。
- 仍需说明：当前是可交互的工业结构示意，不是 CAD/GLTF 实体模型；若要达到工程展示级真实外观，必须取得车型对应的车体、轮毂、雷达和控制盒 CAD/GLB 资产，并建立资产来源与真实尺寸映射。

### 7.7 多视角 UI/工业设计复核与主视口重构

- 本轮按工业设计、3D 交互、AMR 工程和信息架构四个视角复核。共同结论是：旧界面仍是三栏配置后台，3D 只是其中一张卡片；视觉焦点、装配层级和真实模块数量没有进入空间视图。
- 参考 GrabCAD/制造商爆炸图中“中心底盘—左右轮组—动力单元—电池/控制器—顶部传感器”的层级，以及公开 AMR 的模块化上平台、侧面轮组、顶部雷达和急停布局，重构为中心 3D 主视口、左侧功能/装配语义、右侧模块库/详情的 4:14:6 布局。
- 3D 主视口新增车型/空间装配 HUD，显示实际组件数量：轮组、电机、雷达、电池；不添加模型中不存在的参数，不把参考图片的尺寸写入数据。
- 视口提高到 510px 最小高度，采用深色工业工作区、内阴影、结构边界和底部图例；模块库从主视觉中降级，避免“配置列表压过设备本体”。
- 参考来源： [GrabCAD 机器人底盘爆炸图](https://grabcad.com/library/last-mile-logistics-delivery-robot-1)、[AgileX Ranger Mini 爆炸示意](https://www.leobotics.fr/comparateur-robot/robot-professionnel-industrie-telecommunication-axes-mobile-agv-pro-leobotics-robotics/base-mobile-robot-agv-roues-leobotics-robotics/robot-agv-agilex-robotics-ranger-mini-ugv-omni-directionnel-compact-multimodal-flexible/)、[Wheeltec 模块化底盘](https://www.wheeltec.net/product/class/?149.html)、[AMR 组件专利结构说明](https://patents.justia.com/patent/20250058812)。
- 生产版本 `fb54dd09-0b6d-40e5-9771-dc72e916f062`；Chrome 验证 HUD 存在、3D 场景高度 510px、显示 `2 轮组 / 2 电机 / 2 雷达 / 1 电池`，浏览器错误数为 0。
- 设计边界：本轮完成的是界面构图与空间信息层级重构，尚未等同于 CAD 资产重建；下一阶段应把轮组总成、动力总成和电气拓扑做成可切换的独立视图。

### 7.8 从零重设计：技术装配工作台视觉基线

- 本轮不沿用上一版霓虹卡片式 3D 视觉，重新定义为“技术装配工作台”：低角度装配透视、浅色工程网格、石墨车体、工程轴向标记、结构层级 HUD。
- 默认等距视角由高俯视改为低角度 `pitch=32`，优先保证车体厚度、侧挂轮组和落地关系可见；顶部/前视/侧视仍保留。
- 3D 区域最小高度提升到 570px，加入 `ASSEMBLY / 03`、`X+ FRONT` 和坐标读数，模块库和属性面板作为辅助面板，不再与设备本体争夺主视觉。
- 视觉参考来自 AMR 爆炸图和模块化底盘：中心底盘、左右驱动轮组、动力单元、电池/控制器、顶部传感器分层表达。[GrabCAD 底盘爆炸图](https://grabcad.com/library/last-mile-logistics-delivery-robot-1)、[Wheeltec 模块化底盘](https://www.wheeltec.net/product/class/?149.html)、[AMR 模块化平台结构](https://patents.justia.com/patent/20250058812)。
- 生产版本 `07eed33d-7bde-4a6a-8d7c-69804eac9ec2`；Chrome 验证 3D 视口、工作台标记和无运行时错误。
- 当前已识别的下一项视觉问题：组件名称仍以白色标签块叠加，下一轮应改为工程引线/侧栏选中态，避免标签覆盖实体轮廓。

## 6. 未决项

Wiki 已确认的边界包括：造车前准备需要 CAN 卡、USB-485/232 转换卡和 EthCanGui；SRC-2000 示例控制器为 24V 供电、纹波 ≤150mVpp、系统最小工作电流 2A（不含 Power DO），且不应与电机或大功耗设备共用 DCDC；其连接示例使用默认控制器 IP `192.168.192.5`，PC 配置到 `192.168.192.x` 网段。

以下内容仍不能仅凭当前 Wiki、Proto 和前端代码确认，必须由项目规范、真实控制器配置或现场接线资料补齐：CAN 三类协议对应的节点 ID 范围和总线分组规则、具体模块的波特率/站号/IP/端口、ETH/CAN 终端和拓扑要求、电源极性与额定参数、模块安装单位及角度约定、各车型的轮组参数和标定验收值、二次开发脚本与运行时接口的实际绑定关系。控制器示例 IP 不能替代任意 ETH 模块的 IP。

在这些信息未确认前，报告中的相应字段应保持 `unknown` 或 `unresolved`，不能通过模块名称、接口名称或默认值静默补全。
