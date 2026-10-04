interface EmptyStateProps {
  message: string
}

function EmptyState({ message }: EmptyStateProps) {
  return <p className="empty-state" role="status">{message}</p>
}

export default EmptyState
