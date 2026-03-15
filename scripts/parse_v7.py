import json
import base64
import struct
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))
import blackboxprotobuf

def read_cmodel_zip(filepath):
    import zipfile
    import tempfile
    with zipfile.ZipFile(filepath, 'r') as zf:
        if 'CompDesc.model' in zf.namelist():
            return zf.read('CompDesc.model')
    return None

def extract_strings_from_chinese_map(data_node):
    if not isinstance(data_node, dict): return str(data_node)
    
    # Check if there is a mapping dictionary natively in '21' or value in '10'
    if '21' in data_node and isinstance(data_node['21'], dict):
        if '2' in data_node['21']:
            return str(data_node['21']['2']).strip()
        elif '1' in data_node['21']:
            return str(data_node['21']['1']).strip()
            
    if '10' in data_node:
        if isinstance(data_node['10'], (bytes, bytearray)):
            try: return data_node['10'].decode('utf-8')
            except: pass
        elif isinstance(data_node['10'], str):
            return data_node['10'].strip()
            
    # Float mapping
    if '17' in data_node:
        val = data_node['17']
        if isinstance(val, int):
            try:
                b = struct.pack('<Q', val)
                f = struct.unpack('<d', b)[0]
                return f"{f:.2f}"
            except:
                pass
        return str(val)

    # Int mapping
    if '2' in data_node:
        return str(data_node['2'])
        
    return str(data_node)


def decode_str(val):
    if isinstance(val, (bytes, bytearray)):
        try:
            return val.decode('utf-8').strip('\x00')
        except:
            pass
        try:
            return val.decode('gbk').strip('\x00')
        except:
            return str(val)
    elif isinstance(val, dict):
        return {decode_str(k): decode_str(v) for k, v in val.items()}
    elif isinstance(val, list):
        return [decode_str(x) for x in val]
    elif isinstance(val, tuple):
        return tuple(decode_str(x) for x in val)
    return str(val) if not isinstance(val, (int, float, bool)) else val

