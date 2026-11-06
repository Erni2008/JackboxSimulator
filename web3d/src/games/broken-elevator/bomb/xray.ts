// THE HOST'S SUITCASE — mechanism III, X-RAY INSPECTION (view, chapter III, practice mirror of XrayCans.java).
// Canisters lie in cradles; their steel skins hide what is inside. Drag the X-ray head over them: under its window the
// skin is cut away and the core, needles and collar glow cold blue. Each canister has its own isolation lever.
import * as T from 'three';
import {L} from '../i18n';
import {chapters, PW, type Ink} from './notebook';
import {cutaway, makeScanUniforms, ScanHead} from './scan';
import type {Diff} from './wire-maze';

export type Core = 'BALL' | 'COIL' | 'ROD';
export interface Inside { core: Core; needles: number; ring: boolean }
export interface XrayLayout { stamp: string; cans: Inside[] }
export const XRAY_TABLE: Record<string, Inside> = {'Α': {core: 'BALL', needles: 2, ring: false}, 'Β': {core: 'COIL', needles: 1, ring: true}, 'Γ': {core: 'ROD', needles: 2, ring: true},
  'Δ': {core: 'BALL', needles: 1, ring: true}, 'Ε': {core: 'COIL', needles: 2, ring: false}, 'Ζ': {core: 'ROD', needles: 1, ring: false}};
const same = (a: Inside, b: Inside) => a.core === b.core && a.needles === b.needles && a.ring === b.ring, dif = (a: Inside, b: Inside) => +(a.core !== b.core) + +(a.needles !== b.needles) + +(a.ring !== b.ring);
const rng = (s: number) => () => (s = (s * 69621) % 2147483647) / 2147483647;
export function makeXray(seed: number, d: Diff): XrayLayout {
  const r = rng(Math.abs(seed * 31337 + 5) % 2147483646 + 1), keys = Object.keys(XRAY_TABLE), stamp = keys[Math.floor(r() * keys.length)], bad = XRAY_TABLE[stamp], k = d === 'EASY' ? 4 : d === 'NORMAL' ? 5 : 6, near = d === 'HARD' ? 2 : d === 'NORMAL' ? 1 : 0;
  const all: Inside[] = []; for (const core of ['BALL', 'COIL', 'ROD'] as Core[]) for (let n = 0; n <= 2; n++) for (const ring of [false, true]) all.push({core, needles: n, ring});
  const sh = <X>(a: X[]) => a.map(v => [r(), v] as const).sort((p, q) => p[0] - q[0]).map(p => p[1]);
  const ones = sh(all.filter(x => dif(x, bad) === 1)), far = sh(all.filter(x => dif(x, bad) >= 2)); const cans = [bad, ...ones.slice(0, near)]; for (const x of far) { if (cans.length >= k) break; cans.push(x); }
  return {stamp, cans: sh(cans)};
}
export const solveXray = (l: XrayLayout) => l.cans.findIndex(c => same(c, XRAY_TABLE[l.stamp]));

