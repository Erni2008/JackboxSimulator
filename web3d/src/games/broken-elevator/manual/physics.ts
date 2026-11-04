// Single rigid body (the closed book, a 18×4×25 cm box) against the static planes
// of the cage: floor + four walls. Sequential impulses on the 8 corners with
// Coulomb friction, restitution, and sleeping. The project has no physics engine
// and the book is the only dynamic body, so this avoids pulling Rapier's WASM
// (~2 MB) onto phones; swap in Rapier when the elevator has more dynamic props.
import * as T from 'three';

export interface Plane { n: T.Vector3; d: number; restitution: number; friction: number; material: 'metal' | 'wood' }
export interface Impact { speed: number; material: string; point: T.Vector3 }

export class BookBody {
  pos = new T.Vector3(); quat = new T.Quaternion(); vel = new T.Vector3(); ang = new T.Vector3();
  invMass: number; invInertiaLocal: T.Vector3; sleeping = true; private still = 0; planes: Plane[] = [];
  onimpact = (i: Impact) => {}; private lastImpact = new Map<number, number>(); private time = 0;
  constructor(public half: T.Vector3, mass = 1.15) {
    this.invMass = 1 / mass; const [x, y, z] = [half.x * 2, half.y * 2, half.z * 2];
    this.invInertiaLocal = new T.Vector3(12 / (mass * (y * y + z * z)), 12 / (mass * (x * x + z * z)), 12 / (mass * (x * x + y * y)));
  }
  wake() { this.sleeping = false; this.still = 0; }
  private invI(v: T.Vector3, out: T.Vector3) { // world-space inverse inertia applied to v
    const qi = this.quat.clone().invert(); out.copy(v).applyQuaternion(qi).multiply(this.invInertiaLocal).applyQuaternion(this.quat); return out;
  }
  step(dt: number) {
    if (this.sleeping) return; const sub = 4, h = dt / sub;
    for (let s = 0; s < sub; s++) this.substep(h);
    const e = this.vel.lengthSq() + this.ang.lengthSq() * .02;
    this.still = e < .0009 ? this.still + dt : 0; if (this.still > .45) { this.sleeping = true; this.vel.set(0, 0, 0); this.ang.set(0, 0, 0); }
  }
  private substep(h: number) {
    this.time += h; this.vel.y -= 9.81 * h;
    // light air drag so a spinning book does not look like it is in vacuum
    this.vel.multiplyScalar(1 - .05 * h); this.ang.multiplyScalar(1 - .2 * h);
    const corner = new T.Vector3(), r = new T.Vector3(), vp = new T.Vector3(), tmp = new T.Vector3(), tmp2 = new T.Vector3(), t = new T.Vector3();
    for (let iter = 0; iter < 3; iter++) for (let pi = 0; pi < this.planes.length; pi++) {
      const pl = this.planes[pi];
      for (let c = 0; c < 8; c++) {
        corner.set(c & 1 ? this.half.x : -this.half.x, c & 2 ? this.half.y : -this.half.y, c & 4 ? this.half.z : -this.half.z).applyQuaternion(this.quat).add(this.pos);
        const depth = pl.d - corner.dot(pl.n); if (depth < 0) continue;
        r.subVectors(corner, this.pos); vp.copy(this.ang).cross(r).add(this.vel); const vn = vp.dot(pl.n);
        // positional correction (split impulse style, no energy gain)
        this.pos.addScaledVector(pl.n, depth * .35);
        if (vn >= 0) continue;
        if (iter === 0 && -vn > .35) { const key = pi * 8 + c, last = this.lastImpact.get(key) || -1; if (this.time - last > .08) { this.lastImpact.set(key, this.time); this.onimpact({speed: -vn, material: pl.material, point: corner.clone()}); } }
        const rn = tmp.copy(r).cross(pl.n), k = this.invMass + this.invI(rn, tmp2).cross(r).dot(pl.n);
        const e = -vn > .6 ? pl.restitution : 0, jn = -(1 + e) * vn / k, J = t.copy(pl.n).multiplyScalar(jn);
        this.applyImpulse(J, r);
        // friction
        vp.copy(this.ang).cross(r).add(this.vel); const vt = vp.clone().addScaledVector(pl.n, -vp.dot(pl.n)), vtl = vt.length();
        if (vtl > 1e-6) { const dir = vt.divideScalar(vtl), rt = tmp.copy(r).cross(dir), kt = this.invMass + this.invI(rt, tmp2).cross(r).dot(dir); const jt = Math.min(vtl / kt, pl.friction * jn); this.applyImpulse(dir.multiplyScalar(-jt), r); }
      }
    }
    this.pos.addScaledVector(this.vel, h);
    const w = this.ang, dq = new T.Quaternion(w.x * h * .5, w.y * h * .5, w.z * h * .5, 0).multiply(this.quat); this.quat.x += dq.x; this.quat.y += dq.y; this.quat.z += dq.z; this.quat.w += dq.w; this.quat.normalize();
  }
  private applyImpulse(J: T.Vector3, r: T.Vector3) { this.vel.addScaledVector(J, this.invMass); const dw = new T.Vector3().copy(r).cross(J); this.ang.add(this.invI(dw, new T.Vector3())); }
}
