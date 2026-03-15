import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import json
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

@app.post("/api/v1/generate")
async def generate_cmodel(payload: Dict[str, Any]):
    try:
        from core.schema_builder import CustomCompDescBuilder
        template = BASE_DIR / "templates" / "CompDesc.model"
        builder = CustomCompDescBuilder(str(template))
        zip_path = builder.build_from_payload(payload)
        return FileResponse(zip_path, media_type="application/zip", filename=os.path.basename(zip_path))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- 2. STATIC HOSTING ---
frontend_dist = BASE_DIR.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")

if __name__ == "__main__":
    print(f"🚀 Initializing AMR Studio V4 Backend...")
    print(f"📁 Projects Directory: {SAVED_PROJECTS_DIR}")
    uvicorn.run(app, host="0.0.0.0", port=8002)
