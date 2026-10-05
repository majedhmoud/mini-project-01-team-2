import { PuzzleDetail, PuzzleSummary, StageHintResponse } from "./types";

export async function getAllPuzzles(): Promise<PuzzleSummary[]> {
  const response = await fetch("/api/getAllPuzzles");

  if (!response.ok) {
    throw new Error("Could not load puzzles.");
  }

  return (await response.json()) as PuzzleSummary[];
}
export async function getPuzzleById(id: number): Promise<PuzzleDetail> {
  const response = await fetch(`/api/getPuzzleById/${id}`);

  if (!response.ok) {
    throw new Error("Could not load this puzzle.");
  }

  return (await response.json()) as PuzzleDetail;
}

export async function getCluesById(id: number): Promise<string[]> {
  const response = await fetch(`/getCluesById/${id}/clues`);

  if (!response.ok) {
    throw new Error("Could not load the clue.");

    return response.json();
  }

  return (await response.json()) as string[];
}

export async function submitAnswer(
  id: number,
  stageId: number,
  answer: string,
): Promise<boolean> {
  const response = await fetch(`/submitAnswer/${id}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stageId, answer }),
  });

  if (!response.ok) {
    throw new Error("Wrong Answer.");
  }

  return (await response.json()) as boolean;
}

export async function requestHints(
  id: number,
  stageId: number,
): Promise<StageHintResponse> {
  const response = await fetch(`/requestHints/${id}/hint`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stageId }),
  });

  if (!response.ok) {
    throw new Error("Error loading hints.");
  }

  return (await response.json()) as StageHintResponse;
}
