import uvicorn
from fastapi import Body, FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import load_backend_config
from app.errors import global_exception_handler
from app.schemas.request_models import InitSandboxRequest, SaveProjectRequest
from core import data_manager
from app.services.compile_service import compile_project
from app.services.model_service import (
    get_abilities as get_abilities_service,
    get_component as get_component_service,
    get_functions as get_functions_service,
    update_abilities as update_abilities_service,
    update_component as update_component_service,
)
from app.services.project_service import (
    initialize_project_sandbox,
    list_saved_projects as list_saved_projects_service,
    load_user_project_config,
    save_user_project_config,
)
from app.services.resource_service import list_boards as list_boards_service, list_schemas as list_schemas_service
from app.services.system_service import get_system_version
from app.services.upload_service import upload_cmodel_to_project
import os

CONFIG = load_backend_config()
SAVED_PROJECTS_DIR = CONFIG.saved_projects_dir
USER_SAVES_DIR = CONFIG.user_saves_dir

app = FastAPI(title="AMR Studio V4 Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/downloads", StaticFiles(directory=str(CONFIG.saved_projects_dir)), name="downloads")


@app.get("/api/v1/system/version")
def get_system_version_api():
    return get_system_version(CONFIG)

@app.exception_handler(Exception)
async def _global_exception_handler(request: Request, exc: Exception):
    return await global_exception_handler(request, exc)

@app.post("/api/v1/models/init-sandbox")
def init_sandbox_api(payload: InitSandboxRequest):
    return initialize_project_sandbox(payload.projectId, payload.config)

@app.post("/api/v1/models/upload")
def upload_cmodel(file: UploadFile = File(...)):
    return upload_cmodel_to_project(file)

@app.get("/api/v1/models/{project_id}/components/{module_uuid}")
def get_component_api(project_id: str, module_uuid: str):
    comp = get_component_service(project_id, module_uuid)
    if not comp: raise HTTPException(status_code=404)
    return comp

@app.patch("/api/v1/models/{project_id}/components/{module_uuid}")
async def update_component_api(project_id: str, module_uuid: str, request: Request):
    try:
        body = await request.json()
        return update_component_service(project_id, module_uuid, body, CONFIG.base_dir / "resources")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/v1/models/{project_id}/abilities")
def get_abilities_api(project_id: str):
    return get_abilities_service(project_id)

@app.get("/api/v1/models/{project_id}/functions")
def get_functions_api(project_id: str):
    return get_functions_service(project_id)

@app.patch("/api/v1/models/{project_id}/abilities")
async def update_abilities_api(project_id: str, request: Request):
    try:
        payload = await request.json()
        return update_abilities_service(project_id, payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")

@app.post("/api/v1/models/{project_id}/compile")
def compile_cmodel_api(project_id: str):
    try:
        project_dir = data_manager.get_project_dir(project_id)
        return compile_project(project_id, project_dir)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/resources/boards")
def list_boards_api():
    return list_boards_service(CONFIG.module_library_root)

@app.get("/api/v1/projects/saved-list")
def list_saved_projects():
    return list_saved_projects_service(CONFIG.user_saves_dir)

@app.post("/api/v1/projects/save")
def save_user_project(payload: SaveProjectRequest):
    return save_user_project_config(CONFIG.user_saves_dir, payload.name, payload.config)

@app.get("/api/v1/projects/load/{name}")
def load_user_project(name: str):
    return load_user_project_config(CONFIG.user_saves_dir, name)

@app.get("/api/v1/schemas")
def get_schemas_api():
    return list_schemas_service(CONFIG.base_dir / "resources")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", "8002")))
