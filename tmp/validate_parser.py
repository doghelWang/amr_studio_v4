import os
import sys
import json
import shutil
from backend.core.model_parser import ModelParser

def validate():
    cmodel_path = r"D:\code\amr_studio_v4\docs\reference\ModuleLibrary\AmrModelTem\四舵轮\四舵轮.cmodel"
    output_base = r"D:\code\amr_studio_v4\tmp\validation_output"
    os.makedirs(output_base, exist_ok=True)
    
    print(f"--- Validating: {cmodel_path} ---")
    
    # 1. Parse using existing parser
    result = ModelParser.parse_modelset(cmodel_path)
    
    # 2. Save result
    actual_json_path = os.path.join(output_base, "actual_output.json")
    with open(actual_json_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=4, ensure_ascii=False)
    
    print(f"Results saved to: {actual_json_path}")
    
    # 3. Print high-level comparison
    print("\n[Current Parser Result Summary]")
    print(f"Config Keys: {list(result.get('config', {}).keys())}")
    print(f"Wheels: {len(result['config'].get('wheels', []))}")
    print(f"Sensors: {len(result['config'].get('sensors', []))}")
    
    # 4. Load Reference
    ref_path = r"D:\code\amr_studio_v4\docs\reference\CompDesc.json"
    with open(ref_path, 'r', encoding='utf-8') as f:
        ref_data = json.load(f)
    print(f"\n[Reference Summary]")
    print(f"Ref Root Keys: {list(ref_data.keys())}")
    if 'moreModuleInfo' in ref_data:
        print(f"Ref Module Groups: {len(ref_data['moreModuleInfo'])}")

if __name__ == "__main__":
    # Add project root to sys.path
    project_root = r"D:\code\amr_studio_v4"
    if project_root not in sys.path:
        sys.path.append(project_root)
    validate()
