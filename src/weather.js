const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeather(city) {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found. Please check the city name and try again.');
    }
    if (response.status === 401) {
      throw new Error('Invalid API key. Please configure a valid OpenWeatherMap API key.');
    }
    throw new Error(`Failed to fetch weather data (${response.status}).`);
  }
  return response.json();
}

export function processForecast(data) {
  const dailyTemps = {};
  const dailyConditions = {};
  const dailyRain = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyTemps[date]) {
      dailyTemps[date] = [];
      dailyConditions[date] = [];
      dailyRain[date] = [];
    }
    dailyTemps[date].push(item.main.temp);
    dailyConditions[date].push(item.weather[0].description);
    dailyRain[date].push(item.pop || 0);
  });

  const result = Object.keys(dailyTemps).map((date) => {
    const temps = dailyTemps[date];
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const rainProbs = dailyRain[date];
    const avgRain = rainProbs.reduce((a, b) => a + b, 0) / rainProbs.length;
    const conditionCounts = {};
    dailyConditions[date].forEach((c) => {
      conditionCounts[c] = (conditionCounts[c] || 0) + 1;
    });
    const dominantCondition = Object.keys(conditionCounts).reduce((a, b) =>
      conditionCounts[a] > conditionCounts[b] ? a : b
    );
    return {
      date,
      temp: Math.round(avgTemp * 10) / 10,
      condition: dominantCondition,
      rainProbability: Math.round(avgRain * 100),
    };
  });

  return result.slice(0, 7);
}

export function generateInsight(dailyData) {
  const insights = [];

  const rainDay = dailyData.find((d) => d.rainProbability > 60);
  if (rainDay) {
    insights.push(`🌧️ Rain expected on ${formatDate(rainDay.date)} (${rainDay.rainProbability}% chance)`);
  }

  const hotDay = dailyData.find((d) => d.temp > 35);
  if (hotDay) {
    insights.push(`🔥 Very hot day expected on ${formatDate(hotDay.date)} (${hotDay.temp}°C) — stay hydrated!`);
  }

  const coldDay = dailyData.find((d) => d.temp < 5);
  if (coldDay) {
    insights.push(`🥶 Very cold day expected on ${formatDate(coldDay.date)} (${coldDay.temp}°C) — dress warmly!`);
  }

  const nonRainyDays = dailyData.filter((d) => d.rainProbability <= 30);
  if (nonRainyDays.length > 0) {
    const bestDay = nonRainyDays.reduce((best, d) => {
      const score = d.temp - Math.abs(d.temp - 22);
      const bestScore = best.temp - Math.abs(best.temp - 22);
      return score > bestScore ? d : best;
    });
    insights.push(`✅ Best day to go out: ${formatDate(bestDay.date)} (${bestDay.temp}°C)`);
  } else {
    const bestDay = dailyData.reduce((best, d) => {
      return d.rainProbability < best.rainProbability ? d : best;
    });
    insights.push(`🌂 All days have some rain chance. Best option: ${formatDate(bestDay.date)} (${bestDay.rainProbability}% rain)`);
  }

  return insights;
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}
