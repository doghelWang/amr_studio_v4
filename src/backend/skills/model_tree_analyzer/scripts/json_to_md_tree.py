import os
import sys
import json
import argparse

def format_value(v):
    if v is None: return "None"
    return str(v)

def parse_property(p):
    """Extract key/value from a 312 Property message (field 10, 17, 30, 35)."""
    try:
        key = p.get("1", "unknown")
        val = "N/A"
        if "10" in p: val = p["10"]
        elif "17" in p or "35" in p:
            val = p.get("17", p.get("35"))
        elif "30" in p: val = p["30"]
        elif "21" in p and "1" in p["21"]: val = p["21"]["1"]
        
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
        
        # Format 1: Fan Serialized (moreModuleInfo)
        if "moreModuleInfo" in data:
            md.append(f"## 模块组列表 (总计: {len(data['moreModuleInfo'])})\n")
            for group in data["moreModuleInfo"]:
                group_name = group.get("moduleGroupName", "Unnamed Group")
                for comp in group.get("moduleComponets", []):
                    gen_attr = comp.get("generalAttr", {})
                    name = gen_attr.get("moduleName", {}).get("stringValue", "Unknown")
                    uuid = gen_attr.get("moduleUuid", {}).get("stringValue", "N/A")
                    
                    md.append(f"### 📍 {name} (Group: {group_name})")
                    md.append(f"- **UUID**: `{uuid}`")
                    
                    # Attributes
                    md.append("\n**属性 (Private Attributes):**")
                    p_attrs = comp.get("privateAttr", {}).get("privateAttrs", [])
                    if not p_attrs:
                        md.append("  - *None*")
                    for attr in p_attrs:
                        key = attr.get("key", "N/A")
                        val = attr.get("stringValue") or attr.get("doubleValue") or attr.get("boolValue")
                        unit = attr.get("unit", "")
                        desc = attr.get("desc", "")
                        md.append(f"  - **{key}**: `{val}` {unit} *({desc})*")
                    
                    # Interfaces
                    md.append("\n**接口 (Interfaces):**")
                    ifaces = comp.get("interfaceParams", {}).get("interfaceGroup", [])
                    if not ifaces:
                        md.append("  - *None*")
                    for inter in ifaces:
                        iname = inter.get("interfaceName", "N/A")
                        itype = inter.get("interfaceType", "N/A")
                        md.append(f"  - `{iname}` ({itype})")
                    
                    md.append("\n---\n")

        # Format 2: Raw Protobuf (field 5)
        elif "5" in data:
            nodes = data.get("5", [])
            if not isinstance(nodes, list): nodes = [nodes]
            
            md.append(f"## 节点列表 (总计: {len(nodes)})\n")
            for i, node in enumerate(nodes):
                name = node.get("1", f"Node_{i}")
                md.append(f"### 📍 {name}")
                
                # ... (field 5 parsing logic)
                md.append("\n---\n")
        else:
            md.append("> [!WARNING]\n> 未能识别有效的模型结构 (moreModuleInfo 或 field 5).")

        if not output_file:
            output_file = input_file + "_analysis.md"
            
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(md))
            
        print(f"Analysis markdown saved to: {output_file}")
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analyze Model JSON and export to Markdown tree")
    parser.add_argument("input", help="Path to the decoded JSON file")
    parser.add_argument("-o", "--output", help="Output Markdown file path (optional)")
    args = parser.parse_args()
    analyze_json(args.input, args.output)
