# P0 修复完成报告

**时间**: 2026-04-04  
**状态**: ✅ 已应用，等待重建验证

---

## 已应用的修复

### ✅ Fix 1: ExportService.ts
**文件**: `src/frontend/src/services/ExportService.ts`
**修改**: structParam.extendParams 添加 desc 字段

```typescript
// Before:
{ key: 'locCoordX', type: 'DATA_DOUBLE', doubleValue: c.mountX }

// After:
{ key: 'locCoordX', type: 'DATA_DOUBLE', doubleValue: c.mountX, desc: 'X坐标' }
// ... 同理应用到所有 7 个参数
```

**影响**: 解决 **问题2** (structParam 参数 desc 丢失)

---

### ✅ Fix 2: encoder.py - 问题4优化
**文件**: `src/backend/skills_v2/cmodel_encoder/encoder.py`
**修改**: 层级展平增强

```python
# 新增层级元数据捕获
def collect_groups_with_metadata(groups, depth=0, parent_name=""):
    """Collect groups while preserving hierarchy metadata"""
    ...

# 展平后附加元数据
for g in real_groups:
    if name in _original_depth_map:
        g['_originalDepth'] = _original_depth_map[name]
    if name in _original_parent_map:
        g['_originalParent'] = _original_parent_map[name]
```

**影响**: 优化 **问题4** (层级展平)，保留层级可追踪性

---

### ✅ Fix 3: resource_adapter.py
**文件**: `src/backend/core/resource_adapter.py`
**修改**: XML 模板 desc 回退填充

```python
# Deep merge 时保留 desc
if not curr_groups[g_key].get('desc') and new_group.get('desc'):
    curr_groups[g_key]['desc'] = new_group['desc']
```

**影响**: 解决 **问题2** (generalAttr 字段 desc 缺失)

---

## 待修复问题（继续执行）

| 问题 | 优先级 | 状态 | 下一步 |
|:-----|:-------|:-----|:-------|
| 问题1: 底盘尺寸不正确 | P0 | 🔧 需继续修复 | 检查 `c.shape` 来源 |
| 问题3: 轮组关系丢失 | P1 | ⏸️ 待调查 | Schema 对比分析 |
| 问题5: 电气连接丢失 | P1 | ⏸️ 待调查 | 检查 linkedInterfaceUuid |
| 问题6: 电机属性 | - | ✅ 已修复 | - |

---

## 问题1底盘尺寸 继续分析

当前状态：
- JSON: `moduleShape.box.sizeLen: 100` (❌)
- 期望: `sizeLen: 1200` (前端 Identity 输入)

**根因**: `c.shape` 

---

## 重建验证步骤

```bash
# 1. 重建前端
cd src/frontend
npm run build

# 2. 重启服务
# 后端自动重启 (已配置 --reload)

# 3. 删除现有模块
rm -rf src/backend/saved_projects/proj_12345/modules/*

# 4. 前端重新创建组件
# - 打开 http://localhost:3001
# - 创建新项目，使用 Identity Step 1 输入尺寸 1200/800/400
# - 添加底盘

# 5. 验证导出 JSON
cat src/backend/saved_projects/proj_XXX/modules/module_chassis*.json | grep -A5 moduleShape

# 6. 编码导出
curl http://localhost:8002/api/v1/models/export -X POST ...

# 7. 验证 cmodel
unzip -p proj_XXX_packed.cmodel CompDesc.model | protoc --decode_raw | grep sizeLen
```

---

## 下一步建议

继续修复 **问题1**: 需要检查前端 `ComponentConfig['shape']` 的来源和设置逻辑。
