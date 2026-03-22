# AMR Studio V4 精细化产品需求文档 (PRD)

## 1. 产品愿景与核心理念
AMR Studio V4 旨在提供一个“所见即所得”的机器人构车平台。通过将复杂的 `.proto` 序列化逻辑抽象为直观的向导式流程，使工程师能够通过拖拽、选型、连线完成一台工业级 AMR 的全量配置。

### 1.1 核心原则
- **数据驱动**：所有组件的可选项均来自于已验证的离散模块库（Split Modules）。
- **原子化更新**：每次参数修改对应后端独立文件的一次 PATCH 更新，确保高并发下的数据一致性。
- **协议闭环**：导出的 `.cmodel` 必须 100% 兼容 312 系列控制器协议。

---

## 2. 核心参数 vs 非核心参数描述

### 2.1 核心参数 (Mission-Critical)
*影响运动控制、安全避障和通信链路的参数，必须在向导前序步骤中强制确认。*

| 分类 | 参数名称 | 业务影响 |
|---|---|---|
| **物理特性** | `box.size`(L/W/H) / `radius` | 决定机器人的碰撞包围盒 |
| **物理特性** | `headOffset` / `tailOffset` | 决定运动旋转中心（ kinematics core） |
| **安装位姿** | `locCoordX/Y/Z` / `ROLL/PITCH/YAW` | 传感器外参，直接影响感知精度和定位 |
| **驱动参数** | `reductionRatio` (减速比) / `wheelRadius` | 脉冲到线速度的转换系数 |
| **通信参数** | `nodeId` / `ip` / `baudrate` / `protocol` | 决定硬件节点是否能在线 |

### 2.2 非核心参数 (Auxiliary/Informational)
*辅助识别、UI 展示或固件元数据，可在后期“属性面板”中自由调整。*

| 分类 | 参数名称 | 业务影响 |
|---|---|---|
| **基本信息** | `module_alias` / `vender_name` | 仅用于工程师识别组件 |
| **UI 资产** | `module_icon` / `module_3d_icon` | 影响工作台 3D/2D 图标显示 |
| **固件元数据** | `chipPlatform` / `softwareSpec` | 记录硬件版本，不参与运行时逻辑运算 |
| **显示特性** | `boolHide` / `boolNoeditable` | 决定参数在用户界面是否可见 |

---

## 3. 构车全流程化设计 (9步走)

1.  **工程身份 (Identity)**:
    - 录入 `robotName`, `materialCode`。
    - 选择 `navigationMethod` (激光/视觉/二维码) 和 `driveType` (差速/舵轮/全向)。
2.  **底盘结构 (Chassis)**:
    - 定义底盘物理包络。
    - 设置运动中心偏移（空载/满载）。
3.  **骨架装配 (Hardware Tree)**:
    - 从库中选择并挂载 `MainController`。
    - 挂载 `IO Module`、`Driver`、`Lidar` 等。
4.  **空间标定 (Mounting)**:
    - 设置每个传感器相对于底盘中心的 6-DOF 位姿。
5.  **端口定义 (Port Config)**:
    - 配置物理端口参数（如 CAN 终端电阻、波特率；ETH 的端口模式）。
6.  **逻辑接线 (Wiring & Signal)**:
    - **总线链接**：将模块 UUID 关联到控制器的总线端口 UUID。
    - **IO 映射**：将 DI/DO 引脚关联到具体的功能（如：DI1 -> 急停信号）。
7.  **能力底座 (Ability)**:
    - 检查当前配置是否满足机器人的功能需求（如：导航能力是否关联了激光接口）。
8.  **全量审计 (Audit)**:
    - 冲突检查：UUID 重复、端口占用冲突、波特率不匹配。
9.  **编译导出 (Build)**:
    - 合并 JSON -> 序列化二进制 -> 修改时间戳 -> Repack ZIP -> `.cmodel`。

---

## 4. 关键接口与功能描述

### 4.1 接口资源管理 (Interface Handling)
- 界面需展示每个组件自带的“接口能力”（Bus Interface Ability），即它能出多少路 CAN、DI、DO。
- 连接时需校验类型匹配（CAN 只能接 CAN）。

### 4.2 双写一致性 (Protocol Robustness)
- 前端必须同时处理 `snake_case` 和 `camelCase` 字段，以兼容不同的原始数据源和后端转换逻辑。
- PATCH 请求需携带 UUID 以实现原子化修改。
