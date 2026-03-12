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

def get_factory_prototype(category: str) -> dict:
    """Extracts a clean prototype from the factory default template to solve Template Starvation."""
    templates_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'templates')
    comp_path = os.path.join(templates_dir, 'CompDesc.model')
    if not os.path.exists(comp_path): return None
    with open(comp_path, 'rb') as f:
        msg, _ = blackboxprotobuf.decode_message(f.read())
        for mod in msg.get("5", []):
            name = (ProtoNavigator.safe_get_path(mod, ["4", "1", "1", "10"]) or b"").decode('utf-8', errors='ignore')
            if category == "laser" and name == "laser": return copy.deepcopy(mod)
            if category == "IO" and "IO" in name: return copy.deepcopy(mod)
    return None

def build_comp_desc(template_path: str, payload: GeneratePayload) -> bytes:
    global _uuid_cache
    _uuid_cache = {}
    
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
        
    try:
        # 1. Scoped Metadata
        root_meta = ProtoNavigator.safe_get_path(msg, ["5", "4", "1"])
        if isinstance(root_meta, dict):
            if "1" in root_meta: root_meta["1"]["10"] = payload.robotName.encode('utf-8')
            
            if "9" in root_meta and "21" in root_meta["9"]:
                type_mapping = {
                    "QUAD_STEER": "quadSteerChassis", 
                    "DUAL_STEER": "dualSteerChassis",
                    "SINGLE_STEER": "steerChassis",
                    "DIFF": "differential", 
                    "MECANUM": "mecanumChassis"
                }
                root_meta["9"]["21"]["1"] = type_mapping.get(payload.driveType, "differential").encode('utf-8')

        # 2. Wheels Matrix: V5 Expansion Sync
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
                    injected_wheels.append(nw)
            root_attr["2"]["1"] = static_parts + injected_wheels

        # 3. Component Sync (Sensors & IO) V5 Gene-Anchored Recombination
        all_modules = msg.get("5", [])
        if isinstance(all_modules, dict): all_modules = [all_modules]
        
        # Extract Prototypes
        sensor_proto = next((copy.deepcopy(m) for m in all_modules if (ProtoNavigator.safe_get_path(m, ["4", "1", "1", "10"]) or b"") == b"laser"), None)
        io_proto = next((copy.deepcopy(m) for m in all_modules if b"IO" in (ProtoNavigator.safe_get_path(m, ["4", "1", "1", "10"]) or b"")), None)
        
        if not sensor_proto: sensor_proto = get_factory_prototype("laser")
        if not io_proto: io_proto = get_factory_prototype("IO")

        managed_uuids = [s.id for s in payload.sensors] + [b.id for b in payload.ioBoards]
        
        final_module_list = []
        
        # Keep non-managed modules UNTOUCHED
        for mod in all_modules:
            m_uuid = ProtoNavigator.safe_get_path(mod, ["4", "1", "4", "10"])
            m_uuid_str = m_uuid.decode('utf-8', errors='ignore') if isinstance(m_uuid, bytes) else ""
            m_name = (ProtoNavigator.safe_get_path(mod, ["4", "1", "1", "10"]) or b"").decode('utf-8', errors='ignore')
            
            is_managed_type = "laser" in m_name.lower() or "camera" in m_name.lower() or "io" in m_name.lower() or "button" in m_name.lower()
            
            if not is_managed_type and m_uuid_str not in managed_uuids:
                final_module_list.append(mod)

        # Inject/Update Sensors from Payload
        for s in payload.sensors:
            existing = next((m for m in all_modules if (ProtoNavigator.safe_get_path(m, ["4", "1", "4", "10"]) or b"").decode('utf-8', errors='ignore') == s.id), None)
            target = copy.deepcopy(existing) if existing else copy.deepcopy(sensor_proto)
            
            if target:
                m_data = target.get("4", {})
                # Ensure stable UUID
                gen_uuid = s.id if s.id and not s.id.startswith('virtual-uuid-') else str(uuid.uuid4()).replace("-", "")
                _uuid_cache[s.id] = gen_uuid
                
                ProtoNavigator.deep_patch(m_data, "module_name", s.model, "10")
                ProtoNavigator.deep_patch(m_data, "module_uuid", gen_uuid, "10")
                ProtoNavigator.deep_patch(m_data, "locCoordX", s.offsetX, "17")
                ProtoNavigator.deep_patch(m_data, "locCoordY", s.offsetY, "17")
                ProtoNavigator.deep_patch(m_data, "locCoordZ", s.offsetZ, "17")
                ProtoNavigator.deep_patch(m_data, "locCoordYAW", s.yaw, "17")
                
                if getattr(s, 'ip', None): ProtoNavigator.deep_patch(m_data, "ipAddress", s.ip, "10")
                if getattr(s, 'port', None): ProtoNavigator.deep_patch(m_data, "port", s.port, "12")
                
                final_module_list.append(target)

        # Inject/Update IO Boards
        for b in payload.ioBoards:
            existing = next((m for m in all_modules if (ProtoNavigator.safe_get_path(m, ["4", "1", "4", "10"]) or b"").decode('utf-8', errors='ignore') == b.id), None)
            target = copy.deepcopy(existing) if existing else copy.deepcopy(io_proto)
            
            if target:
                m_data = target.get("4", {})
                gen_uuid = b.id if b.id and not b.id.startswith('virtual-uuid-') else str(uuid.uuid4()).replace("-", "")
                _uuid_cache[b.id] = gen_uuid
                
                ProtoNavigator.deep_patch(m_data, "module_name", b.model, "10")
                ProtoNavigator.deep_patch(m_data, "module_uuid", gen_uuid, "10")
                ProtoNavigator.deep_patch(m_data, "nodeId", b.canNodeId, "12")
                final_module_list.append(target)

        msg["5"] = final_module_list

    except Exception as e:
        print(f"Hybrid Sync Error: {e}")
        
    return blackboxprotobuf.encode_message(msg, typ)

