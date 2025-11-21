# 🌦️ Bright Weather App
A lightweight React app for checking weather by city, featuring Redux Toolkit + RTK Query for state management and API calls.

---

## ⚙️ Prerequisites

Before running the app, you'll need:

### ✅ **Node.js + npm**
This project uses **npm** (Node Package Manager) to install and run dependencies.

- Check if you already have them installed:

node -v
npm -v

If those commands return version numbers, you're good to go.

❌ Don't have Node/npm installed?

Download and install the LTS version of Node.js (which includes npm):

👉 https://nodejs.org/en/download/

After installation, verify again:

node -v
npm -v

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

---

## 📦 1. Install Dependencies

Make sure you're in the project root, then run:

npm install

## 🔑 2. Environment Variables

Create a local .env file from the provided template:

cp .env.example .env

Open the new .env file and set the OpenWeather API key to the following:

REACT_APP_OPENWEATHER_KEY=32519de6c3f6e782267483ee4bc43b2b

## ▶️ 3. Run the Development Server

Start the local dev server: 

npm start

Provided the port is available, the app will be available at:

http://localhost:3000

## 🧪 4. Running Tests

This project uses Jest and React Testing Library.

Run all tests:

npm test