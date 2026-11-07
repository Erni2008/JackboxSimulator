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
  | 'bomb_defused_1' | 'bomb_defused_2' | 'bomb_blast_1' | 'bomb_blast_2' | 'bomb_timeout';
/** files that may exist for each line (variants are picked at random) */
const FILES: Record<Line, string[]> = {intro: ['intro'], tutorial_wire: ['tutorial_wire'], tutorial_pressure: ['tutorial_pressure'], tutorial_formula: ['tutorial_formula'], tutorial_lock: ['tutorial_lock'],
  task_wire: ['task_wire'], task_pressure: ['task_pressure'], task_formula: ['task_formula'], task_lock: ['task_lock'], success: ['success_1', 'success_2'], fail: ['fail_1', 'fail_2'],
  explosion: ['explosion'], timeout: ['timeout'], ten_seconds: ['ten_seconds'], surge: ['surge'], results: [], perfect: ['perfect'],
  /* THE HOST'S SUITCASE (recorded in the approved host voice, 2026-11-07) */ bomb_intro: ['bomb_intro'], bomb_intro_early: ['bomb_intro_early'], bomb_warning: ['bomb_warning'],
  bomb_first_1: ['bomb_first_1'], bomb_first_2: ['bomb_first_2'], bomb_taunt_1: ['bomb_taunt_1'], bomb_taunt_2: ['bomb_taunt_2'], bomb_taunt_3: ['bomb_taunt_3'],
  bomb_defused_1: ['bomb_defused_1'], bomb_defused_2: ['bomb_defused_2'], bomb_blast_1: ['bomb_blast_1'], bomb_blast_2: ['bomb_blast_2'], bomb_timeout: ['bomb_timeout']};

export class Voice {
  constructor(private base = 'voice/') {}
  enabled = LANG === 'ru'; private ctx: AudioContext | null = null; private out: GainNode | null = null; private bufs = new Map<string, AudioBuffer | null>();
  private cur: AudioBufferSourceNode | null = null; private curPri = 0; private lastAt = new Map<Line, number>();
  /** attach to the page's (already unlocked) audio context; starts loading every line */
  attach(ctx: AudioContext | null) {
    if (!ctx || this.ctx || !this.enabled) return; this.ctx = ctx; this.out = ctx.createGain(); this.out.gain.value = 1.15; this.out.connect(ctx.destination);
    for (const f of new Set(Object.values(FILES).flat())) fetch(`${this.base}${f}.m4a`).then(r => r.ok ? r.arrayBuffer() : Promise.reject()).then(a => ctx.decodeAudioData(a)).then(b => this.bufs.set(f, b)).catch(() => this.bufs.set(f, null));
  }
  /** speak a line. priority: a higher one interrupts a lower one; equal or lower waits its turn (dropped if busy) */
  say(line: Line, priority = 1, cooldownMs = 4000): boolean {
    const ctx = this.ctx; if (!this.enabled || !ctx || !this.out || ctx.state !== 'running') return false;
    const now = performance.now(); if (now - (this.lastAt.get(line) ?? -1e9) < cooldownMs) return false;
    const opts = FILES[line].map(f => this.bufs.get(f)).filter((b): b is AudioBuffer => !!b); if (!opts.length) return false;
    if (this.cur) return false; // never cut the host off mid-sentence: the next line waits its turn
    const s = ctx.createBufferSource(); s.buffer = opts[Math.floor(Math.random() * opts.length)]; s.connect(this.out); s.start(); this.lastAt.set(line, now);
    this.cur = s; this.curPri = priority; s.onended = () => { if (this.cur === s) this.cur = null; }; return true;
  }
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
