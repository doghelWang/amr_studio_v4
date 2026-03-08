# AMR Studio Pro V4 — 详细设计说明书

> **文档版本**: V4.0 | **日期**: 2026-03-07  
> **适用范围**: 前后端所有模块详细实现规格

---

## 第一章：数据模型规格

### 1.1 完整 TypeScript 类型定义

```typescript
// store/types.ts

// ━━━━━━━━━━━━━━━━━━━━━━━━━ 枚举类型 ━━━━━━━━━━━━━━━━━━━━━━━━━

export type DriveType =
  | 'DIFFERENTIAL'       // 差速双驱
  | 'SINGLE_STEER'       // 单舵轮
  | 'DUAL_STEER'         // 双舵轮（前后）
  | 'QUAD_STEER'         // 四舵轮
  | 'MECANUM_4'          // 四轮麦克纳姆
  | 'OMNI_3'             // 三轮全向

export type WheelOrientation =
  | 'FRONT_LEFT' | 'FRONT_RIGHT'
  | 'REAR_LEFT'  | 'REAR_RIGHT'
  | 'FRONT_CENTER' | 'REAR_CENTER' | 'CENTER'

export type MotorPolarity = 'FORWARD' | 'REVERSE'

export type SensorType =
  | 'LASER_2D' | 'LASER_3D'
  | 'BARCODE' | 'CAMERA_BINOCULAR' | 'IMU'

export type ConnectionType = 'ETHERNET' | 'USB' | 'RS232' | 'SPI' | 'CAN'

export type NavigationMethod =
  | 'LIDAR_SLAM' | 'REFLECTOR' | 'NATURAL_CONTOUR'
  | 'VISUAL_SLAM' | 'BARCODE_GRID' | 'HYBRID'

// ━━━━━━━━━━━━━━━━━━━━━━━━━ 核心实体 ━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ProjectMeta {
  projectId: string;           // UUID v4
  projectName: string;         // 用户可改的项目名称
  createdAt: string;           // ISO 8601
  modifiedAt: string;          // ISO 8601
  author: string;              // 创建人（可选，用于文档头部）
  templateOrigin: string;      // 从哪个模板创建（'blank' | 模板ID）
  formatVersion: string;       // 文件格式版本号，用于向前兼容
}

export interface RobotIdentity {
  robotName: string;           // 型号名称，必填，≤ 64 chars
  version: string;             // ModelSet版本，格式 \d+\.\d+
  chassisLength: number;       // mm，100-5000
  chassisWidth: number;        // mm，100-3000
  navigationMethod: NavigationMethod;
  driveType: DriveType;
}

export interface McuConfig {
  model: string;               // 'RK3588_CTRL_BOARD' | 'X86_CTRL_PC' | ...
  canBuses: string[];          // 可用CAN总线ID列表，如 ['CAN0','CAN1','CAN2']
  ethPorts: string[];          // 可用以太网口列表，如 ['ETH0','ETH1']
}

export interface IoBoardConfig {
  id: string;
  label: string;               // 自动生成，如 'IO-STANDARD-1'
  model: string;               // 'STANDARD_IO_16CH' | 'COMPACT_IO_8CH' | ...
  canBus: string;              // 接入的CAN总线，必须在 mcu.canBuses 中
  canNodeId: number;           // 1-126，同总线内唯一
  channelCount: number;        // 根据model自动填入（16 / 8）
}

export interface WheelConfig {
  id: string;
  label: string;               // 自动生成，如 'Front Left'

  // 安装位置（结构参数）
  mountX: number;              // mm，相对底盘中心，+前 -后
  mountY: number;              // mm，相对底盘中心，+左 -右
  mountYaw: number;            // °，绕Z轴安装转角
  orientation: WheelOrientation;

  // 物理尺寸（运动学用）
  headOffset: number;          // mm，轮心到模块前端
  tailOffset: number;          // mm，轮心到模块后端
  leftOffset: number;          // mm，轮心到模块左端
  rightOffset: number;         // mm，轮心到模块右端

  // 电气参数
  driverModel: string;         // 'ELMO_GOLD' | 'CANOPEN_SERVO' | ...
  canBus: string;              // 接入的CAN总线
  canNodeId: number;           // 驱动器 CAN Node ID，1-126，同总线内唯一
  motorPolarity: MotorPolarity;

  // 运动学极限参数
  maxVelocity: number;         // mm/s，> 0
  maxAcc: number;              // mm/s²，> 0
  maxDec: number;              // mm/s²，> 0
  // 以下仅舵轮有效（非舵轮时前端灰化，值忽略）
  zeroPos: number;             // 舵轮零位编码器值
  leftLimit: number;           // °，左转限位（通常 < 0）
  rightLimit: number;          // °，右转限位（通常 > 0）
}

export interface SensorConfig {
  id: string;
  label: string;               // 自动生成，如 '2D LiDAR (激光) #1'
  type: SensorType;
  model: string;               // 型号，依 type 选择

  // 安装位姿（6D）
  mountX: number;              // mm
  mountY: number;              // mm
  mountZ: number;              // mm，离地高度
  mountYaw: number;            // °，绕Z轴
  mountPitch: number;          // °，绕Y轴（3D雷达/相机有效）
  mountRoll: number;           // °，绕X轴（3D雷达/相机有效）

  // 功能声明
  usageNavi: boolean;          // 用于导航
  usageObs: boolean;           // 用于避障

  // 电气连接
  connType: ConnectionType;
  // Ethernet 专用
  ipAddress: string;           // IPv4格式，非空当 connType === 'ETHERNET'
  port: number;                // 1-65535
  ethPort: string;             // 接入的MCU网口，在 mcu.ethPorts 中

  // 串口专用（RS232/USB）
  baudRate?: number;           // 9600 | 19200 | 57600 | 115200 | ...
  serialPort?: string;         // '/dev/ttyUSB0' 等配置
}

export interface IOConfig {
  id: string;
  port: string;                // 物理端口标签，如 'DI_01'
  logicBind: string;           // 逻辑功能绑定，如 'SAFETY_IO_EMC_STOP'
  ioBoardId: string;           // 'direct'(MCU直连) 或 IoBoardConfig.id
}

// 完整机器人配置
export interface RobotConfig {
  identity: RobotIdentity;
  mcu: McuConfig;
  ioBoards: IoBoardConfig[];
  wheels: WheelConfig[];
  sensors: SensorConfig[];
  ioPorts: IOConfig[];
}

// 项目文件根结构
export interface AmrProject {
  formatVersion: '1.0';
  meta: ProjectMeta;
  config: RobotConfig;
  snapshots: ProjectSnapshot[];
}

export interface ProjectSnapshot {
  snapshotId: string;
  label: string;               // 用户可改的描述
  createdAt: string;           // ISO 8601
  config: RobotConfig;         // 完整配置快照
}
```

