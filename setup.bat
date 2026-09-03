@echo off
setlocal
cd /d "%~dp0"
color 0A

echo ===================================================
echo        PhishGuard Setup and Installation
echo ===================================================
echo.

:: 1. Check for Python
echo Checking for Python...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Python is not installed or not added to PATH.
    echo Please download and install Python from https://www.python.org/downloads/
    echo IMPORTANT: Make sure to check the box "Add Python 3.x to PATH" during installation.
    echo.
    pause
    exit /b 1
)
echo [OK] Python is installed.
echo.

:: 2. Check for Node.js
echo Checking for Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not added to PATH.
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js is installed.
echo.

:: 3. Setup Backend
echo ===================================================
echo        [1/2] Setting up Backend (Python)
echo ===================================================
cd backend
if not exist venv (
    echo Creating virtual environment (this may take a moment)...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo [ERROR] Failed to create virtual environment.
        cd ..
        pause
        exit /b 1
    )
)
echo Activating virtual environment...
call venv\Scripts\activate
echo Installing backend requirements...
python -m pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Failed to install backend requirements.
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Backend setup complete.
echo.

:: 4. Setup Frontend
echo ===================================================
echo        [2/2] Setting up Frontend (Node.js)
echo ===================================================
cd frontend
echo Installing frontend dependencies (this may take a moment)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Failed to install frontend dependencies.
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend setup complete.
echo.

echo ===================================================
echo   Setup Completed Successfully! You are all set.
echo ===================================================
echo You can now run 'start.bat' to run the application.
echo.
if "%~1"=="--no-pause" goto :EOF
pause

