# AMR Studio V4 — 模块深度理解文档
**用于指导前端界面设计（基于官方 ModuleLibrary PrivateAttribute.json 的完整分析）**

---

## 第一章：模块体系总览

### 1.1 模块分类体系

从 77 个 `Pri_Attr` 目录分析，模块按功能可分为以下大类：

| 类别 | 包含模块 | 前端 category 值 |
|------|---------|----------------|
| **底盘** | `diffChassis`、`steerChassis` | `CHASSIS` |
| **驱动轮组** | `diffWheel`、`diffSteerWheel`、`horizontalSteerWheel`、`verticalSteerWheel`、`weakSteerWheel`、`weakTurnWheel` | `DRIVEWHEEL` |
| **驱动器** | `subDriver`、`HYD` | `DRIVER` |
| **电机** | `PMSMMotor`、`BLDCMotor`、`BDCMotor` | `MOTOR` |
| **编码器（传感器子类）** | `incrementalEncode`、`absoluteValueEncode`、`ABZEncode`、`pullWireEncode` | `SENSOR` (子类) |
| **执行器（附件）** | `lift`、`linear`、`rotate`、`servo`、`carrier`、`clamp`、`charge` | `ACTOR` |
| **传感器** | `laser`、`3DLaser`、`TOF`、`TOFCamera`、`ultrasonicSensor`、`camera`、`gyro`、`RFID` | `SENSOR` |
| **IO 与控制** | `IOModule`、`PIO`、`subMainCPU`、`subDriver`、`subIntergratedController` | `CONTROL` / `IO_BOARD` |
| **电池与能量** | `subBattery`、`power`、`powerController`、`prechargeController` | `BATTERY` |
| **通信** | `WIFI`、`WAPI`、`fifthGeneration`、`bluetooth`、`ethernetSwitch` | `COMMUNICATION` |
| **显示交互** | `subScreen`、`lamp`、`warningLight`、`segDisplays`、`audioOut`、`subButton` | `DISPLAY` |

---

## 第二章：底盘模块深度分析

### 2.1 diffChassis（差速底盘）vs steerChassis（舵轮底盘）

两者属性结构**完全一致**，均包含三个属性组：

```
privateAttrs:
├── motionCenterAttr（运动中心参数）  ← 8 个：头/尾/左/右 × 空载/满载
├── chassisAttr（底盘参数）            ← 18+ 个参数
└── wheelsAttr（轮组属性）            ← 轮间距 + 3个坐标（全部 boolHide=true）
```

#### 关键差异点

| 属性 | diffChassis | steerChassis |
|------|------------|-------------|
| `motionCenterAttr` 中 `boolNoeditable` | **全部 `true`** | **全部无此字段（允许编辑）** |
| `wheelsAttr` 中 `wheelSpace` | **有**（标准差速轮距） | **无**（舵轮底盘轮距由舵轮自定义） |

#### UI 设计要点

1. **`motionCenterAttr` 组**：在"底盘参数"界面提取显示，使用户无需进入组件详情即可修改。
   - `diffChassis` 中标注了 `boolNoeditable: true`，但这是 CModel 层级约束，**前端应该允许编辑**（该字段的含义是"从 UI 反向写入不可能被后台覆盖"，不是禁止用户填写）。
2. **`chassisAttr` 组**：核心参数，全部需要前端呈现。注意以下字段是 `boolHide: true`，**不应在 UI 显示**：
   - `maxClimbingAngle`（爬坡能力）
   - `totalLoadWeight`（额定负载）
   - `selfWeight`（自重）
3. **`wheelsAttr` 组**：全部字段均为 `boolHide: true`，**整个分组不在 UI 中显示**，由系统内部计算填充。

---

## 第三章：轮组模块深度分析

### 3.1 轮组类型一览表

