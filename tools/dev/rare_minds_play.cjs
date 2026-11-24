'use strict';
/*
 * RARE MINDS end-to-end QA on the real room server (raceQa): a host socket, socket bots and one real phone page
 * (Playwright) that types its answers through the actual UI. Bots are scripted to produce collisions, a death zone,
 * RISK IT, an elimination and a ghost resurrection. Saves phone and private-monitor screenshots plus the host's
 * public snapshots (for the desktop preview) into OUT.
 *   PW=/path/to/playwright OUT=dir URL=http://localhost:18330 node tools/dev/rare_minds_play.cjs
 */
const fs=require('node:fs'),path=require('node:path');
const base=process.env.URL||'http://localhost:18330',out=process.env.OUT||'/tmp/rare-minds-qa';fs.mkdirSync(out,{recursive:true});
const {chromium}=require(process.env.PW||'playwright');
const bank=JSON.parse(fs.readFileSync(path.join(__dirname,'../../server/src/main/resources/rare_minds/questions.json'),'utf8'));
const ranked=qid=>{const q=bank.questions.find(x=>x.id===qid);return q.answers.slice().sort((a,b)=>b[1]-a[1]).map(a=>a[2].split('|')[0]);};
const post=async(p,d)=>{const r=await fetch(base+p,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(d)});if(!r.ok)throw Error(p+' '+await r.text());return r.json();};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function sock(code,token,onEvent){const ws=new WebSocket(base.replace(/^http/,'ws')+'/ws');ws.onopen=()=>ws.send(JSON.stringify({type:'AUTH',requestId:'auth',payload:{roomCode:code,token}}));ws.onmessage=e=>onEvent(JSON.parse(e.data));ws.cmd=(type,payload,requestId=Math.random().toString(16).slice(2))=>ws.send(JSON.stringify({type,requestId,payload:{roomCode:code,...payload}}));return ws;}

