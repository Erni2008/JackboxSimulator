// Cloud capacity test: ROOMS rooms x PHONES phones on one server, everyone in the Cursed Run (the heaviest traffic:
// every phone reports 5 Hz, the server relays everyone's state ~11 Hz). Measures server round-trip (PING), relay rate,
// errors, and the server process CPU/RSS. Run against a QA server (rate limits for room creation are lifted there):
//   ./gradlew :server:raceQa   (or start RoomServer with -Drace.qa=true)
//   BASE=http://127.0.0.1:18312 ROOMS=20 PHONES=6 SECONDS=60 SERVER_PID=<pid> node tools/dev/load_test.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:18312', ROOMS = +(process.env.ROOMS || 10), PHONES = +(process.env.PHONES || 6), SECONDS = +(process.env.SECONDS || 45);
const {execSync} = require('node:child_process');
const post = async (u, d) => {const r = await fetch(BASE + u, {method: 'POST', body: new URLSearchParams(d)}); const j = await r.json(); if (!r.ok) throw new Error(u + ' ' + JSON.stringify(j)); return j;};
const rid = () => Math.random().toString(36).slice(2);
const wait = ms => new Promise(r => setTimeout(r, ms));
const stats = {sent: 0, relays: 0, errors: {}, rtt: [], closed: 0};
function sock(code, token) {
  const ws = new WebSocket(BASE.replace('http', 'ws') + '/ws'); const pend = new Map();
  const o = {ws, state: null, send(type, payload) {if (ws.readyState !== 1) return; const requestId = rid(); if (type === 'PING') pend.set(requestId, performance.now()); ws.send(JSON.stringify({type, requestId, payload: {roomCode: code, ...payload}}));}};
  ws.onopen = () => o.send('AUTH', {token});
  ws.onmessage = e => {const m = JSON.parse(e.data); if (m.requestId && pend.has(m.requestId)) {stats.rtt.push(performance.now() - pend.get(m.requestId)); pend.delete(m.requestId);}
    if (m.type === 'RACE_POS') stats.relays++; else if (m.payload?.code && m.payload.selfId !== undefined) o.state = m.payload;
    if (m.type === 'ERROR' || m.type?.endsWith('REJECTED')) {const k = m.payload?.code || m.type; stats.errors[k] = (stats.errors[k] || 0) + 1;}};
  ws.onclose = e => {stats.closed++; const k = 'close ' + e.code + ' ' + e.reason; stats.errors[k] = (stats.errors[k] || 0) + 1;};
  return o;
}
const names = ['Ann', 'Bob', 'Cid', 'Dee', 'Eve', 'Fay', 'Gus', 'Hal'], chars = ['pumpkin', 'skeleton', 'dracula', 'voodoo', 'ghost', 'zombie', 'plague_doctor', 'puppeteer'];
(async () => {
  const rooms = [];
  for (let r = 0; r < ROOMS; r++) {
    const room = await post('/rooms', {name: 'Load ' + r, maxPlayers: 8, mode: 'CLASSIC'}); const code = room.code, host = sock(code, room.hostSession || room.token);
    const phones = []; for (let i = 0; i < PHONES; i++) {const j = await post(`/rooms/${code}/join`, {name: names[i], characterId: chars[i]}); phones.push({s: sock(code, j.sessionToken || j.token), z: 0, x: (i - 3) * 1.2});}
    rooms.push({code, host, phones});
  }
  await wait(1500);
  for (const rm of rooms) rm.host.send('OPEN_WEB_GAME', {game: 'race', map: 1, startInMs: 1000});
  await wait(2500);
  const open = rooms.filter(r => r.host.state?.webGame === 'race').length; console.log(`${ROOMS} rooms x ${PHONES} phones connected; race open in ${open}/${ROOMS}`);
  const cpu = []; const pid = process.env.SERVER_PID; const t0 = Date.now(); let tick = 0;
  const loop = setInterval(() => {tick++;
    for (const rm of rooms) for (const p of rm.phones) {p.z += 1.6 + Math.random() * .4; p.s.send('RACE_STATE', {s: [+p.x.toFixed(2), 0, +p.z.toFixed(2), 0, 1, 0, +p.z.toFixed(1), 0, 0, 0]}); stats.sent++;}
    if (tick % 5 === 0) for (const rm of rooms) rm.host.send('PING', {});
    if (pid && tick % 10 === 0) try {const [c, rss] = execSync(`ps -o %cpu=,rss= -p ${pid}`).toString().trim().split(/\s+/); cpu.push({c: +c, rss: +rss});} catch {}
  }, 200);
  await wait(SECONDS * 1000); clearInterval(loop);
  const s = stats.rtt.sort((a, b) => a - b), q = k => s.length ? s[Math.min(s.length - 1, Math.floor(s.length * k))].toFixed(1) : '—', dt = (Date.now() - t0) / 1000;
  console.log(`phone reports ${Math.round(stats.sent / dt)}/s · relays received ${Math.round(stats.relays / dt)}/s (all phones+hosts)`);
  console.log(`server round-trip ms: p50 ${q(.5)} · p95 ${q(.95)} · p99 ${q(.99)} · max ${s.length ? s[s.length - 1].toFixed(1) : '—'} (${s.length} pings)`);
  console.log(`errors ${JSON.stringify(stats.errors)} · sockets closed ${stats.closed}`);
  if (cpu.length) console.log(`server CPU avg ${(cpu.reduce((a, b) => a + b.c, 0) / cpu.length).toFixed(0)}% (100% = one core) · peak ${Math.max(...cpu.map(x => x.c)).toFixed(0)}% · RSS ${(Math.max(...cpu.map(x => x.rss)) / 1024).toFixed(0)} MB`);
  process.exit(0);
})().catch(e => {console.error(e); process.exit(1);});
