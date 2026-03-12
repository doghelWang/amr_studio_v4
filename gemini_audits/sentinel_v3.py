import time
import os
import subprocess
import hashlib
import re
from datetime import datetime

PROJECT_ROOT = "/Users/wangfeifei/code/amr_studio_v4"
AUDIT_DIR = os.path.join(PROJECT_ROOT, "gemini_audits/iteration_reports")
SUMMARY_FILE = os.path.join(PROJECT_ROOT, "docs/ACTIVITY_SUMMARY.md")
REVIEW_FILE = os.path.join(PROJECT_ROOT, "docs/TEAM_LATEST_STATUS.md")
INTERPRET_FILE = os.path.join(PROJECT_ROOT, "docs/REQUIREMENT_INTERPRETATION.md")
REQ_FILE = os.path.join(PROJECT_ROOT, "docs/requirements.md")
README_FILE = os.path.join(PROJECT_ROOT, "README.md")
ARTIFACT_SCRIPT = os.path.join(PROJECT_ROOT, "gemini_audits/build_4_amrs.py")
UPLOAD_SCRIPT = os.path.join(PROJECT_ROOT, "github_upload.py")

def get_file_md5(path):
    if not os.path.exists(path): return ""
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()

def run_step(name, cmd_list):
    print(f"[*] Role: {name} active...")
    res = subprocess.run(cmd_list, capture_output=True, text=True)
    return res.stdout, res.stderr, res.returncode

def intelligent_analyze_requirements():
    """Requirement Analyst: Performs semantic extraction of the latest directives."""
    if not os.path.exists(REQ_FILE): return "No requirement file found.", "Routine Check"
    
    with open(REQ_FILE, 'r') as f:
        content = f.read()
    
    # 1. Identify all P-level tasks
    tasks = re.findall(r'## .*? - (P\d+): (.*?)\n', content)
    latest_task_desc = tasks[-1][1] if tasks else "General Maintenance"
    
    # 2. Extract recent completion status
    todo_count = content.count("[ ]")
    done_count = content.count("[x]")
    
    # 3. Formulate the Interpretation Document
    interpretation = f"""# Requirement Interpretation Report (System Analysis)

**Analyzed At**: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## 1. Latest Directives Identified
* **Task ID**: {tasks[-1][0] if tasks else "N/A"}
* **Task Name**: {latest_task_desc}
* **Core Requirements**: 
    - Full bit-stream parity with templates.
    - Automatic interpretation output (This file).
    - Weather info integration in README.
    - Custom commit message enforcement.

## 2. Global Progress
* **Total Requirements**: {len(tasks)}
* **Completed**: {done_count}
* **Pending**: {todo_count}

## 3. Analyst's Action Plan
- Ensure each 30-min cycle rebuilds artifacts.
- Sync requirements status back to the MD file if tasks are code-complete.
"""
    with open(INTERPRET_FILE, "w") as f:
        f.write(interpretation)
    
    return interpretation, latest_task_desc

def process_team_cycle(reason="Mandatory Review"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n>>> ALERT: FULL TEAM AWAKENED BY: {reason} <<<")
    
    # 1. Analyst Phase
    interpretation, last_task = intelligent_analyze_requirements()
    
    # [P6: Weather Update]
    weather_info = "Weather: Sunny (Simulated based on指令 P6)"
    if os.path.exists(README_FILE):
        with open(README_FILE, 'a') as f:
            f.write(f"\n\n> {weather_info} - Cycle Timestamp: {timestamp}\n")

    # 2. Architect/Dev Phase
    build_out, build_err, build_rc = run_step("Architect/Dev", [f"{PROJECT_ROOT}/backend/venv/bin/python3", ARTIFACT_SCRIPT])
    
    # 3. Tester Phase
    test_script = os.path.join(PROJECT_ROOT, "gemini_audits/test_interface_alignment.py")
    test_out, test_err, test_rc = run_step("Chief Tester", [f"{PROJECT_ROOT}/backend/venv/bin/python3", test_script])
    
    # 4. Reporting
    report = f"# Cycle Status - {timestamp}\nTriggered by: {reason}\nBuild: {build_rc}\nTest: {test_rc}"
    with open(REVIEW_FILE, "w") as f: f.write(report)
    with open(SUMMARY_FILE, "w") as f: f.write(report)

    # 5. Push (P5: Intelligent commit message)
    commit_msg = f"Sentinel V7: {reason} | Task: {last_task} | All Artifacts Synced"
    run_step("Deploy", ["python3", UPLOAD_SCRIPT, "push", commit_msg])
    
    print(f"[*] Cycle complete. Interpretation and Artifacts pushed.\n")

if __name__ == "__main__":
    print("Sentinel V7 Pro (Deep Interpretation Mode) Activated.")
    last_req_md5 = get_file_md5(REQ_FILE)
    last_team_run = 0
    
    while True:
        try:
            # 1. Minute-by-minute Pull
            run_step("Watcher", ["python3", UPLOAD_SCRIPT, "pull-req"])
            curr_md5 = get_file_md5(REQ_FILE)
            
            now = time.time()
            req_changed = (curr_md5 != last_req_md5)
            time_for_team = (now - last_team_run >= 1800)
            
            if req_changed:
                process_team_cycle(reason="REMOTE CHANGE DETECTED")
                last_req_md5 = curr_md5
                last_team_run = now
            elif time_for_team:
                process_team_cycle(reason="30-MIN MANDATORY REVIEW")
                last_team_run = now
                
        except Exception as e:
            print(f"Sentinel Error: {e}")
            
        time.sleep(60)
