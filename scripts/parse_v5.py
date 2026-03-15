import os
import sys
import zipfile
import tempfile
import re
import struct

def extract_double(block, key):
    try:
        idx = block.find(b'R ' + key.encode('utf-8'))
        if idx == -1: idx = block.find(key.encode('utf-8'))
        if idx == -1: return None
        sub = block[idx:]
        sig = sub.find(b'\x89\x01')
        if sig != -1 and sig < 100:
            val = struct.unpack('<d', sub[sig+2:sig+10])[0]
            if -1000000 < val < 1000000: return round(val, 4)
    except: pass
    return None

def extract_string(block, key):
    try:
        # Looking for the key, usually followed by length and string
        idx = block.find(key.encode('utf-8'))
        if idx == -1: return None
        sub = block[idx+len(key):idx+150]
        
        # We need to distinguish between finding a UUID and finding a regular name
        if b"Uuid" in key.encode('utf-8') or b"module_uuid" in key.encode('utf-8'):
            # UUIDs are 32 byte hex strings
            m = re.search(rb'([a-f0-9]{32})', sub)
            if m: return m.group(1).decode('utf-8', errors='ignore')
            
        # Try finding protobuf string pattern: \x12 + length(1byte) + string
        # Or typical AMR Studio pattern: R + \x20 + length + string
        
        # Specifically targeting module names and types which are alphanumeric + hyphens
        # Sometimes there's a prefix byte
        m = re.search(rb'(?:R[ \x20-\x25]|\x12[ \x01-\x50]|\n[ \x01-\x50])([a-zA-Z0-9_\-\. ]{3,30})(?:\x9a|\x82|\x8a)', sub)
        if m:
            s = m.group(1).decode('utf-8', errors='ignore')
            return re.sub(r'[^\x20-\x7E]', '', s).strip()
            
        m2 = re.search(rb'[A-Z]?[a-zA-Z0-9_\-\. ]{2,20}', sub)
        if m2:
            return m2.group(0).decode('utf-8', errors='ignore').strip()
    except: pass
    return None

def count_and_detail_interfaces(block):
    interfaces = {}
    
    can_count = len(re.findall(rb'CAN_[0-9]', block))
    if can_count > 0:
        can_node = extract_double(block, "nodeId") 
        if can_node is not None:
            interfaces['CAN'] = f"{can_count}个 (NodeID: {int(can_node)})"
        else:
            interfaces['CAN'] = f"{can_count}个"
            
    eth_count = len(re.findall(rb'ETH_[0-9]', block))
    if eth_count > 0:
        ip = extract_string(block, "IP") or extract_string(block, "ipAddress") or extract_string(block, "ip")
        
        ip_match = re.search(rb'192\.168\.\d+\.\d+', block)
        if ip_match: interfaces['ETH'] = f"{eth_count}个 (IP: {ip_match.group(0).decode()})"
        elif ip: interfaces['ETH'] = f"{eth_count}个 (IP: {ip})"
        else: interfaces['ETH'] = f"{eth_count}个"
        
    for i in ["UART", "RS232", "RS485", "DI", "DO", "AI", "AO", "PI", "PO", "LINE", "ENCR"]:
        count = len(re.findall(f"{i}_[0-9]".encode('utf-8'), block))
        if count > 0:
            interfaces[i] = f"{count}个"
            
    if 'ETH' not in interfaces:
        ip_match = re.search(rb'192\.168\.\d+\.\d+', block)
        if ip_match:
            interfaces['ETH'] = f"1个 (IP: {ip_match.group(0).decode()})"
            
    return interfaces

def get_dimensions(block):
    dims = {}
    for k in ["boxLength", "boxwidth", "boxheight", "wheelRadius", "wheelSpace"]:
        v = extract_double(block, k)
        if v is not None: dims[k] = v
    return dims

def get_electrical(block):
    elec = {}
    for k in ["inputVoltage", "inputCurrent", "overloadCapacity", "VIN", "VOUT", "IIN", "IOUT", "RatedRPM", "torque", "gearRatio"]:
        v = extract_double(block, k)
        if v is not None: elec[k] = v
    return elec

