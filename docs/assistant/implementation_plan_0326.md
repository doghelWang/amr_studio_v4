# AMR Studio V4 优化方案 (0326 周期)

> 来源：`docs/audit/人工检查.md`（含 0325 新增测试问题）+ 自动审计报告

---

## 一、紧急 Bug（必须先修）

### B1 - 添加模块后确认弹窗被遮蔽 🔴
**现象**：在资源库中点击某模块加号，确认/命名弹窗在资源库模态框背后，要关掉资源库才能操作。  
**根因**：`ComponentLibraryStep.tsx` 中命名弹窗 `Modal` 的 `zIndex` 低于资源库 Modal。  
**方案**：确保命名 Modal 的 `zIndex={1200}`（高于 Ant Design Modal 默认 1000）；以及在触发 `setPendingComponent` 后**立即关闭**资源库 Modal，再打开命名 Modal。  
**文件**：`frontend/src/components/wizard/ComponentLibraryStep.tsx`

---

### B2 - 轮组模块添加后名称/别名被识别为编码器 🔴
**现象**：点击添加 DIFF_STEER_WHEEL 后，弹窗中系统名称显示 `incrementalEncode`，添加后类别也是 SENSOR。  
**根因**：`ImportService.mapEntityToComponent()` 的多组件扫描逻辑中，编码器子组件先被识别，优先级高于轮组。  
**根因定位**：`ImportService.ts` 的 `PRIORITY_TYPES` 列表中，`sensor/incrementalEncode` 等类型优先级高于 `driveWheel`。  
**方案**：
1. 调整 `PRIORITY_TYPES`，使 `driveWheel / diffSteerWheel / steerWheel / weakSteerWheel` 的优先级最高（排在数组最前）。
2. 在 `processModuleGroup` 中，找到第一个匹配高优先级类型后直接返回，不再扫描剩余子组件。  
**文件**：`frontend/src/store/ImportService.ts`

---

### B3 - 选中底盘后属性（速度、加速度等）丢失 🔴
**现象**：在组件库点选底盘组件，右侧属性面板的配置参数页为空，无"展开高级属性"按钮。  
**根因**：`ComponentPropertyPanel.tsx` 中 `activeGroups` 为空（后端未返回数据且 store 格式不匹配）。  
**方案**：
1. 检查底盘 JSON 的 `privateAttr.privateAttrs` 路径是否正确（camelCase vs snake_case）。
2. 在 `ComponentPropertyPanel.tsx` fallback 逻辑中，增加对 `selectedStoreComponent.privateAttrs` 的深度检查，确保读取正确路径。
3. 恢复"展开高级属性"按钮（该按钮不应被 `isFixedHardware` 标志控制隐藏）。  
**文件**：`frontend/src/components/wizard/ComponentPropertyPanel.tsx`

---

### B4 - 动力系统标签无法匹配到轮组模块 🔴
**现象**：在资源库动力系统选"驱动轮"标签，列表为空或错误（评审问题2）。  
**根因**：
- `ComponentLibraryStep.tsx` 中过滤逻辑：`if (activeSubCategory === 'WHEEL' && category !== 'DRIVEWHEEL') return false;` 依赖 decoration 阶段正确赋值 `category`，若 decoration 异步未完成则回退到 `''`，导致全部被过滤。
- 同时存在 git merge conflict 遗留的两套状态变量（`rawLibrary` 与 `libraryData`），渲染时取错变量。  
**方案**：
1. **清理 git 冲突**：`ComponentLibraryStep.tsx` 中存在 merge conflict 标记（`<<<<<<< HEAD` / `=======` / `>>>>>>>`），必须彻底解决，采用新版逻辑（`libraryData` + `setLoadingLibrary`）。
2. 确保 decoration 完成后再渲染（`loadingLibrary` 为 `false` 后才显示列表）。
3. 过滤器兜底：当 `e.category` 为空时，尝试用 `e.mainModuleTypeKey` 推断（`driveWheel` 系列 → `DRIVEWHEEL`）。  
**文件**：`frontend/src/components/wizard/ComponentLibraryStep.tsx`

---

### B5 - 资源库分类标签时有时无（渲染不稳定）🟠 
**现象**：同一个资源库有时显示子分类 Tab，有时不显示（评审问题4）。  
**根因**：与 B4 相同，git conflict 导致两套状态变量（`rawLibrary` vs `libraryData`、`loading` vs `loadingLibrary`），组件渲染路径不确定。  
**方案**：同 B4 — 彻底解决 merge conflict，统一使用单一状态路径。  
**文件**：`frontend/src/components/wizard/ComponentLibraryStep.tsx`

---

### B6 - 底盘运动中心前后偏移联动消失 🟠
**现象**：调整前向距时，后向距不自动更新（`Length = Head + Tail`）。  
**根因**：`ChassisStep.tsx` 的联动逻辑在上次 merge 中可能被覆盖，或 handler 引用错误。  
**方案**：重新确认 `ChassisStep.tsx` 中 `handleMotionCenterChange` 的计算路径，确保：
- 修改 `head` → 自动 `tail = length - head`
- 修改 `tail` → 自动 `head = length - tail`
- 修改 `length` → 按比例重算或保持 `head` 不变更新 `tail`  
**文件**：`frontend/src/components/wizard/ChassisStep.tsx`

