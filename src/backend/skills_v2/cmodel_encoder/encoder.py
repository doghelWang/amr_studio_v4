import os
import json
import zipfile
import re
import hashlib
import struct
import base64
import copy
from pathlib import Path
from google.protobuf.json_format import ParseDict
from skills_v2.schemas_pb import controller_model_comp_desc_pb2
from skills_v2.schemas_pb import controller_model_abi_set_pb2

# --- Module Library Template (for default-value enrichment) ---
_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent  # src/backend
_MODULE_LIB_DIR = _BACKEND_DIR / "resources" / "modules"
_tpl_cache = {}

def _load_tpl(name):
    """Load module template by moduleGroupName or moduleName, caching results."""
    if name in _tpl_cache:
        return copy.deepcopy(_tpl_cache[name]) if _tpl_cache[name] else None
    if not _MODULE_LIB_DIR.exists():
        _tpl_cache[name] = None
        return None
    # Exact match first
    path = _MODULE_LIB_DIR / f"{name}.json"
    if not path.exists():
        # Case-insensitive fallback
        for f in _MODULE_LIB_DIR.glob("*.json"):
            if f.stem.lower() == name.lower():
                path = f
                break
    if path.exists():
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            comps = data.get("moduleComponets", [])
            if comps:
                _tpl_cache[name] = comps[0]
                return copy.deepcopy(comps[0])
        except Exception:
            pass
    _tpl_cache[name] = None
    return None

TYPE_STRING_TO_INT = {
    "DATA_BYTES": 0,
    "DATA_STRING": 1,
    "DATA_IP": 3,
    "DATA_BOOL": 4,
    "DATA_INT32": 5,
    "DATA_UINT32": 6,
    "DATA_INT64": 7,
    "DATA_UINT64": 8,
    "DATA_FLOAT": 9,
    "DATA_DOUBLE": 10,
    "DATA_COMBOX": 11,
    "DATA_FIXED_E": 12,
}

def resolve_with_fidelity(blueprint, project_dir):
    if isinstance(blueprint, dict):
        if "$ref" in blueprint:
            m_path = os.path.join(project_dir, blueprint["$ref"])
            if os.path.exists(m_path):
                with open(m_path, "r", encoding="utf-8") as f:
                    return resolve_with_fidelity(json.load(f), project_dir)
        return {k: resolve_with_fidelity(v, project_dir) for k, v in blueprint.items()}
    elif isinstance(blueprint, list):
        return [resolve_with_fidelity(item, project_dir) for item in blueprint]
    return blueprint

def sanitize_values(data):
    """Sanitize values for proto oneof compatibility.
    The correct proto uses native oneof fields:
      - double_value (Tag 17), int32_value (Tag 12) etc.
      - double_maxvalue (Tag 35), double_minvalue (Tag 45) etc.
    ParseDict automatically maps camelCase JSON keys to snake_case proto fields,
    so we just need to ensure values have correct Python types.
    No rawValue12 conversion needed — that was for the old incorrect proto.
    """
    if isinstance(data, dict):
        new_data = {}
        for k, v in data.items():
            if k == 'doubleValue' and v is not None:
                new_data[k] = float(v)
            elif k == 'int32Value' and v is not None:
                new_data[k] = int(v)
            elif k == 'doubleMaxvalue' and v is not None:
                new_data[k] = float(v)
            elif k == 'doubleMinvalue' and v is not None:
                new_data[k] = float(v)
            elif k == 'int32Maxvalue' and v is not None:
                new_data[k] = int(v)
            elif k == 'int32Minvalue' and v is not None:
                new_data[k] = int(v)
            elif k == 'arrayCmobEle':
                pass  # Extraneous UI field, skip
            else:
                new_data[k] = sanitize_values(v)
        return new_data
    elif isinstance(data, list):
        return [sanitize_values(item) for item in data]
    return data

