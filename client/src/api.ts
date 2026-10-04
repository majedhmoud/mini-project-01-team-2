export async function getAllPuzzles() {
  const response = await fetch("/api/getAllPuzzles");

  if (!response.ok) {
    throw new Error("Could not load puzzles.");
  }

  return response.json();
}
export async function getPuzzleById(id: number) {
  const response = await fetch(`/api/getPuzzleById/${id}`);

  if (!response.ok) {
    throw new Error("Could not load this puzzle.");
  }

  return response.json();
}