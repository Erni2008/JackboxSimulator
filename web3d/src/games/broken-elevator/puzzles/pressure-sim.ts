import {DIFF, limitMs} from '../difficulty';
// THE BROKEN VALVES — client mirror of shared/.../gameplay/elevator/{PressurePuzzle,Malfunction,PressureGenerator}.java.
// In a room the Java server is authoritative and this file is only used for the offline practice machine.

const rng = (seed: number) => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export const MAX_PSI = 120, COARSE = 10, FINE = 2, EMERGENCY = 20, SURGE = 10, LEAK = 1;
export const LIMIT_MS = 45_000, VERIFY_MS = 1_000, DIAGNOSTIC_MS = 1_500, SURGE_WARNING_MS = 2_000, QUANTUM_MS = 10;
export type Fault = 'R02' | 'B04' | 'F01' | 'L03';
export const CODES: Record<Fault, string> = {R02: 'R-02', B04: 'B-04', F01: 'F-01', L03: 'L-03'};
export type Action = 'RED' | 'BLUE' | 'FINE_ON' | 'FINE_OFF' | 'BYPASS_AUX' | 'BYPASS_MAIN' | 'DIAGNOSTIC' | 'EMERGENCY' | 'CLAMP';
export type Outcome = 'RUNNING' | 'STABILIZED' | 'FAILED';
export interface Config { startPsi: number; safeLow: number; fault: Fault; second: Fault | null; fine: boolean; surgeAt: number; noise: boolean; seed: number }
const has = (c: Config, f: Fault) => c.fault === f || c.second === f;
const mech = (c: Config): Fault | null => c.fault !== 'L03' ? c.fault : c.second && c.second !== 'L03' ? c.second : null;
export const NOISE_MIN_MS = 500, NOISE_MAX_MS = 2_000;

const red = (f: Fault | null, step: number, by: boolean) => f === 'R02' ? (by ? step : 0) : f === 'F01' ? (by ? step : -step) : step;
const blue = (f: Fault | null, step: number, by: boolean) => f === 'B04' ? (by ? -step : 0) : f === 'F01' ? (by ? -step : step) : -step;

export class ValveSim {
  limit = limitMs('pressure');
  clamped = false; lastNoiseAt = -1; lastNoise = 0; private nextNoise = -1; private nr: () => number;
  pressure: number; fine: boolean; bypass = false; emergencyUsed = false; diagnosed = false; surged = false; elapsed = 0; verifyMs = 0; diagnosticAt = -1; lastSeq = -1;
  outcome: Outcome = 'RUNNING'; failReason = ''; finishedAt = -1; effect: {seq: number; action: Action; delta: number; jammed: boolean} | null = null;
  constructor(public config: Config, public startedAt: number) { this.pressure = config.startPsi; this.fine = config.fine; this.nr = rng(config.seed * 31 + 7); if (config.noise) this.nextNoise = this.gap(); }
  private gap() { return NOISE_MIN_MS + Math.floor(this.nr() * ((NOISE_MAX_MS - NOISE_MIN_MS) / QUANTUM_MS + 1)) * QUANTUM_MS; }
  leaking() { return has(this.config, 'L03') && !this.clamped; }
  get safeHigh() { return this.config.safeLow + 5; }
  inZone() { return this.pressure >= this.config.safeLow && this.pressure <= this.safeHigh; }
  safeState() { return !this.leaking(); }
  drift() { return this.leaking() ? -LEAK : 0; }
  surgeWarning() { return this.config.surgeAt >= 0 && !this.surged && this.outcome === 'RUNNING' && this.elapsed >= this.config.surgeAt - SURGE_WARNING_MS; }
  get code() { return this.diagnosed ? (['R02', 'B04', 'F01', 'L03'] as Fault[]).filter(f => has(this.config, f)).map(f => CODES[f]).join(' + ') : ''; }
  get diagnosing() { return this.diagnosticAt >= 0 && this.elapsed < this.diagnosticAt + DIAGNOSTIC_MS; }
  advance(now: number) {
    if (this.outcome !== 'RUNNING') return false; const target = Math.min(now - this.startedAt, this.limit);
    while (this.elapsed + QUANTUM_MS <= target && this.outcome === 'RUNNING') {
      this.elapsed += QUANTUM_MS; this.pressure = Math.max(0, this.pressure + this.drift() * QUANTUM_MS / 1000);
      if (!this.surged && this.config.surgeAt >= 0 && this.elapsed >= this.config.surgeAt) { this.surged = true; this.pressure += SURGE; if (this.critical()) return true; }
      if (this.nextNoise >= 0 && this.elapsed >= this.nextNoise) { this.lastNoise = (this.nr() < .5 ? 1 : -1) * (1 + Math.floor(this.nr() * 2)); this.pressure = Math.max(0, this.pressure + this.lastNoise); this.lastNoiseAt = this.elapsed; this.nextNoise = this.elapsed + this.gap(); if (this.critical()) return true; }
      if (this.diagnosticAt >= 0 && this.elapsed >= this.diagnosticAt + DIAGNOSTIC_MS) this.diagnosed = true;
      this.verifyMs = this.inZone() && this.safeState() ? this.verifyMs + QUANTUM_MS : 0;
      if (this.verifyMs >= VERIFY_MS) { this.outcome = 'STABILIZED'; this.finishedAt = this.startedAt + this.elapsed; return true; }
    }
    if (this.elapsed >= this.limit && this.outcome === 'RUNNING') { this.outcome = 'FAILED'; this.failReason = 'TIMEOUT'; this.finishedAt = this.startedAt + this.limit; return true; }
    return false;
  }
  private critical() { if (this.pressure < MAX_PSI) return false; this.pressure = MAX_PSI; this.outcome = 'FAILED'; this.failReason = 'CRITICAL'; this.finishedAt = this.startedAt + this.elapsed; return true; }
  /** false: duplicate/ended; throws 'EMERGENCY_USED' */
  apply(a: Action, seq: number, now: number) {
    this.advance(now); if (this.outcome !== 'RUNNING' || seq <= this.lastSeq) return false;
    if (a === 'EMERGENCY' && this.emergencyUsed) throw new Error('EMERGENCY_USED'); this.lastSeq = seq;
    const step = this.fine ? FINE : COARSE, before = this.pressure, f = mech(this.config); let jammed = false;
    if (a === 'RED') { jammed = f === 'R02' && !this.bypass; this.pressure += red(f, step, this.bypass); }
    else if (a === 'BLUE') { jammed = f === 'B04' && !this.bypass; this.pressure += blue(f, step, this.bypass); }
    else if (a === 'FINE_ON') this.fine = true; else if (a === 'FINE_OFF') this.fine = false;
    else if (a === 'BYPASS_AUX') this.bypass = true; else if (a === 'BYPASS_MAIN') this.bypass = false;
    else if (a === 'DIAGNOSTIC') this.diagnosticAt = this.elapsed;
    else if (a === 'CLAMP') this.clamped = true;
    else if (a === 'EMERGENCY') { this.emergencyUsed = true; this.pressure -= EMERGENCY; }
    this.pressure = Math.max(0, this.pressure); if (this.pressure !== before) this.verifyMs = 0;
    this.effect = {seq, action: a, delta: this.pressure - before, jammed}; this.critical(); return true;
  }
}