| 模块类型 | 描述 | 行走电机引用 | 转向电机引用 | 转向传感 |
|---------|------|------------|------------|---------|
| `diffWheel` | 差速从动轮（单侧独立驱动） | 1个 `relateMotor` | 无 | 无 |
| `diffSteerWheel` | 差速舵轮（带差速+转向） | `relateLeftMotor` + `relateRightMotor` | 无（差速实现转向） | **仅外置绝对值编码器**（实际工程不采用外置增量方式） |
| `horizontalSteerWheel` | 卧式舵轮（水平安装） | 1个 `relateWalkMotor` | 1个 `relateRotMotor` | 内置绝对/内置增量（取决于电机选型，默认内置绝对） |
| `verticalSteerWheel` | 立式舵轮（垂直安装） | 1个 `relateWalkMotor` | 1个 `relateRotMotor` | 内置绝对/内置增量（与卧式模型属性一致，仅安装方式不同） |
| `weakSteerWheel` | 弱舵轮（无行走、仅转向） | 无 | 无 | 外置增量编码器（需2个） |

### 3.2 轮组属性组结构完整对比

```
所有舵轮类（horizontalSteerWheel / verticalSteerWheel）:
├── wheelAttr（基本属性）
│   ├── wheelRadius（轮半径，必填，boolBasic=true）
│   ├── angleLmtPos（正限位角度，0~175°）
│   ├── angleLmtNeg（负限位角度，-175~0°）
│   └── rotOmgLmt（转向能力最大角速度，boolHide=true）
├── angleSensor（转向反馈）— 类型选择复杂，见下节
└── linkMotorAttr（电机关联）
    ├── relateRotMotor（转向电机，fixedSource: driver/PMSMMotor）
    └── relateWalkMotor（行走电机，fixedSource: driver/PMSMMotor）

diffSteerWheel:
├── wheelAttr
│   ├── wheelRadius（必填）
│   ├── wheelSpace（差速轮距，与底盘的 wheelSpace 含义相同）
│   ├── angleLmtPos / angleLmtNeg
│   └── rotOmgLmt（boolHide）
├── angleSensor（转向反馈，含外置增量/ABZ/绝对）
└── linkMotorAttr
    ├── relateLeftMotor
    └── relateRightMotor

diffWheel:
├── wheelAttr（只有 wheelRadius）
└── linkMotorAttr（只有 relateMotor）
```

### 3.3 转向反馈（angleSensor）的条件分支逻辑

> [!IMPORTANT]
> **`angleSensor` 是前端最复杂的属性组。其结构是嵌套的条件分支，不同的 `angleSensorType` 选项会激活不同的子属性。前端必须实现动态字段展示逻辑。**

#### horizontalSteerWheel / verticalSteerWheel 的 angleSensorType 选项

> [!TIP]
> 立式和卧式舵轮除安装方式不同外，模型属性完全一致。实际工程中一般采用内置绝对或内置增量编码器（取决于电机选型），前端应**默认选择内置绝对式编码器（`GROUP_CALI_ABS_INTERNAL`）**。

| 选项 Key | 选项描述 | 默认？ | 激活的子属性 |
|---------|---------|-------|------------|
| `GROUP_CALI_ABS_INTERNAL` | 绝对式编码器（内置） | **✅ 默认** | **无子属性**（内置，无需关联外部传感器） |
| `GROUP_CALI_ABS_EXTERNAL` | 绝对式编码器（外置） | | `relatedEncode`（关联 `absoluteValueEncode`）+ `gearRatio`（减速比，隐藏） |
| `GROUP_CALI_HELM_IO` | 增量编码器（内置） | | `relatePosIo`、`relateNegIo`、`relateAngleZero`（关联 `proximitySensor`或`PT`）+ `angleDeviationZero`（隐藏）+ `detectModeZero`（隐藏） |

#### diffSteerWheel 的 angleSensorType 选项

> [!WARNING]
> **工程约束**：差速舵轮在实际应用中**一定采用外置绝对值编码器**，不存在外置增量编码器的采用方式。虽然 JSON schema 中列出了 `GROUP_CALI_INC_EXTERNAL` 选项，但前端应**隐藏该选项**，仅保留 `GROUP_CALI_ABS_EXTERNAL` 和 `GROUP_CALI_INC_ABZ`。

