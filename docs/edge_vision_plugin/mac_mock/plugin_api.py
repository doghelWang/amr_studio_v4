#!/usr/bin/env python3
"""Plugin entrypoint that starts the worker, relays structured IPC events, and returns JSON."""

from __future__ import annotations

import argparse
import importlib
import json
import queue
import subprocess
import sys
import threading
import time
from pathlib import Path
from typing import Any

from protocol import build_request, loads_message


BASE_DIR = Path(__file__).resolve().parent
DEFAULT_CONFIG_PATH = BASE_DIR / "config.json"
WORKER_PATH = BASE_DIR / "worker.py"


def load_config(config_path: Path) -> dict[str, Any]:
    return json.loads(config_path.read_text(encoding="utf-8"))


def load_host_runtime() -> Any | None:
    try:
        return importlib.import_module("host_runtime")
    except ModuleNotFoundError:
        return None


def resolve_device_fingerprint(config: dict[str, Any]) -> str:
    host_runtime = load_host_runtime()
    if host_runtime is not None and hasattr(host_runtime, "get_device_fingerprint"):
        return str(host_runtime.get_device_fingerprint())
    return str(config["license"]["device_fingerprint"])


def resolve_license_path(config: dict[str, Any], mode: str) -> Path:
    scenario_paths = config["license"].get("scenario_license_paths", {})
    candidate = scenario_paths.get(mode, config["license"]["default_license_path"])
    return (BASE_DIR / candidate).resolve()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="mac mock plugin api")
    parser.add_argument("--config", default=str(DEFAULT_CONFIG_PATH))
    parser.add_argument("--mode", choices=["success", "fail", "timeout", "license_invalid"], default="success")
    parser.add_argument("--timeout", type=float, default=None)
    return parser


def _reader_thread(stdout: Any, event_queue: queue.Queue[dict[str, Any]]) -> None:
    try:
        for raw_line in stdout:
            line = raw_line.strip()
            if not line:
                continue
            event_queue.put(loads_message(line))
    finally:
        event_queue.put({"type": "_stream_closed"})


def resolve_python_executable() -> str:
    candidates = [
        getattr(sys, "_base_executable", ""),
        getattr(sys, "executable", ""),
        "python3",
    ]
    for candidate in candidates:
        if not candidate:
            continue
        if "python" in Path(candidate).name.lower():
            return candidate
    return "python3"


def build_worker_command() -> list[str]:
    return [resolve_python_executable(), str(WORKER_PATH)]


def log_event(event: dict[str, Any]) -> None:
    print(
        f"[plugin_api] event type={event['event_type']} request_id={event['request_id']}",
        file=sys.stderr,
        flush=True,
    )


def log_progress(event: dict[str, Any]) -> None:
    payload = event["payload"]
    print(
        f"[plugin_api] progress frame={payload['frame_index']} "
        f"task_id={event['task_id']} elapsed_ms={payload['elapsed_ms']}",
        file=sys.stderr,
        flush=True,
    )


def notify_host_worker_event(event: dict[str, Any]) -> None:
    host_runtime = load_host_runtime()
    if host_runtime is not None and hasattr(host_runtime, "notify_worker_event"):
        host_runtime.notify_worker_event(json.dumps(event, ensure_ascii=True))


def emit_host_callback(result: dict[str, Any]) -> None:
    host_runtime = load_host_runtime()
    if host_runtime is not None and hasattr(host_runtime, "notify_plugin_result"):
        host_runtime.notify_plugin_result(json.dumps(result, ensure_ascii=True))


def build_timeout_result(
    task: dict[str, Any],
    scenario: dict[str, Any],
    request_id: str,
    mode: str,
    timeout_seconds: float,
    heartbeat_count: int,
    stderr_text: str,
    auth_payload: dict[str, Any] | None,
) -> dict[str, Any]:
    result = {
        "status": "timeout",
        "task_id": task["task_id"],
        "object_id": task["object_id"],
        "confidence": 0.0,
        "elapsed_ms": int(timeout_seconds * 1000),
        "message": scenario["message"],
        "error_code": scenario["error_code"],
        "heartbeat_count": heartbeat_count,
        "request_id": request_id,
        "mode": mode,
        "worker_stderr": stderr_text,
    }
    if auth_payload is not None:
        result["license"] = auth_payload
    return result


def build_internal_failure_result(
    task: dict[str, Any],
    request_id: str,
    mode: str,
    heartbeat_count: int,
    elapsed_ms: int,
    message: str,
    stderr_text: str,
    returncode: int | None,
    auth_payload: dict[str, Any] | None,
) -> dict[str, Any]:
    result = {
        "status": "failed",
        "task_id": task["task_id"],
        "object_id": task["object_id"],
        "confidence": 0.0,
        "elapsed_ms": elapsed_ms,
        "message": message,
        "error_code": "E5001",
        "heartbeat_count": heartbeat_count,
        "request_id": request_id,
        "mode": mode,
        "worker_stderr": stderr_text,
        "worker_returncode": returncode,
    }
    if auth_payload is not None:
        result["license"] = auth_payload
    return result


