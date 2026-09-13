# 后端模块化重构验证报告

日期：2026-04-22
阶段：继续下一步重构前回归验证
范围：后端应用服务拆分后的最小回归验证
结论：通过

## 1. 验证目的

在继续下一步后端模块化重构之前，确认当前代码状态满足最小回归要求，避免在未稳定的基础上继续拆分。

本轮重点验证：

- `compile/export` 应用服务抽离后行为未变化
- `init-sandbox` 应用服务抽离后主链路未受影响
- 严格 Proto 对齐逻辑未被破坏

## 2. 验证环境

- Python 解释器：`src/backend/.venv310/bin/python`
- 工作目录：仓库根目录
- 验证时间：2026-04-22

## 3. 执行的回归用例

### 3.1 后端导出回归

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions
```

结果：

- 通过
- `Ran 4 tests in 0.122s`

覆盖重点：

- `deep_update` 嵌套分支补齐
- compile 使用实时 `blueprint/modules`
- 缺失 `blueprint_CompDesc.json` 的错误处理
- 编码输出保留项目级 `FuncDesc.model`

### 3.2 后端 API E2E

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
```

结果：

- 通过
- `Ran 1 test in 0.162s`

覆盖重点：

- 上传 `.cmodel`
- 组件 PATCH
- 编译导出
- 导出结果回读验证

### 3.3 严格 Proto 对齐

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment
```

结果：

- 通过
- `Ran 3 tests in 0.000s`

覆盖重点：

- `proto_final_sync`
- ABI/CompDesc 类型映射
- `ParseDict(ignore_unknown_fields=False)` 严格校验

## 4. 结果摘要

本轮最小回归共执行 8 条测试，全部通过。

结论如下：

- 当前后端模块化试点未破坏主业务链路
- 现有 `compile/export` 与 `init-sandbox` 抽离可以视为稳定基础
- 可以在此基础上继续推进下一步后端模块化重构

## 5. 进入下一步的条件判定

判定结果：满足

允许继续的下一步工作：

- 将 `upload` 流程抽离到应用服务
- 继续压薄 `main.py`
- 在后续每轮继续前重复执行本级别回归验证
