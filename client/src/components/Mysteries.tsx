type MysteriesProps = {
  onInvestigate: () => void;
};

function Mysteries({ onInvestigate }: MysteriesProps) {
  return (
    <section
      className="content-panel mysteries-page"
      aria-labelledby="mysteries-title"
    >
      <div className="page-heading">
        <p className="eyebrow">The archive / open cases</p>
        <h1 id="mysteries-title">Mystery Room</h1>
        <p className="page-intro">
          Pick a case. Read the evidence. Submit what you think is true.
          <br className="desktop-break" /> Every wrong guess is just another
          clue.
        </p>
      </div>

      <div className="case-grid">
        <article className="mystery-card">
          <div className="mystery-card__topline">
            <span className="case-index">CASE 001</span>
            <span className="status-dot" aria-label="Available" />
          </div>
          <div>
            <p className="mystery-card__type">Astronomy / disappearance</p>
            <h2 className="mystery-card__title">The Sealed Observatory</h2>
            <p className="mystery-card__description">
              Dr. Voss vanished the night the comet passed. Her notes are still
              warm.
            </p>
          </div>
          <div className="mystery-card__meta" aria-label="Case details">
            <span className="difficulty">Medium</span>
            <span>15 min</span>
            <span>3 stages</span>
          </div>
          <button
            className="button button--gold mystery-card__action"
            onClick={onInvestigate}
          >
            Investigate <span aria-hidden="true">→</span>
          </button>
        </article>

        <article
          className="mystery-card mystery-card--locked"
          aria-disabled="true"
        >
          <div className="mystery-card__topline">
            <span className="case-index">CASE 002</span>
            <span className="lock-mark" aria-label="Locked">
              ◇
            </span>
          </div>
          <div>
            <p className="mystery-card__type">Coastal / missing person</p>
            <h2 className="mystery-card__title">The Hollow Lighthouse</h2>
            <p className="mystery-card__description">
              The keeper's logbook stopped mid-sentence. This file is still
              sealed.
            </p>
          </div>
          <div className="mystery-card__meta">
            <span className="difficulty difficulty--hard">Hard</span>
            <span>20 min</span>
            <span>Coming soon</span>
          </div>
          <button
            className="button button--disabled mystery-card__action"
            disabled
          >
            Coming soon
          </button>
        </article>
      </div>
      <p className="archive-note">
        <span aria-hidden="true">✦</span> More case files are being prepared.
      </p>
    </section>
  );
}

export default Mysteries;
