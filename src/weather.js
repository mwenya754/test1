// Weather utility module
// Handles fetching weather data from OpenWeatherMap API and processing forecast information

// Load API key from environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
// Base URL for OpenWeatherMap API endpoints
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Fetch weather forecast data for a given city
// Parameters: city (string) - name of the city to fetch weather for
// Returns: Promise with raw weather data from API
// Throws: Error if API key is missing or city not found
export async function fetchWeather(city) {
  // Validate that API key is properly configured
  if (!API_KEY || API_KEY === 'demo' || API_KEY === 'your_api_key_here') {
    throw new Error('Missing API key. Set VITE_OPENWEATHER_API_KEY in .env and restart npm run dev.');
  }

  // Make API request to get 5-day forecast data for the city (in metric units)
  const response = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  // Handle API errors with specific error messages
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

// Process raw API response data into a daily forecast summary
// Parameters: data (object) - raw response from fetchWeather API
// Returns: Array of daily forecast objects with temp, condition, and rain probability
export function processForecast(data) {
  // Group forecast data by date to calculate daily averages
  const dailyTemps = {};
  const dailyConditions = {};
  const dailyRain = {};

  // Aggregate all forecast entries (usually 3-hour intervals) by day
  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];  // Extract date portion (YYYY-MM-DD)
    // Initialize arrays for new dates
    if (!dailyTemps[date]) {
      dailyTemps[date] = [];
      dailyConditions[date] = [];
      dailyRain[date] = [];
    }
    dailyTemps[date].push(item.main.temp);
    dailyConditions[date].push(item.weather[0].description);
    dailyRain[date].push(item.pop || 0);
  });

  // Calculate daily averages and dominant weather condition for each day
  const result = Object.keys(dailyTemps).map((date) => {
    const temps = dailyTemps[date];
    // Calculate average temperature for the day
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    // Calculate average rain probability for the day
    const rainProbs = dailyRain[date];
    const avgRain = rainProbs.reduce((a, b) => a + b, 0) / rainProbs.length;
    // Find the most common weather condition for the day
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

// Generate human-readable weather insights and alerts
// Parameters: dailyData (array) - processed daily forecast data from processForecast
// Returns: Array of insight strings highlighting notable weather events
export function generateInsight(dailyData) {
  const insights = [];  // Array to store generated insights
  if (!dailyData || dailyData.length === 0) {
    return insights;
  }

  // Alert for rainy conditions
  const rainDay = dailyData.find((d) => d.rainProbability >= 50);
  if (rainDay) {
    insights.push(`Rain expected on ${formatDayName(rainDay.date)} (${rainDay.rainProbability}% chance)`);
  }

  // Alert for very hot weather (34°C and above)
  const hotDay = dailyData.find((d) => d.temp >= 34);
  if (hotDay) {
    insights.push(`Very hot day expected on ${formatDayName(hotDay.date)} (${hotDay.temp}°C) — stay hydrated!`);
  }

  // Alert for very cold weather (below 5°C)
  const coldDay = dailyData.find((d) => d.temp < 5);
  if (coldDay) {
    insights.push(`Very cold day expected on ${formatDayName(coldDay.date)} (${coldDay.temp}°C) — dress warmly!`);
  }

  // Add top-level weekly temperature highlights
  const warmestDay = dailyData.reduce((warmest, d) => (d.temp > warmest.temp ? d : warmest));
  const coolestDay = dailyData.reduce((coolest, d) => (d.temp < coolest.temp ? d : coolest));
  insights.push(`Warmest day this week: ${formatDayName(warmestDay.date)} (${warmestDay.temp}°C)`);
  insights.push(`Coolest day this week: ${formatDayName(coolestDay.date)} (${coolestDay.temp}°C)`);

  // Find the best day to go outside based on low rain and comfortable temperature (around 22°C)
  const nonRainyDays = dailyData.filter((d) => d.rainProbability <= 30);
  if (nonRainyDays.length > 0) {
    // Find day with lowest rain probability and closest to ideal temperature
    const bestDay = nonRainyDays.reduce((best, d) => {
      const score = d.temp - Math.abs(d.temp - 22);
      const bestScore = best.temp - Math.abs(best.temp - 22);
      return score > bestScore ? d : best;
    });
    insights.push(`Best day to go out: ${formatDayName(bestDay.date)} (${bestDay.temp}°C, ${bestDay.rainProbability}% rain)`);
  } else {
    // If all days have rain, recommend the day with lowest rain probability
    const bestDay = dailyData.reduce((best, d) => {
      return d.rainProbability < best.rainProbability ? d : best;
    });
    insights.push(`All days have some rain chance. Best option: ${formatDayName(bestDay.date)} (${bestDay.rainProbability}% rain)`);
  }

  return insights;
}

// Format date as weekday name only
export function formatDayName(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// Format a date string into a human-readable format
// Parameters: dateStr (string) - date in YYYY-MM-DD format
// Returns: Formatted string like "Monday, Mar 30"
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  // Convert to readable format with day name, month, and date
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}
