'use strict';
/**
 * SABOTAGE viruses on the player's laptop. The server decides who is infected, with which virus, for how long and
 * whether a removal is correct; this file only stages the virus on top of the existing question screen and collects
 * the removal sequence. Every answer button keeps its own click handler and answer, so moving, scaling, locking or
 * surrounding it with ghosts never changes which answer it submits. Removal taps never go through the answer path.
 */
const SABOTAGE_CONFIG=Object.freeze({
  SHUFFLE_INTERVAL_MS:1000,SHUFFLE_ANIMATION_MS:200,
  POPUP_STAGGER_MS:320,POPUP_WIDTH_PCT:58,
  GLITCH_BURST_MS:1500,
  MAGNETIC_SCALE:.82,MAGNETIC_SPEED:.0011,MAGNETIC_PUSH_RADIUS_PX:90,
  INDICATOR_SPEED:.05,            // fraction of the screen per second
  INFECT_SPLASH_MS:1400,CLEARED_SPLASH_MS:1100,
});
/** Seeded generator so a virus looks the same after a reconnect and tests are deterministic. */
function sabRng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function sabShuffle(list,rng){const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
/** Owns every timer, frame loop and listener of one virus (or one decorated question) so cleanup is one call. */
function sabScope(){
  const timers=new Set(),loops=new Set(),offs=[];let dead=false;
  return {
    every(ms,fn){const id=setInterval(()=>{if(!dead)fn();},ms);timers.add(id);return id;},
    later(ms,fn){const id=setTimeout(()=>{timers.delete(id);if(!dead)fn();},ms);timers.add(id);return id;},
    frame(fn){const loop={id:0};const step=t=>{if(dead)return;loop.id=requestAnimationFrame(step);if(!document.hidden)fn(t);};loop.id=requestAnimationFrame(step);loops.add(loop);},
    on(target,type,fn,opt){target.addEventListener(type,fn,opt);offs.push(()=>target.removeEventListener(type,fn,opt));},
    undo(fn){offs.push(fn);},
    dispose(){dead=true;for(const id of timers){clearInterval(id);clearTimeout(id);}timers.clear();for(const l of loops)cancelAnimationFrame(l.id);loops.clear();while(offs.length)try{offs.pop()();}catch(e){}},
    get dead(){return dead;}
  };
}
/** Restart a CSS one-shot animation class. */
function sabPulse(node,cls){node.classList.remove(cls);void node.offsetWidth;node.classList.add(cls);}

/**
 * The seven viruses. Each one may:
 *  start(ctx)          screen-wide effect for the infection's life
 *  grid(ctx,grid,gs)   decorate the current question's answer grid (gs is disposed when the question changes)
 *  removal             'panel' (opened from the banner) or 'overlay' (the removal pieces live on the screen itself)
 *  build(ctx,box)      draw the removal puzzle into box; call ctx.finish(answer) when it is complete
 *  auto(ctx)           dev autoplay: the element a careful player would tap next
 */
const SABOTAGE_EFFECTS={
  SHUFFLE_ATTACK:{
    name:'ПЕРЕМЕШКА',hint:'Кнопки ответов меняются местами',removal:'panel',task:'Нажми символы в показанном порядке',
    grid(ctx,grid,gs){
      gs.every(SABOTAGE_CONFIG.SHUFFLE_INTERVAL_MS,()=>{
        if(!grid.isConnected||grid.querySelector('.picked'))return;const now=[...grid.querySelectorAll(':scope > .sbx-option')];if(now.length<2)return;
        let next;do next=sabShuffle(now,ctx.rng);while(next.every((b,i)=>b===now[i]));sabFlip(grid,next,ctx.reduced);
      });
    },
    build(ctx,box){
      const d=ctx.data,seq=d.sequence||[],pr=ctx.progress;pr.i=pr.i||0;
      const row=ctx.mk('div','sbx-sab-seq',null,box);const marks=seq.map(s=>ctx.mk('span',null,s,row));
      const pad=ctx.mk('div','sbx-sab-pad',null,box);
      const paint=()=>marks.forEach((m,k)=>m.classList.toggle('on',k<pr.i));paint();
      for(const sym of d.symbols||[]){const b=ctx.btn('sbx-sab-key',sym,pad);b.dataset.v=sym;
        b.onclick=()=>{if(sym===seq[pr.i]){pr.i++;sabPulse(b,'hit');paint();if(pr.i>=seq.length)ctx.finish(seq.slice());}else{pr.i=0;paint();sabPulse(pad,'shake');ctx.buzz();}};}
    },
    auto(ctx){return ctx.root.querySelector('.sbx-sab-key[data-v="'+CSS.escape(ctx.data.sequence[ctx.progress.i||0])+'"]');}
  },
  NUMBER_HUNT:{
    name:'ОХОТА НА ЦИФРЫ',hint:'Экран засорён цифрами',removal:'overlay',task:'Нажимай цифры по порядку: 1 → 2 → 3 …',
    build(ctx,box){
      const n=ctx.data.count||7,pr=ctx.progress;pr.found=pr.found||0;
      if(!pr.spots){// scattered cells, preferring the ones that do not cover the answers
        const scr=ctx.screen().getBoundingClientRect(),opts=ctx.screen().querySelector('.sbx-options')?.getBoundingClientRect(),cells=[];
        for(let r=0;r<4;r++)for(let c=0;c<4;c++){const x=8+c*22+ctx.rng()*8,y=18+r*19+ctx.rng()*7;
          const cx=scr.left+scr.width*x/100,cy=scr.top+scr.height*y/100,covers=opts&&cx>opts.left-30&&cx<opts.right+30&&cy>opts.top-30&&cy<opts.bottom+30;cells.push({x,y,covers});}
        const free=sabShuffle(cells.filter(c=>!c.covers),ctx.rng),busy=sabShuffle(cells.filter(c=>c.covers),ctx.rng);pr.spots=free.concat(busy).slice(0,n);}
      const nums=[];
      for(let i=1;i<=n;i++){const b=ctx.btn('sbx-sab-num',String(i),box);b.dataset.v=String(i);b.style.left=pr.spots[i-1].x+'%';b.style.top=pr.spots[i-1].y+'%';b.style.animationDelay=(-ctx.rng()*2).toFixed(2)+'s';nums.push(b);
        b.onclick=()=>{if(i===pr.found+1){pr.found++;paint();if(pr.found>=n)ctx.finish(nums.map(x=>x.dataset.v));}else{sabPulse(b,'miss');ctx.buzz();pr.found=Math.max(0,pr.found-1);paint();}};}
      const paint=()=>nums.forEach((b,k)=>{const gone=k<pr.found;b.classList.toggle('gone',gone);b.disabled=gone;});paint();
    },
    auto(ctx){return ctx.root.querySelector('.sbx-sab-num[data-v="'+((ctx.progress.found||0)+1)+'"]');}
  },
  POPUP_STORM:{
    name:'ШТОРМ ОКОН',hint:'Ложные системные окна',removal:'overlay',task:'Закрой все окна. Мигающий крестик — ловушка, жми OK',
    build(ctx,box){
      const pr=ctx.progress;pr.closed=pr.closed||[];const wins=(ctx.data.windows||[]).filter(w=>!pr.closed.includes(w.id));
      const LINES=['Процесс svch0st.exe не отвечает','Сеанс будет прерван','Обнаружен неизвестный пакет','Доступ к памяти запрещён','Перегрев процессора 97°C','Неверная подпись драйвера'];
      const place=el=>{el.style.left=(2+ctx.rng()*(96-SABOTAGE_CONFIG.POPUP_WIDTH_PCT)).toFixed(1)+'%';el.style.top=(12+ctx.rng()*48).toFixed(1)+'%';};
      wins.forEach((w,k)=>ctx.scope.later(k*SABOTAGE_CONFIG.POPUP_STAGGER_MS,()=>{
        const win=ctx.mk('div','sbx-sab-win'+(w.fakeClose?' trap':''),null,box);win.dataset.id=w.id;win.style.width=SABOTAGE_CONFIG.POPUP_WIDTH_PCT+'%';win.style.zIndex=String(10+k);place(win);
        const bar=ctx.mk('div','sbx-sab-winbar',null,win);ctx.mk('span','mi','',bar);ctx.mk('b',null,w.title,bar);
        const x=ctx.btn('sbx-sab-x'+(w.fakeClose?' fake':''),'✕',bar);x.setAttribute('aria-label',w.fakeClose?'ложная кнопка':'закрыть');
        ctx.mk('p',null,LINES[Math.floor(ctx.rng()*LINES.length)],win);const ok=ctx.btn('sbx-sab-ok','OK',win);
        const close=()=>{if(win.classList.contains('closing'))return;win.classList.add('closing');pr.closed.push(w.id);ctx.scope.later(180,()=>win.remove());if(pr.closed.length>=(ctx.data.windows||[]).length)ctx.finish(pr.closed.slice());};
        ok.onclick=close;x.onclick=w.fakeClose?()=>{place(win);sabPulse(win,'jump');ctx.buzz();ctx.tip('Крестик ложный — нажми OK');}:close;
      }));
    },
    auto(ctx){const w=ctx.root.querySelector('.sbx-sab-win:not(.closing)');return w?.querySelector('.sbx-sab-ok')||null;}
  },
  GHOST_BUTTONS:{
    name:'КНОПКИ-ПРИЗРАКИ',hint:'Часть кнопок — подделки',removal:'overlay',task:'Найди 3 спрятанных жучка среди ответов',
    grid(ctx,grid,gs){
      const real=[...grid.querySelectorAll(':scope > .sbx-option')];if(!real.length)return;const labels=real.map(b=>b.querySelector('.sbx-val')?.textContent||'');
      grid.classList.add('sab-ghost');gs.undo(()=>grid.classList.remove('sab-ghost'));
      const all=real.slice();
      for(let i=0;i<(ctx.data.ghosts||4);i++){const g=ctx.mk('button','sbx-option sbx-ghost',null);g.type='button';g.dataset.nativeButton='';g.dataset.ghost='1';
        ctx.mk('span','sbx-key',String.fromCharCode(65+Math.floor(ctx.rng()*real.length)),g);ctx.mk('span','sbx-val',labels[Math.floor(ctx.rng()*labels.length)],g);g.style.animationDelay=(-ctx.rng()*3).toFixed(2)+'s';
        // a ghost never reaches the answer path: no submit, just a glitch
        g.onclick=e=>{e.stopPropagation();sabPulse(g,'poof');ctx.buzz();ctx.tip('Это призрак — ответ не засчитан');};all.push(g);}
      for(const b of sabShuffle(all,ctx.rng))grid.append(b);
      gs.undo(()=>{for(const g of grid.querySelectorAll('.sbx-ghost'))g.remove();for(const b of real)grid.append(b);});
      const pr=ctx.progress;pr.found=pr.found||[];
      for(const id of ctx.data.viruses||[]){if(pr.found.includes(id))continue;const bug=ctx.btn('sbx-sab-bug mi','',grid);bug.dataset.id=id;bug.setAttribute('aria-label','вирус');
        bug.style.left=(4+ctx.rng()*86).toFixed(1)+'%';bug.style.top=(6+ctx.rng()*80).toFixed(1)+'%';
        bug.onclick=e=>{e.stopPropagation();pr.found.push(id);bug.classList.add('caught');gs.later(260,()=>bug.remove());ctx.count();if(pr.found.length>=(ctx.data.viruses||[]).length)ctx.finish(pr.found.slice());};
        gs.undo(()=>bug.remove());}
    },
    auto(ctx){return ctx.screen().querySelector('.sbx-sab-bug:not(.caught)');}
  },
  SCREEN_GLITCH:{
    name:'ГЛИТЧ ЭКРАНА',hint:'Изображение искажено',removal:'panel',task:'Выставь регуляторы как в цели',
    start(ctx){
      const scr=ctx.screen();scr.classList.add('sab-glitch');ctx.scope.undo(()=>scr.classList.remove('sab-glitch','sab-shift'));
      if(ctx.reduced)return;
      ctx.scope.every(SABOTAGE_CONFIG.GLITCH_BURST_MS,()=>{
        if(ctx.rng()<.55){sabPulse(scr,'sab-shift');}
        const blk=ctx.mk('i','sbx-sab-corrupt',null,ctx.root);blk.style.left=(ctx.rng()*70).toFixed(0)+'%';blk.style.top=(15+ctx.rng()*70).toFixed(0)+'%';blk.style.width=(12+ctx.rng()*26).toFixed(0)+'%';blk.style.height=(2+ctx.rng()*6).toFixed(0)+'%';
        ctx.scope.later(240,()=>blk.remove());
      });
    },
    build(ctx,box){
      const d=ctx.data,max=d.max||5,pr=ctx.progress;pr.vals=pr.vals||(d.start||[]).slice();
      const t=ctx.mk('div','sbx-sab-target',null,box);ctx.mk('small',null,'ЦЕЛЬ',t);ctx.mk('b',null,(d.target||[]).join(' — '),t);
      const row=ctx.mk('div','sbx-sab-dials',null,box);
      (d.target||[]).forEach((want,k)=>{const col=ctx.mk('div','sbx-sab-dial',null,row);const up=ctx.btn('sbx-sab-step mi','',col);const v=ctx.mk('b',null,'',col);const dn=ctx.btn('sbx-sab-step mi','',col);
        const paint=()=>{v.textContent=String(pr.vals[k]);col.classList.toggle('ok',String(pr.vals[k])===want);};paint();
        const turn=dir=>{pr.vals[k]=(pr.vals[k]-1+dir+max)%max+1;paint();sabPulse(v,'tick');if(pr.vals.every((x,i)=>String(x)===d.target[i]))ctx.finish(pr.vals.map(String));};
        up.onclick=()=>turn(1);dn.onclick=()=>turn(-1);up.dataset.k=dn.dataset.k=String(k);up.dataset.dir='1';});
    },
    auto(ctx){const d=ctx.data,k=(ctx.progress.vals||[]).findIndex((x,i)=>String(x)!==d.target[i]);return k<0?null:ctx.root.querySelector('.sbx-sab-step[data-k="'+k+'"][data-dir="1"]');}
  },
  LOCKED_ANSWERS:{
    name:'ЗАМОК',banner:'ОТВЕТЫ ЗАБЛОКИРОВАНЫ',hint:'Ответы заблокированы',removal:'panel',autoOpen:true,task:'Нажми числа по возрастанию',
    grid(ctx,grid,gs){
      grid.classList.add('sab-locked');
      const btns=[...grid.querySelectorAll(':scope > .sbx-option')],was=btns.map(b=>b.disabled);
      btns.forEach(b=>{b.disabled=true;ctx.mk('span','sbx-sab-lock mi','',b);});
      gs.undo(()=>{grid.classList.remove('sab-locked');btns.forEach((b,i)=>{b.disabled=was[i];b.querySelector('.sbx-sab-lock')?.remove();});});
    },
    build(ctx,box){
      const nums=ctx.data.numbers||[],order=nums.slice().sort((a,b)=>a-b),pr=ctx.progress;pr.i=pr.i||0;
      const row=ctx.mk('div','sbx-sab-pad wide',null,box);const btns=nums.map(n=>{const b=ctx.btn('sbx-sab-key',String(n),row);b.dataset.v=String(n);return b;});
      const paint=()=>btns.forEach(b=>b.classList.toggle('done',order.indexOf(+b.dataset.v)<pr.i));paint();
      btns.forEach(b=>b.onclick=()=>{if(+b.dataset.v===order[pr.i]){pr.i++;paint();if(pr.i>=order.length)ctx.finish(order.map(String));}else{pr.i=0;paint();sabPulse(row,'shake');ctx.buzz();}});
    },
    auto(ctx){const order=(ctx.data.numbers||[]).slice().sort((a,b)=>a-b);return ctx.root.querySelector('.sbx-sab-key[data-v="'+order[ctx.progress.i||0]+'"]');}
  },
  MAGNETIC_BUTTONS:{
    name:'МАГНИТНЫЕ КНОПКИ',hint:'Кнопки уплывают',removal:'overlay',task:'Поймай 3 красных индикатора',
    grid(ctx,grid,gs){
      const btns=[...grid.querySelectorAll(':scope > .sbx-option')];if(!btns.length)return;const s=SABOTAGE_CONFIG.MAGNETIC_SCALE;
      btns.forEach(b=>{b.style.scale=String(s);b.style.transition='scale .3s';});gs.undo(()=>btns.forEach(b=>{b.style.scale='';b.style.translate='';b.style.transition='';}));
      if(ctx.reduced)return;
      // each key drifts only inside the room its own shrink frees up, so keys never overlap or leave the grid
      const ph=btns.map(()=>[ctx.rng()*6.28,ctx.rng()*6.28,.7+ctx.rng()*.6]);let px=-1e4,py=-1e4;
      gs.on(ctx.screen(),'pointermove',e=>{if(e.pointerType==='mouse'){px=e.clientX;py=e.clientY;}});gs.on(ctx.screen(),'pointerleave',()=>{px=py=-1e4;});
      let geo=null;const measure=()=>{geo=btns.map(b=>({w:b.offsetWidth,h:b.offsetHeight}));};gs.on(window,'resize',measure);
      gs.frame(t=>{if(!grid.isConnected||grid.querySelector('.picked'))return;if(!geo)measure();
        btns.forEach((b,i)=>{const ax=geo[i].w*(1-s)/2,ay=geo[i].h*(1-s)/2,[p1,p2,k]=ph[i];
          let x=Math.sin(t*SABOTAGE_CONFIG.MAGNETIC_SPEED*k+p1)*ax,y=Math.cos(t*SABOTAGE_CONFIG.MAGNETIC_SPEED*.8*k+p2)*ay;
          if(px>-1e3){const r=b.getBoundingClientRect(),dx=r.left+r.width/2-px,dy=r.top+r.height/2-py,d=Math.hypot(dx,dy);
            if(d<SABOTAGE_CONFIG.MAGNETIC_PUSH_RADIUS_PX&&d>0){const f=(1-d/SABOTAGE_CONFIG.MAGNETIC_PUSH_RADIUS_PX);x+=dx/d*ax*f;y+=dy/d*ay*f;}}
          x=Math.max(-ax,Math.min(ax,x));y=Math.max(-ay,Math.min(ay,y));b.style.translate=x.toFixed(1)+'px '+y.toFixed(1)+'px';});});
    },
    build(ctx,box){
      const pr=ctx.progress;pr.caught=pr.caught||[];const dots=[];
      for(const id of ctx.data.indicators||[]){if(pr.caught.includes(id))continue;const b=ctx.btn('sbx-sab-dot',null,box);b.dataset.id=id;b.setAttribute('aria-label','индикатор');ctx.mk('i',null,null,b);
        const a=ctx.rng()*6.28;dots.push({b,x:10+ctx.rng()*80,y:20+ctx.rng()*65,vx:Math.cos(a),vy:Math.sin(a)});
        b.onclick=()=>{pr.caught.push(id);b.classList.add('caught');b.disabled=true;ctx.scope.later(300,()=>b.remove());ctx.count();if(pr.caught.length>=(ctx.data.indicators||[]).length)ctx.finish(pr.caught.slice());};}
      const put=()=>dots.forEach(d=>{d.b.style.left=d.x.toFixed(2)+'%';d.b.style.top=d.y.toFixed(2)+'%';});put();if(ctx.reduced)return;
      let last=0;ctx.scope.frame(t=>{const dt=last?Math.min(.05,(t-last)/1000):0;last=t;const v=SABOTAGE_CONFIG.INDICATOR_SPEED*100*dt;
        for(const d of dots){d.x+=d.vx*v;d.y+=d.vy*v;if(d.x<4||d.x>92)d.vx=-d.vx;if(d.y<16||d.y>90)d.vy=-d.vy;d.x=Math.max(4,Math.min(92,d.x));d.y=Math.max(16,Math.min(90,d.y));}put();});
    },
    auto(ctx){return ctx.root.querySelector('.sbx-sab-dot:not(.caught)');}
  },
};
/** FLIP: move real buttons to their new places, then glide them from where they were. */
function sabFlip(grid,order,reduced){
  const before=new Map(order.map(b=>[b,b.getBoundingClientRect()]));for(const b of order)grid.append(b);
  if(reduced)return;
  for(const b of order){const a=before.get(b),z=b.getBoundingClientRect(),dx=a.left-z.left,dy=a.top-z.top;if(!dx&&!dy)continue;
    b.style.transition='none';b.style.translate=dx+'px '+dy+'px';void b.offsetWidth;
    b.style.transition='translate '+SABOTAGE_CONFIG.SHUFFLE_ANIMATION_MS+'ms cubic-bezier(.3,.7,.2,1)';b.style.translate='0px 0px';}
}

/**
 * One controller per laptop. sync() follows the server's view of this player's infection; decorate() is called with
 * every freshly built answer grid (or null when the screen is not a question).
 */
function createSystemBreachSabotage({screen,submit,buzz=()=>{},reduced}){
  const motionless=reduced??(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  const mk=(tag,cls,text,parent)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;if(parent)parent.append(e);return e;};
  const btn=(cls,text,parent)=>{const b=mk('button',cls,text,parent);b.type='button';b.dataset.nativeButton='';b.dataset.sab='1';return b;};
  let inf=null,grid=null,gridScope=null,banner=null;
  const layer=()=>{let r=screen().querySelector(':scope > .sbx-sab');if(!r){r=mk('div','sbx-sab',null,screen());}return r;};
  function splash(cls,title,sub,ms){const r=layer(),s=mk('div','sbx-sab-splash '+cls,null,r);mk('span','mi',cls==='ok'?'':'',s);mk('b',null,title,s);if(sub)mk('small',null,sub,s);setTimeout(()=>s.remove(),ms);}
  function paintBanner(){
    if(!inf||!banner)return;const e=inf.effect;banner.querySelector('.n').textContent=e.banner||e.name;
    banner.querySelector('.q').textContent=inf.sent?'ОЧИСТКА…':'ещё '+inf.left+' '+(inf.left===1?'вопрос':inf.left<5?'вопроса':'вопросов');
    const c=banner.querySelector('.c');if(c)c.textContent=inf.counter();
    const go=banner.querySelector('.go');if(go){go.hidden=e.removal!=='panel'||!!e.autoOpen;go.textContent=inf.panelOpen?'К ВОПРОСУ':'УДАЛИТЬ ВИРУС';}
  }
  function makeBanner(){
    banner=mk('div','sbx-sab-banner');const top=mk('div','row',null,banner);mk('span','mi','',top);mk('b','n',null,top);mk('span','q',null,top);mk('span','c',null,top);
    const go=btn('go',null,top);go.onclick=()=>{inf.panelOpen?closePanel():openPanel();};
  }
  function openPanel(){
    if(!inf||inf.panel)return;inf.panelOpen=true;const p=mk('div','sbx-sab-panel',null,layer());inf.panel=p;
    const h=mk('div','sbx-sab-panelhead',null,p);mk('span','mi','',h);mk('b',null,'УДАЛЕНИЕ ВИРУСА',h);mk('small',null,inf.effect.task,p);
    const box=mk('div','sbx-sab-box',null,p);inf.effect.build(inf.ctx,box);
    if(!inf.effect.autoOpen){const back=btn('sbx-sab-close','← продолжить отвечать',p);back.onclick=closePanel;}
    paintBanner();
  }
  function closePanel(){if(!inf)return;inf.panel?.remove();inf.panel=null;inf.panelOpen=false;paintBanner();}
  function start(view){
    const effect=SABOTAGE_EFFECTS[view.type];if(!effect)return;
    const data=view.data||{},scope=sabScope(),rng=sabRng(data.seed||1);
    inf={id:view.infectionId,type:view.type,effect,data,scope,left:view.questionsLeft,panel:null,panelOpen:false,sent:null,answer:null,overlay:null,
      counter:()=>{const p=inf.ctx.progress;return view.type==='GHOST_BUTTONS'?(p.found||[]).length+'/'+(data.viruses||[]).length:view.type==='MAGNETIC_BUTTONS'?(p.caught||[]).length+'/'+(data.indicators||[]).length:'';}};
    const ctx={data,rng,reduced:motionless,progress:{},scope,mk,btn,screen,buzz,get root(){return layer();},
      tip(text){const t=mk('div','sbx-sab-tip',text,layer());scope.later(1300,()=>t.remove());},
      count(){paintBanner();},
      finish(answer){if(!inf||inf.answer)return;inf.answer=answer;trySubmit();}};
    inf.ctx=ctx;screen().classList.add('sab-infected');scope.undo(()=>screen().classList.remove('sab-infected'));
    splash('bad','ЗАРАЖЕНИЕ',effect.name,SABOTAGE_CONFIG.INFECT_SPLASH_MS);buzz([40,40,40,40,120]);
    makeBanner();effect.start?.(ctx);if(effect.removal==='overlay')scope.later(SABOTAGE_CONFIG.INFECT_SPLASH_MS,()=>ctx.tip(effect.task));
    if(effect.removal==='overlay'){inf.overlay=mk('div','sbx-sab-overlay '+view.type.toLowerCase(),null,layer());if(view.type!=='GHOST_BUTTONS')effect.build(ctx,inf.overlay);}
    if(effect.autoOpen)openPanel();
    if(grid)decorate(grid);paintBanner();
  }
  function trySubmit(){if(!inf||!inf.answer||inf.sent)return;inf.sent=submit(inf.id,inf.answer)||null;paintBanner();}
  /** Removes every trace of the virus: timers, frames, listeners, extra elements, classes, button styles. */
  function cleanup(){
    if(!inf)return;gridScope?.dispose();gridScope=null;inf.scope.dispose();inf.panel?.remove();inf.overlay?.remove();banner?.remove();banner=null;
    const r=screen().querySelector(':scope > .sbx-sab');r?.querySelectorAll('.sbx-sab-corrupt,.sbx-sab-tip').forEach(x=>x.remove());inf=null;
  }
  function decorate(g){
    gridScope?.dispose();gridScope=null;banner?.remove();grid=g&&g.isConnected!==false?g:null;
    if(!inf||!grid)return;
    grid.before(banner);paintBanner();const gs=sabScope();gridScope=gs;inf.effect.grid?.(inf.ctx,grid,gs);
  }
  return {
    config:SABOTAGE_CONFIG,
    /** view = self.sabotage from the server (empty / missing when clean). */
    sync(view){
      const id=view?.infectionId||'';
      if(inf&&inf.id!==id){const cleared=inf.answer;cleanup();if(!id)splash('ok',cleared?'ВИРУС УДАЛЁН':'ВИРУС ВЫДОХСЯ','система чиста',SABOTAGE_CONFIG.CLEARED_SPLASH_MS);}
      if(!inf&&id)start(view);
      if(inf){if(inf.left!==view.questionsLeft){inf.left=view.questionsLeft;paintBanner();}trySubmit();}
    },
    decorate,
    /** True while the virus forbids answering (LOCKED ANSWERS). */
    blocks(){return !!inf&&inf.type==='LOCKED_ANSWERS';},
    /** The server's verdict on our removal sequence. */
    result(requestId,status){if(!inf||inf.sent!==requestId)return;
      if(status==='WRONG'){inf.answer=null;inf.sent=null;inf.ctx.progress={};if(inf.panel){closePanel();openPanel();}if(inf.overlay){inf.overlay.replaceChildren();inf.effect.build(inf.ctx,inf.overlay);}if(grid)decorate(grid);paintBanner();}
      else if(status!=='CLEARED'){inf.sent=null;}},
    /** Request rejected or lost: allow the finished sequence to be sent again. */
    retry(){if(inf&&inf.answer){inf.sent=null;trySubmit();}},
    active(){return inf?{id:inf.id,type:inf.type,panelOpen:inf.panelOpen,progress:inf.ctx.progress}:null;},
    /** Dev autoplay: the next removal tap, opening the panel first if needed. */
    autoStep(){if(!inf||inf.answer)return false;if(inf.effect.removal==='panel'&&!inf.panel){openPanel();return true;}const t=inf.effect.auto?.(inf.ctx);if(t&&!t.disabled){t.click();return true;}return false;},
    dispose(){cleanup();grid=null;}
  };
}
if(typeof module!=='undefined')module.exports={createSystemBreachSabotage,SABOTAGE_EFFECTS,SABOTAGE_CONFIG,sabRng,sabShuffle};
