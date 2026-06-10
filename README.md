<<<<<<< HEAD
# 🌡️ WetBulb Weather

A premium, full-stack weather web application featuring real-time weather data with wet bulb temperature analysis, air quality metrics, and beautiful glassmorphism UI.

## Features

- 🔍 **City Weather Search** — Real-time weather data for any city
- 🌡️ **Wet Bulb Temperature** — Calculated using the Stull (2011) formula with danger level indicators
- 📊 **Detailed Metrics** — AQI, Humidity, UV Index, Wind, Dew Point, Pressure, Visibility
- 🌅 **Sun & Moon Data** — Sunrise, Sunset, Moonrise, Moonset, Moon Phase
- 📅 **3-Day Forecast** — Daily weather predictions with temperature ranges
- 🌓 **Dark/Light Mode** — Toggle with system preference detection
- ✨ **Glassmorphism UI** — Modern frosted glass design with smooth animations
- 📱 **Fully Responsive** — Mobile, tablet, and desktop optimized

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| Backend | Node.js + Express.js |
| API | WeatherAPI.com |

## Getting Started

### Prerequisites

- Node.js 18+
- A free API key from [WeatherAPI.com](https://www.weatherapi.com/)

### Setup

1. **Clone the repository**

2. **Set up the backend**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and add your WeatherAPI.com API key
   npm install
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Open the app**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/weather/:city` | Current weather + AQI + wet bulb temp |
| `GET /api/forecast/:city` | 3-day forecast |
| `GET /api/astronomy/:city` | Sun & moon data |

## Wet Bulb Temperature Formula

The app uses the **Stull (2011)** approximation:

```
Tw ≈ T × atan(0.151977 × √(RH + 8.313659))
   + atan(T + RH)
   − atan(RH − 1.676331)
   + 0.00391838 × RH^(3/2) × atan(0.023101 × RH)
   − 4.686035
```

Where T = temperature (°C), RH = relative humidity (%).

## License

MIT
=======
# Wet-Bulb
Weather Website
>>>>>>> bad64460eb7f88910c2719704d0fe04c5e897303
