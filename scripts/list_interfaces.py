import xml.etree.ElementTree as ET
import os

def list_interfaces():
    XML_CONFIG = 'specifications/ModuleLibrary/Aggregated/ModuleConfigs.xml'
    XML_INTF = 'specifications/ModuleLibrary/Aggregated/InterfaceSpecs.xml'

    # Load Interface Classification
    tree_config = ET.parse(XML_CONFIG)
    config = tree_config.getroot().find('Config[@file="Interface_MainSubType_Classify.json"]')
    
    group_map = {}
    if config is not None:
        for item in config.findall('Interface_MainSub_Type_Desc/Item'):
            main = item.find('MainTypeInfo')
            if main is not None:
                m_name = f"{main.get('MainUniqueKey')}({main.get('MainTypeName')})"
                sub_keys = [s.get('SubUniquekey') for s in main.findall('SubTypeInfo/Item')]
                group_map[m_name] = sub_keys

    # Load All Interfaces from Specs
    tree_intf = ET.parse(XML_INTF)
    fix_types = {i.get('type') for i in tree_intf.getroot().find('InterfaceFixAttrs').findall('Interface')}
    param_types = {i.get('type') for i in tree_intf.getroot().find('InterfaceParams').findall('Interface')}
    all_intf = fix_types | param_types

    print("| 接口大类 (Interface Group) | 具体接口类型 (Interface Types) |")
    print("| :--- | :--- |")
    
    mapped_intf = set()
    for g_name, subs in sorted(group_map.items()):
        found = []
        for s in subs:
            # Match directly or by prefix (e.g. 'DI' matches 'DI/DI1')
            matches = [i for i in all_intf if i == s or i.startswith(f"{s}/")]
            found.extend(matches)
            
        if found:
            print(f"| **{g_name}** | {', '.join(sorted(set(found)))} |")
            mapped_intf.update(found)

    others = all_intf - mapped_intf
    if others:
        print(f"| **其他/未分配 (Unassigned)** | {', '.join(sorted(others))} |")
    
    print(f"\n**Total Unique Interface Types/Variants: {len(all_intf)}**")

if __name__ == "__main__":
    list_interfaces()
