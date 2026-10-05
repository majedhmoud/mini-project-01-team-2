import express from "express";
import {
  getAllPuzzles,
  getPuzzleById,
  getCluesById,
  submitAnswer,
  requestHints,
} from "../controllers/puzzles.js";

const router = express.Router();

router.get("/getAllPuzzles", getAllPuzzles);
router.get("/getPuzzleById/:id", getPuzzleById);
router.get("/getCluesById/:id/clues", getCluesById);
router.post("/submitAnswer/:id/answers", submitAnswer);
router.patch("/requestHints/:id/hint", requestHints);

// Keep the existing frontend URLs working while Majed rebuilds the client.
router.get("/getPuzzle/:id", getPuzzleById);
router.post("/submitAnswer/:id", submitAnswer);

export default router;
