"""Precompute shufle.glb's lamp emissive mask (strongly red, bright base-colour texels) as small PNGs.
Run: python3 tools/assets/cursed_cards_glow.py  -> assets/models/cursed_cards/shufle_glow_{1024,512}.png
Same thresholds as DealerMachine's runtime fallback."""
import json,struct,io,os
import numpy as np
from PIL import Image
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'));D=os.path.join(ROOT,'assets/models/cursed_cards')
raw=open(os.path.join(ROOT,'source_assets/models/cursed_cards/shufle.glb'),'rb').read();n=struct.unpack_from('<I',raw,12)[0];j=json.loads(raw[20:20+n]);binary=raw[28+n:]
t=j['materials'][0]['pbrMetallicRoughness']['baseColorTexture']['index'];v=j['bufferViews'][j['images'][j['textures'][t]['source']]['bufferView']]
src=Image.open(io.BytesIO(binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])).convert('RGB')
for size in (1024,512):
    a=np.asarray(src.resize((size,size),Image.BILINEAR)).astype(np.float32)/255;r,g,b=a[...,0],a[...,1],a[...,2]
    w=np.clip((r-np.maximum(g,b)-.34)*5,0,1)*np.clip((r-.55)*5,0,1)
    out=np.stack([r*w,g*w*.6,b*w*.6],-1);Image.fromarray((out*255+.5).astype(np.uint8)).save(os.path.join(D,'shufle_glow_%d.png'%size),optimize=True)
    print(size,int((w>0).sum()),'lit texels')
