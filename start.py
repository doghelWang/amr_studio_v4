#!/usr/bin/env python3
import os
import sys
import subprocess
import argparse
import platform
import shutil
import time
import signal
from pathlib import Path
from datetime import datetime

def get_python_executable(base_dir: Path) -> str:
    """Find the python executable in the venv for current OS."""
    system = platform.system()
    if system == "Windows":
        candidates = [
            base_dir / "venv" / "Scripts" / "python.exe",
            base_dir / ".venv" / "Scripts" / "python.exe",
            "python"
        ]
    else:
        candidates = [
            base_dir / "venv" / "bin" / "python3",
            base_dir / ".venv" / "bin" / "python3",
            "python3"
        ]
    
    for c in candidates:
        if isinstance(c, Path) and c.exists():
            return str(c)
        if isinstance(c, str):
            if shutil.which(c):
                return c
    return sys.executable

def kill_process_on_port(port: int):
    """Attempt to clear the port before starting."""
    system = platform.system()
    try:
        if system == "Windows":
            cmd = f"netstat -ano | findstr :{port}"
            output = subprocess.check_output(cmd, shell=True).decode()
            for line in output.strip().split("\n"):
                if "LISTENING" in line:
                    pid = line.strip().split()[-1]
                    subprocess.run(["taskkill", "/F", "/PID", pid], check=False, stdout=subprocess.DEVNULL)
        else:
            cmd = f"lsof -t -i:{port}"
            pids = subprocess.check_output(cmd, shell=True).decode().strip().split("\n")
            for pid in pids:
                if pid:
                    subprocess.run(["kill", "-9", pid], check=False)
    except Exception:
        pass

def main():
    parser = argparse.ArgumentParser(description="AMR Studio V4 Persistent Deployment Tool")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Binding host (default: 0.0.0.0)")
    parser.add_argument("--backend-port", type=int, default=8002, help="Backend port (default: 8002)")
    parser.add_argument("--frontend-port", type=int, default=3001, help="Frontend port (default: 3001)")
    parser.add_argument(
        "--backend-runtime",
        choices=["python", "ts"],
        default=os.environ.get("AMR_BACKEND_RUNTIME", "python"),
        help="Backend runtime to launch: python or ts (default: python; env AMR_BACKEND_RUNTIME supported)"
    )
    args = parser.parse_args()

    root_dir = Path(__file__).parent.absolute()
    frontend_dir = root_dir / "src" / "frontend"
    backend_dir = root_dir / "src" / "backend"
    backend_ts_dir = root_dir / "src" / "backend_ts"

    # 1. Cleanup
    print(f"🧹 Cleaning up ports {args.backend_port} and {args.frontend_port}...")
    kill_process_on_port(args.backend_port)
    kill_process_on_port(args.frontend_port)

    # 2. Start Backend
    print(f"🚀 Launching Backend ({args.backend_runtime}) on {args.host}:{args.backend_port}...")
    env = os.environ.copy()
    if args.backend_runtime == "ts":
        backend_log = open(backend_ts_dir / "backend_runtime.log", "a")
        node_bin = shutil.which("node")
        if not node_bin:
            print("🚨 CRITICAL: Node.js is required for --backend-runtime ts.")
            sys.exit(1)
        if not (backend_ts_dir / "dist" / "main.js").exists():
            print("📦 Building TypeScript backend...")
            subprocess.run(["npm", "run", "build"], cwd=str(backend_ts_dir), check=True)
        backend_proc = subprocess.Popen(
            [node_bin, "dist/main.js", "--host", args.host, "--port", str(args.backend_port)],
            cwd=str(backend_ts_dir),
            env=env,
            stdout=backend_log,
            stderr=backend_log,
            preexec_fn=os.setsid if platform.system() != "Windows" else None
        )
    else:
        python_exe = get_python_executable(backend_dir)
        env["PYTHONPATH"] = str(backend_dir)
        backend_log = open(backend_dir / "backend_runtime.log", "a")
        backend_proc = subprocess.Popen(
            [python_exe, "main.py", "--host", args.host, "--port", str(args.backend_port)],
            cwd=str(backend_dir),
            env=env,
            stdout=backend_log,
            stderr=backend_log,
            preexec_fn=os.setsid if platform.system() != "Windows" else None
        )

    # 3. Start Frontend
    print(f"🚀 Launching Frontend on {args.host}:{args.frontend_port}...")
    frontend_log = open(frontend_dir / "frontend_runtime.log", "a")
    
    # Use direct vite binary to avoid npm wrapper issues
    vite_bin = frontend_dir / "node_modules" / ".bin" / "vite"
    if not vite_bin.exists():
        vite_bin = "npx vite" # Fallback
    
    f_env = os.environ.copy()
    f_env["CI"] = "true"
    
    is_win = platform.system() == "Windows"
    frontend_proc = subprocess.Popen(
        f"{vite_bin} --host {args.host} --port {args.frontend_port} --no-open",
        cwd=str(frontend_dir),
        env=f_env,
        stdout=frontend_log,
        stderr=frontend_log,
        shell=True,
        preexec_fn=os.setsid if not is_win else None
    )

    print("⌛ Waiting for stabilization (10s)...")
    time.sleep(10)

    # 4. Self-Verification
    print("🔍 Probing services...")
    import urllib.request
    
    def probe(url):
        try:
            with urllib.request.urlopen(url, timeout=5) as response:
                return response.getcode() == 200
        except Exception:
            return False

    b_ok = probe(f"http://127.0.0.1:{args.backend_port}/api/v1/system/version")
    f_ok = probe(f"http://127.0.0.1:{args.frontend_port}/")

    print(f"Backend: {'✅ OK' if b_ok else '❌ FAIL'}")
    print(f"Frontend: {'✅ OK' if f_ok else '❌ FAIL'}")

    if b_ok and f_ok:
        print(f"\n🎉 ALL SYSTEMS GO!")
        print(f"Frontend: http://localhost:{args.frontend_port}")
        print(f"Backend:  http://localhost:{args.backend_port}")
        print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    else:
        print("\n🚨 CRITICAL: Service stability check failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
