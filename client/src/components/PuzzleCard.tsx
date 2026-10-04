import { Link } from "react-router-dom";
interface PuzzleCardProps {
  id: number;
  title: string;
  summary: string;
}

function PuzzleCard({ id, title, summary }: PuzzleCardProps) {
  return (
    <article className="puzzle-card">
      <p>Puzzle {id}</p>
      <h2>{title}</h2>
      <p>{summary}</p>
      <Link className="action-button" to={`/puzzles/${id}`}>
        Investigate
      </Link>
    </article>
  );
}

export default PuzzleCard;
