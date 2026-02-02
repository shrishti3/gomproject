@echo off
REM MadMann Dynamics - Local Development Startup

echo.
echo ========================================
echo MadMann Dynamics - Local Development
echo ========================================
echo.

REM Check prerequisites
echo Checking prerequisites...
where node >nul 2>nul || (echo ERROR: Node.js not installed & goto :error)
where go >nul 2>nul || (echo ERROR: Go not installed & goto :error)
where mongosh >nul 2>nul || (echo WARNING: MongoDB CLI not found, make sure MongoDB is running & goto :continue)

:continue
echo.
echo ✓ All prerequisites found
echo.

REM Start Backend
echo Starting Backend (Go) in new window...
start "MadMann Backend" cmd /k "cd backend && go run ./cmd/server"
timeout /t 2 >nul

REM Start Frontend
echo Starting Frontend (React) in new window...
start "MadMann Frontend" cmd /k "cd frontend && npm install --legacy-peer-deps && npm start"

echo.
echo ========================================
echo Services Starting...
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8080
echo.
echo Make sure MongoDB is running:
echo   mongod --dbpath "C:\data\db"
echo.
echo Press any key to close this window...
pause >nul
exit /b 0

:error
echo.
echo Please install missing prerequisites:
echo   - Node.js: https://nodejs.org
echo   - Go:      https://golang.org
echo   - MongoDB: https://www.mongodb.com/try/download/community
echo.
pause
exit /b 1
