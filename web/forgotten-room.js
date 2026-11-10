'use strict';
/**
 * THE FORGOTTEN ROOM phone controller.
 *
 * The server owns phases, timers, the room and the answer key. While players memorise, the phone only points at the
 * shared screen. When answers open it shows the changed room (the same art as the host) as a wide, swipeable stage:
 * tapping near an object — or near the empty place where one used to stand — selects that place (generous hit zones,
 * nearest place wins). A sheet offers only the change types that make sense there; answers become numbered gilt
 * seals on the room and chips below; one SEND posts them once. Nothing about right or wrong is ever shown here.
 */
function createForgottenRoomController({getState,isAuthenticated,send,makeId,now,explain}){
  const el=id=>document.getElementById(id);
  const mini=()=>getState()?.forgottenRoom;
  const selfId=()=>getState()?.selfId;
  const T={DISAPPEARED:'Исчез',MOVED:'Переместился',ROTATED:'Повернулся / упал',CHANGED:'Изменился',APPEARED:'Появился',TOGGLED:'Зажёгся / погас'};
  const HINT={DISAPPEARED:'Здесь что-то стояло',MOVED:'Переехал сюда или отсюда',ROTATED:'Отвернулся или упал на бок',CHANGED:'Выглядит иначе',APPEARED:'Раньше его не было',TOGGLED:'Свет включился или выключился'};
  const W=1920,H=1080;
  // hit zones, in room units (1920-wide): objects get a padded box; otherwise the nearest place within reach wins
  const OBJECT_PAD=.22,PLACE_REACH=150;

  let session='',answers=[],selected=null,sending=null,error='',stageKey='',raf=0,lastSecond=-1;
  const imgs=new Map(),ratio=new Map();

  function reset(){session='';answers=[];selected=null;sending=null;error='';stageKey='';cancelAnimationFrame(raf);raf=0;}
  function suspend(){cancelAnimationFrame(raf);raf=0;}

  // ---------- geometry shared with the host renderer ----------
  function height(size,surface,y){
    const base={TALL:540,LARGE:150,SMALL:72}[size]??108;
    const cap={SHELF:86,DESK:128,WINDOWSILL:112,WALL:118,SEAT:116,TABLE:172,FLOOR:size==='TALL'?580:205,HANG:230}[surface]??150;
    return Math.min(base*(.78+.42*y),cap);
  }
  function art(o){return o.id==='painting'?`/forgotten-room/objects/painting_v${o.variant||0}.webp`:`/forgotten-room/objects/${o.id}.webp`;}
  function bg(m){const name=(m.background||'').split('/').pop().replace(/\.(jpg|png)$/,'');return `/forgotten-room/rooms/${name}.webp`;}
  /** Box of an object in room units {x0,y0,x1,y1} (y down), matching the host's placement. */
  function box(o,place){
    const x=place.x*W,yb=place.y*H;
    if(place.surface==='FRAME')return {x0:x-131,x1:x+131,y0:yb-135,y1:yb+135};
    const h=height(o.size,place.surface,place.y),w=h*(ratio.get(art(o))||.8);
    if(place.surface==='HANG')return {x0:x-w/2,x1:x+w/2,y0:yb,y1:yb+h};
    if(o.turn==='TOPPLE'&&o.rotated)return {x0:x-h/2,x1:x+h/2,y0:yb-w,y1:yb,w,h,lying:true};
    return {x0:x-w/2,x1:x+w/2,y0:yb-h,y1:yb};
  }
  /**
   * What the finger meant. A tap on an object's own picture picks it. Otherwise every place competes by distance —
   * an occupied place from its object's centre, an empty one from its dot — within a generous reach, so a tap a little
   * beside a small object, or on the spot where something vanished, still lands where the player meant.
   */
  function resolve(m,ux,uy){
    const places=new Map(m.places.map(p=>[p.id,p]));const occupied=new Map();let hit=null,hitArea=1e12;
    for(const o of m.objects||[]){const p=places.get(o.slot);if(!p)continue;const b=box(o,p);occupied.set(p.id,b);
      if(ux>=b.x0&&ux<=b.x1&&uy>=b.y0&&uy<=b.y1){const area=(b.x1-b.x0)*(b.y1-b.y0);if(area<hitArea){hitArea=area;hit=p.id;}}}
    if(hit)return hit;
    let near=null,best=1e9;
    for(const p of m.places){const b=occupied.get(p.id);let cx,cy,reach;
      if(b){cx=(b.x0+b.x1)/2;cy=(b.y0+b.y1)/2;reach=Math.max(PLACE_REACH,Math.hypot(b.x1-b.x0,b.y1-b.y0)*.5*(1+OBJECT_PAD));}
      else{cx=p.x*W;cy=p.y*H+(p.surface==='HANG'?60:-40);reach=PLACE_REACH;}
      const d=Math.hypot(cx-ux,cy-uy);if(d<=reach&&d/reach<best){best=d/reach;near=p.id;}}
    return near;
  }
  function optionsFor(m,slot){
    const o=(m.objects||[]).find(o=>o.slot===slot);
    if(!o)return ['DISAPPEARED','MOVED'];
    const out=['MOVED','APPEARED'];if(o.rotatable)out.push('ROTATED');if((o.variants||1)>1)out.push('CHANGED');if(o.light&&o.toggles)out.push('TOGGLED');return out;
  }
  const placeOf=(m,slot)=>m.places.find(p=>p.id===slot);
  const objectAt=(m,slot)=>(m.objects||[]).find(o=>o.slot===slot);
  const nameAt=(m,slot)=>objectAt(m,slot)?.name||'Пустое место';

  // ---------- rendering ----------
  function render(){
    const root=getState(),m=mini();if(!m)return;
    if(m.sessionId!==session){reset();session=m.sessionId;}
    const scr=el('room-screen'),me=(m.seats||[]).includes(selfId());
    scr.dataset.phase=m.phase;
    const answering=m.phase==='ANSWER_PHASE'&&me&&!m.myAnswers;
    // the room is also on the phone while it can be studied (read-only), so everyone can look closely
    const viewing=m.phase==='OBSERVATION'||m.phase==='CHANGED_ROOM';
    scr.dataset.mode=answering?'answer':viewing?'view':'watch';
    el('room-watch').hidden=answering||viewing;el('room-play').hidden=!(answering||viewing);
    if(!answering&&!viewing){watch(m,me);cancelAnimationFrame(raf);raf=0;return;}
    el('room-title').textContent=m.phase==='OBSERVATION'?'Запоминай всё':m.phase==='CHANGED_ROOM'?'Свет вернулся…':'Что изменилось?';
    document.querySelector('#room-screen .fr-hint').textContent=answering?'ЛИСТАЙ КОМНАТУ · НАЖМИ НА ПРЕДМЕТ ИЛИ ПУСТОЕ МЕСТО':'ЛИСТАЙ ВПРАВО И ВЛЕВО — РАССМОТРИ ВСЮ КОМНАТУ';
    if(!answering){selected=null;}
    buildStage(m);paintStage(m);paintList(m);if(!raf)tick();
  }
  function watch(m,me){
    const t={INTRO:['Забытая комната','Смотри на общий экран'],OBSERVATION:['Запоминай всё','Смотри на общий экран'],BLACKOUT:['Тьма','…'],
      CHANGED_ROOM:['Свет вернулся','Что-то изменилось'],ANSWER_PHASE:me?['Ответ отправлен','Смотри на общий экран']:['Ты наблюдаешь','Смотри на общий экран'],
      REVEAL:['Ответ отправлен','Смотри на общий экран'],RESULTS:['Ответ отправлен','Смотри на общий экран']}[m.phase]||['Забытая комната','Смотри на общий экран'];
    if((m.phase==='REVEAL'||m.phase==='RESULTS')&&!m.myAnswers&&me)t[0]='Время вышло';
    el('room-watch-title').textContent=t[0];el('room-watch-note').textContent=t[1];
  }
  function buildStage(m){
    const key=m.sessionId+':'+(m.objects||[]).map(o=>o.id+o.slot+o.rotated+o.variant+o.lit).join(',');if(key===stageKey)return;stageKey=key;
    const stage=el('room-stage');stage.replaceChildren();
    const back=document.createElement('img');back.className='room-bg';back.alt='';back.decoding='async';back.src=bg(m);stage.append(back);
    for(const p of m.places){const d=document.createElement('span');d.className='room-place';d.dataset.slot=p.id;
      d.style.left=(p.x*100)+'%';d.style.top=((p.y+(p.surface==='HANG'?.03:-.02))*100)+'%';stage.append(d);}
    const places=new Map(m.places.map(p=>[p.id,p]));
    for(const o of m.objects||[]){const p=places.get(o.slot);if(!p)continue;
      const i=document.createElement('img');i.className='room-obj';i.alt=o.name;i.decoding='async';i.draggable=false;i.dataset.slot=o.slot;
      if(o.light&&o.lit)i.classList.add('lit');
      i.onload=()=>{ratio.set(i.getAttribute('src'),i.naturalWidth/i.naturalHeight);place(i,o,p);};i.src=art(o);place(i,o,p);stage.append(i);imgs.set(o.slot,i);}
    // start centred on the room's busiest middle
    requestAnimationFrame(()=>{const v=el('room-view');v.scrollLeft=(v.scrollWidth-v.clientWidth)*.45;});
  }
  /** Same pose as the host: FLIP faces the other way, TOPPLE lies on its side (the image keeps its upright size, turned 90°). */
  function place(i,o,p){const b=box(o,p);
    if(b.lying){const cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2;i.style.width=(b.w/W*100)+'%';i.style.height=(b.h/H*100)+'%';
      i.style.left=((cx-b.w/2)/W*100)+'%';i.style.top=((cy-b.h/2)/H*100)+'%';i.style.transform='rotate(90deg)';return;}
    i.style.left=(b.x0/W*100)+'%';i.style.top=(b.y0/H*100)+'%';i.style.width=((b.x1-b.x0)/W*100)+'%';i.style.height=((b.y1-b.y0)/H*100)+'%';
    i.style.transform=o.turn==='FLIP'&&o.rotated?'scaleX(-1)':'';}
  function paintStage(m){
    const stage=el('room-stage');
    stage.querySelectorAll('.room-place').forEach(d=>{const s=d.dataset.slot;d.classList.toggle('sel',s===selected);
      const n=answers.findIndex(a=>a.slot===s);d.dataset.n=n>=0?String(n+1):'';d.classList.toggle('chosen',n>=0);});
    stage.querySelectorAll('.room-obj').forEach(i=>{i.classList.toggle('sel',i.dataset.slot===selected);i.classList.toggle('chosen',answers.some(a=>a.slot===i.dataset.slot));});
    const sheet=el('room-sheet');sheet.hidden=!selected;
    if(selected){const p=placeOf(m,selected),o=objectAt(m,selected);
      el('room-sheet-title').textContent=o?o.name:'Пустое место';el('room-sheet-place').textContent=p?.label||'';
      const box=el('room-sheet-options');box.replaceChildren();const current=answers.find(a=>a.slot===selected);
      for(const t of optionsFor(m,selected)){const b=document.createElement('button');b.type='button';b.className='room-opt';b.dataset.nativeButton='';b.dataset.type=t;
        b.innerHTML=`<strong>${T[t]}</strong><small>${HINT[t]}</small>`;if(current?.type===t)b.classList.add('on');
        b.disabled=!current&&answers.length>=m.guessLimit;box.append(b);}
      el('room-sheet-remove').hidden=!current;
      el('room-sheet-full').hidden=!!current||answers.length<m.guessLimit;}
  }
  function paintList(m){
    el('room-count').textContent=`${answers.length} / ${m.guessLimit}`;
    const list=el('room-list');list.replaceChildren();
    answers.forEach((a,i)=>{const c=document.createElement('button');c.type='button';c.className='room-chip';c.dataset.nativeButton='';c.dataset.slot=a.slot;
      c.innerHTML=`<b>${i+1}</b><span>${nameAt(m,a.slot)}<small>${T[a.type]}</small></span><i aria-label="Убрать">✕</i>`;list.append(c);});
    if(!answers.length){const e=document.createElement('p');e.className='room-empty';e.textContent='Нажми на предмет или на место, где он был';list.append(e);}
    const go=el('room-send');go.disabled=!!sending||!isAuthenticated();go.textContent=sending?'Отправляю…':answers.length?'Отправить ответ':'Отправить без ответа';
    el('room-error').textContent=error;el('room-error').hidden=!error;
  }
  function tick(){
    const m=mini();if(!m||!['ANSWER_PHASE','OBSERVATION','CHANGED_ROOM'].includes(m.phase)){raf=0;return;}
    const left=Math.max(0,(m.phaseEndsAt-now())/1000),total=Math.max(1,(m.phaseEndsAt-m.phaseStartedAt)/1000),sec=Math.ceil(left);
    const ring=el('room-ring');ring.style.setProperty('--f',(left/total).toFixed(3));ring.dataset.urgent=String(sec<=5);el('room-sec').textContent=String(sec);
    if(sec!==lastSecond){lastSecond=sec;if(sec<=5&&sec>0)try{navigator.vibrate?.(18);}catch{}}
    raf=requestAnimationFrame(tick);
  }

  // ---------- input ----------
  el('room-stage').addEventListener('click',e=>{
    const m=mini();if(!m||m.phase!=='ANSWER_PHASE')return;const r=el('room-stage').getBoundingClientRect();
    const slot=resolve(m,(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H);
    if(!slot){el('room-stage').classList.remove('miss');void el('room-stage').offsetWidth;el('room-stage').classList.add('miss');return;}
    selected=selected===slot?null:slot;try{navigator.vibrate?.(10);}catch{}paintStage(m);
  });
  el('room-sheet-options').addEventListener('click',e=>{const b=e.target.closest('.room-opt');const m=mini();if(!b||b.disabled||!selected||!m)return;
    const t=b.dataset.type,i=answers.findIndex(a=>a.slot===selected);
    if(i>=0)answers[i]={slot:selected,type:t};else if(answers.length<m.guessLimit)answers.push({slot:selected,type:t});
    selected=null;error='';try{navigator.vibrate?.(14);}catch{}paintStage(m);paintList(m);});
  el('room-sheet-remove').addEventListener('click',()=>{const m=mini();answers=answers.filter(a=>a.slot!==selected);selected=null;paintStage(m);paintList(m);});
  el('room-sheet-close').addEventListener('click',()=>{selected=null;paintStage(mini());});
  el('room-list').addEventListener('click',e=>{const c=e.target.closest('.room-chip');if(!c)return;const m=mini();
    if(e.target.closest('i')){answers=answers.filter(a=>a.slot!==c.dataset.slot);}else{selected=c.dataset.slot;const img=imgs.get(selected);img?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});}
    paintStage(m);paintList(m);});
  el('room-send').addEventListener('click',()=>{const m=mini();if(!m||sending||!isAuthenticated())return;
    sending=makeId();send('ROOM_SUBMIT',{roomCode:getState().code,sessionId:m.sessionId,answers},sending);paintList(m);try{navigator.vibrate?.([20,40,30]);}catch{}});

  function event(ev){
    if(!sending)return;
    if(ev.requestId===sending&&(ev.type==='ERROR')){error=explain(ev.payload?.code)||'Не получилось отправить. Ещё раз?';sending=null;const m=mini();if(m)paintList(m);}
    if(mini()?.myAnswers){sending=null;}
  }
  return {render,reset,suspend,event};
}
