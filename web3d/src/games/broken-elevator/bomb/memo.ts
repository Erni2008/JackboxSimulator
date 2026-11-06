// THE HOST'S SUITCASE — the defusal notebook's pages, kept short: one memo page and one page per mechanism.
// Laid out like a printed field manual: a chapter badge, numbered step discs, one boxed RULE, ruled tables, a footer.
// Only the rules of the difficulty the host chose are printed.
import {L} from '../i18n';
import {PW, PH, paper, inkFor, type Ink} from './notebook';
import {drawSeal, SEALS, SEAL_LETTER} from './wire-maze';
import {XRAY_TABLE, sketch} from './xray';
import {THERMAL_TABLE, PAT_NAME, heatIcon} from './thermal';

type Draw = (x: CanvasRenderingContext2D, ink: Ink) => void;
export type MemoDiff = 'EASY' | 'NORMAL' | 'HARD';
/** the difficulty the pages are written for */
let D: MemoDiff = 'NORMAL';
const diffName = () => D === 'EASY' ? L('лёгкая', 'easy') : D === 'HARD' ? L('сложная', 'hard') : L('средняя', 'normal');

const INK = '#2a1d12', RED = '#8e1a10', SERIF = '"Libre Caslon Text", Georgia, serif', CAPS = '"IM Fell English SC", Georgia, serif', MONO = '"IBM Plex Mono", monospace', M = 96;
const font = (x: CanvasRenderingContext2D, px: number, f = SERIF, w = '') => { x.font = `${w ? w + ' ' : ''}${px}px ${f}`; };
/** wrapped text; returns the y below it */
function wrap(x: CanvasRenderingContext2D, t: string, px: number, y: number, maxW: number, size: number, f = SERIF, w = '', color = INK, lh = 1.32) {
  font(x, size, f, w); x.fillStyle = color; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; let line = '';
  for (const word of t.split(' ')) { const test = line ? line + ' ' + word : word; if (x.measureText(test).width > maxW && line) { x.fillText(line, px, y); line = word; y += size * lh; } else line = test; }
  if (line) x.fillText(line, px, y); return y + size * lh;
}
/** chapter header: a red badge with the numeral, the title in small caps, a double rule */
function head(x: CanvasRenderingContext2D, n: string, title: string, sub: string) {
  x.fillStyle = RED; x.beginPath(); x.arc(M + 52, 140, 52, 0, 7); x.fill(); x.strokeStyle = 'rgba(255,240,220,.6)'; x.lineWidth = 3; x.beginPath(); x.arc(M + 52, 140, 44, 0, 7); x.stroke();
  font(x, n.length > 2 ? 40 : 52, CAPS, 'bold'); x.fillStyle = '#f6ead2'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(n, M + 52, 144);
  x.textAlign = 'left'; x.textBaseline = 'alphabetic'; font(x, 64, CAPS, 'bold'); x.fillStyle = INK; x.fillText(title, M + 130, 150);
  font(x, 26, CAPS); x.fillStyle = RED; x.fillText(sub, M + 134, 186);
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(M, 222); x.lineTo(PW - M, 222); x.stroke(); x.lineWidth = 1; x.beginPath(); x.moveTo(M, 230); x.lineTo(PW - M, 230); x.stroke();
}
/** a numbered step: a dark-red disc with the number, the text beside it */
function step(x: CanvasRenderingContext2D, n: number, t: string, y: number) {
  x.fillStyle = INK; x.beginPath(); x.arc(M + 24, y - 12, 24, 0, 7); x.fill(); font(x, 30, SERIF, 'bold'); x.fillStyle = '#f6ead2'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), M + 24, y - 10); x.textBaseline = 'alphabetic';
  return wrap(x, t, M + 68, y, PW - 2 * M - 68, 34) + 16;
}
/** the one rule that decides: a tinted box with a red bar and a small RULE label */
function rule(x: CanvasRenderingContext2D, t: string, y: number) {
  font(x, 34, SERIF, 'bold'); const lines: string[] = []; let line = ''; for (const w of t.split(' ')) { const test = line ? line + ' ' + w : w; if (x.measureText(test).width > PW - 2 * M - 70 && line) { lines.push(line); line = w; } else line = test; } if (line) lines.push(line);
  const h = 52 + lines.length * 44; x.fillStyle = 'rgba(142,26,16,.08)'; x.fillRect(M, y, PW - 2 * M, h); x.fillStyle = RED; x.fillRect(M, y, 9, h);
  font(x, 20, CAPS, 'bold'); x.fillStyle = RED; x.fillText(L('ПРАВИЛО', 'RULE'), M + 34, y + 32);
  font(x, 34, SERIF, 'bold'); x.fillStyle = INK; lines.forEach((l, i) => x.fillText(l, M + 34, y + 76 + i * 44)); return y + h + 34;
}
/** small grey caption */
const caption = (x: CanvasRenderingContext2D, t: string, y: number) => wrap(x, t, M, y, PW - 2 * M, 26, SERIF, 'italic', 'rgba(42,29,18,.72)');
/** footer and a faint stamp on every page */
function frame(x: CanvasRenderingContext2D, page: number) {
  x.save(); x.translate(PW - 190, 120); x.rotate(.18); x.strokeStyle = 'rgba(142,26,16,.28)'; x.lineWidth = 4; x.strokeRect(-92, -30, 184, 56); font(x, 30, CAPS, 'bold'); x.fillStyle = 'rgba(142,26,16,.28)'; x.textAlign = 'center'; x.fillText(L('СЕКРЕТНО', 'SECRET'), 0, 9); x.restore();
  x.strokeStyle = 'rgba(42,29,18,.5)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(M, PH - 92); x.lineTo(PW - M, PH - 92); x.stroke();
  font(x, 22, CAPS); x.fillStyle = 'rgba(42,29,18,.7)'; x.textAlign = 'left'; x.fillText(L('ПОЛЕВОЙ БЛОКНОТ № 0451 · ОБЕЗВРЕЖИВАНИЕ', 'FIELD NOTEBOOK No 0451 · DEFUSAL'), M, PH - 60);
  font(x, 30, CAPS, 'bold'); x.textAlign = 'right'; x.fillStyle = INK; x.fillText(String(page), PW - M, PH - 58); x.textAlign = 'left';
}

