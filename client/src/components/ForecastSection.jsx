import { motion } from 'motion/react';
import { getDayName, getWeatherIconUrl, formatTemp } from '../utils/weatherHelpers';

// ─── Animation Variants ─────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ─── Temperature Bar ────────────────────────────────────────────────────────
// Renders a thin gradient bar representing the temperature range.
// The filled portion is proportional to (max - min) mapped onto a
// reasonable scale (0–50 °C range).
function TempBar({ minTemp, maxTemp }) {
  const SCALE_MIN = 0;
  const SCALE_MAX = 50;
  const range = SCALE_MAX - SCALE_MIN;

  // Clamp values to scale
  const left = ((Math.max(minTemp, SCALE_MIN) - SCALE_MIN) / range) * 100;
  const right = ((Math.min(maxTemp, SCALE_MAX) - SCALE_MIN) / range) * 100;

  return (
    <div className="w-full h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          marginLeft: `${left}%`,
          width: `${right - left}%`,
          background: 'linear-gradient(to right, #60a5fa, #f97316)',
        }}
      />
    </div>
  );
}

// ─── ForecastSection Component ──────────────────────────────────────────────
export default function ForecastSection({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <section className="w-full">
      {/* Section Title */}
      <h2 className="text-xl font-bold text-white mb-4">Forecast</h2>

      {/* Horizontally scrollable on mobile, equal-width row on desktop */}
      <motion.div
        className="flex gap-4 overflow-x-auto forecast-scroll pb-2 md:grid md:grid-cols-3 lg:grid-cols-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {forecast.map((day, index) => (
          <motion.div
            key={day.date || index}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 min-w-[160px] flex flex-col items-center text-center flex-shrink-0 md:flex-shrink"
            variants={cardVariants}
            whileHover={{ y: -3, scale: 1.02 }}
          >
            {/* Day Name */}
            <p className="text-white font-semibold text-sm">
              {getDayName(day.date)}
            </p>

            {/* Weather Icon */}
            <img
              src={getWeatherIconUrl(day.condition?.icon)}
              alt={day.condition?.text || 'weather'}
              width={64}
              height={64}
              className="my-2"
            />

            {/* Condition Text */}
            <p className="text-white/70 text-xs leading-tight mb-2">
              {day.condition?.text}
            </p>

            {/* Temperature (Max / Min) */}
            <p className="text-white text-sm">
              <span className="font-bold">
                {formatTemp(day.maxtemp_c)}
              </span>
              <span className="text-white/60 mx-1">/</span>
              <span className="text-white/60">
                {formatTemp(day.mintemp_c)}
              </span>
            </p>

            {/* Gradient Temperature Bar */}
            <TempBar minTemp={day.mintemp_c} maxTemp={day.maxtemp_c} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
