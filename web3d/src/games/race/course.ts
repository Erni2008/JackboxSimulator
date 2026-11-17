// Obstacle race course + physics (port of core/.../race/RaceCourse.java). Deterministic from the shared clock, so every
// phone sees the same logs, boulders and rafts; each phone simulates only its own runner.
export type Mat = 'grass' | 'plank' | 'stone' | 'cobble' | 'brick' | 'dark' | 'mud' | 'floor' | 'flag';
export type Theme = 'cliffs' | 'graveyard' | 'manor';
export const THIN: Mat[] = ['plank', 'dark'];
/** Indoor room: walls at ±halfW from z0 to z1, ceiling at floor + h. */
export interface Room {z0: number; z1: number; halfW: number; y: number; h: number; skylights: boolean}
export interface Block {x0: number; x1: number; z0: number; z1: number; bottom: number; y0: number; y1: number; mat: Mat;
  driftAmp: number; driftPeriod: number; driftPhase: number; crumbles: boolean; crumbleDelay: number; sink: boolean; liftAmp: number; liftPeriod: number; liftPhase: number; lastOffY: number; offX: number; offY: number; lastOffX: number; crumbleAt: number; fallV: number; gone: boolean}
export interface Sweeper {x: number; y: number; z: number; len: number; speed: number; angle: number; arms?: number}
export interface Pendulum {px: number; py: number; pz: number; len: number; amp: number; period: number; phase: number; radius: number; bx: number; by: number; bz: number; swing: number}
export interface Faller {id: number; x: number; z: number; g: number; spawn: number; impact: number; r: number; y: number; alive: boolean; landed: boolean}
export interface Boulder {x: number; y: number; z: number; vz: number; spin: number; radius: number; alive: boolean}

export const R = .42, H = 1.55, DEATH_Y = -12, BOTTOM = -16;
const clamp = (v: number, a: number, b: number) => v < a ? a : v > b ? b : v;
export const top = (b: Block, z: number) => {const t = b.z1 === b.z0 ? 0 : clamp((z - b.z0) / (b.z1 - b.z0), 0, 1); return b.y0 + (b.y1 - b.y0) * t + b.offY;};

export class Runner {
  x = 0; y = 0; z = 0; vx = 0; vy = 0; vz = 0; inX = 0; inZ = 0; facing = 0; stun = 0; coyote = 0; jumpBuffer = 0;
  progress = 0; finishTime = 0; jump = false; holdJump = false; finished = false; checkpoint = 0; falls = 0;
  ground: Block | null = null; botCool = 0; landed = 0;
  constructor(public id: string, public name: string, public character: string, public slot: number, public bot: boolean) {}
}

