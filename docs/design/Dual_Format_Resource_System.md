# 双态资源驱动系统 (Dual-State Resource Engine) 设计文档

## 1. 目标
实现 `backend/resources/modules/` 目录下资源的双格式支持（JSON/XML）。旨在提升资源库的人类可读性（XML），同时保持系统协议的稳定性（JSON）。

## 2. 物理存储标准
- **JSON 态**: 原始导出格式，1:1 对齐 Protobuf。
- **XML 态**: 语义化描述格式。
  - **标签映射**: `<ModuleGroup>` -> 根对象；`<Param>` -> `SmartAttribute` 元素。
  - **自动补全**: XML 解析器在加载时需自动补全 JSON 中冗余的元数据字段（如 `boolParse: true`）。

## 3. 后端处理流水线 (The Pipeline)
1. **Request(fileName)** -> 系统定位物理文件。
2. **IF (endsWith(".xml"))**:
   - 调用 `XML_TO_JSON_Adapter`。
   - 解析 XML DOM。
   - 根据预设模板补全 Protobuf 必填字段。
3. **ELSE (endsWith(".json"))**:
   - 直接 `json.load()`。
4. **Output**: 返回一致的 JSON Payload 给前端和构建引擎。

## 4. 优势
- **跨系统通用**: 即使换了非 AI 环境，工程师也能通过修改 XML 轻松定制组件库。
- **无损性**: 所有的修改最终都会被“降级”为标准的 Protobuf JSON 进行导出。
