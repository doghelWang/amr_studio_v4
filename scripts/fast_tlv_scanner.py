import os
import zipfile
import tempfile
import struct
import io

def read_varint(stream):
    result = 0
    shift = 0
    while True:
        b = stream.read(1)
        if not b: return None
        b = b[0]
        result |= (b & 0x7f) << shift
        if not (b & 0x80): break
        shift += 7
    return result

def scan_tlv(data, target_key_name=None):
    """Simple Protobuf stream scanner to find keys and their adjacent values."""
    stream = io.BytesIO(data)
    results = []
    
    while True:
        tag_varint = read_varint(stream)
        if tag_varint is None: break
        
        field_number = tag_varint >> 3
        wire_type = tag_varint & 0x07
        
        if wire_type == 0: # Varint
            val = read_varint(stream)
        elif wire_type == 1: # 64-bit
            val = struct.unpack('<Q', stream.read(8))[0]
            # Potential float64
            try:
                fval = struct.unpack('<d', struct.pack('<Q', val))[0]
                if 1.0 < fval < 2000.0: # Heuristic for AMR params like 65.0
                    results.append(('float', field_number, fval))
            except: pass
        elif wire_type == 2: # Length-delimited
            length = read_varint(stream)
            sub_data = stream.read(length)
            try:
                sval = sub_data.decode('utf-8')
                if len(sval) > 1 and all(32 <= ord(c) <= 126 or ord(c) > 128 for c in sval):
                    results.append(('string', field_number, sval))
                # Recursive scan for nested messages
                results.extend(scan_tlv(sub_data))
            except:
                results.extend(scan_tlv(sub_data))
        elif wire_type == 5: # 32-bit
            stream.read(4)
            
    return results

def precision_audit():
    zip_path = "docs/ModelSet312.cmodel"
    with tempfile.TemporaryDirectory() as tmp_dir:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(tmp_dir)
        
        comp_path = os.path.join(tmp_dir, 'CompDesc.model')
        with open(comp_path, 'rb') as f:
            data = f.read()
            print("--- Streaming TLV Audit of ModelSet312 ---")
            raw_elements = scan_tlv(data)
            
            # Now, look for the 'wheelRadius' string and the closest float that follows it
            found_keys = []
            for i, (t, fnum, val) in enumerate(raw_elements):
                if t == 'string' and ("wheelRadius" in val or "轮半径" in val):
                    # Search forward for the next float
                    for j in range(i+1, min(i+10, len(raw_elements))):
                        if raw_elements[j][0] == 'float':
                            print(f"🎯 MATCH FOUND: Property '{val}' = {raw_elements[j][2]}")
                            break
                
                if t == 'string' and ("RA-MC-R318" in val):
                    print(f"🎯 MODEL FOUND: {val}")

if __name__ == "__main__":
    precision_audit()
