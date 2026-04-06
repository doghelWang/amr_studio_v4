# AMR Studio V4 - AI Assistant Guidelines (CLAUDE.md)

## Development Ethics & Hard Constraints

### 1.0 Absolute Prohibitions

| Rule | Severity | Enforcement |
|------|----------|-------------|
| **NO_HARDCODE** | CRITICAL | 禁止直接使用硬编码值处理数据 |
| **NO_PARTIAL_PARSE** | CRITICAL | 禁止解析数据结构时选择性忽略字段 |
| **PROTO_FIRST** | CRITICAL | 所有数据操作必须基于 Proto Schema |

---

## 1.1 NO_HARDCODE Rule (数据硬编码禁令)

### ❌ Prohibited Patterns

```typescript
// Example of FORBIDDEN hardcoding (反面案例)
if (category === 'MOTOR' && type === 'driver') {
  subType = 'PMSMMotor'; // ❌ HARDCODED! Violation of schema-driven design
}

// Why this is wrong: 硬编码绕过了从 Schema 动态查询，当添加新 motor 类型时
// 代码会错误地强制转换，导致数据丢失或类型错误
```

### ✅ Correct Pattern

```typescript
// 从 Schema Registry 动态查询可用类型
const getSubTypeForCategory = (category: string, defaultType: string): string => {
  const schemaRegistry = getState().schemaRegistry;
  const availableTypes = Object.keys(schemaRegistry[category] || {});
  
  // 如果 defaultType 在 schema 中合法，使用它；否则选择第一个合法类型
  if (availableTypes.includes(defaultType)) return defaultType;
  return availableTypes[0] || defaultType;
};
```

### Verification Checklist

```typescript
// Code Review Question: 这段代码是否包含硬编码？
if (line.includes("= 'PMSMMotor'") || 
    line.includes("|| 1200") || 
    line.includes("|| 800") ||
    line.includes("|| 600") ||
    line.includes("|| 400")) {
  // MUST verify these defaults come from schema, not hardcoded
  throw new Error("[HARDCODE] Values must come from schema defaults");
}
```

---

## 1.2 NO_PARTIAL_PARSE Rule (数据解析完整性禁令)

### ❌ Prohibited Patterns

```typescript
// Example of FORBIDDEN partial parse (反面案例)
if (chassis) {
  identity.chassisLength = chassis.shape?.length || 1200;  // OK
  identity.chassisWidth = chassis.shape?.width || 800;     // OK
  // ❌ MISSING: height, diameter, density, material...
  
  identity.headOffset = Number(findVal('headOffset(Idle)')) || 600;  // OK
  identity.leftOffset = Number(findVal('leftOffset(Idle)')) || 400;   // OK
  // ❌ MISSING: tailOffset, rightOffset, Full Load variants...
  // ❌ MISSING: maxAcceleration, maxDeceleration, avoidMaxDec, rotateMaxAngSpeed...
}

// Why this is wrong: 当后端 Model Desc 包含完整数据时，前端因选择性解析
// 导致数据丢失，违反"无损解析"原则
```

### ✅ Correct Pattern

