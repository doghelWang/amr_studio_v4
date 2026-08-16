# AMR Studio V4 新前端方案

- 版本：2026-08-15
- 适用范围：`src/frontend`
- 当前生产版本：`baff185f-a43c-43a1-8be6-57a2a729c0cc`
- 生产入口：<https://cloud-ai.work/?project=robot01&v=baff185f>

## 1. 方案结论

新前端不再把 AMR 配置理解为一组平铺表单，而是组织为一条可审计的造车任务链：

```text
身份与机型
  → 准备资料与器件
  → 结构装配与 6-DOF 位姿
  → 电气接口、总线、节点与参数
  → 功能和二次开发状态
  → 整车校验、审计与导出
```

中心装备区已从二维/图片化示意升级为 Three.js WebGL 装配空间。它直接消费当前 `ComponentConfig` 的 Shape、XYZ、Roll/Pitch/Yaw、类别和显式层级，不把外部参考模型或视觉停放位置写回模型。

方案的核心价值是把“界面好看”“配置已填写”“模型可导出”“真实车辆可放行”分成不同状态。没有 Proto、模板或项目规范依据的值继续保持 `unknown/unresolved`。

## 2. 设计原则与数据边界

### 2.1 Proto 和模块模板优先

- Proto、参考 CModel、模块模板和项目规范是模型事实来源。
- Wiki 与 OpenAMR 用于工作流、装配层级和工程表达参考，不作为 AMR Studio 的尺寸、连接或默认参数来源。
- 模块名称、分类和视觉几何不能用于推断节点 ID、波特率、IP、父子关系或功能绑定。

### 2.2 四类关系分离

| 关系 | 数据来源 | 是否导出 |
|---|---|---|
| 组成/父子关系 | `parentNodeUuid` | 是 |
| 安装位置与朝向 | `mountX/Y/Z/Roll/Pitch/Yaw` | 是 |
| 电气连接 | `linkedInterfaceUuid`、接口参数 | 是 |
| 功能关系 | Ability/FuncDesc 明确字段 | 有明确字段时导出 |
| MMP 分组、爆炸停放、未定位分离 | 前端只读投影 | 否 |

### 2.3 视图状态不污染模型

- 相机、缩放、半透明、爆炸、轮组聚焦和未定位模块停放均属于视图状态。
- 四舵轮缺失或重复位姿时，只在轮组/爆炸模式执行只读四角分离。
- 半透明外壳、检修盖板和轮廓线参数不进入 `ComponentConfig` 或 CModel。

## 3. 信息架构与造车流程

### 3.1 五阶段装备工坊

1. **准备**：身份尺寸、模块来源、器件清单和 Wiki 工具准备门。
2. **结构装配**：模块实例、父节点、六轴位姿、总成树和 WebGL 装配视图。
3. **电气连接**：接口矩阵、兼容目标过滤、显式连接、CAN/RS485/ETH 网络状态。
4. **功能绑定**：Ability、FuncDesc、组件/连接引用和二次开发状态门。
5. **整车校验**：结构完整性、接口参数、总线拓扑、功能未决状态、标定清单和审计导出。

总成进度采用 `基座 → 轮组 → 动力反馈 → 感知安全 → 总线连接 → 验收`。该进度由当前模型计算，只是只读审计投影。

### 3.2 游戏化元素的边界

- 准备和标定使用可勾选任务清单与完成度反馈。
- 清单状态只存在当前 UI 会话，不写入 Proto/CModel。
- 游戏化只帮助理解流程，不把人工勾选替代成设备实测或模型验收。

## 4. WebGL 三维装配方案

### 4.1 坐标系

- 车体中心地面为 `(0,0,0)`。
- `X+` 为前，`Y+` 为左，`Z+` 为上。
- 长对应 X，宽对应 Y，高/厚度对应 Z。
- Roll 绕局部 X，Pitch 绕局部 Y，Yaw 绕局部 Z；Euler 顺序为 `XYZ`。
- 全局轴和选中部件局部轴均采用 X 红、Y 绿、Z 蓝。

### 4.2 几何来源

- 底盘包络来自身份尺寸和底盘 Shape。
- 模块优先使用模板/模型中的 BOX、CYLINDER、SPHERE 等包络尺寸。
- 缺失几何只能使用明确标注的视图 fallback，不反向写入模型。
- 驱动轮按照滚动面 XZ、轮轴 Y 表达；舵轮增加轮毂、支架、回转盘和局部 `+X` 朝向箭头。

### 4.3 四舵轮

当 `driveType=QUAD_STEER` 或存在不少于四个 DRIVEWHEEL 时，四个无位姿/重复位姿轮组的只读槽位为：

```text
左前 (+X,+Y)    右前 (+X,-Y)
左后 (-X,+Y)    右后 (-X,-Y)
```

项目中没有权威的 `STEER_WHEELS_QUAD` 复合模板，因此界面不再显示虚构模板名；四套舵轮仍需从真实模块模板逐个实例化并分别建立动力、电气和控制关系。

### 4.4 半透明底盘

| 模式 | 外壳透明度 | 用途 |
|---|---:|---|
| 半透整车 | 0.42 | 保留完整外形并查看内部 |
| 内部透视 | 0.22 | 审核电池、主控、驱动与传感器 |
| 轮组总成 | 0.12 | 聚焦轮组、驱动、电机与反馈 |
| 工程爆炸 | 0.34 | 审核层级和未定位模块 |

外壳使用 `transparent=true`、`depthWrite=false`；内部不透明器件先绘制，外壳和轮廓后绘制。该处理解决了“降低 opacity 但内部仍被深度缓冲遮挡”的问题。

### 4.5 交互

