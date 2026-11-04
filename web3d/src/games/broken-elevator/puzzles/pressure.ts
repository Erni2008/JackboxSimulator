// THE BROKEN ELEVATOR — PRESSURE CONTROL apparatus.
// A wall-mounted Victorian steam manifold: one large PSI gauge with the puzzle's green safe arc and red critical
// arc, three physical valves (red INTAKE handwheel, blue RELEASE handwheel, yellow STABILIZER quarter-turn lever),
// copper intake/release piping, a three-lamp stabilisation indicator, a warning lamp and restrained steam.
// Valves are turned by dragging them (mouse or touch) and snap into mechanical detents on release.
// Local frame: +z points into the cage, origin on the wall surface.
import * as T from 'three';
import type {PressureView} from './pressure-link';
import type {ValveName} from './pressure-sim';

const SERIF = "'IM Fell English SC', Georgia, serif", TECH = "'Oswald', 'Arial Narrow', sans-serif";
const rng = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
const canvasTex = (w: number, h: number, draw: (x: CanvasRenderingContext2D) => void, srgb = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!); const t = new T.CanvasTexture(c); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 16; return t; };
const A0 = -Math.PI * .75, A1 = Math.PI * .75; // 0 PSI ... 120 PSI, clockwise through the top
const QUARTER = Math.PI / 2;

interface Valve { name: ValveName; positions: number; root: T.Group; spin: T.Group; hit: T.Mesh; angle: number; target: number; pos: number; dragging: boolean; lastDetent: number }

export class PressureMachine {
  group = new T.Group(); enabled = false;
  onValve: (v: ValveName, pos: number) => void = () => {};
  sounds: {click: () => void; turn: () => void; knock: (k: number) => void; alarm: () => void; tick: (k: number) => void; steam: (hiss: number, rumble: number) => void} | null = null;
  private valves: Valve[] = []; private needle = new T.Group(); private needleAngle = A0; private needleVel = 0; private shown = -1;
  private dialCanvas = document.createElement('canvas'); private dial!: T.CanvasTexture; private zone = [0, 0];
  private lamp!: T.Mesh; private lampLight!: T.PointLight; private holdLamps: T.Mesh[] = []; private pipes = new T.Group(); private t = 0; private alarmT = 0; private knockT = 0; private lastHoldStep = 0;
  private steam!: T.Points; private steamData!: Float32Array; private steamLife!: Float32Array; private steamCursor = 0; private steamAcc = 0; private nozzle = new T.Vector3(); private leak = new T.Vector3();
  private drag: {v: Valve; cx: number; cy: number; last: number} | null = null;

