// THE HOST'S SUITCASE — the handheld scanner shared by mechanisms III (X-ray) and V (thermal).
// A ring-shaped scanner head is dragged over a bay; only the disc under it is "seen through": shells are cut away
// there (cutaway 'outside' keeps them everywhere else) and the hidden layer is drawn only there ('inside').
import * as T from 'three';

export interface ScanUniforms { uScanP: {value: T.Vector3}; uScanN: {value: T.Vector3}; uScanR: {value: number} }
export const makeScanUniforms = (r: number): ScanUniforms => ({uScanP: {value: new T.Vector3(1e4, 0, 0)}, uScanN: {value: new T.Vector3(0, 1, 0)}, uScanR: {value: r}});

/** patches a material so it is drawn only inside (or only outside) the scanner window */
export function cutaway<M extends T.Material>(m: M, u: ScanUniforms, inside: boolean): M {
  m.onBeforeCompile = sh => { Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vScanW;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvScanW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vScanW; uniform vec3 uScanP; uniform vec3 uScanN; uniform float uScanR;')
      .replace('void main() {', `void main() { vec3 sd = vScanW - uScanP; sd -= dot(sd, uScanN) * uScanN; if (${inside ? 'length(sd) > uScanR' : 'length(sd) < uScanR'}) discard;`); };
  m.customProgramCacheKey = () => 'cutaway-' + (inside ? 'in' : 'out'); return m;
}

/** the scanner head: a brass ring with a tinted glass, hovering a little above the bay */
export class ScanHead {
  readonly group = new T.Group(); private glass: T.MeshBasicMaterial; private lamp: T.MeshBasicMaterial; private geos: T.BufferGeometry[] = []; private mats: T.Material[] = [];
  /** local position on the bay plane (x, z) */ x = 0; z = 0; on = false; private hover = 0;
  constructor(readonly r: number, tint: string, readonly u: ScanUniforms, readonly lift = .028) {
    const ring = new T.Mesh(this.g(new T.TorusGeometry(r, r * .12, 10, 48)), this.m(new T.MeshStandardMaterial({color: '#b08a48', metalness: 1, roughness: .3}))); ring.rotation.x = Math.PI / 2; this.group.add(ring);
    this.glass = this.m(new T.MeshBasicMaterial({color: tint, transparent: true, opacity: .16, depthWrite: false, blending: T.AdditiveBlending})); const g = new T.Mesh(this.g(new T.CircleGeometry(r, 40)), this.glass); g.rotation.x = -Math.PI / 2; this.group.add(g);
    const handle = new T.Mesh(this.g(new T.CylinderGeometry(r * .16, r * .2, r * 1.6, 10)), this.m(new T.MeshStandardMaterial({color: '#2a2622', metalness: .6, roughness: .5}))); handle.rotation.z = Math.PI / 2; handle.position.set(r * 1.85, 0, 0); this.group.add(handle);
    this.lamp = this.m(new T.MeshBasicMaterial({color: tint})); const l = new T.Mesh(this.g(new T.SphereGeometry(r * .1, 8, 6)), this.lamp); l.position.set(r * 1.2, r * .1, 0); this.group.add(l);
    this.group.visible = false;
  }
  private g<G extends T.BufferGeometry>(g: G) { this.geos.push(g); return g; }
  private m<M extends T.Material>(m: M) { this.mats.push(m); return m; }
  /** distance (local) from the head to a point on the bay */
  near(x: number, z: number, pad = 0) { return Math.hypot(this.x - x, this.z - z) < this.r + pad; }
  moveTo(x: number, z: number, hx: number, hz: number) { this.x = Math.max(-hx, Math.min(hx, x)); this.z = Math.max(-hz, Math.min(hz, z)); this.on = true; this.group.visible = true; }
  update(dt: number, parent: T.Object3D) {
    this.hover += dt; this.group.position.set(this.x, this.lift + Math.sin(this.hover * 3) * .0006, this.z);
    if (!this.on) { this.u.uScanP.value.set(1e4, 0, 0); return; }
    parent.updateMatrixWorld(); this.u.uScanP.value.set(this.x, 0, this.z).applyMatrix4(parent.matrixWorld); this.u.uScanN.value.set(0, 1, 0).transformDirection(parent.matrixWorld);
    this.u.uScanR.value = this.r * new T.Vector3().setFromMatrixScale(parent.matrixWorld).x; this.glass.opacity = .14 + .04 * Math.sin(this.hover * 9);
  }
  dispose() { for (const g of this.geos) g.dispose(); for (const m of this.mats) m.dispose(); }
}
