// PRESSURE CONTROL — client mirror of shared/.../gameplay/elevator/PressurePuzzle.java.
// In a room the Java server is authoritative and this is only used to predict the needle between updates.
// Without a room (practice / development) it runs the puzzle locally with the exact same rules.

export const MAX_PSI = 120, CRITICAL_PSI = 110, LIMIT_MS = 60_000, HOLD_MS = 2_000, QUANTUM_MS = 10, STAB = .25, SAFE_WIDTH = 16;
const INTAKE = [0, 3, 7], RELEASE = [0, -3, -7], DRIFTS = [-1, -.5, .5, 1], SAFE_LOW = [42, 47, 52, 57];
export type ValveName = 'INTAKE' | 'RELEASE' | 'STABILIZER';
export const POSITIONS: Record<ValveName, number> = {INTAKE: 3, RELEASE: 3, STABILIZER: 2};
export type Outcome = 'RUNNING' | 'STABILIZED' | 'FAILED';
export interface PressureConfig { startPsi: number; safeLow: number; safeHigh: number; drift: number; intake: number; release: number; stabilizer: number }

/** the shared rate law (PSI/s) */
export const rateOf = (drift: number, intake: number, release: number, stabilizer: number) => (drift + INTAKE[intake] + RELEASE[release]) * (stabilizer === 1 ? STAB : 1);

export class PressureSim {
  pressure: number; intake: number; release: number; stabilizer: number; elapsed = 0; holdMs = 0; outcome: Outcome = 'RUNNING'; finishedAt = -1;
  constructor(public config: PressureConfig, public startedAt: number) { this.pressure = config.startPsi; this.intake = config.intake; this.release = config.release; this.stabilizer = config.stabilizer; }
  rate() { return rateOf(this.config.drift, this.intake, this.release, this.stabilizer); }
  inZone() { return this.pressure >= this.config.safeLow && this.pressure <= this.config.safeHigh; }
  get deadline() { return this.startedAt + LIMIT_MS; }
  advance(now: number) {
    if (this.outcome !== 'RUNNING') return false; const target = Math.min(now - this.startedAt, LIMIT_MS);
    while (this.elapsed + QUANTUM_MS <= target) {
      this.pressure = Math.max(0, Math.min(MAX_PSI, this.pressure + this.rate() * QUANTUM_MS / 1000)); this.elapsed += QUANTUM_MS;
      this.holdMs = this.inZone() ? this.holdMs + QUANTUM_MS : 0;
      if (this.holdMs >= HOLD_MS) { this.outcome = 'STABILIZED'; this.finishedAt = this.startedAt + this.elapsed; return true; }
    }
    if (this.elapsed >= LIMIT_MS) { this.outcome = 'FAILED'; this.finishedAt = this.startedAt + LIMIT_MS; return true; }
    return false;
  }
  set(v: ValveName, pos: number, now: number) { if (pos < 0 || pos >= POSITIONS[v]) throw new Error('invalid position'); this.advance(now); if (this.outcome !== 'RUNNING') return false; if (v === 'INTAKE') this.intake = pos; else if (v === 'RELEASE') this.release = pos; else this.stabilizer = pos; return true; }
}

/** small seeded PRNG for practice puzzles */
const rng = (seed: number) => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/** Same constraints as the server generator: outside the zone, not winnable idle, solvable by a 600 ms-reaction controller in 30 s. */
export function generatePressure(seed: number): PressureConfig {
  const r = rng(seed);
  for (let attempt = 0; attempt < 600; attempt++) {
    const safeLow = SAFE_LOW[Math.floor(r() * 4)], safeHigh = safeLow + SAFE_WIDTH, drift = DRIFTS[Math.floor(r() * 4)];
    let startPsi: number; do startPsi = 20 + Math.floor(r() * 81); while (startPsi > safeLow - 8 && startPsi < safeHigh + 8);
    const c: PressureConfig = {startPsi, safeLow, safeHigh, drift, intake: Math.floor(r() * 3), release: Math.floor(r() * 3), stabilizer: Math.floor(r() * 2)};
    const idle = new PressureSim(c, 0); idle.advance(LIMIT_MS); if (idle.outcome === 'STABILIZED') continue;
    const p = new PressureSim(c, 0); let t = 0;
    while (p.outcome === 'RUNNING' && t < LIMIT_MS) { const err = (safeLow + safeHigh) / 2 - p.pressure, a = Math.abs(err);
      p.set('INTAKE', a > 12 ? (err > 0 ? 2 : 0) : a > 3 ? (err > 0 ? 1 : 0) : 1, t); p.set('RELEASE', a > 12 ? (err > 0 ? 0 : 2) : a > 3 ? (err > 0 ? 0 : 1) : 1, t); p.set('STABILIZER', a > 12 ? 0 : 1, t); t += 600; p.advance(t); }
    if (p.outcome === 'STABILIZED' && p.finishedAt <= 35_000) return c;
  }
  return {startPsi: 30, safeLow: 55, safeHigh: 65, drift: -.75, intake: 0, release: 1, stabilizer: 0};
}
