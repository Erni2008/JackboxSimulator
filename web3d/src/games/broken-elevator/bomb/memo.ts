// THE HOST'S SUITCASE — the defusal notebook's pages, kept short: one memo page and one page per mechanism.
// A few words in big type plus a table or a picture; nobody reads paragraphs with a fuse ticking.
import {L} from '../i18n';
import {PW, PH, paper, inkFor, type Ink} from './notebook';
import {drawSeal, SEALS, SEAL_LETTER} from './wire-maze';
import {XRAY_TABLE, sketch} from './xray';
import {THERMAL_TABLE, PAT_NAME, heatIcon} from './thermal';

type Draw = (x: CanvasRenderingContext2D, ink: Ink) => void;
export type MemoDiff = 'EASY' | 'NORMAL' | 'HARD';
/** the difficulty the pages are written for (only its rules are printed) */
let D: MemoDiff = 'NORMAL';
const diffName = () => D === 'EASY' ? L('лёгкая', 'easy') : D === 'HARD' ? L('сложная', 'hard') : L('средняя', 'normal');
const head = (ink: Ink, n: string, t: string) => { ink.print(n, 90, 150, 70, {bold: true, color: '#7a1408', font: '"IM Fell English SC", Georgia, serif'}); ink.print(t, 200, 150, 58, {bold: true, font: '"IM Fell English SC", Georgia, serif'}); ink.rule(190); };
/** a numbered line in big type (wraps) */
const step = (ink: Ink, n: string, t: string, y: number) => { ink.print(n, 90, y, 44, {bold: true, color: '#7a1408'}); return ink.para(t, 150, y, PW - 230, 38, 1.3) + 14; };
const tag = (x: CanvasRenderingContext2D, ink: Ink, t: string, y: number, red = false) => { x.fillStyle = red ? 'rgba(168,38,26,.12)' : 'rgba(40,26,14,.07)'; x.fillRect(80, y - 44, PW - 160, 62); ink.print(t, 100, y, 34, {bold: true, color: red ? '#7a1408' : '#241a10'}); };

