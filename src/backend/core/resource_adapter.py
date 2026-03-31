import xml.etree.ElementTree as ET
import json
import os
import copy
from pathlib import Path

# --- Module Library Template Directory ---
# Templates contain complete proto-compatible JSON for each hardware type
_ADAPTER_DIR = Path(__file__).resolve().parent.parent  # src/backend
MODULE_LIB_DIR = _ADAPTER_DIR / "resources" / "modules"

_template_cache = {}

def load_module_template(component_type: str):
    """Load a module library template by component type name.
    Searches for exact match, then common-variant match in resources/modules/*.json.
    Returns the first moduleComponets[0] dict (generalAttr, privateAttr, interfaceParams etc), or None.
    """
    if component_type in _template_cache:
        return copy.deepcopy(_template_cache[component_type])
    
    if not MODULE_LIB_DIR.exists():
        return None
    
    # Try exact match first, then partial match
    candidates = [
        MODULE_LIB_DIR / f"{component_type}.json",
    ]
    
    # Fallback: search for a file that starts with the component type
    if not any(c.exists() for c in candidates):
        for f in MODULE_LIB_DIR.glob("*.json"):
            if f.stem.lower() == component_type.lower():
                candidates.insert(0, f)
                break
    
    for path in candidates:
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                comps = data.get("moduleComponets", [])
                if comps:
                    _template_cache[component_type] = comps[0]
                    return copy.deepcopy(comps[0])
            except Exception:
                pass
    
    _template_cache[component_type] = None
    return None

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

CATEGORY_TO_TYPE_KEY = {
    'CHASSIS': 'chassis',
    'DRIVEWHEEL': 'driveWheel',
    'DRIVER': 'driver',
    'MOTOR': 'driver',
    'MAINCPU': 'mainCPU',
    'INTERGRATEDCONTROLLER': 'mainCPU',
    'SENSOR': 'sensor',
    'BATTERY': 'battery',
    'BUTTON': 'button',
    'LIGHT': 'light',
    'IO': 'extendedlnterface',
}

CATEGORY_TO_SUBSYS = {
    'CHASSIS': 'ChassisSys',
    'DRIVEWHEEL': 'ChassisSys',
    'DRIVER': 'MotionSys',
    'MOTOR': 'MotionSys',
    'MAINCPU': 'ControlSys',
    'SENSOR': 'SensorSys',
    'BATTERY': 'PowerSys',
    'BUTTON': 'SafetySys',
    'LIGHT': 'SafetySys',
    'IO': 'ControlSys',
}

def map_component_to_cmodel(c):
    category = c.get("category", "")
    is_chassis = category == "CHASSIS" or c.get("id") == "chassis-root"
    comp_type = c.get("type", "")
    comp_name = c.get("name", "").strip()
    comp_uuid = c.get("id", "")
    
    # --- Step 1: Try loading a library template for complete proto-compatible data ---
    template = load_module_template(comp_type) if not is_chassis else None
    
    if template:
        # Use the template's complete generalAttr as base, override with user values
        gen_attr = copy.deepcopy(template.get("generalAttr", {}))
        # Override with user's actual name and uuid
        if "moduleName" in gen_attr:
            gen_attr["moduleName"]["stringValue"] = comp_name
        else:
            gen_attr["moduleName"] = {"key": "module_name", "type": "DATA_STRING", "stringValue": comp_name, "desc": "模块名称", "boolParse": True}
        if "moduleUuid" in gen_attr:
            gen_attr["moduleUuid"]["stringValue"] = comp_uuid
        else:
            gen_attr["moduleUuid"] = {"key": "module_uuid", "type": "DATA_STRING", "stringValue": comp_uuid, "desc": "模块Uuid", "boolParse": True, "boolHide": True}
    elif is_chassis:
        gen_attr = json.loads(json.dumps(CHASSIS_GENERAL_ATTR_TEMPLATE))
        gen_attr["moduleName"]["stringValue"] = c.get("name", "chassis").strip()
        gen_attr["moduleUuid"]["stringValue"] = c.get("id", "chassis-root")
    else:
        gen_attr = {
            "moduleName": {"key": "module_name", "type": "DATA_STRING", "stringValue": comp_name, "desc": "模块名称", "boolParse": True},
            "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", "stringValue": comp_uuid, "desc": "模块Uuid", "boolParse": True, "boolHide": True}
        }

    # [FIX RC-6] Inject missing mainModuleType and subSysType (fallback if template didn't have them)
    if "mainModuleType" not in gen_attr:
        type_key = CATEGORY_TO_TYPE_KEY.get(category.upper(), "")
        if type_key:
            gen_attr["mainModuleType"] = {
                "key": "main_module_type", 
                "type": "DATA_COMBOX", 
                "comboType": {"typeKey": type_key},
                "boolParse": True
            }
    
    if "subSysType" not in gen_attr:
        subsys = CATEGORY_TO_SUBSYS.get(category.upper(), "Other")
        gen_attr["subSysType"] = {
            "key": "sub_sys_type",
            "type": "DATA_COMBOX",
            "comboType": {"typeKey": subsys},
            "boolParse": True
        }

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

    # --- Step 2: Build interface data with template enrichment (D-1/D-2 fix) ---
    frontend_interfaces = c.get("interfaces", [])
    template_interface_groups = []
    
    if template:
        # Load template interface data for interfaceAttrs enrichment
        tpl_iface = template.get("interfaceParams", {}).get("interfaceGroup", [])
        tpl_by_key = {ig.get("key", ""): ig for ig in tpl_iface}
        
        for i in frontend_interfaces:
            iface_data = {
                "key": i.get("key"), "type": i.get("type"), "desc": i.get("desc", ""),
                "interfaceUuid": i.get("interfaceUuid"), "linkedInterfaceUuid": i.get("linkedInterfaceUuid", []),
            }
            # Enrich with template's interfaceAttrs (Tag 8: fixed attributes from hardware spec)
            tpl_match = tpl_by_key.get(i.get("key"), {})
            iface_data["interfaceAttrs"] = i.get("interfaceAttrs") or tpl_match.get("interfaceAttrs", {})
            iface_data["interfaceParams"] = i.get("interfaceParams") or tpl_match.get("interfaceParams", {})
            template_interface_groups.append(iface_data)
    else:
        template_interface_groups = [
            {
                "key": i.get("key"), "type": i.get("type"), "desc": i.get("desc", ""),
                "interfaceUuid": i.get("interfaceUuid"), "linkedInterfaceUuid": i.get("linkedInterfaceUuid", []),
                "interfaceAttrs": i.get("interfaceAttrs", {}),
                "interfaceParams": i.get("interfaceParams", {})
            } for i in frontend_interfaces
        ]

    return {
        "generalAttr": gen_attr,
        "privateAttr": {"privateAttrs": priv_attrs_for_pb},
        "interfaceAbility": (c.get("interfaceAbility") or (template.get("interfaceAbility", {"busInterfaceAbility": []}) if template else {"busInterfaceAbility": []})),
        "interfaceParams": {"interfaceGroup": template_interface_groups},
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
        group_name = comp.get("name", "ModuleGroup").replace("module_", "").strip()

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
    """[O-8] Complete AbiSet JSON output, including version + componentAbility + tips + cloneEnable."""
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
                "moduleName": {"stringValue": name.strip()},
                "subSysType": {"comboType": {"typeKey": comp.get("category")}}
            }
        })
    return {"moduleGroupName": root.get("name", "Unknown"), "moduleComponets": components}
