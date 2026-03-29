# ModelSet312 模块完整数据字典 (Exhaustive Modules Data Dictionary)

本文档通过全量自动化扫描提取 `cmodel` 所有的组件原子 JSON 生成。严格满足涵盖每个模块、每个属性、每个连接关系的【零遗漏】要求。

## 模块索引汇总
- [1. 模块: IO module (UUID: 07719f03c3634193aed300c01012bff3)](#io module)
- [2. 模块: MainController (UUID: 30ce17ed495f40a6b90d85158c1d6f08)](#maincontroller)
- [3. 模块: button-emc (UUID: 82c4bc5d93dd40bfafc57e81773a6173)](#button-emc)
- [4. 模块: charger (UUID: b55630cb09d44f65ad482e9202714f1b)](#charger)
- [5. 模块: chassis_diff (UUID: a6c2a0ccb9da489c8d58d7a583493893)](#chassis_diff)
- [6. 模块: diffWheel-lft (UUID: aef1e94374684741ab5aa36d1162f5f0)](#diffwheel-lft)
- [7. 模块: diffWheel-right (UUID: ca465f7732c043d09c33251d3e71cb0e)](#diffwheel-right)
- [8. 模块: down_sensor (UUID: 3cc65206187a4fb08c223ed77ddcf4c3)](#down_sensor)
- [9. 模块: driver-left (UUID: 82bd967322c54e888ef9aaf9752aded0)](#driver-left)
- [10. 模块: driver-lift (UUID: baa1c9403ec24ad4924283322ff4af95)](#driver-lift)
- [11. 模块: driver-right (UUID: c42343264c884ff2a0ca3fee8fc81997)](#driver-right)
- [12. 模块: gyro (UUID: 4202415039d54d8b8702065873899d42)](#gyro)
- [13. 模块: lamp (UUID: d2001a74c8b14cc8a6d67c8c4dca15c3)](#lamp)
- [14. 模块: laser-front (UUID: 820decb04dd74f6480b7b9e6c8a2f7d8)](#laser-front)
- [15. 模块: motor-left (UUID: 13e6b0ff93bc49e2a89a214744cae88b)](#motor-left)
- [16. 模块: motor-lift (UUID: 2dce6a0eb00c48ad9e16b1ab111a5de1)](#motor-lift)
- [17. 模块: motor-right (UUID: 639dde0162a3442489651066aaf9cdc7)](#motor-right)
- [18. 模块: smart camera0 (UUID: 5cd062a3b2df4938b1c1a06a61645f1f)](#smart camera0)
- [19. 模块: smart camera (UUID: 349a2134e3494755a776854914f78c83)](#smart camera)
- [20. 模块: up_sensor (UUID: a72279a85df345aba809eed5c2369108)](#up_sensor)

---

## <a id="io module"></a> 1. 模块: `IO module`
- **模块 UUID**: `07719f03c3634193aed300c01012bff3`
- **模块类型**: `extendedlnterface`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `boardAttr` (控制板属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `chipPlatform` | 芯片平台 | `R106` | `N/A` | `N/A` |  |
| `softwareSpec` | 软件规格 | `RA-EI/I-A-18A00BH5` | `N/A` | `N/A` |  |
| `offsetAddress` | 偏移地址拨码 | `0` | `N/A` | `N/A` |  |
| `bipolar` | 双极晶体管类型 | `Combo(PNP)` | `N/A` | `N/A` |  |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `d2d5eb5e4993400abad6c77949a1a50f`
- **级联远端 UUID**: `未连接`

#### 接口端口: `CAN_1` (CAN_1)
- **接口类型**: `CAN`
- **本端 UUID**: `643edc5a6bcd4ec693ca70c48303c0e6`
- **级联远端 UUID**: `1b899f8c4907479490c373180475bda3`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `resistor` | 带终端电阻 | `RESISTOR_HAVE` |
| `baudrate` | 波特率 | `1M` |
| `protocol` | 协议 | `PROTOCOL_UCAN` |
| `dialValue` | 拨码值 | `000` |
| `nodeId` | 节点Id | `110` |

#### 接口端口: `DI_1` (DI_1)
- **接口类型**: `DI`
- **本端 UUID**: `96ae90e3139e49fcbd2e19f46077159f`
- **级联远端 UUID**: `f916b38c40384d2f87e3d112f8b89364`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_2` (DI_2)
- **接口类型**: `DI`
- **本端 UUID**: `3848b724a8b84ca9800a3256b3cc6a88`
- **级联远端 UUID**: `35640c7f74ea4490810f9a39eb1bc14c`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_3` (DI_3)
- **接口类型**: `DI`
- **本端 UUID**: `619f6a413586418a8f4f92948449710b`
- **级联远端 UUID**: `cbf54ad302a94863bae83bcae4a49a5b`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_4` (DI_4)
- **接口类型**: `DI`
- **本端 UUID**: `b0a477eb81c9492697db48b154741d8d`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_5` (DI_5)
- **接口类型**: `DI`
- **本端 UUID**: `c4ec6b870d8840bfacd88d441a65abc1`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_6` (DI_6)
- **接口类型**: `DI`
- **本端 UUID**: `9b067c868ab44d3caa9e22a63a0b3ccf`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_7` (DI_7)
- **接口类型**: `DI`
- **本端 UUID**: `cd3ae6042f07452d8c08112a4075f961`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_8` (DI_8)
- **接口类型**: `DI`
- **本端 UUID**: `9a943417a7fa47bd80accdc7494f4734`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DO_1` (DO_1)
- **接口类型**: `DO`
- **本端 UUID**: `749fe2b61a9c412db8b9110c0b1565c8`
- **级联远端 UUID**: `f1cb8e9d1b55441fbad461ea95c7addb`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

#### 接口端口: `DO_2` (DO_2)
- **接口类型**: `DO`
- **本端 UUID**: `028817e7eb5848069b3b179c16c966c8`
- **级联远端 UUID**: `b249fb92ed564a96bd8bc3047cbb29e5`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

#### 接口端口: `DO_3` (DO_3)
- **接口类型**: `DO`
- **本端 UUID**: `e0b750687eed407f8f3a8410186b38de`
- **级联远端 UUID**: `3ecc311d62ef4d9d86492b837a28d392`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

#### 接口端口: `DO_4` (DO_4)
- **接口类型**: `DO`
- **本端 UUID**: `567fb65b09a544e4a6064f8861ae6962`
- **级联远端 UUID**: `f1196b3c6b4a4f799178668e4c6bc536`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

#### 接口端口: `DO_5` (DO_5)
- **接口类型**: `DO`
- **本端 UUID**: `6bff7e4108674ea5be612e9858492fd8`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

#### 接口端口: `DO_6` (DO_6)
- **接口类型**: `DO`
- **本端 UUID**: `b1010915b8f34d499760a258831891b2`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

#### 接口端口: `DO_7` (DO_7)
- **接口类型**: `DO`
- **本端 UUID**: `05bb0c73481f44079410d8328be782b5`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

#### 接口端口: `DO_8` (DO_8)
- **接口类型**: `DO`
- **本端 UUID**: `56ff529845b343d0a128aa5252f624c4`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

#### 接口端口: `DO_9` (DO_9)
- **接口类型**: `DO`
- **本端 UUID**: `5d4f6728ef9d4d03bc50e2536950ad3a`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

#### 接口端口: `DO_10` (DO_10)
- **接口类型**: `DO`
- **本端 UUID**: `e621d5d4d90c4cfa99f2d1fb90d660ca`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

### 接口能力底座 (Bus Interface Ability)
- PI() x1, CAN() x1, DI() x8, DO() x10

---
## <a id="maincontroller"></a> 2. 模块: `MainController`
- **模块 UUID**: `30ce17ed495f40a6b90d85158c1d6f08`
- **模块类型**: `mainCPU`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `boardAttr` (控制板属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `chipPlatform` | 芯片平台 | `R318` | `N/A` | `N/A` |  |
| `softwareSpec` | 软件规格 | `RA-MC-R318BN` | `N/A` | `N/A` |  |
| `isWithGyro` | 是否有板载陀螺仪 | `Combo(yes)` | `N/A` | `N/A` |  |
| `isWithUpCamera` | 是否有板载上读码头 | `Combo(no)` | `N/A` | `N/A` |  |
| `isWithDownCamera` | 是否有板载下读码头 | `Combo(no)` | `N/A` | `N/A` |  |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `49a6b6df2bc34fca81278c46381a530c`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PI_2` (PI_2)
- **接口类型**: `PI`
- **本端 UUID**: `14ca40f2fe324910a66fce0850433744`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_1` (PO_1)
- **接口类型**: `PO`
- **本端 UUID**: `0c592854f33a463988501e4b7ef36d85`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_2` (PO_2)
- **接口类型**: `PO`
- **本端 UUID**: `7c8a63a11a8b453aaf7042e90fd04556`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_3` (PO_3)
- **接口类型**: `PO`
- **本端 UUID**: `b5f145728299496484f73b82be61b5b4`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_4` (PO_4)
- **接口类型**: `PO`
- **本端 UUID**: `2867f4e9ea23431dab191b57740f8ee7`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_5` (PO_5)
- **接口类型**: `PO`
- **本端 UUID**: `048044b0fcce463eb1fa3330cf832691`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_6` (PO_6)
- **接口类型**: `PO`
- **本端 UUID**: `f7ea0ca30abe48d69be102da249e9e56`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_7` (PO_7)
- **接口类型**: `PO`
- **本端 UUID**: `8adcc10487b54ebb8ca2d270a56195aa`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_8` (PO_8)
- **接口类型**: `PO`
- **本端 UUID**: `005b6693c6734c53854e49b5429fc8f2`
- **级联远端 UUID**: `未连接`

#### 接口端口: `RS485_1` (RS485_1)
- **接口类型**: `RS485`
- **本端 UUID**: `c23c492ebcdd40a494ed18d76acf1de2`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `1` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `protocol` | 协议 | `ModbusRTU` |
| `siteType` | 类型 | `SITE_MASTER` |

#### 接口端口: `RS485_2` (RS485_2)
- **接口类型**: `RS485`
- **本端 UUID**: `b7f420c1e25d4023829550fd4ead8451`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `1` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `protocol` | 协议 | `ModbusRTU` |
| `siteType` | 类型 | `SITE_MASTER` |

#### 接口端口: `RS485_3` (RS485_3)
- **接口类型**: `RS485`
- **本端 UUID**: `4f2c896a3653467b9ae6d2e50661eb94`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `1` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `protocol` | 协议 | `ModbusRTU` |
| `siteType` | 类型 | `SITE_MASTER` |

#### 接口端口: `SPI_1` (SPI_1)
- **接口类型**: `SPI`
- **本端 UUID**: `438b965038d14fd29b6994c44909d96e`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `protocol` | 协议 | `HIK_GYRO_V1` |
| `speed` | 速度 | `1M` |

#### 接口端口: `CAN_1` (CAN_1)
- **接口类型**: `CAN`
- **本端 UUID**: `e6c21d5f507145a7bca50e4fb1c10fca`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `resistor` | 带终端电阻 | `RESISTOR_HAVE` |
| `baudrate` | 波特率 | `1M` |
| `protocol` | 协议 | `PROTOCOL_UCAN` |
| `nodeId` | 节点Id | `1` |

#### 接口端口: `CAN_2` (CAN_2)
- **接口类型**: `CAN`
- **本端 UUID**: `2ea0552b5a294d0e9945bec1137530ea`
- **级联远端 UUID**: `98fc774977934e07901ec799b7bffdaa, 1b34489764f14cb29d94b43d7157132a, ca2f4db3796447d0ab8f0f620095bd77`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `resistor` | 带终端电阻 | `RESISTOR_HAVE` |
| `baudrate` | 波特率 | `1M` |
| `protocol` | 协议 | `PROTOCOL_CANOPEN` |
| `nodeId` | 节点Id | `127` |

#### 接口端口: `CAN_3` (CAN_3)
- **接口类型**: `CAN`
- **本端 UUID**: `1b899f8c4907479490c373180475bda3`
- **级联远端 UUID**: `643edc5a6bcd4ec693ca70c48303c0e6`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `resistor` | 带终端电阻 | `RESISTOR_HAVE` |
| `baudrate` | 波特率 | `1M` |
| `protocol` | 协议 | `PROTOCOL_UCAN&PROTOCOL_EXT_CAN` |
| `nodeId` | 节点Id | `73` |

#### 接口端口: `ETH_1` (ETH_1)
- **接口类型**: `ETH`
- **本端 UUID**: `1df5209ef25d410a913824a04fbf1c3d`
- **级联远端 UUID**: `1df5209ef25d410a913824a04fbf1c3d, 1df5209ef25d410a913824a04fbf1c3d, 5f05424e8d8c4a9a979a821d85e58248, f8174a537b9843dabfd0619be5bd2f11, 86b04af5fa9944819a700cfdcaa8aed9, e79146c5a1054196b4a9e877109a8367, 28d197cffaff4f61b438bea3c487856d`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `DHCP` | DHCP | `False` |
| `ip` | ip参数 | `` |
| `gate` | 网关 | `` |
| `port` | 端口 | `1` |
| `speed` | 速度 | `100M` |

#### 接口端口: `ETH_2` (ETH_2)
- **接口类型**: `ETH`
- **本端 UUID**: `5f05424e8d8c4a9a979a821d85e58248`
- **级联远端 UUID**: `1df5209ef25d410a913824a04fbf1c3d`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `DHCP` | DHCP | `False` |
| `ip` | ip参数 | `` |
| `gate` | 网关 | `` |
| `port` | 端口 | `1` |
| `speed` | 速度 | `100M` |

#### 接口端口: `ETH_3` (ETH_3)
- **接口类型**: `ETH`
- **本端 UUID**: `f8174a537b9843dabfd0619be5bd2f11`
- **级联远端 UUID**: `1df5209ef25d410a913824a04fbf1c3d`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `DHCP` | DHCP | `False` |
| `ip` | ip参数 | `` |
| `gate` | 网关 | `` |
| `port` | 端口 | `1` |
| `speed` | 速度 | `100M` |

#### 接口端口: `USB_1` (USB_1)
- **接口类型**: `USB`
- **本端 UUID**: `ad8b642f0c41465a9b20ef08064e0893`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `port` | 端口 | `1` |

#### 接口端口: `RS232_1` (RS232_1)
- **接口类型**: `RS232`
- **本端 UUID**: `f8adaad63e244475ac3551c5dd9e5d84`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `1` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `protocol` | 协议 | `ModbusRTU` |
| `siteType` | 类型 | `SITE_MASTER` |

#### 接口端口: `RS232_2` (RS232_2)
- **接口类型**: `RS232`
- **本端 UUID**: `31bd7a118a124ae2b40b73c1602e796f`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `1` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `protocol` | 协议 | `ModbusRTU` |
| `siteType` | 类型 | `SITE_MASTER` |

#### 接口端口: `SPK_1` (SPK_1)
- **接口类型**: `SPK`
- **本端 UUID**: `4f96962f3b9249a58981e9336a91a733`
- **级联远端 UUID**: `未连接`

#### 接口端口: `SMA_1` (SMA_1)
- **接口类型**: `SMA`
- **本端 UUID**: `a5a779289119447ca377da3054be7918`
- **级联远端 UUID**: `未连接`

#### 接口端口: `SMA_2` (SMA_2)
- **接口类型**: `SMA`
- **本端 UUID**: `0424515abeaa45dcb1bde43d59e34f13`
- **级联远端 UUID**: `未连接`

#### 接口端口: `LVDS_1` (LVDS_1)
- **接口类型**: `LVDS`
- **本端 UUID**: `95941fe2e3f44dc6ad524ac94ca051ab`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `mode` | 模式 | `MIPI` |

#### 接口端口: `LVDS_2` (LVDS_2)
- **接口类型**: `LVDS`
- **本端 UUID**: `d5b5a8fb486044c190333e2529a10e20`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `mode` | 模式 | `MIPI` |

#### 接口端口: `LVDS_3` (LVDS_3)
- **接口类型**: `LVDS`
- **本端 UUID**: `4163a7b15b8445b28ab87c0b8e875ac3`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `mode` | 模式 | `MIPI` |

### 接口能力底座 (Bus Interface Ability)
- PI() x2, PO() x8, RS485() x3, SPI() x1, CAN() x3, ETH() x3, USB() x1, RS232() x2, SPK() x1, SMA() x2, LVDS() x3

---
## <a id="button-emc"></a> 3. 模块: `button-emc`
- **模块 UUID**: `82c4bc5d93dd40bfafc57e81773a6173`
- **模块类型**: `button`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `buttonAttr` (按钮属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `buttonType` | 按钮类型 | `Combo(BUTTON_COMP_EMCY)` | `N/A` | `N/A` |  |
| `switchMode` | 开关方式 | `Combo(knob)` | `N/A` | `N/A` |  |
| `buttonLamp` | 按钮灯控制 | `Combo(BUTTON_LAMP_NULL)` | `N/A` | `N/A` |  |
| `selfLock` | 是否自锁 | `True` | `N/A` | `N/A` |  |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `DO_1` (DO_1)
- **接口类型**: `DO`
- **本端 UUID**: `f916b38c40384d2f87e3d112f8b89364`
- **级联远端 UUID**: `96ae90e3139e49fcbd2e19f46077159f`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NC` |

#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `e33662fb3fee41f88199d59e78def893`
- **级联远端 UUID**: `未连接`

### 接口能力底座 (Bus Interface Ability)
- DO() x1, PI() x1

---
## <a id="charger"></a> 4. 模块: `charger`
- **模块 UUID**: `b55630cb09d44f65ad482e9202714f1b`
- **模块类型**: `sensor`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
*无私有属性*

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `DI_1` (DI_1)
- **接口类型**: `DI`
- **本端 UUID**: `f1196b3c6b4a4f799178668e4c6bc536`
- **级联远端 UUID**: `567fb65b09a544e4a6064f8861ae6962`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `0` |

### 接口能力底座 (Bus Interface Ability)
- DI() x1

---
## <a id="chassis_diff"></a> 5. 模块: `chassis_diff`
- **模块 UUID**: `a6c2a0ccb9da489c8d58d7a583493893`
- **模块类型**: `chassis`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `motionCenterAttr` (运动中心参数)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `headOffset(Idle)` | 距离车头距离（空载） | `738.0` | `0.0` | `1476.0` | mm |
| `tailOffset(Idle)` | 距离车尾距离（空载） | `738.0` | `0.0` | `1476.0` | mm |
| `leftOffset(Idle)` | 距离左侧距离（空载） | `531.5` | `0.0` | `1063.0` | mm |
| `rightOffset(Idle)` | 距离右侧距离（空载） | `531.5` | `0.0` | `1063.0` | mm |
| `headOffset (Full Load)` | 距离车头距离（满载） | `738.0` | `0.0` | `1476.0` | mm |
| `tailOffset (Full Load)` | 距离车尾距离（满载） | `738.0` | `0.0` | `1476.0` | mm |
| `leftOffset (Full Load)` | 距离左侧距离（满载） | `531.5` | `0.0` | `1063.0` | mm |
| `rightOffset (Full Load)` | 距离右侧距离（满载） | `531.5` | `0.0` | `1063.0` | mm |

#### 属性组: `chassisAttr` (底盘参数)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `wheelsNum` | 轮组个数 | `1` | `1` | `1` | 个 |
| `maxAcceleration(Idle)` | 最大线加速度（空载） | `500.0` | `0.0` | `9999.0` | mm/s2 |
| `maxDeceleration(Idle)` | 最大线减速度（空载） | `400.0` | `0.0` | `9999.0` | mm/s2 |
| `maxSpeed(Idle)` | 最大速度（空载） | `800.0` | `0.0` | `9999.0` | mm/s |
| `maxAcceleration (Full Load)` | 最大线加速度（满载） | `200.0` | `0.0` | `9999.0` | mm/s2 |
| `maxDeceleration (Full Load)` | 最大线减速度（满载） | `200.0` | `0.0` | `9999.0` | mm/s2 |
| `maxSpeed (Full Load)` | 最大速度（满载） | `600.0` | `0.0` | `9999.0` | mm/s |
| `avoidMaxDec (Idle)` | 避障最大减速度（空载） | `200.0` | `0.0` | `9999.0` | mm/s2 |
| `avoidMaxDec (Full Load)` | 避障最大减速度（满载） | `200.0` | `0.0` | `9999.0` | mm/s2 |
| `avoidRotMaxAngDec (Idle)` | 避障最大旋转减速度（空载） | `200.0` | `0.0` | `9999.0` | °/s2 |
| `avoidRotMaxAngDec (Full Load)` | 避障最大旋转减速度（满载） | `200.0` | `0.0` | `9999.0` | °/s2 |
| `rotateMaxAngAcceleration (Idle)` | 最大角加速度（空载） | `200.0` | `0.0` | `360.0` | °/s2 |
| `rotateMaxAngDeceleration (Idle)` | 最大角减速度（空载） | `100.0` | `0.0` | `360.0` | °/s2 |
| `rotateMaxAngSpeed (Idle)` | 最大角速度（空载） | `100.0` | `0.0` | `360.0` | °/s |
| `rotateMaxAngAcceleration (Full Load)` | 最大角加速度（满载） | `100.0` | `0.0` | `360.0` | °/s2 |
| `rotateMaxAngDeceleration (Full Load)` | 最大角减速度（满载） | `100.0` | `0.0` | `360.0` | °/s2 |
| `rotateMaxAngSpeed (Full Load)` | 最大角速度（满载） | `200.0` | `0.0` | `360.0` | °/s |
| `rotateDiameter` | 旋转直径 | `1063.0` | `0.0` | `9999.0` | mm |
| `maxClimbingAngle` | 爬坡能力 | `0.0` | `0.0` | `90.0` | ° |
| `totalLoadWeight` | 额定负载 | `0.0` | `0.0` | `9999.0` | kg |
| `selfWeight` | 自重 | `0.0` | `0.0` | `9999.0` | kg |

#### 属性组: `wheelsAttr` (轮组属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `wheelSpace` | 轮间距 | `900.0` | `1.0` | `1063.0` | mm |
| `locCoordNX` | 轴中心X坐标 | `0.0` | `-9999.0` | `9999.0` | mm |
| `locCoordNY` | 轴中心Y坐标 | `0.0` | `-9999.0` | `9999.0` | mm |
| `locCoordNZ` | 轴中心Z坐标 | `0.0` | `-9999.0` | `9999.0` | mm |

### 接口拓扑与连接关系 (Interface Topology)
*无接口定义*

---
## <a id="diffwheel-lft"></a> 6. 模块: `diffWheel-lft`
- **模块 UUID**: `aef1e94374684741ab5aa36d1162f5f0`
- **模块类型**: `driveWheel`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `wheelAttr` (基本属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `wheelRadius` | 轮半径 | `65.0` | `1.0` | `999.0` | mm |

#### 属性组: `linkMotorAttr` (关联电机)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `relateMotor` | 行走电机 | `motor-left` | `N/A` | `N/A` |  |

### 接口拓扑与连接关系 (Interface Topology)
*无接口定义*

---
## <a id="diffwheel-right"></a> 7. 模块: `diffWheel-right`
- **模块 UUID**: `ca465f7732c043d09c33251d3e71cb0e`
- **模块类型**: `driveWheel`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `wheelAttr` (基本属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `wheelRadius` | 轮半径 | `65.0` | `1.0` | `999.0` | mm |

#### 属性组: `linkMotorAttr` (关联电机)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `relateMotor` | 行走电机 | `motor-right` | `N/A` | `N/A` |  |

### 接口拓扑与连接关系 (Interface Topology)
*无接口定义*

---
## <a id="down_sensor"></a> 8. 模块: `down_sensor`
- **模块 UUID**: `3cc65206187a4fb08c223ed77ddcf4c3`
- **模块类型**: `sensor`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
*无私有属性*

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `7a7bf4a1719c436ea2f98082cd231684`
- **级联远端 UUID**: `未连接`

#### 接口端口: `DO_1` (DO_1)
- **接口类型**: `DO`
- **本端 UUID**: `cbf54ad302a94863bae83bcae4a49a5b`
- **级联远端 UUID**: `619f6a413586418a8f4f92948449710b`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

### 接口能力底座 (Bus Interface Ability)
- PI() x1, DO() x1

---
## <a id="driver-left"></a> 9. 模块: `driver-left`
- **模块 UUID**: `82bd967322c54e888ef9aaf9752aded0`
- **模块类型**: `driver`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `boardAttr` (控制板属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `chipPlatform` | 芯片平台 | `R131` | `N/A` | `N/A` |  |
| `softwareSpec` | 软件规格 | `NONE` | `N/A` | `N/A` |  |
| `inputVoltage` | 输入电压 | `0.0` | `0.0` | `999.0` | V |
| `inputCurrent` | 输入电流 | `0.0` | `0.0` | `999.0` | A |
| `overloadCapacity` | 过载能力 | `2.0` | `0.0` | `99.0` | 倍 |
| `overloadTime` | 过载时长 | `3.0` | `0.0` | `99.0` | S |
| `type` | 驱动类型 | `Combo(MOTOR_SERVO_TYPE_KINCO)` | `N/A` | `N/A` |  |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `a409a350334d4b52a9d37b76dc1f257f`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_1` (PO_1)
- **接口类型**: `PO`
- **本端 UUID**: `b3dc3c21f337412ca67fe94459d077d8`
- **级联远端 UUID**: `未连接`

#### 接口端口: `CAN_1` (CAN_1)
- **接口类型**: `CAN`
- **本端 UUID**: `98fc774977934e07901ec799b7bffdaa`
- **级联远端 UUID**: `2ea0552b5a294d0e9945bec1137530ea`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `resistor` | 带终端电阻 | `RESISTOR_HAVE` |
| `baudrate` | 波特率 | `1M` |
| `protocol` | 协议 | `PROTOCOL_CANOPEN` |
| `dialValue` | 拨码值 | `` |
| `nodeId` | 节点Id | `1` |

#### 接口端口: `UART_1` (UART_1)
- **接口类型**: `UART`
- **本端 UUID**: `71e6e4d35f6847059acd1781b35316da`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `0` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `mode` | 模式 | `*` |
| `protocol` | 协议 | `HIK_TOF_V1` |

#### 接口端口: `UART_2` (UART_2)
- **接口类型**: `UART`
- **本端 UUID**: `d085848266d5493082fbcd46d15e6fa8`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `0` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `mode` | 模式 | `*` |
| `protocol` | 协议 | `HIK_TOF_V1` |

#### 接口端口: `RS232_1` (RS232_1)
- **接口类型**: `RS232`
- **本端 UUID**: `5a0a97edec67488985629073af2ddd35`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `1` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `protocol` | 协议 | `ModbusRTU` |
| `siteType` | 类型 | `SITE_MASTER` |

#### 接口端口: `DI_1` (DI_1)
- **接口类型**: `DI`
- **本端 UUID**: `4246ee3faa9a4e51afec5a908c6da286`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_2` (DI_2)
- **接口类型**: `DI`
- **本端 UUID**: `894af3609ca64cc6b25740589c66b7a5`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_3` (DI_3)
- **接口类型**: `DI`
- **本端 UUID**: `931bab1e0ca24950b4f1749a89a24d80`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_4` (DI_4)
- **接口类型**: `DI`
- **本端 UUID**: `ccb5779c1b4e4528ace324bede3764f2`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_5` (DI_5)
- **接口类型**: `DI`
- **本端 UUID**: `420a309e7cd4486c8f9fec1aff823db0`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_6` (DI_6)
- **接口类型**: `DI`
- **本端 UUID**: `75eb9979472540bc91a208a9bc9c9091`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `AI_1` (AI_1)
- **接口类型**: `AI`
- **本端 UUID**: `084830950a4c46d691624fcb556d6b40`
- **级联远端 UUID**: `未连接`

#### 接口端口: `AI_2` (AI_2)
- **接口类型**: `AI`
- **本端 UUID**: `1249ce7ed80840699aee639193afff97`
- **级联远端 UUID**: `未连接`

#### 接口端口: `LINE_1` (LINE_1)
- **接口类型**: `LINE`
- **本端 UUID**: `8dd9d94bb87c4b578c653b4edc461c97`
- **级联远端 UUID**: `a04a03ca08d945cb8d01e2af8214e097`

#### 接口端口: `ENCR_1` (ENCR_1)
- **接口类型**: `ENCR`
- **本端 UUID**: `322245d559a54878a3dc6e305d4dfca7`
- **级联远端 UUID**: `1a181dc1be834800b49c0873ffe4c7a7`

### 接口能力底座 (Bus Interface Ability)
- PI() x1, PO() x1, CAN() x1, UART() x2, RS232() x1, DI() x6, AI() x2, LINE() x1, ENCR() x1

---
## <a id="driver-lift"></a> 10. 模块: `driver-lift`
- **模块 UUID**: `baa1c9403ec24ad4924283322ff4af95`
- **模块类型**: `driver`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `boardAttr` (控制板属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `chipPlatform` | 芯片平台 | `R131` | `N/A` | `N/A` |  |
| `softwareSpec` | 软件规格 | `NONE` | `N/A` | `N/A` |  |
| `inputVoltage` | 输入电压 | `0.0` | `0.0` | `999.0` | V |
| `inputCurrent` | 输入电流 | `0.0` | `0.0` | `999.0` | A |
| `overloadCapacity` | 过载能力 | `2.0` | `0.0` | `99.0` | 倍 |
| `overloadTime` | 过载时长 | `3.0` | `0.0` | `99.0` | S |
| `type` | 驱动类型 | `Combo(MOTOR_SERVO_TYPE_KINCO)` | `N/A` | `N/A` |  |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `110d0df56cdd42a593ad0f999bebf461`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_1` (PO_1)
- **接口类型**: `PO`
- **本端 UUID**: `4f10a34dd25242bea67fa128e084058a`
- **级联远端 UUID**: `未连接`

#### 接口端口: `CAN_1` (CAN_1)
- **接口类型**: `CAN`
- **本端 UUID**: `ca2f4db3796447d0ab8f0f620095bd77`
- **级联远端 UUID**: `2ea0552b5a294d0e9945bec1137530ea`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `resistor` | 带终端电阻 | `RESISTOR_HAVE` |
| `baudrate` | 波特率 | `1M` |
| `protocol` | 协议 | `PROTOCOL_CANOPEN` |
| `dialValue` | 拨码值 | `` |
| `nodeId` | 节点Id | `3` |

#### 接口端口: `UART_1` (UART_1)
- **接口类型**: `UART`
- **本端 UUID**: `93978c64b4a1449e82b7953690906e33`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `0` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `mode` | 模式 | `*` |
| `protocol` | 协议 | `HIK_TOF_V1` |

#### 接口端口: `UART_2` (UART_2)
- **接口类型**: `UART`
- **本端 UUID**: `310cb9999a8d476e951f03af3400efd8`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `0` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `mode` | 模式 | `*` |
| `protocol` | 协议 | `HIK_TOF_V1` |

#### 接口端口: `RS232_1` (RS232_1)
- **接口类型**: `RS232`
- **本端 UUID**: `8ea32058644243b396078a37217fdd45`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `1` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `protocol` | 协议 | `ModbusRTU` |
| `siteType` | 类型 | `SITE_MASTER` |

#### 接口端口: `DI_1` (DI_1)
- **接口类型**: `DI`
- **本端 UUID**: `9ea6b80ab7874ea180bf9b37f5d51b6c`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_2` (DI_2)
- **接口类型**: `DI`
- **本端 UUID**: `c9d3d4bb95734493b610cc089e5753f6`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_3` (DI_3)
- **接口类型**: `DI`
- **本端 UUID**: `10769979a60d45c7ae90340275125dd6`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_4` (DI_4)
- **接口类型**: `DI`
- **本端 UUID**: `216debb2669043b48dec4c61672ec1cf`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_5` (DI_5)
- **接口类型**: `DI`
- **本端 UUID**: `fd3e20ac286c43fb86866078f4b90ec7`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_6` (DI_6)
- **接口类型**: `DI`
- **本端 UUID**: `bd092f7c3289414a9d2d1398ad72219a`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `AI_1` (AI_1)
- **接口类型**: `AI`
- **本端 UUID**: `7d67b4fc02004a73b79ec62dcae42e9b`
- **级联远端 UUID**: `未连接`

#### 接口端口: `AI_2` (AI_2)
- **接口类型**: `AI`
- **本端 UUID**: `7e15c25503a64883b48d32cb1405a8ad`
- **级联远端 UUID**: `未连接`

#### 接口端口: `LINE_1` (LINE_1)
- **接口类型**: `LINE`
- **本端 UUID**: `3b957ea46b27441c80e0112123e2bc36`
- **级联远端 UUID**: `404c201670604c8c91da332f683e4598`

#### 接口端口: `ENCR_1` (ENCR_1)
- **接口类型**: `ENCR`
- **本端 UUID**: `71159e54ffe743fda65a868fca9ee1ca`
- **级联远端 UUID**: `6c4b0e925ddb4a2492a766f8dbc44ca0`

### 接口能力底座 (Bus Interface Ability)
- PI() x1, PO() x1, CAN() x1, UART() x2, RS232() x1, DI() x6, AI() x2, LINE() x1, ENCR() x1

---
## <a id="driver-right"></a> 11. 模块: `driver-right`
- **模块 UUID**: `c42343264c884ff2a0ca3fee8fc81997`
- **模块类型**: `driver`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `boardAttr` (控制板属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `chipPlatform` | 芯片平台 | `R131` | `N/A` | `N/A` |  |
| `softwareSpec` | 软件规格 | `NONE` | `N/A` | `N/A` |  |
| `inputVoltage` | 输入电压 | `0.0` | `0.0` | `999.0` | V |
| `inputCurrent` | 输入电流 | `0.0` | `0.0` | `999.0` | A |
| `overloadCapacity` | 过载能力 | `2.0` | `0.0` | `99.0` | 倍 |
| `overloadTime` | 过载时长 | `3.0` | `0.0` | `99.0` | S |
| `type` | 驱动类型 | `Combo(MOTOR_SERVO_TYPE_KINCO)` | `N/A` | `N/A` |  |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `c4cc650a769b41e9bc6bfca02adbc7e1`
- **级联远端 UUID**: `未连接`

#### 接口端口: `PO_1` (PO_1)
- **接口类型**: `PO`
- **本端 UUID**: `5a884857c16c434fae893545fe9ec784`
- **级联远端 UUID**: `未连接`

#### 接口端口: `CAN_1` (CAN_1)
- **接口类型**: `CAN`
- **本端 UUID**: `1b34489764f14cb29d94b43d7157132a`
- **级联远端 UUID**: `2ea0552b5a294d0e9945bec1137530ea`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `resistor` | 带终端电阻 | `RESISTOR_HAVE` |
| `baudrate` | 波特率 | `1M` |
| `protocol` | 协议 | `PROTOCOL_CANOPEN` |
| `dialValue` | 拨码值 | `` |
| `nodeId` | 节点Id | `2` |

#### 接口端口: `UART_1` (UART_1)
- **接口类型**: `UART`
- **本端 UUID**: `92387aa03117401ea46e88ddf42d2734`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `0` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `mode` | 模式 | `*` |
| `protocol` | 协议 | `HIK_TOF_V1` |

#### 接口端口: `UART_2` (UART_2)
- **接口类型**: `UART`
- **本端 UUID**: `d150038fda8c420d938376e987a9d12a`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `0` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `mode` | 模式 | `*` |
| `protocol` | 协议 | `HIK_TOF_V1` |

#### 接口端口: `RS232_1` (RS232_1)
- **接口类型**: `RS232`
- **本端 UUID**: `0ddb97ea62f84b89afa8662be561089f`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `baudrate` | 波特率 | `9600` |
| `dataBits` | 有效数字位 | `1` |
| `patity` | 奇偶校验 | `None` |
| `stopBits` | 停止位 | `1` |
| `protocol` | 协议 | `ModbusRTU` |
| `siteType` | 类型 | `SITE_MASTER` |

#### 接口端口: `DI_1` (DI_1)
- **接口类型**: `DI`
- **本端 UUID**: `7aab459babfe4dd5b41339ed45992dc4`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_2` (DI_2)
- **接口类型**: `DI`
- **本端 UUID**: `936e251566c34d02b5bc630ae548b64a`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_3` (DI_3)
- **接口类型**: `DI`
- **本端 UUID**: `9c8268ea501b4a97b676fae3b8da5fe2`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_4` (DI_4)
- **接口类型**: `DI`
- **本端 UUID**: `0f7739ed845e47019e18669d779b19aa`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_5` (DI_5)
- **接口类型**: `DI`
- **本端 UUID**: `b308d9966bc54520b0e518525fd13e64`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `DI_6` (DI_6)
- **接口类型**: `DI`
- **本端 UUID**: `bc9aba677b4643169c510722658ef133`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `AI_1` (AI_1)
- **接口类型**: `AI`
- **本端 UUID**: `3da196fdedb44290b5a57d026956ddd5`
- **级联远端 UUID**: `未连接`

#### 接口端口: `AI_2` (AI_2)
- **接口类型**: `AI`
- **本端 UUID**: `20450fd577804281a84969a32b34683d`
- **级联远端 UUID**: `未连接`

#### 接口端口: `LINE_1` (LINE_1)
- **接口类型**: `LINE`
- **本端 UUID**: `47c1cac505c9455ca8fb712c095798d0`
- **级联远端 UUID**: `c8e329d1f55c4146952c13724d31dcb0`

#### 接口端口: `ENCR_1` (ENCR_1)
- **接口类型**: `ENCR`
- **本端 UUID**: `1667de5c5b1e426db53afb3e419fb006`
- **级联远端 UUID**: `464a96a51d25407a91f2c961b30d9412`

### 接口能力底座 (Bus Interface Ability)
- PI() x1, PO() x1, CAN() x1, UART() x2, RS232() x1, DI() x6, AI() x2, LINE() x1, ENCR() x1

---
## <a id="gyro"></a> 12. 模块: `gyro`
- **模块 UUID**: `4202415039d54d8b8702065873899d42`
- **模块类型**: `sensor`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `sensorAttr` (传感属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `yawRangeMin` | 偏航角最小值 | `0.0` | `-180.0` | `180.0` | ° |
| `yawRangeMax` | 偏航角最大值 | `0.0` | `-180.0` | `180.0` | ° |
| `rollRangeMin` | 翻滚角最小值 | `0.0` | `-180.0` | `180.0` | ° |
| `rollRangeMax` | 翻滚角最大值 | `0.0` | `-180.0` | `180.0` | ° |
| `pitchRangeMin` | 俯仰角最小值 | `0.0` | `-180.0` | `180.0` | ° |
| `pitchRangeMax` | 俯仰角最大值 | `0.0` | `-180.0` | `180.0` | ° |
| `angularResolution` | 角度分辨率 | `0.0` | `0.0` | `180.0` | ° |
| `accelerationResolution` | 加速度分辩率 | `0.0` | `0.0` | `360.0` | °/s |
| `accelerationAccuracy` | 加速度精度 | `0.0` | `0.0` | `360.0` | °/s |

### 接口拓扑与连接关系 (Interface Topology)
*无接口定义*

---
## <a id="lamp"></a> 13. 模块: `lamp`
- **模块 UUID**: `d2001a74c8b14cc8a6d67c8c4dca15c3`
- **模块类型**: `light`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `lightAttr` (灯光属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `lightType` | 指示灯类型 | `Combo(projectionLights)` | `N/A` | `N/A` |  |
| `lightColor` | 指示灯颜色 | `Combo(blue)` | `N/A` | `N/A` |  |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `DI_1` (DI_1)
- **接口类型**: `DI`
- **本端 UUID**: `f1cb8e9d1b55441fbad461ea95c7addb`
- **级联远端 UUID**: `749fe2b61a9c412db8b9110c0b1565c8`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `0` |

#### 接口端口: `DI_2` (DI_2)
- **接口类型**: `DI`
- **本端 UUID**: `b249fb92ed564a96bd8bc3047cbb29e5`
- **级联远端 UUID**: `028817e7eb5848069b3b179c16c966c8`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `0` |

#### 接口端口: `DI_3` (DI_3)
- **接口类型**: `DI`
- **本端 UUID**: `3ecc311d62ef4d9d86492b837a28d392`
- **级联远端 UUID**: `e0b750687eed407f8f3a8410186b38de`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `0` |

### 接口能力底座 (Bus Interface Ability)
- DI() x3

---
## <a id="laser-front"></a> 14. 模块: `laser-front`
- **模块 UUID**: `820decb04dd74f6480b7b9e6c8a2f7d8`
- **模块类型**: `sensor`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `sensorAttr` (传感属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `waveLength` | 波长 | `0.0` | `0.0` | `99999.0` | nm |
| `antiLight` | 抗光干扰 | `90.0` | `0.0` | `99999.0` | klux |
| `needCalib` | 是否需要标定 | `False` | `N/A` | `N/A` |  |

#### 属性组: `scanAttr` (扫描属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `scanDirect` | 扫描方向 | `Combo(SCAN_COUNTERCLOCKWISE)` | `N/A` | `N/A` |  |
| `usageMode` | 应用方式 | `Combo(PClOUD_LASER)` | `N/A` | `N/A` |  |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `5a8b4834a36d49c1a05fcba30abb4e50`
- **级联远端 UUID**: `未连接`

#### 接口端口: `ETH_1` (ETH_1)
- **接口类型**: `ETH`
- **本端 UUID**: `28d197cffaff4f61b438bea3c487856d`
- **级联远端 UUID**: `1df5209ef25d410a913824a04fbf1c3d`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `deviceId` | 设备id | `` |
| `ip` | ip参数 | `192.168.1.85` |
| `gate` | 网关 | `` |
| `port` | 端口 | `1` |
| `speed` | 速度 | `100M` |

### 接口能力底座 (Bus Interface Ability)
- PI() x1, ETH() x1

---
## <a id="motor-left"></a> 15. 模块: `motor-left`
- **模块 UUID**: `13e6b0ff93bc49e2a89a214744cae88b`
- **模块类型**: `driver`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `motorAttr` (电机属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `ENCType` | 编码器类型 | `Combo(ENCODER_INC)` | `N/A` | `N/A` |  |
| `initMode` | 电机初始状态 | `Combo(MODE_FREERUN)` | `N/A` | `N/A` |  |
| `RPM` | 电机额定转速 | `3000` | `0` | `9999` | RPM |
| `bTemper` | 是否支持电机温度获取 | `False` | `N/A` | `N/A` |  |
| `bHbrake` | 是否带抱闸 | `False` | `N/A` | `N/A` |  |
| `bReverse` | 是否反向 | `False` | `N/A` | `N/A` |  |
| `torque` | 额定扭矩 | `0.0` | `0.0` | `9999.0` | N*m |
| `gearRatio` | 减速比 | `25.0` | `1.0` | `9999.0` |  |
| `ratedCurr` | 额定电流 | `0.0` | `0.0` | `9999.0` | A |
| `overCurrCoef` | 过流系数 | `0.0` | `0.0` | `9999.0` |  |
| `defaultAcc` | 默认加速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |
| `defaultDec` | 默认减速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |
| `maxAcc` | 电机支持的最大加速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |
| `maxDec` | 电机支持的最大减速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `95bed6f46cac4559a41c7f9d8b6261ee`
- **级联远端 UUID**: `未连接`

#### 接口端口: `DI_1` (DI_1)
- **接口类型**: `DI`
- **本端 UUID**: `4d5501f9142b49249ec7b2ef2d4a0cdc`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `LINE_1` (LINE_1)
- **接口类型**: `LINE`
- **本端 UUID**: `a04a03ca08d945cb8d01e2af8214e097`
- **级联远端 UUID**: `8dd9d94bb87c4b578c653b4edc461c97`

#### 接口端口: `ENCR_1` (ENCR_1)
- **接口类型**: `ENCR`
- **本端 UUID**: `1a181dc1be834800b49c0873ffe4c7a7`
- **级联远端 UUID**: `322245d559a54878a3dc6e305d4dfca7`

### 接口能力底座 (Bus Interface Ability)
- PI() x1, DI() x1, LINE() x1, ENCR() x1

---
## <a id="motor-lift"></a> 16. 模块: `motor-lift`
- **模块 UUID**: `2dce6a0eb00c48ad9e16b1ab111a5de1`
- **模块类型**: `driver`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `motorAttr` (电机属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `ENCType` | 编码器类型 | `Combo(ENCODER_INC)` | `N/A` | `N/A` |  |
| `initMode` | 电机初始状态 | `Combo(MODE_FREERUN)` | `N/A` | `N/A` |  |
| `RPM` | 电机额定转速 | `3000` | `0` | `9999` | RPM |
| `bTemper` | 是否支持电机温度获取 | `False` | `N/A` | `N/A` |  |
| `bHbrake` | 是否带抱闸 | `True` | `N/A` | `N/A` |  |
| `bReverse` | 是否反向 | `False` | `N/A` | `N/A` |  |
| `torque` | 额定扭矩 | `0.0` | `0.0` | `9999.0` | N*m |
| `gearRatio` | 减速比 | `35.0` | `1.0` | `9999.0` |  |
| `ratedCurr` | 额定电流 | `0.0` | `0.0` | `9999.0` | A |
| `overCurrCoef` | 过流系数 | `0.0` | `0.0` | `9999.0` |  |
| `defaultAcc` | 默认加速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |
| `defaultDec` | 默认减速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |
| `maxAcc` | 电机支持的最大加速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |
| `maxDec` | 电机支持的最大减速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `90c625125d3549f9ba2106fb6904ef33`
- **级联远端 UUID**: `未连接`

#### 接口端口: `DI_1` (DI_1)
- **接口类型**: `DI`
- **本端 UUID**: `8f63341f5cfa4a27ada2a932fbeabcd8`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `LINE_1` (LINE_1)
- **接口类型**: `LINE`
- **本端 UUID**: `404c201670604c8c91da332f683e4598`
- **级联远端 UUID**: `3b957ea46b27441c80e0112123e2bc36`

#### 接口端口: `ENCR_1` (ENCR_1)
- **接口类型**: `ENCR`
- **本端 UUID**: `6c4b0e925ddb4a2492a766f8dbc44ca0`
- **级联远端 UUID**: `71159e54ffe743fda65a868fca9ee1ca`

### 接口能力底座 (Bus Interface Ability)
- PI() x1, DI() x1, LINE() x1, ENCR() x1

---
## <a id="motor-right"></a> 17. 模块: `motor-right`
- **模块 UUID**: `639dde0162a3442489651066aaf9cdc7`
- **模块类型**: `driver`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `motorAttr` (电机属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `ENCType` | 编码器类型 | `Combo(ENCODER_INC)` | `N/A` | `N/A` |  |
| `initMode` | 电机初始状态 | `Combo(MODE_FREERUN)` | `N/A` | `N/A` |  |
| `RPM` | 电机额定转速 | `3000` | `0` | `9999` | RPM |
| `bTemper` | 是否支持电机温度获取 | `False` | `N/A` | `N/A` |  |
| `bHbrake` | 是否带抱闸 | `False` | `N/A` | `N/A` |  |
| `bReverse` | 是否反向 | `True` | `N/A` | `N/A` |  |
| `torque` | 额定扭矩 | `0.0` | `0.0` | `9999.0` | N*m |
| `gearRatio` | 减速比 | `25.0` | `1.0` | `9999.0` |  |
| `ratedCurr` | 额定电流 | `0.0` | `0.0` | `9999.0` | A |
| `overCurrCoef` | 过流系数 | `0.0` | `0.0` | `9999.0` |  |
| `defaultAcc` | 默认加速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |
| `defaultDec` | 默认减速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |
| `maxAcc` | 电机支持的最大加速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |
| `maxDec` | 电机支持的最大减速度 | `0.0` | `0.0` | `9999.0` | r/s^2 |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `602ccc110bfc4e69a93597c6a245682d`
- **级联远端 UUID**: `未连接`

#### 接口端口: `DI_1` (DI_1)
- **接口类型**: `DI`
- **本端 UUID**: `81c1854061ed440d824fd1407f7e06b0`
- **级联远端 UUID**: `未连接`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `activeLevel` | 有效电平 | `1` |

#### 接口端口: `LINE_1` (LINE_1)
- **接口类型**: `LINE`
- **本端 UUID**: `c8e329d1f55c4146952c13724d31dcb0`
- **级联远端 UUID**: `47c1cac505c9455ca8fb712c095798d0`

#### 接口端口: `ENCR_1` (ENCR_1)
- **接口类型**: `ENCR`
- **本端 UUID**: `464a96a51d25407a91f2c961b30d9412`
- **级联远端 UUID**: `1667de5c5b1e426db53afb3e419fb006`

### 接口能力底座 (Bus Interface Ability)
- PI() x1, DI() x1, LINE() x1, ENCR() x1

---
## <a id="smart camera0"></a> 18. 模块: `smart camera0`
- **模块 UUID**: `5cd062a3b2df4938b1c1a06a61645f1f`
- **模块类型**: `sensor`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `sensorAttr` (传感属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `focalLength` | 焦距 | `0.0` | `0.0` | `99999.0` | mm |
| `exposure` | 曝光时长范围 | `0.0` | `0.0` | `99.0` | s |
| `needCalib` | 是否需要标定 | `False` | `N/A` | `N/A` |  |

#### 属性组: `pictureAttr` (图像属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `scanRangeHorizonStart` | 水平视场角起始 | `0.0` | `-180.0` | `180.0` | ° |
| `scanRangeHorizonEnd` | 水平视场角终止 | `0.0` | `-180.0` | `180.0` | ° |
| `scanRangeVerticalStart` | 垂直视场角起始 | `0.0` | `-180.0` | `180.0` | ° |
| `scanRangeVerticalEnd` | 垂直视场角终止 | `0.0` | `-180.0` | `180.0` | ° |
| `resolutionH` | 分辨率H | `0.0` | `0.0` | `9999.0` | PPI |
| `resolutionW` | 分辨率W | `0.0` | `0.0` | `9999.0` | PPI |
| `codecMode` | 视频编码标准 | `` | `N/A` | `N/A` |  |
| `frameRate` | 最大帧率 | `0.0` | `0.0` | `9999.0` | fps |

#### 属性组: `resultAttr` (识别属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `resultType` | 识别结果类型 | `` | `N/A` | `N/A` |  |
| `resultValue` | 识别结果 | `` | `N/A` | `N/A` |  |
| `scanDistence` | 有效扫描距离 | `0.0` | `0.0` | `99999.0` | mm |
| `accuracy` | 识别精度 | `0.0` | `0.0` | `99999.0` | mm |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `ETH_1` (ETH_1)
- **接口类型**: `ETH`
- **本端 UUID**: `e79146c5a1054196b4a9e877109a8367`
- **级联远端 UUID**: `1df5209ef25d410a913824a04fbf1c3d`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `deviceId` | 设备id | `100000010000000` |
| `ip` | ip参数 | `192.168.1.21` |
| `gate` | 网关 | `` |
| `port` | 端口 | `1` |
| `speed` | 速度 | `100M` |

### 接口能力底座 (Bus Interface Ability)
- ETH() x1

---
## <a id="smart camera"></a> 19. 模块: `smart camera`
- **模块 UUID**: `349a2134e3494755a776854914f78c83`
- **模块类型**: `sensor`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
#### 属性组: `sensorAttr` (传感属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `focalLength` | 焦距 | `0.0` | `0.0` | `99999.0` | mm |
| `exposure` | 曝光时长范围 | `0.0` | `0.0` | `99.0` | s |
| `needCalib` | 是否需要标定 | `False` | `N/A` | `N/A` |  |

#### 属性组: `pictureAttr` (图像属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `scanRangeHorizonStart` | 水平视场角起始 | `0.0` | `-180.0` | `180.0` | ° |
| `scanRangeHorizonEnd` | 水平视场角终止 | `0.0` | `-180.0` | `180.0` | ° |
| `scanRangeVerticalStart` | 垂直视场角起始 | `0.0` | `-180.0` | `180.0` | ° |
| `scanRangeVerticalEnd` | 垂直视场角终止 | `0.0` | `-180.0` | `180.0` | ° |
| `resolutionH` | 分辨率H | `0.0` | `0.0` | `9999.0` | PPI |
| `resolutionW` | 分辨率W | `0.0` | `0.0` | `9999.0` | PPI |
| `codecMode` | 视频编码标准 | `` | `N/A` | `N/A` |  |
| `frameRate` | 最大帧率 | `0.0` | `0.0` | `9999.0` | fps |

#### 属性组: `resultAttr` (识别属性)
| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |
|---|---|---|---|---|---|
| `resultType` | 识别结果类型 | `` | `N/A` | `N/A` |  |
| `resultValue` | 识别结果 | `` | `N/A` | `N/A` |  |
| `scanDistence` | 有效扫描距离 | `0.0` | `0.0` | `99999.0` | mm |
| `accuracy` | 识别精度 | `0.0` | `0.0` | `99999.0` | mm |

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `ETH_1` (ETH_1)
- **接口类型**: `ETH`
- **本端 UUID**: `86b04af5fa9944819a700cfdcaa8aed9`
- **级联远端 UUID**: `1df5209ef25d410a913824a04fbf1c3d`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `deviceId` | 设备id | `100000000000000` |
| `ip` | ip参数 | `192.168.1.20` |
| `gate` | 网关 | `` |
| `port` | 端口 | `1` |
| `speed` | 速度 | `100M` |

### 接口能力底座 (Bus Interface Ability)
- ETH() x1

---
## <a id="up_sensor"></a> 20. 模块: `up_sensor`
- **模块 UUID**: `a72279a85df345aba809eed5c2369108`
- **模块类型**: `sensor`
- **供应商**: `N/A`
### 私有属性 (Private Attributes)
*无私有属性*

### 接口拓扑与连接关系 (Interface Topology)
#### 接口端口: `PI_1` (PI_1)
- **接口类型**: `PI`
- **本端 UUID**: `61d78d087b1a420585396af5cf932a27`
- **级联远端 UUID**: `未连接`

#### 接口端口: `DO_1` (DO_1)
- **接口类型**: `DO`
- **本端 UUID**: `35640c7f74ea4490810f9a39eb1bc14c`
- **级联远端 UUID**: `3848b724a8b84ca9800a3256b3cc6a88`
**接口硬件参数配置:**
| 字段 (Key) | 描述 (Desc) | 配置值 | 
|---|---|---|
| `isReversed` | 是否反向 | `0` |
| `mode` | 模式 | `NO` |

### 接口能力底座 (Bus Interface Ability)
- PI() x1, DO() x1

---
