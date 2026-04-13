# Task #40: 数据对比测试套件

> **目标**: 验证 Import → Modify → Export → Compare 的数据完整性

## 测试策略

### 1. 数据流完整性测试 (AbilityStep)
**验证**: Task #36 修复的 onUpdate 数据流正确性

```typescript
// Test: ability_dataflow_test.ts
describe('AbilityStep Data Flow', () => {
  it('should propagate nested COMBOX values to store', async () => {
    // Arrange: Mock store state with AOBO data
    const initialState = loadFromAOBO();
    
    // Act: Simulate nested attribute update
    const nestedValue = await updateNestedAttribute({
      funcType: 'navi',
      childKey: 'child1',
      // ...
    });
    
    // Assert: Store updated with complete path
    expect(store.getState().abilities.functionAbility[0].childFunction[0].attr[0].value)
      .toEqual(expectedValue);
  });
});
```

### 2. 字段完整性验证 (ExportService)
**验证**: Task #42 添加的 validateExport 机制

```typescript
// Test: export_validation_test.ts
describe('Export Validation', () => {
  it('should warn on missing required fields', () => {
    const incompleteIdentity = { maxSpeed: 1200 }; // Missing maxSpeedFull
    const warnings: string[] = [];
    
    validateExport(incompleteIdentity, warnings);
    
    expect(warnings).toContain('[EXPORT_MISSING] Required field "maxSpeedFull"');
  });
  
  it('should detect extra fields not in registry', () => {
    const extraFieldIdentity = { ...validIdentity, unknownField: 'x' };
    const warnings: string[] = [];
    
    validateExport(extraFieldIdentity, warnings);
    
    expect(warnings).toContain('[EXPORT_EXTRA] Field "unknownField" not in registry');
  });
});
```

### 3. 端到端 Round-Trip 测试
**验证**: AOBO 文件 Import → Export → Compare

```typescript
// Test: roundtrip_test.ts
describe('AOBO Round-Trip', () => {
  it('should preserve all identity fields', async () => {
    // Step 1: Import AOBO
    const original = await importCModel('~/Downloads/AOBO.cmodel555.cmodel');
    
    // Step 2: Export
    const exported = ExportService.exportToCModel(original);
    
    // Step 3: Compare critical fields
    expect(exported.maxSpeed).toEqual(1200);
    expect(exported.maxSpeedFull).toEqual(1000); // Not 960
    expect(exported.maxAccel).toEqual(500);
    expect(exported.maxAccelerationFull).toEqual(500);
    
    // Step 4: Re-import and verify
    const reimported = await ImportService.parseCompDesc(exported);
    expect(reimported.identity.maxSpeedFull).toEqual(1000);
  });
});
```

### 4. Full Load 比率计算测试
**验证**: Task #37 修复的比率配置

```typescript
// Test: fullload_ratio_test.ts
describe('Full Load Ratio', () => {
  it('should use ratio 1.0 when Full Load value missing', () => {
    const idle = 1200;
    const full = undefined;
    const syncMode = true;
    
    const result = getFullLoadValue(idle, full, syncMode, 1.0);
    
    expect(result).toEqual(1200); // Not 960
  });
  
  it('should use file value when available', () => {
    const idle = 1200;
    const full = 1000; // From AOBO
    const syncMode = false;
    
    const result = getFullLoadValue(idle, full, syncMode, 0.8);
    
    expect(result).toEqual(1000); // File value, not calculated
  });
});
```

## 测试文件结构

```
tests/
├── ability_dataflow_test.ts      # Task #36 验证
├── export_validation_test.ts     # Task #42 验证  
├── roundtrip_test.ts             # 端到端验证
├── fullload_ratio_test.ts        # Task #37 验证
└── test_data/
    └── aobo_sample.json          # AOBO 数据样本
```

## 运行方式

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- --grep "AOBO Round-Trip"

# 生成报告
npm test -- --reporter json > test_report.json
```

## 验收标准

| 测试项 | 预期结果 | 实际状态 |
|--------|----------|----------|
| 数据流完整性 | ✅ 通过 | ⏳ 待执行 |
| 字段完整性检查 | ✅ 通过 | ⏳ 待执行 |
| 往返一致性 | ✅ 通过 | ⏳ 待执行 |
| Full Load 比率 | ✅ 通过 | ⏳ 待执行 |

---

**下一步**: 执行测试并记录结果
