'use strict';
/**
 * Phone sound design (WebAudio, no files). Soft FM bells, muted thumps and filtered air in D minor, all through one
 * gentle room reverb and a low-pass, with a little random detune per play so repeats never sound mechanical.
 * Taps are haptic only; sound is saved for moments that matter. Unlocks on the first touch.
 */
const FA_SFX=(()=>{
  let ctx=null,out=null,dry=null,noiseBuf=null;
  const N={D3:146.83,F3:174.61,A3:220,D4:293.66,F4:349.23,G4:392,A4:440,C5:523.25,D5:587.33,E5:659.25,F5:698.46,A5:880,D6:1174.66};
  function unlock(){
    if(ctx){if(ctx.state==='suspended')ctx.resume();return;}
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    try{
      ctx=new C();out=ctx.createGain();out.gain.value=.5;const tone=ctx.createBiquadFilter();tone.type='lowpass';tone.frequency.value=7000;tone.connect(out);out.connect(ctx.destination);
      // short synthetic room: decaying noise impulse
      const len=ctx.sampleRate*1.1,ir=ctx.createBuffer(1,len,ctx.sampleRate),d=ir.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,4);
      const verb=ctx.createConvolver();verb.buffer=ir;const wet=ctx.createGain();wet.gain.value=.22;verb.connect(wet).connect(tone);
      dry=ctx.createGain();dry.connect(tone);dry.connect(verb);
      noiseBuf=ctx.createBuffer(1,ctx.sampleRate*.6,ctx.sampleRate);const nd=noiseBuf.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
    }catch(e){ctx=null;}
  }
  // money sounds for answers: pre-rendered coin takes (tools/audio/generate_coin_sfx.py), decoded once
  const samples={};
  function loadSamples(){for(const n of ['coin_ok_1','coin_ok_2','coin_ok_3','coin_bad_1','coin_bad_2','coin_bad_3','coin_jackpot'])
    fetch('/sfx/'+n+'.wav').then(r=>r.arrayBuffer()).then(a=>new Promise((ok,no)=>ctx.decodeAudioData(a,ok,no))).then(b=>{samples[n]=b;}).catch(()=>{});}
  function sample(names,vol=1){if(!ready())return false;const list=names.filter(n=>samples[n]);if(!list.length)return false;
    const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=samples[list[Math.random()*list.length|0]];s.playbackRate.value=1+(Math.random()-.5)*.04;g.gain.value=vol;s.connect(g).connect(out);s.start();return true;}
  addEventListener('pointerdown',unlock,{passive:true,capture:true});addEventListener('keydown',unlock,{capture:true});
  document.addEventListener('visibilitychange',()=>{if(!ctx)return;document.hidden?ctx.suspend():ctx.resume();});
  const ready=()=>ctx&&ctx.state==='running';
  const det=()=>1+(Math.random()-.5)*.012;
  /** FM bell: carrier + decaying modulator. */
  function bell(f,{at=0,dur=.9,vol=.12,ratio=3.5,index=1.2}={}){
    if(!ready())return;f*=det();const t=ctx.currentTime+at,c=ctx.createOscillator(),m=ctx.createOscillator(),mg=ctx.createGain(),g=ctx.createGain();
    c.frequency.value=f;m.frequency.value=f*ratio;mg.gain.setValueAtTime(f*index,t);mg.gain.exponentialRampToValueAtTime(1,t+dur*.6);m.connect(mg).connect(c.frequency);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dur);c.connect(g).connect(dry);
    c.start(t);m.start(t);c.stop(t+dur+.05);m.stop(t+dur+.05);
  }
  /** Low thump: a pitch-dropping sine. */
  function thump(f0,f1,{at=0,dur=.35,vol=.3}={}){
    if(!ready())return;const t=ctx.currentTime+at,o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(dry);o.start(t);o.stop(t+dur+.05);
  }
  /** Filtered air. */
  function air(dur,{at=0,vol=.08,lo=800,hi=5000,attack=.02}={}){
    if(!ready())return;const t=ctx.currentTime+at,s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noiseBuf;f.type='bandpass';f.frequency.value=Math.sqrt(lo*hi);f.Q.value=Math.sqrt(lo*hi)/(hi-lo)*2;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f).connect(g).connect(dry);s.start(t);s.stop(t+dur+.02);
  }
  const pick=a=>a[Math.random()*a.length|0];
  return {
    unlock,
    tap(){},                                                                     // haptic only
    correct(){return;  // answer sounds live on the host for now
      const r=pick([[N.D5,N.A5],[N.F5,N.A5],[N.A4,N.D5]]);bell(r[0],{vol:.1,dur:.7});bell(r[1],{at:.07,vol:.09,dur:.9});},
    wrong(){return;
      thump(150,70,{vol:.22,dur:.3});bell(N.D4*.94,{at:.02,vol:.035,dur:.4,ratio:1.01,index:.4});},
    key(){[N.D5,N.F5,N.A5,N.D6].forEach((f,i)=>bell(f,{at:i*.075,vol:.07,dur:1.1}));air(.9,{at:.05,vol:.025,lo:4000,hi:10000,attack:.3});},
    hackOk(){thump(170,45,{vol:.32,dur:.6});bell(N.D5,{vol:.08,dur:1,ratio:2,index:2.4});bell(N.A5,{at:.06,vol:.05,dur:1.1});},
    hackFail(){thump(120,55,{vol:.26,dur:.45});bell(N.F3,{at:.04,vol:.04,dur:.5,ratio:1.01,index:.3});},
    infected(){for(let i=0;i<7;i++)air(.03,{at:Math.random()*.25,vol:.07,lo:1800,hi:9000,attack:.002});thump(110,40,{at:.05,vol:.25,dur:.7});bell(N.D4,{at:.08,vol:.05,dur:1,ratio:1.06,index:1.6});bell(N.D4*1.06,{at:.08,vol:.04,dur:1,ratio:1.0,index:1.2});},
    cleared(){[N.D4,N.F4,N.A4,N.D5].forEach((f,i)=>bell(f,{at:i*.07,vol:.07,dur:1,ratio:1,index:1}));},
    step(){bell(pick([N.A5,N.D6,N.F5]),{vol:.03,dur:.18,ratio:3.5,index:.5});},
    miss(){thump(140,80,{vol:.12,dur:.15});},
    tick(){air(.025,{vol:.08,lo:1500,hi:3800,attack:.001});},
    decode(){bell(1800+Math.random()*900,{vol:.012,dur:.05,ratio:1.5,index:.3});},
    lock(){bell(N.A5,{vol:.04,dur:.25,ratio:3.5,index:.6});},
    souls(){[N.A4,N.D5,N.F5,N.A5].forEach((f,i)=>bell(f,{at:i*.09,vol:.065,dur:1.3,ratio:1,index:.9}));air(1.2,{at:.1,vol:.03,lo:3000,hi:9000,attack:.4});},
  };
})();
