# AMR Studio V4 模板语义审计与模型构建原理分析

## 1. 分析目标与约束

本报告不是简单的字段清单，而是回答三个问题：

1. 每个模板在整车模型构建中代表什么真实对象或关系。
2. 模板中的属性、接口、引用和复合关系如何参与解析、配置、审计和导出。
3. 哪些定义已经有充分依据，哪些存在冲突、缺失、歧义或需要人工确认。

分析严格区分模板事实、参考模型事实、行业原理和项目工程约束。行业常见做法不能直接创造项目字段；没有模板、proto 或确认过的工程定义支持的参数，不能写入生成结果。

## 2. 全量扫描结果

扫描目录：src/backend/resources/modules/*.json。

- 后端模块 JSON：143 个。
- 扫描到的类型键：238 个。
- 动力链相关基类：轮组、底盘、驱动器、电机、编码器、编码器处理器。
- 前端对应私有属性模板：18 个主要动力链模板。

项目模板实际包含三种层级：

1. 通用模块模板，如 PMSMMotor-Common.json、horizontalSteerWheel-Common.json。
2. 具体器件模板，如 SM020BA-45.json、AbsEncoder-H8.json。
3. 复合产品/整机组合模板，如 DIFF_STEER_WHEELS_DOUBL(双差速舵轮).json、VER_STEER_WHEELS_DOUBL(双立式舵轮).json。

复合产品模板同时包含多个模块实例、接口和引用，解析器必须保留内部 UUID 及引用关系，不能把它当成普通单模块。

## 3. 模型构建的真实意义

模型构建不是把表单字段拼成 JSON，而是把实体、能力、连接和约束组织成可执行的系统描述：

底盘/运动学类型 -> 轮组拓扑 -> 驱动器/电机/编码器实例 -> 逻辑引用 -> 电气接口与总线 -> 安装位置 -> 能力和功能过程 -> 审计 -> protobuf/cmodel 导出。

必须分开表达四类关系：

- 组成关系：轮组由哪些驱动、电机、编码器组成。
- 控制关系：哪个驱动器控制哪个电机。
- 反馈关系：哪个编码器反馈哪个运动轴。
- 电气关系：设备的哪个接口连接到哪个总线或 IO。

当前模板主要表达前三类中的部分关系，电气关系更多由器件自身 interfaceAbility 和 interfaceParams 表达。轮组模板本身通常没有电气接口，这可以成立，但必须明确：轮组引用不是电气接线，不能把逻辑引用当成已经完成的电气连接。

## 4. 轮组模板逐项分析

### 4.1 diffWheel-Common.json

代表没有独立转向轴的差速驱动轮。核心字段是 wheelRadius 和 relateMotor。

模型意义：

- 轮组负责描述几何参数和行走执行器绑定。
- 转向不是机械转向，而是由左右轮速度差产生。
- 如果整车存在左右两个差速轮，应该建立两个轮组实例或由底盘组合模板表达左右关系，不能用一个轮组对象隐含两台电机。

疑问：

- 模板只有 wheelRadius，没有明确的左/右安装位置、轮组编号、轮距或方向属性。
- 轮距可能属于底盘或运动学模型，但当前模板边界没有在字段层说明。
- 轮组模板没有电气接口，relateMotor 只表达逻辑引用。

### 4.2 diffSteerWheel-Common.json

代表通过左右两个行走轮速度差实现方向控制，同时存在独立的转向角反馈对象：

diffSteerWheel -> relateLeftMotor + relateRightMotor + angleSensorType/relatedEncode。

核心字段包括 wheelRadius、wheelSpace、angleLmtPos、angleLmtNeg、rotOmgLmt、relateLeftMotor、relateRightMotor、angleSensorType、relatedEncode，以及反馈分支中的 gearRatio。

模板允许外置增量编码器、ABZ 反馈和外置绝对值编码器。项目工程规则要求差速舵轮使用外置绝对值编码器，但这是上层构建约束，不是通用模板本身的限制。

疑问：

- 参考模型中出现外置绝对反馈但 relatedEncode 为空，模板允许不完整状态。
- 左右电机的电机减速比分别属于两个 PMSM 电机，不能合并到轮组的一个 gearRatio。
- angleSensorType 混合了传感器类型、安装位置、校准方式和 IO 依赖，维度较多。
- 轮组没有明确表达反馈采样方向、零位来源和时间同步要求。

### 4.3 horizontalSteerWheel-Common.json

代表驱动/转向组件横向布置、优先降低车体高度的独立舵轮。核心组成是 angleSensor、relateRotMotor 和 relateWalkMotor。

行走电机的减速比影响轮速和牵引力；转向电机的减速比影响转向输出速度和转矩；外部反馈位于转向输出机构时还需要考虑反馈侧齿轮比。

疑问：

- 内置反馈分支没有独立齿轮比字段。
- GROUP_CALI_ABS_INTERNAL 与 PMSM 的 ENCType 没有直接引用或兼容映射。
- 当前默认舵轮内置绝对式反馈，而 PMSM 默认增量编码器，默认配置可能冲突。
- 模板没有明确区分转向电机减速机和转向机构齿轮比。

### 4.4 verticalSteerWheel-Common.json

逻辑结构与卧式舵轮相同，但安装方向和空间语义不同。垂直布置会影响车体高度、水平占用空间、安装坐标、旋转轴方向、载荷、线缆路径和悬挂结构。

当前模板没有看到足够的安装方向、旋转轴、载荷和悬挂参数，可能需要由安装坐标或机械结构模块补充。

### 4.5 weakSteerWheel-Common.json 与 weakTurnWheel-Common.json

这两个模板表示能力弱化或结构简化的转向轮，但名称本身没有给出足够工程语义。需要确认 weak 表示转向能力、承载能力、反馈能力还是控制能力受限，以及它们是否允许作为主驱动轮。

在语义未确认前，不能仅凭名称把它们映射为卧式或立式舵轮。

## 5. 电机模板逐项分析

### 5.1 PMSMMotor-Common.json

核心属性包括 ENCType、encoderLine、sglTurnBit、multiTurnBit、RPM、torque、gearRatio、bHbrake、bReverse、额定电流、过流系数和加减速度。

电机是运动轴执行器，不只是型号文本。ENCType 决定驱动器如何获取速度/位置反馈以及上电后的参考状态；gearRatio 影响输出轴转速、扭矩和位置换算；转向电机和行走电机虽然类型相同，但角色不同，不能合并参数。

问题：

- 电机编码器类型与舵轮反馈类型没有正式兼容关系。
- gearRatio 描述没有明确输入轴/输出轴参照方向。
- 电机侧反馈和输出侧反馈的安装位置没有字段化。
- 电机模板有 ENCODER_MULTI_TURN_ABS，但舵轮内置反馈没有明确多圈对应项。

### 5.2 BLDCMotor-Common.json 与 BDCMotor-Common.json

两者都表达电机执行器，但控制方式、换相方式和反馈需求可能不同。需要确认哪些轮组允许 BLDC，哪些轮组只允许 PMSM；霍尔反馈与增量编码器同时存在时分别用于换相、速度还是位置闭环；以及电机模板是否应区分裸电机和带减速机电机。

### 5.3 具体型号模板

SM020BA-45.json、SM020BB-50.json、SM15030BA-18.9.json、SM15030BA-20.json、MOTOR-MCXL501TAF3KM.json、MOTOR-MCXL501TAFUKM.json、F6-2000 _motor(RUN).json 等具体型号模板应被视为选型数据，而不是普通属性表。

需要逐项核对型号资料、减速比、额定转速、额定扭矩、编码器类型和驱动器接口是否互相匹配。

## 6. 驱动器模板逐项分析

### 6.1 subDriver-Common.json

驱动器是电机控制和总线节点。模板包含控制板、芯片平台、软件规格、输入电压、电流、过载能力、驱动类型、CAN 波特率、协议、节点 ID、终端电阻和编码器输入类型。

驱动器控制具体电机轴；反馈接口决定电机编码器能否接入；节点 ID、波特率和协议决定网络通信；终端电阻属于总线拓扑属性，不应复制到所有 CAN 设备。

问题：

- 模板没有统一的控制目标电机字段，关系依赖外部轮组引用或复合模板。
- CAN_1、CAN_2、LINE_1、ENCR_1 等接口组命名和参数结构不完全统一。
- 总线参数存在产品级重复定义，容易漂移。
- 驱动器编码器接口类型与电机 ENCType 没有自动兼容检查。

### 6.2 具体驱动器模板

F6-2000 servo_driver.json、RA-DRD-4825DB.json、SD-RA-DRD-4814SA.json、SD-R-Q3-DriveVV1.json、IxLII 20.40.48.C.json 和 IxLII 30.60.48.C .json 等具体模板不能只按接口数量判断能力，应逐项比较电源范围、协议、节点地址、编码器输入、额定/峰值电流、抱闸、STO、急停和故障输出。

## 7. 编码器模板逐项分析

### 7.1 absoluteValueEncode-Common.json

核心属性包括 absEncodeType、codeType、resolutionMode、单圈位数/分辨率、多圈位数/圈数、isInvert 和 CAN 接口参数。

发现的具体风险：模板使用 mutiTurnBit、mutiTurnCount 拼写，而其他位置存在 multiTurnBit 语义。该差异会影响解析、前端显示和 protobuf 导出。必须先对照 proto 与真实 cmodel 确认正式字段，不能直接批量改名。

### 7.2 incrementalEncode-Common.json

核心属性是 needCalib、lineCount 和 isInvert。增量编码器记录相对运动计数，掉电后通常需要重新建立参考位置，因此 needCalib 会影响整车启动流程和功能过程。

### 7.3 ABZEncode-Common.json

核心属性是 lineCount 和 isInvert。ABZ 模式还需要明确 A/B 相方向、Z 相零位用途、计数倍频和驱动器输入约束；当前模板没有显式表达这些语义。

### 7.4 pullWireEncode-Common.json

拉绳编码器是线性位移反馈，不应直接当作旋转舵轮编码器使用。wheelCirc、分辨率和绝对值配置必须参与位移换算，且需要确认应用轴和安装方向。

## 8. 底盘组合模板

diffChassis-Common.json 表示差速底盘级别；轮组的轮半径、轮距、左右位置和运动学约束不应全部散落到 diffWheel。

steerChassis-Common.json、SteerChassis_SingleWheel.json 和 SteerChassis_DoubleWheel.json 表示舵轮底盘组合。需要确认单/双舵轮与轮组数量是否强一致、安装位置由谁表达、运动中心和旋转轴由谁负责，以及底盘模板是否表达运动学模式。

## 9. 前后端模板一致性审计

对后端通用 JSON 与前端私有属性 JSON 做了字段级对比：

- 后端卧式、立式、差速舵轮 wheelRadius 默认值为 1，前端模板为 0。
- 后端差速舵轮 wheelSpace 默认值为 1，前端模板为 0。
- 后端 PMSM 的部分 sglTurnBit 默认值与前端模板不一致。
- 后端 subDriver.softwareSpec 默认值为 NONE，前端模板为空字符串。

### 9.4 前端模板 JSON 可解析性

本次逐文件解析结果：

- 后端模块 JSON：143/143 可解析。
- 前端模板 JSON：144/146 可解析。
- `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Struct_Param/AcotrStructParam.json` 存在尾随逗号。
- `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Interface_Prarm/CAN/InterfaceParam.json` 存在尾随逗号。

这两个文件不是本次轮组核心模板，但会影响“全量模板注册/构建索引”是否可靠；如果运行时使用严格 JSON 解析，可能导致整个资源加载阶段失败。应先修复语法并做全量 JSON 回归。

这些差异可能是前端强制用户录入的有意设计，也可能造成导出与后端模板不同，必须明确默认值来源和优先级。

前端 Pri_Attr 目录主要保存私有属性，后端通用 JSON 还包含 generalAttr、interfaceAbility、interfaceParams 等完整结构。因此前端私有属性不能单独作为完整模块定义。

轮组通用模板的 interfaceAbility 和 interfaceParams 基本为空，而驱动器和编码器拥有 CAN/RS485/编码器接口。必须明确逻辑引用和电气接线是两种不同关系，并为子组件接口匹配、总线节点、终端电阻提供审计。

## 10. 行业原理交叉验证

ABB P604 手册将驱动单元描述为包含驱动轮、可变速驱动、驱动增量编码器和转向绝对编码器的组合：[ABB AMR P604 Product Manual](https://library.e.abb.com/public/00456a1d13164cf2ab1e569ab5555b82/3HAS00005-001_en_B_AMR%20P604%20-%20Product%20Manual.pdf)。

Sumitomo smartris 将齿轮、伺服电机和驱动器作为 AGV/AMR 驱动包，并分别列出减速比、轮速、扭矩和反馈传感器：[Sumitomo smartris](https://us.sumitomodrive.com/en-us/product/agv-smartris)。

Spinea MoveSpin 将牵引驱动与转向驱动分开列出，并给出不同的传动比、PMSM、电流、扭矩、转速和编码器信息：[Spinea MoveSpin](https://conedrive.com/cycloidal-series-ms-160-500/)。

DMM DVP 将伺服驱动器、电机、编码器、行星齿轮箱和轮体集成为可安装单元：[DMM DVP Wheel Drive](https://www.dmm-tech.com/dvp-wheel-drive)。

Renishaw 说明增量编码器依赖相对计数或参考特征，绝对编码器可以直接报告当前位置，掉电后的恢复行为不同：[Introduction to encoder systems](https://www.renishaw.com/resourcecentre/download/feature-article-introduction-to-encoder-systems--125690)。

Rockwell 说明增量编码器产生位置变化脉冲，绝对编码器提供唯一位置值，并可使用 SSI、CANopen 等接口：[Basics of Encoders for Motion Systems](https://www.rockwellautomation.com/en-us/company/news/the-journal/basics-encoder-for-motion-system.html)。

CiA 说明 CANopen 包括对象字典、PDO、SDO、NMT 和错误控制，设备能力应通过对象字典和 device profile 识别：[CANopen](https://www.can-cia.org/can-knowledge/canopen)、[CANopen profiles](https://www.can-cia.org/can-knowledge/canopen-profiles)。

## 11. 问题分级

### P0

- 内置转向编码器与转向电机 ENCType 没有一致性/兼容性校验。
- 差速舵轮允许缺少外置绝对值编码器或 relatedEncode 的不完整状态。
- 逻辑引用和电气连接没有强制分离审计。
- 电机、驱动器、编码器接口没有统一兼容矩阵。

### P1

- multi/muti 多圈字段命名不一致。
- 前后端模板默认值不一致。
- 相同 gearRatio 在不同路径中语义不同。
- 产品复合模板与通用模块拆分时缺少来源和引用边界。
- 电机侧反馈和输出侧反馈安装位置未明确。

### P2

- weakSteerWheel、weakTurnWheel 的工程语义缺少文档。
- 底盘层与轮组层的轮距、安装位置、运动学参数边界不清。
- ABZ 的 Z 相、计数倍频、零位策略没有显式建模。
- 驱动器接口、总线标签和产品级参数重复定义，容易漂移。

## 12. 下一步

1. 建立统一模板语义索引：模块来源、类型、属性路径、引用目标、接口能力和默认值。
2. 建立电机编码器类型到舵轮反馈路径的正式兼容矩阵，未确认的多圈映射保持待确认。
3. 统一后端 schema 与前端私有属性的默认值来源。
4. 为所有轮组建立组成关系、控制关系、反馈关系和电气关系四类审计。
5. 对多圈字段先对照 proto 和真实 cmodel，再决定是否兼容或修复命名。
6. 对复合产品模板执行导入、拆解、重组、导出、protobuf 反解析逐字段对比。
7. 对驱动器和编码器的 CANopen 参数增加节点唯一性、协议、终端电阻和 PDO/SDO 能力审计。

## 13. 总结

模块库已经覆盖 AMR 动力链的主要对象，但还没有完全形成可验证的工程模型规范。最大风险不是缺少某个表单字段，而是同一物理意义被分散在类型、嵌套分支、逻辑引用、接口参数和产品复合模板中，且这些层之间缺少正式约束。

下一步应优先建设语义索引和兼容矩阵，再进行 UI 优化或新增字段，以保证模型构建既保留原始 cmodel 数据，又能对错误组合进行明确审计。
