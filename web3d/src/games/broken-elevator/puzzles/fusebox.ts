// Wall-mounted junction box: riveted steel cabinet with a framed opening and hinged
// door, ebonite back panel with a stencilled warning, porcelain insulator blocks with
// brass terminals (washer, hex nut, slotted screw), six cloth-braided conductors with
// natural slack, and insulated cutting pliers that follow the pointer and actually
// close on the wire. Cut ends fray into copper strands with sparks.
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {TEX} from '../manual/materials';
import {rng} from '../manual/page-art';
import {WIRE_COLORS, type WireTask} from './wire-puzzle';
import {AnalogMeter, TestButton, ModeSelector, labelPlate, type Fault, type Mode} from './diagnostics';

const TERMINALS = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6'];
const BW = .46, BH = .56, BD = .15, WALL = .014, N = 6, TOP = .12, BOT = -.2, GAP = .056;
export interface FuseBoxSounds { door(open: boolean): void; snip(): void; spark(): void; good(): void; bad(): void }

const canvasTex = (w: number, h: number, draw: (x: CanvasRenderingContext2D) => void, srgb = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!); const t = new T.CanvasTexture(c); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 16; return t; };

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
  private halves: {top: T.Group; bot: T.Group; t: number; side: number}[] = []; private plate!: T.CanvasTexture; private plateCanvas = document.createElement('canvas');
  private lamp!: T.Mesh; private lampLight!: T.PointLight; private sparks!: T.Points; private sparkVel: T.Vector3[] = []; private sparkLife = 0;
  private braid = braid(); pliers = new Pliers(); private aim = new T.Vector3(0, -.04, .07); private aimTarget = new T.Vector3(0, -.04, .07); private snipping = 0; private reach = 0; private hot: {mat: T.MeshPhysicalMaterial; t: number}[] = [];
  header = new T.Group(); meter = new AnalogMeter(.055); button = new TestButton(); selector = new ModeSelector(); latch = new T.Group(); private latchT = 0;
  private terminals = new T.Group(); private mats: any; fault: Fault = 'power'; private fxT = 0; private hum: any = null; onTest = (f: Fault) => {};
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
      x.font = "bold 42px 'IM Fell English SC', Georgia, serif"; x.textAlign = 'center'; x.fillStyle = '#ff5a3a'; x.fillText('DANGER', 256, 300); x.font = "bold 24px 'IM Fell English SC', Georgia, serif"; x.fillStyle = '#f4ead4'; x.fillText('220 VOLTS · ISOLATE BEFORE WORK', 256, 334);
      const g = x.createRadialGradient(256, 330, 50, 256, 330, 360); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.4)'); x.fillStyle = g; x.fillRect(0, 0, 512, 640); })});
    panel.emissiveMap = panel.map; panel.emissive.set('#ffffff'); panel.emissiveIntensity = .45;
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
    this.mats = {brass, brassDark};
    this.plateCanvas.width = 1040; this.plateCanvas.height = 360; this.plate = new T.CanvasTexture(this.plateCanvas); this.plate.colorSpace = T.SRGBColorSpace; this.plate.anisotropy = 16;
    const plate = new T.Mesh(rb(.26, .09, .004, .0015), [brass, brass, brass, brass, new T.MeshPhysicalMaterial({map: this.plate, emissiveMap: this.plate, emissive: '#ffffff', emissiveIntensity: .45, metalness: .45, roughness: .45, clearcoat: .4, clearcoatRoughness: .35}), brass]); plate.position.set(0, .229, WALL + .01); this.group.add(plate);
    this.door.position.set(-BW / 2 - .006, 0, BD + .012); this.group.add(this.door);
    const leaf = box(rb(BW + .012, BH + .012, .012, .004), doorSteel, BW / 2 + .006, 0, 0, this.door); this.pickDoor.push(leaf);
    // quarter-turn locking handle: escutcheon, spindle and a cast T-lever that turns before the door swings
    const esc = box(new T.CylinderGeometry(.026, .028, .006, 24), brassDark, BW - .045, 0, .009, this.door); esc.rotation.x = Math.PI / 2; this.pickDoor.push(esc);
    this.latch.position.set(BW - .045, 0, .02); this.door.add(this.latch);
    const spindle = new T.Mesh(new T.CylinderGeometry(.007, .008, .02, 12), brass); spindle.rotation.x = Math.PI / 2; this.latch.add(spindle);
    const lever = new T.Mesh(rb(.075, .014, .01, .004), brass); lever.position.z = .01; lever.castShadow = true; this.latch.add(lever);
    for (const sx of [-1, 1]) { const knob = new T.Mesh(new T.SphereGeometry(.009, 12, 8), brass); knob.position.set(sx * .037, 0, .01); this.latch.add(knob); }
    const keep = box(new T.BoxGeometry(.016, .03, .012), brassDark, BW / 2 + .013, 0, BD + .01); void keep;
    this.latch.traverse(o => this.pickDoor.push(o));
    const sign = new T.Mesh(new T.PlaneGeometry(.11, .1), new T.MeshPhysicalMaterial({transparent: true, roughness: .7, metalness: .2, map: canvasTex(256, 232, x => {
      x.fillStyle = '#b5862a'; x.beginPath(); x.moveTo(128, 8); x.lineTo(250, 224); x.lineTo(6, 224); x.closePath(); x.fill(); x.lineWidth = 10; x.strokeStyle = '#1d1510'; x.lineJoin = 'round'; x.stroke();
      x.fillStyle = '#1d1510'; x.beginPath(); x.moveTo(140, 70); x.lineTo(104, 150); x.lineTo(130, 150); x.lineTo(112, 205); x.lineTo(156, 128); x.lineTo(130, 128); x.lineTo(148, 70); x.closePath(); x.fill();
      x.globalCompositeOperation = 'source-atop'; const r = rng(4); for (let i = 0; i < 500; i++) { x.fillStyle = `rgba(${r() < .6 ? '90,45,15' : '20,12,8'},${r() * .5})`; x.beginPath(); x.arc(r() * 256, r() * 232, 1 + r() * 7, 0, 7); x.fill(); } })}));
    sign.position.set(BW / 2 + .006, .14, .0068); this.door.add(sign); this.pickDoor.push(sign);
    for (const y of [BH / 2 - .07, -BH / 2 + .07]) box(new T.CylinderGeometry(.008, .008, .075, 12), brassDark, -.004, y, -.002);
    // ---------------- instrument header above the door: meter, TEST CIRCUIT, mode selector, warning lamp
    const HH = .2, hy = BH / 2 + HH / 2 + .004; this.header.position.set(0, hy, 0); this.group.add(this.header);
    box(rb(BW + .02, HH, .075, .005), steel, 0, 0, .0375, this.header);
    box(rb(BW - .02, HH - .03, .006, .003), new T.MeshPhysicalMaterial({color: '#1a1512', roughness: .7, metalness: .3, map: steel.map}), 0, 0, .077, this.header);
    for (const [x, y] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) { const b = box(new T.CylinderGeometry(.006, .006, .006, 6), brassDark, x * (BW / 2 - .01), y * (HH / 2 - .012), .079, this.header); b.rotation.x = Math.PI / 2; }
    this.meter.group.position.set(-.13, .006, .096); this.header.add(this.meter.group);
    this.button.group.position.set(.035, .018, .08); this.header.add(this.button.group);
    this.selector.group.position.set(.15, .018, .08); this.header.add(this.selector.group);
    const lampBase = box(new T.CylinderGeometry(.016, .019, .014, 16), brassDark, -.13, HH / 2 + .008, .045, this.header); void lampBase;
    // caged warning lamp on top of the header
    this.lamp = new T.Mesh(new T.SphereGeometry(.015, 16, 10), new T.MeshPhysicalMaterial({color: '#3a0d06', emissive: '#000', roughness: .2, clearcoat: 1})); this.lamp.position.set(-.13, HH / 2 + .03, .045); this.header.add(this.lamp);
    for (let k = 0; k < 4; k++) { const wire = new T.Mesh(new T.TorusGeometry(.017, .0012, 6, 16, Math.PI), brassDark); wire.position.copy(this.lamp.position); wire.rotation.y = k * Math.PI / 4; this.header.add(wire); }
    this.lampLight = new T.PointLight('#ff3b1f', 0, 1.2, 2); this.lampLight.position.copy(this.lamp.position); this.header.add(this.lampLight);
    const work = new T.SpotLight('#ffe6c8', 5, 1.6, .75, .6, 1.5); work.position.set(0, BH / 2 + .12, .45); work.target.position.set(0, -.02, .04); this.group.add(work, work.target);
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(new Float32Array(56 * 3), 3)); for (let i = 0; i < 56; i++) this.sparkVel.push(new T.Vector3());
    this.sparks = new T.Points(sg, new T.PointsMaterial({color: '#ffc46b', size: .007, transparent: true, blending: T.AdditiveBlending, depthWrite: false})); this.sparks.visible = false; this.sparks.frustumCulled = false; this.group.add(this.sparks);
    this.group.add(this.pliers.group, this.terminals); void hi;
    // static hardware → one mesh per material (draw calls drop from ~300 to well under 100)
    mergeStatic(this.group, new Set([this.lamp])); mergeStatic(this.header, new Set([this.lamp]));
  }

  setTask(task: WireTask) {
    this.task = task; this.locked = false; this.drawPlate(task.serial); this.setLamp('off');
    for (const m of this.wireMeshes) { m.geometry.dispose(); m.removeFromParent(); } for (const h of this.halves) { h.top.removeFromParent(); h.bot.removeFromParent(); }
    this.wireMeshes = []; this.halves = []; this.buildTerminals(task.wires.length);
    const n = task.wires.length;
    task.wires.forEach((c, i) => {
      const x = (i - (n - 1) / 2) * GAP, r = rng(i * 31 + task.serial.charCodeAt(5)), z0 = WALL + .05, sag = .02 + r() * .035, side = (r() - .5) * .022;
      const y0 = TOP + .012 - .044, y1 = BOT - .012 + .044;
      const curve = new T.CatmullRomCurve3([new T.Vector3(x, y0, z0), new T.Vector3(x, y0 - .03, z0 + .01), new T.Vector3(x + side * .6, y0 - .1, z0 + sag * .8), new T.Vector3(x + side, (y0 + y1) / 2, z0 + sag), new T.Vector3(x + side * .5, y1 + .1, z0 + sag * .7), new T.Vector3(x, y1 + .03, z0 + .01), new T.Vector3(x, y1, z0)]);
      const map = this.braid.map.clone(), bump = this.braid.bump.clone(); map.wrapS = map.wrapT = bump.wrapS = bump.wrapT = T.RepeatWrapping; bump.repeat.set(9, 1); map.needsUpdate = bump.needsUpdate = true;
      const mat = new T.MeshPhysicalMaterial({color: WIRE_COLORS[c], map, bumpMap: bump, bumpScale: 1.2, roughness: .82, metalness: 0, sheen: .6, sheenRoughness: .7, sheenColor: new T.Color(WIRE_COLORS[c]).multiplyScalar(.6)});
      const m = new T.Mesh(new T.TubeGeometry(curve, 64, .0098, 14), mat); m.castShadow = true; m.userData = {wire: i, curve, mat}; this.group.add(m); this.wireMeshes.push(m);
    });
  }

  /** brass terminal hardware and engraved tags (A1, B2 ...) at the real connection points */
  private buildTerminals(n: number) {
    for (const c of [...this.terminals.children]) { c.removeFromParent(); (c as any).geometry?.dispose?.(); }
    const {brass, brassDark} = this.mats, add = (geo: T.BufferGeometry, m: T.Material | T.Material[], x: number, y: number, z: number) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; this.terminals.add(o); return o; };
    for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * GAP; for (const y of [TOP + .012, BOT - .012]) {
      const sgn = y > 0 ? -1 : 1;
      add(new T.CylinderGeometry(.013, .013, .002, 20), brass, x, y, WALL + .037).rotation.x = Math.PI / 2;
      add(new T.CylinderGeometry(.0105, .0105, .008, 6), brass, x, y, WALL + .042).rotation.x = Math.PI / 2;
      add(new T.CylinderGeometry(.0065, .0072, .004, 16), brass, x, y, WALL + .048).rotation.x = Math.PI / 2;
      add(new T.BoxGeometry(.011, .0016, .002), brassDark, x, y, WALL + .0502).rotation.z = (i * 1.3 + y * 9) % 3;
      add(new T.CylinderGeometry(.0125, .011, .028, 16), brass, x, y + sgn * .03, WALL + .05);
    }
      // engraved tag riveted to the porcelain block just above the upper terminal
      const tag = labelPlate(TERMINALS[i], .044, .024, 150, 'enamel', {mono: true, screws: false}); tag.position.set(x, TOP + .05, WALL + .026); this.terminals.add(tag);
    }
    mergeStatic(this.terminals, new Set(), false);
  }
  /** externally supplied fault and mode (dev config now, puzzle later) */
  configure(fault: Fault, mode: Mode) { this.fault = fault; this.meter.setState(fault); this.selector.setMode(mode); }
  /** press TEST CIRCUIT: same fault every time; meter + effects follow it for ~2 s */
  runTest() { if (this.meter.testing) return false; this.button.push(); this.meter.test(2); this.fxT = 2; this.onTest(this.fault); return true; }
  get testing() { return this.meter.testing; }

  /** SERIAL NO. plate: black enamel field, brass rim and screws, large Plex Mono characters (0/O, 1/I, 5/S never collide) */
  private drawPlate(serial: string) {
    const c = this.plateCanvas, x = c.getContext('2d')!, W = c.width, H = c.height, r = rng(serial.charCodeAt(1) * 13);
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1e1915'); g.addColorStop(1, '#0e0b09'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 1500; i++) { x.fillStyle = `rgba(${r() < .5 ? '255,240,210' : '0,0,0'},${r() * .05})`; x.fillRect(r() * W, r() * H, 2 + r() * 20, 1); }
    x.strokeStyle = '#a17c3e'; x.lineWidth = 14; x.strokeRect(7, 7, W - 14, H - 14); x.strokeStyle = 'rgba(40,25,8,.8)'; x.lineWidth = 3; x.strokeRect(22, 22, W - 44, H - 44);
    for (const [px, py] of [[48, 48], [W - 48, 48], [48, H - 48], [W - 48, H - 48]]) { const sg = x.createRadialGradient(px - 5, py - 5, 1, px, py, 17); sg.addColorStop(0, '#d8b77a'); sg.addColorStop(1, '#5a4222'); x.fillStyle = sg; x.beginPath(); x.arc(px, py, 17, 0, 7); x.fill(); x.strokeStyle = '#2a1a08'; x.lineWidth = 4; x.beginPath(); x.moveTo(px - 11, py + 4); x.lineTo(px + 11, py - 4); x.stroke(); }
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#f0d396'; x.font = "700 48px 'Cinzel', Georgia, serif";
    { const t = 'SERIAL NO.'; let w = 0; const sp = 10; for (const ch of t) w += x.measureText(ch).width + sp; let px = W / 2 - w / 2 + sp / 2; x.textAlign = 'left'; for (const ch of t) { x.fillText(ch, px, 92); px += x.measureText(ch).width + sp; } }
    x.strokeStyle = 'rgba(184,149,90,.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(170, 128); x.lineTo(W - 170, 128); x.stroke();
    x.font = "700 170px 'IBM Plex Mono', Menlo, monospace"; const sp = 18; let tw = 0; for (const ch of serial) tw += x.measureText(ch).width + sp; tw -= sp; let px = W / 2 - tw / 2;
    for (const ch of serial) { x.fillStyle = 'rgba(0,0,0,.7)'; x.fillText(ch, px + 3, 246); x.fillStyle = '#fffaea'; x.fillText(ch, px, 242); px += x.measureText(ch).width + sp; }
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
    const hits = ray.intersectObjects([...this.pickDoor, ...this.wireMeshes, ...this.button.pick, ...this.selector.pick, this.header], true); if (!hits.length) return null; const o = hits[0].object;
    if (this.button.pick.includes(o)) { this.runTest(); return 'test'; }
    if (this.selector.pick.includes(o)) { this.selector.tryTurn(); this.sounds?.door(false); return 'selector'; }
    if (o.parent === this.header || this.header.children.includes(o) || this.meter.group.getObjectById(o.id)) return 'panel';
    if (this.pickDoor.includes(o) || this.latch.getObjectById(o.id)) { if (!this.snipping) this.toggleDoor(); return 'door'; }
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
    const half = (seg: T.Vector3[], pivot: T.Vector3, end: T.Vector3, out: T.Vector3) => {
      const g = new T.Group(); g.position.copy(pivot);
      const tube = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(seg.map(p => p.clone().sub(pivot))), 32, .0098, 14), mat); tube.castShadow = true; g.add(tube);
      const tip = cutEnd(mat.color as T.Color); tip.position.copy(end).sub(pivot); tip.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), out); g.add(tip); this.hot.push(tip.userData.hot);
      this.group.add(g); return g;
    };
    const outTop = pts[k - 2].clone().sub(pts[k - 4]).normalize(), outBot = pts[k + 1].clone().sub(pts[k + 3]).normalize();
    const top = half(pts.slice(0, k - 1), pts[0], pts[k - 2], outTop), bot = half(pts.slice(k + 1), pts[80], pts[k + 1], outBot);
    m.visible = false; this.halves.push({top, bot, t: 0, side: i < this.wireMeshes.length / 2 ? -1 : 1});
    this.burst(pts[k]); this.sounds?.snip(); setTimeout(() => this.sounds?.spark(), 40); this.onCut(i);
  }
  private burst(p: T.Vector3) { const pos = this.sparks.geometry.attributes.position as T.BufferAttribute; for (let i = 0; i < pos.count; i++) { pos.setXYZ(i, p.x, p.y, p.z); this.sparkVel[i].set((Math.random() - .5) * 1.3, Math.random(), Math.random() * .9); } pos.needsUpdate = true; this.sparkLife = .7; this.sparks.visible = true; }

  update(dt: number) {
    this.latchT += ((this.open ? 1 : 0) - this.latchT) * Math.min(1, dt * 9); this.latch.rotation.z = -this.latchT * Math.PI / 2;
    const swing = this.open ? (this.latchT > .85 ? 1 : 0) : 0; this.doorT += (swing - this.doorT) * Math.min(1, dt * 5); this.door.rotation.y = -this.doorT * 1.95;
    this.meter.update(dt); this.button.update(dt); this.selector.update(dt); this.diagnosticFx(dt);
    for (const h of this.halves) { h.t = Math.min(1, h.t + dt * 2.2); const e = 1 - (1 - h.t) ** 3, wob = Math.sin(h.t * 14) * (1 - h.t) * .15; h.top.rotation.x = (.16 + wob * .4) * e; h.top.rotation.z = (.3 + wob) * e * h.side; h.bot.rotation.x = -(.12 + wob * .4) * e; h.bot.rotation.z = (.3 + wob) * e * h.side; }
    if (this.sparkLife > 0) { this.sparkLife -= dt; const pos = this.sparks.geometry.attributes.position as T.BufferAttribute; for (let i = 0; i < pos.count; i++) { const v = this.sparkVel[i]; v.y -= 3 * dt; pos.setXYZ(i, pos.getX(i) + v.x * dt, pos.getY(i) + v.y * dt, pos.getZ(i) + v.z * dt); } pos.needsUpdate = true; (this.sparks.material as T.PointsMaterial).opacity = Math.max(0, this.sparkLife / .7); if (this.sparkLife <= 0) this.sparks.visible = false; }
    // freshly cut copper glows from the arc, then cools to bare metal
    for (const h of this.hot) { h.t = Math.max(0, h.t - dt * .9); h.mat.emissive.setRGB(1, .42 - .2 * h.t, .1 - .08 * h.t); h.mat.emissiveIntensity = .1 + h.t * h.t * 2; }
    const p = this.pliers; p.group.visible = this.doorT > .6; this.aim.lerp(this.aimTarget, Math.min(1, dt * (this.snipping ? 14 : 10)));
    // jaws point into the box, handles come out toward the player (a right hand holding them).
    // The wire sits in the middle of the open jaws (never at the pivot bolt); while only aiming,
    // the pliers hover a few centimetres in front of the wires so nothing intersects.
    const X = new T.Vector3(-.3, .22, -.93).normalize(), Y = new T.Vector3(0, 1, 0).addScaledVector(X, -X.y).normalize(), Z = new T.Vector3().crossVectors(X, Y);
    this.reach += ((this.snipping ? 1 : 0) - this.reach) * Math.min(1, dt * 16);
    const back = .034 * 1.45 + (1 - this.reach) * .075; p.group.position.copy(this.aim).addScaledVector(X, -back);
    p.group.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(X, Y, Z)); p.group.scale.setScalar(1.45); p.update(dt);
  }
  center() { return this.group.localToWorld(new T.Vector3(0, .07, BD)); }
  /** effects bound to the configured fault, only while a test is running */
  private diagnosticFx(dt: number) {
    const m = this.lamp.material as T.MeshPhysicalMaterial;
    if (this.fxT <= 0) { this.header.position.x = 0; return; }
    this.fxT -= dt; const t = performance.now() / 1000, on = this.fxT > 0;
    if (this.fault === 'overload') { // hard amber flicker, cabinet buzz-vibration
      const f = Math.sin(t * 60) > 0 ? 1 : .25; m.emissive.set('#ffa21a'); m.emissiveIntensity = on ? 3.2 * f : 0; this.lampLight.color.set('#ffa21a'); this.lampLight.intensity = on ? 1.4 * f : 0;
      this.header.position.x = on ? Math.sin(t * 190) * .0006 : 0;
    } else if (this.fault === 'short') { // erratic red stutter and sparks jumping off a terminal
      const f = Math.sin(t * 23) * Math.sin(t * 57) > .1 ? 1 : 0; m.emissive.set('#ff2a14'); m.emissiveIntensity = on ? 3 * f : 0; this.lampLight.color.set('#ff2a14'); this.lampLight.intensity = on ? f : 0;
      if (on && Math.random() < dt * 5 && this.wireMeshes.length) { const w = this.wireMeshes[Math.floor(Math.random() * this.wireMeshes.length)], c = (w.userData.curve as T.CatmullRomCurve3).getPoint(Math.random() < .5 ? .03 : .97); this.burst(c); this.sounds?.spark(); }
    } else { // power failure: a weak, dying glow
      m.emissive.set('#ff4a1a'); m.emissiveIntensity = on ? .35 * (1 - (2 - this.fxT) / 2) + .05 : 0; this.lampLight.color.set('#ff4a1a'); this.lampLight.intensity = on ? .15 : 0;
    }
    if (!on) { m.emissiveIntensity = 0; this.lampLight.intensity = 0; this.header.position.x = 0; }
  }
}

