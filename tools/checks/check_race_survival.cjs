// CURSED RUN server rules, headless: fake phones over /ws against the QA server (./gradlew :server:raceQa).
// BASE=http://localhost:18311 node tools/checks/check_race_survival.cjs
const assert=require('node:assert/strict');const BASE=process.env.BASE||'http://localhost:18311';
const post=async(u,d)=>{const r=await fetch(BASE+u,{method:'POST',body:new URLSearchParams(d)});const j=await r.json();if(!r.ok)throw new Error(u+JSON.stringify(j));return j;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));let rq=0;
function sock(code,token){const ws=new WebSocket(BASE.replace('http','ws')+'/ws');const o={run:null,st:null,res:[],send:(type,p={},id='r'+(++rq))=>{ws.send(JSON.stringify({type,requestId:id,payload:{roomCode:code,...p}}));return id;}};
  o.ready=new Promise(r=>ws.onopen=()=>{o.send('AUTH',{token});setTimeout(r,300);});
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.payload?.run)o.run=m.payload.run;if(m.payload?.code&&m.payload.selfId!==undefined)o.st=m.payload;if(m.type==='RACE_SPARK_RESULT')o.res.push(m.payload.result);};o.ws=ws;return o;}
const CPS=[0,40,80,120,160,200,240,280],FIN=320;
async function room(n,{ghosts=[],format,limitMs=8000,sparkInMs}){
  const r=await post('/rooms',{name:'QA',maxPlayers:8,mode:'CLASSIC'});const host=sock(r.code,r.hostSession||r.token);await host.ready;const ps=[];
  for(let i=0;i<n;i++){const j=await post(`/rooms/${r.code}/join`,{name:'P'+i,characterId:['pumpkin','skeleton','dracula','voodoo','ghost','zombie'][i]});const s=sock(r.code,j.sessionToken||j.token);await s.ready;ps.push({id:j.selfId,s});}
  for(const g of ghosts)host.send('QA_SET_ALIVE',{id:ps[g].id,alive:false});await wait(200);
  host.send('OPEN_WEB_GAME',{game:'race',map:1,format,startInMs:300,limitMs,...(sparkInMs!==undefined?{sparkInMs}:{})});await wait(600);
  const at=(i,z,cp,fin=0)=>ps[i].s.send('RACE_STATE',{s:[0,0,z,0,1,cp,z,fin,0,0],c:CPS,f:FIN});
  const run=()=>host.run||ps[0].s.run;const stat=i=>run().players[ps[i].id];
  const alive=i=>host.st.players.find(p=>p.id===ps[i].id).isAlive;
  return {host,ps,at,run,stat,alive,close:()=>{host.ws.close();ps.forEach(p=>p.s.ws.close());}};}
