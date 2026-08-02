# AMR Studio V4 前后端解析、构建与生成链路深度审查报告

## 1. 范围与结论边界

本次审查覆盖：cmodel ZIP 解包和 protobuf 反解析、前端 CompDesc JSON 到 RobotConfig 的投影、前端编辑态到 Proto JSON 的导出、后端沙箱/蓝图引用解析、三类 model 的 protobuf 编码、模块通用/私有/接口/安装参数、分组与关系、模板及参考模型的一致性。

本报告只把代码、生成的 protobuf 描述符、现有模板/参考模型和已执行测试中能够确认的内容作为事实。仓库没有找到当前 canonical .proto 源文件；可执行 schema 事实来自 src/backend/skills_v2/schemas_pb/*_pb2.py。src/backend/skills/model_deserializer/scripts/comp_desc.proto 与生成描述符存在差异，不能直接当作唯一真源。无法由这些来源确认的内容必须保持 unknown/待确认，不能由前后端猜测补齐。

总体结论：当前系统可完成部分模型的导入、展示和 protobuf 生成，但不能认定为全模块、无失真、可证明符合现有 protobuf 的完整 round-trip 实现。当前属于“可运行的过渡实现”，存在 P0/P1 数据完整性风险。

## 2. 入口和责任地图

### 前端

| 阶段 | 文件 | 当前职责 | 主要问题 |
|---|---|---|---|
| 导入 | src/frontend/src/store/ImportService.ts | 展开 moreModuleInfo、读取身份和组件、推断轮组拓扑 | 同时解析、默认、推断、改写关系，职责过重 |
| Schema | src/frontend/src/store/SchemaEngine.ts | 查 schema、建属性、少量领域约束 | 仍有轮组/电机硬编码，不是唯一真源 |
| 新建组件 | src/frontend/src/store/useProjectStore.ts | 读取 registry、创建组件 | schema 失败时回退 master_registry，并重复硬编码类别 |
| 属性面板 | src/frontend/src/components/wizard/ComponentPropertyPanel.tsx | 编辑属性、接口、筛选 | 与 SchemaEngine/组件库重复维护子类型 |
| 组件库 | src/frontend/src/components/wizard/ComponentLibraryStep.tsx | 分类、子分类、新建模块 | 不能证明所有模板类型均可选择 |
| 导出 | src/frontend/src/services/ExportService.ts | 编辑态到 Proto JSON，部分保留 raw | 手工字段映射，冲突和未知字段无账本 |

### 后端

| 阶段 | 文件 | 当前职责 | 主要问题 |
|---|---|---|---|
| 解码 | src/backend/skills_v2/cmodel_decoder/decoder.py | 解 ZIP、解析 CompDesc/AbiSet/FuncDesc | 固定文件名、弱 manifest 校验、extractall、物化默认值 |
| 编译 | src/backend/app/services/compile_service.py | 解析引用、诊断、编码和调试产物 | 诊断在编码后追加，错误不能阻断 |
| 主编码 | src/backend/skills_v2/cmodel_encoder/encoder.py | 引用解析、字段归一化、三类模型编码 | 静默丢字段、类型猜测、弱 ref 校验、层级扁平化 |
| 组件映射 | src/backend/core/cmodel_component_mapper.py | 前端组件到 CompDesc | 仅通用映射，无完整模块语义验证 |
| generalAttr | src/backend/core/component_general_attrs.py | 模板/类别生成通用属性 | 模板缺失后大量默认值 |
| private/interface/pose | src/backend/core/component_payload_builders.py | 属性组、接口组、安装参数 | 固定产生坐标、单位、范围和描述 |
| 类别映射 | src/backend/core/module_mappings.py | 类别到主类型/子系统 | 覆盖不完整，generic fallback 掩盖缺失 |
| 旧生成器 | src/backend/core/schema_builder.py、protobuf_engine.py | 直接构造 CompDesc | 与主路径语义不一致，只支持少数模块 |

## 3. Proto 事实和 schema 风险

由 controller_model_comp_desc_pb2.py 描述符可确认：

- Message_Module_Info 有 module_group_name、module_group_uuid、module_sys、module_componets、more_module_info、model_version。
- Message_Module_Componets 有 general_attr、private_attr、interface_ability、interface_params、struct_param、bool_deprecated、bool_disable。
- general_attr 有名称、描述、UUID、版本、子系统、主/子类型、形状、图标和 extend_params。
- private_attr 下是 private_attrs，每组有 array_base_ele。
- interface_params 的实际字段名是 interface_Group，而不是普通 interfaceGroup。
- struct_param 同时有 extend_params 和 segmented_limits_params，不能合并。
- Message_Base_Element 的 type 是 enum，并使用 oneof 值字段；值、范围、单位、描述、固定源和布尔标志均属于数据。

仓库中的旧 comp_desc.proto 与生成描述符在接口字段、消息字段、形状枚举等方面不完全一致。必须先恢复 canonical Proto 或明确 _pb2.py 为临时真源，并用 descriptor diff 防止漂移。CompDesc、AbiSet、FuncDesc 不是同一个 JSON schema：CompDesc 的 COMBOX 使用 arrayCmobEle，AbiSet 还有 arrayAttr 等结构，不能共用一个无上下文的属性映射器。

## 4. 模块处理矩阵

| 类别 | 当前实际处理 | 审查发现 |
|---|---|---|
| CHASSIS | ImportService 身份提取；component_general_attrs 生成 generalAttr | 缺失值回退 0/BOX；驱动类型由轮子数量推断 |
| 立式/卧式舵轮 | ImportService 按属性名找行走/转向电机和编码器 | 未结构化表达行走组、转向组、内置编码器一致性和转向总速比 |
| 差速舵轮 | 按 diffSteer 名称和属性关联处理 | 未强制左右驱动、外置绝对编码器、反馈关系 |
| DRIVER | 通用类别/接口映射 | 无驱动器-电机-反馈-总线角色校验 |
| MOTOR | SchemaEngine、组件库和属性面板有 PMSM/BLDC/BDC 选择 | 映射重复；电机减速比与转向齿轮比没有由角色决定 |
| ENCODER/SENSOR | relatedEncode 属性查找和通用 schema | 增量、单圈绝对、多圈绝对、外置编码器没有统一模型 |
| 激光/双目/读码器/接近 | 通用 SENSOR 处理 | 缺少逐模板字段、接口和功能关系覆盖 |
| BATTERY | 类别映射 | 能量属性、端口、电源关系缺少专门校验 |
| MAINCPU/集成控制器 | 部分类别映射和旧 MCU builder | 拼写/语义混用，CAN/Ethernet/485 未统一审计 |
| IO/通信 | IO 名称归一化和通用接口 | 依赖名称关键词推断；总线属性未结构化 |
| BUTTON/LIGHT/SCREEN/AUDIO/ACTOR | 多数进入 generic mapper | 不能证明私有属性、接口、电气连接、功能能力完整 |
| SENSORPROCESSOR/ENERGYCONTROLLER/AUTOBODY/HANDOPERATOR | 类别表不完整 | 易进入 unknown/UnclassifiedSys fallback |

关键判断：模块能显示不等于模块被正确解析和生成。当前真正有专门语义分支的主要是底盘、轮组、驱动链、能力和少量 UI 过滤；其他类别应标记为“通用兼容但语义未验证”。

## 5. 高优先级问题

### P0-1 编码器静默丢字段

位置：src/backend/skills_v2/cmodel_encoder/encoder.py:250-252、267-268、284-285。

CompDesc、AbiSet、FuncDesc 均使用 ParseDict(..., ignore_unknown_fields=True)。字段不被当前 descriptor 识别时会直接消失，仍然输出可下载文件，违反 NO_PARTIAL_EXPORT。

优化：编码前以目标 message descriptor 预检字段；strict 模式使用 ignore_unknown_fields=False；非 Proto 原始字段放入 raw/audit sidecar；unknown、冲突、类型不匹配必须阻断或进入 unresolved。

### P0-2 导入推断直接改写原始层级

位置：src/frontend/src/store/ImportService.ts:121-194。

轮组数量和 type 文本被用来推断驱动类型，mountX/mountY 正负号被用来推断位置；relateWalkMotor、relateRotMotor、relatedEncode 被解析后直接写入 targetComp.parentNodeUuid、driver.parentNodeUuid 和电机父节点。这会把推断关系伪装成源模型组成关系。

优化：原始 parentNodeUuid、接口链和私有属性只读保存；新增 derivedTopology，记录关系类型、证据路径、来源、状态和冲突；只有人工确认后才生成 EditPatch。

### P0-3 两条生成路径语义不一致

位置：src/backend/core/schema_builder.py:105-186，调用入口 src/backend/core/protobuf_engine.py。

旧生成器自动创建 UUID，所有节点使用 ChassisSys，只处理 chassis/wheel/driver/sensor/mainCPU，每个 wheel component 还会创建成 subDriver，不生成完整 AbiSet/FuncDesc。

优化：生产环境只保留一个 canonical builder；旧接口先 deprecated 并阻断生产调用，随后改成适配层或删除。

### P0-4 Proto 真源缺失

当前只有生成 _pb2.py 和旧 .proto，无法证明所有代码依据同一 schema。

优化：恢复 canonical .proto，锁定 message/field number/enum，生成 Python/TypeScript descriptor，并在 CI 做 descriptor diff。

## 6. P1 问题

1. encoder.py:44-58 的 sanitize_values 按字符串内容猜类型，会把 true/false、数字字符串变成其他类型，可能破坏型号、UUID、版本和文本。应按目标 descriptor/type 归一化，未知时保留原值。
2. encoder.py:80-169 的 proto_final_sync 是手工映射；未知 enum 用 type_mapping.get(v, 0)，camel/snake 冲突时先出现值胜出，均应改为 descriptor 驱动并报告冲突。
3. encoder.py:171-181 的 ref 解析缺失文件检查、循环检测和路径限制。应建立 manifest/ref graph，缺失、重复 UUID、循环和越界均阻断。
4. encoder.py:216-235 的 standardize_sys_tree 会扁平化 more_module_info 并清空根分组字段。若确属目标 Proto 要求，必须做可逆转换并审计移动节点。
5. ImportService.ts:57-118、239-245、404-445、476-537 会制造 Imported_AMR、STANDARD_DIFF、BOX、0 尺寸/坐标、Idle 到 Full Load 的推算、V1.0 和 uuidv4。导入缺失值应保持 unknown；新建模型和导入模型要分开。
6. ExportService.ts:156-272、286-370 手工映射能力、属性、COMBOX、接口和 segmentedLimitsParams；version/tips 等回退会产生新数据，原始未知组/元素不能保证保留。应采用 raw baseline + modeled patch + descriptor serializer。
7. module_mappings.py:44-75、component_general_attrs.py:75-178 未完整覆盖 SENSORPROCESSOR、ENERGYCONTROLLER、COMMUNICATION、AUDIO、SCREEN、ACTOR、AUTOBODY、HANDOPERATOR。generic fallback 只能成为显式版本化兼容规则，并带 provenance；未覆盖类别应阻断。
8. component_payload_builders.py:4-66 缺失坐标转 0，范围固定为 ±9999/±360，单位和描述由代码生成。应从模板复制，只有用户明确编辑时才 patch。

P2：module_templates.py 静默吞异常；decoder.py 导入 Proto 失败后 pass；decoder.py 使用 extractall 且只处理固定三个文件；MessageToJson 物化无 presence 字段；deep_update 无法表达删除/冲突；module_group_builder 对 chassis_diff 硬编码；多处 React 文件重复维护子类型。

## 7. 目标架构

采用三层数据模型：RawEnvelope（原始值、presence、来源、未知字段、hash）-> DomainProjection（模块视图和派生关系）-> EditPatch（用户明确修改的路径、旧值、新值、来源）-> DescriptorSerializer。DomainProjection 不得覆盖 RawEnvelope。

建立唯一 Schema Registry，拆分 CompDescRegistry、AbiSetRegistry、FuncDescRegistry 和 DomainRuleRegistry。字段登记 message、field、jsonName、valueKind、unit、sourceTemplate、required、allowMissing、fallbackPolicy。前后端均从 registry 消费，移除 SchemaEngine、ComponentLibraryStep、ComponentPropertyPanel、useProjectStore 和多个 Python 文件中的重复表。

模块处理器至少拆分 chassis、steerWheel、diffSteerWheel、driver、motor、encoder、sensor、sensorProcessor、battery、energyController、controller、bus/communication、io、button、light、screen、audio、actor、autobody、handOperator。处理器不制造字段，只明确模板来源、可验证关系和 unresolved 内容。

关系必须分层：composition、control、feedback、electrical、functional、mounting。parentNodeUuid 只表达确认的层级，不能承担所有关系。

序列化前必须做 manifest/path、descriptor 字段、unknown/enum、camel/snake 冲突、必填字段、raw ledger、模块/接口/UUID/关系/坐标/功能覆盖率检查；通过后 strict protobuf 编码；再反解析成果物比较 protobuf 语义树，而不是比较 ZIP 大小。

## 8. 分阶段实施

### 阶段 0：冻结 Proto 和基线

恢复 canonical .proto 或明确 _pb2.py 为临时真源；输出三类 descriptor 和旧 proto 差异；为模板和参考模型生成 hash、模块、关系、字段覆盖基线；暂停旧生成器生产调用。

### 阶段 1：严格解析

安全解压、manifest/路径/文件校验；结构化记录 ParseFromString；保留 presence；输出 RawEnvelope、unknownFieldLedger、parseIssues。

### 阶段 2：前端 raw/domain 分层

ImportService 不再修改原始关系；推断只输出证据和 unresolved/conflict；移除导入期 uuidv4/尺寸/坐标/版本/能力默认值；Store 增加 raw、presence、provenance、derived、validation。

### 阶段 3：单一 Registry 和模块处理器

迁移 React 重复硬编码；为每个模板建立字段/接口/关系覆盖矩阵；先完成底盘、两类舵轮、驱动、电机和四种编码器，再扩展传感器、总线、IO、能源、交互和执行器。

### 阶段 4：统一后端生成器

将 cmodel_component_mapper.py 和 component_payload_builders.py 改成 descriptor/registry 驱动的 patch serializer；旧 schema_builder.py 仅作为迁移工具；strict 模式关闭 ignore_unknown_fields；诊断先于编码，P0/error 阻断。

### 阶段 5：全量门禁

正常模型、参考模型和异常 proj* 模型分别闭环；生成 Excel/CSV 仅作为报告视图；CI 检查 descriptor diff、字段覆盖率、unknown ledger、relation diff、round-trip diff 和 manifest MD5。

## 9. 验证结果

已通过：npm --prefix src/frontend run build；Vite 转换 3189 个模块并生成生产包，但有单 chunk 大于 500 kB 警告。已有预编译 CModel 测试显示 46 pass、0 fail、4 warn。

已观察到：预编译报告显示 Round-trip 模块组从 19 变为 20，robotName 等字段使用回退值，说明可运行不等于无失真。npm frontend lint 未执行成功，环境缺 eslint。tests build 未执行成功，环境缺 tsc；之后运行的是已有 tests/dist，不代表当前 TypeScript 源码已重新编译。

Python 单元测试在可导入范围内的基础测试通过，但全量未能加载，环境缺 fastapi 和 google.protobuf，至少 7 个测试导入失败；不能宣称后端全量测试通过。新增回归脚本的现有预编译路径不完整，直接执行出现模块路径/文件缺失错误。

## 10. 下一步与待确认

下一步应先冻结 Proto 真源，修 strict decoder/encoder 和 unknown ledger，再做 RawEnvelope/DomainProjection/EditPatch，随后以底盘、两类舵轮、驱动、电机和编码器为第一批模块处理器，最后扩展其他模块。

待确认且不能靠猜测解决的问题：当前发布版 canonical .proto 所在位置；standardize_sys_tree 扁平化是否是正式要求；parentNodeUuid 的正式语义；轮组私有属性关联与 interface UUID 链哪一个是电气关系真源；UnclassifiedSys、V1.0、100x100x100 是否是目标平台正式兼容值；AbiSet arrayAttr 与 CompDesc arrayCmobEle 的版本和字段号差异。

最终结论：系统有继续重构的基础，但尚未完成模块化、无失真和 protobuf 合规重构。最优先目标是固定 Proto 真源、禁止静默丢字段、隔离原始与派生数据、取消无依据默认值、统一生成入口、按模块建立可验证处理器。
