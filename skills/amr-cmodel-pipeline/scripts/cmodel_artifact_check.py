#!/usr/bin/env python3
"""Check AMR Studio cmodel build/debug artifact directories."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


EXPECTED_ANY = [
    "CompDesc.json",
    "AbiSet.json",
    "FuncDesc.json",
    "blueprint_CompDesc.json",
]

EXPECTED_DEBUG_SUFFIXES = [
    "01_resolved_CompDesc.json",
    "04_blueprint_CompDesc.json",
    "06_final_packed.cmodel",
    "08_CompDesc.model",
    "09_AbiSet.model",
    "10_FuncDesc.model",
]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("path", help="Project directory or debug artifact directory")
    parser.add_argument("--json", action="store_true", help="Print JSON only")
    args = parser.parse_args()

    root = Path(args.path).expanduser().resolve()
    files = [p for p in root.rglob("*") if p.is_file()]
    names = {p.name for p in files}
    suffixes = {"/".join(p.parts[-2:]) for p in files}
    missing_any = [name for name in EXPECTED_ANY if name not in names]
    missing_debug = []
    for suffix in EXPECTED_DEBUG_SUFFIXES:
        if suffix not in names and not any(item.endswith(suffix) for item in suffixes):
            missing_debug.append(suffix)

    result = {
        "path": str(root),
        "fileCount": len(files),
        "hasCmodel": any(p.suffix == ".cmodel" for p in files),
        "hasModelFiles": any(p.suffix == ".model" for p in files),
        "missingCommonArtifacts": missing_any,
        "missingDebugArtifacts": missing_debug,
        "cmodelFiles": [str(p) for p in files if p.suffix == ".cmodel"],
    }
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"Path: {result['path']}")
        print(f"Files: {result['fileCount']}")
        print(f"Has cmodel: {result['hasCmodel']}")
        print(f"Has .model files: {result['hasModelFiles']}")
        print(f"Missing common artifacts: {', '.join(missing_any) if missing_any else 'none'}")
        print(f"Missing debug artifacts: {', '.join(missing_debug) if missing_debug else 'none'}")
        for cmodel in result["cmodelFiles"]:
            print(f"CModel: {cmodel}")
    return 1 if missing_any and missing_debug else 0


if __name__ == "__main__":
    raise SystemExit(main())

