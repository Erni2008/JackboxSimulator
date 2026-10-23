#!/usr/bin/env python3
"""Copy original question recordings and prepare a circular splice for music2, offline only."""
from pathlib import Path
import array
import hashlib
import json
import shutil
import sys
import wave

ROOT = next(p for p in Path(__file__).resolve().parents if (p / 'settings.gradle').is_file())
SOURCE = ROOT / 'source_assets/audio/questions'
DEST = ROOT / 'assets/sounds/questions'
NAMES = ('background_music.wav', 'background_music2.wav', 'door_lock(done).wav', 'clock_ticks.wav')


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    entries = []
    for name in NAMES:
        original = SOURCE / name
        destination = DEST / name
        shutil.copy2(original, destination)
        with wave.open(str(original), 'rb') as audio:
            params = audio.getparams()
            frames = audio.getnframes()
            data = audio.readframes(frames)
        entry = dict(source=str(original.relative_to(ROOT)), asset=str(destination.relative_to(ROOT / 'assets')),
                     sha256=hashlib.sha256(original.read_bytes()).hexdigest(), duration=frames / params.framerate)
        if name == 'background_music2.wav':
            # Original ends at high amplitude. Join its tail to its head over 150 ms,
            # then start the loop after that head. The loop seam is now adjacent samples
            # from the original, rather than a large waveform discontinuity or silence.
            if params.sampwidth != 2:
                raise ValueError('Expected PCM16 music2 recording')
            samples = array.array('h', data)
            if sys.byteorder != 'little':
                samples.byteswap()
            length = round(params.framerate * .15)
            channels = params.nchannels
            prepared = samples[length * channels:(frames - length) * channels]
            for frame in range(length):
                weight = frame / (length - 1)
                for channel in range(channels):
                    tail = samples[(frames - length + frame) * channels + channel]
                    head = samples[frame * channels + channel]
                    prepared.append(round(tail * (1 - weight) + head * weight))
            if sys.byteorder != 'little':
                prepared.byteswap()
            runtime = DEST / 'runtime' / name
            runtime.parent.mkdir(exist_ok=True)
            with wave.open(str(runtime), 'wb') as output:
                output.setparams(params)
                output.writeframes(prepared.tobytes())
            entry.update(runtimeAsset=str(runtime.relative_to(ROOT / 'assets')), circularSpliceSeconds=.15,
                         runtimeSha256=hashlib.sha256(runtime.read_bytes()).hexdigest())
        entries.append(entry)
    (DEST / 'manifest.json').write_text(json.dumps(entries, indent=2) + '\n')
    print('Prepared 4 question recordings; preserved originals and circular music2 splice.')


if __name__ == '__main__':
    main()
