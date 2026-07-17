@echo off
title Campus AI Student Chatbot - Windows Launcher
color 0B
echo ============================================================
echo   Campus AI - Student Support Assistant (Windows Launcher)
echo ============================================================
echo.

:: 1. Check if Python is installed in Windows PATH
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not added to your Windows PATH!
    echo Please download Python 3.10+ from https://www.python.org/downloads/
    echo and make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

:: 2. Check if .venv exists, if not create one
if not exist ".venv\Scripts\activate.bat" (
    echo [*] Creating virtual environment (.venv)...
    python -m venv .venv
)

:: 3. Activate Virtual Environment
echo [*] Activating virtual environment...
call .venv\Scripts\activate.bat

:: 4. Install Dependencies
echo [*] Checking and installing required Python packages...
pip install -r requirements.txt --quiet

:: 5. Train Model if not trained or if intents changed
echo [*] Verifying and training offline NLP classification model...
python train.py

:: 6. Start Flask Application Server
echo.
echo ============================================================
echo    Campus AI Server is booting up!
echo ============================================================
echo   MAIN CHAT BOX DIRECT:  http://127.0.0.1:5001/app
echo   Landing Page (Home):   http://127.0.0.1:5001/
echo.
echo   Keep this window open while using the chatbot!
echo ============================================================
echo.
python app.py

pause
