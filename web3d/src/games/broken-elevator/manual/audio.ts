// Book audio. The page turn uses the project's recorded paper sample
// (assets/sounds/impostor/page_turn.wav). The project has no recorded leather,
// pickup or book-impact assets, so those are synthesised at run time from
// filtered noise and modal resonators — no placeholder files are shipped.
// Drop real recordings into SAMPLE_URLS to override any synthesised voice.
export const SAMPLE_URLS: Partial<Record<Voice, string>> = {pageTurn: 'audio/page_turn.wav'};
export type Voice = 'coverOpen' | 'coverClose' | 'pageTurn' | 'pickup' | 'drop' | 'impactMetal' | 'creak';

export class BookAudio {
  ctx: AudioContext | null = null; out!: GainNode; private buffers = new Map<Voice, AudioBuffer>(); private noise!: AudioBuffer; enabled = true;
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const C = (window as any).AudioContext || (window as any).webkitAudioContext; if (!C) return; this.ctx = new C(); const ctx = this.ctx!;
    this.out = ctx.createGain(); this.out.gain.value = .9; const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; this.out.connect(comp).connect(ctx.destination);
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = this.noise.getChannelData(0); let b = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; b = .985 * b + .015 * w; d[i] = w * .6 + b * 4; }
    for (const [k, url] of Object.entries(SAMPLE_URLS)) fetch(url!).then(r => r.arrayBuffer()).then(a => ctx.decodeAudioData(a)).then(buf => this.buffers.set(k as Voice, buf)).catch(() => {});
  }
  private sample(v: Voice, gain: number, rate = 1) { const b = this.buffers.get(v); if (!b || !this.ctx) return false; const s = this.ctx.createBufferSource(); s.buffer = b; s.playbackRate.value = rate; const g = this.ctx.createGain(); g.gain.value = gain; s.connect(g).connect(this.out); s.start(); return true; }
  /** shaped band-passed noise burst */
  private rustle(at: number, dur: number, freq: number, q: number, gain: number, attack = .01) {
    const ctx = this.ctx!, s = ctx.createBufferSource(); s.buffer = this.noise; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; const g = ctx.createGain();
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gain, at + attack); g.gain.exponentialRampToValueAtTime(.0001, at + dur); s.connect(f).connect(g).connect(this.out); s.start(at, Math.random()); s.stop(at + dur + .05); return f;
  }
  private mode(at: number, freq: number, decay: number, gain: number) { const ctx = this.ctx!, o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = freq; g.gain.setValueAtTime(gain, at); g.gain.exponentialRampToValueAtTime(.0001, at + decay); o.connect(g).connect(this.out); o.start(at); o.stop(at + decay + .02); }
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
    }
  }
}
