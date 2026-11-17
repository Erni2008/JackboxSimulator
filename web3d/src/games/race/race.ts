// Obstacle race in the browser: built for phones (Poco X3 Pro / iPhone) — instanced scenery, 512px textures, one shadow map
// that follows the player, adaptive resolution. Touch: left thumb stick + jump button; PC: WASD/arrows + SPACE.
import * as THREE from 'three';
import {GLTFLoader, type GLTF} from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import {Course, Runner, top, type Block, H} from './course';

export const CHARACTERS = ['skeleton', 'dracula', 'pumpkin', 'voodoo', 'ghost', 'zombie', 'plague_doctor', 'puppeteer'];
export const NAMES: Record<string, string> = {skeleton: 'Скелет', dracula: 'Дракула', pumpkin: 'Тыква', voodoo: 'Вуду', ghost: 'Призрак', zombie: 'Зомби', plague_doctor: 'Чумной доктор', puppeteer: 'Кукольник'};
const LIMIT = 150, COUNTDOWN = 3.5, STEP = 1 / 120;

type Look = {root: THREE.Object3D; mixer: THREE.AnimationMixer; acts: Record<string, THREE.AnimationAction>; cur: string; tag: HTMLDivElement; squash: number; prevVy: number};

export class RaceApp {
  readonly renderer: THREE.WebGLRenderer; readonly scene = new THREE.Scene(); readonly camera = new THREE.PerspectiveCamera(55, 1, .3, 900);
  course: Course; readonly night: boolean; runners: Runner[] = []; me!: Runner; clock = 0; private acc = 0;
  private sun!: THREE.DirectionalLight; private fill!: THREE.DirectionalLight; private mist: THREE.Mesh[] = []; private pollen!: THREE.Points; private puffs: {s: THREE.Sprite; t: number}[] = []; private grassMat?: THREE.Material; private looks = new Map<Runner, Look>(); private blockMeshes = new Map<Block, THREE.Mesh>();
  private sweeperMeshes: THREE.Object3D[] = []; private cpArches: {glow: THREE.Mesh; flag: THREE.Mesh; lit: boolean}[] = []; private lastCp = 0; private pend: {bob: THREE.Object3D; chain: THREE.Mesh}[] = []; private boulderPool: THREE.Object3D[] = [];
  private gltf = new GLTFLoader(); private texLoader = new THREE.TextureLoader(); private cache = new Map<string, Promise<GLTF>>();
  private camTarget = new THREE.Vector3(); private pixelRatio: number; private frameAvg = 16; private last = 0;
  private dots = new Map<Runner, HTMLElement>(); private keys = new Set<string>(); private stick = {id: -1, ox: 0, oy: 0, x: 0, y: 0}; private hud: HTMLElement;

  constructor(private host: HTMLElement, private myChar: string, map = 1) {
    this.course = new Course(map); this.night = this.course.theme === 'graveyard';
    const phone = matchMedia('(pointer:coarse)').matches;
    this.renderer = new THREE.WebGLRenderer({antialias: !phone || devicePixelRatio < 2, powerPreference: 'high-performance'});
    this.pixelRatio = Math.min(devicePixelRatio, phone ? 1.5 : 2); this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(this.renderer.domElement);
    this.hud = document.getElementById('hud')!;
    addEventListener('resize', () => this.resize()); this.resize();
    this.input();
  }

