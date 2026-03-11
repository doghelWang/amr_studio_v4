import blackboxprotobuf
import pprint

def safe_traverse_and_find_interfaces(data):
    if isinstance(data, list):
        for item in data: yield from safe_traverse_and_find_interfaces(item)
    elif isinstance(data, dict):
        # Interfaces in these models often have Tag 1 (Name) and Tag 2 (Type/Enum)
        k1 = data.get("1") or data.get(1)
        k2 = data.get("2") or data.get(2)
        
        if isinstance(k1, bytes) and (isinstance(k2, bytes) or isinstance(k2, int) or isinstance(k2, dict)):
            yield data
        
        for v in data.values():
            if isinstance(v, (dict, list)): yield from safe_traverse_and_find_interfaces(v)

with open('/Users/wangfeifei/code/amr_studio_v4/backend/templates/CompDesc.model', 'rb') as f:
    msg, _ = blackboxprotobuf.decode_message(f.read())

print("=== DEEP MCU INTERFACE DUMP ===")
for mod in msg.get("5", []):
    # Find module name anywhere in the module block
    def find_name(d):
        if isinstance(d, list):
            for i in d:
                res = find_name(i)
                if res: return res
        elif isinstance(d, dict):
            if d.get("1") == b"module_name": return d.get("10")
            if d.get("51") == b'\xe6\xa8\xa1\xe5\x9d\x97\xe5\x90\x8d\xe7\xa7\xb0': return d.get("10")
            for v in d.values():
                if isinstance(v, (dict, list)):
                    res = find_name(v)
                    if res: return res
        return None

    name_bytes = find_name(mod)
    m_name = name_bytes.decode('utf-8') if isinstance(name_bytes, bytes) else ""
    
    if "MainController" in m_name:
        print(f"Found MCU: {m_name}")
        for itf in safe_traverse_and_find_interfaces(mod):
            # Try to print anything that looks like an interface
            name = itf.get("1", b"")
            if isinstance(name, bytes):
                name_str = name.decode('utf-8', errors='ignore')
                if "CAN" in name_str or "ETH" in name_str:
                    print(f"  Interface Candidate -> Name: {name_str}, Data: {itf}")
