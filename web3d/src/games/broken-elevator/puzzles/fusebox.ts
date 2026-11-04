// Wall-mounted junction box ("счётчик"): hinged door, stamped serial plate,
// six insulated wires between brass terminals, cut animation with exposed
// copper and sparks, and a status lamp. Interaction is raycast-driven.
import * as T from 'three';
import {TEX} from '../manual/materials';
import {WIRE_COLORS, type WireTask} from './wire-puzzle';

const BW = .46, BH = .56, BD = .15, WALL = .012, N = 6, TOP = .13, BOT = -.21, GAP = .056;

export interface FuseBoxSounds { door(open: boolean): void; snip(): void; spark(): void; good(): void; bad(): void }

export class FuseBox {
  group = new T.Group(); door = new T.Group(); pickDoor: T.Object3D[] = []; wireMeshes: T.Mesh[] = []; open = false; private doorT = 0;
  private halves: {top: T.Group; bot: T.Group; t: number}[] = []; private plate!: T.CanvasTexture; private plateCanvas = document.createElement('canvas');
  private lamp!: T.Mesh; private lampLight!: T.PointLight; private sparks!: T.Points; private sparkVel: T.Vector3[] = []; private sparkLife = 0;
  locked = false; task: WireTask | null = null; sounds: FuseBoxSounds | null = null; onCut = (index: number) => {};

