# P0-2 驱动轮模板默认值修复归档

## 目标分析
修复 DRIVEWHEEL 组件默认模板选择逻辑，使其在 STEER 驱动类型下自动选择 `horizontalSteerWheel`（7属性）而非 `diffWheel`（2属性），解决舵轮属性缺失问题。

## 问题详细分析

### 属性差异对比
| 模板 | 属性数量 | 关键属性 |
|------|----------|----------|
| diffWheel | 2 | wheelRadius, relateMotor |
| horizontalSteerWheel | 7 | wheelRadius, angleLmtPos, angleLmtNeg, rotOmgLmt, angleSensorType, relateRotMotor, relateWalkMotor |

### 问题症状
在 FIELD_LEVEL_VALIDATION_REPORT_20260404.md 中标识的严重缺失：
- ❌ angleSensor/angleSensorType (DATA_COMBOX)
- ❌ linkMotorAttr/relateRotMotor (DATA_FIXED_E)
- ❌ linkMotorAttr/relateWalkMotor (DATA_FIXED_E)
- ❌ wheelAttr/angleLmtNeg (DATA_DOUBLE)
- ❌ wheelAttr/angleLmtPos (DATA_DOUBLE)
- ❌ wheelAttr/rotOmgLmt (DATA_DOUBLE)

### 根因
原代码 `subType = type || 'diffWheel'` 对所有驱动类型默认使用 diffWheel，未考虑 STEER 类型轮组需要完整的舵轮属性。

## 解决方案

### 代码位置
**文件**: `src/frontend/src/store/useProjectStore.ts:258-275`

### 修复逻辑
```typescript
// Before:
subType = type || 'diffWheel';

// After:
// [P0-FIX-2026-04-04] Smart subType selection based on drive type
if (type) {
  subType = type;  // Use explicit type if provided
} else {
  // Auto-detect: STEER drive types need horizontalSteerWheel (7 attributes)
  // diffWheel only has 2 attributes (wheelRadius, relateMotor)
  subType = state.config.identity.driveType?.includes('STEER')
    ? 'horizontalSteerWheel'
    : 'diffWheel';
}
```

## 执行验证

### 验证逻辑
1. **向后兼容**: 显式传入 type 参数时仍使用该类型（`if (type) { subType = type; }`）
2. **自动检测**: 根据 identity.driveType 智能判断
   - 包含 'STEER' → horizontalSteerWheel（支持舵轮角度控制）
   - 其他（STANDARD_DIFF）→ diffWheel（保持原有行为）
3. **属性完整**: horizontalSteerWheel 模板提供完整的 7 个属性

### 关联驱动类型映射
| driveType | 自动选择模板 |
|-----------|-------------|
| STANDARD_DIFF | diffWheel (2属性) |
| SINGLE_STEER | horizontalSteerWheel (7属性) |
| DUAL_STEER | horizontalSteerWheel (7属性) |
| QUAD_STEER | horizontalSteerWheel (7属性) |

## 代码状态
- ✅ 已提交至 git: `src/frontend/src/store/useProjectStore.ts`
- ✅ 向后兼容保证
- ⚠️ 需配合 PrivateAttributes.xml 模板文件存在

---
**修复日期**: 2026-04-04
**修复人**: Claude Code
**对应问题**: FIELD_LEVEL_VALIDATION_REPORT_20260404.md - 驱动轮属性缺失
