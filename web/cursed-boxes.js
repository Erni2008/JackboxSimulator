'use strict';
/** Phone input only. Identity, turn, ammunition, damage and contents come from the existing socket. */
function createCursedBoxesController({getState,isAuthenticated,send,makeId,explain}) {
  const el=id=>document.getElementById(id),grid=el('cursed-grid');
  let key='',draft=null,selectionRequest=null,fireRequest=null,syncRequest=null,timer=null,error='';
  const labels={ghost:'Ghost',dracula:'Dracula',plague_doctor:'Plague Doctor',puppeteer:'Puppeteer',skeleton:'Skeleton',zombie:'Zombie',pumpkin:'Pumpkin',voodoo:'Voodoo'};
  const errors={HIDING_NOT_LOCKED:'Wait until hiding places are locked.',NOT_HIDING_PLAYER:'Only the hiding player may choose a hiding place.',NOT_SHOOTING_PLAYER:'Your role is to hide. You cannot shoot.',HIDING_ALREADY_CONFIRMED:'Your hiding place is already locked.',HIDING_BOX_UNAVAILABLE:'This hiding place is unavailable. Choose another.',HIDING_LOCKED:'Hiding choices are locked.',INVALID_BOX:'Choose one of the sixteen boxes.',BOX_DESTROYED:'That box has already been destroyed. Choose another.',BOX_ALREADY_SHOT:'Choose a different box.',BOX_NOT_SELECTED:'Confirm your box selection before firing.',SHOT_IN_PROGRESS:'A shot is already in progress. Watch the shared screen.',NO_SHOTS_REMAINING:'You have used all your shots.',NOT_YOUR_TURN:'Wait for your turn.',CURSED_NOT_READY:'The host is restoring the gallery. Your shots are saved.',STALE_CURSED_SESSION:'This gallery has ended. Restoring the current game…',STALE_CURSED_TURN:'The turn has changed. Restoring your controller…',STALE_CURSED_SHOT:'This shot has already been handled. Restoring your controller…',CURSED_FINISHED:'All turns are complete. Wait for the host.',REQUEST_ID_REUSED:'This request has already been handled. Restoring your controller…',HOST_SCENE_PAUSED:'The show is paused. Your accepted shot is saved.'};
  for(let id=0;id<16;id++){
    const button=document.createElement('button');button.type='button';button.className='cursed-box';button.dataset.box=String(id);button.dataset.nativeButton='';
    const plate=document.createElement('span');plate.className='cursed-box-plate';plate.textContent=`BOX ${String(id+1).padStart(2,'0')}`;
    const state=document.createElement('span');state.className='cursed-box-state';state.setAttribute('aria-hidden','true');
    button.append(plate,state);button.disabled=true;grid.append(button);
  }
  const mini=()=>getState()?.cursedBoxes;
  const fields=()=>({roomCode:getState().code,sessionId:mini().sessionId,turnId:mini().turnId});
  function clear(){clearTimeout(timer);selectionRequest=fireRequest=syncRequest=null;draft=null;}
  function reset(){clear();key='';error='';}
  function recover(){
    clearTimeout(timer);syncRequest=makeId();send('SYNC',{},syncRequest);error='Checking authoritative shot state…';render();
  }
  function allowed(){return isAuthenticated()&&(mini()?.canAct||mini()?.canHide)&&!fireRequest&&!mini()?.pendingShot;}
  function render(){
    const root=getState(),s=mini();if(!s)return;
    const next=`${s.sessionId}:${s.turnId}:${root.selfId}:${s.role}`;
    if(next!==key){clear();error='';key=next;}
    const self=root.players.find(p=>p.id===root.selfId);
    el('cursed-player-name').textContent=self?.nickname||self?.name||'PLAYER';
    el('cursed-player-character').textContent=labels[self?.characterId]||'';
    const hiding=s.role==='HIDING';
    if(hiding&&(s.hidingConfirmed||s.phase!=='HIDING_SELECTION'))draft=null;
    el('cursed-screen').dataset.role=s.role;
    el('cursed-screen').dataset.phase=s.phase;
    el('cursed-shot-counter').textContent=s.role==='HIDING'?(s.hidingConfirmed?'HIDING PLACE CONFIRMED':'CHOOSE YOUR HIDING PLACE'):s.shotsRemaining===0?'NO SHOTS REMAINING':`SHOT ${s.shotLimit+1-s.shotsRemaining} / ${s.shotLimit}`;
    el('cursed-current-player').textContent=s.phase==='REVEALING'?'SURVIVORS ARE EMERGING':s.phase==='FINISHED'?'ALL TURNS COMPLETE':s.phase==='HIDING_SELECTION'?(hiding?'YOUR CHOICE IS SECRET':'WAITING FOR HIDING PLAYERS'):`CURRENT PLAYER: ${s.activePlayerName}`;
    const selected=draft??(hiding?s.hidingBoxId:s.selectedCrateId);
    for(const button of grid.children){
      const id=Number(button.dataset.box),box=s.boxes?.find(box=>box.id===id),state=box?.state||'LOCKED';
      button.disabled=!allowed()||state!=='AVAILABLE';
      button.classList.toggle('selected',id===selected&&state==='AVAILABLE');button.classList.toggle('destroyed',state==='DESTROYED');button.classList.toggle('locked',state==='LOCKED');
      button.setAttribute('aria-pressed',String(id===selected&&state==='AVAILABLE'));
      button.setAttribute('aria-label',`BOX ${String(id+1).padStart(2,'0')} — ${state}`);
      button.lastElementChild.textContent=state==='DESTROYED'?'DESTROYED':state==='LOCKED'?'LOCKED':'';
      button.title=state==='DESTROYED'?(box.empty?'Empty box':`${box.nickname} · ${labels[box.characterId]||box.characterId}`):'';
    }
    el('cursed-selected').textContent=selected>=0?`SELECTED BOX: ${String(selected+1).padStart(2,'0')}`:'SELECTED BOX: NONE';
    const fire=el('cursed-fire');
    fire.dataset.action=hiding?'hide':'fire';
    fire.textContent=hiding?(s.hidingConfirmed?'HIDING PLACE LOCKED':'CONFIRM HIDING PLACE'):'FIRE';
    fire.disabled=!allowed()||selectionRequest!==null||selected<0||(!hiding&&selected!==s.selectedCrateId)||s.boxes?.find(box=>box.id===selected)?.state!=='AVAILABLE';
    const ours=s.pendingShot?.playerId===root.selfId;
    fire.classList.toggle('firing',ours);el('cursed-screen').classList.toggle('waiting-turn',!s.canAct);
    const text=error||(s.phase==='HIDING_SELECTION'?(hiding?(s.hidingConfirmed?'YOUR HIDING PLACE IS LOCKED. WAIT FOR THE SHOOTER.':'SECRETLY CHOOSE YOUR BOX, THEN CONFIRM. YOUR CHOICE IS HIDDEN FROM THE SHOOTER.'):'WAITING FOR THE HIDING PLAYER. SHOOTING IS LOCKED.'):!s.hostReady?(s.notice||!root.hostConnected?'SHOW PAUSED — RESTORING THE GALLERY. YOUR SHOTS ARE SAVED.':'PREPARING THE GALLERY…'):s.phase==='REVEALING'?`SURVIVOR REVEAL · ${s.survivorCount} SURVIVOR${s.survivorCount===1?'':'S'}. WATCH THE SHARED SCREEN.`:s.phase==='FINISHED'?(s.survivorCount===0?'NO SURVIVORS. THE GALLERY IS SILENT.':`SURVIVORS: ${(s.survivors||[]).map(p=>p.nickname).join(', ')}. WAITING FOR THE HOST.`):s.pendingShot?ours?'SHOT CONFIRMED · FIRING…':'SHOT IN PROGRESS. WATCH THE SHARED SCREEN.':hiding?'YOU ARE HIDDEN. WATCH THE SHARED SCREEN.':!s.canAct?'WAITING FOR YOUR TURN…':fireRequest?'CONFIRMING YOUR SHOT…':selectionRequest?'ALIGNING WITH YOUR TARGET…':'SELECT A BOX. MAKE IT COUNT.');
    el('cursed-status').textContent=text;
    const result=s.lastResult,panel=el('cursed-result');panel.hidden=!result||!!fireRequest||!!(ours&&s.pendingShot.id!==result?.shotId);
    if(s.phase==='REVEALING')panel.hidden=true;
    if(s.phase==='FINISHED'&&s.outcomes){const own=s.outcomes.find(p=>p.playerId===root.selfId);panel.hidden=!own;if(own){panel.dataset.kind=own.survived?'found':'empty';el('cursed-result-title').textContent=own.survived?'YOU SURVIVED':'ELIMINATED';el('cursed-result-detail').textContent=own.survived?'Your character remains in the gallery.':'Your character is excluded from the survivor reveal.';}}
    else if(result){panel.dataset.kind=result.empty?'empty':'found';el('cursed-result-title').textContent=result.empty?'EMPTY BOX':'CHARACTER FOUND!';el('cursed-result-detail').textContent=result.empty?'NOTHING INSIDE…':`${result.nickname} · ${labels[result.characterId]||result.characterId}`;}
  }
  function select(id){
    if(!allowed()||mini().boxes?.find(b=>b.id===id)?.state!=='AVAILABLE')return;
    error='';draft=id;if(mini().role==='HIDING'){render();return;}selectionRequest=makeId();send('CURSED_SELECT',{...fields(),boxId:id},selectionRequest);
    clearTimeout(timer);timer=setTimeout(recover,3000);render();
  }
  function fire(){
    if(el('cursed-fire').disabled||!allowed())return;
    const hiding=mini().role==='HIDING';
    const selected=draft??(hiding?mini().hidingBoxId:mini().selectedCrateId);if(selected<0)return;
    error='';fireRequest=makeId();
    // Lock synchronously, before the socket send; rapid taps cannot queue another submission.
    render();if(hiding)send('CURSED_HIDE',{roomCode:getState().code,sessionId:mini().sessionId,boxId:selected},fireRequest);
    else send('CURSED_FIRE',{...fields(),boxId:selected,shotNumber:mini().shotLimit+1-mini().shotsRemaining},fireRequest);
    clearTimeout(timer);timer=setTimeout(recover,3500);
  }
  grid.addEventListener('click',e=>{const button=e.target.closest('.cursed-box');if(button&&!button.disabled)select(Number(button.dataset.box));});
  grid.addEventListener('keydown',e=>{
    const shifts={ArrowLeft:-1,ArrowRight:1,ArrowUp:-4,ArrowDown:4};if(!(e.key in shifts))return;
    const button=e.target.closest('.cursed-box');if(!button)return;
    e.preventDefault();const next=grid.children[Number(button.dataset.box)+shifts[e.key]];if(next&&!next.disabled)next.focus();
  });
  el('cursed-fire').addEventListener('click',fire);
  function event(event){
    if(event.type==='CURSED_ACTION_REJECTED'){
      if(event.requestId===selectionRequest||event.requestId===fireRequest){clear();error=errors[event.payload?.code]||explain(event.payload?.code);render();send('SYNC');}
      return;
    }
    if(event.requestId===selectionRequest&&event.type==='STATE'){selectionRequest=null;draft=null;clearTimeout(timer);}
    if(event.requestId===fireRequest&&(event.type==='CURSED_SHOT_ACCEPTED'||event.type==='STATE')){fireRequest=null;draft=null;clearTimeout(timer);error='';}
    if(event.requestId===syncRequest&&event.type==='STATE'){clear();error='';}
  }
  function suspend(){
    const keep=mini()?.role==='HIDING'&&mini()?.phase==='HIDING_SELECTION'&&!mini()?.hidingConfirmed?draft:null;
    clear();draft=keep;
  }
  return {render,event,reset,suspend};
}
