// Recorded paper, electrical-cabinet doors and pressure-release steam.
// Other effects retain their procedural fallback when no recording is available.
export const SAMPLE_URLS: Partial<Record<Voice, string>> = {pageTurn: 'audio/page_turn.wav', panelOpen: 'audio/door_open.wav', panelClose1: 'audio/door_close1.wav', panelClose2: 'audio/door_close2.wav', pressureVent: 'audio/steam.wav', cageDrop: 'audio/cage_drop.wav', panelSpark: 'audio/electrick_sparks.wav', mixtureDrain: 'audio/drain_failed_mixture.wav'};
export type Voice = 'cageDrop' | 'panelSpark' | 'mixtureDrain' | 'panelOpen' | 'panelClose1' | 'panelClose2' | 'pressureVent' | 'coverOpen' | 'coverClose' | 'pageTurn' | 'pickup' | 'drop' | 'impactMetal' | 'creak' | 'snip' | 'spark' | 'good' | 'bad' | 'doorOpen' | 'doorClose' | 'button' | 'locked' | 'screech' | 'slam' | 'clockTick' | 'blub' | 'valveClick' | 'valveTurn' | 'alarm' | 'holdTick' | 'pipeKnock' | 'grind' | 'relay' | 'lever' | 'whistle' | 'surge' | 'vent' | 'burst' | 'explosion' | 'pour' | 'splash' | 'stir' | 'pump' | 'boil' | 'gurgle' | 'labOk' | 'beepHi' | 'beepLo' | 'scanHum' | 'thermo' | 'ping';

