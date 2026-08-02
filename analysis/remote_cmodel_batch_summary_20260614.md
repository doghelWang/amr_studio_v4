# Local CModel Remote Import Summary

Date: 2026-06-14

## Overall

- Local `.cmodel` files found: 196
- Unique models by SHA256: 130
- Remote import success: 117
- Remote import failed: 13
- Remote API base: `http://116.62.39.177:8888/api/v1`

## Import Errors

- `proj_12345_packed.cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `proj_12345_packed (1).cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `proj_1234_packed (3).cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `new_proj_cxe9emu_packed.cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `两驱差速对脚.cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `zshy_AMR7.cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `zshy_AMR7(1).cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `zshy_AMR8.cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `test111.cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `test111_repro.cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `空白.cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `0c070e22bf-sop.cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`
- `f18b72ece9-sop_.cmodel`: `HTTPError('500 Server Error: Internal Server Error for url: http://116.62.39.177:8888/api/v1/models/upload')`

## Model Summaries

### 2. proj_990c9e2f_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_990c9e2f_packed.cmodel`
- Remote project: `proj_d38b2ed4`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 3. new_proj_khwcs9e_packed (4).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (4).cmodel`
- Remote project: `proj_4c7e555d`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "unknown": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 4. proj_12345_packed_1.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_12345_packed_1.cmodel`
- Remote project: `proj_fc1fde9b`
- Duplicate path count: 1
- Components: 2 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `None` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 5. proj_500d130d_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_500d130d_packed.cmodel`
- Remote project: `proj_b1829d90`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 6. proj_1234_packed (5).cmodel

- Source: `/Users/wangfeifei/Downloads/proj_1234_packed (5).cmodel`
- Remote project: `proj_b48c21d7`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "UNKNOWN": 11}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `1234` / `通用底盘` / type=`chassis` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO-lnterface board` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `LS-MR-LS-05H-N4017` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `button-Common
` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 7. proj_2c6f8136_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_2c6f8136_packed.cmodel`
- Remote project: `proj_3e8c4011`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 8. proj_38a0e8f7_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_38a0e8f7_packed.cmodel`
- Remote project: `proj_e0ab2a79`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 10. new_proj_khwcs9e_packed (5).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (5).cmodel`
- Remote project: `proj_bf137112`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "unknown": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 11. proj_7f617f18_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_7f617f18_packed.cmodel`
- Remote project: `proj_16a6f619`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 12. proj_1d29c4df_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_1d29c4df_packed.cmodel`
- Remote project: `proj_9c4f4a56`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 13. proj_8b800f1b_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_8b800f1b_packed.cmodel`
- Remote project: `proj_673863ac`
- Duplicate path count: 2
- Components: 44 | Connections: 49 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 10, "sensor": 24, "mainCPU": 1, "extendedlnterface": 2, "light": 1, "unknown": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `Steerwheel_BR` / `Steerwheel_BR` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 545.0, "locCoordY": 640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_BR_left` / `driver_BR_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_BR_left` / `motor_BR_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `driver_BR_right` / `driver_BR_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_BR_right` / `motor_BR_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `BR_Encoder` / `BR_Encoder` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `Steerwheel_FL` / `Steerwheel_FL` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": -545.0, "locCoordY": -640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_FL_right` / `driver_FL_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_FL_right` / `motor_FL_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `driver_FL_left` / `driver_FL_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_FL_left` / `motor_FL_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- ... 32 more components in JSON report

Representative connections:
- `driver_BR_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_left.LINE_1(LINE)` -> `motor_BR_left.LINE_1(LINE)`
- `driver_BR_left.ENCR_1(ENCR)` -> `motor_BR_left.ENCR_1(ENCR)`
- `driver_BR_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_right.LINE_1(LINE)` -> `motor_BR_right.LINE_1(LINE)`
- `driver_BR_right.ENCR_1(ENCR)` -> `motor_BR_right.ENCR_1(ENCR)`
- `BR_Encoder.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `driver_FL_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_right.LINE_1(LINE)` -> `motor_FL_right.LINE_1(LINE)`
- `driver_FL_right.ENCR_1(ENCR)` -> `motor_FL_right.ENCR_1(ENCR)`
- `driver_FL_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_left.LINE_1(LINE)` -> `motor_FL_left.LINE_1(LINE)`
- ... 37 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 14. proj_57fd760b_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_57fd760b_packed.cmodel`
- Remote project: `proj_dfa7c138`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=10
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 15. proj_1234_packed (7).cmodel

- Source: `/Users/wangfeifei/Downloads/proj_1234_packed (7).cmodel`
- Remote project: `proj_ddb7aa40`
- Duplicate path count: 5
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "extendedlnterface": 1, "sensor": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `1234` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `通用卧式舵轮` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `通用卧式舵轮` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `U-BAT-LFP-480024-F1-Aa-C0` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `通用按钮` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 16. proj_c578be69_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_c578be69_packed.cmodel`
- Remote project: `proj_47c5ae79`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 17. new_proj_khwcs9e_packed (7).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (7).cmodel`
- Remote project: `proj_3253975f`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "extendedlnterface": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`extendedlnterface` / sub=`extendedlnterface` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 18. proj_070ce3fc_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_070ce3fc_packed.cmodel`
- Remote project: `proj_2f1b9c29`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 19. proj_12345_packed (3).cmodel

- Source: `/Users/wangfeifei/Downloads/proj_12345_packed (3).cmodel`
- Remote project: `proj_ea218cad`
- Duplicate path count: 2
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "UNKNOWN": 1, "sensor": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `12345` / `通用底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `None` / type=`driveWheel` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `None` / type=`driveWheel` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `None` / type=`mainCPU` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `None` / type=`sensor` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `None` / type=`battery` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `None` / type=`button` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 20. proj_ea4dc53c_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_ea4dc53c_packed.cmodel`
- Remote project: `proj_bb01f4a9`
- Duplicate path count: 2
- Components: 44 | Connections: 49 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 10, "sensor": 24, "mainCPU": 1, "extendedlnterface": 2, "light": 1, "unknown": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `Steerwheel_BR` / `Steerwheel_BR` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 545.0, "locCoordY": 640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_BR_left` / `driver_BR_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_BR_left` / `motor_BR_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `driver_BR_right` / `driver_BR_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_BR_right` / `motor_BR_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `BR_Encoder` / `BR_Encoder` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `Steerwheel_FL` / `Steerwheel_FL` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": -545.0, "locCoordY": -640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_FL_right` / `driver_FL_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_FL_right` / `motor_FL_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `driver_FL_left` / `driver_FL_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_FL_left` / `motor_FL_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- ... 32 more components in JSON report

Representative connections:
- `driver_BR_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_left.LINE_1(LINE)` -> `motor_BR_left.LINE_1(LINE)`
- `driver_BR_left.ENCR_1(ENCR)` -> `motor_BR_left.ENCR_1(ENCR)`
- `driver_BR_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_right.LINE_1(LINE)` -> `motor_BR_right.LINE_1(LINE)`
- `driver_BR_right.ENCR_1(ENCR)` -> `motor_BR_right.ENCR_1(ENCR)`
- `BR_Encoder.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `driver_FL_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_right.LINE_1(LINE)` -> `motor_FL_right.LINE_1(LINE)`
- `driver_FL_right.ENCR_1(ENCR)` -> `motor_FL_right.ENCR_1(ENCR)`
- `driver_FL_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_left.LINE_1(LINE)` -> `motor_FL_left.LINE_1(LINE)`
- ... 37 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 21. new_proj_khwcs9e_packed (6).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (6).cmodel`
- Remote project: `proj_0f0a8833`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "unknown": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 22. proj_12345_packed (2).cmodel

- Source: `/Users/wangfeifei/Downloads/proj_12345_packed (2).cmodel`
- Remote project: `proj_e72171dc`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "UNKNOWN": 1, "sensor": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `12345` / `通用底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `None` / type=`driveWheel` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `None` / type=`driveWheel` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `None` / type=`mainCPU` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `None` / type=`sensor` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `None` / type=`battery` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `None` / type=`button` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 23. new_proj_15kfuy5_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_15kfuy5_packed.cmodel`
- Remote project: `proj_b312d6fd`
- Duplicate path count: 1
- Components: 15 | Connections: 4 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2, "mainCPU": 1, "extendedlnterface": 1, "sensor": 2, "battery": 1, "button": 3}`
- Abilities: component=0, function=2
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`extendedlnterface` / sub=`extendedlnterface` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser_0` / `laser_0` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": -500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `laser_1` / `laser_1` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `battery` / `battery` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- ... 3 more components in JSON report

Representative connections:
- `MCPU-RA-MC-R318BN.CAN_3(CAN)` -> `IO-lnterface board.CAN_1(CAN)`
- `IO-lnterface board.DI_2(DI)` -> `emc.DO_1(DO)`
- `IO-lnterface board.DI_3(DI)` -> `start.DO_1(DO)`
- `IO-lnterface board.DI_4(DI)` -> `reset.DO_1(DO)`

Function nodes:
- None parsed from FuncDesc.

### 24. 1234.cmodel

- Source: `/Users/wangfeifei/Downloads/1234.cmodel`
- Remote project: `proj_0801b2d7`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 25. new_proj_15kfuy5_packed (1).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_15kfuy5_packed (1).cmodel`
- Remote project: `proj_6e3ecc4f`
- Duplicate path count: 3
- Components: 15 | Connections: 4 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2, "mainCPU": 1, "extendedlnterface": 1, "sensor": 2, "battery": 1, "button": 3}`
- Abilities: component=0, function=2
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`extendedlnterface` / sub=`extendedlnterface` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser_0` / `laser_0` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": -500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `laser_1` / `laser_1` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `battery` / `battery` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- ... 3 more components in JSON report

Representative connections:
- `MCPU-RA-MC-R318BN.CAN_3(CAN)` -> `IO-lnterface board.CAN_1(CAN)`
- `IO-lnterface board.DI_2(DI)` -> `emc.DO_1(DO)`
- `IO-lnterface board.DI_3(DI)` -> `start.DO_1(DO)`
- `IO-lnterface board.DI_4(DI)` -> `reset.DO_1(DO)`

Function nodes:
- None parsed from FuncDesc.

### 26. new_proj_2osj9dz_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_2osj9dz_packed.cmodel`
- Remote project: `proj_5cc5e9ea`
- Duplicate path count: 2
- Components: 16 | Connections: 1 | Missing connection targets: 0
- Component type counts: `{"UNKNOWN": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2, "sensor": 4, "battery": 1, "extendedlnterface": 1, "mainCPU": 1, "button": 2}`
- Abilities: component=0, function=3
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `123124` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `DRIVEWHEEL_01` / `DRIVEWHEEL_01` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `DRIVER_01` / `DRIVER_01` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MOTOR_01` / `MOTOR_01` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `SENSOR_01` / `SENSOR_01` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `DRIVEWHEEL_02` / `DRIVEWHEEL_02` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `DRIVER_d6bf` / `DRIVER_d6bf` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MOTOR_a32d` / `MOTOR_a32d` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `SENSOR_5d8d` / `SENSOR_5d8d` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `STEREO-MV-EB435i` / `STEREO-MV-EB435i` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- ... 4 more components in JSON report

Representative connections:
- `IO-lnterface board.CAN_1(CAN)` -> `MCPU-RA-MC-R318BN.CAN_1(CAN)`

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 27. proj_12345_packed_12.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_12345_packed_12.cmodel`
- Remote project: `proj_0a7ac659`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "UNKNOWN": 1, "sensor": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `None` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `None` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `None` / type=`mainCPU` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `None` / type=`sensor` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `None` / type=`battery` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `None` / type=`button` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 28. proj_579b8c68_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_579b8c68_packed.cmodel`
- Remote project: `proj_e66ffdd0`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 29. 测试车模型(1).cmodel

- Source: `/Users/wangfeifei/Downloads/测试车模型(1).cmodel`
- Remote project: `proj_cc72559b`
- Duplicate path count: 4
- Components: 17 | Connections: 15 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 1, "driver": 6, "mainCPU": 1, "sensor": 5, "extendedlnterface": 1, "button": 1, "battery": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=6, nodes=17, fixedRefs=16

Representative components:
- `chassis` / `底盘/单舵轮地盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `Steerwheel` / `驱动轮/ZAPI行走轮` / type=`driveWheel` / sub=`verticalSteerWheel` / mount=`{"locCoordX": 1090.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walk-motor` / `ZAPI行走驱动器` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `steer-motor` / `步科转向电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 20.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 180.0}` / interfaces=32
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `传感/2D激光` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 1090.0, "locCoordY": 0.0, "locCoordZ": 2030.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `kinco steer driver` / `步科转向驱动器` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lift-motor` / `ZAPI行走驱动器` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `ZAPI DRIVER` / `None` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=6
- ... 5 more components in JSON report

Representative connections:
- `walk-motor.LINE_1(LINE)` -> `ZAPI DRIVER.LINE_1(LINE)`
- `steer-motor.LINE_1(LINE)` -> `kinco steer driver.LINE_1(LINE)`
- `steer-motor.ENCR_1(ENCR)` -> `kinco steer driver.ENCR_1(ENCR)`
- `MainController.RS485_1(RS485)` -> `battery.RS485_1(RS485)`
- `MainController.CAN_2(CAN)` -> `kinco steer driver.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `ZAPI DRIVER.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `TofiEncoder.CAN_1(CAN)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_2(ETH)`
- `MainController.ETH_1(ETH)` -> `laser1.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `laser0.ETH_1(ETH)`
- ... 3 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `sensoryRecoAbi`: 感知识别
- `sensoryRecoAbi/codeRec`: 码识别
- `sensoryRecoAbi/ranging`: 测距
- `sensoryRecoAbi/detectAbi`: 检测能力
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- ... 5 more function nodes in JSON report

### 30. proj_1cad053c_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_1cad053c_packed.cmodel`
- Remote project: `proj_7893ef2f`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 31. proj_5f40dd56_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_5f40dd56_packed.cmodel`
- Remote project: `proj_194eead5`
- Duplicate path count: 2
- Components: 18 | Connections: 2 | Missing connection targets: 0
- Component type counts: `{"UNKNOWN": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2, "sensor": 6, "battery": 1, "extendedlnterface": 1, "mainCPU": 1, "button": 2}`
- Abilities: component=0, function=3
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `123124` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `DRIVEWHEEL_01` / `DRIVEWHEEL_01` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `DRIVER_01` / `DRIVER_01` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MOTOR_01` / `MOTOR_01` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `SENSOR_01` / `SENSOR_01` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `SENSOR_dbc9` / `SENSOR_dbc9` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `SENSOR_8632` / `SENSOR_8632` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `DRIVEWHEEL_02` / `DRIVEWHEEL_02` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `DRIVER_d6bf` / `DRIVER_d6bf` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MOTOR_a32d` / `MOTOR_a32d` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `SENSOR_5d8d` / `SENSOR_5d8d` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- ... 6 more components in JSON report

Representative connections:
- `LS-MR-LS-05H-N4017.ETH_1(ETH)` -> `MCPU-RA-MC-R318BN.ETH_1(ETH)`
- `IO-lnterface board.CAN_1(CAN)` -> `MCPU-RA-MC-R318BN.CAN_1(CAN)`

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 32. new_proj_khwcs9e_packed (3).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (3).cmodel`
- Remote project: `proj_57116c3e`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "unknown": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 33. proj_89190f0a_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_89190f0a_packed.cmodel`
- Remote project: `proj_d9a6bc36`
- Duplicate path count: 1
- Components: 20 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"CHASSIS": 1, "DRIVEWHEEL": 2, "DRIVER": 6, "BUTTON": 1, "LIGHT": 1, "SENSOR": 7, "MAINCPU": 1, "EXTENDEDLNTERFACE": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`CHASSIS` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`DRIVEWHEEL` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`DRIVEWHEEL` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`DRIVER` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-right` / `步科` / type=`DRIVER` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-lift` / `步科` / type=`DRIVER` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `motor-left` / `步科电机` / type=`DRIVER` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `motor-right` / `步科电机` / type=`DRIVER` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `motor-lift` / `步科电机` / type=`DRIVER` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`BUTTON` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `lamp` / `通用灯带` / type=`LIGHT` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `charger` / `None` / type=`SENSOR` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- ... 8 more components in JSON report

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 34. proj_17307d02_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_17307d02_packed.cmodel`
- Remote project: `proj_0569bd62`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 35. new_proj_khwcs9e_packed (10).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (10).cmodel`
- Remote project: `proj_1c263c1e`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "extendedlnterface": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`extendedlnterface` / sub=`extendedlnterface` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 36. proj_8397240b_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_8397240b_packed.cmodel`
- Remote project: `proj_9a36064b`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 38. new_proj_khwcs9e_packed (2).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (2).cmodel`
- Remote project: `proj_941a22b8`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "unknown": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 39. proj_1234_packed (11).cmodel

- Source: `/Users/wangfeifei/Downloads/proj_1234_packed (11).cmodel`
- Remote project: `proj_a5c9b4d5`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "extendedlnterface": 1, "sensor": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `12345` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `通用卧式舵轮` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `通用卧式舵轮` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `U-BAT-LFP-480024-F1-Aa-C0` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `通用按钮` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 40. proj_32164c60_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_32164c60_packed.cmodel`
- Remote project: `proj_a5e40608`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 41. new_proj_khwcs9e_packed (11).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (11).cmodel`
- Remote project: `proj_0875db20`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "extendedlnterface": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`extendedlnterface` / sub=`extendedlnterface` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 42. proj_12345_packed (6).cmodel

- Source: `/Users/wangfeifei/Downloads/proj_12345_packed (6).cmodel`
- Remote project: `proj_a3108c8c`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "UNKNOWN": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 4}`
- Abilities: component=2, function=6
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `None` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`None` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `None` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `None` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `None` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `None` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `None` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 43. AOBO.cmodel555.cmodel

