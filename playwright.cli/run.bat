@echo off
title DDMAI.VIDEO Playwright CLI Runner
color 0b

echo ================================================================
echo       🎭 DDMAI.VIDEO - PLAYWRIGHT TEST AUTOMATION CLI
echo ================================================================
echo.

cd /d "%~dp0"

echo [1] Run Playwright Tests against Local Studio (port 3000)
echo [2] Run Playwright Tests against Live Cloud (vedio-working.web.app)
echo [3] Run Playwright Tests in Headed Mode (Visible Browser)
echo [4] Open Playwright UI Dashboard
echo [5] Capture Studio & Modals Screenshots
echo [6] Exit
echo.
set /p opt="Select an option [1-6]: "

if "%opt%"=="1" (
    node cli.js test
) else if "%opt%"=="2" (
    node cli.js test:cloud
) else if "%opt%"=="3" (
    node cli.js test:headed
) else if "%opt%"=="4" (
    node cli.js test:ui
) else if "%opt%"=="5" (
    node cli.js screenshot
) else (
    exit /b 0
)

echo.
pause
