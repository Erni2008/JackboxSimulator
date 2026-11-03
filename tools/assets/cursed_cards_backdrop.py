"""Backdrop animation masks for THE CURSED CARDS (run after replacing background.jpg).
Writes assets/cursed_cards/background_masks.png: R = window glass (mist, branches), G = velvet curtains (sway),
B = how far down a curtain hangs (0 at the rod, 1 at the hem). Prints the moon position for table.json."""
import os
import numpy as np
from PIL import Image,ImageFilter
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'));D=os.path.join(ROOT,'assets/cursed_cards')
im=Image.open(os.path.join(D,'background.jpg')).convert('RGB');W,H=512,288
a=np.asarray(im.resize((W,H),Image.BILINEAR)).astype(np.float32)/255;r,g,b=a[...,0],a[...,1],a[...,2]
yy,xx=np.mgrid[0:H,0:W]/np.array([H,W])[:,None,None]
glass=np.clip((b-r-.04)*6,0,1)*np.clip((b-.10)*5,0,1);glass[int(H*.62):,:]=0
red=np.clip((r-np.maximum(g,b)-.06)*5,0,1)*np.clip((r-.12)*6,0,1)
side=((xx<.26)|(xx>.74))&(yy<.46)
curtain=np.where(side,red,0).astype(np.float32)
curtain=np.asarray(Image.fromarray((curtain*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(3))).astype(np.float32)/255
hang=np.clip(yy/.46,0,1)
out=np.stack([glass,curtain,hang],-1)
Image.fromarray((out*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)).save(os.path.join(D,'background_masks.png'),optimize=True)
old=os.path.join(D,'background_window.png')
if os.path.exists(old):os.remove(old)
lum=a.mean(2);lum[int(H*.5):,:]=0;y,x=np.unravel_index(np.argmax(lum),lum.shape)
print('moon uv',round(x/W,4),round(y/H,4),'KB',os.path.getsize(os.path.join(D,'background_masks.png'))//1024)