const memo: Draw = x => {
  head(x, '§', L('Памятка', 'Memo'), L(`сложность: ${diffName()}`, `difficulty: ${diffName()}`));
  let y = 320; const lives = D === 'EASY' ? 3 : D === 'HARD' ? 1 : 2;
  y = step(x, 1, L('Откинь обе защёлки, затем подними крышку.', 'Flip both latches, then lift the lid.'), y);
  y = step(x, 2, L('В чемодане три отсека — все заряжены.', 'The case holds three bays — all armed.'), y);
  y = step(x, 3, L('Коснись отсека и найди его страницу.', 'Tap a bay and find its page.'), y);
  y = rule(x, L(`Ошибок можно: ${lives}. Следующая — взрыв.`, `Mistakes allowed: ${lives}. The next one is the blast.`), y + 10);
  // index: the numeral on the bay's brass plate → page
  font(x, 26, CAPS, 'bold'); x.fillStyle = RED; x.fillText(L('ОТСЕК → СТРАНИЦА', 'BAY → PAGE'), M, y + 10); y += 30;
  const names = [L('Провода', 'Wires'), L('Контакты', 'Contacts'), L('Рентген', 'X-ray'), L('Лазер', 'Laser'), L('Тепло', 'Heat')];
  ['I', 'II', 'III', 'IV', 'V'].forEach((n, i) => { const ry = y + 20 + i * 64; if (i % 2 === 0) { x.fillStyle = 'rgba(42,29,18,.05)'; x.fillRect(M, ry, PW - 2 * M, 64); }
    font(x, 34, CAPS, 'bold'); x.fillStyle = RED; x.fillText(n, M + 20, ry + 44); font(x, 32); x.fillStyle = INK; x.fillText(names[i], M + 130, ry + 44);
    x.setLineDash([3, 8]); x.strokeStyle = 'rgba(42,29,18,.4)'; x.beginPath(); x.moveTo(M + 330, ry + 36); x.lineTo(PW - M - 90, ry + 36); x.stroke(); x.setLineDash([]);
    font(x, 32, MONO, 'bold'); x.textAlign = 'right'; x.fillText(String(i + 2), PW - M - 20, ry + 44); x.textAlign = 'left'; });
};
const wires: Draw = x => {
  head(x, 'I', L('Провода', 'Wires'), L('лабиринт проводов', 'wire maze'));
  let y = 310; y = step(x, 1, L('Посмотри печать на ступице в центре.', 'Look at the seal on the central hub.'), y);
  y = step(x, 2, L('Найди её в таблице — получишь букву.', 'Find it in the table — that gives a letter.'), y);
  // seal → letter cards
  SEALS.forEach((sl, i) => { const cw = 182, ch = 150, cx = M + (i % 4) * (cw + 14), cy = y + Math.floor(i / 4) * (ch + 14);
    x.strokeStyle = 'rgba(42,29,18,.55)'; x.lineWidth = 2; x.strokeRect(cx, cy, cw, ch); x.fillStyle = INK; drawSeal(x, sl, cx + 54, cy + 75, 34);
    x.strokeStyle = 'rgba(42,29,18,.3)'; x.beginPath(); x.moveTo(cx + 104, cy + 20); x.lineTo(cx + 104, cy + ch - 20); x.stroke(); font(x, 58, SERIF, 'bold'); x.fillStyle = RED; x.textAlign = 'center'; x.fillText(SEAL_LETTER[sl], cx + 143, cy + 96); x.textAlign = 'left'; });
  y += 2 * 164 + 30;
  y = rule(x, D === 'EASY' ? L('Режь провод, который ВЫХОДИТ из этой буквы.', 'Cut the wire LEAVING that letter.') : L('Провод из буквы пришёл в 3, 6, 9 или 12? Тогда режь тот, что приходит в номер +1. Иначе — его самого.', 'Does the letter\'s wire end on 3, 6, 9 or 12? Then cut the wire into number +1. Otherwise that one.'), y);
  caption(x, L('Кусачки лежат в углу отсека: коснись их, затем провода.', 'The cutters lie in the bay corner: tap them, then the wire.'), y);
};
const contacts: Draw = x => {
  head(x, 'II', L('Контакты', 'Contacts'), L('скрытые соединения', 'hidden connections'));
  let y = 310; y = step(x, 1, L('Щуп на букву, щуп на цифру — читай экран.', 'A probe on a letter, one on a number — read the screen.'), y);
  for (const [r, t] of [['0.62▶', L('ДИОД: ток от красного к чёрному', 'DIODE: red → black')], ['OL', L('нет связи или диод наоборот', 'no link, or a diode reversed')], ['0.00 · 4.7k', L('не важно', 'ignore')]]) {
    x.fillStyle = '#16210f'; x.fillRect(M, y - 4, 250, 60); x.strokeStyle = '#05080a'; x.lineWidth = 3; x.strokeRect(M, y - 4, 250, 60); font(x, 32, MONO, 'bold'); x.fillStyle = '#9be08a'; x.textAlign = 'center'; x.fillText(r, M + 125, y + 38); x.textAlign = 'left';
    font(x, 30); x.fillStyle = INK; x.fillText(t, M + 280, y + 36); y += 80; }
  y += 10; y = rule(x, D === 'EASY' ? L('Нужен единственный диод на панели.', 'You want the only diode on the panel.') : D === 'NORMAL' ? L('Нужен диод, который проводит от ЦИФРЫ к БУКВЕ.', 'You want the diode conducting from NUMBER to LETTER.') : L('Из диодов «цифра → буква» нужен тот, у которого цифра БОЛЬШЕ.', 'Of the number → letter diodes, the one with the LARGER number.'), y);
  step(x, 2, L('Оба щупа на эту пару — нажми красную кнопку.', 'Both probes on that pair — press the red button.'), y);
};
const xray: Draw = x => {
  head(x, 'III', L('Рентген', 'X-ray'), L('запаянные банки', 'sealed canisters'));
  let y = 310; y = step(x, 1, L('Посмотри букву в кружке на отсеке.', 'Look at the letter in the circle on the bay.'), y);
  y = step(x, 2, L('Возьми сканер из угла отсека, веди над банками, сравни с рисунком.', 'Take the scanner from the bay corner, sweep it, compare with the picture.'), y);
  Object.entries(XRAY_TABLE).forEach(([k, ins], i) => { const col = i % 2, row = Math.floor(i / 2), cx = M + col * 410, cy = y + row * 170;
    x.fillStyle = RED; x.beginPath(); x.arc(cx + 34, cy + 56, 30, 0, 7); x.fill(); font(x, 38, SERIF, 'bold'); x.fillStyle = '#f6ead2'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(k, cx + 34, cy + 58); x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    sketch(x, ins, cx + 230, cy + 56, 290); });
  y += 3 * 170 + 10; rule(x, L('Опасна банка с ТАКОЙ ЖЕ начинкой: ядро, иглы, кольцо. Переведи её рычажок.', 'The dangerous canister has the SAME inside: core, needles, collar. Throw its lever.'), y);
};
const laser: Draw = x => {
  head(x, 'IV', L('Лазер', 'Laser'), L('оптический контур', 'optical bed'));
  let y = 310; y = step(x, 1, L('Посчитай красные заслонки (З) и зеркала (Зр).', 'Count the red baffles (B) and the mirrors (M).'), y);
  y = rule(x, L('Номер датчика = ', 'Sensor number = ') + (D === 'EASY' ? L('числу заслонок.', 'the number of baffles.') : D === 'NORMAL' ? L('остаток от (З + Зр) ÷ число датчиков, плюс 1.', 'remainder of (B + M) ÷ sensors, plus 1.') : L('остаток от (2·З + Зр) ÷ число датчиков, плюс 1.', 'remainder of (2·B + M) ÷ sensors, plus 1.')), y);
  // worked example in a ledger box
  x.strokeStyle = 'rgba(42,29,18,.5)'; x.lineWidth = 2; x.strokeRect(M, y, PW - 2 * M, 120); font(x, 20, CAPS, 'bold'); x.fillStyle = RED; x.fillText(L('ПРИМЕР', 'EXAMPLE'), M + 24, y + 34);
  font(x, 30, MONO); x.fillStyle = INK; x.fillText(D === 'EASY' ? L('2 заслонки → датчик 2', '2 baffles → sensor 2') : D === 'NORMAL' ? L('3 З + 4 Зр = 7; 7 ÷ 5 → ост. 2; датчик 3', '3 B + 4 M = 7; 7 ÷ 5 → rem 2; sensor 3') : L('2·4 + 5 = 13; 13 ÷ 6 → ост. 1; датчик 2', '2·4 + 5 = 13; 13 ÷ 6 → rem 1; sensor 2'), M + 24, y + 84); y += 160;
  y = step(x, 2, L('Касание зеркала поворачивает его на четверть.', 'Tapping a mirror turns it a quarter.'), y);
  step(x, 3, L('Луч на нужном датчике — нажми латунную кнопку.', 'Beam on that sensor — press the brass button.'), y);
};
const heat: Draw = x => {
  head(x, 'V', L('Тепло', 'Heat'), L('тепловая угроза', 'thermal threat'));
  let y = 300; y = step(x, 1, L('Возьми тепловизор из угла отсека. Печать на отсеке → строка таблицы.', 'Take the scope from the bay corner. Seal on the bay → its table row.'), y);
  font(x, 20, CAPS, 'bold'); x.fillStyle = RED; x.fillText(L('ПЕЧАТЬ', 'SEAL'), M + 10, y); x.fillText(L('РИСУНОК', 'PATTERN'), M + 140, y); x.fillText('°C', PW - M - 80, y); y += 12;
  SEALS.forEach((sl, i) => { const sg = THERMAL_TABLE[sl], ry = y + i * 74; if (i % 2 === 0) { x.fillStyle = 'rgba(42,29,18,.05)'; x.fillRect(M, ry, PW - 2 * M, 74); }
    x.fillStyle = INK; drawSeal(x, sl, M + 44, ry + 37, 24); heatIcon(x, sg.pattern, M + 210, ry + 37); font(x, 26); x.fillStyle = INK; x.fillText(PAT_NAME[sg.pattern](), M + 290, ry + 46);
    font(x, 32, MONO, 'bold'); x.textAlign = 'right'; x.fillText(`${sg.lo}–${sg.hi}`, PW - M - 16, ry + 48); x.textAlign = 'left'; });
  y += 8 * 74 + 30;
  y = rule(x, D === 'EASY' ? L('Подходит ровно одна капсула — поверни её вентиль.', 'Exactly one capsule fits — turn its valve.') : L('Подойдут две — опасна та, у которой символ с углами (не ● и не ☾). Поверни её вентиль.', 'Two will fit — the one with an angular symbol (not ● or ☾). Turn its valve.'), y);
  caption(x, L('Самая горячая капсула почти никогда не опасна.', 'The hottest capsule is almost never the one.'), y);
};
/** the notebook's six pages (memo + I–V), each drawing its own paper in 1000×1400 page space */
export function memoPages(d: MemoDiff = 'NORMAL'): ((x: CanvasRenderingContext2D) => void)[] {
  const pin = d; // the pages render lazily (when turned to), so each one re-pins its own difficulty
  return [memo, wires, contacts, xray, laser, heat].map((dr, i) => (x: CanvasRenderingContext2D) => { D = pin; paper(x, 300 + i); const ink = inkFor(x, 700 + i); dr(x, ink); frame(x, i + 1); });
}
