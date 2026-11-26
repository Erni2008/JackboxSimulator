'use strict';
/*
 * PHONE STAGE: the lobby every player sees between modes, rebuilt as a lit stage. Your own character stands full
 * body on a pedestal under a spotlight, breathes, follows the tilt of the phone (or the finger) and jumps when tapped;
 * the other guests line up below and pop in as they arrive; a live status line says what happens next.
 * Presentation only: reads the controller's `state`, never sends anything. Loaded after arena-pro.js.
 */
(function(){
  const $=id=>document.getElementById(id),body=document.body;
  const calm=matchMedia('(prefers-reduced-motion: reduce)').matches,low=(navigator.hardwareConcurrency||8)<=4;
  const FULL=id=>`/portraits/full/${id}.png`,FACE=id=>`/portraits/${id}.webp`;
  const NAMES={skeleton:['Скелет','Skeleton'],dracula:['Дракула','Dracula'],pumpkin:['Тыква','Pumpkin'],voodoo:['Вуду','Voodoo'],ghost:['Призрак','Ghost'],zombie:['Зомби','Zombie'],plague_doctor:['Чумной доктор','Plague Doctor'],puppeteer:['Кукольник','Puppeteer']};
  const T=(ru,en)=>typeof faT==='function'?faT(ru,en):en;
  const waiting=$('waiting-screen');if(!waiting)return;
  body.classList.add('ps-on');

  // ---------- lobby markup ----------
  const stage=document.createElement('div');stage.className='ps-lobby';stage.id='ps-lobby';
  stage.innerHTML=`<div class="ps-atmo" aria-hidden="true"><i class="ps-fog a"></i><i class="ps-fog b"></i><i class="ps-candle l"></i><i class="ps-candle r"></i></div><img class="ps-logo" src="/ui/join/logo.png" alt="Final Answer">
    <div class="ps-top"><span class="ps-room"><small></small><b></b></span><i class="ps-sep"></i><span class="ps-count"><b>0</b><small>/ 8</small></span></div>
    <div class="ps-hero" role="button" tabindex="0">
      <i class="ps-moon"></i><div class="ps-dust"></div>
      <div class="ps-swing"><div class="ps-cagebox"><i class="ps-chain"></i>
        <div class="ps-layer ps-back"></div><i class="ps-floorglow"></i><img class="ps-body" alt="" draggable="false"><div class="ps-layer ps-front"></div>
        <div class="ps-plate"><b></b></div></div></div>
      <div class="ps-embers"></div><div class="ps-burst"></div>
    </div>
    <p class="ps-role"></p>
    <div class="ps-statusbox"><p class="ps-status"><i class="ps-flame"><svg viewBox="0 0 12 18" aria-hidden="true"><defs><radialGradient id="psfl" cx="50%" cy="72%" r="60%"><stop offset="0" stop-color="#fff6d0"/><stop offset=".35" stop-color="#ffd06a"/><stop offset=".7" stop-color="#ff8a2a"/><stop offset="1" stop-color="#e2450f"/></radialGradient></defs><path d="M6 .5C7.6 4 11 6.6 11 11.2A5 5 0 0 1 1 11.2C1 8.6 2.6 7.2 3.4 5.6c.3 1.6 1 2.4 1.8 2.8C4.9 5.6 5.4 3 6 .5z" fill="url(#psfl)"/></svg></i><span></span></p><p class="ps-hint"></p></div>
    <p class="ps-rostertitle"><span></span></p>
    <ul class="ps-roster"></ul>`;
  waiting.prepend(stage);
  const hero=stage.querySelector('.ps-hero'),img=stage.querySelector('.ps-body'),roster=stage.querySelector('.ps-roster');
  const embers=stage.querySelector('.ps-embers'),burst=stage.querySelector('.ps-burst');
  if(!calm)for(let i=0;i<(low?8:16);i++){const e=document.createElement('i');e.style.left=(8+Math.random()*84)+'%';e.style.animationDuration=(4+Math.random()*5)+'s';e.style.animationDelay=(-Math.random()*8)+'s';e.style.setProperty('--dx',(Math.random()*40-20).toFixed(0)+'px');embers.append(e);}

  // ---------- the 3D cage: 12 rendered yaw frames (the lobby's own Cage3D), turned in step with the swing ----------
  const layers=[...stage.querySelectorAll('.ps-layer')],FR=12;let lastFrame=-1;
  const dust=stage.querySelector('.ps-dust');
  if(!calm)for(let i=0;i<(low?10:22);i++){const d=document.createElement('i');d.style.left=(20+Math.random()*60)+'%';d.style.top=(Math.random()*90)+'%';
    d.style.animationDuration=(7+Math.random()*9)+'s';d.style.animationDelay=(-Math.random()*12)+'s';d.style.setProperty('--s',(.5+Math.random()*1.2).toFixed(2));dust.append(d);}
  function turn(t){const yaw=calm?0:Math.sin(t/1000*Math.PI*2/6)+Math.sin(t/1000*1.7)*.15+gx*.6;const f=Math.max(0,Math.min(FR-1,Math.round((yaw+1)/2*(FR-1))));
    if(f!==lastFrame){lastFrame=f;const x=(f/(FR-1)*100).toFixed(3)+'% 0';for(const l of layers)l.style.backgroundPosition=x;}}
  if(calm)turn(0);
  // ---------- tilt: device orientation, else the finger ----------
  let tx=0,ty=0,gx=0,gy=0;
  const setTarget=(x,y)=>{tx=Math.max(-1,Math.min(1,x));ty=Math.max(-1,Math.min(1,y));};
  addEventListener('deviceorientation',e=>{if(e.gamma==null)return;setTarget(e.gamma/25,(e.beta-45)/30);},{passive:true});
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();setTarget((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1);},{passive:true});
  hero.addEventListener('pointerleave',()=>setTarget(0,0));
  // one light loop: only while the lobby is on screen and the tab is visible; it touches the DOM only when the cage's
  // yaw frame changes (no per-frame style writes)
  let running=false;
  const loop=()=>{if(body.dataset.view!=='waiting'||document.hidden){running=false;return;}
    gx+=(tx-gx)*.08;gy+=(ty-gy)*.08;turn(performance.now());requestAnimationFrame(loop);};
  const wake=()=>{if(calm||running||body.dataset.view!=='waiting'||document.hidden)return;running=true;requestAnimationFrame(loop);};
  document.addEventListener('visibilitychange',wake);

  // ---------- tap: the character jumps, sparks fly ----------
  const poke=()=>{stage.classList.add('poked');hero.classList.remove('jump');void hero.offsetWidth;hero.classList.add('jump');
    try{navigator.vibrate?.(18);}catch{} try{FA_SFX.tap();}catch{}
    if(calm)return;burst.replaceChildren();for(let k=0;k<14;k++){const s=document.createElement('i');const a=Math.random()*Math.PI*2,v=50+Math.random()*90;
      s.style.setProperty('--dx',(Math.cos(a)*v).toFixed(0)+'px');s.style.setProperty('--dy',(Math.sin(a)*v-60).toFixed(0)+'px');burst.append(s);}};
  hero.addEventListener('click',poke);hero.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')poke();});

  // ---------- paint from the controller state ----------
  let last='',lastChar='';const seen=new Set();
  function paint(){
    if(typeof state==='undefined'||!state||body.dataset.view!=='waiting')return;
    const guests=(state.players||[]).filter(p=>!p.host),self=guests.find(p=>p.id===state.selfId);
    const ch=self?.characterId||'';
    if(ch&&ch!==lastChar){const first=!lastChar;lastChar=ch;img.src=FULL(ch);hero.classList.remove('arrive','drop');void hero.offsetWidth;hero.classList.add(first?'drop':'arrive');}
    const key=JSON.stringify([state.code,state.selfId,state.maxPlayers,state.intro?1:0,state.hostConnected,guests.map(p=>[p.id,p.name,p.characterId,p.connectionStatus])]);
    if(key===last)return;last=key;
    stage.querySelector('.ps-room small').textContent=T('КОМНАТА','ROOM');stage.querySelector('.ps-room b').textContent=state.code||'';
    stage.querySelector('.ps-count b').textContent=guests.length;stage.querySelector('.ps-count small').textContent='/ '+(state.maxPlayers||8);
    const nm=self?.name||'';const pb=stage.querySelector('.ps-plate b');pb.textContent=nm;pb.style.fontSize=nm.length>12?'clamp(12px,3.2vw,15px)':nm.length>8?'clamp(13px,3.8vw,17px)':'';
    stage.querySelector('.ps-role').textContent=ch&&NAMES[ch]?T(NAMES[ch][0],NAMES[ch][1]):'';
    stage.querySelector('.ps-rostertitle span').textContent=T('ИГРОКИ В КОМНАТЕ','PLAYERS IN THE ROOM');
    const status=state.intro?T('Шоу начинается','The show is starting'):state.hostConnected===false?T('Ведущий переподключается','The host is reconnecting'):T('Ждём ведущего','Waiting for the host');
    stage.querySelector('.ps-status span').textContent=status;stage.classList.toggle('starting',!!state.intro);stage.classList.toggle('offline',state.hostConnected===false&&!state.intro);
    stage.querySelector('.ps-hint').textContent=state.intro?T('Смотри на главный экран','Watch the main screen'):T('Нажми на клетку, чтобы встряхнуть её','Tap the cage to rattle it');
    // roster: everyone, you first; new arrivals pop in
    const order=[...guests].sort((a,b)=>(b.id===state.selfId)-(a.id===state.selfId));
    roster.replaceChildren();
    for(const p of order){const li=document.createElement('li');li.className='ps-guest';
      if(p.id===state.selfId)li.classList.add('me');if(p.connectionStatus!=='ONLINE')li.classList.add('away');
      if(!seen.has(p.id)){li.classList.add('new');seen.add(p.id);}
      const face=document.createElement('img');face.alt='';face.src=FACE(p.characterId);const nm=document.createElement('span');nm.textContent=p.id===state.selfId?T('ВЫ','YOU'):p.name;
      li.append(face,nm);roster.append(li);}
    const free=(state.maxPlayers||8)-order.length,show=Math.min(free,(4-order.length%4)%4||(order.length?0:4));
    for(let i=0;i<show;i++){const li=document.createElement('li');li.className='ps-guest empty';li.append(document.createElement('i'));const sp=document.createElement('span');sp.textContent=T('свободно','free');li.append(sp);roster.append(li);}
  }
  setInterval(()=>{paint();wake();},250);
})();
