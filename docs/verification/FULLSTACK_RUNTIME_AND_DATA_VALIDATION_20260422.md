# 前后端运行与数据验证报告

日期：2026-04-22
范围：前后端联动运行验证 + 后端数据验证测试
结论：通过

## 1. 验证目标

本次验证覆盖两部分：

- 前后端真实运行验证：确认后端服务、前端开发服务、前端代理链路均可用
- 数据验证测试：确认后端核心数据链路未回退

## 2. 运行环境

### 后端

启动命令：

```bash
PYTHONPATH=src/backend src/backend/.venv310/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8002
```

结果：

- 启动成功
- 监听 `http://127.0.0.1:8002`

### 前端

启动命令：

```bash
npm run dev -- --host 127.0.0.1 --port 3001
```

工作目录：

- `src/frontend`

结果：

- 启动成功
- Vite 就绪
- 监听 `http://127.0.0.1:3001`

## 3. 前后端运行验证

### 3.1 后端直接接口

验证地址：

- `GET http://127.0.0.1:8002/api/v1/system/version`

结果：

- HTTP 200
- 返回字段：
  - `backendVersion`
  - `buildDate`
  - `commitHash`
  - `serviceStartTime`

### 3.2 前端主页

验证地址：

- `GET http://127.0.0.1:3001/`

结果：

- HTTP 200
- 返回内容包含 Vite 客户端注入标记，说明前端开发服务正常响应

### 3.3 前端代理到后端

验证地址：

- `GET http://127.0.0.1:3001/api/v1/system/version`
- `GET http://127.0.0.1:3001/api/v1/projects/saved-list`

结果：

- 两个接口均返回 HTTP 200
- `/api/v1/system/version` 返回版本信息
- `/api/v1/projects/saved-list` 返回项目列表，当前数量为 `6`

### 3.4 Schema 查询

验证地址：

- `GET http://127.0.0.1:3001/api/v1/schemas`

结果：

- HTTP 200
- 返回类型为 `dict`
- 当前顶层 key 数量为 `19`
- 示例 key：
  - `autobody`
  - `sensor`
  - `button`
  - `intergratedController`
  - `mainCPU`

## 4. 数据验证测试

### 4.1 导出链路回归

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_export_regressions
```

结果：

- 通过
- `Ran 4 tests in 0.133s`

### 4.2 后端 API E2E 数据链路

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_backend_api_e2e
```

结果：

- 通过
- `Ran 1 test in 0.181s`

覆盖重点：

- 上传 `.cmodel`
- split `CompDesc`
- 初始化项目
- PATCH 组件
- 编译导出并回读校验

### 4.3 严格 Proto 对齐

命令：

```bash
src/backend/.venv310/bin/python -m unittest tests.unit.test_protobuf_export_alignment
```

结果：

- 通过
- `Ran 3 tests in 0.000s`

覆盖重点：

- `proto_final_sync`
- ability / comp desc 类型映射
- `ParseDict(ignore_unknown_fields=False)` 严格校验

## 5. 结论

本次验证确认：

- 后端可以真实启动并提供 HTTP 服务
- 前端可以真实启动并响应页面请求
- 前端代理到后端的链路正常
- 核心只读接口正常响应
- 后端核心数据验证测试全部通过

因此，现有前后端重构结果已经通过“运行验证 + 数据验证测试”。
