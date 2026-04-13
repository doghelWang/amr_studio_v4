# Task #37 诊断报告 — maxSpeedFull 显示 960 而非 1000

**时间**: 2026-04-07
**任务**: #37 修正底盘性能属性数据
**样本**: AOBO.cmodel555.cmodel

---

## 🎯 问题确认

### AOBO 文件分析

从 `~/Downloads/AOBO.cmodel555.cmodel` 提取的数据：

| 字段 | 文件中的值 |
|------|-----------|
| `maxSpeed(Idle)` | 1200 |
| `maxSpeed (Full Load)` | **1000** ✅ |
| actual ratio | 0.83 (工程定义) |
| calculated (0.8) | 960 ❌ |

**结论**: 文件数据正确，1000 被正确导入到 `identity.maxSpeedFull`。

---

## 🔴 根本原因定位

### 问题位置

**ChassisStep.tsx:25 & ChassisStep.tsx:218-223**

```tsx
// Line 25: 默认状态
const [syncFullLoad, setSyncFullLoad] = useState(true);

// Line 218-223: UI 显示逻辑
<Switch checked={syncFullLoad} onChange={setSyncFullLoad} />
...
<InputNumber 
  disabled={syncFullLoad} 
  value={syncFullLoad ? Math.round(identity.maxSpeed * 0.8) : identity.maxSpeedFull}
/>
```

### 行为分析

| 场景 | syncFullLoad | 显示值 | 数据源 |
|------|-------------|--------|--------|
| 首次打开（默认） | `true` | 960 | 计算值 `maxSpeed * 0.8` |
| 用户切换为"独立" | `false` | 1000 | 文件中的 `maxSpeedFull` |

**问题**: 用户首次打开工程时，看到 960（计算值），而非文件中的 1000。

---

## ✅ 违反的约束

### §1 NO_HARDCODE

```tsx
// ❌ 硬编码比率
Math.round(identity.maxSpeed * 0.8)
//    ^^^^^ 应该是动态配置而非硬编码
```

### §2 NO_PARTIAL_PARSE

虽然文件解析正确保存了 1000，但 UI 层没有完整显示，计算逻辑覆盖了导入值。

### §3 PROTO_FIRST

应该优先使用 Proto/Schema 定义（文件值），而非计算值。

---

## 🔧 修复方案

### 方案 A: 导入时自动检测 (推荐)

**逻辑**: Import 时检查文件值与计算值差异，如果差异超过阈值，自动设置 `syncFullLoad = false`。

```tsx
// ImportService.ts 增加
const calculateRatio = (idle: number, full: number) => full / idle;
const expectedRatio = 0.8;
const actualRatio = calculateRatio(identity.maxSpeed, identity.maxSpeedFull);

if (Math.abs(actualRatio - expectedRatio) > 0.05) {
  // 差异 > 5%，使用独立模式
  config.chassisSyncMode = 'INDEPENDENT';
}
```

### 方案 B: 初始化时同步状态

**逻辑**: ChassisStep.tsx 初始化时，`useEffect` 检查 `maxSpeedFull` 是否存在，自动设置 `syncFullLoad`。

```tsx
// ChassisStep.tsx
useEffect(() => {
  if (identity.maxSpeed !== undefined && identity.maxSpeedFull !== undefined) {
    const calculated = Math.round(identity.maxSpeed * 0.8);
    if (Math.abs(identity.maxSpeedFull - calculated) > 10) {
      setSyncFullLoad(false); // 自动切换为独立模式
    }
  }
}, [identity.maxSpeed, identity.maxSpeedFull]);
```

### 方案 C: 移除硬编码比率

**逻辑**: 使用 `PerformanceConfig.ts` 中的配置而不是硬编码 0.8。

```tsx
// ChassisStep.tsx
import { DEFAULT_FULL_LOAD_RATIOS } from '../../store/PerformanceConfig';

<InputNumber 
  value={syncFullLoad 
    ? Math.round(identity.maxSpeed * DEFAULT_FULL_LOAD_RATIOS.maxSpeed) 
    : identity.maxSpeedFull}
/>
```

---

## 🛠️ 实施计划

1. **立即修复**: 实施方案 B（UI 层自动检测）
2. **长期改进**: 实施方案 A（Import 层智能同步）
3. **代码规范**: 实施方案 C（移除硬编码 0.8）

---

## 📋 验证清单

- [ ] 导入 AOBO 文件后 UI 显示 1000 而非 960
- [ ] 切换 syncFullLoad 开关行为正确
- [ ] ModelSet312 (600) 行为正确
- [ ] Export 后值保持不变

---

**诊断人**: Claude Code
**状态**: 已完成诊断，等待用户选择修复方案
