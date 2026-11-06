// THE HOST'S SUITCASE — mechanism IV, LASER ROUTING (view, chapter IV, practice mirror of LaserGrid.java).
// An 8×4 optical bed: the emitter on the left wall, turning mirrors, iron baffles, numbered sensors on the edges.
// Tapping a mirror turns it a quarter (between '/' and '\'); the beam is re-traced at once and drawn bouncing.
// "Confirm" asks the server (or the practice judge) whether the beam rests on the quench sensor.
import * as T from 'three';
import {L} from '../i18n';
import {chapters, PW, type Ink} from './notebook';
import type {Diff} from './wire-maze';

export const COLS = 8, ROWS = 4;
export interface LaserLayout { emitter: number; mirrors: number[][]; baffles: number[][]; sensors: number[][]; state: number[]; target?: number }
const counts = (d: Diff) => d === 'EASY' ? [3, 2, 4] : d === 'NORMAL' ? [4, 3, 5] : [5, 4, 6];
export const quench = (d: Diff, m: number, b: number, s: number) => d === 'EASY' ? b : d === 'NORMAL' ? (b + m) % s + 1 : (2 * b + m) % s + 1;
/** the beam: cells visited and the sensor it ends on (1-based, 0 = none). Mirrors with rows growing downward, as on the server. */
export function trace(l: LaserLayout, st = l.state) {
  let x = 0, y = l.emitter, dx = 1, dy = 0; const pts: [number, number][] = [[-.5, y]]; let hit = 0, end: [number, number] | null = null;
  for (let step = 0; step < 200; step++) {
    if (x < 0) { end = [-.5, y]; break; } if (x >= COLS) { hit = sensorAt(l, 1, y); end = [COLS - .5 + .4, y]; break; } if (y < 0) { hit = sensorAt(l, 0, x); end = [x, -.9]; break; } if (y >= ROWS) { hit = sensorAt(l, 2, x); end = [x, ROWS - .1]; break; }
    if (l.baffles.some(b => b[0] === x && b[1] === y)) { end = [x - dx * .38, y - dy * .38]; break; }
    const mi = l.mirrors.findIndex(m => m[0] === x && m[1] === y); if (mi >= 0) { pts.push([x, y]); const s = st[mi]; const ndx = s === 0 ? -dy : dy, ndy = s === 0 ? -dx : dx; dx = ndx; dy = ndy; }
    x += dx; y += dy;
  }
  if (end) pts.push(end); return {pts, hit};
}
const sensorAt = (l: LaserLayout, side: number, i: number) => { const k = l.sensors.findIndex(s => s[0] === side && s[1] === i); return k + 1; };
const rng = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;
export function makeLaser(seed: number, d: Diff): LaserLayout {
  const r = rng(Math.abs(seed * 7907 + 1) % 2147483646 + 1), [nm, nb, ns] = counts(d), t = quench(d, nm, nb, ns);
  for (;;) { const e = Math.floor(r() * ROWS), used = new Set([e * COLS]), cell = () => { let c; do c = Math.floor(r() * COLS * ROWS); while (used.has(c)); used.add(c); return [c % COLS, Math.floor(c / COLS)]; };
    const mirrors = Array.from({length: nm}, cell), baffles = Array.from({length: nb}, cell); const exits: number[][] = []; for (let i = 0; i < COLS; i++) exits.push([0, i], [2, i]); for (let i = 0; i < ROWS; i++) exits.push([1, i]);
    const sensors = exits.map(v => [r(), v] as const).sort((a, b) => a[0] - b[0]).slice(0, ns).map(p => p[1]); const state = mirrors.map(() => r() < .5 ? 0 : 1);
    const l: LaserLayout = {emitter: e, mirrors, baffles, sensors, state, target: t}; if (trace(l).hit === t) continue;
    let ok = false; for (let mask = 0; mask < 1 << nm && !ok; mask++) ok = trace(l, mirrors.map((_, i) => mask >> i & 1)).hit === t; if (ok) return l; }
}

