// CURSED RUN in real browsers: 2 phones (one a ghost) + host screen; FORMAT env; spark forced (QA server). Screenshots + checks.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE);const BASE=process.env.BASE||'http://localhost:18311',OUT=process.env.OUT,FORMAT=process.env.FORMAT||'DARKNESS';
const post=async(u,d)=>{const r=await fetch(BASE+u,{method:'POST',body:new URLSearchParams(d)});return r.json();};const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const room=await post('/rooms',{name:'QA',maxPlayers:8,mode:'CLASSIC'});const code=room.code,hostTok=room.hostSession||room.token;
  const p1=await post(`/rooms/${code}/join`,{name:'Живой',characterId:'pumpkin'}),p2=await post(`/rooms/${code}/join`,{name:'Призрак',characterId:'skeleton'});
  const ws=new WebSocket(BASE.replace('http','ws')+'/ws');await new Promise(r=>ws.onopen=r);let st=null;ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.payload?.run)st=m.payload.run;};
  const send=(t,p)=>ws.send(JSON.stringify({type:t,requestId:Math.random().toString(36).slice(2),payload:{roomCode:code,...p}}));send('AUTH',{token:hostTok});await wait(400);setInterval(()=>send('PING',{}),8000);
  send('QA_SET_ALIVE',{id:p2.selfId,alive:false});await wait(300);
  const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--use-angle=metal']});const errs=[];
  const page=async(url,vp)=>{const c=await b.newContext({viewport:vp});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.stack.slice(0,400)));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text().slice(0,160));});p.on('requestfailed',r=>errs.push('FAILED '+r.url()));await p.goto(url);return p;};
  send('OPEN_WEB_GAME',{game:'race',map:1,format:FORMAT,sparkInMs:4000});
  const A=await page(`${BASE}/race/?net=1#seat=${code}.${encodeURIComponent(p1.sessionToken||p1.token)}`,{width:844,height:390});
  const G=await page(`${BASE}/race/?net=1#seat=${code}.${encodeURIComponent(p2.sessionToken||p2.token)}`,{width:844,height:390});
  const H=await page(`${BASE}/race/?host=1&room=${code}#token=${encodeURIComponent(hostTok)}`,{width:1280,height:720});
  await wait(25000);for(const [n,p] of [['A',A],['G',G],['H',H]])console.log(n,await p.evaluate(()=>document.querySelector('#loading')?.hidden+' '+document.querySelector('#loading h2')?.textContent),errs.slice(0,3));
  for(const p of [A,G,H])await p.waitForSelector('#loading[hidden]',{state:'attached',timeout:180000});
  for(const p of [A,G])await p.click('#tap button').catch(()=>{});await G.click('#intro-skip').catch(()=>{});
  await wait(38000+5000); // intro + spark spawn
  await G.screenshot({path:OUT+'/run_ghost.png'});await H.screenshot({path:OUT+'/run_host.png'});
  console.log('spark',JSON.stringify(st?.spark),'ghost status',st?.players?.[p2.selfId]?.status,'alive status',st?.players?.[p1.selfId]?.status);
  // ghost walks to the spark: teleport its runner near the spark pad (test helper), then the client itself must pick it up
  if(st?.spark?.active){await G.evaluate(z=>{const a=window.__race;a.me.x=0;a.me.z=z;a.me.y=a.course.spawnY(z)+.2;a.me.vx=a.me.vz=0;},st.spark.z);await wait(2500);await G.screenshot({path:OUT+'/run_revive.png'});console.log('after pickup: ghost',st.players[p2.selfId].status,'spark',JSON.stringify(st.spark));}
  await wait(12000);await A.screenshot({path:OUT+'/run_alive.png'});
  console.log('after 12s: alive',st?.players?.[p1.selfId]?.status,st?.players?.[p1.selfId]?.reason,'front z',st?.front?.z?.toFixed(1),'errors',JSON.stringify(errs.slice(0,4)));
  await b.close();process.exit(0);})();
