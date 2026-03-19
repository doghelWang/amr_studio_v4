# 模型三板斧映射百科全书 (Mapping Encyclopedia)

## 1. 映射数据清单 (Mapping Catalog)

### 1.1 公共核心标签 (Common Core Tags)
| 标签 (Tag) | 语义名称 (Semantic Name) | 备注 (Note) |
| :--- | :--- | :--- |
| **1** | `key` | 唯一的字符串标识符。 |
| **2** | `type` | 业务类型或底层数据类型。 |
| **3 / 4 / 51** | `desc` | 人机交互描述文本。 |

### 1.2 模型特有差异点 (Model-Specific Differences)

#### AbiSet (能力定义模型)
- **定位**：对硬件能力的抽象描述（“能做什么”）。
- **类型后缀**：统一采用 `_E` 系列枚举（如 `STRING_E`, `INT32_E`）。
- **递归深度**：中等。主要结构为 `componentAbility` -> `childFunction` -> `attr`。
- **特有逻辑**：`naviUniqueKey` 强制构建 `customCombox`，用于前端下拉选择导航方式。

#### CompDesc (组件描述模型)
- **定位**：对硬件及其接口的物理描述（“是什么”，“如何接线”）。
- **类型前缀**：统一采用 `DATA_` 系列前缀（如 `DATA_DOUBLE`, `DATA_STRING`）。
- **数值标签对准**：
    - `17`: `doubleValue` (当前值)
    - `35`: `doubleMaxvalue` (上限)
    - `45`: `doubleMinvalue` (下限)
- **复杂接口逻辑**：包含 `interfaceAbility` -> `interfaceParamsArray` -> `comboType`。Tag 8/9 作为复合容器。
- **单位编码**：Tag 50 采用 4 字节 ASCII 压缩（如 `846409581` -> `mm/s2`）。

#### FuncDesc (功能描述模型)
- **定位**：对操作层级功能的封装（“如何执行组合任务”）。
- **类型后缀**：与 AbiSet 类似，采用 `_E` 系列。
- **递归深度**：最高。支持 `function` -> `childFunction` -> `attr` (包含 `comboxParam` 深度嵌套)。

---

## 2. 关键定义思想 (Core Design Philosophy)

### I. 抽象层级分离 (Layer Separation)
- **CompDesc (底层)**：关注比特位和物理接线，描述硬件的不可变属性。
- **AbiSet (中层)**：关注逻辑能力。将多个 CompDesc 的物理信号聚合为业务可感知的“能力”。
- **FuncDesc (高层)**：关注交付任务。是用户在 UI 上直接交互的对象，它关联能力并配置执行参数。

### II. 强类型系统与冗余容错
- 针对 Protobuf 丢弃元数据的特性，解析器在映射过程中执行**显式类型注入**。
- `DATA_X` 与 `X_E` 的分立虽然增加了复杂性，但确保了与历史遗留系统的完全兼容（"木已成舟"原则）。

### III. 动态单位系统
- 采用定长 `int32` 压缩 ASCII 字符串，是在 Protobuf 效率与语义可读性之间的平衡。解析器必须具备“解压”能力。
