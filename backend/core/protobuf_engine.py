import blackboxprotobuf
import struct
import json
import hashlib
import os
import zipfile
import tempfile
import copy
from schemas.api import GeneratePayload
from core.protobuf_navigator import ProtoNavigator

def float_to_uint64(f: float) -> int:
    """Convert an IEEE 754 64-bit float to its unsigned 64-bit integer representation"""
    return struct.unpack('<Q', struct.pack('<d', float(f)))[0]

def build_comp_desc(template_path: str, payload: GeneratePayload) -> bytes:
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
        
    try:
        # Patch Identity via ProtoNavigator
        # We can still use some structural assumptions if they are extremely stable, 
        # but for parameters we rely on semantic keys.
        # Actually, let's just use the known stable structure for the top level Robot metadata, 
        # because those keys aren't semantic strings.
        module_name_bytes = payload.robotName.encode('utf-8')
        version_bytes = payload.version.encode('utf-8')
        
        msg["5"][0]["4"]["1"]["1"]["10"] = module_name_bytes
        msg["5"][0]["4"]["1"]["5"]["10"] = version_bytes
        msg["5"][0]["4"]["1"]["20"][1]["10"] = module_name_bytes
        
        # Patch Sub-Module Type Based on Drive
        type_mapping = {
            "DIFF": "differential",
            "DIFFERENTIAL": "differential",
            "SINGLE_STEER": "steerChassis",
            "DUAL_STEER": "dualSteerChassis",
            "QUAD_STEER": "quadSteerChassis",
            "MECANUM": "mecanumChassis",
            "MECANUM_4": "mecanumChassis",
            "OMNI": "omniChassis",
            "OMNI_3": "omniChassis"
        }
        chassis_type = type_mapping.get(payload.driveType, "differential")
        msg["5"][0]["4"]["1"]["9"]["21"]["1"] = chassis_type.encode('utf-8')

        # Complex Kinematics: Rebuild wheel and sensor blocks while PRESERVING original ordering
        attr = msg["5"][0]["4"]
        parts = attr.get("2", {}).get("1", [])
        
        MOTION_KEY = b'\xe8\xbf\x90\xe5\x8a\xa8\xe4\xb8\xad\xe5\xbf\x83\xe5\x8f\x82\xe6\x95\xb0'  # motionCenterAttr
        WHEEL_KEY  = b'\xe8\xbd\xae\xe7\xbb\x84\xe5\xb1\x9e\xe6\x80\xa7'                    # wheelProperties
        SENSOR_KEY = b'\xe4\xb8\xad\xe5\x9b\xbd\xe5\x9b\xbd\xe9\x99\x85\xe9\x98\x9f'       # sensorAttr (best-effort by position)

        if len(payload.wheels) > 0 and parts:
            # --- F1 FIX: "In-Place Anchor" Algorithm ---
            # Strategy: instead of filter+append, we:
            #   1. Find the anchor index of the FIRST motionCenterAttr block
            #   2. Find and store all template wheel blocks to be replaced
            #   3. Build cloned blocks
            #   4. Replace the anchor range with the new blocks (in-place)
            
            # Step 1: Update overall chassis wheel count
            chassis_part = ProtoNavigator.find_block_by_key(parts, "2", b'\xe5\xba\x95\xe7\x9b\x98\xe5\x8f\x82\xe6\x95\xb0')
            if chassis_part:
                ProtoNavigator.update_float_param(chassis_part, "wheelsNum", len(payload.wheels))
            
            # Step 2: Find anchor positions (first occurrence of each clone-target key)
            motion_anchor_idx = next(
                (i for i, p in enumerate(parts) if isinstance(p, dict) and p.get("2") == MOTION_KEY),
                None
            )
            wheel_anchor_idx = next(
                (i for i, p in enumerate(parts) if isinstance(p, dict) and p.get("2") == WHEEL_KEY),
                None
            )
            
            # Step 3: Get template blocks to clone from
            template_motion_part = ProtoNavigator.find_block_by_key(parts, "2", MOTION_KEY)
            template_wheel_part  = ProtoNavigator.find_block_by_key(parts, "2", WHEEL_KEY)
            
            # Step 4: Build new cloned wheel blocks
            cloned_motion_blocks = []
            cloned_wheel_blocks  = []
            for w in payload.wheels:
                if template_motion_part:
                    new_motion = copy.deepcopy(template_motion_part)
                    ProtoNavigator.update_float_param(new_motion, "headOffset(Idle)", w.headOffsetIdle)
                    ProtoNavigator.update_float_param(new_motion, "tailOffset(Idle)", w.tailOffsetIdle)
                    ProtoNavigator.update_float_param(new_motion, "leftOffset(Idle)", w.leftOffsetIdle)
                    ProtoNavigator.update_float_param(new_motion, "rightOffset(Idle)", w.rightOffsetIdle)
                    ProtoNavigator.update_float_param(new_motion, "headOffset (Full Load)", w.headOffsetFull)
                    ProtoNavigator.update_float_param(new_motion, "tailOffset (Full Load)", w.tailOffsetFull)
                    ProtoNavigator.update_float_param(new_motion, "leftOffset (Full Load)", w.leftOffsetFull)
                    ProtoNavigator.update_float_param(new_motion, "rightOffset (Full Load)", w.rightOffsetFull)
                    cloned_motion_blocks.append(new_motion)
                if template_wheel_part:
                    new_wheel = copy.deepcopy(template_wheel_part)
                    ProtoNavigator.update_float_param(new_wheel, "locCoordNX", w.mountX)
                    ProtoNavigator.update_float_param(new_wheel, "locCoordNY", w.mountY)
                    cloned_wheel_blocks.append(new_wheel)
            
            # Step 5: In-place replacement at the anchor positions
            # We remove all original instances of motion/wheel blocks first, then insert at anchor
            # This preserves the relative order of all other blocks (e.g. chassisAttr, sub_sys_type)
            parts_without_cloned = [p for p in parts if not (
                isinstance(p, dict) and p.get("2") in (MOTION_KEY, WHEEL_KEY)
            )]
            # Insert the new blocks at the original anchor position
            insert_at = min(
                motion_anchor_idx if motion_anchor_idx is not None else len(parts_without_cloned),
                len(parts_without_cloned)
            )
            new_parts = (
                parts_without_cloned[:insert_at] +
                cloned_motion_blocks +
                cloned_wheel_blocks +
                parts_without_cloned[insert_at:]
            )
            attr["2"]["1"] = new_parts
            parts = new_parts  # update local reference for sensor injection below
        
        # --- F2 FIX: Sensor 6D Pose Injection ---
        # Inject sensor physical pose data into CompDesc (previously completely missing)
        if payload.sensors and parts:
            template_sensor_part = None
            # Try to find a sensor template block by position (last resort: take a shallow copy of a non-wheel block)
            for p in parts:
                if isinstance(p, dict) and p.get("2") not in (MOTION_KEY, WHEEL_KEY) and p.get("1") is not None:
                    template_sensor_part = p
                    break
            
            if template_sensor_part:
                sensor_insert_idx = len(attr["2"]["1"])
                new_sensor_blocks = []
                for s in payload.sensors:
                    new_sensor = copy.deepcopy(template_sensor_part)
                    # Inject sensor pose using available coordinate fields
                    ProtoNavigator.update_float_param(new_sensor, "locCoordNX", s.mountX)
                    ProtoNavigator.update_float_param(new_sensor, "locCoordNY", s.mountY)
                    ProtoNavigator.update_float_param(new_sensor, "locCoordYaw", s.mountYaw)
                    new_sensor_blocks.append(new_sensor)
                # Append sensor blocks at end of parts list
                attr["2"]["1"] = attr["2"]["1"] + new_sensor_blocks

    except Exception as e:
        print(f"Error compiling CompDesc: {e}")
        import traceback
        traceback.print_exc()

    return blackboxprotobuf.encode_message(msg, typ)

