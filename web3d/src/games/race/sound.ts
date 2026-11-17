// Race audio: procedural Web Audio (no files, tiny, phone friendly) + a looping music bed.
// Every one-shot is positional by distance to the local runner, with a global voice cap.
export class RaceSound {
  private ctx: AudioContext | null = null; private master!: GainNode; private sfx!: GainNode; private musicGain!: GainNode;
  private noise!: AudioBuffer; private voices = 0; private music?: HTMLAudioElement; private amb?: {src: AudioBufferSourceNode; g: GainNode; f: BiquadFilterNode};
  private windG?: GainNode; private last = new Map<string, number>();
  muted = false;

  /** Must be called from a user gesture (tap / key). */
  unlock() {
    if (this.ctx) {if (this.ctx.state === 'suspended') this.ctx.resume(); return;}
    const AC = (window.AudioContext || (window as any).webkitAudioContext); if (!AC) return;
    const c = this.ctx = new AC(); this.master = c.createGain(); this.master.gain.value = .9; this.master.connect(c.destination);
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(this.master);
    this.sfx = c.createGain(); this.sfx.gain.value = .8; this.sfx.connect(comp); this.musicGain = c.createGain(); this.musicGain.gain.value = .35; this.musicGain.connect(this.master);
    const len = c.sampleRate * 2, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; this.noise = b;
  }
  get ready() {return !!this.ctx && !this.muted;}

  /** Theme ambience: wind for cliffs, swamp drone for graveyard, room tone for house/crypt. */
  ambience(theme: string) {
    if (!this.ctx || this.amb) return; const c = this.ctx, src = c.createBufferSource(); src.buffer = this.noise; src.loop = true;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = theme === 'cliffs' ? 700 : theme === 'graveyard' ? 380 : 220; f.Q.value = .7;
    const g = c.createGain(); g.gain.value = theme === 'cliffs' ? .06 : .045; src.connect(f).connect(g).connect(this.sfx); src.start(); this.amb = {src, g, f};
    // wind layer driven by fans / gusts
    const ws = c.createBufferSource(); ws.buffer = this.noise; ws.loop = true; const wf = c.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 900; wf.Q.value = .6;
    this.windG = c.createGain(); this.windG.gain.value = 0; ws.connect(wf).connect(this.windG).connect(this.sfx); ws.start();
  }
  tickAmbience(t: number, wind: number) {
    if (!this.ctx || !this.amb) return; this.amb.f.frequency.value = 300 + 260 * (.5 + .5 * Math.sin(t * .23)) ;
    this.windG!.gain.setTargetAtTime(wind * .22, this.ctx.currentTime, .15);
  }
  playMusic(url: string) {
    if (this.music) return; const a = new Audio(url); a.loop = true; a.volume = .28; this.music = a; a.play().catch(() => {});
  }
  setMuted(m: boolean) {this.muted = m; if (this.master) this.master.gain.value = m ? 0 : .9; if (this.music) this.music.muted = m;}