---

## 第二章：校验规则矩阵

| 规则ID                    | 严重级别  | 触发条件                                | 错误信息                         | 影响编译 |
| ------------------------- | --------- | --------------------------------------- | -------------------------------- | -------- |
| `CAN_ID_CONFLICT`         | ❌ ERROR   | 同一canBus内，两个设备的canNodeId相同   | `CAN{X} ID={N} 冲突: {A} 和 {B}` | 是       |
| `CAN_ID_OUT_OF_RANGE`     | ❌ ERROR   | canNodeId < 1 或 > 126                  | `Node ID必须在1-126范围内`       | 是       |
| `CAN_BUS_NOT_DECLARED`    | ❌ ERROR   | 设备引用的canBus不在mcu.canBuses中      | `{BUS} 未在MCU中声明`            | 是       |
| `ETH_IP_EMPTY`            | ❌ ERROR   | Ethernet传感器 ipAddress为空            | `Ethernet传感器必须填写IP地址`   | 是       |
| `ETH_IP_INVALID`          | ❌ ERROR   | ipAddress不符合IPv4格式                 | `IP格式无效`                     | 是       |
| `ETH_IP_CONFLICT`         | ❌ ERROR   | 两个传感器使用相同IP地址                | `IP {IP} 已被 {A} 使用`          | 是       |
| `ETH_PORT_NOT_DECLARED`   | ❌ ERROR   | 传感器引用的ethPort不在mcu.ethPorts中   | `{PORT} 未在MCU中声明`           | 是       |
| `ETH_PORT_OVERSUBSCRIBED` | ❌ ERROR   | 同一MCU网口被多个传感器绑定             | `{PORT} 被多个传感器占用`        | 是       |
| `REQUIRED_FIELD_EMPTY`    | ❌ ERROR   | 必填字段（robotName/version等）为空     | `{字段名}为必填项`               | 是       |
| `CAN_BUS_OVERLOADED`      | ⚠️ WARNING | 单条CAN总线设备数 > 8                   | `{BUS} 上设备数 {N}/8，建议拆分` | 否       |
| `STEER_ZERO_NOT_SET`      | ⚠️ WARNING | 舵轮 zeroPos == 0（未调零）             | `舵轮零位可能未调整`             | 否       |
| `SENSOR_NO_USAGE`         | ⚠️ WARNING | 传感器 usageNavi && usageObs 均为 false | `传感器未声明用途`               | 否       |
| `VERSION_FORMAT`          | ⚠️ WARNING | version不符合`\d+\.\d+`格式             | `建议使用 X.Y 格式版本号`        | 否       |
| `NO_SENSOR_FOR_NAV`       | ⚠️ WARNING | 无任何传感器声明 usageNavi=true         | `未声明导航传感器`               | 否       |

