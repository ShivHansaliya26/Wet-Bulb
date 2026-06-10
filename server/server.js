import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

app.use(cors());
app.use(express.json());

// ─── Wet Bulb Temperature Calculation (Stull 2011) ───────────────────────────
function calculateWetBulb(tempC, humidity) {
  const T = tempC;
  const RH = humidity;

  const Tw =
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035;

  return Math.round(Tw * 10) / 10;
}

// ─── Wet Bulb Danger Level ───────────────────────────────────────────────────
function getWetBulbLevel(tw) {
  if (tw < 25) return { level: 'Safe', color: '#22c55e', description: 'Normal conditions' };
  if (tw < 27) return { level: 'Caution', color: '#eab308', description: 'Heat stress begins for strenuous activity' };
  if (tw < 30) return { level: 'Hazardous', color: '#f97316', description: 'Body struggles to cool; heat exhaustion risk' };
  if (tw < 32) return { level: 'Dangerous', color: '#ef4444', description: 'Life-threatening for prolonged exposure' };
  if (tw < 35) return { level: 'Extreme Danger', color: '#a855f7', description: 'Fatal within hours even at rest' };
  return { level: 'Unsurvivable', color: '#1f2937', description: 'Human body cannot survive' };
}

// ─── AQI Description ────────────────────────────────────────────────────────
function getAQIInfo(index) {
  if (index <= 1) return { level: 'Good', color: '#22c55e' };
  if (index <= 2) return { level: 'Moderate', color: '#eab308' };
  if (index <= 3) return { level: 'Unhealthy (Sensitive)', color: '#f97316' };
  if (index <= 4) return { level: 'Unhealthy', color: '#ef4444' };
  if (index <= 5) return { level: 'Very Unhealthy', color: '#a855f7' };
  return { level: 'Hazardous', color: '#7f1d1d' };
}

// ─── API Routes ──────────────────────────────────────────────────────────────

// GET /api/weather/:city — Current weather + AQI + wet bulb
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: { key: API_KEY, q: city, aqi: 'yes' },
    });

    const { current, location } = response.data;
    const wetBulbTemp = calculateWetBulb(current.temp_c, current.humidity);
    const wetBulbInfo = getWetBulbLevel(wetBulbTemp);
    const aqiIndex = current.air_quality?.['us-epa-index'] || 1;
    const aqiInfo = getAQIInfo(aqiIndex);

    res.json({
      location: {
        name: location.name,
        region: location.region,
        country: location.country,
        localtime: location.localtime,
        tz_id: location.tz_id,
      },
      current: {
        temp_c: current.temp_c,
        temp_f: current.temp_f,
        feelslike_c: current.feelslike_c,
        feelslike_f: current.feelslike_f,
        humidity: current.humidity,
        wind_kph: current.wind_kph,
        wind_mph: current.wind_mph,
        wind_dir: current.wind_dir,
        wind_degree: current.wind_degree,
        pressure_mb: current.pressure_mb,
        pressure_in: current.pressure_in,
        precip_mm: current.precip_mm,
        vis_km: current.vis_km,
        vis_miles: current.vis_miles,
        uv: current.uv,
        dewpoint_c: current.dewpoint_c || (current.temp_c - ((100 - current.humidity) / 5)),
        cloud: current.cloud,
        is_day: current.is_day,
        condition: {
          text: current.condition.text,
          icon: current.condition.icon,
          code: current.condition.code,
        },
      },
      wetBulb: {
        temp_c: wetBulbTemp,
        ...wetBulbInfo,
      },
      aqi: {
        index: aqiIndex,
        ...aqiInfo,
        pm2_5: current.air_quality?.pm2_5 || null,
        pm10: current.air_quality?.pm10 || null,
        co: current.air_quality?.co || null,
        no2: current.air_quality?.no2 || null,
        o3: current.air_quality?.o3 || null,
        so2: current.air_quality?.so2 || null,
      },
    });
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 404) {
      return res.status(404).json({
        error: 'City not found',
        message: `Could not find weather data for "${req.params.city}". Please check the city name and try again.`,
      });
    }
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Server error', message: 'Failed to fetch weather data.' });
  }
});

// GET /api/forecast/:city — 3-day forecast
app.get('/api/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: { key: API_KEY, q: city, days: 3, aqi: 'yes' },
    });

    const { forecast } = response.data;
    const days = forecast.forecastday.map((day) => ({
      date: day.date,
      maxtemp_c: day.day.maxtemp_c,
      maxtemp_f: day.day.maxtemp_f,
      mintemp_c: day.day.mintemp_c,
      mintemp_f: day.day.mintemp_f,
      avgtemp_c: day.day.avgtemp_c,
      avghumidity: day.day.avghumidity,
      maxwind_kph: day.day.maxwind_kph,
      daily_chance_of_rain: day.day.daily_chance_of_rain,
      daily_chance_of_snow: day.day.daily_chance_of_snow,
      uv: day.day.uv,
      condition: {
        text: day.day.condition.text,
        icon: day.day.condition.icon,
        code: day.day.condition.code,
      },
      // Hourly data for charts
      hours: day.hour.map((h) => ({
        time: h.time,
        temp_c: h.temp_c,
        temp_f: h.temp_f,
        condition: {
          text: h.condition.text,
          icon: h.condition.icon,
          code: h.condition.code,
        },
        wind_kph: h.wind_kph,
        humidity: h.humidity,
        chance_of_rain: h.chance_of_rain,
        chance_of_snow: h.chance_of_snow,
        precip_mm: h.precip_mm,
      })),
    }));

    res.json({ forecast: days });
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    console.error('Forecast API error:', error.message);
    res.status(500).json({ error: 'Server error', message: 'Failed to fetch forecast data.' });
  }
});

// GET /api/astronomy/:city — Sun & Moon data
app.get('/api/astronomy/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(`${BASE_URL}/astronomy.json`, {
      params: { key: API_KEY, q: city },
    });

    const { astronomy, location } = response.data;
    res.json({
      astronomy: {
        sunrise: astronomy.astro.sunrise,
        sunset: astronomy.astro.sunset,
        moonrise: astronomy.astro.moonrise,
        moonset: astronomy.astro.moonset,
        moon_phase: astronomy.astro.moon_phase,
        moon_illumination: astronomy.astro.moon_illumination,
        is_moon_up: astronomy.astro.is_moon_up,
        is_sun_up: astronomy.astro.is_sun_up,
      },
      location: {
        name: location.name,
        localtime: location.localtime,
      },
    });
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    console.error('Astronomy API error:', error.message);
    res.status(500).json({ error: 'Server error', message: 'Failed to fetch astronomy data.' });
  }
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✨ WetBulb Weather server running on http://localhost:${PORT}`);
  if (!API_KEY || API_KEY === 'your_weatherapi_key_here') {
    console.warn('⚠️  No valid WEATHER_API_KEY found. Please set it in server/.env');
  }
});
