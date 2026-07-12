import json
from pathlib import Path

from core.xml_component_adapter import xml_to_component_json


def list_boards(module_library_root: Path) -> list[dict]:
    boards = []
    host_dir = module_library_root / "board_desc" / "host"
    if host_dir.exists():
        for file_path in host_dir.glob("*.json"):
            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    data = json.load(file)
                board_id = list(data.keys())[0]
                info = data[board_id].get("基本信息", {})
                boards.append(
                    {
                        "id": board_id,
                        "name": info.get("name", board_id),
                        "desc": info.get("desc", ""),
                        "board_type": info.get("board_type", []),
                    }
                )
            except Exception:
                continue
    return boards


def list_schemas(resources_dir: Path) -> dict:
    entities = {}
    flat_path = resources_dir / "modules"
    all_files = list(flat_path.glob("*"))
    base_map = {}

    for file_path in all_files:
        if file_path.suffix not in [".json", ".xml"]:
            continue
        stem = file_path.stem
        if stem not in base_map:
            base_map[stem] = {"json": None, "xml": None}
        base_map[stem][file_path.suffix[1:]] = file_path

    for stem, formats in base_map.items():
        try:
            data_json = None
            data_xml = None
            if formats["json"]:
                with open(formats["json"], "r", encoding="utf-8") as file:
                    data_json = json.load(file)
            if formats["xml"]:
                data_xml = xml_to_component_json(str(formats["xml"]))

            primary = data_xml or data_json
            sys_name = "Other"
            try:
                component = (primary.get("module_componets") or primary.get("moduleComponets") or [])[0]
                sys_name = component.get("generalAttr", {}).get("subSysType", {}).get("comboType", {}).get("typeKey") or "Other"
            except Exception:
                pass

            if sys_name not in entities:
                entities[sys_name] = []
            entities[sys_name].append(
                {
                    "module_id": stem,
                    "moduleGroupName": primary.get("moduleGroupName", stem),
                    "system": sys_name,
                    "data_json": data_json,
                    "data_xml": data_xml,
                    "file_name": formats["xml"].name if formats["xml"] else formats["json"].name,
                }
            )
        except Exception:
            continue

    return entities
