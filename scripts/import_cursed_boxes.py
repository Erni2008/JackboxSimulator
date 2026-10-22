"""Preserve source geometry/materials, resize embedded runtime maps only. Originals stay untouched."""
import io,json,struct,pathlib
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[1]
out=root/'assets/cursed_boxes'
out.mkdir(exist_ok=True)
for source,target in [('box1.glb','intact.glb'),('box2.glb','damaged.glb'),('box3.glb','destroyed.glb'),('щепки1.glb','splinter_a.glb'),('щепки4.glb','splinter_b.glb')]:
 raw=(root/source).read_bytes();n=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+n]);binary=raw[28+n:];chunks=bytearray()
 images={im['bufferView'] for im in doc['images']}
 for i,view in enumerate(doc['bufferViews']):
  payload=binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]
  if i in images:
   im=Image.open(io.BytesIO(payload));im.thumbnail((1024,1024),Image.Resampling.LANCZOS);buf=io.BytesIO();im.save(buf,format='PNG');payload=buf.getvalue()
  while len(chunks)%4:chunks.append(0)
  view['byteOffset']=len(chunks);view['byteLength']=len(payload);chunks.extend(payload)
 while len(chunks)%4:chunks.append(0)
 doc['buffers'][0]['byteLength']=len(chunks);j=json.dumps(doc,separators=(',',':')).encode();j+=b' '*((-len(j))%4)
 result=struct.pack('<III',0x46546c67,2,28+len(j)+len(chunks))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(chunks),0x004e4942)+chunks
 (out/target).write_bytes(result)
for source,target in [('shelves5.png','shelf.png'),('ghost1.png','ghost_idle.png'),('ghost2.png','ghost_hit.png'),('ghost3.png','ghost_damaged.png'),('щепки3.png','debris_a.png'),('щепки5.png','debris_b.png')]:
 im=Image.open(root/source);im.thumbnail((1536,1536),Image.Resampling.LANCZOS);im.save(out/target)
print('Imported original art with bounded texture sizes; no geometry or alpha changes.')
