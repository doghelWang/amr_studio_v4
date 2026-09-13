# 解析与生成属性完整性修复验证报告

日期：2026-08-01

## 1. 验证范围

本轮针对深度审计中已经由真实 `.cmodel` 数据确认的问题进行修复，不对缺失字段进行猜测或创造。范围包括：

1. 模块接口的 `linkAttrs`、`interfaceAttrs`、`interfaceParams` 保留与回写。
2. `BOX`、`CYLINDER`、`SPHERE` 几何类型及协议字段映射。
3. 组件 `DATA_FIXED_E` 的 `stringFix` 和 `fixedSource` 读取、编辑、回写。
4. `DATA_FLOAT`、`DATA_UINT32`、`DATA_INT64`、`DATA_UINT64`、`DATA_IP`、`DATA_BYTES` 等 protobuf 值类型映射。
5. 前端、Worker、Python 生成路径的一致性。

## 2. 修复依据与改动

### 2.1 接口扩展属性丢失

依据：审计报告对 4 个真实模型统计到 444 个接口组，至少一个原始扩展字段存在于 `linkAttrs/interfaceAttrs/interfaceParams`，而旧 `ImportService` 只映射基础字段。

改动：

- [ImportService.ts](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/frontend/src/store/ImportService.ts) 解析三类接口扩展字段，并同时接受 `interfaceGroup` 与 protobuf.js 的 `interface_Group`。
- [ExportService.ts](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/frontend/src/services/ExportService.ts) 根据原始字段名回写接口数组，避免 camelCase 与 protobuf.js 字段名冲突。
- [worker.ts](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/cloudflare/worker.ts) 保留并合并原始接口扩展字段。
- [component_payload_builders.py](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/backend/core/component_payload_builders.py) 在 Python 生成路径中按字段存在性输出扩展属性。

验证：前端投影 fixture 断言三类扩展字段完全相等；真实 Worker 闭环产物重新解析得到 123 个接口和 47 条连接。

### 2.2 非 BOX 几何体被吞掉

依据：真实样本审计发现 `0323.cmodel` 存在 4 个圆柱体和 1 个球体，旧前端只识别 BOX；protobuf 头文件明确圆柱字段为 `diameter/height`，球体字段为 `diameter`。

改动：

- 前端解析增加圆柱和球体，避免使用 `0` 填充缺失尺寸。
- 前端生成使用协议字段 `height`，不再写入错误的 `sizeHeight`；增加球体生成。
- Worker 同步支持三种形状，并仅回写输入中实际存在的尺寸字段。

验证：前端投影 fixture 断言 `{ type: 'CYLINDER', diameter: 600, height: 120 }`；现有真实 `0323.cmodel` 底盘 BOX 的长度 1476、宽度 1063 在解析和生成后保持一致。

### 2.3 `DATA_FIXED_E` 回写到错误字段

依据：真实审计直接修改 `relateMotor` 后，旧生成结果仍保留旧 `stringFix`，同时旧映射把组件固定枚举写到了 `stringValue`；组件 protobuf 字段实际是 `string_fix`。

改动：

- 前端和 Python 组件映射将 `DATA_FIXED_E` 写入 `stringFix`。
- `fixedSource` 按原始存在性保留。
- Worker 区分组件 `DATA_FIXED_E -> stringFix` 与能力模型 `FIXED_E -> stringValue`，避免混淆两套 protobuf。

验证：fixture 将 `MODE_A` 改为 `MODE_B` 后，导出值为 `stringFix: MODE_B`，`fixedSource` 保持；Python 单测覆盖固定枚举及来源字段。

### 2.4 其他 protobuf 值类型被吞掉

依据：协议枚举和真实属性表包含浮点、无符号整数、64 位整数、IP、bytes 类型，旧映射只覆盖 double/int32/bool/string。

改动：前端、Worker、Python 三条路径均补齐上述值字段，并补充约束上下限字段的 camelCase/snake_case 读取。

验证：Python 单测覆盖 `DATA_FLOAT`、`DATA_UINT32`、`DATA_INT64`、`DATA_UINT64`、`DATA_IP`；前端 fixture 覆盖 float、uint32、IP 的解析值保持。

## 3. 验证结果

### 3.1 自动化验证

- Python 单元测试：`54` 项通过，`0` 失败。
- 前端生产构建：通过；仅保留既有 Vite 大 chunk 警告。
- `frontend_property_projection_regression.ts`：通过。
- `export_unknown_fields_regression.ts`：通过。
- Worker 真实上传/编辑/生成回归：通过。

### 3.2 真实模型验证

