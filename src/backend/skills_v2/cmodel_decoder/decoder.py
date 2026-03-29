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
import sys
import shutil

# 动态添加 Protobuf Schema 路径，确保生成的 _pb2.py 模块可被正确导入
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "schemas_pb"))
try:
    import comp_desc_runtime as controller_model_comp_desc_pb2
    import abi_set_runtime as controller_model_abi_set_pb2
    import abi_desc_runtime as controller_model_abi_desc_pb2
except ImportError as e:
    print(f"CRITICAL: Failed to import Protobuf runtime schemas: {e}")
    pass

from google.protobuf.json_format import MessageToJson

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
    
    # 执行解压
    try:
        with zipfile.ZipFile(cmodel_path, 'r') as zip_ref:
            zip_ref.extractall(output_dir)
    except zipfile.BadZipFile:
        audit.append("ERROR: Invalid .cmodel format (Not a ZIP file)")
        return audit
        
    # 定义 二进制文件 -> Protobuf 类 -> 目标 JSON 文件 的映射关系
    model_mapping = [
        ("CompDesc.model", controller_model_comp_desc_pb2.Message_Module_Info, "CompDesc.json"),
        ("AbiSet.model", controller_model_abi_set_pb2.Controller_Ability, "AbiSet.json"),
        ("FuncDesc.model", controller_model_abi_desc_pb2.Robot_Description, "FuncDesc.json"),
    ]

    for model_name, pb_class, json_name in model_mapping:
        path = os.path.join(output_dir, model_name)
        if os.path.exists(path):
            with open(path, "rb") as f:
                binary_data = f.read()
                # 核心：实例化 Protobuf 对象并从二进制流解析
                obj = pb_class()
                obj.ParseFromString(binary_data)
                
                # 降级转换：Message -> JSON String
                # 注意：默认不设置 preserving_proto_field_name 以保持与前端 TS 定义一致的 CamelCase 风格
                json_str = MessageToJson(
                    obj, 
                    always_print_fields_with_no_presence=True
                )
                
                with open(os.path.join(output_dir, json_name), "w", encoding="utf-8") as out_f:
                    out_f.write(json_str)
                audit.append(f"  - Generated {json_name}: {len(json_str)} chars")

    return audit
