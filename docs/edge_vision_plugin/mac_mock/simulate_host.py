#!/usr/bin/env python3
"""Simple host-process simulator for the mac mock plugin chain."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
PLUGIN_API_PATH = BASE_DIR / "plugin_api.py"
DEFAULT_CONFIG_PATH = BASE_DIR / "config.json"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="simulate host process")
    parser.add_argument("--scenario", choices=["success", "fail", "timeout", "all"], default="all")
    parser.add_argument("--config", default=str(DEFAULT_CONFIG_PATH))
    parser.add_argument("--timeout", type=float, default=None)
    return parser


def run_scenario(scenario: str, config_path: str, timeout: float | None) -> bool:
    command = [
        sys.executable,
        str(PLUGIN_API_PATH),
        "--config",
        config_path,
        "--mode",
        scenario,
    ]
    if timeout is not None:
        command.extend(["--timeout", str(timeout)])

    print(f"[host] invoking plugin_api for scenario={scenario}", flush=True)
    completed = subprocess.run(command, capture_output=True, text=True)
    payload = None

    if completed.stderr.strip():
        print("[host] stderr:", flush=True)
        print(completed.stderr.rstrip(), flush=True)

    if completed.stdout.strip():
        payload = json.loads(completed.stdout.strip().splitlines()[-1])
        print("[host] result json:", flush=True)
        print(json.dumps(payload, indent=2, ensure_ascii=True), flush=True)
    else:
        print("[host] no stdout received from plugin_api", flush=True)

    expected_status = {
        "success": "success",
        "fail": "failed",
        "timeout": "timeout",
    }[scenario]
    return bool(payload) and payload.get("status") == expected_status


def main() -> int:
    args = build_parser().parse_args()
    scenarios = ["success", "fail", "timeout"] if args.scenario == "all" else [args.scenario]

    all_matched = True
    for scenario in scenarios:
        matched = run_scenario(scenario, args.config, args.timeout)
        all_matched = all_matched and matched
        print("-" * 60, flush=True)

    return 0 if all_matched else 1


if __name__ == "__main__":
    sys.exit(main())
