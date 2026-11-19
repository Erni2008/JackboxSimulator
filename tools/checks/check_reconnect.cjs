// Phone reconnection, end to end against a QA server: a phone drops in the middle of a question, comes back with the
// same session token and must get the same seat, the current question and a working answer; a phone that drops in the
// lobby keeps its seat too. BASE=http://127.0.0.1:18330 node tools/checks/check_reconnect.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:18330';
const post = async (u, d) => {const r = await fetch(BASE + u, {method: 'POST', body: new URLSearchParams(d)}); const j = await r.json(); if (!r.ok) throw new Error(u + ' ' + JSON.stringify(j)); return j;};
const rid = () => Math.random().toString(36).slice(2), wait = ms => new Promise(r => setTimeout(r, ms));
function sock(code, token) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(BASE.replace('http', 'ws') + '/ws'); const o = {ws, state: null, types: [], replies: []};
    o.send = (type, payload) => ws.send(JSON.stringify({type, requestId: rid(), payload: {roomCode: code, ...payload}}));
    ws.onopen = () => o.send('AUTH', {token});
    ws.onmessage = e => {const m = JSON.parse(e.data); o.types.push(m.type); if (m.payload?.code && m.payload.selfId !== undefined) {o.state = m.payload; resolve(o);} if (m.type === 'ERROR') o.replies.push(m.payload?.code);};
    ws.onerror = reject; setTimeout(() => reject(new Error('auth timeout')), 5000);
  });
}
const until = async (f, ms = 15000) => {const t = Date.now(); while (Date.now() - t < ms) {if (f()) return true; await wait(100);} return false;};
let failures = 0; const check = (ok, what) => {console.log((ok ? '  ✓ ' : '  ✗ ') + what); if (!ok) failures++;};
(async () => {
  const room = await post('/rooms', {name: 'Reconnect', maxPlayers: 8, mode: 'CLASSIC'}); const code = room.code;
  const host = await sock(code, room.hostSession || room.token);
  const seats = []; for (const [i, n] of ['Ann', 'Bob', 'Cid'].entries()) {const j = await post(`/rooms/${code}/join`, {name: n, characterId: ['pumpkin', 'skeleton', 'dracula'][i]}); seats.push({name: n, token: j.sessionToken || j.token, id: j.selfId, s: await sock(code, j.sessionToken || j.token)});}
  console.log('lobby: phone drops and comes back');
  const bob = seats[1]; bob.s.ws.close(); await wait(600);
  bob.s = await sock(code, bob.token);
  check(bob.s.state.selfId === bob.id, 'same seat after a lobby drop');
  await wait(300); check(JSON.stringify(host.state).includes(bob.id), 'the host still lists the returning phone');
  console.log('game: phone drops during a question');
  host.send('START_GAME', {}); await until(() => host.state?.phase === 'QUESTION_PRESENTATION' || host.state?.phase === 'ANSWERING' || !!host.state?.intro, 8000);
  // skip the intro / presentation as the host would
  for (let k = 0; k < 80 && host.state?.phase !== 'ANSWERING'; k++) {const st = host.state; if (st?.phase === 'QUESTION_PRESENTATION') host.send('PRESENTATION_READY', {gameId: st.gameId, questionId: st.question?.id}); if (st?.phase === 'STARTING' && st?.intro) host.send('SKIP_INTRO', {gameId: st.gameId, introId: st.intro.introId}); await wait(250);}
  check(host.state?.phase === 'ANSWERING', 'question is open (phase ' + host.state?.phase + ')');
  const cid = seats[2]; cid.s.ws.close(); await wait(800);
  cid.s = await sock(code, cid.token);
  check(cid.s.state.selfId === cid.id, 'same seat after a mid-question drop');
  check(cid.s.state.phase === 'ANSWERING' && !!cid.s.state.question, 'the phone gets the current question back');
  const st = host.state; cid.s.send('SUBMIT_ANSWER', {gameId: st.gameId, questionId: st.question?.id, answerIndex: 1});
  await wait(800);
  check(!cid.s.replies.length, 'answer accepted after reconnecting' + (cid.s.replies.length ? ' (' + cid.s.replies.join(',') + ')' : ''));
  console.log('stale socket: the old connection is replaced, not duplicated');
  const second = await sock(code, seats[0].token);
  await until(() => seats[0].s.ws.readyState === 3, 3000);
  check(seats[0].s.ws.readyState === 3 && second.state.selfId === seats[0].id, 'opening the seat elsewhere closes the old socket');
  console.log(failures ? `FAILED: ${failures}` : 'reconnect checks passed');
  process.exit(failures ? 1 : 0);
})().catch(e => {console.error(e); process.exit(1);});
