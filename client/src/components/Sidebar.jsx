import { motion } from 'motion/react';
import {
  FiHome,
  FiCloud,
  FiMapPin,
  FiBarChart2,
  FiCalendar,
  FiSettings,
  FiX,
} from 'react-icons/fi';
import { WiThermometer } from 'react-icons/wi';

const NAV_ITEMS = [
  { key: 'home', label: 'Home', Icon: FiHome },
  { key: 'forecast', label: 'Forecast', Icon: FiCloud },
  { key: 'locations', label: 'Locations', Icon: FiMapPin },
  { key: 'analytics', label: 'Analytics', Icon: FiBarChart2 },
  { key: 'calendar', label: 'Calendar', Icon: FiCalendar },
  { key: 'settings', label: 'Settings', Icon: FiSettings },
];

/**
 * Sidebar — Dark navy vertical navigation panel.
 *
 * @param {boolean} isOpen   – Mobile open state
 * @param {Function} onClose – Called to close sidebar on mobile
 */
export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
        {/* ── Brand ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4a3aff] to-[#a29bfe] flex items-center justify-center shadow-lg shadow-[#4a3aff]/30">
              <WiThermometer className="text-white text-xl" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              WetBulb
            </span>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────── */}
        <nav className="flex-1 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              className={`nav-item ${item.key === 'analytics' ? 'active' : ''}`}
            >
              <item.Icon className="nav-icon" />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* ── Bottom badge ──────────────────────────────── */}
        <div className="px-6 pb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-white/40 text-xs">WetBulb Weather</p>
            <p className="text-white/25 text-xs mt-0.5">v2.0 Dashboard</p>
          </div>
        </div>
      </aside>
    </>
  );
}
