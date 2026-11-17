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
  lastOffY: number; offX: number; offY: number; lastOffX: number; crumbleAt: number; fallV: number; gone: boolean; land?: boolean; wall?: boolean; ghost?: boolean}
/** Portal: step in, come out somewhere else (good / short / back to start). */
export interface Portal {x: number; y: number; z: number; r: number; tx: number; ty: number; tz: number; kind: 'far' | 'near' | 'back'; used: number}
export interface Sweeper {x: number; y: number; z: number; len: number; speed: number; angle: number; arms?: number; angle0?: number}
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
export const top = (b: Block, z: number) => {const t = b.z1 === b.z0 ? 0 : clamp((z - b.z0) / (b.z1 - b.z0), 0, 1); return b.y0 + (b.y1 - b.y0) * t + b.offY;};

export class Runner {
  x = 0; y = 0; z = 0; vx = 0; vy = 0; vz = 0; inX = 0; inZ = 0; facing = 0; stun = 0; coyote = 0; jumpBuffer = 0;
  progress = 0; finishTime = 0; jump = false; holdJump = false; finished = false; checkpoint = 0; falls = 0;
  ground: Block | null = null; botCool = 0; landed = 0;
  constructor(public id: string, public name: string, public character: string, public slot: number, public bot: boolean) {}
}

type Look = {main: Mat; alt: Mat; thin: Mat; land: Mat; crumble: Mat};
const LOOK: Record<Theme, Look> = {
  cliffs: {main: 'grass', alt: 'stone', thin: 'plank', land: 'grass', crumble: 'stone'},
  graveyard: {main: 'cobble', alt: 'brick', thin: 'dark', land: 'mud', crumble: 'mud'},
  manor: {main: 'floor', alt: 'flag', thin: 'floor', land: 'flag', crumble: 'floor'},
  crypt: {main: 'flag', alt: 'flag', thin: 'floor', land: 'flag', crumble: 'flag'},
};
export const SECTION_NAMES: Record<string, string> = {terraces: 'Террасы', spinner: 'Мельница', gaps: 'Провалы', pendulums: 'Маятники', rafts: 'Плоты', crumble: 'Обвал пола',
  sink: 'Трясина', pushers: 'Тараны', pads: 'Батуты', traps: 'Люки', conveyor: 'Транспортёр', flames: 'Огненный пол', hammers: 'Молоты', beams: 'Узкие балки', zigzag: 'Змейка', maze: 'Лабиринт', fakewalls: 'Ложные стены', portals: 'Порталы', ramp: 'Скат', rain: 'Дождь с неба', hops: 'Лестница к финишу'};

export class Course {
  blocks: Block[] = []; sweepers: Sweeper[] = []; pendulums: Pendulum[] = []; boulders: Boulder[] = []; fallers: Faller[] = [];
  pushers: Pusher[] = []; jets: Jet[] = []; pads: Pad[] = []; portals: Portal[] = []; mazePath: [number, number][] = []; mazeBox = [0, 0, 0, 0]; rooms: Room[] = []; sections: {name: string; z0: number; z1: number}[] = [];
  fallZones: [number, number, number, number][] = []; checkpoints: number[] = [0]; finishZ = 0; time = 0;
  rampZ0 = 0; rampZ1 = 0; rampY0 = 0; rampY1 = 0; rampHalfW = 4; theme: Theme; deathY = DEATH_Y;
  private boulderTimer = 1.2; private seed = 7; private fallTimer = 0; private fallSeed = 99; private fallId = 0;
  private look: Look; private z = 0; private y = 0; private rs: number;

  constructor(public map = 1, public courseSeed = 1) {
    this.theme = map === 4 ? 'crypt' : map === 3 ? 'manor' : map === 2 ? 'graveyard' : 'cliffs';
    this.deathY = this.theme === 'manor' || this.theme === 'crypt' ? -6 : this.theme === 'graveyard' ? -2.4 : DEATH_Y;
    this.look = LOOK[this.theme]; this.rs = (courseSeed >>> 0) || 1;
    this.build();
  }
  private rnd() {this.rs = (Math.imul(this.rs, 1103515245) + 12345) >>> 0; return (this.rs >>> 8 & 65535) / 65535;}

