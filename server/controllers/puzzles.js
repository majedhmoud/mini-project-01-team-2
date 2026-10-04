import {  getPuzzleById,
  getProgressByPuzzleId,
  getPuzzleSummaries,
  getPublicPuzzle,
  checkAndAdvanceStage,
  unlockStageHint,} from "../store.js";

  function isValidId(value) {
  return typeof value === "string" && /^[1-9]\d*$/.test(value);
}

  export function getAllPuzzles(req, res) {
  const summaries = getPuzzleSummaries();
  return res.status(200).json({ puzzles: summaries });
}


export function getPuzzle(req, res) {
  const { puzzleId } = req.params;

  if (!isValidId(puzzleId)) {
    return res.status(400).json({ message: "Invalid puzzle ID format." });
  }

  const puzzle = getPuzzleById(puzzleId);
  if (!puzzle) {
    return res.status(404).json({ message: "Puzzle not found." });
  }

  const publicData = getPublicPuzzle(puzzleId);
  return res.status(200).json(publicData);
}


export function submitAnswer(req, res) {
  const { puzzleId } = req.params;

  if (!isValidId(puzzleId)) {
    return res.status(400).json({ message: "Invalid puzzle ID format." });
  }

  const { stageId, answer } = req.body || {};

  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body) ||
    !Number.isInteger(stageId) ||
    stageId <= 0 ||
    typeof answer !== "string" ||
    answer.trim().length === 0
  ) {
    return res.status(400).json({ message: "Invalid request body fields." });
  }

  const puzzle = getPuzzleById(puzzleId);
  if (!puzzle) {
    return res.status(404).json({ message: "Puzzle not found." });
  }

  const stageExists = puzzle.stages.some((s) => s.id === stageId);
  if (!stageExists) {
    return res.status(404).json({ message: "Stage not found in this puzzle." });
  }

  const progress = getProgressByPuzzleId(puzzleId);

  if (progress.solved) {
    return res.status(409).json({ message: "Puzzle is already solved." });
  }

  const currentStage = puzzle.stages[progress.currentStageIndex];
  if (currentStage.id !== stageId) {
    return res.status(409).json({ message: "Stage is not current." });
  }

  const result = checkAndAdvanceStage(puzzleId, answer);
  return res.status(200).json(result);
}


export function requestStageHint(req, res) {
  const { puzzleId } = req.params;

  if (!isValidId(puzzleId)) {
    return res.status(400).json({ message: "Invalid puzzle ID format." });
  }

  const { stageId } = req.body || {};

  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body) ||
    !Number.isInteger(stageId) ||
    stageId <= 0
  ) {
    return res.status(400).json({ message: "Invalid stageId field." });
  }

  const puzzle = getPuzzleById(puzzleId);
  if (!puzzle) {
    return res.status(404).json({ message: "Puzzle not found." });
  }

  const stageExists = puzzle.stages.some((s) => s.id === stageId);
  if (!stageExists) {
    return res.status(404).json({ message: "Stage not found in this puzzle." });
  }

  const progress = getProgressByPuzzleId(puzzleId);

  if (progress.solved) {
    return res.status(409).json({ message: "Puzzle is already solved." });
  }

  const currentStage = puzzle.stages[progress.currentStageIndex];
  if (currentStage.id !== stageId) {
    return res.status(409).json({ message: "Stage is not current." });
  }

  const hintsUsed = progress.hintsUsedByStage[stageId] || 0;
  if (hintsUsed >= currentStage.hints.length) {
    return res.status(409).json({ message: "No hints remaining for this stage." });
  }

  const result = unlockStageHint(puzzleId, stageId);
  return res.status(200).json(result);
}

