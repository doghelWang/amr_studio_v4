# P0 严重事故溯源：CModel 数据严重丢失审计报告 (CR-20260401-Loss)

## 📌 事故现象
前端触发 `Export Config` (云端编译) 后，控制台显示严重警告：
> `ParseDict Warning: Failed to parse moreModuleInfo field: ... Expected true or false without quotes at ... boolMustfill`

**直接结果**：
输出的 `CompDesc.model` 仅有 **3370 bytes**，而正常基线文件（如 `ModelSet312.cmodel`）应在 **30KB~50KB** 之间。超过 90% 的数据（大部分传感和电气组件信息）在编译过程中被丢弃。

---

## 🔍 数据丢失的核心原因 (Root Cause Analysis)

经过对 `src/backend/skills_v2/cmodel_encoder/encoder.py` 源码与 Protobuf 工作原理的审计，得出以下结论：

### 1. 致命的 Protobuf `ParseDict` 行为机制
`ParseDict` 是 Google Protobuf 提供的将 Python 字典转为二进制的工具。
当它在遍历深层 JSON 嵌套时，按强类型规则校验每个字段。一旦遇到类型不匹配的致命错误（例如期望 `bool` 却收到 `string`），**它会直接抛出异常并中断当前反序列化流程（Abort）**。
后端代码捕捉了此异常并输出在审计日志中，但此时 `root_model` 对象（Protobuf 对象）的构建已经**半途而废**。出错节点之后的所有组件、功能、树结构数据均不会被写入最终的 `SerializeToString()` 中。

### 2. XML 属性的“隐形炸弹” (Untyped Strings)
根本错误出在 `boolMustfill` 字段的传值方式。
我们的元数据定义在 `PrivateAttributes.xml` 中，XML 在被 Python 解析时，所有的属性 (`<Attribute boolMustfill="False" .../>`) 默认全部视作**字符串类型 (`str`)**。
在 `encoder.py` 的 `_xml_node_to_dict` 方法中，代码直接原封不动地返回了字符串：
```python
# 当前实现 (直接拷贝 XML 属性)
for attr_name, attr_val in node.attrib.items():
    d[attr_name] = attr_val  # "False" (String)
```

**导致传递链如下**：
XML (`"False"`) -> Python Dict (`{"boolMustfill": "False"}`) -> Protobuf `ParseDict` -> **引发异常中断构建！**

### 3. 与前端 `resource_adapter` 逻辑脱节
前端（或导入时）的 `resource_adapter.py` 第 99 行 `map_attribute_to_cmodel` 配置中，它假设 `a.get("boolMustfill", False)` 取出的是后端发送的原型数据。但实际上，即使 `get()` 有默认的 False，只要 `a` 包含的是字符串 `"False"`，`get` 返回的就是 `"False"`，导致脏数据直接混入最终编译流水线。

---

## 🗂 影响范围
目前所有从 XML Registry (包括 `PrivateAttributes.xml` 和 `InterfaceSpecs.xml`) 补充进来的数据，但凡包含以下字段都会直接引发系统崩溃级的数据截断：
- `boolParse`, `boolHide`, `boolBasic`, `boolMustfill`, `boolNoeditable` (布尔类型)
- `int32Value`, `uint32Value` (整型)
- `doubleValue` (浮点型)

---

## 🛠 修复方案

### 深度类型清洗 (Deep Type Sanitization)

必须在 `encoder.py` 处理 XML 转化为 Dict 的第一源头（`_xml_node_to_dict`）或最终提交前（`sanitize_values`），**通过正则或字段前缀进行安全强转**。

**关键改造代码 (建议应用至 `encoder.py`)：**
```python
# 拦截所有以 bool 开头或包含 Value 的键
def auto_cast_xml_value(key: str, val: str):
    if key.startswith("bool"):
        return val.lower() == "true"
    if key.endswith("Value") and type(val) is str:
        try:
            return float(val) if "double" in key else int(val)
        except ValueError:
            pass
    return val
```

### 总结
当前系统并非是“漏写”了数据，而是由于**缺乏严谨的强类型转换**，导致底层的 C++ Protobuf Parser 拒绝接受脏数据并直接中断。**实施深度类型清洗后，被丢弃的 90% 数据将瞬间恢复。**
