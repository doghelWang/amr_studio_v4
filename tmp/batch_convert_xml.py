import json
import os
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.dom import minidom

def json_to_xml_converter(json_path, xml_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    group_name = data.get("moduleGroupName", Path(json_path).stem)
    root = ET.Element("ModuleGroup", name=group_name)
    
    components = data.get("moduleComponets", [])
    for comp in components:
        gen = comp.get("generalAttr", {})
        subsys = (gen.get("subSysType") or {}).get("comboType", {}).get("typeKey", "Other")
        category = (gen.get("mainModuleType") or {}).get("comboType", {}).get("typeKey", "unknown")
        m_type = (gen.get("subModuleType") or {}).get("comboType", {}).get("typeKey", "unknown")
        vender = (gen.get("venderName") or {}).get("comboType", {}).get("typeKey", "Generic")
        
        comp_node = ET.SubElement(root, "Component", subsys=subsys, category=category, type=m_type, vender=vender)
        
        # Identity
        id_node = gen.get("moduleName", {})
        desc_node = gen.get("moduleDesc", {})
        icon_node = gen.get("moduleIcon", {})
        ET.SubElement(comp_node, "Identity", 
                      name=id_node.get("stringValue", group_name),
                      desc=desc_node.get("stringValue", ""))
        
        # Attributes
        attrs_node = ET.SubElement(comp_node, "Attributes")
        priv = comp.get("privateAttr", {}).get("privateAttrs", [])
        for group in priv:
            group_node = ET.SubElement(attrs_node, "Group", key=group.get("key"), desc=group.get("desc"))
            for ele in group.get("arrayBaseEle", []):
                p_type = ele.get("type")
                val = ""
                if p_type == "DATA_DOUBLE": val = str(ele.get("doubleValue", 0))
                elif p_type == "DATA_INT32": val = str(ele.get("int32Value", 0))
                elif p_type == "DATA_BOOL": val = str(ele.get("boolValue", False)).lower()
                elif p_type == "DATA_STRING": val = ele.get("stringValue", "")
                elif p_type == "DATA_COMBOX": val = (ele.get("comboType") or {}).get("typeKey", "")
                
                param_node = ET.SubElement(group_node, "Param", 
                                          key=ele.get("key"), 
                                          type=p_type, 
                                          value=val,
                                          desc=ele.get("desc", ""))
                
                if p_type == "DATA_COMBOX":
                    param_node.set("selected", val)
                    opts = (ele.get("comboType") or {}).get("typeGroups", [])
                    for opt in opts:
                        ET.SubElement(param_node, "Option", key=opt.get("key"), desc=opt.get("desc"))

    # Pretty print
    xml_str = ET.tostring(root, encoding='utf-8')
    dom = minidom.parseString(xml_str)
    with open(xml_path, "w", encoding="utf-8") as f:
        f.write(dom.toprettyxml(indent="  "))

if __name__ == "__main__":
    import glob
    from xml.dom import minidom
    files = sorted(glob.glob("backend/resources/modules/*.json"))
    to_convert = files[:70] # Roughly 50%
    
    for f in to_convert:
        xml_f = f.replace(".json", ".xml")
        try:
            json_to_xml_converter(f, xml_f)
            os.remove(f)
            print(f"Converted {f} -> {xml_f}")
        except Exception as e:
            print(f"Failed {f}: {e}")