  constructor(hi: boolean) {
    const r = rng(41);
    const iron = new T.MeshStandardMaterial({roughness: .82, metalness: .45, map: canvasTex(512, 512, x => {
      x.fillStyle = '#2b2622'; x.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${r() < .45 ? '120,62,30' : r() < .5 ? '12,10,9' : '80,72,64'},${r() * .22})`; x.beginPath(); x.arc(r() * 512, r() * 512, 1 + r() * (r() < .05 ? 26 : 5), 0, 7); x.fill(); }
      for (let i = 0; i < 14; i++) { const g = x.createLinearGradient(0, 0, 0, 120); g.addColorStop(0, 'rgba(110,52,20,.35)'); g.addColorStop(1, 'rgba(110,52,20,0)'); x.fillStyle = g; x.fillRect(r() * 512, r() * 400, 3 + r() * 8, 60 + r() * 120); } // rust runs
      for (let i = 0; i < 6; i++) { x.fillStyle = `rgba(8,6,4,${.25 + r() * .25})`; x.beginPath(); x.ellipse(r() * 512, 300 + r() * 200, 20 + r() * 50, 8 + r() * 20, r(), 0, 7); x.fill(); } // oil stains
    })});
    iron.emissiveMap = iron.map; iron.emissive.set('#ffffff'); iron.emissiveIntensity = .12;
    const brass = new T.MeshStandardMaterial({color: '#8d6b36', metalness: .9, roughness: .42});
    const brassDark = new T.MeshStandardMaterial({color: '#5c4422', metalness: .85, roughness: .55});
    const copper = new T.MeshStandardMaterial({color: '#9a5634', metalness: .85, roughness: .48});
    const bolt = new T.MeshStandardMaterial({color: '#2a2622', metalness: .8, roughness: .6});
    const paint = (c: string) => new T.MeshStandardMaterial({color: c, metalness: .35, roughness: .55});

    // backplate with chamfered frame and bolts (instanced)
    const plate = new T.Mesh(new T.BoxGeometry(.64, .6, .022), iron); plate.position.z = .011; this.group.add(plate);
    const frameMat = brassDark; for (const [w, h, x, y] of [[.64, .02, 0, .29], [.64, .02, 0, -.29], [.02, .6, -.31, 0], [.02, .6, .31, 0]] as const) { const f = new T.Mesh(new T.BoxGeometry(w, h, .01), frameMat); f.position.set(x, y, .026); this.group.add(f); }
    const boltGeo = new T.CylinderGeometry(.008, .009, .008, 6); boltGeo.rotateX(Math.PI / 2); const bolts: [number, number][] = [];
    for (let i = 0; i < 9; i++) { bolts.push([-.29 + i * .0725, .29], [-.29 + i * .0725, -.29]); } for (let i = 1; i < 8; i++) bolts.push([-.31, -.29 + i * .0725], [.31, -.29 + i * .0725]);
    const bi = new T.InstancedMesh(boltGeo, bolt, bolts.length); const m4 = new T.Matrix4(); bolts.forEach(([x, y], i) => { m4.makeTranslation(x, y, .033); bi.setMatrixAt(i, m4); }); this.group.add(bi);

    // ---- gauge
    const G = new T.Group(); G.position.set(0, .135, 0); this.group.add(G); const R = .105;
    const housing = new T.Mesh(new T.CylinderGeometry(R + .012, R + .016, .05, hi ? 64 : 40), brass); housing.rotation.x = Math.PI / 2; housing.position.z = .047; G.add(housing);
    const bezel = new T.Mesh(new T.TorusGeometry(R + .006, .009, 12, hi ? 72 : 48), brass); bezel.position.z = .074; G.add(bezel);
    this.dialCanvas.width = this.dialCanvas.height = 1024; this.dial = new T.CanvasTexture(this.dialCanvas); this.dial.colorSpace = T.SRGBColorSpace; this.dial.anisotropy = 16; this.drawDial(55, 65);
    const face = new T.Mesh(new T.CircleGeometry(R, hi ? 72 : 48), new T.MeshStandardMaterial({map: this.dial, emissiveMap: this.dial, emissive: '#ffffff', emissiveIntensity: .5, roughness: .75})); face.position.z = .0725; G.add(face);
    const needleMat = new T.MeshStandardMaterial({color: '#140d07', roughness: .5}); const blade = new T.Mesh(new T.BoxGeometry(.006, R * .86, .003), needleMat); blade.position.y = R * .36; this.needle.add(blade);
    const tail = new T.Mesh(new T.BoxGeometry(.01, R * .2, .003), needleMat); tail.position.y = -R * .08; this.needle.add(tail);
    const tip = new T.Mesh(new T.BoxGeometry(.004, R * .16, .0035), new T.MeshStandardMaterial({color: '#9e1d10', roughness: .5})); tip.position.y = R * .73; this.needle.add(tip);
    const cap = new T.Mesh(new T.CylinderGeometry(.011, .011, .008, 24), brass); cap.rotation.x = Math.PI / 2; this.needle.add(cap); this.needle.position.z = .076; G.add(this.needle);
    const glass = new T.Mesh(new T.CircleGeometry(R + .002, 48), new T.MeshPhysicalMaterial({color: '#ffffff', transparent: true, opacity: .1, roughness: .12, metalness: 0, depthWrite: false, roughnessMap: canvasTex(256, 256, x => { x.fillStyle = '#1a1a1a'; x.fillRect(0, 0, 256, 256); x.strokeStyle = '#cfcfcf'; for (let i = 0; i < 50; i++) { x.globalAlpha = .2 + r() * .5; x.lineWidth = .5 + r(); x.beginPath(); const a = r() * 256, b = r() * 256; x.moveTo(a, b); x.lineTo(a + (r() - .5) * 90, b + (r() - .5) * 40); x.stroke(); } }, false)}));
    glass.position.z = .081; G.add(glass);
    for (const a of [0, 1, 2, 3]) { const sb = new T.Mesh(new T.CylinderGeometry(.005, .005, .006, 8), brassDark); sb.rotation.x = Math.PI / 2; sb.position.set(Math.cos(a * QUARTER + Math.PI / 4) * (R + .006), Math.sin(a * QUARTER + Math.PI / 4) * (R + .006), .082); G.add(sb); }

    // ---- stabilisation indicator: three lamps that light in turn while the pressure is held in the zone
    const ind = this.plateMesh('HOLD', '3 SEC', .07, .05, 'brass'); ind.position.set(.215, .225, .03); this.group.add(ind);
    for (let i = 0; i < 3; i++) { const l = new T.Mesh(new T.SphereGeometry(.0125, 16, 10), new T.MeshStandardMaterial({color: '#1c2a14', emissive: '#4dff6a', emissiveIntensity: 0, roughness: .25})); l.position.set(.215, .16 - i * .042, .035); this.group.add(l); this.holdLamps.push(l);
      const ring = new T.Mesh(new T.TorusGeometry(.015, .003, 8, 24), brass); ring.position.copy(l.position); ring.position.z = .033; this.group.add(ring); }
    // ---- warning lamp in a wire cage
    this.lamp = new T.Mesh(new T.SphereGeometry(.018, 16, 12), new T.MeshStandardMaterial({color: '#3a0d06', emissive: '#ff2a10', emissiveIntensity: 0, roughness: .2})); this.lamp.position.set(-.215, .2, .045); this.group.add(this.lamp);
    for (let i = 0; i < 4; i++) { const w = new T.Mesh(new T.TorusGeometry(.021, .0018, 6, 20, Math.PI), bolt); w.position.copy(this.lamp.position); w.rotation.set(0, i * Math.PI / 4, 0); this.group.add(w); }
    const lb = new T.Mesh(new T.CylinderGeometry(.016, .02, .02, 16), brassDark); lb.rotation.x = Math.PI / 2; lb.position.set(-.215, .2, .03); this.group.add(lb);
    this.lampLight = new T.PointLight('#ff3010', 0, .9, 2); this.lampLight.position.set(-.215, .2, .09); this.group.add(this.lampLight);
    const warn = this.plateMesh('DANGER', '110+ PSI', .085, .04, 'enamel'); warn.position.set(-.215, .135, .03); this.group.add(warn);
    const title = this.plateMesh('PRESSURE CONTROL', 'HARTWELL STEAM CO. · No 7', .26, .045, 'brass'); title.position.set(0, -.255, .03); this.group.add(title);

    // ---- piping: horizontal manifold, intake riser (left, from below), release stack (right, up to a nozzle)
    this.group.add(this.pipes); const mY = -.075, mZ = .07;
    const tube = (pts: T.Vector3[], rad: number, mat: T.Material) => { const c = new T.CatmullRomCurve3(pts, false, 'catmullrom', .05); const m = new T.Mesh(new T.TubeGeometry(c, hi ? 48 : 24, rad, hi ? 14 : 10, false), mat); this.pipes.add(m); return m; };
    const v3 = (x: number, y: number, z: number) => new T.Vector3(x, y, z);
    tube([v3(-.3, mY, mZ), v3(.3, mY, mZ)], .016, copper);
    tube([v3(-.27, -.32, mZ), v3(-.27, -.2, mZ), v3(-.27, -.11, mZ), v3(-.255, mY, mZ)], .017, copper);
    tube([v3(.26, mY, mZ), v3(.275, -.04, mZ), v3(.275, .1, mZ), v3(.275, .24, mZ), v3(.29, .29, mZ + .02), v3(.3, .31, mZ + .06)], .014, copper);
    this.nozzle.set(.3, .315, mZ + .075); this.leak.set(-.255, mY + .01, mZ + .02);
    const flange = (x: number, y: number, z: number, rx: number, rz = 0) => { const f = new T.Mesh(new T.CylinderGeometry(.027, .027, .012, 20), brassDark); f.position.set(x, y, z); f.rotation.set(rx, 0, rz); this.pipes.add(f); for (let i = 0; i < 4; i++) { const b = new T.Mesh(new T.CylinderGeometry(.004, .004, .016, 6), bolt); b.position.set(x + Math.cos(i * QUARTER + .78) * .02 * (rz ? 0 : 1), y + (rz ? Math.cos(i * QUARTER + .78) * .02 : 0), z + Math.sin(i * QUARTER + .78) * .02); b.rotation.copy(f.rotation); this.pipes.add(b); } };
    flange(-.27, -.2, mZ, 0); flange(.275, .1, mZ, 0); flange(-.3, mY, mZ, 0, Math.PI / 2); flange(.3, mY, mZ, 0, Math.PI / 2);
    for (const [x, y] of [[-.27, -.28], [.275, .2], [-.12, mY], [.1, mY]] as const) { const clamp = new T.Mesh(new T.TorusGeometry(.019, .004, 8, 20, Math.PI), bolt); clamp.position.set(x, y, mZ); clamp.rotation.set(Math.abs(y - mY) < .01 ? 0 : -Math.PI / 2, Math.abs(y - mY) < .01 ? Math.PI / 2 : 0, Math.abs(y - mY) < .01 ? Math.PI / 2 : 0); this.pipes.add(clamp); }
    const nz = new T.Mesh(new T.CylinderGeometry(.009, .015, .03, 16), brass); nz.position.copy(this.nozzle).add(v3(0, -.012, -.01)); nz.rotation.x = .9; this.pipes.add(nz);
    const tagIn = this.plateMesh('STEAM IN', '', .07, .024, 'brass'); tagIn.position.set(-.27, -.235, mZ + .02); this.group.add(tagIn);
    const tagOut = this.plateMesh('VENT', '', .05, .024, 'brass'); tagOut.position.set(.275, .03, mZ + .018); this.group.add(tagOut);

    // ---- valves on the manifold
    const specs: [ValveName, number, string, string, string[]][] = [['INTAKE', -.17, '#8e1c12', 'INTAKE', ['SHUT', 'HALF', 'OPEN']], ['RELEASE', .0, '#1b3f86', 'RELEASE', ['SHUT', 'HALF', 'OPEN']], ['STABILIZER', .17, '#b8901a', 'STABILIZER', ['OFF', 'ON']]];
    for (const [name, x, color, label, marks] of specs) this.valves.push(this.buildValve(name, x, mY, mZ, color, label, marks, brass, brassDark, paint(color), bolt));

    // ---- steam: a small pool of soft sprites, recycled
    const N = hi ? 90 : 48; this.steamData = new Float32Array(N * 3); this.steamLife = new Float32Array(N * 4); // life, vx, vy, vz
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(this.steamData, 3)); const age = new Float32Array(N); geo.setAttribute('age', new T.BufferAttribute(age, 1));
    this.steam = new T.Points(geo, new T.ShaderMaterial({transparent: true, depthWrite: false, uniforms: {px: {value: Math.min(devicePixelRatio, 2)}},
      vertexShader: 'attribute float age; uniform float px; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vA = age; gl_PointSize = px * (.03 + .09 * age) * 520. / -mv.z; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'varying float vA; void main(){ vec2 d = gl_PointCoord - .5; float r = length(d); if (vA <= 0. || r > .5) discard; float a = smoothstep(.5, .0, r) * (1. - vA) * min(1., vA * 6.) * .32; gl_FragColor = vec4(vec3(.86, .84, .8), a); }'}));
    this.steam.frustumCulled = false; this.group.add(this.steam);
    for (let i = 0; i < N; i++) this.steamLife[i * 4] = 1;
  }

  private plateMesh(text: string, sub: string, w: number, h: number, style: 'brass' | 'enamel') {
    const W = 512, H = Math.round(512 * h / w); const t = canvasTex(W, H, x => {
      const g = x.createLinearGradient(0, 0, W, H); if (style === 'brass') { g.addColorStop(0, '#9a7640'); g.addColorStop(.5, '#c9a463'); g.addColorStop(1, '#7a5a2c'); } else { g.addColorStop(0, '#2a0f0a'); g.addColorStop(1, '#170806'); }
      x.fillStyle = g; x.fillRect(0, 0, W, H); x.strokeStyle = style === 'brass' ? 'rgba(40,24,8,.75)' : '#c8a060'; x.lineWidth = Math.max(4, H * .06); x.strokeRect(H * .08, H * .08, W - H * .16, H - H * .16);
      x.textAlign = 'center'; x.textBaseline = 'middle'; const fs = Math.min(H * (sub ? .4 : .55), W * 1.6 / Math.max(6, text.length)); x.font = `700 ${fs}px ${SERIF}`; x.fillStyle = style === 'brass' ? '#1c1107' : '#ffe9c4'; x.fillText(text, W / 2, sub ? H * .4 : H * .53);
      if (sub) { x.font = `600 ${H * .2}px ${TECH}`; x.fillStyle = style === 'brass' ? '#2e1d0a' : '#ff8a5c'; x.fillText(sub, W / 2, H * .74); }
    });
    return new T.Mesh(new T.BoxGeometry(w, h, .004), [0, 0, 0, 0, 1, 0].map(i => i ? new T.MeshStandardMaterial({map: t, emissiveMap: t, emissive: '#ffffff', emissiveIntensity: .3, metalness: .5, roughness: .45}) : new T.MeshStandardMaterial({color: '#6e5129', metalness: .8, roughness: .5})));
  }

  private buildValve(name: ValveName, x: number, y: number, z: number, color: string, label: string, marks: string[], brass: T.Material, brassDark: T.Material, paint: T.Material, bolt: T.Material): Valve {
    const root = new T.Group(); root.position.set(x, y, 0); this.group.add(root); const positions = marks.length;
    // globe body on the pipe, bonnet towards the player, stem
    const body = new T.Mesh(new T.SphereGeometry(.028, 20, 14), brass); body.position.z = z; body.scale.set(1.1, 1, 1); root.add(body);
    const bonnet = new T.Mesh(new T.CylinderGeometry(.017, .022, .04, 16), brassDark); bonnet.rotation.x = Math.PI / 2; bonnet.position.z = z + .04; root.add(bonnet);
    const nut = new T.Mesh(new T.CylinderGeometry(.013, .013, .012, 6), brass); nut.rotation.x = Math.PI / 2; nut.position.z = z + .064; root.add(nut);
    const stem = new T.Mesh(new T.CylinderGeometry(.005, .005, .03, 10), bolt); stem.rotation.x = Math.PI / 2; stem.position.z = z + .08; root.add(stem);
    // position dial painted on the backplate behind the valve
    const dial = new T.Mesh(new T.CircleGeometry(.085, 48), new T.MeshStandardMaterial({transparent: true, roughness: .8, metalness: .3, map: canvasTex(512, 512, g => {
      const c = 256; g.strokeStyle = 'rgba(200,170,110,.6)'; g.lineWidth = 5; g.beginPath(); g.arc(c, c, 200, Math.PI - .25, Math.PI + (positions - 1) * QUARTER + .25); g.stroke();
      marks.forEach((m, k) => { const a = Math.PI + k * QUARTER; g.save(); g.translate(c + Math.cos(a) * 200, c + Math.sin(a) * 200); g.fillStyle = '#e8cf98'; g.beginPath(); g.arc(0, 0, 11, 0, 7); g.fill(); g.restore();
        g.save(); g.translate(c + Math.cos(a) * 228, c + Math.sin(a) * 228); g.rotate(a + Math.PI / 2); g.font = `800 34px ${TECH}`; g.fillStyle = k === positions - 1 && name !== 'STABILIZER' ? '#ffd27a' : '#f2e3c0'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(m, 0, 0); g.restore(); });
    })})); dial.material.emissiveMap = (dial.material as T.MeshStandardMaterial).map; (dial.material as T.MeshStandardMaterial).emissive.set('#ffffff'); (dial.material as T.MeshStandardMaterial).emissiveIntensity = .55;
    dial.position.set(0, 0, .024); dial.rotation.z = 0; root.add(dial);
    // colour-banded name plate under the valve
    const np = this.plateMesh(label, name === 'INTAKE' ? '▲ PRESSURE UP' : name === 'RELEASE' ? '▼ PRESSURE DOWN' : '≈ SLOWER CHANGE', .135, .045, 'brass'); np.position.set(0, -.125, .03); root.add(np);
    const band = new T.Mesh(new T.BoxGeometry(.135, .008, .005), paint); band.position.set(0, -.1, .032); root.add(band);
    // the turning part
    const spin = new T.Group(); spin.position.z = z + .095; root.add(spin);
    if (name === 'STABILIZER') { // quarter-turn lever
      const hub = new T.Mesh(new T.CylinderGeometry(.016, .016, .016, 20), brass); hub.rotation.x = Math.PI / 2; spin.add(hub);
      const lever = new T.Mesh(new T.BoxGeometry(.016, .085, .01), paint); lever.position.y = .045; spin.add(lever);
      const grip = new T.Mesh(new T.CylinderGeometry(.011, .011, .03, 14), paint); grip.position.set(0, .088, 0); grip.rotation.z = Math.PI / 2; spin.add(grip);
    } else { // handwheel: rim, four spokes, hub, a white index notch at the top
      const rim = new T.Mesh(new T.TorusGeometry(.052, .0085, 12, 40), paint); spin.add(rim);
      for (let k = 0; k < 4; k++) { const sp = new T.Mesh(new T.CylinderGeometry(.0045, .0045, .1, 8), paint); sp.rotation.z = k * QUARTER / 2 * 2 + Math.PI / 4; spin.add(sp); }
      const hub = new T.Mesh(new T.CylinderGeometry(.014, .014, .02, 16), brass); hub.rotation.x = Math.PI / 2; spin.add(hub);
      const knob = new T.Mesh(new T.CylinderGeometry(.007, .009, .03, 12), brass); knob.rotation.x = Math.PI / 2; knob.position.set(.045, .02, .014); spin.add(knob);
    }
    const index = new T.Mesh(new T.BoxGeometry(.008, .02, .006), new T.MeshStandardMaterial({color: '#f4ecd8', emissive: '#f4ecd8', emissiveIntensity: .35, roughness: .4})); index.position.set(0, name === 'STABILIZER' ? .1 : .061, .006); spin.add(index);
    // generous invisible hit target (finger sized)
    const hit = new T.Mesh(new T.CylinderGeometry(.075, .075, .08, 16), new T.MeshBasicMaterial({visible: false})); hit.rotation.x = Math.PI / 2; hit.position.z = z + .08; root.add(hit);
    return {name, positions, root, spin, hit, angle: 0, target: 0, pos: 0, dragging: false, lastDetent: 0};
  }

  /** dial artwork: ivory face, 0–120 PSI scale, the puzzle's green safe arc and the red critical arc */
  private drawDial(low: number, high: number) {
    if (this.zone[0] === low && this.zone[1] === high) return; this.zone = [low, high];
    const x = this.dialCanvas.getContext('2d')!, c = 512, ang = (v: number) => -Math.PI / 2 + A0 + v / 120 * (A1 - A0);
    const g = x.createRadialGradient(c, c, 60, c, c, 512); g.addColorStop(0, '#f1e6c8'); g.addColorStop(1, '#cdb88a'); x.fillStyle = g; x.fillRect(0, 0, 1024, 1024);
    const r = rng(7); for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(120,80,30,${r() * .12})`; x.beginPath(); x.arc(r() * 1024, r() * 1024, 4 + r() * 22, 0, 7); x.fill(); }
    const arc = (a: number, b: number, rad: number, w: number, col: string) => { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.arc(c, c, rad, ang(a), ang(b)); x.stroke(); };
    arc(110, 120, 378, 52, 'rgba(176,24,10,.92)');
    arc(low, high, 378, 64, '#1f9a3a'); arc(low, high, 410, 6, '#0f5a20'); arc(low, high, 346, 6, '#0f5a20');
    arc(0, 120, 410, 7, '#20140a');
    for (let v = 0; v <= 120; v += 2) { const a = ang(v), big = v % 10 === 0, len = big ? 64 : v % 5 === 0 ? 44 : 28; x.strokeStyle = '#140c05'; x.lineWidth = big ? 9 : 4; x.beginPath(); x.moveTo(c + Math.cos(a) * 404, c + Math.sin(a) * 404); x.lineTo(c + Math.cos(a) * (404 - len), c + Math.sin(a) * (404 - len)); x.stroke(); }
    x.fillStyle = '#120a03'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `700 70px 'Cinzel', Georgia, serif`;
    for (let v = 0; v <= 120; v += 20) { const a = ang(v); x.fillText(String(v), c + Math.cos(a) * 285, c + Math.sin(a) * 285); }
    x.font = `800 64px ${TECH}`; x.fillText('PSI', c, c + 170);
    x.font = `700 40px ${TECH}`; x.fillStyle = '#0f5a20'; x.fillText(`SAFE ${low}–${high}`, c, c + 236);
    x.fillStyle = '#3a2412'; x.font = `600 30px 'Cinzel', Georgia, serif`; x.fillText('HARTWELL · LONDON', c, c - 170);
    this.dial.needsUpdate = true;
  }

  center() { return new T.Vector3(0, .02, .08).applyMatrix4(this.group.matrixWorld); }
  /** the closest valve under the ray, or -1 */
  pick(ray: T.Raycaster) { let best = -1, d = Infinity; this.valves.forEach((v, i) => { const h = ray.intersectObject(v.hit, false)[0]; if (h && h.distance < d) { d = h.distance; best = i; } }); return best; }
  hits(ray: T.Raycaster) { return ray.intersectObject(this.group, true).find(h => h.object.type !== 'Points') || null; }

  beginDrag(i: number, x: number, y: number, camera: T.Camera) {
    if (!this.enabled) return false; const v = this.valves[i]; const c = new T.Vector3().setFromMatrixPosition(v.spin.matrixWorld).project(camera);
    const cx = (c.x + 1) / 2 * innerWidth, cy = (1 - c.y) / 2 * innerHeight; this.drag = {v, cx, cy, last: Math.atan2(y - cy, x - cx)}; v.dragging = true; return true;
  }
  moveDrag(x: number, y: number) {
    const d = this.drag; if (!d) return; let a = Math.atan2(y - d.cy, x - d.cx), da = a - d.last; da = Math.atan2(Math.sin(da), Math.cos(da)); d.last = a;
    // screen angle grows clockwise (y down); valve angle opens clockwise -> negative rotation
    const v = d.v, min = -(v.positions - 1) * QUARTER; v.target = Math.max(min - .12, Math.min(.12, v.target - da));
    const detent = Math.round(-v.target / QUARTER); if (detent !== v.lastDetent && detent >= 0 && detent < v.positions) { v.lastDetent = detent; this.sounds?.click(); this.sounds?.turn(); }
  }
  endDrag() {
    const d = this.drag; if (!d) return; this.drag = null; const v = d.v; v.dragging = false;
    const pos = Math.max(0, Math.min(v.positions - 1, Math.round(-v.target / QUARTER))); v.target = -pos * QUARTER; v.lastDetent = pos;
    if (pos !== v.pos) { v.pos = pos; this.onValve(v.name, pos); }
  }
  get dragging() { return !!this.drag; }

  /** per frame: authoritative/predicted view in, mechanics + effects out */
  update(dt: number, view: PressureView | null) {
    this.t += dt;
    if (view) this.drawDial(view.safeLow, view.safeHigh);
    // valves follow authority unless the player is holding them
    this.valves.forEach((v, i) => { if (view && !v.dragging) { const p = [view.intake, view.release, view.stabilizer][i]; if (p !== v.pos) { v.pos = p; v.target = -p * QUARTER; v.lastDetent = p; } }
      v.angle += (v.target - v.angle) * (1 - Math.exp(-dt * (v.dragging ? 30 : 14))); v.spin.rotation.z = QUARTER + v.angle; });
    // needle: critically damped follower of the continuous pressure (no jumps on network updates)
    const psi = view ? view.pressure : 0, aim = A0 + Math.max(-1, Math.min(121, psi)) / 120 * (A1 - A0);
    const k = 60, cdamp = 2 * Math.sqrt(k); this.needleVel += (k * (aim - this.needleAngle) - cdamp * this.needleVel) * dt; this.needleAngle += this.needleVel * dt;
    const crit = !!view?.critical; this.needle.rotation.z = -(this.needleAngle + (crit ? Math.sin(this.t * 70) * .012 : 0));
    // stabilisation lamps
    const hold = view ? view.holdMs / 1000 : 0; this.holdLamps.forEach((l, i) => { const m = l.material as T.MeshStandardMaterial; const on = hold > i + .02 || view?.outcome === 'STABILIZED'; const partial = !on && hold > i ? 1 : 0; m.emissiveIntensity = on ? 2.4 : partial; });
    const step = Math.floor(hold); if (step > this.lastHoldStep && view?.outcome === 'RUNNING') this.sounds?.tick(step); this.lastHoldStep = view && view.holdMs > 0 ? step : 0;
    // warning lamp + pipe hammer + alarm in the critical band; amber idle glow while the puzzle is live
    const lm = this.lamp.material as T.MeshStandardMaterial; const flash = crit && Math.sin(this.t * 14) > 0;
    lm.emissive.set(crit ? '#ff2a10' : '#ffa21a'); lm.emissiveIntensity = crit ? (flash ? 4 : .2) : view?.outcome === 'RUNNING' ? .9 + .3 * Math.sin(this.t * 3) : 0; this.lampLight.intensity = crit ? (flash ? 1.6 : 0) : view?.outcome === 'RUNNING' ? .25 : 0;
    this.pipes.position.set(crit ? (Math.random() - .5) * .002 : 0, crit ? (Math.random() - .5) * .002 : 0, 0);
    if (crit) { this.alarmT -= dt; this.knockT -= dt; if (this.alarmT <= 0) { this.alarmT = .7; this.sounds?.alarm(); } if (this.knockT <= 0) { this.knockT = .35 + Math.random() * .5; this.sounds?.knock(.6 + Math.random() * .4); } } else { this.alarmT = 0; this.knockT = .2; }
    // steam: release jet by valve position, joint leaks when critical
    const release = view && view.outcome === 'RUNNING' ? view.release : 0, rate = [0, 16, 40][release] + (crit ? 22 : 0) + (view && view.outcome === 'RUNNING' && psi > 85 ? 4 : 0);
    this.sounds?.steam(release / 2 * .8 + (crit ? .35 : 0), view?.outcome === 'RUNNING' ? .25 + psi / 120 * .75 : 0);
    this.emitSteam(dt, rate, release, crit);
  }

  private emitSteam(dt: number, rate: number, release: number, crit: boolean) {
    const N = this.steamData.length / 3, pos = this.steamData, L = this.steamLife, age = this.steam.geometry.attributes.age as T.BufferAttribute;
    this.steamAcc += rate * dt;
    while (this.steamAcc >= 1) { this.steamAcc -= 1; const i = this.steamCursor; this.steamCursor = (i + 1) % N; const leak = crit && (release === 0 || Math.random() < .35); const o = leak ? this.leak : this.nozzle;
      pos[i * 3] = o.x; pos[i * 3 + 1] = o.y; pos[i * 3 + 2] = o.z; L[i * 4] = 0; const sp = leak ? .18 : .25 + .2 * release;
      L[i * 4 + 1] = (Math.random() - .5) * .08 + (leak ? 0 : .05); L[i * 4 + 2] = sp * (leak ? .6 : 1) + Math.random() * .05; L[i * 4 + 3] = (leak ? .14 : .12) + Math.random() * .06; }
    for (let i = 0; i < N; i++) { let l = L[i * 4]; if (l >= 1) { age.setX(i, 0); continue; } l = Math.min(1, l + dt / 1.6); L[i * 4] = l; const drag = Math.exp(-dt * 1.4);
      L[i * 4 + 1] *= drag; L[i * 4 + 3] *= drag; L[i * 4 + 2] = L[i * 4 + 2] * drag + .06 * dt; // buoyant, slowing, spreading
      pos[i * 3] += L[i * 4 + 1] * dt; pos[i * 3 + 1] += L[i * 4 + 2] * dt; pos[i * 3 + 2] += L[i * 4 + 3] * dt; age.setX(i, l >= 1 ? 0 : Math.max(.001, l)); }
    (this.steam.geometry.attributes.position as T.BufferAttribute).needsUpdate = true; age.needsUpdate = true;
  }
}
