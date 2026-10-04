import ClueCard from './ClueCard'

interface ClueListProps {
  clues: string[]
}

function ClueList({ clues }: ClueListProps) {
  return <ol className="clue-list">{clues.map((text, index) => <ClueCard key={`${index}-${text}`} text={text} number={index + 1} />)}</ol>
}

export default ClueList