def build_func_desc(template_path: str, payload: GeneratePayload) -> bytes:
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
    try:
        # Re-establish logical bindings
        for io in payload.ioPorts:
            if io.logicBind == "SAFETY_IO_EMC_STOP":
                items = msg.get("12", [])
                if isinstance(items, dict): items = [items]
                for item in items:
                    if ProtoNavigator.safe_get_path(item, ["1", "10"]) == b"safetyEstopKey":
                        item["3"] = 1 # Enable
                        target_uuid = _uuid_cache.get(io.originModel)
                        if target_uuid:
                            item["10"] = target_uuid.encode('utf-8')
    except Exception as e:
        print(f"FuncDesc Binding Error: {e}")
    return blackboxprotobuf.encode_message(msg, typ)

def build_abi_set(template_path: str, payload: GeneratePayload) -> bytes:
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
    return blackboxprotobuf.encode_message(msg, typ)

def generate_industrial_modelset(payload: GeneratePayload, base_modelset_zip: str = None) -> str:
    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    templates_dir = os.path.join(os.path.dirname(CURRENT_DIR), '..', 'templates')
    
    tmp_base_dir = tempfile.mkdtemp()
    if base_modelset_zip and os.path.exists(base_modelset_zip):
        with zipfile.ZipFile(base_modelset_zip, 'r') as zf:
            zf.extractall(tmp_base_dir)
        comp_base = os.path.join(tmp_base_dir, 'CompDesc.model')
        func_base = os.path.join(tmp_base_dir, 'FuncDesc.model')
        abi_base = os.path.join(tmp_base_dir, 'AbiSet.model')
    else:
        comp_base = os.path.join(templates_dir, 'CompDesc.model')
        func_base = os.path.join(templates_dir, 'FuncDesc.model')
        abi_base = os.path.join(templates_dir, 'AbiSet.model')

    # Apply Gene-Anchored Recombination Sync
    comp_bytes = build_comp_desc(comp_base, payload)
    func_bytes = build_func_desc(func_base, payload) 
    
    with open(abi_base, 'rb') as f: abi_bytes = f.read()
    
    manifest = {
        "ModelFileDesc": [
            {"md5": hashlib.md5(abi_bytes).hexdigest(), "name": "AbiSet.model", "type": "CAPABILITY", "version": payload.version},
            {"md5": hashlib.md5(func_bytes).hexdigest(), "name": "FuncDesc.model", "type": "MODEL_FUNC", "version": payload.version},
            {"md5": hashlib.md5(comp_bytes).hexdigest(), "name": "CompDesc.model", "type": "MODEL_COMP", "version": payload.version}
        ]
    }
    
    temp_export_dir = tempfile.mkdtemp()
    # Replace spaces cleanly for the filename
    safe_name = payload.robotName.replace(" ", "_") if payload.robotName else "Export"
    zip_path = os.path.join(temp_export_dir, f'{safe_name}_ModelSet.cmodel')
    with zipfile.ZipFile(zip_path, 'w') as zf:
        zf.writestr('AbiSet.model', abi_bytes)
        zf.writestr('CompDesc.model', comp_bytes)
        zf.writestr('FuncDesc.model', func_bytes)
        zf.writestr('ModelFileDesc.json', json.dumps(manifest, indent=4))
        
    return zip_path
