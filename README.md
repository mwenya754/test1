# Weather Trend Planner

A lightweight React web application that helps users analyze upcoming weather trends for a specific city and determine the best day for outdoor activities.

## Features

- 🔍 **City Search** – Enter any city name to fetch its weather forecast
- 🌡️ **Current Weather** – Displays city name, current temperature, and weather condition
- 📈 **Temperature Trend Chart** – Line chart showing temperature trends for the next 5–7 days (powered by Chart.js)
- 💡 **Smart Insights** – Automatically generates insights such as:
  - Best day to go out
  - Rain warnings (when probability > 60%)
  - Heat warnings (when temperature > 35°C)
  - Cold warnings (when temperature < 5°C)
- 📅 **Daily Forecast Cards** – Shows average temperature, condition, and rain probability per day

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Chart.js](https://www.chartjs.org/) via [react-chartjs-2](https://react-chartjs-2.js.org/)
- [OpenWeatherMap API](https://openweathermap.org/api)

## Getting Started

### 1. Get an API Key

Sign up for a free API key at [openweathermap.org](https://openweathermap.org/api).

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and replace `your_api_key_here` with your OpenWeatherMap API key:

```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run in Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── App.jsx       # Main application component
├── App.css       # Application styles
├── weather.js    # API fetch, data transformation, and insight generation
├── index.css     # Global styles
└── main.jsx      # Entry point
```

