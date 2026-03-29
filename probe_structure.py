import sys
import os

def read_varint(data, pos):
    result = 0
    shift = 0
    while True:
        if pos >= len(data): return result, pos
        b = data[pos]
        result |= (b & 0x7f) << shift
        pos += 1
        if not (b & 0x80):
            break
        shift += 7
    return result, pos

def probe_type_key(data, start, end):
    # Search for Tag 1 (generalAttr) -> Tag 8 (mainModuleType) -> Tag 11 (comboType) -> Tag 1 (typeKey)
    # This is a bit complex to parse manually, let's just look for the string "chassis"
    segment = data[start:end]
    if b'chassis' in segment:
        return "FOUND 'chassis'"
    return "NOT FOUND 'chassis'"

def probe_model(path):
    if not os.path.exists(path): return
    with open(path, 'rb') as f: data = f.read()
    
    pos = 0
    print(f"\n--- Probing {path} ---")
    while pos < len(data):
        tag_byte = data[pos]
        tag = tag_byte >> 3
        pos += 1
        if tag == 5:
            length, pos = read_varint(data, pos)
            group_end = pos + length
            # Tag 1 (name)
            if data[pos] >> 3 == 1:
                l, p = read_varint(data, pos+1)
                name = data[p:p+l].decode('utf-8', errors='ignore')
                print(f"Group: '{name}'")
                
                # Scan for Component (Tag 4)
                curr = p + l
                while curr < group_end:
                    t_byte = data[curr]
                    t = t_byte >> 3
                    curr += 1
                    l_val, curr = read_varint(data, curr)
                    if t == 4:
                        print(f"  Component (Tag 4): {l_val} bytes")
                        print(f"    Type Scan: {probe_type_key(data, curr, curr+l_val)}")
                    curr += l_val
            pos = group_end
            break
        else:
            wire = tag_byte & 0x07
            if wire == 0: _, pos = read_varint(data, pos)
            elif wire == 2: l, pos = read_varint(data, pos); pos += l
            else: pos += 1

probe_model('audit_standard/CompDesc.model')
probe_model('audit_generated/CompDesc.model')
