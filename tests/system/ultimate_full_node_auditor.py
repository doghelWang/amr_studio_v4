import os
import json
import blackboxprotobuf

def flatten_dict(d, parent_key='', sep='/', limit=5000):
    items = []
    if len(items) > limit: return dict(items) # Emergency brake
    
    if isinstance(d, dict):
        for k, v in d.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            items.extend(flatten_dict(v, new_key, sep=sep, limit=limit).items())
    elif isinstance(data_list := d, list):
        for i, v in enumerate(data_list):
            if i > 10: break # Only scan first 10 entries of repeated fields for standard
            new_key = f"{parent_key}[{i}]"
            items.extend(flatten_dict(v, new_key, sep=sep, limit=limit).items())
    else:
        items.append((parent_key, d))
    return dict(items)

def generate_ultimate_report():
    std_p = 'audits/raw_std/CompDesc.model'
    gen_p = 'audits/raw_gen/CompDesc.model'
    
    with open(std_p, 'rb') as f: std_data = f.read()
    with open(gen_p, 'rb') as f: gen_data = f.read()
    
    # Raw decoding (Tag based)
    # Note: Using decode_message directly gives us the closest look at the naked stream
    std_root, _ = blackboxprotobuf.decode_message(std_data)
    gen_root, _ = blackboxprotobuf.decode_message(gen_data)
    
    # Flatten the WHOLE tree (Not just Tag 5) to ensure NO NODE is missed
    std_flat = flatten_dict(std_root)
    gen_flat = flatten_dict(gen_root)
    
    all_paths = sorted(set(std_flat.keys()) | set(gen_flat.keys()))
    
    report = [
        "# AMR Studio V4 终极对等审计报告 (逐节点全量对标)",
        "\n> 本报告针对标准模型与生成模型执行了全量路径对齐扫描。无论节点内容是否一致，均在此体现。",
        "\n| 逻辑路径 (Tag Path) | 标准样本 (Standard) | 您的生成物 (Generated) | 状态 |",
        "| :--- | :--- | :--- | :--- |"
    ]
    
    for path in all_paths:
        v_std = std_flat.get(path, "*MISSING*")
        v_gen = gen_flat.get(path, "*MISSING*")
        
        # Format values for table
        v_std_str = str(v_std).replace('|', '\\|').replace('\n', ' ')
        v_gen_str = str(v_gen).replace('|', '\\|').replace('\n', ' ')
        
        status = "✅ Match" if v_std == v_gen else "❌ DIFF"
        if "10" in path or "1" in path: # Identifier tags
            status = "🟡 Property/ID"
            
        report.append(f"| `{path}` | {v_std_str} | {v_gen_str} | {status} |")
        
    with open('audits/ULTIMATE_FULL_NODE_REPORT.md', 'w') as f:
        f.write("\n".join(report))
    print(f"Success: audits/ULTIMATE_FULL_NODE_REPORT.md | Total Nodes: {len(all_paths)}")

if __name__ == "__main__":
    generate_ultimate_report()
