"""Offline-only level preparation. Originals are never overwritten; requires only Python stdlib."""
from pathlib import Path
import array
import hashlib
import json
import sys
import wave

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'assets/sounds/impostor'
SOURCE = ASSETS / 'voting_closed.wav'
DESTINATION = ASSETS / 'runtime/voting_closed.wav'


def prepare():
    original = SOURCE.read_bytes()
    with wave.open(str(SOURCE), 'rb') as source:
        params = source.getparams()
        if params.sampwidth != 2 or params.comptype != 'NONE':
            raise ValueError('Expected original PCM16 voting_closed.wav')
        samples = array.array('h', source.readframes(params.nframes))
    if sys.byteorder != 'little':
        samples.byteswap()
    peak = max(map(abs, samples), default=0)
    if not peak:
        raise ValueError('Source is silent; no placeholder audio will be generated')
    gain = min(12.0, .75 * 32767 / peak)
    output = array.array('h', (max(-32768, min(32767, round(sample * gain))) for sample in samples))
    if sys.byteorder != 'little':
        output.byteswap()
    DESTINATION.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(DESTINATION), 'wb') as destination:
        destination.setparams(params)
        destination.writeframes(output.tobytes())
    assert SOURCE.read_bytes() == original
    manifest = json.loads((ASSETS / 'manifest.json').read_text())
    manifest['runtime'] = {'path': 'runtime/voting_closed.wav', 'source': SOURCE.name,
                           'gain': gain, 'target_peak': .75,
                           'sha256': hashlib.sha256(DESTINATION.read_bytes()).hexdigest()}
    stamp_source=ASSETS / 'wooden_stumb_hit.wav'
    with wave.open(str(stamp_source), 'rb') as source:
        stamp_params=source.getparams()
        if stamp_params.sampwidth!=2:raise ValueError('Expected PCM16 stamp')
        stamp=array.array('h',source.readframes(stamp_params.nframes))
    if sys.byteorder!='little':stamp.byteswap()
    threshold=max(map(abs,stamp))*.10
    first=next(i//stamp_params.nchannels for i,value in enumerate(stamp) if abs(value)>=threshold)
    cut=max(0,first-round(stamp_params.framerate*.001))
    aligned=stamp[cut*stamp_params.nchannels:]
    if sys.byteorder!='little':aligned.byteswap()
    stamp_path=ASSETS / 'runtime/wooden_stumb_hit.wav'
    with wave.open(str(stamp_path),'wb') as destination:
        destination.setparams(stamp_params);destination.writeframes(aligned.tobytes())
    manifest['stamp_alignment']={'path':'runtime/wooden_stumb_hit.wav','source':stamp_source.name,'removed_lead_seconds':cut/stamp_params.framerate,'attack_lead_seconds':.001,'sha256':hashlib.sha256(stamp_path.read_bytes()).hexdigest()}
    print(f'Stamp attack aligned; removed {cut/stamp_params.framerate:.4f}s quiet lead; tail unchanged')
    (ASSETS / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Prepared {DESTINATION.relative_to(ROOT)}; gain {gain:.3f}; original unchanged')


if __name__ == '__main__':
    prepare()
