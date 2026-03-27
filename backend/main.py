"""
AMR Studio V4 Backend - 核心服务端逻辑
该模块基于 FastAPI 提供机器人配置模型的载入、分发、同步与编译导出功能。
核心流程：
1. 载入 .cmodel (Protobuf) 并解码为 CompDesc.json。
2. 将 CompDesc.json 拆分为 Blueprint 与独立模块。
3. 提供模块级增删改查沙箱环境。
4. 将编辑后的配置重组并编译为二进制 .cmodel。
"""

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

# 内部核心技能模块 - 提供 Protobuf 二进制编解码与模型切割逻辑
from core import data_manager
from skills_v2.cmodel_decoder.decoder import decode_cmodel
from skills_v2.model_splitter.splitter import split_comp_desc
try:
    from skills_v2.cmodel_encoder.encoder import encode_cmodel
except ImportError as e:
    print(f"WARNING: Failed to import encode_cmodel due to Protobuf error: {e}", flush=True)
    def encode_cmodel(*args, **kwargs):
        return {"error": "Encoder not available due to environment issues"}

app = FastAPI(title="AMR Studio V4 Backend")

# ━━━ 跨域配置 ━━━
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

# 挂载下载目录，用于访问编译后的生成物
app.mount("/downloads", StaticFiles(directory=str(SAVED_PROJECTS_DIR)), name="downloads")