  async load(progress: (f: number) => void) {
    const N = this.night;
    // sky: background + image-based lighting from the same panorama (sunset over the gorge / moonrise over the graveyard)
    const sky = this.tex(N ? 'sky_night.jpg' : 'sky.jpg', false); sky.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.background = sky;
    const pmrem = new THREE.PMREMGenerator(this.renderer); this.scene.environment = pmrem.fromEquirectangular(await loaded(sky)).texture; pmrem.dispose();
    (this.scene as any).environmentIntensity = N ? .55 : .75; (this.scene as any).backgroundIntensity = N ? .85 : 1;
    this.scene.fog = N ? new THREE.Fog(new THREE.Color(.1, .15, .24), 16, 120) : new THREE.Fog(new THREE.Color(.62, .58, .64), 38, 240);
    this.scene.add(N ? new THREE.HemisphereLight(0x7088c8, 0x141812, .55) : new THREE.HemisphereLight(0xbfc8ff, 0x3d3324, .35));
    if (N) this.renderer.toneMappingExposure = 1.2;
    // key light matches the sun / moon in the panorama: long shadows towards the camera, rim light on everything
    this.sun = N ? new THREE.DirectionalLight(0xb4ccff, 2.4) : new THREE.DirectionalLight(0xffb978, 3.4); this.sun.castShadow = true;
    const hi = !matchMedia('(pointer:coarse)').matches; this.sun.shadow.mapSize.set(hi ? 2048 : 1024, hi ? 2048 : 1024);
    Object.assign(this.sun.shadow.camera, {left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 140}); this.sun.shadow.bias = -.0005; this.sun.shadow.normalBias = .04;
    this.scene.add(this.sun, this.sun.target);
    this.fill = new THREE.DirectionalLight(N ? 0xa8b8ff : 0xc8d2ff, N ? 1.1 : 1.7); this.scene.add(this.fill, this.fill.target); // cool fill from the camera side
    this.atmosphere();
    const mats = {cobble: this.mat('mossy_cobblestone', 3), brick: this.mat('mossy_brick', 3, true), dark: this.mat('dark_wooden_planks', 2.2, true), mud: this.mat('brown_mud_leaves_01', 3, false, 0x9aa38a),
      grass: this.mat('leafy_grass', 3.2, false, 0xc4dc8a), rock: this.mat('rock_face_03', 4, true), plank: this.mat('brown_planks_05', 2.2, true), stone: this.mat('mossy_rock', 3.2), bark: this.mat('bark_brown_02', 1), ground: this.mat('forest_ground_04', 6)};
    for (const b of this.course.blocks) {
      const topM = ({grass: mats.grass, plank: mats.plank, stone: mats.stone, cobble: mats.cobble, brick: mats.brick, dark: mats.dark, mud: mats.mud} as Record<string, THREE.Material>)[b.mat];
      const side = b.mat === 'plank' ? mats.plank : b.mat === 'dark' ? mats.dark : this.night ? mats.brick : mats.rock;
      const m = new THREE.Mesh(blockGeometry(b), [topM, side]); if (b.mat === 'grass') this.grassOn(b); m.receiveShadow = true; m.castShadow = b.mat === 'plank' || b.crumbles; this.blockMeshes.set(b, m); this.scene.add(m);
    }
    if (!this.night) {const floor = new THREE.Mesh(new THREE.PlaneGeometry(520, 540).rotateX(-Math.PI / 2), mats.ground); floor.receiveShadow = false; floor.position.set(0, -34, 150); worldUV(floor.geometry as THREE.BufferGeometry, 6, 'xz'); this.scene.add(floor);}
    // hazards
    const logGeo = new THREE.CylinderGeometry(.42, .42, 1, 14, 1); logGeo.rotateZ(Math.PI / 2);
    for (const s of this.course.sweepers) {const g = new THREE.Group(); for (let a = 0; a < (s.arms || 1); a++) {const log = new THREE.Mesh(logGeo, this.night ? mats.dark : mats.bark); log.scale.set(s.len * 2, 1, 1); log.rotation.y = a * Math.PI / (s.arms || 1); log.castShadow = true; g.add(log);}
      this.sweeperMeshes.push(g); this.scene.add(g);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(.55, .65, 1.6, 12), this.night ? mats.brick : mats.bark); post.position.set(s.x, s.y - .25, s.z); post.castShadow = true; this.scene.add(post);}
    const boulder = await this.model('env/boulder_01.glb'); progress(.15);
    for (const p of this.course.pendulums) {
      const bob = this.night ? scythe() : normalized(boulder.scene, p.radius * 2.1, 'max'); this.scene.add(bob);
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 1, 6), new THREE.MeshStandardMaterial({color: 0x3a3632, metalness: .8, roughness: .45})); this.scene.add(chain);
      const base = this.course.spawnY(p.pz), postX = this.night ? 5 : 6.4;
      for (const sg of [-1, 1]) {const post = new THREE.Mesh(this.night ? new THREE.BoxGeometry(.9, p.py - base, .9) : new THREE.CylinderGeometry(.45, .5, p.py - base, 10), this.night ? mats.brick : mats.bark); post.position.set(sg * postX, (base + p.py) / 2, p.pz); post.castShadow = true; this.scene.add(post);}
      const beam = new THREE.Mesh(logGeo, this.night ? mats.dark : mats.bark); beam.scale.set(postX * 2 + .8, .9, .9); beam.position.set(0, p.py, p.pz); beam.castShadow = true; this.scene.add(beam);
      this.pend.push({bob, chain});
    }
    this.boulderSrc = boulder.scene;
    for (let i = 0; i < 6; i++) {const b = normalized(boulder.scene, 2.4, 'max'); b.visible = false; this.boulderPool.push(b); this.scene.add(b);}
    // finish arch
    const fy = this.course.spawnY(this.course.finishZ);
    for (const sg of [-1, 1]) {const post = new THREE.Mesh(this.night ? new THREE.BoxGeometry(1.3, 7, 1.3) : new THREE.CylinderGeometry(.55, .6, 7, 12), this.night ? mats.brick : mats.bark); post.position.set(sg * 7.5, fy + 3.5, this.course.finishZ); post.castShadow = true; this.scene.add(post);}
    const beam = new THREE.Mesh(logGeo, mats.bark); beam.scale.set(16.5, 1.1, 1.1); beam.position.set(0, fy + 7.1, this.course.finishZ); this.scene.add(beam);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(13, 1.7), new THREE.MeshStandardMaterial({map: bannerTexture(), side: THREE.DoubleSide, roughness: .85}));
    banner.position.set(0, fy + 6, this.course.finishZ); banner.rotation.y = Math.PI; this.scene.add(banner);
    this.checkpointArches(this.night ? mats.brick : mats.bark);
    await (this.night ? this.decorateNight(mats.stone, progress) : this.decorate(progress)); this.buildGrass(); progress(.8);
    // runners
    const others = CHARACTERS.filter(c => c !== this.myChar);
    const cast = [this.myChar, ...others.sort(() => Math.random() - .5).slice(0, 5)];
    for (let i = 0; i < cast.length; i++) {
      const r = new Runner('p' + i, i === 0 ? 'Вы' : NAMES[cast[i]], cast[i], i, i > 0); r.x = ((i % 3) - 1) * 2.4; r.z = -1.5 - Math.floor(i / 3) * 2.4; this.runners.push(r);
      await this.addLook(r); progress(.8 + .2 * (i + 1) / cast.length);
    }
    this.me = this.runners[0];
    const dz = Number(new URLSearchParams(location.search).get('z')); if (dz) for (const r of this.runners) {r.z = dz + r.slot * .3; r.x = (r.slot % 3 - 1) * 1.5; r.y = this.course.spawnY(dz) + .5; r.progress = dz; r.checkpoint = this.course.checkpoints.filter(c => c <= dz).length - 1;}
    this.camTarget.set(this.me.x, this.me.y, this.me.z);
  }

  private async addLook(r: Runner) {
    const g = await this.model(`chars/${r.character}.glb`);
    const root = SkeletonUtils.clone(g.scene); root.traverse(o => {const m = o as THREE.Mesh; if (m.isMesh) {m.castShadow = true; m.frustumCulled = false; const mm = m.material as THREE.MeshStandardMaterial; mm.side = THREE.DoubleSide; mm.envMapIntensity = 1.4; mm.roughness = .65;}});
    this.scene.add(root); const mixer = new THREE.AnimationMixer(root); const acts: Record<string, THREE.AnimationAction> = {};
    for (const clip of g.animations) {const a = mixer.clipAction(clip); acts[clip.name] = a; if (clip.name === 'jump' || clip.name === 'stun') {a.setLoop(clip.name === 'stun' ? THREE.LoopRepeat : THREE.LoopOnce, Infinity); a.clampWhenFinished = true;}}
    acts.idle?.play();
    const tag = document.createElement('div'); tag.className = 'tag' + (r.bot ? '' : ' me'); tag.textContent = r.name; this.hud.appendChild(tag);
    this.looks.set(r, {root, mixer, acts, cur: 'idle', tag, squash: 0, prevVy: 0});
  }

  private async decorate(progress: (f: number) => void) {
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const place: Record<string, THREE.Matrix4[]> = {};
    const put = (name: string, x: number, y: number, z: number, size: number, yaw = rnd() * Math.PI * 2) => (place[name] ??= []).push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw), new THREE.Vector3(size, size, size)));
    const len = this.course.finishZ + 30;
    for (let z = -40; z < len + 40; z += 8 + rnd() * 7) for (const s of [-1, 1]) put(rnd() < .55 ? 'fir_tree_01_c' : 'pine_tree_01_c', s * (34 + rnd() * 46), -34, z + rnd() * 5, 30 + rnd() * 14);
    
    for (const b of this.course.blocks) {
      if (b.mat === 'plank' || b.crumbles) continue; const d = b.z1 - b.z0;
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

  start() {this.renderer.setAnimationLoop(t => this.frame(t));}

  // ---------- checkpoints ----------
  private checkpointArches(postMat: THREE.Material) {
    const cps = this.course.checkpoints.slice(1);
    for (const cz of cps) {
      let w = 6; for (const b of this.course.blocks) if (!b.crumbles && !b.driftAmp && cz >= b.z0 && cz <= b.z1) w = Math.min((b.x1 - b.x0) / 2 - .5, 7);
      const y = this.course.spawnY(cz);
      for (const sg of [-1, 1]) {const post = new THREE.Mesh(new THREE.CylinderGeometry(.18, .22, 4.2, 10), postMat); post.position.set(sg * w, y + 2.1, cz); post.castShadow = true; this.scene.add(post);
        const cap = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 8), new THREE.MeshStandardMaterial({color: 0x222018, emissive: 0xffa040, emissiveIntensity: 1.6})); cap.position.set(sg * w, y + 4.35, cz); this.scene.add(cap);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({map: dotTexture(true), color: 0xffa040, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending})); halo.scale.setScalar(2.2); halo.position.copy(cap.position); this.scene.add(halo);}
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(w * 2 - .6, .9), new THREE.MeshStandardMaterial({map: flagTexture(), side: THREE.DoubleSide, roughness: .8, emissive: 0x000000, emissiveMap: flagTexture(), emissiveIntensity: .9}));
      flag.position.set(0, y + 3.7, cz); flag.rotation.y = Math.PI; this.scene.add(flag);
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, w * 2, 6).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({color: 0x2a2018})); rope.position.set(0, y + 4.2, cz); this.scene.add(rope);
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(w * 2, .7).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({color: 0x6fd3ff, transparent: true, opacity: .4, depthWrite: false, blending: THREE.AdditiveBlending}));
      glow.position.set(0, y + .03, cz); glow.renderOrder = 3; this.scene.add(glow);
      this.cpArches.push({glow, flag, lit: false});
    }
  }
  private toast(text: string) {const t = document.getElementById('toast'); if (!t) return; t.textContent = text; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');}

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
      if (b.crumbles || b.driftAmp || b.liftAmp) continue; const d = b.z1 - b.z0, w = b.x1 - b.x0, y = top(b, b.z0);
      if (w >= 14) for (let i = 0; i < d / 3; i++) {const sd = rnd() < .5 ? -1 : 1, x = sd > 0 ? b.x1 - .8 - rnd() * 1.2 : b.x0 + .8 + rnd() * 1.2; put(rnd() < .75 ? graves : crosses, x, y, b.z0 + rnd() * d, .7 + rnd() * .4, (rnd() - .5) * .5, (rnd() - .5) * .25);}
      if (b.mat !== 'mud') for (const sd of [-1, 1]) for (let zz = b.z0 + .3; zz < b.z1; zz += .45) if (rnd() < .92) put(bars, sd > 0 ? b.x1 - .1 : b.x0 + .1, y, zz, 1, 0, (rnd() - .5) * .12);
      for (let zz = b.z0 + 3; zz < b.z1 - 1; zz += 11) for (const sd of [-1, 1]) lamps.push(new THREE.Vector3(sd > 0 ? b.x1 - .45 : b.x0 + .45, y, zz + (sd > 0 ? 5 : 0)));
    }
    for (let z = -30; z < len + 30; z += 14 + rnd() * 10) for (const sd of [-1, 1]) put(trees, sd * (24 + rnd() * 40), -2.9, z, 1.6 + rnd() * 1.4, rnd() * 6);
    // meshes
    const graveGeo = mergeGeos([new THREE.BoxGeometry(.8, 1, .2).translate(0, .5, 0), new THREE.CylinderGeometry(.4, .4, .2, 18, 1, false, -Math.PI / 2, Math.PI).rotateX(Math.PI / 2).rotateZ(0).translate(0, 1, 0), new THREE.BoxGeometry(1, .18, .32).translate(0, .09, 0)]);
    const crossGeo = mergeGeos([new THREE.BoxGeometry(.16, 1.5, .16).translate(0, .75, 0), new THREE.BoxGeometry(.8, .16, .16).translate(0, 1.1, 0)]);
    const inst = (geo: THREE.BufferGeometry, mat: THREE.Material, arr: THREE.Matrix4[], shadow = true) => {if (!arr.length) return; const m = new THREE.InstancedMesh(geo, mat, arr.length); arr.forEach((a, i) => m.setMatrixAt(i, a)); m.castShadow = shadow; m.receiveShadow = true; m.computeBoundingSphere(); this.scene.add(m);};
    inst(graveGeo, stone, graves); inst(crossGeo, stone, crosses);
    inst(new THREE.BoxGeometry(.05, 1.25, .05).translate(0, .62, 0), new THREE.MeshStandardMaterial({color: 0x15151a, metalness: .85, roughness: .4}), bars, false);
    progress(.4);
    const dead = await this.model('env/dead_tree_trunk.glb'); const base = normalized(dead.scene, 1, 'height'); base.updateMatrixWorld(true);
    base.traverse(o => {const m = o as THREE.Mesh; if (!m.isMesh) return; const im = new THREE.InstancedMesh(m.geometry, m.material, trees.length); const local = m.matrixWorld.clone(); trees.forEach((t, i) => im.setMatrixAt(i, t.clone().multiply(local))); im.computeBoundingSphere(); this.scene.add(im);});
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
  private rocks: {rock: THREE.Object3D; ring: THREE.Mesh; id: number}[] = []; private shake = 0; private boulderSrc?: THREE.Object3D;
  private syncRocks(dt: number) {
    if (!this.boulderSrc) return;
    const ringMat = (o: number) => new THREE.MeshBasicMaterial({color: 0xff3b1f, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide});
    while (this.rocks.length < this.course.fallers.length) {const rock = this.night ? fireball() : normalized(this.boulderSrc, 2, 'max'); const ring = new THREE.Mesh(new THREE.RingGeometry(.82, 1, 40).rotateX(-Math.PI / 2), ringMat(.8));
      const disc = new THREE.Mesh(new THREE.CircleGeometry(1, 40).rotateX(-Math.PI / 2), ringMat(.25)); ring.add(disc); ring.renderOrder = 3; this.scene.add(rock, ring); this.rocks.push({rock, ring, id: -1});}
    this.rocks.forEach((v, i) => {const f = this.course.fallers[i]; v.rock.visible = v.ring.visible = !!f; if (!f) {v.id = -1; return;}
      if (v.id !== f.id) {v.id = f.id; v.rock.userData.done = false; v.rock.rotation.set(Math.random() * 6, Math.random() * 6, 0);}
      v.rock.position.set(f.x, f.y, f.z); v.rock.scale.setScalar(f.r); v.rock.rotation.x += dt * 4;
      const k = Math.min(1, (this.course.time - f.spawn) / (f.impact - f.spawn)); v.ring.visible = !f.landed;
      v.ring.position.set(f.x, f.g + .04, f.z); v.ring.scale.setScalar(f.r * (2.4 - 1.3 * k)); (v.ring.material as THREE.MeshBasicMaterial).opacity = .35 + .6 * k * (.6 + .4 * Math.sin(this.course.time * 30));
      if (f.landed && !v.rock.userData.done) {v.rock.userData.done = true; this.puff(f.x, f.g, f.z, 2.2); this.puff(f.x, f.g, f.z, 1.6);
        const d = Math.hypot(f.x - this.me.x, f.z - this.me.z); if (d < 14) {this.shake = Math.max(this.shake, .35 * (1 - d / 14)); navigator.vibrate?.(d < 5 ? 30 : 0);}}});
  }

  // ---------- atmosphere ----------
  private grassSpots: THREE.Matrix4[] = [];
  private grassOn(b: Block) {
    let seed = (Math.abs(Math.floor(b.z0 * 131 + b.x0 * 17)) % 2147483000) + 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const area = (b.x1 - b.x0) * (b.z1 - b.z0), n = Math.floor(area * (matchMedia('(pointer:coarse)').matches ? 2.4 : 3.6));
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
    this.grassSpots.forEach((m, i) => {inst.setMatrixAt(i, m); col.setHSL(.2 + Math.random() * .07, .5, .5 + Math.random() * .2); inst.setColorAt(i, col);});
    inst.receiveShadow = true; inst.computeBoundingSphere(); this.scene.add(inst);
  }
  private atmosphere() {
    // drifting mist layers in the gorge
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!;
    for (let i = 0; i < 70; i++) {const px = Math.random() * 256, py = Math.random() * 256, r = 20 + Math.random() * 60, g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, 'rgba(255,240,230,.22)'); g.addColorStop(1, 'rgba(255,240,230,0)'); x.fillStyle = g; for (const ox of [-256, 0, 256]) for (const oy of [-256, 0, 256]) {x.save(); x.translate(ox, oy); x.fillRect(px - r, py - r, r * 2, r * 2); x.restore();}}
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 5);
    for (const [y, o] of (this.night ? [[-1.6, .35], [-.6, .22], [.6, .12]] : [[-9, .5], [-15, .65], [-22, .8], [-29, .9]]) as [number, number][]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(700, 700).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({map: t.clone(), transparent: true, opacity: o, depthWrite: false, color: this.night ? 0x9fc4d8 : 0xf2d8c8}));
      (m.material as THREE.MeshBasicMaterial).map!.repeat.set(4 + y * -.05, 4); m.position.set(0, y, 150); m.renderOrder = 2; this.mist.push(m); this.scene.add(m);}
    if (this.night) {const swamp = new THREE.Mesh(new THREE.PlaneGeometry(400, 700).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({color: 0x0c1714, metalness: .85, roughness: .18, envMapIntensity: 1.1})); swamp.position.set(0, -2.5, 200); this.scene.add(swamp);}
    // river at the bottom of the gorge (mirrors the sunset sky)
    const river = new THREE.Mesh(new THREE.PlaneGeometry(26, 600).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({color: 0x1d2a33, metalness: .9, roughness: .12, envMapIntensity: 1.3}));
    river.position.set(-6, -33.6, 150); if (!this.night) this.scene.add(river);
    // pollen / dust motes in the light
    const n = matchMedia('(pointer:coarse)').matches ? 260 : 520, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {pos[i * 3] = (Math.random() - .5) * 40; pos[i * 3 + 1] = Math.random() * 14; pos[i * 3 + 2] = Math.random() * 50 - 10;}
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.pollen = new THREE.Points(g, new THREE.PointsMaterial({map: dotTexture(), size: this.night ? .16 : .13, color: this.night ? 0xc8ff7a : 0xffd9a0, transparent: true, opacity: .85, depthWrite: false, blending: THREE.AdditiveBlending}));
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

  private frame(t: number) {
    const dt = this.last ? Math.min(.1, (t - this.last) / 1000) : 1 / 60; this.last = t;
    this.frameAvg += (dt * 1000 - this.frameAvg) * .05;
    if (this.frameAvg > 21 && this.pixelRatio > .85) {this.pixelRatio = Math.max(.85, this.pixelRatio - .1); this.renderer.setPixelRatio(this.pixelRatio); this.frameAvg = 16;}
    this.readInput();
    this.acc += dt;
    while (this.acc >= STEP) {this.acc -= STEP; this.clock += STEP; const live = this.clock >= COUNTDOWN && !this.over();
      this.course.step(STEP);
      for (const r of this.runners) {if (r.bot) this.course.think(r, STEP); if (!live) {r.inX = r.inZ = 0; r.jump = false;} this.course.move(r, STEP);}}
    this.sync(dt); this.renderer.render(this.scene, this.camera); this.hudUpdate();
  }

  over() {if (this.clock - COUNTDOWN >= LIMIT) return true; return this.runners.length > 0 && this.runners.every(r => r.finished);}
  timeLeft() {return Math.max(0, LIMIT - Math.max(0, this.clock - COUNTDOWN));}
  standings() {return [...this.runners].sort((a, b) => (a.finished ? 0 : 1) - (b.finished ? 0 : 1) || (a.finished ? a.finishTime - b.finishTime : b.progress - a.progress));}

  private sync(dt: number) {
    const c = this.course;
    for (const [b, m] of this.blockMeshes) {const shake = b.crumbles && b.crumbleAt >= 0 && c.time - b.crumbleAt < .75 ? Math.sin(c.time * 70) * .05 : 0; m.position.set(b.offX + shake, b.offY, 0); m.visible = !b.gone;}
    c.sweepers.forEach((s, i) => {const m = this.sweeperMeshes[i]; m.position.set(s.x, s.y, s.z); m.rotation.y = -s.angle;});
    c.pendulums.forEach((p, i) => {const {bob, chain} = this.pend[i]; bob.position.set(p.bx, p.by, p.bz); bob.rotation.z = p.swing;
      chain.position.set((p.px + p.bx) / 2, (p.py + p.by) / 2, p.pz); chain.rotation.z = p.swing; chain.scale.y = p.len - p.radius * .6;});
    this.boulderPool.forEach((o, i) => {const b = c.boulders[i]; o.visible = !!b; if (b) {o.position.set(b.x, b.y, b.z); o.rotation.x = b.spin; o.scale.setScalar(b.radius / 1.2 * o.userData.base);}});
    for (const [r, l] of this.looks) {
      const hs = Math.hypot(r.vx, r.vz), want = r.stun > 0 ? 'stun' : !r.ground ? 'jump' : hs > .8 ? 'run' : 'idle';
      if (want !== l.cur && l.acts[want]) {const a = l.acts[want]; a.reset().fadeIn(.12).play(); l.acts[l.cur]?.fadeOut(.12); l.cur = want;}
      if (l.acts.run) l.acts.run.timeScale = Math.max(.6, hs / 5.5);
      if (r.ground && l.prevVy < -6) {l.squash = Math.min(.3, -l.prevVy * .022); this.puff(r.x, r.y, r.z, Math.min(1.4, -l.prevVy / 9));}
      if (!r.ground && l.prevVy <= .5 && r.vy > 8) this.puff(r.x, r.y, r.z, .6); l.prevVy = r.vy; l.squash = Math.max(0, l.squash - dt * 2.2);
      const sy = 1 - l.squash, sxz = 1 / Math.sqrt(sy), ghost = r.character === 'ghost' ? .25 + Math.sin(c.time * 3 + r.slot) * .08 : 0;
      l.root.position.set(r.x, r.y + ghost, r.z); l.root.scale.set(sxz, sy, sxz);
      const yaw = r.facing; let d = yaw - l.root.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); l.root.rotation.y += d * Math.min(1, dt * 14);
      l.mixer.update(dt);
    }
    // camera: behind and above the player, framed wider in portrait
    const me = this.me, portrait = this.camera.aspect < 1, k = Math.min(1, dt * 5);
    this.camTarget.x += (me.x * .75 - this.camTarget.x) * k; this.camTarget.z += (me.z - this.camTarget.z) * k; this.camTarget.y += (Math.max(me.y, -4) - this.camTarget.y) * Math.min(1, dt * 2.5);
    const back = portrait ? 11 : 8.6, up = portrait ? 7.2 : 5.4;
    this.camera.position.set(this.camTarget.x, this.camTarget.y + up, this.camTarget.z - back); this.camera.lookAt(this.camTarget.x, this.camTarget.y + 1.3, this.camTarget.z + 7);
    this.sun.target.position.set(this.camTarget.x, this.camTarget.y, this.camTarget.z + 8);
    const sd = this.night ? MOON_DIR : SUN_DIR; this.sun.position.set(this.camTarget.x + sd.x * 70, this.camTarget.y + sd.y * 70, this.camTarget.z + 8 + sd.z * 70);
    this.fill.position.copy(this.camera.position); this.fill.target.position.set(this.camTarget.x, this.camTarget.y, this.camTarget.z);
    this.animateAtmosphere(dt); this.syncRocks(dt);
    if (this.me.checkpoint > this.lastCp) {for (let i = this.lastCp + 1; i <= this.me.checkpoint; i++) {const a = this.cpArches[i - 1]; if (a && !a.lit) {a.lit = true; (a.flag.material as THREE.MeshStandardMaterial).emissive.set(0xffb238); (a.glow.material as THREE.MeshBasicMaterial).color.set(0xffc455); this.toast('ЧЕКПОИНТ!'); this.puff(this.me.x, this.me.y, this.me.z, 1.4); navigator.vibrate?.(20);}} this.lastCp = this.me.checkpoint;}
    for (const a of this.cpArches) {const m = a.glow.material as THREE.MeshBasicMaterial; m.opacity = (a.lit ? .55 : .35) + Math.sin(this.course.time * 3) * .12;}
    if (this.shake > 0) {this.shake = Math.max(0, this.shake - dt * 1.2); const a = this.shake * this.shake * 1.4; this.camera.position.x += (Math.random() - .5) * a; this.camera.position.y += (Math.random() - .5) * a;}
  }

  private hudUpdate() {
    const w = innerWidth, h = innerHeight, v = new THREE.Vector3();
    for (const [r, l] of this.looks) {v.set(r.x, r.y + H + .55, r.z).project(this.camera); const on = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
      l.tag.style.display = on ? '' : 'none'; if (on) l.tag.style.transform = `translate(${(v.x * .5 + .5) * w}px,${(-v.y * .5 + .5) * h}px) translate(-50%,-100%)`;}
    const t = this.timeLeft(); setText('timer', `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`);
    document.getElementById('timer')!.classList.toggle('low', t < 20 && this.clock > COUNTDOWN);
    const n = Math.ceil(COUNTDOWN - .5 - this.clock); setText('count', this.clock < COUNTDOWN ? (n > 0 ? String(n) : 'ВПЕРЁД!') : '');
    const st = this.standings(), place = st.indexOf(this.me) + 1; setText('place-n', String(place)); setText('place-of', `/${st.length}`);
    document.getElementById('place')!.dataset.p = String(Math.min(place, 4));
    // progress track: every runner as a portrait dot
    if (!this.dots.size) {const track = document.getElementById('track')!; for (const r of this.runners) {const d = document.createElement('i'); d.className = r === this.me ? 'me' : ''; d.style.backgroundImage = `url(../hell-cage-host/chars/${r.character}.png)`; track.appendChild(d); this.dots.set(r, d);}}
    for (const [r, d] of this.dots) {const f = r.finished ? 1 : Math.min(1, Math.max(0, r.z / this.course.finishZ)); d.style.left = `${f * 100}%`; d.style.zIndex = r === this.me ? '9' : String(Math.round(f * 8));}
    (document.getElementById('fill') as HTMLElement).style.width = `${Math.min(1, Math.max(0, this.me.z / this.course.finishZ)) * 100}%`;
    // mini leaderboard: top 3 (+ you)
    const rows = st.slice(0, 3); if (!rows.includes(this.me)) rows.push(this.me);
    const html = rows.map(r => `<li class="${r === this.me ? 'me' : ''}"><b>${st.indexOf(r) + 1}</b><img src="../hell-cage-host/chars/${r.character}.png" alt="">${r.name}${r.finished ? ' ✓' : ''}</li>`).join('');
    const lb = document.getElementById('board')!; if (lb.dataset.h !== html) {lb.dataset.h = html; lb.innerHTML = html;}
    const res = document.getElementById('results')!;
    if ((this.me.finished || this.over()) && res.hidden) {res.hidden = false;
      res.querySelector('ol')!.innerHTML = st.map(r => `<li class="${r === this.me ? 'me' : ''}">${r.name}<span>${r.finished ? (r.finishTime - COUNTDOWN).toFixed(1) + ' с' : Math.round(r.progress / this.course.finishZ * 100) + '%'}</span></li>`).join('');
      setText('verdict', this.me.finished ? 'ФИНИШ!' : 'ВРЕМЯ ВЫШЛО');}
  }

  private input() {
    addEventListener('keydown', e => {this.keys.add(e.code); if (e.code === 'Space') {this.me && (this.me.jump = true); e.preventDefault();}});
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

  private resize() {const w = innerWidth, h = innerHeight; this.renderer.setSize(w, h); this.camera.aspect = w / h; this.camera.fov = w < h ? 70 : 58; this.camera.updateProjectionMatrix();}
  private model(url: string) {let p = this.cache.get(url); if (!p) {p = this.gltf.loadAsync(url); this.cache.set(url, p);} return p;}
  private tex(url: string, repeat = true, color = true) {const t = this.texLoader.load(url); if (color) t.colorSpace = THREE.SRGBColorSpace; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t;}
  private mat(name: string, _tile: number, shade = false, tint = 0xffffff) {
    const arm = this.tex(`tex/${name}/arm.jpg`, true, false);
    return new THREE.MeshStandardMaterial({map: this.tex(`tex/${name}/diffuse.jpg`), normalMap: this.tex(`tex/${name}/nor_gl.jpg`, true, false), roughnessMap: arm, roughness: 1, metalness: 0, vertexColors: shade, envMapIntensity: .8, color: tint});
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
function bannerTexture() {const c = document.createElement('canvas'); c.width = 1024; c.height = 136; const x = c.getContext('2d')!;
  x.fillStyle = '#7a0f0b'; x.fillRect(0, 0, 1024, 136); for (let i = 0; i < 32; i++) {x.fillStyle = i % 2 ? '#f2eadc' : '#111'; x.fillRect(i * 32, 0, 32, 16); x.fillStyle = i % 2 ? '#111' : '#f2eadc'; x.fillRect(i * 32, 120, 32, 16);}
  x.fillStyle = '#f6e7c8'; x.font = 'bold 76px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('ФИНИШ', 512, 70);
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
  const blade = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({color: 0x9aa0a6, metalness: .95, roughness: .28, envMapIntensity: 1.6}));
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
