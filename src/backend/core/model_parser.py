import os
import zipfile
import tempfile
import json
from pathlib import Path
from google.protobuf.json_format import MessageToDict

# Import official PB2 modules generated from /specifications/protocols/
import sys
_BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(_BACKEND_DIR))
from skills_v2.schemas_pb import (
    controller_model_comp_desc_pb2,
    controller_model_abi_set_pb2,
    controller_model_abi_desc_pb2
)

class ModelParser:
    """[ARCH REFACTORED] Official Protobuf Parser.
    Zero heuristics. Zero guesswork. Strictly follows Google Protobuf specs.
    """
    @staticmethod
    def parse_modelset(zip_path: str) -> dict:
        results = {}
        with tempfile.TemporaryDirectory() as tmp_dir:
            try:
                with zipfile.ZipFile(zip_path, 'r') as zf:
                    zf.extractall(tmp_dir)
            except Exception: return {"error": "Invalid .cmodel ZIP container"}
            
            # 1. CompDesc.model (Main Model)
            comp_path = os.path.join(tmp_dir, 'CompDesc.model')
            if os.path.exists(comp_path):
                msg = controller_model_comp_desc_pb2.Message_Module_Info()
                with open(comp_path, 'rb') as f:
                    msg.ParseFromString(f.read())
                # preserving_proto_field_name=True ensures we get 'moduleComponets' not 'module_componets'
                results["CompDesc.json"] = MessageToDict(msg, preserving_proto_field_name=False, use_integers_for_enums=True)
            
            # 2. AbiSet.model (Capabilities)
            abi_path = os.path.join(tmp_dir, 'AbiSet.model')
            if os.path.exists(abi_path):
                msg = controller_model_abi_set_pb2.Controller_Ability()
                with open(abi_path, 'rb') as f:
                    msg.ParseFromString(f.read())
                results["AbiSet.json"] = MessageToDict(msg, preserving_proto_field_name=False, use_integers_for_enums=True)

            # 3. FuncDesc.model (Function Logic)
            for file in os.listdir(tmp_dir):
                if file.startswith('FuncDesc') and file.endswith('.model'):
                    func_path = os.path.join(tmp_dir, file)
                    msg = controller_model_abi_desc_pb2.Robot_Description()
                    with open(func_path, 'rb') as f:
                        msg.ParseFromString(f.read())
                    results["FuncDesc.json"] = MessageToDict(msg, preserving_proto_field_name=False, use_integers_for_enums=True)
                    break

        return results

    @staticmethod
    def get_comp_desc_from_binary(data: bytes) -> dict:
        msg = controller_model_comp_desc_pb2.Message_Module_Info()
        msg.ParseFromString(data)
        return MessageToDict(msg, preserving_proto_field_name=False)
