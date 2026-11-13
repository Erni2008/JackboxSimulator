"""Procedural sound effects for the SYSTEM BREACH host screen (deterministic synthesis, no samples, no downloads).
Run: python3 tools/audio/generate_system_breach_sfx.py  -> assets/system_breach/sfx/*.wav (48 kHz mono 16-bit)."""
from pathlib import Path
import wave
import numpy as np
from scipy.signal import butter, sosfilt

RATE = 48000
OUT = Path(__file__).resolve().parents[2] / 'assets/system_breach/sfx'
rng = np.random.default_rng(7)

def t(d): return np.arange(int(RATE * d)) / RATE
def env(n, a=.005, r=.2, d=None):
    x = np.arange(n) / RATE; d = d or n / RATE
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-np.maximum(0, x - a) / r)
def band(x, lo, hi): return sosfilt(butter(2, [lo, hi], btype='bandpass', fs=RATE, output='sos'), x)
def low(x, f): return sosfilt(butter(2, f, btype='lowpass', fs=RATE, output='sos'), x)
def sine(f, d, ph=0):
    f = np.broadcast_to(np.asarray(f, float), t(d).shape)
    return np.sin(2 * np.pi * np.cumsum(f) / RATE + ph)
def square(f, d): return np.sign(sine(f, d)) * .6
def at(buf, sig, sec):
    i = int(sec * RATE); j = min(len(buf), i + len(sig)); buf[i:j] += sig[:j - i]; return buf
def reverb(x, amount=.25, length=.6):
    ir = rng.standard_normal(int(RATE * length)) * np.exp(-np.linspace(0, 6, int(RATE * length)))
    wet = np.convolve(x, low(ir, 5000))[:len(x) + len(ir) - 1]
    y = np.zeros(len(wet)); y[:len(x)] += x; y += wet / np.max(np.abs(wet) + 1e-9) * np.max(np.abs(x)) * amount
    return y
