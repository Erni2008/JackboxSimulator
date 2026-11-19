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
    pendingTimer=setTimeout(()=>{reset();error=faT('Проверяем, принят ли выбор…', 'Checking whether the choice was accepted…');send('SYNC');render();},4000);
  }
  function event(message){
    const snapshot=message.payload?.impostor;
    if(snapshot && pending && snapshot.selectedSuspectId===pending.target){reset();error='';}
    if(snapshot && message.type==='STATE' && error===faT('Проверяем, принят ли выбор…', 'Checking whether the choice was accepted…'))error='';
    if(pending&&message.requestId===pending.requestId) {
      if(message.type==='SUSPICION_ACCEPTED'){reset();error='';}
      else if(message.type==='SUSPICION_REJECTED'||message.type==='ERROR'){reset();error=explain(message.payload?.code);}
    }
  }
  function tick(){
    const s=current();if(!s||!el('suspicion-timer'))return;
    const active=s.phase==='PRELIMINARY_SUSPICION'&&!s.suspicionFinalized,left=active?Math.max(0,s.deadline-now()):0;
    const label=faT(`${Math.ceil(left/1000)} с`, `${Math.ceil(left/1000)} s`);if(el('suspicion-timer').textContent!==label)el('suspicion-timer').textContent=label;
    for(const button of el('suspect-cards').children){const disabled=!canSelect(button.dataset.id);if(button.disabled!==disabled)button.disabled=disabled;}
  }
  function render(){
    const s=current();if(!s)return;
    const next=`${s.sessionId}:${s.round}`;
    if(next!==key){reset();error='';key=next;}
    el('suspicion-title').textContent=s.phase==='PRELIMINARY_SUSPICION'&&!s.suspicionFinalized?faT('ВЫБЕРИТЕ ПОДОЗРЕВАЕМОГО', 'CHOOSE A SUSPECT'):faT('ПОДОЗРЕНИЯ ЗАПЕЧАТАНЫ', 'SUSPICIONS SEALED');
    el('suspicion-progress').textContent=faT(`ПОЛУЧЕНО ПОДОЗРЕНИЙ: ${s.submittedCount}/${s.eligibleCount}`, `SUSPICIONS RECEIVED: ${s.submittedCount}/${s.eligibleCount}`);
    el('suspicion-status').textContent=error|| (pending?faT('ОТПРАВЛЯЕМ ВЫБОР…', 'SENDING CHOICE…'):(s.phase!=='PRELIMINARY_SUSPICION'||s.suspicionFinalized)?(s.hasSubmitted?faT('Ваше подозрение принято.', 'Your suspicion is in.'):faT('Время истекло. Вы воздержались.', 'Time ran out. You abstained.')):!s.eligible?
      faT('В этой фазе вы наблюдаете за игрой.', 'You\'re watching the game in this phase.'):s.hasSubmitted?faT('Выбор принят. До конца отсчёта его можно изменить.', 'Choice accepted. You can change it until the countdown ends.'):
      faT('Выберите участника или воздержитесь. Ваш выбор останется тайным.', 'Choose a player or abstain. Your choice stays secret.'));
    const focusedId=el('suspect-cards').contains(document.activeElement)?document.activeElement.closest('[data-id]')?.dataset.id:null;
    el('suspect-cards').setAttribute('aria-busy',String(!!pending));
    el('suspect-cards').replaceChildren();
    for(const participant of s.participants){
      const button=document.createElement('button');button.type='button';button.className='suspect-card';
      button.title=participant.name;button.setAttribute('aria-label',participant.name+(participant.id===getState().selfId?faT(' · вы', ' · you'):''));
      button.dataset.id=participant.id;button.dataset.initial=(Array.from(participant.name.trim())[0]||'?').toUpperCase();if(participant.id===getState().selfId)button.dataset.self='true';button.textContent=participant.name;
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
