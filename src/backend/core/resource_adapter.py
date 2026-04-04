import json
import os
import copy
from pathlib import Path

# --- 工业级标准元数据模板 (2026-04-01 CR-10: 补全 13 字段) ---
CHASSIS_GENERAL_ATTR_TEMPLATE = {
    "moduleName": {"key": "module_name", "type": "DATA_STRING", "desc": "模块名称", "boolParse": True},
    "moduleDesc": {"key": "module_desc", "type": "DATA_STRING", "stringValue": "通用底盘", "desc": "模块描述", "boolParse": True},
    "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", "desc": "模块Uuid", "boolParse": True, "boolHide": True},
    "moduleDscType": {"key": "module_dsc_type", "type": "DATA_UINT32", "uint32Value": 0, "desc": "模块描述类型", "boolParse": True, "boolHide": True},
    "versionInfo": {"key": "version_info", "type": "DATA_STRING", "stringValue": "1.0.0", "desc": "版本信息", "boolParse": True},
    "module3dIcon": {"key": "module_3d_icon", "type": "DATA_STRING", "stringValue": "chassis.png", "desc": "3D图标", "boolParse": True, "boolHide": True},
    "subSysType": {
        "key": "sub_sys_type", "type": "DATA_COMBOX", 
        "comboType": {"typeKey": "ChassisSys", "typeDesc": "底盘系统"},
        "desc": "子系统", "boolParse": True
    },
    "mainModuleType": {
        "key": "main_module_type", "type": "DATA_COMBOX", 
        "comboType": {"typeKey": "chassis", "typeDesc": "底盘"},
        "desc": "主类型", "boolParse": True
    },
    "subModuleType": {
        "key": "sub_module_type", "type": "DATA_COMBOX",
        "comboType": {"typeKey": "steerChassis", "typeDesc": "舵轮底盘"},
        "desc": "子类型", "boolParse": True
    },
    "moduleType": {"key": "module_type", "type": "DATA_STRING", "stringValue": "CHASSIS", "desc": "模块型号", "boolParse": True},
    "moduleSupplier": {"key": "module_supplier", "type": "DATA_STRING", "stringValue": "Standard", "desc": "供应商", "boolParse": True},
    "moduleWeight": {"key": "module_weight", "type": "DATA_DOUBLE", "doubleValue": 50.0, "desc": "质量(kg)", "boolParse": True},
    "modulePower": {"key": "module_power", "type": "DATA_DOUBLE", "doubleValue": 100.0, "desc": "功率(W)", "boolParse": True},
    "moduleShape": {"key": "module_shape", "shapeType": "ENUM_BOX", "box": {"sizeLen": 100, "sizeWidth": 100, "sizeHeight": 100}, "desc": "底盘形状", "boolParse": True}
}

CATEGORY_TO_TYPE_KEY = {
    'CHASSIS':              {"key": 'chassis',           "desc": "底盘"},
    'DRIVEWHEEL':           {"key": 'driveWheel',        "desc": "驱动轮"},
    'DRIVER':               {"key": 'driver',            "desc": "驱动器"},
    'MOTOR':                {"key": 'PMSMMotor',         "desc": "永磁同步电机"},
    'MAINCPU':              {"key": 'mainCPU',           "desc": "核心主控"},
    'INTERGRATEDCONTROLLER':{"key": 'mainCPU',           "desc": "核心主控"},
    'SENSOR':               {"key": 'sensor',            "desc": "感知传感器"},
    'BATTERY':              {"key": 'battery',           "desc": "能量电池"},
    'BUTTON':               {"key": 'button',            "desc": "交互按钮"},
    'LIGHT':                {"key": 'light',             "desc": "指示灯光"},
    'IO':                   {"key": 'extendedlnterface', "desc": "接口扩展模块"},
    'IO_BOARD':             {"key": 'extendedlnterface', "desc": "接口扩展模块"},
    'EXTENDEDLNTERFACE':    {"key": 'extendedlnterface', "desc": "接口扩展模块"},
    'EXTENDEDINTERFACE':    {"key": 'extendedlnterface', "desc": "接口扩展模块"},
}

