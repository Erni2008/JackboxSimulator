#!/usr/bin/env node
// End-to-end check of THE LAST COMMAND solo mode against a real RoomServer started with -Dlastcommand.debug=true.
// One host connection plays the role of the Unity machine (CLIENT_READY, mirrored view) and one phone connection
// sends exactly what web/last-command.js sends. Answers come from the host-only debug view; nothing is simulated
// on the server side — every answer goes through the normal validation in CommandRace.
//
//   node tools/unity/last_command_solo_test.mjs [--server http://127.0.0.1:18180]
//
// Requires Node 22+ (global fetch and WebSocket). Exit code 0 = all checks passed.

const option = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const server = option('--server', 'http://127.0.0.1:18180').replace(/\/+$/, '');
let nextId = 0;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = [];
const check = (ok, label) => { results.push([ok, label]); console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`); if (!ok) process.exitCode = 1; };

class Client {
  constructor(name, code, token) { this.name = name; this.code = code; this.token = token; this.state = null; this.errors = []; }
  open() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(server.replace(/^http/, 'ws') + '/ws');
      this.socket.onopen = () => this.raw('AUTH', { roomCode: this.code, token: this.token });
      this.socket.onerror = reject;
      this.socket.onmessage = event => {
        const message = JSON.parse(event.data);
        if (message.type === 'AUTHENTICATED') resolve();
        if (message.type === 'ERROR' || message.type.endsWith('_REJECTED')) this.errors.push(message.payload?.code ?? message.type);
        if (message.payload?.revision !== undefined) this.state = message.payload;
      };
    });
  }
  raw(type, payload) { this.socket.send(JSON.stringify({ type, requestId: `t${++nextId}`, payload })); }
  send(type, payload = {}) { this.raw(type, { roomCode: this.code, ...payload }); }
  get panel() { return this.state?.lastCommand; }
  get round() { return this.panel?.testRound; }
  act(element, action, value = '') {
    this.send('LAST_COMMAND_ACTION', { sessionId: this.panel.sessionId, taskId: this.round.taskId, element, action, value: String(value) });
  }
  async until(predicate, label, ms = 5000) {
    const end = Date.now() + ms;
    while (Date.now() < end) { if (this.state && predicate(this)) return true; await sleep(25); }
    check(false, `timeout: ${label} [${this.name} errors=${this.errors.slice(-3)} task=${this.round?.taskType} input=${this.round?.touchscreen?.input} kind=${this.round?.touchscreen?.kind} score=${this.round?.localScore} fb=${this.round?.feedback}]`);
    return false;
  }
  close() { this.socket.close(); }
}

async function post(path, form) {
  const response = await fetch(server + path, { method: 'POST', body: new URLSearchParams(form) });
  const json = await response.json();
  if (!response.ok) throw new Error(`${path}: ${json.error}`);
  return json;
}

async function room(phones) {
  const created = await post('/rooms', { name: 'LC solo test', maxPlayers: '8', gameMode: 'standard', questionCount: '5', password: '' });
  const host = new Client('host', created.code, created.token);
  await host.open();
  const players = [];
  for (let i = 0; i < phones; i++) {
    const joined = await post(`/rooms/${created.code}/join`, { name: `Phone${i + 1}`, password: '' });
    const phone = new Client(`phone${i + 1}`, created.code, joined.token);
    await phone.open();
    players.push(phone);
  }
  await host.until(h => (h.state.players ?? []).filter(p => p.connectionStatus === 'ONLINE').length === phones, 'phones online');
  return { host, players };
}

const start = async host => {
  host.send('START_LAST_COMMAND', { sessionId: host.state.lobbyId, seed: String(Date.now() % 100000) });
  await host.until(h => h.round?.expanded, 'session started');
};
// What web/last-command.js does on every snapshot.
const phoneLoop = phone => setInterval(() => {
  const r = phone.round;
  if (!r?.expanded) return;
  if (r.awaitingReady && phone.readyFor !== r.taskId) { phone.readyFor = r.taskId; phone.act('TOUCH_PANEL', 'CLIENT_READY'); }
  if (r.paused && !r.awaitingReady && !r.waitingForTerminals && Date.now() - (phone.visibleAt ?? 0) > 250) { phone.visibleAt = Date.now(); phone.act('TOUCH_PANEL', 'VISIBILITY', 'VISIBLE'); }
  const c = phone.panel.clockChallenge;
  if (c && phone.clock !== c) { phone.clock = c; phone.act('TOUCH_PANEL', 'CLOCK_SYNC', c); }
}, 50);
const playable = c => c.round?.status === 'PLAYING' && !c.round.paused && !c.round.waitingForTerminals && c.round.nextAt === 0
  && Date.now() >= c.round.readyAt + 40; // readyAt is server time; the local server shares this clock

async function solveNumber(host, phone, answer) {
  await phone.until(playable, 'task playable');
  if (process.env.LC_TRACE) console.log(JSON.stringify(phone.round), Date.now());
  for (const key of String(answer)) phone.act('TOUCH_PANEL', 'KEY', key);
  await phone.until(p => p.round.touchscreen?.input === String(answer), 'input echoed');
  phone.act('TOUCH_PANEL', 'CONFIRM');
}

async function main() {
  const health = await (await fetch(server + '/health')).json();
  check(health.lastCommand?.solo === true && health.lastCommand?.debug === true, `server reports solo+debug support (${JSON.stringify(health)})`);

  // ---------- Solo: one phone, host mirrors it ----------
  const { host, players: [phone] } = await room(1);
  const ticker = phoneLoop(phone);
  // Readiness: hold the host back first so the barrier must wait for the machine.
  host.send('START_LAST_COMMAND', { sessionId: host.state.lobbyId, seed: '4242' });
  await host.until(h => h.round?.expanded, 'session started');
  check(host.panel.mirroring !== undefined, 'host view mirrors the only player');
  await phone.until(p => p.round.awaitingReady === false, 'phone reported ready');
  await sleep(300);
  check(phone.round.waitingForTerminals === true, 'race waits for the Unity machine after the phone is ready');
  host.act('TOUCH_PANEL', 'CLIENT_READY');
  await phone.until(p => p.round.waitingForTerminals === false && p.round.taskType, 'barrier opened after machine ready');
  check(Object.keys(phone.round.scores).length === 1, 'exactly one racer (the host does not race)');
  check(host.round.taskId === phone.round.taskId, 'machine shows the same task as the phone');

  // Every implemented family can be generated in solo.
  const families = host.panel.debug.families;
  const generated = [];
  for (const family of families) {
    host.act('DEBUG', 'FAMILY', family);
    const ok = await host.until(h => h.panel.debug.family === family || (family === 'NUMBER_MEMORY' && h.panel.debug.family === 'RECALL'), `generate ${family}`, 3000);
    if (ok) generated.push(family);
  }
  check(generated.length === families.length, `all ${families.length} task families generate in solo: ${generated.join(' ')}`);

  // Correct answer through the phone: +1.
  host.act('DEBUG', 'FAMILY', 'MATH');
  await host.until(h => h.panel.debug.family === 'MATH' && h.panel.debug.score === 0, 'MATH selected');
  await phone.until(p => p.round.taskType === 'MATH', 'phone sees MATH');
  let task = host.round.taskId;
  await solveNumber(host, phone, host.panel.debug.answer);
  await phone.until(p => p.round.localScore === 1, 'score 1 after correct answer');
  check(phone.round.feedback === 'COMMAND ACCEPTED', 'correct answer accepted (+1)');
  check(await phone.until(p => p.round.taskId !== task && p.round.nextAt === 0 && p.round.taskType, 'next task generated'), 'next task generated after correct answer');

  // Wrong answer: no progress, replacement task of the same family.
  task = host.round.taskId;
  const wrong = String(Number(host.panel.debug.answer) + 1);
  await solveNumber(host, phone, wrong);
  await phone.until(p => p.round.feedback === 'WRONG COMMAND', 'wrong feedback');
  check(phone.round.localScore === 1 && phone.round.mistakes === 1, 'wrong answer: score unchanged, mistake counted');
  check(await phone.until(p => p.round.taskId !== task && p.round.nextAt === 0, 'replacement task') && host.panel.debug.family === 'MATH', 'replacement task of the same family generated');

  // Choice tasks via SELECT.
  host.act('DEBUG', 'FAMILY', 'COMPARISON');
  await host.until(h => h.panel.debug.family === 'COMPARISON', 'COMPARISON selected');
  await phone.until(playable, 'choice playable');
  phone.act('TOUCH_PANEL', 'SELECT', host.panel.debug.answer);
  check(await phone.until(p => p.round.localScore === 2, 'choice accepted'), 'choice task solved through SELECT (+1)');

  // Restart same task keeps parameters; new task changes them.
  await phone.until(playable, 'playable before restart');
  const before = JSON.stringify(host.round.touchscreen?.options ?? host.round.instruction);
  const seedBefore = host.panel.debug.taskSeed;
  task = host.round.taskId;
  host.act('DEBUG', 'RESTART_TASK');
  await host.until(h => h.round.taskId !== task && h.panel.debug.taskSeed === seedBefore && h.round.nextAt === 0, 'restart', 3000);
  check(host.panel.debug.taskSeed === seedBefore && JSON.stringify(host.round.touchscreen?.options ?? host.round.instruction) === before, 'RESTART_TASK repeats identical parameters');

  // Debug pause survives the phone's automatic VISIBLE and resumes cleanly.
  host.act('DEBUG', 'PAUSE');
  await host.until(h => h.panel.debug.paused && h.round.paused, 'paused');
  await sleep(600);
  check(host.round.paused === true, 'debug PAUSE holds while the phone stays visible');
  host.act('DEBUG', 'RESUME');
  check(await host.until(h => !h.round.paused && !h.panel.debug.paused, 'resumed'), 'debug RESUME continues the task');

  // Play the remaining correct answers with MATH to reach the normal 20 objective.
  host.act('DEBUG', 'FAMILY', 'MATH');
  await host.until(h => h.panel.debug.family === 'MATH', 'MATH again');
  for (let score = phone.round.localScore; score < 20; score++) {
    await phone.until(p => playable(p) && host.panel.debug.taskId === p.round.taskId, `task ${score + 1}`);
    // The rules may interleave a delayed RECALL question here; answer whatever the machine asks.
    if (phone.round.touchscreen.kind === 'number') await solveNumber(host, phone, host.panel.debug.answer);
    else phone.act('TOUCH_PANEL', 'SELECT', host.panel.debug.answer);
    if (!await phone.until(p => p.round.localScore === score + 1, `score ${score + 1}`)) break;
  }
  await host.until(h => h.round.status === 'WON', 'WON');
  check(host.round.status === 'WON' && host.round.step === 20, 'normal objective of 20 correct answers completes the game');

  // Back to lobby and a second session.
  host.send('END_LAST_COMMAND', { sessionId: host.panel.sessionId });
  await host.until(h => !h.panel, 'ended');
  check(!host.panel && host.state.roomStatus !== 'IN_GAME', 'END_LAST_COMMAND returns the room to the lobby');
  phone.readyFor = phone.clock = undefined;
  await start(host);
  host.act('TOUCH_PANEL', 'CLIENT_READY');
  await phone.until(p => p.round.taskType && !p.round.waitingForTerminals, 'second session playing');
  check(phone.round.localScore === 0 && phone.round.status === 'PLAYING', 'second launch starts fresh and playable');

  // Authorization: a phone cannot use debug commands.
  const errorsBefore = phone.errors.length;
  phone.act('DEBUG', 'SET_SCORE', '19');
  await sleep(300);
  check(phone.errors.length > errorsBefore && phone.round.localScore === 0, `phone DEBUG rejected (${phone.errors.at(-1)})`);
  host.act('DEBUG', 'SET_SCORE', '19');
  await host.until(h => h.panel.debug.score === 19, 'jump to 19');
  host.act('DEBUG', 'COMPLETE');
  await host.until(h => h.round.status === 'WON', 'debug complete');
  check(host.round.status === 'WON', 'DEBUG SET_SCORE/COMPLETE trigger the normal completion state');
  host.send('END_LAST_COMMAND', { sessionId: host.panel.sessionId });
  clearInterval(ticker);
  host.close(); phone.close();

  // ---------- Multiplayer unchanged: two phones, host races too, no mirror ----------
  const multi = await room(2);
  const tickers = multi.players.map(phoneLoop);
  await start(multi.host);
  multi.host.act('TOUCH_PANEL', 'CLIENT_READY');
  await multi.players[0].until(p => p.round.taskType && !p.round.waitingForTerminals, 'multiplayer playing');
  check(multi.host.panel.mirroring === undefined && Object.keys(multi.players[0].round.scores).length === 3, 'multiplayer keeps independent terminals (host + 2 phones)');
  tickers.forEach(clearInterval);
  multi.host.close(); multi.players.forEach(p => p.close());

  const failed = results.filter(r => !r[0]).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
}

main().catch(error => { console.error(error); process.exit(1); });
