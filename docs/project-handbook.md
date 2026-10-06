# Puzzle Lab — Project Handbook

Developer guide for **Mini Project 01, Team 2**.

## 1. Project overview

Puzzle Lab is a browser game with three ordered puzzles. Players read a story, investigate clues, submit stage answers, and request hints. Completing a puzzle reveals its ending and unlocks the next level.

| Level | Puzzle                    | Home card difficulty | Unlock condition       |
| ----- | ------------------------- | -------------------- | ---------------------- |
| 1     | The Heisenberg Formula    | Easy                 | Available immediately  |
| 2     | The Los Pollos Logistics  | Medium               | Puzzle 1 solved        |
| 3     | The Desert Cache Protocol | Hard                 | Puzzles 1 and 2 solved |

Each puzzle has three stages. Each stage has two hints. The difficulty badges are fixed labels assigned by puzzle ID.

The project uses React and TypeScript in the client, and JavaScript with Express in the server. It has no database, accounts, authentication, score, timer, or replay/reset API.

## 2. Start the project

Install Node.js and npm before starting. The repository does not pin a Node.js version. The client and server have separate package files and lockfiles; there is no root start command.

Clone the repository if needed:

```sh
git clone https://github.com/majedhmoud/mini-project-01-team-2.git
cd mini-project-01-team-2
```

In the first terminal, start Express:

```sh
cd server
npm ci
npm start
```

In the second terminal, from the repository root, start Vite:

```sh
cd client
npm ci
npm run dev
```

`npm ci` installs the dependencies recorded in each lockfile. `npm install` is also available when intentionally changing dependencies.

Open the URL printed by Vite, normally `http://localhost:5173`. Express defaults to `http://localhost:3001`.

### Development proxy

The client calls relative URLs such as `/api/getAllPuzzles`. `client/vite.config.ts` forwards `/api` requests to `http://localhost:3001` during development.

`server/index.js` loads environment variables with dotenv. Set `PORT` in the server environment or a local `.env` file to change the backend port. If you change it, update the Vite proxy target too. Keep `.env` files local.

A client production build does not start Express or configure production API hosting. Deployment is outside the project scope.

## 3. Technology and conventions

| Area              | Current tools                                                        |
| ----------------- | -------------------------------------------------------------------- |
| Frontend          | React 18, TypeScript, React Router 6                                 |
| Development/build | Vite 5                                                               |
| Styling           | Plain CSS in `client/css/index.css`                                  |
| Backend           | Node.js, Express 5, JavaScript ES modules                            |
| Configuration     | dotenv, separate client/server package files                         |
| Checks            | TypeScript, ESLint, backend syntax checks, manual API/browser checks |

Keep implementation close to the teacher's patterns: named functions, `async`/`await`, plain conditionals, array methods, separate routes/controllers, and one backend state owner. `toLowerCase()` is the agreed exception used for case-insensitive answer matching.

Use shared components where they help reuse. UI used only inside gameplay—stage heading, clues, hints, feedback, and final reveal—currently stays inside `PuzzleSection.tsx`. Do not split every piece into another component.

Do not add a database, authentication, Redux async tooling, a validation library, or additional architecture layers for this project. The agreed requirements are in `docs/team/requirements.md`.

## 4. Repository structure

```text
client/
├── css/
│   └── index.css
├── src/
│   ├── components/
│   │   ├── ErrorMessage.tsx
│   │   ├── Header.tsx
│   │   ├── PuzzleCard.tsx
│   │   ├── PuzzleSection.tsx
│   │   ├── PuzzlesSection.tsx
│   │   └── SubmitAnswerForm.tsx
│   ├── pages/
│   │   ├── HowToPlayPage.tsx
│   │   └── PuzzlePage.tsx
│   ├── App.tsx
│   ├── api.ts
│   ├── main.tsx
│   └── types.ts
└── index.html


server/
├── controllers/
│   └── puzzles.js
├── routes/
│   └── puzzles.js
├── postman/
│   ├── README.md
│   └── mini-project-01-team-02.postman_collection.json
├── data.js
├── store.js
└── index.js

docs/
├── instructions/
├── phase-1-agreement/
├── project-screenshots/
├── tasks-handoff/
└── team/

```

