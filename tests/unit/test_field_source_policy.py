import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.domain.modeling.field_source_policy import (
    FIELD_SOURCE_RULES,
    FallbackKind,
    get_field_source_rule,
    list_rules_by_fallback_kind,
)


class FieldSourcePolicyTests(unittest.TestCase):
    def test_required_core_rules_are_registered(self):
        required_fields = {
            "generalAttr.moduleName",
            "generalAttr.moduleUuid",
            "generalAttr.subSysType",
            "generalAttr.mainModuleType",
            "generalAttr.subModuleType",
            "generalAttr.moduleShape",
            "structParam.extendParams",
            "interfaceParams.interfaceGroup",
            "ability.functionAbility",
            "moduleList.mainType",
        }

        self.assertTrue(required_fields.issubset(FIELD_SOURCE_RULES.keys()))

    def test_module_uuid_is_required_not_guessable(self):
        rule = get_field_source_rule("generalAttr.moduleUuid")

        self.assertEqual(rule.fallback_kind, FallbackKind.REQUIRED)
        self.assertIn("component.id", rule.fallback_source)

    def test_mapping_defaults_are_listed_for_review(self):
        rules = list_rules_by_fallback_kind(FallbackKind.MAPPING_DEFAULT)
        paths = {rule.field_path for rule in rules}

        self.assertIn("generalAttr.subSysType", paths)
        self.assertIn("generalAttr.mainModuleType", paths)
        self.assertIn("moduleList.mainType", paths)

    def test_compat_defaults_are_explicitly_marked_as_risky(self):
        rules = list_rules_by_fallback_kind(FallbackKind.COMPAT_DEFAULT)

        self.assertTrue(rules)
        for rule in rules:
            self.assertTrue(rule.risk)


if __name__ == "__main__":
    unittest.main()
