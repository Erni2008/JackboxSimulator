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
  stage.innerHTML=`<img class="ps-logo" src="/ui/join/logo.png" alt="Final Answer">
    <div class="ps-top"><span class="ps-room"><small></small><b></b></span><i class="ps-sep"></i><span class="ps-count"><b>0</b><small>/ 8</small></span></div>
    <div class="ps-hero" role="button" tabindex="0">
      <i class="ps-moon"></i><div class="ps-dust"></div>
      <div class="ps-swing"><div class="ps-cagebox"><i class="ps-chain"></i>
        <div class="ps-layer ps-back"></div><i class="ps-floorglow"></i><img class="ps-body" alt="" draggable="false"><div class="ps-layer ps-front"></div>
        <div class="ps-plate"><b></b></div></div></div>
      <div class="ps-embers"></div><div class="ps-burst"></div>
    </div>
    <p class="ps-role"></p>
    <div class="ps-statusbox"><p class="ps-status"><i></i><span></span></p><p class="ps-hint"></p></div>
    <p class="ps-rostertitle"></p>
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
  if(!calm)(function loop(){gx+=(tx-gx)*.08;gy+=(ty-gy)*.08;
    turn(performance.now());
    stage.style.setProperty('--px',(gx*10).toFixed(1)+'px');stage.style.setProperty('--py',(gy*6).toFixed(1)+'px');
    requestAnimationFrame(loop);})();

  // ---------- tap: the character jumps, sparks fly ----------
  const poke=()=>{hero.classList.remove('jump');void hero.offsetWidth;hero.classList.add('jump');
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
    stage.querySelector('.ps-rostertitle').textContent=T('ИГРОКИ В КОМНАТЕ','PLAYERS IN THE ROOM');
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
    for(let i=order.length;i<(state.maxPlayers||8);i++){const li=document.createElement('li');li.className='ps-guest empty';li.append(document.createElement('i'));roster.append(li);}
  }
  setInterval(paint,250);
})();