---

## 第三章：REST API 合约

### 3.1 POST `/api/v1/generate`

**请求体**:
```json
{
  "config": { /* RobotConfig 完整结构 */ }
}
```

**成功响应** (200):
- Content-Type: `application/zip`
- Body: ZIP 二进制文件
- Headers: `Content-Disposition: attachment; filename="{robotName}_ModelSet.zip"`

**失败响应** (422):
```json
{
  "error": "VALIDATION_FAILED",
  "issues": [
    { "code": "CAN_ID_CONFLICT", "message": "...", "location": "..." }
  ]
}
```

---

### 3.2 POST `/api/v1/validate`

服务端二次校验（与前端逻辑一致，用于编译前终态校验）

**请求体**: 同 generate

**成功响应** (200):
```json
{
  "isValid": true,
  "errors": [],
  "warnings": [
    { "code": "CAN_BUS_OVERLOADED", "message": "CAN0 上设备数 9/8", "location": "wheel:FL/canBus" }
  ]
}
```

---

### 3.3 POST `/api/v1/report/pdf`

**请求体**:
```json
{
  "config": { /* RobotConfig */ },
  "options": {
    "includeTitlePage": true,
    "includeElectricalList": true,
    "includeBlueprintDiagram": true
  }
}
```

**成功响应** (200):
- Content-Type: `application/pdf`
- Body: PDF 二进制

---

### 3.4 POST `/api/v1/report/bom`

**成功响应** (200):
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Body: Excel 二进制

**BOM 表格式**（每行）:

| 序号 | 零件类别  | 型号/规格        | 数量 | 连接方式 | 总线/网络地址     | 备注   |
| ---- | --------- | ---------------- | ---- | -------- | ----------------- | ------ |
| 1    | MCU 主控  | RK3588           | 1    | —        | —                 |        |
| 2    | IO 扩展板 | STANDARD_IO_16CH | 1    | CAN1     | ID:10             |        |
| 3    | 驱动器    | ELMO_GOLD        | 4    | CAN0     | ID:1-4            | 四舵轮 |
| 4    | 2D激光    | SICK_TIM561      | 2    | Ethernet | 192.168.1.100-101 |        |

---

### 3.5 GET `/api/v1/templates`

**响应** (200):
```json
{
  "templates": [
    {
      "id": "diff_drive",
      "name": "差速双驱",
      "description": "标准2轮差速AMR，适用于仓库搬运",
      "driveType": "DIFFERENTIAL",
      "wheelCount": 2,
      "thumbnailUrl": "/assets/templates/diff_drive.svg",
      "config": { /* 完整 RobotConfig 默认值 */ }
    }
  ]
}
```

---

## 第四章：模板库规格

### 内置模板完整清单

