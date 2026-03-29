# CModel 协议深度映射与临时策略（Hacks）审计档案 (2026-03-28)

## 一、 标准模型 (ModelSet312) 语义映射表
通过对标准二进制流的逆向解构，确定的官方 Tag 职责如下：

| Tag | 语义 Key | 数据类型 | 规范要求 |
| :--- | :--- | :--- | :--- |
| 1 | `key`/`name` | String | 必须存在，作为节点索引 |
| 2 | `type`/`desc` | Int32/Str | 定义属性性质 |
| 4 | `module_componets`| Message | **注意拼写**：官方 Proto 缺失了 'n' |
| 5 | `more_module_info`| Message | 递归树的根基 |
| 8 | `interface_group` | Message | 物理总线与引脚定义 |
| 10| `stringValue`/`uuid`| String | 核心值载体 |
| 17| `doubleValue` | Double | 坐标与精度参数 |
| 50| `unit` | String | 物理单位，严禁缺失 |
| 51| `desc` | String | 属性描述，用于反向解析显示 |

---

## 二、 当前系统中的临时策略 (Temporary Hacks)
为了通过标准工具校验，系统目前采用了以下“非逻辑化”注入手段。这些手段应在后续开发中逐步被正规化逻辑取代。

### 1. [HACK-ZIP-OS] 物理头伪装
- **位置**: `encoder.py` -> `zipf.open()`
- **描述**: 手动清除 Unix 属性，强行写入 FAT32 标记。
- **正规化方向**: 引入跨平台标准的 CModel 封包工具库。

### 2. [HACK-ROOT-TYPE] 底盘类型强注
- **位置**: `encoder.py` -> `ensure_chassis_type()`
- **描述**: 后端检测到 `chassis-root` ID 后，强制写入 `typeKey: chassis`。
- **正规化方向**: **[正在执行]** 前端在 Step 1 创建机型时，应从标准模板加载该类型定义。

### 3. [HACK-FUNC-BASE] 功能描述静态拷贝
- **位置**: `encoder.py` -> `FuncDesc_base.model`
- **描述**: 由于缺乏动态生成逻辑，目前强制拷贝官方空包。
- **正规化方向**: 构建动态的 FuncDesc 编译器。

### 4. [HACK-SPELLING] 拼写容错
- **位置**: `encoder.py` -> `find_key_recursive`
- **描述**: 兼容 `componets` 与 `components`。
- **正规化方向**: 前端 Store 全量重命名对齐 Proto。

---

## 三、 结论与审计记录
当前成果物已能通过解压，但依赖于后端的注入。下一步目标是将这些注入点前移至业务逻辑层（前端及数据管理层）。
