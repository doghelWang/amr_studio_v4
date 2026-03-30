import requests
import json
import time
import os
import subprocess
from pathlib import Path

# --- 配置 (对齐 11 维架构) ---
BACKEND_URL = "http://127.0.0.1:8002"
FRONTEND_URL = "http://localhost:3001"
TEST_PROJECT_ID = "proj_selftest_reborn"

def check_connectivity():
    print("Step 1: Checking Physical Connectivity...")
    # Try multiple addresses for robustness
    addrs = ["http://127.0.0.1", "http://localhost"]
    b_ok = False
    f_ok = False
    
    for base in addrs:
        try:
            if not b_ok:
                res = requests.get(f"{base}:8002/api/v1/projects/saved-list", timeout=2)
                if res.status_code == 200:
                    print(f"  [OK] Backend responding via {base}")
                    b_ok = True
        except: pass
        
        try:
            if not f_ok:
                res = requests.get(f"{base}:3001/", timeout=2)
                if res.status_code == 200:
                    print(f"  [OK] Frontend responding via {base}")
                    f_ok = True
        except: pass

    return b_ok and f_ok

def check_business_logic():
    print("\nStep 2: Validating Business Logic (Registry & Persistence)...")
    try:
        # 验证板卡库是否加载成功 (解决之前的 [] 问题)
        res_boards = requests.get(f"{BACKEND_URL}/api/v1/resources/boards")
        boards = res_boards.json()
        if len(boards) > 0:
            print(f"  [OK] Board Registry active. Found {len(boards)} boards.")
        else:
            print("  [WARN] Board Registry is EMPTY.")
            
        # 验证持久化存储
        res_list = requests.get(f"{BACKEND_URL}/api/v1/projects/saved-list")
        print(f"  [OK] Persistence Layer accessible. {len(res_list.json())} projects found.")
        return True
    except Exception as e:
        print(f"  [FAIL] Business logic error: {e}")
        return False

def check_build_pipeline():
    print("\nStep 3: Triggering Build Pipeline E2E...")
    try:
        start_time = time.time()
        res_compile = requests.post(f"{BACKEND_URL}/api/v1/models/{TEST_PROJECT_ID}/compile", timeout=30)
        if res_compile.status_code == 200:
            duration = time.time() - start_time
            print(f"  [OK] Compilation successful in {duration:.2f}s.")
            return True
        else:
            print(f"  [FAIL] Compilation failed with status {res_compile.status_code}: {res_compile.text}")
            return False
    except Exception as e:
        print(f"  [FAIL] Network Error during build: {e}")
        return False

def run_deep_audit():
    print("\nStep 4: Executing Deep Auditor Skill (Bit-Level)...")
    try:
        # 调用我们之前实现的 bit_perfect_checker
        script_path = "tests/system/bit_perfect_checker.py"
        result = subprocess.run(["python3", script_path], capture_output=True, text=True)
        print(result.stdout)
        if "Match" in result.stdout:
            print("  [OK] Bit-Perfect Audit PASSED.")
            return True
        else:
            print("  [FAIL] Bit-Perfect Audit detected deviations.")
            return False
    except Exception as e:
        print(f"  [FAIL] Audit skill execution failed: {e}")
        return False

def main():
    print("=== AMR Studio V4 Automated Acceptance Test ===\n")
    c1 = check_connectivity()
    if not c1: return
    
    c2 = check_business_logic()
    c3 = check_build_pipeline()
    c4 = run_deep_audit()
    
    print("\n" + "="*40)
    if all([c1, c2, c3, c4]):
        print("🎉 ALL SYSTEMS GO - Environment is STABLE.")
    else:
        print("🚨 CRITICAL WARNING - Deviations detected.")
    print("="*40)

if __name__ == "__main__":
    main()
