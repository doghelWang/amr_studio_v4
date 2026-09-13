# 后端模块化重构验证报告

日期：2026-04-22
阶段：项目持久化接口服务化后回归验证
范围：`saved-list / save / load` 抽离后的最小回归验证
结论：通过

## 1. 验证目的

在项目持久化相关接口从 `main.py` 抽离到 `project_service.py` 后，确认：

- 后端主业务链路仍稳定
- 项目服务化没有影响 upload / compile / proto 对齐
- 可以继续推进下一层后端模块化

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
- `Ran 4 tests in 0.157s`

### 3.2 后端 API E2E

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
```

结果：

- 通过
- `Ran 1 test in 0.195s`

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

- `saved-list / save / load` 服务化未破坏现有主链路
- 当前后端应用服务已覆盖以下主流程：
  - 项目沙箱初始化
  - `.cmodel` 上传导入
  - 项目编译导出
  - 用户项目保存与读取

## 5. 进入下一步的条件判定

判定结果：满足

建议下一步：

- 继续压薄 `main.py`
- 为模型更新接口补应用服务边界
- 视情况引入最小请求/响应 DTO
