"""Voice the SYSTEM BREACH rules film with the approved cloned host voice (same treatment as the SB pack)."""
import json,os,sys
from pathlib import Path
from narration import LocalWorker,TOOL,ROOT,validate
from system_breach_pack import treat,normalize

LINES=[
 "Добро пожаловать в систему! Сегодня каждый из вас — хакер.",
 "Отвечайте на вопросы! Каждый верный ответ приносит вам ду ши.",
 "Взламывайте соперников! Угадайте пароль — и заберите их ду ши себе!",
 "Запустите дэ дос — и у жертвы на десять секунд зависнут кнопки!",
 "Заражайте вирусами! Ломайте экраны соперников!",
 "А теперь — защищайтесь! Фаервол отбивает атаки, а приманка ловит самого хакера.",
 "У кого в конце больше всего душ — тот и победил. Ну что, готовы? Тогда взламываем!",
]
OUT=ROOT/'assets/system_breach/rules';WORK=TOOL/'output/system-breach-rules'

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
                worker.generate(text,raw,seed=int(os.environ.get('SEED',str({0:21,1:7,2:7,3:7,4:21,5:7,6:7}[i]))),temperature=.6);validate(raw,text)
                treat(raw,treated,settings,text);normalize(treated,final)
                print(f'READY {i}: {validate(final,text):.2f}s',flush=True)
        finally:worker.close()

if __name__=='__main__':main()
