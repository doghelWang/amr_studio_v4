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

class TemplateRegistry:
    """[O-1] Template Registry: Scans module library and builds indexes to eliminate hardcoding."""
    def __init__(self, modules_dir: Path):
        self._by_name = {}      # Filename mapping
        self._by_main_type = {} # mainModuleType index
        self._by_sub_type = {}  # subModuleType index
        self._scan(modules_dir)
    
    def _scan(self, modules_dir: Path):
        if not modules_dir.exists():
            return
        for json_file in modules_dir.glob("*.json"):
            try:
                with open(json_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                comps = data.get("moduleComponets", [])
                if not comps: continue
                tpl = comps[0]
                ga = tpl.get("generalAttr", {})
                self._by_name[json_file.stem] = tpl
                
                # Index by mainModuleType
                m_type = ga.get("mainModuleType", {}).get("comboType", {}).get("typeKey", "")
                if m_type:
                    self._by_main_type.setdefault(m_type.lower(), []).append(tpl)
                
                # Index by subModuleType (more precise)
                s_type = ga.get("subModuleType", {}).get("comboType", {}).get("typeKey", "")
                if s_type:
                    self._by_sub_type[s_type.lower()] = tpl
            except Exception:
                continue

    def find(self, mod_name: str = "", group_name: str = "", 
             main_type: str = "", sub_type: str = "") -> dict | None:
        """Multi-strategy lookup: Exact Name > SubType > MainType"""
        for name in [mod_name, group_name]:
            if name and name in self._by_name:
                return copy.deepcopy(self._by_name[name])
        
        if sub_type and sub_type.lower() in self._by_sub_type:
            return copy.deepcopy(self._by_sub_type[sub_type.lower()])
            
        if main_type and main_type.lower() in self._by_main_type:
            candidates = self._by_main_type[main_type.lower()]
            # Prefer templates with "Common" in name
            for c in candidates:
                c_name = c.get("generalAttr", {}).get("moduleName", {}).get("stringValue", "")
                if "Common" in c_name: return copy.deepcopy(c)
            return copy.deepcopy(candidates[0])
        return None

_registry = None
def get_registry():
    global _registry
    if _registry is None:
        _registry = TemplateRegistry(_MODULE_LIB_DIR)
    return _registry

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
    """[O-2] Generic Template Enrichment — ZERO HARDCODING version.
    Eliminates _CATEGORY_FALLBACK by using the TemplateRegistry.
    """
    if not isinstance(data, dict):
        return data
    
    registry = get_registry()
    
    if "moduleComponets" in data:
        for comp in data["moduleComponets"]:
            if not isinstance(comp, dict):
                continue
            ga = comp.get("generalAttr", {})
            
            # Extract lookup dimensions (No guessing!)
            mod_name = ga.get("moduleName", {}).get("stringValue", "").strip()
            group_name = data.get("moduleGroupName", "").strip()
            main_type = ga.get("mainModuleType", {}).get("comboType", {}).get("typeKey", "")
            sub_type = ga.get("subModuleType", {}).get("comboType", {}).get("typeKey", "")
            
            # Use registry for multi-strategy find
            tpl = registry.find(
                mod_name=mod_name, group_name=group_name,
                main_type=main_type, sub_type=sub_type
            )
            
            if tpl:
                # Fill missing generalAttr fields (Template values as fallback)
                tpl_ga = tpl.get("generalAttr", {})
                for field_key, field_val in tpl_ga.items():
                    if field_key not in ga:
                        ga[field_key] = copy.deepcopy(field_val)
                comp["generalAttr"] = ga
                
                # Enrich interfaceAttrs from template
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
    for sub in data.get("moreModuleInfo", []):
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
    """[ARCH REFACTOR] Aligns with standard binary structure.
    Rule 1: The Root Message_Module_Info must be anonymous (no Name/UUID).
    Rule 2: Components/Groups are placed directly into Root's moreModuleInfo.
    Rule 3: No virtual container nodes (No invented 'ControlSys' wrappers).
    """
    original_info = blueprint_root.get("moreModuleInfo", [])
    if not isinstance(original_info, list):
        return blueprint_root

    # Flatten any previous virtual containers and keep only real groups
    real_groups = []
    SYS_NAMES = ["ControlSys", "ChassisSys", "MotionSys", "SensorSys", "SafetySys", "PowerSys"]
    
    for g in original_info:
        if g.get("moduleGroupName") in SYS_NAMES and not g.get("moduleComponets"):
            # This was likely a virtual wrapper, extract its children
            real_groups.extend(g.get("moreModuleInfo", []))
        else:
            real_groups.append(g)

    # Sync moduleSys (Tag 3) from component subSysType for each group
    for g in real_groups:
        for comp in g.get("moduleComponets", []):
            ga = comp.get("generalAttr", {})
            st = ga.get("subSysType", {}).get("comboType", {}).get("typeKey", "")
            if st:
                g["moduleSys"] = st # Tag 3: Now maps to component's SubSystem type
                break

    # Final Construction: Clear Root fields to match 'Naked' standard
    blueprint_root["moduleGroupName"] = ""
    blueprint_root["moduleGroupUuid"] = ""
    blueprint_root["moduleSys"] = ""
    blueprint_root["moreModuleInfo"] = real_groups
    
    return blueprint_root

def enrich_abiset_from_baseline(abi_data: dict) -> dict:
    """[O-7] AbiSet Baseline Enrichment — Follows §15 Backend Default-Value Spec.
    Ensures missing functionAbility and componentAbility are filled from resources/AbiSet_base.json.
    """
    baseline_path = _BACKEND_DIR / "resources" / "AbiSet_base.json"
    if not baseline_path.exists():
        return abi_data
    
    try:
        with open(baseline_path, "r", encoding="utf-8") as f:
            baseline = json.load(f)
    except Exception:
        return abi_data
        
    # Version: Frontend prioritized
    if "version" not in abi_data:
        abi_data["version"] = baseline.get("version", "V1.0")
    
    # componentAbility: Fill if empty (frontend currently doesn't provide this)
    if not abi_data.get("componentAbility"):
        abi_data["componentAbility"] = baseline.get("componentAbility", [])
    
    # functionAbility: Merge by type
    existing_types = {fa.get("type") for fa in abi_data.get("functionAbility", []) if fa.get("type")}
    for base_fa in baseline.get("functionAbility", []):
        if base_fa.get("type") not in existing_types:
            abi_data.setdefault("functionAbility", []).append(base_fa)
            
    return abi_data

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
    abi_obj = controller_model_abi_set_pb2.Controller_Ability()
    
    if os.path.exists(abi_json_path):
        try:
            with open(abi_json_path, "r", encoding="utf-8") as f:
                abi_data = json.load(f)
            
            # [O-6/O-7] Unified pipeline for AbiSet
            abi_data = enrich_abiset_from_baseline(abi_data)
            abi_data = proto_final_sync(abi_data)
            abi_data = sanitize_values(abi_data)
            abi_data = strip_whitespace(abi_data)
            
            ParseDict(abi_data, abi_obj, ignore_unknown_fields=True)
            abi_model_data = abi_obj.SerializeToString()
            audit.append(f"TOTAL AbiSet: {len(abi_model_data)} bytes")
        except Exception as e:
            audit.append(f"AbiSet Error: {str(e)}")
    else:
        # Fallback to pure baseline if AbiSet.json missing
        abi_data = enrich_abiset_from_baseline({})
        abi_data = proto_final_sync(abi_data)
        abi_data = sanitize_values(abi_data)
        ParseDict(abi_data, abi_obj, ignore_unknown_fields=True)
        abi_model_data = abi_obj.SerializeToString()
        audit.append(f"TOTAL AbiSet (Baseline-only): {len(abi_model_data)} bytes")

    # 3. FuncDesc Serialization
    func_model_data = b""
    func_json_path = os.path.join(project_dir, "FuncDesc.json")
    baseline_func_path = _BACKEND_DIR / "resources" / "FuncDesc_base.model"
    
    if os.path.exists(func_json_path):
        try:
            with open(func_json_path, "r", encoding="utf-8") as f:
                func_data = json.load(f)
            
            # [O-9] Dynamic FuncDesc encoding pipeline
            func_data = proto_final_sync(func_data)
            func_data = sanitize_values(func_data)
            func_data = strip_whitespace(func_data)
            
            from skills_v2.schemas_pb import controller_model_abi_desc_pb2
            func_obj = controller_model_abi_desc_pb2.Controller_Abi_Set()
            ParseDict(func_data, func_obj, ignore_unknown_fields=True)
            func_model_data = func_obj.SerializeToString()
            audit.append(f"TOTAL FuncDesc: {len(func_model_data)} bytes")
        except Exception as e:
            audit.append(f"FuncDesc Error: {str(e)}")
    
    if not func_model_data and baseline_func_path.exists():
        with open(baseline_func_path, "rb") as f:
            func_model_data = f.read()
        audit.append(f"TOTAL FuncDesc (Baseline): {len(func_model_data)} bytes")

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

