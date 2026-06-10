import { motion } from 'motion/react';
import { FiPlus, FiSettings } from 'react-icons/fi';
import {
  getLargeWeatherIconUrl,
  formatTemp,
  formatLocalTime,
  getGradientClass,
} from '../utils/weatherHelpers';

/**
 * MainWeatherCard — Hero display with current conditions + Air Quality & UV.
 *
 * Props:
 *   weather  — { location, current, aqi } from WeatherAPI
 *   forecast — { forecast: [{ date, maxtemp_c, mintemp_c, condition }] }
 */
export default function MainWeatherCard({ weather, forecast }) {
  if (!weather?.current || !weather?.location) return null;

  const { location, current } = weather;
  const iconUrl = getLargeWeatherIconUrl(current.condition?.icon);

  // Determine gradient class based on weather
  const gradientClass = getGradientClass(
    current.condition?.code,
    current.is_day
  );

  // Format date
  const dateObj = new Date(location.localtime);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const time = formatLocalTime(location.localtime);

  return (
    <section>
      {/* Location header */}
      <div className="flex items-center justify-between mb-4">
        <div className="min-w-0 pr-4">
          <p className="text-sm text-[--color-text-muted]">Current Location</p>
          <h1 className="text-xl font-bold text-[--color-text-primary] break-words whitespace-normal">
            {location.name}, {location.region ? `${location.region}, ` : ''}
            {location.country}
          </h1>
        </div>
        <button
          className="p-2 rounded-lg hover:bg-[--color-bg-main] text-[--color-text-muted] transition-colors"
          aria-label="Location settings"
        >
          <FiSettings className="text-lg" />
        </button>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hero weather card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`weather-hero p-6 relative ${gradientClass}`}
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Top row: icon + temp */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {iconUrl && (
                  <img
                    src={iconUrl}
                    alt={current.condition?.text || 'Weather'}
                    className="w-16 h-16 drop-shadow-lg"
                    draggable={false}
                  />
                )}
                <div>
                  <span className="text-5xl font-light text-white leading-none">
                    {Math.round(current.temp_c)}
                  </span>
                  <span className="text-xl text-white/70 align-top">°C</span>
                </div>
              </div>

              {/* Date + time */}
              <div className="text-right min-w-0 ml-4">
                <p className="text-sm text-white/80 font-medium break-words">
                  {dayName}, {time}
                </p>
                <p className="text-xs text-white/60 mt-0.5 break-words">
                  {current.condition?.text}
                </p>
              </div>
            </div>

            {/* Bottom - condition / feelslike */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-6 text-sm text-white/70">
              <span className="break-words">Feels like {formatTemp(current.feelslike_c)}</span>
              <span className="w-px h-3 bg-white/30 hidden sm:block" />
              <span className="break-words">Humidity {current.humidity}%</span>
            </div>
          </div>
        </motion.div>

        {/* Air Quality & UV Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="highlight-card flex flex-col justify-center gap-6"
        >
          {/* Air Quality */}
          <div>
            <h3 className="text-sm font-medium text-[--color-text-secondary] flex items-center gap-2 mb-2">
              <span className="text-lg">🍃</span> Air Quality
            </h3>
            <div className="flex items-end gap-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: weather.aqi?.color || '#22c55e' }}
              >
                {weather.aqi?.level || 'Good'}
              </span>
              <span className="text-sm text-[--color-text-muted] mb-0.5">
                Index: {weather.aqi?.index || 1}
              </span>
            </div>
          </div>

          {/* UV Index */}
          <div>
            <h3 className="text-sm font-medium text-[--color-text-secondary] flex items-center gap-2 mb-2">
              <span className="text-lg">☀️</span> UV Index
            </h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-[--color-text-primary] leading-none">
                {current.uv || 0}
              </span>
              <span className="text-sm text-[--color-text-muted] mb-1">
                {current.uv <= 2 ? 'Low' : current.uv <= 5 ? 'Moderate' : current.uv <= 7 ? 'High' : 'Very High'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