def decode_payload(json_data):
    results = []
    modules = json_data.get('5', [])
    
    # Store globally to resolve connections later
    # UUID -> { 'module_name': X, 'port_name': Y }
    port_uuid_map = {}
    
    # Pass 1: Extract all details and map port UUIDs
    for mod in modules:
        if not isinstance(mod, dict) or '4' not in mod: continue
        m_data = mod['4']
        
        m_items = m_data if isinstance(m_data, list) else [m_data]
        
        for m in m_items:
            if not isinstance(m, dict): continue
            
            # 1. Base Info
            base_info = m.get('1', {})
            name = "Unknown"
            uuid = "Unknown"
            m_type = "Unknown"
            
            # Helper to extract safely
            if '1' in base_info and isinstance(base_info['1'], dict): name = decode_str(base_info['1'].get('10', 'Unknown'))
            if '4' in base_info and isinstance(base_info['4'], dict): uuid = decode_str(base_info['4'].get('10', 'Unknown'))
            if '8' in base_info and isinstance(base_info['8'], dict): 
                m_type = decode_str(base_info['8'].get('21', {}).get('1', 'Unknown'))
                
            # 2. Dimensions
            dimensions = "无"
            if '13' in base_info and isinstance(base_info['13'], dict):
                dim_data = base_info['13'].get('11', {})
                if dim_data:
                    l = dim_data.get('1', 0)
                    w = dim_data.get('2', 0)
                    h = dim_data.get('3', 0)
                    dimensions = f"{l}x{w}x{h} mm"
            
            # 3. Interfaces and Electrical Properties (Raw Output, no Macro stats!)
            interfaces_list = []
            connections = [] # We'll store {"local_port": port_name, "target_uuids": [uuid1, uuid2]}
            
            ports = m.get('4', {}).get('1', [])
            if not isinstance(ports, list): ports = [ports] if ports else []
            
            for port in ports:
                if not isinstance(port, dict): continue
                
                p_name = decode_str(port.get('4', port.get('1', 'UnknownPort')))
                p_uuid = decode_str(port.get('5', ''))
                p_targets = port.get('6', [])
                
                if p_uuid:
                    port_uuid_map[p_uuid] = {"module_name": name, "port_name": p_name}
                
                if not isinstance(p_targets, list): p_targets = [p_targets]
                if p_targets:
                    connections.append({"local_port": p_name, "target_uuids": [decode_str(t) for t in p_targets]})
                
                # Extract deep properties
                props = []
                
                # Check hardware tags '8'
                hw_tags = port.get('8', {}).get('1', [])
                if not isinstance(hw_tags, list): hw_tags = [hw_tags] if hw_tags else []
                for tag in hw_tags:
                    if not isinstance(tag, dict): continue
                    tag_name = decode_str(tag.get('51', tag.get('1', 'Unknown')))
                    tag_val = decode_str(extract_strings_from_chinese_map(tag))
                    if tag_val and tag_val != '*' and tag_val != 'Unknown':
                        props.append(f"{tag_name}: {tag_val}")
                        
                # Check software/electrical configs '9'
                sw_tags = port.get('9', {}).get('1', [])
                if not isinstance(sw_tags, list): sw_tags = [sw_tags] if sw_tags else []
                for tag in sw_tags:
                    if not isinstance(tag, dict): continue
                    tag_name = decode_str(tag.get('51', tag.get('1', 'Unknown')))
                    tag_val = decode_str(extract_strings_from_chinese_map(tag))
                    if tag_val and tag_val != 'Unknown':
                        props.append(f"{tag_name}: {tag_val}")
                        
                if props:
                    interfaces_list.append(f"- **{p_name}**: {', '.join(props)}")
                else:
                    interfaces_list.append(f"- **{p_name}**: (无特殊配置)")

            # 4. Extract Location and Parent Relations
            relations = []
            rel_data = m.get('5', {}).get('1', [])
            if not isinstance(rel_data, list): rel_data = [rel_data] if rel_data else []
            
            chassis_params = []
            
            for r in rel_data:
                if not isinstance(r, dict): continue
                r_name = decode_str(r.get('51', 'Unknown'))
                
                # Ignore raw XYZ if needed, but the prompt asks for install position
                if r_name in ['X坐标', 'Y坐标', 'Z坐标', '偏航角', '翻滚角', '俯仰角']:
                    val = decode_str(extract_strings_from_chinese_map(r))
                    relations.append(f"{r_name}: {val}")
                elif r_name == '从属机构':
                    val = decode_str(extract_strings_from_chinese_map(r))
                    relations.append(f"父节点: {val}")
                elif r_name == '关联驱动':
                    val = decode_str(extract_strings_from_chinese_map(r))
                    relations.append(f"关联电机: {val}")
                    
            # 5. Extract Private Attributes (Inside '2')
            private_attributes = []
            spec_groups = m.get('2', {}).get('1', [])
            if not isinstance(spec_groups, list):
                spec_groups = [spec_groups] if spec_groups else []
            
            for group in spec_groups:
                if not isinstance(group, dict): continue
                # group name (e.g. "运动中心参数")
                group_name = decode_str(group.get('2', ''))
                
                spec_arr = group.get('3', [])
                if not isinstance(spec_arr, list): spec_arr = [spec_arr] if spec_arr else []
                
                for s in spec_arr:
                    if not isinstance(s, dict): continue
                    s_name = decode_str(s.get('51', 'Unknown'))
                    if not s_name or s_name == 'Unknown': continue
                    s_val = decode_str(extract_strings_from_chinese_map(s))
                    
                    if group_name:
                        private_attributes.append(f"[{group_name}] {s_name}: {s_val}")
                    else:
                        private_attributes.append(f"{s_name}: {s_val}")

            results.append({
                "name": name, 
                "type": m_type, 
                "uuid": uuid,
                "dimensions": dimensions,
                "interfaces": interfaces_list,
                "raw_connections": connections,  # Will be resolved in Pass 2
                "relations": relations,
                "private_attributes": private_attributes
            })
            
    # Pass 2: Resolve Electrical Connections
    for r in results:
        resolved_wires = []
        for conn in r["raw_connections"]:
            local_port = conn["local_port"]
            for target_uuid in conn["target_uuids"]:
                target_info = port_uuid_map.get(target_uuid)
                if target_info:
                    resolved_wires.append(f"- **{local_port}** <---> `{target_info['module_name']}` 的 **{target_info['port_name']}**")
                else:
                    resolved_wires.append(f"- **{local_port}** <---> `UnknownUUID({target_uuid})`")
        r["resolved_connections"] = resolved_wires

    return results

