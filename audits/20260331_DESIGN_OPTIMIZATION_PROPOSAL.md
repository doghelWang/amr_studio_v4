# CModel 编码链路设计优化建议

**日期**: 2026-03-31  
**基于审计**: `20260331_HARDCODE_AND_NESTING_AUDIT.md`  
**目标**: 消除全部36处硬编码违规，建立模板驱动的通用编码架构

---

## 一、核心设计原则

```
┌─────────────────────────────────────────────────────────┐
│  所有模块元数据 = 模板(resources/modules/*.json) + 前端数据 │
│  编码器 = 通用遍历器，不包含任何模块类型特定逻辑               │
│  类型推断 = 从模板 generalAttr.mainModuleType 获取，非名称猜测│
└─────────────────────────────────────────────────────────┘
```

---

## 二、优化项 O-1: 建立模板索引注册表

**当前问题**: `_CATEGORY_FALLBACK` 硬编码了10个"类别→模板文件名"映射

**优化方案**: 启动时自动扫描 `resources/modules/` 目录，从每个模板的 `generalAttr.mainModuleType` 和 `generalAttr.subModuleType` 提取类型信息，构建动态索引。

```python
# ====== encoder.py (或独立的 template_registry.py) ======

class TemplateRegistry:
    """模板注册表：启动时自动扫描模块库，建立多维索引"""
    
    def __init__(self, modules_dir: Path):
        self._by_name = {}      # 精确文件名匹配: "mainCPU-Common" → template
        self._by_main_type = {}  # mainModuleType 索引: "mainCPU" → [template, ...]
        self._by_sub_type = {}   # subModuleType 索引: "subMainCPU" → template
        self._scan(modules_dir)
    
    def _scan(self, modules_dir: Path):
        """扫描目录下所有 .json 模板文件, 建立索引"""
        for json_file in modules_dir.glob("*.json"):
            try:
                data = json.load(open(json_file, encoding="utf-8"))
                comps = data.get("moduleComponets", [])
                if not comps:
                    continue
                tpl = comps[0]
                ga = tpl.get("generalAttr", {})
                
                # 索引1: 文件名 (去扩展名)
                self._by_name[json_file.stem] = tpl
                
                # 索引2: mainModuleType.comboType.typeKey
                main_type = ga.get("mainModuleType", {}).get("comboType", {}).get("typeKey", "")
                if main_type:
                    self._by_main_type.setdefault(main_type, []).append(tpl)
                
                # 索引3: subModuleType.comboType.typeKey (更精确)
                sub_type = ga.get("subModuleType", {}).get("comboType", {}).get("typeKey", "")
                if sub_type:
                    self._by_sub_type[sub_type] = tpl
                    
            except Exception:
                continue
    
    def find(self, mod_name: str = "", group_name: str = "",
             main_type: str = "", sub_type: str = "") -> dict | None:
        """多策略模板查找, 优先级: 精确名 > subType > mainType"""
        
        # 策略1: 精确文件名匹配 (最高优先级)
        for name in [mod_name, group_name]:
            if name and name in self._by_name:
                return copy.deepcopy(self._by_name[name])
        
        # 策略2: subModuleType 精确匹配
        if sub_type and sub_type in self._by_sub_type:
            return copy.deepcopy(self._by_sub_type[sub_type])
        
        # 策略3: mainModuleType 模糊匹配 (取第一个 -Common 模板)
        if main_type and main_type in self._by_main_type:
            candidates = self._by_main_type[main_type]
            # 优先选择 -Common 后缀的通用模板
            for c in candidates:
                c_name = c.get("generalAttr", {}).get("moduleName", {}).get("stringValue", "")
                if "Common" in c_name:
                    return copy.deepcopy(c)
            return copy.deepcopy(candidates[0])
        
        return None

# 全局单例
_registry = None
def get_registry():
    global _registry
    if _registry is None:
        _registry = TemplateRegistry(_MODULE_LIB_DIR)
    return _registry
```

---

## 三、优化项 O-2: 重构 enrich_from_templates()

**当前问题**: 使用 `_CATEGORY_FALLBACK` 硬编码 + 名称子串匹配

**优化方案**: 使用 `TemplateRegistry.find()` 进行多维查找，完全消除硬编码

