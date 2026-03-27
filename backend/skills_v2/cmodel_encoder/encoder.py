"""
AMR Studio V4 CModel Encoder
该模块负责将编辑后的 JSON 配置重新编译为二进制的 .cmodel 文件。
核心挑战：
1. 模型重组：将之前拆分出的多个子模块 ($ref) 重新缝合回原始蓝图 (Blueprint)。
2. 协议兼容性：由于前端使用的是松散的 JSON，需确保 Key 名与 Protobuf 严格定义的小驼峰一致。
3. 压缩打包：将生成的 .model 文件重新打包为符合官方规范的 ZIP 容器。
"""

import json
import os
import argparse
import sys
import zipfile

# 动态添加 Protobuf Schema 路径
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "schemas_pb"))
try:
    import comp_desc_runtime as controller_model_comp_desc_pb2
    import abi_set_runtime as controller_model_abi_set_pb2
    import abi_desc_runtime as controller_model_abi_desc_pb2
except ImportError as e:
    print(f"ImportError in encoder.py: {e}", file=sys.stderr)
    raise

from google.protobuf.json_format import ParseDict

def proto_final_sync(node):
    """
    Key 名同步逻辑：
    由于前端开发中可能存在拼写差异或下划线命名，该函数在序列化前
    强制将关键路径上的 Key 转为 Protobuf 定义的严格小驼峰格式。
    """
    if isinstance(node, dict):
        new_node = {}
        for k, v in node.items():
            new_k = k
            # 根节点与通用组件属性转换
            if k == "more_module_info": new_k = "moreModuleInfo"
            elif k == "module_componets": new_k = "moduleComponets"
            elif k == "module_group_name": new_k = "moduleGroupName"
            elif k == "module_group_uuid": new_k = "moduleGroupUuid"
            elif k == "general_attr": new_k = "generalAttr"
            elif k == "private_attr": new_k = "privateAttr"
            elif k == "interface_params": new_k = "interfaceParams"
            elif k == "struct_param": new_k = "structParam"
            # 指标与基础类型转换
            elif k == "string_value": new_k = "stringValue"
            elif k == "double_value": new_k = "doubleValue"
            elif k == "float_value": new_k = "floatValue"
            elif k == "int32_value": new_k = "int32Value"
            elif k == "uint32_value": new_k = "uint32Value"
            elif k == "bool_value": new_k = "boolValue"
            elif k == "combo_type": new_k = "comboType"
            elif k == "type_key": new_k = "typeKey"
            elif k == "type_groups": new_k = "typeGroups"
            elif k == "array_cmob_ele": new_k = "arrayCmobEle"
            elif k == "array_base_ele": new_k = "arrayBaseEle"
            elif k == "private_attrs": new_k = "privateAttrs"
            
            new_node[new_k] = proto_final_sync(v)
        return new_node
    elif isinstance(node, list):
        return [proto_final_sync(item) for item in node]
    else:
        return node

def resolve_with_fidelity(node, base_dir):
    """
    引用解析逻辑 ($ref Resolution)：
    递归遍历蓝图，当发现 {"$ref": "path"} 时，读取对应的模块文件并替换。
    该步骤确保了模型结构的完整性，避免了信息丢失。
    """
    if isinstance(node, dict):
        if "$ref" in node:
            ref_path = os.path.abspath(os.path.join(base_dir, node["$ref"]))
            if os.path.exists(ref_path):
                with open(ref_path, "r", encoding="utf-8") as f:
                    # 载入编辑后的模块 JSON 数据
                    return json.load(f)
            return node
        return {k: resolve_with_fidelity(v, base_dir) for k, v in node.items()}
    elif isinstance(node, list):
        return [resolve_with_fidelity(item, base_dir) for item in node]
    return node

def encode_cmodel(blueprint_path, output_cmodel_path):
    """
    编译打包主逻辑：
    1. 载入蓝图。
    2. 解析并填充所有子模块 ($ref)。
    3. 转换并校验 JSON 格式。
    4. 序列化为二进制并 ZIP 切片。
    """
    audit = []
    base_dir = os.path.dirname(os.path.abspath(blueprint_path))
    audit.append(f"FIDELITY_BUILD_START: {os.path.basename(output_cmodel_path)}")
    
    # 1. 载入蓝图结构
    with open(blueprint_path, "r", encoding="utf-8") as f:
        blueprint = json.load(f)
    
    # 2. 将项目沙箱中修改后的模块注入原始结构
    print("ENCODER: Injecting modules with structural fidelity...", flush=True)
    full_json = resolve_with_fidelity(blueprint, base_dir)
    
    # 3. 最终 Key 强校验与同步
    final_json = proto_final_sync(full_json)

    # 4. 执行 Protobuf 序列化 (核心编译步骤)
    comp_obj = controller_model_comp_desc_pb2.Message_Module_Info()
    # 使用 ignore_unknown_fields=True 以容纳前端临时的 UI 相关字段
    ParseDict(final_json, comp_obj, ignore_unknown_fields=True)
    comp_model_data = comp_obj.SerializeToString()
    audit.append(f"STEP2_SERIALIZED: CompDesc.model ({len(comp_model_data)} bytes)")
    
    # 同步处理 AbilitySet (机器人能力配置)
    abi_model_data = None; abi_json_path = os.path.join(base_dir, "AbiSet.json")
    if os.path.exists(abi_json_path):
        with open(abi_json_path, "r", encoding="utf-8") as f: abi_json = json.load(f)
        final_abi_json = proto_final_sync(abi_json)
        abi_obj = controller_model_abi_set_pb2.Controller_Ability()
        ParseDict(final_abi_json, abi_obj, ignore_unknown_fields=True)
        abi_model_data = abi_obj.SerializeToString()
        audit.append(f"STEP2_SERIALIZED: AbiSet.model ({len(abi_model_data)} bytes)")

    # 5. 生成 ZIP 格式的 .cmodel
    with zipfile.ZipFile(output_cmodel_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.writestr("CompDesc.model", comp_model_data)
        if abi_model_data: zipf.writestr("AbiSet.model", abi_model_data)
        elif os.path.exists(os.path.join(base_dir, "AbiSet.model")):
            # 如果 AbiSet.json 不存在但有原始 model 则直接复制
            zipf.write(os.path.join(base_dir, "AbiSet.model"), "AbiSet.model")
        
        # 打包其余非核心模型文件
        for other in ["FuncDesc.model", "ModelFileDesc.json"]:
            path = os.path.join(base_dir, other)
            if os.path.exists(path): zipf.write(path, other)

    audit.append(f"EXPORT_FINISH: {os.path.getsize(output_cmodel_path)} bytes")
    return audit
