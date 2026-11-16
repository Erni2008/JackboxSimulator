"""Synthesises one Jackbox-style death stinger per character x cause: impact layer + character signature + comic tail."""
import numpy as np, wave, os
SR=44100; rng=np.random.default_rng(7)
OUT=os.path.join(os.path.dirname(__file__),'../../assets/sounds/deaths')
def t(d): return np.arange(int(SR*d))/SR
def env(n,a=.005,r=.3):
    x=np.arange(n)/SR; return np.minimum(1,x/max(a,1e-4))*np.exp(-x/max(r,1e-4))
def noise(d): return rng.standard_normal(int(SR*d))
def lp(x,k):  # one-pole lowpass, k 0..1
    y=np.empty_like(x); s=0.; k=np.broadcast_to(k,x.shape)
    for i in range(len(x)): s+=k[i]*(x[i]-s); y[i]=s
    return y
def hp(x,k): return x-lp(x,k)
def tone(f,d,shape='sine'):
    tt=t(d); f=np.broadcast_to(f,tt.shape) if np.ndim(f) else np.full(tt.shape,f)
    ph=2*np.pi*np.cumsum(f)/SR
    if shape=='saw': return 2*((ph/(2*np.pi))%1)-1
    if shape=='square': return np.sign(np.sin(ph))
    if shape=='tri': return 2*np.abs(2*((ph/(2*np.pi))%1)-1)-1
    return np.sin(ph)
def at(buf,x,sec,g=1.):
    i=int(sec*SR); n=min(len(x),len(buf)-i); buf[i:i+n]+=x[:n]*g
def boom(d=1.6,f0=90):
    n=int(SR*d); tt=t(d); body=np.sin(2*np.pi*np.cumsum(f0*np.exp(-tt*3)+30)/SR)*env(n,.002,.45)
    crack=lp(noise(d),.35)*env(n,.001,.06); rumble=lp(noise(d),.01)*env(n,.02,.7)*6
    return body*1.1+crack*.9+rumble
def gunshot():
    d=1.2; n=int(SR*d); crack=hp(noise(d),.5)*env(n,.0005,.025)*1.4
    thump=tone(np.linspace(160,50,n),d)*env(n,.001,.09); tail=lp(noise(d),.08)*env(n,.01,.35)*.9
    return crack+thump+tail
def whoosh_fire(d=2.4):
    n=int(SR*d); x=lp(noise(d),.06)*np.minimum(1,t(d)/.15)*np.exp(-t(d)/1.4)*4
    crackle=np.zeros(n); 
    for _ in range(90): at(crackle,hp(noise(.01),.6)*env(int(SR*.01),.0005,.003),rng.uniform(.05,d-.05),rng.uniform(.2,.6))
    return mix(x+crackle,boom(.8,70)*.5)
def curse():
    d=2.6; n=int(SR*d); tt=t(d)
    chord=sum(tone(f*(1+.004*np.sin(2*np.pi*5*tt)),d,'saw') for f in (110,116.5,164.8))*.12
    rev=lp(noise(d),.03)*np.minimum(1,tt/1.2)**2*2
    return mix(lp(chord,.08)*env(n,.3,1.2)*2+rev*np.exp(-np.maximum(0,tt-1.3)*6),boom(.6,60)*.6)
# --- character signatures
def xylo(notes,step=.07,dec=.18):
    d=step*len(notes)+.5; b=np.zeros(int(SR*d))
    for i,f in enumerate(notes):
        n=int(SR*.4); x=(tone(f,.4)+.4*tone(f*3.9,.4))*env(n,.001,dec); at(b,x,i*step,.5)
    return b
def rattle(): return xylo(rng.choice([880,988,1175,1319,1568,784],14),.045,.06)
def thunk_squish():
    d=.7; n=int(SR*d); thunk=tone(np.linspace(220,90,n),d)*env(n,.001,.12)
    squish=lp(noise(d),.15)*env(n,.03,.2)*(1+np.sin(2*np.pi*23*t(d)))*.8
    return thunk+squish
def zap():
    d=.9; n=int(SR*d); f=1200*np.exp(-t(d)*4)+200
    return tone(f,d,'square')*env(n,.002,.3)*.35+hp(noise(d),.4)*env(n,.001,.08)*.5
def bats():
    b=np.zeros(int(SR*1.4))
    for i in range(7):
        d=.06; f=np.linspace(rng.uniform(3500,5000),rng.uniform(2200,3000),int(SR*d)); at(b,tone(f,d)*env(len(f),.003,.02),.08+i*rng.uniform(.08,.17),.4)
    org=sum(tone(f,1.3,'saw') for f in (146.8,174.6,220,277.2)); at(b,lp(org,.05)*env(len(org),.02,.6)*.5,0)
    return b