def parse_model(path):
    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(path, 'r') as zf: zf.extractall(tmpdir)
        comp_path = os.path.join(tmpdir, 'CompDesc.model')
        if not os.path.exists(comp_path): return [], {}
        with open(comp_path, 'rb') as f: content = f.read()

    matches = list(re.finditer(b'module_name', content))
    blocks = [content[matches[i].start():matches[i+1].start() if i+1 < len(matches) else len(content)] for i in range(len(matches))]

    modules = []
    uuid_to_name = {}

    # Initial pass for accurate Names vs UUIDs
    # In earlier versions, true_parser.py used exact regex for names:
    for b in blocks:
        # Proven Name Logic:
        n_match = re.search(b'module_name.*?R.(.*?)\x9a', b, re.DOTALL)
        name = re.sub(r'[^\x20-\x7E]', '', n_match.group(1).decode('utf-8', errors='ignore')) if n_match else "Unknown"
        
        u_match = re.search(b'module_uuid.*?R\x20(.*?)\x9a', b, re.DOTALL)
        uid = u_match.group(1).decode('utf-8', errors='ignore') if u_match else None
        
        if name != "Unknown" and uid:
            uuid_to_name[uid] = name

    # Second pass
    for b in blocks:
        n_match = re.search(b'module_name.*?R.(.*?)\x9a', b, re.DOTALL)
        name = re.sub(r'[^\x20-\x7E]', '', n_match.group(1).decode('utf-8', errors='ignore')) if n_match else "Unknown"
        
        t_match = re.search(b'main_module_type.*?\n.(.*?)\x9a', b, re.DOTALL)
        m_type = re.sub(r'[^\x20-\x7E]', '', t_match.group(1).decode('utf-8', errors='ignore')) if t_match else extract_string(b, "main_module_type")
        
        dims = get_dimensions(b)
        interfaces = count_and_detail_interfaces(b)
        
        pos = {
            "X": extract_double(b, "locCoordX") or extract_double(b, "locCoordNX"),
            "Y": extract_double(b, "locCoordY") or extract_double(b, "locCoordNY"),
            "Z": extract_double(b, "locCoordZ") or extract_double(b, "locCoordNZ"),
            "Yaw": extract_double(b, "locCoordYAW")
        }
        
        conn = {}
        # Parent connection
        p_match = re.search(b'parentNodeUuid.*?R\x20(.*?)\x9a', b, re.DOTALL)
        parent_uuid = p_match.group(1).decode('utf-8', errors='ignore') if p_match else extract_string(b, "parentNodeUuid")
        if parent_uuid and len(parent_uuid) > 10:
            conn["parentNode"] = uuid_to_name.get(parent_uuid, parent_uuid)
            
        # Relate Motor connection
        rm_match = re.search(b'relateMotor.*?R\x20(.*?)\x9a', b, re.DOTALL) 
        relate_motor_uuid = rm_match.group(1).decode('utf-8', errors='ignore') if rm_match else extract_string(b, "relateMotor")
        if relate_motor_uuid and len(relate_motor_uuid) > 10:
            conn["relateMotor"] = uuid_to_name.get(relate_motor_uuid, relate_motor_uuid)
            
        elec = get_electrical(b)
        
        chassis_params = None
        if m_type == "chassis":
            chassis_params = {}
            for k in ["maxSpeed(Idle)", "maxAcceleration(Idle)", "maxDeceleration(Idle)", 
                      "rotateDiameter", "maxClimbingAngle", "totalLoadWeight", "selfWeight"]:
                v = extract_double(b, k)
                if v is not None: chassis_params[k] = v
            
        modules.append({
            "name": name,
            "type": m_type or "Unknown",
            "dims": dims,
            "interfaces": interfaces,
            "pos": pos,
            "conn": conn,
            "elec": elec,
            "chassis_params": chassis_params
        })
        
    return modules, uuid_to_name

def generate_report(path):
    modules, _ = parse_model(path)
    if not modules: return
    
    output = []
    output.append(f"# AMR Studio V7.0 - 模型 ({os.path.basename(path)}) 精密解析报告 (V5)")
    
    output.append("\n## 1. 模块清单")
    for idx, m in enumerate(modules):
        output.append(f"- {idx+1}. `{m['name']}` (Type: `{m['type']}`)")
        
    output.append("\n## 2-6. 模块详细信息 (包含接口与电气连接)")
    
    chassis = None
    for m in modules:
        if m['type'] == 'chassis':
            chassis = m
            
        output.append(f"\n### {m['name']}")
        output.append(f"- **模块类型**: `{m['type']}`")
        if m['dims']: output.append(f"- **尺寸信息**: {m['dims']}")
        else: output.append("- **尺寸信息**: 无")
            
        if m['interfaces']:
            output.append("- **接口与网络信息**:")
            for k,v in m['interfaces'].items():
                output.append(f"  - `{k}`: {v}")
        else:
            output.append("- **接口与网络信息**: 无接口定义")
            
        p = m['pos']
        output.append(f"- **安装位置**: X={p.get('X',0)}, Y={p.get('Y',0)}, Z={p.get('Z',0)}, Yaw={p.get('Yaw',0)}")
        
        if m['conn']:
            c_str = ", ".join([f"{k}: {v}" for k,v in m['conn'].items()])
            output.append(f"- **电气/逻辑连接关系**: {c_str}")
        else:
            output.append("- **电气/逻辑连接关系**: 无连接/顶级节点")
            
        if m['elec']:
            e_str = ", ".join([f"{k}: {v}" for k,v in m['elec'].items()])
            output.append(f"- **核心参数 (电气/减速比等)**: {e_str}")
        else:
            output.append("- **核心参数**: 无")
            
    if chassis:
        output.append("\n## 7. 底盘模块专属参数")
        output.append(f"### 模块: {chassis['name']}")
        output.append(f"- **类型**: `{chassis['type']}`")
        if chassis['dims']: output.append(f"- **尺寸信息**: {chassis['dims']}")
        
        p = chassis['pos']
        output.append(f"- **安装位置**: X={p.get('X',0)}, Y={p.get('Y',0)}, Z={p.get('Z',0)}, Yaw={p.get('Yaw',0)}")
        
        if chassis['chassis_params']:
            output.append("- **主要运动学与负载参数**: ")
            for k,v in chassis['chassis_params'].items():
                output.append(f"  - `{k}`: {v}")
                
    out_file = path.replace('.cmodel', '_extracted.md')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(output))
    print(f"Report saved to {out_file}")

if __name__ == '__main__':
    generate_report(sys.argv[1])
