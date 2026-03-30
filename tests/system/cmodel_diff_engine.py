import json
import os
import sys

def deep_compare(d1, d2, path=""):
    """
    Recursively compares two JSON trees and returns a list of differences.
    """
    diffs = []
    if type(d1) != type(d2):
        diffs.append(f"[Type Mismatch] {path}: {type(d1)} vs {type(d2)}")
        return diffs

    if isinstance(d1, dict):
        # Check for missing keys in both directions
        keys1 = set(d1.keys())
        keys2 = set(d2.keys())
        for k in keys1 - keys2:
            diffs.append(f"[Missing in Target] {path}/{k}")
        for k in keys2 - keys1:
            diffs.append(f"[Extra in Target] {path}/{k}")
        
        # Recurse into common keys
        for k in keys1 & keys2:
            diffs.extend(deep_compare(d1[k], d2[k], f"{path}/{k}"))
            
    elif isinstance(d1, list):
        if len(d1) != len(d2):
            diffs.append(f"[Length Mismatch] {path}: {len(d1)} vs {len(d2)}")
        # Compare available elements
        for i in range(min(len(d1), len(d2))):
            diffs.extend(deep_compare(d1[i], d2[i], f"{path}[{i}]"))
    else:
        if d1 != d2:
            # High-precision check for floats
            if isinstance(d1, float) and isinstance(d2, float):
                if abs(d1 - d2) > 0.0001:
                    diffs.append(f"[Value Difference] {path}: {d1} vs {d2}")
            else:
                diffs.append(f"[Value Difference] {path}: {d1} vs {d2}")
                
    return diffs

def run_audit(std_json_path, gen_json_path, report_path):
    with open(std_json_path, 'r', encoding='utf-8') as f: std = json.load(f)
    with open(gen_json_path, 'r', encoding='utf-8') as f: gen = json.load(f)
    
    diffs = deep_compare(std, gen)
    
    report = [
        "# CModel 逐项对比验证审计报告",
        f"- **标准样本**: {std_json_path}",
        f"- **对比目标**: {gen_json_path}",
        f"- **结论**: {'❌ FAIL' if diffs else '✅ PASS'}",
        "\n## 差异详情 (Detailed Diffs)"
    ]
    
    if not diffs:
        report.append("- 物理与逻辑数据完全对齐。")
    else:
        for d in diffs:
            report.append(f"- {d}")
            
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(report))
    print(f"Audit report saved to: {report_path}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 cmodel_diff_engine.py <std_json> <gen_json> <report_md>")
    else:
        run_audit(sys.argv[1], sys.argv[2], sys.argv[3])
