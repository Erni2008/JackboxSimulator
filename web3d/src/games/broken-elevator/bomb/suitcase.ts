// АДСКАЯ КЛЕТКА — THE HOST'S SUITCASE: the case itself.
// A leather-and-steel instrument case left on the cage floor. Tap it to pick it up: it rises into the player's hands
// (drawn in its own pass, so cage bars never cut through it), turns under one-finger / mouse drags with inertia,
// zooms toward the finger (pinch / wheel), two latches release one by one and the lid swings on real hinges.
// Inside: five mechanism bays (I–V). One is armed for this event (its lamp burns red); the rest are dead decoration.
// The bays expose `bays[m].mount` for the mechanisms themselves (stage 4). Fictional device, invented for the game.
import * as T from 'three';
import {loadLeather, leatherMaps, leatherMaterial, brassMaterial, TEX} from '../manual/materials';
import {L} from '../i18n';
import {mergeStatic} from './merge';

export type Mechanism = 'WIRE_MAZE' | 'HIDDEN_CONNECTIONS' | 'XRAY' | 'LASER' | 'THERMAL';
export const MECHANISMS: Mechanism[] = ['WIRE_MAZE', 'HIDDEN_CONNECTIONS', 'XRAY', 'LASER', 'THERMAL'];
export const MECH_NAME: Record<Mechanism, () => string> = {WIRE_MAZE: () => L('Лабиринт проводов', 'Wire maze'), HIDDEN_CONNECTIONS: () => L('Скрытые соединения', 'Hidden connections'),
  XRAY: () => L('Рентген', 'X-ray inspection'), LASER: () => L('Лазерный контур', 'Laser routing'), THERMAL: () => L('Тепловая угроза', 'Thermal threat')};
export const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
export type CaseEvent = 'PICKUP' | 'PUTDOWN' | 'LATCH' | 'LOCKED' | 'LID_OPEN' | 'LID_OPENED' | 'FOCUS';

// outer size (m): a doctor's-bag sized instrument case lying flat
const W = .46, D = .32, HB = .095, HL = .05, WALL = .007;
const rnd = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;
function canvasTex(w: number, h: number, draw: (x: CanvasRenderingContext2D) => void, srgb = true) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!); const t = new T.CanvasTexture(c); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 8; return t; }

/** worn enamel plate / stencil printed on a canvas */
function plateTex(lines: {t: string; font: string; y: number; color?: string}[], w: number, h: number, bg: string, border = true, seed = 3) {
  return canvasTex(w, h, x => { const r = rnd(seed); x.fillStyle = bg; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 400; i++) { x.fillStyle = `rgba(0,0,0,${r() * .08})`; x.fillRect(r() * w, r() * h, 1 + r() * 4, 1 + r() * 2); }
    if (border) { x.strokeStyle = 'rgba(30,20,12,.8)'; x.lineWidth = h * .035; x.strokeRect(h * .06, h * .06, w - h * .12, h - h * .12); }
    x.textAlign = 'center'; x.textBaseline = 'middle'; for (const l of lines) { x.font = l.font; x.fillStyle = l.color ?? '#20160e'; x.fillText(l.t, w / 2, l.y * h); }
    // chipped enamel at the edges
    x.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 24; i++) { x.beginPath(); const e = r() < .5, px = e ? (r() < .5 ? 0 : w) : r() * w, py = e ? r() * h : (r() < .5 ? 0 : h); x.arc(px, py, 2 + r() * 7, 0, 7); x.fill(); } });
}

