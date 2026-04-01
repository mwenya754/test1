import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchWeather, processForecast, generateInsight, formatDate } from './weather';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

  const chartData = {
    labels: forecast.map((d) => formatDate(d.date)),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: forecast.map((d) => d.temp),
        borderColor: '#4fc3f7',
        backgroundColor: 'rgba(79, 195, 247, 0.15)',
        pointBackgroundColor: '#4fc3f7',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#e0e0e0' },
      },
      title: {
        display: true,
        text: '5–7 Day Temperature Trend',
        color: '#e0e0e0',
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}°C`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#b0bec5', maxRotation: 30 },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
      y: {
        ticks: {
          color: '#b0bec5',
          callback: (v) => `${v}°C`,
        },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌤️ Weather Trend Planner</h1>
        <p>Plan your outdoor activities with confidence</p>
      </header>

      <main className="app-main">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Enter city name…"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="City name"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="error-card" role="alert">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="loading" aria-live="polite">
            <div className="spinner" />
            <p>Fetching weather data…</p>
          </div>
        )}

        {weatherData && (
          <>
            <section className="weather-card" aria-label="Current weather">
              <div className="weather-icon-wrap">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                  alt={weatherData.condition}
                  className="weather-icon"
                />
              </div>
              <div className="weather-info">
                <h2 className="weather-city">
                  {weatherData.city}, {weatherData.country}
                </h2>
                <p className="weather-temp">{weatherData.temp}°C</p>
                <p className="weather-condition">{weatherData.condition}</p>
              </div>
            </section>

            <section className="chart-section" aria-label="Temperature trend chart">
              <Line data={chartData} options={chartOptions} />
            </section>

            <section className="insights-section" aria-label="Weather insights">
              <h2>💡 Insights</h2>
              <ul className="insights-list">
                {insights.map((insight, i) => (
                  <li key={i} className="insight-item">
                    {insight}
                  </li>
                ))}
              </ul>
            </section>

            <section className="forecast-table-section" aria-label="Daily forecast">
              <h2>📅 Daily Forecast</h2>
              <div className="forecast-grid">
                {forecast.map((day) => (
                  <div key={day.date} className="forecast-card">
                    <p className="forecast-date">{formatDate(day.date)}</p>
                    <p className="forecast-temp">{day.temp}°C</p>
                    <p className="forecast-condition">{day.condition}</p>
                    <p className="forecast-rain">🌧 {day.rainProbability}%</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {!weatherData && !loading && !error && (
          <div className="placeholder">
            <p>Enter a city name above to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
}
