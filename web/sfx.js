'use strict';
/**
 * Phone sound effects, synthesised with WebAudio (no files to download, negligible CPU). Browsers only allow audio
 * after a touch, so the context unlocks on the first tap. Every cue is a few short oscillators/noise bursts.
 */
const FA_SFX=(()=>{
  let ctx=null,master=null,noiseBuf=null;
  function unlock(){
    if(ctx){if(ctx.state==='suspended')ctx.resume();return;}
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    try{ctx=new C();master=ctx.createGain();master.gain.value=.55;master.connect(ctx.destination);
      noiseBuf=ctx.createBuffer(1,ctx.sampleRate*.5,ctx.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}catch(e){ctx=null;}
  }
  addEventListener('pointerdown',unlock,{passive:true,capture:true});addEventListener('keydown',unlock,{capture:true});
  document.addEventListener('visibilitychange',()=>{if(!ctx)return;document.hidden?ctx.suspend():ctx.resume();});
  const ready=()=>ctx&&ctx.state==='running';
  function tone(freq,dur,{type='sine',vol=.2,at=0,slide=0,attack=.005}={}){
    if(!ready())return;const t=ctx.currentTime+at,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);
    if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq*slide),t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(master);o.start(t);o.stop(t+dur+.05);
  }
  function noise(dur,{vol=.2,at=0,freq=2000,q=1}={}){
    if(!ready())return;const t=ctx.currentTime+at,s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noiseBuf;f.type='bandpass';f.frequency.value=freq;f.Q.value=q;
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f).connect(g).connect(master);s.start(t);s.stop(t+dur+.02);
  }
  const arp=(fs,step,o)=>fs.forEach((f,i)=>tone(f,o.dur||.25,{...o,at:(o.at||0)+i*step}));
  return {
    unlock,
    tap(){tone(1900,.035,{type:'square',vol:.035});},
    correct(){tone(880,.12,{vol:.16});tone(1320,.25,{vol:.16,at:.08});},
    wrong(){tone(230,.3,{type:'sawtooth',vol:.09,slide:.55});},
    key(){arp([988,1319,1661,1976,2637],.06,{vol:.09});},
    hackOk(){tone(1600,.35,{type:'square',vol:.06,slide:.2});tone(110,.55,{vol:.3,slide:.4,at:.04});},
    hackFail(){tone(140,.35,{type:'square',vol:.08});tone(500,.35,{vol:.06,slide:.5,at:.15});},
    infected(){noise(.28,{vol:.3,freq:3200,q:.8});tone(760,1,{type:'sawtooth',vol:.07,slide:.45,at:.1});tone(380,1,{type:'square',vol:.04,slide:.45,at:.1});},
    cleared(){arp([784,988,1175,1568],.07,{vol:.09,dur:.32});},
    step(){tone(1250,.05,{vol:.06});},
    miss(){tone(170,.16,{type:'square',vol:.07});},
    tick(){noise(.03,{vol:.18,freq:4200,q:4});},
    decode(){tone(2200+Math.random()*600,.025,{type:'square',vol:.025});},
    lock(){tone(1500,.06,{type:'triangle',vol:.08});},
    souls(){arp([523,784,1047,1568],.08,{type:'triangle',vol:.09,dur:.45});noise(.6,{vol:.05,freq:6000,q:.5,at:.1});},
  };
})();
