import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import zipfile
import tempfile
import shutil
from pathlib import Path
from typing import Dict, Any, Optional

import blackboxprotobuf
from schemas.api import GeneratePayload
from fastapi.concurrency import run_in_threadpool
from core.protobuf_engine import generate_industrial_modelset
import core.model_parser as model_parser

app = FastAPI(title="AMR Studio Pro V4", version="4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEBUG_LOGS = []

@app.get("/api/v1/debug/logs")
async def get_debug_logs():
    global DEBUG_LOGS
    logs = list(DEBUG_LOGS)
    DEBUG_LOGS.clear()
    return {"logs": logs}

# Paths
SAVED_PROJECTS_DIR = Path("saved_projects")
PROJECT_BASES_DIR = Path("project_bases")
TEMPLATES_DIR = Path("templates")

for d in [SAVED_PROJECTS_DIR, PROJECT_BASES_DIR]: d.mkdir(exist_ok=True)

@app.post("/api/v1/import")
async def import_modelset(file: UploadFile = File(...)):
    """
    Import and establish a 'Gene Base' for the project.
    """
    if not (file.filename.endswith('.zip') or file.filename.endswith('.cmodel')):
        raise HTTPException(status_code=400, detail="Unsupported format")
    
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            temp_zip = os.path.join(tmpdir, "base.zip")
            contents = await file.read()
            with open(temp_zip, "wb") as f:
                f.write(contents)
            
            # 1. Parse for Frontend Config & Raw Tree
            DEBUG_LOGS.clear()
            def trace_log(msg):
                DEBUG_LOGS.append(msg)
                
            parse_result = await run_in_threadpool(
                model_parser.ModelParser.parse_modelset,
                temp_zip,
                True,
                trace_log
            )
            
            project_id = parse_result['config']['meta']['projectId']
            
            # 2. Persist the binary 'Gene Base'
            base_storage_path = PROJECT_BASES_DIR / f"{project_id}.base.cmodel"
            with open(base_storage_path, "wb") as f:
                f.write(contents)
            
            # 3. Add internal tracking
            parse_result['config']['meta']['baseModelPath'] = str(base_storage_path)
            parse_result['_sourceFile'] = file.filename
            
            return parse_result
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

@app.post("/api/v1/generate")
async def generate_model(payload: GeneratePayload):
    """
    Clone-and-Patch generation.
    """
    try:
        # Check if a custom gene base exists for this project
        # In V4, we use robotName or a hidden projectId from payload
        # For this implementation, we look for project_id in robotName fallback or extra field
        project_id = getattr(payload, 'projectId', 'default')
        base_path = PROJECT_BASES_DIR / f"{project_id}.base.cmodel"
        
        if not base_path.exists():
            # Fallback to standard template
            base_path = TEMPLATES_DIR / "CompDesc.model" # This needs to be handled by engine
            print(f"[*] No gene base found for {project_id}, using factory templates.")
            custom_base = None
        else:
            custom_base = str(base_path)
            print(f"[*] Using Gene Base: {custom_base}")

        zip_path = generate_industrial_modelset(payload, base_modelset_zip=custom_base)
        
        return FileResponse(
            path=zip_path,
            media_type='application/zip',
            filename=f"{payload.robotName}_V4_Export.cmodel"
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ... [Standard CRUD for projects below] ...

@app.get("/api/v1/projects")
async def list_projects():
    projects = []
    for f in SAVED_PROJECTS_DIR.glob("*.json"):
        with open(f, "r") as j:
            data = json.load(j)
            meta = data.get("meta", {})
            projects.append({"id": meta.get("projectId"), "name": meta.get("projectName"), "mtime": f.stat().st_mtime})
    return sorted(projects, key=lambda x: x['mtime'], reverse=True)

@app.post("/api/v1/projects")
async def save_project(payload: Dict[str, Any]):
    p_id = payload.get("meta", {}).get("projectId", "unknown")
    with open(SAVED_PROJECTS_DIR / f"{p_id}.json", "w") as f:
        json.dump(payload, f, indent=4)
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
