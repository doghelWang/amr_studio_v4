@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

set "BACKEND_DIR=%CD%\src\backend"
set "FRONTEND_DIR=%CD%\src\frontend"
set "VENV_PYTHON=%BACKEND_DIR%\venv\Scripts\python.exe"
set "PYTHONUTF8=1"

echo ============================================================
echo AMR Studio V4 - Windows one-click local deployment
echo ============================================================

where py >nul 2>&1
if not errorlevel 1 (
    set "PYTHON_LAUNCHER=py -3"
) else (
    where python >nul 2>&1
    if errorlevel 1 goto :missing_python
    set "PYTHON_LAUNCHER=python"
)

%PYTHON_LAUNCHER% -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)" >nul 2>&1
if errorlevel 1 goto :unsupported_python

where node >nul 2>&1
if errorlevel 1 goto :missing_node
where npm.cmd >nul 2>&1
if errorlevel 1 goto :missing_node
node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 18 ? 0 : 1)" >nul 2>&1
if errorlevel 1 goto :unsupported_node

if not exist "%VENV_PYTHON%" (
    echo [1/4] Creating Python virtual environment...
    %PYTHON_LAUNCHER% -m venv "%BACKEND_DIR%\venv"
    if errorlevel 1 goto :failed
) else (
    echo [1/4] Reusing Python virtual environment.
)

echo [2/4] Installing or updating backend dependencies...
"%VENV_PYTHON%" -m pip install --disable-pip-version-check -r "%BACKEND_DIR%\requirements.txt"
if errorlevel 1 goto :failed

echo [3/4] Installing or updating frontend dependencies...
call npm.cmd --prefix "%FRONTEND_DIR%" install --no-audit --no-fund
if errorlevel 1 goto :failed

echo [4/4] Starting backend and frontend, then running health checks...
"%VENV_PYTHON%" start.py --host 127.0.0.1 --open-browser %*
if errorlevel 1 goto :failed

echo.
echo Deployment succeeded. Logs:
echo   %BACKEND_DIR%\backend_runtime.log
echo   %FRONTEND_DIR%\frontend_runtime.log
exit /b 0

:missing_python
echo ERROR: Python was not found. Install Python 3.10 or newer and enable Add Python to PATH.
goto :failed

:unsupported_python
echo ERROR: Python 3.10 or newer is required. Python 3.11 is recommended.
goto :failed

:missing_node
echo ERROR: Node.js and npm were not found. Install Node.js 18 or newer.
goto :failed

:unsupported_node
echo ERROR: Node.js 18 or newer is required. Node.js 20 LTS is recommended.
goto :failed

:failed
echo.
echo Deployment failed. Review the error above and the runtime logs.
pause
exit /b 1
