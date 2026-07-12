import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2] / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from core.model_parser import ModelParser
import zipfile
import json
import os

def test():
    from core import model_parser

    if not hasattr(model_parser, "PureProtoDecoder") or not hasattr(model_parser, "collapse_parsed_protobuf"):
        raise RuntimeError(
            "Legacy generic protobuf decoder is no longer exported by core.model_parser; "
            "use ModelParser for official protobuf parsing."
        )

    PureProtoDecoder = model_parser.PureProtoDecoder
    collapse_parsed_protobuf = model_parser.collapse_parsed_protobuf

    zip_path = '/Users/wangfeifei/code/amr_studio_v4/docs/ModelSet312.cmodel'
    with zipfile.ZipFile(zip_path, 'r') as zf:
        comp_data = zf.read('CompDesc.model')
        
    raw_parsed = PureProtoDecoder.parse_protobuf_generic(comp_data)
    json_data = collapse_parsed_protobuf(raw_parsed)

    modules = json_data.get("5", [])
    if not isinstance(modules, list): modules = [modules]

    print(f"Total modules: {len(modules)}")
    for i, mod in enumerate(modules):
        family = mod.get("1", "unknown")
        if not isinstance(family, str):
            continue
        print(f"Mod {i}: {family}")
        
        # Check if it has an IO module
        if "io" in family.lower() or "button" in family.lower() or "lamp" in family.lower():
            print(f"  -> Found IO related! Props: {json.dumps(mod)[:200]}...")

if __name__ == '__main__':
    test()
