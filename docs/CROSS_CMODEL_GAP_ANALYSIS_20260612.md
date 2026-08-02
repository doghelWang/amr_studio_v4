# 多 CModel 交叉对比与查漏补缺报告

日期：2026-06-12

## 0. 验证与产物

本次分析前执行后端单元回归：

```bash
src/backend/.venv310/bin/python -m unittest discover -s tests/unit -p 'test_*.py'
```

结果：

- 用例数：53
- 结果：OK

本次新增解析对象：

- `ModelSet.cmodel`
- `20260612.cmodel`

解码产物：

- `artifacts/cmodel_cross_compare_20260612/decoded_ModelSet/`
- `artifacts/cmodel_cross_compare_20260612/decoded_20260612/`
- `artifacts/cmodel_cross_compare_20260612/summary.json`
- `artifacts/cmodel_cross_compare_20260612/library_coverage.json`

对比基准：

- `artifacts/decoded_校验模型_20260503_1015/`
- `docs/CMODEL_MODULE_LIBRARY_PIPELINE_ANALYSIS_20260612.md`

## 1. 三个模型的总体结构对比

| 模型 | 分组数 | 组件数 | 最大分组深度 | 根分组子节点 | interfaceUuid 数 | linkedInterfaceUuid 引用数 | 未解析连接 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `校验模型` | 17 | 22 | 1 | 16 | 105 | 48 | 0 |
| `ModelSet` | 47 | 47 | 1 | 46 | 203 | 104 | 0 |
| `20260612` | 24 | 29 | 1 | 23 | 150 | 66 | 0 |

结论：

- 三个模型的树深度都不高，最大分组深度均为 1。
- `ModelSet` 的覆盖面明显更广，组件数约为 `校验模型` 的 2.1 倍。
- 三个模型的接口连接引用都能在模型内解析，没有悬挂 `linkedInterfaceUuid`。
- 后续 roundtrip 测试应把“接口 UUID 引用无悬挂”纳入固定断言。

## 2. 主类型覆盖差异

| 主类型 | `校验模型` | `ModelSet` | `20260612` | 结论 |
| --- | ---: | ---: | ---: | --- |
| `sensor` | 6 | 26 | 9 | `ModelSet` 大幅扩展传感器场景 |
| `driver` | 4 | 10 | 8 | 两个新模型都增强驱动链路覆盖 |
| `button` | 4 | 1 | 3 | 交互按钮在不同模型中差异明显 |
| `driveWheel` | 2 | 2 | 2 | 三个模型均覆盖 |
| `chassis` | 1 | 1 | 1 | 三个模型均覆盖 |
| `mainCPU` | 1 | 1 | 1 | 三个模型均覆盖 |
| `extendedlnterface` | 1 | 2 | 1 | `ModelSet` 包含两个 IO 模块 |
| `battery` | 1 | 1 | 1 | 三个模型均覆盖 |
| `light` | 1 | 1 | 1 | 三个模型均覆盖 |
| `audio` | 1 | 1 | 1 | 三个模型均覆盖 |
| `screen` | 0 | 1 | 1 | 原报告遗漏，应补充为已覆盖主类型 |

补漏结论：

- 原报告基于单一参考模型，未覆盖 `screen` 主类型。
- `screen` 在模块库中存在事实源：`src/backend/resources/modules/screen-Common.json`、`screenHDMI-Common.json`，以及 `specifications/ModuleLibrary/Aggregated/ModuleConfigs.xml`。
- 后续模块库注册表必须把 `screen/subScreen` 纳入主类型、子类型和私有属性索引。

## 3. 子类型覆盖差异

三个模型合并后出现的关键新增子类型：

- `steerChassis`：`ModelSet` 中的双舵轮底盘。
- `diffSteerWheel`：`ModelSet` 中的舵轮模块。
- `absoluteValueEncode`：`ModelSet` 中的绝对值编码器。
- `pullWireEncode`：`ModelSet` 中的拉绳编码器。
- `proximitySensor`：`ModelSet` 和 `20260612` 中的大量限位/接近开关。
- `codeReader`：`ModelSet` 和 `20260612` 中的智能相机/读码器。
- `comDo`：`ModelSet` 中用于油泵、继电器、主开关等 DO 类控制点。
- `subScreen`：两个新模型均出现。

