"""SYSTEM BREACH host sound design, v2 — deterministic synthesis, no samples, no downloads.
Everything sits in D minor, uses soft timbres (FM bells, filtered noise, warm sub layers) with a shared room reverb,
and the frequent cues come in three variants so four minutes of play never repeat the exact same sound.
Run: python3 tools/audio/generate_system_breach_sfx.py  -> assets/system_breach/sfx/*.wav (48 kHz mono 16-bit)."""
from pathlib import Path
import wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

RATE = 48000
OUT = Path(__file__).resolve().parents[2] / 'assets/system_breach/sfx'
rng = np.random.default_rng(11)
D = {'D3': 146.83, 'F3': 174.61, 'A3': 220.0, 'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.0, 'A4': 440.0,
     'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'A5': 880.0, 'C6': 1046.5, 'D6': 1174.66, 'D2': 73.42, 'A2': 110.0}

def T(d): return np.arange(int(RATE * d)) / RATE
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='lowpass', fs=RATE, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='highpass', fs=RATE, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], btype='bandpass', fs=RATE, output='sos'), x)
def adsr(n, a=.004, d=.25, s=0.0, r=.0):
    x = np.arange(n) / RATE
    return np.where(x < a, x / a, s + (1 - s) * np.exp(-(x - a) / max(d, 1e-4)))
def bell(f, d, ratio=1.4, index=2.2, decay=.6, vol=1.):
    t = T(d); mod = np.sin(2 * np.pi * f * ratio * t) * index * np.exp(-t / (decay * .5))
    return np.sin(2 * np.pi * f * t + mod) * adsr(len(t), .002, decay) * vol
def soft(f, d, decay=.4, bright=.25):
    t = T(d); x = np.sin(2 * np.pi * f * t) + bright * np.sin(4 * np.pi * f * t) + bright * .4 * np.sin(6 * np.pi * f * t)
    return x * adsr(len(t), .006, decay)
def sub(f0, f1, d, decay=.3):
    t = T(d); f = np.geomspace(f0, f1, len(t)); return np.sin(2 * np.pi * np.cumsum(f) / RATE) * adsr(len(t), .003, decay)
def noise(d): return rng.standard_normal(int(RATE * d))
def swell(d, lo, hi, peak=.7):
    n = noise(d); e = np.sin(np.pi * np.clip(np.arange(len(n)) / len(n) / peak, 0, 1) * .5) ** 2 * np.exp(-np.maximum(0, np.arange(len(n)) / RATE - d * peak) * 6)
    return bp(n, lo, hi) * e
def at(buf, sig, sec, g=1.):
    i = int(sec * RATE); j = min(len(buf), i + len(sig)); buf[i:j] += sig[:j - i] * g; return buf
def buf(d): return np.zeros(int(RATE * d))
_IR = None
def room(x, wet=.22, size=1.1):
    global _IR
    if _IR is None:
        n = int(RATE * size); ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7.5, n)); ir = lp(hp(ir, 180), 6500); ir[:int(RATE * .012)] = 0; _IR = ir / np.sqrt(np.sum(ir ** 2))
    w = fftconvolve(x, _IR)[:len(x) + len(_IR)]; y = np.zeros(len(w)); y[:len(x)] = x
    return y + w * wet * (np.max(np.abs(x)) / (np.max(np.abs(w)) + 1e-9)) * 1.6
def master(x, peak):
    x = np.tanh(x / (np.max(np.abs(x)) + 1e-9) * 1.3) / np.tanh(1.3)     # gentle glue
    x = lp(x, 11000); x = hp(x, 40)
    return x / (np.max(np.abs(x)) + 1e-9) * peak
