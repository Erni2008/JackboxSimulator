// PHASE 1 diagnostic instruments for the junction box: analog meter, TEST CIRCUIT
// push-button and the read-only NORMAL / EMERGENCY mode selector. The fault shown
// is never decided here — it is supplied from outside (dev config now, puzzle later).
import * as T from 'three';
import {metal} from './surface';
import {rng} from '../manual/page-art';

export type Fault = 'overload' | 'short' | 'power';
export type Mode = 'normal' | 'emergency';

const tex = (w: number, h: number, draw: (x: CanvasRenderingContext2D) => void, srgb = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!); const t = new T.CanvasTexture(c); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 16; return t; };
export const Mats = (() => {
  let m: any = null;
  return () => m ||= {
    brass: metal('#b08a4a', {rough: .42}),
    bronze: metal('#6e5130', {rough: .55, repeat: 3}),
    iron: metal('#36302b', {rough: .72, metalness: .75, patina: false, repeat: 3}),
    black: new T.MeshPhysicalMaterial({color: '#141210', metalness: .2, roughness: .6}),
  };
})();
const FONT = "'IM Fell English SC', Georgia, serif", PICA = "'IM Fell DW Pica', Georgia, serif";

export type PlateStyle = 'brass' | 'enamel';
const TECH = "'Barlow Condensed', 'Arial Narrow', sans-serif", MONO = "'IBM Plex Mono', Menlo, monospace";
/** Industrial label plate. brass: text cut into tarnished brass and filled dark. enamel: ivory
 *  lettering on black-enamelled iron with a brass rim. Texture is rendered at 8 px/mm. */
