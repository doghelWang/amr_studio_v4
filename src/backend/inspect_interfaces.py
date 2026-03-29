import blackboxprotobuf
import pprint

with open('/Users/wangfeifei/code/amr_studio_v4/backend/templates/CompDesc.model', 'rb') as f:
    msg, _ = blackboxprotobuf.decode_message(f.read())

# Look for MCU (usually it's the module with name 'chassis' or similar)
for mod_entry in msg.get("5", []):
    m_data = mod_entry.get("4", {})
    m_meta = m_data.get("1", {})
    m_name = m_meta.get("1", {}).get("10", b"").decode('utf-8')
    
    print(f"\n--- Checking Module: {m_name} ---")
    
    # Check Interfaces (Tag 4 inside module data)
    itf_list = m_data.get("4", {}).get("1", [])
    if isinstance(itf_list, dict): itf_list = [itf_list]
    
    for itf in itf_list:
        itf_name = itf.get("1", b"").decode('utf-8')
        itf_type = itf.get("2", b"").decode('utf-8')
        print(f" Interface Found: {itf_name} (Type: {itf_type})")
        
        # If it's an IO Board, count channels (Tag 12 in IO Boards usually means something else, let's look for repeated configs)
        # In many industrial models, channels are under a specific sub-key
        channels = itf.get("12", []) # Check for repeated channel message
        if isinstance(channels, list):
            print(f"  Channel Count detected: {len(channels)}")

# Specifically look at the IO module prototype
for mod_entry in msg.get("5", []):
    m_name = mod_entry.get("4", {}).get("1", {}).get("1", {}).get("10", b"").decode('utf-8')
    if "IO" in m_name:
        print("\n[PROTOTYPE] IO Board Structure Deep Dive:")
        pprint.pprint(mod_entry.get("4", {}).get("4", {}))
