import json
import shutil
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

from fastapi.testclient import TestClient
from google.protobuf.json_format import MessageToDict


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import main as backend_main
from core import data_manager
from skills_v2.schemas_pb import controller_model_comp_desc_pb2


SAMPLE_PROJECT = REPO_ROOT / "src" / "backend" / "saved_projects" / "proj_8b800f1b"
SAMPLE_CMODEL = SAMPLE_PROJECT / "proj_8b800f1b_packed.cmodel"
TARGET_UUID = "1393d6e420b447efb2b74dec43fc8857"
TARGET_NAME = "E2E_HTTP_PATCHED_NAME"


def iter_module_names(node):
    comps = node.get("moduleComponets", []) or node.get("module_componets", [])
    for comp in comps:
        general = comp.get("generalAttr", {}) or comp.get("general_attr", {})
        name = general.get("moduleName", {}).get("stringValue") or general.get("module_name", {}).get("string_value")
        if name:
            yield name
    children = node.get("moreModuleInfo", []) or node.get("more_module_info", [])
    for child in children:
        yield from iter_module_names(child)


class BackendApiE2ETests(unittest.TestCase):
    def test_upload_patch_compile_roundtrip(self):
        with tempfile.TemporaryDirectory() as td:
            temp_root = Path(td)
            old_db_dir = data_manager.DB_DIR
            old_saved_projects_dir = backend_main.SAVED_PROJECTS_DIR
            data_manager.DB_DIR = temp_root
            backend_main.SAVED_PROJECTS_DIR = temp_root

            try:
                client = TestClient(backend_main.app)

                with open(SAMPLE_CMODEL, "rb") as f:
                    response = client.post(
                        "/api/v1/models/upload",
                        files={"file": ("sample.cmodel", f, "application/octet-stream")},
                    )
                self.assertEqual(response.status_code, 200, response.text)
                upload_data = response.json()
                self.assertEqual(upload_data["status"], "success")
                project_id = upload_data["project_id"]
                project_dir = temp_root / project_id
                self.assertTrue(project_dir.exists())

                patch_response = client.patch(
                    f"/api/v1/models/{project_id}/components/{TARGET_UUID}",
                    json={
                        "generalAttr": {
                            "moduleName": {
                                "stringValue": TARGET_NAME,
                            }
                        }
                    },
                )
                self.assertEqual(patch_response.status_code, 200, patch_response.text)
                self.assertEqual(patch_response.json()["status"], "success")

                compile_response = client.post(f"/api/v1/models/{project_id}/compile")
                self.assertEqual(compile_response.status_code, 200, compile_response.text)
                compile_data = compile_response.json()
                self.assertEqual(compile_data["status"], "success")

                csv_path = project_dir / f"{project_id}_module_list.csv"
                cmodel_path = project_dir / f"{project_id}_packed.cmodel"
                self.assertTrue(csv_path.exists())
                self.assertTrue(cmodel_path.exists())

                csv_text = csv_path.read_text(encoding="utf-8-sig")
                self.assertIn(TARGET_NAME, csv_text)

                with zipfile.ZipFile(cmodel_path, "r") as zf:
                    comp_model_bytes = zf.read("CompDesc.model")

                msg = controller_model_comp_desc_pb2.Message_Module_Info()
                msg.ParseFromString(comp_model_bytes)
                comp_dict = MessageToDict(msg, preserving_proto_field_name=False, use_integers_for_enums=True)
                exported_names = set(iter_module_names(comp_dict))
                self.assertIn(TARGET_NAME, exported_names)
            finally:
                data_manager.DB_DIR = old_db_dir
                backend_main.SAVED_PROJECTS_DIR = old_saved_projects_dir


if __name__ == "__main__":
    unittest.main()
