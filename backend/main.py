import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import json
import zipfile
import tempfile
import shutil
from pathlib import Path
from typing import Dict, Any, Optional

import blackboxprotobuf
from schemas.api import GeneratePayload
from core.protobuf_engine import generate_industrial_modelset
import core.model_parser as model_parser

app = FastAPI(title="AMR Studio Pro V4 (Unified)", version="4.0")

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
    if not (file.filename.endswith('.zip') or file.filename.endswith('.cmodel')):
        raise HTTPException(status_code=400, detail="Unsupported format")
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            temp_zip = os.path.join(tmpdir, "base.zip")
            contents = await file.read()
            with open(temp_zip, "wb") as f:
                f.write(contents)
            DEBUG_LOGS.clear()
            def trace_log(msg): DEBUG_LOGS.append(msg)
            parse_result = model_parser.ModelParser.parse_modelset(temp_zip, True, trace_log)
            project_id = parse_result['meta']['projectId']
            base_storage_path = PROJECT_BASES_DIR / f"{project_id}.base.cmodel"
            with open(base_storage_path, "wb") as f:
                f.write(contents)
            return parse_result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

@app.post("/api/v1/generate")
async def generate_model_endpoint(payload: GeneratePayload):
    try:
        from core.schema_builder import CustomCompDescBuilder
        template = Path(__file__).parent / "templates" / "CompDesc.model"
        builder = CustomCompDescBuilder(str(template))
        zip_path = builder.build_from_payload(payload)
        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename=os.path.basename(zip_path)
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

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

# --- Unified Hosting ---
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
