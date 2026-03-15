import os
import zipfile
import tempfile
import struct
import blackboxprotobuf

def decode_utf8(b):
    if isinstance(b, (bytes, bytearray)):
        try: return b.decode('utf-8').strip('\x00')
        except: return str(b)
    return str(b)

def fixed64_to_float(v):
    if not isinstance(v, int): return v
    try: return struct.unpack('<d', struct.pack('<Q', v))[0]
    except: return v

def precision_parse():
    zip_path = "docs/ModelSet312.cmodel"
    with tempfile.TemporaryDirectory() as tmp_dir:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(tmp_dir)
        
        comp_path = os.path.join(tmp_dir, 'CompDesc.model')
        with open(comp_path, 'rb') as f:
            data = f.read()
            # USE BLACKBOX WITHOUT ANY SCHEMA (VERY RAW)
            # This avoids the complex type guessing loop
            msg, _ = blackboxprotobuf.decode_message(data)
            
            # Navigate Tag 5: Modules
            mods = msg.get('5', [])
            if not isinstance(mods, list): mods = [mods]
            
            print(f"--- Precision Parsing ModelSet312 (Raw Tags Only) ---")
            for m in mods:
                name = decode_utf8(m.get('7', ''))
                # Tag 4: Config
                configs = m.get('4', [])
                if not isinstance(configs, list): configs = [configs]
                for c in configs:
                    # Tag 2: Groups
                    groups = c.get('2', [])
                    if not isinstance(groups, list): groups = [groups]
                    for g in groups:
                        # Tag 3: Items
                        items = g.get('3', [])
                        if not isinstance(items, list): items = [items]
                        for item in items:
                            # Tag 51: Property Name
                            # Tag 17/35/45: Property Value (Double)
                            # Tag 21: Enum Value
                            prop_name = decode_utf8(item.get('51', ''))
                            
                            # 🎯 CRITICAL CHECK 1: wheelRadius
                            if "wheelRadius" in prop_name or "轮半径" in prop_name:
                                raw_v = item.get('17', item.get('35', item.get('45', 0)))
                                val = fixed64_to_float(raw_v)
                                print(f"✅ FOUND: [{name}] {prop_name} = {val}")

                            # 🎯 CRITICAL CHECK 2: Main Controller Model
                            if "moduleDscType" in prop_name or "设备型号" in prop_name:
                                # enum value is in Tag 21.1
                                enum_box = item.get('21', {})
                                if isinstance(enum_box, dict):
                                    model = decode_utf8(enum_box.get('1', ''))
                                    print(f"✅ FOUND: [{name}] {prop_name} = {model}")

if __name__ == "__main__":
    precision_parse()
