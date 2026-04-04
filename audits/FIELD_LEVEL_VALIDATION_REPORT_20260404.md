# 字段级属性验证报告
生成时间: 2026-04-04 09:00:24
项目: proj_12345

## 验证范围
- XML模板类型: 77 个
- 模块JSON文件: 13 个

## 一、验证摘要

| 模块名称 | XML类型 | JSON属性 | XML期望 | 缺失 | 多余 | desc缺失 | 状态 |
|:---------|:--------|:--------:|:-------:|:----:|:----:|:--------:|:----:|
| 12345_chassis-root               | diffchassis     |       33 |      33 |    0 |    0 |        0 | ✅ 完美 |
| BAT-U-MR-LFP-480024-F1-C-Aa0_65e4df | subbattery      |       13 |      13 |    0 |    0 |        0 | ✅ 完美 |
| IO-lnterface board_0373f2e2-4360-49 | iomodule        |        4 |       4 |    0 |    0 |        0 | ✅ 完美 |
| LS-MR-LS-05H-N4017_6d84c837-7f8c-45 | proximitysensor |        5 |       0 |    0 |    5 |        0 | ✅ 完美 |
| MCPU-RA-MC-R318BN_cf00e69a-bd9d-481 | submaincpu      |        5 |       5 |    0 |    0 |        0 | ✅ 完美 |
| button-Common_99d7d228-4018-4bab-95 | subbutton       |        4 |       4 |    0 |    0 |        0 | ✅ 完美 |
| chassis_diff_chassis-root        | steerchassis    |       33 |      32 |    0 |    1 |        0 | ✅ 完美 |
| driveWheel_1_a7b88ea2-c5e7-437b-967 | horizontalsteerwheel |        2 |       7 |    6 |    1 |        0 | ❌ 严重 |
| driveWheel_2_be86f9dc-47f1-4920-8b4 | horizontalsteerwheel |        2 |       7 |    6 |    1 |        0 | ❌ 严重 |
| driver_1_bfcb1b7d-92e4-4eb8-9984-e8 | subdriver       |        7 |       7 |    0 |    0 |        0 | ✅ 完美 |
| driver_2_4996e7f9-af38-4846-ae24-0a | subdriver       |        7 |       7 |    0 |    0 |        0 | ✅ 完美 |
| walkMotor_1_98e86a2d-93c8-439d-aeaf | subdriver       |       14 |       7 |    7 |   14 |        0 | ❌ 严重 |
| walkMotor_2_9d8cd54a-8c74-4889-9e1d | subdriver       |       14 |       7 |    7 |   14 |        0 | ❌ 严重 |

## 二、关键问题详情

### 问题1: desc字段缺失

**描述**: JSON文件中部分属性缺少desc字段描述，但JSON中存在desc字段（可能是从XML转换时正确保留）

#### 12345_chassis-root
- desc覆盖率: 33/33 (100%)

#### BAT-U-MR-LFP-480024-F1-C-Aa0_65e4df
- desc覆盖率: 13/13 (100%)

#### IO-lnterface board_0373f2e2-4360-49
- desc覆盖率: 4/4 (100%)

#### LS-MR-LS-05H-N4017_6d84c837-7f8c-45
- desc覆盖率: 5/5 (100%)

#### MCPU-RA-MC-R318BN_cf00e69a-bd9d-481
- desc覆盖率: 5/5 (100%)

#### button-Common_99d7d228-4018-4bab-95
- desc覆盖率: 4/4 (100%)

#### chassis_diff_chassis-root
- desc覆盖率: 33/33 (100%)

#### driveWheel_1_a7b88ea2-c5e7-437b-967
- desc覆盖率: 2/2 (100%)

#### driveWheel_2_be86f9dc-47f1-4920-8b4
- desc覆盖率: 2/2 (100%)

#### driver_1_bfcb1b7d-92e4-4eb8-9984-e8
- desc覆盖率: 7/7 (100%)

#### driver_2_4996e7f9-af38-4846-ae24-0a
- desc覆盖率: 7/7 (100%)

#### walkMotor_1_98e86a2d-93c8-439d-aeaf
- desc覆盖率: 14/14 (100%)

#### walkMotor_2_9d8cd54a-8c74-4889-9e1d
- desc覆盖率: 14/14 (100%)


