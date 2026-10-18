'use strict';
/** Private selections are confirmed only by authenticated server snapshots, never by a click. */
function createSuspicionController({getState,isAuthenticated,send,now,explain,makeId}) {
  const el=id=>document.getElementById(id);
  let pending=null,pendingTimer=null,key='',error='';
  function reset(){clearTimeout(pendingTimer);pendingTimer=null;pending=null;}
  function current(){return getState()?.impostor;}
  function canSelect(target){const s=current();return isAuthenticated()&&s?.phase==='PRELIMINARY_SUSPICION'
    &&!s.suspicionFinalized&&s.eligible&&now()<s.deadline&&!pending&&target!==getState().selfId&&target!==s.selectedSuspectId;}
  function submit(target){
    if(!canSelect(target))return;
    const s=current(),requestId=makeId();
    pending={requestId,target};error='';render();
    send('SUBMIT_SUSPICION',{roomCode:getState().code,sessionId:s.sessionId,round:s.round,suspectId:target},requestId);
    pendingTimer=setTimeout(()=>{reset();error='Checking your accepted selection…';send('SYNC');render();},4000);
  }
  function event(message){
    const snapshot=message.payload?.impostor;
    if(snapshot && pending && snapshot.selectedSuspectId===pending.target){reset();error='';}
    if(snapshot && message.type==='STATE' && error==='Checking your accepted selection…')error='';
    if(pending&&message.requestId===pending.requestId) {
      if(message.type==='SUSPICION_ACCEPTED'){reset();error='';}
      else if(message.type==='SUSPICION_REJECTED'||message.type==='ERROR'){reset();error=explain(message.payload?.code);}
    }
  }
  function tick(){
    const s=current();if(!s||!el('suspicion-timer'))return;
    const active=s.phase==='PRELIMINARY_SUSPICION'&&!s.suspicionFinalized,left=active?Math.max(0,s.deadline-now()):0;
    el('suspicion-timer').textContent=`${Math.ceil(left/1000)}s`;
    for(const button of el('suspect-cards').children)button.disabled=!canSelect(button.dataset.id);
  }
  function render(){
    const s=current();if(!s)return;
    const next=`${s.sessionId}:${s.round}`;
    if(next!==key){reset();error='';key=next;}
    el('suspicion-title').textContent=s.phase==='PRELIMINARY_SUSPICION'&&!s.suspicionFinalized?'CHOOSE A SUSPECT':'SUSPICIONS SEALED';
    el('suspicion-progress').textContent=`SUSPICIONS RECEIVED: ${s.submittedCount}/${s.eligibleCount}`;
    el('suspicion-status').textContent=error|| (pending?'SENDING YOUR SELECTION…':(s.phase!=='PRELIMINARY_SUSPICION'||s.suspicionFinalized)?(s.hasSubmitted?'Your private suspicion was recorded.':'Phase ended. You abstained.'):!s.eligible?
      'You are not eligible in this phase.':s.hasSubmitted?'Selection accepted. You may change it while the phase is open.':
      'Choose one active participant, or abstain. Your selection is private.');
    el('suspect-cards').replaceChildren();
    for(const participant of s.participants){
      const button=document.createElement('button');button.type='button';button.className='suspect-card';
      button.dataset.id=participant.id;button.textContent=participant.name+(participant.id===getState().selfId?' · YOU':'');
      const selected=participant.id===s.selectedSuspectId;
      button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));
      button.addEventListener('click',()=>submit(participant.id));el('suspect-cards').append(button);
    }
    tick();
  }
  return {render,tick,event,reset};
}
if(typeof module!=='undefined')module.exports={createSuspicionController};
