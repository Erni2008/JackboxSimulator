// АДСКАЯ КЛЕТКА — THE CAGE LOCK (4th machine): pick it, without a key.
// A heavy Victorian prison lock hangs on the cage door with its cover off: five pin stacks in machined channels
// (spring, coloured driver with engraved notches, steel key pin), the brass plug under them with its thumb-wheel,
// a cam lever and a sliding bolt. A hook pick sits in the keyway; tapping a pin lifts it, tapping the wheel eases the torque.
// The handbook (section V, "Picking the lock") holds everything else:
//   1. the maker's stamp on the lock decides the ORDER the pins bind in
//        GRIFFIN & SON — right to left · HARTWELL — copper, then brass, then steel (left to right inside a colour)
//        MORTON — by the notches on the pin, fewest first
//   2. a BLACK pin is a trap: never lift it (it is not in the order)
//   3. a COPPER pin is a spool: lifted in its turn it STICKS; ease the wheel, then lift it again
//   4. a wrong pin drops every pin and burns a try; easing the wheel for nothing drops the pins (no try lost)
// When the last pin sets the plug turns and the shackle springs.
// EASY: 4 pins, no trap, 3 tries. NORMAL: 5 pins, one trap, 3 tries. HARD: 5 pins, one trap, 2 tries, worn stamp (emblem only).
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {metal, ironPlate, enableShadows} from './surface';
import {hiCanvas, ctx2d, textTex} from './sharp';
import {L} from '../i18n';

export type LockDiff = 'EASY' | 'NORMAL' | 'HARD';
export type PinColor = 'steel' | 'brass' | 'copper' | 'black';
export interface Pin { color: PinColor; notches: number; len: number }
export type LockMethod = 'maker' | 'serial' | 'bind';
/** the three lock SYSTEMS, named on the lock's plate; the notes on the wall explain each one */
export const METHODS: Record<LockMethod, [string, string]> = {maker: ['КЛЕЙМО', 'STAMP'], serial: ['НОМЕР', 'NUMBER'], bind: ['НАТЯГ', 'BINDING']};
/** three finishes of the lock body: blued steel, old iron, cast brass */
export const FINISHES = [{housing: '#40434a', frame: '#2d3036', back: '#1f2125'}, {housing: '#5b4a3b', frame: '#43362b', back: '#2a221b'}, {housing: '#8a6c3a', frame: '#5f4826', back: '#33270f'}];
export interface LockTask { finish: number; maker: number; method: LockMethod; pins: Pin[]; order: number[]; tries: number; worn: boolean; serial: string; wornDigit: number; diff: LockDiff }
export const MAKERS: [string, string][] = [['ГРИФФИН И СЫН', 'GRIFFIN & SON'], ['ХАРТВЕЛЛ', 'HARTWELL'], ['МОРТОН', 'MORTON']];
export const PIN_INK: Record<PinColor, string> = {steel: '#b9bec6', brass: '#d4a845', copper: '#c0683a', black: '#1c1816'};

const rng = (seed: number) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

/** the binding order the handbook prescribes for this maker (black pins are never in it) */
export function bindingOrder(maker: number, pins: Pin[]) {
  const idx = pins.map((_, i) => i).filter(i => pins[i].color !== 'black'), rank: Record<PinColor, number> = {copper: 0, brass: 1, steel: 2, black: 9};
  if (maker === 0) return idx.sort((a, b) => b - a);
  if (maker === 1) return idx.sort((a, b) => rank[pins[a].color] - rank[pins[b].color] || a - b);
  return idx.sort((a, b) => pins[a].notches - pins[b].notches);
}
/**
 * A new lock. The SYSTEM (method) decides where the pin order comes from:
 *   maker  — the maker's plate + the handbook, section V (each maker has his own rule)
 *   serial — the digits of the plate's number ARE the order (pin 1 is the left one)
 *   bind   — nothing written: probe each pin with a small lift; the binding pin trembles, the loose ones spring
 * Difficulty: EASY 4 plain pins, 3 tries · NORMAL 5 pins with a copper spool, 3 tries ·
 *             HARD 5 pins, spool + a black trap, 2 tries, the plate is worn (maker: no name; serial: one digit gone; bind: a fainter tremble)
 */
export function makeLockTask(seed: number, d: LockDiff, force?: string | null): LockTask {
  const r = rng(seed * 7919 + 17), n = d === 'EASY' ? 4 : 5, maker = Math.floor(r() * 3);
  const methods: LockMethod[] = ['maker', 'serial', 'bind'], method = (methods as string[]).includes(force || '') ? force as LockMethod : methods[Math.floor(r() * 3)];
  const colors: PinColor[] = Array.from({length: n}, () => r() < .5 ? 'steel' : 'brass');
  if (d !== 'EASY') colors[Math.floor(r() * n)] = 'copper';
  if (d === 'HARD') { const free = colors.map((c, i) => c === 'copper' ? -1 : i).filter(i => i >= 0); colors[free[Math.floor(r() * free.length)]] = 'black'; }
  const notch = Array.from({length: n}, (_, i) => i + 1); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [notch[i], notch[j]] = [notch[j], notch[i]]; }
  const pins = colors.map((color, i) => ({color, notches: notch[i], len: .0085 + Math.floor(r() * 6) * .002}));
  let order: number[];
  if (method === 'maker') order = bindingOrder(maker, pins);
  else { order = pins.map((_, i) => i).filter(i => pins[i].color !== 'black'); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } }
  const serial = method === 'serial' ? order.map(i => i + 1).join('') : String(1000 + Math.floor(r() * 8999));
  const wornDigit = method === 'serial' && d === 'HARD' ? Math.floor(r() * order.length) : -1;
  return {finish: Math.floor(r() * 3), maker, method, pins, order, tries: d === 'HARD' ? 2 : 3, worn: d === 'HARD', serial, wornDigit, diff: d};
}

/** the maker's emblem, shared by the lock's stamp and the handbook page */
export function makerEmblem(x: CanvasRenderingContext2D, maker: number, cx: number, cy: number, s: number) {
  x.save(); x.lineCap = x.lineJoin = 'round'; x.beginPath();
  if (maker === 0) { // GRIFFIN: a heater shield carrying a spread wing
    x.moveTo(cx - s * .8, cy - s * .85); x.lineTo(cx + s * .8, cy - s * .85); x.lineTo(cx + s * .8, cy - s * .1); x.quadraticCurveTo(cx + s * .75, cy + s * .7, cx, cy + s); x.quadraticCurveTo(cx - s * .75, cy + s * .7, cx - s * .8, cy - s * .1); x.closePath(); x.stroke();
    x.beginPath(); for (let k = 0; k < 4; k++) { const y = cy - s * .45 + k * s * .26; x.moveTo(cx - s * .45, cy + s * .35); x.quadraticCurveTo(cx - s * .1, y - s * .05, cx + s * (.5 - k * .1), y); } x.stroke();
  } else if (maker === 1) { // HARTWELL: an anvil under a crossing hammer
    x.moveTo(cx - s * .95, cy - s * .05); x.lineTo(cx + s * .55, cy - s * .05); x.quadraticCurveTo(cx + s, cy - s * .05, cx + s, cy - s * .3); x.lineTo(cx + s * .45, cy - s * .3); x.lineTo(cx - s * .95, cy - s * .3); x.closePath();
    x.moveTo(cx - s * .3, cy - s * .05); x.lineTo(cx - s * .2, cy + s * .45); x.lineTo(cx - s * .55, cy + s * .75); x.lineTo(cx + s * .55, cy + s * .75); x.lineTo(cx + s * .2, cy + s * .45); x.lineTo(cx + s * .3, cy - s * .05); x.stroke();
    x.beginPath(); x.moveTo(cx - s * .6, cy - s * .95); x.lineTo(cx + s * .2, cy - s * .45); x.stroke(); x.beginPath(); x.moveTo(cx - s * .85, cy - s * .62); x.lineTo(cx - s * .4, cy - s * 1.05); x.lineTo(cx - s * .25, cy - s * .88); x.lineTo(cx - s * .7, cy - s * .45); x.closePath(); x.stroke();
  } else { // MORTON: a crescent cradling a star, in a ring
    x.arc(cx, cy, s, 0, Math.PI * 2); x.stroke(); x.beginPath(); x.arc(cx - s * .08, cy + s * .05, s * .62, Math.PI * .25, Math.PI * 1.75, false); x.arc(cx + s * .2, cy + s * .05, s * .5, Math.PI * 1.65, Math.PI * .35, true); x.closePath(); x.stroke();
    x.beginPath(); for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 4 / 5, px = cx + s * .32 + Math.cos(a) * s * .26, py = cy - s * .02 + Math.sin(a) * s * .26; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke();
  }
  x.restore();
}

