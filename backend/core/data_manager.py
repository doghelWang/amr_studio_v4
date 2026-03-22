import os
import json
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DB_DIR = BASE_DIR / "saved_projects"

def get_project_dir(project_id: str) -> Path:
    return DB_DIR / project_id

def init_project(project_id: str, blueprint_data: dict, modules_dir_path: str, artifacts_dir: Path):
    """
    Physically persist project data to the database directory.
    - project_id: Unique ID
    - blueprint_data: Blueprint JSON object
    - modules_dir_path: Source path of split modules
    - artifacts_dir: Directory containing AbiSet.json, original .models, etc.
    """
    p_dir = get_project_dir(project_id)
    p_dir.mkdir(parents=True, exist_ok=True)
    m_dir = p_dir / "modules"
    m_dir.mkdir(exist_ok=True)
    
    # 1. Save blueprint
    with open(p_dir / "blueprint_CompDesc.json", "w", encoding="utf-8") as f:
        json.dump(blueprint_data, f, ensure_ascii=False, indent=2)
        
    # 2. Copy all split module files (Physical migration)
    src_modules = Path(modules_dir_path)
    if src_modules.exists():
        for item in src_modules.iterdir():
            if item.is_file() and item.name.endswith(".json"):
                shutil.copy2(item, m_dir / item.name)
                
    # 3. Copy other artifacts (AbiSet.json, FuncDesc.json, .model files)
    print(f"DataManager: Copying artifacts from {artifacts_dir} to {p_dir}")
    if artifacts_dir.exists():
        for item in artifacts_dir.iterdir():
            if item.is_file() and (item.suffix in [".json", ".model"]):
                if item.name != "CompDesc.json":
                    print(f"DataManager: Copying {item.name}")
                    shutil.copy2(item, p_dir / item.name)
            else:
                print(f"DataManager: Skipping non-file/unmatched artifact: {item.name}")
    else:
        print(f"DataManager: Artifacts directory {artifacts_dir} DOES NOT EXIST")

def get_component(project_id: str, module_uuid: str) -> dict:
    m_dir = get_project_dir(project_id) / "modules"
    if not m_dir.exists():
        return None
    # Use exact match or glob with UUID
    for f in m_dir.glob(f"*{module_uuid}*.json"):
        with open(f, "r", encoding="utf-8") as file:
            return json.load(file)
    return None

def update_component(project_id: str, module_uuid: str, payload_delta: dict) -> bool:
    m_dir = get_project_dir(project_id) / "modules"
    if not m_dir.exists():
        return False
        
    target_file = None
    for f in m_dir.glob(f"*{module_uuid}*.json"):
        target_file = f
        break
            
    if not target_file:
        return False
        
    with open(target_file, "r", encoding="utf-8") as file:
        data = json.load(file)
        
    def deep_update(d, u):
        import collections.abc
        for k, v in u.items():
            if isinstance(v, collections.abc.Mapping):
                d[k] = deep_update(d.get(k, {}), v)
            else:
                d[k] = v
        return d
        
    deep_update(data, payload_delta)
    
    with open(target_file, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
    return True

def get_blueprint(project_id: str) -> dict:
    fpath = get_project_dir(project_id) / "blueprint_CompDesc.json"
    if not fpath.exists():
        return None
    with open(fpath, "r", encoding="utf-8") as file:
        return json.load(file)

def get_ability(project_id: str) -> dict:
    fpath = get_project_dir(project_id) / "AbiSet.json"
    if not fpath.exists():
        return None
    with open(fpath, "r", encoding="utf-8") as file:
        return json.load(f)

def update_ability(project_id: str, payload_delta: dict) -> bool:
    fpath = get_project_dir(project_id) / "AbiSet.json"
    if not fpath.exists():
        return False
    with open(fpath, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    def deep_update(d, u):
        import collections.abc
        for k, v in u.items():
            if isinstance(v, collections.abc.Mapping):
                d[k] = deep_update(d.get(k, {}), v)
            else:
                d[k] = v
        return d
        
    deep_update(data, payload_delta)
    with open(fpath, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
    return True
