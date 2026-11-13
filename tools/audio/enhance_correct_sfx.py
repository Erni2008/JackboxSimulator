"""Host right-answer sound: the user's correct_vedushii.wav made weightier for the castle hall — no new high layers.
More low/mid body, gentle saturation, a short soft low thump under the hit, a dark hall tail, more loudness.
Run: python3 tools/audio/enhance_correct_sfx.py  -> assets/system_breach/sfx/coin.wav"""
from pathlib import Path
import wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = Path(__file__).resolve().parents[2]
w = wave.open(str(ROOT / 'source_assets/system_breach/correct_vedushii.wav')); R = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, w.getnchannels()).mean(1) / 32768
nz = np.nonzero(np.abs(x) > 2e-3)[0]; x = x[nz[0]:nz[-1] + 1]; x /= np.abs(x).max()
def f(kind, fr, sig): return sosfilt(butter(2, fr, btype=kind, fs=R, output='sos'), sig)
body = x + .9 * f('lowpass', 900, x) + .35 * f('bandpass', [1800, 4200], x) - .25 * f('highpass', 12000, x)   # warmer, less fizz
body = np.tanh(body / np.abs(body).max() * 1.8) / np.tanh(1.8)                                                 # density
out = np.zeros(len(body) + int(R * 1.2)); out[:len(body)] += body
hit = int(np.argmax(np.abs(x) > .35)); t = np.arange(int(R * .16)) / R                                          # low thump on the hit
thump = np.sin(2 * np.pi * np.cumsum(np.geomspace(150, 62, len(t))) / R) * np.exp(-t / .05) * (1 - np.exp(-t / .002))
out[hit:hit + len(t)] += thump * .55
rng = np.random.default_rng(9); n = int(R * 1.1)
ir = f('lowpass', 3800, f('highpass', 200, rng.standard_normal(n) * np.exp(-np.linspace(0, 6.5, n)))); ir[:int(R * .015)] = 0; ir /= np.sqrt(np.sum(ir ** 2))
wet = fftconvolve(out, ir)[:len(out)]; out += wet * .32 * np.abs(out).max() / np.abs(wet).max()
out = f('highpass', 45, out); out = out / np.abs(out).max() * .92
end = np.nonzero(np.abs(out) > 2e-3)[0][-1] + int(R * .05); out = out[:end]; k = int(R * .04); out[-k:] *= np.linspace(1, 0, k)
o = wave.open(str(ROOT / 'assets/system_breach/sfx/coin.wav'), 'wb'); o.setnchannels(1); o.setsampwidth(2); o.setframerate(R); o.writeframes((out * 32767).astype('<i2').tobytes())
print('coin.wav', round(len(out) / R, 2), 's')
