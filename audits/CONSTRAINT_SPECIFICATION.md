# AMR Studio V4 模块约束规范

**生成时间**: 2026-04-04

**来源**: specifications/ModuleLibrary/Aggregated/PrivateAttributes.xml

**模块数量**: 77


## 3DLaser


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| waveLength | DATA_DOUBLE | 0.0 | 0.0~99999.0 | nm |  | ✓ | 波长 |
| antiLight | DATA_DOUBLE | 0.0 | 0.0~9999.0 | klux |  | ✓ | 抗光干扰 |
| needCalib | DATA_BOOL | False | - |  | ✓ | ✓ | 是否需要标定 |


### scanAttr - 扫描属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| scanDirect | DATA_COMBOX | SCAN_COUNTERCLOCKWISE | - |  | ✓ | ✓ | 扫描方向 |
| usageMode | DATA_COMBOX | PClOUD_LASER | - |  |  |  | 应用方式 |


## ABZEncode


### encodeAttr - 编码器属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| lineCount | DATA_INT32 | 0 | 0~99999 |  | ✓ |  | 线数 |
| isInvert | DATA_BOOL | False | - |  |  |  | 是否反向 |


## BDCMotor


### motorAttr - 电机属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| ENCType | DATA_COMBOX | ENCODER_NULL | - |  | ✓ |  | 编码器类型 |
| ratedSpeed | DATA_INT32 | 0 | 0~99999 | RPM | ✓ |  | 电机额定转速 |
| bHbrake | DATA_COMBOX | WITH_HBRAKE | - |  |  |  | 是否带抱闸 |
| torque | DATA_DOUBLE | 0.0 | 0.0~9999.0 | N*m | ✓ |  | 额定扭矩 |
| ratedCurr | DATA_DOUBLE | 0.0 | 0.0~28.0 | A | ✓ |  | 额定电流 |
| ratedVolt | DATA_DOUBLE | 0.0 | 0.0~99999.0 | V | ✓ |  | 额定电压 |
| powerVolt | DATA_DOUBLE | 0.0 | 0.0~99999.0 | V | ✓ |  | 供电电压 |
| bReverse | DATA_BOOL | False | - |  |  | ✓ | 是否反向 |
| posKp | DATA_DOUBLE | 0.0 | 0.0~9999.0 |  | ✓ | ✓ | 位置环Kp值 |


## BLDCMotor


### motorAttr - 电机属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| ENCType | DATA_COMBOX | ENCODER_NULL | - |  | ✓ |  | 编码器类型 |
| initMode | DATA_COMBOX | MODE_FREERUN | - |  |  | ✓ | 电机初始状态 |
| RPM | DATA_INT32 | 0 | 0~9999 | RPM | ✓ |  | 电机额定转速 |
| bTemper | DATA_BOOL | False | - |  |  | ✓ | 是否支持电机温度获取 |
| bHbrake | DATA_BOOL | False | - |  |  |  | 是否带抱闸 |
| bReverse | DATA_BOOL | False | - |  |  | ✓ | 是否反向 |
| torque | DATA_DOUBLE | 0.0 | 0.0~9999.0 | N*m |  |  | 额定扭矩 |
| gearRatio | DATA_DOUBLE | 1.0 | 1.0~9999.0 |  |  |  | 减速比 |
| ratedCurr | DATA_DOUBLE | 0.0 | 0.0~9999.0 | A |  |  | 额定电流 |
| overCurrCoef | DATA_DOUBLE | 0.0 | 0.0~9999.0 |  |  |  | 过流系数 |
| defaultAcc | DATA_DOUBLE | 0.0 | 0.0~9999.0 | r/s^2 |  | ✓ | 默认加速度 |
| defaultDec | DATA_DOUBLE | 0.0 | 0.0~9999.0 | r/s^2 |  | ✓ | 默认减速度 |
| maxAcc | DATA_DOUBLE | 0.0 | 0.0~9999.0 | r/s^2 |  | ✓ | 电机支持的最大加速度 |
| maxDec | DATA_DOUBLE | 0.0 | 0.0~9999.0 | r/s^2 |  | ✓ | 电机支持的最大减速度 |


## HYD


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| inputVoltage | DATA_DOUBLE | 0.0 | 0.0~999.0 | V |  | ✓ | 输入电压 |
| inputCurrent | DATA_DOUBLE | 0.0 | 0.0~999.0 | A |  | ✓ | 输入电流 |
| overloadCapacity | DATA_DOUBLE | 0.0 | 0.0~99.0 | 倍 | ✓ | ✓ | 过载能力 |
| overloadTime | DATA_DOUBLE | 0.0 | 0.0~99.0 | S | ✓ | ✓ | 过载时长 |


## IOModule


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |
| bipolar | DATA_COMBOX | PNP | - |  |  |  | 双极晶体管类型 |


## PIO


### PIOAttr - PIO属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| transType | DATA_STRING | - | - |  |  | ✓ | 传输方式 |
| transCounts | DATA_INT32 | 0 | 0~99 |  |  | ✓ | 传输点数 |
| transDis | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  | ✓ | 传输距离 |
| transTime | DATA_DOUBLE | 0.0 | 0.0~99999.0 | s |  | ✓ | 传输时间 |
| modulateType | DATA_STRING | - | - |  |  | ✓ | 调制方式 |


## PMSMMotor


