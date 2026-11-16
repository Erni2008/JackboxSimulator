"""Death stingers built from the project's real recordings (shots, blasts, fire, curses) plus a soft,
pleasant character layer and a gentle bell cadence, all in one shared room reverb. 48 kHz stereo."""
import numpy as np, soundfile as sf, os
from scipy.signal import resample_poly, fftconvolve, butter, sosfilt
SR=48000; R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../..'); A=R+'/assets/'
OUT=A+'sounds/deaths'; rng=np.random.default_rng(3)
def load(p,pitch=1.):
    x,sr=sf.read(A+p,always_2d=True); x=x.mean(1)
    rate=sr/pitch; g=np.gcd(int(rate),SR); x=resample_poly(x,SR//g,int(rate)//g)
    return x/ (np.max(np.abs(x))+1e-9)
def filt(x,kind,f,o=4): return sosfilt(butter(o,f,kind,fs=SR,output='sos'),x)
def fade(x,a=.003,r=.2):
    n=len(x); e=np.ones(n); ai=int(a*SR); ri=min(n,int(r*SR))
    if ai: e[:ai]=np.linspace(0,1,ai)
    e[n-ri:]*=np.linspace(1,0,ri)**2; return x*e
def cut(x,s,d): return x[int(s*SR):int((s+d)*SR)]
def bell(f,d=2.2,g=1.):
    t=np.arange(int(d*SR))/SR; x=np.zeros_like(t)
    for m,a,dc in ((1,1,1.6),(2.01,.35,.9),(3.0,.18,.5),(4.17,.08,.3)): x+=a*np.sin(2*np.pi*f*m*t)*np.exp(-t/dc)
    return x*np.minimum(1,t/.004)*g
def pad(fs,d=2.5):
    t=np.arange(int(d*SR))/SR; x=sum(np.sin(2*np.pi*f*t+np.sin(2*np.pi*.3*t)*.4)+.3*np.sin(2*np.pi*f*2.003*t) for f in fs)
    return x*np.sin(np.pi*np.minimum(1,t/d))**1.5/len(fs)
def put(b,x,s,g=1.,pan=0.):
    i=int(s*SR); n=min(len(x),len(b)-i)
    b[i:i+n,0]+=x[:n]*g*np.sqrt((1-pan)/2); b[i:i+n,1]+=x[:n]*g*np.sqrt((1+pan)/2)
# room reverb: decorrelated decaying noise IRs
def ir(d=1.8,seed=0):
    r=np.random.default_rng(seed); t=np.arange(int(d*SR))/SR
    x=r.standard_normal(len(t))*np.exp(-t*3.6); return filt(x,'low',6000)*.05
IRL,IRR=ir(seed=1),ir(seed=2)
def reverb(b,wet=.28):
    l=fftconvolve(b[:,0],IRL)[:len(b)]; r=fftconvolve(b[:,1],IRR)[:len(b)]
    return b+wet*np.stack([l,r],1)
IMPACT={
 'shot':lambda b:(put(b,load('sounds/cursed_boxes/shotgun_shoot_done.wav'),0,1.),put(b,filt(load('sounds/impostor/wooden_stumb_hit.wav',.7),'low',900),.95,.55),
                 put(b,load('sounds/cursed_boxes/773860__mrgungus__12-guage-shotgun-shell-drop.wav'),1.25,.25,.5)),
 'exploded':lambda b:(put(b,load('sounds/cursed_boxes/box_destroy_done.wav'),0,.9),put(b,filt(cut(load('system_breach/sfx/thunder.wav'),0,3.5),'low',400),0,.8),
                 put(b,fade(load('system_breach/sfx/shatter.wav',1.1),r=1.),.05,.35,-.3)),
 'burned':lambda b:(put(b,load('system_breach/sfx/whoosh.wav',.8),0,.8),put(b,load('system_breach/sfx/firewall.wav'),.05,.85),
                 put(b,filt(load('system_breach/sfx/thunder.wav',1.4),'low',300)[:SR*2],0,.4)),
 'cursed':lambda b:(put(b,load('sounds/cursed_boxes/horror_appearance.wav'),0,.85),put(b,load('system_breach/sfx/soul.wav',.85),.25,.6,.2),
                 put(b,filt(load('system_breach/sfx/thunder.wav',.8),'low',250)[:SR*3],0,.5)),
}
def soft_clacks(b,s,pitch):  # bone/wood clicks
    w=filt(load('sounds/impostor/wooden_stumb_hit.wav',pitch),'high',400)[:int(.25*SR)]
    for k in range(6): put(b,fade(w,r=.15),s+k*rng.uniform(.06,.12),.25*(.8**k),rng.uniform(-.6,.6))
CHAR={
 'skeleton':lambda b:soft_clacks(b,.35,2.2),
 'pumpkin':lambda b:put(b,filt(load('sounds/impostor/wooden_stumb_hit.wav',.55),'low',600),.3,.6),
 'plague_doctor':lambda b:put(b,fade(filt(load('sounds/last_command/metal_cracking.wav',.9),'high',300),r=.8),.3,.3,.3),
 'dracula':lambda b:put(b,filt(pad([146.8,174.6,220],2.6),'low',2000),.4,.35),
 'ghost':lambda b:put(b,load('system_breach/sfx/soul.wav',1.25),.3,.45,-.3),
 'voodoo':lambda b:[put(b,bell(f,.8,.12),.35+i*.11,1,p) for i,(f,p) in enumerate(((1568,-.5),(1760,.4),(2093,-.2)))],
 'zombie':lambda b:put(b,fade(filt(load('sounds/cursed_boxes/horror_appearance2.wav',.6),'low',700),r=.8),.3,.55),
 'puppeteer':lambda b:put(b,fade(filt(cut(load('sounds/cages/chain_cage.wav'),0,1.6),'high',250),r=.6),.3,.35,.3),
}
ROOT={'skeleton':233.1,'pumpkin':207.7,'plague_doctor':220,'dracula':185,'ghost':261.6,'voodoo':196,'zombie':174.6,'puppeteer':246.9}
def cadence(b,root,s):  # soft descending minor bells: 5 - b3 - 1
    for i,m in enumerate((1.498,1.189,1.)): put(b,bell(root*2*m,2.4,.16),s+i*.32,1,(-.3,.3,0)[i])
    put(b,filt(pad([root,root*1.189,root*1.498],2.4),'low',1500),s+.6,.12)
os.makedirs(OUT,exist_ok=True)
for c in CHAR:
    for cause in IMPACT:
        b=np.zeros((int(4.4*SR),2))
        IMPACT[cause](b); CHAR[c](b); cadence(b,ROOT[c],1.35 if cause!='cursed' else 1.7)
        b=reverb(b); b=filt(b.T,'high',35,2).T
        b/=np.max(np.abs(b))+1e-9; b=np.tanh(b*1.3)/np.tanh(1.3)*.89
        n=int(.5*SR); b[-n:]*=np.linspace(1,0,n)[:,None]**2
        sf.write(f'{OUT}/{c}_{cause}.wav',b.astype(np.float32),SR,subtype='PCM_16')
print('done')
