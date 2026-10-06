interface ErrorMessageProps {
  errorMessage?: string;
  onRetry: () => void;
}
export default function ErrorMessage({
  errorMessage = "We couldn't load the puzzles. Please try again.",
  onRetry,
}: ErrorMessageProps) {
  return (

    <div className="error-message" role="alert">
      <p className="eyebrow">Investigation interrupted</p>
      <h2>Something went wrong</h2>
      <p className="error-message-text">{errorMessage}</p>
      <button type="button" className="action-button" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
