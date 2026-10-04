import type { RevealedHint } from '../types'

interface HintPanelProps {
  hints: RevealedHint[]
  hintsRemaining: number
  pending: boolean
  disabled: boolean
  onRequestHint: () => void
}

function HintPanel({ hints, hintsRemaining, pending, disabled, onRequestHint }: HintPanelProps) {
  return (
    <aside className="hint-panel" aria-busy={pending}>
      <p className="eyebrow">A nudge in the right direction</p>
      <h2>Stage hints</h2>
      <p className="hint-note">{hintsRemaining} {hintsRemaining === 1 ? 'hint' : 'hints'} remaining for this stage.</p>
      <div aria-live="polite">
        {hints.length === 0 ? <p className="hint-note">Need another angle? Reveal one hint at a time.</p>
          : <ol className="hint-list">{hints.map(({ hintId, hint }) => <li key={hintId}><h3>Hint {hintId + 1}</h3><p>{hint}</p></li>)}</ol>}
      </div>
      <button className="action-button secondary" type="button" disabled={disabled || hintsRemaining === 0} onClick={onRequestHint}>{pending ? 'Revealing hint…' : hintsRemaining === 0 ? 'All hints revealed' : hints.length > 0 ? 'Reveal next hint' : 'Reveal a hint'}</button>
    </aside>
  )
}

export default HintPanel