```python
def enrich_from_templates(data):
    """通用模板富化 — 零硬编码版本"""
    if not isinstance(data, dict):
        return data
    
    registry = get_registry()
    
    if "moduleComponets" in data:
        for comp in data["moduleComponets"]:
            if not isinstance(comp, dict):
                continue
            ga = comp.get("generalAttr", {})
            
            # 从现有数据中提取查找维度 (不做名称猜测)
            mod_name = ga.get("moduleName", {}).get("stringValue", "").strip()
            group_name = data.get("moduleGroupName", "").strip()
            main_type = ga.get("mainModuleType", {}).get("comboType", {}).get("typeKey", "")
            sub_type = ga.get("subModuleType", {}).get("comboType", {}).get("typeKey", "")
            
            # 用注册表多策略查找, 不使用任何硬编码映射
            tpl = registry.find(
                mod_name=mod_name,
                group_name=group_name,
                main_type=main_type,
                sub_type=sub_type
            )
            
            if tpl:
                # 填充缺失字段 (前端值优先, 模板值兜底)
                tpl_ga = tpl.get("generalAttr", {})
                for field_key, field_val in tpl_ga.items():
                    if field_key not in ga:
                        ga[field_key] = copy.deepcopy(field_val)
                comp["generalAttr"] = ga
                
                # 富化接口属性 (与现有逻辑一致)
                _enrich_interfaces(comp, tpl)
                
                # 富化 interfaceAbility
                if not comp.get("interfaceAbility") and tpl.get("interfaceAbility"):
                    comp["interfaceAbility"] = copy.deepcopy(tpl["interfaceAbility"])
    
    # 递归处理子 moreModuleInfo
    for sub in data.get("moreModuleInfo", []):
        enrich_from_templates(sub)
    
    return data
```

---

## 四、优化项 O-3: 消除 standardize_sys_tree() 中的硬编码

**当前问题**: `standardize_sys_tree()` 包含6处名称猜测 + 3处 `G_MainController` 硬编码

**优化方案**: 该函数的目的是补齐缺失的 `mainModuleType` 和 `subSysType`。当 O-1/O-2 的模板富化生效后，这些字段已由模板填充，**该函数可以大幅简化甚至移除**。

```python
def standardize_sys_tree(blueprint_root):
    """[优化后] 仅验证 mainModuleType 和 subSysType 是否存在, 
    不再做名称猜测。如果模板富化已生效, 此函数实际为空操作。"""
    
    registry = get_registry()
    
    for g in blueprint_root.get("moreModuleInfo", []):
        for comp in g.get("moduleComponets", []):
            ga = comp.get("generalAttr", {})
            
            # 如果 mainModuleType 仍然缺失 (模板富化未命中),
            # 记录警告而非做名称猜测
            if "mainModuleType" not in ga:
                mod_name = ga.get("moduleName", {}).get("stringValue", "")
                # 通过注册表尝试最后一次匹配, 而非 if "mcpu" in name
                tpl = registry.find(mod_name=mod_name, group_name=g.get("moduleGroupName",""))
                if tpl:
                    tpl_ga = tpl.get("generalAttr", {})
                    if "mainModuleType" in tpl_ga:
                        ga["mainModuleType"] = copy.deepcopy(tpl_ga["mainModuleType"])
                    if "subSysType" in tpl_ga:
                        ga["subSysType"] = copy.deepcopy(tpl_ga["subSysType"])
                # else: 无法匹配, 不猜测, 保留空值, 后续人工审计
        
        # moduleSys 从 subSysType 推导, 而非硬编码
        for comp in g.get("moduleComponets", []):
            sub_sys = comp.get("generalAttr", {}).get("subSysType", {}).get("comboType", {}).get("typeKey", "")
            if sub_sys and not g.get("moduleSys"):
                g["moduleSys"] = sub_sys
                
    return blueprint_root
```

---

## 五、优化项 O-4: 消除 resource_adapter.py 中的硬编码

**当前问题**: `CHASSIS_GENERAL_ATTR_TEMPLATE`, `CATEGORY_TO_TYPE_KEY`, `CATEGORY_TO_SUBSYS` 三个硬编码字典

**优化方案**: 全部改为从模板库动态加载

```python
# ====== resource_adapter.py ======

def map_component_to_cmodel(c):
    category = c.get("category", "")
    is_chassis = category == "CHASSIS" or c.get("id") == "chassis-root"
    comp_type = c.get("type", "")
    comp_name = c.get("name", "").strip()
    comp_uuid = c.get("id", "")
    
    # [O-4] 用模板库替代硬编码模板
    template = load_module_template(comp_type)
    # 如果精确匹配失败, 尝试类别匹配
    if not template:
        template = load_module_template(f"{comp_type}-Common")  # 约定: 通用模板后缀
    
    if template:
        # 完整继承模板的 generalAttr, 仅覆盖 moduleName 和 moduleUuid
        gen_attr = copy.deepcopy(template.get("generalAttr", {}))
        _override_field(gen_attr, "moduleName", "stringValue", comp_name)
        _override_field(gen_attr, "moduleUuid", "stringValue", comp_uuid)
    else:
        # 无模板: 仅填充最基本的 name + uuid
        gen_attr = {
            "moduleName": {"key": "module_name", "type": "DATA_STRING", 
                          "stringValue": comp_name, "boolParse": True},
            "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", 
                          "stringValue": comp_uuid, "boolParse": True, "boolHide": True}
        }
    
    # mainModuleType 和 subSysType: 如果模板没有, 也不硬编码
    # 保留空值, 交给 enrich_from_templates 在编码期再次尝试
    
    # ... 后续逻辑不变 ...

def _override_field(gen_attr: dict, field_name: str, value_key: str, value):
    """安全覆盖 generalAttr 中某个字段的值"""
    if field_name in gen_attr:
        gen_attr[field_name][value_key] = value
    else:
        gen_attr[field_name] = {"key": field_name, value_key: value}

# 删除: CHASSIS_GENERAL_ATTR_TEMPLATE, CATEGORY_TO_TYPE_KEY, CATEGORY_TO_SUBSYS
```

