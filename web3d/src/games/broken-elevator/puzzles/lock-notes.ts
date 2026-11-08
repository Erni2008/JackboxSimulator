// АДСКАЯ КЛЕТКА — THE LOCKSMITH'S NOTES: three aged sheets nailed to the cage wall beside the door.
// They teach HOW to pick the cage lock (the anatomy, the pick technique, what to do when it goes wrong);
// WHICH pin to lift first stays in the handbook (section V), so both have to be read.
//   I   — how to pick it, step by step (tap the lock, read the plate, drag sideways, drag up, all in order)
//   II  — the pin ORDER for each system, written out in full: the three makers' rules, the number, the feel
//   III — trouble: a copper pin sticks (ease the wheel), a black pin is a trap, a wrong pin drops them all
import * as T from 'three';
import {hiCanvas, ctx2d, textTex} from './sharp';
import {L} from '../i18n';
import {makerEmblem} from './code-lock';

const W = 600, H = 820; // logical page size (px)
const INK = '#1c120a', INK2 = 'rgba(28,18,10,.72)', RED = '#8a1410', BRASS = '#a07a34', STEEL = '#8e8b85', PAPER = '#d9c7a0';
const rng = (seed: number) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const serif = (px: number, w = 700, it = false) => `${it ? 'italic ' : ''}${w} ${px}px 'Cormorant SC', Georgia, 'Times New Roman', serif`;
const body = (px: number, it = false) => `${it ? 'italic ' : ''}500 ${px}px 'Lora', Georgia, serif`;
const tech = (px: number) => `700 ${px}px 'Oswald', 'Arial Narrow', sans-serif`;
type X = CanvasRenderingContext2D;

/** aged, foxed paper with a torn top edge, fold creases and a nail hole */
function paper(x: X, seed: number) {
  const r = rng(seed);
  x.save(); x.beginPath(); x.moveTo(6, 22); for (let px = 6; px <= W - 6; px += 14) x.lineTo(px, 10 + r() * 14); x.lineTo(W - 6, H - 8); x.lineTo(8, H - 4); x.closePath(); x.clip();
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#e2d2ad'); g.addColorStop(.6, PAPER); g.addColorStop(1, '#c2a877'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) { const fx = r() * W, fy = r() * H, fr = 4 + r() * 34, f = x.createRadialGradient(fx, fy, 0, fx, fy, fr); f.addColorStop(0, `rgba(120,72,28,${.05 + r() * .14})`); f.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = f; x.fillRect(fx - fr, fy - fr, fr * 2, fr * 2); }
  const e = x.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 560); e.addColorStop(0, 'rgba(0,0,0,0)'); e.addColorStop(1, 'rgba(70,36,10,.6)'); x.fillStyle = e; x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(80,50,20,.18)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, H * .5); x.lineTo(W, H * .5 + 6); x.stroke(); x.strokeStyle = 'rgba(255,245,220,.25)'; x.beginPath(); x.moveTo(0, H * .5 + 3); x.lineTo(W, H * .5 + 9); x.stroke();
  // a soot thumbprint and a scorch at one corner: the sheets live in a cage over lava
  const sc = x.createRadialGradient(W - 30, H - 20, 0, W - 30, H - 20, 120); sc.addColorStop(0, 'rgba(40,18,6,.55)'); sc.addColorStop(1, 'rgba(40,18,6,0)'); x.fillStyle = sc; x.fillRect(W - 160, H - 150, 160, 150);
  x.restore();
}
function header(x: X, n: string, title: string, sub: string) {
  x.textBaseline = 'alphabetic'; x.textAlign = 'center'; x.fillStyle = INK2; x.font = tech(17); x.fillText(L('ЗАПИСКИ СЛЕСАРЯ · ЛИСТ ', "LOCKSMITH'S NOTES · SHEET ") + n, W / 2, 74);
  x.fillStyle = INK; x.font = serif(46); x.fillText(title, W / 2, 124);
  x.fillStyle = INK2; x.font = body(19, true); x.fillText(sub, W / 2, 154);
  x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(60, 172); x.lineTo(W - 60, 172); x.stroke(); x.lineWidth = 1; x.beginPath(); x.moveTo(60, 178); x.lineTo(W - 60, 178); x.stroke();
}
function rr(x: X, px: number, py: number, w: number, h: number, r: number) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
function wrap(x: X, t: string, px: number, py: number, maxW: number, lh: number) { const words = t.split(' '); let line = '', y = py; for (const w of words) { const s = line ? line + ' ' + w : w; if (x.measureText(s).width > maxW && line) { x.fillText(line, px, y); line = w; y += lh; } else line = s; } if (line) x.fillText(line, px, y); return y; }

