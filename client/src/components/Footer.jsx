export default function Footer() {
  return (
    <footer className="mt-12 pt-6 pb-2 border-t border-[--color-border] flex flex-col items-center justify-center">
      <p className="text-sm font-medium text-[--color-text-secondary]">
        © {new Date().getFullYear()} WetBulb Weather
      </p>
      <p className="text-xs text-[--color-text-muted] mt-1">
        Data provided by WeatherAPI.com • Real-time Weather & Wet Bulb Analysis
      </p>
    </footer>
  );
}
