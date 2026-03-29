import json
import os

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f: return json.load(f)

def get_comp_by_type(data, target_type):
    res = []
    def find(node):
        for c in node.get("module_componets", []):
            gen = c.get("general_attr", {})
            t = gen.get("main_module_type", {}).get("combo_type", {}).get("type_key")
            if t == target_type: res.append(c)
        for sub in node.get("more_module_info", []): find(sub)
    
    # Handle Root stream
    if isinstance(data, dict):
        if "more_module_info" in data:
            for g in data["more_module_info"]: find(g)
    return res

def compare_dicts(d1, d2, path=""):
    diffs = []
    keys = set(d1.keys()) | set(d2.keys())
    for k in sorted(keys):
        p = f"{path}.{k}" if path else k
        if k not in d1: diffs.append(f"[MISSING IN STD] {p} (Actual: {d2[k]})")
        elif k not in d2: diffs.append(f"[MISSING IN GEN] {p} (Expected: {d1[k]})")
        elif isinstance(d1[k], dict) and isinstance(d2[k], dict):
            diffs.extend(compare_dicts(d1[k], d2[k], p))
        elif d1[k] != d2[k]:
            diffs.append(f"[VALUE DIFF] {p} | Std: {d1[k]} | Gen: {d2[k]}")
    return diffs

def generate_report():
    std = load_json('audit_standard/first_group_std.json')
    gen = load_json('audit_generated/first_group_gen.json')
    
    report = ["# CModel 工业级逐行深度对比审计报告\n"]
    
    # 1. Root Group Comparison
    report.append("## 一、 根节点 (ModuleGroup) 层级比对")
    std_g = std["moreModuleInfo"][0]
    gen_g = gen["moreModuleInfo"][0]
    report.append(f"- **标准组名**: `{std_g.get('moduleGroupName')}`")
    report.append(f"- **生成组名**: `{gen_g.get('moduleGroupName')}`")
    
    # 2. Component Detail Comparison (Chassis)
    report.append("\n## 二、 底盘模块 (Chassis) 逐行字段比对")
    std_chassis = std_g["moduleComponets"][0]
    gen_chassis = gen_g["moduleComponets"][0]
    
    diffs = compare_dicts(std_chassis, gen_chassis, "Chassis")
    for d in diffs:
        report.append(f"- {d}")

    # 3. Source Trace Analysis
    report.append("\n## 三、 源码溯源与逻辑分析")
    report.append("### 1. 缺失 subSysType (Tag 7) 与 mainModuleType (Tag 8)")
    report.append("- **定位**: `backend/core/resource_adapter.py` 函数 `map_component_to_cmodel`。")
    report.append("- **原因**: 前端在保存底盘身份信息时未构造符合 PB 规范的 JSON 对象，后端旧版适配器未进行前置注入。")
    
    with open('docs/audit/0328_review/08_ultimate_line_by_line_report.md', 'w') as f:
        f.write("\n".join(report))
    print("Report generated: docs/audit/0328_review/08_ultimate_line_by_line_report.md")

generate_report()
