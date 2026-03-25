# [0325] AMR Studio V4 优化方案设计

针对 0325 人工检查提出的 6 项核心问题，本方案旨在提升向导配置的逻辑完备性、视觉专业度及交互效率。

## 📍 核心改进目标

1. **底盘参数联动**: 实现 `headOffset/tailOffset` 与 `chassisLength` 的双向实时联动。
2. **动力系统图解**: 在添加/配置轮组时提供直观的图文原理说明。
3. **组件库精细化管理**: 引入子类别、搜索功能，并实现基于底盘类型的智能组件过滤。
4. **属性与高级配置回归**: 补全底盘的关键运行指标（速度、加速度等）及高级开关。

---

## 🛠️ 详细优化措施

### 1. 底盘参数逻辑增强 (Identity & Store)
- **双向联动算法**:
  - 修改 `useProjectStore.ts` 中的 `setIdentity` 函数。
  - 当 `headOffset` 改变时，自动计算 `tailOffset = chassisLength - headOffset`。
  - 当 `leftOffset` 改变时，自动计算 `rightOffset = chassisWidth - leftOffset`。
  - 确保类型转换安全。

### 2. 动力系统图景化 (Step 5)
- **[NEW] 轮组示意图组件**: 开发 `WheelTypeDiagrams.tsx`，使用 SVG 绘制差速 (Diff)、舵轮 (Steer) 及麦克纳姆轮 (Omni) 的受力与转动原理图。
- **引导式布局**: 在 `PowerSystemStep` 中，根据当前选择的轮组类型展示对应的示意图与配置提示，而非简单的文字提示。

### 3. 组件库 (Step 3) 交互重构
- **[NEW] 搜索与过滤**:
  - 在 `ComponentLibraryStep` 模态框中集成实时搜索框（针对别名和类型）。
  - **组件分级**: 将单一的列表拆分为 Tab 或二级菜单（如：感知控避障 -> 激光/超声波/相机）。
- **智能过滤**: 
  - 轮组展示将优先根据 `Identity.driveType` 过滤出兼容的模块。
  - **手动创建**: 增加“手动定义模块”入口，支持用户在库中没有对应硬件时，通过参数表单直接定义一个虚拟模块。

### 4. 缺陷修复 (Bugs)
- **轮组命名冲突**: 修复 `addComponent` 逻辑中，轮组模块被误赋予 `incrementalEncode` 别名的 Bug（检查 `master_registry.json` 或 `addModule` 映射）。
- **底盘运行参数丢失**: 在 `ChassisStep.tsx` 中恢复 `maxSpeed`, `maxAccel`, `maxDecel` 等字段的显示，并增加“高级配置 (Advanced)”折叠面板。

---

## 📈 验证计划

1. **零起点建车验证**: 从 Identity 开始，检查 `headOffset` 修改后 `tailOffset` 是否即时联动。
2. **组件库交互验证**: 输入关键词搜索模块，检查轮组是否受底盘类型约束过滤。
3. **命名验证**: 添加一个差速轮，检查其名称是否为 `diffWheel_X` 而非 `encoder`。
