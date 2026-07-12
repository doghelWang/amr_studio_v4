# 后端运行验证报告

日期：2026-04-22
范围：现有后端重构结果的运行时验证
结论：通过

## 1. 验证目的

在现有后端模块化重构基础上，验证以下两类能力：

- 应用能够真实启动并对外提供 HTTP 服务
- 核心只读接口在真实进程中可正常响应

## 2. 验证环境

- Python 解释器：`src/backend/.venv310/bin/python`
- 启动方式：`uvicorn main:app`
- 启动端口：`127.0.0.1:8012`
- 工作目录：仓库根目录

## 3. 启动验证

启动命令：

```bash
PYTHONPATH=src/backend src/backend/.venv310/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8012
```

结果：

- 启动成功
- 应用完成 startup
- 监听 `http://127.0.0.1:8012`

## 4. HTTP 接口验证

### 4.1 `/api/v1/system/version`

结果：

- HTTP 200
- 返回字段包含：
  - `backendVersion`
  - `buildDate`
  - `commitHash`
  - `serviceStartTime`

实际返回摘要：

```json
{
  "backendVersion": "1.0.1",
  "buildDate": "2026-04-04",
  "commitHash": "f664e948"
}
```

### 4.2 `/api/v1/projects/saved-list`

结果：

- HTTP 200
- 返回类型：`list`
- 当前返回数量：`6`

结论：

- 用户项目列表读取正常
- 项目持久化查询链路可用

### 4.3 `/api/v1/schemas`

结果：

- HTTP 200
- 返回类型：`dict`
- 当前顶层 key 数量：`19`
- 示例 key：
  - `autobody`
  - `sensor`
  - `button`
  - `intergratedController`
  - `mainCPU`

结论：

- schema 聚合查询链路可用

## 5. 配套自动化验证

在本次运行验证前，已同步执行最小后端回归并全部通过：

- `tests.unit.test_backend_export_regressions`
- `tests.unit.test_backend_api_e2e`
- `tests.unit.test_protobuf_export_alignment`

## 6. 结论

现有后端重构结果已经满足以下条件：

- 应用可以真实启动
- 核心只读接口可以通过 HTTP 正常访问
- 自动化回归保持绿色

因此，当前“后端入口层 + 应用编排层”的重构成果可以认为已经通过运行验证。
