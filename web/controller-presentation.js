'use strict';
/** Presentation uses only personalized state already received by this controller. */
function controllerPresentation(state) {
  const cursed=state?.cursedBoxes, impostor=state?.impostor;
  if(cursed){
    const hiding=cursed.role==='HIDING', selecting=cursed.phase==='HIDING_SELECTION';
    const complete=cursed.phase==='FINISHED', elimination=cursed.phase==='ELIMINATION', revealing=cursed.phase==='REVEALING';
    return {mode:'cursed',title:'CURSED BOXES',steps:['HIDE','SHOTS','SURVIVORS'],
      step:selecting?0:elimination||revealing||complete?2:1,
      label:cursed.phase==='TARGET_SELECTION'?(cursed.targetConfirmed?'YOUR TARGET IS SEALED':'CHOOSE YOUR SECRET TARGET'):elimination?'THE FALLEN BECOME GHOSTS':complete?'THE GALLERY HAS SPOKEN':revealing?'WATCH THE SHARED SCREEN':selecting?(hiding?'YOUR HIDING PLACE IS SECRET':'WAIT FOR THE HIDING PLAYERS'):hiding?'STAY HIDDEN':cursed.canAct?'YOUR TURN TO SHOOT':'WATCH THE SHARED SCREEN',
      note:cursed.phase==='TARGET_SELECTION'?'All targets lock before firing. Matching choices produce one shot.':cursed.role==='SPECTATOR'?'You are observing this round. Follow the action on the shared screen.':elimination?'Stay connected. A fallen player’s story is not over.':selecting?(hiding?(cursed.hidingConfirmed?'Confirmed. Your choice is locked.':'Choose a crate below, then confirm your hiding place.'):'Shooting begins after every hiding place is locked.'):revealing?'Only surviving players join the final reveal.':complete?'Your final result appears below.':hiding?'Your character stays in the box you chose.':cursed.canAct?'Select a crate, then press FIRE. Each shot counts.':'Your controls unlock when your turn begins.',
      tone:complete?'complete':selecting&&hiding&&cursed.hidingConfirmed?'confirmed':!selecting&&cursed.canAct?'active':'quiet'};
  }
  if(impostor&&!['READY','REPLAY_PREPARATION'].includes(impostor.phase)){
    const phase=impostor.phase, final=!!impostor.finalPhaseStartedAt;
    const role=phase==='ROLE_REVEAL', writing=phase==='ROUND_CLUE_INPUT';
    return {mode:'impostor',title:'THE IMPOSTOR',steps:['ROLE','CLUES','VERDICT'],step:final?2:role?0:1,
      label:role?'FOR YOUR EYES ONLY':writing?(impostor.clueSubmitted?'YOUR CLUE IS SEALED':impostor.activeParticipant?'WRITE YOUR CLUE':'WATCH THE SHARED SCREEN'):final?'THE FINAL ACT':'FOLLOW THE EVIDENCE',
      note:role?'Keep your screen private. Do not reveal your role.':writing?(impostor.clueSubmitted?'You can relax. Waiting for the other players.':impostor.activeParticipant?'One word. Up to 10 letters. Make it convincing.':'The active players are preparing their clues.'):'Follow the instructions below. The shared screen tells the story.',
      tone:writing&&impostor.clueSubmitted?'confirmed':writing&&impostor.activeParticipant?'active':'quiet'};
  }
  return null;
}
function renderControllerPresentation(state) {
  const panel=document.getElementById('controller-director'),view=controllerPresentation(state);
  panel.hidden=!view;
  if(!view){delete document.body.dataset.mode;delete document.body.dataset.presentationPhase;return;}
  document.body.dataset.mode=view.mode;document.body.dataset.presentationPhase=state.cursedBoxes?.phase||state.impostor?.phase||'';panel.dataset.tone=view.tone;
  document.getElementById('director-mode').textContent=view.title;
  document.getElementById('director-label').textContent=view.label;
  document.getElementById('director-note').textContent=view.note;
  const items=panel.querySelectorAll('.director-step');
  items.forEach((item,index)=>{
    item.textContent=view.steps[index];item.dataset.state=index<view.step?'done':index===view.step?'current':'next';
    if(index===view.step)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');
  });
}

/** A receipt is authoritative: a pending tap must never be presented as accepted. */
function questionPresentation(state,time) {
  const answering=state?.phase==='ANSWERING';
  const deadline=Number(state?.deadline),start=Number(state?.answeringStartedAt);
  const remaining=answering&&Number.isFinite(deadline)?Math.max(0,deadline-time):0;
  const duration=deadline-start;
  const fraction=answering&&Number.isFinite(duration)&&duration>0?Math.max(0,Math.min(1,remaining/duration)):0;
  const index=state?.currentAnswer,answers=state?.question?.answers;
  const accepted=!!state?.hasSubmittedAnswer&&['ANSWERING','REVEALING'].includes(state.phase)&&Number.isInteger(index)&&index>=0&&index<(answers?.length||0);
  return {remaining,fraction,urgent:answering&&remaining>0&&remaining<=5000,
    receipt:accepted?`${String(index+1).padStart(2,'0')} · ${answers[index]}`:''};
}

/** Local feedback never claims server acceptance from a pending tap. */
function questionInteraction(state,time,pending=null) {
  const view=questionPresentation(state,time);
  if(view.receipt)return {kind:'accepted',label:'ANSWER LOCKED',message:'ANSWER SUBMITTED. Your choice is final.'};
  if(state?.phase==='QUESTION_PRESENTATION')return {kind:'waiting',label:'LISTEN CLOSELY',message:'Listen to the question. Answers unlock together when the host finishes presenting.'};
  if(pending!==null)return {kind:'sending',label:'AWAITING CONFIRMATION',message:'Sending your answer. Waiting for confirmation from the server…'};
  if(state?.phase!=='ANSWERING'||view.remaining===0)return {kind:'closed',label:'ANSWERS CLOSED',message:'Answers are closed. Watch the shared screen for the reveal.'};
  return {kind:'ready',label:'YOUR FINAL ANSWER',message:'Choose carefully. One final answer.'};
}

/** Public score ranking, never a survival decision. Equal scores share their rank. */
function finalStandings(state) {
  if(state?.phase!=='GAME_FINISHED')return [];
  const players=(state.players||[]).filter(player=>!player.host).map(player=>({
    id:player.id,name:player.name,score:Number.isFinite(player.score)?player.score:0,
    ghost:player.lifeState==='GHOST'||player.isGhost===true
  })).sort((a,b)=>b.score-a.score||(a.id<b.id?-1:a.id>b.id?1:0));
  let rank=0,lastScore=null;
  return players.map((player,index)=>{if(player.score!==lastScore){rank=index+1;lastScore=player.score;}return {...player,rank};});
}

/** Phones go dark after their accepted final vote and throughout the public reveal. */
function impostorPhoneBlackout(state){
  const mini=state?.impostor;if(!mini)return false;
  return ['VOTING_LOCKED','FINAL_VOTE_REVEAL','SUSPECT_ANNOUNCEMENT','IMPOSTOR_REVEAL','RESULT','COMPLETE'].includes(mini.phase)
    ||mini.phase==='FINAL_VOTING'&&mini.finalVoteSubmitted===true;
}
