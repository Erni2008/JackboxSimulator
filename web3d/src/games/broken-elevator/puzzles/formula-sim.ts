// THE UNSTABLE FORMULA — client mirror of shared/.../gameplay/elevator/{Formula,FormulaPuzzle,FormulaGenerator}.java.
// In a room the Java server is authoritative (and never sends the recipe); this file powers the offline practice lab
// and the journal artwork, so the printed tables come from the same data the rules use.

export const LIMIT_MS = 45_000, DOSE_MS = 650, DRAIN_MS = 1_800, MAX_DOSES = 6;
export type Reagent = 'CRIMSON' | 'AZURE' | 'VERDANT' | 'AMBER' | 'VIOLET';
export const REAGENTS: Reagent[] = ['CRIMSON', 'AZURE', 'VERDANT', 'AMBER', 'VIOLET'];
export type Family = 'LUNAR' | 'SOLAR' | 'CRYSTAL' | 'ORGANIC';
export const FAMILIES: Family[] = ['LUNAR', 'SOLAR', 'CRYSTAL', 'ORGANIC'];
export const SYMBOL: Record<Family, string> = {LUNAR: '☾', SOLAR: '☀', CRYSTAL: '◆', ORGANIC: '✚'};
export const BASE: Record<Family, [Reagent, Reagent]> = {LUNAR: ['AZURE', 'VIOLET'], SOLAR: ['CRIMSON', 'AMBER'], CRYSTAL: ['VERDANT', 'AZURE'], ORGANIC: ['AMBER', 'VERDANT']};
export const ADDITIVE: Record<Reagent, [Reagent, Reagent, Reagent]> = {CRIMSON: ['AZURE', 'AMBER', 'VIOLET'], AZURE: ['CRIMSON', 'VERDANT', 'VIOLET'], VERDANT: ['CRIMSON', 'AZURE', 'AMBER'], AMBER: ['AZURE', 'VERDANT', 'VIOLET'], VIOLET: ['CRIMSON', 'VERDANT', 'AMBER']};
export const DOSES = {LOW: [2, 1], MEDIUM: [2, 2], HIGH: [1, 3]} as const;
export const incompatible = (b: Reagent) => REAGENTS.find(r => r !== b && !ADDITIVE[b].includes(r))!;
/** display colours (liquid shader uses these as the reagent's body colour) */
export const COLOR: Record<Reagent, string> = {CRIMSON: '#9e0f1e', AZURE: '#123f9a', VERDANT: '#0f8a3c', AMBER: '#e0a215', VIOLET: '#5e1a8c'};
export const GLINT: Record<Reagent, string> = {CRIMSON: '#ff6a4a', AZURE: '#4ad8ff', VERDANT: '#7dff9a', AMBER: '#ffe08a', VIOLET: '#ff5ae0'};
export const RU: Record<Reagent, string> = {CRIMSON: 'КРАСНЫЙ', AZURE: 'СИНИЙ', VERDANT: 'ЗЕЛЁНЫЙ', AMBER: 'ЖЁЛТЫЙ', VIOLET: 'ФИОЛЕТОВЫЙ'};

export interface Sample { sampleId: string; family: Family; cls: 1 | 2; reaction: 'A' | 'B' | 'C'; polarity: 'POSITIVE' | 'NEGATIVE'; concentration: 'LOW' | 'MEDIUM' | 'HIGH'; unstable: Reagent | '' }
export function solve(s: Sample) {
  const base = BASE[s.family][s.cls - 1], add = ADDITIVE[base]['ABC'.indexOf(s.reaction)], [nb, na] = DOSES[s.concentration];
  const first = s.polarity === 'POSITIVE' ? base : add, second = first === base ? add : base, n1 = first === base ? nb : na, n2 = first === base ? na : nb;
  return {base, add, sequence: [...Array(n1).fill(first), ...Array(n2).fill(second)] as Reagent[]};
}

