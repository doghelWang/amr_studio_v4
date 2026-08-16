import sys
import unittest
from pathlib import Path

from google.protobuf.json_format import ParseDict


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.domain.modeling.component_mapper import map_attribute_to_cmodel
from app.infrastructure.protobuf.cmodel_encoder import (
    ABI_TYPE_STRING_TO_INT,
    COMP_DESC_TYPE_STRING_TO_INT,
    proto_final_sync,
)
from app.infrastructure.protobuf.generated import controller_model_abi_set_pb2, controller_model_comp_desc_pb2


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

    def test_component_attribute_value_types_use_proto_native_fields(self):
        cases = [
            ("DATA_FIXED_E", "stringFix", "fixed"),
            ("DATA_FLOAT", "floatValue", 1.5),
            ("DATA_UINT32", "uint32Value", 7),
            ("DATA_INT64", "int64Value", "922337203685477580"),
            ("DATA_UINT64", "uint64Value", "184467440737095516"),
            ("DATA_IP", "ipValue", "192.168.1.10"),
        ]
        for attr_type, field, value in cases:
            with self.subTest(attr_type=attr_type):
                mapped = map_attribute_to_cmodel(
                    {"key": "attr", "type": attr_type, "value": value, "fixedSource": ["source"]}
                )
                self.assertEqual(mapped[field], value)
                self.assertEqual(mapped["fixedSource"], ["source"])

    def test_proto_sync_merges_camel_and_snake_case_collisions_without_data_loss(self):
        raw = {
            "generalAttr": {
                "moduleName": {"stringValue": "chassis_diff"},
                "moduleUuid": {"stringValue": "chassis-root"},
                "mainModuleType": {"comboType": {"typeKey": "chassis", "typeDesc": "底盘"}},
                "subSysType": {"comboType": {"typeKey": "ChassisSys", "typeDesc": "底盘系统"}},
                "subModuleType": {"comboType": {"typeKey": "steerChassis", "typeDesc": "舵轮底盘"}},
                "moduleShape": {"shapeType": "ENUM_BOX", "box": {"sizeLen": 1200, "sizeWidth": 800, "sizeHeight": 400}},
            },
            "general_attr": {
                "module_name": {"string_value": "robot01"},
                "module_shape": {"shape_type": "ENUM_BOX", "box": {"size_len": 1200, "size_width": 800, "size_height": 400}},
            },
        }

        synced = proto_final_sync(raw, COMP_DESC_TYPE_STRING_TO_INT)
        general_attr = synced["general_attr"]

        self.assertEqual(general_attr["module_name"]["string_value"], "chassis_diff")
        self.assertEqual(general_attr["module_uuid"]["string_value"], "chassis-root")
        self.assertEqual(general_attr["main_module_type"]["combo_type"]["type_key"], "chassis")
        self.assertEqual(general_attr["sub_sys_type"]["combo_type"]["type_key"], "ChassisSys")
        self.assertEqual(general_attr["sub_module_type"]["combo_type"]["type_key"], "steerChassis")
        self.assertEqual(general_attr["module_shape"]["box"]["size_len"], 1200)

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

    def test_abi_common_attribute_aliases_map_to_proto_enum(self):
        for raw_type, expected_enum in [
            ("ARRAY", controller_model_abi_set_pb2.ARRAY_E),
            ("ARRAY_E", controller_model_abi_set_pb2.ARRAY_E),
            ("COMBOX", controller_model_abi_set_pb2.COMBOX_E),
            ("COMBOX_E", controller_model_abi_set_pb2.COMBOX_E),
        ]:
            with self.subTest(raw_type=raw_type):
                raw = {"key": "attr", "type": raw_type, "arrayParam": {"groupKey": "g"}}
                synced = proto_final_sync(raw, ABI_TYPE_STRING_TO_INT)
                self.assertEqual(synced["type"], expected_enum)
                msg = controller_model_abi_set_pb2.Message_CommonAttr()
                ParseDict(synced, msg, ignore_unknown_fields=False)
                self.assertEqual(msg.type, expected_enum)


if __name__ == "__main__":
    unittest.main()
