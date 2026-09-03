@echo off
setlocal
cd /d "%~dp0"
color 0B

echo ===================================================
echo             Starting PhishGuard
echo ===================================================
echo.

:: Check if setup was run
if not exist "backend\venv" (
    echo [INFO] First time setup required. Running setup automatically...
    call setup.bat --no-pause
    if errorlevel 1 exit /b 1
    color 0B
) else if not exist "frontend\node_modules" (
    echo [INFO] First time setup required. Running setup automatically...
    call setup.bat --no-pause
    if errorlevel 1 exit /b 1
    color 0B
)

echo Starting Backend API...
cd backend
start cmd /k "title PhishGuard Backend && call venv\Scripts\activate && python -m app.main"
cd ..

echo Starting Frontend UI...
cd frontend
start cmd /k "title PhishGuard Frontend && npm run dev"
cd ..

echo.
echo ===================================================
echo   PhishGuard is starting up!
echo ===================================================
echo - The Backend and Frontend are running in new command windows.
echo - Your default web browser should open automatically in a few seconds.
echo - If the browser doesn't open, manually go to: http://localhost:5173
echo.
echo To stop PhishGuard, simply close the two command windows.
echo ===================================================
timeout /t 3 > nul
