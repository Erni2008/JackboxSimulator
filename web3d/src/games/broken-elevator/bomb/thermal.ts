// THE HOST'S SUITCASE — mechanism V, THERMAL THREAT (view, chapter V, practice mirror of ThermalCaps.java).
// Six sealed capsules, numbered, each with an engraved symbol and a vent valve. The thermal scope paints the heat
// pattern only inside its window and reads the temperature of the capsule under its centre.
import * as T from 'three';
import {L} from '../i18n';
import {chapters, PW, type Ink} from './notebook';
import {cutaway, makeScanUniforms, ScanHead} from './scan';
import {drawSeal, SEALS, type Seal, type Diff} from './wire-maze';

export type Pattern = 'CENTER' | 'TWO' | 'RING' | 'COLD_CENTER' | 'ASYM';
export const PATTERNS: Pattern[] = ['CENTER', 'TWO', 'RING', 'COLD_CENTER', 'ASYM'];
export interface Cap { temp: number; pattern: Pattern; symbol: Seal }
export interface ThermalLayout { stamp: Seal; caps: Cap[] }
export const THERMAL_TABLE: Record<Seal, {pattern: Pattern; lo: number; hi: number}> = {CIRCLE: {pattern: 'CENTER', lo: 56, hi: 70}, TRIANGLE: {pattern: 'TWO', lo: 40, hi: 55}, SQUARE: {pattern: 'RING', lo: 71, hi: 85},
  DIAMOND: {pattern: 'COLD_CENTER', lo: 56, hi: 70}, CROSS: {pattern: 'ASYM', lo: 40, hi: 55}, STAR: {pattern: 'CENTER', lo: 71, hi: 85}, CRESCENT: {pattern: 'RING', lo: 40, hi: 55}, HEXAGON: {pattern: 'TWO', lo: 56, hi: 70}};
export const isRound = (s: Seal) => s === 'CIRCLE' || s === 'CRESCENT';
const fits = (c: Cap, s: {pattern: Pattern; lo: number; hi: number}) => c.pattern === s.pattern && c.temp >= s.lo && c.temp <= s.hi;
export function solveThermal(l: ThermalLayout) { const sig = THERMAL_TABLE[l.stamp], f = l.caps.map((c, i) => fits(c, sig) ? i : -1).filter(i => i >= 0); return f.length === 1 ? f[0] : f.find(i => !isRound(l.caps[i].symbol)) ?? -1; }
const rng = (s: number) => () => (s = (s * 48271) % 2147483647) / 2147483647;
export function makeThermal(seed: number, d: Diff): ThermalLayout {
  const r = rng(Math.abs(seed * 6151 + 9) % 2147483646 + 1), pick = <X>(a: X[]) => a[Math.floor(r() * a.length)], stamp = pick(SEALS), sig = THERMAL_TABLE[stamp], ang = SEALS.filter(s => !isRound(s)), rnd = SEALS.filter(isRound);
  const band = () => sig.lo + Math.floor(r() * (sig.hi - sig.lo + 1)), other = () => { let p; do p = pick(PATTERNS); while (p === sig.pattern); return p; };
  for (;;) { const caps: Cap[] = [{temp: band(), pattern: sig.pattern, symbol: pick(ang)}]; if (d !== 'EASY') caps.push({temp: band(), pattern: sig.pattern, symbol: pick(rnd)});
    caps.push({temp: r() < .5 ? sig.lo - 3 - Math.floor(r() * 10) : sig.hi + 3 + Math.floor(r() * 8), pattern: sig.pattern, symbol: pick(SEALS)}, {temp: band(), pattern: other(), symbol: pick(ang)}, {temp: 88 + Math.floor(r() * 8), pattern: other(), symbol: pick(SEALS)});
    while (caps.length < 6) { const c = {temp: 30 + Math.floor(r() * 56), pattern: pick(PATTERNS), symbol: pick(SEALS)}; if (!fits(c, sig)) caps.push(c); }
    const bad = caps[0]; const sh = caps.map(c => [r(), c] as const).sort((a, b) => a[0] - b[0]).map(p => p[1]); const l = {stamp, caps: sh};
    if (sh.filter(c => fits(c, sig)).length !== (d === 'EASY' ? 1 : 2)) continue; if (Math.max(...sh.map(c => c.temp)) === bad.temp) continue; if (new Set(sh.map(c => c.temp)).size !== 6) continue; if (solveThermal(l) !== sh.indexOf(bad)) continue; return l; }
}

