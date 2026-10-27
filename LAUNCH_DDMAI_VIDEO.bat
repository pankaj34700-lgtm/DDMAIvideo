@echo off
title DDMAI.VIDEO Production Studio Launcher
color 0b

echo ================================================================
echo       DDMAI.VIDEO - NEXT-GEN AI VIDEO & IMAGE PRODUCTION STUDIO
echo            Zero-Cost Engine - 100%% Local & Cloud Integrated
echo ================================================================
echo.

cd /d "%~dp0"

echo [1] Checking Local Node.js Server on port 3000...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo [OK] DDMAI.VIDEO Local Server is active on port 3000!
) else (
    echo [INFO] Starting DDMAI.VIDEO Web Server in background...
    start /b node website/server.js
    timeout /t 2 /nobreak >nul
)

echo.
echo [2] Opening Firebase Cloud Hosted DDMAI.VIDEO Studio in your default browser...
start https://vedio-working.web.app

echo.
echo ================================================================
echo  LIVE ACCESS PATHS:
echo    Firebase Cloud URL: https://vedio-working.web.app
echo    Firebase Alt URL:   https://vedio-working.firebaseapp.com
echo    Local URL:          http://localhost:3000
echo    Studio Domain:      DDMAI.VIDEO
echo    Evidence Folder:    %USERPROFILE%\Desktop\EVIDENCE_TEST_REPORTS
echo    Master Guide:       %USERPROFILE%\Desktop\1-Minute Video Production Master Blueprint & Flowchart.pdf
echo ================================================================
echo.
pause
