# 模型解析高保真映射手册 (Comprehensive Mapping Manual)

> [!NOTE]
> 本手册详细列出了 `AbiSet`, `CompDesc`, `FuncDesc` 三类文件在 Protobuf 原始标签 (Tag) 与 JSON 语义字段 (Key) 之间的完整映射关系。

---

## 1. CompDesc (组件描述模型)

### 1.1 核心结构映射 (Tag Mapping)

| 原始标签 (Tag) | 语义字段 (JSON Key) | 数据类型 (Data Type) | 说明 (Description) |
| :--- | :--- | :--- | :--- |
| **5** | `moreModuleInfo` | Array<Message> | 顶层容器，包含模块分组。 |
| **1 (in 5)** | `moduleGroupName` | String | 模块组名称。 |
| **4 (in 5)** | `moduleComponets` | Array<Message> | 具体的模块组件列表。 |
| **1 (in 4)** | `moduleName` | String | (通用属性解析) 模块名称。 |
| **2 (in 4)** | `interfaceAbility` | Array<Message> | 接口能力定义 (Tag 2)。 |
| **3 (in 4)** | `interfaceParams` | Message | 接口参数配置 (Tag 3)。 |
| **4 (in 4)** | `privateAttr` | Array<Message> | 私有属性列表。 |
| **13 (in 4)** | `moduleShape` | Message | 模块形状定义。 |
| **1 (in 13)** | `sizeLen` | Double | 形状长度。 |
| **2 (in 13)** | `sizeWidth` | Double | 形状宽度。 |
| **3 (in 13)** | `sizeHeight` | Double | 形状高度。 |

### 1.2 属性字段映射 (Attribute Mapping)
*适用于 `privateAttr`, `interfaceParamsArray` 等属性容器内部。*

| 标签 (Tag) | 语义字段 (JSON Key) | 说明 (Description) |
| :--- | :--- | :--- |
| **1** | `key` | 属性键名。 |
| **2** | `type` | 业务类型 (详见 1.3 类型表)。 |
| **3 / 4 / 51** | `desc` | 属性描述信息。 |
| **5** | `interfaceUuid` | 接口 UUID 标识。 |
| **10** | `stringValue` | 字符串类型的值。 |
| **12** | `defaultValue` | 默认值 (Int32 或 Double)。 |
| **13** | `int32Value` | 整型类型的值。 |
| **14** | `boolValue` | 布尔类型的值。 |
| **17** | `doubleValue` | **当前数值** (双精度浮点)。 |
| **20** | `stringFix` | 固定属性字符串。 |
| **21** | `comboType` | 下拉选择配置 (Message)。 |
| **35** | `doubleMaxvalue` | **数值上限**。 |
| **45** | `doubleMinvalue` | **数值下限**。 |
| **50** | `unit` | 单位 (ASCII 自动解压)。 |
| **52** | `boolParse` | 标志位：是否解析。 |
| **53** | `boolHide` | 标志位：是否隐藏。 |
| **54** | `boolNoeditable` | 标志位：是否不可编辑。 |
| **55** | `boolMustfill` | 标志位：是否必填。 |
| **56** | `boolBasic` | 标志位：是否基础属性。 |

### 1.3 类型枚举映射 (Type Enum)
*对应 Tag 2 的数值含义。*

| 数值 (Value) | 映射字符串 (String) |
| :--- | :--- |
| **1** | `DATA_STRING` |
| **2** | `DATA_INT32` |
| **4 / 10** | `DATA_DOUBLE` |
| **11** | `DATA_COMBOX` |
| **12 / 20** | `DATA_FIXED_E` |
| **13** | `DATA_BOOL` |

---

## 2. AbiSet (能力定义模型)

### 2.1 结构映射 (Tag Mapping)

| 标签 (Tag) | 语义字段 (JSON Key) | 说明 (Description) |
| :--- | :--- | :--- |
| **11** | `componentAbility` | 组件抽象能力列表。 |
| **12** | `functionAbility` | 功能抽象能力列表。 |
| **1** | `type` | 能力的物理/逻辑类型 (如 Laser, Motor)。 |
| **2 / 51** | `desc` | 能力描述。 |
| **3** | `tips` | 提示信息。 |
| **10 / 11** | `attr` | 属性列表容器。 |
| **5** | `cloneEnable` | 标志位：是否允许克隆。 |

### 2.2 属性类型映射 (Type Enum)
*对应属性节点内 Tag 10 的数值含义。*

| 数值 (Value) | 映射字符串 (String) |
| :--- | :--- |
| **1 / 3** | `STRING_E` |
| **2** | `INT32_E` |
| **4 / 10** | `DOUBLE_E` |
| **11** | `UINT32_E` |
| **13 / 5** | `BOOL_E` |
| **20** | `FIXED_E` |

---

## 3. FuncDesc (功能描述模型)

### 3.1 结构映射 (Tag Mapping)

| 标签 (Tag) | 语义字段 (JSON Key) | 说明 (Description) |
| :--- | :--- | :--- |
| **1** | `version` | 文件版本信息。 |
| **12** | `function` | 顶层功能列表。 |
| **11** | `childFunction` | 子功能列表容器。 |
| **1** | `type` | 功能类型标识。 |
| **2 / 51** | `desc` | 功能描述。 |
| **10 / 11** | `attr` | 功能参数列表。 |

### 3.2 属性类型映射 (Type Enum)
*与 AbiSet 保持一致。*

| 数值 (Value) | 映射字符串 (String) |
| :--- | :--- |
| **1** | `STRING_E` |
| **2** | `INT32_E` |
| **4** | `DOUBLE_E` |
| **11** | `UINT32_E` |
| **13 / 5** | `BOOL_E` |
| **20** | `FIXED_E` |
