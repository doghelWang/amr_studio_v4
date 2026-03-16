import sys
import os
import json

# Add project root and backend/core to path
project_root = r"D:\code\amr_studio_v4"
sys.path.append(project_root)
sys.path.append(os.path.join(project_root, "backend", "core"))

from backend.core.model_parser import ModelParser

def export_312():
    cmodel_path = os.path.join(project_root, "docs", "ModelSet312.cmodel")
    output_dir = os.path.join(project_root, "docs", "312_output")
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Parsing: {cmodel_path}")
    results = ModelParser.parse_modelset(cmodel_path)
    
    for filename, data in results.items():
        out_path = os.path.join(output_dir, filename)
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Saved: {out_path}")

if __name__ == "__main__":
    export_312()
