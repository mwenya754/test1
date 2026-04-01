export default function ErrorAlert({ message }) {
  return (
    <div className="error-card" role="alert">
      {message}
    </div>
  );
}