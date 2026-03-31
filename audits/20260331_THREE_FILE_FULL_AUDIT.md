# CModel 三文件全链路审计报告 (CompDesc + AbiSet + FuncDesc)

**日期**: 2026-03-31  
**审计基准**: `ModelSet312.cmodel` (标准参考文件)  
**审计对象**: `proj_1234` 编码输出

---

## 〇、概览

| 文件 | Proto 定义 | 标准大小 | 我方大小 | 构建方式 | 健康度 |
|:-----|:----------|:---------|:---------|:---------|:-------|
| CompDesc.model | `controller_model_comp_desc.proto` | ~43KB | 38KB | ✅ 动态构建 (JSON→Proto) | 🟡 |
| AbiSet.model | `controller_model_abi_set.proto` | 13161B | 149B | ⚠️ 部分构建 | 🔴 |
| FuncDesc.model | `controller_model_abi_desc.proto` | 1538B | 1538B | ⚠️ 静态复制 | 🟡 |

---

## 一、AbiSet.model 审计 (🔴 严重问题)

### 1.1 数据内容对比

```
标准 AbiSet (13161 bytes):
  version: "V1.0"
  functionAbility: 5 项
    [locationAbility] 定位能力 → 1 child (navi: 导航)
    [HCI]             人机交互 → 2 children (led, button)
    [safetyAbility]   安全能力 → 3 children (safetyIO, safetySensor, safetyRound)
    [distMeasureAbility] 透传测距 → 1 child
    [actorAbility]    执行机构 → 1 child
  componentAbility: 2 项
    [laser]: 75个实体型号 (PEPPERL_FUCHS_R2000, SICK_TIM561, ...)
    [motor]: 7个实体型号

我方 AbiSet (149 bytes):
  version: "1.0"
  functionAbility: 2 项
    [locationAbility] 定位能力 → 1 child
    [sensoryRecoAbi]  感知识别 → 1 child  ← 标准中无此项
  componentAbility: 0 项  ← 完全缺失
```

### 1.2 问题清单

| 编号 | 问题 | 严重程度 | 说明 |
|:-----|:-----|:---------|:-----|
| A-1 | version 值差异 | 🟡 低 | 我方 `"1.0"` vs 标准 `"V1.0"` |
| A-2 | functionAbility 缺少3项 | 🔴 严重 | 缺少 HCI, safetyAbility, distMeasureAbility, actorAbility |
| A-3 | functionAbility 多出1项 | 🟡 中 | `sensoryRecoAbi` 不在标准中，可能是前端自定义 |
| A-4 | componentAbility 完全缺失 | 🔴 严重 | 缺少 laser(75型号) 和 motor(7型号) 的能力清单 |
| A-5 | 编码管道不完整 | 🟡 中 | 缺少 `sanitize_values` 和 `strip_whitespace` 处理 |
| A-6 | export_abilities 丢失字段 | 🔴 严重 | 函数不输出 `version` 和 `componentAbility` |

### 1.3 根因分析

#### A-2/A-4 根因: 前端数据不足 + 无模板填充

```
CompDesc 管道:
  前端 sparse data → enrich_from_templates() → 模板填充 → 完整输出 ✅

AbiSet 管道:
  前端 sparse data → export_abilities() → 直接转换 → 只有前端提供的2项 ❌
                     ↑ 没有模板填充步骤!
```

**AbiSet 没有像 CompDesc 那样的 `enrich_from_templates` 逻辑**。前端只提供了 2 个 functionAbility（定位和感知），缺少的 HCI、安全、测距、执行机构等能力均未构建。

#### A-6 根因: export_abilities() 函数结构不完整

```python
# 当前 (有缺陷):
def export_abilities(abilities):
    return {
        "functionAbility": [...]  # ← 只输出 functionAbility
    }
    # 缺少: "version", "componentAbility"

# 应该:
def export_abilities(abilities):
    return {
        "version": abilities.get("version", "V1.0"),
        "componentAbility": abilities.get("componentAbility", []),
        "functionAbility": [...]
    }
```

### 1.4 ABI Proto 与 CompDesc Proto 的 Tag 差异

两个 proto 文件中 `Message_Attribute` 的 oneof Tag 编号**不同**（这是设计如此，非 bug）：

```
                    AbiSet proto          CompDesc proto
string_value        Tag 10               Tag 13
bool_value          Tag 11               Tag 14
int32_value         Tag 12               Tag 15
double_value        Tag 17               Tag 17 (相同)
combo_type          Tag 20               Tag 24
```

**影响**: `sanitize_values()` 基于 JSON 键名工作（如 `doubleValue`），与 Tag 无关 → **可跨 proto 共用**。但 `proto_final_sync()` 中 `_TYPE_STR_TO_INT` 的枚举映射需要确认两套 proto 的 enum 定义是否一致。

---

## 二、FuncDesc.model 审计 (🟡 中等问题)

### 2.1 当前实现

```python
# encoder.py L338-342:
func_model_data = b""
baseline_func_path = os.path.join(..., "resources", "FuncDesc_base.model")
if os.path.exists(baseline_func_path):
    with open(baseline_func_path, "rb") as f:
        func_model_data = f.read()
```

**处理方式**: 将 `resources/FuncDesc_base.model` 原始二进制文件直接打包进 `.cmodel` ZIP，不做任何动态处理。

### 2.2 验证结果

```
标准 FuncDesc.model: 1538 bytes
我方 FuncDesc.model: 1538 bytes
字节完全一致: ✅ True
```

### 2.3 潜在问题