export class Course {
  blocks: Block[] = []; sweepers: Sweeper[] = []; pendulums: Pendulum[] = []; boulders: Boulder[] = []; fallers: Faller[] = []; fallZones: [number, number, number, number][] = []; private fallTimer = 0; private fallSeed = 99; private fallId = 0;
  checkpoints: number[]; gauntlet: number[] = []; finishZ: number; rampZ0: number; rampZ1: number; rampY0: number; rampY1: number; time = 0;
  private boulderTimer = 1.5; private seed = 7;
  theme: Theme; deathY = DEATH_Y; rooms: Room[] = [];
  constructor(public map = 1) {
    this.theme = map === 3 ? 'manor' : map === 2 ? 'graveyard' : 'cliffs';
    if (map === 3) {this.deathY = -6; this.finishZ = 0; this.checkpoints = []; this.rampZ0 = this.rampZ1 = this.rampY0 = this.rampY1 = 0; this.map3(); return;}
    if (map === 2) {this.deathY = -2.4; this.rampZ0 = this.rampZ1 = this.rampY0 = this.rampY1 = 0; this.finishZ = 0; this.checkpoints = []; this.map2(); return;}
    let z = 0, y = 0;
    this.add(-9, 9, -6, 18, 0, 0, 'grass'); z = 18;
    this.add(-8, 8, z, z + 9, .9, .9, 'grass'); this.add(-8, 8, z + 9, z + 18, 1.8, 1.8, 'grass'); this.add(-8, 8, z + 18, z + 27, 2.7, 2.7, 'grass'); z += 27; y = 2.7;
    this.add(-10, 10, z, z + 22, y, y, 'stone'); this.sweepers.push({x: 0, y: y + .55, z: z + 11, len: 9.5, speed: 1.25, angle: 0}); z += 22;
    const seg = [3.2, 2.6, 2.6, 2.2, 2.6, 2, 3];
    seg.forEach((s, i) => {this.add(-2.2, 2.2, z, z + s, y, y, 'plank'); z += s + (i < seg.length - 1 ? 1.7 : 0);});
    this.add(-6, 6, z, z + 30, y, y, 'stone');
    for (let i = 0; i < 3; i++) this.pendulums.push({px: 0, py: y + 8.4, pz: z + 6 + i * 9, len: 7.3, amp: .85, period: 2.6, phase: i * 1.9, radius: 1.15, bx: 0, by: 0, bz: 0, swing: 0});
    z += 30;
    for (let i = 0; i < 4; i++) {const b = this.add(-2.3, 2.3, z + 1.6, z + 6.2, y, y, 'plank'); b.driftAmp = 4.2; b.driftPeriod = 3.4 + i * .35; b.driftPhase = i * 1.7; z += 6.2;}
    z += 1.6; this.add(-7, 7, z, z + 8, y, y, 'grass'); z += 8;
    for (let r = 0; r < 5; r++) for (let c = -1; c <= 1; c++) {const b = this.add(c * 3.2 - 1.4, c * 3.2 + 1.4, z + r * 3.2 + .2, z + r * 3.2 + 3, y, y, 'stone'); b.crumbles = true; b.bottom = y - .9;}
    z += 16; this.add(-8, 8, z, z + 7, y, y, 'grass'); z += 7;
    this.rampZ0 = z; this.rampZ1 = z + 34; this.rampY0 = y; this.rampY1 = y + 7.5;
    this.add(-7, 7, this.rampZ0, this.rampZ1, this.rampY0, this.rampY1, 'grass'); z = this.rampZ1; y = this.rampY1;
    // ---- final gauntlet ----
    this.add(-8, 8, z, z + 8, y, y, 'grass'); z += 8; const cpFall = z;
    // 9. rockfall: long causeway, rocks crash down on red warning circles
    this.add(-6, 6, z, z + 46, y, y, 'stone'); this.fallZones.push([-5, 5, z + 2, z + 45]); z += 46;
    this.add(-7, 7, z, z + 6, y, y, 'grass'); z += 6; const cpBridge = z;
    // 10. collapsing bridge: two narrow lanes of slabs that drop almost at once
    for (let r = 0; r < 9; r++) for (const c of [-1, 1]) {const b = this.add(c * 1.7 - 1.1, c * 1.7 + 1.1, z + r * 2.9 + .25, z + r * 2.9 + 2.6, y, y, 'stone'); b.crumbles = true; b.crumbleDelay = .42; b.bottom = y - .9;}
    z += 26.4; this.add(-7, 7, z, z + 6, y, y, 'grass'); z += 6; const cpLogs = z;
    // 11. twin logs spinning against each other
    this.add(-10, 10, z, z + 30, y, y, 'stone');
    this.sweepers.push({x: 0, y: y + .55, z: z + 8, len: 8.5, speed: 1.6, angle: 0}, {x: 0, y: y + .55, z: z + 21, len: 8.5, speed: -1.95, angle: 0}); z += 30;
    // 12. island hops up to the finish under falling rocks
    const hops = [[0, 3.2], [-2.6, 2.6], [2.4, 2.6], [-1.2, 2.4], [1.8, 2.6], [0, 3]];
    const hz0 = z; for (const [hx, len] of hops) {z += 2.1; y += .45; this.add(hx - 1.7, hx + 1.7, z, z + len, y, y, 'stone'); z += len;}
    this.fallZones.push([-3, 3, hz0, z]);
    z += 1.8; this.add(-11, 11, z, z + 22, y, y, 'stone'); this.finishZ = z + 12;
    this.gauntlet = [cpFall, cpBridge, cpLogs];
    this.checkpoints = [0, 46, 101, 145, 176, this.rampZ1 + 1, ...this.gauntlet.map(v => v - 3)];
  }
  /** THE CURSED GRAVEYARD: night, moonlight, crypt lifts, scythes, swamp coffins, a spinning cross, fire rain. */
  private map2() {
    let z = 0, y = 0; const cp: number[] = [0];
    this.add(-10, 10, -6, 20, 0, 0, 'cobble'); z = 20;
    // crypt lids lifting and sinking out of phase
    const lifts = [[-2.2, 0], [2, .6], [-1.6, 1.2], [2.4, 1.8], [-.6, 2.4], [0, 3]];
    lifts.forEach(([lx, ly], i) => {z += 1.4; const b = this.add(lx - 2, lx + 2, z, z + 3.6, ly + .6, ly + .6, 'brick'); b.liftAmp = .85; b.liftPeriod = 3.2; b.liftPhase = i * 1.15; b.bottom = ly - 2.5; z += 3.6;});
    y = 3.6; z += 1.4; this.add(-7, 7, z, z + 7, y, y, 'cobble'); z += 7; cp.push(z - 4);
    // scythe corridor
    this.add(-4.5, 4.5, z, z + 38, y, y, 'cobble');
    for (let i = 0; i < 4; i++) this.pendulums.push({px: 0, py: y + 7.6, pz: z + 6 + i * 8.5, len: 6.6, amp: .95, period: 2.2, phase: i * 1.3, radius: 1.05, bx: 0, by: 0, bz: 0, swing: 0});
    z += 38; this.add(-7, 7, z, z + 7, y, y, 'mud'); z += 7; cp.push(z - 4);
    // swamp: sinking slabs then drifting coffins
    for (let r = 0; r < 4; r++) for (const c of [-1, 0, 1]) {const b = this.add(c * 3 - 1.2, c * 3 + 1.2, z + r * 3 + .3, z + r * 3 + 2.7, y, y, 'mud'); b.crumbles = true; b.sink = true; b.crumbleDelay = .35; b.bottom = y - .7;}
    z += 12.6;
    for (let i = 0; i < 4; i++) {const b = this.add(-1.1, 1.1, z + 1.5, z + 5.6, y, y, 'dark'); b.driftAmp = 4.6; b.driftPeriod = 3.1 + i * .3; b.driftPhase = i * 2.1; z += 5.6;}
    z += 1.5; this.add(-8, 8, z, z + 7, y, y, 'mud'); z += 7; cp.push(z - 4);
    // the spinning cross
    this.add(-11, 11, z, z + 26, y, y, 'brick');
    this.sweepers.push({x: 0, y: y + .55, z: z + 13, len: 10, speed: 1.05, angle: 0, arms: 2}); z += 26;
    this.add(-7, 7, z, z + 7, y, y, 'cobble'); z += 7; cp.push(z - 4);
    // fire rain over the long causeway, then rising crypt hops to the mausoleum
    this.add(-5.5, 5.5, z, z + 44, y, y, 'cobble'); this.fallZones.push([-4.5, 4.5, z + 2, z + 43]); z += 44;
    this.add(-7, 7, z, z + 6, y, y, 'mud'); z += 6; cp.push(z - 4);
    const hz0 = z; for (const [hx, len] of [[0, 3], [-2.4, 2.6], [2.2, 2.6], [-1, 2.4], [1.6, 2.6], [0, 3]]) {z += 2.1; y += .5; const b = this.add(hx - 1.7, hx + 1.7, z, z + len, y, y, 'brick'); b.liftAmp = .35; b.liftPeriod = 2.4; b.liftPhase = z; z += len;}
    this.fallZones.push([-3, 3, hz0, z]);
    z += 1.8; this.add(-11, 11, z, z + 22, y, y, 'cobble'); this.finishZ = z + 12;
    this.checkpoints = cp;
  }
  /** THE COLLECTOR'S HOUSE: the exhibits break out of the cage cellar and run for the door to freedom. */
  private map3() {
    let z = 0, y = 0; const cp: number[] = [0]; const room = (z0: number, z1: number, halfW: number, h = 8, sky = true) => this.rooms.push({z0, z1, halfW, y, h, skylights: sky});
    // 1. cage hall
    this.add(-9, 9, -6, 22, 0, 0, 'flag'); room(-8, 22, 9.6, 10); z = 22;
    // 2. broken floor: tiles with holes into the dark
    const pat = [[-1, 1], [1], [-1], [-1, 1], [1], [-1, 1], [-1]];
    pat.forEach((cols, r) => {for (const c of cols) this.add(c * 2.1 - 1.9, c * 2.1 + 1.9, z + r * 3.3, z + r * 3.3 + 3.3, y, y, 'floor').bottom = y - .5;});
    room(z, z + pat.length * 3.3, 4.6, 7); z += pat.length * 3.3;
    this.add(-4.6, 4.6, z, z + 6, y, y, 'flag'); room(z, z + 6, 4.6, 7, false); z += 6; cp.push(z - 3);
    // 3. corridor of swinging cages
    this.add(-4, 4, z, z + 36, y, y, 'floor'); room(z, z + 36, 4.6, 8.2);
    for (let i = 0; i < 4; i++) this.pendulums.push({px: 0, py: y + 7.6, pz: z + 5 + i * 8.5, len: 5.9, amp: .92, period: 2.4, phase: i * 1.45, radius: 1.05, bx: 0, by: 0, bz: 0, swing: 0});
    z += 36; this.add(-4.6, 4.6, z, z + 6, y, y, 'flag'); room(z, z + 6, 4.6, 7, false); z += 6; cp.push(z - 3);
    // 4. wine cellar stairs: barrels rolling down
    this.rampZ0 = z; this.rampZ1 = z + 30; this.rampY0 = y; this.rampY1 = y + 6; this.add(-3.6, 3.6, z, z + 30, y, y + 6, 'flag'); room(z, z + 30, 4.2, 9); z += 30; y += 6;
    this.add(-6, 6, z, z + 6, y, y, 'floor'); room(z, z + 6, 6.6, 7); z += 6; cp.push(z - 3);
    // 5. rotten floorboards that give way
    for (let r = 0; r < 6; r++) for (const c of [-1, 0, 1]) {const b = this.add(c * 3 - 1.3, c * 3 + 1.3, z + r * 3.1 + .25, z + r * 3.1 + 2.85, y, y, 'floor'); b.crumbles = true; b.crumbleDelay = .55; b.bottom = y - .5;}
    room(z, z + 18.6, 6.6, 7); z += 18.6; this.add(-6, 6, z, z + 6, y, y, 'flag'); room(z, z + 6, 6.6, 7, false); z += 6; cp.push(z - 3);
    // 6. library: crates on ropes over the pit, then the turning beams
    for (let i = 0; i < 4; i++) {const b = this.add(-1.3, 1.3, z + 1.5, z + 5.3, y, y, 'floor'); b.driftAmp = 3.8; b.driftPeriod = 3.3 + i * .3; b.driftPhase = i * 1.9; b.bottom = y - .6; z += 5.3;}
    room(z - 21.2, z + 1.5, 6, 9); z += 1.5;
    this.add(-10, 10, z, z + 26, y, y, 'floor'); room(z, z + 26, 10.6, 9); this.sweepers.push({x: 0, y: y + .55, z: z + 13, len: 9.2, speed: 1.2, angle: 0, arms: 2}); z += 26; cp.push(z - 3);
    // 7. hall of falling chandeliers
    this.add(-6, 6, z, z + 42, y, y, 'flag'); room(z, z + 42, 6.6, 10); this.fallZones.push([-5, 5, z + 2, z + 41]); z += 42;
    this.add(-6, 6, z, z + 6, y, y, 'floor'); room(z, z + 6, 6.6, 8, false); z += 6; cp.push(z - 3);
    // 8. grand staircase hops to the door
    const hz0 = z; for (const [hx, len] of [[0, 3], [-2.2, 2.6], [2, 2.6], [-.8, 2.4], [1.4, 2.6], [0, 3]]) {z += 2.1; y += .5; const b = this.add(hx - 1.8, hx + 1.8, z, z + len, y, y, 'flag'); b.liftAmp = .3; b.liftPeriod = 2.6; b.liftPhase = z; z += len;}
    this.fallZones.push([-3, 3, hz0, z]); room(hz0, z, 6.6, 12);
    z += 1.8; this.add(-9, 9, z, z + 20, y, y, 'flag'); room(z, z + 20, 9.6, 12); this.finishZ = z + 11;
    this.checkpoints = cp;
  }
  private add(x0: number, x1: number, z0: number, z1: number, y0: number, y1: number, mat: Mat): Block {
    const b: Block = {x0, x1, z0, z1, y0, y1, mat, bottom: THIN.includes(mat) ? Math.min(y0, y1) - .42 : BOTTOM, sink: false, liftAmp: 0, liftPeriod: 1, liftPhase: 0, lastOffY: 0, driftAmp: 0, driftPeriod: 1, driftPhase: 0, crumbles: false, crumbleDelay: .75, offX: 0, offY: 0, lastOffX: 0, crumbleAt: -1, fallV: 0, gone: false};
    this.blocks.push(b); return b;
  }
  spawnY(z: number) {let best = 0; for (const b of this.blocks) if (!b.crumbles && !b.driftAmp && z >= b.z0 && z <= b.z1) best = Math.max(best, top(b, z)); return best;}