### motorAttr - 电机属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| ENCType | DATA_COMBOX | ENCODER_NULL | - |  | ✓ |  | 编码器类型 |
| initMode | DATA_COMBOX | MODE_FREERUN | - |  |  | ✓ | 电机初始状态 |
| RPM | DATA_INT32 | 0 | 0~9999 | RPM | ✓ |  | 电机额定转速 |
| bTemper | DATA_BOOL | False | - |  |  | ✓ | 是否支持电机温度获取 |
| bHbrake | DATA_BOOL | False | - |  |  |  | 是否带抱闸 |
| bReverse | DATA_BOOL | False | - |  |  | ✓ | 是否反向 |
| torque | DATA_DOUBLE | 0.0 | 0.0~9999.0 | N*m |  |  | 额定扭矩 |
| gearRatio | DATA_DOUBLE | 1.0 | 1.0~9999.0 |  |  |  | 减速比 |
| ratedCurr | DATA_DOUBLE | 0.0 | 0.0~9999.0 | A |  |  | 额定电流 |
| overCurrCoef | DATA_DOUBLE | 0.0 | 0.0~9999.0 |  |  |  | 过流系数 |
| defaultAcc | DATA_DOUBLE | 0.0 | 0.0~9999.0 | r/s^2 |  | ✓ | 默认加速度 |
| defaultDec | DATA_DOUBLE | 0.0 | 0.0~9999.0 | r/s^2 |  | ✓ | 默认减速度 |
| maxAcc | DATA_DOUBLE | 0.0 | 0.0~9999.0 | r/s^2 |  | ✓ | 电机支持的最大加速度 |
| maxDec | DATA_DOUBLE | 0.0 | 0.0~9999.0 | r/s^2 |  | ✓ | 电机支持的最大减速度 |


## PT


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| antiLight | DATA_BOOL | False | - | klux |  | ✓ | 抗光干扰 |
| blindZone | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm |  | ✓ | 盲区 |
| needCalib | DATA_BOOL | False | - |  |  | ✓ | 是否需要标定 |


### scanAttr - 扫描属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| pointAngleMin | DATA_DOUBLE | 0.0 | 0.0~180.0 | ° |  | ✓ | 指向角最小值 |
| pointAngleMax | DATA_DOUBLE | 0.0 | 0.0~180.0 | ° |  | ✓ | 指向角最大值 |
| detecteDistence | DATA_DOUBLE | 0.0 | 0.0~999.0 | mm |  | ✓ | 最大测量距离 |
| accuracy | DATA_DOUBLE | 0.0 | 0.0~99.0 | mm |  | ✓ | 测量精度 |


## RFID


## TOF


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| resolutionH | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI | ✓ | ✓ | 分辨率H |
| resolutionW | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI | ✓ | ✓ | 分辨率W |
| detectDistance | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm | ✓ | ✓ | 检测距离 |


## TOFCamera


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| resolutionH | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI | ✓ |  | 分辨率H |
| resolutionW | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI | ✓ |  | 分辨率W |


## TOFProcessor


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## WAPI


## WIFI


### WIFIAttr - WIFI属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| decodeType | DATA_STRING | - | - |  |  | ✓ | 密码方式 |
| wirelessProto | DATA_STRING | - | - |  |  | ✓ | 无线标准 |
| wirelessCertify | DATA_STRING | - | - |  |  | ✓ | 无线认证 |
| workFreq | DATA_COMBOX | 2.4G | - | HZ |  | ✓ | 工作频率 |


## absoluteValueEncode


### encodeAttr - 编码器属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| absEncodeType | DATA_COMBOX | SSI_ENCODER | - |  |  |  | 编码器类型 |
| resolutionMode | DATA_COMBOX | RES_BIT_MODE | - |  |  |  | 分辨率模式 |
| isInvert | DATA_BOOL | False | - |  | ✓ |  | 是否反向 |


## airPressureProcessor


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## audioIn


## audioOut


## binocularCameraProcessor


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## block


