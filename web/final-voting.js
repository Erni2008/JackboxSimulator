'use strict';
/** Final votes are immutable and confirmed only by personalized authoritative snapshots. */
function createFinalVotingController({getState,isAuthenticated,send,now,makeId}) {
  const el=id=>document.getElementById(id);
  let session='',pending=null,error='',timeout,selection='',historyKey='';
  const text=(element,value)=>{if(element.textContent!==value)element.textContent=value;};
  const disabled=(element,value)=>{if(element.disabled!==value)element.disabled=value;};
  const clockText=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  const mini=()=>getState()?.impostor;
  function reset(){historyKey='';el('clue-history-content').replaceChildren();el('clue-history').hidden=true;selection='';session='';pending=null;error='';clearTimeout(timeout);}
  function history(s){
    const rounds=s.revealedClues||[],visible=rounds.length>0&&['EVIDENCE_REVIEW','FINAL_VOTING'].includes(s.phase);
    el('clue-history').hidden=!visible;if(!visible)return;
    const key=JSON.stringify([s.sessionId,s.participants,rounds]);if(key===historyKey)return;historyKey=key;
    const table=document.createElement('table'),head=document.createElement('thead'),row=document.createElement('tr');
    for(const title of ['ИГРОК',...rounds.map((_,i)=>'РАУНД '+(i+1))]){const cell=document.createElement('th');cell.scope='col';cell.textContent=title;row.append(cell);}head.append(row);table.append(head);
    const body=document.createElement('tbody');for(const player of s.participants){const line=document.createElement('tr'),name=document.createElement('th');name.scope='row';name.textContent=player.name;line.append(name);for(const clues of rounds){const cell=document.createElement('td');cell.textContent=clues[player.id]||'—';line.append(cell);}body.append(line);}table.append(body);el('clue-history-content').replaceChildren(table);
  }
  function canVote(target){const s=mini();return isAuthenticated()&&s?.phase==='FINAL_VOTING'&&s.activeParticipant&&!s.finalVoteSubmitted&&!pending&&now()<s.deadline&&target!==getState().selfId;}
  function submit(target){if(!canVote(target))return;pending=makeId();error='';const s=mini();
    send('SUBMIT_FINAL_VOTE',{roomCode:getState().code,sessionId:s.sessionId,suspectId:target},pending);render();
    clearTimeout(timeout);timeout=setTimeout(()=>{pending=null;error='Проверяем, принят ли голос…';send('SYNC');render();},3000);
  }
  function event(e){if(!pending||e.requestId!==pending)return;
    if(e.type==='FINAL_VOTE_ACCEPTED'){if(getState().impostorSettings?.soundEnabled!==false)document.dispatchEvent(new CustomEvent('impostor:audio',{detail:{cue:'vote_confirmed'}}));pending=null;error='';clearTimeout(timeout);}
    if(e.type==='FINAL_VOTE_REJECTED'||e.type==='ERROR'){
      pending=null;clearTimeout(timeout);error=({SELF_VOTE:'Нельзя голосовать за себя.',INVALID_SUSPECT:'Выберите участника этой игры.',
        FINAL_VOTE_ALREADY_SUBMITTED:'Принятый голос изменить нельзя.',FINAL_VOTING_CLOSED:'Голосование завершено.',NOT_ELIGIBLE:'Зрители не участвуют в финальном голосовании.'})[e.payload?.code]||'Голос не принят. Обновляем состояние…';
      render();
    }
  }
  function tick(){const s=mini();if(!s)return;if(impostorPhoneBlackout(getState())){blackout();return;}
    const timed=s.phase==='EVIDENCE_REVIEW'||s.phase==='FINAL_VOTING';
    el('final-timer').classList.toggle('timer-warning',timed&&s.deadline-now()>0&&s.deadline-now()<=5000);
    text(el('final-timer'),timed?`ОСТАЛОСЬ: ${clockText(Math.max(0,Math.ceil((s.deadline-now())/1000)))}`:'');
    const waitingForName=s.phase==='IMPOSTOR_REVEAL'&&now()-s.finalPhaseStartedAt<2000;
    el('final-announcement').hidden=waitingForName;
    for(const card of el('final-cards').children)disabled(card,!canVote(card.dataset.id));
    disabled(el('confirm-vote'),!selection||!canVote(selection));
  }
  function render(){const s=mini();if(!s)return;if(session!==s.sessionId){reset();session=s.sessionId;}if(impostorPhoneBlackout(getState())){blackout();return;}
    if(s.phase!=='FINAL_VOTING'){selection='';pending=null;clearTimeout(timeout);error='';}
    el('confirm-vote').hidden=s.phase!=='FINAL_VOTING'||!s.activeParticipant||s.finalVoteSubmitted;
    if(s.finalVoteSubmitted){selection=s.ownFinalVote||'';pending=null;clearTimeout(timeout);error='';}
    (el('confirm-vote').querySelector('.fa-label')||el('confirm-vote')).textContent=pending?'ОТПРАВЛЯЕМ…':'ПОДТВЕРДИТЬ ГОЛОС';el('final-screen').setAttribute('aria-busy',String(!!pending));
    history(s);
    const names=new Map(s.participants.map(p=>[p.id,p.name]));
    const completed=s.phase==='RESULT';
    const acceptedName=s.finalVoteSubmitted&&['FINAL_VOTING','VOTING_LOCKED'].includes(s.phase)?names.get(s.ownFinalVote):null;
    el('vote-receipt').hidden=!acceptedName;
    el('vote-receipt-value').textContent=acceptedName||'';
    const draftName=s.phase==='FINAL_VOTING'&&s.activeParticipant&&!s.finalVoteSubmitted?names.get(selection):null;
    el('vote-draft').hidden=!draftName;
    el('vote-draft-name').textContent=draftName||'';
    el('final-screen').dataset.voteSelected=String(!!draftName);
    const titles={EVIDENCE_REVIEW:'ОБСУЖДЕНИЕ',FINAL_VOTING:'КТО ИМПОСТОР?',VOTING_LOCKED:'ГОЛОСОВАНИЕ ЗАКРЫТО',
      FINAL_VOTE_REVEAL:'РАСКРЫВАЕМ ГОЛОСА',SUSPECT_ANNOUNCEMENT:'БОЛЬШЕ ВСЕГО ПОДОЗРЕНИЙ…',
      IMPOSTOR_REVEAL:'ИМПОСТОР — ЭТО…'};
    el('final-screen').dataset.phase=completed?'IMPOSTOR_REVEAL':s.phase;el('final-status').classList.toggle('confirmed',!!s.finalVoteSubmitted);
    el('final-title').textContent=completed?'ИМПОСТОР — ЭТО…':titles[s.phase]||'ИМПОСТОР';
    for(const id of ['final-personal','final-waiting-host','result-player','final-results']){el(id).hidden=true;el(id).textContent='';}
    el('final-announcement').textContent=s.revealedImpostorId?'ИМПОСТОР: '+(names.get(s.revealedImpostorId)||''):
      s.leadingSuspects?(s.leadingSuspects.length===1?names.get(s.leadingSuspects[0]):'НЕТ ЕДИНОГО РЕШЕНИЯ · '+s.leadingSuspects.map(id=>names.get(id)).join(', ')):'';
    el('final-status').hidden=completed;
    el('result-player').hidden=completed;
    el('final-results').hidden=completed;
    el('final-progress').textContent=s.phase==='FINAL_VOTING'||s.phase==='VOTING_LOCKED'?`ПРИНЯТО ГОЛОСОВ: ${s.finalSubmittedCount} / ${s.finalEligibleCount}`:'';
    el('final-status').textContent=error||(s.phase==='EVIDENCE_REVIEW'?'Обсудите все слова на общем экране.':
      s.phase==='FINAL_VOTING'?(!s.activeParticipant?'Вы наблюдаете за игрой. Зрители не голосуют.':s.finalVoteSubmitted?'ГОЛОС ПРИНЯТ. Ваш выбор зафиксирован.':pending?'ОТПРАВЛЯЕМ ГОЛОС…':'Выберите игрока.'):
      completed?'':'Смотрите на общий экран.');
    if(draftName&&!error&&!pending)el('final-status').hidden=true;
    const focusedId=el('final-cards').contains(document.activeElement)?document.activeElement.closest('[data-id]')?.dataset.id:null;
    el('final-cards').replaceChildren();
    if(s.phase==='FINAL_VOTING')for(const p of s.participants){
      const card=document.createElement('button');card.type='button';card.className='suspect-card final-vote-card';card.dataset.id=p.id;
      card.title=p.name;card.setAttribute('aria-label',p.name+(p.id===getState().selfId?' · вы':''));
      card.textContent=p.name+(p.id===getState().selfId?' · ВЫ':'');
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
    el('clue-history').hidden=true;el('clue-history-content').replaceChildren();historyKey='';
    el('final-screen').setAttribute('aria-busy','false');el('confirm-vote').hidden=true;el('confirm-vote').disabled=true;
    clearTimeout(timeout);pending=null;selection='';error='';
    for(const id of ['final-title','final-announcement','final-progress','final-status','vote-receipt-value','vote-draft-name','final-personal','result-player'])el(id).textContent='';
    el('final-cards').replaceChildren();el('final-results').replaceChildren();
    el('vote-receipt').hidden=el('vote-draft').hidden=true;
  }
  return {render,tick,event,reset,blackout};
}
