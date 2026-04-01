import json
import os
import xml.etree.ElementTree as ET
import glob

def verify_private_attributes(base_path, xml_file):
    print("Verifying Private Attributes...")
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    xml_modules = {m.get("type"): m for m in root.findall("Module")}
    
    pri_attr_dir = os.path.join(base_path, "ModuleAttrTem", "Pri_Attr")
    json_modules = [d for d in os.listdir(pri_attr_dir) if os.path.isdir(os.path.join(pri_attr_dir, d))]
    
    missing = []
    mismatch = []
    
    for m_type in json_modules:
        json_file = os.path.join(pri_attr_dir, m_type, "PrivateAttribute.json")
        if not os.path.exists(json_file): continue
        
        if m_type not in xml_modules:
            missing.append(m_type)
            continue
            
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            json_attr_count = sum(len(grp.get("arrayBaseEle", [])) for grp in data.get("privateAttrs", []))
            
            xml_attr_count = len(xml_modules[m_type].findall(".//Attribute"))
            if json_attr_count != xml_attr_count:
                mismatch.append(f"{m_type}: JSON={json_attr_count}, XML={xml_attr_count}")
                
    if missing: print(f"  Missing Modules: {missing}")
    if mismatch: print(f"  Attr Count Mismatches: {mismatch}")
    if not missing and not mismatch: print("  ✅ All modules and attribute counts match.")

def verify_interface_specs(base_path, xml_file):
    print("Verifying Interface Specs...")
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    xml_fix = {i.get("type"): i for i in root.find("InterfaceFixAttrs").findall("Interface")}
    xml_param = {i.get("type"): i for i in root.find("InterfaceParams").findall("Interface")}
    
    # Check FixAttrs
    fix_dir = os.path.join(base_path, "ModuleAttrTem", "Interface_Attr")
    json_fix_count = 0
    for root_dir, dirs, files in os.walk(fix_dir):
        if "InterfaceFixAttr.json" in files: json_fix_count += 1
    
    print(f"  FixAttr: JSON files={json_fix_count}, XML nodes={len(xml_fix)}")
    
    # Check Params
    param_dir = os.path.join(base_path, "ModuleAttrTem", "Interface_Prarm")
    json_param_count = 0
    for root_dir, dirs, files in os.walk(param_dir):
        if "InterfaceParam.json" in files: json_param_count += 1
        
    print(f"  Params: JSON files={json_param_count}, XML nodes={len(xml_param)}")

def verify_module_configs(base_path, xml_file):
    print("Verifying Module Configs...")
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    xml_configs = {c.get("file") for c in root.findall("Config")}
    xml_scripts = {s.get("file") for s in root.findall("Script")}
    
    config_dir = os.path.join(base_path, "ModuleConfig")
    json_files = {f for f in os.listdir(config_dir) if f.endswith(".json")}
    lua_files = {f for f in os.listdir(config_dir) if f.endswith(".lua")}
    
    missing_json = json_files - xml_configs
    missing_lua = lua_files - xml_scripts
    
    if missing_json: print(f"  Missing JSON Configs: {missing_json}")
    if missing_lua: print(f"  Missing Lua Scripts: {missing_lua}")
    if not missing_json and not missing_lua: print("  ✅ All config files are accounted for.")

if __name__ == "__main__":
    BASE = "/Users/wangfeifei/code/amr_studio_v4/specifications/ModuleLibrary"
    AGG_DIR = os.path.join(BASE, "Aggregated")
    
    verify_private_attributes(BASE, os.path.join(AGG_DIR, "PrivateAttributes.xml"))
    verify_interface_specs(BASE, os.path.join(AGG_DIR, "InterfaceSpecs.xml"))
    verify_module_configs(BASE, os.path.join(AGG_DIR, "ModuleConfigs.xml"))
