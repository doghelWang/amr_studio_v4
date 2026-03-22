# [Zero-Omission] AMR Module Attribute & Relationship Registry

This registry is the source of truth for all AMR modules, extracted forensically from the `ModuleLibrary`.

## Category: ACTOR

### Sub-Type: block
**Description**: 通用挡块执行机构

#### Private Attributes
**Group: blockAttr (挡块属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `structureForm` | 结构形式 |  | DATA_COMBOX | None |
| `drivingForm` | 驱动形式 |  | DATA_COMBOX | None |
| `transmissionRelationship` | 传动关系 |  | DATA_COMBOX | None |
| `totalSpeedRatio` | 总速比 |  | DATA_DOUBLE | None |
| `maximumSpeed (Idle)` | 最大线速度（空载） | mm/s | DATA_DOUBLE | None |
| `maximumAcceleration (Idle)` | 最大线加速度（空载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration (Idle)` | 最大线减速度（空载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumSpeed (Full Load)` | 最大线速度（满载） | mm/s | DATA_DOUBLE | None |
| `maximumAcceleration  (Full Load)` | 最大线加速度（满载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration  (Full Load)` | 最大线减速度（满载） | mm/s^2 | DATA_DOUBLE | None |
| `stroke` | 行程 | mm | DATA_DOUBLE | None |
| `load` | 负载 | kg | DATA_DOUBLE | None |

### Sub-Type: clamp
**Description**: 通用挡块执行机构

#### Private Attributes
**Group: clampAttr (夹持属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `structureForm` | 结构形式 |  | DATA_COMBOX | None |
| `drivingForm` | 驱动形式 |  | DATA_COMBOX | None |
| `transmissionRelationship` | 传动关系 |  | DATA_COMBOX | None |
| `lead` | 导程 | mm | DATA_DOUBLE | None |
| `totalSpeedRatio` | 总速比 |  | DATA_DOUBLE | None |
| `maximumSpeed (Idle)` | 最大线速度（空载） | mm/s | DATA_DOUBLE | None |
| `maximumAcceleration (Idle)` | 最大线加速度（空载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration (Idle)` | 最大线减速度（空载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumSpeed (Full Load)` | 最大线速度（满载） | mm/s | DATA_DOUBLE | None |
| `maximumAcceleration  (Full Load)` | 最大线加速度（满载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration  (Full Load)` | 最大线减速度（满载） | mm/s^2 | DATA_DOUBLE | None |
| `stroke` | 行程 | mm | DATA_DOUBLE | None |
| `load` | 负载 | kg | DATA_DOUBLE | None |

### Sub-Type: lift
**Description**: 通用举升机构

#### Private Attributes
**Group: liftAttr (举升属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `structureForm` | 结构形式 |  | DATA_COMBOX | None |
| `drivingForm` | 驱动形式 |  | DATA_COMBOX | None |
| `transmissionRelationship` | 传动关系 |  | DATA_COMBOX | None |
| `sensorMode` | 传感模式 |  | DATA_COMBOX | None |
| `lead` | 导程 | mm | DATA_DOUBLE | None |
| `totalSpeedRatio` | 总速比 |  | DATA_DOUBLE | None |
| `maximumSpeed (Idle)` | 最大线速度（空载） | mm/s | DATA_DOUBLE | None |
| `maximumAcceleration (Idle)` | 最大线加速度（空载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration (Idle)` | 最大线减速度（空载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumSpeed (Full Load)` | 最大线速度（满载） | mm/s | DATA_DOUBLE | None |
| `maximumAcceleration  (Full Load)` | 最大线加速度（满载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration  (Full Load)` | 最大线减速度（满载） | mm/s^2 | DATA_DOUBLE | None |
| `stroke` | 行程 | mm | DATA_DOUBLE | None |
| `load` | 负载 | kg | DATA_DOUBLE | None |

### Sub-Type: linear
**Description**: 通用线性执行机构

#### Private Attributes
**Group: linearAttr (线性属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `structureForm` | 结构形式 |  | DATA_COMBOX | None |
| `drivingForm` | 驱动形式 |  | DATA_COMBOX | None |
| `transmissionRelationship` | 传动关系 |  | DATA_COMBOX | None |
| `sensorMode` | 传感模式 |  | DATA_COMBOX | None |
| `totalSpeedRatio` | 总速比 |  | DATA_DOUBLE | None |
| `maximumSpeed (Idle)` | 最大线速度（空载） | mm/s | DATA_DOUBLE | None |
| `maximumAcceleration (Idle)` | 最大线加速度（空载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration (Idle)` | 最大线减速度（空载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumSpeed (Full Load)` | 最大线速度（满载） | mm/s | DATA_DOUBLE | None |
| `maximumAcceleration  (Full Load)` | 最大线加速度（满载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration  (Full Load)` | 最大线减速度（满载） | mm/s^2 | DATA_DOUBLE | None |
| `stroke` | 行程 | mm | DATA_DOUBLE | None |
| `load` | 负载 | kg | DATA_DOUBLE | None |

### Sub-Type: rotate
**Description**: 通用旋转执行机构

#### Private Attributes
**Group: rotateAttr (私有属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `structureForm` | 结构形式 |  | DATA_COMBOX | None |
| `drivingForm` | 驱动形式 |  | DATA_COMBOX | None |
| `transmissionRelationship` | 传动关系 |  | DATA_COMBOX | None |
| `sensorMode` | 传感模式 |  | DATA_COMBOX | None |
| `lead` | 导程 | mm | DATA_DOUBLE | None |
| `totalSpeedRatio` | 总速比 |  | DATA_DOUBLE | None |
| `maximumSpeed (Idle)` | 最大角速度（空载） | °/s | DATA_DOUBLE | None |
| `maximumAcceleration (Idle)` | 最大角加速度（空载） | °/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration (Idle)` | 最大角减速度（空载） | °/s^2 | DATA_DOUBLE | None |
| `maximumSpeed (Full Load)` | 最大角速度（满载） | °/s | DATA_DOUBLE | None |
| `maximumAcceleration (Full Load)` | 最大角加速度（满载） | °/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration (Full Load)` | 最大角减速度（满载） | °/s^2 | DATA_DOUBLE | None |
| `negativeLimit` | 负限位 | ° | DATA_DOUBLE | None |
| `positiveLimit` | 正限位 | ° | DATA_DOUBLE | None |
| `load` | 负载 | kg | DATA_DOUBLE | None |

### Sub-Type: translation
**Description**: 通用平移执行机构

#### Private Attributes
**Group: translateAttr (平移属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `structureForm` | 结构形式 |  | DATA_COMBOX | None |
| `drivingForm` | 驱动形式 |  | DATA_COMBOX | None |
| `maximumSpeed (Idle)` | 最大线速度（空载） | mm/s | DATA_DOUBLE | None |
| `maximumAcceleration (Idle)` | 最大线加速度（空载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration (Idle)` | 最大线减速度（空载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumSpeed (Full Load)` | 最大线速度（满载） | mm/s | DATA_DOUBLE | None |
| `maximumAcceleration  (Full Load)` | 最大线加速度（满载） | mm/s^2 | DATA_DOUBLE | None |
| `maximumDeceleration  (Full Load)` | 最大线减速度（满载） | mm/s^2 | DATA_DOUBLE | None |
| `load` | 额定负载 | kg | DATA_DOUBLE | None |

## Category: AUDIO

### Sub-Type: audioIn
**Description**: 通用拾音器

### Sub-Type: audioOut
**Description**: can接口的通用扬声器

#### Interfaces
**Interface: CAN_1 (CAN_1) - Type: CAN**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `resistor` | 带终端电阻 |  |
| `baudrate` | 波特率 |  |
| `protocol` | 协议 |  |
| `dialValue` | 拨码值 |  |
| `nodeId` | 节点Id |  |

**Interface: SPK_1 (SPK_1) - Type: SPK**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `Power` | 输出功率 | W |

## Category: AUTOBODY

### Sub-Type: carrier
**Description**: 通用载台

#### Private Attributes
**Group: carrierAttr (载台属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `ratedLoad` | 额定承载 | kg | DATA_DOUBLE | None |
| `carrierType` | 载台类型 |  | DATA_COMBOX | None |

### Sub-Type: covers
**Description**: 通用覆盖件

## Category: BATTERY

### Sub-Type: charge
**Description**: 通用充电继电器

#### Private Attributes
**Group: chargerAttr (充电属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `dir` | 充电方向 |  | DATA_COMBOX | None |
| `type` | 类型 |  | DATA_COMBOX | None |
| `voltage` | 工作电压 | V | DATA_DOUBLE | None |
| `contactResistance` | 接触电阻 | mΩ | DATA_DOUBLE | None |
| `insulationResistance` | 绝缘电阻 | mΩ | DATA_DOUBLE | None |
| `maxCurrent` | 最大工作电流 | A | DATA_DOUBLE | None |
| `maxTemperature` | 最高工作温度 | ℃ | DATA_DOUBLE | None |

### Sub-Type: power
**Description**: 通用电源

#### Private Attributes
**Group: powerAttr (能源属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `outputCurrent` | 输出电流 | A | DATA_DOUBLE | None |
| `maxInputCurrent` | 最大输入电流(AC) | A | DATA_DOUBLE | None |
| `minOutputVoltage` | 最低输出电压 | V | DATA_DOUBLE | None |
| `maxOutputVoltage` | 最高输出电压 | V | DATA_DOUBLE | None |
| `minInputVoltage` | 最低输入电压 | V | DATA_DOUBLE | None |
| `maxInputVoltage` | 最高输入电压 | V | DATA_DOUBLE | None |
| `efficiency` | 效率 | % | DATA_DOUBLE | None |
| `factor` | 功率因数 |  | DATA_DOUBLE | None |
| `workTempMin` | 最低工作温度 | ℃ | DATA_DOUBLE | None |
| `workTempMax` | 最高工作温度 | ℃ | DATA_DOUBLE | None |
| `relativeHumidity` | 工作相对湿度 | % | DATA_DOUBLE | None |
| `firmwareVersion` | 固件版本 |  | DATA_STRING | None |

### Sub-Type: subBattery
**Description**: 通用电池

#### Private Attributes
**Group: batteryAttr (电池属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `capacity` | 电池容量 | Ah | DATA_DOUBLE | None |
| `stdChargeCurrent` | 标准充电电流 | A | DATA_DOUBLE | None |
| `maxChargeCurrent` | 最大充电电流 | A | DATA_DOUBLE | None |
| `stdDischargeCurrent` | 标准放电电流 | A | DATA_DOUBLE | None |
| `maxDischargeCurrent` | 最大放电电流 | A | DATA_DOUBLE | None |
| `voltage` | 额定电压 | V | DATA_DOUBLE | None |
| `maxPower` | 最大功率 | W | DATA_DOUBLE | None |
| `resistance` | 内阻 | mΩ | DATA_DOUBLE | None |
| `cycleLife` | 循环寿命 | 次 | DATA_INT32 | None |
| `chargeTempMin` | 最低充电温度 | ℃ | DATA_DOUBLE | None |
| `chargeTempMax` | 最高充电温度 | ℃ | DATA_DOUBLE | None |
| `dischargeTempMin` | 最低放电温度 | ℃ | DATA_DOUBLE | None |
| `dischargeTempMax` | 最高放电温度 | ℃ | DATA_DOUBLE | None |

#### Interfaces
**Interface: BAT_1 (BAT_1) - Type: BAT**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `VOUT` | 额定输出电压 | V |
| `CAPACITY` | 容量 | AH |

**Interface: RS485_1 (RS485_1) - Type: RS485**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `baudrate` | 波特率 |  |
| `dataBits` | 有效数字位 |  |
| `patity` | 奇偶校验 |  |
| `stopBits` | 停止位 |  |
| `protocol` | 协议 |  |
| `siteType` | 类型 |  |

**Interface: DO_1 (DO_1) - Type: DO**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `isReversed` | 是否反向 |  |
| `mode` | 模式 |  |

## Category: BUTTON

### Sub-Type: subButton
**Description**: 通用按钮

#### Private Attributes
**Group: buttonAttr (按钮属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `buttonType` | 按钮类型 |  | DATA_COMBOX | None |
| `switchMode` | 开关方式 |  | DATA_COMBOX | None |
| `buttonLamp` | 按钮灯控制 |  | DATA_COMBOX | None |
| `selfLock` | 是否自锁 |  | DATA_BOOL | False |

#### Interfaces
**Interface: DO_1 (DO_1) - Type: DO**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `isReversed` | 是否反向 |  |
| `mode` | 模式 |  |

## Category: CHASSIS

### Sub-Type: diffChassis
**Description**: 通用差速底盘

#### Private Attributes
**Group: motionCenterAttr (运动中心参数)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `headOffset(Idle)` | 距离车头距离（空载） | mm | DATA_DOUBLE | 50 |
| `tailOffset(Idle)` | 距离车尾距离（空载） | mm | DATA_DOUBLE | 50 |
| `leftOffset(Idle)` | 距离左侧距离（空载） | mm | DATA_DOUBLE | 50 |
| `rightOffset(Idle)` | 距离右侧距离（空载） | mm | DATA_DOUBLE | 50 |
| `headOffset (Full Load)` | 距离车头距离（满载） | mm | DATA_DOUBLE | 50 |
| `tailOffset (Full Load)` | 距离车尾距离（满载） | mm | DATA_DOUBLE | 50 |
| `leftOffset (Full Load)` | 距离左侧距离（满载） | mm | DATA_DOUBLE | 50 |
| `rightOffset (Full Load)` | 距离右侧距离（满载） | mm | DATA_DOUBLE | 50 |

**Group: chassisAttr (底盘参数)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `wheelsNum` | 轮组个数 | 个 | DATA_INT32 | 1 |
| `maxAcceleration(Idle)` | 最大线加速度（空载） | mm/s2 | DATA_DOUBLE | None |
| `maxDeceleration(Idle)` | 最大线减速度（空载） | mm/s2 | DATA_DOUBLE | None |
| `maxSpeed(Idle)` | 最大速度（空载） | mm/s | DATA_DOUBLE | None |
| `maxAcceleration (Full Load)` | 最大线加速度（满载） | mm/s2 | DATA_DOUBLE | None |
| `maxDeceleration (Full Load)` | 最大线减速度（满载） | mm/s2 | DATA_DOUBLE | None |
| `maxSpeed (Full Load)` | 最大速度（满载） | mm/s | DATA_DOUBLE | None |
| `avoidMaxDec (Idle)` | 避障最大减速度（空载） | mm/s2 | DATA_DOUBLE | None |
| `avoidMaxDec (Full Load)` | 避障最大减速度（满载） | mm/s2 | DATA_DOUBLE | None |
| `avoidRotMaxAngDec (Idle)` | 避障最大旋转减速度（空载） | °/s2 | DATA_DOUBLE | None |
| `avoidRotMaxAngDec (Full Load)` | 避障最大旋转减速度（满载） | °/s2 | DATA_DOUBLE | None |
| `rotateMaxAngAcceleration (Idle)` | 最大角加速度（空载） | °/s2 | DATA_DOUBLE | None |
| `rotateMaxAngDeceleration (Idle)` | 最大角减速度（空载） | °/s2 | DATA_DOUBLE | None |
| `rotateMaxAngSpeed (Idle)` | 最大角速度（空载） | °/s | DATA_DOUBLE | None |
| `rotateMaxAngAcceleration (Full Load)` | 最大角加速度（满载） | °/s2 | DATA_DOUBLE | None |
| `rotateMaxAngDeceleration (Full Load)` | 最大角减速度（满载） | °/s2 | DATA_DOUBLE | None |
| `rotateMaxAngSpeed (Full Load)` | 最大角速度（满载） | °/s | DATA_DOUBLE | None |
| `rotateDiameter` | 旋转直径 | mm | DATA_DOUBLE | 141.4213562373095 |
| `maxClimbingAngle` | 爬坡能力 | ° | DATA_DOUBLE | None |
| `totalLoadWeight` | 额定负载 | kg | DATA_DOUBLE | None |
| `selfWeight` | 自重 | kg | DATA_DOUBLE | None |

**Group: wheelsAttr (轮组属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `wheelSpace` | 轮间距 | mm | DATA_DOUBLE | 100 |
| `locCoordNX` | 轴中心X坐标 | mm | DATA_DOUBLE | None |
| `locCoordNY` | 轴中心Y坐标 | mm | DATA_DOUBLE | None |
| `locCoordNZ` | 轴中心Z坐标 | mm | DATA_DOUBLE | None |

### Sub-Type: steerChassis
**Description**: 通用舵轮底盘

#### Private Attributes
**Group: motionCenterAttr (运动中心参数)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `headOffset(Idle)` | 距离车头距离（空载） | mm | DATA_DOUBLE | 50 |
| `tailOffset(Idle)` | 距离车尾距离（空载） | mm | DATA_DOUBLE | 50 |
| `leftOffset(Idle)` | 距离左侧距离（空载） | mm | DATA_DOUBLE | 50 |
| `rightOffset(Idle)` | 距离右侧距离（空载） | mm | DATA_DOUBLE | 50 |
| `headOffset (Full Load)` | 距离车头距离（满载） | mm | DATA_DOUBLE | 50 |
| `tailOffset (Full Load)` | 距离车尾距离（满载） | mm | DATA_DOUBLE | 50 |
| `leftOffset (Full Load)` | 距离左侧距离（满载） | mm | DATA_DOUBLE | 50 |
| `rightOffset (Full Load)` | 距离右侧距离（满载） | mm | DATA_DOUBLE | 50 |

**Group: chassisAttr (底盘参数)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `wheelsNum` | 轮组个数 | 个 | DATA_INT32 | 1 |
| `maxAcceleration(Idle)` | 最大线加速度（空载） | mm/s2 | DATA_DOUBLE | None |
| `maxDeceleration(Idle)` | 最大线减速度（空载） | mm/s2 | DATA_DOUBLE | None |
| `maxSpeed(Idle)` | 最大速度（空载） | mm/s | DATA_DOUBLE | None |
| `maxAcceleration (Full Load)` | 最大线加速度（满载） | mm/s2 | DATA_DOUBLE | None |
| `maxDeceleration (Full Load)` | 最大线减速度（满载） | mm/s2 | DATA_DOUBLE | None |
| `maxSpeed (Full Load)` | 最大速度（满载） | mm/s | DATA_DOUBLE | None |
| `avoidMaxDec (Idle)` | 避障最大减速度（空载） | mm/s2 | DATA_DOUBLE | None |
| `avoidMaxDec (Full Load)` | 避障最大减速度（满载） | mm/s2 | DATA_DOUBLE | None |
| `avoidRotMaxAngDec (Idle)` | 避障最大旋转减速度（空载） | °/s2 | DATA_DOUBLE | None |
| `avoidRotMaxAngDec (Full Load)` | 避障最大旋转减速度（满载） | °/s2 | DATA_DOUBLE | None |
| `rotateMaxAngAcceleration (Idle)` | 最大角加速度（空载） | °/s2 | DATA_DOUBLE | None |
| `rotateMaxAngDeceleration (Idle)` | 最大角减速度（空载） | °/s2 | DATA_DOUBLE | None |
| `rotateMaxAngSpeed (Idle)` | 最大角速度（空载） | °/s | DATA_DOUBLE | None |
| `rotateMaxAngAcceleration (Full Load)` | 最大角加速度（满载） | °/s2 | DATA_DOUBLE | None |
| `rotateMaxAngDeceleration (Full Load)` | 最大角减速度（满载） | °/s2 | DATA_DOUBLE | None |
| `rotateMaxAngSpeed (Full Load)` | 最大角速度（满载） | °/s | DATA_DOUBLE | None |
| `rotateDiameter` | 旋转直径 | mm | DATA_DOUBLE | 141.4213562373095 |
| `maxClimbingAngle` | 爬坡能力 | ° | DATA_DOUBLE | None |
| `totalLoadWeight` | 额定负载 | kg | DATA_DOUBLE | None |
| `selfWeight` | 自重 | kg | DATA_DOUBLE | None |

**Group: wheelsAttr (轮组属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `locCoordNX` | X坐标 | mm | DATA_DOUBLE | None |
| `locCoordNY` | Y坐标 | mm | DATA_DOUBLE | None |
| `locCoordNZ` | Z坐标 | mm | DATA_DOUBLE | None |

## Category: COMMUNICATION

### Sub-Type: PIO
**Description**: 通用PIO模块

#### Private Attributes
**Group: PIOAttr (PIO属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `transType` | 传输方式 |  | DATA_STRING | None |
| `transCounts` | 传输点数 |  | DATA_INT32 | None |
| `transDis` | 传输距离 | mm | DATA_DOUBLE | None |
| `transTime` | 传输时间 | s | DATA_DOUBLE | None |
| `modulateType` | 调制方式 |  | DATA_STRING | None |

### Sub-Type: RFID
**Description**: 通用RFID模块

### Sub-Type: WAPI
**Description**: 通用WAPI

### Sub-Type: WIFI
**Description**: 通用WIFI模块

#### Private Attributes
**Group: WIFIAttr (WIFI属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `decodeType` | 密码方式 |  | DATA_STRING | None |
| `wirelessProto` | 无线标准 |  | DATA_STRING | None |
| `wirelessCertify` | 无线认证 |  | DATA_STRING | None |
| `workFreq` | 工作频率 | HZ | DATA_COMBOX | None |

### Sub-Type: bluetooth
**Description**: 通用蓝牙模块

### Sub-Type: fifthGeneration
**Description**: 通用5G模块

#### Interfaces
**Interface: SMA_1 (SMA_1) - Type: SMA**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `SWTAGS` | 软件标签属性 |  |

**Interface: ETH_1 (ETH_1) - Type: ETH**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `deviceId` | 设备id |  |
| `ip` | ip参数 |  |
| `gate` | 网关 |  |
| `port` | 端口 |  |
| `speed` | 速度 |  |

## Category: DRIVEWHEEL

### Sub-Type: diffSteerWheel
**Description**: 通用差速舵轮

#### Private Attributes
**Group: wheelAttr (基本属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `wheelRadius` | 轮半径 | mm | DATA_DOUBLE | 1 |
| `wheelSpace` | 轮间距 | mm | DATA_DOUBLE | 1 |
| `angleLmtPos` | 正限位角度 | ° | DATA_DOUBLE | None |
| `angleLmtNeg` | 负限位角度 | ° | DATA_DOUBLE | None |
| `rotOmgLmt` | 转向能力(最大) | °/s | DATA_DOUBLE | None |

**Group: angleSensor (转向反馈)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `angleSensorType` | 类型 |  | DATA_COMBOX | None |

**Group: linkMotorAttr (电机)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `relateLeftMotor` | 左行走电机 |  | DATA_FIXED_E | None |
| `relateRightMotor` | 右行走电机 |  | DATA_FIXED_E | None |

### Sub-Type: diffWheel
**Description**: 通用差速轮

#### Private Attributes
**Group: wheelAttr (基本属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `wheelRadius` | 轮半径 | mm | DATA_DOUBLE | 1 |

**Group: linkMotorAttr (关联电机)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `relateMotor` | 行走电机 |  | DATA_FIXED_E | None |

### Sub-Type: horizontalSteerWheel
**Description**: 通用卧式舵轮

#### Private Attributes
**Group: wheelAttr (基本属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `wheelRadius` | 轮半径 | mm | DATA_DOUBLE | 1 |
| `angleLmtPos` | 正限位角度 | ° | DATA_DOUBLE | None |
| `angleLmtNeg` | 负限位角度 | ° | DATA_DOUBLE | None |
| `rotOmgLmt` | 转向能力(最大) | °/s | DATA_DOUBLE | None |

**Group: angleSensor (转向反馈)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `angleSensorType` | 类型 |  | DATA_COMBOX | None |

**Group: linkMotorAttr (电机)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `relateRotMotor` | 转向电机 |  | DATA_FIXED_E | None |
| `relateWalkMotor` | 行走电机 |  | DATA_FIXED_E | None |

### Sub-Type: verticalSteerWheel
**Description**: 通用立式舵轮

#### Private Attributes
**Group: wheelAttr (基本属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `wheelRadius` | 轮半径 | mm | DATA_DOUBLE | 1 |
| `angleLmtPos` | 正限位角度 | ° | DATA_DOUBLE | None |
| `angleLmtNeg` | 负限位角度 | ° | DATA_DOUBLE | None |
| `rotOmgLmt` | 转向能力(最大) | °/s | DATA_DOUBLE | None |

**Group: angleSensor (转向反馈)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `angleSensorType` | 类型 |  | DATA_COMBOX | None |

**Group: linkMotorAttr (电机)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `relateRotMotor` | 转向电机 |  | DATA_FIXED_E | None |
| `relateWalkMotor` | 行走电机 |  | DATA_FIXED_E | None |

### Sub-Type: weakSteerWheel
**Description**: 通用无动力差速轮

#### Private Attributes
**Group: wheelAttr (基本属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `wheelRadius` | 轮半径 | mm | DATA_DOUBLE | 1 |
| `wheelSpace` | 轮间距 | mm | DATA_DOUBLE | 1 |

**Group: angleSensor (转向反馈)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `angleSensorType` | 类型 |  | DATA_COMBOX | None |

### Sub-Type: weakTurnWheel
**Description**: 通用可控转向轮

#### Private Attributes
**Group: wheelAttr (基本属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `wheelRadius` | 轮半径 | mm | DATA_DOUBLE | None |
| `angleLmtPos` | 正限位角度 | ° | DATA_DOUBLE | None |
| `angleLmtNeg` | 负限位角度 | ° | DATA_DOUBLE | None |
| `rotOmgLmt` | 转向能力(最大) | °/s | DATA_DOUBLE | None |

**Group: angleSensor (转向反馈)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `angleSensorType` | 类型 |  | DATA_COMBOX | None |

**Group: linkMotorAttr (电机)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `relateRotMotor` | 转向电机 |  | DATA_FIXED_E | None |

## Category: DRIVER

### Sub-Type: BDCMotor
**Description**: 通用直流有刷电机

#### Private Attributes
**Group: motorAttr (电机属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `ENCType` | 编码器类型 |  | DATA_COMBOX | None |
| `ratedSpeed` | 电机额定转速 | RPM | DATA_INT32 | None |
| `bHbrake` | 是否带抱闸 |  | DATA_COMBOX | None |
| `torque` | 额定扭矩 | N*m | DATA_DOUBLE | None |
| `ratedCurr` | 额定电流 | A | DATA_DOUBLE | None |
| `ratedVolt` | 额定电压 | V | DATA_DOUBLE | None |
| `powerVolt` | 供电电压 | V | DATA_DOUBLE | None |
| `bReverse` | 是否反向 |  | DATA_BOOL | False |
| `posKp` | 位置环Kp值 |  | DATA_DOUBLE | None |

#### Interfaces
**Interface: LINE_1 (LINE_1) - Type: LINE**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `IOUT` | 额定输出电流 | mA |

**Interface: ENCR_1 (ENCR_1) - Type: ENCR**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |

### Sub-Type: BLDCMotor
**Description**: 通用直流无刷电机

#### Private Attributes
**Group: motorAttr (电机属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `ENCType` | 编码器类型 |  | DATA_COMBOX | None |
| `initMode` | 电机初始状态 |  | DATA_COMBOX | None |
| `RPM` | 电机额定转速 | RPM | DATA_INT32 | None |
| `bTemper` | 是否支持电机温度获取 |  | DATA_BOOL | False |
| `bHbrake` | 是否带抱闸 |  | DATA_BOOL | False |
| `bReverse` | 是否反向 |  | DATA_BOOL | False |
| `torque` | 额定扭矩 | N*m | DATA_DOUBLE | None |
| `gearRatio` | 减速比 |  | DATA_DOUBLE | 1 |
| `ratedCurr` | 额定电流 | A | DATA_DOUBLE | None |
| `overCurrCoef` | 过流系数 |  | DATA_DOUBLE | None |
| `defaultAcc` | 默认加速度 | r/s^2 | DATA_DOUBLE | None |
| `defaultDec` | 默认减速度 | r/s^2 | DATA_DOUBLE | None |
| `maxAcc` | 电机支持的最大加速度 | r/s^2 | DATA_DOUBLE | None |
| `maxDec` | 电机支持的最大减速度 | r/s^2 | DATA_DOUBLE | None |

#### Interfaces
**Interface: LINE_1 (LINE_1) - Type: LINE**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `IOUT` | 额定输出电流 | mA |

**Interface: ENCR_1 (ENCR_1) - Type: ENCR**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |

### Sub-Type: PMSMMotor
**Description**: 通用电机

#### Private Attributes
**Group: motorAttr (电机属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `ENCType` | 编码器类型 |  | DATA_COMBOX | None |
| `initMode` | 电机初始状态 |  | DATA_COMBOX | None |
| `RPM` | 电机额定转速 | RPM | DATA_INT32 | None |
| `bTemper` | 是否支持电机温度获取 |  | DATA_BOOL | False |
| `bHbrake` | 是否带抱闸 |  | DATA_BOOL | False |
| `bReverse` | 是否反向 |  | DATA_BOOL | False |
| `torque` | 额定扭矩 | N*m | DATA_DOUBLE | None |
| `gearRatio` | 减速比 |  | DATA_DOUBLE | 1 |
| `ratedCurr` | 额定电流 | A | DATA_DOUBLE | None |
| `overCurrCoef` | 过流系数 |  | DATA_DOUBLE | None |
| `defaultAcc` | 默认加速度 | r/s^2 | DATA_DOUBLE | None |
| `defaultDec` | 默认减速度 | r/s^2 | DATA_DOUBLE | None |
| `maxAcc` | 电机支持的最大加速度 | r/s^2 | DATA_DOUBLE | None |
| `maxDec` | 电机支持的最大减速度 | r/s^2 | DATA_DOUBLE | None |

#### Interfaces
**Interface: LINE_1 (LINE_1) - Type: LINE**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `IOUT` | 额定输出电流 | mA |

**Interface: ENCR_1 (ENCR_1) - Type: ENCR**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |

### Sub-Type: subDriver
**Description**: 通用驱动

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `inputVoltage` | 输入电压 | V | DATA_DOUBLE | 24 |
| `inputCurrent` | 输入电流 | A | DATA_DOUBLE | 0.5 |
| `overloadCapacity` | 过载能力 | 倍 | DATA_DOUBLE | 1.5 |
| `overloadTime` | 过载时长 | S | DATA_DOUBLE | 3 |
| `type` | 驱动类型 |  | DATA_COMBOX | None |

#### Interfaces
**Interface: CAN_1 (CAN_1) - Type: CAN**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `resistor` | 带终端电阻 |  |
| `baudrate` | 波特率 |  |
| `protocol` | 协议 |  |
| `dialValue` | 拨码值 |  |
| `nodeId` | 节点Id |  |

**Interface: CAN_2 (CAN_2) - Type: CAN**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `resistor` | 带终端电阻 |  |
| `baudrate` | 波特率 |  |
| `protocol` | 协议 |  |
| `dialValue` | 拨码值 |  |
| `nodeId` | 节点Id |  |

**Interface: LINE_1 (LINE_1) - Type: LINE**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `IOUT` | 额定输出电流 | mA |

**Interface: ENCR_1 (ENCR_1) - Type: ENCR**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |

## Category: ENERGYCONTROLLER

### Sub-Type: powerController
**Description**: 通用电源控制器

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |

#### Interfaces
**Interface: CAN_1 (CAN_1) - Type: CAN**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `resistor` | 带终端电阻 |  |
| `baudrate` | 波特率 |  |
| `protocol` | 协议 |  |
| `dialValue` | 拨码值 |  |
| `nodeId` | 节点Id |  |

### Sub-Type: prechargeController
**Description**: 通用预充控制器

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |

## Category: EXTENDEDLNTERFACE

### Sub-Type: IOModule
**Description**: 通用IO模块

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |
| `bipolar` | 双极晶体管类型 |  | DATA_COMBOX | None |

#### Interfaces
**Interface: CAN_1 (CAN_1) - Type: CAN**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `resistor` | 带终端电阻 |  |
| `baudrate` | 波特率 |  |
| `protocol` | 协议 |  |
| `dialValue` | 拨码值 |  |
| `nodeId` | 节点Id |  |

**Interface: DI_1 (DI_1) - Type: DI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `activeLevel` | 有效电平 |  |

**Interface: DI_2 (DI_2) - Type: DI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `activeLevel` | 有效电平 |  |

**Interface: DI_3 (DI_3) - Type: DI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `activeLevel` | 有效电平 |  |

**Interface: DI_4 (DI_4) - Type: DI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `activeLevel` | 有效电平 |  |

**Interface: DI_5 (DI_5) - Type: DI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `activeLevel` | 有效电平 |  |

**Interface: DI_6 (DI_6) - Type: DI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `activeLevel` | 有效电平 |  |

**Interface: DO_1 (DO_1) - Type: DO**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `mode` | 模式 |  |

**Interface: DO_2 (DO_2) - Type: DO**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `mode` | 模式 |  |

**Interface: DO_3 (DO_3) - Type: DO**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `mode` | 模式 |  |

**Interface: DO_4 (DO_4) - Type: DO**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `mode` | 模式 |  |

**Interface: DO_5 (DO_5) - Type: DO**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `mode` | 模式 |  |

**Interface: DO_6 (DO_6) - Type: DO**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `VH` | 高电平 | V |
| `IH` | 高电平电流能力 | mA |
| `VL` | 低电平 | V |
| `IL` | 低电平电流能力 | mA |
| `Z` | 高阻态 |  |
| `isReversed` | 是否反向 |  |
| `mode` | 模式 |  |

### Sub-Type: ethernetSwitch
**Description**: 通用以太网交换机

### Sub-Type: safetyIOModule
**Description**: 通用安全IO模块

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |

## Category: INTERGRATEDCONTROLLER

### Sub-Type: safetyController
**Description**: 通用安全控制器

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |

### Sub-Type: subIntergratedController
**Description**: 通用集成控制器

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |

## Category: LIGHT

### Sub-Type: lamp
**Description**: 通用灯带

#### Private Attributes
**Group: lightAttr (灯光属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `lightType` | 指示灯类型 |  | DATA_COMBOX | None |
| `lightColor` | 指示灯颜色 |  | DATA_COMBOX | None |

#### Interfaces
**Interface: DI_1 (DI_1) - Type: DI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `COLOR` | 颜色 |  |
| `isReversed` | 是否反向 |  |
| `activeLevel` | 有效电平 |  |

**Interface: DI_2 (DI_2) - Type: DI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `COLOR` | 颜色 |  |
| `isReversed` | 是否反向 |  |
| `activeLevel` | 有效电平 |  |

**Interface: DI_3 (DI_3) - Type: DI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `COLOR` | 颜色 |  |
| `isReversed` | 是否反向 |  |
| `activeLevel` | 有效电平 |  |

### Sub-Type: warningLight
**Description**: 通用警示灯

#### Interfaces
**Interface: DI_1 (DI_1) - Type: DI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `HWTAGS` | 硬件标签属性 |  |
| `COLOR` | 颜色 |  |
| `VIN` | 额定输入电压 | V |
| `IIN` | 额定输入电流 | mA |
| `isReversed` | 是否反向 |  |
| `activeLevel` | 有效电平 |  |

## Category: MAINCPU

### Sub-Type: subMainCPU
**Description**: 通用主控制器

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `isWithGyro` | 是否有板载陀螺仪 |  | DATA_COMBOX | None |
| `isWithUpCamera` | 是否有板载上读码头 |  | DATA_COMBOX | None |
| `isWithDownCamera` | 是否有板载下读码头 |  | DATA_COMBOX | None |

## Category: SCREEN

### Sub-Type: segDisplays
**Description**: 通用数码管

#### Interfaces
**Interface: CAN_1 (CAN_1) - Type: CAN**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `resistor` | 带终端电阻 |  |
| `baudrate` | 波特率 |  |
| `protocol` | 协议 |  |
| `dialValue` | 拨码值 |  |
| `nodeId` | 节点Id |  |

### Sub-Type: subScreen
**Description**: 通用显示屏

#### Private Attributes
**Group: screenAttr (屏幕属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `resolutionWidth` | 分辨率宽 | PPI | DATA_DOUBLE | None |
| `resolutionHeight` | 分辨率高 | PPI | DATA_DOUBLE | None |
| `screenSize` | 屏幕尺寸 | inch | DATA_DOUBLE | None |

**Group: screenAttr (屏幕属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `resolutionWidth` | 分辨率宽 | PPI | DATA_DOUBLE | None |
| `resolutionHeight` | 分辨率高 | PPI | DATA_DOUBLE | None |
| `screenSize` | 屏幕尺寸 | inch | DATA_DOUBLE | None |

#### Interfaces
**Interface: HDMI_1 (HDMI_1) - Type: HDMI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |

## Category: SENSOR

### Sub-Type: 3DLaser
**Description**: 通用3D激光

#### Private Attributes
**Group: sensorAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `waveLength` | 波长 | nm | DATA_DOUBLE | None |
| `antiLight` | 抗光干扰 | klux | DATA_DOUBLE | None |
| `needCalib` | 是否需要标定 |  | DATA_BOOL | False |

**Group: scanAttr (扫描属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `scanDirect` | 扫描方向 |  | DATA_COMBOX | None |
| `usageMode` | 应用方式 |  | DATA_COMBOX | None |

#### Interfaces
**Interface: ETH_1 (ETH_1) - Type: ETH**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `deviceId` | 设备id |  |
| `ip` | ip参数 |  |
| `gate` | 网关 |  |
| `port` | 端口 |  |
| `speed` | 速度 |  |

### Sub-Type: ABZEncode
**Description**: 通用磁栅编码器

#### Private Attributes
**Group: encodeAttr (编码器属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `lineCount` | 线数 |  | DATA_INT32 | None |
| `isInvert` | 是否反向 |  | DATA_BOOL | False |

### Sub-Type: PT
**Description**: 通用光电开关

#### Private Attributes
**Group: sensorAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `antiLight` | 抗光干扰 | klux | DATA_BOOL | False |
| `blindZone` | 盲区 | mm | DATA_DOUBLE | None |
| `needCalib` | 是否需要标定 |  | DATA_BOOL | False |

**Group: scanAttr (扫描属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `pointAngleMin` | 指向角最小值 | ° | DATA_DOUBLE | None |
| `pointAngleMax` | 指向角最大值 | ° | DATA_DOUBLE | None |
| `detecteDistence` | 最大测量距离 | mm | DATA_DOUBLE | None |
| `accuracy` | 测量精度 | mm | DATA_DOUBLE | None |

### Sub-Type: TOF
**Description**: 通用TOF

#### Private Attributes
**Group: sensorAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `resolutionH` | 分辨率H | PPI | DATA_DOUBLE | None |
| `resolutionW` | 分辨率W | PPI | DATA_DOUBLE | None |
| `detectDistance` | 检测距离 | mm | DATA_DOUBLE | None |

### Sub-Type: TOFCamera
**Description**: 通用3DTOF

#### Private Attributes
**Group: sensorAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `resolutionH` | 分辨率H | PPI | DATA_DOUBLE | None |
| `resolutionW` | 分辨率W | PPI | DATA_DOUBLE | None |

### Sub-Type: absoluteValueEncode
**Description**: 通用绝对式编码器

#### Private Attributes
**Group: encodeAttr (编码器属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `absEncodeType` | 编码器类型 |  | DATA_COMBOX | None |
| `resolutionMode` | 分辨率模式 |  | DATA_COMBOX | None |
| `isInvert` | 是否反向 |  | DATA_BOOL | False |

#### Interfaces
**Interface: CAN_1 (CAN_1) - Type: CAN**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `resistor` | 带终端电阻 |  |
| `baudrate` | 波特率 |  |
| `protocol` | 协议 |  |
| `dialValue` | 拨码值 |  |
| `nodeId` | 节点Id |  |

### Sub-Type: codeReader
**Description**: 通用读码器

#### Private Attributes
**Group: sensorAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `focalLength` | 焦距 | mm | DATA_DOUBLE | None |
| `exposure` | 曝光时长范围 | s | DATA_DOUBLE | None |
| `needCalib` | 是否需要标定 |  | DATA_BOOL | False |

**Group: pictureAttr (图像属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `scanRangeHorizonStart` | 水平视场角起始 | ° | DATA_DOUBLE | None |
| `scanRangeHorizonEnd` | 水平视场角终止 | ° | DATA_DOUBLE | None |
| `scanRangeVerticalStart` | 垂直视场角起始 | ° | DATA_DOUBLE | None |
| `scanRangeVerticalEnd` | 垂直视场角终止 | ° | DATA_DOUBLE | None |
| `resolutionH` | 分辨率H | PPI | DATA_DOUBLE | None |
| `resolutionW` | 分辨率W | PPI | DATA_DOUBLE | None |
| `codecMode` | 视频编码标准 |  | DATA_STRING | None |
| `frameRate` | 最大帧率 | fps | DATA_DOUBLE | None |

**Group: resultAttr (识别属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `resultType` | 识别结果类型 |  | DATA_STRING | None |
| `resultValue` | 识别结果 |  | DATA_STRING | None |
| `scanDistence` | 有效扫描距离 | mm | DATA_DOUBLE | None |
| `accuracy` | 识别精度 | mm | DATA_DOUBLE | None |

#### Interfaces
**Interface: ETH_1 (ETH_1) - Type: ETH**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `deviceId` | 设备id |  |
| `ip` | ip参数 |  |
| `gate` | 网关 |  |
| `port` | 端口 |  |
| `speed` | 速度 |  |

### Sub-Type: collisionBaro
**Description**: 通用气动碰撞条

#### Private Attributes
**Group: collisionAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `thresholdBaro` | 气压阈值 | Pa | DATA_DOUBLE | None |

### Sub-Type: collisionPize
**Description**: 通用压电碰撞条

#### Private Attributes
**Group: collisionAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `normalVol` | 正常电压值 | V | DATA_DOUBLE | None |
| `thresholdVol` | 浮动阈值 | V | DATA_DOUBLE | None |
| `triggerVol` | 触发电压值 | V | DATA_DOUBLE | None |

#### Interfaces
**Interface: PZTB_1 (PZTB_1) - Type: PZTB**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWITCHCHAR` | 开关特性 |  |
| `RESIST` | 电阻值 | Ω |
| `RELATION` | 关系 |  |

### Sub-Type: comDo
**Description**: 通用DO器件

### Sub-Type: gyro
**Description**: 通用陀螺仪

#### Private Attributes
**Group: sensorAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `yawRangeMin` | 偏航角最小值 | ° | DATA_DOUBLE | None |
| `yawRangeMax` | 偏航角最大值 | ° | DATA_DOUBLE | None |
| `rollRangeMin` | 翻滚角最小值 | ° | DATA_DOUBLE | None |
| `rollRangeMax` | 翻滚角最大值 | ° | DATA_DOUBLE | None |
| `pitchRangeMin` | 俯仰角最小值 | ° | DATA_DOUBLE | None |
| `pitchRangeMax` | 俯仰角最大值 | ° | DATA_DOUBLE | None |
| `angularResolution` | 角度分辨率 | ° | DATA_DOUBLE | None |
| `accelerationResolution` | 加速度分辩率 | °/s | DATA_DOUBLE | None |
| `accelerationAccuracy` | 加速度精度 | °/s | DATA_DOUBLE | None |

#### Interfaces
**Interface: PI_1 (PI_1) - Type: PI**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `VIN` | 额定输入电压 | V |
| `IIN` | 额定输入电流 | mA |

**Interface: CAN_1 (CAN_1) - Type: CAN**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `resistor` | 带终端电阻 |  |
| `baudrate` | 波特率 |  |
| `protocol` | 协议 |  |
| `dialValue` | 拨码值 |  |
| `nodeId` | 节点Id |  |

### Sub-Type: incrementalEncode
**Description**: 通用增量式编码器

#### Private Attributes
**Group: sensorAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `needCalib` | 是否需要标定 |  | DATA_BOOL | False |

**Group: encodeAttr (编码器属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `lineCount` | 线数 |  | DATA_INT32 | None |
| `isInvert` | 是否反向 |  | DATA_BOOL | False |

### Sub-Type: infrared
**Description**: 通用红外模块

### Sub-Type: laser
**Description**: 通用激光

#### Private Attributes
**Group: sensorAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `waveLength` | 波长 | nm | DATA_DOUBLE | None |
| `antiLight` | 抗光干扰 | klux | DATA_DOUBLE | None |
| `needCalib` | 是否需要标定 |  | DATA_BOOL | False |

**Group: scanAttr (扫描属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `scanDirect` | 扫描方向 |  | DATA_COMBOX | None |
| `usageMode` | 应用方式 |  | DATA_COMBOX | None |

#### Interfaces
**Interface: ETH_1 (ETH_1) - Type: ETH**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `deviceId` | 设备id |  |
| `ip` | ip参数 |  |
| `gate` | 网关 |  |
| `port` | 端口 |  |
| `speed` | 速度 |  |

### Sub-Type: proximitySensor
**Description**: 通用接近传感器

#### Interfaces
**Interface: DO_1 (DO_1) - Type: DO**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `DIS` | 检测距离 | mm |
| `OPEVOL` | 动作电压 | V |
| `isReversed` | 是否反向 |  |
| `mode` | 模式 |  |

### Sub-Type: pullWireEncode
**Description**: 通用拉线编码器

#### Private Attributes
**Group: encodeAttr (编码器属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `wheelCirc` | 轮周长 | mm | DATA_DOUBLE | None |
| `absEncodeType` | 编码器类型 |  | DATA_COMBOX | None |
| `resolutionMode` | 分辨率模式 |  | DATA_COMBOX | None |
| `isInvert` | 是否反向 |  | DATA_BOOL | False |

### Sub-Type: stereo
**Description**: 通用双目

#### Private Attributes
**Group: sensorAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `focalLength` | 焦距 | mm | DATA_DOUBLE | None |
| `exposure` | 曝光时长范围 | s | DATA_DOUBLE | None |
| `needCalib` | 是否需要标定 |  | DATA_BOOL | False |

**Group: pictureAttr (图像属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `scanRangeHorizonStart` | 水平视场角起始 | ° | DATA_DOUBLE | None |
| `scanRangeHorizonEnd` | 水平视场角终止 | ° | DATA_DOUBLE | None |
| `scanRangeVerticalStart` | 垂直视场角起始 | ° | DATA_DOUBLE | None |
| `scanRangeVerticalEnd` | 垂直视场角终止 | ° | DATA_DOUBLE | None |
| `resolutionH` | 分辨率H |  | DATA_COMBOX | None |
| `codecMode` | 视频编码标准 |  | DATA_STRING | None |
| `frameRate` | 最大帧率 | fps | DATA_DOUBLE | None |

**Group: pointAttr (深度相机属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `scanRangeHorizonStart` | 水平视场角起始 | ° | DATA_DOUBLE | None |
| `scanRangeHorizonEnd` | 水平视场角终止 | ° | DATA_DOUBLE | None |
| `scanRangeVerticalStart` | 垂直视场角起始 | ° | DATA_DOUBLE | None |
| `scanRangeVerticalEnd` | 垂直视场角终止 | ° | DATA_DOUBLE | None |
| `resolutionH` | 分辨率H | PPI | DATA_DOUBLE | None |
| `resolutionW` | 分辨率W | PPI | DATA_DOUBLE | None |
| `codecMode` | 视频编码标准 |  | DATA_STRING | None |
| `frameRate` | 最大帧率 | fps | DATA_DOUBLE | None |

**Group: resultAttr (识别属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `scanDistence` | 有效扫描距离 | mm | DATA_DOUBLE | None |

#### Interfaces
**Interface: USB_1 (USB_1) - Type: USB**

| Param Key | Description | Unit |
| :--- | :--- | :--- |
| `MODE` | 模式 |  |
| `SWTAGS` | 软件标签属性 |  |
| `BUSTAGS` | 总线标签属性 |  |
| `port` | 端口 |  |

### Sub-Type: tempSensor
**Description**: 通用温感传感器

#### Private Attributes
**Group: sensorAttr (传感属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `threshold` | 检测阈值 | ℃ | DATA_DOUBLE | None |
| `temperatureRangeMin` | 温度最小值 | ℃ | DATA_DOUBLE | None |
| `temperatureRangeMax` | 温度最大值 | ℃ | DATA_DOUBLE | None |

### Sub-Type: ultrasonicSensor
**Description**: 通用超声传感器

### Sub-Type: weighSensor
**Description**: 通用称重传感器

## Category: SENSORPROCESSOR

### Sub-Type: TOFProcessor
**Description**: 通用TOF处理器

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |

### Sub-Type: binocularCameraProcessor
**Description**: 通用双目处理器

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |

### Sub-Type: encoderProcessor
**Description**: 通用编码器处理器

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |

### Sub-Type: ultrasonicProcessor
**Description**: 通用超声处理器

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |

### Sub-Type: weighProcessor
**Description**: 通用称重处理器

#### Private Attributes
**Group: boardAttr (控制板属性)**

| Key | Description | Unit | Type | Example |
| :--- | :--- | :--- | :--- | :--- |
| `chipPlatform` | 芯片平台 |  | DATA_STRING | None |
| `softwareSpec` | 软件规格 |  | DATA_STRING | NONE |
| `offsetAddress` | 偏移地址拨码 |  | DATA_STRING | None |

