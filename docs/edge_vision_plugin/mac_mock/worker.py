#!/usr/bin/env python3
"""Mock worker process that consumes a request envelope and emits structured NDJSON events."""

from __future__ import annotations

import argparse
import json
import sys
import time

from protocol import build_envelope, loads_message, summarize_progress


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


def run_success(request: dict) -> int:
    request_id = request["request_id"]
    task = request["task"]
    runtime = request["runtime"]
    scenario = request["scenario"]
    heartbeat_interval = runtime["heartbeat_interval_ms"] / 1000.0
    work_duration = float(scenario["work_duration_seconds"])
    start = time.monotonic()
    heartbeat_count = 0

    while True:
        elapsed = time.monotonic() - start
        if elapsed >= work_duration:
            break

        heartbeat_count += 1
        emit_progress(request_id, task["task_id"], heartbeat_count, int(elapsed * 1000))
        time.sleep(heartbeat_interval)

    result = dict(scenario["result"])
    result.update(
        {
            "status": "success",
            "task_id": task["task_id"],
            "object_id": task["object_id"],
            "elapsed_ms": int((time.monotonic() - start) * 1000),
        }
    )
    emit(build_envelope("task.result", "worker", request_id, task["task_id"], {"result": result}))
    return 0


def run_fail(request: dict) -> int:
    request_id = request["request_id"]
    task = request["task"]
    runtime = request["runtime"]
    scenario = request["scenario"]
    heartbeat_interval = runtime["heartbeat_interval_ms"] / 1000.0
    fail_after = float(scenario["fail_after_seconds"])
    start = time.monotonic()
    heartbeat_count = 0

    while True:
        elapsed = time.monotonic() - start
        if elapsed >= fail_after:
            break

        heartbeat_count += 1
        emit_progress(request_id, task["task_id"], heartbeat_count, int(elapsed * 1000))
        time.sleep(heartbeat_interval)

    error = {
        "status": "failed",
        "task_id": task["task_id"],
        "object_id": task["object_id"],
        "confidence": 0.0,
        "elapsed_ms": int((time.monotonic() - start) * 1000),
        "message": scenario["message"],
        "error_code": scenario["error_code"],
    }
    emit(build_envelope("task.error", "worker", request_id, task["task_id"], {"error": error}))
    return 1


def run_timeout(request: dict) -> int:
    request_id = request["request_id"]
    task = request["task"]
    runtime = request["runtime"]
    scenario = request["scenario"]
    heartbeat_interval = runtime["heartbeat_interval_ms"] / 1000.0
    work_duration = float(scenario["work_duration_seconds"])
    start = time.monotonic()
    heartbeat_count = 0

    while True:
        elapsed = time.monotonic() - start
        if elapsed >= work_duration:
            break

        heartbeat_count += 1
        emit_progress(request_id, task["task_id"], heartbeat_count, int(elapsed * 1000))
        time.sleep(heartbeat_interval)

    return 0


def main() -> int:
    build_parser().parse_args()
    request = load_request()
    scenario_name = request["scenario"]["name"]

    emit_ready(request["request_id"])
    emit_task_accepted(request["request_id"], request["task"]["task_id"], scenario_name)
    emit_resource_snapshot(request)

    if scenario_name == "success":
        return run_success(request)
    if scenario_name == "fail":
        return run_fail(request)
    return run_timeout(request)


if __name__ == "__main__":
    sys.exit(main())
