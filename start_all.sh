#!/bin/bash
# AMR Studio V4 - Reinforced Startup Script (Industrial Stability)

BASE_DIR=$(pwd)
BACKEND_DIR="$BASE_DIR/src/backend"
FRONTEND_DIR="$BASE_DIR/src/frontend"

echo "🚀 Initiating AMR Studio V4 (Stabilized Production Mode)..."

# 1. Backend Stabilization
echo "--- Launching Backend ---"
export PYTHONPATH="$BASE_DIR/src/backend"
kill -9 $(lsof -t -i :8002) 2>/dev/null
nohup ./venv/bin/python3 src/backend/main.py --host 0.0.0.0 --port 8002 > src/backend/backend_runtime.log 2>&1 &

# 2. Frontend Stabilization (The Critical Fix)
echo "--- Launching Frontend ---"
cd "$FRONTEND_DIR"
kill -9 $(lsof -t -i :3001) 2>/dev/null

# CI=true prevents Vite from listening to stdin, which often causes background crashes
# --host 0.0.0.0 ensures network accessibility
export CI=true
nohup npm run dev -- --host 0.0.0.0 --port 3001 < /dev/null > frontend_runtime.log 2>&1 &
cd ../..

# 3. Post-Startup Self-Verification (Mandatory under Soul rules)
echo "⌛ Waiting for services to stabilize (20s)..."
sleep 20

echo "🔍 Performing Real-time Health Probing..."
B_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8002/api/v1/projects/saved-list)
F_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3001/)

echo "--- Results ---"
if [ "$B_STATUS" == "200" ]; then echo "✅ Backend: OK (200)"; else echo "❌ Backend: FAIL ($B_STATUS)"; fi
if [ "$F_STATUS" == "200" ]; then echo "✅ Frontend: OK (200)"; else echo "❌ Frontend: FAIL ($F_STATUS)"; fi

if [ "$B_STATUS" == "200" ] && [ "$F_STATUS" == "200" ]; then
    echo -e "\n🎉 ALL SYSTEMS STABILIZED. Access at http://localhost:3001"
else
    echo -e "\n🚨 STABILITY ALERT: One or more services failed to stabilize."
    echo "Check src/backend/backend_runtime.log or src/frontend/frontend_runtime.log"
    exit 1
fi
