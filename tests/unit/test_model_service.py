import sys
import unittest
from pathlib import Path
from unittest.mock import patch


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.application import component_editing as model_service


class ModelServiceTests(unittest.TestCase):
    def test_normalize_abilities_payload_wraps_legacy_list_payload(self):
        payload = [{"type": "navigation"}]

        normalized = model_service.normalize_abilities_payload(payload)

        self.assertEqual(normalized, {"functionAbility": [{"type": "navigation"}], "version": "1.0"})

    def test_normalize_abilities_payload_preserves_dict_payload(self):
        payload = {"version": "V2.0", "componentAbility": []}

        self.assertIs(model_service.normalize_abilities_payload(payload), payload)

    def test_update_abilities_passes_normalized_payload_to_data_manager(self):
        with patch.object(model_service.data_manager, "update_ability", return_value=True) as update_ability:
            result = model_service.update_abilities("proj_1", [{"type": "navigation"}])

        self.assertEqual(result, {"status": "success"})
        update_ability.assert_called_once_with("proj_1", {"functionAbility": [{"type": "navigation"}], "version": "1.0"})

    def test_update_abilities_reports_error_when_update_fails(self):
        with patch.object(model_service.data_manager, "update_ability", return_value=False):
            result = model_service.update_abilities("proj_1", {"version": "V2.0"})

        self.assertEqual(result, {"status": "error"})


if __name__ == "__main__":
    unittest.main()
