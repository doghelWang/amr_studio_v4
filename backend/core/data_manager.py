import os
import json
import shutil
import collections.abc
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DB_DIR = BASE_DIR / "saved_projects"

def get_project_dir(project_id: str) -> Path:
    return DB_DIR / project_id

def init_project(project_id: str, blueprint_data: dict, modules_dir_path: str, artifacts_dir: Path):
    p_dir = get_project_dir(project_id)
    p_dir.mkdir(parents=True, exist_ok=True)
    m_dir = p_dir / "modules"
    m_dir.mkdir(exist_ok=True)
    with open(p_dir / "blueprint_CompDesc.json", "w", encoding="utf-8") as f:
        json.dump(blueprint_data, f, ensure_ascii=False, indent=2)
    src_modules = Path(modules_dir_path)
    if src_modules.exists():
        for item in src_modules.iterdir():
            if item.is_file() and item.name.endswith(".json"):
                shutil.copy2(item, m_dir / item.name)
    if artifacts_dir.exists():
        for item in artifacts_dir.iterdir():
            if item.is_file() and (item.suffix in [".json", ".model"]):
                if item.name == "CompDesc.json":
                    shutil.copy2(item, p_dir / "CompDesc.json.bak")
                else:
                    shutil.copy2(item, p_dir / item.name)

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

def update_component(project_id: str, module_uuid: str, payload_delta: dict) -> bool:
    m_dir = get_project_dir(project_id) / "modules"
    target_file = next(m_dir.glob(f"*{module_uuid}*.json"), None)
    if not target_file: return False
    with open(target_file, "r", encoding="utf-8") as file:
        data = json.load(file)
    print(f"DISK_AUDIT: >>> Updating component {module_uuid} <<<", flush=True)
    deep_update(data, payload_delta)
    with open(target_file, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
    return True

def update_ability(project_id: str, payload_delta: dict) -> bool:
    fpath = get_project_dir(project_id) / "AbiSet.json"
    if not fpath.exists(): return False
    with open(fpath, "r", encoding="utf-8") as file:
        data = json.load(file)
    print(f"DISK_AUDIT: >>> Updating AbilitySet <<<", flush=True)
    deep_update(data, payload_delta)
    with open(fpath, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
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
