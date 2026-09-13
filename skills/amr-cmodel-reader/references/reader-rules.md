# Reader Rules

## Purpose

Decode and understand existing `.cmodel` files. Do not build or repair models in this skill.

## Protobuf Schema Usage

Use AMR Studio V4 protobuf-generated modules and runtime wrappers:

- `Message_Module_Info` for `CompDesc.model`
- `Controller_Ability` for `AbiSet.model`
- `Robot_Description` for `FuncDesc.model`

If protobuf parsing fails, report the target message type and exception. Do not create substitute JSON.

## Required Extracted Facts

- Device list: `moduleUuid`, `moduleName`, `moduleDesc`, `mainModuleType`, `subModuleType`, group name.
- Mounting: `locCoordX`, `locCoordY`, `locCoordZ`, `locCoordROLL`, `locCoordPITCH`, `locCoordYAW`, `parentNodeUuid`.
- Interfaces: `interfaceUuid`, `key`, `type`, `desc`, `linkedInterfaceUuid`.
- Connections: source/target module and interface facts resolved through `interfaceUuid`.
- Private attributes: preserve group, key, type, desc, unit, and value-like fields. Do not flatten in a way that loses source path.
- Electrical attributes: preserve interface facts, interface attrs/params, link attrs, and connection endpoints.
- Abilities: `componentAbility`, `functionAbility`.
- Functions: `FuncDesc.function[]`, nested `childFunction`.

## AMR Organization Classification

Classify using source `mainModuleType` and `subModuleType` only:

- `chassis` -> 底盘
- `driveWheel`, `driver`, `PMSMMotor`, `motor` -> 驱动单元
- `sensor`, `SENSOR`, `sensorProcessor` -> 传感器
- `battery`, `energyController` -> 电池
- `extendedlnterface`, `extendedInterface`, `ioModule` -> IO模块
- `mainCPU`, `intergratedController`, `controller` -> 控制器
- `screen` -> 显示屏
- `audio` -> 扬声器
- `light`, `lamp` -> 灯带
- `button` -> 按钮
- `actor` -> 执行器
- otherwise -> 未分类

Do not classify by module name or filename.

## Excel Workbook Output

When Excel output is requested, produce sheets:

- `模型总览`
- `AMR组织结构`
- `器件清单`
- `安装位置`
- `私有属性`
- `电气连接关系`
- `电气属性`
- `功能块描述`
- `诊断`

## Diagnostics

Use explicit diagnostics:

- `CMODEL_PACKAGE_INVALID`
- `CMODEL_COMPDESC_MISSING`
- `CMODEL_PROTO_PARSE_FAILED`
- `CONNECTION_TARGET_NOT_FOUND`
- `ABILITY_PARSE_MISSING`
- `FUNCDESC_PARSE_MISSING`
