# AMR 舵轮、驱动、电机与编码器模板及领域分析

## 1. 分析边界与证据规则

本报告只使用以下事实来源：

1. 项目内 `src/backend/resources/modules/*.json` 模块库。
2. 项目内前端模板 `src/frontend/src/assets/ModuleLibrary/ModuleAttrTem/Pri_Attr/*.json`。
3. 项目内已解码的参考模型和已保存模型。
4. 公开厂商资料，用于理解行业常见结构，不用于替项目模板创造不存在的字段。

模板事实、参考模型事实和行业推断分开记录。没有在模板或参考模型中出现的参数，不直接写入模型或 protobuf。

## 2. 模板文件全量盘点

### 2.1 舵轮与轮组定义

后端模块库中与舵轮/轮组直接相关的模板包括：

| 模板 | 模块类型 | 角色 | 主要定义 |
|---|---|---|---|
| `horizontalSteerWheel-Common.json` | `horizontalSteerWheel` | 卧式舵轮 | 轮半径、角度限位、转向反馈、转向/行走电机引用 |
| `verticalSteerWheel-Common.json` | `verticalSteerWheel` | 立式舵轮 | 轮半径、角度限位、转向反馈、转向/行走电机引用 |
| `diffSteerWheel-Common.json` | `diffSteerWheel` | 差速舵轮 | 轮半径、轮间距、左右行走电机、外部反馈分支 |
| `diffWheel-Common.json` | `diffWheel` | 差速驱动轮 | 轮半径、单一行走电机 |
| `weakSteerWheel-Common.json` | `weakSteerWheel` | 弱舵轮 | 轮半径、轮间距、反馈及关联编码器 |
| `weakTurnWheel-Common.json` | `weakTurnWheel` | 弱转向轮 | 轮半径、转向电机、反馈及关联编码器 |
| `SteerChassis_SingleWheel.json` | `steerChassis` | 单舵轮底盘组合模板 | 底盘级组合定义 |
| `SteerChassis_DoubleWheel.json` | `steerChassis` | 双舵轮底盘组合模板 | 底盘级组合定义 |
| `DIFF_STEER_WHEEL(单差速舵轮).json` | `diffSteerWheel` | 产品/复合实例 | 差速舵轮、左右电机、驱动器、反馈模块组合 |
| `DIFF_STEER_WHEELS_DOUBL(双差速舵轮).json` | `diffSteerWheel` | 产品/复合实例 | 双差速舵轮组合 |
| `VER_STEER_WHEELS_DOUBL(双立式舵轮).json` | `verticalSteerWheel` | 产品/复合实例 | 双立式舵轮组合 |
| `TYD150-SM07530BA-18.9-10020-SM020BB-50.json` | `verticalSteerWheel` | 产品实例 | 立式舵轮与具体电机组合 |
| `TYD150-SM07530BA-20-11020-SM020BA-45.H173.json` | `horizontalSteerWheel` | 产品实例 | 卧式舵轮与具体电机组合 |
| `F6-2000 SteerWheel.json` | `diffSteerWheel` | 产品实例 | 差速舵轮产品组合 |
| `H8-Steerwheel.json` | `diffSteerWheel` | 产品实例 | 差速舵轮产品组合 |
| `DWD-R-Q3.json` | `diffWheel` | 产品实例 | 差速驱动轮实例 |

前端私有属性模板存在对应的：

- `diffSteerWheel/PrivateAttribute.json`
- `diffWheel/PrivateAttribute.json`
- `horizontalSteerWheel/PrivateAttribute.json`
- `verticalSteerWheel/PrivateAttribute.json`
- `weakSteerWheel/PrivateAttribute.json`
- `weakTurnWheel/PrivateAttribute.json`

### 2.2 驱动器定义

通用驱动器模板为：

- `subDriver-Common.json`
- `F6-2000 servo_driver.json`
- `RA-DRD-4825DB.json`
- `SD-RA-DRD-4814SA.json`
- `SD-R-Q3-DriveVV1.json`
- `IxLII 20.40.48.C.json`
- `IxLII 30.60.48.C .json`
- 其他具体品牌/型号驱动器 JSON

`subDriver-Common.json` 主要包含：

- 控制板属性：芯片平台、软件规格。
- 电气参数：输入电压、输入电流、过载能力、过载时长。
- 驱动类型：标准 CANopen、ELMO、海康、步科、柯蒂斯、ZAPI 等选项。
- CAN 总线：终端电阻、波特率、协议、节点 ID、拨码值。
- 编码器接口：HALL、ABZ、RS422、RS485、ABZ+HALL 等模式。
- 其他总线和软件标签。

驱动器模板没有把“属于哪一个轮组”“驱动哪一个电机”作为驱动器自身的统一属性，而是由舵轮的电机引用和前端构建关系表达。

