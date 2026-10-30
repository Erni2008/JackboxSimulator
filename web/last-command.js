'use strict';
/** Lightweight authoritative controller. No WebGL, GLB, textures or polling loop. */
function createLastCommandController({getState,isAuthenticated,send}){
  const root=document.getElementById('lastcommand-screen'),held=new Set();
  let clockChallenge='',clockOffset=0,animation=0,lastFrame=0;function animate(now){animation=0;const r=getState()?.lastCommand?.testRound;if(!r?.expanded||root.hidden||document.hidden)return;if(now-lastFrame>45){window.CommandTouch?.draw(touch.getContext('2d'),r,Date.now()+clockOffset);lastFrame=now;}animation=requestAnimationFrame(animate);}
  let session='';const touch=document.createElement('canvas');touch.width=1536;touch.height=896;touch.style.cssText='width:100%;touch-action:manipulation';root.prepend(touch);const note=document.createElement('p');note.style.cssText='background:#dbc99d;color:#28241c;padding:20px;text-align:center;font:24px Georgia';note.hidden=true;touch.after(note);touch.onclick=e=>{const r=getState()?.lastCommand?.testRound,bounds=touch.getBoundingClientRect();const b=window.CommandTouch?.hit(r,(e.clientX-bounds.left)/bounds.width,1-(e.clientY-bounds.top)/bounds.height,Date.now()+clockOffset);if(b)action('TOUCH_PANEL',b.action,b.value);};
  function action(element,action,value=''){
    const state=getState(),panel=state?.lastCommand;
    if(!panel||!isAuthenticated()||!state.hostConnected)return;
    send('LAST_COMMAND_ACTION',{roomCode:state.code,sessionId:panel.sessionId,...(panel.testRound?.expanded?{taskId:panel.testRound.taskId}:{}),element,action,value});
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
  window.addEventListener('blur',releaseAll);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll();if(getState()?.lastCommand?.testRound?.expanded)action('TOUCH_PANEL','VISIBILITY',document.hidden?'HIDDEN':'VISIBLE');});
  return {suspend:releaseAll,render(){
    const state=getState(),panel=state?.lastCommand;if(!panel)return;
    if(panel.testRound?.expanded){if(panel.testRound.awaitingReady&&!document.hidden)action("TOUCH_PANEL","CLIENT_READY","");if(panel.testRound.paused&&!panel.testRound.awaitingReady&&!panel.testRound.waitingForTerminals&&!document.hidden)action("TOUCH_PANEL","VISIBILITY","VISIBLE");else if(!panel.testRound.paused&&document.hidden)action("TOUCH_PANEL","VISIBILITY","HIDDEN");}
    if(panel.clockChallenge&&clockChallenge!==panel.clockChallenge){clockChallenge=panel.clockChallenge;action("TOUCH_PANEL","CLOCK_SYNC",clockChallenge);}
    if(session!==panel.sessionId){held.clear();session=panel.sessionId;}
    document.getElementById('lc-code').textContent=panel.code;document.getElementById('lc-code').hidden=!!panel.testRound?.expanded&&!panel.testRound.requiredMechanisms?.includes('CODE_PANEL');
    document.getElementById('lc-state').textContent=`LEVER: ${panel.lever} · DIAL: ${panel.adjuster}° · HATCH: ${panel.hatch?'OPEN':'CLOSED'}`;
    document.getElementById('lc-lamp').textContent=panel.light;document.getElementById('lc-lamp').dataset.color=panel.light;
    clockOffset=(state.serverTime||Date.now())+(panel.clockRttMs||0)/2-Date.now();note.hidden=panel.testRound?.taskType!=='HATCH'||!panel.hatch||!panel.hint;note.textContent=note.hidden?'':'КОД ДОСТУПА: '+panel.hint;touch.hidden=!panel.testRound?.expanded;if(!touch.hidden&&!animation)animation=requestAnimationFrame(animate);if(!touch.hidden)window.CommandTouch?.draw(touch.getContext('2d'),panel.testRound,state.serverTime||Date.now());const locked=new Set(panel.locked||[]);
    root.querySelectorAll('button').forEach(button=>{const element=button.dataset.lcHold||button.dataset.lcSet||(button.dataset.lcStep?'CODE_PANEL':'HIDDEN_HATCH');button.hidden=!!panel.testRound?.expanded&&!panel.testRound.requiredMechanisms?.includes(element);button.disabled=!isAuthenticated()||!state.hostConnected||locked.has(element);button.setAttribute('aria-pressed',String((panel.held||[]).includes(element)||(button.dataset.value!==undefined&&String(panel[element==='LEVER_MODULE'?'lever':element==='ADJUSTER'?'adjuster':'light'])===button.dataset.value)));});
    {root.querySelector('h1').textContent=panel.testRound?.expanded?'COMMAND TERMINAL':'Mechanical controls';document.getElementById('lc-state').hidden=!!panel.testRound?.expanded;for(const group of root.querySelectorAll('.lc-controls,.lc-code-controls')){group.hidden=!!panel.testRound?.expanded&&![...group.querySelectorAll('button')].some(button=>!button.hidden);const heading=group.previousElementSibling;if(heading?.tagName==='H2')heading.hidden=group.hidden;}}
  }};
}
