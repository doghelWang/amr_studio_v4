# AMR Studio V4 前端数据解析与应用规则总览

**文档版本**: V1.0  
**生成日期**: 2026-04-04  
**适用范围**: 前端组件开发、导入导出引擎、拓扑还原系统

---

## 第一部分：数据模型层级架构

### 1.1 核心数据流向

```
后端 .cmodel (Protocol Buffer)
    ↓ 序列化/反序列化
JSON Object (snake_case ↔ camelCase 自动映射)
    ↓ ImportService.parseCompDesc
ComponentConfig[] + RobotIdentity
    ↓ useProjectStore.addComponentFromConfig
Zustand Store (持久化状态)
    ↓ SchemaEngine.buildAttributesFromSchema
UI Forms / Tree Views
```

### 1.2 层级结构说明

| 层级 | 数据类型 | Proto 对应 | 前端类型定义 |
|------|----------|------------|--------------|
| **Robot/Project** | ModelSet312 | Message_Module_Info | RobotConfig |
| **ModuleGroup** | 机械/电气子系统 | more_module_info | ModuleGroup |
| **Component** | 实际模块实例 | module_componets | ComponentConfig |
| **Attribute** | 私有属性 | private_attrs → array_base_ele | SmartAttribute |
| **Interface** | 外部接口 | interface_Group | InterfaceConfig |

---

## 第二部分：关键字段解析规则

### 2.1 模块标识字段优先级（高→低）

```typescript
// 全局唯一索引键 (用于拓扑匹配)
const moduleKey = generalAttr?.moduleName?.stringValue  // 英文名称
                || generalAttr?.module_name?.string_value  // 后端返回
                || generalAttr?.moduleDesc?.stringValue    // 展示名称
                || structExtend.find(p => p.key === 'module_srcname')?.stringValue  // 扩展字段

// 展示名称
const displayName = generalAttr?.moduleDesc?.stringValue   // 中文描述
                  || generalAttr?.moduleName?.stringValue  // 回退到英文

// UUID (实例唯一，非模板)
const instanceUuid = generalAttr?.moduleUuid?.stringValue
```

**⚠️ 重要规则**: 拓扑匹配（电机→驱动器→轮组关联）**必须**使用 `module_name` (英文)，而非 `module_desc` (中文显示名)。

### 2.2 驱动类型动态影响

| driveType | 轮组模板选择 | 底盘子类型 | parseCompDesc 期望 |
|-----------|-------------|-----------|-------------------|
| STANDARD_DIFF | diffWheel (2属性) | diffChassis | 2轮组，无舵角 |
| SINGLE_STEER | horizontalSteerWheel (7属性) | steerChassis | 前/后舵轮配置 |
| DUAL_STEER | horizontalSteerWheel (7属性) | steerChassis | 2+舵轮 |
| QUAD_STEER | horizontalSteerWheel (7属性) | steerChassis | 4轮全舵 |

```typescript
// useProjectStore.ts 自动选择逻辑
subType = state.config.identity.driveType?.includes('STEER')
  ? 'horizontalSteerWheel'  // 7属性: angleLmtPos/Neg, rotOmgLmt, angleSensorType, relateRotMotor, relateWalkMotor
  : 'diffWheel';            // 2属性: wheelRadius, relateMotor
```

---

## 第三部分：子系统分类与属性模板

### 3.1 CATEGORY → 子系统映射

```typescript
// CATEGORY_TO_SUBSYS 映射表 (resource_adapter.py)
const CATEGORY_TO_SUBSYS: Record<string, { key: string, desc: string }> = {
  'CHASSIS':     { key: 'ChassisSys',     desc: "底盘系统" },
  'DRIVEWHEEL':  { key: 'ChassisSys',     desc: "底盘系统" },
  'DRIVER':      { key: 'DriverSys',      desc: "驱动系统" },
  'MOTOR':       { key: 'DriverSys',      desc: "驱动系统" },
  'MAINCPU':     { key: 'ControlSys',     desc: "控制系统" },
  'IO_BOARD':    { key: 'ControlSys',     desc: "控制系统" },
  'SENSOR':      { key: 'SensorSys',      desc: "传感器系统" },
  'BATTERY':     { key: 'EnergySys',      desc: "能量系统" },
  'BUTTON':      { key: 'InteractiveSys', desc: "交互系统" },
  'LIGHT':       { key: 'InteractiveSys', desc: "交互系统" },
  'LED':         { key: 'InteractiveSys', desc: "交互系统" },
}
```

### 3.2 关键模块属性模板

#### 3.2.1 轮组 (DRIVEWHEEL)

