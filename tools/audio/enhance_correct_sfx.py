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
    mag = np.abs(Z); gain = np.clip(1 - 1.2 * noise / (mag + 1e-12), .5, 1)            # light: at most -6 dB, only where it is noise
    for i in range(1, gain.shape[1]): gain[:, i] = np.maximum(gain[:, i], gain[:, i - 1] * .9)
    _, y = istft(Z * gain, R, nperseg=2048, noverlap=1536); out[:, c] = y[:len(x)]
out = out + .35 * flt('bandpass', [2500, 9000], out)                                     # presence / clarity
out = flt('highpass', 60, out)
fade = int(R * .35); out[-fade:] *= (np.linspace(1, 0, fade) ** 2.2)[:, None]            # natural decay, no echo
out = out / np.abs(out).max() * .92
o = wave.open(str(ROOT / 'assets/system_breach/sfx/coin.wav'), 'wb'); o.setnchannels(C); o.setsampwidth(2); o.setframerate(R); o.writeframes((out * 32767).astype('<i2').tobytes())
print('coin.wav', round(len(out) / R, 2), 's')
