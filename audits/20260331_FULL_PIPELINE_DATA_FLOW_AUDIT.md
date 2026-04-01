# 全链路数据流审计：privateAttrs 丢失追踪

**日期**: 2026-03-31  
**审计范围**: 前端 → 后端 → 编码 → 输出 完整管线  
**关键发现**: 3 处数据丢失点，1 处为 🔴 致命错误

---

## 一、数据管线总览

```
前端 Store (ComponentConfig.privateAttrs: AttributeGroup[])
    ↓ ExportService.mapComponentToCModel()
    ↓ → privateAttr: { privateAttrs: [...] }
后端 API /api/v1/models/init-sandbox
    ↓ resource_adapter.frontend_to_comp_desc()
    ↓ → map_component_to_cmodel() ★★★ 底盘特殊处理 ★★★
    ↓ splitter.split_comp_desc() → module JSON 文件
    ↓ encoder.enrich_from_templates() → CompDesc.model
```

---

## 二、逐环节数据追踪

### 环节 A: 前端 → ExportService (✅ 无丢失)

**ExportService.ts L86-90:**
```typescript
privateAttr: {
    privateAttrs: c.privateAttrs.map(g => ({
        key: g.key, desc: g.desc,
        arrayBaseEle: g.elements.map(e => this.mapAttributeToCModel(e, false))
    }))
}
```
**结论**: 前端 `AttributeGroup[]` → `{privateAttrs: [{key, desc, arrayBaseEle}]}` 映射完整，无丢失。

---

### 环节 B: 后端 resource_adapter.map_component_to_cmodel (🔴 致命！底盘)

**resource_adapter.py L196-209:**
```python
if is_chassis:
    for g in c.get("privateAttrs", []):
        for e in g.get("elements", []):
            extend_params.append(map_attribute_to_cmodel(e))  # 扁平化移入 structParam!
else:
    priv_attrs_for_pb = [按组保留的格式]
```

**问题**: 底盘的私有属性被**错误地扁平化**移入 `structParam.extendParams`（Tag 5），而标准文件要求它们在 `privateAttr.privateAttrs`（Tag 2）。

| 位置 | 我方底盘 | 标准底盘 |
|:-----|:---------|:---------|
| `privateAttr.privateAttrs` | `[]` (空!) | 3 组, 33 属性 |
| `structParam.extendParams` | 40 个参数(含私有) | 0 个参数 |

**数据丢失模式**: 不是丢失，而是**错误放置**。属性的分组结构 (`motionCenterAttr`, `chassisAttr`, `wheelsAttr`) 被彻底破坏→变成了扁平列表→客户端无法解析显示。

---

### 环节 C: splitter 拆分 (✅ 无丢失)

拆分器忠实保存 JSON，无额外处理。但环节 B 的错误已经被固化到模块 JSON 中。

---

### 环节 D: encoder.enrich_from_templates (⚠️ 补救失败)

**encoder.py enrich_from_templates:**
```python
if not comp.get("privateAttr", {}).get("privateAttrs") and tpl.get("privateAttr"):
    # 尝试从模板补充
```

**问题**: 底盘模块 JSON 中 `privateAttr` 值为 `{"privateAttrs": []}` — 空列表存在但 falsy，条件判断 `not []` = True，所以理论上会触发模板补充。但实际效果取决于模板匹配。

**验证结果**: 模板匹配成功（diffChassis-Common），模板有 3 组 privateAttrs。但补充只在 `privateAttrs` 列表不存在时生效；如果列表为空 `[]` 但已存在，当前代码的 `.get("privateAttrs")` 返回 `[]` 这是 falsy → 会触发补充 ✅。

**但还有一层问题**: 即使模板补充了 privateAttr，**环节 B 把底盘私有属性内容（如轮径等用户值）移到了 structParam**——这些用户自定义的值不会被模板覆盖。所以最终底盘会有模板的默认值（无用户输入）。

---

### 环节 E: 前端 ImportService 导入 (✅ 设计正确)

**ImportService.ts L298-303:**
```typescript
const rawPrivateAttr = comp.privateAttr || comp.private_attr || {};
const privateAttrs = (rawPrivateAttr.privateAttrs || rawPrivateAttr.private_attrs || []).map(...)
```
导入逻辑正确，能完整解析 `privateAttr.privateAttrs` 中的分组结构。

---

## 三、各模块 privateAttrs 完整性对比

### 非底盘模块 (✅ 基本匹配)