const COPPER = new T.MeshPhysicalMaterial({color: '#c9632a', metalness: .7, roughness: .3, envMapIntensity: 1.6, clearcoat: .5, clearcoatRoughness: .2});
const RUBBER = new T.MeshPhysicalMaterial({color: '#191512', roughness: .75, metalness: 0});
/** Cross-section of a cut cable, built along +y from the cut face:
 *  frayed cloth braid → black vulcanised-rubber jacket → a twisted bundle of copper strands,
 *  slightly splayed, with bright sheared tips that glow briefly from the arc. */
function cutEnd(sheath: T.Color) {
  const g = new T.Group();
  // rubber jacket protruding a little beyond the braid, capped so the cable is never hollow
  const jacket = new T.Mesh(new T.CylinderGeometry(.0076, .0082, .0045, 18), RUBBER); jacket.position.y = .0012; g.add(jacket);
  const face = new T.Mesh(new T.CircleGeometry(.0076, 18), RUBBER); face.rotation.x = -Math.PI / 2; face.position.y = .0035; g.add(face);
  // frayed braid threads curling back from the cut
  const thread = new T.MeshPhysicalMaterial({color: sheath.clone().multiplyScalar(.85), roughness: .9});
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + Math.random() * .3, len = .003 + Math.random() * .004; const t = new T.Mesh(new T.CylinderGeometry(.0005, .0003, len, 4), thread); t.position.set(Math.cos(a) * .0094, -.0005 + len * .3, Math.sin(a) * .0094); t.rotation.set(Math.sin(a) * .9, 0, -Math.cos(a) * .9); g.add(t); }
  // copper: 7-strand concentric lay (1 core + 6 twisted around it), splaying slightly at the tips
  const hotMat = COPPER.clone(); hotMat.emissive = new T.Color('#ff6a1a'); hotMat.emissiveIntensity = 2.2;
  const L = .024 + Math.random() * .004;
  // 7-strand lay: one straight core and six around it, each splaying outward toward its sheared tip
  for (let s = 0; s < 7; s++) {
    const core = s === 6, a = s / 6 * Math.PI * 2, len = core ? L * 1.08 : L * (.85 + Math.random() * .25), tilt = core ? 0 : .16 + Math.random() * .12;
    const st = new T.Mesh(new T.CylinderGeometry(.0017, .0019, len, 7), hotMat);
    const r = core ? 0 : .0034; st.position.set(Math.cos(a) * (r + Math.sin(tilt) * len / 2), .003 + len / 2 * Math.cos(tilt), Math.sin(a) * (r + Math.sin(tilt) * len / 2));
    st.rotation.set(Math.sin(a) * tilt, 0, -Math.cos(a) * tilt); st.castShadow = true; g.add(st);
  }
  g.userData.hot = {mat: hotMat, t: 1};
  return g;
}

