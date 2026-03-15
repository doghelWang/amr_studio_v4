import sys
import zipfile
import tempfile
import json
import os
import struct
import re

def fast_binary_extract(zip_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp_dir:
        try:
            with zipfile.ZipFile(zip_path, 'r') as zf:
                zf.extractall(tmp_dir)
        except Exception as e:
            return
            
        comp_path = os.path.join(tmp_dir, 'CompDesc.model')
        if not os.path.exists(comp_path):
            return
            
        with open(comp_path, 'rb') as f:
            data = f.read()

        # Step 1: Find all strings (length >= 3)
        # Using a raw byte string to avoid \u escape errors
        pattern = re.compile(rb'[A-Za-z0-9_\-\.\/\(\)\s\x80-\xff]{3,}')
        strings = []
        for match in pattern.finditer(data):
            try:
                s = match.group().decode('utf-8')
                # Filter out pure garbage
                if len(s.strip()) >= 2 and not s.isspace():
                    strings.append((match.start(), s.strip()))
            except:
                pass
                
        # Group into modules
        modules = {}
        current_uuid = None
        
        for i, (offset, s) in enumerate(strings):
            if s == "module_uuid" and i + 1 < len(strings):
                uid = strings[i+1][1]
                if len(uid) == 32: # MD5 style UUID
                    current_uuid = uid
                    if current_uuid not in modules:
                        modules[current_uuid] = {"_offset": offset, "strings": []}
            
            if current_uuid:
                modules[current_uuid]["strings"].append(s)
                
        # Step 2: Extract specifics
        extracted = []
        for uid, mod in modules.items():
            strs = mod["strings"]
            
            def get_val(key, default="Unknown"):
                if key in strs:
                    idx = strs.index(key)
                    if idx + 1 < len(strs):
                        return strs[idx+1]
                return default
                
            m_name = get_val("module_name")
            m_type = get_val("main_module_type")
            m_desc = get_val("module_desc")
            m_vender = get_val("vender_name")
            
            # Step 3: Scan for IEEE 754 Float64 (GearRatio, wheelRadius etc)
            float_params = {}
            search_start = max(0, mod["_offset"] - 500)
            search_end = min(len(data), mod["_offset"] + 3000)
            block = data[search_start:search_end]
            
            keys = [b'wheelRadius', b'gearRatio', b'RatedRPM', b'locCoordX', b'locCoordY', b'locCoordZ', b'maxAcceleration', b'torque']
            for k in keys:
                idx = block.find(k)
                if idx != -1:
                    # Scan next 40 bytes for a float
                    for offset in range(idx + len(k), min(len(block)-8, idx + 40)):
                        chunk = block[offset:offset+8]
                        # 0x40 is typical for floats > 2.0.
                        if chunk[7] in (0x40, 0x3f, 0x41, 0xc0, 0xc1):
                            try:
                                val = struct.unpack('<d', chunk)[0]
                                if -100000 < val < 100000 and abs(val) > 0.001:
                                    float_params[k.decode('utf-8')] = round(val, 4)
                                    break
                            except:
                                pass
                                
            extracted.append({
                "ModuleID": uid,
                "ModuleName": m_name,
                "ModuleDesc": m_desc,
                "MainType": m_type,
                "Vender": m_vender,
                "Electrical&PhysicalParams": float_params,
                "LinkedStrings": [s for s in strs if len(s)>4][:20]
            })

        out_json = os.path.join(output_dir, os.path.basename(zip_path).replace('.cmodel', '_extracted.json'))
        with open(out_json, 'w', encoding='utf-8') as f:
            json.dump({"Modules": extracted}, f, indent=2, ensure_ascii=False)
        print(f"Extracted {len(extracted)} modules -> {out_json}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)
    fast_binary_extract(sys.argv[1], sys.argv[2])
