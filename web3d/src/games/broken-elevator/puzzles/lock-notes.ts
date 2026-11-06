// АДСКАЯ КЛЕТКА — THE LOCKSMITH'S NOTES: three aged sheets nailed to the cage wall beside the door.
// They teach HOW to pick the cage lock (the anatomy, the pick technique, what to do when it goes wrong);
// WHICH pin to lift first stays in the handbook (section V), so both have to be read.
//   I   — the anatomy: spring, driver, key pin, shear line, plug, thumb-wheel, pick (a labelled cutaway drawing)
//   II  — working the pick: slide it under a pin, lift to the click, let go
//   III — trouble: a copper pin sticks (ease the wheel), a black pin is a trap, a wrong pin drops them all
import * as T from 'three';
import {hiCanvas, ctx2d, textTex} from './sharp';
import {L} from '../i18n';

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

function sheet1() {
  const cv = hiCanvas(W, H), x = ctx2d(cv); paper(x, 11);
  header(x, 'I', L('Устройство замка', 'Inside the lock'), L('тюремный цилиндровый замок · вид в разрезе', 'prison pin-tumbler lock · in section'));
  const s = .78, sec = section(x, 120, 230, 440, s, [{len: 34}, {len: 52}, {len: 26}, {len: 44}, {len: 38}], {x: 0, up: 0});
  const px = (i: number) => sec.x0 + i * sec.pitch;
  callout(x, px(0), 230 + 70 * s, 70, 236, L('ПРУЖИНА', 'SPRING'), 'left');
  callout(x, px(4), sec.shearY - 40 * s, W - 40, 250, L('ВЕРХНИЙ ШТИФТ', 'DRIVER PIN'), 'right');
  callout(x, px(3), sec.shearY + 10 * s, W - 40, 470, L('НИЖНИЙ ШТИФТ', 'KEY PIN'), 'right');
  callout(x, sec.x0 + sec.pitch * 2.5, sec.shearY, W - 40, 520, L('ЛИНИЯ СРЕЗА', 'SHEAR LINE'), 'right');
  callout(x, px(1) + 30, sec.shearY + 70 * s, 300, 560, L('ЛИЧИНКА', 'PLUG'), 'left');
  callout(x, 150, sec.shearY + 60 * s, 70, 600, L('КОЛЕСО', 'WHEEL'), 'left');
  callout(x, px(0) - 10, sec.shearY + 52 * s, 180, 640, L('ОТМЫЧКА', 'PICK'), 'left');
  x.fillStyle = INK; x.font = body(21); x.textAlign = 'left';
  wrap(x, L('Пока хоть один верхний штифт пересекает линию среза, личинка не повернётся. Каждый штифт нужно поднять так, чтобы верхний встал НАД линией, а нижний упал обратно.', 'While any driver crosses the shear line the plug cannot turn. Lift each pin until its driver sits ABOVE the line and the key pin drops back.'), 60, 690, W - 120, 28);
  return cv;
}
function sheet2() {
  const cv = hiCanvas(W, H), x = ctx2d(cv); paper(x, 23);
  header(x, 'II', L('Работа отмычкой', 'Working the pick'), L('пальцем по замку · три движения', 'with your finger on the lock · three moves'));
  const s = .42, panel = (n: string, y: number, title: string, text: string, draw: () => void) => {
    x.fillStyle = 'rgba(60,40,20,.07)'; rr(x, 40, y, W - 80, 196, 12); x.fill(); x.strokeStyle = 'rgba(28,18,10,.35)'; x.lineWidth = 1.5; rr(x, 40, y, W - 80, 196, 12); x.stroke();
    x.fillStyle = RED; x.font = serif(54); x.textAlign = 'left'; x.fillText(n, 56, y + 62); draw();
    x.fillStyle = INK; x.font = tech(23); x.fillText(title, 300, y + 44); x.font = body(18); wrap(x, text, 300, y + 76, W - 350, 24); };
  panel('1', 200, L('ВЕДИТЕ ВБОК', 'SLIDE SIDEWAYS'), L('Проведите пальцем влево-вправо: отмычка едет по каналу. Под штифтом слышен тихий щелчок.', 'Drag left or right: the pick slides along the keyway. A soft tick when it is under a pin.'),
    () => { const sec = section(x, 104, 222, 160, s, [{len: 30}, {len: 46}, {len: 36}], {x: 1, up: 0}); arrow(x, sec.x0 - 20, sec.shearY + 50, sec.x0 + sec.pitch * 2.2, sec.shearY + 50, RED, 3); arrow(x, sec.x0 + sec.pitch * 2.2, sec.shearY + 50, sec.x0 - 20, sec.shearY + 50, RED, 3); });
  panel('2', 412, L('ТЯНИТЕ ВВЕРХ', 'DRAG UP'), L('Не отпуская, ведите палец вверх. Штифт поднимается до линии среза — ЩЕЛЧОК, он встал.', 'Keep holding and drag up. The pin rises to the shear line: CLICK, it is set.'),
    () => { const sec = section(x, 104, 434, 160, s, [{len: 30}, {len: 46, lift: 36}, {len: 36}], {x: 1, up: 36}); arrow(x, sec.x0 + sec.pitch + 30, sec.shearY + 30, sec.x0 + sec.pitch + 30, sec.shearY - 40, RED, 3); });
  panel('3', 624, L('ОТПУСТИТЕ', 'LET GO'), L('Отмычка опускается, нижний штифт падает, верхний остаётся НАД линией. Переходите к следующему.', 'The pick drops, the key pin falls, the driver stays ABOVE the line. Go on to the next.'),
    () => { section(x, 104, 646, 160, s, [{len: 30}, {len: 46, set: true}, {len: 36}], {x: 1, up: 0}); });
  note(x, L('порядок — в книге, раздел V!', 'order: see the book, section V!'), 300, 800, -.04);
  return cv;
}
function sheet3() {
  const cv = hiCanvas(W, H), x = ctx2d(cv); paper(x, 37);
  header(x, 'III', L('Если не поддаётся', 'When it fights back'), L('три беды и что с ними делать', 'three troubles and what to do'));
  const row = (y: number, title: string, text: string, fix: string, draw: () => void) => {
    draw(); x.textAlign = 'left'; x.fillStyle = INK; x.font = tech(25); x.fillText(title, 200, y + 30); x.font = body(18); const yy = wrap(x, text, 200, y + 62, W - 262, 24);
    x.fillStyle = '#1d5a2c'; x.font = tech(19); wrap(x, fix, 200, yy + 30, W - 262, 24); x.strokeStyle = 'rgba(28,18,10,.25)'; x.lineWidth = 1; x.beginPath(); x.moveTo(50, y + 196); x.lineTo(W - 50, y + 196); x.stroke(); };
  row(196, L('ЗАЕЛО · МЕДНЫЙ', 'STUCK · COPPER'), L('Медный штифт-катушка цепляется талией за линию среза и встаёт косо.', 'The copper spool catches its waist on the shear line and tilts.'), L('→ Коснитесь латунного колеса (ослабить), затем поднимите медный ещё раз.', '→ Tap the brass wheel to ease it, then lift the copper again.'),
    () => { stack(x, 110, 330, 40, 0, {driver: '#c0683a', spool: true, s: .9}); x.save(); x.setLineDash([8, 5]); x.strokeStyle = RED; x.lineWidth = 2; x.beginPath(); x.moveTo(60, 330); x.lineTo(160, 330); x.stroke(); x.restore(); });
  row(402, L('ЛОВУШКА · ЧЁРНЫЙ', 'TRAP · BLACK'), L('Чёрный штифт сбрасывает весь замок.', 'The black pin resets the whole lock.'), L('→ Никогда не поднимайте. Его нет в порядке — пропускайте.', '→ Never lift it. It is not in the order: skip it.'),
    () => { stack(x, 110, 536, 40, 0, {driver: '#1c1816', s: .9}); x.strokeStyle = RED; x.lineWidth = 8; x.lineCap = 'round'; x.beginPath(); x.moveTo(70, 400); x.lineTo(150, 560); x.moveTo(150, 400); x.lineTo(70, 560); x.stroke(); });
  row(608, L('ВСЁ УПАЛО', 'ALL DROPPED'), L('Не тот штифт — все верхние падают, гаснет жетон попытки.', 'A wrong pin drops every driver and a try token goes dark.'), L('→ Колесо без причины тоже сбрасывает штифты, но попытку не тратит.', '→ The wheel for no reason drops them too, but costs no try.'),
    () => { x.fillStyle = '#d0a858'; for (let k = 0; k < 3; k++) { x.fillStyle = k < 2 ? '#c9a24c' : '#2a2420'; x.beginPath(); x.arc(80 + k * 36, 700, 14, 0, 7); x.fill(); x.strokeStyle = INK; x.lineWidth = 2; x.stroke(); } });
  note(x, L('тише… и только по книге', 'easy… and only by the book'), 330, 800, -.05, INK2);
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
  group = new T.Group(); private sheets: T.Mesh[] = [];
  constructor(_hi: boolean) {
    const nailM = new T.MeshStandardMaterial({color: '#3a332c', metalness: .9, roughness: .5}), sw = .21, sh = sw * H / W;
    [sheet1, sheet2, sheet3].forEach((draw, i) => {
      const tex = textTex(draw()); const m = new T.Mesh(sheetGeo(sw, sh, i * 13 + 5), new T.MeshStandardMaterial({map: tex, roughness: .92, metalness: 0, side: T.DoubleSide}));
      m.position.set((i - 1) * (sw + .02), (i === 1 ? .012 : -.004), 0); m.rotation.z = [.025, -.012, .03][i]; m.userData.id = 'notes'; this.group.add(m); this.sheets.push(m);
      const nail = new T.Mesh(new T.CylinderGeometry(.0045, .0045, .006, 14), nailM); nail.rotation.x = Math.PI / 2; nail.position.set(m.position.x + (i - 1) * .002, m.position.y + sh / 2 - .016, .006); this.group.add(nail);
      m.castShadow = false; m.receiveShadow = true; });
  }
  /** the right-hand wall beside the door, facing into the cage */
  place(ci: T.Box3 | undefined, floorY: number) { const maxX = ci?.max.x ?? 1.22; this.group.position.set(maxX - .014, floorY + 1.8, .79); this.group.rotation.y = -Math.PI / 2; }
  center() { return new T.Vector3().setFromMatrixPosition(this.group.matrixWorld); }
  hits(ray: T.Raycaster) { return ray.intersectObjects(this.sheets, false)[0] || null; }
}
