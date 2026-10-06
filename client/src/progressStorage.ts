import type { PuzzleSummary } from './types'

const progressKey = 'mystery-room-progress'

// This cache never grants access. Each page waits for Express to confirm progress.
export function readProgressCache(): PuzzleSummary[] {
  try {
    const cached: unknown = JSON.parse(localStorage.getItem(progressKey) || '[]')
    return Array.isArray(cached) ? cached : []
  } catch {
    return []
  }
}

export function saveProgressCache(puzzles: PuzzleSummary[]) {
  try {
    localStorage.setItem(progressKey, JSON.stringify(puzzles))
  } catch {
    // Storage may be blocked or full; server progress still works.
  }
}
