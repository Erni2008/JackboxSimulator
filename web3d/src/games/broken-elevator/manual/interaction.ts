// Player interaction with the manual: pick up, open, read (zoom / pan / page focus),
// turn pages (swipe on touch, corner click on desktop, arrow keys), close, drop.
import * as T from 'three';
import {EngineersManual, W, TH, H} from './book';
import {BookBody, type Plane} from './physics';
import type {BookAudio} from './audio';

export type HoldState = 'rest' | 'lifting' | 'held' | 'reading' | 'releasing' | 'falling';
const easeIO = (t: number) => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

export class ManualInteraction {
  state: HoldState = 'rest'; body: BookBody; zoom = 1; zoomTarget = 1; focusSide = 0; pan = new T.Vector2(); panTarget = new T.Vector2();
  private lift = {t: 0, fromP: new T.Vector3(), fromQ: new T.Quaternion()}; private ray = new T.Raycaster(); private ndc = new T.Vector2();
  private pointers = new Map<number, {x: number; y: number; sx: number; sy: number; t: number}>(); private pinch0 = 0; private zoom0 = 1; private lastTap = 0;
  private sway = 0; private handP = new T.Vector3(); private handQ = new T.Quaternion(); private dropAfterClose = false;
  onstate = (s: HoldState) => {};
  constructor(public book: EngineersManual, public camera: T.PerspectiveCamera, public dom: HTMLElement, public audio: BookAudio, planes: Plane[]) {
    this.body = new BookBody(new T.Vector3(W / 2, TH / 2, H / 2)); this.body.planes = planes;
    this.body.onimpact = i => this.audio.play('impactMetal', i.speed / 2.2);
    this.bind();
  }
  get portrait() { return this.camera.aspect < .9; }
  place(p: T.Vector3, q: T.Quaternion) { this.body.pos.copy(p); this.body.quat.copy(q); this.body.vel.set(0, 0, 0); this.body.ang.set(0, 0, 0); this.body.sleeping = true; this.apply(); }
  private apply() { this.book.root.position.copy(this.body.pos); this.book.root.quaternion.copy(this.body.quat); }
  private set(s: HoldState) { this.state = s; if ((s === 'rest' || s === 'falling') && ManualInteraction.holder === this) ManualInteraction.holder = null; if (s !== 'held' && s !== 'reading') this.lowered = false; this.onstate(s); }
  /** book held low in one hand (still open if it was): the view and the panel stay usable */
  lowered = false; private lowK = 0; onlower = (l: boolean) => {};
  setLowered(l: boolean) { if (!(this.state === 'held' || this.state === 'reading') || l === this.lowered) return; this.lowered = l; this.audio.play('pickup'); this.onlower(l); }

  // ------------------------------------------------------------- actions
  /** only one book in hand: the engineering manual and the alchemist's journal never leave the shelf together */
  static holder: ManualInteraction | null = null; disabled = false;
  /** split view: the book keeps to the left half of the screen and only listens there */ splitOn = false; private splitK = 0;
  pickUp() { if (!['rest', 'falling'].includes(this.state) || this.disabled || (ManualInteraction.holder && ManualInteraction.holder !== this)) return; ManualInteraction.holder = this; this.lift.t = 0; this.lift.fromP.copy(this.book.root.position); this.lift.fromQ.copy(this.book.root.quaternion); this.body.sleeping = true; this.set('lifting'); this.audio.play('pickup'); }
  open() { if (this.state !== 'held' || this.book.busy) return; this.book.open(); this.set('reading'); this.focusSide = this.portrait ? 1 : 0; this.zoomTarget = 1; this.pan.set(0, 0); }
  close() { if (this.state !== 'reading') return; this.book.close(); this.zoomTarget = 1; this.focusSide = 0; this.set('held'); }
  drop() {
    if (this.state === 'reading') { this.book.close(.42); this.dropAfterClose = true; this.zoomTarget = 1; this.focusSide = 0; this.set('releasing'); return; }
    if (this.state !== 'held' && this.state !== 'lifting') return; this.release();
  }
  private release() {
    this.body.pos.copy(this.book.root.position); this.body.quat.copy(this.book.root.quaternion);
    const fwd = new T.Vector3(); this.camera.getWorldDirection(fwd); fwd.y = 0; fwd.normalize();
    this.body.vel.copy(fwd).multiplyScalar(.25 + Math.random() * .2).add(new T.Vector3(0, -.15, 0));
    this.body.ang.set((Math.random() - .5) * 5, (Math.random() - .5) * 3, (Math.random() - .5) * 5);
    this.body.wake(); this.audio.play('drop'); this.set('falling');
  }
  turn(dir: number) {
    if (this.state !== 'reading' || this.lowered) return;
    if (this.portrait && this.zoomTarget > 1.05) { // single-page focus: move between the two pages before turning the leaf
      if (dir > 0 && this.focusSide < 0) { this.focusSide = 1; return; }
      if (dir < 0 && this.focusSide > 0) { this.focusSide = -1; return; }
      if (this.book.turn(dir)) this.focusSide = dir > 0 ? -1 : 1; return;
    }
    this.book.turn(dir);
  }