- Source: `/Users/wangfeifei/Downloads/AOBO.cmodel555.cmodel`
- Remote project: `proj_2b4abde3`
- Duplicate path count: 2
- Components: 44 | Connections: 49 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driver": 10, "driveWheel": 2, "mainCPU": 1, "sensor": 24, "extendedlnterface": 2, "light": 1, "screen": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=16

Representative components:
- `chassis_steer` / `双舵轮底盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `driver_BR_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_BR_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_FL_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_FL_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `Steerwheel_BR` / `轮子` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": 545.0, "locCoordY": 640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `Steerwheel_FL` / `轮子` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": -545.0, "locCoordY": -640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": -215.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 90.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `IO module0` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `通用激光` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 389.6800000000003, "locCoordY": -596.55, "locCoordZ": 1946.5, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 32 more components in JSON report

Representative connections:
- `driver_BR_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_left.LINE_1(LINE)` -> `motor_BR_left.LINE_1(LINE)`
- `driver_BR_left.ENCR_1(ENCR)` -> `motor_BR_left.ENCR_1(ENCR)`
- `driver_BR_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_right.LINE_1(LINE)` -> `motor_BR_right.LINE_1(LINE)`
- `driver_BR_right.ENCR_1(ENCR)` -> `motor_BR_right.ENCR_1(ENCR)`
- `driver_FL_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_right.LINE_1(LINE)` -> `motor_FL_right.LINE_1(LINE)`
- `driver_FL_right.ENCR_1(ENCR)` -> `motor_FL_right.ENCR_1(ENCR)`
- `driver_FL_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_left.LINE_1(LINE)` -> `motor_FL_left.LINE_1(LINE)`
- `driver_FL_left.ENCR_1(ENCR)` -> `motor_FL_left.ENCR_1(ENCR)`
- ... 37 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 44. proj_4bd913ce_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_4bd913ce_packed.cmodel`
- Remote project: `proj_e6b5b393`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 45. new_proj_khwcs9e_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed.cmodel`
- Remote project: `proj_5c66833b`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "unknown": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=0
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- None parsed from FuncDesc.

### 46. proj_df3aa7ef_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_df3aa7ef_packed.cmodel`
- Remote project: `proj_c26fbf5f`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 47. proj_9bec45be_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_9bec45be_packed.cmodel`
- Remote project: `proj_d4648d5a`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 48. 0323.cmodel

- Source: `/Users/wangfeifei/Downloads/0323.cmodel`
- Remote project: `proj_f2896fda`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 50. proj_89190f0a_packed (1).cmodel

- Source: `/Users/wangfeifei/Downloads/proj_89190f0a_packed (1).cmodel`
- Remote project: `proj_373951e8`
- Duplicate path count: 1
- Components: 20 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"CHASSIS": 1, "DRIVEWHEEL": 2, "DRIVER": 6, "BUTTON": 1, "LIGHT": 1, "SENSOR": 7, "MAINCPU": 1, "EXTENDEDLNTERFACE": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`CHASSIS` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`DRIVEWHEEL` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`DRIVEWHEEL` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`DRIVER` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-right` / `步科` / type=`DRIVER` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-lift` / `步科` / type=`DRIVER` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `motor-left` / `步科电机` / type=`DRIVER` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `motor-right` / `步科电机` / type=`DRIVER` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `motor-lift` / `步科电机` / type=`DRIVER` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`BUTTON` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `lamp` / `通用灯带` / type=`LIGHT` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `charger` / `None` / type=`SENSOR` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- ... 8 more components in JSON report

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 51. proj_f957aada_packed1.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_f957aada_packed1.cmodel`
- Remote project: `proj_3da91a06`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 52. new_proj_khwcs9e_packed (9).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (9).cmodel`
- Remote project: `proj_1643f37b`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "extendedlnterface": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`extendedlnterface` / sub=`extendedlnterface` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 53. proj_ee75f199_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_ee75f199_packed.cmodel`
- Remote project: `proj_44fffbfa`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 54. new_proj_khwcs9e_packed (8).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (8).cmodel`
- Remote project: `proj_696dab70`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "extendedlnterface": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`extendedlnterface` / sub=`extendedlnterface` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 55. proj_016267c0_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_016267c0_packed.cmodel`
- Remote project: `proj_15b9d2f0`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 56. proj_1234_packed (12).cmodel

- Source: `/Users/wangfeifei/Downloads/proj_1234_packed (12).cmodel`
- Remote project: `proj_71a97901`
- Duplicate path count: 1
- Components: 12 | Connections: 4 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "extendedlnterface": 1, "sensor": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `1234` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `通用卧式舵轮` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `通用卧式舵轮` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 400.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `U-BAT-LFP-480024-F1-Aa-C0` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `通用按钮` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1

Representative connections:
- `MCPU-RA-MC-R318BN.CAN_1(CAN)` -> `IO-lnterface board.CAN_1(CAN)`
- `MCPU-RA-MC-R318BN.ETH_1(ETH)` -> `LS-MR-LS-05H-N4017.ETH_1(ETH)`
- `IO-lnterface board.PI_1(PI)` -> `LS-MR-LS-05H-N4017.PI_1(PI)`
- `IO-lnterface board.DI_3(DI)` -> `button-Common.DO_1(DO)`

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 57. new_proj_khwcs9e_packed (1).cmodel

- Source: `/Users/wangfeifei/Downloads/new_proj_khwcs9e_packed (1).cmodel`
- Remote project: `proj_4b583acb`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "unknown": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 58. proj_f957aada_packed.cmodel

- Source: `/Users/wangfeifei/Downloads/proj_f957aada_packed.cmodel`
- Remote project: `proj_7ed4e41a`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 59. proj_8b800f1b_packed.cmodel

- Source: `/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/backend/saved_projects/proj_8b800f1b/proj_8b800f1b_packed.cmodel`
- Remote project: `proj_07978885`
- Duplicate path count: 1
- Components: 44 | Connections: 49 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 10, "sensor": 24, "mainCPU": 1, "extendedlnterface": 2, "light": 1, "unknown": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `Steerwheel_BR` / `Steerwheel_BR` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 545.0, "locCoordY": 640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_BR_left` / `driver_BR_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_BR_left` / `motor_BR_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `driver_BR_right` / `driver_BR_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_BR_right` / `motor_BR_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `BR_Encoder` / `BR_Encoder` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `Steerwheel_FL` / `Steerwheel_FL` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": -545.0, "locCoordY": -640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_FL_right` / `driver_FL_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_FL_right` / `motor_FL_right` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `driver_FL_left` / `driver_FL_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `motor_FL_left` / `motor_FL_left` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- ... 32 more components in JSON report

Representative connections:
- `driver_BR_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_left.LINE_1(LINE)` -> `motor_BR_left.LINE_1(LINE)`
- `driver_BR_left.ENCR_1(ENCR)` -> `motor_BR_left.ENCR_1(ENCR)`
- `driver_BR_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_right.LINE_1(LINE)` -> `motor_BR_right.LINE_1(LINE)`
- `driver_BR_right.ENCR_1(ENCR)` -> `motor_BR_right.ENCR_1(ENCR)`
- `BR_Encoder.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `driver_FL_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_right.LINE_1(LINE)` -> `motor_FL_right.LINE_1(LINE)`
- `driver_FL_right.ENCR_1(ENCR)` -> `motor_FL_right.ENCR_1(ENCR)`
- `driver_FL_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_left.LINE_1(LINE)` -> `motor_FL_left.LINE_1(LINE)`
- ... 37 more connections in JSON report

Function nodes:
- None parsed from FuncDesc.

### 60. proj_edc87f80_packed.cmodel

- Source: `/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/backend/saved_projects/proj_edc87f80/proj_edc87f80_packed.cmodel`
- Remote project: `proj_478156e2`
- Duplicate path count: 2
- Components: 29 | Connections: 33 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "mainCPU": 1, "sensor": 9, "extendedlnterface": 1, "battery": 1, "button": 3, "light": 1, "audio": 1, "screen": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=20

Representative components:
- `01dipan_chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 302.5, "locCoordZ": 82.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -302.5, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_right` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_left` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `driver_right` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `driver_left` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 230.0, "locCoordY": -230.0, "locCoordZ": 120.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 90.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 300.0, "locCoordY": -300.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": -0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `激光雷达,HE3051` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 452.5, "locCoordY": 0.0, "locCoordZ": 280.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 1.5}` / interfaces=2
- `laser0` / `蓝海激光雷达` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -452.5, "locCoordY": 0.0, "locCoordZ": 280.0, "locCoordROLL": 180.0, "locCoordPITCH": 0.0, "locCoordYAW": -171.3}` / interfaces=1
- ... 17 more components in JSON report

Representative connections:
- `motor_right.ENCR_1(ENCR)` -> `driver_right.ENCR_1(ENCR)`
- `motor_right.LINE_1(LINE)` -> `driver_right.LINE_1(LINE)`
- `motor_left.ENCR_1(ENCR)` -> `driver_left.ENCR_1(ENCR)`
- `motor_left.LINE_1(LINE)` -> `driver_left.LINE_1(LINE)`
- `driver_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `MainController.RS485_1(RS485)` -> `battery.RS485_1(RS485)`
- `MainController.CAN_2(CAN)` -> `liftdriver.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `spindriver.CAN_1(CAN)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_2(ETH)`
- ... 21 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 61. 06_final_packed.cmodel

- Source: `/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/backend/saved_projects/new_proj_15kfuy5/debug_artifacts/compile_20260423_130016_115742/06_final_packed.cmodel`
- Remote project: `proj_c2ea8d7c`
- Duplicate path count: 1
- Components: 15 | Connections: 4 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2, "mainCPU": 1, "extendedlnterface": 1, "sensor": 2, "battery": 1, "button": 3}`
- Abilities: component=0, function=2
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`extendedlnterface` / sub=`extendedlnterface` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser_0` / `laser_0` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": -500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `laser_1` / `laser_1` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `battery` / `battery` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- ... 3 more components in JSON report

Representative connections:
- `MCPU-RA-MC-R318BN.CAN_3(CAN)` -> `IO-lnterface board.CAN_1(CAN)`
- `IO-lnterface board.DI_2(DI)` -> `emc.DO_1(DO)`
- `IO-lnterface board.DI_3(DI)` -> `start.DO_1(DO)`
- `IO-lnterface board.DI_4(DI)` -> `reset.DO_1(DO)`

Function nodes:
- None parsed from FuncDesc.

### 62. 06_final_packed.cmodel

- Source: `/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/backend/saved_projects/new_proj_15kfuy5/debug_artifacts/compile_20260423_130047_066281/06_final_packed.cmodel`
- Remote project: `proj_6c473c34`
- Duplicate path count: 1
- Components: 15 | Connections: 4 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2, "mainCPU": 1, "extendedlnterface": 1, "sensor": 2, "battery": 1, "button": 3}`
- Abilities: component=0, function=2
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`extendedlnterface` / sub=`extendedlnterface` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser_0` / `laser_0` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": -500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `laser_1` / `laser_1` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `battery` / `battery` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- ... 3 more components in JSON report

Representative connections:
- `MCPU-RA-MC-R318BN.CAN_3(CAN)` -> `IO-lnterface board.CAN_1(CAN)`
- `IO-lnterface board.DI_2(DI)` -> `emc.DO_1(DO)`
- `IO-lnterface board.DI_3(DI)` -> `start.DO_1(DO)`
- `IO-lnterface board.DI_4(DI)` -> `reset.DO_1(DO)`

Function nodes:
- None parsed from FuncDesc.

### 63. ModelSetError.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/attach/a2bb66211e4900e42a336b860f35050a/2026-03/Rec/4b6d08a2ecfd117c/F/17/ModelSetError.cmodel`
- Remote project: `proj_d0cb8960`
- Duplicate path count: 2
- Components: 33 | Connections: 33 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 12, "sensor": 7, "light": 1, "button": 3, "extendedlnterface": 2, "battery": 2, "screen": 1, "audio": 1, "mainCPU": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=6, nodes=17, fixedRefs=23

