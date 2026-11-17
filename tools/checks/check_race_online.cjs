// Online race QA: BASE=http://localhost:18311 OUT=dir PLAYWRIGHT_MODULE=... CHROME_PATH=... node tools/checks/check_race_online.cjs
// Creates a room, joins two phones, opens the race from the host socket, loads both phone pages + the host screen,
// runs one phone forward, and checks every page sees the other runner move.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const BASE=process.env.BASE||'http://localhost:18311',OUT=process.env.OUT||'/tmp';
const post=async(u,d)=>{const r=await fetch(BASE+u,{method:'POST',body:new URLSearchParams(d)});const j=await r.json();if(!r.ok)throw new Error(u+' '+JSON.stringify(j));return j;};
(async()=>{
  const room=await post('/rooms',{name:'RaceQA',maxPlayers:8,mode:'CLASSIC'});const code=room.code,hostTok=room.hostSession||room.token;
  const p1=await post(`/rooms/${code}/join`,{name:'Аня',characterId:'pumpkin'}),p2=await post(`/rooms/${code}/join`,{name:'Боря',characterId:'skeleton'});
  const t1=p1.sessionToken||p1.token,t2=p2.sessionToken||p2.token;
  const ws=new WebSocket(BASE.replace('http','ws')+'/ws');await new Promise(r=>ws.onopen=r);const send=(type,payload)=>ws.send(JSON.stringify({type,requestId:'q'+Math.random().toString(36).slice(2),payload}));
  send('AUTH',{roomCode:code,token:hostTok});setInterval(()=>send('PING',{roomCode:code}),8000);await new Promise(r=>setTimeout(r,500));
  const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined,args:['--use-angle=metal','--ignore-gpu-blocklist']});
  const phone=async(tok,name)=>{const c=await b.newContext({viewport:{width:844,height:390},hasTouch:true});await c.addInitScript(([code,tok,name])=>sessionStorage.setItem('finalanswer-session',JSON.stringify({code,token:tok,name})),[code,tok,name]);const p=await c.newPage();const e=[];p.on('pageerror',x=>e.push(x.message));await p.goto(BASE+'/');return {p,e};};
  const a=await phone(t1,'Аня'),bb=await phone(t2,'Боря');
  send('OPEN_WEB_GAME',{roomCode:code,game:'race',map:1});
  const host=await (await b.newContext({viewport:{width:1280,height:720}})).newPage();const he=[];host.on('pageerror',x=>he.push(x.message));
  await host.goto(`${BASE}/race/?host=1&room=${code}#token=${encodeURIComponent(hostTok)}`);
  await new Promise(r=>setTimeout(r,4000));console.log('urls',a.p.url(),bb.p.url(),await a.p.evaluate(()=>document.body.dataset.view));
  for(const x of [a,bb])await x.p.waitForURL(/race/,{timeout:30000,waitUntil:'commit'});
  for(const pg of [a.p,bb.p,host])await pg.waitForSelector('#loading[hidden]',{timeout:120000,state:'attached'});
  await new Promise(r=>setTimeout(r,9000));await host.screenshot({path:OUT+'/online_intro.png'});await new Promise(r=>setTimeout(r,33000)); // intro + countdown
  await a.p.keyboard.down('KeyW');await new Promise(r=>setTimeout(r,5000));await a.p.keyboard.up('KeyW');
  const prog=async pg=>pg.evaluate(()=>[...document.querySelectorAll('#track i')].map(i=>parseFloat(i.style.left)||0));
  console.log('phone A track',await prog(a.p),'phone B track',await prog(bb.p),'host track',await prog(host));
  await a.p.screenshot({path:OUT+'/online_a.png'});await bb.p.screenshot({path:OUT+'/online_b.png'});await host.screenshot({path:OUT+'/online_host.png'});
  console.log('errors',JSON.stringify([...a.e,...bb.e,...he].slice(0,5)));
  send('CLOSE_WEB_GAME',{roomCode:code});await new Promise(r=>setTimeout(r,6000));console.log('after close A url',a.p.url());
  await b.close();ws.close();process.exit(0);
})().catch(e=>{console.error(e);process.exit(1);});
