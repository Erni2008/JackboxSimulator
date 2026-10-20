'use strict';
const $=id=>document.getElementById(id);
const screens=['join','waiting','question','result','finished','disconnected','suspicion','impostor','final'];
const messages={ROOM_NOT_FOUND:'ROOM NOT FOUND — check the six-character code.',ROOM_IS_FULL:'ROOM IS FULL.',CHARACTER_IN_USE:'That character belongs to another player. Choose a different character.',PLAYER_OFFLINE:'A player is disconnected. Reconnect before starting.',NOT_ENOUGH_PLAYERS:'At least two connected players are required.',GAME_ALREADY_STARTED:'GAME ALREADY STARTED. Only returning guests can rejoin.',INVALID_NICKNAME:'INVALID NICKNAME — use 1–24 characters.',NICKNAME_IN_USE:'That nickname is already taken.',INVALID_PASSWORD:'INVALID PASSWORD.',RATE_LIMITED:'Too many attempts. Wait a moment and try again.',SESSION_ENDED:'Your session has ended. Join a room again.',HOST_DISCONNECTED:'The host disconnected.',HOST_CLOSED_ROOM:'The host closed this room.',SERVER_SHUTDOWN:'The server is restarting. Please join again shortly.',ANSWER_TOO_LATE:"TIME’S UP — your answer arrived after the deadline.",ANSWER_ALREADY_SUBMITTED:'ANSWER SUBMITTED — your first answer is final.',ANSWERING_NOT_STARTED:'Wait for the host to finish presenting the question.',CONNECTION_LOST:'CONNECTION LOST — reconnecting to your seat…',SESSION_REPLACED:'This session was opened in another tab. Join separately to play as another guest.'};
const explanation=code=>messages[code]||String(code||'Connection error. Please try again.').replaceAll('_',' ');
let credentials=null,ws=null,state=null,authenticated=false,generation=0,retries=0,retryTimer=null,heartbeat=null,pending=null,pendingTimer=null,currentScreen='',questionKey='',serverTime=0,receivedAt=0,stopped=false;
const pings=new Map();
const finalVoting=createFinalVotingController({getState:()=>state,isAuthenticated:()=>authenticated,send,now,makeId:id});
const impostor=createImpostorController({getState:()=>state,isAuthenticated:()=>authenticated,send,now,makeId:id});
const suspicion=createSuspicionController({getState:()=>state,isAuthenticated:()=>authenticated,send,now,explain:code=>explanation(code),makeId:id});
Object.assign(messages,{SUSPICION_TOO_LATE:'The suspicion deadline has passed.',SUSPICION_CLOSED:'Suspicions are sealed.',INVALID_SUSPECT:'Choose an active participant.',SELF_SUSPICION:'You cannot suspect yourself.',NOT_ELIGIBLE:'You are not eligible in this phase.',STALE_SUSPICION:'This suspicion round has ended.',WRONG_ROOM:'This request belongs to another room.',INVALID_SUSPICION:'Invalid selection. Please reconnect and try again.'});
try{credentials=JSON.parse(sessionStorage.getItem('finalanswer-session')||'null');}catch{credentials=null;}
function id(){return Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16)).join('');}
function show(name){if(currentScreen===name)return;if(currentScreen==='impostor')impostor.hide();currentScreen=name;screens.forEach(s=>$(s+'-screen').hidden=s!==name);window.scrollTo(0,0);}
function status(text,offline=false){$('connection').textContent=text;$('connection').classList.toggle('offline',offline);}
function save(){try{if(credentials)sessionStorage.setItem('finalanswer-session',JSON.stringify(credentials));else sessionStorage.removeItem('finalanswer-session');}catch{status('Storage unavailable — keep this tab open.',true);}}
function send(type,payload={},requestId=id()){if(ws?.readyState===WebSocket.OPEN)ws.send(JSON.stringify({type,requestId,payload}));return requestId;}
function now(){return serverTime+performance.now()-receivedAt;}
function sessionFields(){return {roomCode:credentials.code,gameId:state.gameId,questionId:state.question.id};}
function stop(){suspicion.reset();impostor.reset();finalVoting.reset();stopped=true;generation++;authenticated=false;clearTimeout(retryTimer);clearTimeout(pendingTimer);clearInterval(heartbeat);if(ws){ws.close();ws=null;}}
function end(code){stop();credentials=null;save();state=null;pending=null;$('session-footer').hidden=true;show('join');$('join-error').textContent=explanation(code);status('THE CONNECTION HAS ENDED',true);}
function lost(version){if(version!==generation||stopped)return;suspicion.reset();impostor.suspend();finalVoting.reset();authenticated=false;generation++;clearInterval(heartbeat);clearTimeout(pendingTimer);pending=null;status('CONNECTION LOST',true);show('disconnected');$('retry').hidden=false;
  if(++retries>12){$('disconnect-message').textContent='We could not reconnect. Your seat is reserved for this session; try again when the connection returns.';return;}
  const delay=Math.min(15000,500*2**Math.min(retries-1,5))+Math.random()*200;
  $('disconnect-message').textContent=`Reconnecting in ${Math.ceil(delay/1000)}s. Your accepted answer is saved on the server.`;
  retryTimer=setTimeout(connect,delay);
}
function connect(){if(!credentials)return;stopped=false;clearTimeout(retryTimer);clearInterval(heartbeat);const version=++generation;if(ws){ws.onclose=null;ws.close();}authenticated=false;
  status('CONNECTING TO THE SHOW',true);show('disconnected');$('disconnect-message').textContent='Restoring your seat…';
  const socket=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}/ws`);ws=socket;
  const authTimeout=setTimeout(()=>{if(version===generation&&!authenticated)socket.close();},10000);
  socket.onopen=()=>{if(version!==generation){socket.close();return;}send('AUTH',{roomCode:credentials.code,token:credentials.token});};
  socket.onmessage=e=>{if(version!==generation)return;try{handle(JSON.parse(e.data));}catch{status('Could not read a server update. Reconnecting…',true);socket.close();}};
  socket.onclose=e=>{clearTimeout(authTimeout);if(version!==generation)return;if(e.code===4001){end('SESSION_REPLACED');return;}if(e.code===4002){end(e.reason);return;}lost(version);};
  socket.onerror=()=>{socket.close();};
}
function handle(event){const payload=event.payload||{};
  suspicion.event(event);impostor.event(event);finalVoting.event(event);
  if(event.type==='FINAL_VOTE_REJECTED'){if(authenticated)send('SYNC');return;}
  if(event.type==='CLUE_REJECTED'){if(authenticated)send('SYNC');return;}
  if(event.type==='SUSPICION_REJECTED'){suspicion.render();if(authenticated)send('SYNC');return;}
  if(event.type==='ROOM_CLOSED'){end(payload.reason);return;}
  if(event.type==='ERROR'||event.type==='ANSWER_REJECTED'){
    const code=payload.code;
    if(['SESSION_ENDED','ROOM_NOT_FOUND','AUTH_REQUIRED'].includes(code)){end(code);return;}
    if(currentScreen==='suspicion'){suspicion.render();return;}
    if(currentScreen==='final'){finalVoting.render();return;}
    if(currentScreen==='impostor'){impostor.render();return;}
    pending=null;clearTimeout(pendingTimer);$('answer-status').textContent=explanation(code);status(explanation(code),true);if(event.type==='ANSWER_REJECTED'&&code!=='RATE_LIMITED')send('SYNC');return;
  }
  if(event.type==='AUTHENTICATED'){
    authenticated=true;retries=0;pending=null;status('CONNECTED · YOUR SEAT IS SECURE');
    clearInterval(heartbeat);heartbeat=setInterval(()=>{if(authenticated){const requestId=id();pings.clear();pings.set(requestId,performance.now());send('PING',{},requestId);}},10000);
  }
  if(!payload.roomId)return;
  if(state&&payload.revision<state.revision)return;
  const previousMatch=state?.impostor?.sessionId;
  const oldPhase=state?.impostor?.phase;
  state=payload;
  const settings=state.impostorSettings;
  document.body.dataset.reducedMotion=String(!!settings?.reducedMotion);
  document.body.dataset.effects=String(settings?.visualEffectsEnabled!==false);
  document.body.dataset.sound=String(settings?.soundEnabled!==false);
  if(settings)$('room-configuration').textContent=`${settings.roundCount} ROUNDS · CLUES ${settings.clueSeconds}s · DISCUSSION ${settings.discussionSeconds}s · VOTING ${settings.votingSeconds}s · WORDS: ${settings.wordCategory}`;
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
  $('session-footer').hidden=false;$('session-code').textContent=`ROOM ${state.code}`;
  const self=state.players.find(p=>p.id===state.selfId);
  if(state.impostor&&state.impostor.phase!=='READY'&&state.impostor.phase!=='REPLAY_PREPARATION'){
    const phase=state.impostor.phase;
    if(state.impostor.finalPhaseStartedAt){show('final');finalVoting.render();return;}
    if(phase==='PRELIMINARY_SUSPICION'||phase==='SUSPICION_FINALIZED'){show('suspicion');suspicion.render();}
    else{show('impostor');impostor.render();}return;
  }
  if(state.phase==='LOBBY'||state.phase==='STARTING'){
    show('waiting');$('room-label').textContent=`ROOM ${state.code} · ${state.name}`;
    $('waiting-title').textContent=state.impostor?.phase==='REPLAY_PREPARATION'?'WAITING FOR HOST...':state.phase==='LOBBY'?"You're on the list.":'The doors are closing…';
    $('waiting-message').textContent=state.impostor?.phase==='REPLAY_PREPARATION'?'The previous match is complete. The host will start a fresh match.':!state.hostConnected?'Host disconnected. Waiting for reconnection.':state.phase==='LOBBY'?'The host will begin the show shortly.':`${state.roundTitle||'ROUND 1'} · ${Math.max(0,Math.ceil((state.transitionEndsAt-now())/1000))}s`;
    $('player-name').textContent=self?.name||credentials.name;$('character-name').textContent=`${self?.characterId?.replace('_',' ').toUpperCase()||'GUEST'}`;
    $('players-count').textContent=`THE GUEST LIST · ${state.players.length} / ${state.maxPlayers}`;
    $('players').replaceChildren();for(const player of state.players){const row=document.createElement('li'),name=document.createElement('span'),flag=document.createElement('small');name.textContent=player.name;flag.textContent=player.connectionStatus;row.append(name,flag);$('players').append(row);}return;
  }
  if(state.phase==='GAME_FINISHED'){
    show('finished');$('finish-message').textContent=state.finishReason==='COMPLETED'?'You made it through every question. Thank you for playing.':'The show ended because the host connection was lost.';$('final-score').textContent=`${self?.score||0} POINTS`;return;
  }
  if(state.phase==='RESULTS'){
    show('result');const result=state.results.find(r=>r.playerId===state.selfId);$('result-title').textContent=!result?.answeredInTime?"Time's up!":result.isCorrect?'Correct!':'Wrong answer!';
    $('correct-answer').textContent=`${state.question.correctAnswerIndex+1}. ${state.question.answers[state.question.correctAnswerIndex]}`;$('result-score').textContent=`${self?.score||0} POINTS · ${state.questionNumber} / ${state.questionCount} QUESTIONS`;return;
  }
  show('question');const q=state.question,key=state.gameId+':'+q.id;
  if(questionKey!==key){questionKey=key;pending=null;clearTimeout(pendingTimer);$('question-text').textContent=q.text;$('answers').replaceChildren();q.answers.forEach((answer,index)=>{const button=document.createElement('button'),number=document.createElement('span'),text=document.createElement('span');button.type='button';button.className='answer';button.dataset.index=String(index);number.className='number';number.textContent=String(index+1);text.textContent=answer;button.append(number,text);button.addEventListener('click',()=>submit(index));$('answers').append(button);});}
  $('question-number').textContent=`QUESTION ${String(state.questionNumber).padStart(2,'0')} / ${state.questionCount}`;
  $('answer-status').textContent=state.phase==='QUESTION_PRESENTATION'?'Listen to the question. Answers unlock together when the host finishes presenting.':state.phase==='REVEALING'?'THE HOUSE IS DECIDING. Watch the host’s screen…':state.hasSubmittedAnswer?'ANSWER SUBMITTED. Your choice is final.':pending!==null?'SENDING YOUR ANSWER…':'Choose carefully. One final answer.';
  updateButtons();updateClock();
}
function updateButtons(){if(!state?.question)return;for(const button of $('answers').children){const index=Number(button.dataset.index);button.disabled=!authenticated||state.phase!=='ANSWERING'||state.hasSubmittedAnswer||pending!==null||now()>=state.deadline;button.classList.toggle('selected',index===(state.hasSubmittedAnswer?state.currentAnswer:pending));}}
function updateClock(){if(currentScreen!=='question'||!state)return;const remaining=state.phase==='ANSWERING'?Math.max(0,state.deadline-now()):0;$('timer').textContent=state.phase==='QUESTION_PRESENTATION'?'—':`${Math.ceil(remaining/1000)}s`;if(remaining===0)updateButtons();}
function submit(index){if(!authenticated||state.phase!=='ANSWERING'||state.hasSubmittedAnswer||pending!==null||now()>=state.deadline)return;pending=index;render();send('SUBMIT_ANSWER',{...sessionFields(),answerIndex:index});pendingTimer=setTimeout(()=>{pending=null;send('SYNC');$('answer-status').textContent='Checking whether your answer was received…';updateButtons();},5000);}
$('join-form').addEventListener('submit',async event=>{event.preventDefault();if($('join-button').disabled)return;
  $('join-error').textContent='';const code=$('room-code').value.trim().toUpperCase(),name=$('nickname').value.trim();
  if(!/^[A-HJ-NP-Z2-9]{6}$/.test(code)){$('join-error').textContent='INVALID CODE — enter the six-character room code.';$('room-code').focus();return;}
  if(!name||name.length>24||/[\u0000-\u001f\u007f]/.test(name)){$('join-error').textContent='INVALID NICKNAME — use 1–24 characters.';$('nickname').focus();return;}
  $('join-button').disabled=true;const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),10000);
  try{const response=await fetch(`/rooms/${encodeURIComponent(code)}/join`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({name,password:$('password').value,characterId:$('character').value}),signal:abort.signal});const data=await response.json();if(!response.ok)throw new Error(explanation(data.error));credentials={code:data.code,token:data.token,name};save();$('password').value='';retries=0;state=null;connect();}catch(error){$('join-error').textContent=error.name==='AbortError'?'CONNECTION LOST — the server did not respond.':error.message||'Unable to join. Please try again.';}finally{clearTimeout(timer);$('join-button').disabled=false;refreshCharacters();}
});
$('room-code').addEventListener('input',()=>{$('room-code').value=$('room-code').value.toUpperCase().replace(/[^A-Z2-9]/g,'');});
$('retry').addEventListener('click',()=>{stop();retries=0;connect();});
$('leave').addEventListener('click',async()=>{const saved=credentials;stop();credentials=null;save();state=null;pending=null;questionKey='';$('session-footer').hidden=true;show('join');status('YOUR SEAT IS WAITING');if(saved)try{await fetch(`/rooms/${encodeURIComponent(saved.code)}/leave`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({token:saved.token})});}catch{/* Disconnect still preserves the seat until the server expires it. */}});
window.addEventListener('online',()=>{if(credentials&&!authenticated){retries=0;connect();}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&credentials){if(authenticated)send('SYNC');else{retries=0;connect();}}});
setInterval(()=>{if(currentScreen==='waiting'&&state?.phase==='STARTING')render();updateClock();if(currentScreen==='suspicion')suspicion.tick();if(currentScreen==='impostor')impostor.tick();if(currentScreen==='final')finalVoting.tick();},100);
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
