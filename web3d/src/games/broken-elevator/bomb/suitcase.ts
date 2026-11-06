// АДСКАЯ КЛЕТКА — THE HOST'S SUITCASE: the case itself.
// A leather-and-steel instrument case left on the cage floor. Tap it to pick it up: it rises into the player's hands
// (drawn in its own pass, so cage bars never cut through it), turns under one-finger / mouse drags with inertia,
// zooms toward the finger (pinch / wheel), two latches release one by one and the lid swings on real hinges.
// Inside: five mechanism bays (I–V). One is armed for this event (its lamp burns red); the rest are dead decoration.
// The bays expose `bays[m].mount` for the mechanisms themselves (stage 4). Fictional device, invented for the game.
import * as T from 'three';
import {brassMaterial, TEX} from '../manual/materials';
import {L} from '../i18n';
import {mergeStatic} from './merge';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

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
    { // fine-grained dark saddle leather straight from the scan (no composited cracks: at case scale they read as stone)
      const ld = new T.TextureLoader(), tx = (f: string, srgb: boolean) => { const t = ld.load(TEX + f); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(3, 3); t.anisotropy = 8; return t; };
      leather.map = tx('brown_leather_albedo_1k.jpg', true); leather.normalMap = tx('brown_leather_nor_gl_1k.jpg', false); leather.normalScale.set(.8, .8);
      leather.color.set('#6e4630'); leather.roughness = .82; leather.envMapIntensity = .3; leather.needsUpdate = true; }
    // every part has softly rounded edges (catches a highlight like real pressed steel and stitched leather)
    const box = (w: number, h: number, d: number, m: T.Material, x: number, y: number, z: number, parent: T.Object3D = this.body) => { const k = new T.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * .42), m); k.position.set(x, y, z); k.castShadow = k.receiveShadow = true; parent.add(k); return k; };

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
    for (const x of [-.12, .12]) { box(.035, .003, D + .006, dark, x, HL + .001, lz, this.lid);
      // brass buckle where each strap meets the front edge: frame, bar and tongue
      for (const [bx, bz, bw, bd] of [[0, -.012, .04, .0035], [0, .012, .04, .0035], [-.0185, 0, .0035, .027], [.0185, 0, .0035, .027], [0, 0, .036, .0022]] as const) box(bw, .0035, bd, brass, x + bx, HL + .0035, lz + D / 2 - .035 + bz, this.lid);
      box(.004, .0025, .016, brass, x, HL + .005, lz + D / 2 - .035 - .004, this.lid); }
    // contrast saddle stitching around the lid top, 9 mm in from the edge
    { const c = document.createElement('canvas'); c.width = 256; c.height = 16; const x = c.getContext('2d')!; for (let i = 0; i < 8; i++) { x.fillStyle = '#c9a77a'; x.beginPath(); x.ellipse(16 + i * 32, 8, 10, 2.6, -.12, 0, 7); x.fill(); x.fillStyle = 'rgba(0,0,0,.45)'; x.beginPath(); x.arc(4 + i * 32, 8, 2, 0, 7); x.fill(); }
      const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = T.RepeatWrapping; const sm = (len: number) => { const tt = t.clone(); tt.repeat.set(len / .02, 1); tt.needsUpdate = true; return new T.MeshStandardMaterial({map: tt, transparent: true, roughness: .8, depthWrite: false}); };
      const inset = .009; for (const [len, px, pz, ry] of [[W - 2 * inset, 0, lz - D / 2 + inset, 0], [W - 2 * inset, 0, lz + D / 2 - inset, 0], [D - 2 * inset, -W / 2 + inset, lz, Math.PI / 2], [D - 2 * inset, W / 2 - inset, lz, Math.PI / 2]] as const) {
        const st = new T.Mesh(new T.PlaneGeometry(len, .0026), sm(len)); st.rotation.set(-Math.PI / 2, 0, ry); st.position.set(px, HL + .0007, pz); st.userData.stitch = true; this.lid.add(st); } }
    const stencil = new T.Mesh(new T.PlaneGeometry(.2, .07), new T.MeshStandardMaterial({map: plateTex([{t: L('НЕ ОТКРЫВАТЬ', 'DO NOT OPEN'), font: 'bold 64px Oswald, sans-serif', y: .38, color: '#c8b48a'}, {t: L('собственность ведущего', "property of the host"), font: 'italic 34px "IM Fell English", serif', y: .76, color: '#c8b48a'}], 512, 180, 'rgba(0,0,0,0)', false, 9), transparent: true, roughness: .8, depthWrite: false}));
    stencil.rotation.x = -Math.PI / 2; stencil.position.set(0, HL + .0035, lz + .04); this.lid.add(stencil);
    // inside of the lid: a steel plate with the countdown and a worn warning card (faces the player once the lid stands open)
    const lining = Suitcase.lining(); const inner = box(W - .016, .003, D - .016, lining, 0, HL - WALL - .002, lz, this.lid); inner.castShadow = false;
    this.timerCtx = document.createElement('canvas').getContext('2d')!; this.timerCtx.canvas.width = 512; this.timerCtx.canvas.height = 192; this.timerTex = new T.CanvasTexture(this.timerCtx.canvas); this.timerTex.colorSpace = T.SRGBColorSpace;
    const tm = new T.Mesh(new T.PlaneGeometry(.15, .056), new T.MeshBasicMaterial({map: this.timerTex, toneMapped: false})); tm.rotation.x = Math.PI / 2; tm.position.set(0, HL - WALL - .0045, lz + .02); this.lid.add(tm);
    box(.165, .006, .07, brass, 0, HL - WALL - .0025, lz + .02, this.lid); tm.position.y -= .002;
    // a thin glass over the countdown: catches the lamp and the lava glow
    const glass = new T.Mesh(new T.PlaneGeometry(.152, .058), new T.MeshStandardMaterial({color: '#ffffff', metalness: .9, roughness: .06, transparent: true, opacity: .16, envMapIntensity: 2.2, depthWrite: false}));
    glass.rotation.x = Math.PI / 2; glass.position.set(0, HL - WALL - .0068, lz + .02); this.lid.add(glass);
    const card = new T.Mesh(new T.PlaneGeometry(.2, .085), new T.MeshStandardMaterial({map: plateTex([{t: L('ВНИМАНИЕ', 'WARNING'), font: 'bold 70px Oswald, sans-serif', y: .26, color: '#7a1408'}, {t: L('Красная лампа — заряженный механизм.', 'A red lamp marks the armed mechanism.'), font: '34px "IM Fell English", serif', y: .58}, {t: L('Сверяйся с блокнотом. Ошибок не прощаю.', 'Use the notebook. I do not forgive mistakes.'), font: 'italic 32px "IM Fell English", serif', y: .82}], 768, 300, '#cdbb92', true, 5), roughness: .9}));
    card.rotation.x = Math.PI / 2; card.position.set(0, HL - WALL - .0045, lz + .1); this.lid.add(card);
    this.timerLamp = new T.MeshStandardMaterial({color: '#300', emissive: '#ff2a10', emissiveIntensity: 0}); const tl = new T.Mesh(new T.SphereGeometry(.006, 12, 8), this.timerLamp); tl.position.set(.095, HL - WALL - .006, lz + .02); this.lid.add(tl);
    this.timerHalo = new T.Sprite(new T.SpriteMaterial({map: Suitcase.haloTex(), color: '#ff3a18', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false})); this.timerHalo.raycast = () => {}; this.timerHalo.position.set(.095, HL - WALL - .012, lz + .02); this.timerHalo.scale.setScalar(.034); this.timerHalo.userData.halo = true; this.lid.add(this.timerHalo);
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
    const TW = W - 2 * WALL, TD = D - 2 * WALL, ao = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 360; const x = c.getContext('2d')!; x.drawImage(this.grime(31).image as HTMLCanvasElement, 0, 0, 512, 360);
      x.filter = 'blur(10px)'; x.fillStyle = 'rgba(0,0,0,.75)'; for (const [bx, bz, bw, bd] of [[-.145, -.068, .15, .15], [0, -.068, .125, .13], [.145, -.068, .13, .13], [-.085, .072, .25, .12], [.14, .072, .15, .12]]) x.fillRect((bx - bw / 2 + TW / 2) / TW * 512 - 4, (bz - bd / 2 + TD / 2) / TD * 360 - 4, bw / TW * 512 + 8, bd / TD * 360 + 8);
      x.filter = 'blur(18px)'; x.strokeStyle = 'rgba(0,0,0,.6)'; x.lineWidth = 30; x.strokeRect(0, 0, 512, 360); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; })();
    const tray = new T.Mesh(new T.BoxGeometry(TW, .004, TD), new T.MeshStandardMaterial({color: '#4a4440', metalness: .7, roughness: .55, map: ao})); tray.receiveShadow = true; this.interior.add(tray);
    // the quilted lining shows on the walls between the tray and the rim
    const wallH = .028; for (const [x, z, w, ry] of [[0, D / 2 - WALL - .0006, W - 2 * WALL, Math.PI], [0, -D / 2 + WALL + .0006, W - 2 * WALL, 0], [W / 2 - WALL - .0006, 0, D - 2 * WALL, -Math.PI / 2], [-W / 2 + WALL + .0006, 0, D - 2 * WALL, Math.PI / 2]] as const) {
      const pl = new T.Mesh(new T.PlaneGeometry(w, wallH), lining); pl.position.set(x, wallH / 2, z); pl.rotation.y = ry; this.interior.add(pl); }
    const brushed = Suitcase.brushed(), screwM = new T.MeshStandardMaterial({color: '#8c8478', metalness: 1, roughness: .32}), screwG = new T.CylinderGeometry(.0022, .0022, .0012, 12);
    const frameM = new T.MeshStandardMaterial({color: '#6e5430', metalness: .9, roughness: .48, map: this.grime(57)}); // darker, worn brass for the bay frames
    const layout: [Mechanism, number, number, number, number][] = [['WIRE_MAZE', -.145, -.068, .15, .15], ['HIDDEN_CONNECTIONS', 0, -.068, .125, .13], ['XRAY', .145, -.068, .13, .13], ['LASER', -.085, .072, .25, .12], ['THERMAL', .14, .072, .15, .12]];
    layout.forEach(([m, x, z, w, d], i) => { const g = new T.Group(); g.position.set(x, .002, z); this.interior.add(g);
      const plate = new T.Mesh(new T.BoxGeometry(w, .003, d), brushed); plate.position.y = .0015; g.add(plate);
      for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const sc = new T.Mesh(screwG, screwM); sc.position.set(sx * (w / 2 - .007), .0036, sz * (d / 2 - .007)); g.add(sc); }
      for (const [fx, fz, fw, fd] of [[0, -d / 2, w + .006, .005], [0, d / 2, w + .006, .005], [-w / 2, 0, .005, d], [w / 2, 0, .005, d]] as const) box(fw, .007, fd, frameM, fx, .0035, fz, g);
      const tag = new T.Mesh(new T.PlaneGeometry(.06, .013), new T.MeshStandardMaterial({map: plateTex([{t: `${ROMAN[i]} · ${MECH_NAME[m]().toUpperCase()}`, font: 'bold 40px Oswald, sans-serif', y: .54, color: '#24170a'}], 512, 110, '#b8924c', true, 20 + i), roughness: .38, metalness: .85})); // engraved brass
      tag.rotation.x = -Math.PI / 2; tag.position.set(-w / 2 + .034, .0075, d / 2 - .0095); g.add(tag);
      const lamp = new T.MeshStandardMaterial({color: '#2a0806', emissive: '#ff1e0a', emissiveIntensity: 0, roughness: .3}); const lb = new T.Mesh(new T.SphereGeometry(.0055, 14, 10), lamp); lb.position.set(w / 2 - .012, .006, d / 2 - .012); g.add(lb);
      const ring = new T.Mesh(new T.TorusGeometry(.0068, .0016, 6, 16), brass); ring.rotation.x = Math.PI / 2; ring.position.copy(lb.position); g.add(ring);
      const mount = new T.Group(); mount.position.y = .003; g.add(mount); this.bays[m] = {group: g, mount, lamp, size: [w, d]};
      const halo = new T.Sprite(new T.SpriteMaterial({map: Suitcase.haloTex(), color: '#ff2a10', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false})); halo.raycast = () => {}; halo.position.copy(lb.position).setY(.009); halo.scale.setScalar(.03); halo.userData.halo = true; g.add(halo); this.halos.set(m, halo); });
    // telescopic lid stays on both sides: an outer tube pinned to the base wall, a rod pinned to the lid wall
    const stayM = new T.MeshStandardMaterial({color: '#9a948a', metalness: 1, roughness: .28}), tubeG = new T.CylinderGeometry(.0024, .0024, 1, 10), rodG = new T.CylinderGeometry(.0014, .0014, 1, 8), pinG = new T.SphereGeometry(.0032, 10, 8);
    for (const sx of [-1, 1]) { const xIn = sx * (W / 2 - WALL - .005); const tube = new T.Mesh(tubeG, stayM), rod = new T.Mesh(rodG, stayM), pa = new T.Mesh(pinG, brass), pb = new T.Mesh(pinG, brass);
      for (const o of [tube, rod, pa, pb]) { o.userData.stay = true; this.body.add(o); } this.stays.push({tube, rod, pa, pb, a: new T.Vector3(xIn, seamY - .022, -D / 2 + .07), b: new T.Vector3(xIn, HL - WALL - .008, .07)}); }
    // coiled cable from the countdown down to the tray's back corner
    this.coilM = new T.MeshStandardMaterial({color: '#1c1a18', roughness: .55, metalness: .1});
    for (const x of [-W / 2, W / 2]) for (const z of [-D / 2, D / 2]) { for (const y of [baseY0, seamY]) this.hullBody.push(new T.Vector3(x, y, z)); for (const y of [0, HL]) this.hullLid.push(new T.Vector3(x, y, z + D / 2)); }
    this.drawTimer(0); mergeStatic(this.root);
  }
  private leatherMeshes: T.Mesh[] = []; private halos = new Map<Mechanism, T.Sprite>(); private timerHalo: T.Sprite | null = null;
  private static haloT: T.Texture | null = null;
  static haloTex() { if (Suitcase.haloT) return Suitcase.haloT; const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d')!, g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.18, 'rgba(255,255,255,.55)'); g.addColorStop(.5, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return Suitcase.haloT = new T.CanvasTexture(c); }
  private stays: {tube: T.Mesh; rod: T.Mesh; pa: T.Mesh; pb: T.Mesh; a: T.Vector3; b: T.Vector3}[] = []; private coil: T.Mesh | null = null; private coilM!: T.MeshStandardMaterial; private coilAt = -1;
  /** places a cylinder of unit height between two points (body space) */
  private span(m: T.Mesh, a: T.Vector3, b: T.Vector3) { const d = b.clone().sub(a), len = d.length(); m.position.copy(a).addScaledVector(d, .5); m.scale.set(1, Math.max(1e-4, len), 1); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); }
  private updateStays() { this.lid.updateMatrix(); for (const st of this.stays) { const b = st.b.clone().applyMatrix4(this.lid.matrix), dir = b.clone().sub(st.a), len = dir.length(), u = dir.clone().normalize();
      const tubeEnd = st.a.clone().addScaledVector(u, Math.min(len, .085)), rodStart = b.clone().addScaledVector(u, -Math.min(len, .09)); this.span(st.tube, st.a, tubeEnd); this.span(st.rod, rodStart, b); st.pa.position.copy(st.a); st.pb.position.copy(b);
      const show = this.lidT > .02; st.tube.visible = st.rod.visible = st.pa.visible = st.pb.visible = show; }
    // the coil is rebuilt only while the lid moves (a few frames), then left alone
    const key = Math.round(this.lidT * 40); if (key === this.coilAt) return; this.coilAt = key; if (this.coil) { this.body.remove(this.coil); this.coil.geometry.dispose(); this.coil = null; } if (this.lidT < .05) return;
    const a = new T.Vector3(.07, HL - WALL - .008, D / 2 + .02).applyMatrix4(this.lid.matrix), b = new T.Vector3(W / 2 - WALL - .03, this.interior.position.y + .006, -D / 2 + WALL + .02), axis = b.clone().sub(a), n = new T.Vector3(1, 0, 0).cross(axis).normalize(), m2 = axis.clone().cross(n).normalize();
    const curve = new (class extends T.Curve<T.Vector3> { getPoint(t: number) { const sag = Math.sin(t * Math.PI) * .02, ang = t * Math.PI * 2 * 26, r = .0042 * Math.min(1, Math.min(t, 1 - t) * 14); return a.clone().lerp(b, t).addScaledVector(n, Math.cos(ang) * r + sag).addScaledVector(m2, Math.sin(ang) * r); } })();
    this.coil = new T.Mesh(new T.TubeGeometry(curve, 420, .0011, 5, false), this.coilM); this.coil.userData.coil = true; this.body.add(this.coil); }
  /** quilted oxblood velvet with buttons (colour + bump from one drawing), shared by every case */
  private static liningM: T.MeshStandardMaterial | null = null;
  static lining() { if (Suitcase.liningM) return Suitcase.liningM; const S = 512, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d')!, h = document.createElement('canvas'); h.width = h.height = S; const y = h.getContext('2d')!;
    x.fillStyle = '#3c0c10'; x.fillRect(0, 0, S, S); y.fillStyle = '#808080'; y.fillRect(0, 0, S, S); const step = S / 4;
    for (let i = -1; i <= 4; i++) for (let j = -1; j <= 4; j++) { const cx = i * step + (j % 2 ? step / 2 : 0), cy = j * step / 2;
      const g = x.createRadialGradient(cx, cy, 2, cx, cy, step * .55); g.addColorStop(0, 'rgba(120,40,40,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.moveTo(cx, cy - step / 2); x.lineTo(cx + step / 2, cy); x.lineTo(cx, cy + step / 2); x.lineTo(cx - step / 2, cy); x.fill();
      const gh = y.createRadialGradient(cx, cy, 2, cx, cy, step * .5); gh.addColorStop(0, '#e8e8e8'); gh.addColorStop(1, '#606060'); y.fillStyle = gh; y.beginPath(); y.moveTo(cx, cy - step / 2); y.lineTo(cx + step / 2, cy); y.lineTo(cx, cy + step / 2); y.lineTo(cx - step / 2, cy); y.fill(); }
    x.strokeStyle = 'rgba(10,0,0,.7)'; y.strokeStyle = '#202020'; for (const ctx of [x, y]) { ctx.lineWidth = 3; for (let k = -S; k < 2 * S; k += step) { ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + S, S); ctx.stroke(); ctx.beginPath(); ctx.moveTo(k + S, 0); ctx.lineTo(k, S); ctx.stroke(); } }
    for (let i = 0; i <= 4; i++) for (let j = 0; j <= 8; j++) { const cx = i * step + (j % 2 ? step / 2 : 0), cy = j * step / 2; x.fillStyle = '#1a0406'; x.beginPath(); x.arc(cx, cy, 7, 0, 7); x.fill(); x.fillStyle = 'rgba(200,120,110,.35)'; x.beginPath(); x.arc(cx - 2, cy - 2, 3, 0, 7); x.fill(); y.fillStyle = '#101010'; y.beginPath(); y.arc(cx, cy, 8, 0, 7); y.fill(); }
    const t = new T.CanvasTexture(c), b = new T.CanvasTexture(h); t.colorSpace = T.SRGBColorSpace; for (const k of [t, b]) { k.wrapS = k.wrapT = T.RepeatWrapping; k.repeat.set(2.4, 1.8); k.anisotropy = 8; }
    return Suitcase.liningM = new T.MeshStandardMaterial({map: t, bumpMap: b, bumpScale: 2.2, roughness: .95, metalness: 0, color: '#d8b0b0'}); }
  /** brushed dark steel for the bay plates */
  private static brushedM: T.MeshStandardMaterial | null = null;
  static brushed() { if (Suitcase.brushedM) return Suitcase.brushedM; const S = 256, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d')!; x.fillStyle = '#6a6660'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 1400; i++) { const yy = Math.random() * S, l = 20 + Math.random() * 140, v = 80 + Math.random() * 90; x.strokeStyle = `rgba(${v},${v},${v},.22)`; x.lineWidth = .6 + Math.random(); x.beginPath(); const xx = Math.random() * S; x.moveTo(xx, yy); x.lineTo(xx + l, yy); x.stroke(); }
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; return Suitcase.brushedM = new T.MeshStandardMaterial({color: '#3a3733', metalness: .82, roughness: .42, roughnessMap: t, map: t}); }
  private grime(seed: number) { return canvasTex(256, 256, x => { const r = rnd(seed); x.fillStyle = '#b8b2aa'; x.fillRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${r() < .3 ? '90,50,20' : '20,18,16'},${r() * .12})`; x.fillRect(r() * 256, r() * 256, 1 + r() * 10, 1 + r() * 3); } }); }
  private steel(hq: boolean) {
    const ld = new T.TextureLoader(), tx = (f: string, srgb: boolean) => { const t = ld.load(TEX + f); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(3, 3); return t; };
    return new T.MeshStandardMaterial({color: '#6c6862', map: tx('rusty_metal_05_diff_1k.jpg', true), normalMap: hq ? tx('rusty_metal_05_nor_gl_1k.jpg', false) : null, roughnessMap: tx('rusty_metal_05_rough_1k.jpg', false), metalness: .85, roughness: .7});
  }

  /** lies on the cage floor: a dark corner by the back wall (the first place nobody looks) */
  /** hiding places on the cage floor (offsets from the inner walls) — a different one each event */
  /** [wall side x (+1 right / −1 left), x offset, wall side z (−1 back / +1 door / 0 middle), z offset, yaw] */
  static readonly HIDE: [number, number, number, number, number][] = [[1, -.3, -1, .24, -.35], [-1, .3, -1, .26, .4], [1, -.28, 1, -.32, .3], [-1, .26, 0, .05, 1.35], [1, -.24, 0, -.1, -1.45]];
  place(ci: T.Box3 | undefined, floorY: number, spot = 0) {
    const sp = Suitcase.HIDE[spot % Suitcase.HIDE.length], x = ci ? (sp[0] > 0 ? ci.max.x : ci.min.x) + sp[1] : .8, z = ci ? (sp[2] < 0 ? ci.min.z : sp[2] > 0 ? ci.max.z : 0) + sp[3] : -.6;
    this.floorPos.set(x, floorY + (HB + HL) / 2 + .004, z); this.floorQuat.setFromEuler(new T.Euler(0, sp[4], 0));
    // a case still in hand keeps flying; it lands on the new spot when it is put down
    if (this.state === 'floor') { this.root.position.copy(this.floorPos); this.root.quaternion.copy(this.floorQuat); this.root.updateMatrixWorld(true); if (this.root.parent) this.home = this.root.parent; }
  }
  center() { return this.root.getWorldPosition(new T.Vector3()); }
  /** set the armed mechanism for this event */
  arm(list: Mechanism[], done: Set<Mechanism>) { this.armed = [...list]; this.neutral = done; }
  /** bring a bay up to fill the view (the case turns its tray to the player); null returns to the whole case */
  focusOn(m: Mechanism | null) { this.focus = m; this.focusT = m ? 1.1 : 0; if (m) { this.aim = {yaw: 0, pitch: 1.42}; } else { this.aim = {yaw: 0, pitch: .95}; this.zoom = 1; this.off.set(0, 0); } }
  reset() { this.focus = null; this.frozen = false; this.shownSec = -1; this.latchOpen = [false, false]; this.lidT = this.lidTarget = 0; this.found = false; for (const l of this.latches) { l.t = 0; l.clasp.rotation.x = 0; } this.lid.rotation.x = 0; this.yaw = 0; this.pitch = .62; this.zoom = 1; this.off.set(0, 0); this.urgency = 0; }
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
    // tap a bay to bring it close; while one is close, tapping a neighbour moves straight to it
    if (this.open) { for (const m of MECHANISMS) { let o: T.Object3D | null = h.object; while (o && o !== this.bays[m].group) o = o.parent; if (o && m !== this.focus) { this.focusOn(m); this.onEvent('FOCUS'); return; } } }
    if (ud.part === 'lid' && this.lidTarget === 0) { if (this.latchOpen.every(Boolean)) { this.lidTarget = 1; this.onEvent('LID_OPEN'); this.aim = {yaw: 0, pitch: .95}; this.off.set(0, 0); } else { this.rattle = 1; this.onEvent('LOCKED'); } }
  }
  /** the mechanism under a ray (for stage 4 tools), when the lid is open */
  bayHit(ray: T.Raycaster): Mechanism | null { if (!this.open) return null; for (const m of MECHANISMS) if (ray.intersectObject(this.bays[m].group, true).length) return m; return null; }

  setTimer(sec: number, limit: number) { if (this.frozen) return; const s = Math.max(0, Math.ceil(sec)); this.urgency = limit > 0 ? Math.max(0, 1 - sec / Math.min(15, limit * .3)) : 0; if (s !== this.shownSec) this.drawTimer(s); }
  /** detonation: sparks burst out, thick smoke rolls up, the lid is thrown open (stylised, fictional) */
  private fx: {pts: T.Points; vel: Float32Array; life: number; max: number; smoke: boolean}[] = []; private static soft: T.Texture | null = null;
  blast() { this.latchOpen = [true, true]; this.lidTarget = 1; this.lidT = Math.max(this.lidT, .6); this.rattle = 1;
    if (!Suitcase.soft) { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d')!, g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.4, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); Suitcase.soft = new T.CanvasTexture(c); }
    const make = (n: number, smoke: boolean) => { const pos = new Float32Array(n * 3), vel = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * .3; pos[i * 3 + 1] = .02 + Math.random() * .03; pos[i * 3 + 2] = (Math.random() - .5) * .2;
        const a = Math.random() * Math.PI * 2, sp = smoke ? .05 + Math.random() * .1 : .5 + Math.random() * 1.1; vel[i * 3] = Math.cos(a) * sp; vel[i * 3 + 1] = smoke ? .12 + Math.random() * .18 : .6 + Math.random() * 1.2; vel[i * 3 + 2] = Math.sin(a) * sp; }
      const geo = new T.BufferGeometry().setAttribute('position', new T.BufferAttribute(pos, 3)); const m = new T.PointsMaterial({map: Suitcase.soft, size: smoke ? .16 : .018, color: smoke ? '#2a2420' : '#ffb35a', transparent: true, opacity: smoke ? .75 : 1, depthWrite: false, blending: smoke ? T.NormalBlending : T.AdditiveBlending, toneMapped: !smoke ? false : true});
      const pts = new T.Points(geo, m); pts.frustumCulled = false; pts.raycast = () => {}; this.body.add(pts); this.fx.push({pts, vel, life: 0, max: smoke ? 3.2 : 1.3, smoke}); };
    make(120, false); make(40, true); }
  private updateFx(dt: number) { for (const f of this.fx) { f.life += dt; const a = f.pts.geometry.attributes.position as T.BufferAttribute, p = a.array as Float32Array;
      for (let i = 0; i < p.length; i += 3) { if (!f.smoke) f.vel[i + 1] -= 1.6 * dt; else { f.vel[i] *= .985; f.vel[i + 2] *= .985; } p[i] += f.vel[i] * dt; p[i + 1] += f.vel[i + 1] * dt; p[i + 2] += f.vel[i + 2] * dt; } a.needsUpdate = true;
      const k = f.life / f.max, m = f.pts.material as T.PointsMaterial; m.opacity = f.smoke ? .75 * (1 - k) * Math.min(1, f.life * 4) : 1 - k; if (f.smoke) m.size = .16 + k * .35; }
    this.fx = this.fx.filter(f => { if (f.life < f.max) return true; this.body.remove(f.pts); f.pts.geometry.dispose(); (f.pts.material as T.Material).dispose(); return false; }); }
  /** the countdown's last word: a green STOP when defused, a dead 0:00 after the blast */
  freezeTimer(ok: boolean) { const x = this.timerCtx, w = 512, h = 192; x.fillStyle = '#0c0705'; x.fillRect(0, 0, w, h); x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `bold ${ok ? 112 : 150}px "IBM Plex Mono", monospace`; x.shadowColor = ok ? '#2aff6a' : '#000'; x.shadowBlur = ok ? 26 : 0; x.fillStyle = ok ? '#7affa0' : '#3a1a10'; x.fillText(ok ? L('СТОП', 'SAFE') : '0:00', w / 2, h / 2 + 6); x.shadowBlur = 0; this.timerTex.needsUpdate = true; this.shownSec = -2; this.frozen = true; }
  private frozen = false;
  private drawTimer(s: number) { this.shownSec = s; const x = this.timerCtx, w = 512, h = 192; x.fillStyle = '#0c0705'; x.fillRect(0, 0, w, h);
    const txt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; x.font = 'bold 150px "IBM Plex Mono", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = 'rgba(255,90,40,.08)'; x.fillText('8:88', w / 2, h / 2 + 6); x.shadowColor = s <= 10 ? '#ff2a10' : '#ff7a2a'; x.shadowBlur = 24; x.fillStyle = s <= 10 ? '#ff4a2a' : '#ffae5a'; x.fillText(txt, w / 2, h / 2 + 6); x.shadowBlur = 0;
    this.timerTex.needsUpdate = true; }

  update(dt: number, camera: T.PerspectiveCamera, gazed: boolean) {
    this.time += dt; this.cam = camera; if (this.fx.length) this.updateFx(dt); const e = 1 - Math.exp(-dt * 7);
    // restrained "something is here" cue: brass catches a slow warm glint until the case has been found; brighter while looked at
    const glow = this.state === 'floor' && this.enabled ? (this.found ? (gazed ? .25 : 0) : (gazed ? .55 : .1 + .08 * Math.sin(this.time * 2.2))) : 0; for (const m of this.glowMats) m.emissiveIntensity += (glow - m.emissiveIntensity) * e;
    // latches flip up, then the lid swings (eased, with a slight overshoot at the stop)
    for (let i = 0; i < 2; i++) { const l = this.latches[i]; l.t += ((this.latchOpen[i] ? 1 : 0) - l.t) * (1 - Math.exp(-dt * 14)); l.clasp.rotation.x = -l.t * 2.1; }
    if (this.lidTarget > this.lidT) { const was = this.lidT; this.lidT = Math.min(1, this.lidT + dt * .85); if (was < 1 && this.lidT >= 1) this.onEvent('LID_OPENED'); }
    const s = this.lidT, ease = s < .5 ? 4 * s * s * s : 1 - Math.pow(-2 * s + 2, 3) / 2; this.lid.rotation.x = -ease * 1.92 + (s >= 1 ? 0 : 0) - Math.sin(this.rattle * 30) * this.rattle * .02; this.updateStays(); this.rattle = Math.max(0, this.rattle - dt * 2.5);
    // lamps: the armed bay burns red with a heartbeat, faster as the fuse runs down
    const beat = 1.4 + this.urgency * 5; for (const m of MECHANISMS) { const safe = this.armed.includes(m) && this.neutral.has(m), lamp = this.bays[m].lamp; lamp.emissive.set(safe ? '#38ff6a' : '#ff1e0a'); if (safe) { lamp.emissiveIntensity = 1.1; continue; }
      const on = this.armed.includes(m) && this.enabled; lamp.emissiveIntensity = on ? 1.2 + 1.6 * Math.max(0, Math.sin(this.time * beat * Math.PI)) ** 3 : 0; }
    for (const m of MECHANISMS) { const h = this.halos.get(m); if (!h) continue; const l = this.bays[m].lamp, mat = h.material as T.SpriteMaterial; mat.color.copy(l.emissive); mat.opacity = Math.min(.9, l.emissiveIntensity * .3) * (this.lidT > .3 ? 1 : 0); h.scale.setScalar(.022 + l.emissiveIntensity * .006); }
    if (this.timerHalo) (this.timerHalo.material as T.SpriteMaterial).opacity = this.timerLamp.emissiveIntensity > 1 && this.lidT > .3 ? .7 : 0;
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
