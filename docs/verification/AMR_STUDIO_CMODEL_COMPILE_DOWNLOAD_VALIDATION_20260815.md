# AMR Studio V4 CModel 编译下载闭环验证报告

**日期**：2026-08-15  
**站点**：https://cloud-ai.work/  
**验证项目**：`new_proj_bc420v4`

## 验证流程

1. 通过生产浏览器加载真实 `robot01` 项目。
2. 点击“导出配置”，完成初始化沙箱、底盘同步、组件同步和云端编译。
3. Worker 返回编译产物路径：

   ```text
   /api/v1/models/new_proj_bc420v4/artifacts/new_proj_bc420v4_packed.cmodel
   ```

4. 读取该路径并检查响应头和文件类型。

## 结果

| 验证项 | 结果 |
|---|---|
| 初始化沙箱 | PASS |
| 组件同步 | PASS |
| 云端编译请求 | PASS，浏览器日志出现 Final Compile Response |
| 产物下载 HTTP | PASS，200 |
| 产物大小 | PASS，6446 bytes |
| Content-Type | PASS，`application/octet-stream` |
| Content-Disposition | PASS，`new_proj_bc420v4_packed.cmodel` |
| 文件识别 | PASS，ZIP archive / CModel 容器 |

## 结论

AMR Studio 已完成真实的“项目 → Cloudflare KV 沙箱 → Worker TS 编译 → `/api/v1` 产物下载”闭环。无需接管 `ai-work` 的共享 `/downloads/*` 路由。

## 备注

- 生产浏览器旧缓存曾保留旧前端包；使用带验证参数的新 URL 后已加载最新前端并完成验证。
- 工作区中其他已有未提交改动未纳入本轮提交。