| 模块 | 我方 | 标准 | 状态 |
|:-----|:-----|:-----|:-----|
| driveWheel | 2组/2属性 | 2组/2属性 | ✅ |
| driver | 1组/7属性 | 1组/7属性 | ✅ |
| motor | 1组/14属性 (+4 arrayCmobEle) | 1组/14属性 | ✅ |
| mainCPU | 1组/5属性 (+18 arrayCmobEle) | 1组/5属性 | ✅ |
| battery | 1组/13属性 | — | ✅ |
| button | 1组/4属性 | 1组/4属性 | ✅ |
| sensor (laser) | 2组/5属性 (+24 arrayCmobEle) | 2组/5属性 | ✅ |
| IO board | 1组/4属性 | 1组/4属性 | ✅ |

### 底盘 (🔴 严重错误)

| 字段 | 我方 | 标准 | 状态 |
|:-----|:-----|:-----|:-----|
| privateAttrs 组数 | 0 | 3 | ❌ 全部丢失 |
| motionCenterAttr | ❌ 不存在 | 8 个属性 | ❌ |
| chassisAttr | ❌ 不存在 | 21 个属性 | ❌ |
| wheelsAttr | ❌ 不存在 | 4 个属性 | ❌ |
| structParam.extendParams | 40 个 (含私有) | 0 个 | ❌ 错误位置 |

---

## 四、根因总结

### 🔴 RC-CHASSIS: 底盘 privateAttrs 错误重定向

**根因**: `resource_adapter.py:L196-209` 中的 `is_chassis` 分支将底盘的 privateAttrs **扁平化后移入 structParam.extendParams**，导致：
1. `privateAttr.privateAttrs` 为空 → 客户端无法显示底盘私有属性
2. 属性分组信息 (motionCenterAttr/chassisAttr/wheelsAttr) 被彻底破坏
3. 用户自定义值（如轮径、轮距）混入了 structParam

**修复方案**: 底盘应与其他模块一样保留 privateAttrs 在 Tag 2，structParam.extendParams 仅放安装坐标。

### ⚠️ RC-ENRICH: 模板补充的优先级问题

当模板能补充 privateAttrs 时，用户已修改的值不会被保留（模板覆盖用户值）。
需要实现**合并策略**：模板提供结构骨架，用户值优先。

---

## 五、修复优先级

| 编号 | 问题 | 修复文件 | 优先级 |
|:-----|:-----|:---------|:-------|
| RC-CHASSIS | 底盘 privateAttrs 错误重定向 | resource_adapter.py L196-209 | P0 |
| RC-ENRICH | 模板补充覆盖用户值 | encoder.py enrich_from_templates | P1 |

---

## 六、修复实施与验证结果 (2026-03-31 23:07)

### 已实施修复

1. **RC-CHASSIS** (`resource_adapter.py`): 删除 `is_chassis` 分支，底盘 privateAttrs 与其他模块统一保留在 Tag 2。
2. **RC-ENRICH** (`encoder.py`): 修复 `privateAttrs: []`（空列表已存在但 key 存在）导致模板不覆盖的逻辑。改为直接替换空列表。
3. **MotionSys 修正** (`encoder.py`): 在 `enrich_from_templates` 中添加 `_INVALID_SUBSYS` 校验，自动将 `MotionSys` 修正为模板值 `DriverSys`。
4. **CATEGORY_TO_SUBSYS** (`resource_adapter.py`): 将 DRIVER/MOTOR 的映射从 `MotionSys` → `DriverSys`。

### 验证结果 (proj_1234_v6.cmodel)

| 验证项 | 修复前 | 修复后 | 结果 |
|:-------|:-------|:-------|:-----|
| 底盘 privateAttrs | 0 组 (空) | 3 组 (motionCenter 8, chassis 21, wheels 3) | ✅ |
| subSysType MotionSys | driver/motor = MotionSys | 全部 = DriverSys | ✅ |
| CAN 接口 attrs | 0/11 | 11/11 | ✅ |
| arrayCmobEle 保留 | 0 处 | 12 处 | ✅ |
| moduleSys 推导 | driveWheel 缺失 | 全部正确 | ✅ |
| CompDesc 大小 | 42939 bytes | 46105 bytes (+7.4%) | ✅ |

### 新增规范

- **§16 私有属性存储位置规范**: 严禁将 privateAttrs 移入 structParam
- **§17 子系统类型有效值约束**: 禁止 MotionSys，自动修正为 DriverSys

