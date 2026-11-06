// THE HOST'S SUITCASE — mechanism I, WIRE MAZE (view + practice generator).
// In a room the layout comes from the server (shared/.../WireMaze.java) and only the server knows the answer; the
// practice generator below mirrors the same rules for offline play. Fictional device, invented for the game.
import * as T from 'three';
import {L} from '../i18n';
import {chapters, PW, type Ink} from './notebook';
import {mergeStatic} from './merge';


export type Seal = 'CIRCLE' | 'TRIANGLE' | 'SQUARE' | 'DIAMOND' | 'CROSS' | 'STAR' | 'CRESCENT' | 'HEXAGON';
export const SEALS: Seal[] = ['CIRCLE', 'TRIANGLE', 'SQUARE', 'DIAMOND', 'CROSS', 'STAR', 'CRESCENT', 'HEXAGON'];
export const SEAL_LETTER: Record<Seal, string> = {CIRCLE: 'Θ', TRIANGLE: 'Δ', SQUARE: 'Π', DIAMOND: 'Ξ', CROSS: 'Φ', STAR: 'Σ', CRESCENT: 'Λ', HEXAGON: 'Ω'};
const SEAL_NAME: Record<Seal, () => string> = {CIRCLE: () => L('Круг', 'Circle'), TRIANGLE: () => L('Треугольник', 'Triangle'), SQUARE: () => L('Квадрат', 'Square'), DIAMOND: () => L('Ромб', 'Diamond'),
  CROSS: () => L('Крест', 'Cross'), STAR: () => L('Звезда', 'Star'), CRESCENT: () => L('Полумесяц', 'Crescent'), HEXAGON: () => L('Шестигранник', 'Hexagon')};
const LETTERS = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Θ', 'Λ', 'Ξ', 'Π', 'Σ', 'Φ', 'Ψ', 'Ω'];
export const WIRE_COLORS = ['#b8231a', '#d9b21c', '#2350a8', '#e4ddcc', '#2f7a34', '#2a2826'];
export interface WireLayout { n: number; seal: Seal; redirect: boolean; letters: string[]; end: number[]; color: number[]; layer: number[]; bends: number[][] }
export type Diff = 'EASY' | 'NORMAL' | 'HARD';

const rng = (s: number) => () => (s = (s * 16807 + 11) % 2147483647) / 2147483647;
const shuffle = <X>(a: X[], r: () => number) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const slotAng = (i: number, n: number) => (150 - i * 120 / (n - 1)) * Math.PI / 180, endAng = (k: number, n: number) => (210 + (k - 1) * 120 / (n - 1)) * Math.PI / 180;

/** practice only (rooms use the server's layout): same rules as WireMaze.java */
export function makeWireLayout(seed: number, d: Diff): WireLayout {
  const r = rng(Math.abs(seed * 7919 + 17) % 2147483646 + 1), n = d === 'EASY' ? 10 : d === 'NORMAL' ? 12 : 14, redirect = d !== 'EASY', cols = d === 'EASY' ? 6 : d === 'NORMAL' ? 5 : 4;
  const seal = SEALS[Math.floor(r() * 8)], pool = shuffle(LETTERS.filter(l => l !== SEAL_LETTER[seal]), r), letters = shuffle([...pool.slice(0, n - 1), SEAL_LETTER[seal]], r), key = letters.indexOf(SEAL_LETTER[seal]);
  const want = redirect && r() < .5; let end: number[];
  for (;;) { end = shuffle(Array.from({length: n}, (_, i) => i + 1), r); const k = end[key], m3 = k % 3 === 0; if (redirect && m3 && k + 1 > n) continue; if (redirect && m3 !== want) continue; if (Math.abs(Math.cos(slotAng(key, n)) - Math.cos(endAng(k, n))) < .12) continue; break; }
  const color = Array.from({length: n}, () => Math.floor(r() * cols)), layer = shuffle(Array.from({length: n}, (_, i) => i), r);
  const bends = Array.from({length: n}, () => { const b: number[] = []; for (let k = 0; k < 2; k++) { const a = r() * Math.PI * 2, rad = .18 + Math.sqrt(r()) * .5; b.push(Math.cos(a) * rad, Math.sin(a) * rad * .8); } return b; });
  const l: WireLayout = {n, seal, redirect, letters, end, color, layer, bends}; const s = solveWires(l);
  if (!color.some((c, i) => i !== s && c === color[s])) color[(s + 1) % n] = color[s]; return l;
}
/** chapter I applied to a layout (practice judging) */
export function solveWires(l: WireLayout) { const s = l.letters.indexOf(SEAL_LETTER[l.seal]), e = l.end[s]; if (l.redirect && e % 3 === 0) return l.end.indexOf(e + 1); return s; }

