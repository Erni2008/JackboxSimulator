'use strict';
/** Final votes are immutable and confirmed only by personalized authoritative snapshots. */
function createFinalVotingController({getState,isAuthenticated,send,now,makeId}) {
  const el=id=>document.getElementById(id);
  let session='',pending=null,error='',timeout,selection='';
  const mini=()=>getState()?.impostor;
  function reset(){selection='';session='';pending=null;error='';clearTimeout(timeout);}
  function canVote(target){const s=mini();return isAuthenticated()&&s?.phase==='FINAL_VOTING'&&s.activeParticipant&&!s.finalVoteSubmitted&&!pending&&now()<s.deadline&&target!==getState().selfId;}
  function submit(target){if(!canVote(target))return;pending=makeId();error='';const s=mini();
    send('SUBMIT_FINAL_VOTE',{roomCode:getState().code,sessionId:s.sessionId,suspectId:target},pending);render();
    clearTimeout(timeout);timeout=setTimeout(()=>{pending=null;error='Checking your accepted vote…';send('SYNC');render();},3000);
  }
  function event(e){if(!pending||e.requestId!==pending)return;
    if(e.type==='FINAL_VOTE_ACCEPTED'){if(getState().impostorSettings?.soundEnabled!==false)document.dispatchEvent(new CustomEvent('impostor:audio',{detail:{cue:'vote_confirmed'}}));pending=null;error='';clearTimeout(timeout);}
    if(e.type==='FINAL_VOTE_REJECTED'||e.type==='ERROR'){
      pending=null;clearTimeout(timeout);error=({SELF_VOTE:'You cannot vote for yourself.',INVALID_SUSPECT:'Choose an active participant.',
        FINAL_VOTE_ALREADY_SUBMITTED:'Your first vote is final.',FINAL_VOTING_CLOSED:'Voting is closed.',NOT_ELIGIBLE:'Spectators cannot submit final votes.'})[e.payload?.code]||'Vote rejected. Refreshing server state…';
      render();
    }
  }
  function tick(){const s=mini();if(!s)return;if(impostorPhoneBlackout(getState())){blackout();return;}
    const timed=s.phase==='EVIDENCE_REVIEW'||s.phase==='FINAL_VOTING';
    el('final-timer').classList.toggle('timer-warning',timed&&s.deadline-now()>0&&s.deadline-now()<=5000);
    el('final-timer').textContent=timed?`TIME REMAINING: ${Math.max(0,Math.ceil((s.deadline-now())/1000))}s`:'';
    const waitingForName=s.phase==='IMPOSTOR_REVEAL'&&now()-s.finalPhaseStartedAt<2000;
    el('final-announcement').hidden=waitingForName;
    for(const card of el('final-cards').children)card.disabled=!canVote(card.dataset.id);
    el('confirm-vote').disabled=!selection||!canVote(selection);
  }
  function render(){const s=mini();if(!s)return;if(session!==s.sessionId){reset();session=s.sessionId;}if(impostorPhoneBlackout(getState())){blackout();return;}
    if(s.phase!=='FINAL_VOTING')selection='';
    el('confirm-vote').hidden=s.phase!=='FINAL_VOTING'||!s.activeParticipant||s.finalVoteSubmitted;
    if(s.finalVoteSubmitted){selection=s.ownFinalVote||'';pending=null;clearTimeout(timeout);error='';}
    const names=new Map(s.participants.map(p=>[p.id,p.name]));
    const completed=s.phase==='RESULT';
    const acceptedName=s.finalVoteSubmitted&&['FINAL_VOTING','VOTING_LOCKED'].includes(s.phase)?names.get(s.ownFinalVote):null;
    el('vote-receipt').hidden=!acceptedName;
    el('vote-receipt-value').textContent=acceptedName||'';
    const draftName=s.phase==='FINAL_VOTING'&&s.activeParticipant&&!s.finalVoteSubmitted?names.get(selection):null;
    el('vote-draft').hidden=!draftName;
    el('vote-draft-name').textContent=draftName||'';
    el('final-screen').dataset.voteSelected=String(!!draftName);
    const titles={EVIDENCE_REVIEW:'FINAL DISCUSSION',FINAL_VOTING:'WHO IS THE IMPOSTOR?',VOTING_LOCKED:'VOTING LOCKED',
      FINAL_VOTE_REVEAL:'THE VOTES ARE BEING REVEALED',SUSPECT_ANNOUNCEMENT:'THE MOST SUSPECTED PLAYER IS…',
      IMPOSTOR_REVEAL:'THE IMPOSTOR IS…'};
    el('final-screen').dataset.phase=completed?'IMPOSTOR_REVEAL':s.phase;el('final-status').classList.toggle('confirmed',!!s.finalVoteSubmitted);
    el('final-title').textContent=completed?'THE IMPOSTOR IS…':titles[s.phase]||'THE IMPOSTOR';
    for(const id of ['final-personal','final-waiting-host','result-player','final-results']){el(id).hidden=true;el(id).textContent='';}
    el('final-announcement').textContent=s.revealedImpostorId?'IMPOSTOR: '+(names.get(s.revealedImpostorId)||''):
      s.leadingSuspects?(s.leadingSuspects.length===1?names.get(s.leadingSuspects[0]):'NO CONSENSUS · '+s.leadingSuspects.map(id=>names.get(id)).join(', ')):'';
    el('final-status').hidden=completed;
    el('result-player').hidden=completed;
    el('final-results').hidden=completed;
    el('final-progress').textContent=s.phase==='FINAL_VOTING'||s.phase==='VOTING_LOCKED'?`VOTES SUBMITTED: ${s.finalSubmittedCount} / ${s.finalEligibleCount}`:'';
    el('final-status').textContent=error||(s.phase==='EVIDENCE_REVIEW'?'Discuss the complete clue history on the shared screen.':
      s.phase==='FINAL_VOTING'?(!s.activeParticipant?'You are watching. Spectators cannot submit final votes.':s.finalVoteSubmitted?'VOTE ACCEPTED. Your choice is final.':pending?'SENDING YOUR VOTE…':'Select a suspect, then CONFIRM VOTE. One final choice.'):
      completed?'':'Watch the shared screen.');
    const focusedId=el('final-cards').contains(document.activeElement)?document.activeElement.closest('[data-id]')?.dataset.id:null;
    el('final-cards').replaceChildren();
    if(s.phase==='EVIDENCE_REVIEW'||s.phase==='FINAL_VOTING')for(const p of s.participants){
      const card=document.createElement('button');card.type='button';card.className='suspect-card final-vote-card';card.dataset.id=p.id;
      card.textContent=p.name+(p.id===getState().selfId?' · YOU':'');
      // Existing appearance IDs have no corresponding portrait textures; do not invent avatar URLs.
      const selected=(s.ownFinalVote||selection)===p.id;card.classList.toggle('selected',selected);card.setAttribute('aria-pressed',String(selected));
      card.addEventListener('click',()=>{if(canVote(p.id)){selection=p.id;render();}});el('final-cards').append(card);
    }
    el('final-results').replaceChildren();
    tick();
    if(focusedId){const card=Array.from(el('final-cards').children).find(c=>c.dataset.id===focusedId);if(card&&!card.disabled)card.focus({preventScroll:true});}
  }
  el('confirm-vote').addEventListener('click',()=>submit(selection));
  function blackout(){
    clearTimeout(timeout);pending=null;selection='';error='';
    for(const id of ['final-title','final-announcement','final-progress','final-status','vote-receipt-value','vote-draft-name','final-personal','result-player'])el(id).textContent='';
    el('final-cards').replaceChildren();el('final-results').replaceChildren();
    el('vote-receipt').hidden=el('vote-draft').hidden=true;
  }
  return {render,tick,event,reset,blackout};
}
