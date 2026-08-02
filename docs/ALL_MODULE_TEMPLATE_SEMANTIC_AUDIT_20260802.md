# AMR Studio V4 全量模块模板语义审计与构建意义分析

## 1. 范围、证据和结论边界

本次分析覆盖 `src/backend/resources/modules/*.json` 的全部 143 个后端模块模板，同时交叉检查前端 `ModuleAttrTem` 的通用属性、私有属性、接口参数和功能设置模板。

分析对象包括：底盘/轮组、驱动器/电机/编码器、激光/3D 激光/TOF/双目/陀螺仪/超声/接近/碰撞/温度/称重/读码/RFID、主控和安全控制器、IO 与网络、按钮、灯、显示、音频、电池和充电、举升/平移/旋转/夹具等执行机构，以及车体和遥控器。

遵循以下约束：

1. 模板中明确存在的字段和结构，才可以作为项目事实。
2. 行业资料只能解释工程意义和提出校验项，不能据此虚构项目参数、默认值、连接关系或描述信息。
3. “模板允许配置”不等于“模型已经配置完整”；空引用、空接口或缺少功能关系都必须保留为未完成状态。
4. 本报告把“明确问题”“工程风险”“需要人工确认的疑问”分开，避免把推断写成事实。

## 2. 全量扫描结果

### 2.1 后端模块数量和分类

后端模块 JSON 全部可解析：143/143。模块按模板中的 `generalAttr.main_module_type` 分组如下：

| 主分类 | 数量 | 模型对象 |
|---|---:|---|
| `sensor` | 40 | 激光、3D 激光、TOF、双目、编码器、陀螺仪、碰撞、接近、超声、温度、称重、读码等；其中混入了部分舵轮复合模板 |
| `driver` | 20 | 电机通用模板、产品电机、伺服驱动器、产品驱动器、立式舵轮复合产品 |
| `driveWheel` | 12 | 差速轮、差速舵轮、立式/卧式舵轮、弱能力舵轮、产品级轮组 |
| `actor` | 8 | 举升、直线、旋转、平移、夹具、阻挡等执行机构 |
| `extendedlnterface` | 7 | IO、扩展接口、安全 IO、交换机、接口板 |
| `communication` | 7 | 5G、Wi-Fi、蓝牙、RFID、PIO 等通信对象 |
| `sensorProcessor` | 6 | 编码器、TOF、双目、超声、称重处理器 |
| `chassis` | 5 | 差速底盘、舵轮底盘及 Q3 产品底盘 |
| `battery` | 5 | 电池、充电、供电和产品电池 |
| `screen` | 5 | 普通屏、HDMI 屏、数码段码屏及产品屏 |
| `intergratedController` | 5 | 集成控制器和安全控制器 |
| `audio` | 4 | 音频输入、音频输出、CAN 音频和产品扬声器 |
| `button` | 4 | 通用、急停、非急停和线束按钮 |
| `light` | 4 | 普通灯、警示灯和产品灯 |
| `mainCPU` | 4 | 主 CPU 通用模板和产品主控 |
| `energyController` | 3 | 电源控制、预充控制和产品电源板 |
| `autobody` | 2 | 载荷承载结构、外罩 |
| `handOperator` | 1 | 遥控器 |
| 未分类 | 1 | `demo_module` |

### 2.2 分类异常

以下模板实际表现为轮组或整机级复合对象，但当前主分类不是独立的 `composite` 或 `assembly`：

- `DIFF_STEER_WHEEL(单差速舵轮)`、`DIFF_STEER_WHEELS_DOUBL(双差速舵轮)` 被归入 `sensor`。
- `VER_STEER_WHEELS_DOUBL(双立式舵轮)` 被归入 `driver`。
- `TYD150-*`、`DWD-R-Q3`、`F6-2000 SteerWheel`、`H8-Steerwheel` 等产品级轮组与普通轮组共用 `driveWheel`，但内部组合层级不同。

这不是命名问题，而是建模边界问题。分类会直接影响模块库检索、构建向导入口、可配置字段、组合关系校验和最终导出审计。建议后续增加独立的复合模块类型，或至少增加明确的 `module_level`/`composition_kind` 元数据；在未修改模板前，不应通过代码猜测其层级。

