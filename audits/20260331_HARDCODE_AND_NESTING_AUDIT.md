# CModel 编码链路硬编码审计报告

**日期**: 2026-03-31  
**审计范围**: `encoder.py`, `resource_adapter.py`, `splitter.py`  
**审计依据**: controller_model_comp_desc.proto (权威协议文件)

---

## 一、审计结论

| 维度 | 发现 | 严重程度 |
|:-----|:-----|:---------|
| 硬编码模块字段名 | encoder.py 30处, resource_adapter.py 6处 | 🔴 严重 |
| 模块嵌套结构差异 | 我方输出=嵌套, 标准=扁平 | 🟡 待确认 |
| 默认值填充 (D-1/D-2) | 已通过模板注入修复 | ✅ 已修复 |
| 文件名换行符 (D-4) | 已修复 | ✅ 已修复 |

---

## 二、硬编码违规清单

### 2.1 encoder.py (30处)

#### 类别 A: 硬编码模板文件名映射 (11处)

```
L135-145: _CATEGORY_FALLBACK 字典
  "chassis" → "diffChassis-Common"
  "drivewheel" → "diffWheel-Common"
  "driver" → "subDriver-Common"  
  "motor" → "subDriver-Common"
  "maincpu" → "mainCPU-Common"
  ...共10个映射项
L166: candidates.append("diffChassis-Common")
```

**问题**: 不同车型的底盘类型不同（差速/舵轮/麦轮），不能假设所有底盘都是 `diffChassis`。新增模块类型时必须同步更新代码。

#### 类别 B: 名称猜测启发式 (6处)

```
L249: if "mcpu" in name or "controller" in name or "mcore" in name:
L252: elif "motor" in name or "driver" in name or "wheel" in name:
L255: elif "bat" in name or "power" in name:
L258: elif "sensor" in name or "laser" in name or "camera" in name or "ls" in name:
L261: elif "button" in name or "lamp" in name or "light" in name:
L264: elif "io" in name or "board" in name or "interface" in name:
```

**问题**: 基于名称子串做类型推断极不可靠。如 `ls` 会匹配到 `false`，`"bat"` 会匹配到 `batch_processor`。

#### 类别 C: 硬编码子系统名 (10处)

```
L251/254/257/260/263/266: 内联构造 subSysType/mainModuleType 字典
L270/271/278/279/285/287: "G_MainController", "ControlSys" 等
```

**问题**: 子系统名（如 `ControlSys`, `SensorSys`）和特定模块名（`G_MainController`）不应出现在编码器逻辑中。

#### 类别 D: 硬编码 G_MainController 注入 (3处)

```
L270: if g.get("moduleGroupName") == "G_MainController":
L278: g["moduleGroupName"] = "G_MainController"
L285: "moduleGroupName": "G_MainController" (fallback inject)
```

**问题**: `standardize_sys_tree` 函数强制注入 `G_MainController` 节点，这应该由模板数据驱动。

### 2.2 resource_adapter.py (6处)

| 行号 | 违规 | 说明 |
|:-----|:-----|:-----|
| L53 | `CHASSIS_GENERAL_ATTR_TEMPLATE` | 硬编码底盘5个字段，模板库已有完整13字段 |
| L105 | `CATEGORY_TO_TYPE_KEY` | 硬编码10个类别→typeKey映射 |
| L119 | `CATEGORY_TO_SUBSYS` | 硬编码10个类别→子系统映射 |
| L155 | `json.loads(json.dumps(CHASSIS_))` | 使用硬编码模板 |
| L253/255 | `"chassis_diff"` | 硬编码底盘组名 |

---

## 三、moreModuleInfo 嵌套结构审计

### 3.1 Proto 定义

```protobuf
message Message_Module_Info {
    string module_group_name = 1;
    string module_group_uuid = 2;
    string module_sys = 3;
    repeated Message_Module_Componets module_componets = 4;
    repeated Message_Module_Info more_module_info = 5;  // 自递归
    string model_version = 6;
}
```

**结论**: `more_module_info` 是自递归字段，协议层面**同时支持扁平和嵌套**两种结构。

### 3.2 结构对比

```
标准文件 (ModelSet312):
  根 (moduleGroupName="")
  ├── chassis_diff          (children=0)
  ├── diffWheel-lft         (children=0)
  ├── diffWheel-right       (children=0)
  ├── driver-left           (children=0)
  ├── driver-right          (children=0)
  ├── motor-left            (children=0)
  ├── G_MainController      (children=0)
  ├── laser-front           (children=0)
  ├── IO module             (children=0)
  └── ... (共19个一级节点)

当前输出 (proj_1234):
  根 (moduleGroupName="1234")
  ├── chassis_diff          (children=0)
  ├── driveWheel_1          (children=1)
  │   └── driver_1          (children=1)
  │       └── walkMotor_1   (children=0)
  ├── driveWheel_2          (children=1)
  │   └── driver_2          (children=1)
  │       └── walkMotor_2   (children=0)
  ├── G_MainController      (children=0)
  └── ... (共8个一级节点)
```

### 3.3 差异影响

| 维度 | 扁平结构 | 嵌套结构 |
|:-----|:---------|:---------|
| 固件兼容性 | ✅ 已验证 | ⚠️ 待验证 |
| 父子关系 | 由 `structParam.parentNodeUuid` 表达 | 由树形层级表达 |
| 模块数量 | N个一级节点 | M个根节点 + 子树 |
| 前端可视化 | 需额外解析 parentNodeUuid | 天然支持树形展示 |

---

## 四、已修复项确认

| 编号 | 问题 | 修复方式 | 验证结果 |
|:-----|:-----|:---------|:---------|
| D-1 | generalAttr 缺失11个字段 | `enrich_from_templates()` 模板填充 | ✅ 13/13 字段对齐 |
| D-2 | interfaceAttrs 缺失 | 模板同步注入 | ✅ IO板20个, 传感器2个 |
| D-4 | 文件名含换行符 | `splitter.py` `.strip()` | ✅ |
