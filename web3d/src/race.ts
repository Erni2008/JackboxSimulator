import {RaceApp, CHARACTERS, NAMES} from './games/race/race';
const q = new URLSearchParams(location.search);
const pick = document.getElementById('pick')!, load = document.getElementById('loading')!, fill = document.getElementById('load-fill')!;
let map = [1, 2, 3, 4].includes(Number(q.get('map'))) ? Number(q.get('map')) : 1;

/** Online: the phone (or the host's big screen with ?host=1) joins the room race over the existing /ws envelope. */
function online() {
  let cred: any = null;
  if (q.get('host')) {const tok = /#token=([^&]+)/.exec(location.hash)?.[1]; if (tok) cred = {code: q.get('room'), token: decodeURIComponent(tok)};}
  else {const seat = /#seat=([^.&]+)\.([^&]+)/.exec(location.hash); if (seat) {cred = {code: seat[1], token: decodeURIComponent(seat[2])}; try {sessionStorage.setItem('finalanswer-session', JSON.stringify(cred));} catch {}}
    else try {cred = JSON.parse(sessionStorage.getItem('finalanswer-session') || 'null');} catch {}}
  if (!cred?.code || !cred?.token) {document.querySelector('#loading h2')!.textContent = 'Нет сессии комнаты — вернитесь в игру'; return;}
  pick.hidden = true; load.hidden = false; document.body.classList.add('playing');
  let app: RaceApp | null = null, offset = 0, raceId = '', ws: WebSocket, building = false;
  const serverNow = () => Date.now() + offset;
  const send = (type: string, payload: any) => {if (ws?.readyState === 1) ws.send(JSON.stringify({type, requestId: 'race_' + Math.random().toString(36).slice(2), payload}));};
  const onState = async (st: any) => {
    if (typeof st.serverTime === 'number') offset = st.serverTime - Date.now();
    if (st.webGame !== 'race' || !st.race) {if (raceId) location.href = '/'; return;}
    if (building || raceId === st.race.id) return; building = true; raceId = st.race.id;
    const roster = (st.players || []).filter((p: any) => p.connectionStatus !== 'OFFLINE' || true).map((p: any) => ({id: p.id, name: p.nickname || p.name, char: p.characterId}));
    const me = roster.find((p: any) => p.id === st.selfId);
    app = new RaceApp(document.getElementById('stage')!, me?.char || 'pumpkin', st.race.map, {roster, selfId: st.selfId, seed: st.race.seed, startAt: st.race.startAt, serverNow, send: s => send('RACE_STATE', {roomCode: cred.code, s}), spectator: !!st.host});
    await app.load(f => fill.style.width = `${Math.round(f * 100)}%`); load.hidden = true; app.start();
    const tap = document.getElementById('tap')!; tap.hidden = false; tap.onclick = () => {tap.hidden = true; app!.snd.unlock(); app!.snd.ambience(app!.course.theme); app!.snd.playMusic('audio/music.m4a');};
    document.getElementById('intro-skip')!.onclick = () => {app!.introSkipped = true; document.getElementById('intro')!.hidden = true; app!.snd.voice('');};
    const again = document.getElementById('again')!; again.textContent = st.host ? 'В ЛОББИ' : 'ЖДЁМ ВЕДУЩЕГО'; if (!st.host) again.onclick = () => {};
  };
  if (q.get('host')) { // spectator: poll the race over HTTP (keeps the desktop host's socket untouched)
    const url = (close = false) => `/rooms/${encodeURIComponent(cred.code)}/race?token=${encodeURIComponent(cred.token)}${close ? '&close=1' : ''}`;
    const poll = async () => {try {const r = await fetch(url()); const st = await r.json(); if (r.ok) {if (!raceId && st.race) await onState(st); else if (raceId && st.webGame !== 'race') {document.querySelector('#verdict')!.textContent = 'ЗАБЕГ ЗАКРЫТ';} else {offset += ((st.serverTime - Date.now()) - offset) * .2; app?.remote(st.runners);}}} catch {} setTimeout(poll, 120);};
    poll(); document.getElementById('again')!.onclick = () => fetch(url(true)); return;
  }
  const connect = () => {
    ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`);
    ws.onopen = () => send('AUTH', {roomCode: cred.code, token: cred.token});
    ws.onmessage = e => {try {const m = JSON.parse(e.data); if (m.type === 'RACE_POS') {if (m.payload.id === raceId) {offset += ((m.payload.serverTime - Date.now()) - offset) * .1; app?.remote(m.payload.runners);} return;}
      if (m.payload?.code && m.payload?.selfId !== undefined) onState(m.payload);} catch {}};
    ws.onclose = () => setTimeout(connect, 1500);
  };
  connect(); setInterval(() => send('PING', {roomCode: cred.code}), 8000);
}

const go = async (ch: string) => {
  pick.hidden = true; load.hidden = false; document.body.classList.add('playing');
  const app = new RaceApp(document.getElementById('stage')!, ch, map);
  await app.load(f => fill.style.width = `${Math.round(f * 100)}%`);
  load.hidden = true; app.start(); (window as any).__race = app;
  document.getElementById('again')!.onclick = () => location.reload();
};
if (q.get('net') || q.get('host')) online();
else if (q.get('char') && CHARACTERS.includes(q.get('char')!)) go(q.get('char')!);
else for (const c of CHARACTERS) {const b = document.createElement('button'); b.innerHTML = `<img src="portraits/${c}.png" alt=""><span>${NAMES[c]}</span>`; b.onclick = () => go(c); document.getElementById('roster')!.appendChild(b);}
for (const b of document.querySelectorAll<HTMLButtonElement>('#maps button')) {b.classList.toggle('on', Number(b.dataset.map) === map); b.onclick = () => {map = Number(b.dataset.map); document.querySelectorAll('#maps button').forEach(x => x.classList.toggle('on', x === b));};}
