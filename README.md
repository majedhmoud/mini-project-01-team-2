# Mini Project 01 — Team 2

B4F internship team project: an original browser-based mystery experience.

**Status:** all three puzzles are implemented with real Express endpoints, shared server progress, selection/instructions/gameplay/result pages, and a responsive Breaking Bad palette. The implementation follows the Phase 01 contracts.

**Team deadline:** Tuesday, 6 October 2026 (Asia/Damascus).

## Team

| Member | Branch | Preference |
| --- | --- | --- |
| Majed — leader | `member-majed` | API helpers, shared types, integration, and run instructions |
| Yazan | `member-yazan` | Frontend |
| Badr | `member-badr` | Frontend |
| Eyad | `member-eyad` | Backend |
| Maya | `member-maya` | Backend |
| Alaa | `member-alaa` | Flexible |

## Shared documents

- [Original project specification](docs/instructions/PROJECT-SPEC-EN.pdf)
- [Instructor team allocation](docs/instructions/Weekly_Mini_Project_01_Teams.pdf)
- [Project requirements](docs/team/requirements.md)
- [Styling contract](docs/phase-1-agreement/styling-contract.pdf)
- [API agreement](docs/phase-1-agreement/apis-handoff.pdf)
- [Puzzle reference](docs/phase-1-agreement/puzzles-reference.pdf)

## Run locally

Use Node.js and npm. Run the client and server in separate terminals.

Backend:

```sh
cd server
npm install
npm start
```

The backend's default port is `3001`. If you change its `PORT`, also change the `/api` proxy target in `client/vite.config.ts`.

Frontend:

```sh
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. The Vite development server forwards relative `/api` requests to `http://localhost:3001`. This proxy applies to `npm run dev`; a production build alone does not start or host the backend.

Client checks:

```sh
cd client
npm run build
npm run lint
```

## Shared API helpers

Import request functions from `client/src/api.ts` and response types from `client/src/types.ts`. Keep fetch calls out of display components.

| Helper | Endpoint | Request body |
| --- | --- | --- |
| `getAllPuzzles()` | GET `/api/getAllPuzzles` | None |
| `getPuzzle(puzzleId)` | GET `/api/getPuzzle/:puzzleId` | None |
| `submitAnswer(puzzleId, stageId, answer)` | POST `/api/submitAnswer/:puzzleId` | `{ stageId, answer }` |
| `requestStageHint(puzzleId, stageId)` | PATCH `/api/requestStageHint/:puzzleId` | `{ stageId }` |

Puzzle and stage IDs are numbers. Collection responses contain `{ puzzles }`; detail responses contain public puzzle data. Mutation responses include updated detail in `puzzle`. Wrong answers return normal feedback with `correct: false`; HTTP failures throw an Error with its `status` and server message when available. Components catch failures and display recovery controls. Malformed success responses also throw instead of displaying fake data.

### Routes

| Route | Page owner |
| --- | --- |
| `/` | Yazan: puzzle selection |
| `/how-to-play` | Yazan: instructions |
| `/puzzles/:puzzleId` | Badr: gameplay |
| `/puzzles/:puzzleId/result` | Alaa: completion/reveal |
| Unknown paths | Yazan: Not Found and return navigation |

Yazan owns the shared shell and `client/css/index.css` foundation; Badr and Alaa add their page styles there. Eyad owns all backend endpoints; Maya verifies the backend. Majed integrates accepted work.

### Game progress contract

The backend owns current stage, solved state, and hint usage. One in-memory progress record per puzzle is shared by everyone using that server. Reloading the browser retains progress; restarting the server resets every puzzle. Different puzzles and stages keep separate hint usage. Puzzles unlock in seed order: puzzle 2 requires puzzle 1, and puzzle 3 requires puzzles 1 and 2. Locked cards have disabled buttons, and locked gameplay/result URLs return to the selection page. LocalStorage caches server-confirmed progress; it never grants access and is replaced by fresh selection data after a server restart.

Each supplied stage has two hints, revealed in order with IDs `0` and `1`. Only already revealed current-stage hints appear in detail responses. Wrong answers keep the stage unchanged; correct answers advance once. The final reveal is available only after completion. There is no replay/reset endpoint, account, timer, or score.

## Workflow

### Start and synchronize

Clone the repository, then switch to your branch (example for Yazan):

```sh
git clone https://github.com/majedhmoud/mini-project-01-team-2.git
cd mini-project-01-team-2
git switch member-yazan
```

Before starting a task or after Majed merges shared changes, first commit your current work or stash it. With a clean working tree:

```sh
git fetch origin
git merge origin/main
```

Resolve conflicts with the affected owner, run relevant checks, then commit the resolution and push your named branch. This merges main into your branch; merely pulling your own branch does not bring in main's updates. Never overwrite another member's work or force-push shared history.

### Submit a small task

```sh
git status
git add path/to/changed-file
git commit -m "Describe the implemented behavior"
git push origin member-yazan
```

Open a pull request from your branch to main. Explain what changed, link the task and record how you verified it. Request Majed's review; the paired reviewer may help first.

Majed checks acceptance criteria, reads the changes and verifies integration, then merges accepted PRs using a **merge commit** so the long-lived member branch and original contribution history remain straightforward. Members synchronize main afterward. Keep member branches after merging.

### Definition of done for a task

- Agreed behavior and failure cases work; no unrelated edits.
- Relevant build/lint and endpoint/UI checks pass.
- Original author commits are visible and the member can explain the change.
- PR reviewed and merged; any setup/contract documentation updated.
- Final project acceptance still follows the complete specification.
