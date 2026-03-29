import json
import os
import sys

def extract_registry(input_json, output_base):
    if not os.path.exists(input_json):
        print(f"Error: {input_json} not found.")
        return

    os.makedirs(output_base, exist_ok=True)

    target_mapping = {
        "diffChassis": "chassis_full_attributes.json",
        "steerChassis": "chassis_steer_full_attributes.json",
        "diffWheel": "wheel_full_attributes.json",
        "subDriver": "driver_full_attributes.json",
        "PMSMMotor": "motor_pmsm_full_attributes.json",
        "BLDCMotor": "motor_bldc_full_attributes.json"
    }

    with open(input_json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    registry = {k: [] for k in target_mapping.keys()}

    def process_component(comp):
        gen_attr = comp.get("generalAttr", {})
        sub_type = gen_attr.get("subModuleType", {})
        type_key = sub_type.get("comboType", {}).get("typeKey")
        
        if not type_key or type_key not in target_mapping:
            return
            
        existing_keys = {item["key"] for item in registry[type_key]}
            
        private_attr_obj = comp.get("privateAttr", {})
        private_groups = private_attr_obj.get("privateAttrs", [])
        
        for group in private_groups:
            group_desc = group.get("desc", "General")
            elements = group.get("arrayBaseEle", [])
            for ele in elements:
                key = ele.get("key")
                if key in existing_keys:
                    continue
                    
                clean_ele = {
                    "key": key,
                    "desc": ele.get("desc"),
                    "unit": ele.get("unit"),
                    "group": group_desc,
                    "boolMustfill": ele.get("boolMustfill", False),
                    "boolBasic": ele.get("boolBasic", False),
                    "boolHide": ele.get("boolHide", False),
                    "boolNoeditable": ele.get("boolNoeditable", False),
                    "type": ele.get("type"),
                    "defaultValue": ele.get("doubleValue", ele.get("int32Value", ele.get("stringValue", ele.get("boolValue"))))
                }
                registry[type_key].append(clean_ele)
                existing_keys.add(key)

    # Traverse moreModuleInfo
    for group_info in data.get("moreModuleInfo", []):
        for comp in group_info.get("moduleComponets", []):
            process_component(comp)

    for type_key, filename in target_mapping.items():
        if registry[type_key]:
            path = os.path.join(output_base, filename)
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(registry[type_key], f, indent=2, ensure_ascii=False)
            print(f"Exported {len(registry[type_key])} items to {path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 extractor.py <input.json> <output_dir>")
        sys.exit(1)
    extract_registry(sys.argv[1], sys.argv[2])
