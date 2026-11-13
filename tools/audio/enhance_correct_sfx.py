"""Host right-answer sound from the user's source_assets/system_breach/correct_cut.wav:
1) spectral noise reduction using the file's own silent lead-in as the noise profile;
2) the coin ring re-inforced with clean partials at the measured frequencies (7446/7553 Hz pair + 3075 Hz) and decays;
3) a little low/mid body, a soft low thump on the hit and a dark hall tail; loudness up.
Run: python3 tools/audio/enhance_correct_sfx.py  -> assets/system_breach/sfx/coin.wav"""
from pathlib import Path
import wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve, stft, istft

ROOT = Path(__file__).resolve().parents[2]
w = wave.open(str(ROOT / 'source_assets/system_breach/correct_cut.wav')); R = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, w.getnchannels()).mean(1) / 32768
def f(kind, fr, sig): return sosfilt(butter(2, fr, btype=kind, fs=R, output='sos'), sig)
# 1) denoise: profile from the silent first 0.22 s
_, _, Z = stft(x, R, nperseg=1024, noverlap=768); noise = np.mean(np.abs(Z[:, :int(.22 * R / 256)]), axis=1, keepdims=True)
mag = np.abs(Z); gain = np.clip((mag - 3.4 * noise) / (mag + 1e-12), .04, 1); gain = np.maximum(gain, np.roll(gain, 1, axis=1) * .6)   # soft release
_, y = istft(Z * gain, R, nperseg=1024, noverlap=768); y = y[:len(x)]
onset = int(np.argmax(np.abs(f('highpass', 1500, y)) > .25 * np.abs(f('highpass', 1500, y)).max())); start = max(0, onset - int(R * .01))
y = y[start:]; y /= np.abs(y).max()
# 2) clean ring on the measured partials
t = np.arange(int(R * .9)) / R; att = 1 - np.exp(-t / .002)
ring = (np.sin(2 * np.pi * 7446 * t) + .85 * np.sin(2 * np.pi * 7553 * t + 1.3)) * np.exp(-t / .13) * .5 + np.sin(2 * np.pi * 3075 * t + .4) * np.exp(-t / .2) * .38
ring *= att; out = np.zeros(int(R * 2.2)); out[:len(y)] += y; out[:len(ring)] += ring * .55
# 3) body, weight, hall
out = out + .7 * f('lowpass', 1000, out); out = np.tanh(out / np.abs(out).max() * 1.25) / np.tanh(1.25)
tt = np.arange(int(R * .16)) / R; out[:len(tt)] += np.sin(2 * np.pi * np.cumsum(np.geomspace(150, 62, len(tt))) / R) * np.exp(-tt / .05) * (1 - np.exp(-tt / .002)) * .45
rng = np.random.default_rng(9); n = int(R * 1.1)
ir = f('lowpass', 4200, f('highpass', 200, rng.standard_normal(n) * np.exp(-np.linspace(0, 6.5, n)))); ir[:int(R * .015)] = 0; ir /= np.sqrt(np.sum(ir ** 2))
wet = fftconvolve(out, ir)[:len(out)]; out += wet * .28 * np.abs(out).max() / np.abs(wet).max()
out = f('lowpass', 14000, f('highpass', 45, out)); out = out / np.abs(out).max() * .92
end = np.nonzero(np.abs(out) > 2e-3)[0][-1] + int(R * .05); out = out[:end]; k = int(R * .04); out[-k:] *= np.linspace(1, 0, k)
o = wave.open(str(ROOT / 'assets/system_breach/sfx/coin.wav'), 'wb'); o.setnchannels(1); o.setsampwidth(2); o.setframerate(R); o.writeframes((out * 32767).astype('<i2').tobytes())
print('coin.wav', round(len(out) / R, 2), 's')
