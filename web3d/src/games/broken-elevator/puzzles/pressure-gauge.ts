// THE BROKEN VALVES — large analog PSI gauge: ivory dial 0–120 with the puzzle's green safe arc and a red top band,
// a mechanical needle with spring/damper inertia, scratched glass, and a faint green glow while the needle is in the zone.
import * as T from 'three';
import {L as tr} from '../i18n';
import {canvasTex, rng, TECH, type Mats} from './pressure-parts';

const A0 = -Math.PI * .75, A1 = Math.PI * .75;

export class PressureGauge {
  broken = false; private glass!: T.Mesh;
  group = new T.Group(); private needle = new T.Group(); private angle = A0; private vel = 0; private t = 0;
  private canvas = document.createElement('canvas'); private dial: T.CanvasTexture; private face: T.MeshStandardMaterial; private zone = [0, 0];

  constructor(public R: number, mats: Mats, hi: boolean) {
    const r = rng(9), R2 = R;
    const housing = new T.Mesh(new T.CylinderGeometry(R2 + .012, R2 + .016, .05, hi ? 64 : 40), mats.brass); housing.rotation.x = Math.PI / 2; housing.position.z = .047; this.group.add(housing);
    const bezel = new T.Mesh(new T.TorusGeometry(R2 + .006, .009, 12, hi ? 72 : 48), mats.brass); bezel.position.z = .074; this.group.add(bezel);
    this.canvas.width = this.canvas.height = 1024; this.dial = new T.CanvasTexture(this.canvas); this.dial.colorSpace = T.SRGBColorSpace; this.dial.anisotropy = 16; this.draw(40, 45);
    this.face = new T.MeshStandardMaterial({map: this.dial, emissiveMap: this.dial, emissive: '#ffffff', emissiveIntensity: .5, roughness: .75});
    const face = new T.Mesh(new T.CircleGeometry(R2, hi ? 72 : 48), this.face); face.position.z = .0725; this.group.add(face);
    const ink = new T.MeshStandardMaterial({color: '#140d07', roughness: .5});
    const blade = new T.Mesh(new T.BoxGeometry(.006, R2 * .86, .003), ink); blade.position.y = R2 * .36; this.needle.add(blade);
    const tail = new T.Mesh(new T.BoxGeometry(.01, R2 * .2, .003), ink); tail.position.y = -R2 * .08; this.needle.add(tail);
    const tip = new T.Mesh(new T.BoxGeometry(.004, R2 * .16, .0035), new T.MeshStandardMaterial({color: '#9e1d10', roughness: .5})); tip.position.y = R2 * .73; this.needle.add(tip);
    const cap = new T.Mesh(new T.CylinderGeometry(.011, .011, .008, 24), mats.brass); cap.rotation.x = Math.PI / 2; this.needle.add(cap); this.needle.position.z = .076; this.group.add(this.needle);
    const glass = new T.Mesh(new T.CircleGeometry(R2 + .002, 48), new T.MeshPhysicalMaterial({color: '#ffffff', transparent: true, opacity: .1, roughness: .12, metalness: 0, depthWrite: false, roughnessMap: canvasTex(256, 256, x => { x.fillStyle = '#1a1a1a'; x.fillRect(0, 0, 256, 256); x.strokeStyle = '#cfcfcf'; for (let i = 0; i < 50; i++) { x.globalAlpha = .2 + r() * .5; x.lineWidth = .5 + r(); x.beginPath(); const a = r() * 256, b = r() * 256; x.moveTo(a, b); x.lineTo(a + (r() - .5) * 90, b + (r() - .5) * 40); x.stroke(); } }, false)}));
    glass.position.z = .081; this.group.add(glass); this.glass = glass;
    for (let k = 0; k < 4; k++) { const sb = new T.Mesh(new T.CylinderGeometry(.005, .005, .006, 8), mats.brassDark); sb.rotation.x = Math.PI / 2; const a = k * Math.PI / 2 + Math.PI / 4; sb.position.set(Math.cos(a) * (R2 + .006), Math.sin(a) * (R2 + .006), .082); this.group.add(sb); }
  }

