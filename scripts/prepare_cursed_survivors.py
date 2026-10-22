"""Offline, lossless survivor preparation. No segmentation, repainting, or invented anatomy.
Front triangles are partitioned, never duplicated. Rigs deform original alpha-bearing art.
"""
from pathlib import Path
import json,struct,copy,shutil
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/cursed_boxes/survivors';OUT.mkdir(exist_ok=True)
for name in ('intact','damaged','destroyed'):
 raw=(ROOT/f'assets/cursed_boxes/{name}.glb').read_bytes();n=struct.unpack_from('<I',raw,12)[0]
 doc=json.loads(raw[20:20+n]);binary=bytearray(raw[28+n:])
 def accessor(i):
  a=doc['accessors'][i];v=doc['bufferViews'][a['bufferView']]
  dtype={5126:'<f4',5125:'<u4',5123:'<u2'}[a['componentType']]
  return np.frombuffer(binary,dtype=dtype,count=a['count']*{'VEC3':3,'SCALAR':1}[a['type']],offset=v.get('byteOffset',0)+a.get('byteOffset',0)).copy()
 prim=doc['meshes'][0]['primitives'][0];pos=accessor(prim['attributes']['POSITION']).reshape(-1,3);idx=accessor(prim['indices']).reshape(-1,3)
 # Authored node is rotated +90deg about X: local +Y is world +Z (toward camera).
 # A thin front slab, including its small side surfaces, is distinct from the four walls/back.
 front=(pos[idx][:,:,1].min(axis=1)>pos[:,1].max()-.075)
 assert front.any() and (~front).any()
 def indices(values):
  while len(binary)%4:binary.append(0)
  data=values.astype('<u2').tobytes();view=len(doc['bufferViews']);doc['bufferViews'].append({'buffer':0,'byteOffset':len(binary),'byteLength':len(data),'target':34963});binary.extend(data)
  ai=len(doc['accessors']);doc['accessors'].append({'bufferView':view,'componentType':5123,'count':values.size,'type':'SCALAR'});return ai
 panelmat=copy.deepcopy(doc['materials'][prim['material']]);panelmat['name']='SurvivorFront';panelmat['alphaMode']='BLEND';doc['materials'].append(panelmat)
 wall=copy.deepcopy(prim);wall['indices']=indices(idx[~front]);panel=copy.deepcopy(prim);panel['indices']=indices(idx[front]);panel['material']=len(doc['materials'])-1
 doc['meshes'][0]['primitives']=[wall,panel]
 while len(binary)%4:binary.append(0)
 doc['buffers'][0]['byteLength']=len(binary);j=json.dumps(doc,separators=(',',':')).encode();j+=b' '*(-len(j)%4)
 (OUT/f'{name}_split.glb').write_bytes(struct.pack('<III',0x46546c67,2,28+len(j)+len(binary))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(binary),0x004e4942)+binary)
 print(name,'frame/front triangles',int((~front).sum()),int(front.sum()),'conserved',len(idx))
# Reviewed source-specific neck, shoulder/elbow/hip anchors in cropped-image coordinates, Y up.
profiles={
 'GHOST':('ghost.png',[[.5,.48],[.5,.72],[.25,.68],[.17,.52],[.76,.65],[.84,.50],[.43,.27],[.60,.27]],False),
 'DRACULA':('vampir.png',[[.5,.40],[.52,.70],[.35,.61],[.26,.43],[.72,.60],[.78,.62],[.45,.28],[.64,.28]],True),
 'PLAGUE_DOCTOR':('cumnoidoktor.png',[[.50,.40],[.52,.67],[.31,.57],[.24,.43],[.71,.56],[.77,.43],[.43,.26],[.60,.26]],True),
 'SKELETON':('skeleton.png',[[.50,.39],[.54,.71],[.36,.64],[.24,.65],[.69,.59],[.76,.42],[.44,.28],[.60,.28]],True),
 'PUMPKIN':('pumpkin.png',[[.50,.34],[.51,.61],[.31,.49],[.21,.37],[.72,.49],[.78,.36],[.43,.23],[.62,.23]],True)
}
rigs=[]
for identity,(source,pivots,legs) in profiles.items():
 im=Image.open(ROOT/source).convert('RGBA');assert im.getchannel('A').getextrema()[0]==0
 bounds=im.getchannel('A').getbbox();shutil.copyfile(ROOT/source,OUT/f'{identity.lower()}.png')
 rigs.append({'id':identity,'texture':f'cursed_boxes/survivors/{identity.lower()}.png','bounds':list(bounds),'pivots':[v for p in pivots for v in p],'legs':legs,'parents':[-1,0,0,2,0,4,0,0],'order':[3,7,1,4,2,5,0,0]})
(OUT/'rigs.json').write_text(json.dumps({'rigs':rigs},indent=2)+'\n')
for source,target in [('smoke1.png','cursed_smoke.png'),('smoke2.png','cursed_glow.png')]:
 im=Image.open(ROOT/source);assert im.mode=='RGBA' and im.getchannel('A').getextrema()[0]==0
 shutil.copyfile(ROOT/source,ROOT/'assets/cursed_boxes/effects'/target)
print('Copied five intact portraits and two VFX PNGs unchanged; preserved source alpha and all original files.')
