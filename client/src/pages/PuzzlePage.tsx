import { useParams } from "react-router-dom";
<<<<<<< HEAD
import PuzzleSection from "../components/PuzzleSection";
=======
import PuzzlesSection from "../components/PuzzlesSection";
>>>>>>> origin/member-yazan

function PuzzlePage() {
  const { puzzleId } = useParams();

<<<<<<< HEAD
  return <PuzzleSection key={puzzleId} />;
=======
  return <PuzzlesSection key={puzzleId} />;
>>>>>>> origin/member-yazan
}

export default PuzzlePage;
