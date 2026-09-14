@echo off
setlocal

cd /d "%~dp0"

set "SCRIPT_DIR=%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%Start Emmanuel Website.ps1"
if errorlevel 1 (
    echo.
    echo Emmanuel Church could not be started. Review the error above.
    pause
)
exit /b %errorlevel%
