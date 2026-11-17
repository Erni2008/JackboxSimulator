"""Download the CC0 Poly Haven models/textures/sky used by the obstacle-race mode (1k, glTF + jpg)."""
import json,urllib.request,pathlib,sys
ROOT=pathlib.Path(__file__).resolve().parents[3];OUT=ROOT/'source_assets/race/ph'
MODELS=['fir_tree_01','pine_tree_01','boulder_01','rock_moss_set_01','tree_stump_01','dead_tree_trunk','fern_02','shrub_01','grass_medium_01','moss_01','namaqualand_cliff_01','root_cluster_01']
TEXTURES=['bark_brown_02','rock_face_03','leafy_grass','mossy_rock','brown_planks_05','forest_ground_04']
SKY='kloofendal_48d_partly_cloudy_puresky'
def get(u):
    import subprocess;return subprocess.run(['curl','-sfL','--retry','5','--retry-all-errors','-C','-',u],capture_output=True,check=True).stdout
def save(u,p):
    p.parent.mkdir(parents=True,exist_ok=True)
    if not p.exists():p.write_bytes(get(u))
for m in MODELS:
    f=json.loads(get(f'https://api.polyhaven.com/files/{m}'))['gltf']['1k']['gltf']
    d=OUT/'models'/m;save(f['url'],d/f'{m}.gltf')
    for rel,inc in f['include'].items():save(inc['url'],d/rel)
    print('model',m,flush=True)
for t in TEXTURES:
    f=json.loads(get(f'https://api.polyhaven.com/files/{t}'))
    for k in ('Diffuse','nor_gl','arm'):
        e=f[k]['1k']['jpg'];save(e['url'],OUT/'textures'/t/f'{k.lower()}.jpg')
    print('texture',t,flush=True)
f=json.loads(get(f'https://api.polyhaven.com/files/{SKY}'))
save(f['tonemapped']['url'],OUT/'sky.jpg');print('sky')