### 2.3 电机定义

通用电机模板包括：

- `PMSMMotor-Common.json`
- `BLDCMotor-Common.json`
- `BDCMotor-Common.json`

具体产品电机模板包括：

- `MOTOR-MCXL501TAF3KM.json`
- `MOTOR-MCXL501TAFUKM.json`
- `MOTOR-00SV04202-0750K-012.json`
- `F6-2000 _motor(RUN).json`
- `SM020BA-45.json`
- `SM020BB-50.json`
- `SM15030BA-18.9.json`
- `SM15030BA-20.json`
- `EC-SV11D1-100M01NB-C01.json`

PMSM 电机的核心属性包括：

- `ENCType`：无、增量式、单圈绝对式、多圈绝对式。
- `encoderLine`：增量编码器线数。
- `sglTurnBit`：单圈绝对值位数。
- `multiTurnBit`：多圈绝对值位数。
- `RPM`：电机额定转速。
- `torque`：额定扭矩。
- `gearRatio`：电机自带减速机减速比。
- `bHbrake`：是否带抱闸。
- `bReverse`：是否反向。
- 额定电流、过流系数、加减速度等参数。

### 2.4 编码器定义

通用编码器模板包括：

| 模板 | 类型 | 主要属性 |
|---|---|---|
| `absoluteValueEncode-Common.json` | `absoluteValueEncode` | 编码器类型、编码格式、单圈/多圈分辨率、反向、总线属性 |
| `incrementalEncode-Common.json` | `incrementalEncode` | 是否需要标定、线数、反向 |
| `ABZEncode-Common.json` | `ABZEncode` | 线数、反向 |
| `pullWireEncode-Common.json` | `pullWireEncode` | 拉绳行程/轮周长、绝对编码器类型、分辨率、反向 |
| `encoderProcessor-Common.json` | `encoderProcessor` | 编码器处理模块 |
| `ABS_ENCODE.json` | `absoluteValueEncode` | 产品绝对值编码器实例 |
| `INCEncoder.json` | `incrementalEncode` | 产品增量编码器实例 |
| `AbsEncoder-H8.json` | `absoluteValueEncode` | H8 绝对值编码器实例，含 `gearRatio` |
| `ABZEncode.json` | `ABZEncode` | ABZ 编码器实例 |

绝对值编码器模板的属性分为：

- 编码器类型：SSI、CANOPEN、CAN 自定义等。
- 编码格式：格雷码、二进制码、电机编码器、CANOPEN 编码器等。
- 分辨率模式：位数模式、数值模式。
- 单圈位数/单圈分辨率。
- 多圈位数/多圈圈数。
- 是否反向。
- CAN 总线属性：波特率、协议、节点 ID、终端电阻。

## 3. 舵轮的结构分类

### 3.1 卧式舵轮

卧式舵轮的核心特征是驱动电机、减速机构和轮体的空间布置偏向水平方向，优先解决底盘高度和低矮空间问题。项目模板将其拆成：

```text
horizontalSteerWheel
├── 转向反馈 angleSensor
├── 转向电机 relateRotMotor
└── 行走电机 relateWalkMotor
```

典型组成：

- 行走驱动器。
- 行走电机及其减速机。
- 转向驱动器。
- 转向电机及其减速机。
- 转向反馈编码器。
- 轮体、轮半径、机械限位、转向角速度限制。
- 抱闸、限位开关、通信接口和安装结构。

### 3.2 立式舵轮

立式舵轮的主要特征是转向/行走组件沿垂直方向布置，通常减少水平占用空间，但增加高度。项目模板的逻辑组成与卧式舵轮一致：

```text
verticalSteerWheel
├── 转向反馈 angleSensor
├── 转向电机 relateRotMotor
└── 行走电机 relateWalkMotor
```

立式和卧式在软件模型中不应混为同一类型，因为安装方向、空间包络、线缆路径、机械限位和底盘安装位置不同。

### 3.3 差速舵轮

差速舵轮没有独立的转向电机。舵轮方向通过左右两个行走电机的速度差形成，因此模板定义为：

```text
diffSteerWheel
├── 左行走电机 relateLeftMotor
├── 右行走电机 relateRightMotor
└── 转向反馈 angleSensor
```

模板允许的反馈分支包括：

- 外置增量编码器。
- ABZ 编码器。
- 外置绝对值编码器。

项目当前工程规则要求差速舵轮必须使用外置绝对值编码器，但这属于工程约束，原始通用模板本身仍保留了多个反馈选项。

### 3.4 差速驱动轮

差速驱动轮没有独立转向反馈和转向机构，核心结构是：

```text
diffWheel
└── 单一行走电机 relateMotor
```

