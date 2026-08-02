# Worker 导出一致性优化验证报告

日期：2026-08-01

## 1. 优化内容

修复 `cloudflare/worker.ts` 中导入组件的生成逻辑，使 Worker 以原始 protobuf JSON 为基底，对前端当前状态进行定点覆盖：

- 私有属性按属性组和属性 `key` 合并。
- 接口按 `interfaceUuid` 合并，保留原始接口扩展字段并覆盖连接关系。
- 兼容 protobuf.js 的 `interface_Group` 字段命名，避免写入未被编码器读取的 `interfaceGroup`。
- 支持父节点、组件形状、接口能力、禁用和废弃标志覆盖。
- 支持 Worker PATCH 直接传入 `privateAttr` / `interfaceParams` 的兼容路径。
- 修正别名从空值到有效值的覆盖条件。

新增回归脚本：

`tests/worker_roundtrip_edit_regression.ts`

## 2. 闭环验证

使用 `/Users/wangfeifei/Downloads/0323.cmodel` 执行：

`导入 → 解析 → 修改 chipPlatform → 修改接口连接 → Worker 编译 → 下载 → protobuf 再解析`

验证结果：

- 私有属性 `chipPlatform`：成功变更为 `R131__roundtrip_edit`。
- 接口 `a409a350334d4b52a9d37b76dc1f257f`：成功写入目标连接 `b3dc3c21f337412ca67fe94459d077d8`。
- 成果物可正常下载并再次解析。

## 3. 回归结果

- 后端单元测试：`53 tests ... OK`。
- 前端构建：通过。
- 原始字段保留回归：`PASS`。
- Worker 真实导入/修改/编译/再解析：`PASS`。
- `git diff --check`：通过。

前端构建仍有既有的单 JS 包超过 500 kB 的 Vite 提示，不影响本次功能验证。

## 4. 结论

Worker 侧“界面编辑状态未进入最终成果物”的主要一致性问题已修复。当前验证覆盖私有属性和电气连接关系；安装位姿、名称、形状、父子层级和组件标志也已纳入同一覆盖策略。protobuf 显式默认值在重新编码时可能被省略的 wire-level 差异仍然存在，未在本轮通过猜测方式改变协议编码策略。
