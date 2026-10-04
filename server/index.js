import express from "express";
import dotenv from "dotenv";
import { puzzlesRouter } from "./routes/puzzles.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use("/api", puzzlesRouter);
app.use((req, res) => res.status(404).json({ message: "API endpoint not found." }));

function handleJsonParseError(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }
  next(err);
}
app.use(handleJsonParseError);

app.listen(PORT, () => {
  console.log(`Puzzle API running at http://localhost:${PORT}`);
});
