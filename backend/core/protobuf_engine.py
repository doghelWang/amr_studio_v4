import blackboxprotobuf
import struct
import json
import hashlib
import os
import zipfile
import tempfile
import copy
import uuid
from schemas.api import GeneratePayload
from core.protobuf_navigator import ProtoNavigator

def float_to_uint64(f: float) -> int:
    return struct.unpack('<Q', struct.pack('<d', float(f)))[0]

_uuid_cache = {}

def build_comp_desc(template_path: str, payload: GeneratePayload) -> bytes:
    global _uuid_cache
    _uuid_cache = {}
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
        
    try:
        # 1. Global Metadata & Identity
        ProtoNavigator.deep_patch(msg, "module_name", payload.robotName, "10")
        
        # 2. Drive Type
        type_mapping = {
            "QUAD_STEER": "quadSteerChassis", 
            "DIFF": "differential", 
            "DIFFERENTIAL": "differential",
            "MECANUM": "mecanumChassis",
            "SINGLE_STEER": "steerChassis",
            "DUAL_STEER": "dualSteerChassis"
        }
        chassis_type = type_mapping.get(payload.driveType, "differential")
        ProtoNavigator.deep_patch(msg, "sub_module_type", chassis_type, "1")

        # 3. Chassis Parts (Wheels)
        root_attr = ProtoNavigator.safe_get_path(msg, ["5", "4"])
        if isinstance(root_attr, dict):
            parts = root_attr.get("2", {}).get("1", [])
            MOTION_KEY = b'\xe8\xbf\x90\xe5\x8a\xa8\xe4\xb8\xad\xe5\xbf\x83\xe5\x8f\x82\xe6\x95\xb0'
            WHEEL_KEY  = b'\xe8\xbd\xae\xe7\xbb\x84\xe5\xb1\x9e\xe6\x80\xa7'
            
            template_motion = next((p for p in parts if isinstance(p, dict) and p.get("2") == MOTION_KEY), None)
            template_wheel = next((p for p in parts if isinstance(p, dict) and p.get("2") == WHEEL_KEY), None)
            
            static_parts = [p for p in parts if not (isinstance(p, dict) and p.get("2") in (MOTION_KEY, WHEEL_KEY))]
            injected_wheels = []
            for w in payload.wheels:
                if template_motion:
                    nm = copy.deepcopy(template_motion)
                    ProtoNavigator.deep_patch(nm, "headOffset(Idle)", w.headOffsetIdle, "17")
                    ProtoNavigator.deep_patch(nm, "headOffset (Full Load)", w.headOffsetFull, "17")
                    injected_wheels.append(nm)
                if template_wheel:
                    nw = copy.deepcopy(template_wheel)
                    ProtoNavigator.deep_patch(nw, "locCoordNX", w.mountX, "17")
                    ProtoNavigator.deep_patch(nw, "locCoordNY", w.mountY, "17")
                    injected_wheels.append(nw)
            root_attr["2"]["1"] = static_parts + injected_wheels

        # 4. Modules (Sensors & IO)
        all_modules = msg.get("5", [])
        sensor_proto = None
        io_proto = None
        for mod in all_modules:
            m_name = ProtoNavigator.safe_get_path(mod, ["4", "1", "1", "10"])
            if m_name == b"laser": sensor_proto = copy.deepcopy(mod)
            if m_name and b"IO" in m_name: io_proto = copy.deepcopy(mod)

        filtered_modules = [m for m in all_modules if not (
            ProtoNavigator.safe_get_path(m, ["4", "1", "1", "10"]) == b"laser" or 
            b"IO" in (ProtoNavigator.safe_get_path(m, ["4", "1", "1", "10"]) or b"")
        )]
        
        new_modules = []
        for s in payload.sensors:
            if sensor_proto:
                ns = copy.deepcopy(sensor_proto)
                m_data = ns.get("4", {})
                gen_uuid = str(uuid.uuid4()).replace("-", "")
                _uuid_cache[s.id] = gen_uuid
                ProtoNavigator.deep_patch(m_data, "module_name", s.model, "10")
                ProtoNavigator.deep_patch(m_data, "module_uuid", gen_uuid, "10")
                ProtoNavigator.deep_patch(m_data, "locCoordX", s.offsetX, "17")
                ProtoNavigator.deep_patch(m_data, "locCoordY", s.offsetY, "17")
                ProtoNavigator.deep_patch(m_data, "locCoordZ", s.offsetZ, "17")
                if s.ip: ProtoNavigator.deep_patch(m_data, "ipAddress", s.ip, "10")
                if s.port: ProtoNavigator.deep_patch(m_data, "port", s.port, "12")
                new_modules.append(ns)

        for b in payload.ioBoards:
            if io_proto:
                ni = copy.deepcopy(io_proto)
                m_data = ni.get("4", {})
                gen_uuid = str(uuid.uuid4()).replace("-", "")
                _uuid_cache[b.id] = gen_uuid
                ProtoNavigator.deep_patch(m_data, "module_name", b.model, "10")
                ProtoNavigator.deep_patch(m_data, "module_uuid", gen_uuid, "10")
                ProtoNavigator.deep_patch(m_data, "nodeId", b.canNodeId, "12")
                new_modules.append(ni)

        msg["5"] = filtered_modules + new_modules

    except Exception as e:
        print(f"Error compiling CompDesc: {e}")
        
    return blackboxprotobuf.encode_message(msg, typ)

def build_func_desc(template_path: str, payload: GeneratePayload) -> bytes:
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
    try:
        for io in payload.ioPorts:
            if io.logicBind == "SAFETY_IO_EMC_STOP":
                items = msg.get("12", [])
                if isinstance(items, dict): items = [items]
                for item in items:
                    if ProtoNavigator.safe_get_path(item, ["1", "10"]) == b"safetyEstopKey":
                        item["3"] = 1
                        if io.originModel in _uuid_cache:
                            item["10"] = _uuid_cache[io.originModel].encode('utf-8')
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
    
    manifest = {
        "ModelFileDesc": [
            {"md5": hashlib.md5(abi_bytes).hexdigest(), "name": "AbiSet.model", "type": "CAPABILITY", "version": payload.version},
            {"md5": hashlib.md5(func_bytes).hexdigest(), "name": "FuncDesc.model", "type": "MODEL_FUNC", "version": payload.version},
            {"md5": hashlib.md5(comp_bytes).hexdigest(), "name": "CompDesc.model", "type": "MODEL_COMP", "version": payload.version}
        ]
    }
    
    temp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(temp_dir, f'{payload.robotName.replace(" ", "_")}_ModelSet.cmodel')
    with zipfile.ZipFile(zip_path, 'w') as zf:
        zf.writestr('AbiSet.model', abi_bytes)
        zf.writestr('FuncDesc.model', func_bytes)
        zf.writestr('CompDesc.model', comp_bytes)
        zf.writestr('ModelFileDesc.json', json.dumps(manifest, indent=4))
    return zip_path
