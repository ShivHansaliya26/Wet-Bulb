import { motion } from 'motion/react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle — Glassmorphism circle button that switches dark / light mode.
 *
 * Shows a Sun icon when dark mode is active (click to go light),
 * and a Moon icon when light mode is active (click to go dark).
 */
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="
        relative flex items-center justify-center
        w-11 h-11
        bg-white/10 backdrop-blur-xl
        rounded-full border border-white/20
        text-white text-lg
        shadow-lg shadow-black/5
        cursor-pointer
        transition-colors duration-300
        hover:bg-white/20
      "
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Rotate-in animation when the icon changes */}
      <motion.span
        key={isDark ? 'sun' : 'moon'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? <FiSun /> : <FiMoon />}
      </motion.span>
    </motion.button>
  );
}
