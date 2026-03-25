# 资源库扁平化与元数据驱动重构方案

## 1. 目标描述

将现有的基于目录（`ModuleEntity/SensorSys/Internal/...`）的资源分类逻辑，重构为基于文件内置元数据的"扁平�?管理模式。用户只需将模�?JSON 放入统一目录，系统自动识别其所属子系统与类型�?
## 2. 改进设计

### 📂 目录结构调整
- **旧模�?*: `docs/reference/ModuleLibrary/ModuleEntity/[System]/Internal/*.json`
- **新模�?*: `backend/resources/modules/*.json` (统一存放，不分文件夹)

### 📄 资源文件规范 (JSON)
每个资源文件将包含一个标准的元数据头（Metadata Header），或者直接从现有�?Protobuf 结构中提取核心字段。建议采用以下增强格式：
```json
{
  "moduleGroupName": "设备显示名称",
  "system": "SensorSys",
  "category": "LASER",
  "full_data": { 
     /* 完整的业�?JSON 数据 */ 
  }
}
```

## 3. 拟定变更

### Backend [MODIFY]
- **`main.py`**: 修改 `list_modules_api`，从 `backend/resources/modules/` 目录进行单层全量扫描，并根据 JSON 内部�?`system` 字段进行分组返回�?
### Frontend [ADAPT]
- **`ComponentLibraryStep.tsx`**: 适配后端返回的新格式（如果后端仍返回按系统分组的对象，则前端无需改动）�?
### Docs [NEW]
- **`demo_module.json`**: 提供标准模板，指导人工添加新模块�?
## 4. 验证计划
1.  **手动添加**: �?`demo_module.json` 放入新目录，验证网页端能否识别�?2.  **系统切换**: 更改 `demo_module.json` 中的 `system` 字段，验证其是否在向导的不同步骤中正确出�?隐藏�?
