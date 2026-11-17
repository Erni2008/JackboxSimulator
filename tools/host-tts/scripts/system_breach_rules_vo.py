"""Voice the SYSTEM BREACH rules film with the approved cloned host voice (same treatment as the SB pack)."""
import json,sys
from pathlib import Path
from narration import LocalWorker,TOOL,ROOT,validate
from system_breach_pack import treat,normalize

LINES=[
 "Добро пожаловать в систему. Сегодня каждый из вас — хакер.",
 "Отвечайте на вопросы — каждый верный ответ приносит вам души́.",
 "Взламывайте соперников: угадайте пароль — и заберите их души́ себе.",
 "Запустите Дэ-До́с — и у жертвы на десять секунд зависнут кнопки.",
 "Заражайте вирусами — ломайте экраны соперников.",
 "Защищайтесь: фаервол отбивает атаки, а приманка ловит самого хакера.",
 "У кого в конце больше всего душ — тот и победил. Готовы? Взламываем!",
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
                worker.generate(text,raw,seed=42,temperature=.6);validate(raw,text)
                treat(raw,treated,settings,text);normalize(treated,final)
                print(f'READY {i}: {validate(final,text):.2f}s',flush=True)
        finally:worker.close()

if __name__=='__main__':main()