# [FIX 2026-04-04] 对标 ModelSet312.cmodel 真实映射关系
CATEGORY_TO_SUBSYS = {
    'CHASSIS':              {"key": 'ChassisSys',      "desc": "底盘系统"},
    'DRIVEWHEEL':           {"key": 'ChassisSys',      "desc": "底盘系统"}, # TRUTH: 312 maps wheels to ChassisSys
    'DRIVER':               {"key": 'DriverSys',       "desc": "驱动系统"},
    'MOTOR':                {"key": 'DriverSys',       "desc": "驱动系统"},
    'MAINCPU':              {"key": 'ControlSys',      "desc": "控制系统"},
    'INTERGRATEDCONTROLLER':{"key": 'ControlSys',      "desc": "控制系统"},
    'SENSOR':               {"key": 'SensorSys',       "desc": "传感器系统"},
    'BATTERY':              {"key": 'EnergySys',       "desc": "能量系统"},
    'BUTTON':               {"key": 'InteractiveSys',  "desc": "交互系统"},
    'LIGHT':                {"key": 'InteractiveSys',  "desc": "交互系统"},
    'IO':                   {"key": 'ControlSys',      "desc": "控制系统"},
    'IO_BOARD':             {"key": 'ControlSys',      "desc": "控制系统"},
    'EXTENDEDLNTERFACE':    {"key": 'ControlSys',      "desc": "控制系统"},
}

def load_module_template(component_type: str):
    """从本地模板库加载基础配置"""
    try:
        # 寻找 src/backend/resources/modules 目录
        base = Path(__file__).parent.parent / "resources" / "modules"
        tpl_path = base / f"{component_type}.json"
        if tpl_path.exists():
            with open(tpl_path, 'r', encoding='utf-8') as f:
                return json.load(f)
    except:
        pass
    return None

