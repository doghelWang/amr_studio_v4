#!/bin/bash
# AMR Studio V4 - Standardized Startup Script

BASE_DIR=$(pwd)
BACKEND_DIR="$BASE_DIR/src/backend"
FRONTEND_DIR="$BASE_DIR/src/frontend"

echo "🚀 Starting AMR Studio V4 (Standard Architecture)..."

# 1. Start Backend
echo "Launching Backend on Port 8002..."
export PYTHONPATH="$BASE_DIR/src/backend"
if [ ! -d "venv" ]; then
    echo "Initializing virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install -r src/backend/requirements.txt
fi
kill -9 $(lsof -t -i :8002) 2>/dev/null
nohup ./venv/bin/python3 src/backend/main.py --host 127.0.0.1 --port 8002 > src/backend/backend_runtime.log 2>&1 &

# 2. Start Frontend
echo "Launching Frontend on Port 3001..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
kill -9 $(lsof -t -i :3001) 2>/dev/null
nohup npm run dev -- --port 3001 --host 127.0.0.1 > frontend_runtime.log 2>&1 &

echo "✅ All services initiated in 'src/' layer."
echo "🔗 Backend: http://127.0.0.1:8002"
echo "🔗 Frontend: http://127.0.0.1:3001"
