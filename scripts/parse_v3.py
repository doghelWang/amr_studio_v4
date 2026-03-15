import os
import sys
import zipfile
import tempfile
import re
import struct

def extract_double(block, key):
    try:
        idx = block.find(b'R ' + key.encode('utf-8'))
        if idx == -1:
            # try without R space just in case
            idx = block.find(key.encode('utf-8'))
        if idx == -1: return None
        
        sub = block[idx:]
        sig = sub.find(b'\x89\x01')
        if sig != -1 and sig < 100:
            val = struct.unpack('<d', sub[sig+2:sig+10])[0]
            if -1000000 < val < 1000000:
                return round(val, 4)
    except:
        pass
    return None

def count_interfaces(block):
    interfaces = ["CAN", "UART", "RS232", "DI", "DO", "AI", "PI", "PO", "ETH", "LINE", "ENCR"]
    found = {}
    for i in interfaces:
        count = len(re.findall(f"R {i}_".encode('utf-8'), block))
        if count > 0:
            found[i] = count
    return found

def get_dimensions(block):
    dims = {}
    for k in ["boxLength", "boxwidth", "boxheight", "wheelRadius", "wheelSpace"]:
        v = extract_double(block, k)
        if v is not None:
            dims[k] = v
    return dims

def get_electrical(block):
    elec = {}
    for k in ["inputVoltage", "inputCurrent", "overloadCapacity", "VIN", "VOUT", "IIN", "IOUT", "RatedRPM", "torque", "gearRatio"]:
        v = extract_double(block, k)
        if v is not None:
            elec[k] = v
    return elec

def get_connections(block):
    conn = {}
    p_match = re.search(b'parentNodeUuid.*?R\x20(.*?)\x9a', block, re.DOTALL)
    if p_match: conn["parentNodeUuid"] = p_match.group(1).decode('utf-8', errors='ignore')
    
    rm_match = re.search(b'relateMotor.*?R.(.*?)\x9a', block, re.DOTALL)
    if rm_match: conn["relateMotor"] = rm_match.group(1).decode('utf-8', errors='ignore')
        
    return conn

def get_chassis_params(block):
    params = {}
    keys = ["maxSpeed(Idle)", "maxAcceleration(Idle)", "maxDeceleration(Idle)", 
            "rotateDiameter", "maxClimbingAngle", "totalLoadWeight", "selfWeight"]
    for k in keys:
        v = extract_double(block, k)
        if v is not None:
            params[k] = v
    return params

def parse_model(path):
    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(path, 'r') as zf: zf.extractall(tmpdir)
        comp_path = os.path.join(tmpdir, 'CompDesc.model')
        if not os.path.exists(comp_path): return []
        with open(comp_path, 'rb') as f: content = f.read()

    matches = list(re.finditer(b'module_name', content))
    blocks = [content[matches[i].start():matches[i+1].start() if i+1 < len(matches) else len(content)] for i in range(len(matches))]

    modules = []

    for b in blocks:
        n_match = re.search(b'module_name.*?R.(.*?)\x9a', b, re.DOTALL)
        name = re.sub(r'[^\x20-\x7E]', '', n_match.group(1).decode('utf-8', errors='ignore')) if n_match else "Unknown"
        
        t_match = re.search(b'main_module_type.*?\n.(.*?)\x9a', b, re.DOTALL)
        m_type = re.sub(r'[^\x20-\x7E]', '', t_match.group(1).decode('utf-8', errors='ignore')) if t_match else "Unknown"
        
        dims = get_dimensions(b)
        interfaces = count_interfaces(b)
        
        pos = {
            "X": extract_double(b, "locCoordX") or extract_double(b, "locCoordNX"),
            "Y": extract_double(b, "locCoordY") or extract_double(b, "locCoordNY"),
            "Z": extract_double(b, "locCoordZ") or extract_double(b, "locCoordNZ"),
            "Yaw": extract_double(b, "locCoordYAW")
        }
        
        conn = get_connections(b)
        elec = get_electrical(b)
        
        chassis_params = None
        if m_type == "chassis":
            chassis_params = get_chassis_params(b)
            
        modules.append({
            "name": name,
            "type": m_type,
            "dims": dims,
            "interfaces": interfaces,
            "pos": pos,
            "conn": conn,
            "elec": elec,
            "chassis_params": chassis_params
        })
        
    return modules

def generate_report(path):
    modules = parse_model(path)
    output = []
    output.append(f"# AMR Studio V7.0 - 模型 ({os.path.basename(path)}) 精密解析报告")
    
    # Requirement 1: Module List
    output.append("\n## 1. 模块清单")
    for idx, m in enumerate(modules):
        output.append(f"- {idx+1}. `{m['name']}` (Type: `{m['type']}`)")
        
    output.append("\n## 2-6. 模块详细信息")
    
    chassis = None
    for m in modules:
        if m['type'] == 'chassis':
            chassis = m
            # We don't continue because we still want to show basic chassis info in the list 
            # (or we can skip and show all in 7). Let's skip and show all in 7.
            continue
            
        output.append(f"\n### {m['name']}")
        output.append(f"- **模块类型 (Type)**: `{m['type']}`")
        if m['dims']:
            output.append(f"- **尺寸信息 (Size)**: {m['dims']}")
        else:
            output.append("- **尺寸信息 (Size)**: 无 (N/A)")
            
        if m['interfaces']:
            if_str = ", ".join([f"{k} ({v}个)" for k,v in m['interfaces'].items()])
            output.append(f"- **接口信息 (Interfaces)**: {if_str}")
        else:
            output.append("- **接口信息 (Interfaces)**: 无 (N/A)")
            
        p = m['pos']
        output.append(f"- **安装位置 (Position)**: X={p.get('X',0)}, Y={p.get('Y',0)}, Z={p.get('Z',0)}, Yaw={p.get('Yaw',0)}")
        
        if m['conn']:
            c_str = ", ".join([f"{k}: {v}" for k,v in m['conn'].items()])
            output.append(f"- **连接关系 (Connections)**: {c_str}")
        else:
            output.append("- **连接关系 (Connections)**: 无连接")
            
        if m['elec']:
            e_str = ", ".join([f"{k}: {v}" for k,v in m['elec'].items()])
            output.append(f"- **电气参数 (Electrical)**: {e_str}")
        else:
            output.append("- **电气参数 (Electrical)**: 无 (N/A)")
            
    if chassis:
        output.append("\n## 7. 底盘模块专属参数 (Chassis Parameters)")
        output.append(f"### 模块: {chassis['name']}")
        output.append(f"- **类型 (Type)**: `{chassis['type']}`")
        if chassis['dims']:
            output.append(f"- **尺寸信息 (Size)**: {chassis['dims']}")
        else:
            output.append("- **尺寸信息 (Size)**: 无 (N/A)")
        
        p = chassis['pos']
        output.append(f"- **安装位置 (Position)**: X={p.get('X',0)}, Y={p.get('Y',0)}, Z={p.get('Z',0)}, Yaw={p.get('Yaw',0)}")
        
        if chassis['chassis_params']:
            output.append("- **核心底盘运动学参数 (Kinematics)**: ")
            for k,v in chassis['chassis_params'].items():
                output.append(f"  - `{k}`: {v}")
        else:
            output.append("- **核心底盘运动学参数**: 没有解析到特有参数。")
                
    out_file = path.replace('.cmodel', '_extracted_v3.md')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(output))
    print(f"Report saved to {out_file}")

if __name__ == '__main__':
    generate_report(sys.argv[1])
