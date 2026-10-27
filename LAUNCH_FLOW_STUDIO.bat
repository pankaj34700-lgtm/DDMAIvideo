@echo off
title VIPA Studio - Google Flow Clone Launcher
color 0b

echo ================================================================
echo      VIPA STUDIO / GOOGLE FLOW CLONE - LAUNCHER & CONTROLLER
echo           Zero-Cost Mode - 100%% Local & Cloud Integrated
echo ================================================================
echo.

cd /d "%~dp0"

echo [1] Checking Node.js Server on port 3000...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo [OK] Server is already active and listening on port 3000!
) else (
    echo [INFO] Starting Node.js Web Server in background...
    start /b node website/server.js
    timeout /t 2 /nobreak >nul
)

echo.
echo [2] Opening Live Flow Studio in your default browser...
start http://localhost:3000

echo.
echo ================================================================
echo  LIVE ACCESS PATHS:
echo    Local URL:       http://localhost:3000
echo    Public URL:      https://nice-goats-peel.loca.lt
echo    Evidence Folder: %USERPROFILE%\Desktop\EVIDENCE_TEST_REPORTS
echo    Desktop Guide:   %USERPROFILE%\Desktop\Google Flow Clone - Zero-Cost Video & Image Platform RFP.docx
echo ================================================================
echo.
pause
