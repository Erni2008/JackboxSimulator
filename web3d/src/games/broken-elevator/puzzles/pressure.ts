// THE BROKEN ELEVATOR — THE BROKEN VALVES apparatus (wall-mounted on the cage's right-hand wall).
// Layout (local frame, +z into the cage):
//   left/centre: PSI gauge, surge warning lamp, 1-second stability lamps, copper manifold with RED (intake) and BLUE
//                (release) ratchet handwheels and the YELLOW fine-control lever, vent stack + nozzle, a weeping joint (L-03)
//   right column: fault-code window + TEST button + relay lamps, BYPASS lever (MAIN / AUX) with the auxiliary line,
//                 EMERGENCY RELEASE pull handle under a hazard plate, OK lamp
// The machine only renders the server's view and reports player actions; it never decides anything.
import * as T from 'three';
import {materials, plate, lamp, canvasTex, QUARTER, TECH} from './pressure-parts';
import {PressureGauge} from './pressure-gauge';
import {Control, Wheel, Lever, PushButton, PullHandle, PipeClamp, type Feedback} from './pressure-controls';
import type {ValveView} from './pressure-link';
import {VERIFY_MS, type Action} from './pressure-sim';

export interface MachineSounds extends Feedback { explosion?(): void; alarm(): void; whistle(): void; surge(): void; vent(k: number): void; burst(): void; tick(k: number): void; steam(hiss: number, rumble: number): void; knock(k: number): void }

export class PressureMachine {
  group = new T.Group(); enabled = false;
  onAction: (a: Action) => void = () => {};
  sounds: MachineSounds | null = null;
  private gauge: PressureGauge; private controls: Control[] = []; private red: Wheel; private blue: Wheel; private fine: Lever; private bypass: Lever; private test: PushButton; private emergency: PullHandle; private clamp: PipeClamp; private lastNoiseAt = -1;
  private warn: {group: T.Group; mat: T.MeshStandardMaterial}; private ok: {group: T.Group; mat: T.MeshStandardMaterial}; private aux: {group: T.Group; mat: T.MeshStandardMaterial};
  private verify: T.MeshStandardMaterial[] = []; private relays: T.MeshStandardMaterial[] = []; private warnLight: T.PointLight; private pipes = new T.Group();
  private codeCanvas = document.createElement('canvas'); private codeTex: T.CanvasTexture; private codeShown = '?';
  private active: Control | null = null; private t = 0; private lastEffect = -1; private alarmT = 0; private whistleT = 0; private lastVerifyStep = 0; private lastOutcome = 'RUNNING'; private surgedSeen = false;
  private debris: {m: T.Mesh; v: T.Vector3; w: T.Vector3; life: number}[] = []; private sparks!: T.Points; private sparkV!: Float32Array; private sparkT = 9; private flash!: T.PointLight; private blastT = 9; private stack!: T.Mesh;
  private steam: T.Points; private sp: Float32Array; private life: Float32Array; private cursor = 0; private nozzle = new T.Vector3(); private leakAt = new T.Vector3(); private ventAt = new T.Vector3(); private leakAcc = 0;

