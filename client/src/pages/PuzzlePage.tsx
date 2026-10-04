import { Link, useParams } from "react-router-dom";
import PuzzleSection from "../components/PuzzleSection";

function PuzzlePage() {
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
  return <PuzzleSection key={puzzleId} puzzleId={puzzleId} />;
}

export default PuzzlePage;
