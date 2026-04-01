export default function SearchBar({ city, onCityChange, onSubmit, loading }) {
  return (
    <form className="search-row" onSubmit={onSubmit}>
      <label htmlFor="city" className="search-label">City</label>
      <input
        id="city"
        type="text"
        className="search-input"
        placeholder="Try Lusaka, Ndola, Kitwe..."
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        aria-label="City name"
      />
      <button type="submit" className="search-button" disabled={loading}>
        {loading ? 'Searching...' : 'View Forecast'}
      </button>
    </form>
  );
}