export class BookAudio {
  ctx: AudioContext | null = null; out!: GainNode; private buffers = new Map<Voice, AudioBuffer>(); private noise!: AudioBuffer; enabled = true;
  private closeVariant = 0;
  private recorded = new Map<string, {source: AudioBufferSourceNode; gain: GainNode}>();
  // Fetch early so the first gesture can decode without waiting for a network request.
  private sampleData = Object.entries(SAMPLE_URLS).map(([voice, url]) =>
    fetch(url!).then(r => { if (!r.ok) throw new Error(url); return r.arrayBuffer(); })
      .then(data => ({voice: voice as Voice, data})).catch(() => null));
  panelDoor(open: boolean) {
    this.play(open ? 'panelOpen' : (++this.closeVariant % 2 ? 'panelClose1' : 'panelClose2'));
  }
  private recording(v: Voice, intensity: number) {
    const levels: Partial<Record<Voice, number>> = {panelOpen: .95, panelClose1: .74, panelClose2: .54, pressureVent: .62, cageDrop: .65, panelSpark: 1, mixtureDrain: .7};
    const level = levels[v], buffer = this.buffers.get(v), ctx = this.ctx;
    if (level === undefined || !buffer || !ctx) return false;
    const group = v.startsWith('panelClose') || v === 'panelOpen' ? 'panel' : v, t = ctx.currentTime;
    // Replace the previous action with a short crossfade; rapid input cannot pile up voices.
    const previous = this.recorded.get(group);
    if (previous) {
      previous.gain.gain.cancelAndHoldAtTime(t);
      previous.gain.gain.linearRampToValueAtTime(0, t + .035);
      previous.source.stop(t + .04);
    }
    const source = ctx.createBufferSource(), gain = ctx.createGain(); source.buffer = buffer;
    source.playbackRate.value = v.startsWith('panel') && v !== 'panelSpark' ? .99 + Math.random() * .02 : 1;
    const duration = buffer.duration / source.playbackRate.value;
    const volume = level * Math.max(0, Math.min(1, intensity));
    gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(volume, t + .004);
    gain.gain.setValueAtTime(volume, t + Math.max(.005, duration - .045));
    gain.gain.linearRampToValueAtTime(0, t + duration);
    source.connect(gain).connect(this.out); this.recorded.set(group, {source, gain});
    source.onended = () => { source.disconnect(); gain.disconnect(); if (this.recorded.get(group)?.source === source) this.recorded.delete(group); };
    source.start(); return true;
  }
  unlock() {
    // iOS: play through the ringer/silent switch (Web Audio is otherwise muted on silent, incl. Home Screen apps)
    try { const s = (navigator as any).audioSession; if (s && s.type !== 'playback') s.type = 'playback'; } catch {}
    if (this.ctx) { if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {}); this.tick(); return; }
    const C = (window as any).AudioContext || (window as any).webkitAudioContext; if (!C) return; this.ctx = new C(); const ctx = this.ctx!; this.tick();
    this.out = ctx.createGain(); this.out.gain.value = .9; const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; this.out.connect(comp).connect(ctx.destination);
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = this.noise.getChannelData(0); let b = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; b = .985 * b + .015 * w; d[i] = w * .6 + b * 4; }
    for (const pending of this.sampleData) pending.then(async entry => { if (entry) this.buffers.set(entry.voice, await ctx.decodeAudioData(entry.data)); }).catch(() => {});
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
    if (this.recording(v, intensity)) return;
    if (v === 'panelOpen') v = 'doorOpen';
    else if (v === 'panelClose1' || v === 'panelClose2') v = 'doorClose';
    else if (v === 'pressureVent') v = 'vent';
    else if (v === 'cageDrop') v = 'slam';
    else if (v === 'panelSpark') v = 'spark';
    else if (v === 'mixtureDrain') v = 'gurgle';
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
      case 'clockTick': this.rustle(t, .025, 3800, 4, .28, .001); this.mode(t, 2100, .05, .05); this.mode(t + .11, 1500, .04, .03); break; // escapement tick-tock
      case 'blub': { const o = this.ctx!.createOscillator(), g = this.ctx!.createGain(), f0 = 220 + Math.random() * 260; o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 2.4, t + .07); // a bubble popping in the chamber
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05 * intensity, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + .09); o.connect(g).connect(this.out); o.start(t); o.stop(t + .1); break; }
      // THE HOST'S SUITCASE instruments
      case 'beepHi': { const o = this.ctx!.createOscillator(), g = this.ctx!.createGain(); o.type = 'square'; o.frequency.value = 2350; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05 * intensity, t + .004); g.gain.setValueAtTime(.05 * intensity, t + .085); g.gain.linearRampToValueAtTime(0, t + .1); o.connect(g).connect(this.out); o.start(t); o.stop(t + .12); break; }
      case 'beepLo': { const o = this.ctx!.createOscillator(), g = this.ctx!.createGain(); o.type = 'square'; o.frequency.value = 520; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.045 * intensity, t + .006); g.gain.setValueAtTime(.045 * intensity, t + .2); g.gain.linearRampToValueAtTime(0, t + .24); o.connect(g).connect(this.out); o.start(t); o.stop(t + .26); break; }
      case 'scanHum': { const o = this.ctx!.createOscillator(), o2 = this.ctx!.createOscillator(), g = this.ctx!.createGain(); o.type = 'sawtooth'; o.frequency.value = 98; o2.type = 'sine'; o2.frequency.value = 1960 + Math.random() * 80;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.035 * intensity, t + .03); g.gain.linearRampToValueAtTime(0, t + .3); o.connect(g); o2.connect(g); g.connect(this.out); o.start(t); o2.start(t); o.stop(t + .32); o2.stop(t + .32); this.rustle(t, .25, 5200, 3, .06 * intensity, .02); break; }
      case 'thermo': for (let i = 0; i < 4; i++) this.rustle(t + i * .05 + Math.random() * .03, .03, 1800 + Math.random() * 1600, 1.6, .12 * intensity, .002); this.rustle(t, .3, 600, .7, .05 * intensity, .05); break;
      case 'ping': this.mode(t, 1760, .55, .09 * intensity); this.mode(t + .002, 2640, .4, .05 * intensity); this.mode(t + .004, 3520, .25, .03 * intensity); break;
      case 'holdTick': this.mode(t, 1400 + 300 * intensity, .09, .06); break; // stabilisation progress
      case 'grind': { for (let i = 0; i < 9; i++) this.rustle(t + i * .035 + Math.random() * .02, .06, 700 + Math.random() * 900, 6, .35, .004); const f = this.rustle(t, .45, 260, 14, .3, .02); f.frequency.linearRampToValueAtTime(180, t + .4); this.mode(t + .3, 140, .2, .12); break; } // jammed stem: metal on metal
      case 'relay': for (let i = 0; i < 6; i++) { this.rustle(t + i * .21 + Math.random() * .05, .02, 3600, 2.5, .45, .001); this.mode(t + i * .21, 1900 + Math.random() * 400, .03, .05); } break; // diagnostic relay chatter
      case 'lever': this.rustle(t, .08, 500, 3, .7, .002); this.mode(t + .02, 210, .25, .22); this.mode(t + .02, 640, .12, .08); this.rustle(t + .06, .05, 2600, 2, .3, .001); break; // heavy lever thrown home
      case 'whistle': { for (const [f0, g0] of [[1860, .05], [2790, .025]] as const) { const o = this.ctx!.createOscillator(), g = this.ctx!.createGain(); o.frequency.setValueAtTime(f0 * .9, t); o.frequency.linearRampToValueAtTime(f0, t + .25); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(g0, t + .15); g.gain.setValueAtTime(g0, t + 1.6); g.gain.linearRampToValueAtTime(0, t + 1.9); o.connect(g).connect(this.out); o.start(t); o.stop(t + 2); } this.rustle(t, 1.9, 3000, 3, .12, .1); break; } // steam whistle
      case 'surge': this.rustle(t, .6, 120, .8, 1.1, .01); this.rustle(t, .5, 1600, .6, .5, .01); this.mode(t, 70, .5, .25); break; // surge thump through the pipes
      case 'vent': this.rustle(t, .45 * intensity + .15, 2600, .6, .45 * intensity, .01); break; // release puff
      case 'explosion': { const k = 1.6; this.rustle(t, 1.2, 70, .7, 2.2 * k, .002); this.rustle(t, .6, 260, .8, 1.2 * k, .002); this.rustle(t, .25, 3200, .5, 1.1, .001); this.mode(t, 48, .9, .5); this.mode(t, 110, .5, .3); // boom
        for (let i = 0; i < 14; i++) this.rustle(t + .05 + Math.random() * .7, .05, 2500 + Math.random() * 4000, 2, .4 * Math.random() + .15, .001); // glass and shrapnel
        this.rustle(t + .1, 2.6, 2000, .45, .7, .05); break; } // steam roar
      // THE UNSTABLE FORMULA (synthesised)
      case 'pour': { const f = this.rustle(t, .5, 900, 3, .22, .02); f.frequency.linearRampToValueAtTime(1500, t + .45); for (let i = 0; i < 4; i++) this.mode(t + .05 + i * .1, 420 + Math.random() * 260, .07, .05); break; } // valve open + liquid in the tube
      case 'splash': for (let i = 0; i < 5; i++) { this.mode(t + i * .05 + Math.random() * .03, 600 + Math.random() * 900, .06, .07); } this.rustle(t, .25, 2200, 1, .18, .005); break; // drops into the chamber
      case 'stir': { const o = this.ctx!.createOscillator(), g = this.ctx!.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(70, t); o.frequency.linearRampToValueAtTime(95, t + .4); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.035, t + .2); g.gain.setValueAtTime(.035, t + 2.2); g.gain.linearRampToValueAtTime(0, t + 2.8); const lp = this.ctx!.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600; o.connect(lp).connect(g).connect(this.out); o.start(t); o.stop(t + 2.9); this.rustle(t, 2.6, 300, 2, .05, .2); break; } // stirrer motor
      case 'pump': for (let i = 0; i < 6; i++) { this.rustle(t + i * .3, .12, 180, 1.4, .6, .003); this.mode(t + i * .3, 110, .15, .14); this.rustle(t + i * .3 + .14, .18, 1800, .8, .15, .01); } break; // piston strokes
      case 'boil': for (let i = 0; i < 26; i++) this.mode(t + Math.random() * 1.2, 180 + Math.random() * 500, .05 + Math.random() * .06, .09); this.rustle(t, 1.3, 400, .8, .3, .05); break; // violent bubbling
      case 'gurgle': for (let i = 0; i < 12; i++) { const f = this.rustle(t + i * .1 + Math.random() * .04, .12, 300 + Math.random() * 200, 6, .25, .01); f.frequency.linearRampToValueAtTime(140, t + i * .1 + .12); } break; // drain
      case 'labOk': for (const [f, d] of [[523, 1.4], [784, 1.2], [1046, 1]]) this.mode(t + .03, f, d, .07); this.rustle(t, .8, 2800, .5, .25, .05); break; // cooling restored
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
