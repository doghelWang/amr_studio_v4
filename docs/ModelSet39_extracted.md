# AMR Studio V7.0 - 模型 (ModelSet39.cmodel) 精密解析报告 (V5)

## 1. 模块清单
- 1. `chassis_diff` (Type: `chassis`)
- 2. `diffWheel-lft` (Type: `driveWheel`)
- 3. `diffWheel-right` (Type: `driveWheel`)
- 4. `driver-left` (Type: `driver`)
- 5. `driver-right` (Type: `driver`)
- 6. `driver-lift` (Type: `driver`)
- 7. `motor-left` (Type: `driver`)
- 8. `motor-right` (Type: `driver`)
- 9. `motor-lift` (Type: `driver`)
- 10. `button-emc` (Type: `button`)
- 11. `up_sensor` (Type: `sensor`)
- 12. `down_sensor` (Type: `sensor`)
- 13. `lamp` (Type: `light`)
- 14. `charger` (Type: `sensor`)
- 15. `MainController` (Type: `mainCPU`)
- 16. `gyro` (Type: `sensor`)
- 17. `smart camera` (Type: `sensor`)
- 18. `smart camera0` (Type: `sensor`)
- 19. `laser-front` (Type: `sensor`)
- 20. `IO module` (Type: `extendedlnterface`)

## 2-6. 模块详细信息 (包含接口与电气连接)

### chassis_diff
- **模块类型**: `chassis`
- **尺寸信息**: {'wheelSpace': 900.0}
- **接口与网络信息**: 无接口定义
- **安装位置**: X=0.0, Y=0.0, Z=0.0, Yaw=None
- **电气/逻辑连接关系**: 无连接/顶级节点
- **核心参数**: 无

### diffWheel-lft
- **模块类型**: `driveWheel`
- **尺寸信息**: {'wheelRadius': 65.0}
- **接口与网络信息**: 无接口定义
- **安装位置**: X=None, Y=450.0, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数**: 无

### diffWheel-right
- **模块类型**: `driveWheel`
- **尺寸信息**: {'wheelRadius': 65.0}
- **接口与网络信息**: 无接口定义
- **安装位置**: X=None, Y=-450.0, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff, relateMotor: motor-right
- **核心参数**: 无

### driver-left
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `CAN`: 2个
  - `UART`: 4个
  - `RS232`: 2个
  - `DI`: 12个
  - `AI`: 4个
  - `PI`: 2个
  - `PO`: 2个
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数 (电气/减速比等)**: inputVoltage: 0.0, inputCurrent: 0.0, overloadCapacity: 2.0, VIN: 0.0, VOUT: 0.0, IIN: 0.0, IOUT: 0.0

### driver-right
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `CAN`: 2个
  - `UART`: 4个
  - `RS232`: 2个
  - `DI`: 12个
  - `AI`: 4个
  - `PI`: 2个
  - `PO`: 2个
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数 (电气/减速比等)**: inputVoltage: 0.0, inputCurrent: 0.0, overloadCapacity: 2.0, VIN: 0.0, VOUT: 0.0, IIN: 0.0, IOUT: 0.0

### driver-lift
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `CAN`: 2个
  - `UART`: 4个
  - `RS232`: 2个
  - `DI`: 12个
  - `AI`: 4个
  - `PI`: 2个
  - `PO`: 2个
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数 (电气/减速比等)**: inputVoltage: 0.0, inputCurrent: 0.0, overloadCapacity: 2.0, VIN: 0.0, VOUT: 0.0, IIN: 0.0, IOUT: 0.0

### motor-left
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `DI`: 2个
  - `PI`: 2个
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数 (电气/减速比等)**: VIN: 0.0, IIN: 0.0, IOUT: 0.0, torque: 0.0, gearRatio: 25.0

### motor-right
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `DI`: 2个
  - `PI`: 2个
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数 (电气/减速比等)**: VIN: 0.0, IIN: 0.0, IOUT: 0.0, torque: 0.0, gearRatio: 25.0

### motor-lift
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `DI`: 2个
  - `PI`: 2个
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数 (电气/减速比等)**: VIN: 0.0, IIN: 0.0, IOUT: 0.0, torque: 0.0, gearRatio: 35.0

### button-emc
- **模块类型**: `button`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `DO`: 2个
  - `PI`: 2个
- **安装位置**: X=700.0, Y=500.0, Z=50.0, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数 (电气/减速比等)**: VIN: 0.0, IIN: 0.0

### up_sensor
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `DO`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数**: 无

### down_sensor
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `DO`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数**: 无

### lamp
- **模块类型**: `light`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `DI`: 6个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数**: 无

### charger
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `DI`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数**: 无

### MainController
- **模块类型**: `mainCPU`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `CAN`: 6个
  - `ETH`: 6个 (IP: FPD)
  - `RS232`: 4个
  - `RS485`: 6个
  - `PI`: 6个
  - `PO`: 16个
- **安装位置**: X=508.0, Y=-181.0, Z=100.0, Yaw=90.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数 (电气/减速比等)**: VIN: 48.0, VOUT: 24.0, IIN: 2000.0, IOUT: 0.0

### gyro
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**: 无接口定义
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数**: 无

### smart camera
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `ETH`: 2个 (IP: 192.168.1.20)
- **安装位置**: X=None, Y=40.0, Z=145.0, Yaw=180.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数**: 无

### smart camera0
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `ETH`: 2个 (IP: 192.168.1.21)
- **安装位置**: X=None, Y=-40.0, Z=100.0, Yaw=180.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数**: 无

### laser-front
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `ETH`: 2个 (IP: 192.168.1.85)
  - `PI`: 2个
- **安装位置**: X=700.0, Y=None, Z=80.0, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数 (电气/减速比等)**: VIN: 0.0, IIN: 0.0

### IO module
- **模块类型**: `extendedlnterface`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `CAN`: 2个
  - `DI`: 16个
  - `DO`: 20个
  - `PI`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis_diff
- **核心参数 (电气/减速比等)**: VIN: 0.0, IIN: 0.0

## 7. 底盘模块专属参数
### 模块: chassis_diff
- **类型**: `chassis`
- **尺寸信息**: {'wheelSpace': 900.0}
- **安装位置**: X=0.0, Y=0.0, Z=0.0, Yaw=None
- **主要运动学与负载参数**: 
  - `maxSpeed(Idle)`: 800.0
  - `maxAcceleration(Idle)`: 500.0
  - `maxDeceleration(Idle)`: 400.0
  - `rotateDiameter`: 1063.0
  - `maxClimbingAngle`: 0.0
  - `totalLoadWeight`: 0.0
  - `selfWeight`: 0.0