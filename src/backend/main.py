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

# --- Path Configuration (Standard 11-Dimension Structure) ---
BASE_DIR = Path(__file__).resolve().parent  # src/backend
PROJECT_ROOT = BASE_DIR.parent.parent       # Repo Root

SAVED_PROJECTS_DIR = PROJECT_ROOT / "src" / "backend" / "saved_projects"
SAVED_PROJECTS_DIR.mkdir(parents=True, exist_ok=True)

USER_SAVES_DIR = PROJECT_ROOT / "src" / "backend" / "user_saves"
USER_SAVES_DIR.mkdir(parents=True, exist_ok=True)

MODULE_LIBRARY_ROOT = PROJECT_ROOT / "specifications" / "ModuleLibrary"
if not MODULE_LIBRARY_ROOT.exists():
    MODULE_LIBRARY_ROOT = BASE_DIR / "resources"

app = FastAPI(title="AMR Studio V4 Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/downloads", StaticFiles(directory=str(SAVED_PROJECTS_DIR)), name="downloads")

from fastapi import Request

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    traceback.print_exc()
    return JSONResponse(status_code=500, content={"error": "InternalServerError", "detail": str(exc)})

# --- HELPERS ---
def strip_ui_wrappers(node):
    """
    Decisively strips 'LibraryGroup' and promote children during serialization or init.
    """
    if isinstance(node, dict):
        if "moreModuleInfo" in node:
            new_subs = []
            for sub in node["moreModuleInfo"]:
                if sub.get("moduleGroupName") == "LibraryGroup":
                    # Promote sub-items directly to current level
                    new_subs.extend(strip_ui_wrappers(sub).get("moreModuleInfo", []))
                else:
                    new_subs.append(strip_ui_wrappers(sub))
            node["moreModuleInfo"] = new_subs
        return {k: strip_ui_wrappers(v) for k, v in node.items()}
    elif isinstance(node, list):
        return [strip_ui_wrappers(i) for i in node]
    return node

@app.post("/api/v1/models/init-sandbox")
def init_sandbox_api(payload: dict = Body(...)):
    project_id = payload.get("projectId")
    config = payload.get("config")
    if not project_id or not config:
        raise HTTPException(status_code=400, detail="Missing projectId or config")

    from core.resource_adapter import frontend_to_comp_desc
    full_json = frontend_to_comp_desc(config)
    # [FIX F-001] Strip UI Shells before saving to blueprint
    sanitized_json = strip_ui_wrappers(full_json)

    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        full_json_path = tmp_path / "CompDesc.json"
        with open(full_json_path, "w", encoding="utf-8") as f:
            json.dump(sanitized_json, f, ensure_ascii=False, indent=2)
        
        split_out = tmp_path / "split"
        split_out.mkdir()
        split_comp_desc(str(full_json_path), str(split_out))
        
        blueprint_path = split_out / "blueprint_CompDesc.json"
        with open(blueprint_path, "r", encoding="utf-8") as f:
            blueprint = json.load(f)
            
        data_manager.init_project(project_id, blueprint, str(split_out / "modules"), tmp_path)
        
        abi_path = data_manager.get_project_dir(project_id) / "AbiSet.json"
        if config.get("abilities"):
            from core.resource_adapter import export_abilities
            abi_data = export_abilities(config["abilities"])
            with open(abi_path, "w", encoding="utf-8") as f:
                json.dump(abi_data, f, ensure_ascii=False, indent=2)

    return {"status": "success", "project_id": project_id}

