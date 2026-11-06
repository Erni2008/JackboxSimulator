// АДСКАЯ КЛЕТКА — THE CAGE LOCK (4th machine): pick it, without a key.
// A heavy pin-tumbler padlock hangs on the cage door. Its brass face has a glass inspection window: through it the
// player sees the pin stacks (coloured driver pins with engraved notches, springs above, the plug and its keyway
// below), a hook pick in the keyway and a tension wrench at its mouth. Tapping a pin lifts it with the pick.
// The handbook (section V, "Picking the lock") holds everything else:
//   1. the maker's stamp on the lock decides the ORDER the pins bind in
//        GRIFFIN & SON — right to left · HARTWELL — copper, then brass, then steel (left to right inside a colour)
//        MORTON — by the notches on the pin, fewest first
//   2. a BLACK pin is a trap: never lift it (it is not in the order)
//   3. a COPPER pin is a spool: lifted in its turn it STICKS; ease the tension wrench, then lift it again
//   4. a wrong pin drops every pin and burns a try; easing the wrench for nothing drops the pins (no try lost)
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
export interface LockTask { maker: number; pins: Pin[]; order: number[]; tries: number; worn: boolean; serial: string }
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
export function makeLockTask(seed: number, d: LockDiff): LockTask {
  const r = rng(seed * 7919 + 17), n = d === 'EASY' ? 4 : 5, maker = Math.floor(r() * 3);
  const colors: PinColor[] = Array.from({length: n}, () => (['steel', 'brass', 'steel', 'brass', 'copper'] as PinColor[])[Math.floor(r() * 5)]);
  let copper = colors.filter(c => c === 'copper').length; while (copper > 2) { const i = colors.indexOf('copper'); colors[i] = 'steel'; copper--; }
  if (!copper) colors[Math.floor(r() * n)] = 'copper';
  if (d !== 'EASY') { const one = colors.filter(k => k === 'copper').length === 1, free = colors.map((c, i) => one && c === 'copper' ? -1 : i).filter(i => i >= 0); colors[free[Math.floor(r() * free.length)]] = 'black'; }
  const notch = Array.from({length: n}, (_, i) => i + 1); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [notch[i], notch[j]] = [notch[j], notch[i]]; }
  const pins = colors.map((color, i) => ({color, notches: notch[i], len: .0085 + Math.floor(r() * 6) * .002}));
  return {maker, pins, order: bindingOrder(maker, pins), tries: d === 'HARD' ? 2 : 3, worn: d === 'HARD', serial: String(1000 + Math.floor(r() * 8999))};
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
const PW = .28, PH = .2;                     // brass face
const WIN = {x0: -.112, x1: .112, y0: -.044, y1: .06}; // inspection window
const SHEAR = -.008, PLUG_Y0 = -.04, KEYWAY = -.032;
const DRV_H = .022, KEY_TIP = -.0296, BORE_TOP = .058, PIN_R = .0058;
const pitch = (n: number) => n === 4 ? .042 : .036;