| 选项 Key | 选项描述 | 前端处理 | 激活的子属性 |
|---------|---------|---------|------------|
| ~~`GROUP_CALI_INC_EXTERNAL`~~ | ~~增量编码器（外置）~~ | **⛔ 隐藏**（工程上不采用） | — |
| `GROUP_CALI_INC_ABZ` | 磁栅编码器（ABZ） | 显示 | `relatedEncode`（关联 `ABZEncode`）+ `zToZeroAngle`（Z 信号偏差，隐藏） |
| `GROUP_CALI_ABS_EXTERNAL` | 绝对式编码器（外置） | **✅ 默认** | `relatedEncode`（关联 `absoluteValueEncode`）+ `gearRatio`（隐藏） |

#### 前端 UI 响应设计

```
when (angleSensorType changes):
    if GROUP_CALI_ABS_INTERNAL → 隐藏所有子字段
    if GROUP_CALI_ABS_EXTERNAL → 显示 [编码器选择框: absoluteValueEncode列表]
    if GROUP_CALI_HELM_IO      → 显示 [IO选择框(x3): proximitySensor/PT列表]
    if GROUP_CALI_INC_EXTERNAL → 显示 [编码器选择框: incrementalEncode列表] + [IO选择框(x3)]
    if GROUP_CALI_INC_ABZ      → 显示 [编码器选择框: ABZEncode列表]
```

---

## 第四章：驱动器模块深度分析

### 4.1 subDriver（通用驱动器）

属性组：`boardAttr（控制板属性）`

| 属性 | 类型 | 显示 | 说明 |
|------|------|------|------|
| `chipPlatform` | DATA_STRING | **隐藏** | 芯片平台，系统内部填写 |
| `softwareSpec` | DATA_STRING | **条件显示** | ⚠️ **仅当 `type` 选择 `MOTOR_SERVO_TYPE_HIK`（自研驱动器）时显示且必填**；其他驱动类型下隐藏，值默认为 `"NONE"` |
| `inputVoltage` | DATA_DOUBLE, 24V | **隐藏** | 输入电压 |
| `inputCurrent` | DATA_DOUBLE, 0.5A | **隐藏** | 输入电流 |
| `overloadCapacity` | DATA_DOUBLE, 1.5倍 | **隐藏** | 过载能力 |
| `overloadTime` | DATA_DOUBLE, 3S | **隐藏** | 过载时长 |
| `type` | DATA_COMBOX | **显示** | 驱动类型选择（见下表）— 此选项变更时联动 `softwareSpec` 的可见性 |

#### 驱动类型（type 字段的 comboType 枚举）

| Key | 描述 |
|-----|------|
| `MOTOR_SERVO_TYPE_AUTO` | 伺服自动获取 |
| `MOTOR_SERVO_TYPE_STANDARD` | 标准 CANOPEN 驱动器 |
| `MOTOR_SERVO_TYPE_ELMO` | ELMO 驱动器 |
| `MOTOR_SERVO_TYPE_HIK` | 自研驱动器 |
| `MOTOR_SERVO_TYPE_SENCHUANG` | 森创驱动器 |
| `MOTOR_SERVO_TYPE_CURTIS` | 柯蒂斯驱动器 |
| `MOTOR_SERVO_TYPE_ZAPI` | zapi 驱动器 |
| `MOTOR_SERVO_TYPE_KINCO` | 步科驱动器 |
| `MOTOR_SERVO_TYPE_SIHENG` | 四宏(横)电机 |
| `HYD_DRIVER_TYPE` | 液压驱动器 |

> [!NOTE]
> 驱动器本身**没有编码器**，不包含任何编码器相关属性。编码器属性归属于电机模块（`PMSMMotor.ENCType`）。

---

## 第五章：电机模块深度分析

### 5.1 电机类型对比

| 特征 | PMSMMotor | BLDCMotor | BDCMotor |
|------|-----------|-----------|---------|
| 适用场景 | 伺服/舵轮驱动 | 无刷 DC 电机 | 有刷 DC 电机 |
| 速度字段 | `RPM`（额定转速） | 无此字段 | `ratedSpeed`（额定转速） |
| 抱闸字段 | `bHbrake`（BOOL） | 同 PMSM | `bHbrake`（COMBOX，可选有无并+额定电压） |
| 编码器字段 | `ENCType`（複雜） | 相同 | `ENCType`（简化，仅 NULL/INC） |
| 电压字段 | 无 | 无 | 有 `ratedVolt`、`powerVolt` |
| 加减速字段 | `defaultAcc/Dec`、`maxAcc/Dec`（隐藏） | 相同 | 无 |