const BW = .138, BD = .108, LEN = .03, R = .0072;
const HEAT_GLSL = `
uniform float uTemp; uniform int uPat; varying vec3 vLoc;
vec3 ironbow(float t) { t = clamp(t, 0., 1.); return t < .25 ? mix(vec3(.02,.0,.08), vec3(.35,.0,.55), t / .25) : t < .5 ? mix(vec3(.35,.0,.55), vec3(.85,.12,.15), (t - .25) / .25) : t < .75 ? mix(vec3(.85,.12,.15), vec3(1.,.62,.05), (t - .5) / .25) : mix(vec3(1.,.62,.05), vec3(1.,1.,.85), (t - .75) / .25); }
float pat(vec2 p) { float r = length(p);
  if (uPat == 0) return exp(-dot(p, p) * 3.5);
  if (uPat == 1) return max(exp(-dot(p - vec2(.55, 0.), p - vec2(.55, 0.)) * 9.), exp(-dot(p + vec2(.55, 0.), p + vec2(.55, 0.)) * 9.));
  if (uPat == 2) return exp(-pow(r - .55, 2.) * 26.);
  if (uPat == 3) return 1. - exp(-dot(p, p) * 5.);
  return exp(-dot(p - vec2(.5, -.35), p - vec2(.5, -.35)) * 5.) * .9 + .15 * (p.x + 1.) / 2.; }`;
