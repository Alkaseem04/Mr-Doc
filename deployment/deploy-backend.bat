@echo off
REM Backend deployment script for MR.DOC (Windows)

echo Starting MR.DOC backend deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not installed. Please install npm first.
    exit /b 1
)

REM Navigate to backend directory
cd /d "%~dp0\..\backend"

echo Installing backend dependencies...
npm install

echo Starting backend server...
REM For production deployment, you might want to use a process manager like PM2
REM npm install -g pm2
REM pm2 start server.js --name "mrdoc-backend"

REM For simple deployment, just start the server
node server.js

echo Backend deployment completed successfully!
echo Server is running on port 5000