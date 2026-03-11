import time
import os
import subprocess
from datetime import datetime

PROJECT_ROOT = "/Users/wangfeifei/code/amr_studio_v4"
AUDIT_DIR = os.path.join(PROJECT_ROOT, "gemini_audits/iteration_reports")
TEST_SCRIPT = os.path.join(PROJECT_ROOT, "gemini_audits/test_interface_alignment.py")
GEN_SCRIPT = os.path.join(PROJECT_ROOT, "gemini_audits/direct_engine_test.py")

def run_tests():
    # Run Generation Test
    gen_res = subprocess.run(
        [f"{PROJECT_ROOT}/backend/venv/bin/python3", GEN_SCRIPT], 
        capture_output=True, text=True
    )
    
    # Run Parser Test
    parse_res = subprocess.run(
        [f"{PROJECT_ROOT}/backend/venv/bin/python3", TEST_SCRIPT], 
        capture_output=True, text=True
    )
    
    return gen_res, parse_res

def perform_check():
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report_path = os.path.join(AUDIT_DIR, f"sentinel_v3_{int(time.time())}.md")
    
    print(f"[{timestamp}] Checking for remote requirements updates...")
    subprocess.run(["python3", os.path.join(PROJECT_ROOT, "github_upload.py"), "pull-req"], capture_output=True)
    
    gen_res, parse_res = run_tests()
    
    # Check for success indicators
    gen_success = "Test Complete." in gen_res.stdout and gen_res.returncode == 0
    parse_success = "Total: 18" in parse_res.stdout and "ETH_1" in parse_res.stdout and parse_res.returncode == 0
    
    all_passed = gen_success and parse_success
    
    report_content = f"""# Sentinel V3 Autonomous Gate Check

**Time**: {timestamp}
**Status**: {"✅ PASS" if all_passed else "❌ FAIL"}

## Generation Test
```
{gen_res.stdout[-500:] if gen_res.stdout else gen_res.stderr}
```

## Parsing Test
```
{parse_res.stdout[-500:] if parse_res.stdout else parse_res.stderr}
```
"""
    with open(report_path, "w") as f:
        f.write(report_content)
        
    # If all passed, upload to github
    if all_passed:
        print(f"[{timestamp}] Tests passed. Uploading to GitHub...")
        subprocess.run(["python3", os.path.join(PROJECT_ROOT, "github_upload.py")], capture_output=True)
    else:
        print(f"[{timestamp}] Tests failed. Waiting for fixes.")

if __name__ == "__main__":
    print("Sentinel V3 Activated. Running every 30 minutes.")
    while True:
        try:
            perform_check()
        except Exception as e:
            print(f"Sentinel Error: {e}")
        time.sleep(1800) # 30 minutes