export function labelPlate(text: string, w: number, h: number, _size = 44, style: PlateStyle = 'brass', opts: {mono?: boolean; screws?: boolean; sub?: string} = {}) {
  const pxw = Math.min(1024, Math.round(w * 8000)), pxh = Math.max(32, Math.round(pxw * h / w));
  const t = tex(pxw, pxh, x => {
    const W = x.canvas.width, H = x.canvas.height, r = rng(text.length * 7 + W);
    if (style === 'brass') { const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#8b6a36'); g.addColorStop(.5, '#b8945a'); g.addColorStop(1, '#6f5228'); x.fillStyle = g; }
    else { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1d1814'); g.addColorStop(1, '#0f0c0a'); x.fillStyle = g; }
    x.fillRect(0, 0, W, H);
    for (let i = 0; i < W * H / 260; i++) { x.fillStyle = `rgba(${r() < .6 ? '40,26,10' : '240,220,170'},${r() * (style === 'brass' ? .13 : .05)})`; x.fillRect(r() * W, r() * H, 2 + r() * 14, 1); }
    // rim: brass bevel line + worn corners
    const rim = Math.max(3, H * .07); x.strokeStyle = style === 'brass' ? 'rgba(40,25,8,.7)' : '#9b7638'; x.lineWidth = rim * .6; x.strokeRect(rim, rim, W - rim * 2, H - rim * 2);
    const screws = opts.screws ?? W / H > 3.2;
    if (screws) for (const sx of [rim * 3.4, W - rim * 3.4]) { const sr = H * .12, sy = H / 2; const sg = x.createRadialGradient(sx - sr * .3, sy - sr * .3, 1, sx, sy, sr); sg.addColorStop(0, '#d8b77a'); sg.addColorStop(1, '#5a4222'); x.fillStyle = sg; x.beginPath(); x.arc(sx, sy, sr, 0, 7); x.fill(); x.strokeStyle = '#2a1a08'; x.lineWidth = sr * .25; x.beginPath(); x.moveTo(sx - sr * .7, sy - sr * .3); x.lineTo(sx + sr * .7, sy + sr * .3); x.stroke(); }
    const inset = screws ? rim * 6.4 : rim * 2.4, avail = W - inset * 2;
    const main = opts.sub ? H * .5 : H * .62; let size = main; x.font = `${opts.mono ? 700 : 700} ${size}px ${opts.mono ? MONO : TECH}`;
    const track = opts.mono ? size * .06 : size * .1; const width = (s: string) => [...s].reduce((a, c) => a + x.measureText(c).width + track, -track);
    while (width(text) > avail && size > 6) { size *= .94; x.font = `700 ${size}px ${opts.mono ? MONO : TECH}`; }
    const cy = opts.sub ? H * .64 : H * .53, drawSpaced = (s: string, y: number, dx = 0) => { let px = W / 2 - width(s) / 2 + dx; for (const c of s) { x.fillText(c, px, y); px += x.measureText(c).width + track; } };
    x.textBaseline = 'middle'; x.textAlign = 'left';
    if (style === 'brass') { x.fillStyle = 'rgba(255,238,195,.45)'; drawSpaced(text, cy + size * .045, size * .03); x.fillStyle = '#1c1107'; drawSpaced(text, cy); }
    else { x.fillStyle = 'rgba(0,0,0,.6)'; drawSpaced(text, cy + size * .04); x.fillStyle = '#fff6dc'; drawSpaced(text, cy); }
    if (opts.sub) { const s2 = H * .17; x.font = `600 ${s2}px 'Cinzel', Georgia, serif`; x.fillStyle = style === 'brass' ? '#1c1107' : '#e6c784'; x.textAlign = 'center'; x.fillText(opts.sub, W / 2, H * .24); }
  });
  t.generateMipmaps = true; t.minFilter = T.LinearMipmapLinearFilter;
  const face = new T.MeshPhysicalMaterial({map: t, emissiveMap: t, emissive: '#ffffff', emissiveIntensity: style === 'brass' ? .25 : .5, metalness: style === 'brass' ? .75 : .35, roughness: style === 'brass' ? .45 : .5, clearcoat: style === 'enamel' ? .5 : 0, clearcoatRoughness: .4});
  const edge = style === 'brass' ? Mats().brass : Mats().iron;
  return new T.Mesh(new T.BoxGeometry(w, h, .0025), [edge, edge, edge, edge, face, edge]);
}

// ------------------------------------------------------------------ meter
export class AnalogMeter {
  group = new T.Group(); private needle = new T.Group(); private angle = 0; private target = 0; private vel = 0;
  private fault: Fault = 'power'; private testT = -1; private dur = 2; private seed = 0;
  /** value scale 0..10; red zone 8..10 */
  static readonly A0 = -Math.PI * .75; static readonly A1 = Math.PI * .75;
  constructor(public radius = .055) {
    const R = radius, M = Mats();
    const bezel = new T.Mesh(new T.TorusGeometry(R, R * .12, 14, 48), M.brass); bezel.castShadow = true; this.group.add(bezel);
    const cup = new T.Mesh(new T.CylinderGeometry(R * 1.02, R * 1.08, R * .35, 48, 1, true), M.bronze); cup.rotation.x = Math.PI / 2; cup.position.z = -R * .17; this.group.add(cup);
    const dial = new T.Mesh(new T.CircleGeometry(R * .98, 64), (() => { const d = this.dialTexture(); return new T.MeshStandardMaterial({map: d, emissiveMap: d, emissive: '#ffffff', emissiveIntensity: .55, roughness: .8}); })()); dial.position.z = -R * .05; this.group.add(dial);
    // needle with counterweight, pivoting at the dial centre
    const blade = new T.Mesh(new T.BoxGeometry(R * .025, R * .82, R * .01), new T.MeshStandardMaterial({color: '#1a0f08', roughness: .5})); blade.position.y = R * .36; this.needle.add(blade);
    const tipM = new T.Mesh(new T.BoxGeometry(R * .015, R * .14, R * .012), new T.MeshStandardMaterial({color: '#8e1b10', roughness: .5})); tipM.position.y = R * .73; this.needle.add(tipM);
    const cw = new T.Mesh(new T.CylinderGeometry(R * .06, R * .06, R * .02, 16), M.black); cw.rotation.x = Math.PI / 2; cw.position.y = -R * .1; this.needle.add(cw);
    this.needle.position.z = -R * .02; this.group.add(this.needle);
    const cap = new T.Mesh(new T.SphereGeometry(R * .07, 16, 8), M.brass); cap.scale.z = .5; this.group.add(cap);
    // scratched, slightly domed glass
    const glass = new T.Mesh(new T.SphereGeometry(R * 2.2, 32, 8, 0, Math.PI * 2, 0, Math.asin(.98 / 2.2)), new T.MeshPhysicalMaterial({color: '#ffffff', transparent: true, opacity: .14, roughness: .08, roughnessMap: this.scratches(), metalness: 0, clearcoat: 1, clearcoatRoughness: .25, depthWrite: false, envMapIntensity: 1.4}));
    glass.rotation.x = Math.PI / 2; glass.position.z = -R * 2.2 * Math.cos(Math.asin(.98 / 2.2)) + R * .06; this.group.add(glass);
    for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2, s = new T.Mesh(new T.CylinderGeometry(R * .07, R * .07, R * .05, 12), M.brass); s.rotation.x = Math.PI / 2; s.position.set(Math.cos(a) * R * 1.25, Math.sin(a) * R * 1.25, -R * .1); this.group.add(s); const sl = new T.Mesh(new T.BoxGeometry(R * .11, R * .02, R * .02), M.bronze); sl.position.copy(s.position).setZ(-R * .07); sl.rotation.z = a * 1.7; this.group.add(sl); }
    this.setAngle(0);
  }
  private dialTexture() {
    return tex(1024, 1024, x => {
      x.scale(2, 2); const c = 256; const g = x.createRadialGradient(c, c, 40, c, c, 256); g.addColorStop(0, '#ece0bd'); g.addColorStop(1, '#c8b383'); x.fillStyle = g; x.fillRect(0, 0, 512, 512);
      const r = rng(77); for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(120,80,30,${r() * .2})`; x.beginPath(); x.arc(r() * 512, r() * 512, 2 + r() * 12, 0, 7); x.fill(); }
      const ang = (v: number) => -Math.PI / 2 + AnalogMeter.A0 + (v / 10) * (AnalogMeter.A1 - AnalogMeter.A0);
      // warning zones: amber 6.5-8, red 8-10 (as painted arcs)
      for (const [a, b, col] of [[6.5, 8, 'rgba(196,140,30,.75)'], [8, 10, 'rgba(160,30,18,.85)']] as const) { x.strokeStyle = col; x.lineWidth = 26; x.beginPath(); x.arc(c, c, 178, ang(a), ang(b)); x.stroke(); }
      x.strokeStyle = '#2a1a0c'; x.lineWidth = 3; x.beginPath(); x.arc(c, c, 196, ang(0), ang(10)); x.stroke();
      for (let v = 0; v <= 10; v += .5) { const a = ang(v), big = v % 1 === 0; x.lineWidth = big ? 4 : 2; x.beginPath(); x.moveTo(c + Math.cos(a) * (big ? 164 : 178), c + Math.sin(a) * (big ? 164 : 178)); x.lineTo(c + Math.cos(a) * 196, c + Math.sin(a) * 196); x.stroke();
        if (big) { x.font = `700 44px 'Cinzel', serif`; x.fillStyle = '#120a03'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(v), c + Math.cos(a) * 132, c + Math.sin(a) * 132); } }
      x.textAlign = 'center'; x.fillStyle = '#120a03'; x.font = `700 36px ${FONT}`; x.fillText('AMPERES', c, c + 70); x.font = `600 24px ${FONT}`; x.fillText('HARTWELL · LONDON', c, c + 104);
      // fault legend along the outer rim (outside the needle's sweep)
      const arcText = (t: string, v: number, col: string) => { x.save(); x.fillStyle = col; x.font = `800 25px ${TECH}`; const a0 = ang(v), chars = [...t], step = .062; let a = a0 - (chars.length - 1) * step / 2;
        for (const ch of chars) { x.save(); x.translate(c + Math.cos(a) * 232, c + Math.sin(a) * 232); x.rotate(a + Math.PI / 2); x.textAlign = 'center'; x.fillText(ch, 0, 0); x.restore(); a += step; } x.restore(); };
      arcText('POWER FAILURE', 1.3, '#120a03'); arcText('SHORT CIRCUIT', 5, '#120a03'); arcText('OVERLOAD', 9, '#b01808');
    });
  }
  private scratches() { return tex(256, 256, x => { x.fillStyle = '#1a1a1a'; x.fillRect(0, 0, 256, 256); const r = rng(31); x.strokeStyle = '#d0d0d0'; for (let i = 0; i < 70; i++) { x.globalAlpha = .2 + r() * .6; x.lineWidth = .5 + r(); x.beginPath(); const px = r() * 256, py = r() * 256, a = r() * 7, l = 10 + r() * 90; x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); } }, false); }
  private setAngle(v: number) { this.needle.rotation.z = -(AnalogMeter.A0 + (T.MathUtils.clamp(v, -.3, 10.4) / 10) * (AnalogMeter.A1 - AnalogMeter.A0)); }
  /** externally supplied fault; does not start a test */
  setState(f: Fault) { this.fault = f; }
  get state() { return this.fault; }
  test(duration = 2) { this.testT = 0; this.dur = duration; this.seed = Math.random() * 100; }
  get testing() { return this.testT >= 0; }
  /** 0..1 progress of the running test, -1 when idle */
  get progress() { return this.testT < 0 ? -1 : this.testT / this.dur; }
  update(dt: number) {
    const now = performance.now() / 1000;
    if (this.testT >= 0) {
      this.testT += dt; const p = this.testT / this.dur, env = Math.min(1, p * 6) * Math.min(1, (1 - p) * 5);
      if (this.fault === 'overload') this.target = 9.1 + Math.sin(now * 31) * .25 + Math.sin(now * 13) * .2;                 // pinned in the red, trembling
      else if (this.fault === 'short') { const k = Math.floor(now * 9 + this.seed); const j = (Math.sin(k * 91.7) * .5 + .5); this.target = 1.5 + j * 7 + Math.sin(now * 47) * .6; } // erratic jumps
      else this.target = p < .18 ? 2.4 * Math.sin(p / .18 * Math.PI) : .25 * (1 - p);                                    // twitch, then collapses to zero
      this.target *= env; if (this.testT >= this.dur) this.testT = -1;
    } else this.target = 0;
    // damped spring: a real movement overshoots and settles
    const active = this.testT >= 0, k = active ? (this.fault === 'short' ? 260 : this.fault === 'overload' ? 170 : 90) : 90, c = active && this.fault === 'short' ? 9 : 13;
    this.vel += ((this.target - this.angle) * k - this.vel * c) * dt; this.angle += this.vel * dt; this.setAngle(this.angle);
  }
}

// ------------------------------------------------------------------ button
export class TestButton {
  group = new T.Group(); cap: T.Mesh; private press = 0; private pressT = 0; pick: T.Object3D[] = [];
  constructor() {
    const M = Mats();
    const bezel = new T.Mesh(new T.CylinderGeometry(.03, .033, .012, 32), M.bronze); bezel.rotation.x = Math.PI / 2; bezel.position.z = .006; this.group.add(bezel);
    const ring = new T.Mesh(new T.TorusGeometry(.024, .004, 10, 32), M.brass); ring.position.z = .013; this.group.add(ring);
    this.cap = new T.Mesh(new T.SphereGeometry(.02, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshPhysicalMaterial({color: '#9a7740', metalness: .92, roughness: .32, clearcoat: .2}));
    this.cap.rotation.x = Math.PI / 2; this.cap.scale.set(1, .55, 1); this.cap.position.z = .014; this.cap.castShadow = true; this.group.add(this.cap);
    const plate = labelPlate('TEST CIRCUIT', .1, .026, 46, 'enamel', {screws: true}); plate.position.set(0, -.05, .002); this.group.add(plate);
    this.pick.push(this.cap, bezel, ring, plate);
  }
  push() { this.pressT = .22; }
  update(dt: number) { this.pressT = Math.max(0, this.pressT - dt); const target = this.pressT > 0 ? 1 : 0; this.press += (target - this.press) * Math.min(1, dt * 30); this.cap.position.z = .014 - this.press * .0065; }
}

// ------------------------------------------------------------------ selector
export class ModeSelector {
  group = new T.Group(); private knob = new T.Group(); window = new T.Mesh(); private angle = 0; private target = 0; private shake = 0; pick: T.Object3D[] = []; mode: Mode = 'normal';
  constructor() {
    const M = Mats();
    const plate = new T.Mesh(new T.CylinderGeometry(.046, .046, .004, 40), M.bronze);
    const face = new T.Mesh(new T.CircleGeometry(.045, 48), new T.MeshPhysicalMaterial({metalness: .6, roughness: .5, emissive: '#6a4a22', emissiveIntensity: .5, map: tex(256, 256, x => {
      const g = x.createRadialGradient(128, 128, 10, 128, 128, 128); g.addColorStop(0, '#b18c52'); g.addColorStop(1, '#6e5129'); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
      x.save(); x.translate(128, 128); x.fillStyle = '#0e0802'; x.font = `800 30px ${TECH}`; x.textAlign = 'center';
      for (const [label, a] of [['NORMAL', -Math.PI / 4], ['EMERGENCY', Math.PI / 4]] as const) { x.save(); x.rotate(a); x.fillText(label, 0, -88); x.fillRect(-2, -78, 4, 14); x.restore(); }
      x.restore(); x.strokeStyle = 'rgba(40,25,8,.8)'; x.lineWidth = 4; x.beginPath(); x.arc(128, 128, 124, 0, 7); x.stroke(); })}));
    face.position.z = .0042; this.group.add(face);
    plate.rotation.x = Math.PI / 2; plate.position.z = .002; this.group.add(plate);
    // knob: fluted bakelite-black body with a brass pointer bar
    const body = new T.Mesh(new T.CylinderGeometry(.022, .025, .02, 12), M.black); body.rotation.x = Math.PI / 2; body.position.z = .014; this.knob.add(body);
    const bar = new T.Mesh(new T.BoxGeometry(.01, .05, .012), M.brass); bar.position.z = .022; this.knob.add(bar);
    const tip = new T.Mesh(new T.ConeGeometry(.006, .012, 3), M.brass); tip.position.set(0, .03, .022); this.knob.add(tip);
    this.knob.traverse(o => { (o as T.Mesh).castShadow = true; }); this.group.add(this.knob);
    this.window.position.set(0, -.062, .002); this.group.add(this.window);
    this.pick.push(plate, face, body, bar, tip, this.window);
  }
  /** set by the puzzle configuration only */
  /** set by the puzzle configuration only; the window plate spells the mode out (not colour-only) */
  setMode(m: Mode) { this.mode = m; this.target = m === 'normal' ? Math.PI / 4 : -Math.PI / 4;
    const plate = labelPlate(m === 'normal' ? 'NORMAL' : 'EMERGENCY', .09, .026, 40, 'enamel', {sub: 'MODE', screws: false});
    (this.window.geometry as any)?.dispose?.(); this.window.geometry = plate.geometry; this.window.material = plate.material; }
  /** the player can try it: it is locked, so it only judders against its detent */
  tryTurn() { this.shake = .35; }
  update(dt: number) { this.angle += (this.target - this.angle) * Math.min(1, dt * 8); this.shake = Math.max(0, this.shake - dt); this.knob.rotation.z = this.angle + Math.sin(this.shake * 70) * this.shake * .12; }
}
