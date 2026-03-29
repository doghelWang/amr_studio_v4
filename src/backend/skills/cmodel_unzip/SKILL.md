---
name: CModel Decompressor
description: 解压 .cmodel 文件（即 ZIP 存档）。
---

# CModel Decompressor Skill

此技能允许用户方便地解压机器人模型文件 (.cmodel)。

## 使用方法

### 命令行运行
```bash
python3 backend/skills/cmodel_unzip/scripts/unzip_cmodel.py <path_to_cmodel> [-o <output_dir>]
```

## 功能说明
- 自动检测文件是否存在。
- 默认在原文件路径后追加 `_extracted` 作为解压目录。
- 提取所有内部模型文件（如 `CompDesc.model`, `AbiSet.model` 等）。
