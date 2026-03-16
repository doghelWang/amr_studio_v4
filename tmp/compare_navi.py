import json
import os

ref_path = r"D:\code\amr_studio_v4\docs\reference\FuncDesc.json"
gen_path = r"D:\code\amr_studio_v4\docs\312_output\FuncDesc.json"

with open(ref_path, 'r', encoding='utf-8') as f:
    ref = json.load(f)
with open(gen_path, 'r', encoding='utf-8') as f:
    gen = json.load(f)

print("Navi (function[0].childFunction[0]) Comparison:")
ref_navi = ref["function"][0]["childFunction"][0]
gen_navi = gen["function"][0]["childFunction"][0]

print(f"REF Navi keys: {list(ref_navi.keys())}")
print(f"GEN Navi keys: {list(gen_navi.keys())}")

if "attr" in ref_navi:
    print(f"REF Navi attr: {json.dumps(ref_navi['attr'], indent=2, ensure_ascii=False)}")
if "attr" in gen_navi:
    print(f"GEN Navi attr: {json.dumps(gen_navi['attr'], indent=2, ensure_ascii=False)}")
