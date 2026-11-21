"""One natural utterance per shot; clean local host voice, measured conversational edit with breathing room between chapters."""
import json, subprocess, math, sys
from pathlib import Path
from narration import LocalWorker, ROOT, TOOL, validate
p=ROOT/'web3d/src/games/race/intro-script.json';script=json.loads(p.read_text())
work=TOOL/'output/race-intro-short';work.mkdir(parents=True,exist_ok=True)
entries=[b for b in script['beats'] if b['clip']!='format']+list(script['formats'].values())
durations={}
with (work/'worker.log').open('a') as log:
 worker=LocalWorker(TOOL/'config/system-breach.local.json',log)
 try:
  for b in entries:
   raw=work/(b['clip']+'.wav');out=ROOT/'web/race/audio'/(b['clip']+'.m4a')
   if '--only-common' in sys.argv and not b['clip'].startswith('short_'):
    durations[b['clip']]=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(out)]));continue
   worker.generate(b['text'],raw,seed=42,temperature=.5)
   validate(raw,b['text'])
   subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af','silenceremove=start_periods=1:start_duration=0.025:start_silence=0.06:start_threshold=-48dB,areverse,silenceremove=start_periods=1:start_duration=0.04:start_silence=0.1:start_threshold=-48dB,areverse,highpass=f=70,loudnorm=I=-17:TP=-1.5:LRA=9','-c:a','aac','-b:a','160k',str(out)],check=True)
   durations[b['clip']]=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(out)]))
   print('READY',b['clip'],round(durations[b['clip']],2),flush=True)
 finally:worker.close()
t=1.0
for b in script['beats']:
 b['at']=round(t,3)
 d=max(durations[x['clip']] for x in script['formats'].values()) if b['clip']=='format' else durations[b['clip']]
 t+=d+b.get('pauseAfter',.65)
script['duration']=round(t+.2,3)
max_format=max(durations[b['clip']] for b in script['formats'].values())
lines=[]
for key,b in script['formats'].items():
 b['duration']=durations[b['clip']]
 b['filmDuration']=round(script['duration']-max_format+b['duration'],3)
 lines.append(f"{key}={round(b['filmDuration']*1000)}")
(ROOT/'server/src/main/resources/race-intro.properties').write_text('# Generated measured narration (milliseconds).\n'+'\n'.join(lines)+'\n')
p.write_text(json.dumps(script,ensure_ascii=False,indent=2)+'\n')
(work/'timing.json').write_text(json.dumps(durations,indent=2)+'\n')
print('FILM DURATION',script['duration'],flush=True)
