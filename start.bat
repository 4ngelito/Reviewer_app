@echo off
REM Quiz Reviewer App - Windows Startup Script

setlocal enabledelayedexpansion

echo ================================
echo Quiz Reviewer App - Quick Start
echo ================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo OK: Node.js is installed: 
node --version

echo.
echo ====================================
echo Starting Backend Server (Port 3000)
echo ====================================
echo.

cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

echo Starting backend...
start "Backend Server" cmd /k npm start

echo Backend started. Waiting 3 seconds...
timeout /t 3 /nobreak

echo.
echo ====================================
echo Starting Frontend App (Port 4200)
echo ====================================
echo.

cd ..

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

echo Starting Angular development server...
start "Frontend App" cmd /k ng serve --poll=2000

echo.
echo ====================================
echo SERVERS STARTED!
echo ====================================
echo.
echo Frontend: http://localhost:4200
echo Backend:  http://localhost:3000
echo PhpMyAdmin: http://localhost/phpmyadmin
echo.
echo Make sure XAMPP MySQL is running!
echo.
pause
