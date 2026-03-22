import zipfile
import json
import os
import sys
import shutil

# Add schemas_pb to Python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "schemas_pb"))
try:
    import controller_model_comp_desc_pb2
    import controller_model_abi_set_pb2
    import controller_model_abi_desc_pb2
except ImportError as e:
    pass

from google.protobuf.json_format import MessageToJson

def decode_cmodel(cmodel_path, output_dir):
    audit = []
    audit.append(f"IMPORT_START: {os.path.basename(cmodel_path)}")
    
    zip_size = os.path.getsize(cmodel_path)
    audit.append(f"STEP1_RAW_ZIP: {zip_size} bytes")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
        
    with zipfile.ZipFile(cmodel_path, 'r') as zip_ref:
        zip_ref.extractall(output_dir)
    
    extracted_files = os.listdir(output_dir)
    audit.append(f"STEP2_EXTRACTED: {len(extracted_files)} files")
    for f in extracted_files:
        f_path = os.path.join(output_dir, f)
        if os.path.isfile(f_path):
            audit.append(f"  - {f}: {os.path.getsize(f_path)} bytes")

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
                audit.append(f"STEP3_DESERIALIZE: {model_name} ({len(binary_data)} bytes)")
                
                obj = pb_class()
                obj.ParseFromString(binary_data)
                
                json_str = MessageToJson(
                    obj, 
                    preserving_proto_field_name=True, 
                    always_print_fields_with_no_presence=True
                )
                
                with open(os.path.join(output_dir, json_name), "w", encoding="utf-8") as out_f:
                    out_f.write(json_str)
                audit.append(f"  -> {json_name}: {len(json_str)} chars")

    return audit
