import express from "express";
import { getAllPuzzles, getPuzzle, submitAnswer, requestStageHint } from "../controllers/puzzles.js";

const puzzlesRouter = express.Router();
puzzlesRouter.get("/getAllPuzzles", getAllPuzzles);
puzzlesRouter.get("/getPuzzle/:puzzleId", getPuzzle);
puzzlesRouter.post("/submitAnswer/:puzzleId", submitAnswer);
puzzlesRouter.patch("/requestStageHint/:puzzleId", requestStageHint);

export { puzzlesRouter };