### 2.3 前端模板完整性

前端模板扫描到 146 个 JSON，其中 144 个可解析，以下 2 个文件存在尾随逗号：

- `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Struct_Param/AcotrStructParam.json`
- `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/CAN/InterfaceParam.json`

后端模块都具有 `generalAttr`、`privateAttr`、`interfaceAbility`、`interfaceParams` 四类顶层结构；因此前端私有属性目录不能被当作完整模块定义。前端还存在功能关系模板 `RelatedResetBtn`、`RelatedEmcyBtn`、`RelatedCollision`、`RelatedSSBtn`、`RelatedManualBtn`，说明功能关联是独立维度，不能只依靠模块属性表达。

## 3. 模型构建的统一语义

完整构建应当经过以下层次，而不是直接把界面字段拼装成 JSON：

```text
底盘与运动学
  -> 轮组拓扑和安装位置
  -> 电机、驱动器、编码器及处理器实例
  -> 组成/控制/反馈逻辑引用
  -> 电源、信号、总线和 IO 电气连接
  -> 坐标系、安装姿态和标定
  -> 功能块、急停/碰撞/手动/复位关联
  -> 能力与约束审计
  -> protobuf/cmodel 编码和导出
```

每个模块至少要区分四种关系：

1. **组成关系**：例如轮组由行走电机、转向电机、驱动器和编码器组成。
2. **控制关系**：驱动器控制哪个电机轴。
3. **反馈关系**：哪个编码器反馈电机轴、轮轴、转向输出轴或执行机构轴。
4. **电气关系**：哪个具体接口连接到哪个总线、控制器、IO 或供电端。

当前模板能够部分表达前三类，但电气连接经常停留在子模块的 `interfaceAbility/interfaceParams`，轮组中的逻辑引用与实际接线没有统一的显式边模型。解析和生成必须保留这两套关系，不能将 `relateMotor`、`relatedEncode` 直接解释为已经完成电气接线。

## 4. 底盘、轮组和运动执行链

### 4.1 底盘

`diffChassis-Common`、`steerChassis-Common`、`SteerChassis_SingleWheel`、`SteerChassis_DoubleWheel` 和 `Q3-600LE-DIF` 表达底盘层。底盘的职责应是运动学类型、轮组数量、轮组拓扑、安装位置和整车运动约束；轮组负责轮半径、行走/转向轴和组件引用。

已确认的风险：

- 底盘层和轮组层的轮距、安装位置、旋转中心、方向约束边界不够明确。
- 单舵轮/双舵轮与轮组数量的强一致性没有形成统一审计规则。
- 差速底盘的左右轮、轮距和速度映射不能只靠模块名称推导。

### 4.2 轮组

模板覆盖 `diffWheel-Common`、`diffSteerWheel-Common`、`horizontalSteerWheel-Common`、`verticalSteerWheel-Common`、`weakSteerWheel-Common`、`weakTurnWheel-Common` 及多个产品级复合轮组。

- **差速轮**：由左右行走轮速度差实现转向；核心是轮半径、轮距/轮间距和左右驱动绑定。
- **立式/卧式舵轮**：应拆分行走驱动/电机组与转向驱动/电机组；行走和转向的电机减速比分别属于对应电机，只有转向机构再额外配置齿轮比。
- **差速舵轮**：不拆分行走和转向轴，应区分左驱动和右驱动；必须有外置编码器反馈，项目规则要求采用外置绝对值编码器。模板本身目前不能保证该完整性，必须由构建审计强制检查。
- **弱舵轮/弱转向轮**：名称不能证明其“弱”是承载、速度、转向角、反馈或控制能力受限。未确认前不得自动映射到其他舵轮类别。

### 4.3 电机和驱动器

`PMSMMotor-Common`、`BLDCMotor-Common`、`BDCMotor-Common` 以及产品电机模板表达运动执行器；`subDriver-Common` 和产品驱动器模板表达控制节点。电机的编码器类型、额定转速/扭矩、电机自带减速机比、抱闸和反向等信息，不能和轮组输出机构的齿轮比混成一个字段。

必须保留以下语义：