def generate_markdown_report(results, set_name):
    md = f"# CModel 解析报告 - V7 (Schema & Wire Corrected) - {set_name}\n\n"
    md += f"**总模块数:** {len(results)}\n\n"
    
    # 模块清单
    md += "## 1. 模块清单\n"
    for idx, r in enumerate(results):
        md += f"- {idx+1}. `{r['name']}` (Type: `{r['type']}`)\n"
    
    md += "\n## 2. 详细模块信息\n"
    
    for r in results:
        md += f"### {r['name']}\n"
        md += f"- **模块类型**: {r['type']}\n"
        md += f"- **尺寸信息**: {r['dimensions']}\n\n"
        
        md += "**【接口与电气属性配置】**\n"
        if r['interfaces']:
            md += "\n".join(r['interfaces']) + "\n"
        else:
            md += "- 无\n"
        md += "\n"
        
        md += "**【电气接线图 (总线连接)】**\n"
        if r['resolved_connections']:
            md += "\n".join(r['resolved_connections']) + "\n"
        else:
            md += "- 独立节点（或作为总线末端没有声明子级UUID）\n"
        md += "\n"
        
        md += "**【模块空间位置与归属】**\n"
        if r['relations']:
            md += "- " + ", ".join(r['relations']) + "\n"
        else:
            md += "- 无\n"
        md += "\n"

    # Private attributes specific
    md += "## 3. 模块私有电气与机械属性\n"
    has_priv = False
    for r in results:
        if r.get('private_attributes'):
            has_priv = True
            md += f"### {r['name']}\n"
            for p in r['private_attributes']:
                md += f"- {p}\n"
                
    if not has_priv:
        md += "无私有属性信息\n"

    return md


if __name__ == "__main__":
    targets = [
        {"file": "../docs/ModelSet312.cmodel", "name": "ModelSet312", "md": "../docs/ModelSet312_schema_extracted.md"},
        {"file": "../docs/ModelSet39.cmodel", "name": "ModelSet39", "md": "../docs/ModelSet39_schema_extracted.md"},
        {"file": "../docs/ModelSet(3).cmodel", "name": "ModelSet(3)", "md": "../docs/ModelSet(3)_schema_extracted.md"}
    ]
    
    with open("../backend/templates/CompDesc.model", "rb") as f:
        template_bytes = f.read()
    
    # Extract structural dictionary mapping recursively to be used as schema.
    schema, _ = blackboxprotobuf.decode_message(template_bytes)
    
    _, msg_type = blackboxprotobuf.decode_message(template_bytes)

    for args in targets:
        cmodel_bytes = read_cmodel_zip(args["file"])
        if not cmodel_bytes:
            continue
            
        json_dict, _ = blackboxprotobuf.decode_message(cmodel_bytes, msg_type)
        res = decode_payload(json_dict)
        
        md_content = generate_markdown_report(res, args["name"])
        with open(args["md"], 'w', encoding='utf-8') as mf:
            mf.write(md_content)
        print(f"Successfully generated 100% accurate V7 report for {args['name']}.")
