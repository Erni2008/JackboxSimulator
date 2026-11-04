// Book audio. The page turn uses the project's recorded paper sample
// (assets/sounds/impostor/page_turn.wav). The project has no recorded leather,
// pickup or book-impact assets, so those are synthesised at run time from
// filtered noise and modal resonators — no placeholder files are shipped.
// Drop real recordings into SAMPLE_URLS to override any synthesised voice.
export const SAMPLE_URLS: Partial<Record<Voice, string>> = {pageTurn: 'audio/page_turn.wav'};
export type Voice = 'coverOpen' | 'coverClose' | 'pageTurn' | 'pickup' | 'drop' | 'impactMetal' | 'creak' | 'snip' | 'spark' | 'good' | 'bad' | 'doorOpen' | 'doorClose' | 'button' | 'locked' | 'screech' | 'slam' | 'valveClick' | 'valveTurn' | 'alarm' | 'holdTick' | 'pipeKnock' | 'grind' | 'relay' | 'lever' | 'whistle' | 'surge' | 'vent' | 'burst';

export class BookAudio {
  ctx: AudioContext | null = null; out!: GainNode; private buffers = new Map<Voice, AudioBuffer>(); private noise!: AudioBuffer; enabled = true;
  unlock() {
    // iOS: play through the ringer/silent switch (Web Audio is otherwise muted on silent, incl. Home Screen apps)
    try { const s = (navigator as any).audioSession; if (s && s.type !== 'playback') s.type = 'playback'; } catch {}
    if (this.ctx) { if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {}); this.tick(); return; }
    const C = (window as any).AudioContext || (window as any).webkitAudioContext; if (!C) return; this.ctx = new C(); const ctx = this.ctx!; this.tick();
    this.out = ctx.createGain(); this.out.gain.value = .9; const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; this.out.connect(comp).connect(ctx.destination);
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = this.noise.getChannelData(0); let b = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; b = .985 * b + .015 * w; d[i] = w * .6 + b * 4; }
    for (const [k, url] of Object.entries(SAMPLE_URLS)) fetch(url!).then(r => r.arrayBuffer()).then(a => ctx.decodeAudioData(a)).then(buf => this.buffers.set(k as Voice, buf)).catch(() => {});
  }
  /** a silent one-sample buffer started inside the gesture: the reliable WebKit unlock */
  private tick() { const ctx = this.ctx; if (!ctx) return; try { const s = ctx.createBufferSource(); s.buffer = ctx.createBuffer(1, 1, 22050); s.connect(ctx.destination); s.start(0); } catch {} }
  private sample(v: Voice, gain: number, rate = 1) { const b = this.buffers.get(v); if (!b || !this.ctx) return false; const s = this.ctx.createBufferSource(); s.buffer = b; s.playbackRate.value = rate; const g = this.ctx.createGain(); g.gain.value = gain; s.connect(g).connect(this.out); s.start(); return true; }
  /** shaped band-passed noise burst */
  private rustle(at: number, dur: number, freq: number, q: number, gain: number, attack = .01) {
    const ctx = this.ctx!, s = ctx.createBufferSource(); s.buffer = this.noise; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; const g = ctx.createGain();
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gain, at + attack); g.gain.exponentialRampToValueAtTime(.0001, at + dur); s.connect(f).connect(g).connect(this.out); s.start(at, Math.random()); s.stop(at + dur + .05); return f;
  }
  private mode(at: number, freq: number, decay: number, gain: number) { const ctx = this.ctx!, o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = freq; g.gain.setValueAtTime(gain, at); g.gain.exponentialRampToValueAtTime(.0001, at + decay); o.connect(g).connect(this.out); o.start(at); o.stop(at + decay + .02); }
  /** electrical hum for a diagnostic test: mains buzz (overload), weak dying hum (power failure) */
  hum(kind: 'overload' | 'short' | 'power', dur = 2) {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return; const ctx = this.ctx, t = ctx.currentTime, g = ctx.createGain(), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = kind === 'overload' ? 2200 : 500;
    const peak = kind === 'overload' ? .16 : kind === 'short' ? .07 : .06; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + .12); if (kind === 'power') g.gain.exponentialRampToValueAtTime(.002, t + dur); else g.gain.setValueAtTime(peak, t + dur - .2); g.gain.linearRampToValueAtTime(0, t + dur);
    for (const [mul, type, amp] of [[1, 'sawtooth', 1], [2, 'square', .35], [3, 'sine', .3]] as const) { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = type; o.frequency.value = 50 * mul; if (kind === 'power') o.frequency.linearRampToValueAtTime(50 * mul * .7, t + dur); og.gain.value = amp; o.connect(og).connect(f); o.start(t); o.stop(t + dur + .05); }
    f.connect(g).connect(this.out);
  }
  play(v: Voice, intensity = 1) {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return; const t = this.ctx.currentTime;
    if (this.buffers.has(v) && this.sample(v, .8 * intensity, .92 + Math.random() * .16)) return;
    switch (v) {
      case 'pageTurn': this.rustle(t, .35, 2600, .7, .35 * intensity, .04); this.rustle(t + .18, .22, 4200, 1.2, .2 * intensity); break;
      case 'coverOpen': { // leather flex: low creak sweep + board tick
        const f = this.rustle(t, .7, 380, 6, .5 * intensity, .12); f.frequency.linearRampToValueAtTime(240, t + .6); this.rustle(t + .03, .12, 1400, 2, .2); this.rustle(t + .55, .25, 900, 1, .25 * intensity); break; }
      case 'coverClose': // air pushed out + board slap on the text block
        this.rustle(t, .25, 700, .8, .25, .08); this.rustle(t + .2, .16, 260, 1.4, .9 * intensity, .004); this.mode(t + .2, 118, .12, .25 * intensity); break;
      case 'creak': { const f = this.rustle(t, .28, 300 + Math.random() * 120, 9, .18 * Math.min(1, intensity), .06); f.frequency.linearRampToValueAtTime(220, t + .25); break; }
      case 'pickup': this.rustle(t, .18, 900, 1.1, .3, .03); this.rustle(t + .05, .2, 320, 3, .22, .05); break;
      case 'drop': this.rustle(t, .2, 1800, .8, .12, .05); break;
      case 'impactMetal': { // heavy book on riveted steel plate: thud + plate modes
        const k = Math.min(1, intensity); this.rustle(t, .14, 180, 1.2, 1.1 * k, .002); this.rustle(t, .05, 2400, .6, .3 * k, .001);
        for (const [f, d, g] of [[186, .55, .16], [412, .4, .1], [733, .3, .07], [1290, .22, .04], [2210, .15, .02]]) this.mode(t + .002, f * (.97 + Math.random() * .06), d * (.6 + k * .6), g * k);
        break; }
      case 'snip': this.rustle(t, .05, 5200, .9, .9, .001); this.mode(t, 2900, .09, .12); this.mode(t, 4400, .06, .07); this.rustle(t + .01, .08, 900, 2, .3, .002); break;
      case 'spark': for (let i = 0; i < 7; i++) this.rustle(t + i * .028 + Math.random() * .02, .04, 3000 + Math.random() * 4000, .8, .5 * Math.random() + .2, .001); break;
      case 'good': for (const [f, d] of [[660, 1.2], [990, 1.0], [1320, .8]]) this.mode(t + .02, f, d, .08); this.rustle(t, .25, 300, 1, .4, .002); break;
      case 'bad': { const o = this.ctx!.createOscillator(), g = this.ctx!.createGain(); o.type = 'sawtooth'; o.frequency.value = 62; g.gain.setValueAtTime(.18, t); g.gain.exponentialRampToValueAtTime(.001, t + .9); o.connect(g).connect(this.out); o.start(t); o.stop(t + .95); this.rustle(t, .5, 2500, .7, .5, .002); break; }
      case 'doorOpen': { const f = this.rustle(t, .55, 700, 7, .35, .05); f.frequency.linearRampToValueAtTime(420, t + .5); this.mode(t, 240, .3, .1); break; }
      case 'button': this.rustle(t, .03, 2400, 1.5, .7, .001); this.mode(t, 1650, .06, .1); this.mode(t + .09, 900, .08, .08); this.rustle(t + .09, .04, 1200, 2, .4, .001); break;
      case 'locked': this.rustle(t, .05, 800, 3, .6, .001); this.mode(t, 520, .12, .1); this.rustle(t + .07, .04, 700, 3, .4, .001); break;
      case 'screech': { // brake shoes and cables giving way: a falling metallic squeal + chain rattle
        const f = this.rustle(t, 1.1, 2600, 18, .45, .03); f.frequency.exponentialRampToValueAtTime(700, t + 1); const f2 = this.rustle(t + .05, .9, 3900, 22, .2, .03); f2.frequency.exponentialRampToValueAtTime(1100, t + .9);
        for (let i = 0; i < 10; i++) this.rustle(t + i * .07 + Math.random() * .03, .05, 1800 + Math.random() * 1500, 3, .25, .002); break; }
      case 'slam': { const k = Math.min(1.5, intensity); this.rustle(t, .5, 90, .9, 1.4 * k, .002); this.rustle(t, .25, 400, 1, .7 * k, .002);
        for (const [fq, d, g] of [[62, 1.2, .3], [131, .9, .2], [277, .7, .12], [521, .5, .08], [1013, .3, .05]]) this.mode(t + .003, fq, d, g * k); break; }
      case 'doorClose': this.rustle(t, .12, 300, 1.2, .9, .002); this.mode(t, 180, .45, .2); this.mode(t, 410, .3, .1); break;
      // PRESSURE CONTROL (synthesised like every other voice here)
      case 'valveClick': this.rustle(t, .025, 3200, 2, .55, .001); this.mode(t, 1180, .05, .09); this.mode(t + .004, 2350, .03, .05); break; // detent pawl dropping into a notch
      case 'valveTurn': { const f = this.rustle(t, .22, 520 + Math.random() * 200, 10, .12 * Math.min(1, intensity), .03); f.frequency.linearRampToValueAtTime(380, t + .2); break; } // stem packing creak
      case 'alarm': for (let i = 0; i < 2; i++) { const o = this.ctx!.createOscillator(), g = this.ctx!.createGain(); o.type = 'square'; o.frequency.setValueAtTime(880, t + i * .32); o.frequency.setValueAtTime(660, t + i * .32 + .16); g.gain.setValueAtTime(0, t + i * .32); g.gain.linearRampToValueAtTime(.05, t + i * .32 + .01); g.gain.setValueAtTime(.05, t + i * .32 + .3); g.gain.linearRampToValueAtTime(0, t + i * .32 + .31); o.connect(g).connect(this.out); o.start(t + i * .32); o.stop(t + i * .32 + .33); } break;
      case 'holdTick': this.mode(t, 1400 + 300 * intensity, .09, .06); break; // stabilisation progress
      case 'grind': { for (let i = 0; i < 9; i++) this.rustle(t + i * .035 + Math.random() * .02, .06, 700 + Math.random() * 900, 6, .35, .004); const f = this.rustle(t, .45, 260, 14, .3, .02); f.frequency.linearRampToValueAtTime(180, t + .4); this.mode(t + .3, 140, .2, .12); break; } // jammed stem: metal on metal
      case 'relay': for (let i = 0; i < 6; i++) { this.rustle(t + i * .21 + Math.random() * .05, .02, 3600, 2.5, .45, .001); this.mode(t + i * .21, 1900 + Math.random() * 400, .03, .05); } break; // diagnostic relay chatter
      case 'lever': this.rustle(t, .08, 500, 3, .7, .002); this.mode(t + .02, 210, .25, .22); this.mode(t + .02, 640, .12, .08); this.rustle(t + .06, .05, 2600, 2, .3, .001); break; // heavy lever thrown home
      case 'whistle': { for (const [f0, g0] of [[1860, .05], [2790, .025]] as const) { const o = this.ctx!.createOscillator(), g = this.ctx!.createGain(); o.frequency.setValueAtTime(f0 * .9, t); o.frequency.linearRampToValueAtTime(f0, t + .25); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(g0, t + .15); g.gain.setValueAtTime(g0, t + 1.6); g.gain.linearRampToValueAtTime(0, t + 1.9); o.connect(g).connect(this.out); o.start(t); o.stop(t + 2); } this.rustle(t, 1.9, 3000, 3, .12, .1); break; } // steam whistle
      case 'surge': this.rustle(t, .6, 120, .8, 1.1, .01); this.rustle(t, .5, 1600, .6, .5, .01); this.mode(t, 70, .5, .25); break; // surge thump through the pipes
      case 'vent': this.rustle(t, .45 * intensity + .15, 2600, .6, .45 * intensity, .01); break; // release puff
      case 'burst': this.rustle(t, 1.6, 2200, .5, .9, .01); this.rustle(t, 1.2, 600, .7, .6, .01); this.mode(t, 90, .4, .2); break; // emergency release / failure
      case 'pipeKnock': this.rustle(t, .12, 160, 1.5, .5 * Math.min(1, intensity), .002); this.mode(t, 95, .18, .12 * Math.min(1, intensity)); break; // pipe hammer under critical pressure
    }
  }
  private bed: {src: AudioBufferSourceNode; f: BiquadFilterNode; g: GainNode; rumble: GainNode} | null = null;
  /** continuous steam bed: `hiss` 0..1 (release jet), `rumble` 0..1 (pressure in the pipes); call every frame */
  steam(hiss: number, rumble: number) {
    const ctx = this.ctx; if (!ctx || ctx.state !== 'running') return; const on = this.enabled;
    if (!this.bed) { const src = ctx.createBufferSource(); src.buffer = this.noise; src.loop = true; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2400; const g = ctx.createGain(); g.gain.value = 0;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 140; const rumbleG = ctx.createGain(); rumbleG.gain.value = 0;
      src.connect(f).connect(g).connect(this.out); src.connect(lp).connect(rumbleG).connect(this.out); src.start(); this.bed = {src, f, g, rumble: rumbleG}; }
    const t = ctx.currentTime; this.bed.g.gain.setTargetAtTime(on ? .09 * hiss : 0, t, .12); this.bed.f.frequency.setTargetAtTime(1800 + 2200 * hiss, t, .2); this.bed.rumble.gain.setTargetAtTime(on ? .5 * rumble : 0, t, .3);
  }
}