---

## 六、优化项 O-5: moreModuleInfo 嵌套结构策略

**当前行为**: 前端通过 `parentNodeUuid` 构建嵌套树，后端 `map_module_group()` 递归生成嵌套的 `moreModuleInfo`

**标准文件行为**: 所有模块扁平并列在根节点下

**建议**: 保持当前嵌套结构，原因：
1. Proto 协议原生支持 (`repeated Message_Module_Info more_module_info`)
2. 嵌套结构语义更清晰（轮组→驱动→电机 的物理隶属关系）
3. 标准文件的扁平结构是特定工具的输出风格，非协议强制要求

```python
# ====== map_module_group (保持现有递归, 去除硬编码) ======

def map_module_group(comp, all_components):
    children = [c for c in all_components if c.get("parentNodeUuid") == comp.get("id")]
    
    # [O-5] 不再硬编码 "chassis_diff", 直接使用组件名
    group_name = comp.get("name", "ModuleGroup").strip()
    
    return {
        "moduleGroupName": group_name,
        "moduleGroupUuid": comp.get("id", ""),
        # moduleSys 由 enrich_from_templates 从模板中获取, 此处不注入
        "moduleComponets": [map_component_to_cmodel(comp)],
        "moreModuleInfo": [map_module_group(c, all_components) for c in children]
    }
```

> **⚠️ 待确认**: 如果固件团队确认只接受扁平结构，需新增 `flatten_module_tree()` 后处理函数将嵌套结构展平。此函数应在 `enrich_from_templates` 之后、`proto_final_sync` 之前执行。

---

## 七、优化执行优先级

| 优先级 | 优化项 | 影响范围 | 预估工作量 |
|:-------|:-------|:---------|:----------|
| P0 | O-1: 模板索引注册表 | encoder.py | 新建文件, 半天 |
| P0 | O-2: 重构 enrich_from_templates | encoder.py | 中等改动 |
| P1 | O-3: 简化 standardize_sys_tree | encoder.py | 小改动 |
| P1 | O-4: 消除 resource_adapter 硬编码 | resource_adapter.py | 中等改动 |
| P2 | O-5: 嵌套结构策略确认 | 需固件确认 | 视结论 |

---

## 八、优化后编码管道

```
前端 Zustand ──config──▶ resource_adapter.py ──blueprint──▶ 磁盘
                              │                        
                              ▼ (无硬编码)         
                         TemplateRegistry
                              │
                              ▼
磁盘 ──$ref resolve──▶ encoder.py 管道:
                         │
                         ├── 1. resolve_with_fidelity()    # 解析 $ref
                         ├── 2. enrich_from_templates()    # 模板填充 (通用, 零硬编码)
                         ├── 3. proto_final_sync()         # type 字符串→整数
                         ├── 4. sanitize_values()          # oneof 类型修正
                         ├── 5. strip_whitespace()         # 清洗换行/空格
                         ├── 6. standardize_sys_tree()     # [简化] 仅验证, 不猜测
                         └── 7. ParseDict → SerializeToString
```

---

## 九、优化项 O-6: AbiSet 编码管道补全

**当前问题**: AbiSet 编码缺少 `sanitize_values` 和 `strip_whitespace`; `export_abilities()` 丢失 `version` 和 `componentAbility`

```python
# ====== encoder.py AbiSet段 (优化后) ======

# 2. AbiSet Serialization (统一管道)
abi_json_path = os.path.join(project_dir, "AbiSet.json")
abi_obj = controller_model_abi_set_pb2.Controller_Ability()

if os.path.exists(abi_json_path):
    with open(abi_json_path, "r", encoding="utf-8") as f:
        abi_data = json.load(f)
    
    # [O-6] AbiSet 基线模板填充 (遵循 §15 规范)
    abi_data = enrich_abiset_from_baseline(abi_data)
    
    # [O-6] 与 CompDesc 统一的处理管道
    abi_data = proto_final_sync(abi_data)
    abi_data = sanitize_values(abi_data)     # 新增
    abi_data = strip_whitespace(abi_data)    # 新增
    
    ParseDict(abi_data, abi_obj, ignore_unknown_fields=True)
else:
    # 无 AbiSet.json 时加载完整基线
    baseline = load_abiset_baseline()
    abi_data = proto_final_sync(baseline)
    abi_data = sanitize_values(abi_data)
    ParseDict(abi_data, abi_obj, ignore_unknown_fields=True)
```

