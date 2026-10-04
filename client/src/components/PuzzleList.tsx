import type { PuzzleSummary } from "../types";
import PuzzleCard from "./PuzzleCard";

interface PuzzleListProps {
  puzzles: PuzzleSummary[];
}

function PuzzleList({ puzzles }: PuzzleListProps) {
  return (
    <div className="puzzle-list">
      {puzzles.map((puzzle) => (
        <PuzzleCard key={puzzle.id} puzzle={puzzle} />
      ))}
    </div>
  );
}

export default PuzzleList;
