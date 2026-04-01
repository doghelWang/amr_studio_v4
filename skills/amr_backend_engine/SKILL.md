---
name: amr_backend_engine
description: "Expert skill for AMR Studio V4 backend operations, focusing on model serialization, de-serialization, and structural fidelity."
---

# Skill: AMR-Backend-Engine-Expert

## 1. 技能概述
本技能封装了后端核心模型处理流水线的操作规范，涉及模型的解码、打散、局部更新与结构保真重构。

## 2. 核心子系统与物理路径
- **CModel Decoder**: `backend/skills_v2/cmodel_decoder/decoder.py`
  - 职责：将二进制 `.model` 转换为 CamelCase 全量 JSON。
- **Model Splitter**: `backend/skills_v2/model_splitter/splitter.py`
  - 职责：将全量 JSON 打散为模块碎片，并生成 `blueprint_CompDesc.json`。
- **CModel Encoder**: `backend/skills_v2/cmodel_encoder/encoder.py`
  - 职责：执行 Structural Fidelity 构建，将碎片 JSON 重新序列化为二进制。

## 3. 操作约束
- **键名对齐**：所有操作必须符合 `docs/ENGINEERING_CONSTRAINTS.md` 中的 CamelCase 标准。
- **合并安全**：调用 `data_manager.py` 执行 `deep_update` 时，必须保留 `type_groups` 等元数据。
- **物理备份**：初始化项目时必须保留 `CompDesc.json.bak`。

## 4. 调试指令
- 检查最近构建日志：`grep "ENCODER_AUDIT" backend/backend_runtime.log`
- 检查磁盘变更：`grep "DISK_AUDIT" backend/backend_runtime.log`
