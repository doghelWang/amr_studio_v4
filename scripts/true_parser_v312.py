import os
import zipfile
import tempfile
import struct
import blackboxprotobuf

def decode_val(val):
    if isinstance(val, (bytes, bytearray)):
        try: return val.decode('utf-8').strip('\x00')
        except: return str(val)
    return val

def fixed64_to_float(val):
    if not isinstance(val, int): return val
    return struct.unpack('<d', struct.pack('<Q', val))[0]

def parse_312():
    zip_path = "docs/ModelSet312.cmodel"
    schema_path = "backend/templates/CompDesc.model"
    
    with tempfile.TemporaryDirectory() as tmp_dir:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(tmp_dir)
        
        with open(schema_path, "rb") as f:
            _, schema = blackboxprotobuf.decode_message(f.read())
            
        with open(os.path.join(tmp_dir, 'CompDesc.model'), 'rb') as f:
            msg, _ = blackboxprotobuf.decode_message(f.read(), schema)

        # Tag 5 is the modules list
        modules = msg.get('5', [])
        if not isinstance(modules, list): modules = [modules]

        print(f"\n[True Parser V312] Analyzing {len(modules)} Modules...")
        print("="*60)

        for mod in modules:
            # Tag 7: Module Name
            # Tag 6: Module Type
            name = decode_val(mod.get('7', 'Unknown'))
            m_type = decode_val(mod.get('6', 'Unknown'))
            
            # Deep Config in Tag 4[0]
            configs = mod.get('4', [])
            if not isinstance(configs, list): configs = [configs]
            if not configs: continue
            
            # config[0]['2'] is private attributes groups
            prop_groups = configs[0].get('2', [])
            if not isinstance(prop_groups, list): prop_groups = [prop_groups]
            
            for group in prop_groups:
                # Group name in Tag 2
                # Group items in Tag 3
                items = group.get('3', [])
                if not isinstance(items, list): items = [items]
                
                for item in items:
                    # Tag 51 is the KEY NAME (e.g. "wheelRadius")
                    # Tag 17/45/35 is the VALUE (fixed64 for double)
                    key_bytes = item.get('51')
                    key_name = decode_val(key_bytes)
                    
                    # Try to get the value from potential tags
                    # Tag 17 is usually the current value (double)
                    # Tag 10 is usually string value for Enums/Combo
                    val_raw = item.get('17', item.get('45', item.get('35', item.get('10'))))
                    
                    # Special semantic check
                    if key_name == "wheelRadius" or "半径" in key_name:
                        actual_val = fixed64_to_float(val_raw)
                        print(f"🎯 FOUND PARAM: [{name}] -> {key_name}: {actual_val}")
                        
                    if key_name == "moduleDscType" or "设备型号" in key_name:
                        # For ComboBox/Enum, the value is in 21.1
                        enum_data = item.get('21', {})
                        if isinstance(enum_data, dict):
                            actual_val = decode_val(enum_data.get('1'))
                            print(f"🎯 FOUND MODEL: [{name}] -> {key_name}: {actual_val}")

if __name__ == "__main__":
    parse_312()
