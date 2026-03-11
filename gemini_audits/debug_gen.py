import blackboxprotobuf
import pprint

# Load the generated model to see if injection actually happened
with open('/Users/wangfeifei/code/amr_studio_v4/gemini_audits/test_arch_out/CompDesc.model', 'rb') as f:
    msg, _ = blackboxprotobuf.decode_message(f.read())

print("\n--- DEBUG: Inspecting Generated Module List (Tag 5) ---")
# Let's find the modules we injected (they should have ipAddress or nodeId)
for i, mod in enumerate(msg.get("5", [])):
    m_data = mod.get("4", {})
    m_name = m_data.get("1", {}).get("1", {}).get("10", b"").decode('utf-8')
    print(f"\nModule {i}: {m_name}")
    
    # Check if nodeId or ipAddress exists anywhere in this module tree
    # We'll use a simple recursive print for now
    def find_val(d, target):
        if isinstance(d, dict):
            if d.get("1") == target.encode('utf-8'): return d
            for v in d.values():
                res = find_val(v, target)
                if res: return res
        elif isinstance(d, list):
            for item in d:
                res = find_val(item, target)
                if res: return res
        return None

    ip_block = find_val(mod, "ipAddress")
    node_block = find_val(mod, "nodeId")
    x_block = find_val(mod, "locCoordX")
    
    if ip_block: print(f"  FOUND IP: {ip_block}")
    if node_block: print(f"  FOUND NodeID: {node_block}")
    if x_block: print(f"  FOUND X: {x_block}")