  // -------- one-shots --------
  private can(key: string, gap: number) {const now = performance.now(), l = this.last.get(key) ?? 0; if (now - l < gap || this.voices > 14) return false; this.last.set(key, now); return true;}
  private env(g: GainNode, a: number, peak: number, d: number) {const t = this.ctx!.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d);}
  private tone(freq: number, type: OscillatorType, dur: number, vol: number, slide = 0, delay = 0) {
    const c = this.ctx!, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(freq, c.currentTime + delay);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), c.currentTime + delay + dur);
    g.gain.setValueAtTime(0, c.currentTime + delay); g.gain.linearRampToValueAtTime(vol, c.currentTime + delay + .008); g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + delay + dur);
    o.connect(g).connect(this.sfx); o.start(c.currentTime + delay); o.stop(c.currentTime + delay + dur + .05); this.voices++; o.onended = () => this.voices--;
  }
  private burst(dur: number, vol: number, type: BiquadFilterType, f0: number, f1 = f0, q = 1, delay = 0) {
    const c = this.ctx!, s = c.createBufferSource(); s.buffer = this.noise; const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
    const t = c.currentTime + delay; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f).connect(g).connect(this.sfx); s.start(t, Math.random()); s.stop(t + dur + .05); this.voices++; s.onended = () => this.voices--;
  }
  private att(dist: number) {return Math.max(0, 1 - dist / 28) ** 1.5;}

  jump() {if (!this.ready || !this.can('jump', 90)) return; this.tone(260, 'triangle', .16, .16, 2.1); this.burst(.12, .08, 'highpass', 2500, 4000);}
  land(power: number) {if (!this.ready || !this.can('land', 80)) return; const v = Math.min(1, .3 + power * .7); this.burst(.18, .35 * v, 'lowpass', 500, 120); this.tone(90, 'sine', .14, .25 * v, .6);}
  step(surface: string) {if (!this.ready || !this.can('step', 140)) return; const hi = surface === 'plank' || surface === 'floor' || surface === 'dark' ? 1400 : surface === 'grass' || surface === 'mud' ? 700 : 1800; this.burst(.05, .05, 'bandpass', hi, hi * .7, 2);}
  hit(dist: number) {const a = this.att(dist); if (!this.ready || a < .05 || !this.can('hit', 120)) return; this.burst(.3, .55 * a, 'lowpass', 900, 90); this.tone(70, 'sine', .3, .45 * a, .5); this.tone(520, 'square', .06, .05 * a, .5);}
  thud(dist: number, big = 1) {const a = this.att(dist); if (!this.ready || a < .05 || !this.can('thud' + Math.round(dist), 60)) return; this.burst(.45 * big, .6 * a, 'lowpass', 300, 40); this.tone(48, 'sine', .5, .55 * a, .55);}
  roll(dist: number) {const a = this.att(dist); if (!this.ready || a < .05 || !this.can('roll', 220)) return; this.burst(.35, .18 * a, 'lowpass', 220, 120, 3);}
  whoosh(dist: number) {const a = this.att(dist); if (!this.ready || a < .08 || !this.can('whoosh', 260)) return; this.burst(.32, .2 * a, 'bandpass', 500, 1500, 1.5);}
  fire(dist: number) {const a = this.att(dist); if (!this.ready || a < .05 || !this.can('fire', 200)) return; this.burst(.6, .28 * a, 'lowpass', 1800, 300, .8); this.burst(.4, .12 * a, 'highpass', 3000, 6000);}
  metal(dist: number) {const a = this.att(dist); if (!this.ready || a < .05 || !this.can('metal', 150)) return; for (const f of [310, 467, 721]) this.tone(f, 'triangle', .5, .07 * a, .98); this.burst(.12, .3 * a, 'bandpass', 2500, 1200, 3);}
  alarm(dist: number) {const a = this.att(dist); if (!this.ready || a < .05 || !this.can('alarm', 420)) return; this.tone(880, 'square', .1, .06 * a); this.tone(660, 'square', .1, .06 * a, 1, .14);}
  chain(dist: number) {const a = this.att(dist); if (!this.ready || a < .05 || !this.can('chain', 200)) return; for (let i = 0; i < 6; i++) this.burst(.04, .12 * a, 'bandpass', 3500 + Math.random() * 2000, 3000, 4, i * .035);}
  spring() {if (!this.ready || !this.can('spring', 150)) return; this.tone(180, 'sine', .35, .3, 3.2); this.tone(360, 'triangle', .2, .1, 2.5);}
  portal() {if (!this.ready || !this.can('portal', 300)) return; for (let i = 0; i < 5; i++) this.tone(400 + i * 180, 'sine', .25, .08, 1.6, i * .04); this.burst(.5, .15, 'bandpass', 600, 3000, 2);}
  crumble(dist: number) {const a = this.att(dist); if (!this.ready || a < .05 || !this.can('crumble', 120)) return; for (let i = 0; i < 4; i++) this.burst(.09, .2 * a, 'bandpass', 900 + Math.random() * 1500, 400, 2, i * .05);}
  splash() {if (!this.ready || !this.can('fall', 500)) return; this.burst(.9, .3, 'lowpass', 2000, 200); this.tone(500, 'sine', .7, .12, .25);}
  checkpoint() {if (!this.ready) return; [659, 784, 988, 1319].forEach((f, i) => this.tone(f, 'triangle', .35, .12, 1, i * .08));}
  countdown(go: boolean) {if (!this.ready) return; go ? [523, 659, 784].forEach((f, i) => this.tone(f, 'square', .45, .09, 1, i * .03)) : this.tone(440, 'square', .18, .09);}
  finish(win: boolean) {if (!this.ready) return; const n = win ? [523, 659, 784, 1047, 1319] : [392, 330, 262]; n.forEach((f, i) => this.tone(f, 'triangle', .6, .13, 1, i * .12)); if (win) this.burst(1.6, .1, 'highpass', 4000, 8000);}
}
