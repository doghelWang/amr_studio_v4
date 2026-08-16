import json
import shutil
from datetime import datetime, timezone
from pathlib import Path


def create_debug_artifact_dir(project_dir: Path, stage: str) -> Path:
    timestamp = datetime.now(timezone.utc).astimezone().strftime("%Y%m%d_%H%M%S_%f")
    artifact_dir = Path(project_dir) / "debug_artifacts" / f"{stage}_{timestamp}"
    artifact_dir.mkdir(parents=True, exist_ok=True)
    return artifact_dir


def write_debug_json(artifact_dir: Path, filename: str, data) -> Path:
    target = Path(artifact_dir) / filename
    with open(target, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
    return target


def copy_debug_file(artifact_dir: Path, source: Path, filename: str | None = None) -> Path | None:
    source = Path(source)
    if not source.exists() or not source.is_file():
        return None
    target = Path(artifact_dir) / (filename or source.name)
    shutil.copy2(source, target)
    return target


def copy_debug_tree(artifact_dir: Path, source_dir: Path, dirname: str) -> Path | None:
    source_dir = Path(source_dir)
    if not source_dir.exists() or not source_dir.is_dir():
        return None
    target = Path(artifact_dir) / dirname
    shutil.copytree(source_dir, target, dirs_exist_ok=True)
    return target


def project_relative_path(project_dir: Path, artifact_dir: Path) -> str:
    return str(Path(artifact_dir).relative_to(project_dir))
