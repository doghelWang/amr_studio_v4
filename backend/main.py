import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import zipfile
import tempfile
import hashlib
from pathlib import Path
from typing import Dict, Any

import blackboxprotobuf
from schemas.api import GeneratePayload
from core.protobuf_engine import generate_industrial_modelset
import core.model_parser as model_parser

app = FastAPI(title="AMR Config Studio API", version="2.0")

# Enable CORS for local Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration Persistence ---
SAVED_PROJECTS_DIR = Path("saved_projects")
SAVED_PROJECTS_DIR.mkdir(exist_ok=True)

# --- Factory Templates ---
TEMPLATES_DIR = Path("templates")

@app.get("/api/v1/templates")
async def list_templates():
    """Returns a list of all factory template models with their decoded metadata."""
    try:
        comp_model_path = TEMPLATES_DIR / "CompDesc.model"
        if not comp_model_path.exists():
            return {"templates": []}
        
        with open(comp_model_path, 'rb') as f:
            msg, _ = blackboxprotobuf.decode_message(f.read())
        
        robot_name = "Factory Default"
        version = "1.0"
        try:
            from core.protobuf_navigator import ProtoNavigator
            raw_name = ProtoNavigator.safe_get_path(msg, ["5", "4", "1", "1", "10"])
            if raw_name: robot_name = raw_name.decode('utf-8')
            raw_version = ProtoNavigator.safe_get_path(msg, ["5", "4", "1", "5", "10"])
            if raw_version: version = raw_version.decode('utf-8')
        except:
            pass
        
        return {
            "templates": [{
                "id": "factory_default",
                "name": robot_name,
                "version": version,
                "description": "出厂标准配置模板"
            }]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read templates: {str(e)}")

@app.get("/api/v1/templates/download")
async def download_factory_template():
    """Download the factory template as a ZIP file."""
    base_dir = Path(__file__).parent.resolve()
    zip_path = base_dir / "factory_template.zip"
    templates_dir = base_dir / "templates"
    
    if not zip_path.exists():
        files_to_include = ["AbiSet.model", "CompDesc.model", "FuncDesc.model", "ModelFileDesc.json"]
        with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
            for fname in files_to_include:
                fpath = templates_dir / fname
                if fpath.exists():
                    zf.writestr(fname, fpath.read_bytes())
    
    if not zip_path.exists():
        raise HTTPException(status_code=404, detail="Template files not found")
    
    return FileResponse(path=str(zip_path.resolve()), media_type='application/zip', filename="factory_template.zip")

@app.post("/api/v1/import")
async def import_modelset_zip(file: UploadFile = File(...)):
    """Import a ModelSet ZIP and parse it."""
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Only .zip files are supported")
    
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            zip_path = os.path.join(tmpdir, 'uploaded.zip')
            contents = await file.read()
            with open(zip_path, 'wb') as f:
                f.write(contents)
            
            project = model_parser.ModelParser.parse_modelset(zip_path)
            project['_sourceFile'] = file.filename
            return project
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

@app.get("/api/v1/projects")
async def list_projects():
    try:
        projects = []
        for file_path in SAVED_PROJECTS_DIR.glob("*.json"):
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                config = data.get("config", {})
                identity = config.get("identity", {})
                projects.append({
                    "filename": file_path.name,
                    "robotName": identity.get("robotName", "Unknown"),
                    "lastModified": os.path.getmtime(file_path)
                })
        projects.sort(key=lambda x: x["lastModified"], reverse=True)
        return {"projects": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/projects/{filename}")
async def get_project(filename: str):
    try:
        file_path = SAVED_PROJECTS_DIR / filename
        if not file_path.exists(): raise HTTPException(status_code=404)
        with open(file_path, "r", encoding="utf-8") as f: return json.load(f)
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/projects")
async def save_project(payload: Dict[str, Any]):
    try:
        config = payload.get("config", {})
        robotName = config.get("identity", {}).get("robotName", "Untitled")
        filename = f"{robotName.replace(' ', '_')}.json"
        with open(SAVED_PROJECTS_DIR / filename, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=4)
        return {"filename": filename}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/generate")
async def generate_model_set(payload: GeneratePayload):
    try:
        zip_path = generate_industrial_modelset(payload)
        return FileResponse(path=zip_path, filename=f"{payload.robotName}_ModelSet.zip", media_type="application/zip")
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
