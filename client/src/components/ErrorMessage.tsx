interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="message error" role="alert">
      <p>{message}</p>
      {onRetry && <button className="action-button secondary" type="button" onClick={onRetry}>Retry</button>}
    </div>
  )
}

export default ErrorMessage
