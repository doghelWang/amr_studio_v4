import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2] / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.infrastructure.protobuf.model_parser import ModelParser


FIXTURE = Path(__file__).resolve().parents[1] / "full_pipeline_audit" / "audit_results_12345" / "12345_audit.cmodel"


def test_parse_modelset_returns_canonical_artifacts():
    result = ModelParser.parse_modelset(FIXTURE)

    assert set(result) == {"CompDesc.json", "AbiSet.json", "FuncDesc.json"}
    assert isinstance(result["CompDesc.json"].get("moreModuleInfo"), list)
    assert isinstance(result["AbiSet.json"].get("functionAbility"), list)
    assert isinstance(result["FuncDesc.json"].get("function"), list)
