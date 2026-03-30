# Skill: AMR-CModel-Deep-Auditor (Integrated V3.0)

## 1. 技能概述
本技能是 AMR Studio V4 的最高审计准则，整合了原有的“解析、分析、属性审计、Schema 验证”四大能力。其核心使命是：**通过比特级逆向工程，确保生成的 CModel 与工业标准 100% 对齐。**

## 2. 核心功能模块 (Operational Modules)

### M1: 物理层级还原 (Core Parsing)
- **职责**：将 `.cmodel` (ZIP) 物理拆解，并将内部的二进制 `.model` 流无损还原为 Tag 字典 JSON。
- **基准工具**：`tests/unit/true_parser_impl.py`

### M2: 全量节点对标验证 (Exhaustive Alignment Verification)
- **职责**：自动加载“标准成果物”与“当前生成物”，执行全量路径对等扫描。
- **强制要求**：报告必须逐节点体现两者的异同。**严禁仅输出差异点**，必须包含所有对齐一致的节点信息，以确证审计的完整性（Zero-Omission）。
- **核对维度**：
  - 物理字符串标识符命中。
  - Tag 逻辑路径深度。
  - 数值、类型及编码的一致性。
- **标准产出**：`audits/ULTIMATE_FULL_NODE_REPORT.md`

### M3: Schema 合规性审计 (Deep Node Analysis)
- **职责**：针对特定节点（如底盘 root），校验其是否具备必需的工业元数据（Tag 7/8）以及属性偏移（Tag 2 vs Tag 5）。

## 3. 强制审计流程 (Mandatory Execution Workflow)
1. **环境准备**：清理 `audits/temp`。
2. **双路解析**：同时还原标准样本与当前产物。
3. **执行 Diff**：运行 `tests/system/cmodel_diff_engine.py`。
4. **输出报告**：给出 PASS/FAIL 结论及差异列表。

## 4. 调试指令
- 全量审计：`auditor --compare {std_path} {gen_path}`
- 深度节点探测：`auditor --inspect {node_uuid}`
