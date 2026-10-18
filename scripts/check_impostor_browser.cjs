/* Actual controller + Javalin WebSockets. Test controls are local files, not browser endpoints. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve('server/build/impostor-browser'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function command(command,extra={}){const id=crypto.randomUUID(),file=path.join(dir,'control.json');fs.writeFileSync(file+'.tmp',JSON.stringify({id,command,...extra}));fs.renameSync(file+'.tmp',file);if(command==='stop')return;for(let i=0;i<200;i++){try{if(JSON.parse(fs.readFileSync(path.join(dir,'processed.json'))).id===id)return;}catch{}await sleep(25);}throw Error('Fixture timed out: '+command);}
async function checkFinalAct({clients,count,latest,ready,matchIndex}){
  const active=clients.slice(0,count),watcher=clients[count],first=active[0].page;
  const impostor=active.findIndex(c=>latest(c).role==='IMPOSTOR');
  const actualId=active[impostor].credentials.selfId;
  const states=c=>c.frames.filter(e=>e.payload?.impostor).map(e=>e.payload.impostor);
  assert(clients.every(c=>states(c).every(s=>!s.revealedImpostorId&&!s.finalVoteSnapshot&&!s.outcome)),'Premature final data');
  await command('advance',{millis:30000});
  for(const c of clients)await c.page.waitForFunction(()=>document.getElementById('final-title').textContent==='WHO IS THE IMPOSTOR?');
  assert.equal(await first.locator('.final-vote-card').count(),count);
  assert.equal(await first.locator(`#final-cards [data-id="${active[0].credentials.selfId}"]`).isDisabled(),true);
  assert.equal(await watcher.page.locator('.final-vote-card:enabled').count(),0);
  // A separate authenticated socket exercises rejected wire messages without exposing test controls in the app.
  async function wire(client,fields){return client.page.evaluate(async fields=>{
    return await new Promise((resolve,reject)=>{const ws=window.__qaSocket,requestId=crypto.getRandomValues(new Uint32Array(1))[0].toString(16),timeout=setTimeout(()=>{ws.removeEventListener('message',receive);reject(Error('wire timeout'));},5000);
      function receive(e){const m=JSON.parse(e.data);if(m.requestId===requestId){clearTimeout(timeout);ws.removeEventListener('message',receive);resolve(m);}}
      ws.addEventListener('message',receive);ws.send(JSON.stringify({type:'SUBMIT_FINAL_VOTE',requestId,payload:fields}));
    });
  },fields);}
  let rejected=await wire(watcher,{roomCode:ready.code,sessionId:latest(watcher).sessionId,suspectId:actualId});assert.equal(rejected.payload.code,'NOT_ELIGIBLE');
  const base={roomCode:ready.code,sessionId:latest(active[0]).sessionId};
  rejected=await wire(active[0],{...base,suspectId:active[0].credentials.selfId});assert.equal(rejected.payload.code,'SELF_VOTE');
  rejected=await wire(active[0],{...base,suspectId:watcher.credentials.selfId});assert.equal(rejected.payload.code,'INVALID_SUSPECT');
  const submitCount=matchIndex===2?1:count;
  let expected;
  for(let i=0;i<submitCount;i++){
    let target;
    if(matchIndex===0)target=i===impostor?(i+1)%count:impostor;
    else if(matchIndex===1)target=(i+1)%count;
    else target=active.findIndex((c,n)=>n!==i&&n!==impostor);
    const p=active[i].page,id=active[target].credentials.selfId;
    await p.locator(`#final-cards [data-id="${id}"]`).click();await p.locator("#confirm-vote").click();
    await p.waitForFunction(()=>document.getElementById('final-status').textContent==='VOTE ACCEPTED. Your choice is final.'||document.getElementById('final-title').textContent==='VOTING LOCKED');
    assert.equal(await p.locator('.final-vote-card:enabled').count(),0);
    if(i===0){const duplicate=await wire(active[0],{roomCode:ready.code,sessionId:latest(active[0]).sessionId,suspectId:id});assert.equal(duplicate.payload.code,'FINAL_VOTE_ALREADY_SUBMITTED');await p.reload();await p.locator('#final-screen').waitFor({state:'visible'});
      if(matchIndex!==2)assert.equal(await p.locator('.final-vote-card.selected').count(),1);
    }
  }
  if(matchIndex===2){await command('advance',{millis:20000});expected='IMPOSTOR_ESCAPED';}
  else expected=matchIndex===0?'IMPOSTOR_CAUGHT':'NO_CONSENSUS';
  for(const c of clients)await c.page.waitForFunction(()=>document.getElementById('final-title').textContent==='VOTING LOCKED');
  assert(!latest(watcher).finalVoteSnapshot,'Locked votes leaked before reveal');assert(!latest(watcher).revealedImpostorId);
  await command('advance',{millis:700});
  for(const c of clients)await c.page.waitForFunction(()=>document.getElementById('final-title').textContent==='THE VOTES ARE BEING REVEALED');
  const snapshot=latest(watcher).finalVoteSnapshot;assert.equal(snapshot.stampTargets.length,submitCount);
  assert.equal(Object.values(snapshot.counts).reduce((a,b)=>a+b,0),submitCount);assert(!latest(watcher).outcome);assert(!latest(watcher).revealedImpostorId);
  await watcher.page.reload();await watcher.page.locator('#final-screen').waitFor({state:'visible'});assert.deepEqual(latest(watcher).finalVoteSnapshot,snapshot,'Reconnect changed snapshot');
  await command('advance',{millis:800+submitCount*400+1000});
  for(const c of clients)await c.page.waitForFunction(()=>document.getElementById('final-title').textContent==='THE MOST SUSPECTED PLAYER IS…');
  assert(!latest(watcher).revealedImpostorId);assert(!latest(watcher).outcome);
  await command('advance',{millis:3500});for(const c of clients)await c.page.waitForFunction(()=>document.getElementById('final-title').textContent==='THE IMPOSTOR IS…');
  assert.equal(latest(watcher).revealedImpostorId,actualId);assert.equal(await watcher.page.locator('#final-announcement').textContent(),'IMPOSTOR: '+latest(watcher).participants.find(p=>p.id===actualId).name);assert.equal(latest(watcher).outcome,expected);
  await command('advance',{millis:4000});for(const c of clients)await c.page.waitForFunction(title=>document.getElementById('final-title').textContent===title,expected==='IMPOSTOR_ESCAPED'?'THE IMPOSTOR ESCAPED':expected.replaceAll('_',' '));
  for(const c of clients){assert.equal(await c.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await c.page.locator('#final-results li').count(),count);}
  for(const width of [360,390,768]){await first.setViewportSize({width,height:844});await first.screenshot({path:path.join(dir,`stage6-${count}players-${expected}-${width}.png`),fullPage:true});}
  console.log(`PASS FINAL: ${count} active + 2 spectators, ${expected}, ${submitCount} votes/stamps, privacy, self/spectator restrictions, locked input, reconnect, deadlines and result`);
}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
 try{let matchIndex=0;for(const count of (process.env.IMPOSTOR_FINAL_QA?[3,4,3]:[3,4])){
   const ready=JSON.parse(fs.readFileSync(path.join(dir,'ready.json'))),clients=[],errors=[];
   for(let i=0;i<count+2;i++){
     const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage(),frames=[];
     if(process.env.IMPOSTOR_FINAL_QA)await page.addInitScript(()=>{const Native=window.WebSocket;window.WebSocket=class extends Native{constructor(...args){super(...args);window.__qaSocket=this;}};});
     page.on('pageerror',e=>errors.push(e.message));page.on('websocket',socket=>socket.on('framereceived',e=>{try{frames.push(JSON.parse(e.payload));}catch{}}));
     await page.goto(ready.url);await page.locator('#room-code').fill(ready.code);await page.locator('#nickname').fill(process.env.IMPOSTOR_FINAL_QA&&i===1?'ОченьДлинныйНикИгрока'+i:'Guest'+i);
     const joined=page.waitForResponse(r=>r.url().endsWith('/join')&&r.request().method()==='POST');await page.locator('#join-button').click();
     const credentials=await(await joined).json();await page.locator('#waiting-screen').waitFor({state:'visible'});clients.push({context,page,frames,credentials});
   }
   await command('start-game',{activeIds:clients.slice(0,count).map(c=>c.credentials.selfId)});
   for(const c of clients)await c.page.locator('#impostor-screen').waitFor({state:'visible'});
   const latest=c=>c.frames.filter(e=>e.payload?.impostor).at(-1)?.payload.impostor;
   const roles=clients.slice(0,count).map(latest);assert.equal(roles.filter(s=>s.role==='IMPOSTOR').length,1);
   const word=roles.find(s=>s.role==='ORDINARY').secretWord;
   for(let i=0;i<clients.length;i++){
     const c=clients[i],s=latest(c);
     if(s.role==='ORDINARY')assert.equal(await c.page.locator('#impostor-word').textContent(),word);
     else{assert.equal(await c.page.locator('#impostor-word').textContent(),'');assert(!JSON.stringify(c.frames).includes(word),'Private word leaked');}
     if(i>=count){assert(!s.role);assert(!s.activeParticipant);assert.equal(await c.page.locator('#clue-form').isVisible(),false);}
   }
   await clients[0].page.screenshot({path:path.join(dir,`${count}participants-role.png`),fullPage:true});
   await command('advance',{millis:4000});
   const words=[['ТЕПЛО','СВЕТ','НЕБО','ДОРОГА'],['СОЛНЦЕ','ЛАМПА','ВЕТЕР','ДВИЖЕНИЕ'],['ЛЕТО','ЛУНА','ПОЛЁТ','СКОРОСТЬ']];
   for(let round=1;round<=3;round++){
     for(const c of clients.slice(0,count))await c.page.waitForFunction(r=>document.getElementById('impostor-round').textContent===`ROUND ${r} / 3`&&!document.getElementById('clue-input').disabled,round);
     if(round===1){
       await clients[0].page.locator('#clue-input').fill('two words');await clients[0].page.locator('#clue-submit').click();
       await clients[0].page.waitForFunction(()=>document.getElementById('clue-status').textContent.startsWith('Invalid clue.'));
       assert.equal(await clients[0].page.locator('#clue-input').isDisabled(),false);
     }
     const submitted=round===2?count-1:count;
     for(let i=0;i<submitted;i++){
       const p=clients[i].page;await p.locator('#clue-input').fill(words[round-1][i]);
       if(i%2===0)await p.locator('#clue-input').press('Enter');else await p.locator('#clue-submit').click();
       if(i<submitted-1||round===2)await p.waitForFunction(()=>document.getElementById('clue-status').textContent==='WAITING FOR OTHER PLAYERS');
       else await p.waitForFunction(()=>document.getElementById('clue-status').textContent==='Watch the shared screen.');
       assert.equal(await p.locator('#clue-input').isDisabled(),true);
       if(i===0&&round===1){await p.reload();await p.waitForFunction(()=>document.getElementById('clue-status').textContent==='WAITING FOR OTHER PLAYERS');assert.equal(await p.locator('#clue-input').inputValue(),words[0][0]);}
     }
     if(round===2)await command('advance',{millis:10000});
     for(const c of clients)await c.page.waitForFunction(()=>document.getElementById('clue-status').textContent==='Watch the shared screen.');
     const data=latest(clients.at(-1));assert.equal(data.revealSequence,round);assert.equal(data.revealedClues.length,round);
     if(round===2)assert.equal(data.revealedClues[1][clients[count-1].credentials.selfId],'—');
     assert.equal(await clients[0].page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
     await clients[0].page.screenshot({path:path.join(dir,`${count}participants-round-${round}.png`),fullPage:true});
     await command('advance',{millis:500});for(const c of clients)await c.page.locator('#suspicion-screen').waitFor({state:'visible'});
     // A real spectator submits through the existing Stage 4 controller.
     const watcher=clients[count].page;await watcher.locator(`[data-id="${clients[0].credentials.selfId}"]`).click();
     await watcher.waitForFunction(()=>document.querySelectorAll('.suspect-card.selected').length===1);
     await command('advance',{millis:5000});await watcher.waitForFunction(()=>document.getElementById('suspicion-title').textContent==='SUSPICIONS SEALED');
     await command('advance',{millis:1851});
   }
   for(const c of clients)await c.page.waitForFunction(()=>document.getElementById('final-title').textContent==='FINAL DISCUSSION');
   assert.equal(latest(clients[0]).phase,'EVIDENCE_REVIEW');
   for(let i=0;i<clients.length;i++){
     if(i>=count||latest(clients[i]).role==='IMPOSTOR')assert(!JSON.stringify(clients[i].frames).includes(word),'Secret leaked in a later phase');
     assert(clients[i].frames.every(e=>!e.payload?.impostor?.impostorId&&!e.payload?.impostor?.roles),'Role map leaked');
   }
   if(process.env.IMPOSTOR_FINAL_QA)await checkFinalAct({clients,count,latest,ready,matchIndex:matchIndex++});
   assert.deepEqual(errors,[]);await sleep(1000);await command('new');for(const c of clients)await c.context.close();
   console.log(`PASS: ${count} active + 2 spectators, private roles, Enter/button, rejection, locked clues, reconnect, early finish, timeout, three reveals and suspicion phases`);
 }}finally{await command('stop');await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
