"""Prepare non-destructive copies of the supplied card panel and plate artwork."""
from pathlib import Path
import sys,io,json,hashlib,subprocess,os
sys.path.insert(0,str(Path(__file__).parent))
from optimize_last_command import read,write,stats
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
source=Path(sys.argv[1]) if len(sys.argv)>1 else Path('/Users/erni/Desktop/candles/2game/sounds/3-rd game')
out=ROOT/'assets/models/last_command'
manifest=[]
for profile,limit in [('mobile',256),('low',512),('medium',1024),('high',1024)]:
    original=source/'animal_panel.glb';d,b=read(original);binary=bytearray(b)
    for image in d.get('images',[]):
        v=d['bufferViews'][image['bufferView']];im=Image.open(io.BytesIO(b[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])).convert('RGB');im.thumbnail((limit,limit),Image.Resampling.LANCZOS)
        stream=io.BytesIO();im.save(stream,format='JPEG',quality=88);binary.extend(b'\0'*(-len(binary)%4));d['bufferViews'].append({'buffer':0,'byteOffset':len(binary),'byteLength':len(stream.getvalue())});image['bufferView']=len(d['bufferViews'])-1;image['mimeType']='image/jpeg';binary.extend(stream.getvalue())
    # gltfpack drops the unreferenced original texture bytes and simplifies geometry.
    temp=Path('/tmp/tlc-animal-resized.glb');write(temp,d,bytes(binary))
    target=out/profile/'animal_panel.glb'
    subprocess.run([os.environ.get('GLTFPACK','gltfpack'),'-i',str(temp),'-o',str(target),'-noq','-kn','-km','-si','0.45' if profile in ('mobile','low') else '0.75'],check=True)
    manifest.append({'profile':profile,'sourceSha256':hashlib.sha256(original.read_bytes()).hexdigest(),'runtime':stats(target)})
for name in ['panel_lamps.png','hole1.png']:
    im=Image.open(source/name);im.thumbnail((512,512),Image.Resampling.LANCZOS);im.save(out/name,optimize=True)
(out/'cards-optimization.json').write_text(json.dumps(manifest,indent=2)+'\n')
