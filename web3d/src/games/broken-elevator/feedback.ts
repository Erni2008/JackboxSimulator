// THE BROKEN ELEVATOR — host voice-over and haptics.
// Voice: the game's saved host voice (FINAL ANSWER RU host, offline-generated; see tools/host-tts). Files live in
// web/broken-elevator-manual/voice/<id>.m4a (AAC: decodes on iOS Safari and Android Chrome). Missing lines are skipped
// silently, so the page works with any subset. Russian only: the host voice exists in Russian only.
// Haptics: navigator.vibrate on Android; on iPhone (Safari 18+) a hidden <input switch> toggled from a gesture fires the
// system tap haptic; outside a gesture iOS gives no haptic and this is a no-op.
import {LANG} from './i18n';

export type Line = 'intro' | 'tutorial_wire' | 'tutorial_pressure' | 'tutorial_formula' | 'tutorial_lock' | 'task_lock' | 'task_wire' | 'task_pressure' | 'task_formula'
  | 'success' | 'fail' | 'explosion' | 'timeout' | 'ten_seconds' | 'surge' | 'results' | 'perfect' | 'bomb_intro' | 'bomb_intro_early' | 'bomb_warning'
  | 'bomb_first_1' | 'bomb_first_2' | 'bomb_taunt_1' | 'bomb_taunt_2' | 'bomb_taunt_3'
  | 'bomb_defused_1' | 'bomb_defused_2' | 'bomb_blast_1' | 'bomb_blast_2' | 'bomb_timeout' | 'bomb_taunt' | 'bomb_defused' | 'bomb_blast';
/** files that may exist for each line (variants are picked at random) */
const FILES: Record<Line, string[]> = {intro: ['intro'], tutorial_wire: ['tutorial_wire'], tutorial_pressure: ['tutorial_pressure'], tutorial_formula: ['tutorial_formula'], tutorial_lock: ['tutorial_lock'],
  task_wire: ['task_wire'], task_pressure: ['task_pressure'], task_formula: ['task_formula'], task_lock: ['task_lock'], success: ['success_1', 'success_2'], fail: ['fail_1', 'fail_2'],
  explosion: ['explosion'], timeout: ['timeout'], ten_seconds: ['ten_seconds'], surge: ['surge'], results: [], perfect: ['perfect'],
  /* THE HOST'S SUITCASE (recorded in the approved host voice, 2026-11-07) */ bomb_intro: ['bomb_intro'], bomb_intro_early: ['bomb_intro_early'], bomb_warning: ['bomb_warning'],
  bomb_first_1: ['bomb_first_1'], bomb_first_2: ['bomb_first_2'], bomb_taunt_1: ['bomb_taunt_1'], bomb_taunt_2: ['bomb_taunt_2'], bomb_taunt_3: ['bomb_taunt_3'],
  bomb_defused_1: ['bomb_defused_1'], bomb_defused_2: ['bomb_defused_2'], bomb_blast_1: ['bomb_blast_1'], bomb_blast_2: ['bomb_blast_2'], bomb_timeout: ['bomb_timeout'],
  /* variants: one is picked at random, never the same twice in a row */ bomb_taunt: ["bomb_taunt_1", "bomb_taunt_2", "bomb_taunt_3", "bomb_taunt_4", "bomb_taunt_5", "bomb_taunt_6", "bomb_taunt_8"], bomb_defused: ["bomb_defused_1", "bomb_defused_2", "bomb_defused_3", "bomb_defused_4", "bomb_defused_6"], bomb_blast: ["bomb_blast_1", "bomb_blast_2", "bomb_blast_3", "bomb_blast_4", "bomb_blast_6"]};
for (const [k, v] of Object.entries({"success": ["success_1", "success_2", "success_3", "success_4", "success_5", "success_6"], "fail": ["fail_1", "fail_2", "fail_4", "fail_7", "fail_9", "fail_10"], "explosion": ["explosion", "explosion_2", "explosion_4", "explosion_5"], "timeout": ["timeout", "timeout_2", "timeout_3", "timeout_4", "timeout_5"], "ten_seconds": ["ten_seconds", "ten_seconds_2", "ten_seconds_3", "ten_seconds_4", "ten_seconds_5"], "surge": ["surge", "surge_2", "surge_3", "surge_4"], "perfect": ["perfect", "perfect_2", "perfect_3", "perfect_4"], "task_wire": ["task_wire", "task_wire_2", "task_wire_4"], "task_pressure": ["task_pressure", "task_pressure_4"], "task_formula": ["task_formula", "task_formula_2", "task_formula_3"], "task_lock": ["task_lock", "task_lock_3"], "bomb_warning": ["bomb_warning", "bomb_warning_2", "bomb_warning_4"], "bomb_timeout": ["bomb_timeout", "bomb_timeout_2", "bomb_timeout_4"]})) FILES[k as Line] = v;