/** a seal drawn as a stamped shape (panel hub and notebook table share it) */
export function drawSeal(x: CanvasRenderingContext2D, s: Seal, cx: number, cy: number, r: number) {
  x.save(); x.translate(cx, cy); x.beginPath();
  const poly = (k: number, rot: number, rr = r) => { for (let i = 0; i < k; i++) { const a = rot + i * Math.PI * 2 / k; i ? x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : x.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } x.closePath(); };
  if (s === 'CIRCLE') x.arc(0, 0, r * .9, 0, 7); else if (s === 'TRIANGLE') poly(3, -Math.PI / 2); else if (s === 'SQUARE') poly(4, Math.PI / 4, r * .95); else if (s === 'DIAMOND') { x.moveTo(0, -r); x.lineTo(r * .62, 0); x.lineTo(0, r); x.lineTo(-r * .62, 0); x.closePath(); }
  else if (s === 'CROSS') { const t = r * .32; x.rect(-t, -r, 2 * t, 2 * r); x.rect(-r, -t, 2 * r, 2 * t); } else if (s === 'STAR') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; i ? x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : x.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } x.closePath(); }
  else if (s === 'CRESCENT') { x.arc(0, 0, r * .9, Math.PI * .3, Math.PI * 1.7); x.arc(r * .38, 0, r * .66, Math.PI * 1.62, Math.PI * .38, true); x.closePath(); } else poly(6, 0);
  x.fill('nonzero'); x.restore();
}

