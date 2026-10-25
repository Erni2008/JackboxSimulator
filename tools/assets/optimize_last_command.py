"""Reproducible, non-destructive glTF 2.0 copies. Requires Pillow/numpy and gltfpack 1.3.
No mesh compression/quantization extensions. Named nodes/materials retained; ushort partitions.
Run GLTFPACK=/path/to/gltfpack python3 tools/assets/optimize_last_command.py
"""
from pathlib import Path
import os, json, struct, hashlib, subprocess, tempfile, io
from PIL import Image
import numpy as np
import prepare_last_command as partition
ROOT=Path(__file__).resolve().parents[2]
DEST=ROOT/'assets/models/last_command'
NAMES=['box_final','hole_final','button','adjuster','light','level_handler','lever','secret_hole','door','code_display']
def read(path):
    raw=path.read_bytes(); n=struct.unpack_from('<I',raw,12)[0]
    return json.loads(raw[20:20+n]),raw[28+n:]
def write(path,d,b):
    b+=b'\0'*(-len(b)%4);d['buffers']=[{'byteLength':len(b)}]
    j=json.dumps(d,separators=(',',':')).encode();j+=b' '*(-len(j)%4)
    path.write_bytes(struct.pack('<III',0x46546c67,2,28+len(j)+len(b))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(b),0x004e4942)+b)
def stats(path):
    d,b=read(path)
    return {'bytes':path.stat().st_size,'triangles':sum(d['accessors'][p['indices']]['count']//3 for m in d['meshes'] for p in m['primitives']), 'primitives':sum(len(m['primitives']) for m in d['meshes']), 'maps':[list(Image.open(io.BytesIO(b[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])).size) for im in d.get('images',[]) for v in [d['bufferViews'][im['bufferView']]]], 'extensions':d.get('extensionsRequired',[])}
def main():
    manifest=[]
    previous=json.loads((DEST/"optimization.json").read_text()) if (DEST/"optimization.json").exists() else []
    cached={(e["name"],e["profile"]):e for e in previous}
    with tempfile.TemporaryDirectory(prefix='tlc-opt-') as temp:
        temp=Path(temp)
        for name in NAMES:
            source=ROOT/(name+'.glb')
            if not source.exists():source=DEST/(name+'.glb')
            digest=hashlib.sha256(source.read_bytes()).hexdigest(); original=stats(source)
            for profile in ['low','medium','high']:
                out=DEST/profile;out.mkdir(exist_ok=True)
                target=out/(name+'.glb')
                entry=cached.get((name,profile))
                if target.exists() and entry and entry['sourceSha256']==digest and entry['runtimeSha256']==hashlib.sha256(target.read_bytes()).hexdigest():
                    manifest.append(entry);continue
                limit=({'low':1024,'medium':2048,'high':2048} if name=='box_final' else {'low':512 if name!='code_display' else 1024,'medium':512 if name=='light' else 1024,'high':1024 if name in ['hole_final','light'] else 2048})[profile]
                d,b=read(source); binary=bytearray(b)
                normal_images=set()
                for mat in d.get('materials',[]):
                    if 'normalTexture' in mat:normal_images.add(d['textures'][mat['normalTexture']['index']]['source'])
                for i,im in enumerate(d.get('images',[])):
                    v=d['bufferViews'][im['bufferView']];image=Image.open(io.BytesIO(b[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]))
                    image.thumbnail((limit,limit),Image.Resampling.LANCZOS)
                    if i in normal_images:
                        a=np.asarray(image.convert('RGB')).astype(np.float32)/127.5-1
                        a/=np.maximum(np.linalg.norm(a,axis=2,keepdims=True),1e-6)
                        image=Image.fromarray(np.uint8(np.clip((a+1)*127.5,0,255)))
                    stream=io.BytesIO();image.save(stream,format='PNG',optimize=True)
                    binary.extend(b'\0'*(-len(binary)%4)); payload=stream.getvalue()
                    d['bufferViews'].append({'buffer':0,'byteOffset':len(binary),'byteLength':len(payload)})
                    im['bufferView']=len(d['bufferViews'])-1;im['mimeType']='image/png';binary.extend(payload)
                for s in d.get('samplers',[]):s['minFilter']=9987;s['magFilter']=9729
                resized=temp/(name+'-resized.glb');write(resized,d,bytes(binary))
                packed=temp/(name+'.glb')
                ratio=({'low':'0.30','medium':'0.50','high':'0.75'} if name=='box_final' else {'low':'0.55','medium':'0.75','high':'1'})[profile]
                subprocess.run([os.environ['GLTFPACK'],'-i',str(resized),'-o',str(packed),'-noq','-kn','-km','-si',ratio,'-se','0.0005','-slb'],check=True)
                partition.ROOT=temp;partition.OUT=out;partition.prepare(name+'.glb')
                info=stats(target);assert not info['extensions'],info
                manifest.append({'name':name,'profile':profile,'source':str(source.relative_to(ROOT)),'sourceSha256':digest,'sourceStats':original,'runtimeStats':info,'runtimeSha256':hashlib.sha256(target.read_bytes()).hexdigest(),'maxSimplificationError':0.0005})
                assert hashlib.sha256(source.read_bytes()).hexdigest()==digest
    (DEST/'optimization.json').write_text(json.dumps(manifest,indent=2)+'\n')
if __name__=='__main__':main()
