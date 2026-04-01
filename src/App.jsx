import { useState } from 'react';
import { fetchWeather, processForecast, generateInsight } from './weather';
import HeroHeader from './components/HeroHeader';
import SearchBar from './components/SearchBar';
import ErrorAlert from './components/ErrorAlert';
import LoadingState from './components/LoadingState';
import CurrentWeatherPanel from './components/CurrentWeatherPanel';
import TemperatureTrendPanel from './components/TemperatureTrendPanel';
import InsightsPanel from './components/InsightsPanel';
import EmptyStatePanel from './components/EmptyStatePanel';
import './App.css';

export default function App() {
  // Search and request state
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Weather data displayed across dashboard panels
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [insights, setInsights] = useState([]);

  // Fetch weather data for the entered city and refresh all dashboard sections.
  const handleSearch = async (e) => {
    e.preventDefault();

    // Avoid making API calls for empty input.
    const trimmed = city.trim();
    if (!trimmed) return;

    // Reset UI state before a new request.
    setLoading(true);
    setError('');
    setWeatherData(null);
    setForecast([]);
    setInsights([]);

    try {
      // Get raw forecast data, then convert it to daily summaries + insights.
      const data = await fetchWeather(trimmed);
      const daily = processForecast(data);
      const generatedInsights = generateInsight(daily);

      // Keep current weather fields in a simple shape for panel components.
      setWeatherData({
        city: data.city.name,
        country: data.city.country,
        temp: Math.round(data.list[0].main.temp * 10) / 10,
        condition: data.list[0].weather[0].description,
        icon: data.list[0].weather[0].icon,
      });
      setForecast(daily);
      setInsights(generatedInsights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Derive weekly quick-stat metrics used by the current weather panel.
  const tempValues = forecast.map((d) => d.temp);
  const rainValues = forecast.map((d) => d.rainProbability);
  const weeklyHigh = tempValues.length ? Math.max(...tempValues) : null;
  const weeklyLow = tempValues.length ? Math.min(...tempValues) : null;
  const averageRain = rainValues.length
    ? Math.round(rainValues.reduce((sum, value) => sum + value, 0) / rainValues.length)
    : null;

  return (
    <div className="page">
      {/* Decorative ambient lights in the page background */}
      <div className="ambient-glow ambient-glow--one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--two" aria-hidden="true" />

      <div className="wireframe-window">
        {/* Top app chrome */}
        <div className="window-chrome">
          <div className="window-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="window-address">Skyline Forecast Desk</p>
        </div>

        <main className="window-content">
          <HeroHeader />

          <SearchBar
            city={city}
            onCityChange={setCity}
            onSubmit={handleSearch}
            loading={loading}
          />

          {/* Feedback states */}
          {error && <ErrorAlert message={error} />}

          {loading && <LoadingState />}

          {/* Main dashboard content once data is available */}
          {weatherData && (
            <>
              <CurrentWeatherPanel
                weatherData={weatherData}
                weeklyHigh={weeklyHigh}
                weeklyLow={weeklyLow}
                averageRain={averageRain}
              />

              <TemperatureTrendPanel forecast={forecast} />

              <InsightsPanel insights={insights} />
            </>
          )}

          {/* Initial placeholder before the first search */}
          {!weatherData && !loading && !error && <EmptyStatePanel />}
        </main>
      </div>
    </div>
  );
}
