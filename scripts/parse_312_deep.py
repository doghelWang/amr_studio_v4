import os
import zipfile
import tempfile
import struct
import json
import blackboxprotobuf

def fixed64_to_float(val):
    if not isinstance(val, int):
        return val
    try:
        return struct.unpack('<d', struct.pack('<Q', val))[0]
    except Exception:
        return val

def decode_str(val):
    if isinstance(val, (bytes, bytearray)):
        try:
            return val.decode('utf-8').strip('\x00')
        except:
            return str(val)
    elif isinstance(val, dict):
        return {decode_str(k): decode_str(v) for k, v in val.items()}
    elif isinstance(val, list):
        return [decode_str(x) for x in val]
    return val

def parse_model_file():
    zip_path = "docs/ModelSet312.cmodel"
    if not os.path.exists(zip_path):
        print(f"Error: {zip_path} not found.")
        return

    print("--- AMR Studio V4: 312 Model Deep Parsing Script ---")
    print("Loading schema and extracting zip...")
    with tempfile.TemporaryDirectory() as tmp_dir:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(tmp_dir)
        
        comp_path = os.path.join(tmp_dir, 'CompDesc.model')
        
        # Load schema from backend
        schema_path = "backend/templates/CompDesc.model"
        with open(schema_path, "rb") as f:
            _, schema = blackboxprotobuf.decode_message(f.read())
            
        with open(comp_path, 'rb') as f:
            msg, _ = blackboxprotobuf.decode_message(f.read(), schema)
            
        print(f"\nRoot keys in msg: {msg.keys()}")
        if '1' in msg:
            modules = msg['1']
        elif '4' in msg:
            modules = msg['4']
        elif '5' in msg:
            modules = msg['5']
        else:
            modules = list(msg.values())[0] if msg else []
            
        if not isinstance(modules, list): 
            modules = [modules] if modules else []
            
        print(f"Found {len(modules)} Modules in ModelSet312.")
        if modules:
            print(f"First module keys: {modules[0].keys()}")
        
        for mod in modules:
            name = decode_str(mod.get('1', 'Unknown'))
            uuid_val = 'Unknown'
            m_type = 'Unknown'
            
            print("="*60)
            print(f"Module (Tag 1): {name}")
            
            inner_configs = mod.get('4', [])
            if not isinstance(inner_configs, list):
                inner_configs = [inner_configs]
                
            for config in inner_configs:
                # General Attributes
                meta_list = config.get('1', [])
                if not isinstance(meta_list, list): meta_list = [meta_list]
                for meta in meta_list:
                    # Look inside meta
                    # UUID is at 4.10
                    uuid_val = decode_str(meta.get('4', {}).get('10', meta.get('4', 'Unknown')))
                    # Type is at 8.21.1
                    m_type_dict = meta.get('8', {})
                    if isinstance(m_type_dict, dict):
                        m_type = decode_str(m_type_dict.get('21', {}).get('1', m_type_dict.get('1', 'Unknown')))
                    elif isinstance(m_type_dict, list) and len(m_type_dict)>0:
                        m_type = decode_str(m_type_dict[0].get('21', {}).get('1', 'Unknown'))
                    
                    parent_uuid = decode_str(meta.get('2', 'Unknown')) # Just guess, wait
                    
                print(f"  Type: {m_type}")
                print(f"  UUID: {uuid_val}")
                        
                print(f"  [Config Keys]: {config.keys()}")
                
                # General Attributes Topology
                meta_list = config.get('1', [])
                if not isinstance(meta_list, list): meta_list = [meta_list]
                for meta in meta_list:
                    parent_uuid = decode_str(meta.get('4', ''))
                    if parent_uuid:
                        print(f"  [Topology] Parent UUID: {parent_uuid}")
                        
                # Private Attributes (Grouped)
                prop_groups = config.get('2', [])
                if isinstance(prop_groups, list) and prop_groups:
                    print("  [Private Attributes]")
                    for group in prop_groups:
                        g_name = decode_str(group.get('2', 'Unknown_Group'))
                        items = group.get('3', [])
                        if not isinstance(items, list): items = [items]
                        for item in items:
                            k = decode_str(item.get('1', ''))
                            # Check types
                            v = item.get('3') # int/fixed64
                            if v is None: v = item.get('4') # double/float
                            if v is None: v = decode_str(item.get('5')) # string
                            
                            if isinstance(v, int) and v > 0xFFFFFFFF:
                                v = fixed64_to_float(v)
                            if k:
                                print(f"    - {g_name} -> {k}: {v}")
                                
                # Interfaces
                interfaces = config.get('4', [])
                if isinstance(interfaces, list) and interfaces:
                    print("  [Electrical Interfaces]")
                    for iface in interfaces:
                        if_name = decode_str(iface.get('1', ''))
                        if_type = decode_str(iface.get('2', ''))
                        target_uuid = decode_str(iface.get('6', ''))
                        print(f"    - Port: {if_name} ({if_type}) -> Connected to: {target_uuid if target_uuid else 'Unconnected'}")
                
                # Structural Params
                struct_params = config.get('5', [])
                if isinstance(struct_params, list) and struct_params:
                    print("  [Structural Params (6D Pose)]")
                    for sp in struct_params:
                        # Find the property keys
                        for k, v in sp.items():
                            pass
                        # Tag 17 usually holds fixed64 double values for coordinates
                        # We just print the raw tag to verify
                        print(f"    - Raw sp keys: {sp.keys()}")
            
            print("-" * 60)

if __name__ == "__main__":
    parse_model_file()