export class Voice {
  constructor(private base = 'voice/') {}
  /** in a room the host screen speaks the shared lines (intro, briefings, warnings, bomb, finale); the phone keeps the player's own */
  hostSpeaks = false;
  /** the file of the line spoken last (its text: VOICE_TEXT) */ spoken = ''; private lastFile = new Map<Line, string>();
  enabled = LANG === 'ru'; private ctx: AudioContext | null = null; private out: GainNode | null = null; private bufs = new Map<string, AudioBuffer | null>();
  private cur: AudioBufferSourceNode | null = null; private curPri = 0; private lastAt = new Map<Line, number>();
  /** attach to the page's (already unlocked) audio context; starts loading every line */
  attach(ctx: AudioContext | null) {
    if (!ctx || this.ctx || !this.enabled) return; this.ctx = ctx; this.out = ctx.createGain(); this.out.gain.value = 1.15; this.out.connect(ctx.destination);
    for (const f of new Set(Object.values(FILES).flat())) fetch(`${this.base}${f}.m4a`).then(r => r.ok ? r.arrayBuffer() : Promise.reject()).then(a => ctx.decodeAudioData(a)).then(b => this.bufs.set(f, b)).catch(() => this.bufs.set(f, null));
  }
  /** speak a line. priority: a higher one interrupts a lower one; equal or lower waits its turn (dropped if busy) */
  say(line: Line, priority = 1, cooldownMs = 4000): boolean {
    if (this.hostSpeaks && /^(intro|tutorial_|task_|ten_seconds|bomb_intro|bomb_warning|perfect|results)/.test(line)) return false;
    const ctx = this.ctx; if (!this.enabled) return false; if (!ctx || !this.out || ctx.state !== 'running') { if (priority >= 3) this.queued = {line, priority, at: performance.now()}; return false; }
    const now = performance.now(); if (now - (this.lastAt.get(line) ?? -1e9) < cooldownMs) return false;
    const ready = FILES[line].filter(f => this.bufs.get(f)); if (!ready.length) return false; const fresh = ready.length > 1 ? ready.filter(f => f !== this.lastFile.get(line)) : ready;
    if (this.cur) return false; // never cut the host off mid-sentence: the next line waits its turn
    const file = fresh[Math.floor(Math.random() * fresh.length)]; this.lastFile.set(line, file); this.spoken = file;
    const s = ctx.createBufferSource(); s.buffer = this.bufs.get(file)!; s.connect(this.out); s.start(); this.lastAt.set(line, now);
    this.cur = s; this.curPri = priority; s.onended = () => { if (this.cur === s) this.cur = null; }; return true;
  }
  /** a line asked for before the browser allowed sound (no tap yet): spoken right after the first tap, once its file is loaded */
  private queued: {line: Line; priority: number; at: number} | null = null;
  flush(tries = 12) { const q = this.queued; if (!q) return; if (performance.now() - q.at > 45000) { this.queued = null; return; }
    if (this.ctx?.state === 'running' && FILES[q.line].some(f => this.bufs.get(f))) { this.queued = null; this.say(q.line, q.priority, 0); return; }
    if (tries > 0) setTimeout(() => this.flush(tries - 1), 400); }
  get speaking() { return !!this.cur; }
}

let sw: HTMLLabelElement | null = null;
function iosTap() { if (!sw) { const i = document.createElement('input'); i.type = 'checkbox'; i.setAttribute('switch', ''); i.id = 'hx-switch'; const l = document.createElement('label'); l.htmlFor = 'hx-switch';
  for (const e of [i, l]) { e.style.cssText = 'position:fixed;left:-99px;top:0;width:1px;height:1px;opacity:0;pointer-events:none'; document.body.append(e); } sw = l; } sw.click(); }
/** short buzz patterns: tap (UI), good, bad (wrong / fall), blast (explosion) */
export function haptic(kind: 'tap' | 'good' | 'bad' | 'blast') {
  const pat = kind === 'tap' ? 12 : kind === 'good' ? [25, 60, 25] : kind === 'bad' ? [90, 50, 220] : [320, 70, 140, 50, 380];
  try { if (navigator.vibrate) { navigator.vibrate(pat); return; } } catch {}
  try { const n = kind === 'tap' ? 1 : kind === 'good' ? 2 : 3; for (let k = 0; k < n; k++) setTimeout(iosTap, k * 90); } catch {}
}
