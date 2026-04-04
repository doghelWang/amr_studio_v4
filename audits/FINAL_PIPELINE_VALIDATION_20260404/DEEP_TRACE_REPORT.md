# CModel 全链路深度追踪与交叉验证审计报告 (2026-04-04)

## 1. 全链路文档产生逻辑与内容总结

| 阶段 | 产物文件 | 产生逻辑 | 内容总结 |
| :--- | :--- | :--- | :--- |
| **Stage 1: 前端导出** | `01_frontend_raw.json` | 浏览器端 `ExportService.ts` 直接将 React State 树序列化。 | 包含层级结构、用户输入的身份信息及原始属性值。缺失 XML 描述字段。 |
| **Stage 2: 后端富化** | `02_backend_enriched_CompDesc.json` | `resource_adapter.py` 加载本地 XML 模板库，对 Stage 1 数据进行字段级对齐与描述注入。 | 完成了动态尺寸同步、`MOTOR` 模板重定向、`desc` 描述注入。 |
| **Stage 3: 蓝图切割** | `03_blueprint_CompDesc.json` | `model_splitter.py` 遍历 Stage 2 树，将组件提取为独立文件，主树保留 `$ref` 指针。 | 实现了物理结构的扁平化，符合工业级加载标准。 |
| **Stage 4: 二进制封装** | `12345_audit.cmodel` | `cmodel_encoder.py` 整合 Stage 3 所有文件，执行 Protobuf 序列化并计算 MD5 校验。 | 最终交付产物，包含四个必要文件，MD5 校验一致。 |

---

## 2. 典型模块交叉对比分析 (5种不同类型)

### 2.1 模块类型：diffChassis (底盘)
*   **XML 模板属性 (33个)**: 包含 `motionCenterAttr`, `chassisAttr`, `wheelsAttr` 等组。关键键：`length`, `width`, `height`, `wheelsNum`。
*   **Stage 1 (前端)**: 仅包含用户在 Identity 步骤输入的值（1200/800/400）。
*   **Stage 2 (后端富化)**: 成功将 `identity.chassisLength` 注入到 `moduleShape` 节点。`wheelsNum` 已根据拓扑计算为 12。
*   **Stage 4 (二进制)**: `protoc` 解码显示 Tag 13->11 (BOX) 值为 1200, 800, 400。
*   **结论**: ✅ **一致**。底盘尺寸实现了全链路动态流转。

### 2.2 模块类型：diffWheel (驱动轮)
*   **XML 模板属性 (11个)**: 包含 `wheelAttr`, `angleLmtPos` 等。关键键：`relateMotor` (行走电机关联)。
*   **Stage 1 (前端)**: `relateMotor` 存储为行走电机的 UUID。
*   **Stage 2 (后端富化)**: `relateMotor` 类型被对齐为 `DATA_FIXED_E`，并保留 UUID 字符串。
*   **Stage 4 (二进制)**: 确认 `stringValue` (Tag 10) 中包含对应的电机 UUID。
*   **结论**: ✅ **一致**。轮组与电机的引用关系在扁平化后依然通过 UUID 维持。

### 2.3 模块类型：subDriver (驱动器)
*   **XML 模板属性 (7个)**: 包含 `driverAttr`。关键键：`chipPlatform`, `softwareSpec`。
*   **Stage 2 (后端富化)**: 自动补全了默认值 `N/A` 和 `NONE`（如果前端未填），并注入了 XML 描述字段。
*   **结论**: ✅ **一致**。驱动器属性符合 7 属性标准规范。

### 2.4 模块类型：PMSMMotor (永磁同步电机)
*   **XML 模板属性 (14个)**: 包含 `motorAttr`, `motorEncoderAttr`, `motorGearboxAttr`。
*   **逻辑优化验证**: 此模块在 Stage 1 曾因类别错误被识别为 driver。
*   **Stage 2 修正**: 后端强制将其重映射到 `PMSMMotor` 模板，属性数量从 7 补全至 14。
*   **结论**: ✅ **通过**。成功解决了属性缺失的 P0 问题。

### 2.5 模块类型：laserSensor (激光传感器)
*   **XML 模板属性 (10个)**: 包含 `sensorAttr`。
*   **接口验证**: 重点检查 `interfaces` 节点。
*   **Stage 4 (二进制)**: 确认 `interface_Group` (Tag 1) 包含完整的 `interface_uuid` 和 `linked_interface_uuid`。
*   **结论**: ✅ **一致**。电气连接参数在转换中完整保留。

---

## 3. 文档与模板交叉验证结论

| 校验项 | 模板 (XML) 期望 | 生成文档 (JSON/Binary) 状态 | 验证结论 |
| :--- | :--- | :--- | :--- |
| **属性描述 (desc)** | 必须包含，用于 UI 显示 | Stage 2 已全面补全，Stage 4 已序列化 | ✅ 匹配 |
| **数据类型 (type)** | DATA_DOUBLE/INT32 等枚举 | `encoder.py` 内部已映射为整数枚举 (10/5 等) | ✅ 匹配 |
| **层级扁平化** | 平铺列表 | Stage 3 已将嵌套树展平为 `more_module_info` | ✅ 符合规范 |
| **MD5 校验** | 与包内文件内容一致 | `ModelFileDesc.json` 包含动态计算的 MD5 | ✅ 匹配 |

## 4. 总结与审核建议
目前的 CModel 生成管道已完成 **“从组件到二进制”** 的闭环校验。
1. **数据产生逻辑**: 遵循“前端录入 -> 后端富化 -> 切割蓝图 -> 二进制打包”的清晰路径。
2. **模块一致性**: 抽样 5 种核心模块属性 100% 对标 XML 规范。
3. **解析兼容性**: 修正后的 `CompDesc.model` 采用单消息封装，解决了上位机解析器的兼容性障碍。

**审核者注**: 请重点查阅 `trace_data/audit_decoded.txt`，这是最终生成的二进制解码结果，代表了设备收到的最终数据。