/** Bakes plain static meshes directly under `parent` into one geometry per material.
 *  Skips groups, instanced/multi-material meshes and anything in `skip`. Small parts stop casting shadows. */
function mergeStatic(parent: T.Object3D, skip: Set<T.Object3D>, castShadow = true) {
  parent.updateMatrix(); const byMat = new Map<T.Material, {geos: T.BufferGeometry[]; meshes: T.Mesh[]}>();
  for (const o of [...parent.children]) {
    const m = o as T.Mesh; if (!m.isMesh || (m as any).isInstancedMesh || Array.isArray(m.material) || skip.has(m) || m.children.length) continue;
    m.updateMatrix(); const g = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()).applyMatrix4(m.matrix);
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    if (!g.attributes.uv) g.setAttribute('uv', new T.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    const e = byMat.get(m.material as T.Material) || {geos: [], meshes: []}; e.geos.push(g); e.meshes.push(m); byMat.set(m.material as T.Material, e);
  }
  for (const [mat, e] of byMat) {
    if (e.geos.length < 2) continue; const merged = mergeGeometries(e.geos); if (!merged) continue;
    for (const m of e.meshes) { m.removeFromParent(); m.geometry.dispose(); }
    const big = e.meshes.some(m => { m.geometry.computeBoundingSphere?.(); return (m.geometry.boundingSphere?.radius || 0) > .12; });
    const out = new T.Mesh(merged, mat); out.castShadow = castShadow && big; out.receiveShadow = true; parent.add(out);
  }
}