| 编号 | 问题 | 严重程度 | 说明 |
|:-----|:-----|:---------|:-----|
| F-1 | 无 pb2 编译 | 🟡 中 | `controller_model_abi_desc_pb2.py` 不存在，无法动态构建 |
| F-2 | 静态基线 | 🟡 中 | 不反映用户在前端的功能配置更改 |
| F-3 | 无前端数据源 | ℹ️ 信息 | 前端目前未提供 FuncDesc 相关的编辑界面 |
| F-4 | 基线来源不明 | ℹ️ 信息 | `FuncDesc_base.model` 可能是从标准文件手动提取 |

### 2.4 FuncDesc Proto 结构

```protobuf
// controller_model_abi_desc.proto  (package MODEL_DES)
message Robot_Description {
    string version = 1;                        // 模型文件版本
    repeated Robot_Function function = 12;     // 机器人功能
}

message Robot_Function {
    string type = 1;                           // 功能类型
    string desc = 2;                           // 需要展示为什么
    repeated Robot_Child_Function child_function = 11;
}

message Robot_Child_Function {
    string type = 1;
    string desc = 2;
    string key = 3;
    repeated Message_CommonAttr attr = 10;
    bool clone_enable = 11;
}
```

**注意**: FuncDesc 的 `Message_Attribute` Tag 编号也与 CompDesc/AbiSet 不同!

```
FuncDesc Message_Attribute:
  key=1, type=10, string_value=11, bool_value=12, int32_value=13, double_value=18
  ← fixedSource 使用 camelCase Tag 21 (非 snake_case)
```

---

## 三、三文件编码管道对比

```
                CompDesc              AbiSet                FuncDesc
数据源          blueprint.json        AbiSet.json           FuncDesc_base.model
构建方式        JSON → Proto          JSON → Proto          原始字节复制
resolve_ref     ✅                     ❌ (不需要)           ❌ (不需要)
enrich_tpl      ✅                     ❌ 缺失 !!!           ❌ (不适用)
proto_final     ✅                     ✅                     ❌ (不需要)
sanitize_val    ✅                     ❌ 缺失 !!            ❌ (不需要)
strip_ws        ✅                     ❌ 缺失 !             ❌ (不需要)
sys_tree        ✅                     ❌ (不需要)           ❌ (不需要)
pb2 编译        ✅ comp_desc_pb2       ✅ abi_set_pb2        ❌ 缺失
当前健康度      🟡                     🔴                     🟡
```

---

## 四、修复建议

### 4.1 AbiSet 修复 (优先级 P0)

#### A-5/A-6: 补全 export_abilities + 统一编码管道

```python
# encoder.py 中 AbiSet 部分应同样经过完整管道:
if os.path.exists(abi_json_path):
    with open(abi_json_path, "r") as f:
        abi_data = json.load(f)
    abi_data = proto_final_sync(abi_data)
    abi_data = sanitize_values(abi_data)     # ← 新增
    abi_data = strip_whitespace(abi_data)    # ← 新增
    ParseDict(abi_data, abi_obj, ignore_unknown_fields=True)
```

#### A-6: 修复 export_abilities 输出完整性

```python
def export_abilities(abilities):
    if not abilities:
        return {"version": "V1.0", "componentAbility": [], "functionAbility": []}
    return {
        "version": abilities.get("version", "V1.0"),
        "componentAbility": abilities.get("componentAbility", []),  # ← 新增
        "functionAbility": [
            {
                "type": f.get("type"), "desc": f.get("desc", ""),
                "tips": f.get("tips", ""),                          # ← 新增
                "childFunction": [
                    {
                        "type": cf.get("type", cf.get("key", "")),  # ← 标准用 type, 非 key
                        "desc": cf.get("desc", ""),
                        "tips": cf.get("tips", ""),                 # ← 新增
                        "key": cf.get("key", ""),                   # ← 新增
                        "attr": [...],
                        "cloneEnable": cf.get("cloneEnable", False) # ← 新增
                    } for cf in f.get("childFunction", [])
                ]
            } for f in abilities.get("functionAbility", [])
        ]
    }
```

#### A-2/A-4: AbiSet 模板注入 (遵循 §15 后端默认值填充规范)

与 CompDesc 一样，当前端数据不足时，应从标准基线加载 AbiSet 默认能力清单：

```python
# 建议: 在 resources/ 下放置 AbiSet_base.json (从 ModelSet312 提取)
# encoder.py 在 AbiSet.json 不存在或内容不完整时, 从基线填充
```

### 4.2 FuncDesc 修复 (优先级 P2)

- **短期**: 当前的静态基线复制是可接受的（字节完全匹配标准）
- **中期**: 编译 `controller_model_abi_desc_pb2.py`，支持动态构建
- **长期**: 前端增加功能描述编辑界面后，FuncDesc 需要从前端数据动态生成

### 4.3 Proto Tag 差异处理

三个 proto 文件的 `Message_Attribute` 使用不同的 Tag 编号，但 JSON 键名相同。`sanitize_values()` 和 `strip_whitespace()` 基于 JSON 键名工作，**可跨三个 proto 共用**。`proto_final_sync()` 也基于 JSON 键名，同样可共用。

---

## 五、待办项汇总

| 编号 | 文件 | 问题 | 优先级 |
|:-----|:-----|:-----|:-------|
| A-2 | AbiSet | 缺少3个 functionAbility (HCI, safety, dist, actor) | P0 |
| A-4 | AbiSet | 缺少 componentAbility (laser 75型号, motor 7型号) | P0 |
| A-5 | AbiSet | 编码管道缺少 sanitize_values + strip_whitespace | P0 |
| A-6 | AbiSet | export_abilities 丢失 version + componentAbility | P0 |
| A-1 | AbiSet | version 值 "1.0" vs "V1.0" | P2 |
| F-1 | FuncDesc | 无 pb2 编译 (不影响当前功能) | P2 |
| F-2 | FuncDesc | 静态基线（当前可接受） | P3 |