模块库覆盖检查：

- 本次合并得到的主类型、子类型、接口类型，在 `src/backend/resources/modules` 中均能找到命中文件。
- `BAT`、`screen`、`steerChassis`、编码器、接近开关、读码器等也能在 `specifications/ModuleLibrary/Aggregated` 中找到配置或接口事实源。

补漏结论：

- 原报告对模块库构成的描述是正确的，但黄金样例覆盖面不足。
- 仅使用 `校验模型` 作为 fixture 会漏掉舵轮、门架/升降、油泵/继电器、显示屏、电池 BAT 物理接口、编码器等重要业务场景。
- 新的 golden fixture 矩阵至少应包含 `校验模型`、`ModelSet`、`20260612` 三类样例。

## 4. 接口类型覆盖差异

| 接口类型 | `校验模型` | `ModelSet` | `20260612` | 结论 |
| --- | ---: | ---: | ---: | --- |
| `DI` | 23 | 49 | 35 | 高频接口，必须重点校验 |
| `DO` | 15 | 33 | 18 | 高频接口，必须重点校验 |
| `PI` | 9 | 24 | 13 | 驱动/传感链路高频 |
| `PO` | 10 | 13 | 12 | 驱动/主控高频 |
| `CAN` | 8 | 14 | 12 | 驱动、编码器、电机链路关键接口 |
| `UART` | 4 | 10 | 8 | 驱动器接口覆盖增强 |
| `AI` | 4 | 10 | 8 | 驱动器接口覆盖增强 |
| `ETH` | 6 | 8 | 8 | 激光、相机、显示等模块使用 |
| `SPI` | 1 | 1 | 1 | 陀螺仪板载链路稳定存在 |
| `BAT` | 0 | 1 | 1 | 原报告遗漏，应补充为电池接口 |

补漏结论：

- 原报告漏掉 `BAT` 接口类型，因为单一参考模型的电池未暴露 `BAT_1` 接口。
- `BAT` 在 `specifications/ModuleLibrary/Aggregated/InterfaceSpecs.xml` 中有定义。
- 运行时模块模板中也有 `BAT`：例如 `BAT-LSM18-J050LB-T0.json`、`BAT-U-MR-LFP-480024-F1-C-Aa0.json`、`battery-Common.json`。
- 后续 unknown-field / interface registry 检测不能只基于旧参考模型接口集合，必须以模块库注册表为准。

## 5. 模型间业务场景差异

### 5.1 `校验模型`

主要覆盖：

- 差速底盘。
- 左右差速轮。
- 双电机/双驱动器。
- 主控、板载陀螺仪、IO 模块。
- 前后激光、3D 激光、立体相机。
- 电池、按钮、灯、扬声器。

适合作为：

- 基础差速 AMR golden fixture。
- 陀螺仪、主控 SPI、基础 IO、典型传感器回归样例。

### 5.2 `ModelSet`

主要覆盖：

- 双舵轮底盘 `chassis_steer`。
- 四个舵轮驱动器、四个 PMSM 电机、两个舵轮模块。
- 门架驱动器、电机、门架编码器、升降编码器。
- 大量限位/接近开关。
- 油泵上升/下降、充电继电器、主开关等 `comDo` 控制点。
- 两个 IO 模块。
- 显示屏、电池 BAT 接口、智能相机、多激光。

适合作为：

- 复杂驱动/舵轮/升降机构 golden fixture。
- 多 IO、多连接、多传感器和特殊执行控制点压力样例。

### 5.3 `20260612`

主要覆盖：

- 差速底盘基础链路。
- 新增升降驱动、旋转驱动、电机和限位。
- 智能上/下相机。
- 显示屏、电池 BAT 接口。
- 多按钮/自动手动开关。

适合作为：

- 差速底盘加升降/旋转机构的中等复杂度 fixture。
- 从基础 AMR 到复合机构 AMR 的过渡样例。

## 6. 数据质量与生成约束补充

