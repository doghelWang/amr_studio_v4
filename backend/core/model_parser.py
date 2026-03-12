import blackboxprotobuf
import os
import zipfile
import tempfile
import json
import uuid
import struct
import re
from datetime import datetime

from core.protobuf_navigator import ProtoNavigator

class ModelParser:
    @staticmethod
    def uint64_to_float(val_int: int) -> float:
        if val_int is None: return 0.0
        try:
            return struct.unpack('<d', struct.pack('<Q', val_int))[0]
        except:
            return 0.0

    @classmethod
    def deep_extract_all(cls, data, results=None):
        if results is None: results = {}
        if isinstance(data, list):
            for item in data: cls.deep_extract_all(item, results)
        elif isinstance(data, dict):
            key = data.get("1") or data.get(1)
            if isinstance(key, bytes):
                k = key.decode('utf-8', errors='ignore')
                if k == "ip": k = "ipAddress"
                if k == "nodeId" or k == "nodeID": k = "canNodeId"
                if "17" in data: results[k] = cls.uint64_to_float(data["17"])
                elif "12" in data: results[k] = int(data["12"])
                elif "10" in data:
                    val = data["10"]
                    if isinstance(val, bytes): results[k] = val.decode('utf-8', errors='ignore')
            for v in data.values():
                if isinstance(v, (dict, list)): cls.deep_extract_all(v, results)
        return results

    @classmethod
    def parse_modelset(cls, zip_path: str) -> dict:
        with tempfile.TemporaryDirectory() as tmp_dir:
            with zipfile.ZipFile(zip_path, 'r') as zf:
                zf.extractall(tmp_dir)
            
            comp_path = os.path.join(tmp_dir, 'CompDesc.model')
            with open(comp_path, 'rb') as f:
                msg, _ = blackboxprotobuf.decode_message(f.read())
            
            sensors = []
            io_boards = []
            mcu_interfaces = {"can": [], "eth": []}
            
            for entry in msg.get("5", []):
                params = cls.deep_extract_all(entry)
                m_data = entry.get("4", {})
                
                # Robust name extraction using safe_get_path
                raw_name = ProtoNavigator.safe_get_path(entry, ["4", "1", "1", "10"])
                m_name = raw_name.decode('utf-8', errors='ignore') if isinstance(raw_name, bytes) else ""
                
                if not m_name: continue

                # 1. MCU Interface Extraction
                if "MainController" in m_name:
                    def find_interfaces(d):
                        if isinstance(d, list):
                            for i in d: find_interfaces(i)
                        elif isinstance(d, dict):
                            t1 = d.get("1") or d.get(1)
                            t2 = d.get("2") or d.get(2)
                            if isinstance(t1, bytes) and isinstance(t2, bytes):
                                t1_str = t1.decode('utf-8', errors='ignore')
                                t2_str = t2.decode('utf-8', errors='ignore')
                                
                                if t2_str == "CAN" or "CAN" in t1_str:
                                    if t1_str not in mcu_interfaces["can"]: mcu_interfaces["can"].append(t1_str)
                                elif t2_str == "ETH" or "ETH" in t1_str:
                                    if t1_str not in mcu_interfaces["eth"]: mcu_interfaces["eth"].append(t1_str)
                            for v in d.values():
                                if isinstance(v, (dict, list)): find_interfaces(v)
                    
                    # Search through the entire m_data tree for the MCU
                    find_interfaces(m_data)

                # 2. IO Board Dynamic Extraction
                if "io" in m_name.lower():
                    # Count DI/DO by scanning interface names
                    itfs = m_data.get("4", {}).get("1", [])
                    if isinstance(itfs, dict): itfs = [itfs]
                    di_count = sum(1 for i in itfs if b"DI" in i.get("1", b""))
                    do_count = sum(1 for i in itfs if b"DO" in i.get("1", b""))
                    
                    uuid_bytes = ProtoNavigator.safe_get_path(entry, ["4", "1", "4", "10"])
                    io_uuid = uuid_bytes.decode('utf-8') if isinstance(uuid_bytes, bytes) else str(uuid.uuid4())

                    io_boards.append({
                        "id": io_uuid,
                        "model": m_name,
                        "canNodeId": params.get("canNodeId"),
                        "channels": di_count + do_count,
                        "diCount": di_count,
                        "doCount": do_count
                    })

                # 3. Sensor Detailed Extraction
                if "laser" in m_name.lower() or params.get("locCoordX") is not None:
                    if params.get("locCoordX") is not None:
                        sensors.append({
                            "label": m_name,
                            "model": m_name,
                            "mountX": params.get("locCoordX", 0.0),
                            "mountY": params.get("locCoordY", 0.0),
                            "mountZ": params.get("locCoordZ", 0.0),
                            "mountYaw": params.get("locCoordYAW", 0.0),
                            "ip": params.get("ipAddress"),
                            "port": params.get("port"),
                            "connType": "ETHERNET" if params.get("ipAddress") else "CAN"
                        })

            wheels = []
            wheel_idx = 1
            for entry in msg.get("5", []):
                params = cls.deep_extract_all(entry)
                m_data = entry.get("4", {})
                raw_name = ProtoNavigator.safe_get_path(entry, ["4", "1", "1", "10"])
                m_name = (raw_name.decode('utf-8', errors='ignore') if isinstance(raw_name, bytes) else "").lower()
                main_type = ProtoNavigator.safe_get_path(entry, ["4", "1", "8", "21", "1"])
                main_type = (main_type.decode('utf-8') if isinstance(main_type, bytes) else "").lower()

                if "wheel" in m_name or "wheel" in main_type:
                    wheels.append({
                        "id": str(uuid.uuid4()),
                        "label": f"Wheel #{wheel_idx}",
                        "mountX": params.get("locCoordX", 0.0),
                        "mountY": params.get("locCoordY", 0.0),
                        "orientation": "FRONT_LEFT" if wheel_idx % 2 != 0 else "REAR_RIGHT",
                        "driverModel": params.get("driverModel", "ZAPI"),
                        "canBus": "CAN0",
                        "canNodeId": params.get("canNodeId", 8),
                        "leftLimit": params.get("angleLmtNeg", -90.0),
                        "rightLimit": params.get("angleLmtPos", 90.0)
                    })
                    wheel_idx += 1

            return {
                "config": {
                    "identity": {"robotName": robot_name if 'robot_name' in locals() else "Imported V4", "driveType": "DIFF"},
                    "mcu": {
                        "model": "MainController",
                        "canBuses": mcu_interfaces["can"],
                        "ethPorts": mcu_interfaces["eth"]
                    },
                    "sensors": sensors,
                    "ioBoards": io_boards,
                    "wheels": wheels
                }
            }
