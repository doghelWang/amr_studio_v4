@echo off
title AMR Studio Pro V4 - Unified Startup (Windows)
set BASE_DIR=%~dp0
echo [*] Starting AMR Studio V4 Stack on Windows...

:: 1. Start Backend (FastAPI)
if not exist "%BASE_DIR%backend\venv" (
    echo [*] Creating Python Virtual Environment...
    cd /d "%BASE_DIR%backend"
    python -m venv venv
    venv\Scripts\python.exe -m pip install -r requirements.txt
)
echo [*] Launching Backend on Port 8002...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8002') do taskkill /f /pid %%a 2>NUL
cd /d "%BASE_DIR%backend"
start "AMR_BACKEND" venv\Scripts\python.exe main.py

:: 2. Start Frontend (Vite)
if not exist "%BASE_DIR%frontend\node_modules" (
    echo [*] Installing Frontend Dependencies...
    cd /d "%BASE_DIR%frontend"
    npm install
)
echo [*] Launching Frontend on Port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /f /pid %%a 2>NUL
cd /d "%BASE_DIR%frontend"
start "AMR_FRONTEND" cmd /c "npm run dev -- --port 3001"

:: 3. Start Sentinel (Audit)
echo [*] Launching Sentinel V7 Pro...
cd /d "%BASE_DIR%gemini_audits"
start "AMR_SENTINEL" ..\backend\venv\Scripts\python.exe sentinel_v3.py

echo [*] All services initiated.
echo Frontend: http://localhost:3001
echo Backend:  http://localhost:8002
pause
