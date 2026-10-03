import { puzzlesData } from "./data.js";
let progressByPuzzleId = {
  currentStageIndex: 0,
  solved: false,
  hintsUsedByStage: { 1: 0, 2: 0, 3: 0 },
};

export function getPuzzleById(puzzleId) {
  const checkPuzzle = puzzlesData.puzzles.find(
    (puzzle) => puzzle.id === puzzleId,
  );
  if (!checkPuzzle) {
    throw new Error(`Puzzle with ID ${puzzleId} not found.`);
  }
  return checkPuzzle;
}
export function getProgressByPuzzleId(puzzleId) {
  const checkPuzzle = puzzlesData.puzzles.find(
    (puzzle) => puzzle.id === puzzleId,
  );
  if (!checkPuzzle) {
    throw new Error(`Puzzle with ID ${puzzleId} not found.`);
  }
  return progressByPuzzleId;
}
export function getPuzzleSummaries() {
  const puzzlesummary = puzzlesData.puzzles.map((puzzle) => ({
    id: puzzle.id,
    title: puzzle.title,
    summary: puzzle.summary,
  }));
  return puzzlesummary;
}
