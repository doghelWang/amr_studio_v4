import json
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.infrastructure.protobuf.cmodel_encoder import (
    COMP_DESC_TYPE_STRING_TO_INT,
    ReferenceResolutionError,
    _parse_message_strict,
    controller_model_comp_desc_pb2,
    proto_final_sync,
    resolve_with_fidelity,
)
from app.infrastructure.protobuf.model_splitter import split_comp_desc


class StrictPipelineTests(unittest.TestCase):
    def test_unknown_enum_is_rejected_in_strict_mode(self):
        with self.assertRaises(ValueError):
            proto_final_sync(
                {"type": "DATA_NOT_IN_PROTO"},
                COMP_DESC_TYPE_STRING_TO_INT,
                strict=True,
            )

    def test_unknown_proto_field_is_rejected(self):
        with self.assertRaises(ValueError):
            _parse_message_strict(
                {"notAProtoField": "must not be dropped"},
                controller_model_comp_desc_pb2.Message_Module_Info,
                "CompDesc",
            )

    def test_missing_and_escaping_references_are_rejected(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            with self.assertRaises(ReferenceResolutionError):
                resolve_with_fidelity({"$ref": "missing.json"}, temp_dir, strict=True)
            with self.assertRaises(ReferenceResolutionError):
                resolve_with_fidelity({"$ref": "../outside.json"}, temp_dir, strict=True)

    def test_circular_references_are_rejected(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "a.json").write_text(json.dumps({"$ref": "b.json"}), encoding="utf-8")
            (root / "b.json").write_text(json.dumps({"$ref": "a.json"}), encoding="utf-8")
            with self.assertRaises(ReferenceResolutionError):
                resolve_with_fidelity({"$ref": "a.json"}, temp_dir, strict=True)

    def test_splitter_uses_internal_names_and_preserves_module_data(self):
        source = {
            "moduleComponets": [
                {
                    "generalAttr": {
                        "moduleName": {"stringValue": "../../not-a-file-name"},
                        "moduleUuid": {"stringValue": ""},
                    },
                    "privateAttr": [{"key": "sourceValue", "stringValue": "001"}],
                }
            ]
        }
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            source_path = root / "CompDesc.json"
            split_dir = root / "split"
            source_path.write_text(json.dumps(source), encoding="utf-8")

            split_comp_desc(str(source_path), str(split_dir))

            blueprint = json.loads((split_dir / "blueprint_CompDesc.json").read_text(encoding="utf-8"))
            self.assertEqual(blueprint["moduleComponets"], [{"$ref": "modules/module_000000.json"}])
            self.assertEqual(resolve_with_fidelity(blueprint, str(split_dir), strict=True), source)


if __name__ == "__main__":
    unittest.main()
