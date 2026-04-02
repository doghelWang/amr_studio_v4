#!/usr/bin/env python3
import os
import sys
import subprocess
import argparse
import platform
import shutil
from pathlib import Path

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
            # Windows: Find PID using netstat and kill using taskkill
            cmd = f"netstat -ano | findstr :{port}"
            output = subprocess.check_output(cmd, shell=True).decode()
            for line in output.strip().split("\n"):
                if "LISTENING" in line:
                    pid = line.strip().split()[-1]
                    print(f"清理正在占用端口 {port} 的进程 (PID: {pid})...")
                    subprocess.run(["taskkill", "/F", "/PID", pid], check=False, stdout=subprocess.DEVNULL)
        else:
            # Unix: Use lsof and kill
            cmd = f"lsof -t -i:{port}"
            pids = subprocess.check_output(cmd, shell=True).decode().strip().split("\n")
            for pid in pids:
                if pid:
                    print(f"Cleaning process on port {port} (PID: {pid})...")
                    subprocess.run(["kill", "-9", pid], check=False)
    except Exception:
        pass

def check_dependencies(python_exe: str, backend_dir: Path):
    """Verify that required dependencies (like protobuf) are present and working."""
    print("🔍 Checking backend dependencies...", flush=True)
    try:
        # Check for protobuf and runtime_version
        cmd = [python_exe, "-c", "import google.protobuf; from google.protobuf import runtime_version; print('Protobuf Runtime OK')"]
        env = os.environ.copy()
        env["PYTHONPATH"] = str(backend_dir)
        subprocess.run(cmd, check=True, capture_output=True, env=env)
    except subprocess.CalledProcessError as e:
        print(f"❌ Dependency check failed: {e.stderr.decode()}", file=sys.stderr)
        print("\n[FIX] Please run the following command to repair your environment:", file=sys.stderr)
        print(f"    {python_exe} -m pip install -r {backend_dir}/requirements.txt --upgrade", file=sys.stderr)
        return False
    except Exception as e:
        print(f"⚠️ Warning: Could not verify dependencies: {e}", file=sys.stderr)
    
    return True

def main():
    parser = argparse.ArgumentParser(description="AMR Studio V4 Unified Deployment Tool")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Binding host (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8002, help="Binding port (default: 8002)")
    parser.add_argument("--skip-build", action="store_true", help="Skip frontend build process")
    parser.add_argument("--dev", action="store_true", help="Run with hot-reload enabled")
    args = parser.parse_args()

    root_dir = Path(__file__).parent.absolute()
    # Path resolution: find src/frontend or local frontend
    if (root_dir / "src" / "frontend").exists():
        frontend_dir = root_dir / "src" / "frontend"
        backend_dir = root_dir / "src" / "backend"
    else:
        frontend_dir = root_dir / "frontend"
        backend_dir = root_dir / "backend"

    # 1. Clear ports
    kill_process_on_port(args.port)
    kill_process_on_port(3001)

    # 2. Build Frontend
    if not args.skip_build:
        print("📦 Building Frontend...", flush=True)
        try:
            # shell=True required on Windows for 'npm' command to be found
            is_win = platform.system() == "Windows"
            subprocess.run(["npm", "install"], cwd=str(frontend_dir), check=True, shell=is_win)
            subprocess.run(["npm", "run", "build"], cwd=str(frontend_dir), check=True, shell=is_win)
            print("✅ Frontend built successfully.", flush=True)
        except subprocess.CalledProcessError as e:
            print(f"❌ Frontend build failed: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print("⏭️ Skipping frontend build.", flush=True)

    # 3. Start Backend
    print(f"🚀 Starting Server on {args.host}:{args.port}...", flush=True)
    python_exe = get_python_executable(backend_dir)
    print(f"Using Python: {python_exe}", flush=True)

    if not check_dependencies(python_exe, backend_dir):
        sys.exit(1)

    try:
        # Standard execution command
        env = os.environ.copy()
        env["PYTHONPATH"] = str(backend_dir)
        
        cmd = [python_exe, "main.py", "--host", args.host, "--port", str(args.port)]
        if args.dev:
            # If dev mode, we use uvicorn CLI for hot-reload
            cmd = [python_exe, "-m", "uvicorn", "main:app", "--host", args.host, "--port", str(args.port), "--reload"]
        
        subprocess.run(cmd, cwd=str(backend_dir), env=env)
    except KeyboardInterrupt:
        print("\n👋 Shutdown requested by user.", flush=True)
    except Exception as e:
        print(f"❌ Backend failed to start: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