The tree lists the main development files. README and historical verification files also exist. Dependencies and generated build output are ignored.

## 5. Frontend responsibilities

| File                   | Responsibility                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `main.tsx`             | Mounts React, wraps the application with `BrowserRouter` and `StrictMode`, and imports global CSS |
| `App.tsx`              | Renders the shared header and declares application routes                                         |
| `Header.tsx`           | Puzzle Lab logo and links to Puzzles and How to Play                                              |
| `PuzzlesSection.tsx`   | Loads the puzzle summaries; shows loading, error/retry, and puzzle cards                          |
| `PuzzleCard.tsx`       | Title, summary, difficulty, and an Investigate link or disabled locked button                     |
| `PuzzlePage.tsx`       | Reads `puzzleId` and gives `PuzzleSection` a key based on it                                      |
| `PuzzleSection.tsx`    | Loads details, submits answers, requests hints, and renders gameplay or completion                |
| `SubmitAnswerForm.tsx` | Owns the answer input and submission state; calls the supplied callback                           |
| `ErrorMessage.tsx`     | Shared loading-failure message and Retry button                                                   |
| `HowToPlayPage.tsx`    | Five short instructions and a link back to the puzzles                                            |
| `api.ts`               | Four fetch helpers used by the frontend                                                           |
| `types.ts`             | Public response interfaces used by the client                                                     |
| `css/index.css`        | Shared shell, logo, cards, gameplay, hints, form, feedback, results, and responsive styles        |

### Routes

| URL                  | Screen                                               |
| -------------------- | ---------------------------------------------------- |
| `/`                  | Puzzle selection                                     |
| `/puzzles/:puzzleId` | Current puzzle gameplay, or final reveal when solved |
| `/how-to-play`       | Instructions                                         |
| Any unmatched route  | Page not found with a return link                    |

There is no separate `/result` route in the current code. Solved and unfinished views use the same puzzle URL.

## 6. Backend responsibilities and state

### Files

- `index.js` creates Express, enables JSON request parsing, mounts the puzzle router at `/api`, and starts listening.
- `routes/puzzles.js` declares the five HTTP routes and connects them to controllers.
- `controllers/puzzles.js` validates requests, reads or changes progress, and returns responses.
- `data.js` exports `puzzlesData`, containing the stories, stages, clues, accepted answers, hints, and endings.
- `store.js` imports the seed data, creates runtime progress, and exports `isPuzzleLocked()` and `getPublicPuzzle()`.

### Seed data

The top-level object is `puzzlesData`, with a `puzzles` array. Each puzzle has `id`, `title`, `summary`, `story`, `stages`, and `finalReveal`. Each stage has `id`, `title`, `question`, `clues`, `answers`, and `hints`.

Puzzle IDs are `1`, `2`, and `3`. Stage IDs are local to each puzzle and also run from `1` to `3`. Hint IDs start at `0` within a stage. Do not confuse a puzzle ID, stage ID, and hint ID.

Keep story changes deliberate and agreed. UI or cleanup work should not change the puzzle content.

### Runtime progress

`puzzleProgress` contains one record per puzzle:

```js
{
  id: 1,
  currentStageIndex: 0,
  solved: false,
  hintsByStage: [
    { stageId: 1, hintsUsed: 0 },
    { stageId: 2, hintsUsed: 0 },
    { stageId: 3, hintsUsed: 0 }
  ]
}
```

`currentStageIndex` is a zero-based array index and the count of completed stages. A correct answer increments it. When it equals the number of stages, the puzzle becomes solved.

Progress belongs to one running Express process and is shared by every visitor using it. Reloading the browser retains progress because it fetches the same server state. Restarting Express resets all stages, solved flags, and hint counts. A separate Express process has separate progress.

