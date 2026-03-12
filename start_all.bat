@echo off
title AMR Studio Pro V4 - Unified Startup (Windows)
set BASE_DIR=%~dp0
echo 🚀 Starting AMR Studio V4 Stack on Windows...

:: 1. Start Backend (FastAPI)
echo [*] Launching Backend on Port 8000...
taskkill /f /im python.exe /fi "windowtitle eq AMR_BACKEND" 2>NUL
cd /d "%BASE_DIR%backend"
start "AMR_BACKEND" venv\Scripts\python.exe main.py

:: 2. Start Frontend (Vite)
echo [*] Launching Frontend on Port 3001...
cd /d "%BASE_DIR%frontend"
start "AMR_FRONTEND" cmd /c "npm run dev -- --port 3001"

:: 3. Start Sentinel (Audit)
echo [*] Launching Sentinel V7 Pro...
cd /d "%BASE_DIR%gemini_audits"
start "AMR_SENTINEL" ..\backend\venv\Scripts\python.exe sentinel_v3.py

echo ✅ All services initiated.
echo Frontend: http://localhost:3001
echo Backend:  http://localhost:8000
pause
