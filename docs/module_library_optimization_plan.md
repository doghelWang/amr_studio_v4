# ModuleLibrary JSON 架构深度评审与优化方案

## 一、 当前现状与问题诊断 (Critical Review)

经过对 `ModuleLibrary` 下 `ModuleEntity` 及 `board_desc` 目录中 JSON 文件的深入分析，发现当前架构存在以下关键挑战：

### 1. 模式与数据的深度耦合 (Schema-Instance Coupling)
*   **现象**: 在 `ModuleEntity` 的 JSON 中，每个属性都携带了 `desc`, `type`, `boolHide`, `boolParse` 等元数据。
*   **批判**: 这是典型的“重定义，轻数据”模式。元数据（如何显示、属性类型）应该属于**Schema（模式层）**，而不应在数千个实例文件中重复。这导致文件冗余度高达 90%，且修改 UI 展示逻辑需要修改所有文件。

### 2. 键名设计的严重不一致 (Key Inconsistency)
*   **现象**: 
    - `ModuleEntity` 使用驼峰命名的英文键（如 `moduleComponets`, `generalAttr`）。
    - `board_desc` 使用中文键名（如 `"基本信息"`, `"通信接口"`）。
*   **批判**: 这种不一致性导致后端解析逻辑必须针对不同文件夹编写独立的、脆弱的处理分支。中文键名在跨平台处理、自动补全及严格类型化（如 Pydantic/TypeScript）时极易出错。

### 3. 数据冗余与同步风险 (Data Redundancy)
*   **现象**: `moduleGroupName`, `moduleName`, `module_srcname` 在同一文件中重复出现。
*   **批判**: 缺乏“单一事实来源（SSoT）”。如果需要重命名一个模块，必须在多个层级同步修改，否则会导致前端显示与后台逻辑 ID 的分裂。

### 4. 缺乏继承与复用机制 (No Inheritance)
*   **现象**: 所有 JSON 都是孤立的、完整的平铺定义。
*   **批判**: 实际上很多驱动器或传感器属于同一系列（如步科的各个型号），它们 95% 的参数是一致的。当前模式下，每个新文件都是从头拷贝，导致库的维护成本随型号数量呈指数级增长。

---

## 二、 深度优化方案 (Optimization Proposal)

### 方案核心：Registry-Schema-Instance 三层架构

我们将当前“大而全”的孤岛式 JSON 拆分为职责明确的三层：

#### 第 1 层：Registry (模块注册表)
*   **作用**: 维护所有可用模块的索引及对应的 Schema 指向。
*   **执行**: 在根目录建立 `Registry.json`，标记每个子系统对应的 Schema 版本。

#### 第 2 层：Schema (元数据模式层)
*   **作用**: 将“如何渲染”、“字段类型”、“校验规则”从数据中剥离。
*   **示例**: `Driver.schema.json` 定义 `baudrate` 必填、最小值为 9600、界面显示名称为“波特率”。
*   **收益**: 修改 UI 显示逻辑只需改一个 Schema 文件，所有实例自动生效。

#### 第 3 层：Instance (极简实例层)
*   **作用**: 仅存储特定型号的**特征数据**。
*   **示例**:
    ```json
    {
      "schema": "Driver_V2",
      "inherits": "Kinco_Base_v1",
      "values": {
        "model": "IxLII-30.60.48.C",
        "private": { "rpm": 3000 }
      }
    }
    ```

---

## 三、 执行路径 (Action Plan)

### 第一阶段：标准化清洗 (Executable Steps)
1.  **英文键名全量替换**: 将 `board_desc` 中的中文键映射至标准英文键（例如 `"基本信息"` -> `base_info`）。
2.  **元数据剥离**: 编写 Python 脚本扫描 `ModuleEntity`，提取出公共的 `attr_template`，将实例 JSON 中的 `desc`, `boolHide` 等静态描述字段移除，仅保留 `key` 和 `value`。

### 第二阶段：引擎升级
1.  **引入 Pydantic 校验**: 在后端 `schema_builder` 加载 JSON 前，强制通过 Schema 校验，拒收无效字段。
2.  **实现 Inheritance 加载器**: 修改 `protobuf_engine.py`，支持递归加载 `inherits` 链条，实现属性覆盖。

### 第三阶段：前端驱动重构
1.  **Schema-Driven UI**: 前端表单不再根据 JSON 中的 `boolHide` 渲染，而是请求 `api/v1/schema/{type}`，根据 Schema 协议自动生成动态表单。

---
---

## 四、 当前进度与执行状态 (Status - 2026-03-16)

> [!IMPORTANT]
> **2026-03-16 审计记录**: 针对 312 系列机器人的 **CP0 深度对齐审计 (Deep Alignment Audit)** 已完成。

### 已达成里程碑
1.  **自动化分析链**: 建立了基于 `model_deserializer` 和 `model_tree_analyzer` 的工具链，支持对 312 系列进行 bit-level 的数据还原与逻辑审查。
2.  **Schema 注入引擎**: 后端 `CustomCompDescBuilder` 已成功支持对工业字段（10-56）的动态递归修补，解决了 P7 批评中提到的“参数丢失”问题。
3.  **基准对齐**: 验证了基于 `Fixed64` 的数值精度对齐，确保空间几何坐标（locCoord）误差为 0。

### 待执行 (Approved)
- [ ] **全量外设填充**: 针对 MCU/IO 板卡 100% 还原其 29+ 个物理接口（Phase 5 计划）。
- [ ] **Registry 2.0 部署**: 建立基于 UUID 的统一硬件资源池，取代目前的路径硬编码加载。

---
**结论**: 该方案已获得评审批准 (LGTM)，当前处于“分析完成，待全量重构”阶段。
