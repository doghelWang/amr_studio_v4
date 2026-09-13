from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path


@dataclass(frozen=True)
class BackendConfig:
    base_dir: Path
    project_root: Path
    saved_projects_dir: Path
    user_saves_dir: Path
    module_library_root: Path
    backend_version: str
    build_date: str
    commit_hash: str
    service_start_time: datetime


def load_backend_config() -> BackendConfig:
    base_dir = Path(__file__).resolve().parent.parent
    project_root = base_dir.parent.parent
    saved_projects_dir = project_root / "src" / "backend" / "saved_projects"
    user_saves_dir = project_root / "src" / "backend" / "user_saves"
    module_library_root = project_root / "specifications" / "ModuleLibrary"
    if not module_library_root.exists():
        module_library_root = base_dir / "resources"

    saved_projects_dir.mkdir(parents=True, exist_ok=True)
    user_saves_dir.mkdir(parents=True, exist_ok=True)

    return BackendConfig(
        base_dir=base_dir,
        project_root=project_root,
        saved_projects_dir=saved_projects_dir,
        user_saves_dir=user_saves_dir,
        module_library_root=module_library_root,
        backend_version="1.0.1",
        build_date="2026-04-04",
        commit_hash="f664e948",
        service_start_time=datetime.now(timezone(timedelta(hours=8))),
    )
