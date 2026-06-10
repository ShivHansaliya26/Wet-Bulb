import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchAllWeatherData } from './utils/api';
import DashboardLayout from './components/DashboardLayout';
import MainWeatherCard from './components/MainWeatherCard';
import HighlightsGrid from './components/HighlightsGrid';
import HourlyChart from './components/HourlyChart';
import RainChancePanel from './components/RainChancePanel';
import ForecastPanel from './components/ForecastPanel';
import WetBulbModal from './components/WetBulbModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorDisplay from './components/ErrorDisplay';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showWetBulbModal, setShowWetBulbModal] = useState(false);

  const handleSearch = useCallback(async (city) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await fetchAllWeatherData(city);
      setWeatherData(data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to fetch weather data. Please try again.';
      setError(message);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Extract data for components ──────────────────────────────
  const weather = weatherData?.weather;
  const forecast = weatherData?.forecast;
  const astronomy = weatherData?.astronomy?.astronomy;

  // Hourly data from the first forecast day
  const hourlyData = forecast?.forecast?.[0]?.hours || [];
  const forecastDays = forecast?.forecast || [];

  // ─── Center Panel Content ─────────────────────────────────────
  const mainContent = (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingSkeleton />
        </motion.div>
      ) : error ? (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="error-state"
        >
          <ErrorDisplay
            message={error}
            onRetry={() => {
              /* User can search again */
            }}
          />
        </motion.div>
      ) : weatherData ? (
        <motion.div
          key="weather"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hero Weather Card */}
          <MainWeatherCard weather={weather} forecast={forecast} />

          {/* Today's Highlights (with Wet Bulb) */}
          <HighlightsGrid
            weather={weather}
            astronomy={astronomy}
            wetBulb={weather?.wetBulb}
            onWetBulbInfo={() => setShowWetBulbModal(true)}
          />

          {/* Hourly Temperature Chart */}
          <HourlyChart
            hourlyData={hourlyData}
            forecastDays={forecastDays}
          />
        </motion.div>
      ) : !hasSearched ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="welcome-state"
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌤️
          </motion.div>
          <h2 className="text-2xl font-semibold text-[--color-text-primary]">
            Search for a city to get started
          </h2>
          <p className="text-[--color-text-muted] mt-3 max-w-md">
            Get real-time weather data, wet bulb temperature analysis,
            air quality metrics, and more.
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  // ─── Right Panel Content ──────────────────────────────────────
  const rightPanel = weatherData ? (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Chance of Rain */}
      <RainChancePanel hourlyData={hourlyData} />

      {/* 3 Days Forecast */}
      <ForecastPanel forecast={forecastDays} />
    </motion.div>
  ) : null;

  return (
    <>
      <DashboardLayout
        onSearch={handleSearch}
        isLoading={isLoading}
        mainContent={mainContent}
        rightPanel={rightPanel}
      />

      {/* Wet Bulb Modal */}
      <WetBulbModal
        isOpen={showWetBulbModal}
        onClose={() => setShowWetBulbModal(false)}
      />
    </>
  );
}

export default App;
