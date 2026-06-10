import { useState, useMemo } from 'react';
import { motion } from 'motion/react';

/**
 * HourlyChart — Pure SVG line chart showing hourly temperature data.
 *
 * Props:
 *   hourlyData — array of { time, temp_c } (24 entries from WeatherAPI forecast)
 *   forecastDays — array of { date, hours: [...] } for weekly view
 */
export default function HourlyChart({ hourlyData = [], forecastDays = [] }) {
  const [activeTab, setActiveTab] = useState('today');

  // Prepare data based on active tab
  const chartData = useMemo(() => {
    if (activeTab === 'today' && hourlyData.length > 0) {
      // Take every 3rd hour for cleaner chart
      return hourlyData
        .filter((_, i) => i % 3 === 0)
        .map((h) => ({
          label: new Date(h.time).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          }).toLowerCase(),
          temp: Math.round(h.temp_c),
        }));
    }

    if (activeTab === 'week' && forecastDays.length > 0) {
      return forecastDays.map((day) => ({
        label: new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'short',
        }),
        temp: Math.round(day.avgtemp_c ?? day.maxtemp_c ?? 0),
      }));
    }

    return [];
  }, [activeTab, hourlyData, forecastDays]);

  if (chartData.length === 0) return null;

  // Chart dimensions
  const W = 600;
  const H = 200;
  const PADDING = { top: 30, right: 30, bottom: 40, left: 10 };
  const chartW = W - PADDING.left - PADDING.right;
  const chartH = H - PADDING.top - PADDING.bottom;

  // Scale
  const temps = chartData.map((d) => d.temp);
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;
  const tempRange = maxTemp - minTemp || 1;

  const getX = (i) => PADDING.left + (i / (chartData.length - 1)) * chartW;
  const getY = (temp) =>
    PADDING.top + chartH - ((temp - minTemp) / tempRange) * chartH;

  // Build SVG path
  const pathPoints = chartData.map((d, i) => `${getX(i)},${getY(d.temp)}`);
  const linePath = `M ${pathPoints.join(' L ')}`;

  // Area path (fill under line)
  const areaPath = `${linePath} L ${getX(chartData.length - 1)},${
    H - PADDING.bottom
  } L ${PADDING.left},${H - PADDING.bottom} Z`;

  return (
    <section className="chart-area p-5 mt-12">
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-[--color-bg-main] rounded-lg p-0.5">
          <button
            className={`chart-tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            Today
          </button>
          <button
            className={`chart-tab ${activeTab === 'week' ? 'active' : ''}`}
            onClick={() => setActiveTab('week')}
          >
            Week
          </button>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[400px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradient fill under the line */}
            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a3aff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4a3aff" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill="url(#areaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#4a3aff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {/* Data points + labels */}
          {chartData.map((d, i) => (
            <g key={i}>
              {/* Dot */}
              <motion.circle
                cx={getX(i)}
                cy={getY(d.temp)}
                r="4"
                fill="white"
                stroke="#4a3aff"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * i + 0.3, type: 'spring' }}
              />

              {/* Temp label above dot */}
              <text
                x={getX(i)}
                y={getY(d.temp) - 12}
                textAnchor="middle"
                className="text-[10px] font-semibold"
                fill="#1e1e4b"
              >
                {d.temp}°
              </text>

              {/* X-axis label */}
              <text
                x={getX(i)}
                y={H - PADDING.bottom + 20}
                textAnchor="middle"
                className="text-[10px]"
                fill="#a0a5c0"
              >
                {d.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
