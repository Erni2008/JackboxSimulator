'use strict';
/**
 * THE CURSED CARDS phone controller. Shows only what the server sends this player: their own card values (in the
 * server's order), how many hidden cards the current source holds, a five-second countdown and the audience curse vote.
 * One tap on a face-down card takes it (sent with the hand revision the phone showed). SHUFFLE reorders the player's
 * own hand on the server, as often as they like; animations are visual only and never wait for or block the server.
 */
function createCursedCardsController({getState,isAuthenticated,send,makeId,now,explain}){
  const el=id=>document.getElementById(id);
  let key='',tapped=-1,pending=null,error='',ticker=null,lastShuffleSent=0,lastSecond=-1,ownOrder='',backsRev=null,audio=null;
  const errors={CARDS_NOT_YOUR_TURN:'Wait for your turn.',CARDS_STALE_TURN:'The turn has moved on.',CARDS_TURN_NOT_READY:'Watch the table — your turn begins in a moment.',CARDS_INVALID_SLOT:'Choose one of the hidden cards.',CARDS_STALE_HAND:'The cards moved — tap again.',CARDS_TURN_EXPIRED:'Too late — fate chose for you.',CARDS_NOTHING_TO_SHUFFLE:'Nothing to shuffle.',CARDS_VOTE_CLOSED:'The curse has been cast.',CARDS_NOT_SPECTATOR:'Only the audience may curse.',CARDS_INVALID_TARGET:'Choose a seated player.',STALE_CARDS_SESSION:'This match has ended.'};
  const mini=()=>getState()?.cursedCards;
  const name=id=>{const p=getState()?.players?.find(p=>p.id===id);return (p?.nickname||p?.name||'PLAYER').toUpperCase();};
  const art=v=>`/art/cursed_cards/cards/card_${v===0?'death':v}.jpg`;
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  function base(){return {roomCode:getState().code,sessionId:mini().sessionId};}
  function reset(){key='';tapped=-1;pending=null;error='';ownOrder='';backsRev=null;lastSecond=-1;clearInterval(ticker);ticker=null;}
  function suspend(){clearInterval(ticker);ticker=null;}
  // ---- tiny synthesized sounds (no assets needed): a paper riffle and a soft final-second tick ----
  function ctx(){try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();return audio;}catch(e){return null;}}
  function riffle(){const a=ctx();if(!a)return;const len=Math.floor(a.sampleRate*.22),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++){const t=i/len,flick=(Math.sin(t*90)>.6?1:.25);d[i]=(Math.random()*2-1)*flick*(1-t)*.5;}
    const src=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();f.type='bandpass';f.frequency.value=2600;f.Q.value=.8;g.gain.value=.22;src.buffer=buf;src.connect(f).connect(g).connect(a.destination);src.start();}
  function tick(){const a=ctx();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=880;g.gain.setValueAtTime(.0001,a.currentTime);
    g.gain.exponentialRampToValueAtTime(.12,a.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.16);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.18);}
  /** FLIP: remember where each element was, then glide from there to its new place with a slight lift. */
  function flip(container,keyOf,mutate){
    const before=new Map();if(!reduced())for(const n of container.children)before.set(keyOf(n),n.getBoundingClientRect());
    mutate();if(reduced())return;
    for(const n of container.children){const r0=before.get(keyOf(n));if(!r0)continue;const r1=n.getBoundingClientRect(),dx=r0.left-r1.left;if(Math.abs(dx)<1)continue;
      n.getAnimations().forEach(a=>a.cancel());
      n.animate([{transform:`translate(${dx}px,0)`},{transform:`translate(${dx*.5}px,-14px) rotate(${dx>0?-4:4}deg)`,offset:.45},{transform:'translate(0,0)'}],{duration:340,easing:'cubic-bezier(.3,.7,.2,1)'});}
  }
  function render(){
    const s=mini(),root=getState();if(!s)return;
    const k=`${s.sessionId}:${s.phase}:${s.turn??''}`;if(k!==key){key=k;tapped=-1;backsRev=null;if(error!==errors.CARDS_TURN_EXPIRED)error='';}
    if(!ticker)ticker=setInterval(()=>{if(mini())paintClock();},100);
    const screen=el('cards-screen');screen.dataset.phase=s.phase;screen.dataset.role=s.role;
    el('cards-name').textContent=name(root.selfId);
    el('cards-role').textContent=s.role==='PLAYER'?'AT THE TABLE':'IN THE AUDIENCE';
    // own hand, face up, in the server's order; reorders glide (values are unique in a hand: pairs are discarded)
    const hand=el('cards-hand'),values=s.hand||[],order=values.join(',');
    if(order!==ownOrder){const grew=ownOrder.split(',').filter(Boolean).length!==values.length;ownOrder=order;
      const build=()=>{hand.replaceChildren();values.forEach(v=>{const img=document.createElement('img');img.className='cards-own';img.src=art(v);img.alt=v===0?'DEATH':`Card ${v}`;img.draggable=false;img.dataset.v=v;hand.append(img);});};
      if(grew)build();else flip(hand,n=>n.dataset.v,build);}
    el('cards-hand-wrap').hidden=s.role!=='PLAYER';
    el('cards-hand-label').textContent=values.length?`YOUR CARDS · ${values.length}`:'YOUR HAND IS EMPTY — YOU ARE SAFE';
    const shuffle=el('cards-shuffle');shuffle.disabled=values.length<2||!['PLAYING','DEALING'].includes(s.phase);
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
    // draw (current drawer): one tap takes the card
    const pick=el('cards-pick');const mine=s.phase==='PLAYING'&&s.drawer===root.selfId;pick.hidden=!mine;
    if(mine){const row=el('cards-pick-row'),n=s.sourceCards||0;
      if(row.children.length!==n){row.replaceChildren();for(let i=0;i<n;i++){const b=document.createElement('button');b.type='button';b.className='cards-back';b.dataset.nativeButton='';b.setAttribute('aria-label',`Hidden card ${i+1}`);
        b.addEventListener('click',()=>take(i));row.append(b);}}
      else if(backsRev!==null&&backsRev!==s.sourceRevision&&!reduced()){// the owner shuffled: the backs trade places
        [...row.children].forEach((b,i)=>{b.getAnimations().forEach(a=>a.cancel());const dx=(Math.random()-.5)*row.clientWidth*.5;
          b.animate([{transform:'translate(0,0)'},{transform:`translate(${dx}px,-12px) rotate(${dx>0?5:-5}deg)`,offset:.45},{transform:'translate(0,0)'}],{duration:320,easing:'cubic-bezier(.3,.7,.2,1)'});});}
      backsRev=s.sourceRevision;
      [...row.children].forEach((b,i)=>{b.classList.toggle('selected',i===tapped);b.disabled=!s.canDraw||!!pending;});
      el('cards-pick-title').textContent=s.canDraw?`TAP A CARD — FROM ${name(s.source)}`:`GET READY — ${name(s.source)}'S CARDS`;}
    else backsRev=null;
    el('cards-status').textContent=error||statusText(s,root);
    const result=el('cards-result');result.hidden=s.phase!=='FINISHED';
    if(s.phase==='FINISHED'){const lost=s.loser===root.selfId;result.dataset.kind=lost?'cursed':'safe';
      el('cards-result-title').textContent=s.role!=='PLAYER'?`${name(s.loser)} IS CURSED`:lost?'YOU HOLD DEATH':'YOU SURVIVE';
      el('cards-result-detail').textContent=s.role!=='PLAYER'?'Everyone else survives.':lost?'The curse is yours. Watch the table.':`${name(s.loser)} holds DEATH.`;}
    paintClock();
  }
  function take(i){const s=mini();if(!s||!s.canDraw||pending||!isAuthenticated())return;tapped=i;error='';
    pending=makeId();send('CARDS_DRAW',{...base(),turn:s.turn,slot:i,revision:s.sourceRevision},pending);if(navigator.vibrate)navigator.vibrate(12);render();}
  function statusText(s,root){
    if(s.phase==='CURSE_VOTE')return s.role==='SPECTATOR'?(s.myVote?`YOU CURSED ${name(s.myVote)} · ${s.votes}/${s.voters} VOTED`:'Your curse may bring DEATH closer to them. Nobody learns who truly holds it.'):'The audience is choosing whom to curse…';
    if(s.phase==='DEALING')return s.cursedPlayer?`THE AUDIENCE CURSED ${name(s.cursedPlayer)}. THE DEALER IS DEALING…`:'THE DEALER IS DEALING… WATCH THE TABLE.';
    if(s.phase==='PLAYING'){if(s.drawer===root.selfId)return s.canDraw?(pending?'TAKING…':'Five seconds. One tap.'):'GET READY — your turn begins in a moment.';
      if(s.source===root.selfId)return `${name(s.drawer)} IS TAKING ONE OF YOUR CARDS — SHUFFLE!`;return `${name(s.drawer)} TAKES FROM ${name(s.source)}.`;}
    return '';
  }
  function paintClock(){const s=mini();const bar=el('cards-clock');if(!s){bar.hidden=true;return;}
    const playing=s.phase==='PLAYING',end=s.phase==='CURSE_VOTE'?s.voteEndsAt:playing?s.turnDeadline:0,start=playing?s.turnReadyAt:s.voteEndsAt-10000;
    bar.hidden=!end;if(!end)return;const t=now(),left=Math.max(0,end-Math.max(t,start)),total=Math.max(1,end-start),secs=Math.ceil(left/1000);
    el('cards-clock-fill').style.width=`${Math.min(100,left/total*100)}%`;bar.classList.toggle('urgent',left<=1000&&left>0);el('cards-clock-text').textContent=`${secs}s`;
    const count=el('cards-count'),mine=playing&&s.drawer===getState().selfId;
    if(mine&&s.canDraw){if(count.textContent!==String(secs)){count.textContent=String(secs);count.parentElement.classList.remove('beat');void count.offsetWidth;count.parentElement.classList.add('beat');}
      count.parentElement.classList.toggle('urgent',left<=1000&&left>0);
      if(secs===1&&lastSecond!==1&&!pending)tick();lastSecond=secs;}
    else{count.textContent='';lastSecond=-1;}
  }
  el('cards-shuffle').addEventListener('click',()=>{const s=mini();if(!s||!isAuthenticated()||(s.hand||[]).length<2)return;const t=performance.now();
    if(t-lastShuffleSent<160)return;lastShuffleSent=t;send('CARDS_SHUFFLE',base(),makeId());riffle();if(navigator.vibrate)navigator.vibrate(8);
    const b=el('cards-shuffle');b.classList.remove('pressed');void b.offsetWidth;b.classList.add('pressed');});
  function event(e){
    if(pending&&e.type==='CARDS_UPDATED'){const s=mini();if(!s||s.phase!=='PLAYING'||s.drawer!==getState()?.selfId||!s.canDraw){pending=null;tapped=-1;}return;}
    if(!pending||e.requestId!==pending)return;
    if(e.type==='ERROR'){error=errors[e.payload?.code]||explain(e.payload?.code);}
    pending=null;tapped=-1;render();
  }
  return {render,event,reset,suspend};
}