def run_plugin(config: dict[str, Any], mode: str, timeout_seconds: float) -> dict[str, Any]:
    request = build_request(config, mode, timeout_seconds)
    request_id = request["request_id"]
    heartbeat_count = 0
    start = time.monotonic()
    task = config["task"]
    timeout_scenario = config["scenarios"]["timeout"]
    auth_payload: dict[str, Any] | None = None

    request["license"] = {
        "product": config["license"]["product"],
        "required_feature": config["license"]["required_feature"],
        "device_fingerprint": resolve_device_fingerprint(config),
        "license_path": str(resolve_license_path(config, mode)),
        "algorithm_library_path": str((BASE_DIR / config["compiled_core"]["algorithm_library_path"]).resolve()),
    }

    process = subprocess.Popen(
        build_worker_command(),
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
        cwd=str(BASE_DIR),
    )

    assert process.stdin is not None
    assert process.stdout is not None

    event_queue: queue.Queue[dict[str, Any]] = queue.Queue()
    reader = threading.Thread(target=_reader_thread, args=(process.stdout, event_queue), daemon=True)
    reader.start()

    process.stdin.write(json.dumps(request, ensure_ascii=True) + "\n")
    process.stdin.flush()
    process.stdin.close()

    while True:
        elapsed = time.monotonic() - start
        remaining = timeout_seconds - elapsed
        if remaining <= 0:
            process.kill()
            process.wait(timeout=1)
            stderr_text = process.stderr.read().strip() if process.stderr else ""
            return build_timeout_result(
                task=task,
                scenario=timeout_scenario,
                request_id=request_id,
                mode=mode,
                timeout_seconds=timeout_seconds,
                heartbeat_count=heartbeat_count,
                stderr_text=stderr_text,
                auth_payload=auth_payload,
            )

        try:
            event = event_queue.get(timeout=min(config["runtime"]["poll_interval_seconds"], remaining))
        except queue.Empty:
            if process.poll() is not None and event_queue.empty():
                stderr_text = process.stderr.read().strip() if process.stderr else ""
                return build_internal_failure_result(
                    task=task,
                    request_id=request_id,
                    mode=mode,
                    heartbeat_count=heartbeat_count,
                    elapsed_ms=int((time.monotonic() - start) * 1000),
                    message="worker exited before sending a terminal event",
                    stderr_text=stderr_text,
                    returncode=process.returncode,
                    auth_payload=auth_payload,
                )
            continue

        event_type = event.get("event_type")
        if event_type == "task.progress":
            heartbeat_count += 1
            log_progress(event)
            notify_host_worker_event(event)
            continue

        if event_type in {"worker.ready", "task.accepted", "task.resource_snapshot", "task.auth.valid", "task.auth.failed"}:
            log_event(event)
            notify_host_worker_event(event)
            if event_type in {"task.auth.valid", "task.auth.failed"}:
                auth_payload = dict(event["payload"])
            continue

        if event_type == "task.result":
            stderr_text = process.stderr.read().strip() if process.stderr else ""
            process.wait(timeout=1)
            result = dict(event["payload"]["result"])
            result["heartbeat_count"] = heartbeat_count
            result["request_id"] = request_id
            result["mode"] = mode
            result["worker_stderr"] = stderr_text
            if auth_payload is not None:
                result["license"] = auth_payload
            return result

        if event_type == "task.error":
            stderr_text = process.stderr.read().strip() if process.stderr else ""
            process.wait(timeout=1)
            result = dict(event["payload"]["error"])
            result["heartbeat_count"] = heartbeat_count
            result["request_id"] = request_id
            result["mode"] = mode
            result["worker_stderr"] = stderr_text
            if auth_payload is not None:
                result["license"] = auth_payload
            return result

        if event.get("type") == "_stream_closed" and process.poll() is not None:
            stderr_text = process.stderr.read().strip() if process.stderr else ""
            return build_internal_failure_result(
                task=task,
                request_id=request_id,
                mode=mode,
                heartbeat_count=heartbeat_count,
                elapsed_ms=int((time.monotonic() - start) * 1000),
                message="worker closed its event stream unexpectedly",
                stderr_text=stderr_text,
                returncode=process.returncode,
                auth_payload=auth_payload,
            )


def main() -> int:
    args = build_parser().parse_args()
    config = load_config(Path(args.config))
    timeout_seconds = float(args.timeout or config["runtime"]["default_timeout_seconds"])
    host_runtime = load_host_runtime()

    if host_runtime is not None and hasattr(host_runtime, "notify_plugin_started"):
        host_runtime.notify_plugin_started(config["task"]["task_id"], args.mode)

    result = run_plugin(config, args.mode, timeout_seconds)
    emit_host_callback(result)
    print(json.dumps(result, ensure_ascii=True))
    return 0 if result["status"] == "success" else 1


if __name__ == "__main__":
    sys.exit(main())
