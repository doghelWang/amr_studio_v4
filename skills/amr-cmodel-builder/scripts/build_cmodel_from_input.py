#!/usr/bin/env python3
"""Build AMR Studio V4 cmodel artifacts from explicit human input JSON."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

try:
    import requests
except Exception:
    requests = None


def load_input(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("input root must be an object")
    return data


def validate(data: dict[str, Any]) -> list[dict[str, str]]:
    diagnostics: list[dict[str, str]] = []
    project_id = data.get("projectId")
    config = data.get("config")
    if not project_id:
        diagnostics.append({"severity": "error", "code": "PROJECT_ID_MISSING", "message": "projectId is required."})
    if not isinstance(config, dict):
        diagnostics.append({"severity": "error", "code": "CONFIG_MISSING", "message": "config object is required."})
        return diagnostics
    components = config.get("components")
    if not isinstance(components, list):
        diagnostics.append({"severity": "error", "code": "COMPONENTS_MISSING", "message": "config.components must be an array."})
        return diagnostics
    if not components:
        diagnostics.append({"severity": "warning", "code": "COMPONENTS_EMPTY", "message": "No components were provided."})
    seen_interfaces = set()
    linked = []
    for idx, comp in enumerate(components):
        if not isinstance(comp, dict):
            diagnostics.append({"severity": "error", "code": "COMPONENT_INVALID", "message": f"components[{idx}] must be an object."})
            continue
        comp_id = comp.get("id") or comp.get("moduleUuid") or comp.get("uuid")
        if not comp_id:
            diagnostics.append({"severity": "error", "code": "COMPONENT_ID_MISSING", "message": f"components[{idx}] lacks id/moduleUuid/uuid."})
        for iface in comp.get("interfaces") or []:
            if not isinstance(iface, dict):
                continue
            iface_uuid = iface.get("interfaceUuid")
            if iface_uuid:
                seen_interfaces.add(iface_uuid)
            for target in iface.get("linkedInterfaceUuid") or []:
                linked.append((iface_uuid, target))
    for source, target in linked:
        if target not in seen_interfaces:
            diagnostics.append({"severity": "error", "code": "CONNECTION_TARGET_NOT_FOUND", "message": f"{source} links to missing interface {target}."})
    for bus in config.get("buses") or []:
        if isinstance(bus, dict) and not bus.get("type"):
            diagnostics.append({"severity": "error", "code": "BUS_TYPE_MISSING", "message": "Every bus entry requires explicit type."})
    return diagnostics


def has_errors(diagnostics: list[dict[str, str]]) -> bool:
    return any(item.get("severity") == "error" for item in diagnostics)


def build(api: str, data: dict[str, Any]) -> dict[str, Any]:
    if requests is None:
        raise RuntimeError("requests is required for backend build mode")
    api = api.rstrip("/")
    project_id = data["projectId"]
    config = data["config"]
    init_response = requests.post(f"{api}/models/init-sandbox", json={"projectId": project_id, "config": config}, timeout=90)
    if not init_response.ok:
        raise RuntimeError(f"init-sandbox failed: HTTP {init_response.status_code}: {init_response.text[:500]}")
    init_json = init_response.json()
    ability_json = None
    if config.get("abilities"):
        ability_response = requests.patch(f"{api}/models/{project_id}/abilities", json=config["abilities"], timeout=60)
        if not ability_response.ok:
            raise RuntimeError(f"abilities update failed: HTTP {ability_response.status_code}: {ability_response.text[:500]}")
        ability_json = ability_response.json()
    compile_response = requests.post(f"{api}/models/{project_id}/compile", timeout=120)
    if not compile_response.ok:
        raise RuntimeError(f"compile failed: HTTP {compile_response.status_code}: {compile_response.text[:500]}")
    return {"init": init_json, "abilities": ability_json, "compile": compile_response.json()}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Explicit human-provided build JSON")
    parser.add_argument("--out", required=True, help="Build report JSON path")
    parser.add_argument("--api", help="AMR Studio API base, e.g. http://host:8888/api/v1")
    parser.add_argument("--dry-run", action="store_true", help="Validate only, do not call backend")
    args = parser.parse_args()

    data = load_input(Path(args.input).expanduser())
    diagnostics = validate(data)
    report: dict[str, Any] = {
        "input": str(Path(args.input).expanduser()),
        "projectId": data.get("projectId"),
        "diagnostics": diagnostics,
        "status": "blocked" if has_errors(diagnostics) else "validated",
    }
    if not args.dry_run and not has_errors(diagnostics):
        if not args.api:
            raise ValueError("--api is required unless --dry-run is set")
        report["backend"] = build(args.api, data)
        report["status"] = "success"
    output = Path(args.out).expanduser()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(output)
    return 1 if has_errors(diagnostics) else 0


if __name__ == "__main__":
    raise SystemExit(main())

