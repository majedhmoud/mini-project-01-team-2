
import  puzzlesData  from "./data.js";
let puzzlesstore = puzzlesData;
const progressByPuzzleId = {};

puzzlesstore.puzzles.forEach((puzzle) => {
  const hintsUsed = {};
  puzzle.stages.forEach((stage) => {
    hintsUsed[stage.id] = 0;
  });

  progressByPuzzleId[puzzle.id] = {
    currentStageIndex: 0,
    solved: false,
    hintsUsedByStage: hintsUsed,
  };
});

export function getPuzzleById(puzzleId) {
  return puzzlesstore.puzzles.find((puzzle) => puzzle.id === Number(puzzleId));
}

export function getProgressByPuzzleId(puzzleId) {
  return progressByPuzzleId[Number(puzzleId)];
}

export function getPuzzleSummaries() {
  return puzzlesstore.puzzles.map((puzzle) => ({
    id: puzzle.id,
    title: puzzle.title,
    summary: puzzle.summary,
  }));
}
export function getPublicPuzzle(puzzleId) {
  const puzzle = getPuzzleById(puzzleId);
  const progress = getProgressByPuzzleId(puzzleId);

  if (!puzzle || !progress) {
    return undefined;
  }

  const totalStages = puzzle.stages.length;

  if (progress.solved) {
    return {
      id: puzzle.id,
      title: puzzle.title,
      summary: puzzle.summary,
      story: puzzle.story,
      progress: {
        currentStageId: null,
        completedStages: totalStages,
        totalStages: totalStages,
        solved: true,
      },
      currentStage: null,
      finalReveal: puzzle.finalReveal,  
    };
  }

  const currentStageData = puzzle.stages[progress.currentStageIndex];
  const hintsUsedCount = progress.hintsUsedByStage[currentStageData.id] || 0;

  const revealedHints = currentStageData.hints
    .slice(0, hintsUsedCount)
    .map((hintText, index) => ({
      hintId: index,
      hint: hintText,
    }));

  const hintsRemaining = currentStageData.hints.length - hintsUsedCount;

  return {
    id: puzzle.id,
    title: puzzle.title,
    summary: puzzle.summary,
    story: puzzle.story,
    progress: {
      currentStageId: currentStageData.id,
      completedStages: progress.currentStageIndex,
      totalStages: totalStages,
      solved: false,
    },
    currentStage: {
      id: currentStageData.id,
      title: currentStageData.title,
      question: currentStageData.question,
      clues: currentStageData.clues,
      revealedHints: revealedHints,
      hintsRemaining: hintsRemaining,
    },

  };
}

export function checkAndAdvanceStage(puzzleId, answer) {
  const puzzle = getPuzzleById(puzzleId);
  const progress = getProgressByPuzzleId(puzzleId);

  const currentStage = puzzle.stages[progress.currentStageIndex];

  const normalizedAnswer = String(answer).trim().toLowerCase();

  const isCorrect = currentStage.answers.some(
    (acceptedAnswer) => acceptedAnswer.trim().toLowerCase() === normalizedAnswer
  );

  if (isCorrect) {
    progress.currentStageIndex += 1;

    if (progress.currentStageIndex >= puzzle.stages.length) {
      progress.solved = true;
    }

    return {
      correct: true,
      message: "Correct answer! Stage passed.",
      puzzle: getPublicPuzzle(puzzleId),
    };
  }

  return {
    correct: false,
    message: "Incorrect answer. Try again.",
    puzzle: getPublicPuzzle(puzzleId),
  };
}

export function unlockStageHint(puzzleId, stageId) {
  const puzzle = getPuzzleById(puzzleId);
  const progress = getProgressByPuzzleId(puzzleId);

  const currentStage = puzzle.stages[progress.currentStageIndex];

  const nextHintIndex = progress.hintsUsedByStage[stageId];
  const hintText = currentStage.hints[nextHintIndex];

  progress.hintsUsedByStage[stageId] += 1;

  return {
    hintId: nextHintIndex,
    hint: hintText,
    puzzle: getPublicPuzzle(puzzleId),
  };
}

