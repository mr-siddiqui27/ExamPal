@echo off
echo ========================================
echo           ExamPal Startup Script
echo ========================================
echo.

echo Starting Backend Server...
start "ExamPal Backend" cmd /k "npm start"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
start "ExamPal Frontend" cmd /k "python -m http.server 5500"

echo.
echo ========================================
echo Both servers are starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5500
echo ========================================
echo.
echo Press any key to open the frontend...
pause >nul

start http://localhost:5500

echo.
echo Frontend opened in your browser!
echo Keep both terminal windows open while using ExamPal.
echo.
pause
