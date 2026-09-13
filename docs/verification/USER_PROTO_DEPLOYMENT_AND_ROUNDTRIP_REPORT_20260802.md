# 用户 Proto 唯一源整改、部署与 Round-trip 验证报告

## 1. 结论

本次已将 `specifications/protocols` 中用户提供的三份 Proto 固定为项目唯一协议事实源。仓库不再维护或生成其他 `.proto` 副本；Python 和 Worker 只生成语言 bindings。

最终版本已部署到：

- Cloudflare：`https://cloud-ai.work/`
- 服务器：`http://116.62.39.177:8888/amr-studio/`
- 服务器最终 release：`/home/doghell/amr_studio_v4/releases/20260802_215310`
- Cloudflare Worker 版本：`ae6d0e25-7885-4da2-8429-0c5dd8e1c4dd`

## 2. Proto 来源审计

权威文件与 SHA-256：

- `controller_model_comp_desc.proto`：`154e965177cd4b5b227c7f94103edc26e5883ed4c6dff6b0dbcf16c548c79232`
- `controller_model_abi_set.proto`：`703be664e0b2dcad33d0505c1e6d0d2962f23c3da44eb6f27890a99d377c7950`
- `controller_model_abi_desc.proto`：`f1dea96d4f109b4c6209525b12443fb465f48ffb9c1b42c26548074395865c28`

整改内容：

1. 删除 `cloudflare/proto` 三份非权威副本。
2. 新增 `npm run proto:generate`，直接读取 `specifications/protocols`。
3. Python `_pb2.py` 与 `protoc 32.0` 直接生成结果逐字节一致。
4. Worker `protobuf_models.js/.d.ts` 与 `pbjs/pbts` 直接生成结果逐字节一致。
5. 生成过程输出 `PROTO_SOURCE.sha256`，不输出新的 Proto 文件。

## 3. 深入检查发现的问题

### 3.1 属性回写失真

前端修改单个属性时，旧 Worker 会重建完整属性对象，覆盖未编辑的 oneof、min/max 和嵌套 combo 元数据。现改为按 key 和真实差异递归补丁，仅写回发生变化的字段。

### 3.2 父级和描述被辅助逻辑创造

- UI 显示别名回退不再写成新的 `moduleDesc`。
- 动力链辅助发现不再覆盖源 `parentNodeUuid`。

### 3.3 AbiSet/FuncDesc 在 init-sandbox 后丢失

上传阶段三文件已正确解码，但后续前端初始化未提交功能数据时，旧逻辑用空对象覆盖导入结果，导致导出 ZIP 缺少 FuncDesc。现遵循“未提交即不修改”，保留 imported sandbox 原始 AbiSet/FuncDesc。

### 3.4 新建模型路径写入无来源默认值

旧 Worker 会根据组件类别或名称自动写入供应商、版本、重量、功率、尺寸、子系统、模块类型、舵轮类型和坐标范围等字段。这些值并非来自用户 Proto、前端明确输入、模块模板或参考模型，违反信息真实性约束。

现统一改为：

1. 导入模型保留原始 Proto 字段，仅回写明确变更。
2. 新建模型只编码前端明确提交的字段。
3. 缺失字段保持 Proto 默认空值，不通过类别、名称或行业常识补全。
4. 新增 `worker_frontend_minimal_no_invention_regression.ts`，直接反解导出文件并检查无推断字段。

## 4. 本地验证

| 项目 | 结果 |
|---|---|
| Python 后端 | `65 passed, 10 subtests passed` |
| 前端生产构建 | PASS，3189 modules |
| TypeScript 后端构建 | PASS |
| Worker TypeScript 检查 | PASS |
| 0323 无编辑 | CompDesc/AbiSet/FuncDesc 内容差异 0 |
| 1234 无编辑 | CompDesc/AbiSet/FuncDesc 内容差异 0 |
| AOBO 无编辑 | CompDesc/AbiSet/FuncDesc 内容差异 0 |
| 0323 编辑 | CompDesc 仅两项显式修改；AbiSet/FuncDesc 不变 |
| 最小新建模型 | 明确字段保留；无来源字段未写入 |

## 5. 部署后验证

Cloudflare 与 116 服务器分别使用最小新建模型、`0323.cmodel` 和 `AOBO.cmodel555.cmodel` 执行：

`上传 → Proto 解析 → 前端结构投影 → init-sandbox → Worker 构建 → 下载 → 再上传 → 三模型 JSON 深比较`

八组生产验证全部 PASS：

| 环境 | 模型 | 模块数 | CompDesc | AbiSet | FuncDesc |
|---|---|---:|---|---|---|
| Cloudflare | 0323 | 20 | 一致 | 一致 | 一致 |
| Cloudflare | AOBO | 44 | 一致 | 一致 | 一致 |
| 116 服务器 | 0323 | 20 | 一致 | 一致 | 一致 |
| 116 服务器 | AOBO | 44 | 一致 | 一致 | 一致 |

附加边界验证：

- 两端最小新建模型均确认明确字段被保留，未输入属性未写入成果物。
- 两端 0323 编辑测试均确认 CompDesc 仅发生指定属性和连接变更，AbiSet/FuncDesc 不变。

浏览器验证：两个入口均显示 `v1.0.1-worker-ts | worker-ts-edge`，首页、新建入口、项目列表、CModel 导入入口正常，控制台无 error/warning。

验证产物：`artifacts/deployment_validation_20260802/`。

## 6. 剩余风险

- 前端生产包约 1.48 MB，Vite 有大 chunk 警告，属于性能问题，不影响本次数据正确性。
- 本次语义比较覆盖 Proto 可识别字段；如果未来用户 Proto 增加字段，必须先更新用户提供文件，再重新生成 bindings 和执行同一回归矩阵。
