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
            "DIFFERENTIAL": "differential",
            "SINGLE_STEER": "steerChassis",
            "DUAL_STEER": "dualSteerChassis",
            "QUAD_STEER": "quadSteerChassis",
            "MECANUM_4": "mecanumChassis",
            "OMNI_3": "omniChassis"
        }
        chassis_type = type_mapping.get(payload.driveType, "differential")
        msg["5"][0]["4"]["1"]["9"]["21"]["1"] = chassis_type.encode('utf-8')

        # Complex Kinematics: Rebuild the motionCenterAttr block per wheel
        attr = msg["5"][0]["4"]
        parts = attr.get("2", {}).get("1", [])
        
        if len(payload.wheels) > 0 and parts:
            # 1. Update overall Chassis parameters (numberOfWheels)
            chassis_part = ProtoNavigator.find_block_by_key(parts, "2", b'\xe5\xba\x95\xe7\x9b\x98\xe5\x8f\x82\xe6\x95\xb0') # "底盘参数"
            if chassis_part:
                ProtoNavigator.update_float_param(chassis_part, "wheelsNum", len(payload.wheels))
            
            # 2. Re-create the motionCenterAttr parts (运动中心参数)
            template_motion_part = ProtoNavigator.find_block_by_key(parts, "2", b'\xe8\xbf\x90\xe5\x8a\xa8\xe4\xb8\xad\xe5\xbf\x83\xe5\x8f\x82\xe6\x95\xb0')
            template_wheel_part = ProtoNavigator.find_block_by_key(parts, "2", b'\xe8\xbd\xae\xe7\xbb\x84\xe5\xb1\x9e\xe6\x80\xa7')

            new_parts = []
            
            # Keep parts that are NOT the ones we are cloning
            for p in parts:
                if p.get("2") not in (b'\xe8\xbf\x90\xe5\x8a\xa8\xe4\xb8\xad\xe5\xbf\x83\xe5\x8f\x82\xe6\x95\xb0', b'\xe8\xbd\xae\xe7\xbb\x84\xe5\xb1\x9e\xe6\x80\xa7'):
                    new_parts.append(p)
            
            # Clone and patch for each wheel
            for _i, w in enumerate(payload.wheels):
                # We won't inject ID for now unless the structure explicitly requires it, 
                # but we will replicate the block so the firmware knows 4 wheels exist.
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
                    new_parts.append(new_motion)

                if template_wheel_part:
                    new_wheel = copy.deepcopy(template_wheel_part)
                    ProtoNavigator.update_float_param(new_wheel, "locCoordNX", w.mountX)
                    ProtoNavigator.update_float_param(new_wheel, "locCoordNY", w.mountY)
                    # Use index to distinguish wheel blocks if required in future
                    new_parts.append(new_wheel)

            # Assign back
            attr["2"]["1"] = new_parts

    except Exception as e:
        print(f"Error compiling CompDesc: {e}")
        import traceback
        traceback.print_exc()

    return blackboxprotobuf.encode_message(msg, typ)

def build_func_desc(template_path: str, payload: GeneratePayload) -> bytes:
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
    
    # Navigation Logic based on Sensors
    has_laser_navi = any(s.type == 'LASER_2D' and s.usageNavi for s in payload.sensors)
    has_imu = any(s.type == 'IMU' for s in payload.sensors)

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
