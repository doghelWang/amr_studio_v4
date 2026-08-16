import json
import hashlib
from app.infrastructure.protobuf.generated import controller_model_comp_desc_pb2
from app.infrastructure.protobuf.generated import controller_model_abi_set_pb2
from app.infrastructure.protobuf.generated import controller_model_abi_desc_pb2
from google.protobuf.json_format import ParseDict
import zipfile
import shutil
from pathlib import Path

_BACKEND_DIR = Path(__file__).resolve().parents[3]

COMP_DESC_TYPE_STRING_TO_INT = {
    "DATA_BYTES": 0, "DATA_STRING": 1, "DATA_IP": 3, "DATA_BOOL": 4,
    "DATA_INT32": 5, "DATA_UINT32": 6, "DATA_INT64": 7, "DATA_UINT64": 8,
    "DATA_FLOAT": 9, "DATA_DOUBLE": 10, "DATA_COMBOX": 11, "DATA_FIXED_E": 12,
}

ABI_TYPE_STRING_TO_INT = {
    "BYTES_E": 0, "STRING_E": 1, "IP_E": 3, "BOOL_E": 4,
    "INT32_E": 5, "UINT32_E": 6, "INT64_E": 7, "UINT64_E": 8,
    "FLOAT_E": 9, "DOUBLE_E": 10, "FIXED_E": 11, "DATA_COMBOX_E": 12,
    # Backward-compatibility for pre-fix JSON payloads still stored on disk.
    "DATA_FIXED_E": 11, "DATA_COMBOX": 12,
    # COMMON_ATTR_TYPE aliases used by the frontend ability editor. These
    # are distinct from MESSAGE_ATTRIBUTE_TYPE but share the JSON key `type`.
    "COMBOX": 0, "COMBOX_E": 0, "ARRAY": 1, "ARRAY_E": 1,
}

ABI_DESC_TYPE_STRING_TO_INT = {
    "BYTES_E": 0, "STRING_E": 1, "IP_E": 3, "BOOL_E": 4,
    "INT32_E": 5, "UINT32_E": 6, "INT64_E": 7, "UINT64_E": 8,
    "FLOAT_E": 9, "DOUBLE_E": 10, "FIXED_E": 11, "DATA_COMBOX_E": 12,
    "DATA_FIXED_E": 11, "DATA_COMBOX": 12,
    "COMBOX": 0, "COMBOX_E": 0, "ARRAY": 1, "ARRAY_E": 1,
}

# Domain metadata used by the UI/CSV views, but not declared by the current
# CompDesc protobuf descriptor. Keep it out of the protobuf payload explicitly.
COMP_DESC_DOMAIN_ONLY_FIELDS = {
    "moduleType", "module_type", "moduleSupplier", "module_supplier",
    "moduleWeight", "module_weight", "modulePower", "module_power",
}
COMP_DESC_SHAPE_METADATA_FIELDS = {
    "key", "desc", "boolParse", "bool_parse",
}

