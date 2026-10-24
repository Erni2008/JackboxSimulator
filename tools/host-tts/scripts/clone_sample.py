"""Local, reference-only Qwen Base cloning. Run with QwenTTS's Python environment."""
import argparse
import fcntl
import hashlib
import json
import os
import shutil
from pathlib import Path
import time
from audio_export import export_vorbis


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, required=True)
    parser.add_argument('--text', required=True)
    parser.add_argument('--output', type=Path, required=True, help='Output basename, without extension')
    args = parser.parse_args()
    # A second invocation must not load another GPU model or race the output files.
    lock = (Path(__file__).resolve().parents[1]/'config/generation.lock').open('a')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        raise RuntimeError('Another host voice generation is already running') from None
    config = json.loads(args.config.read_text())
    bitrate = config.get('bitrate', 96)
    if bitrate not in (64, 96, 128):
        raise ValueError('Supported bitrates: 64, 96, 128')
    for executable in ('ffmpeg','ffprobe','oggenc'):
        if shutil.which(executable) is None:
            raise RuntimeError(f'Missing required export tool: {executable}')
    model_path = Path(config['model']).expanduser().resolve(strict=True)
    model_config = json.loads((model_path / 'config.json').read_text())
    if model_config.get('tts_model_type') != 'base':
        raise ValueError('Only the approved reference-based Base model is allowed')
    reference = Path(config['reference']).resolve(strict=True)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    wav, ogg = args.output.with_suffix('.wav'), args.output.with_suffix('.ogg')
    if wav.exists() or ogg.exists():
        raise FileExistsError('Choose a new output name; existing samples are never overwritten')
    os.environ['HF_HUB_OFFLINE'] = '1'
    os.environ['TRANSFORMERS_OFFLINE'] = '1'
    import mlx.core as mx
    import numpy as np
    import soundfile as sf
    from mlx_audio.tts.utils import load_model

    audio, rate = sf.read(reference, dtype='float32')
    if audio.ndim != 1 or rate != 24000 or len(audio) < rate:
        raise ValueError('Reference must be mono 24 kHz speech, at least one second')
    if not np.isfinite(audio).all() or np.max(np.abs(audio)) >= .999:
        raise ValueError('Invalid or clipped reference audio')
    transcript = None
    if config.get('transcript'):
        transcript = Path(config['transcript']).read_text().strip()
        if not transcript or not config.get('transcriptApproved', False):
            raise ValueError('ICL requires an explicitly verified exact transcript')
    started = time.monotonic()
    mx.random.seed(config.get('seed', 42))
    print('Loading existing local Base model; no model downloads.', flush=True)
    model = load_model(model_path)
    if model.speaker_encoder is None:
        raise ValueError('Model has no speaker encoder; reference cloning cannot proceed')
    chunks = []
    for result in model.generate(text=args.text, ref_audio=mx.array(audio), ref_text=transcript,
                                 lang_code=config['language'], temperature=config.get('temperature', .6),
                                 max_tokens=config.get('maxTokens', 600), verbose=False):
        chunks.append(np.asarray(result.audio).reshape(-1))
    if not chunks:
        raise ValueError('Generation returned no audio')
    output = np.concatenate(chunks)
    duration = len(output) / model.sample_rate
    peak = float(np.max(np.abs(output)))
    if not np.isfinite(output).all() or not .5 <= duration <= 45 or peak < .0001:
        raise ValueError(f'Invalid generated audio: duration={duration}, peak={peak}')
    sf.write(wav, output, model.sample_rate, subtype='PCM_16')
    export = export_vorbis(wav, ogg, bitrate)
    report = dict(voiceId=config['voiceId'], text=args.text, status='needs_manual_voice_approval',
                  referenceSha256=hashlib.sha256(reference.read_bytes()).hexdigest(),
                  model=str(model_path), mode='icl' if transcript else 'speaker_embedding',
                  duration=duration, sampleRate=model.sample_rate, peak=peak,
                  clippedSamples=int(np.count_nonzero(np.abs(output) >= 1)),
                  elapsedSeconds=time.monotonic()-started, export=export,
                  wav=str(wav.resolve()), ogg=str(ogg.resolve()))
    args.output.with_suffix('.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(report, ensure_ascii=False, indent=2), flush=True)


if __name__ == '__main__':
    main()