Representative components:
- `chassis_steer` / `通用舵轮底盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `Steerwheel_FL` / `None` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": 500.0, "locCoordY": -430.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `Steerwheel_BL` / `None` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": -500.0, "locCoordY": 430.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `driver_FL_L` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_FL_R` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_BR_L` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_BR_R` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `motor_FL_L` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_FL_R` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_BR_L` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_BR_R` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `absEncoder_FL-2` / `H8编码器` / type=`sensor` / sub=`absoluteValueEncode` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 21 more components in JSON report

Representative connections:
- `driver_FL_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_L.LINE_1(LINE)` -> `motor_FL_L.LINE_1(LINE)`
- `driver_FL_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_R.LINE_1(LINE)` -> `motor_FL_R.LINE_1(LINE)`
- `driver_BR_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_L.LINE_1(LINE)` -> `motor_BR_L.LINE_1(LINE)`
- `driver_BR_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_R.LINE_1(LINE)` -> `motor_BR_R.LINE_1(LINE)`
- `absEncoder_FL-2.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `absEncoder_BL-1.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `lamp.DI_1(DI)` -> `IO module110.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module110.DO_2(DO)`
- ... 21 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `sensoryRecoAbi`: 感知识别
- `sensoryRecoAbi/codeRec`: 码识别
- `sensoryRecoAbi/ranging`: 测距
- `sensoryRecoAbi/detectAbi`: 检测能力
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- ... 5 more function nodes in JSON report

### 64. ModelSet---ok(1).cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-05/ModelSet---ok(1).cmodel`
- Remote project: `proj_85050f26`
- Duplicate path count: 1
- Components: 41 | Connections: 42 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "intergratedController": 2, "sensor": 11, "battery": 1, "screen": 1, "audio": 1, "button": 5, "light": 4, "energyController": 1, "actor": 2, "autobody": 1, "mainCPU": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=84

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 386.5, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -386.5, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_L` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_R` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `servo_driver_L` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `servo_driver_R` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `slaveController-front` / `None` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -300.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `safety_slaveController` / `R-四代-安全控制器-NS.02.R-A1	
` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=32
- `laser-Front` / `None` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 506.0, "locCoordY": 0.0, "locCoordZ": 192.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=1
- `battery` / `通用电池` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": -300.0, "locCoordY": 0.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `screen` / `通用显示屏` / type=`screen` / sub=`subScreen` / mount=`{"locCoordX": -500.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 29 more components in JSON report

Representative connections:
- `motor_L.ENCR_1(ENCR)` -> `servo_driver_L.ENCR_1(ENCR)`
- `motor_L.LINE_1(LINE)` -> `servo_driver_L.LINE_1(LINE)`
- `motor_R.ENCR_1(ENCR)` -> `servo_driver_R.ENCR_1(ENCR)`
- `motor_R.LINE_1(LINE)` -> `servo_driver_R.LINE_1(LINE)`
- `servo_driver_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `slaveController-front.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController-front.BAR_1(BAR)` -> `collision-front.BAR_1(BAR)`
- `slaveController-front.BAR_2(BAR)` -> `collision-front_0.BAR_1(BAR)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp-start.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp-mode.DI_1(DI)`
- ... 30 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 65. ModelSet0511.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-05/ModelSet0511.cmodel`
- Remote project: `proj_50266737`
- Duplicate path count: 1
- Components: 41 | Connections: 42 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "intergratedController": 2, "sensor": 11, "battery": 1, "screen": 1, "audio": 1, "button": 5, "light": 4, "energyController": 1, "actor": 2, "autobody": 1, "mainCPU": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=84

Representative components:
- `chassis_diff` / `广东文灿Q7改` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 410.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -410.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_L` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_R` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `servo_driver_L` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `servo_driver_R` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `slaveController-front` / `None` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -300.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `safety_slaveController` / `R-四代-安全控制器-NS.02.R-A1	
` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=32
- `laser-Front` / `None` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 506.0, "locCoordY": 0.0, "locCoordZ": 192.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=1
- `battery` / `通用电池` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": -300.0, "locCoordY": 0.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `screen` / `通用显示屏` / type=`screen` / sub=`subScreen` / mount=`{"locCoordX": -500.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 29 more components in JSON report

Representative connections:
- `motor_L.ENCR_1(ENCR)` -> `servo_driver_L.ENCR_1(ENCR)`
- `motor_L.LINE_1(LINE)` -> `servo_driver_L.LINE_1(LINE)`
- `motor_R.ENCR_1(ENCR)` -> `servo_driver_R.ENCR_1(ENCR)`
- `motor_R.LINE_1(LINE)` -> `servo_driver_R.LINE_1(LINE)`
- `servo_driver_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `slaveController-front.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController-front.BAR_1(BAR)` -> `collision-front.BAR_1(BAR)`
- `slaveController-front.BAR_2(BAR)` -> `collision-front_0.BAR_1(BAR)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp-start.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp-mode.DI_1(DI)`
- ... 30 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 66. 磁吸车组态建模.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-05/磁吸车组态建模.cmodel`
- Remote project: `proj_38c117d0`
- Duplicate path count: 1
- Components: 23 | Connections: 24 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "sensor": 7, "extendedlnterface": 1, "battery": 1, "button": 3, "light": 1, "audio": 1, "screen": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=20

Representative components:
- `01dipan_chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 278.25, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -278.25, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_right` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_left` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `driver_right` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `driver_left` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 136.5, "locCoordY": 0.0, "locCoordZ": 120.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 180.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser-front` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 383.0, "locCoordY": 0.0, "locCoordZ": 210.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `laser-back` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -420.0, "locCoordY": 0.0, "locCoordZ": 280.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 11 more components in JSON report

Representative connections:
- `motor_right.ENCR_1(ENCR)` -> `driver_right.ENCR_1(ENCR)`
- `motor_right.LINE_1(LINE)` -> `driver_right.LINE_1(LINE)`
- `motor_left.ENCR_1(ENCR)` -> `driver_left.ENCR_1(ENCR)`
- `motor_left.LINE_1(LINE)` -> `driver_left.LINE_1(LINE)`
- `driver_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `MainController.RS485_1(RS485)` -> `battery.RS485_1(RS485)`
- `MainController.RS485_2(RS485)` -> `screen.RS485_1(RS485)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_2(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_3(ETH)`
- ... 12 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 67. 5.12_src.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-05/5.12_src.cmodel`
- Remote project: `proj_30fc75fe`
- Duplicate path count: 1
- Components: 35 | Connections: 40 | Missing connection targets: 2
- Component type counts: `{"chassis": 1, "mainCPU": 1, "sensor": 13, "button": 8, "driver": 4, "extendedlnterface": 2, "light": 2, "screen": 1, "battery": 2, "driveWheel": 1}`
- Abilities: component=1, function=5
- Function description: topLevel=5, nodes=15, fixedRefs=17

Representative components:
- `chassis_helm` / `None` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 1111.0, "locCoordY": 220.0, "locCoordZ": 60.0, "locCoordROLL": null, "locCoordPITCH": 90.0, "locCoordYAW": 90.0}` / interfaces=32
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 1111.0, "locCoordY": 220.0, "locCoordZ": 60.0, "locCoordROLL": null, "locCoordPITCH": 90.0, "locCoordYAW": 90.0}` / interfaces=0
- `button` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 788.0, "locCoordY": 300.0, "locCoordZ": 950.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=2
- `driver_servo` / `RA-DR/D-48/14SA-311AH1-C` / type=`driver` / sub=`servo` / mount=`{"locCoordX": 1089.0, "locCoordY": 0.0, "locCoordZ": 55.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=16
- `turn_servo` / `RA-DR/D-48/14SA-311AH1-C` / type=`driver` / sub=`servo` / mount=`{"locCoordX": 1089.0, "locCoordY": 0.0, "locCoordZ": 55.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=16
- `IO module0` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 900.0, "locCoordY": 200.0, "locCoordZ": 200.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=20
- `driver-motor` / `None` / type=`driver` / sub=`motor` / mount=`{"locCoordX": 1089.0, "locCoordY": 0.0, "locCoordZ": 55.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=3
- `turn-motor` / `None` / type=`driver` / sub=`motor` / mount=`{"locCoordX": 1089.0, "locCoordY": 0.0, "locCoordZ": 55.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=3
- `IO module1` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 900.0, "locCoordY": 200.0, "locCoordZ": 300.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=20
- `left_cargo_di` / `货检激光E3Z-D81  欧姆龙` / type=`sensor` / sub=`PT` / mount=`{"locCoordX": 700.0, "locCoordY": 300.0, "locCoordZ": 300.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=1
- `right_cargo_di` / `货检激光E3Z-D81  欧姆龙` / type=`sensor` / sub=`PT` / mount=`{"locCoordX": 700.0, "locCoordY": -300.0, "locCoordZ": 300.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=1
- ... 23 more components in JSON report

Representative connections:
- `MainController.RS485_0(RS485)` -> `battery.RS485_0(RS485)`
- `MainController.CAN_2(CAN)` -> `driver_servo.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `turn_servo.CAN_1(CAN)`
- `MainController.CAN_3(CAN)` -> `IO module0.CAN_1(CAN)`
- `MainController.CAN_3(CAN)` -> `IO module1.CAN_1(CAN)`
- `MainController.ETH_0(ETH)` -> `mid360dh.ETH_0(ETH)`
- `MainController.ETH_0(ETH)` -> `laserZQBZ.ETH_0(ETH)`
- `MainController.ETH_1(ETH)` -> `screen.ETH_0(ETH)`
- `MainController.ETH_2(ETH)` -> `laserYQBZ.ETH_0(ETH)`
- `button.DO_0(DO)` -> `IO module0.DI_0(DI)`
- `driver_servo.LINE_0(LINE)` -> `driver-motor.LINE_0(LINE)`
- `driver_servo.ENCR_0(ENCR)` -> `driver-motor.ENCR_0(ENCR)`
- ... 28 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `sensoryRecoAbi`: 感知识别
- `sensoryRecoAbi/codeRec`: 码识别
- `sensoryRecoAbi/ranging`: 测距
- `sensoryRecoAbi/detectAbi`: 检测能力
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- ... 3 more function nodes in JSON report

### 68. ModelSet-lift-ok.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-05/ModelSet-lift-ok.cmodel`
- Remote project: `proj_b9f7d1d0`
- Duplicate path count: 1
- Components: 41 | Connections: 42 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "intergratedController": 2, "sensor": 11, "battery": 1, "screen": 1, "audio": 1, "button": 5, "light": 4, "energyController": 1, "actor": 2, "autobody": 1, "mainCPU": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=84

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 386.5, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -386.5, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_L` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_R` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `servo_driver_L` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `servo_driver_R` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `slaveController-front` / `None` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -300.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `safety_slaveController` / `R-四代-安全控制器-NS.02.R-A1	
` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=32
- `laser-Front` / `None` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 506.0, "locCoordY": 0.0, "locCoordZ": 192.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=1
- `battery` / `通用电池` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": -300.0, "locCoordY": 0.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `screen` / `通用显示屏` / type=`screen` / sub=`subScreen` / mount=`{"locCoordX": -500.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 29 more components in JSON report

Representative connections:
- `motor_L.ENCR_1(ENCR)` -> `servo_driver_L.ENCR_1(ENCR)`
- `motor_L.LINE_1(LINE)` -> `servo_driver_L.LINE_1(LINE)`
- `motor_R.ENCR_1(ENCR)` -> `servo_driver_R.ENCR_1(ENCR)`
- `motor_R.LINE_1(LINE)` -> `servo_driver_R.LINE_1(LINE)`
- `servo_driver_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `slaveController-front.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController-front.BAR_1(BAR)` -> `collision-front.BAR_1(BAR)`
- `slaveController-front.BAR_2(BAR)` -> `collision-front_0.BAR_1(BAR)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp-start.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp-mode.DI_1(DI)`
- ... 30 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 69. 校验模型.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-05/校验模型.cmodel`
- Remote project: `proj_9bbc7fb3`
- Duplicate path count: 1
- Components: 22 | Connections: 24 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "sensor": 6, "extendedlnterface": 1, "battery": 1, "button": 4, "light": 1, "audio": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=18

Representative components:
- `01dipan_chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 278.25, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -278.25, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_right` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_left` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `driver_right` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `driver_left` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 136.5, "locCoordY": 0.0, "locCoordZ": 120.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 180.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser-front` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 383.0, "locCoordY": 0.0, "locCoordZ": 210.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `laser-back` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -420.0, "locCoordY": 0.0, "locCoordZ": 280.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 180.0}` / interfaces=1
- ... 10 more components in JSON report

Representative connections:
- `motor_right.ENCR_1(ENCR)` -> `driver_right.ENCR_1(ENCR)`
- `motor_right.LINE_1(LINE)` -> `driver_right.LINE_1(LINE)`
- `motor_left.ENCR_1(ENCR)` -> `driver_left.ENCR_1(ENCR)`
- `motor_left.LINE_1(LINE)` -> `driver_left.LINE_1(LINE)`
- `driver_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `MainController.RS485_1(RS485)` -> `battery.RS485_1(RS485)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_2(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_3(ETH)`
- `MainController.ETH_1(ETH)` -> `laser-front.ETH_1(ETH)`
- ... 12 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 70. ModelSet---ok.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-05/ModelSet---ok.cmodel`
- Remote project: `proj_6ef49fdc`
- Duplicate path count: 1
- Components: 41 | Connections: 42 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "intergratedController": 2, "sensor": 11, "battery": 1, "screen": 1, "audio": 1, "button": 5, "light": 4, "energyController": 1, "actor": 2, "autobody": 1, "mainCPU": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=84

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 386.5, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -386.5, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_L` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_R` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `servo_driver_L` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `servo_driver_R` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `slaveController-front` / `None` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -300.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `safety_slaveController` / `R-四代-安全控制器-NS.02.R-A1	
` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=32
- `laser-Front` / `None` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 506.0, "locCoordY": 0.0, "locCoordZ": 192.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=1
- `battery` / `通用电池` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": -300.0, "locCoordY": 0.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `screen` / `通用显示屏` / type=`screen` / sub=`subScreen` / mount=`{"locCoordX": -500.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 29 more components in JSON report

Representative connections:
- `motor_L.ENCR_1(ENCR)` -> `servo_driver_L.ENCR_1(ENCR)`
- `motor_L.LINE_1(LINE)` -> `servo_driver_L.LINE_1(LINE)`
- `motor_R.ENCR_1(ENCR)` -> `servo_driver_R.ENCR_1(ENCR)`
- `motor_R.LINE_1(LINE)` -> `servo_driver_R.LINE_1(LINE)`
- `servo_driver_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `slaveController-front.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController-front.BAR_1(BAR)` -> `collision-front.BAR_1(BAR)`
- `slaveController-front.BAR_2(BAR)` -> `collision-front_0.BAR_1(BAR)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp-start.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp-mode.DI_1(DI)`
- ... 30 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 72. 5_11_ModelSet.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-05/5_11_ModelSet.cmodel`
- Remote project: `proj_c4a3c4a7`
- Duplicate path count: 1
- Components: 41 | Connections: 42 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "intergratedController": 2, "sensor": 11, "battery": 1, "screen": 1, "audio": 1, "button": 5, "light": 4, "energyController": 1, "actor": 2, "autobody": 1, "mainCPU": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=84

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 386.5, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -386.5, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_L` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_R` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `servo_driver_L` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `servo_driver_R` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `slaveController-front` / `None` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -300.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `safety_slaveController` / `R-四代-安全控制器-NS.02.R-A1	
` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=32
- `laser-Front` / `None` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 506.0, "locCoordY": 0.0, "locCoordZ": 192.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=1
- `battery` / `通用电池` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": -300.0, "locCoordY": 0.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `screen` / `通用显示屏` / type=`screen` / sub=`subScreen` / mount=`{"locCoordX": -500.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 29 more components in JSON report

Representative connections:
- `motor_L.ENCR_1(ENCR)` -> `servo_driver_L.ENCR_1(ENCR)`
- `motor_L.LINE_1(LINE)` -> `servo_driver_L.LINE_1(LINE)`
- `motor_R.ENCR_1(ENCR)` -> `servo_driver_R.ENCR_1(ENCR)`
- `motor_R.LINE_1(LINE)` -> `servo_driver_R.LINE_1(LINE)`
- `servo_driver_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `slaveController-front.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController-front.BAR_1(BAR)` -> `collision-front.BAR_1(BAR)`
- `slaveController-front.BAR_2(BAR)` -> `collision-front_0.BAR_1(BAR)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp-start.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp-mode.DI_1(DI)`
- ... 30 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 73. ModelSet1.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-05/ModelSet1.cmodel`
- Remote project: `proj_50384670`
- Duplicate path count: 1
- Components: 25 | Connections: 27 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "sensor": 8, "extendedlnterface": 1, "button": 4, "audio": 1, "battery": 2, "light": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=19

Representative components:
- `01dipan_chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 278.25, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -278.25, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_right` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_left` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `driver_right` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `driver_left` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 136.5, "locCoordY": 0.0, "locCoordZ": 120.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 180.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser-back` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -420.0, "locCoordY": 0.0, "locCoordZ": 280.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 180.0}` / interfaces=1
- `collision_F` / `防撞条` / type=`sensor` / sub=`collisionPize` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 13 more components in JSON report

Representative connections:
- `motor_right.ENCR_1(ENCR)` -> `driver_right.ENCR_1(ENCR)`
- `motor_right.LINE_1(LINE)` -> `driver_right.LINE_1(LINE)`
- `motor_left.ENCR_1(ENCR)` -> `driver_left.ENCR_1(ENCR)`
- `motor_left.LINE_1(LINE)` -> `driver_left.LINE_1(LINE)`
- `driver_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `MainController.RS485_2(RS485)` -> `battery.RS485_1(RS485)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_2(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_3(ETH)`
- `MainController.ETH_1(ETH)` -> `laser-back.ETH_1(ETH)`
- ... 15 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 74. ModelSet3.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2025-12/ModelSet3.cmodel`
- Remote project: `proj_8d7c0a2a`
- Duplicate path count: 1
- Components: 12 | Connections: 10 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 1, "driver": 4, "mainCPU": 1, "sensor": 3, "extendedlnterface": 1, "button": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=6, nodes=17, fixedRefs=13

Representative components:
- `chassis` / `底盘/单舵轮地盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `Steerwheel` / `驱动轮/ZAPI行走轮` / type=`driveWheel` / sub=`verticalSteerWheel` / mount=`{"locCoordX": 1090.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walk-motor` / `ZAPI行走驱动器` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": -0.0, "locCoordYAW": 0.0}` / interfaces=2
- `steer-motor` / `步科转向电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": -0.0, "locCoordYAW": 0.0}` / interfaces=2
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 20.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 180.0}` / interfaces=32
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `传感/2D激光` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 1090.0, "locCoordY": 0.0, "locCoordZ": 2030.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `zapi walk driver` / `None` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=5
- `kinco steer driver` / `步科转向驱动器` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `laser0` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 1300.0, "locCoordY": 500.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 45.0}` / interfaces=1
- `button` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 1000.0, "locCoordY": 500.0, "locCoordZ": 1000.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2

Representative connections:
- `walk-motor.LINE_1(LINE)` -> `zapi walk driver.LINE_1(LINE)`
- `walk-motor.ENCR_1(ENCR)` -> `zapi walk driver.ENCR_1(ENCR)`
- `steer-motor.LINE_1(LINE)` -> `kinco steer driver.LINE_1(LINE)`
- `steer-motor.ENCR_1(ENCR)` -> `kinco steer driver.ENCR_1(ENCR)`
- `MainController.CAN_2(CAN)` -> `zapi walk driver.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `kinco steer driver.CAN_1(CAN)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_3(ETH)` -> `laser.ETH_1(ETH)`
- `MainController.ETH_3(ETH)` -> `laser0.ETH_1(ETH)`
- `IO module.DI_1(DI)` -> `button.DO_1(DO)`

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `sensoryRecoAbi`: 感知识别
- `sensoryRecoAbi/codeRec`: 码识别
- `sensoryRecoAbi/ranging`: 测距
- `sensoryRecoAbi/detectAbi`: 检测能力
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- ... 5 more function nodes in JSON report

### 75. Q7MZD.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/Q7MZD.cmodel`
- Remote project: `proj_272fe7a9`
- Duplicate path count: 1
- Components: 39 | Connections: 39 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "intergratedController": 2, "sensor": 9, "battery": 1, "screen": 1, "audio": 1, "button": 5, "light": 4, "energyController": 1, "actor": 2, "autobody": 1, "mainCPU": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 386.5, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -386.5, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_L` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_R` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `servo_driver_L` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `servo_driver_R` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `slaveController-front` / `None` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -300.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `safety_slaveController` / `R-四代-安全控制器-NS.02.R-A1	
` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=32
- `laser-Front` / `None` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 506.0, "locCoordY": 0.0, "locCoordZ": 192.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=1
- `battery` / `通用电池` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": -300.0, "locCoordY": 0.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `screen` / `通用显示屏` / type=`screen` / sub=`subScreen` / mount=`{"locCoordX": -500.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 27 more components in JSON report

Representative connections:
- `motor_L.ENCR_1(ENCR)` -> `servo_driver_L.ENCR_1(ENCR)`
- `motor_L.LINE_1(LINE)` -> `servo_driver_L.LINE_1(LINE)`
- `motor_R.ENCR_1(ENCR)` -> `servo_driver_R.ENCR_1(ENCR)`
- `motor_R.LINE_1(LINE)` -> `servo_driver_R.LINE_1(LINE)`
- `servo_driver_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `slaveController-front.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController-front.PZTB_1(PZTB)` -> `collision-front.PZTB_1(PZTB)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp-start.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp-mode.DI_1(DI)`
- `safety_slaveController.DO_3(DO)` -> `lamp-left.DI_2(DI)`
- ... 27 more connections in JSON report

Function nodes:
- None parsed from FuncDesc.

### 76. 7米四舵轮_260418.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/7米四舵轮_260418.cmodel`
- Remote project: `proj_35a0b82a`
- Duplicate path count: 1
- Components: 48 | Connections: 54 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 4, "driver": 12, "mainCPU": 1, "sensor": 12, "extendedlnterface": 2, "button": 10, "battery": 2, "screen": 1, "audio": 1, "light": 2}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=13

