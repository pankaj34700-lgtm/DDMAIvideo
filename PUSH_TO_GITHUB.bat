@echo off
title Push DDMAI.VIDEO to GitHub
color 0b

echo ================================================================
echo       PUSH DDMAI.VIDEO CODEBASE TO GITHUB REPOSITORY
echo       Target: https://github.com/pankaj34700-lgtm/DDMAIvideo.git
echo ================================================================
echo.

cd /d "D:\Open Code\Video production 261026 1st\self reserch with video"

echo [1] Current Git Branch and Status:
git branch --show-current
git status --short

echo.
echo [2] Pushing branch 'main' to GitHub origin...
echo (If prompted, click 'Sign in with your browser' to authenticate)
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo [SUCCESS] Codebase uploaded successfully to GitHub!
    echo Visit: https://github.com/pankaj34700-lgtm/DDMAIvideo
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo [ERROR] Push failed. Please check your GitHub login or token.
    echo ================================================================
)

echo.
pause
