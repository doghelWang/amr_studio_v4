import sys
import unittest
from pathlib import Path

from google.protobuf.json_format import ParseDict


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from core.resource_adapter import map_attribute_to_cmodel
from skills_v2.cmodel_encoder.encoder import (
    ABI_TYPE_STRING_TO_INT,
    COMP_DESC_TYPE_STRING_TO_INT,
    proto_final_sync,
)
from skills_v2.schemas_pb import controller_model_abi_set_pb2, controller_model_comp_desc_pb2


class ProtobufExportAlignmentTests(unittest.TestCase):
    def test_comp_desc_int32_fields_survive_proto_sync(self):
        raw = {
            "key": "limit",
            "type": "DATA_INT32",
            "int32Value": 7,
            "int32Maxvalue": 9,
            "int32Minvalue": 1,
            "desc": "limit",
        }

        synced = proto_final_sync(raw, COMP_DESC_TYPE_STRING_TO_INT)
        msg = controller_model_comp_desc_pb2.Message_Base_Element()
        ParseDict(synced, msg, ignore_unknown_fields=False)

        self.assertEqual(msg.type, controller_model_comp_desc_pb2.DATA_INT32)
        self.assertEqual(msg.int32_value, 7)
        self.assertEqual(msg.int32_maxvalue, 9)
        self.assertEqual(msg.int32_minvalue, 1)

    def test_ability_exporter_uses_abi_native_type_names(self):
        fixed_attr = map_attribute_to_cmodel(
            {"key": "laser", "type": "DATA_FIXED_E", "value": "sensor/laser"},
            is_ability=True,
        )
        combo_attr = map_attribute_to_cmodel(
            {
                "key": "mode",
                "type": "DATA_COMBOX",
                "comboType": {"typeKey": "slam", "typeDesc": "SLAM", "typeGroups": []},
            },
            is_ability=True,
        )

        self.assertEqual(fixed_attr["type"], "FIXED_E")
        self.assertEqual(combo_attr["type"], "DATA_COMBOX_E")

    def test_abi_type_mapping_accepts_native_and_legacy_names(self):
        cases = [
            ("FIXED_E", controller_model_abi_set_pb2.FIXED_E, {"stringValue": "sensor/laser"}),
            ("DATA_FIXED_E", controller_model_abi_set_pb2.FIXED_E, {"stringValue": "sensor/laser"}),
            (
                "DATA_COMBOX_E",
                controller_model_abi_set_pb2.DATA_COMBOX_E,
                {"comboType": {"typeKey": "slam", "typeDesc": "SLAM", "typeGroups": []}},
            ),
            (
                "DATA_COMBOX",
                controller_model_abi_set_pb2.DATA_COMBOX_E,
                {"comboType": {"typeKey": "slam", "typeDesc": "SLAM", "typeGroups": []}},
            ),
        ]

        for raw_type, expected_enum, extra_fields in cases:
            with self.subTest(raw_type=raw_type):
                raw = {"key": "attr", "desc": "attr", "type": raw_type, **extra_fields}
                synced = proto_final_sync(raw, ABI_TYPE_STRING_TO_INT)
                msg = controller_model_abi_set_pb2.Message_Attribute()
                ParseDict(synced, msg, ignore_unknown_fields=False)
                self.assertEqual(msg.type, expected_enum)


if __name__ == "__main__":
    unittest.main()