def enrich_from_templates(data):
    """[DESIGN RULE] Backend default-value enrichment.
    Walk the resolved module tree and fill missing generalAttr fields and
    interfaceAttrs from the ModuleLibrary template. This ensures the generated
    proto always contains all 13 standard fields even when the frontend only
    provides moduleName + moduleUuid.
    
    Design Contract:
      - Frontend currently provides sparse data (name, uuid, privateAttrs, mount coords)
      - Backend fills ALL other fields from library templates as defaults
      - When frontend adds new input fields later, those values will naturally
        override the defaults because they're already present in the JSON
    """
    if isinstance(data, dict):
        # If this node has moduleComponets, enrich each component
        if "moduleComponets" in data:
            for comp in data["moduleComponets"]:
                if not isinstance(comp, dict):
                    continue
                ga = comp.get("generalAttr", {})
                # Determine template name from moduleName, group name, or category pattern
                mod_name = ga.get("moduleName", {}).get("stringValue", "").strip()
                group_name = data.get("moduleGroupName", "").strip()
                main_type = ga.get("mainModuleType", {}).get("comboType", {}).get("typeKey", "")
                
                # Category-based fallback template mapping:
                # When exact module name doesn't match a template file,
                # derive from the naming pattern what -Common template to use
                _CATEGORY_FALLBACK = {
                    "chassis": "diffChassis-Common",
                    "drivewheel": "diffWheel-Common",
                    "driver": "subDriver-Common",
                    "motor": "subDriver-Common",
                    "maincpu": "mainCPU-Common",
                    "sensor": "sensor-Common",
                    "battery": "battery-Common",
                    "button": "button-Common",
                    "light": "light-Common",
                    "extendedlnterface": "IO-Common",
                }
                
                # Try loading template by various name variants
                tpl = None
                candidates = [mod_name, group_name]
                
                # Add mainModuleType-based fallback
                if main_type:
                    fallback = _CATEGORY_FALLBACK.get(main_type.lower())
                    if fallback:
                        candidates.append(fallback)
                
                # Add name-pattern-based fallback (e.g., driveWheel_1 → diffWheel-Common)
                name_lower = (mod_name or group_name).lower()
                for pattern, tpl_name in _CATEGORY_FALLBACK.items():
                    if pattern in name_lower:
                        candidates.append(tpl_name)
                        break
                # Special: if group name contains "chassis"
                if "chassis" in group_name.lower():
                    candidates.append("diffChassis-Common")
                
                for candidate in candidates:
                    if candidate:
                        tpl = _load_tpl(candidate)
                        if tpl:
                            break
                
                if tpl:
                    tpl_ga = tpl.get("generalAttr", {})
                    # Fill missing generalAttr fields with template defaults
                    for field_key, field_val in tpl_ga.items():
                        if field_key not in ga:
                            ga[field_key] = copy.deepcopy(field_val)
                    comp["generalAttr"] = ga
                    
                    # Enrich interfaceAttrs from template (D-2 fix)
                    comp_iface = comp.get("interfaceParams", {}).get("interfaceGroup", [])
                    tpl_iface = tpl.get("interfaceParams", {}).get("interfaceGroup", [])
                    tpl_by_key = {ig.get("key", ""): ig for ig in tpl_iface}
                    for iface in comp_iface:
                        ikey = iface.get("key", "")
                        if ikey in tpl_by_key:
                            tpl_match = tpl_by_key[ikey]
                            if not iface.get("interfaceAttrs") and tpl_match.get("interfaceAttrs"):
                                iface["interfaceAttrs"] = copy.deepcopy(tpl_match["interfaceAttrs"])
                            if not iface.get("interfaceParams") and tpl_match.get("interfaceParams"):
                                iface["interfaceParams"] = copy.deepcopy(tpl_match["interfaceParams"])
                    
                    # Fill interfaceAbility if missing
                    if not comp.get("interfaceAbility") and tpl.get("interfaceAbility"):
                        comp["interfaceAbility"] = copy.deepcopy(tpl["interfaceAbility"])
        
        # Recurse into sub-groups
        for key in ["moreModuleInfo"]:
            if key in data and isinstance(data[key], list):
                for sub in data[key]:
                    enrich_from_templates(sub)
    return data

def proto_final_sync(data):
    if isinstance(data, dict):
        new_dict = {}
        for k, v in data.items():
            new_key = k
            if k == "type" and isinstance(v, str) and v.startswith("DATA_"):
                new_dict[new_key] = TYPE_STRING_TO_INT.get(v, 0)
            else:
                new_dict[new_key] = proto_final_sync(v)
        return new_dict
    elif isinstance(data, list):
        return [proto_final_sync(item) for item in data]
    return data

# String fields that may contain trailing whitespace/newlines from UI or library data
_STRIP_KEYS = {"stringValue", "moduleGroupName", "moduleGroupUuid", "moduleSys", "modelVersion"}

def strip_whitespace(data):
    if isinstance(data, dict):
        new_data = {}
        for k, v in data.items():
            if k in _STRIP_KEYS and isinstance(v, str):
                new_data[k] = v.strip()
            else:
                new_data[k] = strip_whitespace(v)
        return new_data
    elif isinstance(data, list):
        return [strip_whitespace(item) for item in data]
    return data