// ---------------------------------------------------------------------------------------------- the panel
const PR = .066; // panel radius (m) inside bay I
export class WireMazeView {
  readonly group = new T.Group(); layout: WireLayout | null = null; cut = new Set<number>(); neutral = false;
  private wires: {mesh: T.Mesh; shadow: T.Mesh; curve: T.CatmullRomCurve3; h: number}[] = []; private mats: T.Material[] = []; private geos: T.BufferGeometry[] = []; private faceTex: T.CanvasTexture | null = null; private sealTex: T.CanvasTexture | null = null;
  private flash = 0; private sparks: {m: T.Mesh; v: T.Vector3; t: number}[] = [];
  build(l: WireLayout, cut: number[] = []) {
    this.clear(); this.layout = l; this.cut = new Set(cut); this.neutral = false;
    const steel = new T.MeshStandardMaterial({color: '#2b2926', metalness: .8, roughness: .45}), brass = new T.MeshStandardMaterial({color: '#b08a48', metalness: 1, roughness: .32}); this.mats.push(steel, brass);
    const disc = new T.Mesh(this.g(new T.CylinderGeometry(PR, PR, .003, 48)), steel); disc.position.y = .0015; this.group.add(disc);
    const rim = new T.Mesh(this.g(new T.TorusGeometry(PR, .0028, 8, 56)), brass); rim.rotation.x = Math.PI / 2; rim.position.y = .003; this.group.add(rim);
    // face: engraved letters (top), numbers (bottom), the seal on the hub, a "cut only here" band hint
    const S = 1024; const c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d')!; const C = S / 2, k = S / 2 / PR;
    const g = x.createRadialGradient(C, C, 0, C, C, C); g.addColorStop(0, '#3a3732'); g.addColorStop(1, '#22201d'); x.fillStyle = g; x.beginPath(); x.arc(C, C, C, 0, 7); x.fill();
    x.strokeStyle = 'rgba(200,170,110,.25)'; x.lineWidth = 3; x.setLineDash([10, 12]); x.beginPath(); x.arc(C, C, C * .64, 0, 7); x.stroke(); x.setLineDash([]);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let i = 0; i < l.n; i++) { const a = slotAng(i, l.n), lx = C + Math.cos(a) * C * .94 * .99, ly = C - Math.sin(a) * C * .94; x.font = `bold ${Math.round(S * .056)}px "Libre Caslon Text", Georgia, serif`; x.fillStyle = '#f0dcae'; x.fillText(l.letters[i], C + Math.cos(a) * C * .875, C - Math.sin(a) * C * .875); void lx; void ly; }
    for (let k2 = 1; k2 <= l.n; k2++) { const a = endAng(k2, l.n); x.font = `bold ${Math.round(S * .048)}px "IBM Plex Mono", monospace`; x.fillStyle = k2 % 3 === 0 && l.redirect ? '#f0c27a' : '#e6d3a4'; x.fillText(String(k2), C + Math.cos(a) * C * .875, C - Math.sin(a) * C * .875); }
    x.fillStyle = '#5a4a32'; x.beginPath(); x.arc(C, C, C * .16, 0, 7); x.fill(); x.fillStyle = '#c9a25a'; drawSeal(x, l.seal, C, C, C * .1); void k;
    this.faceTex = new T.CanvasTexture(c); this.faceTex.colorSpace = T.SRGBColorSpace; this.faceTex.anisotropy = 8;
    const face = new T.Mesh(this.g(new T.CircleGeometry(PR * .995, 64)), new T.MeshStandardMaterial({map: this.faceTex, metalness: .5, roughness: .55})); this.mats.push(face.material as T.Material); face.rotation.x = -Math.PI / 2; face.position.y = .00305; this.group.add(face);
    // the hub: a brass boss standing above every wire, the seal stamped into its face
    const sealC = document.createElement('canvas'); sealC.width = sealC.height = 256; { const y = sealC.getContext('2d')!; const gg = y.createRadialGradient(128, 110, 10, 128, 128, 128); gg.addColorStop(0, '#d8b06a'); gg.addColorStop(1, '#8a6630'); y.fillStyle = gg; y.fillRect(0, 0, 256, 256); y.fillStyle = '#2a1a0a'; drawSeal(y, l.seal, 128, 128, 78); }
    this.sealTex = new T.CanvasTexture(sealC); this.sealTex.colorSpace = T.SRGBColorSpace; const bossTop = new T.MeshStandardMaterial({map: this.sealTex, metalness: .85, roughness: .35}); this.mats.push(bossTop);
    const boss = new T.Mesh(this.g(new T.CylinderGeometry(PR * .15, PR * .17, .019, 32)), [brass, bossTop, brass]); boss.position.y = .0125; this.group.add(boss);
    // terminal posts
    const post = this.g(new T.CylinderGeometry(.0028, .0032, .005, 10)), washerG = this.g(new T.CylinderGeometry(.0033, .0033, .0005, 14)), nutG = this.g(new T.CylinderGeometry(.0022, .0022, .0016, 6)), steelM = this.m2(new T.MeshStandardMaterial({color: '#b8b2a8', metalness: 1, roughness: .3})), sleeveM = this.m2(new T.MeshStandardMaterial({color: '#141210', roughness: .35}));
    for (let i = 0; i < l.n; i++) for (const a of [slotAng(i, l.n), endAng(i + 1, l.n)]) { const px = Math.cos(a) * PR * .75, pz = -Math.sin(a) * PR * .75; const p = new T.Mesh(post, brass); p.position.set(px, .0055, pz); this.group.add(p);
      // screw terminal: a washer and a hex nut clamping the wire
      const w = new T.Mesh(washerG, steelM); w.position.set(px, .0082, pz); this.group.add(w); const nut = new T.Mesh(nutG, steelM); nut.position.set(px, .0092, pz); nut.rotation.y = a * 3; this.group.add(nut); }
    // wires: each on its own layer; a soft contact shadow under each so crossings read as over / under
    const shadowM = new T.MeshBasicMaterial({color: '#000', transparent: true, opacity: .4, depthWrite: false}); this.mats.push(shadowM);
    for (let i = 0; i < l.n; i++) { const h = .0052 + l.layer[i] * .00085, a0 = slotAng(i, l.n), a1 = endAng(l.end[i], l.n), R0 = PR * .75;
      const p0 = new T.Vector3(Math.cos(a0) * R0, .0062, -Math.sin(a0) * R0), p1 = new T.Vector3(Math.cos(a1) * R0, .0062, -Math.sin(a1) * R0);
      const b = l.bends[i], q = (bx: number, by: number) => new T.Vector3(bx * PR * .82, h, -by * PR * .82);
      const lift0 = p0.clone().multiplyScalar(.9).setY(h), lift1 = p1.clone().multiplyScalar(.9).setY(h);
      const curve = new T.CatmullRomCurve3([p0, lift0, q(b[0], b[1]), q(b[2], b[3]), lift1, p1], false, 'centripetal', .5);
      const mat = new T.MeshStandardMaterial({color: WIRE_COLORS[l.color[i]], roughness: .48, metalness: .05}); this.mats.push(mat);
      const mesh = new T.Mesh(this.g(new T.TubeGeometry(curve, 90, .00125, 7, false)), mat); mesh.userData.wire = i; this.group.add(mesh);
      // black heat-shrink sleeves where the wire enters each terminal
      for (const [t0, t1] of [[0, .07], [.93, 1]]) { const pts: T.Vector3[] = []; for (let k = 0; k <= 6; k++) pts.push(curve.getPoint(t0 + (t1 - t0) * k / 6)); const sl = new T.Mesh(this.g(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 8, .0016, 7, false)), sleeveM); this.group.add(sl); }
      const sc = new T.CatmullRomCurve3(curve.getPoints(60).map(p => new T.Vector3(p.x + .0006, .0032, p.z + .0006))), shadow = new T.Mesh(this.g(new T.TubeGeometry(sc, 60, .0016, 4, false)), shadowM); shadow.scale.y = .2; this.group.add(shadow);
      this.wires.push({mesh, shadow, curve, h}); if (this.cut.has(i)) this.sever(i, .5, false); }
    this.geos.push(...mergeStatic(this.group)); this.buildCutters();
  }
  /** wire cutters lying in the bay corner: tap to take them (they rise and hover over the panel), tap again to put them down */
  private cutters = new T.Group(); cuttersOn = false; private cutK = 0;
  private buildCutters() { const c = this.cutters; c.clear(); const steel = this.m2(new T.MeshStandardMaterial({color: '#9c968c', metalness: 1, roughness: .3})), grip = this.m2(new T.MeshStandardMaterial({color: '#b02418', roughness: .5})), hitM = this.m2(new T.MeshBasicMaterial({visible: false}));
    for (const s of [-1, 1]) { const h = new T.Mesh(this.g(new T.CapsuleGeometry(.0024, .022, 4, 8)), grip); h.rotation.z = Math.PI / 2; h.rotation.y = s * .16; h.position.set(-.012, 0, s * .0028); c.add(h);
      const jaw = new T.Mesh(this.g(new T.BoxGeometry(.012, .0022, .0026)), steel); jaw.position.set(.011, 0, s * .0012); jaw.rotation.y = -s * .12; c.add(jaw); }
    const pin = new T.Mesh(this.g(new T.CylinderGeometry(.0022, .0022, .0034, 10)), steel); pin.position.set(.004, 0, 0); c.add(pin);
    const hit = new T.Mesh(this.g(new T.BoxGeometry(.05, .014, .02)), hitM); hit.userData.cutters = true; c.add(hit);
    c.position.set(-.052, .0105, -.058); c.rotation.y = -Math.PI / 4; this.group.add(c); this.cutK = 0; this.cuttersOn = false; }
  cuttersAt(ray: T.Raycaster) { return ray.intersectObject(this.cutters, true).some(h => h.object.userData.cutters); }
  setCutters(on: boolean) { this.cuttersOn = on; }
  private g<G extends T.BufferGeometry>(g: G) { this.geos.push(g); return g; }
  private m2<M extends T.Material>(m: M) { this.mats.push(m); return m; }
  /** the wire under a ray, only in its middle stretch (cutting at a terminal is not allowed: trace it first) */
  wireAt(ray: T.Raycaster): {wire: number; t: number; mid: boolean} | null {
    const hit = ray.intersectObjects(this.wires.map(w => w.mesh), false)[0]; if (!hit) return null; const i = hit.object.userData.wire as number, w = this.wires[i]; if (this.cut.has(i)) return null;
    const lp = this.group.worldToLocal(hit.point.clone()); let best = 0, bd = 1e9; for (let k = 0; k <= 80; k++) { const d = w.curve.getPoint(k / 80).distanceToSquared(lp); if (d < bd) { bd = d; best = k / 80; } }
    return {wire: i, t: best, mid: best > .2 && best < .8};
  }
  /** cut animation: the wire parts, the ends spring apart, copper glints */
  sever(i: number, t: number, fx = true) { const w = this.wires[i]; if (!w) return; this.cut.add(i); this.group.remove(w.mesh, w.shadow);
    const mat = w.mesh.material as T.Material, pts = w.curve.getPoints(120), k = Math.round(t * 120);
    for (const [a, b, dir] of [[0, Math.max(2, k - 2), -1], [Math.min(118, k + 2), 120, 1]] as const) { const seg = pts.slice(a, b + 1); if (seg.length < 2) continue; const end = seg[dir < 0 ? seg.length - 1 : 0].clone(); end.y += .0025;
      if (dir < 0) seg[seg.length - 1] = end; else seg[0] = end; const m = new T.Mesh(this.g(new T.TubeGeometry(new T.CatmullRomCurve3(seg), Math.max(4, seg.length), .00125, 7, false)), mat); this.group.add(m);
      const cu = new T.Mesh(this.g(new T.SphereGeometry(.0011, 8, 6)), new T.MeshStandardMaterial({color: '#e0904a', metalness: 1, roughness: .25, emissive: '#ff7a2a', emissiveIntensity: fx ? 2 : 0})); this.mats.push(cu.material as T.Material); cu.position.copy(end); this.group.add(cu);
      if (fx) for (let s = 0; s < 6; s++) { const sp = new T.Mesh(this.g(new T.SphereGeometry(.0005, 4, 3)), new T.MeshBasicMaterial({color: '#ffcf7a'})); sp.position.copy(end); this.group.add(sp); this.sparks.push({m: sp, v: new T.Vector3((Math.random() - .5) * .08, .05 + Math.random() * .06, (Math.random() - .5) * .08), t: .5}); } } }
  /** a wrong cut: the whole panel flashes red for a moment */
  warn() { this.flash = 1; }
  update(dt: number) { this.cutK += ((this.cuttersOn ? 1 : 0) - this.cutK) * (1 - Math.exp(-dt * 10)); this.cutters.position.y = .0105 + this.cutK * .022; this.cutters.rotation.z = this.cutK * .5; this.cutters.rotation.x = this.cutK * -.35;
    for (const s of this.sparks) { s.t -= dt; s.v.y -= .3 * dt; s.m.position.addScaledVector(s.v, dt); s.m.visible = s.t > 0; } this.sparks = this.sparks.filter(s => { if (s.t > 0) return true; this.group.remove(s.m); return false; });
    if (this.flash > 0) { this.flash = Math.max(0, this.flash - dt * 1.6); } for (const w of this.wires) { const m = w.mesh.material as T.MeshStandardMaterial; m.emissive?.set('#ff1a00'); m.emissiveIntensity = this.flash * .9 * (Math.sin(this.flash * 40) > 0 ? 1 : .3); } }
  clear() { for (const o of [...this.group.children]) this.group.remove(o); for (const g of this.geos) g.dispose(); for (const m of this.mats) m.dispose(); this.faceTex?.dispose(); this.sealTex?.dispose(); this.geos = []; this.mats = []; this.wires = []; this.sparks = []; this.layout = null; }
}

