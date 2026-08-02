# 后端模块化重构验证报告

日期：2026-04-22
阶段：DTO 与异常处理收口前回归验证
范围：当前后端服务化状态的最小回归验证
结论：通过

## 1. 验证目的

在引入最小请求 DTO 和异常处理收口前，确认当前后端状态稳定。

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
- `Ran 4 tests in 0.135s`

### 3.2 后端 API E2E

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
```

结果：

- 通过
- `Ran 1 test in 0.182s`

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

- 当前后端状态稳定
- 可以继续推进请求边界与异常处理的收口