  step(dt: number) {
    this.time += dt; const t0 = this.time;
    for (const b of this.blocks) {
      b.lastOffX = b.offX; b.lastOffY = b.offY;
      if (b.liftAmp) b.offY = b.liftAmp * Math.sin(Math.PI * 2 * t0 / b.liftPeriod + b.liftPhase);
      if (b.driftAmp) b.offX = b.driftAmp * Math.sin(Math.PI * 2 * t0 / b.driftPeriod + b.driftPhase);
      if (b.sink && b.crumbleAt < 0 && b.offY < 0) b.offY = Math.min(0, b.offY + dt * 1.2);
      if (b.crumbles && b.crumbleAt >= 0) {const t = t0 - b.crumbleAt;
        if (b.sink) {if (t > b.crumbleDelay) b.offY = Math.max(-2.6, b.offY - dt * 1.6); if (t > b.crumbleDelay + 3.2) {b.crumbleAt = -1;}}
        else if (t > b.crumbleDelay) {b.fallV += 26 * dt; b.offY -= b.fallV * dt; if (b.offY < -6) b.gone = true;}
        if (!b.sink && t > b.crumbleDelay + 3.8) {b.crumbleAt = -1; b.offY = 0; b.fallV = 0; b.gone = false;}}
    }
    for (const s of this.sweepers) s.angle = s.speed * t0;
    for (const p of this.pendulums) {p.swing = p.amp * Math.sin(Math.PI * 2 * t0 / p.period + p.phase); p.bx = p.px + Math.sin(p.swing) * p.len; p.by = p.py - Math.cos(p.swing) * p.len; p.bz = p.pz;}
    this.boulderTimer -= dt;
    if (this.boulderTimer <= 0 && this.theme !== 'graveyard') {this.seed = (this.seed * 1103515245 + 12345) | 0; const r = ((this.seed >>> 8) & 1023) / 1023; const radius = 1.1 + .4 * r;
      this.boulders.push({x: -4.6 + 9.2 * r, y: this.rampY1 + radius, z: this.rampZ1 - 1, vz: 0, spin: 0, radius, alive: true}); this.boulderTimer = 1.7 + .8 * r;}
    const slope = (this.rampY1 - this.rampY0) / (this.rampZ1 - this.rampZ0);
    for (const bo of this.boulders) {bo.vz -= 9 * dt; bo.z += bo.vz * dt; bo.spin += bo.vz * dt / bo.radius;
      if (bo.z > this.rampZ0) bo.y = this.rampY0 + (bo.z - this.rampZ0) * slope + bo.radius; else bo.y -= 30 * dt;
      if (bo.y < DEATH_Y - 10) bo.alive = false;}
    this.boulders = this.boulders.filter(b => b.alive);
    // rockfall: deterministic from the shared clock (same rocks on every phone)
    this.fallTimer -= dt;
    while (this.fallTimer <= 0 && this.fallZones.length) {
      const rnd = () => ((this.fallSeed = (this.fallSeed * 1103515245 + 12345) | 0) >>> 8 & 65535) / 65535;
      const zn = this.fallZones[rnd() < .72 ? 0 : 1], x = zn[0] + rnd() * (zn[1] - zn[0]), z = zn[2] + rnd() * (zn[3] - zn[2]);
      let g = -99; for (const b of this.blocks) if (!b.crumbles && !b.driftAmp && x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1) g = Math.max(g, top(b, z));
      const r = .8 + rnd() * .7; if (g > -50) this.fallers.push({id: ++this.fallId, x, z, g, spawn: t0, impact: t0 + 1.25 + rnd() * .3, r, y: g + 30, alive: true, landed: false});
      this.fallTimer += .2 + rnd() * .16;
    }
    for (const f of this.fallers) {const k = (t0 - f.spawn) / (f.impact - f.spawn);
      if (k < 1) f.y = f.g + f.r + 30 * (1 - k * k); else {f.landed = true; f.y = f.g + f.r * .7 - Math.max(0, t0 - f.impact - .6) * 2;}
      if (t0 > f.impact + 1.4) f.alive = false;}
    this.fallers = this.fallers.filter(f => f.alive);
  }