There is no client localStorage cache, `progressStorage.ts`, database, or dedicated frontend state store in the current version.

### Level locks and public data

`isPuzzleLocked(id)` checks whether any lower-ID puzzle is unfinished. The controllers enforce locks on details, clues, answers, and hints. Home cards display the server's `locked` field.

`getPublicPuzzle(id)` returns the current stage and previously revealed hints. It excludes accepted answers, unused hints, future stages, and the ending until the puzzle is solved.

## 7. API reference

Base URL: **`http://localhost:3001/api/`**.

Requests with a JSON body use `Content-Type: application/json`. No authentication is required. The path `:id` always identifies a puzzle.

| Controller      | Method | Path                        | Body                                  | Success response                           |
| --------------- | ------ | --------------------------- | ------------------------------------- | ------------------------------------------ |
| `getAllPuzzles` | GET    | `/getAllPuzzles`            | None                                  | Array of puzzle summaries                  |
| `getPuzzleById` | GET    | `/getPuzzleById/:id`        | None                                  | Public puzzle detail                       |
| `getCluesById`  | GET    | `/getCluesById/:id/clues`   | None                                  | Current stage clues as an array of strings |
| `submitAnswer`  | POST   | `/submitAnswer/:id/answers` | `{ "stageId": 1, "answer": "wrong" }` | `{ correct, puzzle }`                      |
| `requestHints`  | PATCH  | `/requestHints/:id/hint`    | `{ "stageId": 1 }`                    | `{ hintId, hint, puzzle }`                 |

Only these five routes are registered. Previous health and shorter puzzle/answer aliases are no longer present.

### Response fields

| Response      | Fields                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Summary       | `id`, `title`, `summary`, `locked`, `totalStages`, `completedStages`, `solved`                                          |
| Puzzle detail | `id`, `title`, `story`, `locked`, `totalStages`, `completedStages`, `solved`, `currentStage`; `finalReveal` when solved |
| Current stage | `id`, `title`, `question`, `clues`, `revealedHints`, `hintsRemaining`                                                   |
| Revealed hint | `hintId`, `hint`                                                                                                        |

`getAllPuzzles` returns an array directly, not `{ puzzles: [...] }`. A solved detail has `currentStage: null` and includes `finalReveal`.

The frontend currently calls four helpers: `getAllPuzzles`, `getPuzzleById`, `submitAnswer`, and `requestHints`. It reads clues from the detail response, so the standalone clues endpoint has no frontend helper. The endpoint remains available for API clients.

### Errors

Controller errors return `{ "message": "..." }`.

| Code | Meaning     | Controller cases                                                     |
| ---- | ----------- | -------------------------------------------------------------------- |
| 200  | OK          | Successful reads; correct or wrong answers; hint revealed            |
| 400  | Bad Request | Invalid puzzle ID, invalid stage ID, missing/blank/non-string answer |
| 403  | Forbidden   | Earlier puzzles are unfinished                                       |
| 404  | Not Found   | Puzzle or stage does not exist                                       |
| 409  | Conflict    | Puzzle solved, stage is not current, or hints exhausted              |

Puzzle path IDs are converted with `Number()`. Zero, negative, or nonnumeric IDs produce `400`; positive IDs without a matching puzzle produce `404`, including fractional values. Stage IDs must be positive numbers with a matching stage. The clues endpoint returns `409` when the puzzle is solved.

Validation is sequential: puzzle validity/existence/lock checks precede stage and answer checks. A request with multiple problems returns the first applicable error. Malformed JSON and unregistered paths use Express's default responses and may not have the controllers' JSON message shape.

### Postman

Import `server/postman/mini-project-01-team-02.postman_collection.json` through Postman's Import action. It contains five requests and 31 saved response examples. `Base_URL` is `http://localhost:3001/api/`.

