'use strict';
/* ARENA PRO — presentation only. Reads the DOM and the controller's own state; never sends anything itself. */
(function(){
  const $=id=>document.getElementById(id), body=document.body;
  const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const buzz=p=>{try{if(!calm&&navigator.vibrate)navigator.vibrate(p);}catch{}};
  const low=(navigator.hardwareConcurrency||8)<=4;
  const portrait=id=>id?`/portraits/${id}.webp`:'';
  body.classList.add('g-on');

  // the stage: two lanterns and drifting dust
  const stage=document.createElement('div');stage.className='g-stage';stage.setAttribute('aria-hidden','true');
  stage.innerHTML='<span class="lamp l"></span><span class="lamp r"></span>';
  if(!calm)for(let i=0;i<(low?6:12);i++){const e=document.createElement('i');e.style.left=(Math.random()*100)+'%';e.style.animationDuration=(9+Math.random()*10)+'s';e.style.animationDelay=(-Math.random()*18)+'s';stage.append(e);}
  body.prepend(stage);
  const flash=document.createElement('div');flash.className='g-flash';flash.setAttribute('aria-hidden','true');body.append(flash);
  const hit=k=>{flash.className='g-flash';void flash.offsetWidth;flash.className='g-flash '+k;};

  function cage(cls){const c=document.createElement('div');c.className='g-cage '+(cls||'');
    c.innerHTML='<span class="halo"></span><img class="who" alt="" draggable="false"><img class="bars" src="/portraits/cage.webp" alt="" draggable="false"><span class="plate"></span>';return c;}

  // ---- join: title only; characters are dealt at random by the server ----
  const form=$('join-form');
  if(form){const title=document.createElement('p');title.className='g-title';title.textContent='JOIN THE GAME';form.before(title);}

  // ---- lobby: own character in a hanging cage, "waiting for host" ----
  const waiting=$('waiting-screen');let lobbyCage=null;
  if(waiting){
    const t=document.createElement('p');t.className='g-title';t.id='g-room';waiting.prepend(t);
    lobbyCage=cage();t.after(lobbyCage);
    const w=document.createElement('p');w.className='g-wait';w.textContent='WAITING FOR HOST…';lobbyCage.after(w);
  }
  const players=$('players');
  function paintLobby(){
    try{
      if(typeof state==='undefined'||!state||body.dataset.view!=='waiting')return;
      const self=state.players?.find(p=>p.id===state.selfId);
      $('g-room').textContent='ROOM: '+(state.code||'');
      lobbyCage.querySelector('.who').src=portrait(self?.characterId);lobbyCage.querySelector('.plate').textContent=self?.name||'';
      const guests=(state.players||[]).filter(p=>!p.host);
      [...players.querySelectorAll('li:not(.g-empty)')].forEach((li,i)=>{const g=guests[i];if(g&&!li.querySelector('img.face')){const im=document.createElement('img');im.className='face';im.alt='';im.src=portrait(g.characterId);li.prepend(im);}});
      players.querySelectorAll('.g-empty').forEach(n=>n.remove());
      for(let i=guests.length;i<Math.min(8,state.maxPlayers||8);i++){const li=document.createElement('li');li.className='g-empty';li.textContent='EMPTY SEAT';players.append(li);}
    }catch{}
  }

  // ---- question: red ring timer ----
  const top=document.querySelector('#question-screen .round-top');
  const ring=document.createElement('div');ring.className='g-ring';ring.setAttribute('aria-hidden','true');
  ring.innerHTML='<svg viewBox="0 0 40 40"><circle class="rim" cx="20" cy="20" r="19.3"/><circle class="bg" cx="20" cy="20" r="16"/><circle class="fg" cx="20" cy="20" r="16" pathLength="100"/></svg><b></b>';
  top?.append(ring);
  let lastSec=-1,lastLobby='';
  function tick(){
    let urgent=false;
    try{
      if(body.dataset.view==='question'&&typeof state!=='undefined'&&state&&typeof questionPresentation==='function'){
        const v=questionPresentation(state,typeof now==='function'?now():Date.now());
        const sec=Math.ceil(v.remaining/1000);ring.style.setProperty('--f',v.fraction.toFixed(3));ring.lastChild.textContent=state.phase==='ANSWERING'?String(sec):'—';
        urgent=v.urgent&&!state.hasSubmittedAnswer;if(urgent&&sec!==lastSec)buzz(25);lastSec=sec;
      }
      if(body.dataset.view==='waiting'){const k=JSON.stringify([state?.code,state?.selfId,(state?.players||[]).map(p=>[p.id,p.characterId,p.name])]);if(k!==lastLobby||!players.querySelector('img.face')&&players.children.length){lastLobby=k;paintLobby();}}
    }catch{}
    if(String(urgent)!==body.dataset.urgent)body.dataset.urgent=String(urgent);
  }
  setInterval(tick,250);
  if(players)new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>!n.classList?.contains('g-empty'))))paintLobby();}).observe(players,{childList:true});

  // ---- haptics ----
  document.addEventListener('click',e=>{const b=e.target.closest('#answers .answer,.cursed-box,#join-button');if(b&&!b.disabled)buzz(12);
    const f=e.target.closest('#cursed-fire');if(f&&!f.disabled)buzz([30,40,60]);},true);

  // ---- result: a neutral seal only (the verdict is the host's) ----
  const result=$('result-screen');
  if(result){let seen=false;new MutationObserver(()=>{if(result.hidden){seen=false;return;}if(!seen){seen=true;buzz(15);}}).observe(result,{attributes:true,attributeFilter:['hidden']});}
})();
