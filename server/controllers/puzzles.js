import { getPuzzleById, getProgressByPuzzleId, getPuzzleSummaries, getPublicPuzzle, isPuzzleLocked } from "../store.js";

function readPuzzleId(req, res) {
  const value = req.params.puzzleId;
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
    res.status(400).json({ message: "Puzzle ID must be a positive integer." });
    return null;
  }
  const puzzleId = Number(value);
  if (!getPuzzleById(puzzleId)) {
    res.status(404).json({ message: "Puzzle not found." });
    return null;
  }
  if (isPuzzleLocked(puzzleId)) {
    res.status(403).json({ message: "Complete all earlier puzzles before investigating this level." });
    return null;
  }
  return puzzleId;
}

function readCurrentStage(req, res, needsAnswer) {
  const puzzleId = readPuzzleId(req, res);
  if (puzzleId === null) return null;
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    res.status(400).json({ message: "Send a JSON object with the required fields." });
    return null;
  }
  if (!Number.isSafeInteger(body.stageId) || body.stageId <= 0) {
    res.status(400).json({ message: "Stage ID must be a positive integer number." });
    return null;
  }
  if (needsAnswer && (typeof body.answer !== "string" || !body.answer.trim())) {
    res.status(400).json({ message: "Answer must be a nonempty string." });
    return null;
  }
  const puzzle = getPuzzleById(puzzleId);
  const stage = puzzle.stages.find((item) => item.id === body.stageId);
  if (!stage) {
    res.status(404).json({ message: "Stage not found in this puzzle." });
    return null;
  }
  const progress = getProgressByPuzzleId(puzzleId);
  if (progress.solved) {
    res.status(409).json({ message: "This puzzle is already solved." });
    return null;
  }
  if (puzzle.stages[progress.currentStageIndex].id !== stage.id) {
    res.status(409).json({ message: "This stage is not current. Reload the puzzle to continue." });
    return null;
  }
  return { puzzleId, puzzle, stage, progress };
}

export function getAllPuzzles(req, res) {
  res.json({ puzzles: getPuzzleSummaries() });
}

export function getPuzzle(req, res) {
  const puzzleId = readPuzzleId(req, res);
  if (puzzleId !== null) res.json(getPublicPuzzle(puzzleId));
}

export function submitAnswer(req, res) {
  const current = readCurrentStage(req, res, true);
  if (!current) return;
  const { puzzleId, puzzle, stage, progress } = current;
  const answer = req.body.answer.trim().toLowerCase();
  const correct = stage.answers.some((accepted) => accepted.trim().toLowerCase() === answer);
  if (correct) {
    progress.currentStageIndex += 1;
    progress.solved = progress.currentStageIndex === puzzle.stages.length;
  }
  const message = !correct ? "Wrong answer. Try again."
    : progress.solved ? "Correct. Puzzle complete!" : "Correct. The next stage is ready.";
  res.json({ correct, message, puzzle: getPublicPuzzle(puzzleId) });
}

export function requestStageHint(req, res) {
  const current = readCurrentStage(req, res, false);
  if (!current) return;
  const { puzzleId, stage, progress } = current;
  const hintId = progress.hintsUsedByStage[stage.id];
  if (hintId >= stage.hints.length) {
    res.status(409).json({ message: "No hints remain for this stage." });
    return;
  }
  progress.hintsUsedByStage[stage.id] += 1;
  res.json({ hintId, hint: stage.hints[hintId], puzzle: getPublicPuzzle(puzzleId) });
}
