@echo off
echo --- Service Status Report (Windows) ---

netstat -ano | findstr :8000 | findstr LISTENING >NUL
if %ERRORLEVEL% equ 0 (
    echo Backend:  ✅ ONLINE -> http://localhost:8000
) else (
    echo Backend:  ❌ OFFLINE
)

netstat -ano | findstr :3001 | findstr LISTENING >NUL
if %ERRORLEVEL% equ 0 (
    echo Frontend: ✅ ONLINE -> http://localhost:3001
) else (
    echo Frontend: ❌ OFFLINE
)

tasklist /fi "windowtitle eq AMR_SENTINEL" | findstr /i "python.exe" >NUL
if %ERRORLEVEL% equ 0 (
    echo Sentinel: ✅ ONLINE
) else (
    echo Sentinel: ❌ OFFLINE
)

pause
