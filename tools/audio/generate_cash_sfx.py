"""SUPERSEDED: the host now plays the user's reference correct_vedushii.wav as-is (assets/system_breach/sfx/coin.wav).
Kept only as an experiment. Host right-answer sound: "money in". Built around the reference sparkle source_assets/system_breach/correct_vedushii.wav
(the bright top layer the user picked) with a cash-register "ka-ching", a little weight underneath and a few coins
settling — a cheerful game-show payout in the spirit of party trivia games. Three takes in different keys.
Run: python3 tools/audio/generate_cash_sfx.py  -> assets/system_breach/sfx/coin.wav, coin_2.wav, coin_3.wav"""
from pathlib import Path
import wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly

RATE = 44100
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets/system_breach/sfx'
def T(d): return np.arange(int(RATE * d)) / RATE
def lp(x, f): return sosfilt(butter(2, f, btype='lowpass', fs=RATE, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, btype='highpass', fs=RATE, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], btype='bandpass', fs=RATE, output='sos'), x)
def at(b, s, sec, g=1.):
    i = int(sec * RATE); j = min(len(b), i + len(s)); b[i:j] += s[:j - i] * g; return b
def load(path):
    w = wave.open(str(path)); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, w.getnchannels()).mean(1) / 32768
    if w.getframerate() != RATE: x = resample_poly(x, RATE, w.getframerate())
    nz = np.nonzero(np.abs(x) > 2e-3)[0]; x = x[nz[0]:nz[-1] + 1]; return x / np.max(np.abs(x))
def bell(f, d, decay, index=1.6, ratio=3.01):
    t = T(d); m = np.sin(2 * np.pi * f * ratio * t) * index * np.exp(-t / (decay * .35))
    return np.sin(2 * np.pi * f * t + m) * np.exp(-t / decay) * (1 - np.exp(-t / .0015))
def coin(r, f0, d=.4):
    t = T(d); return sum(np.sin(2 * np.pi * f0 * k * t + r.uniform(0, 6)) * np.exp(-t / (.18 / (1 + i))) / (1 + i * 1.5) for i, k in enumerate([1, 2.32, 4.25])) * (1 - np.exp(-t / .001))
spark = load(ROOT / 'source_assets/system_breach/correct_vedushii.wav')
rng = np.random.default_rng(2); n = int(RATE * .6)
IR = lp(hp(rng.standard_normal(n) * np.exp(-np.linspace(0, 8, n)), 300), 8000); IR[:int(RATE * .01)] = 0; IR /= np.sqrt(np.sum(IR ** 2))
for v, (f1, f2) in [] and enumerate([(1567.98, 2093.0), (1760.0, 2349.3), (1396.9, 1864.7)]):   # G6/C7, A6/D7, F6/A#6 — a bright fourth
    r = np.random.default_rng(10 + v); b = np.zeros(int(RATE * 1.3))
    at(b, bp(r.standard_normal(int(RATE * .03)), 1500, 5000) * np.exp(-T(.03) / .006), 0, .5)          # "ka": register latch
    at(b, np.sin(2 * np.pi * np.cumsum(np.geomspace(220, 110, int(RATE * .14))) / RATE) * np.exp(-T(.14) / .04), 0, .55)  # weight
    at(b, bell(f1, 1.1, .32), .028, .55); at(b, bell(f2, 1.2, .42), .085, .6)                         # "ching": two-note register bell
    at(b, spark, .02, .7)                                                                             # the chosen sparkle on top
    for k, t0 in enumerate([.2, .27, .33]): at(b, coin(r, r.uniform(2600, 3400)), t0 + r.uniform(0, .02), .16 - k * .03)   # coins settle
    w = fftconvolve(b, IR)[:len(b)]; b = b + w * .3 * np.max(np.abs(b)) / (np.max(np.abs(w)) + 1e-9)
    b = hp(b, 70); b = np.tanh(b / np.max(np.abs(b)) * 1.2) / np.tanh(1.2) * .82
    nz = np.nonzero(np.abs(b) > 1e-3)[0]; b = b[:nz[-1] + int(RATE * .04)]; f = int(RATE * .03); b[-f:] *= np.linspace(1, 0, f)
    with wave.open(str(OUT / ('coin' + ('' if v == 0 else f'_{v + 1}') + '.wav')), 'wb') as wv:
        wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(RATE); wv.writeframes((b * 32767).astype('<i2').tobytes())
print('payout written')
