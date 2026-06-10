import { useState } from 'react';
import { motion } from 'motion/react';
import { FiInfo } from 'react-icons/fi';
import { WiThermometer } from 'react-icons/wi';
import WetBulbModal from './WetBulbModal';

/**
 * WetBulbSection – Displays the current wet bulb temperature with a
 * colour-coded danger gauge and an info button that opens the educational modal.
 *
 * Props:
 *   wetBulb     – { temp_c, level, color, description }
 *   temperature – current air temperature in °C (number)
 *   humidity    – relative humidity % (number)
 */
export default function WetBulbSection({ wetBulb, temperature, humidity }) {
  const [showModal, setShowModal] = useState(false);

  // Clamp gauge fill between 0 – 100 %
  const gaugePercent = Math.min(Math.max((wetBulb.temp_c / 40) * 100, 0), 100);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <WiThermometer className="text-2xl text-white/80" />
            <h2 className="text-lg font-semibold text-white">
              Wet Bulb Temperature
            </h2>
          </div>

          {/* Info trigger */}
          <button
            onClick={() => setShowModal(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20
                       transition-colors duration-200 text-white/70 hover:text-white"
            aria-label="Learn more about wet bulb temperature"
          >
            <FiInfo className="text-lg" />
          </button>
        </div>

        {/* ── Temperature readout ─────────────────────────────────────── */}
        <div className="flex items-end gap-1 mb-4">
          <span className="text-5xl font-bold text-white tracking-tight">
            {wetBulb.temp_c.toFixed(1)}
          </span>
          <span className="text-xl text-white/60 mb-1">°C</span>
        </div>

        {/* ── Danger gauge (horizontal bar) ───────────────────────────── */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Danger Level
            </span>
            <span className="text-xs text-white/50">{gaugePercent.toFixed(0)}%</span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${gaugePercent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: wetBulb.color }}
            />
          </div>
        </div>

        {/* ── Level badge + description ────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: wetBulb.color }}
          >
            {wetBulb.level}
          </span>
          <p className="text-sm text-white/60">{wetBulb.description}</p>
        </div>

        {/* ── Supplementary info ───────────────────────────────────────── */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">
              Air Temp
            </p>
            <p className="text-sm font-medium text-white">{temperature}°C</p>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">
              Humidity
            </p>
            <p className="text-sm font-medium text-white">{humidity}%</p>
          </div>
        </div>
      </motion.div>

      {/* ── Educational modal ──────────────────────────────────────── */}
      <WetBulbModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