Representative components:
- `chassis_steer` / `None` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `wheel-front-right` / `steering_wheel_Steerwheel ` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 2175.0, "locCoordY": -766.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `wheel-back-left` / `steering_wheel_Steerwheel ` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": -2175.0, "locCoordY": 766.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `turn_driver_front_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `walk_driver_wheel_front_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_driver_wheel_front_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `walk_driver_wheel_back_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_driver_wheel_back_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_driver_back_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_motor_front_left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `walk_motor_wheel_front_right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `turn_motor_wheel_front_right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- ... 36 more components in JSON report

Representative connections:
- `turn_driver_front_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `turn_driver_front_left.LINE_1(LINE)` -> `turn_motor_front_left.LINE_1(LINE)`
- `turn_driver_front_left.ENCR_1(ENCR)` -> `turn_motor_front_left.ENCR_1(ENCR)`
- `walk_driver_wheel_front_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `walk_driver_wheel_front_right.LINE_1(LINE)` -> `walk_motor_wheel_front_right.LINE_1(LINE)`
- `walk_driver_wheel_front_right.ENCR_1(ENCR)` -> `walk_motor_wheel_front_right.ENCR_1(ENCR)`
- `turn_driver_wheel_front_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `turn_driver_wheel_front_right.LINE_1(LINE)` -> `turn_motor_wheel_front_right.LINE_1(LINE)`
- `turn_driver_wheel_front_right.ENCR_1(ENCR)` -> `turn_motor_wheel_front_right.ENCR_1(ENCR)`
- `walk_driver_wheel_back_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `walk_driver_wheel_back_left.LINE_1(LINE)` -> `walk_motor_wheel_back_left.LINE_1(LINE)`
- `walk_driver_wheel_back_left.ENCR_1(ENCR)` -> `walk_motor_wheel_back_left.ENCR_1(ENCR)`
- ... 42 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 77. proj_robot01_mocmdhzf_packed (4).cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/proj_robot01_mocmdhzf_packed (4).cmodel`
- Remote project: `proj_52c7da75`
- Duplicate path count: 1
- Components: 15 | Connections: 4 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "extendedlnterface": 1, "sensor": 2, "battery": 1, "button": 3}`
- Abilities: component=0, function=2
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 500.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -500.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser_0` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `laser_1` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `battery` / `U-BAT-LFP-480024-F1-Aa-C0` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- ... 3 more components in JSON report

Representative connections:
- `MCPU-RA-MC-R318BN.CAN_3(CAN)` -> `IO-lnterface board.CAN_1(CAN)`
- `IO-lnterface board.DI_2(DI)` -> `emc.DO_1(DO)`
- `IO-lnterface board.DI_3(DI)` -> `start.DO_1(DO)`
- `IO-lnterface board.DI_4(DI)` -> `reset.DO_1(DO)`

Function nodes:
- None parsed from FuncDesc.

### 78. AoBo1.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/AoBo1.cmodel`
- Remote project: `proj_f6585928`
- Duplicate path count: 1
- Components: 46 | Connections: 51 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driver": 10, "driveWheel": 2, "mainCPU": 1, "sensor": 25, "extendedlnterface": 2, "light": 1, "button": 1, "screen": 1, "audio": 1, "battery": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=22

Representative components:
- `chassis_steer` / `双舵轮底盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `driver_BR_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_BR_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_FL_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_FL_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `Steerwheel_BR` / `轮子` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": 545.0, "locCoordY": 640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `Steerwheel_FL` / `轮子` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": -545.0, "locCoordY": -640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": -215.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 90.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `IO module0` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `通用激光` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 389.6800000000003, "locCoordY": -596.55, "locCoordZ": 1946.5, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 34 more components in JSON report

Representative connections:
- `driver_BR_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_left.LINE_1(LINE)` -> `motor_BR_left.LINE_1(LINE)`
- `driver_BR_left.ENCR_1(ENCR)` -> `motor_BR_left.ENCR_1(ENCR)`
- `driver_BR_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_right.LINE_1(LINE)` -> `motor_BR_right.LINE_1(LINE)`
- `driver_BR_right.ENCR_1(ENCR)` -> `motor_BR_right.ENCR_1(ENCR)`
- `driver_FL_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_right.LINE_1(LINE)` -> `motor_FL_right.LINE_1(LINE)`
- `driver_FL_right.ENCR_1(ENCR)` -> `motor_FL_right.ENCR_1(ENCR)`
- `driver_FL_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_left.LINE_1(LINE)` -> `motor_FL_left.LINE_1(LINE)`
- `driver_FL_left.ENCR_1(ENCR)` -> `motor_FL_left.ENCR_1(ENCR)`
- ... 39 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 80. AoBo3.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/AoBo3.cmodel`
- Remote project: `proj_f446a19c`
- Duplicate path count: 1
- Components: 47 | Connections: 52 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driver": 10, "driveWheel": 2, "mainCPU": 1, "sensor": 26, "extendedlnterface": 2, "light": 1, "button": 1, "screen": 1, "audio": 1, "battery": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=21

Representative components:
- `chassis_steer` / `双舵轮底盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `driver_BR_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_BR_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_FL_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_FL_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `Steerwheel_BR` / `轮子` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": 545.0, "locCoordY": 640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `Steerwheel_FL` / `轮子` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": -545.0, "locCoordY": -640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": -215.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `IO module0` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `通用激光` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 389.6800000000003, "locCoordY": -596.55, "locCoordZ": 2495.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 35 more components in JSON report

Representative connections:
- `driver_BR_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_left.LINE_1(LINE)` -> `motor_BR_left.LINE_1(LINE)`
- `driver_BR_left.ENCR_1(ENCR)` -> `motor_BR_left.ENCR_1(ENCR)`
- `driver_BR_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_right.LINE_1(LINE)` -> `motor_BR_right.LINE_1(LINE)`
- `driver_BR_right.ENCR_1(ENCR)` -> `motor_BR_right.ENCR_1(ENCR)`
- `driver_FL_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_right.LINE_1(LINE)` -> `motor_FL_right.LINE_1(LINE)`
- `driver_FL_right.ENCR_1(ENCR)` -> `motor_FL_right.ENCR_1(ENCR)`
- `driver_FL_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_left.LINE_1(LINE)` -> `motor_FL_left.LINE_1(LINE)`
- `driver_FL_left.ENCR_1(ENCR)` -> `motor_FL_left.ENCR_1(ENCR)`
- ... 40 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 81. BackupTemp.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/BackupTemp.cmodel`
- Remote project: `proj_bdc08b3d`
- Duplicate path count: 1
- Components: 48 | Connections: 54 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 4, "driver": 12, "mainCPU": 1, "sensor": 12, "extendedlnterface": 2, "button": 10, "battery": 2, "screen": 1, "audio": 1, "light": 2}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=13

Representative components:
- `chassis_steer` / `None` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `wheel-front-right` / `steering_wheel_Steerwheel ` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 2175.0, "locCoordY": -766.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `wheel-back-left` / `steering_wheel_Steerwheel ` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": -2175.0, "locCoordY": 766.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `turn_driver_front_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `walk_driver_wheel_front_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_driver_wheel_front_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `walk_driver_wheel_back_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_driver_wheel_back_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_driver_back_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_motor_front_left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `walk_motor_wheel_front_right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `turn_motor_wheel_front_right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- ... 36 more components in JSON report

Representative connections:
- `turn_driver_front_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `turn_driver_front_left.LINE_1(LINE)` -> `turn_motor_front_left.LINE_1(LINE)`
- `turn_driver_front_left.ENCR_1(ENCR)` -> `turn_motor_front_left.ENCR_1(ENCR)`
- `walk_driver_wheel_front_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `walk_driver_wheel_front_right.LINE_1(LINE)` -> `walk_motor_wheel_front_right.LINE_1(LINE)`
- `walk_driver_wheel_front_right.ENCR_1(ENCR)` -> `walk_motor_wheel_front_right.ENCR_1(ENCR)`
- `turn_driver_wheel_front_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `turn_driver_wheel_front_right.LINE_1(LINE)` -> `turn_motor_wheel_front_right.LINE_1(LINE)`
- `turn_driver_wheel_front_right.ENCR_1(ENCR)` -> `turn_motor_wheel_front_right.ENCR_1(ENCR)`
- `walk_driver_wheel_back_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `walk_driver_wheel_back_left.LINE_1(LINE)` -> `walk_motor_wheel_back_left.LINE_1(LINE)`
- `walk_driver_wheel_back_left.ENCR_1(ENCR)` -> `walk_motor_wheel_back_left.ENCR_1(ENCR)`
- ... 42 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 82. zshy_AMR20260430.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/zshy_AMR20260430.cmodel`
- Remote project: `proj_50f298eb`
- Duplicate path count: 2
- Components: 22 | Connections: 24 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "sensor": 6, "extendedlnterface": 1, "battery": 1, "button": 3, "light": 1, "audio": 1, "screen": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=20

Representative components:
- `01dipan_chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 298.25, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -298.25, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_right` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_left` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `driver_right` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `driver_left` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 136.5, "locCoordY": 0.0, "locCoordZ": 120.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 180.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `smart camera` / `None` / type=`sensor` / sub=`codeReader` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `laser` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 452.5, "locCoordY": -275.0, "locCoordZ": 280.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": -38.0}` / interfaces=1
- ... 10 more components in JSON report

