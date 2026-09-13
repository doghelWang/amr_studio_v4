"""
AMR Studio V4 CModel Decoder
该模块负责将二进制的 .cmodel 文件还原为可编辑的 JSON 格式。
.cmodel 文件本质上是一个 ZIP 压缩包，内部包含多个 Protobuf 序列化后的 .model 文件：
- CompDesc.model: 机器组件描述 (核心)
- AbiSet.model: 机器人能力/算法配置
- FuncDesc.model: 功能集描述
"""

import zipfile
import json
import os
from pathlib import Path

from app.infrastructure.protobuf.generated import (
    controller_model_abi_desc_pb2,
    controller_model_abi_set_pb2,
    controller_model_comp_desc_pb2,
)
from google.protobuf.json_format import MessageToJson


def _safe_extract(zip_ref, output_dir):
    destination = Path(output_dir).resolve()
    for member in zip_ref.infolist():
        target = (destination / member.filename).resolve()
        if destination not in target.parents and target != destination:
            raise ValueError(f"Archive member escapes output directory: {member.filename}")
        if member.is_dir():
            target.mkdir(parents=True, exist_ok=True)
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        with zip_ref.open(member, "r") as source, target.open("wb") as sink:
            sink.write(source.read())


def _parse_model(path, message_cls, json_path):
    obj = message_cls()
    with path.open("rb") as file_obj:
        obj.ParseFromString(file_obj.read())
    json_path.write_text(
        MessageToJson(obj, always_print_fields_with_no_presence=False),
        encoding="utf-8",
    )
    return len(json_path.read_text(encoding="utf-8"))

def decode_cmodel(cmodel_path, output_dir):
    """
    解码主逻辑：
    1. 解压 .cmodel ZIP 包到临时目录。
    2. 对每个 .model 文件调用对应的 Protobuf 反序列化逻辑。
    3. 将反序列化后的对象映射为 CamelCase (小驼峰) 风格的 JSON。
    """
    audit = []
    zip_size = os.path.getsize(cmodel_path)
    audit.append(f"IMPORT_START: {os.path.basename(cmodel_path)} ({zip_size} bytes)")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
    
    # 执行安全解压，拒绝路径穿越和损坏归档
    try:
        with zipfile.ZipFile(cmodel_path, 'r') as zip_ref:
            _safe_extract(zip_ref, output_dir)
    except (zipfile.BadZipFile, ValueError) as exc:
        raise ValueError(f"Invalid .cmodel archive: {exc}") from exc
        
    # 定义 二进制文件 -> Protobuf 类 -> 目标 JSON 文件 的映射关系
    model_mapping = [
        ("CompDesc.model", controller_model_comp_desc_pb2.Message_Module_Info, "CompDesc.json"),
        ("AbiSet.model", controller_model_abi_set_pb2.Controller_Ability, "AbiSet.json"),
        ("FuncDesc.model", controller_model_abi_desc_pb2.Robot_Description, "FuncDesc.json"),
    ]

    for model_name, pb_class, json_name in model_mapping:
        path = os.path.join(output_dir, model_name)
        if not os.path.exists(path):
            if model_name == "CompDesc.model":
                raise FileNotFoundError("Required CompDesc.model is missing")
            audit.append(f"  - Optional {model_name} is missing")
            continue
        char_count = _parse_model(Path(path), pb_class, Path(output_dir) / json_name)
        audit.append(f"  - Generated {json_name}: {char_count} chars")

    return audit
