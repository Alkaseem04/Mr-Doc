@echo off
REM Frontend deployment script for MR.DOC (Windows)

echo Starting MR.DOC frontend deployment...

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

REM Navigate to project root
cd /d "%~dp0\.."

echo Installing frontend dependencies...
npm install

REM Check if build is successful
npm run build
if %errorlevel% equ 0 (
    echo Frontend build successful!
    echo Frontend deployment completed successfully!
) else (
    echo Frontend build failed!
    exit /b 1
)