const BW = .118, BD = .118;
export class XrayView {
  readonly group = new T.Group(); readonly head: ScanHead; private u = makeScanUniforms(.021); private geos: T.BufferGeometry[] = []; private mats: T.Material[] = []; private tex: T.CanvasTexture | null = null;
  private levers: {g: T.Group; t: number; on: boolean}[] = []; private slots: T.Vector3[] = []; private flash = 0; private shells: T.MeshStandardMaterial[] = [];
  constructor() { this.head = new ScanHead(.021, '#7ad8ff', this.u); }
  build(l: XrayLayout) {
    this.clear(); this.head.on = false; this.head.group.visible = false; this.group.add(this.head.group);
    const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d')!; x.fillStyle = '#211f1c'; x.fillRect(0, 0, 512, 512);
    x.strokeStyle = 'rgba(200,170,110,.3)'; x.lineWidth = 3; x.strokeRect(12, 12, 488, 488); x.fillStyle = '#c9a25a'; x.font = 'bold 84px "Libre Caslon Text", Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.beginPath(); x.arc(452, 60, 44, 0, 7); x.strokeStyle = '#c9a25a'; x.stroke(); x.fillText(l.stamp, 452, 64); x.font = 'bold 22px Oswald, sans-serif'; x.fillStyle = '#8a7650'; x.fillText(L('КЛЕЙМО', 'STAMP'), 452, 124);
    this.tex = new T.CanvasTexture(c); this.tex.colorSpace = T.SRGBColorSpace; const face = new T.Mesh(this.g(new T.PlaneGeometry(BW, BD)), this.m(new T.MeshStandardMaterial({map: this.tex, metalness: .4, roughness: .6}))); face.rotation.x = -Math.PI / 2; face.position.y = .0033; this.group.add(face);
    const xr = this.m(new T.MeshBasicMaterial({color: '#bdeeff', toneMapped: false})), xr2 = this.m(new T.MeshBasicMaterial({color: '#5ab8e8', toneMapped: false})); cutaway(xr, this.u, true); cutaway(xr2, this.u, true);
    const back = this.m(new T.MeshBasicMaterial({color: '#06121c'})); cutaway(back, this.u, true);
    const cols = 2, rows = Math.ceil(l.cans.length / cols), LEN = .044, R = .0085;
    l.cans.forEach((ins, i) => { const col = i % cols, row = Math.floor(i / cols), px = -BW / 2 + .012 + (col + .5) * (BW - .03) / cols - .006, pz = -BD / 2 + .02 + (row + .5) * (BD - .03) / rows; const p = new T.Vector3(px, .0035 + R, pz); this.slots.push(p);
      const shellM = this.m(new T.MeshStandardMaterial({color: '#6a6660', metalness: .9, roughness: .38})); cutaway(shellM, this.u, false); this.shells.push(shellM);
      const shell = new T.Mesh(this.g(new T.CylinderGeometry(R, R, LEN, 24)), shellM); shell.rotation.z = Math.PI / 2; shell.position.copy(p); this.group.add(shell);
      for (const e of [-1, 1]) { const cap = new T.Mesh(this.g(new T.CylinderGeometry(R * 1.08, R * 1.08, .003, 24)), this.m(new T.MeshStandardMaterial({color: '#a8844a', metalness: 1, roughness: .3}))); cap.rotation.z = Math.PI / 2; cap.position.copy(p).add(new T.Vector3(e * LEN / 2, 0, 0)); this.group.add(cap); }
      const bk = new T.Mesh(this.g(new T.PlaneGeometry(LEN, R * 2)), back); bk.rotation.x = -Math.PI / 2; bk.position.copy(p).setY(.0036); this.group.add(bk);
      // the inside (only seen through the window)
      const core = ins.core === 'BALL' ? new T.Mesh(this.g(new T.SphereGeometry(R * .55, 16, 12)), xr) : ins.core === 'ROD' ? new T.Mesh(this.g(new T.CylinderGeometry(R * .22, R * .22, LEN * .5, 10)), xr) : new T.Mesh(this.g(new T.TubeGeometry(new (class extends T.Curve<T.Vector3> { getPoint(t: number) { const a = t * Math.PI * 12; return new T.Vector3(Math.cos(a) * R * .45, (t - .5) * LEN * .5, Math.sin(a) * R * .45); } })(), 80, R * .08, 5, false)), xr);
      if (ins.core !== 'BALL') core.rotation.z = Math.PI / 2; core.position.copy(p); this.group.add(core);
      for (let n = 0; n < ins.needles; n++) { const e = n === 0 ? -1 : 1, nd = new T.Mesh(this.g(new T.ConeGeometry(R * .14, LEN * .22, 8)), xr2); nd.rotation.z = e * Math.PI / 2; nd.position.copy(p).add(new T.Vector3(e * LEN * .3, 0, 0)); this.group.add(nd); }
      if (ins.ring) { const rg = new T.Mesh(this.g(new T.TorusGeometry(R * .7, R * .1, 6, 20)), xr2); rg.rotation.y = Math.PI / 2; rg.position.copy(p).add(new T.Vector3(-LEN * .12, 0, 0)); this.group.add(rg); }
      // isolation lever beside the canister
      const lg = new T.Group(); lg.position.set(px + LEN / 2 + .011, .0035, pz); this.group.add(lg);
      const base = new T.Mesh(this.g(new T.BoxGeometry(.008, .003, .012)), this.m(new T.MeshStandardMaterial({color: '#1a1816', metalness: .7, roughness: .5}))); base.position.y = .0015; lg.add(base);
      const arm = new T.Group(); arm.position.y = .003; lg.add(arm); const stick = new T.Mesh(this.g(new T.CylinderGeometry(.0012, .0012, .014, 6)), this.m(new T.MeshStandardMaterial({color: '#bbb', metalness: 1, roughness: .25}))); stick.position.y = .007; arm.add(stick);
      const knob = new T.Mesh(this.g(new T.SphereGeometry(.0028, 10, 8)), this.m(new T.MeshStandardMaterial({color: '#a01a10', roughness: .4}))); knob.position.y = .014; arm.add(knob); arm.rotation.x = -.5;
      const hit = new T.Mesh(this.g(new T.BoxGeometry(.014, .02, .018)), this.m(new T.MeshBasicMaterial({visible: false}))); hit.position.y = .008; hit.userData.lever = i; lg.add(hit); this.levers.push({g: arm, t: 0, on: false}); });
  }
  private g<G extends T.BufferGeometry>(g: G) { this.geos.push(g); return g; }
  private m<M extends T.Material>(m: M) { this.mats.push(m); return m; }
  leverAt(ray: T.Raycaster) { for (const h of ray.intersectObject(this.group, true)) if (h.object.userData.lever !== undefined) return h.object.userData.lever as number; return -1; }
  /** a drag on the bay surface moves the head (returns false when the ray misses the bay) */
  dragTo(ray: T.Raycaster) { const inv = new T.Matrix4().copy(this.group.matrixWorld).invert(), o = ray.ray.origin.clone().applyMatrix4(inv), d = ray.ray.direction.clone().transformDirection(inv); if (Math.abs(d.y) < 1e-4) return false;
    const t = (this.head.lift - o.y) / d.y; if (t < 0) return false; const p = o.addScaledVector(d, t); if (Math.abs(p.x) > BW * .7 || Math.abs(p.z) > BD * .7) return false; this.head.moveTo(p.x - .012, p.z, BW / 2, BD / 2); return true; }
  throw(i: number) { const l = this.levers[i]; if (l) l.on = true; }
  warn() { this.flash = 1; }
  update(dt: number) { this.head.update(dt, this.group); for (const l of this.levers) { l.t += ((l.on ? 1 : 0) - l.t) * (1 - Math.exp(-dt * 12)); l.g.rotation.x = -.5 + l.t; }
    this.flash = Math.max(0, this.flash - dt * 1.6); for (const s of this.shells) { s.emissive.set('#ff1a00'); s.emissiveIntensity = this.flash * (Math.sin(this.flash * 40) > 0 ? .8 : .2); } }
  clear() { for (const o of [...this.group.children]) this.group.remove(o); for (const g of this.geos) g.dispose(); for (const m of this.mats) m.dispose(); this.tex?.dispose(); this.geos = []; this.mats = []; this.levers = []; this.slots = []; this.shells = []; }
}

