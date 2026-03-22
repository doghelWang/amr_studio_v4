import json
import os
import argparse
import sys
import zipfile

# Add schemas_pb to Python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "schemas_pb"))
try:
    import controller_model_comp_desc_pb2
    import controller_model_abi_set_pb2
    import controller_model_abi_desc_pb2
except ImportError as e:
    sys.exit(1)

from google.protobuf.json_format import ParseDict

def resolve_refs(node, base_dir, visited=None):
    """Recursively resolve $ref pointers with cycle protection"""
    if visited is None:
        visited = set()

    if isinstance(node, dict):
        if "$ref" in node:
            ref_path = os.path.abspath(os.path.join(base_dir, node["$ref"]))
            if ref_path in visited:
                return {"_error": "circular_ref"}
            
            # Create a NEW set for branch isolation
            new_visited = set(visited)
            new_visited.add(ref_path)
            
            if not os.path.exists(ref_path):
                return {"_error": f"missing_file_{node['$ref']}"}
                
            with open(ref_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return resolve_refs(data, base_dir, new_visited)
        else:
            return {k: resolve_refs(v, base_dir, visited) for k, v in node.items()}
    elif isinstance(node, list):
        return [resolve_refs(item, base_dir, visited) for item in node]
    else:
        return node

def encode_cmodel(blueprint_path, output_cmodel_path):
    audit = []
    base_dir = os.path.dirname(os.path.abspath(blueprint_path))
    audit.append(f"EXPORT_START: {os.path.basename(output_cmodel_path)}")
    
    print(f"ENCODER: Building {output_cmodel_path} from {blueprint_path}", flush=True)
    
    with open(blueprint_path, "r", encoding="utf-8") as f:
        blueprint = json.load(f)
    
    # Step 1: Resolve
    full_json = resolve_refs(blueprint, base_dir)
    json_len = len(json.dumps(full_json))
    audit.append(f"STEP1_JSON_ASSEMBLED: {json_len} chars")
    
    # Step 2: Serialization
    comp_obj = controller_model_comp_desc_pb2.Message_Module_Info()
    ParseDict(full_json, comp_obj, ignore_unknown_fields=True)
    comp_model_data = comp_obj.SerializeToString()
    audit.append(f"STEP2_COMPDESC_SERIALIZED: {len(comp_model_data)} bytes")
    
    abi_model_data = None
    abi_json_path = os.path.join(base_dir, "AbiSet.json")
    if os.path.exists(abi_json_path):
        with open(abi_json_path, "r", encoding="utf-8") as f:
            abi_json = json.load(f)
        abi_obj = controller_model_abi_set_pb2.Controller_Ability()
        ParseDict(abi_json, abi_obj, ignore_unknown_fields=True)
        abi_model_data = abi_obj.SerializeToString()
        audit.append(f"STEP2_ABISET_SERIALIZED: {len(abi_model_data)} bytes")

    # Step 3: ZIP
    with zipfile.ZipFile(output_cmodel_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.writestr("CompDesc.model", comp_model_data)
        if abi_model_data:
            zipf.writestr("AbiSet.model", abi_model_data)
        elif os.path.exists(os.path.join(base_dir, "AbiSet.model")):
            zipf.write(os.path.join(base_dir, "AbiSet.model"), "AbiSet.model")

        for other in ["FuncDesc.model", "ModelFileDesc.json"]:
            path = os.path.join(base_dir, other)
            if os.path.exists(path):
                zipf.write(path, other)

    final_size = os.path.getsize(output_cmodel_path)
    audit.append(f"EXPORT_COMPLETE: FINAL ZIP SIZE: {final_size} bytes")
    print(f"ENCODER: Done. Final size: {final_size}", flush=True)
    return audit
