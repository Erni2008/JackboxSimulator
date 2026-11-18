"""Compose the living lobby puppeteer (15-part rig in puppeteer_config.json) into one full-body PNG."""
import json,math,sys
from PIL import Image
D='assets/lobby/characters/puppeteer/';c=json.load(open(D+'puppeteer_config.json'));P={p['name']:p for p in c['parts']}
U=12  # px per world unit
def world(p):
    if not p['parent']:return (p['x'],p['y'],p['rotation'])
    px,py,pr=world(P[p['parent']]);a=math.radians(pr);x=px+p['x']*math.cos(a)-p['y']*math.sin(a);y=py+p['x']*math.sin(a)+p['y']*math.cos(a);return (x,y,pr+p['rotation'])
W,H=1400,2400;canvas=Image.new('RGBA',(W,H));ox,oy=W/2,H-200
for p in sorted([p for p in c['parts'] if p['visible'] and p['name']!='suspension'],key=lambda p:p['order']):
    im=Image.open(D+('pupper9.png' if p['asset']==9 else f"puppet{p['asset']}.png")).convert('RGBA')
    if p['mirror']:im=im.transpose(Image.FLIP_LEFT_RIGHT)
    s=p['artScale']*p['scale']*U;im=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))),Image.LANCZOS);pvx,pvy=p['pivotX']*s,p['pivotY']*s
    x,y,r=world(p)
    # rotate about pivot: pad so pivot is centre
    pad=int(max(im.width,im.height)*2);big=Image.new('RGBA',(pad,pad));big.paste(im,(int(pad/2-pvx),int(pad/2-pvy)));big=big.rotate(r,resample=Image.BICUBIC)
    canvas.alpha_composite(big,(int(ox+x*U-pad/2),int(oy-y*U-pad/2)))
canvas=canvas.crop(canvas.getbbox());canvas.save(sys.argv[1] if len(sys.argv)>1 else '/tmp/puppeteer_full.png');print(canvas.size)
