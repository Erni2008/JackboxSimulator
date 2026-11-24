"""Voice the RARE MINDS host lines with the approved cloned host voice (same treatment as the Final Second rules).
Run with the QwenTTS venv while the model drive is mounted:  python rare_minds_vo.py  [cue_index ...]
Output: assets/rare_minds/voice/ru/<cue>_<n>.wav (the host screen picks a random take)."""
import json,os,sys,re
from narration import LocalWorker,TOOL,ROOT,validate
from system_breach_pack import treat,normalize

LINES={
 'look':["Так, посмотрим, что вы тут написали!","Ну что ж, посмотрим, что вы тут понаписали!","Итак, открываем ваши ответы!"],
 'points':["А теперь раздаём души!","Самое время подсчитать души!"],
}
OUT=ROOT/'assets/rare_minds/voice/ru';WORK=TOOL/'output/rare-minds'

def main():
    import numpy as np,soundfile as sf
    cfg=TOOL/'config/system-breach.local.json';settings=json.loads((TOOL/'config/intro-treatment.json').read_text());settings['tailPaddingSeconds']=.22
    OUT.mkdir(parents=True,exist_ok=True);WORK.mkdir(parents=True,exist_ok=True)
    with (WORK/'worker.log').open('a') as log:
        worker=LocalWorker(cfg,log)
        try:
            for cue,lines in LINES.items():
                for i,text in enumerate(lines):
                    raw=WORK/f'{cue}_{i}.wav';treated=WORK/f'{cue}_{i}_treated.wav';final=OUT/f'{cue}_{i}.wav'
                    for f in (raw,treated,final):
                        if f.exists():f.unlink()
                    worker.generate(text,raw,seed=int(os.environ.get('SEED','42')),temperature=.6)
                    validate(raw,text);treat(raw,treated,settings,text);normalize(treated,final)
                    print(f'READY {cue}_{i}: {validate(final,text):.2f}s',flush=True)
        finally:worker.close()

if __name__=='__main__':main()
