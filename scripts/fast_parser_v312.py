import os
import zipfile
import tempfile
import struct
import blackboxprotobuf
import json

def decode_val(val):
    if isinstance(val, (bytes, bytearray)):
        try: return val.decode('utf-8').strip('\x00')
        except: return str(val)
    return val

def fixed64_to_float(val):
    if not isinstance(val, int): return val
    try:
        return struct.unpack('<d', struct.pack('<Q', val))[0]
    except:
        return val

def fast_parse_312():
    zip_path = "docs/ModelSet312.cmodel"
    with tempfile.TemporaryDirectory() as tmp_dir:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(tmp_dir)
        
        comp_path = os.path.join(tmp_dir, 'CompDesc.model')
        with open(comp_path, 'rb') as f:
            # Decode WITHOUT schema to be fast and see raw tags
            msg, _ = blackboxprotobuf.decode_message(f.read())
            
        # Tag 5: Modules
        modules = msg.get('5', [])
        if not isinstance(modules, list): modules = [modules]

        print(f"\n[FAST PARSE] Modules found: {len(modules)}")
        
        for mod in modules:
            m_name = decode_val(mod.get('7', 'Unknown'))
            # Tag 4[0]: Config
            configs = mod.get('4', [])
            if not isinstance(configs, list): configs = [configs]
            if not configs: continue
            config = configs[0]
            
            # Tag 2: Groups
            groups = config.get('2', [])
            if not isinstance(groups, list): groups = [groups]
            
            for group in groups:
                # Tag 3: Items
                items = group.get('3', [])
                if not isinstance(items, list): items = [items]
                for item in items:
                    # Tag 51 is the display name
                    key = decode_val(item.get('51', ''))
                    if "wheelRadius" in key or "半径" in key:
                        raw_v = item.get('17', item.get('35', item.get('45', 0)))
                        f_v = fixed64_to_float(raw_v)
                        print(f"✅ FOUND RADIUS: [{m_name}] {key} = {f_v}")
                        
                    if "moduleDscType" in key or "设备型号" in key:
                        # Enum/Combo values are in Tag 21 -> Tag 1
                        enum_data = item.get('21', {})
                        if isinstance(enum_data, dict):
                            val = decode_val(enum_data.get('1', ''))
                            print(f"✅ FOUND MODEL: [{m_name}] {key} = {val}")

if __name__ == "__main__":
    fast_parse_312()
