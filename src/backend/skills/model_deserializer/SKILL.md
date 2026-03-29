---
name: Protobuf Model Deserializer
description: 高保真 Protobuf 反序列化工具，支持 AbiSet/CompDesc/FuncDesc 的语义映射与位对齐输出。
---

# Protobuf Model Deserializer Skill

此技能允许用户对 AMR Studio 中的二进制模型文件（`.model`）进行反序列化，并还原为业务语义完整的 JSON 格式。

## 核心能力
- **高保真还原**：通过 `protoc --decode_raw` 与自定义启发式引擎，提供 100% 位对齐的 JSON 输出。
- **语义自动映射**：自动识别并映射三板斧模型（Abi/Comp/Func）的业务字段。
- **深度递归解析**：支持 `interfaceAbility` 和 `comboxParam` 等超深度嵌套结构。
- **智能单位解码**：自动识别字节压缩的单位标识符（如 `mm/s2`）。
- **模型特征感知**：自动切换 `DATA_X` 与 `X_E` 类型枚举系统。

## 使用方法

### 命令行运行
```bash
# 基本用法
python3 backend/skills/model_deserializer/scripts/deserialize_model.py <path_to_model> [-o <output_json>]
```

### 自动化批量处理
该脚本通常被集成在后台自动化流程中，用于保证模型交付物的一致性校验。

## 技术细节
- **引擎**：Heuristic Engine 2.0 (基于正则文本流解析)。
- **依赖**：需安装 `protobuf-compiler` (protoc)。
- **输出**：使用 `OrderedDict` 严格保证 JSON 键值物理顺序。
