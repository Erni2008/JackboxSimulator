// Round results end to end: a short quiz runs to the end on a QA server; every phone must get MODE_SUMMARY once,
// (one player, so no Cursed Boxes interrupt the quiz) with points earned in the round (= 100 per correct answer) and the running total.
// BASE=http://127.0.0.1:18330 node tools/checks/check_mode_summary.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:18330';
const post = async (u, d) => {const r = await fetch(BASE + u, {method: 'POST', body: new URLSearchParams(d)}); const j = await r.json(); if (!r.ok) throw new Error(u + ' ' + JSON.stringify(j)); return j;};
const rid = () => Math.random().toString(36).slice(2), wait = ms => new Promise(r => setTimeout(r, ms));
function sock(code, token) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(BASE.replace('http', 'ws') + '/ws'); const o = {ws, state: null, summaries: []};
    o.send = (type, payload) => ws.send(JSON.stringify({type, requestId: rid(), payload: {roomCode: code, ...payload}}));
    ws.onopen = () => o.send('AUTH', {token});
    ws.onmessage = e => {const m = JSON.parse(e.data); if (m.payload?.code && m.payload.selfId !== undefined) {o.state = m.payload; resolve(o);} if (m.type === 'MODE_SUMMARY') o.summaries.push(m.payload.modeSummary); if (m.type === 'ERROR' || m.type?.endsWith('REJECTED')) console.log('   reply', m.type, m.payload?.code);};
    ws.onerror = reject; setTimeout(() => reject(new Error('auth timeout')), 5000);
  });
}
let failures = 0; const check = (ok, what) => {console.log((ok ? '  ✓ ' : '  ✗ ') + what); if (!ok) failures++;};
(async () => {
  const room = await post('/rooms', {name: 'Summary', maxPlayers: 8, mode: 'CLASSIC', questionCount: 12}); const code = room.code;
  const host = await sock(code, room.hostSession || room.token);
  const seats = []; for (const [i, n] of ['Ann'].entries()) {const j = await post(`/rooms/${code}/join`, {name: n, characterId: ['pumpkin', 'skeleton', 'dracula', 'voodoo'][i]}); seats.push({name: n, s: await sock(code, j.sessionToken || j.token)});}
  host.send('START_GAME', {}); const correct = {};
  for (let k = 0; k < 2400 && host.state?.phase !== 'GAME_FINISHED'; k++) {const st = host.state;
    if (st?.phase === 'STARTING' && st?.intro) host.send('SKIP_INTRO', {gameId: st.gameId, introId: st.intro.introId});
    if (st?.phase === 'QUESTION_PRESENTATION') host.send('PRESENTATION_READY', {gameId: st.gameId, questionId: st.question?.id});
    if (st?.phase === 'ANSWERING' && !correct[st.question.id]) {correct[st.question.id] = 1; seats.forEach((p, i) => p.s.send('SUBMIT_ANSWER', {gameId: st.gameId, questionId: st.question.id, answerIndex: 0}));}
    if (st?.phase === 'REVEALING') host.send('REVEAL_READY', {gameId: st.gameId, questionId: st.question?.id});
    if (st?.phase === 'RESULTS') host.send('NEXT_READY', {gameId: st.gameId, questionId: st.question?.id});
    await wait(250);}
  check(host.state?.phase === 'GAME_FINISHED', 'quiz finished (phase ' + host.state?.phase + ')');
  await wait(800);
  const s = seats[0].s.summaries; check(s.length === 1, 'one MODE_SUMMARY per phone (' + s.length + ')');
  const sum = s[0] || {}; check(sum.mode === 'questions', 'mode = questions (' + sum.mode + ')');
  check((sum.rows || []).length === 1, 'a row per player');
  check((sum.rows || [])[0]?.earned > 0, 'scored in the quiz');
  check((sum.rows || []).every(r => r.earned % 100 === 0 && r.total === r.earned), 'earned = 100 per correct answer, total matches: ' + JSON.stringify((sum.rows || []).map(r => [r.name, r.earned, r.total])));
  check(JSON.stringify(sum.rows) === JSON.stringify(host.state.modeSummary?.rows), 'host snapshot carries the same summary');
  console.log(failures ? `FAILED: ${failures}` : 'mode summary checks passed'); process.exit(failures ? 1 : 0);
})().catch(e => {console.error(e); process.exit(1);});