/** one pin stack in section: spring, driver, key pin; `lift` raises key + driver (px), `set` leaves the driver above the shear */
function stack(x: X, cx: number, shearY: number, keyLen: number, lift: number, opts: {set?: boolean; driver?: string; spool?: boolean; s?: number} = {}) {
  const s = opts.s ?? 1, R = 13 * s, dh = 46 * s, top = shearY - 150 * s, keyTop = shearY - 14 * s + (opts.set ? 0 : -lift), nose = keyTop + keyLen;
  const drvBottom = opts.set ? shearY - 3 * s : keyTop;
  // spring
  x.strokeStyle = STEEL; x.lineWidth = 2.2 * s; x.beginPath(); const sp0 = drvBottom - dh, coils = 9; for (let k = 0; k <= coils * 2; k++) { const y = top + (sp0 - top) * k / (coils * 2); x.lineTo(cx + (k % 2 ? R * .8 : -R * .8), y); } x.stroke();
  // driver
  x.fillStyle = opts.driver ?? '#c9a24c'; x.strokeStyle = INK; x.lineWidth = 2 * s;
  if (opts.spool) { x.beginPath(); x.moveTo(cx - R, drvBottom - dh); x.lineTo(cx + R, drvBottom - dh); x.lineTo(cx + R, drvBottom - dh + 10 * s); x.lineTo(cx + R * .55, drvBottom - dh + 17 * s); x.lineTo(cx + R * .55, drvBottom - 17 * s); x.lineTo(cx + R, drvBottom - 10 * s); x.lineTo(cx + R, drvBottom); x.lineTo(cx - R, drvBottom); x.lineTo(cx - R, drvBottom - 10 * s); x.lineTo(cx - R * .55, drvBottom - 17 * s); x.lineTo(cx - R * .55, drvBottom - dh + 17 * s); x.lineTo(cx - R, drvBottom - dh + 10 * s); x.closePath(); }
  else rr(x, cx - R, drvBottom - dh, R * 2, dh, 3 * s); x.fill(); x.stroke();
  // key pin with a bullet nose
  const kr = R * .88; x.fillStyle = '#b9b6ae'; x.beginPath(); x.moveTo(cx - kr, keyTop); x.lineTo(cx + kr, keyTop); x.lineTo(cx + kr, nose - 9 * s); x.quadraticCurveTo(cx + kr, nose, cx, nose + 2 * s); x.quadraticCurveTo(cx - kr, nose, cx - kr, nose - 9 * s); x.closePath(); x.fill(); x.stroke();
  return {nose};
}
/** the lock in section, as on the cage door, with optional pins set/lifted */
function section(x: X, ox: number, oy: number, w: number, s: number, pins: {len: number; lift?: number; set?: boolean; driver?: string; spool?: boolean}[], pick?: {x: number; up: number}) {
  const h = 300 * s, shearY = oy + 190 * s;
  // housing and channels
  x.fillStyle = '#5a5650'; rr(x, ox, oy, w, h, 8 * s); x.fill(); x.strokeStyle = INK; x.lineWidth = 3 * s; x.stroke();
  const n = pins.length, pitch = (w - 120 * s) / n, x0 = ox + 90 * s + pitch / 2;
  for (let i = 0; i < n; i++) { x.fillStyle = '#26221f'; x.fillRect(x0 + i * pitch - 17 * s, oy + 26 * s, 34 * s, shearY - oy - 26 * s); }
  // plug
  x.fillStyle = '#b8914a'; x.fillRect(ox + 60 * s, shearY, w - 80 * s, 80 * s); x.strokeStyle = INK; x.lineWidth = 2 * s; x.strokeRect(ox + 60 * s, shearY, w - 80 * s, 80 * s);
  for (let i = 0; i < n; i++) { x.fillStyle = '#6e5525'; x.fillRect(x0 + i * pitch - 15 * s, shearY, 30 * s, 42 * s); }
  x.fillStyle = '#120c08'; x.fillRect(ox + 60 * s, shearY + 42 * s, w - 80 * s, 18 * s);
  // wheel
  x.fillStyle = '#c69a48'; rr(x, ox + 30 * s, shearY - 30 * s, 34 * s, 130 * s, 8 * s); x.fill(); x.stroke(); x.strokeStyle = 'rgba(40,26,10,.6)'; x.lineWidth = 1.2 * s; for (let k = 0; k < 14; k++) { const y = shearY - 26 * s + k * 9 * s; x.beginPath(); x.moveTo(ox + 32 * s, y); x.lineTo(ox + 62 * s, y); x.stroke(); }
  // pins
  pins.forEach((p, i) => stack(x, x0 + i * pitch, shearY, p.len * s, (p.lift ?? 0) * s, {set: p.set, driver: p.driver, spool: p.spool, s}));
  // shear line
  x.save(); x.setLineDash([10 * s, 6 * s]); x.strokeStyle = RED; x.lineWidth = 2.4 * s; x.beginPath(); x.moveTo(ox + 50 * s, shearY); x.lineTo(ox + w - 10 * s, shearY); x.stroke(); x.restore();
  // the pick
  if (pick) { const tipX = x0 + pick.x * pitch, by = shearY + 52 * s; x.strokeStyle = '#3a3836'; x.lineWidth = 4 * s; x.lineCap = 'round'; x.beginPath(); x.moveTo(ox - 40 * s, by); x.lineTo(tipX, by); x.lineTo(tipX + 2 * s, by - 10 * s - pick.up * s); x.stroke();
    x.fillStyle = '#4a2418'; rr(x, ox - 110 * s, by - 8 * s, 74 * s, 16 * s, 6 * s); x.fill(); }
  return {x0, pitch, shearY};
}
function arrow(x: X, x0: number, y0: number, x1: number, y1: number, col = RED, w = 4) {
  x.strokeStyle = x.fillStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke();
  const a = Math.atan2(y1 - y0, x1 - x0); x.beginPath(); x.moveTo(x1, y1); x.lineTo(x1 - Math.cos(a - .45) * 16, y1 - Math.sin(a - .45) * 16); x.lineTo(x1 - Math.cos(a + .45) * 16, y1 - Math.sin(a + .45) * 16); x.closePath(); x.fill();
}
function callout(x: X, tx: number, ty: number, lx: number, ly: number, text: string, align: CanvasTextAlign) {
  x.strokeStyle = INK; x.lineWidth = 1.4; x.beginPath(); x.moveTo(tx, ty); x.lineTo(lx, ly); x.stroke(); x.fillStyle = INK; x.beginPath(); x.arc(tx, ty, 3.2, 0, 7); x.fill();
  x.font = tech(19); x.textAlign = align; x.textBaseline = 'middle'; x.fillText(text, lx + (align === 'left' ? 6 : -6), ly); x.textBaseline = 'alphabetic';
}
/** a pencil-ish handwritten note in the margin */
function note(x: X, t: string, px: number, py: number, rot = -.03, col = RED) { x.save(); x.translate(px, py); x.rotate(rot); x.fillStyle = col; x.font = `italic 600 22px 'Caveat', 'Segoe Print', 'Bradley Hand', cursive`; x.textAlign = 'left'; x.fillText(t, 0, 0); x.restore(); }