Representative connections:
- `motor_right.ENCR_1(ENCR)` -> `driver_right.ENCR_1(ENCR)`
- `motor_right.LINE_1(LINE)` -> `driver_right.LINE_1(LINE)`
- `motor_left.ENCR_1(ENCR)` -> `driver_left.ENCR_1(ENCR)`
- `motor_left.LINE_1(LINE)` -> `driver_left.LINE_1(LINE)`
- `driver_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `MainController.RS485_1(RS485)` -> `battery.RS485_1(RS485)`
- `MainController.RS485_2(RS485)` -> `screen.RS485_1(RS485)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_2(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_3(ETH)`
- ... 12 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 84. proj_robot01_mocmdhzf_packed.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/proj_robot01_mocmdhzf_packed.cmodel`
- Remote project: `proj_7bcdf420`
- Duplicate path count: 1
- Components: 15 | Connections: 4 | Missing connection targets: 0
- Component type counts: `{"UNKNOWN": 1, "driveWheel": 2, "driver": 2, "motor": 2, "mainCPU": 1, "extendedlnterface": 1, "sensor": 2, "battery": 1, "button": 3}`
- Abilities: component=0, function=2
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `robot01` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -500.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`motor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 500.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`motor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser_0` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `laser_1` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `battery` / `U-BAT-LFP-480024-F1-Aa-C0` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- ... 3 more components in JSON report

Representative connections:
- `MCPU-RA-MC-R318BN.CAN_3(CAN)` -> `IO-lnterface board.CAN_1(CAN)`
- `IO-lnterface board.DI_2(DI)` -> `emc.DO_1(DO)`
- `IO-lnterface board.DI_3(DI)` -> `start.DO_1(DO)`
- `IO-lnterface board.DI_4(DI)` -> `reset.DO_1(DO)`

Function nodes:
- None parsed from FuncDesc.

### 85. proj_robot01_mocmdhzf_packed (3).cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/proj_robot01_mocmdhzf_packed (3).cmodel`
- Remote project: `proj_58b4e04a`
- Duplicate path count: 1
- Components: 15 | Connections: 4 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "extendedlnterface": 1, "sensor": 2, "battery": 1, "button": 3}`
- Abilities: component=0, function=2
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 500.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -500.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser_0` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `laser_1` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `battery` / `U-BAT-LFP-480024-F1-Aa-C0` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- ... 3 more components in JSON report

Representative connections:
- `MCPU-RA-MC-R318BN.CAN_3(CAN)` -> `IO-lnterface board.CAN_1(CAN)`
- `IO-lnterface board.DI_2(DI)` -> `emc.DO_1(DO)`
- `IO-lnterface board.DI_3(DI)` -> `start.DO_1(DO)`
- `IO-lnterface board.DI_4(DI)` -> `reset.DO_1(DO)`

Function nodes:
- None parsed from FuncDesc.

### 86. proj_robot01_mocmdhzf_packed (2)(1).cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/proj_robot01_mocmdhzf_packed (2)(1).cmodel`
- Remote project: `proj_6a9ca2b9`
- Duplicate path count: 2
- Components: 15 | Connections: 4 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 2, "motor": 2, "mainCPU": 1, "extendedlnterface": 1, "sensor": 2, "battery": 1, "button": 3}`
- Abilities: component=0, function=2
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`diffChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 500.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`motor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -500.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`motor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser_0` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `laser_1` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 500.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `battery` / `U-BAT-LFP-480024-F1-Aa-C0` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- ... 3 more components in JSON report

Representative connections:
- `MCPU-RA-MC-R318BN.CAN_3(CAN)` -> `IO-lnterface board.CAN_1(CAN)`
- `IO-lnterface board.DI_2(DI)` -> `emc.DO_1(DO)`
- `IO-lnterface board.DI_3(DI)` -> `start.DO_1(DO)`
- `IO-lnterface board.DI_4(DI)` -> `reset.DO_1(DO)`

Function nodes:
- None parsed from FuncDesc.

### 87. 新ModelSet.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/新ModelSet.cmodel`
- Remote project: `proj_9d5f243d`
- Duplicate path count: 1
- Components: 48 | Connections: 54 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 4, "driver": 12, "mainCPU": 1, "sensor": 12, "extendedlnterface": 2, "button": 10, "battery": 2, "screen": 1, "audio": 1, "light": 2}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=13

Representative components:
- `chassis_steer` / `None` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `wheel-front-right` / `steering_wheel_Steerwheel ` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": 2175.0, "locCoordY": -766.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `wheel-back-left` / `steering_wheel_Steerwheel ` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": -2175.0, "locCoordY": 766.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `turn_driver_front_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `walk_driver_wheel_front_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_driver_wheel_front_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `walk_driver_wheel_back_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_driver_wheel_back_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_driver_back_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `turn_motor_front_left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `walk_motor_wheel_front_right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `turn_motor_wheel_front_right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- ... 36 more components in JSON report

Representative connections:
- `turn_driver_front_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `turn_driver_front_left.LINE_1(LINE)` -> `turn_motor_front_left.LINE_1(LINE)`
- `turn_driver_front_left.ENCR_1(ENCR)` -> `turn_motor_front_left.ENCR_1(ENCR)`
- `walk_driver_wheel_front_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `walk_driver_wheel_front_right.LINE_1(LINE)` -> `walk_motor_wheel_front_right.LINE_1(LINE)`
- `walk_driver_wheel_front_right.ENCR_1(ENCR)` -> `walk_motor_wheel_front_right.ENCR_1(ENCR)`
- `turn_driver_wheel_front_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `turn_driver_wheel_front_right.LINE_1(LINE)` -> `turn_motor_wheel_front_right.LINE_1(LINE)`
- `turn_driver_wheel_front_right.ENCR_1(ENCR)` -> `turn_motor_wheel_front_right.ENCR_1(ENCR)`
- `walk_driver_wheel_back_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `walk_driver_wheel_back_left.LINE_1(LINE)` -> `walk_motor_wheel_back_left.LINE_1(LINE)`
- `walk_driver_wheel_back_left.ENCR_1(ENCR)` -> `walk_motor_wheel_back_left.ENCR_1(ENCR)`
- ... 42 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 89. ModelSet.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-04/ModelSet.cmodel`
- Remote project: `proj_f97f954c`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 6, "mainCPU": 1, "extendedlnterface": 1, "battery": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=11

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 290.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": -0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -290.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_3(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_2(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_1(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 90. ModelSet39.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet39.cmodel`
- Remote project: `proj_2edbbaf6`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "sensor": 7, "light": 1, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=13

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `up_sensor` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `down_sensor` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `up_sensor.DO_1(DO)` -> `IO module.DI_2(DI)`
- `down_sensor.DO_1(DO)` -> `IO module.DI_3(DI)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 91. 0311新ModelSet.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/0311新ModelSet.cmodel`
- Remote project: `proj_2860f72d`
- Duplicate path count: 1
- Components: 64 | Connections: 66 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "actor": 2, "autobody": 1, "driveWheel": 2, "driver": 8, "intergratedController": 2, "energyController": 1, "sensor": 31, "battery": 1, "audio": 1, "screen": 1, "button": 5, "light": 5, "mainCPU": 1, "extendedlnterface": 2}`
- Abilities: component=2, function=6
- Function description: topLevel=6, nodes=17, fixedRefs=70

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `lifter` / `None` / type=`actor` / sub=`lift` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 125.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `rotator` / `None` / type=`actor` / sub=`rotate` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 90.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `carrier` / `通用载台` / type=`autobody` / sub=`carrier` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 80.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 301.5, "locCoordZ": 10.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -301.5, "locCoordZ": 10.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_right` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=3
- `motor_left` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=3
- `driver_right` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `driver_left` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `driver_lift` / `RA-DR/D-48/14SA-311AH1-C` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver_rotate` / `RA-DR/D-48/14SA-311AH1-C` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- ... 52 more components in JSON report

Representative connections:
- `motor_right.ENCR_1(ENCR)` -> `driver_right.ENCR_1(ENCR)`
- `motor_right.LINE_1(LINE)` -> `driver_right.LINE_1(LINE)`
- `motor_left.ENCR_1(ENCR)` -> `driver_left.ENCR_1(ENCR)`
- `motor_left.LINE_1(LINE)` -> `driver_left.LINE_1(LINE)`
- `driver_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_lift.DO_1(DO)` -> `motor_lift.DI_1(DI)`
- `driver_lift.DI_6(DI)` -> `proximitySensor_lift.DO_1(DO)`
- `driver_lift.LINE_1(LINE)` -> `motor_lift.LINE_1(LINE)`
- `driver_lift.ENCR_1(ENCR)` -> `motor_lift.ENCR_1(ENCR)`
- `driver_rotate.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- ... 54 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `sensoryRecoAbi`: 感知识别
- `sensoryRecoAbi/codeRec`: 码识别
- `sensoryRecoAbi/ranging`: 测距
- `sensoryRecoAbi/detectAbi`: 检测能力
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- ... 5 more function nodes in JSON report

### 92. ModelSet(4).cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet(4).cmodel`
- Remote project: `proj_81cb2239`
- Duplicate path count: 1
- Components: 19 | Connections: 22 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 6, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=13

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 7 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 10 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 93. 20260316.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/20260316.cmodel`
- Remote project: `proj_ffb3b53d`
- Duplicate path count: 1
- Components: 16 | Connections: 14 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 1, "driver": 6, "mainCPU": 1, "sensor": 5, "extendedlnterface": 1, "button": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=6, nodes=17, fixedRefs=16

Representative components:
- `chassis` / `底盘/单舵轮地盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `Steerwheel` / `驱动轮/ZAPI行走轮` / type=`driveWheel` / sub=`verticalSteerWheel` / mount=`{"locCoordX": 1090.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walk-motor` / `ZAPI行走驱动器` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `steer-motor` / `步科转向电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 20.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 180.0}` / interfaces=32
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `传感/2D激光` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 1090.0, "locCoordY": 0.0, "locCoordZ": 2030.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `kinco steer driver` / `步科转向驱动器` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `laser0` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 999.9999389648438, "locCoordY": 470.0, "locCoordZ": 399.9999694824219, "locCoordROLL": 180.0, "locCoordPITCH": -0.0, "locCoordYAW": 63.0}` / interfaces=1
- `button` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lift-motor` / `ZAPI行走驱动器` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- ... 4 more components in JSON report

Representative connections:
- `walk-motor.LINE_1(LINE)` -> `ZAPI DRIVER.LINE_1(LINE)`
- `steer-motor.LINE_1(LINE)` -> `kinco steer driver.LINE_1(LINE)`
- `steer-motor.ENCR_1(ENCR)` -> `kinco steer driver.ENCR_1(ENCR)`
- `MainController.CAN_2(CAN)` -> `kinco steer driver.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `ZAPI DRIVER.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `TofiEncoder.CAN_1(CAN)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_2(ETH)`
- `MainController.ETH_1(ETH)` -> `laser1.ETH_1(ETH)`
- `MainController.ETH_3(ETH)` -> `laser.ETH_1(ETH)`
- `MainController.ETH_3(ETH)` -> `laser0.ETH_1(ETH)`
- ... 2 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `sensoryRecoAbi`: 感知识别
- `sensoryRecoAbi/codeRec`: 码识别
- `sensoryRecoAbi/ranging`: 测距
- `sensoryRecoAbi/detectAbi`: 检测能力
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- ... 5 more function nodes in JSON report

### 94. ModelSet_new_3_27.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet_new_3_27.cmodel`
- Remote project: `proj_54fab3a2`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 6, "mainCPU": 1, "extendedlnterface": 1, "battery": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 290.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": -0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -290.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_3(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_2(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_1(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 95. 0308新款307302440.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/0308新款307302440.cmodel`
- Remote project: `proj_a0067ce5`
- Duplicate path count: 1
- Components: 43 | Connections: 45 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "actor": 2, "autobody": 1, "driveWheel": 2, "driver": 8, "intergratedController": 2, "energyController": 1, "sensor": 11, "communication": 1, "battery": 1, "audio": 1, "screen": 1, "button": 5, "light": 5, "mainCPU": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=6, nodes=17, fixedRefs=88

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `lifter` / `None` / type=`actor` / sub=`lift` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 125.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `rotator` / `None` / type=`actor` / sub=`rotate` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 90.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `carrier` / `通用载台` / type=`autobody` / sub=`carrier` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 80.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 301.5, "locCoordZ": 10.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -301.5, "locCoordZ": 10.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_right` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=3
- `motor_left` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=3
- `driver_right` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `driver_left` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `driver_lift` / `RA-DR/D-48/14SA-311AH1-C` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver_rotate` / `RA-DR/D-48/14SA-311AH1-C` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- ... 31 more components in JSON report