const results=[];const T=async(name,fn)=>{try{await fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' — '+e.message);}};
(async()=>{
  await T('1 all alive, all finish (DEATH_RUN) -> everyone survives',async()=>{const R=await room(3,{format:'DEATH_RUN'});for(let i=0;i<3;i++)R.at(i,FIN+1,7,1);await wait(800);for(let i=0;i<3;i++)assert.equal(R.stat(i).status,'SAVED');assert(R.run().ended);await wait(300);for(let i=0;i<3;i++)assert.equal(R.alive(i),true);R.close();});
  await T('13 nobody finishes -> all alive die on time',async()=>{const R=await room(2,{format:'DEATH_RUN',limitMs:1500});R.at(0,50,1);R.at(1,60,1);await wait(2200);assert.equal(R.stat(0).status,'DEAD');assert.equal(R.stat(0).reason,'TIME');await wait(200);assert.equal(R.alive(0),false);R.close();});
  await T('2 all ghosts -> race ends, nobody revives without spark',async()=>{const R=await room(2,{ghosts:[0,1],format:'DEATH_RUN',limitMs:1500});R.at(0,FIN+1,7,1);await wait(2200);assert.equal(R.stat(0).status,'GHOST_FINISHED');assert.equal(R.alive(0),false);R.close();});
  await T('8 ghost finishes without spark stays a ghost',async()=>{const R=await room(2,{ghosts:[1],format:'DEATH_RUN'});R.at(1,FIN+1,7,1);await wait(500);assert.equal(R.stat(1).status,'GHOST_FINISHED');assert.equal(R.stat(1).alive,false);R.close();});
  await T('4+6 ghost takes the spark, revives, finishes -> alive for the next game',async()=>{const R=await room(2,{ghosts:[1],format:'DEATH_RUN',sparkInMs:200});await wait(700);R.at(1,10,1);await wait(300);
    const sp=R.run().spark;assert(sp.active,'spark active');R.at(1,sp.z,sp.cp);await wait(150);R.ps[1].s.send('RACE_SPARK',{});await wait(400);assert.equal(R.ps[1].s.res[0],'OK');assert.equal(R.stat(1).status,'REVIVED');
    R.at(0,FIN+1,7,1);R.at(1,FIN+1,7,1);await wait(800);assert.equal(R.stat(1).status,'SAVED');assert(R.run().ended);await wait(200);assert.equal(R.alive(1),true);R.close();});
  await T('5 two ghosts grab at once -> exactly one revives',async()=>{const R=await room(3,{ghosts:[1,2],format:'DEATH_RUN',sparkInMs:200});await wait(700);R.at(1,10,1);await wait(300);const sp=R.run().spark;R.at(1,sp.z,sp.cp);R.at(2,sp.z,sp.cp);await wait(150);
    R.ps[1].s.send('RACE_SPARK',{});R.ps[2].s.send('RACE_SPARK',{});await wait(500);const ok=[R.ps[1].s.res[0],R.ps[2].s.res[0]].filter(x=>x==='OK').length;assert.equal(ok,1);assert(!R.run().spark.active);R.close();});
  await T('live player cannot take the spark; far ghost rejected; duplicates ignored',async()=>{const R=await room(2,{ghosts:[1],format:'DEATH_RUN',sparkInMs:200});await wait(700);R.at(0,10,1);await wait(300);const sp=R.run().spark;
    R.at(0,sp.z,sp.cp);await wait(150);R.ps[0].s.send('RACE_SPARK',{});R.at(1,sp.z-30,1);await wait(150);R.ps[1].s.send('RACE_SPARK',{});await wait(400);assert.deepEqual([R.ps[0].s.res[0],R.ps[1].s.res[0]],['NOT_A_GHOST','TOO_FAR']);
    R.at(1,sp.z,sp.cp);await wait(150);R.ps[1].s.send('RACE_SPARK',{},'same');R.ps[1].s.send('RACE_SPARK',{},'same');await wait(400);assert.deepEqual(R.ps[1].s.res.slice(1),['OK','DUPLICATE']);R.close();});
  await T('7 revived ghost then fails -> ghost again',async()=>{const R=await room(2,{ghosts:[1],format:'DEATH_RUN',sparkInMs:200,limitMs:2500});await wait(700);R.at(1,10,1);await wait(300);const sp=R.run().spark;R.at(1,sp.z,sp.cp);await wait(150);R.ps[1].s.send('RACE_SPARK',{});await wait(300);
    R.at(0,FIN+1,7,1);await wait(2500);assert.equal(R.stat(1).status,'DEAD');await wait(200);assert.equal(R.alive(1),false);R.close();});
  await T('15 revive right before the end -> server order decides (revived, then time up -> dead)',async()=>{const R=await room(1,{ghosts:[0],format:'DEATH_RUN',sparkInMs:100,limitMs:1400});await wait(600);R.at(0,10,1);await wait(200);const sp=R.run().spark;R.at(0,sp.z,sp.cp);await wait(100);R.ps[0].s.send('RACE_SPARK',{});await wait(1200);assert.equal(R.stat(0).revived,true);assert.equal(R.stat(0).status,'DEAD');R.close();});
  await T('10 spark disappears when the race ends',async()=>{const R=await room(2,{ghosts:[1],format:'DEATH_RUN',sparkInMs:200,limitMs:1500});await wait(800);R.at(0,10,1);await wait(1500);assert.equal(R.run().spark.active,false);assert(R.run().ended);R.close();});
  await T('11 disconnect during revival -> final state still decided by the rules',async()=>{const R=await room(2,{ghosts:[1],format:'DEATH_RUN',sparkInMs:200,limitMs:2500});await wait(700);R.at(1,10,1);await wait(300);const sp=R.run().spark;R.at(1,sp.z,sp.cp);await wait(150);R.ps[1].s.send('RACE_SPARK',{});await wait(200);R.ps[1].s.ws.close();
    R.at(0,FIN+1,7,1);await wait(2600);assert.equal(R.stat(1).status,'DEAD');R.close();});
  await T('DARKNESS: player behind the front dies, ahead survives at finish',async()=>{const R=await room(2,{format:'DARKNESS',limitMs:60000});await wait(400);R.at(0,30,1);R.at(1,-14,0);await wait(400);
    // front starts at -12 after 10 s delay: P1 at -14 is already behind it once it starts moving
    await wait(10500);R.at(1,-14,0);await wait(400);assert.equal(R.stat(1).status,'DEAD');assert.equal(R.stat(1).reason,'DARKNESS');R.at(0,FIN+1,7,1);await wait(600);assert.equal(R.stat(0).status,'SAVED');R.close();});
  await T('LAST_SURVIVORS 4 alive: gate quotas 3/2/1, latecomers die, one survivor is never killed by a quota',async()=>{const R=await room(4,{format:'LAST_SURVIVORS',limitMs:60000});await wait(400);
    for(const i of [0,1,2])R.at(i,90,2);await wait(400);assert.equal(R.stat(3).status,'DEAD');assert.equal(R.stat(3).reason,'GATE');
    for(const i of [0,1])R.at(i,170,4);await wait(400);assert.equal(R.stat(2).status,'DEAD');R.at(0,250,6);await wait(400);assert.equal(R.stat(1).status,'DEAD');await wait(400);assert.equal(R.stat(0).status,'SAVED');assert(R.run().ended);R.close();});
  await T('14 LAST_SURVIVORS with one alive: no quota death, finishes alive',async()=>{const R=await room(2,{ghosts:[1],format:'LAST_SURVIVORS',limitMs:60000});await wait(400);R.at(0,250,6);await wait(300);assert.equal(R.stat(0).status,'RUNNING');R.at(0,FIN+1,7,1);await wait(400);assert.equal(R.stat(0).status,'SAVED');R.close();});
  await T('SALVATION 4 alive -> 3 seats, fourth dies at the gate',async()=>{const R=await room(4,{format:'SALVATION',limitMs:60000});await wait(400);assert.equal(R.run().seats,3);for(const i of [0,1,2])R.at(i,FIN+1,7,1);await wait(500);
    assert.equal(R.run().seatsUsed,3);assert.equal(R.stat(3).status,'DEAD');assert.equal(R.stat(3).reason,'SEATS');R.close();});
  await T('LAST_CHANCE: personal timer, checkpoints add time',async()=>{const R=await room(2,{format:'LAST_CHANCE',limitMs:60000});await wait(400);const d0=R.stat(0).deadline;R.at(0,40,1);await wait(400);assert.equal(R.stat(0).deadline-d0,12000);R.close();});
  await T('16 revival persists into the room state for the next mini-game',async()=>{const R=await room(2,{ghosts:[1],format:'DEATH_RUN',sparkInMs:200});await wait(700);R.at(1,10,1);await wait(300);const sp=R.run().spark;R.at(1,sp.z,sp.cp);await wait(150);R.ps[1].s.send('RACE_SPARK',{});await wait(300);
    R.at(0,FIN+1,7,1);R.at(1,FIN+1,7,1);await wait(800);R.host.send('CLOSE_WEB_GAME',{});await wait(400);const p=R.host.st.players.find(p=>p.id===R.ps[1].id);assert.equal(p.isAlive,true);assert.equal(p.isGhost,false);R.close();});
  console.log(results.join('\n'));process.exit(results.some(r=>r.startsWith('FAIL'))?1:0);
})();
