# 底盘·轮组·电机·驱动器·编码器 — 优化设计总结

> 文档编号: 02  
> 日期: 2026-03-28  
> 范围: SchemaEngine / PowerSystemStep / ComponentPropertyPanel / useProjectStore  
> 状态: ✅ 已实施验证

---

## 一、架构设计概述

### 1.1 架构核心原则

```
ModuleLibrary JSON (Single Source of Truth)
        │
        ▼
  SchemaEngine.ts  ←── Engineering Constraints (domain rules)
        │
        ▼
  Zustand Store (useProjectStore.ts)
        │
        ├──→ ComponentPropertyPanel.tsx (渲染)
        └──→ PowerSystemStep.tsx (轮组创建 + 参数联动)
```

| 原则 | 说明 |
|------|------|
| **JSON 即规范** | 所有模块属性全部来源于 `ModuleLibrary/ModuleAttrTem/Pri_Attr/<subType>/PrivateAttribute.json` |
| **禁止硬编码** | 不允许在 UI 代码中创建临时属性对象，所有属性必须通过 SchemaEngine 从 JSON 解析 |
| **工程约束分层** | 领域专家的约束规则（如"PMSM 必须有编码器"）通过 `ENGINEERING_CONSTRAINTS` 配置表注入，不修改源 JSON |
| **联动同步** | 同类型轮组参数默认自动联动，通过 `onAttributeChange` 回调机制实现 |

### 1.2 SchemaEngine 能力清单

| 能力 | 函数 | 说明 |
|------|------|------|
| 属性构建 | `buildAttributesFromSchema(subType)` | 从 JSON 构建完整的 `AttributeGroup[]` |
| 工程约束 | `getEngineeringConstraints(subType)` | 返回特定模块的约束配置 |
| 快选预设 | `getPresetOptions(attrKey)` | 返回属性的常用值快选列表 |
| 物理含义 | `getTooltip(attrKey)` | 返回属性的物理含义提示文字 |
| 引用解析 | `parseFixedSource(path)` | 将 `DATA_FIXED_E` 的 fixedSource 路径转为组件过滤规则 |

### 1.3 工程约束机制 (EngineeringConstraint)

```typescript
interface EngineeringConstraint {
    hiddenComboOptions?: Record<string, string[]>;    // 隐藏 ComboBox 选项
    defaultOverrides?: Record<string, string>;         // 覆盖默认选择
    conditionalVisibility?: Record<string, {           // 条件可见性
        dependsOn: string;
        showWhen: string | string[];
        defaultWhenHidden: any;
    }>;
    visibilityOverrides?: Record<string, boolean>;     // 强制覆盖 boolHide
}
```

**当前已注册的约束：**

| 模块 | 约束内容 |
|------|---------|
| `diffSteerWheel` | 隐藏 `GROUP_CALI_INC_EXTERNAL`，默认 `GROUP_CALI_ABS_EXTERNAL`，隐藏 `relateLeftMotor/relateRightMotor` |
| `horizontalSteerWheel` | 默认 `angleSensorType = GROUP_CALI_ABS_INTERNAL` |
| `verticalSteerWheel` | 同上 |
| `subDriver` | `softwareSpec` 仅当 `type = MOTOR_SERVO_TYPE_HIK` 时显示 |
| `PMSMMotor` | 隐藏 `ENCODER_NULL`，默认 `ENCODER_INC`，`bReverse` 强制可见 |

---

## 二、数据类型渲染规则

### 2.1 属性类型 → UI 控件映射

| JSON type | UI 控件 | 特殊处理 |
|-----------|---------|---------|
| `DATA_DOUBLE` / `DATA_INT32` | `InputNumber` | 支持 `min/maxValue` 范围约束 |
| `DATA_DOUBLE` / `DATA_INT32` + preset | `Select + InputNumber` (Space.Compact) | 当 `getPresetOptions` 返回非空时激活 |
| `DATA_BOOL` | `Switch` | — |
| `DATA_STRING` | `Input` | — |
| `DATA_COMBOX` | `Select` + 递归子属性 | 子属性来自 `arrayCmobEle`，递归 `renderAttribute` |
| `DATA_FIXED_E` | `Select` (组件引用选择器) | 基于 `fixedSource` 过滤项目内组件 |

