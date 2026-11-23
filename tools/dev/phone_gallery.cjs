// Screenshots of every phone screen in a phone viewport, gathered into one HTML gallery.
//   PW=<path to playwright> BASE=http://127.0.0.1:18330 OUT=<dir> node tools/dev/phone_gallery.cjs
const {chromium,devices}=require(process.env.PW||'playwright');const fs=require('fs'),path=require('path');
const BASE=process.env.BASE||'http://127.0.0.1:18330',OUT=process.env.OUT||'phone-gallery';fs.mkdirSync(OUT,{recursive:true});
const rid=()=>Math.random().toString(36).slice(2),wait=ms=>new Promise(r=>setTimeout(r,ms));
const post=async(u,d)=>(await fetch(BASE+u,{method:'POST',body:new URLSearchParams(d)})).json();
const shots=[];const CH=['pumpkin','skeleton','dracula','voodoo','ghost','zombie','plague_doctor'];
async function room(n){const r=await post('/rooms',{name:'Gallery',maxPlayers:8,mode:'CLASSIC',questionCount:3});const code=r.code,tok=r.hostSession||r.token;
  const ws=new WebSocket(BASE.replace('http','ws')+'/ws');const h={code,st:null,errors:[]};h.send=(t,p={})=>ws.send(JSON.stringify({type:t,requestId:rid(),payload:{roomCode:code,...p}}));
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.payload?.players)h.st=m.payload;if(m.type==='ERROR'||m.type.endsWith('REJECTED'))h.errors.push(m.payload?.code);};
  await new Promise(r=>ws.onopen=r);h.send('AUTH',{token:tok});await wait(500);h.send('SET_LANGUAGE',{language:'ru'});
  const me=await post(`/rooms/${code}/join`,{name:'Игрок',characterId:'pumpkin'});h.seat=Buffer.from(JSON.stringify({code,token:me.sessionToken||me.token,name:'Игрок'})).toString('base64url');
  h.bots=[];for(let i=1;i<n;i++){const j=await post(`/rooms/${code}/join`,{name:['Ann','Bob','Cid','Dee','Eve','Gus'][i-1],characterId:CH[i]});const b=new WebSocket(BASE.replace('http','ws')+'/ws');b.onopen=()=>b.send(JSON.stringify({type:'AUTH',requestId:rid(),payload:{roomCode:code,token:j.sessionToken||j.token}}));h.bots.push(b);}
  return h;}
(async()=>{const b=await chromium.launch({headless:true,executablePath:process.env.CHROME||'/Users/erni/Desktop/Google Chrome.app/Contents/MacOS/Google Chrome'});
  const snap=async(p,name,title)=>{const f=name+'.png';await p.screenshot({path:path.join(OUT,f)});shots.push([f,title]);console.log('shot',title);};
  const phone=async()=>{const c=await b.newContext({...devices['iPhone 13']});return c.newPage();};
  // join + lobby
  {const h=await room(4);const p=await phone();await p.goto(BASE+'/?room='+h.code);await wait(1500);await snap(p,'01-join','Вход');
    await p.goto(BASE+'/#seat='+h.seat);await wait(2500);await snap(p,'02-lobby','Лобби');
    await p.evaluate(()=>window.FA_MODE_RULES?.show('questions'));await wait(800);await snap(p,'03-rules','Карточка «Как играть»');
    // quiz
    await p.reload();await wait(1500);h.send('START_GAME');let done={};
    for(let k=0;k<200;k++){const s=h.st;if(!s){await wait(200);continue;}
      if(s.phase==='STARTING'&&s.intro)h.send('SKIP_INTRO',{gameId:s.gameId,introId:s.intro.introId});
      if(s.phase==='QUESTION_PRESENTATION')h.send('PRESENTATION_READY',{gameId:s.gameId,questionId:s.question?.id});
      if(s.phase==='ANSWERING'&&!done.q){done.q=1;await wait(1500);await p.evaluate(()=>document.querySelectorAll('.mode-rules').forEach(e=>e.remove()));await wait(300);await snap(p,'04-question','Вопрос');const btn=await p.$('#answers .answer');if(btn){await btn.click();await wait(900);await snap(p,'05-answered','Ответ принят');}}
      if(s.phase==='REVEALING'&&!done.r){done.r=1;await wait(1800);await snap(p,'06-reveal','Раскрытие ответа');h.send('REVEAL_READY',{gameId:s.gameId,questionId:s.question?.id});}
      if(s.phase==='RESULTS'&&!done.s){done.s=1;await wait(1500);await snap(p,'07-results','Итог вопроса');break;}
      await wait(250);}
    await p.evaluate(()=>window.FA_ROUND_SCORE?.event({payload:{selfId:'me',serverTime:Date.now(),modeSummary:{id:'g'+Date.now(),mode:'race',at:Date.now(),rows:[{playerId:'me',name:'Игрок',earned:300,total:1200},{playerId:'b',name:'Bob',earned:200,total:900}]}}}));await wait(3200);await snap(p,'08-round-score','Итоги раунда');}
  // modes started by the host
  const modes=[['09-cards','Проклятые карты',5,h=>h.send('START_CARDS',{sessionId:h.st.lobbyId})],['10-final-second','Последняя секунда',4,h=>h.send('START_FINAL_SECOND',{sessionId:h.st.lobbyId})],
    ['11-impostor','Самозванец',4,h=>h.send('START_IMPOSTOR',{sessionId:h.st.lobbyId,participantIds:h.st.players.filter(x=>!x.host).map(x=>x.id)})],['12-breach','System Breach',4,h=>h.send('SYSTEM_BREACH_START',{sessionId:h.st.lobbyId})],
    ['13-boxes','Проклятые коробки',4,h=>h.send('START_CURSED_BOXES',{sessionId:h.st.lobbyId})]];
  for(const [name,title,n,start] of modes){try{const h=await room(n);const p=await phone();await p.goto(BASE+'/#seat='+h.seat);await wait(2000);start(h);await wait(4000);await snap(p,name+'a',title);await wait(6000);await snap(p,name+'b',title+' · позже');if(h.errors.length)console.log(title,'errors',h.errors.join(','));}catch(e){console.log(title,'failed',e.message);}}
  // standalone pages
  {const p=await phone();await p.goto(BASE+'/broken-elevator-manual/?lang=ru&task=bomb');await wait(6000);await snap(p,'14-cage-bomb','Адская клетка · бомба');
    await p.goto(BASE+'/race/?lang=ru');await wait(2500);await snap(p,'15-race-pick','Забег · выбор');}
  const html='<!doctype html><meta charset=utf-8><title>Экраны телефона</title><style>body{margin:0;background:#111;color:#eee;font:15px system-ui;padding:20px}h1{font-weight:600}div{display:flex;flex-wrap:wrap;gap:22px}figure{margin:0;width:300px}img{width:300px;border-radius:22px;box-shadow:0 0 0 8px #222,0 10px 30px #000}figcaption{margin-top:12px;text-align:center}</style><h1>Экраны телефона · '+new Date().toLocaleString('ru')+'</h1><div>'+shots.map(([f,t])=>`<figure><img src="${f}"><figcaption>${t}</figcaption></figure>`).join('')+'</div>';
  fs.writeFileSync(path.join(OUT,'index.html'),html);console.log('gallery',path.resolve(OUT,'index.html'));await b.close();process.exit(0);})().catch(e=>{console.error(e);process.exit(1);});
