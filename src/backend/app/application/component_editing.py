from pathlib import Path

from app.infrastructure.projects import data_manager


def get_component(project_id: str, module_uuid: str):
    return data_manager.get_component(project_id, module_uuid)


def update_component(project_id: str, module_uuid: str, payload: dict, resources_dir: Path) -> dict:
    file_name = payload.get("file_name")
    if file_name:
        global_source = resources_dir / "modules" / file_name
        data_manager.ensure_module_in_project(project_id, file_name, global_source)

    success = data_manager.update_component(project_id, module_uuid, payload)
    return {"status": "success" if success else "error"}


def get_abilities(project_id: str):
    return data_manager.get_ability(project_id) or {}


def get_functions(project_id: str):
    return data_manager.get_function(project_id) or {}


def normalize_abilities_payload(payload: dict | list) -> dict:
    if isinstance(payload, list):
        return {"functionAbility": payload, "version": "1.0"}
    return payload


def update_abilities(project_id: str, payload: dict | list) -> dict:
    final_payload = normalize_abilities_payload(payload)
    success = data_manager.update_ability(project_id, final_payload)
    return {"status": "success" if success else "error"}