  constructor(hi: boolean) {
    const m = materials();
    // ---- backplate, frame, bolts
    const W = .92, H = .62; const back = new T.Mesh(new T.BoxGeometry(W, H, .022), m.iron); back.position.z = .011; this.group.add(back);
    for (const [w, h, x, y] of [[W, .02, 0, H / 2 - .01], [W, .02, 0, -H / 2 + .01], [.02, H, -W / 2 + .01, 0], [.02, H, W / 2 - .01, 0], [.012, H - .04, .225, 0]] as const) { const f = new T.Mesh(new T.BoxGeometry(w, h, .01), m.brassDark); f.position.set(x, y, .026); this.group.add(f); }
    const boltGeo = new T.CylinderGeometry(.008, .009, .008, 6); boltGeo.rotateX(QUARTER); const bolts: [number, number][] = [];
    for (let i = 0; i <= 12; i++) bolts.push([-W / 2 + .02 + i * (W - .04) / 12, H / 2 - .01], [-W / 2 + .02 + i * (W - .04) / 12, -H / 2 + .01]); for (let i = 1; i < 8; i++) bolts.push([-W / 2 + .01, -H / 2 + i * H / 8], [W / 2 - .01, -H / 2 + i * H / 8]);
    const bi = new T.InstancedMesh(boltGeo, m.bolt, bolts.length); const m4 = new T.Matrix4(); bolts.forEach(([x, y], i) => { m4.makeTranslation(x, y, .033); bi.setMatrixAt(i, m4); }); this.group.add(bi);

    // ---- gauge + lamps
    this.gauge = new PressureGauge(.105, m, hi); this.gauge.group.position.set(-.13, .13, 0); this.group.add(this.gauge.group);
    this.warn = lamp(.018, '#ff6a10', m); this.warn.group.position.set(-.38, .22, .04); this.group.add(this.warn.group);
    const wp = plate('SURGE', 'WARNING', .09, .036, 'enamel'); wp.position.set(-.38, .165, .03); this.group.add(wp);
    this.warnLight = new T.PointLight('#ff6a10', 0, 1, 2); this.warnLight.position.set(-.38, .22, .1); this.group.add(this.warnLight);
    const sp = plate('STABLE', '1 SEC', .08, .04, 'brass'); sp.position.set(.07, .235, .03); this.group.add(sp);
    for (let i = 0; i < 3; i++) { const l = lamp(.012, '#4dff6a', m); l.group.position.set(.07, .175 - i * .04, .035); this.group.add(l.group); this.verify.push(l.mat); }

    // ---- piping: intake riser (left), manifold, vent stack with a nozzle, weeping joint
    this.group.add(this.pipes); const mY = -.085, mZ = .07, v3 = (x: number, y: number, z: number) => new T.Vector3(x, y, z);
    const tube = (pts: T.Vector3[], rad: number, mat: T.Material) => { const c = new T.CatmullRomCurve3(pts, false, 'catmullrom', .05); const mesh = new T.Mesh(new T.TubeGeometry(c, hi ? 48 : 24, rad, hi ? 14 : 10, false), mat); this.pipes.add(mesh); return mesh; };
    tube([v3(-.44, mY, mZ), v3(.17, mY, mZ)], .016, m.copper);
    tube([v3(-.42, -.32, mZ), v3(-.42, -.2, mZ), v3(-.42, -.12, mZ), v3(-.405, mY, mZ)], .017, m.copper);
    this.stack = tube([v3(.16, mY, mZ), v3(.17, -.04, mZ), v3(.17, .12, mZ), v3(.17, .25, mZ), v3(.18, .29, mZ + .02), v3(.19, .3, mZ + .06)], .013, m.copper);
    this.nozzle.set(.19, .305, mZ + .075); const nz = new T.Mesh(new T.CylinderGeometry(.009, .015, .03, 16), m.brass); nz.position.copy(this.nozzle).add(v3(0, -.012, -.01)); nz.rotation.x = .9; this.pipes.add(nz);
    const joint = new T.Mesh(new T.CylinderGeometry(.022, .022, .03, 16), new T.MeshStandardMaterial({color: '#3a2a1c', metalness: .6, roughness: .85})); joint.rotation.z = QUARTER; joint.position.set(-.37, mY, mZ); this.pipes.add(joint); this.leakAt.set(-.37, mY + .02, mZ + .015);
    for (const [x, y, rz] of [[-.42, -.2, 0], [.17, .1, 0], [-.44, mY, QUARTER]] as const) { const f = new T.Mesh(new T.CylinderGeometry(.027, .027, .012, 20), m.brassDark); f.position.set(x, y, mZ); f.rotation.z = rz; this.pipes.add(f); }
    // the CLAMP: tap the cracked coupling to bolt a split clamp over it
    this.clamp = new PipeClamp('clamp', m, () => this.emit('CLAMP')); this.clamp.root.position.set(-.37, mY, mZ); this.group.add(this.clamp.root);
    const cp = plate('CLAMP', 'TAP JOINT', .07, .03, 'brass'); cp.position.set(-.37, -.02, .03); this.group.add(cp);
    const tIn = plate('STEAM IN', '', .07, .024, 'brass'); tIn.position.set(-.42, -.25, mZ + .02); this.group.add(tIn);

    // ---- valves on the manifold
    const valveBody = (x: number) => { const g = new T.Group(); g.position.set(x, mY, 0); const body = new T.Mesh(new T.SphereGeometry(.028, 20, 14), m.brass); body.position.z = mZ; body.scale.set(1.1, 1, 1); g.add(body);
      const bonnet = new T.Mesh(new T.CylinderGeometry(.017, .022, .04, 16), m.brassDark); bonnet.rotation.x = QUARTER; bonnet.position.z = mZ + .04; g.add(bonnet); this.group.add(g); return g; };
    const nameplate = (x: number, title: string, sub: string, color: string) => { const p = plate(title, sub, .14, .046, 'brass'); p.position.set(x, -.2, .03); this.group.add(p); const band = new T.Mesh(new T.BoxGeometry(.14, .008, .005), m.paint(color)); band.position.set(x, -.173, .032); this.group.add(band); };
    this.red = new Wheel('red', '#8e1c12', m, () => this.emit('RED')); valveBody(-.25).add(this.red.root); this.red.root.position.z = mZ + .095; nameplate(-.25, 'INTAKE', '▲ +10 PSI', '#8e1c12');
    this.blue = new Wheel('blue', '#1b3f86', m, () => this.emit('BLUE')); valveBody(-.07).add(this.blue.root); this.blue.root.position.z = mZ + .095; nameplate(-.07, 'RELEASE', '▼ −10 PSI', '#1b3f86');
    this.fine = new Lever('fine', '#b8901a', m, [-QUARTER / 2, QUARTER / 2], p => this.emit(p ? 'FINE_ON' : 'FINE_OFF')); valveBody(.085).add(this.fine.root); this.fine.root.position.z = mZ + .095; nameplate(.085, 'FINE', 'ON = ±2 PSI', '#b8901a');
    this.group.add(this.dialMarks(.085, mY, 'OFF', 'ON'));

    // ---- right column: code window, TEST, relays
    this.codeCanvas.width = 512; this.codeCanvas.height = 160; this.codeTex = new T.CanvasTexture(this.codeCanvas); this.codeTex.colorSpace = T.SRGBColorSpace; this.drawCode('', false);
    const win = new T.Mesh(new T.PlaneGeometry(.17, .053), new T.MeshStandardMaterial({map: this.codeTex, emissiveMap: this.codeTex, emissive: '#ffffff', emissiveIntensity: .9, roughness: .3})); win.position.set(.33, .255, .03); this.group.add(win);
    const frame = new T.Mesh(new T.BoxGeometry(.182, .065, .008), m.brass); frame.position.set(.33, .255, .024); this.group.add(frame);
    const dp = plate('FAULT CODE', '', .1, .022, 'brass'); dp.position.set(.33, .212, .03); this.group.add(dp);
    this.test = new PushButton('test', m, () => this.emit('DIAGNOSTIC')); this.test.root.position.set(.29, .15, .024); this.group.add(this.test.root);
    const tp = plate('TEST', '', .06, .022, 'brass'); tp.position.set(.29, .102, .03); this.group.add(tp);
    for (let i = 0; i < 3; i++) { const l = lamp(.009, '#ffb020', m); l.group.position.set(.37 + i * .028, .15, .03); this.group.add(l.group); this.relays.push(l.mat); }
    // BYPASS lever + the auxiliary line it opens
    this.bypass = new Lever('bypass', '#2a2622', m, [-.6, .6], p => this.emit(p ? 'BYPASS_AUX' : 'BYPASS_MAIN'), .07); this.bypass.root.position.set(.33, .005, .05); this.group.add(this.bypass.root);
    this.group.add(this.dialMarks(.33, .005, 'MAIN', 'AUX', .6, .095));
    const bp = plate('BYPASS', 'AUXILIARY LINE', .14, .04, 'brass'); bp.position.set(.33, -.085, .03); this.group.add(bp);
    this.aux = lamp(.01, '#4dc4ff', m); this.aux.group.position.set(.42, .06, .03); this.group.add(this.aux.group);
    tube([v3(-.42, -.29, .045), v3(.0, -.29, .045), v3(.2, -.29, .045), v3(.236, -.27, .045), v3(.238, -.1, .045), v3(.25, -.03, .045), v3(.3, .0, .05)], .007, m.brassDark); // auxiliary line: along the bottom, up the column edge, into the bypass hub
    // EMERGENCY RELEASE
    const hz = plate('EMERGENCY RELEASE', '', .17, .05, 'warning'); hz.position.set(.33, -.15, .03); this.group.add(hz);
    this.emergency = new PullHandle('emergency', m, () => this.emit('EMERGENCY')); this.emergency.root.position.set(.33, -.215, .024); this.group.add(this.emergency.root);
    const slot = new T.Mesh(new T.BoxGeometry(.012, .07, .006), m.bolt); slot.position.set(.33, -.24, .026); this.group.add(slot);
    this.ventAt.set(.43, -.28, .06); const ev = new T.Mesh(new T.CylinderGeometry(.01, .016, .03, 14), m.brass); ev.position.set(.43, -.27, .05); ev.rotation.x = .6; this.group.add(ev);
    this.ok = lamp(.016, '#3dff6a', m); this.ok.group.position.set(.42, .1, .04); this.group.add(this.ok.group);

    this.controls = [this.red, this.blue, this.fine, this.bypass, this.test, this.emergency, this.clamp];

    // ---- steam pool (vent, leak, emergency and failure bursts)
    const N = hi ? 140 : 70; this.sp = new Float32Array(N * 3); this.life = new Float32Array(N * 5); for (let i = 0; i < N; i++) this.life[i * 5] = 1; // life, vx, vy, vz, size
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(this.sp, 3)); geo.setAttribute('age', new T.BufferAttribute(new Float32Array(N), 1)); geo.setAttribute('size', new T.BufferAttribute(new Float32Array(N), 1));
    this.steam = new T.Points(geo, new T.ShaderMaterial({transparent: true, depthWrite: false, uniforms: {px: {value: Math.min(devicePixelRatio, 2)}},
      vertexShader: 'attribute float age; attribute float size; uniform float px; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vA = age; gl_PointSize = px * size * (.35 + age) * 520. / -mv.z; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'varying float vA; void main(){ vec2 d = gl_PointCoord - .5; float r = length(d); if (vA <= 0. || r > .5) discard; float a = smoothstep(.5, .0, r) * (1. - vA) * min(1., vA * 6.) * .34; gl_FragColor = vec4(vec3(.86, .84, .8), a); }'}));
    this.steam.frustumCulled = false; this.group.add(this.steam);
    // explosion kit: glass shards, sparks, a blast light
    const glassMat = new T.MeshPhysicalMaterial({color: '#e8f0ff', transparent: true, opacity: .55, roughness: .05, metalness: 0, side: T.DoubleSide});
    for (let i = 0; i < 16; i++) { const g = new T.BufferGeometry(); const a = .006 + Math.random() * .02; g.setAttribute('position', new T.Float32BufferAttribute([0, 0, 0, a, a * .3, 0, a * .2, a * (.6 + Math.random()), 0], 3)); g.computeVertexNormals();
      const sh = new T.Mesh(g, i % 4 ? glassMat : m.brassDark); sh.visible = false; this.group.add(sh); this.debris.push({m: sh, v: new T.Vector3(), w: new T.Vector3(), life: 0}); }
    const SN = 60; this.sparkV = new Float32Array(SN * 3); const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(new Float32Array(SN * 3), 3));
    this.sparks = new T.Points(sg, new T.PointsMaterial({color: '#ffb35a', size: .012, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false})); this.sparks.frustumCulled = false; this.group.add(this.sparks);
    this.flash = new T.PointLight('#ffb070', 0, 4, 1.6); this.flash.position.set(-.13, .13, .25); this.group.add(this.flash);
  }
  /** 120 PSI: the system bursts — gauge glass blows out, the needle tears, steam and sparks everywhere, the vent stack kinks */
  explode() {
    const c = this.gauge.group.position; this.gauge.shatter(); this.blastT = 0; this.sparkT = 0;
    this.debris.forEach(d => { d.m.visible = true; d.m.position.set(c.x + (Math.random() - .5) * .12, c.y + (Math.random() - .5) * .12, .085); d.v.set((Math.random() - .5) * 1.6, Math.random() * 1.2 + .2, .6 + Math.random() * 1.4); d.w.set(Math.random() * 20, Math.random() * 20, Math.random() * 20); d.life = 2.2; });
    const sp = this.sparks.geometry.attributes.position as T.BufferAttribute; for (let i = 0; i < sp.count; i++) { const o = i % 2 ? this.nozzle : new T.Vector3(c.x, c.y, .09); sp.setXYZ(i, o.x, o.y, o.z); this.sparkV.set([(Math.random() - .5) * 2.4, Math.random() * 1.8, .4 + Math.random() * 1.6], i * 3); } sp.needsUpdate = true;
    for (const at of [this.nozzle, this.leakAt, this.ventAt, new T.Vector3(c.x, c.y, .09)]) this.burst(at, 34, .9);
    this.stack.rotation.z = -.05; this.stack.position.set(.012, -.008, .004); this.sounds?.explosion?.();
  }
  private updateBlast(dt: number) {
    this.blastT += dt; this.flash.intensity = this.blastT < 1.2 ? 26 * Math.exp(-this.blastT * 5) * (.7 + .3 * Math.random()) : 0;
    for (const d of this.debris) { if (d.life <= 0) continue; d.life -= dt; d.v.y -= 3.2 * dt; d.m.position.addScaledVector(d.v, dt); d.m.rotation.x += d.w.x * dt; d.m.rotation.y += d.w.y * dt; if (d.life <= 0) d.m.visible = false; }
    this.sparkT += dt; const mat = this.sparks.material as T.PointsMaterial; mat.opacity = this.sparkT < 1.4 ? Math.max(0, 1 - this.sparkT / 1.4) : 0;
    if (mat.opacity > 0) { const sp = this.sparks.geometry.attributes.position as T.BufferAttribute; for (let i = 0; i < sp.count; i++) { this.sparkV[i * 3 + 1] -= 3.5 * dt; sp.setXYZ(i, sp.getX(i) + this.sparkV[i * 3] * dt, sp.getY(i) + this.sparkV[i * 3 + 1] * dt, sp.getZ(i) + this.sparkV[i * 3 + 2] * dt); } sp.needsUpdate = true; }
  }

  private dialMarks(x: number, y: number, a: string, b: string, ang = QUARTER / 2, rad = .1) {
    const t = canvasTex(512, 512, g => { const c = 256; g.strokeStyle = 'rgba(200,170,110,.6)'; g.lineWidth = 5; g.beginPath(); g.arc(c, c, 200, -Math.PI / 2 - ang - .2, -Math.PI / 2 + ang + .2); g.stroke();
      ([[a, -ang], [b, ang]] as [string, number][]).forEach(([s, v]) => { const an = -Math.PI / 2 + v; g.fillStyle = '#e8cf98'; g.beginPath(); g.arc(c + Math.cos(an) * 200, c + Math.sin(an) * 200, 11, 0, 7); g.fill(); g.save(); g.translate(c + Math.cos(an) * 236, c + Math.sin(an) * 236); g.rotate(an + QUARTER); g.font = `800 40px ${TECH}`; g.fillStyle = '#f6e7c4'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 0, 0); g.restore(); }); });
    const mesh = new T.Mesh(new T.CircleGeometry(rad, 48), new T.MeshStandardMaterial({map: t, emissiveMap: t, emissive: '#ffffff', emissiveIntensity: .55, transparent: true, roughness: .8})); mesh.position.set(x, y, .024); return mesh;
  }
  private drawCode(code: string, busy: boolean) {
    const key = busy ? 'busy' + Math.floor(this.t * 12) : code; if (key === this.codeShown) return; this.codeShown = key;
    const x = this.codeCanvas.getContext('2d')!; x.fillStyle = '#0a0705'; x.fillRect(0, 0, 512, 160); x.strokeStyle = 'rgba(255,170,60,.15)'; for (let y = 0; y < 160; y += 6) { x.beginPath(); x.moveTo(0, y); x.lineTo(512, y); x.stroke(); }
    const txt = busy ? ['R', 'B', 'F', 'L'][Math.floor(this.t * 12) % 4] + '-0' + (1 + Math.floor(this.t * 17) % 4) : code || '– – – –';
    x.font = `700 ${code.includes('+') ? 64 : code || busy ? 112 : 70}px 'IBM Plex Mono', Menlo, monospace`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.shadowColor = '#ff9a2a'; x.shadowBlur = code ? 26 : 8; x.fillStyle = busy ? 'rgba(255,170,70,.55)' : code ? '#ffb347' : 'rgba(255,170,70,.4)'; x.fillText(txt, 256, 86);
    this.codeTex.needsUpdate = true;
  }
  private emit(a: Action) { if (this.enabled) this.onAction(a); }