**diffWheel** (差速轮，2属性):
```yaml
Group: wheelAttr
  - wheelRadius: DATA_DOUBLE (mm)
Group: linkMotorAttr
  - relateMotor: DATA_FIXED_E (指向 driver/PMSMMotor)
```

**horizontalSteerWheel** (水平舵轮，7属性):
```yaml
Group: wheelAttr
  - wheelRadius: DATA_DOUBLE (mm)
  - angleLmtPos: DATA_DOUBLE (°，正限位)
  - angleLmtNeg: DATA_DOUBLE (°，负限位)
  - rotOmgLmt: DATA_DOUBLE (°/s，最大转向速度)
Group: angleSensor
  - angleSensorType: DATA_COMBOX
      * GROUP_CALI_ABS_INTERNAL (内置绝对码盘)
      * GROUP_CALI_ABS_EXTERNAL (外置绝对码盘)
        - relatedEncode: DATA_FIXED_E (外置编码器关联)
        - gearRatio: DATA_DOUBLE (减速比)
      * GROUP_CALI_HELM_IO (增量编码器)
Group: linkMotorAttr
  - relateRotMotor: DATA_FIXED_E (转向电机，PMSMMotor)
  - relateWalkMotor: DATA_FIXED_E (行走电机，PMSMMotor)
```

#### 3.2.2 电机 (MOTOR)

**⚠️ 关键修复**: `addComponent` 中强制 MOTOR 使用 PMSMMotor 模板，而非 subDriver。

**PMSMMotor** (永磁同步伺服电机，14属性):
```yaml
Group: motorAttr
  - ENCType: DATA_COMBOX (编码器类型)
      * ENCODER_NULL, ENCODER_INC, ENCODER_MULTI_TURN_ABS, ENCODER_SGL_TURN_ABS
  - initMode: DATA_COMBOX (FREERUN/VELOCITY_ZERO)
  - RPM: DATA_INT32 (额定转速 RPM)
  - bTemper: DATA_BOOL (支持温度获取)
  - bHbrake: DATA_BOOL (带抱闸)
  - bReverse: DATA_BOOL (反向)
  - torque: DATA_DOUBLE (额定扭矩 N*m)
  - gearRatio: DATA_DOUBLE (减速比)
  - ratedCurr: DATA_DOUBLE (额定电流 A)
  - overCurrCoef: DATA_DOUBLE (过流系数)
  - defaultAcc/dec: DATA_DOUBLE (默认加减速 r/s²)
  - maxAcc/dec: DATA_DOUBLE (最大加减速 r/s²)
```

#### 3.2.3 驱动器 (DRIVER)

**subDriver** (子驱动板):
```yaml
Group: boardAttr
  - chipPlatform: DATA_STRING (芯片平台，如 'R131')
  - softwareSpec: DATA_STRING (软件规格，'NONE'/版本)
  - offsetAddress: DATA_STRING (偏移地址拨码)
Group: driverAttr
  - type: DATA_COMBOX (MOTOR_SERVO_TYPE_HIK/PUB/NONE)
    → 条件显示: softwareSpec 仅在 MOTOR_SERVO_TYPE_HIK 时可见
```

---

## 第四部分：数据类型解析规则

### 4.1 MESSAGE_BASE_DATA_TYPE 映射

| Proto 类型 | JSON 字段 | TS 类型 | UI 组件 | 说明 |
|-----------|-----------|---------|---------|------|
| DATA_STRING | string_value | string | Input | 任意字符串 |
| DATA_BOOL | bool_value | boolean | Switch/Checkbox | true/false |
| DATA_INT32 | int32_value | number | InputNumber | 整型 |
| DATA_DOUBLE | double_value | number | InputNumber (精度) | 浮点型，带 unit |
| DATA_COMBOX | combo_type.typeKey | string | Select/Cascader | 枚举/复合选项 |
| DATA_FIXED_E | string_fix | string | ReferenceInput (组件选择) | 指向其他模块UUID |

### 4.2 嵌套数据结构

#### DATA_COMBOX 递归规则
```typescript
interface SmartAttribute {
  type: 'DATA_COMBOX';
  value: string; // 当前选中的 typeGroup.key
  comboType?: {
    typeKey: string;      // 当前值
    typeDesc: string;     // 显示描述
    typeGroups: Array<{
      key: string;        // 枚举选项
      desc: string;       // 显示名
      arrayCmobEle?: SmartAttribute[];  // 递归嵌套的子属性！
    }>;
  };
}

// 示例: angleSensorType = GROUP_CALI_ABS_EXTERNAL 时
// - 触发显示: relatedEncode, gearRatio (在 arrayCmobEle 中)
```

