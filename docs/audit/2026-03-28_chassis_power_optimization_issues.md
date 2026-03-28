# 底盘·动力系统模块 — 问题清单与解决记录

> 日期: 2026-03-28  
> 审计范围: Step 1（基础配置）+ Step 2（底盘与动力系统）  
> 审计结果: 全部解决 ✅

---

## 问题分类统计

| 类别 | 数量 | 状态 |
|------|:----:|:----:|
| 架构缺陷 | 4 | ✅ 全部解决 |
| UI/UX 问题 | 8 | ✅ 全部解决 |
| 数据完整性 | 3 | ✅ 全部解决 |
| 工程约束遗漏 | 4 | ✅ 全部解决 |

---

## 一、架构缺陷

### A-01: SchemaEngine 不支持递归子属性
- **严重性**: 🔴 高
- **问题描述**: `buildAttributesFromSchema` 在处理 `DATA_COMBOX` 类型的 `typeGroups` 时，未递归解析 `arrayCmobEle` 子属性数组。导致编码器类型切换后，子参数（如 `encoderLine`、`sglTurnBit`）丢失不显示。
- **影响**: 电机编码器详细参数无法配置，后端 JSON 数据缺失关键字段
- **修复**: 重写 `transformElement` 函数，对 `comboType.typeGroups[].arrayCmobEle[]` 进行递归 `transformElement` 调用
- **文件**: `frontend/src/store/SchemaEngine.ts`

### A-02: PowerSystemStep subTypeKey 映射错误
- **严重性**: 🔴 高
- **问题描述**: 创建轮组/电机/驱动器时使用了非官方的 subTypeKey（如 `diffSteerWheel` 作为差速轮 key），导致 SchemaEngine 无法匹配到正确的 PrivateAttribute.json。
- **影响**: 创建的组件属性为空或属性结构错误
- **修复**: 修正映射———`STANDARD_DIFF → diffWheel`, 舵轮 → `horizontalSteerWheel`, 电机 → `PMSMMotor`, 驱动器 → `subDriver`
- **文件**: `frontend/src/components/wizard/PowerSystemStep.tsx`

### A-03: DATA_FIXED_E 类型未实现渲染
- **严重性**: 🟡 中
- **问题描述**: `ComponentPropertyPanel` 的 `renderAttribute` 函数不识别 `DATA_FIXED_E` 数据类型，导致组件间引用关系（如轮→电机）无法在 UI 中展示和编辑。
- **影响**: 用户无法查看/修改轮组与电机的关联关系
- **修复**: 新增 `DATA_FIXED_E` 渲染分支，基于 `fixedSource` 路径过滤并展示项目内组件列表
- **文件**: `frontend/src/components/wizard/ComponentPropertyPanel.tsx`

### A-04: useProjectStore 覆盖 schema subType
- **严重性**: 🟡 中
- **问题描述**: `addComponent` 内部存在硬编码逻辑，将传入的 `type` 值重新映射为不正确的值（如 `diffWHeel` → `diffChassis`）。
- **影响**: 存储的组件 type 与 schema key 不一致
- **修复**: 移除覆盖逻辑，直接使用调用方传入的 subType
- **文件**: `frontend/src/store/useProjectStore.ts`

---

## 二、UI/UX 问题

### U-01: encoderLine 缺少工程快选
- **严重性**: 🟢 低
- **问题描述**: 编码器线数字段仅有一个数字输入框（范围 1~10000），实际工程中常用值为 2500 / 3000 / 4000。
- **修复**: 渲染为 `Select（快选）+ InputNumber（手动）` 的 Space.Compact 组合控件
- **文件**: `ComponentPropertyPanel.tsx`

### U-02: isInvert / bReverse 缺少物理含义说明
- **严重性**: 🟢 低
- **问题描述**: "是否反向"字段无任何提示，用户不知道"反向"是指什么方向。
- **修复**: 在标签旁增加 `QuestionCircleOutlined` + Tooltip，说明"编码器数值增加对应着物理右转（减少），勾选可反转此映射"
- **文件**: `ComponentPropertyPanel.tsx`, `SchemaEngine.ts` (TOOLTIPS)

### U-03: bReverse 被隐藏
- **严重性**: 🟡 中
- **问题描述**: 电机的 `bReverse`（是否反向）在 schema 中标记为 `boolHide: true`（系统内部属性），但实际是需要用户配置的参数。
- **修复**: 通过 `ENGINEERING_CONSTRAINTS.PMSMMotor.visibilityOverrides = { bReverse: true }` 强制覆盖为可见
- **文件**: `SchemaEngine.ts`

