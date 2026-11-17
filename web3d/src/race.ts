import {RaceApp, CHARACTERS, NAMES} from './games/race/race';
const q = new URLSearchParams(location.search);
let map = [1, 2, 3, 4].includes(Number(q.get('map'))) ? Number(q.get('map')) : 1;
const pick = document.getElementById('pick')!, load = document.getElementById('loading')!, fill = document.getElementById('load-fill')!;
const go = async (ch: string) => {
  pick.hidden = true; load.hidden = false; document.body.classList.add('playing');
  const app = new RaceApp(document.getElementById('stage')!, ch, map);
  await app.load(f => fill.style.width = `${Math.round(f * 100)}%`);
  load.hidden = true; app.start();
  document.getElementById('again')!.onclick = () => location.reload();
};
if (q.get('char') && CHARACTERS.includes(q.get('char')!)) go(q.get('char')!);
else for (const c of CHARACTERS) {const b = document.createElement('button'); b.innerHTML = `<img src="../hell-cage-host/chars/${c}.png" alt=""><span>${NAMES[c]}</span>`; b.onclick = () => go(c); document.getElementById('roster')!.appendChild(b);}
for (const b of document.querySelectorAll<HTMLButtonElement>('#maps button')) {b.classList.toggle('on', Number(b.dataset.map) === map); b.onclick = () => {map = Number(b.dataset.map); document.querySelectorAll('#maps button').forEach(x => x.classList.toggle('on', x === b));};}
