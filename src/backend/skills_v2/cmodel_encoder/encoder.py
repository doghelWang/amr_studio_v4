import os
import json
import base64
import struct
import hashlib
from ..schemas_pb import controller_model_comp_desc_pb2
from ..schemas_pb import controller_model_abi_set_pb2
from ..schemas_pb import controller_model_abi_desc_pb2
from google.protobuf.json_format import ParseDict
import zipfile
import shutil
from pathlib import Path

_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent

TYPE_STRING_TO_INT = {
    "DATA_BYTES": 0, "DATA_STRING": 1, "DATA_IP": 3, "DATA_BOOL": 4,
    "DATA_INT32": 5, "DATA_UINT32": 6, "DATA_INT64": 7, "DATA_UINT64": 8,
    "DATA_FLOAT": 9, "DATA_DOUBLE": 10, "DATA_COMBOX": 11, "DATA_FIXED_E": 12,
}

def get_md5(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def sanitize_values(data, key=None):
    if isinstance(data, dict):
        return {k: sanitize_values(v, k) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_values(i, key) for i in data]
    elif isinstance(data, str):
        if key in ("stringValue", "string_value", "desc", "key", "path", "moduleGroupName", "module_group_name", "moduleGroupUuid", "unit", "typeKey", "type_key", "typeDesc", "type_desc", "interfaceUuid", "interface_uuid", "linkedInterfaceUuid", "linked_interface_uuid"):
            return data.strip()
        if data.lower() == "true": return True
        if data.lower() == "false": return False
        try:
            if "." in data: return float(data)
            return int(data)
        except: return data
    return data

def proto_final_sync(data):
    if isinstance(data, dict):
        new_dict = {}
        mapping = {
            "moduleComponets": "module_componets",
            "generalAttr": "general_attr",
            "privateAttr": "private_attr",
            "privateAttrs": "private_attrs",
            "interfaceAbility": "interface_ability",
            "interfaceParams": "interface_params",
            "structParam": "struct_param",
            "moreModuleInfo": "more_module_info",
            "moduleGroupName": "module_group_name",
            "moduleGroupUuid": "module_group_uuid",
            "moduleSys": "module_sys",
            "modelVersion": "model_version",
            "extendParams": "extend_params",
            "moduleShape": "module_shape",
            "shapeType": "shape_type",
            "sizeLen": "size_len",
            "sizeWidth": "size_width",
            "sizeHeight": "size_height",
            "interfaceGroup": "interface_Group",
            "interfaceUuid": "interface_uuid",
            "linkedInterfaceUuid": "linked_interface_uuid",
            "arrayBaseEle": "array_base_ele",
            "comboType": "combo_type",
            "typeKey": "type_key",
            "typeDesc": "type_desc",
            "typeGroups": "type_groups",
            "arrayCmobEle": "array_cmob_ele",
            "boolParse": "bool_parse",
            "boolHide": "bool_hide",
            "boolBasic": "bool_basic",
            "boolMustfill": "bool_mustfill",
            "boolNoeditable": "bool_noeditable",
            "fixedSource": "fixed_source",
            "boolDisable": "bool_disable",
            "boolDeprecated": "bool_deprecated",
            "componentAbility": "component_ability",
            "functionAbility": "function_ability",
            "childFunction": "child_function",
            "moduleName": "module_name",
            "moduleDesc": "module_desc",
            "moduleUuid": "module_uuid",
            "versionInfo": "version_info",
            "module3dIcon": "module_3d_icon",
            "subSysType": "sub_sys_type",
            "mainModuleType": "main_module_type",
            "subModuleType": "sub_module_type",
            "venderName": "vender_name",
            "moduleDscType": "module_dsc_type",
            "moduleIcon": "module_icon",
            "stringValue": "string_value",
            "boolValue": "bool_value",
            "int32Value": "int_32_value",
            "uint32Value": "uint_32_value",
            "floatValue": "float_value",
            "doubleValue": "double_value",
            "int32Maxvalue": "int_32_maxvalue",
            "doubleMaxvalue": "double_maxvalue",
            "int32Minvalue": "int_32_minvalue",
            "doubleMinvalue": "double_minvalue"
        }
        for k, v in data.items():
            if k == "type" and isinstance(v, str) and v.startswith("DATA_"):
                new_dict[k] = TYPE_STRING_TO_INT.get(v, 0)
            else:
                new_dict[mapping.get(k, k)] = proto_final_sync(v)
        return new_dict
    elif isinstance(data, list):
        return [proto_final_sync(item) for item in data]
    return data

def resolve_with_fidelity(blueprint, project_dir):
    if isinstance(blueprint, dict):
        if "$ref" in blueprint:
            ref_path = os.path.join(project_dir, blueprint["$ref"])
            if os.path.exists(ref_path):
                with open(ref_path, "r", encoding="utf-8") as f:
                    return resolve_with_fidelity(json.load(f), project_dir)
        return {k: resolve_with_fidelity(v, project_dir) for k, v in blueprint.items()}
    elif isinstance(blueprint, list):
        return [resolve_with_fidelity(i, project_dir) for i in blueprint]
    return blueprint

def standardize_sys_tree(blueprint_root):
    original_info = blueprint_root.get("more_module_info", [])
    if not isinstance(original_info, list): return blueprint_root

    def collect_all_groups(groups):
        result = []
        for g in groups:
            children = g.get("more_module_info", [])
            flat_group = dict(g)
            flat_group["more_module_info"] = []
            result.append(flat_group)
            if children: result.extend(collect_all_groups(children))
        return result

    real_groups = collect_all_groups(original_info)
    blueprint_root["more_module_info"] = real_groups
    blueprint_root["module_group_name"] = ""
    blueprint_root["module_group_uuid"] = ""
    blueprint_root["module_sys"] = ""
    return blueprint_root

def encode_cmodel(project_dir, output_cmodel_path):
    audit = []
    p_path = Path(project_dir)
    
    # 1. CompDesc.model
    with open(p_path / "blueprint_CompDesc.json", "r", encoding="utf-8") as f:
        comp_json = json.load(f)
    
    comp_json = resolve_with_fidelity(comp_json, str(p_path))
    comp_json = sanitize_values(comp_json)
    comp_json = proto_final_sync(comp_json)
    comp_json = standardize_sys_tree(comp_json)
    
    root_obj = controller_model_comp_desc_pb2.Message_Module_Info()
    # USE PARSE DICT but ensure the structure is so explicit that it mimics standard binary
    ParseDict(comp_json, root_obj, ignore_unknown_fields=True)
    
    comp_model_path = p_path / "CompDesc.model"
    with open(comp_model_path, "wb") as f:
        f.write(root_obj.SerializeToString())
    
    audit.append(f"CompDesc.model built: {len(root_obj.SerializeToString())} bytes")

    # 2. AbiSet.model
    abi_json_path = p_path / "AbiSet.json"
    if abi_json_path.exists():
        with open(abi_json_path, "r", encoding="utf-8") as f:
            abi_data = json.load(f)
        abi_data = proto_final_sync(abi_data)
        abi_obj = controller_model_abi_set_pb2.Controller_Ability()
        ParseDict(abi_data, abi_obj, ignore_unknown_fields=True)
        abi_model_path = p_path / "AbiSet.model"
        with open(abi_model_path, "wb") as f:
            f.write(abi_obj.SerializeToString())
        audit.append(f"AbiSet.model built: {len(abi_obj.SerializeToString())} bytes")
    else:
        abi_model_path = p_path / "AbiSet.model"
        with open(abi_model_path, "wb") as f: f.write(b"")

    # 3. FuncDesc.model
    func_model_path = p_path / "FuncDesc.model"
    res_func = _BACKEND_DIR / "resources" / "FuncDesc.model"
    if res_func.exists():
        shutil.copy(res_func, func_model_path)
    else:
        with open(func_model_path, "wb") as f: f.write(b"")
    audit.append("FuncDesc.model included")

    # 4. ModelFileDesc.json
    file_desc = {
        "ModelFileDesc": [
            {"md5": get_md5(str(p_path / "AbiSet.model")), "name": "AbiSet.model", "type": "CAPABILITY", "version": ""},
            {"md5": get_md5(str(func_model_path)), "name": "FuncDesc.model", "type": "MODEL_FUNC", "version": ""},
            {"md5": get_md5(str(comp_model_path)), "name": "CompDesc.model", "type": "MODEL_COMP", "version": ""}
        ]
    }
    with open(p_path / "ModelFileDesc.json", "w", encoding="utf-8") as f:
        json.dump(file_desc, f, indent=4)
    audit.append("ModelFileDesc.json generated")

    with zipfile.ZipFile(output_cmodel_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in ["AbiSet.model", "CompDesc.model", "FuncDesc.model", "ModelFileDesc.json"]:
            z.write(str(p_path / f), f)

    return audit
