# 验证报告：前端电气连接与功能能力 P0 重构

日期：2026-06-13

## 1. 本轮改动范围

本轮基于 `FRONTEND_ELECTRICAL_ABILITY_DETAILED_DESIGN_20260612.md` 执行 P0 级前端设计重构，目标是先让关键语义可见、可审计，不破坏现有导出链路。

改动内容：

- 新增前端电气领域模型与工具：
  - `src/frontend/src/store/domain/electrical.ts`
  - 从现有 `ComponentConfig.interfaces[].linkedInterfaceUuid` 反建 `ElectricalConnection[]`。
  - 支持连接分类、方向判断、连接形态、基础诊断、统计摘要。
- 新增功能过程只读解析工具：
  - `src/frontend/src/store/domain/functions.ts`
  - 从 `FuncDesc.json` 解析只读 `FunctionProcess[]`，不自动生成或改写功能过程。
- 扩展前端类型：
  - `ElectricalConnection`
  - `FunctionProcess`
  - `Diagnostic`
  - `RobotConfig.functionProcesses`
  - `RobotConfig.rawFuncDesc`
- 新增后端只读 Functions API：
  - `GET /api/v1/models/{project_id}/functions`
- 前端导入流程新增：
  - 导入 cmodel 后读取 `FuncDesc.json`。
  - 解析为只读功能过程并装入 store。
- `WiringStep` 增加：
  - “连接清单”Tab。
  - 连接实体表格、来源引用、诊断、统计卡片。
- `AbilityStep` 增加：
  - `componentAbility` 数量摘要。
  - `functionAbility` 数量摘要。
  - `FuncDesc` 功能过程摘要。
  - 只读功能过程列表。
- `AuditStep` 增加：
  - 接口总数。
  - 电气连接数。
  - `componentAbility` 数量。
  - `functionAbility` 数量。
  - `FuncDesc` 功能过程数量。
  - 连接错误与功能过程缺失诊断。
- `ExportService.exportAbilities()` 修复：
  - 导出 abilities 时保留 `componentAbility`，不再只导出 `functionAbility`。

## 2. 验证命令

后端单元回归：

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

前端生产构建：

```bash
cd src/frontend
npm run build
```

## 3. 验证结果

后端：

- 用例数：53
- 结果：OK

前端：

- TypeScript 编译：通过
- Vite 构建：通过
- 产物：
  - `dist/index.html`
  - `dist/assets/index-jv7A838E.css`
  - `dist/assets/index-WVgF2u5D.js`

构建提示：

- Vite 仍提示 chunk size 超过 500 kB。
- 该提示为既有构建体积问题，不影响本轮功能正确性。

## 4. 当前结论

本轮 P0 重构完成后，前端已经具备以下能力：

- 可以把 cmodel 中已有 `linkedInterfaceUuid` 反建为可见的电气连接实体。
- 可以在 UI 中看到连接来源、类型、方向、目标接口和基础诊断。
- 可以在能力页看到 `componentAbility`、`functionAbility` 与 `FuncDesc` 摘要。
- 可以在审计页看到组件、接口、连接、能力、功能过程的整体指标。
- 前端不会自动猜测生成连接或功能过程，只展示已有事实和诊断。

## 5. 已知限制

- 电气连接当前为只读实体视图，尚未替代原 `linkInterface` 编辑入口。
- `FuncDesc` 当前为只读摘要，尚未支持结构化编辑。
- 连接类型兼容规则当前是前端基础规则，后续应接入后端模块库注册表。
- 尚未增加专门的前端单元测试或 E2E 测试。

## 6. 下一步建议

建议进入 P1：

1. 将 `linkInterface` 改造成 `createConnection/removeConnection/materializeConnectionsToInterfaces`。
2. 将 `WiringStep` 连接编辑入口切换到 `ElectricalConnection` 实体。
3. 增加连接编辑前置校验。
4. 增加三份 cmodel fixture 的连接统计自动测试。

## 7. 运行验证追加

运行时间：2026-06-13 14:25-14:28 Asia/Shanghai

### 7.1 服务启动

已停止旧进程，并从当前 worktree 重新启动：

- 后端：`http://127.0.0.1:8002`
- 前端：`http://127.0.0.1:3001`

后端版本接口：

- URL：`GET /api/v1/system/version`
- 结果：200
- `serviceStartTime`：`2026-06-13T14:25:38.822625+08:00`

前端首页：

- URL：`http://127.0.0.1:3001/`
- 结果：200
- 浏览器标题：`AMR Configurator Studio`

schemas 接口：

- URL：`GET /api/v1/schemas`
- 结果：200
- 响应体大小：约 1.6 MB

### 7.2 真实模型上传与编译

测试模型：

- `20260612.cmodel`

上传接口：

- URL：`POST /api/v1/models/upload`
- 结果：success
- 项目 ID：`proj_edc87f80`
- 解码产物：
  - `CompDesc.json`：1598228 chars
  - `AbiSet.json`：121926 chars
  - `FuncDesc.json`：16074 chars
- 根分组数：23

abilities 接口：

- URL：`GET /api/v1/models/proj_edc87f80/abilities`
- `componentAbility`：2
- `functionAbility`：5

functions 接口：

- URL：`GET /api/v1/models/proj_edc87f80/functions`
- `function`：5

compile 接口：

- URL：`POST /api/v1/models/proj_edc87f80/compile`
- 结果：success
- `download_url`：`/downloads/proj_edc87f80/proj_edc87f80_packed.cmodel`
- `module_list_url`：`/downloads/proj_edc87f80/proj_edc87f80_module_list.csv`
- `debug_artifacts_path`：`debug_artifacts/compile_20260613_142606_523889`
- diagnostics：11 条，均为 warning/info，无 error。

debug artifacts 已生成：

- `01_resolved_CompDesc.json`
- `02_diagnostics.json`
- `03_audit.json`
- `04_blueprint_CompDesc.json`
- `05_module_list.csv`
- `06_final_packed.cmodel`
- `07_ModelFileDesc.json`
- `08_CompDesc.model`
- `09_AbiSet.model`
- `10_FuncDesc.model`

### 7.3 浏览器 UI 验证

使用内置浏览器打开 `http://127.0.0.1:3001/`。

验证结果：

- 欢迎页渲染成功。
- 点击“立即开始”可进入向导。
- “接口连线”页面可见：
  - `连接清单`
  - `电气连接实体视图`
  - `通信总线拓扑`
  - `IO 物理接线`
- “功能映射”页面可见：
  - `组件能力 componentAbility`
  - `功能能力 functionAbility`
  - `功能过程 FuncDesc`
  - `功能过程状态`
- “审计导出”页面可见：
  - `接口总数`
  - `电气连接`
  - `组件能力`
  - `功能能力`
  - `功能过程`

浏览器控制台：

- 无阻断性运行错误。
- 观察到一条既有兼容性 warning：`[rc-collapse] children will be removed in next major version. Please use items instead.`
- 该 warning 不影响本轮页面渲染与运行验证。
