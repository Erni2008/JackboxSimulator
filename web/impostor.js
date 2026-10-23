/* Personalized state only: no client role assignment or secret-word validation. */
'use strict';
function createImpostorController({getState,isAuthenticated,send,now,makeId}) {
  const el=id=>document.getElementById(id);
  const writer=createParchmentWriter(el('clue-input'),el('parchment-surface'));
  const roleClock=new CountdownClock(el('role-countdown-clock'),now);
  function updateLength(){const count=Array.from(el('clue-input').value.normalize('NFC')).length;el('clue-length').textContent=`${count} / 10 LETTERS`;}

  const fitWord=()=>{const word=el('impostor-word');if(mini()?.phase!=='ROLE_REVEAL'){word.style.fontSize='';return;}word.style.fontSize='';let size=parseFloat(getComputedStyle(word).fontSize);while(word.scrollWidth>word.clientWidth&&size>8){size-=1;word.style.fontSize=size+'px';}};
  const roleResize=new ResizeObserver(fitWord);roleResize.observe(el('impostor-word'));document.fonts.ready.then(fitWord);
  let key='',focusKey='',pending=null,error='',timeout,draftKey='',draft='';
  const mini=()=>getState()?.impostor;
  function reset(){roleClock.set(0,0,false);writer.sync(false);draftKey='';draft='';key='';pending=null;error='';clearTimeout(timeout);el('clue-input').value='';el('impostor-word').textContent='';el('clue-confirmed-value').textContent='';}
  function allowed(){const s=mini();return isAuthenticated()&&s?.phase==='ROUND_CLUE_INPUT'&&s.activeParticipant&&!s.clueSubmitted&&!pending&&now()<s.deadline;}
  function tick(){const s=mini();if(!s)return;const showingRole=s.phase==='ROLE_REVEAL';el('role-countdown-clock').hidden=!showingRole;roleClock.set(s.deadline,(s.roleRevealDurationMillis||0)/1000,showingRole);el('impostor-countdown').textContent=s.deadline?`TIME REMAINING: 00:${String(Math.max(0,Math.ceil((s.deadline-now())/1000))).padStart(2,'0')}`:'';el('impostor-countdown').classList.toggle('timer-warning',s.phase==='ROUND_CLUE_INPUT'&&s.deadline-now()>0&&s.deadline-now()<=5000);el('clue-input').disabled=!allowed();el('clue-submit').disabled=!allowed();writer.sync(allowed(),getState()?.impostorSettings?.reducedMotion||getState()?.impostorSettings?.visualEffectsEnabled===false);}
  function render(){const s=mini();if(!s)return;const next=s.sessionId+':'+s.round;
    if(next!==key){const saved=draftKey===next?draft:'';reset();key=next;el('clue-input').value=saved;draftKey=next;draft=saved;}
    el('impostor-screen').dataset.phase=s.phase;el('clue-status').classList.toggle('confirmed',!!s.clueSubmitted);el('clue-status').setAttribute('aria-live','polite');
    el('impostor-role').textContent=s.role==='ORDINARY'?(s.phase==='ROLE_REVEAL'?'INNOCENT':'INNOCENT — YOUR SECRET WORD'):s.role==='IMPOSTOR'?(s.phase==='ROLE_REVEAL'?'IMPOSTOR':'YOU ARE THE IMPOSTOR'):'YOU ARE WATCHING THE IMPOSTOR';
    el('impostor-word').textContent=s.role==='ORDINARY'?(s.secretWord||''):s.phase==='ROLE_REVEAL'&&s.role==='IMPOSTOR'?'NO SECRET WORD':'';
    el('impostor-role-note').textContent=s.role==='IMPOSTOR'?'YOU DO NOT KNOW THE SECRET WORD. Try to blend in with the other players.':s.activeParticipant?'Keep your role private.':'Wait for the players to reveal their clues.';
    el('impostor-round').textContent=s.round?`ROUND ${s.round} / ${getState().impostorSettings?.roundCount||3}`:'';
    el('clue-form').hidden=!s.activeParticipant||s.phase!=='ROUND_CLUE_INPUT'||s.clueSubmitted;
    if(s.clueSubmitted){pending=null;clearTimeout(timeout);el('clue-input').value=s.ownClue||'';}
    el('clue-status').textContent=s.phase==='ROUND_CLUE_INPUT'?
      (!s.activeParticipant?'Wait for the players to reveal their clues.':error||(s.clueSubmitted?'WAITING FOR OTHER PLAYERS':pending?'SENDING YOUR CLUE…':'WRITE ONE CLUE')):
      s.phase==='ROUND_CLUE_REVEAL'?'Watch the shared screen.':s.phase==='EVIDENCE_REVIEW'?'Review the revealed clues on the shared screen.':'Keep your role private. The round will begin shortly.';
    el('clue-confirmation').hidden=!s.clueSubmitted||s.phase!=='ROUND_CLUE_INPUT';
    el('clue-confirmed-value').textContent=s.clueSubmitted&&s.phase==='ROUND_CLUE_INPUT'?(s.ownClue||''):'';
    const counts=Number.isInteger(s.submittedCount)&&Number.isInteger(s.eligibleCount)&&s.eligibleCount>0;
    el('clue-room-progress').hidden=s.phase!=='ROUND_CLUE_INPUT'||!counts;
    el('clue-room-progress').textContent=counts?`${s.submittedCount} / ${s.eligibleCount} CLUES RECEIVED`:'';
    fitWord();writer.refresh();updateLength();tick();
    if(allowed()&&focusKey!==next){focusKey=next;requestAnimationFrame(()=>{if(allowed())el('clue-input').focus({preventScroll:true});});}
  }
  function submit(e){e.preventDefault();if(!allowed())return;
    const value=el('clue-input').value.normalize('NFC');
    if(!/^\p{L}{1,10}$/u.test(value)){error='Invalid clue. Use one word of up to 10 letters.';render();return;}
    error='';pending=makeId();
    const s=mini();send('SUBMIT_CLUE',{roomCode:getState().code,sessionId:s.sessionId,round:s.round,clue:el('clue-input').value},pending);
    clearTimeout(timeout);timeout=setTimeout(()=>{pending=null;error='Checking your submission…';send('SYNC');render();},3000);render();
  }
  el('clue-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing&&e.keyCode!==229){e.preventDefault();el('clue-form').requestSubmit();}});
  el('clue-form').addEventListener('submit',submit);
  el('clue-input').addEventListener('input',()=>{draftKey=key;draft=el('clue-input').value;updateLength();});
  function suspend(){roleClock.set(0,0,false);writer.sync(false);pending=null;clearTimeout(timeout);key='';el('impostor-word').textContent='';el('clue-confirmed-value').textContent='';}
  function event(e){if(e.type==='CLUE_REJECTED'&&e.requestId===pending){pending=null;clearTimeout(timeout);error=e.payload?.code==='INVALID_CLUE'?'Invalid clue. Use one new word of up to 10 letters. At most three attempts per round.':'This clue could not be accepted. Refreshing round state…';render();}
    if(e.type==='CLUE_ACCEPTED'&&e.requestId===pending){if(getState().impostorSettings?.soundEnabled!==false)document.dispatchEvent(new CustomEvent('impostor:audio',{detail:{cue:'clue_submitted'}}));pending=null;error='';clearTimeout(timeout);}}
  return {render,tick,event,reset,suspend,hide:()=>{writer.sync(false);roleClock.set(0,0,false);}};
}
