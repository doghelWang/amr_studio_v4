# AMR Studio V4 后端组织架构重整实施报告

## 1. 重整目标

本次重整将历史叠加的 `main.py + app/services + core + skills_v2` 组织方式收敛为单向依赖的分层架构，并在完成调用迁移和回归验证后结束旧导入路径兼容。模型数据处理遵循以下硬约束：

- 不根据名称或字符串内容猜测参数、类型、关系或默认值；
- Proto、参考 cmodel、模板、人工规范和 unknown 必须分开；
- 不静默忽略未知 protobuf 字段；
- 导入模型未经明确编辑时，前端往返后应保持 protobuf 字段语义一致；
- 文件大小和 ZIP 哈希仅作为辅助信息，不作为一致性结论。

## 2. 最终目录职责

```text
src/backend/
  app/
    api/                  FastAPI 路由与 HTTP 错误映射
    application/          导入、编辑、编译、项目管理等用例
    domain/modeling/      组件映射、模块组、字段来源、诊断规则
    infrastructure/
      artifacts/          调试中间产物
      projects/           项目仓库和原子文件写入
      protobuf/           cmodel 编解码、拆分、正式 pb2
      resources/          模板、XML、schema 资源访问
    schemas/              HTTP DTO
  main.py                 薄启动和历史测试兼容入口
```

允许的主要依赖方向：

```text
api -> application -> domain
                   -> infrastructure
infrastructure.protobuf -> protobuf.generated
```

自动化边界测试明确禁止：

- `application/domain/infrastructure` 依赖 FastAPI；
- 活动 `app` 代码依赖 `core` 或 `skills_v2`；
- `domain/infrastructure` 反向依赖 `app.api`。

## 3. 已完成迁移

### HTTP 与应用层

- `app/api/http.py` 负责应用工厂、路由、CORS、静态下载和 HTTP 异常适配。
- `main.py` 仅保留 `app/create_app/compile_cmodel_api` 等兼容导出。
- 编译、导入、项目管理、组件编辑、资源目录、模块清单和系统信息迁入 `app/application`。
- 应用层使用 `ApplicationError` 体系，不再直接抛出 `HTTPException`。

### 领域层

- 通用属性、私有属性、接口、模块组、类别映射、能力导出、字段来源和 fallback 诊断迁入 `app/domain/modeling`。
- 领域逻辑不直接读取 HTTP 请求，也不直接操作生成的 pb2 类。

### 基础设施层

- 项目仓库与 `data_manager` 迁入 `app/infrastructure/projects`。
- cmodel 编码、解码、拆分和正式生成的 pb2 迁入 `app/infrastructure/protobuf`。
- 模板、XML、schema 加载迁入 `app/infrastructure/resources`。
- 调试产物输出迁入 `app/infrastructure/artifacts`。

### 兼容层退役

- 测试、系统审计脚本、Skill 和后端入口已全部切换到 `app.application`、`app.domain`、`app.infrastructure`。
- 在删除前执行了导入扫描、编译、`62/62` 后端测试、前端生产构建和真实 `0323.cmodel` 语义往返验证。
- `core`、`skills_v2`、`app/services`、`app/legacy` 及无调用的后端旧 Skill/模板脚本已归档后物理删除。
- 归档位置：`artifacts/archives/backend_deprecated_code_before_removal_20260802.zip`。
- 删除后新增架构门禁，禁止上述废弃目录重新出现；后端回归为 `63/63` 通过。

## 4. 重构中发现并修复的问题

### 字符串值被修改

旧编码器会对 `key/desc/typeDesc/stringValue` 等字段执行 `.strip()`，实际导致参考模型中的 `" NO"` 被改为 `"NO"`，仅含换行或制表符的值被清空。现已删除字符串裁剪，protobuf 支持的原始字符串按原值编码。

### 模块层级被扁平化

旧 `standardize_sys_tree` 会清空根模块组信息并递归扁平化 `moreModuleInfo`。该行为没有 Proto 或人工规范依据，现已从主生成链路删除。

### 拆分文件名依赖业务字段

旧拆分器把模块名称和 UUID 拼入文件名，并在缺失时使用 `unknown`。这既引入名称推断，也有特殊字符路径风险。现改为 `module_000000.json` 形式的内部序号；原组件内容不变。

### 仓储从文件名推断 UUID

组件读写原先通过 `glob("*UUID*.json")` 定位文件，与旧拆分命名耦合。现改为读取模块 JSON 中明确的 `generalAttr.moduleUuid`，重复 UUID 会阻断而不是任取一个文件。

### 导入项目被误判为新建项目

前端使用 `projectId.startsWith("import_")` 判断来源，但上传接口实际返回 `proj_*`，导致导出时全量重建并覆盖原始组件属性。现改为依据导入时明确存在的 `rawCompDescMeta` 判断来源。

### 导入项目被前端简化视图覆盖

导入后再次调用 `init-sandbox` 会用前端投影视图重建 `CompDesc`，曾产生 1648 处字段/结构差异。现规定：

- 导入项目直接编译上传后保留的后端沙箱；
- 新建项目才调用 `init-sandbox`；
- 属性面板的明确编辑继续通过组件 PATCH 写入沙箱；
- 不再在导出时用简化视图全量覆盖导入模型。

### AbiSet 类型体系交叉污染

前端重复同步能力时把 CompDesc 类型 `DATA_STRING` 写入 AbiSet，而 AbiSet Proto 需要 `STRING_E`。现删除重复能力 PATCH：新建项目由后端 ABI 专用映射器生成；导入项目保留 `rawAbiSet`。

## 5. 当前维护策略

- 新代码必须从 `app.application`、`app.domain`、`app.infrastructure` 导入。
- 禁止恢复 `core`、`skills_v2`、`app/services`、`app/legacy` 作为第二条实现链路。
- 如需追溯旧实现，只读取归档包，不将归档代码直接复制回活动目录。
- 架构边界和废弃目录不存在性由 `tests/unit/test_architecture_boundaries.py` 自动验证。

## 6. 当前结论

后端活动代码的组织重整和旧目录退役已经完成，主解析、编辑、编译和资源路径均已归入明确分层，自动化边界测试已建立。废弃代码已先压缩归档、校验，再从源代码树物理删除；当前不存在新旧双轨实现。

非阻断工程待办：

- 为前端补齐正式 ESLint 依赖与规则；当前 `npm run lint` 因未安装 `eslint` 无法运行。
- 前端生产包约 1.49 MB，Vite 提示单 chunk 超过 500 kB，可后续按向导步骤拆包。
- 为安装坐标和连线编辑建立显式 dirty patch 清单，进一步统一所有导入模型编辑的增量提交策略。
