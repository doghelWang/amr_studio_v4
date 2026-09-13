#!/usr/bin/env python3
"""Batch import .cmodel files into AMR Studio backend and summarize parsed facts."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from collections import Counter
from pathlib import Path
from typing import Any

import requests


def value_of(item: Any) -> Any:
    if not isinstance(item, dict):
        return None
    for key in (
        "stringValue",
        "string_value",
        "uint32Value",
        "uint32_value",
        "int32Value",
        "int32_value",
        "doubleValue",
        "double_value",
        "floatValue",
        "float_value",
        "boolValue",
        "bool_value",
        "stringFix",
    ):
        if key in item:
            return item[key]
    combo = item.get("comboType") or item.get("combo_type")
    if isinstance(combo, dict):
        return combo.get("typeKey") or combo.get("type_key") or combo.get("typeDesc") or combo.get("type_desc")
    return None


def combo_key(item: Any) -> str | None:
    combo = item.get("comboType") or item.get("combo_type") if isinstance(item, dict) else None
    return combo.get("typeKey") or combo.get("type_key") if isinstance(combo, dict) else None


def combo_desc(item: Any) -> str | None:
    combo = item.get("comboType") or item.get("combo_type") if isinstance(item, dict) else None
    return combo.get("typeDesc") or combo.get("type_desc") if isinstance(combo, dict) else None


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def collect_components(root: dict[str, Any]) -> list[tuple[str | None, dict[str, Any]]]:
    out: list[tuple[str | None, dict[str, Any]]] = []

    def walk(group: dict[str, Any], parent: str | None = None) -> None:
        group_name = group.get("moduleGroupName") or group.get("module_group_name") or parent
        for comp in group.get("moduleComponets") or group.get("module_components") or []:
            if isinstance(comp, dict) and "$ref" not in comp:
                out.append((group_name, comp))
        for child in group.get("moreModuleInfo") or group.get("more_module_info") or []:
            if isinstance(child, dict):
                walk(child, group_name)

    for group in root.get("moreModuleInfo") or root.get("more_module_info") or []:
        if isinstance(group, dict):
            walk(group)
    return out


def extend_params(comp: dict[str, Any]) -> dict[str, Any]:
    struct = comp.get("structParam") or comp.get("struct_param") or {}
    params = struct.get("extendParams") or struct.get("extend_params") or []
    result: dict[str, Any] = {}
    for item in params if isinstance(params, list) else []:
        if isinstance(item, dict) and item.get("key"):
            result[item["key"]] = value_of(item)
    return result


def interfaces(comp: dict[str, Any]) -> list[dict[str, Any]]:
    params = comp.get("interfaceParams") or comp.get("interface_params") or {}
    groups = params.get("interfaceGroup") or params.get("interface_group") or []
    groups = [groups] if isinstance(groups, dict) else groups
    result: list[dict[str, Any]] = []
    for group in groups if isinstance(groups, list) else []:
        if not isinstance(group, dict):
            continue
        if group.get("interfaceUuid") or group.get("interface_uuid"):
            result.append(group)
        for key in ("interface", "interfaces", "arrayInterface", "array_interface"):
            nested = group.get(key)
            if isinstance(nested, list):
                result.extend(item for item in nested if isinstance(item, dict))
    return result


def function_nodes(raw: dict[str, Any]) -> list[dict[str, str]]:
    result: list[dict[str, str]] = []

    def walk(item: dict[str, Any], prefix: str = "") -> None:
        node_type = str(item.get("type") or item.get("key") or "")
        desc = str(item.get("desc") or item.get("name") or "")
        path = f"{prefix}/{node_type}" if prefix and node_type else node_type or prefix
        result.append({"type": node_type, "desc": desc, "path": path})
        for child_key in ("childFunction", "child_function", "children"):
            children = item.get(child_key)
            if isinstance(children, list):
                for child in children:
                    if isinstance(child, dict):
                        walk(child, path)

    funcs = raw.get("function") or raw.get("functions") or []
    for func in funcs if isinstance(funcs, list) else []:
        if isinstance(func, dict):
            walk(func)
    return result


def upload_model(api: str, path: Path) -> dict[str, Any]:
    with path.open("rb") as handle:
        response = requests.post(
            f"{api.rstrip('/')}/models/upload",
            files={"file": (path.name, handle, "application/octet-stream")},
            timeout=90,
        )
    if not response.ok:
        try:
            detail = response.json()
        except Exception:
            detail = response.text
        raise RuntimeError(f"upload failed: HTTP {response.status_code}: {detail}")
    return response.json()


def get_json(api: str, project_id: str, endpoint: str) -> dict[str, Any]:
    response = requests.get(f"{api.rstrip('/')}/models/{project_id}/{endpoint}", timeout=60)
    return response.json() if response.ok else {}


def summarize_model(api: str, path: Path) -> dict[str, Any]:
    uploaded = upload_model(api, path)
    project_id = uploaded.get("project_id")
    full = uploaded.get("full_json") or {}
    abilities = get_json(api, project_id, "abilities") if project_id else {}
    functions = get_json(api, project_id, "functions") if project_id else {}

    iface_index: dict[str, dict[str, Any]] = {}
    components = []
    for group_name, comp in collect_components(full):
        general = comp.get("generalAttr") or comp.get("general_attr") or {}
        uuid = value_of(general.get("moduleUuid") or general.get("module_uuid"))
        name = value_of(general.get("moduleName") or general.get("module_name"))
        desc = value_of(general.get("moduleDesc") or general.get("module_desc"))
        main_type = combo_key(general.get("mainModuleType") or general.get("main_module_type"))
        sub_type = combo_key(general.get("subModuleType") or general.get("sub_module_type"))
        mount = {
            key: val
            for key, val in extend_params(comp).items()
            if key in {"locCoordX", "locCoordY", "locCoordZ", "locCoordROLL", "locCoordPITCH", "locCoordYAW", "parentNodeUuid"}
        }
        ifaces = []
        for iface in interfaces(comp):
            iface_uuid = iface.get("interfaceUuid") or iface.get("interface_uuid")
            item = {
                "interfaceUuid": iface_uuid,
                "key": iface.get("key"),
                "type": iface.get("type"),
                "desc": iface.get("desc"),
                "linkedInterfaceUuid": iface.get("linkedInterfaceUuid") or iface.get("linked_interface_uuid") or [],
            }
            ifaces.append(item)
            if iface_uuid:
                iface_index[iface_uuid] = {
                    "moduleUuid": uuid,
                    "moduleName": name,
                    "interfaceKey": item["key"],
                    "interfaceType": item["type"],
                }
        components.append(
            {
                "moduleUuid": uuid,
                "moduleName": name,
                "moduleDesc": desc,
                "groupName": group_name,
                "mainModuleType": main_type,
                "mainModuleTypeDesc": combo_desc(general.get("mainModuleType") or general.get("main_module_type")),
                "subModuleType": sub_type,
                "subModuleTypeDesc": combo_desc(general.get("subModuleType") or general.get("sub_module_type")),
                "mount": mount,
                "interfaceCount": len(ifaces),
                "interfaces": ifaces,
            }
        )

    connections = []
    seen = set()
    missing = 0
    for comp in components:
        for iface in comp["interfaces"]:
            source_uuid = iface.get("interfaceUuid")
            for target_uuid in iface.get("linkedInterfaceUuid") or []:
                key = tuple(sorted([source_uuid or "", target_uuid or ""]))
                if key in seen:
                    continue
                seen.add(key)
                target = iface_index.get(target_uuid)
                if not target:
                    missing += 1
                connections.append(
                    {
                        "sourceModule": comp["moduleName"],
                        "sourceModuleUuid": comp["moduleUuid"],
                        "sourceInterface": iface.get("key"),
                        "sourceInterfaceUuid": source_uuid,
                        "sourceType": iface.get("type"),
                        "targetModule": target.get("moduleName") if target else None,
                        "targetModuleUuid": target.get("moduleUuid") if target else None,
                        "targetInterface": target.get("interfaceKey") if target else None,
                        "targetInterfaceUuid": target_uuid,
                        "targetType": target.get("interfaceType") if target else None,
                    }
                )

    ability_component = abilities.get("componentAbility") or [] if isinstance(abilities, dict) else []
    ability_function = abilities.get("functionAbility") or [] if isinstance(abilities, dict) else []
    funcs = function_nodes(functions if isinstance(functions, dict) else {})
    return {
        "sourcePath": str(path),
        "sha256": sha256(path),
        "remoteProjectId": project_id,
        "status": "success",
        "componentCount": len(components),
        "componentTypeCounts": dict(Counter(c.get("mainModuleType") or "UNKNOWN" for c in components)),
        "components": components,
        "connectionCount": len(connections),
        "missingConnectionTargets": missing,
        "connections": connections,
        "abilitySummary": {
            "componentAbilityCount": len(ability_component),
            "functionAbilityCount": len(ability_function),
        },
        "functionSummary": {
            "functionNodeCount": len(funcs),
            "functions": funcs,
        },
    }


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    keys: list[str] = []
    for row in rows:
        for key in row:
            if key not in keys:
                keys.append(key)
    with path.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=keys)
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True, help="Directory or .cmodel file to scan")
    parser.add_argument("--api", required=True, help="AMR Studio API base, e.g. http://host:8888/api/v1")
    parser.add_argument("--out", required=True, help="Output path prefix or directory")
    parser.add_argument("--limit", type=int, default=0)
    args = parser.parse_args()

    root = Path(args.root).expanduser()
    files = [root] if root.is_file() else sorted(root.rglob("*.cmodel"))
    by_hash: dict[str, Path] = {}
    for file_path in files:
        by_hash.setdefault(sha256(file_path), file_path)
    unique = list(by_hash.values())[: args.limit or None]

    results = []
    for idx, file_path in enumerate(unique, 1):
        print(f"[{idx}/{len(unique)}] {file_path}")
        try:
            results.append(summarize_model(args.api, file_path))
        except Exception as exc:
            results.append({"sourcePath": str(file_path), "sha256": sha256(file_path), "status": "error", "error": repr(exc)})

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    summary_path = out / "cmodel_summary.json"
    summary_path.write_text(json.dumps({"results": results}, ensure_ascii=False, indent=2), encoding="utf-8")

    model_rows = []
    component_rows = []
    connection_rows = []
    function_rows = []
    for result in results:
        name = Path(result["sourcePath"]).name
        model_rows.append(
            {
                "file": name,
                "sourcePath": result["sourcePath"],
                "status": result["status"],
                "remoteProjectId": result.get("remoteProjectId", ""),
                "componentCount": result.get("componentCount", ""),
                "connectionCount": result.get("connectionCount", ""),
                "missingConnectionTargets": result.get("missingConnectionTargets", ""),
                "componentAbilityCount": (result.get("abilitySummary") or {}).get("componentAbilityCount", ""),
                "functionAbilityCount": (result.get("abilitySummary") or {}).get("functionAbilityCount", ""),
                "functionNodeCount": (result.get("functionSummary") or {}).get("functionNodeCount", ""),
                "error": result.get("error", ""),
            }
        )
        if result.get("status") != "success":
            continue
        for component in result["components"]:
            component_rows.append({"file": name, **{k: v for k, v in component.items() if k != "interfaces"}})
        for connection in result["connections"]:
            connection_rows.append({"file": name, **connection})
        for function in result["functionSummary"]["functions"]:
            function_rows.append({"file": name, **function})

    write_csv(out / "model_index.csv", model_rows)
    write_csv(out / "components.csv", component_rows)
    write_csv(out / "connections.csv", connection_rows)
    write_csv(out / "functions.csv", function_rows)
    print(summary_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

