# AMR Studio V4 双目录深度走查、合并与清理验证报告

## 1. 任务范围

- 对比来源目录：`/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4`
- 最终统一目录：`/Users/wangfeifei/code/amr_studio_v4`
- 对比共同基线：`be92fa68128b04a20e3ecef7c94ad15003d4ce02`
- 来源分支：`codex/worker-node-server-deploy`，检查时 HEAD 为 `fb03e49e`
- 目标分支：`codex/ts-backend-runtime-20260704`，检查时 HEAD 为 `ee0da559`
- 执行原则：保留目标目录已有文档、模型、保存项目、TS 后端和边缘视觉插件；只归档并删除经依赖扫描和回归验证确认不再使用的旧实现。

本次没有通过名称推断模块事实，也没有创建模型参数、连接或描述。所有数据一致性结论均来自 Proto 解码结果和自动化字段比较。

## 2. 深度对比结论

### 2.1 后端架构

来源目录的 Python 后端已经形成 canonical 分层：

1. `src/backend/app/api`：HTTP 适配层。
2. `src/backend/app/application`：导入、编译、编辑、项目管理等用例。
3. `src/backend/app/domain/modeling`：模型映射、字段来源策略、模块组构建。
4. `src/backend/app/infrastructure`：项目存储、资源模板、protobuf 编解码、调试成果物。
5. `src/backend/app/schemas`：请求模型。

目标目录原先同时保留 `core`、`skills_v2`、旧 `skills`、旧 `schemas` 和多份临时解析脚本，存在同一职责多套实现、Proto stub 重复、维护入口不唯一的问题。合并后，`src/backend/app` 与来源 canonical 目录逐文件比较一致；仅来源目录多出无功能意义的 `.DS_Store`。目标 `main.py` 在 canonical 薄入口基础上额外保留了 `--host/--port` 命令行参数支持，以兼容 `start.py` 的现有启动方式。

### 2.2 目标目录独有能力

以下目标目录能力被保留并与 canonical 代码整合，没有被来源目录覆盖删除：

- `src/backend_ts` TypeScript 后端。
- `cloudflare` Worker/Node 兼容运行时。
- 边缘视觉插件、飞书资料、RCS/TAS 分析成果。
- 目标目录已有 `saved_projects`、`project_bases`、用户保存数据和模型验证成果。
- 前端动态后端切换能力及目标目录独有页面组件。

### 2.3 前端合并

- 合入来源目录的电气连接、能力、审计、器件属性、动力链和领域逻辑重构。
- 保留目标目录动态后端配置，并使 `api_v2.ts`、上传、欢迎页和侧边栏统一使用运行时后端地址。
- `ElectricalInterfaceMatrixStep` 改为调用 canonical `buildElectricalConnections`，去除已删除旧连接构建函数的依赖。
- `ImportService` 改为读取 Proto 中 `structParam.extendParams.parentNodeUuid.comboType.typeKey`，不再把模块组遍历参数当作真实父级。
- 基于 `relate*` 和接口连接生成的动力链槽位只用于界面辅助，不再覆盖源模型 `parentNodeUuid`。

## 3. 已归档和删除的废弃内容

删除前已生成两份 ZIP，且均通过 `unzip -t` 完整性测试：

- `artifacts/merge_backups/20260802_before_canonical_merge_deprecated_backend.zip`
  - SHA-256：`f53212add317501f9a1b4a6780e1aa735c7becb5d3035590c44926c7b33e75aa`
- `artifacts/merge_backups/20260802_legacy_support_and_generated.zip`
  - SHA-256：`8adaf6e1a88c35d3e7e8744414f739beb070131097bbb75694ca4c7bac2f9419`

另外保存了合并前 tracked diff、状态、未跟踪清单、Git 元数据和逐文件覆盖备份，位置统一为 `artifacts/merge_backups/`。

已删除且运行依赖扫描为零的内容：

- `src/backend/core`
- `src/backend/skills_v2`
- `src/backend/skills`
- `src/backend/templates`
- 旧 `src/backend/schemas`
- 旧 dump/inspect/package 临时脚本和重复模板 ZIP
- 根目录旧 `backend` Proto 副本
- 根目录旧 `frontend/.vite` 缓存
- 前端源码目录误生成的 `.d.ts/.map`
- Python `__pycache__`/`.pyc`

历史审计文档中的旧路径引用被保留，因为它们是历史问题证据；项目级 `AGENTS.md` 已更新为当前 canonical 架构，避免后续开发继续引用已删除目录。

## 4. 数据失真问题与修复依据

### 4.1 Worker 使用了非权威 Proto 副本

问题：Worker 原先维护了 `cloudflare/proto` 三份替代定义，它们与用户提供的 `specifications/protocols` 不一致。该副本最初遗漏 oneof，后续手工补齐又会引入用户 Proto 未定义的内容，两种方式都违反 Proto 唯一事实源约束。

最终修复：

