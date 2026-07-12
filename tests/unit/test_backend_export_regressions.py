import json
import shutil
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

from fastapi import HTTPException


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from core import data_manager
from main import compile_cmodel_api
from skills_v2.cmodel_encoder.encoder import encode_cmodel


SAMPLE_PROJECT = REPO_ROOT / "src" / "backend" / "saved_projects" / "proj_8b800f1b"


class BackendExportRegressionTests(unittest.TestCase):
    def test_deep_update_creates_missing_nested_branch(self):
        original = {"generalAttr": {"moduleName": {"stringValue": "before"}}}
        patch = {"generalAttr": {"moduleShape": {"shapeType": "ENUM_BOX"}}}

        updated = data_manager.deep_update(original, patch)

        self.assertIn("moduleShape", updated["generalAttr"])
        self.assertEqual(updated["generalAttr"]["moduleShape"]["shapeType"], "ENUM_BOX")

    def test_compile_csv_uses_live_blueprint_and_module_files(self):
        with tempfile.TemporaryDirectory() as td:
            temp_root = Path(td)
            project_id = "proj_compile_regression"
            project_dir = temp_root / project_id
            shutil.copytree(SAMPLE_PROJECT, project_dir)

            module_path = project_dir / "modules" / "module_MainController_1393d6e420b447efb2b74dec43fc8857.json"
            with open(module_path, "r", encoding="utf-8") as f:
                module_data = json.load(f)
            module_data["generalAttr"]["moduleName"]["stringValue"] = "LIVE_BLUEPRINT_NAME"
            with open(module_path, "w", encoding="utf-8") as f:
                json.dump(module_data, f, ensure_ascii=False, indent=2)

            # Keep CompDesc.json stale on purpose to verify compile ignores it for CSV generation.
            comp_desc_path = project_dir / "CompDesc.json"
            with open(comp_desc_path, "r", encoding="utf-8") as f:
                comp_desc = json.load(f)
            stale_node = comp_desc["moreModuleInfo"][7]["module_componets"][0]["generalAttr"]["moduleName"]
            stale_node["stringValue"] = "STALE_COMP_DESC_NAME"
            with open(comp_desc_path, "w", encoding="utf-8") as f:
                json.dump(comp_desc, f, ensure_ascii=False, indent=2)

            old_db_dir = data_manager.DB_DIR
            data_manager.DB_DIR = temp_root
            try:
                result = compile_cmodel_api(project_id)
            finally:
                data_manager.DB_DIR = old_db_dir

            self.assertEqual(result["status"], "success")
            self.assertIn("diagnostics", result)
            self.assertIsInstance(result["diagnostics"], list)
            self.assertIn("debug_artifacts_path", result)
            self.assertIn("debug_artifacts_url", result)
            self.assertTrue(any(line.startswith("DIAGNOSTIC[") for line in result["audit"]))
            csv_text = (project_dir / f"{project_id}_module_list.csv").read_text(encoding="utf-8-sig")
            self.assertIn("LIVE_BLUEPRINT_NAME", csv_text)
            self.assertNotIn("STALE_COMP_DESC_NAME", csv_text)

            debug_dir = project_dir / result["debug_artifacts_path"]
            self.assertTrue((debug_dir / "01_resolved_CompDesc.json").exists())
            self.assertTrue((debug_dir / "02_diagnostics.json").exists())
            self.assertTrue((debug_dir / "03_audit.json").exists())
            self.assertTrue((debug_dir / "05_module_list.csv").exists())
            self.assertTrue((debug_dir / "06_final_packed.cmodel").exists())
            self.assertTrue((debug_dir / "07_ModelFileDesc.json").exists())

    def test_compile_requires_blueprint(self):
        with tempfile.TemporaryDirectory() as td:
            temp_root = Path(td)
            project_id = "proj_missing_blueprint"
            project_dir = temp_root / project_id
            project_dir.mkdir(parents=True)

            old_db_dir = data_manager.DB_DIR
            data_manager.DB_DIR = temp_root
            try:
                with self.assertRaises(HTTPException) as ctx:
                    compile_cmodel_api(project_id)
            finally:
                data_manager.DB_DIR = old_db_dir

            self.assertEqual(ctx.exception.status_code, 400)
            self.assertIn("blueprint_CompDesc.json", ctx.exception.detail)

    def test_encode_preserves_project_specific_funcdesc_model(self):
        with tempfile.TemporaryDirectory() as td:
            project_dir = Path(td) / "proj"
            shutil.copytree(SAMPLE_PROJECT, project_dir)

            custom_func_model = b"project specific funcdesc"
            func_model_path = project_dir / "FuncDesc.model"
            func_model_path.write_bytes(custom_func_model)
            func_json_path = project_dir / "FuncDesc.json"
            if func_json_path.exists():
                func_json_path.unlink()

            out_path = project_dir / "regression.cmodel"
            encode_cmodel(str(project_dir), str(out_path))

            self.assertEqual(func_model_path.read_bytes(), custom_func_model)
            with zipfile.ZipFile(out_path, "r") as zf:
                self.assertEqual(zf.read("FuncDesc.model"), custom_func_model)


if __name__ == "__main__":
    unittest.main()
