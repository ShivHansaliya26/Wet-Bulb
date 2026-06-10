import { motion } from 'motion/react';
import { WiSunrise, WiSunset, WiMoonrise, WiMoonset } from 'react-icons/wi';

// ─── Animation Variants ─────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ─── Card Data Builder ──────────────────────────────────────────────────────
function getCelestialCards(astronomy) {
  return [
    {
      key: 'sunrise',
      label: 'Sunrise',
      time: astronomy.sunrise,
      Icon: WiSunrise,
      iconClass: 'text-amber-400 celestial-glow',
    },
    {
      key: 'sunset',
      label: 'Sunset',
      time: astronomy.sunset,
      Icon: WiSunset,
      iconClass: 'text-orange-400 celestial-glow',
    },
    {
      key: 'moonrise',
      label: 'Moonrise',
      time: astronomy.moonrise,
      Icon: WiMoonrise,
      iconClass: 'text-blue-200 moon-glow',
    },
    {
      key: 'moonset',
      label: 'Moonset',
      time: astronomy.moonset,
      Icon: WiMoonset,
      iconClass: 'text-blue-300 moon-glow',
    },
  ];
}

// ─── SunMoonSection Component ───────────────────────────────────────────────
export default function SunMoonSection({ astronomy }) {
  if (!astronomy) return null;

  const cards = getCelestialCards(astronomy);

  return (
    <section className="w-full">
      {/* Section Title */}
      <h2 className="text-xl font-bold text-white mb-4">Sun &amp; Moon</h2>

      {/* 2×2 Responsive Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card) => (
          <motion.div
            key={card.key}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 flex flex-col items-center text-center"
            variants={cardVariants}
            whileHover={{ y: -3 }}
          >
            {/* Floating Icon */}
            <card.Icon
              className={`text-4xl animate-float ${card.iconClass}`}
            />

            {/* Time */}
            <p className="text-white text-lg font-semibold mt-3">
              {card.time || '--'}
            </p>

            {/* Label */}
            <p className="text-white/60 text-sm mt-1">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Moon Phase & Illumination Badge */}
      <div className="flex justify-center mt-5">
        <div className="bg-white/10 backdrop-blur-xl rounded-full border border-white/20 px-5 py-2 flex items-center gap-3">
          <span className="text-white text-sm font-medium">
            🌙 {astronomy.moon_phase}
          </span>
          <span className="w-px h-4 bg-white/30" />
          <span className="text-white/70 text-sm">
            {astronomy.moon_illumination}% illuminated
          </span>
        </div>
      </div>
    </section>
  );
}