```typescript
// §P3.1: 基于 Proto Schema 完整解析所有字段
interface ChassisIdentity {
  // Shape (from Message_BOX / Message_CYLINDER)
  chassisLength: number;
  chassisWidth: number;
  chassisHeight: number;  // ✅ 从 schema.box.size_height 解析
  chassisDensity?: number; // ✅ 如果 proto 中有定义

  // Motion Center Offsets (Idle)
  headOffset: number;    // ✅ from headOffset(Idle)
  tailOffset: number;    // ✅ from tailOffset(Idle)
  leftOffset: number;    // ✅ from leftOffset(Idle)
  rightOffset: number;  // ✅ from rightOffset(Idle)

  // Motion Center Offsets (Full Load) - §P3 Compliance
  headOffsetFull: number;
  tailOffsetFull: number;
  leftOffsetFull: number;
  rightOffsetFull: number;

  // Performance - Idle State
  maxSpeed: number;              // ✅ from maxSpeed(Idle)
  maxAccel: number;              // ✅ from maxAcceleration(Idle)
  maxDecel: number;              // ✅ from maxDeceleration(Idle)
  avoidMaxDec: number;           // ✅ from avoidMaxDec (Idle)
  rotateMaxAngSpeed: number;     // ✅ from rotateMaxAngSpeed (Idle)
  rotateMaxAngAcceleration: number; // ✅ from rotateMaxAngAcceleration (Idle)

  // Performance - Full Load State (§P3 Compliance)
  maxSpeedFull: number;
  maxAccelFull: number;
  maxDecelFull: number;
  avoidMaxDecFull: number;
}

// §P3.2: 使用属性清单驱动解析（基于 Proto 字段生成）
const CHASSIS_ATTRIBUTES = [
  // Shape - from Message_BOX (proto lines 96-100)
  { key: 'length', source: 'shape.length', required: true },
  { key: 'width', source: 'shape.width', required: true },
  { key: 'height', source: 'shape.height', required: true },
  
  // Offsets - Idle State
  { key: 'headOffset', source: 'privateAttrs[headOffset(Idle)]', fallback: 'schema.default.headOffset' },
  { key: 'tailOffset', source: 'privateAttrs[tailOffset(Idle)]', fallback: 'schema.default.tailOffset' },
  { key: 'leftOffset', source: 'privateAttrs[leftOffset(Idle)]', fallback: 'schema.default.leftOffset' },
  { key: 'rightOffset', source: 'privateAttrs[rightOffset(Idle)]', fallback: 'schema.default.rightOffset' },
  
  // Performance - ALL variants must be parsed
  { key: 'maxSpeed', source: 'privateAttrs[maxSpeed(Idle)]', required: true },
  { key: 'maxAcceleration', source: 'privateAttrs[maxAcceleration(Idle)]', required: true },
  { key: 'maxDeceleration', source: 'privateAttrs[maxDeceleration(Idle)]', required: true },
  { key: 'avoidMaxDec', source: 'privateAttrs[avoidMaxDec (Idle)]', required: true },
  { key: 'rotateMaxAngSpeed', source: 'privateAttrs[rotateMaxAngSpeed (Idle)]', required: true },
  { key: 'rotateMaxAngAcceleration', source: 'privateAttrs[rotateMaxAngAcceleration (Idle)]', required: true },
  
  // Full Load variants (required by §P3)
  { key: 'maxSpeedFull', source: 'privateAttrs[maxSpeed (Full Load)]', fallback: 'idle * 0.8' },
  { key: 'maxAccelerationFull', source: 'privateAttrs[maxAcceleration (Full Load)]', fallback: 'idle * 0.4' },
  { key: 'maxDecelerationFull', source: 'privateAttrs[maxDeceleration (Full Load)]', fallback: 'idle * 0.5' },
  { key: 'avoidMaxDecFull', source: 'privateAttrs[avoidMaxDec (Full Load)]', fallback: 'idle' },
];

// §P3.3: 通用属性解析引擎（拒绝手写逐个字段）
const parseAttributesFromSchema = (
  component: ComponentConfig,
  attributeList: { key: string; source: string; required?: boolean; fallback?: string }[]
): Record<string, any> => {
  const result: Record<string, any> = {};
  
  attributeList.forEach(attr => {
    const value = resolvePath(component, attr.source);
    
    if (value !== undefined) {
      result[attr.key] = value;
    } else if (attr.required) {
      throw new Error(`[PARSE] Required attribute "${attr.key}" missing at ${attr.source}`);
    } else if (attr.fallback) {
      result[attr.key] = evaluateFallback(attr.fallback, result);
    }
  });
  
  return result;
};
```

---

## 1.3 PROTO_FIRST Rule (Proto Schema 优先)

### Principle
**任何数据操作前，必须先查阅 Proto 定义。**

### Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 需要解析/编码新数据结构                                      │
├─────────────────────────────────────────────────────────────┤
│    ▼                                                          │
│ 2. 查阅 Proto 定义                                             │
│    - controller_model_comp_desc.proto                         │
│    - controller_model_abi_desc.proto                          │
│    - controller_model_abi_set.proto                           │
├─────────────────────────────────────────────────────────────┤
│    ▼                                                          │
│ 3. 生成字段清单                                               │
│    - Required fields: ______                                  │
│    - Optional fields: ______                                  │
│    - Nested messages: ______                                  │
├─────────────────────────────────────────────────────────────┤
│    ▼                                                          │
│ 4. 实现解析/编码逻辑                                           │
│    - 必须是 schema-driven，不能 hardcode                      │
│    - 必须处理所有 proto 中定义的字段                           │
├─────────────────────────────────────────────────────────────┤
│    ▼                                                          │
│ 5. 编写测试验证                                               │
│    - 确保每个 proto 字段都有对应的解析/编码                      │
│    - 验证 null-handling 和 fallback                           │
└─────────────────────────────────────────────────────────────┘
```

### Proto Reference

```protobuf
// controller_model_comp_desc.proto - Key Messages
message Message_Module_General_Attribute {
  Message_Module_Shape module_shape = 13;  // Shape with BOX/CYLINDER
  repeated Message_Base_Element extend_params = 20;  // Extended data
}

message Message_BOX {
  uint32 size_len = 1;      // ← Must parse
  uint32 size_width = 2;    // ← Must parse
  uint32 size_height = 3; // ← Was MISSING in ImportService.ts
}

message Message_Struct_Param {
  repeated Message_Base_Element extend_params = 1;  // Mounting coordinates
  repeated Message_Base_Group_Element segmented_limits_params = 2;  // Performance limits
}
```

---

## 1.4 Historical Lessons (历史反面案例)

### Case Study: ImportService.ts (2026-04-05)

**问题描述**: 从 Model Desc 文件解析底盘性能属性时，只解析了 `headOffset`, `leftOffset`, `maxSpeed` 等几个字段。**遗漏的字段**: `chassisHeight`, `tailOffset`, `rightOffset`, `maxAcceleration`, `maxDeceleration`, `avoidMaxDec`, `rotateMaxAngSpeed`, `rotateMaxAngAcceleration`, 以及所有的 Full Load 变体。

**代码审查失败点**:
1. ❌ 没有对照 Proto 中的 `Message_Struct_Param` 字段清单
2. ❌ 手写字段解析而非基于 schema 生成
3. ❌ Code Review 时未使用完整性检查清单

**修复方案**: 
- 使用 `buildAttributesFromSchema(subType)` 从 XML Schema 动态生成属性结构
- ImportService 中基于 `RobotIdentity` 类型清单遍历而不是手写字段

---

## 1.5 Code Review Checklist

每当修改数据解析/编码逻辑时，必须完成以下检查：

```
□ 是否检查了 Proto 定义中该 message 的所有字段？
□ 是否有任何硬编码值（magic numbers/strings）？
  □ 默认值是否来自 schema.fallbackValues？
  □ 类型判断是否来自 schemaRegistry？
□ 是否处理了所有 Required 字段？
□ 是否处理了所有 Optional 字段（有 fallback 或 null-handling）？
□ 是否处理了 Nested/Repeated 结构？
□ 是否处理了 COMBOX 类型的 selected group？
□ 是否验证了解析后的数据完整性？
```

---

## 2.0 Model Encoding Guidelines

### SubType Assignment Rule

从 Schema 查询合法类型，禁止硬编码：

```typescript
const getValidSubTypes = (category: MainModuleType): string[] => {
  return Object.keys(schemaRegistry[category] || {});
};

// ✅ VALID: 从 Schema 查询
const subType = getValidSubTypes('MOTOR').includes(data.subModuleTypeKey)
  ? data.subModuleTypeKey
  : getValidSubTypes('MOTOR')[0] || 'PMSMMotor'; // 最后才使用硬编码兜底

// ❌ INVALID: 直接硬编码 (反面案例)
const subType = 'PMSMMotor'; // This is a HARDCODE violation
```

---

**Enforced by**: Claude Code Guidelines
**Last Updated**: 2026-04-05
**Version**: 1.0