/** a finger glyph with a motion arrow: 'tap', 'side', 'up' */
function finger(x: X, cx: number, cy: number, kind: 'tap' | 'side' | 'up') {
  x.save(); x.translate(cx, cy); x.fillStyle = '#e8cfa4'; x.strokeStyle = INK; x.lineWidth = 2;
  x.beginPath(); x.moveTo(-9, 26); x.lineTo(-9, -8); x.quadraticCurveTo(-9, -20, 0, -20); x.quadraticCurveTo(9, -20, 9, -8); x.lineTo(9, 6); x.lineTo(20, 4); x.quadraticCurveTo(28, 6, 26, 16); x.lineTo(20, 34); x.lineTo(-9, 34); x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(-5, -14); x.quadraticCurveTo(0, -17, 5, -14); x.stroke();
  if (kind === 'tap') { x.strokeStyle = RED; x.lineWidth = 2.5; for (const r of [12, 20]) { x.beginPath(); x.arc(0, -26, r, Math.PI * 1.15, Math.PI * 1.85); x.stroke(); } }
  x.restore();
  if (kind === 'side') { arrow(x, cx - 6, cy + 46, cx - 40, cy + 46, RED, 3); arrow(x, cx + 6, cy + 46, cx + 40, cy + 46, RED, 3); }
  if (kind === 'up') arrow(x, cx + 34, cy + 30, cx + 34, cy - 24, RED, 3);
}
function sheet1() {
  const cv = hiCanvas(W, H), x = ctx2d(cv); paper(x, 11);
  header(x, 'I', L('Как вскрыть замок', 'How to pick the lock'), L('по шагам · читать сверху вниз', 'step by step · top to bottom'));
  const steps: [string, string, (cx: number, cy: number) => void][] = [
    [L('НАЖМИТЕ НА ЗАМОК', 'TAP THE LOCK'), L('Замок висит на двери клетки. Нажмите — он приблизится.', 'It hangs on the cage door. Tap it to look closer.'), (cx, cy) => finger(x, cx, cy, 'tap')],
    [L('ПРОЧТИТЕ ТАБЛИЧКУ', 'READ THE PLATE'), L('Внизу замка написана СИСТЕМА. По листу II узнайте порядок штифтов.', 'The plate at the bottom names the SYSTEM. Sheet II gives the pin order.'), (cx, cy) => { x.fillStyle = '#b08a45'; rr(x, cx - 46, cy - 16, 92, 36, 4); x.fill(); x.strokeStyle = INK; x.lineWidth = 2; x.stroke(); x.fillStyle = INK; x.font = tech(12); x.textAlign = 'center'; x.fillText(L('СИСТЕМА «…»', 'SYSTEM «…»'), cx, cy + 1); x.font = tech(11); x.fillText('№ 3 1 5 2 4', cx, cy + 15); }],
    [L('ВЕДИТЕ ПАЛЕЦ ВБОК', 'DRAG SIDEWAYS'), L('Зажмите палец на замке и ведите влево-вправо — отмычка едет под штифтами.', 'Hold a finger on the lock and drag sideways: the pick slides under the pins.'), (cx, cy) => finger(x, cx, cy - 6, 'side')],
    [L('ПОД НУЖНЫМ — ВВЕРХ', 'UNDER THE RIGHT ONE: UP'), L('Плавно ведите вверх до ЩЕЛЧКА — и сразу отпустите. Дальше — перебор!', 'Drag up smoothly to the CLICK, then let go at once. Further is an overset!'), (cx, cy) => finger(x, cx - 6, cy, 'up')],
    [L('ВСЕ ПО ПОРЯДКУ', 'ALL IN ORDER'), L('Так каждый штифт по порядку. Встал последний — колесо повернётся, замок открыт.', 'Do every pin in order. The last one sets: the wheel turns, the lock opens.'), (cx, cy) => { x.strokeStyle = '#1d5a2c'; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx - 22, cy); x.lineTo(cx - 6, cy + 16); x.lineTo(cx + 24, cy - 18); x.stroke(); }],
  ];
  const top = 196, h = 118;
  steps.forEach(([title, text, pic], i) => { const y = top + i * h;
    x.fillStyle = i % 2 ? 'rgba(60,40,20,.05)' : 'rgba(60,40,20,0)'; rr(x, 34, y, W - 68, h - 8, 10); x.fill();
    x.fillStyle = RED; x.font = serif(50); x.textAlign = 'center'; x.fillText(String(i + 1), 66, y + 62);
    pic(150, y + 50);
    x.textAlign = 'left'; x.fillStyle = INK; x.font = tech(22); x.fillText(title, 224, y + 32); x.font = body(17); wrap(x, text, 224, y + 58, W - 262, 22); });
  note(x, L('держите палец — не отрывайте!', 'keep the finger down!'), 220, 806, -.03);
  return cv;
}
function sheet2() {
  const cv = hiCanvas(W, H), x = ctx2d(cv); paper(x, 23);
  header(x, 'II', L('Порядок штифтов', 'The pin order'), L('смотрите СИСТЕМУ на табличке замка', "read the SYSTEM on the lock's plate"));
  const block = (y: number, h: number, name: string, lines: string[], pic: (cx: number, cy: number) => void) => {
    x.fillStyle = 'rgba(60,40,20,.06)'; rr(x, 34, y, W - 68, h, 12); x.fill(); x.strokeStyle = 'rgba(28,18,10,.35)'; x.lineWidth = 1.5; rr(x, 34, y, W - 68, h, 12); x.stroke();
    x.fillStyle = '#2a1a0c'; rr(x, 48, y + 14, 196, 40, 6); x.fill(); x.fillStyle = '#f2dcae'; x.font = tech(22); x.textAlign = 'center'; x.fillText(L('СИСТЕМА', 'SYSTEM') + ' «' + name + '»', 146, y + 42);
    pic(150, y + 60 + (h - 60) / 2);
    x.textAlign = 'left'; x.fillStyle = INK; let yy = y + 36; for (const [k, t] of lines.entries()) { x.font = k === 0 ? tech(19) : body(16); x.fillStyle = k === 0 ? INK : INK2; yy = wrap(x, t, 262, yy, W - 300, 21) + (k === 0 ? 26 : 23); } };
  // STAMP: every maker's rule spelled out, beside his emblem (the plate shows the emblem; on hard locks the name is worn off)
  { const y = 192, h = 262; x.fillStyle = 'rgba(60,40,20,.06)'; rr(x, 34, y, W - 68, h, 12); x.fill(); x.strokeStyle = 'rgba(28,18,10,.35)'; x.lineWidth = 1.5; rr(x, 34, y, W - 68, h, 12); x.stroke();
    x.fillStyle = '#2a1a0c'; rr(x, 48, y + 12, 220, 38, 6); x.fill(); x.fillStyle = '#f2dcae'; x.font = tech(21); x.textAlign = 'center'; x.fillText(L('СИСТЕМА', 'SYSTEM') + ' «' + L('КЛЕЙМО', 'STAMP') + '»', 158, y + 39);
    x.textAlign = 'left'; x.fillStyle = INK2; x.font = body(15, true); x.fillText(L('эмблема на табличке = мастер', "the plate's emblem = the maker"), 282, y + 37);
    const rows: [number, string, string][] = [
      [0, L('ГРИФФИН И СЫН', 'GRIFFIN & SON'), L('Справа налево: 5 → 4 → 3 → 2 → 1', 'Right to left: 5 → 4 → 3 → 2 → 1')],
      [1, L('ХАРТВЕЛЛ', 'HARTWELL'), L('Медь → латунь → сталь; цвет один — слева направо', 'Copper → brass → steel; same colour: left to right')],
      [2, L('МОРТОН', 'MORTON'), L('Меньше насечек на штифте — раньше', 'Fewest notches on the pin first')]];
    rows.forEach(([m, name, rule], i) => { const ry = y + 64 + i * 64;
      x.strokeStyle = INK; x.lineWidth = 3; makerEmblem(x, m, 84, ry + 24, 20);
      x.fillStyle = INK; x.font = tech(19); x.fillText(name, 124, ry + 16); x.fillStyle = INK2; x.font = body(16); wrap(x, rule, 124, ry + 40, W - 170, 20);
      if (i < 2) { x.strokeStyle = 'rgba(28,18,10,.18)'; x.lineWidth = 1; x.beginPath(); x.moveTo(60, ry + 60); x.lineTo(W - 60, ry + 60); x.stroke(); } }); }
  block(466, 170, L('НОМЕР', 'NUMBER'), [L('Цифры номера — это порядок.', "The number's digits are the order."), L('1 — левый штифт. № 3 1 5 2 4 → 3-й, 1-й, 5-й, 2-й, 4-й.', '1 is the left pin. No. 3 1 5 2 4: 3rd, 1st, 5th, 2nd, 4th.'), L('Цифра стёрта — это штифт, которого нет в номере.', 'A digit worn off: the pin missing from the number.')],
    (cx, cy) => { for (let i = 0; i < 5; i++) { const px = cx - 48 + i * 24; x.fillStyle = '#26221f'; x.fillRect(px - 8, cy - 40, 16, 56); x.fillStyle = '#c9a24c'; x.fillRect(px - 6, cy - 6, 12, 20); x.fillStyle = INK; x.font = tech(15); x.textAlign = 'center'; x.fillText(String(i + 1), px, cy - 46); } x.fillStyle = RED; x.font = tech(15); x.fillText('3 → 1 → 5 → 2 → 4', cx, cy + 40); });
  block(648, 160, L('НАТЯГ', 'BINDING'), [L('Порядок не написан — его чувствуют.', 'Not written: you feel it.'), L('Поднимите штифт наполовину: ТУГОЙ дрожит — доводите до щелчка; СВОБОДНЫЙ пружинит — берите другой.', 'Lift a pin halfway: the BINDING one trembles, take it to the click; a LOOSE one springs, try another.')],
    (cx, cy) => { stack(x, cx - 28, cy + 30, 30, 18, {s: .5}); x.strokeStyle = '#1d5a2c'; x.lineWidth = 2; for (const d of [-1, 1]) for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(cx - 28 + d * (12 + k * 5), cy - 6 - k * 4); x.lineTo(cx - 28 + d * (12 + k * 5), cy + 6 + k * 4); x.stroke(); }
      stack(x, cx + 30, cy + 30, 30, 6, {s: .5}); arrow(x, cx + 50, cy - 20, cx + 50, cy + 10, RED, 2); x.font = tech(12); x.textAlign = 'center'; x.fillStyle = '#1d5a2c'; x.fillText(L('ТУГОЙ', 'BINDS'), cx - 28, cy + 58); x.fillStyle = RED; x.fillText(L('СВОБОДНЫЙ', 'LOOSE'), cx + 30, cy + 58); });
  return cv;
}
function sheet3() {
  const cv = hiCanvas(W, H), x = ctx2d(cv); paper(x, 37);
  header(x, 'III', L('Если не поддаётся', 'When it fights back'), L('три беды и что с ними делать', 'three troubles and what to do'));
  const row = (y: number, title: string, text: string, fix: string, draw: () => void) => {
    draw(); x.textAlign = 'left'; x.fillStyle = INK; x.font = tech(25); x.fillText(title, 200, y + 30); x.font = body(18); const yy = wrap(x, text, 200, y + 62, W - 262, 24);
    x.fillStyle = '#1d5a2c'; x.font = tech(19); wrap(x, fix, 200, yy + 30, W - 262, 24); x.strokeStyle = 'rgba(28,18,10,.25)'; x.lineWidth = 1; x.beginPath(); x.moveTo(50, y + 196); x.lineTo(W - 50, y + 196); x.stroke(); };
  row(196, L('ЗАЕЛО · МЕДНЫЙ', 'STUCK · COPPER'), L('Медный штифт в свою очередь цепляется за линию среза и встаёт косо.', 'In its turn the copper pin catches on the shear line and tilts.'), L('→ Коснитесь латунного колеса (ослабить), затем поднимите медный ещё раз.', '→ Tap the brass wheel to ease it, then lift the copper again.'),
    () => { stack(x, 110, 330, 40, 0, {driver: '#c0683a', spool: true, s: .9}); x.save(); x.setLineDash([8, 5]); x.strokeStyle = RED; x.lineWidth = 2; x.beginPath(); x.moveTo(60, 330); x.lineTo(160, 330); x.stroke(); x.restore(); });
  row(402, L('ЛОВУШКА · ЧЁРНЫЙ', 'TRAP · BLACK'), L('Бывает в сложных замках. Чёрный штифт сбрасывает весь замок.', 'Found in hard locks. The black pin resets the whole lock.'), L('→ Никогда не поднимайте. Его нет в порядке — пропускайте.', '→ Never lift it. It is not in the order: skip it.'),
    () => { stack(x, 110, 536, 40, 0, {driver: '#1c1816', s: .9}); x.strokeStyle = RED; x.lineWidth = 8; x.lineCap = 'round'; x.beginPath(); x.moveTo(70, 400); x.lineTo(150, 560); x.moveTo(150, 400); x.lineTo(70, 560); x.stroke(); });
  row(608, L('ПЕРЕБОР · ВСЁ УПАЛО', 'OVERSET · ALL DROPPED'), L('Протянули выше щелчка — штифт заклинит и загорится красным. Не тот штифт — падают все, гаснет жетон.', 'Pushed past the click: the pin jams and glows red. A wrong pin drops them all and a token goes dark.'), L('→ При переборе коснитесь колеса: штифты упадут, попытка цела.', '→ On an overset tap the wheel: the pins drop, no try lost.'),
    () => { x.fillStyle = '#d0a858'; for (let k = 0; k < 3; k++) { x.fillStyle = k < 2 ? '#c9a24c' : '#2a2420'; x.beginPath(); x.arc(80 + k * 36, 700, 14, 0, 7); x.fill(); x.strokeStyle = INK; x.lineWidth = 2; x.stroke(); } });
  note(x, L('тише… по порядку с листа II', 'easy… in the order from sheet II'), 300, 800, -.05, INK2);
  return cv;
}

