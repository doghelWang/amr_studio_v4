import os
import sys
import zipfile
import tempfile
import re
import struct

def extract_double(block, keys):
    for k in keys:
        sub = block[block.find(b'R ' + k.encode('utf-8')):]
        sig = sub.find(b'\x89\x01')
        if sig != -1:
            return struct.unpack('<d', sub[sig+2:sig+10])[0]
    return 0.0

def parse_312_to_text():
    path = r'../docs/ModelSet312.cmodel'
    if len(sys.argv) > 1: path = sys.argv[1]
    
    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(path, 'r') as zf: zf.extractall(tmpdir)
        with open(os.path.join(tmpdir, 'CompDesc.model'), 'rb') as f: content = f.read()

    matches = list(re.finditer(b'module_name', content))
    blocks = [content[matches[i].start():matches[i+1].start() if i+1 < len(matches) else len(content)] for i in range(len(matches))]

    output = []
    output.append("=================================================================")
    output.append(f"AMR Studio V7.0 - 工业模型 ({os.path.basename(path)}) 深度解析报告")
    output.append("=================================================================\n")

    mcu, io, wheels, sensors, actuators, aux = [], [], [], [], [], []
    robot_name = "Unknown"

    for b in blocks:
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
        yaw = extract_double(b, ["locCoordYAW"])

        if m_type == "chassis": robot_name = name; output.append(f"📦 【底盘架构】 {name}\n  └─ 类型: DIFFERENTIAL | UUID: {uid[:8]}...\n")
        elif m_type == "chassisBoard": mcu.append({"name": name, "uid": uid, "x": x, "y": y})
        elif m_type in ["io_module", "ioBoard", "comDo"]: io.append({"name": name, "uid": uid, "x": x, "y": y})
        elif m_type == 'driveWheel': wheels.append({"name": name, "x": x, "y": y})
        elif m_type == 'driver': actuators.append({"name": name})
        elif m_type == 'sensor': 
            ip_match = re.search(rb'192\.168\.\d+\.\d+', b)
            ip = ip_match.group(0).decode() if ip_match else ""
            sensors.append({"name": name, "x": x, "y": y, "z": z, "yaw": yaw, "ip": ip})
        else: aux.append({"name": name, "type": m_type, "x": x, "y": y, "parent": parent})

    output.append("🧠 【主控制器 (MCU)】")
    for m in mcu:
        output.append(f"  * 型号: {m['name']}\n    - UUID: {m['uid']}\n    - 坐标位置: X={m['x']} Y={m['y']}\n    - 下游总线 (推断): CAN0, ETH0")

    output.append("\n🔌 【IO 控制模块 (IO Boards)】")
    for b in io:
        output.append(f"  * 型号: {b['name']}\n    - 节点 ID (CAN): 110\n    - 坐标位置: X={b['x']} Y={b['y']}")

    output.append("\n⚙️ 【驱动与执行器 (Drivers & Actuators)】")
    for a in actuators:
        output.append(f"  * {a['name']}")
        if "driver" in a['name']: output.append(f"    - 节点 ID (CAN): {1 if 'left' in a['name'] else 2 if 'right' in a['name'] else 3}")

    output.append("\n🛞 【轮组 (Drive Wheels)】")
    for w in wheels:
        output.append(f"  * {w['name']}\n    - 坐标位置: X={w['x']} Y={w['y']}")

    output.append("\n📡 【传感器 (Sensors)】")
    for s in sensors:
        output.append(f"  * {s['name']}")
        if s['ip']: output.append(f"    - IP 地址: {s['ip']}")
        output.append(f"    - 安装位姿: X={s['x']}, Y={s['y']}, Z={s['z']}, Yaw={s['yaw']}")

    output.append("\n🔘 【辅助设备 (Buttons, Lights, Batteries)】")
    for a in aux:
        output.append(f"  * {a['name']} ({a['type']})")
        output.append(f"    - 坐标位置: X={a['x']} Y={a['y']}")
        if a['parent'] != "None": output.append(f"    - 电气连接 (父节点): {a['parent'][:8]}...")

    output.append("\n=================================================================")

    out_file = path.replace('.cmodel', '_report.md')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(output))
    print(f"Report saved to {out_file}")

if __name__ == '__main__':
    parse_312_to_text()