  // ------------------------------------------------------------- pose
  private readingRot = new T.Quaternion().setFromEuler(new T.Euler(Math.PI / 2 - .16, 0, 0));
  private heldRot = new T.Quaternion().setFromEuler(new T.Euler(Math.PI / 2 - .22, -.12, -.04));
  /** distance at which a w×h rectangle fits the view with a margin */
  private fit(w: number, h: number, margin: number) { const v = T.MathUtils.degToRad(this.camera.fov) / 2, hv = Math.atan(Math.tan(v) * this.camera.aspect); return Math.max(h / 2 / Math.tan(v), w / 2 / Math.tan(hv)) * margin; }
  /** zoom that makes a single page fill the view */
  pageZoom() { const both = this.fit(2 * W + TH, H, 1.08), one = this.fit(W, H, 1.06); return Math.max(1, both / one); }
  private hand(dt: number) {
    const o = this.book.openness, readingFit = this.fit(2 * W + TH, H, 1.1), closedFit = Math.max(this.fit(W, H, 1.5), .34);
    // portrait: default to one page at a time so text stays readable
    if (this.state === 'reading' && this.portrait && this.focusSide !== 0 && this.zoomTarget < this.pageZoom() * .98 && !this.pointers.size) this.zoomTarget = Math.max(this.zoomTarget, this.pageZoom());
    this.zoom += (this.zoomTarget - this.zoom) * Math.min(1, dt * 7);
    const pageX = this.focusSide * (W / 2 + .003) * (this.zoom > 1.05 ? 1 : 0);
    this.panTarget.x = T.MathUtils.clamp(this.panTarget.x, -W, W); this.panTarget.y = T.MathUtils.clamp(this.panTarget.y, -H / 2, H / 2);
    const target = new T.Vector2(this.zoomTarget > 1.05 ? pageX + this.panTarget.x : 0, this.zoomTarget > 1.05 ? this.panTarget.y : 0);
    this.pan.lerp(target, Math.min(1, dt * 8));
    const dist = T.MathUtils.lerp(closedFit, readingFit, o) / this.zoom;
    this.sway += dt; const s = this.sway, breath = new T.Euler(Math.sin(s * 1.3) * .006 + Math.sin(s * 3.1) * .002, Math.sin(s * .9) * .006, Math.sin(s * 1.7) * .004);
    const rot = this.heldRot.clone().slerp(this.readingRot, o).multiply(new T.Quaternion().setFromEuler(breath));
    this.handQ.copy(this.camera.quaternion).multiply(rot);
    const offset = new T.Vector3(-this.pan.x, 0, -this.pan.y).applyQuaternion(this.handQ);
    // split view (the bomb's notebook beside the case): the book shrinks into the left half of the screen
    this.splitK += ((this.splitOn ? 1 : 0) - this.splitK) * Math.min(1, dt * 7); const sd = dist * (1 + this.splitK * 1.15), half = sd * Math.tan(T.MathUtils.degToRad(this.camera.fov) / 2) * this.camera.aspect;
    this.handP.set(-half * .5 * this.splitK, -.005 * (1 - o), -sd).applyQuaternion(this.camera.quaternion).add(this.camera.position).add(offset);
    // lowered: the book drops to the lower-left of the view, tilted toward the eyes like a book held at the hip
    this.lowK += ((this.lowered ? 1 : 0) - this.lowK) * Math.min(1, dt * 9);
    if (this.lowK > .001) { const k = this.lowK * this.lowK * (3 - 2 * this.lowK);
      const low = new T.Vector3(-.2 - .08 * o, -.3, -.5).applyQuaternion(this.camera.quaternion).add(this.camera.position);
      const lowQ = this.camera.quaternion.clone().multiply(new T.Quaternion().setFromEuler(new T.Euler(Math.PI / 2 - .95, .35, .25)));
      this.handP.lerp(low, k); this.handQ.slerp(lowQ, k); }
  }

