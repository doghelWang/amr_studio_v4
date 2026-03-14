import os
import zipfile
import blackboxprotobuf
import struct
import json

def parse_float(val):
    try:
        if isinstance(val, int):
            return struct.unpack('<d', struct.pack('<Q', val))[0]
        elif isinstance(val, float):
            return val
    except: pass
    return 0.0

def parse_str(val):
    if isinstance(val, bytes):
        return val.decode('utf-8', errors='ignore')
    return str(val)

def extract_props(module_data):
    """
    Safely extracts properties from a module's attribute list without recursion.
    In these models, properties are usually stored as a list of dicts where Tag 1 is the key name.
    """
    props = {}
    
    def scan_dict(d):
        key = d.get('1') or d.get(1)
        if isinstance(key, bytes):
            k_str = key.decode('utf-8', errors='ignore')
            # Look for values in specific tags
            if '17' in d: props[k_str] = parse_float(d['17'])
            elif 17 in d: props[k_str] = parse_float(d[17])
            elif '12' in d: props[k_str] = d['12']
            elif 12 in d: props[k_str] = d[12]
            elif '10' in d: props[k_str] = parse_str(d['10'])
            elif 10 in d: props[k_str] = parse_str(d[10])
            elif '5' in d: props[k_str] = d['5'] # Varint
            elif 5 in d: props[k_str] = d[5]
            
        # Check nested dicts/lists up to 2 levels deep to find properties
        for v in d.values():
            if isinstance(v, list):
                for item in v:
                    if isinstance(item, dict): scan_dict(item)
            elif isinstance(v, dict):
                scan_dict(v)

    # Usually properties are in tag 1, 2, 4, 8, 9, 10, 11
    for k, v in module_data.items():
        if isinstance(v, list):
            for item in v:
                if isinstance(item, dict): scan_dict(item)
        elif isinstance(v, dict):
            scan_dict(v)
            
    return props

def analyze_312():
    path = "/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet312.cmodel"
    import tempfile
    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(path, 'r') as zf:
            zf.extractall(tmpdir)
        
        comp_path = os.path.join(tmpdir, "CompDesc.model")
        with open(comp_path, 'rb') as f:
            msg, _ = blackboxprotobuf.decode_message(f.read())
            
        print("====== RAW PROTOBUF STRUCTURE ANALYSIS ======")
        modules = msg.get('5', [])
        if isinstance(modules, dict): modules = [modules]
        
        print(f"Total Modules Found: {len(modules)}")
        
        for idx, mod in enumerate(modules):
            m_data = mod.get('4') or mod.get(4, {})
            
            # Direct Metadata tags (Usually Tag 1 contains a nested structure for meta)
            meta_block = m_data.get('1') or m_data.get(1, {})
            name = "Unknown"
            m_type = "Unknown"
            sub_type = "Unknown"
            uuid = "Unknown"
            parent_uuid = None
            
            if isinstance(meta_block, dict):
                # Try to extract from the raw dict if it's a list of fields
                pass
                
            # Use our property extractor to flatten all keys
            props = extract_props(m_data)
            
            name = props.get('module_name', f'Module_{idx}')
            m_type = props.get('main_module_type', 'unknown')
            sub_type = props.get('sub_module_type', '')
            uid = props.get('module_uuid', '')
            parent = props.get('parentNodeUuid', None)
            
            print(f"\n--- Module {idx+1}: {name} ---")
            print(f"  Type: {m_type} | SubType: {sub_type}")
            print(f"  UUID: {uid}")
            if parent: print(f"  Parent: {parent}")
            
            # Print significant numerical/network props
            coords = {k: v for k, v in props.items() if 'Coord' in k}
            if coords: print(f"  Coordinates: {coords}")
            
            net = {k: v for k, v in props.items() if k in ['ipAddress', 'ip', 'port', 'nodeId', 'can_bus_id']}
            if net: print(f"  Network: {net}")
            
            # Look for specific IO bindings
            if 'safetyEstopKey' in props:
                print(f"  Logic Bind: safetyEstopKey -> {props['safetyEstopKey']}")

if __name__ == "__main__":
    analyze_312()
