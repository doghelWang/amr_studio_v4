#!/usr/bin/env python3
import os
import sys
import subprocess
import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description="AMR Studio V4 Unified Deployment Tool")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Binding host (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8002, help="Binding port (default: 8002)")
    parser.add_argument("--skip-build", action="store_true", help="Skip frontend build process")
    args = parser.parse_args()

    root_dir = Path(__file__).parent.absolute()
    frontend_dir = root_dir / "frontend"
    backend_dir = root_dir / "backend"

    # 1. Build Frontend
    if not args.skip_build:
        print("📦 Building Frontend...", flush=True)
        try:
            subprocess.run(["npm", "install"], cwd=str(frontend_dir), check=True)
            subprocess.run(["npm", "run", "build"], cwd=str(frontend_dir), check=True)
            print("✅ Frontend built successfully.", flush=True)
        except subprocess.CalledProcessError as e:
            print(f"❌ Frontend build failed: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print("⏭️ Skipping frontend build.", flush=True)

    # 2. Start Backend
    print(f"🚀 Starting Unified Server on {args.host}:{args.port}...", flush=True)
    backend_main = backend_dir / "main.py"
    
    # Use the venv if it exists
    python_exe = sys.executable
    venv_python = backend_dir / "venv" / "bin" / "python3"
    if venv_python.exists():
        python_exe = str(venv_python)
        print(f"Using virtual environment: {python_exe}", flush=True)

    try:
        cmd = [python_exe, str(backend_main), "--host", args.host, "--port", str(args.port)]
        subprocess.run(cmd, cwd=str(backend_dir))
    except KeyboardInterrupt:
        print("\n👋 Shutdown requested by user.", flush=True)
    except Exception as e:
        print(f"❌ Backend failed to start: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
