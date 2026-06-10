import { motion } from 'motion/react';
import { FiWind, FiSun, FiEye } from 'react-icons/fi';
import {
  WiHumidity,
  WiStrongWind,
  WiThermometer,
  WiBarometer,
} from 'react-icons/wi';
import { getAQILevel, getUVLevel, formatTemp } from '../utils/weatherHelpers';

// ─── Shared card wrapper with hover lift ────────────────────────────────────
const CARD_CLASSES =
  'bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 flex flex-col gap-3';

function MetricCard({ children }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={CARD_CLASSES}
    >
      {children}
    </motion.div>
  );
}

// ─── Animation variants ─────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ─── Circular SVG gauge for humidity ────────────────────────────────────────
function CircularGauge({ value, max = 100, color = '#3b82f6', size = 56 }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

// ─── Pressure label helper ──────────────────────────────────────────────────
function getPressureLabel(mb) {
  if (mb < 1000) return 'Low';
  if (mb > 1025) return 'High';
  return 'Normal';
}

/**
 * MetricsGrid — 7 metric dashboard cards in a responsive grid.
 *
 * Props:
 *   weather — { current: { humidity, wind_kph, wind_dir, wind_degree,
 *              pressure_mb, vis_km, uv, dewpoint_c } }
 *   aqi     — { index, level, color, pm2_5, pm10 }
 */
export default function MetricsGrid({ weather, aqi }) {
  if (!weather?.current) return null;

  const {
    humidity,
    wind_kph,
    wind_dir,
    wind_degree,
    pressure_mb,
    vis_km,
    uv,
    dewpoint_c,
  } = weather.current;

  const aqiInfo = getAQILevel(aqi?.index ?? 1);
  const uvInfo = getUVLevel(uv);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
    >
      {/* ── 1. AQI ──────────────────────────────────────────── */}
      <MetricCard>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <FiWind className="text-lg" />
          <span>Air Quality</span>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-3xl font-semibold text-white">
            {aqi?.index ?? '--'}
          </span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full mb-1"
            style={{ backgroundColor: aqiInfo.color + '30', color: aqiInfo.color }}
          >
            {aqiInfo.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(((aqi?.index ?? 0) / 6) * 100, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: aqiInfo.color }}
          />
        </div>
      </MetricCard>

      {/* ── 2. Humidity ──────────────────────────────────────── */}
      <MetricCard>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <WiHumidity className="text-xl" />
          <span>Humidity</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-3xl font-semibold text-white">
            {humidity ?? '--'}%
          </span>

          {/* Circular gauge */}
          <div className="relative flex items-center justify-center">
            <CircularGauge value={humidity ?? 0} color="#38bdf8" />
          </div>
        </div>
      </MetricCard>

      {/* ── 3. UV Index ──────────────────────────────────────── */}
      <MetricCard>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <FiSun className="text-lg" />
          <span>UV Index</span>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-3xl font-semibold text-white">
            {uv ?? '--'}
          </span>
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: uvInfo.color }}
            />
            <span className="text-sm text-white/70">{uvInfo.label}</span>
          </div>
        </div>
      </MetricCard>

      {/* ── 4. Wind Speed ────────────────────────────────────── */}
      <MetricCard>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <WiStrongWind className="text-xl" />
          <span>Wind</span>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="text-3xl font-semibold text-white">
              {wind_kph != null ? Math.round(wind_kph) : '--'}
            </span>
            <span className="text-sm text-white/50 ml-1">km/h</span>
          </div>

          {/* Wind direction arrow */}
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ rotate: wind_degree ?? 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 12 }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
            >
              {/* Simple arrow pointing up — rotated to wind_degree */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-white"
              >
                <path
                  d="M8 2L12 10H4L8 2Z"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
              </svg>
            </motion.div>
            <span className="text-xs text-white/50">{wind_dir ?? '--'}</span>
          </div>
        </div>
      </MetricCard>

      {/* ── 5. Dew Point ─────────────────────────────────────── */}
      <MetricCard>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <WiThermometer className="text-xl" />
          <span>Dew Point</span>
        </div>

        <span className="text-3xl font-semibold text-white">
          {formatTemp(dewpoint_c)}
        </span>
      </MetricCard>

      {/* ── 6. Pressure ──────────────────────────────────────── */}
      <MetricCard>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <WiBarometer className="text-xl" />
          <span>Pressure</span>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-3xl font-semibold text-white">
            {pressure_mb ?? '--'}
          </span>
          <span className="text-sm text-white/50 mb-1">mb</span>
        </div>
        <span className="text-xs text-white/50">
          {pressure_mb != null ? getPressureLabel(pressure_mb) : '--'}
        </span>
      </MetricCard>

      {/* ── 7. Visibility ────────────────────────────────────── */}
      <MetricCard>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <FiEye className="text-lg" />
          <span>Visibility</span>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-3xl font-semibold text-white">
            {vis_km ?? '--'}
          </span>
          <span className="text-sm text-white/50 mb-1">km</span>
        </div>
      </MetricCard>
    </motion.div>
  );
}
