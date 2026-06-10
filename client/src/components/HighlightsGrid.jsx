import { motion } from 'motion/react';
import { WiThermometer, WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';
import { FiDroplet, FiInfo } from 'react-icons/fi';

// ─── Animation variants ─────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/**
 * HighlightsGrid — "Today's Highlights" with 5 cards including Wet Bulb.
 *
 * Props:
 *   weather   — { current: { humidity, precip_mm, wind_kph, wind_dir } }
 *   astronomy — { sunrise, sunset }
 *   wetBulb   — { temp_c, level, color, description }
 *   onWetBulbInfo — callback to open info modal
 */
export default function HighlightsGrid({ weather, astronomy, wetBulb, onWetBulbInfo }) {
  if (!weather?.current) return null;

  const { humidity, precip_mm, wind_kph, wind_dir } = weather.current;
  const gaugePercent = wetBulb ? Math.min(Math.max((wetBulb.temp_c / 40) * 100, 0), 100) : 0;

  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold text-[--color-text-primary] mb-4">
        Today's Highlights
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* ── 1. Wet Bulb Temperature (prominent, spans 2 cols on lg) ──── */}
        {wetBulb && (
          <motion.div
            variants={cardVariants}
            className="highlight-card sm:col-span-2 lg:col-span-2 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <WiThermometer className="text-2xl text-[--color-accent]" />
                <span className="text-sm font-medium text-[--color-text-secondary]">
                  Wet Bulb Temperature
                </span>
              </div>
              <button
                onClick={onWetBulbInfo}
                className="p-1.5 rounded-lg hover:bg-[--color-bg-main] text-[--color-text-muted] transition-colors"
                aria-label="Learn more about wet bulb temperature"
              >
                <FiInfo className="text-sm" />
              </button>
            </div>

            <div className="flex items-center gap-6">
              {/* Temperature readout */}
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-[--color-text-primary]">
                  {wetBulb.temp_c.toFixed(1)}
                </span>
                <span className="text-lg text-[--color-text-muted] mb-1">°C</span>
              </div>

              {/* Level badge */}
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: wetBulb.color }}
              >
                {wetBulb.level}
              </span>
            </div>

            {/* Gauge bar */}
            <div className="mt-3">
              <div className="wetbulb-gauge-track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${gaugePercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  className="wetbulb-gauge-fill"
                  style={{ backgroundColor: wetBulb.color }}
                />
              </div>
              <p className="text-xs text-[--color-text-muted] mt-2 break-words whitespace-normal leading-relaxed">
                {wetBulb.description}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── 2. Precipitation ──────────────────────────────────────── */}
        <motion.div variants={cardVariants} className="highlight-card">
          <div className="flex items-center gap-2 mb-3">
            <FiDroplet className="text-lg text-blue-500" />
            <span className="text-sm font-medium text-[--color-text-secondary]">
              Precipitation
            </span>
          </div>
          <p className="text-3xl font-bold text-[--color-text-primary]">
            {precip_mm ?? 0}
            <span className="text-sm font-normal text-[--color-text-muted] ml-1">mm</span>
          </p>
        </motion.div>

        {/* ── 3. Humidity ───────────────────────────────────────────── */}
        <motion.div variants={cardVariants} className="highlight-card">
          <div className="flex items-center gap-2 mb-3">
            <WiHumidity className="text-xl text-cyan-500" />
            <span className="text-sm font-medium text-[--color-text-secondary]">
              Humidity
            </span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-[--color-text-primary]">
              {humidity ?? '--'}
              <span className="text-sm font-normal text-[--color-text-muted] ml-0.5">%</span>
            </p>
            {/* Mini circular gauge */}
            <svg width="44" height="44" className="transform -rotate-90">
              <circle
                cx="22" cy="22" r="18"
                fill="none" stroke="#e8eaf0" strokeWidth="4"
              />
              <circle
                cx="22" cy="22" r="18"
                fill="none" stroke="#06b6d4" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - (humidity ?? 0) / 100)}
                className="transition-all duration-700 ease-out"
              />
            </svg>
          </div>
        </motion.div>

        {/* ── 4. Wind ──────────────────────────────────────────────── */}
        <motion.div variants={cardVariants} className="highlight-card">
          <div className="flex items-center gap-2 mb-3">
            <WiStrongWind className="text-xl text-indigo-500" />
            <span className="text-sm font-medium text-[--color-text-secondary]">
              Wind
            </span>
          </div>
          <p className="text-3xl font-bold text-[--color-text-primary]">
            {wind_kph != null ? Math.round(wind_kph) : '--'}
            <span className="text-sm font-normal text-[--color-text-muted] ml-1">km/h</span>
          </p>
          <p className="text-xs text-[--color-text-muted] mt-1">
            Direction: {wind_dir ?? '--'}
          </p>
        </motion.div>

        {/* ── 5. Sunrise & Sunset ──────────────────────────────────── */}
        <motion.div variants={cardVariants} className="highlight-card">
          <div className="flex items-center gap-2 mb-3">
            <WiSunrise className="text-xl text-amber-500" />
            <span className="text-sm font-medium text-[--color-text-secondary]">
              Sunrise & Sunset
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <WiSunrise className="text-lg text-amber-400" />
                <span className="text-sm font-semibold text-[--color-text-primary]">
                  {astronomy?.sunrise || '--'}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <WiSunset className="text-lg text-orange-400" />
                <span className="text-sm font-semibold text-[--color-text-primary]">
                  {astronomy?.sunset || '--'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
