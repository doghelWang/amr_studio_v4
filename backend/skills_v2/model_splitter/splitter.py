import json
import os
import argparse

def split_comp_desc(json_path, output_dir):
    print(f"Reading {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    os.makedirs(output_dir, exist_ok=True)
    modules_dir = os.path.join(output_dir, "modules")
    os.makedirs(modules_dir, exist_ok=True)
    
    module_count = 0

    def recurse(node):
        nonlocal module_count
        if isinstance(node, dict):
            # ━━━ KEY FIX: Adaptive Key Detection ━━━
            # Supports both 'module_componets' (snake) and 'moduleComponets' (camel)
            comp_key = "moduleComponets" if "moduleComponets" in node else "module_componets"
            info_key = "moreModuleInfo" if "moreModuleInfo" in node else "more_module_info"

            if comp_key in node and isinstance(node[comp_key], list):
                for i, comp in enumerate(node[comp_key]):
                    # Extract UUID from generalAttr (Camel) or general_attr (Snake)
                    gen = comp.get("generalAttr") or comp.get("general_attr") or {}
                    muuid_obj = gen.get("moduleUuid") or gen.get("module_uuid") or {}
                    mname_obj = gen.get("moduleName") or gen.get("module_name") or {}
                    
                    muuid = muuid_obj.get("stringValue") or muuid_obj.get("string_value") or f"unknown_{module_count}"
                    mname = mname_obj.get("stringValue") or mname_obj.get("string_value") or "unknown"
                    
                    filename = f"module_{mname}_{muuid}.json"
                    filepath = os.path.join(modules_dir, filename)
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(comp, f, ensure_ascii=False, indent=2)
                    
                    # Leave reference
                    node[comp_key][i] = {"$ref": f"modules/{filename}"}
                    module_count += 1
            
            if info_key in node and isinstance(node[info_key], list):
                for sub_group in node[info_key]:
                    recurse(sub_group)

    recurse(data)
    
    blueprint_path = os.path.join(output_dir, "blueprint_CompDesc.json")
    with open(blueprint_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Split complete. Extracted {module_count} modules.")
    print(f"Blueprint saved to: {blueprint_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Split CompDesc.json into blueprint and modules")
    parser.add_argument("json_path", help="Path to CompDesc.json")
    parser.add_argument("output_dir", help="Directory to save blueprint and modules")
    args = parser.parse_args()
    split_comp_desc(args.json_path, args.output_dir)
