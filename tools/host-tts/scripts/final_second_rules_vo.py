"""Voice the THE FINAL SECOND rules film with the approved cloned host voice (same treatment as the SB pack)."""
import json,os,sys
from pathlib import Path
from narration import LocalWorker,TOOL,ROOT,validate
from system_breach_pack import treat,normalize

LINES=[
 "Добро пожаловать в последнюю секунду! Здесь важна каждая доля секунды.",
 "Задача простая. Остановите таймер точно на заданном времени!",
 "Нажали один раз, и время пошло. Нажали снова, и таймер встал!",
 "Но не всё так просто. В каждом раунде вас ждёт новое испытание!",
 "Кто окажется дальше всех от цели, тот выбывает!",
 "Ну что, готовы? Ловите последнюю секунду!",
]
SEEDS={0:7,1:7,2:42,3:7,4:42,5:42}
OUT=ROOT/'assets/final_second/rules';WORK=TOOL/'output/final-second-rules'

def main():
    cfg=TOOL/'config/system-breach.local.json';settings=json.loads((TOOL/'config/intro-treatment.json').read_text());settings['tailPaddingSeconds']=.22
    only={int(a) for a in sys.argv[1:]}
    OUT.mkdir(parents=True,exist_ok=True);WORK.mkdir(parents=True,exist_ok=True)
    with (WORK/'worker.log').open('a') as log:
        worker=LocalWorker(cfg,log)
        try:
            for i,text in enumerate(LINES):
                if only and i not in only:continue
                raw=WORK/f'rules_{i}.wav';treated=WORK/f'rules_{i}_treated.wav';final=OUT/f'rules_{i}.wav'
                for f in (raw,treated,final):
                    if f.exists():f.unlink()
                # sentence by sentence, joined with a natural breath between them
                import re,numpy as np,soundfile as sf
                parts=re.findall(r'[^.!?…]+[.!?…]+',text) or [text];chunks=[];sr=24000
                for k,part in enumerate(parts):
                    piece=WORK/f'rules_{i}_{k}.wav'
                    if piece.exists():piece.unlink()
                    worker.generate(part.strip(),piece,seed=int(os.environ.get('SEED',str(SEEDS.get(i,42)))),temperature=.6)
                    w,sr=sf.read(piece,dtype='float32');w=w if w.ndim==1 else w.mean(axis=1);nz=np.where(np.abs(w)>.01)[0]
                    if len(nz):w=w[max(0,nz[0]-int(sr*.02)):nz[-1]+int(sr*.06)]
                    chunks.append(w)
                    if k<len(parts)-1:chunks.append(np.zeros(int(sr*float(os.environ.get('PAUSE','.38'))),dtype=np.float32))
                sf.write(raw,np.concatenate(chunks),sr);validate(raw,text)
                treat(raw,treated,settings,text);normalize(treated,final)
                print(f'READY {i}: {validate(final,text):.2f}s',flush=True)
        finally:worker.close()

if __name__=='__main__':main()
