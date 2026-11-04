// THE BROKEN VALVES transport.
// room mode: the player's own room seat (sessionStorage from the phone controller / host seat) talks to the Java server
//   over the existing /ws protocol — PRESSURE_START and PRESSURE_ACTION{action, seq} only. The server owns the fault,
//   pressure, timer, verification, surge and outcome; the fault stays hidden until a TEST completes, so the client does
//   not predict valve effects — it only extrapolates the published leak drift between updates.
// local mode: no room on this device -> a practice machine simulated in the page with the same rules.
import {RoomSocket} from './room-socket';
import {ValveSim, generate, MAX_PSI, LIMIT_MS, type Action, type Outcome} from './pressure-sim';

export interface Effect { seq: number; action: Action; delta: number; jammed: boolean }
export interface ValveView {
  pressure: number; safeLow: number; safeHigh: number; fine: boolean; bypass: boolean; emergencyUsed: boolean; diagnosing: boolean; code: string;
  surgeWarning: boolean; surged: boolean; clamped: boolean; noiseAt: number; noise: number; verifyMs: number; safeState: boolean; deadline: number; outcome: Outcome; failReason: string; effect: Effect | null; online: boolean;
}

export class PressureLink {
  mode: 'room' | 'local'; repairs = 0; penalties = 0;
  onOutcome: (o: Outcome, reason: string) => void = () => {}; onStatus: (text: string) => void = () => {}; onRejected: (code: string) => void = () => {};
  private sock = RoomSocket.shared(); private seq = Date.now(); private wantStart = false; private reported = '';
  private auth: any = null; private local: ValveSim | null = null;

  constructor() {
    this.mode = this.sock ? 'room' : 'local';
    if (this.sock) { this.sock.listen(ev => this.handle(ev)); this.sock.onAuth(() => { if (this.wantStart) this.send('PRESSURE_START', {}); }); this.sock.onStatus = t => this.onStatus(t); }
  }
  serverNow() { return this.sock ? this.sock.serverNow() : Date.now(); }
  private send(type: string, payload: any) { this.sock?.send(type, payload); }
  private handle(ev: any) {
    const p = ev.payload || {};
    if (ev.type === 'ERROR' && this.wantStart !== undefined && (p.code === 'NO_PRESSURE_PUZZLE' || p.code === 'EMERGENCY_USED' || String(p.code).startsWith('INVALID_PRESSURE'))) { if (p.code === 'NO_PRESSURE_PUZZLE' && this.wantStart) this.send('PRESSURE_START', {}); else { this.onRejected(p.code); this.send('SYNC', {}); } }
    if (typeof p.elevatorRepairs === 'number') this.repairs = p.elevatorRepairs; if (typeof p.elevatorPenalties === 'number') this.penalties = p.elevatorPenalties;
    const v = p.elevatorPressure; if (!v) return; this.auth = v;
    if (v.outcome !== 'RUNNING' && this.reported !== v.puzzleId + v.outcome) { this.reported = v.puzzleId + v.outcome; this.wantStart = false; this.onOutcome(v.outcome, v.failReason); }
  }

  /** begin (or, after a reconnect, resume) this player's machine */
  start() {
    if (this.mode === 'local') { const c = generate((Math.random() * 2 ** 31) | 0); const q = new URLSearchParams(location.search).get('surgeAt'); if (q) c.surgeAt = +q; /* practice-only QA hook */ this.local = new ValveSim(c, Date.now()); this.reported = ''; return; }
    this.auth = null; this.wantStart = true; this.reported = ''; if (this.sock?.authed) this.send('PRESSURE_START', {});
  }
  stop() { this.local = null; this.auth = null; this.wantStart = false; }
  act(action: Action) {
    if (this.mode === 'local') { const s = this.local; if (!s) return; try { s.apply(action, ++this.seq, Date.now()); } catch (e: any) { this.onRejected(e.message); } return; }
    if (!this.auth || this.auth.outcome !== 'RUNNING') return; this.send('PRESSURE_ACTION', {action, seq: ++this.seq});
  }

  /** display state for this frame (never decides the outcome in room mode) */
  view(): ValveView | null {
    const nowP = performance.now();
    if (this.mode === 'local') {
      const s = this.local; if (!s) return null; s.advance(Date.now()); if (s.outcome !== 'RUNNING' && this.reported !== 'L' + s.startedAt) { this.reported = 'L' + s.startedAt; this.onOutcome(s.outcome, s.failReason); } // outcomes from actions (critical) and from time
      return {pressure: s.pressure, safeLow: s.config.safeLow, safeHigh: s.safeHigh, fine: s.fine, bypass: s.bypass, emergencyUsed: s.emergencyUsed, diagnosing: s.diagnosing, code: s.code,
        surgeWarning: s.surgeWarning(), surged: s.surged, clamped: s.clamped, noiseAt: s.lastNoiseAt < 0 ? -1 : s.startedAt + s.lastNoiseAt, noise: s.lastNoise, verifyMs: s.verifyMs, safeState: s.safeState(), deadline: s.startedAt + LIMIT_MS - Date.now() + nowP, outcome: s.outcome, failReason: s.failReason, effect: s.effect, online: false};
    }
    const v = this.auth; if (!v) return null; const now = this.serverNow();
    const pressure = v.outcome === 'RUNNING' ? Math.max(0, Math.min(MAX_PSI, v.pressure + v.drift * Math.max(0, Math.min(now, v.deadline) - v.at) / 1000)) : v.pressure;
    const inZone = pressure >= v.safeLow && pressure <= v.safeHigh, verify = v.outcome === 'STABILIZED' ? 1000 : inZone && v.safeState && v.verifyMs > 0 ? Math.min(990, v.verifyMs + Math.max(0, now - v.at)) : 0;
    return {pressure, safeLow: v.safeLow, safeHigh: v.safeHigh, fine: v.fine, bypass: v.bypass, emergencyUsed: v.emergencyUsed, diagnosing: v.diagnosing || (v.diagnosticReadyAt > 0 && now < v.diagnosticReadyAt), code: v.code,
      surgeWarning: v.surgeWarning || (v.surgeAt > 0 && now >= v.surgeAt - 2000 && now < v.surgeAt), surged: v.surged, clamped: v.clamped, noiseAt: v.noiseAt, noise: v.noise, verifyMs: verify, safeState: v.safeState, deadline: v.deadline - now + nowP, outcome: v.outcome, failReason: v.failReason, effect: v.effect || null, online: true};
  }
}
