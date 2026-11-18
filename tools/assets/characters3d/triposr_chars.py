"""Image -> 3D for the 8 characters with TripoSR (run with the triposr venv; cwd = TripoSR checkout). Writes OBJ + baked texture."""
import sys,os,numpy as np,torch
from PIL import Image
from tsr.system import TSR
from tsr.utils import resize_foreground
from tsr.bake_texture import bake_texture
import xatlas
ROOT=sys.argv[1];OUT=sys.argv[2];names=sys.argv[3:] or ['skeleton','dracula','pumpkin','voodoo','ghost','zombie','plague_doctor','puppeteer']
dev=os.environ.get('DEV','cpu')
model=TSR.from_pretrained('stabilityai/TripoSR',config_name='config.yaml',weight_name='model.ckpt');model.renderer.set_chunk_size(8192);model.to(dev)
os.makedirs(OUT,exist_ok=True)
for n in names:
    srcp=os.environ.get('IMG_'+n.upper(),f'{ROOT}/web/hell-cage-host/chars/{n}.png');im=Image.open(srcp).convert('RGBA');im=resize_foreground(im,.85)
    a=np.array(im).astype(np.float32)/255;rgb=a[:,:,:3]*a[:,:,3:4]+.5*(1-a[:,:,3:4]);img=Image.fromarray((rgb*255).astype(np.uint8))
    img.save(f'{OUT}/{n}_input.png')
    with torch.no_grad():codes=model([img],device=dev)
    mesh=model.extract_mesh(codes,False,resolution=int(os.environ.get('MC','320')))[0]
    tex=bake_texture(mesh,model,codes[0],int(os.environ.get('TEXRES','1024')))
    import trimesh
    mesh.apply_transform(trimesh.transformations.rotation_matrix(-np.pi/2,[1,0,0]))
    mesh.export(f'{OUT}/{n}_raw.ply')  # watertight marching-cubes surface, before UV splitting
    xatlas.export(f'{OUT}/{n}.obj',mesh.vertices[tex['vmapping']],tex['indices'],tex['uvs'],mesh.vertex_normals[tex['vmapping']])
    Image.fromarray((tex['colors']*255.0).astype(np.uint8)).transpose(Image.FLIP_TOP_BOTTOM).save(f'{OUT}/{n}.png')
    print('DONE',n,len(mesh.faces),flush=True)
