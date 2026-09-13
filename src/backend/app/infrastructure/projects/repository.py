import collections.abc
import json
import os
import shutil
import tempfile
import threading
from collections import defaultdict
from pathlib import Path


def atomic_write_json(data, target_file):
    target_file = Path(target_file)
    fd, temp_path = tempfile.mkstemp(dir=target_file.parent, prefix="._tmp_", suffix=".json")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as file:
            json.dump(data, file, ensure_ascii=False, indent=2)
        os.replace(temp_path, target_file)
    except Exception as exc:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise exc


def deep_update(d, u, path="root"):
    """Robust deep update with dual key (Snake/Camel) support for COMBOX."""
    for key, value in u.items():
        curr_path = f"{path}.{key}"

        if key in d and isinstance(d[key], list) and isinstance(value, list):
            destination_list = d[key]
            for update_item in value:
                if isinstance(update_item, dict):
                    item_key = (
                        update_item.get("key")
                        or update_item.get("type")
                        or update_item.get("interfaceUuid")
                        or update_item.get("interface_uuid")
                    )
                    if item_key:
                        match = next(
                            (
                                item
                                for item in destination_list
                                if isinstance(item, dict)
                                and (
                                    item.get("key") == item_key
                                    or item.get("type") == item_key
                                    or item.get("interfaceUuid") == item_key
                                    or item.get("interface_uuid") == item_key
                                )
                            ),
                            None,
                        )
                        if match:
                            deep_update(match, update_item, f"{curr_path}[key:{item_key}]")
                        else:
                            destination_list.append(update_item)
                    else:
                        destination_list.append(update_item)

        elif isinstance(value, collections.abc.Mapping):
            is_combox = key in ["comboType", "combo_type"]
            if is_combox:
                type_key = value.get("typeKey") or value.get("type_key")
                if type_key and ("typeGroups" not in value and "type_groups" not in value):
                    if key in d and isinstance(d[key], dict):
                        target_key = "typeKey" if "typeKey" in d[key] else "type_key"
                        if d[key].get(target_key) != type_key:
                            print(
                                f"DISK_AUDIT: [COMBOX_CHANGE] {curr_path}.{target_key}: [{d[key].get(target_key)}] -> [{type_key}]",
                                flush=True,
                            )
                            d[key][target_key] = type_key
                        continue

            existing = d.get(key)
            if not isinstance(existing, collections.abc.Mapping):
                existing = {}
                d[key] = existing
            deep_update(existing, value, curr_path)

        else:
            if d.get(key) != value:
                print(f"DISK_AUDIT: [VALUE_CHANGE] {curr_path}: [{d.get(key)}] -> [{value}]", flush=True)
                d[key] = value
    return d


def _component_uuid(component: dict) -> str | None:
    general = component.get("generalAttr") or component.get("general_attr")
    if not isinstance(general, dict):
        return None
    uuid_value = general.get("moduleUuid") or general.get("module_uuid")
    if not isinstance(uuid_value, dict):
        return None
    value = uuid_value.get("stringValue") or uuid_value.get("string_value")
    return value if isinstance(value, str) and value else None


