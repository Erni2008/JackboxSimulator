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

/** the maker's plate riveted to the frame: emblem, name (gone on HARD), serial */
function stampTexture(t: LockTask | null) {
  const W = 512, H = 120, cv = hiCanvas(W, H), x = ctx2d(cv), r = rng(42);
  const base = x.createLinearGradient(0, 0, 0, H); base.addColorStop(0, '#a7843f'); base.addColorStop(1, '#6b4f22'); x.fillStyle = base; x.fillRect(0, 0, W, H);
  x.globalAlpha = .1; for (let i = 0; i < 300; i++) { x.fillStyle = r() < .5 ? '#fff4d0' : '#1a1006'; x.fillRect(0, r() * H, W, .7); } x.globalAlpha = 1;
  for (let i = 0; i < 30; i++) { const gx = r() * W, gy = r() * H, gr = 8 + r() * 30, g = x.createRadialGradient(gx, gy, 0, gx, gy, gr); g.addColorStop(0, `rgba(30,40,20,${.1 + r() * .2})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); }
  const cut = (draw: () => void, w: number) => { x.save(); x.translate(0, 1.4); x.strokeStyle = x.fillStyle = 'rgba(255,232,180,.5)'; x.lineWidth = w; draw(); x.restore(); x.save(); x.strokeStyle = x.fillStyle = '#1e1307'; x.lineWidth = w; draw(); x.restore(); };
  cut(() => x.strokeRect(8, 8, W - 16, H - 16), 3);
  for (const rx of [26, W - 26]) { const g = x.createRadialGradient(rx - 3, H / 2 - 3, 1, rx, H / 2, 12); g.addColorStop(0, '#e8c77a'); g.addColorStop(1, '#4a3414'); x.fillStyle = g; x.beginPath(); x.arc(rx, H / 2, 11, 0, 7); x.fill(); }
  if (t) { cut(() => makerEmblem(x, t.maker, 92, H / 2, 34), 4.5);
    x.textBaseline = 'middle'; x.textAlign = 'left';
    if (!t.worn) { x.font = `700 38px Georgia, 'Times New Roman', serif`; cut(() => x.fillText(L(MAKERS[t.maker][0], MAKERS[t.maker][1]), 148, 46), 1); }
    x.font = `600 26px 'IBM Plex Mono', Menlo, monospace`; cut(() => x.fillText(`№ ${t.serial}`, 150, t.worn ? H / 2 : 88), 1);
    if (t.worn) { for (let i = 0; i < 60; i++) { x.strokeStyle = r() < .5 ? 'rgba(220,190,120,.5)' : 'rgba(30,20,10,.45)'; x.lineWidth = 1 + r() * 2.5; x.beginPath(); const a = r() * 7, l = 8 + r() * 40, px = 40 + r() * 120, py = 10 + r() * 100; x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); } } }
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
  group = new T.Group(); clues = new T.Group(); enabled = false; task: LockTask | null = null;
  sounds: {click?: () => void; turn?: () => void; lever?: () => void; unlock?: () => void; jam?: () => void} = {};
  onResult: (ok: boolean, why: 'WRONG' | 'OK') => void = () => {}; onWrong: (left: number, why: 'ORDER' | 'TRAP' | 'STUCK') => void = () => {};
  onNote: (what: 'STUCK' | 'EASED' | 'DROPPED' | 'SET') => void = () => {};
  set: boolean[] = []; stuck = -1; eased = false; private step = 0;
  private body = new T.Group(); private shackle = new T.Group(); private pins = new T.Group(); private pick = new T.Group(); private wheel = new T.Group();
  private lever = new T.Group(); private bolt = new T.Group(); private boltSpring!: T.Mesh;
  private drivers: T.Group[] = []; private keys: T.Mesh[] = []; private springs: T.Mesh[] = []; private lift: number[] = []; private bump: number[] = [];
  private tokens: T.Mesh[] = []; private controls: {id: string; root: T.Object3D}[] = []; private open = 0; private jam = 0; private tries = 3; private done = false; private t = 0;
  private stampMat: T.MeshStandardMaterial; private pickX = 0; private pickPush = 0; private ease = 0; private shudder = 0; private turn = 0;
  private mats: Record<PinColor, T.Material>; private ringMat: T.Material; private ringMatB: T.Material; private hi: boolean;
  private steel: T.Material; private brass: T.Material; private dark: T.Material; private tokenOn: T.Material; private tokenOff: T.Material;
  constructor(hi: boolean) {
    this.hi = hi;
    const housing = mat('#4b4a47', .46), frame = mat('#3a3937', .5, 1.5); this.steel = mat('#9a958c', .3); this.brass = mat('#b8914a', .32); this.dark = new T.MeshStandardMaterial({color: '#0a0806', roughness: 1});
    this.mats = {steel: mat('#c9c6bf', .24), brass: mat('#c99d4c', .28), copper: mat('#c0693d', .3), black: mat('#24201d', .38)};
    this.ringMat = new T.MeshStandardMaterial({color: '#140c06', roughness: .8}); this.ringMatB = new T.MeshStandardMaterial({color: '#d8ae4e', roughness: .4, metalness: 1});
    this.tokenOn = mat('#d0a858', .25); this.tokenOff = mat('#2a2420', .7);
    this.group.add(this.body);
    // housing: back plate, a heavy frame with a machined front rim, corner screws
    const backP = new T.Mesh(new RoundedBoxGeometry(.31, .25, .012, 3, .005), housing); backP.position.set(0, -.006, -.026); this.body.add(backP);
    const bar = (w: number, h: number, x: number, y: number) => { const b = new T.Mesh(new RoundedBoxGeometry(w, h, .04, 3, .004), frame); b.position.set(x, y, -.01); this.body.add(b); };
    bar(.31, .02, 0, IN.y1 + .01); bar(.31, .032, 0, IN.y0 - .016); bar(.02, IN.y1 - IN.y0, IN.x0 - .01, (IN.y0 + IN.y1) / 2); bar(.02, IN.y1 - IN.y0, IN.x1 + .01, (IN.y0 + IN.y1) / 2);
    for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) { const s = screw(this.steel, this.dark, .0062); s.position.set(sx * .145, sy > 0 ? IN.y1 + .01 : IN.y0 - .016, .0105); this.body.add(s); }
    // the maker's plate on the lower bar, the try tokens beside it
    this.stampMat = new T.MeshStandardMaterial({map: stampTexture(null), metalness: .85, roughness: .38, envMapIntensity: 1.2});
    const stamp = new T.Mesh(new T.PlaneGeometry(.11, .026), this.stampMat); stamp.position.set(-.07, IN.y0 - .016, .0103); this.body.add(stamp);
    for (let k = 0; k < 3; k++) { const tk = new T.Mesh(new T.CylinderGeometry(.0058, .0062, .004, 24), this.tokenOn); tk.rotation.x = Math.PI / 2; tk.position.set(.07 + k * .02, IN.y0 - .016, .0118); this.body.add(tk); this.tokens.push(tk); }
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
    for (const [sx, sy] of [[-.112, .066], [.118, .03]]) { const s = screw(this.steel, this.dark, .0075); s.position.set(sx, sy, -.019); this.body.add(s); }
    // the hook pick: a long blade through the wheel's keyway, its grip out to the left
    const blade = new T.Mesh(new T.BoxGeometry(.2, .0018, .0032), this.steel); blade.position.x = -.1; this.pick.add(blade);
    const hook = new T.Mesh(new T.BoxGeometry(.0026, .006, .0032), this.steel); hook.position.set(-.0012, .0036, 0); hook.rotation.z = -.25; this.pick.add(hook);
    const grip = new T.Mesh(new RoundedBoxGeometry(.06, .012, .009, 2, .004), mat('#3a1d14', .7)); grip.position.x = -.225; this.pick.add(grip);
    this.pick.position.set(0, PC - .001, CH); this.body.add(this.pick);
    // shackle
    const u = new T.Mesh(new T.TorusGeometry(.085, .011, 16, 48, Math.PI), this.steel); this.shackle.add(u);
    for (const s of [-1, 1]) { const leg = new T.Mesh(new T.CylinderGeometry(.011, .011, .07, 20), this.steel); leg.position.set(s * .085, -.035, 0); this.shackle.add(leg); }
    this.shackle.position.set(0, IN.y1 + .045, -.014); this.body.add(this.shackle);
    for (const s of [-1, 1]) { const strap = new T.Mesh(new T.TorusGeometry(.022, .004, 8, 20), frame); strap.rotation.y = Math.PI / 2; strap.position.set(s * .085, .2, -.03); this.group.add(strap); }
    enableShadows(this.group);
  }

  /** world placement: the lock hangs on the cage door, facing in */
  place(ci: T.Box3 | undefined, floorY: number) { const maxZ = ci?.max.z ?? 1.18; this.group.position.set(.12, floorY + 1.24, maxZ - .05); this.group.rotation.y = Math.PI; }

  private buildPins(t: LockTask) {
    for (const o of [...this.pins.children]) { this.pins.remove(o); o.traverse(k => (k as T.Mesh).geometry?.dispose()); }
    this.drivers = []; this.keys = []; this.springs = []; this.controls = this.controls.filter(c => !c.id.startsWith('pin'));
    const n = t.pins.length, P = pitch(n), xs = t.pins.map((_, i) => PX0 + (i - (n - 1) / 2) * P), CW = .0205, seg = this.hi ? 140 : 80;
    const springGeo = new T.TubeGeometry(new Helix(.0066, 9), seg, .00085, 6, false), springMat = mat('#aeaaa2', .28);
    const housing = mat('#52504c', .44), back = mat('#2a2927', .6), plugCut = mat('#c29548', .3);
    // the channel block: ribs between the channels, the back wall of each channel, machined chamfers
    const edges = [xs[0] - P / 2 - .008, ...xs.flatMap(x => [x - CW / 2, x + CW / 2]), xs[n - 1] + P / 2 + .008];
    for (let k = 0; k < edges.length; k += 2) { const w = edges[k + 1] - edges[k]; if (w <= 0) continue;
      const rib = new T.Mesh(new T.BoxGeometry(w, TOPB - SHEAR - .0012, .024), housing); rib.position.set((edges[k] + edges[k + 1]) / 2, (TOPB + SHEAR + .0012) / 2, -.009); this.pins.add(rib);
      const ch = new T.Mesh(new T.BoxGeometry(w, .0012, .0012), mat('#8d877d', .25)); ch.position.set((edges[k] + edges[k + 1]) / 2, SHEAR + .0018, .0033); this.pins.add(ch); }
    for (const x of xs) { const bw = new T.Mesh(new T.PlaneGeometry(CW, TOPB - SHEAR), back); bw.position.set(x, (TOPB + SHEAR) / 2, CH - PIN_R - .0015); this.pins.add(bw); }
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
      dg.add(new T.Mesh(new T.LatheGeometry(prof.map(([a, b]) => new T.Vector2(a, b)), 44), this.mats[p.color]));
      for (let k = 0; k < p.notches; k++) { const ring = new T.Mesh(new T.TorusGeometry(R * 1.01, .00085, 6, 36), p.color === 'black' ? this.ringMatB : this.ringMat); ring.rotation.x = Math.PI / 2;
        ring.position.y = H - .0062 - k * .0024; if (p.color === 'copper' && k > 0) ring.scale.setScalar(.6); dg.add(ring); }
      this.drivers.push(dg);
      // key pin: hardened steel, its own length, a bullet nose into the keyway
      const Lk = p.len + .004, kr = R * .9, kp = new T.Mesh(new T.LatheGeometry([[0, 0], [kr * .3, .0004], [kr * .75, .0022], [kr, .0046], [kr, Lk - .0007], [kr * .88, Lk], [0, Lk]].map(([a, b]) => new T.Vector2(a, b)), 40), this.mats.steel);
      kp.position.set(cx, KEY_TIP, CH); kp.userData.len = Lk; this.pins.add(kp); this.keys.push(kp);
      const sp = new T.Mesh(springGeo, springMat); sp.position.set(cx, 0, CH); this.pins.add(sp); this.springs.push(sp);
      const hit = new T.Mesh(new T.BoxGeometry(P * .95, TOPB - PC + .01, .04), new T.MeshBasicMaterial({visible: false})); hit.position.set(cx, (TOPB + PC) / 2, .004); hit.userData.id = `pin${i}`; this.pins.add(hit);
      this.controls.push({id: `pin${i}`, root: dg}); });
    this.lift = this.keys.map(k => KEY_TIP + k.userData.len); this.bump = t.pins.map(() => 0);
  }

  setTask(t: LockTask, _seed?: number) {
    this.task = t; this.tries = t.tries; this.done = false; this.open = 0; this.jam = 0; this.stuck = -1; this.eased = false; this.step = 0; this.set = t.pins.map(() => false); this.turn = 0;
    this.stampMat.map?.dispose(); this.stampMat.map = stampTexture(t); this.stampMat.needsUpdate = true;
    this.shackle.position.y = IN.y1 + .045; this.shackle.rotation.y = 0; this.body.rotation.z = 0; this.pickX = PX0;
    this.buildPins(t); this.paintTokens();
  }
  reset() { if (this.task) this.setTask(this.task); }
  private paintTokens() { this.tokens.forEach((tk, k) => { const exists = k < (this.task?.tries ?? 3); tk.visible = exists; tk.material = k < this.tries ? this.tokenOn : this.tokenOff; }); }

  center() { return new T.Vector3(0, -.006, 0).applyMatrix4(this.group.matrixWorld); }
  hits(ray: T.Raycaster) { return ray.intersectObject(this.group, true)[0] || null; }
  controlScreen(id: string, camera: T.Camera) { const c = this.controls.find(k => k.id === id)!; const v = new T.Vector3().setFromMatrixPosition(c.root.matrixWorld).project(camera); return {x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight}; }
  get triesLeft() { return this.tries; }

  /** a tap on the lock; returns the control id or null */
  tap(ray: T.Raycaster): string | null {
    const all = ray.intersectObject(this.group, true), id = all.find(k => k.object.userData.id)?.object.userData.id as string | undefined; if (!id) return all[0] ? 'body' : null;
    if (!this.enabled || this.done || !this.task) { this.sounds.jam?.(); return id; }
    if (id === 'ease') this.easeWheel(); else this.liftPin(+id.slice(3));
    return id;
  }
  private easeWheel() {
    this.ease = 1; this.sounds.lever?.();
    if (this.stuck >= 0) { this.eased = true; this.onNote('EASED'); return; }
    if (this.set.some(Boolean)) { this.dropAll(); this.onNote('DROPPED'); } // torque let go for nothing: the set pins fall (no try lost)
  }
  private liftPin(i: number) {
    const t = this.task!, p = t.pins[i], n = t.pins.length; this.pickX = PX0 + (i - (n - 1) / 2) * pitch(n); this.pickPush = 1; this.bump[i] = 1; this.sounds.turn?.();
    if (this.set[i]) return;
    if (p.color === 'black') return this.fail('TRAP');
    if (this.stuck >= 0) { if (i === this.stuck && this.eased) { this.stuck = -1; this.eased = false; return this.setPin(i); } return this.fail('STUCK'); }
    if (i !== t.order[this.step]) return this.fail('ORDER');
    if (p.color === 'copper') { this.stuck = i; this.eased = false; this.shudder = 1; setTimeout(() => this.sounds.jam?.(), 90); this.onNote('STUCK'); return; }
    this.setPin(i);
  }
  private setPin(i: number) {
    this.set[i] = true; this.step++; setTimeout(() => this.sounds.click?.(), 110); this.onNote('SET');
    if (this.step >= this.task!.order.length) { this.done = true; this.enabled = false; setTimeout(() => { this.open = .001; this.sounds.unlock?.(); this.paintTokens(); this.onResult(true, 'OK'); }, 420); }
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
      const target = this.set[i] ? SHEAR + .0007 : this.stuck === i ? SHEAR - .0062 : rest; this.lift[i] += (target - this.lift[i]) * k;
      this.bump[i] = Math.max(0, this.bump[i] - dt * 4.2); const b = Math.sin(this.bump[i] * Math.PI) * (SHEAR - rest + .0018);
      const keyTop = Math.max(rest + b, this.stuck === i ? this.lift[i] : rest); this.keys[i].position.y = keyTop - len;
      const drvBottom = Math.max(keyTop, this.lift[i]), dg = this.drivers[i];
      dg.position.y = drvBottom + DRV_H / 2; dg.rotation.z = this.stuck === i ? .08 + Math.sin(this.t * 40) * .03 * this.shudder : 0;
      const sp = this.springs[i], s0 = drvBottom + DRV_H; sp.position.y = s0; sp.scale.y = Math.max(.002, TOPB - s0);
    }
    // the pick slides under the chosen pin and flicks up
    this.pickPush = Math.max(0, this.pickPush - dt * 5); this.pick.position.x += (this.pickX - this.pick.position.x) * (1 - Math.exp(-dt * 22)); this.pick.rotation.z = Math.sin(this.pickPush * Math.PI) * .03;
    // torque on the wheel: a slight lean while picking, a twitch when eased, a full quarter turn when open
    this.ease = Math.max(0, this.ease - dt * 2.5); this.shudder = Math.max(0, this.shudder - dt * 1.5);
    const tq = this.open > 0 ? Math.PI / 2 * (1 - Math.pow(1 - Math.min(1, this.open * 1.4), 3)) : this.eased ? -.02 : .05;
    this.turn += (tq - Math.sin(this.ease * Math.PI) * .18 + Math.sin(this.t * 50) * .015 * this.shudder - this.turn) * (1 - Math.exp(-dt * (this.open > 0 ? 30 : 14)));
    this.wheel.rotation.x = this.turn;
    // cam → lever → bolt: the bolt draws back as the plug turns
    const draw = Math.max(0, Math.min(1, this.turn / (Math.PI / 2))); this.lever.rotation.z = draw * .55; this.bolt.position.x = -draw * .028; this.boltSpring.scale.set(1, .036 * (1 - draw * .5), 1);
    if (this.open > 0) { this.open = Math.min(1, this.open + dt * 1.2); const e = Math.max(0, (this.open - .4) / .6), ee = 1 - Math.pow(1 - e, 3); this.shackle.position.y = IN.y1 + .045 + .045 * ee; this.shackle.rotation.y = ee * 1.2; }
    if (this.jam > 0) { this.jam = Math.max(0, this.jam - dt * 2); this.body.position.x = Math.sin(this.jam * 60) * .004 * this.jam; }
  }
}
