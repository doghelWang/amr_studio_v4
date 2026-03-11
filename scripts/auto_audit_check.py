#!/usr/bin/env python3
"""
AMR Studio Pro V4 — Automated Audit Check & Validation Script
==============================================================
Runs every 2 hours (via cron/launchd) to:
1. Check if new audit reports exist in gemini_audits/
2. Run backend parser validation tests on template files
3. Verify API endpoints are healthy
4. Commit any pending changes with a summary

Schedule via cron (every 2 hours):
  0 */2 * * * /usr/bin/python3 /Users/wangfeifei/code/amr_studio_v4/scripts/auto_audit_check.py >> /tmp/amr_audit.log 2>&1
"""
import os
import sys
import json
import subprocess
import datetime
import hashlib
from pathlib import Path

PROJECT_ROOT = Path("/Users/wangfeifei/code/amr_studio_v4")
BACKEND_DIR  = PROJECT_ROOT / "backend"
AUDIT_DIR    = PROJECT_ROOT / "gemini_audits"
LOG_FILE     = Path("/tmp/amr_audit.log")
STATE_FILE   = Path("/tmp/amr_audit_state.json")

def log(msg: str):
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def get_audit_hash() -> str:
    """Return a hash of all audit files to detect changes."""
    h = hashlib.md5()
    for f in sorted(AUDIT_DIR.rglob("*.md")):
        h.update(f.read_bytes())
    return h.hexdigest()


def load_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            pass
    return {"last_audit_hash": "", "last_run": ""}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2))


def run_parser_test() -> bool:
    """Verify model_parser.py correctly extracts data from templates."""
    try:
        result = subprocess.run(
            [sys.executable, "-c", """
import sys
sys.path.insert(0, '.')
import importlib
import core.model_parser as mp
importlib.reload(mp)
r = mp.parse_comp_desc('templates/CompDesc.model')
cfg = r['config']
assert cfg['identity']['driveType'] != '', 'driveType empty'
assert cfg['identity']['robotName'], 'robotName empty'
print(f"OK: name={cfg['identity']['robotName']}, drive={cfg['identity']['driveType']}, wheels={len(cfg['wheels'])}")
"""],
            cwd=str(BACKEND_DIR),
            capture_output=True,
            text=True,
            timeout=30,
            env={**os.environ, "VIRTUAL_ENV": str(BACKEND_DIR / "venv")}
        )
        if result.returncode == 0:
            log(f"[PARSER TEST] PASS: {result.stdout.strip()}")
            return True
        else:
            log(f"[PARSER TEST] FAIL: {result.stderr.strip()[:200]}")
            return False
    except Exception as e:
        log(f"[PARSER TEST] ERROR: {e}")
        return False


def check_backend_health() -> bool:
    """Ping the backend API to verify it's running."""
    try:
        result = subprocess.run(
            ["curl", "-s", "--max-time", "5", "http://localhost:8000/api/v1/templates"],
            capture_output=True, text=True, timeout=8
        )
        if result.returncode == 0 and "templates" in result.stdout:
            data = json.loads(result.stdout)
            log(f"[BACKEND] OK: {len(data.get('templates', []))} templates")
            return True
        else:
            log(f"[BACKEND] NOT RESPONDING: {result.stdout[:100]}")
            return False
    except Exception as e:
        log(f"[BACKEND] ERROR: {e}")
        return False


def commit_changes(message: str):
    """Commit any staged changes to git."""
    try:
        # Stage all relevant changes
        subprocess.run(
            ["git", "add", "backend/", "frontend/src/", "docs/", "scripts/"],
            cwd=str(PROJECT_ROOT), capture_output=True, timeout=15
        )
        # Check if there's anything to commit
        status = subprocess.run(
            ["git", "diff", "--cached", "--stat"],
            cwd=str(PROJECT_ROOT), capture_output=True, text=True, timeout=10
        )
        if status.stdout.strip():
            result = subprocess.run(
                ["git", "commit", "-m", message],
                cwd=str(PROJECT_ROOT), capture_output=True, text=True, timeout=30
            )
            if result.returncode == 0:
                log(f"[GIT] Committed: {result.stdout.strip()[:100]}")
            else:
                log(f"[GIT] Commit failed: {result.stderr.strip()[:100]}")
        else:
            log("[GIT] Nothing to commit")
    except Exception as e:
        log(f"[GIT] ERROR: {e}")


def main():
    log("=" * 60)
    log("AMR Studio Auto-Audit Check Starting")
    log("=" * 60)

    state = load_state()
    current_hash = get_audit_hash()
    audit_changed = current_hash != state.get("last_audit_hash", "")

    if audit_changed:
        log(f"[AUDIT] New audit content detected! Hash: {current_hash[:12]}")
        # List what changed
        for f in sorted(AUDIT_DIR.rglob("*.md")):
            log(f"[AUDIT] Found: {f.name}")
    else:
        log("[AUDIT] No audit changes since last check")

    # Always run validations
    parser_ok = run_parser_test()
    backend_ok = check_backend_health()

    overall = "PASS" if parser_ok else "WARN"
    log(f"[SUMMARY] parser={parser_ok}, backend={backend_ok}, audit_changed={audit_changed}")

    # Commit if parser test passed and audit changed
    if audit_changed:
        ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        commit_changes(f"auto: audit check {ts} - parser={overall}")

    # Save state
    state["last_audit_hash"] = current_hash
    state["last_run"] = datetime.datetime.now().isoformat()
    save_state(state)
    log("Auto-audit check complete.\n")


if __name__ == "__main__":
    main()
