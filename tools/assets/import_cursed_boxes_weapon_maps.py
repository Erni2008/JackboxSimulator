"""Bound tiny weapon-part textures only. Meshes, nodes, animation and originals remain unchanged."""
import io,json,struct
from pathlib import Path
from PIL import Image
root=next(p for p in Path(__file__).resolve().parents if (p / 'settings.gradle').is_file())
out=root/'assets/cursed_boxes/shotgun';out.mkdir(parents=True,exist_ok=True)
for name in ('shotgun_bolt.glb','shotgun_shell.glb'):
 raw=(root/'assets/models/shotgun'/name).read_bytes();n=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+n]);binary=raw[28+n:];chunks=bytearray()
 images={im['bufferView']for im in doc['images']}
 for i,view in enumerate(doc['bufferViews']):
  payload=binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]
  if i in images:
   im=Image.open(io.BytesIO(payload));im.thumbnail((1024,1024),Image.Resampling.LANCZOS);buf=io.BytesIO();im.save(buf,format='PNG');payload=buf.getvalue()
  while len(chunks)%4:chunks.append(0)
  view['byteOffset']=len(chunks);view['byteLength']=len(payload);chunks.extend(payload)
 while len(chunks)%4:chunks.append(0)
 doc['buffers'][0]['byteLength']=len(chunks);j=json.dumps(doc,separators=(',',':')).encode();j+=b' '*((-len(j))%4)
 (out/name).write_bytes(struct.pack('<III',0x46546c67,2,28+len(j)+len(chunks))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(chunks),0x004e4942)+chunks)
 print(name,'copied source geometry; texture cap 1024; bytes',len(chunks))
