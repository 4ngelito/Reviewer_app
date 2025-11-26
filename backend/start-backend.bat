@echo off
echo ======================================
echo Quiz Reviewer - Backend Startup
echo ======================================
echo.
echo Checking if Node.js is installed...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
call npm install

echo.
echo ======================================
echo Starting Backend Server...
echo ======================================
echo.
echo Make sure MySQL is running in XAMPP!
echo.
echo Server should run on: http://localhost:3000
echo.
call npm start

pause
