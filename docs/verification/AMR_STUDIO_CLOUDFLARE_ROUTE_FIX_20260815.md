# AMR Studio V4 Cloudflare 路由修复报告

**日期**：2026-08-15  
**站点**：https://cloud-ai.work/  
**最终 Worker 版本**：`ebe2ca46-fe5c-4163-9f38-4c2802894d31`

## 1. 根因

Cloudflare `cloud-ai.work` 原有更具体路由将 AMR Studio 请求转发到了 `ai-work`：

- `cloud-ai.work/api/*` → `ai-work`
- `cloud-ai.work/downloads/*` → `ai-work`

因此 AMR Studio 的 `/api/v1/...` 请求返回 404。

## 2. 修复方案

采用最小影响方案：

1. 新增 `cloud-ai.work/api/v1/*` → `amr-studio-v4`，保留 `ai-work` 的通用 `/api/*`。
2. 将 Worker 编译产物下载地址从 `/downloads/...` 改为 `/api/v1/models/{project}/artifacts/{artifact}`。
3. 在 AMR Worker 的 API 处理层增加产物读取，避免抢占 `ai-work` 的整条 `/downloads/*` 路由。
4. 将专用 API 路由写入 `wrangler.jsonc`，避免后续部署覆盖控制台修复。

## 3. 线上验证

| 接口/页面 | 结果 |
|---|---|
| `GET /api/v1/system/version` | PASS，HTTP 200 |
| `GET /api/v1/schemas` | PASS，HTTP 200 |
| `GET /api/v1/projects/saved-list` | PASS，HTTP 200 |
| `GET /api/v1/models/test/artifacts/test.cmodel` | PASS，进入 AMR Worker 并返回 `ARTIFACT_NOT_FOUND`，不是路由 404 |
| 生产装备工坊 | PASS，30 个行走模块 |
| 模块来源提示 | PASS，显示“当前使用在线模块注册表” |
| 浏览器 error 日志 | PASS，无 error |

## 4. 当前路由边界

`ai-work` 继续保留以下路由：`.well-known/*`、`downloads/*`、`mobile/*`、通用 `api/*`。AMR Studio 仅通过更具体的 `/api/v1/*` 路由接入，不影响其他业务的通用路径。

## 5. 后续建议

- 用真实项目执行一次 compile，确认生成的 `.cmodel` 通过新 `/api/v1/models/.../artifacts/...` 路径下载。
- 暂不修改 `ai-work` 的 `/downloads/*`，除非确认该路径没有其他业务依赖。
