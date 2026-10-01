# Project requirements

Source of project requirements: [PROJECT-SPEC-EN.pdf](../instructions/PROJECT-SPEC-EN.pdf), sections 6–23. This checklist is a transcription for planning, not a replacement for the original.

## Required frontend

- Working React frontend integrated with a real Express backend.
- React Router: at least three meaningful routes, at least one dynamic route, real Link/NavLink navigation (useNavigate when useful).
- At least one genuinely API-driven screen.
- All requests through named functions in an API/helper module, not fetch scattered inside components.
- Visible loading, useful error display and recovery; handle 400/404 without crashes or unhandled promises.
- Interactive answer/decision input that actually advances play.
- Final completion/result screen clearly resolving the mystery.
- Clear flow for an unfamiliar player; intentional visual identity; original content, no lorem ipsum or final placeholders.

## Required backend

- Node.js + Express; at least one mounted express.Router and a separate controller module exporting actual handlers.
- One intentional owner of shared runtime state where needed. No independently duplicated mutable arrays or seed imports used as competing state owners.
- Real GET collection/starting-data endpoint, GET /:id-style detail endpoint, POST reading req.body with meaningful behavior, and PATCH changing existing state.
- Validate client-controlled input type, shape and value using plain if/typeof checks.
- Real 400 with clear message for missing/wrong-typed/invalid required fields; real 404 for nonexistent resources. No silent success or crash. 409 only when useful; optional.
- Prove every endpoint independently with curl, Postman or Thunder Client, including failure cases.
- Backend owns actual stage/solved/hint state; client displays server truth.

## Forbidden / out of scope (section 14)

- MongoDB, PostgreSQL, Prisma, Mongoose, any database or ORM.
- Authentication, login/register, JWT, sessions, cookie auth, password hashing.
- NestJS, Next.js, GraphQL, WebSockets, Redis.
- Docker or deployment of any kind. Publishing source to GitHub is the required collaboration step, not deploying the application.
- Redux createAsyncThunk, RTK Query, React Query.
- Zod, Joi, express-validator or any validation library.
- Complex custom error middleware, service/repository layers, dependency injection.

## Team choices, not mandates

- Original project name, story, characters, setting, clue text and coherent ending; must not be a relabeled B4F Hub CRUD dashboard.
- Exact URLs, request/response fields, number of stages/mysteries and visual branding are flexible. Example endpoints in the PDF are not prescribed URLs.
- TypeScript is encouraged but optional; existing client already uses it.
- Context, Redux Toolkit or neither according to actual ownership/sharing. URL owns selected mystery; local state owns local input and screen data. No Redux just to tick a box.
- localStorage only with a real reason; it must not become a competing authority for server progress.
- Second mystery, score/timer, hint count, completion badges and shareable result text are optional. A hint operation is one possible way to meet mandatory PATCH, not a mandatory feature by itself.

## Delivery and presentation

- Agree API shape and data model together before implementation splits.
- Every member makes meaningful, visible commits; regular descriptive messages, agreed branch workflow. Everyone understands the whole app and speaks in English.
- Fresh checkout: npm install in client/ and server/, then documented npm run dev / npm start must work.
- Complete home-to-reveal flow without breaking console errors; independently working endpoints and failure cases.
- English product presentation around 5–7 minutes, plus questions: introduction, story/player goal, live demo, architecture, challenge and improvement. Rehearse together.
- Demo both servers starting, home, complete mystery, at least one wrong answer, final reveal and all speaking roles.
- Working product, concepts, integration, validation, organization, visible contributions, originality and presentation are assessed. Visual polish is not dominant.
- PRESENTATION-GUIDE-EN.md and instructor/GRADING-RUBRIC.md are referenced but not supplied; detailed instructions/weights remain unverified.
