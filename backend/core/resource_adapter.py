import xml.etree.ElementTree as ET
import json
import os

def xml_to_component_json(xml_path):
    """
    Transmutes a semantic XML module description into a Protobuf-compatible JSON structure.
    """
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # 1. Base Metadata
    group_name = root.get("name", "UnknownGroup")
    
    components = []
    for comp_node in root.findall("Component"):
        # Identity Logic
        identity_node = comp_node.find("Identity")
        
        # Construct generalAttr
        general_attr = {
            "moduleName": {"key": "module_name", "type": "DATA_STRING", "stringValue": identity_node.get("name"), "boolParse": True},
            "moduleDesc": {"key": "module_desc", "type": "DATA_STRING", "stringValue": identity_node.get("desc"), "boolParse": True},
            "subSysType": {"key": "sub_sys_type", "type": "DATA_COMBOX", "comboType": {"typeKey": comp_node.get("subsys", "SensorSys")}, "boolParse": True},
            "mainModuleType": {"key": "main_module_type", "type": "DATA_COMBOX", "comboType": {"typeKey": comp_node.get("category")}, "boolParse": True},
            "subModuleType": {"key": "sub_module_type", "type": "DATA_COMBOX", "comboType": {"typeKey": comp_node.get("type")}, "boolParse": True},
            "venderName": {"key": "vender_name", "type": "DATA_COMBOX", "comboType": {"typeKey": comp_node.get("vender")}, "boolParse": True},
            "moduleIcon": {"key": "module_icon", "type": "DATA_STRING", "stringValue": identity_node.get("icon"), "boolParse": True},
        }
        
        # Construct privateAttr
        private_attrs_list = []
        attr_root = comp_node.find("Attributes")
        if attr_root is not None:
            for group_node in attr_root.findall("Group"):
                elements = []
                for param_node in group_node.findall("Param"):
                    p_type = param_node.get("type")
                    p_val = param_node.get("value")
                    
                    element = {
                        "key": param_node.get("key"),
                        "type": p_type,
                        "desc": param_node.get("desc", param_node.get("key")),
                        "unit": param_node.get("unit", ""),
                        "boolHide": param_node.get("hide", "false").lower() == "true",
                        "boolBasic": param_node.get("basic", "false").lower() == "true"
                    }
                    
                    # Map values based on type
                    if p_type == "DATA_DOUBLE": element["doubleValue"] = float(p_val)
                    elif p_type == "DATA_INT32": element["int32Value"] = int(p_val)
                    elif p_type == "DATA_BOOL": element["boolValue"] = p_val.lower() == "true"
                    elif p_type == "DATA_STRING": element["stringValue"] = p_val
                    elif p_type == "DATA_COMBOX":
                        element["comboType"] = {
                            "typeKey": param_node.get("selected"),
                            "typeGroups": []
                        }
                        for opt in param_node.findall("Option"):
                            element["comboType"]["typeGroups"].append({
                                "key": opt.get("key"),
                                "desc": opt.get("desc")
                            })
                    
                    elements.append(element)
                
                private_attrs_list.append({
                    "key": group_node.get("key"),
                    "desc": group_node.get("desc"),
                    "arrayBaseEle": elements
                })

        components.append({
            "generalAttr": general_attr,
            "privateAttr": {"privateAttrs": private_attrs_list}
        })

    return {
        "moduleGroupName": group_name,
        "moduleComponets": components
    }
