#!/bin/bash
# AMR Studio V4 - Unified Startup Script

BASE_DIR=$(pwd)
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend"
AUDIT_DIR="$BASE_DIR/gemini_audits"

echo "🚀 Starting AMR Studio V4 Stack..."

# 1. Start Backend (FastAPI)
echo "[*] Launching Backend on Port 8000..."
kill -9 $(lsof -t -i :8000) 2>/dev/null
cd "$BACKEND_DIR" && nohup venv/bin/python3 main.py > backend_runtime.log 2>&1 &

# 2. Start Frontend (Vite)
echo "[*] Launching Frontend on Port 3001..."
kill -9 $(lsof -t -i :3001) 2>/dev/null
cd "$FRONTEND_DIR" && nohup npm run dev -- --port 3001 > frontend_runtime.log 2>&1 &

# 3. Start Sentinel (Audit & Auto-Push)
echo "[*] Launching Sentinel V7 Pro..."
kill -9 $(ps aux | grep sentinel_v3 | grep -v grep | awk '{print $2}') 2>/dev/null
cd "$AUDIT_DIR" && nohup ../backend/venv/bin/python3 sentinel_v3.py > sentinel_runtime.log 2>&1 &

echo "✅ All services initiated. Use './check_health.sh' to verify status."
