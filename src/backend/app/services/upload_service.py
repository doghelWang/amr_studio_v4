import json
import shutil
import tempfile
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

from core import data_manager
from skills_v2.cmodel_decoder.decoder import decode_cmodel
from skills_v2.model_splitter.splitter import split_comp_desc


def _copy_optional_artifacts(decoded_dir: Path, project_dir: Path) -> None:
    optional_files = [
        ("AbiSet.json", "AbiSet.json"),
        ("FuncDesc.json", "FuncDesc.json"),
        ("FuncDesc.model", "FuncDesc.model"),
    ]

    for source_name, target_name in optional_files:
        source_path = decoded_dir / source_name
        if source_path.exists():
            shutil.copy2(source_path, project_dir / target_name)


def upload_cmodel_to_project(file: UploadFile) -> dict:
    project_id = f"proj_{uuid.uuid4().hex[:8]}"
    temp_dir = Path(tempfile.mkdtemp())

    try:
        cmodel_path = temp_dir / (file.filename or "uploaded.cmodel")
        with open(cmodel_path, "wb") as temp_file:
            shutil.copyfileobj(file.file, temp_file)

        decode_out = temp_dir / "decoded"
        audit_log = decode_cmodel(str(cmodel_path), str(decode_out))

        split_out = temp_dir / "split"
        split_out.mkdir(parents=True, exist_ok=True)

        comp_desc_json = decode_out / "CompDesc.json"
        split_comp_desc(str(comp_desc_json), str(split_out))

        with open(split_out / "blueprint_CompDesc.json", "r", encoding="utf-8") as file_handle:
            blueprint = json.load(file_handle)
        with open(comp_desc_json, "r", encoding="utf-8") as file_handle:
            full_json = json.load(file_handle)

        data_manager.init_project(project_id, blueprint, str(split_out / "modules"), full_json)
        _copy_optional_artifacts(decode_out, data_manager.get_project_dir(project_id))

        return {
            "status": "success",
            "project_id": project_id,
            "blueprint": blueprint,
            "full_json": full_json,
            "audit": audit_log,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
