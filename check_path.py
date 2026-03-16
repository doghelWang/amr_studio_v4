import sys
import os
import json
import backend.core.model_parser as mp

print(f"ModelParser file: {mp.__file__}")

cmodel_path = r"D:\code\amr_studio_v4\docs\ModelSet312.cmodel"
results = mp.ModelParser.parse_modelset(cmodel_path)

func_desc = results.get("FuncDesc.json")
if func_desc:
    # Check locationAbility -> navi
    navi = func_desc["function"][0]["childFunction"][0]
    print(f"NAVI keys: {list(navi.keys())}")
    if "childFunction" in navi:
        print(f"NAVI childFunction: {navi['childFunction']}")
