import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from core.module_group_builder import build_frontend_comp_desc, build_module_group


class ModuleGroupBuilderTests(unittest.TestCase):
    def test_chassis_root_group_name_is_fixed(self):
        calls = []

        def mapper(component, identity):
            calls.append((component["id"], identity))
            return {"mappedId": component["id"]}

        identity = {"robotName": "Robot A"}
        group = build_module_group(
            {"id": "chassis-root", "name": "Root Chassis"},
            [{"id": "chassis-root", "name": "Root Chassis"}],
            identity,
            mapper,
        )

        self.assertEqual(group["moduleGroupName"], "chassis_diff")
        self.assertEqual(group["moduleGroupUuid"], "chassis-root")
        self.assertEqual(group["module_componets"], [{"mappedId": "chassis-root"}])
        self.assertEqual(group["moreModuleInfo"], [])
        self.assertEqual(calls, [("chassis-root", identity)])

    def test_regular_module_group_name_strips_module_prefix_and_recurses(self):
        calls = []

        def mapper(component, identity):
            calls.append(component["id"])
            return {"mappedId": component["id"]}

        components = [
            {"id": "root-1", "name": "module_Controller"},
            {"id": "child-1", "name": "module_Drive", "parentNodeUuid": "root-1"},
            {"id": "grandchild-1", "name": "Sensor", "parentNodeUuid": "child-1"},
        ]

        group = build_module_group(components[0], components, {"robotName": "Robot A"}, mapper)

        self.assertEqual(group["moduleGroupName"], "Controller")
        self.assertEqual(group["moreModuleInfo"][0]["moduleGroupName"], "Drive")
        self.assertEqual(group["moreModuleInfo"][0]["moreModuleInfo"][0]["moduleGroupName"], "Sensor")
        self.assertEqual(calls, ["root-1", "child-1", "grandchild-1"])

    def test_frontend_comp_desc_uses_identity_name_and_root_components_only(self):
        calls = []

        def group_builder(component, components, identity):
            calls.append((component["id"], len(components), identity["robotName"]))
            return {"moduleGroupUuid": component["id"]}

        config = {
            "identity": {"robotName": "Robot B"},
            "components": [
                {"id": "root-1", "name": "module_Root"},
                {"id": "child-1", "name": "Child", "parentNodeUuid": "root-1"},
                {"id": "root-2", "name": "module_SecondRoot"},
            ],
        }

        comp_desc = build_frontend_comp_desc(config, group_builder)

        self.assertEqual(comp_desc["moduleGroupName"], "Robot B")
        self.assertEqual(comp_desc["modelVersion"], "")
        self.assertEqual(comp_desc["moreModuleInfo"], [{"moduleGroupUuid": "root-1"}, {"moduleGroupUuid": "root-2"}])
        self.assertEqual(calls, [("root-1", 3, "Robot B"), ("root-2", 3, "Robot B")])


if __name__ == "__main__":
    unittest.main()
