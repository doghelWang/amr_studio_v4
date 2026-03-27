# Skill: AMR-Lossless-Roundtrip-Expert

## 1. 技能概述
本技能负责处理工业级 `.cmodel` 模型的双向解析与重构，核心指标是 **100% 结构保真** 与 **0 字节非预期损耗**。

## 2. 专用操作规范
- **解析层 (Scavenging)**：
  - 使用 `MessageToJson` 必须带上 `always_print_fields_with_no_presence=True` 以防字段裁剪。
  - 使用贪婪模式适配 CamelCase 与 SnakeCase 历史遗留问题。
- **构建层 (Reconstruction)**：
  - 采用“原树注入 (Structural Fidelity)”策略，严禁拍平或重新生成树状结构。
  - 强制执行 `proto_final_sync` (Last-Mile Normalization) 对齐官方 CamelCase 键名。
- **合并层 (Merging)**：
  - 执行 `deep_update` 时必须按 `key` 或 `type` 进行主键匹配，保护非编辑字段。

## 3. 校验链路
- 必须包含 `Pre-Export Integrity Audit` 实时值核对。
- 必须包含 `Full-Tree Diff Audit` (vs .bak) 差异分析。
