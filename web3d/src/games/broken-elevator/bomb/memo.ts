// THE HOST'S SUITCASE — the defusal notebook's pages, kept short: one memo page and one page per mechanism.
// A few words in big type plus a table or a picture; nobody reads paragraphs with a fuse ticking.
import {L} from '../i18n';
import {PW, PH, paper, inkFor, type Ink} from './notebook';
import {drawSeal, SEALS, SEAL_LETTER} from './wire-maze';
import {XRAY_TABLE, sketch} from './xray';
import {THERMAL_TABLE, PAT_NAME, heatIcon} from './thermal';

type Draw = (x: CanvasRenderingContext2D, ink: Ink) => void;
const head = (ink: Ink, n: string, t: string) => { ink.print(n, 90, 150, 70, {bold: true, color: '#7a1408', font: '"IM Fell English SC", Georgia, serif'}); ink.print(t, 200, 150, 58, {bold: true, font: '"IM Fell English SC", Georgia, serif'}); ink.rule(190); };
/** a numbered line in big type (wraps) */
const step = (ink: Ink, n: string, t: string, y: number) => { ink.print(n, 90, y, 44, {bold: true, color: '#7a1408'}); return ink.para(t, 150, y, PW - 230, 38, 1.3) + 14; };
const tag = (x: CanvasRenderingContext2D, ink: Ink, t: string, y: number, red = false) => { x.fillStyle = red ? 'rgba(168,38,26,.12)' : 'rgba(40,26,14,.07)'; x.fillRect(80, y - 44, PW - 160, 62); ink.print(t, 100, y, 34, {bold: true, color: red ? '#7a1408' : '#241a10'}); };

