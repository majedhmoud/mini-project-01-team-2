# Puzzle API

JavaScript ES modules and Express. Run in a separate terminal:

```sh
cd server
npm install
npm start
```

Default port: `3001`. Set `PORT` in your environment or a local `.env` to change it; also update the frontend Vite proxy target. Never commit `.env`.

## Requests

```sh
curl http://localhost:3001/api/getAllPuzzles
curl http://localhost:3001/api/getPuzzle/1
curl -X POST http://localhost:3001/api/submitAnswer/1 -H 'Content-Type: application/json' -d '{"stageId":1,"answer":"wrong"}'
curl -X PATCH http://localhost:3001/api/requestStageHint/1 -H 'Content-Type: application/json' -d '{"stageId":1}'
```

GET collection returns `{ puzzles: [{ id, title, summary, locked, progress }] }`. GET detail returns the opening story, current stage, and progress. POST returns `{ correct, message, puzzle }`; a wrong answer is normal `200` feedback. PATCH returns `{ hintId, hint, puzzle }` for the next unused hint. Both mutations include updated public detail.

Path IDs are positive integer strings. Body `stageId` is a positive integer number; `answer` is a nonempty string. Matching uses `trim().toLowerCase()` against all listed variants, preserving internal spaces, punctuation, and PIN strings.

Errors return `{ message }`: `400` invalid input/JSON, `403` locked puzzle (detail, answer, or hint request), `404` nonexistent puzzle/stage/endpoint, `409` existing non-current stage, solved mutation, or exhausted hints. Failed requests do not change progress.

## State

`data.js` contains the original puzzles; only `store.js` imports it. One in-memory progress record per puzzle is shared by every visitor. Puzzles unlock in seed order only when all earlier puzzles are solved. The shared controller ID check enforces this for detail and both mutations. GET never changes progress. Browser reload retains progress; server restart resets all puzzles. Hint indices start at zero and are meaningful only within their puzzle/stage. Only requested hints and current-stage content are public; answers and future stages are never returned, and `finalReveal` is present only after completion. No accounts, database, persistence, or reset endpoint.
