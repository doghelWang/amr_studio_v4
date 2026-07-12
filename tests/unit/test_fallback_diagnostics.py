import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from core.fallback_diagnostics import (
    analyze_component_fallbacks,
    collect_comp_desc_diagnostics,
    collect_export_diagnostics,
)


class FallbackDiagnosticsTests(unittest.TestCase):
    def test_missing_required_id_is_reported_as_error(self):
        diagnostics = analyze_component_fallbacks(
            {
                "category": "UNKNOWN_CATEGORY",
                "type": "missing-template-type",
                "name": "Mystery",
            }
        )

        codes = {item.code for item in diagnostics}
        self.assertIn("REQUIRED_MODULE_UUID_MISSING", codes)
        required = next(item for item in diagnostics if item.code == "REQUIRED_MODULE_UUID_MISSING")
        self.assertEqual(required.severity, "error")
        self.assertEqual(required.field_path, "generalAttr.moduleUuid")
        self.assertEqual(required.fallback_kind, "required")

    def test_template_and_mapping_fallbacks_are_visible(self):
        diagnostics = analyze_component_fallbacks(
            {
                "id": "unknown-1",
                "category": "UNKNOWN_CATEGORY",
                "type": "missing-template-type",
                "name": "Mystery",
            }
        )

        codes = {item.code for item in diagnostics}
        self.assertIn("MODULE_TEMPLATE_MISSING", codes)
        self.assertIn("TYPE_MAPPING_DEFAULT_USED", codes)
        self.assertIn("SUBSYSTEM_MAPPING_DEFAULT_USED", codes)
        self.assertIn("DEFAULT_MODULE_SHAPE_USED", codes)

    def test_collect_export_diagnostics_reports_empty_abilities_without_touching_config(self):
        config = {
            "identity": {"robotName": "Robot"},
            "components": [
                {
                    "id": "io-1",
                    "category": "EXTENDEDLNTERFACE",
                    "type": "missing-template-type",
                    "name": "Safety IO-Board",
                }
            ],
        }

        diagnostics = collect_export_diagnostics(config)
        codes = {item["code"] for item in diagnostics}

        self.assertIn("CATEGORY_NORMALIZED", codes)
        self.assertIn("EMPTY_FUNCTION_ABILITY", codes)
        self.assertNotIn("diagnostics", config)

    def test_collect_comp_desc_diagnostics_reports_resolved_protocol_defaults(self):
        comp_desc = {
            "moduleGroupName": "Robot",
            "module_componets": [
                {
                    "generalAttr": {
                        "moduleName": {"stringValue": "Mystery"},
                        "moduleUuid": {"stringValue": ""},
                        "mainModuleType": {"comboType": {"typeKey": "unknown"}},
                        "subSysType": {"comboType": {"typeKey": "UnclassifiedSys"}},
                        "moduleShape": {"box": {"sizeLen": 100, "sizeWidth": 100, "sizeHeight": 100}},
                    },
                    "structParam": {"extendParams": []},
                    "interfaceParams": {"interfaceGroup": []},
                }
            ],
        }

        diagnostics = collect_comp_desc_diagnostics(comp_desc)
        codes = {item["code"] for item in diagnostics}

        self.assertIn("REQUIRED_MODULE_UUID_MISSING", codes)
        self.assertIn("TYPE_MAPPING_DEFAULT_USED", codes)
        self.assertIn("SUBSYSTEM_MAPPING_DEFAULT_USED", codes)
        self.assertIn("DEFAULT_MODULE_SHAPE_USED", codes)
        self.assertIn("MOUNT_FIELD_MISSING", codes)
        self.assertIn("EMPTY_INTERFACE_GROUP", codes)


if __name__ == "__main__":
    unittest.main()
