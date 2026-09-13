# AMR Studio V4 重构 Sprint 1 计划

日期：2026-04-22
周期：1 周
团队规模：3 人
来源：基于 `REFACTOR_REVIEW_REPORT_20260422.md` 的裁剪执行方案

## 1. Sprint 目标

本 Sprint 不追求完成“大重构”，而追求三项确定性成果：

- 建立可执行的重构护栏
- 冻结关键契约与默认值规则
- 完成一个最小结构拆分试点

Sprint 结束时，团队应至少能回答：

- 哪些协议行为绝不能改
- 什么是唯一 canonical model
- 哪些默认值是 Schema 决定，哪些是 UX 决定
- 哪条导入导出链路可以作为每日回归
- 三个人下周分别从哪里继续推进

## 2. 范围

### 2.1 包含

- 仓库主战区识别与冻结
- 契约清单整理
- 黄金样本回归清单整理
- 最小后端拆分试点
- 最小前端领域拆分试点

### 2.2 不包含

- 全量目录迁移
- Monorepo 改造
- 全量 UI 重做
- 全量 schema-runtime 生成化
- 历史审计目录全面治理

## 3. 角色分工

### 成员1：协议与测试基线 Owner

职责：

- 梳理导入、导出、roundtrip、后端编译相关测试
- 选定黄金样本
- 输出契约冻结清单
- 搭建最小回归命令集

写集建议：

- `tests/`
- `docs/`
- 必要时少量 `scripts/`

交付物：

- `docs/CONTRACT_FREEZE_BASELINE.md`
- `docs/GOLDEN_FIXTURE_MATRIX.md`
- 最小回归执行说明

### 成员2：后端应用层 Owner

职责：

- 识别 `main.py` 中的用例边界
- 设计并实现最小拆分试点
- 优先抽出 compile/export 相关应用服务

写集建议：

- `src/backend/main.py`
- `src/backend/app/` 新目录
- 必要时 `src/backend/core/`

交付物：

- `compile_project` 用例服务雏形
- 路由层薄化试点
- 不改变外部 API 的前提下通过现有回归

### 成员3：前端领域拆分 Owner

职责：

- 识别 `App.tsx` 与 `useProjectStore.ts` 中的非状态逻辑
- 抽出一组领域纯函数或 usecase
- 为后续 feature/domain 分层做试点

写集建议：

- `src/frontend/src/App.tsx`
- `src/frontend/src/store/useProjectStore.ts`
- `src/frontend/src/domain/` 或 `src/frontend/src/application/` 新目录

交付物：

- 导入导出流程中至少一段逻辑完成“从组件/store 中抽离”
- 不改变现有行为

## 4. 第一周任务拆解

### Day 1：基线冻结

- 盘点当前主代码路径、冻结区、样本区、运行产物区
- 输出重构主战区说明
- 初步选定黄金样本项目

验收：

- 团队对“哪里能动、哪里先不动”达成一致

### Day 2：契约冻结

- 梳理 4 层模型：
  - UI Config
  - Canonical Domain Model
  - Protocol JSON
  - Proto Binary
- 新增两张决策表：
  - 默认值策略表
  - 兼容策略表
- 新增一张事实源表：
  - Proto / RobotConfig / blueprint / module JSON / schema / board interface 的 owner 与派生关系

验收：

- 团队对默认值、兼容逻辑和事实源有统一口径

### Day 3：测试护栏

- 整理已有 tests，区分：
  - 真正回归护栏
  - 研究脚本
  - 历史审计
- 选定 Sprint 期间必须常绿的最小回归集
- 增加一条严格校验路径，避免只依赖兼容式导出成功

验收：

- 至少有一套明确的“改动前后都要跑”的回归组合

### Day 4：后端试点

- 从 `main.py` 中抽离 compile/export 相关用例服务
- 保持 API 兼容

验收：

- 现有后端回归通过
- 路由复杂度下降

### Day 5：前端试点

- 从 `App.tsx` 或 `useProjectStore.ts` 中抽离一段领域逻辑
- 保持现有交互行为

验收：

- 现有核心流程可运行
- 新结构被证明可行

## 5. Sprint 验收标准

本 Sprint 完成的判定标准如下：

- 有正式的契约冻结文档
- 有正式的黄金样本和最小回归清单
- 后端至少完成一处应用层抽离试点
- 前端至少完成一处领域逻辑抽离试点
- 所有试点不破坏导入/导出核心链路

## 6. 风险与应对

### 风险1：测试不稳定，无法充当护栏

应对：

- 先区分“可自动跑的回归”与“人工验证脚本”
- 不强求第一周全量纳管

### 风险2：默认值策略争议过大

应对：

- 先固化决策表
- 未确认部分标记为兼容策略，不在 Sprint 1 内强改

### 风险3：三人写集冲突

应对：

- 明确写集边界
- 文档与契约由成员1集中维护
- 后端和前端试点尽量不交叉改同一文件

## 7. Sprint 结束后进入 Sprint 2 的条件

只有在以下条件满足后，才建议进入更深一层的结构重构：

- 最小回归集稳定
- 契约冻结得到团队认可
- 后端和前端试点都证明结构拆分可行
- 团队对默认值/兼容策略没有重大分歧

若上述条件未满足，应继续巩固 Sprint 1，而不是贸然进入大规模迁移。
