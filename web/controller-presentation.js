'use strict';
/** Presentation uses only personalized state already received by this controller. */
function controllerPresentation(state) {
  const cursed=state?.cursedBoxes, impostor=state?.impostor;
  if(cursed){
    const hiding=cursed.role==='HIDING', selecting=cursed.phase==='HIDING_SELECTION';
    const complete=cursed.phase==='FINISHED', revealing=cursed.phase==='REVEALING';
    return {mode:'cursed',title:'CURSED BOXES',steps:['HIDE','SHOTS','SURVIVORS'],
      step:selecting?0:revealing||complete?2:1,
      label:complete?'THE GALLERY HAS SPOKEN':revealing?'WATCH THE SHARED SCREEN':selecting?(hiding?'YOUR HIDING PLACE IS SECRET':'WAIT FOR THE HIDING PLAYERS'):hiding?'STAY HIDDEN':cursed.canAct?'YOUR TURN TO SHOOT':'WATCH THE SHARED SCREEN',
      note:selecting?(hiding?(cursed.hidingConfirmed?'Confirmed. Your choice is locked.':'Choose a crate below, then confirm your hiding place.'):'Shooting begins after every hiding place is locked.'):revealing?'Only surviving players join the final reveal.':complete?'Your final result appears below.':hiding?'Your character stays in the box you chose.':cursed.canAct?'Select a crate, then press FIRE. Each shot counts.':'Your controls unlock when your turn begins.',
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