### 2.2 属性标志解读

| 标志 | 含义 | UI 行为 |
|------|------|--------|
| `boolHide: true` | 系统内部属性 | 默认隐藏，"展开高级属性"后可见（灰显） |
| `boolNoeditable: true` | 只读/系统计算 | 控件 disabled，显示"锁定"标签 |
| `boolMustfill: true` | 必填 | 标签标红 + 星号 |
| `boolBasic: false` | 非基础属性 | 归入"高级属性"分组 |

### 2.3 fixedSource 路径映射规则

`fixedSource` 格式为 `"<moduleGroup>/<subTypeKey>"`，例如 `"driver/PMSMMotor"`

| moduleGroup | 映射 category | 说明 |
|------------|--------------|------|
| `driver` | `MOTOR` | PMSMMotor/BDCMotor/BLDCMotor 都属于 MOTOR category |
| `sensor` | `SENSOR` | 各类编码器、传感器 |

---

## 三、轮组创建与联动机制

### 3.1 底盘类型 → subTypeKey 映射

| driveType | 轮组 subType | 选择方式 | 默认动力链结构 |
|-----------|-------------|---------|-------------|
| `STANDARD_DIFF` | `diffWheel` | 自动（无需选择） | Wheel → Driver → Motor |
| `SINGLE_STEER` | 用户选择 ¹ | Modal 弹窗 | 见下方 3.1.1 |
| `DUAL_STEER` | 用户选择 ¹ | Modal 弹窗 | 同上 |
| `QUAD_STEER` | 用户选择 ¹ | Modal 弹窗 | 同上 |

> ¹ 舵轮类型选择支持三种：`horizontalSteerWheel`（卧式）、`verticalSteerWheel`（立式）、`diffSteerWheel`（差速舵轮）
> 
> **实际不支持 OMNI_WHEEL（全向轮底盘），已全面移除。**

#### 3.1.1 舵轮子类型 → 动力链结构

| 舵轮 subType | 标签 | 动力链结构 | 绑定键 |
|-------------|------|-----------|-------|
| `horizontalSteerWheel` | 卧式舵轮 | SteerDriver→SteerMotor + WalkDriver→WalkMotor | `relateRotMotor`, `relateWalkMotor` |
| `verticalSteerWheel` | 立式舵轮 | 同上（仅安装方式不同） | `relateRotMotor`, `relateWalkMotor` |
| `diffSteerWheel` | 差速舵轮 | LeftDriver→LeftMotor + RightDriver→RightMotor + SteerEncoder | `relateLeftMotor`¹, `relateRightMotor`¹, `relatedEncode` |

### 3.2 轮组参数联动同步

- 默认开启 `wheelSync = true`
- 修改任意轮组参数时，通过 `onAttributeChange` 回调自动同步到所有 **同 category + 同 type** 的组件
- 例如：修改左驱动轮的轮径 → 右驱动轮自动同步
- 用户可通过"轮组参数联动"开关切换为"独立"模式

### 3.3 DATA_FIXED_E 绑定

轮组创建时，通过 `bindWheelReference(key, targetUuid)` 直接写入 schema 生成的属性值：
- `diffWheel`: `relateMotor` → 电机 UUID
- `horizontalSteerWheel` / `verticalSteerWheel`: `relateWalkMotor` → 行走电机 UUID, `relateRotMotor` → 转向电机 UUID
- `diffSteerWheel`: `relateLeftMotor`¹ → 左行走电机 UUID, `relateRightMotor`¹ → 右行走电机 UUID, `relatedEncode` → 转向编码器 UUID

> ¹ `relateLeftMotor` / `relateRightMotor` 通过 `visibilityOverrides: false` 强制隐藏，仅系统内部使用，用户不可见

---

## 四、UI 去重规则

### 4.1 2-1 与 2-2 参数分工

