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

import xml.etree.ElementTree as ET

# --- Module Library Aggregated Specs (Source of Truth) ---
_AGG_DIR = _BACKEND_DIR.parent.parent / "specifications" / "ModuleLibrary" / "Aggregated"

# --- Type Mapping for XML Lookups ---
PROTO_TO_SPEC_MAP = {
    "chassis": "diffChassis",
    "mainCPU": "subMainCPU",
    "intergratedController": "subIntergratedController",
    "energyController": "powerController",
    "handOperator": "subHandOperator",
    "battery": "subBattery",
    "button": "subButton",
    "motor": "PMSMMotor",
    "driver": "subDriver",
    "screen": "subScreen"
}

# --- Interface Mapping ---
INTF_TO_SPEC_MAP = {
    "SERIAL": "RS232",
    "Eth": "ETH",
    "ETH": "ETH",
    "Can": "CAN",
    "CAN": "CAN"
}

class XmlTemplateRegistry:
    """[O-1] XML Template Registry: Loads aggregated specifications once on startup."""
    def __init__(self, agg_dir: Path):
        self.agg_dir = agg_dir
        self._xmls = {}
        self._load_all()
        
    def _load_all(self):
        files = {
            "private": "PrivateAttributes.xml",
            "interface": "InterfaceSpecs.xml",
            "config": "ModuleConfigs.xml",
            "board": "BoardDescriptions.xml"
        }
        for key, fname in files.items():
            path = self.agg_dir / fname
            if path.exists():
                try:
                    self._xmls[key] = ET.parse(path).getroot()
                except Exception as e:
                    print(f"Error loading {fname}: {e}")

    def get_private_attr_spec(self, module_type: str) -> ET.Element | None:
        """Find <Module type="..."> in PrivateAttributes.xml"""
        root = self._xmls.get("private")
        if root is not None:
            # Handle case-insensitive match for typeKey
            for m in root.findall("Module"):
                if m.get("type", "").lower() == module_type.lower():
                    return m
        return None

    def get_interface_spec(self, intf_type: str) -> dict:
        """Combines InterfaceFixAttrs and InterfaceParams into a unified spec dictionary.
        Returns the correct Proto format: { "interfaceParamsArray": [...] }
        """
        spec = {
            "fix_attrs": {"interfaceParamsArray": []},
            "params": {"interfaceParamsArray": []}
        }
        root = self._xml_node_to_dict_raw(self._xmls.get("interface"))
        if root:
            # Fix Attrs (Standard 2026-04-01: CR-01 Alignment)
            fix_node = root.get("InterfaceFixAttrs", {})
            for i in self._ensure_list(fix_node.get("Interface", [])):
                if i.get("type", "").lower() == intf_type.lower():
                    # The XML already has interfaceParamsArray structure from _xml_node_to_dict
                    # Because we flatten <Item> wrappers, this is now directly a list
                    items = i.get("interfaceParamsArray", [])
                    if isinstance(items, dict) and "Item" in items: items = items["Item"] # Fallback
                    spec["fix_attrs"]["interfaceParamsArray"] = self._ensure_list(items)
                    break
            
            # Params
            param_node = root.get("InterfaceParams", {})
            for i in self._ensure_list(param_node.get("Interface", [])):
                if i.get("type", "").lower() == intf_type.lower():
                    items = i.get("interfaceParamsArray", [])
                    if isinstance(items, dict) and "Item" in items: items = items["Item"] # Fallback
                    spec["params"]["interfaceParamsArray"] = self._ensure_list(items)
                    break
        return spec

    def _ensure_list(self, obj):
        if obj is None: return []
        return obj if isinstance(obj, list) else [obj]

    def _xml_node_to_dict_raw(self, node: ET.Element) -> dict:
        if node is None: return {}
        return self._xml_node_to_dict(node)

    def get_config(self, config_file: str) -> ET.Element | None:
        """Find <Config file="..."> in ModuleConfigs.xml"""
        root = self._xmls.get("config")
        if root is not None:
            return root.find(f"Config[@file='{config_file}']")
        return None

    def _xml_node_to_dict(self, node: ET.Element) -> dict:
        """Recursively convert XML node back to JSON-like dict.
        Handles: repeated tags (→ list), Group/Attribute mapping, Entry workaround.
        """
        d = {}
        # Copy XML attributes with key mapping for known structures
        for attr_name, attr_val in node.attrib.items():
            if attr_name == "_original_key":
                continue
            
            # [CR-20260401] Deep Type Sanitization: Prevent Protobuf ParseDict string violations
            final_val = attr_val
            if attr_name.startswith("bool") and isinstance(attr_val, str):
                final_val = attr_val.lower() == "true"
            elif attr_name == "doubleValue" and isinstance(attr_val, str):
                try: final_val = float(attr_val)
                except ValueError: pass
            elif attr_name in ("int32Value", "uint32Value", "int64Value", "uint64Value") and isinstance(attr_val, str):
                try: final_val = int(attr_val)
                except ValueError: pass

            # Map XML attribute names to expected JSON names
            if node.tag == "Group" and attr_name == "key":
                d["groupKey"] = final_val
            elif node.tag == "Group" and attr_name == "desc":
                d["groupName"] = final_val
            else:
                d[attr_name] = final_val
        
        # Handle Entry tags (dynamic keys workaround)
        if node.tag == "Entry":
            return {node.get("key"): node.text}
        
        # Process children, aggregating repeated tags into lists
        children_by_tag = {}
        for child in node:
            tag = child.tag
            if child.get("_original_key"):
                tag = child.get("_original_key")
            
            if tag == "Entry":
                d[child.get("key")] = child.text
                continue
            
            child_dict = self._xml_node_to_dict(child)
            children_by_tag.setdefault(tag, []).append(child_dict)
        
        # Merge into result dict
        for tag, items in children_by_tag.items():
            if len(items) == 1:
                d[tag] = items[0]
            else:
                d[tag] = items
                
        # [CR-20260401] Schema Array Alignment
        # If the XML node ONLY contained <Item> elements (no attributes, no other tags)
        # return it immediately as a List to be compatible with Protobuf `repeated` fields.
        if len(d.keys()) == 1 and "Item" in d:
            ret = d["Item"]
            return ret if isinstance(ret, list) else [ret]
        
        return d

