// added by chatGPT
import { writeFileSync } from 'node:fs';
import { STATUS_CODES } from 'node:http';
import assert from 'node:assert/strict';
import * as controllers from '../../server/controllers/puzzles.js';
import { puzzles, puzzleProgress } from '../../server/store.js';

const base = '{{Base_URL}}';
const methods = { getAllPuzzles: 'GET', getPuzzleById: 'GET', getCluesById: 'GET', submitAnswer: 'POST', requestHints: 'PATCH' };
const paths = { getAllPuzzles: '', getPuzzleById: '', getCluesById: '/clues', submitAnswer: '/answers', requestHints: '/hint' };
function reset() {
  puzzleProgress.forEach(progress => {
    progress.currentStageIndex = 0;
    progress.solved = false;
    progress.hintsByStage.forEach(stage => { stage.hintsUsed = 0; });
  });
}
function call(name, id = 1, body) {
  let code = 200;
  let value;
  const res = { status(status) { code = status; return this; }, json(data) { value = structuredClone(data); return this; } };
  controllers[name]({ params: { id: String(id) }, body }, res);
  assert.notEqual(value, undefined);
  return { code, value };
}
function solvePuzzle(id) {
  const puzzle = puzzles.find(puzzle => puzzle.id === id);
  puzzle.stages.forEach(stage => {
    const response = call('submitAnswer', id, { stageId: stage.id, answer: stage.answers[0] });
    assert.equal(response.code, 200);
    assert.equal(response.value.correct, true);
  });
}
function request(name, id = 1, body, description = '') {
  const suffix = name === 'getAllPuzzles' ? '' : `/${id}${paths[name]}`;
  const result = {
    method: methods[name],
    header: [{ key: 'Accept', value: 'application/json' }],
    url: `${base}${name}${suffix}`,
    description,
  };
  if (body !== undefined) {
    result.header.push({ key: 'Content-Type', value: 'application/json' });
    result.body = { mode: 'raw', raw: JSON.stringify(body, null, 2), options: { raw: { language: 'json' } } };
  }
  return result;
}
const item = [];
function add(name, description, scenarios, body) {
  const response = scenarios.map(scenario => {
    reset();
    if (scenario.setup) scenario.setup();
    const id = scenario.id ?? 1;
    const input = scenario.body ?? body;
    const actual = call(name, id, input);
    assert.equal(actual.code, scenario.code, scenario.description);
    if (scenario.message) assert.equal(actual.value.message, scenario.message);
    if (scenario.verify) scenario.verify(actual.value);
    return {
      name: `${actual.code} - ${STATUS_CODES[actual.code]}`,
      originalRequest: request(name, id, input, scenario.description),
      status: STATUS_CODES[actual.code],
      code: actual.code,
      _postman_previewlanguage: 'json',
      header: [{ key: 'Content-Type', value: 'application/json; charset=utf-8' }],
      cookie: [],
      body: JSON.stringify(actual.value, null, 2),
    };
  });
  assert.equal(response[0].code, 200);
  item.push({ name, request: request(name, 1, body, description + '\n\nSaved examples cover every controller response branch. Examples sharing a status have the same requested name; open the example request description to see its scenario and setup. Examples are saved snapshots; Send runs against live server progress.'), response });
}
const invalidPuzzle = { code: 400, id: 0, description: 'Invalid puzzle ID: send id=0.', message: 'Invalid puzzle ID.' };
const missingPuzzle = { code: 404, id: 999, description: 'Puzzle not found: send id=999.', message: 'Puzzle not found.' };
const lockedPuzzle = { code: 403, id: 2, description: 'Puzzle 2 is locked while puzzle 1 is unfinished. Start with a fresh server.', message: 'Complete all earlier puzzles before investigating this level.' };
const solvedPuzzle = { code: 409, setup: () => solvePuzzle(1), description: 'Puzzle 1 already solved: complete all three stages before sending.', message: 'Puzzle already solved.' };
const invalidStage = { code: 400, body: { stageId: 0, answer: '3556' }, description: 'Invalid stage ID: send stageId=0.', message: 'Invalid stage ID.' };
const missingStage = { code: 404, body: { stageId: 999, answer: '3556' }, description: 'Stage not found: send stageId=999.', message: 'Stage not found.' };
const staleStage = { code: 409, body: { stageId: 2, answer: 'heisenberg' }, description: 'Stage 2 is not current while stage 1 is unfinished.', message: 'This stage is not current.' };