  constructor(hi: boolean) {
    const L = new T.TextureLoader(), tex = (f: string, srgb: boolean, rep = 1) => { const t = L.load(TEX + f); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 4; return t; };
    const steel = new T.MeshPhysicalMaterial({map: tex('rusty_metal_05_diff_1k.jpg', true, .6), normalMap: tex('rusty_metal_05_nor_gl_1k.jpg', false, .6), roughnessMap: tex('rusty_metal_05_rough_1k.jpg', false, .6), color: '#5f5249', metalness: .6, roughness: 1, envMapIntensity: .6});
    const inside = new T.MeshPhysicalMaterial({color: '#1c1714', roughness: .9, metalness: .45, map: steel.map});
    const brass = new T.MeshPhysicalMaterial({color: '#8d6c3a', metalness: .85, roughness: .45, envMapIntensity: .8});
    const box = (w: number, h: number, d: number, m: T.Material, x: number, y: number, z: number, parent: T.Object3D = this.group) => { const b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; parent.add(b); return b; };
    // hollow body: back + four sides
    box(BW, BH, WALL, inside, 0, 0, WALL / 2);
    box(WALL, BH, BD, steel, -BW / 2 + WALL / 2, 0, BD / 2); box(WALL, BH, BD, steel, BW / 2 - WALL / 2, 0, BD / 2);
    box(BW, WALL, BD, steel, 0, BH / 2 - WALL / 2, BD / 2); box(BW, WALL, BD, steel, 0, -BH / 2 + WALL / 2, BD / 2);
    // terminal rails
    box(BW - .06, .03, .03, brass, 0, TOP + .025, .03); box(BW - .06, .03, .03, brass, 0, BOT - .025, .03);
    for (let i = 0; i < N; i++) { const x = (i - (N - 1) / 2) * GAP; for (const y of [TOP + .01, BOT - .01]) { const t = new T.Mesh(new T.CylinderGeometry(.011, .013, .03, 14), brass); t.position.set(x, y, .05); t.castShadow = true; this.group.add(t); const sleeve = new T.Mesh(new T.CylinderGeometry(.0145, .0145, .03, 14), brass); sleeve.position.set(x, y + (y > 0 ? -.035 : .035), .058); sleeve.castShadow = true; this.group.add(sleeve); const nut = new T.Mesh(new T.CylinderGeometry(.015, .015, .008, 6), brass); nut.position.set(x, y + (y > 0 ? -.017 : .017), .05); this.group.add(nut); } }
    // serial plate: brass, stamped
    this.plateCanvas.width = 512; this.plateCanvas.height = 112; this.plate = new T.CanvasTexture(this.plateCanvas); this.plate.colorSpace = T.SRGBColorSpace; this.plate.anisotropy = 8;
    const plate = new T.Mesh(new T.BoxGeometry(.3, .066, .004), [brass, brass, brass, brass, new T.MeshPhysicalMaterial({map: this.plate, metalness: .7, roughness: .5}), brass]); plate.position.set(0, .215, .025); this.group.add(plate);
    // door on a hinge at the left edge
    this.door.position.set(-BW / 2, 0, BD + .006); this.group.add(this.door);
    const leaf = box(BW, BH, .012, steel, BW / 2, 0, 0, this.door); this.pickDoor.push(leaf);
    const handle = new T.Mesh(new T.TorusGeometry(.03, .007, 10, 20, Math.PI), brass); handle.rotation.z = -Math.PI / 2; handle.position.set(BW - .045, 0, .012); this.door.add(handle); this.pickDoor.push(handle);
    const warn = document.createElement('canvas'); warn.width = 256; warn.height = 256; { const x = warn.getContext('2d')!; x.fillStyle = '#b8902e'; x.beginPath(); x.moveTo(128, 20); x.lineTo(240, 220); x.lineTo(16, 220); x.closePath(); x.fill(); x.fillStyle = '#1a1410'; x.font = 'bold 150px Georgia'; x.textAlign = 'center'; x.fillText('⚡', 128, 200); x.globalCompositeOperation = 'multiply'; x.fillStyle = 'rgba(120,70,30,.5)'; for (let i = 0; i < 400; i++) x.fillRect(Math.random() * 256, Math.random() * 256, 3, 3); }
    const sign = new T.Mesh(new T.PlaneGeometry(.1, .1), new T.MeshStandardMaterial({map: new T.CanvasTexture(warn), transparent: true, roughness: .8})); (sign.material as any).map.colorSpace = T.SRGBColorSpace; sign.position.set(BW / 2, .13, .0065); this.door.add(sign); this.pickDoor.push(sign);
    const rivet = new T.SphereGeometry(.005, 8, 5); for (let i = 0; i < 8; i++) for (const [x, y] of [[.02 + i * (BW - .04) / 7, BH / 2 - .02], [.02 + i * (BW - .04) / 7, -BH / 2 + .02]]) { const r = new T.Mesh(rivet, brass); r.position.set(x, y, .007); r.scale.z = .5; this.door.add(r); }
    for (const y of [BH / 2 - .08, -BH / 2 + .08]) box(.02, .07, .02, brass, -BW / 2 - .006, y, BD + .004);
    // status lamp above the box
    this.lamp = new T.Mesh(new T.SphereGeometry(.018, 16, 10), new T.MeshStandardMaterial({color: '#330a06', emissive: '#000', roughness: .3})); this.lamp.position.set(BW / 2 - .05, BH / 2 + .03, .05); this.group.add(this.lamp);
    box(.05, .015, .05, brass, BW / 2 - .05, BH / 2 + .008, .05);
    this.lampLight = new T.PointLight('#ff3b1f', 0, 1.2, 2); this.lampLight.position.copy(this.lamp.position); this.group.add(this.lampLight);
    // small caged work-lamp over the box: near-white so wire colours read true under the orange cage light
    const work = new T.SpotLight('#ffe6c8', 5, 1.6, .75, .6, 1.5); work.position.set(0, BH / 2 + .12, .45); work.target.position.set(0, -.02, .04); this.group.add(work, work.target);
    // sparks
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(new Float32Array(48 * 3), 3)); for (let i = 0; i < 48; i++) this.sparkVel.push(new T.Vector3());
    this.sparks = new T.Points(sg, new T.PointsMaterial({color: '#ffc46b', size: .008, transparent: true, blending: T.AdditiveBlending, depthWrite: false})); this.sparks.visible = false; this.sparks.frustumCulled = false; this.group.add(this.sparks);
    void hi;
  }

  setTask(task: WireTask) {
    this.task = task; this.locked = false; this.drawPlate(task.serial); this.setLamp('off');
    for (const m of this.wireMeshes) { m.geometry.dispose(); m.removeFromParent(); } for (const h of this.halves) { h.top.removeFromParent(); h.bot.removeFromParent(); }
    this.wireMeshes = []; this.halves = [];
    task.wires.forEach((c, i) => {
      const x = (i - (N - 1) / 2) * GAP, r = (k: number) => Math.sin(i * 12.9 + k) * .006;
      const curve = new T.CatmullRomCurve3([new T.Vector3(x, TOP, .05), new T.Vector3(x + r(1), TOP - .07, .075), new T.Vector3(x + r(2) * 1.5, (TOP + BOT) / 2, .085), new T.Vector3(x + r(3), BOT + .07, .075), new T.Vector3(x, BOT, .05)]);
      const mat = new T.MeshPhysicalMaterial({color: WIRE_COLORS[c], roughness: .58, metalness: 0, clearcoat: .25, clearcoatRoughness: .6, map: grime()});
      const m = new T.Mesh(new T.TubeGeometry(curve, 48, .0105, 14), mat); m.castShadow = true; m.userData = {wire: i, curve, mat}; this.group.add(m); this.wireMeshes.push(m);
    });
  }

  private drawPlate(serial: string) {
    const c = this.plateCanvas, x = c.getContext('2d')!; const g = x.createLinearGradient(0, 0, 512, 112); g.addColorStop(0, '#9c7a43'); g.addColorStop(.5, '#c3a066'); g.addColorStop(1, '#85652f'); x.fillStyle = g; x.fillRect(0, 0, 512, 112);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${Math.random() < .5 ? '60,40,15' : '230,210,160'},${Math.random() * .12})`; x.fillRect(Math.random() * 512, Math.random() * 112, 2 + Math.random() * 8, 1); }
    x.strokeStyle = 'rgba(50,32,12,.8)'; x.lineWidth = 4; x.strokeRect(8, 8, 496, 96); x.font = "bold 58px 'IM Fell DW Pica', Georgia, serif"; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = 'rgba(255,240,200,.35)'; x.fillText(`SERIAL: ${serial}`, 257, 60); x.fillStyle = '#2a1a0b'; x.fillText(`SERIAL: ${serial}`, 256, 58);
    for (const [px, py] of [[24, 24], [488, 24], [24, 88], [488, 88]]) { x.fillStyle = '#5a4020'; x.beginPath(); x.arc(px, py, 7, 0, 7); x.fill(); }
    this.plate.needsUpdate = true;
  }

  setLamp(s: 'off' | 'good' | 'bad') { const m = this.lamp.material as T.MeshStandardMaterial; const c = s === 'good' ? '#3dff6a' : s === 'bad' ? '#ff2a14' : '#000'; m.emissive.set(c); m.emissiveIntensity = s === 'off' ? 0 : 3; this.lampLight.color.set(c); this.lampLight.intensity = s === 'off' ? 0 : 1.2; }
  toggleDoor() { this.open = !this.open; this.sounds?.door(this.open); }

  /** returns what was hit (door / wire index) and acts on it */
  tap(ray: T.Raycaster) {
    const hits = ray.intersectObjects([...this.pickDoor, ...this.wireMeshes], false); if (!hits.length) return null; const o = hits[0].object;
    if (this.pickDoor.includes(o)) { this.toggleDoor(); return 'door'; }
    if (o.userData.wire !== undefined && this.open && !this.locked) { this.cut(o as T.Mesh, hits[0].point); return 'wire'; }
    return 'box';
  }
  pickables() { return [...this.pickDoor, ...this.wireMeshes, ...this.group.children]; }

  private cut(m: T.Mesh, at: T.Vector3) {
    const i = m.userData.wire, curve = m.userData.curve as T.CatmullRomCurve3, mat = m.userData.mat; this.locked = true;
    const local = this.group.worldToLocal(at.clone()); const tCut = T.MathUtils.clamp((TOP - local.y) / (TOP - BOT), .3, .7);
    const pts = curve.getSpacedPoints(60), k = Math.round(tCut * 60), copper = new T.MeshPhysicalMaterial({color: '#c06a33', metalness: 1, roughness: .35});
    const half = (seg: T.Vector3[], pivot: T.Vector3, end: T.Vector3) => {
      const g = new T.Group(); g.position.copy(pivot); const rel = seg.map(p => p.clone().sub(pivot));
      const tube = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(rel), 24, .0105, 14), mat); tube.castShadow = true; g.add(tube);
      const core = new T.Mesh(new T.CylinderGeometry(.0055, .0055, .014, 8), copper); core.position.copy(end.clone().sub(pivot)); g.add(core); this.group.add(g); return g;
    };
    const top = half(pts.slice(0, k - 1), pts[0], pts[k - 2]), bot = half(pts.slice(k + 1), pts[60], pts[k + 1]);
    m.visible = false; this.halves.push({top, bot, t: 0});
    this.burst(pts[k]); this.sounds?.snip(); setTimeout(() => this.sounds?.spark(), 40); this.onCut(i);
  }
  private burst(p: T.Vector3) { const pos = this.sparks.geometry.attributes.position as T.BufferAttribute; for (let i = 0; i < pos.count; i++) { pos.setXYZ(i, p.x, p.y, p.z); this.sparkVel[i].set((Math.random() - .5) * 1.2, Math.random() * .9, Math.random() * .8); } pos.needsUpdate = true; this.sparkLife = .7; this.sparks.visible = true; }

  update(dt: number) {
    this.doorT += ((this.open ? 1 : 0) - this.doorT) * Math.min(1, dt * 5); this.door.rotation.y = -this.doorT * 1.95;
    for (const h of this.halves) { h.t = Math.min(1, h.t + dt * 2.2); const e = 1 - (1 - h.t) ** 3, wob = Math.sin(h.t * 14) * (1 - h.t) * .15; h.top.rotation.x = (.55 + wob) * e; h.top.rotation.z = .12 * e; h.bot.rotation.x = -(.7 + wob) * e; h.bot.rotation.z = -.1 * e; }
    if (this.sparkLife > 0) { this.sparkLife -= dt; const pos = this.sparks.geometry.attributes.position as T.BufferAttribute; for (let i = 0; i < pos.count; i++) { const v = this.sparkVel[i]; v.y -= 3 * dt; pos.setXYZ(i, pos.getX(i) + v.x * dt, pos.getY(i) + v.y * dt, pos.getZ(i) + v.z * dt); } pos.needsUpdate = true; (this.sparks.material as T.PointsMaterial).opacity = Math.max(0, this.sparkLife / .7); if (this.sparkLife <= 0) this.sparks.visible = false; }
  }
  center() { return this.group.localToWorld(new T.Vector3(0, 0, BD)); }
}

/** Dirty insulation: soot and oil darkening toward both terminals, scuffs along the length. */
let grimeTex: T.CanvasTexture | null = null;
function grime() {
  if (grimeTex) return grimeTex; const c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d')!;
  // TubeGeometry: u runs along the wire, v around it -> canvas x = along. Draw along x.
  c.width = 256; c.height = 64; const g = x.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, '#3a3530'); g.addColorStop(.18, '#d9d4cc'); g.addColorStop(.82, '#d9d4cc'); g.addColorStop(1, '#3a3530'); x.fillStyle = g; x.fillRect(0, 0, 256, 64);
  for (let i = 0; i < 220; i++) { x.fillStyle = `rgba(${Math.random() < .7 ? '40,30,22' : '255,250,240'},${Math.random() * .25})`; x.fillRect(Math.random() * 256, Math.random() * 64, 2 + Math.random() * 14, 1 + Math.random() * 3); }
  grimeTex = new T.CanvasTexture(c); grimeTex.colorSpace = T.SRGBColorSpace; return grimeTex;
}
