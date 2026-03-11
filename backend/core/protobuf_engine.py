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
        # 1. Global Metadata & Identity (Apply to all root modules)
        ProtoNavigator.deep_patch(msg, "module_name", payload.robotName, "10")
        
        # 2. Drive Type
        type_mapping = {"QUAD_STEER": "quadSteerChassis", "DIFF": "differential", "MECANUM": "mecanumChassis"}
        chassis_type = type_mapping.get(payload.driveType, "differential")
        ProtoNavigator.deep_patch(msg, "sub_module_type", chassis_type, "1")

        # 3. Component Extraction (Wheels)
        root_mod = msg["5"][0]["4"]
        parts = root_mod.get("2", {}).get("1", [])
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
                injected_wheels.append(nm)
            if template_wheel:
                nw = copy.deepcopy(template_wheel)
                ProtoNavigator.deep_patch(nw, "locCoordNX", w.mountX, "17")
                ProtoNavigator.deep_patch(nw, "locCoordNY", w.mountY, "17")
                injected_wheels.append(nw)
        root_mod["2"]["1"] = static_parts + injected_wheels

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
                gen_uuid = str(uuid.uuid4()).replace("-", "")
                _uuid_cache[s.id] = gen_uuid
                # Patch all attributes inside this module
                ProtoNavigator.deep_patch(ns, "module_name", s.model, "10")
                ProtoNavigator.deep_patch(ns, "module_uuid", gen_uuid, "10")
                ProtoNavigator.deep_patch(ns, "locCoordX", s.offsetX, "17")
                ProtoNavigator.deep_patch(ns, "locCoordY", s.offsetY, "17")
                ProtoNavigator.deep_patch(ns, "locCoordZ", s.offsetZ, "17")
                if s.ip: ProtoNavigator.deep_patch(ns, "ipAddress", s.ip, "10")
                if s.port: ProtoNavigator.deep_patch(ns, "port", s.port, "12")
                new_modules.append(ns)

        for b in payload.ioBoards:
            if io_proto:
                ni = copy.deepcopy(io_proto)
                gen_uuid = str(uuid.uuid4()).replace("-", "")
                _uuid_cache[b.id] = gen_uuid
                ProtoNavigator.deep_patch(ni, "module_name", b.model, "10")
                ProtoNavigator.deep_patch(ni, "module_uuid", gen_uuid, "10")
                ProtoNavigator.deep_patch(ni, "nodeId", b.canNodeId, "12")
                new_modules.append(ni)

        msg["5"] = filtered_modules + new_modules

    except Exception as e:
        print(f"Error compiling CompDesc: {e}")
        import traceback
        traceback.print_exc()

    return blackboxprotobuf.encode_message(msg, typ)

def build_func_desc(template_path: str, payload: GeneratePayload) -> bytes:
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
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
    manifest = {"ModelFileDesc": [{"md5": hashlib.md5(comp_bytes).hexdigest(), "name": "CompDesc.model", "type": "MODEL_COMP", "version": payload.version}]}
    temp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(temp_dir, f'{payload.robotName}_ModelSet.zip')
    with zipfile.ZipFile(zip_path, 'w') as zf:
        zf.writestr('CompDesc.model', comp_bytes)
        zf.writestr('ModelFileDesc.json', json.dumps(manifest))
    return zip_path
