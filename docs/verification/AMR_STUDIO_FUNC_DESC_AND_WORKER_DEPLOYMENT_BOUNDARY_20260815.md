# FuncDesc 协议边界与 Worker 部署隔离记录

- 日期：2026-08-15
- 项目：AMR Studio V4
- 目的：为装备工坊计划中 P1-3 和生产部署待办提供可复核边界证据

## FuncDesc 关系字段结论

依据 `specifications/protocols/controller_model_abi_desc.proto`：

- `Robot_Description` 只有 `version` 和 `repeated Robot_Function function`。
- `Robot_Function` 只有 `type`、`desc`、`repeated Robot_Child_Function child_function`。
- `Robot_Child_Function` 只有 `type`、`desc`、`key`、`repeated Message_CommonAttr attr`。
- `Message_CommonAttr` 只有 `key`、`type`、`combox_param/array_param` 和 `clone_enable`。
- Proto 中没有组件 UUID、接口 UUID、电气连接 UUID、反馈或脚本入口字段。

结论：前端保留 FuncDesc 原始内容，显示只读摘要，并对组件/连接/能力关系输出 `FUNC_RELATIONS_UNRESOLVED`，是协议一致行为；不能从功能名称或属性名称推断硬件绑定。

## Worker 部署隔离结论

当前 `cloudflare/worker.ts` 工作树同时包含：

1. 已存在的未提交 `rawModelFileDesc/ModelFileDesc.json` 保留改动；
2. 本轮 ABI `ARRAY/COMBOX` 到 `ARRAY_E/COMBOX_E` 映射及嵌套属性修复。

两类改动的来源和上线范围未通过提交边界明确分离，因此本轮不执行真实 `wrangler deploy`，避免把未知用户改动一并发布。

已验证：

- Worker TypeScript 检查通过。
- `wrangler deploy --dry-run` 通过，读取 21 个静态资源，总上传 708.58 KiB，gzip 82.28 KiB。
- 真实生产部署和线上页面复验仍为待办，不能写成“已部署”。

## 生产页面只读核对

2026-08-15 通过浏览器只读核对 `https://cloud-ai.work`：

- 前端显示 `v1.0.0`，后端显示 `v1.0.1-worker-ts | worker-ts-edge`。
- 加载生产 `robot01` 后，装备工坊仍没有本轮新增的“导出审计报告”、调车/标定验收门、CAN/USB-485/EthCanGui 准备门或电气接口矩阵。
- 页面控制台无错误；该结果说明线上是旧前端，而不是功能运行失败。

结论：本地功能与生产页面存在已证实的版本差异；生产部署和线上逐页验证仍未完成。

## 放行前操作

1. 由项目维护者确认 `rawModelFileDesc/ModelFileDesc.json` 改动是否纳入本次发布。
2. 在独立提交或干净部署工作树中明确包含的 Worker 与前端构建产物。
3. 重新执行 Worker 类型检查、dry-run 和真实部署。
4. 线上逐页验证准备、结构、电气、功能、校验和审计报告下载。
