import {  getAllPuzzles,
  getPuzzle,
  submitAnswer,
  requestStageHint } from "../controllers/puzzles.js";

import express from "express";
const router = express.Router();

router.get("/", getAllPuzzles);
router.get("/:puzzleId", getPuzzle);
router.post("/:puzzleId/answers", submitAnswer);
router.patch("/:puzzleId/hints", requestStageHint);

export default router;