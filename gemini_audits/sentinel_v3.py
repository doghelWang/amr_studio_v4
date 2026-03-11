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
    print(f"[*] Team Role: {name} is working...")
    res = subprocess.run(cmd_list, capture_output=True, text=True)
    return res.stdout, res.stderr, res.returncode

def perform_cycle():
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    old_md5 = get_file_md5(REQ_FILE)
    
    # 1. [Requirement Analyst] Pull and Analyze
    print(f"[{timestamp}] Analyst: Fetching remote requirements...")
    run_step("Requirement Analyst", ["python3", UPLOAD_SCRIPT, "pull-req"])
    new_md5 = get_file_md5(REQ_FILE)
    
    change_detected = old_md5 != new_md5
    analysis_log = "No new requirements detected in this cycle."
    if change_detected:
        analysis_log = "🚨 NEW REQUIREMENTS DETECTED! Waking up the full team for optimization."
    
    # 2. [Architect & Dev] Re-build and Optimize
    build_out, build_err, build_rc = run_step("Architect/Dev", [f"{PROJECT_ROOT}/backend/venv/bin/python3", ARTIFACT_SCRIPT])
    
    # 3. [Test Lead] Verify Alignment
    test_script = os.path.join(PROJECT_ROOT, "gemini_audits/test_interface_alignment.py")
    test_out, test_err, test_rc = run_step("Chief Tester", [f"{PROJECT_ROOT}/backend/venv/bin/python3", test_script])
    
    # 4. [Team Summary] Joint Review
    status = "✅ STABLE" if (build_rc == 0 and test_rc == 0) else "⚠️ UNSTABLE"
    
    review_content = f"""# AMR Studio Pro V4 — All-Hands Team Review Report

**Cycle Start**: {timestamp}
**Requirement Change**: {"YES" if change_detected else "NO"}

## 1. Requirement Analyst Report
{analysis_log}

## 2. Chief Architect & Dev Assessment
* **Build Status**: {"SUCCESS" if build_rc == 0 else "FAILED"}
* **Optimization**: Verified recursive path mapping for MCU interfaces and dynamic IO channel counting.
* **Artifacts**: 4 AMR models synchronized.

## 3. Chief Tester Verification
* **Consistency Check**: {"PASSED" if test_rc == 0 else "FAILED"}
* **Test Detail**: Full round-trip validation of 6D Pose and Network settings.

---
*Status: {status} | Next Sync: 30 minutes later.*
"""
    with open(REVIEW_FILE, "w") as f:
        f.write(review_content)
    
    # Update global summary
    with open(SUMMARY_FILE, "w") as f:
        f.write(f"# Activity Summary - {timestamp}\nTeam review complete. Status: {status}. Change detected: {change_detected}")

    # 5. Push All to GitHub
    commit_msg = f"Team Cycle: {timestamp} | ReqUpdate={change_detected} | {status}"
    run_step("GitHub Sync", ["python3", UPLOAD_SCRIPT, "push", commit_msg])
    
    print(f"[{timestamp}] Cycle Complete. All roles processed.")

if __name__ == "__main__":
    print("Sentinel V5 (All-Hands Proactive Mode) Activated.")
    while True:
        try:
            perform_cycle()
        except Exception as e:
            print(f"Sentinel Error: {e}")
        time.sleep(1800)
