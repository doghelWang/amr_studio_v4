---
name: CModel Tree Analyzer
description: 解析反序列化后的 JSON 模型，并输出结构化的 Markdown 节点树报告。
---

# CModel Tree Analyzer Skill

此技能用于深度分析 312 系列机器人的模型结构，将复杂的 JSON 数据转换为易读的文档。

## 使用方法

### 命令行运行
```bash
python3 backend/skills/model_tree_analyzer/scripts/json_to_md_tree.py <path_to_json> [-o <output_md>]
```

## 功能说明
- **层级分析**: 识别底盘、轮组、传感器等硬件节点的父子关系。
- **属性提取**: 自动解析 `Identity`, `Attributes`, `Interfaces` 和 `Relations`。
- **工业规格**: 对应处理 Double, Int32, String 和 Combox 等多种工业属性类型。
- **可视化**: 生成包含 Markdown 标题、列表和引用块的结构化报告。
