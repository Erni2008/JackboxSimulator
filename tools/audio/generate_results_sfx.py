"""Synthesised sounds for the ROUND RESULTS screen (no third-party audio, free for commercial use):
row whoosh, count tick, coin chime when points land, deep impact for the round winner, total flash."""
import numpy as np, wave, os
SR=44100; OUT=os.path.join(os.path.dirname(__file__),'..','..','assets','sounds','results')
rng=np.random.default_rng(7)
def save(name,x):
    x=x/ (np.max(np.abs(x))+1e-9)*0.85; d=(np.clip(x,-1,1)*32767).astype('<i2')
    with wave.open(os.path.join(OUT,name),'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
def t(s): return np.arange(int(SR*s))/SR
def env(n,a,r): e=np.ones(n); A=int(SR*a); e[:A]=np.linspace(0,1,A); e[A:]=np.exp(-np.linspace(0,r,n-A)); return e
def lp(x,k): # one-pole low-pass, k in (0,1)
    y=np.empty_like(x); acc=0.; k=np.broadcast_to(np.asarray(k,dtype=float),x.shape)
    for i in range(len(x)): acc+=k[i]*(x[i]-acc); y[i]=acc
    return y
# whoosh: filtered noise with a rising then falling band
n=int(SR*.45); noise=rng.standard_normal(n); sweep=np.sin(np.linspace(0,np.pi,n))
wh=lp(noise,.04+.25*sweep**2)*np.sin(np.linspace(0,np.pi,n))**1.5; save('row_whoosh.wav',wh)
# tick: short bright click
x=t(.05); tick=np.sin(2*np.pi*2400*x)*np.exp(-x*140)+.4*rng.standard_normal(len(x))*np.exp(-x*400); save('count_tick.wav',tick)
# coin chime: two inharmonic bells
x=t(1.1); bell=sum(a*np.sin(2*np.pi*f*x)*np.exp(-x*d) for f,a,d in [(1318,1,4),(1976,.6,5),(2637,.35,7),(3520,.2,9),(1568,.5,4.5)])
bell[int(SR*.07):]+= .7*sum(a*np.sin(2*np.pi*f*x[:-int(SR*.07)])*np.exp(-x[:-int(SR*.07)]*d) for f,a,d in [(1760,1,4),(2637,.5,6),(3520,.3,8)])
save('points_land.wav',bell*env(len(x),.003,3))
# winner impact: sub drop + noise burst + shimmering tail
x=t(2.4); sub=np.sin(2*np.pi*(38+70*np.exp(-x*9))*x)*np.exp(-x*1.6)
burst=lp(rng.standard_normal(len(x)),.15)*np.exp(-x*7)
shimmer=sum(a*np.sin(2*np.pi*f*x+3*np.sin(2*np.pi*5*x))*np.exp(-x*1.4) for f,a in [(880,.12),(1320,.09),(1760,.06)])
save('winner_impact.wav',1.2*sub+.6*burst+shimmer)
# total flash: soft rising sparkle
x=t(.6); sp=sum(np.sin(2*np.pi*f*x)*np.exp(-((x-k*.06)*18)**2) for k,f in enumerate([1046,1318,1568,2093,2637])); save('total_flash.wav',sp)
print('ok')
