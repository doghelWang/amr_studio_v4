import json
import os
import argparse
import sys
import zipfile

# Add schemas_pb to Python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "schemas_pb"))
try:
    import comp_desc_runtime as controller_model_comp_desc_pb2
    import abi_set_runtime as controller_model_abi_set_pb2
    import abi_desc_runtime as controller_model_abi_desc_pb2
except ImportError as e:
    sys.exit(1)

from google.protobuf.json_format import ParseDict

def proto_final_sync(node):
    """
    Ensures JSON keys match the strict CamelCase expected by ParseDict.
    """
    if isinstance(node, dict):
        new_node = {}
        for k, v in node.items():
            new_k = k
            # Root & Components
            if k == "more_module_info": new_k = "moreModuleInfo"
            elif k == "module_componets": new_k = "moduleComponets"
            elif k == "module_group_name": new_k = "moduleGroupName"
            elif k == "module_group_uuid": new_k = "moduleGroupUuid"
            elif k == "general_attr": new_k = "generalAttr"
            elif k == "private_attr": new_k = "privateAttr"
            elif k == "interface_params": new_k = "interfaceParams"
            elif k == "struct_param": new_k = "structParam"
            # Elements
            elif k == "string_value": new_k = "stringValue"
            elif k == "double_value": new_k = "doubleValue"
            elif k == "float_value": new_k = "floatValue"
            elif k == "int32_value": new_k = "int32Value"
            elif k == "uint32_value": new_k = "uint32Value"
            elif k == "bool_value": new_k = "boolValue"
            elif k == "combo_type": new_k = "comboType"
            elif k == "type_key": new_k = "typeKey"
            elif k == "type_groups": new_k = "typeGroups"
            elif k == "array_cmob_ele": new_k = "arrayCmobEle"
            elif k == "array_base_ele": new_k = "arrayBaseEle"
            elif k == "private_attrs": new_k = "privateAttrs"
            
            new_node[new_k] = proto_final_sync(v)
        return new_node
    elif isinstance(node, list):
        return [proto_final_sync(item) for item in node]
    else:
        return node

def resolve_with_fidelity(node, base_dir):
    """
    Recursively loads modules into the blueprint, ensuring NO flattening occurs.
    """
    if isinstance(node, dict):
        if "$ref" in node:
            ref_path = os.path.abspath(os.path.join(base_dir, node["$ref"]))
            if os.path.exists(ref_path):
                with open(ref_path, "r", encoding="utf-8") as f:
                    # After loading the patched module, we don't recurse because 
                    # module files are the leaves of the blueprint.
                    return json.load(f)
            return node
        return {k: resolve_with_fidelity(v, base_dir) for k, v in node.items()}
    elif isinstance(node, list):
        return [resolve_with_fidelity(item, base_dir) for item in node]
    return node

def encode_cmodel(blueprint_path, output_cmodel_path):
    audit = []
    base_dir = os.path.dirname(os.path.abspath(blueprint_path))
    audit.append(f"FIDELITY_BUILD_START: {os.path.basename(output_cmodel_path)}")
    
    # 1. Load Blueprint (The ORIGINAL structure from import)
    with open(blueprint_path, "r", encoding="utf-8") as f:
        blueprint = json.load(f)
    
    # 2. Inject Patched Modules into Original Structure
    print("ENCODER: Injecting modules with structural fidelity...", flush=True)
    full_json = resolve_with_fidelity(blueprint, base_dir)
    
    # 3. Final Key Alignment
    final_json = proto_final_sync(full_json)

    # 4. Serialization
    comp_obj = controller_model_comp_desc_pb2.Message_Module_Info()
    ParseDict(final_json, comp_obj, ignore_unknown_fields=True)
    comp_model_data = comp_obj.SerializeToString()
    audit.append(f"STEP2_SERIALIZED: CompDesc.model ({len(comp_model_data)} bytes)")
    
    # AbilitySet
    abi_model_data = None; abi_json_path = os.path.join(base_dir, "AbiSet.json")
    if os.path.exists(abi_json_path):
        with open(abi_json_path, "r", encoding="utf-8") as f: abi_json = json.load(f)
        final_abi_json = proto_final_sync(abi_json)
        abi_obj = controller_model_abi_set_pb2.Controller_Ability()
        ParseDict(final_abi_json, abi_obj, ignore_unknown_fields=True)
        abi_model_data = abi_obj.SerializeToString()
        audit.append(f"STEP2_SERIALIZED: AbiSet.model ({len(abi_model_data)} bytes)")

    # 5. Pack
    with zipfile.ZipFile(output_cmodel_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.writestr("CompDesc.model", comp_model_data)
        if abi_model_data: zipf.writestr("AbiSet.model", abi_model_data)
        elif os.path.exists(os.path.join(base_dir, "AbiSet.model")):
            zipf.write(os.path.join(base_dir, "AbiSet.model"), "AbiSet.model")
        for other in ["FuncDesc.model", "ModelFileDesc.json"]:
            path = os.path.join(base_dir, other)
            if os.path.exists(path): zipf.write(path, other)

    audit.append(f"EXPORT_FINISH: {os.path.getsize(output_cmodel_path)} bytes")
    return audit
