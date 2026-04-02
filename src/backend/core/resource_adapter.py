import json
import copy
from skills_v2.cmodel_encoder.encoder import get_registry

def load_module_template(component_type: str):
    """Load a module library template by component type name.
    Uses the XmlTemplateRegistry (Source of Truth) instead of scanning the filesystem.
    Returns a unified dictionary containing generalAttr, privateAttr, and interfaceParams.
    """
    registry = get_registry()
    node = registry.get_private_attr_spec(component_type)
    if node is None:
        return None
    
    spec_dict = registry._xml_node_to_dict(node)
    
    # --- Structural Mapping to match the old Template JSON format ---
    # The XML structure has <Module type="diffChassis"> <Group ...> ... </Module>
    # The old JSON structure was: { "generalAttr": ..., "privateAttr": { "privateAttrs": [...] }, "interfaceParams": ... }
    
    # 1. Private Attrs
    private_attr_list = []
    if "Group" in spec_dict:
        groups = spec_dict["Group"]
        if not isinstance(groups, list): groups = [groups]
        for g in groups:
            new_group = {
                "groupKey": g.get("groupKey"),
                "groupName": g.get("groupName", g.get("groupKey")),
                "arrayBaseEle": g.get("Attribute", [])
            }
            if not isinstance(new_group["arrayBaseEle"], list):
                new_group["arrayBaseEle"] = [new_group["arrayBaseEle"]]
            private_attr_list.append(new_group)
            
    # 2. Interface Params (Fetch from InterfaceSpecs.xml if available)
    # We fetch for the most likely interface types for this module if needed
    # but for individual modules, the registry.get_interface_spec is more appropriate.
    # However, to maintain the 'template' object structure:
    interface_params = {"interfaceGroup": []}
    
    # 3. Construct the 'tpl' object
    tpl = {
        "generalAttr": spec_dict.get("generalAttr", {}), # Fallback if present in XML
        "privateAttr": {"privateAttrs": private_attr_list},
        "interfaceParams": interface_params,
        "interfaceAbility": spec_dict.get("interfaceAbility", [])
    }
    return tpl

# --- 工业级标准元数据模板 ---
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
    "modulePower": {"key": "module_power", "type": "DATA_DOUBLE", "doubleValue": 100.0, "desc": "功率(W)", "boolParse": True}
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
    'DRIVEWHEEL': 'ChassisSys',  # 2026-04-02: Client confirmed driveWheel → ChassisSys
    'DRIVER': 'UnclassifiedSys',  # 2026-04-02: Client standard — independent modules use UnclassifiedSys
    'MOTOR': 'UnclassifiedSys',
    'MAINCPU': 'UnclassifiedSys',
    'SENSOR': 'UnclassifiedSys',
    'BATTERY': 'UnclassifiedSys',
    'BUTTON': 'UnclassifiedSys',
    'LIGHT': 'UnclassifiedSys',
    'IO': 'UnclassifiedSys',
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
        # FIX #1 (2026-04-02): Chassis module_name must be 'chassis_diff', NOT the project name
        gen_attr["moduleName"]["stringValue"] = "chassis_diff"
        gen_attr["moduleUuid"]["stringValue"] = c.get("id", "chassis-root")
    else:
        gen_attr = {
            "moduleName": {"key": "module_name", "type": "DATA_STRING", "stringValue": comp_name, "desc": "模块名称", "boolParse": True},
            "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", "stringValue": comp_uuid, "desc": "模块Uuid", "boolParse": True, "boolHide": True}
        }

    # [FIX RC-6] Inject missing mainModuleType and subSysType (fallback if template didn't have them)
    # 2026-04-01 Goal: Trust XML Spec/Template first, then Category Map
    if "mainModuleType" not in gen_attr:
        # Check if template has it under a different path or if we need default
        type_key = CATEGORY_TO_TYPE_KEY.get(category.upper(), "")
        if type_key:
            gen_attr["mainModuleType"] = {
                "key": "main_module_type", "type": "DATA_COMBOX", 
                "comboType": {"typeKey": type_key}, "boolParse": True
            }
    
    if "subSysType" not in gen_attr:
        subsys = CATEGORY_TO_SUBSYS.get(category.upper(), "Other")
        gen_attr["subSysType"] = {
            "key": "sub_sys_type", "type": "DATA_COMBOX",
            "comboType": {"typeKey": subsys}, "boolParse": True
        }
    
    # CR-06: Ensure subModuleType is present if possible
    if "subModuleType" not in gen_attr:
        if is_chassis:
            gen_attr["subModuleType"] = {
                "key": "sub_module_type", "type": "DATA_COMBOX",
                "comboType": {"typeKey": "steerChassis"}, "boolParse": True
            }
        elif category.upper() == 'DRIVEWHEEL':
            # FIX #3 (2026-04-02): driveWheel subModuleType = horizontalSteerWheel
            gen_attr["subModuleType"] = {
                "key": "sub_module_type", "type": "DATA_COMBOX",
                "comboType": {"typeKey": "horizontalSteerWheel"}, "boolParse": True
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
        # FIX #7 (2026-04-02): parentNodeUuid encoded as DATA_COMBOX per client standard
        {"key": "parentNodeUuid", "type": "DATA_COMBOX", "comboType": {"typeKey": c.get("parentNodeUuid", "")}}
    ]

    # [FIX RC-CHASSIS] ALL modules (including chassis) keep privateAttrs in Tag 2 (privateAttr).
    # Previous code erroneously moved chassis privateAttrs into structParam.extendParams (Tag 5),
    # destroying the group hierarchy (motionCenterAttr/chassisAttr/wheelsAttr) required by RoboDesigner.
    # Standard ModelSet312.cmodel confirms: chassis has privateAttrs in Tag 2, extendParams is Tag 5 for mount pose only.
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
        "modelVersion": "",  # §21: Root must be anonymous, modelVersion only on composite sub-groups
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
