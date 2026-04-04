import os
import json
import shutil
import tempfile
import threading
import collections.abc
from collections import defaultdict
from pathlib import Path

_file_locks = defaultdict(threading.Lock)

def atomic_write_json(data, target_file):
    target_file = Path(target_file)
    fd, temp_path = tempfile.mkstemp(dir=target_file.parent, prefix="._tmp_", suffix=".json")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.replace(temp_path, target_file)
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise e
BASE_DIR = Path(__file__).parent.parent
DB_DIR = BASE_DIR / "saved_projects"

def get_project_dir(project_id: str) -> Path:
    return DB_DIR / project_id

def init_project(project_id: str, blueprint_data: dict, modules_dir_path: str, full_comp_desc: dict):
    p_dir = get_project_dir(project_id)
    p_dir.mkdir(parents=True, exist_ok=True)
    m_dir = p_dir / "modules"
    m_dir.mkdir(exist_ok=True)
    
    # Save Blueprint
    with open(p_dir / "blueprint_CompDesc.json", "w", encoding="utf-8") as f:
        json.dump(blueprint_data, f, ensure_ascii=False, indent=2)
    
    # Save Full Enriched JSON (for CSV generation and reference)
    with open(p_dir / "CompDesc.json", "w", encoding="utf-8") as f:
        json.dump(full_comp_desc, f, ensure_ascii=False, indent=2)

    src_modules = Path(modules_dir_path)
    if src_modules.exists():
        for item in src_modules.iterdir():
            if item.is_file() and item.name.endswith(".json"):
                shutil.copy2(item, m_dir / item.name)
    


def deep_update(d, u, path="root"):
    """Robust deep update with dual key (Snake/Camel) support for COMBOX"""
    for k, v in u.items():
        curr_path = f"{path}.{k}"
        
        # 1. Handle List merging (AttributeGroups, elements, interface_group)
        if k in d and isinstance(d[k], list) and isinstance(v, list):
            d_list = d[k]
            for u_item in v:
                if isinstance(u_item, dict):
                    # Keyed search: supports key, type, interfaceUuid, stringValue etc.
                    ukey = u_item.get("key") or u_item.get("type") or u_item.get("interfaceUuid") or u_item.get("interface_uuid")
                    if ukey:
                        match = next((item for item in d_list if isinstance(item, dict) and (item.get("key") == ukey or item.get("type") == ukey or item.get("interfaceUuid") == ukey or item.get("interface_uuid") == ukey)), None)
                        if match:
                            deep_update(match, u_item, f"{curr_path}[key:{ukey}]")
                        else:
                            d_list.append(u_item)
                    else:
                        d_list.append(u_item)
        
        # 2. Handle Dictionary (Branch) merging
        elif isinstance(v, collections.abc.Mapping):
            # ━━━ CRITICAL FIX: DUAL KEY COMBOX PROTECTION ━━━
            is_combox = k in ["comboType", "combo_type"]
            if is_combox:
                t_key = v.get("typeKey") or v.get("type_key")
                if t_key and ("typeGroups" not in v and "type_groups" not in v):
                    # Only updating selection
                    if k in d and isinstance(d[k], dict):
                        target_key = "typeKey" if "typeKey" in d[k] else "type_key"
                        if d[k].get(target_key) != t_key:
                            print(f"DISK_AUDIT: [COMBOX_CHANGE] {curr_path}.{target_key}: [{d[k].get(target_key)}] -> [{t_key}]", flush=True)
                            d[k][target_key] = t_key
                        continue
            
            # Normal recursion
            deep_update(d.get(k, {}), v, curr_path)
            
        # 3. Handle Leaf values
        else:
            if d.get(k) != v:
                print(f"DISK_AUDIT: [VALUE_CHANGE] {curr_path}: [{d.get(k)}] -> [{v}]", flush=True)
                d[k] = v
    return d

def ensure_module_in_project(project_id: str, module_filename: str, fallback_source_path: Path) -> bool:
    """Ensures a module file exists in the project sandbox."""
    p_dir = get_project_dir(project_id)
    m_dir = p_dir / "modules"
    os.makedirs(str(m_dir), exist_ok=True)
    target = m_dir / module_filename
    if not target.exists():
        if fallback_source_path.exists():
            shutil.copy2(fallback_source_path, target)
            print(f"DISK_AUDIT: [SANDBOX_IMPORT] Copied {module_filename} to project {project_id}", flush=True)
            return True
    return target.exists()

def update_component(project_id: str, module_uuid: str, payload_delta: dict) -> bool:
    m_dir = get_project_dir(project_id) / "modules"
    target_file = next(m_dir.glob(f"*{module_uuid}*.json"), None)
    if not target_file: return False
    with _file_locks[str(target_file)]:
        with open(target_file, "r", encoding="utf-8") as file:
            data = json.load(file)
        print(f"DISK_AUDIT: >>> Updating component {module_uuid} <<<", flush=True)
        deep_update(data, payload_delta)
        atomic_write_json(data, target_file)
    return True

def update_ability(project_id: str, payload_delta: dict) -> bool:
    fpath = get_project_dir(project_id) / "AbiSet.json"
    if not fpath.exists():
        # [O-7] Create from baseline if missing during update
        baseline = BASE_DIR / "resources" / "AbiSet_base.json"
        if baseline.exists():
            shutil.copy2(baseline, fpath)
        else:
            with open(fpath, "w", encoding="utf-8") as f: json.dump({"version": "V1.0"}, f)
            
    with _file_locks[str(fpath)]:
        with open(fpath, "r", encoding="utf-8") as file:
            data = json.load(file)
        print(f"DISK_AUDIT: >>> Updating AbilitySet <<<", flush=True)
        deep_update(data, payload_delta)
        atomic_write_json(data, fpath)
    return True

def update_function(project_id: str, payload_delta: dict) -> bool:
    """[O-9] Manage FuncDesc.json independently."""
    fpath = get_project_dir(project_id) / "FuncDesc.json"
    if not fpath.exists():
        with open(fpath, "w", encoding="utf-8") as f: json.dump({"version": "V1.0", "function": []}, f)
            
    with _file_locks[str(fpath)]:
        with open(fpath, "r", encoding="utf-8") as file:
            data = json.load(file)
        print(f"DISK_AUDIT: >>> Updating FuncDesc <<<", flush=True)
        deep_update(data, payload_delta)
        atomic_write_json(data, fpath)
    return True

def get_component(project_id: str, module_uuid: str):
    m_dir = get_project_dir(project_id) / "modules"
    for f in m_dir.glob(f"*{module_uuid}*.json"):
        with open(f, "r", encoding="utf-8") as file: return json.load(file)
    return None

def get_ability(project_id: str):
    fpath = get_project_dir(project_id) / "AbiSet.json"
    if fpath.exists():
        with open(fpath, "r", encoding="utf-8") as file: return json.load(file)
    return None

def get_function(project_id: str):
    """[O-9] Retrieve FuncDesc.json."""
    fpath = get_project_dir(project_id) / "FuncDesc.json"
    if fpath.exists():
        with open(fpath, "r", encoding="utf-8") as file: return json.load(file)
    return None