function plateTexture(t: LockTask | null) {
  const W = 512, H = Math.round(512 * PH / PW), cv = hiCanvas(W, H), x = ctx2d(cv), r = rng(42), kx = W / PW, ky = H / PH;
  const base = x.createLinearGradient(0, 0, W, H); base.addColorStop(0, '#6e5228'); base.addColorStop(.45, '#9c7a3e'); base.addColorStop(1, '#5a421f'); x.fillStyle = base; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) { const gx = r() * W, gy = r() * H, gr = 10 + r() * 50, g = x.createRadialGradient(gx, gy, 0, gx, gy, gr); g.addColorStop(0, `rgba(${r() < .5 ? '40,60,30' : '30,20,10'},${.08 + r() * .12})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); }
  x.globalAlpha = .07; for (let i = 0; i < 500; i++) { x.fillStyle = r() < .5 ? '#fff4d0' : '#1a1006'; x.fillRect(0, r() * H, W, .6); } x.globalAlpha = 1;
  const vig = x.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, 330); vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(10,6,2,.55)'); x.fillStyle = vig; x.fillRect(0, 0, W, H);
  const cut = (draw: () => void, w: number) => { x.save(); x.translate(0, 1.2); x.strokeStyle = x.fillStyle = 'rgba(255,230,170,.45)'; x.lineWidth = w; draw(); x.restore(); x.save(); x.strokeStyle = x.fillStyle = '#24170a'; x.lineWidth = w; draw(); x.restore(); };
  cut(() => x.strokeRect(14, 14, W - 28, H - 28), 4); cut(() => x.strokeRect(23, 23, W - 46, H - 46), 1.4);
  for (const [cx, cy, sx, sy] of [[23, 23, 1, 1], [W - 23, 23, -1, 1], [23, H - 23, 1, -1], [W - 23, H - 23, -1, -1]]) cut(() => { x.beginPath(); x.moveTo(cx, cy + sy * 34); x.bezierCurveTo(cx + sx * 6, cy + sy * 12, cx + sx * 12, cy + sy * 6, cx + sx * 34, cy); x.stroke(); }, 1.8);
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `700 24px Georgia, 'Times New Roman', serif`; cut(() => x.fillText(L('ЗАМОК КЛЕТКИ', 'CAGE LOCK'), W / 2, 40), 1);
  // the window: cut clean through (alpha 0) with an engraved frame; the shear line is marked on both sides
  const wx0 = (WIN.x0 + PW / 2) * kx, wx1 = (WIN.x1 + PW / 2) * kx, wy0 = (PH / 2 - WIN.y1) * ky, wy1 = (PH / 2 - WIN.y0) * ky;
  cut(() => x.strokeRect(wx0 - 7, wy0 - 7, wx1 - wx0 + 14, wy1 - wy0 + 14), 2.4);
  const sy = (PH / 2 - SHEAR) * ky; for (const [ax, d] of [[wx0 - 9, 1], [wx1 + 9, -1]] as const) cut(() => { x.beginPath(); x.moveTo(ax, sy); x.lineTo(ax - d * 11, sy - 6); x.lineTo(ax - d * 11, sy + 6); x.closePath(); x.fill(); }, 1);
  // the maker's stamp, bottom left: a struck roundel (HARD: worn, the name is gone)
  const scx = 92, scy = H - 50; x.save(); x.beginPath(); x.arc(scx, scy, 34, 0, 7); const sg = x.createRadialGradient(scx, scy - 8, 4, scx, scy, 36); sg.addColorStop(0, '#7a5c2c'); sg.addColorStop(1, '#4a3618'); x.fillStyle = sg; x.fill(); x.restore();
  cut(() => { x.beginPath(); x.arc(scx, scy, 34, 0, 7); x.stroke(); x.beginPath(); x.arc(scx, scy, 29, 0, 7); x.stroke(); }, 1.6);
  if (t) { cut(() => makerEmblem(x, t.maker, scx, scy, 17), 2.6);
    if (!t.worn) { x.font = `700 15px Georgia, serif`; x.textAlign = 'left'; cut(() => x.fillText(L(MAKERS[t.maker][0], MAKERS[t.maker][1]), scx + 44, scy - 9), 1); }
    x.font = `600 13px 'IBM Plex Mono', Menlo, monospace`; x.textAlign = 'left'; cut(() => x.fillText(`№ ${t.serial}`, scx + 44, scy + 12), 1);
    if (t.worn) { x.save(); x.globalAlpha = .55; for (let i = 0; i < 26; i++) { x.strokeStyle = r() < .5 ? 'rgba(200,170,110,.6)' : 'rgba(30,20,10,.5)'; x.lineWidth = 1 + r() * 2; x.beginPath(); const a = r() * 7, l = 6 + r() * 20, px = scx + (r() - .5) * 60, py = scy + (r() - .5) * 60; x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); } x.restore(); } }
  x.font = `600 13px Georgia, serif`; x.textAlign = 'right'; cut(() => x.fillText(L('ПОПЫТКИ', 'TRIES'), W - 158, H - 50), 1);
  x.clearRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
  return textTex(cv);
}

/** machined metal: fine horizontal brushing on a clean base (no patina), shared by every cut face */
let brushedTex: T.Texture | null = null;
function brushed() {
  if (brushedTex) return brushedTex; const W = 512, H = 128, cv = hiCanvas(W, H), x = ctx2d(cv), r = rng(7); x.fillStyle = '#d8d8d8'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 900; i++) { const v = 150 + Math.floor(r() * 105); x.fillStyle = `rgba(${v},${v},${v},${.25 + r() * .35})`; x.fillRect(r() * W - 60, r() * H, 40 + r() * 260, .6 + r() * .8); }
  brushedTex = textTex(cv); brushedTex.wrapS = brushedTex.wrapT = T.RepeatWrapping; brushedTex.colorSpace = T.SRGBColorSpace; return brushedTex;
}
const machined = (color: string, rough = .3) => new T.MeshStandardMaterial({color, map: brushed(), metalness: 1, roughness: rough, envMapIntensity: 1.25});
/** a helical spring of unit height (scaled in y every frame) */
class Helix extends T.Curve<T.Vector3> { constructor(private r: number, private turns: number) { super(); }
  getPoint(t: number, o = new T.Vector3()) { const a = t * this.turns * Math.PI * 2; return o.set(Math.cos(a) * this.r, t, Math.sin(a) * this.r); } }

export class CodeLock {
  group = new T.Group(); clues = new T.Group(); enabled = false; task: LockTask | null = null;
  sounds: {click?: () => void; turn?: () => void; lever?: () => void; unlock?: () => void; jam?: () => void} = {};
  onResult: (ok: boolean, why: 'WRONG' | 'OK') => void = () => {}; onWrong: (left: number, why: 'ORDER' | 'TRAP' | 'STUCK') => void = () => {};
  onNote: (what: 'STUCK' | 'EASED' | 'DROPPED' | 'SET') => void = () => {};
  set: boolean[] = []; stuck = -1; eased = false; private step = 0;
  private body = new T.Group(); private shackle = new T.Group(); private pins = new T.Group(); private pick = new T.Group(); private wrench = new T.Group();
  private drivers: T.Group[] = []; private keys: T.Mesh[] = []; private springs: T.Mesh[] = []; private lift: number[] = []; private bump: number[] = [];
  private lamps: T.Mesh[] = []; private controls: {id: string; root: T.Object3D}[] = []; private open = 0; private jam = 0; private tries = 3; private done = false; private t = 0;
  private plateMat: T.MeshStandardMaterial; private pickX = 0; private pickPush = 0; private ease = 0; private shudder = 0;
  private mats: Record<PinColor, T.Material>; private ringMat: T.Material; private ringMatB: T.Material; private hi: boolean;
  constructor(hi: boolean) {
    this.hi = hi;
    const brass = metal('#8a6a36', {rough: .38, metalness: .9, repeat: 2}), dark = metal('#2b2420', {rough: .6, metalness: .8}), steel = metal('#8d8a85', {rough: .3, metalness: 1});
    this.mats = {steel: metal('#c4c8ce', {rough: .25, metalness: 1}), brass: metal('#d8ae4e', {rough: .3, metalness: 1}), copper: metal('#c46a3a', {rough: .3, metalness: 1}), black: metal('#1c1816', {rough: .35, metalness: .6})};
    this.ringMat = new T.MeshStandardMaterial({color: '#140c06', roughness: .8}); this.ringMatB = new T.MeshStandardMaterial({color: '#d8ae4e', roughness: .4, metalness: 1});
    this.group.add(this.body);
    const caseM = new T.Mesh(new RoundedBoxGeometry(.3, .22, .05, 4, .014), ironPlate(.6, '#4a3e34')); caseM.position.z = -.012; this.body.add(caseM);
    this.plateMat = new T.MeshStandardMaterial({map: plateTexture(null), roughness: .42, metalness: .78, envMapIntensity: 1.1, alphaTest: .5});
    const face = new T.Mesh(new T.PlaneGeometry(PW, PH), this.plateMat); face.position.z = .0305; this.body.add(face);
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const b = new T.Mesh(new T.SphereGeometry(.0065, 12, 8), brass); b.position.set(sx * .128, sy * .088, .033); b.scale.z = .5; this.body.add(b); }
    // the cutaway behind the window: dark chambers, the brass plug with its keyway, a sheet of glass
    const ww = WIN.x1 - WIN.x0, wh = WIN.y1 - WIN.y0, wcx = (WIN.x0 + WIN.x1) / 2;
    const back = new T.Mesh(new T.PlaneGeometry(ww, wh), new T.MeshStandardMaterial({color: '#0c0907', roughness: 1})); back.position.set(wcx, (WIN.y0 + WIN.y1) / 2, .0135); this.body.add(back);
    const glass = new T.Mesh(new T.PlaneGeometry(ww, wh), new T.MeshStandardMaterial({color: '#ffffff', transparent: true, opacity: .06, roughness: .04, metalness: .1, envMapIntensity: 2, depthWrite: false}));
    glass.position.set(wcx, (WIN.y0 + WIN.y1) / 2, .029); glass.renderOrder = 3; this.body.add(glass);
    this.pins.position.z = .021; this.body.add(this.pins);
    // a bezel closes the gap between the case and the raised face
    for (const [w, h, x0, y0] of [[PW, .008, 0, PH / 2 - .004], [PW, .008, 0, -PH / 2 + .004], [.008, PH, PW / 2 - .004, 0], [.008, PH, -PW / 2 + .004, 0]]) { const f = new T.Mesh(new T.BoxGeometry(w, h, .018), brass); f.position.set(x0, y0, .0215); this.body.add(f); }
    // the hook pick: a long blade in the keyway, its grip out of the right flank
    const blade = new T.Mesh(new T.BoxGeometry(.2, .0016, .0035), steel); blade.position.x = .1; this.pick.add(blade);
    const hook = new T.Mesh(new T.BoxGeometry(.0024, .0055, .004), steel); hook.position.set(.001, .0034, 0); this.pick.add(hook);
    const grip = new T.Mesh(new RoundedBoxGeometry(.07, .011, .009, 2, .004), metal('#2a1612', {rough: .7, metalness: .1})); grip.position.x = .23; this.pick.add(grip);
    this.pick.position.set(0, KEYWAY - .0022, .021); this.body.add(this.pick);
    // the tension wrench: a short L at the left mouth of the keyway; tapping it eases the tension
    const wa = new T.Mesh(new T.BoxGeometry(.03, .0028, .0045), steel); wa.position.set(.015, 0, 0); this.wrench.add(wa);
    const wb = new T.Mesh(new T.BoxGeometry(.0045, .06, .0045), steel); wb.position.set(0, -.03, .004); this.wrench.add(wb);
    const wt = new T.Mesh(new RoundedBoxGeometry(.014, .026, .01, 2, .004), metal('#5e0b07', {rough: .45, metalness: .3})); wt.position.set(0, -.064, .004); this.wrench.add(wt);
    const whit = new T.Mesh(new T.BoxGeometry(.05, .09, .03), new T.MeshBasicMaterial({visible: false})); whit.position.set(0, -.04, .01); whit.userData.id = 'ease'; this.wrench.add(whit); this.controls.push({id: 'ease', root: wt});
    this.wrench.position.set(WIN.x0 - .022, KEYWAY + .0034, .034); this.body.add(this.wrench);
    // shackle + straps + lamps
    const u = new T.Mesh(new T.TorusGeometry(.085, .011, 14, 40, Math.PI), steel); this.shackle.add(u);
    for (const s of [-1, 1]) { const leg = new T.Mesh(new T.CylinderGeometry(.011, .011, .07, 16), steel); leg.position.set(s * .085, -.035, 0); this.shackle.add(leg); }
    this.shackle.position.set(0, .11, -.012); this.body.add(this.shackle);
    for (let k = 0; k < 3; k++) { const lm = new T.Mesh(new T.SphereGeometry(.0072, 16, 10), new T.MeshStandardMaterial({color: '#2a1608', emissive: '#ff9a30', emissiveIntensity: 2, roughness: .3}));
      lm.position.set(.07 + k * .022, -.07, .033); this.body.add(lm); this.lamps.push(lm); }
    for (const s of [-1, 1]) { const strap = new T.Mesh(new T.TorusGeometry(.022, .004, 8, 20), dark); strap.rotation.y = Math.PI / 2; strap.position.set(s * .085, .19, -.03); this.group.add(strap); }
    enableShadows(this.group);
  }

  /** world placement: the lock hangs on the cage door, facing in */
  place(ci: T.Box3 | undefined, floorY: number) { const maxZ = ci?.max.z ?? 1.18; this.group.position.set(.12, floorY + 1.24, maxZ - .05); this.group.rotation.y = Math.PI; }

  private buildPins(t: LockTask) {
    for (const o of [...this.pins.children]) { this.pins.remove(o); o.traverse(k => (k as T.Mesh).geometry?.dispose()); }
    this.drivers = []; this.keys = []; this.springs = []; this.controls = this.controls.filter(c => !c.id.startsWith('pin'));
    const n = t.pins.length, P = pitch(n), seg = this.hi ? 120 : 70, springGeo = new T.TubeGeometry(new Helix(PIN_R * .78, 7), seg, .00075, 5, false);
    const springMat = metal('#a9a7a2', {rough: .3, metalness: 1}), keyMat = metal('#d9ab4c', {rough: .26, metalness: 1});
    const nickel = machined('#c9c4b8', .28), plugM = machined('#d29c42', .3), boreM = machined('#77726a', .4), dark = new T.MeshStandardMaterial({color: '#070504', roughness: 1});
    (boreM as T.MeshStandardMaterial).side = T.DoubleSide;
    const BW = PIN_R * 2.24, FZ = .0062, ww = WIN.x1 - WIN.x0, xs = t.pins.map((_, i) => (i - (n - 1) / 2) * P);
    const face = (m: T.Material, x0: number, x1: number, y0: number, y1: number) => { if (x1 - x0 < 1e-4 || y1 - y0 < 1e-4) return; const f = new T.Mesh(new T.PlaneGeometry(x1 - x0, y1 - y0), m); f.position.set((x0 + x1) / 2, (y0 + y1) / 2, FZ); this.pins.add(f);
      // a bright machined lip along the cut edge
      const lip = new T.Mesh(new T.BoxGeometry(x1 - x0, .0005, .0012), m); lip.position.set((x0 + x1) / 2, y0 + .00025, FZ - .0006); this.pins.add(lip); };
    // cut faces of the housing (above the shear line) and of the plug (below it), drilled through by the pin bores
    const edges = [WIN.x0 - .004, ...xs.flatMap(x => [x - BW / 2, x + BW / 2]), WIN.x1 + .004];
    for (let k = 0; k < edges.length; k += 2) { face(nickel, edges[k], edges[k + 1], SHEAR + .0005, BORE_TOP + .004); face(plugM, edges[k], edges[k + 1], KEYWAY + .004, SHEAR - .0005); }
    face(plugM, WIN.x0 - .004, WIN.x1 + .004, PLUG_Y0, KEYWAY - .004); face(nickel, WIN.x0 - .004, WIN.x1 + .004, WIN.y0 - .004, PLUG_Y0 - .0006);
    face(nickel, WIN.x0 - .004, WIN.x1 + .004, BORE_TOP, WIN.y1 + .004);
    // the keyway: a dark channel with its warded profile edges
    const kwy = new T.Mesh(new T.BoxGeometry(ww + .008, .008, .012), dark); kwy.position.set(0, KEYWAY, 0); this.pins.add(kwy);
    for (const [y, h] of [[KEYWAY + .0032, .0012], [KEYWAY - .0034, .001]] as const) { const w = new T.Mesh(new T.BoxGeometry(ww + .008, h, .004), plugM); w.position.set(0, y, FZ - .004); this.pins.add(w); }
    // spring caps along the top of the bores
    const capM = metal('#8a8579', {rough: .35, metalness: 1});
    t.pins.forEach((p, i) => { const cx = xs[i];
      // the bore: the back half of a drilled hole, through housing and plug
      for (const [y0, y1] of [[SHEAR, BORE_TOP], [KEYWAY + .0036, SHEAR]] as const) { const bore = new T.Mesh(new T.CylinderGeometry(BW / 2, BW / 2, y1 - y0, 28, 1, true, Math.PI / 2, Math.PI), y1 > SHEAR ? boreM : boreM); bore.position.set(cx, (y0 + y1) / 2, 0); this.pins.add(bore); }
      const cap = new T.Mesh(new T.CylinderGeometry(BW / 2, BW / 2, .002, 24), capM); cap.position.set(cx, BORE_TOP - .001, 0); this.pins.add(cap);
      // driver pin: coloured, with its notches; a copper spool is waisted
      const dg = new T.Group(); dg.position.set(cx, 0, 0); this.pins.add(dg);
      const H = DRV_H / 2, prof = p.color === 'copper' ? [[0, -H], [PIN_R * .9, -H], [PIN_R, -H + .0008], [PIN_R, -H + .0035], [PIN_R * .6, -H + .0062], [PIN_R * .6, H - .0085], [PIN_R, H - .0058], [PIN_R, H - .0008], [PIN_R * .9, H], [0, H]]
        : [[0, -H], [PIN_R * .88, -H], [PIN_R, -H + .0009], [PIN_R, H - .0009], [PIN_R * .88, H], [0, H]];
      dg.add(new T.Mesh(new T.LatheGeometry(prof.map(([a, b]) => new T.Vector2(a, b)), 40), this.mats[p.color]));
      for (let k = 0; k < p.notches; k++) { const ring = new T.Mesh(new T.TorusGeometry(PIN_R * 1.02, .0009, 6, 32), p.color === 'black' ? this.ringMatB : this.ringMat); ring.rotation.x = Math.PI / 2;
        ring.position.y = H - .002 - k * .0024; if (p.color === 'copper' && k > 1) ring.scale.setScalar(.6); dg.add(ring); }
      this.drivers.push(dg);
      // key pin: its own length (the bitting), a rounded crown and a bullet nose into the keyway
      const Lk = p.len; const kp = new T.Mesh(new T.LatheGeometry([[0, 0], [PIN_R * .3, .0004], [PIN_R * .8, .0022], [PIN_R, .0042], [PIN_R, Lk - .0007], [PIN_R * .86, Lk], [0, Lk]].map(([a, b]) => new T.Vector2(a, b)), 36), keyMat);
      kp.position.set(cx, KEY_TIP, 0); this.pins.add(kp); this.keys.push(kp);
      const sp = new T.Mesh(springGeo, springMat); sp.position.set(cx, 0, 0); this.pins.add(sp); this.springs.push(sp);
      const hit = new T.Mesh(new T.BoxGeometry(P * .92, WIN.y1 - WIN.y0, .03), new T.MeshBasicMaterial({visible: false})); hit.position.set(cx, (WIN.y0 + WIN.y1) / 2, .012); hit.userData.id = `pin${i}`; this.pins.add(hit);
      this.controls.push({id: `pin${i}`, root: dg}); });
    this.lift = t.pins.map(p => KEY_TIP + p.len); this.bump = t.pins.map(() => 0);
  }

  setTask(t: LockTask, _seed?: number) {
    this.task = t; this.tries = t.tries; this.done = false; this.open = 0; this.jam = 0; this.stuck = -1; this.eased = false; this.step = 0; this.set = t.pins.map(() => false);
    this.plateMat.map?.dispose(); this.plateMat.map = plateTexture(t); this.plateMat.needsUpdate = true;
    this.shackle.position.y = .11; this.shackle.rotation.y = 0; this.body.rotation.z = 0; this.pickX = 0;
    this.buildPins(t); this.paintLamps();
  }
  reset() { if (this.task) this.setTask(this.task); }
  private paintLamps() { this.lamps.forEach((l, k) => { const m = l.material as T.MeshStandardMaterial, exists = k < (this.task?.tries ?? 3); l.visible = exists;
    m.emissive.set(this.done && this.open > 0 ? '#40ff70' : '#ff9a30'); m.emissiveIntensity = k < this.tries && exists ? 2.2 : 0; }); }

  center() { return new T.Vector3(0, -.005, 0).applyMatrix4(this.group.matrixWorld); }
  hits(ray: T.Raycaster) { return ray.intersectObject(this.group, true)[0] || null; }
  controlScreen(id: string, camera: T.Camera) { const c = this.controls.find(k => k.id === id)!; const v = new T.Vector3().setFromMatrixPosition(c.root.matrixWorld).project(camera); return {x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight}; }
  get triesLeft() { return this.tries; }

  /** a tap on the lock; returns the control id or null */
  tap(ray: T.Raycaster): string | null {
    const all = ray.intersectObject(this.group, true), id = all.find(k => k.object.userData.id)?.object.userData.id as string | undefined; if (!id) return all[0] ? 'body' : null;
    if (!this.enabled || this.done || !this.task) { this.sounds.jam?.(); return id; }
    if (id === 'ease') this.easeWrench(); else this.liftPin(+id.slice(3));
    return id;
  }
  private easeWrench() {
    this.ease = 1; this.sounds.lever?.();
    if (this.stuck >= 0) { this.eased = true; this.onNote('EASED'); return; }
    if (this.set.some(Boolean)) { this.dropAll(); this.onNote('DROPPED'); } // tension let go for nothing: the set pins fall (no try lost)
  }
  private liftPin(i: number) {
    const t = this.task!, p = t.pins[i]; this.pickX = (i - (t.pins.length - 1) / 2) * pitch(t.pins.length); this.pickPush = 1; this.bump[i] = 1; this.sounds.turn?.();
    if (this.set[i]) return;
    if (p.color === 'black') return this.fail('TRAP');
    if (this.stuck >= 0) { if (i === this.stuck && this.eased) { this.stuck = -1; this.eased = false; return this.setPin(i); } return this.fail('STUCK'); }
    if (i !== t.order[this.step]) return this.fail('ORDER');
    if (p.color === 'copper') { this.stuck = i; this.eased = false; this.shudder = 1; setTimeout(() => this.sounds.jam?.(), 90); this.onNote('STUCK'); return; }
    this.setPin(i);
  }
  private setPin(i: number) {
    this.set[i] = true; this.step++; setTimeout(() => this.sounds.click?.(), 110); this.onNote('SET');
    if (this.step >= this.task!.order.length) { this.done = true; this.enabled = false; setTimeout(() => { this.open = .001; this.sounds.unlock?.(); this.paintLamps(); this.onResult(true, 'OK'); }, 420); }
  }
  private dropAll() { this.set = this.set.map(() => false); this.step = 0; this.stuck = -1; this.eased = false; setTimeout(() => this.sounds.jam?.(), 120); }
  private fail(why: 'ORDER' | 'TRAP' | 'STUCK') {
    this.dropAll(); this.tries--; this.jam = 1; this.paintLamps();
    if (this.tries <= 0) { this.done = true; this.enabled = false; this.onResult(false, 'WRONG'); } else this.onWrong(this.tries, why);
  }
  /** time ran out: the lock stays shut */
  expire() { this.done = true; this.enabled = false; }

  update(dt: number) {
    this.t += dt; if (!this.task) return;
    const k = 1 - Math.exp(-dt * 18);
    for (let i = 0; i < this.drivers.length; i++) {
      const len = this.task.pins[i].len, rest = KEY_TIP + len;
      // where the driver should sit: on its key pin, just above the shear line (set), or caught on its waist (stuck spool)
      const target = this.set[i] ? SHEAR + .0006 : this.stuck === i ? SHEAR - .0052 : rest; this.lift[i] += (target - this.lift[i]) * k;
      this.bump[i] = Math.max(0, this.bump[i] - dt * 4.2); const b = Math.sin(this.bump[i] * Math.PI) * (SHEAR - rest + .0016);
      const keyTop = Math.max(rest + b, this.stuck === i ? this.lift[i] : rest); this.keys[i].position.y = keyTop - len;
      const drvBottom = Math.max(keyTop, this.lift[i]), dg = this.drivers[i];
      dg.position.y = drvBottom + DRV_H / 2; dg.rotation.z = this.stuck === i ? .09 + Math.sin(this.t * 40) * .03 * this.shudder : 0;
      const sp = this.springs[i], s0 = drvBottom + DRV_H; sp.position.y = s0; sp.scale.y = Math.max(.002, BORE_TOP - .002 - s0);
    }
    // the pick slides under the chosen pin and flicks up; the wrench leans under tension and relaxes when eased
    this.pickPush = Math.max(0, this.pickPush - dt * 5); this.pick.position.x += (this.pickX - this.pick.position.x) * (1 - Math.exp(-dt * 22)); this.pick.rotation.z = -Math.sin(this.pickPush * Math.PI) * .045;
    this.ease = Math.max(0, this.ease - dt * 2.5); this.shudder = Math.max(0, this.shudder - dt * 1.5);
    const tension = this.done && this.open > 0 ? .5 * Math.min(1, this.open * 3) : this.eased ? -.02 : .06;
    this.wrench.rotation.z += (tension - Math.sin(this.ease * Math.PI) * .12 + Math.sin(this.t * 50) * .01 * this.shudder - this.wrench.rotation.z) * (1 - Math.exp(-dt * 14));
    if (this.open > 0) { this.open = Math.min(1, this.open + dt * 1.6); const e = 1 - Math.pow(1 - this.open, 3); this.shackle.position.y = .11 + .045 * e; this.shackle.rotation.y = e * 1.2; this.body.rotation.z = Math.sin(this.open * 9) * .05 * (1 - this.open); }
    if (this.jam > 0) { this.jam = Math.max(0, this.jam - dt * 2); this.body.position.x = Math.sin(this.jam * 60) * .004 * this.jam; }
  }
}
