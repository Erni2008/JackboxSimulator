"""Voice the SYSTEM BREACH rules film with ESpeech-TTS (Russian F5-TTS, Apache-2.0) cloned from the host reference.
Stress: RUAccent places '+' marks, then the manual overrides below win. Run with ~/Desktop/RuTTS/.venv/bin/python.
Env: HF_HOME=/Volumes/WindowsVM/AI_MODELS/ru_tts/hf. Args: optional line indices."""
import os,sys,subprocess
from pathlib import Path
import soundfile as sf
ROOT=Path(__file__).resolve().parents[3];MODEL=Path('/Volumes/WindowsVM/AI_MODELS/ru_tts/espeech')
REF=ROOT/'tools/host-tts/reference/host_ru_icl_reference.wav';REF_TEXT=(ROOT/'tools/host-tts/reference/host_ru_reference.txt').read_text().strip()
OUT=ROOT/'assets/system_breach/rules_espeech';WORK=ROOT/'tools/host-tts/output/espeech-rules'
LINES=[
 "Добро пожаловать в систему. Сегодня каждый из вас — хакер.",
 "Отвечайте на вопросы — каждый верный ответ приносит вам души.",
 "Взламывайте соперников: угадайте пароль — и заберите их души себе.",
 "Запустите DDoS — и у жертвы на десять секунд зависнут кнопки.",
 "Заражайте вирусами — ломайте экраны соперников.",
 "Защищайтесь: фаервол отбивает атаки, а приманка ловит самого хакера.",
 "У кого в конце больше всего душ — тот и победил. Готовы? Взламываем!",
]
# words the user fixed by ear; applied after RUAccent
OVERRIDE={"д+уши":"душ+и","DDoS":"д+э д+ос","Взл+амываем":"Взлам+ываем","Взл+амывайте":"Взлам+ывайте"," ловит ":" л+овит "," н+а ":" на "}

def main():
    from ruaccent import RUAccent
    from f5_tts.infer.utils_infer import infer_process,load_model,load_vocoder,preprocess_ref_audio_text
    from f5_tts.model import DiT
    # ruaccent's out-of-dictionary model needs token_type_ids that its tokenizer no longer returns
    import numpy as np,ruaccent.accent_model as am
    _run=None
    def put(self,word,_orig=am.AccentModel.put_accent):
        sess=self.session
        if not hasattr(sess,'_patched'):
            real=sess.run
            def run(names,inputs,_r=real):
                if 'token_type_ids' not in inputs:inputs=dict(inputs,token_type_ids=np.zeros_like(inputs['input_ids']))
                return _r(names,inputs)
            class S:pass
            w=S();w.run=run;w.get_outputs=sess.get_outputs;w._patched=True;self.session=w
        return _orig(self,word)
    am.AccentModel.put_accent=put
    acc=RUAccent();acc.load(omograph_model_size='turbo3.1',use_dictionary=True,tiny_mode=False)
    model=load_model(DiT,dict(dim=1024,depth=22,heads=16,ff_mult=2,text_dim=512,conv_layers=4),str(MODEL/'espeech_tts_rlv2.pt'),vocab_file=str(MODEL/'vocab.txt'))
    vocoder=load_vocoder()
    ref_audio,ref_text=preprocess_ref_audio_text(str(REF),acc.process_all(REF_TEXT))
    only={int(a) for a in sys.argv[1:]};OUT.mkdir(parents=True,exist_ok=True);WORK.mkdir(parents=True,exist_ok=True)
    for i,line in enumerate(LINES):
        if only and i not in only:continue
        text=OVERRIDE["DDoS"].join(acc.process_all(part) if part.strip() else part for part in line.split("DDoS"))
        for a,b in OVERRIDE.items():text=text.replace(a,b)
        print(i,text,flush=True)
        wav,sr,_=infer_process(ref_audio,ref_text,text,model,vocoder,nfe_step=48,speed=.95,cross_fade_duration=.15)
        raw=WORK/f'rules_{i}.wav';sf.write(raw,wav,sr)
        final=OUT/f'rules_{i}.wav'
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af','silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.2,loudnorm=I=-18:TP=-1.5:LRA=9','-ar','24000','-ac','1',str(final)],check=True)
        print(f'READY {i}: {sf.info(final).duration:.2f}s',flush=True)

if __name__=='__main__':main()
