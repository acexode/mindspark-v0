@echo off
title Mindspark
cd /d "%ProgramData%\Mindspark\app"
if errorlevel 1 (
  echo Mindspark is not installed. Ask for help.
  pause
  exit /b 1
)

rem Keep the AI tutor's model in memory for as long as Mindspark runs. Ollama normally unloads it after
rem 5 minutes idle, which makes the next question wait for a slow reload.
set "OLLAMA_KEEP_ALIVE=-1"
set "OLLAMA_URL=http://localhost:11434"
set "OLLAMA_MODEL_NAME=llama3.2:3b"
if exist ".env.local" (
  for /f "usebackq tokens=1,* delims==" %%A in (`findstr /b "OLLAMA_BASE_URL= OLLAMA_MODEL=" ".env.local"`) do (
    if "%%A"=="OLLAMA_BASE_URL" set "OLLAMA_URL=%%B"
    if "%%A"=="OLLAMA_MODEL" set "OLLAMA_MODEL_NAME=%%B"
  )
)

where ollama >nul 2>&1
if not errorlevel 1 (
  rem Start Ollama if it is not already answering, then load the model and pin it in memory.
  curl -s -m 3 "%OLLAMA_URL%/api/tags" >nul 2>&1
  if errorlevel 1 (
    echo Starting Ollama ...
    start "" /min ollama serve
    timeout /t 4 >nul
  )
  echo Loading the AI tutor model in the background ...
  start "" /b curl -s -m 300 "%OLLAMA_URL%/api/generate" -d "{\"model\":\"%OLLAMA_MODEL_NAME%\",\"keep_alive\":-1}" >nul 2>&1
)

echo Starting Mindspark. Keep this window open while you study. Close it to stop.
start "" /b cmd /c "timeout /t 6 >nul & start http://localhost:3000"
call npm start
pause
