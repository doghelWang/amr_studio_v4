# AMR Studio V7.0 - 模型 (ModelSet(3).cmodel) 精密解析报告 (V5)

## 1. 模块清单
- 1. `chassis` (Type: `chassis`)
- 2. `Steerwheel` (Type: `driveWheel`)
- 3. `walk-motor` (Type: `driver`)
- 4. `steer-motor` (Type: `driver`)
- 5. `MainController` (Type: `mainCPU`)
- 6. `gyro` (Type: `sensor`)
- 7. `IO module` (Type: `extendedlnterface`)
- 8. `laser` (Type: `sensor`)
- 9. `kinco steer driver` (Type: `driver`)
- 10. `laser0` (Type: `sensor`)
- 11. `button` (Type: `button`)
- 12. `lift-motor` (Type: `driver`)
- 13. `ZAPI DRIVER` (Type: `driver`)
- 14. `lift_motor_bdc` (Type: `driver`)
- 15. `TofiEncoder` (Type: `sensor`)
- 16. `laser1` (Type: `sensor`)

## 2-6. 模块详细信息 (包含接口与电气连接)

### chassis
- **模块类型**: `chassis`
- **尺寸信息**: 无
- **接口与网络信息**: 无接口定义
- **安装位置**: X=0.0, Y=0.0, Z=0.0, Yaw=None
- **电气/逻辑连接关系**: 无连接/顶级节点
- **核心参数**: 无

### Steerwheel
- **模块类型**: `driveWheel`
- **尺寸信息**: {'wheelRadius': 115.0}
- **接口与网络信息**: 无接口定义
- **安装位置**: X=1090.0, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数 (电气/减速比等)**: gearRatio: 1.0

### walk-motor
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=1100.0, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数 (电气/减速比等)**: IOUT: 999.0, torque: 0.0, gearRatio: 22.07

### steer-motor
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=1100.0, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数 (电气/减速比等)**: IOUT: 999.0, torque: 0.0, gearRatio: 268.72

### MainController
- **模块类型**: `mainCPU`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `CAN`: 6个
  - `ETH`: 6个 (IP: FPD)
  - `RS232`: 4个
  - `RS485`: 6个
  - `DI`: 2个
  - `AI`: 4个
  - `PI`: 6个
  - `PO`: 16个
- **安装位置**: X=None, Y=None, Z=20.0, Yaw=180.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数 (电气/减速比等)**: VIN: 48.0, VOUT: 24.0, IIN: 2000.0, IOUT: 0.0

### gyro
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**: 无接口定义
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数**: 无

### IO module
- **模块类型**: `extendedlnterface`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `CAN`: 2个
  - `DI`: 16个
  - `DO`: 20个
  - `PI`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数 (电气/减速比等)**: VIN: 0.0, IIN: 0.0

### laser
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `ETH`: 2个 (IP: 192.168.1.86)
- **安装位置**: X=1090.0, Y=None, Z=2030.0, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数**: 无

### kinco steer driver
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `CAN`: 2个
  - `PI`: 2个
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数 (电气/减速比等)**: inputVoltage: 24.0, inputCurrent: 0.5, overloadCapacity: 1.5, VIN: 24.0, IIN: 14000.0, IOUT: 0.0

### laser0
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `ETH`: 2个 (IP: 192.168.1.85)
- **安装位置**: X=999.9999, Y=470.0, Z=400.0, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数**: 无

### button
- **模块类型**: `button`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `DO`: 2个
  - `PI`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数 (电气/减速比等)**: VIN: 0.0, IIN: 0.0

### lift-motor
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=1100.0, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数 (电气/减速比等)**: IOUT: 999.0, torque: 0.0, gearRatio: 22.07

### ZAPI DRIVER
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `CAN`: 2个
  - `DO`: 2个
  - `PO`: 2个
  - `LINE`: 4个
  - `ENCR`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数 (电气/减速比等)**: inputVoltage: 24.0, inputCurrent: 0.5, overloadCapacity: 1.5, VOUT: 0.0, IOUT: 0.0

### lift_motor_bdc
- **模块类型**: `driver`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `LINE`: 2个
  - `ENCR`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数 (电气/减速比等)**: IOUT: 0.0, torque: 0.0

### TofiEncoder
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `CAN`: 2个
- **安装位置**: X=None, Y=None, Z=None, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数**: 无

### laser1
- **模块类型**: `sensor`
- **尺寸信息**: 无
- **接口与网络信息**:
  - `ETH`: 2个 (IP: 192.168.1.87)
- **安装位置**: X=999.9999, Y=-430.0, Z=400.0, Yaw=0.0
- **电气/逻辑连接关系**: parentNode: chassis
- **核心参数**: 无

## 7. 底盘模块专属参数
### 模块: chassis
- **类型**: `chassis`
- **安装位置**: X=0.0, Y=0.0, Z=0.0, Yaw=None
- **主要运动学与负载参数**: 
  - `maxSpeed(Idle)`: 2000.0
  - `maxAcceleration(Idle)`: 1000.0
  - `maxDeceleration(Idle)`: 800.0
  - `rotateDiameter`: 3560.0
  - `maxClimbingAngle`: 0.0
  - `totalLoadWeight`: 0.0
  - `selfWeight`: 0.0