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
/** chapter header: a dark ink band with the red numeral badge, the title, its subtitle and the difficulty */
function head(x: CanvasRenderingContext2D, n: string, title: string, sub: string) {
  const y0 = 64, h = 150; x.fillStyle = INK; rr(x, M - 14, y0, PW - 2 * M + 28, h, 14); x.fill();
  x.strokeStyle = 'rgba(233,200,140,.45)'; x.lineWidth = 2; rr(x, M - 6, y0 + 8, PW - 2 * M + 12, h - 16, 10); x.stroke();
  const cx = M + 66, cy = y0 + h / 2; x.fillStyle = RED; x.beginPath(); x.arc(cx, cy, 50, 0, 7); x.fill(); x.strokeStyle = 'rgba(255,236,200,.75)'; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, 42, 0, 7); x.stroke();
  font(x, n.length > 2 ? 38 : 50, CAPS, 'bold'); x.fillStyle = '#fbefd6'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(n, cx, cy + 3);
  x.textAlign = 'left'; x.textBaseline = 'alphabetic'; font(x, 60, CAPS, 'bold'); x.fillStyle = '#fbefd6'; x.fillText(title, M + 140, y0 + 86);
  font(x, 26, CAPS); x.fillStyle = '#e2b877'; x.fillText(sub, M + 143, y0 + 122);
  font(x, 19, CAPS, 'bold'); x.textAlign = 'right'; x.fillStyle = 'rgba(251,239,214,.6)'; x.fillText(L('СЛОЖНОСТЬ', 'DIFFICULTY'), PW - M - 8, y0 + 56); font(x, 26, CAPS, 'bold'); x.fillStyle = '#fbefd6'; x.fillText(diffName().toUpperCase(), PW - M - 8, y0 + 90); x.textAlign = 'left';
}
function rr(x: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, r: number) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
/** a section label: red small caps with a hairline running to the margin */
function section(x: CanvasRenderingContext2D, t: string, y: number) {
  font(x, 22, CAPS, 'bold'); x.fillStyle = RED; x.textAlign = 'left'; x.fillText(t, M, y); const w = x.measureText(t).width;
  x.strokeStyle = 'rgba(142,26,16,.35)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(M + w + 16, y - 7); x.lineTo(PW - M, y - 7); x.stroke(); return y + 44;
}
/** a numbered step: a dark disc with the number, the text beside it */
function step(x: CanvasRenderingContext2D, n: number, t: string, y: number) {
  x.fillStyle = INK; x.beginPath(); x.arc(M + 22, y - 11, 22, 0, 7); x.fill(); font(x, 26, SERIF, 'bold'); x.fillStyle = '#f6ead2'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), M + 22, y - 9); x.textBaseline = 'alphabetic';
  return wrap(x, t, M + 62, y, PW - 2 * M - 62, 32, SERIF, '', INK, 1.3) + 14;
}
/** the one rule that decides: a framed box, red bar, "MAIN RULE" label */
function rule(x: CanvasRenderingContext2D, t: string, y: number) {
  font(x, 34, SERIF, 'bold'); const lines: string[] = []; let line = ''; for (const w of t.split(' ')) { const test = line ? line + ' ' + w : w; if (x.measureText(test).width > PW - 2 * M - 64 && line) { lines.push(line); line = w; } else line = test; } if (line) lines.push(line);
  const h = 62 + lines.length * 44; x.fillStyle = 'rgba(142,26,16,.09)'; x.fillRect(M, y, PW - 2 * M, h); x.strokeStyle = 'rgba(142,26,16,.55)'; x.lineWidth = 2; x.strokeRect(M, y, PW - 2 * M, h); x.fillStyle = RED; x.fillRect(M, y, 10, h);
  font(x, 20, CAPS, 'bold'); x.fillStyle = RED; x.fillText(L('ГЛАВНОЕ ПРАВИЛО', 'THE RULE'), M + 32, y + 34);
  font(x, 34, SERIF, 'bold'); x.fillStyle = INK; lines.forEach((l, i) => x.fillText(l, M + 32, y + 80 + i * 44)); return y + h + 30;
}
/** a worked example in a dashed ledger box */
function example(x: CanvasRenderingContext2D, t: string, y: number) {
  font(x, 27, MONO); const lines: string[] = []; let line = ''; for (const w of t.split(' ')) { const test = line ? line + ' ' + w : w; if (x.measureText(test).width > PW - 2 * M - 56 && line) { lines.push(line); line = w; } else line = test; } if (line) lines.push(line);
  const h = 56 + lines.length * 38; x.setLineDash([8, 6]); x.strokeStyle = 'rgba(42,29,18,.55)'; x.lineWidth = 2; x.strokeRect(M, y, PW - 2 * M, h); x.setLineDash([]);
  font(x, 19, CAPS, 'bold'); x.fillStyle = 'rgba(42,29,18,.75)'; x.fillText(L('ПРИМЕР', 'EXAMPLE'), M + 24, y + 30);
  font(x, 27, MONO); x.fillStyle = INK; lines.forEach((l, i) => x.fillText(l, M + 24, y + 70 + i * 38)); return y + h + 28;
}
/** small grey caption */
const caption = (x: CanvasRenderingContext2D, t: string, y: number) => wrap(x, t, M, y, PW - 2 * M, 25, SERIF, 'italic', 'rgba(42,29,18,.75)');
/** the same warning strip at the foot of every mechanism page */
function warn(x: CanvasRenderingContext2D) {
  const y = PH - 168; x.fillStyle = 'rgba(42,29,18,.9)'; rr(x, M, y, PW - 2 * M, 52, 8); x.fill();
  const t = L('⚠  ОШИБКА СТОИТ ПОПЫТКИ · НЕ УВЕРЕН — ПЕРЕЧИТАЙ ПРАВИЛО', '⚠  A WRONG MOVE COSTS A TRY · NOT SURE — REREAD THE RULE'); let fs = 22; font(x, fs, CAPS, 'bold'); while (x.measureText(t).width > PW - 2 * M - 40 && fs > 14) font(x, --fs, CAPS, 'bold'); x.fillStyle = '#f2c46a'; x.textAlign = 'center'; x.fillText(t, PW / 2, y + 34); x.textAlign = 'left';
}
/** footer and a faint stamp on every page */
function frame(x: CanvasRenderingContext2D, page: number) {
  x.strokeStyle = 'rgba(42,29,18,.5)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(M, PH - 92); x.lineTo(PW - M, PH - 92); x.stroke();
  font(x, 21, CAPS); x.fillStyle = 'rgba(42,29,18,.7)'; x.textAlign = 'left'; x.fillText(L('ПОЛЕВОЙ БЛОКНОТ № 0451 · ОБЕЗВРЕЖИВАНИЕ', 'FIELD NOTEBOOK No 0451 · DEFUSAL'), M, PH - 58);
  font(x, 30, CAPS, 'bold'); x.textAlign = 'right'; x.fillStyle = INK; x.fillText(String(page), PW - M, PH - 56); x.textAlign = 'left';
}

