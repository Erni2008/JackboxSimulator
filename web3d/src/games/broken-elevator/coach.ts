// THE BROKEN ELEVATOR — first-time briefing per machine, and the end-of-run report.
import {L} from './i18n';
import {diffName} from './difficulty';

export type Kind = 'wire' | 'pressure' | 'formula';
const KEY = 'finalanswer-elevator-tutorial';
const seen = (): Set<string> => { try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); } };
const mark = (k: Kind) => { try { const s = seen(); s.add(k); localStorage.setItem(KEY, JSON.stringify([...s])); } catch {} };
const force = new URLSearchParams(location.search).get('tutorial');

interface Brief { icon: string; title: string; goal: string; steps: [string, string][]; tip: string }
const BRIEF = (k: Kind, seconds: number): Brief => k === 'wire' ? {
  icon: '⚡', title: L('Щиток проводов', 'The wire panel'), goal: L(`Перережьте один верный провод за ${seconds} с.`, `Cut the one correct wire within ${seconds} s.`),
  steps: [['①', L('Откройте дверцу щитка — таймер пойдёт с этого момента.', 'Open the panel door — the timer starts then.')],
    ['②', L('Нажмите ТЕСТ и посмотрите на амперметр и лампы.', 'Press TEST and read the ammeter and lamps.')],
    ['③', L('Найдите неисправность в «Руководстве инженера» и режьте провод по правилу.', 'Find the fault in the Engineer’s Manual and cut by its rule.')]],
  tip: L('Неверный провод — лифт сорвётся вниз.', 'A wrong wire drops the car.')}
  : k === 'pressure' ? {
  icon: '◉', title: L('Сломанные клапаны', 'The broken valves'), goal: L(`Удержите стрелку в зелёной зоне 1 секунду. Время: ${seconds} с.`, `Hold the needle in the green zone for 1 second. Time: ${seconds} s.`),
  steps: [['①', L('ТЕСТ покажет код поломки. Найдите его в руководстве (раздел IV).', 'TEST shows the fault code. Look it up in the manual (section IV).')],
    ['②', L('Устраните поломку: рычаг обхода или хомут на течь.', 'Fix it: bypass lever or the clamp for a leak.')],
    ['③', L('Красный вентиль поднимает давление, синий снижает. «Точно» — мелкий шаг.', 'Red valve raises pressure, blue lowers it. FINE gives small steps.')]],
  tip: L('120 PSI — взрыв. Следите за скачками давления.', '120 PSI means an explosion. Watch for surges.')}
  : {
  icon: '⚗', title: L('Нестабильная формула', 'The unstable formula'), goal: L(`Приготовьте охлаждающую формулу и введите её. Время: ${seconds} с.`, `Prepare the cooling formula and inject it. Time: ${seconds} s.`),
  steps: [['①', L('Прочитайте пробу на анализаторе: семейство, класс, реакция…', 'Read the sample on the analyzer: family, class, reaction…')],
    ['②', L('В «Журнале алхимика» найдите основу, добавку и порядок доз.', 'In the Alchemist’s Journal find base, additive and dose order.')],
    ['③', L('Наберите дозы по порядку и нажмите ВПРЫСК.', 'Dispense the doses in order and press INJECT.')]],
  tip: L('Нестабильный реагент — только с включённым замком охлаждения.', 'An unstable reagent needs the cooling lock on.')};

let el: HTMLElement | null = null;
function host() { if (!el) { el = document.createElement('div'); el.id = 'coach'; document.body.append(el); } return el; }
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]!));