def theremin():
    d=1.8; tt=t(d); f=(700-300*tt/d)*(1+.03*np.sin(2*np.pi*6*tt)); return tone(f,d)*env(len(tt),.15,.9)*.5
def pins():
    b=np.zeros(int(SR*1.2))
    for i in range(6): at(b,tone(rng.uniform(2500,4200),.2)*env(int(SR*.2),.0005,.04),.05+i*.09,.35)
    for i in range(3): at(b,tone(np.linspace(140,70,int(SR*.3)),.3)*env(int(SR*.3),.001,.1),.0+i*.22,.7)
    return b
def groan():
    d=1.6; tt=t(d); f=95+25*np.sin(2*np.pi*1.3*tt)-20*tt; x=tone(f,d,'saw')
    return lp(x*(1+.5*np.sin(2*np.pi*31*tt)),.04)*env(len(tt),.1,.8)*1.6
def snap():
    d=1.3; tt=t(d); n=len(tt); s=hp(noise(d),.7)*env(n,.0005,.01)
    tw=tone(196*(1+.02*np.exp(-tt*3)*np.sin(2*np.pi*7*tt)),d,'tri')*env(n,.001,.5)*.5
    b=np.zeros(n); at(b,s,0); at(b,tw,0); at(b,s,.25,.7); at(b,tone(247,1,'tri')*env(SR,.001,.4)*.4,.25)
    return b
SIG={'skeleton':rattle,'pumpkin':thunk_squish,'plague_doctor':zap,'dracula':bats,'ghost':theremin,'voodoo':pins,'zombie':groan,'puppeteer':snap}
# --- comic tails (Jackbox-ish stingers)
def wahwah(root):
    b=np.zeros(int(SR*2.2)); notes=[root,root*.944,root*.891,root*.84]; durs=[.28,.28,.28,1.]
    pos=0
    for f,d in zip(notes,durs):
        tt=t(d); vib=1+.012*np.sin(2*np.pi*5.5*tt)*np.minimum(1,tt/.3) if d>.5 else 1
        x=tone(f*vib,d,'saw'); x=lp(x,.07+.05*np.sin(np.pi*np.minimum(1,tt/.12)))*env(len(tt),.02,d*.9)
        at(b,x,pos,.7); pos+=d*.95
    return b
def sting(root):
    return xylo([root*2,root*2*1.189,root*2*1.498,root*4*.944],.11,.35)
def slide_down():
    d=1.2; tt=t(d); return tone(1400*np.exp(-tt*2.2)+120,d,'sine')*env(len(tt),.01,.7)*.45
def mix(a,b):
    o=np.zeros(max(len(a),len(b))); o[:len(a)]+=a; o[:len(b)]+=b; return o
TAIL={'SHOT':lambda r:wahwah(r),'BURNED':lambda r:mix(slide_down(),sting(r)*.4),'EXPLODED':lambda r:sting(r),'CURSED':lambda r:wahwah(r*.75)}
IMPACT={'SHOT':gunshot,'BURNED':whoosh_fire,'EXPLODED':boom,'CURSED':curse}
ROOT={'skeleton':233,'pumpkin':208,'plague_doctor':220,'dracula':185,'ghost':262,'voodoo':196,'zombie':175,'puppeteer':247}
def reverb(x,mix=.22):
    y=x.copy()
    for dl,g in ((.029,.5),(.037,.45),(.041,.4),(.053,.35),(.067,.3),(.079,.25)):
        i=int(dl*SR); z=np.zeros_like(x); 
        for k in range(1,7): 
            j=i*k
            if j<len(x): z[j:]+=x[:-j]*(g**k)
        y+=z*mix
    return y
for c in SIG:
    for cause in IMPACT:
        b=np.zeros(int(SR*4.2))
        at(b,IMPACT[cause](),0,1.0)
        at(b,SIG[c](),.12,.8)
        at(b,TAIL[cause](ROOT[c]),1.05 if cause!='CURSED' else 1.5,.55)
        b=reverb(b); b=np.tanh(b/np.max(np.abs(b))*1.6)/np.tanh(1.6)*.92
        fade=int(SR*.3); b[-fade:]*=np.linspace(1,0,fade)
        with wave.open(f'{OUT}/{c}_{cause.lower()}.wav','wb') as w:
            w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((b*32767).astype('<i2').tobytes())
print('done')
