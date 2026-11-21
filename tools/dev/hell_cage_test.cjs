// Hell Cage test run on a QA server: this script is the host. It creates a room, prints the phone link, waits for a
// real player to join (plus BOTS idle test phones), opens THE HELL CAGE and prints the host-screen link.
//   BASE=http://127.0.0.1:18330 BOTS=2 DIFF=NORMAL LANG=ru node tools/dev/hell_cage_test.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:18330', BOTS = +(process.env.BOTS ?? 2), DIFF = process.env.DIFF || 'NORMAL', LANG = process.env.LANG_UI || 'ru';
const rid = () => Math.random().toString(36).slice(2), wait = ms => new Promise(r => setTimeout(r, ms));
const post = async (u, d) => {const r = await fetch(BASE + u, {method: 'POST', body: new URLSearchParams(d)}); const j = await r.json(); if (!r.ok) throw new Error(u + ' ' + JSON.stringify(j)); return j;};
function sock(code, token, onState) {const ws = new WebSocket(BASE.replace('http', 'ws') + '/ws'); const send = (type, p = {}) => ws.readyState === 1 && ws.send(JSON.stringify({type, requestId: rid(), payload: {roomCode: code, ...p}}));
  ws.onopen = () => send('AUTH', {token}); ws.onmessage = e => {const m = JSON.parse(e.data); if (m.payload?.players) onState?.(m.payload, m.type);}; return {ws, send};}
(async () => {
  const room = await post('/rooms', {name: 'Hell Cage test', maxPlayers: 8, mode: 'CLASSIC'}), code = room.code, token = room.hostSession || room.token;
  let st = null; const host = sock(code, token, s => st = s); await wait(800); host.send('SET_LANGUAGE', {language: LANG});
  console.log('PHONE ' + BASE + '/?room=' + code);
  const names = ['Bot Ann', 'Bot Bob', 'Bot Cid'], chars = ['ghost', 'zombie', 'voodoo'];
  for (let i = 0; i < BOTS; i++) {const j = await post(`/rooms/${code}/join`, {name: names[i], characterId: chars[i]}); sock(code, j.sessionToken || j.token);}
  while (!(st?.players || []).some(p => !p.host && !names.includes(p.name))) await wait(500);
  console.log('player joined, opening the cage in 4 s'); await wait(4000);
  host.send('OPEN_WEB_GAME', {game: 'broken-elevator', difficulty: DIFF});
  console.log('HOST ' + BASE + '/hell-cage-host/?lang=' + LANG + '&room=' + code + '#token=' + encodeURIComponent(token));
  setInterval(() => host.send('PING'), 10000);
})().catch(e => {console.error(e); process.exit(1);});
