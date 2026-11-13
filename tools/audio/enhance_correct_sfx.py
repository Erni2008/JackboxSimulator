"""Host right-answer sound: the user's source_assets/system_breach/correct_cut.wav with its timing untouched —
only a gentle spectral noise reduction (profile from its own quiet lead-in), stereo kept, loudness normalised.
Run: python3 tools/audio/enhance_correct_sfx.py  -> assets/system_breach/sfx/coin.wav"""
from pathlib import Path
import wave
import numpy as np
from scipy.signal import stft, istft

ROOT = Path(__file__).resolve().parents[2]
w = wave.open(str(ROOT / 'source_assets/system_breach/correct_cut.wav')); R = w.getframerate(); C = w.getnchannels()
x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, C) / 32768
out = np.zeros_like(x)
for c in range(C):
    _, _, Z = stft(x[:, c], R, nperseg=2048, noverlap=1536)
    noise = np.mean(np.abs(Z[:, :int(.2 * R / 512)]), axis=1, keepdims=True)
    mag = np.abs(Z); gain = np.clip(1 - 1.5 * noise / (mag + 1e-12), .25, 1)          # gentle: never below -12 dB
    for i in range(1, gain.shape[1]): gain[:, i] = np.maximum(gain[:, i], gain[:, i - 1] * .85)   # smooth release, no musical noise
    _, y = istft(Z * gain, R, nperseg=2048, noverlap=1536); out[:, c] = y[:len(x)]
# polish: a touch of warmth and air (gentle shelves, nothing harsh)
from scipy.signal import butter, sosfilt, fftconvolve
def flt(kind, fr, sig): return sosfilt(butter(2, fr, btype=kind, fs=R, output='sos'), sig, axis=0)
out = out + .25 * flt('lowpass', 300, out) + .12 * flt('highpass', 10000, out)
# natural decay instead of the hard stop: the dry sound eases out over its last 150 ms while a smooth stereo hall tail
# (≈1.4 s) carries it on
tail = int(R * 1.4); out = np.vstack([out, np.zeros((tail, C))])
fade = int(R * .15); end = len(x); out[end - fade:end] *= np.linspace(1, 0, fade)[:, None] ** 1.5
rng = np.random.default_rng(4); n = int(R * 1.6)
for c in range(C):
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 6.0, n)); ir = flt('lowpass', 6500, flt('highpass', 180, ir)); ir[:int(R * .012)] = 0; ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(out[:, c], ir)[:len(out)]; out[:, c] += wet * .30 * np.abs(out[:end, c]).max() / (np.abs(wet).max() + 1e-9)
k = int(R * .3); out[-k:] *= np.linspace(1, 0, k)[:, None] ** 2
out = out / np.abs(out).max() * .9
o = wave.open(str(ROOT / 'assets/system_breach/sfx/coin.wav'), 'wb'); o.setnchannels(C); o.setsampwidth(2); o.setframerate(R); o.writeframes((out * 32767).astype('<i2').tobytes())
print('coin.wav', round(len(out) / R, 2), 's, channels', C)
