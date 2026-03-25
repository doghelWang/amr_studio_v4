# 0325 评审问题优化方案 (Phase 2)

本方案旨在解�?0325 评审中发现的交互冲突、筛选逻辑过于严格以及稳定性问题�?
## 用户评审问题
1. **弹窗层级冲突**: 命名确认弹窗被资源库弹窗遮挡�?2. **轮组筛选过�?*: 部分有效轮组因文件名不含特定关键词而被过滤�?3. **分类模式推广**: 将动力系统的（轮组、驱动器等）分类逻辑推广到感知、控制等所有步骤�?4. **前端稳定�?*: 分类标签显示不稳定的问题修复�?
## 拟进行的修改

### [ComponentLibraryStep.tsx](file:///d:/code/py-sim-web/amr_studio_v4/frontend/src/components/wizard/ComponentLibraryStep.tsx)
- **[MOD] 弹窗逻辑**: �?`NamingModal` 设置显式�?`zIndex: 1050`（AntD 默认 Modal �?1000），确保其始终在资源库选择器之上�?- **[MOD] 筛选算法重�?*: 
  - 弃用单一的文件名关键词匹配�?  - 结合 `moduleGroupName` �?`type` 进行模糊匹配（如 `drive_wheel` 也应被视�?`diff` 的备选）�?  - 增加“显示全部”切换开关，允许用户在自动过滤失败时手动查找�?- **[MOD] 全局子分类推�?*:
  - **感知 (SENSOR)**: Lidar, Camera, Ultrasonic, IMU, TOF (已初步实现，需增强稳定�?�?  - **控制 (CONTROL)**: Controller, IO Board, Communication.
  - **动力 (POWER)**: Wheel, Driver, Encoder.
- **[FIX] 稳定性优�?*: 
  - 确保 `activeSubCategory` 在步骤切换时正确初始化�?  - 缓存 `currentStepInfo` 以防止由于异步加载导致的标签消失�?
### [ImportService.ts](file:///d:/code/py-sim-web/amr_studio_v4/frontend/src/store/ImportService.ts)
- **[MOD] 标签强化**: 在解析时为组件打上更细粒度的 `subCategory` 标签，方便前端直接用�?Tabs 过滤，减少正则匹配带来的不确定性�?
## 验证计划
1. **交互验证**: 在打开资源库后点击“添加”，确认命名弹窗弹出在最前方�?2. **过滤验证**: 切换底盘驱动类型�?`OMNI_WHEEL`，确认麦轮模块在动力系统中可见�?3. **分类验证**: 切换至“感知”和“控制”步骤，确认对应的子�?Tab 均能正常显示且功能正确�?4. **回归测试**: 确保之前的“偏移量联动”和“性能参数”功能依然正常�?
