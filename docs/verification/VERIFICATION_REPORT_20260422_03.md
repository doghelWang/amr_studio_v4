# 后端模块化重构验证报告

日期：2026-04-22
阶段：继续下一步拆分前回归验证
范围：当前后端应用服务化状态的最小回归验证
结论：通过

## 1. 验证目的

在继续拆分项目持久化相关接口前，确认当前后端状态稳定，避免在未验证基础上继续推进模块化重构。

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
- `Ran 4 tests in 0.128s`

### 3.2 后端 API E2E

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
```

结果：

- 通过
- `Ran 1 test in 0.169s`

### 3.3 严格 Proto 对齐

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment
```

结果：

- 通过
- `Ran 3 tests in 0.000s`

## 4. 结果摘要

本轮最小回归共执行 8 条测试，全部通过。

结论如下：

- 当前后端模块化状态稳定
- 可以继续推进下一步服务化拆分
- 建议本轮拆分目标聚焦于 `saved-list / save / load` 这组项目持久化接口