#### DATA_FIXED_E 引用规则
```typescript
interface FixedAttribute {
  type: 'DATA_FIXED_E';
  value: string; // 绑定目标的 UUID (string_fix)
  fixedSource: string[]; // 过滤源，如 ["driver/PMSMMotor", "sensor/absoluteValueEncode"]
}

// parseFixedSource 映射
"driver/PMSMMotor" → { category: 'MOTOR', subType: 'PMSMMotor' }
"sensor/absoluteValueEncode" → { category: 'SENSOR', subType: 'absoluteValueEncode' }
```

---

## 第五部分：拓扑连接规则

### 5.1 接口数据结构

```typescript
interface InterfaceConfig {
  key: string;              // CAN0, POWER_IN, etc.
  type: string;             // CAN, POWER, ETH
  path: string;             // 接口路径/端口
  desc: string;             // 描述
  interfaceUuid: string;    // 本接口实例唯一ID
  linkedInterfaceUuid: string[]; // 连线对方的 UUIDs (支持多对多)
  interfaceParams?: Record<string, any>; // 接口专用参数
}
```

### 5.2 动力拓扑层级 (PowerSystemStep)

```
L1: DRIVEWHEEL (轮组)
    ├── parentNodeUuid → CHASSIS (底盘)
    ├── L2: DRIVER (驱动器)
    │       ├── parentNodeUuid → DRIVEWHEEL
    │       └── L3: MOTOR (电机)
    │               └── parentNodeUuid → DRIVER
    └── L2: SENSOR (编码器，分类为 SENSOR 但角色为编码器)
            └── parentNodeUuid → DRIVEWHEEL
```

### 5.3 拓扑还原关键字段

**导入时属性嗅探** (ImportService.ts):
```typescript
// 轮组私有属性中的电机关联
const related = {
  relateLeftMotor:   'walk_left',    // 差速左电机
  relateRightMotor:  'walk_right',   // 差速右电机
  relateWalkMotor:   'walk',         // 行走电机 (舵轮)
  relateRotMotor:    'steer',        // 转向电机 (舵轮)
  relatedEncode:     'encoder'       // 编码器关联
};

// 接线追踪 (接口 UUID 反向查找)
const findDriverViaWiring = (motorComp, ifaceToCompMap) => {
  for (const iface of motorComp.interfaces) {
    for (const linkedUuid of iface.linkedInterfaceUuid) {
      const candidate = components.find(c => c.id === ifaceToCompMap.get(linkedUuid));
      if (candidate?.category === 'DRIVER') return candidate;
    }
  }
};
```

---

## 第六部分：属性值提取规则

### 6.1 值提取优先级

对于每种数据类型，提取值的优先级:

```typescript
// DATA_STRING
value = attr.stringValue 
     ?? attr.string_value 
     ?? attr.stringFix 
     ?? attr.string_fix 
     ?? '';

// DATA_DOUBLE / DATA_FLOAT
value = attr.doubleValue 
     ?? attr.double_value 
     ?? attr.floatValue 
     ?? attr.float_value 
     ?? 0;

// DATA_INT32
value = attr.int32Value 
     ?? attr.int_32_value 
     ?? attr.intValue 
     ?? 0;

// DATA_BOOL
value = attr.boolValue 
     ?? attr.bool_value 
     ?? false;

// DATA_COMBOX (存储选中的 key)
value = attr.comboType?.typeKey 
     ?? attr.combo_type?.type_key 
     ?? typeGroups[0]?.key;

// DATA_FIXED_E (存储关联组件的 UUID)
value = attr.stringFix 
     ?? attr.string_fix 
     ?? '';
fixedSource = attr.fixedSource 
           ?? attr.fixed_source 
           ?? [];
```

### 6.2 深度嵌套搜索

```typescript
// deepFindAttributeValue: 穿透所有 DATA_COMBOX 层级
const search = (elements: SmartAttribute[]): any => {
  for (const e of elements) {
    // 直接匹配
    if (e.key === targetKey) return e.value;
    
    // 递归搜索嵌套 (arrayCmobEle)
    if (e.comboType?.typeGroups) {
      for (const group of e.comboType.typeGroups) {
        const res = search(group.arrayCmobEle || []);
        if (res !== undefined) return res;
      }
    }
  }
};
```

---

## 第七部分：导入导出规则对照

### 7.1 导入 (cmodel → Frontend)

