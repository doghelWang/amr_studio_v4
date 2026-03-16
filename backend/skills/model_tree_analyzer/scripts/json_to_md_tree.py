import os
import sys
import json
import argparse

def format_value(v):
    if v is None: return "None"
    return str(v)

def parse_property(p):
    """Extract key/value from a 312 Property message."""
    try:
        key = p.get("1", "unknown")
        # Try different value types
        val = "N/A"
        if "10" in p: val = p["10"] # string
        elif "17" in p or "35" in p: # double
            val = p.get("17", p.get("35"))
        elif "30" in p: val = p["30"] # int32
        elif "21" in p and "1" in p["21"]: val = p["21"]["1"] # combox
        
        desc = p.get("51", "")
        unit = p.get("50", "")
        return f"{key}: `{val}` {unit} ({desc})"
    except:
        return "Error parsing property"

def analyze_json(input_file, output_file):
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found")
        sys.exit(1)
        
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        md = []
        md.append("# CModel 结构分析报告")
        md.append(f"源文件: `{os.path.basename(input_file)}`\n")
        
        nodes = data.get("5", [])
        if not nodes:
            md.append("> [!WARNING]\n> 未在 field 5 中找到任何节点数据。")
        else:
            md.append(f"## 节点列表 (总计: {len(nodes)})\n")
            
            for i, node in enumerate(nodes):
                name = node.get("1", f"Node_{i}")
                md.append(f"### 📍 {name}")
                
                # Component Info (4.1)
                comp = node.get("4", {}).get("1", {})
                if comp:
                    uuid = comp.get("4", {}).get("10", "N/A")
                    main_type = comp.get("8", {}).get("21", {}).get("1", "N/A")
                    sub_type = comp.get("9", {}).get("21", {}).get("1", "N/A")
                    md.append(f"- **UUID**: `{uuid}`")
                    md.append(f"- **主类型**: `{main_type}`")
                    md.append(f"- **子类型**: `{sub_type}`")
                
                # Attributes (4.2.1)
                attr_groups = node.get("4", {}).get("2", {}).get("1", [])
                if attr_groups:
                    md.append("\n**属性组:**")
                    for group in attr_groups:
                        g_name = group.get("2", "未命名组")
                        md.append(f"  - **{g_name}**")
                        props = group.get("3", [])
                        for p in props:
                            md.append(f"    - {parse_property(p)}")
                
                # Interfaces (4.4.1)
                ifaces = node.get("4", {}).get("4", {}).get("1", [])
                if ifaces:
                    md.append("\n**接口:**")
                    for iface in ifaces:
                        i_name = iface.get("1", "unknown")
                        i_uuid = iface.get("5", "N/A")
                        remote = iface.get("6", "None")
                        md.append(f"  - `{i_name}` (UUID: `{i_uuid}`) -> 连接至: `{remote}`")
                
                # Relations (4.5.1)
                rels = node.get("4", {}).get("5", {}).get("1", [])
                if rels:
                    md.append("\n**层级关系 & 安装位置:**")
                    for r in rels:
                        r_key = r.get("1", "unknown")
                        if r_key == "parentNodeUuid":
                            p_name = r.get("21", {}).get("2", "unknown")
                            p_uuid = r.get("21", {}).get("1", "N/A")
                            md.append(f"  - **父节点**: `{p_name}` (`{p_uuid}`)")
                        else:
                            md.append(f"  - {parse_property(r)}")
                
                md.append("\n---\n")

        if not output_file:
            output_file = input_file + "_analysis.md"
            
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(md))
            
        print(f"Analysis markdown saved to: {output_file}")
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analyze Model JSON and export to Markdown tree")
    parser.add_argument("input", help="Path to the decoded JSON file")
    parser.add_argument("-o", "--output", help="Output Markdown file path (optional)")
    
    args = parser.parse_args()
    analyze_json(args.input, args.output)
