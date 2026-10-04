export interface PuzzleSummary {
  id: number
  title: string
  summary: string
  locked: boolean
  progress: PuzzleProgress
}

export interface PuzzleListResponse {
  puzzles: PuzzleSummary[]
}

export interface RevealedHint {
  hintId: number
  hint: string
}

export interface PuzzleStage {
  id: number
  title: string
  question: string
  clues: string[]
  revealedHints: RevealedHint[]
  hintsRemaining: number
}

export interface PuzzleProgress {
  currentStageId: number | null
  completedStages: number
  totalStages: number
  solved: boolean
}

export interface PuzzleDetail extends PuzzleSummary {
  story: string
  progress: PuzzleProgress
  currentStage: PuzzleStage | null
  finalReveal?: string
}

export interface SubmitAnswerResponse {
  correct: boolean
  message: string
  puzzle: PuzzleDetail
}

export interface StageHintResponse {
  hintId: number
  hint: string
  puzzle: PuzzleDetail
}

export interface ApiError extends Error {
  status?: number
}
