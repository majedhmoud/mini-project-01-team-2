import { useEffect, useState } from "react";
import { getAllPuzzles } from "../api";
import PuzzleCard from "./PuzzleCard";
interface PuzzleSummary {
  id: number;
  title: string;
  summary: string;
}

function PuzzlesSection() {
  const [puzzles, setPuzzles] = useState<PuzzleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  async function loadPuzzles() {
    setIsLoading(true);
    setHasError(false);

    try {
      const data = await getAllPuzzles();
      setPuzzles(data.puzzles);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPuzzles();
  }, []);

  return (
    <section className="panel puzzles-panel">
      <h1>Mystery Room</h1>
      <p>Solve the puzzles in order.</p>

      {isLoading && <p>Loading puzzles...</p>}

      {!isLoading && hasError && (
        <div>
          <p>Could not load puzzles.</p>
          <button className="action-button" onClick={loadPuzzles}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !hasError && (
        <div className="puzzle-list">
          {puzzles.map((puzzle) => (
            <PuzzleCard
              key={puzzle.id}
              id={puzzle.id}
              title={puzzle.title}
              summary={puzzle.summary}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PuzzlesSection;
