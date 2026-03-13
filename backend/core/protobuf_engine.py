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
        # 1. Identity & Chassis Meta
        root_meta = ProtoNavigator.safe_get_path(msg, ["5", "4", "1"])
        if isinstance(root_meta, dict):
            if "1" in root_meta: root_meta["1"]["10"] = payload.robotName.encode('utf-8')
            if "9" in root_meta and "21" in root_meta["9"]:
                type_mapping = {
                    "QUAD_STEER": "quadSteerChassis", "DUAL_STEER": "dualSteerChassis",
                    "SINGLE_STEER": "steerChassis", "DIFF": "differential", "MECANUM": "mecanumChassis"
                }
                root_meta["9"]["21"]["1"] = type_mapping.get(payload.driveType, "differential").encode('utf-8')

        # 2. Wheels Matrix Reconstruction
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
                    injected_wheels.append(nm)
                if template_wheel:
                    nw = copy.deepcopy(template_wheel)
                    ProtoNavigator.deep_patch(nw, "locCoordNX", w.mountX, "17")
                    ProtoNavigator.deep_patch(nw, "locCoordNY", w.mountY, "17")
                    ProtoNavigator.deep_patch(nw, "locCoordNZ", 0.0, "17")
                    injected_wheels.append(nw)
            root_attr["2"]["1"] = static_parts + injected_wheels

        # 3. Dynamic Module Injection (Sensors, IO, etc.)
        all_modules = msg.get("5", [])
        sensor_proto = next((m for m in all_modules if b"laser" in (ProtoNavigator.safe_get_path(m, ["4", "1", "1", "10"]) or b"")), None)
        io_proto = next((m for m in all_modules if b"IO" in (ProtoNavigator.safe_get_path(m, ["4", "1", "1", "10"]) or b"")), None)

        managed_uuids = [s.id for s in payload.sensors] + [b.id for b in payload.ioBoards] + \
                        [a['id'] for a in payload.actuators] + [x['id'] for x in payload.auxiliary]
        
        final_module_list = []
        # Keep essential system modules like MainController
        for mod in all_modules:
            m_name = (ProtoNavigator.safe_get_path(mod, ["4", "1", "1", "10"]) or b"").decode('utf-8')
            m_uuid = (ProtoNavigator.safe_get_path(mod, ["4", "1", "4", "10"]) or b"").decode('utf-8')
            if m_uuid not in managed_uuids and "MainController" in m_name:
                final_module_list.append(mod)
            elif m_uuid not in managed_uuids and m_name != "laser" and "IO" not in m_name:
                final_module_list.append(mod)

        def inject_entity(item, proto, cat="sensor"):
            nonlocal final_module_list
            target = copy.deepcopy(proto) if proto else None
            if target:
                m_data = target.get("4", {})
                real_id = item['id'] if len(item['id']) > 8 else str(uuid.uuid4()).replace("-", "")
                _uuid_cache[item['id']] = real_id
                
                ProtoNavigator.deep_patch(m_data, "module_uuid", real_id, "10")
                ProtoNavigator.deep_patch(m_data, "module_name", item.get('label') or item.get('model'), "10")
                
                if cat == "sensor":
                    ProtoNavigator.deep_patch(m_data, "locCoordX", item.get('offsetX', 0), "17")
                    ProtoNavigator.deep_patch(m_data, "locCoordY", item.get('offsetY', 0), "17")
                    ProtoNavigator.deep_patch(m_data, "locCoordZ", item.get('offsetZ', 0), "17")
                    ProtoNavigator.deep_patch(m_data, "locCoordYAW", item.get('yaw', 0), "17")
                    if item.get('ip'): ProtoNavigator.deep_patch(m_data, "ipAddress", item['ip'], "10")
                elif cat == "io":
                    ProtoNavigator.deep_patch(m_data, "nodeId", item.get('canNodeId'), "12")
                
                final_module_list.append(target)

        for s in payload.sensors: inject_entity(s.dict(), sensor_proto, "sensor")
        for b in payload.ioBoards: inject_entity(b.dict(), io_proto, "io")
        # For actuators/aux, we use sensor_proto as a generic physical block if specialized proto not found
        for a in payload.actuators: inject_entity(a, sensor_proto, "sensor")
        for x in payload.auxiliary: inject_entity(x, sensor_proto, "sensor")

        msg["5"] = final_module_list

    except Exception as e:
        print(f"Build Error: {e}")
        
    return blackboxprotobuf.encode_message(msg, typ)

def build_func_desc(template_path: str, payload: GeneratePayload) -> bytes:
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
    try:
        # Link Logical Bindings to Physical UUIDs
        for io in payload.ioPorts:
            if io.logicBind == "SAFETY_IO_EMC_STOP":
                items = msg.get("12", [])
                if isinstance(items, dict): items = [items]
                for item in items:
                    if ProtoNavigator.safe_get_path(item, ["1", "10"]) == b"safetyEstopKey":
                        item["3"] = 1
                        target_uuid = _uuid_cache.get(io.ioBoardId)
                        if target_uuid:
                            item["10"] = target_uuid.encode('utf-8')
    except Exception as e:
        print(f"Func Binding Error: {e}")
    return blackboxprotobuf.encode_message(msg, typ)

def build_abi_set(template_path: str, payload: GeneratePayload) -> bytes:
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
    return blackboxprotobuf.encode_message(msg, typ)

def generate_industrial_modelset(payload: GeneratePayload, base_modelset_zip: str = None) -> str:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    templates_dir = os.path.join(os.path.dirname(base_dir), "templates")
    
    tmp_base_dir = tempfile.mkdtemp()
    if base_modelset_zip and os.path.exists(base_modelset_zip):
        with zipfile.ZipFile(base_modelset_zip, 'r') as zf: zf.extractall(tmp_base_dir)
        comp_base = os.path.join(tmp_base_dir, 'CompDesc.model')
        func_base = os.path.join(tmp_base_dir, 'FuncDesc.model')
        abi_base = os.path.join(tmp_base_dir, 'AbiSet.model')
    else:
        comp_base = os.path.join(templates_dir, 'CompDesc.model')
        func_base = os.path.join(templates_dir, 'FuncDesc.model')
        abi_base = os.path.join(templates_dir, 'AbiSet.model')

    comp_bytes = build_comp_desc(comp_base, payload)
    func_bytes = build_func_desc(func_base, payload)
    with open(abi_base, 'rb') as f: abi_bytes = f.read()
    
    manifest = {"ModelFileDesc": [
        {"md5": hashlib.md5(comp_bytes).hexdigest(), "name": "CompDesc.model", "type": "MODEL_COMP", "version": payload.version},
        {"md5": hashlib.md5(func_bytes).hexdigest(), "name": "FuncDesc.model", "type": "MODEL_FUNC", "version": payload.version}
    ]}
    
    out_dir = tempfile.mkdtemp()
    zip_path = os.path.join(out_dir, f'{payload.robotName.replace(" ", "_")}_ModelSet.cmodel')
    with zipfile.ZipFile(zip_path, 'w') as zf:
        zf.writestr('CompDesc.model', comp_bytes)
        zf.writestr('FuncDesc.model', func_bytes)
        zf.writestr('AbiSet.model', abi_bytes)
        zf.writestr('ModelFileDesc.json', json.dumps(manifest, indent=4))
    return zip_path
