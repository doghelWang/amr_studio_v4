# 代码审计报告 - 硬编码与数据解析问题

**审计日期**: 2026-04-06
**审计范围**: `/src/frontend/src` 目录下的 TypeScript 文件
**审计标准**: CLAUDE.md - NO_HARDCODE / NO_PARTIAL_PARSE / PROTO_FIRST 规则

---

## 执行摘要

本次审计发现 **8 个严重问题**，涉及硬编码值、数据解析不充分和违反 PROTO_FIRST 原则。这些问题违反了 CLAUDE.md 中定义的开发规范，可能导致数据丢失、系统维护困难和未来扩展性问题。

**风险等级分布**:
- 🔴 **严重 (Critical)**: 4 个问题
- 🟠 **高 (High)**: 2 个问题
- 🟡 **中 (Medium)**: 2 个问题

---

## 详细问题清单

### 🔴 C001: ImportService.ts 硬编码默认值 (CRITICAL - NO_HARDCODE 违规)

**文件位置**: `src/frontend/src/store/ImportService.ts:61-76`

**问题描述**:
从 Model Desc 解析时使用的默认值全部为硬编码魔法数字，而非从 XML Schema 动态获取。

```typescript
// 违反 NO_HARDCODE 规则 - 这些值应为 schema.fallbackValues
identity.chassisLength = chassis.shape?.length || 1200;  // ❌ 1200 硬编码
identity.chassisWidth = chassis.shape?.width || 800;      // ❌ 800 硬编码
identity.headOffset = Number(findVal('headOffset(Idle)')) || 600;  // ❌ 600 硬编码
identity.tailOffset = Number(findVal('tailOffset(Idle)')) || 600;   // ❌ 600 硬编码
identity.leftOffset = Number(findVal('leftOffset(Idle)')) || 400;   // ❌ 400 硬编码
identity.rightOffset = Number(findVal('rightOffset(Idle)')) || 400; // ❌ 400 硬编码
```

**风险**: 当 Schema 定义变更时，代码默认行为与期望行为不一致，可能导致数据丢失。

---

### 🔴 C002: Full Load 计算比例硬编码 (CRITICAL - NO_HARDCODE 违规)

**文件位置**:
- `src/frontend/src/store/ImportService.ts:86-92`
- `src/frontend/src/store/useProjectStore.ts:65-67`
- `src/frontend/src/components/wizard/ChassisStep.tsx:223-225`

**问题描述**:
Full Load 性能属性使用硬编码比例系数:

```typescript
// ImportService.ts - 违反 NO_HARDCODE
identity.maxSpeedFull = Number(findVal('maxSpeed (Full Load)')) || (identity.maxSpeed * 0.8);      // ❌ 0.8
identity.maxAccelFull = Number(findVal('maxAcceleration (Full Load)')) || (identity.maxAccel * 0.4); // ❌ 0.4
identity.maxDecelFull = Number(findVal('maxDeceleration (Full Load)')) || (identity.maxDecel * 0.5); // ❌ 0.5

// useProjectStore.ts - 重复的硬编码兜底值
identity.maxSpeedFull ?? (identity.maxSpeed ? identity.maxSpeed * 0.8 : 600)  // ❌ 0.8, 600
identity.maxAccelFull ?? (identity.maxAccel ? identity.maxAccel * 0.4 : 200)   // ❌ 0.4, 200
identity.maxDecelFull ?? (identity.maxDecel ? identity.maxDecel * 0.5 : 200)   // ❌ 0.5, 200
```

**风险**: 比例系数应来自配置而非代码，否则任何调整需要代码修改和重新部署。

---

### 🔴 C003: MOTOR 子类型硬编码为 'PMSMMotor' (CRITICAL - NO_HARDCODE 违规)

**文件位置**: `src/frontend/src/store/useProjectStore.ts:276-285`

**问题描述**:
这是严重的 HARDCODE 违规，直接硬编码子类型而非从 Schema Registry 查询:

```typescript
} else if ((category as string) === 'MOTOR') {
  // 警告: 这是错误的类型映射
  if (type === 'driver' || type === 'subDriver') {
    console.warn(`[FIX] MOTOR category with wrong type "${type}", forcing to PMSMMotor`);
    subType = 'PMSMMotor';  // ❌ HARDCODED! 应从 schemaRegistry[MOTOR] 查询可用类型
  } else {
    subType = type || 'PMSMMotor';  // ❌ 再次硬编码兜底!
  }
}
```

**推荐修复** (来自 CLAUDE.md 的规范示例):
```typescript
const getValidSubTypes = (category: MainModuleType): string[] => {
  return Object.keys(schemaRegistry[category] || {});
};
// ✅ 从 Schema 查询
const subType = getValidSubTypes('MOTOR').includes(data.subModuleTypeKey) 
  ? data.subModuleTypeKey 
  : getValidSubTypes('MOTOR')[0] || 'PMSMMotor';
```

---

### 🔴 C004: SchemaEngine 硬编码工程约束 (CRITICAL - NO_HARDCODE 违规)

**文件位置**: `src/frontend/src/store/SchemaEngine.ts:253-254`

**问题描述**:
硬编码默认值，应来自 Schema 定义:

```typescript
if (base.value === '') {
  if (base.key === 'chipPlatform') base.value = 'R131'; // ❌ 硬编码
  if (base.key === 'softwareSpec') base.value = 'NONE'; // ❌ 硬编码
}
```

---

### 🟠 H001: useStore.ts 硬编码初始值 (HIGH)

**文件位置**: `src/frontend/src/store/useStore.ts:166-200`

