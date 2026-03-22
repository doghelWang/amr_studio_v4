import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File, Body, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uuid
import shutil
import tempfile
import json
from pathlib import Path
from core import data_manager
from skills_v2.cmodel_decoder.decoder import decode_cmodel
from skills_v2.model_splitter.splitter import split_comp_desc
from skills_v2.cmodel_encoder.encoder import encode_cmodel

app = FastAPI(title="AMR Studio V4 Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent
SAVED_PROJECTS_DIR = BASE_DIR / "saved_projects"
SAVED_PROJECTS_DIR.mkdir(exist_ok=True)

app.mount("/downloads", StaticFiles(directory=str(SAVED_PROJECTS_DIR)), name="downloads")

@app.post("/api/v1/models/upload")
def upload_cmodel(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    print(f"DEBUG: upload_cmodel called for {file.filename}", flush=True)
    project_id = f"proj_{uuid.uuid4().hex[:8]}"
    temp_dir = Path(tempfile.mkdtemp())
    try:
        cmodel_path = temp_dir / file.filename
        with open(cmodel_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        decode_out = temp_dir / "decoded"
        audit_log = decode_cmodel(str(cmodel_path), str(decode_out))
        
        split_out = temp_dir / "split"
        split_out.mkdir(parents=True, exist_ok=True)
        comp_desc_json = decode_out / "CompDesc.json"
        
        split_comp_desc(str(comp_desc_json), str(split_out))
        
        with open(split_out / "blueprint_CompDesc.json", "r", encoding="utf-8") as f:
            blueprint = json.load(f)
        with open(comp_desc_json, "r", encoding="utf-8") as f:
            full_json = json.load(f)
            
        data_manager.init_project(project_id, blueprint, str(split_out / "modules"), decode_out)
        background_tasks.add_task(shutil.rmtree, str(temp_dir), ignore_errors=True)
        
        return {
            "status": "success",
            "project_id": project_id,
            "blueprint": blueprint,
            "full_json": full_json,
            "audit": audit_log
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/models/{project_id}/components/{module_uuid}")
def get_component_api(project_id: str, module_uuid: str):
    comp = data_manager.get_component(project_id, module_uuid)
    if not comp: raise HTTPException(status_code=404)
    return comp

@app.patch("/api/v1/models/{project_id}/components/{module_uuid}")
def update_component_api(project_id: str, module_uuid: str, payload: dict = Body(...)):
    success = data_manager.update_component(project_id, module_uuid, payload)
    return {"status": "success" if success else "error"}

@app.get("/api/v1/models/{project_id}/abilities")
def get_abilities_api(project_id: str):
    return data_manager.get_ability(project_id) or {}

@app.patch("/api/v1/models/{project_id}/abilities")
def update_abilities_api(project_id: str, payload: dict = Body(...)):
    success = data_manager.update_ability(project_id, payload)
    return {"status": "success" if success else "error"}

# ━━━ CRITICAL FIX: Changed to sync 'def' to prevent event loop hang ━━━
@app.post("/api/v1/models/{project_id}/compile")
def compile_cmodel_api(project_id: str):
    print(f"DEBUG: Entering compile_cmodel_api for {project_id}", flush=True)
    try:
        p_dir = data_manager.get_project_dir(project_id)
        blueprint_path = str(p_dir / "blueprint_CompDesc.json")
        fname = f"{project_id}_packed.cmodel"
        output_cmodel = str(p_dir / fname)
        
        # This is a heavy sync call
        audit_log = encode_cmodel(blueprint_path, output_cmodel)
        
        return {
            "status": "success",
            "download_url": f"/downloads/{project_id}/{fname}",
            "audit": audit_log
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
