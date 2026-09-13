#!/usr/bin/env python3
"""Shared IPC protocol helpers for the mac mock plugin framework."""

from __future__ import annotations

import json
import time
import uuid
from typing import Any


PROTOCOL_VERSION = "1.1"

EVENT_TYPES = {
    "worker.ready",
    "task.accepted",
    "task.resource_snapshot",
    "task.auth.valid",
    "task.auth.failed",
    "task.progress",
    "task.result",
    "task.error",
}


def now_ms() -> int:
    return int(time.time() * 1000)


def build_envelope(
    event_type: str,
    source: str,
    request_id: str,
    task_id: str | None,
    payload: dict[str, Any],
) -> dict[str, Any]:
    if event_type not in EVENT_TYPES:
        raise ValueError(f"unsupported event_type: {event_type}")
    return {
        "protocol_version": PROTOCOL_VERSION,
        "event_id": str(uuid.uuid4()),
        "event_type": event_type,
        "source": source,
        "request_id": request_id,
        "task_id": task_id,
        "timestamp_ms": now_ms(),
        "payload": payload,
    }


def dumps_message(message: dict[str, Any]) -> str:
    return json.dumps(message, ensure_ascii=True)


def loads_message(raw: str) -> dict[str, Any]:
    return json.loads(raw)


def build_request(config: dict[str, Any], mode: str, timeout_seconds: float) -> dict[str, Any]:
    runtime = config["runtime"]
    task = config["task"]
    scenario = config["scenarios"][mode]
    request_id = str(uuid.uuid4())

    return {
        "protocol_version": PROTOCOL_VERSION,
        "request_id": request_id,
        "task": task,
        "runtime": {
            "timeout_ms": int(timeout_seconds * 1000),
            "soft_timeout_ms": int(runtime["soft_timeout_seconds"] * 1000),
            "heartbeat_interval_ms": int(runtime["heartbeat_interval_seconds"] * 1000),
            "poll_interval_ms": int(runtime["poll_interval_seconds"] * 1000),
        },
        "resource_contract": config["resource_contract"],
        "compiled_core": config["compiled_core"],
        "license": {},
        "scenario": {
            "name": mode,
            **scenario,
        },
    }


def summarize_progress(frame_index: int, elapsed_ms: int) -> dict[str, Any]:
    return {
        "status": "processing",
        "frame_index": frame_index,
        "elapsed_ms": elapsed_ms,
    }
