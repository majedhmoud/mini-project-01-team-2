import type { FormEvent } from 'react'

interface AnswerFormProps {
  answer: string
  pending: boolean
  disabled: boolean
  onAnswerChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function AnswerForm({ answer, pending, disabled, onAnswerChange, onSubmit }: AnswerFormProps) {
  return (
    <form className="answer-form" onSubmit={onSubmit} aria-busy={pending}>
      <label htmlFor="puzzle-answer">Your answer</label>
      <p className="input-note" id="answer-note">Enter the word or code that solves this stage.</p>
      <div className="answer-controls">
        <input id="puzzle-answer" className="answer-input" type="text" value={answer} onChange={(event) => onAnswerChange(event.target.value)} disabled={disabled} autoComplete="off" aria-describedby="answer-note" />
        <button className="action-button" type="submit" disabled={disabled || !answer.trim()}>{pending ? 'Checking answer…' : 'Submit answer'}</button>
      </div>
    </form>
  )
}

export default AnswerForm
