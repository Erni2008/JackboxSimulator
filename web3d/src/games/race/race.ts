import {RaceIntro} from './intro';
// Obstacle race in the browser: built for phones (Poco X3 Pro / iPhone) — instanced scenery, 512px textures, one shadow map
// that follows the player, adaptive resolution. Touch: left thumb stick + jump button; PC: WASD/arrows + SPACE.
import * as THREE from 'three';
import {GLTFLoader, type GLTF} from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {RaceSound} from './sound';
import {Survival} from './survival';
import {Course, Runner, top, type Block, H, R as RR, SECTION_NAMES, TRIALS} from './course';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

export const CHARACTERS = ['skeleton', 'dracula', 'pumpkin', 'voodoo', 'ghost', 'zombie', 'plague_doctor', 'puppeteer'];
export const NAMES: Record<string, string> = {skeleton: 'Скелет', dracula: 'Дракула', pumpkin: 'Тыква', voodoo: 'Вуду', ghost: 'Призрак', zombie: 'Зомби', plague_doctor: 'Чумной доктор', puppeteer: 'Кукольник'};
const LIMIT = 150, COUNTDOWN = 3.5, STEP = 1 / 120;

type Look = {root: THREE.Object3D; mixer: THREE.AnimationMixer; acts: Record<string, THREE.AnimationAction>; cur: string; tag: HTMLDivElement; squash: number; prevVy: number};

export class RaceApp {
  readonly renderer: THREE.WebGLRenderer; readonly scene = new THREE.Scene(); readonly camera = new THREE.PerspectiveCamera(55, 1, .3, 900);
  course: Course; readonly night: boolean; readonly manor: boolean; readonly crypt: boolean; limit: number; surv?: Survival; runners: Runner[] = []; me!: Runner; clock = 0; private acc = 0;
  private sun!: THREE.DirectionalLight; private fill!: THREE.DirectionalLight; private mist: THREE.Mesh[] = []; private pollen!: THREE.Points; private puffs: {s: THREE.Sprite; t: number}[] = []; private grassMat?: THREE.Material; private looks = new Map<Runner, Look>(); private blockMeshes = new Map<Block, THREE.Mesh>();
  private sweeperMeshes: THREE.Object3D[] = []; private cpArches: {glow: THREE.Mesh; flag: THREE.Mesh; lit: boolean}[] = []; private lastCp = 0; private pend: THREE.Object3D[] = []; private rams: THREE.Object3D[] = []; private padMeshes: THREE.Mesh[] = []; private warnPlanes = new Map<Block, THREE.Mesh>(); private belts: THREE.Texture[] = []; private composer?: EffectComposer; private lastSection = ''; private ghosts: THREE.MeshStandardMaterial[] = []; private lastTp = 0; private readonly headless = new URLSearchParams(location.search).has('bot'); private hudT = 0; private phoneShadows = false; private frameNo = 0; readonly snd = new RaceSound(); private sndState: any = {count: 9, falls: 0, stun: 0, fin: false, step: 0, gates: new Map<any, boolean>(), hooks: new Map<any, number>(), jets: new Map<any, number>(), pads: new Map<any, number>(), crumbs: new Set<any>()}; private sunGlow?: THREE.Sprite; private moonGlow?: THREE.Sprite; private rays: THREE.Mesh[] = []; private ray = new THREE.Raycaster(); private faded = new Set<THREE.Mesh>(); private soft: THREE.Mesh[] = []; private jetFx: {j: any; o: THREE.Object3D; f: THREE.Object3D}[] = []; private mazeBlend = 0; private portalFx: THREE.Object3D[] = []; private boulderPool: THREE.Object3D[] = [];
  private gltf = new GLTFLoader(); private texLoader = new THREE.TextureLoader(); private cache = new Map<string, Promise<GLTF>>();
  private camTarget = new THREE.Vector3(); private pixelRatio: number; private frameAvg = 16; private last = 0;
  private blobs = new Map<Runner, THREE.Mesh>();   private dots = new Map<Runner, HTMLElement>(); private keys = new Set<string>(); private stick = {id: -1, ox: 0, oy: 0, x: 0, y: 0}; private hud: HTMLElement;

  /** Online race: roster from the room, seed/map/start from the server; remote runners are interpolated, not simulated. */
  net?: {roster: {id: string; name: string; char: string}[]; selfId: string; seed: number; startAt: number; serverNow: () => number; send: (s: number[], extra?: any) => void; spectator: boolean; spark?: () => void};
  constructor(private host: HTMLElement, private myChar: string, map = 1, net?: RaceApp['net']) {
    this.net = net; if (net) this.surv = new Survival(this);
    const qs = new URLSearchParams(location.search); const tq = qs.get('t'), only = tq ? (TRIALS[Number(tq) - 1] ?? (TRIALS.includes(tq) ? tq : '')) : ''; this.course = new Course(map, net ? net.seed : Number(qs.get('seed')) || (Math.random() * 1e9) | 0, only); this.night = this.course.theme === 'graveyard'; this.crypt = this.course.theme === 'crypt'; this.manor = this.course.theme === 'manor' || this.crypt; this.limit = this.crypt ? 210 : LIMIT;
    const phone = matchMedia('(pointer:coarse)').matches;
    this.renderer = new THREE.WebGLRenderer({antialias: !phone || devicePixelRatio < 2, powerPreference: 'high-performance'});
    this.pixelRatio = Math.min(devicePixelRatio, phone ? 1.25 : 1.25); this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = phone ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    host.appendChild(this.renderer.domElement);
    this.hud = document.getElementById('hud')!;
    addEventListener('resize', () => this.resize()); this.resize();
    this.input();
  }

