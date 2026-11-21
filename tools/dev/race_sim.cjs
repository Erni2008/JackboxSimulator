// Full automatic run on a spare QA server: bots join, answer a quiz question (some wrong), then EVERYONE — wrong answers too —
// races the CURSED RACE as autopilot browser phones while the host screen opens in your browser.
// BASE=http://localhost:18311 PLAYERS=5 MAP=1 PLAYWRIGHT_MODULE=... CHROME_PATH=... node tools/dev/race_sim.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const {execSync}=require('node:child_process');
const BASE=process.env.BASE||'http://localhost:18311',N=Number(process.env.PLAYERS||5),MAP=Number(process.env.MAP||1),ME=process.env.ME!=='0';
const post=async(u,d)=>{const r=await fetch(BASE+u,{method:'POST',body:new URLSearchParams(d)});const j=await r.json();if(!r.ok)throw new Error(u+' '+JSON.stringify(j));return j;};
const rid=()=>Math.random().toString(36).slice(2);const wait=ms=>new Promise(r=>setTimeout(r,ms));
function sock(code,token,onState){const ws=new WebSocket(BASE.replace('http','ws')+'/ws');const o={ws,state:null,send:(type,payload)=>ws.readyState===1&&ws.send(JSON.stringify({type,requestId:rid(),payload:{roomCode:code,...payload}}))};
  ws.onopen=()=>o.send('AUTH',{token});ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.payload?.code&&m.payload.selfId!==undefined){o.state=m.payload;onState?.(m.payload,m.type);}else if(m.type==='ERROR'||m.type.endsWith('REJECTED'))console.log('  !',m.type,m.payload?.code);};
  setInterval(()=>o.send('PING',{}),8000);return o;}
(async()=>{
  const names=['Аня','Боря','Вика','Гоша','Даша','Егор','Женя','Зоя'],chars=['pumpkin','skeleton','dracula','voodoo','ghost','zombie','plague_doctor','puppeteer'];
  const room=await post('/rooms',{name:'Симуляция',maxPlayers:8,mode:'CLASSIC'});const code=room.code,hostTok=room.hostSession||room.token;console.log('room',code);
  const host=sock(code,hostTok);const players=[];
  if(ME){names.unshift('Вы');chars.unshift(process.env.CHAR||'pumpkin');chars.splice(chars.lastIndexOf(process.env.CHAR||'pumpkin'),1);}
  for(let i=0;i<N+(ME?1:0);i++){const j=await post(`/rooms/${code}/join`,{name:names[i],characterId:chars[i]});players.push({name:names[i],tok:j.sessionToken||j.token,id:j.selfId});}
  for(const p of players)p.s=sock(code,p.tok);await wait(1500);
  // ---- quiz: one question, everyone answers at random (wrong answers included) ----
  host.send('START_GAME',{});let answered=false,revealed=false;
  for(let t=0;t<120&&!revealed;t++){await wait(500);const st=host.state;if(!st)continue;const ph=st.phase,ids={gameId:st.gameId,questionId:st.question?.id};
    if(ph==='QUESTION_PRESENTATION')host.send('PRESENTATION_READY',ids);
    if(ph==='ANSWERING'&&!answered){answered=true;console.log('question:',st.question?.text||st.question?.prompt||'(вопрос)');for(const p of players){const a=Math.floor(Math.random()*4);p.answer=a;p.s.send('SUBMIT_ANSWER',{...ids,answerIndex:a});}}
    if(['REVEALING','RESULTS','ROUND_CLUE_REVEAL'].includes(ph)&&answered){revealed=true;const c=st.question?.correctAnswerIndex??st.correctAnswerIndex;
      for(const p of players)console.log(`  ${p.name}: ответ ${p.answer+1}${c!==undefined?(p.answer===c?' ✓ верно':' ✗ неверно'):''}`);}}
  // ---- the race: everyone runs, regardless of the answer ----
  // wrong answers -> ghosts (as if they lost earlier), so the survival rules and the Life Spark can be checked
  if(process.env.GHOSTS!=='0')for(const p of players)if(p.name!=='Вы'&&p.answer!==undefined&&host.state?.question&&p.answer!==(host.state.question.correctAnswerIndex??-1)){host.send('QA_SET_ALIVE',{id:p.id,alive:false});console.log('  '+p.name+' -> призрак');}
  await wait(400);
  host.send('OPEN_WEB_GAME',{game:'race',map:MAP,...(process.env.FORMAT?{format:process.env.FORMAT}:{}),...(process.env.SPARK?{sparkInMs:Number(process.env.SPARK)}:{})});await wait(1500);
  if(host.state?.webGame!=='race'){console.log('race did not open (phase',host.state?.phase,')');process.exit(1);}
  console.log('race open: map',host.state.race.map,'format',host.state.run?.format,'seed',host.state.race.seed,'— all',N,'players run, including wrong answers');
  if(ME){const me=players.shift();me.s.ws.close();execSync(`open "${BASE}/race/?net=1#seat=${code}.${encodeURIComponent(me.tok)}"`);console.log('YOUR runner opened in the browser: WASD + SPACE');}
  else execSync(`open "${BASE}/race/?host=1&room=${code}#token=${encodeURIComponent(hostTok)}"`);
  const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined,args:['--use-angle=metal','--ignore-gpu-blocklist']});
  for(const p of players){const c=await b.newContext({viewport:{width:640,height:360}});await c.addInitScript(([code,tok,name])=>sessionStorage.setItem('finalanswer-session',JSON.stringify({code,token:tok,name})),[code,p.tok,p.name]);
    const pg=await c.newPage();pg.on('pageerror',e=>console.log('  page error',p.name,e.message));await pg.goto(BASE+'/race/?net=1&bot=1');p.pg=pg;}
  console.log('autopilot phones running… (Ctrl+C to stop)');
  for(;;){await wait(10000);const r=await fetch(`${BASE}/rooms/${code}/race?token=${encodeURIComponent(hostTok)}`).then(x=>x.json()).catch(()=>null);if(!r)continue;
    const line=players.map(p=>{const v=r.runners?.[p.id];return v?`${p.name} ${Math.round(v[6])}м${v[7]?' ФИНИШ':''}`:`${p.name} —`;}).join(' | ');console.log(line);if(r.webGame!=='race')break;}
  await b.close();process.exit(0);
})().catch(e=>{console.error(e);process.exit(1);});
