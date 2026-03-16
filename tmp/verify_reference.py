import os
import sys
import json
from backend.core.model_parser import ModelParser

def compare_json(actual, reference, label=""):
    print(f"\n--- Comparing {label} ---")
    actual_keys = set(actual.keys())
    ref_keys = set(reference.keys())
    
    match = actual_keys.intersection(ref_keys)
    extra = actual_keys - ref_keys
    missing = ref_keys - actual_keys
    
    print(f"Matching Root Keys: {len(match)}")
    if extra: print(f"Extra Keys in Actual: {extra}")
    if missing: print(f"Missing Keys in Actual: {missing}")
    
    # Check moreModuleInfo for CompDesc
    if "moreModuleInfo" in actual and "moreModuleInfo" in reference:
        a_groups = {g["moduleGroupName"] for g in actual["moreModuleInfo"]}
        r_groups = {g["moduleGroupName"] for g in reference["moreModuleInfo"]}
        print(f"Matching Groups: {len(a_groups.intersection(r_groups))}")
        print(f"Actual Groups: {list(a_groups)[:5]}...")
        print(f"Ref Groups: {list(r_groups)[:5]}...")

def validate():
    # Attempt to find the most matching .cmodel
    cmodel_path = r"D:\code\amr_studio_v4\docs\reference\ModuleLibrary\AmrModelTem\MQ-Q3-600LE-D(T)\MQ-Q3-600LE-D(T).cmodel"
    if not os.path.exists(cmodel_path):
        # Fallback
        cmodel_path = r"D:\code\amr_studio_v4\docs\reference\ModuleLibrary\AmrModelTem\四舵轮\四舵轮.cmodel"
        
    print(f"Validating with: {os.path.basename(cmodel_path)}")
    
    results = ModelParser.parse_modelset(cmodel_path)
    
    for filename, actual_data in results.items():
        ref_path = os.path.join(r"D:\code\amr_studio_v4\docs\reference", filename)
        if os.path.exists(ref_path):
            with open(ref_path, 'r', encoding='utf-8') as f:
                ref_data = json.load(f)
            compare_json(actual_data, ref_data, filename)
            
            # Save actual for inspection
            out_path = os.path.join(r"D:\code\amr_studio_v4\tmp", f"actual_{filename}")
            with open(out_path, 'w', encoding='utf-8') as f:
                json.dump(actual_data, f, indent=4, ensure_ascii=False)
            print(f"Actual saved to: {out_path}")
        else:
            print(f"Reference for {filename} not found.")

if __name__ == "__main__":
    project_root = r"D:\code\amr_studio_v4"
    backend_core = os.path.join(project_root, "backend", "core")
    if project_root not in sys.path:
        sys.path.append(project_root)
    if backend_core not in sys.path:
        sys.path.append(backend_core)
        
    try:
        validate()
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        import traceback
        traceback.print_exc()
