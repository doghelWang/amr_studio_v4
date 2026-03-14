import os
import zipfile
import re
import struct

def analyze():
    path = "/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet312.cmodel"
    import tempfile
    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(path, 'r') as zf:
            zf.extractall(tmpdir)
        comp_path = os.path.join(tmpdir, "CompDesc.model")
        with open(comp_path, 'rb') as f:
            content = f.read()

    print("=== INDUSTRIAL MODEL 312 ANALYSIS ===")
    
    # Split by module_name
    matches = list(re.finditer(b'module_name', content))
    blocks = []
    for i in range(len(matches)):
        start = matches[i].start()
        end = matches[i+1].start() if i+1 < len(matches) else len(content)
        blocks.append(content[start:end])
        
    print(f"Total Blocks Found: {len(blocks)}\n")

    for i, b in enumerate(blocks):
        # Name
        n_match = re.search(b'module_name.*?R.(.*?)\x9a', b, re.DOTALL)
        name = re.sub(r'[^\x20-\x7E]', '', n_match.group(1).decode('utf-8', errors='ignore')) if n_match else "Unknown"
        
        # UUID
        u_match = re.search(b'module_uuid.*?R\x20(.*?)\x9a', b, re.DOTALL)
        uid = u_match.group(1).decode('utf-8', errors='ignore') if u_match else "None"

        # Type
        t_match = re.search(b'main_module_type.*?\n.(.*?)\x9a', b, re.DOTALL)
        m_type = re.sub(r'[^\x20-\x7E]', '', t_match.group(1).decode('utf-8', errors='ignore')) if t_match else "Unknown"

        # Parent UUID
        p_match = re.search(b'parentNodeUuid.*?R\x20(.*?)\x9a', b, re.DOTALL)
        parent = p_match.group(1).decode('utf-8', errors='ignore') if p_match else "None"

        print(f"Block {i+1}:")
        print(f"  Name: {name}")
        print(f"  Type: {m_type}")
        print(f"  UUID: {uid}")
        if parent != "None": print(f"  Parent: {parent}")

        # Search for coordinates near locCoordX
        pos_x = b.find(b'locCoordX')
        if pos_x != -1:
            sub = b[pos_x:pos_x+100]
            sig = sub.find(b'\x89\x01')
            if sig != -1:
                val = struct.unpack('<d', sub[sig+2:sig+10])[0]
                print(f"  -> Found locCoordX: {val}")
            else:
                print(f"  -> locCoordX string found, but Tag 17 (0x89 0x01) missing. Hex dump:")
                print(f"     {sub[:30].hex()}")
                
        # Same for NX (wheels)
        pos_nx = b.find(b'locCoordNX')
        if pos_nx != -1:
            sub = b[pos_nx:pos_nx+100]
            sig = sub.find(b'\x89\x01')
            if sig != -1:
                val = struct.unpack('<d', sub[sig+2:sig+10])[0]
                print(f"  -> Found locCoordNX: {val}")
            else:
                print(f"  -> locCoordNX string found, but Tag 17 (0x89 0x01) missing. Hex dump:")
                print(f"     {sub[:30].hex()}")

        # IP Address
        ip_match = re.search(b'192\.168\.\d+\.\d+', b)
        if ip_match:
            print(f"  -> Found IP: {ip_match.group(0).decode('utf-8')}")

        # nodeId
        node_pos = b.find(b'nodeId')
        if node_pos != -1:
            sub = b[node_pos:node_pos+50]
            print(f"  -> Found nodeId. Hex context: {sub.hex()}")

        print("-" * 30)

if __name__ == "__main__":
    analyze()
