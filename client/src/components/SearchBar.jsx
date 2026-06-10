import { useState } from 'react';
import { motion } from 'motion/react';
import { FiSearch } from 'react-icons/fi';
import { LuLoaderCircle } from 'react-icons/lu';

/**
 * SearchBar — Premium glassmorphism search input for city lookup.
 *
 * @param {Function} onSearch  – Called with the trimmed city string
 * @param {boolean}  isLoading – Disables input & shows spinner while true
 */
export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSearch(trimmed);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="relative flex items-center">
        {/* Glass container */}
        <div
          className="
            flex w-full items-center gap-3
            bg-white/10 backdrop-blur-xl
            rounded-2xl border border-white/20
            px-5 py-3.5
            shadow-lg shadow-black/5
            transition-colors duration-300
            focus-within:border-white/40 focus-within:bg-white/15
          "
        >
          {/* Search icon / spinner */}
          <span className="text-white/60 text-xl flex-shrink-0">
            {isLoading ? (
              <LuLoaderCircle className="animate-spin" />
            ) : (
              <FiSearch />
            )}
          </span>

          {/* Text input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Search for a city..."
            className="
              flex-1 bg-transparent outline-none
              text-white text-lg
              placeholder:text-white/50
              disabled:cursor-not-allowed disabled:opacity-60
            "
          />

          {/* Submit button — visible when there's text */}
          {query.trim() && (
            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                bg-white/20 hover:bg-white/30
                text-white rounded-xl px-4 py-2
                text-sm font-medium
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Search
            </motion.button>
          )}
        </div>
      </div>
    </motion.form>
  );
}
