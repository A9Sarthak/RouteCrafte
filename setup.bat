@echo off
echo ========================================================
echo RouteCraft Setup Script
echo ========================================================
echo.

echo [1/3] Installing Frontend Dependencies...
call npm install
echo.

echo [2/3] Installing Backend Dependencies...
cd server
call npm install
echo.

echo [3/3] Checking Environment Variables...
if not exist ".env" (
    echo No backend .env found. Copying .env.example to .env...
    copy .env.example .env
)
cd ..
echo.

echo Setup completed successfully!
echo You can now run the application anywhere by simply using:
echo.
echo    npm run dev:all
echo.
pause
