import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  clearFeedback,
  loadMystery,
  requestHint,
  submitAnswer,
} from "../features/mystery/mysterySlice";
import type { MysteryClue } from "../features/mystery/mysteryTypes";

function ClueCard({ clue, index }: { clue: MysteryClue; index: number }) {
  return (
    <article className="clue-card">
      <span className="clue-card__index">
        EVIDENCE {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3>{clue.title}</h3>
        <p>{clue.detail}</p>
      </div>
    </article>
  );
}

function MysteryRoom() {
  const { mysteryId = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    current: mystery,
    loadStatus,
    isSubmitting,
    isRequestingHint,
    error,
    mutationError,
    feedback,
    hint,
  } = useAppSelector((state) => state.mystery);
  const [answer, setAnswer] = useState("");
  const activeStage = mystery?.stages[mystery.stageIndex];

  useEffect(() => {
    dispatch(loadMystery(mysteryId));
    setAnswer("");
  }, [dispatch, mysteryId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mystery || !activeStage || !answer.trim() || isSubmitting) return;

    const result = await dispatch(
      submitAnswer({
        mysteryId,
        stageId: activeStage.id,
        answer: answer.trim(),
      }),
    );
    setAnswer("");
    if (
      submitAnswer.fulfilled.match(result) &&
      result.payload.correct &&
      result.payload.mystery.solved
    ) {
      navigate(`/mysteries/${encodeURIComponent(mysteryId)}/result`);
    }
  }

  function handleHint() {
    if (!mystery || !activeStage || isRequestingHint) return;
    dispatch(requestHint({ mysteryId, stageId: activeStage.id }));
  }

  if (loadStatus === "loading" || loadStatus === "idle") {
    return (
      <main className="mystery-route">
        <section className="content-panel request-state" aria-live="polite">
          <span className="loading-mark" aria-hidden="true">
            ✦
          </span>
          <p className="eyebrow">Opening case file</p>
          <h1>Gathering the evidence</h1>
          <p>The observatory records are being brought to your desk.</p>
        </section>
      </main>
    );
  }

  if (loadStatus === "failed" || !mystery) {
    return (
      <main className="mystery-route">
        <section
          className="content-panel request-state request-state--error"
          role="alert"
        >
          <p className="eyebrow">Case file unavailable</p>
          <h1>We could not open this mystery</h1>
          <p>{error ?? "The requested case was not found."}</p>
          <button
            className="button button--gold"
            onClick={() => dispatch(loadMystery(mysteryId))}
          >
            Retry loading
          </button>
          <Link className="text-button" to="/">
            Return to case files
          </Link>
        </section>
      </main>
    );
  }

  if (mystery.solved) {
    return (
      <Navigate
        to={`/mysteries/${encodeURIComponent(mysteryId)}/result`}
        replace
      />
    );
  }

  if (!activeStage) {
    return (
      <main className="mystery-route">
        <section
          className="content-panel request-state request-state--error"
          role="alert"
        >
          <p className="eyebrow">Incomplete case data</p>
          <h1>This case has no active stage</h1>
          <p>
            Reload the case file or check the mystery response from the API.
          </p>
          <button
            className="button button--gold"
            onClick={() => dispatch(loadMystery(mysteryId))}
          >
            Reload case
          </button>
          <Link className="text-button" to="/">
            Return to case files
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mystery-route">
      <section
        className="content-panel gameplay-page"
        aria-labelledby="case-title"
      >
        <div className="gameplay-links">
          <Link className="text-button" to="/">
            ← All case files
          </Link>
        </div>
        <p className="eyebrow">Case file / active investigation</p>
        <h1 id="case-title">{mystery.title}</h1>
        <p className="case-summary">{mystery.summary}</p>

        <div className="stage-heading">
          <div>
            <p className="eyebrow">Investigation stage</p>
            <h2>{activeStage.title}</h2>
          </div>
          <span className="stage-count">
            {String(mystery.stageIndex + 1).padStart(2, "0")} /{" "}
            {String(mystery.stages.length).padStart(2, "0")}
          </span>
        </div>
        <div
          className="stage-track"
          role="progressbar"
          aria-label="Case progress"
          aria-valuemin={0}
          aria-valuemax={mystery.stages.length}
          aria-valuenow={mystery.stageIndex + 1}
        >
          {mystery.stages.map((stage, index) => (
            <span
              key={stage.id}
              className={`stage-track__segment${index <= mystery.stageIndex ? " is-current" : ""}`}
            />
          ))}
        </div>
        <p className="stage-prompt">{activeStage.prompt}</p>

        <div className="clue-list" aria-label="Evidence">
          {activeStage.clues.map((clue, index) => (
            <ClueCard key={clue.id} clue={clue} index={index} />
          ))}
        </div>

        <form className="answer-form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="case-answer">
            Your answer
          </label>
          <input
            id="case-answer"
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              if (feedback || mutationError) dispatch(clearFeedback());
            }}
            placeholder="Enter your theory..."
            autoComplete="off"
            disabled={isSubmitting}
          />
          <button
            className="button button--gold"
            type="submit"
            disabled={!answer.trim() || isSubmitting}
          >
            {isSubmitting ? "Checking evidence..." : "Submit answer"}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        {feedback && (
          <p className={`feedback feedback--${feedback.kind}`} role="status">
            <span aria-hidden="true">
              {feedback.kind === "success" ? "✓" : "!"}
            </span>
            {feedback.message}
          </p>
        )}
        {mutationError && (
          <p className="feedback feedback--error" role="alert">
            <span aria-hidden="true">!</span>
            {mutationError}
          </p>
        )}

        <div className="hint-area">
          {!hint && (
            <button
              className="button button--outline hint-button"
              onClick={handleHint}
              disabled={isRequestingHint}
            >
              {isRequestingHint ? "Looking for a hint..." : "Use a hint"}
            </button>
          )}
          {hint && (
            <p className="hint-copy">
              <strong>Investigator's note:</strong> {hint}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default MysteryRoom;
