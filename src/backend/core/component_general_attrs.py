"""Pure helpers for building component generalAttr payloads."""

import copy
import json

from .module_mappings import (
    CATEGORY_TO_SUBSYS,
    CATEGORY_TO_TYPE_KEY,
    CHASSIS_GENERAL_ATTR_TEMPLATE,
)
from .module_templates import load_module_template


def normalize_component_category(category, component_name):
    normalized_category = category or ""
    if not normalized_category or normalized_category == "EXTENDEDLNTERFACE":
        name_upper = component_name.upper()
        if any(keyword in name_upper for keyword in ["INTERFACE", "IO-", "BOARD", "IOMODULE"]):
            normalized_category = "IO"
    return normalized_category


def is_chassis_component(category, component_id):
    return category == "CHASSIS" or component_id == "chassis-root"


def build_component_general_attr(component, identity=None):
    category = normalize_component_category(component.get("category", ""), component.get("name", "").strip())
    comp_type = component.get("type", "")
    comp_name = component.get("name", "").strip()
    comp_uuid = component.get("id", "")
    is_chassis = is_chassis_component(category, component.get("id"))

    template = load_module_template(comp_type) if not is_chassis else None

    if template:
        general_attr = copy.deepcopy(template.get("generalAttr", {}))
        if "moduleName" in general_attr:
            general_attr["moduleName"]["stringValue"] = comp_name
        else:
            general_attr["moduleName"] = {
                "key": "module_name",
                "type": "DATA_STRING",
                "stringValue": comp_name,
                "desc": "模块名称",
                "boolParse": True,
            }
        if "moduleUuid" in general_attr:
            general_attr["moduleUuid"]["stringValue"] = comp_uuid
        else:
            general_attr["moduleUuid"] = {
                "key": "module_uuid",
                "type": "DATA_STRING",
                "stringValue": comp_uuid,
                "desc": "模块Uuid",
                "boolParse": True,
                "boolHide": True,
            }
    elif is_chassis:
        general_attr = json.loads(json.dumps(CHASSIS_GENERAL_ATTR_TEMPLATE))
        general_attr["moduleName"]["stringValue"] = "chassis_diff"
        general_attr["moduleUuid"]["stringValue"] = component.get("id", "chassis-root")
        if identity:
            general_attr["moduleShape"] = {
                "key": "module_shape",
                "shapeType": "ENUM_BOX",
                "desc": "底盘形状",
                "boolParse": True,
                "box": {
                    "sizeLen": float(identity.get("chassisLength", 100)),
                    "sizeWidth": float(identity.get("chassisWidth", 100)),
                    "sizeHeight": float(identity.get("chassisHeight", 100)),
                },
            }
    else:
        type_cfg = CATEGORY_TO_TYPE_KEY.get(category.upper(), {"key": "unknown", "desc": "未知"})
        general_attr = {
            "moduleName": {"key": "module_name", "type": "DATA_STRING", "stringValue": comp_name, "desc": "模块名称", "boolParse": True},
            "moduleDesc": {"key": "module_desc", "type": "DATA_STRING", "stringValue": comp_name, "desc": "模块描述", "boolParse": True},
            "moduleUuid": {"key": "module_uuid", "type": "DATA_STRING", "stringValue": comp_uuid, "desc": "模块Uuid", "boolParse": True, "boolHide": True},
            "versionInfo": {"key": "version_info", "type": "DATA_STRING", "stringValue": "V1.0", "desc": "版本信息", "boolParse": True, "boolNoeditable": True},
            "mainModuleType": {
                "key": "main_module_type",
                "type": "DATA_COMBOX",
                "comboType": {"typeKey": type_cfg["key"], "typeDesc": type_cfg["desc"]},
                "boolParse": True,
                "desc": "主类型",
            },
            "subModuleType": {
                "key": "sub_module_type",
                "type": "DATA_COMBOX",
                "comboType": {"typeKey": type_cfg["key"], "typeDesc": type_cfg["desc"]},
                "boolParse": True,
                "desc": "子类型",
            },
            "moduleShape": {"shapeType": "ENUM_BOX", "box": {"sizeLen": 100, "sizeWidth": 100, "sizeHeight": 100}},
        }

    apply_general_attr_defaults(general_attr, category, is_chassis)
    return general_attr, category, is_chassis


