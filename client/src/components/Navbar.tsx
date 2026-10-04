import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-content">
        <Link to="/" className="brand" aria-label="Mystery Room home">
          <span className="brand-mark" aria-hidden="true">
            Mr
          </span>
          <span>
            Mystery Room
            <span className="brand-caption">Team 2 · Puzzle archive</span>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            Puzzles
          </NavLink>
          <NavLink
            to="/how-to-play"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            How to Play
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