const CELL = .024;
export class LaserView {
  readonly group = new T.Group(); layout: LaserLayout | null = null; hit = 0; private geos: T.BufferGeometry[] = []; private mats: T.Material[] = []; private tex: T.CanvasTexture | null = null;
  private mirrors: {g: T.Group; ang: number}[] = []; private beam = new T.Group(); private beamM!: T.MeshBasicMaterial; private glowM!: T.MeshBasicMaterial; private sensorLamps: T.MeshStandardMaterial[] = []; private t = 0; private flash = 0; done = false;
  private cell(cx: number, cy: number) { return new T.Vector3(-COLS * CELL / 2 + (cx + .5) * CELL, 0, -ROWS * CELL / 2 + (cy + .5) * CELL); }
  build(l: LaserLayout) {
    this.clear(); this.layout = { ...l, state: [...l.state]}; this.done = false;
    const c = document.createElement('canvas'); c.width = 1024; c.height = 560; const x = c.getContext('2d')!; x.fillStyle = '#1b1a18'; x.fillRect(0, 0, 1024, 560);
    const ox = (1024 - 8 * 112) / 2, oy = (560 - 4 * 112) / 2; x.strokeStyle = 'rgba(200,170,110,.18)'; x.lineWidth = 2; for (let i = 0; i <= COLS; i++) { x.beginPath(); x.moveTo(ox + i * 112, oy); x.lineTo(ox + i * 112, oy + 448); x.stroke(); } for (let j = 0; j <= ROWS; j++) { x.beginPath(); x.moveTo(ox, oy + j * 112); x.lineTo(ox + 896, oy + j * 112); x.stroke(); }
    this.tex = new T.CanvasTexture(c); this.tex.colorSpace = T.SRGBColorSpace; const W = COLS * CELL / (896 / 1024), D = ROWS * CELL / (448 / 560);
    const face = new T.Mesh(this.g(new T.PlaneGeometry(W, D)), this.m(new T.MeshStandardMaterial({map: this.tex, metalness: .4, roughness: .7}))); face.rotation.x = -Math.PI / 2; face.position.y = .0034; this.group.add(face);
    const iron = this.m(new T.MeshStandardMaterial({color: '#2a2724', metalness: .8, roughness: .5})), brass = this.m(new T.MeshStandardMaterial({color: '#b08a48', metalness: 1, roughness: .3})), glass = this.m(new T.MeshStandardMaterial({color: '#d8e4ee', metalness: 1, roughness: .05, envMapIntensity: 1.6}));
    // emitter on the left wall
    const em = new T.Mesh(this.g(new T.CylinderGeometry(.005, .006, .02, 14)), brass); em.rotation.z = Math.PI / 2; em.position.copy(this.cell(-1, l.emitter)).setY(.0085).add(new T.Vector3(CELL * .3, 0, 0)); this.group.add(em);
    for (const b of l.baffles) { const k = new T.Mesh(this.g(new T.BoxGeometry(CELL * .7, .012, CELL * .7)), iron); k.position.copy(this.cell(b[0], b[1])).setY(.0094); this.group.add(k);
      const h = new T.Mesh(this.g(new T.BoxGeometry(CELL * .74, .0015, CELL * .74)), this.m(new T.MeshStandardMaterial({color: '#7a1a10', roughness: .6}))); h.position.copy(k.position).setY(.0158); this.group.add(h); }
    l.mirrors.forEach((mm, i) => { const g = new T.Group(); g.position.copy(this.cell(mm[0], mm[1])).setY(.0034); this.group.add(g);
      const disc = new T.Mesh(this.g(new T.CylinderGeometry(CELL * .42, CELL * .42, .002, 24)), brass); disc.position.y = .001; g.add(disc);
      const plate = new T.Mesh(this.g(new T.BoxGeometry(CELL * .8, .011, .0018)), glass); plate.position.y = .0075; g.add(plate);
      const hit = new T.Mesh(this.g(new T.CylinderGeometry(CELL * .5, CELL * .5, .016, 12)), this.m(new T.MeshBasicMaterial({visible: false}))); hit.position.y = .008; hit.userData.mirror = i; g.add(hit);
      const ang = l.state[i] === 0 ? Math.PI / 4 : -Math.PI / 4; g.rotation.y = ang; this.mirrors.push({g, ang}); });
    // sensors (numbered) where the beam can leave the bed
    const pl = document.createElement('canvas'); pl.width = 64; pl.height = 64;
    l.sensors.forEach((s, i) => { const p = s[0] === 1 ? this.cell(COLS, s[1]) : s[0] === 0 ? this.cell(s[1], -1) : this.cell(s[1], ROWS); p.lerp(s[0] === 1 ? this.cell(COLS - 1, s[1]) : s[0] === 0 ? this.cell(s[1], 0) : this.cell(s[1], ROWS - 1), .42);
      const lamp = this.m(new T.MeshStandardMaterial({color: '#2a1a08', emissive: '#ffb040', emissiveIntensity: 0, roughness: .3})); this.sensorLamps.push(lamp);
      const body = new T.Mesh(this.g(new T.CylinderGeometry(.0055, .0055, .007, 16)), iron); body.position.copy(p).setY(.0068); this.group.add(body);
      const eye = new T.Mesh(this.g(new T.SphereGeometry(.0042, 14, 8)), lamp); eye.position.copy(p).setY(.0105); this.group.add(eye);
      const nc = document.createElement('canvas'); nc.width = nc.height = 64; const nx = nc.getContext('2d')!; nx.fillStyle = '#e6d3a4'; nx.font = 'bold 52px "IBM Plex Mono", monospace'; nx.textAlign = 'center'; nx.textBaseline = 'middle'; nx.fillText(String(i + 1), 32, 34);
      const nt = new T.CanvasTexture(nc); nt.colorSpace = T.SRGBColorSpace; const lab = new T.Mesh(this.g(new T.PlaneGeometry(.011, .011)), this.m(new T.MeshBasicMaterial({map: nt, transparent: true, toneMapped: false}))); (lab.material as any).__tex = nt;
      const off = s[0] === 1 ? new T.Vector3(.0105, 0, 0) : s[0] === 0 ? new T.Vector3(0, 0, -.0105) : new T.Vector3(0, 0, .0105); lab.rotation.x = -Math.PI / 2; lab.position.copy(p).add(off).setY(.0036); this.group.add(lab); });
    void pl;
    this.beamM = this.m(new T.MeshBasicMaterial({color: '#ff2a12', transparent: true, opacity: .95, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false}));
    this.glowM = this.m(new T.MeshBasicMaterial({color: '#ff5a30', transparent: true, opacity: .25, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false}));
    this.group.add(this.beam); this.retrace();
  }
  private g<G extends T.BufferGeometry>(g: G) { this.geos.push(g); return g; }
  private m<M extends T.Material>(m: M) { this.mats.push(m); return m; }
  mirrorAt(ray: T.Raycaster) { for (const h of ray.intersectObject(this.group, true)) if (h.object.userData.mirror !== undefined) return h.object.userData.mirror as number; return -1; }
  rotate(i: number) { if (!this.layout) return; this.layout.state[i] ^= 1; this.retrace(); }
  setState(st: number[]) { if (!this.layout || st.join() === this.layout.state.join()) return; this.layout.state = [...st]; this.retrace(); }
  retrace() { if (!this.layout) return; for (const o of [...this.beam.children]) { this.beam.remove(o); (o as T.Mesh).geometry.dispose(); }
    const {pts, hit} = trace(this.layout); this.hit = hit; const y = .0085;
    for (let i = 0; i + 1 < pts.length; i++) { const a = this.cell(pts[i][0], pts[i][1]).setY(y), b = this.cell(pts[i + 1][0], pts[i + 1][1]).setY(y), len = a.distanceTo(b); if (len < 1e-5) continue;
      for (const [w, m] of [[.0011, this.beamM], [.0036, this.glowM]] as const) { const seg = new T.Mesh(new T.CylinderGeometry(w, w, len, 6, 1, true), m); seg.position.copy(a).lerp(b, .5); seg.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), b.clone().sub(a).normalize()); this.beam.add(seg); } }
    this.layout.state.forEach((s, i) => { this.mirrors[i].ang = s === 0 ? Math.PI / 4 : -Math.PI / 4; }); }
  warn() { this.flash = 1; }
  update(dt: number) { this.t += dt; for (const m of this.mirrors) m.g.rotation.y += (m.ang - m.g.rotation.y) * (1 - Math.exp(-dt * 14));
    this.flash = Math.max(0, this.flash - dt * 1.6); this.beamM.opacity = .8 + .2 * Math.sin(this.t * 40); this.glowM.opacity = .2 + .06 * Math.sin(this.t * 7);
    this.sensorLamps.forEach((l, i) => { const on = this.hit === i + 1; l.emissive.set(this.done && on ? '#5aff7a' : this.flash > 0 ? '#ff1a00' : '#ffb040'); l.emissiveIntensity = on ? 2.2 + Math.sin(this.t * 12) * .4 : this.flash * 1.5; }); }
  clear() { for (const o of [...this.beam.children]) (o as T.Mesh).geometry.dispose(); this.beam.clear(); for (const o of [...this.group.children]) this.group.remove(o); for (const m of this.mats) { (m as any).map?.dispose?.(); m.dispose(); } for (const g of this.geos) g.dispose(); this.tex?.dispose(); this.geos = []; this.mats = []; this.mirrors = []; this.sensorLamps = []; }
}

