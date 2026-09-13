# AMR Studio V4 黄金样本矩阵

日期：2026-04-22
用途：Sprint 1 回归护栏
约束：本清单只记录仓库内已存在、且已被代码、测试或文档引用过的真实样本；不允许通过猜测、创造、假想方式补造样本定义。

## 1. 选择原则

黄金样本必须满足以下至少一项：

- 已被自动化测试直接引用
- 已被后端实际编译/保存逻辑使用
- 已在文档和历史审计中作为对标基线反复出现

当前不纳入黄金矩阵的内容：

- 仅存在于个人绝对路径中的本地下载样本
- 没有被测试或代码明确引用的临时文件
- 无法确认来源和语义的历史产物

## 2. 样本矩阵

### Fixture A：`proj_8b800f1b`

路径：

- [proj_8b800f1b](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/backend/saved_projects/proj_8b800f1b)

已确认组成：

- `CompDesc.json`
- `AbiSet.json`
- `blueprint_CompDesc.json`
- `modules/*.json` 共 45 个

纳入理由：

- 被后端回归测试直接作为 `SAMPLE_PROJECT` 使用
- 被 API E2E 测试直接作为上传/编译/回读样本使用

当前引用：

- [test_backend_export_regressions.py](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/tests/unit/test_backend_export_regressions.py:22)
- [test_backend_api_e2e.py](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/tests/unit/test_backend_api_e2e.py:23)

建议用途：

- Sprint 1 主黄金样本
- 后端 compile/export 回归
- API 端到端回归

### Fixture B：`proj_88178706`

路径：

- [proj_88178706](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/backend/saved_projects/proj_88178706)

已确认组成：

- `CompDesc.json`
- `AbiSet.json`
- `blueprint_CompDesc.json`
- `modules/*.json` 共 44 个

纳入理由：

- 为完整保存项目，具备 sandbox 三件套与模块目录
- 与 `proj_aa859379` 结构相近，可用于观察重构后样本稳定性

建议用途：

- 次黄金样本
- 结构一致性验证
- blueprint/modules 读取逻辑回归

### Fixture C：`proj_aa859379`

路径：

- [proj_aa859379](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/backend/saved_projects/proj_aa859379)

已确认组成：

- `CompDesc.json`
- `AbiSet.json`
- `blueprint_CompDesc.json`
- `modules/*.json` 共 44 个

纳入理由：

- 与 `proj_88178706` 一样是完整项目样本
- 可作为结构对照组，减少单样本误判

建议用途：

- 次黄金样本
- 编译输入稳定性检查

### Fixture D：`ModelSet312` 基线

当前确认状态：

- 被多个文档和测试明确提及为对标基线
- 但仓库内当前未确认到统一、可直接引用的样本文件落点

当前引用：

- [FRONTEND_DATA_PARSING_SPEC_V1.0.md](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/docs/FRONTEND_DATA_PARSING_SPEC_V1.0.md:29)
- [test_parser_v25.py](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/tests/unit/test_parser_v25.py:5)
- [test_io.py](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/tests/unit/test_io.py:7)

处理策略：

- 作为“文档声明基线”保留
- 在 Sprint 1 中补齐统一落点前，不作为本周自动化常绿样本

结论：

- `ModelSet312` 不能被删除或弱化
- 但在样本文件落点未统一前，不应伪造路径或假定其可直接运行

## 3. Sprint 1 推荐分层使用方式

### 常绿样本

- `proj_8b800f1b`

适用：

- 后端单测
- API E2E
- compile/export 回归

### 结构对照样本

- `proj_88178706`
- `proj_aa859379`

适用：

- blueprint/modules 结构一致性
- 编译输入形态对比

### 文档基线

- `ModelSet312`

适用：

- 契约和协议对标说明
- 后续补齐统一落点后的 strict roundtrip

## 4. 本周行动项

- 将 `proj_8b800f1b` 标记为 Sprint 1 默认回归样本
- 以 `proj_88178706` 和 `proj_aa859379` 作为结构对照
- 单独整理 `ModelSet312` 的真实仓库落点，未确认前不写入自动化命令

## 5. 禁止事项

- 不允许新增“想象中的标准样本”
- 不允许在文档中把个人机器绝对路径当成团队统一样本路径
- 不允许在没有确认来源的情况下，为了让测试通过而替换黄金样本
