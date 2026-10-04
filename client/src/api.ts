import { readProgressCache, saveProgressCache } from "./progressStorage";

import type {
  ApiError,
  PuzzleDetail,
  PuzzleListResponse,
  PuzzleStage,
  PuzzleSummary,
  RevealedHint,
  StageHintResponse,
  SubmitAnswerResponse,
} from "./types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isNonnegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPuzzleSummary(value: unknown): value is PuzzleSummary {
  return (
    isObject(value) &&
    isPositiveInteger(value.id) &&
    isText(value.title) &&
    isText(value.summary) &&
    typeof value.locked === "boolean" &&
    isObject(value.progress) &&
    typeof value.progress.solved === "boolean" &&
    isNonnegativeInteger(value.progress.completedStages) &&
    isPositiveInteger(value.progress.totalStages) &&
    value.progress.completedStages <= value.progress.totalStages &&
    (value.progress.currentStageId === null ||
      isPositiveInteger(value.progress.currentStageId))
  );
}

function isRevealedHint(value: unknown): value is RevealedHint {
  return (
    isObject(value) && isNonnegativeInteger(value.hintId) && isText(value.hint)
  );
}

function isPuzzleStage(value: unknown): value is PuzzleStage {
  return (
    isObject(value) &&
    isPositiveInteger(value.id) &&
    isText(value.title) &&
    isText(value.question) &&
    Array.isArray(value.clues) &&
    value.clues.every(isText) &&
    Array.isArray(value.revealedHints) &&
    value.revealedHints.every(isRevealedHint) &&
    value.revealedHints.every((hint, index) => hint.hintId === index) &&
    isNonnegativeInteger(value.hintsRemaining) &&
    !("answers" in value) &&
    !("hints" in value)
  );
}

function isPuzzleDetail(value: unknown): value is PuzzleDetail {
  if (
    !isObject(value) ||
    !isPuzzleSummary(value) ||
    !isText(value.story) ||
    !isObject(value.progress) ||
    "stages" in value ||
    "answers" in value ||
    "hints" in value
  ) {
    return false;
  }

  const progress = value.progress;
  if (
    !isNonnegativeInteger(progress.completedStages) ||
    !isPositiveInteger(progress.totalStages) ||
    progress.completedStages > progress.totalStages ||
    typeof progress.solved !== "boolean"
  ) {
    return false;
  }

  if (progress.solved) {
    return (
      progress.currentStageId === null &&
      value.currentStage === null &&
      progress.completedStages === progress.totalStages &&
      isText(value.finalReveal)
    );
  }

  return (
    isPositiveInteger(progress.currentStageId) &&
    isPuzzleStage(value.currentStage) &&
    value.currentStage.id === progress.currentStageId &&
    progress.completedStages < progress.totalStages &&
    !("finalReveal" in value)
  );
}

function checkId(id: number, name: string) {
  if (!isPositiveInteger(id)) {
    const error: ApiError = new Error(`${name} must be a positive integer.`);
    error.status = 400;
    throw error;
  }
}

export async function readApiError(response: Response): Promise<ApiError> {
  let message = `Request failed (HTTP ${response.status}).`;
  try {
    const data: unknown = await response.json();
    if (isObject(data) && isText(data.message)) {
      message = data.message;
    }
  } catch {
    // Empty or non-JSON error bodies still preserve the HTTP status.
  }

  const error: ApiError = new Error(message);
  error.status = response.status;
  return error;
}

async function readJson(response: Response): Promise<unknown> {
  if (!response.ok) {
    throw await readApiError(response);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("The server returned an invalid JSON response.");
  }
}

export async function getAllPuzzles(): Promise<PuzzleListResponse> {
  const response = await fetch("/api/getAllPuzzles");
  const data = await readJson(response);

  if (
    !isObject(data) ||
    !Array.isArray(data.puzzles) ||
    !data.puzzles.every(isPuzzleSummary) ||
    data.puzzles.some(
      (puzzle) =>
        "stages" in puzzle ||
        "answers" in puzzle ||
        "hints" in puzzle ||
        "finalReveal" in puzzle,
    )
  ) {
    throw new Error("The server returned invalid puzzle selection data.");
  }

  // Return only the selection fields, even if the response has extra metadata.
  const puzzles = data.puzzles.map(
    ({ id, title, summary, locked, progress }) => ({
      id,
      title,
      summary,
      locked,
      progress,
    }),
  );
  // Replaces stale progress after an Express restart, before cards become usable.
  saveProgressCache(puzzles);
  return { puzzles };
}

export async function getPuzzle(puzzleId: number): Promise<PuzzleDetail> {
  checkId(puzzleId, "Puzzle ID");
  const response = await fetch(`/api/getPuzzle/${puzzleId}`);
  const data = await readJson(response);

  if (!isPuzzleDetail(data) || data.id !== puzzleId) {
    throw new Error("The server returned invalid puzzle detail.");
  }

  cachePuzzleProgress(data);
  return data;
}

export async function submitAnswer(
  puzzleId: number,
  stageId: number,
  answer: string,
): Promise<SubmitAnswerResponse> {
  checkId(puzzleId, "Puzzle ID");
  checkId(stageId, "Stage ID");
  if (!isText(answer)) {
    const error: ApiError = new Error("Enter an answer before submitting.");
    error.status = 400;
    throw error;
  }

  const response = await fetch(`/api/submitAnswer/${puzzleId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stageId, answer }),
  });
  const data = await readJson(response);

  if (
    !isObject(data) ||
    typeof data.correct !== "boolean" ||
    !isText(data.message) ||
    !isPuzzleDetail(data.puzzle) ||
    data.puzzle.id !== puzzleId
  ) {
    throw new Error("The server returned invalid answer feedback.");
  }

  cachePuzzleProgress(data.puzzle);
  return { correct: data.correct, message: data.message, puzzle: data.puzzle };
}

export async function requestStageHint(
  puzzleId: number,
  stageId: number,
): Promise<StageHintResponse> {
  checkId(puzzleId, "Puzzle ID");
  checkId(stageId, "Stage ID");
  const response = await fetch(`/api/requestStageHint/${puzzleId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stageId }),
  });
  const data = await readJson(response);

  if (
    !isObject(data) ||
    !isRevealedHint(data) ||
    !isPuzzleDetail(data.puzzle) ||
    data.puzzle.id !== puzzleId ||
    data.puzzle.currentStage?.id !== stageId ||
    !data.puzzle.currentStage.revealedHints.some(
      (hint) => hint.hintId === data.hintId && hint.hint === data.hint,
    )
  ) {
    throw new Error("The server returned invalid stage hint data.");
  }

  cachePuzzleProgress(data.puzzle);
  return { hintId: data.hintId, hint: data.hint, puzzle: data.puzzle };
}

function cachePuzzleProgress(puzzle: PuzzleDetail) {
  const cached = readProgressCache().filter(
    (item) => item && item.id !== puzzle.id,
  );
  saveProgressCache([
    ...cached,
    {
      id: puzzle.id,
      title: puzzle.title,
      summary: puzzle.summary,
      locked: puzzle.locked,
      progress: puzzle.progress,
    },
  ]);
}