def get_md5(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def _is_empty_proto_value(value):
    return value is None or value == "" or value == [] or value == {}


def _merge_normalized_value(existing, incoming):
    if isinstance(existing, dict) and isinstance(incoming, dict):
        merged = dict(existing)
        for key, value in incoming.items():
            if key in merged:
                merged[key] = _merge_normalized_value(merged[key], value)
            else:
                merged[key] = value
        return merged

    if _is_empty_proto_value(existing) and not _is_empty_proto_value(incoming):
        return incoming
    return existing


def proto_final_sync(data, type_mapping=COMP_DESC_TYPE_STRING_TO_INT, strict=False):
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
            "comboxParam": "combox_param",
            "arrayParam": "array_param",
            "cloneEnable": "clone_enable",
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
            if k == "type" and isinstance(v, str) and (
                v.startswith(("DATA_", "STRING_", "BOOL_", "INT", "UINT", "FLOAT_", "DOUBLE_", "FIXED_", "BYTES_", "IP_"))
                or v in type_mapping
            ):
                if v not in type_mapping:
                    if strict:
                        raise ValueError(f"Unknown protobuf enum value: {v}")
                    new_dict[k] = v
                else:
                    new_dict[k] = type_mapping[v]
            else:
                new_key = mapping.get(k, k)
                if new_key == "int_32_value":
                    new_key = "int32_value"
                elif new_key == "uint_32_value":
                    new_key = "uint32_value"
                elif new_key == "int_32_maxvalue":
                    new_key = "int32_maxvalue"
                elif new_key == "uint_32_maxvalue":
                    new_key = "uint32_maxvalue"
                elif new_key == "int_32_minvalue":
                    new_key = "int32_minvalue"
                elif new_key == "uint_32_minvalue":
                    new_key = "uint32_minvalue"
                synced_value = proto_final_sync(v, type_mapping, strict=strict)
                if new_key in new_dict:
                    new_dict[new_key] = _merge_normalized_value(new_dict[new_key], synced_value)
                else:
                    new_dict[new_key] = synced_value
        return new_dict
    elif isinstance(data, list):
        return [proto_final_sync(item, type_mapping, strict=strict) for item in data]
    return data

class ReferenceResolutionError(ValueError):
    """Raised when a project reference cannot be resolved safely."""


def resolve_with_fidelity(blueprint, project_dir, strict=False):
    project_root = Path(project_dir).resolve()

    def resolve(value, active_refs):
        if isinstance(value, dict):
            if "$ref" in value:
                raw_ref = value["$ref"]
                if not isinstance(raw_ref, str) or not raw_ref:
                    raise ReferenceResolutionError("Reference path must be a non-empty string")
                ref_path = (project_root / raw_ref).resolve()
                if project_root not in ref_path.parents:
                    raise ReferenceResolutionError(f"Reference escapes project directory: {raw_ref}")
                if not ref_path.exists():
                    if strict:
                        raise ReferenceResolutionError(f"Referenced file does not exist: {raw_ref}")
                    return {k: resolve(v, active_refs) for k, v in value.items()}
                ref_key = str(ref_path)
                if ref_key in active_refs:
                    chain = " -> ".join((*active_refs, ref_key))
                    raise ReferenceResolutionError(f"Circular reference detected: {chain}")
                with ref_path.open("r", encoding="utf-8") as file_obj:
                    referenced = json.load(file_obj)
                return resolve(referenced, (*active_refs, ref_key))
            return {k: resolve(v, active_refs) for k, v in value.items()}
        if isinstance(value, list):
            return [resolve(item, active_refs) for item in value]
        return value

    return resolve(blueprint, ())


def _field_by_json_name(message_descriptor, key):
    for field in message_descriptor.fields:
        if key in (field.name, field.json_name):
            return field
    return None


def _validate_message_dict(data, message_descriptor, path="root"):
    if not isinstance(data, dict):
        raise ValueError(f"{path} must be an object")

    for key, value in data.items():
        field = _field_by_json_name(message_descriptor, key)
        if field is None:
            raise ValueError(f"Unknown protobuf field at {path}.{key}")
        field_path = f"{path}.{key}"
        if field.message_type is not None:
            if field.is_repeated:
                if not isinstance(value, list):
                    raise ValueError(f"{field_path} must be an array")
                for index, item in enumerate(value):
                    _validate_message_dict(item, field.message_type, f"{field_path}[{index}]")
            elif value is not None:
                _validate_message_dict(value, field.message_type, field_path)
        elif field.enum_type is not None:
            if isinstance(value, str) and value not in field.enum_type.values_by_name:
                raise ValueError(f"Unknown protobuf enum at {field_path}: {value}")
            if not isinstance(value, (str, int)):
                raise ValueError(f"Invalid protobuf enum at {field_path}: {value!r}")


def _parse_message_strict(data, message_cls, label):
    message = message_cls()
    _validate_message_dict(data, message.DESCRIPTOR, label)
    ParseDict(data, message, ignore_unknown_fields=False)
    return message


def _remove_domain_only_fields(data, audit, path="root"):
    if isinstance(data, list):
        return [_remove_domain_only_fields(item, audit, f"{path}[{index}]") for index, item in enumerate(data)]
    if not isinstance(data, dict):
        return data

    cleaned = {}
    for key, value in data.items():
        if key in COMP_DESC_DOMAIN_ONLY_FIELDS and path.endswith(".general_attr"):
            audit.append(f"DOMAIN_ONLY_FIELD_EXCLUDED: {path}.{key}")
            continue
        if key in COMP_DESC_SHAPE_METADATA_FIELDS and path.endswith(".module_shape"):
            audit.append(f"SHAPE_METADATA_EXCLUDED: {path}.{key}")
            continue
        cleaned[key] = _remove_domain_only_fields(value, audit, f"{path}.{key}")
    return cleaned


ABI_COMMON_ATTR_FIELDS = {"key", "type", "combox_param", "array_param", "clone_enable"}


def _remove_abi_common_attr_metadata(data, audit, path="AbiSet"):
    if isinstance(data, list):
        return [_remove_abi_common_attr_metadata(item, audit, f"{path}[{index}]") for index, item in enumerate(data)]
    if not isinstance(data, dict):
        return data

    cleaned = {}
    is_common_attr = ".attr[" in path and path.endswith("]")
    for key, value in data.items():
        if is_common_attr and key not in ABI_COMMON_ATTR_FIELDS:
            audit.append(f"ABI_COMMON_ATTR_METADATA_EXCLUDED: {path}.{key}")
            continue
        cleaned[key] = _remove_abi_common_attr_metadata(value, audit, f"{path}.{key}")
    return cleaned


def proto_sync_abi_desc(data, type_mapping=ABI_DESC_TYPE_STRING_TO_INT):
    if isinstance(data, dict):
        mapping = {
            "childFunction": "child_function",
            "comboType": "combo_type",
            "typeGroups": "type_groups",
            "arrayCmobEle": "array_cmob_ele",
            "arrayAttr": "array_attr",
            "comboxAttr": "combox_attr",
            "comboxParam": "combox_param",
            "arrayParam": "array_param",
            "cloneEnable": "clone_enable",
            "stringValue": "string_value",
            "boolValue": "bool_value",
            "int32Value": "int32_value",
            "uint32Value": "uint32_value",
            "int64Value": "int64_value",
            "uint64Value": "uint64_value",
            "floatValue": "float_value",
            "doubleValue": "double_value",
        }
        out = {}
        for k, v in data.items():
            if k == "type" and isinstance(v, str):
                out[k] = type_mapping.get(v, v)
            else:
                out[mapping.get(k, k)] = proto_sync_abi_desc(v, type_mapping)
        return out
    if isinstance(data, list):
        return [proto_sync_abi_desc(item, type_mapping) for item in data]
    return data

def encode_cmodel(project_dir, output_cmodel_path):
    audit = []
    p_path = Path(project_dir)
    
    # 1. CompDesc.model
    with open(p_path / "blueprint_CompDesc.json", "r", encoding="utf-8") as f:
        comp_json = json.load(f)
    
    comp_json = resolve_with_fidelity(comp_json, str(p_path), strict=True)
    comp_json = proto_final_sync(comp_json, COMP_DESC_TYPE_STRING_TO_INT, strict=True)
    domain_fields = []
    comp_json = _remove_domain_only_fields(comp_json, domain_fields, "CompDesc")
    
    root_obj = _parse_message_strict(
        comp_json,
        controller_model_comp_desc_pb2.Message_Module_Info,
        "CompDesc",
    )
    
    comp_model_path = p_path / "CompDesc.model"
    with open(comp_model_path, "wb") as f:
        f.write(root_obj.SerializeToString())
    
    audit.append(f"CompDesc.model built: {len(root_obj.SerializeToString())} bytes")

    # 2. AbiSet.model
    abi_json_path = p_path / "AbiSet.json"
    if abi_json_path.exists():
        with open(abi_json_path, "r", encoding="utf-8") as f:
            abi_data = json.load(f)
        abi_data = proto_final_sync(abi_data, ABI_TYPE_STRING_TO_INT, strict=True)
        abi_data = _remove_abi_common_attr_metadata(abi_data, audit, "AbiSet")
        abi_obj = _parse_message_strict(
            abi_data,
            controller_model_abi_set_pb2.Controller_Ability,
            "AbiSet",
        )
        abi_model_path = p_path / "AbiSet.model"
        with open(abi_model_path, "wb") as f:
            f.write(abi_obj.SerializeToString())
        audit.append(f"AbiSet.model built: {len(abi_obj.SerializeToString())} bytes")
    else:
        abi_model_path = p_path / "AbiSet.model"
        with open(abi_model_path, "wb") as f: f.write(b"")

    # 3. FuncDesc.model
    func_model_path = p_path / "FuncDesc.model"
    project_func_json = p_path / "FuncDesc.json"
    res_func = _BACKEND_DIR / "resources" / "FuncDesc.model"
    if project_func_json.exists():
        with open(project_func_json, "r", encoding="utf-8") as f:
            func_data = json.load(f)
        func_data = proto_sync_abi_desc(func_data)
        func_obj = _parse_message_strict(
            func_data,
            controller_model_abi_desc_pb2.Robot_Description,
            "FuncDesc",
        )
        with open(func_model_path, "wb") as f:
            f.write(func_obj.SerializeToString())
        audit.append(f"FuncDesc.model built: {len(func_obj.SerializeToString())} bytes")
    elif func_model_path.exists():
        audit.append("FuncDesc.model preserved from project")
    elif res_func.exists():
        shutil.copy(res_func, func_model_path)
        audit.append("FuncDesc.model included")
    else:
        with open(func_model_path, "wb") as f:
            f.write(b"")
        audit.append("FuncDesc.model missing; wrote empty placeholder")

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

    return domain_fields + audit