class ProjectRepository:
    def __init__(self, base_dir: Path, resources_dir: Path):
        self.base_dir = Path(base_dir)
        self.resources_dir = Path(resources_dir)
        self.db_dir = self.base_dir / "saved_projects"
        self._file_locks = defaultdict(threading.Lock)

    def get_project_dir(self, project_id: str) -> Path:
        return self.db_dir / project_id

    def init_project(self, project_id: str, blueprint_data: dict, modules_dir_path: str, full_comp_desc: dict):
        project_dir = self.get_project_dir(project_id)
        project_dir.mkdir(parents=True, exist_ok=True)
        modules_dir = project_dir / "modules"
        modules_dir.mkdir(exist_ok=True)

        with open(project_dir / "blueprint_CompDesc.json", "w", encoding="utf-8") as file:
            json.dump(blueprint_data, file, ensure_ascii=False, indent=2)

        with open(project_dir / "CompDesc.json", "w", encoding="utf-8") as file:
            json.dump(full_comp_desc, file, ensure_ascii=False, indent=2)

        source_modules = Path(modules_dir_path)
        if source_modules.exists():
            for item in source_modules.iterdir():
                if item.is_file() and item.name.endswith(".json"):
                    shutil.copy2(item, modules_dir / item.name)

    def ensure_module_in_project(self, project_id: str, module_filename: str, fallback_source_path: Path) -> bool:
        project_dir = self.get_project_dir(project_id)
        modules_dir = project_dir / "modules"
        os.makedirs(str(modules_dir), exist_ok=True)
        target = modules_dir / module_filename
        if not target.exists() and fallback_source_path.exists():
            shutil.copy2(fallback_source_path, target)
            print(f"DISK_AUDIT: [SANDBOX_IMPORT] Copied {module_filename} to project {project_id}", flush=True)
            return True
        return target.exists()

    def _find_component_file(self, project_id: str, module_uuid: str) -> Path | None:
        modules_dir = self.get_project_dir(project_id) / "modules"
        matches = []
        for file_path in sorted(modules_dir.glob("*.json")):
            with open(file_path, "r", encoding="utf-8") as file:
                component = json.load(file)
            if _component_uuid(component) == module_uuid:
                matches.append(file_path)
        if len(matches) > 1:
            raise ValueError(f"Duplicate module UUID in project {project_id}: {module_uuid}")
        return matches[0] if matches else None

    def update_component(self, project_id: str, module_uuid: str, payload_delta: dict) -> bool:
        target_file = self._find_component_file(project_id, module_uuid)
        if not target_file:
            return False
        with self._file_locks[str(target_file)]:
            with open(target_file, "r", encoding="utf-8") as file:
                data = json.load(file)
            print(f"DISK_AUDIT: >>> Updating component {module_uuid} <<<", flush=True)
            deep_update(data, payload_delta)
            atomic_write_json(data, target_file)
        return True

    def update_ability(self, project_id: str, payload_delta: dict) -> bool:
        file_path = self.get_project_dir(project_id) / "AbiSet.json"
        if not file_path.exists():
            baseline = self.resources_dir / "AbiSet_base.json"
            if baseline.exists():
                shutil.copy2(baseline, file_path)
            else:
                with open(file_path, "w", encoding="utf-8") as file:
                    json.dump({"version": "V1.0"}, file)

        with self._file_locks[str(file_path)]:
            with open(file_path, "r", encoding="utf-8") as file:
                data = json.load(file)
            print("DISK_AUDIT: >>> Updating AbilitySet <<<", flush=True)
            deep_update(data, payload_delta)
            atomic_write_json(data, file_path)
        return True

    def update_function(self, project_id: str, payload_delta: dict) -> bool:
        file_path = self.get_project_dir(project_id) / "FuncDesc.json"
        if not file_path.exists():
            with open(file_path, "w", encoding="utf-8") as file:
                json.dump({"version": "V1.0", "function": []}, file)

        with self._file_locks[str(file_path)]:
            with open(file_path, "r", encoding="utf-8") as file:
                data = json.load(file)
            print("DISK_AUDIT: >>> Updating FuncDesc <<<", flush=True)
            deep_update(data, payload_delta)
            atomic_write_json(data, file_path)
        return True

    def get_component(self, project_id: str, module_uuid: str):
        file_path = self._find_component_file(project_id, module_uuid)
        if file_path:
            with open(file_path, "r", encoding="utf-8") as file:
                return json.load(file)
        return None

    def get_ability(self, project_id: str):
        file_path = self.get_project_dir(project_id) / "AbiSet.json"
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as file:
                return json.load(file)
        return None

    def get_function(self, project_id: str):
        file_path = self.get_project_dir(project_id) / "FuncDesc.json"
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as file:
                return json.load(file)
        return None