### 5.2 PMSMMotor 编码器（ENCType）条件分支

> [!IMPORTANT]
> **`ENCType` 是电机模块中最重要的条件属性，它决定了测速机制和子参数。**

> [!WARNING]
> **工程约束**：伺服电机（PMSMMotor）**必须选择编码器类型**（即不允许选择 `ENCODER_NULL`）。前端应隐藏“无”选项，默认选择 `ENCODER_INC`（增量式编码器）。

| ENCType Key | 描述 | 前端处理 | 激活子属性 |
|------------|------|---------|--------|
| ~~`ENCODER_NULL`~~ | ~~无编码器~~ | **⛔ 隐藏**（PMSM必须有编码器） | — |
| `ENCODER_INC` | 增量式编码器 | **✅ 默认** | `encoderLine`（线数。**前端优化**：虽然 JSON 中为 DATA_INT32 自由输入，但实际工程常用值为 **2500 / 3000 / 4000**，前端应渲染为下拉选择框供用户快选，同时允许手动输入，JSON 中仍存储数值） |
| `ENCODER_MULTI_TURN_ABS` | 多圈绝对式 | 显示 | `sglTurnBit`（单圈位数）+ `multiTurnBit`（多圈位数） |
| `ENCODER_SGL_TURN_ABS` | 单圈绝对式 | `sglTurnBit`（单圈位数） |

### 5.3 PMSMMotor 完整属性显示规则

| 属性 | 显示？ | 填写要求 |
|------|--------|--------|
| `ENCType`（编码器类型） | ✅ 显示 | 必填，含条件子属性 |
| `initMode`（电机初始状态） | ❌ 隐藏 | 有默认值 FREERUN |
| `RPM`（额定转速） | ✅ 显示 | 必填 |
| `bTemper`（是否支持温度） | ❌ 隐藏 | 默认 false |
| `bHbrake`（是否带抱闸） | ✅ 显示 | 无隐藏标记 |
| `bReverse`（是否反向） | ❌ 隐藏 | 默认 false |
| `torque`（额定扭矩） | ✅ 显示 | 无必填标记 |
| `gearRatio`（减速比） | ✅ 显示 | 默认 1 |
| `ratedCurr`（额定电流） | ✅ 显示 | 无必填 |
| `overCurrCoef`（过流系数） | ✅ 显示 | 无必填 |
| `defaultAcc`（默认加速度） | ❌ 隐藏 | 默认 0 |
| `defaultDec`（默认减速度） | ❌ 隐藏 | 默认 0 |
| `maxAcc`（最大加速度） | ❌ 隐藏 | 默认 0 |
| `maxDec`（最大减速度） | ❌ 隐藏 | 默认 0 |

---

## 第六章：编码器模块深度分析

### 6.1 编码器是独立模块，归属于传感器大类

需要特别注意：**编码器是独立的传感器节点**，不是电机或驱动器的一部分！

> [!IMPORTANT]
> **`isInvert`（是否反向）** 是所有编码器类型的通用属性。其物理含义是：当设为 `true` 时，编码器数值增加方向对应着物理运动的反方向（例如编码器数值增长对应着实际的右转/减少方向）。该字段用于修正编码器安装方向与系统预期方向不一致的情况。

| 编码器类型 | 对应模块 | 关键属性 | `isInvert` |
|---------|---------|---------|------------|
| 增量式 | `incrementalEncode` | `lineCount`（线数，必填，常用值 2500/3000/4000）| ✅ 有（`boolBasic: true`） |
| 绝对值（多协议） | `absoluteValueEncode` | `absEncodeType`（协议：SSI/电机/CANOPEN/CAN_BRT）+ `resolutionMode`（位数或数值模式） | ✅ 有（`boolMustfill: true`） |
| 磁栅 ABZ | `ABZEncode` | `lineCount`（线数，必填） | ✅ 有（`boolBasic: true`） |
| 拉线 | `pullWireEncode` | `wheelCirc`（轮周长）+ `absEncodeType` + `resolutionMode` | ✅ 有（`boolMustfill: true`） |

### 6.2 编码器与轮组/电机的关联关系

