import { Link } from "react-router-dom";
import type { PuzzleSummary } from "../types";

interface PuzzleCardProps {
  puzzle: PuzzleSummary;
}

function PuzzleCard({ puzzle }: PuzzleCardProps) {
  return (
    <article className={`puzzle-card${puzzle.locked ? " puzzle-card-locked" : ""}`}>
      <p className="eyebrow">Case {String(puzzle.id).padStart(2, "0")}</p>
      <h2 className="puzzle-card-title">{puzzle.title}</h2>
      <p className="puzzle-card-summary">{puzzle.summary}</p>
      <div className="puzzle-card-footer">
        {puzzle.locked ? (
          <button className="action-button" disabled aria-label={`Investigate ${puzzle.title} (locked)`}>
            Investigate · Locked
          </button>
        ) : <Link
          className="action-button"
          to={`/puzzles/${puzzle.id}`}
          aria-label={`Investigate ${puzzle.title}`}
        >
          Investigate <span aria-hidden="true">↗</span>
        </Link>}
        {puzzle.locked && <p className="puzzle-lock-message">Complete all earlier puzzles to unlock this level.</p>}
      </div>
    </article>
  );
}

export default PuzzleCard;