export class Suitcase {
  readonly root = new T.Group(); /** user rotation pivot (centre of the case) */ readonly body = new T.Group(); readonly lid = new T.Group(); readonly interior = new T.Group();
  readonly bays = {} as Record<Mechanism, {group: T.Group; mount: T.Group; lamp: T.MeshStandardMaterial; size: [number, number]}>;
  onEvent: (e: CaseEvent) => void = () => {};
  /** taps inside the open case go to the armed mechanism first (true = handled) */ onTap: ((r: T.Raycaster) => boolean) | null = null; private downRay = new T.Ray();
  /** a drag that starts on a tool (a scanner) moves the tool instead of turning the case */ onGrab: ((r: T.Raycaster) => ((r: T.Raycaster) => void) | null) | null = null;
  private grab: ((r: T.Raycaster) => void) | null = null; private cam: T.Camera | null = null; private grabMoved = false;
  /** the armed mechanisms (3 of 5) and the ones already neutralised (their lamps go out) */ armed: Mechanism[] = []; neutral = new Set<Mechanism>();
  /** floor | lifting | held | returning */ state: 'floor' | 'lifting' | 'held' | 'returning' = 'floor';
  latchOpen = [false, false]; lidT = 0; lidTarget = 0; found = false; enabled = false;
  private latches: {g: T.Group; clasp: T.Group; t: number}[] = []; private hitMeshes: T.Object3D[] = []; private lidHit!: T.Mesh;
  private floorPos = new T.Vector3(); private floorQuat = new T.Quaternion(); private liftK = 0;
  private yaw = 0; private pitch = .62; private vYaw = 0; private vPitch = 0; private dist = 1; private zoom = 1; private off = new T.Vector2(); private aim: {yaw: number; pitch: number} | null = null;
  private dragging = false; private last = {x: 0, y: 0, t: 0}; private downHit: T.Intersection | null = null; private glowMats: T.MeshStandardMaterial[] = []; private time = 0; private rattle = 0;
  private timerTex!: T.CanvasTexture; private timerCtx!: CanvasRenderingContext2D; private shownSec = -1; private timerLamp!: T.MeshStandardMaterial; private urgency = 0;
  private overlay: T.Scene; private home!: T.Object3D;
  /** the bay brought up to fill the view (null = the whole case) */ focus: Mechanism | null = null; private focusT = 0;
  /** hull points (body space; the lid's in lid space) used to keep the near plane out of the model */ private hullBody: T.Vector3[] = []; private hullLid: T.Vector3[] = [];