- 电机减速比：电机自带减速机输入/输出的传动关系，配置在电机属性或明确的电机减速机对象上。
- 齿轮比：转向机构的额外齿轮传动关系，只在转向部分配置。
- 反馈安装位置：电机内置、轮轴侧、转向输出侧或外置测量机构必须可区分。
- 控制关系：驱动器到电机是一条控制关系，不能由同名或同型号猜测。

已发现的问题：

- 电机 `ENCType` 与舵轮内置转向编码器类型没有正式兼容检查。
- 驱动器编码器输入类型与电机编码器类型没有统一兼容矩阵。
- `gearRatio` 在不同模块路径中的参照方向和物理意义没有统一说明。
- 驱动器的 CAN 节点、波特率、协议、终端电阻和编码器接口既存在于产品模板，也可能在构建结果中重复出现，存在漂移风险。

## 5. 传感器和感知链

### 5.1 激光和 3D 激光

模板包括 `laser-Common`、`3DLaser-Common`、`LS-MID_360`、`LS-MR-*`、`MR-LS-*` 等。二维激光通常输出单平面距离扫描；三维激光输出多层/体积测量数据。构建时至少应区分：传感器类型、扫描平面/视场、量程、扫描频率、角分辨率、输出协议、安装坐标、坐标系、是否用于导航定位、避障或安全防护。