const memo: Draw = (x, ink) => {
  ink.print(L('ПАМЯТКА', 'MEMO'), PW / 2, 150, 76, {bold: true, align: 'center', font: '"IM Fell English SC", Georgia, serif'}); ink.print(L(`сложность: ${diffName()}`, `difficulty: ${diffName()}`), PW / 2, 196, 32, {align: 'center', color: '#7a1408'}); ink.rule(220);
  let y = 300; y = step(ink, '1', L('Открой 2 защёлки, потом крышку.', 'Flip both latches, then the lid.'), y);
  y = step(ink, '2', L('В чемодане 3 отсека — все заряжены.', 'The case holds 3 bays — all armed.'), y);
  y = step(ink, '3', L('Коснись отсека → его страница здесь.', 'Tap a bay → its page in here.'), y);
  const lives = D === 'EASY' ? 3 : D === 'HARD' ? 1 : 2; y = step(ink, '4', L(`Можно ошибиться ${lives} ${lives === 1 ? 'раз' : 'раза'}. Следующая ошибка — взрыв.`, `You may err ${lives} time${lives === 1 ? '' : 's'}. The next mistake is the blast.`), y);
  // three bays, placed differently every time: the roman numeral on the bay's plate is the page
  y += 30; ink.print(L('Номер на табличке отсека → страница:', 'The numeral on the bay plate → page:'), 100, y, 36, {bold: true}); y += 80;
  [['I', 2], ['II', 3], ['III', 4], ['IV', 5], ['V', 6]].forEach(([n, pg], i) => { const cx = 150 + (i % 3) * 270, cy = y + Math.floor(i / 3) * 110; x.strokeStyle = '#2a1c10'; x.lineWidth = 3; x.strokeRect(cx - 60, cy - 60, 120, 80); ink.print(String(n), cx, cy, 52, {bold: true, align: 'center'}); ink.print(`→ ${L('стр.', 'p.')} ${pg}`, cx + 76, cy - 4, 34); });
};
const wires: Draw = (x, ink) => {
  head(ink, 'I', L('Провода', 'Wires'));
  let y = 290; y = step(ink, '1', L('Печать в центре → буква по таблице.', 'Seal in the centre → letter from the table.'), y);
  y = step(ink, '2', L('Режь провод, который ВЫХОДИТ из этой буквы.', 'Cut the wire LEAVING that letter.'), y);
  if (D !== 'EASY') { y = step(ink, '3', L('Он пришёл в 3, 6, 9 или 12? Тогда режь другой — тот, что приходит в номер +1.', 'Does it end on 3, 6, 9 or 12? Then cut the other one — the wire into number +1.'), y); } y += 20;
  SEALS.forEach((sl, i) => { const cx = 170 + (i % 4) * 200, cy = y + 70 + Math.floor(i / 4) * 170; x.fillStyle = '#2a1c10'; drawSeal(x, sl, cx, cy, 46); ink.print(SEAL_LETTER[sl], cx, cy + 110, 56, {bold: true, align: 'center'}); });
  ink.hand(L('Кусачки — в углу отсека.', 'The cutters lie in the bay corner.'), 110, y + 470, 40, '#2a3a6a', -.02);
};
const contacts: Draw = (x, ink) => {
  head(ink, 'II', L('Контакты', 'Contacts'));
  let y = 290; y = step(ink, '1', L('Щуп на букву, щуп на цифру → смотри экран.', 'A probe on a letter, one on a number → read the screen.'), y);
  for (const [r, t] of [['0.62▶', L('ДИОД (ток от красного к чёрному)', 'DIODE (red → black)')], ['OL', L('нет связи / диод наоборот', 'no link / diode reversed')], ['0.00 · 4.7k', L('не важно', 'ignore')]]) { x.fillStyle = '#1d2a1a'; x.fillRect(100, y - 40, 230, 56); ink.print(r, 215, y, 34, {align: 'center', color: '#9be08a', font: '"IBM Plex Mono", monospace', bold: true}); ink.print(t, 360, y, 32); y += 76; }
  y += 20; tag(x, ink, D === 'EASY' ? L('Нужен единственный диод', 'You want the only diode') : D === 'NORMAL' ? L('Нужен диод: ток от ЦИФРЫ к БУКВЕ', 'The diode from NUMBER to LETTER') : L('Диод цифра → буква с БОЛЬШЕЙ цифрой', 'Number → letter diode, LARGER number'), y, true); y += 110;
  step(ink, '2', L('Оба щупа на эту пару → красная кнопка.', 'Both probes on that pair → the red button.'), y);
};
const xray: Draw = (x, ink) => {
  head(ink, 'III', L('Рентген', 'X-ray'));
  let y = 290; y = step(ink, '1', L('Буква на отсеке → её рисунок ниже.', 'Letter on the bay → its picture below.'), y);
  y = step(ink, '2', L('Веди сканер, найди такую банку → её рычаг.', 'Sweep the scanner, find that canister → its lever.'), y);
  Object.entries(XRAY_TABLE).forEach(([k, ins], i) => { const col = i % 2, row = Math.floor(i / 2), cx = 330 + col * 400, cy = y + 110 + row * 220; ink.print(k, cx - 200, cy + 18, 64, {bold: true, color: '#7a1408'}); sketch(x, ins, cx + 20, cy, 300); });
};
const laser: Draw = (x, ink) => {
  head(ink, 'IV', L('Лазер', 'Laser'));
  let y = 290; y = step(ink, '1', L('Посчитай красные заслонки (З) и зеркала (Зр).', 'Count red baffles (B) and mirrors (M).'), y);
  tag(x, ink, L('Номер датчика = ', 'Sensor number = ') + (D === 'EASY' ? L('числу заслонок', 'the number of baffles') : D === 'NORMAL' ? L('остаток (З + Зр) ÷ датчиков, +1', 'remainder (B + M) ÷ sensors, +1') : L('остаток (2·З + Зр) ÷ датчиков, +1', 'remainder (2·B + M) ÷ sensors, +1')), y + 20, true); y += 100;
  y += 30; step(ink, '2', L('Касание зеркала поворачивает его. Луч на датчик → латунная кнопка.', 'Tap a mirror to turn it. Beam on the sensor → the brass button.'), y);
  ink.hand(D === 'EASY' ? L('Пример: 2 заслонки → датчик 2', 'e.g. 2 baffles → sensor 2') : D === 'NORMAL' ? L('Пример: 3 З + 4 Зр, 5 датчиков → 7÷5 ост. 2 → датчик 3', 'e.g. 3 B + 4 M, 5 sensors → 7÷5 rem 2 → sensor 3') : L('Пример: 4 З, 5 Зр, 6 датчиков → 13÷6 ост. 1 → датчик 2', 'e.g. 4 B, 5 M, 6 sensors → 13÷6 rem 1 → sensor 2'), 100, PH - 160, 36, '#2a3a6a', -.02);
};
const heat: Draw = (x, ink) => {
  head(ink, 'V', L('Тепло', 'Heat'));
  let y = 280; y = step(ink, '1', L('Печать на отсеке → строка: рисунок + °C.', 'Seal on the bay → row: pattern + °C.'), y);
  SEALS.forEach((sl, i) => { const sg = THERMAL_TABLE[sl], cy = y + 30 + i * 84; x.fillStyle = '#2a1c10'; drawSeal(x, sl, 140, cy, 30); heatIcon(x, sg.pattern, 300, cy); ink.print(PAT_NAME[sg.pattern](), 380, cy + 10, 28); ink.print(`${sg.lo}–${sg.hi}°`, PW - 100, cy + 12, 36, {bold: true, align: 'right'}); });
  y += 30 + 8 * 84; if (D !== 'EASY') tag(x, ink, L('Подойдут две — бери с углами (не ●, не ☾)', 'Two will fit — take the angular one (not ●, ☾)'), y, true); else tag(x, ink, L('Подойдёт ровно одна', 'Exactly one will fit'), y);
  ink.hand(L('Самая горячая — почти никогда не она. Поверни её вентиль.', 'The hottest is almost never it. Turn its valve.'), 100, y + 90, 36, '#2a3a6a', -.02);
};
/** the notebook's six pages (memo + I–V), each drawing its own paper in 1000×1400 page space */
export function memoPages(d: MemoDiff = 'NORMAL'): ((x: CanvasRenderingContext2D) => void)[] {
  const pin = d; // the pages render lazily (when turned to), so each one re-pins its own difficulty
  return [memo, wires, contacts, xray, laser, heat].map((dr, i) => (x: CanvasRenderingContext2D) => { D = pin; paper(x, 300 + i); dr(x, inkFor(x, 700 + i)); x.font = '30px "IM Fell English", serif'; x.fillStyle = 'rgba(36,26,16,.75)'; x.textAlign = 'center'; x.fillText(`— ${i + 1} —`, PW / 2, PH - 50); });
}
