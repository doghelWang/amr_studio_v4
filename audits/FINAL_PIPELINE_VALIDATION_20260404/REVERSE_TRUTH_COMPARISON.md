# 逆向事实对比报告：代码逻辑 vs 标准参考文件 (2026-04-04)

## 1. 从 ModelSet312.cmodel 提取的“终极事实” (Truth)
以下是从标准文件二进制数据中直接还原出的映射关系：

| 模块型号 (module_type) | 归属子系统 (type_key) | 子系统中文描述 (type_desc) |
| :--- | :--- | :--- |
| **CHASSIS** | `ChassisSys` | 底盘系统 |
| **diffWheel** | `MotionSys` | 运动系统 |
| **subDriver** | `DriverSys` | 驱动系统 |
| **PMSMMotor** | `DriverSys` | 驱动系统 |
| **mainCPU** | `ControlSys` | 控制系统 |
| **laserSensor** | `SensorSys` | 传感器系统 |
| **battery** | `EnergySys` | 能量系统 |
| **button** | `InteractiveSys` | 交互系统 |
| **light** | `InteractiveSys` | 交互系统 |
| **extendedlnterface** | `UnclassifiedSys` | 未分类系统 |

---

## 2. 批判式对比：代码中的 Bug 与偏差

通过对 `resource_adapter.py` 的代码审查，发现以下 **3 处与事实不符** 的硬编码：

### 偏差 A：交互系统识别错误
*   **代码中**: 将 `BUTTON` 和 `LIGHT` 归类为 `UnclassifiedSys` (未分类)。
*   **标准文件中**: 明确归类为 `InteractiveSys` (交互系统)。
*   **后果**: 生成的模型在上位机中会出现在错误的分类树下。

### 偏差 B：描述字段 (type_desc) 全面缺失
*   **代码中**: 只定义了 `key` (如 `EnergySys`)，完全没定义 `desc`。
*   **标准文件中**: 每个系统均有对应的汉字描述 (如 "能量系统")。
*   **后果**: 正如用户观察到的，生成的成果物中子系统描述字段全为空（N/A）。

### 偏差 C：电池分类不严谨
*   **代码中**: `BATTERY` -> `EnergySys`。
*   **标准文件中**: 电池确实属于 `EnergySys`，但代码中缺少对应的 `type_desc` 映射逻辑。

---

## 3. 证据信息 (Evidence)
您可以在以下路径亲自对比：
*   **代码源**: `src/backend/core/resource_adapter.py` (Line 55-67)
*   **事实源**: `audits/FINAL_PIPELINE_VALIDATION_20260404/truth_from_312.json`

## 4. 优化方案 (待执行)
我将立即修改 `resource_adapter.py`，将 `CATEGORY_TO_SUBSYS` 字典升级为“事实对标模式”：
1. **修正 Key**: 将按钮和灯光映射至 `InteractiveSys`。
2. **注入 Desc**: 建立 `SUBSYS_CONFIG` 全局变量，包含 `{"key": "...", "desc": "..."}` 的结构，确保序列化时 100% 还原标准文件的丰富度。

**结论**: 您的直觉是正确的，`resource_adapter.py` 中的硬编码确实与标准文件存在脱节，尤其是在交互系统归类和中文描述补全上。
