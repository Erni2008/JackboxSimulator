"""Lossless-source Vorbis export and structural validation, independent of TTS."""
from pathlib import Path
import json
import shutil
import subprocess


def probe(path):
    result = subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format',
                             '-of', 'json', str(path)], check=True, capture_output=True, text=True)
    data = json.loads(result.stdout)
    streams = [s for s in data['streams'] if s['codec_type'] == 'audio']
    if len(streams) != 1 or float(data['format'].get('duration', 0)) <= 0:
        raise ValueError(f'Invalid audio file: {path}')
    subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-i', str(path), '-f', 'null', '-'], check=True)
    return streams[0], float(data['format']['duration'])


def export_vorbis(source, destination, bitrate=96):
    source, destination = Path(source), Path(destination)
    if bitrate not in (64, 96, 128):
        raise ValueError('Supported bitrates: 64, 96, 128 kbps')
    if destination.exists():
        raise FileExistsError(destination)
    stream, _ = probe(source)
    if stream['codec_name'] not in ('pcm_s16le', 'pcm_s24le', 'pcm_f32le'):
        raise ValueError('Export requires a lossless PCM source, never a compressed intermediate')
    encoder = shutil.which('oggenc')
    if encoder is None:
        raise RuntimeError('Install vorbis-tools (oggenc); this FFmpeg may lack libvorbis')
    # libvorbis does not accept 96/128 kbps mono at 24 kHz. Keep the lossless source unchanged.
    rate = int(stream['sample_rate'])
    target_rate = 48000 if rate < 44100 else rate
    temporary = destination.with_name(destination.stem + '.encoding.ogg')
    if temporary.exists():
        raise FileExistsError(temporary)
    try:
        subprocess.run([encoder, '-Q', '--resample', str(target_rate), '-b', str(bitrate),
                        '-o', str(temporary), str(source)], check=True)
        encoded, duration = probe(temporary)
        if encoded['codec_name'] != 'vorbis' or encoded['channels'] != 1:
            raise ValueError('Expected mono OGG Vorbis output')
        temporary.replace(destination)
        return dict(duration=duration, sampleRate=int(encoded['sample_rate']), bitrate=bitrate)
    finally:
        if temporary.exists():
            temporary.unlink()


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('destination', type=Path)
    parser.add_argument('--bitrate', type=int, choices=(64,96,128), default=96)
    args = parser.parse_args()
    print(json.dumps(export_vorbis(args.source,args.destination,args.bitrate)))
