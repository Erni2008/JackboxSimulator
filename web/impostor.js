/* Personalized state only: no client role assignment or secret-word validation. */
'use strict';
function createImpostorController({getState,isAuthenticated,send,now,makeId}) {
  const el=id=>document.getElementById(id);
  const clockText=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  const clueValue=()=>el('clue-input').value.normalize('NFC').trim();
  const writer=createParchmentWriter(el('clue-input'),el('parchment-surface'));
  const roleClock=new CountdownClock(el('role-countdown-clock'),now);
  function updateLength(){const count=Array.from(clueValue()).length;el('clue-length').textContent=`${count} / 10 БУКВ`;el('clue-length').classList.toggle('over-limit',count>10);}

  const fitWord=()=>{const word=el('impostor-word');if(mini()?.phase!=='ROLE_REVEAL'){word.style.fontSize='';return;}word.style.fontSize='';let size=parseFloat(getComputedStyle(word).fontSize);while(word.scrollWidth>word.clientWidth&&size>8){size-=1;word.style.fontSize=size+'px';}};
  const roleResize=new ResizeObserver(fitWord);roleResize.observe(el('impostor-word'));document.fonts.ready.then(fitWord);
  let typingAt=-Infinity;
  let key='',focusKey='',pending=null,error='',timeout,draftKey='',draft='';
  const mini=()=>getState()?.impostor;
  function reset(){typingAt=-Infinity;roleClock.set(0,0,false);writer.sync(false);draftKey='';draft='';key='';pending=null;error='';clearTimeout(timeout);el('clue-input').value='';el('clue-input').removeAttribute('aria-invalid');el('impostor-word').textContent='';el('clue-confirmed-value').textContent='';}
  function allowed(){const s=mini();return isAuthenticated()&&s?.phase==='ROUND_CLUE_INPUT'&&s.activeParticipant&&!s.clueSubmitted&&!pending&&now()<s.deadline;}
  function tick(){const s=mini();if(!s)return;const showingRole=s.phase==='ROLE_REVEAL';el('role-countdown-clock').hidden=!showingRole;roleClock.set(s.deadline,(s.roleRevealDurationMillis||0)/1000,showingRole);el('impostor-countdown').textContent=s.deadline?`ОСТАЛОСЬ: ${clockText(Math.max(0,Math.ceil((s.deadline-now())/1000)))}`:'';el('impostor-countdown').classList.toggle('timer-warning',s.phase==='ROUND_CLUE_INPUT'&&s.deadline-now()>0&&s.deadline-now()<=5000);el('clue-input').disabled=!allowed();el('clue-submit').disabled=!allowed()||!clueValue();(el('clue-submit').querySelector('.fa-label')||el('clue-submit')).textContent=pending?'ОТПРАВЛЯЕМ…':'ПОДТВЕРДИТЬ СЛОВО';el('clue-form').setAttribute('aria-busy',String(!!pending));writer.sync(allowed(),getState()?.impostorSettings?.reducedMotion||getState()?.impostorSettings?.visualEffectsEnabled===false);}
  function render(){const s=mini();if(!s)return;const next=s.sessionId+':'+s.round;
    if(next!==key){const saved=draftKey===next?draft:'';reset();key=next;el('clue-input').value=saved;draftKey=next;draft=saved;}
    el('impostor-screen').dataset.phase=s.phase;el('clue-status').classList.toggle('confirmed',!!s.clueSubmitted);el('clue-status').setAttribute('aria-live','polite');
    el('impostor-role').textContent=s.role==='ORDINARY'?(s.phase==='ROLE_REVEAL'?'МИРНЫЙ':'МИРНЫЙ · ВАШЕ СЛОВО'):s.role==='IMPOSTOR'?(s.phase==='ROLE_REVEAL'?'ИМПОСТОР':'ВЫ — ИМПОСТОР'):'ВЫ НАБЛЮДАЕТЕ ЗА ИГРОЙ';
    el('impostor-word').textContent=s.role==='ORDINARY'?(s.secretWord||''):s.phase==='ROLE_REVEAL'&&s.role==='IMPOSTOR'?'СЛОВО ВАМ НЕИЗВЕСТНО':'';
    el('impostor-role-note').textContent=s.role==='IMPOSTOR'?'Вы не знаете загаданное слово. Постарайтесь не выдать себя.':s.activeParticipant?'Сохраните свою роль в тайне.':'Дождитесь слов от игроков.';
    el('impostor-round').textContent=s.round?`РАУНД ${s.round} / ${getState().impostorSettings?.roundCount||3}`:'';
    el('clue-form').hidden=!s.activeParticipant||s.phase!=='ROUND_CLUE_INPUT'||s.clueSubmitted;
    if(s.phase!=='ROUND_CLUE_INPUT'){pending=null;clearTimeout(timeout);error='';}
    if(s.clueSubmitted){pending=null;clearTimeout(timeout);el('clue-input').value=s.ownClue||'';}
    el('clue-status').textContent=s.phase==='ROUND_CLUE_INPUT'?
      (!s.activeParticipant?'Дождитесь слов от игроков.':error||(s.clueSubmitted?'СЛОВО ПРИНЯТО. ОЖИДАЕМ ОСТАЛЬНЫХ':pending?'ОТПРАВЛЯЕМ СЛОВО…':'НАПИШИТЕ ОДНО СЛОВО')):
      s.phase==='ROUND_CLUE_REVEAL'?'Смотрите на общий экран.':s.phase==='EVIDENCE_REVIEW'?'Обсудите все раскрытые слова на общем экране.':'Сохраните свою роль в тайне. Раунд скоро начнётся.';
    el('clue-confirmation').hidden=!s.clueSubmitted||s.phase!=='ROUND_CLUE_INPUT';
    el('clue-confirmed-value').textContent=s.clueSubmitted&&s.phase==='ROUND_CLUE_INPUT'?(s.ownClue||''):'';
    const counts=Number.isInteger(s.submittedCount)&&Number.isInteger(s.eligibleCount)&&s.eligibleCount>0;
    el('clue-room-progress').hidden=s.phase!=='ROUND_CLUE_INPUT'||!counts;
    el('clue-room-progress').textContent=counts?`${s.submittedCount} / ${s.eligibleCount} СЛОВ ПОЛУЧЕНО`:'';
    fitWord();writer.refresh();updateLength();tick();
    if(allowed()&&matchMedia('(hover: hover) and (pointer: fine)').matches&&focusKey!==next){focusKey=next;requestAnimationFrame(()=>{if(allowed())el('clue-input').focus({preventScroll:true});});}
  }
  function submit(e){e.preventDefault();if(!allowed())return;
    const value=clueValue();
    if(!/^\p{L}{1,10}$/u.test(value)){error='Введите одно слово: от 1 до 10 букв, без пробелов и цифр.';el('clue-input').setAttribute('aria-invalid','true');render();el('clue-input').focus({preventScroll:true});return;}
    error='';pending=makeId();
    const s=mini();send('SUBMIT_CLUE',{roomCode:getState().code,sessionId:s.sessionId,round:s.round,clue:value},pending);
    clearTimeout(timeout);timeout=setTimeout(()=>{pending=null;error='Проверяем, принято ли слово…';send('SYNC');render();},3000);render();
  }
  el('clue-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing&&e.keyCode!==229){e.preventDefault();el('clue-form').requestSubmit();}});
  el('clue-form').addEventListener('submit',submit);
  el('clue-input').addEventListener('input',()=>{
    draftKey=key;draft=el('clue-input').value;error='';el('clue-input').removeAttribute('aria-invalid');el('clue-status').textContent='НАПИШИТЕ ОДНО СЛОВО';updateLength();tick();
    if(allowed()&&draft&&now()-typingAt>=220){typingAt=now();const s=mini();send('IMPOSTOR_TYPING',{roomCode:getState().code,sessionId:s.sessionId,round:s.round});}
  });
  function suspend(){roleClock.set(0,0,false);writer.sync(false);pending=null;clearTimeout(timeout);key='';el('impostor-word').textContent='';el('clue-confirmed-value').textContent='';}
  function event(e){if(e.type==='CLUE_REJECTED'&&e.requestId===pending){pending=null;clearTimeout(timeout);error=e.payload?.code==='INVALID_CLUE'?'Нужно новое слово: до 10 букв. Не повторяйте прежние подсказки.':'Слово не принято. Обновляем состояние раунда…';render();}
    if(e.type==='CLUE_ACCEPTED'&&e.requestId===pending){if(getState().impostorSettings?.soundEnabled!==false)document.dispatchEvent(new CustomEvent('impostor:audio',{detail:{cue:'clue_submitted'}}));pending=null;error='';clearTimeout(timeout);}}
  return {render,tick,event,reset,suspend,hide:()=>{writer.sync(false);roleClock.set(0,0,false);}};
}
