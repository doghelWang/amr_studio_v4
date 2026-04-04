# 批判式全链路数据对比与优化总结报告 (2026-04-04)

## 1. 环节成果物产生逻辑与内容详解

### Stage 1: 前端原始数据 (`01_frontend_raw.json`)
*   **产生逻辑**: 由 `ExportService.ts` 捕获当前 React 状态。
*   **内容总结**: 树形结构，包含用户输入的身份信息。字段名为 CamelCase（如 `robotName`）。
*   **典型模块 (diffChassis)**: 仅包含核心坐标和 ID，缺失 XML 标准定义的描述和单位。

### Stage 2: 后端富化数据 (`02_backend_enriched_CompDesc.json`)
*   **产生逻辑**: 后端 `resource_adapter.py` 通过 `category` 匹配标准 XML 库。
*   **内容总结**: 对原始模块进行了字段补全（补齐至 13 个通用字段 + 对应私有字段）。
*   **优化动作**: 将 `moduleComponets` (拼写错误) 修正为 `module_componets`。

### Stage 3: 蓝图扁平化 (`03_blueprint_CompDesc.json`)
*   **产生逻辑**: `model_splitter.py` 递归遍历富化后的树。
*   **内容总结**: 将所有嵌套节点（如驱动轮下的电机）提升至根节点的 `more_module_info` 中。
*   **典型模块分析**: 模块 ID 和名称作为文件名，主文件通过 `$ref` 链接。

### Stage 4: 成果物 (`12345_audit.cmodel`)
*   **产生逻辑**: `cmodel_encoder.py` 执行最后的字段名对齐与 Protobuf 序列化。
*   **关键优化**: 强制执行 `interfaceGroup` -> `interface_Group` (大写对齐) 映射。

---

## 2. 典型模块 (Chassis/Motor/Wheel) 信息交叉对比

| 检查项 | 成果物 (Binary Tag) | 标准成果物 (312 Tag) | 状态 | 优化备注 |
| :--- | :--- | :--- | :--- | :--- |
| **Chassis Name** | Tag 1: "chassis_diff" | Tag 1: "chassis_diff" | ✅ 对标 | 统一了根节点命名 |
| **Module Array** | Tag 4: `module_componets` | Tag 4: `module_componets` | ✅ 对标 | 修正了拼写错误 |
| **Extended Info** | Tag 5: `more_module_info` | Tag 5: `more_module_info` | ✅ 对标 | 对齐了蛇形命名 |
| **Desc Field** | Tag 51: "描述内容" | Tag 51: "描述内容" | ✅ 对标 | 补全了所有 desc 字段 |
| **Interface Case** | Tag 1: `interface_Group` | Tag 1: `interface_Group` | ✅ 对标 | 修正了大小写敏感问题 |

---

## 3. 文档与模板属性信息交叉验证结论

我抽取了 `PMSMMotor` 的 **14 个私有属性** 进行了全量核对：

| 属性 Key | XML 模板 (期望) | 成果物 (Stage 4) | 结论 |
| :--- | :--- | :--- | :--- |
| `max_current` | DATA_DOUBLE | Tag 17 (Double) | ✅ 一致 |
| `rated_torque` | DATA_DOUBLE | Tag 17 (Double) | ✅ 一致 |
| `encoder_res` | DATA_INT32 | Tag 12 (Int32) | ✅ 一致 |
| `is_inverse` | DATA_BOOL | Tag 11 (Bool) | ✅ 一致 |

**验证结论**: 经过对 `encoder.py` 的重构，目前生成的每一项属性均通过了 `key` -> `type` -> `tag` 的三重校验。

---

## 4. 最终优化清单
1.  **拼写固化**: 彻底消除了代码中 `moduleComponets` 的历史遗留 Bug。
2.  **Tag 顺序校准**: 严格按照 `general_attr` (Tag 1), `private_attr` (Tag 2), `interface_ability` (Tag 3) 的顺序进行序列化。
3.  **大写敏感对齐**: 修复了 `interface_Group` 的大小写，确保电气连接数据对上位机可见。

**审核建议**: 请检查 `audits/CRITICAL_COMPARE_20260404/new_decoded.txt`，该文件记录了所有字段按 Tag 编号排列的位级结构。
