# AMR Studio V4 - Hard Constraints

> ⚠️ **THIS IS A CONSTRAINT DOCUMENT** — Violations are BLOCKERS, not suggestions
>
> 违反以下约束将导致代码被拒绝合并

---

## §1 NO_HARDCODE — 禁止硬编码

### 国际定义
代码中**禁止使用任何魔法数字或魔法字符串**来处理业务数据。

### 禁止模式
```typescript
// ❌ FORBIDDEN — 硬编码值绕过 Schema
const subType = 'PMSMMotor';
const width = 800;
const offsets = { x: 600, y: 400 };

if (category === 'MOTOR' && type === 'driver') {
  return 'PMSMMotor'; // HARDCODED!
}
```

### 合规模式
```typescript
// ✅ REQUIRED — 从 Schema Registry 动态查询
const schemaRegistry = getState().schemaRegistry;
const subType = schemaRegistry.MOTOR?.[data.subModuleTypeKey]
  ?? Object.keys(schemaRegistry.MOTOR)[0]
  ?? 'PMSMMotor'; // 仅作为最终兜底

// ✅ REQUIRED — 从 Schema 获取默认值
const width = schema.shape?.width ?? schemaRegistry.__defaults__.width;
```

### 验证清单
- [ ] 代码中不存在 `= 'StringLiteral'` 形式的数据赋值
- [ ] 数字字面量仅用于数学运算或索引，不表示业务数据
- [ ] 所有默认值有明确的 schema.fallbackValues 来源

---

## §2 NO_PARTIAL_PARSE — 禁止部分解析

### 国际定义
**禁止使用选择性字段解析**——所有 Proto/Schema 定义的字段必须完整处理。

### 禁止模式
```typescript
// ❌ FORBIDDEN — 选择性解析导致数据丢失
interface ChassisIdentity {
  chassisLength: number;   // ✅ Parsed
  chassisWidth: number;    // ✅ Parsed
  // ❌ chassisHeight — MISSING!
  // ❌ tailOffset — MISSING!
  // ❌ rightOffset — MISSING!
  // ❌ maxAcceleration — MISSING!
}

// ❌ FORBIDDEN — 手工字段列表
const identity = {
  length: data.shape?.length || 1200,
  width: data.shape?.width || 800,
  // 遗漏 height 等字段
};
```

### 合规模式
```typescript
// ✅ REQUIRED — 基于字段注册表遍历
const ROBOT_IDENTITY_FIELDS = [
  { key: 'chassisLength', source: 'shape.length', required: true },
  { key: 'chassisWidth', source: 'shape.width', required: true },
  { key: 'chassisHeight', source: 'shape.height', required: true },
  { key: 'tailOffset', source: 'privateAttrs[tailOffset(Idle)]', required: true },
  { key: 'rightOffset', source: 'privateAttrs[rightOffset(Idle)]', required: true },
  { key: 'maxAcceleration', source: 'privateAttrs[maxAcceleration(Idle)]', required: true },
  // ... 所有字段必须列出
] as const;

// ✅ REQUIRED — 通用解析引擎
const parseAttributesFromSchema = (
  component: ComponentConfig,
  fieldRegistry: readonly { key: string; source: string; required?: boolean }[]
) => {
  const result: Record<string, any> = {};
  fieldRegistry.forEach(field => {
    const value = resolvePath(component, field.source);
    if (value === undefined && field.required) {
      throw new Error(`[PARSE] Required field "${field.key}" missing`);
    }
    result[field.key] = value;
  });
  return result;
};
```

### 验证清单
- [ ] 实现前查阅 Proto 定义中该 Message 的所有字段
- [ ] 使用字段列表遍历（forEach/map），禁止手写逐个字段赋值
- [ ] Array/COMBOX 类型完整处理嵌套结构
- [ ] Null/undefined 有明确的 fallback 策略

---

## §3 PROTO_FIRST — Schema 优先

### 国际定义
**任何数据操作前，必须先查阅 Proto/Schema 定义。**

### 工作流程（强制）
```
1. 需要解析/编码新数据结构
        ↓
2. 查阅 Proto 定义
   ├─ controller_model_comp_desc.proto
   ├─ controller_model_abi_desc.proto
   └─ controller_model_abi_set.proto
        ↓
3. 生成字段清单
   ├─ Required fields: [列出]
   ├─ Optional fields: [列出]
   └─ Nested/Repeated: [列出]
        ↓
4. 实现解析/编码逻辑
   ├─ MUST be schema-driven
   ├─ MUST handle ALL proto 字段
   └─ MUST NOT 手工硬编码
        ↓
5. 编写测试验证
   ├─ 每个 proto 字段都有解析/编码验证
   ├─ Null-handling 验证
   └─ Round-trip 完整性验证
```

