import {RaceApp, CHARACTERS, NAMES, SKIN} from './games/race/race';
import {TRIALS} from './games/race/course';
import {t as lx} from './games/race/i18n';
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
    app = new RaceApp(document.getElementById('stage')!, me?.char || 'pumpkin', st.race.map, {roster, selfId: st.selfId, seed: st.race.seed, startAt: st.race.startAt, serverNow, send: (s, extra) => send('RACE_STATE', {roomCode: cred.code, s, ...(extra || {})}), spark: () => send('RACE_SPARK', {roomCode: cred.code}), spectator: !!st.host});
    if (st.run) app.surv?.apply(st.run);
    await app.load(f => fill.style.width = `${Math.round(f * 100)}%`); if (st.run) {app.surv?.apply(st.run); if (app.surv) app.surv.pending = null;} load.hidden = true; app.start(); (window as any).__race = app;
    const tap = document.getElementById('tap')!; tap.hidden = false; tap.onclick = () => {tap.hidden = true; app!.snd.unlock(); app!.snd.ambience(app!.course.theme); app!.snd.playMusic('audio/music.m4a');};
    document.getElementById('intro-skip')!.onclick = () => {app!.introSkipped = true; document.getElementById('intro')!.hidden = true; app!.snd.voice('');};
    const again = document.getElementById('again')!; again.textContent = st.host ? 'В ЛОББИ' : 'ЖДЁМ ВЕДУЩЕГО'; if (!st.host) again.onclick = () => {};
  };
  if (q.get('host')) { // spectator: poll the race over HTTP (keeps the desktop host's socket untouched)
    const url = (close = false) => `/rooms/${encodeURIComponent(cred.code)}/race?token=${encodeURIComponent(cred.token)}${close ? '&close=1' : ''}`;
    const poll = async () => {try {const r = await fetch(url()); const st = await r.json(); if (r.ok) {if (!raceId && st.race) await onState(st); else if (raceId && st.webGame !== 'race') {document.querySelector('#verdict')!.textContent = 'ЗАБЕГ ЗАКРЫТ';} else {offset += ((st.serverTime - Date.now()) - offset) * .2; app?.remote(st.runners); if (st.run) app?.surv?.apply(st.run);}}} catch {} setTimeout(poll, 120);};
    poll(); document.getElementById('again')!.onclick = () => fetch(url(true)); return;
  }
  const connect = () => {
    ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`);
    ws.onopen = () => send('AUTH', {roomCode: cred.code, token: cred.token});
    ws.onmessage = e => {try {const m = JSON.parse(e.data); if (m.type === 'RACE_POS') {if (m.payload.id === raceId) {offset += ((m.payload.serverTime - Date.now()) - offset) * .1; app?.remote(m.payload.runners); if (m.payload.run) app?.surv?.apply(m.payload.run);} return;}
      if (m.payload?.run && app) app.surv?.apply(m.payload.run);
      if (m.payload?.code && m.payload?.selfId !== undefined) onState(m.payload);} catch {}};
    ws.onclose = () => setTimeout(connect, 1500);
  };
  connect(); setInterval(() => send('PING', {roomCode: cred.code}), 8000);
}

const go = async (ch: string) => {
  pick.hidden = true; load.hidden = false; document.body.classList.add('playing');
  const app = new RaceApp(document.getElementById('stage')!, ch, map);
  await app.load(f => fill.style.width = `${Math.round(f * 100)}%`);
  {const ln = (window as any).__laneName?.(); if (ln) {const tag = document.createElement('div'); tag.id = 'lane-tag'; tag.textContent = ln; document.body.appendChild(tag);}}
  load.hidden = true; app.snd.unlock(); app.snd.ambience(app.course.theme); app.snd.playMusic('audio/music.m4a'); app.start(); (window as any).__race = app;
  document.getElementById('intro-skip')!.onclick = () => {app.introSkipped = true; app.snd.voice('');};
  document.getElementById('again')!.onclick = () => location.reload();
};
if (q.get('net') || q.get('host')) online();
else if (q.get('char') && CHARACTERS.includes(q.get('char')!)) go(q.get('char')!);
else for (const c of CHARACTERS) {const b = document.createElement('button'); b.innerHTML = `<img src="portraits/${c}.png" alt=""><span>${NAMES[c]}</span>`; b.onclick = () => go(c); document.getElementById('roster')!.appendChild(b);}
for (const b of document.querySelectorAll<HTMLButtonElement>('#maps button')) {b.classList.toggle('on', Number(b.dataset.map) === map); b.onclick = () => {map = Number(b.dataset.map); document.querySelectorAll('#maps button').forEach(x => x.classList.toggle('on', x === b));};}
// test a single lane: pick it like the map (or ?t=N in the address); the choice goes into the URL the race reads
const LANES: [string, string][] = [['Мельница','Windmill'],['Мясорубка','Meat grinder'],['Верх-низ','High-low'],['Провалы','Gaps'],['Узкие балки','Narrow beams'],['Маятники','Pendulums'],['Плоты','Rafts'],['Обвал пола','Crumbling floor'],['Трясина','Quagmire'],['Тараны','Rams'],['Батуты','Trampolines'],['Люки','Trapdoors'],['Транспортёр','Conveyor'],['Огненный пол','Fire floor'],['Молоты','Hammers'],['Змейка','Zigzag'],['Скат с бочками','Barrel ramp'],['Дождь с неба','Sky rain'],['Лабиринт','Maze'],['Ложные стены','Fake walls'],['Порталы','Portals'],['Гигантские шестерни','Giant gears'],['Смертельные ворота','Deadly gates'],['Ветряной коридор','Wind corridor'],['Катящийся валун','Rolling boulder'],['Переворачивающаяся комната','Tilting room'],['Крюки','Hooks'],['Ложный мост','False bridge'],['Безумные вагонетки','Mad minecarts']];
{
  const tq = q.get('t'); let lane = tq ? (Number(tq) || TRIALS.indexOf(tq) + 1) : 0; if (!(lane >= 1 && lane <= TRIALS.length)) lane = 0;
  const box = document.createElement('div'); box.id = 'lanes';
  const all = [`<button data-lane="0" class="all"><b>${lx('Вся трасса','Full course')}</b></button>`].concat(LANES.slice(0, TRIALS.length).map((n, i) => `<button data-lane="${i + 1}"><i>${i + 1}</i><b>${lx(n[0], n[1])}</b></button>`));
  box.innerHTML = `<span>${lx('Полоса','Lane')}</span><div>${all.join('')}</div>`;
  document.getElementById('maps')!.after(box);
  const mark = () => box.querySelectorAll<HTMLButtonElement>('button').forEach(x => x.classList.toggle('on', Number(x.dataset.lane) === lane));
  box.querySelectorAll<HTMLButtonElement>('button').forEach(x => x.onclick = () => {lane = Number(x.dataset.lane); const u = new URL(location.href); if (lane) u.searchParams.set('t', String(lane)); else u.searchParams.delete('t'); history.replaceState(null, '', u); mark();});
  mark();
  (window as any).__laneName = () => lane ? `${lane} · ${lx(LANES[lane - 1][0], LANES[lane - 1][1])}` : '';
}
for (const b of document.querySelectorAll<HTMLButtonElement>('#skins button')) {b.classList.toggle('on', b.dataset.skin === SKIN); b.onclick = () => {try {localStorage.setItem('race-skin', b.dataset.skin!);} catch {} location.reload();};}
