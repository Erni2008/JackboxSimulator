"""Host right-answer sound: the user's source_assets/system_breach/correct_cut.wav, timing and stereo untouched.
Light noise reduction (never dulls the top), a little presence/clarity, no reverb or echo, and a smooth natural
fade-out over the last 0.35 s instead of the abrupt stop.
Run: python3 tools/audio/enhance_correct_sfx.py  -> assets/system_breach/sfx/coin.wav"""
from pathlib import Path
import wave
import numpy as np
from scipy.signal import stft, istft, butter, sosfilt

ROOT = Path(__file__).resolve().parents[2]
w = wave.open(str(ROOT / 'source_assets/system_breach/correct_cut.wav')); R = w.getframerate(); C = w.getnchannels()
x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, C) / 32768
def flt(kind, fr, sig): return sosfilt(butter(2, fr, btype=kind, fs=R, output='sos'), sig, axis=0)
out = np.zeros_like(x)
for c in range(C):
    _, _, Z = stft(x[:, c], R, nperseg=2048, noverlap=1536)
    noise = np.mean(np.abs(Z[:, :int(.2 * R / 512)]), axis=1, keepdims=True)
    mag = np.abs(Z); gain = np.clip(1 - 1.6 * noise / (mag + 1e-12), .35, 1)
    fz = np.fft.rfftfreq(2048, 1 / R)[:, None]; gain = np.where((np.abs(fz - 3075) < 120) | (np.abs(fz - 7500) < 200), 1, gain)   # never touch the ring            # light: at most -6 dB, only where it is noise
    for i in range(1, gain.shape[1]): gain[:, i] = np.maximum(gain[:, i], gain[:, i - 1] * .9)
    _, y = istft(Z * gain, R, nperseg=2048, noverlap=1536); out[:, c] = y[:len(x)]
# ringing but soft: narrow lifts only on the coin's own partials (they sing longer), the broad bright band stays gentle
def narrow(f0, q, sig): return sosfilt(butter(2, [f0 * (1 - 1 / (2 * q)), f0 * (1 + 1 / (2 * q))], btype='bandpass', fs=R, output='sos'), sig, axis=0)
out = out + 1.5 * narrow(3075, 18, out) + 1.4 * narrow(7500, 22, out) + .15 * flt('bandpass', [3000, 9000], out) + .18 * flt('highpass', 10500, out) - .2 * flt('bandpass', [4200, 6200], out)
# transient shaper: lift the attack of each strike so the clink is crisp
env = np.abs(flt('lowpass', 60, np.abs(out).mean(axis=1)))
fast = np.abs(flt('lowpass', 400, np.abs(out).mean(axis=1)))
out = out * (1 + .25 * np.clip((fast - env) / (env + 1e-4), 0, 1.5))[:, None]
out = flt('highpass', 60, out)
# a long, smooth decay without echo: the original eases out while the coin's own partials ring on and die away
N = len(out); ext = int(R * 1.0); win = slice(N - int(R * .5), N - int(R * .4))
lv = {(fq, c): np.sqrt(2 * np.mean(narrow(fq, q, out)[win, c] ** 2)) for fq, q in ((3075, 18), (7446, 30), (7553, 30)) for c in range(C)}
fade = int(R * .4); out[N - fade:] *= (np.linspace(1, 0, fade) ** 1.2)[:, None]
out = np.vstack([out, np.zeros((ext, C))]); start = N - int(R * .45); tt = np.arange(len(out) - start) / R
rng = np.random.default_rng(8)
for fq, tau in ((3075, .55), (7446, .4), (7553, .4)):
    for c in range(C):
        out[start:, c] += np.sin(2 * np.pi * fq * tt + rng.uniform(0, 6)) * lv[(fq, c)] * 1.5 * np.exp(-tt / tau) * np.minimum(1, tt / .15)
k = int(R * .15); out[-k:] *= (np.linspace(1, 0, k) ** 2)[:, None]            # natural decay, no echo
out = out / np.abs(out).max(); out = np.tanh(out * 1.3) / np.tanh(1.3) * .93          # soft limiter: louder and denser, no clipping
o = wave.open(str(ROOT / 'assets/system_breach/sfx/coin.wav'), 'wb'); o.setnchannels(C); o.setsampwidth(2); o.setframerate(R); o.writeframes((out * 32767).astype('<i2').tobytes())
print('coin.wav', round(len(out) / R, 2), 's')
