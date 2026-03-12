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
    MAX_DEPTH = 8
    MAX_STR_LEN = 512

    @staticmethod
    def uint64_to_float(val_int: int) -> float:
        try: return struct.unpack('<d', struct.pack('<Q', val_int))[0]
        except: return 0.0

    @classmethod
    def iterative_extract(cls, data):
        """
        Extreme safety BFS traversal. Limits nodes and depth to prevent hanging.
        """
        results = {}
        if not data: return results
        queue = deque([(data, 0)])
        visited_count = 0
        
        while queue and visited_count < 1000:
            curr, depth = queue.popleft()
            visited_count += 1
            if depth > cls.MAX_DEPTH: continue
            
            if isinstance(curr, list):
                for item in curr[:5]: # Only peak at first 5 items
                    queue.append((item, depth + 1))
            elif isinstance(curr, dict):
                key = curr.get("1") or curr.get(1)
                if isinstance(key, bytes):
                    k_str = key.decode('utf-8', errors='ignore')
                    if "17" in curr: results[k_str] = cls.uint64_to_float(curr["17"])
                    elif "12" in curr: results[k_str] = int(curr["12"])
                    elif "10" in curr:
                        val = curr["10"]
                        if isinstance(val, bytes): results[k_str] = val.decode('utf-8', errors='ignore')[:cls.MAX_STR_LEN]
                
                for v in curr.values():
                    if isinstance(v, (dict, list)):
                        queue.append((v, depth + 1))
        return results

    @classmethod
    def get_raw_tree_safe(cls, data, depth=0):
        """Ultra-defensive tree for UI. Collapses large data."""
        if depth > 4: return "..." 
        
        if isinstance(data, list):
            if len(data) > 5: return [cls.get_raw_tree_safe(i, depth + 1) for i in data[:5]] + [f"... ({len(data)-5} more items)"]
            return [cls.get_raw_tree_safe(i, depth + 1) for i in data]
        elif isinstance(data, dict):
            res = {}
            keys = list(data.keys())[:15]
            for k in keys:
                v = data[k]
                if isinstance(v, bytes):
                    try: res[str(k)] = v.decode('utf-8')[:64]
                    except: res[str(k)] = f"HEX:{v.hex()[:12]}..."
                else:
                    res[str(k)] = cls.get_raw_tree_safe(v, depth + 1)
            if len(data) > 15: res["_more_tags"] = "..."
            return res
        return data

    @classmethod
    def parse_modelset(cls, zip_path: str, return_raw=False) -> dict:
        with tempfile.TemporaryDirectory() as tmp_dir:
            with zipfile.ZipFile(zip_path, 'r') as zf:
                zf.extractall(tmp_dir)
            comp_path = os.path.join(tmp_dir, 'CompDesc.model')
            with open(comp_path, 'rb') as f:
                comp_msg, _ = blackboxprotobuf.decode_message(f.read())
            
            sensors = []
            io_boards = []
            wheels = []
            others = []
            robot_name = "AMR_Project"
            drive_type = "DIFFERENTIAL"
            
            # Module list is Tag 5
            module_list = comp_msg.get("5", [])
            if isinstance(module_list, dict): module_list = [module_list]

            for entry in module_list:
                params = cls.iterative_extract(entry)
                
                # Metadata
                m_name = (ProtoNavigator.safe_get_path(entry, ["4", "1", "1", "10"]) or b"").decode('utf-8', errors='ignore')
                m_uuid = (ProtoNavigator.safe_get_path(entry, ["4", "1", "4", "10"]) or str(uuid.uuid4()).encode('utf-8')).decode('utf-8', errors='ignore')
                main_type = (ProtoNavigator.safe_get_path(entry, ["4", "1", "8", "21", "1"]) or b"").decode('utf-8', errors='ignore')
                
                if not m_name: continue

                if main_type == "chassis" or "chassis" in m_name.lower():
                    robot_name = m_name
                    raw_dt = params.get("sub_module_type", "")
                    dt_rev = {"dualSteerChassis": "DUAL_STEER", "quadSteerChassis": "QUAD_STEER", "steerChassis": "SINGLE_STEER", "differential": "DIFFERENTIAL"}
                    drive_type = dt_rev.get(raw_dt, "DIFFERENTIAL")
                    
                    parts = ProtoNavigator.safe_get_path(entry, ["4", "2", "1"]) or []
                    if isinstance(parts, dict): parts = [parts]
                    motions = [p for p in parts if isinstance(p, dict) and p.get("2") == b'\xe8\xbf\x90\xe5\x8a\xa8\xe4\xb8\xad\xe5\xbf\x83\xe5\x8f\x82\xe6\x95\xb0']
                    for i, mp in enumerate(motions):
                        p = cls.iterative_extract(mp)
                        wheels.append({"id": str(uuid.uuid4()), "label": f"Wheel {i+1}", "mountX": p.get("locCoordNX", 0.0)})

                elif main_type == "driveWheel" or "motor" in m_name.lower() or "driver" in m_name.lower():
                    others.append({"id": m_uuid, "label": m_name, "type": "ACTUATOR"})

                elif main_type == "sensor" or "laser" in m_name.lower() or "camera" in m_name.lower():
                    sensors.append({
                        "id": m_uuid, "label": m_name, "model": m_name,
                        "mountX": params.get("locCoordX", 0.0), "mountY": params.get("locCoordY", 0.0),
                        "ip": params.get("ipAddress") or params.get("ip")
                    })

                elif "io" in m_name.lower():
                    io_boards.append({"id": m_uuid, "model": m_name, "canNodeId": params.get("nodeId", 110)})
                else:
                    others.append({"id": m_uuid, "label": m_name, "type": "AUXILIARY"})

            result = {
                "config": {
                    "meta": { "projectId": str(uuid.uuid4()), "projectName": robot_name },
                    "identity": { "robotName": robot_name, "driveType": drive_type },
                    "wheels": wheels, "sensors": sensors, "ioBoards": io_boards, "others": others
                }
            }
            if return_raw:
                result["raw_tree"] = cls.get_raw_tree_safe(comp_msg)
            return result
