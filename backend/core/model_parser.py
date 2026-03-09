"""
AMR Studio Pro V4 — Model Parser
=================================
Implements the BINARY (.model) → JSON (AmrProject) reverse parsing pipeline.

This module is the counterpart to protobuf_engine.py: while the engine writes
configurations INTO Protobuf binary files, this parser READS FROM binary files
and reconstructs an AmrProject data structure.

Audit Reference: gemini_audits/2026-03-09_v4_compliance_audit/ F5
"""
import blackboxprotobuf
import uuid
import datetime
from typing import Optional

from core.protobuf_navigator import ProtoNavigator


# Keys for finding specific block types in the Protobuf tree
MOTION_KEY = b'\xe8\xbf\x90\xe5\x8a\xa8\xe4\xb8\xad\xe5\xbf\x83\xe5\x8f\x82\xe6\x95\xb0'  # motionCenterAttr
WHEEL_KEY  = b'\xe8\xbd\xae\xe7\xbb\x84\xe5\xb1\x9e\xe6\x80\xa7'                            # wheelProperties
CHASSIS_KEY = b'\xe5\xba\x95\xe7\x9b\x98\xe5\x8f\x82\xe6\x95\xb0'                          # chassisParams


def _bytes_to_str(val, default='') -> str:
    """Safe decode bytes to string."""
    if isinstance(val, bytes):
        return val.decode('utf-8', errors='replace')
    return str(val) if val is not None else default


def _get_float_param(block: dict, key_name: str, default: float = 0.0) -> float:
    """Read a float parameter from a Protobuf block using ProtoNavigator's find logic."""
    params = block.get('1', [])
    if not isinstance(params, list):
        params = [params]
    for p in params:
        if isinstance(p, dict):
            name_bytes = p.get('1')
            if isinstance(name_bytes, bytes) and name_bytes.decode('utf-8', errors='replace') == key_name:
                val = p.get('2')
                if val is not None:
                    try:
                        import struct
                        if isinstance(val, int):
                            return struct.unpack('<d', struct.pack('<Q', val))[0]
                        return float(val)
                    except Exception:
                        return default
    return default


def _reverse_drive_type(chassis_str: str) -> str:
    """Map internal Protobuf chassis type string back to frontend driveType enum."""
    return {
        'differential':    'DIFFERENTIAL',
        'steerChassis':    'SINGLE_STEER',
        'dualSteerChassis': 'DUAL_STEER',
        'quadSteerChassis': 'QUAD_STEER',
        'mecanumChassis':  'MECANUM_4',
        'omniChassis':     'OMNI_3',
    }.get(chassis_str, 'DIFFERENTIAL')


def _reverse_nav_method(nav_str: str) -> str:
    """Map internal Protobuf nav method string back to frontend navigationMethod enum."""
    return {
        'NAVI_SLAM':             'LIDAR_SLAM',
        'NAVI_REFLECTOR':        'REFLECTOR',
        'NAVI_NATURAL_CONTOUR':  'NATURAL_CONTOUR',
        'NAVI_VISUAL':           'VISUAL_SLAM',
        'NAVI_BARCODE':          'BARCODE_GRID',
        'NAVI_HYBRID':           'HYBRID',
        'NAVI_INERTANCE':        'LIDAR_SLAM',
    }.get(nav_str, 'LIDAR_SLAM')


