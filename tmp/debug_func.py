import sys
import os
import json

project_root = r"D:\code\amr_studio_v4"
sys.path.append(project_root)
sys.path.append(os.path.join(project_root, "backend", "core"))

from backend.core.model_parser import ModelParser

cmodel_path = os.path.join(project_root, "docs", "ModelSet312.cmodel")
results = ModelParser.parse_modelset(cmodel_path)
func_desc = results.get("FuncDesc.json")

print("FuncDesc generated structure for locationAbility -> navi:")
if func_desc and "function" in func_desc:
    # locationAbility is usually index 0
    f0 = func_desc["function"][0]
    print(f"Function[0] type: {f0.get('type')}")
    if "childFunction" in f0:
        c0 = f0["childFunction"][0]
        print(f"Child[0] type: {c0.get('type')}")
        print(f"Child[0] keys: {list(c0.keys())}")
        print(f"Child[0] childFunction: {c0.get('childFunction')}")
