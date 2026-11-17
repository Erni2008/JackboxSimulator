// Obstacle race in the browser: built for phones (Poco X3 Pro / iPhone) — instanced scenery, 512px textures, one shadow map
// that follows the player, adaptive resolution. Touch: left thumb stick + jump button; PC: WASD/arrows + SPACE.
import * as THREE from 'three';
import {GLTFLoader, type GLTF} from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import {Course, Runner, top, type Block, H} from './course';

export const CHARACTERS = ['skeleton', 'dracula', 'pumpkin', 'voodoo', 'ghost', 'zombie', 'plague_doctor', 'puppeteer'];
export const NAMES: Record<string, string> = {skeleton: 'Скелет', dracula: 'Дракула', pumpkin: 'Тыква', voodoo: 'Вуду', ghost: 'Призрак', zombie: 'Зомби', plague_doctor: 'Чумной доктор', puppeteer: 'Кукольник'};
const LIMIT = 120, COUNTDOWN = 3.5, STEP = 1 / 120;

type Look = {root: THREE.Object3D; mixer: THREE.AnimationMixer; acts: Record<string, THREE.AnimationAction>; cur: string; tag: HTMLDivElement; squash: number; prevVy: number};

export class RaceApp {
  readonly renderer: THREE.WebGLRenderer; readonly scene = new THREE.Scene(); readonly camera = new THREE.PerspectiveCamera(55, 1, .3, 900);
  course = new Course(); runners: Runner[] = []; me!: Runner; clock = 0; private acc = 0;
  private sun!: THREE.DirectionalLight; private looks = new Map<Runner, Look>(); private blockMeshes = new Map<Block, THREE.Mesh>();
  private sweeperMeshes: THREE.Mesh[] = []; private pend: {bob: THREE.Object3D; chain: THREE.Mesh}[] = []; private boulderPool: THREE.Object3D[] = [];
  private gltf = new GLTFLoader(); private texLoader = new THREE.TextureLoader(); private cache = new Map<string, Promise<GLTF>>();
  private camTarget = new THREE.Vector3(); private pixelRatio: number; private frameAvg = 16; private last = 0;
  private keys = new Set<string>(); private stick = {id: -1, ox: 0, oy: 0, x: 0, y: 0}; private hud: HTMLElement;

