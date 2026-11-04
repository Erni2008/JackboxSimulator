// THE BROKEN VALVES — physical controls. Every control is a real 3D part with an oversized invisible hit target,
// driven by pointer drags (mouse / touch) or a tap:
//   Wheel      ratcheting handwheel: every clockwise quarter turn is one adjustment (tap = one quarter turn);
//              a jammed valve shudders and springs back.
//   Lever      two-position lever (FINE CONTROL, BYPASS): drag across or tap to throw it.
//   PushButton spring-return TEST button.
//   PullHandle EMERGENCY RELEASE T-handle: pull down (or tap); it stays down once used.
import * as T from 'three';
import {QUARTER, type Mats} from './pressure-parts';

export interface Feedback { click(): void; turn(): void; grind(): void; lever(): void; press(): void; pull(): void }
const screen = (o: T.Object3D, camera: T.Camera) => { const v = new T.Vector3().setFromMatrixPosition(o.matrixWorld).project(camera); return {x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight}; };
const hitDisc = (r: number, depth: number) => { const m = new T.Mesh(new T.CylinderGeometry(r, r, depth, 16), new T.MeshBasicMaterial({visible: false})); m.rotation.x = Math.PI / 2; return m; };

export abstract class Control {
  root = new T.Group(); hit!: T.Mesh; enabled = true; protected fx: Feedback | null = null;
  constructor(public id: string) {}
  setFeedback(fx: Feedback) { this.fx = fx; }
  abstract down(x: number, y: number, camera: T.Camera): void;
  abstract move(x: number, y: number): void;
  abstract up(tap: boolean): void;
  abstract update(dt: number): void;
}

/** ratcheting handwheel */
export class Wheel extends Control {
  spin = new T.Group(); private base = 0; private drag = 0; private shown = 0; private shake = 0; private cx = 0; private cy = 0; private last = 0; private dragging = false;
  constructor(id: string, color: string, mats: Mats, private onTurn: () => void) {
    super(id); const paint = mats.paint(color);
    const rim = new T.Mesh(new T.TorusGeometry(.052, .0085, 12, 40), paint); this.spin.add(rim);
    for (let k = 0; k < 2; k++) { const sp = new T.Mesh(new T.CylinderGeometry(.0045, .0045, .1, 8), paint); sp.rotation.z = k * QUARTER + Math.PI / 4; this.spin.add(sp); }
    const hub = new T.Mesh(new T.CylinderGeometry(.014, .014, .02, 16), mats.brass); hub.rotation.x = Math.PI / 2; this.spin.add(hub);
    const knob = new T.Mesh(new T.CylinderGeometry(.007, .009, .03, 12), mats.brass); knob.rotation.x = Math.PI / 2; knob.position.set(.045, .02, .014); this.spin.add(knob);
    const idx = new T.Mesh(new T.BoxGeometry(.008, .02, .006), new T.MeshStandardMaterial({color: '#f4ecd8', emissive: '#f4ecd8', emissiveIntensity: .35})); idx.position.set(0, .061, .006); this.spin.add(idx);
    this.root.add(this.spin); this.hit = hitDisc(.064, .08); this.root.add(this.hit);
  }
  down(x: number, y: number, camera: T.Camera) { const c = screen(this.spin, camera); this.cx = c.x; this.cy = c.y; this.last = Math.atan2(y - c.y, x - c.x); this.drag = 0; this.dragging = true; }
  move(x: number, y: number) {
    if (!this.dragging) return; const a = Math.atan2(y - this.cy, x - this.cx); let d = a - this.last; d = Math.atan2(Math.sin(d), Math.cos(d)); this.last = a;
    // screen angle grows clockwise; the ratchet only takes clockwise travel, anticlockwise just lets the wheel ease back
    this.drag = Math.max(-.25, this.drag + d);
    while (this.drag >= QUARTER) { this.drag -= QUARTER; this.base += QUARTER; this.fx?.click(); this.fx?.turn(); if (this.enabled) this.onTurn(); }
  }
  up(tap: boolean) { if (!this.dragging) return; this.dragging = false; if (tap && this.enabled) { this.base += QUARTER; this.fx?.click(); this.fx?.turn(); this.onTurn(); } this.drag = 0; }
  /** the server says this turn did nothing: shudder and spring back a quarter */
  jam() { this.base -= QUARTER; this.shake = 1; this.fx?.grind(); }
  update(dt: number) { const target = this.base + (this.dragging ? this.drag : 0); this.shown += (target - this.shown) * (1 - Math.exp(-dt * (this.dragging ? 30 : 12))); this.shake = Math.max(0, this.shake - dt * 2.2);
    this.spin.rotation.z = -this.shown + Math.sin(performance.now() * .09) * .07 * this.shake; }
}