def build_func_desc(template_path: str, payload: GeneratePayload) -> bytes:
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
    
    # Navigation Logic based on Sensors
    # Use get_laser_type() to normalize LASER_2D -> LASER etc.
    has_laser_navi = any(s.get_laser_type() == 'LASER' and s.usageNavi for s in payload.sensors)
    has_imu = any(s.get_laser_type() == 'GYRO' for s in payload.sensors)

    try:
        # Patch Navigation Method safely
        navi_part = ProtoNavigator.find_block_by_key(msg, "1", b"naviUniqueKeyZx")
        if navi_part:
            if has_laser_navi:
                navi_part["2"] = b"NAVI_SLAM"
            elif has_imu:
                navi_part["2"] = b"NAVI_INERTANCE"
            else:
                navi_part["2"] = b"noNavi"

        # Map Safety IO if present
        # In a real system, we'd find the safety EMC stop block and enable it
        # For now, we prove the concept by finding it if it exists.
        has_emc_stop = any(io.logicBind == 'SAFETY_IO_EMC_STOP' for io in payload.ioPorts)
        if has_emc_stop:
            safe_part = ProtoNavigator.find_block_by_key(msg, "1", b"safetyEstopKey")
            if safe_part:
                safe_part["3"] = 1 # Example boolean enable flag (structure dependent)

    except Exception as e:
        print(f"Error compiling FuncDesc: {e}")
            
    return blackboxprotobuf.encode_message(msg, typ)

def build_abi_set(template_path: str, payload: GeneratePayload) -> bytes:
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
    return blackboxprotobuf.encode_message(msg, typ)

def generate_industrial_modelset(payload: GeneratePayload) -> str:
    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    templates_dir = os.path.join(os.path.dirname(CURRENT_DIR), 'templates')
    
    comp_bytes = build_comp_desc(os.path.join(templates_dir, 'CompDesc.model'), payload)
    func_bytes = build_func_desc(os.path.join(templates_dir, 'FuncDesc.model'), payload)
    abi_bytes = build_abi_set(os.path.join(templates_dir, 'AbiSet.model'), payload)
    
    # Manifest creation
    manifest = {
        "ModelFileDesc": [
            { "md5": hashlib.md5(abi_bytes).hexdigest(), "name": "AbiSet.model", "type": "CAPABILITY", "version": payload.version },
            { "md5": hashlib.md5(func_bytes).hexdigest(), "name": "FuncDesc.model", "type": "MODEL_FUNC", "version": payload.version },
            { "md5": hashlib.md5(comp_bytes).hexdigest(), "name": "CompDesc.model", "type": "MODEL_COMP", "version": payload.version }
        ]
    }
    
    temp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(temp_dir, f'{payload.robotName.replace(" ", "_")}_ModelSet.zip')
    
    with zipfile.ZipFile(zip_path, 'w') as zf:
        zf.writestr('AbiSet.model', abi_bytes)
        zf.writestr('FuncDesc.model', func_bytes)
        zf.writestr('CompDesc.model', comp_bytes)
        zf.writestr('ModelFileDesc.json', json.dumps(manifest, indent=4))
        
    return zip_path
