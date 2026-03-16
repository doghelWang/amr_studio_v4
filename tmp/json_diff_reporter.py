import json
import os

def compare_dicts(dict1, dict2, path=""):
    diffs = []
    keys1 = set(dict1.keys())
    keys2 = set(dict2.keys())
    
    missing = keys1 - keys2
    extra = keys2 - keys1
    common = keys1 & keys2
    
    for k in missing:
        diffs.append(f"MISSING: {path}.{k}")
    for k in extra:
        diffs.append(f"EXTRA: {path}.{k}")
    
    for k in common:
        v1 = dict1[k]
        v2 = dict2[k]
        new_path = f"{path}.{k}" if path else k
        
        if isinstance(v1, dict) and isinstance(v2, dict):
            diffs.extend(compare_dicts(v1, v2, new_path))
        elif isinstance(v1, list) and isinstance(v2, list):
            diffs.extend(compare_lists(v1, v2, new_path))
        elif v1 != v2:
            diffs.append(f"VALUE MISMATCH: {new_path} ('{v1}' vs '{v2}')")
    return diffs

def compare_lists(list1, list2, path=""):
    diffs = []
    # Special handling for "Property Object" lists (lists of dicts with 'key' or 'moduleGroupName')
    if all(isinstance(x, dict) for x in list1) and all(isinstance(x, dict) for x in list2):
        # Try to find a common identifier
        ident = None
        if list1 and 'key' in list1[0]: ident = 'key'
        elif list1 and 'moduleGroupName' in list1[0]: ident = 'moduleGroupName'
        
        if ident:
            d1 = {x[ident]: x for x in list1 if ident in x}
            d2 = {x[ident]: x for x in list2 if ident in x}
            return compare_dicts(d1, d2, path)
            
    if len(list1) != len(list2):
        diffs.append(f"LENGTH MISMATCH: {path} ({len(list1)} vs {len(list2)})")
    
    # Basic index comparison if no identifier found
    for i in range(min(len(list1), len(list2))):
        v1 = list1[i]
        v2 = list2[i]
        new_path = f"{path}[{i}]"
        if isinstance(v1, dict) and isinstance(v2, dict):
            diffs.extend(compare_dicts(v1, v2, new_path))
        elif isinstance(v1, list) and isinstance(v2, list):
            diffs.extend(compare_lists(v1, v2, new_path))
        elif v1 != v2:
            diffs.append(f"VALUE MISMATCH: {new_path} ('{v1}' vs '{v2}')")
    return diffs

def generate_report():
    ref_dir = r"D:\code\amr_studio_v4\docs\reference"
    out_dir = r"D:\code\amr_studio_v4\docs\312_output"
    files = ["AbiSet.json", "CompDesc.json", "FuncDesc.json"]
    
    report = []
    for filename in files:
        report.append(f"\n{'='*20}\nFILE: {filename}\n{'='*20}")
        ref_path = os.path.join(ref_dir, filename)
        out_path = os.path.join(out_dir, filename)
        
        if not os.path.exists(ref_path):
            report.append(f"ERROR: Reference file {filename} not found.")
            continue
        
        with open(ref_path, 'r', encoding='utf-8') as f:
            ref_data = json.load(f)
        with open(out_path, 'r', encoding='utf-8') as f:
            out_data = json.load(f)
            
        diffs = compare_dicts(ref_data, out_data)
        if not diffs:
            report.append("RESULT: PERFECT MATCH ✅")
        else:
            report.append(f"RESULT: {len(diffs)} differences found.")
            # Sort and limit output
            for d in sorted(diffs)[:50]:
                report.append(f"  - {d}")
            if len(diffs) > 50:
                report.append("  - ... (truncated)")
                
    with open(r"D:\code\amr_studio_v4\tmp\diff_report.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(report))
    print("\n".join(report))

if __name__ == "__main__":
    generate_report()
