import { motion } from 'motion/react';
import { getWeatherIconUrl, formatTemp, getDayName } from '../utils/weatherHelpers';

/**
 * ForecastPanel — 3 Days Forecast cards for the right sidebar.
 *
 * Props:
 *   forecast — array of { date, maxtemp_c, mintemp_c, condition }
 */
export default function ForecastPanel({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  // Take only first 3 days
  const days = forecast.slice(0, 3);

  return (
    <section>
      <h3 className="text-base font-bold text-[--color-text-primary] mb-4">
        3 Days Forecast
      </h3>

      <div className="flex flex-col gap-3">
        {days.map((day, i) => {
          const iconUrl = getWeatherIconUrl(day.condition?.icon);
          const isEven = i % 2 === 0;

          return (
            <motion.div
              key={day.date || i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="forecast-card"
            >
              {/* Temps badge */}
              <div className={isEven ? 'temp-badge-hot' : 'temp-badge-cold'}>
                <span>↑ {formatTemp(day.maxtemp_c)}</span>
                <span className="mx-1 opacity-70">↓ {formatTemp(day.mintemp_c)}</span>
              </div>

              {/* Day name + condition */}
              <div className="flex-1 text-right">
                <p className="text-sm font-semibold text-[--color-text-primary]">
                  {getDayName(day.date)}
                </p>
                <p className="text-xs text-[--color-text-muted]">
                  {day.condition?.text}
                </p>
              </div>

              {/* Weather icon */}
              {iconUrl && (
                <img
                  src={iconUrl}
                  alt={day.condition?.text || 'weather'}
                  width={40}
                  height={40}
                  className="flex-shrink-0"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
