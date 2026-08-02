# AMR Studio V4 不必要目录清理验证报告

## 清理依据

- 项目文档和回归命令统一使用 `src/backend/.venv310`，未发现对 `src/backend/.venv` 的有效引用。
- `__pycache__` 和 `.pytest_cache` 是可重建缓存，不属于源代码或模型成果物。
- `proj_357e3b7b`、`proj_5d6a5dc8`、`proj_baba18ea`、`proj_e20e48a5` 是本次联调中的失败或中间项目。
- `proj_8ce2b8ce` 是最终通过字段级验证的成果物项目，必须保留。

## 已删除

- `src/backend/.venv`：未使用的 Python 3.14 虚拟环境，约 12 MB。
- 根目录 `.pytest_cache`。
- 项目源码和技能目录中的 `__pycache__`。
- 四个联调中间项目，共约 18.4 MB：
  - `src/backend/saved_projects/proj_357e3b7b`
  - `src/backend/saved_projects/proj_5d6a5dc8`
  - `src/backend/saved_projects/proj_baba18ea`
  - `src/backend/saved_projects/proj_e20e48a5`

## 明确保留

- `src/backend/.venv310`：当前测试和运行环境。
- `src/backend/saved_projects/proj_8ce2b8ce`：最终无损联调成果物。
- `artifacts`：用户要求保留的解析、构建和中间验证产物。
- `dist`：已打包的三个 cmodel skill。
- `node_modules` 和 `src/frontend/node_modules`：当前构建依赖；本次不作为无效目录处理。

## 废弃后端目录退役

在确认活动代码、测试、审计脚本和 Skill 不再依赖旧导入路径后，以下内容先归档再删除：

- `src/backend/core`
- `src/backend/skills_v2`
- `src/backend/app/services`
- `src/backend/app/legacy`
- `src/backend/skills`
- `src/backend/schemas`
- `src/backend/templates`
- `src/backend/package_templates.py`
- `src/backend/factory_template.zip`

归档：`artifacts/archives/backend_deprecated_code_before_removal_20260802.zip`。

归档 SHA-256：`e7c66a0d802ef5177d29028440475c21b5d2d8426c5501f0831b01d90a8a610f`。

压缩包共记录 102 个条目，`unzip -t` 验证无损坏。详细删除前后证据见 `docs/verification/DEPRECATED_BACKEND_REMOVAL_VERIFICATION_20260802.md`。

## 回归验证

执行：

```bash
PYTHONPATH=src/backend src/backend/.venv310/bin/python \
  -m unittest discover -s tests/unit -p 'test_*.py'
```

删除前结果：`62 tests / 62 passed`。

删除后结果：`63 tests / 63 passed`；新增测试用于确保废弃目录不再出现。

测试完成后再次删除测试生成的 `__pycache__`。最终验证项目、文档、技能包和中间成果目录均存在。

## 结论

本次清理删除了确定性缓存、中间项目和已完成迁移的废弃后端目录，没有删除运行环境、用户成果物或调试数据。废弃源码已保存在校验通过的归档包中，删除后的后端测试、前端构建和真实 cmodel 语义往返均通过。
