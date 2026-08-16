# 服务器部署与验证报告

日期：2026-08-01

## 1. 部署目标

服务器：`116.62.39.177`

访问入口：`http://116.62.39.177:8888/amr-studio/`

本次发布内容：Worker 导出一致性修复、前端构建产物及对应 Node Worker 运行代码。

## 2. 发布结果

- 新 release：`/home/doghell/amr_studio_v4/releases/20260801_002313`
- `current` 已切换到新 release。
- `amr-studio-backend.service`：`active`
- nginx 页面入口：HTTP 200
- 前端 JS 资源：HTTP 200
- 旧 release 未删除，可用于回滚。
- 新 release 复用了旧 release 的 `node_modules`，未修改服务器依赖内容。

## 3. 远端验证

### 基础服务

- `/api/v1/system/version`：HTTP 200
- `/amr-studio/`：HTTP 200
- 当前运行时：`cloudflare-worker-typescript`

### 模型流程

使用 `0323.cmodel` 执行：

`上传 → 解析 → 初始化 → 修改私有属性/电气连接 → 编译 → 下载 → protobuf 再解析`

结果：

- 上传：`success`
- 编译：`success`
- 成果物大小：16612 bytes（修改后的回归样本）
- 私有属性 `chipPlatform`：`R131__roundtrip_edit`
- 接口 `a409a350334d4b52a9d37b76dc1f257f`：连接到 `b3dc3c21f337412ca67fe94459d077d8`

## 4. 本地部署前验证

- 后端单元测试：53 项通过。
- 前端构建：通过。
- 原始字段保留回归：通过。
- Worker 本地编辑闭环：通过。
- `git diff --check`：通过。

## 5. 部署注意事项

本次首次切换新 release 时，服务因新目录没有 `node_modules` 启动失败并短暂返回 502；随后已复用旧 release 依赖并重启成功。后续应将依赖目录或安装步骤纳入正式部署脚本，避免新 release 再次出现 `tsx: not found`。
