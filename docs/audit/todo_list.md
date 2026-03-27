# 待办事项清单表 (Backlog)

## 🔴 高优先级 (High Priority)
- [ ] **开发 AbilityStep 能力映射 UX**
    - 目标：将 `controller_model_abi_set.proto` 中的逻辑能力映射到可视化界面。
    - 关键点：支持导航（navi）、安全（safety）和逻辑（logic）的勾选与参数配置。
- [ ] **完善 `master_registry.json` 自动化生成**
    - 目标：从现有 `CompDesc.json` 和 `AbiSet` 语义文件中提取所有已知组件模板。
    - 关键点：确保包含每个组件类型的 `privateAttrGroups` 默认值和接口定义。

## 🟡 中优先级 (Medium Priority)
- [ ] **AuditStep 校验规则库扩充**
    - 目标：增加业务级的逻辑校验。
    - 内容：CAN 节点 ID 冲突检查、波特率一致性验证、驱动器与电机类型匹配度审计。
- [ ] **实现模型版本 Diff 功能**
    - 目标：允许用户对比当前配置与原始 `.cmodel` 文件的差异。
    - 关键点：高亮显示变更字段及其数值变化。

## 🟢 低优先级 (Low Priority)
- [ ] **前端 UI 细节抛光**
    - 添加 Undo/Redo 顶部快捷按钮。
    - 实现自动保存状态的即时指示器（Saved/Saving）。
    - 关键响应式布局适配（Pad/Mobile 兼容性）。
- [ ] **多语言 (i18n) 迁移**
    - 提取 hardcoded 字符串到翻译文件，准备支持英文版。

## ⚪ 技术债务 (Technical Debt)
- [ ] 后端 `splitter` 逻辑优化：减少小文件产生的磁盘 IO 损耗，考虑引入 Redis JSON 缓存。
- [ ] 前端 `App.tsx` 中的 `ImportService` 逻辑进一步解耦，提取为独立的 Hook。
