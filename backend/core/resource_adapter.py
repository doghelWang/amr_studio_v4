import xml.etree.ElementTree as ET
import json
import os

def xml_to_component_json(xml_path):
    """
    Ultra-Fidelity XML Transmuter with Explicit Type Conversion.
    Ensures numbers are not strings in the final JSON output.
    """
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
    except Exception as e:
        print(f"XML_PARSE_ERROR: {xml_path} -> {e}")
        return {}
    
    components = []
    for comp_node in root.findall("Component"):
        # 1. generalAttr
        id_node = comp_node.find("Identity")
        general_attr = {
            "moduleName": {"key": "module_name", "type": "DATA_STRING", "stringValue": id_node.get("name", ""), "boolParse": True},
            "moduleDesc": {"key": "module_desc", "type": "DATA_STRING", "stringValue": id_node.get("desc", ""), "boolParse": True},
            "subSysType": {"key": "sub_sys_type", "type": "DATA_COMBOX", "comboType": {"typeKey": comp_node.get("subsys", "Other")}, "boolParse": True},
            "mainModuleType": {"key": "main_module_type", "type": "DATA_COMBOX", "comboType": {"typeKey": comp_node.get("category", "")}, "boolParse": True},
            "subModuleType": {"key": "sub_module_type", "type": "DATA_COMBOX", "comboType": {"typeKey": comp_node.get("type", "")}, "boolParse": True},
            "venderName": {"key": "vender_name", "type": "DATA_COMBOX", "comboType": {"typeKey": comp_node.get("vender", "Generic")}, "boolParse": True},
            "moduleIcon": {"key": "module_icon", "type": "DATA_STRING", "stringValue": comp_node.get("icon", ""), "boolParse": True},
        }
        
        # 2. privateAttr
        private_attrs_list = []
        attr_root = comp_node.find("Attributes")
        if attr_root is not None:
            for group_node in attr_root.findall("Group"):
                elements = []
                for p in group_node.findall("Param"):
                    p_type = p.get("type")
                    ele = {"key": p.get("key"), "type": p_type, "desc": p.get("desc", p.get("key")), "unit": p.get("unit", ""), 
                           "boolHide": p.get("hide") == "true", "boolBasic": p.get("basic") == "true"}
                    
                    val = p.get("value", "0")
                    if p_type == "DATA_DOUBLE": ele["doubleValue"] = float(val) if val else 0.0
                    elif p_type == "DATA_INT32": ele["int32Value"] = int(val) if val else 0
                    elif p_type == "DATA_BOOL": ele["boolValue"] = val.lower() == "true"
                    elif p_type == "DATA_STRING": ele["stringValue"] = val
                    elif p_type == "DATA_COMBOX":
                        ele["comboType"] = {"typeKey": p.get("selected", ""), "typeGroups": []}
                        for opt in p.findall("Option"):
                            ele["comboType"]["typeGroups"].append({"key": opt.get("key"), "desc": opt.get("desc")})
                    elements.append(ele)
                private_attrs_list.append({"key": group_node.get("key"), "desc": group_node.get("desc"), "arrayBaseEle": elements})

        # 3. interfaceAbility & interfaceParams
        if_abi_list = []
        if_groups = []
        if_root = comp_node.find("Interfaces")
        if if_root is not None:
            for abi in if_root.findall("Ability"):
                if_abi_list.append({
                    "busInterfaceType": abi.get("type"), 
                    "busInterfaceNums": int(abi.get("nums", 0))
                })
            
            for inst in if_root.findall("Instance"):
                p_array = []
                for p in inst.findall("Param"):
                    p_type = p.get("type")
                    p_val = p.get("value", "")
                    p_item = {"key": p.get("key"), "type": p_type, "desc": p.get("desc", p.get("key")), "boolParse": True}
                    if p_type == "DATA_STRING": p_item["stringValue"] = p_val
                    elif p_type == "DATA_INT32": p_item["int32Value"] = int(p_val) if p_val else 0
                    p_array.append(p_item)
                
                if_groups.append({
                    "key": inst.get("key"), "type": inst.get("type"), "desc": inst.get("key"),
                    "interfaceParams": {"interfaceParamsArray": p_array}
                })

        components.append({
            "generalAttr": general_attr,
            "privateAttr": {"privateAttrs": private_attrs_list},
            "interfaceAbility": {"busInterfaceAbility": if_abi_list},
            "interfaceParams": {"interfaceGroup": if_groups}
        })

    return {
        "moduleGroupName": root.get("name", "Unknown"),
        "moduleComponets": components
    }
