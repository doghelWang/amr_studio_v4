---
name: Protobuf Model Deserializer
description: 将二进制 .model 文件转换为可读的 JSON 格式。
---

# Protobuf Model Deserializer Skill

此技能允许用户对 CModel 中的二进制模型文件（如 CompDesc.model）进行反序列化。

## 使用方法

### 命令行运行
```bash
python3 backend/skills/model_deserializer/scripts/deserialize_model.py <path_to_model> [-o <output_json>]
```

## 功能说明
- 使用 `blackboxprotobuf` 处理未知的二进制协议。
- 自动将 bytes 字段转换为可读的字符串或十六进制。
- 递归处理所有嵌套消息。
