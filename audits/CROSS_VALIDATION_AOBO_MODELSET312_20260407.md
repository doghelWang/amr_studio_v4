# 样本交叉验证报告 — AOBO vs ModelSet312

**日期**: 2026-04-07
**任务**: #37 修正底盘性能属性数据
**样本**: AOBO (base) 和 ModelSet312

---

## 📊 样本数据分析

### 检查范围
扫描了 `project_bases/` 中的多个 `.base.cmodel` 文件，提取了底盘性能字段。

### 发现的关键字段 (Key Names)

```typescript
// Idle 状态 - 无空格模式
'maxSpeed(Idle)': 800
'maxAcceleration(Idle)': 500
'maxDeceleration(Idle)': 400

// Full Load 状态 - 带空格模式  
'maxSpeed (Full Load)': 600      // 所有检查的样本都是 600
'maxAcceleration (Full Load)': 200
'maxDeceleration (Full Load)': 200

// Rotation 字段 (新发现)
'avoidRotMaxAngDec (Idle)': 200
'avoidRotMaxAngDec (Full Load)': 200
'rotateMaxAngAcceleration (Idle)': 200
'rotateMaxAngSpeed (Idle)': 100
'rotateMaxAngDeceleration (Idle)': 100  // 注意:不是 'deceleration'
'rotateMaxAngSpeed (Full Load)': 200
'rotateMaxAngAcceleration (Full Load)': 100
'rotateMaxAngDeceleration (Full Load)': 100
```

---

## 🔴 代码问题分析

### ImportService.ts 第 116-117 行

```typescript
identity.maxSpeed = Number(findVal('maxSpeed(Idle)')) || 0;
identity.maxSpeedFull = Number(findVal('maxSpeed (Full Load)')) || (identity.maxSpeed * ratios.maxSpeed);
```

### 潜在问题 1: Number() 转换陷阱

| 输入 | Number() 结果 | || 运算结果 | 最终值 |
|------|---------------|------------|---------|
| `1000` | `1000` | truthy | `1000` | ✅ 正确 |
| `undefined` | `NaN` | falsy | `1200 * 0.8 = 960` | ⚠️ 计算值 |
| `''` (空字符串) | `0` | falsy | `1200 * 0.8 = 960` | ⚠️ 计算值 |
| `null` | `0` | falsy | `1200 * 0.8 = 960` | ⚠️ 计算值 |

**关键发现**: 当 `findVal()` 返回 `undefined`（key 不存在）时，`Number(undefined)` = `NaN`，是 falsy 值，导致 fallback 到计算值。

### 潜在问题 2: Key 名称不匹配

代码查找的 key:
- `'maxSpeed(Idle)'` - 无空格 ✓
- `'maxSpeed (Full Load)'` - 有空格 ✓

但如果 AOBO 的 JSON 中使用不同格式（如 `maxSpeed(Full Load)` 或 `maxSpeed Full Load`），`findVal` 会找不到。

### 潜在问题 3: rotateMaxAngDeceleration 拼写

代码中使用: `rotateMaxAngDeceleration` (注意 'deceleration')
样本中实际: `rotateMaxAngDeceleration` (注意 'deceleration')

需要确认是否有拼写不一致。

---

## ✅ 验证完成的问题

1. **Key 名称格式确认**: 
   - Idle: `'maxSpeed(Idle)'` (无空格) ✓
   - Full Load: `'maxSpeed (Full Load)'` (有空格) ✓

2. **字段存在性确认**:
   - 所有检查的样本都包含 `maxSpeed (Full Load)` = 600
   - 不是 key 不存在，而是值为 600

3. **新发现的 Rotation 字段**:
   - `avoidRotMaxAngDec` (Idle/Full Load)
   - `rotateMaxAngDeceleration` (Idle/Full Load) - 注意拼写

---

## ⚠️ 待确认问题

用户指出 AOBO 模型中 `maxSpeedFull` 应为 1000，但显示 960。

**需要用户提供**:
1. AOBO 模型的具体 `.cmodel` 文件路径，以便我提取确切的 JSON
2. 确认问题是在 Import 阶段、Export 阶段、还是 UI 显示阶段
3. 期望的 1000 是来自：
   - JSON 文件中的明确值？
   - Schema 默认值？
   - 工程规格要求的计算值？

---

## 🔧 建议修复

基于 §1 NO_HARDCODE 和 §3 PROTO_FIRST:

```typescript
// ❌ 当前代码 (有问题)
identity.maxSpeedFull = Number(findVal('maxSpeed (Full Load)')) || (identity.maxSpeed * ratios.maxSpeed);

// ✅ 修复方案 1: 显式检查 undefined
const maxSpeedFullVal = findVal('maxSpeed (Full Load)');
identity.maxSpeedFull = maxSpeedFullVal !== undefined 
  ? Number(maxSpeedFullVal) 
  : (identity.maxSpeed * ratios.maxSpeed);

// ✅ 修复方案 2: NaN 安全处理
const parseNumber = (val: any, fallback: number): number => {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};
identity.maxSpeedFull = parseNumber(findVal('maxSpeed (Full Load)'), identity.maxSpeed * ratios.maxSpeed);
```

---

## 📋 下一步行动

1. **用户提供 AOBO 文件路径** → 提取确切 JSON 值
2. **修复 Number() 转换问题** → 显式处理 undefined/NaN
3. **添加缺失的 rotation Full Load 字段** → types.ts + ImportService.ts
4. **验证修复** → 测试 round-trip 完整性

---

**验证人**: Claude Code
**时间**: 2026-04-07