  move(r: Runner, dt: number) {
    if (r.finished) {r.vx = r.vy = r.vz = 0; return;}
    r.stun = Math.max(0, r.stun - dt); r.coyote -= dt; r.jumpBuffer -= dt;
    let ix = r.inX, iz = r.inZ; const il = Math.hypot(ix, iz); if (il > 1) {ix /= il; iz /= il;}
    const speed = 8.2; let acc = r.ground ? 46 : 16; if (r.stun > 0) acc = 3;
    r.vx = approach(r.vx, ix * speed, acc * dt); r.vz = approach(r.vz, iz * speed, acc * dt);
    if (il > .1) r.facing = Math.atan2(ix, iz);
    if (r.jump) {r.jumpBuffer = .14; r.jump = false;}
    if (r.jumpBuffer > 0 && r.coyote > 0 && r.stun <= 0) {r.vy = 9.6; r.coyote = 0; r.jumpBuffer = 0; r.ground = null;}
    r.vy -= (r.vy > 0 && !r.holdJump ? 38 : 26) * dt;
    if (r.ground) {r.x += r.ground.offX - r.ground.lastOffX; r.y += r.ground.offY - r.ground.lastOffY;}
    const prevY = r.y; r.x += r.vx * dt; r.y += r.vy * dt; r.z += r.vz * dt;
    let landed: Block | null = null;
    for (const b of this.blocks) {
      if (b.gone) continue;
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
    for (const s0 of this.sweepers) for (let arm = 0; arm < (s0.arms || 1); arm++) {const s = {...s0, angle: s0.angle + arm * Math.PI / (s0.arms || 1)};
      const ex = Math.cos(s.angle) * s.len, ez = Math.sin(s.angle) * s.len, t = clamp(((r.x - s.x) * ex + (r.z - s.z) * ez) / (ex * ex + ez * ez), -1, 1);
      const dx = r.x - (s.x + ex * t), dz = r.z - (s.z + ez * t), d = Math.hypot(dx, dz);
      if (d < R + .42 && r.y < s.y + .45 && r.y + H > s.y - .45) {const sg = Math.sign(t + 1e-4); this.hit(r, -Math.sin(s.angle) * sg * 11 + (d ? dx / d * 4 : 0), 6.5, Math.cos(s.angle) * sg * 11 + (d ? dz / d * 4 : 0));}
    }
    for (const p of this.pendulums) {const dx = r.x - p.bx, dy = r.y + H / 2 - p.by, dz = r.z - p.bz, rr = p.radius + R + .2;
      if (dx * dx + dy * dy + dz * dz < rr * rr) {const dir = Math.sign(Math.cos(Math.PI * 2 * this.time / p.period + p.phase)) || 1; this.hit(r, dir * 15, 7, Math.sign(dz) * 2);}}
    for (const f of this.fallers) {if (this.time > f.impact + .25) continue; const dx = r.x - f.x, dy = r.y + H / 2 - f.y, dz = r.z - f.z, rr = f.r + R;
      if (dx * dx + dy * dy + dz * dz < rr * rr) {const d = Math.hypot(dx, dz) || 1; this.hit(r, dx / d * 9, 8, dz / d * 9);}}
    for (const bo of this.boulders) {const dx = r.x - bo.x, dy = r.y + H / 2 - bo.y, dz = r.z - bo.z, rr = bo.radius + R;
      if (dx * dx + dy * dy + dz * dz < rr * rr) this.hit(r, Math.sign(dx) * 4, 6, -12);}
    for (let i = this.checkpoints.length - 1; i >= 0; i--) if (r.z >= this.checkpoints[i] && r.ground && !r.ground.crumbles && !r.ground.driftAmp) {r.checkpoint = Math.max(r.checkpoint, i); break;}
    if (r.y < this.deathY) this.respawn(r);
    r.progress = Math.max(r.progress, r.z);
    if (r.z >= this.finishZ && r.ground && !r.finished) {r.finished = true; r.finishTime = this.time;}
  }
  private hit(r: Runner, vx: number, vy: number, vz: number) {if (r.stun > .25) return; r.vx = vx; r.vy = vy; r.vz = vz; r.stun = .55; r.ground = null; r.coyote = 0;}
  respawn(r: Runner) {const z = this.checkpoints[r.checkpoint] + 2; r.x = ((r.slot % 5) - 2) * 1.4; r.y = this.spawnY(z) + 1.5; r.z = z; r.vx = r.vy = r.vz = 0; r.ground = null; r.falls++; r.stun = .3;}

  /** Bot: run the centreline (ride rafts), jump at steps, gaps, the log and boulders. */
  think(r: Runner, dt: number) {
    r.botCool -= dt; let tx = ((r.slot % 5) - 2) * .9;
    if (r.ground?.driftAmp) tx = (r.ground.x0 + r.ground.x1) / 2 + r.ground.offX;
    for (const b of this.blocks) if (b.driftAmp && b.z0 > r.z && b.z0 - r.z < 2.5) tx = (b.x0 + b.x1) / 2 + b.offX;
    r.inX = clamp((tx - r.x) * .6, -1, 1); r.inZ = 1;
    let want = false, support = false; const ahead = r.z + 1.3, here = r.ground ? top(r.ground, r.z) : r.y;
    for (const b of this.blocks) {if (b.gone) continue; if (r.x >= b.x0 + b.offX && r.x <= b.x1 + b.offX && ahead >= b.z0 && ahead <= b.z1) {support = true; if (top(b, ahead) > here + .35) want = true;}}
    if (!support) want = true;
    for (const s0 of this.sweepers) for (let arm = 0; arm < (s0.arms || 1); arm++) {const s = {...s0, angle: s0.angle + arm * Math.PI / (s0.arms || 1)}; const ex = Math.cos(s.angle) * s.len, ez = Math.sin(s.angle) * s.len, t = clamp(((r.x - s.x) * ex + (r.z - s.z) * ez) / (ex * ex + ez * ez), -1, 1);
      if (Math.hypot(r.x - (s.x + ex * t), r.z - (s.z + ez * t)) < 1.7) want = true;}
    for (const b of this.boulders) if (Math.abs(b.x - r.x) < b.radius + .6 && b.z > r.z && b.z - r.z < 3.2) want = true;
    for (const f of this.fallers) if (!f.landed && Math.abs(f.z - r.z - 1.5) < 2 && Math.abs(f.x - r.x) < f.r + .8) r.inX = Math.sign(r.x - f.x || 1);
    if (want && r.ground && r.botCool <= 0 && Math.random() < .55) {r.jump = true; r.holdJump = true; r.botCool = .35;}
    if (r.ground && !want) r.holdJump = false;
  }
}
const approach = (v: number, t: number, d: number) => v < t ? Math.min(t, v + d) : Math.max(t, v - d);
