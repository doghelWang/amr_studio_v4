import json
import sys
import os

def generate_markdown_report(json_path, output_md):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    modules = data.get('5', [])
    if isinstance(modules, dict):
        modules = [modules]

    md_lines = [f"# Model Extraction Report: {os.path.basename(json_path)}", ""]
    
    for mod in modules:
        m_id = mod.get('1', 'Unknown')
        
        m_data = mod.get('4', {})
        base = m_data.get('1', {})
        private_elec = m_data.get('2', {}).get('1', [])
        relations = m_data.get('5', {}).get('1', [])
        
        # 1. Base Info
        m_name = base.get('1', {}).get('10', 'UnknownName')
        m_desc = base.get('3', {}).get('10', '')
        m_uuid = base.get('4', {}).get('10', '')
        m_main_type = base.get('8', {}).get('21', {}).get('1', '')
        m_sub_type = base.get('9', {}).get('21', {}).get('1', '')
        m_vender = base.get('10', {}).get('21', {}).get('1', '')
        
        md_lines.append(f"## Module: {m_name}")
        md_lines.append(f"- **ID**: `{m_id}` | **UUID**: `{m_uuid}`")
        md_lines.append(f"- **Type**: `{m_main_type}` / `{m_sub_type}`")
        md_lines.append(f"- **Vender/Desc**: {m_vender} - {m_desc}")
        
        # 2. Location & Poses
        x = m_data.get('21', {}).get('17', 0.0)
        y = m_data.get('22', {}).get('17', 0.0)
        z = m_data.get('23', {}).get('17', 0.0)
        yaw = m_data.get('15', {}).get('17', 0.0)
        md_lines.append(f"- **Poses (X, Y, Z, YAW)**: `[{x}, {y}, {z}, {yaw}]`")
        
        # 3. Private Info / Electrical Parameters
        if isinstance(private_elec, dict): private_elec = [private_elec]
        if private_elec:
            md_lines.append("- **Electrical & Private Parameters**:")
            for group in private_elec:
                g_name = group.get('2', 'Un-named Group')
                md_lines.append(f"  - **{g_name}**:")
                props = group.get('3', [])
                if isinstance(props, dict): props = [props]
                for p in props:
                    p_key = p.get('1', '')
                    p_desc = p.get('51', '')
                    p_unit = p.get('50', '')
                    
                    # Values can be in different fields based on type
                    p_val = p.get('17') or p.get('35') or p.get('45') or p.get('12') or p.get('20')
                    
                    val_str = f"{p_val} {p_unit}".strip()
                    md_lines.append(f"    - `{p_key}` ({p_desc}): {val_str}")
                    
        # 4. Relations
        if isinstance(relations, dict): relations = [relations]
        if relations:
            md_lines.append("- **Relations (Bindings)**:")
            for rel in relations:
                # 20 is typically the UUID of parent or child node
                r_target = rel.get('21', {}).get('1', 'Unknown_Rel')
                r_type = rel.get('21', {}).get('2', '')
                md_lines.append(f"  - Target UUID: `{r_target}` | Type: `{r_type}`")
                
        # 5. Interfaces
        interfaces = m_data.get('20', [])
        if interfaces:
            md_lines.append("- **Interfaces**:")
            md_lines.append(f"  - *Raw Interfaces found: {len(interfaces)} endpoints*")
            
        md_lines.append("\n---\n")
        
    with open(output_md, 'w', encoding='utf-8') as f:
        f.write("\n".join(md_lines))
    print(f"Generated Markdown report: {output_md}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        pass
    else:
        generate_markdown_report(sys.argv[1], sys.argv[2])
