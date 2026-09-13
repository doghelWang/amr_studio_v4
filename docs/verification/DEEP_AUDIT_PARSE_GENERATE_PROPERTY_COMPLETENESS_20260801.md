# 解析与生成流程、模块属性表完整性深度审计

日期：2026-08-01

## 1. 审计范围

本次审计覆盖五层：

1. protobuf `.cmodel` 解压与 JSON 反解析。
2. `ImportService` 到前端 `ComponentConfig/SmartAttribute/InterfaceConfig` 的语义映射。
3. 前端/Worker 生成 `CompDesc.model` 的字段覆盖和保留策略。
4. 生成成果物再次 protobuf 解析后的闭环一致性。
5. 模块库 `schemas.json` 与 `Pri_Attr/**/PrivateAttribute.json` 的属性键对齐。

实际模型样本：

- `0323.cmodel`
- `AOBO.cmodel555.cmodel`
- `new_proj_15kfuy5_packed.cmodel`
- `测试车模型(1).cmodel`

部署前后端基线回归：后端 `53 tests ... OK`。

## 2. 样本规模统计

| 样本 | 模块 | 私有属性组 | 私有属性项 | 接口组 | 连接引用 | 非 BOX 形状 |
|---|---:|---:|---:|---:|---:|---:|
| 0323 | 20 | 26 | 159 | 123 | 46 | 5 |
| AOBO | 44 | 40 | 239 | 201 | 98 | 6 |
| new_proj_15 | 15 | 21 | 123 | 41 | 8 | 0 |
| 测试车模型 | 17 | 24 | 158 | 79 | 30 | 2 |

协议层模块数量和私有属性数量可以被完整解析，主要缺口出现在协议字段进入前端语义模型之后。

## 3. 已确认的完整性问题

### P1：接口属性表没有进入前端语义模型

四个样本共 444 个接口组。原始协议接口中存在以下扩展字段：

- `linkAttrs`
- `interfaceAttrs`
- `interfaceParams`

但 [ImportService.ts](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/frontend/src/store/ImportService.ts:427) 创建 `InterfaceConfig` 时只映射：

`key/type/path/desc/interfaceUuid/linkedInterfaceUuid`

因此前端属性表无法展示或编辑接口电气参数、接口模板参数和连接属性。原始 `rawCmodelComponent` 仍保留这些字段，但这只是原始数据保留，不等于界面和语义模型完整。

### P1：圆柱和球形模块没有进入前端形状模型

样本原始协议中出现：

- `ENUM_CYLINDER`：10 个。
- `ENUM_SPHERE`：3 个。

但 [ImportService.ts](/Users/wangfeifei/.codex/worktrees/2655/amr_studio_v4/src/frontend/src/store/ImportService.ts:457) 只在 `moduleShape.box` 存在时生成 `ComponentConfig.shape`，所以实际运行结果中前端语义模型的 `CYLINDER` 和 `SPHERE` 数量为 0。

影响：页面不能准确显示、编辑或校验这些模块的几何形状；导出依赖原始字段时可能暂时保留，经过新建或结构重建后则存在丢失风险。

### P1：固定枚举属性编辑回写不完整

四个样本共发现 26 个 `DATA_FIXED_E` 属性。`ImportService.mapAttribute` 将 `stringFix` 读入了通用 `value`，但没有将 `fixedSource` 映射到 `SmartAttribute.fixedSource`。

更严重的是，前端 `ExportService.mapAttributeToCModelSimple` 对 `DATA_FIXED_E` 没有专门的 `stringFix` 导出分支。实际验证中把 `relateMotor` 从 `motor-left` 改为 `edited-target` 后，导出结果仍为：

```json
{
  "stringFix": "motor-left",
  "fixedSource": ["driver/PMSMMotor"]
}
```

即界面值变化没有进入协议字段。Worker 的通用属性映射也把普通组件 `DATA_FIXED_E` 写成 `stringValue`，而组件 protobuf 字段事实源是 `stringFix`，同样需要修正。

### P1：模块库与模块实例属性表存在漂移

模块库交叉统计：175 个模块库组件、77 个私有属性模板中，170 个实例的属性键集合一致，5 个实例存在差异：

