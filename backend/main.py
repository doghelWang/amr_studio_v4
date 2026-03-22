import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import json
import sys
from pathlib import Path
from typing import List, Dict, Any

app = FastAPI(title="AMR Studio Pro V4", version="4.0")

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

# --- 1. API ROUTES (Must be before mount) ---

@app.get("/api/v1/templates")
async def list_templates():
    print("API: list_templates called")
    return {
        "templates": [
            {"id": "base-diff", "name": "标准差速构型", "type": "DIFFERENTIAL", "version": "1.0", "description": "出厂标准差速底盘模板"},
            {"id": "base-single-steer", "name": "标准单舵轮构型", "type": "SINGLE_STEER", "version": "1.0", "description": "出厂标准单舵轮模板"},
        ]
    }

@app.get("/api/v1/projects")
async def list_projects():
    print("API: list_projects called")
    project_list = []
    for f in SAVED_PROJECTS_DIR.glob("*.json"):
        try:
            with open(f, "r", encoding='utf-8') as j:
                data = json.load(j)
                meta = data.get("meta", {})
                project_list.append({
                    "id": f.stem,
                    "filename": f.name,
                    "robotName": meta.get("projectName") or f.stem,
                    "lastModified": f.stat().st_mtime
                })
        except: continue
    # Standard format expected by projectFileService.ts
    return {"projects": sorted(project_list, key=lambda x: x['lastModified'], reverse=True)}

@app.get("/api/v1/projects/{p_id}")
async def get_project(p_id: str):
    print(f"API: get_project called for {p_id}")
    filename = p_id if p_id.endswith(".json") else f"{p_id}.json"
    file_path = SAVED_PROJECTS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Project {p_id} not found")
    with open(file_path, "r", encoding='utf-8') as f:
        return json.load(f)

@app.post("/api/v1/projects")
async def save_project(payload: Dict[str, Any]):
    print("API: save_project called")
    meta = payload.get("meta", {})
    p_id = meta.get("projectId") or meta.get("id") or "unknown"
    file_path = SAVED_PROJECTS_DIR / f"{p_id}.json"
    with open(file_path, "w", encoding='utf-8') as f:
        json.dump(payload, f, indent=4, ensure_ascii=False)
    return {"status": "ok", "projectId": p_id}

from fastapi import Body
from core import data_manager
import uuid
import tempfile
import shutil
from skills_v2.cmodel_decoder.decoder import decode_cmodel
from skills_v2.model_splitter.splitter import split_comp_desc
from skills_v2.cmodel_encoder.encoder import encode_cmodel

import logging
logging.basicConfig(filename='backend_debug.log', level=logging.DEBUG)

from fastapi import BackgroundTasks

@app.post("/api/v1/models/upload")
def upload_cmodel(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    print(f"DEBUG: upload_cmodel called for {file.filename}", flush=True)
    project_id = f"proj_{uuid.uuid4().hex[:8]}"
    
    temp_dir = Path(tempfile.mkdtemp())
    try:
        # 1. Save ZIP
        cmodel_path = temp_dir / file.filename
        with open(cmodel_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        # 2. Decode
        decode_out = temp_dir / "decoded"
        decode_out.mkdir(parents=True, exist_ok=True)
        decode_cmodel(str(cmodel_path), str(decode_out))
        
        # 3. Split
        split_out = temp_dir / "split"
        split_out.mkdir(parents=True, exist_ok=True)
        (split_out / "modules").mkdir(parents=True, exist_ok=True)
        
        comp_desc_json = decode_out / "CompDesc.json"
        
        if not comp_desc_json.exists():
             raise HTTPException(status_code=400, detail=f"Invalid cmodel: CompDesc.json missing at {comp_desc_json}")
            
        print(f"DEBUG: Splitting {comp_desc_json} into {split_out}", flush=True)
        split_comp_desc(str(comp_desc_json), str(split_out))
        
        # 4. Save to DataManager (Physical persistence)
        with open(split_out / "blueprint_CompDesc.json", "r", encoding="utf-8") as f:
            blueprint = json.load(f)

        with open(comp_desc_json, "r", encoding="utf-8") as f:
            full_json = json.load(f)
            
        data_manager.init_project(project_id, blueprint, str(split_out / "modules"), decode_out)
        
        # Schedule cleanup
        background_tasks.add_task(shutil.rmtree, str(temp_dir), ignore_errors=True)
        
        return {
            "status": "success",
            "project_id": project_id,
            "blueprint": blueprint,
            "full_json": full_json
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        shutil.rmtree(temp_dir, ignore_errors=True)
        logging.exception("Upload Error")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/models/{project_id}/components/{module_uuid}")
async def get_component_api(project_id: str, module_uuid: str):
    comp = data_manager.get_component(project_id, module_uuid)
    if not comp:
        raise HTTPException(status_code=404, detail="Component not found")
    return comp

@app.patch("/api/v1/models/{project_id}/components/{module_uuid}")
async def update_component_api(project_id: str, module_uuid: str, payload: dict = Body(...)):
    success = data_manager.update_component(project_id, module_uuid, payload)
    if not success:
         raise HTTPException(status_code=404, detail="Component not found or update failed")
    return {"status": "success"}

@app.get("/api/v1/models/{project_id}/abilities")
async def get_abilities_api(project_id: str):
    abilities = data_manager.get_ability(project_id)
    if not abilities:
        raise HTTPException(status_code=404, detail="Abilities not found for this project")
    return abilities

@app.patch("/api/v1/models/{project_id}/abilities")
async def update_abilities_api(project_id: str, payload: dict = Body(...)):
    success = data_manager.update_ability(project_id, payload)
    if not success:
        raise HTTPException(status_code=404, detail="Update abilities failed")
    return {"status": "success"}

@app.post("/api/v1/models/{project_id}/compile")
async def compile_cmodel_api(project_id: str):
    print(f"API: compile_cmodel_api called for {project_id}")
    try:
        blueprint_path = str(data_manager.get_project_dir(project_id) / "blueprint_CompDesc.json")
        output_cmodel = str(data_manager.get_project_dir(project_id) / f"{project_id}_packed.cmodel")
        
        encode_cmodel(blueprint_path, output_cmodel)
        return FileResponse(output_cmodel, media_type="application/zip", filename=f"{project_id}_packed.cmodel")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Compile Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- 2. STATIC HOSTING ---
frontend_dist = BASE_DIR.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")

if __name__ == "__main__":
    print(f"🚀 Initializing AMR Studio V4 Backend...")
    print(f"📁 Projects Directory: {SAVED_PROJECTS_DIR}")
    uvicorn.run(app, host="0.0.0.0", port=8005)
