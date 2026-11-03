'use strict';
/**
 * THE CURSED CARDS phone controller. Shows only what the server sends this player: their own card values, how many
 * hidden cards the current source holds, the turn timer and the audience curse vote for spectators. One request in
 * flight per action; the server ignores repeats and refuses stale turns.
 */
function createCursedCardsController({getState,isAuthenticated,send,makeId,now,explain}){
  const el=id=>document.getElementById(id);
  let key='',selected=-1,pending=null,error='',ticker=null;
  const errors={CARDS_NOT_YOUR_TURN:'Wait for your turn.',CARDS_STALE_TURN:'The turn has moved on.',CARDS_TURN_NOT_READY:'Watch the table — your turn begins in a moment.',CARDS_INVALID_SLOT:'Choose one of the hidden cards.',CARDS_VOTE_CLOSED:'The curse has been cast.',CARDS_NOT_SPECTATOR:'Only the audience may curse.',CARDS_INVALID_TARGET:'Choose a seated player.',STALE_CARDS_SESSION:'This match has ended.'};
  const mini=()=>getState()?.cursedCards;
  const name=id=>{const p=getState()?.players?.find(p=>p.id===id);return (p?.nickname||p?.name||'PLAYER').toUpperCase();};
  const art=v=>`/art/cursed_cards/cards/card_${v===0?'death':v}.jpg`;
  function base(){return {roomCode:getState().code,sessionId:mini().sessionId};}
  function reset(){key='';selected=-1;pending=null;error='';clearInterval(ticker);ticker=null;}
  function suspend(){clearInterval(ticker);ticker=null;}
  function seconds(t){return Math.max(0,Math.ceil((t-now())/1000));}
  function render(){
    const s=mini(),root=getState();if(!s)return;
    const k=`${s.sessionId}:${s.phase}:${s.turn??''}`;if(k!==key){key=k;selected=-1;error='';}
    if(!ticker)ticker=setInterval(()=>{if(mini())paintClock();},250);
    const screen=el('cards-screen');screen.dataset.phase=s.phase;screen.dataset.role=s.role;
    el('cards-name').textContent=name(root.selfId);
    el('cards-role').textContent=s.role==='PLAYER'?'AT THE TABLE':'IN THE AUDIENCE';
    // own hand, face up, only ever this player's values
    const hand=el('cards-hand');hand.replaceChildren();
    (s.hand||[]).forEach(v=>{const img=document.createElement('img');img.className='cards-own';img.src=art(v);img.alt=v===0?'DEATH':`Card ${v}`;img.draggable=false;hand.append(img);});
    el('cards-hand-wrap').hidden=s.role!=='PLAYER';
    el('cards-hand-label').textContent=(s.hand||[]).length?`YOUR CARDS · ${(s.hand||[]).length}`:'YOUR HAND IS EMPTY — YOU ARE SAFE';
    // vote (spectators)
    const vote=el('cards-vote');vote.hidden=s.phase!=='CURSE_VOTE';
    if(s.phase==='CURSE_VOTE'){
      const list=el('cards-vote-list');list.replaceChildren();
      for(const id of s.seats){const b=document.createElement('button');b.type='button';b.className='cards-target';b.dataset.nativeButton='';
        b.textContent=name(id);b.classList.toggle('chosen',s.myVote===id);b.disabled=s.role!=='SPECTATOR'||!!pending;
        const tally=document.createElement('span');tally.textContent=s.tally?.[id]?'✦'.repeat(Math.min(5,s.tally[id])):'';b.append(tally);
        b.addEventListener('click',()=>{if(!isAuthenticated()||pending)return;pending=makeId();send('CARDS_VOTE',{...base(),targetId:id},pending);render();});list.append(b);}
      el('cards-vote-title').textContent=s.role==='SPECTATOR'?'CURSE A PLAYER':'THE AUDIENCE IS CHOOSING A CURSE';
    }
    // draw (current drawer)
    const pick=el('cards-pick');const mine=s.phase==='PLAYING'&&s.drawer===root.selfId;pick.hidden=!mine;
    if(mine){const row=el('cards-pick-row');row.replaceChildren();
      for(let i=0;i<(s.sourceCards||0);i++){const b=document.createElement('button');b.type='button';b.className='cards-back';b.dataset.nativeButton='';b.setAttribute('aria-label',`Hidden card ${i+1}`);
        b.classList.toggle('selected',i===selected);b.disabled=!s.canDraw||!!pending;b.addEventListener('click',()=>{selected=i===selected?-1:i;render();});row.append(b);}
      el('cards-pick-title').textContent=`TAKE A CARD FROM ${name(s.source)}`;
      const take=el('cards-take');take.disabled=selected<0||!s.canDraw||!!pending;take.textContent=pending?'TAKING…':selected<0?'CHOOSE A CARD':'TAKE THIS CARD';}
    el('cards-status').textContent=error||statusText(s,root);
    const result=el('cards-result');result.hidden=s.phase!=='FINISHED';
    if(s.phase==='FINISHED'){const lost=s.loser===root.selfId;result.dataset.kind=lost?'cursed':'safe';
      el('cards-result-title').textContent=s.role!=='PLAYER'?`${name(s.loser)} IS CURSED`:lost?'YOU HOLD DEATH':'YOU SURVIVE';
      el('cards-result-detail').textContent=s.role!=='PLAYER'?'Everyone else survives.':lost?'The curse is yours. Watch the table.':`${name(s.loser)} holds DEATH.`;}
    paintClock();
  }
  function statusText(s,root){
    if(s.phase==='CURSE_VOTE')return s.role==='SPECTATOR'?(s.myVote?`YOU CURSED ${name(s.myVote)} · ${s.votes}/${s.voters} VOTED`:'Your curse may bring DEATH closer to them. Nobody learns who truly holds it.'):'The audience is choosing whom to curse…';
    if(s.phase==='DEALING')return s.cursedPlayer?`THE AUDIENCE CURSED ${name(s.cursedPlayer)}. THE DEALER IS DEALING…`:'THE DEALER IS DEALING… WATCH THE TABLE.';
    if(s.phase==='PLAYING'){if(s.drawer===root.selfId)return s.canDraw?'YOUR TURN — pick one hidden card.':'GET READY — your turn begins in a moment.';
      if(s.source===root.selfId)return `${name(s.drawer)} IS TAKING ONE OF YOUR CARDS…`;return `${name(s.drawer)} TAKES FROM ${name(s.source)}.`;}
    return '';
  }
  function paintClock(){const s=mini();const bar=el('cards-clock');if(!s){bar.hidden=true;return;}
    const end=s.phase==='CURSE_VOTE'?s.voteEndsAt:s.phase==='PLAYING'?s.turnDeadline:0,start=s.phase==='PLAYING'?s.turnReadyAt:s.voteEndsAt-12000;
    bar.hidden=!end;if(!end)return;const left=Math.max(0,end-now()),total=Math.max(1,end-start);
    el('cards-clock-fill').style.width=`${Math.min(100,left/total*100)}%`;bar.classList.toggle('urgent',left<3000);el('cards-clock-text').textContent=`${seconds(end)}s`;}
  el('cards-take').addEventListener('click',()=>{const s=mini();if(!s||!s.canDraw||selected<0||pending||!isAuthenticated())return;
    pending=makeId();send('CARDS_DRAW',{...base(),turn:s.turn,slot:selected},pending);render();});
  function event(e){
    if(pending&&e.type==='CARDS_UPDATED'){pending=null;selected=-1;return;}
    if(!pending||e.requestId!==pending)return;
    if(e.type==='ERROR'){error=errors[e.payload?.code]||explain(e.payload?.code);}
    pending=null;selected=-1;render();
  }
  return {render,event,reset,suspend};
}
