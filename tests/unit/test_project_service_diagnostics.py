import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services import project_service
from core import data_manager


class ProjectServiceDiagnosticsTests(unittest.TestCase):
    def test_initialize_project_returns_diagnostics_without_writing_them_to_compdesc(self):
        with tempfile.TemporaryDirectory() as temp_root:
            old_db_dir = data_manager.DB_DIR
            data_manager.DB_DIR = Path(temp_root)
            config = {
                "identity": {"robotName": "Robot"},
                "components": [
                    {
                        "id": "unknown-1",
                        "category": "UNKNOWN_CATEGORY",
                        "type": "missing-template-type",
                        "name": "Mystery",
                    }
                ],
            }

            try:
                with patch("app.services.project_service.split_comp_desc") as split_mock:
                    def fake_split(comp_desc_path, split_out):
                        split_out_path = Path(split_out)
                        (split_out_path / "blueprint_CompDesc.json").write_text(
                            json.dumps({"moduleGroupName": "Robot", "moreModuleInfo": []}),
                            encoding="utf-8",
                        )
                        modules_dir = split_out_path / "modules"
                        modules_dir.mkdir()

                    split_mock.side_effect = fake_split
                    result = project_service.initialize_project_sandbox("proj_diag", config)

                self.assertEqual(result["status"], "success")
                self.assertIn("diagnostics", result)
                self.assertIn("debug_artifacts_path", result)
                self.assertIn("debug_artifacts_url", result)
                self.assertIn("MODULE_TEMPLATE_MISSING", {item["code"] for item in result["diagnostics"]})

                project_dir = data_manager.get_project_dir("proj_diag")
                comp_desc_path = project_dir / "CompDesc.json"
                comp_desc = json.loads(comp_desc_path.read_text(encoding="utf-8"))
                self.assertNotIn("diagnostics", comp_desc)

                debug_dir = project_dir / result["debug_artifacts_path"]
                self.assertTrue(debug_dir.exists())
                self.assertTrue((debug_dir / "01_frontend_config.json").exists())
                self.assertTrue((debug_dir / "02_frontend_diagnostics.json").exists())
                self.assertTrue((debug_dir / "03_generated_full_CompDesc.json").exists())
                self.assertTrue((debug_dir / "04_sanitized_CompDesc.json").exists())
                self.assertTrue((debug_dir / "05_split_output" / "blueprint_CompDesc.json").exists())
            finally:
                data_manager.DB_DIR = old_db_dir


if __name__ == "__main__":
    unittest.main()