def save(name, x, peak=.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    fade = min(len(x), int(RATE * .01)); x[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(str(OUT / f'{name}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes((x * 32767).astype('<i2').tobytes())

def blip(f, d=.09, kind=sine): s = kind(f, d); return s * env(len(s), .002, d / 3)
def chord(fs, d, r=.6): return sum(sine(f, d) * env(int(RATE * d), .01, r) for f in fs) / len(fs)

OUT.mkdir(parents=True, exist_ok=True)
# soft confirmation when someone answers right (frequent: keep it quiet and short)
save('solve', np.concatenate([blip(1320, .05), blip(1760, .08)]), .35)
# key forged / bought: sparkling arpeggio
k = np.zeros(int(RATE * .9))
for i, f in enumerate([988, 1319, 1661, 1976, 2637]): at(k, blip(f, .25) * .7, i * .06)
save('key', reverb(k, .3), .55)
# hack starts: rising alarm sweep twice
a = np.zeros(int(RATE * 1.0))
for i in range(2): at(a, square(np.linspace(420, 980, int(RATE * .32)), .32) * env(int(RATE * .32), .01, .3), i * .38)
save('hack_start', low(a, 3500), .5)
# hack success: digital stinger down + sub hit
s = np.zeros(int(RATE * 1.2)); at(s, square(np.linspace(1600, 300, int(RATE * .35)), .35) * env(int(RATE * .35), .002, .2), 0)
at(s, sine(np.linspace(110, 45, int(RATE * .6)), .6) * env(int(RATE * .6), .003, .25) * 1.4, .05)
save('hack_success', reverb(low(s, 6000), .2), .8)
# hack failed: buzzer + descending tone
f = np.zeros(int(RATE * .8)); at(f, square(140, .35) * env(int(RATE * .35), .005, .25), 0); at(f, sine(np.linspace(520, 260, int(RATE * .4)), .4) * env(int(RATE * .4), .01, .2) * .6, .18)
save('hack_fail', low(f, 2500), .6)
# sabotage: glitch burst + wobbling siren
g = np.zeros(int(RATE * 1.4)); n = rng.standard_normal(int(RATE * .3))
at(g, band(n, 800, 6000) * (rng.random(len(n)) > .5) * env(len(n), .001, .1), 0)
lfo = 700 + 260 * np.sin(2 * np.pi * 7 * t(1.0))
at(g, (sine(lfo, 1.0) + .4 * square(lfo / 2, 1.0)) * env(int(RATE), .02, .45) * .6, .12)
save('sabotage', reverb(low(g, 5000), .25), .65)
# virus removed: clean rising chime
c = np.zeros(int(RATE * 1.0))
for i, fr in enumerate([784, 988, 1175, 1568]): at(c, blip(fr, .35) * .8, i * .07)
save('clean', reverb(c, .35), .5)
# firewall: whoosh + metallic clang
w = np.zeros(int(RATE * 1.0)); n = rng.standard_normal(int(RATE * .4)); at(w, band(n, 300, 3000) * np.hanning(len(n)) * .5, 0)
at(w, (sine(620, .6) + .6 * sine(1490, .6) + .4 * sine(2310, .6)) * env(int(RATE * .6), .001, .18) * .6, .3)
save('firewall', reverb(w, .25), .55)
# multiplier: quick rising arpeggio
m = np.zeros(int(RATE * .7))
for i, fr in enumerate([523, 659, 784, 1047]): at(m, blip(fr, .14, square) * .5, i * .05)
save('multiplier', low(reverb(m, .2), 6000), .5)
# last-seconds clock tick
save('tick', band(rng.standard_normal(int(RATE * .05)), 1800, 5000) * env(int(RATE * .05), .0005, .012), .45)
# banner whoosh
n = rng.standard_normal(int(RATE * .45)); save('whoosh', band(n, 400, 4000) * np.hanning(len(n)) ** 2, .3)
# ceremony: drum roll, reveal impact, champion fanfare, thunder, ghost choir, operation complete
d = np.zeros(int(RATE * 2.0))
for i in range(int(2.0 / .045)): at(d, band(rng.standard_normal(int(RATE * .05)), 150, 2500) * env(int(RATE * .05), .001, .02) * (.4 + .6 * i / 44), i * .045)
save('drumroll', reverb(d, .2), .55)
r = np.zeros(int(RATE * 1.6)); at(r, sine(np.linspace(90, 40, int(RATE * .8)), .8) * env(int(RATE * .8), .002, .35) * 1.5, 0)
at(r, band(rng.standard_normal(int(RATE * .3)), 2000, 9000) * env(int(RATE * .3), .001, .08) * .6, 0); at(r, chord([523, 659, 784], 1.2, .5) * .5, .05)
save('reveal', reverb(r, .3), .8)
fa = np.zeros(int(RATE * 2.4))
for i, (fs, d0) in enumerate([([392, 494, 587], .22), ([392, 494, 587], .22), ([523, 659, 784, 1047], 1.6)]):
    at(fa, sum(square(fq, d0 + .2) for fq in fs) / len(fs) * env(int(RATE * (d0 + .2)), .01, d0 * .7 + .15), i * .26)
save('fanfare', reverb(low(fa, 4500), .35), .7)
th = np.zeros(int(RATE * 3.0)); n = rng.standard_normal(len(th))
crack = band(n[:int(RATE * .25)], 1500, 9000) * env(int(RATE * .25), .0005, .05); at(th, crack * 1.2, 0)
rumble = low(n, 160) * env(len(th), .02, .9) * 2.5; th += rumble
save('thunder', reverb(th, .3, .9), .9)
gh = np.zeros(int(RATE * 4.0))
for fq in [220, 261.6, 329.6, 392]:
    vib = fq * (1 + .006 * np.sin(2 * np.pi * (4.7 + fq / 400) * t(4.0)))
    gh += (sine(vib, 4.0) + .3 * sine(vib * 2, 4.0)) * np.minimum(1, t(4.0) / 1.2) * np.minimum(1, (4.0 - t(4.0)) / 1.4)
gh += band(rng.standard_normal(len(gh)), 600, 3000) * .08 * np.minimum(1, t(4.0) / 1.2) * np.minimum(1, (4.0 - t(4.0)) / 1.4)
save('ghost', reverb(gh, .45, 1.2), .55)
oc = np.zeros(int(RATE * 1.6)); at(oc, sine(np.linspace(220, 55, int(RATE * 1.0)), 1.0) * env(int(RATE), .002, .5) * 1.4, 0)
at(oc, chord([196, 247, 294], 1.4, .7) * .6, .02)
save('complete', reverb(oc, .3), .8)
print('wrote', sorted(p.name for p in OUT.glob('*.wav')))
