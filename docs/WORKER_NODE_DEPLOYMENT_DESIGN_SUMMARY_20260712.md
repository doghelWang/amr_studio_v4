# AMR Studio V4 Worker/Node 同源部署设计总结

日期：2026-07-12

## 目标

将已经部署到 `cloud-ai.work` 的 AMR Studio V4 Worker TypeScript 版本同步部署到 `116.62.39.177:8888`，并保持两套入口尽量复用同一份模型解析、构建、组合和导出逻辑。

## 部署结果

- Cloudflare 入口：`https://cloud-ai.work/`
- 服务器入口：`http://116.62.39.177:8888/amr-studio/`
- 服务器 API：`http://116.62.39.177:8888/api/v1/...`
- 服务器后端运行方式：`amr-studio-backend.service` 启动 Node Worker 适配服务。
- 服务器静态资源：nginx 继续从 `/var/www/amr_studio_v4/dist` 提供 `/amr-studio/` 前端页面。

## 核心设计

### 1. Worker 业务逻辑作为唯一主线

`cloudflare/worker.ts` 是 Cloudflare 和服务器部署共同复用的后端主入口，负责：

- 系统版本、资源库、模块 schema 查询。
- 项目保存/加载。
- `.cmodel` 上传解析。
- sandbox 初始化、组件/能力/功能查询和修改。
- `.cmodel` 编译导出与下载。

这样避免了 Cloudflare Worker 与服务器后端分别维护两套解析/构建规则，降低模型数据失真的风险。

### 2. Node 适配层只做运行时桥接

新增 `cloudflare/node-server.ts`，职责限定为：

- 把 Node HTTP 请求转换为标准 `Request`。
- 调用 `worker.fetch(request, env)`。
- 用文件系统模拟 Cloudflare Assets 和 KV。
- 将 Worker `Response` 写回 Node HTTP 响应。

它不重新实现模型业务逻辑，也不猜测、创造或补写模型参数。

### 3. KV 持久化差异

Cloudflare 使用 `AMR_PROJECTS` KV namespace。

服务器使用文件系统目录模拟 KV：

```text
/home/doghell/amr_studio_v4/shared/worker-kv
```

保存内容包括项目配置、sandbox 记录和导出 artifact，key 规则沿用 Worker 代码中的 `project:*`、`sandbox:*`、`artifact:*`。

### 4. 前端 base 可配置

`src/frontend/vite.config.ts` 新增：

```ts
base: process.env.VITE_BASE || '/'
```

部署差异如下：

- Cloudflare：默认 `/`，适配 `https://cloud-ai.work/`。
- 服务器：构建时设置 `VITE_BASE=/amr-studio/`，适配 `http://116.62.39.177:8888/amr-studio/`。

## 本次验证

### 本地验证

- `npm run build`：通过。
- `PORT=18888 npm run worker:server`：启动成功。
- `GET /api/v1/system/version`：返回 `1.0.1-worker-ts`。
- `GET /`：返回前端 HTML。
- `.cmodel` 上传、编译、下载：通过。

### 服务器验证

- `GET http://127.0.0.1:8002/api/v1/system/version`：通过。
- `GET http://116.62.39.177:8888/api/v1/system/version`：通过。
- `HEAD http://116.62.39.177:8888/amr-studio/`：HTTP 200。
- `HEAD http://116.62.39.177:8888/amr-studio/assets/index-5xFriW1v.js`：HTTP 200。
- `POST /api/v1/models/upload` 使用 `0323.cmodel`：通过。
- `POST /api/v1/models/{project_id}/compile`：通过。
- `GET /downloads/{project_id}/{artifact}`：通过。

验证样例结果：

```json
{
  "projectId": "import_0323_a9da0e03",
  "uploadStatus": "success",
  "compileStatus": "success",
  "artifactBytes": 19002
}
```

## 当前能力边界

- Worker/Node 路径已覆盖主流程：导入 `.cmodel`、解析、前端状态承载、组件/能力/功能数据保留、重新编译导出。
- protobuf 二进制重新编码后可能与原始 `.model` 文件大小或 MD5 不一致，但在当前 proto 可识别字段下语义一致；未知 wire 字段不会被当前 protobuf 解码/编码链路保留。
- Node 服务器适配层的 KV 是文件系统实现，不具备 Cloudflare KV 的跨区域一致性特征，但适合单机部署。

## 后续建议

- 为 Worker/Node 同源运行增加自动化 roundtrip 回归脚本。
- 如需保留 protobuf unknown fields，需要增加 wire-level 保真解析/重封装能力。
- 将服务器部署脚本固化为 `scripts/deploy_server.sh`，减少人工 systemd/nginx 操作。
