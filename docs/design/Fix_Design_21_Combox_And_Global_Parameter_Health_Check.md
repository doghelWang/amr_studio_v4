# Fix-21: 下拉框 (COMBOX) 修改逻辑修复与全参数体检

## 1. 现状问题分析
1.  **COMBOX 对象覆盖**：前端在修改下拉框时，错误地将字符串 Key 直接赋值给了 `combo_type` 字段，导致对象内部的 `type_groups` 元数据丢失。
2.  **数据往返断裂**：由于元数据丢失，导出时的 JSON 结构不再符合 `Message_Combo_Element` 的定义，后端 `ParseDict` 无法恢复复杂的嵌套关系。
3.  **其他隐患**：`DATA_IP`, `DATA_INT64`, `DATA_FIXED_E` 等特殊类型的赋值路径尚未经过高强度验证。

## 2. 修复方案设计

### 2.1 修正 COMBOX 修改逻辑
- 修改 `ComponentPropertyPanel.tsx` 中的 `handleValueUpdate`。
- 如果属性类型是 `DATA_COMBOX`：
  - 更新本地状态：仅修改 `node.combo_type.type_key`，禁止覆盖整个 `combo_type` 对象。
  - 构建 Delta Payload：发送 `{ combo_type: { type_key: "new_value" } }`。

### 2.2 全参数体检 (Global Health Check)
我们将针对 Protobuf 定义的 12 种类型进行路径对齐：
| 类型 | 存储字段 | 修复动作 |
|---|---|---|
| **DATA_COMBOX** | `combo_type.type_key` | 修正为对象内更新，保留 type_groups |
| **DATA_IP** | `ip_value` | 确保字符串格式校验 |
| **DATA_FIXED_E** | `string_fix` | 确认双向映射路径 |
| **DATA_INT64** | `int64_value` | 确保前后端统一使用 String 传输（防止大数溢出） |
| **DATA_BOOL** | `bool_value` | 确保布尔值不被转为字符串 |

### 2.3 后端深度合并增强
- 在 `data_manager.py` 中，针对 `combo_type` 进行保护：合并 `type_key` 时，如果不提供 `type_groups`，则保留原有的 `type_groups`。

## 3. 验证计划
1. **驱动器测试**：修改驱动器类型，观察下方“私有属性”是否根据新类型动态切换（递归渲染验证）。
2. **导出回测**：修改后导出，使用标准工具解析，确认 `type_key` 字段已变为新值且 `type_groups` 完整。
3. **IP地址测试**：修改某个 IP 属性，验证是否生效。