  constructor(private host: HTMLElement, private myChar: string) {
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
    const fog = new THREE.Color(.66, .7, .68); this.scene.fog = new THREE.Fog(fog, 34, 210); this.scene.background = fog;
    this.scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x4a5530, 1.25));
    this.sun = new THREE.DirectionalLight(0xfff0d8, 2.6); this.sun.position.set(18, 30, -14); this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024); Object.assign(this.sun.shadow.camera, {left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 90}); this.sun.shadow.bias = -.0006; this.sun.shadow.normalBias = .03;
    this.scene.add(this.sun, this.sun.target);
    const sky = new THREE.Mesh(new THREE.SphereGeometry(600, 48, 24), new THREE.MeshBasicMaterial({map: this.tex('sky.jpg', false), side: THREE.BackSide, fog: false, depthWrite: false}));
    sky.renderOrder = -1; sky.name = 'sky'; this.scene.add(sky);
    const mats = {grass: this.mat('leafy_grass', 3.2), rock: this.mat('rock_face_03', 4), plank: this.mat('brown_planks_05', 2.2), stone: this.mat('mossy_rock', 3.2), bark: this.mat('bark_brown_02', 1), ground: this.mat('forest_ground_04', 6)};
    for (const b of this.course.blocks) {
      const topM = b.mat === 'grass' ? mats.grass : b.mat === 'plank' ? mats.plank : mats.stone, side = b.mat === 'plank' ? mats.plank : mats.rock;
      const m = new THREE.Mesh(blockGeometry(b), [topM, side]); m.receiveShadow = true; m.castShadow = b.mat === 'plank' || b.crumbles; this.blockMeshes.set(b, m); this.scene.add(m);
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(520, 540).rotateX(-Math.PI / 2), mats.ground); floor.position.set(0, -34, 150); worldUV(floor.geometry as THREE.BufferGeometry, 6, 'xz'); this.scene.add(floor);
    // hazards
    const logGeo = new THREE.CylinderGeometry(.42, .42, 1, 14, 1); logGeo.rotateZ(Math.PI / 2);
    for (const s of this.course.sweepers) {const log = new THREE.Mesh(logGeo, mats.bark); log.scale.set(s.len * 2, 1, 1); log.castShadow = true; this.sweeperMeshes.push(log); this.scene.add(log);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(.55, .65, 1.6, 12), mats.bark); post.position.set(s.x, s.y - .25, s.z); post.castShadow = true; this.scene.add(post);}
    const boulder = await this.model('env/boulder_01.glb'); progress(.15);
    for (const p of this.course.pendulums) {
      const bob = normalized(boulder.scene, p.radius * 2.1, 'max'); this.scene.add(bob);
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 1, 6), new THREE.MeshStandardMaterial({color: 0x3a3632, metalness: .8, roughness: .45})); this.scene.add(chain);
      for (const sg of [-1, 1]) {const post = new THREE.Mesh(new THREE.CylinderGeometry(.45, .5, p.py - 1.2, 10), mats.bark); post.position.set(sg * 6.4, (2.7 + p.py) / 2 + 1.2, p.pz); post.castShadow = true; this.scene.add(post);}
      const beam = new THREE.Mesh(logGeo, mats.bark); beam.scale.set(13.6, .9, .9); beam.position.set(0, p.py, p.pz); beam.castShadow = true; this.scene.add(beam);
      this.pend.push({bob, chain});
    }
    for (let i = 0; i < 6; i++) {const b = normalized(boulder.scene, 2.4, 'max'); b.visible = false; this.boulderPool.push(b); this.scene.add(b);}
    // finish arch
    const fy = this.course.spawnY(this.course.finishZ);
    for (const sg of [-1, 1]) {const post = new THREE.Mesh(new THREE.CylinderGeometry(.55, .6, 7, 12), mats.bark); post.position.set(sg * 7.5, fy + 3.5, this.course.finishZ); post.castShadow = true; this.scene.add(post);}
    const beam = new THREE.Mesh(logGeo, mats.bark); beam.scale.set(16.5, 1.1, 1.1); beam.position.set(0, fy + 7.1, this.course.finishZ); this.scene.add(beam);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(13, 1.7), new THREE.MeshStandardMaterial({map: bannerTexture(), side: THREE.DoubleSide, roughness: .85}));
    banner.position.set(0, fy + 6, this.course.finishZ); banner.rotation.y = Math.PI; this.scene.add(banner);
    await this.decorate(progress); progress(.8);
    // runners
    const others = CHARACTERS.filter(c => c !== this.myChar);
    const cast = [this.myChar, ...others.sort(() => Math.random() - .5).slice(0, 5)];
    for (let i = 0; i < cast.length; i++) {
      const r = new Runner('p' + i, i === 0 ? 'Вы' : NAMES[cast[i]], cast[i], i, i > 0); r.x = ((i % 3) - 1) * 2.4; r.z = -1.5 - Math.floor(i / 3) * 2.4; this.runners.push(r);
      await this.addLook(r); progress(.8 + .2 * (i + 1) / cast.length);
    }
    this.me = this.runners[0];
    this.camTarget.set(this.me.x, this.me.y, this.me.z);
  }

  private async addLook(r: Runner) {
    const g = await this.model(`chars/${r.character}.glb`);
    const root = SkeletonUtils.clone(g.scene); root.traverse(o => {const m = o as THREE.Mesh; if (m.isMesh) {m.castShadow = true; m.frustumCulled = false; (m.material as THREE.Material).side = THREE.DoubleSide;}});
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
    for (let z = -40; z < len + 40; z += 8 + rnd() * 7) for (const s of [-1, 1]) put(rnd() < .55 ? 'fir_tree_01_c' : 'pine_tree_01_c', s * (17 + rnd() * 50), -34, z + rnd() * 5, 26 + rnd() * 14);
    for (let z = -30; z < len + 30; z += 40) for (const s of [-1, 1]) put('namaqualand_cliff_01', s * (90 + rnd() * 20), -34, z, 60 + rnd() * 20);
    for (const b of this.course.blocks) {
      if (b.mat === 'plank' || b.crumbles) continue; const d = b.z1 - b.z0;
      for (let i = 0; i < d * .8; i++) {const side = rnd() < .5 ? -1 : 1, x = side > 0 ? b.x1 - rnd() * 1.5 : b.x0 + rnd() * 1.5, z = b.z0 + rnd() * d, y = top(b, z), r = rnd();
        if (b.mat === 'grass' && r < .5) put('grass_medium_01', x, y, z, .7 + rnd() * .5);
        else if (r < .74) put('fern_02', x, y, z, .8 + rnd() * .6);
        else if (r < .88) put('rock_moss_set_01', x, y - .1, z, .8 + rnd() * .7);
        else if (r < .95) put('shrub_01', x, y, z, 1.1 + rnd() * .8);
        else put('tree_stump_01', x, y, z, .9 + rnd() * .4);}
      if (b.x1 - b.x0 > 12 && d > 14 && rnd() < .7) put('boulder_01', rnd() < .5 ? b.x0 + 1.4 : b.x1 - 1.4, top(b, b.z0 + d / 2) - .3, b.z0 + d / 2, 2.4);
      for (let i = 0; i < d / 6; i++) {const z = b.z0 + rnd() * d, side = rnd() < .5 ? -1 : 1; put('root_cluster_01', side > 0 ? b.x1 + .1 : b.x0 - .1, top(b, z) - 1.6, z, 2.2, side > 0 ? Math.PI / 2 : -Math.PI / 2);}
    }
    put('fir_tree_01_c', -7.5, 0, 4, 16); put('pine_tree_01_c', 8, 0, 12, 18);
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
      if (r.ground && l.prevVy < -6) l.squash = Math.min(.3, -l.prevVy * .022); l.prevVy = r.vy; l.squash = Math.max(0, l.squash - dt * 2.2);
      const sy = 1 - l.squash, sxz = 1 / Math.sqrt(sy), ghost = r.character === 'ghost' ? .25 + Math.sin(c.time * 3 + r.slot) * .08 : 0;
      l.root.position.set(r.x, r.y + ghost, r.z); l.root.scale.set(sxz, sy, sxz);
      const yaw = r.facing; let d = yaw - l.root.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); l.root.rotation.y += d * Math.min(1, dt * 14);
      l.mixer.update(dt);
    }
    // camera: behind and above the player, framed wider in portrait
    const me = this.me, portrait = this.camera.aspect < 1, k = Math.min(1, dt * 5);
    this.camTarget.x += (me.x * .75 - this.camTarget.x) * k; this.camTarget.z += (me.z - this.camTarget.z) * k; this.camTarget.y += (Math.max(me.y, -4) - this.camTarget.y) * Math.min(1, dt * 2.5);
    const back = portrait ? 12.5 : 10, up = portrait ? 8.5 : 6.8;
    this.camera.position.set(this.camTarget.x, this.camTarget.y + up, this.camTarget.z - back); this.camera.lookAt(this.camTarget.x, this.camTarget.y + 1, this.camTarget.z + 6);
    this.sun.position.set(this.camTarget.x + 18, this.camTarget.y + 30, this.camTarget.z - 4); this.sun.target.position.set(this.camTarget.x, this.camTarget.y, this.camTarget.z + 8);
    this.scene.getObjectByName('sky')!.position.copy(this.camera.position);
  }

  private hudUpdate() {
    const w = innerWidth, h = innerHeight, v = new THREE.Vector3();
    for (const [r, l] of this.looks) {v.set(r.x, r.y + H + .55, r.z).project(this.camera); const on = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
      l.tag.style.display = on ? '' : 'none'; if (on) l.tag.style.transform = `translate(${(v.x * .5 + .5) * w}px,${(-v.y * .5 + .5) * h}px) translate(-50%,-100%)`;}
    const t = this.timeLeft(); setText('timer', `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`);
    const n = Math.ceil(COUNTDOWN - .5 - this.clock); setText('count', this.clock < COUNTDOWN ? (n > 0 ? String(n) : 'ВПЕРЁД!') : '');
    const st = this.standings(); setText('place', `${st.indexOf(this.me) + 1}/${st.length}`);
    const prog = Math.min(1, Math.max(0, this.me.progress / this.course.finishZ)); (document.getElementById('bar') as HTMLElement).style.width = `${prog * 100}%`;
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

  private resize() {const w = innerWidth, h = innerHeight; this.renderer.setSize(w, h); this.camera.aspect = w / h; this.camera.fov = w < h ? 68 : 55; this.camera.updateProjectionMatrix();}
  private model(url: string) {let p = this.cache.get(url); if (!p) {p = this.gltf.loadAsync(url); this.cache.set(url, p);} return p;}
  private tex(url: string, repeat = true, color = true) {const t = this.texLoader.load(url); if (color) t.colorSpace = THREE.SRGBColorSpace; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t;}
  private mat(name: string, _tile: number) {
    const arm = this.tex(`tex/${name}/arm.jpg`, true, false);
    return new THREE.MeshStandardMaterial({map: this.tex(`tex/${name}/diffuse.jpg`), normalMap: this.tex(`tex/${name}/nor_gl.jpg`, true, false), roughnessMap: arm, roughness: 1, metalness: 0});
  }
}

