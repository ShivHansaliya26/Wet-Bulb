import { motion } from 'motion/react';
import { FiSliders } from 'react-icons/fi';

/**
 * RainChancePanel — Horizontal bar chart showing rain probability by hour.
 *
 * Props:
 *   hourlyData — array of { time, chance_of_rain } from forecast hours
 */
export default function RainChancePanel({ hourlyData = [] }) {
  // Pick key hours: 3am, 6am, 9am, 12pm, 3pm, 6pm, 9pm, 12am
  const keyHours = [3, 6, 9, 12, 15, 18, 21, 0];

  const rainData = keyHours
    .map((h) => {
      const entry = hourlyData.find((d) => {
        const hour = new Date(d.time).getHours();
        return hour === h;
      });
      return {
        hour: h,
        label: formatHour(h),
        chance: entry?.chance_of_rain ?? 0,
      };
    })
    .reverse(); // Show latest at top

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-[--color-text-primary]">
          Chance of Rain
        </h3>
        <FiSliders className="text-[--color-text-muted] text-lg" />
      </div>

      {/* Rain bars */}
      <div className="flex flex-col gap-3.5">
        {rainData.map((item, i) => (
          <motion.div
            key={item.hour}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            {/* Time label */}
            <span className="text-xs font-medium text-[--color-text-secondary] w-12 text-right">
              {item.label}
            </span>

            {/* Bar track */}
            <div className="flex-1 rain-bar-track">
              <motion.div
                className="rain-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${item.chance}%` }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
              />
            </div>

            {/* Percentage */}
            <span className="text-xs text-[--color-text-muted] w-8">
              {item.chance}%
            </span>
          </motion.div>
        ))}
      </div>

      {/* Scale */}
      <div className="flex justify-between mt-3 text-[10px] text-[--color-text-muted]">
        <span>Sunny</span>
        <span>Rainy</span>
        <span>Heavy Rain</span>
      </div>
    </section>
  );
}

function formatHour(h) {
  if (h === 0) return '12 am';
  if (h === 12) return '12 pm';
  if (h < 12) return `${h.toString().padStart(2, '0')} am`;
  return `${(h - 12).toString().padStart(2, '0')} pm`;
}