  /** overlay: the scene drawn after the cage with a cleared depth buffer (the case in hand is never clipped by bars) */
  constructor(overlay: T.Scene, hq: boolean) {
    this.overlay = overlay; this.root.add(this.body); this.root.name = 'suitcase';
    const steel = this.steel(hq), brass = brassMaterial(8), dark = new T.MeshStandardMaterial({color: '#1d1b19', metalness: .7, roughness: .55});
    brass.emissive = new T.Color('#ff8a3a'); brass.emissiveIntensity = 0; this.glowMats.push(brass as unknown as T.MeshStandardMaterial);
    const leather = new T.MeshStandardMaterial({color: '#3a2618', roughness: .72, metalness: 0}); // swapped for the scanned leather once it loads
    loadLeather().then(src => { const m = leatherMaterial(leatherMaps(src, {w: 512, h: 512, seed: 77, tiles: 2, edgeWear: .6}, 8)); m.color = new T.Color('#8a6448'); m.normalScale.set(.7, .7); this.root.traverse(o => { if ((o as T.Mesh).material === leather) (o as T.Mesh).material = m; }); }).catch(() => {});
    const box = (w: number, h: number, d: number, m: T.Material, x: number, y: number, z: number, parent: T.Object3D = this.body) => { const k = new T.Mesh(new T.BoxGeometry(w, h, d), m); k.position.set(x, y, z); k.castShadow = k.receiveShadow = true; parent.add(k); return k; };

    // ---- base shell (open top): leather panels with steel angle trim
    const baseY0 = -(HB + HL) / 2, seamY = baseY0 + HB;
    this.leatherMeshes.push(box(W, WALL, D, leather, 0, baseY0 + WALL / 2, 0));
    this.leatherMeshes.push(box(W, HB, WALL, leather, 0, baseY0 + HB / 2, D / 2 - WALL / 2), box(W, HB, WALL, leather, 0, baseY0 + HB / 2, -D / 2 + WALL / 2));
    this.leatherMeshes.push(box(WALL, HB, D - 2 * WALL, leather, W / 2 - WALL / 2, baseY0 + HB / 2, 0), box(WALL, HB, D - 2 * WALL, leather, -W / 2 + WALL / 2, baseY0 + HB / 2, 0));
    // steel angle along every edge of the base + the seam band
    const tr = .011; const edgeX = (y: number, z: number) => box(W + .004, tr, tr, steel, 0, y, z), edgeZ = (x: number, y: number) => box(tr, tr, D + .004, steel, x, y, 0), edgeY = (x: number, z: number, h: number, y: number, p: T.Object3D) => box(tr, h, tr, steel, x, y, z, p);
    for (const z of [D / 2, -D / 2]) { edgeX(baseY0 + tr / 2, z); edgeX(seamY - tr / 2, z); }
    for (const x of [W / 2, -W / 2]) { edgeZ(x, baseY0 + tr / 2); edgeZ(x, seamY - tr / 2); }
    for (const x of [W / 2, -W / 2]) for (const z of [D / 2, -D / 2]) edgeY(x, z, HB, baseY0 + HB / 2, this.body);
    // brass corner caps + feet
    for (const x of [1, -1]) for (const z of [1, -1]) { box(.03, .03, .03, brass, x * (W / 2 - .01), baseY0 + .012, z * (D / 2 - .01));
      const f = new T.Mesh(new T.CylinderGeometry(.011, .013, .008, 12), brass); f.position.set(x * (W / 2 - .05), baseY0 - .004, z * (D / 2 - .05)); this.body.add(f); }

    // ---- lid: hinged along the back top edge
    this.lid.position.set(0, seamY, -D / 2); this.body.add(this.lid);
    const lz = D / 2; // lid geometry is offset so the hinge is the lid group's origin
    this.leatherMeshes.push(box(W, WALL, D, leather, 0, HL - WALL / 2, lz, this.lid));
    this.leatherMeshes.push(box(W, HL, WALL, leather, 0, HL / 2, lz + D / 2 - WALL / 2, this.lid), box(W, HL, WALL, leather, 0, HL / 2, lz - D / 2 + WALL / 2, this.lid));
    this.leatherMeshes.push(box(WALL, HL, D - 2 * WALL, leather, W / 2 - WALL / 2, HL / 2, lz, this.lid), box(WALL, HL, D - 2 * WALL, leather, -W / 2 + WALL / 2, HL / 2, lz, this.lid));
    for (const z of [lz + D / 2, lz - D / 2]) { box(W + .004, tr, tr, steel, 0, tr / 2, z, this.lid); box(W + .004, tr, tr, steel, 0, HL - tr / 2, z, this.lid); }
    for (const x of [W / 2, -W / 2]) { box(tr, tr, D + .004, steel, x, tr / 2, lz, this.lid); box(tr, tr, D + .004, steel, x, HL - tr / 2, lz, this.lid); }
    for (const x of [W / 2, -W / 2]) for (const z of [lz + D / 2, lz - D / 2]) edgeY(x, z, HL, HL / 2, this.lid);
    for (const x of [1, -1]) for (const z of [1, -1]) box(.03, .03, .03, brass, x * (W / 2 - .01), HL - .012, lz + z * (D / 2 - .01), this.lid);
    // lid top: two leather straps riveted across, a stencilled warning
    for (const x of [-.12, .12]) { box(.035, .003, D + .006, dark, x, HL + .001, lz, this.lid); }
    const stencil = new T.Mesh(new T.PlaneGeometry(.2, .07), new T.MeshStandardMaterial({map: plateTex([{t: L('НЕ ОТКРЫВАТЬ', 'DO NOT OPEN'), font: 'bold 64px Oswald, sans-serif', y: .38, color: '#c8b48a'}, {t: L('собственность ведущего', "property of the host"), font: 'italic 34px "IM Fell English", serif', y: .76, color: '#c8b48a'}], 512, 180, 'rgba(0,0,0,0)', false, 9), transparent: true, roughness: .8, depthWrite: false}));
    stencil.rotation.x = -Math.PI / 2; stencil.position.set(0, HL + .0035, lz + .04); this.lid.add(stencil);
    // inside of the lid: a steel plate with the countdown and a worn warning card (faces the player once the lid stands open)
    const inner = box(W - .03, .003, D - .03, dark, 0, HL - WALL - .002, lz, this.lid); inner.castShadow = false;
    this.timerCtx = document.createElement('canvas').getContext('2d')!; this.timerCtx.canvas.width = 512; this.timerCtx.canvas.height = 192; this.timerTex = new T.CanvasTexture(this.timerCtx.canvas); this.timerTex.colorSpace = T.SRGBColorSpace;
    const tm = new T.Mesh(new T.PlaneGeometry(.15, .056), new T.MeshBasicMaterial({map: this.timerTex, toneMapped: false})); tm.rotation.x = Math.PI / 2; tm.position.set(0, HL - WALL - .0045, lz + .02); this.lid.add(tm);
    box(.165, .006, .07, brass, 0, HL - WALL - .0025, lz + .02, this.lid); tm.position.y -= .002;
    const card = new T.Mesh(new T.PlaneGeometry(.2, .085), new T.MeshStandardMaterial({map: plateTex([{t: L('ВНИМАНИЕ', 'WARNING'), font: 'bold 70px Oswald, sans-serif', y: .26, color: '#7a1408'}, {t: L('Красная лампа — заряженный механизм.', 'A red lamp marks the armed mechanism.'), font: '34px "IM Fell English", serif', y: .58}, {t: L('Сверяйся с блокнотом. Ошибок не прощаю.', 'Use the notebook. I do not forgive mistakes.'), font: 'italic 32px "IM Fell English", serif', y: .82}], 768, 300, '#cdbb92', true, 5), roughness: .9}));
    card.rotation.x = Math.PI / 2; card.position.set(0, HL - WALL - .0045, lz + .1); this.lid.add(card);
    this.timerLamp = new T.MeshStandardMaterial({color: '#300', emissive: '#ff2a10', emissiveIntensity: 0}); const tl = new T.Mesh(new T.SphereGeometry(.006, 12, 8), this.timerLamp); tl.position.set(.095, HL - WALL - .006, lz + .02); this.lid.add(tl);
    this.lidHit = box(W, HL, D, new T.MeshBasicMaterial({visible: false}), 0, HL / 2, lz, this.lid); this.lidHit.castShadow = false; this.lidHit.userData.part = 'lid'; this.hitMeshes.push(this.lidHit);

    // hinges on the back seam
    for (const x of [-.14, .14]) { const h = new T.Mesh(new T.CylinderGeometry(.006, .006, .06, 12), steel); h.rotation.z = Math.PI / 2; h.position.set(x, seamY, -D / 2 - .004); this.body.add(h); }
    // carrying handle on the front (leather grip on brass loops)
    for (const x of [-.06, .06]) box(.012, .022, .012, brass, x, seamY - .03, D / 2 + .008);
    const grip = new T.Mesh(new T.CapsuleGeometry(.011, .1, 4, 10), leather); grip.rotation.z = Math.PI / 2; grip.position.set(0, seamY - .044, D / 2 + .022); this.body.add(grip); this.leatherMeshes.push(grip);
    // latches: a plate on the base, a hinged clasp hooked over a keeper on the lid
    for (const x of [-.15, .15]) { const g = new T.Group(); g.position.set(x, seamY, D / 2 + .004); this.body.add(g);
      box(.034, .03, .004, brass, 0, -.018, 0, g); const clasp = new T.Group(); clasp.position.set(0, -.028, .004); g.add(clasp);
      const c = box(.026, .04, .004, brass, 0, .02, .002, clasp); c.userData.part = 'latch'; c.userData.latch = this.latches.length; this.hitMeshes.push(c);
      const hit = new T.Mesh(new T.BoxGeometry(.05, .06, .03), new T.MeshBasicMaterial({visible: false})); hit.position.set(0, .015, .006); hit.userData = {part: 'latch', latch: this.latches.length}; clasp.add(hit); this.hitMeshes.push(hit);
      const keeper = new T.Mesh(new T.TorusGeometry(.007, .0022, 6, 12, Math.PI), brass); keeper.position.set(x, .016, D + .006); this.lid.add(keeper);
      this.latches.push({g, clasp, t: 0}); }
    // back: maker's serial plate; bottom: stencil (seen when the case is turned over)
    const serial = new T.Mesh(new T.PlaneGeometry(.12, .04), new T.MeshStandardMaterial({map: plateTex([{t: L('МАСТЕРСКАЯ «ФИНАЛ»', 'THE "FINAL" WORKSHOP'), font: 'bold 34px "IM Fell English SC", serif', y: .38}, {t: '№ 0451 · 1889', font: '32px "IBM Plex Mono", monospace', y: .74}], 480, 160, '#b89a62', true, 11), metalness: .6, roughness: .45}));
    serial.position.set(.13, baseY0 + HB * .45, -D / 2 - .0015); serial.rotation.y = Math.PI; this.body.add(serial);
    const bottom = new T.Mesh(new T.PlaneGeometry(.3, .16), new T.MeshStandardMaterial({map: plateTex([{t: L('ВЕРХ ↑ НЕ КАНТОВАТЬ', 'THIS SIDE DOWN · DO NOT TIP'), font: 'bold 52px Oswald, sans-serif', y: .32, color: '#b9a37a'}, {t: '⚠', font: '90px serif', y: .72, color: '#9a2a14'}], 640, 340, 'rgba(0,0,0,0)', false, 13), transparent: true, depthWrite: false, roughness: .9}));
    bottom.rotation.x = Math.PI / 2; bottom.position.set(0, baseY0 - .0005, 0); this.body.add(bottom);
    // rivets along the trims (one instanced mesh)
    const rv: T.Vector3[] = []; for (let i = 0; i < 9; i++) { const x = -W / 2 + .03 + i * (W - .06) / 8; rv.push(new T.Vector3(x, baseY0 + .005, D / 2 + .006), new T.Vector3(x, baseY0 + .005, -D / 2 - .006)); }
    const rivets = new T.InstancedMesh(new T.SphereGeometry(.0028, 8, 6), steel, rv.length); rv.forEach((p, i) => rivets.setMatrixAt(i, new T.Matrix4().makeTranslation(p.x, p.y, p.z))); this.body.add(rivets);

    // ---- interior tray with the five bays
    this.interior.position.y = seamY - .028; this.body.add(this.interior);
    const tray = new T.Mesh(new T.BoxGeometry(W - 2 * WALL, .004, D - 2 * WALL), new T.MeshStandardMaterial({color: '#2a2622', metalness: .75, roughness: .5, map: this.grime(31)})); tray.receiveShadow = true; this.interior.add(tray);
    const frameM = new T.MeshStandardMaterial({color: '#6e5430', metalness: .9, roughness: .48, map: this.grime(57)}); // darker, worn brass for the bay frames
    const layout: [Mechanism, number, number, number, number][] = [['WIRE_MAZE', -.145, -.068, .15, .15], ['HIDDEN_CONNECTIONS', 0, -.068, .125, .13], ['XRAY', .145, -.068, .13, .13], ['LASER', -.085, .072, .25, .12], ['THERMAL', .14, .072, .15, .12]];
    layout.forEach(([m, x, z, w, d], i) => { const g = new T.Group(); g.position.set(x, .002, z); this.interior.add(g);
      const plate = new T.Mesh(new T.BoxGeometry(w, .003, d), new T.MeshStandardMaterial({color: '#191715', metalness: .6, roughness: .6})); plate.position.y = .0015; g.add(plate);
      for (const [fx, fz, fw, fd] of [[0, -d / 2, w + .006, .005], [0, d / 2, w + .006, .005], [-w / 2, 0, .005, d], [w / 2, 0, .005, d]] as const) box(fw, .007, fd, frameM, fx, .0035, fz, g);
      const tag = new T.Mesh(new T.PlaneGeometry(.06, .013), new T.MeshStandardMaterial({map: plateTex([{t: `${ROMAN[i]} · ${MECH_NAME[m]().toUpperCase()}`, font: 'bold 40px Oswald, sans-serif', y: .54, color: '#1a120a'}], 512, 110, '#bfa774', false, 20 + i), roughness: .6, metalness: .3}));
      tag.rotation.x = -Math.PI / 2; tag.position.set(-w / 2 + .034, .0075, d / 2 - .0095); g.add(tag);
      const lamp = new T.MeshStandardMaterial({color: '#2a0806', emissive: '#ff1e0a', emissiveIntensity: 0, roughness: .3}); const lb = new T.Mesh(new T.SphereGeometry(.0055, 14, 10), lamp); lb.position.set(w / 2 - .012, .006, d / 2 - .012); g.add(lb);
      const ring = new T.Mesh(new T.TorusGeometry(.0068, .0016, 6, 16), brass); ring.rotation.x = Math.PI / 2; ring.position.copy(lb.position); g.add(ring);
      const mount = new T.Group(); mount.position.y = .003; g.add(mount); this.bays[m] = {group: g, mount, lamp, size: [w, d]}; });
    for (const x of [-W / 2, W / 2]) for (const z of [-D / 2, D / 2]) { for (const y of [baseY0, seamY]) this.hullBody.push(new T.Vector3(x, y, z)); for (const y of [0, HL]) this.hullLid.push(new T.Vector3(x, y, z + D / 2)); }
    this.drawTimer(0); mergeStatic(this.root);
  }
  private leatherMeshes: T.Mesh[] = [];
  private grime(seed: number) { return canvasTex(256, 256, x => { const r = rnd(seed); x.fillStyle = '#b8b2aa'; x.fillRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${r() < .3 ? '90,50,20' : '20,18,16'},${r() * .12})`; x.fillRect(r() * 256, r() * 256, 1 + r() * 10, 1 + r() * 3); } }); }
  private steel(hq: boolean) {
    const ld = new T.TextureLoader(), tx = (f: string, srgb: boolean) => { const t = ld.load(TEX + f); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(3, 3); return t; };
    return new T.MeshStandardMaterial({color: '#6c6862', map: tx('rusty_metal_05_diff_1k.jpg', true), normalMap: hq ? tx('rusty_metal_05_nor_gl_1k.jpg', false) : null, roughnessMap: tx('rusty_metal_05_rough_1k.jpg', false), metalness: .85, roughness: .7});
  }

  /** lies on the cage floor: a dark corner by the back wall (the first place nobody looks) */
  place(ci: T.Box3 | undefined, floorY: number) {
    const x = ci ? ci.max.x - .3 : .8, z = ci ? ci.min.z + .24 : -.6; this.root.position.set(x, floorY + (HB + HL) / 2 + .004, z); this.root.rotation.set(0, -.35, 0);
    this.root.updateMatrixWorld(true); this.floorPos.copy(this.root.position); this.floorQuat.copy(this.root.quaternion); this.home = this.root.parent ?? this.root;
  }
  center() { return this.root.getWorldPosition(new T.Vector3()); }
  /** set the armed mechanism for this event */
  arm(list: Mechanism[], done: Set<Mechanism>) { this.armed = [...list]; this.neutral = done; }
  /** bring a bay up to fill the view (the case turns its tray to the player); null returns to the whole case */
  focusOn(m: Mechanism | null) { this.focus = m; this.focusT = m ? 1.1 : 0; if (m) { this.aim = {yaw: 0, pitch: 1.42}; } else { this.aim = {yaw: 0, pitch: .95}; this.zoom = 1; this.off.set(0, 0); } }
  reset() { this.focus = null; this.latchOpen = [false, false]; this.lidT = this.lidTarget = 0; this.found = false; for (const l of this.latches) { l.t = 0; l.clasp.rotation.x = 0; } this.lid.rotation.x = 0; this.yaw = 0; this.pitch = .62; this.zoom = 1; this.off.set(0, 0); this.urgency = 0; }
  get open() { return this.lidT > .97; }
  get held() { return this.state === 'held' || this.state === 'lifting'; }

  hits(ray: T.Raycaster) { return ray.intersectObject(this.root, true)[0] ?? null; }
  /** pick up: hand the case to the overlay pass and fly it into view */
  pickUp() { if (this.held) return; this.overlay.attach(this.root); this.state = 'lifting'; this.liftK = 0; if (!this.found) { this.found = true; this.yaw = -.35; } this.onEvent('PICKUP'); }
  putDown() { if (!this.held) return; this.state = 'returning'; this.onEvent('PUTDOWN'); }

  // ---------------------------------------------------------------- input (device contract of the cage page)
  pointerDown(ray: T.Raycaster, x: number, y: number) { if (this.state !== 'held') return false; this.downRay.copy(ray.ray);
    this.grab = this.open && this.focus && this.onGrab ? this.onGrab(ray) : null; this.grabMoved = false; if (this.grab) { this.last = {x, y, t: performance.now()}; this.downHit = null; return true; } this.downHit = ray.intersectObjects(this.hitMeshes.concat(this.interior), true)[0] ?? null; this.dragging = true; this.last = {x, y, t: performance.now()}; this.vYaw = this.vPitch = 0; this.aim = null; return true; }
  pointerMove(x: number, y: number) { if (this.grab && this.cam) { if (Math.hypot(x - this.last.x, y - this.last.y) > 3) this.grabMoved = true; const rc = new T.Raycaster(); rc.setFromCamera(new T.Vector2(x / innerWidth * 2 - 1, -y / innerHeight * 2 + 1), this.cam); this.grab(rc); return; }
    if (!this.dragging) return; const k = 3.2 / Math.max(innerHeight, 420), dx = (x - this.last.x) * k, dy = (y - this.last.y) * k, now = performance.now(), dt = Math.max(1, now - this.last.t) / 1000;
    this.yaw += dx; this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch + dy)); this.vYaw = this.vYaw * .5 + dx / dt * .5; this.vPitch = this.vPitch * .5 + dy / dt * .5; this.last = {x, y, t: now}; }
  pointerUp(tap: boolean) { if (this.grab) { this.grab = null; if (tap) { const rc = new T.Raycaster(); rc.ray.copy(this.downRay); this.onTap?.(rc); } return; } this.dragging = false; if (performance.now() - this.last.t > 80) this.vYaw = this.vPitch = 0; if (tap) { this.vYaw = this.vPitch = 0; const rc = new T.Raycaster(); rc.ray.copy(this.downRay); if (!(this.open && this.onTap?.(rc))) this.tapPart(this.downHit); } this.downHit = null; }
  /** pinch / wheel: k > 1 brings the case closer; (nx, ny) is the finger / cursor in NDC, which stays over the same spot */
  zoomBy(k: number, nx: number, ny: number, camera: T.PerspectiveCamera) {
    this.focusT = 0; const z0 = this.zoom, z1 = Math.max(.75, Math.min(this.focus ? 9 : 4, z0 * k)); if (z1 === z0) return; const d0 = this.dist / z0, d1 = this.dist / z1, ty = Math.tan(T.MathUtils.degToRad(camera.fov / 2)), tx = ty * camera.aspect;
    // keep the point under the finger: O' = O + u·(d1 − d0), u = the finger's direction per metre of depth
    this.off.x = this.clampOff(this.off.x + nx * tx * (d1 - d0), tx * d1); this.off.y = this.clampOff(this.off.y + ny * ty * (d1 - d0), ty * d1); this.zoom = z1;
  }
  private clampOff(v: number, half: number) { return Math.max(-half * .9, Math.min(half * .9, v)); }
  /** two-finger / right-button pan in pixels */
  pan(dx: number, dy: number, camera: T.PerspectiveCamera) { const d = this.dist / this.zoom, ty = Math.tan(T.MathUtils.degToRad(camera.fov / 2)), s = 2 * ty * d / Math.max(innerHeight, 1);
    this.off.x = this.clampOff(this.off.x + dx * s, ty * camera.aspect * d); this.off.y = this.clampOff(this.off.y - dy * s, ty * d); }

  private tapPart(h: T.Intersection | null) {
    if (!h) return; const ud = h.object.userData;
    if (ud.part === 'latch') { const i = ud.latch as number; if (!this.latchOpen[i]) { this.latchOpen[i] = true; this.onEvent('LATCH'); } return; }
    if (this.open && !this.focus) { for (const m of MECHANISMS) { let o: T.Object3D | null = h.object; while (o && o !== this.bays[m].group) o = o.parent; if (o) { this.focusOn(m); this.onEvent('FOCUS'); return; } } }
    if (ud.part === 'lid' && this.lidTarget === 0) { if (this.latchOpen.every(Boolean)) { this.lidTarget = 1; this.onEvent('LID_OPEN'); this.aim = {yaw: 0, pitch: .95}; this.off.set(0, 0); } else { this.rattle = 1; this.onEvent('LOCKED'); } }
  }
  /** the mechanism under a ray (for stage 4 tools), when the lid is open */
  bayHit(ray: T.Raycaster): Mechanism | null { if (!this.open) return null; for (const m of MECHANISMS) if (ray.intersectObject(this.bays[m].group, true).length) return m; return null; }

  setTimer(sec: number, limit: number) { const s = Math.max(0, Math.ceil(sec)); this.urgency = limit > 0 ? Math.max(0, 1 - sec / Math.min(15, limit * .3)) : 0; if (s !== this.shownSec) this.drawTimer(s); }
  private drawTimer(s: number) { this.shownSec = s; const x = this.timerCtx, w = 512, h = 192; x.fillStyle = '#0c0705'; x.fillRect(0, 0, w, h);
    const txt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; x.font = 'bold 150px "IBM Plex Mono", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = 'rgba(255,90,40,.08)'; x.fillText('8:88', w / 2, h / 2 + 6); x.shadowColor = s <= 10 ? '#ff2a10' : '#ff7a2a'; x.shadowBlur = 24; x.fillStyle = s <= 10 ? '#ff4a2a' : '#ffae5a'; x.fillText(txt, w / 2, h / 2 + 6); x.shadowBlur = 0;
    this.timerTex.needsUpdate = true; }

  update(dt: number, camera: T.PerspectiveCamera, gazed: boolean) {
    this.time += dt; this.cam = camera; const e = 1 - Math.exp(-dt * 7);
    // restrained "something is here" cue: brass catches a slow warm glint until the case has been found; brighter while looked at
    const glow = this.state === 'floor' && this.enabled ? (this.found ? (gazed ? .25 : 0) : (gazed ? .55 : .1 + .08 * Math.sin(this.time * 2.2))) : 0; for (const m of this.glowMats) m.emissiveIntensity += (glow - m.emissiveIntensity) * e;
    // latches flip up, then the lid swings (eased, with a slight overshoot at the stop)
    for (let i = 0; i < 2; i++) { const l = this.latches[i]; l.t += ((this.latchOpen[i] ? 1 : 0) - l.t) * (1 - Math.exp(-dt * 14)); l.clasp.rotation.x = -l.t * 2.1; }
    if (this.lidTarget > this.lidT) { const was = this.lidT; this.lidT = Math.min(1, this.lidT + dt * .85); if (was < 1 && this.lidT >= 1) this.onEvent('LID_OPENED'); }
    const s = this.lidT, ease = s < .5 ? 4 * s * s * s : 1 - Math.pow(-2 * s + 2, 3) / 2; this.lid.rotation.x = -ease * 1.92 + (s >= 1 ? 0 : 0) - Math.sin(this.rattle * 30) * this.rattle * .02; this.rattle = Math.max(0, this.rattle - dt * 2.5);
    // lamps: the armed bay burns red with a heartbeat, faster as the fuse runs down
    const beat = 1.4 + this.urgency * 5; for (const m of MECHANISMS) { const on = this.armed.includes(m) && !this.neutral.has(m) && this.enabled; this.bays[m].lamp.emissiveIntensity = on ? 1.2 + 1.6 * Math.max(0, Math.sin(this.time * beat * Math.PI)) ** 3 : 0; }
    this.timerLamp.emissiveIntensity = this.enabled ? (Math.sin(this.time * Math.PI * 2 * (1 + this.urgency * 2)) > 0 ? 2.5 : .2) : 0;
    // orientation: inertia while free, an eased swing when a view is requested (lid opened)
    if (this.aim) { this.yaw += Math.atan2(Math.sin(this.aim.yaw - this.yaw), Math.cos(this.aim.yaw - this.yaw)) * (1 - Math.exp(-dt * 3)); this.pitch += (this.aim.pitch - this.pitch) * (1 - Math.exp(-dt * 3)); if (Math.abs(this.aim.pitch - this.pitch) < .003) this.aim = null; }
    else if (!this.dragging) { this.yaw += this.vYaw * dt; this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch + this.vPitch * dt)); const d = Math.exp(-dt * 4.5); this.vYaw *= d; this.vPitch *= d; }
    // in hand: distance that frames the whole case (width and height, any aspect), then the user's zoom
    const ty = Math.tan(T.MathUtils.degToRad(camera.fov / 2)), tx = ty * camera.aspect, R = this.lidT > .2 ? .37 : .26; this.dist = Math.max(R / (tx * .82), R / (ty * .9), R + .08);
    // a focused bay: centre it and size it to ~88 % of the shorter view side (eases in, then the player is free to zoom / turn)
    if (this.focus && this.focusT > 0) { this.focusT -= dt; const b = this.bays[this.focus], q = new T.Quaternion().setFromEuler(new T.Euler(this.pitch, this.yaw, 0, 'XYZ'));
      const bp = b.group.position.clone().add(this.interior.position).applyQuaternion(q), half = Math.max(b.size[0], b.size[1]) / 2 * 1.08, dBay = half / (Math.min(tx, ty) * .88);
      const kz = 1 - Math.exp(-dt * 5); this.off.x += (-bp.x - this.off.x) * kz; this.off.y += (-bp.y - this.off.y) * kz; this.zoom += (this.dist / Math.max(.05, dBay + bp.z) - this.zoom) * kz; }
    let d = this.dist / this.zoom;
    const hand = camera.position.clone().add(new T.Vector3(this.off.x, this.off.y - (this.focus ? 0 : this.lidT > .2 ? .035 * this.lidT : .01), -d).applyQuaternion(camera.quaternion));
    const handQ = camera.quaternion.clone().multiply(new T.Quaternion().setFromEuler(new T.Euler(this.pitch, this.yaw, 0, 'XYZ')));
    if (this.state === 'lifting' || this.state === 'held') { this.liftK = Math.min(1, this.liftK + dt * 2.2); if (this.liftK >= 1) this.state = 'held'; }
    else if (this.state === 'returning') { this.liftK = Math.max(0, this.liftK - dt * 2.2); if (this.liftK <= 0) { this.state = 'floor'; this.home.attach(this.root); this.root.position.copy(this.floorPos); this.root.quaternion.copy(this.floorQuat); this.zoom = 1; this.off.set(0, 0); } }
    if (this.state !== 'floor') { const k = this.liftK * this.liftK * (3 - 2 * this.liftK), arc = Math.sin(k * Math.PI) * .12;
      this.root.position.copy(this.floorPos).lerp(hand, k).add(new T.Vector3(0, arc, 0)); this.root.quaternion.copy(this.floorQuat).slerp(handQ, k);
      // no clipping: if any hull corner comes nearer than the near plane (+1.5 cm), slide the case back along the view
      if (this.state === 'held') { this.root.updateMatrixWorld(true); const inv = camera.matrixWorldInverse; let minD = 1e9; const v = new T.Vector3();
        for (const p of this.hullBody) { minD = Math.min(minD, -v.copy(p).applyMatrix4(this.body.matrixWorld).applyMatrix4(inv).z); }
        if (!this.focus) for (const p of this.hullLid) { minD = Math.min(minD, -v.copy(p).applyMatrix4(this.lid.matrixWorld).applyMatrix4(inv).z); }
        const need = camera.near + .015 - minD; if (need > 0) { this.root.position.addScaledVector(new T.Vector3(0, 0, -1).applyQuaternion(camera.quaternion), need); this.zoom = this.dist / (d + need); } } }
  }
  dispose() { this.root.traverse(o => { const m = o as T.Mesh; m.geometry?.dispose(); const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []; for (const mt of mats) { for (const v of Object.values(mt) as unknown[]) if (v instanceof T.Texture) (v as T.Texture).dispose(); mt.dispose(); } }); this.root.removeFromParent(); }
}
