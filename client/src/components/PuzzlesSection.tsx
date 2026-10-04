import { useEffect, useState } from "react";
import { readProgressCache } from "../progressStorage";
import { getAllPuzzles } from "../api";
import type { PuzzleSummary } from "../types";
import LoadingMessage from "./LoadingMessage";
import ErrorMessage from "./ErrorMessage";
import EmptyState from "./EmptyState";
import PuzzleList from "./PuzzleList";

function PuzzlesSection() {
  const [puzzles, setPuzzles] = useState<PuzzleSummary[]>(readProgressCache);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadPuzzles() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllPuzzles();
        if (active) setPuzzles(data.puzzles);
      } catch (error) {
        if (active)
          setError(
            error instanceof Error ? error.message : "Could not load puzzles.",
          );
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadPuzzles();
    return () => {
      active = false;
    };
  }, [retryCount]);

  return (
    <section className="panel puzzles-panel" aria-busy={loading}>
      <div className="panel-header">
        <p className="eyebrow">The archive</p>
        <h1>Solve the levels in order.</h1>
        <p className="intro">
          Start with the first puzzle. Complete every stage to unlock the next level.
        </p>
      </div>
      {loading ? (
        <LoadingMessage message="Opening the puzzle archive…" />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => setRetryCount((count) => count + 1)}
        />
      ) : puzzles.length === 0 ? (
        <EmptyState message="No puzzles are available yet. Check back later." />
      ) : (
        <PuzzleList puzzles={puzzles} />
      )}
    </section>
  );
}

export default PuzzlesSection;
