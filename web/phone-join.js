'use strict';
/*
 * PHONE JOIN — the first screen of the website: logo, the cast of characters breathing in the dark, and one glass
 * card with the room code in six cells, the nickname, an optional password and a gold JOIN button that lights up
 * once the code and the name are filled in. The controller's own inputs are moved into this layout, so app.js keeps
 * all the joining logic (validation, availability, the request itself).
 */
(function(){
  const $=id=>document.getElementById(id),body=document.body,screen=$('join-screen'),form=$('join-form');if(!screen||!form)return;
  const T=(ru,en)=>typeof faT==='function'?faT(ru,en):en,calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const code=$('room-code'),nick=$('nickname'),pass=$('password'),btn=$('join-button'),err=$('join-error');
  body.classList.add('pj-on');
  const CAST=['dracula','skeleton','pumpkin','ghost','voodoo','plague_doctor','zombie','puppeteer'];

  const root=document.createElement('div');root.id='pj';root.className='pj';
  root.innerHTML=`<div class="pj-glow"></div><div class="pj-fog"><i></i><i></i><i></i></div><div class="pj-dust"></div>
    <header class="pj-brand"><p class="pj-kicker">${T('ИГРОВОЕ ШОУ НА ВЫЖИВАНИЕ','A SURVIVAL GAME SHOW')}</p><h1 class="pj-logo" data-text="FINAL ANSWER"><span>FINAL</span><span>ANSWER</span></h1><p class="pj-line"><i></i><b>${T('Войди в игру','Join the game')}</b><i></i></p></header>
    <div class="pj-card"><i class="pj-ring"></i><span class="pj-corner k0"><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M2 58V20Q2 2 20 2h38" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 58V24Q8 8 24 8h34" fill="none" stroke="currentColor" stroke-width="1" opacity=".55"/><circle cx="14" cy="14" r="3.2" fill="currentColor"/><path d="M2 30q10 0 12-12q2 12 12 12" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".7"/></svg></span><span class="pj-corner k1"><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M2 58V20Q2 2 20 2h38" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 58V24Q8 8 24 8h34" fill="none" stroke="currentColor" stroke-width="1" opacity=".55"/><circle cx="14" cy="14" r="3.2" fill="currentColor"/><path d="M2 30q10 0 12-12q2 12 12 12" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".7"/></svg></span><span class="pj-corner k2"><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M2 58V20Q2 2 20 2h38" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 58V24Q8 8 24 8h34" fill="none" stroke="currentColor" stroke-width="1" opacity=".55"/><circle cx="14" cy="14" r="3.2" fill="currentColor"/><path d="M2 30q10 0 12-12q2 12 12 12" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".7"/></svg></span><span class="pj-corner k3"><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M2 58V20Q2 2 20 2h38" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 58V24Q8 8 24 8h34" fill="none" stroke="currentColor" stroke-width="1" opacity=".55"/><circle cx="14" cy="14" r="3.2" fill="currentColor"/><path d="M2 30q10 0 12-12q2 12 12 12" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".7"/></svg></span>
      <label class="pj-label" for="room-code"><em><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12.5 12H22M18 12v3.5M21 12v2.5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>${T('Код комнаты','Room code')}</em><small>${T('на экране ведущего','on the host screen')}</small></label>
      <div class="pj-code"><div class="pj-cells" aria-hidden="true">${'<span></span>'.repeat(6)}</div></div>
      <label class="pj-label" for="nickname"><em><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7q9-4 18 0q0 9-9 13Q3 16 3 7z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 10.5q1.5-1 3 0M13.5 10.5q1.5-1 3 0" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>${T('Твоё имя','Your name')}</em></label>
      <div class="pj-field pj-name"></div>
      <button type="button" class="pj-pass-toggle" data-native-button>${T('Есть пароль?','Have a password?')}</button>
      <div class="pj-field pj-pass" hidden></div>
      <div class="pj-err"></div>
      <div class="pj-go"></div>
    </div>
    <div class="pj-cast" aria-hidden="true">${CAST.map((c,i)=>`<img src="/portraits/full/${c}.png" alt="" draggable="false" class="c${i}">`).join('')}</div>`;
  screen.prepend(root);
  {const d=root.querySelector('.pj-dust');if(!calm)for(let i=0;i<18;i++){const e=document.createElement('i');e.style.left=(Math.random()*100)+'%';e.style.top=(Math.random()*100)+'%';e.style.animationDuration=(8+Math.random()*10)+'s';e.style.animationDelay=(-Math.random()*10)+'s';d.append(e);}}
  root.querySelectorAll('.pj-cells span').forEach((c,i)=>c.style.animationDelay=(.45+i*.06)+'s');root.querySelectorAll('.pj-cast img').forEach((c,i)=>c.style.setProperty('--d',(.5+Math.abs(i-3.5)*.12)+'s'));
  btn.innerHTML='<span class="pj-rivet l"></span><b>'+T('ВОЙТИ','JOIN')+'</b><span class="pj-rivet r"></span>';
  // move the real inputs into the new layout
  root.querySelector('.pj-code').append(code);root.querySelector('.pj-name').append(nick);root.querySelector('.pj-pass').append(pass);
  root.querySelector('.pj-err').append(err);root.querySelector('.pj-go').append(btn);
  form.id&&root.querySelector('.pj-card').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();form.requestSubmit?.();}});
  btn.form!==form&&btn.setAttribute('form','join-form');
  nick.placeholder=T('Как тебя назвать?','What should we call you?');pass.placeholder=T('Пароль комнаты','Room password');
  code.setAttribute('inputmode','text');code.setAttribute('aria-label',T('Код комнаты','Room code'));
  const passBox=root.querySelector('.pj-pass'),toggle=root.querySelector('.pj-pass-toggle');
  toggle.onclick=()=>{passBox.hidden=!passBox.hidden;toggle.classList.toggle('open',!passBox.hidden);if(!passBox.hidden)pass.focus();};

  // the six cells mirror the real input (which sits invisibly on top of them, so typing, paste and autofill just work)
  const cells=[...root.querySelectorAll('.pj-cells span')];let prev='';
  const sync=()=>{const v=code.value.toUpperCase();cells.forEach((c,i)=>{c.textContent=v[i]||'';c.classList.toggle('on',!!v[i]);c.classList.toggle('cur',document.activeElement===code&&i===Math.min(v.length,5));
      if(v[i]&&v[i]!==prev[i]&&!calm){c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');}});
    prev=v;const ok=/^[A-HJ-NP-Z2-9]{6}$/.test(v)&&nick.value.trim().length>0;root.classList.toggle('ready',ok);root.classList.toggle('code-full',v.length===6);};
  ['input','focus','blur','keyup'].forEach(e=>{code.addEventListener(e,sync);nick.addEventListener(e,sync);});
  code.addEventListener('input',()=>{if(code.value.length===6&&!nick.value)setTimeout(()=>nick.focus(),120);});
  setInterval(sync,500);sync();
  // a failed join shakes the card
  new MutationObserver(()=>{if(err.textContent){const c=root.querySelector('.pj-card');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');}}).observe(err,{childList:true,characterData:true,subtree:true});
})();
