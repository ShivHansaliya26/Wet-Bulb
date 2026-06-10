import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {
  FiShield,
  FiActivity,
  FiSun,
  FiTool,
  FiGlobe,
} from 'react-icons/fi';

/* ────────────────────────────────────────────────────────────────────────────
 * Danger-level thresholds displayed in the Health Impact section
 * ──────────────────────────────────────────────────────────────────────────── */
const THRESHOLDS = [
  { range: '< 25°C', level: 'Safe', color: '#22c55e', desc: 'Normal conditions' },
  { range: '25 – 27°C', level: 'Caution', color: '#eab308', desc: 'Heat stress begins for strenuous activity' },
  { range: '28 – 30°C', level: 'Hazardous', color: '#f97316', desc: 'Body struggles to cool, heat exhaustion risk' },
  { range: '31 – 32°C', level: 'Dangerous', color: '#ef4444', desc: 'Life-threatening for prolonged exposure' },
  { range: '33 – 35°C', level: 'Extreme Danger', color: '#a855f7', desc: 'Fatal within hours even at rest' },
  { range: '> 35°C', level: 'Unsurvivable', color: '#1e1e1e', desc: 'Human survival limit' },
];

/* ────────────────────────────────────────────────────────────────────────────
 * Real-world usage items for the expandable accordion
 * ──────────────────────────────────────────────────────────────────────────── */
const REAL_WORLD = [
  { icon: FiShield, title: 'Military', text: 'WBGT index guides training intensity decisions and mandatory rest cycles.' },
  { icon: FiActivity, title: 'Sports', text: 'Marathons and outdoor events are cancelled when wet bulb thresholds are exceeded.' },
  { icon: FiSun, title: 'Agriculture', text: 'Farmers use wet bulb readings to protect crops, livestock, and field workers.' },
  { icon: FiTool, title: 'Construction', text: 'Worker safety regulations mandate cooling breaks based on wet bulb temperature.' },
  { icon: FiGlobe, title: 'Climate Science', text: 'Researchers project regional habitability using future wet bulb projections.' },
];

/**
 * WetBulbModal – A full-screen educational overlay explaining wet bulb
 * temperature, danger thresholds, the calculation formula, and real-world usage.
 *
 * Props:
 *   isOpen  – boolean controlling visibility
 *   onClose – callback to close the modal
 */
export default function WetBulbModal({ isOpen, onClose }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── Overlay ────────────────────────────────────────────────── */
        <motion.div
          key="wb-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          {/* ── Modal card ──────────────────────────────────────────── */}
          <motion.div
            key="wb-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto
                       bg-white/15 dark:bg-gray-900/80 backdrop-blur-2xl
                       rounded-3xl border border-white/20 p-8 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full
                         bg-white/10 hover:bg-white/20 transition-colors
                         text-white/70 hover:text-white"
              aria-label="Close modal"
            >
              <FiX className="text-xl" />
            </button>

            {/* Modal title */}
            <h2 className="text-2xl font-bold text-white mb-6">
              Understanding Wet Bulb Temperature
            </h2>

            {/* ─── Section 1 ─────────────────────────────────────────── */}
            <Section title="What is Wet Bulb Temperature?">
              <p className="text-white/70 leading-relaxed">
                Wet bulb temperature is a measurement that combines air temperature
                and humidity to indicate how effectively the human body can cool
                itself through sweating. It represents the lowest temperature a
                surface can reach through evaporative cooling.
              </p>
            </Section>

            {/* ─── Section 2 ─────────────────────────────────────────── */}
            <Section title="Why is it Important?">
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  It's the most accurate indicator of heat stress risk
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  Used by military, sports, and occupational health organisations
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  Determines if outdoor work / exercise is safe
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  Climate change is pushing wet bulb temps to dangerous levels more
                  frequently
                </li>
              </ul>
            </Section>

            {/* ─── Section 3 – Health Impact ─────────────────────────── */}
            <Section title="Health Impact">
              <div className="space-y-2">
                {THRESHOLDS.map((t) => (
                  <div
                    key={t.level}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 rounded-xl bg-white/5
                               px-4 py-2.5 border border-white/5"
                  >
                    {/* Colour dot */}
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    {/* Range + level */}
                    <span className="w-auto sm:w-24 shrink-0 text-sm font-semibold text-white">
                      {t.range}
                    </span>
                    <span
                      className="w-auto sm:w-32 shrink-0 text-xs font-bold uppercase tracking-wide"
                      style={{ color: t.color }}
                    >
                      {t.level}
                    </span>
                    {/* Description */}
                    <span className="text-sm text-white/60 w-full sm:w-auto break-words leading-tight">{t.desc}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ─── Section 4 – The Formula ───────────────────────────── */}
            <Section title="The Formula">
              <div className="formula-card p-5">
                <pre className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
{`Tw ≈ T × atan(0.151977 × √(RH + 8.313659))
   + atan(T + RH)
   − atan(RH − 1.676331)
   + 0.00391838 × RH^(3/2) × atan(0.023101 × RH)
   − 4.686035`}
                </pre>
              </div>

              {/* Variable definitions */}
              <ul className="mt-4 space-y-1.5 text-sm text-white/60">
                <li>
                  <span className="font-semibold text-white/80">Tw</span> = Wet
                  Bulb Temperature (°C)
                </li>
                <li>
                  <span className="font-semibold text-white/80">T</span> = Air
                  Temperature (°C)
                </li>
                <li>
                  <span className="font-semibold text-white/80">RH</span> =
                  Relative Humidity (%)
                </li>
              </ul>
            </Section>

            {/* ─── Section 5 – Real-World Usage (expandable) ─────────── */}
            <div className="mt-6">
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl
                           bg-white/5 hover:bg-white/10 transition-colors
                           px-4 py-3 text-white"
              >
                <span className="text-base font-semibold">Learn More</span>
                {expanded ? (
                  <FiChevronUp className="text-lg text-white/60" />
                ) : (
                  <FiChevronDown className="text-lg text-white/60" />
                )}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    key="real-world"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-3">
                      {REAL_WORLD.map(({ icon: Icon, title, text }) => (
                        <div
                          key={title}
                          className="flex items-start gap-3 rounded-xl
                                     bg-white/5 px-4 py-3 border border-white/5"
                        >
                          <Icon className="text-lg text-blue-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {title}
                            </p>
                            <p className="text-sm text-white/60">{text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Small helper for consistent section headings
 * ──────────────────────────────────────────────────────────────────────────── */
function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-white mb-3">{title}</h3>
      {children}
    </div>
  );
}
