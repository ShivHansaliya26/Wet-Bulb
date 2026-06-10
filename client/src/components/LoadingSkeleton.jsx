import { motion } from 'motion/react';

/**
 * LoadingSkeleton — Shimmer placeholder matching the dashboard layout.
 */

function Bone({ className = '', delay = 0 }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={`bg-[--color-border] rounded-xl ${className}`}
    />
  );
}

export default function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Location header */}
      <div>
        <Bone className="h-4 w-28 mb-2" delay={0} />
        <Bone className="h-6 w-56" delay={0.02} />
      </div>

      {/* Hero cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Bone className="h-[200px]" delay={0.05} />
        <Bone className="h-[200px]" delay={0.08} />
      </div>

      {/* Highlights title */}
      <Bone className="h-5 w-40 mt-2" delay={0.1} />

      {/* Highlights grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Bone className="h-32 sm:col-span-2 lg:col-span-2" delay={0.12} />
        <Bone className="h-32" delay={0.15} />
        <Bone className="h-32" delay={0.18} />
        <Bone className="h-32" delay={0.21} />
        <Bone className="h-32" delay={0.24} />
      </div>

      {/* Chart */}
      <Bone className="h-56" delay={0.27} />
    </motion.div>
  );
}
