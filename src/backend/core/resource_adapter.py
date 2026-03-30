import xml.etree.ElementTree as ET
import json
import os

def xml_to_component_json(xml_path):
    """
    Restored XML Transmuter for board discovery.
    """
    if not os.path.exists(xml_path): return {}
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    components = []
    # Search for all components regardless of nesting
    for comp in root.findall(".//Component"):
        identity = comp.find("Identity")
        name = identity.get("name") if identity is not None else "Unknown"
        components.append({
            "generalAttr": {
                "moduleName": {"stringValue": name},
                "subSysType": {"comboType": {"typeKey": comp.get("category")}}
            }
        })
    return {
        "moduleGroupName": root.get("name", "Unknown"),
        "moduleComponets": components
    }

# --- 工业级标准元数据模板 ---
# 用于补全前端缺失的、下位机解析必需的底层 Tag
CHASSIS_GENERAL_ATTR_TEMPLATE = {
    "moduleName": {"key": "module_name", "type": "DATA_STRING", "desc": "模块名称", "boolParse": True},
    "moduleDesc": {"key": "module_desc", "type": "DATA_STRING", "stringValue": "通用差速底盘", "desc": "模块描述", "boolParse": True},
    "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", "desc": "模块Uuid", "boolParse": True, "boolHide": True},
    "versionInfo": {"key": "version_info", "type": "DATA_STRING", "stringValue": "V1.0/2025-08-21", "desc": "版本信息", "boolParse": True, "boolNoeditable": True},
    "module3dIcon": {"key": "module_3d_icon", "type": "DATA_STRING", "stringValue": "/ModuleLibrary/3dModelRes", "desc": "3D模型", "boolParse": True},
    "subSysType": {
        "key": "sub_sys_type", "type": "DATA_COMBOX", 
        "comboType": {"typeKey": "ChassisSys", "typeDesc": "", "typeGroups": []},
        "desc": "子系统", "boolParse": True
    },
    "mainModuleType": {
        "key": "main_module_type", "type": "DATA_COMBOX", 
        "comboType": {"typeKey": "chassis", "typeDesc": "", "typeGroups": []},
        "desc": "主类型", "boolParse": True
    },
    "subModuleType": {
        "key": "sub_module_type", "type": "DATA_COMBOX", 
        "comboType": {"typeKey": "diffChassis", "typeDesc": "", "typeGroups": []},
        "desc": "子类型", "boolParse": True
    },
    "venderName": {
        "key": "vender_name", "type": "DATA_COMBOX", 
        "comboType": {"typeKey": "HIKROBOT", "typeDesc": "", "typeGroups": []},
        "desc": "供应商", "boolParse": True
    },
    "moduleIcon": {"key": "module_icon", "type": "DATA_STRING", "stringValue": "/ModuleLibrary/PictureRes/1/cube.png", "desc": "模块图片", "boolParse": True}
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
                groups = combo.get("typeGroups") or combo.get("type_groups", [])
                for g in groups:
                    group = {"key": g.get("key"), "desc": g.get("desc", "")}
                    sub_key = "arrayAttr" if is_ability else "arrayCmobEle"
                    source_sub_key = "arrayAttr" if is_ability else ("arrayCmobEle" if "arrayCmobEle" in g else "array_cmob_ele")
                    if source_sub_key in g:
                        group[sub_key] = [map_attribute_to_cmodel(sub, is_ability) for sub in g[source_sub_key]]
                    base["comboType"]["typeGroups"].append(group)
    
    if "maxValue" in a: base["doubleMaxvalue"] = float(a["maxValue"])
    if "minValue" in a: base["doubleMinvalue"] = float(a["minValue"])
    return base

def map_component_to_cmodel(c):
    category = c.get("category", "")
    is_chassis = category == "CHASSIS" or c.get("id") == "chassis-root"
    
    # 1. Start with Template if it is chassis
    gen_attr = {}
    if is_chassis:
        # Deep copy template
        gen_attr = json.loads(json.dumps(CHASSIS_GENERAL_ATTR_TEMPLATE))
        gen_attr["moduleName"]["stringValue"] = c.get("name", "chassis")
        gen_attr["moduleUuid"]["stringValue"] = c.get("id", "chassis-root")
    else:
        # Generic component mapping
        gen_attr = {
            "moduleName": {"key": "module_name", "type": "DATA_STRING", "stringValue": c.get("name", ""), "desc": "模块名称", "boolParse": True},
            "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", "stringValue": c.get("id", ""), "desc": "模块Uuid", "boolParse": True, "boolHide": True}
        }

    # 2. Add structural parameters (XYZ/Roll/Pitch/Yaw)
    struct_param = {
        "extendParams": [
            {"key": "locCoordX", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountX", 0))},
            {"key": "locCoordY", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountY", 0))},
            {"key": "locCoordZ", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountZ", 0))},
            {"key": "locCoordROLL", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountRoll", 0))},
            {"key": "locCoordPITCH", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountPitch", 0))},
            {"key": "locCoordYAW", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountYaw", 0))},
            {"key": "parentNodeUuid", "type": "DATA_STRING", "stringValue": c.get("parentNodeUuid", "")}
        ]
    }

    return {
        "generalAttr": gen_attr,
        "privateAttr": {
            "privateAttrs": [
                {
                    "key": g.get("key"),
                    "desc": g.get("desc", ""),
                    "arrayBaseEle": [map_attribute_to_cmodel(e, False) for e in g.get("elements", [])]
                } for g in c.get("privateAttrs", [])
            ]
        },
        "interfaceAbility": c.get("interfaceAbility") or {"busInterfaceAbility": []},
        "interfaceParams": {
            "interfaceGroup": [
                {
                    "key": i.get("key"),
                    "type": i.get("type"),
                    "desc": i.get("desc", ""),
                    "interfaceUuid": i.get("interfaceUuid"),
                    "linkedInterfaceUuid": i.get("linkedInterfaceUuid", []),
                    "interfaceParams": i.get("interfaceParams", {})
                } for i in c.get("interfaces", [])
            ]
        },
        "structParam": struct_param
    }

def map_module_group(comp, all_components):
    children = [c for c in all_components if c.get("parentNodeUuid") == comp.get("id")]
    # [CRITICAL] Standard tool expects the group name to match the chassis type for the root
    group_name = comp.get("name", "chassis_diff")
    if comp.get("id") == "chassis-root":
        group_name = "chassis_diff" # Align with standard sample
        
    return {
        "moduleGroupName": group_name,
        "moduleGroupUuid": comp.get("id", ""),
        "moduleComponets": [map_component_to_cmodel(comp)],
        "moreModuleInfo": [map_module_group(c, all_components) for c in children]
    }

def frontend_to_comp_desc(config):
    identity = config.get("identity", {})
    components = config.get("components", [])
    root_comps = [c for c in components if not c.get("parentNodeUuid")]
    return {
        "moduleGroupName": identity.get("robotName", "Robot"),
        "modelVersion": identity.get("version", "1.0.0"),
        "moreModuleInfo": [map_module_group(c, components) for c in root_comps]
    }