| ID              | 名称         | 驱动类型     | 轮数    | 默认传感器     | 适用场景     |
| --------------- | ------------ | ------------ | ------- | -------------- | ------------ |
| `diff_drive`    | 差速双驱     | DIFFERENTIAL | 2+2被动 | SICK_TIM561 ×1 | 仓库普通搬运 |
| `single_steer`  | 单舵轮       | SINGLE_STEER | 1+3被动 | SICK_TIM561 ×1 | 叉车改造     |
| `dual_steer_ff` | 双舵轮-前后  | DUAL_STEER   | 2+2被动 | SICK_TIM561 ×2 | 室内重载     |
| `quad_steer`    | 四舵轮       | QUAD_STEER   | 4       | SICK_TIM561 ×2 | 全向重载     |
| `mecanum_4`     | 麦克纳姆四轮 | MECANUM_4    | 4       | SICK_TIM561 ×1 | 全向轻载精密 |
| `blank`         | 空白项目     | —            | 0       | —              | 完全自定义   |

### 模板文件格式 (`/assets/templates/*.json`)

```json
{
  "templateId": "quad_steer",
  "schema": "v1",
  "config": {
    "identity": {
      "robotName": "Quad Steer AMR",
      "version": "1.0",
      "chassisLength": 1200,
      "chassisWidth": 800,
      "navigationMethod": "LIDAR_SLAM",
      "driveType": "QUAD_STEER"
    },
    "mcu": {
      "model": "RK3588_CTRL_BOARD",
      "canBuses": ["CAN0", "CAN1"],
      "ethPorts": ["ETH0", "ETH1"]
    },
    "wheels": [
      {
        "id": "w-fl", "label": "Front Left",
        "mountX": 450, "mountY": 350, "mountYaw": 0,
        "orientation": "FRONT_LEFT",
        "driverModel": "ELMO_GOLD",
        "canBus": "CAN0", "canNodeId": 1,
        "motorPolarity": "FORWARD",
        "maxVelocity": 1500, "maxAcc": 800, "maxDec": 800,
        "zeroPos": 0, "leftLimit": -90, "rightLimit": 90
      }
      /* ... 其余3个轮组 */
    ],
    "sensors": [
      {
        "id": "s-front", "label": "Front LiDAR",
        "type": "LASER_2D", "model": "SICK_TIM561",
        "mountX": 550, "mountY": 0, "mountZ": 200,
        "mountYaw": 0, "mountPitch": 0, "mountRoll": 0,
        "usageNavi": true, "usageObs": true,
        "connType": "ETHERNET",
        "ipAddress": "192.168.1.100", "port": 2112, "ethPort": "ETH0"
      }
    ],
    "ioBoards": [],
    "ioPorts": []
  }
}
```

---

## 第五章：画布交互状态机

### 5.1 2D 蓝图状态机

```
                  用户点"编辑模式"
   [VIEW_MODE] ──────────────────→ [EDIT_MODE_IDLE]
       ↑                                   │
       │  用户点"查看模式"                   │ 点击组件
       │                                   ↓
       └────────────────── [EDIT_MODE_SELECTED]
                                   │
                           按住鼠标 │
                                   ↓
                           [EDIT_MODE_DRAGGING]
                                   │
                           松开鼠标 │ → 写入Undo历史 → 同步Store
                                   ↓
                           [EDIT_MODE_SELECTED]
                                   │
                         点击旋转手柄 │
                                   ↓
                           [EDIT_MODE_ROTATING]
                                   │
                           松开鼠标 │ → 写入Undo历史 → 同步Store
                                   ↓
                           [EDIT_MODE_SELECTED]
```

### 5.2 Undo 操作粒度规则

| 操作                     | Undo 粒度                                       |
| ------------------------ | ----------------------------------------------- |
| InputNumber 输入框修改   | 失去焦点时合并（同字段同一次编辑合并为1条记录） |
| Select 下拉选择          | 立即记录                                        |
| 画布拖动                 | 鼠标释放时记录（完整的from→to）                 |
| 添加组件                 | 立即记录                                        |
| 删除组件                 | 立即记录                                        |
| 批量操作（切换驱动类型） | 作为1条原子操作记录                             |

