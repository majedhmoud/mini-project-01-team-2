import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPuzzle } from "../api";
import type { ApiError, PuzzleDetail } from "../types";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

interface PuzzleResultProps {
  puzzleId: number;
}

function PuzzleResult({ puzzleId }: PuzzleResultProps) {
  const navigate = useNavigate();
  const [puzzle, setPuzzle] = useState<PuzzleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadResult() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPuzzle(puzzleId);
        if (active) setPuzzle(data);
      } catch (error) {
        if (active && (error as ApiError)?.status === 403) navigate("/", { replace: true });
        else if (active)
          setError(
            error instanceof Error
              ? error.message
              : "Could not load this result.",
          );
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadResult();
    return () => {
      active = false;
    };
  }, [puzzleId, retryCount, navigate]);

  return (
    <section className="panel result-page" aria-busy={loading}>
      {loading ? (
        <LoadingMessage message="Checking the puzzle result…" />
      ) : error ? (
        <>
          <h1>Unable to open this result</h1>
          <ErrorMessage
            message={error}
            onRetry={() => setRetryCount((count) => count + 1)}
          />
          <Link className="back-link" to="/">
            Back to puzzles
          </Link>
        </>
      ) : puzzle?.progress.solved && puzzle.finalReveal ? (
        <>
          <p className="case-closed">Case closed</p>
          <h1>{puzzle.title}</h1>
          <p className="result-intro">
            All stages complete. The final reveal is yours.
          </p>
          <p className="result-reveal">{puzzle.finalReveal}</p>
          <Link className="action-button" to="/">
            Back to puzzles <span aria-hidden="true">→</span>
          </Link>
        </>
      ) : (
        puzzle && (
          <>
            <p className="eyebrow">The case is still open</p>
            <h1>{puzzle.title}</h1>
            <p className="intro">Complete this puzzle to see its result.</p>
            <Link className="action-button" to={`/puzzles/${puzzleId}`}>
              Continue puzzle
            </Link>
            <Link className="back-link result-return" to="/">
              Back to puzzles
            </Link>
          </>
        )
      )}
    </section>
  );
}

function ResultPage() {
  const params = useParams();
  const value = params.puzzleId || "";
  const puzzleId = Number(value);
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(puzzleId)) {
    return (
      <section className="panel">
        <h1>Invalid puzzle address</h1>
        <p className="intro">Puzzle IDs must be positive whole numbers.</p>
        <Link className="action-button" to="/">
          Back to puzzles
        </Link>
      </section>
    );
  }
  return <PuzzleResult key={puzzleId} puzzleId={puzzleId} />;
}

export default ResultPage;