- 删除 `cloudflare/proto` 全部副本，不再创建第二套 `.proto`。
- `scripts/generate_protobuf_bindings.sh` 直接读取用户提供的三份 Proto，生成 Python `_pb2.py` 和 Worker JS/TS bindings。
- `cloudflare/generated/PROTO_SOURCE.sha256` 固化输入文件哈希，便于部署审计。
- Python `_pb2.py` 与 `protoc 32.0` 从用户 Proto 重新生成结果逐字节一致。
- Worker bindings 与 `pbjs/pbts` 从用户 Proto 重新生成结果逐字节一致。

依据仅为用户提供的 `specifications/protocols/*.proto`，没有补写、猜测或创造 Proto 字段。

### 4.2 前端属性投影覆盖原始 Proto 元数据

问题：导出层把每个前端属性重新构造成完整 protobuf 对象。即使用户只修改一个字符串，也会替换嵌套 combo 数组并丢失未投影到表单的 min/max/oneof 元数据。修复 oneof 后首次编辑回归仍检测到 129 项非预期变化。

修复：新增 `patchRawAttribute` 差异补丁机制。对已有 `rawCmodelComponent`：

- 只更新前端值与原始值确实不同的字段。
- 约束字段按原始 oneof 字段名回写。
- combo group 和嵌套元素按 key 递归合并，不替换未修改数组元数据。
- 未修改的原始字段保持原样。
- 新建模块没有原始对象时，仍走完整 Proto 映射。

### 4.3 别名和父级关系的附带改写

- 当源 `moduleDesc` 为空时，前端显示名回退到 `moduleName`。旧导出逻辑会把该显示回退值写成新的 `moduleDesc`。现改为与“原始投影值”比较，未编辑时不创建描述。
- AOBO 模型导入后，旧“深度发现”逻辑把显式关联关系转换成新的父子层级并写回。现只建立 UI 槽位，不改源 `parentNodeUuid`。

### 4.4 init-sandbox 覆盖 AbiSet 和 FuncDesc

问题：上传接口已经正确解码并保存三份模型，但前端随后初始化 sandbox 时，如果请求只带 CompDesc 投影，旧逻辑会用空对象覆盖导入时保存的 AbiSet/FuncDesc，最终 ZIP 缺少 `FuncDesc.model`。

修复：`buildSandboxRecord` 改为未提交即不修改。只有请求显式提交对应原始数据或功能流程时才更新；否则保留 imported sandbox 的 AbiSet、FuncDesc 和 `rawFuncDesc`。能力编辑继续通过专用 PATCH 接口生效。

## 5. 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| Python 后端单元/API 回归 | PASS | `65 passed, 10 subtests passed` |
| Python canonical app 对比 | PASS | 与来源目录一致，仅来源多 `.DS_Store` |
| 废弃目录运行依赖扫描 | PASS | canonical 运行代码引用为 0 |
| 前端生产构建 | PASS | 3189 modules transformed |
| TypeScript 后端构建 | PASS | `npm run build` |
| Worker TypeScript 检查 | PASS | `tsc --noEmit cloudflare/worker.ts` |
| 前端属性投影回归 | PASS | `frontend_property_projection_regression: PASS` |
| 未知字段保留回归 | PASS | `export_unknown_fields_regression: PASS` |
| 0323 无编辑严格回归 | PASS | 20 模块，CompDesc/AbiSet/FuncDesc 内容差异 0 |
| 1234 无编辑严格回归 | PASS | 20 模块，CompDesc/AbiSet/FuncDesc 内容差异 0 |
| AOBO 无编辑严格回归 | PASS | 44 模块，CompDesc/AbiSet/FuncDesc 内容差异 0 |
| 0323 编辑严格回归 | PASS | CompDesc 仅 `chipPlatform` 和指定接口连接变化；AbiSet/FuncDesc 不变 |
| 0323 Python 服务真实上传/构建/下载 | PASS | CompDesc、AbiSet、FuncDesc protobuf 语义一致 |
| 两份删除前归档完整性 | PASS | `unzip -t` 无错误 |

验证产物位于 `artifacts/merge_validation_20260802/`。导出文件字节数可能与源文件不同；ZIP 元数据、条目顺序、压缩结果和 protobuf 编码顺序都可影响字节大小，因此本报告只用解码后的字段和语义比较判定数据一致性。

前端构建仍有单包大于 500 kB 的 Vite 警告，不影响本次功能验证，但属于后续性能优化项。

## 6. 最终结论与剩余事项

代码已经统一到 `/Users/wangfeifei/code/amr_studio_v4`。Python 后端只保留 canonical 分层实现，已确认不依赖被删除目录；目标目录独有的 TS 后端、Worker、前端动态切换、文档和模型成果均已保留。

本次清除了 Worker 非权威 Proto 副本，并修复属性全对象覆盖、空描述创建、父级关系误改写和 sandbox 丢失 AbiSet/FuncDesc 四类数据失真。当前严格回归证明 0323 编辑流程只有两项显式 CompDesc 修改，0323/1234/AOBO 的 CompDesc、AbiSet、FuncDesc 内容均零差异。

后续建议：

1. 增加新建模块场景的每类私有属性、接口属性和复合属性 Proto 覆盖矩阵。
2. 对前端大包实施按步骤页面动态加载，降低初始 JS 体积。
3. 持续将新参考模型加入三模型严格回归矩阵。
