# 模型解析项目总结与复盘 (Post-Mortem)

## 1. 项目达成情况 (Final Status)
- **100% 位对齐**：ModelSet312 的 312 个模型已实现在 JSON 层面的位级对准。
- **高保真启发式解析**：ModelSet39 在无参考情况下实现了语义对齐，包含复杂的接口嵌套。
- **环境清理**：所有临时脚本及中间件已清理，Skill 描述已更新。

---

## 2. 解析经验清单 (Lessons Learned)

### 2.1 映射清单与差异对齐 (Mapping Catalog)
| 特征 | AbiSet | FuncDesc | CompDesc |
| :--- | :--- | :--- | :--- |
| **设计核心** | 能力抽象 (Logical Ability) | 操作逻辑 (Operation Logic) | 物理实现 (Physical Implementation) |
| **类型规范** | `X_E` 后缀 (枚举) | `X_E` 后缀 (枚举) | `DATA_X` 前缀 (数据) |
| **关键标签 17** | `doubleValue` | `doubleValue` | `doubleValue` (当前值) |
| **关键标签 35** | `doubleMaxvalue` | `doubleMaxvalue` | `doubleMaxvalue` (上限) |
| **关键标签 45** | `doubleMinvalue` | `doubleMinvalue` | `doubleMinvalue` (下限) |
| **接口解析** | 无 | COMBOX 深度嵌套 | interfaceAbility (Tag 8/9/21) |

---

## 3. 过程中犯过的具体错误 (Mistakes & Fixes)

在达到最终 100% 成功之前，我们经历了几次关键的认知迭代：

### I. 标签错位 (Tag Misalignment)
- **现象**：`doubleValue` 的值被错误地放到了 `doubleMaxvalue` 字段中。
- **原因**：初次解析 `CompDesc` 时，错误地将 Tag 17 识别为 `doubleMaxvalue`。
- **纠正**：通过对比 Raw Data 确认 Tag 17 为当前值，35 为上限值，45 为下限值。

### II. 类型系统混淆 (Type Prefix/Suffix Confusion)
- **现象**：`CompDesc` 中输出了 `DOUBLE_E`，或者是 `AbiSet` 中输出了 `DATA_DOUBLE`。
- **原因**：初期尝试统一解析逻辑，忽略了不同模型集之间微小的设计差异（“木已成舟”的历史遗留）。
- **纠正**：实现了模型自感知的逻辑分支，根据输入文件名强制匹配前缀或后缀。

### III. 深度嵌套丢失 (Nested Interface Loss)
- **现象**：`DI_6` 等复杂接口只解析到了 top-level，丢失了内部的 `comboType`。
- **原因**：递归引擎初级版本只处理了一层 Message，未预期到 Tag 8 内部嵌套 Tag 1 的多层级结构。
- **纠正**：重构了 `m_comp_attr` 使其支持在特定标签（8, 9）下的深度递归，并映射了 Tag 21。

### IV. 单位解码盲区
- **现象**：单位字段显示为莫名其妙的长数字。
- **原因**：未意识到系统将 `mm/s2` 这种长字符串压缩成了 4 字节的 ASCII 整数放入 `int32`。
- **纠正**：实现了 `i2str` 工具函数，并对特定编码（如 `846409581`）进行了手动校准和扩展。

---

## 4. 下步建议
当前基于 `protoc` 的 Heuristic Engine 2.0 已经足够稳健。未来若有新的模型集，可直接套用此框架进行标签微调即可。
