import json
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from core.project_repository import ProjectRepository


class ProjectRepositoryTests(unittest.TestCase):
    def make_repository(self, temp_root):
        base_dir = Path(temp_root) / "backend"
        resources_dir = base_dir / "resources"
        resources_dir.mkdir(parents=True)
        return ProjectRepository(base_dir, resources_dir)

    def test_init_project_writes_blueprint_compdesc_and_copies_modules(self):
        with tempfile.TemporaryDirectory() as temp_root:
            repository = self.make_repository(temp_root)
            source_modules = Path(temp_root) / "source_modules"
            source_modules.mkdir()
            (source_modules / "module_alpha.json").write_text('{"id": "alpha"}', encoding="utf-8")
            (source_modules / "ignore.txt").write_text("ignore", encoding="utf-8")

            repository.init_project(
                "proj_1",
                {"moduleGroupName": "Blueprint"},
                str(source_modules),
                {"moduleGroupName": "Full"},
            )

            project_dir = repository.get_project_dir("proj_1")
            self.assertEqual(json.loads((project_dir / "blueprint_CompDesc.json").read_text(encoding="utf-8")), {"moduleGroupName": "Blueprint"})
            self.assertEqual(json.loads((project_dir / "CompDesc.json").read_text(encoding="utf-8")), {"moduleGroupName": "Full"})
            self.assertTrue((project_dir / "modules" / "module_alpha.json").exists())
            self.assertFalse((project_dir / "modules" / "ignore.txt").exists())

    def test_ensure_module_in_project_copies_fallback_source_once(self):
        with tempfile.TemporaryDirectory() as temp_root:
            repository = self.make_repository(temp_root)
            fallback = Path(temp_root) / "fallback.json"
            fallback.write_text('{"name": "fallback"}', encoding="utf-8")

            first = repository.ensure_module_in_project("proj_1", "module_fallback.json", fallback)
            second = repository.ensure_module_in_project("proj_1", "module_fallback.json", fallback)

            target = repository.get_project_dir("proj_1") / "modules" / "module_fallback.json"
            self.assertTrue(first)
            self.assertTrue(second)
            self.assertEqual(json.loads(target.read_text(encoding="utf-8")), {"name": "fallback"})

    def test_update_component_deep_merges_and_get_component_reads_result(self):
        with tempfile.TemporaryDirectory() as temp_root:
            repository = self.make_repository(temp_root)
            modules_dir = repository.get_project_dir("proj_1") / "modules"
            modules_dir.mkdir(parents=True)
            module_file = modules_dir / "module_Controller_uuid-1.json"
            module_file.write_text(
                json.dumps(
                    {
                        "generalAttr": {
                            "moduleName": {"stringValue": "before"},
                            "moduleShape": {"shapeType": "ENUM_BOX"},
                        }
                    }
                ),
                encoding="utf-8",
            )

            updated = repository.update_component(
                "proj_1",
                "uuid-1",
                {"generalAttr": {"moduleName": {"stringValue": "after"}, "moduleShape": {"box": {"sizeLen": 10}}}},
            )
            component = repository.get_component("proj_1", "uuid-1")

            self.assertTrue(updated)
            self.assertEqual(component["generalAttr"]["moduleName"]["stringValue"], "after")
            self.assertEqual(component["generalAttr"]["moduleShape"]["shapeType"], "ENUM_BOX")
            self.assertEqual(component["generalAttr"]["moduleShape"]["box"]["sizeLen"], 10)

    def test_update_component_returns_false_when_module_is_missing(self):
        with tempfile.TemporaryDirectory() as temp_root:
            repository = self.make_repository(temp_root)
            modules_dir = repository.get_project_dir("proj_1") / "modules"
            modules_dir.mkdir(parents=True)

            self.assertFalse(repository.update_component("proj_1", "missing", {"generalAttr": {}}))

    def test_update_ability_creates_file_and_deep_merges_payload(self):
        with tempfile.TemporaryDirectory() as temp_root:
            repository = self.make_repository(temp_root)
            project_dir = repository.get_project_dir("proj_1")
            project_dir.mkdir(parents=True)

            updated = repository.update_ability(
                "proj_1",
                {"version": "V2.0", "componentAbility": [{"type": "move", "desc": "Move"}]},
            )
            ability = repository.get_ability("proj_1")

            self.assertTrue(updated)
            self.assertEqual(ability["version"], "V2.0")
            self.assertEqual(ability["componentAbility"], [{"type": "move", "desc": "Move"}])

    def test_update_function_creates_file_and_deep_merges_payload(self):
        with tempfile.TemporaryDirectory() as temp_root:
            repository = self.make_repository(temp_root)
            project_dir = repository.get_project_dir("proj_1")
            project_dir.mkdir(parents=True)

            updated = repository.update_function(
                "proj_1",
                {"function": [{"type": "navigation", "desc": "Navigation"}]},
            )
            function = repository.get_function("proj_1")

            self.assertTrue(updated)
            self.assertEqual(function["version"], "V1.0")
            self.assertEqual(function["function"], [{"type": "navigation", "desc": "Navigation"}])


if __name__ == "__main__":
    unittest.main()