from fastapi import Request

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常拦截器，输出完整的堆栈追踪信息以辅助调试"""
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"error": "InternalServerError", "detail": str(exc), "request_path": request.url.path}
    )

@app.post("/api/v1/models/upload")
def upload_cmodel(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    模型上传与初始化接口
    1. 接收 .cmodel 文件。
    2. 调用 skills_v2 进行解码与 CompDesc 拆分。
    3. 初始化项目沙箱环境，返回 Blueprint。
    """
    print(f"DEBUG: upload_cmodel called for {file.filename}", flush=True)
    project_id = f"proj_{uuid.uuid4().hex[:8]}"
    temp_dir = Path(tempfile.mkdtemp())
    try:
        # 保存原始上传文件
        cmodel_path = temp_dir / file.filename
        with open(cmodel_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
            
        # 解码 cmodel -> CompDesc.json (使用 Protobuf 描述定义)
        decode_out = temp_dir / "decoded"
        audit_log = decode_cmodel(str(cmodel_path), str(decode_out))
        
        # 拆分模型为 Blueprint (向导用) + Modules (按需载入)
        split_out = temp_dir / "split"
        split_out.mkdir(parents=True, exist_ok=True)
        comp_desc_json = decode_out / "CompDesc.json"
        
        split_comp_desc(str(comp_desc_json), str(split_out))
        
        with open(split_out / "blueprint_CompDesc.json", "r", encoding="utf-8") as f:
            blueprint = json.load(f)
        with open(comp_desc_json, "r", encoding="utf-8") as f:
            full_json = json.load(f)
            
        # 将分离后的资源初始化到项目工作目录
        data_manager.init_project(project_id, blueprint, str(split_out / "modules"), decode_out)
        background_tasks.add_task(shutil.rmtree, str(temp_dir), ignore_errors=True)
        
        return {
            "status": "success",
            "project_id": project_id,
            "blueprint": blueprint,
            "full_json": full_json,
            "audit": audit_log
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/models/{project_id}/components/{module_uuid}")
def get_component_api(project_id: str, module_uuid: str):
    """获取沙箱中特定模块的详细配置 JSON"""
    comp = data_manager.get_component(project_id, module_uuid)
    if not comp: raise HTTPException(status_code=404)
    return comp

@app.post("/api/v1/models/{project_id}/sync_resource")
def sync_resource_api(project_id: str, file_name: str = Body(embed=True)):
    """将公共资源池中的模块文件同步到特定项目的沙箱目录数据"""
    global_source = BASE_DIR / "resources" / "modules" / file_name
    success = data_manager.ensure_module_in_project(project_id, file_name, global_source)
    return {"status": "success" if success else "error"}

@app.patch("/api/v1/models/{project_id}/components/{module_uuid}")
def update_component_api(project_id: str, module_uuid: str, payload: dict = Body(...), file_name: str = Body(None)):
    """更新沙箱中的模块配置"""
    # 如果指定了文件名，先执行沙箱同步
    if file_name:
        global_source = BASE_DIR / "resources" / "modules" / file_name
        data_manager.ensure_module_in_project(project_id, file_name, global_source)
    
    success = data_manager.update_component(project_id, module_uuid, payload)
    return {"status": "success" if success else "error"}

@app.get("/api/v1/models/{project_id}/abilities")
def get_abilities_api(project_id: str):
    """获取机器人的 Ability(能力/能力算法) 配置数据"""
    return data_manager.get_ability(project_id) or {}

@app.patch("/api/v1/models/{project_id}/abilities")
def update_abilities_api(project_id: str, payload: dict = Body(...)):
    """更新机器人的能力配置"""
    success = data_manager.update_ability(project_id, payload)
    return {"status": "success" if success else "error"}

@app.post("/api/v1/models/{project_id}/compile")
def compile_cmodel_api(project_id: str):
    """
    模型编译导出接口
    1. 收集沙箱中所有模块配置。
    2. 重组为完整的 CompDesc.json。
    3. 调用 skills_v2 编回二进制 .cmodel。
    """
    print(f"DEBUG: Entering compile_cmodel_api for {project_id}", flush=True)
    try:
        p_dir = data_manager.get_project_dir(project_id)
        blueprint_path = str(p_dir / "blueprint_CompDesc.json")
        fname = f"{project_id}_packed.cmodel"
        output_cmodel = str(p_dir / fname)
        
        # 核心逻辑：Blueprint -> Protobuf 补全 -> 二进制编码
        audit_log = encode_cmodel(blueprint_path, output_cmodel)
        
        return {
            "status": "success",
            "download_url": f"/downloads/{project_id}/{fname}",
            "audit": audit_log
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/resources/boards")
def list_boards_api():
    """实时解析 docs/reference 下的 board_desc 描述，用于配置控制板物理接口"""
    boards = []
    host_dir = BASE_DIR.parent / "docs" / "reference" / "ModuleLibrary" / "board_desc" / "host"
    if host_dir.exists():
        for f in host_dir.glob("*.json"):
            try:
                with open(f, "r", encoding="utf-8") as file:
                    data = json.load(file)
                    board_id = list(data.keys())[0]
                    info = data[board_id].get("基本信息", {})
                    boards.append({
                        "id": board_id,
                        "name": info.get("name"),
                        "desc": info.get("desc"),
                        "full_data": data[board_id]
                    })
            except: pass # 容错跳过损坏的文件
    return boards

from core import data_manager, resource_adapter

@app.get("/api/v1/resources/modules")
def list_modules_api():
    """
    获取全局资源库的所有模块列表。
    支持：
    - 聚合展示：聚合 .xml (语义化模板) 与 .json (协议原生) 数据。
    - 自动转换：调用 resource_adapter 将 XML 转为系统内部 JSON 格式。
    - 分类过滤：按子系统 (subSysType) 进行归类。
    """
    entities = {}
    flat_path = Path(BASE_DIR / "resources" / "modules")
    
    # 1. 扫描资源目录，建立索引 (stem -> {json, xml})
    all_files = list(flat_path.glob("*"))
    base_map = {} 
    for f in all_files:
        if f.suffix not in [".json", ".xml"]: continue
        stem = f.stem
        if stem not in base_map: base_map[stem] = {"json": None, "xml": None}
        base_map[stem][f.suffix[1:]] = f

    # 2. 构建聚合后的实体信息
    for stem, formats in base_map.items():
        try:
            data_json = None
            data_xml = None
            
            # 载入 JSON 格式
            if formats["json"]:
                with open(formats["json"], "r", encoding="utf-8") as file:
                    data_json = json.load(file)
            
            # 载入并转换 XML 格式
            if formats["xml"]:
                data_xml = resource_adapter.xml_to_component_json(str(formats["xml"]))
            
            # 优先使用 XML 渲染出的数据作为元数据源
            primary = data_xml or data_json
            sys_name = "Other"
            try:
                comp = (primary.get("moduleComponets") or [])[0]
                sys_name = comp.get("generalAttr", {}).get("subSysType", {}).get("comboType", {}).get("typeKey") or "Other"
            except: pass
            
            if sys_name not in entities: entities[sys_name] = []
            
            entities[sys_name].append({
                "module_id": stem,
                "moduleGroupName": primary.get("moduleGroupName", stem),
                "system": sys_name,
                "has_json": formats["json"] is not None,
                "has_xml": formats["xml"] is not None,
                "data_json": data_json,
                "data_xml": data_xml,
                "file_name": formats["xml"].name if formats["xml"] else formats["json"].name
            })
        except Exception as e:
            print(f"DEBUG: Skipping invalid module {stem}: {e}", flush=True)

    return entities

from core.schema_manager import schema_manager

@app.get("/api/v1/schemas")
def get_schemas_api():
    """
    获取基于 XML 定义的组件元数据注册表。
    前端根据此注册表动态呈现分类、私有属性和接口，支持“配置即开发”。
    """
    # 每次请求重新加载，确保用户增加 XML 文件后能立即看到效果
    schema_manager.load_all()
    return schema_manager.get_registry()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
