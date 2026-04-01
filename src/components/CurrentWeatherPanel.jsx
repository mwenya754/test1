function statValue(value, suffix) {
  return value !== null ? `${value}${suffix}` : '--';
}

export default function CurrentWeatherPanel({ weatherData, weeklyHigh, weeklyLow, averageRain }) {
  return (
    <section className="panel weather-panel" aria-label="Current weather">
      <div className="panel-title-row">
        <h2 className="panel-city">{weatherData.city}, {weatherData.country}</h2>
        <p>Current conditions</p>
      </div>

      <div className="panel-body">
        <div className="current-weather">
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
            alt={weatherData.condition}
          />
          <div>
            <p className="current-temperature">{weatherData.temp}°C</p>
            <p className="current-condition">{weatherData.condition}</p>
          </div>
        </div>

        <div className="quick-stats" aria-label="Weekly weather highlights">
          <article className="quick-stat">
            <span>7-day high</span>
            <strong>{statValue(weeklyHigh, '°C')}</strong>
          </article>
          <article className="quick-stat">
            <span>7-day low</span>
            <strong>{statValue(weeklyLow, '°C')}</strong>
          </article>
          <article className="quick-stat">
            <span>Avg rain chance</span>
            <strong>{statValue(averageRain, '%')}</strong>
          </article>
        </div>
      </div>
    </section>
  );
}