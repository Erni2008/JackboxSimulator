// Wall-mounted junction box: riveted steel cabinet with a framed opening and hinged
// door, ebonite back panel with a stencilled warning, porcelain insulator blocks with
// brass terminals (washer, hex nut, slotted screw), six cloth-braided conductors with
// natural slack, and insulated cutting pliers that follow the pointer and actually
// close on the wire. Cut ends fray into copper strands with sparks.
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {TEX} from '../manual/materials';
import {rng} from '../manual/page-art';
import {WIRE_COLORS, type WireTask} from './wire-puzzle';

const BW = .46, BH = .56, BD = .15, WALL = .014, N = 6, TOP = .12, BOT = -.2, GAP = .056;
export interface FuseBoxSounds { door(open: boolean): void; snip(): void; spark(): void; good(): void; bad(): void }

const canvasTex = (w: number, h: number, draw: (x: CanvasRenderingContext2D) => void, srgb = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!); const t = new T.CanvasTexture(c); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 8; return t; };

/** Cloth braid: diagonal over/under weave, grime toward the ends. One map for colour, one for bump. */
function braid() {
  const draw = (x: CanvasRenderingContext2D, bump: boolean) => {
    const W = 512, H = 64; x.fillStyle = bump ? '#808080' : '#d8d4cc'; x.fillRect(0, 0, W, H);
    for (let i = -H; i < W; i += 6) for (const d of [1, -1]) { x.strokeStyle = bump ? (d > 0 ? '#c8c8c8' : '#404040') : (d > 0 ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.2)'); x.lineWidth = 2.4; x.beginPath(); x.moveTo(i, 0); x.lineTo(i + d * H, H); x.stroke(); }
    if (!bump) { const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(30,22,16,.85)'); g.addColorStop(.12, 'rgba(30,22,16,0)'); g.addColorStop(.88, 'rgba(30,22,16,0)'); g.addColorStop(1, 'rgba(30,22,16,.85)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      const r = rng(5); for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(${r() < .75 ? '35,26,18' : '240,232,215'},${r() * .28})`; x.fillRect(r() * W, r() * H, 3 + r() * 30, 1 + r() * 4); } }
  };
  return {map: canvasTex(512, 64, x => draw(x, false)), bump: canvasTex(512, 64, x => draw(x, true), false)};
}

export class Pliers {
  group = new T.Group(); private a = new T.Group(); private b = new T.Group(); close = 0; target = 0;
  constructor() {
    const steel = new T.MeshPhysicalMaterial({color: '#7d7f82', metalness: 1, roughness: .38, envMapIntensity: 1});
    const dark = new T.MeshPhysicalMaterial({color: '#3b3d40', metalness: .9, roughness: .5});
    const grip = new T.MeshPhysicalMaterial({color: '#5e0b07', roughness: .55, metalness: 0, clearcoat: .4, clearcoatRoughness: .45});
    for (const [g, s] of [[this.a, 1], [this.b, -1]] as const) {
      const jaw = new T.Shape(); jaw.moveTo(0, 0); jaw.lineTo(.055, s * .002); jaw.quadraticCurveTo(.03, s * .012, -.005, s * .011); jaw.lineTo(0, 0);
      const jg = new T.ExtrudeGeometry(jaw, {depth: .006, bevelEnabled: true, bevelSize: .0012, bevelThickness: .0012, bevelSegments: 2}); jg.translate(0, 0, -.003 + s * .0032); jg.rotateX(Math.PI / 2);
      const jm = new T.Mesh(jg, steel); jm.castShadow = true; g.add(jm);
      const curve = new T.CatmullRomCurve3([new T.Vector3(-.005, 0, s * .006), new T.Vector3(-.04, 0, s * .014), new T.Vector3(-.09, 0, s * .026), new T.Vector3(-.15, 0, s * .03)]);
      g.add(new T.Mesh(new T.TubeGeometry(curve, 20, .0045, 8), dark));
      const gc = new T.CatmullRomCurve3([new T.Vector3(-.04, 0, s * .014), new T.Vector3(-.09, 0, s * .026), new T.Vector3(-.155, 0, s * .03)]);
      const gm = new T.Mesh(new T.TubeGeometry(gc, 24, .0078, 12), grip); gm.castShadow = true; g.add(gm);
      const cap = new T.Mesh(new T.SphereGeometry(.0078, 12, 8), grip); cap.position.set(-.155, 0, s * .03); g.add(cap);
      this.group.add(g);
    }
    this.group.add(new T.Mesh(new T.CylinderGeometry(.007, .007, .016, 16), steel));
    const slot = new T.Mesh(new T.BoxGeometry(.011, .0015, .002), dark); slot.position.y = .0082; this.group.add(slot);
    this.group.visible = false;
  }
  update(dt: number) { this.close += (this.target - this.close) * Math.min(1, dt * 28); const open = .42 * (1 - this.close); this.a.rotation.y = open; this.b.rotation.y = -open; }
}

export class FuseBox {
  group = new T.Group(); door = new T.Group(); pickDoor: T.Object3D[] = []; wireMeshes: T.Mesh[] = []; open = false; private doorT = 0;
  private halves: {top: T.Group; bot: T.Group; t: number}[] = []; private plate!: T.CanvasTexture; private plateCanvas = document.createElement('canvas');
  private lamp!: T.Mesh; private lampLight!: T.PointLight; private sparks!: T.Points; private sparkVel: T.Vector3[] = []; private sparkLife = 0;
  private braid = braid(); pliers = new Pliers(); private aim = new T.Vector3(0, -.04, .07); private aimTarget = new T.Vector3(0, -.04, .07); private snipping = 0; private reach = 0;
  locked = false; task: WireTask | null = null; sounds: FuseBoxSounds | null = null; onCut = (index: number) => {};

  constructor(hi: boolean) {
    const L = new T.TextureLoader(), tex = (f: string, srgb: boolean, rep = 1, off = 0) => { const t = L.load(TEX + f); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep); t.offset.set(off, off * .7); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 4; return t; };
    const steelMat = (off: number) => new T.MeshPhysicalMaterial({map: tex('rusty_metal_05_diff_1k.jpg', true, .55, off), normalMap: tex('rusty_metal_05_nor_gl_1k.jpg', false, .55, off), roughnessMap: tex('rusty_metal_05_rough_1k.jpg', false, .55, off), color: '#4f453e', metalness: .6, roughness: 1, envMapIntensity: .55});
    const steel = steelMat(0), doorSteel = steelMat(.37);
    const brass = new T.MeshPhysicalMaterial({color: '#8a6a36', metalness: .9, roughness: .42, envMapIntensity: .9});
    const brassDark = new T.MeshPhysicalMaterial({color: '#5e4624', metalness: .85, roughness: .55});
    const porcelain = new T.MeshPhysicalMaterial({color: '#b8ad98', roughness: .22, metalness: 0, clearcoat: .8, clearcoatRoughness: .2, map: canvasTex(256, 64, x => { x.fillStyle = '#eee8dc'; x.fillRect(0, 0, 256, 64); const r = rng(3); for (let i = 0; i < 120; i++) { x.fillStyle = `rgba(60,45,30,${r() * .25})`; x.fillRect(r() * 256, r() * 64, 2 + r() * 20, 1 + r() * 3); } x.strokeStyle = 'rgba(80,60,40,.35)'; x.lineWidth = 1; for (let i = 0; i < 6; i++) { x.beginPath(); let px = r() * 256, py = r() * 64; x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += (r() - .5) * 30; py += (r() - .5) * 12; x.lineTo(px, py); } x.stroke(); } })});
    const panel = new T.MeshPhysicalMaterial({roughness: .62, metalness: 0, map: canvasTex(512, 640, x => {
      x.fillStyle = '#0e0b09'; x.fillRect(0, 0, 512, 640); const r = rng(9); for (let i = 0; i < 2000; i++) { x.fillStyle = `rgba(${r() < .5 ? '70,60,50' : '0,0,0'},${r() * .2})`; x.fillRect(r() * 512, r() * 640, 1 + r() * 6, 1 + r() * 2); }
      x.font = "bold 34px 'IM Fell English SC', Georgia, serif"; x.textAlign = 'center'; x.fillStyle = 'rgba(178,52,30,.75)'; x.fillText('DANGER', 256, 300); x.font = "22px 'IM Fell English SC', Georgia, serif"; x.fillStyle = 'rgba(210,200,180,.5)'; x.fillText('220 VOLTS · ISOLATE BEFORE WORK', 256, 334);
      const g = x.createRadialGradient(256, 330, 50, 256, 330, 360); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); x.fillStyle = g; x.fillRect(0, 0, 512, 640); })});
    const box = (geo: T.BufferGeometry, m: T.Material | T.Material[], x: number, y: number, z: number, parent: T.Object3D = this.group) => { const b = new T.Mesh(geo, m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; parent.add(b); return b; };
    const rb = (w: number, h: number, d: number, r = .003) => new RoundedBoxGeometry(w, h, d, 2, r);
    box(new T.BoxGeometry(BW - .01, BH - .01, .006), panel, 0, 0, WALL + .003);
    box(rb(BW, BH, WALL), steel, 0, 0, WALL / 2);
    box(rb(WALL, BH, BD), steel, -BW / 2 + WALL / 2, 0, BD / 2); box(rb(WALL, BH, BD), steel, BW / 2 - WALL / 2, 0, BD / 2);
    box(rb(BW, WALL, BD), steel, 0, BH / 2 - WALL / 2, BD / 2); box(rb(BW, WALL, BD), steel, 0, -BH / 2 + WALL / 2, BD / 2);
    const lip = .02; for (const [w, h, x, y] of [[BW + .012, lip, 0, BH / 2 - lip / 2 + .006], [BW + .012, lip, 0, -BH / 2 + lip / 2 - .006], [lip, BH + .012, -BW / 2 + lip / 2 - .006, 0], [lip, BH + .012, BW / 2 - lip / 2 + .006, 0]]) box(rb(w, h, .01, .003), steel, x, y, BD - .002);
    const rivetG = new T.SphereGeometry(.0042, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2); rivetG.rotateX(Math.PI / 2); const rivets: T.Vector3[] = [];
    for (let i = 0; i <= 8; i++) { const x = -BW / 2 + .005 + i * (BW - .01) / 8; rivets.push(new T.Vector3(x, BH / 2 - .004, BD + .003), new T.Vector3(x, -BH / 2 + .004, BD + .003)); }
    for (let i = 1; i < 10; i++) { const y = -BH / 2 + i * BH / 10; rivets.push(new T.Vector3(-BW / 2 - .002, y, BD + .003), new T.Vector3(BW / 2 + .002, y, BD + .003)); }
    const ri = new T.InstancedMesh(rivetG, brassDark, rivets.length); rivets.forEach((p, i) => ri.setMatrixAt(i, new T.Matrix4().makeTranslation(p.x, p.y, p.z))); this.group.add(ri);
    for (const [x, y] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) box(new T.CylinderGeometry(.009, .009, .008, 6), brassDark, x * (BW / 2 - .035), y * (BH / 2 - .035), WALL + .01).rotation.x = Math.PI / 2;
    for (const y of [TOP + .012, BOT - .012]) box(new RoundedBoxGeometry(BW - .07, .05, .03, 3, .008), porcelain, 0, y, WALL + .021);
    for (let i = 0; i < N; i++) { const x = (i - (N - 1) / 2) * GAP; for (const y of [TOP + .012, BOT - .012]) {
      const sgn = y > 0 ? -1 : 1;
      box(new T.CylinderGeometry(.013, .013, .002, 20), brass, x, y, WALL + .037).rotation.x = Math.PI / 2;
      box(new T.CylinderGeometry(.0105, .0105, .008, 6), brass, x, y, WALL + .042).rotation.x = Math.PI / 2;
      box(new T.CylinderGeometry(.0065, .0072, .004, 16), brass, x, y, WALL + .048).rotation.x = Math.PI / 2;
      box(new T.BoxGeometry(.011, .0016, .002), brassDark, x, y, WALL + .0502).rotation.z = (i * 1.3 + y * 9) % 3;
      box(new T.CylinderGeometry(.0125, .011, .028, 16), brass, x, y + sgn * .03, WALL + .05);
    } }
    this.plateCanvas.width = 512; this.plateCanvas.height = 112; this.plate = new T.CanvasTexture(this.plateCanvas); this.plate.colorSpace = T.SRGBColorSpace; this.plate.anisotropy = 8;
    const plate = new T.Mesh(rb(.3, .066, .004, .0015), [brass, brass, brass, brass, new T.MeshPhysicalMaterial({map: this.plate, metalness: .75, roughness: .48}), brass]); plate.position.set(0, .215, WALL + .01); this.group.add(plate);
    this.door.position.set(-BW / 2 - .006, 0, BD + .012); this.group.add(this.door);
    const leaf = box(rb(BW + .012, BH + .012, .012, .004), doorSteel, BW / 2 + .006, 0, 0, this.door); this.pickDoor.push(leaf);
    const handle = new T.Mesh(new T.TorusGeometry(.028, .006, 12, 24, Math.PI), brass); handle.rotation.z = -Math.PI / 2; handle.position.set(BW - .04, 0, .014); handle.castShadow = true; this.door.add(handle); this.pickDoor.push(handle);
    for (const y of [-.028, .028]) box(new T.CylinderGeometry(.007, .007, .012, 12), brass, BW - .04, y, .008, this.door).rotation.x = Math.PI / 2;
    const sign = new T.Mesh(new T.PlaneGeometry(.11, .1), new T.MeshPhysicalMaterial({transparent: true, roughness: .7, metalness: .2, map: canvasTex(256, 232, x => {
      x.fillStyle = '#b5862a'; x.beginPath(); x.moveTo(128, 8); x.lineTo(250, 224); x.lineTo(6, 224); x.closePath(); x.fill(); x.lineWidth = 10; x.strokeStyle = '#1d1510'; x.lineJoin = 'round'; x.stroke();
      x.fillStyle = '#1d1510'; x.beginPath(); x.moveTo(140, 70); x.lineTo(104, 150); x.lineTo(130, 150); x.lineTo(112, 205); x.lineTo(156, 128); x.lineTo(130, 128); x.lineTo(148, 70); x.closePath(); x.fill();
      x.globalCompositeOperation = 'source-atop'; const r = rng(4); for (let i = 0; i < 500; i++) { x.fillStyle = `rgba(${r() < .6 ? '90,45,15' : '20,12,8'},${r() * .5})`; x.beginPath(); x.arc(r() * 256, r() * 232, 1 + r() * 7, 0, 7); x.fill(); } })}));
    sign.position.set(BW / 2 + .006, .14, .0068); this.door.add(sign); this.pickDoor.push(sign);
    for (const y of [BH / 2 - .07, -BH / 2 + .07]) box(new T.CylinderGeometry(.008, .008, .075, 12), brassDark, -.004, y, -.002);
    box(new T.CylinderGeometry(.022, .026, .02, 16), brassDark, BW / 2 - .05, BH / 2 + .01, .05);
    this.lamp = new T.Mesh(new T.SphereGeometry(.017, 16, 10), new T.MeshPhysicalMaterial({color: '#2a0806', emissive: '#000', roughness: .15, clearcoat: 1})); this.lamp.position.set(BW / 2 - .05, BH / 2 + .03, .05); this.group.add(this.lamp);
    this.lampLight = new T.PointLight('#ff3b1f', 0, 1.2, 2); this.lampLight.position.copy(this.lamp.position); this.group.add(this.lampLight);
    const work = new T.SpotLight('#ffe6c8', 5, 1.6, .75, .6, 1.5); work.position.set(0, BH / 2 + .12, .45); work.target.position.set(0, -.02, .04); this.group.add(work, work.target);
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(new Float32Array(56 * 3), 3)); for (let i = 0; i < 56; i++) this.sparkVel.push(new T.Vector3());
    this.sparks = new T.Points(sg, new T.PointsMaterial({color: '#ffc46b', size: .007, transparent: true, blending: T.AdditiveBlending, depthWrite: false})); this.sparks.visible = false; this.sparks.frustumCulled = false; this.group.add(this.sparks);
    this.group.add(this.pliers.group); void hi;
  }

  setTask(task: WireTask) {
    this.task = task; this.locked = false; this.drawPlate(task.serial); this.setLamp('off');
    for (const m of this.wireMeshes) { m.geometry.dispose(); m.removeFromParent(); } for (const h of this.halves) { h.top.removeFromParent(); h.bot.removeFromParent(); }
    this.wireMeshes = []; this.halves = [];
    task.wires.forEach((c, i) => {
      const x = (i - (N - 1) / 2) * GAP, r = rng(i * 31 + task.serial.charCodeAt(5)), z0 = WALL + .05, sag = .02 + r() * .035, side = (r() - .5) * .022;
      const y0 = TOP + .012 - .044, y1 = BOT - .012 + .044;
      const curve = new T.CatmullRomCurve3([new T.Vector3(x, y0, z0), new T.Vector3(x, y0 - .03, z0 + .01), new T.Vector3(x + side * .6, y0 - .1, z0 + sag * .8), new T.Vector3(x + side, (y0 + y1) / 2, z0 + sag), new T.Vector3(x + side * .5, y1 + .1, z0 + sag * .7), new T.Vector3(x, y1 + .03, z0 + .01), new T.Vector3(x, y1, z0)]);
      const map = this.braid.map.clone(), bump = this.braid.bump.clone(); map.wrapS = map.wrapT = bump.wrapS = bump.wrapT = T.RepeatWrapping; bump.repeat.set(9, 1); map.needsUpdate = bump.needsUpdate = true;
      const mat = new T.MeshPhysicalMaterial({color: WIRE_COLORS[c], map, bumpMap: bump, bumpScale: 1.2, roughness: .82, metalness: 0, sheen: .6, sheenRoughness: .7, sheenColor: new T.Color(WIRE_COLORS[c]).multiplyScalar(.6)});
      const m = new T.Mesh(new T.TubeGeometry(curve, 64, .0098, 14), mat); m.castShadow = true; m.userData = {wire: i, curve, mat}; this.group.add(m); this.wireMeshes.push(m);
    });
  }

  private drawPlate(serial: string) {
    const c = this.plateCanvas, x = c.getContext('2d')!; const g = x.createLinearGradient(0, 0, 512, 112); g.addColorStop(0, '#8f6e3a'); g.addColorStop(.45, '#bb975c'); g.addColorStop(1, '#7a5c2b'); x.fillStyle = g; x.fillRect(0, 0, 512, 112);
    const r = rng(serial.charCodeAt(4) * 13); for (let i = 0; i < 1400; i++) { x.fillStyle = `rgba(${r() < .55 ? '55,35,12' : '235,215,165'},${r() * .14})`; x.fillRect(r() * 512, r() * 112, 2 + r() * 10, 1); }
    for (let i = 0; i < 30; i++) { x.fillStyle = `rgba(60,90,60,${r() * .25})`; x.beginPath(); x.arc(r() * 512, r() * 112, 2 + r() * 10, 0, 7); x.fill(); }
    x.strokeStyle = 'rgba(45,28,10,.85)'; x.lineWidth = 4; x.strokeRect(9, 9, 494, 94); x.font = "bold 56px 'IM Fell DW Pica', Georgia, serif"; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = 'rgba(255,240,200,.4)'; x.fillText(`SERIAL: ${serial}`, 257.5, 60); x.fillStyle = '#24160a'; x.fillText(`SERIAL: ${serial}`, 256, 58);
    for (const [px, py] of [[26, 26], [486, 26], [26, 86], [486, 86]]) { x.fillStyle = '#4e3718'; x.beginPath(); x.arc(px, py, 8, 0, 7); x.fill(); x.strokeStyle = '#2a1a08'; x.lineWidth = 2; x.beginPath(); x.moveTo(px - 6, py); x.lineTo(px + 6, py); x.stroke(); }
    this.plate.needsUpdate = true;
  }

  setLamp(s: 'off' | 'good' | 'bad') { const m = this.lamp.material as T.MeshPhysicalMaterial; const c = s === 'good' ? '#3dff6a' : s === 'bad' ? '#ff2a14' : '#000'; m.emissive.set(c); m.emissiveIntensity = s === 'off' ? 0 : 3; this.lampLight.color.set(c); this.lampLight.intensity = s === 'off' ? 0 : 1.2; }
  toggleDoor() { this.open = !this.open; this.sounds?.door(this.open); }

  /** mouse hover: the pliers follow the wire under the cursor */
  hover(ray: T.Raycaster) {
    if (!this.open || this.locked || this.snipping) return; const h = ray.intersectObjects(this.wireMeshes, false)[0];
    if (h) { this.aimTarget.copy(this.group.worldToLocal(h.point.clone())); return; }
    const p = new T.Plane(new T.Vector3(0, 0, 1), -(WALL + .08)).applyMatrix4(this.group.matrixWorld), q = new T.Vector3();
    if (ray.ray.intersectPlane(p, q)) { this.group.worldToLocal(q); this.aimTarget.set(T.MathUtils.clamp(q.x, -.17, .17), T.MathUtils.clamp(q.y, BOT + .06, TOP - .06), WALL + .06); }
  }

  tap(ray: T.Raycaster) {
    const hits = ray.intersectObjects([...this.pickDoor, ...this.wireMeshes], false); if (!hits.length) return null; const o = hits[0].object;
    if (this.pickDoor.includes(o)) { if (!this.snipping) this.toggleDoor(); return 'door'; }
    if (o.userData.wire !== undefined && this.open && !this.locked && !this.snipping) { this.snip(o as T.Mesh, hits[0].point); return 'wire'; }
    return 'box';
  }
  pickables() { return [...this.pickDoor, ...this.wireMeshes, ...this.group.children]; }

  /** pliers travel onto the wire, close, and only then is the wire severed */
  private snip(m: T.Mesh, at: T.Vector3) {
    this.locked = true; this.snipping = 1; this.aimTarget.copy(this.group.worldToLocal(at.clone()));
    setTimeout(() => { this.pliers.target = 1; }, 150);
    setTimeout(() => this.cut(m, at), 260);
    setTimeout(() => { this.pliers.target = 0; this.snipping = 0; }, 560);
  }
  private cut(m: T.Mesh, at: T.Vector3) {
    const i = m.userData.wire, curve = m.userData.curve as T.CatmullRomCurve3, mat = m.userData.mat;
    const pts = curve.getSpacedPoints(80), local = this.group.worldToLocal(at.clone()); let k = 0, best = 1e9; pts.forEach((p, j) => { const d = p.distanceTo(local); if (d < best) { best = d; k = j; } }); k = T.MathUtils.clamp(k, 14, 66);
    const copper = new T.MeshPhysicalMaterial({color: '#c46b34', metalness: 1, roughness: .32});
    const half = (seg: T.Vector3[], pivot: T.Vector3, end: T.Vector3, dir: number) => {
      const g = new T.Group(); g.position.copy(pivot);
      const tube = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(seg.map(p => p.clone().sub(pivot))), 32, .0098, 14), mat); tube.castShadow = true; g.add(tube);
      for (let s = 0; s < 7; s++) { const a = s / 7 * Math.PI * 2, st = new T.Mesh(new T.CylinderGeometry(.0011, .0011, .012 + Math.random() * .006, 5), copper); st.position.copy(end).sub(pivot); st.position.y += dir * .005; st.position.x += Math.cos(a) * .003; st.position.z += Math.sin(a) * .003; st.rotation.set(Math.sin(a) * .35, 0, Math.cos(a) * .35); g.add(st); }
      this.group.add(g); return g;
    };
    const top = half(pts.slice(0, k - 1), pts[0], pts[k - 2], -1), bot = half(pts.slice(k + 1), pts[80], pts[k + 1], 1);
    m.visible = false; this.halves.push({top, bot, t: 0});
    this.burst(pts[k]); this.sounds?.snip(); setTimeout(() => this.sounds?.spark(), 40); this.onCut(i);
  }
  private burst(p: T.Vector3) { const pos = this.sparks.geometry.attributes.position as T.BufferAttribute; for (let i = 0; i < pos.count; i++) { pos.setXYZ(i, p.x, p.y, p.z); this.sparkVel[i].set((Math.random() - .5) * 1.3, Math.random(), Math.random() * .9); } pos.needsUpdate = true; this.sparkLife = .7; this.sparks.visible = true; }

  update(dt: number) {
    this.doorT += ((this.open ? 1 : 0) - this.doorT) * Math.min(1, dt * 5); this.door.rotation.y = -this.doorT * 1.95;
    for (const h of this.halves) { h.t = Math.min(1, h.t + dt * 2.2); const e = 1 - (1 - h.t) ** 3, wob = Math.sin(h.t * 14) * (1 - h.t) * .15; h.top.rotation.x = (.55 + wob) * e; h.top.rotation.z = .12 * e; h.bot.rotation.x = -(.7 + wob) * e; h.bot.rotation.z = -.1 * e; }
    if (this.sparkLife > 0) { this.sparkLife -= dt; const pos = this.sparks.geometry.attributes.position as T.BufferAttribute; for (let i = 0; i < pos.count; i++) { const v = this.sparkVel[i]; v.y -= 3 * dt; pos.setXYZ(i, pos.getX(i) + v.x * dt, pos.getY(i) + v.y * dt, pos.getZ(i) + v.z * dt); } pos.needsUpdate = true; (this.sparks.material as T.PointsMaterial).opacity = Math.max(0, this.sparkLife / .7); if (this.sparkLife <= 0) this.sparks.visible = false; }
    const p = this.pliers; p.group.visible = this.doorT > .6; this.aim.lerp(this.aimTarget, Math.min(1, dt * (this.snipping ? 14 : 10)));
    // jaws point into the box, handles come out toward the player (a right hand holding them).
    // The wire sits in the middle of the open jaws (never at the pivot bolt); while only aiming,
    // the pliers hover a few centimetres in front of the wires so nothing intersects.
    const X = new T.Vector3(-.3, .22, -.93).normalize(), Y = new T.Vector3(0, 1, 0).addScaledVector(X, -X.y).normalize(), Z = new T.Vector3().crossVectors(X, Y);
    this.reach += ((this.snipping ? 1 : 0) - this.reach) * Math.min(1, dt * 16);
    const back = .034 * 1.45 + (1 - this.reach) * .075; p.group.position.copy(this.aim).addScaledVector(X, -back);
    p.group.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(X, Y, Z)); p.group.scale.setScalar(1.45); p.update(dt);
  }
  center() { return this.group.localToWorld(new T.Vector3(0, 0, BD)); }
}
