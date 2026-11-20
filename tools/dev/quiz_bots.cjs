// Test phones for a QA run: waits for the next room the host creates on a race.qa server, joins BOTS players and
// answers every question (all bots pick the same random answer, so a wrong answer does not start Cursed Boxes).
//   ./gradlew :server:raceQa -Prace.port=18330
//   ./gradlew :lwjgl3:run -ProomServerUrl=http://127.0.0.1:18330 -Pqa      (F8 / F9 in the lobby skip a mode)
//   BASE=http://127.0.0.1:18330 BOTS=5 node tools/dev/quiz_bots.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:18330', BOTS = +(process.env.BOTS || 5);
const rid = () => Math.random().toString(36).slice(2), wait = ms => new Promise(r => setTimeout(r, ms));
const names = ['Ann', 'Bob', 'Cid', 'Dee', 'Eve', 'Fay', 'Gus'], chars = ['pumpkin', 'skeleton', 'dracula', 'voodoo', 'ghost', 'zombie', 'plague_doctor'];
const post = async (u, d) => {const r = await fetch(BASE + u, {method: 'POST', body: new URLSearchParams(d)}); const j = await r.json(); if (!r.ok) throw new Error(u + ' ' + JSON.stringify(j)); return j;};
const rooms = async () => (await (await fetch(BASE + '/qa/rooms')).json());
(async () => {
  const known = new Set(await rooms()); console.log('waiting for the host to create a room…');
  let code; while (!code) {await wait(700); code = (await rooms()).find(c => !known.has(c));}
  console.log('room', code, '— joining', BOTS, 'bots');
  const picks = {}; const bots = [];
  for (let i = 0; i < BOTS; i++) {
    const j = await post(`/rooms/${code}/join`, {name: names[i], characterId: chars[i]});
    const ws = new WebSocket(BASE.replace('http', 'ws') + '/ws'); const send = (type, payload) => ws.readyState === 1 && ws.send(JSON.stringify({type, requestId: rid(), payload: {roomCode: code, ...payload}}));
    ws.onopen = () => send('AUTH', {token: j.sessionToken || j.token});
    ws.onmessage = e => {const m = JSON.parse(e.data), st = m.payload || {};
      if (m.type === 'MODE_SUMMARY' && i === 0) console.log('summary', st.modeSummary.mode, st.modeSummary.rows.map(r => `${r.name} +${r.earned} (${r.total})`).join(' · '));
      if (st.phase === 'ANSWERING' && st.question && !st.hasSubmittedAnswer) {const q = st.question.id; if (picks[q] === undefined) picks[q] = Math.floor(Math.random() * (st.question.answers?.length || 4));
        if (!bots[i].answered?.[q]) {bots[i].answered = {...bots[i].answered, [q]: 1}; setTimeout(() => send('SUBMIT_ANSWER', {gameId: st.gameId, questionId: q, answerIndex: picks[q]}), 1500 + Math.random() * 4000);}}};
    ws.onclose = () => console.log(names[i], 'disconnected');
    bots.push({ws}); await wait(400);
  }
  setInterval(() => {}, 1 << 30);
})().catch(e => {console.error(e); process.exit(1);});
