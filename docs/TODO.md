# AMR Studio V4 前端 — 待办事项

> 更新时间：2026-03-21

---

## 🔴 优先级 — 高

- [ ] **实现 AbilityStep 能力映射编辑器**
  - 基于 `controller_model_abi_set.proto` 定义
  - 支持导航能力（navi）、安全能力（safety）、逻辑能力（logic）映射
  - 当前 `AbilityStep.tsx` 为占位符

- [ ] **Import/Export 端到端往返测试**
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

- [ ] **WiringStep 连线编辑功能**
  - 当前仅展示接口列表
  - 需添加可视化连线和 `linkedInterfaceUuid` 编辑

- [ ] **组件库添加模板选择**
  - ComponentLibraryStep "添加" 按钮应提供具体型号模板（从 registry 选择）
  - 替换当前通用 `default` 类型

- [ ] **浏览器 UI 验证**
  - 确认暗色主题、玻璃态效果、动画在实际浏览器中正常渲染

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
