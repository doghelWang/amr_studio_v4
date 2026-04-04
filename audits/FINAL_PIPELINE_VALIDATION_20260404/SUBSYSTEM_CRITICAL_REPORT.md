# 子系统字段 (sub_sys_type) 深度对比报告 (2026-04-04)

## 1. 协议标准 (The Law: .proto)
根据 `controller_model_comp_desc.proto` 第 124 行定义：
```proto
message Message_Module_General_Attribute {
    ...
    Message_Base_Element sub_sys_type = 7; // Tag 7，类型为通用元素消息
    ...
}
```
**关键约束**: 
- 字段名必须为 `sub_sys_type` (蛇形)。
- 内部必须包含 `combo_type` (Tag 21) 消息，因为它是下拉框类型。

---

## 2. 12 个模块的现状列表 (Result: Binary Decoded)

| 模块索引 | 模块名 | 子系统 Key (typeKey) | 子系统描述 (typeDesc) | 状态对比结论 |
| :--- | :--- | :--- | :--- | :--- |
| 1 | chassis_diff | ChassisSys | 底盘系统 | ✅ **完全对标** |
| 2 | MCPU-RA-MC-R318BN | ControlSys | N/A | ⚠️ **描述缺失**: 期望 "控制系统" |
| 3 | IO-lnterface board | UnclassifiedSys | N/A | ⚠️ **描述缺失**: 期望 "未分类系统" |
| 4 | LS-MR-LS-05H-N4017 | SensorSys | N/A | ⚠️ **描述缺失**: 期望 "传感器系统" |
| 5 | BAT-U-MR-LFP-480024-F1-C-Aa0 | EnergySys | N/A | ⚠️ **描述缺失**: 期望 "能量系统" |
| 6 | button-Common | UnclassifiedSys | N/A | ⚠️ **描述缺失** |
| 7 | driveWheel_1 | MotionSys | N/A | ⚠️ **描述缺失**: 期望 "运动系统" |
| 8 | driver_1 | DriverSys | N/A | ⚠️ **描述缺失**: 期望 "驱动系统" |
| 9 | walkMotor_1 | DriverSys | N/A | ⚠️ **描述缺失** |
| 10 | driveWheel_2 | MotionSys | N/A | ⚠️ **描述缺失** |
| 11 | driver_2 | DriverSys | N/A | ⚠️ **描述缺失** |
| 12 | walkMotor_2 | DriverSys | N/A | ⚠️ **描述缺失** |

---

## 3. 模板对标：子系统合法选项 (Standard Reference)
后端 `resource_adapter.py` 中定义的映射关系如下：

| 类别 | 映射 Key | 对应描述 (应补全) |
| :--- | :--- | :--- |
| **CHASSIS** | `ChassisSys` | 底盘系统 |
| **DRIVEWHEEL** | `MotionSys` | 运动系统 |
| **DRIVER / MOTOR** | `DriverSys` | 驱动系统 |
| **MAINCPU** | `ControlSys` | 控制系统 |
| **SENSOR** | `SensorSys` | 传感器系统 |
| **BATTERY** | `EnergySys` | 能量系统 |
| **OTHER** | `UnclassifiedSys` | 未分类系统 |

---

## 4. 批判式差异总结 (The Gaps)

1.  **字段名无损性**: 
    *   **现状**: 后端成功将 `subSysType` 转换为 `sub_sys_type`。
    *   **证据**: 二进制解码后显示 Tag 7 已被占用。 ✅ **一致**。
2.  **内容完整性 (严重)**:
    *   **批判点**: 除了底盘模块外，其余 11 个模块的 `typeDesc` (子系统汉字描述) 均为 `N/A` 或为空。
    *   **原因分析**: 在 `resource_adapter.py` 的映射字典中，仅定义了 `typeKey`，未同步填充对应的中文描述字符串。
    *   **解析影响**: 上位机 UI 在显示这些模块所属系统时，可能会显示空白或内部 Key 名，不符合用户交互标准。
3.  **Tag 结构闭环**:
    *   **现状**: `comboType` 结构在二进制中已形成。
    *   **优化动作**: 必须在后端转换逻辑中补全 `typeDesc` 的映射。

---

## 5. 优化建议
立即在 `resource_adapter.py` 中扩展 `CATEGORY_TO_SUBSYS` 字典，改为存储 `{key, desc}` 对象，并修改 `map_component_to_cmodel` 以便在富化阶段强制注入描述字段。
