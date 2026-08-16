import sys
import zipfile
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2] / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.infrastructure.protobuf.model_parser import ModelParser


FIXTURE = Path(__file__).resolve().parents[1] / "full_pipeline_audit" / "audit_results_12345" / "12345_audit.cmodel"


def test_comp_desc_binary_uses_official_proto_schema():
    with zipfile.ZipFile(FIXTURE, "r") as archive:
        comp_desc = ModelParser.get_comp_desc_from_binary(archive.read("CompDesc.model"))

    assert "moreModuleInfo" in comp_desc
    assert isinstance(comp_desc["moreModuleInfo"], list)
