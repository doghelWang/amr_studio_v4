# 解析成果物与生成成果物一致性审计报告

日期：2026-07-31

## 1. 审计范围

本次验证覆盖：

- `0323.cmodel` 原始压缩包解析。
- 当前 Worker-compatible Node 服务重新生成 `.cmodel`。
- 生成成果物再次 protobuf 解析。
- `CompDesc` 的模块、属性、接口、连接、安装位姿及字段差异对比。
- `AbiSet` 和 `FuncDesc` 的结构与内容对比。

本次仅进行审计，没有修改业务代码。

## 2. 当前代码链路

前端初始化沙箱时把完整配置发送给 Worker，Worker 使用 `buildFrontendCompDesc` 生成 `CompDesc`，再通过 protobuf 编码生成成果物。导入组件优先走 `mapRawComponentToCmodel`，因此未编辑的原始组件可以保留原始协议 JSON。

但前端的 [ExportService.ts](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/frontend/src/services/ExportService.ts:277) 与 Worker 的 [worker.ts](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/cloudflare/worker.ts:791) 是两套不同的组件导出实现，不能把前者的字段保留能力视为 Worker 已全部具备。

## 3. 实际验证结果

### 3.1 原始模型与当前生成模型

输入：`/Users/wangfeifei/Downloads/0323.cmodel`

结果：上传成功、编译成功、成果物大小 19002 bytes。

| 指标 | 原始解析 | 生成后解析 | 结论 |
|---|---:|---:|---|
| 模块数量 | 20 | 20 | 一致 |
| 唯一模块 UUID | 20 | 20 | 一致 |
| 私有属性项 | 159 | 159 | 数量一致 |
| 接口组 | 123 | 123 | 数量一致 |
| 接口连接引用 | 46 | 46 | 数量一致 |

`CompDesc` 深度对比结果为 811 个目标侧缺失字段，未发现额外字段或非默认值变更。缺失字段主要是 protobuf 标量默认值的显式表示，例如 `doubleValue: 0`、`doubleMinvalue: 0`、`int32Value: 0`。因此：

- 语义值层面：当前样本未发现非默认值被改写。
- 协议表示层面：原始文件中显式写入的默认标量字段，在重新编码后可能被 protobuf 库省略。
- 二进制层面：当前不能宣称字节级一致，源文件与生成文件大小也不同。

### 3.2 AbiSet

`AbiSet.json` 深度对比通过；`componentAbility` 和 `functionAbility` 数量均保持一致。

### 3.3 FuncDesc

发现 2 个字段缺失：

`/function[2]/childFunction[2]/attr[0]/comboxParam/arrayAttr[0]/attrParams[0]/int32Value`

`/function[2]/childFunction[2]/attr[0]/comboxParam/arrayAttr[0]/attrParams[1]/int32Value`

这两个字段原值均为 `0`，属于 protobuf 默认标量省略问题，未发现非零功能参数被改变。

## 4. 已确认的问题

### P1：Worker 导出链路对“已编辑的导入组件”覆盖不完整

在 [worker.ts](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/cloudflare/worker.ts:791) 的 `mapRawComponentToCmodel` 中，导入组件只对以下内容做了覆盖：

- `moduleName`
- `moduleDesc`，且只有原始别名非空时才覆盖
- 六个安装位姿参数

当前实现没有把前端编辑后的以下字段合并回原始组件：

- `privateAttrs` 私有属性值
- `interfaces` 接口属性
- `linkedInterfaceUuid` 电气连接关系
- `interfaceAttrs`、`interfaceParams` 接口参数
- `parentNodeUuid` 层级关系
- `boolDisable`、`boolDeprecated` 等组件标志

因此，当前“无编辑导入再导出”可以保持主要结构，但“导入后在界面修改私有属性或电气连接再导出”存在界面状态与最终成果物不一致的风险。

### P1：显式 protobuf 默认值无法保持 wire-level 表示

当前使用 protobuf `fromObject/encode` 重建模型，显式为零的标量字段可能被编码器省略。该问题不一定改变业务语义，但会改变 JSON 解析结果的字段存在性和最终二进制大小。

## 5. 结论

当前链路可以确认：

- 模块数量、模块 UUID、私有属性数量、接口数量和连接数量在未编辑导入再导出场景下保持一致。
- AbiSet 语义内容保持一致。
- FuncDesc 仅发现两个默认零值字段的表示差异。
- 不能确认字节级一致，也不能确认导入后修改接口/私有属性时的一致性。

下一步应统一前端 `ExportService` 与 Worker `mapRawComponentToCmodel` 的字段覆盖策略，优先补齐接口连接、接口参数、私有属性和层级关系的定点合并，并增加“修改后再解析”的 golden round-trip 回归用例。