// ---------------------------------------------------------------------------------------------- chapter IV
chapters.LASER.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('IV. Какой датчик гасящий', 'IV. Which sensor quenches'), L('лазерный контур', 'laser routing'));
  let y = ink.para(L('Пересчитай на поле железные ЗАСЛОНКИ (кубики с красной крышкой) и ЗЕРКАЛА (стёкла на латунных дисках). Номер гасящего датчика:', 'Count the iron BAFFLES (blocks with red caps) and the MIRRORS (glass on brass discs) on the bed. The quench sensor\'s number is:'), 100, 320, PW - 200, 31) + 26;
  const rows = [[L('ЛЁГКИЙ', 'EASY'), L('= числу заслонок', '= the number of baffles')], [L('СРЕДНИЙ', 'NORMAL'), L('= остаток от (заслонки + зеркала) ÷ датчики, плюс 1', '= remainder of (baffles + mirrors) ÷ sensors, plus 1')], [L('СЛОЖНЫЙ', 'HARD'), L('= остаток от (2 × заслонки + зеркала) ÷ датчики, плюс 1', '= remainder of (2 × baffles + mirrors) ÷ sensors, plus 1')]];
  for (const [h, t] of rows) { ink.print(h, 100, y, 32, {bold: true, color: '#7a1408'}); y = ink.para(t, 330, y, PW - 430, 31) + 22; }
  ink.hand(L('Пример (средний): 3 заслонки, 4 зеркала, 5 датчиков:', 'Example (normal): 3 baffles, 4 mirrors, 5 sensors:'), 110, y + 40, 38, '#2a3a6a', -.02);
  ink.hand(L('(3 + 4) = 7; 7 ÷ 5 → остаток 2; 2 + 1 = датчик 3', '(3 + 4) = 7; 7 ÷ 5 → remainder 2; 2 + 1 = sensor 3'), 130, y + 100, 38, '#2a3a6a', -.02); void x;
});
chapters.LASER.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('IV. Как вести луч', 'IV. Steering the beam'));
  let y = ink.para(L('Нажатие на зеркало поворачивает его на четверть: «/» ↔ «\\». Луч отражается сразу. Заслонка луч гасит. Когда луч горит точно на гасящем датчике — нажми «Подтвердить». Луч на другом датчике или в никуда — удар по взрывателю.', 'Tapping a mirror turns it a quarter: "/" ↔ "\\". The beam reflects at once. A baffle stops it. When the beam rests exactly on the quench sensor, press "Confirm". A beam on another sensor or nowhere is a strike on the fuse.'), 100, 320, PW - 200, 31) + 30;
  // diagram of the two mirror positions
  const d = (cx: number, cy: number, slash: boolean) => { x.strokeStyle = '#2a1c10'; x.lineWidth = 3; x.strokeRect(cx - 70, cy - 70, 140, 140); x.lineWidth = 8; x.beginPath(); x.moveTo(cx + (slash ? -45 : -45), cy + (slash ? 45 : -45)); x.lineTo(cx + 45, cy + (slash ? -45 : 45)); x.stroke();
    x.strokeStyle = '#a8261a'; x.lineWidth = 4; x.beginPath(); x.moveTo(cx - 130, cy); x.lineTo(cx, cy); x.lineTo(cx, cy + (slash ? -130 : 130)); x.stroke(); };
  d(300, y + 170, true); d(700, y + 170, false); ink.print(L('«/» — вверх', '"/" — up'), 300, y + 350, 32, {align: 'center'}); ink.print(L('«\\» — вниз', '"\\" — down'), 700, y + 350, 32, {align: 'center'});
});
