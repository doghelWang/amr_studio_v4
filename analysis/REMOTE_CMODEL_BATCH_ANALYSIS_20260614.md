# 远端 CModel 批量载入与结构摘要

日期：2026-06-14

## 执行范围

- 本地检索范围：`/Users/wangfeifei` 下所有 `.cmodel` 文件。
- 本地发现 `.cmodel` 文件：196 个。
- 按 SHA256 去重后唯一模型：130 个。
- 远端载入接口：`http://116.62.39.177:8888/api/v1/models/upload`。
- 功能补充接口：
  - `GET /api/v1/models/{project_id}/abilities`
  - `GET /api/v1/models/{project_id}/functions`

## 载入结果

- 成功载入远端服务侧：117 个唯一模型。
- 远端解析失败：13 个唯一模型。
- 成功模型中解析出的器件总数：2747。
- 成功模型中解析出的连接关系总数：2460。
- 成功模型中解析出的功能描述节点总数：1338。

## 聚合器件类型

按 `generalAttr.mainModuleType.comboType.typeKey` 汇总，Top 20：

| 类型 | 数量 |
| --- | ---: |
| sensor | 854 |
| driver | 625 |
| button | 244 |
| driveWheel | 219 |
| light | 120 |
| mainCPU | 110 |
| chassis | 108 |
| extendedlnterface | 103 |
| battery | 87 |
| PMSMMotor | 42 |
| screen | 33 |
| UNKNOWN | 31 |
| audio | 30 |
| intergratedController | 30 |
| actor | 27 |
| unknown | 16 |
| SENSOR | 14 |
| energyController | 13 |
| DRIVER | 12 |
| autobody | 10 |

说明：这里保留原始模型中的类型字符串，不做大小写或拼写归一化，避免把源数据中的差异误合并。

## 字段提取依据

- 器件清单：来自 `CompDesc.full_json.moreModuleInfo[].moduleComponets[]`。
- 器件名称/描述：来自 `generalAttr.moduleName`、`generalAttr.moduleDesc`。
- 器件主类型/子类型：来自 `generalAttr.mainModuleType.comboType`、`generalAttr.subModuleType.comboType`。
- 安装位置：来自 `structParam.extendParams` 中真实存在的 `locCoordX/Y/Z/ROLL/PITCH/YAW`。
- 连接关系：来自 `interfaceParams.interfaceGroup[].linkedInterfaceUuid`，再按 `interfaceUuid` 反查目标接口。
- 功能能力：来自远端 `abilities` 接口的 `componentAbility`、`functionAbility`。
- 功能描述：来自远端 `functions` 接口的 `function[]` 及其 `childFunction` 递归节点。

## 失败模型

以下模型已尝试载入远端，但远端返回 500。失败原因来自远端 HTTP 响应或服务日志，不做推断。

| 文件 | 失败原因 |
| --- | --- |
| `proj_12345_packed.cmodel` | 缺少/未解出 `decoded/CompDesc.json` |
| `proj_12345_packed (1).cmodel` | 缺少/未解出 `decoded/CompDesc.json` |
| `proj_1234_packed (3).cmodel` | 缺少/未解出 `decoded/CompDesc.json` |
| `new_proj_cxe9emu_packed.cmodel` | 缺少/未解出 `decoded/CompDesc.json` |
| `两驱差速对脚.cmodel` | 缺少/未解出 `decoded/CompDesc.json` |
| `zshy_AMR7.cmodel` | 缺少/未解出 `decoded/CompDesc.json` |
| `zshy_AMR7(1).cmodel` | 缺少/未解出 `decoded/CompDesc.json` |
| `zshy_AMR8.cmodel` | 缺少/未解出 `decoded/CompDesc.json` |
| `test111.cmodel` | `Error parsing message with type 'AMR_MODEL_NSP.Message_Module_Info'` |
| `test111_repro.cmodel` | `Error parsing message with type 'AMR_MODEL_NSP.Message_Module_Info'` |
| `空白.cmodel` | 缺少/未解出 `decoded/CompDesc.json` |
| `0c070e22bf-sop.cmodel` | 缺少/未解出 `decoded/CompDesc.json` |
| `f18b72ece9-sop_.cmodel` | 缺少/未解出 `decoded/CompDesc.json` |

## 输出文件

- 本地模型清单：`analysis/local_cmodel_inventory_20260614.json`
- 逐模型完整 JSON：`analysis/remote_cmodel_batch_summary_20260614.json`
- 逐模型 Markdown 摘要：`analysis/remote_cmodel_batch_summary_20260614.md`
- 模型索引 CSV：`analysis/remote_cmodel_model_index_20260614.csv`
- 器件清单 CSV：`analysis/remote_cmodel_components_20260614.csv`
- 连接关系 CSV：`analysis/remote_cmodel_connections_20260614.csv`
- 功能节点 CSV：`analysis/remote_cmodel_functions_20260614.csv`

## 后续建议

- 对 13 个失败模型增加失败产物保留：至少保留远端解包目录、原始 `ModelFileDesc`、已解出的 `.model/.json` 列表。
- 对缺少 `CompDesc.json` 的模型，不应直接返回 500；建议返回结构化诊断，例如 `CMODEL_COMPDESC_MISSING`。
- 对 protobuf 解析失败的模型，建议记录实际文件段名称、目标 message 类型、异常位置，便于区分 proto 不匹配和文件损坏。

