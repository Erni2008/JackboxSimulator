"""Register existing mechanisms to the measured openings of the user's computer.glb.
Only placements change. The original GLBs and the canonical interactive CRT stay intact.
"""
from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parents[2];ASSETS=ROOT/'assets/models/last_command'
assert hashlib.sha256((ROOT/'computer.glb').read_bytes()).hexdigest()=='7ddaf6d823f67ebdb9e2670540df7e1de0000e3e4a426984f1c9fa3a51ac558d','New source requires opening measurements before fitting'
S=.9266
P=(-.003-.00775*S,.495-.53125*S,.116-.15701015293598175*S-.002)
def point(x,y,z):return dict(zip(('x','y','z'),(x*S+P[0],y*S+P[1],z*S+P[2])))
def read(name):return json.loads((ASSETS/(name+'.json')).read_text())
def save(name,value):(ASSETS/(name+'.json')).write_text(json.dumps(value,indent=2)+'\n')
a=read('assembly');p=read('panel');m=read('mechanisms')
a['body']['position']=dict(zip(('x','y','z'),P));a['body']['scale']={axis:S for axis in ('x','y','z')};a['body']['rotation']={'x':0,'y':0,'z':0}
# Match the old collar's front to the authored socket lip, not its recessed back wall.
big=point(.007,.284,.24012203514575958)
a['base']['position']={**big,'z':big['z']+.003-.36774406*.145};a['base']['rotation']={'x':90,'y':0,'z':0}
a['cap']['position']={**a['base']['position'],'z':a['base']['position']['z']+.021};a['cap']['rotation']={'x':90,'y':0,'z':0}
anchors=[(-.1713,.2656,.2355849147),(-.1713,.1962,.2360702157),(.187,.2656,.2356892228),(.187,.1962,.2358760238)]
for mount,(x,y,z) in zip(p['buttons'],anchors):
 mount['scale']={axis:.031 for axis in ('x','y','z')};mount['rotation']={'x':90,'y':0,'z':0};mount['position']=point(x,y,z);mount['position']['z']+=.003-(.7487801-mount['pivot']['y'])*.031
p['adjuster']['position']=point(-.17155,.3413,.2357673198);p['adjuster']['position']['z']+=.013-(.95651114-p['adjuster']['pivot']['y'])*.044;p['adjuster']['rotation']={'x':90,'y':0,'z':0}
p['light']['position']=point(.187,.3413,.2357145101);p['light']['position']['z']+=.008-.5453585352*.06;p['light']['rotation']={'x':90,'y':0,'z':55}
blank=point(.0089,.718,.1926261187)
m['code']['position']={'x':-.003,'y':blank['y']-.5249321*.14/2,'z':blank['z']+.260728*.1+.0015}
for name,value in [('assembly',a),('panel',p),('mechanisms',m)]:save(name,value)
save('computer-layout',{'source':'computer.glb','sourceSha256':hashlib.sha256((ROOT/'computer.glb').read_bytes()).hexdigest(),'uniformScale':S,'translation':dict(zip(('x','y','z'),P)),'crt':{'center':{'x':-.003,'y':.495,'z':.116},'width':.278,'height':.165,'clearance':.002},'sockets':{'big':big,'buttons':[mount['position']for mount in p['buttons']],'adjuster':p['adjuster']['position'],'light':p['light']['position']}})
print('COMPUTER_LAYOUT_FITTED',P)
