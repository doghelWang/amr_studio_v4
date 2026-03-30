#!/bin/bash
# AMR Studio V4 - Standardized Startup Script (V5 - Global Reach)

BASE_DIR=$(pwd)
BACKEND_DIR="$BASE_DIR/src/backend"
FRONTEND_DIR="$BASE_DIR/src/frontend"

echo "🚀 Starting AMR Studio V4 (Global Accessibility Mode)..."

# 1. Start Backend (0.0.0.0 for external access)
echo "Launching Backend on Port 8002..."
export PYTHONPATH="$BASE_DIR/src/backend"
kill -9 $(lsof -t -i :8002) 2>/dev/null
nohup ./venv/bin/python3 src/backend/main.py --host 0.0.0.0 --port 8002 > src/backend/backend_runtime.log 2>&1 &

# 2. Start Frontend (0.0.0.0 for network visibility)
echo "Launching Frontend on Port 3001..."
cd "$FRONTEND_DIR"
kill -9 $(lsof -t -i :3001) 2>/dev/null
# Use --host 0.0.0.0 to allow access from browser outside the environment
nohup npm run dev -- --port 3001 --host 0.0.0.0 < /dev/null > frontend_runtime.log 2>&1 &
cd ../..

echo "✅ All services initiated with 0.0.0.0 binding."
echo "🔗 Backend API: http://0.0.0.0:8002"
echo "🔗 Frontend UI: http://0.0.0.0:3001"