#### driveWheel_1_a7b88ea2-c5e7-437b-967 (XML: horizontalsteerwheel)
缺失 6 个属性:
  - ❌ [angleSensor/angleSensorType] type=DATA_COMBOX, desc=类型
  - ❌ [linkMotorAttr/relateRotMotor] type=DATA_FIXED_E, desc=转向电机
  - ❌ [linkMotorAttr/relateWalkMotor] type=DATA_FIXED_E, desc=行走电机
  - ❌ [wheelAttr/angleLmtNeg] type=DATA_DOUBLE, desc=负限位角度
  - ❌ [wheelAttr/angleLmtPos] type=DATA_DOUBLE, desc=正限位角度
  - ❌ [wheelAttr/rotOmgLmt] type=DATA_DOUBLE, desc=转向能力(最大)

#### driveWheel_2_be86f9dc-47f1-4920-8b4 (XML: horizontalsteerwheel)
缺失 6 个属性:
  - ❌ [angleSensor/angleSensorType] type=DATA_COMBOX, desc=类型
  - ❌ [linkMotorAttr/relateRotMotor] type=DATA_FIXED_E, desc=转向电机
  - ❌ [linkMotorAttr/relateWalkMotor] type=DATA_FIXED_E, desc=行走电机
  - ❌ [wheelAttr/angleLmtNeg] type=DATA_DOUBLE, desc=负限位角度
  - ❌ [wheelAttr/angleLmtPos] type=DATA_DOUBLE, desc=正限位角度
  - ❌ [wheelAttr/rotOmgLmt] type=DATA_DOUBLE, desc=转向能力(最大)

#### walkMotor_1_98e86a2d-93c8-439d-aeaf (XML: subdriver)
缺失 7 个属性:
  - ❌ [boardAttr/chipPlatform] type=DATA_STRING, desc=芯片平台
  - ❌ [boardAttr/inputCurrent] type=DATA_DOUBLE, desc=输入电流
  - ❌ [boardAttr/inputVoltage] type=DATA_DOUBLE, desc=输入电压
  - ❌ [boardAttr/overloadCapacity] type=DATA_DOUBLE, desc=过载能力
  - ❌ [boardAttr/overloadTime] type=DATA_DOUBLE, desc=过载时长
  - ❌ [boardAttr/softwareSpec] type=DATA_STRING, desc=软件规格
  - ❌ [boardAttr/type] type=DATA_COMBOX, desc=驱动类型

#### walkMotor_2_9d8cd54a-8c74-4889-9e1d (XML: subdriver)
缺失 7 个属性:
  - ❌ [boardAttr/chipPlatform] type=DATA_STRING, desc=芯片平台
  - ❌ [boardAttr/inputCurrent] type=DATA_DOUBLE, desc=输入电流
  - ❌ [boardAttr/inputVoltage] type=DATA_DOUBLE, desc=输入电压
  - ❌ [boardAttr/overloadCapacity] type=DATA_DOUBLE, desc=过载能力
  - ❌ [boardAttr/overloadTime] type=DATA_DOUBLE, desc=过载时长
  - ❌ [boardAttr/softwareSpec] type=DATA_STRING, desc=软件规格
  - ❌ [boardAttr/type] type=DATA_COMBOX, desc=驱动类型

### 问题3: 多余属性（不在XML模板中）

#### LS-MR-LS-05H-N4017_6d84c837-7f8c-45
多余 5 个属性:
  - ⚠️ [scanAttr/scanDirect] type=DATA_COMBOX
  - ⚠️ [scanAttr/usageMode] type=DATA_COMBOX
  - ⚠️ [sensorAttr/antiLight] type=DATA_DOUBLE
  - ⚠️ [sensorAttr/needCalib] type=DATA_BOOL
  - ⚠️ [sensorAttr/waveLength] type=DATA_DOUBLE

#### chassis_diff_chassis-root
多余 1 个属性:
  - ⚠️ [wheelsAttr/wheelSpace] type=DATA_DOUBLE

#### driveWheel_1_a7b88ea2-c5e7-437b-967
多余 1 个属性:
  - ⚠️ [linkMotorAttr/relateMotor] type=DATA_FIXED_E

#### driveWheel_2_be86f9dc-47f1-4920-8b4
多余 1 个属性:
  - ⚠️ [linkMotorAttr/relateMotor] type=DATA_FIXED_E

