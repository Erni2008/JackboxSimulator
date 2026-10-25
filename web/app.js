'use strict';
const $=id=>document.getElementById(id);
const screens=['join','waiting','question','result','finished','disconnected','suspicion','impostor','final','cursed','ghost','blackout','lastcommand'];
const messages={ROOM_NOT_FOUND:'ROOM NOT FOUND — check the six-character code.',ROOM_IS_FULL:'ROOM IS FULL.',CHARACTER_IN_USE:'That character belongs to another player. Choose a different character.',PLAYER_OFFLINE:'A player is disconnected. Reconnect before starting.',NOT_ENOUGH_PLAYERS:'At least two connected players are required.',GAME_ALREADY_STARTED:'GAME ALREADY STARTED. Only returning guests can rejoin.',INVALID_NICKNAME:'INVALID NICKNAME — use 1–24 characters.',NICKNAME_IN_USE:'That nickname is already taken.',INVALID_PASSWORD:'INVALID PASSWORD.',RATE_LIMITED:'Too many attempts. Wait a moment and try again.',SESSION_ENDED:'Your session has ended. Join a room again.',HOST_DISCONNECTED:'The host disconnected.',HOST_CLOSED_ROOM:'The host closed this room.',SERVER_SHUTDOWN:'The server is restarting. Please join again shortly.',ANSWER_TOO_LATE:"TIME’S UP — your answer arrived after the deadline.",ANSWER_ALREADY_SUBMITTED:'ANSWER SUBMITTED — your first answer is final.',ANSWERING_NOT_STARTED:'Wait for the host to finish presenting the question.',CONNECTION_LOST:'CONNECTION LOST — reconnecting to your seat…',SESSION_REPLACED:'This session was opened in another tab. Join separately to play as another guest.'};
const explanation=code=>messages[code]||String(code||'Connection error. Please try again.').replaceAll('_',' ');
let credentials=null,ws=null,state=null,authenticated=false,generation=0,retries=0,retryTimer=null,heartbeat=null,pending=null,pendingTimer=null,currentScreen='',questionKey='',serverTime=0,receivedAt=0,stopped=false,reconnectAt=0;
const pings=new Map();
const impostorPhoneAudio=createImpostorPhoneAudio();
const heartbeatWatch=createResponseWatchdog({onTimeout:()=>{
  if(!authenticated||stopped||document.hidden)return;
  const socket=ws;lost(generation);socket?.close();
}});
function ping(){
  if(!authenticated)return;
  const requestId=id();pings.clear();pings.set(requestId,performance.now());
  send('PING',{},requestId);if(!document.hidden)heartbeatWatch.arm(requestId);
}
function updateReconnect(){
  if(currentScreen!=='disconnected')return;
  $('reconnect-countdown').textContent=reconnectAt>0?`NEXT ATTEMPT · ${Math.max(0,Math.ceil((reconnectAt-performance.now())/1000))}s`:'';
}
const lastCommand=createLastCommandController({getState:()=>state,isAuthenticated:()=>authenticated,send});
const cursed=createCursedBoxesController({getState:()=>state,isAuthenticated:()=>authenticated,send,makeId:id,explain:explanation});
const finalVoting=createFinalVotingController({getState:()=>state,isAuthenticated:()=>authenticated,send,now,makeId:id});
const impostor=createImpostorController({getState:()=>state,isAuthenticated:()=>authenticated,send,now,makeId:id});
const suspicion=createSuspicionController({getState:()=>state,isAuthenticated:()=>authenticated,send,now,explain:code=>explanation(code),makeId:id});
Object.assign(messages,{SUSPICION_TOO_LATE:'The suspicion deadline has passed.',SUSPICION_CLOSED:'Suspicions are sealed.',INVALID_SUSPECT:'Choose an active participant.',SELF_SUSPICION:'You cannot suspect yourself.',NOT_ELIGIBLE:'You are not eligible in this phase.',STALE_SUSPICION:'This suspicion round has ended.',WRONG_ROOM:'This request belongs to another room.',INVALID_SUSPICION:'Invalid selection. Please reconnect and try again.'});
try{credentials=JSON.parse(sessionStorage.getItem('finalanswer-session')||'null');}catch{credentials=null;}
function id(){return Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16)).join('');}
function show(name){if(currentScreen===name)return;if(currentScreen==='lastcommand')lastCommand.suspend();if(currentScreen==='impostor')impostor.hide();if(currentScreen==='cursed')cursed.suspend();currentScreen=name;document.body.dataset.view=name;if(!['cursed','impostor','suspicion','final'].includes(name))renderControllerPresentation(null);document.body.dataset.controller=name==='cursed'?'cursed':'';screens.forEach(s=>$(s+'-screen').hidden=s!==name);window.scrollTo(0,0);}
function status(text,offline=false){$('connection').textContent=text;$('connection').classList.toggle('offline',offline);}
function save(){try{if(credentials)sessionStorage.setItem('finalanswer-session',JSON.stringify(credentials));else sessionStorage.removeItem('finalanswer-session');}catch{status('Storage unavailable — keep this tab open.',true);}}
function send(type,payload={},requestId=id()){if(ws?.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type,requestId,payload}));return requestId;}
function now(){return serverTime+performance.now()-receivedAt;}
function sessionFields(){return {roomCode:credentials.code,gameId:state.gameId,questionId:state.question.id};}
function stop(){lastCommand.suspend();impostorPhoneAudio.suspend();reconnectAt=0;cursed.reset();suspicion.reset();impostor.reset();finalVoting.reset();stopped=true;generation++;authenticated=false;clearTimeout(retryTimer);clearTimeout(pendingTimer);clearInterval(heartbeat);heartbeatWatch.clear();if(ws){ws.close();ws=null;}}
function end(code){stop();credentials=null;save();state=null;pending=null;$('session-footer').hidden=true;show('join');$('join-error').textContent=explanation(code);status('THE CONNECTION HAS ENDED',true);}
function lost(version){lastCommand.suspend();if(version!==generation||stopped)return;impostorPhoneAudio.suspend();cursed.suspend();suspicion.reset();impostor.suspend();finalVoting.reset();authenticated=false;generation++;clearInterval(heartbeat);heartbeatWatch.clear();clearTimeout(pendingTimer);pending=null;status('CONNECTION LOST',true);show('disconnected');$('retry').hidden=false;
  reconnectAt=0;
  if(++retries>12){$('disconnect-message').textContent='We could not reconnect. Your seat is reserved for this session; try again when the connection returns.';return;}
  const delay=Math.min(15000,500*2**Math.min(retries-1,5))+Math.random()*200;
  reconnectAt=performance.now()+delay;updateReconnect();
  $('disconnect-message').textContent='The signal dropped. Reconnecting to your seat…';
  retryTimer=setTimeout(connect,delay);
}
function connect(){if(!credentials)return;reconnectAt=0;updateReconnect();stopped=false;clearTimeout(retryTimer);clearInterval(heartbeat);heartbeatWatch.clear();const version=++generation;if(ws){ws.onclose=null;ws.close();}authenticated=false;
  status('CONNECTING TO THE SHOW',true);show('disconnected');$('disconnect-message').textContent='Restoring your seat…';
  const socket=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}/ws`);ws=socket;
  const authTimeout=setTimeout(()=>{if(version===generation&&!authenticated)socket.close();},10000);
  socket.onopen=()=>{if(version!==generation){socket.close();return;}send('AUTH',{roomCode:credentials.code,token:credentials.token});};
  socket.onmessage=e=>{if(version!==generation)return;try{handle(JSON.parse(e.data));}catch{status('Could not read a server update. Reconnecting…',true);socket.close();}};
  socket.onclose=e=>{clearTimeout(authTimeout);if(version!==generation)return;if(e.code===4001){end('SESSION_REPLACED');return;}if(e.code===4002){end(e.reason);return;}lost(version);};
  socket.onerror=()=>{socket.close();};
}
function handle(event){const payload=event.payload||{};heartbeatWatch.acknowledge(event.requestId);
  cursed.event(event);suspicion.event(event);impostor.event(event);finalVoting.event(event);
  if(event.type==='CURSED_ACTION_REJECTED'){if(authenticated)send('SYNC');return;}
  if(event.type==='FINAL_VOTE_REJECTED'){if(authenticated)send('SYNC');return;}
  if(event.type==='CLUE_REJECTED'){if(authenticated)send('SYNC');return;}
  if(event.type==='SUSPICION_REJECTED'){suspicion.render();if(authenticated)send('SYNC');return;}
  if(event.type==='ROOM_CLOSED'){end(payload.reason);return;}
  if(event.type==='ERROR'||event.type==='ANSWER_REJECTED'){
    const code=payload.code;
    if(['SESSION_ENDED','ROOM_NOT_FOUND','AUTH_REQUIRED'].includes(code)){end(code);return;}
    if(currentScreen==='lastcommand'){lastCommand.render();if(authenticated&&code!=='RATE_LIMITED')send('SYNC');return;}
    if(currentScreen==='cursed'){cursed.render();if(authenticated)send('SYNC');return;}
    if(currentScreen==='suspicion'){suspicion.render();return;}
    if(currentScreen==='final'){finalVoting.render();return;}
    if(currentScreen==='impostor'){impostor.render();return;}
    pending=null;clearTimeout(pendingTimer);$('answer-status').textContent=explanation(code);status(explanation(code),true);if(event.type==='ANSWER_REJECTED'&&code!=='RATE_LIMITED')send('SYNC');return;
  }
  if(event.type==='AUTHENTICATED'){
    authenticated=true;retries=0;pending=null;status('CONNECTED · YOUR SEAT IS SECURE');
    clearInterval(heartbeat);heartbeatWatch.clear();heartbeat=setInterval(ping,10000);
  }
  if(!payload.roomId)return;
  if(state&&payload.revision<state.revision)return;
  const previousMatch=state?.impostor?.sessionId;
  const oldPhase=state?.impostor?.phase;
  state=payload;
  impostorPhoneAudio.sync(state,event.type);
  const settings=state.impostorSettings;
  document.body.dataset.reducedMotion=String(!!settings?.reducedMotion);
  document.body.dataset.effects=String(settings?.visualEffectsEnabled!==false);
  document.body.dataset.sound=String(settings?.soundEnabled!==false);
  if(settings)$('room-configuration').textContent=`${settings.roundCount} раунда · Слово: ${settings.clueSeconds} с · Обсуждение: ${settings.discussionSeconds} с · Голосование: ${settings.votingSeconds} с`;
  if(event.type==='AUTHENTICATED')document.body.dataset.cinematic='false';
  else if(oldPhase!==state.impostor?.phase)document.body.dataset.cinematic='true';
  if(previousMatch && (previousMatch!==state.impostor?.sessionId || state.impostor?.phase==='REPLAY_PREPARATION')){
    impostor.reset();suspicion.reset();finalVoting.reset();$('impostor-role').textContent='';$('impostor-role-note').textContent='';$('final-announcement').textContent='';$('final-results').replaceChildren();
  }
  serverTime=state.serverTime;receivedAt=performance.now();
  if(pings.has(event.requestId)){serverTime+=Math.min(1000,(receivedAt-pings.get(event.requestId))/2);pings.delete(event.requestId);}
  if(event.type==='ANSWER_ACCEPTED'||state.hasSubmittedAnswer){pending=null;clearTimeout(pendingTimer);}
  if(authenticated)render();
}
function render(){
  renderControllerPresentation(state);
  $('session-footer').hidden=false;$('session-code').textContent=`ROOM ${state.code}`;
  const self=state.players.find(p=>p.id===state.selfId);
  if(state.lastCommand){show('lastcommand');lastCommand.render();return;}
  if(state.cursedBoxes){show('cursed');cursed.render();return;}
  if(state.impostor&&state.impostor.phase!=='READY'&&state.impostor.phase!=='REPLAY_PREPARATION'){
    const phase=state.impostor.phase;
    if(state.impostor.finalPhaseStartedAt){if(impostorPhoneBlackout(state)){finalVoting.blackout();renderControllerPresentation(null);show('blackout');$('session-footer').hidden=true;return;}show('final');finalVoting.render();return;}
    if(phase==='PRELIMINARY_SUSPICION'||phase==='SUSPICION_FINALIZED'){show('suspicion');suspicion.render();}
    else{show('impostor');impostor.render();}return;
  }
  if(state.phase==='LOBBY'||state.phase==='STARTING'){
    show('waiting');$('room-label').textContent=`ROOM ${state.code} · ${state.name}`;
    $('waiting-title').textContent=state.intro?'THE SHOW IS ABOUT TO BEGIN':state.impostor?.phase==='REPLAY_PREPARATION'?'WAITING FOR HOST...':state.phase==='LOBBY'?"You're on the list.":'The doors are closing…';
    $('waiting-message').textContent=state.intro?'Watch the main screen. Your place is saved; answers will open after the introduction.':state.impostor?.phase==='REPLAY_PREPARATION'?'The previous match is complete. The host will start a fresh match.':!state.hostConnected?'Host disconnected. Waiting for reconnection.':state.phase==='LOBBY'?'The host will begin the show shortly.':`${state.roundTitle||'ROUND 1'} · ${Math.max(0,Math.ceil((state.transitionEndsAt-now())/1000))}s`;
    $('player-name').textContent=self?.name||credentials.name;$('character-name').textContent=`${self?.characterId?.replace('_',' ').toUpperCase()||'GUEST'}`;
    const guests=state.players.filter(player=>!player.host);
    $('room-connected').textContent=`${guests.filter(player=>player.connectionStatus==='ONLINE').length} / ${guests.length} CONNECTED`;
    $('room-capacity').max=Math.max(1,state.maxPlayers||8);$('room-capacity').value=guests.length;
    $('players-count').textContent=`THE GUEST LIST · ${guests.length} / ${state.maxPlayers}`;
    const rosterKey=JSON.stringify([state.selfId,guests.map(player=>[player.id,player.name,player.characterId,player.connectionStatus])]);
    if($('players').dataset.roster!==rosterKey){
    $('players').dataset.roster=rosterKey;$('players').replaceChildren();for(const player of guests){
      const row=document.createElement('li'),name=document.createElement('span'),flag=document.createElement('small');
      row.dataset.connection=player.connectionStatus;row.classList.toggle('is-self',player.id===state.selfId);
      name.textContent=player.name;name.className='guest-name';
      if(player.id===state.selfId){const you=document.createElement('span');you.className='guest-you';you.textContent='YOU';name.append(you);}
      flag.textContent=player.connectionStatus==='ONLINE'?'CONNECTED':player.connectionStatus==='OFFLINE'?'RECONNECTING':player.connectionStatus;
      flag.className='guest-connection';row.append(name,flag);$('players').append(row);
    }}return;
  }
  if(state.phase==='GAME_FINISHED'){
    show('finished');$('finish-message').textContent=state.finishReason==='COMPLETED'?'You made it through every question. Thank you for playing.':'The show ended because the host connection was lost.';$('final-score').textContent=`${self?.score||0} POINTS`;renderFinalStandings();return;
  }
  renderLifeRoster();
  if(isGhost(self)&&!state.question){
    show('ghost');$('ghost-player-name').textContent=self.name;
    $('ghost-question').textContent=state.question?.text||'Watch the shared screen.';return;
  }
  if(state.phase==='RESULTS'){
    show('result');const result=state.results.find(r=>r.playerId===state.selfId);$('result-screen').dataset.outcome=!result?.answeredInTime?'timeout':result.isCorrect?'correct':'incorrect';$('result-title').textContent=!result?.answeredInTime?"Time's up!":result.isCorrect?'Correct!':'Wrong answer!';
    $('result-detail').textContent=!result?.answeredInTime?'The clock ran out before an answer was received.':result.isCorrect?'Your answer was correct. Points have been recorded.':'Your answer was incorrect. Watch the shared screen for the next stage.';
    $('correct-answer').textContent=`${state.question.correctAnswerIndex+1}. ${state.question.answers[state.question.correctAnswerIndex]}`;$('result-score').textContent=`${self?.score||0} POINTS · ${state.questionNumber} / ${state.questionCount} QUESTIONS`;return;
  }
  show('question');const q=state.question,key=state.gameId+':'+state.questionNumber+':'+q.id;
  if(questionKey!==key){questionKey=key;pending=null;clearTimeout(pendingTimer);$('question-text').textContent=q.text;$('answers').replaceChildren();q.answers.forEach((answer,index)=>{const button=document.createElement('button'),number=document.createElement('span'),text=document.createElement('span');button.type='button';button.className='answer';button.dataset.index=String(index);number.className='number';number.textContent=String(index+1);text.textContent=answer;button.append(number,text);button.addEventListener('click',()=>submit(index));$('answers').append(button);});}
  $('question-progress').max=Math.max(1,state.questionCount||1);$('question-progress').value=Math.max(0,(state.questionNumber||1)-1);
  $('question-number').textContent=`QUESTION ${String(state.questionNumber).padStart(2,'0')} / ${state.questionCount}`;

  updateClock();updateButtons();
}
function renderFinalStandings(){
  const list=$('final-standings'),rows=finalStandings(state),key=JSON.stringify([state.selfId,rows]);
  if(list.dataset.ranking===key)return;
  list.dataset.ranking=key;list.replaceChildren();
  for(const player of rows){
    const row=document.createElement('li'),rank=document.createElement('span'),identity=document.createElement('div'),name=document.createElement('strong'),life=document.createElement('small'),score=document.createElement('span');
    row.classList.toggle('is-self',player.id===state.selfId);row.dataset.life=player.ghost?'ghost':'alive';
    rank.className='standing-rank';rank.textContent=String(player.rank).padStart(2,'0');
    name.textContent=player.name+(player.id===state.selfId?' · YOU':'');life.textContent=player.ghost?'GHOST':'ALIVE';
    identity.append(name,life);score.className='standing-score';score.textContent=`${player.score} PTS`;
    row.append(rank,identity,score);list.append(row);
  }
}
function isGhost(player){return player?.lifeState==='GHOST'||player?.isGhost===true;}
function renderLifeRoster(){
  const self=state.players.find(player=>player.id===state.selfId),ghost=isGhost(self);
  for(const id of ['question-life-status','result-life-status']){
    const card=$(id),life=ghost?'ghost':'alive';
    card.hidden=!self;
    if(card.dataset.life!==life){
      card.dataset.life=life;
      card.querySelector('span').textContent=ghost?'YOU ARE A GHOST':'YOU ARE ALIVE';
      card.querySelector('p').textContent=ghost?'Keep answering and earning points. In Cursed Boxes, you choose shot targets without risking elimination.':'Answer questions and earn points. Wrong answers may send you to an elimination game.';
    }
  }
  const players=state.players.filter(player=>!player.host);
  for(const id of ['question-life-roster','ghost-life-roster']){
    const target=$(id),key=JSON.stringify([state.selfId,players.map(player=>[player.id,player.name,isGhost(player)])]);
    if(target.dataset.roster===key)continue;
    target.dataset.roster=key;target.replaceChildren();
    const heading=document.createElement('p');heading.className='eyebrow';
    const ghosts=players.filter(isGhost).length;
    heading.textContent=`STILL IN THE GAME · ${players.length-ghosts} ALIVE / ${ghosts} GHOSTS`;target.append(heading);
    const list=document.createElement('ul');
    for(const player of players){
      const item=document.createElement('li'),name=document.createElement('span'),badge=document.createElement('span');
      item.dataset.life=isGhost(player)?'ghost':'alive';item.classList.toggle('is-self',player.id===state.selfId);
      name.textContent=player.name+(player.id===state.selfId?' · YOU':'');
      badge.textContent=isGhost(player)?'GHOST':'ALIVE';
      item.append(name,badge);list.append(item);
    }target.append(list);
  }
}
function updateButtons(){if(!state?.question)return;for(const button of $('answers').children){const index=Number(button.dataset.index);button.disabled=!authenticated||state.phase!=='ANSWERING'||state.hasSubmittedAnswer||pending!==null||now()>=state.deadline;button.classList.toggle('selected',index===(state.hasSubmittedAnswer?state.currentAnswer:pending));button.setAttribute('aria-pressed',String(index===(state.hasSubmittedAnswer?state.currentAnswer:pending)));button.classList.toggle('accepted',state.hasSubmittedAnswer&&index===state.currentAnswer);}}
function updateClock(){if(currentScreen!=='question'||!state)return;
  const view=questionPresentation(state,now());
  const interaction=questionInteraction(state,now(),pending),panel=$('question-screen');
  if(panel.dataset.interaction!==interaction.kind){
    panel.dataset.interaction=interaction.kind;
    $('question-phase').textContent=interaction.label;
    $('answer-status').textContent=interaction.message;
  }
  $('answers').setAttribute('aria-busy',String(interaction.kind==='sending'));
  $('timer').textContent=state.phase==='QUESTION_PRESENTATION'?'—':`${Math.ceil(view.remaining/1000)}s`;
  $('timer').classList.toggle('timer-warning',view.urgent);
  $('answer-clock-fill').style.transform=`scaleX(${view.fraction})`;
  $('answer-clock-fill').classList.toggle('urgent',view.urgent);
  const focusAccepted=!!view.receipt&&$('answer-receipt').hidden&&$('answers').contains(document.activeElement);
  $('answer-receipt').hidden=!view.receipt;
  if(focusAccepted)$('answer-receipt').focus({preventScroll:true});
  $('question-screen').dataset.answerAccepted=String(!!view.receipt);
  // Do not replace accepted text on every timer tick (screen readers and selection).
  if($('answer-receipt-value').textContent!==view.receipt)$('answer-receipt-value').textContent=view.receipt;
  if(view.remaining===0)updateButtons();
}
function submit(index){if(!authenticated||state.phase!=='ANSWERING'||state.hasSubmittedAnswer||pending!==null||now()>=state.deadline)return;pending=index;render();send('SUBMIT_ANSWER',{...sessionFields(),answerIndex:index});pendingTimer=setTimeout(()=>{pending=null;send('SYNC');$('answer-status').textContent='Checking whether your answer was received…';updateButtons();},5000);}
$('join-form').addEventListener('submit',async event=>{event.preventDefault();if($('join-button').disabled)return;
  $('join-error').textContent='';const code=$('room-code').value.trim().toUpperCase(),name=$('nickname').value.trim();
  if(!/^[A-HJ-NP-Z2-9]{6}$/.test(code)){$('join-error').textContent='INVALID CODE — enter the six-character room code.';$('room-code').focus();return;}
  if(!name||name.length>24||/[\u0000-\u001f\u007f]/.test(name)){$('join-error').textContent='INVALID NICKNAME — use 1–24 characters.';$('nickname').focus();return;}
  $('join-button').disabled=true;const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),10000);
  try{const response=await fetch(`/rooms/${encodeURIComponent(code)}/join`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({name,password:$('password').value,characterId:$('character').value}),signal:abort.signal});const data=await response.json();if(!response.ok)throw new Error(explanation(data.error));credentials={code:data.code,token:data.token,name};save();$('password').value='';retries=0;state=null;connect();}catch(error){$('join-error').textContent=error.name==='AbortError'?'CONNECTION LOST — the server did not respond.':error.message||'Unable to join. Please try again.';}finally{clearTimeout(timer);$('join-button').disabled=false;refreshCharacters();}
});
$('room-code').addEventListener('input',()=>{$('room-code').value=$('room-code').value.toUpperCase().replace(/[^A-Z2-9]/g,'');});
$('retry').addEventListener('click',()=>{retries=0;connect();});
$('leave').addEventListener('click',async()=>{const saved=credentials;stop();credentials=null;save();state=null;pending=null;questionKey='';$('session-footer').hidden=true;show('join');status('YOUR SEAT IS WAITING');if(saved)try{await fetch(`/rooms/${encodeURIComponent(saved.code)}/leave`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({token:saved.token})});}catch{/* Disconnect still preserves the seat until the server expires it. */}});
window.addEventListener('online',()=>{if(credentials&&!authenticated){retries=0;connect();}});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){heartbeatWatch.clear();return;}
  if(credentials){if(authenticated){send('SYNC');ping();}else{retries=0;connect();}}
});
window.addEventListener('offline',()=>{if(credentials&&authenticated){const socket=ws;lost(generation);socket?.close();}});
setInterval(()=>{updateReconnect();if(currentScreen==='waiting'&&state?.phase==='STARTING')render();updateClock();if(currentScreen==='suspicion')suspicion.tick();if(currentScreen==='impostor')impostor.tick();if(currentScreen==='final')finalVoting.tick();},100);
if(credentials?.code&&credentials?.token)connect();else show('join');

// QR links carry only the public room code; nickname/password still require the normal join flow.
if(!credentials){const qrRoom=new URLSearchParams(location.search).get('room')?.toUpperCase();if(qrRoom&&/^[A-HJ-NP-Z2-9]{6}$/.test(qrRoom))$('room-code').value=qrRoom;}

let availabilityVersion=0;
async function refreshCharacters(){
  const version=++availabilityVersion,code=$('room-code').value.trim().toUpperCase();
  if(!/^[A-HJ-NP-Z2-9]{6}$/.test(code))return;
  try{const response=await fetch(`/rooms/${encodeURIComponent(code)}`);if(!response.ok)return;
    const room=await response.json();if(version!==availabilityVersion||credentials)return;
    if(!Array.isArray(room.availableCharacters))return;
    for(const option of $('character').options)option.disabled=!room.availableCharacters.includes(option.value);
    if($('character').selectedOptions[0]?.disabled){const free=Array.from($('character').options).find(o=>!o.disabled);if(free)$('character').value=free.value;}
  }catch{/* Normal join reports connection errors. */}
}
$('room-code').addEventListener('change',refreshCharacters);
$('character').addEventListener('focus',refreshCharacters);
setInterval(()=>{if(currentScreen==='join'&&!credentials)refreshCharacters();},3000);
refreshCharacters();

window.addEventListener('pagehide',()=>impostorPhoneAudio.suspend());
window.addEventListener('beforeunload',()=>impostorPhoneAudio.dispose());