@app.post("/api/v1/models/upload")
def upload_cmodel(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    project_id = f"proj_{uuid.uuid4().hex[:8]}"
    temp_dir = Path(tempfile.mkdtemp())
    try:
        cmodel_path = temp_dir / file.filename
        with open(cmodel_path, "wb") as f: shutil.copyfileobj(file.file, f)
        decode_out = temp_dir / "decoded"
        audit_log = decode_cmodel(str(cmodel_path), str(decode_out))
        split_out = temp_dir / "split"
        split_out.mkdir(parents=True, exist_ok=True)
        comp_desc_json = decode_out / "CompDesc.json"
        split_comp_desc(str(comp_desc_json), str(split_out))
        with open(split_out / "blueprint_CompDesc.json", "r", encoding="utf-8") as f: blueprint = json.load(f)
        with open(comp_desc_json, "r", encoding="utf-8") as f: full_json = json.load(f)
        data_manager.init_project(project_id, blueprint, str(split_out / "modules"), decode_out)
        background_tasks.add_task(shutil.rmtree, str(temp_dir), ignore_errors=True)
        return {"status": "success", "project_id": project_id, "blueprint": blueprint, "full_json": full_json, "audit": audit_log}
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/models/{project_id}/components/{module_uuid}")
def get_component_api(project_id: str, module_uuid: str):
    comp = data_manager.get_component(project_id, module_uuid)
    if not comp: raise HTTPException(status_code=404)
    return comp

@app.patch("/api/v1/models/{project_id}/components/{module_uuid}")
async def update_component_api(project_id: str, module_uuid: str, request: Request):
    try:
        body = await request.json()
        file_name = body.get("file_name")
        if file_name:
            global_source = BASE_DIR / "resources" / "modules" / file_name
            data_manager.ensure_module_in_project(project_id, file_name, global_source)
        success = data_manager.update_component(project_id, module_uuid, body)
        return {"status": "success" if success else "error"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/v1/models/{project_id}/abilities")
def get_abilities_api(project_id: str):
    return data_manager.get_ability(project_id) or {}

@app.patch("/api/v1/models/{project_id}/abilities")
async def update_abilities_api(project_id: str, request: Request):
    try:
        payload = await request.json()
        final_payload = payload
        if isinstance(payload, list): final_payload = {"functionAbility": payload, "version": "1.0"}
        success = data_manager.update_ability(project_id, final_payload)
        return {"status": "success" if success else "error"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")

@app.post("/api/v1/models/{project_id}/compile")
def compile_cmodel_api(project_id: str):
    try:
        p_dir = data_manager.get_project_dir(project_id)
        blueprint_path = str(p_dir / "blueprint_CompDesc.json")
        fname = f"{project_id}_packed.cmodel"
        output_cmodel = str(p_dir / fname)
        audit_log = encode_cmodel(blueprint_path, output_cmodel)
        return {"status": "success", "download_url": f"/downloads/{project_id}/{fname}", "audit": audit_log}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/resources/boards")
def list_boards_api():
    boards = []
    host_dir = MODULE_LIBRARY_ROOT / "board_desc" / "host"
    if host_dir.exists():
        for f in host_dir.glob("*.json"):
            try:
                with open(f, "r", encoding="utf-8") as file:
                    data = json.load(file)
                    board_id = list(data.keys())[0]
                    info = data[board_id].get("基本信息", {})
                    boards.append({"id": board_id, "name": info.get("name", board_id), "desc": info.get("desc", ""), "board_type": info.get("board_type", [])})
            except: pass
    return boards

@app.get("/api/v1/projects/saved-list")
def list_saved_projects():
    projects = []
    for f in USER_SAVES_DIR.glob("*.json"): projects.append({"name": f.stem, "mtime": os.path.getmtime(f)})
    projects.sort(key=lambda x: x["mtime"], reverse=True)
    return projects

@app.post("/api/v1/projects/save")
def save_user_project(payload: dict = Body(...)):
    name = payload.get("name")
    config = payload.get("config")
    if not name or not config: raise HTTPException(status_code=400)
    with open(USER_SAVES_DIR / f"{name}.json", "w", encoding="utf-8") as f: json.dump(config, f, ensure_ascii=False, indent=2)
    return {"status": "success"}

@app.get("/api/v1/projects/load/{name}")
def load_user_project(name: str):
    fpath = USER_SAVES_DIR / f"{name}.json"
    if not fpath.exists(): raise HTTPException(status_code=404)
    with open(fpath, "r", encoding="utf-8") as f: return json.load(f)

@app.get("/api/v1/schemas")
def get_schemas_api():
    entities = {}
    flat_path = Path(BASE_DIR / "resources" / "modules")
    all_files = list(flat_path.glob("*"))
    base_map = {}
    for f in all_files:
        if f.suffix not in [".json", ".xml"]: continue
        stem = f.stem
        if stem not in base_map: base_map[stem] = {"json": None, "xml": None}
        base_map[stem][f.suffix[1:]] = f
    from core import resource_adapter
    for stem, formats in base_map.items():
        try:
            data_json = None; data_xml = None
            if formats["json"]:
                with open(formats["json"], "r", encoding="utf-8") as file: data_json = json.load(file)
            if formats["xml"]: data_xml = resource_adapter.xml_to_component_json(str(formats["xml"]))
            primary = data_xml or data_json
            sys_name = "Other"
            try:
                comp = (primary.get("moduleComponets") or [])[0]
                sys_name = comp.get("generalAttr", {}).get("subSysType", {}).get("comboType", {}).get("typeKey") or "Other"
            except: pass
            if sys_name not in entities: entities[sys_name] = []
            entities[sys_name].append({
                "module_id": stem, "moduleGroupName": primary.get("moduleGroupName", stem), "system": sys_name,
                "data_json": data_json, "data_xml": data_xml, "file_name": formats["xml"].name if formats["xml"] else formats["json"].name
            })
        except: pass
    return entities

FRONTEND_DIST = PROJECT_ROOT / "src" / "frontend" / "dist"
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api") or full_path.startswith("downloads"): return JSONResponse(status_code=404, content={})
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file(): return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")

if __name__ == "__main__":
    uvicorn.run(app, host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", "8002")))
