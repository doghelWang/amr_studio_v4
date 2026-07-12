import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from core import resource_adapter
from core import cmodel_component_mapper, cmodel_export_adapter, xml_component_adapter
from core.module_mappings import CATEGORY_TO_TYPE_KEY


class ResourceAdapterCompatTests(unittest.TestCase):
    def test_legacy_exports_point_to_current_modules(self):
        self.assertIs(resource_adapter.map_attribute_to_cmodel, cmodel_component_mapper.map_attribute_to_cmodel)
        self.assertIs(resource_adapter.map_component_to_cmodel, cmodel_component_mapper.map_component_to_cmodel)
        self.assertIs(resource_adapter.frontend_to_comp_desc, cmodel_export_adapter.frontend_to_comp_desc)
        self.assertIs(resource_adapter.collect_comp_desc_diagnostics, cmodel_export_adapter.collect_comp_desc_diagnostics)
        self.assertIs(resource_adapter.collect_export_diagnostics, cmodel_export_adapter.collect_export_diagnostics)
        self.assertIs(resource_adapter.export_abilities, cmodel_export_adapter.export_abilities)
        self.assertIs(resource_adapter.xml_to_component_json, xml_component_adapter.xml_to_component_json)
        self.assertIs(resource_adapter.CATEGORY_TO_TYPE_KEY, CATEGORY_TO_TYPE_KEY)


if __name__ == "__main__":
    unittest.main()
