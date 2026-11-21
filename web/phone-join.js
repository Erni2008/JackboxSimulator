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
  root.innerHTML=`<div class="pj-glow"></div>
    <header class="pj-brand"><p class="pj-kicker">${T('ИГРОВОЕ ШОУ НА ВЫЖИВАНИЕ','A SURVIVAL GAME SHOW')}</p><h1 class="pj-logo"><span>FINAL</span><span>ANSWER</span></h1><p class="pj-line"><i></i><b>${T('Войди в игру','Join the game')}</b><i></i></p></header>
    <div class="pj-card">
      <label class="pj-label" for="room-code">${T('Код комнаты','Room code')}<small>${T('на экране ведущего','on the host screen')}</small></label>
      <div class="pj-code"><div class="pj-cells" aria-hidden="true">${'<span></span>'.repeat(6)}</div></div>
      <label class="pj-label" for="nickname">${T('Твоё имя','Your name')}</label>
      <div class="pj-field pj-name"></div>
      <button type="button" class="pj-pass-toggle" data-native-button>${T('Есть пароль?','Have a password?')}</button>
      <div class="pj-field pj-pass" hidden></div>
      <div class="pj-err"></div>
      <div class="pj-go"></div>
    </div>
    <div class="pj-cast" aria-hidden="true">${CAST.map((c,i)=>`<img src="/portraits/full/${c}.png" alt="" draggable="false" class="c${i}">`).join('')}</div>`;
  screen.prepend(root);
  // move the real inputs into the new layout
  root.querySelector('.pj-code').append(code);root.querySelector('.pj-name').append(nick);root.querySelector('.pj-pass').append(pass);
  root.querySelector('.pj-err').append(err);root.querySelector('.pj-go').append(btn);
  form.id&&root.querySelector('.pj-card').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();form.requestSubmit?.();}});
  btn.form!==form&&btn.setAttribute('form','join-form');
  btn.textContent=T('ВОЙТИ','JOIN');nick.placeholder=T('Как тебя назвать?','What should we call you?');pass.placeholder=T('Пароль комнаты','Room password');
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
