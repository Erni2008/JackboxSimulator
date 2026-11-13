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
