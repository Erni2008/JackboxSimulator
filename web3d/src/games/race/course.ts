// Obstacle race course + physics. The course is assembled from a library of sections, shuffled by a seed, so every
// race is different; the seed is all a phone needs to rebuild the exact same course. Moving parts are deterministic from
// the shared clock, so every phone sees the same logs, barrels and rocks; each phone simulates only its own runner.
export type Mat = 'grass' | 'plank' | 'stone' | 'cobble' | 'brick' | 'dark' | 'mud' | 'floor' | 'flag';
export type Theme = 'cliffs' | 'graveyard' | 'manor' | 'crypt';
export const THIN: Mat[] = ['plank', 'dark'];
/** Indoor room: walls at ±halfW from z0 to z1, ceiling at floor + h. */
export interface Room {z0: number; z1: number; halfW: number; y: number; h: number; skylights: boolean}
export interface Block {x0: number; x1: number; z0: number; z1: number; bottom: number; y0: number; y1: number; mat: Mat;
  driftAmp: number; driftPeriod: number; driftPhase: number; crumbles: boolean; crumbleDelay: number; sink: boolean;
  liftAmp: number; liftPeriod: number; liftPhase: number; conveyor: number; trapPeriod: number; trapPhase: number; warn: boolean;
  lastOffY: number; offX: number; offY: number; lastOffX: number; crumbleAt: number; fallV: number; gone: boolean; land?: boolean; wall?: boolean; ghost?: boolean;
  /** platform tilt (rise per metre along x / z), tilting chamber and rolling beams */ tiltX: number; tiltZ: number; tilt?: Tilt;
  restoreAfter: number; fake?: boolean; cart?: Cart; gear?: Gear}
export interface Tilt {amp: number; period: number; seed: number; axis: 'xz' | 'x'; warn: boolean}
/** Flat turntable gear: you stand on it and turn with it; missing sectors drop you. */
export interface Gear {x: number; z: number; y: number; r: number; speed: number; move: number; stop: number; phase: number; gaps: [number, number][]; angle: number; lastAngle: number; teeth: number; block: Block}
/** Mine cart running across the course on a looped track (tunnels at both ends). */
/** The track runs CART_TUNNEL past each mouth (at len + .48) so a cart slides fully into the dark before it wraps. */
export const CART_TUNNEL = 2.6;
export interface Cart {lane: number; speed: number; len: number; base: number; move: number; stop: number}
/** Gate across the corridor: two sliding leaves or a dropping portcullis. */
export interface Gate {z: number; y: number; halfW: number; kind: 'slide' | 'drop'; period: number; phase: number; open: number; lastOpen: number; warn: boolean}
/** Industrial fan: blows along (dx,dz) over a zone, cycles on/off. */
export interface Fan {x: number; z: number; y: number; dx: number; dz: number; reach: number; half: number; force: number; period: number; phase: number; on: number; spin: number}
/** Chain hook fired from a pillar beyond the edge; grabs a runner and drags them off the platform. */
export interface Hook {side: number; pillarX: number; z: number; y: number; reach: number; period: number; phase: number; ext: number; state: number}
/** Giant boulder rolling down a winding corridor on a fixed schedule. */
export interface Chaser {path: [number, number][]; y: number; r: number; period: number; phase: number; x: number; z: number; spin: number; active: boolean; dist: number}
/** Portal: step in, come out somewhere else (good / short / back to start). */
export interface Portal {x: number; y: number; z: number; r: number; tx: number; ty: number; tz: number; kind: 'far' | 'near' | 'back'; used: number}
export interface Sweeper {x: number; y: number; z: number; len: number; speed: number; angle: number; arms?: number; angle0?: number; vary?: 'const' | 'pulse' | 'reverse'; lastAngle?: number; boost?: number}
export interface Pendulum {px: number; py: number; pz: number; len: number; amp: number; period: number; phase: number; radius: number; bx: number; by: number; bz: number; swing: number}
export interface Faller {id: number; x: number; z: number; g: number; spawn: number; impact: number; r: number; y: number; alive: boolean; landed: boolean}
export interface Boulder {x: number; y: number; z: number; vz: number; spin: number; radius: number; alive: boolean}
/** Ram that shoots out of a side wall. */
export interface Pusher {side: number; wallX: number; z: number; d: number; y: number; reach: number; period: number; phase: number; ext: number; lastExt: number}
/** Floor hazard that fires periodically: flame jet or crushing hammer. */
export interface Jet {x: number; z: number; y: number; r: number; period: number; phase: number; kind: 'fire' | 'hammer'; state: number}
/** Spring pad that launches runners forward over a gap. */
export interface Pad {x: number; z: number; y: number; r: number; fired: number}

export const R = .42, H = 1.55, DEATH_Y = -12, BOTTOM = -16;
const clamp = (v: number, a: number, b: number) => v < a ? a : v > b ? b : v;
export const top = (b: Block, z: number, x = (b.x0 + b.x1) / 2 + b.offX) => {const t = b.z1 === b.z0 ? 0 : clamp((z - b.z0) / (b.z1 - b.z0), 0, 1); return b.y0 + (b.y1 - b.y0) * t + b.offY + b.tiltX * (x - (b.x0 + b.x1) / 2 - b.offX) + b.tiltZ * (z - (b.z0 + b.z1) / 2);};

export class Runner {
  x = 0; y = 0; z = 0; vx = 0; vy = 0; vz = 0; inX = 0; inZ = 0; facing = 0; stun = 0; coyote = 0; jumpBuffer = 0;
  progress = 0; finishTime = 0; jump = false; holdJump = false; finished = false; checkpoint = 0; falls = 0;
  ground: Block | null = null; botCool = 0; landed = 0; hook = -1; wind = 0;
  constructor(public id: string, public name: string, public character: string, public slot: number, public bot: boolean) {}
}

type Look = {main: Mat; alt: Mat; thin: Mat; land: Mat; crumble: Mat};
const LOOK: Record<Theme, Look> = {
  cliffs: {main: 'grass', alt: 'stone', thin: 'plank', land: 'grass', crumble: 'stone'},
  graveyard: {main: 'cobble', alt: 'brick', thin: 'dark', land: 'mud', crumble: 'mud'},
  manor: {main: 'floor', alt: 'flag', thin: 'floor', land: 'flag', crumble: 'floor'},
  crypt: {main: 'flag', alt: 'flag', thin: 'floor', land: 'flag', crumble: 'flag'},
};
export const SECTION_NAMES: Record<string, string> = {gears: 'Гигантские шестерни', gates: 'Смертельные ворота', wind: 'Ветряной коридор', chase: 'Катящийся валун', tilt: 'Переворачивающаяся комната', hooks: 'Крюки', falsebridge: 'Ложный мост', minecarts: 'Безумные вагонетки', spinner: 'Мельница', gaps: 'Провалы', pendulums: 'Маятники', rafts: 'Плоты', crumble: 'Обвал пола',
  sink: 'Трясина', pushers: 'Тараны', pads: 'Батуты', traps: 'Люки', conveyor: 'Транспортёр', flames: 'Огненный пол', gauntlet: 'Мясорубка', highlow: 'Верх-низ', hammers: 'Молоты', beams: 'Узкие балки', zigzag: 'Змейка', maze: 'Лабиринт', fakewalls: 'Ложные стены', portals: 'Порталы', ramp: 'Скат', rain: 'Дождь с неба',};

/** All 29 trials, numbered for ?t=N test runs. */
export const TRIALS = ['spinner', 'gauntlet', 'highlow', 'gaps', 'beams', 'pendulums', 'rafts', 'crumble', 'sink', 'pushers', 'pads', 'traps', 'conveyor', 'flames', 'hammers', 'zigzag', 'ramp', 'rain', 'maze', 'fakewalls', 'portals',
  'gears', 'gates', 'wind', 'chase', 'tilt', 'hooks', 'falsebridge', 'minecarts'];

export class Course {
  blocks: Block[] = []; sweepers: Sweeper[] = []; pendulums: Pendulum[] = []; boulders: Boulder[] = []; fallers: Faller[] = [];
  pushers: Pusher[] = []; jets: Jet[] = []; gears: Gear[] = []; gates: Gate[] = []; fans: Fan[] = []; hooks: Hook[] = []; chasers: Chaser[] = []; carts: Block[] = []; tilts: Block[] = []; pads: Pad[] = []; portals: Portal[] = []; mazePath: [number, number][] = []; mazeBox = [0, 0, 0, 0]; rooms: Room[] = []; sections: {name: string; z0: number; z1: number}[] = [];
  fallZones: [number, number, number, number][] = []; checkpoints: number[] = [0]; finishZ = 0; time = 0;
  rampZ0 = 0; rampZ1 = 0; rampY0 = 0; rampY1 = 0; rampHalfW = 4; theme: Theme; deathY = DEATH_Y;
  private boulderTimer = 1.2; private seed = 7; private fallTimer = 0; private fallSeed = 99; private fallId = 0;
  private look: Look; private z = 0; private y = 0; private rs: number;

