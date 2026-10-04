import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="panel">
      <p className="eyebrow">Page not found</p>
      <h1>This path leads nowhere.</h1>
      <p className="intro">
        Check the address or return to the puzzle archive.
      </p>
      <Link className="action-button" to="/">
        Back to puzzles
      </Link>
    </section>
  );
}

export default NotFoundPage;
