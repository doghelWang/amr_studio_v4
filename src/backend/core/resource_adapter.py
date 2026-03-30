import xml.etree.ElementTree as ET
import json
import os

# --- 工业级标准元数据模板 ---
CHASSIS_GENERAL_ATTR_TEMPLATE = {
    "moduleName": {"key": "module_name", "type": "DATA_STRING", "desc": "模块名称", "boolParse": True},
    "moduleDesc": {"key": "module_desc", "type": "DATA_STRING", "stringValue": "通用底盘", "desc": "模块描述", "boolParse": True},
    "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", "desc": "模块Uuid", "boolParse": True, "boolHide": True},
    "subSysType": {
        "key": "sub_sys_type", "type": "DATA_COMBOX", 
        "comboType": {"typeKey": "ChassisSys", "typeDesc": ""},
        "desc": "子系统", "boolParse": True
    },
    "mainModuleType": {
        "key": "main_module_type", "type": "DATA_COMBOX", 
        "comboType": {"typeKey": "chassis", "typeDesc": ""},
        "desc": "主类型", "boolParse": True
    }
}

def map_attribute_to_cmodel(a, is_ability=False):
    base = {
        "key": a.get("key", ""),
        "type": a.get("type", "DATA_STRING"),
        "desc": a.get("desc", ""),
        "unit": a.get("unit", ""),
        "boolParse": a.get("boolParse", True),
        "boolHide": a.get("boolHide", False),
        "boolBasic": a.get("boolBasic", True),
        "boolMustfill": a.get("boolMustfill", False),
        "boolNoeditable": a.get("boolNoeditable", False),
        "fixedSource": a.get("fixedSource", [])
    }
    val = a.get("value")
    a_type = a.get("type")
    if val is not None:
        if a_type == "DATA_DOUBLE": base["doubleValue"] = float(val)
        elif a_type == "DATA_INT32": base["int32Value"] = int(val)
        elif a_type == "DATA_BOOL": base["boolValue"] = bool(val)
        elif a_type == "DATA_STRING": base["stringValue"] = str(val)
        elif a_type == "DATA_COMBOX":
            combo = a.get("comboType") or a.get("combo_type")
            if combo:
                base["comboType"] = {
                    "typeKey": combo.get("typeKey") or combo.get("type_key", ""),
                    "typeDesc": combo.get("typeDesc") or combo.get("type_desc", ""),
                    "typeGroups": []
                }
                for g in (combo.get("typeGroups") or combo.get("type_groups") or []):
                    group = {"key": g.get("key"), "desc": g.get("desc", "")}
                    sk = "arrayAttr" if is_ability else "arrayCmobEle"
                    ssk = "arrayAttr" if is_ability else ("arrayCmobEle" if "arrayCmobEle" in g else "array_cmob_ele")
                    if ssk in g: group[sk] = [map_attribute_to_cmodel(sub, is_ability) for sub in g[ssk]]
                    base["comboType"]["typeGroups"].append(group)
    return base