  center() { return new T.Vector3(0, .02, .08).applyMatrix4(this.group.matrixWorld); }
  hits(ray: T.Raycaster) { return ray.intersectObject(this.group, true).find(h => h.object.type !== 'Points') || null; }
  get dragging() { return !!this.active; }
  /** grab the control under the ray (true = the pointer now belongs to the machine) */
  pointerDown(ray: T.Raycaster, x: number, y: number, camera: T.Camera) {
    if (!this.enabled) return false; let best: Control | null = null, d = Infinity;
    for (const c of this.controls) { const h = ray.intersectObject(c.hit, false)[0]; if (h && h.distance < d) { d = h.distance; best = c; } }
    if (!best) return false; this.active = best; best.down(x, y, camera); return true;
  }
  pointerMove(x: number, y: number) { this.active?.move(x, y); }
  pointerUp(tap: boolean) { const c = this.active; this.active = null; c?.up(tap); }
  /** screen position of a control (tests and camera framing) */
  controlScreen(id: string, camera: T.Camera) { const c = this.controls.find(k => k.id === id)!; const v = new T.Vector3().setFromMatrixPosition(c.root.matrixWorld).project(camera); return {x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight}; }

  update(dt: number, v: ValveView | null) {
    this.t += dt; const fx = this.sounds;
    for (const c of this.controls) { if (fx) c.setFeedback(fx); c.enabled = this.enabled && !!v && v.outcome === 'RUNNING'; c.update(dt); }
    if (!v) { this.gauge.update(dt, 0, 0, false); this.drawCode('', false); this.warn.mat.emissiveIntensity = 0; this.ok.mat.emissiveIntensity = 0; this.relays.forEach(r => r.emissiveIntensity = 0); this.verify.forEach(r => r.emissiveIntensity = 0); this.aux.mat.emissiveIntensity = 0; this.emitSteam(dt); fx?.steam(0, 0); return; }
    this.gauge.draw(v.safeLow, v.safeHigh); this.fine.set(v.fine ? 1 : 0); this.bypass.set(v.bypass ? 1 : 0); this.emergency.setUsed(v.emergencyUsed); this.clamp.set(v.clamped);
    if (v.noiseAt > 0 && v.noiseAt !== this.lastNoiseAt) { if (this.lastNoiseAt > 0) { this.gauge.kick(v.noise); fx?.knock(.25 + Math.abs(v.noise) * .1); } this.lastNoiseAt = v.noiseAt; }
    const zone = v.pressure >= v.safeLow && v.pressure <= v.safeHigh, running = v.outcome === 'RUNNING', failed = v.outcome === 'FAILED', critical = running && v.pressure >= 100;
    this.gauge.update(dt, v.pressure, v.surgeWarning ? .6 : critical ? 1 : 0, zone && running);
    // server-confirmed effect of the latest action (resistance, steam)
    const e = v.effect; if (e && e.seq !== this.lastEffect) { const first = this.lastEffect < 0; this.lastEffect = e.seq; if (!first) {
      if (e.jammed) (e.action === 'RED' ? this.red : this.blue).jam();
      if (e.action === 'EMERGENCY') { this.burst(this.ventAt, 46, .55); fx?.burst(); }
      else if (e.delta < 0 && (e.action === 'RED' || e.action === 'BLUE')) { this.burst(this.nozzle, e.delta <= -10 ? 16 : 5, .35); fx?.vent(e.delta <= -10 ? 1 : .4); } } }
    // diagnostics: relay lamps chase while the code window scrolls, then the code holds
    this.relays.forEach((m, i) => { m.emissiveIntensity = v.diagnosing ? (Math.floor(this.t * 10) % 3 === i ? 3 : .2) : v.code ? .6 : 0; });
    this.drawCode(v.code, v.diagnosing); this.aux.mat.emissiveIntensity = v.bypass ? 2 : 0;
    // stability lamps fill over the 1 s check
    const k = v.verifyMs / VERIFY_MS * 3; this.verify.forEach((m, i) => { m.emissiveIntensity = v.outcome === 'STABILIZED' || k >= i + 1 ? 2.4 : k > i ? .4 + (k - i) : 0; });
    const step = Math.floor(k); if (step > this.lastVerifyStep && running) fx?.tick(step); this.lastVerifyStep = v.verifyMs > 0 ? step : 0;
    // warning lamp: orange flashing during a surge warning, red when high or failed, off on success
    const flash = Math.sin(this.t * 18) > 0;
    this.warn.mat.emissive.set(v.surgeWarning ? '#ff8a10' : '#ff2a10'); this.warn.mat.emissiveIntensity = v.surgeWarning ? (flash ? 4 : .3) : failed ? 3 + Math.sin(this.t * 9) : critical ? (Math.sin(this.t * 12) > 0 ? 3 : .3) : 0;
    this.warnLight.color.set(v.surgeWarning ? '#ff8a10' : '#ff2a10'); this.warnLight.intensity = this.warn.mat.emissiveIntensity * .4;
    this.ok.mat.emissiveIntensity = v.outcome === 'STABILIZED' ? 3 : 0;
    if (v.surgeWarning) { this.whistleT -= dt; if (this.whistleT <= 0) { this.whistleT = 2.2; fx?.whistle(); } } else this.whistleT = 0;
    if (v.surged && !this.surgedSeen) { this.surgedSeen = true; fx?.surge(); fx?.knock(1); this.burst(this.nozzle, 10, .4); }
    if (critical || failed) { this.alarmT -= dt; if (this.alarmT <= 0) { this.alarmT = .8; if (running) fx?.alarm(); } } else this.alarmT = 0;
    const shake = critical || v.surgeWarning; this.pipes.position.set(shake ? (Math.random() - .5) * .0016 : 0, shake ? (Math.random() - .5) * .0016 : 0, 0);
    if (v.outcome !== this.lastOutcome) { this.lastOutcome = v.outcome; if (failed) { if (v.failReason === 'CRITICAL') this.explode(); else { this.burst(this.nozzle, 40, .6); this.burst(this.leakAt, 26, .5); this.burst(this.ventAt, 26, .5); } } }
    // an uncontrolled leak weeps visibly at the damaged joint (the server publishes the unsafe state, not the fault)
    if (running && !v.safeState) { this.leakAcc += dt * 14; while (this.leakAcc >= 1) { this.leakAcc--; this.spawn(this.leakAt, .12, .03); } }
    fx?.steam(running && !v.safeState ? .45 : 0, running ? .2 + v.pressure / 120 * .8 : 0);
    this.emitSteam(dt); this.updateBlast(dt);
  }
  /** called by the page when a new machine starts */
  reset() { this.gauge.repair(); this.stack.rotation.z = 0; this.stack.position.set(0, 0, 0); this.lastNoiseAt = -1; this.clamp.fitted = false; this.lastEffect = -1; this.surgedSeen = false; this.lastOutcome = 'RUNNING'; this.emergency.used = false; }