```typescript
class ImportService {
  static parseCompDesc(json, schemaRegistry) {
    // 1. 提取模块结构 (generalAttr, structParam, privateAttr, interfaceParams)
    
    // 2. 构建唯一索引: moduleName → component.id
    const moduleNameToId = new Map();
    
    // 3. 识别驱动类型 → 确定期望的轮组数量
    const wheels = components.filter(c => c.category === 'DRIVEWHEEL');
    
    // 4. 拓扑还原: 属性关联 → parentNodeUuid 赋值
    //    - relateLeftMotor → 电机组件.parentNodeUuid = 轮组.id
    //    - Wiring Match → 驱动器.parentNodeUuid = 电机.id
    
    // 5. 属性构建: 使用 SchemaEngine.buildAttributesFromSchema(subType)
    //    确保模板匹配正确属性数量
    
    return { components, identity };
  }
}
```

### 7.2 导出 (Frontend → cmodel)

```typescript
// ExportService.ts (后端编码器对齐)
1. identity.chassisLength/Width/Height → chassis.shape.box
2. 组件 privateAttr → private_attrs (保留嵌套层级)
3. 接口 linkedInterfaceUuid → linked_interface_uuid (数组)
4. moduleName/module_desc 确保英文名称在前端正确存储
```

---

## 第八部分：关键约束与反模式

### 8.1 禁止事项

```typescript
// ❌ 禁止: 使用中文 alias/srcName 作为拓扑匹配键
const moduleKey = component.alias; // 中文重复率高，AOBO 8个电机同名

// ✅ 正确: 使用 module_name (英文唯一标识)
const moduleKey = component.generalAttr?.moduleName?.stringValue;

// ❌ 禁止: MOTOR 默认使用 'driver'/'subDriver' 类型
addComponent('MOTOR', 'driver'); // 会导致14属性缺失

// ✅ 正确: 强制重定向到 'PMSMMotor'
if (type === 'driver' || type === 'subDriver') subType = 'PMSMMotor';

// ❌ 禁止: STEER 驱动类型使用 diffWheel
driveType = 'SINGLE_STEER' → wheelType = 'diffWheel'; // 缺失舵轮角度属性

// ✅ 正确: STEER 类型强制使用 horizontalSteerWheel
driveType.includes('STEER') → subType = 'horizontalSteerWheel';
```

### 8.2 字段命名差异对照

| 前端 (camelCase) | 后端 (snake_case) | Proto | 说明 |
|-----------------|------------------|-------|------|
| stringValue | string_value | string_value | 字符串值 |
| doubleValue | double_value | double_value | 浮点值 |
| int32Value | int_32_value | int32_value | 整数值 |
| boolValue | bool_value | bool_value | 布尔值 |
| comboType | combo_type | combo_type | 组合类型 |
| typeGroups | type_groups | type_groups | 组合选项组 |
| arrayCmobEle | array_cmob_ele | array_cmob_ele | 嵌套元素 |
| privateAttrs | private_attrs | private_attrs | 私有属性组 |
| linkedInterfaceUuid | linked_interface_uuid | linked_interface_uuid | 连接接口ID |

---

## 附录：快速参考表

### A. 错误代码对照

| 报告类型 | 关键错误 | 修复位置 | 验证方法 |
|----------|---------|----------|----------|
| FIELD_LEVEL_VALIDATION | 驱动轮只有2属性 | useProjectStore.ts:262-266 | 导入后检查 wheelAttr.angleLmtPos |
| FIELD_LEVEL_VALIDATION | 电机属性不足 | useProjectStore.ts:264-273 | 检查 motorAttr.ENCType |
| IMPORT_DECONSTRUCTION | 关联丢失 | ImportService.ts deepFindAttributeValue | 检查 parentNodeUuid |
| SUBSYSTEM_CRITICAL | 子系统 desc=N/A | resource_adapter.py CATEGORY_TO_SUBSYS | 导出后检查 .cmodel 子系统描述 |

### B. 调试命令

```typescript
// 检查组件完整属性
console.log('[Debug]', component.privateAttrs.map(g => ({
  group: g.key,
  attrs: g.elements.map(e => ({ key: e.key, type: e.type, value: e.value }))
}));

// 验证拓扑连接
console.log('[Topology]', components.map(c => ({
  name: c.name,
  category: c.category,
  parent: c.parentNodeUuid,
  interfaces: c.interfaces.map(i => ({ uuid: i.interfaceUuid.slice(0,8), linked: i.linkedInterfaceUuid.length }))
})));
```

---

*文档基于 AMR Studio V4 代码库编译*
*核心参考: specifications/protocols/controller_model_comp_desc.proto*
*模板定义: specifications/ModuleLibrary/Aggregated/PrivateAttributes.xml*
