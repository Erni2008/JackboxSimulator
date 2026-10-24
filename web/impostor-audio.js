'use strict';
/** Device-local bridge for personalized server cues. Never transmits role or audio events. */
function createImpostorPhoneAudio({AudioContextType=window.AudioContext||window.webkitAudioContext,fetchAudio=window.fetch.bind(window)}={}) {
  const files={role:'card_role_impostor.wav',vote:'vote_sent.wav',writing:'writing_words_on_paper_theimpostor.wav'},buffers=new Map(),voices=new Set(),seen=new Set(),counts={role:0,vote:0,writing:0};
  let context=null,root=null,pendingVote=null,closed=false,loading=false,warned=false;
  let writingVoice=null,writingCursor=.1,snapshotAt=0;
  const warn=error=>{if(!warned){warned=true;console.warn('Impostor phone audio unavailable:',error?.message||error);}};
  function stop(){writingVoice=null;for(const source of voices)try{source.stop();}catch{}voices.clear();}
  function enabled(){return root?.impostorSettings?.soundEnabled!==false&&!document.hidden;}
  function load(){
    if(context||closed||!AudioContextType)return;
    try{context=new AudioContextType();}catch(error){warn(error);return;}
    loading=true;
    Promise.all(Object.entries(files).map(async([cue,file])=>{
      try{const response=await fetchAudio('/audio/impostor/'+file);if(!response.ok)throw Error(file+' HTTP '+response.status);const buffer=await context.decodeAudioData(await response.arrayBuffer());if(!closed)buffers.set(cue,buffer);}catch(error){warn(error);}
    })).finally(()=>{loading=false;flush();});
  }
  function play(cue,key){
    let persisted=false;try{persisted=sessionStorage.getItem('impostor-'+cue+'-audio')===key;}catch{}
    if(closed||seen.has(key)||persisted||!enabled()||context?.state!=='running'||!buffers.has(cue))return false;
    try{
      const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffers.get(cue);gain.gain.value=.65;source.connect(gain);gain.connect(context.destination);
      source.onended=()=>{voices.delete(source);source.disconnect();gain.disconnect();};voices.add(source);source.start();seen.add(key);counts[cue]++;
      if(seen.size>64)seen.delete(seen.values().next().value);
      try{sessionStorage.setItem('impostor-'+cue+'-audio',key);}catch{}
      return true;
    }catch(error){warn(error);return false;}
  }
  function flush(){
    const mini=root?.impostor;if(!mini||!enabled())return;
    const key=mini.sessionId+':'+root.selfId;
    if(mini.role==='IMPOSTOR'&&mini.activeParticipant&&mini.phase==='ROLE_REVEAL'&&document.getElementById('role-private')?.hidden!==true){
      let restored=false;try{restored=sessionStorage.getItem('impostor-role-audio')===key+':role';}catch{}
      if(!restored)play('role',key+':role');
    }
    if(pendingVote?.key===key&&performance.now()-pendingVote.at<1500&&play('vote',key+':vote'))pendingVote=null;
  }
  function sync(state,eventType){
    const previous=root?.impostor?.sessionId;root=state;snapshotAt=performance.now();const mini=state?.impostor;
    if(previous!==mini?.sessionId){stop();pendingVote=null;}
    if(!mini||!enabled()){stop();return;}
    if(eventType==='FINAL_VOTE_ACCEPTED'&&mini.finalVoteSubmitted&&mini.activeParticipant)pendingVote={key:mini.sessionId+':'+state.selfId,at:performance.now()};
    if(!writingAllowed())stopWriting();
    if(!context)load();flush();
  }
  function writingAllowed(){
    const mini=root?.impostor,input=document.getElementById('clue-input');
    return enabled()&&mini?.phase==='ROUND_CLUE_INPUT'&&mini.activeParticipant&&!mini.clueSubmitted&&input&&!input.disabled
      &&mini.deadline>root.serverTime+performance.now()-snapshotAt;
  }
  function stopWriting(){if(writingVoice){try{writingVoice.source.stop();}catch{}writingVoice=null;}}
  function writing(event){
    if(event.target?.id!=='clue-input'||!writingAllowed()||!event.target.value||closed||context?.state!=='running'||!buffers.has('writing'))return;
    const time=context.currentTime;
    if(!writingVoice||time>=writingVoice.until){
      stopWriting();
      const source=context.createBufferSource(),gain=context.createGain(),buffer=buffers.get('writing'),offset=writingCursor%buffer.duration;
      source.buffer=buffer;source.loop=true;source.connect(gain);gain.connect(context.destination);gain.gain.value=0;
      const voice={source,gain,until:0};writingVoice=voice;voices.add(source);counts.writing++;
      source.onended=()=>{voices.delete(source);source.disconnect();gain.disconnect();writingCursor=(offset+context.currentTime-time)%buffer.duration;if(writingVoice===voice)writingVoice=null;};
      source.start(0,offset);
    }
    const voice=writingVoice;voice.until=time+.24;
    voice.gain.gain.cancelScheduledValues(time);voice.gain.gain.setTargetAtTime(5.2,time,.008);
    voice.gain.gain.setTargetAtTime(0,time+.20,.01);voice.source.stop(voice.until);
  }
  document.addEventListener('input',writing);document.addEventListener('impostor:role-visible',flush);
  function unlock(){load();if(context?.state==='suspended')context.resume().then(flush).catch(warn);else flush();}
  document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock);
  const visibility=()=>{if(document.hidden)stop();else flush();};document.addEventListener('visibilitychange',visibility);
  function suspend(){stop();root=null;pendingVote=null;}
  function dispose(){if(closed)return;closed=true;suspend();document.removeEventListener('input',writing);document.removeEventListener('impostor:role-visible',flush);document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock);document.removeEventListener('visibilitychange',visibility);buffers.clear();context?.close().catch(warn);}
  load();return {sync,suspend,dispose,playCount:cue=>counts[cue],loading:()=>loading};
}
