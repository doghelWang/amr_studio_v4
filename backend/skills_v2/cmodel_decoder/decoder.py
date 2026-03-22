import zipfile
import json
import os
import sys
import shutil

print("DEBUG: LOADING DECODER VERSION 4.1.0 (NO RM-TREE)", flush=True)

# Add schemas_pb to Python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "schemas_pb"))
try:
    import controller_model_comp_desc_pb2
    import controller_model_abi_set_pb2
    import controller_model_abi_desc_pb2
except ImportError as e:
    print(f"CRITICAL: Error importing schemas_pb in decoder.py: {e}")
    pass

from google.protobuf.json_format import MessageToJson

def decode_cmodel(cmodel_path, output_dir):
    print(f"DECODER: Starting decode of {cmodel_path} into {output_dir}")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
        
    with zipfile.ZipFile(cmodel_path, 'r') as zip_ref:
        zip_ref.extractall(output_dir)
    
    files_in_zip = os.listdir(output_dir)
    print(f"DECODER: Files extracted: {files_in_zip}")
    
    # Process CompDesc.model
    comp_model_path = os.path.join(output_dir, "CompDesc.model")
    if os.path.exists(comp_model_path):
        with open(comp_model_path, "rb") as f:
            comp_obj = controller_model_comp_desc_pb2.Message_Module_Info()
            comp_obj.ParseFromString(f.read())
            json_str = MessageToJson(comp_obj, preserving_proto_field_name=True)
            with open(os.path.join(output_dir, "CompDesc.json"), "w", encoding="utf-8") as out_f:
                out_f.write(json_str)

    # Process AbiSet.model
    abi_model_path = os.path.join(output_dir, "AbiSet.model")
    if os.path.exists(abi_model_path):
        with open(abi_model_path, "rb") as f:
            abi_obj = controller_model_abi_set_pb2.Controller_Ability()
            abi_obj.ParseFromString(f.read())
            json_str = MessageToJson(abi_obj, preserving_proto_field_name=True)
            with open(os.path.join(output_dir, "AbiSet.json"), "w", encoding="utf-8") as out_f:
                out_f.write(json_str)

    # Process FuncDesc.model
    func_model_path = os.path.join(output_dir, "FuncDesc.model")
    if os.path.exists(func_model_path):
        with open(func_model_path, "rb") as f:
            func_obj = controller_model_abi_desc_pb2.Robot_Description()
            func_obj.ParseFromString(f.read())
            json_str = MessageToJson(func_obj, preserving_proto_field_name=True)
            with open(os.path.join(output_dir, "FuncDesc.json"), "w", encoding="utf-8") as out_f:
                out_f.write(json_str)

    print(f"DECODER: Decoding complete. Results in {output_dir}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Decode .cmodel file into JSONs")
    parser.add_argument("cmodel_path", help="Path to input .cmodel file")
    parser.add_argument("output_dir", help="Directory to save extracted JSON files")
    args = parser.parse_args()
    decode_cmodel(args.cmodel_path, args.output_dir)
