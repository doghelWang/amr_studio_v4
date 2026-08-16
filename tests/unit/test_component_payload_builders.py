import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.domain.modeling.component_payload_builders import (
    build_component_extend_params,
    build_component_interface_groups,
    build_component_private_attrs,
)


class ComponentPayloadBuildersTests(unittest.TestCase):
    def test_build_extend_params_uses_mount_fields(self):
        params = build_component_extend_params(
            {
                "parentNodeUuid": "parent-1",
                "mountX": "10.5",
                "mountY": 20,
                "mountZ": 30,
                "mountRoll": 1,
                "mountPitch": 2,
                "mountYaw": 3,
            }
        )
        params_by_key = {param["key"]: param for param in params}

        self.assertEqual(params_by_key["parentNodeUuid"]["comboType"]["typeKey"], "parent-1")
        self.assertEqual(params_by_key["locCoordX"]["doubleValue"], 10.5)
        self.assertEqual(params_by_key["locCoordY"]["doubleValue"], 20.0)
        self.assertEqual(params_by_key["locCoordZ"]["doubleValue"], 30.0)
        self.assertEqual(params_by_key["locCoordROLL"]["doubleValue"], 1.0)
        self.assertEqual(params_by_key["locCoordPITCH"]["doubleValue"], 2.0)
        self.assertEqual(params_by_key["locCoordYAW"]["doubleValue"], 3.0)

    def test_build_extend_params_defaults_missing_mount_fields_to_zero(self):
        params = build_component_extend_params({})
        params_by_key = {param["key"]: param for param in params}

        self.assertEqual(params_by_key["parentNodeUuid"]["comboType"]["typeKey"], "")
        self.assertEqual(params_by_key["locCoordX"]["doubleValue"], 0.0)
        self.assertEqual(params_by_key["locCoordY"]["doubleValue"], 0.0)
        self.assertEqual(params_by_key["locCoordZ"]["doubleValue"], 0.0)

    def test_build_private_attrs_delegates_element_mapping(self):
        calls = []

        def mapper(element, is_ability):
            calls.append((element, is_ability))
            return {"key": element["key"], "mapped": True}

        private_attrs = build_component_private_attrs(
            {
                "privateAttrs": [
                    {
                        "key": "motion",
                        "desc": "Motion",
                        "elements": [{"key": "speed"}, {"key": "acc"}],
                    }
                ]
            },
            mapper,
        )

        self.assertEqual(private_attrs[0]["key"], "motion")
        self.assertEqual(private_attrs[0]["desc"], "Motion")
        self.assertEqual(private_attrs[0]["arrayBaseEle"], [{"key": "speed", "mapped": True}, {"key": "acc", "mapped": True}])
        self.assertEqual(calls, [({"key": "speed"}, False), ({"key": "acc"}, False)])

    def test_build_interface_groups_preserves_interface_fields(self):
        interface_groups = build_component_interface_groups(
            {
                "interfaces": [
                    {
                        "key": "can0",
                        "type": "CAN",
                        "path": "/bus/can0",
                        "desc": "Main CAN",
                        "interfaceUuid": "if-1",
                        "linkedInterfaceUuid": ["if-2"],
                        "linkAttrs": [{"key": "termination", "desc": "120 ohm"}],
                        "interfaceAttrs": {"voltage": 24},
                        "interfaceParams": {"bitrate": 500000},
                    }
                ]
            }
        )

        self.assertEqual(
            interface_groups,
            [
                {
                    "key": "can0",
                    "type": "CAN",
                    "path": "/bus/can0",
                    "desc": "Main CAN",
                    "interfaceUuid": "if-1",
                    "linkedInterfaceUuid": ["if-2"],
                    "linkAttrs": [{"key": "termination", "desc": "120 ohm"}],
                    "interfaceAttrs": {"voltage": 24},
                    "interfaceParams": {"bitrate": 500000},
                }
            ],
        )

    def test_build_interface_groups_defaults_to_empty_list(self):
        self.assertEqual(build_component_interface_groups({}), [])


if __name__ == "__main__":
    unittest.main()