Representative connections:
- `motor_right.ENCR_1(ENCR)` -> `driver_right.ENCR_1(ENCR)`
- `motor_right.LINE_1(LINE)` -> `driver_right.LINE_1(LINE)`
- `motor_left.ENCR_1(ENCR)` -> `driver_left.ENCR_1(ENCR)`
- `motor_left.LINE_1(LINE)` -> `driver_left.LINE_1(LINE)`
- `driver_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_lift.DO_1(DO)` -> `motor_lift.DI_1(DI)`
- `driver_lift.DI_6(DI)` -> `proximitySensor_lift.DO_1(DO)`
- `driver_lift.LINE_1(LINE)` -> `motor_lift.LINE_1(LINE)`
- `driver_lift.ENCR_1(ENCR)` -> `motor_lift.ENCR_1(ENCR)`
- `driver_rotate.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- ... 33 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `sensoryRecoAbi`: 感知识别
- `sensoryRecoAbi/codeRec`: 码识别
- `sensoryRecoAbi/ranging`: 测距
- `sensoryRecoAbi/detectAbi`: 检测能力
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- ... 5 more function nodes in JSON report

### 96. 0309 第一款车模型ModelSet.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/0309 第一款车模型ModelSet.cmodel`
- Remote project: `proj_0d1cc4d4`
- Duplicate path count: 1
- Components: 58 | Connections: 61 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "audio": 1, "sensor": 29, "intergratedController": 2, "driver": 8, "light": 4, "button": 5, "mainCPU": 1, "battery": 1, "driveWheel": 2, "screen": 1, "actor": 1, "extendedlnterface": 2}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=68

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `speaker` / `R-MV-83139-Speak扬声器组件` / type=`audio` / sub=`audioOut` / mount=`{"locCoordX": -300.0, "locCoordY": 100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `laser` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 405.0, "locCoordY": 0.0, "locCoordZ": 195.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `slaveController` / `集成控制器（潜伏五代专用）后控制板` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -400.0000305175781, "locCoordY": 100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `safety_slaveController` / `安全控制器（五代）` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=30
- `driver_lift` / `五代车一体式举升旋转驱动` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 200.0, "locCoordY": -100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=9
- `driver_rotate` / `五代车一体式举升旋转驱动` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 200.0, "locCoordY": 100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=9
- `motor_lift` / `五代车旋转电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 200.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_rotate` / `五代车旋转电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 200.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `proximitySensor_rotate` / `接近传感器,SN18-08BNAE-1,圆形,8mm,12-24V,NPN NO` / type=`sensor` / sub=`proximitySensor` / mount=`{"locCoordX": -200.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `proximitySensor_lift` / `自制&接近传感器,SP12-04BNA,索迪龙，4mm` / type=`sensor` / sub=`proximitySensor` / mount=`{"locCoordX": -100.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `collision` / `安全触边开关,双管,25.5KΩ,850mm,1*Mof2*1F` / type=`sensor` / sub=`collisionPize` / mount=`{"locCoordX": 450.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 90.0}` / interfaces=1
- ... 46 more components in JSON report

Representative connections:
- `speaker.SPK_1(SPK)` -> `MainController.SPK_1(SPK)`
- `laser.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController.PZTB_1(PZTB)` -> `collision.PZTB_1(PZTB)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp_SS.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp_mode.DI_1(DI)`
- `safety_slaveController.DO_4(DO)` -> `lamp_left.DI_2(DI)`
- `safety_slaveController.DO_5(DO)` -> `lamp_left.DI_1(DI)`
- `safety_slaveController.DO_6(DO)` -> `lamp_left.DI_3(DI)`
- `safety_slaveController.DO_7(DO)` -> `lamp_right.DI_2(DI)`
- `safety_slaveController.DO_8(DO)` -> `lamp_right.DI_1(DI)`
- ... 49 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 97. 传感器校验中报错 ModelSet.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/传感器校验中报错 ModelSet.cmodel`
- Remote project: `proj_16e32544`
- Duplicate path count: 1
- Components: 63 | Connections: 65 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "actor": 2, "autobody": 1, "driveWheel": 2, "driver": 8, "intergratedController": 2, "energyController": 1, "sensor": 30, "battery": 1, "audio": 1, "screen": 1, "button": 5, "light": 5, "mainCPU": 1, "extendedlnterface": 2}`
- Abilities: component=2, function=6
- Function description: topLevel=6, nodes=17, fixedRefs=70

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `lifter` / `None` / type=`actor` / sub=`lift` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 125.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `rotator` / `None` / type=`actor` / sub=`rotate` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 90.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `carrier` / `通用载台` / type=`autobody` / sub=`carrier` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 80.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 301.5, "locCoordZ": 10.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -301.5, "locCoordZ": 10.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_right` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=3
- `motor_left` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=3
- `driver_right` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `driver_left` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `driver_lift` / `RA-DR/D-48/14SA-311AH1-C` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver_rotate` / `RA-DR/D-48/14SA-311AH1-C` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- ... 51 more components in JSON report

Representative connections:
- `motor_right.ENCR_1(ENCR)` -> `driver_right.ENCR_1(ENCR)`
- `motor_right.LINE_1(LINE)` -> `driver_right.LINE_1(LINE)`
- `motor_left.ENCR_1(ENCR)` -> `driver_left.ENCR_1(ENCR)`
- `motor_left.LINE_1(LINE)` -> `driver_left.LINE_1(LINE)`
- `driver_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_lift.DO_1(DO)` -> `motor_lift.DI_1(DI)`
- `driver_lift.DI_6(DI)` -> `proximitySensor_lift.DO_1(DO)`
- `driver_lift.LINE_1(LINE)` -> `motor_lift.LINE_1(LINE)`
- `driver_lift.ENCR_1(ENCR)` -> `motor_lift.ENCR_1(ENCR)`
- `driver_rotate.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- ... 53 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `sensoryRecoAbi`: 感知识别
- `sensoryRecoAbi/codeRec`: 码识别
- `sensoryRecoAbi/ranging`: 测距
- `sensoryRecoAbi/detectAbi`: 检测能力
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- ... 5 more function nodes in JSON report

### 98. 0311ModelSet.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/0311ModelSet.cmodel`
- Remote project: `proj_dd79992f`
- Duplicate path count: 1
- Components: 58 | Connections: 61 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "audio": 1, "sensor": 29, "intergratedController": 2, "driver": 8, "light": 4, "button": 5, "mainCPU": 1, "battery": 1, "driveWheel": 2, "screen": 1, "actor": 1, "extendedlnterface": 2}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=68

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `speaker` / `R-MV-83139-Speak扬声器组件` / type=`audio` / sub=`audioOut` / mount=`{"locCoordX": -300.0, "locCoordY": 100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `laser` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 405.0, "locCoordY": 0.0, "locCoordZ": 195.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `slaveController` / `集成控制器（潜伏五代专用）后控制板` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -400.0000305175781, "locCoordY": 100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `safety_slaveController` / `安全控制器（五代）` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=30
- `driver_lift` / `五代车一体式举升旋转驱动` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 200.0, "locCoordY": -100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=9
- `driver_rotate` / `五代车一体式举升旋转驱动` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 200.0, "locCoordY": 100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=9
- `motor_lift` / `五代车旋转电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 200.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_rotate` / `五代车旋转电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 200.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `proximitySensor_rotate` / `接近传感器,SN18-08BNAE-1,圆形,8mm,12-24V,NPN NO` / type=`sensor` / sub=`proximitySensor` / mount=`{"locCoordX": -200.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `proximitySensor_lift` / `自制&接近传感器,SP12-04BNA,索迪龙，4mm` / type=`sensor` / sub=`proximitySensor` / mount=`{"locCoordX": -100.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `collision` / `安全触边开关,双管,25.5KΩ,850mm,1*Mof2*1F` / type=`sensor` / sub=`collisionPize` / mount=`{"locCoordX": 450.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 90.0}` / interfaces=1
- ... 46 more components in JSON report

Representative connections:
- `speaker.SPK_1(SPK)` -> `MainController.SPK_1(SPK)`
- `laser.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController.PZTB_1(PZTB)` -> `collision.PZTB_1(PZTB)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp_SS.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp_mode.DI_1(DI)`
- `safety_slaveController.DO_4(DO)` -> `lamp_left.DI_2(DI)`
- `safety_slaveController.DO_5(DO)` -> `lamp_left.DI_1(DI)`
- `safety_slaveController.DO_6(DO)` -> `lamp_left.DI_3(DI)`
- `safety_slaveController.DO_7(DO)` -> `lamp_right.DI_2(DI)`
- `safety_slaveController.DO_8(DO)` -> `lamp_right.DI_1(DI)`
- ... 49 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 99. 清畅3T（1.2版本）.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/清畅3T（1.2版本）.cmodel`
- Remote project: `proj_076b039a`
- Duplicate path count: 1
- Components: 32 | Connections: 35 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "sensor": 11, "light": 1, "button": 3, "screen": 1, "mainCPU": 1, "battery": 2, "audio": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=6, nodes=17, fixedRefs=19

Representative components:
- `chassis_steer` / `通用舵轮底盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `Steerwheel_FR` / `None` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": 948.0, "locCoordY": -264.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `Steerwheel_BL` / `None` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": -948.0, "locCoordY": 264.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `driver_FR_L` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_FR_R` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_BL_L` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_BL_R` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `motor_FR_L` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_FR_R` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_BL_L` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_BL_R` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `absEncoder_1` / `H8编码器` / type=`sensor` / sub=`absoluteValueEncode` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 20 more components in JSON report

Representative connections:
- `driver_FR_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FR_L.LINE_1(LINE)` -> `motor_FR_L.LINE_1(LINE)`
- `driver_FR_L.ENCR_1(ENCR)` -> `motor_FR_L.ENCR_1(ENCR)`
- `driver_FR_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FR_R.LINE_1(LINE)` -> `motor_FR_R.LINE_1(LINE)`
- `driver_FR_R.ENCR_1(ENCR)` -> `motor_FR_R.ENCR_1(ENCR)`
- `driver_BL_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BL_L.LINE_1(LINE)` -> `motor_BL_L.LINE_1(LINE)`
- `driver_BL_L.ENCR_1(ENCR)` -> `motor_BL_L.ENCR_1(ENCR)`
- `driver_BL_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BL_R.LINE_1(LINE)` -> `motor_BL_R.LINE_1(LINE)`
- `driver_BL_R.ENCR_1(ENCR)` -> `motor_BL_R.ENCR_1(ENCR)`
- ... 23 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `sensoryRecoAbi`: 感知识别
- `sensoryRecoAbi/codeRec`: 码识别
- `sensoryRecoAbi/ranging`: 测距
- `sensoryRecoAbi/detectAbi`: 检测能力
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- ... 5 more function nodes in JSON report

### 100. 最终ModelSet.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/最终ModelSet.cmodel`
- Remote project: `proj_482c6d87`
- Duplicate path count: 1
- Components: 59 | Connections: 62 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "audio": 1, "sensor": 30, "intergratedController": 2, "driver": 8, "light": 4, "button": 5, "mainCPU": 1, "battery": 1, "driveWheel": 2, "screen": 1, "actor": 1, "extendedlnterface": 2}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=69

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `speaker` / `R-MV-83139-Speak扬声器组件` / type=`audio` / sub=`audioOut` / mount=`{"locCoordX": -300.0, "locCoordY": 100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `laser` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 405.0, "locCoordY": 0.0, "locCoordZ": 195.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `slaveController` / `集成控制器（潜伏五代专用）后控制板` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -400.0000305175781, "locCoordY": 100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `safety_slaveController` / `安全控制器（五代）` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=30
- `driver_lift` / `五代车一体式举升旋转驱动` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 200.0, "locCoordY": -100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=9
- `driver_rotate` / `五代车一体式举升旋转驱动` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 200.0, "locCoordY": 100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=9
- `motor_lift` / `五代车旋转电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 200.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_rotate` / `五代车旋转电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 200.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `proximitySensor_rotate` / `接近传感器,SN18-08BNAE-1,圆形,8mm,12-24V,NPN NO` / type=`sensor` / sub=`proximitySensor` / mount=`{"locCoordX": -200.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `proximitySensor_lift` / `自制&接近传感器,SP12-04BNA,索迪龙，4mm` / type=`sensor` / sub=`proximitySensor` / mount=`{"locCoordX": -100.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `collision` / `安全触边开关,双管,25.5KΩ,850mm,1*Mof2*1F` / type=`sensor` / sub=`collisionPize` / mount=`{"locCoordX": 450.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 90.0}` / interfaces=1
- ... 47 more components in JSON report

Representative connections:
- `speaker.SPK_1(SPK)` -> `MainController.SPK_1(SPK)`
- `laser.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController.PZTB_1(PZTB)` -> `collision.PZTB_1(PZTB)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp_SS.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp_mode.DI_1(DI)`
- `safety_slaveController.DO_4(DO)` -> `lamp_left.DI_2(DI)`
- `safety_slaveController.DO_5(DO)` -> `lamp_left.DI_1(DI)`
- `safety_slaveController.DO_6(DO)` -> `lamp_left.DI_3(DI)`
- `safety_slaveController.DO_7(DO)` -> `lamp_right.DI_2(DI)`
- `safety_slaveController.DO_8(DO)` -> `lamp_right.DI_1(DI)`
- ... 50 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 101. ModelSet(5).cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet(5).cmodel`
- Remote project: `proj_becd64b6`
- Duplicate path count: 1
- Components: 17 | Connections: 17 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "mainCPU": 1, "sensor": 2, "extendedlnterface": 1, "button": 4, "battery": 1, "light": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=16

Representative components:
- `chassis_diff` / `自研潜伏底盘600公斤版本` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `Wheel-left-600kg` / `自研潜伏600kg驱动轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 295.0, "locCoordZ": 37.5, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `Wheel-right-600kg` / `自研潜伏600kg驱动轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -295.0, "locCoordZ": 37.5, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `motor-left-600kg` / `自研潜伏600kg行走电机800W` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor-right-600kg` / `自研潜伏600kg行走电机800W` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `driver-left-600kg` / `步科伺服驱动器OD134S` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `driver-right-600kg` / `步科伺服驱动器OD134S` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `MainController-600kg` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 194.0, "locCoordY": 190.0, "locCoordZ": 96.0, "locCoordROLL": 0.0, "locCoordPITCH": 90.0, "locCoordYAW": -90.0}` / interfaces=29
- `gyro-600kg` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module-600kg` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `button-600kg-Emergency` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 470.0, "locCoordY": 330.0, "locCoordZ": 80.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `laser-600kg` / `万集716mini` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 424.0, "locCoordY": 0.0, "locCoordZ": 136.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 5 more components in JSON report

Representative connections:
- `motor-left-600kg.LINE_1(LINE)` -> `driver-left-600kg.LINE_1(LINE)`
- `motor-left-600kg.ENCR_1(ENCR)` -> `driver-left-600kg.ENCR_1(ENCR)`
- `motor-right-600kg.LINE_1(LINE)` -> `driver-right-600kg.LINE_1(LINE)`
- `motor-right-600kg.ENCR_1(ENCR)` -> `driver-right-600kg.ENCR_1(ENCR)`
- `driver-left-600kg.CAN_1(CAN)` -> `MainController-600kg.CAN_2(CAN)`
- `driver-right-600kg.CAN_1(CAN)` -> `MainController-600kg.CAN_2(CAN)`
- `MainController-600kg.RS485_1(RS485)` -> `battery-600kg-48V.RS485_1(RS485)`
- `MainController-600kg.CAN_3(CAN)` -> `IO module-600kg.CAN_1(CAN)`
- `MainController-600kg.ETH_1(ETH)` -> `MainController-600kg.ETH_1(ETH)`
- `MainController-600kg.ETH_1(ETH)` -> `MainController-600kg.ETH_2(ETH)`
- `MainController-600kg.ETH_1(ETH)` -> `MainController-600kg.ETH_3(ETH)`
- `MainController-600kg.ETH_1(ETH)` -> `laser-600kg.ETH_1(ETH)`
- ... 5 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 102. ModelSet(1).cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet(1).cmodel`
- Remote project: `proj_2f473547`
- Duplicate path count: 2
- Components: 16 | Connections: 14 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 1, "driver": 6, "mainCPU": 1, "sensor": 5, "extendedlnterface": 1, "button": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=6, nodes=17, fixedRefs=16

Representative components:
- `chassis` / `底盘/单舵轮地盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `Steerwheel` / `驱动轮/ZAPI行走轮` / type=`driveWheel` / sub=`verticalSteerWheel` / mount=`{"locCoordX": 1090.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walk-motor` / `ZAPI行走驱动器` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `steer-motor` / `步科转向电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 20.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 180.0}` / interfaces=32
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `传感/2D激光` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 1090.0, "locCoordY": 0.0, "locCoordZ": 2030.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `kinco steer driver` / `步科转向驱动器` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `laser0` / `` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 999.9999389648438, "locCoordY": 470.0, "locCoordZ": 399.9999694824219, "locCoordROLL": 0.0, "locCoordPITCH": -0.0, "locCoordYAW": 0.0}` / interfaces=1
- `button` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lift-motor` / `ZAPI行走驱动器` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 1100.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- ... 4 more components in JSON report

Representative connections:
- `walk-motor.LINE_1(LINE)` -> `ZAPI DRIVER.LINE_1(LINE)`
- `steer-motor.LINE_1(LINE)` -> `kinco steer driver.LINE_1(LINE)`
- `steer-motor.ENCR_1(ENCR)` -> `kinco steer driver.ENCR_1(ENCR)`
- `MainController.CAN_2(CAN)` -> `kinco steer driver.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `ZAPI DRIVER.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `TofiEncoder.CAN_1(CAN)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_2(ETH)`
- `MainController.ETH_1(ETH)` -> `laser1.ETH_1(ETH)`
- `MainController.ETH_3(ETH)` -> `laser.ETH_1(ETH)`
- `MainController.ETH_3(ETH)` -> `laser0.ETH_1(ETH)`
- ... 2 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `sensoryRecoAbi`: 感知识别
- `sensoryRecoAbi/codeRec`: 码识别
- `sensoryRecoAbi/ranging`: 测距
- `sensoryRecoAbi/detectAbi`: 检测能力
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- ... 5 more function nodes in JSON report

