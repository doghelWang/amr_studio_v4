import sys
import os
import json
import zipfile
import tempfile
import struct
import base64

# Add backend to path to use blackboxprotobuf
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
import blackboxprotobuf

def uint64_to_float(u):
    try:
        if not isinstance(u, int): return None
        return round(struct.unpack('<d', struct.pack('<Q', u))[0], 4)
    except:
        return None

def find_prop(prop_list, key_name):
    # Search by english key '1' or chinese '51'
    for p in prop_list:
        if not isinstance(p, dict): continue
        if p.get('1') == key_name or p.get('51') == key_name:
            if '10' in p: return p['10']
            if '17' in p: return uint64_to_float(p['17'])
            if '21' in p and isinstance(p['21'], dict): 
                return p['21'].get('2') or p['21'].get('1') # Get alias or name
            if '2' in p and isinstance(p['2'], (int, float, str)):
                # Sometimes '2' holds a string value if '10' is omitted, but usually '2' is a type flag.
                pass
    return None

def extract_interfaces(mod_data):
    # Interfaces count
    interfaces = {}
    if '3' in mod_data and '1' in mod_data['3'] and isinstance(mod_data['3']['1'], list):
        for i in mod_data['3']['1']:
            if isinstance(i, dict) and '1' in i and '3' in i:
                interfaces[i['1']] = f"{i['3']}个"
                
    # Interface details (nodeId, IP, etc)
    details = []
    if '4' in mod_data and '1' in mod_data['4'] and isinstance(mod_data['4']['1'], list):
        for port in mod_data['4']['1']:
            if not isinstance(port, dict): continue
            p_name = port.get('4') or port.get('1')
            if not p_name: continue
            
            # Extract specific parameters from port['8']['1']
            if '8' in port and '1' in port['8'] and isinstance(port['8']['1'], list):
                ip = find_prop(port['8']['1'], "ipAddress") or find_prop(port['8']['1'], "IP地址")
                node = find_prop(port['8']['1'], "nodeId") or find_prop(port['8']['1'], "CAN节点ID")
                baud = find_prop(port['8']['1'], "Baudrate") or find_prop(port['8']['1'], "波特率")
                
                info = []
                if ip: info.append(f"IP: {ip}")
                if node is not None: info.append(f"NodeID: {int(node)}")
                if baud is not None: info.append(f"波特率: {int(baud)}")
                
                if info:
                    details.append(f"{p_name} ({', '.join(info)})")
                    
    return interfaces, details

def decode_payload(msg):
    modules = msg.get('5', [])
    if not isinstance(modules, list): return []
    
    results = []
    
    for mod in modules:
        if not isinstance(mod, dict) or '4' not in mod: continue
        m_data = mod['4']
        
        # In protobuf with templates, repeated fields can be lists.
        # usually 4 is a list or a dict.
        m_items = m_data if isinstance(m_data, list) else [m_data]
        
        for m in m_items:
            if not isinstance(m, dict): continue
            
            # 1. Base Info
            base_info = m.get('1', {})
            name = "Unknown"
            m_type = "Unknown"
            
            if '1' in base_info and isinstance(base_info['1'], dict): name = base_info['1'].get('10', 'Unknown')
            if '8' in base_info and isinstance(base_info['8'], dict): 
                m_type = base_info['8'].get('21', {}).get('1', 'Unknown')
                
            uuid = base_info.get('4', {}).get('10')
            
        # 2. Dimensions & Electrical
        dims = {}
        elec = {}
        if '2' in m and '1' in m['2'] and '3' in m['2']['1']:
            props = m['2']['1']['3']
            if isinstance(props, list):
                for k in ["boxLength", "boxwidth", "boxheight", "wheelRadius", "wheelSpace"]:
                    v = find_prop(props, k)
                    if v is not None: dims[k] = v
                for k, label in [("inputVoltage", "输入电压"), ("inputCurrent", "输入电流"), 
                                 ("overloadCapacity", "过载能力"), ("VIN", "供电电压"), 
                                 ("IIN", "输入电流"), ("torque", "额定转矩"), ("gearRatio", "减速比")]:
                    v = find_prop(props, k)
                    if v is not None: elec[k] = v
                    
        # 3. Interfaces
        interfaces, if_details = extract_interfaces(m)
        
        # 4. Connections and Position
        conn = {}
        pos = {}
        chassis_params = {}
        if '5' in m and '1' in m['5'] and isinstance(m['5']['1'], list):
            props = m['5']['1']
            for k in ["locCoordX", "locCoordY", "locCoordZ", "locCoordYAW", "locCoordNX", "locCoordNY", "locCoordNZ"]:
                v = find_prop(props, k)
                if v is not None: 
                    normalized_k = k.replace('locCoordN', 'locCoord').replace('locCoord', '')
                    pos[normalized_k] = v
                    
            parent = find_prop(props, "parentNodeUuid")
            if parent: conn["parentNode"] = parent
            
            rel_motor = find_prop(props, "relateMotor")
            if rel_motor: conn["relateMotor"] = rel_motor

            if m_type == "chassis":
                for k in ["maxSpeed(Idle)", "maxAcceleration(Idle)", "maxDeceleration(Idle)", 
                          "rotateDiameter", "maxClimbingAngle", "totalLoadWeight", "selfWeight"]:
                    v = find_prop(props, k)
                    if v is not None: chassis_params[k] = v

        results.append({
            "name": name, "type": m_type, "uuid": uuid,
            "dims": dims, "elec": elec, "interfaces": interfaces, 
            "if_details": if_details, "pos": pos, "conn": conn,
            "chassis_params": chassis_params
        })
        
    return results