| 参数组 | 2-1（尺寸与中心） | 2-2（运动性能） |
|--------|:-:|:-:|
| 物理包络 (L/W/H) | ✅ 输入 | ❌ 排除 |
| 运动中心偏移 (空载/满载) | ✅ 输入 | ❌ `excludeGroupKeys: ['motionCenterAttr']` |
| 线速度/加速度/减速度 | ❌ | ✅ 输入 |
| 角速度/角加速度 | ❌ | ✅ 输入 |
| 底盘全局参数 (CModel) | ❌ | ✅ 展示（排除重复 keys） |

---

## 五、未来模块扩展指南

### 5.1 新增硬件模块的标准流程

1. **Schema 文件创建**: 在 `ModuleLibrary/ModuleAttrTem/Pri_Attr/<subTypeKey>/PrivateAttribute.json` 创建属性文件
2. **SchemaEngine 自动注册**: Vite 的 `import.meta.glob` 会自动发现新文件，无需手动导入
3. **工程约束注入**: 如有领域约束（如"某属性在特定条件下隐藏"），在 `ENGINEERING_CONSTRAINTS` 中添加条目
4. **预设与提示**: 在 `PRESET_OPTIONS` 和 `TOOLTIPS` 中添加常用值和物理含义
5. **创建逻辑**: 在对应的 Step 组件中使用 `buildAttributesFromSchema(subType)` 构建属性

### 5.2 约束注入清单（后续模块参考）

对于每个新模块，需要回答以下问题：

| 检查项 | 说明 | 示例 |
|--------|------|------|
| 是否有 ComboBox 选项需要工程限制？ | 某些 schema 选项在工程实践中不可用 | PMSM 不允许无编码器 |
| 是否有条件可见性字段？ | 某些字段仅在特定条件下需要用户填写 | softwareSpec 仅 HIK 模式 |
| 是否有隐藏属性需要强制显示？ | schema 标记 `boolHide:true` 但实际需要用户配置 | bReverse 电机反向 |
| 是否有常用工程预设值？ | 减少用户输入负担 | encoderLine: 2500/3000/4000 |
| 是否有需要物理含义说明的字段？ | 避免误配置 | isInvert 方向定义 |
| 是否存在同类型组件联动？ | 多个同类组件参数通常一致 | 左右轮组参数同步 |

### 5.3 传感器模块扩展建议

下一批需分析的模块（按优先级排序）：

1. **激光雷达 (Lidar)**: 2D/3D 激光，需要分析安装位置、扫描角度、通信协议等属性
2. **超声波 (Ultrasonic)**: 探测距离、安装角度、触发模式等
3. **相机 (Camera)**: RGB/深度/红外，需要分辨率、帧率、视场角等
4. **IO 模块**: 输入/输出端口映射，急停/光幕/按钮等安全器件
5. **充电模块**: 充电桩/自动对接/电池管理参数

> **每个模块扩展时，必须先运行 Module Deep Analyzer Skill，生成分析文档存档到 `docs/design_reference/` 后再编码。**

---

## 六、设计约束规范（强制遵循）

### 6.1 禁止事项

| ❌ 禁止 | ✅ 正确做法 |
|---------|-----------|
| 在 UI 代码中 `push({ key, value, type })` 创建临时属性 | 使用 `buildAttributesFromSchema(subType)` |
| 修改 `PrivateAttribute.json` 源文件来适配 UI 需求 | 通过 `ENGINEERING_CONSTRAINTS` 注入约束 |
| 在 `renderAttribute` 中用 `if (ele.key === 'xxx')` 硬编码 | 通过 `getEngineeringConstraints/getPresetOptions/getTooltip` 配置化 |
| 复用 identity 字段绕过 schema 赋值 | 使用 `updateAttribute` 写入 schema 属性 |
| 假设所有模块结构一致 | 每个 subType 独立 schema，类型差异由 SchemaEngine 处理 |

### 6.2 数据一致性要求

- identity 中的运动中心偏移量 **必须** 同步到底盘组件的 `motionCenterAttr` group
- 2-1 是运动中心参数的唯一编辑入口，2-2 不得重复展示
- 轮组创建后的 `DATA_FIXED_E` 关联字段必须在创建时立即绑定
- ComboBox 选择变更时，联动的子属性必须正确初始化
