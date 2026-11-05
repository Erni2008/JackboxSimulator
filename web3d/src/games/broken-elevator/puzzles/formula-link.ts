// THE UNSTABLE FORMULA transport: room mode talks FORMULA_START / FORMULA_ACTION{action, seq, reagent?} over the shared
// room socket (the server keeps the recipe); local mode runs a practice lab in the page with the same rules.
import {RoomSocket} from './room-socket';
import {LabSim, generateSample, solve, type Reagent, type Outcome, type Sample, type FormulaEvent} from './formula-sim';

export interface LabView extends Sample { doses: Reagent[]; lock: boolean; dispensing: boolean; draining: boolean; drainLeft: number; rejections: number; deadline: number; outcome: Outcome; failReason: string; event: FormulaEvent | null; online: boolean }

export class FormulaLink {
  mode: 'room' | 'local'; repairs = 0; penalties = 0; onOutcome: (o: Outcome, reason: string) => void = () => {};
  private sock = RoomSocket.shared(); private seq = Date.now(); private wantStart = false; private reported = ''; private auth: any = null; private local: LabSim | null = null;
  constructor() {
    this.mode = this.sock ? 'room' : 'local';
    if (this.sock) { this.sock.listen(ev => this.handle(ev)); this.sock.onAuth(() => { if (this.wantStart) this.sock!.send('FORMULA_START', {}); }); }
  }
  private handle(ev: any) {
    const p = ev.payload || {}; if (typeof p.elevatorRepairs === 'number') this.repairs = p.elevatorRepairs; if (typeof p.elevatorPenalties === 'number') this.penalties = p.elevatorPenalties;
    if (ev.type === 'ERROR' && p.code === 'NO_FORMULA_PUZZLE' && this.wantStart) this.sock!.send('FORMULA_START', {});
    const v = p.elevatorFormula; if (!v || !this.wantStart && !this.auth) return; this.auth = v;
    if (v.outcome !== 'RUNNING' && this.reported !== v.puzzleId + v.outcome) { this.reported = v.puzzleId + v.outcome; this.wantStart = false; this.onOutcome(v.outcome, v.failReason); }
  }
  start() {
    if (this.mode === 'local') { const smp = generateSample((Math.random() * 2 ** 31) | 0); if (new URLSearchParams(location.search).get('unstable') === '1' && !smp.unstable) smp.unstable = solve(smp).base; /* practice-only QA hook */ this.local = new LabSim(smp, Date.now()); this.reported = ''; return; }
    this.auth = null; this.wantStart = true; this.reported = ''; if (this.sock?.authed) this.sock.send('FORMULA_START', {});
  }
  stop() { this.local = null; this.auth = null; this.wantStart = false; }
  act(action: 'DISPENSE' | 'LOCK_ON' | 'LOCK_OFF' | 'INJECT', reagent?: Reagent) {
    if (this.mode === 'local') { this.local?.apply(action, reagent ?? null, ++this.seq, Date.now()); return; }
    if (!this.auth || this.auth.outcome !== 'RUNNING') return; this.sock!.send('FORMULA_ACTION', reagent ? {action, seq: ++this.seq, reagent} : {action, seq: ++this.seq});
  }
  view(): LabView | null {
    const nowP = performance.now();
    if (this.mode === 'local') { const s = this.local; if (!s) return null; s.advance(Date.now()); if (s.outcome !== 'RUNNING' && this.reported !== s.sample.sampleId + s.startedAt) { this.reported = s.sample.sampleId + s.startedAt; this.onOutcome(s.outcome, s.failReason); }
      return {...s.sample, doses: [...s.doses], lock: s.lock, dispensing: s.elapsed < s.busyUntil, draining: s.drainUntil >= 0, drainLeft: s.drainUntil >= 0 ? s.drainUntil - s.elapsed : 0, rejections: s.rejections, deadline: s.startedAt + s.limit - Date.now() + nowP, outcome: s.outcome, failReason: s.failReason, event: s.event, online: false}; }
    const v = this.auth; if (!v) return null; const now = this.sock!.serverNow();
    return {sampleId: v.sampleId, family: v.family, cls: v.cls, reaction: v.reaction, polarity: v.polarity, concentration: v.concentration, unstable: v.unstable, doses: v.doses, lock: v.lock,
      dispensing: now < v.busyUntil, draining: v.drainUntil > 0 && now < v.drainUntil, drainLeft: v.drainUntil > 0 ? Math.max(0, v.drainUntil - now) : 0, rejections: v.rejections, deadline: v.deadline - now + nowP, outcome: v.outcome, failReason: v.failReason, event: v.event || null, online: true};
  }
}
