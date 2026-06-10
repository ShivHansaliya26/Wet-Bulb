/**
 * Weather Helpers — Gradient mapping, icon selection, formatters
 */

// ─── Weather Condition → Background Gradient Class ──────────────────────────
export function getGradientClass(conditionCode, isDay) {
  if (!isDay) return 'gradient-night';

  // WeatherAPI condition codes: https://www.weatherapi.com/docs/weather_conditions.json
  // Sunny / Clear
  if ([1000].includes(conditionCode)) return 'gradient-sunny';
  // Partly cloudy
  if ([1003].includes(conditionCode)) return 'gradient-default';
  // Cloudy / Overcast
  if ([1006, 1009].includes(conditionCode)) return 'gradient-cloudy';
  // Mist / Fog
  if ([1030, 1135, 1147].includes(conditionCode)) return 'gradient-cloudy';
  // Rain / Drizzle
  if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(conditionCode)) return 'gradient-rainy';
  // Snow / Sleet / Ice
  if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(conditionCode)) return 'gradient-snowy';
  // Thunderstorm
  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) return 'gradient-stormy';

  return 'gradient-default';
}

// ─── Format Temperature ─────────────────────────────────────────────────────
export function formatTemp(temp, unit = 'C') {
  if (temp === null || temp === undefined) return '--';
  return `${Math.round(temp)}°${unit}`;
}

// ─── Format Date ────────────────────────────────────────────────────────────
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Format Day Name ────────────────────────────────────────────────────────
export function getDayName(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(dateStr + 'T00:00:00');
  compareDate.setHours(0, 0, 0, 0);

  if (compareDate.getTime() === today.getTime()) return 'Today';

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (compareDate.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// ─── Format Time ────────────────────────────────────────────────────────────
export function formatLocalTime(localtime) {
  if (!localtime) return '';
  const date = new Date(localtime);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// ─── AQI Descriptions ──────────────────────────────────────────────────────
export const AQI_LEVELS = [
  { max: 1, label: 'Good', color: '#22c55e', bg: 'bg-green-500' },
  { max: 2, label: 'Moderate', color: '#eab308', bg: 'bg-yellow-500' },
  { max: 3, label: 'Unhealthy (Sensitive)', color: '#f97316', bg: 'bg-orange-500' },
  { max: 4, label: 'Unhealthy', color: '#ef4444', bg: 'bg-red-500' },
  { max: 5, label: 'Very Unhealthy', color: '#a855f7', bg: 'bg-purple-500' },
  { max: 6, label: 'Hazardous', color: '#7f1d1d', bg: 'bg-red-900' },
];

export function getAQILevel(index) {
  return AQI_LEVELS.find(l => index <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

// ─── UV Index Descriptions ──────────────────────────────────────────────────
export function getUVLevel(uv) {
  if (uv <= 2) return { label: 'Low', color: '#22c55e' };
  if (uv <= 5) return { label: 'Moderate', color: '#eab308' };
  if (uv <= 7) return { label: 'High', color: '#f97316' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#a855f7' };
}

// ─── Wet Bulb Danger Colors ─────────────────────────────────────────────────
export function getWetBulbColor(tw) {
  if (tw < 25) return '#22c55e';
  if (tw < 27) return '#eab308';
  if (tw < 30) return '#f97316';
  if (tw < 32) return '#ef4444';
  if (tw < 35) return '#a855f7';
  return '#1f2937';
}

// ─── Wind Direction Arrow Rotation ──────────────────────────────────────────
export function getWindRotation(degree) {
  return degree || 0;
}

// ─── Weather Icon URL (from WeatherAPI CDN) ─────────────────────────────────
export function getWeatherIconUrl(iconPath) {
  if (!iconPath) return '';
  // WeatherAPI returns "//cdn.weatherapi.com/weather/64x64/day/116.png"
  // Ensure https prefix
  return iconPath.startsWith('//') ? `https:${iconPath}` : iconPath;
}

// ─── Get larger weather icon (128x128) ──────────────────────────────────────
export function getLargeWeatherIconUrl(iconPath) {
  if (!iconPath) return '';
  const url = iconPath.startsWith('//') ? `https:${iconPath}` : iconPath;
  return url.replace('64x64', '128x128');
}
