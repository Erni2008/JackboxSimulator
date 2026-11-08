'use strict';
/* ARENA PRO — presentation only. Reads the DOM and the controller's own state; never sends anything. */
(function(){
  const $=id=>document.getElementById(id), body=document.body;
  const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const buzz=p=>{try{if(!calm&&navigator.vibrate)navigator.vibrate(p);}catch{}};
  const low=(navigator.hardwareConcurrency||8)<=4;

  // embers
  const fx=document.createElement('div');fx.className='ap-fx';fx.setAttribute('aria-hidden','true');
  if(!calm)for(let i=0;i<(low?8:14);i++){const e=document.createElement('i');e.style.left=(Math.random()*100)+'%';e.style.animationDuration=(7+Math.random()*9)+'s';e.style.animationDelay=(-Math.random()*16)+'s';const s=1+Math.random()*2.5;e.style.width=e.style.height=s+'px';fx.append(e);}
  body.prepend(fx);
  const flash=document.createElement('div');flash.className='ap-flash';flash.setAttribute('aria-hidden','true');body.append(flash);
  function hit(kind){flash.className='ap-flash';void flash.offsetWidth;flash.className='ap-flash '+kind;}

  // question timer ring
  const top=document.querySelector('#question-screen .round-top');
  const ring=document.createElement('div');ring.className='ap-ring';ring.setAttribute('aria-hidden','true');
  ring.innerHTML='<svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="16"/><circle class="fg" cx="20" cy="20" r="16" pathLength="100"/></svg><b></b>';
  top?.append(ring);
  let lastSec=-1;
  function tick(){
    let urgent=false;
    try{
      if(body.dataset.view==='question'&&typeof state!=='undefined'&&state&&typeof questionPresentation==='function'){
        const v=questionPresentation(state,typeof now==='function'?now():Date.now());
        const sec=Math.ceil(v.remaining/1000);ring.style.setProperty('--f',v.fraction.toFixed(3));ring.lastChild.textContent=state.phase==='ANSWERING'?String(sec):'—';
        urgent=v.urgent&&!state.hasSubmittedAnswer;
        if(urgent&&sec!==lastSec)buzz(25);lastSec=sec;
      }
    }catch{}
    if(String(urgent)!==body.dataset.urgent)body.dataset.urgent=String(urgent);
  }
  setInterval(tick,250);

  // haptics on taps
  document.addEventListener('click',e=>{const b=e.target.closest('#answers .answer,.cursed-box,#join-button');if(b&&!b.disabled)buzz(12);
    if(e.target.closest('#cursed-fire')&&!e.target.closest('#cursed-fire').disabled)buzz([30,40,60]);},true);

  // result verdict: flash, vibration, survival banner, score chips
  const result=$('result-screen');
  if(result){
    const danger=document.createElement('div');danger.className='ap-danger';danger.textContent='⚠ ВОЗМОЖНА ИГРА НА ВЫЖИВАНИЕ';
    result.querySelector('.verdict-card')?.after(danger);
    let seen='';
    new MutationObserver(()=>{if(result.hidden){seen='';return;}const o=result.dataset.outcome||'';const k=o+':'+($('result-score')?.textContent||'');
      if(k===seen)return;seen=k;
      if(o==='correct'){hit('ok');buzz([20,40,20]);}else if(o){hit('bad');buzz([90,50,140]);}
    }).observe(result,{attributes:true,attributeFilter:['hidden','data-outcome'],subtree:false});
  }

  // lobby slots: numbered seats + empty chairs up to max
  const list=$('players');
  if(list){
    const paint=()=>{const rows=[...list.querySelectorAll('li:not(.ap-empty)')];rows.forEach((r,i)=>r.dataset.slot=String(i+1));
      list.querySelectorAll('.ap-empty').forEach(n=>n.remove());
      const max=Math.min(8,Number($('room-capacity')?.max)||8);
      for(let i=rows.length;i<max;i++){const li=document.createElement('li');li.className='ap-empty';li.textContent='СВОБОДНО';list.append(li);}};
    new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>!n.classList?.contains('ap-empty'))))paint();}).observe(list,{childList:true});
  }
})();