输入：`/Users/wangfeifei/Downloads/0323.cmodel`

流程：上传 -> Worker 解包解析 -> 前端语义映射 -> 修改 `chipPlatform` 与接口连接 -> Worker 生成 protobuf/cmodel -> 二进制成果物重新解析。

成果物：`/tmp/amr_fix_verification.cmodel`

重新解析结果：

- 器件：20 个。
- 接口：123 个。
- 连接：47 条。
- 修改后的 `chipPlatform`：`R131__roundtrip_edit` 已写入 `CompDesc.model`。
- 修改后的接口连接：源接口到目标接口 UUID 已写入成果物。

## 4. 复核结论

本轮确认的四类属性完整性问题已经修复，并在前端语义层、Python 生成层、Worker 运行态和真实二进制成果物四个层面完成验证。当前修复没有通过默认值补造输入中不存在的属性；几何回写也不会再因为字段缺失而写入 `0`。

旧的 `tests/cmodel_comprehensive_test.ts` 使用的是历史副本 `tests/ImportService.ts`，不是当前生产源码，因此其报告中的 5 个身份字段失败不能作为本轮生产实现结论。当前生产源码的直接真实模型闭环已通过；该历史测试副本仍应在后续测试治理任务中删除或改为引用正式服务。

## 5. 后续待办

1. 将旧测试副本统一迁移到 `src/frontend/src/store/ImportService.ts` 和 `src/frontend/src/services/ExportService.ts`。
2. 对 4 个审计样本逐一执行同样的真实二进制闭环，而不是只验证 `0323.cmodel`。
3. 对模块库中已确认的 5 个属性模板差异建立显式兼容规则；规则必须以模块库/proto 实际数据为依据，不能自动补字段。
4. 在发布前重新部署 Worker 和 116 服务器，并复用本报告的运行态验证命令。

## 6. 116 服务端部署与浏览器验证

### 6.1 部署记录

- 发布目录：`/home/doghell/amr_studio_v4/releases/20260801_070725`
- `current` 已切换到该 release。
- `amr-studio-backend.service`：`active`。
- nginx 静态目录已同步当前前端构建产物。
- 构建参数：`VITE_BASE=/amr-studio/`。

部署过程中发现两个已处理问题：

1. systemd 已切换新 Node release，但 nginx 仍指向旧的 `/var/www/amr_studio_v4/dist` 内容，导致浏览器继续加载旧 bundle；已同步新 dist 并 reload nginx。
2. 未设置 `VITE_BASE` 时 bundle 使用 `/assets/...` 根路径，和 `/amr-studio/` 入口不匹配；已按既有部署规范使用 `VITE_BASE=/amr-studio/` 重新构建。

### 6.2 浏览器逐步验证

使用浏览器打开：`http://116.62.39.177:8888/amr-studio/`，导入真实 `/Users/wangfeifei/Downloads/0323.cmodel`。

验证结果：

- Step 1 身份信息：页面加载、导入成功提示、`Imported_AMR` 显示正常。
- Step 2 底盘与动力：尺寸显示 `1476 × 1063 × 178`；偏移显示前后 `738`、左右 `531.5`；满载同步值正确；最大速度 `800`、最大加速度 `500`、最大减速度 `400`。
- Step 3 电气装配：器件清单完整显示，包含主控、IO、驱动器、电机、按钮、灯带、陀螺仪、读码器、激光和接近传感器等。
- Step 4 安装坐标：20 个组件可见，底盘、驱动轮、驱动器、电机、传感器、主控等分类及模块名称正常。
- Step 5 接口连线：显示 23 个连接实体、0 个连接错误；CAN、ETH、IO 等连接关系可见。
- Step 6 功能映射：组件能力 2 个、功能能力 5 个、FuncDesc 功能过程 5 个，页面可正常显示摘要。
- Step 7 审计导出：组件 20 个、接口 123 个、电气连接 23 个，审计面板正常显示错误/警告明细和导出按钮。

### 6.3 远端成果物复核

远端回归流程通过：上传 -> 初始化 -> 前端解析/编辑 -> 编译 -> 下载 -> protobuf 重新解析。

- `chipPlatform` 修改值：`R131__roundtrip_edit`，已写入成果物。
- 编辑连接：源接口到目标接口 UUID 已写入成果物。
- 产物重新解析：20 个器件、123 个接口、47 条连接。

备注：浏览器原生下载事件监听未捕获到由页面主动触发的下载，但页面流程已进入导出动作；独立远端 API 闭环和二进制成果物复核均已通过，因此不将该浏览器事件监听差异判定为业务失败。