  // ---------------------------------------------------------------- steam
  private spawn(at: T.Vector3, speed: number, spread: number, size = .05) {
    const N = this.sp.length / 3, i = this.cursor; this.cursor = (i + 1) % N; const L = this.life;
    this.sp[i * 3] = at.x; this.sp[i * 3 + 1] = at.y; this.sp[i * 3 + 2] = at.z; L[i * 5] = 0;
    L[i * 5 + 1] = (Math.random() - .5) * spread * 4; L[i * 5 + 2] = speed * (.6 + Math.random() * .6); L[i * 5 + 3] = .05 + Math.random() * spread * 3; L[i * 5 + 4] = size * (.7 + Math.random() * .6);
  }
  private burst(at: T.Vector3, n: number, speed: number) { for (let i = 0; i < n; i++) this.spawn(at, speed, .08, .07); }
  private emitSteam(dt: number) {
    const N = this.sp.length / 3, L = this.life, age = this.steam.geometry.attributes.age as T.BufferAttribute, size = this.steam.geometry.attributes.size as T.BufferAttribute;
    for (let i = 0; i < N; i++) { let l = L[i * 5]; if (l >= 1) { age.setX(i, 0); continue; } l = Math.min(1, l + dt / 1.5); L[i * 5] = l; const drag = Math.exp(-dt * 1.6);
      L[i * 5 + 1] *= drag; L[i * 5 + 3] *= drag; L[i * 5 + 2] = L[i * 5 + 2] * drag + .07 * dt;
      this.sp[i * 3] += L[i * 5 + 1] * dt; this.sp[i * 3 + 1] += L[i * 5 + 2] * dt; this.sp[i * 3 + 2] += L[i * 5 + 3] * dt; age.setX(i, l >= 1 ? 0 : Math.max(.001, l)); size.setX(i, L[i * 5 + 4]); }
    (this.steam.geometry.attributes.position as T.BufferAttribute).needsUpdate = true; age.needsUpdate = true; size.needsUpdate = true;
  }
}
