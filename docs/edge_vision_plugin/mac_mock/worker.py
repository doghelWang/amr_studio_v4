#!/usr/bin/env python3
"""Mock worker process that consumes a request envelope and emits structured NDJSON events."""

from __future__ import annotations

import argparse
import ctypes
import json
import sys
import time
from pathlib import Path

from protocol import build_envelope, loads_message, summarize_progress


class AlgoCore:
    """Thin ctypes wrapper over the compiled algorithm core."""

    def __init__(self, library_path: str) -> None:
        self.library_path = str(Path(library_path).resolve())
        self.lib = ctypes.CDLL(self.library_path)
        self.lib.algo_authorize.argtypes = [
            ctypes.c_char_p,
            ctypes.c_char_p,
            ctypes.c_char_p,
            ctypes.c_char_p,
            ctypes.c_char_p,
            ctypes.c_size_t,
        ]
        self.lib.algo_authorize.restype = ctypes.c_int
        self.lib.algo_get_required_steps.argtypes = [ctypes.c_char_p]
        self.lib.algo_get_required_steps.restype = ctypes.c_int
        self.lib.algo_process_step.argtypes = [
            ctypes.c_char_p,
            ctypes.c_int,
            ctypes.c_char_p,
            ctypes.c_size_t,
        ]
        self.lib.algo_process_step.restype = ctypes.c_int
        self.lib.algo_finalize.argtypes = [
            ctypes.c_char_p,
            ctypes.c_char_p,
            ctypes.c_char_p,
            ctypes.c_char_p,
            ctypes.c_size_t,
        ]
        self.lib.algo_finalize.restype = ctypes.c_int

    def _call_json(self, func: Any, *parts: str | int) -> tuple[int, dict]:
        buffer = ctypes.create_string_buffer(2048)
        encoded_args = []
        for part in parts:
            if isinstance(part, int):
                encoded_args.append(part)
            else:
                encoded_args.append(str(part).encode("utf-8"))
        status = func(*encoded_args, buffer, ctypes.sizeof(buffer))
        payload = json.loads(buffer.value.decode("utf-8"))
        return status, payload

    def authorize(
        self,
        license_path: str,
        expected_product: str,
        expected_fingerprint: str,
        required_feature: str,
    ) -> tuple[int, dict]:
        return self._call_json(
            self.lib.algo_authorize,
            license_path,
            expected_product,
            expected_fingerprint,
            required_feature,
        )

    def get_required_steps(self, scenario_name: str) -> int:
        return int(self.lib.algo_get_required_steps(str(scenario_name).encode("utf-8")))

    def process_step(self, scenario_name: str, step_index: int) -> tuple[int, dict]:
        return self._call_json(self.lib.algo_process_step, scenario_name, step_index)

    def finalize(self, scenario_name: str, task_id: str, object_id: str) -> tuple[int, dict]:
        return self._call_json(self.lib.algo_finalize, scenario_name, task_id, object_id)


def emit(event: dict) -> None:
    print(json.dumps(event, ensure_ascii=True), flush=True)


def build_parser() -> argparse.ArgumentParser:
    return argparse.ArgumentParser(description="mac mock worker")


def load_request() -> dict:
    raw = sys.stdin.readline()
    if not raw.strip():
        raise RuntimeError("worker did not receive request envelope on stdin")
    return loads_message(raw)


def emit_ready(request_id: str) -> None:
    emit(build_envelope("worker.ready", "worker", request_id, None, {"message": "worker booted"}))


def emit_task_accepted(request_id: str, task_id: str, scenario_name: str) -> None:
    emit(
        build_envelope(
            "task.accepted",
            "worker",
            request_id,
            task_id,
            {"status": "accepted", "scenario": scenario_name},
        )
    )


def emit_resource_snapshot(request: dict) -> None:
    emit(
        build_envelope(
            "task.resource_snapshot",
            "worker",
            request["request_id"],
            request["task"]["task_id"],
            request["resource_contract"],
        )
    )


def emit_progress(request_id: str, task_id: str, frame_index: int, elapsed_ms: int) -> None:
    emit(
        build_envelope(
            "task.progress",
            "worker",
            request_id,
            task_id,
            summarize_progress(frame_index, elapsed_ms),
        )
    )


