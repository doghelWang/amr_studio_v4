# AMR Studio V4 全流程验证报告

验证时间：2026-07-04 10:35-10:50 CST  
验证对象：本地前端 `http://localhost:3001`，TypeScript 后端 `http://localhost:8002`  
启动命令：`python3 start.py --backend-runtime ts --backend-port 8002 --frontend-port 3001 --host 127.0.0.1`

## 1. 服务启动与健康检查

结果：通过

- Backend 健康检查：OK
- Frontend 健康检查：OK
- 前端版本显示：`v1.0.0`
- 后端版本显示：`v1.0.1`
- 后端版本接口返回：
  - `backendVersion`: `1.0.1`
  - `buildDate`: `2026-07-03`
  - `commitHash`: `ts_rewrite_f664`

## 2. 首页与保存项目列表

结果：通过

- 浏览器打开 `http://localhost:3001` 成功。
- 首页标题为 `AMR Configurator Studio`。
- 欢迎页显示：
  - 从头创建新机型
  - 打开已有项目
  - 打开 CModel 文件
- 保存项目列表正常从后端加载。
- 本轮新建保存后，列表数量从 6 增加到 7，并出现 `codex_fullflow_20260704`。

## 3. 新建项目与保存

结果：通过

操作：

- 点击 `立即开始`。
- 进入 Step 1 `身份信息`。
- 填写机器人名称：`codex_fullflow_20260704`。
- 点击顶部 `保存`。

验证：

- 页面显示机器人名称 `codex_fullflow_20260704`。
- Toast 显示 `项目已成功保存到服务器`。
- 后端 `/api/v1/projects/saved-list` 返回包含 `codex_fullflow_20260704`。

## 4. 加载已保存项目

结果：通过

操作：

- 在欢迎页点击 `codex_fullflow_20260704`。

验证：

- 成功进入向导页面。
- 页面显示 Step 1 `身份信息`。
- Toast 显示 `成功加载项目: codex_fullflow_20260704`。

## 5. CModel 上传解析

结果：通过

测试文件：`proj_1234.cmodel`

接口：`POST /api/v1/models/upload`

验证结果：

- 上传状态：`success`
- 生成项目：`proj_b1b5dd2d`
- 解码审计：
  - `CompDesc.json`: 414915 chars
  - `AbiSet.json`: 122824 chars
  - `FuncDesc.json`: 12715 chars
- blueprint 顶层组数量：8

## 6. CModel 编译生成

结果：通过

接口：`POST /api/v1/models/proj_b1b5dd2d/compile`

验证结果：

- 编译状态：`success`
- 下载地址：`/downloads/proj_b1b5dd2d/proj_b1b5dd2d_packed.cmodel`
- 模块清单地址：`/downloads/proj_b1b5dd2d/proj_b1b5dd2d_module_list.csv`
- 审计日志：
  - `CompDesc.model built: 41623 bytes`
  - `AbiSet.model built: 14590 bytes`
  - `FuncDesc.model built: 1656 bytes`
  - `ModelFileDesc.json generated`

## 7. 下载产物检查

结果：通过

下载结果：

- `.cmodel` HTTP 状态：200
- CSV HTTP 状态：200

生成包内容：

- `AbiSet.model`: 14590 bytes
- `CompDesc.model`: 41623 bytes
- `FuncDesc.model`: 1656 bytes
- `ModelFileDesc.json`: 551 bytes

模块清单 CSV：

- 表头：`模块名,所属子系统,子系统Key,模块主类别,主类别Key,子类别,子类别Key,安装位置(X/Y/Z),旋转姿态(R/P/Y)`
- 行数：13

## 8. 生成物再次导入

结果：通过

操作：

- 将生成的 `/tmp/amr_flow_output.cmodel` 再次上传到后端。

验证：

- 上传状态：`success`
- 新项目：`proj_f1906b13`
- 解码审计：
  - `CompDesc.json`: 405585 chars
  - `AbiSet.json`: 122824 chars
  - `FuncDesc.json`: 12715 chars

说明：生成物可以被当前 TS 后端重新解析，二进制闭环成立。

## 9. 向导页面逐步验证

结果：通过

加载项目：保存项目 `1234`

逐步点击左侧步骤，均可进入并渲染关键内容：

- Step 1 身份信息：通过
- Step 2 底盘与动力：通过，显示 `1200 × 800 × 400 mm`、运动中心、动力组成。
- Step 3 电气装配：通过，显示核心控制板、感知避障、电源管理、已添加组件。
- Step 4 安装坐标：通过，显示 11 个可视组件、激光保护区域、位姿编辑。
- Step 5 接口参数：通过，显示接口矩阵、CAN/ETH/RS485/DI/DO 等端口。
- Step 6 电气拓扑：通过，显示 CAN Bus、Ethernet、RS485 轨道和端口参数面板。
- Step 7 能力过程：通过，显示定位能力、导航、码识别能力配置。
- Step 8 审计导出：通过，显示组件总数 12、接口总数 37、错误 0、警告 30、能力总数 2。

## 10. 审计页云端编译按钮

结果：未通过，需要修复

现象：

- `完成并云端编译` 按钮在 DOM 中存在。
- 按钮状态：
  - visible: true
  - enabled: true
- 采用以下方式触发均未看到处理结果：
  - Playwright locator click
  - DOM CUA click
  - 坐标点击
  - Enter 键触发
- 页面未出现：
  - `正在初始化构建环境...`
  - `云端构建 CModel 中...`
  - `成果物与模块清单构建成功并下载！`
  - `构建失败`
- 控制台未捕获到新的日志。

判断：

- 后端 `/compile` 接口已通过真实闭环验证，因此问题更可能在前端按钮事件触发路径、事件被覆盖层拦截、或浏览器运行时对当前按钮点击触发异常。
- 建议下一步针对 `AuditStep` 的 `onExport` 按钮加一个最小化 e2e 测试或临时 console marker，确认 `onClick={onExport}` 是否真正进入 `App.handleExport`。

## 11. 资源接口验证

结果：通过

- `/api/v1/schemas`
  - 系统数：19
  - 模块数：144
  - 系统分类包含：`chassis`, `driveWheel`, `driver`, `mainCPU`, `sensor`, `battery`, `extendedlnterface` 等。
- `/api/v1/resources/boards`
  - 板卡数量：4
  - 板卡 ID：`RA-MC-R318AD`, `RA-MC-R318AT`, `RA-MC-R318BN`, `RA-MC-R318CT`

## 12. 构建与回归测试

结果：基本通过

- `src/backend_ts npm run build`：通过。
- `src/frontend npm run build`：通过。
  - 仅有 Vite chunk size 警告，不影响构建。
- `tests npm run build && npm run test:run`：通过。
  - Pass: 46
  - Fail: 0
  - Warn: 4
- `src/frontend npm run lint`：未运行成功。
  - 原因：当前前端依赖中没有安装/声明 `eslint` 可执行文件。
  - 错误：`sh: eslint: command not found`

## 总结

全流程主链路基本通过：

- 服务启动通过。
- 首页、项目列表、新建、保存、加载保存项目通过。
- CModel 上传解析、编译生成、下载检查、生成物再导入闭环通过。
- 8 个向导页面均能进入并渲染。
- 资源接口、构建、CModel 回归测试通过。

需要修复/跟进：

1. 审计页 `完成并云端编译` 按钮浏览器点击未触发导出流程。
2. 前端 lint 脚本缺少 `eslint` 依赖或配置。
3. 审计页项目 `1234` 当前有 30 条警告，主要为供应商类型/描述类型为空与总线未连线，属于数据完整性警告，不是运行时崩溃。
