# AMR Studio V4 0326 晚间优化与功能扩展计�?
本计划旨在响应用户新提出的“手动创建器件”、“导�?cmodel”以及“总线扩展”需求，并继续完成坐标可视化精准渲染�?
## 用户评审需�?(追加)
- [ ] **手动创建器件**：在资源库中增加手动创建入口，跳过库筛选直接填参�?- [ ] **导出 cmodel**：在审计页面（Step 7）增加导出功能，将当前配置导出为标准�?`.cmodel` (CompDesc JSON)�?- [ ] **总线扩展**：增�?`RS485` �?`NETWORK` (Ethernet) 两类总线�?
## 方案设计

### 1. 基础扩展 (F3)
- **修改文件**：`frontend/src/store/types.ts`
- **内容**：在通信类型中增�?`RS485` �?`NETWORK`�?- **UI 适配**：检�?`WiringStep.tsx` 及属性面板，确保这些类型在下拉框中可选�?
### 2. 组件库优�?(F1 & P5)
- **修改文件**：`frontend/src/components/wizard/ComponentLibraryStep.tsx`
- **内容**�?    - 增加“手动创建组件”按钮，弹出分类选择器�?    - 选择分类后跳转至“命名Modal”，直接完成添加�?- **自动解析 (P4e)**：在 `addComponentFromConfig` 时，判断是否为核心板（CPU/IO），自动匹配 `board_desc` 目录下的 JSON 进行接口注入�?
### 3. 配置导出 (F2)
- **修改文件**：`frontend/src/components/wizard/AuditStep.tsx`
- **内容**�?    - 增加 `DownloadOutlined` 按钮�?    - �?`useProjectStore` 中的 `config` 全局状态进行清理并下推�?JSON 文件�?
### 4. 坐标精准渲染 (P6)
- **修改文件**：`frontend/src/components/visualizer/CoordinateVisualizer.tsx`
- **内容**�?    - **轮组**：增加方向箭头，区分�?后�?    - **激�?*：优化扫描扇区透明度及原点标识�?    - **按钮**：增加更明显的图标或颜色标记�?
## 验证计划

1. **手动创建**：验证是否能直接添加一个库里没有的"通用组件"�?2. **导出功能**：点击导出，检查生成的 JSON 是否符合格式�?3. **总线验证**：在连线页面确认能否建立 RS485 连接�?4. **可视化检�?*：在俯视图确认轮组和组件的方向性�?