| 模块库模块 | 子类型 | 差异 |
|---|---|---|
| `STEREO-MV-EB435i` | `stereo` | 实例缺少 `scanDistence` |
| `DIFF_STEER_WHEELS_DOUBL(双差速舵轮)` | `absoluteValueEncode` | 实例额外存在 `gearRatio`，出现 2 次 |
| `AbsEncoder-H8` | `absoluteValueEncode` | 实例额外存在 `gearRatio` |
| `TYD150-SM07530BA-20-11020-SM020BA-45.H173` | `horizontalSteerWheel` | 实例缺少嵌套属性 `angleSensorType.GROUP_CALI_HELM_IO.angleDeviationZero` |

这些差异不能直接判定为代码 bug：可能是模块文件版本差异，也可能是模板库过期。但当前系统没有给出版本、来源和冲突诊断，前端会把它们当作普通属性表继续处理，存在配置语义漂移风险。

### P2：协议类型映射覆盖不完整

`SmartAttribute` 和 `ImportService.mapAttribute` 没有完整处理以下协议类型的值字段：

- `DATA_UINT32`
- `DATA_INT64`
- `DATA_UINT64`
- `DATA_FLOAT`
- `DATA_BYTES`
- `DATA_IP`

四个样本中当前私有属性主要使用 `DATA_DOUBLE/DATA_INT32/DATA_STRING/DATA_COMBOX/DATA_BOOL/DATA_FIXED_E`，因此没有被样本完全暴露；但模块库和 protobuf 描述已经定义这些类型，当前实现不能宣称通用属性表完整。

### P2：前端属性映射会丢弃协议元数据

`mapAttribute` 对组件属性将 `boolBasic` 固定为 `true`，没有保留原始值；同时没有把组件属性的 `fixedSource`、部分 oneof 值形态和未知元数据完整带入 `SmartAttribute`。原始组件副本仍在 `rawCmodelComponent` 中，但前端表单和导出覆盖逻辑无法基于这些字段进行可靠编辑。

## 4. 解析与生成流程结论

### 已经可靠的部分

- `.cmodel` ZIP 解压和三个 protobuf 模型文件解析成功。
- 模块树、模块 UUID、私有属性组和大部分私有属性项可以进入前端。
- Worker 当前对未编辑导入组件采用原始对象作为基底，未知协议字段保留效果较好。
- Worker 已验证私有属性和普通接口连接的编辑可以进入生成成果物。

### 不能宣称完整的部分

- 前端接口属性表不是完整协议表，只是接口基本信息和连接 UUID 的投影。
- 几何形状不是完整投影，只支持 BOX。
- `DATA_FIXED_E` 编辑回写存在明确失败案例。
- 模块库实例与属性模板存在 5 个键集合差异。
- protobuf 重新编码会省略显式默认标量字段，二进制和 JSON 字段存在性不保证与源文件一致。

## 5. 建议整改顺序

1. 扩展 `InterfaceConfig`，完整接入 `linkAttrs/interfaceAttrs/interfaceParams`，并在属性面板中区分接口模板参数和运行时参数。
2. 扩展 `SmartAttribute` 的类型和值容器，覆盖所有 protobuf oneof 类型，禁止用 `0/false/''` 替代未知值。
3. 修复 `DATA_FIXED_E` 的 `stringFix/fixedSource` 解析、编辑和生成闭环。
4. 完善 BOX/CYLINDER/SPHERE 三种几何结构映射和编辑校验。
5. 为模块库实例增加 `schemaVersion/sourceFile/conflicts` 诊断，明确属性差异是版本差异还是异常模型。
6. 建立按模块类别的 golden property-table 测试：底盘、驱动轮、电机/驱动器、传感器、电池、IO、控制器、显示、音频、灯、按钮至少各覆盖一个真实模块。
7. 在生成成果物后自动再次解析，对模块属性键、类型、值、接口扩展字段和连接关系逐项比对；默认值字段差异单独标记，不得与真实值丢失混为一谈。

## 6. 总结

当前项目的协议解析主干可用，模块数量和私有属性数量并非主要问题；核心风险是“原始协议数据保留”与“前端可理解、可编辑、可生成的属性表完整”之间存在差距。下一步应优先补齐接口属性、固定枚举、非 BOX 几何和全类型值映射，再处理模块库版本漂移和默认值 wire-level 保真问题。
