import {SfxBank} from './sfx-bank';
import {AudioEvents} from './audio-events';
/** Asset-backed SFX plus the existing procedural radio/reaction/silence signals. */
export class MechanicalAudio extends SfxBank {
  noise:AudioBuffer;readonly events=new AudioEvents(this);
  override unlock(){super.unlock();if(this.context&&!this.noise){this.noise=this.context.createBuffer(1,Math.floor(this.context.sampleRate*.06),this.context.sampleRate);const samples=this.noise.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*Math.exp(-i/samples.length*6);}}
  override setEnabled(value:boolean){if(!value)this.task(undefined,0);super.setEnabled(value);}
  question(){} // No decorative beep may be confused with a task signal.
  stopAdjuster(){this.stopAll();}
  radioSource:AudioBufferSourceNode;radioGain:GainNode;
  signal(strength:number){if(this.radioGain&&this.context?.state==='running')this.radioGain.gain.setTargetAtTime(.003+(1-(strength||0))*.016,this.context.currentTime,.07);}
  taskSignal:any;taskTones:OscillatorNode[]=[];
  task(round:any,offset:number){for(const tone of this.taskTones){try{tone.stop();}catch{}}this.taskTones=[];if(this.radioSource){this.radioSource.stop();this.radioSource=null;this.radioGain=null;}this.taskSignal?.stop?.();this.taskSignal=null;
    if(!round?.expanded||!this.enabled)return;const t=round.touchscreen;
    if(t?.kind==='delayed'&&this.context?.state==='running'){const c=this.context;for(let i=1;i<=3;i++){const delay=(round.readyAt+i*1000-Date.now()-offset)/1000;if(delay<0)continue;const o=c.createOscillator(),g=c.createGain(),at=c.currentTime+delay;o.frequency.value=660;g.gain.setValueAtTime(.025,at);g.gain.exponentialRampToValueAtTime(.001,at+.1);o.connect(g).connect(c.destination);o.start(at);o.stop(at+.11);this.taskTones.push(o);o.onended=()=>{o.disconnect();g.disconnect();};}}
    if(t?.kind==='radio'&&this.context?.state==='running'){const c=this.context,source=c.createBufferSource(),g=c.createGain(),filter=c.createBiquadFilter();source.buffer=this.noise;source.loop=true;filter.type='bandpass';filter.frequency.value=1500;g.gain.value=.012;source.connect(filter).connect(g).connect(c.destination);source.start();this.radioSource=source;this.radioGain=g;source.onended=()=>{source.disconnect();filter.disconnect();g.disconnect();};}
    if(t?.kind==='silence'&&this.context?.state==='running'){const duration=(t.signalEndsAt-Date.now()-offset)/1000;if(duration<=0)return;const c=this.context,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=330;g.gain.value=.018;o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+duration);this.taskSignal=o;o.onended=()=>{o.disconnect();g.disconnect();if(this.taskSignal===o)this.taskSignal=null;};}
  }
  override dispose(){this.task(undefined,0);super.dispose();}
}