### 关键 Proto Reference
```protobuf
// Message_BOX (controller_model_comp_desc.proto)
message Message_BOX {
  uint32 size_len = 1;    // ← MUST parse
  uint32 size_width = 2;  // ← MUST parse
  uint32 size_height = 3; // ← MUST parse (has been MISSING!)
}

// Message_Struct_Param
message Message_Struct_Param {
  repeated Message_Base_Element extend_params = 1;
  repeated Message_Base_Group_Element segmented_limits_params = 2;
}
```

---

## §4 NO_PARTIAL_EXPORT — 禁止部分导出

### 国际定义
**Export/编码阶段禁止使用选择性字段输出**——必须基于 SCHEMA 遍历所有字段。

### 禁止模式
```typescript
// ❌ FORBIDDEN — 手工列出导出字段
const exportData = {
  length: identity.chassisLength,
  width: identity.chassisWidth,
  // ❌ height — MISSING!
};
```

### 合规模式
```typescript
// ✅ REQUIRED — FIELD_REGISTRY 驱动
const FIELD_REGISTRY = [
  { protoKey: 'size_len', dataKey: 'chassisLength' },
  { protoKey: 'size_width', dataKey: 'chassisWidth' },
  { protoKey: 'size_height', dataKey: 'chassisHeight' },
  // ... 所有字段
] as const;

const marshalIdentity = (identity: RobotIdentity) => {
  const result: any = {};
  FIELD_REGISTRY.forEach(({ protoKey, dataKey }) => {
    result[protoKey] = identity[dataKey];
  });
  return result;
};

// ✅ REQUIRED — 完整性验证
const validateExport = (data: any, schema: ProtoMessage): boolean => {
  const exportedKeys = Object.keys(data);
  const schemaKeys = schema.fields.map(f => f.name);
  const missing = schemaKeys.filter(k => !exportedKeys.includes(k));
  if (missing.length > 0) {
    console.error(`[EXPORT] Missing fields: ${missing.join(', ')}`);
    return false;
  }
  return true;
};
```

---

## §5 COMBOX_ARRAY_HANDLING — COMBOX 数组处理规范

### 国际定义
**COMBOX/DATA_COMBOX 类型的属性包含嵌套的 selected group，必须完整处理。**

### 禁止模式
```typescript
// ❌ FORBIDDEN — 忽略 COMBOX 内部结构
const value = data.value; // 直接取值，丢失 arrayAttr 信息
```

### 合规模式
```typescript
// ✅ REQUIRED — COMBOX 类型完整映射
interface AbilityCommonAttr {
  key: string;
  defineCmd: string;           // COMBOX | DATA_COMBOX
  type: string;
  arrayCmobEle?: {             // ← COMBOX 内部数组
    groupName: string;
    code: string;
    selected: boolean;
    arrayAttr: ArrayElem[];    // ← 嵌套数组属性
  }[];
}

// ✅ REQUIRED — Array location detection
const extractArrayAttrLocation = (options: any[]): LocationGroup[] => {
  return options.flatMap(opt =>
    opt.arrayAttr?.map((ele: ArrayElem) => ({
      groupName: opt.name ?? '',
      code: ele.ownerAbility,
      selected: ele.selected,
      arrayCmobEle: [
        { groupName: opt.name, code: ele.ownerAbility, attr: ele }
      ]
    })) ?? []
  );
};
```

---

## 历史反面教材

### Case Study: ImportService.ts (2026-04-05)

**违规项**:
- ❌ §1 NO_HARDCODE — 使用 `|| 1200`, `|| 800` 等硬编码默认值
- ❌ §2 NO_PARTIAL_PARSE — 遗漏 `chassisHeight`, `tailOffset`, `rightOffset` 等字段
- ❌ §3 PROTO_FIRST — 未对照 `Message_Struct_Param` 完整字段列表
- ❌ §5 COMBOX_ARRAY_HANDLING — 未处理 Full Load 变体

**后果**: 数据丢失、导出文件不完整、CModel 格式不兼容

---

## 代码审查强制 Checklist

每当修改 Import/Export/解析/编码逻辑时，必须逐项检查：

```
□ §1 NO_HARDCODE   — 无魔法数字/字符串，所有值来自 schema
□ §2 NO_PARTIAL_PARSE — 使用字段注册表，非手工逐个字段
□ §3 PROTO_FIRST   — 查阅 Proto 定义，生成字段清单
□ §4 NO_PARTIAL_EXPORT — FIELD_REGISTRY 驱动导出
□ §5 COMBOX_ARRAY — COMBOX 嵌套结构完整处理
□ §6 VALIDATION    — 实现 validateExport() / validateImport()
□ §7 ROUND_TRIP    — 通过双向测试验证数据完整性
```

**未通过全部检查项的代码禁止合并**

---

**Enforced by**: Claude Code Guidelines
**Last Updated**: 2026-04-07
**Version**: 1.0
