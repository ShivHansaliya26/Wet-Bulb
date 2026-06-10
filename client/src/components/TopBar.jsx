import { useState } from 'react';
import { motion } from 'motion/react';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import { LuLoaderCircle } from 'react-icons/lu';
import { WiThermometer } from 'react-icons/wi';

/**
 * TopBar — Clean top bar with brand, search input, and action icons.
 */
export default function TopBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSearch(trimmed);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="topbar"
    >
      {/* Brand */}
      <div className="topbar-brand">
        <div className="topbar-logo">
          <WiThermometer className="text-white text-xl" />
        </div>
        <span className="topbar-brand-text">WetBulb</span>
      </div>

      {/* Search form — centered, large */}
      <form onSubmit={handleSubmit} className="topbar-search">
        <div className="topbar-search-wrapper">
          <FiSearch className="topbar-search-icon" />
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Search city..."
            className="topbar-search-input"
          />
          {isLoading && (
            <LuLoaderCircle className="topbar-search-spinner" />
          )}
        </div>
      </form>

      {/* Action icons — far right */}
      <div className="topbar-actions">
        <button className="topbar-icon-btn" aria-label="Notifications">
          <FiBell />
          <span className="topbar-notif-dot" />
        </button>
        <button className="topbar-icon-btn" aria-label="Profile">
          <FiUser />
        </button>
        <div className="topbar-avatar">W</div>
      </div>
    </motion.header>
  );
}
