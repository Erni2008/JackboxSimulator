"""Money sounds for answers on the player's phone — modal coin synthesis (no samples, no downloads).
A coin is a metal disc: a strike transient plus inharmonic partials, each with its own decay. Correct answers collect
coins; wrong answers drop one that bounces, wobbles and rolls away. Three takes each.
Run: python3 tools/audio/generate_coin_sfx.py  -> web/sfx/*.wav (32 kHz mono 16-bit, small for phones)."""
from pathlib import Path
import wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

RATE = 32000
OUT = Path(__file__).resolve().parents[2] / 'web/sfx'
RATIOS = [1.0, 2.32, 4.25, 6.63, 9.38, 12.1]
def T(d): return np.arange(int(RATE * d)) / RATE
def hp(x, f): return sosfilt(butter(2, f, btype='highpass', fs=RATE, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, btype='lowpass', fs=RATE, output='sos'), x)
def buf(d): return np.zeros(int(RATE * d))
def at(b, s, sec, g=1.):
    i = int(sec * RATE); j = min(len(b), i + len(s));
    if i < len(b): b[i:j] += s[:j - i] * g
    return b

def coin(rng, f0=None, dur=.9, hard=1., bright=1.):
    """One strike of a coin: noise click + six decaying inharmonic partials."""
    f0 = f0 or rng.uniform(2300, 3600); t = T(dur); x = np.zeros(len(t))
    for k, r in enumerate(RATIOS):
        f = f0 * r * (1 + rng.uniform(-.004, .004))
        if f > RATE * .45: break
        decay = rng.uniform(.25, .55) / (1 + k * .55); amp = (1 / (1 + k * .8)) * (bright if k > 1 else 1)
        x += np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t / decay) * amp
    click = hp(rng.standard_normal(int(RATE * .006)), 4000) * np.exp(-T(.006) / .0012)
    x[:len(click)] += click * 1.2 * hard
    return x * (1 - np.exp(-t / .0008))

def room(x, wet=.16, size=.5, seed=3):
    rng = np.random.default_rng(seed); n = int(RATE * size); ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 8, n)); ir = lp(hp(ir, 300), 7000); ir[:int(RATE * .008)] = 0; ir /= np.sqrt(np.sum(ir ** 2))
    w = fftconvolve(x, ir)[:len(x)]; return x + w * wet * np.max(np.abs(x)) / (np.max(np.abs(w)) + 1e-9) * 1.5
def save(name, x, peak=.7, wet=.16):
    x = room(x, wet); x = hp(x, 120); x = np.tanh(x / (np.max(np.abs(x)) + 1e-9) * 1.15) / np.tanh(1.15); x = x / np.max(np.abs(x)) * peak
    nz = np.nonzero(np.abs(x) > 1e-3)[0]; x = x[:nz[-1] + int(RATE * .05)] if len(nz) else x
    f = min(len(x), int(RATE * .03)); x[-f:] *= np.linspace(1, 0, f)
    with wave.open(str(OUT / f'{name}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes((x * 32767).astype('<i2').tobytes())

OUT.mkdir(parents=True, exist_ok=True)
for v in (1, 2, 3):
    rng = np.random.default_rng(100 + v)
    # correct: two bright pickup pings rising, then a little cascade of coins landing in a pile + sparkle
    b = buf(1.6); base = rng.uniform(2600, 3000)
    at(b, coin(rng, base, .9, 1.2, 1.1), 0, 1.0); at(b, coin(rng, base * 1.335, 1.0, 1.2, 1.2), .085, .95)
    for i in range(7): at(b, coin(rng, None, .6, .7, .8), .2 + i * rng.uniform(.03, .055) + rng.uniform(0, .015), .32 * (1 - i / 10))
    sparkle = hp(rng.standard_normal(int(RATE * .7)), 7000) * np.exp(-T(.7) / .2) * .05; at(b, sparkle, .1)
    save(f'coin_ok_{v}', b, .72)
    # wrong: a coin dropped on stone — bounces closer and closer, wobbles (Euler's disk) and rolls away, plus a dull thud
    b = buf(1.9); f0 = rng.uniform(1900, 2300); tt = .0; gap = rng.uniform(.17, .21); g = 1.0
    at(b, lp(np.sin(2 * np.pi * 80 * T(.25)) * np.exp(-T(.25) / .06), 400), 0, .55)
    while gap > .012 and tt < 1.1:
        at(b, lp(coin(rng, f0 * (1 - tt * .05), .35, g, .6), 6000), tt, g); tt += gap; gap *= .72; g *= .8
    wob = T(.7); rate = np.geomspace(14, 70, len(wob)); ph = 2 * np.pi * np.cumsum(rate) / RATE
    roll = np.sin(2 * np.pi * f0 * .98 * wob) * (.5 + .5 * np.abs(np.sin(ph))) * np.exp(-wob / .25) * (1 - wob / .7)
    at(b, lp(roll, 5000), tt, .22)
    save(f'coin_bad_{v}', lp(b, 7000), .55, .12)
# SOULS jackpot: a big cascade of coins pouring onto a pile, with a cash-register bell on top
rng = np.random.default_rng(7); b = buf(2.8)
for i in range(34): at(b, coin(rng, None, .7, .6 + rng.random() * .5, .9), .05 + (i / 34) ** 1.3 * 1.4 + rng.uniform(0, .03), .3 * (1 - i / 50))
for f in (2093, 2637): at(b, coin(rng, f, 1.6, .4, 1.4), 0, .55)   # the register's two bells
save('coin_jackpot', b, .75, .2)
print(sorted(p.name for p in OUT.glob('coin*.wav')))
