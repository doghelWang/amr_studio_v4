# AMR Studio V4：游戏式装备构车工坊设计与原型说明

日期：2026-08-14

## 1. 结论

已将原有“电气装配 / 安装坐标 / 接口连线”三个线性步骤收拢为 `装备工坊` 原型。交互主线变为：

```text
准备 → 结构装配 → 电气连接 → 功能绑定 → 整车校验
```

页面采用“底盘中心 + 功能装备栏 + 模块库 + 装备详情 + 电气连接”的布局。模块可以先从功能目标进入，再由真实 `schemaRegistry` 模块完成装配；界面默认展示“待定位”，不会把 UI 展示位置当成已确认模型数据。

## 2. Wiki 依据与产品转译

依据：

- [模型文件](https://wiki-control.rms.hikrobotics.com/zh/AMRController/3Basic-Knowledge/1Model-File)：模型由结构设计、电气连接、功能配置组成。
- [差速舵轮底盘构车 SOP](https://wiki-control.rms.hikrobotics.com/zh/AMRController/5Manufacturing-Guide/diffSteerWheelChassisSop)：资料准备、组件参数、整车接线、模块库、结构设计、电气连接、功能配置、模型校验、设备监控、调试。
- [舵轮底盘车构车 SOP](https://wiki-control.rms.hikrobotics.com/zh/AMRController/5Manufacturing-Guide/Double-steering-wheel-chassis-amr)：阶段性自检和里程碑闸门。
- [VCU 模型配置](https://wiki-control.rms.hikrobotics.com/zh/AMRController/5Manufacturing-Guide/vcu)：主控侧和 VCU 侧不是简单的“控制从属”，还要明确通信方式、协议和数据定义。
- [运动中心](https://wiki-control.rms.hikrobotics.com/zh/AMRController/3Basic-Knowledge/new-page)：运动中心是底盘运动学基准，不能因为 UI 方便而随意改写。
- [坐标系体系](https://wiki-control.rms.hikrobotics.com/zh/AMRController/3Basic-Knowledge/draft)：机器人坐标系、传感器坐标系和坐标变换是定位、导航、避障的基础。
- [设备 API 接口文档](https://wiki-control.rms.hikrobotics.com/zh/AMRController/7Development-Guide/Base/ApiDocument)：二次开发能力包含执行机构、状态、灯、相机、能源、传感器、按钮、音频及安全 API。

产品转译：

| Wiki 概念 | 工坊交互 | 数据落点 |
| --- | --- | --- |
| 资料准备 | 任务阶段“准备”与资料状态 | identity、模块库来源、审计信息 |
| 结构设计 | 底盘中心、装备标记、父子挂载、6-DOF 位姿 | `parentNodeUuid`、`mountX/Y/Z/Roll/Pitch/Yaw` |
| 电气连接 | 源模块/源接口 → 目标模块/目标接口 | `createConnection`、`linkedInterfaceUuid` |
| 功能配置 | 功能类别入口和后续能力绑定阶段 | Ability 配置，不在装配页伪造能力关系 |
| 模型校验 | 阶段完成度、待定位、未连接状态 | 领域校验结果和 Audit 页面 |
| VCU 二开 | 主控与控制板可在功能组中分别选择 | 真实模块类型、接口、协议属性；不新增猜测字段 |
| 设备监控/调试 | 后续阶段入口保留 | 在线状态、标定、脚本验证仍需接入控制器或日志 |

## 3. 游戏化设计原则

### 3.1 核心循环

```text
选择功能目标 → 发现可用装备 → 安装到车辆 → 指定坐标和父模块
→ 连接真实接口 → 解锁功能绑定 → 通过模型校验
```

每一步都产生可检查的状态，而不是只产生视觉反馈。

### 3.2 装备卡与功能卡分离

左侧的“行走与动力、定位与导航、避障与安全、能源与充电、主控与通信、声光与人机”是产品交互分组，不是 Proto 新枚举。实际模块类别、类型、接口和原始模型均从 `schemaRegistry` 解析。

### 3.3 底盘中心

底盘是场景中心，运动中心显示为坐标基准。已安装模块以 `mountX/mountY` 投影显示；零值或缺失仍标记为“待定位”，不代表确认安装在中心。

### 3.4 连接作为能力解锁条件

结构装上并不等于设备可用。连接区直接调用现有领域层 `createConnection`，由接口兼容性和点对点复用约束判断是否成功。连接失败要显示领域层原因。

## 4. 已实现原型

文件：

- `src/frontend/src/components/wizard/EquipmentWorkshopStep.tsx`
- `src/frontend/src/App.tsx`
- `src/frontend/src/index.css`

已实现：

1. 五阶段任务轨道和完成度计算。
2. 功能装备栏及已装配数量。
3. 底盘中心场景、运动中心和装备标记。
4. 从真实模块库选择模块，保留 `ImportService.mapEntityToComponent` 的原始映射。
5. 选择父模块、录入六自由度位姿并写入 `updateStructuralParam`。
6. 源组件/源接口到目标组件/目标接口的电气连接。
7. 已装配清单、定位状态、接口连接计数。
8. 模块库未加载或无法解析时显示 unknown/空状态，不用名称猜测模块。
9. 位置意图槽位（前部、后部、左右侧、顶部、中心）只根据当前底盘尺寸生成预览建议，点击后仍需确认六自由度坐标，不会把建议值伪装成模型默认值。
10. 坐标状态优先检查原始 `structParam` 是否显式包含坐标字段；显式配置为 0 与字段缺失分开处理。
11. 模块库加载失败时提供重新加载入口，避免空白页面掩盖后端/网络问题。
12. `fetchSchemas` 兼容当前 Python API 的顶层系统分组响应和带 `registry` 包装的部署响应，避免模块库契约差异导致装备卡片消失。

## 5. 当前边界与待开发项

- 当前阶段轨道是交互原型；“功能绑定、整车校验、设备监控、标定、业务功能测试”仍需逐步接入已有 Ability、Audit 和控制器/日志能力。
- 目前坐标场景为 2D 顶视投影，尚未引入真实 3D 模型、碰撞检测和安装槽位约束。
- 当前位置槽位是由底盘尺寸推导的装配意图预览，不是 Wiki 的正式安装规范；正式槽位规则仍待产品/机械数据确认。
- 功能组是 UX 分类规则；后续应由 Wiki/产品规范确认每个模块的正式功能归属，不能由名称推断。
- VCU 的通信方式、协议、数据定义应在模块属性和接口模型中显式呈现，不能只用“主控/从属”标签替代。
- 阶段闸门目前是前端状态提示，最终应由后端模型校验、Proto 字段完整性审计和在线设备状态共同决定。
- 需要补充端到端交互测试：动态模块库装配、父子层级 round-trip、接口连接 round-trip、导出 CModel、导入后状态恢复。

## 6. 验证

执行：

```bash
cd src/frontend && npm run build
```

结果：通过。Vite 仍有既有的大包体积提示，但未新增构建错误。页面级验证已确认：装备工坊可进入、阶段任务提示可切换、模块库失败时显示重试入口。
