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
    print("Error importing schemas_pb:", e)
    sys.exit(1)

from google.protobuf.json_format import ParseDict

def resolve_refs(node, base_dir):
    """Recursively resolve $ref pointers"""
    if isinstance(node, dict):
        if "$ref" in node:
            ref_path = os.path.join(base_dir, node["$ref"])
            with open(ref_path, "r", encoding="utf-8") as f:
                return json.load(f)
        else:
            new_node = {}
            for k, v in node.items():
                new_node[k] = resolve_refs(v, base_dir)
            return new_node
    elif isinstance(node, list):
        return [resolve_refs(item, base_dir) for item in node]
    else:
        return node

def encode_cmodel(blueprint_path, output_cmodel_path):
    base_dir = os.path.dirname(os.path.abspath(blueprint_path))
    
    print(f"Reading blueprint from {blueprint_path}...")
    with open(blueprint_path, "r", encoding="utf-8") as f:
        blueprint = json.load(f)
    
    print("Resolving module references and assembling tree...")
    full_json = resolve_refs(blueprint, base_dir)
    
    print("Parsing JSON into Protobuf (Message_Module_Info)...")
    comp_obj = controller_model_comp_desc_pb2.Message_Module_Info()
    ParseDict(full_json, comp_obj, ignore_unknown_fields=False)
    
    temp_model_path = os.path.join(base_dir, "CompDesc_rebuilt.model")
    with open(temp_model_path, "wb") as f:
        f.write(comp_obj.SerializeToString())
        
    print(f"Zipping into {output_cmodel_path}...")
    with zipfile.ZipFile(output_cmodel_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Write our newly built CompDesc.model
        zipf.write(temp_model_path, "CompDesc.model")
        
        # Pull in the other original models if they exist in base_dir
        for other in ["AbiSet.model", "FuncDesc.model", "ModelFileDesc.json"]:
            oth_path = os.path.join(base_dir, other)
            if os.path.exists(oth_path):
                zipf.write(oth_path, other)

    print(f"Successfully encoded and verified generation of {output_cmodel_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser("Assemble blueprint and modules back into .cmodel")
    parser.add_argument("blueprint_path", help="Path to blueprint_CompDesc.json")
    parser.add_argument("output_cmodel", help="Path to output .cmodel file")
    args = parser.parse_args()
    encode_cmodel(args.blueprint_path, args.output_cmodel)
