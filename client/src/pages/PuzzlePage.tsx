import { useParams } from "react-router-dom";
import PuzzlesSection from "../components/PuzzlesSection";

function PuzzlePage() {
  const { puzzleId } = useParams();

  return <PuzzlesSection key={puzzleId} />;
}

export default PuzzlePage;
