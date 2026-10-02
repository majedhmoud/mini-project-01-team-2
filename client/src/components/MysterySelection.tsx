import { useEffect } from "react";
import { Link } from "react-router-dom";
import { loadMysteries } from "../features/mystery/mysterySlice";
import { useAppDispatch, useAppSelector } from "../hooks";

function MysterySelection() {
  const dispatch = useAppDispatch();
  const { listings, listStatus, listError } = useAppSelector(
    (state) => state.mystery,
  );

  useEffect(() => {
    dispatch(loadMysteries());
  }, [dispatch]);

  return (
    <main className="app-main">
      <section
        className="content-panel mysteries-page"
        aria-labelledby="mysteries-title"
      >
        <div className="page-heading">
          <p className="eyebrow">The archive / open case files</p>
          <h1 id="mysteries-title">Mystery Room</h1>
          <p className="page-intro">
            Read the evidence. Test your theory. Every wrong guess is another
            clue.
          </p>
        </div>

        {listStatus === "loading" && (
          <p className="list-state" role="status">
            Opening the case archive...
          </p>
        )}
        {listStatus === "failed" && (
          <div className="list-error" role="alert">
            <p>{listError ?? "The case archive could not be opened."}</p>
            <button
              className="button button--gold"
              onClick={() => dispatch(loadMysteries())}
            >
              Retry archive
            </button>
          </div>
        )}
        {listStatus === "succeeded" && listings.length === 0 && (
          <p className="list-state">No case files are available yet.</p>
        )}
        {listings.length > 0 && (
          <div className="case-grid">
            {listings.map((mystery, index) => (
              <article
                className={`mystery-card${mystery.available === false ? " mystery-card--locked" : ""}`}
                key={mystery.id}
              >
                <div className="mystery-card__topline">
                  <span className="case-index">
                    CASE {String(index + 1).padStart(3, "0")}
                  </span>
                  <span
                    className={
                      mystery.available === false ? "lock-mark" : "status-dot"
                    }
                    aria-label={
                      mystery.available === false ? "Unavailable" : "Available"
                    }
                  />
                </div>
                <div>
                  <p className="mystery-card__type">
                    {mystery.difficulty ?? "Open investigation"}
                  </p>
                  <h2 className="mystery-card__title">{mystery.title}</h2>
                  <p className="mystery-card__description">{mystery.summary}</p>
                </div>
                <div className="mystery-card__meta">
                  {mystery.durationMinutes !== undefined && (
                    <span>{mystery.durationMinutes} min</span>
                  )}
                  {mystery.stageCount !== undefined && (
                    <span>{mystery.stageCount} stages</span>
                  )}
                </div>
                {mystery.available === false ? (
                  <button
                    className="button button--disabled mystery-card__action"
                    disabled
                  >
                    Coming soon
                  </button>
                ) : (
                  <Link
                    className="button button--gold mystery-card__action"
                    to={`/mysteries/${encodeURIComponent(mystery.id)}`}
                  >
                    Investigate <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
        {listStatus === "succeeded" && listings.length > 0 && (
          <p className="archive-note">
            <span aria-hidden="true">✦</span> Choose a case to begin
            investigating.
          </p>
        )}
      </section>
    </main>
  );
}

export default MysterySelection;
