# AMR Studio V4 前端 — 待办事项

> 更新时间：2026-03-24

---

## 🔴 优先级 — 高

- [ ] **实现 AbilityStep 能力映射编辑器**
  - 基于 `controller_model_abi_set.proto` 定义
  - 支持导航能力（navi）、安全能力（safety）、逻辑能力（logic）映射
  - 当前 `AbilityStep.tsx` 为占位符

- [x] **Import/Export 端到端往返测试**
  - 使用真实 `.cmodel` 文件进行 import → export → re-import 测试
  - 验证所有 proto 字段无损保留（interfaceAbility, shape, disabled, deprecated, constraints 等）

- [ ] **完善 `master_registry.json`**
  - 从 `CompDesc.json` 和 `AbiSet` 语义文件生成完整组件注册表
  - 包含各组件类型的 `privateAttrGroups` 和 `interfaces` 模板

---

## 🟡 优先级 — 中

- [ ] **AuditStep 校验规则增强**
  - 接口连线完整性检查
  - 驱动类型与组件匹配验证
  - 能力映射完整性检查

- [x] **WiringStep 连线编辑功能**
  - 使用 PLC 风格 Bus-Slave 拓扑重新实现
  - 支持基于主控端口的可视化分组

- [x] **组件库添加模板选择 (Step 3 Complete)**
  - [x] ComponentLibraryStep "新增" 按钮已集成资源库（Registry）。
  - [x] 实现了顺次装配引导（9步法）。
  - [x] 支持 Alias 与 Name 双重命名机制。

- [x] **浏览器 UI 验证**
  - 确认暗色主题、玻璃态效果、动画在实际浏览器中正常渲染
  - 彻底解决 CORS 跨域问题
  - 消除 Ant Design v5 所有弃用警告

---

## 🟢 优先级 — 低

- [ ] **撤销/重做 UI 按钮**
  - `useUndoRedo()` hook 已就绪，需在头部添加操作按钮

- [ ] **自动保存状态指示器**
  - 基于 `isDirty` 状态显示保存/未保存状态

- [ ] **响应式布局适配**
  - 侧边栏在小屏幕上自动折叠

- [ ] **国际化 (i18n)**
  - 当前中文硬编码，后续提取为语言包
