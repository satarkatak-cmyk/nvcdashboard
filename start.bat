@echo off
echo ========================================
echo राष्ट्रिय सतर्कता केन्द्र - Dashboard
echo Quick Start Script
echo ========================================
echo.

echo [1/4] Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [2/4] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
cd ..

echo [3/4] Initializing database...
echo Note: Make sure PostgreSQL is running and you have updated .env files with your credentials
node database/init-db.js
if %errorlevel% neq 0 (
    echo WARNING: Database initialization failed. Please check your PostgreSQL connection and .env files
    echo You can continue, but the application may not work properly without database connection.
    pause
)

echo [4/4] Starting the server...
echo.
echo Server will start on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
cd server
call npm start

pause