interface ClueCardProps {
  text: string
  number: number
}

function ClueCard({ text, number }: ClueCardProps) {
  return <li className="clue-card"><p className="clue-card-title">Clue {number}</p><p className="clue-card-text">{text}</p></li>
}

export default ClueCard
