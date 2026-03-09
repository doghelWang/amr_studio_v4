import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from pathlib import Path
from typing import Dict, Any

from schemas.api import GeneratePayload
from core.protobuf_engine import generate_industrial_modelset

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
