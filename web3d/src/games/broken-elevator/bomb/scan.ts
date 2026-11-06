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
  readonly group = new T.Group(); private glass: T.MeshBasicMaterial; private lamp: T.MeshBasicMaterial; private geos: T.BufferGeometry[] = []; private mats: T.Material[] = []; private texs: T.Texture[] = [];
  /** local position on the bay plane (x, z) */ x = 0; z = 0; on = false; private hover = 0;
  /** the instrument lies in a clip in the bay corner until it is taken (tap), then hovers and follows the finger */ held = false; private restX = 0; private restZ = 0; private restYaw = 0; private k = 0; private hit!: T.Mesh;
  setRest(x: number, z: number, yaw: number) { this.restX = x; this.restZ = z; this.restYaw = yaw; this.held = false; this.on = false; this.k = 0; }
  take(cx: number, cz: number) { this.held = true; this.on = true; this.x = cx; this.z = cz; }
  putBack() { this.held = false; this.on = false; }
  scannerAt(ray: T.Raycaster) { return ray.intersectObject(this.hit, false).length > 0; }
  constructor(readonly r: number, tint: string, readonly u: ScanUniforms, readonly lift = .028) {
    const ring = new T.Mesh(this.g(new T.TorusGeometry(r, r * .12, 10, 48)), this.m(new T.MeshStandardMaterial({color: '#b08a48', metalness: 1, roughness: .3}))); ring.rotation.x = Math.PI / 2; this.group.add(ring);
    this.glass = this.m(new T.MeshBasicMaterial({color: tint, transparent: true, opacity: .16, depthWrite: false, blending: T.AdditiveBlending})); const g = new T.Mesh(this.g(new T.CircleGeometry(r, 40)), this.glass); g.rotation.x = -Math.PI / 2; this.group.add(g);
    const handle = new T.Mesh(this.g(new T.CylinderGeometry(r * .16, r * .2, r * 1.6, 10)), this.m(new T.MeshStandardMaterial({color: '#2a2622', metalness: .6, roughness: .5}))); handle.rotation.z = Math.PI / 2; handle.position.set(r * 1.85, 0, 0); this.group.add(handle);
    // reticle etched into the glass: crosshair with a scale and a dashed ring at half radius
    { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!; x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2; x.beginPath(); x.moveTo(128, 18); x.lineTo(128, 238); x.moveTo(18, 128); x.lineTo(238, 128); x.stroke();
      for (let k = -100; k <= 100; k += 12.5) { const l = k % 50 === 0 ? 10 : 5; x.beginPath(); x.moveTo(128 + k, 128 - l); x.lineTo(128 + k, 128 + l); x.moveTo(128 - l, 128 + k); x.lineTo(128 + l, 128 + k); x.stroke(); }
      x.setLineDash([6, 6]); x.beginPath(); x.arc(128, 128, 60, 0, 7); x.stroke(); const t = new T.CanvasTexture(c); this.texs.push(t);
      const ret = new T.Mesh(this.g(new T.CircleGeometry(r * .98, 40)), this.m(new T.MeshBasicMaterial({map: t, color: tint, transparent: true, opacity: .5, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false}))); ret.rotation.x = -Math.PI / 2; ret.position.y = .0004; ret.raycast = () => {}; this.group.add(ret); }
    this.lamp = this.m(new T.MeshBasicMaterial({color: tint})); const l = new T.Mesh(this.g(new T.SphereGeometry(r * .1, 8, 6)), this.lamp); l.position.set(r * 1.2, r * .1, 0); this.group.add(l);
    // a real instrument: rubber grip rings on the handle, a bezel collar, a cable trailing from the end
    const rubber = this.m(new T.MeshStandardMaterial({color: '#141210', roughness: .8})), ringG = this.g(new T.TorusGeometry(r * .2, r * .045, 6, 14));
    for (let i = 0; i < 4; i++) { const gr = new T.Mesh(ringG, rubber); gr.rotation.y = Math.PI / 2; gr.position.set(r * (1.35 + i * .22), 0, 0); this.group.add(gr); }
    const collar = new T.Mesh(this.g(new T.CylinderGeometry(r * .24, r * .24, r * .2, 14)), this.m(new T.MeshStandardMaterial({color: '#b08a48', metalness: 1, roughness: .3}))); collar.rotation.z = Math.PI / 2; collar.position.set(r * 1.1, 0, 0); this.group.add(collar);
    const cab = new T.CatmullRomCurve3([new T.Vector3(r * 2.65, 0, 0), new T.Vector3(r * 3.2, -r * .3, r * .3), new T.Vector3(r * 3.6, -r * .6, r * 1.2), new T.Vector3(r * 3.3, -r * .7, r * 2.2)]);
    const cable = new T.Mesh(this.g(new T.TubeGeometry(cab, 24, r * .07, 6, false)), rubber); this.group.add(cable);
    this.hit = new T.Mesh(this.g(new T.BoxGeometry(r * 3.6, r * .7, r * 2.1)), this.m(new T.MeshBasicMaterial({visible: false}))); this.hit.position.set(r * .75, 0, 0); this.hit.userData.scanner = true; this.group.add(this.hit);
  }
  private g<G extends T.BufferGeometry>(g: G) { this.geos.push(g); return g; }
  private m<M extends T.Material>(m: M) { this.mats.push(m); return m; }
  /** distance (local) from the head to a point on the bay */
  near(x: number, z: number, pad = 0) { return Math.hypot(this.x - x, this.z - z) < this.r + pad; }
  moveTo(x: number, z: number, hx: number, hz: number) { if (!this.held) return; this.x = Math.max(-hx, Math.min(hx, x)); this.z = Math.max(-hz, Math.min(hz, z)); }
  update(dt: number, parent: T.Object3D) {
    this.hover += dt; this.k += ((this.held ? 1 : 0) - this.k) * (1 - Math.exp(-dt * 9));
    // lying in its clip (small, flat, turned) ↔ hovering over the bay
    const rx = this.restX + (this.x - this.restX) * this.k, rz = this.restZ + (this.z - this.restZ) * this.k, ry = .0058 + (this.lift - .0058) * this.k + (this.held ? Math.sin(this.hover * 3) * .0006 : 0);
    this.group.position.set(rx, ry, rz); this.group.rotation.y = this.restYaw * (1 - this.k); this.group.scale.setScalar(.72 + .28 * this.k);
    if (!this.on) { this.u.uScanP.value.set(1e4, 0, 0); return; }
    parent.updateMatrixWorld(); this.u.uScanP.value.set(this.x, 0, this.z).applyMatrix4(parent.matrixWorld); this.u.uScanN.value.set(0, 1, 0).transformDirection(parent.matrixWorld);
    this.u.uScanR.value = this.r * new T.Vector3().setFromMatrixScale(parent.matrixWorld).x; this.glass.opacity = .14 + .04 * Math.sin(this.hover * 9);
  }
  dispose() { for (const g of this.geos) g.dispose(); for (const m of this.mats) m.dispose(); for (const t of this.texs) t.dispose(); }
}
