import { motion } from 'motion/react';
import { FiAlertCircle } from 'react-icons/fi';

/**
 * ErrorDisplay — Friendly error card with retry action.
 *
 * @param {string}   message – The error message to display
 * @param {Function} onRetry – Callback when the user clicks "Try Again"
 */
export default function ErrorDisplay({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="
        flex flex-col items-center text-center
        max-w-md mx-auto
        dash-card px-8 py-10
      "
    >
      {/* Alert icon */}
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <FiAlertCircle className="text-5xl text-orange-400 mb-4" />
      </motion.div>

      {/* Error message */}
      <h2 className="text-xl font-semibold text-[--color-text-primary] mb-2">
        Something went wrong
      </h2>
      <p className="text-[--color-text-secondary] mb-1">{message}</p>
      <p className="text-[--color-text-muted] text-sm mb-6">
        Check the city name and try again
      </p>

      {/* Retry button */}
      {onRetry && (
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            bg-[--color-accent] hover:bg-[--color-accent]/90
            text-white font-medium
            rounded-xl px-6 py-2.5
            transition-colors duration-200
            cursor-pointer
          "
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}