export class ThermalView {
  readonly group = new T.Group(); readonly head: ScanHead; private u = makeScanUniforms(.02); private geos: T.BufferGeometry[] = []; private mats: T.Material[] = []; private texs: T.Texture[] = [];
  private valves: {g: T.Group; t: number; on: boolean}[] = []; centers: T.Vector3[] = []; layout: ThermalLayout | null = null; private flash = 0; private shells: T.MeshStandardMaterial[] = [];
  constructor() { this.head = new ScanHead(.02, '#ff8a3a', this.u); }
  build(l: ThermalLayout) {
    this.clear(); this.layout = l; this.head.on = false; this.head.group.visible = false; this.group.add(this.head.group);
    const c = document.createElement('canvas'); c.width = 640; c.height = 500; const x = c.getContext('2d')!; x.fillStyle = '#211e1b'; x.fillRect(0, 0, 640, 500); x.strokeStyle = 'rgba(200,170,110,.3)'; x.lineWidth = 3; x.strokeRect(10, 10, 620, 480);
    x.fillStyle = '#c9a25a'; x.beginPath(); x.arc(585, 55, 40, 0, 7); x.strokeStyle = '#c9a25a'; x.stroke(); drawSeal(x, l.stamp, 585, 55, 24); x.font = 'bold 20px Oswald, sans-serif'; x.textAlign = 'center'; x.fillStyle = '#8a7650'; x.fillText(L('ПЕЧАТЬ', 'SEAL'), 585, 112);
    const pos = (i: number) => new T.Vector3(-BW / 2 + .018 + (i % 3) * .036 + LEN / 2 - .006, .0035 + R, -BD / 2 + .03 + Math.floor(i / 3) * .05);
    l.caps.forEach((cp, i) => { const p = pos(i), u = (p.x + BW / 2) / BW * 640, v = (p.z + BD / 2) / BD * 500; x.fillStyle = '#e6d3a4'; x.font = 'bold 30px "IBM Plex Mono", monospace'; x.fillText(String(i + 1), u - 70, v + 4);
      x.fillStyle = '#d8b46a'; drawSeal(x, cp.symbol, u, v + 58, 14); });
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; this.texs.push(t); const face = new T.Mesh(this.g(new T.PlaneGeometry(BW, BD)), this.m(new T.MeshStandardMaterial({map: t, metalness: .4, roughness: .6}))); face.rotation.x = -Math.PI / 2; face.position.y = .0033; this.group.add(face);
    const geo = this.g(new T.CapsuleGeometry(R, LEN - 2 * R, 6, 18));
    l.caps.forEach((cp, i) => { const p = pos(i); this.centers.push(p);
      const shellM = this.m(new T.MeshStandardMaterial({color: '#8a8478', metalness: .85, roughness: .35})); cutaway(shellM, this.u, false); this.shells.push(shellM);
      const shell = new T.Mesh(geo, shellM); shell.rotation.z = Math.PI / 2; shell.position.copy(p); this.group.add(shell);
      // heat skin (only inside the scope's window)
      // the window test is built in (a hand-written shader has no chunks for the cutaway patch to hook)
      const hm = this.m(new T.ShaderMaterial({uniforms: {uTemp: {value: (cp.temp - 28) / 68}, uPat: {value: PATTERNS.indexOf(cp.pattern)}, ...this.u}, toneMapped: false,
        vertexShader: `varying vec3 vLoc; varying vec3 vW; void main() { vLoc = position; vW = (modelMatrix * vec4(position, 1.)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
        fragmentShader: `${HEAT_GLSL}\nvarying vec3 vW; uniform vec3 uScanP; uniform vec3 uScanN; uniform float uScanR;\nvoid main() { vec3 sd = vW - uScanP; sd -= dot(sd, uScanN) * uScanN; if (length(sd) > uScanR) discard; vec2 p = vec2(vLoc.y / ${(LEN / 2).toFixed(4)}, vLoc.z / ${R.toFixed(4)}); float h = pat(p) * mix(.35, 1., uTemp) + uTemp * .18; gl_FragColor = vec4(ironbow(h), 1.); }`})); const skin = new T.Mesh(geo, hm); skin.rotation.z = Math.PI / 2; skin.position.copy(p); skin.scale.setScalar(1.002); this.group.add(skin);
      // vent valve: a small red wheel beside the capsule
      const vg = new T.Group(); vg.position.set(p.x + LEN / 2 + .007, .0035, p.z); this.group.add(vg);
      const stem = new T.Mesh(this.g(new T.CylinderGeometry(.0012, .0012, .007, 6)), this.m(new T.MeshStandardMaterial({color: '#999', metalness: 1, roughness: .3}))); stem.position.y = .0035; vg.add(stem);
      const wheel = new T.Group(); wheel.position.y = .0075; vg.add(wheel); const rim = new T.Mesh(this.g(new T.TorusGeometry(.0042, .0011, 6, 16)), this.m(new T.MeshStandardMaterial({color: '#a01a10', roughness: .4}))); rim.rotation.x = Math.PI / 2; wheel.add(rim);
      for (const a of [0, Math.PI / 2]) { const sp = new T.Mesh(this.g(new T.BoxGeometry(.008, .0009, .0009)), this.m(new T.MeshStandardMaterial({color: '#a01a10'}))); sp.rotation.y = a; wheel.add(sp); }
      const hit = new T.Mesh(this.g(new T.CylinderGeometry(.007, .007, .012, 8)), this.m(new T.MeshBasicMaterial({visible: false}))); hit.position.y = .006; hit.userData.valve = i; vg.add(hit); this.valves.push({g: wheel, t: 0, on: false}); });
  }
  private g<G extends T.BufferGeometry>(g: G) { this.geos.push(g); return g; }
  private m<M extends T.Material>(m: M) { this.mats.push(m); return m; }
  valveAt(ray: T.Raycaster) { for (const h of ray.intersectObject(this.group, true)) if (h.object.userData.valve !== undefined) return h.object.userData.valve as number; return -1; }
  dragTo(ray: T.Raycaster) { const inv = new T.Matrix4().copy(this.group.matrixWorld).invert(), o = ray.ray.origin.clone().applyMatrix4(inv), d = ray.ray.direction.clone().transformDirection(inv); if (Math.abs(d.y) < 1e-4) return false;
    const t = (this.head.lift - o.y) / d.y; if (t < 0) return false; const p = o.addScaledVector(d, t); if (Math.abs(p.x) > BW * .7 || Math.abs(p.z) > BD * .7) return false; this.head.moveTo(p.x - .012, p.z, BW / 2, BD / 2); return true; }
  /** the capsule under the scope's centre (−1 when none) */
  under() { if (!this.head.on) return -1; let best = -1, bd = 1e9; this.centers.forEach((c, i) => { const dx = Math.abs(c.x - this.head.x), dz = Math.abs(c.z - this.head.z); if (dx < LEN / 2 + .003 && dz < R + .004 && dx + dz < bd) { bd = dx + dz; best = i; } }); return best; }
  vent(i: number) { const v = this.valves[i]; if (v) v.on = true; }
  warn() { this.flash = 1; }
  update(dt: number) { this.head.update(dt, this.group); for (const v of this.valves) { v.t += ((v.on ? 1 : 0) - v.t) * (1 - Math.exp(-dt * 6)); v.g.rotation.y = v.t * Math.PI * 2.5; }
    this.flash = Math.max(0, this.flash - dt * 1.6); for (const s of this.shells) { s.emissive.set('#ff1a00'); s.emissiveIntensity = this.flash * (Math.sin(this.flash * 40) > 0 ? .8 : .2); } }
  clear() { for (const o of [...this.group.children]) this.group.remove(o); for (const g of this.geos) g.dispose(); for (const m of this.mats) m.dispose(); for (const t of this.texs) t.dispose(); this.geos = []; this.mats = []; this.texs = []; this.valves = []; this.centers = []; this.shells = []; }
}

// ---------------------------------------------------------------------------------------------- chapter V
const PAT_NAME: Record<Pattern, () => string> = {CENTER: () => L('пятно в центре', 'central hotspot'), TWO: () => L('два пятна', 'two hotspots'), RING: () => L('кольцо', 'ring'), COLD_CENTER: () => L('холодный центр', 'cold centre'), ASYM: () => L('пятно сбоку', 'off-centre')};
function heatIcon(x: CanvasRenderingContext2D, p: Pattern, cx: number, cy: number) { const w = 120, h = 46; x.save(); x.beginPath(); x.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2); x.clip(); x.fillStyle = '#d8c79e'; x.fillRect(cx - w / 2, cy - h / 2, w, h);
  const spot = (sx: number, sy: number, r: number) => { const g = x.createRadialGradient(sx, sy, 0, sx, sy, r); g.addColorStop(0, '#5a1a0a'); g.addColorStop(1, 'rgba(90,26,10,0)'); x.fillStyle = g; x.fillRect(cx - w / 2, cy - h / 2, w, h); };
  if (p === 'CENTER') spot(cx, cy, 30); else if (p === 'TWO') { spot(cx - 32, cy, 20); spot(cx + 32, cy, 20); } else if (p === 'RING') { x.strokeStyle = '#5a1a0a'; x.lineWidth = 9; x.beginPath(); x.ellipse(cx, cy, 34, 14, 0, 0, 7); x.stroke(); }
  else if (p === 'COLD_CENTER') { x.fillStyle = '#5a1a0a'; x.fillRect(cx - w / 2, cy - h / 2, w, h); const g = x.createRadialGradient(cx, cy, 0, cx, cy, 34); g.addColorStop(0, '#e8dcbc'); g.addColorStop(1, 'rgba(232,220,188,0)'); x.fillStyle = g; x.fillRect(cx - w / 2, cy - h / 2, w, h); } else spot(cx + 30, cy + 8, 26);
  x.restore(); x.strokeStyle = '#2a1c10'; x.lineWidth = 2.5; x.beginPath(); x.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2); x.stroke(); }
chapters.THERMAL.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('V. Тепловая таблица', 'V. The heat table'), L('тепловая угроза', 'thermal threat'));
  let y = ink.para(L('Найди на отсеке печать. В строке этой печати — рисунок нагрева и диапазон температуры опасной капсулы. Самая горячая капсула почти никогда не опасна.', 'Find the seal on the bay. Its row gives the dangerous capsule\'s heat pattern and temperature range. The hottest capsule is almost never the dangerous one.'), 100, 320, PW - 200, 30) + 14;
  SEALS.forEach((s, i) => { const sig = THERMAL_TABLE[s], cy = y + 40 + i * 92; x.fillStyle = '#2a1c10'; drawSeal(x, s, 140, cy, 30); heatIcon(x, sig.pattern, 320, cy); ink.print(PAT_NAME[sig.pattern](), 400, cy - 2, 28); ink.print(`${sig.lo}–${sig.hi} °C`, PW - 110, cy + 10, 34, {bold: true, align: 'right'}); });
});
chapters.THERMAL.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('V. Тепловизор и сброс', 'V. The scope and the vent'));
  let y = ink.para(L('Веди тепловизор над капсулами: в его окне виден рисунок нагрева, а экран показывает температуру капсулы под центром окна.', 'Sweep the thermal scope over the capsules: its window shows the heat pattern, its screen the temperature of the capsule under the centre.'), 100, 320, PW - 200, 31) + 22;
  y = ink.para(L('ЛЁГКИЙ: подходит ровно одна капсула. СРЕДНИЙ и СЛОЖНЫЙ: подойдут две. Опасная из них — с УГЛОВАТЫМ символом. Круг и полумесяц — круглые, они не опасны.', 'EASY: exactly one capsule fits. NORMAL and HARD: two fit. The dangerous one has an ANGULAR symbol. Circle and crescent are round — not dangerous.'), 100, y, PW - 200, 31) + 22;
  y = ink.para(L('Нашёл — поверни красный вентиль у этой капсулы. Чужой вентиль — удар по взрывателю.', 'Found it — turn the red valve beside that capsule. Another valve is a strike on the fuse.'), 100, y, PW - 200, 31);
  ink.hand(L('Рисунок + градусы + символ. Всё три.', 'Pattern + degrees + symbol. All three.'), 140, y + 80, 42, '#6a2a1a', -.03); void x;
});