通过两个或多个轮子的速度差实现转向。它和差速舵轮不能共用同一组构建规则：差速舵轮需要左右电机和外部方向反馈，差速驱动轮只需要行走电机引用。

## 4. 舵轮动力链与反馈链

### 4.1 卧式/立式舵轮

```text
控制器
  ├── 转向驱动器 ── 转向电机 ── 电机减速机 ── 齿轮/转向机构 ── 轮组角度
  │       └── 转向电机内置编码器或独立转向反馈编码器
  └── 行走驱动器 ── 行走电机 ── 行走减速机 ── 轮体
```

模板中的参数归属是：

- 电机减速比：`PMSMMotor.gearRatio`。
- 外置反馈后的齿轮比：舵轮 `angleSensorType` 当前分支下的 `gearRatio`。
- 总转向传动比：模板没有原始字段，只能作为派生值。
- 转向电机：`relateRotMotor`。
- 行走电机：`relateWalkMotor`。

### 4.2 差速舵轮

```text
控制器
  ├── 左驱动器 ── 左电机 ── 左轮
  ├── 右驱动器 ── 右电机 ── 右轮
  └── 外置绝对值编码器 ── 舵轮角度反馈
```

模板中的 `gearRatio` 位于角度反馈分支，表示反馈编码器与舵轮转向机械之间的齿轮/减速关系。左右行走电机各自拥有自己的 `PMSMMotor.gearRatio`，不能把左右电机减速比合并成一个舵轮字段。

## 5. 关键参数清单

### 5.1 机械参数

- 轮半径 `wheelRadius`。
- 差速舵轮轮间距 `wheelSpace`。
- 正/负机械限位角 `angleLmtPos`、`angleLmtNeg`。
- 最大转向能力 `rotOmgLmt`。
- 轮宽、轮径、承载、安装高度、安装孔位等产品参数。
- 悬挂/压紧结构和允许径向载荷。

### 5.2 传动参数

- 电机减速比：电机自身减速机的传动比。
- 齿轮比：转向输出机构与反馈编码器之间的传动比。
- 减速机输出转速、轮速、额定/峰值扭矩。
- 回差、传动效率、输出端允许负载。

### 5.3 电机参数

- 电机类型和型号。
- 额定转速、额定扭矩、额定电流。
- 最大加速度/减速度。
- 抱闸、反向、温度反馈。
- 内置编码器类型、线数或绝对值分辨率。

### 5.4 编码器参数

- 编码器安装位置：电机侧、转向输出侧、外置机械侧。
- 增量/ABZ/单圈绝对值/多圈绝对值。
- 线数、分辨率、单圈位数、多圈位数。
- 编码格式、通信协议、节点 ID、波特率。
- 方向反转、零位偏差、标定方式。
- 外置编码器与舵轮之间的机械齿轮比。

### 5.5 驱动器和总线参数

- 驱动器类型、芯片平台和软件规格。
- 输入电压、电流、过载能力和过载时间。
- CAN/CANopen、RS485 等通信方式。
- 波特率、节点 ID、协议、终端电阻。
- 编码器接口类型和反馈接口模式。
- 制动、STO、急停和故障反馈能力。

## 6. 现有模板存在的问题

### P0：内置转向编码器与转向电机编码器没有一致性约束

卧式/立式模板只定义了 `angleSensorType` 和 `relateRotMotor`，没有定义两者的联动规则。当前前端默认舵轮为内置绝对式编码器，而 PMSM 默认编码器为增量式，可能产生语义冲突。

需要补充：

- 转向电机引用变化时，重新校验内置编码器兼容性。
- 转向电机 `ENCType` 变化时，重新校验或同步舵轮反馈类型。
- 外置反馈模式下，不强制修改转向电机内置编码器，但应明确两者各自用途。
- 多圈绝对值电机编码器与舵轮内置反馈类型的对应关系必须由模板/领域负责人确认，不能猜测映射。

### P0：相同字段名 `gearRatio` 的语义不同

模板在两个对象中复用 `gearRatio`：

1. `PMSMMotor.gearRatio`：电机自身减速机传动比。
2. 舵轮反馈分支 `gearRatio`：外置反馈路径的齿轮比/减速比。

protobuf 属性名没有区分语义，前端必须通过组件类型、属性路径和功能角色显示上下文名称。不能把两个字段合并，也不能新增未经模板确认的 `totalGearRatio` 字段。

### P1：内置反馈分支没有齿轮比字段

卧式/立式模板的 `GROUP_CALI_ABS_INTERNAL` 分支没有 `gearRatio`，只有外置绝对值分支带有齿轮比。这意味着：

- 内置编码器模式下，模板无法表达独立的转向输出齿轮比。
- 如果实际机械结构存在电机输出到转向轴的齿轮比，该信息目前只能隐含在电机减速比或产品型号中，不能可靠地单独配置。
- 是否扩展模板，必须由协议/模型定义负责人确认。

