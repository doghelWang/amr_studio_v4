# 待测试事项清单表 (Verification & QA)

## 1. 功能性验证 (Functional Testing)
- [ ] **全链路无损测试 (Round-trip Integrity)**
    - 步骤：导入 `ModelSet312.cmodel` -> 在 UI 中修改 `wheelSpace` -> 导出新文件 -> 比较新旧文件的 Protobuf 结构。
    - 指标：未修改字段必须 100% 保持原样，修改字段在合法范围内。
- [ ] **向导流程完整性**
    - 步骤：从 Step 0 (Identity) 到 Step 6 (Audit) 顺序点击。
    - 指标：每个步骤的数据应正确流转到下一个步骤，且在 `AuditStep` 能看到实时的统计概况。
- [ ] **电气连线逻辑**
    - 步骤：在 `WiringStep` 将一个传感器从总线 A 切换到总线 B。
    - 指标：`ExportService` 生成的 JSON 中 `cascadeRemoteUuid` 应正确更新。

## 2. 边界值与鲁棒性测试 (Boundary & Robustness)
- [ ] **Proto 约束拦截测试**
    - 步骤：在私有属性中输入超出 `float_maxvalue` 的数值。
    - 指标：后端应在 Compile 时拦截并返回 400 错误，前端应高亮显示错误原因。
- [ ] **零 ID/空 UUID 防御测试**
    - 步骤：导入一个缺失关键 UUID 的损坏模型。
    - 指标：前端应通过“零 ID 防御”机制分配临时 ID 保证正常渲染，而非白屏崩溃。
- [ ] **大负荷组件库加载**
    - 步骤：注册表包含超过 100 种组件时的搜索与筛选延迟测试。

## 3. 设计与性能验证 (Design & Performance)
- [ ] **暗色模式视觉审计**
    - 确认在不同显示器下，玻璃态卡片的文字对比度符合 Web AAA 标准。
- [ ] **导出编译延迟**
    - 测量 200+ 组件规模下，后端从请求 Compile 到返回下载链接的响应时间（目标值 < 2s）。
- [ ] **跨平台兼容性**
    - 验证 Chrome, Edge, Safari 对 `useRef` 文件导入机制的兼容性。
