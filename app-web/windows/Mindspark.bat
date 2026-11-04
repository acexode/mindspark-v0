@echo off
title Mindspark
cd /d "%ProgramData%\Mindspark\app"
if errorlevel 1 (
  echo Mindspark is not installed. Ask for help.
  pause
  exit /b 1
)
echo Starting Mindspark. Keep this window open while you study. Close it to stop.
start "" /b cmd /c "timeout /t 6 >nul & start http://localhost:3000"
call npm start
pause
