import os
import sys
import json
import traceback

# Add backend to path
sys.path.insert(0, os.path.join(os.getcwd(), "backend"))

from skills_v2.cmodel_encoder.encoder import encode_cmodel

def test():
    project_id = "new_proj_fgdc27z"
    p_dir = os.path.join("backend", "saved_projects", project_id)
    blueprint_path = os.path.join(p_dir, "blueprint_CompDesc.json")
    output_cmodel = os.path.join(p_dir, f"{project_id}_debug.cmodel")
    
    print(f"DEBUG: Starting compilation for {project_id}")
    print(f"Blueprint: {blueprint_path}")
    
    try:
        audit = encode_cmodel(blueprint_path, output_cmodel)
        print("SUCCESS!")
        for line in audit:
            print(f"  {line}")
    except Exception as e:
        print("FAILED!")
        traceback.print_exc()

if __name__ == "__main__":
    test()