  private build() {
    const L = this.look;
    this.add(-10, 10, -6, 20, 0, 0, L.land).land = true; this.room(-8, 20, 10, 10); this.z = 20;
    const pool = ['terraces', 'spinner', 'gaps', 'pendulums', 'rafts', 'crumble', 'pushers', 'pads', 'traps', 'conveyor', 'flames', 'hammers', 'beams', 'zigzag', ...(this.theme === 'graveyard' ? ['sink'] : [])].filter(n => !(this.theme === 'manor' && n === 'pads'));
    for (let i = pool.length - 1; i > 0; i--) {const j = Math.floor(this.rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]];}
    let order = pool.slice(0, 6); order.splice(2 + Math.floor(this.rnd() * 3), 0, 'ramp'); order.push(this.theme === 'manor' ? 'pads' : 'rain', 'hops');
    if (this.theme === 'crypt') {const extra = pool.filter(n => n !== 'pads' && n !== 'rafts').slice(0, 3); const core = ['maze', 'fakewalls', 'portals', 'maze', ...(this.rnd() < .5 ? ['portals'] : ['fakewalls'])];
      for (let i = core.length - 1; i > 1; i--) {const j = 1 + Math.floor(this.rnd() * i); [core[i], core[j]] = [core[j], core[i]];}
      order = []; core.forEach((c, i) => {order.push(c); if (extra[i]) order.push(extra[i]);}); order.push('rain', 'hops');}
    for (const name of order) {
      const z0 = this.z; (this as any)['s_' + name](); this.sections.push({name, z0, z1: this.z});
      if (name === 'hops') break;
      this.add(-6, 6, this.z, this.z + 6, this.y, this.y, L.land).land = true; this.room(this.z, this.z + 6, 6.6, 8, false); this.checkpoints.push(this.z + 2.5); this.z += 6;
    }
    this.z += 1.8; this.add(-11, 11, this.z, this.z + 22, this.y, this.y, L.alt).land = true; this.room(this.z, this.z + 22, 11.6, 12); this.finishZ = this.z + 12;
  }

  // ---------------- sections ----------------
  private s_terraces() {const up = this.y < 4 || this.rnd() < .6, n = 3 + Math.floor(this.rnd() * 2);
    for (let i = 0; i < n; i++) {this.y += up ? .9 : -.9; const w = 7 + this.rnd() * 2; this.add(-w, w, this.z, this.z + 7, this.y, this.y, this.look.main); this.room(this.z, this.z + 7, w + .6, 9); this.z += 7;}}
  private s_spinner() {const v = Math.floor(this.rnd() * 3), y = this.y, z = this.z, sp = (1.1 + this.rnd() * .6) * (this.rnd() < .5 ? -1 : 1);
    this.add(-10, 10, z, z + 26, y, y, this.look.alt); this.room(z, z + 26, 10.6, 9);
    if (v === 0) this.sweepers.push({x: 0, y: y + .55, z: z + 13, len: 9.5, speed: sp, angle: 0});
    else if (v === 1) this.sweepers.push({x: 0, y: y + .55, z: z + 8, len: 8.5, speed: sp * 1.2, angle: 0}, {x: 0, y: y + .55, z: z + 19, len: 8.5, speed: -sp * 1.35, angle: 1});
    else this.sweepers.push({x: 0, y: y + .55, z: z + 13, len: 9.8, speed: sp * .95, angle: 0, arms: 2});
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
  private s_crumble() {const rows = 5 + Math.floor(this.rnd() * 2), z0 = this.z, delay = .45 + this.rnd() * .3;
    for (let r = 0; r < rows; r++) for (const c of [-1, 0, 1]) {const b = this.add(c * 3 - 1.3, c * 3 + 1.3, this.z + r * 3.1 + .25, this.z + r * 3.1 + 2.85, this.y, this.y, this.look.crumble); b.crumbles = true; b.crumbleDelay = delay; b.bottom = this.y - .7;}
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
  private s_hops() {const z0 = this.z, lifts = this.theme !== 'cliffs';
    for (const [hx, len] of [[0, 3], [-2.3, 2.6], [2.1, 2.6], [-1, 2.4], [1.6, 2.6], [0, 3]]) {this.z += 2.1; this.y += .5; const b = this.add(hx - 1.8, hx + 1.8, this.z, this.z + len, this.y, this.y, this.look.alt); if (lifts) {b.liftAmp = .3; b.liftPeriod = 2.5; b.liftPhase = this.z;} this.z += len;}
    this.fallZones.push([-3, 3, z0, this.z]); this.room(z0, this.z, 6.6, 12);}

  // ---- catacomb sections ----
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
    const kinds: Portal['kind'][] = ['far', 'near', ...Array(n - 2).fill('back')]; for (let i = kinds.length - 1; i > 0; i--) {const j = Math.floor(this.rnd() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]];}
    kinds.forEach((k, i) => {const x = -((n - 1) * 2.9) / 2 + i * 2.9; const tz = k === 'far' ? end + 2 : k === 'near' ? cz + 1.5 : z + 1.5; this.portals.push({x, y, z: z + 8, r: 1.05, tx: 0, ty: y, tz, kind: k, used: -9});});
    this.z = end + 4;}
  private pick<T>(a: T[]) {return a[Math.floor(this.rnd() * a.length) % a.length];}

  private s_flames() {const len = 30, w = 5, z = this.z, y = this.y; this.add(-w, w, z, z + len, y, y, this.look.alt); this.room(z, z + len, w + .6, 9);
    const per = 2.4 + this.rnd() * .6, pat = Math.floor(this.rnd() * 3);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) {const x = -3.75 + c * 2.5, zz = z + 3 + r * 4.4;
      const ph = pat === 0 ? r * .17 : pat === 1 ? ((r + c) % 2) * .5 : this.rnd(); this.jets.push({x, z: zz, y, r: 1, period: per, phase: ph, kind: 'fire', state: 0});}
    this.z += len;}
  private s_hammers() {const len = 32, w = 4.5, z = this.z, y = this.y; this.add(-w, w, z, z + len, y, y, this.look.main); this.room(z, z + len, w + .6, 10);
    for (let i = 0; i < 5; i++) {const lanes = this.rnd() < .5 ? [-2.2, 2.2] : [0]; for (const x of lanes) this.jets.push({x, z: z + 4 + i * 6, y, r: 1.5, period: 2 + this.rnd() * .8, phase: this.rnd(), kind: 'hammer', state: 0});}
    this.z += len;}
  private s_beams() {const z0 = this.z, y = this.y; let x = 0;
    for (let i = 0; i < 6; i++) {const len = 5 + this.rnd() * 2, nx = (this.rnd() - .5) * 6; this.add(Math.min(x, nx) - .55, Math.max(x, nx) + .55, this.z, this.z + .9, y, y, this.look.thin).bottom = y - .4;
      this.add(nx - .55, nx + .55, this.z + .9, this.z + len, y, y, this.look.thin).bottom = y - .4; x = nx; this.z += len;}
    this.add(Math.min(x, 0) - .55, Math.max(x, 0) + .55, this.z, this.z + 1, y, y, this.look.thin).bottom = y - .4; this.z += 1; this.room(z0, this.z, 6, 9);}
  private s_zigzag() {const z0 = this.z, y = this.y, w = 6; this.add(-w, w, z0, z0 + 34, y, y, this.look.main); this.room(z0, z0 + 34, w + .6, 9);
    for (let i = 0; i < 5; i++) {const wz = z0 + 4 + i * 6, sd = i % 2 ? 1 : -1; this.wallBlock(sd > 0 ? -w : -w + 2.6, sd > 0 ? w - 2.6 : w, wz, wz + .5, 1.6);
      this.jets.push({x: sd * (w - 1.3), z: wz + 3, y, r: 1, period: 2.6, phase: i * .2, kind: 'fire', state: 0});}
    this.z += 34;}

  private room(z0: number, z1: number, halfW: number, h = 8, sky = true) {if (this.theme === 'manor' || this.theme === 'crypt') this.rooms.push({z0, z1, halfW, y: this.y, h, skylights: sky && this.theme === 'manor'});}
  private add(x0: number, x1: number, z0: number, z1: number, y0: number, y1: number, mat: Mat): Block {
    const b: Block = {x0, x1, z0, z1, y0, y1, mat, bottom: THIN.includes(mat) ? Math.min(y0, y1) - .42 : BOTTOM, sink: false, liftAmp: 0, liftPeriod: 1, liftPhase: 0, lastOffY: 0,
      conveyor: 0, trapPeriod: 0, trapPhase: 0, warn: false, driftAmp: 0, driftPeriod: 1, driftPhase: 0, crumbles: false, crumbleDelay: .75, offX: 0, offY: 0, lastOffX: 0, crumbleAt: -1, fallV: 0, gone: false};
    this.blocks.push(b); return b;
  }
  spawnY(z: number) {let best = -99; for (const b of this.blocks) if (!b.crumbles && !b.driftAmp && !b.trapPeriod && !b.wall && z >= b.z0 && z <= b.z1 && b.bottom < b.y0 - .5) best = Math.max(best, top(b, z)); return best > -99 ? best : 0;}
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
        if (!b.sink && t > b.crumbleDelay + 3.8) {b.crumbleAt = -1; b.offY = 0; b.fallV = 0; b.gone = false;}}
    }
    for (const s of this.sweepers) {s.angle0 ??= s.angle; s.angle = s.speed * t0 + s.angle0;}
    for (const p of this.pendulums) {p.swing = p.amp * Math.sin(Math.PI * 2 * t0 / p.period + p.phase); p.bx = p.px + Math.sin(p.swing) * p.len; p.by = p.py - Math.cos(p.swing) * p.len; p.bz = p.pz;}
    for (const j of this.jets) {const ph = ((t0 / j.period) + j.phase) % 1; j.state = j.kind === 'fire' ? (ph > .62 ? 2 : ph > .4 ? 1 : 0) : (ph > .8 ? 2 : ph > .55 ? 1 : 0);}
    for (const p of this.pushers) {p.lastExt = p.ext; const ph = ((t0 / p.period) + p.phase) % 1;
      const e = ph < .1 ? ph / .1 : ph < .42 ? 1 : ph < .72 ? 1 - (ph - .42) / .3 : 0; p.ext = e * e * (3 - 2 * e);}
    // rolling barrels / boulders: frequent waves of 1-3 down the ramp
    this.boulderTimer -= dt;
    if (this.boulderTimer <= 0 && this.rampZ1 > this.rampZ0) {
      const r1 = this.srand(), n = r1 < .6 ? 1 : 2, lanes = [-1, 0, 1].sort(() => this.srand() - .5).slice(0, n);
      for (const ln of lanes) {const radius = this.theme === 'manor' ? .85 + this.srand() * .2 : 1 + this.srand() * .4;
        this.boulders.push({x: ln * this.rampHalfW * .62 + (this.srand() - .5) * .8, y: this.rampY1 + radius, z: this.rampZ1 - 1 - this.srand() * 2, vz: -2 - this.srand() * 2, spin: 0, radius, alive: true});}
      this.boulderTimer = .95 + this.srand() * .5;
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
    if (r.finished) {r.vx = r.vy = r.vz = 0; return;}
    r.stun = Math.max(0, r.stun - dt); r.coyote -= dt; r.jumpBuffer -= dt;
    let ix = r.inX, iz = r.inZ; const il = Math.hypot(ix, iz); if (il > 1) {ix /= il; iz /= il;}
    const speed = 8.2; let acc = r.ground ? 75 : 24; if (r.stun > 0) acc = 3;
    r.vx = approach(r.vx, ix * speed, acc * dt); r.vz = !r.ground && r.vz > speed ? r.vz - 2 * dt : approach(r.vz, iz * speed, acc * dt);
    if (il > .1) r.facing = Math.atan2(ix, iz);
    if (r.jump) {r.jumpBuffer = .14; r.jump = false;}
    if (r.jumpBuffer > 0 && r.coyote > 0 && r.stun <= 0) {r.vy = 9.6; r.coyote = 0; r.jumpBuffer = 0; r.ground = null;}
    r.vy -= (r.vy > 0 && !r.holdJump ? 38 : 26) * dt;
    if (r.ground) {r.x += r.ground.offX - r.ground.lastOffX; r.y += r.ground.offY - r.ground.lastOffY; r.z += r.ground.conveyor * dt;}
    const prevY = r.y; r.x += r.vx * dt; r.y += r.vy * dt; r.z += r.vz * dt;
    let landed: Block | null = null;
    for (const b of this.blocks) {
      if (b.gone || b.ghost) continue;
      const x0 = b.x0 + b.offX, x1 = b.x1 + b.offX, cx = clamp(r.x, x0, x1), cz = clamp(r.z, b.z0, b.z1), dx = r.x - cx, dz = r.z - cz, d2 = dx * dx + dz * dz;
      if (d2 > R * R) continue;
      const tp = top(b, cz), ramp = b.y0 !== b.y1;
      const over = r.x > x0 - R * .5 && r.x < x1 + R * .5 && r.z > b.z0 - R * .5 && r.z < b.z1 + R * .5;
      if (over && r.vy <= .01 && r.y <= tp + .05 && prevY >= tp - .45 - (ramp ? .5 : 0)) {r.y = tp; r.vy = 0; landed = b; continue;}
      if (r.y < tp - .45 && r.y + H > b.bottom) {
        if (d2 > 1e-6) {const d = Math.sqrt(d2), push = R - d; r.x += dx / d * push; r.z += dz / d * push; if (Math.abs(dx) > Math.abs(dz)) r.vx = 0; else r.vz = 0;}
        else {const l = r.x - x0, rr = x1 - r.x, f = r.z - b.z0, k = b.z1 - r.z, m = Math.min(l, rr, f, k);
          if (m === l) r.x = x0 - R; else if (m === rr) r.x = x1 + R; else if (m === f) r.z = b.z0 - R; else r.z = b.z1 + R;}
      }
    }
    if (landed && !r.ground && prevY - r.y >= 0) r.landed = this.time;
    r.ground = landed; if (landed) {r.coyote = .1; if (landed.crumbles && landed.crumbleAt < 0) landed.crumbleAt = this.time;}
    for (const s0 of this.sweepers) for (let arm = 0; arm < (s0.arms || 1); arm++) {const a = s0.angle + arm * Math.PI / (s0.arms || 1);
      const ex = Math.cos(a) * s0.len, ez = Math.sin(a) * s0.len, t = clamp(((r.x - s0.x) * ex + (r.z - s0.z) * ez) / (ex * ex + ez * ez), -1, 1);
      const dx = r.x - (s0.x + ex * t), dz = r.z - (s0.z + ez * t), d = Math.hypot(dx, dz);
      if (d < R + .42 && r.y < s0.y + .45 && r.y + H > s0.y - .45) {const sg = Math.sign(t + 1e-4) * Math.sign(s0.speed); this.hit(r, -Math.sin(a) * sg * 11 + (d ? dx / d * 4 : 0), 6.5, Math.cos(a) * sg * 11 + (d ? dz / d * 4 : 0));}
    }
    for (const p of this.pendulums) {const dx = r.x - p.bx, dy = r.y + H / 2 - p.by, dz = r.z - p.bz, rr = p.radius + R + .2;
      if (dx * dx + dy * dy + dz * dz < rr * rr) {const dir = Math.sign(Math.cos(Math.PI * 2 * this.time / p.period + p.phase)) || 1; this.hit(r, dir * 15, 7, Math.sign(dz) * 2);}}
    for (const p of this.pushers) {const inner = p.wallX - p.reach * p.ext, xa = Math.min(p.side * p.wallX, p.side * inner), xb = Math.max(p.side * p.wallX, p.side * inner);
      if (p.ext > .05 && r.x + R > xa && r.x - R < xb && Math.abs(r.z - p.z) < p.d / 2 + R && r.y < p.y + 1.7 && r.y + H > p.y) {
        if (p.ext > p.lastExt) this.hit(r, -p.side * 15, 6.5, (r.z - p.z) * 2); else r.x = p.side > 0 ? Math.min(r.x, xa - R) : Math.max(r.x, xb + R);}}
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
  respawn(r: Runner) {const z = this.checkpoints[r.checkpoint] + .5; r.x = ((r.slot % 5) - 2) * 1.4; r.y = this.spawnY(z) + 1.5; r.z = z; r.vx = r.vy = r.vz = 0; r.ground = null; r.falls++; r.stun = .3;}

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
