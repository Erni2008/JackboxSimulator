"""Preserve supplied recordings, write libGDX-compatible PCM16 copies and approved pitch variants."""
from pathlib import Path
import struct,array,wave,json,hashlib,shutil,argparse
ROOT=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source',type=Path,default=Path('/Users/erni/Desktop/candles/2game/sounds/3-rd game/sounds/THE_LAST_COMMAND_AUDIO'))
SOURCE=parser.parse_args().source
OUT=ROOT/'assets/sounds/last_command'; RUNTIME=OUT/'runtime';RUNTIME.mkdir(parents=True,exist_ok=True)
def read(path):
 b=path.read_bytes();at=12;fmt=data=None
 assert b[:4]==b'RIFF' and b[8:12]==b'WAVE'
 while at+8<=len(b):
  tag,n=struct.unpack_from('<4sI',b,at);chunk=b[at+8:at+8+n];at+=8+n+(n%2)
  if tag==b'fmt ':fmt=chunk
  if tag==b'data':data=chunk
 code,channels,rate,_,align,bits=struct.unpack_from('<HHIIHH',fmt)
 if code==65534:code=struct.unpack_from('<I',fmt,24)[0]
 if code==3 and bits==32:
  values=array.array('f');values.frombytes(data);values=list(values)
 elif code==1 and bits==16:
  values=array.array('h');values.frombytes(data);values=[x/32768 for x in values]
 elif code==1 and bits==24:values=[int.from_bytes(data[i:i+3],'little',signed=True)/8388608 for i in range(0,len(data),3)]
 else:raise ValueError((path,code,bits))
 return channels,rate,values

def write(name,c,r,values):
 pcm=array.array('h',(max(-32768,min(32767,round(x*32767))) for x in values))
 with wave.open(str(RUNTIME/name),'wb')as w:w.setnchannels(c);w.setsampwidth(2);w.setframerate(r);w.writeframes(pcm.tobytes())
 return len(values)/c/r
originals=[];durations={}
for p in sorted(SOURCE.iterdir()):
 if p.suffix.lower()not in ('.wav','.mp3') or p.name=='typing_question2.mp3':continue
 shutil.copy2(p,OUT/p.name);originals.append({'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size})
 if p.suffix=='.wav':
  c,r,v=read(p);durations[p.name]=write(p.name,c,r,v)
 else:shutil.copy2(p,RUNTIME/p.name)
c,r,v=read(SOURCE/'1 to 4 sound(appearing sequence).wav');notes=[]
for color,pitch in [('red',1),('green',2**(4/12)),('blue',2**(7/12)),('yellow',2)]:
 frames=len(v)//c;values=[]
 for i in range(int(frames/pitch)):
  pos=i*pitch;j=int(pos);f=pos-j
  for channel in range(c):values.append(v[j*c+channel]*(1-f)+v[min(frames-1,j+1)*c+channel]*f)
 peak=max(abs(x)for x in values)or 1;values=[x*.8/peak for x in values]
 name='memory_note_'+color+'.wav';durations[name]=write(name,c,r,values);notes.append({'file':name,'pitch':pitch,'duration':durations[name]})
# id, actual source filename, gain, priority (0 environment .. 4 victory), throttle ms
cues=[('BUTTON_PRESS','button_pressed.wav',.65,2,60),('SMALL_BUTTON_CLICK','small_button_click.wav',.45,2,45),('LEVER_MOVE','lever.wav',.55,2,100),('ROTARY_STEP','adjuster.wav',.45,2,65),('HATCH_OPEN','door_open.wav',.6,2,200),('METAL_CREAK','second_metal_cracking.wav',.18,0,18000),('METAL_CRACK','metal_cracking.wav',.24,0,25000),('ANSWER_CORRECT','Success2.wav',.6,3,0),('ANSWER_WRONG','wrong_answer.wav',.6,3,0),('VICTORY','success.mp3',.7,4,0),('CIRCUIT_ROTATE','wires1.wav',.75,2,75),('CIRCUIT_FAILED','failed.circuit.wav',.75,2,0),('CIRCUIT_COMPLETE','electrical_circuit_done.wav',.85,2,0),('MACHINE_SHUTDOWN','machine_shutdown .wav',.6,3,0)]
for color in ['red','green','blue','yellow']:cues.append(('MEMORY_NOTE_'+color.upper(),'memory_note_'+color+'.wav',.5,2,0))
cues.extend([('QUESTION_TYPING','question_typing.wav',.2,1,0),('QUESTION_TYPING_ALT','questiontyping2.wav',.2,1,0),('CONFIRM','confirm_button.wav',.5,2,60),('SYMBOL_WRONG','wrong_symbol_chosen.wav',.6,3,0),('HATCH_CLOSE','metal_DOOR_CLOSE.wav',.55,2,100),('SYMBOL_CLICK','symbol_clicked.wav',.4,2,45),('SYMBOL_APPEAR','symbol_appear.wav',.3,1,80),('SCREEN_TRANSITION','transition_screen.wav',.35,1,100)])
manifest={'version':1,'notes':{'source':'1 to 4 sound(appearing sequence).wav','sourceDuration':len(v)/c/r,'method':'User-approved pitch variants of a single pulse; not four extracted original tones','variants':notes},'originals':originals,'cues':[{'id':i,'file':f,'durationMs':round(durations.get(f,0)*1000),'volume':gain,'priority':priority,'throttleMs':ms,'stream':f.endswith('.mp3')}for i,f,gain,priority,ms in cues]}
host=json.loads((ROOT/'assets/audio/host/ru/manifest.json').read_text())
manifest['voiceId']=host['voiceId']
for color in ['RED','GREEN','BLUE','YELLOW']:
 id='PRESS_'+color;entry=host['events'].get(id)
 if entry and entry['status']=='ready':manifest['cues'].append({'id':id,'file':entry['file'],'url':'/last-command-3d/voice/'+id,'durationMs':round(entry['duration']*1000),'volume':.8,'priority':3,'throttleMs':0,'stream':False,'voice':True})
(RUNTIME/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('PREPARED',len(originals),'originals,',len(cues),'cues; four approved pitch variants')