def emit_auth_result(request_id: str, task_id: str, auth_payload: dict) -> None:
    event_type = "task.auth.valid" if auth_payload.get("status") == "valid" else "task.auth.failed"
    emit(build_envelope(event_type, "worker", request_id, task_id, auth_payload))


def authorize_with_algo_core(request: dict) -> tuple[bool, dict, AlgoCore]:
    license_info = request["license"]
    algo_core = AlgoCore(license_info["algorithm_library_path"])
    status, payload = algo_core.authorize(
        license_info["license_path"],
        license_info["product"],
        license_info["device_fingerprint"],
        license_info["required_feature"],
    )
    payload["license_path"] = license_info["license_path"]
    payload["fingerprint"] = license_info["device_fingerprint"]
    return status == 0, payload, algo_core


def run_with_algo_core(request: dict, algo_core: AlgoCore) -> int:
    request_id = request["request_id"]
    task = request["task"]
    runtime = request["runtime"]
    scenario_name = request["scenario"]["name"]
    heartbeat_interval = runtime["heartbeat_interval_ms"] / 1000.0
    start = time.monotonic()
    required_steps = algo_core.get_required_steps(scenario_name)

    if required_steps <= 0:
        error = {
            "status": "failed",
            "task_id": task["task_id"],
            "object_id": task["object_id"],
            "confidence": 0.0,
            "elapsed_ms": 0,
            "message": "compiled core rejected scenario",
            "error_code": "E5002",
        }
        emit(build_envelope("task.error", "worker", request_id, task["task_id"], {"error": error}))
        return 1

    for step_index in range(required_steps):
        _, payload = algo_core.process_step(scenario_name, step_index)
        emit_progress(request_id, task["task_id"], step_index + 1, int((time.monotonic() - start) * 1000))
        if scenario_name == "timeout":
            time.sleep(heartbeat_interval)
        if payload.get("status") == "failed":
            error = {
                "status": "failed",
                "task_id": task["task_id"],
                "object_id": task["object_id"],
                "confidence": 0.0,
                "elapsed_ms": int((time.monotonic() - start) * 1000),
                "message": payload["message"],
                "error_code": payload["error_code"],
                "license": payload.get("license"),
            }
            emit(build_envelope("task.error", "worker", request_id, task["task_id"], {"error": error}))
            return 1
        if scenario_name != "timeout":
            time.sleep(heartbeat_interval)

    _, payload = algo_core.finalize(scenario_name, task["task_id"], task["object_id"])
    payload["elapsed_ms"] = int((time.monotonic() - start) * 1000)
    if payload.get("status") == "success":
        emit(build_envelope("task.result", "worker", request_id, task["task_id"], {"result": payload}))
        return 0

    error = {
        "status": "failed",
        "task_id": task["task_id"],
        "object_id": task["object_id"],
        "confidence": 0.0,
        "elapsed_ms": payload["elapsed_ms"],
        "message": payload["message"],
        "error_code": payload["error_code"],
    }
    emit(build_envelope("task.error", "worker", request_id, task["task_id"], {"error": error}))
    return 1


def main() -> int:
    build_parser().parse_args()
    request = load_request()
    scenario_name = request["scenario"]["name"]

    emit_ready(request["request_id"])
    emit_task_accepted(request["request_id"], request["task"]["task_id"], scenario_name)
    emit_resource_snapshot(request)

    authorized, auth_payload, algo_core = authorize_with_algo_core(request)
    emit_auth_result(request["request_id"], request["task"]["task_id"], auth_payload)
    if not authorized:
        error = {
            "status": "failed",
            "task_id": request["task"]["task_id"],
            "object_id": request["task"]["object_id"],
            "confidence": 0.0,
            "elapsed_ms": 0,
            "message": auth_payload["message"],
            "error_code": auth_payload["code"],
            "license": auth_payload,
        }
        emit(build_envelope("task.error", "worker", request["request_id"], request["task"]["task_id"], {"error": error}))
        return 1

    return run_with_algo_core(request, algo_core)


if __name__ == "__main__":
    sys.exit(main())