def standardize_sys_tree(blueprint_root):
    """Ensure G_MainController is always present in the root module's moreModuleInfo."""
    more_info = blueprint_root.get("moreModuleInfo", [])
    if not isinstance(more_info, list):
        return blueprint_root

    # Pre-inject missing types
    for g in more_info:
        for comp in g.get("moduleComponets", []):
            ga = comp.get("generalAttr", {})
            name = ga.get("moduleName", {}).get("stringValue", "").lower()
            
            if "mainModuleType" not in ga:
                if "mcpu" in name or "controller" in name or "mcore" in name:
                    ga["mainModuleType"] = {"key": "main_module_type", "type": 11, "comboType": {"typeKey": "mainCPU"}, "boolParse": True}
                    ga["subSysType"] = {"key": "sub_sys_type", "type": 11, "comboType": {"typeKey": "ControlSys"}, "boolParse": True}
                elif "motor" in name or "driver" in name or "wheel" in name:
                    ga["mainModuleType"] = {"key": "main_module_type", "type": 11, "comboType": {"typeKey": "driver"}, "boolParse": True}
                    ga["subSysType"] = {"key": "sub_sys_type", "type": 11, "comboType": {"typeKey": "MotionSys"}, "boolParse": True}
                elif "bat" in name or "power" in name:
                    ga["mainModuleType"] = {"key": "main_module_type", "type": 11, "comboType": {"typeKey": "battery"}, "boolParse": True}
                    ga["subSysType"] = {"key": "sub_sys_type", "type": 11, "comboType": {"typeKey": "PowerSys"}, "boolParse": True}
                elif "sensor" in name or "laser" in name or "camera" in name or "ls" in name:
                    ga["mainModuleType"] = {"key": "main_module_type", "type": 11, "comboType": {"typeKey": "sensor"}, "boolParse": True}
                    ga["subSysType"] = {"key": "sub_sys_type", "type": 11, "comboType": {"typeKey": "SensorSys"}, "boolParse": True}
                elif "button" in name or "lamp" in name or "light" in name:
                    ga["mainModuleType"] = {"key": "main_module_type", "type": 11, "comboType": {"typeKey": "button"}, "boolParse": True}
                    ga["subSysType"] = {"key": "sub_sys_type", "type": 11, "comboType": {"typeKey": "SafetySys"}, "boolParse": True}
                elif "io" in name or "board" in name or "interface" in name:
                    ga["mainModuleType"] = {"key": "main_module_type", "type": 11, "comboType": {"typeKey": "extendedlnterface"}, "boolParse": True}
                    ga["subSysType"] = {"key": "sub_sys_type", "type": 11, "comboType": {"typeKey": "ControlSys"}, "boolParse": True}

    found_main = False
    for g in more_info:
        if g.get("moduleGroupName") == "G_MainController":
            g["moduleSys"] = "ControlSys"
            found_main = True
            
    if not found_main:
        for g in more_info:
            g_name = g.get("moduleGroupName", "").lower()
            if "mcpu" in g_name or "controller" in g_name or "main" in g_name:
                g["moduleGroupName"] = "G_MainController"
                g["moduleSys"] = "ControlSys"
                found_main = True
                break
                
    if not found_main and len(more_info) > 0:
        more_info.insert(0, {
            "moduleGroupName": "G_MainController",
            "moduleGroupUuid": "sys-001",
            "moduleSys": "ControlSys",
            "moduleComponets": []
        })
        
    blueprint_root["moreModuleInfo"] = more_info
    return blueprint_root

# --- MAIN ENCODER ---
def encode_cmodel(blueprint_path, output_cmodel_path):
    audit = []
    project_dir = os.path.dirname(blueprint_path)
    with open(blueprint_path, "r", encoding="utf-8") as f: 
        blueprint = json.load(f)
        
    full_json = resolve_with_fidelity(blueprint, project_dir)
    full_json = enrich_from_templates(full_json)  # D-1/D-2: Fill missing fields from library
    full_json = proto_final_sync(full_json)
    full_json = sanitize_values(full_json)
    full_json = strip_whitespace(full_json)
    full_json = standardize_sys_tree(full_json)

    # Decode straight to Message_Module_Info root!
    root_model = controller_model_comp_desc_pb2.Message_Module_Info()
    try:
        ParseDict(full_json, root_model, ignore_unknown_fields=True)
    except Exception as e:
        audit.append(f"ParseDict Warning: {str(e)}")

    comp_model_data = root_model.SerializeToString()
    if comp_model_data:
        audit.append(f"TOTAL CompDesc: {len(comp_model_data)} bytes, first_byte=0x{comp_model_data[0]:02x}")
    else:
        audit.append(f"TOTAL CompDesc: 0 bytes")

    # 2. AbiSet Serialization
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

