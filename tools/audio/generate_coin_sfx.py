"""Answer sounds for the SYSTEM BREACH host — built to be heard dozens of times in four minutes without tiring.
Right answer: a warm, low "soul chime" (soft bell with a faint gold shimmer). Eight pitches on a D-minor pentatonic,
so consecutive right answers climb as a melody instead of repeating. Wrong answer: a quiet muffled knock.
Run: python3 tools/audio/generate_coin_sfx.py  -> assets/system_breach/sfx/chime_0..7.wav, knock*.wav"""
from pathlib import Path
import wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

RATE = 32000
OUT = Path(__file__).resolve().parents[2] / 'assets/system_breach/sfx'
NOTES = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46, 783.99]   # D4 F4 G4 A4 C5 D5 F5 G5
def T(d): return np.arange(int(RATE * d)) / RATE
def lp(x, f): return sosfilt(butter(2, f, btype='lowpass', fs=RATE, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, btype='highpass', fs=RATE, output='sos'), x)
rng = np.random.default_rng(5); n = int(RATE * .8)
IR = lp(hp(rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n)), 250), 5000); IR[:int(RATE * .01)] = 0; IR /= np.sqrt(np.sum(IR ** 2))
def save(name, x, peak):
    w = fftconvolve(x, IR)[:len(x)]; x = x + w * .5 * np.max(np.abs(x)) / (np.max(np.abs(w)) + 1e-9)
    x = lp(hp(x, 90), 6000); x = x / np.max(np.abs(x)) * peak
    f = int(RATE * .04); x[-f:] *= np.linspace(1, 0, f)
    with wave.open(str(OUT / f'{name}.wav'), 'wb') as wv:
        wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(RATE); wv.writeframes((x * 32767).astype('<i2').tobytes())
OUT.mkdir(parents=True, exist_ok=True)
for i, f in enumerate(NOTES):
    t = T(1.1)
    body = np.sin(2 * np.pi * f * t) * np.exp(-t / .38) + .35 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / .22)
    shimmer = .12 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / .09) + .06 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / .05)
    x = (body + shimmer) * (1 - np.exp(-t / .004))                     # soft 4 ms attack: no click
    save(f'chime_{i}', x, .5)
for v, f0 in enumerate([95, 88, 102]):
    t = T(.35); x = np.sin(2 * np.pi * np.cumsum(np.geomspace(f0 * 1.6, f0, len(t))) / RATE) * np.exp(-t / .07) * (1 - np.exp(-t / .003))
    x += lp(rng.standard_normal(len(t)), 900) * np.exp(-t / .02) * .25
    save('knock' + ('' if v == 0 else f'_{v + 1}'), x, .45)
print('chimes + knocks written')

# Right answer, v3: a clear but rounded coin "clink" — two coins, mid register, harsh top partials tamed.
RATIOS = [1.0, 2.32, 4.25, 6.63]
def coin(r, f0, dur, amp):
    t = T(dur); x = np.zeros(len(t))
    for k, ratio in enumerate(RATIOS):
        x += np.sin(2 * np.pi * f0 * ratio * (1 + r.uniform(-.003, .003)) * t + r.uniform(0, 6)) * np.exp(-t / (.42 / (1 + k * .9))) / (1 + k * 1.3)
    click = lp(hp(r.standard_normal(int(RATE * .004)), 2500), 7000) * np.exp(-T(.004) / .001) * .5
    x[:len(click)] += click; return x * (1 - np.exp(-t / .0015)) * amp
for v, f0 in []:  # superseded by generate_cash_sfx.py
  for _ in []:
    r = np.random.default_rng(40 + v); b = np.zeros(int(RATE * 1.2))
    b += coin(r, f0, 1.2, 1.0); c2 = coin(r, f0 * 1.19, 1.0, .55); i = int(RATE * .075); b[i:i + len(c2)] += c2[:len(b) - i]
    save('coin' + ('' if v == 0 else f'_{v + 1}'), lp(b, 7500), .75)
print('coins written')
