# Task #36 验证流程 — AOBO.cmodel555.cmodel 数据流测试

## 📋 测试目标
使用 AOBO 模型验证 AbilityStep 的数据流完整性

## 🔧 测试文件
- **来源**: `~/Downloads/AOBO.cmodel555.cmodel`
- **底盘**: chassis_steer (舵轮底盘)
- **性能数据**: maxSpeed(Idle)=1200, maxSpeed (Full Load)=1000

## 🧪 验证步骤

### 步骤 1: 文件导入测试
```
1. 启动前端服务 (npm run dev)
2. 导入 AOBO.cmodel555.cmodel
3. 进入 Step 6 (Ability Step)
4. 记录页面初始状态
```

### 步骤 2: 数据流完整性检查 (COMBOX)
```
1. 找到导航能力 (navi) 下的 COMBOX 类型属性
2. 展开下拉框，选择不同选项
3. 在 Console 中检查 updateAbilityAttribute 调用:
   - 预期: 完整路径 (funcType, childKey, commonKey, attrKey, value)
   - 实际: 观察调用参数
4. 检查 COMBOX 内嵌 arrayAttr 的属性更新:
   - 预期: value 向上冒泡到 store
   - 实际: 观察 store 中的 final state
```

### 步骤 3: 深层属性更新测试
```
1. 找到一个有嵌套 arrayCmobEle 的属性
2. 修改内层子属性的值
3. 观察是否触发 store 更新
4. 检查整个 object 是否被替换（破坏性更新 vs 部分更新）
```

### 步骤 4: 验证清单

| 检查项 | 预期行为 | 实际结果 | 状态 |
|--------|----------|----------|------|
| onUpdate 调用 | 参数顺序正确 |  | ⏳ |
| store 更新 | 数据持久化 |  | ⏳ |
| 数据源 | 来自文件而非计算 |  | ⏳ |
| 嵌套更新 | 完整对象更新 |  | ⏳ |

## 🔴 已知问题预览

### 问题 1: onUpdate 签名不匹配
```tsx
// 当前代码 (Line 115)
onUpdate={(v) => onUpdate(attr.value, sub.key, v)}

// 期望调用
handleAttributeUpdate(funcType, childKey, commonKey, ap.key, val, sub, subVal)
```

**风险**: 深层属性更新可能失败

### 问题 2: detectArrayLocation 未定义
```tsx
// Line 247-248
extractArrayAttrLocation(options));
// 内部两次调用 detectArrayLocation，但未定义
```

**风险**: 运行时错误或重复计算

### 问题 3: (attr as any).type (Line 89)
**风险**: 失去类型安全

## 📝 修复后验证

修复完成后重新执行步骤 1-4，确认：
- [ ] onUpdate 签名修复后深层属性更新成功
- [ ] detectArrayLocation 修复后无重复调用
- [ ] 类型定义修复后无 `any` 转换

---

**测试文件**: ~/Downloads/AOBO.cmodel555.cmodel
**版本**: 2026-04-07