## 十、优化项 O-7: AbiSet 模板富化函数

**当前问题**: AbiSet 缺少3个 functionAbility 和全部 componentAbility

```python
def enrich_abiset_from_baseline(abi_data: dict) -> dict:
    """[O-7] AbiSet 基线富化 — 遵循 §15 后端默认值填充规范
    
    从 resources/AbiSet_base.json 加载标准能力基线，
    与前端提供的 AbiSet 合并: 前端值优先, 缺失项用基线填充
    """
    baseline = load_abiset_baseline()
    if not baseline:
        return abi_data
    
    # version: 前端优先
    if "version" not in abi_data:
        abi_data["version"] = baseline.get("version", "V1.0")
    
    # componentAbility: 整体补充 (前端目前不提供)
    if not abi_data.get("componentAbility"):
        abi_data["componentAbility"] = baseline.get("componentAbility", [])
    
    # functionAbility: 按 type 合并
    existing_types = {fa["type"] for fa in abi_data.get("functionAbility", [])}
    for base_fa in baseline.get("functionAbility", []):
        if base_fa["type"] not in existing_types:
            abi_data.setdefault("functionAbility", []).append(base_fa)
    
    return abi_data

def load_abiset_baseline() -> dict:
    """从 resources/AbiSet_base.json 加载标准基线"""
    path = os.path.join(os.path.dirname(__file__), "..", "..", "resources", "AbiSet_base.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}
```

## 十一、优化项 O-8: 修复 export_abilities() 完整性

**当前问题**: 函数丢失 `version`, `componentAbility`, `tips`, `cloneEnable` 等字段

```python
# ====== resource_adapter.py ======

def export_abilities(abilities):
    """[O-8] 完整输出 AbiSet JSON, 包含 version + componentAbility"""
    if not abilities:
        return {"version": "V1.0", "componentAbility": [], "functionAbility": []}
    
    return {
        "version": abilities.get("version", "V1.0"),
        "componentAbility": abilities.get("componentAbility", []),
        "functionAbility": [
            {
                "type": f.get("type", ""),
                "desc": f.get("desc", ""),
                "tips": f.get("tips", ""),
                "childFunction": [
                    {
                        "type": cf.get("type", cf.get("key", "")),
                        "desc": cf.get("desc", ""),
                        "tips": cf.get("tips", ""),
                        "key": cf.get("key", ""),
                        "attr": [map_attribute_to_cmodel(a, True) for a in cf.get("attr", [])],
                        "cloneEnable": cf.get("cloneEnable", False)
                    } for cf in f.get("childFunction", [])
                ]
            } for f in abilities.get("functionAbility", [])
        ]
    }
```

## 十二、优化项 O-9: FuncDesc pb2 编译 (P2)

**当前状态**: `controller_model_abi_desc_pb2.py` 不存在，FuncDesc 使用静态文件复制

```python
# 步骤1: 编译 pb2
# protoc --python_out=src/backend/skills_v2/schemas_pb/ \
#   audits/controller_model_abi_desc.proto

# 步骤2: 未来可动态构建 FuncDesc (当前静态基线可接受)
# func_obj = controller_model_abi_desc_pb2.Robot_Description()
# ParseDict(func_json, func_obj, ignore_unknown_fields=True)
# func_model_data = func_obj.SerializeToString()
```

## 十三、更新后的优化执行优先级

| 优先级 | 优化项 | 影响范围 | 预估工作量 |
|:-------|:-------|:---------|:----------|
| P0 | O-1: 模板索引注册表 | encoder.py | 新建文件 |
| P0 | O-2: 重构 enrich_from_templates | encoder.py | 中等 |
| P0 | **O-6: AbiSet 编码管道补全** | encoder.py | 小 |
| P0 | **O-7: AbiSet 基线富化** | encoder.py | 中等 |
| P0 | **O-8: export_abilities 完整性** | resource_adapter.py | 小 |
| P1 | O-3: 简化 standardize_sys_tree | encoder.py | 小 |
| P1 | O-4: 消除 resource_adapter 硬编码 | resource_adapter.py | 中等 |
| P2 | O-5: 嵌套结构策略 | 需固件确认 | 视结论 |
| P2 | **O-9: FuncDesc pb2 编译** | schemas_pb/ | 小 |
