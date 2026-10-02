import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { loadMystery } from "../features/mystery/mysterySlice";
import { useAppDispatch, useAppSelector } from "../hooks";

function MysteryReveal() {
  const { mysteryId = "" } = useParams();
  const dispatch = useAppDispatch();
  const {
    current: mystery,
    loadStatus,
    error,
  } = useAppSelector((state) => state.mystery);
  const matchesRoute = mystery?.id === mysteryId;

  useEffect(() => {
    if (!matchesRoute) dispatch(loadMystery(mysteryId));
  }, [dispatch, matchesRoute, mysteryId]);

  if (!matchesRoute && (loadStatus === "idle" || loadStatus === "loading")) {
    return (
      <main className="mystery-route">
        <section className="content-panel request-state" aria-live="polite">
          <span className="loading-mark" aria-hidden="true">
            ✦
          </span>
          <p className="eyebrow">Verifying case outcome</p>
          <h1>Checking the final evidence</h1>
          <p>The case server is retrieving the final result.</p>
        </section>
      </main>
    );
  }

  if (!matchesRoute && loadStatus === "failed") {
    return (
      <main className="mystery-route">
        <section
          className="content-panel request-state request-state--error"
          role="alert"
        >
          <p className="eyebrow">Reveal unavailable</p>
          <h1>We could not retrieve this case</h1>
          <p>{error ?? "The case result could not be loaded."}</p>
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

  if (!mystery) return null;
  if (!mystery.solved) {
    return (
      <Navigate to={`/mysteries/${encodeURIComponent(mysteryId)}`} replace />
    );
  }

  return (
    <main className="mystery-route">
      <section
        className="content-panel reveal-page"
        aria-labelledby="reveal-title"
      >
        <p className="eyebrow">Case closed / final reveal</p>
        <div className="reveal-seal" aria-hidden="true">
          ✦
        </div>
        <h1 id="reveal-title">{mystery.reveal?.title ?? mystery.title}</h1>
        <p className="reveal-verdict">
          {mystery.reveal?.verdict ?? "The evidence has led to the truth."}
        </p>
        {mystery.reveal?.details && (
          <div className="reveal-copy">
            <p>{mystery.reveal.details}</p>
          </div>
        )}
        <div className="reveal-stats">
          <span>
            <strong>{mystery.stages.length}</strong> stages solved
          </span>
          <span>
            <strong>1</strong> case closed
          </span>
        </div>
        <button
          className="button button--gold"
          onClick={() => dispatch(loadMystery(mysteryId))}
        >
          Review case
        </button>
        <p className="reveal-return">
          <Link className="text-button" to="/">
            Return to case files
          </Link>
        </p>
      </section>
    </main>
  );
}

export default MysteryReveal;
