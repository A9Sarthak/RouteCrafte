<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<h1 align="center">🌍 RouteCraft</h1>

<p align="center">
  <b>A comprehensive, full-stack itinerary and logistics engine designed to streamline trip planning, budget management, and multi-checkpoint routing.</b>
</p>

<p align="center">
  <a href="#sparkles-key-features">Key Features</a> •
  <a href="#computer-tech-stack">Tech Stack</a> •
  <a href="#rocket-quick-start">Quick Start</a> •
  <a href="#bar_chart-system-architecture">Architecture</a>
</p>

---

## 🎯 Overview

RouteCraft is a modern, responsive web application engineered to solve the complexities of multi-destination travel planning. Built with a robust **MERN-stack** architecture and a high-performance **Vite** frontend, it provides an intuitive platform for users to dynamically construct itineraries, automatically estimate logistical budgets, and securely manage their travel history. 

This project demonstrates proficiency in full-stack development, modern authentication flows, responsive UI/UX design, and integration with third-party geolocation mapping tools.

## ✨ Key Features

- **Dynamic Logistics Engine:** Seamlessly add multiple checkpoints with specific transportation types. Features dynamic OpenStreetMap location geocoding via Leaflet.
- **Smart Budget Estimation:** Automatically calculates and tracks budget constraints based on travel modes, passenger count, and chosen currency.
- **Trip Dashboard:** A comprehensive, visual overview of past, active, and upcoming trips.
- **Automated Reporting:** Generates and downloads detailed `.txt` itineraries outlining planned costs and logistical milestones.
- **Secure Authentication:** Implements industry-standard JWT (JSON Web Tokens) for secure, split-screen user authentication and session management.
- **User Configurations:** Persistent localization settings, including customizable currency preferences (USD, INR, EUR, etc.).

## 💻 Tech Stack

### Frontend
- **React.js 19** - Component-based UI development.
- **Vite** - Next-generation frontend tooling for rapid compilation.
- **Tailwind CSS** - Utility-first CSS framework for rapid UI styling.
- **React-Leaflet** - Interactive maps integration.
- **Dnd-kit** - Accessible drag-and-drop interactions for itinerary sorting.

### Backend
- **Node.js & Express** - Scalable RESTful API architecture.
- **MongoDB** - NoSQL database for flexible and asynchronous data storage.
- **JWT** - Secure, stateless user authentication.

## 🚀 Quick Start

### For Windows Users (Zero-Config)
Experience frictionless setup with our included batch scripts:
1. Double-click `setup.bat` to automatically install all frontend/backend dependencies and initialize environments.
2. Double-click `run.bat` to concurrently boot both the client and server.

### Manual Installation (Cross-Platform)

Ensure you have **Node.js** and **MongoDB** installed on your system.

```bash
# 1. Clone the repository
git clone https://github.com/A9Sarthak/RouteCraft.git
cd RouteCraft

# 2. Install concurrent runner globally
npm install -g concurrently

# 3. Install frontend dependencies
npm install

# 4. Install backend dependencies
cd server
npm install

# 5. Configure Environment Variables
cp .env.example .env
# By default, the server expects MongoDB at: mongodb://127.0.0.1:27017/routecraft
cd ..

# 6. Boot the Application!
# Starts Frontend (localhost:5173) and Backend (localhost:5000)
npm run dev:all
```

## 📊 System Architecture
* **Client-Side:** Handles complex state management for drag-and-drop routing and dynamic map rendering, ensuring a buttery-smooth user experience.
* **API Layer:** RESTful endpoints engineered with Express, featuring robust error handling and validation middleware.
* **Database:** MongoDB schema designed for efficient querying of user-specific itineraries and nested route data.

## 🛡️ Security & Performance
- **Zero Known Vulnerabilities:** All NPM audit vulnerabilities have been patched. Dependencies are strictly monitored for production-readiness.
- **Optimized Builds:** Leveraging Vite's Rollup build process for minimized bundle sizes and rapid initial page loads.

---
<p align="center">
  <i>Developed with ❤️ by <a href="https://github.com/A9Sarthak">Sarthak</a>.</i>
</p>