const memo: Draw = (x, ink) => {
  ink.print(L('ПАМЯТКА', 'MEMO'), PW / 2, 160, 76, {bold: true, align: 'center', font: '"IM Fell English SC", Georgia, serif'}); ink.rule(200);
  let y = 300; y = step(ink, '1', L('Открой 2 защёлки, потом крышку.', 'Flip both latches, then the lid.'), y);
  y = step(ink, '2', L('Красная лампа = заряжен. Их ТРИ.', 'Red lamp = armed. There are THREE.'), y);
  y = step(ink, '3', L('Коснись отсека → его страница здесь.', 'Tap a bay → its page in here.'), y);
  y = step(ink, '4', L('Ошибка = удар. Лёгкий 3 · средний 2 · сложный 1.', 'Mistake = strike. Easy 3 · normal 2 · hard 1.'), y);
  // tray map with page numbers
  const ox = 170, oy = y + 40, w = 660, h = 360; x.strokeStyle = '#2a1c10'; x.lineWidth = 3; x.strokeRect(ox, oy, w, h);
  const bay = (bx: number, by: number, bw: number, bh: number, n: string) => { x.strokeRect(ox + bx * w, oy + by * h, bw * w, bh * h); ink.print(n, ox + (bx + bw / 2) * w, oy + (by + bh / 2) * h + 22, 64, {bold: true, align: 'center'}); };
  bay(.03, .05, .31, .44, 'I'); bay(.37, .05, .26, .44, 'II'); bay(.66, .05, .31, .44, 'III'); bay(.03, .55, .52, .4, 'IV'); bay(.6, .55, .37, .4, 'V');
  ink.hand(L('стр. 2 · 3 · 4 · 5 · 6', 'p. 2 · 3 · 4 · 5 · 6'), ox + 160, oy + h + 70, 46, '#2a3a6a', -.02);
};
const wires: Draw = (x, ink) => {
  head(ink, 'I', L('Провода', 'Wires'));
  let y = 290; y = step(ink, '1', L('Печать в центре → буква по таблице.', 'Seal in the centre → letter from the table.'), y);
  y = step(ink, '2', L('Режь провод, который ВЫХОДИТ из этой буквы.', 'Cut the wire LEAVING that letter.'), y);
  tag(x, ink, L('Ср./слож.: конец 3·6·9·12 → провод в номер +1', 'Normal/hard: ends 3·6·9·12 → the wire into +1'), y + 30, true); y += 110;
  SEALS.forEach((sl, i) => { const cx = 170 + (i % 4) * 200, cy = y + 70 + Math.floor(i / 4) * 170; x.fillStyle = '#2a1c10'; drawSeal(x, sl, cx, cy, 46); ink.print(SEAL_LETTER[sl], cx, cy + 110, 56, {bold: true, align: 'center'}); });
  ink.hand(L('Кусачки — в углу отсека. Режь посередине провода.', 'Cutters lie in the bay corner. Cut mid-wire.'), 110, y + 470, 40, '#2a3a6a', -.02);
};
const contacts: Draw = (x, ink) => {
  head(ink, 'II', L('Контакты', 'Contacts'));
  let y = 290; y = step(ink, '1', L('Щуп на букву, щуп на цифру → смотри экран.', 'A probe on a letter, one on a number → read the screen.'), y);
  for (const [r, t] of [['0.62▶', L('ДИОД (ток от красного к чёрному)', 'DIODE (red → black)')], ['OL', L('нет связи / диод наоборот', 'no link / diode reversed')], ['0.00 · 4.7k', L('не важно', 'ignore')]]) { x.fillStyle = '#1d2a1a'; x.fillRect(100, y - 40, 230, 56); ink.print(r, 215, y, 34, {align: 'center', color: '#9be08a', font: '"IBM Plex Mono", monospace', bold: true}); ink.print(t, 360, y, 32); y += 76; }
  y += 20; tag(x, ink, L('Лёгкий: единственный диод', 'Easy: the only diode'), y); y += 80;
  tag(x, ink, L('Средний: диод цифра → буква', 'Normal: the number → letter diode'), y); y += 80;
  tag(x, ink, L('Сложный: из них — с БОЛЬШЕЙ цифрой', 'Hard: of those, the LARGER number'), y); y += 100;
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
  for (const [d, f] of [[L('Лёгкий', 'Easy'), L('датчик = З', 'sensor = B')], [L('Средний', 'Normal'), L('остаток (З + Зр) ÷ датчиков, +1', 'remainder (B + M) ÷ sensors, +1')], [L('Сложный', 'Hard'), L('остаток (2·З + Зр) ÷ датчиков, +1', 'remainder (2·B + M) ÷ sensors, +1')]]) { tag(x, ink, `${d}:  ${f}`, y + 20); y += 84; }
  y += 30; step(ink, '2', L('Касание зеркала поворачивает его. Луч на датчик → латунная кнопка.', 'Tap a mirror to turn it. Beam on the sensor → the brass button.'), y);
  ink.hand(L('Пример: 3 З + 4 Зр, 5 датчиков → 7÷5 ост. 2 → датчик 3', 'e.g. 3 B + 4 M, 5 sensors → 7÷5 rem 2 → sensor 3'), 100, PH - 160, 36, '#2a3a6a', -.02);
};
const heat: Draw = (x, ink) => {
  head(ink, 'V', L('Тепло', 'Heat'));
  let y = 280; y = step(ink, '1', L('Печать на отсеке → строка: рисунок + °C.', 'Seal on the bay → row: pattern + °C.'), y);
  SEALS.forEach((sl, i) => { const sg = THERMAL_TABLE[sl], cy = y + 30 + i * 84; x.fillStyle = '#2a1c10'; drawSeal(x, sl, 140, cy, 30); heatIcon(x, sg.pattern, 300, cy); ink.print(PAT_NAME[sg.pattern](), 380, cy + 10, 28); ink.print(`${sg.lo}–${sg.hi}°`, PW - 100, cy + 12, 36, {bold: true, align: 'right'}); });
  y += 30 + 8 * 84; tag(x, ink, L('Ср./слож.: две подходят → с углами (не ●, ☾)', 'Normal/hard: two fit → the angular one (not ●, ☾)'), y, true);
  ink.hand(L('Самая горячая — почти никогда не она. Поверни её вентиль.', 'The hottest is almost never it. Turn its valve.'), 100, y + 90, 36, '#2a3a6a', -.02);
};
/** the notebook's six pages (memo + I–V), each drawing its own paper in 1000×1400 page space */
export function memoPages(): ((x: CanvasRenderingContext2D) => void)[] {
  return [memo, wires, contacts, xray, laser, heat].map((d, i) => (x: CanvasRenderingContext2D) => { paper(x, 300 + i); d(x, inkFor(x, 700 + i)); x.font = '30px "IM Fell English", serif'; x.fillStyle = 'rgba(36,26,16,.75)'; x.textAlign = 'center'; x.fillText(`— ${i + 1} —`, PW / 2, PH - 50); });
}