```
🔗 当轮组的 angleSensorType 选用"外置"编码器时：
    轮组.angleSensor.relatedEncode → 指向一个独立的编码器传感器节点的 UUID
    编码器节点独立存在于传感器列表中

🔗 当电机的 ENCType 选用增量/绝对编码器时：
    电机.ENCType 内置子属性（encoderLine / sglTurnBit 等）直接描述编码器规格
    此时不指向外部编码器节点，而是在电机内部自描述
```

> [!WARNING]
> **这是一个常见误区：电机内置的编码器参数（`encoderLine`、`sglTurnBit`）是参数字段，而非对外部编码器节点的引用。外部编码器节点只在轮组转向反馈（`angleSensor`）中通过 `DATA_FIXED_E` 进行跨节点引用。**

---

## 第七章：模块间关联关系图

### 7.1 动力链关联关系

```
底盘 (CHASSIS)
└── 包含 N 个轮组节点（由 wheelsNum 决定）

轮组 (DRIVEWHEEL)
├── linkMotorAttr.relateWalkMotor → 电机节点UUID (driver/PMSMMotor)
├── linkMotorAttr.relateRotMotor  → 电机节点UUID (driver/PMSMMotor) [仅舵轮]
└── angleSensor.relatedEncode     → 编码器节点UUID [仅外置传感器模式]

电机 (MOTOR)
└── ENCType 内置编码器参数（不引用外部节点）

传感器/编码器 (SENSOR - encode subtypes)
└── 被轮组的 angleSensor.relatedEncode 引用

驱动器 (DRIVER)
└── 无直接引用关系（间接通过电机子类协调）
```

### 7.2 DATA_FIXED_E 类型说明

`DATA_FIXED_E` 是一种特殊的引用类型，其 `fixedSource` 字段指定了可供选择的组件类型路径：

| fixedSource 值 | 含义 |
|--------------|------|
| `"driver/PMSMMotor"` | 从电机类型为 PMSMMotor 的组件中选择 |
| `"sensor/incrementalEncode"` | 从增量编码器传感器中选择 |
| `"sensor/absoluteValueEncode"` | 从绝对值编码器传感器中选择 |
| `"sensor/ABZEncode"` | 从 ABZ 磁栅编码器中选择 |
| `"sensor/proximitySensor"` | 从接近传感器（限位开关）中选择 |
| `"sensor/PT"` | 从光电传感器中选择 |

---

## 第八章：前端 UI 设计指导规范

### 8.1 属性可见性规则汇总

| 规则 | 描述 |
|------|------|
| `boolHide: true` | **绝对不渲染**，但必须在 JSON 中保留默认值 |
| `boolMustfill: true` + 无 `boolHide` | 必填字段，前端标记 * 或红色标注 |
| `boolBasic: true` | 基础信息，优先展示（可用于折叠面板默认展开项） |
| `boolNoeditable: true` | 渲染但禁止编辑（灰色只读显示） |
| `DATA_FIXED_E` 类型 | 渲染为下拉选择器，选项来源为项目内同类型组件列表 |
| `DATA_COMBOX` 类型 | 渲染为下拉选择器，选项来源为 `comboType.typeGroups` |
| `arrayCmobEle` 存在 | 选中该选项后，动态显示其子属性字段 |

### 8.2 组件创建时的 Avalanche 自动绑定规则

当用户在添加轮组时，系统应**自动创建**关联组件并填充绑定：

```
用户选择"添加 horizontalSteerWheel":
1. 创建轮组节点（A）
2. 自动创建 PMSMMotor 节点（B：行走电机）
3. 自动创建 PMSMMotor 节点（C：转向电机）
4. 设置 A.relateWalkMotor = B.UUID
5. 设置 A.relateRotMotor = C.UUID

用户选择"添加 diffWheel":
1. 创建轮组节点（A）
2. 自动创建 PMSMMotor 节点（B：行走电机）
3. 设置 A.relateMotor = B.UUID

用户选择"添加 diffSteerWheel":
1. 创建轮组节点（A）
2. 自动创建 PMSMMotor 节点（B：左行走电机）
3. 自动创建 PMSMMotor 节点（C：右行走电机）
4. 设置 A.relateLeftMotor = B.UUID
5. 设置 A.relateRightMotor = C.UUID
```

