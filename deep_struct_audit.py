import json
import os

def load_json(path):
    if not os.path.exists(path): return {}
    with open(path, 'r', encoding='utf-8') as f: return json.load(f)

def get_node_by_path(data, path_indices):
    """Navigates the Tag-based JSON using a list of keys."""
    curr = data
    for k in path_indices:
        if isinstance(curr, dict) and str(k) in curr:
            curr = curr[str(k)]
        elif isinstance(curr, list) and isinstance(k, int) and k < len(curr):
            curr = curr[k]
        else:
            return None
    return curr

def audit():
    std = load_json('audit_deep/std/CompDesc.json')
    gen = load_json('audit_deep/gen/CompDesc.json')
    
    # 路径：Root -> moreModuleInfo[0] -> moduleComponets[0] -> privateAttr
    # 对应 Tag: 5 -> 0 -> 4 -> 0 -> 2
    std_private = get_node_by_path(std, [5, 0, 4, 0, 2])
    gen_private = get_node_by_path(gen, [5, 0, 4, 0, 2])
    
    report = ["# CModel 深度数据层比对报告 (PrivateAttr & Hierarchy)\n"]
    
    report.append("## 一、 底盘私有属性 (PrivateAttr) 结构对比")
    if std_private and gen_private:
        # 比较 Tag 1 (privateAttrs 数组)
        std_groups = std_private.get("1", [])
        gen_groups = gen_private.get("1", [])
        report.append(f"- 标准属性组数量: {len(std_groups)}")
        report.append(f"- 生成属性组数量: {len(gen_groups)}")
        
        if len(std_groups) > 0 and len(gen_groups) > 0:
            std_group0 = std_groups[0]
            gen_group0 = gen_groups[0]
            report.append("\n### 第一个属性组 (motionCenterAttr) 内部对比")
            # Tag 1: key, Tag 2: desc, Tag 3: arrayBaseEle
            report.append(f"- 标准 [Tag 1 (key)]: {std_group0.get('1')}")
            report.append(f"- 生成 [Tag 1 (key)]: {gen_group0.get('1')}")
            
            std_eles = std_group0.get("3", [])
            gen_eles = gen_group0.get("3", [])
            report.append(f"- 标准元素数量 (Tag 3): {len(std_eles)}")
            report.append(f"- 生成元素数量 (Tag 3): {len(gen_eles)}")
            
            if len(std_eles) > 0 and len(gen_eles) > 0:
                report.append("\n#### 元素[0] (headOffset) 字段级对比")
                s0 = std_eles[0]
                g0 = gen_eles[0]
                # Tag 1: key, Tag 2: type, Tag 17: doubleValue
                for tag in ["1", "2", "17", "50", "51"]:
                    report.append(f"- Tag {tag} | Std: {s0.get(tag)} | Gen: {g0.get(tag)}")
    else:
        report.append("❌ 无法定位私有属性块，请检查解析路径。")

    report.append("\n## 二、 嵌套层级 (Hierarchy) 对比")
    std_sub = get_node_by_path(std, [5, 0, 5]) # moreModuleInfo[0].moreModuleInfo
    gen_sub = get_node_by_path(gen, [5, 0, 5])
    report.append(f"- 标准子模块组数量: {len(std_sub) if std_sub else 0}")
    report.append(f"- 生成子模块组数量: {len(gen_sub) if gen_sub else 0}")

    with open('docs/audit/0328_review/09_deep_struct_audit.md', 'w') as f:
        f.write("\n".join(report))
    print("Done: docs/audit/0328_review/09_deep_struct_audit.md")

audit()