### 6.1 `moduleDscType` 与 `venderName` 空值

直接读取 `comboType.typeKey` 后，三个模型都存在部分模块设备型号或供应商为空：

| 模型 | `moduleDscType.typeKey` 为空 | `venderName.typeKey` 为空 |
| --- | ---: | ---: |
| `校验模型` | 9 | 9 |
| `ModelSet` | 22 | 21 |
| `20260612` | 8 | 7 |

注意：

- 字段 `desc` 为“设备型号”不等于真实设备型号。
- 后端不得把 `desc`、字段名、模块名猜测成 `moduleDscType.typeKey`。
- 如果导出需要设备型号，应从模块库、原始模型或用户输入中取值；没有事实源时应保持空值并输出诊断。

### 6.2 连接完整性

三个模型的连接引用均无悬挂：

- `校验模型`：105 个接口 UUID，48 个连接引用，未解析 0。
- `ModelSet`：203 个接口 UUID，104 个连接引用，未解析 0。
- `20260612`：150 个接口 UUID，66 个连接引用，未解析 0。

补充约束：

- 编译导出前应检查所有 `linkedInterfaceUuid` 是否能解析到当前模型内接口。
- 如果接口被重建或 UUID 被重新生成，必须同步更新所有连接引用，否则应阻断导出。

## 7. 对原分析文档的补充修正

需要补充到 `docs/CMODEL_MODULE_LIBRARY_PIPELINE_ANALYSIS_20260612.md` 的要点：

- 参考模型覆盖面不足，不能只以 `校验模型` 判断完整协议覆盖。
- 新增主类型覆盖：`screen`。
- 新增接口类型覆盖：`BAT`。
- 新增复杂业务场景：舵轮底盘、升降/门架、旋转机构、油泵/继电器、绝对值/拉绳编码器、智能相机。
- `moduleDscType.typeKey` 和 `venderName.typeKey` 的空值必须作为事实保留，不能用字段描述或模块名补造。
- 接口连接完整性应成为 roundtrip/golden fixture 的强校验指标。

## 8. 对后续重构计划的影响

### P0 调整

原 P0 仍然成立，并应增加：

- 编译前接口连接完整性校验：`linkedInterfaceUuid` 必须全部可解析。
- 编译前关键枚举覆盖校验：主类型、子类型、接口类型必须来自模块库注册表或原始模型事实源。
- 对空 `moduleDscType.typeKey`、空 `venderName.typeKey` 输出诊断，但不得猜测填充。

### P1 调整

模块库注册表必须覆盖：

- `screen/subScreen`
- `battery/subBattery/BAT`
- `steerChassis/diffSteerWheel`
- `absoluteValueEncode/pullWireEncode`
- `proximitySensor/codeReader/comDo`

### P2 调整

golden fixture 矩阵建议：

| Fixture | 用途 |
| --- | --- |
| `校验模型.cmodel` | 基础差速 AMR、陀螺仪、典型传感器 |
| `20260612.cmodel` | 差速底盘 + 升降/旋转 + BAT + screen |
| `ModelSet.cmodel` | 舵轮 + 门架/升降 + 多 IO + 多传感器压力样例 |

每个 fixture 的 roundtrip 断言至少包括：

- 组件数量不变。
- UUID 集合不变。
- 主类型/子类型/子系统不变。
- 接口类型与接口 UUID 集合不变。
- `linkedInterfaceUuid` 无悬挂。
- `moduleDscType.typeKey` 与 `venderName.typeKey` 空值状态不被猜测改写。
- `AbiSet.componentAbility`、`AbiSet.functionAbility`、`FuncDesc.function` 数量不变。

## 9. 下一步建议

建议下一轮按以下顺序实施：

1. 增加 `linkedInterfaceUuid` 完整性校验工具和单元测试。
2. 增加三模型 golden fixture 的统计快照测试。
3. 为上传导入路径补齐 debug artifacts。
4. 建立模块库注册表雏形，先覆盖本报告列出的新增主类型、子类型、接口类型。
5. 将名称启发式推断改成“注册表查找 + 缺失诊断”，落实“不猜测生成”的约束。
