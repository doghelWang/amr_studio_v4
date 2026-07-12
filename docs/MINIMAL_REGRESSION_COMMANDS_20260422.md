# AMR Studio V4 最小回归命令集

日期：2026-04-22
用途：Sprint 1 每次重构提交前后的最小检查
约束：只记录当前仓库里已有、且可以从现有代码与测试入口推导出来的命令；不创造不存在的脚本名或假设性流水线。

## 1. 使用原则

- 每次涉及协议映射、后端编译、Import/Export、Schema 适配的改动，都至少运行一组最小回归。
- 提交前优先执行“后端回归 + 严格 proto 对齐”。
- 只有在变更触及前端导入导出语义时，才追加 TypeScript 协议测试。

## 2. 回归分层

### 层 1：后端关键回归

目的：

- 验证 compile/export/API 主链路未坏

命令：

```bash
python3 -m unittest tests.unit.test_backend_export_regressions
python3 -m unittest tests.unit.test_backend_api_e2e
```

覆盖：

- `deep_update` 行为
- compile 读取 live blueprint/modules
- 缺失 blueprint 报错
- 上传 -> PATCH -> 编译 -> 回读链路

入口依据：

- [test_backend_export_regressions.py](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/tests/unit/test_backend_export_regressions.py:1)
- [test_backend_api_e2e.py](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/tests/unit/test_backend_api_e2e.py:1)

### 层 2：严格 Proto 对齐

目的：

- 验证导出映射没有因为“兼容修补”静默漂移

命令：

```bash
python3 -m unittest tests.unit.test_protobuf_export_alignment
```

覆盖：

- `proto_final_sync`
- ability 类型映射
- `ParseDict(ignore_unknown_fields=False)` 严格对齐

入口依据：

- [test_protobuf_export_alignment.py](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/tests/unit/test_protobuf_export_alignment.py:1)

### 层 3：TypeScript 协议回归

目的：

- 验证 Import/Export/roundtrip 的前端协议层行为未坏

建议命令：

```bash
cd tests && npm run build
node dist/cmodel_test_runner.js ../CompDesc.json
```

说明：

- 该入口来自现有 `tests/package.json`
- 当前默认目标文件为 `../CompDesc.json`
- 若团队后续要将其纳入常绿回归，必须先统一这个输入文件在仓库中的正式落点

入口依据：

- [tests/package.json](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/tests/package.json:1)
- [cmodel_test_runner.ts](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/tests/cmodel_test_runner.ts:815)

## 3. Sprint 1 推荐执行组合

### 每次后端改动

```bash
python3 -m unittest tests.unit.test_backend_export_regressions
python3 -m unittest tests.unit.test_protobuf_export_alignment
```

### 每次改动上传/编译/API 流程

```bash
python3 -m unittest tests.unit.test_backend_export_regressions
python3 -m unittest tests.unit.test_backend_api_e2e
python3 -m unittest tests.unit.test_protobuf_export_alignment
```

### 每次改动前端 Import/Export 契约

```bash
python3 -m unittest tests.unit.test_protobuf_export_alignment
cd tests && npm run build
node dist/cmodel_test_runner.js ../CompDesc.json
```

## 4. 当前限制

- `ModelSet312` 相关测试和脚本存在，但样本路径当前未统一到仓库内团队公共位置。
- 部分历史脚本依赖个人绝对路径，不适合作为 Sprint 1 常绿回归命令。
- 因此本命令集只收录当前最稳、最可重复的入口。

## 5. 本周补齐目标

- 统一 `CompDesc.json` 输入样本的正式仓库落点
- 统一 `ModelSet312` 基线文件的正式仓库落点
- 在此基础上升级 TypeScript 回归为真正常绿命令

## 6. 禁止事项

- 不允许写入仓库中不存在的脚本命令
- 不允许依赖个人机器路径作为团队默认命令
- 不允许把“手工步骤描述”伪装成自动化回归命令
