import xml.etree.ElementTree as ET
import os

def list_leaves():
    XML_CONFIG = 'specifications/ModuleLibrary/Aggregated/ModuleConfigs.xml'
    XML_PRI = 'specifications/ModuleLibrary/Aggregated/PrivateAttributes.xml'

    tree_config = ET.parse(XML_CONFIG)
    config = tree_config.getroot().find('Config[@file="Module_MainSubType_Classify.json"]')
    
    group_map = {}
    for item in config.findall('Module_MainSub_Type_Desc/Item'):
        main = item.find('MainTypeDesc')
        m_name = f"{main.get('MainUniqueKey')}({main.get('MainTypeName')})"
        sub_keys = [s.get('SubUniquekey') for s in main.findall('SubTypeDesc/Item')]
        group_map[m_name] = sub_keys

    tree_pri = ET.parse(XML_PRI)
    all_leaves = {m.get('type') for m in tree_pri.getroot().findall('Module')}

    print("| 硬件大类 (Hardware Group) | 具体叶子模块 (Leaf Modules) |")
    print("| :--- | :--- |")
    
    mapped_leaves = set()
    for g_name, subs in sorted(group_map.items()):
        found = [s for s in subs if s in all_leaves]
        if found:
            print(f"| **{g_name}** | {', '.join(sorted(found))} |")
            mapped_leaves.update(found)

    others = all_leaves - mapped_leaves
    if others:
        print(f"| **其他/未分配 (Unassigned)** | {', '.join(sorted(others))} |")
    
    print(f"\n**Total Leaf Modules Unique: {len(all_leaves)}**")

if __name__ == "__main__":
    list_leaves()
