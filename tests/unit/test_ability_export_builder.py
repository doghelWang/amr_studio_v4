import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from core.ability_export_builder import (
    build_child_function,
    build_exported_abilities,
    build_function_ability,
)


class AbilityExportBuilderTests(unittest.TestCase):
    def test_empty_abilities_return_default_shape(self):
        self.assertEqual(
            build_exported_abilities(None, lambda attr, is_ability: attr),
            {"version": "V1.0", "componentAbility": [], "functionAbility": []},
        )

    def test_exported_abilities_preserve_version_and_component_abilities(self):
        abilities = {
            "version": "V2.0",
            "componentAbility": [{"type": "move"}],
            "functionAbility": [],
        }

        exported = build_exported_abilities(abilities, lambda attr, is_ability: attr)

        self.assertEqual(exported["version"], "V2.0")
        self.assertEqual(exported["componentAbility"], [{"type": "move"}])
        self.assertEqual(exported["functionAbility"], [])

    def test_function_ability_builds_child_functions(self):
        calls = []

        def mapper(attribute, is_ability):
            calls.append((attribute, is_ability))
            return {"key": attribute["key"], "mapped": True}

        function = build_function_ability(
            {
                "type": "navigation",
                "desc": "Navigation",
                "tips": "Use safely",
                "childFunction": [
                    {
                        "key": "goto",
                        "desc": "Go to point",
                        "tips": "Point must exist",
                        "attr": [{"key": "target"}],
                    }
                ],
            },
            mapper,
        )

        self.assertEqual(function["type"], "navigation")
        self.assertEqual(function["desc"], "Navigation")
        self.assertEqual(function["tips"], "Use safely")
        self.assertEqual(function["childFunction"][0]["type"], "goto")
        self.assertEqual(function["childFunction"][0]["cloneEnable"], False)
        self.assertEqual(function["childFunction"][0]["attr"], [{"key": "target", "mapped": True}])
        self.assertEqual(calls, [({"key": "target"}, True)])

    def test_child_function_prefers_type_and_preserves_clone_enable(self):
        child = build_child_function(
            {
                "type": "typed-child",
                "key": "fallback-key",
                "desc": "Typed child",
                "tips": "Typed tips",
                "cloneEnable": True,
                "attr": [],
            },
            lambda attr, is_ability: attr,
        )

        self.assertEqual(child["type"], "typed-child")
        self.assertEqual(child["key"], "fallback-key")
        self.assertEqual(child["cloneEnable"], True)


if __name__ == "__main__":
    unittest.main()
