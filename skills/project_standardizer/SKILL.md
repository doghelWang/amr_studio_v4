---
name: project_standardizer
description: "Standardizes AMR Studio V4 project structure using the 11-dimension classification for documentation and source code."
---

# Skill: AMR-Project-Standardizer

## 1. 技能概述
本技能用于强制规范 AMR Studio V4 项目的物理与逻辑架构。通过 11 维分类法，确保项目从人员设定到系统测试的每一个环节都有据可查、有序存放。

## 2. 标准目录架构 (11-Dimension Structure)
1.  **soul/**: 项目人员角色设定 (Persona, Mindset)。
2.  **skills/**: 基础角色技能设定 (Skill-sets, Tool-configs)。
3.  **requirements/**: 项目需求内容 (PRD, User Stories)。
4.  **specifications/**: 项目原则和基础规范 (Engineering Constraints, Coding Standards)。
5.  **design/**: 项目总体设计、详细设计、伪代码文档。
6.  **src/**: 项目具体实现 (Backend, Frontend, Core Engines)。
7.  **tests/unit/**: 逐个文件/函数级测试代码和报告。
8.  **tests/integration/**: 模块级测试代码和报告。
9.  **tests/system/**: 系统级脚本测试、Web UI 测试方案、用例和报告。
10. **audits/**: 结合需求与测试的阶段性审计结论（以 YYYYMMDD 命名）。
11. **issue_tracker/**: 迭代式更新的问题清单与解决追踪表。

## 3. 操作约束
- **移动而非复制**：整理过程中必须保持 Git 历史连续性。
- **链接更新**：移动文件后，必须扫描并更新 Markdown 内部的交叉引用链接。
- **README 同步**：根目录 README 必须实时反映最新的目录架构。
