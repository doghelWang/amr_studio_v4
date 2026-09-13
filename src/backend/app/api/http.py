import os

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import load_backend_config
from app.errors import global_exception_handler
from app.schemas.request_models import InitSandboxRequest, SaveProjectRequest
from app.application.exceptions import ApplicationError
from app.application.compile_model import compile_project
from app.application.component_editing import (
    get_abilities as get_abilities_service,
    get_component as get_component_service,
    get_functions as get_functions_service,
    update_abilities as update_abilities_service,
    update_component as update_component_service,
)
from app.application.project_management import (
    initialize_project_sandbox,
    list_saved_projects as list_saved_projects_service,
    load_user_project_config,
    save_user_project_config,
)
from app.application.resource_catalog import (
    list_boards as list_boards_service,
    list_schemas as list_schemas_service,
)
from app.application.system_info import get_system_version
from app.application.import_model import upload_cmodel_to_project
from app.infrastructure.projects import data_manager


CONFIG = load_backend_config()


def _raise_http_error(exc: ApplicationError) -> None:
    raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


def create_app(config=None) -> FastAPI:
    """Create the HTTP adapter without moving business logic into routes."""
    runtime_config = config or CONFIG
    application = FastAPI(title="AMR Studio V4 Backend")
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.mount(
        "/downloads",
        StaticFiles(directory=str(runtime_config.saved_projects_dir)),
        name="downloads",
    )

    @application.get("/api/v1/system/version")
    def get_system_version_api():
        return get_system_version(runtime_config)

    @application.exception_handler(Exception)
    async def _global_exception_handler(request: Request, exc: Exception):
        return await global_exception_handler(request, exc)

    @application.post("/api/v1/models/init-sandbox")
    def init_sandbox_api(payload: InitSandboxRequest):
        try:
            return initialize_project_sandbox(payload.projectId, payload.config)
        except ApplicationError as exc:
            _raise_http_error(exc)

    @application.post("/api/v1/models/upload")
    def upload_cmodel(file: UploadFile = File(...)):
        try:
            return upload_cmodel_to_project(file)
        except ApplicationError as exc:
            _raise_http_error(exc)

    @application.get("/api/v1/models/{project_id}/components/{module_uuid}")
    def get_component_api(project_id: str, module_uuid: str):
        comp = get_component_service(project_id, module_uuid)
        if not comp:
            raise HTTPException(status_code=404)
        return comp

    @application.patch("/api/v1/models/{project_id}/components/{module_uuid}")
    async def update_component_api(project_id: str, module_uuid: str, request: Request):
        try:
            body = await request.json()
            return update_component_service(
                project_id,
                module_uuid,
                body,
                runtime_config.base_dir / "resources",
            )
        except Exception as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    @application.get("/api/v1/models/{project_id}/abilities")
    def get_abilities_api(project_id: str):
        return get_abilities_service(project_id)

    @application.get("/api/v1/models/{project_id}/functions")
    def get_functions_api(project_id: str):
        return get_functions_service(project_id)

    @application.patch("/api/v1/models/{project_id}/abilities")
    async def update_abilities_api(project_id: str, request: Request):
        try:
            payload = await request.json()
            return update_abilities_service(project_id, payload)
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Invalid JSON: {exc}") from exc

    @application.post("/api/v1/models/{project_id}/compile")
    def compile_cmodel_api(project_id: str):
        try:
            project_dir = data_manager.get_project_dir(project_id)
            return compile_project(project_id, project_dir)
        except ApplicationError as exc:
            _raise_http_error(exc)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc)) from exc

    @application.get("/api/v1/resources/boards")
    def list_boards_api():
        return list_boards_service(runtime_config.module_library_root)

    @application.get("/api/v1/projects/saved-list")
    def list_saved_projects():
        return list_saved_projects_service(runtime_config.user_saves_dir)

    @application.post("/api/v1/projects/save")
    def save_user_project(payload: SaveProjectRequest):
        try:
            return save_user_project_config(
                runtime_config.user_saves_dir,
                payload.name,
                payload.config,
            )
        except ApplicationError as exc:
            _raise_http_error(exc)

    @application.get("/api/v1/projects/load/{name}")
    def load_user_project(name: str):
        try:
            return load_user_project_config(runtime_config.user_saves_dir, name)
        except ApplicationError as exc:
            _raise_http_error(exc)

    @application.get("/api/v1/schemas")
    def get_schemas_api():
        return list_schemas_service(runtime_config.base_dir / "resources")

    return application


app = create_app()

SAVED_PROJECTS_DIR = CONFIG.saved_projects_dir
USER_SAVES_DIR = CONFIG.user_saves_dir
compile_cmodel_api = next(
    route.endpoint
    for route in app.routes
    if getattr(route, "path", None) == "/api/v1/models/{project_id}/compile"
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", "8002")))