---

## 第六章：工程报告 PDF 结构

```
页1: 扉页
  - 机器人型号、ModelSet版本、生成日期
  - 公司Logo位置（预留）

页2: 硬件配置摘要
  ┌─ MCU 信息表 ──────────────────────────────┐
  │  型号: RK3588_CTRL_BOARD                  │
  │  CAN总线: CAN0, CAN1, CAN2                │
  │  以太网口: ETH0, ETH1                     │
  └────────────────────────────────────────────┘
  ┌─ IO 扩展板 ────────────────────────────────┐
  │  标签 | 型号 | 总线 | 节点ID | 通道数       │
  └────────────────────────────────────────────┘

页3: 轮组驱动配置
  每个轮组独立表格（结构/电气/运动学参数三列）

页4: 传感器配置
  每个传感器: 型号、安装位姿6D参数、电气连接信息

页5: 2D 安装蓝图图纸
  SVG俯视图渲染为PNG，标注每个组件坐标

页6: 电气接线清单
  ┌──────────────────────────────────────────────────────┐
  │ 设备        │ 接口  │ 总线/网络 │ 地址    │ 连接到   │
  │────────────────────────────────────────────────────────│
  │ FL 驱动器   │ CAN   │ CAN0      │ ID:1    │ MCU      │
  │ Front LiDAR │ ETH   │ 192.168.1.100:2112 │ MCU ETH0│
  └──────────────────────────────────────────────────────┘
```

---

## 第七章：文件持久化详细设计

### 7.1 保存流程（Browser File System Access API）

```typescript
// services/projectFileService.ts

export async function saveProject(project: AmrProject): Promise<void> {
  // 更新修改时间
  project.meta.modifiedAt = new Date().toISOString();

  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });

  // 如果有已打开文件的 FileSystemFileHandle，直接写入
  if (currentFileHandle) {
    const writable = await currentFileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
  } else {
    // 弹出"另存为"对话框
    const handle = await window.showSaveFilePicker({
      suggestedName: `${project.meta.projectName}.amrproj`,
      types: [{ accept: { 'application/json': ['.amrproj'] } }]
    });
    currentFileHandle = handle;
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  }
}

// 自动保存草稿到 IndexedDB（每30秒）
export function startAutosave(getProject: () => AmrProject): void {
  setInterval(async () => {
    const project = getProject();
    await saveToIndexedDB('autosave_draft', project);
  }, 30_000);
}
```

### 7.2 启动时恢复逻辑

```
应用启动
    ↓
检查 IndexedDB 是否有未保存的 autosave_draft
    ↓ 有
弹出提示: "检测到上次未保存的配置，是否恢复？"
    ├── [恢复] → 加载草稿到 Store
    └── [放弃] → 清空草稿，显示 Home 页
    ↓ 无
直接显示 Home 页
```

---

## 第八章：V4 实现优先级

| 优先级 | 特性                           | 工作量估算      | 依赖    |
| ------ | ------------------------------ | --------------- | ------- |
| P0     | 项目文件保存/加载(.amrproj)    | 3天             | —       |
| P0     | 驱动类型切换确认框             | 0.5天           | —       |
| P0     | Undo/Redo（zundo集成）         | 2天             | P0保存  |
| P1     | 实时校验引擎（CAN冲突/IP校验） | 2天             | —       |
| P1     | 健康度仪表盘 + 内联错误提示    | 1天             | P1校验  |
| P1     | 模板库（6个内置模板）          | 1.5天           | —       |
| P2     | 2D蓝图可拖动编辑模式           | 3天             | P0 undo |
| P2     | Home 页（最近文件+模板选择）   | 1天             | P0文件  |
| P2     | 版本快照对比视图               | 2天             | P0保存  |
| P3     | PDF 工程报告导出               | 3天（含后端）   | —       |
| P3     | BOM Excel 导出                 | 1.5天（含后端） | —       |
| P3     | 底部总线负载状态栏             | 0.5天           | P1校验  |

**V4 总估算工作量**: ~21 人天（2-3 工程师 × 2 周）
