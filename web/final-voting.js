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
    for(const title of [faT('ИГРОК', 'PLAYER'),...rounds.map((_,i)=>faT('РАУНД ', 'ROUND ')+(i+1))]){const cell=document.createElement('th');cell.scope='col';cell.textContent=title;row.append(cell);}head.append(row);table.append(head);
    const body=document.createElement('tbody');for(const player of s.participants){const line=document.createElement('tr'),name=document.createElement('th');name.scope='row';name.textContent=player.name;line.append(name);for(const clues of rounds){const cell=document.createElement('td');cell.textContent=clues[player.id]||'—';line.append(cell);}body.append(line);}table.append(body);el('clue-history-content').replaceChildren(table);
  }
  function canVote(target){const s=mini();return isAuthenticated()&&s?.phase==='FINAL_VOTING'&&s.activeParticipant&&!s.finalVoteSubmitted&&!pending&&now()<s.deadline&&target!==getState().selfId;}
  function submit(target){if(!canVote(target))return;pending=makeId();error='';const s=mini();
    send('SUBMIT_FINAL_VOTE',{roomCode:getState().code,sessionId:s.sessionId,suspectId:target},pending);render();
    clearTimeout(timeout);timeout=setTimeout(()=>{pending=null;error=faT('Проверяем, принят ли голос…', 'Checking whether the vote was accepted…');send('SYNC');render();},3000);
  }
  function event(e){if(!pending||e.requestId!==pending)return;
    if(e.type==='FINAL_VOTE_ACCEPTED'){if(getState().impostorSettings?.soundEnabled!==false)document.dispatchEvent(new CustomEvent('impostor:audio',{detail:{cue:'vote_confirmed'}}));pending=null;error='';clearTimeout(timeout);}
    if(e.type==='FINAL_VOTE_REJECTED'||e.type==='ERROR'){
      pending=null;clearTimeout(timeout);error=({SELF_VOTE:faT('Нельзя голосовать за себя.', 'You can\'t vote for yourself.'),INVALID_SUSPECT:faT('Выберите участника этой игры.', 'Choose a player in this game.'),
        FINAL_VOTE_ALREADY_SUBMITTED:faT('Принятый голос изменить нельзя.', 'An accepted vote can\'t be changed.'),FINAL_VOTING_CLOSED:faT('Голосование завершено.', 'Voting is over.'),NOT_ELIGIBLE:faT('Зрители не участвуют в финальном голосовании.', 'Spectators don\'t take part in the final vote.')})[e.payload?.code]||faT('Голос не принят. Обновляем состояние…', 'Vote not accepted. Refreshing the state…');
      render();
    }
  }
  function tick(){const s=mini();if(!s)return;if(impostorPhoneBlackout(getState())){blackout();return;}
    const timed=s.phase==='EVIDENCE_REVIEW'||s.phase==='FINAL_VOTING';
    el('final-timer').classList.toggle('timer-warning',timed&&s.deadline-now()>0&&s.deadline-now()<=5000);
    {const st=getState().impostorSettings||{},dur=(s.phase==='EVIDENCE_REVIEW'?st.discussionSeconds:st.votingSeconds)*1000;el('final-timer').style.setProperty('--left',timed&&dur>0?String(Math.max(0,Math.min(1,(s.deadline-now())/dur))):'1');}text(el('final-timer'),timed?faT(`ОСТАЛОСЬ: ${clockText(Math.max(0,Math.ceil((s.deadline-now())/1000)))}`, `LEFT: ${clockText(Math.max(0,Math.ceil((s.deadline-now())/1000)))}`):'');
    const waitingForName=s.phase==='IMPOSTOR_REVEAL'&&now()-s.finalPhaseStartedAt<2000;
    el('final-announcement').hidden=waitingForName;
    for(const card of el('final-cards').children)disabled(card,!canVote(card.dataset.id));
    disabled(el('confirm-vote'),!selection||!canVote(selection));
  }
  function render(){const s=mini();if(!s)return;if(session!==s.sessionId){reset();session=s.sessionId;}if(impostorPhoneBlackout(getState())){blackout();return;}
    if(s.phase!=='FINAL_VOTING'){selection='';pending=null;clearTimeout(timeout);error='';}
    el('confirm-vote').hidden=s.phase!=='FINAL_VOTING'||!s.activeParticipant||s.finalVoteSubmitted;
    if(s.finalVoteSubmitted){selection=s.ownFinalVote||'';pending=null;clearTimeout(timeout);error='';}
    (el('confirm-vote').querySelector('.fa-label')||el('confirm-vote')).textContent=pending?faT('ОТПРАВЛЯЕМ…', 'SENDING…'):faT('ПОДТВЕРДИТЬ ГОЛОС', 'CONFIRM VOTE');el('final-screen').setAttribute('aria-busy',String(!!pending));
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
    const titles={EVIDENCE_REVIEW:faT('ОБСУЖДЕНИЕ', 'DISCUSSION'),FINAL_VOTING:faT('КТО ИМПОСТОР?', 'WHO IS THE IMPOSTOR?'),VOTING_LOCKED:faT('ГОЛОСОВАНИЕ ЗАКРЫТО', 'VOTING CLOSED'),
      FINAL_VOTE_REVEAL:faT('РАСКРЫВАЕМ ГОЛОСА', 'REVEALING THE VOTES'),SUSPECT_ANNOUNCEMENT:faT('БОЛЬШЕ ВСЕГО ПОДОЗРЕНИЙ…', 'MOST SUSPICIONS…'),
      IMPOSTOR_REVEAL:faT('ИМПОСТОР — ЭТО…', 'THE IMPOSTOR IS…')};
    el('final-screen').dataset.phase=completed?'IMPOSTOR_REVEAL':s.phase;el('final-status').classList.toggle('confirmed',!!s.finalVoteSubmitted);
    el('final-title').textContent=completed?faT('ИМПОСТОР — ЭТО…', 'THE IMPOSTOR IS…'):titles[s.phase]||faT('ИМПОСТОР', 'IMPOSTOR');
    for(const id of ['final-personal','final-waiting-host','result-player','final-results']){el(id).hidden=true;el(id).textContent='';}
    el('final-announcement').textContent=s.revealedImpostorId?faT('ИМПОСТОР: ', 'IMPOSTOR: ')+(names.get(s.revealedImpostorId)||''):
      s.leadingSuspects?(s.leadingSuspects.length===1?names.get(s.leadingSuspects[0]):faT('НЕТ ЕДИНОГО РЕШЕНИЯ · ', 'NO CONSENSUS · ')+s.leadingSuspects.map(id=>names.get(id)).join(', ')):'';
    el('final-status').hidden=completed;
    el('result-player').hidden=completed;
    el('final-results').hidden=completed;
    el('final-progress').textContent=s.phase==='FINAL_VOTING'||s.phase==='VOTING_LOCKED'?faT(`ПРИНЯТО ГОЛОСОВ: ${s.finalSubmittedCount} / ${s.finalEligibleCount}`, `VOTES IN: ${s.finalSubmittedCount} / ${s.finalEligibleCount}`):'';
    el('final-status').textContent=error||(s.phase==='EVIDENCE_REVIEW'?faT('Обсудите все слова на общем экране.', 'Discuss all the words on the shared screen.'):
      s.phase==='FINAL_VOTING'?(!s.activeParticipant?faT('Вы наблюдаете за игрой. Зрители не голосуют.', 'You\'re watching the game. Spectators don\'t vote.'):s.finalVoteSubmitted?faT('ГОЛОС ПРИНЯТ. Ваш выбор зафиксирован.', 'VOTE ACCEPTED. Your choice is locked in.'):pending?faT('ОТПРАВЛЯЕМ ГОЛОС…', 'SENDING VOTE…'):faT('Выберите игрока.', 'Choose a player.')):
      completed?'':faT('Смотрите на общий экран.', 'Look at the shared screen.'));
    if(draftName&&!error&&!pending)el('final-status').hidden=true;
    const focusedId=el('final-cards').contains(document.activeElement)?document.activeElement.closest('[data-id]')?.dataset.id:null;
    el('final-cards').replaceChildren();
    if(s.phase==='FINAL_VOTING')for(const p of s.participants){
      const card=document.createElement('button');card.type='button';card.className='suspect-card final-vote-card';card.dataset.id=p.id;
      card.title=p.name;card.setAttribute('aria-label',p.name+(p.id===getState().selfId?faT(' · вы', ' · you'):''));
      card.dataset.initial=(Array.from(p.name.trim())[0]||'?').toUpperCase();if(p.id===getState().selfId)card.dataset.self='true';card.textContent=p.name;
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