// ---------------------------------------------------------------------------------------------- chapter I
chapters.WIRE_MAZE.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('I. Правило печати', 'I. The rule of the seal'), L('лабиринт проводов', 'wire maze'));
  let y = ink.para(L('На ступице в центре панели выбита печать. Найди её в таблице: печать называет букву. Пусковой провод — тот, что ВЫХОДИТ из клеммы с этой буквой (буквы — сверху, номера — снизу).', 'A seal is stamped on the hub in the middle of the panel. Find it in the table: the seal names a letter. The firing wire is the one LEAVING the terminal with that letter (letters on top, numbers below).'), 100, 320, PW - 200, 31) + 20;
  const SE = SEALS; for (let i = 0; i < SE.length; i++) { const col = i % 2, row = Math.floor(i / 2), cx = 140 + col * 400, cy = y + 40 + row * 118;
    x.fillStyle = '#2a1c10'; drawSeal(x, SE[i], cx, cy, 38); ink.print(SEAL_NAME[SE[i]](), cx + 62, cy - 4, 30); ink.print('→  ' + SEAL_LETTER[SE[i]], cx + 62, cy + 38, 40, {bold: true}); }
  ink.hand(L('Провода сплетены нарочно. Веди пальцем.', 'The tangle is on purpose. Follow it with a finger.'), 120, y + 40 + 4 * 118 + 30, 40, '#2a3a6a', -.03);
});
chapters.WIRE_MAZE.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('I. Перенос и рез', 'I. Transfer and the cut'));
  let y = ink.para(L('Правило II — только средний и сложный режим. Проследи найденный провод до нижней клеммы. Если её номер делится на 3 (3, 6, 9, 12), пусковым становится ДРУГОЙ провод — тот, что приходит в следующую клемму (номер + 1). Проследи его обратно вверх.', 'Rule II — normal and hard only. Trace the wire you found down to its bottom terminal. If that number divides by 3 (3, 6, 9, 12), the firing wire is ANOTHER one: the wire arriving at the next terminal (number + 1). Trace it back up.'), 100, 320, PW - 200, 31) + 26;
  y = ink.para(L('Как резать. Возьми кусачки — они лежат в углу отсека I (коснись их; ещё раз — положить). Режь только посередине провода, внутри пунктирного круга — у клемм лезвие не встанет. Провод, идущий поверх другого, с ним не соединён.', 'How to cut. Take the cutters — they lie in the corner of bay I (tap them; tap again to put them down). Cut only in the middle of the wire, inside the dotted circle — the blade will not fit at a terminal. A wire lying over another is not joined to it.'), 100, y, PW - 200, 31) + 26;
  y = ink.para(L('Цвет ничего не значит: одинаковых проводов несколько.', 'Colour means nothing: several wires share it.'), 100, y, PW - 200, 31) + 10;
  // worked example sketch
  const ox = 200, oy = y + 30; x.strokeStyle = '#2a1c10'; x.lineWidth = 3; x.beginPath(); x.arc(ox + 300, oy + 200, 190, 0, 7); x.stroke();
  ink.print('Δ', ox + 160, oy + 60, 40, {bold: true}); ink.print('6', ox + 380, oy + 365, 36, {bold: true}); ink.print('7', ox + 455, oy + 340, 36, {bold: true}); ink.print('Ψ', ox + 420, oy + 50, 40, {bold: true});
  x.strokeStyle = '#2350a8'; x.lineWidth = 5; x.beginPath(); x.moveTo(ox + 172, oy + 75); x.bezierCurveTo(ox + 420, oy + 150, ox + 200, oy + 260, ox + 388, oy + 330); x.stroke();
  x.strokeStyle = '#a8261a'; x.beginPath(); x.moveTo(ox + 432, oy + 65); x.bezierCurveTo(ox + 260, oy + 180, ox + 520, oy + 230, ox + 462, oy + 312); x.stroke();
  ink.hand(L('Δ → 6 (делится на 3) → режь тот, что в 7', 'Δ → 6 (divides by 3) → cut the one into 7'), 120, oy + 450, 38, '#6a2a1a', -.02);
  ink.hand('✂', ox + 470, oy + 200, 48, '#6a2a1a');
});
