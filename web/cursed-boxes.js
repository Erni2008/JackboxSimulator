'use strict';
/** Phone input only. Identity, turn, ammunition, damage and contents come from the existing socket. */
function createCursedBoxesController({getState,isAuthenticated,send,makeId,explain}) {
  const el=id=>document.getElementById(id),grid=el('cursed-grid');
  let key='',draft=null,selectionRequest=null,fireRequest=null,syncRequest=null,timer=null,error='';
  const labels={ghost:'Ghost',dracula:'Dracula',plague_doctor:'Plague Doctor',puppeteer:'Puppeteer',skeleton:'Skeleton',zombie:'Zombie',pumpkin:'Pumpkin',voodoo:'Voodoo'};
  const errors={INVALID_BOX:'Choose one of the sixteen boxes.',BOX_DESTROYED:'That box has already been destroyed. Choose another.',BOX_ALREADY_SHOT:'Choose a different box.',BOX_NOT_SELECTED:'Confirm your box selection before firing.',SHOT_IN_PROGRESS:'A shot is already in progress. Watch the shared screen.',NO_SHOTS_REMAINING:'You have used both shots.',NOT_YOUR_TURN:'Wait for your turn.',CURSED_NOT_READY:'The host is restoring the gallery. Your shots are saved.',STALE_CURSED_SESSION:'This gallery has ended. Restoring the current game…',STALE_CURSED_TURN:'The turn has changed. Restoring your controller…',STALE_CURSED_SHOT:'This shot has already been handled. Restoring your controller…',CURSED_FINISHED:'All turns are complete. Wait for the host.',REQUEST_ID_REUSED:'This request has already been handled. Restoring your controller…',HOST_SCENE_PAUSED:'The show is paused. Your accepted shot is saved.'};
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
  function allowed(){return isAuthenticated()&&mini()?.canAct&&!fireRequest&&!mini()?.pendingShot;}
  function render(){
    const root=getState(),s=mini();if(!s)return;
    const next=`${s.sessionId}:${s.turnId}:${root.selfId}`;
    if(next!==key){clear();error='';key=next;}
    const self=root.players.find(p=>p.id===root.selfId);
    el('cursed-player-name').textContent=self?.nickname||self?.name||'PLAYER';
    el('cursed-player-character').textContent=labels[self?.characterId]||'';
    el('cursed-shot-counter').textContent=s.shotsRemaining===0?'NO SHOTS REMAINING':`SHOT ${3-s.shotsRemaining} / 2`;
    el('cursed-current-player').textContent=s.phase==='FINISHED'?'ALL TURNS COMPLETE':`CURRENT PLAYER: ${s.activePlayerName}`;
    const selected=draft??s.selectedCrateId;
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
    fire.disabled=!allowed()||selectionRequest!==null||selected<0||selected!==s.selectedCrateId||s.boxes?.find(box=>box.id===selected)?.state!=='AVAILABLE';
    const ours=s.pendingShot?.playerId===root.selfId;
    fire.classList.toggle('firing',ours);el('cursed-screen').classList.toggle('waiting-turn',!s.canAct);
    const text=error||(!s.hostReady?(s.notice||!root.hostConnected?'SHOW PAUSED — RESTORING THE GALLERY. YOUR SHOTS ARE SAVED.':'PREPARING THE GALLERY…'):s.phase==='FINISHED'?'THE GALLERY IS SILENT. WAITING FOR THE HOST.':s.pendingShot?ours?'SHOT CONFIRMED · FIRING…':'WAITING FOR YOUR TURN…':!s.canAct?'WAITING FOR YOUR TURN…':fireRequest?'CONFIRMING YOUR SHOT…':selectionRequest?'ALIGNING WITH YOUR TARGET…':'SELECT A BOX. MAKE IT COUNT.');
    el('cursed-status').textContent=text;
    const result=s.lastResult,panel=el('cursed-result');panel.hidden=!result||!!fireRequest||!!(ours&&s.pendingShot.id!==result?.shotId);
    if(result){panel.dataset.kind=result.empty?'empty':'found';el('cursed-result-title').textContent=result.empty?'EMPTY BOX':'CHARACTER FOUND!';el('cursed-result-detail').textContent=result.empty?'NOTHING INSIDE…':`${result.nickname} · ${labels[result.characterId]||result.characterId}`;}
  }
  function select(id){
    if(!allowed()||mini().boxes?.find(b=>b.id===id)?.state!=='AVAILABLE')return;
    error='';draft=id;selectionRequest=makeId();send('CURSED_SELECT',{...fields(),boxId:id},selectionRequest);
    clearTimeout(timer);timer=setTimeout(recover,3000);render();
  }
  function fire(){
    if(el('cursed-fire').disabled||!allowed())return;
    const selected=draft??mini().selectedCrateId;if(selected<0)return;
    error='';fireRequest=makeId();
    // Lock synchronously, before the socket send; rapid taps cannot queue another submission.
    render();send('CURSED_FIRE',{...fields(),boxId:selected,shotNumber:3-mini().shotsRemaining},fireRequest);
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
    if(event.requestId===fireRequest&&event.type==='CURSED_SHOT_ACCEPTED'){fireRequest=null;draft=null;clearTimeout(timer);error='';}
    if(event.requestId===syncRequest&&event.type==='STATE'){clear();error='';}
  }
  return {render,event,reset,suspend:clear};
}
