import type { PuzzleStage, PuzzleProgress } from "../types";

interface StageHeadingProps {
  stage: PuzzleStage;
  progress: PuzzleProgress;
}

function StageHeading({ stage, progress }: StageHeadingProps) {
  return (
    <div className="stage-heading">
      <p className="eyebrow">
        Stage {progress.completedStages + 1} of {progress.totalStages}
      </p>
      <h2>{stage.title}</h2>
      <p className="stage-question">{stage.question}</p>
      <progress
        className="stage-progress"
        value={progress.completedStages}
        max={progress.totalStages}
        aria-label="Completed stages"
      />
    </div>
  );
}

export default StageHeading;
