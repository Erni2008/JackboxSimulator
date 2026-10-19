/* Stage 7: real server + independent phone browsers; six matches in ONE room. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve('server/build/impostor-browser'),polish=process.env.IMPOSTOR_POLISH_QA==='1',redesign=process.env.IMPOSTOR_UI_QA==='1';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function advance(millis){const id=crypto.randomUUID(),file=path.join(dir,'control.json');fs.writeFileSync(file+'.tmp',JSON.stringify({id,command:'advance',millis}));fs.renameSync(file+'.tmp',file);for(let n=0;n<200;n++){try{if(JSON.parse(fs.readFileSync(path.join(dir,'processed.json'))).id===id)return;}catch{}await sleep(25);}throw Error('Clock timeout');}
async function wire(page,type,payload={}){return page.evaluate(({type,payload})=>new Promise((resolve,reject)=>{
  const requestId=crypto.randomUUID(),ws=window.__qaSocket,timer=setTimeout(()=>reject(Error(type+' timeout')),5000);
  const receive=e=>{const m=JSON.parse(e.data);if(m.requestId===requestId){clearTimeout(timer);ws.removeEventListener('message',receive);resolve(m);}};
  ws.addEventListener('message',receive);ws.send(JSON.stringify({type,requestId,payload}));
}),{type,payload});}
async function inspectButtons(page,kind='mobile'){
  const button=page.locator('#join-button');await button.waitFor();await page.waitForFunction(()=>document.querySelector('#join-button').dataset.faReady==='true');
  assert.equal(await button.locator('svg').count(),3);
  await button.focus();assert.equal(await button.evaluate(b=>b.matches(':focus-visible')),true);
  await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'password');await button.focus();
  if(await page.evaluate(()=>matchMedia('(hover:hover)').matches)){await button.hover();assert.equal(await button.locator('.fa-hover').evaluate(b=>getComputedStyle(b).visibility),'visible');}
  await button.evaluate(b=>{b.addEventListener('pointerdown',()=>b.dataset.sawTouchPress=String(b.classList.contains('is-pressed')));});
  if(kind==='mobile'){await button.tap();assert.equal(await button.getAttribute('data-saw-touch-press'),'true');assert.equal(await button.evaluate(b=>b.classList.contains('is-pressed')),false);}
  await button.focus();await page.keyboard.down('Space');assert.equal(await button.evaluate(b=>b.classList.contains('is-pressed')),true);await page.keyboard.up('Space');
  await page.evaluate(()=>document.getElementById('join-button').dispatchEvent(new PointerEvent('pointerdown',{pointerId:6,bubbles:true})));assert.equal(await button.evaluate(b=>b.classList.contains('is-pressed')),true);
  await page.evaluate(()=>document.getElementById('join-button').dispatchEvent(new PointerEvent('pointercancel',{pointerId:6,bubbles:true})));assert.equal(await button.evaluate(b=>b.classList.contains('is-pressed')),false);
  await button.evaluate(b=>b.disabled=true);assert.equal(await button.isDisabled(),true);await button.evaluate(b=>b.disabled=false);
  await button.click();assert((await page.locator('#join-error').textContent()).includes('INVALID CODE'));
  await page.locator('#room-code').fill('ABCDEF');await button.click();assert((await page.locator('#join-error').textContent()).includes('INVALID NICKNAME'));
  await page.locator('#nickname').evaluate(input=>input.value='x'.repeat(25));await button.click();assert((await page.locator('#join-error').textContent()).includes('INVALID NICKNAME'));
  await page.locator('#room-code').fill('');await page.locator('#nickname').fill('');await page.locator('#join-error').evaluate(e=>e.textContent='');
  for(const size of [{width:320,height:740},{width:390,height:844},{width:844,height:390},{width:1280,height:800}]){await page.setViewportSize(size);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:path.join(dir,`stage9-${kind}-join-${size.width}.png`),fullPage:true});}
  await page.setViewportSize({width:360,height:844});
  const missing=await page.evaluate(async()=>{const b=FinalAnswerButton.create({label:'MISSING ASSET',upImage:'/art/missing.png'});document.body.append(b);await new Promise(r=>setTimeout(r,250));const ok=b.classList.contains('fa-missing');b.remove();return ok;});assert(missing,'Missing image must preserve button label and semantics');
}
(async()=>{
const ready=JSON.parse(fs.readFileSync(path.join(dir,'ready.json')));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const clients=[],errors=[],sessions=new Set();let host;
try{
  host=await browser.newPage();await host.goto(ready.url);
  if(redesign){await inspectButtons(host,'desktop');for(const file of ['button_up.png','button_hover.png','button_pressed.png']){const response=await host.request.get(ready.url+'/art/ui/buttons/player_count/'+file);assert.equal(response.status(),200);assert.deepEqual(await response.body(),fs.readFileSync(path.resolve('assets/ui/buttons/player_count',file)));}assert.equal((await host.request.get(ready.url+'/art/server/RoomServer.java')).status(),404);}
  await host.evaluate(async credentials=>{await new Promise((resolve,reject)=>{const ws=new WebSocket(location.origin.replace('http','ws')+'/ws');window.__qaSocket=ws;ws.onopen=()=>ws.send(JSON.stringify({type:'AUTH',requestId:'host',payload:{roomCode:credentials.code,token:credentials.token}}));ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.type==='AUTHENTICATED')resolve();if(m.type==='ERROR')reject(Error(JSON.stringify(m)));};});},ready);
  for(let i=0;i<6;i++){
    const context=await browser.newContext({viewport:{width:360,height:844},isMobile:true,hasTouch:true,reducedMotion:polish&&i===5?'reduce':'no-preference'}),page=await context.newPage();
    await page.addInitScript(()=>{const Native=WebSocket;window.WebSocket=class extends Native{constructor(...args){super(...args);window.__qaSocket=this;}};});
    page.on('pageerror',e=>errors.push(e.message));await page.goto(ready.url);if(redesign&&i===0){await inspectButtons(page);await page.screenshot({path:path.join(dir,'stage9-join.png'),fullPage:true});}await page.locator('#room-code').fill(ready.code);await page.locator('#nickname').fill(i===1?'ОченьДлинныйНикИгрока':'Guest'+i);
    const joined=page.waitForResponse(r=>r.url().endsWith('/join')&&r.request().method()==='POST');await page.locator('#join-button').click();const credentials=await(await joined).json();await page.locator('#waiting-screen').waitFor({state:'visible'});clients.push({page,credentials});if(redesign&&i===0)await page.screenshot({path:path.join(dir,'stage9-waiting.png'),fullPage:true});
  }
  const state=async()=> (await wire(host,'SYNC')).payload;
  const action=async(type,extra={})=>{const s=await state();return wire(host,type,{roomCode:ready.code,sessionId:s.impostor?.sessionId||s.lobbyId,...extra});};
  const initial=await state();
  if(redesign){
    const configured={...initial.impostorSettings,soundEnabled:false};
    assert.equal((await action('UPDATE_IMPOSTOR_SETTINGS',{settings:configured})).type,'STATE');
    const rejected=await wire(clients[0].page,'UPDATE_IMPOSTOR_SETTINGS',{roomCode:ready.code,sessionId:(await state()).lobbyId,settings:configured});assert.equal(rejected.payload.code,'HOST_ONLY');
    for(const c of clients)assert.deepEqual((await wire(c.page,'SYNC')).payload.impostorSettings,configured);
  }
  for(let match=0;match<6;match++){
    const count=match<3?3:4;
    if(redesign&&match===3){const previous=await state();assert.equal((await action('UPDATE_IMPOSTOR_SETTINGS',{settings:{...previous.impostorSettings,roundCount:2,discussionSeconds:7,votingSeconds:9,clueSeconds:12,reducedMotion:true}})).type,'STATE');}
    const before=await state();
    const started=await action('START_IMPOSTOR',before.impostor?{}:{participantIds:clients.slice(0,count).map(c=>c.credentials.selfId)});assert.equal(started.type,'STATE');
    const s=await state(),id=s.impostor.sessionId,configuration=s.impostorSettings;assert.deepEqual(configuration,before.impostorSettings);assert(!sessions.has(id));sessions.add(id);
    assert.equal(s.code,initial.code);assert.equal(s.roomId,initial.roomId);assert.deepEqual(s.players,initial.players);
    for(const c of clients)await c.page.locator('#impostor-screen').waitFor({state:'visible'});
    const personalized=await Promise.all(clients.map(c=>wire(c.page,'SYNC')));if(process.env.PARCHMENT_QA==='1'){for(const value of personalized)assert.equal(value.payload.impostor.roleRevealDurationMillis,4000);}
    const actual=personalized.findIndex(e=>e.payload.impostor.role==='IMPOSTOR');assert(actual>=0&&actual<count);
    if(redesign)await clients[0].page.screenshot({path:path.join(dir,`stage9-role-${match+1}.png`),fullPage:true});
    assert(!s.impostor.result);assert.equal(s.impostor.revealedClues.length,0);
    for(let i=count;i<clients.length;i++)assert(!personalized[i].payload.impostor.role&&!personalized[i].payload.impostor.secretWord,'Spectator private data');
    assert(!s.impostor.role&&!s.impostor.secretWord,'Host private data');
    await advance(4000);
    if(polish){
      const phone=clients[0].page;await phone.locator('#clue-input').waitFor({state:'visible'});await phone.locator('#clue-input').fill('ЧЕРНОВИК');
      await phone.evaluate(()=>window.__qaSocket.close());
      await phone.locator('#disconnected-screen').waitFor({state:'visible'});
      await phone.locator('#impostor-screen').waitFor({state:'visible'});await phone.waitForFunction(()=>!document.getElementById('clue-input').disabled);
      assert.equal(await phone.locator('#clue-input').inputValue(),'ЧЕРНОВИК','Socket failure erased draft');
      assert.equal(await phone.evaluate(()=>document.body.dataset.cinematic),'false','Reconnect replayed phase animation');
    }
    if(redesign){await clients[0].page.locator('#clue-input').waitFor({state:'visible'});await clients[0].page.screenshot({path:path.join(dir,'stage9-clue.png'),fullPage:true});}
    for(let round=1;round<=configuration.roundCount;round++){
      for(let i=0;i<count;i++){
        if(process.env.PARCHMENT_QA==='1'){
          const phone=clients[i].page,clue=['СВЕТ','ЛУНА','ВЕТЕР'][round-1];
          await phone.locator('#clue-input').fill(clue);assert.equal(await phone.locator('.parchment-ink').textContent(),clue);
          await phone.locator('#clue-submit').click();
          await phone.waitForFunction(()=>document.getElementById('clue-form').hidden);
          if(i===0&&round===1)await phone.screenshot({path:path.join(dir,`parchment-confirmed-match-${match+1}.png`),fullPage:true});
        }else{const reply=await wire(clients[i].page,'SUBMIT_CLUE',{roomCode:ready.code,sessionId:id,round,clue:['СВЕТ','ЛУНА','ВЕТЕР'][round-1]});assert.equal(reply.type,'CLUE_ACCEPTED');}
      }
      await advance(500);await advance(5000);await advance(1);await advance(1850);
    }
    assert.equal((await state()).impostor.phase,'EVIDENCE_REVIEW');await advance(configuration.discussionSeconds*1000);
    for(const c of clients)await c.page.waitForFunction(()=>document.getElementById('final-title').textContent==='WHO IS THE IMPOSTOR?');
    if(redesign){await clients[0].page.waitForFunction(()=>getComputedStyle(document.getElementById('final-screen')).opacity==='1');await clients[0].page.screenshot({path:path.join(dir,'stage9-voting.png'),fullPage:true});assert.equal(await clients[0].page.locator('#confirm-vote').isDisabled(),true);}
    const unauthorized=await wire(clients[count].page,'REPLAY_IMPOSTOR',{roomCode:ready.code,sessionId:id});assert.equal(unauthorized.payload.code,'HOST_ONLY');
    const mode=match%3,target=mode===0?actual:(actual+1)%count;
    if(mode===2)await advance(configuration.votingSeconds*1000);
    else for(let i=0;i<count;i++){const suspect=i===target?(target+1)%count:target;await clients[i].page.locator(`#final-cards [data-id="${clients[suspect].credentials.selfId}"]`).click();if(redesign){assert.equal((await wire(clients[i].page,'SYNC')).payload.impostor.finalVoteSubmitted,false,'Selection must not submit vote');}await clients[i].page.locator("#confirm-vote").click();await wire(clients[i].page,'SYNC');}
    await advance(700);await advance(5000);await advance(3500);await advance(4000);
    const result=(await state()).impostor.result;assert.equal(result.outcome,['IMPOSTOR_CAUGHT','IMPOSTOR_ESCAPED','NO_CONSENSUS'][mode]);assert.equal(result.statistics.submittedClues,count*configuration.roundCount);assert.equal(result.participants.length,count);
    for(let i=0;i<clients.length;i++){
      const page=clients[i].page,personal=result.participants.find(p=>p.playerId===clients[i].credentials.selfId);
      await page.waitForFunction(()=>document.getElementById('final-title').textContent==='THE IMPOSTOR IS…');
      for(const id of ['final-personal','final-waiting-host','final-results','result-player','confirm-vote'])assert(await page.locator('#'+id).isHidden(),id+' must not appear after completion');
      assert.equal(await page.locator('#final-status').textContent(),'');
      assert.equal((await wire(page,'SYNC')).payload.impostor.completed,true);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
    await clients[0].page.reload();await clients[0].page.locator('#final-screen').waitFor({state:'visible'});assert.deepEqual((await wire(clients[0].page,'SYNC')).payload.impostor.result,result);
    await clients[0].page.waitForFunction(()=>getComputedStyle(document.getElementById('final-screen')).opacity==='1');
    assert(await clients[0].page.locator('#final-personal').isHidden(),'Reconnect must not show results');
    await clients[0].page.screenshot({path:path.join(dir,`${redesign?'stage9':polish?'stage8':'stage7'}-match-${match+1}.png`),fullPage:true});
    if(match===2||match===5){await action('IMPOSTOR_RETURN_TO_LOBBY');for(const c of clients)await c.page.locator('#waiting-screen').waitFor({state:'visible'});assert(!(await state()).impostor);}
    else{
      await action('REPLAY_IMPOSTOR');const reset=await state();assert.equal(reset.impostor.phase,'REPLAY_PREPARATION');assert(!reset.impostor.result);assert(!reset.impostor.role);
      const duplicate=await wire(host,'REPLAY_IMPOSTOR',{roomCode:ready.code,sessionId:id});assert.equal(duplicate.payload.code,'STALE_IMPOSTOR_SESSION');
      await clients[0].page.reload();await clients[0].page.locator('#waiting-screen').waitFor({state:'visible'});assert.equal((await wire(clients[0].page,'SYNC')).payload.impostor.phase,'REPLAY_PREPARATION');
    }
    console.log(`PASS match ${match+1}: ${count} active + ${6-count} spectators, ${result.outcome}`);
  }
  assert.deepEqual(errors,[]);const final=await state();assert.deepEqual(final.players,initial.players);assert.equal(final.code,initial.code);
  fs.writeFileSync(path.join(dir,redesign?'stage9-report.json':polish?'stage8-report.json':'stage7-report.json'),JSON.stringify({matches:6,roomPreserved:true,stableParticipants:6,browserErrors:errors,sessions:[...sessions]},null,2));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
