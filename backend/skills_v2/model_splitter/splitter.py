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
    
    # Also copy AbiSet.model, FuncDesc.model etc. if they exist in the json_path directory
    # so the output_dir acts as the master directory for building
    base_json_dir = os.path.dirname(os.path.abspath(json_path))
    import shutil
    for fname in os.listdir(base_json_dir):
        if fname.endswith(".model") or (fname.endswith(".json") and fname != os.path.basename(json_path)):
            # don't copy the original CompDesc.json yet
            src = os.path.join(base_json_dir, fname)
            tgt = os.path.join(output_dir, fname)
            if src != tgt:
                shutil.copy2(src, tgt)

    def process_node(node):
        """Recursively process nodes to extract moduleComponets"""
        extracted = 0
        if isinstance(node, dict):
            if "module_componets" in node and isinstance(node["module_componets"], list):
                new_componets = []
                for comp in node["module_componets"]:
                    # extract uuid and name
                    try:
                        uuid_val = comp["general_attr"]["module_uuid"]["string_value"]
                        name_val = comp["general_attr"]["module_name"]["string_value"]
                    except KeyError:
                        uuid_val = "unknown"
                        name_val = "unknown_name"
                    
                    # sanitize name
                    safe_name = "".join([c if c.isalnum() else "_" for c in name_val])
                    filename = f"module_{safe_name}_{uuid_val}.json"
                    filepath = os.path.join(modules_dir, filename)
                    
                    with open(filepath, "w", encoding="utf-8") as out_f:
                        json.dump(comp, out_f, indent=2, ensure_ascii=False)
                    
                    # Store reference
                    new_componets.append({"$ref": f"modules/{filename}"})
                    extracted += 1
                
                # replace
                node["module_componets"] = new_componets
            
            # recursive on more_module_info
            if "more_module_info" in node and isinstance(node["more_module_info"], list):
                for child in node["more_module_info"]:
                    extracted += process_node(child)
        return extracted

    extracted_count = 0
    if "more_module_info" in data or "module_componets" in data:
       extracted_count += process_node(data)
    elif isinstance(data, list):
       for item in data:
           extracted_count += process_node(item)
    
    # Save blueprint
    blueprint_path = os.path.join(output_dir, "blueprint_CompDesc.json")
    with open(blueprint_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Split complete. Extracted {extracted_count} modules.")
    print(f"Blueprint saved to: {blueprint_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser("Split CompDesc.json into modules")
    parser.add_argument("json_path", help="Path to CompDesc.json")
    parser.add_argument("output_dir", help="Directory to save blueprint and modules")
    args = parser.parse_args()
    split_comp_desc(args.json_path, args.output_dir)