[View the team's Postman documentation](https://documenter.getpostman.com/view/28699747/2sBYHNYPUM).

The default mutation bodies are for a fresh server. Sending a correct answer advances progress, so update the stage ID before sending later requests. Saved examples describe snapshots and their setup conditions; they do not reset the server or prepopulate a live Send response.

## 8. Gameplay flow

1. The home page fetches all summaries and displays the three difficulty cards.
2. The player opens an available puzzle. The detail API returns its current stage.
3. The player reads the story, question, and clues, then submits an answer or requests a hint.
4. Mutation responses replace the detail in React state; the server decides the next stage and hint availability.
5. After the third correct answer, `PuzzleSection` renders the final reveal at the same URL.
6. Completed puzzles 1 and 2 offer a Next puzzle link. Completed puzzle 3 offers Back to home.

The next-puzzle links use `puzzle.id + 1`, with puzzle `3` as the final level. Changing the number or IDs of puzzles requires reviewing this UI logic as well as the seed and lock logic.

## 9. Styling

The visual identity uses dark green backgrounds, cream text, and muted yellow actions. Key colors are `#071b12`, `#102b1c`, `#173b27`, `#f2ead5`, and `#d4be69`.

Keep styles in `client/css/index.css`. Preserve the current class names and teacher-style CSS unless a change is needed for an agreed feature.

## 10. Development checks

From the repository root:

```sh
npm --prefix client run build
npm --prefix client run lint
node --check server/index.js
node --check server/routes/puzzles.js
node --check server/controllers/puzzles.js
node --check server/store.js
node --check server/data.js
```

### Manual checks before handing off a change

| Area         | What to verify                                                                           |
| ------------ | ---------------------------------------------------------------------------------------- |
| Startup      | Both servers start; the client reaches Express through `/api`                            |
| Home         | Three cards appear; initial puzzle 2/3 buttons are disabled                              |
| Navigation   | Header links work; changing puzzle IDs loads the corresponding detail                    |
| Recovery     | Stop the backend, see a loading error, restart it, and use Retry                         |
| Answers      | Blank input cannot submit; a wrong answer stays on the stage; a correct answer advances  |
| Hints        | Each hint appears once in server order; exhausted hints cannot be requested successfully |
| Progress     | Reload retains stages/hints; restarting Express resets progress                          |
| Completion   | Exact ending appears; first two Next puzzle links and final Home link work               |
| API failures | Exercise 400, 403, 404, and 409 cases in Postman                                         |
| Layout       | Check wide and narrow screens, card alignment, and sticky navigation                     |

Use a separate test server process when you need to avoid advancing another person's shared progress. Keep its port and client proxy consistent, and stop it when finished.

## 11. Team roles and Git workflow

| Member | Branch         | Agreed area                                                          |
| ------ | -------------- | -------------------------------------------------------------------- |
| Majed  | `member-majed` | Leadership, API helpers, shared types, integration, and run guidance |
| Yazan  | `member-yazan` | Frontend selection, instructions, and shared styling                 |
| Badr   | `member-badr`  | Frontend gameplay and answer form                                    |
| Eyad   | `member-eyad`  | All backend APIs and state                                           |
| Maya   | `member-maya`  | Backend verification and bug reporting                               |
| Alaa   | `member-alaa`  | Hints and completion UI                                              |

`main` is the integration branch. Members work on their assigned branches; Majed integrates accepted changes. These roles describe the agreed responsibilities, not a claim about who authored each existing implementation.

Before starting work, commit or stash local changes. Then synchronize with the accepted shared version:

```sh
git switch member-yazan
git fetch origin
git merge origin/main
```

Use your own branch name in place of `member-yazan`. Resolve conflicts with the affected teammate, then run relevant checks.

For a normal handoff:

```sh
git status
git add path/to/changed-file
git commit -m "Describe the implemented change"
git push origin member-yazan
```

Open a pull request into `main` with a short change description and actual verification results. Majed reviews and integrates accepted work. Do not force-push or replace other members' work during ordinary development.

Majed has separately authorized whole-project synchronization across all seven branches. The last synchronization gave the branches identical file trees while preserving their histories, so commit IDs can differ. That operation is an owner-led publication step; it does not replace the normal member workflow.
