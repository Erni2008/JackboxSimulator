// PRESSURE CONTROL transport.
// room mode: the player's own room seat (sessionStorage from the phone controller / host seat) talks to the Java
//   server over the existing /ws protocol: PRESSURE_START and PRESSURE_VALVE{valve,position,seq} only. The server owns
//   pressure, timer, stabilisation and the outcome; this class only predicts the needle between updates.
// local mode: no room on this device -> practice puzzle simulated in the page with the same rules.
import {PressureSim, generatePressure, rateOf, MAX_PSI, CRITICAL_PSI, ValveName, Outcome} from './pressure-sim';

export interface PressureView { pressure: number; safeLow: number; safeHigh: number; intake: number; release: number; stabilizer: number; holdMs: number; deadline: number; outcome: Outcome; critical: boolean; online: boolean }
const INTAKE = [0, 3, 7], RELEASE = [0, -3, -7];

export class PressureLink {
  mode: 'room' | 'local'; repairs = 0; onOutcome: (o: Outcome) => void = () => {}; onStatus: (text: string) => void = () => {};
  private creds: {code: string; token: string} | null = null; private ws: WebSocket | null = null; private retry = 0; private ping: any = 0; private authed = false;
  private offset = 0; private seq = Date.now(); private wantStart = false; private reported = '';
  // authoritative snapshot + local prediction
  private auth: any = null; private predP = 0; private predAt = 0; private predRate = 0; private valves = [0, 0, 0]; private pendingSeq = 0;
  private local: PressureSim | null = null;

  constructor() {
    try { const c = JSON.parse(sessionStorage.getItem('finalanswer-session') || 'null'); if (c?.code && c?.token) this.creds = {code: c.code, token: c.token}; } catch {}
    this.mode = this.creds ? 'room' : 'local'; if (this.creds) this.connect();
  }
  get active() { return this.mode === 'local' ? !!this.local : !!this.auth; }
  serverNow() { return Date.now() + this.offset; }

  // ------------------------------------------------------------- room transport
  private connect() {
    const ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`); this.ws = ws; this.authed = false;
    ws.onopen = () => { this.send('AUTH', {roomCode: this.creds!.code, token: this.creds!.token}); clearInterval(this.ping); this.ping = setInterval(() => this.send('PING', {}), 5000); };
    ws.onmessage = e => { try { this.handle(JSON.parse(e.data)); } catch {} };
    ws.onclose = e => { clearInterval(this.ping); if (this.ws !== ws) return; if (e.code === 4001 || e.code === 4002) { this.onStatus('Сеанс комнаты завершён'); return; }
      this.onStatus('Связь с сервером… восстанавливаем'); setTimeout(() => this.connect(), Math.min(5000, 400 * 2 ** this.retry++)); };
  }
  private send(type: string, payload: any) { if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify({type, requestId: Math.random().toString(36).slice(2), payload})); }
  private handle(ev: any) {
    const p = ev.payload || {}; if (typeof p.serverTime === 'number') this.offset = p.serverTime - Date.now();
    if (!this.authed && (ev.type === 'AUTHENTICATED' || ev.type === 'STATE' || p.roomCode)) { this.authed = true; this.retry = 0; this.onStatus(''); if (this.wantStart) this.send('PRESSURE_START', {}); }
    if (ev.type === 'ERROR' && p.code === 'NO_PRESSURE_PUZZLE' && this.wantStart) this.send('PRESSURE_START', {});
    if (typeof p.elevatorRepairs === 'number') this.repairs = p.elevatorRepairs;
    const v = p.elevatorPressure; if (!v) return;
    // a reply that predates our latest valve request does not overwrite the predicted valves
    const fresh = v.lastSeq >= this.pendingSeq; this.auth = v;
    if (fresh) { this.valves = [v.intake, v.release, v.stabilizer]; this.predP = v.pressure; this.predAt = v.at; this.predRate = v.rate; }
    if (v.outcome !== 'RUNNING' && this.reported !== v.puzzleId + v.outcome) { this.reported = v.puzzleId + v.outcome; this.wantStart = false; this.onOutcome(v.outcome); }
  }

  // ------------------------------------------------------------- API
  /** begin (or, after a reconnect, resume) this player's puzzle */
  start() {
    if (this.mode === 'local') { this.local = new PressureSim(generatePressure((Math.random() * 2 ** 31) | 0), Date.now()); this.reported = ''; return; }
    this.auth = null; this.wantStart = true; this.reported = ''; if (this.authed) this.send('PRESSURE_START', {});
  }
  stop() { this.local = null; this.auth = null; this.wantStart = false; }
  setValve(valve: ValveName, position: number) {
    const i = valve === 'INTAKE' ? 0 : valve === 'RELEASE' ? 1 : 2;
    if (this.mode === 'local') { this.local?.set(valve, position, Date.now()); return; }
    if (!this.auth || this.auth.outcome !== 'RUNNING') return;
    // predict from now with the new valve until the server confirms
    const now = this.serverNow(), stab = this.valves[2] === 1 ? .25 : 1, drift = this.predRate / stab - INTAKE[this.valves[0]] - RELEASE[this.valves[1]];
    this.predP = this.extrapolate(now); this.predAt = now; this.valves[i] = position; this.predRate = rateOf(drift, this.valves[0], this.valves[1], this.valves[2]);
    this.pendingSeq = ++this.seq; this.send('PRESSURE_VALVE', {valve, position, seq: this.seq});
  }
  private extrapolate(t: number) { return Math.max(0, Math.min(MAX_PSI, this.predP + this.predRate * Math.max(0, t - this.predAt) / 1000)); }

  /** display state for this frame (local: authoritative; room: predicted, never decides the outcome) */
  view(): PressureView | null {
    if (this.mode === 'local') {
      const s = this.local; if (!s) return null; if (s.advance(Date.now()) && s.outcome !== 'RUNNING') this.onOutcome(s.outcome);
      return {pressure: s.pressure, safeLow: s.config.safeLow, safeHigh: s.config.safeHigh, intake: s.intake, release: s.release, stabilizer: s.stabilizer, holdMs: s.holdMs, deadline: s.deadline - Date.now() + performance.now(), outcome: s.outcome, critical: s.pressure >= CRITICAL_PSI, online: false};
    }
    const v = this.auth; if (!v) return null; const now = this.serverNow(), end = v.outcome === 'RUNNING' ? Math.min(now, v.deadline) : v.at;
    const pressure = v.outcome === 'RUNNING' ? this.extrapolate(end) : v.pressure, inZone = pressure >= v.safeLow && pressure <= v.safeHigh;
    const holdMs = v.outcome === 'STABILIZED' ? 3000 : inZone ? Math.min(2990, v.holdMs + (v.lastSeq >= this.pendingSeq && v.holdMs > 0 ? Math.max(0, now - v.at) : 0)) : 0;
    return {pressure, safeLow: v.safeLow, safeHigh: v.safeHigh, intake: this.valves[0], release: this.valves[1], stabilizer: this.valves[2], holdMs, deadline: v.deadline - now + performance.now(), outcome: v.outcome, critical: pressure >= CRITICAL_PSI, online: true};
  }
}
