#!/usr/bin/env python3
"""Copy 13 supplied recordings; prepare bounded wood detail and mono chain playback buffers.
Offline only; originals remain byte-for-byte intact. No generated placeholder audio.
"""
from pathlib import Path
import array
import hashlib
import json
import math
import shutil
import sys
import wave

ROOT = next(p for p in Path(__file__).resolve().parents if (p / 'settings.gradle').is_file())
SOURCE = ROOT / 'source_assets/audio/cursed_boxes_expansion'
GROUPS = {
    'cursed_boxes': ['shooted_box2.wav', 'appearance.wav', 'appearance2.wav', 'appearance3.wav', 'appearance4.wav', 'horror_appearance.wav', 'horror_appearance2.wav'],
    'cages': ['gate_closes.wav', 'chain_cage.wav', 'chain_cage2.wav'],
    'environment': ['creepy_basement.mp3'],
    'ui': ['button_press.mp3', 'hover_button.wav'],
}

def main():
    entries = []
    for category, names in GROUPS.items():
        for name in names:
            source = SOURCE / name
            if not source.is_file():
                raise FileNotFoundError(f'Missing original recording: {source}')
            destination = ROOT / 'assets/sounds' / category / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
            digest = hashlib.sha256(source.read_bytes()).hexdigest()
            assert hashlib.sha256(destination.read_bytes()).hexdigest() == digest
            entry = {'source': str(source.relative_to(ROOT)), 'asset': str(destination.relative_to(ROOT / 'assets')), 'sha256': digest}
            if name == 'shooted_box2.wav':
                # Source peaks already reach full scale but its wood detail is much quieter.
                # Prepare a bounded soft-limited playback copy; never overwrite the recording.
                runtime = destination.parent / 'runtime' / name
                runtime.parent.mkdir(parents=True, exist_ok=True)
                with wave.open(str(source), 'rb') as recording:
                    if recording.getsampwidth() != 2:
                        raise ValueError(f'Expected PCM16 wood recording: {source}')
                    params = recording.getparams()
                    samples = array.array('h', recording.readframes(recording.getnframes()))
                    if sys.byteorder != 'little': samples.byteswap()
                channels = params.nchannels
                first = next((i for i in range(0, len(samples), channels)
                              if max(abs(x) for x in samples[i:i + channels]) > 32), 0) // channels
                start = max(0, first - round(params.framerate * .005))
                samples = samples[start * channels:]
                shaped = array.array('h', (round(32767 * .95 * math.tanh(x / 32768 * 4) / math.tanh(4)) for x in samples))
                def rms(values): return math.sqrt(sum((x / 32768) ** 2 for x in values) / len(values))
                entry['processing'] = {'removedFrames': start, 'drive': 4, 'peakLimit': .95,
                                       'inputRms': rms(samples), 'outputRms': rms(shaped)}
                if sys.byteorder != 'little': shaped.byteswap()
                with wave.open(str(runtime), 'wb') as output:
                    output.setparams(params); output.writeframes(shaped.tobytes())
                entry['playbackAsset'] = str(runtime.relative_to(ROOT / 'assets'))
            if name.startswith('chain_cage'):
                runtime = destination.parent / 'runtime' / name
                runtime.parent.mkdir(parents=True, exist_ok=True)
                with wave.open(str(source), 'rb') as recording:
                    if recording.getnchannels() != 2 or recording.getsampwidth() != 2:
                        raise ValueError(f'Expected the supplied stereo PCM16 chain recording: {source}')
                    samples = array.array('h', recording.readframes(recording.getnframes()))
                    if sys.byteorder != 'little': samples.byteswap()
                    mono = array.array('h', ((int(samples[i]) + samples[i + 1]) // 2 for i in range(0, len(samples), 2)))
                    if sys.byteorder != 'little': mono.byteswap()
                    with wave.open(str(runtime), 'wb') as output:
                        output.setnchannels(1); output.setsampwidth(2); output.setframerate(recording.getframerate()); output.writeframes(mono.tobytes())
                entry['playbackAsset'] = str(runtime.relative_to(ROOT / 'assets'))
            entries.append(entry)
    manifest = ROOT / 'assets/sounds/cursed_boxes/expansion_manifest.json'
    manifest.write_text(json.dumps(entries, indent=2) + '\n')
    print(f'Prepared {len(entries)} unchanged source copies, boosted wood detail and two mono chain buffers; {manifest.relative_to(ROOT)}')

if __name__ == '__main__':
    main()
