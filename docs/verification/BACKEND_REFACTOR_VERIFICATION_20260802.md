# AMR Studio V4 后端整体重构与前后端联调验证报告

## 1. 验证范围

- 后端 Python 编译与模块导入；
- application/domain/infrastructure 依赖边界；
- 全量 Python 单元、API 与 cmodel 回归；
- 前端 TypeScript 和 Vite 生产构建；
- 本地 FastAPI `8002` 与 Vite `3001` 真实服务；
- `/Users/wangfeifei/Downloads/0323.cmodel` 的解析、前端载入、后端编译、下载和 protobuf 语义比对。

## 2. 自动化验证

### 后端编译

```bash
PYTHONPATH=src/backend src/backend/.venv310/bin/python -m compileall -q \
  src/backend/app src/backend/main.py
```

结果：通过。

### 后端回归

```bash
PYTHONPATH=src/backend src/backend/.venv310/bin/python \
  -m unittest discover -s tests/unit -p 'test_*.py'
```

初始重构结果：`62 tests / 62 passed`。

废弃兼容目录归档删除后结果：`63 tests / 63 passed`。新增测试用于阻止 `core`、`skills_v2`、`app/services`、`app/legacy` 回流。

新增覆盖包括：

- 分层依赖门禁；
- unknown enum/field 阻断；
- `$ref` 缺失、越界和循环；
- 安全 ZIP 解压；
- 内部序号分片及分片还原一致性；
- 内容 UUID 仓储定位；
- 原始 `rawAbiSet` 保留。

### 架构边界

- 活动 `src/backend/app` 不导入 `core` 或 `skills_v2`：通过。
- `application/domain/infrastructure` 不导入 FastAPI：通过。
- `domain/infrastructure` 不反向依赖 HTTP adapter：通过。

### 前端构建

```bash
npm --prefix src/frontend run build
```

结果：TypeScript 与 Vite 构建通过，3188 个模块完成转换。

说明：`npm run lint` 未通过执行准备，原因是项目未安装 `eslint` 可执行文件，不能将其描述为 lint 通过。

## 3. 真实模型后端闭环

参考模型：`/Users/wangfeifei/Downloads/0323.cmodel`

流程：解码 -> CompDesc 拆分 -> strict protobuf 编码 -> 再解码。

最终结果：

- `CompDesc.json`：语义相等；
- `AbiSet.json`：语义相等；
- `FuncDesc.json`：语义相等；
- 源文件 19196 bytes，结果文件 19194 bytes；
- ZIP 字节和 SHA-256 不同，但三个 protobuf 对象字段值全部相等。

差异原因是 ZIP 压缩容器编排/元数据，不是模型字段差异。

## 4. 真实前后端联调

启动：

- 后端：`http://127.0.0.1:8002`；
- 前端：`http://127.0.0.1:3001`。

浏览器确认：

- 欢迎页、项目列表和导入入口正常；
- 前端显示 `v1.0.0`，后端显示 `v1.0.1`；
- 导入 `0323.cmodel` 成功；
- 审计页显示 20 个组件、123 个接口、23 条电气连接、2 个组件能力、5 个功能能力、5 个功能过程；
- 页面校验为 0 error、9 warning；
- 编译、cmodel 下载和 CSV 下载 HTTP 状态均为 200；
- 最终浏览器控制台无 error/warn。

最终验证项目：`proj_8ce2b8ce`。

完整实际流程：

```text
cmodel -> 后端 protobuf 解码 -> 前端状态与审计 ->
后端项目沙箱 -> strict protobuf 编码 -> 浏览器下载 -> 再解码比对
```

字段级结果：

- `CompDesc.json`：相等；
- `AbiSet.json`：相等；
- `FuncDesc.json`：相等；
- 总体语义一致：`true`。

## 5. 联调中发现的失败与修复依据

### 第一次失败：AbiSet unknown enum

错误：`Unknown protobuf enum value: DATA_STRING`。

依据：CompDesc 与 AbiSet 使用不同枚举；`DATA_STRING` 不属于当前 AbiSet 描述符。前端错误地把导入项目当成新建项目，并重复写回能力数据。

修复：以 `rawCompDescMeta` 判断导入来源，删除重复能力 PATCH，新建能力由后端 ABI 映射器生成，导入能力保留 `rawAbiSet`。

### 第二次字段比对失败：1648 处 CompDesc 差异

现象：接口请求均成功，但前端投影视图重建覆盖了原始 `generalAttr/privateAttr/interfaceParams`，并改变模块组数量。

依据：HTTP 200 只能证明请求成功，不能证明模型无失真。

修复：导入项目不再调用 `init-sandbox` 全量重建，直接编译上传后保留的后端沙箱；新建项目继续走正式构建路径。

### 第三次验证

重新启动后端、创建全新浏览器页、重新导入同一源文件并通过 UI 编译。服务返回 200，浏览器无错误，三个 protobuf JSON 语义全等，验证通过。

## 6. 结论与边界

本次后端组织架构重整、废弃目录退役、严格编解码、真实模型无编辑 round-trip 和前后端实际联调均已通过。该结论基于字段级 protobuf 语义比对，不基于文件大小。废弃代码归档与删除后验证详见 `DEPRECATED_BACKEND_REMOVAL_VERIFICATION_20260802.md`。

仍需明确的边界：属性面板的编辑已通过 PATCH 写入导入沙箱；安装坐标和连线的所有编辑场景仍应继续补充显式 dirty patch 自动化测试，不能仅依赖无编辑 round-trip 结论。
