import os
import json
import zipfile
import re
import hashlib
from pathlib import Path
from google.protobuf.json_format import ParseDict
from skills_v2.schemas_pb import controller_model_comp_desc_pb2
from skills_v2.schemas_pb import controller_model_abi_set_pb2

# --- UTILS ---
def to_snake(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

def proto_final_sync(data):
    """
    Recursively aligns data keys with Protobuf naming conventions.
    """
    if isinstance(data, dict):
        new_dict = {}
        for k, v in data.items():
            # Standard Proto spelling is "module_componets" (no 'n')
            if k == "moduleComponets":
                new_key = "module_componets"
            elif not k.isdigit() and not k.startswith('$'):
                new_key = to_snake(k)
            else:
                new_key = k
            new_dict[new_key] = proto_final_sync(v)
        return new_dict
    elif isinstance(data, list):
        return [proto_final_sync(item) for item in data]
    return data

def resolve_with_fidelity(blueprint, project_dir):
    if isinstance(blueprint, dict):
        if "$ref" in blueprint:
            m_path = os.path.join(project_dir, blueprint["$ref"])
            if os.path.exists(m_path):
                with open(m_path, "r", encoding="utf-8") as f: return resolve_with_fidelity(json.load(f), project_dir)
        return {k: resolve_with_fidelity(v, project_dir) for k, v in blueprint.items()}
    elif isinstance(blueprint, list):
        return [resolve_with_fidelity(item, project_dir) for item in blueprint]
    return blueprint

# --- MAIN ENCODER ---
def encode_cmodel(blueprint_path, output_cmodel_path):
    audit = []
    project_dir = os.path.dirname(blueprint_path)
    with open(blueprint_path, "r", encoding="utf-8") as f: blueprint = json.load(f)
    full_json = resolve_with_fidelity(blueprint, project_dir)
    final_json = proto_final_sync(full_json)

    # 1. CompDesc Serialization (Naked Stream)
    comp_model_data = b""
    groups = final_json.get("more_module_info", [])
    for root_group in groups:
        if not root_group.get("module_componets") and not root_group.get("more_module_info"):
            continue
        temp_obj = controller_model_comp_desc_pb2.Message_Module_Info()
        dummy_wrapper = {"more_module_info": [root_group]}
        ParseDict(dummy_wrapper, temp_obj, ignore_unknown_fields=True)
        comp_model_data += temp_obj.SerializeToString()
    
    audit.append(f"STEP2_SERIALIZED: CompDesc.model ({len(comp_model_data)} bytes)")

    # 2. AbiSet Serialization (Fixed: Using correct Controller_Ability message)
    abi_model_data = b""
    abi_json_path = os.path.join(project_dir, "AbiSet.json")
    try:
        abi_obj = controller_model_abi_set_pb2.Controller_Ability()
        if os.path.exists(abi_json_path):
            with open(abi_json_path, "r", encoding="utf-8") as f:
                abi_data = proto_final_sync(json.load(f))
                ParseDict(abi_data, abi_obj, ignore_unknown_fields=True)
        else:
            abi_obj.version = "1.0"
        
        abi_model_data = abi_obj.SerializeToString()
        audit.append(f"STEP3_SERIALIZED: AbiSet.model ({len(abi_model_data)} bytes)")
    except Exception as e:
        audit.append(f"STEP3_ERROR: AbiSet failed: {str(e)}")

    # 3. FuncDesc (Baseline)
    func_model_data = b""
    baseline_func_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "resources", "FuncDesc_base.model")
    if os.path.exists(baseline_func_path):
        with open(baseline_func_path, "rb") as f: func_model_data = f.read()

    # 4. Final Pack (FORCE Windows FAT32 Compatibility)
    def get_md5(data): return hashlib.md5(data).hexdigest()
    
    files_to_pack = [
        ("AbiSet.model", abi_model_data, "CAPABILITY"),
        ("CompDesc.model", comp_model_data, "MODEL_COMP"),
        ("FuncDesc.model", func_model_data, "MODEL_FUNC")
    ]

    with zipfile.ZipFile(output_cmodel_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        manifest_entries = []
        for fname, fdata, ftype in files_to_pack:
            if not fdata: continue
            zinfo = zipfile.ZipInfo(fname); zinfo.create_system = 0; zinfo.external_attr = 0; zinfo.compress_type = zipfile.ZIP_DEFLATED
            with zipf.open(zinfo, 'w') as dest: dest.write(fdata)
            manifest_entries.append({"md5": get_md5(fdata), "name": fname, "type": ftype, "version": ""})
        
        manifest_content = json.dumps({"ModelFileDesc": manifest_entries}, indent=4).encode('utf-8')
        zinfo_json = zipfile.ZipInfo("ModelFileDesc.json"); zinfo_json.create_system = 0; zinfo_json.external_attr = 0; zinfo_json.compress_type = zipfile.ZIP_DEFLATED
        with zipf.open(zinfo_json, 'w') as dest: dest.write(manifest_content)

    return audit
