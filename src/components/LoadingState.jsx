export default function LoadingState() {
  return (
    <div className="loading" aria-live="polite">
      <div className="spinner" />
      <p>Gathering the latest forecast data...</p>
    </div>
  );
}