# 后端模块化重构验证报告

日期：2026-04-22
阶段：查询型接口与配置收口后回归验证
范围：`system/version`、`resources/boards`、`schemas` 服务化以及配置模块引入后的最小回归验证
结论：通过

## 1. 验证目的

在查询型接口和配置常量从 `main.py` 收口之后，确认：

- 后端主业务链路仍稳定
- `main.py` 继续变薄后没有破坏测试兼容性
- 严格 Proto 对齐逻辑未受影响

## 2. 验证环境

- Python 解释器：`src/backend/.venv310/bin/python`
- 工作目录：仓库根目录
- 验证时间：2026-04-22

## 3. 首次回归发现的问题

本轮第一次回归未一次性通过，发现两个真实问题：

### 问题 1：`BackgroundTasks` 残留引用

现象：

- `main.py` 导入已清理，但 `upload` 路由签名仍保留 `BackgroundTasks`
- 导致测试导入 `main` 时出现 `NameError`

处理：

- 移除 `upload` 路由中已经失效的 `BackgroundTasks` 参数

### 问题 2：测试兼容全局缺失

现象：

- API E2E 仍引用 `main.SAVED_PROJECTS_DIR`
- 这一轮路径配置收口到 `CONFIG` 后，该兼容入口消失

处理：

- 在 `main.py` 中恢复兼容性导出：
  - `SAVED_PROJECTS_DIR = CONFIG.saved_projects_dir`
  - `USER_SAVES_DIR = CONFIG.user_saves_dir`

说明：

- 这是兼容层恢复，不改变新的配置收口方向

## 4. 修复后的回归结果

### 4.1 后端导出回归

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions
```

结果：

- 通过
- `Ran 4 tests in 0.136s`

### 4.2 后端 API E2E

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
```

结果：

- 通过
- `Ran 1 test in 0.181s`

### 4.3 严格 Proto 对齐

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment
```

结果：

- 通过
- `Ran 3 tests in 0.000s`

## 5. 结果摘要

本轮最小回归共执行 8 条测试，最终全部通过。

结论如下：

- 查询型接口服务化未破坏核心链路
- 配置收口后兼容层已补齐
- `main.py` 从 190 行进一步收敛到 123 行

## 6. 进入下一步的条件判定

判定结果：满足

建议下一步：

- 开始引入最小 DTO / 请求模型
- 或继续将异常映射与 app 初始化进一步收口
