import json
import os
import tempfile
from pathlib import Path

from fastapi import HTTPException

from app.services.debug_artifacts import (
    copy_debug_tree,
    create_debug_artifact_dir,
    project_relative_path,
    write_debug_json,
)
from core import data_manager
from core.cmodel_export_adapter import collect_export_diagnostics, export_abilities, frontend_to_comp_desc
from skills_v2.model_splitter.splitter import split_comp_desc


def _strip_ui_wrappers(node):
    if isinstance(node, dict):
        if "moreModuleInfo" in node:
            new_subs = []
            for sub in node["moreModuleInfo"]:
                if sub.get("moduleGroupName") == "LibraryGroup":
                    new_subs.extend(_strip_ui_wrappers(sub).get("moreModuleInfo", []))
                else:
                    new_subs.append(_strip_ui_wrappers(sub))
            node["moreModuleInfo"] = new_subs
        return {key: _strip_ui_wrappers(value) for key, value in node.items()}
    if isinstance(node, list):
        return [_strip_ui_wrappers(item) for item in node]
    return node


def initialize_project_sandbox(project_id: str, config: dict) -> dict:
    if not project_id or not config:
        raise HTTPException(status_code=400, detail="Missing projectId or config")

    diagnostics = collect_export_diagnostics(config)
    full_json = frontend_to_comp_desc(config)
    sanitized_json = _strip_ui_wrappers(full_json)

    debug_artifact_dir = None
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        full_json_path = tmp_path / "CompDesc.json"
        with open(full_json_path, "w", encoding="utf-8") as file:
            json.dump(sanitized_json, file, ensure_ascii=False, indent=2)

        split_out = tmp_path / "split"
        split_out.mkdir()
        split_comp_desc(str(full_json_path), str(split_out))

        blueprint_path = split_out / "blueprint_CompDesc.json"
        with open(blueprint_path, "r", encoding="utf-8") as file:
            blueprint = json.load(file)

        data_manager.init_project(project_id, blueprint, str(split_out / "modules"), sanitized_json)
        project_dir = data_manager.get_project_dir(project_id)
        debug_artifact_dir = create_debug_artifact_dir(project_dir, "init")
        write_debug_json(debug_artifact_dir, "01_frontend_config.json", config)
        write_debug_json(debug_artifact_dir, "02_frontend_diagnostics.json", diagnostics)
        write_debug_json(debug_artifact_dir, "03_generated_full_CompDesc.json", full_json)
        write_debug_json(debug_artifact_dir, "04_sanitized_CompDesc.json", sanitized_json)
        copy_debug_tree(debug_artifact_dir, split_out, "05_split_output")

        if config.get("abilities"):
            abi_path = data_manager.get_project_dir(project_id) / "AbiSet.json"
            abi_data = export_abilities(config["abilities"])
            with open(abi_path, "w", encoding="utf-8") as file:
                json.dump(abi_data, file, ensure_ascii=False, indent=2)
            write_debug_json(debug_artifact_dir, "06_exported_AbiSet.json", abi_data)

    response = {"status": "success", "project_id": project_id, "diagnostics": diagnostics}
    if debug_artifact_dir is not None:
        response["debug_artifacts_path"] = project_relative_path(data_manager.get_project_dir(project_id), debug_artifact_dir)
        response["debug_artifacts_url"] = f"/downloads/{project_id}/{response['debug_artifacts_path']}"
    return response


def list_saved_projects(user_saves_dir: Path) -> list[dict]:
    projects = []
    for file_path in user_saves_dir.glob("*.json"):
        projects.append({"name": file_path.stem, "mtime": os.path.getmtime(file_path)})
    projects.sort(key=lambda item: item["mtime"], reverse=True)
    return projects


def save_user_project_config(user_saves_dir: Path, name: str, config: dict) -> dict:
    if not name or not config:
        raise HTTPException(status_code=400)

    target_path = user_saves_dir / f"{name}.json"
    with open(target_path, "w", encoding="utf-8") as file:
        json.dump(config, file, ensure_ascii=False, indent=2)
    return {"status": "success"}


def load_user_project_config(user_saves_dir: Path, name: str) -> dict:
    file_path = user_saves_dir / f"{name}.json"
    if not file_path.exists():
        raise HTTPException(status_code=404)
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)
