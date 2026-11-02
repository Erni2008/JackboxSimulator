#!/usr/bin/env node
// Solo-testing helper: N fake phone controllers that join a room over the unchanged v1 HTTP/WebSocket API
// and play like real phones (quiz answers, Cursed Boxes hide/select/fire, Impostor clue/suspicion/vote).
// Development only: it never sees host data and uses the same commands as web/app.js.
//
//   node tools/unity/phone_bots.mjs ROOMCODE [--count 2] [--server http://127.0.0.1:8080] [--password x]
//
// Requires Node 22+ (global fetch and WebSocket).

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const code = (args.find(a => !a.startsWith('--') && !/^\d+$/.test(a) && !a.startsWith('http')) || '').toUpperCase();
const count = Math.max(1, Math.min(8, Number(option('--count', '2'))));
const server = option('--server', 'http://127.0.0.1:8080').replace(/\/+$/, '');
const password = option('--password', '');
const names = ['Аня', 'Борис', 'Вика', 'Глеб', 'Даша', 'Егор', 'Жанна', 'Зоя'];

if (!/^[A-Z0-9]{6}$/.test(code)) {
  console.error('Usage: node tools/unity/phone_bots.mjs ROOMCODE [--count 2] [--server http://127.0.0.1:8080]');
  process.exit(2);
}

const pick = list => list[Math.floor(Math.random() * list.length)];
const later = (ms, fn) => setTimeout(fn, ms + Math.random() * ms);
let nextId = 0;
const requestId = () => `bot${process.pid}x${++nextId}`;

class Bot {
  constructor(name) {
    this.name = name;
    this.done = new Set(); // one action per semantic key, like the phone's request locks
  }

  async join() {
    const body = new URLSearchParams({ name: this.name });
    if (password) body.set('password', password);
    const response = await fetch(`${server}/rooms/${code}/join`, { method: 'POST', body });
    const json = await response.json();
    if (!response.ok) throw new Error(`${this.name}: join failed ${json.error}`);
    this.token = json.token;
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(server.replace(/^http/, 'ws') + '/ws');
    this.socket.onmessage = event => this.receive(JSON.parse(event.data));
    this.socket.onclose = () => { clearInterval(this.ping); if (!this.leaving) console.log(`${this.name}: disconnected`); };
    this.ping = setInterval(() => this.send('PING', {}), 10_000);
  }

  send(type, payload) {
    if (this.socket?.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify({ type, requestId: requestId(), payload: { roomCode: code, ...payload } }));
  }

  once(key, delay, fn) {
    if (this.done.has(key)) return;
    this.done.add(key);
    later(delay, fn);
  }

  receive(message) {
    const { type, payload } = message;
    if (type === 'CONNECTED') { this.socket.send(JSON.stringify({ type: 'AUTH', requestId: requestId(), payload: { roomCode: code, token: this.token } })); return; }
    if (type === 'AUTHENTICATED') console.log(`${this.name}: в комнате ${code}`);
    if (type === 'ROOM_CLOSED') { console.log(`${this.name}: комната закрыта (${payload.reason})`); this.leaving = true; this.socket.close(); return; }
    if (type.endsWith('_REJECTED') || type === 'ERROR') { console.log(`${this.name}: ${type} ${payload.code}`); return; }
    if (!payload?.roomId) return;
    this.quiz(payload);
    if (payload.cursedBoxes) this.cursed(payload.cursedBoxes);
    if (payload.impostor) this.impostor(payload.impostor, payload.selfId);
  }

  quiz(s) {
    if (s.phase !== 'ANSWERING' || s.hasSubmittedAnswer || !s.question || s.cursedBoxes) return;
    this.once(`answer:${s.gameId}:${s.question.id}`, 900, () => {
      const answerIndex = Math.floor(Math.random() * s.question.answers.length);
      console.log(`${this.name}: ответ ${'ABCD'[answerIndex]}`);
      this.send('SUBMIT_ANSWER', { gameId: s.gameId, questionId: s.question.id, answerIndex });
    });
  }

  cursed(m) {
    const free = (m.boxes || []).filter(b => b.state === 'AVAILABLE').map(b => b.id);
    if (!free.length) return;
    const base = { sessionId: m.sessionId };
    if (m.canHide && !m.hidingConfirmed)
      this.once(`hide:${m.sessionId}`, 700, () => this.send('CURSED_HIDE', { ...base, boxId: pick(free) }));
    if (!m.canAct || m.pendingShot) return;
    const shotNumber = m.shotLimit + 1 - m.shotsRemaining;
    const turn = { ...base, turnId: m.turnId };
    if (m.selectedCrateId < 0 || !free.includes(m.selectedCrateId))
      this.once(`select:${m.sessionId}:${m.turnId}:${shotNumber}`, 600, () => this.send('CURSED_SELECT', { ...turn, boxId: pick(free) }));
    else
      this.once(`fire:${m.sessionId}:${m.turnId}:${shotNumber}`, 500, () => this.send('CURSED_FIRE', { ...turn, boxId: m.selectedCrateId, shotNumber }));
  }

  impostor(m, selfId) {
    const base = { sessionId: m.sessionId };
    const others = (m.participants || []).map(p => p.id).filter(id => id !== selfId);
    if (m.phase === 'ROUND_CLUE_INPUT' && m.activeParticipant && !m.clueSubmitted)
      this.once(`clue:${m.sessionId}:${m.round}`, 1500, () => this.send('SUBMIT_CLUE', { ...base, round: m.round, clue: pick(['тепло', 'круглое', 'старое', 'громко', 'быстро']) }));
    if (m.phase === 'PRELIMINARY_SUSPICION' && m.eligible && !m.hasSubmitted && others.length)
      this.once(`suspect:${m.sessionId}:${m.round}`, 1500, () => this.send('SUBMIT_SUSPICION', { ...base, round: m.round, suspectId: pick(others) }));
    if (m.phase === 'FINAL_VOTING' && !m.finalVoteSubmitted && others.length)
      this.once(`vote:${m.sessionId}`, 1500, () => this.send('SUBMIT_FINAL_VOTE', { ...base, suspectId: pick(others) }));
  }

  async leave() {
    this.leaving = true;
    try { await fetch(`${server}/rooms/${code}/leave`, { method: 'POST', body: new URLSearchParams({ token: this.token }) }); } catch { /* server gone */ }
    this.socket?.close();
  }
}

const bots = names.slice(0, count).map(n => new Bot(n));
for (const bot of bots) {
  try { await bot.join(); } catch (error) { console.error(error.message); }
}
const stop = async () => { await Promise.all(bots.map(b => b.leave())); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
console.log(`${bots.length} бот(а) подключены к ${code}. Ctrl+C — выйти.`);