  async load(progress: (f: number) => void) {
    const N = this.night || this.manor, IN = this.manor;
    // sky: background + image-based lighting from the same panorama (sunset over the gorge / moonrise over the graveyard)
    const sky = this.tex(N ? 'sky_night.jpg' : 'sky.jpg', false); sky.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.background = sky;
    const pmrem = new THREE.PMREMGenerator(this.renderer); this.scene.environment = pmrem.fromEquirectangular(await loaded(sky)).texture; pmrem.dispose();
    (this.scene as any).environmentIntensity = IN ? .3 : N ? .55 : .75; (this.scene as any).backgroundIntensity = N ? .85 : 1; if (IN) this.scene.background = new THREE.Color(this.crypt ? 0x030605 : 0x040508);
    this.scene.fog = this.crypt ? new THREE.Fog(new THREE.Color(.03, .05, .045), 9, 58) : IN ? new THREE.Fog(new THREE.Color(.025, .03, .05), 10, 70) : N ? new THREE.Fog(new THREE.Color(.13, .18, .28), 18, 170) : new THREE.Fog(new THREE.Color(.74, .6, .56), 45, 330);
    this.scene.add(this.crypt ? new THREE.HemisphereLight(0x4a7a68, 0x22160c, .8) : IN ? new THREE.HemisphereLight(0x46588c, 0x24170c, .5) : N ? new THREE.HemisphereLight(0x7088c8, 0x141812, .55) : new THREE.HemisphereLight(0xbfc8ff, 0x3d3324, .35));
    if (N) this.renderer.toneMappingExposure = IN ? 1.3 : 1.2;
    // key light matches the sun / moon in the panorama: long shadows towards the camera, rim light on everything
    this.sun = this.crypt ? new THREE.DirectionalLight(0x8fd0b8, 1.3) : IN ? new THREE.DirectionalLight(0xa9c2ff, 4.2) : N ? new THREE.DirectionalLight(0xb4ccff, 2.4) : new THREE.DirectionalLight(0xffb978, 3.4); this.sun.castShadow = !this.crypt;
    const hi = !matchMedia('(pointer:coarse)').matches; this.sun.shadow.mapSize.set(hi ? 2048 : 1024, hi ? 2048 : 1024);
    Object.assign(this.sun.shadow.camera, {left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 140}); this.sun.shadow.bias = -.0005; this.sun.shadow.normalBias = .04;
    this.scene.add(this.sun, this.sun.target);
    this.fill = new THREE.DirectionalLight(this.crypt ? 0xffa868 : IN ? 0xffb37a : N ? 0xa8b8ff : 0xc8d2ff, this.crypt ? 1.6 : IN ? 1.25 : N ? 1.1 : 1.7); this.scene.add(this.fill, this.fill.target); // cool fill from the camera side
    this.atmosphere();
    if (this.night) {const mg = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0x9fc0ff, transparent: true, opacity: .45, depthWrite: false, blending: THREE.AdditiveBlending, fog: false})); mg.scale.set(200, 200, 1); this.moonGlow = mg; this.scene.add(mg);}
    if (!N) {const glow = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0xffb070, transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending, fog: false})); glow.scale.set(260, 160, 1); glow.userData.sun = true; this.sunGlow = glow; this.scene.add(glow);
      for (let i = 0; i < 5; i++) {const ray = new THREE.Mesh(new THREE.PlaneGeometry(14 + i * 4, 420), new THREE.MeshBasicMaterial({map: rayTexture(), color: 0xffc890, transparent: true, opacity: .07, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide})); ray.userData.k = i; this.rays.push(ray); this.scene.add(ray);}}
    const mats = {floor: this.mat('old_wooden_floor_02', 2.5, true), flag: this.mat('mossy_cobblestone', 2.5, false, 0x8a8a8a), wall: this.mat('castle_brick_07', 3), beam: this.mat('medieval_wood', 2, true),
      cobble: this.mat('mossy_cobblestone', 3, false, this.night ? 0xe6e8f0 : 0xffffff), brick: this.mat('mossy_brick', 3, true), dark: this.mat('dark_wooden_planks', 2.2, true), mud: this.mat('brown_mud_leaves_01', 3, false, 0xd8dcc8),
      grass: this.mat('leafy_grass', 3.2, false, 0xc4dc8a), rock: this.mat('rock_face_03', 4, true), plank: this.mat('brown_planks_05', 2.2, true), stone: this.mat('mossy_rock', 3.2), bark: this.mat('bark_brown_02', 1), ground: this.mat('forest_ground_04', 6)};
    for (const b of this.course.blocks) {
      const topM = ({grass: mats.grass, plank: mats.plank, stone: mats.stone, cobble: mats.cobble, brick: mats.brick, dark: mats.dark, mud: mats.mud, floor: mats.floor, flag: mats.flag} as Record<string, THREE.Material>)[b.mat];
      let side = b.mat === 'plank' ? mats.plank : b.mat === 'dark' ? mats.dark : this.manor ? (b.mat === 'floor' ? mats.beam : mats.wall) : this.night ? mats.brick : mats.rock;
      let tm = topM; if (b.conveyor) {const mm = (topM as THREE.MeshStandardMaterial).clone(); for (const k of ['map', 'normalMap', 'roughnessMap'] as const) if (mm[k]) {mm[k] = mm[k]!.clone(); mm[k]!.needsUpdate = true; this.belts.push(mm[k]!);} tm = mm;}
      if (b.wall) {tm = mats.wall; side = mats.wall;}
      if (b.ghost) {const gm = (mats.wall as THREE.MeshStandardMaterial).clone(); gm.transparent = true; gm.opacity = .92; gm.emissive = new THREE.Color(0x2aff9a); gm.emissiveIntensity = 0; tm = gm; side = gm; this.ghosts.push(gm);}
      if (b.crumbles && !b.sink && !b.fake) {} 
      if (b.mat !== 'grass' && !b.fake && this.course.sections.some(sc => sc.name === 'falsebridge' && b.z0 >= sc.z0 && b.z1 <= sc.z1) && !b.land) {const hm = (tm as THREE.MeshStandardMaterial).clone(); hm.color = new THREE.Color(0xd2dcc2); tm = hm;}
      const m = new THREE.Mesh(blockGeometry(b), [tm, b.wall ? side : this.shaded(side)]); m.geometry.computeBoundingSphere(); if (b.wall) m.castShadow = true;
      if (b.tilt) {const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2; m.geometry.translate(-cx, -b.y0, -cz); m.userData.pivot = [cx, b.y0, cz];}
      if (b.gear || b.cart) m.visible = false, m.userData.hidden = true;
      if (b.crumbles && !b.sink) {const cr = new THREE.Mesh(new THREE.PlaneGeometry(b.x1 - b.x0 - .1, b.z1 - b.z0 - .1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({map: crackTexture(), transparent: true, opacity: 0, depthWrite: false, color: 0x120a06}));
        cr.position.set((b.x0 + b.x1) / 2, b.y0 + .03, (b.z0 + b.z1) / 2); m.add(cr); m.userData.crack = cr;}
      // carved edge trim around walkable tops (curbs / skirting) — breaks the boxy look
      const trimMat = this.manor ? (b.mat === 'floor' ? mats.beam : mats.wall) : this.night ? mats.brick : b.mat === 'grass' ? null : b.mat === 'plank' ? mats.bark : mats.rock;
      if (trimMat && !b.trapPeriod && !b.wall && (b.x1 - b.x0) > 2 && b.y0 === b.y1) {const y = b.y0, tw = .28, th = .2;
        const edge = (w: number, d: number, x: number, z: number) => {const t = new THREE.Mesh(new THREE.BoxGeometry(w, th, d), trimMat); t.position.set(x, y - th / 2 + .07, z); t.castShadow = false; t.receiveShadow = true; m.add(t);};
        edge(tw, b.z1 - b.z0, b.x0 + tw / 2 - .04, (b.z0 + b.z1) / 2); edge(tw, b.z1 - b.z0, b.x1 - tw / 2 + .04, (b.z0 + b.z1) / 2);
        if (!b.land) {edge(b.x1 - b.x0, tw, (b.x0 + b.x1) / 2, b.z0 + tw / 2 - .04); edge(b.x1 - b.x0, tw, (b.x0 + b.x1) / 2, b.z1 - tw / 2 + .04);}}
      if (b.trapPeriod) {const w = new THREE.Mesh(new THREE.PlaneGeometry(b.x1 - b.x0 - .1, b.z1 - b.z0 - .1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({color: 0xff2a12, transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending})); w.position.set((b.x0 + b.x1) / 2, b.y0 + .03, (b.z0 + b.z1) / 2); w.visible = false; this.scene.add(w); this.warnPlanes.set(b, w);} if ((b.mat === 'grass' || b.mat === 'mud') && !(b.gear || b.cart || b.tilt || b.trapPeriod || b.wall || b.fake || b.driftAmp || (b.x1 - b.x0) < 6)) this.grassOn(b); m.receiveShadow = true; m.castShadow = b.mat === 'plank' || b.crumbles; this.blockMeshes.set(b, m); this.scene.add(m);
    }
    if (!this.night) {const floor = new THREE.Mesh(new THREE.PlaneGeometry(520, 540).rotateX(-Math.PI / 2), mats.ground); floor.receiveShadow = false; floor.position.set(0, -34, 150); worldUV(floor.geometry as THREE.BufferGeometry, 6, 'xz'); this.scene.add(floor);}
    // hazards
    const logGeo = new THREE.CylinderGeometry(.42, .42, 1, 14, 1); logGeo.rotateZ(Math.PI / 2);
    for (const s of this.course.sweepers) {const g = new THREE.Group(); for (let a = 0; a < (s.arms || 1); a++) {const log = new THREE.Mesh(this.manor ? new THREE.BoxGeometry(1, .62, .62) : logGeo, this.manor ? mats.beam : this.night ? mats.dark : mats.bark); log.scale.set(s.len * 2, 1, 1); log.rotation.y = a * Math.PI / (s.arms || 1); log.castShadow = true; g.add(log);}
      this.sweeperMeshes.push(g); this.scene.add(g);
      const ph = s.y - this.course.spawnY(s.z) + 1.05, post = new THREE.Mesh(new THREE.CylinderGeometry(.55, .65, ph, 12), this.night ? mats.brick : mats.bark); post.position.set(s.x, s.y + .5 - ph / 2, s.z); post.castShadow = true; this.scene.add(post);}
    const boulder = await this.model('env/boulder_01.glb'); progress(.15);
    const linkGeo = new THREE.TorusGeometry(.13, .035, 6, 12), ironM = metalMat('rusty_metal_02', 0x9a9a9a, .3);
    for (const p of this.course.pendulums) {
      const pivot = new THREE.Group(); pivot.position.set(p.px, p.py, p.pz);
      const links = Math.round(p.len / .2); const chain = new THREE.InstancedMesh(linkGeo, ironM, links); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
      for (let i = 0; i < links; i++) {q.setFromEuler(new THREE.Euler(0, i % 2 ? Math.PI / 2 : 0, Math.PI / 2)); m4.compose(new THREE.Vector3(0, -i * .2 - .1, 0), q, new THREE.Vector3(1, 1, 1)); chain.setMatrixAt(i, m4);}
      chain.castShadow = true; pivot.add(chain);
      const bob = this.manor ? spikedBall() : this.night ? scythe() : normalized(boulder.scene, p.radius * 2.1, 'max'); bob.position.y = -p.len; pivot.add(bob); this.scene.add(pivot);
      const base = this.course.spawnY(p.pz), postX = this.night ? 5.2 : 5.4;
      if (!this.manor) for (const sg of [-1, 1]) {const post = new THREE.Mesh(this.night ? new THREE.BoxGeometry(.9, p.py - base, .9) : new THREE.CylinderGeometry(.45, .5, p.py - base, 10), this.night ? mats.brick : mats.bark); post.position.set(sg * postX, (base + p.py) / 2, p.pz); post.castShadow = true; this.scene.add(post);}
      const beam = new THREE.Mesh(logGeo, this.manor ? mats.beam : this.night ? mats.dark : mats.bark); beam.scale.set(postX * 2 + .8, .9, .9); beam.position.set(0, p.py + .3, p.pz); beam.castShadow = true; this.scene.add(beam);
      this.pend.push(pivot);
    }
    // rams in the walls
    for (const p of this.course.pushers) {const g = new THREE.Group(); const rl = p.reach + 1.4, ram = new THREE.Mesh(new THREE.BoxGeometry(rl, 1.5, p.d - .2), this.manor ? mats.beam : this.night ? mats.dark : mats.bark); ram.position.x = rl / 2 - 1; ram.castShadow = true;
      const plate = new THREE.Mesh(new THREE.BoxGeometry(.18, 1.7, p.d), ironM); plate.position.x = -1.02; g.add(ram, plate);
      for (let i = 0; i < 6; i++) {const sp = new THREE.Mesh(new THREE.ConeGeometry(.1, .35, 8).rotateZ(Math.PI / 2), ironM); sp.position.set(-1.25, -.5 + (i % 2) * .9, -p.d / 2 + .4 + Math.floor(i / 2) * (p.d - .8) / 2); g.add(sp);}
      g.position.set(p.side * (p.wallX + 1), p.y + .8, p.z); g.scale.x = p.side; g.userData.p = p; bake(g); this.rams.push(g); this.scene.add(g);
      const house = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.6, p.d + .8), this.manor ? mats.wall : this.night ? mats.brick : mats.rock); house.position.set(p.side * (p.wallX + .6), p.y + 1.3, p.z); house.castShadow = true; this.scene.add(house);}
    // portals: stone arch, swirling disc, glow
    for (const p of this.course.portals) {const g = new THREE.Group(); g.position.set(p.x, p.y, p.z);
      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.25, .2, 10, 32), mats.wall); arch.position.y = 1.35; arch.castShadow = true; g.add(arch);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(1.1, 40), new THREE.MeshBasicMaterial({map: swirlTexture(), color: 0x6affc8, transparent: true, opacity: .85, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide})); disc.position.y = 1.35; g.add(disc);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0x44ffb0, transparent: true, opacity: .7, depthWrite: false, blending: THREE.AdditiveBlending})); glow.scale.setScalar(4.2); glow.position.y = 1.35; g.add(glow);
      const pool = new THREE.Mesh(new THREE.CircleGeometry(1.8, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({map: dotTexture(true), color: 0x2affa0, transparent: true, opacity: .4, depthWrite: false, blending: THREE.AdditiveBlending})); pool.position.y = .04; g.add(pool);
      g.userData.disc = disc; this.portalFx.push(g); this.scene.add(g);}
    this.buildMech(mats);
    // fire jets and hammers
    for (const j of this.course.jets) {const g = new THREE.Group(); g.position.set(j.x, j.y, j.z);
      if (j.kind === 'fire') {const gm = metalMat('metal_grate_rusty', 0xffffff, .6).clone(); gm.emissive = new THREE.Color(0xff3a00); gm.emissiveIntensity = 0; const grate = new THREE.Mesh(new THREE.CylinderGeometry(.75, .8, .08, 20), gm); grate.position.y = .04; g.add(grate);
        const fl = new THREE.Group(); for (let k = 0; k < 3; k++) {const sp = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: k ? 0xff7a1a : 0xffe08a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending})); sp.scale.set(1.6 - k * .3, 2.8 - k * .5, 1); sp.position.y = 1.2 + k * .5; fl.add(sp);} g.add(fl);
        this.jetFx.push({j, o: grate, f: fl});}
      else {const hm = new THREE.Group(); const head = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.1, 24), metalMat('rusty_metal_02', 0xa0a0a0, .6)); head.castShadow = true;
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, 8, 10), metalMat('metal_plate_02', 0x9a9a9a, .3)); rod.position.y = 4.5; hm.add(head, rod);
        const mark = new THREE.Mesh(new THREE.RingGeometry(1.3, 1.5, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({color: 0xff3a1a, transparent: true, opacity: 0, depthWrite: false})); mark.position.y = .04; g.add(hm, mark);
        this.jetFx.push({j, o: mark, f: hm});}
      this.scene.add(g);}
    // spring pads
    for (const p of this.course.pads) {const ring = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.08, .22, 32), metalMat('rusty_metal_02', 0xffffff, .5)); ring.position.set(p.x, p.y + .11, p.z); this.scene.add(ring);
      const top = new THREE.Mesh(new THREE.CircleGeometry(p.r * .86, 32).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({map: padTexture(), emissive: 0xffb23a, emissiveMap: padTexture(), emissiveIntensity: 1.1, roughness: .5})); top.position.set(p.x, p.y + .23, p.z); this.padMeshes.push(top); this.scene.add(top);}
    this.boulderSrc = boulder.scene;
    const barrel = await this.model('env/wine_barrel_01.glb');
    for (let i = 0; i < 9; i++) {const b = barrel ? rolling(normalized(barrel.scene, 2.4, 'max')) : normalized(boulder.scene, 2.4, 'max'); b.visible = false; this.boulderPool.push(b); this.scene.add(b);}
    // finish arch
    const fy = this.course.spawnY(this.course.finishZ);
    for (const sg of [-1, 1]) {const post = new THREE.Mesh(this.night || this.manor ? new THREE.BoxGeometry(1.3, 7, 1.3) : new THREE.CylinderGeometry(.55, .6, 7, 12), this.night ? mats.brick : mats.bark); post.position.set(sg * 7.5, fy + 3.5, this.course.finishZ); post.castShadow = true; this.scene.add(post);}
    const beam = new THREE.Mesh(logGeo, mats.bark); beam.scale.set(16.5, 1.1, 1.1); beam.position.set(0, fy + 7.1, this.course.finishZ); this.scene.add(beam);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(13, 1.7), new THREE.MeshStandardMaterial({map: bannerTexture(this.manor ? 'СВОБОДА' : 'ФИНИШ'), side: THREE.DoubleSide, roughness: .85}));
    banner.position.set(0, fy + 6, this.course.finishZ); banner.rotation.y = Math.PI; this.scene.add(banner);
    this.checkpointArches(this.manor ? mats.beam : this.night ? mats.brick : mats.bark);
    const before = this.scene.children.length;
    await (this.manor ? this.decorateManor(mats, progress) : this.night ? this.decorateNight(mats.stone, progress) : this.decorate(progress)); this.buildGrass(); this.mergeStatic(before); progress(.8);
    // runners
    if (this.net) {const n = this.net; for (let i = 0; i < n.roster.length; i++) {const p = n.roster[i], self = p.id === n.selfId && !n.spectator;
        const r = new Runner(p.id, self ? 'Вы' : p.name, CHARACTERS.includes(p.char) ? p.char : CHARACTERS[i % CHARACTERS.length], i, self && new URLSearchParams(location.search).has('bot')); (r as any).remote = !self; r.x = ((i % 4) - 1.5) * 2.2; r.z = -1.5 - Math.floor(i / 4) * 2.2; this.runners.push(r);
        progress(.8 + .2 * (i + 1) / n.roster.length);}
      await Promise.all(this.runners.map(r => this.addLook(r)));
      this.me = this.runners.find(r => !(r as any).remote) ?? this.runners[0];
      if (n.spectator) document.body.classList.add('spectator');
    } else {
    const others = CHARACTERS.filter(c => c !== this.myChar);
    const cast = [this.myChar, ...others.sort(() => Math.random() - .5).slice(0, 5)];
    for (let i = 0; i < cast.length; i++) {
      const r = new Runner('p' + i, i === 0 ? 'Вы' : NAMES[cast[i]], cast[i], i, i > 0); r.x = ((i % 3) - 1) * 2.4; r.z = -1.5 - Math.floor(i / 3) * 2.4; this.runners.push(r);
      progress(.8 + .2 * (i + 1) / cast.length);
    }
    await Promise.all(this.runners.map(r => this.addLook(r)));
    this.me = this.runners[0];}
    const dz = Number(new URLSearchParams(location.search).get('z')); if (dz) for (const r of this.runners) {r.z = dz + r.slot * .3; r.x = (r.slot % 3 - 1) * 1.5; r.y = this.course.spawnY(dz) + .5; r.progress = dz; r.checkpoint = this.course.checkpoints.filter(c => c <= dz).length - 1;}
    this.camTarget.set(this.me.x, this.me.y, this.me.z);
  }

  private async addLook(r: Runner) {
    const g = await this.model(`chars/${SKIN}/${r.character}.glb`);
    const root = SkeletonUtils.clone(g.scene); root.traverse(o => {const m = o as THREE.Mesh; if (m.isMesh) {m.castShadow = true; m.frustumCulled = false; const mm = m.material as THREE.MeshStandardMaterial; mm.side = THREE.DoubleSide; mm.envMapIntensity = 1.6; mm.roughness = .6; mm.emissive = new THREE.Color(1, 1, 1); mm.emissiveMap = mm.map; mm.emissiveIntensity = .15;}});
    const blob = new THREE.Mesh(new THREE.CircleGeometry(.55, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({map: dotTexture(true), color: 0x000000, transparent: true, opacity: .55, depthWrite: false})); blob.renderOrder = 1; this.scene.add(blob); this.blobs.set(r, blob);
    this.scene.add(root); const mixer = new THREE.AnimationMixer(root); const acts: Record<string, THREE.AnimationAction> = {};
    for (const clip of g.animations) {const a = mixer.clipAction(clip); acts[clip.name] = a; if (clip.name === 'jump' || clip.name === 'stun') {a.setLoop(clip.name === 'stun' ? THREE.LoopRepeat : THREE.LoopOnce, Infinity); a.clampWhenFinished = true;}}
    acts.idle?.play();
    const tag = document.createElement('div'); tag.className = 'tag' + ((this.net ? !(r as any).remote : !r.bot) ? ' me' : ''); tag.textContent = r.name; this.hud.appendChild(tag);
    this.looks.set(r, {root, mixer, acts, cur: 'idle', tag, squash: 0, prevVy: 0});
  }

  private async decorate(progress: (f: number) => void) {
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const place: Record<string, THREE.Matrix4[]> = {};
    const put = (name: string, x: number, y: number, z: number, size: number, yaw = rnd() * Math.PI * 2) => (place[name] ??= []).push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw), new THREE.Vector3(size, size, size)));
    const len = this.course.finishZ + 30;
    for (let z = -40; z < len + 40; z += 8 + rnd() * 7) for (const s of [-1, 1]) put(rnd() < .55 ? 'fir_tree_01_c' : 'pine_tree_01_c', s * (34 + rnd() * 46), -34, z + rnd() * 5, 30 + rnd() * 14);
    for (let z = -60; z < len + 120; z += 26 + rnd() * 18) for (const s of [-1, 1]) put('namaqualand_cliff_01', s * (170 + rnd() * 70), -46, z, 55 + rnd() * 35);
    for (let i = 0; i < 6; i++) put('namaqualand_cliff_01', (rnd() - .5) * 260, -46, len + 200 + rnd() * 80, 60 + rnd() * 40);
    
    for (const b of this.course.blocks) {
      if (b.mat === 'plank' || b.crumbles || (b.gear || b.cart || b.tilt || b.trapPeriod || b.wall || b.fake || b.driftAmp || (b.x1 - b.x0) < 6)) continue; const d = b.z1 - b.z0;
      for (let i = 0; i < d * .8; i++) {const side = rnd() < .5 ? -1 : 1, x = side > 0 ? b.x1 - 1 - rnd() * 1.3 : b.x0 + 1 + rnd() * 1.3, z = b.z0 + rnd() * d, y = top(b, z), r = rnd();
        if (b.mat === 'grass' && r < .5) put('grass_medium_01', x, y, z, .7 + rnd() * .5);
        else if (r < .74) put('fern_02', x, y, z, .8 + rnd() * .6);
        else if (r < .88) put('rock_moss_set_01', x, y - .1, z, .8 + rnd() * .7);
        else if (r < .95) put('shrub_01', x, y, z, 1.1 + rnd() * .8);
        else put('tree_stump_01', x, y, z, .9 + rnd() * .4);}
      if (b.x1 - b.x0 > 12 && d > 14 && rnd() < .7) put('boulder_01', rnd() < .5 ? b.x0 + 1.4 : b.x1 - 1.4, top(b, b.z0 + d / 2) - .3, b.z0 + d / 2, 2.4);
      for (let i = 0; i < 0; i++) {const z = b.z0 + rnd() * d, side = rnd() < .5 ? -1 : 1; put('root_cluster_01', side > 0 ? b.x1 + .1 : b.x0 - .1, top(b, z) - 1.6, z, 2.2, side > 0 ? Math.PI / 2 : -Math.PI / 2);}
    }
    
    const fy = this.course.spawnY(this.course.finishZ); put('fir_tree_01_c', -9.5, fy, this.course.finishZ + 7, 17); put('dead_tree_trunk', 9.5, fy, this.course.finishZ + 6, 3);
    const names = Object.keys(place); let done = 0;
    await Promise.all(names.map(async n => {
      const g = await this.model(`env/${n}.glb`); const sizeBy = /tree|grass|fern|shrub|cliff/.test(n) ? 'height' : 'max';
      const base = normalized(g.scene, 1, sizeBy); base.updateMatrixWorld(true);
      const far = /cliff/.test(n) || /tree_01_c/.test(n);
      base.traverse(o => {const m = o as THREE.Mesh; if (!m.isMesh) return;
        const inst = new THREE.InstancedMesh(m.geometry, m.material, place[n].length); const local = m.matrixWorld.clone();
        place[n].forEach((pm, i) => inst.setMatrixAt(i, pm.clone().multiply(local)));
        inst.castShadow = !far; inst.receiveShadow = !far; inst.computeBoundingSphere(); this.scene.add(inst);
        const mat = m.material as THREE.MeshStandardMaterial; if (mat.alphaTest > 0 || mat.transparent) {mat.transparent = false; mat.alphaTest = .45; mat.side = THREE.DoubleSide;}});
      progress(.15 + .65 * (++done) / names.length);
    }));
  }

  // ================= new trial visuals =================
  private mech: {gears: [any, THREE.Object3D][]; carts: [Block, THREE.Object3D][]; gates: [any, THREE.Object3D, THREE.Object3D, THREE.Object3D, THREE.MeshStandardMaterial][]; fans: [any, THREE.Object3D, THREE.MeshStandardMaterial, THREE.Points][]; hooks: [any, THREE.Object3D, THREE.Mesh, THREE.MeshStandardMaterial][]; chasers: [any, THREE.Object3D][]; tiltLamps: [Block, THREE.MeshStandardMaterial[]][]; sweepLamps: [any, THREE.MeshStandardMaterial][]} = {gears: [], carts: [], gates: [], fans: [], hooks: [], chasers: [], tiltLamps: [], sweepLamps: []};
  private buildMech(mats: Record<string, THREE.MeshStandardMaterial>) {
    const c = this.course, steel = metalMat('metal_plate_02', 0xd8dade, .35), dark = metalMat('rusty_metal_02', 0x8a8a8a, .5),
      rust = metalMat('rusty_metal_02', 0xffffff, .6), lamp = () => new THREE.MeshStandardMaterial({color: 0x330a05, emissive: 0xff2a10, emissiveIntensity: 0});
    // gears: toothed steel discs with spokes, hub bolts and an axle down into the abyss; missing sectors cut out
    for (const g of c.gears) {const grp = new THREE.Group(); grp.position.set(g.x, g.y, g.z);
      const sh = new THREE.Shape(), T = g.teeth, ro = g.r + .28, ri = g.r - .05;
      for (let i = 0; i < T * 4; i++) {const a = i / (T * 4) * Math.PI * 2, rr = (i % 4 === 1 || i % 4 === 2) ? ro : ri; const x = Math.cos(a) * rr, y = Math.sin(a) * rr; if (i === 0) sh.moveTo(x, y); else sh.lineTo(x, y);}
      const hole = new THREE.Path(); hole.absarc(0, 0, g.r * .3, 0, Math.PI * 2, true); sh.holes.push(hole);
      for (const [a0, a1] of g.gaps) {const cut = new THREE.Path(); cut.moveTo(Math.cos(a0) * g.r * .38, Math.sin(a0) * g.r * .38); cut.absarc(0, 0, g.r * .93, a0, a1, false); cut.lineTo(Math.cos(a1) * g.r * .38, Math.sin(a1) * g.r * .38); cut.absarc(0, 0, g.r * .38, a1, a0, true); sh.holes.push(cut);}
      const geo = new THREE.ExtrudeGeometry(sh, {depth: .55, bevelEnabled: true, bevelSize: .05, bevelThickness: .05, bevelSegments: 1, curveSegments: 24}); geo.rotateX(Math.PI / 2); geo.translate(0, 0, 0);
      const disc = new THREE.Mesh(geo, steel); disc.castShadow = disc.receiveShadow = true; const spin = new THREE.Group(); spin.add(disc);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(g.r * .32, g.r * .32, .62, 24), dark); hub.position.y = -.27; spin.add(hub);
      for (let k = 0; k < 6; k++) {const bolt = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .1, 8), rust); const a = k / 6 * Math.PI * 2; bolt.position.set(Math.cos(a) * g.r * .22, .05, Math.sin(a) * g.r * .22); spin.add(bolt);}
      const mark = new THREE.Mesh(new THREE.BoxGeometry(g.r * .55, .04, .18), new THREE.MeshStandardMaterial({color: 0xd8a23a, metalness: .3, roughness: .6})); mark.position.set(g.r * .62, .03, 0); spin.add(mark);
      grp.add(spin); const axle = new THREE.Mesh(new THREE.CylinderGeometry(.35, .45, 14, 12), dark); axle.position.y = -7.4; grp.add(axle); this.scene.add(grp); this.mech.gears.push([g, spin]);}
    // mine carts: riveted iron tubs on wheels; rails, sleepers and tunnel mouths at both ends
    const lanes = new Map<number, Block>(); for (const b of c.carts) lanes.set(b.cart!.lane, b);
    for (const [, b] of lanes) {const L = b.cart!.len, zc = (b.z0 + b.z1) / 2, y = b.y0;
      for (const sd of [-.75, .75]) {const rail = new THREE.Mesh(new THREE.BoxGeometry(L * 2 + 4, .12, .1), steel); rail.position.set(0, y - .95, zc + sd); this.scene.add(rail);}
      const sl = new THREE.InstancedMesh(new THREE.BoxGeometry(.25, .12, 2.1), mats.bark, Math.floor(L * 2 / .9)); for (let i = 0; i < sl.count; i++) sl.setMatrixAt(i, new THREE.Matrix4().setPosition(-L + i * .9, y - 1.06, zc)); this.scene.add(sl);
      for (const sd of [-1, 1]) {const arch = new THREE.Group(); const back = new THREE.Mesh(new THREE.BoxGeometry(4.4, 4.2, 3.2), mats.rock ?? dark); back.position.set(sd * (L + 2.7), y + .6, zc); arch.add(back);
        const hole = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.6), new THREE.MeshBasicMaterial({color: 0x050403})); hole.position.set(sd * (L + .48), y + .1, zc); hole.rotation.y = -sd * Math.PI / 2; arch.add(hole);
        const beam = new THREE.Mesh(new THREE.BoxGeometry(.4, .4, 3), mats.bark); beam.position.set(sd * (L + .45), y + 1.5, zc); arch.add(beam); this.scene.add(arch);}}
    for (const b of c.carts) {const g = new THREE.Group(), w = b.x1 - b.x0, d = b.z1 - b.z0;
      const tub = new THREE.Mesh(new THREE.BoxGeometry(w, .9, d), rust); tub.position.y = -.45; tub.castShadow = true; g.add(tub);
      const floor = new THREE.Mesh(new THREE.BoxGeometry(w - .2, .06, d - .2), metalMat('metal_grate_rusty', 0xffffff, .8)); floor.position.y = -.02; g.add(floor);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {const lip = new THREE.Mesh(new THREE.BoxGeometry(sx ? .12 : w, .16, sz ? .12 : d), dark); void lip;}
      const rimG = new THREE.BoxGeometry(w + .1, .12, .12), rim1 = new THREE.Mesh(rimG, dark), rim2 = rim1.clone(); rim1.position.set(0, .02, -d / 2); rim2.position.set(0, .02, d / 2); g.add(rim1, rim2);
      for (const sx of [-.75, .75]) for (const sz of [-.75, .75]) {const wh = new THREE.Mesh(new THREE.CylinderGeometry(.26, .26, .14, 14).rotateX(Math.PI / 2), dark); wh.position.set(sx * w / 2.2, -.9, sz); g.add(wh);}
      g.position.set(0, b.y0, (b.z0 + b.z1) / 2); this.scene.add(g); this.mech.carts.push([b, g]);}
    // gates: steel leaves or a spiked portcullis, frame with warning lamps
    for (const gt of c.gates) {const frame = new THREE.Mesh(new THREE.BoxGeometry(gt.halfW * 2 + 2.4, .6, .8), dark); frame.position.set(0, gt.y + 4.2, gt.z); this.scene.add(frame);
      const lm = lamp(); for (const sd of [-1, 1]) {const l = new THREE.Mesh(new THREE.SphereGeometry(.18, 12, 8), lm); l.position.set(sd * (gt.halfW + .6), gt.y + 3.6, gt.z - .45); this.scene.add(l);}
      let a: THREE.Object3D, b: THREE.Object3D;
      if (gt.kind === 'slide') {const leaf = () => {const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.BoxGeometry(gt.halfW, 3.6, .3), steel); p.position.set(gt.halfW / 2, 1.8, 0); p.castShadow = true; g.add(p);
          for (let i = 0; i < 4; i++) {const rib = new THREE.Mesh(new THREE.BoxGeometry(gt.halfW, .12, .36), dark); rib.position.set(gt.halfW / 2, .4 + i * .95, 0); g.add(rib);} const edge = new THREE.Mesh(new THREE.BoxGeometry(.14, 3.6, .4), new THREE.MeshStandardMaterial({color: 0xd8b23a, metalness: .4, roughness: .5})); edge.position.set(gt.halfW, 1.8, 0); g.add(edge); return bake(g);};
        a = leaf(); b = leaf(); b.scale.x = -1; a.position.set(-gt.halfW * 2, gt.y, gt.z); b.position.set(gt.halfW * 2, gt.y, gt.z);}
      else {a = new THREE.Group(); for (let i = 0; i < 9; i++) {const bar = new THREE.Mesh(new THREE.BoxGeometry(.14, 3.4, .14), steel); bar.position.set(-gt.halfW + .2 + i * (gt.halfW * 2 - .4) / 8, 1.7, 0); a.add(bar); const tip = new THREE.Mesh(new THREE.ConeGeometry(.12, .35, 6).rotateX(Math.PI), steel); tip.position.set(bar.position.x, -.15, 0); a.add(tip);}
        for (let i = 0; i < 3; i++) {const h = new THREE.Mesh(new THREE.BoxGeometry(gt.halfW * 2, .14, .18), dark); h.position.y = .5 + i * 1.2; a.add(h);} bake(a); a.position.set(0, gt.y, gt.z); b = new THREE.Group();}
      this.scene.add(a, b); this.mech.gates.push([gt, a, b, frame, lm]);}
    // fans: steel housing, spinning blades, warning lamp, airflow particles
    for (const f of c.fans) {const g = new THREE.Group(); g.position.set(f.x, f.y, f.z); g.rotation.y = Math.atan2(f.dx, f.dz);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, .16, 10, 32), dark); g.add(ring); const cage = new THREE.Mesh(new THREE.TorusGeometry(.6, .04, 6, 24), steel); cage.position.z = .2; g.add(cage);
      const blades = new THREE.Group(); for (let k = 0; k < 5; k++) {const bl = new THREE.Mesh(new THREE.BoxGeometry(.32, 1.1, .05), steel); bl.position.y = .58; bl.rotation.y = .5; const arm = new THREE.Group(); arm.add(bl); arm.rotation.z = k / 5 * Math.PI * 2; blades.add(arm);}
      blades.add(new THREE.Mesh(new THREE.SphereGeometry(.2, 12, 8), dark)); bake(blades); g.add(blades);
      const stand = new THREE.Mesh(new THREE.BoxGeometry(.4, f.y - this.course.spawnY(f.z) + 4, .4), dark); stand.position.y = -(f.y - this.course.spawnY(f.z) + 4) / 2 - 1; g.add(stand);
      const lm = lamp(); const l = new THREE.Mesh(new THREE.SphereGeometry(.15, 10, 8), lm); l.position.set(0, 1.5, 0); g.add(l);
      const n = 70, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) {pos[i * 3] = (Math.random() - .5) * 2 * f.half; pos[i * 3 + 1] = (Math.random() - .3) * 2; pos[i * 3 + 2] = Math.random() * f.reach;}
      const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const pts = new THREE.Points(pg, new THREE.PointsMaterial({map: dotTexture(true), size: .25, color: 0xe8e4dc, transparent: true, opacity: .5, depthWrite: false})); pts.frustumCulled = false; g.add(pts);
      this.scene.add(g); this.mech.fans.push([f, blades, lm, pts]);}
    // hooks: pillar with lamp, chain and a heavy hook head
    for (const h of c.hooks) {const base = this.course.spawnY(h.z); const pil = new THREE.Mesh(new THREE.BoxGeometry(1.2, 8, 1.2), dark); pil.position.set(h.pillarX + h.side * .4, h.y - 3, h.z); this.scene.add(pil);
      const lm = lamp(); const l = new THREE.Mesh(new THREE.SphereGeometry(.2, 10, 8), lm); l.position.set(h.pillarX - h.side * .3, h.y + 1, h.z); this.scene.add(l); void base;
      const head = new THREE.Group(); const shank = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .9, 8).rotateZ(Math.PI / 2), steel); head.add(shank);
      const curve = new THREE.Mesh(new THREE.TorusGeometry(.38, .09, 8, 20, Math.PI * 1.3), steel); curve.position.x = -.5; curve.rotation.z = Math.PI * .35; head.add(curve);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(.11, .3, 8), steel); tip.position.set(-.5, .38, 0); head.add(tip); bake(head); head.scale.x = h.side; this.scene.add(head);
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1, 6).rotateZ(Math.PI / 2), dark); this.scene.add(chain);
      this.mech.hooks.push([h, head, chain, lm]);}
    // Rock waves share geometry; each body keeps its own pose. Amber beacon announces the next release.
    const stoneGeo=new THREE.SphereGeometry(1,32,24), vertices=stoneGeo.getAttribute('position');
    for(let i=0;i<vertices.count;i++){const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i),k=.96+.035*Math.sin(x*5+z*2)*Math.sin(y*6-z*3);vertices.setXYZ(i,x*k,y*k,z*k);}stoneGeo.computeVertexNormals();
    for (const ch of c.chasers) {
      const mesh=new THREE.Mesh(stoneGeo,mats.rock);mesh.scale.setScalar(ch.r);mesh.castShadow=true;
      const g=new THREE.Group();g.add(mesh);this.scene.add(g);this.mech.chasers.push([ch,g]);
      if(ch.slot!==0)continue;
      const signal=new THREE.MeshStandardMaterial({color:0x3c2108,emissive:0xffa52a,emissiveIntensity:.2});
      const beacon=new THREE.Mesh(new THREE.SphereGeometry(.3,12,8),signal);beacon.position.set(3.2,ch.track.y1+3,ch.track.z1-1);this.scene.add(beacon);
      this.stoneSignals.push({phase:ch.phase,lamp:signal});
      for(let i=0;i<5;i++) {const z=ch.track.z0+6+i*8,side=i%2?-1:1;
        const mark=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,2.4),new THREE.MeshStandardMaterial({color:0xc2ad66,emissive:0x6c5622,emissiveIntensity:.4}));
        mark.position.set(side*4.4,this.course.spawnY(z)+.12,z);this.scene.add(mark);
      }
    }
    // tilting chamber: warning lamps on the rim; mill surge lamps on spinner posts
    for (const b of c.tilts) if (b.tilt!.axis === 'xz') {const ms: THREE.MeshStandardMaterial[] = []; for (const [x, z] of [[b.x0, b.z0], [b.x1, b.z0], [b.x0, b.z1], [b.x1, b.z1]]) {const m = lamp(); ms.push(m); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 3, 6), dark); pole.position.set(x * 1.12, b.y0 + 1.5, z); this.scene.add(pole); const l = new THREE.Mesh(new THREE.SphereGeometry(.22, 10, 8), m); l.position.set(x * 1.12, b.y0 + 3.1, z); this.scene.add(l);} this.mech.tiltLamps.push([b, ms]);}
    for (const sw of c.sweepers) if (sw.vary) {const m = lamp(); const l = new THREE.Mesh(new THREE.SphereGeometry(.25, 10, 8), m); l.position.set(sw.x, sw.y + 1.3, sw.z); this.scene.add(l); this.mech.sweepLamps.push([sw, m]);}
  }
  private columns: THREE.Mesh[] = [];
  private stoneSignals: {phase: number; lamp: THREE.MeshStandardMaterial}[] = [];
  private syncMech(dt: number) {
    const c = this.course, t = c.time;
    for(const signal of this.stoneSignals){const phase=((t-signal.phase)%2+2)%2;signal.lamp.emissiveIntensity=phase>1.55 ? 1.5+Math.sin(t*35)*1.1 : .12;}
    for (const [g, spin] of this.mech.gears) spin.rotation.y = -g.angle;
    for (const [b, g] of this.mech.carts) {g.position.x = b.offX; g.visible = Math.abs(b.offX) < b.cart!.len + 1.8;}
    for (const [gt, a, b, , lm] of this.mech.gates) {lm.emissiveIntensity = gt.warn ? (Math.sin(t * 30) > 0 ? 3 : .2) : gt.open < .5 ? 1.2 : 0;
      if (gt.kind === 'slide') {const leaf = gt.halfW * (1 - gt.open); a.position.x = -gt.halfW - gt.halfW + leaf; b.position.x = gt.halfW + gt.halfW - leaf;} else a.position.y = gt.y + 3.2 * gt.open + .1;}
    for (const [f, blades, lm, pts] of this.mech.fans) {blades.rotation.z = f.spin; lm.emissiveIntensity = f.on > .05 ? 2.5 : (((t / f.period) + f.phase) % 1 > .9 ? (Math.sin(t * 25) > 0 ? 2 : 0) : 0);
      (pts.material as THREE.PointsMaterial).opacity = .55 * f.on; const p = pts.geometry.getAttribute('position') as THREE.BufferAttribute; for (let i = 0; i < p.count; i++) {let z = p.getZ(i) + dt * 18 * f.on; if (z > f.reach) z -= f.reach; p.setZ(i, z);} p.needsUpdate = true;}
    for (const [h, head, chain, lm] of this.mech.hooks) {const hx = h.pillarX - h.side * h.reach * h.ext; head.position.set(hx, h.y, h.z); lm.emissiveIntensity = h.state === 1 ? (Math.sin(t * 28) > 0 ? 3 : .2) : 0;
      const len = Math.abs(hx - h.pillarX) + .01; chain.scale.set(len, 1, 1); chain.position.set((hx + h.pillarX) / 2, h.y, h.z); chain.visible = h.ext > .02;}
    for (const [ch, g] of this.mech.chasers) {g.visible = ch.active; g.position.set(ch.x, ch.y + ch.r, ch.z); g.rotation.x = ch.spin; g.rotation.y = 0;}
    for (const col of this.columns) {const [ch, i] = col.userData.col; const [px, pz] = ch.path[i]; const near = ch.active && Math.hypot(ch.x - px, ch.z - pz) < 3; if (near) col.userData.fall = 1; if (!ch.active) col.userData.fall = 0;
      const k = col.userData.fall ? Math.min(1.4, (col.rotation.z ? Math.abs(col.rotation.z) : 0) + dt * 2.5) : Math.max(0, Math.abs(col.rotation.z) - dt); col.rotation.z = k * (i % 2 ? 1 : -1);}
    for (const [b, ms] of this.mech.tiltLamps) for (const m of ms) m.emissiveIntensity = b.tilt!.warn ? (Math.sin(t * 22) > 0 ? 3 : .3) : 0;
    for (const [sw, m] of this.mech.sweepLamps) m.emissiveIntensity = sw.boost === 1 ? 3 : sw.boost ? (Math.sin(t * 24) > 0 ? 2.5 : .2) : 0;
    // ---- sound of the world around the local runner ----
    const me = this.me, ss = this.sndState, dd = (x: number, z: number) => Math.hypot(x - me.x, z - me.z);
    if (me.falls > ss.falls) {ss.falls = me.falls; this.snd.splash(); navigator.vibrate?.(40); this.puff(me.x, me.y, me.z, 1.8); this.flash();}
    if (!me.ground && Math.hypot(me.vx, me.vz) > 4) {ss.trail = (ss.trail || 0) + dt; if (ss.trail > .05) {ss.trail = 0; this.puff(me.x, me.y + .4, me.z, .35);}}
    if (me.stun > .5 && ss.stun <= .25) {this.snd.hit(0); navigator.vibrate?.(35);} ss.stun = me.stun;
    if (me.ground && Math.hypot(me.vx, me.vz) > 2) {ss.step += dt * Math.hypot(me.vx, me.vz); if (ss.step > 1.6) {ss.step = 0; this.snd.step(me.ground.mat);}}
    for (const g of c.gates) {if (g.warn && !ss.gates.get(g)) this.snd.alarm(dd(0, g.z)); if (g.open < .05 && g.lastOpen >= .05) this.snd.metal(dd(0, g.z)); ss.gates.set(g, g.warn);}
    for (const h of c.hooks) {const prev = ss.hooks.get(h) ?? 0; if (h.state === 1 && prev !== 1) this.snd.alarm(dd(h.pillarX, h.z)); if (h.state === 2 && prev !== 2) this.snd.chain(dd(h.pillarX, h.z)); ss.hooks.set(h, h.state);}
    for (const j of c.jets) {const prev = ss.jets.get(j) ?? 0; if (j.state === 2 && prev !== 2) {if (j.kind === 'fire') this.snd.fire(dd(j.x, j.z)); else this.snd.thud(dd(j.x, j.z), .8);} ss.jets.set(j, j.state);}
    for (const p of c.pads) {if (p.fired !== (ss.pads.get(p) ?? -9)) {ss.pads.set(p, p.fired); if (dd(p.x, p.z) > 1.5) this.snd.whoosh(dd(p.x, p.z));}}
    for (const b of c.blocks) if (b.crumbleAt >= 0 && !ss.crumbs.has(b)) {ss.crumbs.add(b); this.snd.crumble(dd((b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2));} else if (b.crumbleAt < 0) ss.crumbs.delete(b);
    for (const b of c.boulders) if (dd(b.x, b.z) < 14) this.snd.roll(dd(b.x, b.z));
    for (const ch of c.chasers) if (ch.active) this.snd.roll(dd(ch.x, ch.z) * .6);
    for (const sw of c.sweepers) {const d = dd(sw.x, sw.z); if (d < sw.len + 2) {const a = sw.angle % Math.PI; if (Math.abs(a) < .08) this.snd.whoosh(d * .5);}}
    let wind = me.wind || 0; for (const f of c.fans) if (f.on > .1 && dd(f.x, f.z) < 14) wind = Math.max(wind, f.on * .5); this.snd.tickAmbience(t, wind);
  }

  start() {
    { // all devices: only runners and moving hazards cast shadows; the shadow map refreshes every other frame (static decor shadows were the biggest GPU cost)
      const dyn = new Set<THREE.Object3D>(); for (const l of this.looks.values()) l.root.traverse(o => dyn.add(o));
      this.scene.traverse(o => {const m = o as THREE.Mesh; if (m.isMesh && !dyn.has(m) && !(m as any).isSkinnedMesh && !m.userData.p) m.castShadow = false;});
      this.renderer.shadowMap.autoUpdate = false; this.phoneShadows = true;}
    if (false) {const c = new EffectComposer(this.renderer); c.addPass(new RenderPass(this.scene, this.camera));
      c.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), this.night || this.manor ? .75 : .35, .5, .82)); c.addPass(new OutputPass()); c.setSize(innerWidth, innerHeight); this.composer = c;}
    this.renderer.setAnimationLoop(t => this.frame(t));}

  // ---------- checkpoints ----------
  private checkpointArches(postMat: THREE.Material) {
    const cps = this.course.checkpoints.slice(1);
    for (const cz of cps) {
      let w = 6; for (const b of this.course.blocks) if (!b.crumbles && !b.driftAmp && cz >= b.z0 && cz <= b.z1) w = Math.min((b.x1 - b.x0) / 2 - .5, 7);
      const y = this.course.spawnY(cz);
      for (const sg of [-1, 1]) {const post = new THREE.Mesh(new THREE.CylinderGeometry(.18, .22, 4.2, 10), postMat); post.position.set(sg * w, y + 2.1, cz); post.castShadow = true; this.scene.add(post);
        const cap = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 8), new THREE.MeshStandardMaterial({color: 0x222018, emissive: 0xffa040, emissiveIntensity: 1.6})); cap.position.set(sg * w, y + 4.35, cz); this.scene.add(cap);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0xffa040, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending})); halo.scale.setScalar(2.2); halo.position.copy(cap.position); this.scene.add(halo);}
      const flagM = 0; void flagM;
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(w * 2 - .6, .9), new THREE.MeshStandardMaterial({map: flagTexture(), side: THREE.DoubleSide, roughness: .8, emissive: 0x000000, emissiveMap: flagTexture(), emissiveIntensity: .9}));
      flag.position.set(0, y + 3.7, cz); flag.rotation.y = Math.PI; this.scene.add(flag); this.soft.push(flag);
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, w * 2, 6).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({color: 0x2a2018})); rope.position.set(0, y + 4.2, cz); this.scene.add(rope); this.soft.push(rope);
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(w * 2, .7).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({color: 0x6fd3ff, transparent: true, opacity: .4, depthWrite: false, blending: THREE.AdditiveBlending}));
      glow.position.set(0, y + .03, cz); glow.renderOrder = 3; this.scene.add(glow);
      this.cpArches.push({glow, flag, lit: false});
    }
  }
  /** Bake every plain static mesh added by the dressing pass into one mesh per material (thousands of draw calls -> dozens). */
  private mergeStatic(from: number) {
    const groups = new Map<string, {mat: THREE.Material; geos: THREE.BufferGeometry[]; shadow: boolean}>(), drop: THREE.Mesh[] = [];
    this.scene.updateMatrixWorld(true);
    const take = (m: THREE.Mesh) => {let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone(); g.applyMatrix4(m.matrixWorld);
      for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
      if (!g.attributes.normal) g.computeVertexNormals(); if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      const key = (m.material as THREE.Material).uuid + (m.castShadow ? 's' : ''); let e = groups.get(key); if (!e) {e = {mat: m.material as THREE.Material, geos: [], shadow: m.castShadow}; groups.set(key, e);} e.geos.push(g);};
    // static decor groups (frames, chapels, chandeliers…): flatten their plain meshes; animated groups carry userData.sway
    for (const o of this.scene.children.slice(from)) {if ((o as any).isMesh || (o as any).isSprite || (o as any).isPoints || o.userData.sway !== undefined || o.userData.keep) continue;
      const kids: THREE.Mesh[] = []; o.traverse(c => {const m = c as THREE.Mesh; if (m !== o && m.isMesh && !(m as any).isInstancedMesh && !(m as any).isSkinnedMesh && !Array.isArray(m.material)) kids.push(m);});
      for (const m of kids) {take(m); m.parent!.remove(m);} let left = 0; o.traverse(c => {if (c !== o && ((c as any).isMesh || (c as any).isSprite || (c as any).isPoints)) left++;}); if (!left) this.scene.remove(o);}
    for (const o of this.scene.children.slice(from)) {const m = o as THREE.Mesh; if (!m.isMesh || (m as any).isInstancedMesh || Array.isArray(m.material) || m.userData.keep) continue;
      let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone(); g.applyMatrix4(m.matrixWorld); const keys = Object.keys(g.attributes).sort().join(',');
      for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
      if (!g.attributes.normal) g.computeVertexNormals(); if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); void keys;
      const key = (m.material as THREE.Material).uuid + (m.castShadow ? 's' : ''); let e = groups.get(key); if (!e) {e = {mat: m.material as THREE.Material, geos: [], shadow: m.castShadow}; groups.set(key, e);} e.geos.push(g); drop.push(m);}
    // static course blocks (+ their trims): no motion, not an occluding wall outside a maze
    const inMaze = (b: Block) => this.course.mazePaths.some(mz => b.z0 >= mz.box[2] - .5 && b.z1 <= mz.box[3] + .5);
    for (const [b, m] of [...this.blockMeshes]) {
      if (b.driftAmp || b.liftAmp || b.crumbles || b.trapPeriod || b.gear || b.cart || b.tilt || b.ghost || b.fake || (b.wall && !inMaze(b)) || b.conveyor || m.userData.pivot) continue;
      m.updateMatrixWorld(true); const g0 = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry, mats = m.material as THREE.Material[];
      for (const grp of g0.groups) {const part = new THREE.BufferGeometry(); for (const k of ['position', 'normal', 'uv']) {const a = g0.getAttribute(k) as THREE.BufferAttribute; part.setAttribute(k, new THREE.BufferAttribute((a.array as Float32Array).slice(grp.start * a.itemSize, (grp.start + grp.count) * a.itemSize), a.itemSize));}
        part.applyMatrix4(m.matrixWorld); const mat = mats[grp.materialIndex ?? 0], key = mat.uuid + (m.castShadow ? 's' : ''); let e = groups.get(key); if (!e) {e = {mat, geos: [], shadow: m.castShadow}; groups.set(key, e);} e.geos.push(part);}
      for (const ch of m.children) {const cm = ch as THREE.Mesh; if (!cm.isMesh || m.userData.crack === cm) continue; const g = (cm.geometry.index ? cm.geometry.toNonIndexed() : cm.geometry.clone()); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); g.applyMatrix4(cm.matrixWorld);
        const key = (cm.material as THREE.Material).uuid; let e = groups.get(key); if (!e) {e = {mat: cm.material as THREE.Material, geos: [], shadow: false}; groups.set(key, e);} e.geos.push(g);}
      this.scene.remove(m); this.blockMeshes.delete(b);}
    for (const m of drop) this.scene.remove(m);
    // static glow sprites -> one Points cloud per colour/size
    const pts = new Map<string, {mat: THREE.SpriteMaterial; pos: number[]; size: number}>(), flames = new Set<THREE.Object3D>(this.flames);
    for (const o of [...this.scene.children]) {const sp = o as THREE.Sprite; if (!(sp as any).isSprite || flames.has(sp) || sp === this.sunGlow || sp === this.moonGlow || sp.userData.keep) continue; const mt = sp.material as THREE.SpriteMaterial;
      const key = mt.color.getHexString() + Math.round(sp.scale.x * 4) + mt.opacity.toFixed(2); let e = pts.get(key); if (!e) {e = {mat: mt, pos: [], size: sp.scale.x}; pts.set(key, e);} e.pos.push(sp.position.x, sp.position.y, sp.position.z); this.scene.remove(sp);}
    for (const {mat, pos, size} of pts.values()) {const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const pm = new THREE.PointsMaterial({map: mat.map, color: mat.color, size: size * 1.0, transparent: true, opacity: mat.opacity, depthWrite: false, blending: mat.blending, sizeAttenuation: true}); const p = new THREE.Points(g, pm); p.frustumCulled = false; this.scene.add(p);}
    for (const {mat, geos, shadow} of groups.values()) {const merged = mergeGeometries(geos, false); if (!merged) continue; const mm = new THREE.Mesh(merged, mat); mm.castShadow = shadow; mm.receiveShadow = true; this.scene.add(mm);}
  }
  private flash() {const f = document.getElementById('flash'); if (!f) return; f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');}
  private toast(text: string) {const t = document.getElementById('toast'); if (!t) return; t.textContent = text; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');}

  // ---------- the collector's house ----------
  private async decorateManor(mats: Record<string, THREE.MeshStandardMaterial>, progress: (f: number) => void) {
    const c = this.course; let seed = 31; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const props: Record<string, THREE.Matrix4[]> = {}, glows: THREE.Vector3[] = [], shafts: [number, number, number, number][] = [];
    const put = (n: string, x: number, y: number, z: number, size: number, yaw = rnd() * Math.PI * 2) => (props[n] ??= []).push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw), new THREE.Vector3(size, size, size)));
    const add = (m: THREE.Mesh, shadow = true) => {m.castShadow = shadow; m.receiveShadow = true; this.scene.add(m); return m;};
    const plane = (w: number, h: number, tile: number) => {const g = new THREE.PlaneGeometry(w, h); const uv = g.getAttribute('uv'); for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / tile, uv.getY(i) * h / tile); return g;};
    const ironMat = new THREE.MeshStandardMaterial({color: 0x17171b, metalness: .85, roughness: .45});
    let prevW = -1;
    for (const r of c.rooms) {
      const len = r.z1 - r.z0, zc = (r.z0 + r.z1) / 2, base = r.y - 8, H = r.h + 8;
      for (const sd of [-1, 1]) {const w = add(new THREE.Mesh(plane(len, H, 3), mats.wall)); w.position.set(sd * r.halfW, base + H / 2, zc); w.rotation.y = -sd * Math.PI / 2;
        const wc = add(new THREE.Mesh(plane(len, 1.3, 2), mats.beam), false); wc.position.set(sd * (r.halfW - .03), r.y + .65, zc); wc.rotation.y = -sd * Math.PI / 2;
        const rail = add(new THREE.Mesh(new THREE.BoxGeometry(.12, .14, len), mats.beam), false); rail.position.set(sd * (r.halfW - .06), r.y + 1.32, zc);
        const ao = add(new THREE.Mesh(new THREE.PlaneGeometry(len, 1.2), AO_MAT_GET()), false); ao.rotation.set(-Math.PI / 2, 0, -sd * Math.PI / 2 + Math.PI / 2); ao.position.set(sd * (r.halfW - .6), r.y + .02, zc);
        for (let z = Math.ceil((r.z0 + 1) / 8) * 8; z < r.z1; z += 8) {const post = add(new THREE.Mesh(new THREE.BoxGeometry(.5, r.h + 1, .5), mats.beam)); post.position.set(sd * (r.halfW - .25), r.y + r.h / 2 - .5, z);}}
      if (prevW > 0 && prevW !== r.halfW) for (const sd of [-1, 1]) {const a = Math.min(prevW, r.halfW), b = Math.max(prevW, r.halfW); const j = add(new THREE.Mesh(plane(b - a, H + 4, 3), mats.wall)); j.position.set(sd * (a + b) / 2, base + (H + 4) / 2, r.z0); if (prevW < r.halfW) j.rotation.y = Math.PI;}
      prevW = r.halfW;
      // ceiling: boards with barred skylights every 8 m, beams across every 4 m
      const top = r.y + r.h; let z = r.z0;
      while (z < r.z1) {const open = r.skylights && (Math.round(z) % 8 < 3) && z + 2.4 < r.z1; const seg = open ? 2.4 : Math.min(r.z1 - z, 5.6);
        if (open) {for (let x = -r.halfW + .5; x < r.halfW; x += .6) {const bar = add(new THREE.Mesh(new THREE.BoxGeometry(.07, .07, seg), ironMat)); bar.position.set(x, top, z + seg / 2);} shafts.push([0, top, z + seg / 2, r.halfW]);}
        else {const ce = add(new THREE.Mesh(plane(r.halfW * 2, seg, 2.5), mats.beam)); ce.rotation.x = Math.PI / 2; ce.position.set(0, top + .05, z + seg / 2);
          const lid = add(new THREE.Mesh(new THREE.BoxGeometry(r.halfW * 2 + 2, .3, seg), new THREE.MeshBasicMaterial({color: 0}))); lid.position.set(0, top + .4, z + seg / 2);}
        z += seg;}
      for (let zz = Math.ceil((r.z0 + 1) / 8) * 8; zz < r.z1; zz += 8) {const bm = add(new THREE.Mesh(new THREE.BoxGeometry(r.halfW * 2, .45, .45), mats.beam)); bm.position.set(0, top - .25, zz);}
      if (this.crypt) {// catacomb walls: niches stacked with skulls, burning torches, roots and cobwebs
        for (let zz = Math.ceil(r.z0 / 5) * 5 + 2; zz < r.z1 - 1; zz += 5) for (const sd of [-1, 1]) {const nx = sd * (r.halfW - .05);
          for (let row = 0; row < 3; row++) {const ni = new THREE.Mesh(new THREE.PlaneGeometry(1.5, .78), this.niche); ni.position.set(nx - sd * .01, r.y + .9 + row * .95, zz); ni.rotation.y = -sd * Math.PI / 2; this.scene.add(ni);
            for (let k = 0; k < 3; k++) if (rnd() < .7) this.skullAt.push(new THREE.Vector3(nx - sd * .18, r.y + .78 + row * .95, zz - .45 + k * .45));}
          if (Math.round(zz / 5) % 2) {const tz = zz + 2.5, tp = new THREE.Vector3(nx - sd * .25, r.y + 2.6, tz); const st = new THREE.Mesh(new THREE.CylinderGeometry(.05, .04, .6, 6), this.gold); st.position.copy(tp).add(new THREE.Vector3(0, -.2, 0)); st.rotation.z = sd * .4; this.scene.add(st);
            const fl = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0xff8a2a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending})); fl.scale.set(.5, .9, 1); fl.position.copy(tp).add(new THREE.Vector3(0, .25, 0)); this.scene.add(fl); this.flames.push(fl);
            const pool = new THREE.Mesh(new THREE.CircleGeometry(3, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({map: dotTexture(true), color: 0xff7a20, transparent: true, opacity: .3, depthWrite: false, blending: THREE.AdditiveBlending})); pool.position.set(nx - sd * 1.6, r.y + .03, tz); this.scene.add(pool);}}
        for (let i = 0; i < (r.z1 - r.z0) / 6; i++) {const web = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), this.web); const sd = rnd() < .5 ? -1 : 1; web.position.set(sd * (r.halfW - .7), r.y + r.h - .7, r.z0 + rnd() * (r.z1 - r.z0)); web.rotation.set(0, sd * .8, 0); this.scene.add(web);}
      } else {
      // the collector's gallery: his exhibits' portraits in gilded frames, red drapes, a carpet runner
      for (let zz = Math.ceil(r.z0 / 8) * 8 + 4; zz < r.z1 - 2; zz += 8) for (const sd of [-1, 1]) {if (rnd() < .25) continue;
        const ch = CHARACTERS[Math.floor(rnd() * CHARACTERS.length)], f = new THREE.Group(); f.position.set(sd * (r.halfW - .06), r.y + 3.1, zz); f.rotation.y = -sd * Math.PI / 2;
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.1, .12), this.gold); const pic = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.8), this.portrait(ch)); pic.position.z = .075; const back = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.85), this.canvasBg); back.position.z = .065; f.add(frame, back, pic);
        const plate = new THREE.Mesh(new THREE.BoxGeometry(.7, .14, .03), this.gold); plate.position.set(0, -1.2, .06); f.add(plate); this.scene.add(f);}
      for (let zz = Math.ceil(r.z0 / 8) * 8; zz < r.z1; zz += 8) for (const sd of [-1, 1]) {const d = new THREE.Mesh(new THREE.PlaneGeometry(1.6, r.h - .6, 6, 1), this.drape); d.position.set(sd * (r.halfW - .12), r.y + (r.h - .6) / 2 + .3, zz + sd * .9); d.rotation.y = -sd * Math.PI / 2;
        const pa = d.geometry.getAttribute('position'); for (let i = 0; i < pa.count; i++) pa.setZ(i, Math.sin(pa.getX(i) * 6) * .08); d.geometry.computeVertexNormals(); this.scene.add(d);}
      }
      // wall lamps with candles
      for (let zz = r.z0 + 3; zz < r.z1 - 1; zz += 7) {const sd = Math.round(zz / 7) % 2 ? 1 : -1; put('caged_hanging_light', sd * (r.halfW - .45), r.y + 2.4, zz, .55, sd > 0 ? -Math.PI / 2 : Math.PI / 2); glows.push(new THREE.Vector3(sd * (r.halfW - .5), r.y + 2.45, zz));}
      // clutter along the walls of wide rooms
      if (r.halfW >= 6) for (let i = 0; i < len / 3.5; i++) {const sd = rnd() < .5 ? -1 : 1, x = sd * (r.halfW - 1.1 - rnd() * .8), zz = r.z0 + 1 + rnd() * (len - 2), k = rnd();
        if (c.blocks.some(b => b.crumbles && zz > b.z0 - 1 && zz < b.z1 + 1)) continue;
        if (k < .3) put('wine_barrel_01', x, r.y, zz, 1.1); else if (k < .5) put('wooden_crate_01', x, r.y, zz, .9 + rnd() * .3); else if (k < .62) put('wooden_barrels_01', x, r.y, zz, 1.8);
        else if (k < .74) {put('wooden_bucket_01', x, r.y, zz, .45);} else if (k < .86) {put('wine_bottles_01', x, r.y, zz, .5);} else {put('brass_candleholders', x, r.y, zz, .6); glows.push(new THREE.Vector3(x, r.y + .65, zz));}}
    }
    if (this.skullAt.length) {const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!; x.fillStyle = '#c9bc9c'; x.fillRect(0, 0, 128, 128);
      const g = x.createRadialGradient(64, 50, 10, 64, 64, 70); g.addColorStop(0, 'rgba(255,250,230,.25)'); g.addColorStop(1, 'rgba(60,45,30,.6)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
      x.fillStyle = '#120a06'; for (const ex of [44, 84]) {x.beginPath(); x.ellipse(ex, 60, 14, 17, 0, 0, 7); x.fill();} x.beginPath(); x.moveTo(64, 74); x.lineTo(57, 92); x.lineTo(71, 92); x.fill();
      for (let i = 0; i < 6; i++) x.fillRect(42 + i * 8, 104, 5, 12); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      const face = new THREE.MeshStandardMaterial({map: tex, roughness: .8}), bone = new THREE.MeshStandardMaterial({color: 0xbcae8c, roughness: .85});
      const head = new THREE.SphereGeometry(.2, 14, 10).scale(1, .95, 1.05), front = new THREE.PlaneGeometry(.3, .32).translate(0, -.02, .2).rotateY(0);
      const ih = new THREE.InstancedMesh(head, bone, this.skullAt.length), iff = new THREE.InstancedMesh(front, face, this.skullAt.length);
      this.skullAt.forEach((p, i) => {const m = new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (Math.random() - .5) * .4 + (p.x > 0 ? -Math.PI * .75 : Math.PI * .75))), new THREE.Vector3(1, 1, 1)); ih.setMatrixAt(i, m); iff.setMatrixAt(i, m);});
      ih.computeBoundingSphere(); iff.computeBoundingSphere(); this.scene.add(ih, iff);}
    // library shelves (along the walls by the turning beams)
    const lib = c.sweepers[0]; if (lib) for (let z = lib.z - 12; z < lib.z + 12; z += 2.2) for (const sd of [-1, 1]) put('wooden_bookshelf_worn', sd * 10, lib.y - .55, z, 2.6, sd > 0 ? -Math.PI / 2 : Math.PI / 2);
    // empty cages hanging in the cellar where the exhibits were kept, chandeliers in the great hall
    const ch = await this.model('env/lantern_chandelier_01.glb'); this.chandelier = ch.scene;
    for (const [x, z, h] of [[-5.5, 2, 4.2], [5, 6, 3.6], [-4.5, 12, 3.9], [5.5, 16, 4.4], [0, 19, 5.2], [-6.5, 18, 3.4]]) {const cg = ironCage(); cg.position.set(x, h, z); cg.rotation.y = rnd() * 6; cg.userData.sway = rnd() * 6; this.scene.add(cg); this.swingers.push(cg);
      const chain = add(new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 10 - h - 2.2, 6), ironMat), false); chain.position.set(x, h + 2.2 + (10 - h - 2.2) / 2, z);}
    for (const [x, z, h] of [[-5.4, -2, 0], [6, 9, 0]] as const) {const cg = ironCage(true); cg.position.set(x, h, z); cg.rotation.set(0, rnd() * 6, .15); this.scene.add(cg);}
    const hall = c.fallZones[0]; if (hall) for (let z = hall[2] + 4; z < hall[3]; z += 9) {const chd = normalized(ch.scene, 2.4, 'max'); chd.position.set(0, (c.rooms.find(r => z >= r.z0 && z <= r.z1)?.y ?? 0) + 7.4, z); this.scene.add(chd); glows.push(chd.position.clone().add(new THREE.Vector3(0, -.3, 0)));}
    // the door to freedom, moonlight pouring through
    const door = await this.model('env/large_castle_door.glb'); const fy = c.spawnY(c.finishZ); const dr = normalized(door.scene, 7.5, 'height'); dr.position.set(0, fy, c.finishZ + 8.6); dr.rotation.y = Math.PI; this.scene.add(dr);
    const burst = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0xb9d0ff, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending})); burst.scale.set(14, 10, 1); burst.position.set(0, fy + 3.6, c.finishZ + 8); this.scene.add(burst);
    progress(.45);
    // instanced props
    const names = Object.keys(props); let done = 0;
    await Promise.all(names.map(async n => {const g = await this.model(`env/${n}.glb`); const base = normalized(g.scene, 1, /shelf|candle|light|bottles|bucket|barrels/.test(n) ? 'height' : 'max'); base.updateMatrixWorld(true);
      if (!/shelf|light/.test(n)) base.children[0].position.y += 0; // keep feet on floor
      base.traverse(o => {const m = o as THREE.Mesh; if (!m.isMesh) return; const im = new THREE.InstancedMesh(m.geometry, m.material, props[n].length); const local = m.matrixWorld.clone();
        props[n].forEach((pm, i) => im.setMatrixAt(i, pm.clone().multiply(local))); im.castShadow = true; im.receiveShadow = true; im.computeBoundingSphere(); this.scene.add(im);});
      progress(.45 + .35 * (++done) / names.length);}));
    // candle glows (no real lights: phone friendly) and moonlight shafts through the skylights
    const halo = new THREE.SpriteMaterial({map: dotTexture(true), color: 0xff9a40, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending});
    for (const g of glows) {const h = new THREE.Sprite(halo); h.scale.setScalar(1.9); h.position.copy(g); this.scene.add(h); this.flames.push(h);
      const pool = new THREE.Mesh(new THREE.CircleGeometry(2.6, 24).rotateX(-Math.PI / 2), POOL_MAT());
      pool.position.set(g.x, c.spawnY(g.z) + .03, g.z); this.scene.add(pool);}
    const shaftTex = shaftTexture();
    for (const [x, y, z, hw] of shafts) {const L = 14; for (const rot of [0, Math.PI / 2]) {const m = new THREE.Mesh(new THREE.PlaneGeometry(hw * 1.6, L), new THREE.MeshBasicMaterial({map: shaftTex, color: 0x9fb8ff, transparent: true, opacity: .07, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false}));
      m.position.set(x - SKY_DIR.x * L / 2, y - L / 2, z - SKY_DIR.z * L / 2); m.rotation.set(Math.atan2(SKY_DIR.z, SKY_DIR.y), rot, 0); this.scene.add(m);}}
    progress(.8);
  }
  private swingers: THREE.Object3D[] = [];
  private skullAt: THREE.Vector3[] = [];
  private niche = new THREE.MeshBasicMaterial({color: 0x060403});
  private web = (() => {const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!; x.strokeStyle = 'rgba(230,230,230,.55)'; x.lineWidth = 1;
    for (let k = 0; k < 9; k++) {const a = k / 9 * Math.PI / 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a) * 128, Math.sin(a) * 128); x.stroke();}
    for (let r = 14; r < 128; r += 14) {x.beginPath(); x.arc(0, 0, r, 0, Math.PI / 2); x.stroke();} const t = new THREE.CanvasTexture(c); return new THREE.MeshBasicMaterial({map: t, transparent: true, depthWrite: false, side: THREE.DoubleSide});})();
  private gold = new THREE.MeshStandardMaterial({color: 0xc9962e, metalness: 1, roughness: .35, envMapIntensity: 1.6});
  private drape = new THREE.MeshStandardMaterial({color: 0x5a0d10, roughness: .85, side: THREE.DoubleSide});
  private canvasBg = new THREE.MeshStandardMaterial({color: 0x2b1a14, roughness: .9});
  private portraits = new Map<string, THREE.Material>();
  private portrait(ch: string) {let m = this.portraits.get(ch); if (!m) {const t = this.texLoader.load(`portraits/${ch}.png`); t.colorSpace = THREE.SRGBColorSpace;
    const c = document.createElement('canvas'); c.width = 4; c.height = 4; m = new THREE.MeshStandardMaterial({map: t, color: 0xd8c8b0, roughness: .7, transparent: true, alphaTest: .05});
    const bg = new THREE.MeshStandardMaterial({color: 0x2a1410}); void bg; this.portraits.set(ch, m);} return m;} private flames: THREE.Sprite[] = [];

  // ---------- graveyard dressing ----------
  private async decorateNight(stone: THREE.Material, progress: (f: number) => void) {
    let seed = 23; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const len = this.course.finishZ + 30, M = () => new THREE.Matrix4();
    const graves: THREE.Matrix4[] = [], crosses: THREE.Matrix4[] = [], bars: THREE.Matrix4[] = [], lamps: THREE.Vector3[] = [], trees: THREE.Matrix4[] = [];
    const q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3();
    const put = (arr: THREE.Matrix4[], x: number, y: number, z: number, s: number, yaw: number, tilt = 0) => arr.push(M().compose(v.set(x, y, z), q.setFromEuler(e.set(tilt, yaw, tilt * .6)), sc.set(s, s, s)));
    // swamp graveyard on both sides of the path: crooked graves and crosses rising out of the water
    for (let z = -20; z < len; z += 1.6 + rnd() * 1.6) for (const sd of [-1, 1]) {const x = sd * (8 + rnd() * 34); if (rnd() < .3) continue;
      if (this.course.blocks.some(b => x > b.x0 - 1.5 && x < b.x1 + 1.5 && z > b.z0 - 1.5 && z < b.z1 + 1.5)) continue;
      put(rnd() < .7 ? graves : crosses, x, -2.6, z, .9 + rnd() * .6, (rnd() - .5) * .6, (rnd() - .5) * .35);}
    // graves on the wide plazas, iron fences along their edges, lanterns along the path
    for (const b of this.course.blocks) {
      if (b.crumbles || b.driftAmp || b.liftAmp || (b.gear || b.cart || b.tilt || b.trapPeriod || b.wall || b.fake || b.driftAmp || (b.x1 - b.x0) < 6)) continue; const d = b.z1 - b.z0, w = b.x1 - b.x0, y = top(b, b.z0);
      if (w >= 14) for (let i = 0; i < d / 3; i++) {const sd = rnd() < .5 ? -1 : 1, x = sd > 0 ? b.x1 - .8 - rnd() * 1.2 : b.x0 + .8 + rnd() * 1.2; put(rnd() < .75 ? graves : crosses, x, y, b.z0 + rnd() * d, .7 + rnd() * .4, (rnd() - .5) * .5, (rnd() - .5) * .25);}
      if (b.mat !== 'mud') for (const sd of [-1, 1]) for (let zz = b.z0 + .3; zz < b.z1; zz += .45) if (rnd() < .92) put(bars, sd > 0 ? b.x1 - .1 : b.x0 + .1, y, zz, 1, 0, (rnd() - .5) * .12);
      for (let zz = b.z0 + 3; zz < b.z1 - 1; zz += 11) for (const sd of [-1, 1]) lamps.push(new THREE.Vector3(sd > 0 ? b.x1 - .45 : b.x0 + .45, y, zz + (sd > 0 ? 5 : 0)));
    }
    for (let z = -30; z < len + 30; z += 6 + rnd() * 6) for (const sd of [-1, 1]) put(trees, sd * (16 + rnd() * 45), -2.9, z, 3.5 + rnd() * 2.5, rnd() * 6);
    // meshes
    const graveGeo = mergeGeos([new THREE.BoxGeometry(.8, 1, .2).translate(0, .5, 0), new THREE.CylinderGeometry(.4, .4, .2, 18, 1, false, -Math.PI / 2, Math.PI).rotateX(Math.PI / 2).rotateZ(0).translate(0, 1, 0), new THREE.BoxGeometry(1, .18, .32).translate(0, .09, 0)]);
    const crossGeo = mergeGeos([new THREE.BoxGeometry(.16, 1.5, .16).translate(0, .75, 0), new THREE.BoxGeometry(.8, .16, .16).translate(0, 1.1, 0)]);
    const inst = (geo: THREE.BufferGeometry, mat: THREE.Material, arr: THREE.Matrix4[], shadow = true) => {if (!arr.length) return; const m = new THREE.InstancedMesh(geo, mat, arr.length); arr.forEach((a, i) => m.setMatrixAt(i, a)); m.castShadow = shadow; m.receiveShadow = true; m.computeBoundingSphere(); this.scene.add(m);};
    inst(graveGeo, stone, graves); inst(crossGeo, stone, crosses);
    inst(new THREE.BoxGeometry(.05, 1.25, .05).translate(0, .62, 0), new THREE.MeshStandardMaterial({color: 0x15151a, metalness: .85, roughness: .4}), bars, false);
    progress(.4);
    // dark conifer silhouettes around the swamp (scanned trees, nearly black under the moon)
    const tree = await this.model('env/pine_tree_01_c.glb'); const tb = normalized(tree.scene, 1, 'height'); tb.updateMatrixWorld(true);
    tb.traverse(o => {const m = o as THREE.Mesh; if (!m.isMesh) return; const mt = (m.material as THREE.MeshStandardMaterial).clone(); mt.color = new THREE.Color(0x3a4450); const im = new THREE.InstancedMesh(m.geometry, mt, trees.length); const local = m.matrixWorld.clone();
      trees.forEach((t, i) => {const mm = t.clone(); const sc = new THREE.Vector3(); mm.decompose(new THREE.Vector3(), new THREE.Quaternion(), sc); im.setMatrixAt(i, mm.scale(new THREE.Vector3(2.6, 2.6, 2.6)).multiply(local));}); im.computeBoundingSphere(); this.scene.add(im);});
    // distant chapels / mausoleums on the horizon with warm windows, and a ruined wall line
    const chapelMat = new THREE.MeshStandardMaterial({color: 0x1b1e26, roughness: 1}), winMat = new THREE.MeshBasicMaterial({color: 0xffa040, fog: false});
    for (let i = 0; i < 9; i++) {const sd = i % 2 ? 1 : -1, z = -10 + i * (len / 8), x = sd * (100 + rnd() * 70), g = new THREE.Group(); g.position.set(x, -3, z); const s2 = 2 + rnd() * 2.5; g.scale.setScalar(s2);
      const body = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 7), chapelMat); body.position.y = 2.5; g.add(body);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 3, 4).rotateY(Math.PI / 4), chapelMat); roof.scale.z = 1.7; roof.position.y = 6.5; g.add(roof);
      if (rnd() < .7) {const tower = new THREE.Mesh(new THREE.BoxGeometry(1.8, 8, 1.8), chapelMat); tower.position.set(0, 4, -4); g.add(tower); const spire = new THREE.Mesh(new THREE.ConeGeometry(1.4, 4, 4), chapelMat); spire.position.set(0, 10, -4); g.add(spire);
        const cr = new THREE.Mesh(new THREE.BoxGeometry(.2, 1.4, .2), chapelMat); cr.position.set(0, 12.6, -4); g.add(cr); const cb = new THREE.Mesh(new THREE.BoxGeometry(.8, .2, .2), chapelMat); cb.position.set(0, 12.8, -4); g.add(cb);}
      for (let k = 0; k < 3; k++) if (rnd() < .7) {const w = new THREE.Mesh(new THREE.PlaneGeometry(.6, 1.2), winMat); w.position.set(-sd * 2.02, 2.6, -2 + k * 2); w.rotation.y = -sd * Math.PI / 2; g.add(w);
        const h = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0xff9030, transparent: true, opacity: .35, depthWrite: false, blending: THREE.AdditiveBlending, fog: false})); h.scale.setScalar(3); h.position.copy(w.position); g.add(h);}
      this.scene.add(g);}
    // lanterns: iron post, glowing cage, halo (no real lights: cheap on phones)
    const postGeo = new THREE.CylinderGeometry(.06, .08, 2.2, 8).translate(0, 1.1, 0), lampGeo = new THREE.BoxGeometry(.32, .42, .32);
    const posts = new THREE.InstancedMesh(postGeo, new THREE.MeshStandardMaterial({color: 0x121216, metalness: .8, roughness: .5}), lamps.length);
    const cages = new THREE.InstancedMesh(lampGeo, new THREE.MeshStandardMaterial({color: 0x241808, emissive: 0xff9a3c, emissiveIntensity: 2.2}), lamps.length);
    lamps.forEach((p, i) => {posts.setMatrixAt(i, M().setPosition(p)); cages.setMatrixAt(i, M().setPosition(p.x, p.y + 2.35, p.z));
      const h = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0xff9a3c, transparent: true, opacity: .75, depthWrite: false, blending: THREE.AdditiveBlending})); h.scale.setScalar(2.6); h.position.set(p.x, p.y + 2.35, p.z); this.scene.add(h);
      const pool = new THREE.Mesh(new THREE.CircleGeometry(2.2, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({map: dotTexture(true), color: 0xff8a30, transparent: true, opacity: .35, depthWrite: false, blending: THREE.AdditiveBlending})); pool.position.set(p.x, p.y + .03, p.z); this.scene.add(pool);});
    posts.computeBoundingSphere(); cages.computeBoundingSphere(); this.scene.add(posts, cages);
    progress(.8);
  }

  // ---------- rockfall ----------
  private chandelier?: THREE.Object3D; private rocks: {rock: THREE.Object3D; ring: THREE.Mesh; id: number}[] = []; private shake = 0; private boulderSrc?: THREE.Object3D;
  private syncRocks(dt: number) {
    if (!this.boulderSrc) return;
    const ringMat = (o: number) => new THREE.MeshBasicMaterial({color: 0xff3b1f, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide});
    while (this.rocks.length < this.course.fallers.length) {const rock = this.manor && this.chandelier ? normalized(this.chandelier, 2.2, 'max') : this.night ? fireball() : normalized(this.boulderSrc, 2, 'max'); const ring = new THREE.Mesh(new THREE.RingGeometry(.82, 1, 40).rotateX(-Math.PI / 2), ringMat(.8));
      const disc = new THREE.Mesh(new THREE.CircleGeometry(1, 40).rotateX(-Math.PI / 2), ringMat(.25)); ring.add(disc); ring.renderOrder = 3; this.scene.add(rock, ring); this.rocks.push({rock, ring, id: -1});}
    this.rocks.forEach((v, i) => {const f = this.course.fallers[i]; v.rock.visible = v.ring.visible = !!f; if (!f) {v.id = -1; return;}
      if (v.id !== f.id) {v.id = f.id; v.rock.userData.done = false; v.rock.rotation.set(Math.random() * 6, Math.random() * 6, 0);}
      v.rock.position.set(f.x, f.y, f.z); v.rock.scale.setScalar(f.r); v.rock.rotation.x += dt * 4;
      const k = Math.min(1, (this.course.time - f.spawn) / (f.impact - f.spawn)); v.ring.visible = !f.landed;
      v.ring.position.set(f.x, f.g + .04, f.z); v.ring.scale.setScalar(f.r * (2.4 - 1.3 * k)); (v.ring.material as THREE.MeshBasicMaterial).opacity = .35 + .6 * k * (.6 + .4 * Math.sin(this.course.time * 30));
      if (f.landed && !v.rock.userData.done) {v.rock.userData.done = true; this.snd.thud(Math.hypot(f.x - this.me.x, f.z - this.me.z), 1.2); if (this.night) this.snd.fire(Math.hypot(f.x - this.me.x, f.z - this.me.z)); this.puff(f.x, f.g, f.z, 2.2); this.puff(f.x, f.g, f.z, 1.6);
        const d = Math.hypot(f.x - this.me.x, f.z - this.me.z); if (d < 14) {this.shake = Math.max(this.shake, .35 * (1 - d / 14)); navigator.vibrate?.(d < 5 ? 30 : 0);}}});
  }

  // ---------- atmosphere ----------
  private grassSpots: THREE.Matrix4[] = [];
  private grassOn(b: Block) {
    let seed = (Math.abs(Math.floor(b.z0 * 131 + b.x0 * 17)) % 2147483000) + 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const area = (b.x1 - b.x0) * (b.z1 - b.z0), n = Math.floor(area * (matchMedia('(pointer:coarse)').matches ? 1.2 : 2.2));
    const q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      // denser along the edges, sparse in the running lane
      let x = b.x0 + rnd() * (b.x1 - b.x0); const z = b.z0 + rnd() * (b.z1 - b.z0); const edge = Math.min(x - b.x0, b.x1 - x);
      if (edge > 2.5 && rnd() < .35) continue; if (edge < .45) x += x < (b.x0 + b.x1) / 2 ? .45 - edge : edge - .45;
      const s = .5 + rnd() * .6 + (edge < 1.5 ? .3 : 0); e.set(0, rnd() * Math.PI, 0); q.setFromEuler(e);
      this.grassSpots.push(new THREE.Matrix4().compose(v.set(x, top(b, z), z), q, sc.set(s, s * (.8 + rnd() * .5), s)));
    }
  }
  private buildGrass() {
    const c = document.createElement('canvas'); c.width = 128; c.height = 128; const x = c.getContext('2d')!;
    for (let i = 0; i < 46; i++) {const bx = 4 + Math.random() * 120, lean = (Math.random() - .5) * 34, hgt = 60 + Math.random() * 66, w = 1.4 + Math.random() * 2.2;
      const g = x.createLinearGradient(0, 128, 0, 128 - hgt); g.addColorStop(0, '#1f3310'); g.addColorStop(.55, '#5f8a2a'); g.addColorStop(1, '#c9d27a');
      x.fillStyle = g; x.beginPath(); x.moveTo(bx - w, 128); x.quadraticCurveTo(bx + lean * .4, 128 - hgt * .6, bx + lean, 128 - hgt); x.quadraticCurveTo(bx + lean * .4 + 1, 128 - hgt * .6, bx + w, 128); x.fill();}
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const quad = (r: number) => new THREE.PlaneGeometry(.75, .55).translate(0, .275, 0).rotateY(r);
    const geo = mergeGeos([quad(0), quad(Math.PI / 3), quad(-Math.PI / 3)]);
    const mat = new THREE.MeshStandardMaterial({map: t, alphaTest: .45, side: THREE.DoubleSide, roughness: .9, envMapIntensity: .6});
    mat.onBeforeCompile = sh => {sh.uniforms.uTime = {value: 0}; (mat as any).userData.shader = sh;
      sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        vec4 wp = instanceMatrix * vec4(0.,0.,0.,1.); float sway = sin(uTime*1.7 + wp.x*.35 + wp.z*.27) * .12 + sin(uTime*3.1 + wp.z*.9) * .04;
        transformed.x += sway * uv.y * uv.y; transformed.z += sway * .6 * uv.y * uv.y;`);
      sh.vertexShader = sh.vertexShader.replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n objectNormal = vec3(0.,1.,0.);');};
    this.grassMat = mat;
    const inst = new THREE.InstancedMesh(geo, mat, this.grassSpots.length); const col = new THREE.Color();
    this.grassSpots.forEach((m, i) => {inst.setMatrixAt(i, m); if (this.night) col.setHSL(.15 + Math.random() * .05, .25, .32 + Math.random() * .12); else col.setHSL(.2 + Math.random() * .07, .5, .5 + Math.random() * .2); inst.setColorAt(i, col);});
    inst.receiveShadow = true; inst.computeBoundingSphere(); this.scene.add(inst);
  }
  private atmosphere() {
    // drifting mist layers in the gorge
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!;
    for (let i = 0; i < 70; i++) {const px = Math.random() * 256, py = Math.random() * 256, r = 20 + Math.random() * 60, g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, 'rgba(255,240,230,.22)'); g.addColorStop(1, 'rgba(255,240,230,0)'); x.fillStyle = g; for (const ox of [-256, 0, 256]) for (const oy of [-256, 0, 256]) {x.save(); x.translate(ox, oy); x.fillRect(px - r, py - r, r * 2, r * 2); x.restore();}}
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 5);
    for (const [y, o] of (this.manor ? [[-4, .35]] : this.night ? [[-1.6, .35], [-.6, .22], [.6, .12]] : [[-9, .5], [-15, .65], [-22, .8], [-29, .9]]) as [number, number][]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(700, 700).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({map: t.clone(), transparent: true, opacity: o, depthWrite: false, color: this.manor ? 0x5d6f96 : this.night ? 0x9fc4d8 : 0xf2d8c8}));
      (m.material as THREE.MeshBasicMaterial).map!.repeat.set(4 + y * -.05, 4); m.position.set(0, y, 150); m.renderOrder = 2; this.mist.push(m); this.scene.add(m);}
    if (this.manor) {const pit = new THREE.Mesh(new THREE.PlaneGeometry(60, 700).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({color: 0x010102})); pit.position.set(0, -7, 200); this.scene.add(pit);}
    else if (this.night) {const swamp = new THREE.Mesh(new THREE.PlaneGeometry(400, 700).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({color: 0x0c1714, metalness: .85, roughness: .18, envMapIntensity: 1.1})); swamp.position.set(0, -2.5, 200); this.scene.add(swamp);}
    // river at the bottom of the gorge (mirrors the sunset sky)
    const river = new THREE.Mesh(new THREE.PlaneGeometry(26, 600).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({color: 0x1d2a33, metalness: .9, roughness: .12, envMapIntensity: 1.3}));
    river.position.set(-6, -33.6, 150); if (!this.night) this.scene.add(river);
    // pollen / dust motes in the light
    const n = matchMedia('(pointer:coarse)').matches ? 260 : 520, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {pos[i * 3] = (Math.random() - .5) * 40; pos[i * 3 + 1] = Math.random() * 14; pos[i * 3 + 2] = Math.random() * 50 - 10;}
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.pollen = new THREE.Points(g, new THREE.PointsMaterial({map: dotTexture(), size: this.night ? .16 : .13, color: this.manor ? 0xbfd2ff : this.night ? 0xc8ff7a : 0xffd9a0, transparent: true, opacity: .85, depthWrite: false, blending: THREE.AdditiveBlending}));
    this.pollen.frustumCulled = false; this.scene.add(this.pollen);
  }
  private animateAtmosphere(dt: number) {
    const t = this.course.time; this.mist.forEach((m, i) => {const mp = (m.material as THREE.MeshBasicMaterial).map!; mp.offset.x = t * (.004 + i * .002); mp.offset.y = t * .002 * (i % 2 ? 1 : -1);});
    const sh = (this.grassMat as any)?.userData?.shader; if (sh) sh.uniforms.uTime.value = t;
    this.pollen.position.set(this.camTarget.x, this.camTarget.y - 2, this.camTarget.z - 10);
    const p = this.pollen.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {let y = p.getY(i) + dt * (.15 + (i % 7) * .03); if (y > 14) y = 0; p.setY(i, y); p.setX(i, p.getX(i) + Math.sin(t * .6 + i) * dt * .2);}
    p.needsUpdate = true;
    for (const f of this.puffs) {if (f.t < 0) continue; f.t += dt; const k = f.t / .7; if (k >= 1) {f.t = -1; f.s.visible = false; continue;}
      f.s.scale.setScalar(f.s.userData.size * (.5 + k * 1.4)); (f.s.material as THREE.SpriteMaterial).opacity = .55 * (1 - k); f.s.position.y += dt * .5;}
  }
  private puff(x: number, y: number, z: number, size: number) {
    if (!this.puffs.length) {const tex = dotTexture(true); for (let i = 0; i < 24; i++) {const s = new THREE.Sprite(new THREE.SpriteMaterial({map: tex, color: 0xd9c3a2, transparent: true, depthWrite: false})); s.visible = false; this.scene.add(s); this.puffs.push({s, t: -1});}}
    for (let k = 0; k < 5; k++) {const f = this.puffs.find(p => p.t < 0); if (!f) return; const a = Math.random() * Math.PI * 2, r = .3 + Math.random() * .4;
      f.t = 0; f.s.visible = true; f.s.position.set(x + Math.cos(a) * r, y + .15, z + Math.sin(a) * r); f.s.userData.size = size * (.6 + Math.random() * .5);}
  }

  private prevPos = new Map<Runner, [number, number, number]>();
  private frame(t: number) {
    if (this.last && t - this.last < 11) return; // cap at 60 fps (11 ms threshold: skips every other 120 Hz tick but never a 60 Hz frame that arrives a little early): 120 Hz screens (ProMotion Mac / iPhone Pro) otherwise draw twice as much and overheat
    const dt = this.last ? Math.min(.1, (t - this.last) / 1000) : 1 / 60; this.last = t;
    this.frameAvg += (dt * 1000 - this.frameAvg) * .05;
    if (this.frameAvg > 19 && this.pixelRatio > .75) {this.pixelRatio = Math.max(.75, this.pixelRatio - .1); this.renderer.setPixelRatio(this.pixelRatio); this.frameAvg = 16;}
    this.readInput();
    if (!this.net) {
      if (this.localIntroStart < 0) this.localIntroStart = t;
      const preview = new URLSearchParams(location.search).get('introAt');
      this.intro(preview !== null ? Number(preview) : (t - this.localIntroStart) / 1000);
    }
    if (this.net) {const target = COUNTDOWN + (this.net.serverNow() - this.net.startAt) / 1000; this.intro(target + this.rulesIntro.duration); if (target < this.clock || this.clock <= 0 && target < 0) this.clock = Math.min(target, 0); this.acc = Math.max(0, Math.min(8, target - this.clock));
      if (this.acc > 2) {while (this.acc > .2) {this.acc -= STEP; this.clock += STEP; this.course.step(STEP);}}
      this.netTick(dt);}
    if (this.introT >= 0 && !this.introSkipped) {const savedTime = this.course.time; this.course.time = this.introT; this.course.step(0); this.sync(dt); this.course.time = savedTime; if (this.phoneShadows) this.renderer.shadowMap.needsUpdate = true; this.renderer.render(this.scene, this.camera); return;}
    else this.acc += dt;
    const prev = this.prevPos;
    while (this.acc >= STEP) {this.acc -= STEP; this.clock += STEP; const live = this.clock >= COUNTDOWN && !this.over();
      for (const r of this.runners) if (!(r as any).remote) prev.set(r, [r.x, r.y, r.z]);
      this.course.step(STEP);
      for (const r of this.runners) {if ((r as any).remote) continue; if (r.bot) this.course.think(r, STEP); if (!live || this.clock < 0) {r.inX = r.inZ = 0; r.jump = false;} this.course.move(r, STEP);}
      for (let i = 0; i < this.runners.length; i++) for (let j = i + 1; j < this.runners.length; j++) {const a = this.runners[i], b = this.runners[j]; if (a.hook >= 0 || b.hook >= 0) continue; const dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz), m = RR * 1.9;
        if (d < m && d > 1e-4 && Math.abs(a.y - b.y) < 1.2) {const p = (m - d) / 2; a.x -= dx / d * p; a.z -= dz / d * p; b.x += dx / d * p; b.z += dz / d * p;}}}
    if (this.headless) {this.hudT = (this.hudT || 0) + dt; if (this.hudT < 1) return; this.hudT = 0;} // autopilot bots: simulate only, draw once a second
    if (this.phoneShadows) this.renderer.shadowMap.needsUpdate = (this.frameNo++ & 1) === 0;
    // draw local runners between the last two physics steps: at 60 fps a frame holds 1-3 fixed steps, which made running look jerky
    const k = 1 - Math.min(1, this.acc / STEP), real: [Runner, number, number, number][] = [];
    for (const [r, [x, y, z]] of prev) {if (Math.abs(r.x - x) + Math.abs(r.y - y) + Math.abs(r.z - z) > 2) continue; real.push([r, r.x, r.y, r.z]); r.x -= (r.x - x) * k; r.y -= (r.y - y) * k; r.z -= (r.z - z) * k;}
    this.sync(dt); for (const [r, x, y, z] of real) {r.x = x; r.y = y; r.z = z;}
    if (this.composer) this.composer.render(); else this.renderer.render(this.scene, this.camera); this.hudUpdate();
  }

  /** remote state from the server: id -> [x,y,z,facing,anim,cp,progress,finished,finishTime,falls] */
  remote(runners: Record<string, number[]>) {const now = performance.now() / 1000;
    for (const r of this.runners) {const v = runners[r.id]; if (!v || !(r as any).remote) continue; const a = r as any, prev = a.target as number[] | undefined;
      if (prev && (prev[0] !== v[0] || prev[2] !== v[2])) {const dt = Math.max(.05, now - (a.tAt ?? now - .2)), cl = (x: number) => Math.max(-9, Math.min(9, x)); a.estVx = cl((v[0] - prev[0]) / dt); a.estVz = cl((v[2] - prev[2]) / dt); a.tAt = now;}
      else if (prev && now - (a.tAt ?? now) > .5) {a.estVx = 0; a.estVz = 0;}
      a.target = v;}}
  private sendT = 0;
  private netTick(dt: number) {
    for (const r of this.runners) {const v = (r as any).target as number[] | undefined; if (!(r as any).remote || !v) continue; const k = Math.min(1, dt * 10);
      const a = r as any; r.vx = a.estVx ?? 0; r.vz = a.estVz ?? 0;
      if (Math.hypot(v[0] - r.x, v[2] - r.z) > 6) {r.x = v[0]; r.y = v[1]; r.z = v[2];} else {r.x += (v[0] - r.x) * k; r.y += (v[1] - r.y) * k; r.z += (v[2] - r.z) * k;}
      r.facing = v[3]; r.stun = v[4] === 3 ? .3 : 0; r.ground = v[4] === 2 ? null : this.course.blocks[0]; r.vy = 0; if (v[4] === 0) {r.vx = 0; r.vz = 0;} r.checkpoint = v[5]; r.progress = v[6]; if (v[7] && !r.finished) {r.finished = true; r.finishTime = v[8];} r.falls = v[9];}
    if (this.net!.spectator) {if (!this.surv?.run) {const lead = this.standings()[0]; if (lead) this.me = lead;} return;}
    this.sendT -= dt; if (this.sendT > 0) return; this.sendT = .2; const m = this.me, anim = m.stun > 0 ? 3 : !m.ground ? 2 : Math.hypot(m.vx, m.vz) > .8 ? 1 : 0;
    this.netSends = (this.netSends || 0) + 1; this.net!.send([+m.x.toFixed(2), +m.y.toFixed(2), +m.z.toFixed(2), +m.facing.toFixed(2), anim, m.checkpoint, +m.progress.toFixed(1), m.finished ? 1 : 0, +m.finishTime.toFixed(2), m.falls], this.netSends < 6 || this.surv?.run?.needCourse ? {c: this.course.checkpoints.map((x: number) => +x.toFixed(2)), f: +this.course.finishZ.toFixed(2)} : undefined);}
  private netSends = 0;
  private readonly rulesIntro = new RaceIntro(this);
  private localIntroStart = -1;
  introT = -1; introSkipped = false;
  private intro(t: number) {
    this.introT = this.rulesIntro.update(t, this.introSkipped) ? t : -1;
  }
  over() {if (this.clock - COUNTDOWN >= this.limit) return true; return this.runners.length > 0 && this.runners.every(r => r.finished);}
  timeLeft() {return Math.max(0, this.limit - Math.max(0, this.clock - COUNTDOWN));}
  standings() {return [...this.runners].sort((a, b) => (a.finished ? 0 : 1) - (b.finished ? 0 : 1) || (a.finished ? a.finishTime - b.finishTime : b.progress - a.progress));}

  private sync(dt: number) {
    const c = this.course;
    for (const [b, m] of this.blockMeshes) {const ct = b.crumbleAt >= 0 ? c.time - b.crumbleAt : -1, shake = b.crumbles && ct >= 0 && ct < b.crumbleDelay ? Math.sin(c.time * 70) * .06 * (ct / b.crumbleDelay) : 0;
      if (m.userData.pivot) {const [px, py, pz] = m.userData.pivot; m.position.set(px + b.offX, py + b.offY, pz); m.rotation.set(-Math.atan(b.tiltZ), 0, Math.atan(b.tiltX));}
      else m.position.set(b.offX + shake, b.offY, 0); m.visible = !b.gone && !m.userData.hidden;
      if (m.userData.crack) (m.userData.crack.material as THREE.MeshBasicMaterial).opacity = ct >= 0 ? Math.min(.9, ct / b.crumbleDelay * 1.2) : 0;}
    this.syncMech(dt);
    c.sweepers.forEach((s, i) => {const m = this.sweeperMeshes[i]; m.position.set(s.x, s.y, s.z); m.rotation.y = -s.angle;});
    c.pendulums.forEach((p, i) => {this.pend[i].rotation.z = p.swing;});
    for (const g of this.rams) {const p = g.userData.p; g.position.x = p.side * (p.wallX - p.reach * p.ext + 1);}
    c.pads.forEach((p, i) => {const k = Math.max(0, 1 - (c.time - p.fired) * 4); this.padMeshes[i].position.y = p.y + .23 + k * .25; (this.padMeshes[i].material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + Math.sin(c.time * 6) * .3 + k * 3;});
    for (const [b, w] of this.warnPlanes) {w.visible = b.warn && !b.gone; (w.material as THREE.MeshBasicMaterial).opacity = .35 + .35 * Math.sin(c.time * 28);}
    for (const t of this.belts) t.offset.y = (t.offset.y + dt * .9) % 1;
    for (const {j, o, f} of this.jetFx) {if (j.kind === 'fire') {f.visible = j.state === 2; f.scale.y = .8 + Math.random() * .4; ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = j.state === 1 ? 1 + Math.sin(c.time * 30) : j.state === 2 ? 2 : 0;}
      else {const tgt = j.state === 2 ? .55 : j.state === 1 ? 3.2 : 4.2; f.position.y += (tgt - f.position.y) * Math.min(1, dt * (j.state === 2 ? 30 : 4)); ((o as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = j.state === 1 ? .5 + .4 * Math.sin(c.time * 25) : j.state === 2 ? .8 : 0;}}
    for (const gm of this.ghosts) gm.emissiveIntensity = .025 * Math.max(0, Math.sin(c.time * 1.3)) ** 8;
    this.portalFx.forEach((g, i) => {g.userData.disc.rotation.z -= dt * 2.4; const p = c.portals[i]; (g.userData.disc.material as THREE.MeshBasicMaterial).opacity = .7 + .25 * Math.sin(c.time * 5 + i) + (c.time - p.used < .4 ? .5 : 0);});
    const tp = (this.me as any).teleported; if (tp && tp !== this.lastTp) {this.lastTp = tp; this.camTarget.set(this.me.x, this.me.y, this.me.z); const pk = c.portals.find(p => c.time - p.used < .1); this.snd.portal(); this.toast(pk?.kind === 'far' ? 'ДАЛЕКО ВПЕРЁД!' : pk?.kind === 'back' ? 'НАЗАД!' : 'ТЕЛЕПОРТ!'); this.puff(this.me.x, this.me.y, this.me.z, 1.6);}
    const sec = c.sectionAt(this.me.z); if (sec && sec.name !== this.lastSection) {this.lastSection = sec.name; if (this.clock > COUNTDOWN + .5) this.toast(SECTION_NAMES[sec.name].toUpperCase());}
    this.boulderPool.forEach((o, i) => {const b = c.boulders[i]; o.visible = !!b; if (b) {o.position.set(b.x, b.y, b.z); o.rotation.order = 'YXZ'; o.rotation.y += (b.roll - o.rotation.y) * .25; o.rotation.x = b.spin; o.scale.setScalar(b.radius / 1.2 * o.userData.base);}});
    for (const [r, l] of this.looks) {
      const hs = Math.hypot(r.vx, r.vz), want = r.stun > 0 ? 'stun' : !r.ground ? 'jump' : hs > .8 ? 'run' : 'idle';
      if (want !== l.cur && l.acts[want]) {const a = l.acts[want]; a.reset().fadeIn(.06).play(); l.acts[l.cur]?.fadeOut(.06); l.cur = want;}
      if (l.acts.run) l.acts.run.timeScale = Math.max(.6, hs / 5.5);
      if (r === this.me && r.ground && l.prevVy < -4) this.snd.land(Math.min(1, -l.prevVy / 14));
      if (r === this.me && !r.ground && l.prevVy <= .5 && r.vy > 8) {if (r.vy > 12) this.snd.spring(); else this.snd.jump();}
      if (r.ground && l.prevVy < -6) {l.squash = Math.min(.3, -l.prevVy * .022); this.puff(r.x, r.y, r.z, Math.min(1.4, -l.prevVy / 9));}
      if (!r.ground && l.prevVy <= .5 && r.vy > 8) this.puff(r.x, r.y, r.z, .6); l.prevVy = r.vy; l.squash = Math.max(0, l.squash - dt * 2.2);
      const sy = 1 - l.squash, sxz = 1 / Math.sqrt(sy), ghost = r.character === 'ghost' ? .25 + Math.sin(c.time * 3 + r.slot) * .08 : 0;
      l.root.position.set(r.x, r.y + ghost, r.z); l.root.scale.set(sxz, sy, sxz);
      const yaw = r.facing; let d = yaw - l.root.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); l.root.rotation.y += d * Math.min(1, dt * 22);
      l.mixer.update(dt);
      const bl = this.blobs.get(r); if (bl) {let gy = -99; for (const b of c.blocks) if (!b.gone && r.x >= b.x0 + b.offX && r.x <= b.x1 + b.offX && r.z >= b.z0 && r.z <= b.z1 && top(b, r.z) <= r.y + .05) gy = Math.max(gy, top(b, r.z)); bl.visible = gy > -50; const hgt = r.y - gy; bl.position.set(r.x, gy + .03, r.z); bl.scale.setScalar(Math.max(.4, 1 - hgt * .12)); (bl.material as THREE.MeshBasicMaterial).opacity = Math.max(.15, .55 - hgt * .06);}
    }
    // camera: behind and above the player, framed wider in portrait
    if (this.introT >= 0 && !this.introSkipped) {
      this.rulesIntro.camera(this.introT);
      this.sun.position.copy(this.camera.position).addScaledVector(SUN_DIR, 70); this.sun.target.position.set(0, this.camera.position.y - 3, this.camera.position.z + 8);
      this.animateAtmosphere(dt); return;}
    const me = this.me, portrait = this.camera.aspect < 1, k = Math.min(1, dt * 5);
    this.camTarget.x += (me.x * .75 - this.camTarget.x) * k; this.camTarget.z += (me.z - this.camTarget.z) * k; this.camTarget.y += (Math.max(me.y, -4) - this.camTarget.y) * Math.min(1, dt * 2.5);
    const back = this.manor ? (portrait ? 9 : 7.4) : portrait ? 11 : 8.6, up = this.manor ? (portrait ? 6 : 4.4) : portrait ? 7.2 : 5.4;
    const inMaze = this.course.mazePaths.some(m => me.z > m.box[2] - 2 && me.z < m.box[3]) || this.course.fakeWalls.some(f => me.z > f.z - 6 && me.z < f.z + 3); this.mazeBlend += ((inMaze ? 1 : 0) - this.mazeBlend) * Math.min(1, dt * 2.5);
    const mb = this.mazeBlend, back2 = back + (4.6 - back) * mb, up2 = up + (7.4 - up) * mb;
    this.camera.position.set(this.camTarget.x, this.camTarget.y + up2, this.camTarget.z - back2);
    if (this.manor) {const cz = this.camera.position.z, rm = this.course.rooms.find(r => cz >= r.z0 && cz <= r.z1) ?? this.course.rooms.find(r => this.camTarget.z >= r.z0 && this.camTarget.z <= r.z1); if (rm) {const lim = rm.halfW - 1.1; this.camera.position.x = Math.max(-lim, Math.min(lim, this.camera.position.x)); this.camera.position.y = Math.min(this.camera.position.y, rm.y + rm.h - .8 + 4 * this.mazeBlend);}} this.camera.lookAt(this.camTarget.x, this.camTarget.y + 1.3, this.camTarget.z + 7);
    // never let geometry hide the runner: walls between camera and player turn see-through, other blocks lift the camera
    {const head = new THREE.Vector3(me.x, me.y + 1.1, me.z);
      for (const m of this.faded) {const mats = m.material as THREE.Material[]; mats.forEach(x => {(x as any).opacity = Math.min(1, (x as any).opacity + dt * 4); if ((x as any).opacity >= 1) x.transparent = false;});}
      for (let pass = 0; pass < 3; pass++) {const dir = this.camera.position.clone().sub(head), dist = dir.length(); dir.normalize(); this.ray.set(head, dir); this.ray.far = dist;
        for (const f of this.soft) {const hz = Math.abs(f.position.z - me.z) < 1 ? 0 : 1; const fd = this.camera.position.z < f.position.z && me.z > f.position.z - .5 ? .15 : 1; const mt = f.material as THREE.MeshStandardMaterial; mt.transparent = true; mt.opacity += (fd - mt.opacity) * Math.min(1, dt * 8); void hz;}
        const occ: THREE.Mesh[] = []; for (const [b, m] of this.blockMeshes) if (m.visible && Math.abs((b.z0 + b.z1) / 2 - me.z) < 30) occ.push(m);
        const hit = this.ray.intersectObjects(occ, false)[0]; if (!hit) break; const mesh = hit.object as THREE.Mesh, blk = [...this.blockMeshes].find(([, m]) => m === mesh)?.[0];
        if (blk?.wall) {if (!(mesh.material as any).__own) {mesh.material = (mesh.material as THREE.Material[]).map(x => x.clone()); (mesh.material as any).__own = true;}
          (mesh.material as THREE.Material[]).forEach(x => {x.transparent = true; (x as any).opacity = .18; x.depthWrite = false;}); this.faded.add(mesh); occ.splice(occ.indexOf(mesh), 1);
          this.ray.intersectObjects(occ, false); if (!this.ray.intersectObjects(occ, false).length) break; continue;}
        this.camera.position.y += 2.5; this.camera.lookAt(me.x, me.y + 1.2, me.z + 5);}}
    this.sun.target.position.set(this.camTarget.x, this.camTarget.y, this.camTarget.z + 8);
    const sd = this.manor ? SKY_DIR : this.night ? MOON_DIR : SUN_DIR; this.sun.position.set(this.camTarget.x + sd.x * 70, this.camTarget.y + sd.y * 70, this.camTarget.z + 8 + sd.z * 70);
    this.fill.position.copy(this.camera.position); this.fill.target.position.set(this.camTarget.x, this.camTarget.y, this.camTarget.z);
    this.animateAtmosphere(dt); this.syncRocks(dt);
    if (this.surv && this.net) {const now = this.net.serverNow(); this.surv.tick(dt, now, (now - this.net.startAt) / 1000);}
    if (this.moonGlow) this.moonGlow.position.copy(this.camera.position).addScaledVector(MOON_DIR, 400);
    if (this.sunGlow) {const sp = this.camera.position.clone().addScaledVector(SUN_DIR, 420); this.sunGlow.position.copy(sp);
      this.rays.forEach((r, i) => {r.position.copy(this.camera.position).addScaledVector(SUN_DIR, 300); r.lookAt(this.camera.position); r.rotateZ(-.5 + i * .25 + Math.sin(this.course.time * .1 + i) * .03); r.translateY(-120);});}
    for (const s of this.swingers) s.rotation.z = Math.sin(this.course.time * .8 + s.userData.sway) * .05;
    this.flames.forEach((f, i) => f.scale.setScalar(1.8 + Math.sin(this.course.time * 13 + i * 1.7) * .12 + Math.sin(this.course.time * 7.3 + i) * .08));
    if (this.me.checkpoint > this.lastCp) {for (let i = this.lastCp + 1; i <= this.me.checkpoint; i++) {const a = this.cpArches[i - 1]; if (a && !a.lit) {a.lit = true; (a.flag.material as THREE.MeshStandardMaterial).emissive.set(0xffb238); (a.glow.material as THREE.MeshBasicMaterial).color.set(0xffc455); this.toast('ЧЕКПОИНТ!'); this.snd.checkpoint(); this.puff(this.me.x, this.me.y, this.me.z, 1.4); navigator.vibrate?.(20);}} this.lastCp = this.me.checkpoint;}
    for (const a of this.cpArches) {const m = a.glow.material as THREE.MeshBasicMaterial; m.opacity = (a.lit ? .55 : .35) + Math.sin(this.course.time * 3) * .12;}
    if (this.shake > 0) {this.shake = Math.max(0, this.shake - dt * 1.2); const a = this.shake * this.shake * 1.4; this.camera.position.x += (Math.random() - .5) * a; this.camera.position.y += (Math.random() - .5) * a;}
  }

  private hudUpdate() {
    const w = innerWidth, h = innerHeight, v = new THREE.Vector3();
    // name tags: nearest first, shrink + fade with distance, hidden far away, never stacked on top of each other
    const cam = this.camera.position, items: {l: any; x: number; y: number; d: number; me: boolean}[] = [];
    for (const [r, l] of this.looks) {const d = Math.hypot(r.x - cam.x, r.y - cam.y, r.z - cam.z), me = r === this.me; v.set(r.x, r.y + H + .45, r.z).project(this.camera);
      if (v.z >= 1 || Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05 || (!me && d > 34)) {if (l.tag.style.display !== 'none') l.tag.style.display = 'none'; continue;}
      items.push({l, x: (v.x * .5 + .5) * w, y: (-v.y * .5 + .5) * h, d, me});}
    items.sort((a, b) => (b.me ? 1 : 0) - (a.me ? 1 : 0) || a.d - b.d); const placed: [number, number, number, number][] = [];
    for (const it of items) {const k = Math.max(.62, Math.min(1, 14 / it.d)), tw = (it.l.tagW ??= it.l.tag.offsetWidth || 60) * k, th = 22 * k;
      const box: [number, number, number, number] = [it.x - tw / 2, it.y - th, it.x + tw / 2, it.y];
      const hit = !it.me && placed.some(p => box[0] < p[2] && box[2] > p[0] && box[1] < p[3] && box[3] > p[1]);
      if (hit) {if (it.l.tag.style.display !== 'none') it.l.tag.style.display = 'none'; continue;} placed.push(box);
      if (it.l.tag.style.display === 'none') it.l.tag.style.display = '';
      const op = it.me ? '1' : (Math.round(Math.max(.35, Math.min(1, 1.6 - it.d / 26)) * 10) / 10).toString(); if (it.l.tagO !== op) {it.l.tagO = op; it.l.tag.style.opacity = op;}
      const tr = `translate(${Math.round(it.x)}px,${Math.round(it.y)}px) translate(-50%,-100%) scale(${k.toFixed(2)})`; if (it.l.tagT !== tr) {it.l.tagT = tr; it.l.tag.style.transform = tr;}}
    const t = this.timeLeft(); setText('timer', `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`);
    document.getElementById('timer')!.classList.toggle('low', t < 20 && this.clock > COUNTDOWN);
    const n = Math.ceil(COUNTDOWN - .5 - this.clock); if (this.clock < COUNTDOWN + .3 && n !== this.sndState.count) {this.sndState.count = n; if (n >= 0 && n <= 3) this.snd.countdown(n <= 0);}
    setText('count', this.clock >= 0 && this.clock < COUNTDOWN ? (n > 0 ? String(n) : 'ВПЕРЁД!') : this.clock < 0 && this.introSkipped ? 'ЖДЁМ СТАРТА…' : '');
    const st = this.standings(), place = st.indexOf(this.me) + 1; setText('place-n', String(place)); setText('place-of', `/${st.length}`);
    document.getElementById('place')!.dataset.p = String(Math.min(place, 4));
    // progress track: every runner as a portrait dot
    if (!this.dots.size) {const track = document.getElementById('track')!; for (const r of this.runners) {const d = document.createElement('i'); d.className = r === this.me ? 'me' : ''; d.style.backgroundImage = `url(portraits/${r.character}.png)`; track.appendChild(d); this.dots.set(r, d);}}
    for (const [r, d] of this.dots) {const f = r.finished ? 1 : Math.min(1, Math.max(0, r.z / this.course.finishZ)); d.style.left = `${f * 100}%`; d.style.zIndex = r === this.me ? '9' : String(Math.round(f * 8));}
    (document.getElementById('fill') as HTMLElement).style.width = `${Math.min(1, Math.max(0, this.me.z / this.course.finishZ)) * 100}%`;
    // mini leaderboard: top 3 (+ you)
    const rows = st.slice(0, 3); if (!rows.includes(this.me)) rows.push(this.me);
    const html = rows.map(r => `<li class="${r === this.me ? 'me' : ''}"><b>${st.indexOf(r) + 1}</b><img src="portraits/${r.character}.png" alt="">${r.name}${r.finished ? ' ✓' : ''}</li>`).join('');
    const lb = document.getElementById('board')!; if (lb.dataset.h !== html) {lb.dataset.h = html; lb.innerHTML = html;}
    const res = document.getElementById('results')!;
    const runDone = this.surv?.run ? this.surv.run.ended : (this.me.finished || this.over());
    if (runDone && res.hidden) {res.hidden = false; this.snd.finish(this.me.finished && st.indexOf(this.me) < 3);
      const R = this.surv?.run, label = (r: Runner) => {const p = R?.players[r.id]; if (!p) return ''; return p.status === 'SAVED' ? (p.revived ? 'воскрес и выжил' : 'выжил') : p.status === 'DEAD' ? 'погиб' : p.revived ? 'воскрес' : 'призрак';};
      const res2 = (r: Runner) => R ? label(r) : r.finished ? (r.finishTime - COUNTDOWN).toFixed(1) + ' с' : Math.round(Math.min(1, r.progress / this.course.finishZ) * 100) + '%';
      const img = (r: Runner) => `portraits/${r.character}.png`, pod = [st[1], st[0], st[2]];
      (res.querySelector('.podium') as HTMLElement).innerHTML = pod.map((r, i) => r ? `<div class="step s${[2, 1, 3][i]}${r === this.me ? ' me' : ''}"><img src="${img(r)}" alt=""><b>${r.name}</b><small>${res2(r)}</small><div class="block">${[2, 1, 3][i]}</div></div>` : '<div class="step empty"></div>').join('');
      res.querySelector('ol')!.innerHTML = st.slice(3).map((r, i) => `<li class="${r === this.me ? 'me' : ''}"><em>${i + 4}</em>${r.name}<span>${res2(r)}${r.falls ? ` · падений ${r.falls}` : ''}</span></li>`).join('');
      const myPlace = st.indexOf(this.me) + 1; if (R) {
        const order = (r: Runner) => {const p = R.players[r.id]; return p?.status === 'SAVED' ? 0 : p?.alive ? 1 : p?.status === 'DEAD' ? 2 : 3;};
        (res.querySelector('.podium') as HTMLElement).innerHTML = [...this.runners].sort((x, y) => order(x) - order(y)).map(r => {const p = R.players[r.id] ?? {}, cls = p.status === 'SAVED' ? 'ok' : p.status === 'DEAD' ? 'dead' : 'ghost';
          return `<div class="fate ${cls}${r === this.me ? ' me' : ''}"><img src="${img(r)}" alt=""><b>${r.name}</b><small>${label(r)}</small></div>`;}).join('');
        res.querySelector('ol')!.innerHTML = '';const mp = R.players[this.me.id]; setText('verdict', this.net?.spectator ? 'ИТОГИ ИСПЫТАНИЯ' : mp?.status === 'SAVED' ? 'ТЫ ВЫЖИЛ!' : mp?.alive === false ? 'ТЫ ПРИЗРАК' : 'ИТОГИ'); if (mp?.status === 'SAVED' || this.net?.spectator) confetti(); document.body.classList.add('done'); return;}
      setText('verdict', this.net?.spectator ? 'ИТОГИ ЗАБЕГА' : this.me.finished ? (myPlace === 1 ? 'ПОБЕДА!' : `ФИНИШ · ${myPlace} МЕСТО`) : 'ВРЕМЯ ВЫШЛО');
      document.body.classList.add('done'); if (myPlace <= 3 || this.net?.spectator) confetti();}
  }

  private input() {
    const unlock = () => {this.snd.unlock(); this.snd.ambience(this.course.theme); this.snd.playMusic('audio/music.m4a');};
    const mute = document.getElementById('mute'); if (mute) {let m = false; try {m = localStorage.getItem('race-mute') === '1';} catch {} this.snd.setMuted(m); mute.textContent = m ? '🔇' : '🔊';
      mute.addEventListener('pointerdown', e => {e.stopPropagation(); m = !m; this.snd.setMuted(m); mute.textContent = m ? '🔇' : '🔊'; try {localStorage.setItem('race-mute', m ? '1' : '0');} catch {}});} addEventListener('pointerdown', unlock); addEventListener('keydown', unlock);
    addEventListener('keydown', e => {if (this.net?.spectator && /^Digit[0-9]$/.test(e.code)) this.surv?.key(e.code.slice(5)); this.keys.add(e.code); if (e.code === 'Space') {this.me && (this.me.jump = true); e.preventDefault();}});
    addEventListener('keyup', e => this.keys.delete(e.code));
    const zone = document.getElementById('stick-zone')!, knob = document.getElementById('knob')!, base = document.getElementById('stick')!, jump = document.getElementById('jump')!;
    zone.addEventListener('pointerdown', e => {this.stick = {id: e.pointerId, ox: e.clientX, oy: e.clientY, x: 0, y: 0}; base.style.display = 'block'; base.style.left = e.clientX + 'px'; base.style.top = e.clientY + 'px'; knob.style.transform = ''; zone.setPointerCapture(e.pointerId);});
    zone.addEventListener('pointermove', e => {if (e.pointerId !== this.stick.id) return; let dx = e.clientX - this.stick.ox, dy = e.clientY - this.stick.oy; const l = Math.hypot(dx, dy), m = 56; if (l > m) {dx *= m / l; dy *= m / l;}
      this.stick.x = dx / m; this.stick.y = dy / m; knob.style.transform = `translate(${dx}px,${dy}px)`;});
    const end = (e: PointerEvent) => {if (e.pointerId !== this.stick.id) return; this.stick.id = -1; this.stick.x = this.stick.y = 0; base.style.display = 'none';};
    zone.addEventListener('pointerup', end); zone.addEventListener('pointercancel', end);
    jump.addEventListener('pointerdown', e => {e.preventDefault(); if (this.me) {this.me.jump = true; this.me.holdJump = true;} jump.classList.add('down'); navigator.vibrate?.(8);});
    const up = () => {if (this.me) this.me.holdJump = false; jump.classList.remove('down');}; jump.addEventListener('pointerup', up); jump.addEventListener('pointercancel', up);
  }
  private readInput() {
    if (!this.me) return; const k = this.keys;
    let x = (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0) - (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0), z = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    if (this.stick.id >= 0) {x = -this.stick.x; z = -this.stick.y;}
    this.me.inX = x; this.me.inZ = z; if (k.has('Space')) this.me.holdJump = true; else if (this.stick.id < 0 && !document.getElementById('jump')!.classList.contains('down')) this.me.holdJump = false;
  }

  private resize() {const w = innerWidth, h = innerHeight; this.renderer.setSize(w, h); this.composer?.setSize(w, h); this.camera.aspect = w / h; this.camera.fov = w < h ? 70 : 58; this.camera.updateProjectionMatrix();}
  private model(url: string) {let p = this.cache.get(url); if (!p) {p = this.gltf.loadAsync(url); this.cache.set(url, p);} return p;}
  private tex(url: string, repeat = true, color = true) {const t = this.texLoader.load(url); if (color) t.colorSpace = THREE.SRGBColorSpace; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t;}
  private shadedCache = new Map<THREE.Material, THREE.Material>();
  /** Same material, darkened towards the abyss through the block's vertex colours (only block cliff faces carry them). */
  private shaded(m: THREE.Material) {let c = this.shadedCache.get(m); if (!c) {c = (m as THREE.MeshStandardMaterial).clone(); (c as THREE.MeshStandardMaterial).vertexColors = true; this.shadedCache.set(m, c);} return c;}
  private mat(name: string, _tile: number, shade = false, tint = 0xffffff) {
    const arm = this.tex(`tex/${name}/arm.jpg`, true, false);
    return new THREE.MeshStandardMaterial({map: this.tex(`tex/${name}/diffuse.jpg`), normalMap: this.tex(`tex/${name}/nor_gl.jpg`, true, false), roughnessMap: arm, roughness: 1, metalness: 0, vertexColors: false, envMapIntensity: .8, color: tint});
  }
}

/** Box/ramp with world-scaled UVs: group 0 = walking face, group 1 = cliff faces. */
function blockGeometry(b: Block) {
  const tops: number[][] = [], sides: number[][] = []; // [x,y,z,nx,ny,nz,u,v,shade] per vertex, 4 per quad
  const tile = b.mat === 'plank' ? 2.2 : 3.2, st = 4, {x0, x1, z0, z1, y0, y1, bottom: bt} = b, drop = Math.max(.01, (Math.max(y0, y1) - bt));
  const shade = (y: number) => b.mat === 'plank' ? 1 : .18 + .82 * Math.pow(Math.max(0, Math.min(1, (y - bt) / drop)), 2.2);
  const quad = (into: number[][], p: number[][], n: number[], tl: number, mode: 'xz' | 'zy' | 'xy', lit = true) => {
    for (const q of p) into.push([q[0], q[1], q[2], n[0], n[1], n[2], mode === 'xz' ? q[0] / tl : mode === 'zy' ? q[2] / tl : q[0] / tl, mode === 'xz' ? q[2] / tl : q[1] / tl, lit ? 1 : shade(q[1])]);};
  const ny = 1, nz = -(y1 - y0) / (z1 - z0), l = Math.hypot(ny, nz);
  quad(tops, [[x0, y0, z0], [x0, y1, z1], [x1, y1, z1], [x1, y0, z0]], [0, ny / l, nz / l], tile, 'xz');
  quad(sides, [[x0, bt, z0], [x0, y0, z0], [x1, y0, z0], [x1, bt, z0]], [0, 0, -1], st, 'xy', false);
  quad(sides, [[x1, bt, z1], [x1, y1, z1], [x0, y1, z1], [x0, bt, z1]], [0, 0, 1], st, 'xy', false);
  quad(sides, [[x0, bt, z1], [x0, y1, z1], [x0, y0, z0], [x0, bt, z0]], [-1, 0, 0], st, 'zy', false);
  quad(sides, [[x1, bt, z0], [x1, y0, z0], [x1, y1, z1], [x1, bt, z1]], [1, 0, 0], st, 'zy', false);
  if (b.mat === 'plank' || b.crumbles) quad(sides, [[x0, bt, z0], [x1, bt, z0], [x1, bt, z1], [x0, bt, z1]], [0, -1, 0], st, 'xz', false);
  if (b.mat === 'grass') { // turf lip hanging over the cliff edge
    const d = .32, o = .03;
    quad(tops, [[x0 - o, y0 - d, z0 - o], [x0 - o, y0, z0 - o], [x1 + o, y0, z0 - o], [x1 + o, y0 - d, z0 - o]], [0, 0, -1], tile, 'xy');
    quad(tops, [[x0 - o, y1 - d, z1 + o], [x0 - o, y0 - d, z0 - o], [x0 - o, y0, z0 - o], [x0 - o, y1, z1 + o]].map((q, i) => i === 0 ? q : i === 1 ? q : q) && [[x0 - o, y0 - d, z1 + o], [x0 - o, y1, z1 + o], [x0 - o, y0, z0 - o], [x0 - o, y0 - d, z0 - o]], [-1, 0, 0], tile, 'zy');
    quad(tops, [[x1 + o, y0 - d, z0 - o], [x1 + o, y0, z0 - o], [x1 + o, y1, z1 + o], [x1 + o, y1 - d, z1 + o]], [1, 0, 0], tile, 'zy');
  }
  const all = [...tops, ...sides], g = new THREE.BufferGeometry(), idx: number[] = [];
  for (let qd = 0; qd < all.length / 4; qd++) {const b0 = qd * 4; idx.push(b0, b0 + 1, b0 + 2, b0, b0 + 2, b0 + 3);}
  g.setAttribute('position', new THREE.Float32BufferAttribute(all.flatMap(v => v.slice(0, 3)), 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(all.flatMap(v => v.slice(3, 6)), 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(all.flatMap(v => v.slice(6, 8)), 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(all.flatMap(v => [v[8], v[8], v[8]]), 3));
  g.setIndex(idx); g.addGroup(0, tops.length / 4 * 6, 0); g.addGroup(tops.length / 4 * 6, sides.length / 4 * 6, 1); return g;
}
function worldUV(g: THREE.BufferGeometry, tile: number, _m: 'xz') {const p = g.getAttribute('position'), uv = g.getAttribute('uv'); for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / tile, p.getZ(i) / tile); uv.needsUpdate = true;}
/** Clone a glTF scene scaled so its height (or largest side) = size, feet at origin, centred. */
function normalized(src: THREE.Object3D, size: number, by: 'height' | 'max') {
  const box = new THREE.Box3().setFromObject(src), s = new THREE.Vector3(); box.getSize(s); const k = size / Math.max(.001, by === 'height' ? s.y : Math.max(s.x, s.y, s.z));
  const inner = src.clone(true); inner.position.set(-(box.min.x + box.max.x) / 2 * k, by === 'height' ? -box.min.y * k : -(box.min.y + box.max.y) / 2 * k, -(box.min.z + box.max.z) / 2 * k); inner.scale.setScalar(k);
  const outer = new THREE.Group(); outer.add(inner); outer.userData.base = 1; inner.traverse(o => {if ((o as THREE.Mesh).isMesh) {o.castShadow = true; o.receiveShadow = true;}}); return outer;
}
function bannerTexture(word = 'ФИНИШ') {const c = document.createElement('canvas'); c.width = 1024; c.height = 136; const x = c.getContext('2d')!;
  x.fillStyle = '#7a0f0b'; x.fillRect(0, 0, 1024, 136); for (let i = 0; i < 32; i++) {x.fillStyle = i % 2 ? '#f2eadc' : '#111'; x.fillRect(i * 32, 0, 32, 16); x.fillStyle = i % 2 ? '#111' : '#f2eadc'; x.fillRect(i * 32, 120, 32, 16);}
  x.fillStyle = '#f6e7c8'; x.font = 'bold 76px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(word, 512, 70);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;}
function setText(id: string, s: string) {const e = document.getElementById(id); if (e && e.textContent !== s) e.textContent = s;}

const SUN_DIR = new THREE.Vector3(.31, .32, .9).normalize();
function loaded(t: THREE.Texture): Promise<THREE.Texture> {return new Promise(r => {if ((t.image as any)?.complete) r(t); else {const img = t.image as any; const chk = () => (t.image as any)?.complete ? r(t) : setTimeout(chk, 30); chk();}});}
function dotTexture(soft = false) {const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d')!; const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(soft ? .5 : .25, `rgba(255,255,255,${soft ? .45 : .5})`); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);}
function mergeGeos(list: THREE.BufferGeometry[]) {const pos: number[] = [], nor: number[] = [], uv: number[] = [], idx: number[] = []; let off = 0;
  for (const g of list) {const p = g.getAttribute('position'), n = g.getAttribute('normal'), u = g.getAttribute('uv'), ix = g.getIndex()!;
    for (let i = 0; i < p.count; i++) {pos.push(p.getX(i), p.getY(i), p.getZ(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); uv.push(u.getX(i), u.getY(i));}
    for (let i = 0; i < ix.count; i++) idx.push(ix.getX(i) + off); off += p.count;}
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); return g;}

const MOON_DIR = new THREE.Vector3(.81, .3, .59).normalize();
/** Rusty scythe blade on a chain end: crescent extruded thin, edge facing the runners' path. */
function scythe() {
  const sh = new THREE.Shape(); sh.moveTo(-1.6, 0); sh.quadraticCurveTo(0, -1.25, 1.6, 0); sh.quadraticCurveTo(0, -.55, -1.6, 0);
  const geo = new THREE.ExtrudeGeometry(sh, {depth: .06, bevelEnabled: true, bevelThickness: .02, bevelSize: .03, bevelSegments: 1, curveSegments: 18}); geo.translate(0, .1, -.03);
  const blade = new THREE.Mesh(geo, metalMat('metal_plate_02', 0xcfd3d8, .5));
  const hub = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .3), new THREE.MeshStandardMaterial({color: 0x2a2420, metalness: .6, roughness: .6})); hub.position.y = .25;
  const g = new THREE.Group(); g.add(blade, hub); blade.castShadow = true; g.userData.base = 1; return g;
}
function fireball() {
  const g = new THREE.Group(); const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.85, 1), new THREE.MeshStandardMaterial({color: 0x301008, emissive: 0xff6a1a, emissiveIntensity: 2.4, roughness: .9}));
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0xff7a2a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending})); halo.scale.setScalar(3.4);
  const trail = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0xff3a10, transparent: true, opacity: .6, depthWrite: false, blending: THREE.AdditiveBlending})); trail.scale.set(1.8, 4.5, 1); trail.position.y = 1.9;
  g.add(core, halo, trail); g.userData.base = 1; return g;
}
function flagTexture() {const c = document.createElement('canvas'); c.width = 512; c.height = 64; const x = c.getContext('2d')!;
  for (let i = 0; i < 16; i++) {x.fillStyle = i % 2 ? '#f2eadc' : '#1a1410'; x.fillRect(i * 32, 0, 32, 10); x.fillStyle = i % 2 ? '#1a1410' : '#f2eadc'; x.fillRect(i * 32, 54, 32, 10);}
  x.fillStyle = '#2a7fb0'; x.fillRect(0, 10, 512, 44); x.fillStyle = '#f6e7c8'; x.font = 'bold 32px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('ЧЕКПОИНТ', 256, 33);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;}

const SKY_DIR = new THREE.Vector3(-.18, 1, .32).normalize();
/** Hang an object (feet at origin) so its centre sits on the pendulum bob. */
function hanging(o: THREE.Object3D, half: number) {const g = new THREE.Group(); o.position.y = -half; g.add(o); g.userData.base = 1; return g;}
/** Barrel lying on its side, rolling about X. */
function rolling(o: THREE.Object3D) {const g = new THREE.Group(); o.rotation.z = Math.PI / 2; g.add(o); g.userData.base = o.userData.base; return g;}
function shaftTexture() {const c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d')!;
  const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 256);
  const h = x.createLinearGradient(0, 0, 64, 0); h.addColorStop(0, 'rgba(0,0,0,1)'); h.addColorStop(.25, 'rgba(0,0,0,0)'); h.addColorStop(.75, 'rgba(0,0,0,0)'); h.addColorStop(1, 'rgba(0,0,0,1)');
  x.globalCompositeOperation = 'destination-out'; x.fillStyle = h; x.fillRect(0, 0, 64, 256); return new THREE.CanvasTexture(c);}

/** Iron mace ball with spikes. */
function spikedBall() {const g = new THREE.Group(), m = metalMat('rusty_metal_02', 0x9a9a9a, .5);
  const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(.85, 2), m); ball.castShadow = true; g.add(ball);
  const ico = new THREE.IcosahedronGeometry(1, 1), pos = ico.getAttribute('position'), seen = new Set<string>();
  for (let i = 0; i < pos.count; i++) {const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize(), key = v.toArray().map(x => x.toFixed(2)).join(); if (seen.has(key)) continue; seen.add(key);
    const sp = new THREE.Mesh(new THREE.ConeGeometry(.13, .55, 8), m); sp.position.copy(v.clone().multiplyScalar(1.02)); sp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v); g.add(sp);}
  const cap = new THREE.Mesh(new THREE.TorusGeometry(.2, .06, 6, 12), m); cap.position.y = .95; g.add(cap); g.userData.base = 1; return bake(g);}
function padTexture() {const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!; x.fillStyle = '#3a1a08'; x.fillRect(0, 0, 128, 128);
  x.strokeStyle = '#ffcf5a'; x.lineWidth = 8; for (const r of [56, 38]) {x.beginPath(); x.arc(64, 64, r, 0, 7); x.stroke();}
  x.fillStyle = '#ffe08a'; x.beginPath(); x.moveTo(64, 26); x.lineTo(90, 64); x.lineTo(74, 64); x.lineTo(74, 100); x.lineTo(54, 100); x.lineTo(54, 64); x.lineTo(38, 64); x.closePath(); x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.center.set(.5, .5); t.rotation = Math.PI; return t;}

/** Wrought-iron birdcage the exhibits were kept in: ring base, bars, domed top with a hook; open=true leaves the door swung out. */
function ironCage(open = false) {
  const g = new THREE.Group(), iron = metalMat('rusty_metal_02', 0x8c8c8c, .3), rust = metalMat('rusty_metal_02', 0xffffff, .6);
  const R = .85, Hh = 1.7, bars = 18;
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 1.02, .12, 28), rust); floor.position.y = .06; g.add(floor);
  for (const y of [.12, .9, Hh]) {const ring = new THREE.Mesh(new THREE.TorusGeometry(R, .045, 8, 40).rotateX(Math.PI / 2), iron); ring.position.y = y; g.add(ring);}
  const barGeo = new THREE.CylinderGeometry(.025, .025, Hh - .12, 6);
  for (let i = 0; i < bars; i++) {const a = i / bars * Math.PI * 2; if (open && i >= 2 && i <= 4) continue; const b = new THREE.Mesh(barGeo, iron); b.position.set(Math.cos(a) * R, (Hh + .12) / 2, Math.sin(a) * R); b.castShadow = true; g.add(b);}
  for (let i = 0; i < bars / 2; i++) {const a = i / (bars / 2) * Math.PI; const arc = new THREE.Mesh(new THREE.TorusGeometry(R, .025, 6, 24, Math.PI), iron); arc.position.y = Hh; arc.rotation.y = a; g.add(arc);}
  const hook = new THREE.Mesh(new THREE.TorusGeometry(.13, .035, 8, 16), iron); hook.position.y = Hh + R + .12; g.add(hook);
  if (open) {const door = new THREE.Group(); for (let i = 0; i < 3; i++) {const b = new THREE.Mesh(barGeo, iron); b.position.set(i * .26, (Hh + .12) / 2, 0); door.add(b);} door.position.set(Math.cos(2 / bars * Math.PI * 2) * R, 0, Math.sin(2 / bars * Math.PI * 2) * R); door.rotation.y = -1.6; g.add(door);}
  g.traverse(o => {if ((o as THREE.Mesh).isMesh) {o.castShadow = true; o.receiveShadow = true;}}); return bake(g);
}

function aoTexture() {const c = document.createElement('canvas'); c.width = 4; c.height = 64; const x = c.getContext('2d')!; const g = x.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.75)'); x.fillStyle = g; x.fillRect(0, 0, 4, 64); return new THREE.CanvasTexture(c);}

function swirlTexture() {const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!; x.translate(128, 128);
  for (let i = 0; i < 900; i++) {const t = i / 900, a = t * Math.PI * 14, r = t * 120; x.fillStyle = `rgba(255,255,255,${.6 * (1 - t) + .1})`; x.beginPath(); x.arc(Math.cos(a) * r, Math.sin(a) * r, 2 + t * 7, 0, 7); x.fill();}
  const g = x.createRadialGradient(0, 0, 0, 0, 0, 128); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(.3, 'rgba(255,255,255,.2)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(-128, -128, 256, 256);
  return new THREE.CanvasTexture(c);}

function crackTexture() {const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!; x.strokeStyle = '#000'; x.lineCap = 'round';
  for (let k = 0; k < 7; k++) {let px = 128 + (Math.random() - .5) * 30, py = 128 + (Math.random() - .5) * 30; x.lineWidth = 4; x.beginPath(); x.moveTo(px, py);
    const a = Math.random() * 6.28; for (let i = 0; i < 8; i++) {px += Math.cos(a + (Math.random() - .5) * 1.2) * 18; py += Math.sin(a + (Math.random() - .5) * 1.2) * 18; x.lineTo(px, py); x.lineWidth = Math.max(1, 4 - i * .4);} x.stroke();}
  return new THREE.CanvasTexture(c);}

/** Realistic PBR metal from Poly Haven scans (shared, cached): plate steel, rusty iron, rusty grate. */
const _metal = new Map<string, THREE.MeshStandardMaterial>();
function metalMat(name: 'metal_plate_02' | 'rusty_metal_02' | 'metal_grate_rusty', tint = 0xffffff, repeat = 1) {
  const key = name + tint + repeat; let m = _metal.get(key); if (m) return m;
  const L = new THREE.TextureLoader(), t = (f: string, srgb = false) => {const x = L.load(`tex/${name}/${f}.jpg`); x.wrapS = x.wrapT = THREE.RepeatWrapping; x.repeat.set(repeat, repeat); x.anisotropy = 4; if (srgb) x.colorSpace = THREE.SRGBColorSpace; return x;};
  const arm = t('arm'); m = new THREE.MeshStandardMaterial({map: t('diffuse', true), normalMap: t('nor_gl'), roughnessMap: arm, metalnessMap: arm, metalness: 1, roughness: 1, color: tint, envMapIntensity: 1.3});
  _metal.set(key, m); return m;}

function rayTexture() {const c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d')!; const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.6, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,1)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 256); const h = x.createLinearGradient(0, 0, 64, 0); h.addColorStop(0, 'rgba(0,0,0,1)'); h.addColorStop(.5, 'rgba(0,0,0,0)'); h.addColorStop(1, 'rgba(0,0,0,1)'); x.globalCompositeOperation = 'destination-out'; x.fillStyle = h; x.fillRect(0, 0, 64, 256); return new THREE.CanvasTexture(c);}


function confetti() {const c = document.createElement('canvas'); c.className = 'confetti'; c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c); const x = c.getContext('2d')!;
  const cols = ['#f6c26b', '#e74c3c', '#fff1d0', '#c0392b', '#ffd24a'], ps = Array.from({length: 140}, () => ({x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, r: Math.random() * 6, s: 4 + Math.random() * 6, c: cols[Math.floor(Math.random() * cols.length)]}));
  let t = 0; const tick = () => {t++; x.clearRect(0, 0, c.width, c.height); for (const p of ps) {p.x += p.vx; p.y += p.vy; p.r += .1; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore();} if (t < 260) requestAnimationFrame(tick); else c.remove();}; tick();}

let _ao: THREE.MeshBasicMaterial | null = null, _pool: THREE.MeshBasicMaterial | null = null;
const AO_MAT_GET = () => _ao ??= new THREE.MeshBasicMaterial({map: aoTexture(), transparent: true, depthWrite: false, color: 0});
const POOL_MAT = () => _pool ??= new THREE.MeshBasicMaterial({map: dotTexture(true), color: 0xff8030, transparent: true, opacity: .22, depthWrite: false, blending: THREE.AdditiveBlending});
/** Merge a group's plain child meshes into one mesh per material (same local space): one draw call per material instead of dozens. */
function bake<T extends THREE.Object3D>(g: T): T {
  g.updateMatrixWorld(true); const inv = g.matrixWorld.clone().invert(), by = new Map<THREE.Material, THREE.BufferGeometry[]>(), drop: THREE.Mesh[] = [];
  g.traverse(o => {const m = o as THREE.Mesh; if (!m.isMesh || m === (g as any) || Array.isArray(m.material) || (m as any).isInstancedMesh) return;
    const geo = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()).applyMatrix4(inv.clone().multiply(m.matrixWorld));
    for (const k of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(k)) geo.deleteAttribute(k);
    if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
    (by.get(m.material as THREE.Material) ?? by.set(m.material as THREE.Material, []).get(m.material as THREE.Material)!).push(geo); drop.push(m);});
  if (drop.length < 2) return g; for (const m of drop) m.parent!.remove(m);
  for (const [mat, geos] of by) {const mm = new THREE.Mesh(mergeGeometries(geos, false)!, mat); mm.castShadow = mm.receiveShadow = true; g.add(mm);} return g;}

/** Character look: a = crisp, b = toon, c = gothic (query ?skin= or the saved choice). */
export const SKIN = (() => {const q = new URLSearchParams(location.search).get('skin'); let v = q; if (!v) try {v = localStorage.getItem('race-skin');} catch {} return ['a', 'b', 'c'].includes(v || '') ? v! : 'a';})();
