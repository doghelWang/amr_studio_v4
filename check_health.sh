#!/bin/bash
# AMR Studio V4 - Health Check Script

echo "--- Service Status Report ---"

BE_PID=$(lsof -t -i :8000)
if [ -z "$BE_PID" ]; then
    echo "Backend:  ❌ OFFLINE"
else
    echo "Backend:  ✅ ONLINE (PID: $BE_PID) -> http://localhost:8000"
fi

FE_PID=$(lsof -t -i :3001)
if [ -z "$FE_PID" ]; then
    echo "Frontend: ❌ OFFLINE"
else
    echo "Frontend: ✅ ONLINE (PID: $FE_PID) -> http://localhost:3001"
fi

SENTINEL_PID=$(ps aux | grep sentinel_v3 | grep -v grep | awk '{print $2}')
if [ -z "$SENTINEL_PID" ]; then
    echo "Sentinel: ❌ OFFLINE"
else
    echo "Sentinel: ✅ ONLINE (PID: $SENTINEL_PID)"
fi
