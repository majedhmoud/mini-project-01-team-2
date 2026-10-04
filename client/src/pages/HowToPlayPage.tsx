import { Link } from "react-router-dom";

function HowToPlayPage() {
  return (
    <section className="panel how-to-play-page">
      <p className="eyebrow">Before you investigate</p>
      <h1>How to Play</h1>
      <p className="intro">
        Everything you need is in the evidence. Take your time and follow the
        clues.
      </p>
      <ol className="instruction-list">
        <li className="instruction-step">
          <h2>Start with level one</h2>
          <p>
            Read its summary and select Investigate. Puzzles two and three
            unlock only after every earlier puzzle is solved.
          </p>
        </li>
        <li className="instruction-step">
          <h2>Read the clues</h2>
          <p>
            Each puzzle has three stages. Use the current question and clues to
            find an answer.
          </p>
        </li>
        <li className="instruction-step">
          <h2>Submit your answer</h2>
          <p>
            Type a word or code and select Submit answer, or press Enter. Wrong
            answers allow another attempt; correct answers open the next stage.
          </p>
        </li>
        <li className="instruction-step">
          <h2>Ask for a hint</h2>
          <p>
            Each stage has two hints. Request them one at a time. Revealed hints
            remain available when you reload.
          </p>
        </li>
        <li className="instruction-step">
          <h2>Reach the reveal</h2>
          <p>
            Complete all three stages to unlock the original ending. You can
            then return to the archive and investigate the next unlocked level.
          </p>
        </li>
      </ol>
      <div className="message">
        <p>
          Progress is shared with everyone using this game server. Reloading
          keeps progress; restarting the server resets all puzzles.
        </p>
      </div>
      <Link className="action-button" to="/">
        Choose a puzzle <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

export default HowToPlayPage;