/** a sheet as a slightly cupped, curled plane */
function sheetGeo(w: number, h: number, seed: number) {
  const g = new T.PlaneGeometry(w, h, 12, 16), p = g.attributes.position as T.BufferAttribute, r = rng(seed);
  const curl = .006 + r() * .006, lift = .01 + r() * .01;
  for (let i = 0; i < p.count; i++) { const u = p.getX(i) / w + .5, v = p.getY(i) / h + .5; p.setZ(i, curl * Math.sin(u * Math.PI) * .6 + lift * Math.pow(1 - v, 3) * (u < .5 ? 1 - u * 2 : (u - .5) * 2) * .6 + .002); }
  g.computeVertexNormals(); return g;
}

export class LockNotes {
  group = new T.Group(); private sheets: T.Mesh[] = []; private homes: {p: T.Vector3; q: T.Quaternion}[] = [];
  /** the sheet in the player's right hand (-1: none) and whether it is raised to read */
  held = -1; reading = false; private k = 0; private rk = 0; private scene: T.Object3D | null = null;
  private tmpP = new T.Vector3(); private tmpQ = new T.Quaternion(); private tmpS = new T.Vector3();
  constructor(_hi: boolean) {
    const nailM = new T.MeshStandardMaterial({color: '#3a332c', metalness: .9, roughness: .5}), sw = .21, sh = sw * H / W;
    [sheet1, sheet2, sheet3].forEach((draw, i) => {
      const tex = textTex(draw()); const m = new T.Mesh(sheetGeo(sw, sh, i * 13 + 5), new T.MeshStandardMaterial({map: tex, roughness: .92, metalness: 0, side: T.DoubleSide}));
      m.position.set((i - 1) * (sw + .02), (i === 1 ? .012 : -.004), 0); m.rotation.z = [.025, -.012, .03][i]; m.userData.id = 'notes'; m.userData.sheet = i; this.group.add(m); this.sheets.push(m);
      this.homes.push({p: m.position.clone(), q: m.quaternion.clone()});
      const nail = new T.Mesh(new T.CylinderGeometry(.0045, .0045, .006, 14), nailM); nail.rotation.x = Math.PI / 2; nail.position.set(m.position.x + (i - 1) * .002, m.position.y + sh / 2 - .016, .006); this.group.add(nail);
      m.castShadow = false; m.receiveShadow = true; });
  }
  /** the right-hand wall beside the door, facing into the cage */
  place(ci: T.Box3 | undefined, floorY: number) { const maxX = ci?.max.x ?? 1.22; this.group.position.set(maxX - .014, floorY + 1.8, .79); this.group.rotation.y = -Math.PI / 2; }
  center() { return new T.Vector3().setFromMatrixPosition(this.group.matrixWorld); }
  /** a sheet still on the wall */
  hits(ray: T.Raycaster) { return ray.intersectObjects(this.sheets.filter((_, i) => i !== this.held), false)[0] || null; }
  /** the sheet in hand */
  heldHit(ray: T.Raycaster) { return this.held >= 0 ? ray.intersectObject(this.sheets[this.held], false)[0] || null : null; }
  /** take sheet i off its nail into the right hand (a sheet already in hand goes back to the wall) */
  take(i: number, scene: T.Object3D) { if (this.held === i) return; if (this.held >= 0) this.putBack(); this.scene = scene; this.held = i; this.reading = false; this.k = 0; this.rk = 0;
    const m = this.sheets[i]; scene.attach(m); this.wallMat = m.material as T.Material;
    // in hand the sheet is evenly lit (no cage light washing it out) and drawn over everything
    m.material = new T.MeshBasicMaterial({map: (this.wallMat as T.MeshStandardMaterial).map, color: '#d6c8aa', side: T.DoubleSide, depthTest: false, depthWrite: false, transparent: true, toneMapped: false}); m.renderOrder = 999; /* last of all, after the lock's glass and pick */ }
  private wallMat: T.Material | null = null;
  putBack() { const i = this.held; if (i < 0) return; const m = this.sheets[i]; this.group.attach(m); (m.material as T.Material).dispose(); if (this.wallMat) m.material = this.wallMat; m.renderOrder = 0; this.held = -1; this.reading = false; this.returning.push(i); }
  private returning: number[] = [];
  toggleRead() { if (this.held >= 0) this.reading = !this.reading; }
  /** every frame: the held sheet rides in the right hand (or is raised in front to read); a returned one flies back to its nail */
  update(dt: number, camera: T.PerspectiveCamera) {
    const a = 1 - Math.exp(-dt * 9);
    for (const i of [...this.returning]) { const m = this.sheets[i], h = this.homes[i]; m.position.lerp(h.p, a); m.quaternion.slerp(h.q, a); m.scale.lerp(new T.Vector3(1, 1, 1), a);
      if (m.position.distanceTo(h.p) < .002) { m.position.copy(h.p); m.quaternion.copy(h.q); m.scale.set(1, 1, 1); this.returning.splice(this.returning.indexOf(i), 1); } }
    if (this.held < 0) return;
    this.k += (1 - this.k) * a; this.rk += ((this.reading ? 1 : 0) - this.rk) * a;
    // a pose in camera space that keeps its on-screen size whatever the zoom: depth follows tan(fov/2)
    const t = Math.tan(T.MathUtils.degToRad(camera.fov / 2)), d = .3, hh = d * t, hw = hh * camera.aspect, sheetH = .21 * H / W;
    const portrait = camera.aspect < .9;
    const handScale = (portrait ? .32 : .56) * 2 * hh / sheetH, readScale = .9 * 2 * hh / sheetH, sw = .21 * handScale, shh = sheetH * handScale;
    const hand = new T.Vector3(hw - sw / 2 - .14 * hh, -hh + shh / 2 + .16 * hh, -d), handRot = new T.Euler(.05, -.22, -.07);
    const read = new T.Vector3(0, 0, -d), readRot = new T.Euler(0, 0, 0);
    const lp = hand.clone().lerp(read, this.rk), lq = new T.Quaternion().setFromEuler(handRot).slerp(new T.Quaternion().setFromEuler(readRot), this.rk), ls = handScale + (readScale - handScale) * this.rk;
    camera.updateMatrixWorld(); const wp = lp.applyMatrix4(camera.matrixWorld), wq = camera.getWorldQuaternion(this.tmpQ).multiply(lq);
    const m = this.sheets[this.held]; m.position.lerp(wp, this.k > .98 ? 1 : a); m.quaternion.slerp(wq, this.k > .98 ? 1 : a); m.scale.lerp(this.tmpS.set(ls, ls, ls), this.k > .98 ? 1 : a);
    void this.scene; void this.tmpP;
  }
}
