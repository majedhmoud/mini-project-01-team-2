import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPuzzleById } from "../api";

interface PuzzleDetail {
  id: number;
  title: string;
  story: string;
  totalStages: number;
  currentStage: {
    id: number;
    title: string;
    question: string;
    clues: string[];
  };
}

function PuzzleSection() {
  const { puzzleId } = useParams();

  const [puzzle, setPuzzle] = useState<PuzzleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  async function loadPuzzle(id: number) {
    setIsLoading(true);
    setHasError(false);

    try {
      const data = await getPuzzleById(id);
      setPuzzle(data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPuzzle(Number(puzzleId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="panel puzzle-panel">
      <Link className="back-link" to="/">
        Back to puzzles
      </Link>

      {isLoading && <p>Loading puzzle...</p>}

      {!isLoading && hasError && (
        <div>
          <p>Could not load this puzzle.</p>
          <button
            className="action-button"
            onClick={() => loadPuzzle(Number(puzzleId))}
          >
            Retry
          </button>{" "}
        </div>
      )}

      {!isLoading && !hasError && puzzle && (
        <>
          <h1>{puzzle.title}</h1>
          <p className="puzzle-story">{puzzle.story}</p>

          <div className="stage-heading">
            <p>
              Stage {puzzle.currentStage.id} of {puzzle.totalStages}
            </p>
            <h2>{puzzle.currentStage.title}</h2>
            <p className="stage-question">{puzzle.currentStage.question}</p>
          </div>

          <ol className="clue-list">
            {puzzle.currentStage.clues.map((clue, index) => (
              <li className="clue-card" key={index}>
                <p className="clue-card-title">Clue {index + 1}</p>
                <p className="clue-card-text">{clue}</p>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}

export default PuzzleSection;
