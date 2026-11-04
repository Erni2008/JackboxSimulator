// THE BROKEN VALVES — client mirror of shared/.../gameplay/elevator/{PressurePuzzle,Malfunction,PressureGenerator}.java.
// In a room the Java server is authoritative and this file is only used for the offline practice machine.

export const MAX_PSI = 120, COARSE = 10, FINE = 2, EMERGENCY = 20, SURGE = 10, LEAK = 1;
export const LIMIT_MS = 45_000, VERIFY_MS = 1_000, DIAGNOSTIC_MS = 1_500, SURGE_WARNING_MS = 2_000, QUANTUM_MS = 10;
export type Fault = 'R02' | 'B04' | 'F01' | 'L03';
export const CODES: Record<Fault, string> = {R02: 'R-02', B04: 'B-04', F01: 'F-01', L03: 'L-03'};
export type Action = 'RED' | 'BLUE' | 'FINE_ON' | 'FINE_OFF' | 'BYPASS_AUX' | 'BYPASS_MAIN' | 'DIAGNOSTIC' | 'EMERGENCY';
export type Outcome = 'RUNNING' | 'STABILIZED' | 'FAILED';
export interface Config { startPsi: number; safeLow: number; fault: Fault; fine: boolean; surgeAt: number }

const red = (f: Fault, step: number, by: boolean) => f === 'R02' ? (by ? step : 0) : f === 'F01' ? (by ? step : -step) : step;
const blue = (f: Fault, step: number, by: boolean) => f === 'B04' ? (by ? -step : 0) : f === 'F01' ? (by ? -step : step) : -step;

export class ValveSim {
  pressure: number; fine: boolean; bypass = false; emergencyUsed = false; diagnosed = false; surged = false; elapsed = 0; verifyMs = 0; diagnosticAt = -1; lastSeq = -1;
  outcome: Outcome = 'RUNNING'; failReason = ''; finishedAt = -1; effect: {seq: number; action: Action; delta: number; jammed: boolean} | null = null;
  constructor(public config: Config, public startedAt: number) { this.pressure = config.startPsi; this.fine = config.fine; }
  get safeHigh() { return this.config.safeLow + 5; }
  inZone() { return this.pressure >= this.config.safeLow && this.pressure <= this.safeHigh; }
  safeState() { return this.config.fault !== 'L03' || this.bypass; }
  drift() { return this.config.fault === 'L03' && !this.bypass ? -LEAK : 0; }
  surgeWarning() { return this.config.surgeAt >= 0 && !this.surged && this.outcome === 'RUNNING' && this.elapsed >= this.config.surgeAt - SURGE_WARNING_MS; }
  get code() { return this.diagnosed ? CODES[this.config.fault] : ''; }
  get diagnosing() { return this.diagnosticAt >= 0 && this.elapsed < this.diagnosticAt + DIAGNOSTIC_MS; }
  advance(now: number) {
    if (this.outcome !== 'RUNNING') return false; const target = Math.min(now - this.startedAt, LIMIT_MS);
    while (this.elapsed + QUANTUM_MS <= target && this.outcome === 'RUNNING') {
      this.elapsed += QUANTUM_MS; this.pressure = Math.max(0, this.pressure + this.drift() * QUANTUM_MS / 1000);
      if (!this.surged && this.config.surgeAt >= 0 && this.elapsed >= this.config.surgeAt) { this.surged = true; this.pressure += SURGE; if (this.critical()) return true; }
      if (this.diagnosticAt >= 0 && this.elapsed >= this.diagnosticAt + DIAGNOSTIC_MS) this.diagnosed = true;
      this.verifyMs = this.inZone() && this.safeState() ? this.verifyMs + QUANTUM_MS : 0;
      if (this.verifyMs >= VERIFY_MS) { this.outcome = 'STABILIZED'; this.finishedAt = this.startedAt + this.elapsed; return true; }
    }
    if (this.elapsed >= LIMIT_MS && this.outcome === 'RUNNING') { this.outcome = 'FAILED'; this.failReason = 'TIMEOUT'; this.finishedAt = this.startedAt + LIMIT_MS; return true; }
    return false;
  }
  private critical() { if (this.pressure < MAX_PSI) return false; this.pressure = MAX_PSI; this.outcome = 'FAILED'; this.failReason = 'CRITICAL'; this.finishedAt = this.startedAt + this.elapsed; return true; }
  /** false: duplicate/ended; throws 'EMERGENCY_USED' */
  apply(a: Action, seq: number, now: number) {
    this.advance(now); if (this.outcome !== 'RUNNING' || seq <= this.lastSeq) return false;
    if (a === 'EMERGENCY' && this.emergencyUsed) throw new Error('EMERGENCY_USED'); this.lastSeq = seq;
    const step = this.fine ? FINE : COARSE, before = this.pressure, f = this.config.fault; let jammed = false;
    if (a === 'RED') { jammed = f === 'R02' && !this.bypass; this.pressure += red(f, step, this.bypass); }
    else if (a === 'BLUE') { jammed = f === 'B04' && !this.bypass; this.pressure += blue(f, step, this.bypass); }
    else if (a === 'FINE_ON') this.fine = true; else if (a === 'FINE_OFF') this.fine = false;
    else if (a === 'BYPASS_AUX') this.bypass = true; else if (a === 'BYPASS_MAIN') this.bypass = false;
    else if (a === 'DIAGNOSTIC') this.diagnosticAt = this.elapsed;
    else if (a === 'EMERGENCY') { this.emergencyUsed = true; this.pressure -= EMERGENCY; }
    this.pressure = Math.max(0, this.pressure); if (this.pressure !== before) this.verifyMs = 0;
    this.effect = {seq, action: a, delta: this.pressure - before, jammed}; this.critical(); return true;
  }
}