### P1：通用模板与工程规则不完全一致

`diffSteerWheel-Common.json` 允许外置增量、ABZ、外置绝对值三类反馈，但当前工程规则要求差速舵轮必须使用外置绝对值编码器。应将“通用模板选项”和“项目构建约束”分层，不要修改通用事实模板来掩盖工程规则。

### P1：编码器类型维度不统一

电机使用 `ENCODER_INC`、`ENCODER_SGL_TURN_ABS`、`ENCODER_MULTI_TURN_ABS`；舵轮反馈使用 `GROUP_CALI_HELM_IO`、`GROUP_CALI_ABS_INTERNAL`、`GROUP_CALI_ABS_EXTERNAL` 等分组枚举。两套枚举表达的维度不同：一套偏“编码器类型”，一套偏“安装/反馈路径”。当前模板缺少正式的兼容映射表。

### P1：参考模型中存在不完整实例

`ModelSet` 中的 `Steerwheel_BR` 选择了外置绝对值反馈，但 `relatedEncode` 为 `FIXED_RELATED_NONE`。这说明参考模型不能无条件作为合法性模板，解析器和审计器必须区分“原始数据事实”和“合法配置结论”。

### P2：复合产品模板与通用模块模板边界不清晰

产品模板同时嵌入轮组、电机、驱动器和编码器信息。若前端把它们当成独立通用模块导入，容易重复创建、丢失引用或把产品级固定参数误当作用户可配置参数。建议在资源注册表中明确：通用模板、产品实例、复合模块三种来源类型。

## 7. 建议的模板重构方向

1. 新增“反馈路径/安装位置”与“编码器物理类型”的兼容规则层，不修改原始 protobuf 字段名称。
2. 对 `gearRatio` 使用路径化语义：
   - `motorAttr.gearRatio`：电机减速比。
   - `angleSensor.<activeGroup>.gearRatio`：反馈齿轮比。
3. 为卧式/立式舵轮增加内置反馈与转向电机的审计规则。
4. 对差速舵轮强制校验：左右电机、外置绝对值编码器、`relatedEncode` 非空。
5. 对多圈绝对值电机编码器与舵轮内置反馈的映射建立正式配置，未确认前不得自动转换。
6. 复合产品模板保留原始数据，同时生成可追溯的组件引用图，不把产品信息静默拆成猜测出的参数。
7. 审计输出同时报告：结构完整性、属性完整性、引用完整性、工程约束、模板缺口。

## 8. 行业资料交叉参考

公开厂商资料表明，行业中的舵轮/驱动单元通常将行走电机、转向机构/电机、减速机构、轮体、驱动器和反馈编码器组合成一个可安装单元，但具体机械结构和反馈安装位置会因产品不同而变化：

- ABB AMR P604 手册描述了由驱动单元完成行走与转向，并区分转向绝对编码器和驱动增量编码器：[ABB AMR P604 Product Manual](https://library.e.abb.com/public/00456a1d13164cf2ab1e569ab5555b82/3HAS00005-001_en_B_AMR%20P604%20-%20Product%20Manual.pdf)
- Sumitomo smartris 将齿轮、伺服电机和驱动器作为 AGV/AMR 的组合方案，并分别列出减速比和反馈传感器：[Sumitomo smartris](https://us.sumitomodrive.com/en-us/product/agv-smartris)
- Spinea MoveSpin 将牵引驱动和转向驱动分开列出，分别给出传动比/总传动比、PMSM、电机电流、扭矩、转速和编码器信息：[Spinea MoveSpin MS 160-500](https://conedrive.com/cycloidal-series-ms-160-500/)
- DMM DVP 将伺服驱动器、电机、编码器、行星齿轮箱和轮体集成，并说明电机、制动器和齿轮箱比可以按车辆需求选择：[DMM DVP Wheel Drive](https://www.dmm-tech.com/dvp-wheel-drive)

这些资料支持“动力链由多个可独立识别的功能对象组成”的判断，但不能替代项目模板中尚未定义的字段或映射。

## 9. 结论

当前项目已经具备卧式舵轮、立式舵轮、差速舵轮、差速驱动轮、驱动器、PMSM/BLDC/BDC 电机和多种编码器的基础模板，但模板更接近“字段集合”，还不是完整的工程约束模型。

最需要优先修复的是：

1. 内置转向编码器与转向电机 `ENCType` 的一致性/兼容性校验。
2. 电机减速比与转向齿轮比的路径化语义和审计。
3. 差速舵轮外置绝对值编码器的强制关系。
4. 多圈绝对值电机编码器与舵轮内置反馈类型的正式映射。
5. 通用模板、产品模板和复合模块的边界标识。