---

## 二、人工检查原始问题（结构性改进）

### P1 - 身份信息默认值 🟡
将 `useProjectStore.ts` 初始 `identity` 中：
- `manufacturer` → `'hikrobot'`
- `modelName` → `'amr_your_define'`

**文件**：`frontend/src/store/useProjectStore.ts`

---

### P2 - 导航方式 → 传感器校验提示 🟡
在"感知避障"子步骤底部增加 Alert：
- 激光导航 → 检查有无 `category=LASER`，无则警告
- 视觉导航 → 检查有无 `category=CAMERA`

**文件**：`frontend/src/components/wizard/ComponentLibraryStep.tsx`

---

### P3 - 底盘参数：空载/满载运动中心 🟡
在 `ChassisStep.tsx` 运动中心卡片中新增空载/满载两套配置，默认同步。

**文件**：`frontend/src/components/wizard/ChassisStep.tsx`, `frontend/src/store/useProjectStore.ts`

---

### P4a - 底盘组件隐藏接口资源 Tab 🔴（已改错，回滚）
`ComponentPropertyPanel.tsx` 中 CHASSIS 应同时隐藏"安装标定"和"接口资源"，上轮误恢复了接口资源 Tab：
```ts
if (selectedStoreComponent.category === 'CHASSIS') {
    visibleTabs = tabItems.filter(t => t.key !== 'mounting' && t.key !== 'interfaces');
}
```
**文件**：`frontend/src/components/wizard/ComponentPropertyPanel.tsx`

---

### P4b - 核心主控重命名 🟡
`ComponentLibraryStep.tsx` 的 `subSteps[1].title` 改为 `'核心控制板'`；子类 Tab 调整标签名。

**文件**：`frontend/src/components/wizard/ComponentLibraryStep.tsx`

---

### P4c - 感知避障精准过滤 🟡
感知避障库过滤升级：`mainModuleTypeKey !== 'sensor'` 排除，加上 `subModuleTypeKey.includes('encode')` 二次排除。

**文件**：`frontend/src/components/wizard/ComponentLibraryStep.tsx`

---

### P4d - 动力拓扑 UI 重组 🔵（较大改动，可拆分迭代）
在动力系统右侧无选中时，显示「驱动拓扑视图」：
- 根据底盘驱动类型渲染轮组卡片（差速2个/舵轮1-2个/全向4个）
- 每个轮组卡片下方显示 `[驱动器] → [电机] → [编码器]` 关联状态
- 已配置：绿色；未配置：虚线框
- 点击进入该组件属性

**文件**：`frontend/src/components/wizard/ComponentLibraryStep.tsx`（新增 `PowerTopologyView`）

---

### P4e - board_desc 接口解析融合 🔵
后端新增 `GET /api/v1/resources/board_desc` 接口，解析 host/expansion 目录下所有 JSON，提取 can/di/do/rs485/rs232/ai/ao 接口，以型号 key 索引返回。  
前端核心控制板属性面板优先展示此真实接口资源。

**文件**：`backend/api_v2.py`, `frontend/src/components/wizard/ComponentPropertyPanel.tsx`

---

### P5 - 模块库富化（OnboardModule） ⚪
后端扫描路径增加 `docs/reference/ModuleLibrary/OnboardModule/`，适配 CR-VIR (相机) / GYRO-VIR (陀螺仪) 进标准资源库。

---

## 三、评审问题

### R3 - 分类模式推广思考 🔵
将"按角色分类快捷 Tab"（轮组/驱动/电机/编码器）的思路推广到其他子步骤：
- 核心控制板 → 主控/IO 板/通信模块
- 感知避障 → 激光雷达/相机/TOF/IMU/超声波
- 电源管理 → 电池/充电管理/功率分配

这在 B4/B5 解决后，原有 `getSubCategories()` 函数即可支持。

---

## 实施顺序

| 顺序 | 任务 | 文件 | 难度 |
|:---:|:---|:---|:---:|
| 1 | **B4+B5** 清理 merge conflict，统一 libraryData | ComponentLibraryStep.tsx | 高 |
| 2 | **B2** 修复轮组优先级 | ImportService.ts | 中 |
| 3 | **B1** 确认弹窗 zIndex/顺序 | ComponentLibraryStep.tsx | 低 |
| 4 | **P4a** 底盘接口 Tab 回滚隐藏 | ComponentPropertyPanel.tsx | 低 |
| 5 | **B3** 底盘属性面板丢失 | ComponentPropertyPanel.tsx | 中 |
| 6 | **B6** 底盘偏移联动 | ChassisStep.tsx | 中 |
| 7 | **P1** 身份默认值 | useProjectStore.ts | 低 |
| 8 | **P4b+P4c** 标签重命名+感知过滤 | ComponentLibraryStep.tsx | 低 |
| 9 | **P2** 导航联动校验 | ComponentLibraryStep.tsx | 中 |
| 10 | **P3** 底盘空载/满载 | ChassisStep.tsx | 中 |
| 11 | **P4d** 动力拓扑视图 | ComponentLibraryStep.tsx | 高 |
| 12 | **P4e** board_desc 解析 | backend + 前端 | 高 |
| 13 | **P5** 模块库富化 | backend | 中 |