### blockAttr - 挡块属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| structureForm | DATA_COMBOX | block | - |  |  | ✓ | 结构形式 |
| drivingForm | DATA_COMBOX | BDC | - |  |  | ✓ | 驱动形式 |
| transmissionRelationship | DATA_COMBOX | linear | - |  |  | ✓ | 传动关系 |
| totalSpeedRatio | DATA_DOUBLE | 0.0 | 0.0~9999.0 |  |  | ✓ | 总速比 |
| maximumSpeed (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s | ✓ | ✓ | 最大线速度（空载） |
| maximumAcceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线加速度（空载） |
| maximumDeceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线减速度（空载） |
| maximumSpeed (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s | ✓ | ✓ | 最大线速度（满载） |
| maximumAcceleration  (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线加速度（满载） |
| maximumDeceleration  (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线减速度（满载） |
| stroke | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ | ✓ | 行程 |
| load | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg |  | ✓ | 负载 |


## bluetooth


## camera


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| focalLength | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  | ✓ | 焦距 |
| exposure | DATA_DOUBLE | 0.0 | 0.0~99.0 | s |  | ✓ | 曝光时长范围 |
| needCalib | DATA_BOOL | False | - |  | ✓ | ✓ | 是否需要标定 |


### pictureAttr - 图像属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| scanRangeHorizonStart | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 水平视场角起始 |
| scanRangeHorizonEnd | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 水平视场角终止 |
| scanRangeVerticalStart | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 垂直视场角起始 |
| scanRangeVerticalEnd | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 垂直视场角终止 |
| resolutionH | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI | ✓ | ✓ | 分辨率H |
| resolutionW | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI | ✓ | ✓ | 分辨率W |
| codecMode | DATA_STRING | - | - |  |  | ✓ | 视频编码标准 |
| frameRate | DATA_DOUBLE | 0.0 | 0.0~9999.0 | fps |  | ✓ | 最大帧率 |


### resultAttr - 识别属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| resultType | DATA_STRING | - | - |  |  | ✓ | 识别结果类型 |
| resultValue | DATA_STRING | - | - |  |  | ✓ | 识别结果 |
| scanDistence | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  | ✓ | 有效扫描距离 |
| accuracy | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  | ✓ | 识别精度 |


## carrier


### carrierAttr - 载台属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| ratedLoad | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg | ✓ |  | 额定承载 |
| carrierType | DATA_COMBOX | countertop | - |  | ✓ |  | 载台类型 |


## charge


### chargerAttr - 充电属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| dir | DATA_COMBOX | AGV_CHARGE_RELAY_DIR_BACK | - |  |  |  | 充电方向 |
| type | DATA_COMBOX | IOCharger | - |  |  |  | 类型 |
| voltage | DATA_DOUBLE | 0.0 | 0.0~999.0 | V |  | ✓ | 工作电压 |
| contactResistance | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mΩ |  | ✓ | 接触电阻 |
| insulationResistance | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mΩ |  | ✓ | 绝缘电阻 |
| maxCurrent | DATA_DOUBLE | 0.0 | 0.0~999.0 | A |  | ✓ | 最大工作电流 |
| maxTemperature | DATA_DOUBLE | 0.0 | 0.0~999.0 | ℃ |  | ✓ | 最高工作温度 |


## clamp


### clampAttr - 夹持属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| structureForm | DATA_COMBOX | leadScrew | - |  |  | ✓ | 结构形式 |
| drivingForm | DATA_COMBOX | servo | - |  |  | ✓ | 驱动形式 |
| transmissionRelationship | DATA_COMBOX | linear | - |  |  | ✓ | 传动关系 |
| lead | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm |  | ✓ | 导程 |
| totalSpeedRatio | DATA_DOUBLE | 0.0 | 0.0~9999.0 |  |  | ✓ | 总速比 |
| maximumSpeed (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s | ✓ | ✓ | 最大线速度（空载） |
| maximumAcceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线加速度（空载） |
| maximumDeceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线减速度（空载） |
| maximumSpeed (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s | ✓ | ✓ | 最大线速度（满载） |
| maximumAcceleration  (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线加速度（满载） |
| maximumDeceleration  (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线减速度（满载） |
| stroke | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ | ✓ | 行程 |
| load | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg |  | ✓ | 负载 |


## codeReader


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| focalLength | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  | ✓ | 焦距 |
| exposure | DATA_DOUBLE | 0.0 | 0.0~99.0 | s |  | ✓ | 曝光时长范围 |
| needCalib | DATA_BOOL | False | - |  | ✓ | ✓ | 是否需要标定 |


### pictureAttr - 图像属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| scanRangeHorizonStart | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 水平视场角起始 |
| scanRangeHorizonEnd | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 水平视场角终止 |
| scanRangeVerticalStart | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 垂直视场角起始 |
| scanRangeVerticalEnd | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 垂直视场角终止 |
| resolutionH | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI | ✓ | ✓ | 分辨率H |
| resolutionW | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI | ✓ | ✓ | 分辨率W |
| codecMode | DATA_STRING | - | - |  |  | ✓ | 视频编码标准 |
| frameRate | DATA_DOUBLE | 0.0 | 0.0~9999.0 | fps |  | ✓ | 最大帧率 |


### resultAttr - 识别属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| resultType | DATA_STRING | - | - |  |  | ✓ | 识别结果类型 |
| resultValue | DATA_STRING | - | - |  |  | ✓ | 识别结果 |
| scanDistence | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  | ✓ | 有效扫描距离 |
| accuracy | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  | ✓ | 识别精度 |


## collisionBaro


### collisionAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| thresholdBaro | DATA_DOUBLE | 0.0 | 0.0~220.0 | Pa | ✓ |  | 气压阈值 |


## collisionPize


### collisionAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| normalVol | DATA_DOUBLE | 0.0 | 0.0~220.0 | V | ✓ |  | 正常电压值 |
| thresholdVol | DATA_DOUBLE | 0.0 | 0.0~220.0 | V | ✓ |  | 浮动阈值 |
| triggerVol | DATA_DOUBLE | 0.0 | 0.0~220.0 | V | ✓ |  | 触发电压值 |


## comDo


## covers


## diffChassis


### motionCenterAttr - 运动中心参数

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| headOffset(Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离车头距离（空载） |
| tailOffset(Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离车尾距离（空载） |
| leftOffset(Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离左侧距离（空载） |
| rightOffset(Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离右侧距离（空载） |
| headOffset (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离车头距离（满载） |
| tailOffset (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离车尾距离（满载） |
| leftOffset (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离左侧距离（满载） |
| rightOffset (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离右侧距离（满载） |


### chassisAttr - 底盘参数

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| wheelsNum | DATA_INT32 | 1 | 1~99 | 个 | ✓ |  | 轮组个数 |
| maxAcceleration(Idle) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 最大线加速度（空载） |
| maxDeceleration(Idle) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 最大线减速度（空载） |
| maxSpeed(Idle) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s | ✓ |  | 最大速度（空载） |
| maxAcceleration (Full Load) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 最大线加速度（满载） |
| maxDeceleration (Full Load) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 最大线减速度（满载） |
| maxSpeed (Full Load) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s | ✓ |  | 最大速度（满载） |
| avoidMaxDec (Idle) | DATA_DOUBLE | 500.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 避障最大减速度（空载） |
| avoidMaxDec (Full Load) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 避障最大减速度（满载） |
| avoidRotMaxAngDec (Idle) | DATA_DOUBLE | 10.0 | 1.0~9999.0 | °/s2 | ✓ |  | 避障最大旋转减速度（空载） |
| avoidRotMaxAngDec (Full Load) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | °/s2 | ✓ |  | 避障最大旋转减速度（满载） |
| rotateMaxAngAcceleration (Idle) | DATA_DOUBLE | 1.0 | 1.0~360.0 | °/s2 | ✓ |  | 最大角加速度（空载） |
| rotateMaxAngDeceleration (Idle) | DATA_DOUBLE | 1.0 | 1.0~360.0 | °/s2 | ✓ |  | 最大角减速度（空载） |
| rotateMaxAngSpeed (Idle) | DATA_DOUBLE | 6.0 | 1.0~360.0 | °/s | ✓ |  | 最大角速度（空载） |
| rotateMaxAngAcceleration (Full Load) | DATA_DOUBLE | 1.0 | 1.0~360.0 | °/s2 | ✓ |  | 最大角加速度（满载） |
| rotateMaxAngDeceleration (Full Load) | DATA_DOUBLE | 1.0 | 1.0~360.0 | °/s2 | ✓ |  | 最大角减速度（满载） |
| rotateMaxAngSpeed (Full Load) | DATA_DOUBLE | 6.0 | 1.0~360.0 | °/s | ✓ |  | 最大角速度（满载） |
| rotateDiameter | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 旋转直径 |
| maxClimbingAngle | DATA_DOUBLE | 0.0 | 0.0~90.0 | ° |  | ✓ | 爬坡能力 |
| totalLoadWeight | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg | ✓ | ✓ | 额定负载 |
| selfWeight | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg |  | ✓ | 自重 |


### wheelsAttr - 轮组属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| wheelSpace | DATA_DOUBLE | 0.0 | 1.0~9999.0 | mm | ✓ |  | 轮间距 |
| locCoordNX | DATA_DOUBLE | 0.0 | -9999.0~9999.0 | mm |  | ✓ | 轴中心X坐标 |
| locCoordNY | DATA_DOUBLE | 0.0 | -9999.0~9999.0 | mm |  | ✓ | 轴中心Y坐标 |
| locCoordNZ | DATA_DOUBLE | 0.0 | -9999.0~9999.0 | mm |  | ✓ | 轴中心Z坐标 |


## diffSteerWheel


### wheelAttr - 基本属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| wheelRadius | DATA_DOUBLE | 0.0 | 1.0~999.0 | mm | ✓ |  | 轮半径 |
| wheelSpace | DATA_DOUBLE | 0.0 | 1.0~999.0 | mm | ✓ |  | 轮间距 |
| angleLmtPos | DATA_DOUBLE | 0.0 | 0.0~175.0 | ° |  |  | 正限位角度 |
| angleLmtNeg | DATA_DOUBLE | 0.0 | -175.0~0.0 | ° |  |  | 负限位角度 |
| rotOmgLmt | DATA_DOUBLE | 0.0 | 0.0~9999.0 | °/s |  | ✓ | 转向能力(最大) |


### angleSensor - 转向反馈

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| angleSensorType | DATA_COMBOX | GROUP_CALI_ABS_EXTERNAL | - |  |  |  | 类型 |


### linkMotorAttr - 电机

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| relateLeftMotor | DATA_FIXED_E | - | - |  |  |  | 左行走电机 |
| relateRightMotor | DATA_FIXED_E | - | - |  |  |  | 右行走电机 |


## diffWheel


### wheelAttr - 基本属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| wheelRadius | DATA_DOUBLE | 1.0 | 1.0~999.0 | mm | ✓ |  | 轮半径 |


### linkMotorAttr - 关联电机

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| relateMotor | DATA_FIXED_E | - | - |  |  |  | 行走电机 |


## encoderProcessor


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## ethernetSwitch


## fifthGeneration


## generalAnalogDistance


### analogDistanceAttr - 模拟量测距属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| minDist | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  |  | 最小检测范围 |
| maxDist | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  |  | 最大检测范围 |
| compType | DATA_COMBOX | ANALOG_DISTANCE_LASER | - |  |  | ✓ | 器件类型 |
| accessType | DATA_COMBOX | VOLTAGE_ANALOG_SENSOR | - |  |  |  | 接入类型 |


## gyro


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| yawRangeMin | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 偏航角最小值 |
| yawRangeMax | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 偏航角最大值 |
| rollRangeMin | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 翻滚角最小值 |
| rollRangeMax | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 翻滚角最大值 |
| pitchRangeMin | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 俯仰角最小值 |
| pitchRangeMax | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 俯仰角最大值 |
| angularResolution | DATA_DOUBLE | 0.0 | 0.0~180.0 | ° |  | ✓ | 角度分辨率 |
| accelerationResolution | DATA_DOUBLE | 0.0 | 0.0~360.0 | °/s |  | ✓ | 加速度分辩率 |
| accelerationAccuracy | DATA_DOUBLE | 0.0 | 0.0~360.0 | °/s |  | ✓ | 加速度精度 |


## horizontalSteerWheel


### wheelAttr - 基本属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| wheelRadius | DATA_DOUBLE | 0.0 | 1.0~999.0 | mm | ✓ |  | 轮半径 |
| angleLmtPos | DATA_DOUBLE | 0.0 | 0.0~175.0 | ° |  |  | 正限位角度 |
| angleLmtNeg | DATA_DOUBLE | 0.0 | -175.0~0.0 | ° |  |  | 负限位角度 |
| rotOmgLmt | DATA_DOUBLE | 0.0 | 0.0~9999.0 | °/s |  | ✓ | 转向能力(最大) |


### angleSensor - 转向反馈

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| angleSensorType | DATA_COMBOX | GROUP_CALI_ABS_INTERNAL | - |  |  |  | 类型 |


### linkMotorAttr - 电机

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| relateRotMotor | DATA_FIXED_E | - | - |  |  |  | 转向电机 |
| relateWalkMotor | DATA_FIXED_E | - | - |  |  |  | 行走电机 |


## incrementalEncode


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| needCalib | DATA_BOOL | False | - |  | ✓ | ✓ | 是否需要标定 |


### encodeAttr - 编码器属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| lineCount | DATA_INT32 | 0 | 0~99999 |  | ✓ |  | 线数 |
| isInvert | DATA_BOOL | False | - |  |  |  | 是否反向 |


## infrared


## interfaceModule


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## lamp


### lightAttr - 灯光属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| lightType | DATA_COMBOX | projectionLights | - |  |  | ✓ | 指示灯类型 |
| lightColor | DATA_COMBOX | blue | - |  |  | ✓ | 指示灯颜色 |


## laser


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| waveLength | DATA_DOUBLE | 0.0 | 0.0~99999.0 | nm |  | ✓ | 波长 |
| antiLight | DATA_DOUBLE | 0.0 | 0.0~9999.0 | klux |  | ✓ | 抗光干扰 |
| needCalib | DATA_BOOL | False | - |  | ✓ | ✓ | 是否需要标定 |


### scanAttr - 扫描属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| scanDirect | DATA_COMBOX | SCAN_COUNTERCLOCKWISE | - |  | ✓ | ✓ | 扫描方向 |
| usageMode | DATA_COMBOX | PClOUD_LASER | - |  |  |  | 应用方式 |


## lift


### liftAttr - 举升属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| structureForm | DATA_COMBOX | leadScrewLift | - |  | ✓ | ✓ | 结构形式 |
| drivingForm | DATA_COMBOX | HYD | - |  | ✓ | ✓ | 驱动形式 |
| transmissionRelationship | DATA_COMBOX | line | - |  | ✓ | ✓ | 传动关系 |
| sensorMode | DATA_COMBOX | zero | - |  | ✓ | ✓ | 传感模式 |
| lead | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm |  |  | 导程 |
| totalSpeedRatio | DATA_DOUBLE | 0.0 | 0.0~9999.0 |  |  |  | 总速比 |
| maximumSpeed (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s | ✓ |  | 最大线速度（空载） |
| maximumAcceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线加速度（空载） |
| maximumDeceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线减速度（空载） |
| maximumSpeed (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s | ✓ | ✓ | 最大线速度（满载） |
| maximumAcceleration  (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线加速度（满载） |
| maximumDeceleration  (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线减速度（满载） |
| stroke | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 行程 |
| load | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg |  | ✓ | 负载 |


## linear


### linearAttr - 线性属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| structureForm | DATA_COMBOX | clampStretch | - |  |  | ✓ | 结构形式 |
| drivingForm | DATA_COMBOX | servo | - |  |  | ✓ | 驱动形式 |
| transmissionRelationship | DATA_COMBOX | linear | - |  |  | ✓ | 传动关系 |
| sensorMode | DATA_COMBOX | zeroSensor | - |  |  | ✓ | 传感模式 |
| totalSpeedRatio | DATA_DOUBLE | 0.0 | 0.0~9999.0 |  |  | ✓ | 总速比 |
| maximumSpeed (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s | ✓ | ✓ | 最大线速度（空载） |
| maximumAcceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线加速度（空载） |
| maximumDeceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线减速度（空载） |
| maximumSpeed (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s | ✓ | ✓ | 最大线速度（满载） |
| maximumAcceleration  (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线加速度（满载） |
| maximumDeceleration  (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线减速度（满载） |
| stroke | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ | ✓ | 行程 |
| load | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg |  | ✓ | 负载 |


## power


### powerAttr - 能源属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| outputCurrent | DATA_DOUBLE | 0.0 | 0.0~999.0 | A |  | ✓ | 输出电流 |
| maxInputCurrent | DATA_DOUBLE | 0.0 | 0.0~999.0 | A |  | ✓ | 最大输入电流(AC) |
| minOutputVoltage | DATA_DOUBLE | 0.0 | 0.0~999.0 | V |  | ✓ | 最低输出电压 |
| maxOutputVoltage | DATA_DOUBLE | 0.0 | 0.0~999.0 | V |  | ✓ | 最高输出电压 |
| minInputVoltage | DATA_DOUBLE | 0.0 | 0.0~999.0 | V |  | ✓ | 最低输入电压 |
| maxInputVoltage | DATA_DOUBLE | 0.0 | 0.0~999.0 | V |  | ✓ | 最高输入电压 |
| efficiency | DATA_DOUBLE | 0.0 | 0.0~100.0 | % |  | ✓ | 效率 |
| factor | DATA_DOUBLE | 0.0 | 0.0~99.0 |  |  | ✓ | 功率因数 |
| workTempMin | DATA_DOUBLE | 0.0 | -999.0~999.0 | ℃ |  | ✓ | 最低工作温度 |
| workTempMax | DATA_DOUBLE | 0.0 | -999.0~999.0 | ℃ |  | ✓ | 最高工作温度 |
| relativeHumidity | DATA_DOUBLE | 0.0 | -999.0~999.0 | % |  | ✓ | 工作相对湿度 |
| firmwareVersion | DATA_STRING | - | - |  |  | ✓ | 固件版本 |


## powerController


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## prechargeController


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## proximitySensor


## pullWireEncode


### encodeAttr - 编码器属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| wheelCirc | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm |  |  | 轮周长 |
| absEncodeType | DATA_COMBOX | SSI_ENCODER | - |  |  |  | 编码器类型 |
| resolutionMode | DATA_COMBOX | RES_BIT_MODE | - |  |  |  | 分辨率模式 |
| isInvert | DATA_BOOL | False | - |  | ✓ |  | 是否反向 |


## rotate


### rotateAttr - 私有属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| structureForm | DATA_COMBOX | wormGear | - |  | ✓ | ✓ | 结构形式 |
| drivingForm | DATA_COMBOX | servo | - |  | ✓ | ✓ | 驱动形式 |
| transmissionRelationship | DATA_COMBOX | line | - |  | ✓ | ✓ | 传动关系 |
| sensorMode | DATA_COMBOX | zero | - |  | ✓ | ✓ | 传感模式 |
| lead | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ | ✓ | 导程 |
| totalSpeedRatio | DATA_DOUBLE | 0.0 | 0.0~9999.0 |  | ✓ |  | 总速比 |
| maximumSpeed (Idle) | DATA_DOUBLE | 0.0 | 0.0~360.0 | °/s | ✓ |  | 最大角速度（空载） |
| maximumAcceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~360.0 | °/s^2 | ✓ | ✓ | 最大角加速度（空载） |
| maximumDeceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~360.0 | °/s^2 | ✓ | ✓ | 最大角减速度（空载） |
| maximumSpeed (Full Load) | DATA_DOUBLE | 0.0 | 0.0~360.0 | °/s | ✓ | ✓ | 最大角速度（满载） |
| maximumAcceleration (Full Load) | DATA_DOUBLE | 0.0 | 0.0~360.0 | °/s^2 | ✓ | ✓ | 最大角加速度（满载） |
| maximumDeceleration (Full Load) | DATA_DOUBLE | 0.0 | 0.0~360.0 | °/s^2 | ✓ | ✓ | 最大角减速度（满载） |
| negativeLimit | DATA_DOUBLE | 0.0 | -360.0~360.0 | ° | ✓ | ✓ | 负限位 |
| positiveLimit | DATA_DOUBLE | 0.0 | -360.0~360.0 | ° | ✓ | ✓ | 正限位 |
| load | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg |  | ✓ | 负载 |


## safetyController


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## safetyIOModule


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## segDisplays


## servo


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| inputVoltage | DATA_DOUBLE | 0.0 | 0.0~999.0 | V |  | ✓ | 输入电压 |
| inputCurrent | DATA_DOUBLE | 0.0 | 0.0~999.0 | A |  | ✓ | 输入电流 |
| overloadCapacity | DATA_DOUBLE | 0.0 | 0.0~99.0 | 倍 | ✓ | ✓ | 过载能力 |
| overloadTime | DATA_DOUBLE | 0.0 | 0.0~99.0 | S | ✓ | ✓ | 过载时长 |
| servoType | DATA_COMBOX | MOTOR_SERVO_TYPE_AUTO | - |  |  |  | 伺服类型 |


## steerChassis


### motionCenterAttr - 运动中心参数

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| headOffset(Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离车头距离（空载） |
| tailOffset(Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离车尾距离（空载） |
| leftOffset(Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离左侧距离（空载） |
| rightOffset(Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离右侧距离（空载） |
| headOffset (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离车头距离（满载） |
| tailOffset (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离车尾距离（满载） |
| leftOffset (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离左侧距离（满载） |
| rightOffset (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 距离右侧距离（满载） |


### chassisAttr - 底盘参数

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| wheelsNum | DATA_INT32 | 1 | 1~99 | 个 | ✓ |  | 轮组个数 |
| maxAcceleration(Idle) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 最大线加速度（空载） |
| maxDeceleration(Idle) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 最大线减速度（空载） |
| maxSpeed(Idle) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s | ✓ |  | 最大速度（空载） |
| maxAcceleration (Full Load) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 最大线加速度（满载） |
| maxDeceleration (Full Load) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 最大线减速度（满载） |
| maxSpeed (Full Load) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s | ✓ |  | 最大速度（满载） |
| avoidMaxDec (Idle) | DATA_DOUBLE | 500.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 避障最大减速度（空载） |
| avoidMaxDec (Full Load) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | mm/s2 | ✓ |  | 避障最大减速度（满载） |
| avoidRotMaxAngDec (Idle) | DATA_DOUBLE | 10.0 | 1.0~9999.0 | °/s2 | ✓ |  | 避障最大旋转减速度（空载） |
| avoidRotMaxAngDec (Full Load) | DATA_DOUBLE | 1.0 | 1.0~9999.0 | °/s2 | ✓ |  | 避障最大旋转减速度（满载） |
| rotateMaxAngAcceleration (Idle) | DATA_DOUBLE | 1.0 | 1.0~360.0 | °/s2 | ✓ |  | 最大角加速度（空载） |
| rotateMaxAngDeceleration (Idle) | DATA_DOUBLE | 1.0 | 1.0~360.0 | °/s2 | ✓ |  | 最大角减速度（空载） |
| rotateMaxAngSpeed (Idle) | DATA_DOUBLE | 6.0 | 1.0~360.0 | °/s | ✓ |  | 最大角速度（空载） |
| rotateMaxAngAcceleration (Full Load) | DATA_DOUBLE | 1.0 | 1.0~360.0 | °/s2 | ✓ |  | 最大角加速度（满载） |
| rotateMaxAngDeceleration (Full Load) | DATA_DOUBLE | 1.0 | 1.0~360.0 | °/s2 | ✓ |  | 最大角减速度（满载） |
| rotateMaxAngSpeed (Full Load) | DATA_DOUBLE | 6.0 | 1.0~360.0 | °/s | ✓ |  | 最大角速度（满载） |
| rotateDiameter | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm | ✓ |  | 旋转直径 |
| maxClimbingAngle | DATA_DOUBLE | 0.0 | 0.0~90.0 | ° |  | ✓ | 爬坡能力 |
| totalLoadWeight | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg | ✓ | ✓ | 额定负载 |
| selfWeight | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg |  | ✓ | 自重 |


### wheelsAttr - 轮组属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| locCoordNX | DATA_DOUBLE | 0.0 | -9999.0~9999.0 | mm |  | ✓ | X坐标 |
| locCoordNY | DATA_DOUBLE | 0.0 | -9999.0~9999.0 | mm |  | ✓ | Y坐标 |
| locCoordNZ | DATA_DOUBLE | 0.0 | -9999.0~9999.0 | mm |  | ✓ | Z坐标 |


## stereo


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| focalLength | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  | ✓ | 焦距 |
| exposure | DATA_DOUBLE | 0.0 | 0.0~99.0 | s |  | ✓ | 曝光时长范围 |
| needCalib | DATA_BOOL | False | - |  | ✓ | ✓ | 是否需要标定 |


### pictureAttr - 图像属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| scanRangeHorizonStart | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 水平视场角起始 |
| scanRangeHorizonEnd | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 水平视场角终止 |
| scanRangeVerticalStart | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 垂直视场角起始 |
| scanRangeVerticalEnd | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 垂直视场角终止 |
| resolutionH | DATA_COMBOX | 360 | - |  |  | ✓ | 分辨率H |
| codecMode | DATA_STRING | - | - |  |  | ✓ | 视频编码标准 |
| frameRate | DATA_DOUBLE | 0.0 | 0.0~9999.0 | fps |  | ✓ | 最大帧率 |


### pointAttr - 深度相机属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| scanRangeHorizonStart | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 水平视场角起始 |
| scanRangeHorizonEnd | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 水平视场角终止 |
| scanRangeVerticalStart | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 垂直视场角起始 |
| scanRangeVerticalEnd | DATA_DOUBLE | 0.0 | -180.0~180.0 | ° |  | ✓ | 垂直视场角终止 |
| resolutionH | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI | ✓ | ✓ | 分辨率H |
| resolutionW | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI | ✓ | ✓ | 分辨率W |
| codecMode | DATA_STRING | - | - |  |  | ✓ | 视频编码标准 |
| frameRate | DATA_DOUBLE | 0.0 | 0.0~9999.0 | fps |  | ✓ | 最大帧率 |


### resultAttr - 识别属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| scanDistence | DATA_DOUBLE | 0.0 | 0.0~99999.0 | mm |  | ✓ | 有效扫描距离 |


## subBattery


### batteryAttr - 电池属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| capacity | DATA_DOUBLE | 0.0 | 0.0~999.0 | Ah |  | ✓ | 电池容量 |
| stdChargeCurrent | DATA_DOUBLE | 0.0 | 0.0~999.0 | A |  | ✓ | 标准充电电流 |
| maxChargeCurrent | DATA_DOUBLE | 0.0 | 0.0~999.0 | A |  | ✓ | 最大充电电流 |
| stdDischargeCurrent | DATA_DOUBLE | 0.0 | 0.0~999.0 | A |  | ✓ | 标准放电电流 |
| maxDischargeCurrent | DATA_DOUBLE | 0.0 | 0.0~999.0 | A |  | ✓ | 最大放电电流 |
| voltage | DATA_DOUBLE | 0.0 | 0.0~999.0 | V |  | ✓ | 额定电压 |
| maxPower | DATA_DOUBLE | 0.0 | 0.0~9999.0 | W |  | ✓ | 最大功率 |
| resistance | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mΩ |  | ✓ | 内阻 |
| cycleLife | DATA_INT32 | 0 | 0~99999 | 次 |  | ✓ | 循环寿命 |
| chargeTempMin | DATA_DOUBLE | 0.0 | -50.0~135.0 | ℃ |  | ✓ | 最低充电温度 |
| chargeTempMax | DATA_DOUBLE | 0.0 | -50.0~135.0 | ℃ |  | ✓ | 最高充电温度 |
| dischargeTempMin | DATA_DOUBLE | 0.0 | -50.0~135.0 | ℃ |  | ✓ | 最低放电温度 |
| dischargeTempMax | DATA_DOUBLE | 0.0 | -50.0~135.0 | ℃ |  | ✓ | 最高放电温度 |


## subButton


### buttonAttr - 按钮属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| buttonType | DATA_COMBOX | BUTTON_COMP_NOT_EMCY | - |  | ✓ |  | 按钮类型 |
| switchMode | DATA_COMBOX | knob | - |  | ✓ | ✓ | 开关方式 |
| buttonLamp | DATA_COMBOX | BUTTON_LAMP_NULL | - |  |  |  | 按钮灯控制 |
| selfLock | DATA_BOOL | False | - |  | ✓ |  | 是否自锁 |


## subDriver


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| inputVoltage | DATA_DOUBLE | 24.0 | 0.0~999.0 | V |  | ✓ | 输入电压 |
| inputCurrent | DATA_DOUBLE | 0.5 | 0.0~999.0 | A |  | ✓ | 输入电流 |
| overloadCapacity | DATA_DOUBLE | 1.5 | 0.0~99.0 | 倍 | ✓ | ✓ | 过载能力 |
| overloadTime | DATA_DOUBLE | 3.0 | 0.0~99.0 | S | ✓ | ✓ | 过载时长 |
| type | DATA_COMBOX | MOTOR_SERVO_TYPE_AUTO | - |  |  |  | 驱动类型 |


## subHandOperator


## subIntergratedController


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## subMainCPU


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| isWithGyro | DATA_COMBOX | no | - |  |  |  | 是否有板载陀螺仪 |
| isWithUpCamera | DATA_COMBOX | no | - |  |  |  | 是否有板载上读码头 |
| isWithDownCamera | DATA_COMBOX | no | - |  |  |  | 是否有板载下读码头 |


## subScreen


### screenAttr - 屏幕属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| resolutionWidth | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI |  | ✓ | 分辨率宽 |
| resolutionHeight | DATA_DOUBLE | 0.0 | 0.0~9999.0 | PPI |  | ✓ | 分辨率高 |
| screenSize | DATA_DOUBLE | 0.0 | 0.0~99.0 | inch |  | ✓ | 屏幕尺寸 |


## tempSensor


### sensorAttr - 传感属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| threshold | DATA_DOUBLE | 0.0 | 0.0~999.0 | ℃ |  |  | 检测阈值 |
| temperatureRangeMin | DATA_DOUBLE | 0.0 | -999.0~999.0 | ℃ |  |  | 温度最小值 |
| temperatureRangeMax | DATA_DOUBLE | 0.0 | -999.0~999.0 | ℃ |  |  | 温度最大值 |


## translation


### translateAttr - 平移属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| structureForm | DATA_COMBOX | electircRoll | - |  |  | ✓ | 结构形式 |
| drivingForm | DATA_COMBOX | servo | - |  |  | ✓ | 驱动形式 |
| maximumSpeed (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s | ✓ | ✓ | 最大线速度（空载） |
| maximumAcceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线加速度（空载） |
| maximumDeceleration (Idle) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线减速度（空载） |
| maximumSpeed (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s | ✓ | ✓ | 最大线速度（满载） |
| maximumAcceleration  (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线加速度（满载） |
| maximumDeceleration  (Full Load) | DATA_DOUBLE | 0.0 | 0.0~9999.0 | mm/s^2 | ✓ | ✓ | 最大线减速度（满载） |
| load | DATA_DOUBLE | 0.0 | 0.0~9999.0 | kg |  | ✓ | 额定负载 |


## ultrasonicProcessor


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## ultrasonicSensor


## valveCtrl


### valveCtrlAttr - 控制阀属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| ctrlMode | DATA_COMBOX | VALVE_DRIVE_VOLT | - |  |  |  | 控制模式 |
| ratedVolt | DATA_DOUBLE | 0.0 | 0.0~99999.0 | V | ✓ |  | 额定电压 |
| ratedCur | DATA_DOUBLE | 0.0 | 0.0~99999.0 | A | ✓ |  | 额定电流 |
| powerVlot | DATA_DOUBLE | 0.0 | 0.0~99999.0 | V | ✓ |  | 供电电压 |


## verticalSteerWheel


### wheelAttr - 基本属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| wheelRadius | DATA_DOUBLE | 0.0 | 1.0~999.0 | mm | ✓ |  | 轮半径 |
| angleLmtPos | DATA_DOUBLE | 0.0 | 0.0~175.0 | ° |  |  | 正限位角度 |
| angleLmtNeg | DATA_DOUBLE | 0.0 | -175.0~0.0 | ° |  |  | 负限位角度 |
| rotOmgLmt | DATA_DOUBLE | 0.0 | 0.0~9999.0 | °/s |  | ✓ | 转向能力(最大) |


### angleSensor - 转向反馈

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| angleSensorType | DATA_COMBOX | GROUP_CALI_ABS_INTERNAL | - |  |  |  | 类型 |


### linkMotorAttr - 电机

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| relateRotMotor | DATA_FIXED_E | - | - |  |  |  | 转向电机 |
| relateWalkMotor | DATA_FIXED_E | - | - |  |  |  | 行走电机 |


## warningLight


## weakSteerWheel


### wheelAttr - 基本属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| wheelRadius | DATA_DOUBLE | 0.0 | 1.0~999.0 | mm | ✓ |  | 轮半径 |
| wheelSpace | DATA_DOUBLE | 0.0 | 1.0~999.0 | mm | ✓ |  | 轮间距 |


### angleSensor - 转向反馈

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| angleSensorType | DATA_COMBOX | GROUP_CALI_INC_EXTERNAL | - |  |  |  | 类型 |


## weakTurnWheel


### wheelAttr - 基本属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| wheelRadius | DATA_DOUBLE | 0.0 | 1.0~999.0 | mm | ✓ |  | 轮半径 |
| angleLmtPos | DATA_DOUBLE | 0.0 | 0.0~175.0 | ° |  |  | 正限位角度 |
| angleLmtNeg | DATA_DOUBLE | 0.0 | -175.0~0.0 | ° |  |  | 负限位角度 |
| rotOmgLmt | DATA_DOUBLE | 0.0 | 0.0~9999.0 | °/s |  | ✓ | 转向能力(最大) |


### angleSensor - 转向反馈

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| angleSensorType | DATA_COMBOX | GROUP_CALI_ABS_INTERNAL | - |  |  |  | 类型 |


### linkMotorAttr - 电机

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| relateRotMotor | DATA_FIXED_E | - | - |  |  |  | 转向电机 |


## weighProcessor


### boardAttr - 控制板属性

| 属性Key | 类型 | 默认值 | 范围 | 单位 | 必填 | 隐藏 | 描述 |
|:--------|:-----|:-------|:-----|:-----|:-----|:-----|:-----|
| chipPlatform | DATA_STRING | - | - |  | ✓ | ✓ | 芯片平台 |
| softwareSpec | DATA_STRING | - | - |  | ✓ |  | 软件规格 |
| offsetAddress | DATA_STRING | - | - |  | ✓ | ✓ | 偏移地址拨码 |


## weighSensor
