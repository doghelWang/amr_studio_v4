import os
import zipfile
import re
import struct

def decode_varint(data, pos):
    result = 0
    shift = 0
    while pos < len(data):
        b = data[pos]
        result |= (b & 0x7f) << shift
        if not (b & 0x80):
            return result
        pos += 1
        shift += 7
    return result

def extract_double(b, key_names):
    if isinstance(key_names, str): key_names = [key_names]
    for key_name in key_names:
        pos = b.find(key_name.encode('utf-8'))
        if pos == -1: continue
        sub = b[pos:pos+100]
        sig = sub.find(b'\x89\x01')
        if sig != -1:
            return struct.unpack('<d', sub[sig+2:sig+10])[0]
    return 0.0

def parse_312_to_text():
    path = "/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet312.cmodel"
    import tempfile
    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(path, 'r') as zf: zf.extractall(tmpdir)
        with open(os.path.join(tmpdir, 'CompDesc.model'), 'rb') as f: content = f.read()

    matches = list(re.finditer(b'module_name', content))
    blocks = [content[matches[i].start():matches[i+1].start() if i+1 < len(matches) else len(content)] for i in range(len(matches))]

    print("=================================================================")
    print("AMR Studio V7.0 - 工业模型 (ModelSet312.cmodel) 深度解析报告")
    print("=================================================================\n")

    mcu, io, wheels, sensors, actuators, aux = [], [], [], [], [], []
    robot_name = "Unknown"

    for b in blocks:
        # Proven regexes
        n_match = re.search(b'module_name.*?R.(.*?)\x9a', b, re.DOTALL)
        name = re.sub(r'[^\x20-\x7E]', '', n_match.group(1).decode('utf-8', errors='ignore')) if n_match else "Unknown"
        
        u_match = re.search(b'module_uuid.*?R\x20(.*?)\x9a', b, re.DOTALL)
        uid = u_match.group(1).decode('utf-8', errors='ignore') if u_match else "None"

        t_match = re.search(b'main_module_type.*?\n.(.*?)\x9a', b, re.DOTALL)
        m_type = re.sub(r'[^\x20-\x7E]', '', t_match.group(1).decode('utf-8', errors='ignore')) if t_match else "Unknown"

        p_match = re.search(b'parentNodeUuid.*?R\x20(.*?)\x9a', b, re.DOTALL)
        parent = p_match.group(1).decode('utf-8', errors='ignore') if p_match else "None"
        
        x = extract_double(b, ["locCoordNX", "locCoordX"])
        y = extract_double(b, ["locCoordNY", "locCoordY"])
        z = extract_double(b, ["locCoordNZ", "locCoordZ"])
        yaw = extract_double(b, "locCoordYAW")
        
        ip_match = re.search(b'192\.168\.\d+\.\d+', b)
        ip = ip_match.group(0).decode('utf-8') if ip_match else "N/A"

        node_id = "None"
        node_pos = b.find(b'nodeId')
        if node_pos != -1:
            sub = b[node_pos:node_pos+30]
            sig = sub.find(b'\x60')
            if sig != -1: node_id = decode_varint(sub, sig+1)

        entity = {
            "name": name, "uuid": uid, "type": m_type, "parent": parent,
            "x": x, "y": y, "z": z, "yaw": yaw, "ip": ip, "nodeId": node_id
        }

        if m_type == "chassis":
            robot_name = name
            print(f"📦 【底盘架构】 {name}")
            print(f"  └─ 类型: DIFFERENTIAL | UUID: {uid[:8]}...")
        elif m_type == "mainCPU":
            mcu.append(entity)
        elif m_type == "extendedlnterface":
            io.append(entity)
        elif m_type == "driveWheel":
            wheels.append(entity)
        elif m_type == "sensor":
            sensors.append(entity)
        elif m_type == "driver":
            actuators.append(entity)
        elif m_type in ["button", "light"]:
            aux.append(entity)

    print("\n🧠 【主控制器 (MCU)】")
    for m in mcu:
        print(f"  * 型号: {m['name']}")
        print(f"    - UUID: {m['uuid']}")
        print(f"    - 坐标位置: X={m['x']} Y={m['y']}")
        print(f"    - 下游总线 (推断): CAN0, ETH0")

    print("\n🔌 【IO 控制模块 (IO Boards)】")
    for i in io:
        print(f"  * 型号: {i['name']}")
        print(f"    - 节点 ID (CAN): {i['nodeId']}")
        print(f"    - 坐标位置: X={i['x']} Y={i['y']}")

    print("\n⚙️ 【驱动与执行器 (Drivers & Actuators)】")
    for d in actuators:
        print(f"  * {d['name']}")
        if d['nodeId'] != "None": print(f"    - 节点 ID (CAN): {d['nodeId']}")
        if d['parent'] != "None": print(f"    - 父节点 UUID: {d['parent'][:8]}...")

    print("\n🛞 【轮组 (Drive Wheels)】")
    for w in wheels:
        print(f"  * {w['name']}")
        print(f"    - 坐标位置: X={w['x']} Y={w['y']}")
        if w['parent'] != "None": print(f"    - 挂载底盘 UUID: {w['parent'][:8]}...")

    print("\n📡 【传感器 (Sensors)】")
    for s in sensors:
        print(f"  * {s['name']}")
        if s['ip'] != "N/A": print(f"    - IP 地址: {s['ip']}")
        print(f"    - 安装位姿: X={s['x']}, Y={s['y']}, Z={s['z']}, Yaw={s['yaw']}")
        if s['parent'] != "None": print(f"    - 父节点 UUID: {s['parent'][:8]}...")

    print("\n🔘 【辅助设备 (Buttons, Lights, Batteries)】")
    for a in aux:
        print(f"  * {a['name']} ({a['type']})")
        print(f"    - 坐标位置: X={a['x']} Y={a['y']}")
        if a['parent'] != "None": print(f"    - 电气连接 (父节点): {a['parent'][:8]}...")

    print("\n=================================================================")

if __name__ == "__main__":
    parse_312_to_text()