#### walkMotor_1_98e86a2d-93c8-439d-aeaf
多余 14 个属性:
  - ⚠️ [motorAttr/ENCType] type=DATA_COMBOX
  - ⚠️ [motorAttr/RPM] type=DATA_INT32
  - ⚠️ [motorAttr/bHbrake] type=DATA_BOOL
  - ⚠️ [motorAttr/bReverse] type=DATA_BOOL
  - ⚠️ [motorAttr/bTemper] type=DATA_BOOL
  - ⚠️ [motorAttr/defaultAcc] type=DATA_DOUBLE
  - ⚠️ [motorAttr/defaultDec] type=DATA_DOUBLE
  - ⚠️ [motorAttr/gearRatio] type=DATA_DOUBLE
  - ⚠️ [motorAttr/initMode] type=DATA_COMBOX
  - ⚠️ [motorAttr/maxAcc] type=DATA_DOUBLE
  - ... 还有 4 个

#### walkMotor_2_9d8cd54a-8c74-4889-9e1d
多余 14 个属性:
  - ⚠️ [motorAttr/ENCType] type=DATA_COMBOX
  - ⚠️ [motorAttr/RPM] type=DATA_INT32
  - ⚠️ [motorAttr/bHbrake] type=DATA_BOOL
  - ⚠️ [motorAttr/bReverse] type=DATA_BOOL
  - ⚠️ [motorAttr/bTemper] type=DATA_BOOL
  - ⚠️ [motorAttr/defaultAcc] type=DATA_DOUBLE
  - ⚠️ [motorAttr/defaultDec] type=DATA_DOUBLE
  - ⚠️ [motorAttr/gearRatio] type=DATA_DOUBLE
  - ⚠️ [motorAttr/initMode] type=DATA_COMBOX
  - ⚠️ [motorAttr/maxAcc] type=DATA_DOUBLE
  - ... 还有 4 个

## 三、Proto字段映射验证

检查JSON字段与Proto Message_Base_Element的映射关系:

| Proto字段 | Tag | JSON字段 | 映射状态 |
|:----------|:----|:---------|:--------:|
| key | 1 | key | ✅ 正确 |
| type | 2 | type (int) | ✅ 转换正确 |
| string_value | 10 | stringValue | ✅ 正确 |
| bool_value | 11 | boolValue | ✅ 正确 |
| int32_value | 12 | int32Value | ✅ 正确 |
| uint32_value | 13 | uint32Value | ✅ 正确 |
| int64_value | 14 | int64Value | ✅ 正确 |
| uint64_value | 15 | uint64Value | ✅ 正确 |
| float_value | 16 | floatValue | ✅ 正确 |
| double_value | 17 | doubleValue | ✅ 正确 |
| combo_type | 21 | comboType | ✅ 正确 |
| double_maxvalue | 35 | doubleMaxvalue | ✅ 正确 |
| double_minvalue | 45 | doubleMinvalue | ✅ 正确 |
| int32_maxvalue | 30 | int32Maxvalue | ✅ 正确 |
| int32_minvalue | 40 | int32Minvalue | ✅ 正确 |
| unit | 50 | unit | ✅ 正确 |
| desc | 51 | desc | ⚠️ **存在但可能为空** |
| bool_parse | 52 | boolParse | ✅ 正确 |
| bool_hide | 53 | boolHide | ✅ 正确 |
| bool_noeditable | 54 | boolNoeditable | ✅ 正确 |
| bool_mustfill | 55 | boolMustfill | ✅ 正确 |
| bool_basic | 56 | boolBasic | ✅ 正确 |
| fixed_source | 57 | fixedSource | ✅ 正确 |

**⚠️ desc字段问题**: Proto要求Tag 51的desc字段，JSON中该字段存在但可能从XML转换时为空。
需要检查 `resource_adapter.py` 中的 `map_attribute_to_cmodel` 是否从XML正确复制desc字段。

## 四、修复建议

### 高优先级
1. **驱动轮属性缺失**: driveWheel_1/2 缺少6个关键属性（wheelAttr/angleLmtPos等），影响驱动轮配置功能
2. **电机属性与模板不匹配**: walkMotor_1/2 实际属性是电机属性，但匹配到了subdriver模板

### 中优先级
3. **desc字段完整性**: 检查 `resource_adapter.py:85` 是否正确从XML提取desc字段
4. **激光传感器模板**: proximitysensor模板可能不存在，需确认XML中是否有此类型

---
报告生成完成