const SAFE_LOW = [40, 45, 50, 55, 60, 65, 70, 75], FAULTS: Fault[] = ['R02', 'B04', 'F01', 'L03'];

/** same scripted player as PressureGenerator.solveTime */
export function solveTime(c: Config, reaction: number, read: number) {
  const p = new ValveSim(c, 0); let t = 0, seq = 0; p.apply('DIAGNOSTIC', seq++, t); const ready = DIAGNOSTIC_MS + read;
  while (p.outcome === 'RUNNING' && t < p.limit) { t += reaction; p.advance(t); if (p.outcome !== 'RUNNING' || t < ready) continue;
    if (mech(c) && !p.bypass) { p.apply('BYPASS_AUX', seq++, t); continue; } if (has(c, 'L03') && !p.clamped) { p.apply('CLAMP', seq++, t); continue; } const err = c.safeLow + 2.5 - p.pressure, a = Math.abs(err);
    const next: Action | null = a > 6 ? (p.fine ? 'FINE_OFF' : err > 0 ? 'RED' : 'BLUE') : a > 1.5 ? (!p.fine ? 'FINE_ON' : err > 0 ? 'RED' : 'BLUE') : null; if (next) p.apply(next, seq++, t); }
  return p.outcome === 'STABILIZED' ? p.finishedAt : Infinity;
}
export function generate(seed: number): Config {
  const r = rng(seed);
  for (let i = 0; i < 1000; i++) {
    const safeLow = SAFE_LOW[Math.floor(r() * 8)]; let startPsi: number; do startPsi = 10 + Math.floor(r() * 91); while (startPsi > safeLow - 6 && startPsi < safeLow + 11);
    const d = DIFF(), fault = FAULTS[Math.floor(r() * 4)], second: Fault | null = (d === 'HARD' || d === 'NORMAL' && r() < .5) ? (fault === 'L03' ? FAULTS[Math.floor(r() * 3)] : 'L03') : null;
    const c: Config = {startPsi, safeLow, fault, second, fine: r() < .5, surgeAt: d !== 'EASY' && (d === 'HARD' || r() < .6) ? (d === 'HARD' ? 12_000 : 15_000) + Math.floor(r() * 1001) * 10 : -1, noise: d !== 'EASY', seed: (seed * 1000 + i) | 0};
    const idle = new ValveSim(c, 0); idle.advance(idle.limit); if (idle.outcome === 'STABILIZED') continue;
    if (solveTime(c, 600, 2500) <= Math.min(30_000, limitMs('pressure') - 5000) && solveTime(c, 1000, 4000) <= limitMs('pressure')) return c;
  }
  return {startPsi: 30, safeLow: 60, fault: 'R02', second: null, fine: false, surgeAt: -1, noise: false, seed: 1};
}
