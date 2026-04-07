# RouteCraft 🌍

RouteCraft is a premium React + Vite frontend application paired with a robust Node.js/Express backend and MongoDB. Plan multi-checkpoint journeys, automatically estimate budget, generate reports, and manage all your trips in a single place.

## Zero-Config Quick Start (Windows)

We have included scripts to make starting up frictionless on Windows.

1.  **Double-click `setup.bat`**
    *   This installs frontend dependencies, backend dependencies, and initializes environment files automatically.
2.  **Double-click `run.bat`**
    *   This boots up *both* the frontend and backend servers concurrently with a single click.

## Manual Quick Start (Any platform)

If you prefer terminal commands or are on macOS/Linux:

```bash
# 1. Install missing global tools
npm install -g concurrently

# 2. Install all required dependencies for the main project
npm install

# 3. Install backend dependencies
cd server
npm install

# 4. Environment Variables
# Copy the example environments. The default MongoDB connection string is localhost.
cp .env.example .env
cd ..

# 5. Boot Up Everything!
# This starts the frontend (localhost:5173) and backend (localhost:5000) simultaneously.
npm run dev:all
```

## Security & Readiness

All NPM audit vulnerabilities have been patched, meaning the project dependencies are up-to-date and secure for deployment anywhere. 

## Features

- **Split-Screen Authentication:** Modern JWT based auth routing.
- **Trip Dashboard:** Global visual overview of past, planned, and completed trips directly mapping budget constraints.
- **Dynamic Logistics Engine:** Specify trip dates, number of travelers, multiple specific checkpoints, and their unique transportation types with dynamic OpenStreetMap location geocoding.
- **Timeline Reports:** Automatically download dynamic `.txt` itineraries of planned costs and logistical milestones.
- **User Configurations:** Persist localization preferences like chosen Currency (USD, INR, EUR, etc).

## Database Configuration

The backend stores all data asynchronously via **MongoDB**.
By default, the server expects MongoDB running at:
`mongodb://127.0.0.1:27017/routecraft`

If deploying to a cloud service or Atlas, update `MONGO_URI` inside `server/.env`.
