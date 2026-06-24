@echo off
setlocal

cd /d "%~dp0"

set "SCRIPT_DIR=%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%Start Emmanuel Website.ps1"
exit /b %errorlevel%