(async()=>{
  const host=await post('/rooms',{name:'RARE MINDS QA',maxPlayers:'8'}),code=host.code;
  const botNames=['Alex','Max','Kate','Luna','Nick'],bots=[];
  const phoneSeat=await post(`/rooms/${code}/join`,{name:'Mira'});
  for(const n of botNames){const id=await post(`/rooms/${code}/join`,{name:n});bots.push({name:n,id,state:null});}
  let hostState=null;const snaps={};const hostWs=sock(code,host.token,e=>{if(e.payload?.roomId)hostState=e.payload;if(e.type.endsWith('REJECTED')||e.type==='ERROR')console.log('host',e.type,e.payload.code);});
  for(const b of bots)b.ws=sock(code,b.id.token,e=>{if(e.payload?.roomId)b.state=e.payload;if(e.type==='RARE_MINDS_REJECTED')console.log(b.name,'rejected',e.payload.code);});
  const browser=await chromium.launch({executablePath:process.env.CHROME||undefined});
  const phone=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
  phone.on('pageerror',e=>console.log('PHONE ERROR',e.message));phone.on('console',m=>{if(m.type()==='error')console.log('phone console',m.text());});
  await phone.goto(base+'/#seat='+Buffer.from(JSON.stringify({code,token:phoneSeat.token,name:'Mira'})).toString('base64url'));
  const monitor=await browser.newPage({viewport:{width:1280,height:800}});
  await monitor.goto(`${base}/rare-minds-monitor/?lang=ru#room=${code}&token=${host.token}`);
  while(!hostState||hostState.players.filter(p=>p.connectionStatus==='ONLINE').length<6)await sleep(200);
  hostWs.cmd('START_RARE_MINDS',{sessionId:hostState.lobbyId});
  const rm=()=>hostState?.rareMinds;
  while(!rm())await sleep(100);
  console.log('room',code,'session',rm().sessionId);
  await sleep(2500);await phone.screenshot({path:`${out}/phone-0-intro.png`});snaps.intro=hostState;
  const id=n=>bots.find(b=>b.name===n).id.selfId;
  // per question: [Alex, Max, Kate, Luna, Nick] answer ranks (index into popularity order); equal ranks collide
  const plan={
    1:[0,0,8,3,4],    // Alex+Max collide
    2:[1,5,1,6,7],    // Alex+Kate collide → Alex 2/3 (death zone)
    3:[2,9,10,2,11],  // Alex+Luna collide → Alex eliminated (ghost)
    4:[20,0,0,12,13], // Alex unique as a ghost; Max+Kate collide
    5:[21,14,15,16,0],// Alex unique
    6:[22,0,1,0,17],  // Alex unique; Max+Luna collide → Max 2/3
    7:[23,24,2,3,4],  // Alex unique; Max RISK IT with a rare answer
    8:[25,26,0,0,1]   // Alex unique → resurrects; final question doubled
  };
  let q=0;
  while(true){
    const s=rm();if(!s)break;
    if(s.phase==='QUESTION_ACTIVE'&&s.question!==q){
      q=s.question;const answers=ranked(s.questionId);console.log('Q'+q,s.questionId,s.textEn);
      const p=plan[q];
      // drafts first (the monitor shows them), then locks staggered over a few seconds
      bots.forEach((b,i)=>{const a=answers[p[i]];b.ws.cmd('RM_DRAFT',{sessionId:s.sessionId,question:q,text:a.slice(0,Math.max(3,a.length-2)),risk:false});});
      // the phone types a rare answer through the real input
      const mine=answers[answers.length-1-(q%2)];
      await phone.waitForSelector('#rm-screen [data-k="input"]',{state:'visible',timeout:5000});
      await phone.fill('#rm-screen [data-k="input"]','');await phone.type('#rm-screen [data-k="input"]',mine.slice(0,4),{delay:60});
      await sleep(900);
      if(q===1||q===8){await monitor.screenshot({path:`${out}/monitor-q${q}-typing.png`,fullPage:true});snaps['q'+q+'-active']=hostState;await phone.screenshot({path:`${out}/phone-q${q}-typing.png`});}
      if(q===5){snaps['q5-active']=hostState;}
      await phone.type('#rm-screen [data-k="input"]',mine.slice(4),{delay:40});
      for(let i=0;i<bots.length;i++){await sleep(350);const b=bots[i];b.ws.cmd('RM_SUBMIT',{sessionId:s.sessionId,question:q,text:answers[p[i]],risk:q===7&&b.name==='Max'});}
      if(q===7){await sleep(200);}
      await phone.click('#rm-screen [data-k="send"]');await sleep(400);
      if(q===1)await phone.screenshot({path:`${out}/phone-q1-locked.png`});
    }
    if(s.phase==='REVEALING_RESULTS'&&!snaps['q'+s.question+'-reveal']){
      await sleep(3200);snaps['q'+s.question+'-reveal']=hostState;
      if([1,3,7,8].includes(s.question))await phone.screenshot({path:`${out}/phone-q${s.question}-reveal.png`});
      if(s.question===3){await monitor.screenshot({path:`${out}/monitor-q3-reveal.png`,fullPage:true});}
    }
    if(s.phase==='FINAL_RESULTS'&&!snaps.final){await sleep(5000);snaps.final=hostState;await phone.screenshot({path:`${out}/phone-final.png`});break;}
    if(q>=4&&q<=6&&s.phase==='QUESTION_ACTIVE'&&s.question===5&&!snaps.ghostPhone){/* ghost view comes from a bot, not the phone */snaps.ghostPhone=true;}
    await sleep(120);
  }
  fs.writeFileSync(`${out}/host-snapshots.json`,JSON.stringify(snaps));
  const st=rm().standings;console.log('standings',JSON.stringify(st.map(x=>({n:hostState.players.find(p=>p.id===x.playerId).name,...x}))));
  console.log('souls in wallet',hostState.players.map(p=>p.name+':'+p.souls).join(' '));
  const alex=rm().players.find(p=>p.id===id('Alex'));console.log('Alex alive',alex.alive,'resurrected',alex.resurrected,'collisions',alex.collisions);
  await browser.close();process.exit(0);
})().catch(e=>{console.error(e);process.exit(1);});
