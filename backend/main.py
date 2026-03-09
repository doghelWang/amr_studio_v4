import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
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
        
        # Try to extract name and version from the Protobuf structure
        robot_name = "Factory Default"
        version = "1.0"
        try:
            robot_name_bytes = msg["5"][0]["4"]["1"]["1"]["10"]
            if isinstance(robot_name_bytes, bytes):
                robot_name = robot_name_bytes.decode('utf-8')
        except (KeyError, IndexError, TypeError):
            pass
        
        try:
            version_bytes = msg["5"][0]["4"]["1"]["5"]["10"]
            if isinstance(version_bytes, bytes):
                version = version_bytes.decode('utf-8')
        except (KeyError, IndexError, TypeError):
            pass
        
        manifest_path = TEMPLATES_DIR / "ModelFileDesc.json"
        file_list = []
        if manifest_path.exists():
            with open(manifest_path, 'r') as f:
                file_list = json.load(f).get("ModelFileDesc", [])
        
        return {
            "templates": [{
                "id": "factory_default",
                "name": robot_name,
                "version": version,
                "files": [f["name"] for f in file_list],
                "description": "出厂标准配置模板"
            }]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read templates: {str(e)}")

@app.get("/api/v1/templates/{template_id}")
async def get_template(template_id: str):
    """Returns a decoded template as an AmrProject-compatible JSON structure."""
    if template_id != "factory_default":
        raise HTTPException(status_code=404, detail="Template not found")
    
    try:
        comp_model_path = TEMPLATES_DIR / "CompDesc.model"
        if not comp_model_path.exists():
            raise HTTPException(status_code=404, detail="Template model files not found")
        
        # F6: Use model_parser for full reverse parsing (wheels, driveType, identity)
        project = model_parser.parse_comp_desc(str(comp_model_path))
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read template: {str(e)}")


@app.get("/api/v1/projects")
async def list_projects():
    """Returns a list of all saved project configurations."""
    try:
        projects = []
        for file_path in SAVED_PROJECTS_DIR.glob("*.json"):
            # Minimal parsing just to get the identity out, could optimize
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                config = data.get("config", {})
                identity = config.get("identity", {})
                
                projects.append({
                    "filename": file_path.name,
                    "robotName": identity.get("robotName", "Unknown"),
                    "lastModified": os.path.getmtime(file_path)
                })
        # Sort by most recently modified
        projects.sort(key=lambda x: x["lastModified"], reverse=True)
        return {"projects": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/projects/{filename}")
async def get_project(filename: str):
    """Retrieves a specific project configuration payload."""
    try:
        file_path = SAVED_PROJECTS_DIR / filename
        if not file_path.exists() or file_path.suffix != '.json':
            raise HTTPException(status_code=404, detail="Project not found")
        
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/projects")
async def save_project(payload: Dict[str, Any]):
    """Saves an entire AmrProject configuration payload to disk."""
    try:
        config = payload.get("config", {})
        identity = config.get("identity", {})
        robotName = identity.get("robotName", "Untitled_Project")
        
        # Sanitize filename
        safe_name = robotName.replace(' ', '_').replace('/', '_').replace('\\', '_')
        if not safe_name:
            safe_name = "Untitled_Project"
            
        filename = f"{safe_name}.json"
        file_path = SAVED_PROJECTS_DIR / filename
        
        # Dump the dictionary to json
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=4)
            
        return {"message": "Project saved successfully", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Model Generation ---
@app.post("/api/v1/generate")
async def generate_model_set(payload: GeneratePayload):
    try:
        # Pass the strict Pydantic payload directly to the engine
        zip_path = generate_industrial_modelset(payload)
        
        # Determine original model name for filename
        filename = f"{payload.robotName.replace(' ', '_')}_ModelSet.zip"
        
        return FileResponse(
            path=zip_path,
            filename=filename,
            media_type="application/zip"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("Starting Industrial AMR Studio API on port 8000...")
    uvicorn.run(app, host="127.0.0.1", port=8000)
