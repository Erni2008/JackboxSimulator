'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const events=new Map(),storage=new Map(),sources=[],requests=[];
let contextInstance;
class Context {
 constructor(){this.currentTime=0;this.state='suspended';this.destination={};contextInstance=this;}
 async resume(){this.state='running';} async close(){this.state='closed';}
 async decodeAudioData(buffer){return {duration:17};}
 createGain(){return {gain:{value:0,cancelScheduledValues(){},setTargetAtTime(){}},connect(){},disconnect(){}};}
 createBufferSource(){const source={connect(){},disconnect(){},start(){source.started=true;},stop(when){if(when===undefined)source.stopped=true;else source.stopAt=when;}};sources.push(source);return source;}
}
const rolePrivate={hidden:true};
const input={id:"clue-input",value:"С",disabled:false};
const document={getElementById:id=>id==="clue-input"?input:id==="role-private"?rolePrivate:null,hidden:false,addEventListener:(name,callback)=>events.set(name,callback),removeEventListener:name=>events.delete(name)};
const sandbox=vm.createContext({window:{AudioContext:Context,fetch:async url=>{requests.push(url);return {ok:true,arrayBuffer:async()=>new ArrayBuffer(8)};}},document,sessionStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},performance:{now:()=>100},console});
vm.runInContext(fs.readFileSync('web/impostor-audio.js','utf8'),sandbox);
(async()=>{
 const audio=vm.runInContext('createImpostorPhoneAudio()',sandbox),base={selfId:'self',impostorSettings:{soundEnabled:true},impostor:{sessionId:'one',phase:'ROLE_REVEAL',role:'ORDINARY',activeParticipant:true}};
 await new Promise(resolve=>setImmediate(resolve));events.get('pointerdown')();await new Promise(resolve=>setImmediate(resolve));
 assert.equal(requests.length,3,'Preload each phone WAV once');
 audio.sync(base,'STATE');assert.equal(audio.playCount('role'),0,'Ordinary player cannot hear private role');
 const imp={...base,impostor:{...base.impostor,role:'IMPOSTOR'}};audio.sync(imp,'STATE');assert.equal(audio.playCount('role'),0,'Concealed role cannot emit a revealing private cue');rolePrivate.hidden=false;events.get('impostor:role-visible')();audio.sync(imp,'STATE');assert.equal(audio.playCount('role'),1);
 audio.sync({...imp,impostor:{...imp.impostor,phase:'FINAL_VOTING'}},'STATE');assert.equal(audio.playCount('vote'),0,'A phase/tap is not a vote receipt');
 const accepted={...imp,impostor:{...imp.impostor,phase:'FINAL_VOTING',finalVoteSubmitted:true}};
 audio.sync(accepted,'FINAL_VOTE_ACCEPTED');audio.sync(accepted,'FINAL_VOTE_ACCEPTED');assert.equal(audio.playCount('vote'),1,'One accepted vote cue per session');
 audio.sync({...imp,impostorSettings:{soundEnabled:false}},'STATE');assert(sources.every(source=>source.stopped),'Mute stops active personal effects');
 audio.sync({...imp,impostor:{...imp.impostor,sessionId:'two',activeParticipant:false}},'STATE');assert.equal(audio.playCount('role'),1,'Spectator cannot hear role');
 audio.sync({...imp,impostor:{...imp.impostor,sessionId:'two'}},'STATE');assert.equal(audio.playCount('role'),2,'New session can reveal private role again');
 const writingState={...base,serverTime:0,impostor:{...base.impostor,phase:'ROUND_CLUE_INPUT',deadline:10000,round:1}};
 audio.sync(writingState,'STATE');events.get('input')({target:input});events.get('input')({target:input});assert.equal(audio.playCount('writing'),1,'Consecutive letters reuse one writing voice');
 audio.sync({...writingState,impostor:{...writingState.impostor,clueSubmitted:true}},'STATE');events.get('input')({target:input});assert.equal(audio.playCount('writing'),1,'Submitted clue cannot make writing noise');
 audio.sync({...writingState,impostor:{...writingState.impostor,round:2}},'STATE');events.get('input')({target:input});assert.equal(audio.playCount('writing'),2,'Writing restarts in the next round');
 input.disabled=true;events.get('input')({target:input});assert.equal(audio.playCount('writing'),2,'Disabled controls cannot write');input.disabled=false;
 audio.dispose();audio.dispose();assert.equal(contextInstance.state,'closed');assert.equal(requests.length,3);assert(!events.has('pointerdown'));
 const restored=vm.runInContext('createImpostorPhoneAudio()',sandbox);await new Promise(resolve=>setImmediate(resolve));events.get('pointerdown')();await new Promise(resolve=>setImmediate(resolve));
 restored.sync({...imp,impostor:{...imp.impostor,sessionId:'two'}},'AUTHENTICATED');assert.equal(restored.playCount('role'),0,'Reload does not replay heard role');
 restored.sync(accepted,'FINAL_VOTE_ACCEPTED');assert.equal(restored.playCount('vote'),0,'Reload cannot replay an acknowledged vote event');restored.dispose();
 console.log('PASS: three cached phone WAVs, bounded writing gestures across rounds, gesture unlock, private role isolation, authoritative vote receipt, duplicate rejection, mute, spectators, replay and disposal');
})().catch(error=>{console.error(error);process.exitCode=1;});
