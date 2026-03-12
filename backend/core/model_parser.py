import blackboxprotobuf
import os
import zipfile
import tempfile
import json
import uuid
import struct
from collections import deque
from core.protobuf_navigator import ProtoNavigator

class ModelParser:
    MAX_DEPTH = 6 # Further reduced for extreme safety
    MAX_NODES = 500 # Strict node count limit per extraction
    MAX_STR_LEN = 256

    @staticmethod
    def uint64_to_float(val_int: int) -> float:
        try: return struct.unpack('<d', struct.pack('<Q', val_int))[0]
        except: return 0.0

    @classmethod
    def iterative_extract(cls, data):
        """
        Hyper-safe iterative extraction.
        """
        results = {}
        if not data: return results
        queue = deque([(data, 0)])
        visited = 0
        
        while queue and visited < cls.MAX_NODES:
            curr, depth = queue.popleft()
            visited += 1
            if depth > cls.MAX_DEPTH: continue
            
            if isinstance(curr, list):
                # Peak only the first few to avoid list-explosion
                for item in curr[:3]:
                    queue.append((item, depth + 1))
            elif isinstance(curr, dict):
                # Standard Tag 1 = Key pattern
                k = curr.get("1") or curr.get(1)
                if isinstance(k, bytes):
                    k_s = k.decode('utf-8', errors='ignore')
                    if "17" in curr: results[k_s] = cls.uint64_to_float(curr["17"])
                    elif "12" in curr: results[k_s] = int(curr["12"])
                    elif "10" in curr:
                        v = curr["10"]
                        if isinstance(v, bytes): results[k_s] = v.decode('utf-8', errors='ignore')[:cls.MAX_STR_LEN]
                
                # Limit sub-dict scanning
                keys = list(curr.keys())[:10]
                for key in keys:
                    v = curr[key]
                    if isinstance(v, (dict, list)):
                        queue.append((v, depth + 1))
        return results

    @classmethod
    def get_raw_tree_safe(cls, data, depth=0):
        """Ultra-pruned tree for UI rendering."""
        if depth > 3: return "..." # Stop deep nesting early
        
        if isinstance(data, list):
            # Only show first 3 items of any list
            count = len(data)
            base = [cls.get_raw_tree_safe(i, depth + 1) for i in data[:3]]
            if count > 3: base.append(f"({count - 3} more items...)")
            return base
        elif isinstance(data, dict):
            res = {}
            # Show only first 8 keys
            all_keys = list(data.keys())
            for k in all_keys[:8]:
                v = data[k]
                if isinstance(v, bytes):
                    try: res[str(k)] = v.decode('utf-8')[:32] + "..." if len(v) > 32 else v.decode('utf-8')
                    except: res[str(k)] = f"HEX:{v.hex()[:8]}..."
                else:
                    res[str(k)] = cls.get_raw_tree_safe(v, depth + 1)
            if len(all_keys) > 8: res["_"] = "..."
            return res
        return data

    @classmethod
    def parse_modelset(cls, zip_path: str, return_raw=False) -> dict:
        with tempfile.TemporaryDirectory() as tmp_dir:
            with zipfile.ZipFile(zip_path, 'r') as zf:
                zf.extractall(tmp_dir)
            
            comp_path = os.path.join(tmp_dir, 'CompDesc.model')
            with open(comp_path, 'rb') as f:
                # decoder can sometimes hang on malformed/huge messages, but usually it's the post-processing
                comp_msg, _ = blackboxprotobuf.decode_message(f.read())
            
            sensors = []
            others = []
            wheels = []
            io_boards = []
            
            # Module list
            module_list = comp_msg.get("5", [])
            if isinstance(module_list, dict): module_list = [module_list]

            for entry in module_list:
                params = cls.iterative_extract(entry)
                m_name = (ProtoNavigator.safe_get_path(entry, ["4", "1", "1", "10"]) or b"").decode('utf-8', errors='ignore')
                m_uuid = (ProtoNavigator.safe_get_path(entry, ["4", "1", "4", "10"]) or str(uuid.uuid4()).encode('utf-8')).decode('utf-8', errors='ignore')
                main_type = (ProtoNavigator.safe_get_path(entry, ["4", "1", "8", "21", "1"]) or b"").decode('utf-8', errors='ignore')
                
                if not m_name: continue

                if main_type == "chassis" or "chassis" in m_name.lower():
                    # Simplified wheel extraction
                    parts = ProtoNavigator.safe_get_path(entry, ["4", "2", "1"]) or []
                    if isinstance(parts, dict): parts = [parts]
                    for i, p in enumerate(parts[:10]): # Limit wheel count for safety
                        if isinstance(p, dict) and p.get("2") == b'\xe8\xbf\x90\xe5\x8a\xa8\xe4\xb8\xad\xe5\xbf\x83\xe5\x8f\x82\xe6\x95\xb0':
                            ext = cls.iterative_extract(p)
                            wheels.append({"id": str(uuid.uuid4()), "label": f"Wheel {i+1}", "mountX": ext.get("locCoordNX", 0.0)})
                
                elif main_type == "sensor" or "laser" in m_name.lower() or "camera" in m_name.lower():
                    sensors.append({
                        "id": m_uuid, "label": m_name, "model": m_name,
                        "mountX": params.get("locCoordX", 0.0), "mountY": params.get("locCoordY", 0.0),
                        "ip": params.get("ipAddress") or params.get("ip")
                    })
                else:
                    # Categorize as actuator or auxiliary
                    ctype = "ACTUATOR" if ("motor" in m_name.lower() or "driver" in m_name.lower()) else "AUXILIARY"
                    others.append({"id": m_uuid, "label": m_name, "type": ctype, "details": params})

            result = {
                "config": {
                    "meta": { "projectId": str(uuid.uuid4()), "projectName": "Imported" },
                    "identity": { "robotName": "Imported", "driveType": "DIFF" },
                    "wheels": wheels, "sensors": sensors, "ioBoards": io_boards, "others": others
                }
            }
            if return_raw:
                result["raw_tree"] = cls.get_raw_tree_safe(comp_msg)
            return result