  constructor(public map = 1, public courseSeed = 1, public only = '') {
    this.theme = map === 4 ? 'crypt' : map === 3 ? 'manor' : map === 2 ? 'graveyard' : 'cliffs';
    this.deathY = this.theme === 'manor' || this.theme === 'crypt' ? -6 : this.theme === 'graveyard' ? -2.4 : DEATH_Y;
    this.look = LOOK[this.theme]; this.rs = (courseSeed >>> 0) || 1;
    this.build();
  }
  private rnd() {this.rs = (Math.imul(this.rs, 1103515245) + 12345) >>> 0; return (this.rs >>> 8 & 65535) / 65535;}

  private build() {
    const L = this.look;
    this.add(-10, 10, -6, 20, 0, 0, L.land).land = true; this.room(-8, 20, 10, 10); this.z = 20;
    const NEW = ['gears', 'gates', 'wind', 'chase', 'tilt', 'hooks', 'falsebridge', 'minecarts'];
    const shuffle = <T,>(a: T[]) => {for (let i = a.length - 1; i > 0; i--) {const j = Math.floor(this.rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]];} return a;};
    const pool = shuffle(['spinner', 'gaps', 'pendulums', 'rafts', 'crumble', 'pushers', 'pads', 'traps', 'conveyor', 'flames', 'hammers', 'beams', 'zigzag', ...(this.theme === 'graveyard' ? ['sink'] : [])].filter(n => !(this.theme === 'manor' && n === 'pads')));
    const fresh = shuffle([...NEW]);
    let order: string[];
    if (this.theme === 'cliffs') {const a = shuffle(['gauntlet', 'highlow', 'spinner', 'pads']); const n = shuffle(['gears', 'minecarts', 'falsebridge', 'wind', 'chase']);
      order = [a[0], n[0], a[1], 'ramp', n[1], a[2], n[2], a[3]];}
    else if (this.theme === 'crypt') {const extra = [...fresh.filter(n => n !== 'minecarts').slice(0, 2), pool[0]]; const core = ['maze', 'fakewalls', 'portals', 'maze', this.rnd() < .5 ? 'portals' : 'fakewalls'];
      for (let i = core.length - 1; i > 1; i--) {const j = 1 + Math.floor(this.rnd() * i); [core[i], core[j]] = [core[j], core[i]];}
      order = []; core.forEach((c, i) => {order.push(c); if (extra[i]) order.push(extra[i]);}); order.push('rain');}
    else {order = [pool[0], fresh[0], pool[1], fresh[1], 'ramp', pool[2], fresh[2], pool[3]]; order.push(this.theme === 'manor' ? 'pads' : 'rain');}
    // never the same trial twice in a row
    for (let i = 1; i < order.length; i++) if (order[i] === order[i - 1]) {const j = order.findIndex((o, k) => k > i && o !== order[i]); if (j > 0) [order[i], order[j]] = [order[j], order[i]];}
    if (this.only) order = [this.only];
    for (const name of order) {
      const z0 = this.z; (this as any)['s_' + name](); this.sections.push({name, z0, z1: this.z});
      this.add(-6, 6, this.z, this.z + 6, this.y, this.y, L.land).land = true; this.room(this.z, this.z + 6, 6.6, 8, false); this.checkpoints.push(this.z + 2.5); this.z += 6;
    }
    this.z += 1.8; this.add(-11, 11, this.z, this.z + 22, this.y, this.y, L.alt).land = true; this.room(this.z, this.z + 22, 11.6, 12); this.finishZ = this.z + 12;
  }

  // ---------------- sections ----------------
  /** Mill: single / twin counter / 4-arm cross / speed pulses / reversing direction. */
  private s_spinner() {const v = Math.floor(this.rnd() * 5), y = this.y, z = this.z, sp = (1.1 + this.rnd() * .6) * (this.rnd() < .5 ? -1 : 1);
    this.add(-10, 10, z, z + 26, y, y, this.look.alt); this.room(z, z + 26, 10.6, 9);
    if (v === 0) this.sweepers.push({x: 0, y: y + .55, z: z + 13, len: 10.2, speed: sp, angle: 0});
    else if (v === 1) this.sweepers.push({x: 0, y: y + .55, z: z + 10.5, len: 10.2, speed: sp * 1.2, angle: 0}, {x: 0, y: y + 1.2, z: z + 15.5, len: 10.2, speed: -sp * 1.35, angle: 1});
    else if (v === 2) this.sweepers.push({x: 0, y: y + .55, z: z + 13, len: 10.2, speed: sp * .95, angle: 0, arms: 2});
    else if (v === 3) this.sweepers.push({x: 0, y: y + .55, z: z + 13, len: 10.2, speed: sp, angle: 0, vary: 'pulse'});
    else this.sweepers.push({x: 0, y: y + .55, z: z + 13, len: 10.2, speed: sp * 1.2, angle: 0, arms: 2, vary: 'reverse'});
    this.z += 26;}
  private s_gaps() {const n = 6 + Math.floor(this.rnd() * 2), zig = this.rnd() < .5; const z0 = this.z;
    for (let i = 0; i < n; i++) {const len = 2 + this.rnd() * 1.2, x = zig ? (i % 2 ? 1.3 : -1.3) : 0; this.add(x - 2.2, x + 2.2, this.z, this.z + len, this.y, this.y, this.look.thin).bottom = this.y - .45; this.z += len + (i < n - 1 ? 1.5 + this.rnd() * .4 : 0);}
    this.room(z0, this.z, 5, 8);}
  private s_pendulums() {const len = 32 + this.rnd() * 6, y = this.y, z = this.z, n = 4, per = 2.2 + this.rnd() * .6;
    this.add(-4.5, 4.5, z, z + len, y, y, this.look.main); this.room(z, z + len, 5.1, 9);
    for (let i = 0; i < n; i++) this.pendulums.push({px: 0, py: y + 7.8, pz: z + 5 + i * (len - 8) / (n - 1), len: 6.3, amp: .95, period: per, phase: i * (1.1 + this.rnd()), radius: 1.05, bx: 0, by: 0, bz: 0, swing: 0});
    this.z += len;}
  private s_rafts() {const z0 = this.z; for (let i = 0; i < 4; i++) {const b = this.add(-2.2, 2.2, this.z + 1.6, this.z + 6, this.y, this.y, this.look.thin); b.bottom = this.y - .45; b.driftAmp = 3.6 + this.rnd(); b.driftPeriod = 3 + this.rnd(); b.driftPhase = this.rnd() * 6; this.z += 6;}
    this.z += 1.6; this.room(z0, this.z, 7, 9);}
  /** Collapsing floor: step on a slab -> cracks -> shakes -> drops after 0.7 s; slabs come back for the runners behind. */
  private s_crumble() {const rows = 5 + Math.floor(this.rnd() * 2), z0 = this.z;
    for (let r = 0; r < rows; r++) for (const c of [-1, 0, 1]) {const b = this.add(c * 3 - 1.3, c * 3 + 1.3, this.z + r * 3.1 + .25, this.z + r * 3.1 + 2.85, this.y, this.y, this.look.crumble); b.crumbles = true; b.crumbleDelay = .7; b.bottom = this.y - .7;}
    this.z += rows * 3.1; this.room(z0, this.z, 6.6, 8);}
  private s_sink() {const z0 = this.z; for (let r = 0; r < 4; r++) for (const c of [-1, 0, 1]) {const b = this.add(c * 3 - 1.2, c * 3 + 1.2, this.z + r * 3 + .3, this.z + r * 3 + 2.7, this.y, this.y, 'mud'); b.crumbles = true; b.sink = true; b.crumbleDelay = .35; b.bottom = this.y - .7;}
    this.z += 12.6; this.room(z0, this.z, 6.6, 8);}
  private s_pushers() {const len = 34, y = this.y, z = this.z, w = 4.2; this.add(-w, w, z, z + len, y, y, this.look.main); this.room(z, z + len, w + .6, 8);
    for (let i = 0; i < 6; i++) this.pushers.push({side: i % 2 ? 1 : -1, wallX: w + .2, z: z + 4 + i * 5.3, d: 2.4, y, reach: w * 1.15, period: 2.2 + this.rnd() * .5, phase: this.rnd(), ext: 0, lastExt: 0});
    this.z += len;}
  private s_pads() {const z0 = this.z; for (let i = 0; i < 3; i++) {const len = 5; this.add(-3.5, 3.5, this.z, this.z + len, this.y, this.y, this.look.alt); this.pads.push({x: 0, z: this.z + len - 1.4, y: this.y, r: 1.3, fired: -9});
      this.z += len + (i === 0 ? 6 + this.rnd() * 1.5 : 3.6 + this.rnd() * .6); this.y += this.rnd() < .5 ? .8 : 0;}
    this.add(-3.5, 3.5, this.z, this.z + 3, this.y, this.y, this.look.alt); this.z += 3; this.room(z0, this.z, 5, 11);}
  private s_traps() {const rows = 6, z0 = this.z, per = 2.6 + this.rnd() * .6, wave = this.rnd() < .5;
    for (let r = 0; r < rows; r++) for (const c of [-1, 0, 1]) {const b = this.add(c * 2.6 - 1.25, c * 2.6 + 1.25, this.z + r * 2.6, this.z + r * 2.6 + 2.5, this.y, this.y, this.look.alt); b.bottom = this.y - .35;
      b.trapPeriod = per; b.trapPhase = wave ? r * .14 + c * .05 : ((r * 3 + c + 7) * .37) % 1;}
    this.z += rows * 2.6; this.room(z0, this.z, 4.6, 8);}
  private s_conveyor() {const len = 30, y = this.y, z = this.z, b = this.add(-4, 4, z, z + len, y, y, this.look.main); b.conveyor = -(3.2 + this.rnd() * 1.2); this.room(z, z + len, 4.6, 8);
    for (let i = 0; i < 4; i++) {const zz = z + 5 + i * 6.5, sd = i % 2 ? 1 : -1, full = this.rnd() < .35; this.add(full ? -4 : sd > 0 ? -.4 : -4, full ? 4 : sd > 0 ? 4 : .4, zz, zz + .6, y + .75, y + .75, this.look.alt).bottom = y;}
    this.z += len;}
  private s_ramp() {const len = 30 + this.rnd() * 6, rise = 6 + this.rnd() * 2, w = this.theme === 'manor' ? 4 : 6;
    this.rampZ0 = this.z; this.rampZ1 = this.z + len; this.rampY0 = this.y; this.rampY1 = this.y + rise; this.rampHalfW = w - .6;
    this.add(-w, w, this.z, this.z + len, this.y, this.y + rise, this.look.alt); this.room(this.z, this.z + len, w + .6, 10 + rise); this.z += len; this.y += rise;}
  private s_rain() {const len = 40 + this.rnd() * 6; this.add(-5.5, 5.5, this.z, this.z + len, this.y, this.y, this.look.alt); this.fallZones.push([-4.5, 4.5, this.z + 2, this.z + len - 1]); this.room(this.z, this.z + len, 6.1, 10); this.z += len;}
  private wallBlock(x0: number, x1: number, z0: number, z1: number, h = 2.8, ghost = false) {const b = this.add(x0, x1, z0, z1, this.y + h, this.y + h, 'flag'); b.bottom = this.y; b.wall = true; b.ghost = ghost; return b;}
  /** Seeded labyrinth: 9x8 cells, braided with loops so wall-following fails, per-race variant (classic / trapdoor cells /
   *  secret walls / portal cells). Bots follow the solved path. */
  private s_maze() {
    const C = 9, Rr = 8, cs = 3, W = C * cs, z0 = this.z + 1, x0 = -W / 2, t = .35, y = this.y;
    const variant = this.pick(['classic', 'traps', 'secret', 'portals']);
    const seen = new Set<number>(), open = new Set<string>(), key = (a: number, b: number) => a < b ? a + ':' + b : b + ':' + a, id = (c: number, r: number) => r * C + c;
    const startC = Math.floor(C / 2), exitC = Math.floor(this.rnd() * C);
    const stack = [[startC, 0]]; seen.add(id(startC, 0));
    while (stack.length) {const [c, r] = stack[stack.length - 1]; const nb = [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]].filter(([a, b]) => a >= 0 && a < C && b >= 0 && b < Rr && !seen.has(id(a, b)));
      if (!nb.length) {stack.pop(); continue;} const [a, b] = nb[Math.floor(this.rnd() * nb.length) % nb.length]; open.add(key(id(c, r), id(a, b))); seen.add(id(a, b)); stack.push([a, b]);}
    // braid: knock out some walls to make loops (no single "follow the wall" solution)
    for (let i = 0; i < 9; i++) {const c = Math.floor(this.rnd() * (C - 1)), r = Math.floor(this.rnd() * Rr); if (this.rnd() < .5) open.add(key(id(c, r), id(c + 1, r))); else if (r < Rr - 1) open.add(key(id(c, r), id(c, r + 1)));}
    const prev = new Map<number, number>(), q = [id(startC, 0)]; prev.set(id(startC, 0), -1);
    while (q.length) {const cur = q.shift()!, c = cur % C, r = Math.floor(cur / C); for (const [a, b] of [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]]) {if (a < 0 || a >= C || b < 0 || b >= Rr) continue; const n = id(a, b); if (prev.has(n) || !open.has(key(cur, n))) continue; prev.set(n, cur); q.push(n);}}
    const sol: number[] = []; for (let n = id(exitC, Rr - 1); n !== -1; n = prev.get(n)!) sol.unshift(n); const onPath = new Set(sol);
    // floor: one slab per cell (trap variant turns some off-path cells into trapdoors)
    for (let r = 0; r < Rr; r++) for (let c = 0; c < C; c++) {const b = this.add(x0 + c * cs, x0 + (c + 1) * cs, z0 + r * cs, z0 + (r + 1) * cs, y, y, this.look.main);
      if (variant === 'traps' && !onPath.has(id(c, r)) && this.rnd() < .45) {b.trapPeriod = 2.2 + this.rnd(); b.trapPhase = this.rnd(); b.bottom = y - .35;}
      if (variant === 'traps' && onPath.has(id(c, r)) && r > 0 && r < Rr - 1 && this.rnd() < .22) {b.trapPeriod = 3; b.trapPhase = this.rnd(); b.bottom = y - .35;}}
    this.add(-W / 2 - .5, W / 2 + .5, this.z, z0, y, y, this.look.main); this.add(-W / 2 - .5, W / 2 + .5, z0 + Rr * cs, z0 + Rr * cs + 1, y, y, this.look.main);
    this.room(this.z, z0 + Rr * cs + 1, W / 2 + 1.1, 12);
    // secret variant: a few solid-looking walls on shortcuts are fake
    const ghosts = new Set<string>(); if (variant === 'secret') for (let i = 0; i < 5; i++) {const c = Math.floor(this.rnd() * (C - 1)), r = Math.floor(this.rnd() * Rr); const k = key(id(c, r), id(c + 1, r)); if (!open.has(k)) ghosts.add(k);}
    for (let r = 0; r <= Rr; r++) for (let c = 0; c < C; c++) {
      const isOpen = r === 0 ? c === startC : r === Rr ? c === exitC : open.has(key(id(c, r - 1), id(c, r)));
      if (!isOpen) this.wallBlock(x0 + c * cs - t / 2, x0 + (c + 1) * cs + t / 2, z0 + r * cs - t / 2, z0 + r * cs + t / 2, 3);}
    for (let r = 0; r < Rr; r++) for (let c = 0; c <= C; c++) {
      const k = c > 0 && c < C ? key(id(c - 1, r), id(c, r)) : ''; const isOpen = k !== '' && open.has(k);
      if (!isOpen) this.wallBlock(x0 + c * cs - t / 2, x0 + c * cs + t / 2, z0 + r * cs - t / 2, z0 + (r + 1) * cs + t / 2, 3, ghosts.has(k));}
    // portal variant: two portal cells — one jumps you to a cell next to the exit, one back to the entrance
    if (variant === 'portals') {const cells = [...Array(C * Rr).keys()].filter(n => !onPath.has(n) && Math.floor(n / C) > 1 && Math.floor(n / C) < Rr - 1); for (let i = cells.length - 1; i > 0; i--) {const j = Math.floor(this.rnd() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]];}
      const ex = sol[Math.max(0, sol.length - 2)], st = sol[0], cc = (n: number) => [x0 + (n % C + .5) * cs, z0 + (Math.floor(n / C) + .5) * cs];
      cells.slice(0, 2).forEach((n, i) => {const [px, pz] = cc(n), [tx, tz] = cc(i === 0 ? ex : st); this.portals.push({x: px, y, z: pz, r: .9, tx, ty: y, tz, kind: i === 0 ? 'far' : 'back', used: -9});});}
    const path: [number, number][] = sol.map(n => [x0 + (n % C + .5) * cs, z0 + (Math.floor(n / C) + .5) * cs]);
    path.unshift([0, z0 - .6]); path.push([x0 + (exitC + .5) * cs, z0 + Rr * cs + .8]);
    this.mazePaths.push({box: [x0, x0 + W, z0 - 1, z0 + Rr * cs + 1], path, variant});
    this.z = z0 + Rr * cs + 1;
  }
  mazePaths: {box: number[]; path: [number, number][]; variant: string}[] = [];
  fakeWalls: {z: number; slots: number[]; real: number}[] = [];
  /** Sealed cross walls — no doorway at all. One panel in each wall is fake: find it by running into the stone. */
  private s_fakewalls() {const n = 4 + Math.floor(this.rnd() * 2), gapZ = 6.5, len = 3 + n * gapZ, w = 5, z = this.z, t = .5, pw = 2;
    this.add(-w, w, z, z + len, this.y, this.y, this.look.main); this.room(z, z + len, w + .6, 9);
    const slots = [-3.75, -1.25, 1.25, 3.75];
    for (let i = 0; i < n; i++) {const wz = z + 4 + i * gapZ, real = Math.floor(this.rnd() * slots.length) % slots.length;
      slots.forEach((sx, k) => this.wallBlock(sx - pw / 2 - (k === 0 ? .25 : 0), sx + pw / 2 + (k === 3 ? .25 : 0), wz, wz + t, 3.2, k === real));
      this.fakeWalls.push({z: wz, slots, real});}
    this.z += len;}
  /** 3-5 look-alike portals before a sealed wall; one goes far past a trap corridor, one near, the rest send you back. */
  private s_portals() {const z = this.z, w = 7, y = this.y, n = 3 + Math.floor(this.rnd() * 3); this.add(-w, w, z, z + 12, y, y, this.look.main); this.room(z, z + 12, w + .6, 9);
    this.wallBlock(-w, w, z + 11, z + 12, 5);
    const cz = z + 12; this.add(-4, 4, cz, cz + 4, y, y, this.look.main);
    for (let r = 0; r < 5; r++) for (const c of [-1, 0, 1]) {const b = this.add(c * 2.6 - 1.25, c * 2.6 + 1.25, cz + 4 + r * 2.6, cz + 4 + r * 2.6 + 2.5, y, y, this.look.alt); b.bottom = y - .35; b.trapPeriod = 2.4; b.trapPhase = r * .15 + c * .04;}
    const end = cz + 17; this.add(-4, 4, end, end + 4, y, y, this.look.main); this.room(cz, end + 4, 4.6, 9);
    const kinds: Portal['kind'][] = ['far', 'near', ...Array(n - 2).fill('back')]; if (n >= 4 && this.rnd() < .5) kinds[2] = 'near'; for (let i = kinds.length - 1; i > 0; i--) {const j = Math.floor(this.rnd() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]];}
    kinds.forEach((k, i) => {const x = -((n - 1) * 2.9) / 2 + i * 2.9; const tz = k === 'far' ? end + 2 : k === 'near' ? cz + 1.5 : z + 1.5; this.portals.push({x, y, z: z + 8, r: 1.05, tx: 0, ty: y, tz, kind: k, used: -9});});
    this.z = end + 4;}
  private pick<T>(a: T[]) {return a[Math.floor(this.rnd() * a.length) % a.length];}

  /** Arena of overlapping spinners: different lengths, speeds and directions — timing puzzle. */
  /** Meat grinder: five logs, independent speeds, two at shin height and one at head height, periodic surges (warning lamps). */
  private s_gauntlet() {const z = this.z, y = this.y, len = 40; this.add(-11, 11, z, z + len, y, y, this.look.alt); this.room(z, z + len, 11.6, 9);
    const sp = 1 + this.rnd() * .4, k = () => .8 + this.rnd() * .5;
    this.sweepers.push({x: -4.5, y: y + .55, z: z + 9, len: 6.7, speed: sp * 1.6 * k(), angle: 0, vary: 'pulse'}, {x: 4.5, y: y + .55, z: z + 9, len: 6.7, speed: -sp * 1.6 * k(), angle: 1.5},
      {x: 0, y: y + .55, z: z + 20, len: 11.2, speed: sp * k(), angle: .7, arms: 2, vary: 'pulse'}, {x: -4, y: y + 2.1, z: z + 31, len: 7.2, speed: -sp * 1.3 * k(), angle: 2}, {x: 4, y: y + .55, z: z + 31, len: 7.2, speed: sp * 1.3 * k(), angle: .3, vary: 'pulse'});
    this.z += len;}
  private s_highlow() {const z = this.z, y = this.y, len = 34; this.add(-9, 9, z, z + len, y, y, this.look.alt); this.room(z, z + len, 9.6, 10);
    for (let i = 0; i < 3; i++) {const sz = z + 6 + i * 11, sp = (1.1 + this.rnd() * .5) * (i % 2 ? -1 : 1); this.sweepers.push({x: 0, y: y + .55, z: sz, len: 9.2, speed: sp, angle: 0}, {x: 0, y: y + 2.3, z: sz, len: 9.2, speed: sp, angle: Math.PI / 2});}
    this.z += len;}
  private s_flames() {const len = 30, w = 5, z = this.z, y = this.y; this.add(-w, w, z, z + len, y, y, this.look.alt); this.room(z, z + len, w + .6, 9);
    const per = 2.4 + this.rnd() * .6, pat = Math.floor(this.rnd() * 3);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) {const x = -3.75 + c * 2.5, zz = z + 3 + r * 4.4;
      const ph = pat === 0 ? r * .17 : pat === 1 ? ((r + c) % 2) * .5 : this.rnd(); this.jets.push({x, z: zz, y, r: 1, period: per, phase: ph, kind: 'fire', state: 0});}
    this.z += len;}
  private s_hammers() {const len = 32, w = 4.5, z = this.z, y = this.y; this.add(-w, w, z, z + len, y, y, this.look.main); this.room(z, z + len, w + .6, 10);
    for (let i = 0; i < 5; i++) {const lanes = this.rnd() < .5 ? [-2.2, 2.2] : [0]; for (const x of lanes) this.jets.push({x, z: z + 4 + i * 6, y, r: 1.5, period: 2 + this.rnd() * .8, phase: this.rnd(), kind: 'hammer', state: 0});}
    this.z += len;}
  /** Narrow beams: static / crumbling / slowly rolling about their long axis / with side gusts. */
  private s_beams() {const z0 = this.z, y = this.y, v = Math.floor(this.rnd() * 4); let x = 0;
    const beam = (x0: number, x1: number, a: number, b: number) => {const bl = this.add(x0, x1, a, b, y, y, this.look.thin); bl.bottom = y - .4;
      if (v === 1) {bl.crumbles = true; bl.crumbleDelay = .7;} if (v === 2 && b - a > 2) {bl.tilt = {amp: .55, period: 3.4 + this.rnd(), seed: this.rnd() * 9, axis: 'x', warn: false}; this.tilts.push(bl);} return bl;};
    for (let i = 0; i < 6; i++) {const len = 5 + this.rnd() * 2, nx = (this.rnd() - .5) * 6; beam(Math.min(x, nx) - .55, Math.max(x, nx) + .55, this.z, this.z + .9);
      beam(nx - .55, nx + .55, this.z + .9, this.z + len); x = nx; this.z += len;}
    beam(Math.min(x, 0) - .55, Math.max(x, 0) + .55, this.z, this.z + 1); this.z += 1;
    if (v === 3) for (let i = 0; i < 3; i++) {const fz = z0 + 6 + i * 11, sd = i % 2 ? 1 : -1; this.fans.push({x: sd * 7, z: fz, y: y + 1.2, dx: -sd, dz: 0, reach: 14, half: 2.6, force: 6.5, period: 3.6, phase: i * .33, on: 0, spin: 0});}
    this.room(z0, this.z, 6, 9);}
  private s_zigzag() {const z0 = this.z, y = this.y, w = 6; this.add(-w, w, z0, z0 + 34, y, y, this.look.main); this.room(z0, z0 + 34, w + .6, 9);
    for (let i = 0; i < 5; i++) {const wz = z0 + 4 + i * 6, sd = i % 2 ? 1 : -1; this.wallBlock(sd > 0 ? -w : -w + 2.6, sd > 0 ? w - 2.6 : w, wz, wz + .5, 1.6);
      this.jets.push({x: sd * (w - 1.3), z: wz + 3, y, r: 1, period: 2.6, phase: i * .2, kind: 'fire', state: 0});}
    this.z += 34;}

  // ================= new trials =================
  /** Giant gears: flat turntables over the abyss, different sizes and directions, some pause, some have missing segments. */
  private s_gears() {const z0 = this.z, y = this.y, n = 5 + Math.floor(this.rnd() * 3); let z = this.z + 1, px = 0;
    for (let i = 0; i < n; i++) {const r = 2.2 + this.rnd() * 1.3, x = i === 0 ? 0 : clamp(px + (this.rnd() - .5) * 4, -3.5, 3.5); z += r;
      const g: Gear = {x, z, y, r, speed: (.45 + this.rnd() * .55) * (i % 2 ? -1 : 1), move: this.rnd() < .35 ? 2.4 : 99, stop: 1.2, phase: this.rnd() * 3, gaps: [], angle: 0, lastAngle: 0, teeth: Math.round(r * 7), block: null as any};
      if (this.rnd() < .45) {const a = this.rnd() * 6.28; g.gaps.push([a, a + .9 + this.rnd() * .5]);}
      const b = this.add(x - r, x + r, z - r, z + r, y, y, 'stone'); b.gear = g; b.bottom = y - .7; g.block = b; this.gears.push(g);
      z += r + 1.4 + this.rnd() * .5; px = x;}
    this.z = z - .6; this.room(z0, this.z, 7.5, 10);}
  /** Deadly gates: 5-8 gates with independent cycles; sliding leaves or dropping portcullis; some open in a wave. */
  private s_gates() {const n = 5 + Math.floor(this.rnd() * 4), gap = 5.2, len = 4 + n * gap, w = 3.4, z = this.z, y = this.y; this.add(-w, w, z, z + len, y, y, this.look.main); this.room(z, z + len, w + .6, 9);
    const wave = this.rnd() < .5, per = 3.2 + this.rnd() * .8;
    for (let i = 0; i < n; i++) {const gz = z + 4 + i * gap; this.wallBlock(-w - 1.2, -w, gz - .4, gz + .4, 4.2); this.wallBlock(w, w + 1.2, gz - .4, gz + .4, 4.2);
      this.gates.push({z: gz, y, halfW: w, kind: this.rnd() < .5 ? 'slide' : 'drop', period: wave ? per : 2.6 + this.rnd() * 1.6, phase: wave ? i * .09 : this.rnd(), open: 1, lastOpen: 1, warn: false});}
    this.z += len;}
  /** Wind corridor: side fans push you to the open edges, a head fan pushes you back; low partitions give shelter. */
  private s_wind() {const len = 36, w = 3.6, z = this.z, y = this.y; this.add(-w, w, z, z + len, y, y, this.look.main); this.room(z, z + len, w + 4, 10);
    const n = 4 + Math.floor(this.rnd() * 3);
    for (let i = 0; i < n - 1; i++) {const fz = z + 5 + i * (len - 10) / (n - 2), sd = i % 2 ? 1 : -1; this.fans.push({x: sd * (w + 2.6), z: fz, y: y + 1.3, dx: -sd, dz: 0, reach: 2 * w + 3, half: 2.4, force: 11 + this.rnd() * 4, period: 3 + this.rnd(), phase: this.rnd(), on: 0, spin: 0});
      this.wallBlock(sd > 0 ? w - 1.8 : -w + 1.4, sd > 0 ? w - 1.4 : -w + 1.8, fz - 3.6, fz - 2.2, 1.6);}
    this.fans.push({x: 0, z: z + len + 1.5, y: y + 1.3, dx: 0, dz: -1, reach: len, half: 2.2, force: 7, period: 4.2, phase: this.rnd(), on: 0, spin: 0});
    for (let i = 0; i < 3; i++) this.wallBlock(-1.2 + (i % 2) * 1.5, .3 + (i % 2) * 1.5, z + 8 + i * 9, z + 8.6 + i * 9, 1.3);
    this.z += len;}
  /** Rolling boulder: a huge sphere rolls down a winding corridor every few seconds, accelerating; hide in the side niches. */
  private s_chase() {const z0 = this.z, y = this.y, w = 2.1;
    const legs: [number, number, number][] = [[0, z0, z0 + 14], [3.6, z0 + 14, z0 + 30], [-2.8, z0 + 30, z0 + 46], [0, z0 + 46, z0 + 52]];
    let px = 0; for (const [x, a, b] of legs) {this.add(Math.min(px, x) - w, Math.max(px, x) + w, a, Math.min(b, a + 2 * w), y, y, this.look.alt); this.add(x - w, x + w, a, b, y, y, this.look.alt); px = x;}
    for (const [x, a, b] of legs.slice(0, 3)) {const nz = (a + b) / 2 + 1, sd = x > 0 ? -1 : 1; this.add(sd > 0 ? x + w : x - w - 2.2, sd > 0 ? x + w + 2.2 : x - w, nz - 1.3, nz + 1.3, y, y, this.look.main).land = false;
      this.add(x - .6, x + .6, (a + b) / 2 - 2.5, (a + b) / 2 - 2.1, y + .5, y + .5, this.look.alt).bottom = y;}
    const path: [number, number][] = [[0, z0 + .5], [0, z0 + 16], [3.6, z0 + 16], [3.6, z0 + 32], [-2.8, z0 + 32], [-2.8, z0 + 48], [0, z0 + 48], [0, z0 + 60]];
    this.chasers.push({path, y, r: 1.85, period: 9 + this.rnd() * 2, phase: this.rnd(), x: 0, z: z0, spin: 0, active: false, dist: 0});
    this.z = z0 + 52; this.room(z0, this.z, 7.5, 10);}
  /** Tilting chamber: big platform tilts on two axes in seeded sequences; lamps warn before a strong tilt; posts to steer around. */
  private s_tilt() {const z = this.z, y = this.y, len = 22, w = 6.5; this.add(-w, w, z, z + 1.5, y, y, this.look.main);
    const b = this.add(-w, w, z + 1.5, z + len - 1.5, y, y, this.look.alt); b.tilt = {amp: .3, period: 3, seed: this.rnd() * 99, axis: 'xz', warn: false}; b.bottom = y - 1.2; this.tilts.push(b);
    this.add(-w, w, z + len - 1.5, z + len, y, y, this.look.main); this.room(z, z + len, w + .6, 12);
    this.z += len;}
  /** Chain hooks: pillars beyond the edges fire hooks across the walkway; a hit drags you off the edge. */
  private s_hooks() {const len = 36, w = 2.8, z = this.z, y = this.y, n = 5 + Math.floor(this.rnd() * 4); this.add(-w, w, z, z + len, y, y, this.look.main); this.room(z, z + len, w + 5, 10);
    const seq = this.rnd() < .5;
    for (let i = 0; i < n; i++) {const sd = i % 2 ? 1 : -1; this.hooks.push({side: sd, pillarX: sd * (w + 3), z: z + 3 + i * (len - 6) / (n - 1), y: y + .9, reach: 2 * w + 3.4, period: 3.4, phase: seq ? i * .13 : (i % 3) * .33 + this.rnd() * .1, ext: 0, state: 0});}
    this.z += len;}
  /** False bridge: rows of 2-3 identical slabs; fakes shatter under you and stay gone for a while — watch the others. */
  private s_falsebridge() {const rows = 7, z0 = this.z, y = this.y; let z = this.z + .8;
    for (let r = 0; r < rows; r++) {const n = this.rnd() < .5 ? 2 : 3, xs = n === 2 ? [-1.5, 1.5] : [-2.8, 0, 2.8], real = Math.floor(this.rnd() * n) % n;
      xs.forEach((x, k) => {const b = this.add(x - 1.15, x + 1.15, z, z + 2.3, y, y, this.look.alt); b.bottom = y - .4; if (k !== real && !(n === 3 && this.rnd() < .2)) {b.fake = true; b.crumbles = true; b.crumbleDelay = .12; b.restoreAfter = 8;}});
      z += 2.3 + 1.2;}
    this.z = z - .4; this.room(z0, this.z, 5, 9);}
  /** Crazy minecarts: lanes of carts running across the abyss in both directions, pausing, vanishing into tunnels. */
  private s_minecarts() {const z0 = this.z, y = this.y, lanes = 5, L = 11; let z = this.z + 1.2;
    for (let i = 0; i < lanes; i++) {const sp = (2.2 + this.rnd() * 1.6) * (i % 2 ? -1 : 1), cnt = i % 2 ? 1 : 2;
      for (let k = 0; k < cnt; k++) {const b = this.add(-1.2, 1.2, z, z + 2.1, y, y, this.look.thin); b.bottom = y - .9;
        b.cart = {lane: i, speed: sp, len: L, base: k * L + this.rnd() * 3, move: this.rnd() < .4 ? 3 : 99, stop: 1.1}; this.carts.push(b);}
      z += 2.1 + 1.4;}
    this.z = z - .2; this.room(z0, this.z, L + 2, 10);}

  private room(z0: number, z1: number, halfW: number, h = 8, sky = true) {if (this.theme === 'manor' || this.theme === 'crypt') this.rooms.push({z0, z1, halfW, y: this.y, h, skylights: sky && this.theme === 'manor'});}
  private add(x0: number, x1: number, z0: number, z1: number, y0: number, y1: number, mat: Mat): Block {
    const b: Block = {x0, x1, z0, z1, y0, y1, mat, bottom: THIN.includes(mat) ? Math.min(y0, y1) - .42 : BOTTOM, sink: false, liftAmp: 0, liftPeriod: 1, liftPhase: 0, lastOffY: 0,
      conveyor: 0, trapPeriod: 0, trapPhase: 0, warn: false, driftAmp: 0, driftPeriod: 1, driftPhase: 0, crumbles: false, crumbleDelay: .75, offX: 0, offY: 0, lastOffX: 0, crumbleAt: -1, fallV: 0, gone: false, tiltX: 0, tiltZ: 0, restoreAfter: 3.8};
    this.blocks.push(b); return b;
  }
  spawnY(z: number) {let best = -99; for (const b of this.blocks) if (!b.crumbles && !b.driftAmp && !b.trapPeriod && !b.wall && !b.gear && !b.cart && !b.tilt && z >= b.z0 && z <= b.z1 && b.bottom < b.y0 - .5) best = Math.max(best, top(b, z)); return best > -99 ? best : 0;}
  sectionAt(z: number) {return this.sections.find(s => z >= s.z0 && z < s.z1);}

  step(dt: number) {
    this.time += dt; const t0 = this.time;
    for (const b of this.blocks) {
      b.lastOffX = b.offX; b.lastOffY = b.offY;
      if (b.liftAmp) b.offY = b.liftAmp * Math.sin(Math.PI * 2 * t0 / b.liftPeriod + b.liftPhase);
      if (b.driftAmp) b.offX = b.driftAmp * Math.sin(Math.PI * 2 * t0 / b.driftPeriod + b.driftPhase);
      if (b.trapPeriod) {const ph = ((t0 / b.trapPeriod) + b.trapPhase) % 1; b.gone = ph > .7; b.warn = ph > .46 && ph <= .7;}
      if (b.sink && b.crumbleAt < 0 && b.offY < 0) b.offY = Math.min(0, b.offY + dt * 1.2);
      if (b.crumbles && b.crumbleAt >= 0) {const t = t0 - b.crumbleAt;
        if (b.sink) {if (t > b.crumbleDelay) b.offY = Math.max(-2.6, b.offY - dt * 1.6); if (t > b.crumbleDelay + 3.2) b.crumbleAt = -1;}
        else if (t > b.crumbleDelay) {b.fallV += 26 * dt; b.offY -= b.fallV * dt; if (b.offY < -6) b.gone = true;}
        if (!b.sink && t > b.crumbleDelay + b.restoreAfter) {b.crumbleAt = -1; b.offY = 0; b.fallV = 0; b.gone = false;}}
    }
    for (const s of this.sweepers) {s.angle0 ??= s.angle; s.lastAngle = s.angle;
      if (s.vary === 'pulse') {const u = t0 / 6 + s.angle0, f = u - Math.floor(u); s.boost = f > .7 ? 1 : f > .58 ? .5 : 0; s.angle = s.angle0 + s.speed * (t0 + 1.8 * Math.floor(u) + Math.max(0, f - .7) * 6);}
      else if (s.vary === 'reverse') s.angle = s.angle0 + s.speed * 2.6 * Math.sin(t0 * .45);
      else s.angle = s.speed * t0 + s.angle0;}
    // gears: turn with optional pauses
    for (const g of this.gears) {g.lastAngle = g.angle; const cyc = g.move + g.stop, n = Math.floor((t0 + g.phase) / cyc), f = Math.min(g.move, (t0 + g.phase) - n * cyc); g.angle = g.speed * (n * g.move + f);}
    // mine carts: looped track, pauses, tunnels at both ends
    for (const b of this.carts) {const c = b.cart!, cyc = c.move + c.stop, n = Math.floor(t0 / cyc), moved = n * c.move + Math.min(c.move, t0 - n * cyc);
      const E = c.len + CART_TUNNEL, L2 = E * 2, p = ((c.base + c.speed * moved) % L2 + L2) % L2 - E; b.lastOffX = b.offX; b.offX = p; b.gone = Math.abs(p) > c.len - .8;}
    for (const g of this.gates) {g.lastOpen = g.open; const ph = ((t0 / g.period) + g.phase) % 1;
      const e = ph < .35 ? 1 : ph < .47 ? 1 : ph < .55 ? 1 - (ph - .47) / .08 : ph < .7 ? 0 : ph < .82 ? (ph - .7) / .12 : 1; g.open = e; g.warn = ph > .35 && ph < .47;}
    for (const f of this.fans) {const ph = ((t0 / f.period) + f.phase) % 1; f.on = ph < .55 ? (ph < .08 ? ph / .08 : 1) * (.75 + .25 * Math.sin(t0 * 2.3 + f.z)) : 0; f.spin += dt * (2 + 22 * f.on);}
    for (const h of this.hooks) {const ph = ((t0 / h.period) + h.phase) % 1; h.state = ph < .5 ? 0 : ph < .68 ? 1 : ph < .74 ? 2 : ph < .8 ? 3 : 4;
      h.ext = h.state === 2 ? (ph - .68) / .06 : h.state === 3 ? 1 : h.state === 4 ? Math.max(0, 1 - (ph - .8) / .2) : 0;}
    for (const c of this.chasers) {const ph = ((t0 / c.period) + c.phase) % 1, tt = ph * c.period; c.active = tt < 7.5; const d = 2.5 * tt + .55 * tt * tt; c.dist = d;
      let rem = d, i = 0; for (; i < c.path.length - 1; i++) {const [ax, az] = c.path[i], [bx, bz] = c.path[i + 1], l = Math.hypot(bx - ax, bz - az); if (rem <= l) {c.x = ax + (bx - ax) * rem / l; c.z = az + (bz - az) * rem / l; break;} rem -= l;}
      if (i >= c.path.length - 1) c.active = false; c.spin = d / c.r;}
    for (const b of this.tilts) {const t = b.tilt!; if (t.axis === 'x') {b.tiltX = t.amp * Math.sin(t0 * Math.PI * 2 / t.period + t.seed) * .5; continue;}
      const step = Math.floor(t0 / t.period), f = (t0 / t.period) - step, tgt = (k: number) => {const h = Math.sin((k + t.seed) * 12.9898) * 43758.5453; const a = h - Math.floor(h), h2 = Math.sin((k + t.seed) * 78.233) * 12345.678; const c = h2 - Math.floor(h2); return [(a - .5) * 2 * t.amp, (c - .5) * 2 * t.amp * .7];};
      const [ax, az] = tgt(step), [bx, bz] = tgt(step + 1), e = f < .55 ? 0 : (f - .55) / .45, s2 = e * e * (3 - 2 * e); b.tiltX = ax + (bx - ax) * s2; b.tiltZ = az + (bz - az) * s2;
      t.warn = f > .3 && f < .6 && Math.hypot(bx, bz) > t.amp * .75;}
    for (const p of this.pendulums) {p.swing = p.amp * Math.sin(Math.PI * 2 * t0 / p.period + p.phase); p.bx = p.px + Math.sin(p.swing) * p.len; p.by = p.py - Math.cos(p.swing) * p.len; p.bz = p.pz;}
    for (const j of this.jets) {const ph = ((t0 / j.period) + j.phase) % 1; j.state = j.kind === 'fire' ? (ph > .62 ? 2 : ph > .4 ? 1 : 0) : (ph > .8 ? 2 : ph > .55 ? 1 : 0);}
    for (const p of this.pushers) {p.lastExt = p.ext; const ph = ((t0 / p.period) + p.phase) % 1;
      const e = ph < .1 ? ph / .1 : ph < .42 ? 1 : ph < .72 ? 1 - (ph - .42) / .3 : 0; p.ext = e * e * (3 - 2 * e);}
    // rolling barrels / boulders: frequent waves of 1-3 down the ramp
    this.boulderTimer -= dt;
    if (this.boulderTimer <= 0 && this.rampZ1 > this.rampZ0) {
      const r1 = this.srand(), n = r1 < .6 ? 1 : 2, lanes = [-1, 0, 1].sort(() => this.srand() - .5).slice(0, n);
      for (const ln of lanes) {const radius = .85 + this.srand() * .2;
        this.boulders.push({x: ln * this.rampHalfW * .62 + (this.srand() - .5) * .8, y: this.rampY1 + radius, z: this.rampZ1 - 1 - this.srand() * 2, vz: -2 - this.srand() * 2, spin: 0, radius, alive: true});}
      this.boulderTimer = .79 + this.srand() * .42;
    }
    const slope = (this.rampY1 - this.rampY0) / Math.max(1, this.rampZ1 - this.rampZ0);
    for (const bo of this.boulders) {bo.vz -= 10 * dt; bo.z += bo.vz * dt; bo.spin += bo.vz * dt / bo.radius;
      if (bo.z > this.rampZ0) bo.y = this.rampY0 + (bo.z - this.rampZ0) * slope + bo.radius; else bo.y -= 30 * dt;
      if (bo.y < this.deathY - 10) bo.alive = false;}
    this.boulders = this.boulders.filter(b => b.alive);
    // rain from the sky (rocks / fireballs / chandeliers)
    this.fallTimer -= dt;
    while (this.fallTimer <= 0 && this.fallZones.length) {
      const rnd = () => ((this.fallSeed = (this.fallSeed * 1103515245 + 12345) | 0) >>> 8 & 65535) / 65535;
      const zn = this.fallZones[rnd() < .72 ? 0 : this.fallZones.length - 1], x = zn[0] + rnd() * (zn[1] - zn[0]), z = zn[2] + rnd() * (zn[3] - zn[2]);
      let g = -99; for (const b of this.blocks) if (!b.crumbles && !b.driftAmp && x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1) g = Math.max(g, top(b, z));
      const r = .8 + rnd() * .7; if (g > -50) this.fallers.push({id: ++this.fallId, x, z, g, spawn: t0, impact: t0 + 1.25 + rnd() * .3, r, y: g + 30, alive: true, landed: false});
      this.fallTimer += .2 + rnd() * .16;
    }
    for (const f of this.fallers) {const k = (t0 - f.spawn) / (f.impact - f.spawn);
      if (k < 1) f.y = f.g + f.r + 30 * (1 - k * k); else {f.landed = true; f.y = f.g + f.r * .7 - Math.max(0, t0 - f.impact - .6) * 2;}
      if (t0 > f.impact + 1.4) f.alive = false;}
    this.fallers = this.fallers.filter(f => f.alive);
  }
  private srand() {this.seed = (Math.imul(this.seed, 1103515245) + 12345) | 0; return ((this.seed >>> 8) & 1023) / 1023;}

  move(r: Runner, dt: number) {
    if (r.hook >= 0) {const h = this.hooks[r.hook]; r.x = h.pillarX - h.side * h.reach * h.ext; r.z = h.z; r.y = h.y - .6; r.vx = r.vy = r.vz = 0; r.ground = null;
      if (h.ext < .05 || h.state < 2) {r.hook = -1; r.vx = h.side * 2; r.stun = .4;} return;}
    if (r.finished) {r.vx = r.vy = r.vz = 0; return;}
    r.stun = Math.max(0, r.stun - dt); r.coyote -= dt; r.jumpBuffer -= dt;
    let ix = r.inX, iz = r.inZ; const il = Math.hypot(ix, iz); if (il > 1) {ix /= il; iz /= il;}
    const speed = 8.2; let acc = r.ground ? 75 : 24; if (r.stun > 0) acc = 3;
    r.vx = approach(r.vx, ix * speed, acc * dt); r.vz = !r.ground && r.vz > speed ? r.vz - 2 * dt : approach(r.vz, iz * speed, acc * dt);
    if (il > .1) r.facing = Math.atan2(ix, iz);
    if (r.jump) {r.jumpBuffer = .14; r.jump = false;}
    if (r.jumpBuffer > 0 && r.coyote > 0 && r.stun <= 0) {r.vy = 9.6; r.coyote = 0; r.jumpBuffer = 0; r.ground = null;}
    r.vy -= (r.vy > 0 && !r.holdJump ? 38 : 26) * dt;
    if (r.ground) {const gd = r.ground;
      if (gd.gear) {const g = gd.gear, da = g.angle - g.lastAngle, dx = r.x - g.x, dz = r.z - g.z, c = Math.cos(da), sn = Math.sin(da); r.x = g.x + dx * c - dz * sn; r.z = g.z + dx * sn + dz * c; r.facing += da * 0;}
      else if (!(gd.cart && Math.abs(gd.offX - gd.lastOffX) > 3)) {r.x += gd.offX - gd.lastOffX; r.y += gd.offY - gd.lastOffY;} r.z += gd.conveyor * dt;
      if (gd.tiltX || gd.tiltZ) {r.x -= gd.tiltX * 15 * dt; r.z -= gd.tiltZ * 15 * dt;}}
    r.wind = 0;
    for (const f of this.fans) {if (f.on <= .02) continue; const rel = f.dx ? (r.x - f.x) * f.dx : (r.z - f.z) * f.dz, side = f.dx ? Math.abs(r.z - f.z) : Math.abs(r.x - f.x);
      if (rel < 0 || rel > f.reach || side > f.half || r.y > f.y + 2.5) continue;
      let shelter = false; for (const b of this.blocks) if (b.wall && !b.ghost) {if (f.dx ? (r.z >= b.z0 && r.z <= b.z1 && (b.x0 + b.x1) / 2 > Math.min(f.x, r.x) && (b.x0 + b.x1) / 2 < Math.max(f.x, r.x)) : (r.x >= b.x0 && r.x <= b.x1 && (b.z0 + b.z1) / 2 > Math.min(f.z, r.z) && (b.z0 + b.z1) / 2 < Math.max(f.z, r.z))) {shelter = true; break;}}
      if (shelter) continue; const k = f.force * f.on * (r.ground ? 1 : 1.5) * (1 - .4 * rel / f.reach); r.x += f.dx * k * dt; r.z += f.dz * k * dt; r.wind = Math.max(r.wind, f.on);}
    const prevY = r.y; r.x += r.vx * dt; r.y += r.vy * dt; r.z += r.vz * dt;
    let landed: Block | null = null;
    for (const b of this.blocks) {
      if (b.gone || b.ghost || b.gear) continue;
      const x0 = b.x0 + b.offX, x1 = b.x1 + b.offX, cx = clamp(r.x, x0, x1), cz = clamp(r.z, b.z0, b.z1), dx = r.x - cx, dz = r.z - cz, d2 = dx * dx + dz * dz;
      if (d2 > R * R) continue;
      const tp = top(b, cz, clamp(r.x, x0, x1)), ramp = b.y0 !== b.y1 || !!(b.tiltX || b.tiltZ);
      const over = r.x > x0 - R * .5 && r.x < x1 + R * .5 && r.z > b.z0 - R * .5 && r.z < b.z1 + R * .5;
      if (over && r.vy <= .01 && r.y <= tp + .05 && prevY >= tp - .45 - (ramp ? .5 : 0)) {r.y = tp; r.vy = 0; landed = b; continue;}
      if (r.y < tp - .45 && r.y + H > b.bottom) {
        if (d2 > 1e-6) {const d = Math.sqrt(d2), push = R - d; r.x += dx / d * push; r.z += dz / d * push; if (Math.abs(dx) > Math.abs(dz)) r.vx = 0; else r.vz = 0;}
        else {const l = r.x - x0, rr = x1 - r.x, f = r.z - b.z0, k = b.z1 - r.z, m = Math.min(l, rr, f, k);
          if (m === l) r.x = x0 - R; else if (m === rr) r.x = x1 + R; else if (m === f) r.z = b.z0 - R; else r.z = b.z1 + R;}
      }
    }
    if (landed && !r.ground && prevY - r.y >= 0) r.landed = this.time;
    for (const g of this.gears) {const dx = r.x - g.x, dz = r.z - g.z, d = Math.hypot(dx, dz); if (d > g.r + R) continue;
      let la = Math.atan2(dz, dx) - g.angle; la = ((la % 6.2832) + 6.2832) % 6.2832; const inGap = g.gaps.some(([a, b]) => la >= a && la <= b);
      if (d <= g.r && !inGap && r.vy <= .01 && r.y <= g.y + .05 && prevY >= g.y - .45) {r.y = g.y; r.vy = 0; landed = g.block; continue;}
      if (!inGap && r.y < g.y - .45 && r.y + H > g.y - .7 && d > .01) {const push = g.r + R - d; r.x += dx / d * push; r.z += dz / d * push;}}
    for (const g of this.gates) {if (Math.abs(r.z - g.z) > .35 + R || r.y > g.y + 3.6) continue; const closing = g.open < g.lastOpen;
      let blocked = false; if (g.kind === 'slide') {const leaf = g.halfW * (1 - g.open); blocked = r.x - R < -g.halfW + leaf || r.x + R > g.halfW - leaf;}
      else blocked = g.y + 3.2 * g.open < r.y + H;
      if (!blocked) continue; if (closing && g.open > .05) {this.hit(r, (r.x > 0 ? -1 : 1) * 3, 6, r.z < g.z ? -13 : 13); r.stun = .8;} r.z = r.z < g.z ? g.z - .35 - R : g.z + .35 + R; r.vz = 0;}
    for (let i = 0; i < this.hooks.length; i++) {const h = this.hooks[i]; if (h.state !== 2 && h.state !== 3) continue; const hx = h.pillarX - h.side * h.reach * h.ext;
      if (Math.abs(r.x - hx) < .8 && Math.abs(r.z - h.z) < .9 && r.y < h.y + 1 && r.y + H > h.y - .5 && r.stun <= .25) {r.hook = i; return;}}
    for (const c of this.chasers) {if (!c.active) continue; const dx = r.x - c.x, dz = r.z - c.z, dy = r.y + H / 2 - (c.y + c.r); if (dx * dx + dz * dz + dy * dy < (c.r + R) ** 2) {const d = Math.hypot(dx, dz) || 1; this.hit(r, dx / d * 10, 9, dz / d * 10 + 6); r.stun = .9;}}
    r.ground = landed; if (landed) {r.coyote = .1; if (landed.crumbles && landed.crumbleAt < 0) landed.crumbleAt = this.time;}
    for (const s0 of this.sweepers) for (let arm = 0; arm < (s0.arms || 1); arm++) {const a = s0.angle + arm * Math.PI / (s0.arms || 1);
      const ex = Math.cos(a) * s0.len, ez = Math.sin(a) * s0.len, t = clamp(((r.x - s0.x) * ex + (r.z - s0.z) * ez) / (ex * ex + ez * ez), -1, 1);
      const dx = r.x - (s0.x + ex * t), dz = r.z - (s0.z + ez * t), d = Math.hypot(dx, dz);
      if (d < R + .42 && r.y < s0.y + .45 && r.y + H > s0.y - .45) {const sg = Math.sign(t + 1e-4) * (Math.sign(s0.angle - (s0.lastAngle ?? s0.angle)) || Math.sign(s0.speed)); this.hit(r, -Math.sin(a) * sg * 11 + (d ? dx / d * 4 : 0), 6.5, Math.cos(a) * sg * 11 + (d ? dz / d * 4 : 0));}
    }
    for (const p of this.pendulums) {const dx = r.x - p.bx, dy = r.y + H / 2 - p.by, dz = r.z - p.bz, rr = p.radius + R + .2;
      if (dx * dx + dy * dy + dz * dz < rr * rr) {const dir = Math.sign(Math.cos(Math.PI * 2 * this.time / p.period + p.phase)) || 1; this.hit(r, dir * 15, 7, Math.sign(dz) * 2);}}
    for (const p of this.pushers) {const inner = p.wallX - p.reach * p.ext, xa = Math.min(p.side * p.wallX, p.side * inner), xb = Math.max(p.side * p.wallX, p.side * inner);
      if (p.ext > .05 && r.x + R > xa && r.x - R < xb && Math.abs(r.z - p.z) < p.d / 2 + R && r.y < p.y + 1.7 && r.y + H > p.y) {
        if (p.ext >= p.lastExt || p.ext > .3) this.hit(r, -p.side * (p.ext > p.lastExt ? 15 : 9), 6.5, (r.z - p.z) * 2);
        r.x = p.side > 0 ? Math.min(r.x, xa - R) : Math.max(r.x, xb + R);}}
    for (const p of this.portals) if (Math.hypot(r.x - p.x, r.z - p.z) < p.r && Math.abs(r.y - p.y) < 1.2) {r.x = p.tx + ((r.slot % 3) - 1) * .8; r.y = p.ty + .1; r.z = p.tz; r.vx = r.vz = 0; r.vy = 0; r.ground = null; p.used = this.time; (r as any).teleported = this.time; r.progress = Math.max(r.progress, r.z);}
    for (const j of this.jets) if (j.state === 2 && Math.hypot(r.x - j.x, r.z - j.z) < j.r + R * .6 && r.y < j.y + (j.kind === 'fire' ? 2.4 : 1.6)) {const dx = r.x - j.x, dz = r.z - j.z, d = Math.hypot(dx, dz) || 1; this.hit(r, dx / d * 8, j.kind === 'fire' ? 11 : 4, dz / d * 8 - 3);}
    for (const p of this.pads) if (r.ground && Math.hypot(r.x - p.x, r.z - p.z) < p.r && Math.abs(r.y - p.y) < .3) {r.vy = 15; r.vz = Math.max(r.vz, 10.5); r.ground = null; r.coyote = 0; p.fired = this.time;}
    for (const f of this.fallers) {if (this.time > f.impact + .25) continue; const dx = r.x - f.x, dy = r.y + H / 2 - f.y, dz = r.z - f.z, rr = f.r + R;
      if (dx * dx + dy * dy + dz * dz < rr * rr) {const d = Math.hypot(dx, dz) || 1; this.hit(r, dx / d * 9, 8, dz / d * 9);}}
    for (const bo of this.boulders) {const dx = r.x - bo.x, dy = r.y + H / 2 - bo.y, dz = r.z - bo.z, rr = bo.radius + R;
      if (dx * dx + dy * dy + dz * dz < rr * rr) this.hit(r, Math.sign(dx) * 4, 6, -12);}
    for (let i = this.checkpoints.length - 1; i >= 0; i--) if (r.z >= this.checkpoints[i] && r.ground?.land) {r.checkpoint = Math.max(r.checkpoint, i); break;}
    if (r.y < this.deathY) this.respawn(r);
    r.progress = Math.max(r.progress, r.z);
    if (r.z >= this.finishZ && r.ground && !r.finished) {r.finished = true; r.finishTime = this.time;}
  }
  private hit(r: Runner, vx: number, vy: number, vz: number) {if (r.stun > .25) return; r.vx = vx; r.vy = vy; r.vz = vz; r.stun = .55; r.ground = null; r.coyote = 0;}
  respawn(r: Runner) {r.hook = -1; const z = this.checkpoints[r.checkpoint] + .5; r.x = ((r.slot % 5) - 2) * 1.4; r.y = this.spawnY(z) + 1.5; r.z = z; r.vx = r.vy = r.vz = 0; r.ground = null; r.falls++; r.stun = .3;}

  /** Bot: run the centreline (ride rafts), jump at steps, gaps, logs, barriers and barrels. */
  think(r: Runner, dt: number) {
    r.botCool -= dt; let tx = ((r.slot % 5) - 2) * .9;
    if (r.ground?.driftAmp) tx = (r.ground.x0 + r.ground.x1) / 2 + r.ground.offX;
    for (const b of this.blocks) if (b.driftAmp && b.z0 > r.z && b.z0 - r.z < 2.5) tx = (b.x0 + b.x1) / 2 + b.offX;
    for (const p of this.pads) if (p.z > r.z && p.z - r.z < 6) tx = p.x;
    r.inX = clamp((tx - r.x) * .6, -1, 1); r.inZ = 1;
    for (const m of this.mazePaths) if (r.x > m.box[0] - 1 && r.x < m.box[1] + 1 && r.z > m.box[2] && r.z < m.box[3]) {
      let best = 0, bd = 1e9; m.path.forEach(([px, pz], i) => {const d = Math.hypot(px - r.x, pz - r.z); if (d < bd) {bd = d; best = i;}});
      const [nx, nz] = m.path[Math.min(m.path.length - 1, best + (bd < 1.1 ? 1 : 0))]; const dx = nx - r.x, dz = nz - r.z, l = Math.hypot(dx, dz) || 1; r.inX = dx / l; r.inZ = dz / l;}
    for (const fw of this.fakeWalls) if (r.z > fw.z - 3.5 && r.z < fw.z + .2) {const st = r as any; if (st.fwZ !== fw.z) {st.fwZ = fw.z; st.try = Math.floor(Math.random() * fw.slots.length); st.stuck = 0;}
      const sx = fw.slots[st.try % fw.slots.length]; r.inX = clamp((sx - r.x) * 1.2, -1, 1); r.inZ = Math.abs(sx - r.x) < .6 ? 1 : .25;
      if (r.z > fw.z - .9 && Math.abs(r.vz) < .5) {st.stuck += dt; if (st.stuck > .35) {st.try++; st.stuck = 0;}} break;}
        {const near = this.portals.filter(p => p.kind !== 'far' || true).filter(p => Math.abs(p.z - (r.z + 4)) < 4.5 && Math.abs(p.z - r.z) < 8 && p.z > r.z); if (near.length >= 3 && !this.mazePaths.some(m => r.z > m.box[2] && r.z < m.box[3])) {const pick = near[(r.slot * 7 + Math.floor(this.time / 9)) % near.length]; r.inX = clamp((pick.x - r.x) * .8, -1, 1);}}
    let want = false, support = false; const ahead = r.z + 1.3, here = r.ground ? top(r.ground, r.z) : r.y;
    for (const b of this.blocks) {if (b.gone || b.wall) continue; if (r.x >= b.x0 + b.offX && r.x <= b.x1 + b.offX && ahead >= b.z0 && ahead <= b.z1) {support = true; if (top(b, ahead) > here + .35) want = true;}}
    if (!support && !this.pads.some(p => Math.abs(p.z - r.z) < 2.5)) want = true;
    for (const s0 of this.sweepers) for (let arm = 0; arm < (s0.arms || 1); arm++) {const a = s0.angle + arm * Math.PI / (s0.arms || 1), ex = Math.cos(a) * s0.len, ez = Math.sin(a) * s0.len, t = clamp(((r.x - s0.x) * ex + (r.z - s0.z) * ez) / (ex * ex + ez * ez), -1, 1);
      if (Math.hypot(r.x - (s0.x + ex * t), r.z - (s0.z + ez * t)) < 1.7) want = true;}
    for (const b of this.boulders) if (Math.abs(b.x - r.x) < b.radius + .6 && b.z > r.z && b.z - r.z < 3.2) want = true;
    for (const j of this.jets) if (j.state >= 1 && j.z > r.z && j.z - r.z < 2.2 && Math.abs(j.x - r.x) < j.r + .5) {r.inZ = .1; r.inX = Math.sign(r.x - j.x || 1);}
    for (const f of this.fallers) if (!f.landed && Math.abs(f.z - r.z - 1.5) < 2 && Math.abs(f.x - r.x) < f.r + .8) r.inX = Math.sign(r.x - f.x || 1);
    if (want && r.ground && r.botCool <= 0 && Math.random() < .55) {r.jump = true; r.holdJump = true; r.botCool = .35;}
    if (r.ground && !want) r.holdJump = false;
  }
}
const approach = (v: number, t: number, d: number) => v < t ? Math.min(t, v + d) : Math.max(t, v - d);