_registry = None
def get_registry():
    global _registry
    if _registry is None:
        _registry = XmlTemplateRegistry(_AGG_DIR)
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
                # array_cmob_ele is a VALID proto field (Tag 3 in Message_Combox_Item)
                # It holds sub-attributes of dropdown options - must be preserved!
                new_data[k] = sanitize_values(v)
            else:
                new_data[k] = sanitize_values(v)
        return new_data
    elif isinstance(data, list):
        return [sanitize_values(item) for item in data]
    return data

def _build_interface_type_ref(registry, main_type):
    """[FIX 一-2] Build a {interface_type: interfaceAttrs} reference from
    all templates sharing the same mainModuleType.
    
    When a specific model template (e.g. R318BN) has empty interfaceAttrs,
    we look at sibling templates (e.g. R349AD) for valid interface patterns.
    """
    ref = {}
    if not main_type:
        return ref
    candidates = registry._by_main_type.get(main_type.lower(), [])
    for tpl in candidates:
        for iface in tpl.get("interfaceParams", {}).get("interfaceGroup", []):
            itype = iface.get("type", "")
            if itype and itype not in ref:
                attrs = iface.get("interfaceAttrs", {})
                if attrs and attrs != {}:
                    ref[itype] = attrs
    return ref

def enrich_from_templates(data):
    """[O-2] XML-Spec Driven Enrichment — 100% FIDELITY version.
    Uses Aggregated XMLs as the single source of truth for attributes and parameters.
    """
    if not isinstance(data, dict):
        return data
    
    registry = get_registry()
    
    if "moduleComponets" in data:
        for comp in data["moduleComponets"]:
            if not isinstance(comp, dict):
                continue
            ga = comp.get("generalAttr", {})
            
            # Extract lookup dimensions
            main_type = ga.get("mainModuleType", {}).get("comboType", {}).get("typeKey", "")
            sub_type = ga.get("subModuleType", {}).get("comboType", {}).get("typeKey", "")
            type_key = sub_type or main_type  # Prefer sub_type for specificity
            
            if not type_key: continue
            
            # Use mapping if key isn't found directly
            spec_key = type_key
            if registry.get_private_attr_spec(type_key) is None:
                spec_key = PROTO_TO_SPEC_MAP.get(type_key, type_key)
            
            # 1. Fetch Private Attributes Spec from XML
            module_node = registry.get_private_attr_spec(spec_key)
            if module_node is not None:
                spec_pa_root = registry._xml_node_to_dict(module_node)
                
                # [RC-CHASSIS] Ensure privateAttr structure exists
                if not comp.get("privateAttr"):
                    comp["privateAttr"] = {"privateAttrs": []}
                
                curr_pa = comp["privateAttr"]
                if "Group" in spec_pa_root:
                    spec_groups = spec_pa_root["Group"]
                    if not isinstance(spec_groups, list): spec_groups = [spec_groups]
                    
                    try:
                        curr_groups = {g.get("groupKey"): g for g in curr_pa.get("privateAttrs", [])}
                    except AttributeError:
                        curr_pa["privateAttrs"] = []
                        curr_groups = {}
                    
                    for spec_g in spec_groups:
                        g_key = spec_g.get("groupKey")
                        if g_key not in curr_groups or not curr_groups[g_key].get("arrayBaseEle"):
                            new_group = {
                                "groupKey": g_key,
                                "groupName": spec_g.get("groupName", g_key),
                                "arrayBaseEle": spec_g.get("Attribute", [])
                            }
                            if not isinstance(new_group["arrayBaseEle"], list):
                                new_group["arrayBaseEle"] = [new_group["arrayBaseEle"]]
                                
                            if g_key in curr_groups:
                                curr_groups[g_key].update(new_group)
                            else:
                                curr_pa.setdefault("privateAttrs", []).append(new_group)

            # 2. Fetch Interface Specs from XML
            comp_iface = comp.get("interfaceParams", {}).get("interfaceGroup", [])
            for iface in comp_iface:
                itype = iface.get("type", "")
                if not itype: continue
                
                spec_itype = INTF_TO_SPEC_MAP.get(itype, itype)
                intf_spec = registry.get_interface_spec(spec_itype)
                if not iface.get("interfaceAttrs") or iface["interfaceAttrs"] == {}:
                    if intf_spec["fix_attrs"]:
                        iface["interfaceAttrs"] = intf_spec["fix_attrs"]
                if not iface.get("interfaceParams") or iface["interfaceParams"] == {}:
                    if intf_spec["params"]:
                        iface["interfaceParams"] = intf_spec["params"]

            # 3. Handle subSysType Normalization (2026-04-01 Audit: CR-04/11)
            # Align with ModelSet312: InteractiveSys is the standard for Buttons/Lights
            _SUBSYS_FIX = {
                "MotionSys": "DriverSys", 
                "SafetySys": "InteractiveSys"
            }
            comp_subsys = ga.get("subSysType", {}).get("comboType", {}).get("typeKey", "")
            if comp_subsys in _SUBSYS_FIX:
                new_key = _SUBSYS_FIX[comp_subsys]
                ga["subSysType"] = {
                    "comboType": {"typeKey": new_key, "stringValue": new_key.replace("Sys", "系统")},
                    "boolNoeditable": False,
                    "boolHide": False
                }
            comp["generalAttr"] = ga

    # CR-13: Metadata alignment
    if "modelVersion" not in data:
        data["modelVersion"] = ""

    # CR-09: moduleSys Population Rule
    # "Combinatorial modules must have a value, independent modules don't care"
    children = data.get("moreModuleInfo", [])
    if children and not data.get("moduleSys"):
        # Detect from first component's subsystem
        for comp in data.get("moduleComponets", []):
            sub_sys = comp.get("generalAttr", {}).get("subSysType", {}).get("comboType", {}).get("typeKey", "")
            if sub_sys:
                data["moduleSys"] = sub_sys
                break
    elif not children:
        # Per ModelSet312 baseline: Only composite roots have moduleSys
        # We clear it for standard instances unless it's G_MainController
        if data.get("moduleGroupName", "") != "G_MainController":
            data["moduleSys"] = ""
    
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
    Rule 4 (§21): moduleSys ONLY on composite modules (those with sub-groups).
                   Single modules MUST have empty moduleSys.
                   Default composite value: "DriverSys".
    """
    original_info = blueprint_root.get("moreModuleInfo", [])
    if not isinstance(original_info, list):
        return blueprint_root

    # Flatten any previous virtual containers and keep only real groups
    real_groups = []
    SYS_NAMES = ["ControlSys", "ChassisSys", "MotionSys", "SensorSys", "SafetySys", "PowerSys", "EnergySys", "InteractiveSys", "DriverSys"]
    
    for g in original_info:
        if g.get("moduleGroupName") in SYS_NAMES and not g.get("moduleComponets"):
            # This was likely a virtual wrapper, extract its children
            real_groups.extend(g.get("moreModuleInfo", []))
        else:
            real_groups.append(g)

    # [§21] moduleSys Rule: ONLY composite modules get moduleSys.
    # A "composite module" is one that has moreModuleInfo children.
    # Single modules MUST have empty moduleSys.
    def apply_module_sys_rule(groups):
        for g in groups:
            has_children = bool(g.get("moreModuleInfo"))
            if has_children:
                # Composite module: set moduleSys = "DriverSys" (safe default per user directive)
                g["moduleSys"] = "DriverSys"
                # Recursively apply to sub-groups
                apply_module_sys_rule(g.get("moreModuleInfo", []))
            else:
                # Single module: moduleSys MUST be empty
                g["moduleSys"] = ""

    apply_module_sys_rule(real_groups)

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

