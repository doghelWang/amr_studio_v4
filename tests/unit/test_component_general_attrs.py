import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from core.component_general_attrs import (
    build_component_general_attr,
    normalize_component_category,
)


class ComponentGeneralAttrsTests(unittest.TestCase):
    def test_normalizes_interface_like_category_to_io(self):
        self.assertEqual(normalize_component_category("", "IO-Board"), "IO")
        self.assertEqual(normalize_component_category("EXTENDEDLNTERFACE", "Safety Interface"), "IO")

    def test_chassis_identity_updates_shape_dimensions(self):
        general_attr, category, is_chassis = build_component_general_attr(
            {"id": "chassis-root", "category": "CHASSIS", "name": "Root Chassis"},
            {"chassisLength": 1200, "chassisWidth": 800, "chassisHeight": 300},
        )

        self.assertEqual(category, "CHASSIS")
        self.assertTrue(is_chassis)
        self.assertEqual(general_attr["moduleName"]["stringValue"], "chassis_diff")
        self.assertEqual(general_attr["moduleUuid"]["stringValue"], "chassis-root")
        self.assertEqual(general_attr["moduleShape"]["shapeType"], "ENUM_BOX")
        self.assertEqual(general_attr["moduleShape"]["box"]["sizeLen"], 1200.0)
        self.assertEqual(general_attr["moduleShape"]["box"]["sizeWidth"], 800.0)
        self.assertEqual(general_attr["moduleShape"]["box"]["sizeHeight"], 300.0)

    def test_drivewheel_defaults_submodule_type(self):
        general_attr, category, is_chassis = build_component_general_attr(
            {
                "id": "wheel-1",
                "category": "DRIVEWHEEL",
                "type": "missing-template-type",
                "name": "Left Wheel",
            }
        )

        self.assertEqual(category, "DRIVEWHEEL")
        self.assertFalse(is_chassis)
        self.assertEqual(general_attr["mainModuleType"]["comboType"]["typeKey"], "driveWheel")
        self.assertEqual(general_attr["subSysType"]["comboType"]["typeKey"], "ChassisSys")
        self.assertEqual(general_attr["subModuleType"]["comboType"]["typeKey"], "driveWheel")
        self.assertEqual(general_attr["moduleType"]["stringValue"], "DRIVEWHEEL")

    def test_io_category_inference_uses_io_defaults(self):
        general_attr, category, is_chassis = build_component_general_attr(
            {
                "id": "io-1",
                "category": "EXTENDEDLNTERFACE",
                "type": "missing-template-type",
                "name": "Safety IO-Board",
            }
        )

        self.assertEqual(category, "IO")
        self.assertFalse(is_chassis)
        self.assertEqual(general_attr["mainModuleType"]["comboType"]["typeKey"], "extendedlnterface")
        self.assertEqual(general_attr["subSysType"]["comboType"]["typeKey"], "ControlSys")
        self.assertEqual(general_attr["moduleType"]["stringValue"], "IO")


if __name__ == "__main__":
    unittest.main()
