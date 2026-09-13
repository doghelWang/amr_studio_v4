# 回归验证报告：导出原始字段保留优化

日期：2026-07-31

## 1. 本轮目标

修复导入模型经过前端解析、编辑、导出时的字段失真问题。约束是：协议中未被前端显式建模的字段，不得通过猜测、创造或默认值替换；用户实际编辑的字段必须覆盖原值。

## 2. 发现的问题

导入阶段已经将原始组件保存到 `rawCmodelComponent`，但原导出逻辑会重新构造 `generalAttr`、`privateAttr`、`interfaceParams` 和 `structParam`，导致协议扩展字段、属性扩展字段、接口电气扩展字段和结构扩展字段被丢弃。

## 3. 改动

`src/frontend/src/services/ExportService.ts` 增加了基于原始对象的定点合并逻辑：

- 原始组件的未建模顶层字段继续保留。
- 原始属性组和属性项按 `key` 合并，前端已编辑的属性值覆盖原值。
- 原始接口按 `interfaceUuid` 合并，连接关系使用当前前端状态覆盖。
- 原始安装位姿参数按参数 `key` 合并，当前安装位置覆盖原值。
- 原始结构扩展字段继续保留；新建组件仍走标准构建路径。

## 4. 验证结果

### 4.1 后端回归

命令：

`PYTHONPATH=src/backend src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'`

结果：`Ran 53 tests ... OK`

### 4.2 前端构建

命令：

`cd src/frontend && npm run build`

结果：通过。仅保留既有的单 JS 包体积超过 500 kB 的 Vite 提示。

### 4.3 原始字段保留回归

命令：

`node_modules/.bin/tsx tests/export_unknown_fields_regression.ts`

结果：`export_unknown_fields_regression: PASS`。

验证覆盖：组件扩展字段、属性扩展字段、接口电气扩展字段、结构扩展字段均保留；组件名称、安装位置、接口连接关系编辑均正确导出。

### 4.4 本地真实服务链路

使用 `Downloads/0323.cmodel` 启动本地 Worker-compatible Node 服务，完成上传、编译和成果物 URL 生成：

- 上传：`success`
- 编译：`success`
- 成果物：`/downloads/import_0323_464e7e74/import_0323_464e7e74_packed.cmodel`
- 编译审计：`CompDesc.model`、`AbiSet.model`、`FuncDesc.model` 均成功生成

## 5. 结论与后续风险

本轮已修复“前端未建模字段在导出时整体丢失”的主要失真风险。该策略保证的是协议 JSON 层面的语义字段保留；如果后续要求保留 protobuf 二进制中的未知字段、字段顺序或原始 wire encoding，则仍需要在 protobuf wire 层引入未知字段保留方案，当前代码没有对此作无依据的假设。
