import csv
import json
from pathlib import Path

from app.application.exceptions import InvalidRequestError, ModelValidationError, ResourceNotFoundError
from app.infrastructure.artifacts.debug_artifacts import (
    copy_debug_file,
    create_debug_artifact_dir,
    project_relative_path,
    write_debug_json,
)
from app.application.module_list import MODULE_LIST_HEADERS, collect_module_rows, normalize_io_category
from app.domain.modeling.fallback_diagnostics import collect_comp_desc_diagnostics
from app.infrastructure.protobuf import encode_cmodel, resolve_with_fidelity


def _normalize_io_category(raw_cat: str) -> str:
    return normalize_io_category(raw_cat)


def _collect_module_rows(node: dict, module_list_data: list[dict]) -> None:
    collect_module_rows(node, module_list_data)


def _load_blueprint(project_dir: Path) -> dict:
    blueprint_path = project_dir / "blueprint_CompDesc.json"
    if not blueprint_path.exists():
        raise InvalidRequestError(f"Project sandbox is missing blueprint_CompDesc.json: {project_dir.name}")

    with open(blueprint_path, "r", encoding="utf-8") as file:
        blueprint = json.load(file)

    return resolve_with_fidelity(blueprint, str(project_dir))


def _write_module_list_csv(project_dir: Path, project_id: str, full_data: dict | None) -> str:
    csv_name = f"{project_id}_module_list.csv"
    csv_path = project_dir / csv_name
    module_list_data: list[dict] = []

    if full_data:
        _collect_module_rows(full_data, module_list_data)

    with open(csv_path, "w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=MODULE_LIST_HEADERS)
        writer.writeheader()
        writer.writerows(module_list_data)

    return csv_name


def compile_project(project_id: str, project_dir: Path) -> dict:
    if not project_dir.exists():
        raise ResourceNotFoundError(f"Project not found: {project_id}")

    output_name = f"{project_id}_packed.cmodel"
    output_cmodel_path = project_dir / output_name
    full_data = _load_blueprint(project_dir)
    module_list_name = _write_module_list_csv(project_dir, project_id, full_data)
    diagnostics = collect_comp_desc_diagnostics(full_data)
    blocking_diagnostics = [item for item in diagnostics if item.get("severity") == "error"]
    if blocking_diagnostics:
        raise ModelValidationError(
            {
                "message": "Model compilation blocked by validation errors",
                "diagnostics": blocking_diagnostics,
            }
        )
    audit_log = encode_cmodel(str(project_dir), str(output_cmodel_path))
    for item in diagnostics:
        audit_log.append(
            f"DIAGNOSTIC[{item['severity']}]: {item['code']} "
            f"{item['component_id'] or item['component_name']}: {item['message']}"
        )

    debug_artifact_dir = create_debug_artifact_dir(project_dir, "compile")
    write_debug_json(debug_artifact_dir, "01_resolved_CompDesc.json", full_data)
    write_debug_json(debug_artifact_dir, "02_diagnostics.json", diagnostics)
    write_debug_json(debug_artifact_dir, "03_audit.json", audit_log)
    copy_debug_file(debug_artifact_dir, project_dir / "blueprint_CompDesc.json", "04_blueprint_CompDesc.json")
    copy_debug_file(debug_artifact_dir, project_dir / module_list_name, "05_module_list.csv")
    copy_debug_file(debug_artifact_dir, output_cmodel_path, "06_final_packed.cmodel")
    copy_debug_file(debug_artifact_dir, project_dir / "ModelFileDesc.json", "07_ModelFileDesc.json")
    copy_debug_file(debug_artifact_dir, project_dir / "CompDesc.model", "08_CompDesc.model")
    copy_debug_file(debug_artifact_dir, project_dir / "AbiSet.model", "09_AbiSet.model")
    copy_debug_file(debug_artifact_dir, project_dir / "FuncDesc.model", "10_FuncDesc.model")
    debug_artifacts_path = project_relative_path(project_dir, debug_artifact_dir)

    return {
        "status": "success",
        "download_url": f"/downloads/{project_id}/{output_name}",
        "module_list_url": f"/downloads/{project_id}/{module_list_name}",
        "audit": audit_log,
        "diagnostics": diagnostics,
        "debug_artifacts_path": debug_artifacts_path,
        "debug_artifacts_url": f"/downloads/{project_id}/{debug_artifacts_path}",
    }
