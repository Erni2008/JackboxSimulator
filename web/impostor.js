/* Personalized state only: no client role assignment or secret-word validation. */
'use strict';
function createImpostorController({getState,isAuthenticated,send,now,makeId}) {
  const el=id=>document.getElementById(id);
  let key='',focusKey='',pending=null,error='',timeout,draftKey='',draft='';
  const mini=()=>getState()?.impostor;
  function reset(){draftKey='';draft='';key='';pending=null;error='';clearTimeout(timeout);el('clue-input').value='';el('impostor-word').textContent='';}
  function allowed(){const s=mini();return isAuthenticated()&&s?.phase==='ROUND_CLUE_INPUT'&&s.activeParticipant&&!s.clueSubmitted&&!pending&&now()<s.deadline;}
  function tick(){const s=mini();if(!s)return;el('impostor-countdown').textContent=s.deadline?`TIME REMAINING: 00:${String(Math.max(0,Math.ceil((s.deadline-now())/1000))).padStart(2,'0')}`:'';el('impostor-countdown').classList.toggle('timer-warning',s.phase==='ROUND_CLUE_INPUT'&&s.deadline-now()>0&&s.deadline-now()<=5000);el('clue-input').disabled=!allowed();el('clue-submit').disabled=!allowed();}
  function render(){const s=mini();if(!s)return;const next=s.sessionId+':'+s.round;
    if(next!==key){const saved=draftKey===next?draft:'';reset();key=next;el('clue-input').value=saved;draftKey=next;draft=saved;}
    el('impostor-screen').dataset.phase=s.phase;el('clue-status').classList.toggle('confirmed',!!s.clueSubmitted);el('clue-status').setAttribute('aria-live','polite');
    el('impostor-role').textContent=s.role==='ORDINARY'?'INNOCENT — YOUR SECRET WORD':s.role==='IMPOSTOR'?'YOU ARE THE IMPOSTOR':'YOU ARE WATCHING THE IMPOSTOR';
    el('impostor-word').textContent=s.role==='ORDINARY'?(s.secretWord||''):'';
    el('impostor-role-note').textContent=s.role==='IMPOSTOR'?'YOU DO NOT KNOW THE SECRET WORD. Try to blend in with the other players.':s.activeParticipant?'Keep your role private.':'Wait for the players to reveal their clues.';
    el('impostor-round').textContent=s.round?`ROUND ${s.round} / ${getState().impostorSettings?.roundCount||3}`:'';
    el('clue-form').hidden=!s.activeParticipant||s.phase!=='ROUND_CLUE_INPUT'||s.clueSubmitted;
    if(s.clueSubmitted){pending=null;clearTimeout(timeout);el('clue-input').value=s.ownClue||'';}
    el('clue-status').textContent=s.phase==='ROUND_CLUE_INPUT'?
      (!s.activeParticipant?'Wait for the players to reveal their clues.':error||(s.clueSubmitted?'WAITING FOR OTHER PLAYERS':pending?'SENDING YOUR CLUE…':'WRITE ONE CLUE')):
      s.phase==='ROUND_CLUE_REVEAL'?'Watch the shared screen.':s.phase==='EVIDENCE_REVIEW'?'Review the revealed clues on the shared screen.':'Keep your role private. The round will begin shortly.';
    el('clue-confirmation').hidden=!s.clueSubmitted||s.phase!=='ROUND_CLUE_INPUT';
    tick();
    if(allowed()&&focusKey!==next){focusKey=next;requestAnimationFrame(()=>{if(allowed())el('clue-input').focus({preventScroll:true});});}
  }
  function submit(e){e.preventDefault();if(!allowed())return;
    const value=el('clue-input').value.normalize('NFC');
    if(!/^\p{L}{1,24}$/u.test(value)){error='Invalid clue. Use one word of up to 24 letters.';render();return;}
    error='';pending=makeId();
    const s=mini();send('SUBMIT_CLUE',{roomCode:getState().code,sessionId:s.sessionId,round:s.round,clue:el('clue-input').value},pending);
    clearTimeout(timeout);timeout=setTimeout(()=>{pending=null;error='Checking your submission…';send('SYNC');render();},3000);render();
  }
  el('clue-form').addEventListener('submit',submit);
  el('clue-input').addEventListener('input',()=>{draftKey=key;draft=el('clue-input').value;});
  function suspend(){pending=null;clearTimeout(timeout);key='';el('impostor-word').textContent='';}
  function event(e){if(e.type==='CLUE_REJECTED'&&e.requestId===pending){pending=null;clearTimeout(timeout);error=e.payload?.code==='INVALID_CLUE'?'Invalid clue. Use one new word of up to 24 letters. At most three attempts per round.':'This clue could not be accepted. Refreshing round state…';render();}
    if(e.type==='CLUE_ACCEPTED'&&e.requestId===pending){if(getState().impostorSettings?.soundEnabled!==false)document.dispatchEvent(new CustomEvent('impostor:audio',{detail:{cue:'clue_submitted'}}));pending=null;error='';clearTimeout(timeout);}}
  return {render,tick,event,reset,suspend};
}