def map_component_to_cmodel(c):
    category = c.get("category", "")
    is_chassis = category == "CHASSIS" or c.get("id") == "chassis-root"
    
    gen_attr = json.loads(json.dumps(CHASSIS_GENERAL_ATTR_TEMPLATE)) if is_chassis else {
        "moduleName": {"key": "module_name", "type": "DATA_STRING", "stringValue": c.get("name", ""), "desc": "模块名称", "boolParse": True},
        "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", "stringValue": c.get("id", ""), "desc": "模块Uuid", "boolParse": True, "boolHide": True}
    }
    if is_chassis:
        gen_attr["moduleName"]["stringValue"] = c.get("name", "chassis")
        gen_attr["moduleUuid"]["stringValue"] = c.get("id", "chassis-root")

    # [FIX F-008] Chassis Kinematics redirection to Tag 5 (structParam)
    # Standard tools expect headOffset etc. inside structParam.extendParams
    extend_params = [
        {"key": "locCoordX", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountX", 0))},
        {"key": "locCoordY", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountY", 0))},
        {"key": "locCoordZ", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountZ", 0))},
        {"key": "locCoordROLL", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountRoll", 0))},
        {"key": "locCoordPITCH", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountPitch", 0))},
        {"key": "locCoordYAW", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountYaw", 0))},
        {"key": "parentNodeUuid", "type": "DATA_STRING", "stringValue": c.get("parentNodeUuid", "")}
    ]

    priv_attrs_for_pb = []
    if is_chassis:
        # Move all private attributes to extend_params for bit-perfect alignment
        for g in c.get("privateAttrs", []):
            for e in g.get("elements", []):
                extend_params.append(map_attribute_to_cmodel(e))
    else:
        # Normal components keep their private attributes in Tag 2
        priv_attrs_for_pb = [
            {
                "key": g.get("key"), "desc": g.get("desc", ""),
                "arrayBaseEle": [map_attribute_to_cmodel(e, False) for e in g.get("elements", [])]
            } for g in c.get("privateAttrs", [])
        ]

    return {
        "generalAttr": gen_attr,
        "privateAttr": {"privateAttrs": priv_attrs_for_pb},
        "interfaceAbility": c.get("interfaceAbility") or {"busInterfaceAbility": []},
        "interfaceParams": {"interfaceGroup": [
            {
                "key": i.get("key"), "type": i.get("type"), "desc": i.get("desc", ""),
                "interfaceUuid": i.get("interfaceUuid"), "linkedInterfaceUuid": i.get("linkedInterfaceUuid", []),
                "interfaceParams": i.get("interfaceParams", {})
            } for i in c.get("interfaces", [])
        ]},
        "structParam": {"extendParams": extend_params}
    }

def map_module_group(comp, all_components):
    # Standard: get real children
    children = [c for c in all_components if c.get("parentNodeUuid") == comp.get("id")]
    
    # [FIX F-001] Explicit naming for chassis root
    group_name = comp.get("name", "chassis_diff")
    if comp.get("id") == "chassis-root":
        group_name = "chassis_diff"
    else:
        group_name = comp.get("name", "ModuleGroup").replace("module_", "")

    return {
        "moduleGroupName": group_name,
        "moduleGroupUuid": comp.get("id", ""),
        "moduleComponets": [map_component_to_cmodel(comp)],
        "moreModuleInfo": [map_module_group(c, all_components) for c in children]
    }

def frontend_to_comp_desc(config):
    identity = config.get("identity", {})
    components = config.get("components", [])
    # 找到绝对根节点（底盘）
    root_comps = [c for c in components if not c.get("parentNodeUuid")]
    
    return {
        "moduleGroupName": identity.get("robotName", "Robot"),
        "modelVersion": "1.0",
        "moreModuleInfo": [map_module_group(c, components) for c in root_comps]
    }

def export_abilities(abilities):
    if not abilities or "functionAbility" not in abilities: return {"functionAbility": []}
    return {
        "functionAbility": [
            {
                "type": f.get("type"), "desc": f.get("desc", ""),
                "childFunction": [
                    {
                        "key": cf.get("key"), "desc": cf.get("desc", ""),
                        "attr": [map_attribute_to_cmodel(a, True) for a in cf.get("attr", [])]
                    } for cf in f.get("childFunction", [])
                ]
            } for f in abilities.get("functionAbility", [])
        ]
    }

def xml_to_component_json(xml_path):
    if not os.path.exists(xml_path): return {}
    tree = ET.parse(xml_path)
    root = tree.getroot()
    components = []
    for comp in root.findall(".//Component"):
        identity = comp.find("Identity")
        name = identity.get("name") if identity is not None else "Unknown"
        components.append({
            "generalAttr": {
                "moduleName": {"stringValue": name},
                "subSysType": {"comboType": {"typeKey": comp.get("category")}}
            }
        })
    return {"moduleGroupName": root.get("name", "Unknown"), "moduleComponets": components}
