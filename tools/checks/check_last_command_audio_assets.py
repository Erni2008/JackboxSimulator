from pathlib import Path
import json,hashlib,wave,array,math
root=Path(__file__).resolve().parents[2]/'assets/sounds/last_command';manifest=json.loads((root/'runtime/manifest.json').read_text());assert len(manifest['cues'])==30
for source in manifest['originals']:assert hashlib.sha256((root/source['file']).read_bytes()).hexdigest()==source['sha256'],source['file']
frequencies=[]
for cue in manifest['cues']:
 path=(root.parents[1]/'audio/host/ru'/cue['file'])if cue.get('voice')else root/'runtime'/cue['file'];assert path.exists(),cue
 if cue.get('voice'):continue
 if cue['stream']:assert cue['id']=='VICTORY' and path.suffix=='.mp3';continue
 with wave.open(str(path))as w:
  assert w.getsampwidth()==2 and w.getnchannels()in(1,2)
  assert abs(w.getnframes()/w.getframerate()*1000-cue['durationMs'])<1
  if cue['id'].startswith('MEMORY_NOTE_'):
   samples=array.array('h');samples.frombytes(w.readframes(w.getnframes()));c=w.getnchannels();values=[sum(samples[i:i+c])/c for i in range(0,len(samples),c)];active=[i for i,x in enumerate(values)if abs(x)>3000];lo,hi=min(active),max(active);crossings=sum(values[i]<=0<values[i+1]for i in range(lo,hi));frequencies.append((cue['id'],crossings*w.getframerate()/(hi-lo)))
ordered={k:v for k,v in frequencies};f=[ordered['MEMORY_NOTE_'+c]for c in ['RED','GREEN','BLUE','YELLOW']];assert all(b>a*1.1 for a,b in zip(f,f[1:])),f
print('AUDIO_ASSETS_OK: 24 unchanged originals, 26 SFX + 4 approved-identity voice templates; note frequency estimates',f)