def parse_with_schema(template_path, target_path):
    with open(template_path, 'rb') as f:
        _, msg_type = blackboxprotobuf.decode_message(f.read())
        
    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(target_path, 'r') as zf: zf.extractall(tmpdir)
        comp_path = os.path.join(tmpdir, 'CompDesc.model')
        if not os.path.exists(comp_path): return []
        with open(comp_path, 'rb') as f: data = f.read()

    msg, _ = blackboxprotobuf.decode_message(data, msg_type)
    
    # decode bytes helper built-in
    def decode_val(obj):
        if isinstance(obj, bytes):
            try: return obj.decode('utf-8')
            except: 
                try: return obj.decode('gbk')
                except: return ""
        elif isinstance(obj, dict): return {k: decode_val(v) for k, v in obj.items()}
        elif isinstance(obj, list): return [decode_val(v) for v in obj]
        else: return obj

    clean_msg = decode_val(msg)
    return decode_payload(clean_msg)

def generate_report(target_path, template_path):
    modules = parse_with_schema(template_path, target_path)
    if not modules: return
    
    output = []
    output.append(f"# AMR Studio V7.0 - 模型 ({os.path.basename(target_path)}) 终极精准解析报告")
    
    output.append("\n## 1. 模块清单")
    for idx, m in enumerate(modules):
        output.append(f"- {idx+1}. `{m['name']}` (Type: `{m['type']}`)")
        
    output.append("\n## 2-6. 模块详细信息")
    
    chassis = None
    for m in modules:
        if m['type'] == 'chassis': chassis = m
            
        output.append(f"\n### {m['name']}")
        output.append(f"- **模块类型**: `{m['type']}`")
        if m['dims']: output.append(f"- **尺寸信息**: {m['dims']}")
        else: output.append("- **尺寸信息**: 无")
            
        if m['interfaces'] or m['if_details']:
            output.append("- **接口与网络信息**:")
            if m['interfaces']:
                for k,v in m['interfaces'].items():
                    output.append(f"  - 宏观统计: `{k}`: {v}")
            if m['if_details']:
                for d in m['if_details']:
                    output.append(f"  - 详细电气节点: `{d}`")
        else:
            output.append("- **接口与网络信息**: 无")
            
        # Format POS
        px, py, pz, pyaw = m['pos'].get('X',0), m['pos'].get('Y',0), m['pos'].get('Z',0), m['pos'].get('YAW',0)
        output.append(f"- **安装位置**: X={px}, Y={py}, Z={pz}, Yaw={pyaw}")
        
        if m['conn']:
            c_str = ", ".join([f"{k}: {v}" for k,v in m['conn'].items()])
            output.append(f"- **连接关系**: {c_str}")
        else:
            output.append("- **连接关系**: 顶级节点 (无父级)")
            
        if m['elec']:
            e_str = ", ".join([f"{k}: {v}" for k,v in m['elec'].items()])
            output.append(f"- **电气/属性参数**: {e_str}")
        else:
            output.append("- **电气/属性参数**: 无")
            
    if chassis:
        output.append("\n## 7. 底盘模块专属参数")
        output.append(f"### 模块: {chassis['name']}")
        output.append(f"- **类型**: `{chassis['type']}`")
        if chassis['dims']: output.append(f"- **尺寸信息**: {chassis['dims']}")
        
        px, py, pz, pyaw = chassis['pos'].get('X',0), chassis['pos'].get('Y',0), chassis['pos'].get('Z',0), chassis['pos'].get('YAW',None)
        output.append(f"- **安装位置**: X={px}, Y={py}, Z={pz}, Yaw={pyaw}")
        
        if chassis['chassis_params']:
            output.append("- **主要运动学与负载参数**: ")
            for k,v in chassis['chassis_params'].items():
                output.append(f"  - `{k}`: {v}")
                
    out_file = target_path.replace('.cmodel', '_schema_extracted.md')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(output))
    print(f"Report saved to {out_file}")

if __name__ == '__main__':
    template = "../backend/templates/CompDesc.model"
    generate_report(sys.argv[1], template)