### 103. ModelSet39(1).cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet39(1).cmodel`
- Remote project: `proj_d39f8944`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "sensor": 7, "light": 1, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=13

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `up_sensor` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `down_sensor` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `up_sensor.DO_1(DO)` -> `IO module.DI_2(DI)`
- `down_sensor.DO_1(DO)` -> `IO module.DI_3(DI)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 104. ModelSet312.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet312.cmodel`
- Remote project: `proj_d74220c4`
- Duplicate path count: 41
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "light": 1, "sensor": 7, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `lamp` / `通用灯带` / type=`light` / sub=`lamp` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `charger` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `lamp.DI_1(DI)` -> `IO module.DO_1(DO)`
- `lamp.DI_2(DI)` -> `IO module.DO_2(DO)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 105. ModelSet.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet.cmodel`
- Remote project: `proj_0153cf51`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "sensor": 7, "light": 1, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=13

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `up_sensor` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `down_sensor` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `up_sensor.DO_1(DO)` -> `IO module.DI_2(DI)`
- `down_sensor.DO_1(DO)` -> `IO module.DI_3(DI)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 106. 20260612.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-06/20260612.cmodel`
- Remote project: `proj_b1112db8`
- Duplicate path count: 1
- Components: 29 | Connections: 33 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "mainCPU": 1, "sensor": 9, "extendedlnterface": 1, "battery": 1, "button": 3, "light": 1, "audio": 1, "screen": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=20

Representative components:
- `01dipan_chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 302.5, "locCoordZ": 82.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -302.5, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_right` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_left` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `driver_right` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `driver_left` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 230.0, "locCoordY": -230.0, "locCoordZ": 120.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 90.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 300.0, "locCoordY": -300.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": -0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `激光雷达,HE3051` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 452.5, "locCoordY": 0.0, "locCoordZ": 280.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 1.5}` / interfaces=2
- `laser0` / `蓝海激光雷达` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -452.5, "locCoordY": 0.0, "locCoordZ": 280.0, "locCoordROLL": 180.0, "locCoordPITCH": 0.0, "locCoordYAW": -171.3}` / interfaces=1
- ... 17 more components in JSON report

Representative connections:
- `motor_right.ENCR_1(ENCR)` -> `driver_right.ENCR_1(ENCR)`
- `motor_right.LINE_1(LINE)` -> `driver_right.LINE_1(LINE)`
- `motor_left.ENCR_1(ENCR)` -> `driver_left.ENCR_1(ENCR)`
- `motor_left.LINE_1(LINE)` -> `driver_left.LINE_1(LINE)`
- `driver_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `MainController.RS485_1(RS485)` -> `battery.RS485_1(RS485)`
- `MainController.CAN_2(CAN)` -> `liftdriver.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `spindriver.CAN_1(CAN)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_2(ETH)`
- ... 21 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 107. ModelSet.cmodel

- Source: `/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-06/ModelSet.cmodel`
- Remote project: `proj_cecf0520`
- Duplicate path count: 1
- Components: 47 | Connections: 52 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driver": 10, "driveWheel": 2, "mainCPU": 1, "sensor": 26, "extendedlnterface": 2, "light": 1, "button": 1, "screen": 1, "audio": 1, "battery": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=22

Representative components:
- `chassis_steer` / `双舵轮底盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `driver_BR_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_BR_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_FL_right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `driver_FL_left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=14
- `Steerwheel_BR` / `轮子` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": 545.0, "locCoordY": 640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `Steerwheel_FL` / `轮子` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": -545.0, "locCoordY": -640.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": -215.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `IO module0` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `通用激光` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 389.6800000000003, "locCoordY": -596.55, "locCoordZ": 2495.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 35 more components in JSON report

Representative connections:
- `driver_BR_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_left.LINE_1(LINE)` -> `motor_BR_left.LINE_1(LINE)`
- `driver_BR_left.ENCR_1(ENCR)` -> `motor_BR_left.ENCR_1(ENCR)`
- `driver_BR_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BR_right.LINE_1(LINE)` -> `motor_BR_right.LINE_1(LINE)`
- `driver_BR_right.ENCR_1(ENCR)` -> `motor_BR_right.ENCR_1(ENCR)`
- `driver_FL_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_right.LINE_1(LINE)` -> `motor_FL_right.LINE_1(LINE)`
- `driver_FL_right.ENCR_1(ENCR)` -> `motor_FL_right.ENCR_1(ENCR)`
- `driver_FL_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FL_left.LINE_1(LINE)` -> `motor_FL_left.LINE_1(LINE)`
- `driver_FL_left.ENCR_1(ENCR)` -> `motor_FL_left.ENCR_1(ENCR)`
- ... 40 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 108. 清畅3T（1.2版本）.cmodel

- Source: `/Users/wangfeifei/Library/CloudStorage/GoogleDrive-wangrunxi30@gmail.com/我的云端硬盘/清畅3T（1.2版本）.cmodel`
- Remote project: `proj_012045fc`
- Duplicate path count: 1
- Components: 33 | Connections: 36 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "sensor": 8, "light": 1, "button": 3, "screen": 1, "mainCPU": 1, "battery": 2, "audio": 1, "actor": 3, "extendedlnterface": 2}`
- Abilities: component=2, function=6
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_steer` / `通用舵轮底盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `Steerwheel_FR` / `None` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": 948.0, "locCoordY": -264.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `Steerwheel_BL` / `None` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": -948.0, "locCoordY": 264.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `driver_FR_L` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_FR_R` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_BL_L` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_BL_R` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `motor_FR_L` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_FR_R` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_BL_L` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_BL_R` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `absEncoder_1` / `H8编码器` / type=`sensor` / sub=`absoluteValueEncode` / mount=`{"locCoordX": 325.0, "locCoordY": 0.0, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 21 more components in JSON report

Representative connections:
- `driver_FR_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FR_L.LINE_1(LINE)` -> `motor_FR_L.LINE_1(LINE)`
- `driver_FR_L.ENCR_1(ENCR)` -> `motor_FR_L.ENCR_1(ENCR)`
- `driver_FR_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FR_R.LINE_1(LINE)` -> `motor_FR_R.LINE_1(LINE)`
- `driver_FR_R.ENCR_1(ENCR)` -> `motor_FR_R.ENCR_1(ENCR)`
- `driver_BL_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BL_L.LINE_1(LINE)` -> `motor_BL_L.LINE_1(LINE)`
- `driver_BL_L.ENCR_1(ENCR)` -> `motor_BL_L.ENCR_1(ENCR)`
- `driver_BL_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BL_R.LINE_1(LINE)` -> `motor_BL_R.LINE_1(LINE)`
- `driver_BL_R.ENCR_1(ENCR)` -> `motor_BL_R.ENCR_1(ENCR)`
- ... 24 more connections in JSON report

Function nodes:
- None parsed from FuncDesc.

### 111. proj_1234_fixed.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/proj_1234_fixed.cmodel`
- Remote project: `proj_998423b1`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driver": 2, "UNKNOWN": 6, "mainCPU": 1, "sensor": 1, "battery": 1}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `1234` / `通用底盘` / type=`chassis` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `None` / type=`driver` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `None` / type=`mainCPU` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `None` / type=`sensor` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `None` / type=`battery` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 112. proj_1234.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/proj_1234.cmodel`
- Remote project: `proj_f85dbbdb`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driver": 2, "UNKNOWN": 4, "mainCPU": 1, "extendedlnterface": 1, "sensor": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `1234` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `U-BAT-LFP-480024-F1-Aa-C0` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `通用按钮` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 113. proj_1234_packed (8)_调整.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/proj_1234_packed (8)_调整.cmodel`
- Remote project: `proj_67f1d75b`
- Duplicate path count: 1
- Components: 11 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 1, "mainCPU": 1, "driver": 4, "extendedlnterface": 1, "sensor": 1, "battery": 1, "button": 1}`
- Abilities: component=2, function=6
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_1` / `通用卧式舵轮` / type=`driveWheel` / sub=`horizontalSteerWheel` / mount=`{"locCoordX": "", "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": "", "locCoordY": 0.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `walkMotor_1` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": "", "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": "", "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": "", "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `通用电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": "", "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO-lnterface board` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `激光雷达,MR-LS-05H-N4017,16m@10%,270°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `U-BAT-LFP-480024-F1-Aa-C0` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `通用按钮` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 114. ModelSet39_reconstructed.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/src/backend/skills/model_deserializer/files/ModelSet39_reconstructed.cmodel`
- Remote project: `proj_150bb98b`
- Duplicate path count: 1
- Components: 20 | Connections: 23 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 6, "button": 1, "sensor": 7, "light": 1, "mainCPU": 1, "extendedlnterface": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=13

Representative components:
- `chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel-lft` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel-right` / `通用差速轮` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -450.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver-left` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-right` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `driver-lift` / `步科` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=16
- `motor-left` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-right` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `motor-lift` / `步科电机` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=4
- `button-emc` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 700.0, "locCoordY": 500.0, "locCoordZ": 50.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `up_sensor` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `down_sensor` / `None` / type=`sensor` / sub=`comDo` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- ... 8 more components in JSON report

Representative connections:
- `driver-left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-left.LINE_1(LINE)` -> `motor-left.LINE_1(LINE)`
- `driver-left.ENCR_1(ENCR)` -> `motor-left.ENCR_1(ENCR)`
- `driver-right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-right.LINE_1(LINE)` -> `motor-right.LINE_1(LINE)`
- `driver-right.ENCR_1(ENCR)` -> `motor-right.ENCR_1(ENCR)`
- `driver-lift.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver-lift.LINE_1(LINE)` -> `motor-lift.LINE_1(LINE)`
- `driver-lift.ENCR_1(ENCR)` -> `motor-lift.ENCR_1(ENCR)`
- `button-emc.DO_1(DO)` -> `IO module.DI_1(DI)`
- `up_sensor.DO_1(DO)` -> `IO module.DI_2(DI)`
- `down_sensor.DO_1(DO)` -> `IO module.DI_3(DI)`
- ... 11 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 115. new_proj_qupxzl9_packed.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/src/backend/saved_projects/new_proj_qupxzl9/new_proj_qupxzl9_packed.cmodel`
- Remote project: `proj_ffa59d5f`
- Duplicate path count: 1
- Components: 0 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{}`
- Abilities: component=0, function=3
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 116. proj_6a41f0b3_packed.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/src/backend/saved_projects/proj_6a41f0b3/proj_6a41f0b3_packed.cmodel`
- Remote project: `proj_51e51f61`
- Duplicate path count: 1
- Components: 29 | Connections: 33 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "mainCPU": 1, "sensor": 9, "extendedlnterface": 1, "battery": 1, "button": 3, "light": 1, "audio": 1, "screen": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=5, nodes=13, fixedRefs=20

Representative components:
- `01dipan_chassis_diff` / `通用差速底盘` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 302.5, "locCoordZ": 82.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -302.5, "locCoordZ": 82.5, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_right` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_left` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `driver_right` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `driver_left` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=17
- `MainController` / `四代主控，Q3(Q7)款/R318+主控制器（四代，Q2款），R318，R112，无上下镜头，外置镜头接口，2路MainCAN，CAN不合并，无终端` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": 230.0, "locCoordY": -230.0, "locCoordZ": 120.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 90.0}` / interfaces=29
- `gyro` / `板载陀螺仪` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 300.0, "locCoordY": -300.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": -0.0, "locCoordYAW": 0.0}` / interfaces=0
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `laser` / `激光雷达,HE3051` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 452.5, "locCoordY": 0.0, "locCoordZ": 280.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 1.5}` / interfaces=2
- `laser0` / `蓝海激光雷达` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -452.5, "locCoordY": 0.0, "locCoordZ": 280.0, "locCoordROLL": 180.0, "locCoordPITCH": 0.0, "locCoordYAW": -171.3}` / interfaces=1
- ... 17 more components in JSON report

Representative connections:
- `motor_right.ENCR_1(ENCR)` -> `driver_right.ENCR_1(ENCR)`
- `motor_right.LINE_1(LINE)` -> `driver_right.LINE_1(LINE)`
- `motor_left.ENCR_1(ENCR)` -> `driver_left.ENCR_1(ENCR)`
- `motor_left.LINE_1(LINE)` -> `driver_left.LINE_1(LINE)`
- `driver_right.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_left.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `MainController.RS485_1(RS485)` -> `battery.RS485_1(RS485)`
- `MainController.CAN_2(CAN)` -> `liftdriver.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `spindriver.CAN_1(CAN)`
- `MainController.CAN_3(CAN)` -> `IO module.CAN_1(CAN)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_1(ETH)`
- `MainController.ETH_1(ETH)` -> `MainController.ETH_2(ETH)`
- ... 21 more connections in JSON report

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 117. proj_7c5fa442_packed.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/src/backend/saved_projects/proj_7c5fa442/proj_7c5fa442_packed.cmodel`
- Remote project: `proj_373bb399`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"UNKNOWN": 1, "mainCPU": 1, "unknown": 3, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `Imported_AMR` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 118. new_proj_0qp5k0e_packed.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/src/backend/saved_projects/new_proj_0qp5k0e/new_proj_0qp5k0e_packed.cmodel`
- Remote project: `proj_9a1a1a43`
- Duplicate path count: 1
- Components: 1 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"UNKNOWN": 1}`
- Abilities: component=0, function=3
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 119. new_proj_lj1bxbw_packed.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/src/backend/saved_projects/new_proj_lj1bxbw/new_proj_lj1bxbw_packed.cmodel`
- Remote project: `proj_6ad40f1a`
- Duplicate path count: 1
- Components: 1 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"UNKNOWN": 1}`
- Abilities: component=0, function=3
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `e2e_ui_amr_fixed` / `None` / type=`None` / sub=`None` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 120. 12345_audit.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/tests/full_pipeline_audit/audit_results_12345/12345_audit.cmodel`
- Remote project: `proj_61f762ca`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "unknown": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 121. 12345_audit.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/audits/FINAL_PIPELINE_VALIDATION_20260404/12345_audit.cmodel`
- Remote project: `proj_b9cb8b0e`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "unknown": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 122. 12345_audit.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/audits/PIPELINE_VERIFICATION_REPORT_20260404/12345_audit.cmodel`
- Remote project: `proj_13362126`
- Duplicate path count: 1
- Components: 12 | Connections: 0 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "mainCPU": 1, "unknown": 1, "sensor": 1, "battery": 1, "button": 1, "driveWheel": 2, "driver": 2, "PMSMMotor": 2}`
- Abilities: component=0, function=2
- Function description: topLevel=5, nodes=13, fixedRefs=14

Representative components:
- `chassis_diff` / `通用底盘` / type=`chassis` / sub=`steerChassis` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `MCPU-RA-MC-R318BN` / `MCPU-RA-MC-R318BN` / type=`mainCPU` / sub=`mainCPU` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `IO-lnterface board` / `IO-lnterface board` / type=`unknown` / sub=`unknown` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `LS-MR-LS-05H-N4017` / `LS-MR-LS-05H-N4017` / type=`sensor` / sub=`sensor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `BAT-U-MR-LFP-480024-F1-C-Aa0` / `BAT-U-MR-LFP-480024-F1-C-Aa0` / type=`battery` / sub=`battery` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `button-Common` / `button-Common` / type=`button` / sub=`button` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=1
- `driveWheel_1` / `driveWheel_1` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_1` / `driver_1` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_1` / `walkMotor_1` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driveWheel_2` / `driveWheel_2` / type=`driveWheel` / sub=`driveWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -400.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `driver_2` / `driver_2` / type=`driver` / sub=`driver` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `walkMotor_2` / `walkMotor_2` / type=`PMSMMotor` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 0.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0

Representative connections:
- None parsed from `linkedInterfaceUuid`.