SICK 的资料明确区分扫描频率、角分辨率、扫描范围和导航定位用途，并指出 LiDAR 地图通常需要结合激光扫描和里程计建立；安全激光扫描器还具有防护区域/安全输出语义。因此模板中的“激光模块”不能只作为普通距离传感器，必须增加用途和安全等级的审计维度。参考：[SICK LiDAR 功能与变体](https://www.sick.com/media/docs/3/63/963/whitepaper_lidar_en_im0079963.pdf)、[SICK LiDAR-LOC](https://support.sick.com/sick-knowledgebase/article/?code=KA-10704)、[SICK 安全激光扫描器](https://www.sick.com/media/docs/2/12/312/e_guide_safety_laser_scanners_from_sick_en_im0108312.pdf)。

疑问和风险：

- 现有激光私有属性、接口和功能描述没有统一说明其输出是原始扫描、定位结果还是安全区状态。
- `3DLaser` 与普通 `laser` 的处理器/算法依赖没有统一建模。
- 导航激光与安全激光不能只通过型号或安装位置区分，必须有明确用途和安全链关系。
- 扫描坐标系、安装姿态、时间戳和与里程计/IMU 的同步信息未形成统一属性。

### 5.2 TOF、双目和相机

模板包括 `TOF-Common`、`3DTOF-Common`、`TOFProcessor-Common`、`stereo-Common`、`STEREO-MV-EB435i`、`binocularCameraProcessor-Common`、`CAMERA-MV_SC2000AM` 以及 `codeReader-Common`。

- **TOF/3D TOF**：输出深度/距离，关键不是只有设备型号，还包括深度输出模式、测量范围、视场、刷新率、置信度/无效值处理、安装坐标和处理器关系。
- **双目**：依靠左右图像匹配和标定产生视差、深度或点云；基线、内外参、同步和坐标变换是数据可信度的组成部分。
- **普通相机/读码器**：图像采集与读码功能要区分。读码器需要将识别结果、触发方式、输出接口和功能处理器建模为功能链，而不是仅记录一个摄像头。
- **处理器**：`binocularCameraProcessor-Common`、`TOFProcessor-Common` 等不应被当作普通硬件传感器；它们是原始数据到深度/目标/定位结果的处理能力节点。

Basler 的资料说明双目系统需要工厂校准或自校准，能够产生深度图/点云；相机安装到机器人时还需要手眼标定和相机到机器人坐标系的变换。因此当前模板至少要审计标定状态、坐标系、处理器依赖和输出能力，而不能只检查相机的接口。参考：[Basler Stereo Camera](https://www.baslerweb.com/en/cameras/basler-stereo-camera/)、[Basler 3D 数据计算](https://docs.baslerweb.com/stereovisard/rc_cube/en/stereo_general)、[Basler 手眼标定](https://docs.baslerweb.com/stereovisard/rc_cube/en/handeye_calibration)。

### 5.3 IMU/陀螺仪

模板包括 `gyro-Common`、`GYRO-GENERAL` 和 `GyroStructParam`。陀螺仪不是只读角度的“方向传感器”，至少要区分角速度、加速度、姿态解算、坐标轴方向、量程、采样率、偏置/标定和时间戳；如果是 6DOF/9DOF IMU，还需要明确磁力计、融合算法和输出姿态的来源。

Bosch 的资料把 6DOF IMU 描述为加速度计与陀螺仪组合，并通过外部磁力计扩展到 9DOF 姿态信息。项目模板目前没有在统一审计中显式表达“原始测量”与“融合姿态”边界，必须检查 `gyro` 与 `GYRO-GENERAL` 的字段差异和处理器依赖，不得将姿态结果自动归因于陀螺仪本体。参考：[Bosch BHI160 固件与 IMU](https://www.bosch-sensortec.com/en/products/smart-sensor-systems/bhi160-firmware)。

### 5.4 超声、接近、红外和碰撞

模板包括 `ultrasonicSensor-Common`、`ultrasonicProcessor-Common`、`proximitySensor-Common`、`infrared-Common`、`collisionPize-Common`、`collisionBaro-Common` 和 `RelatedCollision`。

- 超声距离测量基于发射脉冲到回波的时间和声速，应该关注量程、波束角、更新率、盲区、安装方向和环境影响。
- 接近/红外传感器输出通常是离散检测或距离阈值，不能直接与激光点云等价。
- 碰撞条/碰撞开关属于安全或保护触发链的候选输入，必须有触发逻辑、复位策略、控制器/安全 IO 连接和停止动作关系。
- `RelatedCollision` 表明碰撞关联是独立功能配置；如果只把碰撞模块放进器件清单而没有关联到控制/安全动作，模型是不完整的。

超声原理可参考 [Pepperl+Fuchs Ultrasonic Sensor FAQ](https://blog.pepperl-fuchs.com/en/2018/ultrasonic-sensor-faq-ultrasonic-technology-and-functions-at-a-glance/)。

### 5.5 温度、压力、称重和编码读取

`tempSensor-Common`、`PT-Common`、`weighSensor-Common`、`weighProcessor-Common`、`codeReader-Common` 和 `RFID-Common` 分别代表环境/设备状态、压力/力学测量、称重处理、识别和无线识别能力。需要分开：

- 原始传感器值与工程量换算、标定和报警阈值。
- 物理采集通道与处理器/算法输出。
- 识别触发、结果回传和上层功能使用。
- 安装位置、测量方向、量程、单位和有效性状态。

当前模板中这些模块的通用属性、接口属性和功能描述尚未形成统一的测量量纲/标定审计规则，这是后续生成防失真的重点。

## 6. 控制器、IO 和通信

### 6.1 主控、集成控制器和安全控制器

`mainCPU-Common`、`intergratedController-Common`、`safetyController-Common` 及产品控制器模板应分别表达计算平台、普通控制域和安全控制域。控制器不是单纯的“模块容器”，需要明确其所接入的设备、处理器能力、网络接口、功能责任和安全边界。

ISO 3691-4 将无人驾驶工业车辆的控制、导航和供电视为系统组成，并要求对安全要求进行验证。因此普通主控与安全控制器不能仅按 `main_module_type` 区分，还必须检查急停、碰撞、安全 IO、驱动停止和复位链是否形成闭合关系。参考：[ISO 3691-4](https://www.iso.org/standard/83545.html)。

### 6.2 IO 与扩展接口

`IOModule-Common`、`safetyIOModule-Common`、`interfaceModule`、`IO-lnterface board`、`IO module 4in4out`、`ethernetSwitch-Common` 等模块涉及 DI/DO/AI/AO、CAN、RS485、ETH、USB、UART、SPI、HDMI、PWM、编码器和电源等接口。

必须区分：

- 物理端口能力：端口类型、数量、电气方向和电压范围。
- 协议/总线能力：CANopen、RS485、以太网等协议和节点参数。
- 连接实例：端口 A 实际接到哪个模块端口。
- 功能映射：某个 DI 是急停、复位、门禁还是普通输入，某个 DO 驱动灯、蜂鸣器还是阀。

现有模板主要提供接口能力和参数，但连接实例、端口占用、方向、电气兼容、终端电阻和功能映射没有被统一成一个可审计结构。CANopen 的对象字典、PDO/SDO、NMT 和错误控制，以及 CiA 402 驱动状态机，说明“支持 CAN”不能等同于“已经完成 CANopen 驱动连接”。参考：[CiA CANopen](https://www.can-cia.org/can-knowledge/canopen)、[CiA CANopen Profiles](https://www.can-cia.org/can-knowledge/canopen-profiles)、[CiA 402](https://www.can-cia.org/can-knowledge/cia-402-series-canopen-device-profile-for-drives-and-motion-control)。

### 6.3 无线与 RFID

`5G-Common`、`5G-TE310`、`WIFI-Common`、`WAPI-Common`、`bluetooth-Common`、`RFID-Common` 和 `PIO-Common` 需要区分通信承载、网络配置、业务协议和设备发现/识别功能。模型中应能看出：

- 哪些是控制链路，哪些是调试或业务链路。
- 哪些是模块自身接口，哪些需要外部网络设施。
- RFID 是读写器硬件还是识别功能节点。
- PIO 是协议/IO 能力还是独立设备。

目前分类有通信模块，但连接对象、网络拓扑、地址和功能依赖仍需在构建审计中显式检查。

## 7. 按钮、安全、HMI 和音视频输出

### 7.1 按钮

模板包括 `button-Common`、`BTN-Emergency`、`BTN-NoEmergency`、`BTN-Cable-Mizu2F-to-Switch-70mm-RD-BK`。按钮至少要区分物理器件、输入通道、是否急停、触发/复位方式、是否进入安全控制器、是否双通道，以及对应的停止或功能动作。

`BTN-Emergency` 不能只作为普通按钮显示；急停必须与安全控制器/安全 IO/驱动停止链建立功能关系。OSHA 对急停的定义强调其作用是启动停止危险运动的动作，而不是替代机械防护。参考：[OSHA Machine Guarding](https://www.osha.gov/sites/default/files/publications/OSHA3170.pdf)。

已发现风险：按钮模板与 `RelatedEmcyBtn`、`RelatedResetBtn`、`RelatedManualBtn` 的关联关系是分离的，若构建只放置按钮而未配置关联，导出的模型无法说明按钮的系统作用；按钮线束产品模板也不应被当成逻辑安全功能本身。

### 7.2 灯、显示和音频

`lamp-Common`、`warningLight-Common`、`LAMP-*`、`WARLIGHT-*`、`screen-Common`、`screenHDMI-Common`、`segDisplays-Common`、`SSC-*`、`SDSP-*`、`audioIn-Common`、`audioOut-Common`、`audioOutWithCan-Common` 和 `AUO-*` 覆盖 HMI 和状态提示。

需要分开建模：

- 设备能力：灯色、输出通道、屏幕接口、音频输入/输出接口。
- 控制关系：由哪个控制器/IO/总线节点驱动。
- 状态语义：运行、故障、急停、充电、低电量等状态由哪个功能块触发。
- 安全语义：普通提示与安全警示不能仅由名称区分。

当前模板可以描述器件和接口，但功能状态到灯/屏/音频的映射仍主要依赖功能关联或上层逻辑，不能在解析时凭 `warningLight` 自动推断其具体危险等级和闪烁规则。

## 8. 电池、电源和充电

`battery-Common`、`BAT-*`、`power-Common`、`powerController-Common`、`prechargeController-Common`、`charge-Common` 和 `Power Controller board` 共同构成能源链。

应分成四层：

1. 电池包/电芯和额定电气参数。
2. BMS 的电压、电流、温度、SOC、SOH、均衡和保护状态。
3. 预充、电源分配、接触器和负载上电顺序。
4. 充电器、充电接口、充电状态和与运动控制的互锁。

IEC 62619 面向工业锂电池提出安全要求和测试要求；TI 对机器人 BMS 的描述包括监测、保护、均衡和电量估算。因此只记录电池型号和供电接口，不能说明能源链已经完整。参考：[IEC 62619](https://webstore.iec.ch/en/publication/64073)、[TI BMS](https://www.ti.com/solution/humanoid-robot-bms)。

待确认问题：

- 电池模板中哪些字段代表电池包，哪些代表 BMS 或电源控制器。
- 预充控制与主控、安全控制器、驱动器上电之间是否有明确关系。
- 低电量、充电中、故障和禁止运动是否通过功能块/互锁表达。
- 电池电气端口与 CAN/通信端口是否被混用。

## 9. 机械执行机构和车体

### 9.1 执行机构

`block-Common`、`clamp-Common`、`lift-Common`、`lift-Q3`、`linear-Common`、`rotate-Common`、`rotate-Q3`、`translation-Common` 表达举升、直线、旋转、平移、夹具和阻挡等轴类执行器。

统一构建链应包含：机械轴/方向、驱动器和电机、位置/限位/原点反馈、负载或行程、零位/回零过程、故障和安全互锁。当前模板有执行机构类别和私有属性，但尚未发现所有轴都使用同一套反馈、限位、回零和功能关联结构；这会导致“能生成模块”但无法验证动作安全和位置可信度。

### 9.2 车体

`carrier-Common` 和 `covers-Common` 属于承载结构和外罩。它们不只是外观信息，还可能影响载荷、外形包络、传感器遮挡、安装位置、维护空间和碰撞几何。当前模板需要与底盘、安装位置和传感器视场建立关系，否则导出的模型无法判断感知覆盖是否被车体结构遮挡。

## 10. 跨模块问题清单

### P0：必须阻断导出或标记为不完整

- 差速舵轮缺少外置绝对值编码器、相关反馈引用或左右驱动绑定。
- 立式/卧式舵轮的转向电机内置编码器与转向反馈类型不兼容。
- 逻辑组成/控制/反馈关系被误当作电气接线。
- 急停、碰撞、复位、手动按钮未关联到安全控制器/安全 IO/停止动作。
- 电机、驱动器、编码器接口类型和通信参数无法完成兼容验证。
- 双目、TOF、激光等输出没有处理器、坐标系或标定依赖时，不能宣称已经形成可用感知链。

### P1：会造成构建结果失真或维护困难

- 前后端默认值不一致：轮半径、轮间距、PMSM 多圈位、驱动器 `softwareSpec` 等。
- `multiTurn*` 和 `mutiTurn*` 字段拼写不一致，影响解析、显示和导出。
- 不同模块的 `gearRatio` 缺少统一的输入/输出参照。
- 复合产品模板与通用模块模板的层级、来源和内部实例边界没有统一元数据。
- 传感器原始输出、处理器输出和功能结果未统一区分。
- 端口能力、总线参数、实际连接、功能映射没有统一关系模型。
- 能源链缺少 BMS、预充、充电互锁和禁止运动的完整验证路径。

### P2：需要领域确认或后续完善

- `weakSteerWheel`、`weakTurnWheel` 的“弱”具体指什么能力。
- `gyro-Common` 与 `GYRO-GENERAL` 的差异以及是否支持姿态融合。
- `laser`、`3DLaser`、安全激光的用途边界和处理器关系。
- ABZ 编码器的 Z 相、计数倍频、零位和校准策略。
- 执行机构的限位、原点、回零和安全互锁是否由模板还是功能层表达。
- 车体外形和传感器视场/安全区域的碰撞与遮挡关系。

## 11. 生成和解析流程的改进方案

### 11.1 建立统一的模块语义索引

索引至少保留：模板文件名、模块名、主/子类型、模块层级、是否复合、实例数量、组成引用、控制引用、反馈引用、接口能力、接口参数、功能能力和版本来源。索引生成失败或 JSON 不可解析时必须阻断构建，而不是静默跳过。

### 11.2 建立四类关系的独立数据结构

不要继续把所有关系塞进私有属性。解析后的中间模型应分别保存：

- `composition_edges`
- `control_edges`
- `feedback_edges`
- `electrical_edges`

每条边都必须记录来源字段、源实例、目标实例、源端口、目标端口、关系类型和验证状态。无法从源文件确定的内容只能标记为缺失/待确认。

### 11.3 建立按类别的必填和兼容规则

规则不应由字段名称猜测，而应由模板、proto、参考 cmodel 和人工确认的项目规范共同维护。例如：

- 差速舵轮：左右驱动存在，外置绝对编码器存在且有反馈关系。
- 立式/卧式舵轮：行走和转向轴分开，转向电机减速比与转向齿轮比分开。
- 内置转向编码器：与转向电机 `ENCType` 兼容。
- 双目/TOF/激光：设备、处理器、接口、安装坐标和标定状态闭合。
- 急停/碰撞：输入、安全控制器、安全输出/停止动作、复位关系闭合。
- 电池/充电：电池包、BMS、电源控制、预充和充电互锁关系闭合。

### 11.4 建立不失真的 round-trip 验证

验证不能只比较 cmodel 文件字节大小。应比较：模块实例数量、UUID、模块类型、属性键和值、接口能力/参数、组成关系、逻辑关系、电气关系、功能关联和 protobuf 未识别字段。对于 protobuf，字段顺序或编码长度不同不等于语义不同；但任何未识别、丢弃、重命名或默认值覆盖都必须报告。

## 12. 本次结论

当前项目已经具备较完整的模块库骨架，能够覆盖 AMR 的运动、感知、控制、能源、HMI 和执行器，但模板更接近“模块属性与接口目录”，还不是一套足以保证模型闭合的系统级约束模型。

最大风险不在某一个按钮或激光字段缺失，而在以下三点：

1. 模块分类和复合层级不稳定，复合舵轮被混入传感器/驱动器。
2. 组成、控制、反馈、电气和功能关系没有统一显式化。
3. 传感器标定/坐标/处理器、安全功能、能源互锁等系统语义没有与器件属性形成闭环。

因此下一阶段不应继续单纯增加表单字段，而应先完成全量模板语义索引、关系模型、分类修正方案和按子系统的构建审计器，再逐类修复模板和前端向导。

## 13. 证据来源

- [ABB AMR P604 Product Manual](https://library.e.abb.com/public/00456a1d13164cf2ab1e569ab5555b82/3HAS00005-001_en_B_AMR%20P604%20-%20Product%20Manual.pdf)
- [Sumitomo smartris AGV drive](https://us.sumitomodrive.com/en-us/product/agv-smartris)
- [Spinea MoveSpin](https://conedrive.com/cycloidal-series-ms-160-500/)
- [DMM DVP Wheel Drive](https://www.dmm-tech.com/dvp-wheel-drive)
- [Renishaw Introduction to encoder systems](https://www.renishaw.com/resourcecentre/download/feature-article-introduction-to-encoder-systems--125690)
- [Rockwell Basics of Encoders](https://www.rockwellautomation.com/en-us/company/news/the-journal/basics-encoder-for-motion-system.html)
- [CiA CANopen](https://www.can-cia.org/can-knowledge/canopen)
- [CiA CANopen Profiles](https://www.can-cia.org/can-knowledge/canopen-profiles)
- [CiA 402](https://www.can-cia.org/can-knowledge/cia-402-series-canopen-device-profile-for-drives-and-motion-control)
- [SICK LiDAR functionality and variants](https://www.sick.com/media/docs/3/63/963/whitepaper_lidar_en_im0079963.pdf)
- [SICK LiDAR-LOC](https://support.sick.com/sick-knowledgebase/article/?code=KA-10704)
- [SICK Safety Laser Scanners](https://www.sick.com/media/docs/2/12/312/e_guide_safety_laser_scanners_from_sick_en_im0108312.pdf)
- [Basler Stereo Cameras](https://www.baslerweb.com/en/cameras/basler-stereo-camera/)
- [Basler 3D data computation](https://docs.baslerweb.com/stereovisard/rc_cube/en/stereo_general)
- [Basler hand-eye calibration](https://docs.baslerweb.com/stereovisard/rc_cube/en/handeye_calibration)
- [Bosch BHI160 IMU firmware](https://www.bosch-sensortec.com/en/products/smart-sensor-systems/bhi160-firmware)
- [Pepperl+Fuchs ultrasonic principle](https://blog.pepperl-fuchs.com/en/2018/ultrasonic-sensor-faq-ultrasonic-technology-and-functions-at-a-glance/)
- [ISO 3691-4](https://www.iso.org/standard/83545.html)
- [IEC 62619](https://webstore.iec.ch/en/publication/64073)
- [TI BMS](https://www.ti.com/solution/humanoid-robot-bms)
- [OSHA Machine Guarding](https://www.osha.gov/sites/default/files/publications/OSHA3170.pdf)