### U-04: 2-1 与 2-2 运动中心参数重复展示
- **严重性**: 🟡 中
- **问题描述**: 2-1（尺寸与中心）已有运动中心偏移量的完整编辑界面，2-2（运动性能配置）底部的 ComponentPropertyPanel 又展示了底盘的 `motionCenterAttr` 分组，造成用户困惑。
- **修复**: 在 2-2 的 ComponentPropertyPanel 中增加 `excludeGroupKeys={['motionCenterAttr']}`
- **文件**: `ChassisStep.tsx`

### U-05: 多轮组参数无联动同步
- **严重性**: 🟡 中
- **问题描述**: 差速轮组的左右轮、多舵轮组的各个舵轮，基本参数（轮径、电机型号、驱动器型号等）通常一致，但系统要求用户逐个配置，操作繁琐且容易不一致。
- **修复**: 新增"轮组参数联动"开关（默认开启），修改任意组件参数自动同步到所有同 `category + type` 的兄弟组件。通过 `ComponentPropertyPanel.onAttributeChange` 回调实现。
- **文件**: `PowerSystemStep.tsx`, `ComponentPropertyPanel.tsx`

### U-06: 舵轮底盘无法选择舵轮子类型
- **严重性**: 🟡 中
- **问题描述**: 选择双舵轮或四舵轮底盘后，点击"新增轮组"时，系统硬编码创建 `horizontalSteerWheel`（卧式舵轮），用户无法选择立式舵轮（`verticalSteerWheel`）或差速舵轮（`diffSteerWheel`）。三种舵轮的动力链结构不同：卧式/立式有独立转向电机+行走电机，差速舵轮通过左右电机差速驱动转向。
- **影响**: 限制了系统的适用范围，无法配置非卧式的舵轮底盘
- **修复**: 重构 `handleAddWheel` 函数，对 `STEER` 类底盘弹出舵轮类型选择对话框（Modal），支持三种选项。分别为每种类型生成正确的动力链：
  - `horizontalSteerWheel` / `verticalSteerWheel`: 转向驱动器→转向电机 + 行走驱动器→行走电机
  - `diffSteerWheel`: 左驱动器→左行走电机 + 右驱动器→右行走电机 (绑定 `relateLeftMotor` / `relateRightMotor`)
- **文件**: `PowerSystemStep.tsx`

### U-07: 差速舵轮缺少转向反馈编码器子模块
- **严重性**: 🟡 中
- **问题描述**: 创建差速舵轮时只生成了左右电机+驱动器，未自动创建转向反馈编码器子模块。差速舵轮的 `angleSensorType` 默认为 `GROUP_CALI_ABS_EXTERNAL`（外置绝对值编码器），但其 `relatedEncode` 字段为空，用户还需另外到其他步骤创建编码器后才能关联。
- **影响**: 差速舵轮配置不完整，转向反馈缺失
- **修复**: 在 `doCreateWheel` 的 `diffSteerWheel` 分支中，自动创建 `absoluteValueEncode` 传感器子模块（category=SENSOR），并通过 `bindWheelNestedReference` 将其 UUID 写入 `angleSensor.relatedEncode` 字段。编码器作为 wheel 的子节点显示在动力架构树中。
- **文件**: `PowerSystemStep.tsx`

### U-08: 差速舵轮电机关联字段不应暴露给用户
- **严重性**: 🟢 低
- **问题描述**: `relateLeftMotor` 和 `relateRightMotor` 是 `DATA_FIXED_E` 类型的组件引用字段，在创建时已自动绑定到对应电机 UUID。但 UI 仍然展示了这两个下拉选择器，用户可能误操作导致关联断裂。
- **修复**: 在 `ENGINEERING_CONSTRAINTS.diffSteerWheel` 中添加 `visibilityOverrides: { relateLeftMotor: false, relateRightMotor: false }`，强制隐藏这两个字段。用户仅需通过动力架构树查看关联关系。
- **文件**: `SchemaEngine.ts`

---

## 三、数据完整性问题

### D-01: OMNI_WHEEL 类型残留
- **严重性**: 🔴 高
- **问题描述**: 系统实际不支持全向轮底盘，但 `DriveType`、IdentityStep 下拉、PowerSystemStep 拓扑、PowerTopologyPanel 位置标签、ComponentLibraryStep 过滤中均包含 `OMNI_WHEEL` 选项。用户选择后无法正常工作。
- **影响**: 用户可选择不可用的底盘类型，导致后续配置异常
- **修复**: 从以下 6 个文件中全面移除 OMNI_WHEEL：
  - `types.ts` (DriveType 枚举)
  - `IdentityStep.tsx` (DRIVE_WHEEL_MAP)
  - `PowerSystemStep.tsx` (DRIVE_TOPOLOGY)
  - `PowerTopologyPanel.tsx` (DRIVE_WHEEL_COUNTS, POSITION_LABELS)
  - `ComponentLibraryStep.tsx` (过滤逻辑)
  - `useProjectStore.ts` (chassis type 映射)