Function nodes:
- `locationAbility`: 定位能力
- `locationAbility/navi`: 导航
- `HCI`: 人机交互
- `HCI/led`: 灯光
- `HCI/button`: 按钮
- `safetyAbility`: 安全能力
- `safetyAbility/safetyIO`: 安全IO
- `safetyAbility/safetySensor`: 避障传感器
- `safetyAbility/safetyRound`: 避障范围
- `distMeasureAbility`: 透传测距
- `distMeasureAbility/distSensor`: 测距
- `actorAbility`: 执行机构能力
- ... 1 more function nodes in JSON report

### 124. MQ-Q3-600LE-D(T).cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/specifications/ModuleLibrary/AmrModelTem/MQ-Q3-600LE-D(T)/MQ-Q3-600LE-D(T).cmodel`
- Remote project: `proj_18261c0f`
- Duplicate path count: 1
- Components: 31 | Connections: 33 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 4, "intergratedController": 2, "sensor": 7, "battery": 1, "screen": 1, "audio": 1, "button": 5, "light": 5, "energyController": 1, "mainCPU": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 301.5, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -301.5, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_L` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_R` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `servo_driver_L` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `servo_driver_R` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `slaveController` / `R-四代-传感器处理器-NS.02.R-A1` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -300.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=22
- `safety_slaveController` / `R-四代-安全控制器-NS.02.R-A1	
` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=32
- `gyro` / `R-通用-陀螺仪-MOF-A1` / type=`sensor` / sub=`gyro` / mount=`{"locCoordX": 280.0, "locCoordY": 250.0, "locCoordZ": 48.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": 90.0}` / interfaces=2
- `laser-Back` / `激光雷达,MR-LS-01F-S1533,25m@90%,270°(黑色)` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -395.0, "locCoordY": -95.0, "locCoordZ": 196.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": 180.0}` / interfaces=2
- `laser-Front` / `激光雷达,MR-LS-01H-N2725,40m@90%,270°,0.25°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 405.0, "locCoordY": null, "locCoordZ": 196.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=2
- ... 19 more components in JSON report

Representative connections:
- `motor_L.ENCR_1(ENCR)` -> `servo_driver_L.ENCR_1(ENCR)`
- `motor_L.LINE_1(LINE)` -> `servo_driver_L.LINE_1(LINE)`
- `motor_R.ENCR_1(ENCR)` -> `servo_driver_R.ENCR_1(ENCR)`
- `motor_R.LINE_1(LINE)` -> `servo_driver_R.LINE_1(LINE)`
- `servo_driver_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController.PZTB_1(PZTB)` -> `collision-front.PZTB_1(PZTB)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp_start.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp_mode.DI_1(DI)`
- `safety_slaveController.DO_3(DO)` -> `lamp-left.DI_2(DI)`
- ... 21 more connections in JSON report

Function nodes:
- None parsed from FuncDesc.

### 125. MR-HL8-2000LH-C1(M).cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/specifications/ModuleLibrary/AmrModelTem/MR-HL8-2000LH-C1(M)/MR-HL8-2000LH-C1(M).cmodel`
- Remote project: `proj_0f905515`
- Duplicate path count: 1
- Components: 38 | Connections: 39 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 11, "mainCPU": 1, "sensor": 12, "battery": 2, "energyController": 1, "actor": 1, "intergratedController": 2, "light": 2, "button": 2, "screen": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_steer` / `通用舵轮底盘` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `Steerwheel_FR` / `None` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": 615.0, "locCoordY": -290.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `Steerwheel_BL` / `None` / type=`driveWheel` / sub=`diffSteerWheel` / mount=`{"locCoordX": -615.0, "locCoordY": 290.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `driver_FR_L` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_FR_R` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_BL_L` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `driver_BL_R` / `H8_servo_Driver` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=11
- `motor_FR_L` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_FR_R` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_BL_L` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_BL_R` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `MainController` / `R-四代-主控-D.F0.NR-A2` / type=`mainCPU` / sub=`subMainCPU` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 90.0}` / interfaces=29
- ... 26 more components in JSON report

Representative connections:
- `driver_FR_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FR_L.LINE_1(LINE)` -> `motor_FR_L.LINE_1(LINE)`
- `driver_FR_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_FR_R.LINE_1(LINE)` -> `motor_FR_R.LINE_1(LINE)`
- `driver_BL_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BL_L.LINE_1(LINE)` -> `motor_BL_L.LINE_1(LINE)`
- `driver_BL_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `driver_BL_R.LINE_1(LINE)` -> `motor_BL_R.LINE_1(LINE)`
- `MainController.RS485_1(RS485)` -> `screen.RS485_1(RS485)`
- `MainController.CAN_1(CAN)` -> `gyro.CAN_1(CAN)`
- `MainController.CAN_1(CAN)` -> `powerController.CAN_1(CAN)`
- `MainController.CAN_2(CAN)` -> `absEncoder_FR.CAN_1(CAN)`
- ... 27 more connections in JSON report

Function nodes:
- None parsed from FuncDesc.

### 126. 同毅立式舵轮_对角双舵轮车.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/specifications/ModuleLibrary/AmrModelTem/同毅立式舵轮_对角双舵轮车/同毅立式舵轮_对角双舵轮车.cmodel`
- Remote project: `proj_4be39ac9`
- Duplicate path count: 1
- Components: 18 | Connections: 19 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driver": 8, "extendedlnterface": 1, "button": 1, "screen": 1, "battery": 1, "driveWheel": 2, "sensor": 2, "mainCPU": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_steer` / `None` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `servo_driver_FL_RUN` / `IxLII 30.60.48.C ` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 400.0, "locCoordY": 300.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `servo_driver_BR_RUN` / `IxLII 30.60.48.C ` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": -400.0, "locCoordY": -100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `servo_driver_FL_Rotate` / `IxLII 20.40.48.C` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 399.9999694824219, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `servo_driver_BR_Rotate` / `IxLII 20.40.48.C` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": -399.9999694824219, "locCoordY": -300.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=20
- `button` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 500.0, "locCoordY": 100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `screen` / `RS-HMI-LED-FD80480S043HIK-4.3/3/R-C` / type=`screen` / sub=`subScreen` / mount=`{"locCoordX": 400.0000305175781, "locCoordY": -200.00001525878906, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `battery` / `	
U铁锂AGV电池,48V24Ah,主副190*133*162,A/Molex/β` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": -300.0, "locCoordY": 200.0, "locCoordZ": 100.00000762939453, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `Steerwheel_FL` / `None` / type=`driveWheel` / sub=`verticalSteerWheel` / mount=`{"locCoordX": 440.0, "locCoordY": 260.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `Steerwheel_BR` / `None` / type=`driveWheel` / sub=`verticalSteerWheel` / mount=`{"locCoordX": -440.0, "locCoordY": -260.0, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_FL_RUN` / `SM15030BA-18.9` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 300.0, "locCoordY": 100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- ... 6 more components in JSON report

Representative connections:
- `servo_driver_FL_RUN.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_FL_RUN.LINE_1(LINE)` -> `motor_FL_RUN.LINE_1(LINE)`
- `servo_driver_FL_RUN.ENCR_1(ENCR)` -> `motor_FL_RUN.ENCR_1(ENCR)`
- `servo_driver_BR_RUN.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_BR_RUN.LINE_1(LINE)` -> `motor_BR_RUN.LINE_1(LINE)`
- `servo_driver_BR_RUN.ENCR_1(ENCR)` -> `motor_BR_RUN.ENCR_1(ENCR)`
- `servo_driver_FL_Rotate.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_FL_Rotate.LINE_1(LINE)` -> `motor_FL_Rotate.LINE_1(LINE)`
- `servo_driver_FL_Rotate.ENCR_1(ENCR)` -> `motor_FL_Rotate.ENCR_1(ENCR)`
- `servo_driver_BR_Rotate.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_BR_Rotate.LINE_1(LINE)` -> `motor_BR_Rotate.LINE_1(LINE)`
- `servo_driver_BR_Rotate.ENCR_1(ENCR)` -> `motor_BR_Rotate.ENCR_1(ENCR)`
- ... 7 more connections in JSON report

Function nodes:
- None parsed from FuncDesc.

### 127. MQ-Q3-600LE-D(T)-ACTUATOR.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/specifications/ModuleLibrary/AmrModelTem/MQ-Q3-600LE-D(T)-ACTUATOR/MQ-Q3-600LE-D(T)-ACTUATOR.cmodel`
- Remote project: `proj_41510032`
- Duplicate path count: 1
- Components: 41 | Connections: 42 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driveWheel": 2, "driver": 8, "intergratedController": 2, "sensor": 10, "battery": 1, "screen": 1, "audio": 1, "button": 5, "light": 5, "energyController": 1, "actor": 2, "autobody": 1, "mainCPU": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_diff` / `None` / type=`chassis` / sub=`diffChassis` / mount=`{}` / interfaces=0
- `diffWheel_left` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": 301.5, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=0
- `diffWheel_right` / `None` / type=`driveWheel` / sub=`diffWheel` / mount=`{"locCoordX": 0.0, "locCoordY": -301.5, "locCoordZ": 0.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=0
- `motor_L` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_R` / `None` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `servo_driver_L` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": -200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `servo_driver_R` / `R-Q3一体式驱动组件(驱动轮综合款)V1` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 0.0, "locCoordY": 200.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=15
- `slaveController` / `R-四代-传感器处理器-NS.02.R-A1` / type=`intergratedController` / sub=`subIntergratedController` / mount=`{"locCoordX": -300.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=22
- `safety_slaveController` / `R-四代-安全控制器-NS.02.R-A1	
` / type=`intergratedController` / sub=`safetyController` / mount=`{"locCoordX": 400.0, "locCoordY": -200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=32
- `laser-Back` / `激光雷达,MR-LS-01F-S1533,25m@90%,270°(黑色)` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": -395.0, "locCoordY": -95.0, "locCoordZ": 196.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": 180.0}` / interfaces=2
- `laser-Front` / `激光雷达,MR-LS-01H-N2725,40m@90%,270°,0.25°` / type=`sensor` / sub=`laser` / mount=`{"locCoordX": 405.0, "locCoordY": null, "locCoordZ": 196.0, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=2
- `stereo camera` / `MV-EB435i(国内标配)/AMR专用` / type=`sensor` / sub=`stereo` / mount=`{"locCoordX": 454.0, "locCoordY": -27.0, "locCoordZ": 73.0, "locCoordROLL": 180.0, "locCoordPITCH": 5.0, "locCoordYAW": null}` / interfaces=1
- ... 29 more components in JSON report

Representative connections:
- `motor_L.ENCR_1(ENCR)` -> `servo_driver_L.ENCR_1(ENCR)`
- `motor_L.LINE_1(LINE)` -> `servo_driver_L.LINE_1(LINE)`
- `motor_R.ENCR_1(ENCR)` -> `servo_driver_R.ENCR_1(ENCR)`
- `motor_R.LINE_1(LINE)` -> `servo_driver_R.LINE_1(LINE)`
- `servo_driver_L.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_R.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `slaveController.PZTB_1(PZTB)` -> `collision-front.PZTB_1(PZTB)`
- `safety_slaveController.CAN_1(CAN)` -> `MainController.CAN_3(CAN)`
- `safety_slaveController.DO_1(DO)` -> `lamp_start.DI_1(DI)`
- `safety_slaveController.DO_2(DO)` -> `lamp_mode.DI_1(DI)`
- `safety_slaveController.DO_3(DO)` -> `lamp-left.DI_2(DI)`
- ... 30 more connections in JSON report

Function nodes:
- None parsed from FuncDesc.

### 128. 四舵轮.cmodel

- Source: `/Users/wangfeifei/code/amr_studio_v4/specifications/ModuleLibrary/AmrModelTem/四舵轮/四舵轮.cmodel`
- Remote project: `proj_c5150b22`
- Duplicate path count: 1
- Components: 40 | Connections: 42 | Missing connection targets: 0
- Component type counts: `{"chassis": 1, "driver": 16, "extendedlnterface": 2, "button": 2, "screen": 1, "battery": 1, "sensor": 11, "driveWheel": 4, "mainCPU": 1, "energyController": 1}`
- Abilities: component=2, function=5
- Function description: topLevel=0, nodes=0, fixedRefs=0

Representative components:
- `chassis_steer` / `None` / type=`chassis` / sub=`steerChassis` / mount=`{}` / interfaces=0
- `servo_driver_FL_RUN` / `IxLII 30.60.48.C ` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 400.0, "locCoordY": 300.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `servo_driver_BR_RUN` / `IxLII 30.60.48.C ` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": -400.0, "locCoordY": -100.0, "locCoordZ": 0.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `servo_driver_FL_Rotate` / `IxLII 20.40.48.C` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": 399.9999694824219, "locCoordY": 200.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `servo_driver_BR_Rotate` / `IxLII 20.40.48.C` / type=`driver` / sub=`subDriver` / mount=`{"locCoordX": -399.9999694824219, "locCoordY": -300.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `IO module` / `None` / type=`extendedlnterface` / sub=`IOModule` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=20
- `button` / `%急停按钮线,Mizu2F转急停开关,70mm,红/黑` / type=`button` / sub=`subButton` / mount=`{"locCoordX": 500.0, "locCoordY": 100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `screen` / `RS-HMI-LED-FD80480S043HIK-4.3/3/R-C` / type=`screen` / sub=`subScreen` / mount=`{"locCoordX": 400.0000305175781, "locCoordY": -200.00001525878906, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `battery` / `	
U铁锂AGV电池,48V24Ah,主副190*133*162,A/Molex/β` / type=`battery` / sub=`subBattery` / mount=`{"locCoordX": -300.0, "locCoordY": 200.0, "locCoordZ": 100.00000762939453, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=3
- `motor_FL_RUN` / `SM15030BA-18.9` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": 300.0, "locCoordY": 100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_BR_RUN` / `SM15030BA-18.9` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": -300.0, "locCoordY": -100.0, "locCoordZ": 100.0, "locCoordROLL": 0.0, "locCoordPITCH": 0.0, "locCoordYAW": 0.0}` / interfaces=2
- `motor_FL_Rotate` / `SM020BB-50` / type=`driver` / sub=`PMSMMotor` / mount=`{"locCoordX": null, "locCoordY": null, "locCoordZ": null, "locCoordROLL": null, "locCoordPITCH": null, "locCoordYAW": null}` / interfaces=2
- ... 28 more components in JSON report

Representative connections:
- `servo_driver_FL_RUN.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_FL_RUN.LINE_1(LINE)` -> `motor_FL_RUN.LINE_1(LINE)`
- `servo_driver_FL_RUN.ENCR_1(ENCR)` -> `motor_FL_RUN.ENCR_1(ENCR)`
- `servo_driver_BR_RUN.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_BR_RUN.LINE_1(LINE)` -> `motor_BR_RUN.LINE_1(LINE)`
- `servo_driver_BR_RUN.ENCR_1(ENCR)` -> `motor_BR_RUN.ENCR_1(ENCR)`
- `servo_driver_FL_Rotate.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_FL_Rotate.LINE_1(LINE)` -> `motor_FL_Rotate.LINE_1(LINE)`
- `servo_driver_FL_Rotate.ENCR_1(ENCR)` -> `motor_FL_Rotate.ENCR_1(ENCR)`
- `servo_driver_BR_Rotate.CAN_1(CAN)` -> `MainController.CAN_2(CAN)`
- `servo_driver_BR_Rotate.LINE_1(LINE)` -> `motor_BR_Rotate.LINE_1(LINE)`
- `servo_driver_BR_Rotate.ENCR_1(ENCR)` -> `motor_BR_Rotate.ENCR_1(ENCR)`
- ... 30 more connections in JSON report

Function nodes:
- None parsed from FuncDesc.
