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
  stage.innerHTML=`<img class="ps-logo" src="/ui/join/logo.png" alt="Final Answer"><div class="ps-top"><span class="ps-room"><small></small><b></b></span><span class="ps-count"><b>0</b><small>/ 8</small></span></div>
    <div class="ps-hero" role="button" tabindex="0">
      <i class="ps-beam"></i><i class="ps-aura"></i>
      <div class="ps-swing"><i class="ps-chain"></i>
        <div class="ps-tilt"><svg class="ps-cage back" viewBox="0 0 200 300" aria-hidden="true"></svg><img class="ps-body" alt="" draggable="false"><img class="ps-shadow" alt="" draggable="false"><svg class="ps-cage front" viewBox="0 0 200 300" aria-hidden="true"></svg></div></div><div class="ps-embers"></div><div class="ps-burst"></div>
    </div>
    <div class="ps-plate"><small></small><b></b></div>
    <p class="ps-status"><i></i><span></span></p>
    <p class="ps-hint"></p>
    <ul class="ps-roster"></ul>`;
  waiting.prepend(stage);
  const hero=stage.querySelector('.ps-hero'),tilt=stage.querySelector('.ps-tilt'),img=stage.querySelector('.ps-body'),shadow=stage.querySelector('.ps-shadow'),roster=stage.querySelector('.ps-roster');
  const embers=stage.querySelector('.ps-embers'),burst=stage.querySelector('.ps-burst');
  // a round hanging cage drawn in two layers: back bars behind the character, front bars in front (bars crowd at the sides like a real cylinder)
  {const R=80,cx=100,top=70,bot=272,N=11,grad='<defs><linearGradient id="cu" x1="0" x2="1"><stop offset="0" stop-color="#5a3018"/><stop offset=".45" stop-color="#e8a868"/><stop offset=".6" stop-color="#ffd8a8"/><stop offset="1" stop-color="#6a3a1c"/></linearGradient><linearGradient id="cud" x1="0" x2="1"><stop offset="0" stop-color="#2a160c"/><stop offset=".5" stop-color="#6a4024"/><stop offset="1" stop-color="#2a160c"/></linearGradient></defs>';
    const layer=front=>{let g=grad;const st=front?'url(#cu)':'url(#cud)',w=front?2.6:2;
      if(!front){g+=`<ellipse cx="${cx}" cy="${bot}" rx="${R}" ry="15" fill="#120a08" stroke="url(#cud)" stroke-width="3"/><ellipse cx="${cx}" cy="${bot}" rx="${R-12}" ry="10" fill="#000" opacity=".45"/>`;}
      for(let i=0;i<N;i++){const t=-Math.PI/2+Math.PI*(i+.5)/N,x=cx+R*Math.sin(t);
        const lit=Math.cos(t),col=front?`rgb(${Math.round(80+130*lit)},${Math.round(42+86*lit)},${Math.round(20+48*lit)})`:`rgb(${Math.round(50+40*lit)},${Math.round(28+22*lit)},${Math.round(14+12*lit)})`;
        g+=`<rect x="${(x-w/2).toFixed(1)}" y="${top}" width="${w}" height="${bot-top}" rx="${w/2}" fill="${col}"/>`;
        g+=`<path d="M${cx} 14 Q${(cx+(x-cx)*1.05).toFixed(1)} 22 ${x.toFixed(1)} ${top}" fill="none" stroke="${st}" stroke-width="${w*.85}"/>`;}
      if(front){g+=`<ellipse cx="${cx}" cy="${top}" rx="${R}" ry="11" fill="none" stroke="url(#cu)" stroke-width="5"/><ellipse cx="${cx}" cy="${bot-58}" rx="${R}" ry="14" fill="none" stroke="url(#cu)" stroke-width="2.6" opacity=".85"/>`;
        g+=`<path d="M${cx-R} ${bot} A${R} 15 0 0 0 ${cx+R} ${bot}" fill="none" stroke="url(#cu)" stroke-width="6"/><circle cx="${cx}" cy="12" r="7" fill="url(#cu)"/><rect x="${cx-11}" y="${bot-46}" width="22" height="18" rx="3" fill="url(#cu)" stroke="#3a1e0c"/><circle cx="${cx}" cy="${bot-39}" r="2.6" fill="#1a0c06"/><rect x="${cx-1.1}" y="${bot-38}" width="2.2" height="5" fill="#1a0c06"/>`;}
      else g+=`<path d="M${cx-R} ${top} A${R} 11 0 0 1 ${cx+R} ${top}" fill="none" stroke="url(#cud)" stroke-width="4"/>`;
      return g;};
    stage.querySelector('.ps-cage.back').innerHTML=layer(false);stage.querySelector('.ps-cage.front').innerHTML=layer(true).replace(/id="cu"/,'id="cu"').replace(/id="cud"/,'id="cud2"');}
  if(!calm)for(let i=0;i<(low?8:16);i++){const e=document.createElement('i');e.style.left=(8+Math.random()*84)+'%';e.style.animationDuration=(4+Math.random()*5)+'s';e.style.animationDelay=(-Math.random()*8)+'s';e.style.setProperty('--dx',(Math.random()*40-20).toFixed(0)+'px');embers.append(e);}

  // ---------- tilt: device orientation, else the finger ----------
  let tx=0,ty=0,gx=0,gy=0;
  const setTarget=(x,y)=>{tx=Math.max(-1,Math.min(1,x));ty=Math.max(-1,Math.min(1,y));};
  addEventListener('deviceorientation',e=>{if(e.gamma==null)return;setTarget(e.gamma/25,(e.beta-45)/30);},{passive:true});
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();setTarget((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1);},{passive:true});
  hero.addEventListener('pointerleave',()=>setTarget(0,0));
  if(!calm)(function loop(){gx+=(tx-gx)*.08;gy+=(ty-gy)*.08;
    tilt.style.transform=`rotateY(${(gx*14).toFixed(2)}deg) rotateX(${(-gy*8).toFixed(2)}deg)`;
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
    if(ch&&ch!==lastChar){lastChar=ch;img.src=FULL(ch);shadow.src=FULL(ch);hero.classList.remove('arrive');void hero.offsetWidth;hero.classList.add('arrive');}
    const key=JSON.stringify([state.code,state.selfId,state.maxPlayers,state.intro?1:0,state.hostConnected,guests.map(p=>[p.id,p.name,p.characterId,p.connectionStatus])]);
    if(key===last)return;last=key;
    stage.querySelector('.ps-room small').textContent=T('КОМНАТА','ROOM');stage.querySelector('.ps-room b').textContent=state.code||'';
    stage.querySelector('.ps-count b').textContent=guests.length;stage.querySelector('.ps-count small').textContent='/ '+(state.maxPlayers||8);
    stage.querySelector('.ps-plate small').textContent=ch&&NAMES[ch]?T(NAMES[ch][0],NAMES[ch][1]):'';
    stage.querySelector('.ps-plate b').textContent=self?.name||'';
    const status=state.intro?T('Шоу начинается','The show is starting'):state.hostConnected===false?T('Ведущий переподключается','The host is reconnecting'):T('Ждём ведущего','Waiting for the host');
    stage.querySelector('.ps-status span').textContent=status;stage.classList.toggle('starting',!!state.intro);
    stage.querySelector('.ps-hint').textContent=state.intro?T('Смотри на главный экран','Watch the main screen'):T('Нажми на персонажа · смотри на главный экран','Tap your character · watch the main screen');
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