add('getAllPuzzles', 'Lists all three puzzles with their shared progress and lock state. No request body.', [
  { code: 200, description: 'Fresh server: puzzle 1 unlocked, puzzles 2 and 3 locked.', verify: value => { assert.equal(value.length, 3); assert.deepEqual(value.map(puzzle => puzzle.locked), [false, true, true]); } },
]);
add('getPuzzleById', 'Gets puzzle 1 and its current stage. A solved puzzle returns currentStage=null and finalReveal.', [
  { code: 200, description: 'Puzzle 1 available at stage 1 on a fresh server.', verify: value => assert.equal(value.currentStage.id, 1) },
  { code: 200, setup: () => solvePuzzle(1), description: 'Puzzle 1 completed: finalReveal present and currentStage=null.', verify: value => { assert.equal(value.solved, true); assert.equal(value.currentStage, null); assert.ok(value.finalReveal); } },
  invalidPuzzle, lockedPuzzle, missingPuzzle,
]);
add('getCluesById', 'Returns the current stage clues as an array of strings. No request body.', [
  { code: 200, description: 'Puzzle 1 stage 1 clues on a fresh server.', verify: value => assert.ok(Array.isArray(value)) },
  invalidPuzzle, lockedPuzzle, missingPuzzle, solvedPuzzle,
]);
add('submitAnswer', 'Submits an answer for puzzle 1 stage 1. Default answer 3556 is correct on a fresh server. Correct answers advance shared progress; wrong answers return HTTP 200 with correct=false. Restart Express to reset progress.', [
  { code: 200, description: 'Correct stage 1 answer advances puzzle 1 to stage 2.', verify: value => { assert.equal(value.correct, true); assert.equal(value.puzzle.currentStage.id, 2); } },
  { code: 200, body: { stageId: 1, answer: 'wrong' }, description: 'Wrong answer: correct=false and stage 1 remains current.', verify: value => { assert.equal(value.correct, false); assert.equal(value.puzzle.currentStage.id, 1); } },
  { code: 200, setup: () => { call('submitAnswer', 1, { stageId: 1, answer: '3556' }); call('submitAnswer', 1, { stageId: 2, answer: 'heisenberg' }); }, body: { stageId: 3, answer: '2145' }, description: 'Correct final-stage answer solves puzzle 1 and returns finalReveal. First solve stages 1 and 2.', verify: value => { assert.equal(value.correct, true); assert.equal(value.puzzle.solved, true); assert.equal(value.puzzle.currentStage, null); } },
  invalidPuzzle, invalidStage,
  { code: 400, body: { stageId: 1, answer: '' }, description: 'Empty answer: send an empty string.', message: 'Enter an answer.' },
  lockedPuzzle, missingPuzzle, missingStage, solvedPuzzle, staleStage,
], { stageId: 1, answer: puzzles[0].stages[0].answers[0] });
add('requestHints', 'Reveals the next hint for puzzle 1 stage 1. hintId is its zero-based array index. Each request consumes one hint; restart Express to reset progress.', [
  { code: 200, description: 'First stage 1 hint: hintId=0 and one hint remains.', verify: value => { assert.equal(value.hintId, 0); assert.equal(value.puzzle.currentStage.revealedHints.length, 1); } },
  invalidPuzzle,
  { ...invalidStage, body: { stageId: 0 } },
  lockedPuzzle, missingPuzzle,
  { ...missingStage, body: { stageId: 999 } },
  solvedPuzzle,
  { ...staleStage, body: { stageId: 2 } },
  { code: 409, setup: () => puzzles[0].stages[0].hints.forEach(() => call('requestHints', 1, { stageId: 1 })), description: 'No hints remain: request both stage 1 hints before sending again.', message: 'No hints remain for this stage.' },
], { stageId: 1 });

reset();
const collection = {
  info: {
    name: 'mini-project-01-team-02',
    description: 'Five Puzzle Lab APIs, generated from server/controllers/puzzles.js. Main requests use successful inputs for a fresh Express server. Each request includes 200 - OK first, followed by every controller response branch. Duplicate status names distinguish scenarios through their original request descriptions. Base_URL includes /api/ and a trailing slash. Progress is shared in server memory and resets when Express restarts. Sending submitAnswer advances the stage, so requestHints stageId may need updating afterward. Saved examples do not prepopulate the live Send response panel; open the 200 - OK example or press Send. No authentication is required.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  variable: [{ key: 'Base_URL', value: 'http://localhost:3001/api/', type: 'string' }],
  item,
};
assert.equal(item.length, 5);
const output = new URL('./mini-project-01-team-02.postman_collection.json', import.meta.url);
writeFileSync(output, JSON.stringify(collection, null, 2) + '\n');
console.log(JSON.stringify({ file: output.pathname, requests: item.map(request => ({ name: request.name, examples: request.response.length, statuses: [...new Set(request.response.map(example => example.code))] })), totalExamples: item.reduce((count, request) => count + request.response.length, 0), checked: 'All examples executed against isolated controller/store imports; assertions passed.' }, null, 2));
