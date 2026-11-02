"""Backdrop animation masks for THE CURSED CARDS (run after replacing background.jpg).
Writes assets/cursed_cards/background_window.png (soft window-glass mask, grey) and prints the moon position for table.json."""
import os
import numpy as np
from PIL import Image,ImageFilter
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'));D=os.path.join(ROOT,'assets/cursed_cards')
im=Image.open(os.path.join(D,'background.jpg')).convert('RGB');W,H=im.size
a=np.asarray(im.resize((512,288),Image.BILINEAR)).astype(np.float32)/255
r,g,b=a[...,0],a[...,1],a[...,2]
glass=np.clip((b-r-.04)*6,0,1)*np.clip((b-.10)*5,0,1)
glass[int(288*.62):,:]=0  # windows only in the upper part of the painting
m=Image.fromarray((glass*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))
m.save(os.path.join(D,'background_window.png'),optimize=True)
lum=a.mean(2);lum[int(288*.5):,:]=0;y,x=np.unravel_index(np.argmax(lum),lum.shape)
print('moon uv (x from left, y from top):',round(x/512,4),round(y/288,4),'mask KB',os.path.getsize(os.path.join(D,'background_window.png'))//1024)
