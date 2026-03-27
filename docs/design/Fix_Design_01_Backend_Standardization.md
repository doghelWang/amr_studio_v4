# Fix-01: 后端数据交互标准化与上传/拆分逻辑修复设计方案

## 1. 现状问题分析
1.  **命名空间污染**：`main.py` 中的 `convert_keys` 手动将 Proto 的 `snake_case` 转为 `camelCase`。这在 `ParseDict` 回灌数据时会导致 `Unknown Field` 错误，因为 Protobuf 定义严格依赖原始字段名。
2.  **生命周期 Bug**：`upload_cmodel` 接口在 `finally` 块中删除了 `temp_dir`，而 `data_manager.init_project` 之前只是简单引用或不完全复制，导致后续 `GET /components` 无法读取到被拆分的模块文件。
3.  **能力集 (AbilitySet) 缺失**：后端路由未暴露 `AbiSet.json` 的读写接口，导致前端无法实现第 5 步（AbilityStep）。

## 2. 修复方案设计

### 2.1 数据交换协议标准化
- **方案**：废弃手动转换函数。统一使用 `google.protobuf.json_format` 的 `MessageToDict` 和 `ParseDict`。
- **配置**：
  - `including_default_value_fields=True`: 确保前端拿到完整结构，便于生成表单。
  - `preserving_proto_field_name=True`: 保持与 `.proto` 文件完全一致的字段名（Snake Case）。
- **前端适配提示**：前端 `ImportService` 需统一处理 Snake Case 到 Store 内部 Model 的映射。

### 2.2 存储模型优化 (DataManager)
- **物理持久化**：`data_manager.init_project` 将执行“强制物理搬迁”。
- **目录结构**：
  ```
  saved_projects/{project_id}/
    ├── blueprint_CompDesc.json
    ├── AbiSet.json
    ├── modules/
    │    └── module_{name}_{uuid}.json
    └── ... (original .model files for rebuilding)
  ```

### 2.3 补齐 AbilitySet API
- 增加 `GET /api/v1/models/{project_id}/abilities`
- 增加 `PATCH /api/v1/models/{project_id}/abilities` (全量或差分更新)

## 3. 核心修复伪代码

### Backend `main.py`
```python
@app.post("/api/v1/models/upload")
async def upload_cmodel(file: UploadFile):
    # ... 解压逻辑 ...
    # 统一使用原生解码器生成的 JSON，不再转换 key
    with open(comp_desc_json, "r") as f:
        full_json = json.load(f) # 已经是 snake_case
    
    # 物理持久化存储
    data_manager.init_project(project_id, blueprint, split_out_modules_dir, abi_set_json_path)
    
    return { "project_id": project_id, "full_json": full_json }
```

### Backend `data_manager.py`
```python
def init_project(project_id, blueprint, modules_dir, abi_json_path):
    p_dir = get_project_dir(project_id)
    # 1. 递归创建目录
    # 2. 物理复制所有模块 JSON 到 p_dir/modules/
    # 3. 复制 AbiSet.json 到 p_dir/
    # 4. 复制所有 .model 到 p_dir/ (用于后续 compile)
```

## 4. 验证计划 (Test Cases)
1.  **同构校验**：上传 `ModelSet39.cmodel`，检查返回的 `full_json` 键名是否包含 `module_uuid` 而非 `moduleUuid`。
2.  **持久化校验**：重启后端服务，调用 `GET /components/{uuid}` 验证文件是否依然存在。
3.  **能力集校验**：调用新 API `GET /abilities` 验证是否能正确读取 `AbiSet.json`。
