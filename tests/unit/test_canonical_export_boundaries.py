import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.application.cmodel_export import (
    collect_comp_desc_diagnostics,
    collect_export_diagnostics,
    export_abilities,
    frontend_to_comp_desc,
)
from app.domain.modeling.component_mapper import map_attribute_to_cmodel, map_component_to_cmodel
from app.domain.modeling.module_mappings import CATEGORY_TO_TYPE_KEY
from app.infrastructure.resources.xml_component_adapter import xml_to_component_json


class CanonicalExportBoundaryTests(unittest.TestCase):
    def test_public_export_boundaries_are_available_without_compatibility_modules(self):
        for function in (
            collect_comp_desc_diagnostics,
            collect_export_diagnostics,
            export_abilities,
            frontend_to_comp_desc,
            map_attribute_to_cmodel,
            map_component_to_cmodel,
            xml_to_component_json,
        ):
            self.assertTrue(callable(function))
        self.assertIn("CHASSIS", CATEGORY_TO_TYPE_KEY)


if __name__ == "__main__":
    unittest.main()
