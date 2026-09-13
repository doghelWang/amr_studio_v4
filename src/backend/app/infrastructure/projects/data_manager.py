from pathlib import Path

from .repository import ProjectRepository, atomic_write_json, deep_update


BASE_DIR = Path(__file__).resolve().parents[3]
DB_DIR = BASE_DIR / "saved_projects"
_repository = ProjectRepository(BASE_DIR, BASE_DIR / "resources")


def _sync_repository_db_dir() -> None:
    global _repository
    if _repository.db_dir != DB_DIR:
        _repository = ProjectRepository(BASE_DIR, BASE_DIR / "resources")
        _repository.db_dir = DB_DIR


def get_project_dir(project_id: str) -> Path:
    _sync_repository_db_dir()
    return _repository.get_project_dir(project_id)


def init_project(project_id: str, blueprint_data: dict, modules_dir_path: str, full_comp_desc: dict):
    _sync_repository_db_dir()
    return _repository.init_project(project_id, blueprint_data, modules_dir_path, full_comp_desc)


def ensure_module_in_project(project_id: str, module_filename: str, fallback_source_path: Path) -> bool:
    _sync_repository_db_dir()
    return _repository.ensure_module_in_project(project_id, module_filename, fallback_source_path)


def update_component(project_id: str, module_uuid: str, payload_delta: dict) -> bool:
    _sync_repository_db_dir()
    return _repository.update_component(project_id, module_uuid, payload_delta)


def update_ability(project_id: str, payload_delta: dict) -> bool:
    _sync_repository_db_dir()
    return _repository.update_ability(project_id, payload_delta)


def update_function(project_id: str, payload_delta: dict) -> bool:
    _sync_repository_db_dir()
    return _repository.update_function(project_id, payload_delta)


def get_component(project_id: str, module_uuid: str):
    _sync_repository_db_dir()
    return _repository.get_component(project_id, module_uuid)


def get_ability(project_id: str):
    _sync_repository_db_dir()
    return _repository.get_ability(project_id)


def get_function(project_id: str):
    _sync_repository_db_dir()
    return _repository.get_function(project_id)