/** Box/ramp with world-scaled UVs: group 0 = walking face, group 1 = cliff faces. */
function blockGeometry(b: Block) {
  const pos: number[] = [], nor: number[] = [], uv: number[] = [], idx: number[] = []; const g = new THREE.BufferGeometry();
  const tile = b.mat === 'plank' ? 2.2 : 3.2, st = 4;
  const quad = (p: number[][], n: number[], tl: number, mode: 'xz' | 'zy' | 'xy') => {const base = pos.length / 3;
    for (const q of p) {pos.push(...q); nor.push(...n); uv.push(mode === 'xz' ? q[0] / tl : mode === 'zy' ? q[2] / tl : q[0] / tl, mode === 'xz' ? q[2] / tl : q[1] / tl);}
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);};
  const {x0, x1, z0, z1, y0, y1, bottom: bt} = b; const ny = 1, nz = -(y1 - y0) / (z1 - z0), l = Math.hypot(ny, nz);
  quad([[x0, y0, z0], [x0, y1, z1], [x1, y1, z1], [x1, y0, z0]], [0, ny / l, nz / l], tile, 'xz'); const topCount = idx.length;
  quad([[x0, bt, z0], [x0, y0, z0], [x1, y0, z0], [x1, bt, z0]], [0, 0, -1], st, 'xy');
  quad([[x1, bt, z1], [x1, y1, z1], [x0, y1, z1], [x0, bt, z1]], [0, 0, 1], st, 'xy');
  quad([[x0, bt, z1], [x0, y1, z1], [x0, y0, z0], [x0, bt, z0]], [-1, 0, 0], st, 'zy');
  quad([[x1, bt, z0], [x1, y0, z0], [x1, y1, z1], [x1, bt, z1]], [1, 0, 0], st, 'zy');
  if (b.mat === 'plank' || b.crumbles) quad([[x0, bt, z0], [x1, bt, z0], [x1, bt, z1], [x0, bt, z1]], [0, -1, 0], st, 'xz');
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  g.addGroup(0, topCount, 0); g.addGroup(topCount, idx.length - topCount, 1); return g;
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