  /** dial artwork; redrawn only when the safe zone changes */
  draw(low: number, high: number) {
    if (this.zone[0] === low && this.zone[1] === high) return; this.zone = [low, high];
    const x = this.canvas.getContext('2d')!, c = 512, ang = (v: number) => -Math.PI / 2 + A0 + v / 120 * (A1 - A0), r = rng(7);
    const g = x.createRadialGradient(c, c, 60, c, c, 512); g.addColorStop(0, '#f1e6c8'); g.addColorStop(1, '#cdb88a'); x.fillStyle = g; x.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(120,80,30,${r() * .12})`; x.beginPath(); x.arc(r() * 1024, r() * 1024, 4 + r() * 22, 0, 7); x.fill(); }
    const arc = (a: number, b: number, rad: number, w: number, col: string) => { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.arc(c, c, rad, ang(a), ang(b)); x.stroke(); };
    arc(110, 120, 378, 52, 'rgba(176,24,10,.92)');
    arc(low - .4, high + .4, 378, 70, '#1f9a3a'); arc(low - .4, high + .4, 414, 7, '#0f5a20'); arc(low - .4, high + .4, 342, 7, '#0f5a20');
    arc(0, 120, 410, 7, '#20140a');
    for (let v = 0; v <= 120; v += 2) { const a = ang(v), big = v % 10 === 0, len = big ? 64 : v % 5 === 0 ? 44 : 28; x.strokeStyle = '#140c05'; x.lineWidth = big ? 9 : 4; x.beginPath(); x.moveTo(c + Math.cos(a) * 404, c + Math.sin(a) * 404); x.lineTo(c + Math.cos(a) * (404 - len), c + Math.sin(a) * (404 - len)); x.stroke(); }
    x.fillStyle = '#120a03'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `700 70px 'Cinzel', Georgia, serif`;
    for (let v = 0; v <= 120; v += 20) { const a = ang(v); x.fillText(String(v), c + Math.cos(a) * 285, c + Math.sin(a) * 285); }
    x.font = `800 64px ${TECH}`; x.fillText('PSI', c, c + 170);
    x.font = `800 46px ${TECH}`; x.fillStyle = '#0f5a20'; x.fillText(`${tr('НОРМА', 'SAFE')} ${low}–${high}`, c, c + 236);
    x.fillStyle = '#3a2412'; x.font = `600 30px 'Cinzel', Georgia, serif`; x.fillText('HARTWELL · LONDON', c, c - 170);
    this.dial.needsUpdate = true;
  }

  /** a line-noise knock: the needle jerks with the kick and settles through its inertia */
  kick(d: number) { this.vel += d * .09; }
  /** 120 PSI: the glass blows out and the needle tears past the stop */
  shatter() { this.broken = true; this.glass.visible = false; this.vel += 9; }
  repair() { this.broken = false; this.glass.visible = true; }
  /** psi: target pressure; jitter: 0..1 vibration (surge warning / critical); zone: needle inside the green arc */
  update(dt: number, psi: number, jitter: number, zone: boolean) {
    this.t += dt; const aim = this.broken ? A1 + .55 : A0 + Math.max(-1, Math.min(121, psi)) / 120 * (A1 - A0);
    const k = 70, damp = 2 * Math.sqrt(k) * .8; this.vel += (k * (aim - this.angle) - damp * this.vel) * dt; this.angle += this.vel * dt; // slightly under-damped: visible inertia
    this.needle.rotation.z = -(this.angle + Math.sin(this.t * 63) * .014 * jitter + Math.sin(this.t * 41) * .008 * jitter);
    this.face.emissive.set(zone ? '#c8ffd2' : '#ffffff'); this.face.emissiveIntensity += ((zone ? .85 : .5) - this.face.emissiveIntensity) * Math.min(1, dt * 8);
  }
}