  update(dt: number) {
    this.book.update(dt); this.hand(dt);
    switch (this.state) {
      case 'rest': case 'falling': this.body.step(Math.min(dt, 1 / 30)); this.apply(); if (this.state === 'falling' && this.body.sleeping) this.set('rest'); break;
      case 'lifting': {
        this.lift.t = Math.min(1, this.lift.t + dt / .75); const e = easeIO(this.lift.t);
        const p = this.lift.fromP.clone().lerp(this.handP, e); p.y += Math.sin(Math.PI * e) * .08; this.book.root.position.copy(p);
        this.book.root.quaternion.copy(this.lift.fromQ).slerp(this.handQ, easeIO(Math.min(1, this.lift.t * 1.15)));
        if (this.lift.t >= 1) this.set('held'); break; }
      case 'held': case 'reading': case 'releasing':
        this.book.root.position.lerp(this.handP, Math.min(1, dt * 12)); this.book.root.quaternion.slerp(this.handQ, Math.min(1, dt * 12));
        if (this.state === 'releasing' && this.book.isClosed) { this.dropAfterClose = false; this.release(); }
        break;
    }
  }

  // ------------------------------------------------------------- input
  private pick(x: number, y: number) {
    const r = this.dom.getBoundingClientRect(); this.ndc.set((x - r.left) / r.width * 2 - 1, -(y - r.top) / r.height * 2 + 1); this.ray.setFromCamera(this.ndc, this.camera);
    return this.ray.intersectObject(this.book.root, true)[0] || null;
  }
  tap(x: number, y: number) {
    const hit = this.pick(x, y);
    if (this.state === 'rest' || this.state === 'falling') { if (hit) this.pickUp(); return; }
    if (this.lowered) { if (hit) this.setLowered(false); return; }
    if (this.state === 'held') { if (hit) this.open(); return; }
    if (this.state === 'reading' && hit) {
      const ph = this.book.pageHit(hit); if (!ph) return;
      // the whole page is the control: right page forward, left page back.
      // portrait single-page view shows one page, so its right/left half decides.
      if (this.portrait && this.zoomTarget > 1.05) { const r = this.dom.getBoundingClientRect(); this.turn(x - r.left > r.width / 2 ? 1 : -1); }
      else this.turn(ph.side);
    }
  }
  private bind() {
    const el = this.dom;
    el.addEventListener("pointerdown", e => { if (this.splitOn && e.clientX > innerWidth * .5) return; try { el.setPointerCapture?.(e.pointerId); } catch {} this.audio.unlock(); this.pointers.set(e.pointerId, {x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now()}); if (this.pointers.size === 2) { const [a, b] = [...this.pointers.values()]; this.pinch0 = Math.hypot(a.x - b.x, a.y - b.y); this.zoom0 = this.zoomTarget; } });
    el.addEventListener('pointermove', e => {
      const p = this.pointers.get(e.pointerId); if (!p) { this.hover(e.clientX, e.clientY); return; } const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
      if (this.pointers.size === 2 && this.state === 'reading') { const [a, b] = [...this.pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); this.zoomTarget = T.MathUtils.clamp(this.zoom0 * d / Math.max(20, this.pinch0), 1, 3.2); return; }
      // drag-to-pan only when zoomed and the gesture is not a quick horizontal swipe
      if (this.state === 'reading' && this.zoomTarget > 1.05 && this.pointers.size === 1) { const k = this.metersPerPixel(); this.panTarget.x -= dx * k * (this.portrait ? 0 : 1); this.panTarget.y -= dy * k; }
    });
    const up = (e: PointerEvent) => {
      const p = this.pointers.get(e.pointerId); if (!p) return; const wasPinch = this.pointers.size > 1; this.pointers.delete(e.pointerId); if (wasPinch) return;
      const dx = e.clientX - p.sx, dy = e.clientY - p.sy, dt = performance.now() - p.t;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3 && dt < 700) { if (this.state === 'reading' && (this.zoomTarget <= 1.05 || this.portrait)) this.turn(dx < 0 ? 1 : -1); return; }
      if (Math.hypot(dx, dy) < 12 && dt < 450) this.tap(e.clientX, e.clientY);
    };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', e => this.pointers.delete(e.pointerId));
    el.addEventListener('wheel', e => { if (this.state !== 'reading' || this.lowered || (this.splitOn && e.clientX > innerWidth * .5)) return; e.preventDefault(); this.zoomTarget = T.MathUtils.clamp(this.zoomTarget * Math.exp(-e.deltaY * .0015), 1, 3.2); if (this.zoomTarget > 1.05 && !this.portrait) { const hit = this.pick(e.clientX, e.clientY), ph = hit && this.book.pageHit(hit); if (ph && this.focusSide === 0) this.focusSide = ph.side; } if (this.zoomTarget <= 1.05) { this.focusSide = this.portrait ? this.focusSide : 0; this.panTarget.set(0, 0); } }, {passive: false});
    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') this.turn(1); else if (e.key === 'ArrowLeft') this.turn(-1);
      else if (e.key === ' ' || e.key === 'Enter') { if (this.state === 'rest') this.pickUp(); else if (this.state === 'held') this.open(); else if (this.state === 'reading') this.close(); }
      else if (e.key === 'Escape' || e.key.toLowerCase() === 'q') this.drop();
    });
  }
  private toggleZoom(x: number, y: number) {
    if (this.zoomTarget > 1.05 && !this.portrait) { this.zoomTarget = 1; this.focusSide = 0; this.panTarget.set(0, 0); return; }
    const hit = this.pick(x, y), ph = hit && this.book.pageHit(hit); if (!ph) return; this.focusSide = ph.side;
    this.zoomTarget = this.portrait ? (this.zoomTarget > this.pageZoom() * 1.2 ? this.pageZoom() : this.pageZoom() * 1.7) : this.pageZoom() * 1.15;
    this.panTarget.set(0, (ph.v - .5) * H * (this.portrait ? 1 : .6));
  }
  private metersPerPixel() { const d = this.book.root.position.distanceTo(this.camera.position); return 2 * d * Math.tan(T.MathUtils.degToRad(this.camera.fov) / 2) / this.dom.clientHeight; }
  private hover(x: number, y: number) { const hit = this.pick(x, y); let cursor = 'default'; if (hit) { if (this.state === 'rest' || this.state === 'held' || this.state === 'falling') cursor = 'pointer'; else if (this.state === 'reading') { const ph = this.book.pageHit(hit); if (ph && this.book.canTurn(ph.side)) cursor = ph.side > 0 ? 'e-resize' : 'w-resize'; } } this.dom.style.cursor = cursor; }
}