### D-02: QUAD_STEER 支持不完整
- **严重性**: 🟡 中
- **问题描述**: 移除 OMNI_WHEEL 后，QUAD_STEER（四舵轮）类型在部分文件中缺失注册。
- **修复**: 在 IdentityStep（DRIVE_WHEEL_MAP）、ComponentLibraryStep（过滤条件）、PowerTopologyPanel（DRIVE_WHEEL_COUNTS + POSITION_LABELS）中补全 QUAD_STEER
- **文件**: 同上

### D-03: bindWheelReference 创建时绑定缺失
- **严重性**: 🟡 中
- **问题描述**: 轮组创建时未正确写入 `DATA_FIXED_E` 关联属性（如 `relateMotor` → 电机 UUID），导致组件间引用断裂。
- **修复**: `handleAddWheel` 中创建完电机后立即调用 `bindWheelReference(key, motor.id)` 写入
- **文件**: `PowerSystemStep.tsx`

---

## 四、工程约束遗漏

### E-01: diffSteerWheel 允许不合理的编码器类型
- **严重性**: 🟡 中
- **问题描述**: 差速舵轮的角度传感器类型下拉中包含 `GROUP_CALI_INC_EXTERNAL`（外置增量编码器），但差速舵轮在工程实践中必须使用外置绝对值编码器。
- **修复**: `ENGINEERING_CONSTRAINTS.diffSteerWheel.hiddenComboOptions = { angleSensorType: ['GROUP_CALI_INC_EXTERNAL'] }`
- **文件**: `SchemaEngine.ts`

### E-02: 舵轮编码器默认值不合理
- **严重性**: 🟢 低
- **问题描述**: 立式/卧式舵轮的编码器默认为"无"，但工程上通常采用内置绝对编码器。
- **修复**: `defaultOverrides = { angleSensorType: 'GROUP_CALI_ABS_INTERNAL' }`
- **文件**: `SchemaEngine.ts`

### E-03: softwareSpec 无条件可见性控制
- **严重性**: 🟡 中
- **问题描述**: 驱动器的 `softwareSpec`（软件规格）字段在所有驱动器类型下均显示，但仅当 `type = MOTOR_SERVO_TYPE_HIK` 时才需要填写。
- **修复**: `conditionalVisibility = { softwareSpec: { dependsOn: 'type', showWhen: 'MOTOR_SERVO_TYPE_HIK', defaultWhenHidden: 'NONE' } }`
- **文件**: `SchemaEngine.ts`

### E-04: PMSMMotor 允许选择"无编码器"
- **严重性**: 🔴 高
- **问题描述**: 伺服电机（PMSMMotor）的 `ENCType` 下拉中包含 `ENCODER_NULL`（无编码器），但 PMSM 伺服电机在物理上必须有编码器反馈。
- **影响**: 用户可能选择"无"导致后端配置异常、系统无法闭环控制
- **修复**: `ENGINEERING_CONSTRAINTS.PMSMMotor.hiddenComboOptions = { ENCType: ['ENCODER_NULL'] }`, `defaultOverrides = { ENCType: 'ENCODER_INC' }`
- **文件**: `SchemaEngine.ts`

---

## 五、修改文件索引

| 文件 | 涉及问题编号 |
|------|------------|
| `frontend/src/store/SchemaEngine.ts` | A-01, E-01, E-02, E-03, E-04, U-02, U-03, U-08 |
| `frontend/src/components/wizard/PowerSystemStep.tsx` | A-02, D-03, U-05, U-06, U-07 |
| `frontend/src/components/wizard/ComponentPropertyPanel.tsx` | A-03, U-01, U-02, U-05 |
| `frontend/src/store/useProjectStore.ts` | A-04, D-01 |
| `frontend/src/store/types.ts` | D-01 |
| `frontend/src/components/wizard/IdentityStep.tsx` | D-01, D-02 |
| `frontend/src/components/wizard/ChassisStep.tsx` | U-04 |
| `frontend/src/components/wizard/PowerTopologyPanel.tsx` | D-01, D-02 |
| `frontend/src/components/wizard/ComponentLibraryStep.tsx` | D-01, D-02 |

---

## 六、验证状态

| 验证项 | 结果 |
|--------|:----:|
| TypeScript tsc --noEmit | ✅ |
| Vite npm run build | ✅ (2.03s) |
| 浏览器 E2E: OMNI_WHEEL 已移除 | ✅ |
| 浏览器 E2E: 轮组创建链正确 | ✅ |
| 浏览器 E2E: DATA_FIXED_E 选择器 | ✅ |
| 浏览器 E2E: softwareSpec 条件可见 | ✅ |
| 浏览器 E2E: isInvert Tooltip | ✅ |
