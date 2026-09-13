# AMR Studio V4 深度重构与 OpenAMR 参考验证报告

日期：2026-08-15
范围：装备工坊、装配域投影、构建发布链路、生产页面回归
生产版本：`fada0f66-32e1-492c-9059-f07c120aaf62`

## 1. 重构依据

本轮参考了 OpenAMR 项目拆分后的硬件仓库，而不是把外部项目当作 AMR Studio 的 Proto 数据源：

- OpenAMR 已将平台拆分为硬件、软件和固件仓库；硬件仓库维护 CAD、BOM、电气和机械文档。
- 硬件机械文档采用 MMP.00 平台总成、MMP.02 基座、MMP.03 轮组、MMP.04 中心支架、MMP.07 激光雷达支架等总成层级。
- 轮组不是单一图标，而是驱动轮、轮轴/支撑、电机/减速、编码反馈和驱动器组成的可审计链条。
- 电气文档将电机驱动、编码器、控制器、总线和电源作为独立连接关系表达。

参考链接：

- [openAMRobot/openamr](https://github.com/openAMRobot/openamr)
- [openamr-platform-hw](https://github.com/openAMRobot/openamr-platform-hw)
- [机械 CAD 与总成](https://github.com/openAMRobot/openamr-platform-hw/tree/main/mechanical/cad)
- [机械 BOM](https://github.com/openAMRobot/openamr-platform-hw/blob/main/manufacturing/bom/mechanical-bom.md)
- [电气接线与引脚](https://github.com/openAMRobot/openamr-platform-hw/blob/main/electrical/wiring/wiring-pinout.md)

外部项目中的尺寸、器件型号和接线只作为参考资料；当前工程仍以用户 Proto、模块模板、显式父子关系和接口字段为事实来源。

## 2. 本轮构建过程重构

### 2.1 原流程问题

原有工坊的核心交互是“功能分类 → 平铺模块 → 中间视图 → 连接”，对真实造车过程中的基座、轮组总成、动力反馈、感知安全、总线和验收没有独立的构建语义。视觉分类也容易被误读为真实机械关系。

### 2.2 新流程

新增一条只读的总成审计进度：

`基座 → 轮组 → 动力反馈 → 感知安全 → 总线连接 → 验收`

该进度从当前 `ComponentConfig`、接口链接、驱动类型和审计结果计算，不写入 Proto、不修改 `parentNodeUuid`，并明确标记为“参考 MMP 层级 / 只读审计投影”。

构建写出链路保持不变：

`Zustand 配置 → ExportService/blueprint → Worker/Python 编译 → CompDesc/AbiSet/FuncDesc → .cmodel + 模块清单 + 审计产物`

本轮没有新增替代 Proto，也没有用 OpenAMR 参数覆盖工程数据。

## 3. 界面深度重构

### 3.1 总成树

新增 `src/frontend/src/store/domain/assembly.ts`：

- 以显式 `parentNodeUuid` 构建源层级树。
- 另建动力与反馈、感知与安全、电源与能源、主控与通信、其他装备五类只读视图分组。
- 视图分组不会回写模型，避免把人工审核分组伪装成源关系。
- 提供底盘、轮组、驱动器、电机、编码器、传感器、电源、主控、总线和待定位覆盖率。

装备工坊左侧新增“总成树 · MMP 参考”与覆盖率卡片，用户可直接看到：

- 当前驱动类型要求的轮组数量与已装轮组数量。
- 驱动器、电机、编码器是否形成完整链条。
- 当前已识别的总线连接数量。
- 仍未有明确位姿的模块数量。

### 3.2 3D 工作模式

中间装备区新增四个视图模式：

1. 实体整车：强调底盘外壳、前后面、侧面、轮舱和当前已装模块。
2. 半透明内部：降低外壳不透明度，便于查看电池、控制器、IO 和内部模块。
3. 轮组总成：收敛到驱动轮、驱动器、电机、反馈相关实体，适合检查底盘轮组。
4. 工程爆炸：使用只读视图偏移展示层级关系，不回写安装坐标。

未选中的模块名称默认隐藏，选中或悬停时才显示，避免界面继续变成漂浮标签集合。所有坐标仍来自 `mountX/Y/Z/Roll/Pitch/Yaw`；未定位模块才使用明确标注的“仅视图展开”锚点。

## 4. 验证结果

| 检查项 | 结果 | 证据 |
|---|---|---|
| 前端 TypeScript/Vite 构建 | PASS | `npm run build`，3190 modules transformed |
| Wrangler dry-run | PASS | 21 个静态资源，3 个新/修改资源 |
| 生产发布 | PASS | Cloudflare Worker version `fada0f66-32e1-492c-9059-f07c120aaf62` |
| 装备工坊页面加载 | PASS | `https://cloud-ai.work/?project=robot01&v=fada0f66` |
| 总成进度条 | PASS | 基座、轮组、动力反馈、感知安全、总线连接、验收均出现 |
| MMP 参考树 | PASS | 源层级与只读视图分组同时出现 |
| 四种 3D 工作模式 | PASS | `assembly-view-body/transparent/wheel/exploded` 逐一切换 |
| 阶段切换 | PASS | 结构装配、电气连接、功能绑定、整车校验均可进入 |
| 浏览器控制台错误 | PASS | 0 条 error |

## 5. 尚未闭环的问题

- 当前页面仍是类别/接口级工程视图，不等同于 OpenAMR 原生 CAD；真正的 STEP/网格资产接入需要明确资产版权、坐标系、单位和 Proto 模块与 CAD 零件的对应关系后再实施。
- 轮组链条当前按现有类别和显式数据索引，若源 CModel 没有明确电机、驱动器、编码器关系，页面只能显示覆盖率缺口，不能自动替用户建立关系。
- 总线状态已能从接口链接中统计，但 CAN/RS485 节点 ID、终端电阻、波特率和现场标定值仍需由模板或现场资料明确后才能进入可验证状态。
- 生产页面当前模块数据是在线注册表中的已有模型；外部 OpenAMR 参考器件没有被虚构录入。

## 6. 待办

1. 为每个真实项目建立“模块模板 ↔ CAD 零件/总成”的来源映射表。
2. 在 Proto 明确支持后，补充总线网络节点、节点 ID、速率、终端与电源分支的字段级审计。
3. 将轮组覆盖率与 `PowerTopologyPanel` 的完整轮组卡片合并为一个可操作的缺口处理入口。
4. 在拥有合法网格资产且完成单位/坐标校准后，再把 CSS 示意替换为可切换 CAD/网格预览。
