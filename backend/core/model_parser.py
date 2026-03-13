import os
import zipfile
import tempfile
import json
import uuid
import subprocess
import re

class ModelParser:
    """
    AMR Studio V5.1 - Final Schema Guard.
    Ensures 100% alignment with frontend AmrProject type to prevent white screen.
    """

    @staticmethod
    def parse_modelset(zip_path: str, *args, **kwargs) -> dict:
        logger = args[1] if len(args) > 1 else kwargs.get('logger', None)
        def log(m):
            if logger: logger(m); print(f"[Parser] {m}")

        log(f"🚀 Parsing: {os.path.basename(zip_path)}")
        
        with tempfile.TemporaryDirectory() as tmp_dir:
            try:
                with zipfile.ZipFile(zip_path, 'r') as zf:
                    zf.extractall(tmp_dir)
            except: return {"error": "Zip failure"}
            
            comp_path = os.path.join(tmp_dir, 'CompDesc.model')
            try:
                res = subprocess.run(['strings', comp_path], capture_output=True, text=True, timeout=10)
                lines = [line.strip() for line in res.stdout.split('\n') if line.strip()]
            except: return {"error": "Scavenge failure"}

            module_blocks = []
            current_block = []
            for line in lines:
                if line == "module_name":
                    if current_block: module_blocks.append(current_block)
                    current_block = [line]
                else:
                    current_block.append(line)
            if current_block: module_blocks.append(current_block)

            sensors, wheels, io_boards, actuators, auxiliary = [], [], [], [], []
            robot_name = "Imported_AMR"
            drive_type = "DIFFERENTIAL"
            
            for block in module_blocks:
                kv = {}
                for i in range(len(block)-1): kv[block[i]] = block[i+1]
                name = kv.get("module_name", "Unknown")
                m_uuid = kv.get("module_uuid", str(uuid.uuid4()))
                m_type = kv.get("main_module_type", "unknown")
                sub_type = kv.get("sub_module_type", "")

                if name == "Unknown": continue

                if m_type == "chassis":
                    robot_name = name
                    mapping = {"diffChassis": "DIFFERENTIAL", "dualSteerChassis": "DUAL_STEER", "quadSteerChassis": "QUAD_STEER"}
                    if sub_type in mapping: drive_type = mapping[sub_type]
                elif m_type == "driveWheel" or "wheel" in name.lower():
                    wheels.append({"id": m_uuid, "label": name, "mountX": 0, "mountY": 0, "orientation": "CENTER"})
                elif m_type == "sensor" or any(k in name.lower() for k in ["laser", "camera", "sick", "gyro"]):
                    sensors.append({"id": m_uuid, "label": name, "model": name, "mountX": 0, "mountY": 0, "mountZ": 0})
                elif "io" in name.lower():
                    io_boards.append({"id": m_uuid, "label": name, "model": name, "canNodeId": 110})
                elif "motor" in name.lower() or "driver" in name.lower():
                    actuators.append({"id": m_uuid, "label": name})
                else:
                    auxiliary.append({"id": m_uuid, "label": name})

            # THE CRITICAL FIX: STRUCTURE ALIGNMENT
            p_id = str(uuid.uuid4())
            return {
                "formatVersion": "1.0",
                "meta": {
                    "projectId": p_id,
                    "projectName": robot_name,
                    "createdAt": "2026-03-13T00:00:00Z",
                    "modifiedAt": "2026-03-13T00:00:00Z",
                    "author": "System",
                    "templateOrigin": "imported"
                },
                "config": {
                    "identity": {
                        "robotName": robot_name,
                        "version": "1.0",
                        "chassisLength": 1200,
                        "chassisWidth": 800,
                        "navigationMethod": "LIDAR_SLAM",
                        "driveType": drive_type
                    },
                    "mcu": {"model": "CORE_V4", "canBuses": ["CAN0"], "ethPorts": ["ETH0"]},
                    "wheels": wheels,
                    "sensors": sensors,
                    "ioBoards": io_boards,
                    "ioPorts": [],
                    "actuators": actuators,
                    "auxiliary": auxiliary,
                    "others": []
                },
                "snapshots": [],
                "raw_tree": {"Status": "Aligned"}
            }
