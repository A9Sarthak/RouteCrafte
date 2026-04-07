@echo off
echo ========================================================
echo Starting RouteCraft App...
echo ========================================================
echo This single command will spin up BOTH the frontend and backend.
echo Ensure MongoDB is running locally or specify MONGO_URI in server/.env
echo.

call npm run dev:all
