import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPuzzle, submitAnswer, requestStageHint } from '../api'
import type { ApiError, PuzzleDetail } from '../types'
import LoadingMessage from './LoadingMessage'
import ErrorMessage from './ErrorMessage'
import StageHeading from './StageHeading'
import ClueList from './ClueList'
import AnswerForm from './AnswerForm'
import AnswerFeedback from './AnswerFeedback'
import HintPanel from './HintPanel'

interface PuzzleSectionProps {
  puzzleId: number
}

function PuzzleSection({ puzzleId }: PuzzleSectionProps) {
  const navigate = useNavigate()
  const [puzzle, setPuzzle] = useState<PuzzleDetail | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingAction, setPendingAction] = useState<'answer' | 'hint' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const mounted = useRef(false)
  const actionLocked = useRef(false)
  const stageId = useRef<number | null>(null)

  useEffect(() => {
    let active = true
    mounted.current = true
    async function loadPuzzle() {
      setLoading(true)
      setError(null)
      setActionError(null)
      try {
        const data = await getPuzzle(puzzleId)
        if (!active) return
        if (stageId.current !== null && stageId.current !== data.progress.currentStageId) {
          setAnswer('')
          setFeedback(null)
        }
        stageId.current = data.progress.currentStageId
        setPuzzle(data)
      } catch (error) {
        if (active && (error as ApiError)?.status === 403) navigate('/', { replace: true })
        else if (active) setError(error instanceof Error ? error.message : 'Could not load this puzzle.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadPuzzle()
    return () => { active = false; mounted.current = false }
  }, [puzzleId, retryCount, navigate])

  useEffect(() => {
    if (puzzle?.progress.solved) navigate(`/puzzles/${puzzleId}/result`, { replace: true })
  }, [puzzle, puzzleId, navigate])

  function handleAnswerChange(value: string) {
    setAnswer(value)
  }

  async function handleActionError(error: unknown) {
    if (!mounted.current) return
    if ((error as ApiError)?.status === 403) {
      navigate('/', { replace: true })
      return
    }
    setActionError(error instanceof Error ? error.message : 'The request failed. Please try again.')
    if ((error as ApiError)?.status === 409) {
      try {
        const data = await getPuzzle(puzzleId)
        if (!mounted.current) return
        if (stageId.current !== data.progress.currentStageId) {
          setAnswer('')
          setFeedback(null)
        }
        stageId.current = data.progress.currentStageId
        setPuzzle(data)
      } catch (reloadError) {
        if (mounted.current && (reloadError as ApiError)?.status === 403) navigate('/', { replace: true })
        else if (mounted.current) setError(reloadError instanceof Error ? reloadError.message : 'Could not refresh this puzzle.')
      }
    }
  }

  async function handleSubmitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (actionLocked.current || loading || !puzzle?.currentStage || !answer.trim()) return
    actionLocked.current = true
    setPendingAction('answer')
    setActionError(null)
    setFeedback(null)
    try {
      const result = await submitAnswer(puzzleId, puzzle.currentStage.id, answer)
      if (!mounted.current) return
      stageId.current = result.puzzle.progress.currentStageId
      setPuzzle(result.puzzle)
      setFeedback({ correct: result.correct, message: result.message })
      if (result.correct) setAnswer('')
    } catch (error) {
      await handleActionError(error)
    } finally {
      actionLocked.current = false
      if (mounted.current) setPendingAction(null)
    }
  }

  async function handleRequestHint() {
    if (actionLocked.current || loading || !puzzle?.currentStage || puzzle.currentStage.hintsRemaining === 0) return
    actionLocked.current = true
    setPendingAction('hint')
    setActionError(null)
    try {
      const result = await requestStageHint(puzzleId, puzzle.currentStage.id)
      if (!mounted.current) return
      stageId.current = result.puzzle.progress.currentStageId
      setPuzzle(result.puzzle)
    } catch (error) {
      await handleActionError(error)
    } finally {
      actionLocked.current = false
      if (mounted.current) setPendingAction(null)
    }
  }

  const busy = pendingAction !== null
  return (
    <section className="panel puzzle-panel" aria-busy={loading || busy}>
      <Link className="back-link" to="/">← Back to puzzles</Link>
      {loading ? <LoadingMessage message="Opening the case file…" />
        : error ? <><h1>Unable to open this puzzle</h1><ErrorMessage message={error} onRetry={() => setRetryCount((count) => count + 1)} /></>
        : puzzle?.progress.solved ? <LoadingMessage message="Opening the final reveal…" />
        : puzzle?.currentStage && <>
          <p className="eyebrow">Case {String(puzzle.id).padStart(2, '0')}</p>
          <h1>{puzzle.title}</h1>
          <p className="puzzle-story">{puzzle.story}</p>
          <div className="gameplay-layout">
            <div className="gameplay-main">
              <StageHeading stage={puzzle.currentStage} progress={puzzle.progress} />
              <ClueList key={puzzle.currentStage.id} clues={puzzle.currentStage.clues} />
              <AnswerForm answer={answer} pending={pendingAction === 'answer'} disabled={busy} onAnswerChange={handleAnswerChange} onSubmit={handleSubmitAnswer} />
              {feedback && <AnswerFeedback correct={feedback.correct} message={feedback.message} />}
              {actionError && <ErrorMessage message={actionError} />}
            </div>
            <HintPanel hints={puzzle.currentStage.revealedHints} hintsRemaining={puzzle.currentStage.hintsRemaining} pending={pendingAction === 'hint'} disabled={busy} onRequestHint={handleRequestHint} />
          </div>
        </>}
    </section>
  )
}

export default PuzzleSection