/** shows the briefing the first time this device meets a machine (or always with ?tutorial=1); resolves when dismissed */
export function briefing(k: Kind, seconds: number, onShow: () => void = () => {}): Promise<void> {
  if (force === '0' || (force !== '1' && seen().has(k))) return Promise.resolve();
  const b = BRIEF(k, seconds), h = host(); onShow();
  h.innerHTML = `<div class="card brief"><div class="kick">${esc(L('ИНСТРУКТАЖ', 'BRIEFING'))} · ${esc(diffName().toUpperCase())}</div><div class="ic">${b.icon}</div><h2>${esc(b.title)}</h2><p class="goal">${esc(b.goal)}</p>
    <ol>${b.steps.map(([n, t]) => `<li><b>${n}</b><span>${esc(t)}</span></li>`).join('')}</ol><p class="tip">⚠ ${esc(b.tip)}</p><button class="go">${esc(L('Понятно — начать', 'Got it — start'))}</button></div>`;
  h.className = 'show';
  return new Promise(res => { h.querySelector<HTMLButtonElement>('.go')!.onclick = () => { mark(k); h.className = ''; setTimeout(() => { if (!h.className) h.innerHTML = ''; }, 400); res(); }; });
}

export interface TaskRecord { n: number; kind: Kind; ok: boolean; seconds: number; mistakes: number; why: string }
const KIND = (k: Kind) => k === 'wire' ? L('Провода', 'Wires') : k === 'pressure' ? L('Клапаны', 'Valves') : L('Формула', 'Formula');
/** the end-of-run report; resolves with the chosen action */
export function report(rows: TaskRecord[]): Promise<'again' | 'room'> {
  const h = host(), ok = rows.filter(r => r.ok), avg = ok.length ? ok.reduce((a, r) => a + r.seconds, 0) / ok.length : 0, falls = rows.length - ok.length, mist = rows.reduce((a, r) => a + r.mistakes, 0);
  const best = ok.slice().sort((a, b) => a.seconds - b.seconds)[0];
  const grade = falls === 0 ? L('Безупречно', 'Flawless') : falls <= 2 ? L('Надёжный механик', 'Reliable mechanic') : falls <= 5 ? L('На волоске', 'Hanging by a thread') : L('Кабина в лаве', 'Into the lava');
  let inRoom = false; try { inRoom = !!sessionStorage.getItem('finalanswer-session'); } catch {}
  h.innerHTML = `<div class="card report"><div class="kick">${esc(L('ИТОГИ СМЕНЫ', 'SHIFT REPORT'))} · ${esc(diffName().toUpperCase())}</div><h2>${esc(grade)}</h2>
    <div class="stats"><div><b>${ok.length}/${rows.length}</b><span>${esc(L('ремонтов', 'repairs'))}</span></div><div><b>${falls}</b><span>${esc(L('падений', 'falls'))}</span></div>
    <div><b>${avg ? avg.toFixed(1) + L(' с', ' s') : '—'}</b><span>${esc(L('среднее время', 'average time'))}</span></div><div><b>${mist}</b><span>${esc(L('ошибок', 'mistakes'))}</span></div></div>
    <table><thead><tr><th>№</th><th>${esc(L('Машина', 'Machine'))}</th><th>${esc(L('Время', 'Time'))}</th><th>${esc(L('Ошибки', 'Mistakes'))}</th><th></th></tr></thead><tbody>
    ${rows.map(r => `<tr class="${r.ok ? 'ok' : 'bad'}${best && r === best ? ' best' : ''}"><td>${r.n}</td><td>${esc(KIND(r.kind))}</td><td>${r.seconds.toFixed(1)}${esc(L(' с', ' s'))}</td><td>${r.mistakes}</td><td>${r.ok ? '✓' : '✗'}</td></tr>`).join('')}</tbody></table>
    ${best ? `<p class="tip">★ ${esc(L('Лучший ремонт', 'Best repair'))}: №${best.n} · ${esc(KIND(best.kind))} · ${best.seconds.toFixed(1)}${esc(L(' с', ' s'))}</p>` : ''}
    <div class="row"><button class="go again">${esc(L('Ещё смена', 'Another shift'))}</button>${inRoom ? `<button class="go alt room">${esc(L('В комнату', 'Back to room'))}</button>` : ''}</div></div>`;
  h.className = 'show report-on';
  return new Promise(res => { const close = (v: 'again' | 'room') => { h.className = ''; h.innerHTML = ''; res(v); };
    h.querySelector<HTMLButtonElement>('.again')!.onclick = () => close('again'); const r = h.querySelector<HTMLButtonElement>('.room'); if (r) r.onclick = () => close('room'); });
}
