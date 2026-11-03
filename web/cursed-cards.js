'use strict';
/**
 * THE CURSED CARDS phone controller.
 *
 * Shows only what the server sends this player: their own card values (in the server's order), how many hidden cards
 * the current source holds, public counts, a five-second ring timer and the audience curse vote. The server stays
 * authoritative for ownership, order, turns, timers, shuffles, pairs, survival and elimination; this file only presents
 * snapshots and the public event log (pairs/transfers/safe, without card ids) and sends one request per action.
 *
 * Card elements are created once per value (values in a hand are unique: pairs are discarded) and moved with
 * transforms only; a new snapshot re-targets them, so rapid shuffles coalesce instead of stacking animations.
 */
function createCursedCardsController({getState,isAuthenticated,send,makeId,now,explain}){
  const el=id=>document.getElementById(id);
  const ART=v=>`/art/cursed_cards/cards/card_${v===0?'death':v}.jpg`,BACK='/art/cursed_cards/cards/card_back.jpg';
  const errors={CARDS_NOT_YOUR_TURN:'Wait for your turn.',CARDS_STALE_TURN:'The turn has moved on.',CARDS_TURN_NOT_READY:'Watch the table — your turn begins in a moment.',CARDS_INVALID_SLOT:'Choose one of the hidden cards.',CARDS_STALE_HAND:'The cards moved — tap again.',CARDS_TURN_EXPIRED:'Too late — fate chose for you.',CARDS_NOTHING_TO_SHUFFLE:'Nothing to shuffle.',CARDS_VOTE_CLOSED:'The curse has been cast.',CARDS_NOT_SPECTATOR:'Only the audience may curse.',CARDS_INVALID_TARGET:'Choose a seated player.',STALE_CARDS_SESSION:'This match has ended.'};
  const mini=()=>getState()?.cursedCards;
  const selfId=()=>getState()?.selfId;
  const name=id=>{const p=getState()?.players?.find(p=>p.id===id);return (p?.nickname||p?.name||'PLAYER').toUpperCase();};
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const base=()=>({roomCode:getState().code,sessionId:mini().sessionId});

  // ---------------- state ----------------
  let session='',turnKey='',tapped=-1,pending=null,error='',raf=0,lastShuffleSent=0,lastSecond=-1,audio=null;
  let lastSeq=-1,primed=false,prevValues=[],backsRev=null,settleTimer=0,toastTimer=0,momentTimer=0,resultStage=0,resultKey='',pairValues=new Set();
  const own=new Map();         // value -> <img> (reused)
  const leaving=new Set();     // elements animating out (excluded from layout)
  const preload=[];for(const v of [0,1,2,3,4,5,6,7,8,9,10]){const i=new Image();i.decoding='async';i.src=ART(v);preload.push(i);}{const i=new Image();i.src=BACK;preload.push(i);}

  function reset(){session='';turnKey='';tapped=-1;pending=null;error='';lastSeq=-1;primed=false;prevValues=[];backsRev=null;resultStage=0;resultKey='';pairValues.clear();
    own.forEach(n=>n.remove());own.clear();leaving.forEach(n=>n.remove());leaving.clear();el('cards-pick-row').replaceChildren();
    el('cards-moment').hidden=true;el('cards-result').hidden=true;stopClock();clearTimeout(settleTimer);clearTimeout(momentTimer);}
  function suspend(){stopClock();}

  // ---------------- sound (synthesized, tiny) ----------------
  function ctx(){try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();return audio;}catch(e){return null;}}
  function noise(dur,freq,gain){const a=ctx();if(!a)return;const len=Math.floor(a.sampleRate*dur),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++){const t=i/len;d[i]=(Math.random()*2-1)*(Math.sin(t*90)>.6?1:.25)*(1-t);}
    const src=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();f.type='bandpass';f.frequency.value=freq;f.Q.value=.8;g.gain.value=gain;src.buffer=buf;src.connect(f).connect(g).connect(a.destination);src.start();}
  const riffle=()=>noise(.22,2600,.22),burn=()=>noise(.5,700,.28);
  function tick(){const a=ctx();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=880;g.gain.setValueAtTime(.0001,a.currentTime);
    g.gain.exponentialRampToValueAtTime(.12,a.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.16);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.18);}
  const buzz=ms=>{try{navigator.vibrate&&navigator.vibrate(ms);}catch(e){}};

  // ---------------- fan layout (transform only) ----------------
  /** Positions for n cards in a container: adaptive width, overlap, gentle arc. */
  function fan(box,n,opts){
    const W=box.clientWidth,H=box.clientHeight;if(!n||!W||!H)return {cw:0,ch:0,at:[]};
    let cw=Math.min(W*(opts.max||.4),(H-(opts.pad||16))*.68,opts.cap||168);
    const usable=W*.94;let step=n>1?Math.min(cw*(opts.gap||.72),(usable-cw)/(n-1)):0;
    if(n>1&&step<cw*.34){cw=Math.max(58,usable/(1+(n-1)*.34));step=(usable-cw)/(n-1);}
    const ch=cw*1.5,spread=n>1?Math.min(opts.spread??26,n*4.5):0,at=[];
    for(let i=0;i<n;i++){const k=n>1?i/(n-1)*2-1:0,ang=k*spread/2,x=W/2+(i-(n-1)/2)*step-cw/2,y=(H-ch)/2+Math.abs(k)*k*0+k*k*cw*.09;at.push({x,y,ang,z:i});}
    return {cw,ch,at};
  }
  function place(node,p,cw,ch,extra=''){node.style.width=cw+'px';node.style.height=ch+'px';node.style.zIndex=p.z;node.style.transform=`translate3d(${p.x}px,${p.y}px,0) rotate(${p.ang}deg) ${extra}`;}

  function layoutHand(lift){
    const box=el('cards-hand'),nodes=[...prevValues].map(v=>own.get(v)).filter(Boolean),{cw,ch,at}=fan(box,nodes.length,{max:.36,cap:150,spread:24});
    nodes.forEach((n,i)=>at[i]&&place(n,at[i],cw,ch,lift?`translateY(${-Math.min(26,ch*.14)}px) scale(1.04)`:''));
    return {cw,ch,at};
  }
  function settle(){clearTimeout(settleTimer);if(reduced()){layoutHand(false);return;}layoutHand(true);settleTimer=setTimeout(()=>layoutHand(false),170);}

  // ---------------- own hand reconciliation ----------------
  function card(v){let n=own.get(v);if(n)return n;n=document.createElement('img');n.className='cards-own';n.src=ART(v);n.alt=v===0?'DEATH':`Card ${v}`;n.draggable=false;n.dataset.v=v;n.decoding='async';
    own.set(v,n);el('cards-hand').append(n);return n;}
  function syncHand(values,animate,dealing){
    const box=el('cards-hand'),before=prevValues,orderChanged=before.join()!==values.join(),gone=before.filter(v=>!values.includes(v)),added=values.filter(v=>!before.includes(v));
    prevValues=values.slice();
    // arrivals: from above (dealt or drawn), staggered while dealing
    added.forEach((v,i)=>{const n=card(v);n.classList.remove('leaving','pairing');if(!animate||reduced())return;
      n.style.transition='none';n.style.opacity='0';n.style.transform=`translate3d(${box.clientWidth/2-40}px,${-box.clientHeight*.7}px,0) rotate(${(Math.random()-.5)*30}deg) scale(.7)`;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{n.style.transition='';n.style.transitionDelay=dealing?`${i*70}ms`:'0ms';n.style.opacity='1';layoutHand(false);setTimeout(()=>{n.style.transitionDelay='';},500+i*70);}));});
    // departures: burned pairs meet in the middle and burn; a card taken by an opponent lifts away
    gone.forEach(v=>{const n=own.get(v);if(!n)return;own.delete(v);if(!animate||reduced()){n.remove();return;}leaving.add(n);
      if(pairValues.has(v))pairBurn(n,v);else{n.classList.add('leaving');n.style.transform+=` translate3d(0,${-box.clientHeight*.8}px,0) rotate(-14deg)`;n.style.opacity='0';setTimeout(()=>{n.remove();leaving.delete(n);},460);}});
    if(orderChanged&&animate&&!added.length&&!gone.length)settle();else layoutHand(false);
  }
  /** Authoritative pair (from the event log): the held card and its newly arrived twin meet, flare and burn away. */
  function pairBurn(n,v){const box=el('cards-hand'),W=box.clientWidth,H=box.clientHeight,cw=parseFloat(n.style.width)||90,ch=cw*1.5;
    const twin=n.cloneNode();twin.removeAttribute('id');box.append(twin);twin.style.transition='none';twin.style.transform=`translate3d(${W/2-cw/2}px,${-H*.6}px,0) rotate(18deg) scale(.8)`;twin.style.opacity='0';
    n.classList.add('pairing');twin.classList.add('pairing');n.style.zIndex=twin.style.zIndex=50;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{twin.style.transition='';twin.style.opacity='1';
      n.style.transform=`translate3d(${W/2-cw*.82}px,${(H-ch)/2-10}px,0) rotate(-7deg) scale(1.06)`;twin.style.transform=`translate3d(${W/2-cw*.18}px,${(H-ch)/2-10}px,0) rotate(7deg) scale(1.06)`;}));
    setTimeout(()=>{burn();buzz(18);n.classList.add('burning');twin.classList.add('burning');},520);
    setTimeout(()=>{n.remove();twin.remove();leaving.delete(n);},1250);}

  // ---------------- opponent's face-down cards ----------------
  function layoutBacks(lift){const row=el('cards-pick-row'),nodes=[...row.children],{cw,ch,at}=fan(row,nodes.length,{max:.3,cap:120,spread:18,gap:.8});
    nodes.forEach((n,i)=>{if(!at[i])return;const sel=i===tapped;place(n,at[i],cw,ch,sel?`translateY(${-ch*.16}px) scale(1.08)`:lift?`translateY(${-ch*.1}px)`:'');});}
  function syncBacks(s){const row=el('cards-pick-row'),n=s.sourceCards||0;
    if(row.children.length!==n){row.replaceChildren();for(let i=0;i<n;i++){const b=document.createElement('button');b.type='button';b.className='cards-back';b.dataset.nativeButton='';b.setAttribute('aria-label',`Hidden card ${i+1}`);
      b.addEventListener('pointerdown',()=>{if(!b.disabled)b.classList.add('pressing');});b.addEventListener('pointerup',()=>b.classList.remove('pressing'));b.addEventListener('pointerleave',()=>b.classList.remove('pressing'));
      b.addEventListener('click',()=>take(i));row.append(b);}requestAnimationFrame(()=>layoutBacks(false));}
    else if(backsRev!==null&&backsRev!==s.sourceRevision&&!reduced()){layoutBacks(true);setTimeout(()=>layoutBacks(false),170);riffle();}
    else layoutBacks(false);
    backsRev=s.sourceRevision;
    [...row.children].forEach((b,i)=>{b.classList.toggle('selected',i===tapped);b.classList.toggle('dimmed',tapped>=0&&i!==tapped);b.disabled=!s.canDraw||!!pending||tapped>=0;});}
  function take(i){const s=mini();if(!s||!s.canDraw||pending||tapped>=0||!isAuthenticated())return;tapped=i;error='';
    pending=makeId();send('CARDS_DRAW',{...base(),turn:s.turn,slot:i,revision:s.sourceRevision},pending);buzz(12);render();}
  /** After a confirmed draw the chosen back flies down into the hand (the hand then shows its real value). */
  function flyChosen(){const row=el('cards-pick-row'),b=row.children[tapped];if(!b||reduced())return;const r=b.getBoundingClientRect(),h=el('cards-hand').getBoundingClientRect(),stage=el('cards-screen').getBoundingClientRect();
    const g=document.createElement('div');g.className='cc-flyer';Object.assign(g.style,{left:r.left-stage.left+'px',top:r.top-stage.top+'px',width:r.width+'px',height:r.height+'px'});el('cards-screen').append(g);
    g.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${h.left+h.width/2-r.left-r.width/2}px,${h.top+h.height/2-r.top-r.height/2}px) rotate(12deg) scale(.8)`,opacity:.15}],{duration:420,easing:'cubic-bezier(.4,0,.2,1)'}).onfinish=()=>g.remove();}

  // ---------------- events (public log, no card ids) ----------------
  function readEvents(s,me){pairValues=new Set();const out={took:null,lost:null,safe:false,pairs:0};const evs=s.events||[];
    if(!primed){primed=true;lastSeq=evs.length?evs[evs.length-1].seq:-1;return out;} // reconnect/first view: show state, replay nothing
    for(const e of evs){if(e.seq<=lastSeq)continue;lastSeq=e.seq;
      if(e.type==='pair'&&e.seat===me){pairValues.add(e.a?.value);out.pairs++;}
      if(e.type==='transfer'&&e.from===me)out.lost=e.to;
      if(e.type==='transfer'&&e.to===me)out.took=e.from;
      if(e.type==='safe'&&e.seat===me)out.safe=true;}
    return out;}

  // ---------------- render ----------------
  function render(){
    const s=mini(),root=getState();if(!s)return;
    if(s.sessionId!==session){reset();session=s.sessionId;}
    const me=(s.seats||[]).indexOf(selfId()),player=s.role==='PLAYER',values=s.hand||[],screen=el('cards-screen');
    const tk=`${s.phase}:${s.turn??''}`;let turnEnded=false;if(tk!==turnKey){turnEnded=tapped>=0;turnKey=tk;if(turnEnded)flyChosen();tapped=-1;backsRev=null;if(error!==errors.CARDS_TURN_EXPIRED)error='';}
    const ev=readEvents(s,me),safeNow=player&&me>=0&&s.safe?.[me],myTurn=s.phase==='PLAYING'&&s.drawer===root.selfId,picked=s.phase==='PLAYING'&&s.source===root.selfId;
    screen.dataset.phase=s.phase;screen.dataset.role=s.role;screen.dataset.mode=myTurn?'pick':picked?'picked':safeNow||!player?'watch':'hand';
    // top
    el('cards-name').textContent=name(root.selfId);el('cards-role').textContent=player?(safeNow?'SAFE':'AT THE TABLE'):'IN THE AUDIENCE';
    el('cards-phase').textContent=phaseLabel(s,myTurn,picked,safeNow);
    el('cards-counter').textContent=player&&s.phase!=='CURSE_VOTE'?`${values.length}`:'';el('cards-counter').hidden=!player||s.phase==='CURSE_VOTE';
    // banner
    const [banner,sub]=bannerText(s,root,myTurn,picked,safeNow,player);el('cards-banner').textContent=banner;el('cards-status').textContent=error||sub;
    // hand
    el('cards-hand-wrap').hidden=!player||safeNow&&!values.length||s.phase==='CURSE_VOTE';
    syncHand(values,primed&&s.phase!=='CURSE_VOTE',s.phase==='DEALING');
    if(ev.lost!==null&&ev.lost!==undefined)toast(`${name(s.seats[ev.lost])} TOOK ONE OF YOUR CARDS`);
    else if(ev.pairs)toast(ev.pairs>1?'PAIRS BURN':'A PAIR BURNS');
    if(ev.safe)moment();
    el('cards-shuffle').disabled=!player||values.length<2||!['PLAYING','DEALING'].includes(s.phase);
    el('cards-screen').querySelector('.cc-bottom').hidden=!player||safeNow||s.phase==='FINISHED'||s.phase==='CURSE_VOTE';
    // vote
    el('cards-vote').hidden=s.phase!=='CURSE_VOTE';if(s.phase==='CURSE_VOTE')renderVote(s);
    // board (audience, the safe, everyone at the end of the deal)
    const board=el('cards-board');board.hidden=!(s.phase==='PLAYING'||s.phase==='DEALING')||!(s.role!=='PLAYER'||safeNow);if(!board.hidden)renderBoard(s);
    // pick
    el('cards-pick').hidden=!myTurn;if(myTurn)syncBacks(s);
    // result
    renderResult(s,root);
    startClock();
  }
  function phaseLabel(s,myTurn,picked,safe){if(s.phase==='CURSE_VOTE')return 'THE CURSE';if(s.phase==='DEALING')return 'THE DEAL';if(s.phase==='FINISHED')return 'THE VERDICT';
    if(safe)return 'SAFE';if(myTurn)return 'YOUR TURN';if(picked)return 'UNDER THREAT';return 'IN PLAY';}
  function bannerText(s,root,myTurn,picked,safe,player){
    if(s.phase==='CURSE_VOTE')return s.role==='SPECTATOR'?['CURSE A PLAYER',s.myVote?`YOU CURSED ${name(s.myVote)} · ${s.votes}/${s.voters} VOTED`:'One curse. It may bring DEATH closer to them.']:['THE AUDIENCE CHOOSES','Someone at the table will be cursed…'];
    if(s.phase==='DEALING')return ['THE DEAL',s.cursedPlayer?`THE AUDIENCE CURSED ${name(s.cursedPlayer)}`:'Watch the table.'];
    if(s.phase==='FINISHED')return ['',''];
    if(!player||safe)return [safe?'YOU ARE SAFE':'THE TABLE',`${name(s.drawer)} TAKES FROM ${name(s.source)}`];
    if(myTurn)return [s.canDraw?'PICK A CARD':'GET READY',s.canDraw?(pending||tapped>=0?'TAKING…':`FROM ${name(s.source)} — ONE TAP`):`${name(s.source)}'S CARDS`];
    if(picked)return ['YOUR CARDS ARE BEING PICKED',`${name(s.drawer)} IS CHOOSING — SHUFFLE!`];
    return ['YOUR HAND',`${name(s.drawer)} TAKES FROM ${name(s.source)}`];
  }
  function renderVote(s){const list=el('cards-vote-list');const ids=s.seats||[];
    if(list.children.length!==ids.length){list.replaceChildren();for(const id of ids){const b=document.createElement('button');b.type='button';b.className='cards-target';b.dataset.nativeButton='';b.dataset.id=id;
      const n=document.createElement('strong');n.textContent=name(id);const t=document.createElement('span');b.append(n,t);
      b.addEventListener('click',()=>{const m=mini();if(!isAuthenticated()||pending||m?.role!=='SPECTATOR')return;pending=makeId();send('CARDS_VOTE',{...base(),targetId:id},pending);buzz(10);render();});list.append(b);}}
    [...list.children].forEach(b=>{const id=b.dataset.id;b.classList.toggle('chosen',s.myVote===id);b.disabled=s.role!=='SPECTATOR'||!!pending;b.querySelector('span').textContent=s.tally?.[id]?'✦'.repeat(Math.min(5,s.tally[id])):'';});}
  function renderBoard(s){const board=el('cards-board');const ids=s.seats||[];
    if(board.children.length!==ids.length){board.replaceChildren();ids.forEach(()=>{const r=document.createElement('div');r.className='cc-seat';r.innerHTML='<strong></strong><span class="cc-seat-state"></span><span class="cc-seat-count"></span>';board.append(r);});}
    ids.forEach((id,i)=>{const r=board.children[i],n=s.handSizes?.[i]??0,safe=s.safe?.[i];r.querySelector('strong').textContent=name(id);
      const st=id===s.drawer?'DRAWS':id===s.source?'OFFERS':safe?'SAFE':'';r.querySelector('.cc-seat-state').textContent=st;r.dataset.state=st.toLowerCase();
      const c=r.querySelector('.cc-seat-count');if(c.dataset.n!==String(n)){c.dataset.n=n;c.replaceChildren(...Array.from({length:Math.min(n,9)},()=>{const d=document.createElement('i');return d;}));c.setAttribute('aria-label',`${n} cards`);}});}
  function renderResult(s,root){const box=el('cards-result');if(s.phase!=='FINISHED'){box.hidden=true;resultStage=0;return;}
    const lost=s.loser===root.selfId,player=s.role==='PLAYER',key=s.sessionId+lost;box.hidden=false;
    box.dataset.kind=!player?'watch':lost?'cursed':'safe';
    if(resultKey!==key){resultKey=key;resultStage=0;el('cards-result-art').src=ART(0);
      if(lost&&player){buzz([30,40,60]);setTimeout(()=>{resultStage=1;paintResult(s,root);},reduced()?0:1500);}}
    paintResult(s,root);}
  function paintResult(s,root){const lost=s.loser===root.selfId,player=s.role==='PLAYER';const box=el('cards-result');box.dataset.stage=resultStage;
    el('cards-result-title').textContent=!player?`${name(s.loser)} IS CURSED`:lost?(resultStage?'YOU HAVE BEEN ELIMINATED':'THE DEATH CARD'):'YOU SURVIVED';
    el('cards-result-detail').textContent=!player?'Everyone else survives.':lost?(resultStage?'The curse is yours. Watch the table.':''):`${name(s.loser)} holds DEATH.`;}
  function toast(text){const t=el('cards-toast');t.textContent=text;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),1900);}
  function moment(){const m=el('cards-moment');m.hidden=false;m.classList.remove('show');void m.offsetWidth;m.classList.add('show');buzz([20,30,20]);clearTimeout(momentTimer);momentTimer=setTimeout(()=>{m.hidden=true;},2600);}

  // ---------------- ring timer (server deadline only) ----------------
  function startClock(){if(!raf)raf=requestAnimationFrame(paintClock);}
  function stopClock(){cancelAnimationFrame(raf);raf=0;}
  function paintClock(){raf=0;const s=mini();const box=el('cards-clock');if(!s||el('cards-screen').hidden){box.hidden=true;return;}
    const playing=s.phase==='PLAYING',mine=playing&&s.drawer===selfId()&&s.canDraw,vote=s.phase==='CURSE_VOTE';
    const end=vote?s.voteEndsAt:mine?s.turnDeadline:0,start=vote?s.voteEndsAt-10000:s.turnReadyAt;box.hidden=!end;
    if(end){const t=now(),left=Math.max(0,end-Math.max(t,start)),total=Math.max(1,end-start),secs=Math.ceil(left/1000);
      el('cards-ring').style.strokeDashoffset=String(100-left/total*100);
      const c=el('cards-count');if(c.textContent!==String(secs)){c.textContent=String(secs);box.classList.remove('beat');void box.offsetWidth;box.classList.add('beat');}
      box.classList.toggle('urgent',left<=1000&&left>0);if(mine&&secs===1&&lastSecond!==1&&!pending&&tapped<0)tick();lastSecond=secs;}
    else lastSecond=-1;
    raf=requestAnimationFrame(paintClock);}

  // ---------------- input ----------------
  el('cards-shuffle').addEventListener('click',()=>{const s=mini();if(!s||!isAuthenticated()||(s.hand||[]).length<2)return;const t=performance.now();
    if(t-lastShuffleSent<160)return;lastShuffleSent=t;send('CARDS_SHUFFLE',base(),makeId());riffle();buzz(8);
    const b=el('cards-shuffle');b.classList.remove('pressed');void b.offsetWidth;b.classList.add('pressed');});
  new ResizeObserver(()=>{if(!el('cards-screen').hidden){layoutHand(false);layoutBacks(false);}}).observe(el('cards-stage'));
  function event(e){
    if(pending&&e.type==='CARDS_UPDATED'){const s=mini();if(!s||s.phase!=='PLAYING'||s.drawer!==selfId()||!s.canDraw){pending=null;}return;}
    if(!pending||e.requestId!==pending)return;
    if(e.type==='ERROR'){error=errors[e.payload?.code]||explain(e.payload?.code);tapped=-1;}
    pending=null;render();
  }
  return {render,event,reset,suspend};
}
