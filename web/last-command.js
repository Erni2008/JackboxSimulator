'use strict';
/** Lightweight authoritative controller. No WebGL, GLB, textures or polling loop. */
function createLastCommandController({getState,isAuthenticated,send}){
  const root=document.getElementById('lastcommand-screen'),held=new Set();
  let session='';
  function action(element,action,value=''){
    const state=getState(),panel=state?.lastCommand;
    if(!panel||!isAuthenticated()||!state.hostConnected)return;
    send('LAST_COMMAND_ACTION',{roomCode:state.code,sessionId:panel.sessionId,element,action,value});
  }
  function releaseAll(){for(const element of held)action(element,'RELEASE');held.clear();}
  root.querySelectorAll('[data-lc-hold]').forEach(button=>{
    const element=button.dataset.lcHold;
    button.addEventListener('pointerdown',event=>{if(button.disabled||event.button!==0||held.has(element))return;event.preventDefault();button.setPointerCapture(event.pointerId);held.add(element);action(element,'PRESS');});
    const release=()=>{if(held.delete(element))action(element,'RELEASE');};
    button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
    button.addEventListener('keydown',event=>{if((event.key===' '||event.key==='Enter')&&!event.repeat&&!held.has(element)){event.preventDefault();held.add(element);action(element,'PRESS');}});
    button.addEventListener('keyup',event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();release();}});button.addEventListener('blur',release);
  });
  root.querySelectorAll('[data-lc-set]').forEach(button=>button.addEventListener('click',()=>action(button.dataset.lcSet,'SET',button.dataset.value)));
  root.querySelectorAll('[data-lc-step]').forEach(button=>button.addEventListener('click',()=>action('CODE_PANEL','STEP',button.dataset.lcStep)));
  document.getElementById('lc-hatch').addEventListener('click',()=>action('HIDDEN_HATCH','SET',getState()?.lastCommand?.hatch?'CLOSED':'OPEN'));
  window.addEventListener('blur',releaseAll);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll();});
  return {suspend:releaseAll,render(){
    const state=getState(),panel=state?.lastCommand;if(!panel)return;
    if(session!==panel.sessionId){held.clear();session=panel.sessionId;}
    document.getElementById('lc-code').textContent=panel.code;
    document.getElementById('lc-state').textContent=`LEVER: ${panel.lever} · DIAL: ${panel.adjuster}° · HATCH: ${panel.hatch?'OPEN':'CLOSED'}`;
    document.getElementById('lc-lamp').textContent=panel.light;document.getElementById('lc-lamp').dataset.color=panel.light;
    const locked=new Set(panel.locked||[]);
    root.querySelectorAll('button').forEach(button=>{const element=button.dataset.lcHold||button.dataset.lcSet||(button.dataset.lcStep?'CODE_PANEL':'HIDDEN_HATCH');button.disabled=!isAuthenticated()||!state.hostConnected||locked.has(element);button.setAttribute('aria-pressed',String((panel.held||[]).includes(element)||(button.dataset.value!==undefined&&String(panel[element==='LEVER_MODULE'?'lever':element==='ADJUSTER'?'adjuster':'light'])===button.dataset.value)));});
  }};
}