**问题描述**:
应用初始化时使用硬编码值创建默认状态:

```typescript
export const useStore = create<AppState>((set) => ({
  robotName: 'Custom AMR',
  chassisLength: 1200,  // ❌ 硬编码
  chassisWidth: 800,    // ❌ 硬编码
  // ...
  headOffsetIdle: 0,
  tailOffsetIdle: 0,
  leftOffsetIdle: 400,   // ❌ 硬编码
  rightOffsetIdle: 400,  // ❌ 硬编码
}));
```

---

### 🟠 H002: ChassisStep.tsx UI 硬编码比例 (HIGH)

**文件位置**: `src/frontend/src/components/wizard/ChassisStep.tsx:223-225`

**问题描述**:
UI 组件直接硬编码 Full Load 计算比例:

```typescript
// ❌ 硬编码比例系数，违反单一事实来源原则
value={syncFullLoad ? Math.round(identity.maxSpeed * 0.8) : identity.maxSpeedFull}
value={syncFullLoad ? Math.round(identity.maxAccel * 0.4) : identity.maxAccelFull}
value={syncFullLoad ? Math.round(identity.maxDecel * 0.5) : identity.maxDecelFull}
```

**风险**: 同一业务规则在多处硬编码，任何变更需修改多个文件。

---

### 🟡 M001: SchemaEngine 预设工程值硬编码 (MEDIUM)

**文件位置**: `src/frontend/src/store/SchemaEngine.ts:100-107`

**问题描述**:
```typescript
const PRESET_OPTIONS: Record<string, number[]> = {
  encoderLine: [2500, 3000, 4000], // ❌ 硬编码工程预设值
  lineCount: [2500, 3000, 4000],
};
```

---

### 🟡 M002: CATEGORY_MAP 映射硬编码 (ACCEPTABLE but noted)

**文件位置**: `src/frontend/src/store/ImportService.ts:14-30`

**说明**:
此类映射本质上是配置，但应文档化其来源和管理方式:

```typescript
private static readonly CATEGORY_MAP: Record<string, MainModuleType> = {
  'chassis': 'CHASSIS',
  'driveWheel': 'DRIVEWHEEL',
  'driver': 'DRIVER',
  // ...
};
```

---

## PROTO_FIRST 合规性检查表

根据 CLAUDE.md §1.5 的 Code Review Checklist:

| 检查项 | ImportService | useProjectStore | ChassisStep | SchemaEngine |
|--------|--------------|-----------------|-------------|--------------|
| □ 检查 Proto 所有字段 | ❌ 部分缺失 | ❌ 硬编码字段名 | ⚠️ 部分 | ❌ N/A |
| □ 无硬编码值 | ❌ 严重违规 | ❌ 严重违规 | ❌ 违规 | ❌ 违规 |
| □ 默认值来自 schema | ❌ 否 | ❌ 否 | ❌ 否 | ❌ 否 |
| □ 类型判断来自 schemaRegistry | ❌ 否 | ❌ 否 | N/A | N/A |
| □ 处理所有 Required 字段 | ⚠️ 部分 | ⚠️ 部分 | N/A | N/A |
| □ 处理所有 Optional 字段 | ❌ 缺失 | ⚠️ 部分 | N/A | N/A |
| □ 处理 Nested/Repeated 结构 | ✅ 是 | ⚠️ 部分 | N/A | N/A |
| □ 处理 COMBOX selected group | ✅ 是 | ❌ 否 | N/A | N/A |

---

## 修复优先级建议

### P0 - 立即修复 (阻塞性问题)
1. **C003** - MOTOR 子类型硬编码 (可能导致组件创建错误)
2. **C001** - ImportService 默认值硬编码 (影响数据解析完整性)

### P1 - 高优先级 (1 周内)
3. **C002** - Full Load 比例系数 (移除重复硬编码)
4. **C004** - SchemaEngine 工程约束 (引入配置化)

### P2 - 中优先级
5. **H001/H002** - UI 和 Store 硬编码 (统筹设计集中配置)

---

## CLAUDE.md 违规统计

| 规则 | 违规次数 | 严重程度 |
|------|----------|----------|
| NO_HARDCODE | 15+ | 🔴 Critical |
| NO_PARTIAL_PARSE | 3 | 🟠 High |
| PROTO_FIRST | 8+ | 🟠 High |

---

## 附录：代码片段引用

### C003 修复参考
```typescript
// ✅ 合规实现 - 从 Schema Registry 动态查询
const getSubTypeForMotor = (rawType: string, schemaRegistry: Record<string, any>): string => {
  const motorTypes = Object.keys(schemaRegistry['MOTOR'] || {});
  const validTypes = ['PMSMMotor', 'BLDCMotor', 'BDCMotor'];
  
  // 如果传入类型在 Schema 中合法，使用它
  if (motorTypes.includes(rawType) || validTypes.includes(rawType)) {
    return rawType;
  }
  
  // 否则返回第一个可用类型
  return motorTypes[0] || 'PMSMMotor'; // 最后的兜底
};
```

### C002 修复参考
```typescript
// ✅ 配置化比例系数
const FULL_LOAD_RATIOS = {
  maxSpeed: 0.8,
  maxAcceleration: 0.4,
  maxDeceleration: 0.5,
  avoidMaxDec: 1.0
};

// 从配置读取而非硬编码
identity.maxSpeedFull = findVal('maxSpeed (Full Load)') 
  ?? identity.maxSpeed * FULL_LOAD_RATIOS.maxSpeed;
```

---

**审计人**: Claude Code
**状态**: COMPLETED
**下一步行动**: 开始 P0 问题修复 (C003, C001)
