"""Persistent local Base-model worker. JSON-lines is a tooling protocol, never game networking."""
import contextlib
import json
import os
from pathlib import Path
import sys

os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'


def main():
    config = json.loads(Path(sys.argv[1]).read_text())
    with contextlib.redirect_stdout(sys.stderr):
        import mlx.core as mx
        import numpy as np
        import soundfile as sf
        from mlx_audio.tts.utils import load_model
        model_path = Path(config['model']).resolve(strict=True)
        if json.loads((model_path/'config.json').read_text()).get('tts_model_type') != 'base':
            raise ValueError('Voice Clone requires the approved Base model')
        if not config.get('voiceApproved') or not config.get('transcriptApproved'):
            raise ValueError('Batch generation requires an approved voice and exact transcript')
        transcript = Path(config['transcript']).read_text().strip()
        reference, rate = sf.read(config['reference'], dtype='float32')
        if not transcript or reference.ndim != 1 or rate != 24000 or not np.isfinite(reference).all():
            raise ValueError('Invalid reference/transcript')
        model = load_model(model_path)
        if model.speaker_encoder is None or not model.speech_tokenizer.has_encoder:
            raise ValueError('Installed model does not support the required ICL workflow')
        reference = mx.array(reference)
    print(json.dumps({'ready': True}), flush=True)
    for line in sys.stdin:
        try:
            request = json.loads(line)
            with contextlib.redirect_stdout(sys.stderr):
                mx.random.seed(config.get('seed', 42))
                chunks = [np.asarray(part.audio).reshape(-1) for part in model.generate(
                    text=request['text'], ref_audio=reference, ref_text=transcript,
                    lang_code=config['language'], temperature=config.get('temperature', .6),
                    max_tokens=config.get('maxTokens', 1024), verbose=False)]
                if not chunks:
                    raise ValueError('Empty model output')
                audio = np.concatenate(chunks)
                if not np.isfinite(audio).all():
                    raise ValueError('Non-finite model output')
                sf.write(request['output'], audio, model.sample_rate, subtype='PCM_16')
            print(json.dumps({'ok': True}), flush=True)
        except Exception as error:
            print(json.dumps({'error': str(error)}), flush=True)


if __name__ == '__main__':
    main()