const rng = (seed: number) => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const SAFE_LOW = [40, 45, 50, 55, 60, 65, 70, 75], FAULTS: Fault[] = ['R02', 'B04', 'F01', 'L03'];

/** same scripted player as PressureGenerator.solveTime */
export function solveTime(c: Config, reaction: number, read: number) {
  const p = new ValveSim(c, 0); let t = 0, seq = 0; p.apply('DIAGNOSTIC', seq++, t); const ready = DIAGNOSTIC_MS + read;
  while (p.outcome === 'RUNNING' && t < LIMIT_MS) { t += reaction; p.advance(t); if (p.outcome !== 'RUNNING' || t < ready) continue;
    if (!p.bypass) { p.apply('BYPASS_AUX', seq++, t); continue; } const err = c.safeLow + 2.5 - p.pressure, a = Math.abs(err);
    const next: Action | null = a > 6 ? (p.fine ? 'FINE_OFF' : err > 0 ? 'RED' : 'BLUE') : a > 1.5 ? (!p.fine ? 'FINE_ON' : err > 0 ? 'RED' : 'BLUE') : null; if (next) p.apply(next, seq++, t); }
  return p.outcome === 'STABILIZED' ? p.finishedAt : Infinity;
}
export function generate(seed: number): Config {
  const r = rng(seed);
  for (let i = 0; i < 1000; i++) {
    const safeLow = SAFE_LOW[Math.floor(r() * 8)]; let startPsi: number; do startPsi = 10 + Math.floor(r() * 91); while (startPsi > safeLow - 6 && startPsi < safeLow + 11);
    const c: Config = {startPsi, safeLow, fault: FAULTS[Math.floor(r() * 4)], fine: r() < .5, surgeAt: r() < .6 ? 15_000 + Math.floor(r() * 1001) * 10 : -1};
    const idle = new ValveSim(c, 0); idle.advance(LIMIT_MS); if (idle.outcome === 'STABILIZED') continue;
    if (solveTime(c, 600, 2500) <= 30_000 && solveTime(c, 1000, 4000) <= LIMIT_MS) return c;
  }
  return {startPsi: 30, safeLow: 60, fault: 'R02', fine: false, surgeAt: -1};
}