- 装配透视、顶视 XY、前视 YZ、侧视 XZ。
- 拖拽旋转、右键平移、滚轮和按钮缩放。
- 点击部件同步选中装备清单与详情面板。
- HUD 显示选中部件源 XYZ/RPY 和局部坐标说明。
- 位姿输入采用明确提交：填写草稿后点击“保存结构关系与位姿”才写入模型并更新 3D。

## 5. 电气连接、总线与节点

### 5.1 接口数据

- 接口参数统一通过 `interfaceParams.interfaceParamsArray` 读写。
- 旧键 `canId/baudRate/ipAddress` 只在边界映射为 `nodeId/baudrate/ip`。
- 未在模板中声明的参数不会被前端追加到官方数组。

### 5.2 连接与网络状态

- 目标模块/接口按类型和 DI/DO 方向过滤。
- 网络状态只由显式 `linkedInterfaceUuid` 构建，不根据接口名称虚构总线。
- CAN 校验模板允许的 baudrate、`nodeId=1..127`、同一已连接总线的波特率一致性与节点重复。
- RS485 校验模板允许的 baudrate；模板未定义 stationId 时明确 unresolved。
- ETH 按点对点连接表达并检查 IP 字段。
- 终端电阻、电源分支、现场协议、真实网段等没有来源时继续 unresolved。

## 6. 功能配置与二次开发

- Ability 和 FuncDesc 原始内容保留，不由前端生成虚构关系。
- `related*` 关联缺失、目标丢失或 FuncDesc 无硬件引用时进入审计报告。
- 机构、第三方通信、人机交互和任务互锁分别显示脚本/API/反馈状态门。
- Wiki `SecDevInterface` 说明运行期设备能力，但不等价于本项目的 CModel HTTP API；两类协议不混用。

## 7. 完整性审计与导出

新增领域审计覆盖：

- 重复组件 ID、重复/缺失接口 UUID。
- 悬空接口链接、失效父节点和父子循环。
- 非有限或缺失的六轴安装位姿。
- 接口参数、CAN/RS485 总线一致性与节点重复。
- 轮半径、电机关联、舵轮编码器关联等模板字段。
- Ability/FuncDesc 未决或丢失引用。

审计页可以导出独立的 `amr-studio.audit-report.v1` JSON，包含来源、统计、逐条诊断、组件/接口索引和连接摘要；该报告独立于配置和 CModel。

## 8. 前端代码结构

| 领域 | 主要文件 |
|---|---|
| 造车工作流与装备工坊 | `components/wizard/EquipmentWorkshopStep.tsx` |
| WebGL 装配空间 | `components/wizard/EquipmentWebGLScene.tsx` |
| 电气接口矩阵 | `components/wizard/ElectricalInterfaceMatrixStep.tsx` |
| 审计与报告 | `components/wizard/AuditStep.tsx` |
| 属性与接口参数 | `components/wizard/ComponentPropertyPanel.tsx` |
| 装配只读投影 | `store/domain/assembly.ts` |
| 电气连接与总线 | `store/domain/electrical.ts` |
| 模型完整性 | `store/domain/integrity.ts` |
| 接口参数数组 | `store/domain/interfaceParams.ts` |
| 功能过程状态 | `store/domain/functions.ts` |
| 实例化、删除与持久化 | `store/useProjectStore.ts` |
| 导入/导出边界 | `store/ImportService.ts`、`services/ExportService.ts` |

## 9. 数据流

```text
Proto / CModel / 模块模板
  → ImportService
  → Zustand RobotConfig
     ├─ 装配域只读投影
     ├─ 电气/总线只读投影
     ├─ 完整性与功能审计
     └─ Three.js WebGL 视图
  → ExportService
  → /api/v1/models/{id}/compile
  → CModel
```

视图投影不参与导出；模型字段只有在用户执行明确编辑动作后才更新。

## 10. 当前验证证据

- 前端 `npm run build` 通过，Three.js 已进入生产 bundle。
- 生产页面五阶段可进入，模块库、装配树、总线状态、功能门和审计页可见。
- WebGL 四视角、四种工作模式、缩放、选中与单 canvas 生命周期通过。
- XYZ 正负方向、Z 高度、Yaw 朝向和局部坐标 HUD 通过生产交互验证。
- 四舵轮临时场景达到 `4/4`，透视和顶视展示通过。
- 半透明底盘本地和生产视觉检查通过，内部器件可见。
- 最新 Cloudflare 版本：`baff185f-a43c-43a1-8be6-57a2a729c0cc`。

## 11. GitHub 同步范围

本次提交只包含：

- 前端实现源码和 Three.js 依赖清单。
- 装配、电气、完整性、接口参数和功能领域辅助模块。
- 本方案及与新前端直接相关的实现/验证报告。

明确不包含：

- 后端运行日志、前端运行日志、浏览器测试结果目录。
- `saved_projects`、`user_saves` 和现场/测试生成 CModel 数据。
- 分析 CSV、临时 scratch、归档压缩包和其他项目的日志分析文件。
- 与本次前端方案无关的后端、Worker 和测试实验改动。

## 12. 尚未解决的问题

1. 缺少官方四舵轮复合模板；前端展示能力不等于动力/电气/控制关系完整。
2. 部分模块只有包络尺寸，没有可追溯的 GLTF/GLB/CAD 资产。
3. 位姿输入尚无“未保存草稿”实时预览，必须点击保存后更新 3D。
4. 真实 CAN/RS485 终端、站号、电源、协议、网段和现场标定结果仍需项目资料。
5. FuncDesc 当前没有足够字段表达完整的组件/连接/反馈运行关系。

这些问题不阻塞前端方案发布，但会阻塞真实车辆的最终工程放行。
