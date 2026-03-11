import blackboxprotobuf
import pprint

def safe_traverse(data):
    if isinstance(data, list):
        for item in data: yield from safe_traverse(item)
    elif isinstance(data, dict):
        yield data
        for v in data.values():
            if isinstance(v, (dict, list)): yield from safe_traverse(v)

with open('/Users/wangfeifei/code/amr_studio_v4/backend/templates/CompDesc.model', 'rb') as f:
    msg, _ = blackboxprotobuf.decode_message(f.read())

print("=== DEEP INTERFACE AUDIT ===")

for mod_entry in msg.get("5", []):
    # Get Module Name
    m_data = mod_entry.get("4")
    if not isinstance(m_data, list): m_data = [m_data]
    m_data = m_data[0] if m_data else {}
    
    m_name_bytes = m_data.get("1", {}).get("1", {}).get("10", b"Unknown")
    m_name = m_name_bytes.decode('utf-8') if isinstance(m_name_bytes, bytes) else "Unknown"
    
    print(f"\nMODULE: {m_name}")
    
    # 1. Look for all Interface Attributes (Tag 4 inside module data)
    itf_root = m_data.get("4", {}).get("1", [])
    if isinstance(itf_root, dict): itf_root = [itf_root]
    
    for itf in itf_root:
        itf_name = itf.get("1", b"").decode('utf-8')
        itf_type = itf.get("2", b"").decode('utf-8')
        print(f"  [Interface] {itf_name} (Type: {itf_type})")
        
        # Look for BUS ID or Protocol (Tag 8 or 9)
        if "8" in itf: # Likely CAN
            can_node = itf["8"].get("1", [])
            if isinstance(can_node, dict): can_node = [can_node]
            for p in can_node:
                if p.get("1") == b"nodeId": print(f"    CAN NodeID Tag detected")
        
        if "9" in itf: # Likely Ethernet
            print(f"    Network Params Tag detected")

    # 2. Look for IO Channel Definitions (Crucial for IO Boards)
    # Search for anything that looks like a channel list
    for sub in safe_traverse(m_data):
        if sub.get("1") == b"channelNum":
            print(f"  [IO Spec] channelNum: {sub.get('12')}")
        if sub.get("1") == b"diNum":
            print(f"  [IO Spec] diNum: {sub.get('12')}")
        if sub.get("1") == b"doNum":
            print(f"  [IO Spec] doNum: {sub.get('12')}")
