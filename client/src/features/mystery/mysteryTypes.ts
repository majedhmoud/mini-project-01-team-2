export type MysteryClue = {
  id: string;
  title: string;
  detail: string;
};

export type MysteryStage = {
  id: string;
  title: string;
  prompt: string;
  clues: MysteryClue[];
};

export type MysteryReveal = {
  title: string;
  verdict: string;
  details: string;
};

export type Mystery = {
  id: string;
  title: string;
  summary: string;
  stageIndex: number;
  stages: MysteryStage[];
  solved: boolean;
  reveal?: MysteryReveal;
};

export type AnswerResponse = {
  correct: boolean;
  message: string;
  mystery: Mystery;
};

export type HintResponse = {
  hint: string;
  mystery?: Mystery;
};
