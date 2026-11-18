"""triposr venv: xatlas-unwrap the low mesh and bake colour from the high mesh's TripoSR texture (closest point), with dilation."""
import sys,numpy as np,trimesh,xatlas
from PIL import Image
ROOT=sys.argv[1];names=sys.argv[2:];TEX=1024
import os;P=os.environ.get('PREP',f'{ROOT}/source_assets/characters3d/prep');T=f'{ROOT}/source_assets/characters3d/triposr'
def load_obj(path):
    v=[];vt=[];f=[];ft=[]
    for line in open(path):
        p=line.split()
        if not p:continue
        if p[0]=='v':v.append([float(x) for x in p[1:4]])
        elif p[0]=='vt':vt.append([float(x) for x in p[1:3]])
        elif p[0]=='f':
            a=[q.split('/') for q in p[1:]]
            for k in range(1,len(a)-1):
                tri=[a[0],a[k],a[k+1]];f.append([int(q[0])-1 for q in tri])
                if len(tri[0])>1 and tri[0][1]:ft.append([int(q[1])-1 for q in tri])
    return np.array(v),np.array(vt) if vt else None,np.array(f),np.array(ft) if ft else None
for n in names:
    hv,hvt,hf,hft=load_obj(f'{P}/{n}_hi.obj');lv,_,lf,_=load_obj(f'{P}/{n}_lo.obj')
    src=np.asarray(Image.open(f'{T}/{n}.png').convert('RGB')).astype(np.float32);sh,sw=src.shape[:2]
    sm_=src.sum(2)>6
    for _ in range(12):
        acc=np.zeros_like(src);cnt=np.zeros(sm_.shape,np.float32)
        for dy,dx in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(-1,-1),(1,-1),(-1,1)):
            m2=np.roll(np.roll(sm_,dy,0),dx,1);acc+=np.roll(np.roll(src,dy,0),dx,1)*m2[...,None];cnt+=m2
        fill=(~sm_)&(cnt>0);src[fill]=acc[fill]/cnt[fill][:,None];sm_|=fill
    at=xatlas.Atlas();at.add_mesh(lv.astype(np.float32),lf.astype(np.uint32))
    co=xatlas.ChartOptions();co.max_cost=16;co.max_iterations=4;co.normal_deviation_weight=.5;co.roundness_weight=.02;co.straightness_weight=2
    po=xatlas.PackOptions();po.padding=4;po.resolution=TEX;po.bilinear=True
    at.generate(co,po);vmap,idx,uvs=at[0]
    V=lv[vmap];F=idx
    # rasterise triangles in UV space
    img=np.zeros((TEX,TEX,3),np.float32);mask=np.zeros((TEX,TEX),bool)
    pts=[];pix=[];nrm=[]
    fn=np.cross(V[F[:,1]]-V[F[:,0]],V[F[:,2]]-V[F[:,0]]);fn/=np.linalg.norm(fn,axis=1,keepdims=True)+1e-12
    for ti,tri in enumerate(F):
        uv=uvs[tri]*TEX;mn=np.floor(uv.min(0)).astype(int);mx=np.ceil(uv.max(0)).astype(int)
        xs,ys=np.meshgrid(np.arange(max(mn[0],0),min(mx[0]+1,TEX)),np.arange(max(mn[1],0),min(mx[1]+1,TEX)));c=np.stack([xs.ravel()+.5,ys.ravel()+.5],1)
        a,b,cc=uv;den=(b[1]-cc[1])*(a[0]-cc[0])+(cc[0]-b[0])*(a[1]-cc[1])
        if abs(den)<1e-12:continue
        w0=((b[1]-cc[1])*(c[:,0]-cc[0])+(cc[0]-b[0])*(c[:,1]-cc[1]))/den;w1=((cc[1]-a[1])*(c[:,0]-cc[0])+(a[0]-cc[0])*(c[:,1]-cc[1]))/den;w2=1-w0-w1
        ins=(w0>=-.02)&(w1>=-.02)&(w2>=-.02)
        if not ins.any():continue
        W=np.stack([w0[ins],w1[ins],w2[ins]],1);pts.append(W@V[tri]);pix.append(c[ins].astype(int));nrm.append(np.repeat(fn[ti][None],int(ins.sum()),0))
    pts=np.concatenate(pts);pix=np.concatenate(pix);nrm=np.concatenate(nrm)
    hm=trimesh.Trimesh(hv,hf,process=False);cp,dist,tid=trimesh.proximity.closest_point(hm,pts)
    bary=trimesh.triangles.points_to_barycentric(hm.triangles[tid],cp);huv=np.einsum('ij,ijk->ik',bary,hvt[hft[tid]])
    sx=np.clip((huv[:,0]*sw).astype(int),0,sw-1);sy=np.clip(((1-huv[:,1])*sh).astype(int),0,sh-1)
    col=src[sy,sx].copy()
    # project the original artwork onto the front (crisp painted detail), blend by facing; occlusion via a front depth buffer
    art=Image.open(f'{ROOT}/web/hell-cage-host/chars/{n}.png').convert('RGBA');bb=art.getbbox();art=np.asarray(art.crop(bb)).astype(np.float32);ah,aw=art.shape[:2]
    xmn,xmx=lv[:,0].min(),lv[:,0].max();zmn,zmx=lv[:,2].min(),lv[:,2].max()
    def proj(mirror):
        u=(pts[:,0]-xmn)/(xmx-xmn);u=1-u if mirror else u;v=1-(pts[:,2]-zmn)/(zmx-zmn)
        return np.clip((u*(aw-1)).astype(int),0,aw-1),np.clip((v*(ah-1)).astype(int),0,ah-1)
    facing=np.clip((-nrm[:,1]-.2)/.55,0,1)
    G=192;gu=np.clip(((pts[:,0]-xmn)/(xmx-xmn)*(G-1)).astype(int),0,G-1);gv=np.clip(((pts[:,2]-zmn)/(zmx-zmn)*(G-1)).astype(int),0,G-1)
    depth=np.full((G,G),np.inf);np.minimum.at(depth,(gv,gu),pts[:,1]);vis=pts[:,1]<=depth[gv,gu]+.035
    best=None
    for mirror in (False,True):
        ax,ay=proj(mirror);a_=art[ay,ax];m=(facing>.6)&vis&(a_[:,3]>200)
        err=np.abs(a_[m,:3]-col[m]).mean() if m.any() else 1e9
        if best is None or err<best[0]:best=(err,ax,ay)
    _,ax,ay=best;a_=art[ay,ax];w=(facing*vis*(a_[:,3]/255.))[:,None]*float(os.environ.get('PROJ','.92'))
    col=col*(1-w)+a_[:,:3]*w
    img[pix[:,1],pix[:,0]]=col;mask[pix[:,1],pix[:,0]]=True
    for _ in range(8):  # dilate into gutters
        m=mask.copy();acc=np.zeros_like(img);cnt=np.zeros((TEX,TEX),np.float32)
        for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
            sm=np.roll(np.roll(mask,dy,0),dx,1);si=np.roll(np.roll(img,dy,0),dx,1);acc+=si*sm[...,None];cnt+=sm
        fill=(~mask)&(cnt>0);img[fill]=acc[fill]/cnt[fill][:,None];mask|=fill
    from PIL import ImageFilter,ImageEnhance,ImageOps
    out=Image.fromarray(np.clip(img,0,255).astype(np.uint8));g=os.environ.get('GRADE','a')
    if g=='a':out=out.filter(ImageFilter.MedianFilter(3));out=ImageEnhance.Color(out).enhance(1.4);out=ImageEnhance.Brightness(out).enhance(1.12);out=ImageEnhance.Contrast(out).enhance(1.1);out=out.filter(ImageFilter.UnsharpMask(2,70,2))
    elif g=='b':
        for _ in range(2):out=out.filter(ImageFilter.MedianFilter(5))
        out=out.quantize(28,method=Image.Quantize.MEDIANCUT).convert('RGB').filter(ImageFilter.GaussianBlur(.8));out=ImageEnhance.Color(out).enhance(1.75);out=ImageEnhance.Brightness(out).enhance(1.22)
    elif g=='c':out=out.filter(ImageFilter.MedianFilter(3));out=ImageEnhance.Color(out).enhance(.95);out=ImageEnhance.Contrast(out).enhance(1.4);out=ImageEnhance.Brightness(out).enhance(.95);out=out.filter(ImageFilter.UnsharpMask(3,120,2))
    out.transpose(Image.FLIP_TOP_BOTTOM).save(f'{P}/{n}_lo.png')
    with open(f'{P}/{n}_lo_uv.obj','w') as fo:
        for p in V:fo.write(f'v {p[0]} {p[1]} {p[2]}\n')
        for t in uvs:fo.write(f'vt {t[0]} {t[1]}\n')
        for t in F:fo.write('f '+' '.join(f'{i+1}/{i+1}' for i in t)+'\n')
    print('BAKED',n,len(F),flush=True)