// ------------------------------------------------------------------ geometry (lock-local metres)
// An open-front Victorian prison lock: a dark steel housing with its cover off. Five machined channels hold the pin
// stacks (spring, brass driver, steel key pin); under them the brass plug turns in the housing, its round thumb-wheel
// on the left; on the right a cam lever draws the sliding bolt back against its spring.
const IN = {x0: -.135, x1: .135, y0: -.092, y1: .094};   // inside of the frame
const SHEAR = -.004, PC = -.03, PR = SHEAR - -.03;         // plug: centre and radius (its top is the shear line)
const PLUG_X0 = -.088, PLUG_X1 = .078;
const TOPB = .074;                                         // underside of the channel cap
const CH = -.009;                                          // depth (z) of the pin axes
const DRV_H = .025, PIN_R = .0082, KEY_TIP = PC + .0035;   // key pins rest with their nose on the keyway floor
const pitch = (n: number) => n === 4 ? .036 : .03;
const PX0 = -.012;                                         // centre of the pin row

let grimeTex: T.Texture | null = null;
/** oxidised, machined steel: brushing, tool marks, corrosion blooms and grime, tileable */
function grime() {
  if (grimeTex) return grimeTex; const W = 512, cv = hiCanvas(W, W), x = ctx2d(cv), r = rng(9); x.fillStyle = '#cfcfcf'; x.fillRect(0, 0, W, W);
  for (let i = 0; i < 700; i++) { const v = 175 + Math.floor(r() * 70); x.fillStyle = `rgba(${v},${v},${v},${.1 + r() * .18})`; x.fillRect(r() * W - 60, r() * W, 20 + r() * 120, .5 + r() * .7); }
  for (let i = 0; i < 2600; i++) { const v = 120 + Math.floor(r() * 120); x.fillStyle = `rgba(${v},${v},${v},${.15 + r() * .25})`; x.fillRect(r() * W, r() * W, 1 + r() * 2.5, 1 + r() * 2.5); } // pitting
  for (let i = 0; i < 70; i++) { const gx = r() * W, gy = r() * W, gr = 6 + r() * 40, g = x.createRadialGradient(gx, gy, 0, gx, gy, gr); g.addColorStop(0, `rgba(${r() < .5 ? '70,50,30' : '40,36,32'},${.15 + r() * .3})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); }
  x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = .7; for (let i = 0; i < 40; i++) { x.beginPath(); const sx = r() * W, sy = r() * W, a = r() * 7, l = 10 + r() * 50; x.moveTo(sx, sy); x.lineTo(sx + Math.cos(a) * l, sy + Math.sin(a) * l); x.stroke(); }
  grimeTex = textTex(cv); grimeTex.wrapS = grimeTex.wrapT = T.RepeatWrapping; grimeTex.colorSpace = T.SRGBColorSpace; return grimeTex;
}
const mat = (color: string, rough: number, rep = 1) => { const m = new T.MeshStandardMaterial({color, map: grime(), metalness: 1, roughness: rough, envMapIntensity: 1.3}); if (rep !== 1) { m.map = grime().clone(); m.map.repeat.set(rep, rep); m.map.needsUpdate = true; } return m; };


/** the cast faceplate: a Victorian border engraved into blued steel, scrollwork in the corners, rivets */
let plateTex: T.Texture | null = null;
function faceplate() {
  if (plateTex) return plateTex; const W = 1024, H = 832, cv = hiCanvas(W, H), x = ctx2d(cv), r = rng(77);
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#5d6068'); g.addColorStop(.5, '#3c3f46'); g.addColorStop(1, '#2a2c31'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.globalAlpha = .08; for (let i = 0; i < 900; i++) { x.fillStyle = r() < .5 ? '#fff' : '#000'; x.fillRect(0, r() * H, W, .6 + r()); } x.globalAlpha = 1;  // brushing
  for (let i = 0; i < 50; i++) { const gx = r() * W, gy = r() * H, gr = 10 + r() * 60, rg = x.createRadialGradient(gx, gy, 0, gx, gy, gr); rg.addColorStop(0, `rgba(90,60,30,${.08 + r() * .15})`); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = rg; x.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); }
  const engrave = (draw: () => void, w: number) => { x.save(); x.translate(1.5, 1.5); x.strokeStyle = 'rgba(255,240,210,.28)'; x.lineWidth = w; draw(); x.restore(); x.save(); x.strokeStyle = 'rgba(8,8,10,.85)'; x.lineWidth = w; draw(); x.restore(); };
  engrave(() => { x.strokeRect(22, 22, W - 44, H - 44); x.strokeRect(38, 38, W - 76, H - 76); }, 3);
  // scrollwork in each corner
  for (const [cx, cy, sx, sy] of [[60, 60, 1, 1], [W - 60, 60, -1, 1], [60, H - 60, 1, -1], [W - 60, H - 60, -1, -1]]) engrave(() => {
    x.beginPath(); for (let k = 0; k < 3; k++) { const rr = 18 + k * 16; x.moveTo(cx + sx * rr, cy); x.quadraticCurveTo(cx + sx * rr, cy + sy * rr, cx, cy + sy * rr); }
    x.moveTo(cx + sx * 70, cy + sy * 6); x.bezierCurveTo(cx + sx * 120, cy + sy * 2, cx + sx * 140, cy + sy * 30, cx + sx * 110, cy + sy * 40); x.moveTo(cx + sx * 6, cy + sy * 70); x.bezierCurveTo(cx + sx * 2, cy + sy * 120, cx + sx * 30, cy + sy * 140, cx + sx * 40, cy + sy * 110); x.stroke(); }, 2.2);
  // a running vine along the long edges
  engrave(() => { x.beginPath(); for (let u = 160; u < W - 160; u += 40) { x.moveTo(u, 30); x.quadraticCurveTo(u + 10, 22, u + 20, 30); x.quadraticCurveTo(u + 30, 38, u + 40, 30); x.moveTo(u, H - 30); x.quadraticCurveTo(u + 10, H - 22, u + 20, H - 30); x.quadraticCurveTo(u + 30, H - 38, u + 40, H - 30); } x.stroke(); }, 1.6);
  plateTex = textTex(cv); plateTex.colorSpace = T.SRGBColorSpace; return plateTex;
}
/** soft darkness creeping in from the walls of the open cavity (depth without real AO) */
let cavityTex: T.Texture | null = null;
function cavity() {
  if (cavityTex) return cavityTex; const W = 256, H = 200, cv = hiCanvas(W, H), x = ctx2d(cv); x.clearRect(0, 0, W, H);
  const edge = (x0: number, y0: number, x1: number, y1: number) => { const g = x.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, 'rgba(0,0,0,.85)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); };
  edge(0, 0, 0, 36); edge(0, H, 0, H - 30); edge(0, 0, 30, 0); edge(W, 0, W - 30, 0);
  cavityTex = textTex(cv); return cavityTex;
}

/** perlage: overlapping swirled circles ground into the back plate, the way fine watch movements are finished */
let perlageTex: T.Texture | null = null;
function perlage() {
  if (perlageTex) return perlageTex; const W = 512, cv = hiCanvas(W, W), x = ctx2d(cv); x.fillStyle = '#6a6c70'; x.fillRect(0, 0, W, W); const R = 22;
  for (let row = 0; row < W / (R * .8) + 2; row++) for (let col = 0; col < W / (R * .9) + 2; col++) {
    const cx = col * R * .9 + (row % 2) * R * .45, cy = row * R * .8, g = x.createRadialGradient(cx - R * .3, cy - R * .3, 1, cx, cy, R);
    g.addColorStop(0, '#9a9da2'); g.addColorStop(.55, '#6e7176'); g.addColorStop(1, '#4b4d52'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.08)'; x.lineWidth = .6; for (let k = 4; k < R; k += 3) { x.beginPath(); x.arc(cx, cy, k, 0, 7); x.stroke(); } }
  perlageTex = textTex(cv); perlageTex.wrapS = perlageTex.wrapT = T.RepeatWrapping; perlageTex.colorSpace = T.SRGBColorSpace; return perlageTex;
}
/** a spur gear facing +z */
function gear(r: number, teeth: number, depth: number, m: T.Material, hub: T.Material) {
  const sh = new T.Shape(), ri = r * .86, n = teeth * 4;
  for (let k = 0; k <= n; k++) { const a = k / n * Math.PI * 2, q = k % 4, rr = q === 1 || q === 2 ? r : ri; k ? sh.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : sh.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  for (let w = 0; w < 4; w++) { const a0 = w / 4 * Math.PI * 2 + .25, hole = new T.Path(); hole.absarc(Math.cos(a0 + .4) * r * .5, Math.sin(a0 + .4) * r * .5, r * .2, 0, Math.PI * 2, true); sh.holes.push(hole); }
  const g = new T.Group(), body = new T.Mesh(new T.ExtrudeGeometry(sh, {depth, bevelEnabled: true, bevelSize: depth * .25, bevelThickness: depth * .25, bevelSegments: 2, curveSegments: 6}), m); body.position.z = -depth / 2; g.add(body);
  const h = new T.Mesh(new T.CylinderGeometry(r * .2, r * .2, depth * 1.8, 24), hub); h.rotation.x = Math.PI / 2; g.add(h); return g;
}

/** reflections on the window: two soft diagonal streaks and a bright edge, drawn once */
let glassTex: T.Texture | null = null;
function glassStreaks() {
  if (glassTex) return glassTex; const W = 512, H = 400, cv = hiCanvas(W, H), x = ctx2d(cv); x.clearRect(0, 0, W, H);
  const streak = (x0: number, w: number, a: number) => { const g = x.createLinearGradient(x0, 0, x0 + w, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, `rgba(255,255,255,${a})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.save(); x.translate(W / 2, H / 2); x.rotate(-.5); x.translate(-W / 2, -H / 2); x.fillStyle = g; x.fillRect(x0, -H, w, H * 3); x.restore(); };
  streak(60, 70, .22); streak(150, 22, .3); streak(380, 40, .12);
  const e = x.createLinearGradient(0, 0, 0, 14); e.addColorStop(0, 'rgba(255,255,255,.35)'); e.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = e; x.fillRect(0, 0, W, 14);
  glassTex = textTex(cv); return glassTex;
}
/** the maker's plate riveted to the frame: emblem, name (gone on HARD), serial */
function stampTexture(t: LockTask | null) {
  const W = 512, H = 116, cv = hiCanvas(W, H), x = ctx2d(cv), r = rng(42);
  const base = x.createLinearGradient(0, 0, 0, H); base.addColorStop(0, '#a7843f'); base.addColorStop(1, '#6b4f22'); x.fillStyle = base; x.fillRect(0, 0, W, H);
  x.globalAlpha = .1; for (let i = 0; i < 300; i++) { x.fillStyle = r() < .5 ? '#fff4d0' : '#1a1006'; x.fillRect(0, r() * H, W, .7); } x.globalAlpha = 1;
  for (let i = 0; i < 30; i++) { const gx = r() * W, gy = r() * H, gr = 8 + r() * 30, g = x.createRadialGradient(gx, gy, 0, gx, gy, gr); g.addColorStop(0, `rgba(30,40,20,${.1 + r() * .2})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); }
  const cut = (draw: () => void, w: number) => { x.save(); x.translate(0, 1.4); x.strokeStyle = x.fillStyle = 'rgba(255,232,180,.5)'; x.lineWidth = w; draw(); x.restore(); x.save(); x.strokeStyle = x.fillStyle = '#1e1307'; x.lineWidth = w; draw(); x.restore(); };
  cut(() => x.strokeRect(8, 8, W - 16, H - 16), 3);
  for (const rx of [26, W - 26]) { const g = x.createRadialGradient(rx - 3, H / 2 - 3, 1, rx, H / 2, 12); g.addColorStop(0, '#e8c77a'); g.addColorStop(1, '#4a3414'); x.fillStyle = g; x.beginPath(); x.arc(rx, H / 2, 11, 0, 7); x.fill(); }
  if (t) { cut(() => makerEmblem(x, t.maker, 84, H / 2, 32), 4.5);
    x.textBaseline = 'middle'; x.textAlign = 'left';
    const nameWorn = t.worn && t.method === 'maker';
    if (!nameWorn) { x.font = `700 28px Georgia, 'Times New Roman', serif`; cut(() => x.fillText(L(MAKERS[t.maker][0], MAKERS[t.maker][1]), 140, 28), 1); }
    x.font = `700 24px 'Oswald', 'Arial Narrow', sans-serif`; cut(() => x.fillText(L('СИСТЕМА «', 'SYSTEM «') + L(...METHODS[t.method]) + '»', 140, 60), 1);
    const digits = t.method === 'serial' ? t.serial.split('').map((c, i) => i === t.wornDigit ? '▒' : c).join(' ') : t.serial;
    x.font = `700 ${t.method === 'serial' ? 30 : 24}px 'IBM Plex Mono', Menlo, monospace`; cut(() => x.fillText(`№ ${digits}`, 140, 94), 1);
    if (nameWorn) { for (let i = 0; i < 60; i++) { x.strokeStyle = r() < .5 ? 'rgba(220,190,120,.5)' : 'rgba(30,20,10,.45)'; x.lineWidth = 1 + r() * 2.5; x.beginPath(); const a = r() * 7, l = 8 + r() * 40, px = 140 + r() * 300, py = 10 + r() * 30; x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); } } }
  return textTex(cv);
}

/** a helical spring of unit height along +y (scaled in y every frame) */
class Helix extends T.Curve<T.Vector3> { constructor(private r: number, private turns: number) { super(); }
  getPoint(t: number, o = new T.Vector3()) { const a = t * this.turns * Math.PI * 2; return o.set(Math.cos(a) * this.r, t, Math.sin(a) * this.r); } }
/** a slotted cheese-head screw facing +z */
function screw(m: T.Material, dark: T.Material, r: number) {
  const g = new T.Group(); const head = new T.Mesh(new T.CylinderGeometry(r, r * 1.05, r * .55, 28), m); head.rotation.x = Math.PI / 2; g.add(head);
  const dome = new T.Mesh(new T.SphereGeometry(r, 28, 10, 0, Math.PI * 2, 0, Math.PI * .22), m); dome.rotation.x = Math.PI / 2; dome.position.z = r * .05; dome.scale.z = .5; g.add(dome);
  const slot = new T.Mesh(new T.BoxGeometry(r * 1.9, r * .2, r * .3), dark); slot.position.z = r * .33; slot.rotation.z = .5 + Math.random() * 2; g.add(slot); return g;
}

export class CodeLock {
  /** the lock is small on the door; tapping it zooms the view in a little (the camera stays where the player stands) */
  static SCALE = .5;
  group = new T.Group(); clues = new T.Group(); enabled = false; task: LockTask | null = null;
  sounds: {click?: () => void; turn?: () => void; lever?: () => void; unlock?: () => void; jam?: () => void} = {};
  onResult: (ok: boolean, why: 'WRONG' | 'OK') => void = () => {}; onWrong: (left: number, why: 'ORDER' | 'TRAP' | 'STUCK') => void = () => {};
  onNote: (what: 'STUCK' | 'EASED' | 'DROPPED' | 'SET' | 'OVERSET' | 'OPEN') => void = () => {};
  overset = -1; private sparks!: T.Points; private sparkV = new Float32Array(48 * 3); private sparkLife = 0;
  set: boolean[] = []; stuck = -1; eased = false; private step = 0;
  private body = new T.Group(); private shackle = new T.Group(); private pins = new T.Group(); private pick = new T.Group(); private wheel = new T.Group();
  private lever = new T.Group(); private glass: T.Mesh | null = null; private wrench: T.Group | null = null; private gearA = new T.Group(); private gearB = new T.Group(); private hook!: T.Mesh; private hookTip!: T.Mesh; private bolt = new T.Group(); private boltSpring!: T.Mesh;
  private drivers: T.Group[] = []; private keys: T.Mesh[] = []; private springs: T.Mesh[] = []; private lift: number[] = []; private bump: number[] = [];
  private tokens: T.Mesh[] = []; private controls: {id: string; root: T.Object3D}[] = []; private open = 0; private jam = 0; private tries = 3; private done = false; private t = 0;
  private stampMat: T.MeshStandardMaterial; private pickX = 0; private pickPush = 0; private pickLift = 0; private liftT = 0; private stroke = -2; private drag: {x: number; y: number; ppmX: number; ppmY: number; wheel: boolean} | null = null; private under = -1; private probe = -2; private tremble = 0; private ease = 0; private shudder = 0; private turn = 0;
  private mats: Record<PinColor, T.Material>; private ringMat: T.Material; private ringMatB: T.Material; private hi: boolean;
  private housingMat!: T.MeshStandardMaterial; private frameMat!: T.MeshStandardMaterial; private flash: number[] = []; private drvMats: T.MeshStandardMaterial[] = [];
  private steel: T.Material; private brass: T.Material; private dark: T.Material; private tokenOn: T.Material; private tokenOff: T.Material;
  constructor(hi: boolean) {
    this.hi = hi;
    const housing = mat('#4b4a47', .46), frame = mat('#3a3937', .5, 1.5); this.housingMat = housing; this.frameMat = frame; frame.map = faceplate(); frame.roughness = .34; frame.metalness = .9; frame.envMapIntensity = 1.6; this.steel = mat('#9a958c', .3); this.brass = mat('#b8914a', .32); this.dark = new T.MeshStandardMaterial({color: '#0a0806', roughness: 1});
    this.mats = {steel: mat('#c9c6bf', .24), brass: mat('#c99d4c', .28), copper: mat('#c0693d', .3), black: mat('#24201d', .38)};
    this.ringMat = new T.MeshStandardMaterial({color: '#140c06', roughness: .8}); this.ringMatB = new T.MeshStandardMaterial({color: '#d8ae4e', roughness: .4, metalness: 1});
    this.tokenOn = new T.MeshStandardMaterial({color: '#8a0d08', emissive: '#e01a0c', emissiveIntensity: .7, roughness: .15, metalness: .1}); this.tokenOff = new T.MeshStandardMaterial({color: '#1a1414', roughness: .3, metalness: .2});
    this.group.add(this.body);
    // housing: back plate, a heavy frame with a machined front rim, corner screws
    const backP = new T.Mesh(new RoundedBoxGeometry(.31, .25, .012, 3, .005), (() => { const m = new T.MeshStandardMaterial({map: perlage(), metalness: 1, roughness: .32, envMapIntensity: 1.4}); m.map!.repeat.set(3, 2.4); return m; })()); backP.position.set(0, -.006, -.026); this.body.add(backP);
    const bar = (w: number, h: number, x: number, y: number) => { const b = new T.Mesh(new RoundedBoxGeometry(w, h, .04, 3, .004), frame); b.position.set(x, y, -.01); this.body.add(b); };
    bar(.31, .02, 0, IN.y1 + .01); bar(.31, .052, 0, IN.y0 - .026); bar(.02, IN.y1 - IN.y0, IN.x0 - .01, (IN.y0 + IN.y1) / 2); bar(.02, IN.y1 - IN.y0, IN.x1 + .01, (IN.y0 + IN.y1) / 2);
    { const lip = mat('#b9b4aa', .22); for (const [w, h, x0, y0] of [[IN.x1 - IN.x0, .0016, 0, IN.y1], [IN.x1 - IN.x0, .0016, 0, IN.y0], [.0016, IN.y1 - IN.y0, IN.x0, (IN.y0 + IN.y1) / 2], [.0016, IN.y1 - IN.y0, IN.x1, (IN.y0 + IN.y1) / 2]]) { const e = new T.Mesh(new T.BoxGeometry(w, h, .0016), lip); e.position.set(x0, y0, .0098); this.body.add(e); } }
    for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) { const s = screw(this.steel, this.dark, .0062); s.position.set(sx * .145, sy > 0 ? IN.y1 + .01 : IN.y0 - .026, .0105); this.body.add(s); }
    // the maker's plate on the lower bar, the try tokens beside it
    this.stampMat = new T.MeshStandardMaterial({map: stampTexture(null), metalness: .85, roughness: .38, envMapIntensity: 1.2});
    const stamp = new T.Mesh(new T.PlaneGeometry(.172, .039), this.stampMat); stamp.position.set(-.043, IN.y0 - .026, .0103); this.body.add(stamp);
    for (let k = 0; k < 3; k++) { const bez = new T.Mesh(new T.TorusGeometry(.0068, .0016, 10, 32), this.brass); bez.position.set(.064 + k * .019, IN.y0 - .026, .0112); this.body.add(bez);
      const tk = new T.Mesh(new T.IcosahedronGeometry(.0058, 1), this.tokenOn); tk.scale.z = .55; tk.position.set(.064 + k * .019, IN.y0 - .026, .0122); this.body.add(tk); this.tokens.push(tk); }
    // the channel block: a cap bar over the pin channels (the ribs come with the pins)
    const cap = new T.Mesh(new T.BoxGeometry(.2, IN.y1 - TOPB, .024), housing); cap.position.set(PX0 + .005, (IN.y1 + TOPB) / 2, -.009); this.body.add(cap);
    // the plug: the back half of a brass cylinder; its cut face is built with the pin bores in buildPins
    const plugBack = new T.Mesh(new T.CylinderGeometry(PR, PR, PLUG_X1 - PLUG_X0, 40, 1, false, Math.PI / 2, Math.PI), this.brass); plugBack.rotation.z = Math.PI / 2; plugBack.position.set((PLUG_X0 + PLUG_X1) / 2, PC, CH); this.body.add(plugBack);
    // housing shell around the plug (left and right of the pin block, and under the plug)
    const shell = (w: number, h: number, x: number, y: number) => { const b = new T.Mesh(new T.BoxGeometry(w, h, .022), housing); b.position.set(x, y, -.01); this.body.add(b); };
    shell(PLUG_X1 - PLUG_X0, .008, (PLUG_X0 + PLUG_X1) / 2, PC - PR - .005);
    // the thumb-wheel: a turned brass disc on the plug's front end, knurled rim, keyway in its face
    const prof: [number, number][] = [[0, -.013], [.03, -.013], [.031, -.012], [.031, -.009], [.041, -.008], [.044, -.006], [.044, .004], [.041, .006], [.034, .007], [.034, .01], [.028, .011], [.028, .013], [0, .013]];
    const disc = new T.Mesh(new T.LatheGeometry(prof.map(([a, b]) => new T.Vector2(a, b)), 72), this.brass); disc.rotation.z = Math.PI / 2; this.wheel.add(disc);
    for (let k = 0; k < (hi ? 60 : 36); k++) { const a = k / (hi ? 60 : 36) * Math.PI * 2, kn = new T.Mesh(new T.BoxGeometry(.008, .0016, .0016), this.brass); kn.position.set(-.001, Math.cos(a) * .0442, Math.sin(a) * .0442); kn.rotation.x = -a; this.wheel.add(kn); }
    const kslot = new T.Mesh(new T.BoxGeometry(.002, .016, .0035), this.dark); kslot.position.set(-.0132, 0, 0); this.wheel.add(kslot);
    for (const r of [.018, .025]) { const g = new T.Mesh(new T.TorusGeometry(r, .0005, 6, 64), this.dark); g.rotation.y = Math.PI / 2; g.position.x = -.0132; this.wheel.add(g); }
    const whit = new T.Mesh(new T.CylinderGeometry(.05, .05, .04, 20), new T.MeshBasicMaterial({visible: false})); whit.rotation.z = Math.PI / 2; whit.userData.id = 'ease'; this.wheel.add(whit); this.controls.push({id: 'ease', root: this.wheel});
    this.wheel.position.set(PLUG_X0 - .013, PC, CH); this.body.add(this.wheel);
    // cam lever on the plug's tail: pivot, link to the bolt
    const pivot = new T.Vector3(.1, -.058, -.006); this.lever.position.copy(pivot); this.body.add(this.lever);
    const arm = new T.Mesh(new RoundedBoxGeometry(.012, .058, .006, 2, .002), this.steel); arm.position.set(-.006, .022, 0); arm.rotation.z = .55; this.lever.add(arm);
    const boss = new T.Mesh(new T.CylinderGeometry(.009, .009, .009, 28), this.steel); boss.rotation.x = Math.PI / 2; this.lever.add(boss);
    const pin = new T.Mesh(new T.CylinderGeometry(.004, .004, .012, 20), this.brass); pin.rotation.x = Math.PI / 2; this.lever.add(pin);
    const cam = new T.Mesh(new T.CylinderGeometry(.012, .012, .01, 28), this.steel); cam.rotation.x = Math.PI / 2; cam.position.set(PLUG_X1 + .008, PC, -.007); this.body.add(cam);
    // the bolt: a steel bar sliding in a brass guide along the bottom, its return spring at the right end
    const guide = new T.Mesh(new T.BoxGeometry(.2, .004, .016), this.brass); guide.position.set(.01, IN.y0 + .004, -.008); this.body.add(guide);
    const bb = new T.Mesh(new RoundedBoxGeometry(.17, .011, .012, 2, .002), this.steel); bb.position.set(-.005, 0, 0); this.bolt.add(bb);
    const lug = new T.Mesh(new T.BoxGeometry(.008, .012, .01), this.steel); lug.position.set(.075, .009, 0); this.bolt.add(lug);
    this.bolt.position.set(0, IN.y0 + .0125, -.008); this.body.add(this.bolt);
    this.boltSpring = new T.Mesh(new T.TubeGeometry(new Helix(.0062, 8), hi ? 140 : 80, .0015, 6, false), this.steel); this.boltSpring.rotation.z = -Math.PI / 2; this.boltSpring.position.set(.087, IN.y0 + .0125, -.008); this.body.add(this.boltSpring);
    this.body.add(this.pins);
    // gear train in the right bay, driven by the plug: it twitches with the torque and spins when the lock opens
    { const ga = gear(.021, 18, .004, this.brass, this.steel), gb = gear(.0125, 11, .004, this.steel, this.brass); this.gearA.add(ga); this.gearB.add(gb);
      this.gearA.position.set(.104, .046, -.012); this.gearB.position.set(.1, .0115, -.012); this.body.add(this.gearA, this.gearB);
      for (const g of [this.gearA, this.gearB]) { const sc = screw(this.steel, this.dark, .0035); sc.position.set(g.position.x, g.position.y, -.008); this.body.add(sc); } }
    // brass corner brackets riveted over the frame
    { const br = new T.MeshStandardMaterial({color: '#b8904a', metalness: 1, roughness: .28, envMapIntensity: 1.5});
      for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) { const cy = sy > 0 ? IN.y1 + .01 : IN.y0 - .026, cx = sx * .145;
        const h = new T.Mesh(new RoundedBoxGeometry(.034, .012, .003, 2, .0012), br), v = new T.Mesh(new RoundedBoxGeometry(.012, .034, .003, 2, .0012), br);
        h.position.set(cx - sx * .011, cy, .0118); v.position.set(cx, cy - sy * .011, .0118); this.body.add(h, v);
        for (const [rx, ry] of [[cx - sx * .024, cy], [cx, cy - sy * .024]]) { const rv = new T.Mesh(new T.SphereGeometry(.0022, 12, 8), br); rv.scale.z = .5; rv.position.set(rx, ry, .0134); this.body.add(rv); } } }
    // turned brass collars where the shackle enters the case; machined rings on the plug's tail
    for (const sx of [-1, 1]) { const c = new T.Mesh(new T.CylinderGeometry(.021, .023, .012, 32), this.brass); c.position.set(sx * .085, IN.y1 + .026, -.014); this.body.add(c);
      const r = new T.Mesh(new T.TorusGeometry(.0215, .0015, 8, 32), this.steel); r.rotation.x = Math.PI / 2; r.position.set(sx * .085, IN.y1 + .032, -.014); this.body.add(r); }
    for (const dx of [0, .004]) { const ring = new T.Mesh(new T.TorusGeometry(PR + .0006, .0007, 8, 48, Math.PI), this.steel); ring.rotation.y = Math.PI / 2; ring.rotation.z = Math.PI / 2; ring.position.set(PLUG_X1 - .003 - dx, PC, CH); this.body.add(ring); }
    for (const [sx, sy] of [[-.112, .066]]) { const s = screw(this.steel, this.dark, .0075); s.position.set(sx, sy, -.019); this.body.add(s); }
    // the hook pick: a long blade through the wheel's keyway, its grip out to the left
    const polished = new T.MeshStandardMaterial({color: '#e4e7ec', metalness: 1, roughness: .12, envMapIntensity: 2});
    const blade = new T.Mesh(new T.BoxGeometry(.17, .0042, .0045), polished); blade.position.x = -.085; this.pick.add(blade);
    const hook = new T.Mesh(new T.BoxGeometry(.0034, 1, .004), polished); hook.scale.y = .0045; hook.position.set(-.0014, .0031, 0); this.pick.add(hook); this.hook = hook;
    const tipCap = new T.Mesh(new T.SphereGeometry(.0021, 14, 10), polished); this.pick.add(tipCap); this.hookTip = tipCap;
    // a red-lacquered handle with brass bands: easy to see against the dark cage
    const lacquer = new T.MeshPhysicalMaterial({color: '#b3241c', roughness: .25, metalness: .1, clearcoat: 1});
    const grip = new T.Mesh(new T.CylinderGeometry(.0125, .014, .085, 28), lacquer); grip.rotation.z = Math.PI / 2; grip.position.x = -.22; this.pick.add(grip);
    const knob = new T.Mesh(new T.SphereGeometry(.0135, 24, 14), lacquer); knob.position.x = -.2625; this.pick.add(knob);
    for (const bx of [-.183, -.2, -.248]) { const band = new T.Mesh(new T.CylinderGeometry(.0142, .0142, .004, 28), this.brass); band.rotation.z = Math.PI / 2; band.position.x = bx; this.pick.add(band); }
    const fer = new T.Mesh(new T.CylinderGeometry(.007, .0115, .016, 24), this.brass); fer.rotation.z = Math.PI / 2; fer.position.x = -.17; this.pick.add(fer);
    this.pick.position.set(0, PC - .001, CH + .004); this.body.add(this.pick);
    // the tension wrench: an L of spring steel in the bottom of the keyway, its arm hanging down out of the wheel
    { const w = new T.Group(); const a = new T.Mesh(new T.BoxGeometry(.03, .0034, .004), polished); a.position.x = .0; w.add(a);
      const b = new T.Mesh(new T.BoxGeometry(.0028, .07, .0035), polished); b.position.set(-.03, -.035, 0); w.add(b);
      const tip = new T.Mesh(new T.CylinderGeometry(.004, .004, .02, 16), lacquer); tip.position.set(-.03, -.075, 0); w.add(tip);
      w.position.set(PLUG_X0 - .028, PC - .006, .016); /* in front of the frame, so it is seen hanging out of the wheel */ w.rotation.z = -.12; this.body.add(w); this.wrench = w; }
    // shackle
    const chrome = new T.MeshStandardMaterial({color: '#d6d8dc', metalness: 1, roughness: .16, envMapIntensity: 1.8}); const u = new T.Mesh(new T.TorusGeometry(.085, .015, 24, 64, Math.PI), chrome); this.shackle.add(u);
    for (const s of [-1, 1]) { const leg = new T.Mesh(new T.CylinderGeometry(.015, .015, .07, 28), chrome); leg.position.set(s * .085, -.035, 0); this.shackle.add(leg); }
    this.shackle.position.set(0, IN.y1 + .045, -.014); this.body.add(this.shackle);
    for (const s of [-1, 1]) { const strap = new T.Mesh(new T.TorusGeometry(.022, .004, 8, 20), frame); strap.rotation.y = Math.PI / 2; strap.position.set(s * .085, .2, -.03); this.group.add(strap); }
    // a heavy cast case behind the frame: the lock reads as one solid padlock, not a set of bars
    { const caseMat = new T.MeshStandardMaterial({color: '#1d1f23', metalness: 1, roughness: .38, envMapIntensity: 1.3});
      const c = new T.Mesh(new RoundedBoxGeometry(.33, .27, .03, 6, .012), caseMat); c.position.set(0, -.006, -.048); /* behind the back plate: it must never cover the mechanism */ this.body.add(c); }
    // a thick window of clear glass over the mechanism: faint tint, sharp reflections, a bevelled edge; clicks pass through it
    { const win = new T.Mesh(new T.PlaneGeometry(IN.x1 - IN.x0, IN.y1 - IN.y0), new T.MeshPhysicalMaterial({color: '#dfe8ee', metalness: 0, roughness: .04, transparent: true, opacity: .07, clearcoat: 1, clearcoatRoughness: .03, envMapIntensity: 2.2, depthWrite: false}));
      win.position.set((IN.x0 + IN.x1) / 2, (IN.y0 + IN.y1) / 2, .0132); win.raycast = () => {}; win.renderOrder = 3; this.body.add(win);
      const refl = new T.Mesh(new T.PlaneGeometry(IN.x1 - IN.x0, IN.y1 - IN.y0), new T.MeshBasicMaterial({map: glassStreaks(), transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: .55}));
      refl.position.copy(win.position); refl.position.z += .0002; refl.raycast = () => {}; refl.renderOrder = 4; this.body.add(refl); this.glass = refl;
      const bevel = new T.MeshStandardMaterial({color: '#c9d4da', metalness: .2, roughness: .1, transparent: true, opacity: .35, depthWrite: false});
      for (const [w, h, x0, y0] of [[IN.x1 - IN.x0, .0022, (IN.x0 + IN.x1) / 2, IN.y1 - .0011], [IN.x1 - IN.x0, .0022, (IN.x0 + IN.x1) / 2, IN.y0 + .0011], [.0022, IN.y1 - IN.y0, IN.x0 + .0011, (IN.y0 + IN.y1) / 2], [.0022, IN.y1 - IN.y0, IN.x1 - .0011, (IN.y0 + IN.y1) / 2]]) {
        const b = new T.Mesh(new T.BoxGeometry(w, h, .003), bevel); b.position.set(x0, y0, .012); b.raycast = () => {}; this.body.add(b); } }
    // depth: the walls of the open cavity shade the parts inside
    { const sh = new T.Mesh(new T.PlaneGeometry(IN.x1 - IN.x0, IN.y1 - IN.y0), new T.MeshBasicMaterial({map: cavity(), transparent: true, depthWrite: false})); sh.position.set((IN.x0 + IN.x1) / 2, (IN.y0 + IN.y1) / 2, .0085); sh.renderOrder = 2; this.body.add(sh); }
    // its own light, so steel reads as steel and brass as brass against the lava glow: a warm-white key, a cool fill, a rim from behind
    { const key = new T.PointLight('#fff2de', .5, .32, 2); key.position.set(-.12, .16, .26); this.body.add(key);
      const fill = new T.PointLight('#a9c2ff', .2, .32, 2); fill.position.set(.2, -.04, .2); this.body.add(fill);
      const rim = new T.PointLight('#ffd9a8', .3, .28, 2); rim.position.set(.05, .22, -.1); this.body.add(rim); }
    enableShadows(this.group);
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(new Float32Array(48 * 3), 3));
    this.sparks = new T.Points(sg, new T.PointsMaterial({color: '#ffd38a', size: .0022, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending})); this.sparks.frustumCulled = false; this.body.add(this.sparks);
  }
  private spit(x0: number, n = 48) { const p = this.sparks.geometry.attributes.position as T.BufferAttribute; for (let k = 0; k < n; k++) { p.setXYZ(k, x0 + (Math.random() - .5) * .012, SHEAR, CH + .01);
    const a = Math.random() * Math.PI, v = .08 + Math.random() * .22; this.sparkV.set([Math.cos(a) * v, Math.sin(a) * v * .8 + .05, (Math.random() * .6) * v], k * 3); } p.needsUpdate = true; this.sparkLife = 1; }

  /** world placement: the lock hangs on the cage door, facing in */
  place(ci: T.Box3 | undefined, floorY: number) { const maxZ = ci?.max.z ?? 1.18; this.group.position.set(.12, floorY + 1.3, maxZ - .035); this.group.rotation.y = Math.PI; this.group.scale.setScalar(CodeLock.SCALE); }

  private buildPins(t: LockTask) {
    for (const o of [...this.pins.children]) { this.pins.remove(o); o.traverse(k => (k as T.Mesh).geometry?.dispose()); }
    this.drivers = []; this.keys = []; this.springs = []; this.drvMats.forEach(m => m.dispose()); this.drvMats = []; this.controls = this.controls.filter(c => !c.id.startsWith('pin'));
    const n = t.pins.length, P = pitch(n), xs = t.pins.map((_, i) => PX0 + (i - (n - 1) / 2) * P), CW = .0205, seg = this.hi ? 140 : 80;
    const springGeo = new T.TubeGeometry(new Helix(.0066, 9), seg, .00085, 6, false), springMat = mat('#aeaaa2', .28);
    const F = FINISHES[t.finish] ?? FINISHES[0], housing = mat(F.housing, t.finish === 2 ? .34 : .44), back = (() => { const m = new T.MeshStandardMaterial({map: perlage(), color: '#8c8f96', metalness: 1, roughness: .36, envMapIntensity: 1.2}); return m; })(), plugCut = mat('#c9a050', .22); plugCut.map = null; /* clean turned brass, not grimy planks */
    this.housingMat.color.set(F.housing); this.frameMat.color.set(F.frame);
    // the channel block: ribs between the channels, the back wall of each channel, machined chamfers
    const edges = [xs[0] - P / 2 - .008, ...xs.flatMap(x => [x - CW / 2, x + CW / 2]), xs[n - 1] + P / 2 + .008];
    const ribMat = new T.MeshStandardMaterial({color: t.finish === 2 ? '#6b5530' : '#2f3238', metalness: 1, roughness: .26, envMapIntensity: 1.5});
    for (let k = 0; k < edges.length; k += 2) { const w = edges[k + 1] - edges[k]; if (w <= 0) continue;
      const rib = new T.Mesh(new T.BoxGeometry(w, TOPB - SHEAR - .0012, .024), ribMat); rib.position.set((edges[k] + edges[k + 1]) / 2, (TOPB + SHEAR + .0012) / 2, -.009); this.pins.add(rib);
      const ch = new T.Mesh(new T.BoxGeometry(w, .0012, .0012), mat('#8d877d', .25)); ch.position.set((edges[k] + edges[k + 1]) / 2, SHEAR + .0018, .0033); this.pins.add(ch); }
    for (const x of xs) { const bw = new T.Mesh(new T.PlaneGeometry(CW, TOPB - SHEAR), back); bw.position.set(x, (TOPB + SHEAR) / 2, CH - PIN_R - .0015); this.pins.add(bw); }
    // pin numbers struck into the channel cap (pin 1 is the left one)
    { const cw = .2, ch = .016, cv = hiCanvas(800, 64), x = ctx2d(cv); x.clearRect(0, 0, 800, 64); x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `700 44px Georgia, 'Times New Roman', serif`;
      xs.forEach((px, i) => { const u = (px - (PX0 + .005)) / cw * 800 + 400; x.fillStyle = 'rgba(255,236,190,.55)'; x.fillText(String(i + 1), u, 34); x.fillStyle = '#120c06'; x.fillText(String(i + 1), u, 32);
        x.strokeStyle = 'rgba(18,12,6,.8)'; x.lineWidth = 2; x.beginPath(); x.arc(u, 33, 25, 0, 7); x.stroke(); });
      const num = new T.Mesh(new T.PlaneGeometry(cw, ch), new T.MeshStandardMaterial({map: textTex(cv), transparent: true, metalness: .6, roughness: .5, depthWrite: false})); num.position.set(PX0 + .005, (IN.y1 + TOPB) / 2, .0036); this.pins.add(num); }
    // the plug's cut face, drilled for the key pins, the keyway through it
    const pe = [PLUG_X0, ...xs.flatMap(x => [x - .0095, x + .0095]), PLUG_X1];
    for (let k = 0; k < pe.length; k += 2) { const w = pe[k + 1] - pe[k]; if (w <= 0) continue;
      const f = new T.Mesh(new T.PlaneGeometry(w, SHEAR - .0008 - (PC + .0045)), plugCut); f.position.set((pe[k] + pe[k + 1]) / 2, (SHEAR - .0008 + PC + .0045) / 2, CH); this.pins.add(f); }
    const low = new T.Mesh(new T.PlaneGeometry(PLUG_X1 - PLUG_X0, PR - .0045), plugCut); low.position.set((PLUG_X0 + PLUG_X1) / 2, PC - .0045 - (PR - .0045) / 2, CH); this.pins.add(low);
    const kw = new T.Mesh(new T.PlaneGeometry(PLUG_X1 - PLUG_X0, .009), this.dark); kw.position.set((PLUG_X0 + PLUG_X1) / 2, PC, CH - .002); this.pins.add(kw);
    for (const x of xs) { const bore = new T.Mesh(new T.CylinderGeometry(.0092, .0092, SHEAR - PC - .0045, 24, 1, true, Math.PI / 2, Math.PI), back); (bore.material as T.Material).side = T.DoubleSide; bore.position.set(x, (SHEAR + PC + .0045) / 2, CH); this.pins.add(bore); }
    t.pins.forEach((p, i) => { const cx = xs[i];
      // driver pin: a turned slug with a spring seat; copper is a waisted spool; notches ring the shoulder
      const dg = new T.Group(); dg.position.set(cx, 0, CH); this.pins.add(dg); const H = DRV_H / 2, R = PIN_R;
      const prof = p.color === 'copper' ? [[0, -H], [R * .9, -H], [R, -H + .0008], [R, -H + .004], [R * .6, -H + .0068], [R * .6, H - .0098], [R, H - .007], [R, H - .0042], [R * .8, H - .0036], [R * .8, H], [0, H]]
        : [[0, -H], [R * .9, -H], [R, -H + .0009], [R, H - .0042], [R * .8, H - .0036], [R * .8, H], [0, H]];
      const dm = (this.mats[p.color] as T.MeshStandardMaterial).clone(); dm.emissive = new T.Color('#ffb04a'); dm.emissiveIntensity = 0; this.drvMats.push(dm);
      dg.add(new T.Mesh(new T.LatheGeometry(prof.map(([a, b]) => new T.Vector2(a, b)), 44), dm));
      for (let k = 0; k < p.notches; k++) { const ring = new T.Mesh(new T.TorusGeometry(R * 1.01, .00085, 6, 36), p.color === 'black' ? this.ringMatB : this.ringMat); ring.rotation.x = Math.PI / 2;
        ring.position.y = H - .0062 - k * .0024; if (p.color === 'copper' && k > 0) ring.scale.setScalar(.6); dg.add(ring); }
      this.drivers.push(dg);
      // key pin: hardened steel, its own length, a bullet nose into the keyway
      const Lk = p.len + .004, kr = R * .9, kp = new T.Mesh(new T.LatheGeometry([[0, 0], [kr * .3, .0004], [kr * .75, .0022], [kr, .0046], [kr, Lk - .0007], [kr * .88, Lk], [0, Lk]].map(([a, b]) => new T.Vector2(a, b)), 40), this.mats.steel);
      kp.position.set(cx, KEY_TIP, CH); kp.userData.len = Lk; this.pins.add(kp); this.keys.push(kp);
      const sp = new T.Mesh(springGeo, springMat); sp.position.set(cx, 0, CH); this.pins.add(sp); this.springs.push(sp);
      const hit = new T.Mesh(new T.BoxGeometry(P * .95, TOPB - PC + .01, .04), new T.MeshBasicMaterial({visible: false})); hit.position.set(cx, (TOPB + PC) / 2, .004); hit.userData.id = `pin${i}`; this.pins.add(hit);
      this.controls.push({id: `pin${i}`, root: dg}); });
    this.lift = this.keys.map(k => KEY_TIP + k.userData.len); this.flash = t.pins.map(() => 0); this.bump = t.pins.map(() => 0);
  }

  setTask(t: LockTask, _seed?: number) {
    this.task = t; this.tries = t.tries; this.done = false; this.open = 0; this.jam = 0; this.stuck = -1; this.eased = false; this.step = 0; this.set = t.pins.map(() => false); this.turn = 0; this.overset = -1;
    this.stampMat.map?.dispose(); this.stampMat.map = stampTexture(t); this.stampMat.needsUpdate = true;
    this.shackle.position.y = IN.y1 + .045; this.shackle.rotation.y = 0; this.body.rotation.z = 0; this.pickX = PLUG_X0 + .012; this.pickLift = this.liftT = 0; this.under = -1;
    this.buildPins(t); this.paintTokens();
  }
  reset() { if (this.task) this.setTask(this.task); }
  private paintTokens() { this.tokens.forEach((tk, k) => { const exists = k < (this.task?.tries ?? 3); tk.visible = exists; tk.material = k < this.tries ? this.tokenOn : this.tokenOff; }); }

  center() { return new T.Vector3(0, -.006, 0).applyMatrix4(this.group.matrixWorld); }
  hits(ray: T.Raycaster) { return ray.intersectObject(this.group, true)[0] || null; }
  controlScreen(id: string, camera: T.Camera) { const c = this.controls.find(k => k.id === id)!; const v = new T.Vector3().setFromMatrixPosition(c.root.matrixWorld).project(camera); return {x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight}; }
  get triesLeft() { return this.tries; }

  // ---------------------------------------------------------------- the pick in the player's hand
  // Drag sideways to slide the pick along the keyway under a pin; drag up to lift that pin. A stroke that brings the pin
  // to the shear line "sets" it (or sticks, traps, drops: the handbook rules); the pick falls back when let go.
  // A still tap on the wheel eases the torque; a tap elsewhere only shows where the pick has to go.
  private pinX(i: number) { const n = this.task!.pins.length; return PX0 + (i - (n - 1) / 2) * pitch(n); }
  private pinUnder(x: number) { if (!this.task) return -1; const n = this.task.pins.length, h = pitch(n) * .32; for (let i = 0; i < n; i++) if (Math.abs(x - this.pinX(i)) < h) return i; return -1; }
  private ppm(camera: T.Camera) { const a = new T.Vector3(0, PC, CH), b = new T.Vector3(.01, PC, CH), c = new T.Vector3(0, PC + .01, CH);
    const sp = (v: T.Vector3) => { this.body.localToWorld(v); v.project(camera); return new T.Vector2((v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight); };
    const A = sp(a), B = sp(b), C = sp(c); return {x: (B.x - A.x) / .01, y: (C.y - A.y) / .01}; }
  hitsWheel(ray: T.Raycaster) { return !!ray.intersectObject(this.group, true).find(k => k.object.userData.id === 'ease'); }
  pointerDown(ray: T.Raycaster, x: number, y: number, camera: T.Camera) {
    if (!this.enabled || this.done || !this.task || !this.hits(ray)) return false;
    const m = this.ppm(camera); this.drag = {x, y, ppmX: m.x, ppmY: m.y, wheel: this.hitsWheel(ray)}; this.stroke = -2; return true;
  }
  pointerMove(x: number, y: number) {
    const d = this.drag; if (!d || d.wheel || this.done) return;
    const dx = (x - d.x) / d.ppmX, dy = -(y - d.y) / Math.abs(d.ppmY); d.x = x; d.y = y;
    // sideways: slide along the keyway (only while the pick is down)
    if (this.liftT < .15) { const lo = PLUG_X0 + .008, hi = this.pinX(this.task!.pins.length - 1) + .012; this.pickX = Math.max(lo, Math.min(hi, this.pickX + dx * 1.25));
      const u = this.pinUnder(this.pickX); if (u !== this.under) { this.under = u; if (u >= 0) this.sounds.click?.(); } }
    // upward: raise the hook; lifting the pin under it all the way to the shear line commits it
    this.liftT = Math.max(0, Math.min(1.7, this.liftT + dy / .016));
    const u = this.pinUnder(this.pickX);
    if (u >= 0 && this.liftT > .22 && this.liftT < .92 && this.probe !== u) { this.probe = u; const t = this.task!; if (t.method === 'bind' && !this.set[u]) { if (u === t.order[this.step] && this.stuck < 0) { this.sounds.click?.(); this.tremble = 1; } else this.sounds.turn?.(); } }
    if (this.liftT < .1) this.probe = -2;
    if (u >= 0 && this.liftT > .92 && this.stroke !== u && this.overset < 0) { this.stroke = u; this.pickPush = 1; this.liftPin(u); }
    // pushed on past the click: the key pin rides over the shear line and jams the plug (not on EASY)
    if (u >= 0 && this.stroke === u && this.set[u] && this.liftT > 1.55 && this.overset < 0 && this.task!.diff !== 'EASY' && !this.done) { this.overset = u; this.shudder = 1; this.sounds.jam?.(); this.onNote('OVERSET'); }
  }
  pointerUp(tap: boolean) {
    const d = this.drag; this.drag = null; this.liftT = 0; this.stroke = -2; if (!d) return;
    if (tap && d.wheel && this.enabled && !this.done) this.easeWheel();
  }
  /** a lifted pin the hook is under (for the HUD) */
  get pickUnder() { return this.under; }

  /** a tap on the lock; returns the control id or null */
  tap(ray: T.Raycaster): string | null {
    const all = ray.intersectObject(this.group, true), id = all.find(k => k.object.userData.id)?.object.userData.id as string | undefined; if (!id) return all[0] ? 'body' : null;
    if (!this.enabled || this.done || !this.task) { this.sounds.jam?.(); return id; }
    if (id === 'ease') this.easeWheel();
    return id;
  }
  private easeWheel() {
    this.ease = 1; this.sounds.lever?.();
    if (this.overset >= 0) { this.overset = -1; this.dropAll(); this.onNote('DROPPED'); return; }
    if (this.stuck >= 0) { this.eased = true; this.onNote('EASED'); return; }
    if (this.set.some(Boolean)) { this.dropAll(); this.onNote('DROPPED'); } // torque let go for nothing: the set pins fall (no try lost)
  }
  private liftPin(i: number) {
    const t = this.task!, p = t.pins[i]; this.bump[i] = 1; if (this.overset >= 0) return;
    if (this.set[i]) return;
    if (p.color === 'black') return this.fail('TRAP');
    if (this.stuck >= 0) { if (i === this.stuck && this.eased) { this.stuck = -1; this.eased = false; return this.setPin(i); } return this.fail('STUCK'); }
    if (i !== t.order[this.step]) return this.fail('ORDER');
    if (p.color === 'copper') { this.stuck = i; this.eased = false; this.shudder = 1; setTimeout(() => this.sounds.jam?.(), 90); this.onNote('STUCK'); return; }
    this.setPin(i);
  }
  private setPin(i: number) {
    this.set[i] = true; this.step++; this.flash[i] = 1; this.spit(this.pinX(i), 22); setTimeout(() => this.sounds.click?.(), 110); this.onNote('SET');
    if (this.step >= this.task!.order.length) { this.done = true; this.enabled = false; setTimeout(() => { this.open = .001; this.spit(PX0, 48); this.sounds.unlock?.(); this.paintTokens(); this.onNote('OPEN'); this.onResult(true, 'OK'); }, 420); }
  }
  private dropAll() { this.set = this.set.map(() => false); this.step = 0; this.stuck = -1; this.eased = false; setTimeout(() => this.sounds.jam?.(), 120); }
  private fail(why: 'ORDER' | 'TRAP' | 'STUCK') {
    this.dropAll(); this.tries--; this.jam = 1; this.paintTokens();
    if (this.tries <= 0) { this.done = true; this.enabled = false; this.onResult(false, 'WRONG'); } else this.onWrong(this.tries, why);
  }
  /** time ran out: the lock stays shut */
  expire() { this.done = true; this.enabled = false; }

  update(dt: number) {
    this.t += dt; if (!this.task) return;
    const k = 1 - Math.exp(-dt * 18);
    for (let i = 0; i < this.drivers.length; i++) {
      const len = this.keys[i].userData.len as number, rest = KEY_TIP + len;
      // the driver sits on its key pin, just above the shear line once set, or caught on its waist (a stuck spool)
      const target = this.overset === i ? SHEAR + .0036 : this.set[i] ? SHEAR + .0007 : this.stuck === i ? SHEAR - .0062 : rest; this.lift[i] += (target - this.lift[i]) * k;
      this.bump[i] = Math.max(0, this.bump[i] - dt * 4.2); const onHook = this.pinUnder(this.pick.position.x) === i ? this.pickLift : 0;
      const b = Math.max(Math.sin(this.bump[i] * Math.PI) * .35, onHook) * (SHEAR - rest + .0018);
      const keyTop = this.overset === i ? SHEAR + .0032 : Math.max(rest + b, this.stuck === i ? this.lift[i] : rest); this.keys[i].position.y = keyTop - len;
      if (this.overset === i) { this.lift[i] = Math.max(this.lift[i], keyTop); this.drvMats[i].emissive.set('#ff3a20'); this.flash[i] = Math.max(this.flash[i], .6 + .3 * Math.sin(this.t * 10)); } else this.drvMats[i]?.emissive.set('#ffb04a');
      const drvBottom = Math.max(keyTop, this.lift[i]), dg = this.drivers[i];
      dg.position.y = drvBottom + DRV_H / 2; const tr = this.task.method === 'bind' && i === this.task.order[this.step] && !this.set[i] && this.pinUnder(this.pick.position.x) === i && this.pickLift > .2 ? this.tremble * (this.task.diff === 'HARD' ? .45 : 1) : 0;
      dg.rotation.z = this.stuck === i ? .08 + Math.sin(this.t * 40) * .03 * this.shudder : Math.sin(this.t * 70) * .05 * tr; dg.position.x = this.pinX(i) + Math.sin(this.t * 90) * .0005 * tr;
      const sp = this.springs[i], s0 = drvBottom + DRV_H; sp.position.y = s0; sp.scale.y = Math.max(.002, TOPB - s0);
    }
    // the pick slides under the chosen pin and flicks up
    this.pickPush = Math.max(0, this.pickPush - dt * 5); this.pickLift += (this.liftT - this.pickLift) * (1 - Math.exp(-dt * 30)); this.pick.position.y = PC - .001 + this.pickLift * .0022;
    { const u = this.pinUnder(this.pick.position.x), kb = u >= 0 ? this.keys[u].position.y - this.pick.position.y : .0045 + .0008, h = Math.max(.0045, kb - .0008); this.hook.scale.y = h; this.hook.position.y = .0008 + h / 2; this.hookTip.position.set(-.0012, .0008 + h, 0); } this.pick.position.x += (this.pickX - this.pick.position.x) * (1 - Math.exp(-dt * 22)); this.pick.rotation.z = Math.sin(this.pickPush * Math.PI) * .03;
    // torque on the wheel: a slight lean while picking, a twitch when eased, a full quarter turn when open
    this.ease = Math.max(0, this.ease - dt * 2.5); for (let i = 0; i < this.drvMats.length; i++) { this.flash[i] = Math.max(0, (this.flash[i] ?? 0) - dt * 2.2); this.drvMats[i].emissiveIntensity = this.flash[i] * this.flash[i] * 1.4; } if (this.pickLift < .15) this.tremble = 0; this.shudder = Math.max(0, this.shudder - dt * 1.5);
    const tq = this.open > 0 ? Math.PI / 2 * (1 - Math.pow(1 - Math.min(1, this.open * 1.4), 3)) : this.eased ? -.02 : .05 + .04 * this.step;
    this.turn += (tq - Math.sin(this.ease * Math.PI) * .18 + Math.sin(this.t * 50) * .015 * this.shudder - this.turn) * (1 - Math.exp(-dt * (this.open > 0 ? 30 : 14)));
    this.wheel.rotation.x = this.turn; if (this.wrench) this.wrench.rotation.z = -.12 - this.turn * .35;
    // cam → lever → bolt: the bolt draws back as the plug turns
    const draw = Math.max(0, Math.min(1, this.turn / (Math.PI / 2))); this.lever.rotation.z = draw * .55; this.gearA.rotation.z = -this.turn * 1.6; this.gearB.rotation.z = this.turn * 1.6 * 18 / 11 + .14; this.bolt.position.x = -draw * .028; this.boltSpring.scale.set(1, .036 * (1 - draw * .5), 1);
    if (this.open > 0) { this.open = Math.min(1, this.open + dt * .7); const e = Math.max(0, (this.open - .25) / .75), ee = 1 - Math.pow(1 - e, 3), sw = Math.max(0, (e - .35) / .65); this.shackle.position.y = IN.y1 + .045 + .07 * Math.min(1, e * 2.2); this.shackle.rotation.y = (1 - Math.pow(1 - sw, 3)) * 2.2; this.body.rotation.z = Math.sin(e * 14) * .06 * (1 - e) + ee * .12; /* the body, freed, hangs off one leg */ }
    if (this.glass) { const m = this.glass.material as T.MeshBasicMaterial; m.map!.offset.x = Math.sin(this.t * .25) * .03; }
    if (this.sparkLife > 0) { this.sparkLife = Math.max(0, this.sparkLife - dt * 1.6); const p = this.sparks.geometry.attributes.position as T.BufferAttribute, v = this.sparkV;
      for (let k = 0; k < p.count; k++) { v[k * 3 + 1] -= 1.4 * dt; p.setXYZ(k, p.getX(k) + v[k * 3] * dt, p.getY(k) + v[k * 3 + 1] * dt, p.getZ(k) + v[k * 3 + 2] * dt); } p.needsUpdate = true; }
    (this.sparks.material as T.PointsMaterial).opacity = this.sparkLife * this.sparkLife;
    if (this.jam > 0) { this.jam = Math.max(0, this.jam - dt * 2); this.body.position.x = Math.sin(this.jam * 60) * .004 * this.jam; }
  }
}
