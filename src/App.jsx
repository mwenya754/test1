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
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [insights, setInsights] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setWeatherData(null);
    setForecast([]);
    setInsights([]);

    try {
      const data = await fetchWeather(trimmed);
      const daily = processForecast(data);
      const generatedInsights = generateInsight(daily);

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

  const tempValues = forecast.map((d) => d.temp);
  const rainValues = forecast.map((d) => d.rainProbability);
  const weeklyHigh = tempValues.length ? Math.max(...tempValues) : null;
  const weeklyLow = tempValues.length ? Math.min(...tempValues) : null;
  const averageRain = rainValues.length
    ? Math.round(rainValues.reduce((sum, value) => sum + value, 0) / rainValues.length)
    : null;

  return (
    <div className="page">
      <div className="ambient-glow ambient-glow--one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--two" aria-hidden="true" />

      <div className="wireframe-window">
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

          {error && <ErrorAlert message={error} />}

          {loading && <LoadingState />}

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

          {!weatherData && !loading && !error && <EmptyStatePanel />}
        </main>
      </div>
    </div>
  );
}