export type Outcome = 'RUNNING' | 'STABILIZED' | 'FAILED';
export interface FormulaEvent { seq: number; type: 'DOSE' | 'REJECTED' | 'ACCEPTED' | 'LOCK' | 'FULL'; reagent: Reagent | ''; reason: string }
export class LabSim {
  doses: Reagent[] = []; lock = false; rejections = 0; outcome: Outcome = 'RUNNING'; failReason = ''; elapsed = 0; busyUntil = 0; drainUntil = -1; finishedAt = -1; lastSeq = -1; event: FormulaEvent | null = null;
  private recipe: Reagent[];
  constructor(public sample: Sample, public startedAt: number) { this.recipe = solve(sample).sequence; }
  advance(now: number) { if (this.outcome !== 'RUNNING') return false; this.elapsed = Math.min(Math.max(this.elapsed, now - this.startedAt), LIMIT_MS);
    if (this.drainUntil >= 0 && this.elapsed >= this.drainUntil) { this.doses = []; this.drainUntil = -1; }
    if (this.elapsed >= LIMIT_MS) { this.outcome = 'FAILED'; this.failReason = 'TIMEOUT'; this.finishedAt = this.startedAt + LIMIT_MS; return true; } return false; }
  apply(a: 'DISPENSE' | 'LOCK_ON' | 'LOCK_OFF' | 'INJECT', r: Reagent | null, seq: number, now: number) {
    this.advance(now); if (this.outcome !== 'RUNNING' || seq <= this.lastSeq) return false;
    if (a !== 'LOCK_ON' && a !== 'LOCK_OFF' && (this.elapsed < this.busyUntil || this.drainUntil >= 0)) return false; this.lastSeq = seq;
    if (a === 'LOCK_ON' || a === 'LOCK_OFF') { this.lock = a === 'LOCK_ON'; this.event = {seq, type: 'LOCK', reagent: '', reason: this.lock ? 'ON' : 'OFF'}; }
    else if (a === 'DISPENSE') { if (this.doses.length >= MAX_DOSES) { this.event = {seq, type: 'FULL', reagent: r!, reason: ''}; return true; }
      this.doses.push(r!); this.busyUntil = this.elapsed + DOSE_MS; if (r === this.sample.unstable && !this.lock) this.reject('UNSTABLE_UNPROTECTED', seq, r!); else this.event = {seq, type: 'DOSE', reagent: r!, reason: ''}; }
    else { if (this.doses.join() === this.recipe.join()) { this.outcome = 'STABILIZED'; this.finishedAt = this.startedAt + this.elapsed; this.event = {seq, type: 'ACCEPTED', reagent: '', reason: ''}; } else this.reject(this.doses.length ? 'WRONG_FORMULA' : 'EMPTY', seq, ''); }
    return true;
  }
  private reject(why: string, seq: number, r: Reagent | '') { this.rejections++; this.drainUntil = this.elapsed + DRAIN_MS; this.busyUntil = 0; this.event = {seq, type: 'REJECTED', reagent: r, reason: why}; }
}

const rng = (seed: number) => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export function generateSample(seed: number): Sample {
  const r = rng(seed), pick = <X>(a: readonly X[]) => a[Math.floor(r() * a.length)];
  const family = pick(FAMILIES), cls = (1 + Math.floor(r() * 2)) as 1 | 2, reaction = pick(['A', 'B', 'C'] as const), polarity = pick(['POSITIVE', 'NEGATIVE'] as const), concentration = pick(['LOW', 'MEDIUM', 'HIGH'] as const);
  const s: Sample = {sampleId: `X-${10 + Math.floor(r() * 90)}${'ABCDEF'[Math.floor(r() * 6)]}`, family, cls, reaction, polarity, concentration, unstable: ''};
  const {base, add} = solve(s); if (r() < .4) s.unstable = r() < .5 ? base : add; return s;
}
