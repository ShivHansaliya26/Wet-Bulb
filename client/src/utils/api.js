import axios from 'axios';

const api = axios.create({
  baseURL: 'https://wet-bulb.onrender.com',
  timeout: 10000,
});

/**
 * Fetch all weather data for a city in parallel
 * Returns: { weather, forecast, astronomy }
 */
export async function fetchAllWeatherData(city) {
  const encodedCity = encodeURIComponent(city);

  const [weatherRes, forecastRes, astronomyRes] = await Promise.all([
    api.get(`/weather/${encodedCity}`),
    api.get(`/forecast/${encodedCity}`),
    api.get(`/astronomy/${encodedCity}`),
  ]);

  return {
    weather: weatherRes.data,
    forecast: forecastRes.data,
    astronomy: astronomyRes.data,
  };
}

export default api;
