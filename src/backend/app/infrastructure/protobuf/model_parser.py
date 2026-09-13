"""Convenience parser backed by the canonical safe cmodel decoder."""

import json
import tempfile
from pathlib import Path

from google.protobuf.json_format import MessageToDict

from .cmodel_decoder import decode_cmodel
from .generated import controller_model_comp_desc_pb2


class ModelParser:
    @staticmethod
    def parse_modelset(zip_path):
        with tempfile.TemporaryDirectory() as temp_dir:
            try:
                decode_cmodel(zip_path, temp_dir)
            except (FileNotFoundError, ValueError):
                return {"error": "Invalid .cmodel ZIP container"}

            results = {}
            for name in ("CompDesc.json", "AbiSet.json", "FuncDesc.json"):
                path = Path(temp_dir) / name
                if path.exists():
                    results[name] = json.loads(path.read_text(encoding="utf-8"))
            return results

    @staticmethod
    def get_comp_desc_from_binary(data):
        message = controller_model_comp_desc_pb2.Message_Module_Info()
        message.ParseFromString(data)
        return MessageToDict(message, preserving_proto_field_name=False)
