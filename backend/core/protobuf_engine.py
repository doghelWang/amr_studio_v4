import os
import json
import zipfile
import tempfile
import hashlib
import blackboxprotobuf
from schemas.api import GeneratePayload
from core.schema_builder import CustomCompDescBuilder

def generate_industrial_modelset(payload: GeneratePayload, base_modelset_zip: str = None) -> str:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    templates_dir = os.path.join(os.path.dirname(base_dir), "templates")
    
    comp_base = os.path.join(templates_dir, 'CompDesc.model')
    func_base = os.path.join(templates_dir, 'FuncDesc.model')
    abi_base = os.path.join(templates_dir, 'AbiSet.model')

    # Use the new Schema Builder for CompDesc (guaranteed clean binary)
    builder = CustomCompDescBuilder(comp_base)
    # Rebuild the main structure. We modify `build_from_payload` to return bytes for manual assembly here
    chassis_node = builder._create_node("chassis", payload.robotName, f"{payload.chassisLength}x{payload.chassisWidth}x200")
    chassis_uuid = chassis_node["5"]
    
    chassis_props = {
        "2": b"\xe5\xba\x95\xe7\x9b\x98\xe5\x8f\x82\xe6\x95\xb0", 
        "3": [
            {"51": b"\xe8\xbd\xae\xe7\xbb\x84\xe4\xb8\xaa\xe6\x95\xb0", "2": 5, "17": len(payload.wheels)}
        ]
    }
    chassis_node["4"][0]["2"]["1"].append(chassis_props)
    builder.payload["5"].append(chassis_node)
    
    for w in payload.wheels:
        wnode = builder._create_node("driveWheel", w.label)
        builder._add_relation(wnode, chassis_uuid, w.mountX, w.mountY, 0)
        builder.payload["5"].append(wnode)
        
    sensor_ports = {}
    for s in payload.sensors:
        snode = builder._create_node("sensor", s.label)
        builder._add_relation(snode, chassis_uuid, s.mountX, s.mountY, getattr(s, 'mountZ', 0))
        s_uuid, port = builder._add_interface(snode, "ETH", "ETH_1")
        sensor_ports[s.id] = {"node": snode, "port": port, "uuid": s_uuid}
        builder.payload["5"].append(snode)
        
    mcu_node = builder._create_node("mainCPU", "MainController")
    builder._add_relation(mcu_node, chassis_uuid, 0, 0, 0)
    
    for s_id, s_info in sensor_ports.items():
        mcu_eth_uuid, mcu_port = builder._add_interface(mcu_node, "ETH", f"ETH_{s_id[:4]}")
        mcu_port["6"].append(s_info["uuid"])
        s_info["port"]["6"].append(mcu_eth_uuid)
        
    builder.payload["5"].append(mcu_node)
    
    comp_bytes = blackboxprotobuf.encode_message(builder.payload, builder.schema)
    
    # Passthrough the boilerplate auxiliary files
    with open(func_base, 'rb') as f:
        func_msg, func_typ = blackboxprotobuf.decode_message(f.read())
        func_bytes = blackboxprotobuf.encode_message(func_msg, func_typ)
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
