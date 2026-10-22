"""Preserve all eight original WAVs; remove near-silent pre-roll only from two runtime transients.
No resampling, normalization, pitch changes or render-time preprocessing.
"""
from pathlib import Path
import wave,struct,shutil,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/sounds/cursed_boxes';OUT.mkdir(parents=True,exist_ok=True)
NAMES=['shotgun_shoot_done.wav','reload_done.wav','773860__mrgungus__12-guage-shotgun-shell-drop.wav','box_destroy_done.wav','heart_beating_done.wav','reveal_sound2(done).wav','reveal_done.wav','reload_done(bullets).wav']
manifest=[]
for name in NAMES:
 source=ROOT/name
 shutil.copyfile(source,OUT/name)
 with wave.open(str(source),'rb') as w:
  params=w.getparams();pcm=w.readframes(w.getnframes())
  if params.sampwidth!=2 or params.comptype!='NONE':raise ValueError('Expected original 16-bit PCM: '+name)
  start=0;runtime=name
  if name in ['shotgun_shoot_done.wav','box_destroy_done.wav']:
   # -60 dBFS gates only initial near-silence; retain 5ms before its first nontrivial sample.
   samples=struct.iter_unpack('<'+'h'*params.nchannels,pcm)
   first=next((i for i,s in enumerate(samples) if max(abs(x) for x in s)>32),0)
   start=max(0,first-round(params.framerate*.005));runtime='runtime/'+name
   (OUT/'runtime').mkdir(exist_ok=True)
   with wave.open(str(OUT/runtime),'wb') as w:
    w.setparams(params);w.writeframes(pcm[start*params.nchannels*params.sampwidth:])
  manifest.append({'source':name,'playback':runtime,'removedFrames':start,'sampleRate':params.framerate,'removedMilliseconds':round(start/params.framerate*1000,3)})
(OUT/'preparation.json').write_text(json.dumps(manifest,indent=2)+'\n')
for entry in manifest:print(entry['source'],entry['removedMilliseconds'],'ms removed from runtime copy')
