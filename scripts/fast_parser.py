import sys
import zipfile
import tempfile
import json
import os
import struct
import re

def parse_cmodel_fast(zip_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp_dir:
        try:
            with zipfile.ZipFile(zip_path, 'r') as zf:
                zf.extractall(tmp_dir)
        except Exception as e:
            print(f"Failed to unzip {zip_path}: {e}")
            return
            
        comp_path = os.path.join(tmp_dir, 'CompDesc.model')
        if not os.path.exists(comp_path):
            print(f"CompDesc.model not found in {zip_path}")
            return
            
        with open(comp_path, 'rb') as f:
            data = f.read()

        # Phase 1: Clean strings & Extract Modules
        # A module block usually starts near "module_name"
        # We'll use a sliding window approach with regex
        
        # Find all strings >= 2 chars long
        strings_with_offsets = []
        pattern = re.compile(b'[A-Za-z0-9_\\-\\.\\/\\(\\)\\s]{2,}')
        for match in pattern.finditer(data):
            strings_with_offsets.append((match.start(), match.group().decode('utf-8', errors='ignore')))
            
        # Group by module_uuid
        modules = {}
        current_uuid = None
        
        for i, (offset, s) in enumerate(strings_with_offsets):
            if s == "module_uuid" and i + 1 < len(strings_with_offsets):
                current_uuid = strings_with_offsets[i+1][1]
                if current_uuid not in modules:
                    modules[current_uuid] = {"_offset": offset, "strings": [], "raw_attrs": {}}
                    
            if current_uuid:
                modules[current_uuid]["strings"].append(s)

        # Refine module properties
        extracted_modules = []
        for uid, mod in modules.items():
            strs = mod["strings"]
            
            def get_next(key, default="Unknown"):
                if key in strs:
                    idx = strs.index(key)
                    if idx + 1 < len(strs):
                        return strs[idx+1]
                return default
                
            m_name = get_next("module_name")
            m_type = get_next("main_module_type")
            m_subtype = get_next("sub_module_type")
            
            # Phase 2: IEEE 754 Float64 Extraction for Electrical/Physical Params
            # The reference.md explicitly says value is preceded by '‰' (0x89) or simply 8-byte aligned
            # Look for 0x40 (which is the exponent block for floats around 2.0~1000.0)
            # A gear ratio of 25.0 is exactly b'\x00\x00\x00\x00\x00\x00\x39\x40'
            # A gear ratio of 35.0 is exactly b'\x00\x00\x00\x00\x00\x80\x41\x40'
            
            float_params = {}
            # Scan near this module's offset for 8-byte sequences ending in \x40
            start_search = max(0, mod["_offset"] - 1000)
            end_search = min(len(data), mod["_offset"] + 2000)
            block = data[start_search:end_search]
            
            # Very heuristic: find standard keys and the next 8 bytes
            keys_to_look = [
                b'wheelRadius', b'gearRatio', b'RatedRPM', b'MaxSpeed', b'headOffset',
                b'locCoordX', b'locCoordY', b'locCoordZ', b'maxAcceleration'
            ]
            
            for key in keys_to_look:
                idx = block.find(key)
                if idx != -1:
                    # Scan forward 30 bytes to find a float-like 8-byte signature
                    for offset in range(idx + len(key), min(len(block)-8, idx + 40)):
                        chunk = block[offset:offset+8]
                        if chunk[7] in (0x40, 0x3f, 0x41): # typical double precision exponent for AMR scales
                            try:
                                val = struct.unpack('<d', chunk)[0]
                                if -100000 < val < 100000 and abs(val) > 0.0001:
                                    float_params[key.decode('utf-8')] = round(val, 4)
                                    break
                            except:
                                pass
                                
            extracted_modules.append({
                "ModuleID": uid,
                "ModuleName": m_name,
                "MainType": m_type,
                "SubType": m_subtype,
                "ExtractedParams": float_params,
                "AllStringsDump": strs[:30] # Limit strings for brevity
            })

        # Save to JSON
        filename = os.path.basename(zip_path).replace('.cmodel', '_extracted.json')
        out_json = os.path.join(output_dir, filename)
        with open(out_json, 'w', encoding='utf-8') as f:
            json.dump({"Modules": extracted_modules}, f, indent=2, ensure_ascii=False)
            
        print(f"Extracted {len(extracted_modules)} modules to {out_json}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python fast_parser.py <input.cmodel> <output_dir>")
        sys.exit(1)
    parse_cmodel_fast(sys.argv[1], sys.argv[2])
