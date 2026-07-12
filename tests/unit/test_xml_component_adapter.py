import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from core.xml_component_adapter import xml_to_component_json


class XmlComponentAdapterTests(unittest.TestCase):
    def test_xml_to_component_json_extracts_component_names_and_categories(self):
        xml = """
        <Module name="TemplateRoot">
          <Component category="ControlSys">
            <Identity name=" Main Controller "/>
          </Component>
          <Component category="SensorSys">
            <Identity name="Laser"/>
          </Component>
        </Module>
        """
        with tempfile.TemporaryDirectory() as temp_root:
            xml_path = Path(temp_root) / "template.xml"
            xml_path.write_text(xml, encoding="utf-8")

            parsed = xml_to_component_json(xml_path)

        self.assertEqual(parsed["moduleGroupName"], "TemplateRoot")
        self.assertEqual(len(parsed["module_componets"]), 2)
        self.assertEqual(parsed["module_componets"][0]["generalAttr"]["moduleName"]["stringValue"], "Main Controller")
        self.assertEqual(parsed["module_componets"][0]["generalAttr"]["subSysType"]["comboType"]["typeKey"], "ControlSys")
        self.assertEqual(parsed["module_componets"][1]["generalAttr"]["moduleName"]["stringValue"], "Laser")
        self.assertEqual(parsed["module_componets"][1]["generalAttr"]["subSysType"]["comboType"]["typeKey"], "SensorSys")

    def test_xml_to_component_json_defaults_missing_identity_name(self):
        xml = """
        <Module>
          <Component category="Other"/>
        </Module>
        """
        with tempfile.TemporaryDirectory() as temp_root:
            xml_path = Path(temp_root) / "template.xml"
            xml_path.write_text(xml, encoding="utf-8")

            parsed = xml_to_component_json(xml_path)

        self.assertEqual(parsed["moduleGroupName"], "Unknown")
        self.assertEqual(parsed["module_componets"][0]["generalAttr"]["moduleName"]["stringValue"], "Unknown")
        self.assertEqual(parsed["module_componets"][0]["generalAttr"]["subSysType"]["comboType"]["typeKey"], "Other")


if __name__ == "__main__":
    unittest.main()
