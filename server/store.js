import { puzzlesData } from "./data.js";

// One progress record per puzzle, created once for this server process.
const progressByPuzzleId = {};
for (const puzzle of puzzlesData.puzzles) {
  const hintsUsedByStage = {};
  for (const stage of puzzle.stages) hintsUsedByStage[stage.id] = 0;
  progressByPuzzleId[puzzle.id] = {
    currentStageIndex: 0,
    solved: false,
    hintsUsedByStage,
  };
}

export function getPuzzleById(puzzleId) {
  return puzzlesData.puzzles.find((puzzle) => puzzle.id === puzzleId);
}

export function getProgressByPuzzleId(puzzleId) {
  return progressByPuzzleId[puzzleId];
}

// Seed order is the level order. Every preceding puzzle must be solved.
export function isPuzzleLocked(puzzleId) {
  const index = puzzlesData.puzzles.findIndex(
    (puzzle) => puzzle.id === puzzleId,
  );
  return puzzlesData.puzzles
    .slice(0, index)
    .some((puzzle) => !getProgressByPuzzleId(puzzle.id).solved);
}

function getPublicProgress(puzzleId) {
  const puzzle = getPuzzleById(puzzleId);
  const progress = getProgressByPuzzleId(puzzleId);
  return {
    currentStageId: progress.solved
      ? null
      : puzzle.stages[progress.currentStageIndex].id,
    completedStages: progress.currentStageIndex,
    totalStages: puzzle.stages.length,
    solved: progress.solved,
  };
}

export function getPuzzleSummaries() {
  return puzzlesData.puzzles.map(({ id, title, summary }) => ({
    id,
    title,
    summary,
    locked: isPuzzleLocked(id),
    progress: getPublicProgress(id),
  }));
}

export function getPublicPuzzle(puzzleId) {
  const puzzle = getPuzzleById(puzzleId);
  if (!puzzle) return undefined;
  const progress = getProgressByPuzzleId(puzzleId);
  const stage = progress.solved
    ? null
    : puzzle.stages[progress.currentStageIndex];
  const publicPuzzle = {
    id: puzzle.id,
    title: puzzle.title,
    summary: puzzle.summary,
    story: puzzle.story,
    locked: isPuzzleLocked(puzzleId),
    progress: getPublicProgress(puzzleId),
    currentStage: null,
  };
  if (stage) {
    const used = progress.hintsUsedByStage[stage.id];
    publicPuzzle.currentStage = {
      id: stage.id,
      title: stage.title,
      question: stage.question,
      clues: [...stage.clues],
      revealedHints: stage.hints
        .slice(0, used)
        .map((hint, hintId) => ({ hintId, hint })),
      hintsRemaining: stage.hints.length - used,
    };
  } else if (progress.solved) {
    publicPuzzle.finalReveal = puzzle.finalReveal;
  }
  return publicPuzzle;
}
