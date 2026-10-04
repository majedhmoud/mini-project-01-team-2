interface LoadingMessageProps {
  message?: string
}

function LoadingMessage({ message = 'Loading puzzle data…' }: LoadingMessageProps) {
  return <div className="message" role="status">{message}</div>
}

export default LoadingMessage
