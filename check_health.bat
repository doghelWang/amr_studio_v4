@echo off
echo --- Service Status Report (Windows) ---

netstat -ano | findstr :8002 | findstr LISTENING >NUL
if %ERRORLEVEL% equ 0 (
    echo Backend:  [OK] ONLINE -^> http://localhost:8002
) else (
    echo Backend:  [ERROR] OFFLINE
)

netstat -ano | findstr :3001 | findstr LISTENING >NUL
if %ERRORLEVEL% equ 0 (
    echo Frontend: [OK] ONLINE -^> http://localhost:3001
) else (
    echo Frontend: [ERROR] OFFLINE
)

tasklist /fi "windowtitle eq AMR_SENTINEL" | findstr /i "python.exe" >NUL
if %ERRORLEVEL% equ 0 (
    echo Sentinel: [OK] ONLINE
) else (
    echo Sentinel: [ERROR] OFFLINE
)

pause
