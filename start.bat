@echo off
setlocal
echo 🚀 Launching AMR Studio V4 for Windows...

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not found in PATH. Please install Python 3.10+.
    pause
    exit /b 1
)

:: Run the unified startup script
python start.py %*

if %errorlevel% neq 0 (
    echo ❌ System failed to start.
    pause
)
endlocal
