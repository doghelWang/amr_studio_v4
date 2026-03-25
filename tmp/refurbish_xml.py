import json
import os
import glob
import xml.etree.ElementTree as ET
from xml.dom import minidom

def lossless_convert(json_path, xml_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    root = ET.Element("ModuleGroup", name=data.get("moduleGroupName", ""))
    
    for comp in data.get("moduleComponets", []):
        gen = comp.get("generalAttr", {})
        sub = (gen.get("subSysType") or {}).get("comboType", {}).get("typeKey", "Other")
        cat = (gen.get("mainModuleType") or {}).get("comboType", {}).get("typeKey", "unknown")
        typ = (gen.get("subModuleType") or {}).get("comboType", {}).get("typeKey", "unknown")
        ven = (gen.get("venderName") or {}).get("comboType", {}).get("typeKey", "Generic")
        ico = (gen.get("moduleIcon") or {}).get("stringValue", "")
        
        comp_node = ET.SubElement(root, "Component", subsys=sub, category=cat, type=typ, vender=ven, icon=ico)
        
        # 1. Identity
        ET.SubElement(comp_node, "Identity", 
                      name=(gen.get("moduleName") or {}).get("stringValue", ""),
                      desc=(gen.get("moduleDesc") or {}).get("stringValue", ""))
        
        # 2. Attributes
        attr_node = ET.SubElement(comp_node, "Attributes")
        for g in comp.get("privateAttr", {}).get("privateAttrs", []):
            g_node = ET.SubElement(attr_node, "Group", key=g.get("key"), desc=g.get("desc"))
            for e in g.get("arrayBaseEle", []):
                p = ET.SubElement(g_node, "Param", key=e.get("key"), type=e.get("type"), desc=e.get("desc", ""))
                if "doubleValue" in e: p.set("value", str(e["doubleValue"]))
                elif "int32Value" in e: p.set("value", str(e["int32Value"]))
                elif "boolValue" in e: p.set("value", str(e["boolValue"]).lower())
                elif "stringValue" in e: p.set("value", e["stringValue"])
                elif "comboType" in e:
                    p.set("selected", e["comboType"].get("typeKey", ""))
                    for opt in e["comboType"].get("typeGroups", []):
                        ET.SubElement(p, "Option", key=opt.get("key"), desc=opt.get("desc"))

        # 3. Interfaces (The Missing Link)
        if_node = ET.SubElement(comp_node, "Interfaces")
        if_abi = comp.get("interfaceAbility", {}).get("busInterfaceAbility") or comp.get("interface_ability", {}).get("bus_interface_ability", [])
        for abi in if_abi:
            ET.SubElement(if_node, "Ability", 
                          type=abi.get("busInterfaceType") or abi.get("bus_interface_type"), 
                          nums=str(abi.get("busInterfaceNums") or abi.get("bus_interface_nums", 0)))
        
        if_groups = comp.get("interfaceParams", {}).get("interfaceGroup") or comp.get("interface_params", {}).get("interface_group", [])
        for grp in if_groups:
            inst = ET.SubElement(if_node, "Instance", key=grp.get("key"), type=grp.get("type"))
            # 支持 interface_params_array 或 interfaceParamsArray
            p_wrap = grp.get("interfaceParams") or grp.get("interface_params") or {}
            p_arr = p_wrap.get("interfaceParamsArray") or p_wrap.get("interface_params_array") or []
            for p in p_arr:
                p_item = ET.SubElement(inst, "Param", key=p.get("key"), type=p.get("type"), desc=p.get("desc", ""))
                if "stringValue" in p: p_item.set("value", p["stringValue"])
                elif "int32Value" in p: p_item.set("value", str(p["int32Value"]))

    # Final Output
    xml_str = ET.tostring(root, encoding='utf-8')
    dom = minidom.parseString(xml_str)
    with open(xml_path, "w", encoding="utf-8") as f:
        f.write(dom.toprettyxml(indent="  "))

if __name__ == "__main__":
    files = glob.glob("backend/resources/modules/*.json")
    for f in files:
        target = f.replace(".json", ".xml")
        try:
            lossless_convert(f, target)
            print(f"Verified & Generated: {target}")
        except Exception as e:
            print(f"Failed {f}: {e}")