def parse_comp_desc(comp_path: str) -> dict:
    """
    Parse a CompDesc.model binary file and return an AmrProject-compatible dict.
    
    This is the core inverse operation of build_comp_desc() in protobuf_engine.py.
    """
    with open(comp_path, 'rb') as f:
        msg, _ = blackboxprotobuf.decode_message(f.read())

    robot_name = 'Factory Default AMR'
    version = '1.0'
    drive_type = 'DIFFERENTIAL'
    wheels = []

    try:
        # Extract robot identity info
        identity_block = msg.get('5', [{}])[0].get('4', {}).get('1', {})
        
        name_val = identity_block.get('1', {}).get('10')
        if name_val:
            robot_name = _bytes_to_str(name_val)
        
        ver_val = identity_block.get('5', {}).get('10')
        if ver_val:
            version = _bytes_to_str(ver_val)
        
        # Extract chassis/drive type
        chassis_val = identity_block.get('9', {}).get('21', {}).get('1')
        if chassis_val:
            drive_type = _reverse_drive_type(_bytes_to_str(chassis_val))
        
        # Extract wheel configs from motionCenterAttr blocks
        parts_container = msg.get('5', [{}])[0].get('4', {}).get('2', {}).get('1', [])
        if not isinstance(parts_container, list):
            parts_container = [parts_container]
        
        wheel_idx = 1
        for part in parts_container:
            if not isinstance(part, dict):
                continue
            block_key = part.get('2')
            if block_key == MOTION_KEY:
                # This is a motion center attribute block - reconstruct a WheelConfig
                wheel = {
                    'id': str(uuid.uuid4()),
                    'label': f'Wheel #{wheel_idx}',
                    'mountX': _get_float_param(part, 'locCoordNX'),
                    'mountY': _get_float_param(part, 'locCoordNY'),
                    'mountYaw': 0.0,
                    'orientation': 'FRONT_LEFT' if wheel_idx == 1 else 'FRONT_RIGHT',
                    'headOffsetIdle': _get_float_param(part, 'headOffset(Idle)', 100.0),
                    'tailOffsetIdle': _get_float_param(part, 'tailOffset(Idle)', 100.0),
                    'leftOffsetIdle': _get_float_param(part, 'leftOffset(Idle)', 100.0),
                    'rightOffsetIdle': _get_float_param(part, 'rightOffset(Idle)', 100.0),
                    'maxVelocityIdle': _get_float_param(part, 'maxVelocity(Idle)', 1500.0),
                    'maxAccIdle': _get_float_param(part, 'maxAcc(Idle)', 800.0),
                    'maxDecIdle': _get_float_param(part, 'maxDec(Idle)', 800.0),
                    'headOffsetFull': _get_float_param(part, 'headOffset (Full Load)', 100.0),
                    'tailOffsetFull': _get_float_param(part, 'tailOffset (Full Load)', 100.0),
                    'leftOffsetFull': _get_float_param(part, 'leftOffset (Full Load)', 100.0),
                    'rightOffsetFull': _get_float_param(part, 'rightOffset (Full Load)', 100.0),
                    'maxVelocityFull': _get_float_param(part, 'maxVelocity (Full Load)', 1200.0),
                    'maxAccFull': _get_float_param(part, 'maxAcc (Full Load)', 500.0),
                    'maxDecFull': _get_float_param(part, 'maxDec (Full Load)', 500.0),
                    'driverModel': 'ELMO_GOLD',
                    'canBus': 'CAN0',
                    'canNodeId': wheel_idx,
                    'motorPolarity': 'FORWARD',
                    'zeroPos': 0.0,
                    'leftLimit': -90.0,
                    'rightLimit': 90.0,
                }
                wheels.append(wheel)
                wheel_idx += 1

    except Exception as e:
        print(f'[model_parser] Warning during CompDesc parse: {e}')

    now = datetime.datetime.utcnow().isoformat() + 'Z'
    return {
        'formatVersion': '1.0',
        'meta': {
            'projectId': str(uuid.uuid4()),
            'projectName': robot_name,
            'createdAt': now,
            'modifiedAt': now,
            'author': 'Factory',
            'templateOrigin': 'factory_default',
            'formatVersion': '1.0',
        },
        'config': {
            'identity': {
                'robotName': robot_name,
                'version': version,
                'chassisLength': 1200,
                'chassisWidth': 800,
                'navigationMethod': 'LIDAR_SLAM',
                'driveType': drive_type,
            },
            'mcu': {
                'model': 'RK3588_CTRL_BOARD',
                'canBuses': ['CAN0', 'CAN1', 'CAN2'],
                'ethPorts': ['ETH0', 'ETH1'],
            },
            'ioBoards': [],
            'wheels': wheels,
            'sensors': [],
            'ioPorts': [],
        },
        'snapshots': [],
    }
