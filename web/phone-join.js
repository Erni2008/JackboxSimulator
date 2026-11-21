'use strict';
/*
 * PHONE JOIN — the website's first screen, built to the art direction mock-up: candle-lit gothic room behind,
 * the FINAL ANSWER copper logo with its red ribbon, one ornate copper-framed panel (room code in six cells, the
 * nickname with a counter) and the red copper JOIN plate hanging from the bottom of the frame.
 * The controller's own inputs are moved into this layout, so app.js keeps all the joining logic.
 */
(function(){
  const $=id=>document.getElementById(id),body=document.body,screen=$('join-screen'),form=$('join-form');if(!screen||!form)return;
  const T=(ru,en)=>typeof faT==='function'?faT(ru,en):en;
  const code=$('room-code'),nick=$('nickname'),pass=$('password'),btn=$('join-button'),err=$('join-error');
  const A='/ui/join/';body.classList.add('pj-on');
  const max=+nick.getAttribute('maxlength')||16;

  const root=document.createElement('div');root.id='pj';root.className='pj';
  root.innerHTML=`<div class="pj-bg" aria-hidden="true"></div>
    <header class="pj-brand">
      <p class="pj-kicker">${T('Игровое шоу на выживание','A survival game show')}</p>
      <img class="pj-logo" src="${A}logo.png" alt="Final Answer">
      <p class="pj-sub"><i></i><b>${T('Войди в игру','Join the game')}</b><i></i></p>
    </header>
    <div class="pj-panel">
      <img class="pj-c tl" src="${A}corner_tl.png" alt=""><img class="pj-c tr" src="${A}corner_tr.png" alt=""><img class="pj-c bl" src="${A}corner_bl.png" alt=""><img class="pj-c br" src="${A}corner_br.png" alt="">
      <img class="pj-crest" src="${A}crest.png" alt="">
      <label class="pj-label" for="room-code"><img src="${A}ticket.png" alt="">${T('Код комнаты','Room code')}</label>
      <div class="pj-code"><div class="pj-cells" aria-hidden="true">${'<span></span>'.repeat(6)}</div></div>
      <div class="pj-div" aria-hidden="true"><i></i><img src="${A}skull.png" alt=""><i></i></div>
      <label class="pj-label" for="nickname"><img src="${A}user.png" alt="">${T('Твой ник','Your nickname')}</label>
      <div class="pj-name"><span class="pj-count">0/${max}</span></div>
      <button type="button" class="pj-pass-toggle" data-native-button>${T('Есть пароль?','Have a password?')}</button>
      <div class="pj-pass" hidden></div>
      <div class="pj-err"></div>
    </div>
    <div class="pj-go"></div>`;
  screen.prepend(root);
  root.querySelector('.pj-code').append(code);root.querySelector('.pj-name').prepend(nick);root.querySelector('.pj-pass').append(pass);
  root.querySelector('.pj-err').append(err);root.querySelector('.pj-go').append(btn);btn.setAttribute('form','join-form');
  btn.innerHTML=`<span class="pj-arrow l"></span><b>${T('Войти','Join')}</b><span class="pj-arrow r"></span>`;
  nick.placeholder=T('Как тебя называть?','What should we call you?');pass.placeholder=T('Пароль комнаты','Room password');
  code.setAttribute('aria-label',T('Код комнаты','Room code'));
  root.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.target===code||e.target===nick||e.target===pass)){e.preventDefault();form.requestSubmit?.();}});
  const passBox=root.querySelector('.pj-pass'),toggle=root.querySelector('.pj-pass-toggle');
  toggle.onclick=()=>{passBox.hidden=!passBox.hidden;toggle.classList.toggle('open',!passBox.hidden);if(!passBox.hidden)pass.focus();};

  // the six cells mirror the real input, which lies invisibly over them (typing, paste and autofill just work)
  const cells=[...root.querySelectorAll('.pj-cells span')],count=root.querySelector('.pj-count');let prev='';
  const sync=()=>{const v=code.value.toUpperCase(),focus=document.activeElement===code;
    cells.forEach((c,i)=>{c.textContent=v[i]||'';c.classList.toggle('on',!!v[i]);c.classList.toggle('cur',focus&&i===Math.min(v.length,5));
      if(v[i]&&v[i]!==prev[i]){c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');}});
    prev=v;count.textContent=`${nick.value.length}/${max}`;
    root.classList.toggle('ready',/^[A-HJ-NP-Z2-9]{6}$/.test(v)&&nick.value.trim().length>0);};
  ['input','focus','blur','keyup'].forEach(e=>{code.addEventListener(e,sync);nick.addEventListener(e,sync);});
  code.addEventListener('input',()=>{if(code.value.length===6&&!nick.value)setTimeout(()=>nick.focus(),120);});
  setInterval(sync,500);sync();
  new MutationObserver(()=>{if(err.textContent){const p=root.querySelector('.pj-panel');p.classList.remove('shake');void p.offsetWidth;p.classList.add('shake');}}).observe(err,{childList:true,characterData:true,subtree:true});
})();