// ---------------------------------------------------------------------------------------------- chapter III
function sketch(x: CanvasRenderingContext2D, ins: Inside, cx: number, cy: number, w: number) {
  const h = w * .36; x.strokeStyle = '#2a1c10'; x.lineWidth = 3; x.strokeRect(cx - w / 2, cy - h / 2, w, h); x.fillStyle = '#2a1c10'; x.strokeStyle = '#2a1c10';
  if (ins.core === 'BALL') { x.beginPath(); x.arc(cx, cy, h * .3, 0, 7); x.fill(); } else if (ins.core === 'ROD') x.fillRect(cx - w * .25, cy - h * .09, w * .5, h * .18); else { x.lineWidth = 3; x.beginPath(); for (let i = 0; i <= 60; i++) { const t = i / 60, px = cx - w * .25 + t * w * .5, py = cy + Math.sin(t * Math.PI * 12) * h * .25; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
  for (let n = 0; n < ins.needles; n++) { const e = n === 0 ? -1 : 1, bx = cx + e * w * .44; x.beginPath(); x.moveTo(bx, cy - h * .06); x.lineTo(cx + e * w * .3, cy); x.lineTo(bx, cy + h * .06); x.closePath(); x.fill(); }
  if (ins.ring) { x.lineWidth = 4; x.beginPath(); x.ellipse(cx - w * .12, cy, w * .025, h * .32, 0, 0, 7); x.stroke(); }
}
chapters.XRAY.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('III. Атлас начинок', 'III. Atlas of insides'), L('рентген', 'X-ray inspection'));
  let y = ink.para(L('На отсеке выбито клеймо — буква в кружке. Опасна та банка, внутри которой ровно то, что нарисовано у этой буквы: то же ядро, столько же игл, кольцо есть или нет.', 'The bay is stamped with a letter in a circle. The dangerous canister holds exactly what is drawn beside that letter: the same core, as many needles, a collar or none.'), 100, 320, PW - 200, 30) + 10;
  Object.entries(XRAY_TABLE).forEach(([k, ins], i) => { const col = i % 2, row = Math.floor(i / 2), cx = 300 + col * 400, cy = y + 80 + row * 190; ink.print(k, cx - 190, cy + 14, 52, {bold: true}); sketch(x, ins, cx + 30, cy, 280); });
  ink.hand(L('ядро · иглы · кольцо — сверяй всё', 'core · needles · collar — check them all'), 140, y + 80 + 3 * 190 - 30, 40, '#2a3a6a', -.02);
});
chapters.XRAY.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('III. Как смотреть и изолировать', 'III. Looking and isolating'));
  let y = ink.para(L('Веди сканер пальцем над банками. Только в его окне сталь становится прозрачной. Банка длиннее окна — проведи сканер вдоль всей банки, иначе можно не увидеть иглу на другом конце.', 'Drag the scanner over the canisters. Only inside its window does the steel turn transparent. A canister is longer than the window — sweep its whole length, or you may miss a needle at the far end.'), 100, 320, PW - 200, 31) + 20;
  y = ink.para(L('Ядро: шар, пружина (спираль) или стержень. Иглы смотрят в ядро с торцов. Кольцо — поясок поперёк банки.', 'Core: ball, coil (spiral) or rod. Needles point at the core from the ends. The collar is a band across the canister.'), 100, y, PW - 200, 31) + 20;
  y = ink.para(L('Нашёл — переведи рычажок РЯДОМ С ЭТОЙ банкой. Чужой рычажок — удар по взрывателю. На сложном есть банки, отличающиеся одной деталью.', 'Found it — throw the lever BESIDE THAT canister. Another lever is a strike on the fuse. On hard some canisters differ by a single part.'), 100, y, PW - 200, 31);
  ink.hand(L('Шар с двумя иглами без кольца ≠ шар с двумя иглами и кольцом!', 'A ball, two needles, no collar ≠ a ball, two needles and a collar!'), 110, y + 80, 34, '#6a2a1a', -.02); void x;
});