/** two-position lever (angles measured from straight up, clockwise positive) */
export class Lever extends Control {
  arm = new T.Group(); pos = 0; private shown = 0; private dragAngle = 0; private dragging = false; private cx = 0; private cy = 0;
  constructor(id: string, color: string, mats: Mats, private angles: [number, number], private onSet: (pos: number) => void, length = .085) {
    super(id); const paint = mats.paint(color);
    const hub = new T.Mesh(new T.CylinderGeometry(.016, .016, .016, 20), mats.brass); hub.rotation.x = Math.PI / 2; this.arm.add(hub);
    const bar = new T.Mesh(new T.BoxGeometry(.016, length, .01), paint); bar.position.y = length / 2 + .004; this.arm.add(bar);
    const grip = new T.Mesh(new T.CylinderGeometry(.011, .011, .032, 14), paint); grip.position.set(0, length + .006, 0); grip.rotation.z = QUARTER; this.arm.add(grip);
    this.root.add(this.arm); this.hit = hitDisc(length + .02, .06); this.root.add(this.hit); this.shown = angles[0];
  }
  set(pos: number) { if (!this.dragging) this.pos = pos; }
  down(x: number, y: number, camera: T.Camera) { const c = screen(this.arm, camera); this.cx = c.x; this.cy = c.y; this.dragAngle = this.angles[this.pos]; this.dragging = true; }
  move(x: number, y: number) { if (!this.dragging) return; const a = Math.atan2(x - this.cx, this.cy - y); const [lo, hi] = [Math.min(...this.angles), Math.max(...this.angles)]; this.dragAngle = Math.max(lo - .1, Math.min(hi + .1, a)); }
  up(tap: boolean) {
    if (!this.dragging) return; this.dragging = false; if (!this.enabled) return;
    const next = tap ? 1 - this.pos : Math.abs(this.dragAngle - this.angles[1]) < Math.abs(this.dragAngle - this.angles[0]) ? 1 : 0;
    if (next !== this.pos) { this.pos = next; this.fx?.lever(); this.onSet(next); }
  }
  update(dt: number) { const target = this.dragging ? this.dragAngle : this.angles[this.pos]; this.shown += (target - this.shown) * (1 - Math.exp(-dt * (this.dragging ? 30 : 16))); this.arm.rotation.z = -this.shown; }
}