### 8.3 编码器选择的 UI 条件交互规范

```
电机(PMSMMotor) 属性面板：
  ENCType 下拉框变化时：
    if ENCODER_INC → 显示 [encoderLine 选择/输入框, 预设值: 2500/3000/4000]
    if ENCODER_MULTI_TURN_ABS → 显示 [sglTurnBit + multiTurnBit 输入框]
    if ENCODER_SGL_TURN_ABS → 显示 [sglTurnBit 输入框]
    if ENCODER_NULL → 隐藏所有子字段

驱动器(subDriver) 属性面板：
  type 下拉框变化时：
    if MOTOR_SERVO_TYPE_HIK → 显示 [softwareSpec 输入框, 必填]
    else → 隐藏 softwareSpec, 值默认 "NONE"

舵轮(horizontalSteerWheel / verticalSteerWheel) 属性面板：
  angleSensorType 下拉框（默认选中 GROUP_CALI_ABS_INTERNAL）变化时：
    if GROUP_CALI_ABS_INTERNAL → 隐藏所有关联选择
    if GROUP_CALI_ABS_EXTERNAL → 显示 [absoluteValueEncode 组件选择器]
    if GROUP_CALI_HELM_IO → 显示 [proximitySensor/PT 组件选择器 × 3]

差速舵轮(diffSteerWheel) 属性面板：
  angleSensorType 下拉框（默认选中 GROUP_CALI_ABS_EXTERNAL, 隐藏 GROUP_CALI_INC_EXTERNAL）变化时：
    if GROUP_CALI_ABS_EXTERNAL → 显示 [absoluteValueEncode 组件选择器]
    if GROUP_CALI_INC_ABZ → 显示 [ABZEncode 组件选择器]
```

### 8.4 diffChassis 与 steerChassis 的 UI 差异

| 界面行为 | diffChassis | steerChassis |
|---------|------------|-------------|
| `wheelsAttr.wheelSpace` 展示 | **显示**（差速轮距，用户填写） | **不显示**（舵轮轮距由各舵轮独立维护） |
| `motionCenterAttr` 字段交互 | 渲染但建议只读（boolNoeditable=true） | 完全可编辑 |
| 电机配置提示 | 每轮1个行走电机 | 每轮1转向+1行走（共4个电机） |

### 8.5 BDCMotor 的特殊 UI 说明

`BDCMotor` 与 `PMSMMotor` 的主要 UI 差异：
- **无 `RPM`**，用 `ratedSpeed` 代替
- **`bHbrake` 是选择框**（带/不带抱闸），选择"带抱闸"后展示 `brakeVolt`（12V默认）
- **额外有 `ratedVolt`、`powerVolt`** 两个必填电压字段
- **无加减速隐藏字段**

---

## 第九章：附录 — 各类型轮组可关联编码器对照表

| 轮组类型 | 转向传感选项 | 可关联编码器类型 | UI 展示对应字段 |
|---------|-----------|--------------|-------------|
| horizontalSteerWheel | 内置绝对 | 无需外部 | 无 |
| horizontalSteerWheel | 外置绝对 | absoluteValueEncode | `relatedEncode` |
| horizontalSteerWheel | 增量内置+IO | 无外部编码器（限位IO） | `relatePosIo`, `relateNegIo`, `relateAngleZero` |
| verticalSteerWheel | 内置绝对 | 无需外部 | 无 |
| verticalSteerWheel | 外置绝对 | absoluteValueEncode | `relatedEncode` |
| verticalSteerWheel | 增量内置+IO | 无外部编码器（限位IO） | `relatePosIo`, `relateNegIo`, `relateAngleZero` |
| ~~diffSteerWheel~~ | ~~增量外置~~ | — | **⛔ 工程上不采用，前端隐藏** |
| diffSteerWheel | 磁栅ABZ | ABZEncode | `relatedEncode` + `zToZeroAngle` |
| diffSteerWheel | **外置绝对（默认）** | absoluteValueEncode | `relatedEncode` + `gearRatio`(隐藏) |
| weakSteerWheel | 增量外置 | incrementalEncode（主+副） | `relatedEncode` + `otherRelatedEncode` |
| diffWheel | 无转向传感 | 无 | 无 |