const memo: Draw = x => {
  head(x, '§', L('Памятка', 'Briefing'), L('как обезвредить бомбу', 'how to defuse the bomb'));
  let y = section(x, L('ПОРЯДОК', 'ORDER'), 290); const lives = D === 'EASY' ? 3 : D === 'HARD' ? 1 : 2;
  y = step(x, 1, L('Откинь обе защёлки и подними крышку.', 'Flip both latches and lift the lid.'), y);
  y = step(x, 2, L('В чемодане три отсека. Заряжены все — обезвредь каждый.', 'The case holds three bays. All are armed — defuse each one.'), y);
  y = step(x, 3, L('Коснись отсека — он приблизится. Его номер на латунной табличке.', 'Tap a bay to bring it close. Its numeral is on the brass plate.'), y);
  y = step(x, 4, L('Открой страницу этого номера и иди по шагам сверху вниз.', 'Open that numeral\'s page and follow the steps top to bottom.'), y);
  y = rule(x, L(`Ошибок можно: ${lives}. Следующая — взрыв.`, `Mistakes allowed: ${lives}. The next one is the blast.`), y + 6);
  y = section(x, L('ОТСЕК → СТРАНИЦА', 'BAY → PAGE'), y + 4);
  const names = [L('Провода', 'Wires'), L('Контакты', 'Contacts'), L('Рентген', 'X-ray'), L('Лазер', 'Laser'), L('Тепло', 'Heat')];
  ['I', 'II', 'III', 'IV', 'V'].forEach((n, i) => { const ry = y - 34 + i * 62; if (i % 2 === 0) { x.fillStyle = 'rgba(42,29,18,.06)'; x.fillRect(M, ry, PW - 2 * M, 62); }
    font(x, 34, CAPS, 'bold'); x.fillStyle = RED; x.fillText(n, M + 20, ry + 43); font(x, 32); x.fillStyle = INK; x.fillText(names[i], M + 130, ry + 43);
    x.setLineDash([3, 8]); x.strokeStyle = 'rgba(42,29,18,.4)'; x.beginPath(); x.moveTo(M + 340, ry + 35); x.lineTo(PW - M - 100, ry + 35); x.stroke(); x.setLineDash([]);
    font(x, 32, MONO, 'bold'); x.textAlign = 'right'; x.fillText(L('стр. ', 'p. ') + (i + 2), PW - M - 20, ry + 43); x.textAlign = 'left'; });
};
const wires: Draw = x => {
  head(x, 'I', L('Провода', 'Wires'), L('лабиринт проводов', 'wire maze'));
  let y = section(x, L('ЧТО НАЙТИ', 'FIND'), 290);
  y = step(x, 1, L('Печать на ступице в центре панели → её буква в таблице.', 'The seal on the central hub → its letter in the table.'), y);
  SEALS.forEach((sl, i) => { const cw = 184, ch = 104, cx = M + (i % 4) * (cw + 12), cy = y - 8 + Math.floor(i / 4) * (ch + 12);
    x.fillStyle = 'rgba(255,250,235,.35)'; x.fillRect(cx, cy, cw, ch); x.strokeStyle = 'rgba(42,29,18,.55)'; x.lineWidth = 2; x.strokeRect(cx, cy, cw, ch); x.fillStyle = INK; drawSeal(x, sl, cx + 52, cy + ch / 2, 30);
    x.strokeStyle = 'rgba(42,29,18,.3)'; x.beginPath(); x.moveTo(cx + 100, cy + 16); x.lineTo(cx + 100, cy + ch - 16); x.stroke(); font(x, 56, SERIF, 'bold'); x.fillStyle = RED; x.textAlign = 'center'; x.fillText(SEAL_LETTER[sl], cx + 142, cy + ch / 2 + 20); x.textAlign = 'left'; });
  y += 2 * 116 + 28;
  y = section(x, L('ЧТО РЕЗАТЬ', 'WHAT TO CUT'), y);
  y = rule(x, D === 'EASY' ? L('Режь провод, который ВЫХОДИТ из этой буквы.', 'Cut the wire LEAVING that letter.') : L('Провод из буквы пришёл в 3, 6, 9 или 12? Режь тот, что приходит в номер +1. Иначе — его самого.', 'Does the letter\'s wire end on 3, 6, 9 or 12? Then cut the wire ending on number +1. Otherwise cut that one.'), y - 14);
  y = example(x, D === 'EASY' ? L('Печать ▲ → буква Δ. Из Δ выходит синий провод → режь синий.', 'Seal ▲ → letter Δ. The blue wire leaves Δ → cut blue.') : L('Печать ▲ → Δ. Провод из Δ пришёл в 6 → режь провод, что приходит в 7. Пришёл в 5 → режь его.', 'Seal ▲ → Δ. Its wire ends on 6 → cut the wire ending on 7. Ends on 5 → cut it.'), y);
  y = section(x, L('ДЕЙСТВИЕ', 'ACTION'), y + 4);
  step(x, 2, L('Коснись кусачек в углу отсека, затем нужного провода.', 'Tap the cutters in the bay corner, then the wire.'), y);
  warn(x);
};
const contacts: Draw = x => {
  head(x, 'II', L('Контакты', 'Contacts'), L('скрытые соединения', 'hidden connections'));
  let y = section(x, L('КАК ИЗМЕРЯТЬ', 'HOW TO MEASURE'), 290);
  y = step(x, 1, L('Красный щуп на цифру, чёрный на букву (или наоборот). Читай экран тестера:', 'Red probe on a number, black on a letter (or the other way). Read the tester:'), y);
  for (const [r, t] of [['0.62▶', L('ДИОД: ток идёт от красного щупа к чёрному', 'DIODE: current flows red → black')], ['OL', L('связи нет или диод повёрнут обратно', 'no link, or the diode is reversed')], ['0.00 · 4.7k', L('провод или резистор — не важно', 'wire or resistor — ignore')]]) {
    x.fillStyle = '#16210f'; rr(x, M, y - 6, 240, 58, 6); x.fill(); x.strokeStyle = '#05080a'; x.lineWidth = 3; x.stroke(); font(x, 30, MONO, 'bold'); x.fillStyle = '#9be08a'; x.textAlign = 'center'; x.fillText(r, M + 120, y + 34); x.textAlign = 'left';
    wrap(x, t, M + 266, y + 22, PW - 2 * M - 266, 27, SERIF, '', INK, 1.2); y += 74; }
  y = section(x, L('ЧТО ИСКАТЬ', 'WHAT YOU WANT'), y + 26);
  y = rule(x, D === 'EASY' ? L('Нужен единственный диод на панели.', 'You want the only diode on the panel.') : D === 'NORMAL' ? L('Нужен диод, который проводит от ЦИФРЫ к БУКВЕ.', 'You want the diode conducting from NUMBER to LETTER.') : L('Из диодов «цифра → буква» нужен тот, у которого цифра БОЛЬШЕ.', 'Of the number → letter diodes, the one with the HIGHER number.'), y - 14);
  y = example(x, D === 'EASY' ? L('Красный на 3, чёрный на B → 0.62▶. Это диод — он и нужен.', 'Red on 3, black on B → 0.62▶. That is the diode.') : D === 'NORMAL' ? L('Красный на 3, чёрный на B → 0.62▶: диод «3 → B». Это цифра → буква — он нужен.', 'Red on 3, black on B → 0.62▶: diode 3 → B. Number → letter — that one.') : L('Нашлись «2 → A» и «4 → D». У 4 цифра больше → нужна пара 4 и D.', 'Found 2 → A and 4 → D. 4 is higher → the pair 4 and D.'), y);
  y = section(x, L('ДЕЙСТВИЕ', 'ACTION'), y + 4);
  step(x, 2, L('Оба щупа на эту пару — нажми красную кнопку.', 'Both probes on that pair — press the red button.'), y);
  warn(x);
};
const xray: Draw = x => {
  head(x, 'III', L('Рентген', 'X-ray'), L('запаянные банки', 'sealed canisters'));
  let y = section(x, L('ЧТО НАЙТИ', 'FIND'), 290);
  y = step(x, 1, L('Буква в кружке на отсеке → её рисунок ниже.', 'The letter in the circle on the bay → its picture below.'), y);
  Object.entries(XRAY_TABLE).forEach(([k, ins], i) => { const col = i % 2, row = Math.floor(i / 2), cx = M + col * 412, cy = y - 18 + row * 128;
    x.strokeStyle = 'rgba(42,29,18,.35)'; x.lineWidth = 1.5; x.strokeRect(cx, cy, 396, 116);
    x.fillStyle = RED; x.beginPath(); x.arc(cx + 44, cy + 58, 28, 0, 7); x.fill(); font(x, 38, SERIF, 'bold'); x.fillStyle = '#f6ead2'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(k, cx + 44, cy + 60); x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    sketch(x, ins, cx + 236, cy + 58, 270); });
  y += 3 * 128 + 24;
  y = step(x, 2, L('Возьми сканер из угла отсека и веди его над банками.', 'Take the scanner from the bay corner and sweep it over the canisters.'), y);
  y = section(x, L('КАКУЮ ИЗОЛИРОВАТЬ', 'WHICH ONE'), y + 4);
  y = rule(x, L('Опасна банка с ТАКОЙ ЖЕ начинкой, как на рисунке: ядро, иглы, кольцо.', 'The dangerous canister has the SAME inside as the picture: core, needles, collar.'), y - 14);
  y = section(x, L('ДЕЙСТВИЕ', 'ACTION'), y + 4);
  step(x, 3, L('Переведи рычажок этой банки.', 'Throw that canister\'s lever.'), y);
  warn(x);
};
const laser: Draw = x => {
  head(x, 'IV', L('Лазер', 'Laser'), L('оптический контур', 'optical bed'));
  let y = section(x, L('ЧТО ПОСЧИТАТЬ', 'COUNT'), 290);
  y = step(x, 1, D === 'EASY' ? L('Посчитай красные заслонки на поле.', 'Count the red baffles on the bed.') : L('Посчитай красные заслонки и зеркала на поле. Датчики пронумерованы.', 'Count the red baffles and the mirrors. The sensors are numbered.'), y);
  y = section(x, L('КАКОЙ ДАТЧИК', 'WHICH SENSOR'), y + 6);
  y = rule(x, L('Номер датчика = ', 'Sensor number = ') + (D === 'EASY' ? L('числу заслонок.', 'the number of baffles.') : D === 'NORMAL' ? L('остаток от (заслонки + зеркала) ÷ число датчиков, плюс 1.', 'remainder of (baffles + mirrors) ÷ sensors, plus 1.') : L('остаток от (2 × заслонки + зеркала) ÷ число датчиков, плюс 1.', 'remainder of (2 × baffles + mirrors) ÷ sensors, plus 1.')), y - 14);
  y = example(x, D === 'EASY' ? L('2 заслонки → датчик 2.', '2 baffles → sensor 2.') : D === 'NORMAL' ? L('3 заслонки + 4 зеркала = 7. Датчиков 5: 7 ÷ 5 = 1, остаток 2. 2 + 1 → датчик 3.', '3 baffles + 4 mirrors = 7. 5 sensors: 7 ÷ 5 = 1 rem 2. 2 + 1 → sensor 3.') : L('2 × 4 заслонки + 5 зеркал = 13. Датчиков 6: 13 ÷ 6 = 2, остаток 1. 1 + 1 → датчик 2.', '2 × 4 baffles + 5 mirrors = 13. 6 sensors: 13 ÷ 6 = 2 rem 1. 1 + 1 → sensor 2.'), y);
  y = section(x, L('ДЕЙСТВИЕ', 'ACTION'), y + 4);
  y = step(x, 2, L('Касание зеркала поворачивает его на четверть оборота.', 'Tapping a mirror turns it a quarter.'), y);
  step(x, 3, L('Луч лёг на этот датчик — нажми латунную кнопку.', 'The beam is on that sensor — press the brass button.'), y);
  warn(x);
};
const heat: Draw = x => {
  head(x, 'V', L('Тепло', 'Heat'), L('тепловая угроза', 'thermal threat'));
  let y = section(x, L('ЧТО НАЙТИ', 'FIND'), 290);
  y = step(x, 1, L('Возьми тепловизор из угла отсека. Печать на отсеке → её строка в таблице.', 'Take the scope from the bay corner. The seal on the bay → its row in the table.'), y);
  font(x, 19, CAPS, 'bold'); x.fillStyle = RED; x.fillText(L('ПЕЧАТЬ', 'SEAL'), M + 14, y); x.fillText(L('РИСУНОК НАГРЕВА', 'HEAT PATTERN'), M + 140, y); x.textAlign = 'right'; x.fillText(L('ТЕМП., °C', 'TEMP, °C'), PW - M - 16, y); x.textAlign = 'left'; y += 10;
  SEALS.forEach((sl, i) => { const sg = THERMAL_TABLE[sl], ry = y + i * 58; if (i % 2 === 0) { x.fillStyle = 'rgba(42,29,18,.06)'; x.fillRect(M, ry, PW - 2 * M, 58); }
    x.fillStyle = INK; drawSeal(x, sl, M + 44, ry + 29, 21); heatIcon(x, sg.pattern, M + 210, ry + 29); font(x, 26); x.fillStyle = INK; x.fillText(PAT_NAME[sg.pattern](), M + 290, ry + 38);
    font(x, 30, MONO, 'bold'); x.textAlign = 'right'; x.fillText(`${sg.lo}–${sg.hi}`, PW - M - 16, ry + 39); x.textAlign = 'left'; });
  y += 8 * 58 + 44;
  y = section(x, L('КАКУЮ ИЗОЛИРОВАТЬ', 'WHICH ONE'), y);
  y = rule(x, D === 'EASY' ? L('Подходит ровно одна капсула — поверни её вентиль.', 'Exactly one capsule fits — turn its valve.') : L('Подойдут две — опасна та, у которой символ с углами (не ● и не ☾). Поверни её вентиль.', 'Two will fit — the one with an angular symbol (not ● or ☾). Turn its valve.'), y - 14);
  caption(x, L('Самая горячая капсула почти никогда не опасна.', 'The hottest capsule is almost never the one.'), y - 6);
  warn(x);
};
/** the notebook's six pages (memo + I–V), each drawing its own paper in 1000×1400 page space */
export function memoPages(d: MemoDiff = 'NORMAL'): ((x: CanvasRenderingContext2D) => void)[] {
  const pin = d; // the pages render lazily (when turned to), so each one re-pins its own difficulty
  return [memo, wires, contacts, xray, laser, heat].map((dr, i) => (x: CanvasRenderingContext2D) => { D = pin; paper(x, 300 + i); const ink = inkFor(x, 700 + i); dr(x, ink); frame(x, i + 1); });
}