def apply_general_attr_defaults(general_attr, category, is_chassis):
    if "subSysType" not in general_attr or not general_attr["subSysType"].get("comboType", {}).get("typeDesc"):
        subsys_cfg = CATEGORY_TO_SUBSYS.get(category.upper(), {"key": "UnclassifiedSys", "desc": "未分类系统"})
        general_attr["subSysType"] = {
            "key": "sub_sys_type",
            "type": "DATA_COMBOX",
            "comboType": {"typeKey": subsys_cfg["key"], "typeDesc": subsys_cfg["desc"]},
            "boolParse": True,
            "desc": "子系统",
        }

    if "mainModuleType" not in general_attr or not general_attr["mainModuleType"].get("comboType", {}).get("typeDesc"):
        type_cfg = CATEGORY_TO_TYPE_KEY.get(category.upper(), {"key": "", "desc": ""})
        if type_cfg["key"]:
            general_attr["mainModuleType"] = {
                "key": "main_module_type",
                "type": "DATA_COMBOX",
                "comboType": {"typeKey": type_cfg["key"], "typeDesc": type_cfg["desc"]},
                "boolParse": True,
                "desc": "主类型",
            }

    if "subModuleType" not in general_attr or not general_attr["subModuleType"].get("comboType", {}).get("typeDesc"):
        if is_chassis:
            general_attr["subModuleType"] = {
                "key": "sub_module_type",
                "type": "DATA_COMBOX",
                "comboType": {"typeKey": "steerChassis", "typeDesc": "舵轮底盘"},
                "boolParse": True,
                "desc": "子类型",
            }
        elif category.upper() == "DRIVEWHEEL":
            general_attr["subModuleType"] = {
                "key": "sub_module_type",
                "type": "DATA_COMBOX",
                "comboType": {"typeKey": "horizontalSteerWheel", "typeDesc": "水平旋转舵轮"},
                "boolParse": True,
                "desc": "子类型",
            }
        elif category.upper() in ["IO", "IO_BOARD", "EXTENDEDLNTERFACE"]:
            general_attr["subModuleType"] = {
                "key": "sub_module_type",
                "type": "DATA_COMBOX",
                "comboType": {"typeKey": "IOModule", "typeDesc": "接口扩展模块"},
                "boolParse": True,
                "desc": "子类型",
            }
        else:
            type_cfg = CATEGORY_TO_TYPE_KEY.get(category.upper(), {"key": "unknown", "desc": "未知"})
            general_attr["subModuleType"] = {
                "key": "sub_module_type",
                "type": "DATA_COMBOX",
                "comboType": {"typeKey": type_cfg["key"], "typeDesc": type_cfg["desc"]},
                "boolParse": True,
                "desc": "子类型",
            }

    if "moduleShape" not in general_attr:
        general_attr["moduleShape"] = {"shapeType": "ENUM_BOX", "box": {"sizeLen": 100, "sizeWidth": 100, "sizeHeight": 100}}
    if "versionInfo" not in general_attr:
        general_attr["versionInfo"] = {
            "key": "version_info",
            "type": "DATA_STRING",
            "stringValue": "V1.0",
            "desc": "版本信息",
            "boolParse": True,
            "boolNoeditable": True,
        }
    if "moduleType" not in general_attr:
        general_attr["moduleType"] = {
            "key": "module_type",
            "type": "DATA_STRING",
            "stringValue": category.upper(),
            "desc": "模块型号",
            "boolParse": True,
        }
