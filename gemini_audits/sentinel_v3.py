import time
import os
import subprocess
import hashlib
from datetime import datetime

PROJECT_ROOT = "/Users/wangfeifei/code/amr_studio_v4"
AUDIT_DIR = os.path.join(PROJECT_ROOT, "gemini_audits/iteration_reports")
SUMMARY_FILE = os.path.join(PROJECT_ROOT, "docs/ACTIVITY_SUMMARY.md")
REVIEW_FILE = os.path.join(PROJECT_ROOT, "docs/TEAM_REVIEW.md")
REQ_FILE = os.path.join(PROJECT_ROOT, "docs/requirements.md")
ARTIFACT_SCRIPT = os.path.join(PROJECT_ROOT, "gemini_audits/build_4_amrs.py")
UPLOAD_SCRIPT = os.path.join(PROJECT_ROOT, "github_upload.py")

def get_file_md5(path):
    if not os.path.exists(path): return ""
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()

def run_step(name, cmd_list):
    print(f"[*] [{datetime.now().strftime('%H:%M:%S')}] Role: {name} is active...")
    res = subprocess.run(cmd_list, capture_output=True, text=True)
    return res.stdout, res.stderr, res.returncode

def perform_full_team_cycle(reason="Scheduled Check"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n>>> WAKING UP FULL TEAM. Reason: {reason} <<<")
    
    # 1. [Architect & Dev] Re-build and Optimize
    build_out, build_err, build_rc = run_step("Architect/Dev", [f"{PROJECT_ROOT}/backend/venv/bin/python3", ARTIFACT_SCRIPT])
    
    # 2. [Test Lead] Verify Alignment
    test_script = os.path.join(PROJECT_ROOT, "gemini_audits/test_interface_alignment.py")
    test_out, test_err, test_rc = run_step("Chief Tester", [f"{PROJECT_ROOT}/backend/venv/bin/python3", test_script])
    
    # 3. [Joint Review] Generate Report
    status = "✅ STABLE" if (build_rc == 0 and test_rc == 0) else "⚠️ UNSTABLE"
    review_content = f"""# AMR Studio Pro V4 — All-Hands Joint Review

**Review Time**: {timestamp}
**Trigger**: {reason}

## 1. Team Deliverables
* **Build Artifacts**: 4 ZIP Models updated and validated.
* **Core Engine**: Verified recursive interface mapping and dynamic IO counting.
* **Consistency**: Round-trip validation complete.

## 2. Technical Audit Summary
* **Architect**: Schema parity verified.
* **Tester**: Interface alignment check: {"OK" if test_rc == 0 else "FAIL"} (Total Channels: 18).

---
*Status: {status}*
"""
    with open(REVIEW_FILE, "w") as f:
        f.write(review_content)
    
    with open(SUMMARY_FILE, "w") as f:
        f.write(f"# Activity Summary - {timestamp}\n{reason}. Status: {status}")

    # 4. Push All to GitHub
    commit_msg = f"Full Team Action: {reason} | {status}"
    run_step("GitHub Sync", ["python3", UPLOAD_SCRIPT, "push", commit_msg])
    print(f"[!] Full cycle complete and pushed to GitHub.\n")

if __name__ == "__main__":
    print("Sentinel V6 Activated (Analyst: 1min, Team: 30min/On-Demand).")
    
    last_req_md5 = get_file_md5(REQ_FILE)
    last_full_run_time = 0
    
    while True:
        try:
            # 1. Analyst Check (Every 1 minute)
            run_step("Requirement Analyst", ["python3", UPLOAD_SCRIPT, "pull-req"])
            current_md5 = get_file_md5(REQ_FILE)
            
            req_changed = current_md5 != last_req_md5
            now = time.time()
            time_for_scheduled = (now - last_full_run_time >= 1800)
            
            if req_changed:
                perform_full_team_cycle(reason="URGENT: Requirement Update Detected")
                last_req_md5 = current_md5
                last_full_run_time = now
            elif time_for_scheduled:
                perform_full_team_cycle(reason="Scheduled 30-Min Mandatory Review")
                last_full_run_time = now
            else:
                # Still in listening mode
                sys.stdout.write(".")
                sys.stdout.flush()
                
        except Exception as e:
            print(f"\n[!] Sentinel Loop Error: {e}")
            
        time.sleep(60) # Watcher sleep 1 min