def map_attribute_to_cmodel(a, is_ability=False):
    base = {
        "key": a.get("key", ""),
        "type": a.get("type", "DATA_STRING"),
        "desc": a.get("desc") or a.get("describer", ""),
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
        elif a_type == "DATA_FIXED_E": base["stringValue"] = str(val)
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

def map_component_to_cmodel(c, identity=None):
    category = c.get("category", "")
    comp_type = c.get("type", "")
    comp_name = c.get("name", "").strip()
    comp_uuid = c.get("id", "")

    # [FIX 2026-04-04] Semantic Inference for IO Boards
    if not category or category == "EXTENDEDLNTERFACE":
        name_upper = comp_name.upper()
        if any(k in name_upper for k in ["INTERFACE", "IO-", "BOARD", "IOMODULE"]):
            category = "IO"
    
    print(f"DEBUG_ADAPTER: Mapping {comp_name}, Category: {category}, Type: {comp_type}")

    is_chassis = category == "CHASSIS" or c.get("id") == "chassis-root"
    
    template = load_module_template(comp_type) if not is_chassis else None
    
    if template:
        gen_attr = copy.deepcopy(template.get("generalAttr", {}))
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
        gen_attr["moduleName"]["stringValue"] = "chassis_diff"
        gen_attr["moduleUuid"]["stringValue"] = c.get("id", "chassis-root")
        if identity:
            gen_attr["moduleShape"] = {
                "key": "module_shape", "shapeType": "ENUM_BOX", "desc": "底盘形状", "boolParse": True,
                "box": {
                    "sizeLen": float(identity.get("chassisLength", 100)),
                    "sizeWidth": float(identity.get("chassisWidth", 100)),
                    "sizeHeight": float(identity.get("chassisHeight", 100))
                }
            }
    else:
        type_cfg = CATEGORY_TO_TYPE_KEY.get(category.upper(), {"key": "unknown", "desc": "未知"})
        gen_attr = {
            "moduleName": {"key": "module_name", "type": "DATA_STRING", "stringValue": comp_name, "desc": "模块名称", "boolParse": True},
            "moduleDesc": {"key": "module_desc", "type": "DATA_STRING", "stringValue": comp_name, "desc": "模块描述", "boolParse": True},
            "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", "stringValue": comp_uuid, "desc": "模块Uuid", "boolParse": True, "boolHide": True},
            "versionInfo": {"key": "version_info", "type": "DATA_STRING", "stringValue": "V1.0", "desc": "版本信息", "boolParse": True, "boolNoeditable": True},
            "mainModuleType": {"key": "main_module_type", "type": "DATA_COMBOX", "comboType": {"typeKey": type_cfg["key"], "typeDesc": type_cfg["desc"]}, "boolParse": True, "desc": "主类型"},
            "subModuleType": {"key": "sub_module_type", "type": "DATA_COMBOX", "comboType": {"typeKey": type_cfg["key"], "typeDesc": type_cfg["desc"]}, "boolParse": True, "desc": "子类型"},
            "moduleShape": {"shapeType": "ENUM_BOX", "box": {"sizeLen": 100, "sizeWidth": 100, "sizeHeight": 100}}
        }

    # Inject corrected subsystem mapping with typeDesc
    if "subSysType" not in gen_attr or not gen_attr["subSysType"].get("comboType", {}).get("typeDesc"):
        subsys_cfg = CATEGORY_TO_SUBSYS.get(category.upper(), {"key": "UnclassifiedSys", "desc": "未分类系统"})
        gen_attr["subSysType"] = {
            "key": "sub_sys_type", "type": "DATA_COMBOX",
            "comboType": {"typeKey": subsys_cfg["key"], "typeDesc": subsys_cfg["desc"]}, 
            "boolParse": True, "desc": "子系统"
        }
    
    if "mainModuleType" not in gen_attr or not gen_attr["mainModuleType"].get("comboType", {}).get("typeDesc"):
        type_cfg = CATEGORY_TO_TYPE_KEY.get(category.upper(), {"key": "", "desc": ""})
        if type_cfg["key"]:
            gen_attr["mainModuleType"] = {
                "key": "main_module_type", "type": "DATA_COMBOX", 
                "comboType": {"typeKey": type_cfg["key"], "typeDesc": type_cfg["desc"]}, 
                "boolParse": True, "desc": "主类型"
            }
    
    if "subModuleType" not in gen_attr or not gen_attr["subModuleType"].get("comboType", {}).get("typeDesc"):
        if is_chassis:
            gen_attr["subModuleType"] = {
                "key": "sub_module_type", "type": "DATA_COMBOX",
                "comboType": {"typeKey": "steerChassis", "typeDesc": "舵轮底盘"}, 
                "boolParse": True, "desc": "子类型"
            }
        elif category.upper() == 'DRIVEWHEEL':
            gen_attr["subModuleType"] = {
                "key": "sub_module_type", "type": "DATA_COMBOX",
                "comboType": {"typeKey": "horizontalSteerWheel", "typeDesc": "水平旋转舵轮"}, 
                "boolParse": True, "desc": "子类型"
            }
        elif category.upper() in ['IO', 'IO_BOARD', 'EXTENDEDLNTERFACE']:
            gen_attr["subModuleType"] = {
                "key": "sub_module_type", "type": "DATA_COMBOX",
                "comboType": {"typeKey": "IOModule", "typeDesc": "接口扩展模块"}, 
                "boolParse": True, "desc": "子类型"
            }
        else:
            type_cfg = CATEGORY_TO_TYPE_KEY.get(category.upper(), {"key": "unknown", "desc": "未知"})
            gen_attr["subModuleType"] = {
                "key": "sub_module_type", "type": "DATA_COMBOX",
                "comboType": {"typeKey": type_cfg["key"], "typeDesc": type_cfg["desc"]}, 
                "boolParse": True, "desc": "子类型"
            }
    
    if "moduleShape" not in gen_attr:
        gen_attr["moduleShape"] = {"shapeType": "ENUM_BOX", "box": {"sizeLen": 100, "sizeWidth": 100, "sizeHeight": 100}}
    if "versionInfo" not in gen_attr:
        gen_attr["versionInfo"] = {"key": "version_info", "type": "DATA_STRING", "stringValue": "V1.0", "desc": "版本信息", "boolParse": True, "boolNoeditable": True}

    # Ensure moduleType is present
    if "moduleType" not in gen_attr:
        gen_attr["moduleType"] = {"key": "module_type", "type": "DATA_STRING", "stringValue": category.upper(), "desc": "模块型号", "boolParse": True}

    extend_params = [
        {"key": "parentNodeUuid", "type": "DATA_COMBOX", "comboType": {"typeKey": c.get("parentNodeUuid", ""), "typeDesc": ""}, "desc": "从属机构"},
        {"key": "locCoordX", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountX", 0)), "doubleMaxvalue": 9999.0, "doubleMinvalue": -9999.0, "unit": "mm", "desc": "X坐标"},
        {"key": "locCoordY", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountY", 0)), "doubleMaxvalue": 9999.0, "doubleMinvalue": -9999.0, "unit": "mm", "desc": "Y坐标"},
        {"key": "locCoordZ", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountZ", 0)), "doubleMaxvalue": 9999.0, "doubleMinvalue": -9999.0, "unit": "mm", "desc": "Z坐标"},
        {"key": "locCoordROLL", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountRoll", 0)), "doubleMaxvalue": 360.0, "doubleMinvalue": -360.0, "unit": "°", "desc": "ROLL"},
        {"key": "locCoordPITCH", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountPitch", 0)), "doubleMaxvalue": 360.0, "doubleMinvalue": -360.0, "unit": "°", "desc": "PITCH"},
        {"key": "locCoordYAW", "type": "DATA_DOUBLE", "doubleValue": float(c.get("mountYaw", 0)), "doubleMaxvalue": 360.0, "doubleMinvalue": -360.0, "unit": "°", "desc": "YAW"},
    ]

    priv_attrs_for_pb = [
        {
            "key": g.get("key"), "desc": g.get("desc", ""),
            "arrayBaseEle": [map_attribute_to_cmodel(e, False) for e in g.get("elements", [])]
        } for g in c.get("privateAttrs", [])
    ]

    frontend_interfaces = c.get("interfaces", [])
    template_interface_groups = []
    for i in frontend_interfaces:
        template_interface_groups.append({
            "key": i.get("key", ""),
            "type": i.get("type", ""),
            "path": i.get("path", ""),
            "desc": i.get("desc", ""),
            "interfaceUuid": i.get("interfaceUuid", ""),
            "linkedInterfaceUuid": i.get("linkedInterfaceUuid", [])
        })

    return {
        "generalAttr": gen_attr,
        "privateAttr": {"privateAttrs": priv_attrs_for_pb},
        "interfaceAbility": c.get("interfaceAbility", {"busInterfaceAbility": []}),
        "interfaceParams": {"interfaceGroup": template_interface_groups},
        "structParam": {"extendParams": extend_params}
    }

def map_module_group(comp, all_components, identity=None):
    children = [c for c in all_components if c.get("parentNodeUuid") == comp.get("id")]
    group_name = comp.get("name", "chassis_diff")
    if comp.get("id") == "chassis-root":
        group_name = "chassis_diff"
    else:
        group_name = comp.get("name", "ModuleGroup").replace("module_", "").strip()

    return {
        "moduleGroupName": group_name,
        "moduleGroupUuid": comp.get("id", ""),
        "module_componets": [map_component_to_cmodel(comp, identity)],
        "moreModuleInfo": [map_module_group(c, all_components, identity) for c in children]
    }

def frontend_to_comp_desc(config):
    identity = config.get("identity", {})
    components = config.get("components", [])
    root_comps = [c for c in components if not c.get("parentNodeUuid")]
    
    return {
        "moduleGroupName": identity.get("robotName", "Robot"),
        "modelVersion": "",
        "moreModuleInfo": [map_module_group(c, components, identity) for c in root_comps]
    }

def export_abilities(abilities):
    if not abilities: return {"version": "V1.0", "componentAbility": [], "functionAbility": []}
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
    import xml.etree.ElementTree as ET
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
    return {"moduleGroupName": root.get("name", "Unknown"), "module_componets": components}