def save(name, x, peak=.6, wet=.22):
    x = master(room(x, wet), peak); x = np.trim_zeros(x, 'b') if np.any(x) else x
    fade = min(len(x), int(RATE * .02)); x[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(str(OUT / f'{name}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes((x * 32767).astype('<i2').tobytes())

OUT.mkdir(parents=True, exist_ok=True)
# three variants of every frequent cue, transposed within D minor
for v, k in enumerate([1.0, 1.122, .891], 1):
    sfx = '' if v == 1 else f'_{v}'
    # key: glassy three-note bell rise with an air tail
    b = buf(1.6)
    for i, n in enumerate(['D5', 'F5', 'A5']): at(b, bell(D[n] * k, 1.2, 3.5, 1.4, .7), i * .085, .55)
    at(b, swell(1.0, 4000, 11000, .2), .05, .08); save('key' + sfx, b, .5, .3)
    # hack start: low pulse + rising filtered tension (not an alarm)
    b = buf(1.4); at(b, sub(D['D2'] * k, D['D2'] * k, .9, .35), 0, .9); at(b, sub(D['D2'] * k, D['D2'] * k, .9, .35), .42, .7)
    s = swell(1.2, 600, 3500, .9); at(b, s, 0, .35); at(b, soft(D['A3'] * k, 1.2, .5, .1), .1, .12); save('hack_start' + sfx, b, .5, .18)
    # hack success: sub drop + bright FM hit + shimmer
    b = buf(1.8); at(b, sub(180 * k, 42, .9, .28), 0, 1.0); at(b, bell(D['D5'] * k, 1.0, 2.0, 3.0, .35), 0, .5); at(b, bell(D['A5'] * k, 1.2, 3.5, 1.2, .8), .06, .3)
    at(b, swell(.5, 2500, 9000, .05), 0, .25); save('hack_success' + sfx, b, .62, .25)
    # hack failed: muted downward thump, no buzzer
    b = buf(1.0); at(b, sub(120 * k, 55, .6, .18), 0, .9); at(b, lp(soft(D['F3'] * k, .6, .2, .5), 1200), .02, .4); at(b, soft(D['D3'] * k, .7, .25, .3), .14, .3)
    save('hack_fail' + sfx, b, .5, .15)
    # sabotage: glitch grains + detuned minor-second sting
    b = buf(1.6)
    for i in range(14): g = bp(noise(.02), 1500 + rng.random() * 5000, 9000) * adsr(int(RATE * .02), .001, .006); at(b, g, rng.random() * .3, .35)
    st = soft(D['D4'] * k, 1.2, .5, .5) + soft(D['D4'] * k * 1.06, 1.2, .5, .5); at(b, lp(st, 2500), .08, .35); at(b, sub(90 * k, 40, .8, .3), .06, .6)
    save('sabotage' + sfx, b, .55, .3)
    # system clean: warm rising major-ish resolution (D -> F -> A -> D)
    b = buf(1.8)
    for i, n in enumerate(['D4', 'F4', 'A4', 'D5']): at(b, bell(D[n] * k, 1.3, 1.0, 1.1, .9), i * .07, .4)
    save('clean' + sfx, b, .5, .35)
    # firewall: airy whoosh into a soft metallic seat
    b = buf(1.4); at(b, swell(.45, 500, 4000, .85), 0, .4); at(b, bell(D['D4'] * k, 1.0, 2.76, 1.8, .45), .38, .5); at(b, sub(110 * k, 70, .4, .15), .38, .4)
    save('firewall' + sfx, b, .5, .25)
    # multiplier: plucked rising fifths
    b = buf(1.2)
    for i, n in enumerate(['A4', 'D5', 'E5', 'A5']): at(b, bell(D[n] * k, .6, 1.0, .8, .25), i * .055, .4)
    save('multiplier' + sfx, b, .45, .25)
    # solve (rarely used by the host now): a single soft glint
    b = buf(.8); at(b, bell(D['A5'] * k, .7, 3.5, .8, .35), 0, .5); save('solve' + sfx, b, .3, .3)
# clock: wooden tick / tock pair
for name, f in (('tick', 1900), ('tock', 1400)):
    b = buf(.25); click = bp(noise(.03), f * .7, f * 1.6) * adsr(int(RATE * .03), .0005, .01); at(b, click, 0, 1); at(b, soft(f / 4, .12, .03, 0), 0, .25)
    save(name, b, .4, .12)
# ceremony
b = buf(2.4)                                                                  # timpani-style roll with crescendo
for i in range(int(2.2 / .055)):
    hit = lp(soft(D['D2'] * (1 + rng.random() * .01), .25, .12, .3) + bp(noise(.25), 80, 900) * .3 * adsr(int(RATE * .25), .001, .05), 1500)
    at(b, hit, i * .055 + rng.random() * .008, .15 + .85 * (i / 40) ** 1.6)
save('drumroll', b, .55, .25)
b = buf(2.4); at(b, sub(95, 38, 1.4, .45), 0, 1.0); at(b, swell(.6, 3000, 11000, .03), 0, .2)  # reveal: boom + choir-ish chord
for n in ['D4', 'F4', 'A4', 'D5']: at(b, soft(D[n], 2.0, .9, .35), .03, .18)
save('reveal', b, .62, .35)
b = buf(3.2)                                                                  # fanfare: brassy (filtered saw-ish) D major-ish triumph
def brass(f, d):
    t = T(d); x = sum(np.sin(2 * np.pi * f * h * t) / h for h in range(1, 9)); return lp(x, 2600) * adsr(len(t), .03, d * .8, .0)
for i, (ns, d0) in enumerate([(['A3', 'D4', 'F4'], .25), (['A3', 'D4', 'F4'], .25), (['D4', 'F4', 'A4', 'D5'], 2.2)]):
    for n in ns: at(b, brass(D[n], d0 + .3), i * .3, .25)
at(b, sub(73, 60, 1.6, .7), .6, .7); save('fanfare', b, .62, .35)
b = buf(4.0); n = noise(4.0)                                                   # thunder: crack + long rolling rumble
at(b, hp(n[:int(RATE * .3)], 1500) * adsr(int(RATE * .3), .0005, .05), 0, 1.0)
rumble = lp(n, 140, 4) * (np.exp(-T(4.0) / 1.2) * (1 + .5 * np.sin(2 * np.pi * 1.7 * T(4.0)))); b += rumble * 6
save('thunder', b, .8, .3)
b = buf(5.0)                                                                  # ghost: breathy choir pad, slow vibrato
for n in ['D4', 'F4', 'A4', 'C5']:
    t = T(5.0); f = D[n] * (1 + .005 * np.sin(2 * np.pi * (4.5 + D[n] / 500) * t)); x = np.sin(2 * np.pi * np.cumsum(f) / RATE)
    x += .25 * np.sin(2 * np.pi * np.cumsum(f * 2) / RATE); e = np.minimum(1, t / 1.5) * np.minimum(1, (5.0 - t) / 1.8); b += x * e * .25
b += bp(noise(5.0), 900, 3200) * .05 * np.minimum(1, T(5.0) / 1.5) * np.minimum(1, (5.0 - T(5.0)) / 1.8)
save('ghost', lp(b, 4500), .5, .45)
b = buf(2.6); at(b, sub(110, 36, 1.8, .7), 0, 1.0)                              # operation complete: deep minor resolve
for n in ['D3', 'F3', 'A3', 'D4']: at(b, soft(D[n], 2.4, 1.1, .3), .02, .2)
save('complete', b, .62, .35)
b = buf(.7); at(b, swell(.6, 700, 5000, .55), 0, 1); save('whoosh', b, .25, .2)
print('wrote', len(list(OUT.glob('*.wav'))), 'files')

# ---------- execution (last place) — heavier, cinematic, synced to ResultsCeremony ----------
BEATS = [.25, 1.05, 1.7, 2.2, 2.6, 2.9, 3.15]          # heartbeat times inside 'sentence'; the host pulses on the same beats
def heartbeat(v=1.):
    b = buf(.6); at(b, sub(70, 42, .25, .09), 0, v); at(b, sub(62, 40, .25, .08), .16, v * .7); return lp(b, 300)
b = buf(3.6); t = T(3.6)
drone = sum(np.sin(2 * np.pi * f * t + rng.random() * 6) for f in (D['D2'] / 2, D['D2'] / 2 * 1.007, D['D2'], D['D2'] * 1.498)) * .2
drone *= np.minimum(1, t / .8) * (1 + .3 * np.sin(2 * np.pi * .7 * t)); b += lp(drone + .3 * np.tanh(drone * 3), 420)
for i, bt in enumerate(BEATS): at(b, heartbeat(.6 + .4 * i / len(BEATS)), bt, 1.4)
b += bp(noise(3.6), 2000, 6000) * .02 * np.minimum(1, t / 3); save('sentence', b, .62, .25)
b = buf(1.3); t = T(1.3); f = np.geomspace(180, 2400, len(t))                     # charge: riser + tremolo + crackle
riser = (np.sin(2 * np.pi * np.cumsum(f) / RATE) + .4 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / RATE)) * (t / 1.3) ** 2 * (1 + .5 * np.sin(2 * np.pi * (6 + 30 * t) * t))
b += lp(riser, 5000) * .4; sw = swell(1.25, 1500, 9000, .98); at(b, sw, 0, .5)
for i in range(60):
    p = (i / 60) ** .5 * 1.2; at(b, hp(noise(.008), 3000) * adsr(int(RATE * .008), .0003, .002), p, .25 + .5 * p)
save('charge', b, .55, .2)
b = buf(5.0); n = noise(5.0)                                                       # strike: zap + crack + boom + thunder tail
zap = hp(n[:int(RATE * .45)], 1200) * (np.sin(2 * np.pi * 60 * T(.45)) > .2) * np.exp(-T(.45) / .18)
buzz = np.tanh(4 * np.sin(2 * np.pi * 110 * T(.45))) * np.exp(-T(.45) / .2) * .5
at(b, zap + buzz, 0, 1.0); at(b, hp(n[:int(RATE * .2)], 2500) * adsr(int(RATE * .2), .0003, .04), 0, 1.4)
at(b, sub(160, 30, 1.6, .55), 0, 1.6); rumble = lp(noise(4.6), 150, 4) * np.exp(-T(4.6) / 1.4) * (1 + .6 * np.sin(2 * np.pi * 1.3 * T(4.6))); at(b, rumble, .12, 7)
save('strike', b, .9, .28)
b = buf(2.4)                                                                        # shatter: digital crumble + glass grains
for i in range(70):
    at_ = (i / 70) ** 1.6 * 1.1 + rng.random() * .05; fq = 2500 + rng.random() * 6000
    g = bell(fq, .25, 2.7 + rng.random(), 1.5, .08) if i % 3 else bp(noise(.03), 1500, 9000) * adsr(int(RATE * .03), .001, .01)
    at(b, g, at_, .25 * (1 - i / 90))
crush = np.round(bp(noise(.6), 300, 4000) * 6) / 6 * np.exp(-T(.6) / .2); at(b, crush, 0, .5); at(b, sub(120, 50, .5, .2), 0, .6)
save('shatter', b, .6, .3)
b = buf(2.2); t = T(2.2); f = np.geomspace(D['D4'], D['D6'] * 1.5, len(t))         # soul rising: glissando + shimmer
x = sum(np.sin(2 * np.pi * np.cumsum(f * h) / RATE) / h for h in (1, 2, 3)) * np.sin(np.pi * t / 2.2) ** 1.5
b += x * .5; at(b, swell(2.0, 5000, 12000, .5), 0, .15); save('soul', b, .5, .45)
b = buf(7.0); t = T(7.0)                                                            # ghost: v1-style choir + whispers + reverse swell
rev = bp(noise(1.2), 400, 5000) * (T(1.2) / 1.2) ** 3; at(b, rev, 0, .35)
for fq in [D['D4'], D['F4'], D['A4'], D['C5'], D['D5']]:
    vib = fq * (1 + .007 * np.sin(2 * np.pi * (4.7 + fq / 400) * t))
    voice = np.sin(2 * np.pi * np.cumsum(vib) / RATE) + .3 * np.sin(2 * np.pi * np.cumsum(vib * 2) / RATE) + .12 * np.sin(2 * np.pi * np.cumsum(vib * 3) / RATE)
    b += voice * np.clip((t - 1.0) / 1.4, 0, 1) * np.minimum(1, (7.0 - t) / 2.2) * .2
wh = bp(noise(7.0), 1800, 6500) * (.5 + .5 * np.sin(2 * np.pi * .9 * t) ** 2) * np.clip((t - .8) / 2, 0, 1) * np.minimum(1, (7 - t) / 2) * .06
b += wh; save('ghost', lp(b, 6000), .55, .5)
print('execution cues written')
