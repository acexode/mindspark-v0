@echo off
rem One-time install (and update) for a student's Windows PC.
rem Right-click this file -> "Run as administrator". Run it again after pulling new code.
rem It puts the app in C:\ProgramData\Mindspark (hidden, read-only for normal users) and
rem puts a "Mindspark" launcher on the desktop.

net session >nul 2>&1
if errorlevel 1 (
  echo Please right-click this file and choose "Run as administrator".
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found. Install the LTS version from https://nodejs.org and run this again.
  pause
  exit /b 1
)

set "SRC=%~dp0.."
set "ROOT=%ProgramData%\Mindspark"
set "DEST=%ROOT%\app"

echo Copying the app to %DEST% ...
mkdir "%DEST%" 2>nul
rem /MIR mirrors the code; the excluded folders keep the student's saved progress and the installed packages.
robocopy "%SRC%" "%DEST%" /MIR /XD node_modules .next .dev-data .venv __pycache__ .git windows /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 (
  echo Copy failed.
  pause
  exit /b 1
)

cd /d "%DEST%"
echo Installing packages ...
call npm install
if errorlevel 1 ( echo npm install failed. & pause & exit /b 1 )

echo Building (this takes a minute) ...
call npm run build
if errorlevel 1 ( echo Build failed. & pause & exit /b 1 )

echo Setting up the drafting tools ...
call npm run drafting:setup
if errorlevel 1 echo Drafting setup did not finish. Install Python 3.9 or newer (tick "Add python.exe to PATH") and run this again.

rem Lock the folder: administrators full control, everyone else read-only ...
mkdir "%DEST%\.dev-data" 2>nul
mkdir "%DEST%\.next\cache" 2>nul
icacls "%ROOT%" /inheritance:r /grant:r "*S-1-5-32-544:(OI)(CI)F" "*S-1-5-18:(OI)(CI)F" "*S-1-5-32-545:(OI)(CI)RX" >nul
rem ... except the two places the running app must write to.
icacls "%DEST%\.dev-data" /grant "*S-1-5-32-545:(OI)(CI)M" >nul
icacls "%DEST%\.next\cache" /grant "*S-1-5-32-545:(OI)(CI)M" >nul
attrib +h +s "%ROOT%"

copy /Y "%~dp0Mindspark.bat" "%PUBLIC%\Desktop\Mindspark.bat" >nul

echo.
echo Done. Use the "Mindspark" file on the desktop to start the app.
pause