/** spring-return push button with a brass collar */
export class PushButton extends Control {
  cap: T.Mesh; private depth = 0;
  constructor(id: string, mats: Mats, private onPress: () => void, color = '#7a1a10', scale = 1) {
    super(id); const collar = new T.Mesh(new T.CylinderGeometry(.03 * scale, .034 * scale, .016, 28), mats.brassDark); collar.rotation.x = QUARTER; collar.position.z = .008; this.root.add(collar);
    this.cap = new T.Mesh(new T.SphereGeometry(.024 * scale, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({color, metalness: .3, roughness: .35, emissive: color, emissiveIntensity: .25})); this.cap.rotation.x = QUARTER; this.cap.position.z = .016; this.root.add(this.cap);
    this.hit = hitDisc(.045 * Math.max(1, scale * .9), .06); this.hit.position.z = .02; this.root.add(this.hit);
  }
  down() {} move() {}
  up(tap: boolean) { if (!tap || !this.enabled) return; this.depth = 1; this.fx?.press(); this.onPress(); }
  update(dt: number) { this.depth = Math.max(0, this.depth - dt * 2.4); this.cap.position.z = .016 - .009 * Math.min(1, this.depth * 2); }
}

/** EMERGENCY RELEASE T-handle on a slide: pull down once, stays down */
export class PullHandle extends Control {
  slide = new T.Group(); used = false; private pull = 0; private dragging = false; private y0 = 0;
  constructor(id: string, mats: Mats, private onPull: () => void) {
    super(id); const red = mats.paint('#a3150c');
    const rod = new T.Mesh(new T.CylinderGeometry(.006, .006, .06, 10), mats.bolt); rod.position.y = .03; this.slide.add(rod);
    const bar = new T.Mesh(new T.CylinderGeometry(.011, .011, .075, 14), red); bar.rotation.z = QUARTER; this.slide.add(bar);
    for (const s of [-1, 1]) { const end = new T.Mesh(new T.SphereGeometry(.012, 12, 8), red); end.position.x = s * .038; this.slide.add(end); }
    this.slide.position.z = .03; this.root.add(this.slide); this.hit = hitDisc(.06, .07); this.hit.position.z = .03; this.root.add(this.hit);
  }
  setUsed(u: boolean) { if (u) { this.used = true; } }
  down(_x: number, y: number) { this.dragging = true; this.y0 = y; }
  move(_x: number, y: number) { if (!this.dragging || this.used) return; this.pull = Math.max(0, Math.min(1, (y - this.y0) / 70)); }
  up(tap: boolean) { if (!this.dragging) return; this.dragging = false; if (!this.enabled || this.used) { this.pull = 0; return; }
    if (tap || this.pull > .6) { this.used = true; this.fx?.pull(); this.onPull(); } else this.pull = 0; }
  update(dt: number) { const target = this.used ? 1 : this.pull; const cur = -this.slide.position.y / .05; const next = cur + (target - cur) * (1 - Math.exp(-dt * 18)); this.slide.position.y = -.05 * next; this.slide.rotation.x = next * .25; }
}

/** pipe CLAMP for the cracked coupling: tap the joint to bolt a split brass clamp around it (stays fitted) */
export class PipeClamp extends Control {
  band = new T.Group(); fitted = false; private k = 0;
  constructor(id: string, mats: Mats, private onFit: () => void) {
    super(id);
    for (const s of [-1, 1]) { const half = new T.Mesh(new T.CylinderGeometry(.028, .028, .036, 20, 1, true, s > 0 ? 0 : Math.PI, Math.PI), mats.brass); half.rotation.z = QUARTER; this.band.add(half);
      const lug = new T.Mesh(new T.BoxGeometry(.012, .03, .016), mats.brassDark); lug.position.set(0, s * .03, 0); this.band.add(lug);
      const bolt = new T.Mesh(new T.CylinderGeometry(.004, .004, .03, 8), mats.bolt); bolt.position.set(0, s * .03, 0); bolt.rotation.x = QUARTER; this.band.add(bolt); }
    this.band.scale.setScalar(.001); this.band.visible = false; this.root.add(this.band);
    this.hit = new T.Mesh(new T.SphereGeometry(.042, 12, 8), new T.MeshBasicMaterial({visible: false})); this.root.add(this.hit);
  }
  set(fitted: boolean) { if (fitted) this.fitted = true; }
  down() {} move() {}
  up(tap: boolean) { if (!tap || !this.enabled || this.fitted) return; this.fitted = true; this.fx?.lever(); this.onFit(); }
  update(dt: number) { this.k += ((this.fitted ? 1 : 0) - this.k) * (1 - Math.exp(-dt * 10)); this.band.visible = this.k > .01; this.band.scale.setScalar(Math.max(.001, .6 + .4 * this.k)); this.band.rotation.x = (1 - this.k) * 1.2; }
}
