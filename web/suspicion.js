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
    pendingTimer=setTimeout(()=>{reset();error='Проверяем, принят ли выбор…';send('SYNC');render();},4000);
  }
  function event(message){
    const snapshot=message.payload?.impostor;
    if(snapshot && pending && snapshot.selectedSuspectId===pending.target){reset();error='';}
    if(snapshot && message.type==='STATE' && error==='Проверяем, принят ли выбор…')error='';
    if(pending&&message.requestId===pending.requestId) {
      if(message.type==='SUSPICION_ACCEPTED'){reset();error='';}
      else if(message.type==='SUSPICION_REJECTED'||message.type==='ERROR'){reset();error=explain(message.payload?.code);}
    }
  }
  function tick(){
    const s=current();if(!s||!el('suspicion-timer'))return;
    const active=s.phase==='PRELIMINARY_SUSPICION'&&!s.suspicionFinalized,left=active?Math.max(0,s.deadline-now()):0;
    const label=`${Math.ceil(left/1000)} с`;if(el('suspicion-timer').textContent!==label)el('suspicion-timer').textContent=label;
    for(const button of el('suspect-cards').children){const disabled=!canSelect(button.dataset.id);if(button.disabled!==disabled)button.disabled=disabled;}
  }
  function render(){
    const s=current();if(!s)return;
    const next=`${s.sessionId}:${s.round}`;
    if(next!==key){reset();error='';key=next;}
    el('suspicion-title').textContent=s.phase==='PRELIMINARY_SUSPICION'&&!s.suspicionFinalized?'ВЫБЕРИТЕ ПОДОЗРЕВАЕМОГО':'ПОДОЗРЕНИЯ ЗАПЕЧАТАНЫ';
    el('suspicion-progress').textContent=`ПОЛУЧЕНО ПОДОЗРЕНИЙ: ${s.submittedCount}/${s.eligibleCount}`;
    el('suspicion-status').textContent=error|| (pending?'ОТПРАВЛЯЕМ ВЫБОР…':(s.phase!=='PRELIMINARY_SUSPICION'||s.suspicionFinalized)?(s.hasSubmitted?'Ваше подозрение принято.':'Время истекло. Вы воздержались.'):!s.eligible?
      'В этой фазе вы наблюдаете за игрой.':s.hasSubmitted?'Выбор принят. До конца отсчёта его можно изменить.':
      'Выберите участника или воздержитесь. Ваш выбор останется тайным.');
    const focusedId=el('suspect-cards').contains(document.activeElement)?document.activeElement.closest('[data-id]')?.dataset.id:null;
    el('suspect-cards').setAttribute('aria-busy',String(!!pending));
    el('suspect-cards').replaceChildren();
    for(const participant of s.participants){
      const button=document.createElement('button');button.type='button';button.className='suspect-card';
      button.title=participant.name;button.setAttribute('aria-label',participant.name+(participant.id===getState().selfId?' · вы':''));
      button.dataset.id=participant.id;button.textContent=participant.name+(participant.id===getState().selfId?' · ВЫ':'');
      const selected=participant.id===s.selectedSuspectId;
      button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));
      button.addEventListener('click',()=>submit(participant.id));el('suspect-cards').append(button);
    }
    tick();
    if(focusedId){const button=Array.from(el('suspect-cards').children).find(b=>b.dataset.id===focusedId);if(button&&!button.disabled)button.focus({preventScroll:true});}
  }
  return {render,tick,event,reset};
}
if(typeof module!=='undefined')module.exports={createSuspicionController};
